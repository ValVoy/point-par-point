import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Ouverture } from "@/components/public/intro-nuit/ouverture";
import { RejouerIntro } from "./rejouer";

/*
 * Prototype de l'ouverture de l'accueil, avec son intro. Outil de travail,
 * reserve au developpement, jamais indexe. Le bouton « Rejouer » efface la
 * memoire de visite pour revoir l'intro sans rouvrir le navigateur.
 */

export const metadata: Metadata = {
  title: "Prototype : l'ouverture",
  robots: { index: false, follow: false },
};

export default function PrototypeOuverture() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="palette-nuit min-h-dvh bg-[var(--color-nuit)] text-[var(--color-craie)]">
      <Ouverture sousTitre="L'équipe D2 masculine du VF Francheville, sur le terrain et dans la série." />
      <section className="colonne-large py-32">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">
          Suite de la page
        </p>
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
          Ici viendront le prochain match, le dernier résultat, la série et les actualités.
        </p>
        <RejouerIntro />
      </section>
    </div>
  );
}
