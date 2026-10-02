"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Le mouvement de l'accueil sous l'ouverture (fiche fiches/accueil.md). Deux
 * gestes, et pas un de plus : chaque bloc marque `data-apparait` monte une fois
 * en entrant dans l'ecran, et chaque tableau marque `data-allume` s'allume
 * quand on arrive devant, avec un seul scintillement, comme un vrai tableau
 * qu'on met sous tension. Rien ne bouge pendant la lecture.
 *
 * La revelation ne touche que l'opacite et la position, jamais la visibilite :
 * un bloc pas encore revele reste dans l'arbre d'accessibilite et joignable
 * au clavier (critique du 30-09-2026). Et s'il recoit le focus avant d'avoir
 * ete atteint au defilement, il se revele aussitot.
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
        const noeud = racine.current;
        if (!noeud) return;
        const revelations = new Map<Element, gsap.core.Tween>();
        for (const bloc of gsap.utils.toArray<HTMLElement>("[data-apparait]", noeud)) {
          revelations.set(
            bloc,
            // Montee courte et douce, lancee des que le bloc entre par le bas (retour de
            // l'utilisateur du 02-10-2026) : 48 px en expo.out, declenches a 85 %, se
            // faisaient en un dixieme de seconde, et a la molette le bloc sautait.
            gsap.from(bloc, {
              opacity: 0,
              y: 24,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: bloc, start: "top 100%", once: true },
            }),
          );
        }

        const auFocus = (evenement: FocusEvent) => {
          const bloc = (evenement.target as Element | null)?.closest("[data-apparait]");
          const revelation = bloc ? revelations.get(bloc) : undefined;
          if (revelation && revelation.progress() < 1) {
            // kill(false, true) : on retire le declencheur sans tuer
            // l'animation, qu'on amene ensuite a son etat final.
            revelation.scrollTrigger?.kill(false, true);
            revelation.progress(1);
          }
        };
        noeud.addEventListener("focusin", auFocus);

        for (const tableau of gsap.utils.toArray<HTMLElement>("[data-allume]", noeud)) {
          // En veilleuse plutot qu'eteint, et un gresillement plus court (audit du 02-10-2026,
          // U34) : de 0 a 1 en 50 ms puis a 0,35, pendant la montee du bloc, se lisait comme
          // un sursaut au defilement.
          gsap.set(tableau, { "--allume": 0.35 });
          gsap
            .timeline({ scrollTrigger: { trigger: tableau, start: "top 80%", once: true } })
            .to(tableau, { "--allume": 1, duration: 0.18, ease: "power1.out" })
            .to(tableau, { "--allume": 0.75, duration: 0.07, ease: "none" })
            .to(tableau, { "--allume": 1, duration: 0.2, ease: "power1.out" });
        }

        return () => noeud.removeEventListener("focusin", auFocus);
      });
    },
    { scope: racine },
  );

  return <div ref={racine}>{children}</div>;
}
