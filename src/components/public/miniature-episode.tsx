"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { miniatureYoutube, miniatureYoutubeHD } from "@/lib/youtube";

/**
 * La vignette d'un episode, en haute definition quand YouTube en a une
 * (1280 pixels), sinon en 480 pixels, toujours presente. Elle passe par
 * l'optimiseur de Next, donc par notre serveur : le navigateur du visiteur ne
 * contacte pas YouTube. En niveaux de gris sur la nuit, elle retrouve ses
 * couleurs au survol comme au focus du lien ou du bouton qui la porte.
 */
export function MiniatureEpisode({
  youtubeId,
  sizes,
  prioritaire = false,
}: {
  youtubeId: string;
  sizes: string;
  prioritaire?: boolean;
}) {
  const [repli, setRepli] = useState(false);
  // Sur un ecran tactile, pas de survol : la couleur vient quand la vignette entre a
  // l'ecran (arbitrage du 02-10-2026, audit G29). A la souris, rien ne change.
  const image = useRef<HTMLImageElement>(null);
  const [enCouleur, setEnCouleur] = useState(false);
  useEffect(() => {
    const noeud = image.current;
    if (!noeud || !window.matchMedia("(hover: none)").matches) return;
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree?.isIntersecting) {
          setEnCouleur(true);
          observateur.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observateur.observe(noeud);
    return () => observateur.disconnect();
  }, []);
  return (
    <Image
      ref={image}
      src={repli ? miniatureYoutube(youtubeId) : miniatureYoutubeHD(youtubeId)}
      alt=""
      fill
      priority={prioritaire}
      sizes={sizes}
      onError={() => setRepli(true)}
      className={`object-cover ${enCouleur ? "grayscale-0" : "grayscale"} transition-[filter,scale] duration-[var(--duree-appuyee)] group-hover:scale-[1.02] group-hover:grayscale-0 group-focus-visible:grayscale-0`}
    />
  );
}
