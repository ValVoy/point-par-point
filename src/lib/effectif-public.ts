import { cache } from "react";
import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import { effectifs, feuillesRencontre, joueurs, rencontres, saisons } from "./db/schema";
import { saisonsActives } from "./saisons";
import { cleValide, modeStockage } from "./stockage";

/**
 * Lectures publiques de l'effectif (fiche fiches/effectif.md). Seuls les
 * joueurs actifs, hors corbeille, et inscrits dans l'effectif de la saison
 * en sortent. Aucune statistique ici : la grille ne compare jamais les
 * joueurs entre eux (principe 1 du plan).
 */

// Meme forme que les slugs produits par lib/slug.ts : rien d'autre n'atteint la base.
const FORME_SLUG = /^[a-z0-9-]{1,120}$/;

/**
 * L'adresse publique d'une photo du bucket R2, ou null tant que le bucket
 * n'est pas configure ou que le joueur n'a pas de photo. La cle vient de la
 * base, jamais du visiteur.
 */
export function urlPhoto(cle: string | null): string | null {
  if (!cle) return null;
  const domaine = process.env.R2_DOMAINE_PUBLIC;
  const chemin = cle.split("/").map(encodeURIComponent).join("/");
  if (domaine) return new URL(chemin, domaine.endsWith("/") ? domaine : `${domaine}/`).toString();
  // Developpement sans R2 : les photos envoyees vivent dans .stockage-local.
  return modeStockage() === "local" && cleValide(cle) ? `/fichiers-locaux/${chemin}` : null;
}

const colonnesMembre = {
  id: joueurs.id,
  slug: joueurs.slug,
  prenom: joueurs.prenom,
  nom: joueurs.nom,
  neLe: joueurs.neLe,
  tailleCm: joueurs.tailleCm,
  photoCle: joueurs.photoCle,
  numero: effectifs.numero,
  poste: effectifs.poste,
  capitaine: effectifs.capitaine,
};

/** L'effectif d'une saison designee par son libelle, sinon la courante, sinon la plus recente. */
export async function effectifDeLaSaison(libelle?: string | null, maintenant = new Date()) {
  const liste = await saisonsActives();
  const saison =
    (libelle ? liste.find((s) => s.libelle === libelle) : undefined) ??
    liste.find((s) => s.courante) ??
    liste[0] ??
    null;
  const membres = saison
    ? await db()
        .select(colonnesMembre)
        .from(effectifs)
        .innerJoin(joueurs, eq(effectifs.joueurId, joueurs.id))
        .where(
          and(
            eq(effectifs.saisonId, saison.id),
            isNull(effectifs.supprimeLe),
            isNull(joueurs.supprimeLe),
            eq(joueurs.actif, true),
          ),
        )
    : [];
  return { maintenant, saison, saisons: liste, membres };
}

/**
 * Un joueur par son adresse, avec sa ligne d'effectif de la saison la plus
 * recente ou il figure, et les matchs de la saison ou il etait present.
 * Mis en cache le temps d'une requete : la page et ses metadonnees le lisent.
 */
export const joueurPublic = cache(async (slug: string) => {
  if (!FORME_SLUG.test(slug)) return null;
  const [joueur] = await db()
    .select()
    .from(joueurs)
    .where(and(eq(joueurs.slug, slug), isNull(joueurs.supprimeLe), eq(joueurs.actif, true)))
    .limit(1);
  if (!joueur) return null;

  const lignes = await db()
    .select({ numero: effectifs.numero, poste: effectifs.poste, capitaine: effectifs.capitaine, saison: saisons })
    .from(effectifs)
    .innerJoin(saisons, eq(effectifs.saisonId, saisons.id))
    .where(and(eq(effectifs.joueurId, joueur.id), isNull(effectifs.supprimeLe), isNull(saisons.supprimeLe)));
  // La saison courante d'abord, sinon la plus recente.
  const effectif =
    lignes.find((l) => l.saison.courante) ??
    [...lignes].sort((a, b) => (b.saison.debuteLe?.getTime() ?? 0) - (a.saison.debuteLe?.getTime() ?? 0))[0] ??
    null;
  if (!effectif) return null;

  const matchs = await db()
    .select({
      slug: rencontres.slug,
      adversaire: rencontres.adversaire,
      aDomicile: rencontres.aDomicile,
      joueLe: rencontres.joueLe,
      etat: rencontres.etat,
      setsNous: rencontres.setsNous,
      setsEux: rencontres.setsEux,
    })
    .from(feuillesRencontre)
    .innerJoin(rencontres, eq(feuillesRencontre.rencontreId, rencontres.id))
    .where(
      and(
        eq(feuillesRencontre.joueurId, joueur.id),
        eq(feuillesRencontre.present, true),
        eq(rencontres.saisonId, effectif.saison.id),
        isNull(rencontres.supprimeLe),
      ),
    )
    .orderBy(asc(rencontres.joueLe));

  return { maintenant: new Date(), joueur, effectif, matchs };
});
