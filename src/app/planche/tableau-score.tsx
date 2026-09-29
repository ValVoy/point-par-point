import type { CSSProperties } from "react";
import styles from "./planche.module.css";

/*
 * Le tableau d'affichage de gymnase, dans ses deux etats. Statique sur la
 * planche : le compte a rebours qui tourne et les chiffres qui roulent
 * viendront avec la grammaire du mouvement. Toute information affichee en
 * chiffres lumineux existe aussi en texte clair, pour les lecteurs d'ecran.
 */

const titre: CSSProperties = {
  fontFamily: "var(--titre)",
  fontWeight: 800,
  fontStretch: "var(--titre-largeur)",
  textTransform: "uppercase",
};

function Chiffres({ valeur, taille }: { valeur: string; taille: string }) {
  return (
    <span aria-hidden="true" className={`${styles.chiffre} ${taille}`} style={titre}>
      {valeur}
    </span>
  );
}

function Equipes() {
  return (
    <div className="flex items-start justify-between gap-4 text-sm sm:text-base" style={titre}>
      <div>
        <p className="text-xs tracking-[0.2em] text-[var(--craie-douce)]">Locaux</p>
        <p className="mt-1 text-2xl sm:text-4xl">VF Francheville</p>
      </div>
      <div className="text-right">
        <p className="text-xs tracking-[0.2em] text-[var(--craie-douce)]">Visiteurs</p>
        <p className="mt-1 text-2xl sm:text-4xl">Adversaire</p>
      </div>
    </div>
  );
}

function AvantMatch() {
  const unites = [
    { valeur: "04", nom: "Jours" },
    { valeur: "07", nom: "Heures" },
    { valeur: "12", nom: "Min" },
  ];
  return (
    <div className={`${styles.tableau} p-6 sm:p-10`}>
      <Equipes />
      <p className="sr-only">Prochain match dans 4 jours, 7 heures et 12 minutes.</p>
      <div className="mt-8 flex items-end justify-center gap-4 sm:gap-8">
        {unites.map((u, i) => (
          <div key={u.nom} className="flex items-end gap-4 sm:gap-8">
            {i > 0 ? <Chiffres valeur=":" taille="text-6xl sm:text-8xl" /> : null}
            <div className="text-center">
              <Chiffres valeur={u.valeur} taille="block text-7xl sm:text-[9rem]" />
              <span aria-hidden="true" className="mt-2 block text-xs tracking-[0.2em] text-[var(--craie-douce)]">
                {u.nom}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 border-t border-[var(--trait)] pt-5 text-center text-sm sm:text-base">
        Samedi 4 octobre · 20 h 30 · Gymnase du Bourg, Francheville
      </p>
    </div>
  );
}

function ApresMatch() {
  const sets: [number, number][] = [
    [25, 21],
    [22, 25],
    [25, 19],
    [25, 23],
  ];
  return (
    <div className={`${styles.tableau} p-6 sm:p-10`}>
      <Equipes />
      <p className="sr-only">
        Victoire trois sets à un : 25-21, 22-25, 25-19, 25-23.
      </p>
      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex justify-end gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`${styles.voyant} ${styles.voyantAllume}`} />
          ))}
        </div>
        <div className="flex items-end gap-4 sm:gap-8">
          <Chiffres valeur="3" taille="text-8xl sm:text-[11rem]" />
          <span aria-hidden="true" className={`${styles.chiffre} ${styles.chiffreEteint} text-6xl sm:text-8xl`} style={titre}>
            -
          </span>
          <Chiffres valeur="1" taille="text-8xl sm:text-[11rem]" />
        </div>
        <div className="flex gap-2" aria-hidden="true">
          <span className={`${styles.voyant} ${styles.voyantAllume}`} />
          <span className={styles.voyant} />
          <span className={styles.voyant} />
        </div>
      </div>
      <ol aria-hidden="true" className="mt-8 grid grid-cols-4 gap-2 border-t border-[var(--trait)] pt-5 text-center">
        {sets.map(([nous, eux], i) => (
          <li key={i}>
            <span className="block text-xs tracking-[0.2em] text-[var(--craie-douce)]" style={titre}>
              Set {i + 1}
            </span>
            <span className={`${nous > eux ? styles.chiffre : "text-[var(--craie-douce)]"} text-3xl sm:text-4xl`} style={titre}>
              {nous}-{eux}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function TableauScore() {
  return (
    <section className="border-t border-[var(--trait)] bg-[var(--nuit-surface)] px-4 py-20 sm:px-10 lg:px-16">
      <p className={styles.etiquette}>05 · Prochain match</p>
      <h2 className="mt-3 max-w-[24ch] text-3xl font-semibold text-balance sm:text-4xl">
        Le tableau de score du gymnase
      </h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--craie-douce)]">
        Avant le match, un compte à rebours. Après, le même tableau porte le
        score. La date et la salle restent toujours en texte clair.
      </p>
      <div className="mt-12 grid gap-8 xl:grid-cols-2">
        <AvantMatch />
        <ApresMatch />
      </div>
    </section>
  );
}
