import Image from "next/image";
import { Motif } from "@/components/motif";
import type { Poste } from "@/lib/db/schema";
import { LIBELLES_POSTE } from "@/lib/postes";

/**
 * Le portrait d'un joueur (fiche fiches/effectif.md), un traitement unique
 * quelle que soit la photo. Avec une photo : niveaux de gris, puis la couleur
 * de l'equipe posee en surimpression, les couleurs reelles au survol. Sans
 * photo : le numero geant sur le motif du maillot, qui fait portrait. Sans
 * numero non plus : le poste. Le cadre ne reste jamais vide.
 */
export function PortraitJoueur({
  photo,
  numero,
  poste,
  sizes,
  prioritaire = false,
}: {
  photo: string | null;
  numero: number | null;
  poste: Poste;
  sizes: string;
  prioritaire?: boolean;
}) {
  return (
    <span className="relative block aspect-[4/5] overflow-hidden bg-[var(--color-nuit-surface)]">
      <span aria-hidden="true" className="absolute inset-0 opacity-[0.16]">
        <Motif contour sombre="var(--color-turquoise)" taille={26} />
      </span>
      {photo ? (
        <>
          <Image
            src={photo}
            alt=""
            fill
            priority={prioritaire}
            sizes={sizes}
            className="object-cover object-top grayscale transition-[filter] duration-[var(--duree)] group-hover:grayscale-0 group-focus-visible:grayscale-0"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[var(--color-turquoise)] mix-blend-color transition-opacity duration-[var(--duree)] group-hover:opacity-0 group-focus-visible:opacity-0"
          />
        </>
      ) : (
        <span
          aria-hidden="true"
          className="titre-affiche absolute inset-0 grid place-items-center text-[clamp(5rem,14vw,9rem)] text-[var(--color-craie)]/90 transition-colors duration-[var(--duree)] group-hover:text-[var(--color-jaune)]"
        >
          {numero ?? LIBELLES_POSTE[poste].slice(0, 3)}
        </span>
      )}
    </span>
  );
}
