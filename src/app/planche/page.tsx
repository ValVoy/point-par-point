import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Motif } from "./motif";
import { Palette } from "./palette";
import { CANDIDATES, variablesPolices } from "./polices";
import { FiltresSvg, Portraits } from "./portraits";
import { SelecteurPolice } from "./selecteur-police";
import { Specimens } from "./specimens";
import { TableauScore } from "./tableau-score";
import styles from "./planche.module.css";

/*
 * Planche de style du systeme de design, decidee au cadrage du 29-09-2026.
 * Outil de travail, pas une page du site : elle n'existe qu'en developpement
 * et n'est jamais indexee. Ses decisions monteront dans globals.css une fois
 * tranchees, puis la route sera supprimee.
 */

export const metadata: Metadata = {
  title: "Planche de style",
  robots: { index: false, follow: false },
};

function MotifSection() {
  return (
    <section className="border-t border-[var(--trait)] px-4 py-20 sm:px-10 lg:px-16">
      <p className={styles.etiquette}>04 · Motif</p>
      <h2 className="mt-3 max-w-[24ch] text-3xl font-semibold text-balance sm:text-4xl">
        Les losanges du maillot, en signature discrète
      </h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--craie-douce)]">
        Trois intensités. La texture à peine visible sert aux bandeaux et aux
        fiches. Le motif franc ne sert qu&apos;au volet de transition de la
        scène du ballon, le temps d&apos;un passage.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <figure>
          <div className="relative h-56 overflow-hidden rounded-sm bg-[var(--nuit-surface)]">
            <Motif className={styles.texture} fond="transparent" />
          </div>
          <figcaption className="mt-3 text-sm text-[var(--craie-douce)]">
            Texture, 7 % : bandeaux et fiches
          </figcaption>
        </figure>
        <figure>
          <div className="relative h-56 overflow-hidden rounded-sm">
            <Motif
              fond="var(--nuit)"
              gauche="var(--turquoise-fonce)"
              droite="var(--nuit-releve)"
              taille={40}
            />
          </div>
          <figcaption className="mt-3 text-sm text-[var(--craie-douce)]">
            Ton sur ton : fond de section rare
          </figcaption>
        </figure>
        <figure>
          <div className="relative h-56 overflow-hidden rounded-sm">
            <Motif fond="var(--craie)" gauche="var(--turquoise)" droite="var(--violet)" taille={56} />
          </div>
          <figcaption className="mt-3 text-sm text-[var(--craie-douce)]">
            Franc, comme le maillot : volet de transition seulement
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default function Planche() {
  if (process.env.NODE_ENV === "production") notFound();

  const policeParDefaut = {
    "--titre": CANDIDATES[0]?.famille,
    "--titre-largeur": "100%",
  } as CSSProperties;

  return (
    <div data-planche className={`${styles.planche} ${variablesPolices}`} style={policeParDefaut}>
      <FiltresSvg />

      <header className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-10 lg:px-16">
        <Motif className={styles.texture} fond="transparent" />
        <p className={`relative ${styles.etiquette}`}>Planche de style · 29-09-2026</p>
        <h1
          className="relative mt-4 text-[clamp(3.5rem,11vw,9rem)] uppercase"
          style={{ fontFamily: "var(--titre)", fontWeight: 800, fontStretch: "var(--titre-largeur)", lineHeight: 0.86 }}
        >
          Projet Volley
        </h1>
        <p className="relative mt-6 max-w-[62ch] text-lg leading-relaxed text-[var(--craie-douce)]">
          Fond nuit, une seule couleur vive tirée du maillot, une condensée
          pour les titres et les chiffres. Le bouton en bas à droite bascule
          la police des cartes et du tableau de score entre les trois
          candidates.
        </p>
      </header>

      <Palette />
      <Specimens />
      <Portraits />
      <MotifSection />
      <TableauScore />

      <SelecteurPolice candidates={CANDIDATES} />
    </div>
  );
}
