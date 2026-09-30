import { evenementAgenda } from "@/lib/agenda";
import { rencontreParSlug } from "@/lib/rencontres";
import { EQUIPE } from "@/lib/site";
import { FORME_SLUG } from "@/lib/slug";

/**
 * Le fichier d'agenda d'un match a venir, pour le bouton « Ajouter a
 * l'agenda » (fiche fiches/accueil.md). Point d'entree public, en lecture
 * seule : le slug est verifie avant toute requete, et seul un match a venir,
 * hors corbeille, produit un fichier. Tout le reste repond 404, sans dire
 * pourquoi.
 */

// Meme forme que les slugs produits par lib/slug.ts : minuscules, chiffres,
// tirets. Rien d'autre n'atteint la base ni l'en-tete du fichier.

function introuvable() {
  return new Response("Match introuvable.", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function GET(_requete: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!FORME_SLUG.test(slug)) return introuvable();

  const rencontre = await rencontreParSlug(slug);
  const maintenant = new Date();
  if (!rencontre || rencontre.etat !== "a_venir" || rencontre.joueLe.getTime() < maintenant.getTime()) {
    return introuvable();
  }

  const titre = rencontre.aDomicile
    ? `${EQUIPE} - ${rencontre.adversaire}`
    : `${rencontre.adversaire} - ${EQUIPE}`;
  const lieu = [rencontre.salleNom, rencontre.salleAdresse].filter(Boolean).join(", ");
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  const ics = evenementAgenda({
    uid: `match-${rencontre.id}@point-par-point`,
    debut: rencontre.joueLe,
    titre,
    lieu: lieu || null,
    description: rencontre.competition ?? null,
    // La page du match, pas l'accueil (audit T6).
    url: site ? new URL(`/matchs/${rencontre.slug}`, site).toString() : null,
    horodatage: maintenant,
  });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="match-${slug}.ics"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
