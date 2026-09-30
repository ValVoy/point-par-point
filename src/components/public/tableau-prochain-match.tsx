import type { CSSProperties } from "react";

/**
 * Le prochain match en affiche de programme : un aplat violet, la couleur des
 * matchs, les chiffres en reserve de papier et le jaune du ballon pour seul
 * eclat (fiche fiches/palette.md). Composant de presentation pur : il recoit
 * ce qu'il affiche, sans lire la base.
 *
 * L'encre se pose par la variable CSS `--allume`, de 0 a 1, que la scene du
 * ballon fait monter a l'impact. Sans elle (JavaScript absent, mouvement
 * reduit), la valeur par defaut est 1 : le tableau est lisible d'emblee.
 * Tout ce qui est en gros chiffres existe aussi en texte clair.
 */

export type ProchainMatch = {
  adversaire: string;
  domicile: boolean;
  dateLisible: string;
  salle: string;
  compteRebours: { jours: number; heures: number; minutes: number };
};

const encrage: CSSProperties = {
  opacity: "calc(0.18 + 0.82 * var(--allume, 1))",
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
      data-surface="violet"
      className="bg-[var(--color-violet)] p-5 text-[var(--color-papier)] sm:p-8"
    >
      <p className="inline-block bg-[var(--color-jaune)] px-2 py-1 text-xs font-semibold tracking-[0.2em] text-[var(--color-encre)] uppercase">
        Prochain match
      </p>
      <div className="titre-affiche mt-3 flex items-start justify-between gap-4 text-2xl sm:text-4xl">
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--color-papier)]/80">Locaux</p>
          <p className="mt-1">{gauche}</p>
        </div>
        <div className="text-right">
          <p className="text-xs tracking-[0.2em] text-[var(--color-papier)]/80">Visiteurs</p>
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
              <span className="titre-affiche text-5xl sm:text-7xl" style={encrage}>
                :
              </span>
            ) : null}
            <div className="text-center">
              <span className="titre-affiche block text-6xl sm:text-8xl" style={encrage}>
                {unite.valeur}
              </span>
              <span className="mt-1 block text-[0.65rem] tracking-[0.2em] text-[var(--color-papier)]/80 uppercase">
                {unite.nom}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-[var(--color-papier)]/30 pt-4 text-center text-sm">
        {match.dateLisible} · {match.salle}
      </p>
    </div>
  );
}
