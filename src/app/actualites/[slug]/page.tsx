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
    <Link href={`/actualites/${actualite.slug}`} className={`group block min-h-16 py-4 ${sens === "suivante" ? "sm:text-right" : ""}`}>
      <span className="etiquette text-[var(--color-craie-douce)]">
        {sens === "précédente" ? (
          <>
            <span aria-hidden="true">← </span>Plus ancienne
          </>
        ) : (
          <>
            Plus récente<span aria-hidden="true"> →</span>
          </>
        )}
      </span>
      <span className="titre-affiche mt-2 block hyphens-auto text-2xl text-balance break-words group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)]">
        {actualite.titre}
      </span>
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
    const actuelle = await nouvelleAdresseActualite(slug.toLowerCase());
    if (actuelle) permanentRedirect(`/actualites/${actuelle}`);
    notFound();
  }
  const { actualite, precedente, suivante } = donnees;
  const image = urlPhoto(actualite.imageCle);

  return (
    <>
      <EnTete actif="/actualites" />
      <main id="contenu" className="colonne-large min-h-[70svh] pt-10 pb-[var(--air-chapitre)] sm:pt-16">
        <p>
          <Link href="/actualites" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-craie-douce)] hover:text-[var(--color-craie)]">
            <span aria-hidden="true">← </span>Toutes les actualités
          </Link>
        </p>

        <article className="mt-10">
          <header>
            {actualite.publieLe ? (
              <p className="etiquette text-[var(--color-turquoise)]">
                Publié le <time dateTime={actualite.publieLe.toISOString()}>{dateLongue(actualite.publieLe)}</time>
              </p>
            ) : null}
            <h1 className="titre-affiche titre-chapitre mt-4 max-w-[20ch] text-balance">{actualite.titre}</h1>
            {actualite.chapo ? (
              <p className="chapeau mt-[var(--titre-contenu)] max-w-[46ch] text-[var(--color-craie)]">{actualite.chapo}</p>
            ) : null}
          </header>

          {image ? (
            // En bandeau, comme une une (fiche refonte, section 8).
            <div className="couche-propre relative suite aspect-video overflow-hidden bg-[var(--color-nuit-surface)] lg:aspect-[21/9]">
              <Image src={image} alt={actualite.imageDescription ?? ""} fill priority sizes="(min-width: 1344px) 84rem, 100vw" className="object-cover" />
            </div>
          ) : null}

          <TexteLeger texte={actualite.corps} className="texte-article suite" />
        </article>

        <div className="suite">
          <Partager titre={actualite.titre} />
        </div>

        {precedente || suivante ? (
          <nav aria-label="Autres actualités" className="suite grid gap-4 border-t border-[var(--color-nuit-trait)] sm:grid-cols-2">
            <LienVoisine actualite={precedente} sens="précédente" />
            <LienVoisine actualite={suivante} sens="suivante" />
          </nav>
        ) : null}
      </main>
      <PiedDePage />
    </>
  );
}
