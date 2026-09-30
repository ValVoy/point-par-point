import { dateEtHeure } from "@/lib/dates";
import { compteRebours } from "@/lib/resultats";
import { EQUIPE } from "@/lib/site";
import { CompteReboursLed } from "./compte-rebours-led";

/**
 * Le prochain match en tableau d'affichage de gymnase (fiche
 * fiches/palette.md) : un boitier noir mat, des legendes serigraphiees, et
 * les seuls chiffres en LED ambre, segments eteints visibles. C'est l'un des
 * objets du site qui ont le droit de briller.
 *
 * Il s'allume par la variable CSS `--allume`, de 0 a 1, que la scene du
 * ballon fait monter a l'impact. Sans elle (JavaScript absent, mouvement
 * reduit), la valeur par defaut est 1 : le tableau est lisible d'emblee.
 * Tout ce qui est en chiffres LED existe aussi en texte clair.
 */

export type ProchainMatch = {
  adversaire: string;
  domicile: boolean;
  joueLe: Date;
  salle?: string | null;
};

export function TableauProchainMatch({ match, maintenant }: { match: ProchainMatch; maintenant: Date }) {
  const initial = compteRebours(match.joueLe, maintenant);
  const [gauche, droite] = match.domicile ? [EQUIPE, match.adversaire] : [match.adversaire, EQUIPE];
  const quand = dateEtHeure(match.joueLe);

  return (
    <div
      data-tableau
      className="rounded-sm border border-[var(--color-nuit-trait)] bg-[var(--color-boitier)] p-5 sm:p-8"
      style={{ boxShadow: "inset 0 0 0 6px var(--color-nuit)" }}
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-jaune)] uppercase">Prochain match</p>
      <div className="titre-affiche mt-3 flex items-start justify-between gap-4 text-xl text-balance sm:text-4xl">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--color-craie-douce)]">Locaux</p>
          <p className="mt-1">{gauche}</p>
        </div>
        <div className="text-right">
          <p className="text-xs tracking-[0.2em] text-[var(--color-craie-douce)]">Visiteurs</p>
          <p className="mt-1">{droite}</p>
        </div>
      </div>

      <p className="sr-only">
        Dans {initial.jours} jours, {initial.heures} heures et {initial.minutes} minutes.
      </p>
      <div className="mt-6" style={{ opacity: "calc(0.25 + 0.75 * var(--allume, 1))" }}>
        <CompteReboursLed cible={match.joueLe.toISOString()} initial={initial} />
      </div>

      <p className="mt-6 border-t border-[var(--color-nuit-trait)] pt-4 text-center text-sm first-letter:uppercase">
        {quand}
        {match.salle ? ` · ${match.salle}` : ""}
      </p>
    </div>
  );
}
