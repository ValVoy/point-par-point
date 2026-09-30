import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Motif } from "@/components/motif";
import { Bandeaux } from "./bandeaux";
import { Palette } from "./palette";
import { FiltresSvg, Portraits } from "./portraits";
import { TableauScore } from "./tableau-score";
import styles from "./planche.module.css";

/*
 * Planche de la palette du 30-09-2026 (fiche fiches/palette.md). Outil de
 * travail, pas une page du site : elle n'existe qu'en developpement et n'est
 * jamais indexee. Elle ne porte aucune couleur propre, tout vient des jetons
 * de globals.css : ce qu'elle montre est ce que le site affichera.
 */

export const metadata: Metadata = {
  title: "Planche de style",
  robots: { index: false, follow: false },
};

function MotifSection() {
  return (
    <section className="colonne-large border-t border-[var(--color-trait)] py-20">
      <p className={styles.etiquette}>05 · Motif</p>
      <h2 className="titre-affiche mt-3 text-5xl sm:text-7xl">Le maillot, deux façons</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <figure>
          <div className="relative h-72 overflow-hidden bg-[var(--color-papier-creuse)]">
            <div className="absolute inset-0 opacity-[0.08]">
              <Motif contour sombre="var(--color-encre)" />
            </div>
          </div>
          <figcaption className="mt-3 text-sm text-[var(--color-encre-douce)]">
            Filigrane : un contour d&apos;encre à peine perceptible, sur le papier
          </figcaption>
        </figure>
        <figure>
          <div className="relative h-72 overflow-hidden">
            <Motif fond="var(--color-turquoise)" sombre="var(--color-violet)" clair="var(--color-turquoise)" taille={28} />
          </div>
          <figcaption className="mt-3 text-sm text-[var(--color-encre-douce)]">
            Plein : le tissu du maillot, pour un bandeau ou un volet de transition
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default function Planche() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className={styles.planche}>
      <FiltresSvg />

      <header className="grain relative">
        <div className="colonne-large relative pt-24 pb-16">
          <p className={styles.etiquette}>Planche de style · palette du 30-09-2026</p>
          <h1 className="titre-affiche mt-4 text-[clamp(3.5rem,11vw,9rem)]">Projet Volley</h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-[var(--color-encre-douce)]">
            Un programme de match imprimé : un papier clair, les couleurs réelles du maillot, et le
            jaune du ballon là où il se passe quelque chose.
          </p>
          <div aria-hidden="true" className="mt-10 h-1 w-24 bg-[var(--color-jaune)]" />
        </div>
      </header>

      <Palette />
      <Bandeaux />
      <Portraits />
      <TableauScore />
      <MotifSection />
    </div>
  );
}
