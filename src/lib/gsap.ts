"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Point d'enregistrement unique de GSAP, decide a la veille du 29-09-2026.
 * Tout composant anime importe d'ici, jamais de "gsap" directement : les
 * extensions sont enregistrees une fois, et l'administration, qui n'importe
 * jamais ce fichier, ne charge pas une ligne de GSAP.
 *
 * Licence standard de GSAP : gratuite, usage commercial compris, mais ce
 * n'est pas du MIT.
 */
// MorphSVG, qui ne sert qu'a l'intro de l'accueil, s'enregistre a part dans
// gsap-morph.ts : ici, il partait sur toutes les pages animees (audit D13).
gsap.registerPlugin(ScrollTrigger, useGSAP);

// En developpement seulement : GSAP accessible depuis la console, pour ralentir
// le temps (`__gsap.globalTimeline.timeScale(0.1)`) et juger une animation
// image par image. Absent du build de production.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __gsap: typeof gsap }).__gsap = gsap;
}

export { gsap, ScrollTrigger, useGSAP };
