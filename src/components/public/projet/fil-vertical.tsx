"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Le fil de la page Le projet (fiche refonte, section 8) : un trait turquoise
 * qui se trace de haut en bas au rythme du defilement. Il n'assombrit jamais
 * le texte, contrairement au fil de l'accueil : ici, on vient lire. Sous
 * mouvement reduit, ou sans JavaScript, le fil est trace d'emblee.
 */
export function FilVertical({ children }: { children: ReactNode }) {
  const racine = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fil = racine.current?.querySelector<HTMLElement>("[data-fil-vertical]");
        if (!fil) return;
        gsap.fromTo(
          fil,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: racine.current, start: "top 75%", end: "bottom 60%", scrub: 0.5 },
          },
        );
      });
    },
    { scope: racine },
  );

  return (
    <div ref={racine} className="relative">
      <span
        aria-hidden="true"
        data-fil-vertical
        className="absolute top-2 bottom-2 left-[5px] w-0.5 origin-top bg-[var(--color-turquoise)]"
      />
      {children}
    </div>
  );
}
