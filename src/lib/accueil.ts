import { and, desc, eq, isNull } from "drizzle-orm";
import { actualitesPubliees } from "./actualites-publiques";
import { classementPublic } from "./classement-base";
import { db } from "./db";
import { effectifDeLaSaison } from "./effectif-public";
import { manifeste } from "./porte-entree";
import { CLES_REGLAGE, lireReglage } from "./reglages";
import { episodes } from "./db/schema";
import { rencontresDeLaSaison } from "./rencontres";
import { derniersResultats, matchDuTableau } from "./resultats";
import { saisonCourante } from "./saisons";
import { etapesPubliees } from "./vitrine";

/**
 * Tout ce que l'accueil affiche, lu en une fois (fiche fiches/accueil.md).
 * Chaque bloc peut manquer : la page le fait alors disparaitre au lieu de
 * montrer une case vide ou une donnee perimee (principe 4 du plan).
 *
 * Seul le contenu publie sort d'ici : un brouillon ne doit jamais atteindre
 * une page publique (principe 6). Les partenaires viendront avec leur page.
 *
 * Les chapitres permanents (fiche fiches/accueil-porte-entree.md) se lisent
 * dans la meme passe : le manifeste, l'effectif de la saison, la chronologie.
 */

const NOMBRE_ETAPES = 3;

const NOMBRE_PRECEDENTS = 6;

async function dernierEpisode() {
  const [episode] = await db()
    .select()
    .from(episodes)
    .where(and(eq(episodes.etat, "publie"), isNull(episodes.supprimeLe)))
    .orderBy(desc(episodes.publieLe), desc(episodes.numero))
    .limit(1);
  return episode ?? null;
}

export async function donneesAccueil(maintenant = new Date()) {
  const [saison, episode, actualites, titre, texte, effectif, etapes] = await Promise.all([
    saisonCourante(),
    dernierEpisode(),
    actualitesPubliees(3),
    lireReglage(CLES_REGLAGE.manifesteTitre),
    lireReglage(CLES_REGLAGE.manifesteTexte),
    effectifDeLaSaison(null, maintenant),
    etapesPubliees(),
  ]);
  const [matchs, classement] = saison
    ? await Promise.all([rencontresDeLaSaison(saison.id), classementPublic(saison.id, maintenant)])
    : [[], null];

  const resultats = derniersResultats(matchs);
  return {
    // L'instant de reference de toute la page, lu une fois : le rendu reste
    // pur, et le compte a rebours part de la meme seconde que le reste.
    maintenant,
    saison: saison?.libelle ?? null,
    prochain: matchDuTableau(matchs, maintenant) ?? null,
    dernier: resultats[0] ?? null,
    precedents: resultats.slice(1, 1 + NOMBRE_PRECEDENTS),
    episode,
    actualites,
    manifeste: manifeste(titre, texte),
    equipe: { saison: effectif.saison?.libelle ?? null, membres: effectif.membres },
    // Les dernieres etapes du recit, dans l'ordre choisi dans l'administration.
    etapes: etapes.slice(-NOMBRE_ETAPES),
    etapesTotal: etapes.length,
    // Le rang de l'equipe, seulement si le classement est tenu (30 jours).
    rang: classement?.nous ? { rang: classement.nous.rang, total: classement.lignes.length, intitule: classement.intitule } : null,
  };
}
