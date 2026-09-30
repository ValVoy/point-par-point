import { and, desc, eq, isNull } from "drizzle-orm";
import { actualitesPubliees } from "./actualites-publiques";
import { classementPublic } from "./classement-base";
import { db } from "./db";
import { episodes } from "./db/schema";
import { rencontresDeLaSaison } from "./rencontres";
import { derniersResultats, matchDuTableau } from "./resultats";
import { saisonCourante } from "./saisons";

/**
 * Tout ce que l'accueil affiche, lu en une fois (fiche fiches/accueil.md).
 * Chaque bloc peut manquer : la page le fait alors disparaitre au lieu de
 * montrer une case vide ou une donnee perimee (principe 4 du plan).
 *
 * Seul le contenu publie sort d'ici : un brouillon ne doit jamais atteindre
 * une page publique (principe 6). Les partenaires viendront avec leur page.
 */

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
  const [saison, episode, actualites] = await Promise.all([saisonCourante(), dernierEpisode(), actualitesPubliees(3)]);
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
    // Le rang de l'equipe, seulement si le classement est tenu (30 jours).
    rang: classement?.nous ? { rang: classement.nous.rang, total: classement.lignes.length, intitule: classement.intitule } : null,
  };
}

export type DonneesAccueil = Awaited<ReturnType<typeof donneesAccueil>>;
