"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Le mouvement de l'accueil sous l'ouverture (fiche fiches/accueil.md). Deux
 * gestes, et pas un de plus : chaque bloc marque `data-revele` monte une fois
 * en entrant dans l'ecran, et chaque tableau marque `data-allume` s'allume
 * quand on arrive devant, avec un seul scintillement, comme un vrai tableau
 * qu'on met sous tension. Rien ne bouge pendant la lecture.
 *
 * Sous `prefers-reduced-motion`, rien ne s'execute : les blocs sont la, les
 * tableaux allumes (leur valeur par defaut de `--allume` est 1).
 */
export function Revelations({ children }: { children: ReactNode }) {
  const racine = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        for (const bloc of gsap.utils.toArray<HTMLElement>("[data-revele]")) {
          gsap.from(bloc, {
            autoAlpha: 0,
            y: 48,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: bloc, start: "top 85%", once: true },
          });
        }

        for (const tableau of gsap.utils.toArray<HTMLElement>("[data-allume]")) {
          gsap.set(tableau, { "--allume": 0 });
          gsap
            .timeline({ scrollTrigger: { trigger: tableau, start: "top 75%", once: true }, delay: 0.25 })
            .to(tableau, { "--allume": 1, duration: 0.05, ease: "none" })
            .to(tableau, { "--allume": 0.35, duration: 0.06, ease: "none" })
            .to(tableau, { "--allume": 1, duration: 0.12, ease: "none" });
        }
      });
    },
    { scope: racine },
  );

  return <div ref={racine}>{children}</div>;
}
