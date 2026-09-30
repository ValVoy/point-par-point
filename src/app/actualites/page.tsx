import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { actualitesPubliees } from "@/lib/actualites-publiques";
import { dateLongue } from "@/lib/dates";
import { urlPhoto } from "@/lib/effectif-public";
import { EQUIPE } from "@/lib/site";

/**
 * Les actualites (fiche fiches/actualites.md) : la plus recente en grand,
 * les autres en liste datee, une colonne. Peu d'articles, donc pas de
 * grille : une liste tient avec un article comme avec cinquante. Vide, la
 * rubrique renvoie vers les matchs et la serie, jamais une page nue.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Les actualités",
  description: `Les nouvelles de l'équipe D2 masculine du ${EQUIPE}.`,
};

function Publie({ date }: { date: Date | null }) {
  if (!date) return null;
  return (
    <span className="text-sm text-[var(--color-craie-tenue)]">
      Publié le <time dateTime={date.toISOString()}>{dateLongue(date)}</time>
    </span>
  );
}

export default async function PageActualites() {
  const [une, ...autres] = await actualitesPubliees();
  const image = une ? urlPhoto(une.imageCle) : null;

  return (
    <>
      <EnTete actif="/actualites" />
      <main id="contenu" className="pb-24">
        <section className="colonne-large pt-16 pb-12 sm:pt-24">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">{EQUIPE}</p>
          <h1 className="titre-affiche mt-3 text-5xl sm:text-8xl">Les actualités</h1>
        </section>

        {!une ? (
          <p className="colonne-large text-lg text-[var(--color-craie-douce)]">
            Pas encore d&apos;actualité. En attendant :{" "}
            <Link href="/matchs" className="font-semibold text-[var(--color-craie)] underline underline-offset-4">
              les matchs
            </Link>{" "}
            et{" "}
            <Link href="/serie" className="font-semibold text-[var(--color-craie)] underline underline-offset-4">
              la série
            </Link>
            .
          </p>
        ) : (
          <>
            <section aria-label="À la une" className="colonne-large">
              <Link href={`/actualites/${une.slug}`} className="group grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
                {image ? (
                  <span className="relative block aspect-[3/2] overflow-hidden bg-[var(--color-nuit-surface)] lg:col-span-7">
                    <Image src={image} alt="" fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
                  </span>
                ) : null}
                <span className={image ? "block lg:col-span-5" : "block lg:col-span-10"}>
                  <Publie date={une.publieLe} />
                  <h2
                    className={`titre-affiche mt-3 hyphens-auto text-balance break-words group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)] ${
                      image ? "text-4xl sm:text-6xl" : "text-5xl sm:text-7xl"
                    }`}
                  >
                    {une.titre}
                  </h2>
                  {une.chapo ? (
                    <span className="mt-5 block max-w-[34em] text-lg leading-relaxed text-[var(--color-craie-douce)]">{une.chapo}</span>
                  ) : null}
                </span>
              </Link>
            </section>

            {autres.length > 0 ? (
              <section aria-labelledby="titre-autres" className="colonne-large mt-20">
                <h2 id="titre-autres" className="border-b-2 border-[var(--color-craie)] pb-2 text-xs font-semibold tracking-[0.2em] uppercase">
                  Précédemment
                </h2>
                <ul>
                  {autres.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/actualites/${a.slug}`}
                        className="group block border-b border-[var(--color-nuit-trait)] py-6 transition-colors duration-[80ms] hover:bg-[var(--color-nuit-surface)]"
                      >
                        <Publie date={a.publieLe} />
                        <h3 className="titre-affiche mt-2 hyphens-auto text-3xl text-balance break-words group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)] sm:text-4xl">
                          {a.titre}
                        </h3>
                        {a.chapo ? (
                          <span className="mt-2 line-clamp-2 block max-w-[34em] text-[var(--color-craie-douce)]">{a.chapo}</span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </main>
      <PiedDePage />
    </>
  );
}
