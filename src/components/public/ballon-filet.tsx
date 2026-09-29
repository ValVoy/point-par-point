"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { GRAND, PORTRAIT } from "./ballon-geometrie";
import { RAYON_HALO, Scene } from "./ballon-scene";

/*
 * La scene signature : une attaque, passe tendue puis smash par-dessus le
 * filet. Elle se joue d'elle-meme quand elle est entierement a l'ecran, en
 * moins de deux secondes, et se rejoue si l'on remonte au-dessus puis qu'on
 * revient (retours de l'utilisateur du 29-09-2026).
 *
 * Les deux impacts se ressentent : a la frappe, le ballon s'ecrase, un eclat
 * part en etoile et la scene tremble ; pendant le smash il s'etire dans le
 * sens de sa course ; au sol, ecrasement, ondes, secousse plus forte, et le
 * tableau du prochain match s'allume en gresillant comme un neon. Puis le
 * ballon rebondit et sort du champ.
 *
 * Fluidite : tout ce qui bouge a chaque image (ballon, halo, secousse) est un
 * calque HTML deplace par transform, avec des setters rapides de GSAP. Les
 * effets de frappe et d'impact ne s'appliquent qu'a leur instant
 * (immediateRender a false : sinon fromTo pose son etat de depart des la
 * construction, et l'eclat attendait, visible, avant la frappe).
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
          if (!section || !scene) return;

          const un = <T extends Element>(selecteur: string) => scene.querySelector<T>(selecteur);
          const reveles = [...scene.querySelectorAll<SVGPathElement>("[data-revele]")];
          const ondes = [...scene.querySelectorAll<SVGEllipseElement>("[data-ondes] ellipse")];
          const ballon = un<HTMLElement>("[data-ballon]");
          const oriente = un<HTMLElement>("[data-oriente]");
          const etire = un<HTMLElement>("[data-etire]");
          const reoriente = un<HTMLElement>("[data-reoriente]");
          const ecrasement = un<HTMLElement>("[data-ecrasement]");
          const ecrasementSol = un<HTMLElement>("[data-ecrasement-sol]");
          const rotation = un<SVGSVGElement>("[data-rotation]");
          const rebond = un<SVGPathElement>("[data-rebond]");
          const halo = un<HTMLElement>("[data-halo]");
          const haloMotif = un<HTMLElement>("[data-halo-motif]");
          const plateau = un<HTMLElement>("[data-plateau]");
          const eclat = un<SVGGElement>("[data-eclat]");
          const sol = un<SVGLineElement>("[data-sol]");
          const tableau = section.querySelector<HTMLElement>("[data-tableau]");
          if (!ballon || !oriente || !etire || !reoriente || !ecrasement || !ecrasementSol || !rotation) return;
          if (!rebond || !halo || !haloMotif || !plateau || !eclat || !sol || reveles.length !== 3) return;

          const { depart, frappe, impact } = g;
          const rayonHalo = RAYON_HALO[variante];

          // Unites SVG vers pixels d'ecran, recalcule si la scene change de taille.
          let echelle = scene.clientWidth / g.largeur;
          let dernier = { x: depart.x, y: depart.y };

          const ballonX = gsap.quickSetter(ballon, "x", "px");
          const ballonY = gsap.quickSetter(ballon, "y", "px");
          const tourner = gsap.quickSetter(rotation, "rotation", "deg");
          const haloX = gsap.quickSetter(halo, "x", "px");
          const haloY = gsap.quickSetter(halo, "y", "px");
          const motifX = gsap.quickSetter(haloMotif, "x", "px");
          const motifY = gsap.quickSetter(haloMotif, "y", "px");

          gsap.set(ballon, { xPercent: -50, yPercent: -50, x: 0, y: 0, force3D: true });
          gsap.set([oriente, etire, reoriente, ecrasement, rotation], { transformOrigin: "50% 50%" });
          gsap.set(ecrasementSol, { transformOrigin: "50% 100%" });
          // Le smash etire le ballon dans son axe : orienter, etirer, reorienter.
          const angle = (Math.atan2(impact.y - frappe.y, impact.x - frappe.x) * 180) / Math.PI;
          gsap.set(oriente, { rotation: angle });
          gsap.set(reoriente, { rotation: -angle });

          const placerHalo = (x: number, y: number) => {
            const gauche = x * echelle - rayonHalo;
            const haut = y * echelle - rayonHalo;
            haloX(gauche);
            haloY(haut);
            motifX(-gauche);
            motifY(-haut);
          };
          const placer = (x: number, y: number, parcouru: number, suivreHalo = true) => {
            dernier = { x, y };
            ballonX((x - depart.x) * echelle);
            ballonY((y - depart.y) * echelle);
            tourner(parcouru * 0.7);
            if (suivreHalo) placerHalo(x, y);
          };
          const mesurer = () => {
            echelle = scene.clientWidth / g.largeur;
            gsap.set(haloMotif, { width: scene.clientWidth, height: scene.clientHeight });
            placer(dernier.x, dernier.y, 0);
          };
          mesurer();
          const observateur = new ResizeObserver(mesurer);
          observateur.observe(scene);

          // Mouvement reduit : le schema complet, le ballon deja sorti du champ,
          // le tableau allume. Rien ne bouge.
          if (reduit) {
            gsap.set(reveles, { strokeDashoffset: 0 });
            gsap.set(ballon, { autoAlpha: 0 });
            placerHalo(impact.x, impact.y);
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
              // Joue a l'entree ; revient au depart si l'on remonte au-dessus,
              // pour se rejouer a la prochaine entree.
              toggleActions: "play none none reset",
            },
          });

          // Un temps du geste : le ballon suit un trace, qui se dessine derriere
          // lui. Sans position, il s'enchaine a la fin ; avec, il part a l'instant
          // donne (les effets d'une frappe ne retardent pas le geste suivant).
          let parcouru = 0;
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
            // Sans autoRound, GSAP arrondirait au pixel : sur un trace normalise
            // de 0 a 1, il sauterait d'un coup de masque a complet.
            if (options.dessine ?? true) {
              tl.to(trace, { strokeDashoffset: 0, duration: duree, ease, autoRound: false }, "<");
            }
          };

          const secousse = (amplitude: number, duree: number) =>
            gsap.to(plateau, {
              keyframes: { x: [0, -amplitude, amplitude * 0.8, -amplitude * 0.45, amplitude * 0.2, 0] },
              duration: duree,
              ease: "none",
              force3D: true,
            });

          tl.to(halo, { opacity: 1, duration: 0.3 }, 0);

          // 1. La passe, tendue, qui ralentit au sommet, puis retombe vers l'attaquant.
          temps(reveles[0]!, 0.5, "power2.out");
          temps(reveles[1]!, 0.16, "power1.in");

          // 2. La frappe, et seulement a cet instant : ecrasement, eclat, secousse.
          tl.addLabel("frappe");
          tl.to(ecrasement, { scaleX: 1.35, scaleY: 0.72, duration: 0.05 }, "frappe");
          // L'elastique doit finir avant l'impact au sol (frappe + 0,24).
          tl.to(ecrasement, { scaleX: 1, scaleY: 1, duration: 0.17, ease: "elastic.out(1, 0.4)" }, "frappe+=0.05");
          tl.fromTo(
            eclat,
            { opacity: 1, scale: 0.6, svgOrigin: `${frappe.x} ${frappe.y}` },
            { opacity: 0, scale: 1.7, duration: 0.32, ease: "power2.out", immediateRender: false },
            "frappe",
          );
          tl.add(secousse(5, 0.2), "frappe");

          // 3. Le smash, foudroyant, et le ballon s'etire dans sa course.
          temps(reveles[2]!, 0.2, "power3.in", { position: "frappe+=0.04" });
          tl.to(etire, { scaleX: 1.32, scaleY: 0.82, duration: 0.16, ease: "power2.in" }, "frappe+=0.06");

          // 4. L'impact au sol : ecrasement, ondes, secousse, le sol s'eclaire.
          tl.addLabel("sol", "frappe+=0.24");
          tl.to(etire, { scaleX: 1, scaleY: 1, duration: 0.03 }, "sol");
          tl.to(ecrasementSol, { scaleX: 1.45, scaleY: 0.6, duration: 0.05 }, "sol");
          tl.fromTo(
            ondes,
            { attr: { rx: 0, ry: 0 }, opacity: 1 },
            {
              attr: { rx: g.rayon * 9, ry: g.rayon * 1.3 },
              opacity: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: "power2.out",
              immediateRender: false,
            },
            "sol",
          );
          tl.add(secousse(9, 0.32), "sol");
          tl.fromTo(
            sol,
            { attr: { "stroke-opacity": 1 } },
            { attr: { "stroke-opacity": 0.35 }, duration: 0.5, immediateRender: false },
            "sol",
          );
          if (tableau) {
            // Le neon qui s'allume : il hesite avant de tenir.
            tl.to(tableau, { keyframes: { "--allume": [0, 1, 0.25, 1, 0.55, 1] }, duration: 0.5 }, "sol+=0.05");
          }
          tl.to(halo, { opacity: 0.6, duration: 0.8, ease: "power2.out" }, "sol");

          // 5. Le rebond, qui sort du champ ; le halo reste sur le point marque.
          tl.to(ecrasementSol, { scaleX: 0.9, scaleY: 1.12, duration: 0.08 }, "sol+=0.05");
          tl.to(ecrasementSol, { scaleX: 1, scaleY: 1, duration: 0.2 }, "sol+=0.13");
          temps(rebond, 0.7, "sine.out", { dessine: false, halo: false, position: "sol+=0.05" });

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
