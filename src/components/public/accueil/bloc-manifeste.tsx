import Link from "next/link";
import { Motif } from "@/components/motif";
import { decouperMots, type Mot } from "@/lib/porte-entree";
import { ManifesteAllume } from "./mouvements-porte-entree";

/**
 * Qui on est (fiche fiches/accueil-porte-entree.md) : le manifeste, court et
 * typographique, sans image, juste apres l'ouverture. Il ne disparait jamais :
 * sans texte saisi, c'est le texte de depart qui parle. Chaque mot est un
 * `span` dans le flux, donc une phrase continue pour un lecteur d'ecran ;
 * `ManifesteAllume` les allume un a un au defilement. En grand ecran, le titre
 * a gauche et le texte a droite, pour ne pas laisser une moitie d'ecran vide.
 */

function Mots({ mots }: { mots: Mot[] }) {
  return mots.map((m, i) => (
    <span key={i}>
      {m.espaceAvant ? " " : null}
      <span data-mot className={m.accent ? "text-[var(--color-turquoise)]" : undefined}>
        {m.mot}
      </span>
    </span>
  ));
}

export function BlocManifeste({
  titre,
  texte,
  lienHistoire,
}: {
  titre: string;
  texte: string;
  /** Vrai seulement si la chronologie a une etape publiee : jamais de lien vers une page vide. */
  lienHistoire: boolean;
}) {
  return (
    <section aria-labelledby="titre-manifeste" className="relative overflow-hidden">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-24 h-[28rem] w-[28rem] opacity-[0.07] [mask-image:radial-gradient(closest-side,black,transparent)]"
      >
        <Motif contour sombre="var(--color-turquoise)" taille={34} />
      </span>
      <ManifesteAllume>
        <div className="colonne-large grid min-h-[80svh] content-center gap-8 py-24 sm:py-32 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">Qui on est</p>
            <h2
              id="titre-manifeste"
              className="titre-affiche mt-4 max-w-[14ch] hyphens-auto text-[clamp(2.75rem,6vw,5.25rem)] leading-none text-balance break-words"
            >
              <Mots mots={decouperMots(titre)} />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <p className="max-w-[40ch] text-lg leading-relaxed text-[var(--color-craie)] sm:text-xl">
              <Mots mots={decouperMots(texte)} />
            </p>
            {lienHistoire ? (
              <Link
                href="/le-projet"
                className="mt-8 inline-flex min-h-12 items-center font-semibold underline decoration-2 underline-offset-4 hover:text-[var(--color-jaune)]"
              >
                Notre histoire
              </Link>
            ) : null}
          </div>
        </div>
      </ManifesteAllume>
    </section>
  );
}
