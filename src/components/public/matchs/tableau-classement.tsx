import { dateLongue } from "@/lib/dates";
import { quantite } from "@/lib/resultats";

/**
 * Le classement de la poule (fiche fiches/classement.md) : un vrai tableau,
 * lisible au lecteur d'ecran, chiffres alignes. Notre ligne ressort par le
 * jaune et un filet, sans autre effet : c'est une information, pas une
 * affiche. La date de mise a jour est toujours dite.
 */

type Ligne = {
  id: number;
  rang: number;
  equipe: string;
  estNous: boolean;
  points: number | null;
  joues: number | null;
  gagnes: number | null;
  perdus: number | null;
};

const chiffre = (n: number | null) => (n === null ? <span aria-label="non renseigné">–</span> : n);

/**
 * Notre place, a cote du tableau en grand ecran, au-dessus au telephone
 * (arbitrage du 02-10-2026) : le vide a droite du tableau devient l'information
 * qu'on vient chercher. Rang en chiffre geant, points, ecart au premier.
 */
function NotrePlace({ lignes }: { lignes: Ligne[] }) {
  const nous = lignes.find((l) => l.estNous);
  if (!nous) return null;
  const premier = lignes.find((l) => l.rang === 1);
  const ecart = premier && premier !== nous && premier.points !== null && nous.points !== null ? premier.points - nous.points : null;
  const suffixe = nous.rang === 1 ? "er" : "e";
  return (
    <div className="lg:sticky lg:top-8">
      <p className="etiquette text-[var(--color-craie-douce)]">Notre place</p>
      <p className="titre-affiche chiffre-geant mt-2 text-[var(--color-jaune)]">
        {nous.rang}
        <sup className="ml-1 align-super font-sans text-[0.3em] font-semibold normal-case">{suffixe}</sup>
        <span className="ml-3 text-[0.35em] text-[var(--color-craie-douce)]">sur {lignes.length}</span>
      </p>
      <p className="corps mt-4 text-[var(--color-craie-lecture)]">
        {nous.points !== null ? quantite(nous.points, "point") : null}
        {nous.rang === 1
          ? " · en tête"
          : ecart === 0
            ? " · à égalité de points avec le premier"
            : ecart !== null && ecart > 0
              ? ` · ${quantite(ecart, "point")} de moins que le premier`
              : null}
      </p>
    </div>
  );
}

export function TableauClassement({
  intitule,
  misAJourLe,
  lignes,
  final,
}: {
  intitule: string | null;
  misAJourLe: Date | null;
  lignes: Ligne[];
  final: boolean;
}) {
  return (
    <section aria-labelledby="titre-classement" className="colonne-large chapitre">
      <h2 id="titre-classement" data-volet className="titre-affiche titre-chapitre">
        {final ? "Classement final" : "Classement"}
      </h2>
      <p className="corps mt-4 text-[var(--color-craie-douce)]">
        {[intitule, misAJourLe ? `à jour au ${dateLongue(misAJourLe)}` : null].filter(Boolean).join(" · ")}
      </p>
      {/* Colonnes de chiffres serrees au telephone (le nom passait sur deux lignes), et une
          marge a droite du dernier chiffre, comme a gauche du rang (retour du 02-10-2026). */}
      <div className="mt-[var(--titre-contenu)] grid items-start gap-[var(--air-suite)] lg:grid-cols-[minmax(0,48rem)_minmax(0,1fr)] lg:gap-16">
      <NotrePlace lignes={lignes} />
      <table className="w-full border-collapse text-left tabular-nums lg:order-first">
        {/* Annonce du tableau pour qui navigue de tableau en tableau (audit D31). */}
        <caption className="sr-only">
          {[final ? "Classement final" : "Classement", intitule, misAJourLe ? `à jour au ${dateLongue(misAJourLe)}` : null].filter(Boolean).join(", ")}
        </caption>
        <thead>
          <tr className="etiquette border-b-2 border-[var(--color-craie)]">
            <th scope="col" className="w-9 py-2 pr-1 pl-3 sm:w-12">
              <abbr title="Rang" className="no-underline">#</abbr>
            </th>
            <th scope="col" className="py-2 pr-2">Équipe</th>
            <th scope="col" className="w-11 py-2 text-right sm:w-16">
              <abbr title="Points" className="no-underline">Pts</abbr>
            </th>
            <th scope="col" className="w-8 py-2 text-right sm:w-12">
              <abbr title="Matchs joués" className="no-underline">J</abbr>
            </th>
            <th scope="col" className="w-8 py-2 text-right sm:w-12">
              <abbr title="Gagnés" className="no-underline">G</abbr>
            </th>
            <th scope="col" className="w-11 py-2 pr-3 text-right sm:w-16">
              <abbr title="Perdus" className="no-underline">P</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((l) => (
            <tr
              key={l.id}
              aria-current={l.estNous ? "true" : undefined}
              className={`border-b border-[var(--color-nuit-trait)] ${l.estNous ? "bg-[var(--color-nuit-surface)] font-semibold text-[var(--color-jaune)] shadow-[inset_4px_0_0_var(--color-jaune)]" : "text-[var(--color-craie-lecture)]"}`}
            >
              <td className="py-3 pr-1 pl-3 titre-affiche text-xl">{l.rang}</td>
              <th scope="row" className="py-3 pr-2 font-[inherit] break-words">
                {l.equipe}
                {l.estNous ? <span className="sr-only"> (notre équipe)</span> : null}
              </th>
              <td className="py-3 text-right text-lg font-semibold">{chiffre(l.points)}</td>
              <td className="py-3 text-right">{chiffre(l.joues)}</td>
              <td className="py-3 text-right">{chiffre(l.gagnes)}</td>
              <td className="py-3 pr-3 text-right">{chiffre(l.perdus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}
