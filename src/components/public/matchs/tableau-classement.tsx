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
    <section aria-labelledby="titre-classement" className="colonne-large mt-20">
      <h2 id="titre-classement" className="titre-affiche text-4xl sm:text-5xl">
        {final ? "Classement final" : "Classement"}
      </h2>
      <p className="mt-2 text-[var(--color-craie-douce)]">
        {[intitule, misAJourLe ? `à jour au ${dateLongue(misAJourLe)}` : null].filter(Boolean).join(" · ")}
      </p>
      <table className="mt-6 w-full max-w-3xl border-collapse text-left tabular-nums">
        <thead>
          <tr className="border-b-2 border-[var(--color-craie)] text-xs font-semibold tracking-[0.15em] uppercase">
            <th scope="col" className="w-10 py-2 pr-2">
              <abbr title="Rang" className="no-underline">#</abbr>
            </th>
            <th scope="col" className="py-2 pr-2">Équipe</th>
            <th scope="col" className="w-14 py-2 text-right">
              <abbr title="Points" className="no-underline">Pts</abbr>
            </th>
            <th scope="col" className="w-10 py-2 text-right">
              <abbr title="Matchs joués" className="no-underline">J</abbr>
            </th>
            <th scope="col" className="w-10 py-2 text-right">
              <abbr title="Gagnés" className="no-underline">G</abbr>
            </th>
            <th scope="col" className="w-10 py-2 text-right">
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
              <td className="py-3 pr-2 pl-3 titre-affiche text-xl">{l.rang}</td>
              <th scope="row" className="py-3 pr-2 font-[inherit] break-words">
                {l.equipe}
                {l.estNous ? <span className="sr-only"> (notre équipe)</span> : null}
              </th>
              <td className="py-3 text-right text-lg font-semibold">{chiffre(l.points)}</td>
              <td className="py-3 text-right">{chiffre(l.joues)}</td>
              <td className="py-3 text-right">{chiffre(l.gagnes)}</td>
              <td className="py-3 text-right">{chiffre(l.perdus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
