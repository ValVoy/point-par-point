import Image from "next/image";
import { Motif } from "@/components/motif";

/**
 * Une image de contenu, ou le motif du maillot quand Tom n'en a pas encore mis
 * (fiche refonte, section 8) : jamais de case vide, jamais d'image cassee. Le
 * cadre (proportion, taille) appartient a l'appelant, par `className`.
 */
export function ImageOuMotif({
  src,
  sizes,
  prioritaire = false,
  className = "",
  survol = false,
}: {
  src: string | null;
  sizes: string;
  prioritaire?: boolean;
  className?: string;
  /** Leger zoom au survol d'un lien parent `group`. */
  survol?: boolean;
}) {
  return (
    <span className={`couche-propre relative block overflow-hidden bg-[var(--color-nuit-surface)] ${className}`}>
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          priority={prioritaire}
          sizes={sizes}
          className={`object-cover ${survol ? "transition-[scale] duration-[var(--duree-appuyee)] group-hover:scale-[1.02]" : ""}`}
        />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 opacity-30">
          <Motif contour sombre="var(--color-turquoise)" taille={28} />
        </span>
      )}
    </span>
  );
}
