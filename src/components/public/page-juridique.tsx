import { PiedDePage } from "./accueil/pied-de-page";
import { EnTete } from "./entete";

/**
 * Le gabarit des deux pages juridiques (fiche fiches/juridique.md) : un titre
 * d'affiche, la date de mise a jour, puis une colonne de lecture. Aucun
 * mouvement : on vient ici pour lire, souvent pour verifier.
 */
export function PageJuridique({
  surtitre,
  titre,
  misAJour,
  children,
}: {
  surtitre: string;
  titre: string;
  misAJour: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <EnTete />
      {/* Au corps des chapitres, pas du titre de page : on vient lire, souvent verifier, et
          « Confidentialite » ne tiendrait pas a 189 px (fiche refonte, section 8). */}
      <main id="contenu" className="colonne-large min-h-[70svh] pt-16 pb-[var(--air-chapitre)] sm:pt-24">
        <p className="etiquette text-[var(--color-turquoise)]">{surtitre}</p>
        <h1 className="titre-affiche titre-chapitre mt-4 text-balance">{titre}</h1>
        <p className="etiquette mt-4 text-[var(--color-craie-tenue)]">Mis à jour le {misAJour}</p>
        <div className="texte-article suite">{children}</div>
      </main>
      <PiedDePage />
    </>
  );
}
