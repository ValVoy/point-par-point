import { dateLongue } from "@/lib/dates";

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
      <table className="mt-[var(--titre-contenu)] w-full max-w-3xl border-collapse text-left tabular-nums">
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
    </section>
  );
}
