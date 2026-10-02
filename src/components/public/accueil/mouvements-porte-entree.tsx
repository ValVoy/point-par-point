"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Les trois gestes propres aux chapitres permanents de l'accueil (fiche
 * fiches/accueil-porte-entree.md), chacun tire d'un objet de la salle. Tous
 * sous `gsap.matchMedia()` : sous `prefers-reduced-motion`, rien ne
 * s'execute et le rendu serveur, deja dans son etat final, reste tel quel.
 * Rien ne tourne pendant la lecture : chaque geste se joue une fois, puis se
 * fige.
 */

/**
 * Fige un geste a son etat final. L'animation se lit sur le declencheur : il
 * peut partir des sa creation, si la page se recharge deja defilee au-dela.
 */
function figer(declencheur: ScrollTrigger) {
  const animation = declencheur.animation;
  declencheur.kill(false, true);
  animation?.progress(1);
}

/**
 * La fin d'un geste lie au defilement, bornee au bas de la page : un chapitre
 * pose juste avant le pied de page doit pouvoir finir son geste (critique du
 * 01-10-2026, une etape restait eteinte faute de page en dessous).
 */
function finAtteignable(element: Element, partDeLEcran: number) {
  return () => {
    const fin = element.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * partDeLEcran;
    return Math.min(fin, ScrollTrigger.maxScroll(window) - 1);
  };
}

/** Le manifeste s'allume mot a mot au defilement, comme les rampes de la salle. */
export function ManifesteAllume({ children }: { children: ReactNode }) {
  const racine = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const noeud = racine.current;
        const mots = gsap.utils.toArray<HTMLElement>("[data-mot]", noeud);
        const dernier = mots.at(-1);
        if (!noeud || !dernier) return;
        const allumage = gsap.fromTo(
          mots,
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: noeud,
              start: "top 75%",
              // Tout est allume quand le dernier mot arrive aux trois quarts de l'ecran.
              end: finAtteignable(dernier, 0.75),
              scrub: 0.4,
              // Une fois tout allume, le texte ne revient plus en arriere : on lit au calme.
              onLeave: figer,
            },
          },
        );

        // Atteint au clavier (le lien « Notre histoire »), le texte s'allume aussitot.
        const auFocus = () => allumage.scrollTrigger && figer(allumage.scrollTrigger);
        noeud.addEventListener("focusin", auFocus);
        return () => noeud.removeEventListener("focusin", auFocus);
      });
    },
    { scope: racine },
  );

  return <div ref={racine}>{children}</div>;
}

/**
 * Les numeros de l'effectif roulent jusqu'au leur, carte apres carte, comme un
 * tableau qu'on met a jour. Les chiffres d'une meme carte partent ensemble.
 */
export function EquipeEnMouvement({ children }: { children: ReactNode }) {
  const racine = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const noeud = racine.current;
        if (!noeud) return;
        // Seulement les cartes affichees : celles masquees au telephone ne comptent pas.
        const cartes = gsap.utils
          .toArray<HTMLElement>("li", noeud)
          .filter((carte) => carte.offsetParent !== null)
          .map((carte) => gsap.utils.toArray<HTMLElement>("[data-roule]", carte))
          .filter((colonnes) => colonnes.length > 0);
        if (cartes.length === 0) return;

        // 40 ms d'une carte a l'autre, toute la vague en 600 ms au plus.
        const ecart = cartes.length > 1 ? Math.min(0.04, 0.15 / (cartes.length - 1)) : 0;
        // Les deux derniers crans seulement, apres la montee de la section (retour de
        // l'utilisateur du 02-10-2026, mesure par l'audit U34) : tout le cadran, de 0 a 9,
        // faisait parcourir 1 267 px a une colonne en 450 ms, 169 px des la premiere image,
        // pendant que la section montait encore. Le geste reste, le saut part.
        const cran = (colonne: HTMLElement) => Number(colonne.dataset.chiffre);
        const vague = gsap.timeline({ scrollTrigger: { trigger: noeud, start: "top 80%", once: true }, delay: 0.35 });
        cartes.forEach((colonnes, i) => {
          vague.fromTo(
            colonnes,
            // y: 0 reprend la main sur la translation posee par le rendu serveur.
            { y: 0, yPercent: (_j: number, colonne: HTMLElement) => -10 * Math.max(0, cran(colonne) - 2), immediateRender: false },
            {
              y: 0,
              yPercent: (_j: number, colonne: HTMLElement) => -10 * cran(colonne),
              duration: 0.6,
              ease: "power2.inOut",
            },
            i * ecart,
          );
        });
      });
    },
    { scope: racine },
  );

  return <div ref={racine}>{children}</div>;
}

/**
 * Le fil du projet se trace au defilement, troncon par troncon, et chaque
 * etape s'allume quand il l'atteint. Un troncon relie deux reperes : le fil
 * ne depasse jamais la derniere etape, quel que soit leur nombre.
 */
export function FilProjet({ children }: { children: ReactNode }) {
  const racine = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          grand: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          petit: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
        },
        (contexte) => {
          const noeud = racine.current;
          if (!noeud) return;
          const { grand } = contexte.conditions as { grand: boolean };
          const etapes = gsap.utils.toArray<HTMLElement>("[data-etape]", noeud);
          const premiere = etapes[0];
          if (!premiere) return;
          const troncons = gsap.utils.toArray<HTMLElement>(grand ? "[data-fil='grand']" : "[data-fil='petit']", noeud);
          const axe = grand ? "scaleX" : "scaleY";

          const trace = gsap.timeline({
            scrollTrigger: {
              trigger: noeud,
              start: "top 70%",
              end: finAtteignable(noeud, 0.6),
              scrub: 0.5,
              onLeave: figer,
            },
          });
          trace.fromTo(premiere, { opacity: 0.25 }, { opacity: 1, duration: 0.1, ease: "none" }, 0);
          troncons.forEach((troncon, i) => {
            const etape = etapes[i + 1];
            trace.fromTo(troncon, { [axe]: 0 }, { [axe]: 1, duration: 1, ease: "none" }, ">");
            if (etape) trace.fromTo(etape, { opacity: 0.25 }, { opacity: 1, duration: 0.1, ease: "none" }, ">");
          });

          const auFocus = () => trace.scrollTrigger && figer(trace.scrollTrigger);
          noeud.addEventListener("focusin", auFocus);
          return () => noeud.removeEventListener("focusin", auFocus);
        },
      );
    },
    { scope: racine },
  );

  return <div ref={racine}>{children}</div>;
}
