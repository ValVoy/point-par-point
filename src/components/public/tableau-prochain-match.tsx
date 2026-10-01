import { joursAvant, quandDuMatch } from "@/lib/horaire";
import { compteRebours, quantite } from "@/lib/resultats";
import { EQUIPE } from "@/lib/site";
import { AfficheurLed } from "./afficheur-led";
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
  /** Faux quand l'horaire est a confirmer : le tableau compte alors en jours. */
  heureConnue?: boolean;
  salle?: string | null;
};

/**
 * Sans horaire, pas de faux compte a rebours a la seconde : le tableau dit
 * « J-16 », et « C'est aujourd'hui » le jour venu (demande du 01-10-2026).
 * Le compte change a minuit, la page est rendue a chaque visite.
 */
function JoursLed({ jours }: { jours: number }) {
  const texte = jours === 0 ? "C'est aujourd'hui, horaire à confirmer." : `Dans ${quantite(jours, "jour")}, horaire à confirmer.`;
  return (
    <div>
      <p className="sr-only">{texte}</p>
      <div aria-hidden="true" className="text-center">
        <AfficheurLed valeur={`J-${Math.min(jours, 99)}`} className="text-[2.75rem] sm:text-7xl" />
        <span className="etiquette mt-2 block text-[var(--color-craie-douce)]">
          {jours === 0 ? "C'est aujourd'hui" : "Horaire à confirmer"}
        </span>
      </div>
    </div>
  );
}

export function TableauProchainMatch({ match, maintenant }: { match: ProchainMatch; maintenant: Date }) {
  const initial = compteRebours(match.joueLe, maintenant);
  const [gauche, droite] = match.domicile ? [EQUIPE, match.adversaire] : [match.adversaire, EQUIPE];
  const heureConnue = match.heureConnue !== false;
  const quand = quandDuMatch({ joueLe: match.joueLe, heureConnue });

  return (
    <div
      data-tableau
      className="rounded-sm border border-[var(--color-nuit-trait)] bg-[var(--color-boitier)] p-5 sm:p-8"
      style={{ boxShadow: "inset 0 0 0 6px var(--color-nuit)" }}
    >
      <p className="etiquette text-[var(--color-jaune)]">Prochain match</p>
      <div className="titre-affiche mt-3 flex items-start justify-between gap-4 text-xl text-balance sm:text-4xl">
        <div>
          <p className="etiquette font-normal text-[var(--color-craie-douce)]">Locaux</p>
          <p className="mt-1">{gauche}</p>
        </div>
        <div className="text-right">
          <p className="etiquette font-normal text-[var(--color-craie-douce)]">Visiteurs</p>
          <p className="mt-1">{droite}</p>
        </div>
      </div>

      <div className="mt-6" style={{ opacity: "calc(0.25 + 0.75 * var(--allume, 1))" }}>
        {heureConnue ? (
          <CompteReboursLed cible={match.joueLe.toISOString()} initial={initial} />
        ) : (
          <JoursLed jours={joursAvant(match.joueLe, maintenant)} />
        )}
      </div>

      <p className="mt-6 border-t border-[var(--color-nuit-trait)] pt-4 text-center text-sm first-letter:uppercase">
        {quand}
        {match.salle ? ` · ${match.salle}` : ""}
      </p>
    </div>
  );
}
