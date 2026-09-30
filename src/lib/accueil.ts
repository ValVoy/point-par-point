import { and, desc, eq, isNull } from "drizzle-orm";
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
 * une page publique (principe 6). Les actualites et les partenaires viendront
 * avec leurs propres pages, pas avant.
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
  const [saison, episode] = await Promise.all([saisonCourante(), dernierEpisode()]);
  const matchs = saison ? await rencontresDeLaSaison(saison.id) : [];

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
  };
}

export type DonneesAccueil = Awaited<ReturnType<typeof donneesAccueil>>;
