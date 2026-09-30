import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Partager } from "@/components/public/actualites/partager";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { TexteLeger } from "@/components/texte-leger";
import { actualitePublique, nouvelleAdresseActualite } from "@/lib/actualites-publiques";
import { dateLongue } from "@/lib/dates";
import { urlPhoto } from "@/lib/effectif-public";

/**
 * La page d'une actualite (fiche fiches/actualites.md) : le titre, la date
 * en toutes lettres, le chapo plus grand, puis le corps dans une colonne de
 * lecture reglee pour le fond sombre (classe texte-article). Partager, puis
 * les deux actualites voisines.
 */
export const dynamic = "force-dynamic";

type Parametres = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Parametres): Promise<Metadata> {
  const { slug } = await params;
  const donnees = await actualitePublique(slug);
  if (!donnees) return { title: "Actualité introuvable" };
  const { actualite } = donnees;
  const image = urlPhoto(actualite.imageCle);
  return {
    title: actualite.titre,
    description: actualite.chapo ?? undefined,
    openGraph: {
      type: "article",
      title: actualite.titre,
      description: actualite.chapo ?? undefined,
      publishedTime: actualite.publieLe?.toISOString(),
      images: image ? [{ url: image }] : undefined,
    },
  };
}

type Voisine = { slug: string; titre: string; publieLe: Date | null } | null;

function LienVoisine({ actualite, sens }: { actualite: Voisine; sens: "précédente" | "suivante" }) {
  if (!actualite) return <span />;
  return (
    <Link href={`/actualites/${actualite.slug}`} className={`group block min-h-16 py-4 ${sens === "suivante" ? "text-right" : ""}`}>
      <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
        {sens === "précédente" ? "← Plus ancienne" : "Plus récente →"}
      </span>
      <span className="titre-affiche mt-2 block text-2xl text-balance group-hover:text-[var(--color-jaune)]">{actualite.titre}</span>
    </Link>
  );
}

export default async function PageActualite({ params }: Parametres) {
  const { slug } = await params;
  const donnees = await actualitePublique(slug);
  if (!donnees && slug !== slug.toLowerCase() && (await actualitePublique(slug.toLowerCase()))) {
    permanentRedirect(`/actualites/${slug.toLowerCase()}`);
  }
  if (!donnees) {
    const actuelle = await nouvelleAdresseActualite(slug);
    if (actuelle) permanentRedirect(`/actualites/${actuelle}`);
    notFound();
  }
  const { actualite, precedente, suivante } = donnees;
  const image = urlPhoto(actualite.imageCle);

  return (
    <>
      <EnTete actif="/actualites" />
      <main id="contenu" className="colonne-large pt-10 pb-24 sm:pt-16">
        <p>
          <Link href="/actualites" className="text-sm font-semibold text-[var(--color-craie-douce)] hover:text-[var(--color-craie)]">
            ← Toutes les actualités
          </Link>
        </p>

        <article className="mt-10">
          <header>
            {actualite.publieLe ? (
              <p className="text-sm text-[var(--color-craie-tenue)]">
                Publié le <time dateTime={actualite.publieLe.toISOString()}>{dateLongue(actualite.publieLe)}</time>
              </p>
            ) : null}
            <h1 className="titre-affiche mt-3 max-w-[18ch] hyphens-auto text-4xl text-balance break-words sm:text-7xl">{actualite.titre}</h1>
            {actualite.chapo ? (
              <p className="mt-8 max-w-[34em] text-xl leading-relaxed text-[var(--color-craie)]">{actualite.chapo}</p>
            ) : null}
          </header>

          {image ? (
            <div className="relative mt-12 aspect-[3/2] max-w-5xl overflow-hidden bg-[var(--color-nuit-surface)]">
              <Image src={image} alt="" fill priority sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" />
            </div>
          ) : null}

          <TexteLeger texte={actualite.corps} className="texte-article mt-12" />
        </article>

        <div className="mt-14">
          <Partager titre={actualite.titre} />
        </div>

        {precedente || suivante ? (
          <nav aria-label="Autres actualités" className="mt-16 grid gap-4 border-t border-[var(--color-nuit-trait)] sm:grid-cols-2">
            <LienVoisine actualite={precedente} sens="précédente" />
            <LienVoisine actualite={suivante} sens="suivante" />
          </nav>
        ) : null}
      </main>
      <PiedDePage saison={null} />
    </>
  );
}
