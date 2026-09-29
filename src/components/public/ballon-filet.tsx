"use client";

import { useId, useRef, type ReactNode } from "react";
import { Motif } from "@/components/motif";
import { gsap, useGSAP } from "@/lib/gsap";
import { GRAND, PORTRAIT, segments, type Geometrie } from "./ballon-geometrie";

/*
 * La scene signature : une attaque, passe haute puis smash par-dessus le
 * filet, pilotee par le defilement. Trait fin facon schema de coach, halo qui
 * revele le motif du maillot dans le sillage du ballon, puis le tableau du
 * prochain match qui s'allume a l'impact (cadrage du 29-09-2026).
 *
 * Regles tenues : une seule section epinglee et seulement sur grand ecran
 * (par position sticky, sans bloquer la molette) ; transform et opacite pour
 * le ballon ; etat final propre si le mouvement est reduit ; le sens de la
 * scene existe en texte pour les lecteurs d'ecran.
 */

type Variante = "grand" | "portrait";

function Ballon({ rayon }: { rayon: number }) {
  const r = rayon;
  return (
    <g data-ballon>
      <g data-rotation>
        <circle r={r} fill="var(--color-nuit)" stroke="var(--color-turquoise)" strokeWidth={2} />
        {/* Les coutures d'un ballon de volley : trois arcs, a peine suggeres. */}
        <path
          d={`M${-r * 0.96},${-r * 0.28} Q0,${-r * 0.02} ${r * 0.96},${-r * 0.28} M${-r * 0.7},${r * 0.7} Q${-r * 0.1},${r * 0.1} ${-r * 0.28},${-r * 0.96} M${r * 0.7},${r * 0.7} Q${r * 0.1},${r * 0.1} ${r * 0.28},${-r * 0.96}`}
          fill="none"
          stroke="var(--color-turquoise)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/**
 * Le filet, vu de trois quarts : un panneau de mailles entre deux poteaux,
 * incline pour qu'on lise un filet et non une echelle. Le bord haut, la
 * bande, reste sous la trajectoire du smash (verifie par les tests).
 */
function Filet({ g }: { g: Geometrie }) {
  const { filet, sol } = g;
  const { demi, recul } = filet;
  const pas = (filet.bas - filet.haut) / 9;
  const colonnes = 8;
  const gauche = filet.x - demi;
  const droite = filet.x + demi;
  // Un point du panneau : u de 0 (poteau proche) a 1 (poteau lointain), v de 0 (bande) a 1 (bas).
  const point = (u: number, v: number) =>
    `${gauche + u * (droite - gauche)},${filet.haut - u * recul + v * (filet.bas - filet.haut)}`;

  return (
    <g stroke="var(--color-craie)" fill="none">
      <line x1={droite} x2={droite} y1={filet.haut - recul - 14} y2={sol - recul * 0.5} strokeWidth={2} strokeOpacity={0.4} />
      <g strokeWidth={1} strokeOpacity={0.28}>
        {Array.from({ length: colonnes - 1 }, (_, i) => (i + 1) / colonnes).map((u) => (
          <line key={`c${u}`} x1={point(u, 0).split(",")[0]} y1={point(u, 0).split(",")[1]} x2={point(u, 1).split(",")[0]} y2={point(u, 1).split(",")[1]} />
        ))}
        {Array.from({ length: 8 }, (_, i) => ((i + 1) * pas) / (filet.bas - filet.haut)).map((v) => (
          <polyline key={`l${v}`} points={`${point(0, v)} ${point(1, v)}`} />
        ))}
      </g>
      <polyline points={`${point(0, 1)} ${point(1, 1)}`} strokeWidth={1.5} strokeOpacity={0.5} />
      <polyline points={`${point(0, 0)} ${point(1, 0)}`} strokeWidth={4} strokeOpacity={0.85} />
      <line x1={gauche} x2={gauche} y1={filet.haut - 14} y2={sol} strokeWidth={3} strokeOpacity={0.8} />
    </g>
  );
}

function Scene({ g, variante }: { g: Geometrie; variante: Variante }) {
  const id = useId();
  const traces = Object.values(segments(g));
  const { sol, largeur, hauteur, sommet, frappe, impact } = g;

  return (
    <div
      data-scene={variante}
      className={variante === "grand" ? "relative hidden aspect-[16/9] w-full md:block" : "relative aspect-[3/4] w-full md:hidden"}
    >
      <div
        data-halo
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          maskImage: "radial-gradient(circle var(--hr, 0px) at var(--hx, 50%) var(--hy, 50%), #000 0%, rgb(0 0 0 / 0.35) 45%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle var(--hr, 0px) at var(--hx, 50%) var(--hy, 50%), #000 0%, rgb(0 0 0 / 0.35) 45%, transparent 100%)",
        }}
      >
        <Motif contour fond="transparent" gauche="var(--color-turquoise)" taille={variante === "grand" ? 56 : 44} />
      </div>

      <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <mask id={`${id}-trace`} maskUnits="userSpaceOnUse" x="0" y="0" width={largeur} height={hauteur}>
            {traces.map((d) => (
              <path key={d} data-revele d={d} fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="butt" />
            ))}
          </mask>
        </defs>

        <line x1={0} x2={largeur} y1={sol} y2={sol} stroke="var(--color-craie-douce)" strokeOpacity={0.35} strokeWidth={1.5} />
        {[0.25, 0.75].map((f) => (
          <line key={f} x1={largeur * f} x2={largeur * f} y1={sol} y2={sol + 14} stroke="var(--color-craie-douce)" strokeOpacity={0.35} />
        ))}

        <Filet g={g} />

        <g mask={`url(#${id}-trace)`} fill="none" stroke="var(--color-turquoise-clair)" strokeOpacity={0.8} strokeWidth={2} strokeDasharray="2 10" strokeLinecap="round">
          {traces.map((d) => (
            <path key={d} data-trace d={d} />
          ))}
        </g>

        <g className="titre-affiche" fill="var(--color-turquoise)" fontSize={variante === "grand" ? 30 : 40} textAnchor="middle">
          <text data-etiquette x={sommet.x} y={sommet.y - 46}>Passe</text>
          <text data-etiquette x={frappe.x - 40} y={frappe.y + 70}>Attaque</text>
          <text data-etiquette x={impact.x} y={sol + 70}>Point</text>
        </g>

        <circle data-eclat cx={frappe.x} cy={frappe.y} r={0} fill="none" stroke="var(--color-turquoise-clair)" strokeWidth={2} />
        <g data-impact fill="none" stroke="var(--color-turquoise)" strokeWidth={2}>
          <ellipse cx={impact.x} cy={sol} rx={0} ry={0} />
          <ellipse cx={impact.x} cy={sol} rx={0} ry={0} />
        </g>

        <Ballon rayon={g.rayon} />
      </svg>
    </div>
  );
}

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

          const tous = <T extends Element>(selecteur: string) => [...scene.querySelectorAll<T>(selecteur)];
          const reveles = tous<SVGPathElement>("[data-revele]");
          const etiquettes = tous<SVGTextElement>("[data-etiquette]");
          const ballon = scene.querySelector<SVGGElement>("[data-ballon]");
          const rotation = scene.querySelector<SVGGElement>("[data-rotation]");
          const halo = scene.querySelector<HTMLElement>("[data-halo]");
          const eclat = scene.querySelector<SVGCircleElement>("[data-eclat]");
          const impacts = tous<SVGEllipseElement>("[data-impact] ellipse");
          const tableau = section.querySelector<HTMLElement>("[data-tableau]");
          if (!ballon || !rotation || !halo || !eclat || reveles.length !== 3 || etiquettes.length !== 3) return;
          const longueurs = reveles.map((p) => p.getTotalLength());
          const rayonHalo = grand ? 220 : 160;

          const placer = (x: number, y: number, parcouru: number) => {
            gsap.set(ballon, { x, y });
            gsap.set(rotation, { rotation: parcouru * 0.8, svgOrigin: "0 0" });
            halo.style.setProperty("--hx", `${(x / g.largeur) * 100}%`);
            halo.style.setProperty("--hy", `${(y / g.hauteur) * 100}%`);
          };

          // Mouvement reduit : l'etat final, tout de suite et en entier.
          if (reduit) {
            gsap.set(reveles, { strokeDasharray: "none", strokeDashoffset: 0 });
            gsap.set(etiquettes, { opacity: 1 });
            halo.style.setProperty("--hr", `${rayonHalo}px`);
            placer(g.impact.x, g.impact.y, 0);
            tableau?.style.setProperty("--allume", "1");
            return;
          }

          reveles.forEach((p, i) => gsap.set(p, { strokeDasharray: longueurs[i], strokeDashoffset: longueurs[i] }));
          gsap.set(etiquettes, { opacity: 0, y: 12 });
          tableau?.style.setProperty("--allume", "0");
          placer(g.depart.x, g.depart.y, 0);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: grand ? "top top" : "top 75%",
              end: grand ? "bottom bottom" : "bottom 70%",
              scrub: 0.4,
            },
          });

          // Un temps du geste : le ballon suit le trace, qui se dessine derriere lui.
          const temps = (i: number, duree: number, ease: string) => {
            const trace = reveles[i]!;
            const longueur = longueurs[i]!;
            const avant = longueurs.slice(0, i).reduce((a, b) => a + b, 0);
            const curseur = { t: 0 };
            tl.to(curseur, {
              t: 1,
              duration: duree,
              ease,
              onUpdate() {
                const point = trace.getPointAtLength(curseur.t * longueur);
                placer(point.x, point.y, avant + curseur.t * longueur);
              },
            });
            tl.to(trace, { strokeDashoffset: 0, duration: duree, ease }, "<");
          };

          tl.to(halo, { "--hr": `${rayonHalo}px`, duration: 0.12 }, 0);
          temps(0, 0.34, "power2.out"); // la passe monte et ralentit jusqu'au sommet
          tl.to(etiquettes[0]!, { opacity: 1, y: 0, duration: 0.05 }, "-=0.08");
          temps(1, 0.1, "power2.in"); // elle retombe vers l'attaquant
          tl.to(etiquettes[1]!, { opacity: 1, y: 0, duration: 0.04 });
          tl.fromTo(eclat, { attr: { r: 0 }, opacity: 1 }, { attr: { r: g.rayon * 3 }, opacity: 0, duration: 0.06 }, "<");
          temps(2, 0.14, "power3.in"); // le smash, foudroyant
          tl.fromTo(
            impacts,
            { attr: { rx: 0, ry: 0 }, opacity: 1 },
            { attr: { rx: g.rayon * 7, ry: g.rayon }, opacity: 0, duration: 0.1, stagger: 0.03 },
          );
          tl.to(etiquettes[2]!, { opacity: 1, y: 0, duration: 0.04 }, "<");
          if (tableau) tl.to(tableau, { "--allume": 1, duration: 0.08 }, "<");
          tl.to({}, { duration: 0.12 }); // un temps pour lire le tableau avant de relacher
        },
      );
    },
    { scope: racine },
  );

  return (
    <section
      ref={racine}
      aria-label="Le prochain match"
      // Sans mouvement, la longue course de defilement n'a plus d'objet : la
      // section reprend sa hauteur naturelle et n'est plus epinglee.
      className="relative md:h-[280vh] md:motion-reduce:h-auto"
    >
      <p className="sr-only">
        Une attaque : la passe monte en cloche, l&apos;attaquant frappe, le ballon passe au-dessus du filet et touche le sol adverse.
      </p>
      <div className="flex flex-col gap-6 md:sticky md:top-0 md:h-svh md:justify-center md:motion-reduce:static md:motion-reduce:h-auto">
        <div className="colonne-large">
          <div className="mx-auto w-full md:max-w-[calc(56svh*16/9)]">
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
