import Image from "next/image";
import { Motif } from "@/components/motif";
import type { Poste } from "@/lib/db/schema";

/**
 * Le portrait d'un joueur (fiche fiches/effectif.md), un traitement unique
 * quelle que soit la photo. Avec une photo : noir et blanc, un filet
 * turquoise en pied, les couleurs reelles au survol comme au focus ; pas
 * d'aplat teinte, que la variante « net » a abandonne. Sans photo : le numero
 * geant sur le motif du maillot, qui fait portrait. Sans numero non plus : le
 * sigle du poste. Le cadre ne reste jamais vide.
 */

const SIGLES: Record<Poste, string> = {
  passeur: "P",
  pointu: "Pt",
  central: "C",
  receptionneur: "R4",
  libero: "L",
  autre: "A",
};

export function PortraitJoueur({
  photo,
  numero,
  poste,
  sizes,
  format = "aspect-[4/5]",
  prioritaire = false,
  position = "50% 0%",
}: {
  photo: string | null;
  /** `object-position` de la photo : le point de visage place dans l'administration. */
  position?: string;
  numero: number | null;
  poste: Poste;
  sizes: string;
  format?: string;
  prioritaire?: boolean;
}) {
  return (
    <span className={`relative block overflow-hidden bg-[var(--color-nuit-surface)] ${format}`}>
      <span aria-hidden="true" className="absolute inset-0 opacity-30">
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
            style={{ objectPosition: position }}
            className="object-cover grayscale transition-[filter] duration-[var(--duree)] group-hover:grayscale-0 group-focus-visible:grayscale-0"
          />
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-[var(--color-turquoise)]" />
        </>
      ) : (
        <span
          aria-hidden="true"
          className="titre-affiche absolute inset-0 grid place-items-center text-[clamp(4.5rem,11vw,8rem)] text-[var(--color-craie)]/90 transition-colors duration-[var(--duree)] group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)]"
        >
          {numero ?? SIGLES[poste]}
        </span>
      )}
    </span>
  );
}
