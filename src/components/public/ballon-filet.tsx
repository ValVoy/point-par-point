"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { GRAND, PORTRAIT } from "./ballon-geometrie";
import { ajouterGeste, etatFinalGeste, preparerBallon, trouverElementsGeste } from "./ballon-geste";
import { RAYON_HALO, Scene } from "./ballon-scene";

/*
 * La scene du ballon, en bloc autonome : le geste (module ballon-geste.ts,
 * partage avec l'intro de l'accueil) se joue de lui-meme quand la scene est
 * entierement a l'ecran, et se rejoue si l'on remonte au-dessus puis qu'on
 * revient. Ce composant ne garde que ce qui lui est propre : le halo qui revele
 * le motif dans le sillage du ballon, et le tableau du prochain match qui
 * s'allume a l'impact en gresillant comme un neon.
 */

export function BallonFilet({ children }: { children: ReactNode }) {
  const racine = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        // La fonction ne s'execute que si au moins une condition est vraie : sans
        // « petit », un telephone sans mouvement reduit n'aurait jamais d'animation.
        {
          grand: "(min-width: 768px)",
          petit: "(max-width: 767.98px)",
          reduit: "(prefers-reduced-motion: reduce)",
        },
        (contexte) => {
          const { grand, reduit } = contexte.conditions as { grand: boolean; reduit: boolean };
          const section = racine.current;
          const variante = grand ? "grand" : "portrait";
          const g = grand ? GRAND : PORTRAIT;
          const scene = section?.querySelector<HTMLElement>(`[data-scene="${variante}"]`);
          const el = scene ? trouverElementsGeste(scene) : null;
          const halo = scene?.querySelector<HTMLElement>("[data-halo]");
          const haloMotif = scene?.querySelector<HTMLElement>("[data-halo-motif]");
          if (!section || !scene || !el || !halo || !haloMotif) return;

          const tableau = section.querySelector<HTMLElement>("[data-tableau]");
          const rayonHalo = RAYON_HALO[variante];
          // Unites SVG vers pixels d'ecran, recalcule si la scene change de taille.
          let echelle = scene.clientWidth / g.largeur;

          // Le halo : une fenetre ronde qui suit le ballon, avec le motif
          // contre-deplace dedans pour rester fixe sur le terrain.
          const haloX = gsap.quickSetter(halo, "x", "px");
          const haloY = gsap.quickSetter(halo, "y", "px");
          const motifX = gsap.quickSetter(haloMotif, "x", "px");
          const motifY = gsap.quickSetter(haloMotif, "y", "px");
          const placerHalo = (x: number, y: number) => {
            const gauche = x * echelle - rayonHalo;
            const haut = y * echelle - rayonHalo;
            haloX(gauche);
            haloY(haut);
            motifX(-gauche);
            motifY(-haut);
          };

          const ballon = preparerBallon(el, g, () => echelle, placerHalo);
          const mesurer = () => {
            echelle = scene.clientWidth / g.largeur;
            gsap.set(haloMotif, { width: scene.clientWidth, height: scene.clientHeight });
            ballon.replacer();
          };
          mesurer();
          const observateur = new ResizeObserver(mesurer);
          observateur.observe(scene);

          if (reduit) {
            etatFinalGeste(el);
            placerHalo(g.impact.x, g.impact.y);
            gsap.set(halo, { opacity: 0.6 });
            tableau?.style.setProperty("--allume", "1");
            return () => observateur.disconnect();
          }

          tableau?.style.setProperty("--allume", "0");
          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scene,
              // La scene doit etre entierement visible quand le geste part.
              start: "center 62%",
              // Joue a l'entree ; revient au depart si l'on remonte au-dessus.
              toggleActions: "play none none reset",
            },
          });

          tl.to(halo, { opacity: 1, duration: 0.3 }, 0);
          const { sol } = ajouterGeste(tl, el, g, ballon, 0.3);
          tl.addLabel("frappe", sol - 0.24).addLabel("sol", sol);
          if (tableau) {
            // Le neon qui s'allume : il hesite avant de tenir.
            tl.to(tableau, { keyframes: { "--allume": [0, 1, 0.25, 1, 0.55, 1] }, duration: 0.5 }, sol + 0.05);
          }
          tl.to(halo, { opacity: 0.6, duration: 0.8, ease: "power2.out" }, sol);

          return () => observateur.disconnect();
        },
      );
    },
    { scope: racine },
  );

  return (
    <section ref={racine} aria-label="Le prochain match" className="relative py-10 md:py-16">
      <p className="sr-only">
        Une attaque : la passe monte, l&apos;attaquant frappe, le ballon passe au-dessus du filet, touche le sol adverse et sort du terrain.
      </p>
      <div className="flex flex-col gap-6 md:gap-10">
        <div className="colonne-large">
          <div className="mx-auto w-full md:max-w-[calc(62svh*16/9)]">
            <Scene g={GRAND} variante="grand" />
            <Scene g={PORTRAIT} variante="portrait" />
          </div>
        </div>
        <div className="colonne-large">
          <div className="mx-auto max-w-3xl">{children}</div>
        </div>
      </div>
    </section>
  );
}
