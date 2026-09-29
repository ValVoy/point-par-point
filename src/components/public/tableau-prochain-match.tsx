import type { CSSProperties } from "react";

/**
 * Le prochain match en tableau d'affichage de gymnase. Composant de
 * presentation pur : il recoit ce qu'il affiche, sans lire la base.
 *
 * Il s'allume par la variable CSS `--allume`, de 0 a 1, que la scene du
 * ballon fait monter a l'impact. Sans elle (JavaScript absent, mouvement
 * reduit), la valeur par defaut est 1 : le tableau est lisible d'emblee.
 * Toute information en chiffres lumineux existe aussi en texte clair.
 */

export type ProchainMatch = {
  adversaire: string;
  domicile: boolean;
  dateLisible: string;
  salle: string;
  compteRebours: { jours: number; heures: number; minutes: number };
};

const lueur: CSSProperties = {
  color: "var(--color-turquoise)",
  opacity: "calc(0.18 + 0.82 * var(--allume, 1))",
  textShadow:
    "0 0 calc(14px * var(--allume, 1)) rgb(62 197 204 / 0.55), 0 0 2px rgb(191 241 243 / calc(0.9 * var(--allume, 1)))",
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
      className="rounded-md border border-[var(--color-nuit-trait)] p-5 sm:p-8"
      style={{
        background:
          "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.05) 1px, transparent 0) 0 0 / 6px 6px, #05060c",
        boxShadow: "inset 0 0 0 6px #0d101c",
      }}
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">
        Prochain match
      </p>
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
      <div aria-hidden="true" className="mt-5 flex items-end justify-center gap-3 sm:gap-6">
        {unites.map((unite, index) => (
          <div key={unite.nom} className="flex items-end gap-3 sm:gap-6">
            {index > 0 ? (
              <span className="titre-affiche text-5xl sm:text-7xl" style={lueur}>
                :
              </span>
            ) : null}
            <div className="text-center">
              <span className="titre-affiche block text-6xl sm:text-8xl" style={lueur}>
                {unite.valeur}
              </span>
              <span className="mt-1 block text-[0.65rem] tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
                {unite.nom}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-[var(--color-nuit-trait)] pt-4 text-center text-sm">
        {match.dateLisible} · {match.salle}
      </p>
    </div>
  );
}
