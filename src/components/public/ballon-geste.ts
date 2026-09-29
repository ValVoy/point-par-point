import { gsap } from "@/lib/gsap";
import type { Geometrie } from "./ballon-geometrie";

/**
 * Le geste du ballon, partage par la scene du prototype et l'intro de
 * l'accueil : passe tendue, frappe, smash, impact au sol, rebond hors champ.
 * Ce module retrouve les elements dessines par `ballon-scene.tsx`, les place,
 * et ajoute le geste a une chronologie GSAP fournie par l'appelant, qui garde
 * la main sur le declenchement et sur ce qui l'entoure (halo, tableau).
 *
 * Fluidite : le ballon est un calque HTML deplace par translate3d avec des
 * setters rapides ; les effets d'impact ne s'appliquent qu'a leur instant
 * (immediateRender a false), et les traces ne sont pas arrondis au pixel
 * (autoRound a false), sans quoi, normalises de 0 a 1, ils sautaient d'un coup.
 */

export type ElementsGeste = {
  ballon: HTMLElement;
  oriente: HTMLElement;
  etire: HTMLElement;
  reoriente: HTMLElement;
  ecrasement: HTMLElement;
  ecrasementSol: HTMLElement;
  rotation: SVGSVGElement;
  rebond: SVGPathElement;
  reveles: SVGPathElement[];
  ondes: SVGEllipseElement[];
  eclat: SVGGElement;
  sol: SVGLineElement;
  plateau: HTMLElement;
};

export function trouverElementsGeste(racine: Element): ElementsGeste | null {
  const un = <T extends Element>(s: string) => racine.querySelector<T>(s);
  const elements = {
    ballon: un<HTMLElement>("[data-ballon]"),
    oriente: un<HTMLElement>("[data-oriente]"),
    etire: un<HTMLElement>("[data-etire]"),
    reoriente: un<HTMLElement>("[data-reoriente]"),
    ecrasement: un<HTMLElement>("[data-ecrasement]"),
    ecrasementSol: un<HTMLElement>("[data-ecrasement-sol]"),
    rotation: un<SVGSVGElement>("[data-rotation]"),
    rebond: un<SVGPathElement>("[data-rebond]"),
    reveles: [...racine.querySelectorAll<SVGPathElement>("[data-revele]")],
    ondes: [...racine.querySelectorAll<SVGEllipseElement>("[data-ondes] ellipse")],
    eclat: un<SVGGElement>("[data-eclat]"),
    sol: un<SVGLineElement>("[data-sol]"),
    plateau: un<HTMLElement>("[data-plateau]"),
  };
  const manquant = Object.values(elements).some((e) => e === null || (Array.isArray(e) && e.length === 0));
  return manquant || elements.reveles.length !== 3 ? null : (elements as ElementsGeste);
}

type Placeur = (x: number, y: number, parcouru: number) => void;

/**
 * Pose les origines, oriente l'etirement dans l'axe du smash, et renvoie la
 * fonction qui place le ballon en unites de la scene. `echelle` donne les
 * pixels d'ecran par unite ; `surPlacement` sert au halo qui suit le ballon.
 */
export function preparerBallon(
  el: ElementsGeste,
  g: Geometrie,
  echelle: () => number,
  surPlacement?: (x: number, y: number) => void,
) {
  const ballonX = gsap.quickSetter(el.ballon, "x", "px");
  const ballonY = gsap.quickSetter(el.ballon, "y", "px");
  const tourner = gsap.quickSetter(el.rotation, "rotation", "deg");

  gsap.set(el.ballon, { xPercent: -50, yPercent: -50, x: 0, y: 0, force3D: true });
  gsap.set([el.oriente, el.etire, el.reoriente, el.ecrasement, el.rotation], { transformOrigin: "50% 50%" });
  gsap.set(el.ecrasementSol, { transformOrigin: "50% 100%" });
  const angle = (Math.atan2(g.impact.y - g.frappe.y, g.impact.x - g.frappe.x) * 180) / Math.PI;
  gsap.set(el.oriente, { rotation: angle });
  gsap.set(el.reoriente, { rotation: -angle });

  let dernier = { x: g.depart.x, y: g.depart.y, parcouru: 0 };
  let suivre = true;
  const placer: Placeur = (x, y, parcouru) => {
    dernier = { x, y, parcouru };
    const k = echelle();
    ballonX((x - g.depart.x) * k);
    ballonY((y - g.depart.y) * k);
    tourner(parcouru * 0.7);
    if (suivre) surPlacement?.(x, y);
  };
  return {
    placer,
    /** Replace le ballon au meme endroit, apres un changement de taille. */
    replacer: () => placer(dernier.x, dernier.y, dernier.parcouru),
    /** Le halo suit le ballon, ou reste ou il est (apres l'impact, sur le point). */
    suivreHalo: (valeur: boolean) => {
      suivre = valeur;
    },
  };
}

