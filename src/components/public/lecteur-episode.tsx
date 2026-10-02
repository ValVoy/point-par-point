"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * La facade du dernier episode (fiche fiches/accueil.md) : tant que personne
 * n'a clique, la page ne montre qu'une miniature servie par notre serveur.
 * Aucun appel du navigateur vers YouTube, aucun cookie tiers, aucun poids. Au
 * clic, et seulement la, le lecteur youtube-nocookie remplace la miniature et
 * demarre.
 *
 * La miniature arrive en `children`, rendue cote serveur par next/image.
 */
export function LecteurEpisode({
  youtubeId,
  titre,
  children,
}: {
  youtubeId: string;
  titre: string;
  children: ReactNode;
}) {
  const [lance, setLance] = useState(false);
  const lecteur = useRef<HTMLIFrameElement>(null);

  // Le bouton disparait au profit du lecteur : le focus le suit, sans quoi il
  // retomberait au debut de la page pour qui navigue au clavier.
  useEffect(() => {
    if (lance) lecteur.current?.focus();
  }, [lance]);

  if (lance) {
    return (
      <iframe
        ref={lecteur}
        className="absolute inset-0 size-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={titre}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLance(true)}
      className="group absolute inset-0 size-full cursor-pointer focus-visible:outline-none"
      aria-label={`Lire l'épisode : ${titre} (la vidéo se charge depuis YouTube)`}
    >
      {children}
      {/* Dit avant le clic ce que le clic charge (audit R11) : rien ne part vers
          YouTube tant qu'on n'a pas choisi de lire. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 bottom-2 z-10 bg-[var(--color-boitier)]/80 px-2 py-1 text-[0.8125rem] text-[var(--color-craie-douce)]"
      >
        Lecture via YouTube
      </span>
      {/* Le cadre de focus, sur un calque au-dessus de la vignette : un contour
          du bouton serait peint sous elle, puisqu'elle est positionnee, et le
          cadre parent le rognerait vers l'exterieur. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 border-4 border-transparent group-focus-visible:border-[var(--color-jaune)]"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center bg-[var(--color-jaune)] text-[var(--color-nuit)] transition-transform duration-[var(--duree-breve)] group-hover:scale-110 sm:size-20"
      >
        <svg viewBox="0 0 24 24" className="ml-1 size-7 sm:size-8" fill="currentColor">
          <path d="M6 4l14 8-14 8z" />
        </svg>
      </span>
    </button>
  );
}
