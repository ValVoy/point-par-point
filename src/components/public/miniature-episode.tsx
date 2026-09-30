"use client";

import Image from "next/image";
import { useState } from "react";
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
  return (
    <Image
      src={repli ? miniatureYoutube(youtubeId) : miniatureYoutubeHD(youtubeId)}
      alt=""
      fill
      priority={prioritaire}
      sizes={sizes}
      onError={() => setRepli(true)}
      className="object-cover grayscale transition-[filter,scale] duration-[var(--duree-appuyee)] group-hover:scale-[1.02] group-hover:grayscale-0 group-focus-visible:grayscale-0"
    />
  );
}