function secousse(cible: HTMLElement, amplitude: number, duree: number) {
  return gsap.to(cible, {
    keyframes: { x: [0, -amplitude, amplitude * 0.8, -amplitude * 0.45, amplitude * 0.2, 0] },
    duration: duree,
    ease: "none",
    force3D: true,
  });
}

/**
 * Ajoute le geste a la chronologie a partir de `debut` (secondes), et renvoie
 * les instants cles, pour que l'appelant y accroche ce qui l'entoure.
 * Duree totale : un peu moins de 1,7 s, rebond compris.
 */
export function ajouterGeste(
  tl: gsap.core.Timeline,
  el: ElementsGeste,
  g: Geometrie,
  ballon: ReturnType<typeof preparerBallon>,
  debut = 0,
) {
  let parcouru = 0;
  const temps = (trace: SVGPathElement, position: number, duree: number, ease: string, dessine = true) => {
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
          ballon.placer(p.x, p.y, avant + curseur.t * longueur);
        },
      },
      position,
    );
    if (dessine) tl.to(trace, { strokeDashoffset: 0, duration: duree, ease, autoRound: false }, position);
  };

  const [montee, descente, smash] = el.reveles as [SVGPathElement, SVGPathElement, SVGPathElement];
  const frappe = debut + 0.66;
  const sol = frappe + 0.24;

  // 1. La passe, tendue, qui ralentit au sommet, puis retombe vers l'attaquant.
  tl.add(() => ballon.suivreHalo(true), debut);
  temps(montee, debut, 0.5, "power2.out");
  temps(descente, debut + 0.5, 0.16, "power1.in");

  // 2. La frappe, et seulement a cet instant : ecrasement, eclat, secousse.
  tl.to(el.ecrasement, { scaleX: 1.35, scaleY: 0.72, duration: 0.05 }, frappe);
  // L'elastique finit avant l'impact au sol.
  tl.to(el.ecrasement, { scaleX: 1, scaleY: 1, duration: 0.17, ease: "elastic.out(1, 0.4)" }, frappe + 0.05);
  tl.fromTo(
    el.eclat,
    { opacity: 1, scale: 0.6, svgOrigin: `${g.frappe.x} ${g.frappe.y}` },
    { opacity: 0, scale: 1.7, duration: 0.32, ease: "power2.out", immediateRender: false },
    frappe,
  );
  tl.add(secousse(el.plateau, 5, 0.2), frappe);

  // 3. Le smash, foudroyant, et le ballon s'etire dans sa course.
  temps(smash, frappe + 0.04, 0.2, "power3.in");
  tl.to(el.etire, { scaleX: 1.32, scaleY: 0.82, duration: 0.16, ease: "power2.in" }, frappe + 0.06);

  // 4. L'impact au sol : ecrasement, ondes, secousse, le sol s'eclaire.
  tl.to(el.etire, { scaleX: 1, scaleY: 1, duration: 0.03 }, sol);
  tl.to(el.ecrasementSol, { scaleX: 1.45, scaleY: 0.6, duration: 0.05 }, sol);
  tl.fromTo(
    el.ondes,
    { attr: { rx: 0, ry: 0 }, opacity: 1 },
    {
      attr: { rx: g.rayon * 9, ry: g.rayon * 1.3 },
      opacity: 0,
      duration: 0.65,
      stagger: 0.08,
      ease: "power2.out",
      immediateRender: false,
    },
    sol,
  );
  tl.add(secousse(el.plateau, 9, 0.32), sol);
  tl.fromTo(
    el.sol,
    { attr: { "stroke-opacity": 1 } },
    { attr: { "stroke-opacity": 0.35 }, duration: 0.5, immediateRender: false },
    sol,
  );

  // 5. Le rebond, qui sort du champ ; le halo eventuel reste sur le point marque.
  tl.add(() => ballon.suivreHalo(false), sol + 0.05);
  tl.to(el.ecrasementSol, { scaleX: 0.9, scaleY: 1.12, duration: 0.08 }, sol + 0.05);
  tl.to(el.ecrasementSol, { scaleX: 1, scaleY: 1, duration: 0.2 }, sol + 0.13);
  temps(el.rebond, sol + 0.05, 0.7, "sine.out", false);

  return { frappe, sol, fin: sol + 0.75 };
}

/** L'etat final sans mouvement : le schema complet, le ballon sorti du champ. */
export function etatFinalGeste(el: ElementsGeste) {
  gsap.set(el.reveles, { strokeDashoffset: 0 });
  gsap.set(el.ballon, { autoAlpha: 0 });
}
