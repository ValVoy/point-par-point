import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { TitreChapitre } from "@/components/public/titre-chapitre";
import { Volets } from "@/components/public/volets";
import { urlPhoto } from "@/lib/effectif-public";
import { EQUIPE } from "@/lib/site";
import { partenairesAffiches } from "@/lib/vitrine";

/**
 * Les partenaires (fiche fiches/vitrine.md) : un merci, des cases toutes
 * egales, puis l'invitation a les rejoindre. Les logos, de qualite inegale
 * par nature, sont ramenes en blanc sur la nuit et retrouvent leur couleur
 * au survol comme au focus ; sans logo, le nom en titre d'affiche.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partenaires",
  description: `Les partenaires de l'équipe D2 masculine du ${EQUIPE}, et comment les rejoindre.`,
};

type Partenaire = { id: number; nom: string; lien: string | null; logoCle: string | null };

function Case({ partenaire: p }: { partenaire: Partenaire }) {
  const logo = urlPhoto(p.logoCle);
  const contenu = logo ? (
    <span className="relative block h-full w-full">
      <Image
        src={logo}
        alt={p.nom}
        fill
        sizes="(min-width: 1024px) 20vw, 45vw"
        className="object-contain [filter:brightness(0)_invert(1)] transition-[filter] duration-[var(--duree)] group-hover:[filter:none] group-focus-visible:[filter:none]"
      />
    </span>
  ) : (
    <span className="titre-affiche titre-carte min-w-0 text-center text-balance hyphens-auto [overflow-wrap:anywhere] group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)]">
      {p.nom}
    </span>
  );
  const cadre = "group grid aspect-[3/2] place-items-center border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-4 sm:p-8";
  return (
    <li>
      {p.lien ? (
        <a href={p.lien} target="_blank" rel="noopener noreferrer" className={`${cadre} hover:border-[var(--color-craie-tenue)]`}>
          {contenu}
          <span className="sr-only"> (site du partenaire, nouvel onglet)</span>
        </a>
      ) : (
        <div className={cadre}>{contenu}</div>
      )}
    </li>
  );
}

export default async function PagePartenaires() {
  const liste = await partenairesAffiches();

  return (
    <>
      <EnTete actif="/partenaires" />
      <main id="contenu" className="min-h-[70svh]">
        <Volets>
          <section className="colonne-large pt-16 sm:pt-24">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
              <div className="min-w-0">
                <p className="etiquette text-[var(--color-turquoise)]">{EQUIPE}</p>
                <h1 className="titre-affiche titre-page mt-4">Partenaires</h1>
              </div>
              {liste.length > 0 ? (
                <p className="pb-2 sm:text-right">
                  <span className="titre-affiche chiffre-geant block">{String(liste.length).padStart(2, "0")}</span>
                  <span className="etiquette mt-2 block text-[var(--color-craie-douce)]">à nos côtés</span>
                </p>
              ) : null}
            </div>
            {liste.length > 0 ? (
              <p className="chapeau mt-[var(--titre-contenu)] max-w-[40ch] text-[var(--color-craie-douce)]">
                Merci à celles et ceux qui soutiennent l&apos;équipe, sur le terrain et dans la série.
              </p>
            ) : null}
          </section>

          {liste.length > 0 ? (
            <ul className={`colonne-large suite grid grid-cols-2 gap-[var(--gouttiere)] sm:grid-cols-3 ${liste.length >= 4 ? "lg:grid-cols-4" : ""}`}>
              {liste.map((p) => (
                <Case key={p.id} partenaire={p} />
              ))}
            </ul>
          ) : null}

          {/* L'appel en bandeau pleine largeur (fiche refonte, section 8) : plus d'encart a
              filet jaune, abandonne partout ailleurs. */}
          <section aria-labelledby="titre-rejoindre" className="grain relative chapitre mt-[var(--air-chapitre)] bg-[var(--color-nuit-violet)] pb-[var(--air-chapitre)]">
            <div className="colonne-large relative">
              <TitreChapitre id="titre-rejoindre">Devenir partenaire</TitreChapitre>
              <div className="mt-[var(--titre-contenu)] flex flex-wrap items-center gap-x-10 gap-y-6">
                <p className="chapeau max-w-[40ch] text-[var(--color-craie-douce)]">
                  Vous voulez soutenir l&apos;équipe et apparaître à ses côtés, sur le terrain et dans la série ? Écrivez-nous, on en parle.
                </p>
                <Link
                  href="/contact?sujet=partenariat"
                  className="inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
                >
                  Nous écrire
                </Link>
              </div>
            </div>
          </section>
        </Volets>
      </main>
      <PiedDePage />
    </>
  );
}
