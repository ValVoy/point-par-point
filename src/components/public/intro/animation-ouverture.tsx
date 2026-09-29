"use client";

import { useRef, type ReactNode } from "react";
import { CARRES } from "@/components/motif";
import { gsap, useGSAP } from "@/lib/gsap";
import { ajouterGeste, preparerBallon, trouverElementsGeste } from "../ballon-geste";
import { TITRE_TRACES } from "../titre-traces";
import { INTRO_GRAND, INTRO_PORTRAIT, placementTitre, TAILLE_BANDEAU } from "./geometrie-intro";
import { introAJouer, marquerIntroVue, terminerIntro } from "./script-intro";
import { sourcesDuTitre } from "./sources-titre";

/*
 * La sequence de l'intro (fiche `fiches/accueil-ouverture.md`), en moins de
 * quatre secondes : la salle, rendue en veilleuse, s'allume, le tableau
 * affiche une balle de set,
 * le point se joue, la salle exulte, puis les lignes du terrain se replient et
 * deviennent le titre, qui reste en place.
 *
 * Elle ne joue que si le script d'avant affichage a pose la classe
 * `intro-a-jouer`. Sinon, la page est deja dans son etat final ; seul le
 * bandeau LED continue de defiler doucement, sauf mouvement reduit.
 *
 * « Passer », un defilement, un clic ou une touche menent a l'etat final. Un
 * onglet mis en arriere-plan aussi : l'animation ne reprendrait pas au bon
 * moment, et le filet de securite en CSS interviendrait au milieu.
 */

const TOUCHES_NEUTRES = new Set(["Tab", "Shift", "Alt", "Control", "Meta"]);

