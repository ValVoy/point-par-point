import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { ImageOuMotif } from "@/components/public/image-ou-motif";
import { FilVertical } from "@/components/public/projet/fil-vertical";
import { Volets } from "@/components/public/volets";
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
      <main id="contenu" className="min-h-[70svh] pb-[var(--air-chapitre)]">
        <Volets>
          <section className="colonne-large pt-16 sm:pt-24">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
              <div className="min-w-0">
                <p className="etiquette text-[var(--color-turquoise)]">{NOM_DU_SITE}</p>
                <h1 className="titre-affiche titre-page mt-4">Le projet</h1>
              </div>
              {etapes.length > 0 ? (
                <p className="pb-2 sm:text-right">
                  <span className="titre-affiche chiffre-geant block">{String(etapes.length).padStart(2, "0")}</span>
                  <span className="etiquette mt-2 block text-[var(--color-craie-douce)]">étape{etapes.length > 1 ? "s" : ""}</span>
                </p>
              ) : null}
            </div>
            <p className="chapeau mt-[var(--titre-contenu)] max-w-[40ch] text-[var(--color-craie-douce)]">
              L&apos;équipe D2 masculine du {EQUIPE}, et la série qui la suit. Son histoire, étape par étape.
            </p>
          </section>

          {etapes.length === 0 ? (
            // Un etat d'attente dessine, pas une page inachevee (fiche refonte, section 8).
            <div className="colonne-large suite">
              <ImageOuMotif src={null} sizes="100vw" className="aspect-[21/9] max-h-72" />
              <p className="chapeau mt-6 text-[var(--color-craie-douce)]">L&apos;histoire du projet se raconte bientôt ici, étape par étape.</p>
            </div>
          ) : (
            <div className="colonne-large chapitre">
              <FilVertical>
                <ol>
                  {etapes.map((e, i) => {
                    const image = urlPhoto(e.imageCle);
                    const date = e.dateLibre ?? (e.survenuLe ? dateLongue(e.survenuLe) : null);
                    // Photo a droite puis a gauche en grand ecran ; au telephone, au-dessus du texte.
                    const aGauche = i % 2 === 1;
                    return (
                      <li key={e.id} className="relative pl-10 sm:pl-14 [&+&]:mt-[var(--air-suite)]">
                        <span aria-hidden="true" className="absolute top-3 left-0 size-3 bg-[var(--color-turquoise)]" />
                        <div className={`grid items-center gap-8 ${image ? "lg:grid-cols-2 lg:gap-16" : ""}`}>
                          {image ? (
                            <div className={aGauche ? "lg:order-first" : "lg:order-last"}>
                              <div className="couche-propre relative aspect-[3/2] overflow-hidden bg-[var(--color-nuit-surface)]">
                                <Image src={image} alt={e.imageDescription ?? ""} fill sizes="(min-width: 1024px) 40rem, 100vw" className="object-cover" />
                              </div>
                            </div>
                          ) : null}
                          <div className="min-w-0">
                            {date ? (
                              <p className="etiquette text-[var(--color-turquoise)]">
                                {e.survenuLe && !e.dateLibre ? <time dateTime={e.survenuLe.toISOString()}>{date}</time> : date}
                              </p>
                            ) : null}
                            <h2 className="titre-affiche titre-chapitre mt-3 max-w-[18ch] text-balance">{e.titre}</h2>
                            {e.texte?.trim() ? (
                              <p className="corps mt-[var(--titre-contenu)] max-w-[46ch] whitespace-pre-line text-[var(--color-craie-lecture)]">{e.texte}</p>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </FilVertical>
            </div>
          )}

          <p className="colonne-large chapitre chapeau text-[var(--color-craie-douce)]">
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
        </Volets>
      </main>
      <PiedDePage />
    </>
  );
}
