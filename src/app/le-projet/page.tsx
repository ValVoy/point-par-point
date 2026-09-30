import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { dateLongue } from "@/lib/dates";
import { urlPhoto } from "@/lib/effectif-public";
import { EQUIPE, NOM_DU_SITE } from "@/lib/site";
import { etapesPubliees } from "@/lib/vitrine";

/**
 * Le projet (fiche fiches/vitrine.md) : une phrase qui situe, puis la
 * chronologie, dans l'ordre du recit choisi dans l'administration. Chaque
 * etape a son titre qui se suffit ; le fil turquoise les relie. Rien n'est
 * invente ici : tout le recit vient des etapes saisies.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le projet",
  description: `L'histoire de ${NOM_DU_SITE}, une équipe de D2 et une série, étape par étape.`,
};

const lien = "font-semibold text-[var(--color-craie)] underline decoration-2 underline-offset-4 hover:text-[var(--color-jaune)]";

export default async function PageProjet() {
  const etapes = await etapesPubliees();

  return (
    <>
      <EnTete actif="/le-projet" />
      <main id="contenu" className="colonne-large pt-16 pb-24 sm:pt-24">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">{NOM_DU_SITE}</p>
        <h1 className="titre-affiche mt-3 text-6xl sm:text-8xl">Le projet</h1>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
          L&apos;équipe D2 masculine du {EQUIPE}, et la série qui la suit. Son histoire, étape par étape.
        </p>

        {etapes.length === 0 ? (
          <p className="mt-16 text-lg text-[var(--color-craie-douce)]">L&apos;histoire du projet s&apos;écrit ici bientôt.</p>
        ) : (
          <ol className="relative mt-16 max-w-4xl border-l-2 border-[var(--color-turquoise)]/60 pl-8 sm:pl-12">
            {etapes.map((e) => {
              const image = urlPhoto(e.imageCle);
              const date = e.dateLibre ?? (e.survenuLe ? dateLongue(e.survenuLe) : null);
              return (
                <li key={e.id} className="relative pb-16 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-2 -left-[calc(2rem+7px)] size-3 bg-[var(--color-turquoise)] sm:-left-[calc(3rem+7px)]"
                  />
                  {date ? (
                    <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase first-letter:uppercase">
                      {e.survenuLe && !e.dateLibre ? <time dateTime={e.survenuLe.toISOString()}>{date}</time> : date}
                    </p>
                  ) : null}
                  <h2 className="titre-affiche mt-2 hyphens-auto text-4xl text-balance break-words sm:text-5xl">{e.titre}</h2>
                  {e.texte?.trim() ? (
                    <p className="mt-4 max-w-[34em] text-lg leading-relaxed whitespace-pre-line text-[var(--color-craie-lecture)]">
                      {e.texte}
                    </p>
                  ) : null}
                  {image ? (
                    <div className="relative mt-6 aspect-[3/2] max-w-2xl overflow-hidden bg-[var(--color-nuit-surface)]">
                      <Image src={image} alt={e.imageDescription ?? ""} fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}

        <p className="mt-20 text-lg text-[var(--color-craie-douce)]">
          La suite se joue sur le terrain et dans la série :{" "}
          <Link href="/effectif" className={lien}>
            l&apos;effectif
          </Link>{" "}
          et{" "}
          <Link href="/serie" className={lien}>
            les épisodes
          </Link>
          .
        </p>
      </main>
      <PiedDePage />
    </>
  );
}
