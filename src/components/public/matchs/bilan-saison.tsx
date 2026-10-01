import type { Bilan } from "@/lib/bilan";

/**
 * Le bilan de la saison, en tete de la page Matchs (complement du
 * 01-10-2026) : des chiffres geants sur des legendes minuscules (fiche
 * refonte-respiration.md, veille 19.2). Notre total
 * d'abord, comme partout dans les listes. Pas de pourcentage : sur huit
 * matchs, il donnerait une precision qu'il n'a pas.
 */

const etiquette = "etiquette text-[var(--color-craie-douce)]";
const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? "s" : ""}`;

function VictoiresDefaites({ victoires, defaites }: { victoires: number; defaites: number }) {
  return (
    <>
      <span aria-hidden="true">
        {victoires}
        <span className="mx-1 text-[0.5em] text-[var(--color-craie-douce)]">V</span>
        {defaites}
        <span className="ml-1 text-[0.5em] text-[var(--color-craie-douce)]">D</span>
      </span>
      <span className="sr-only">
        {pluriel(victoires, "victoire")}, {pluriel(defaites, "défaite")}
      </span>
    </>
  );
}

export function BilanSaison({ bilan: b }: { bilan: Bilan | null }) {
  if (!b) return null;
  const aDomicile = b.domicile.victoires + b.domicile.defaites > 0;
  const aLExterieur = b.exterieur.victoires + b.exterieur.defaites > 0;
  return (
    <div className="mt-[var(--titre-contenu)]">
      <dl className="flex flex-wrap items-end gap-x-12 gap-y-8 sm:gap-x-16">
        <div>
          <dt className={etiquette}>Bilan</dt>
          <dd className="titre-affiche chiffre-geant mt-2">
            <VictoiresDefaites victoires={b.victoires} defaites={b.defaites} />
          </dd>
        </div>
        <div>
          <dt className={etiquette}>Sets</dt>
          <dd className="titre-affiche chiffre-geant mt-2">
            <span aria-hidden="true">
              {b.setsPour}
              <span className="mx-1 text-[var(--color-craie-douce)]">-</span>
              {b.setsContre}
            </span>
            <span className="sr-only">
              {pluriel(b.setsPour, "set")} gagné{b.setsPour > 1 ? "s" : ""}, {b.setsContre} perdu{b.setsContre > 1 ? "s" : ""}
            </span>
          </dd>
        </div>
        {aDomicile ? (
          <div>
            <dt className={etiquette}>À domicile</dt>
            <dd className="titre-affiche titre-chapitre mt-2">
              <VictoiresDefaites {...b.domicile} />
            </dd>
          </div>
        ) : null}
        {aLExterieur ? (
          <div>
            <dt className={etiquette}>À l&apos;extérieur</dt>
            <dd className="titre-affiche titre-chapitre mt-2">
              <VictoiresDefaites {...b.exterieur} />
            </dd>
          </div>
        ) : null}
      </dl>
      {b.serie ? (
        <p className={`mt-5 text-lg font-semibold ${b.serie.victoire ? "text-[var(--color-jaune)]" : "text-[var(--color-craie-douce)]"}`}>
          {b.serie.longueur} {b.serie.victoire ? "victoires" : "défaites"} de suite
        </p>
      ) : null}
    </div>
  );
}
