import Link from "next/link";
import { MesureAudience } from "@/components/mesure-audience";
import { saisonCourante } from "@/lib/saisons";
import { EQUIPE, NOM_DU_SITE } from "@/lib/site";
import { RUBRIQUES, VITRINE } from "../entete";

/**
 * Le pied de page commun : le nom, les rubriques (le seul endroit ou toutes
 * se lisent d'un coup, meme sur un telephone), la saison courante, lue ici
 * pour etre la meme sur toutes les pages, et les deux pages juridiques.
 *
 * Il porte aussi le script de mesure d'audience : present sur toutes les pages
 * publiques et sur aucune page d'administration, il n'execute jamais de code
 * tiers dans l'origine de l'administration (audit S9).
 */
export async function PiedDePage() {
  const saison = (await saisonCourante())?.libelle ?? null;
  return (
    <footer className="border-t border-[var(--color-nuit-trait)]">
      <div className="colonne-large flex flex-wrap items-start justify-between gap-x-10 gap-y-6 py-10 text-sm text-[var(--color-craie-douce)]">
        <p>
          <Link href="/" className="titre-affiche mr-3 text-2xl text-[var(--color-craie)]">
            {NOM_DU_SITE}
          </Link>
          {EQUIPE}
        </p>
        <nav aria-label="Rubriques du site">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 font-semibold">
            {[...RUBRIQUES, ...VITRINE].map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="inline-flex min-h-12 items-center hover:text-[var(--color-craie)]">
                  {r.nom}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-wrap items-center gap-x-6 sm:self-center">
          {saison ? <p>Saison {saison}</p> : null}
          <Link href="/mentions-legales" className="inline-flex min-h-12 items-center hover:text-[var(--color-craie)]">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="inline-flex min-h-12 items-center hover:text-[var(--color-craie)]">
            Confidentialité
          </Link>
        </div>
      </div>
      <MesureAudience />
    </footer>
  );
}
