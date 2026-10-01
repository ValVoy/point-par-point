import { exigerDroit } from "@/lib/auth/session-courante";
import { manifeste } from "@/lib/porte-entree";
import { CLES_REGLAGE, lireReglage } from "@/lib/reglages";
import { FormulaireManifeste } from "./formulaire-manifeste";

export const metadata = { title: "Le manifeste" };

/**
 * Le manifeste de l'accueil, « Qui on est » (fiche
 * fiches/accueil-porte-entree.md). Le formulaire montre le texte affiche
 * aujourd'hui, celui de depart tant que rien n'a ete saisi.
 */
export default async function PageManifeste() {
  await exigerDroit("gererProjet");
  const [titre, texte] = await Promise.all([
    lireReglage(CLES_REGLAGE.manifesteTitre),
    lireReglage(CLES_REGLAGE.manifesteTexte),
  ]);
  const affiche = manifeste(titre, texte);
  return (
    <section className="max-w-3xl">
      <p className="mb-6 max-w-prose text-sm text-[var(--color-craie-douce)]">
        Le premier texte de l&apos;accueil, juste après l&apos;intro : qui vous êtes, en quelques lignes. Court se lit
        mieux : un titre d&apos;une dizaine de mots, puis trois ou quatre phrases, d&apos;un seul paragraphe. Entourez un
        passage de doubles étoiles (<code>**la série**</code>) pour le mettre en turquoise. Un champ vidé reprend le
        texte de départ.
      </p>
      <FormulaireManifeste titre={affiche.titre} texte={affiche.texte} personnalise={titre !== null || texte !== null} />
    </section>
  );
}
