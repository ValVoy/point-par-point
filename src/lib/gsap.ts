"use client";

import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
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
// MorphSVG transforme le terrain en titre (intro de l'accueil). Inclus dans le
// paquet gsap 3.15.0, meme licence.
gsap.registerPlugin(ScrollTrigger, useGSAP, MorphSVGPlugin);

// En developpement seulement : GSAP accessible depuis la console, pour ralentir
// le temps (`__gsap.globalTimeline.timeScale(0.1)`) et juger une animation
// image par image. Absent du build de production.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __gsap: typeof gsap }).__gsap = gsap;
}

/**
 * Les durees et courbes du systeme de design, lues dans globals.css pour que
 * GSAP et le CSS bougent au meme rythme. Valeurs de repli si la lecture
 * echoue (rendu serveur, test).
 */
export function jetonsMouvement() {
  const lire = (nom: string, repli: number) => {
    if (typeof window === "undefined") return repli;
    const valeur = getComputedStyle(document.documentElement).getPropertyValue(nom);
    const ms = Number.parseFloat(valeur);
    return Number.isFinite(ms) ? ms / 1000 : repli;
  };
  return {
    breve: lire("--duree-breve", 0.16),
    normale: lire("--duree", 0.28),
    appuyee: lire("--duree-appuyee", 0.42),
  };
}

export { gsap, ScrollTrigger, useGSAP };
