"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { GRAND, PORTRAIT } from "./ballon-geometrie";
import { Scene } from "./ballon-scene";

/*
 * La scene signature : une attaque, passe tendue puis smash par-dessus le
 * filet. Elle se joue d'elle-meme quand elle entre a l'ecran, en moins de deux
 * secondes, et se rejoue si l'on remonte au-dessus puis qu'on revient (retour
 * de l'utilisateur du 29-09-2026 : « quand on scrolle, bam, tout se
 * declenche »). Plus d'epinglage : la page defile normalement.
 *
 * Les deux impacts se ressentent : a la frappe, le ballon s'ecrase, un eclat
 * part en etoile et la scene tremble ; au sol, ecrasement, ondes, secousse plus
 * forte, et le tableau du prochain match s'allume en gresillant comme un neon.
 * Puis le ballon rebondit et sort du champ.
 *
 * Regles tenues : transform et opacite pour ce qui bouge ; etat final propre
 * si le mouvement est reduit ; le sens de la scene existe en texte.
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
          const g = grand ? GRAND : PORTRAIT;
          const scene = section?.querySelector<HTMLElement>(`[data-scene="${grand ? "grand" : "portrait"}"]`);
          if (!section || !scene) return;

          const un = <T extends Element>(selecteur: string) => scene.querySelector<T>(selecteur);
          const reveles = [...scene.querySelectorAll<SVGPathElement>("[data-revele]")];
          const ondes = [...scene.querySelectorAll<SVGEllipseElement>("[data-ondes] ellipse")];
          const ballon = un<SVGGElement>("[data-ballon]");
          const ecrasement = un<SVGGElement>("[data-ecrasement]");
          const ecrasementSol = un<SVGGElement>("[data-ecrasement-sol]");
          const rotation = un<SVGGElement>("[data-rotation]");
          const rebond = un<SVGPathElement>("[data-rebond]");
          const halo = un<HTMLElement>("[data-halo]");
          const toile = un<SVGSVGElement>("[data-toile]");
          const eclat = un<SVGGElement>('[data-eclat="frappe"]');
          const sol = un<SVGLineElement>("[data-sol]");
          const point = un<SVGTextElement>("[data-point]");
          const tableau = section.querySelector<HTMLElement>("[data-tableau]");
          if (!ballon || !ecrasement || !ecrasementSol || !rotation || !rebond || !halo || !toile || !eclat || !sol || !point) return;
          if (reveles.length !== 3) return;

          const rayonHalo = grand ? 220 : 160;
          const { impact, frappe } = g;

          const placer = (x: number, y: number, parcouru: number, suivreHalo = true) => {
            gsap.set(ballon, { x, y });
            gsap.set(rotation, { rotation: parcouru * 0.7, transformOrigin: "50% 50%" });
            if (!suivreHalo) return;
            halo.style.setProperty("--hx", `${(x / g.largeur) * 100}%`);
            halo.style.setProperty("--hy", `${(y / g.hauteur) * 100}%`);
          };

          // Mouvement reduit : le schema complet, le ballon deja sorti du champ,
          // le tableau allume. Rien ne bouge.
          if (reduit) {
            gsap.set(reveles, { strokeDashoffset: 0 });
            gsap.set(ballon, { opacity: 0 });
            gsap.set(point, { opacity: 1 });
            placer(impact.x, impact.y, 0);
            halo.style.setProperty("--hr", `${rayonHalo * 0.6}px`);
            tableau?.style.setProperty("--allume", "1");
            return;
          }

          tableau?.style.setProperty("--allume", "0");
          placer(g.depart.x, g.depart.y, 0);

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scene,
              // La scene doit etre entierement visible quand le geste part.
              start: "center 62%",
              // Joue a l'entree ; revient au depart si l'on remonte au-dessus,
              // pour se rejouer a la prochaine entree.
              toggleActions: "play none none reset",
            },
          });

          // Un temps du geste : le ballon suit un trace, qui se dessine derriere lui.
          let parcouru = 0;
          // Sans position, il s'enchaine a la fin ; avec, il part a l'instant donne
          // (les effets d'une frappe ne doivent pas retarder le geste suivant).
          const temps = (
            trace: SVGPathElement,
            duree: number,
            ease: string,
            options: { dessine?: boolean; halo?: boolean; position?: string } = {},
          ) => {
            const longueur = trace.getTotalLength();
            const avant = parcouru;
            parcouru += longueur;
            const curseur = { t: 0 };
            tl.to(
              curseur,
              {
                t: 1,
                duration: duree,
                ease,
                onUpdate() {
                  const p = trace.getPointAtLength(curseur.t * longueur);
                  placer(p.x, p.y, avant + curseur.t * longueur, options.halo ?? true);
                },
              },
              options.position,
            );
            if (options.dessine ?? true) tl.to(trace, { strokeDashoffset: 0, duration: duree, ease }, "<");
          };

          const secousse = (amplitude: number, duree: number) =>
            gsap.to(toile, {
              keyframes: { x: [0, -amplitude, amplitude * 0.8, -amplitude * 0.45, amplitude * 0.2, 0] },
              duration: duree,
              ease: "none",
            });

          tl.to(halo, { "--hr": `${rayonHalo}px`, duration: 0.3 }, 0);

          // 1. La passe, tendue, qui ralentit au sommet, puis retombe vers l'attaquant.
          temps(reveles[0]!, 0.5, "power2.out");
          temps(reveles[1]!, 0.16, "power1.in");

          // 2. La frappe : ecrasement, eclat en etoile, la scene tremble.
          tl.addLabel("frappe");
          gsap.set(ecrasement, { transformOrigin: "50% 50%" });
          gsap.set(ecrasementSol, { transformOrigin: "50% 100%" });
          tl.to(ecrasement, { scaleX: 1.35, scaleY: 0.72, duration: 0.05 }, "frappe");
          // L'elastique doit finir avant l'impact au sol (frappe + 0,24).
          tl.to(ecrasement, { scaleX: 1, scaleY: 1, duration: 0.17, ease: "elastic.out(1, 0.4)" }, "frappe+=0.05");
          tl.fromTo(
            eclat,
            { opacity: 1, scale: 0.6, svgOrigin: `${frappe.x} ${frappe.y}` },
            { opacity: 0, scale: 1.7, duration: 0.32, ease: "power2.out" },
            "frappe",
          );
          tl.add(secousse(5, 0.2), "frappe");

          // 3. Le smash, foudroyant, qui part pendant que la frappe resonne encore.
          temps(reveles[2]!, 0.2, "power3.in", { position: "frappe+=0.04" });

          // 4. L'impact au sol : ecrasement, ondes, secousse, le sol s'eclaire.
          tl.addLabel("sol", "frappe+=0.24");
          tl.to(ecrasementSol, { scaleX: 1.45, scaleY: 0.6, duration: 0.05 }, "sol");
          tl.fromTo(
            ondes,
            { attr: { rx: 0, ry: 0 }, opacity: 1 },
            { attr: { rx: g.rayon * 9, ry: g.rayon * 1.3 }, opacity: 0, duration: 0.65, stagger: 0.08, ease: "power2.out" },
            "sol",
          );
          tl.add(secousse(9, 0.32), "sol");
          tl.fromTo(sol, { attr: { "stroke-opacity": 1 } }, { attr: { "stroke-opacity": 0.35 }, duration: 0.5 }, "sol");
          tl.fromTo(point, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, "sol+=0.05");
          if (tableau) {
            // Le neon qui s'allume : il hesite avant de tenir.
            tl.to(tableau, { keyframes: { "--allume": [0, 1, 0.25, 1, 0.55, 1] }, duration: 0.5 }, "sol+=0.05");
          }
          tl.to(halo, { "--hr": `${rayonHalo * 0.6}px`, duration: 0.8, ease: "power2.out" }, "sol");

          // 5. Le rebond, qui sort du champ ; le halo reste sur le point marque.
          tl.to(ecrasementSol, { scaleX: 0.9, scaleY: 1.12, duration: 0.08 }, "sol+=0.05");
          tl.to(ecrasementSol, { scaleX: 1, scaleY: 1, duration: 0.2 }, "sol+=0.13");
          temps(rebond, 0.7, "power1.inOut", { dessine: false, halo: false, position: "sol+=0.05" });
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
