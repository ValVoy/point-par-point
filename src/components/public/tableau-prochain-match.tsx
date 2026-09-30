import { AfficheurLed } from "./afficheur-led";

/**
 * Le prochain match en tableau d'affichage de gymnase (fiche
 * fiches/palette.md) : un boitier noir mat, des legendes serigraphiees en
 * craie, et les seuls chiffres en LED ambre, segments eteints visibles. C'est
 * l'un des trois objets du site qui ont le droit de briller. Composant de
 * presentation pur : il recoit ce qu'il affiche, sans lire la base.
 *
 * Il s'allume par la variable CSS `--allume`, de 0 a 1, que la scene du
 * ballon fait monter a l'impact. Sans elle (JavaScript absent, mouvement
 * reduit), la valeur par defaut est 1 : le tableau est lisible d'emblee.
 * Tout ce qui est en chiffres LED existe aussi en texte clair.
 */

export type ProchainMatch = {
  adversaire: string;
  domicile: boolean;
  dateLisible: string;
  salle: string;
  compteRebours: { jours: number; heures: number; minutes: number };
};

const deux = (n: number) => String(Math.max(0, n)).padStart(2, "0");

export function TableauProchainMatch({ match }: { match: ProchainMatch }) {
  const { jours, heures, minutes } = match.compteRebours;
  const unites = [
    { valeur: deux(jours), nom: "Jours" },
    { valeur: deux(heures), nom: "Heures" },
    { valeur: deux(minutes), nom: "Min" },
  ];
  const nous = "VF Francheville";
  const [gauche, droite] = match.domicile ? [nous, match.adversaire] : [match.adversaire, nous];

  return (
    <div
      data-tableau
      className="rounded-sm border border-[var(--color-nuit-trait)] bg-[var(--color-boitier)] p-5 sm:p-8"
      style={{ boxShadow: "inset 0 0 0 6px var(--color-nuit)" }}
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-jaune)] uppercase">Prochain match</p>
      <div className="titre-affiche mt-3 flex items-start justify-between gap-4 text-2xl sm:text-4xl">
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
        Dans {jours} jours, {heures} heures et {minutes} minutes.
      </p>
      <div
        aria-hidden="true"
        className="mt-6 flex items-end justify-center gap-3 sm:gap-6"
        style={{ opacity: "calc(0.25 + 0.75 * var(--allume, 1))" }}
      >
        {unites.map((unite, index) => (
          <div key={unite.nom} className="flex items-end gap-3 sm:gap-6">
            {index > 0 ? <AfficheurLed valeur=":" className="mb-[1.1rem] text-5xl sm:mb-6 sm:text-7xl" /> : null}
            <div className="text-center">
              <AfficheurLed valeur={unite.valeur} className="text-6xl sm:text-8xl" />
              <span className="mt-2 block text-[0.65rem] tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
                {unite.nom}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-[var(--color-nuit-trait)] pt-4 text-center text-sm">
        {match.dateLisible} · {match.salle}
      </p>
    </div>
  );
}
