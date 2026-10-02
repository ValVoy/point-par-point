"use client";

import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";

/**
 * GSAP avec MorphSVG, qui transforme le terrain en titre dans l'intro de
 * l'accueil. A part du module commun (audit du 02-10-2026, D13) : seule
 * l'intro en a besoin, les autres pages animees ne chargent plus ses 10 Ko.
 * Inclus dans le paquet gsap 3.15.0, meme licence.
 */
gsap.registerPlugin(MorphSVGPlugin);

export { gsap, ScrollTrigger, useGSAP };
