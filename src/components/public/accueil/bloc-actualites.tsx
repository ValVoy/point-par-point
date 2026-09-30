import Link from "next/link";
import { dateLongue } from "@/lib/dates";

/**
 * Les dernieres actualites sur l'accueil (fiche fiches/actualites.md) : trois
 * lignes datees au plus. Le bloc disparait s'il n'y a rien, ou si la plus
 * recente a plus de quatre-vingt-dix jours : mieux vaut pas de bloc qu'un
 * bloc qui montre l'abandon.
 */

const PEREMPTION = 90 * 24 * 3_600_000;

type Actualite = { id: number; slug: string; titre: string; chapo: string | null; publieLe: Date | null };

export function BlocActualites({ actualites, maintenant }: { actualites: Actualite[]; maintenant: Date }) {
  const recente = actualites[0]?.publieLe;
  if (!recente || maintenant.getTime() - recente.getTime() > PEREMPTION) return null;

  return (
    <section aria-labelledby="titre-actualites" className="colonne-large py-24 sm:py-32" data-apparait>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--color-craie)] pb-3">
        <h2 id="titre-actualites" className="titre-affiche text-5xl sm:text-6xl">
          Les actualités
        </h2>
        <Link
          href="/actualites"
          className="inline-flex min-h-12 items-center font-semibold underline decoration-2 underline-offset-4 hover:text-[var(--color-jaune)]"
        >
          Toutes les actualités
        </Link>
      </div>
      <ul className="grid lg:grid-cols-3 lg:gap-8">
        {actualites.map((a) => (
          <li key={a.id}>
            <Link
              href={`/actualites/${a.slug}`}
              className="group block border-b border-[var(--color-nuit-trait)] py-6 lg:border-b-0"
            >
              <span className="text-sm text-[var(--color-craie-tenue)]">
                {a.publieLe ? `Publié le ${dateLongue(a.publieLe)}` : null}
              </span>
              <span className="titre-affiche mt-2 block text-3xl text-balance group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)]">
                {a.titre}
              </span>
              {a.chapo ? <span className="mt-2 line-clamp-3 block text-[var(--color-craie-douce)]">{a.chapo}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