export function AnimationOuverture({ children }: { children: ReactNode }) {
  const racine = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          grand: "(min-width: 768px)",
          petit: "(max-width: 767.98px)",
          reduit: "(prefers-reduced-motion: reduce)",
        },
        (contexte) => {
          const { grand, reduit } = contexte.conditions as { grand: boolean; reduit: boolean };
          const gi = grand ? INTRO_GRAND : INTRO_PORTRAIT;
          const t = gi.terrain;
          const salle = racine.current?.querySelector<HTMLElement>(`[data-salle="${grand ? "grand" : "portrait"}"]`);
          if (!salle) return;

          // Le bandeau LED defile en continu, intro ou pas : une tuile par cycle.
          const motif = salle.querySelector<HTMLElement>("[data-bandeau-motif]");
          const tuile = CARRES * TAILLE_BANDEAU[grand ? "grand" : "portrait"];
          const defilement = motif && !reduit ? gsap.to(motif, { x: -tuile, duration: 2.4, ease: "none", repeat: -1 }) : null;

          if (reduit || !introAJouer()) return;
          marquerIntroVue();

          const el = trouverElementsGeste(salle);
          const q = <T extends Element>(s: string) => [...salle.querySelectorAll<T>(s)];
          const lettres = q<SVGPathElement>("[data-lettre]");
          const [titre] = q<SVGGElement>("[data-titre]");
          const [tableau] = q<HTMLElement>("[data-tableau-intro]");
          const [scoreNous] = q<HTMLElement>("[data-score-nous]");
          const [balleDeSet] = q<HTMLElement>("[data-balle-de-set]");
          const [filet] = q<SVGGElement>("[data-filet]");
          const [traces] = q<SVGGElement>("[data-traces]");
          const [publicParent] = q<SVGGElement>("[data-public]");
          if (!el || !titre || !tableau || !scoreNous || !balleDeSet || !filet || !traces || lettres.length === 0 || !publicParent) {
            terminerIntro();
            return;
          }

          let echelle = salle.clientWidth / t.largeur;
          const ballon = preparerBallon(el, t, () => echelle);
          const observateur = new ResizeObserver(() => {
            echelle = salle.clientWidth / t.largeur;
            ballon.replacer();
          });
          observateur.observe(salle);

          // Les lettres partent des lignes du terrain. Leurs contours d'arrivee
          // viennent du fichier genere, jamais du DOM : en developpement, React
          // execute cet effet deux fois, et le second passage relirait la ligne
          // de depart comme cible ; le titre ne bougerait plus.
          const miseEnPage = TITRE_TRACES[gi.miseEnPage];
          const sources = sourcesDuTitre(t, placementTitre(gi, miseEnPage), lettres.length);
          const cibles = miseEnPage.lettres.map((lettre) => lettre.d);
          const remettreLeTitre = () => lettres.forEach((lettre, rang) => lettre.setAttribute("d", cibles[rang] ?? ""));
          lettres.forEach((lettre, rang) => lettre.setAttribute("d", sources[rang] ?? ""));
          gsap.set(lettres, { attr: { "fill-opacity": 0, "stroke-opacity": 0 } });
          gsap.set(titre, { opacity: 1 });

          const publicGroupes = q<SVGGElement>("[data-public] [data-groupe]");
          const apparitions = q<HTMLElement>("[data-apparition]");
          gsap.set(apparitions, { opacity: 0, y: 12 });

          const fin = () => {
            observateur.disconnect();
            retirerEcoute();
            terminerIntro();
          };
          const tl = gsap.timeline({ defaults: { ease: "none" }, onComplete: fin });

          // 0. La salle s'allume. Le serveur l'a rendue en veilleuse (globals.css) :
          // la premiere image de l'intro est donc celle deja affichee, et rien ne
          // clignote entre le chargement et le demarrage, meme sur un telephone lent.
          tl.fromTo(publicParent, { opacity: 0.3 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0);
          tl.fromTo(motif ?? [], { opacity: 0.12 }, { opacity: 0.45, duration: 0.35, ease: "power2.out" }, 0.05);
          tl.fromTo(tableau, { opacity: 0.35 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.1);

          // 1. Le point : le geste du prototype, tel quel.
          const { sol } = ajouterGeste(tl, el, t, ballon, 0.35);

          // 2. La joie : le score passe a 25, le public bondit, le bandeau s'emballe.
          tl.to(scoreNous, { yPercent: -50, duration: 0.25, ease: "back.out(2)" }, sol + 0.02);
          tl.to(balleDeSet, { opacity: 0.35, duration: 0.2 }, sol);
          tl.to(
            publicGroupes,
            { y: -14, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 3, stagger: { each: 0.025, from: "random" } },
            sol + 0.04,
          );
          if (defilement) {
            tl.add(() => void gsap.to(defilement, { timeScale: 7, duration: 0.15, yoyo: true, repeat: 1, repeatDelay: 0.5 }), sol);
          }
          // Deux eclats en 0,8 s : sous le seuil de trois clignotements par seconde.
          if (motif) tl.to(motif, { opacity: 0.9, duration: 0.2, yoyo: true, repeat: 3 }, sol);

          // 3. Le terrain devient le titre : les lignes s'effacent au profit des
          // lettres, qui partent exactement de leur trace.
          const morphe = sol + 0.6;
          tl.set(lettres, { attr: { "stroke-opacity": 1 } }, morphe);
          tl.set([traces, el.sol], { opacity: 0 }, morphe);
          tl.to(filet, { opacity: 0, duration: 0.3 }, morphe);
          lettres.forEach((lettre, rang) => {
            tl.to(lettre, { morphSVG: cibles[rang] ?? "", duration: 1.1, ease: "power3.inOut" }, morphe + rang * 0.035);
          });
          tl.to(tableau, { opacity: 0, y: -10, duration: 0.4, ease: "power2.in" }, morphe + 0.2);
          tl.to(lettres, { attr: { "fill-opacity": 1, "stroke-opacity": 0 }, duration: 0.35, ease: "power2.out" }, morphe + 1.05);

          // 4. L'ouverture se complete : sous-titre et invitation a defiler.
          tl.to(apparitions, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, morphe + 1.25);

          // Passer : un geste de l'utilisateur, ou un onglet mis de cote.
          const passer = () => {
            if (tl.progress() < 1) tl.progress(1);
          };
          const surTouche = (evenement: KeyboardEvent) => {
            if (!TOUCHES_NEUTRES.has(evenement.key)) passer();
          };
          const surVisibilite = () => {
            if (document.hidden) passer();
          };
          const evenements = ["wheel", "touchmove", "pointerdown"] as const;
          evenements.forEach((nom) => window.addEventListener(nom, passer, { passive: true }));
          window.addEventListener("keydown", surTouche);
          document.addEventListener("visibilitychange", surVisibilite);
          const bouton = racine.current?.querySelector<HTMLButtonElement>("[data-intro-passer]");
          bouton?.addEventListener("click", passer);
          function retirerEcoute() {
            evenements.forEach((nom) => window.removeEventListener(nom, passer));
            window.removeEventListener("keydown", surTouche);
            document.removeEventListener("visibilitychange", surVisibilite);
            bouton?.removeEventListener("click", passer);
          }

          return () => {
            retirerEcoute();
            observateur.disconnect();
            // Quoi qu'il arrive a l'animation, le titre retrouve ses vrais contours.
            remettreLeTitre();
          };
        },
      );
    },
    { scope: racine },
  );

  return (
    <div ref={racine}>
      <button
        type="button"
        data-intro-seulement
        data-intro-passer
        className="fixed right-4 bottom-4 z-20 rounded-full border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)]/90 px-5 py-2.5 text-sm font-semibold text-[var(--color-craie)] backdrop-blur focus-visible:outline-[var(--color-turquoise)]"
      >
        Passer l&apos;intro
      </button>
      {children}
    </div>
  );
}
