"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Le volet en triangle (fiche fiches/refonte-respiration.md) : chaque element
 * marque `data-volet` se decouvre en biais, une fois, quand il entre dans
 * l'ecran, comme un pan du motif du maillot qui se retourne. Le bord du volet
 * est oblique : le haut part en avance sur le bas.
 *
 * Rendu serveur deja final : sous `prefers-reduced-motion`, ou sans
 * JavaScript, rien n'est masque. Un element deja a l'ecran a l'arrivee n'est
 * pas rejoue : il clignoterait, montre puis cache puis decouvert (critique du
 * 01-10-2026), et c'est souvent l'image principale. Un element atteint au
 * clavier avant d'avoir ete decouvert se montre aussitot.
 *
 * Exception assumee a la regle « transform et opacity seulement » : le volet
 * anime un clip-path, une fois, 500 ms, puis le retire.
 */

const CACHE = "polygon(0% 0%, 0% 0%, -18% 100%, 0% 100%)";
const OUVERT = "polygon(0% 0%, 118% 0%, 100% 100%, 0% 100%)";

export function Volets({ children }: { children: ReactNode }) {
  const racine = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const noeud = racine.current;
        if (!noeud) return;
        const volets = new Map<Element, gsap.core.Tween>();
        for (const element of gsap.utils.toArray<HTMLElement>("[data-volet]", noeud)) {
          if (ScrollTrigger.isInViewport(element)) continue;
          volets.set(
            element,
            gsap.fromTo(
              element,
              { clipPath: CACHE },
              {
                clipPath: OUVERT,
                duration: 0.5,
                ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 88%", once: true },
                // Le volet ouvert, plus de decoupe : rien ne rogne un focus ou une ombre.
                onComplete: () => gsap.set(element, { clearProps: "clipPath" }),
              },
            ),
          );
        }

        const auFocus = (evenement: FocusEvent) => {
          const cible = evenement.target as Element | null;
          for (const [element, volet] of volets) {
            if (volet.progress() < 1 && cible && (element.contains(cible) || cible.contains(element))) {
              volet.scrollTrigger?.kill(false, true);
              volet.progress(1);
            }
          }
        };
        noeud.addEventListener("focusin", auFocus);
        return () => noeud.removeEventListener("focusin", auFocus);
      });
    },
    { scope: racine },
  );

  return <div ref={racine}>{children}</div>;
}
