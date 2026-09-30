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
      <main id="contenu" className="colonne-large pt-16 pb-24 sm:pt-24">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">{surtitre}</p>
        <h1 className="titre-affiche mt-3 hyphens-auto text-5xl text-balance break-words sm:text-8xl">{titre}</h1>
        <p className="mt-4 text-sm text-[var(--color-craie-tenue)]">Mis à jour le {misAJour}</p>
        <div className="texte-article mt-10">{children}</div>
      </main>
      <PiedDePage />
    </>
  );
}
