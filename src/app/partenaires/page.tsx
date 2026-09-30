import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
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
    <span className="titre-affiche hyphens-auto text-center text-xl text-balance break-words group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)] sm:text-3xl">
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
      <EnTete />
      <main id="contenu" className="colonne-large pt-16 pb-24 sm:pt-24">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">{EQUIPE}</p>
        <h1 className="titre-affiche mt-3 text-6xl sm:text-8xl">Partenaires</h1>
        {liste.length > 0 ? (
          <>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
              Merci à celles et ceux qui soutiennent l&apos;équipe, sur le terrain et dans la série.
            </p>
            <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {liste.map((p) => (
                <Case key={p.id} partenaire={p} />
              ))}
            </ul>
          </>
        ) : null}

        <section aria-labelledby="titre-rejoindre" className="mt-20 max-w-3xl border-l-4 border-[var(--color-jaune)] bg-[var(--color-nuit-surface)] px-6 py-8">
          <h2 id="titre-rejoindre" className="titre-affiche text-4xl">
            Devenir partenaire
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-[var(--color-craie-douce)]">
            Vous voulez soutenir l&apos;équipe et apparaître à ses côtés ? Écrivez-nous, on en parle.
          </p>
          <Link
            href="/contact?sujet=partenariat"
            className="mt-6 inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
          >
            Nous écrire
          </Link>
        </section>
      </main>
      <PiedDePage />
    </>
  );
}
