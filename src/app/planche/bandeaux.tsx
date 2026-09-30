import { PastilleResultat } from "@/components/pastille-resultat";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";
import styles from "./planche.module.css";

/*
 * Le rythme d'une page, en vrai : papier, couleur, papier. Jamais deux
 * bandeaux de couleur en contact, jamais turquoise contre violet. Chaque
 * couleur tient sa fonction : turquoise l'equipe, violet les matchs, jaune ce
 * qui est en direct ou nouveau.
 */

function Etats() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <button
        type="button"
        className="bg-[var(--color-jaune)] px-5 py-3 font-semibold text-[var(--color-encre)] transition-colors duration-[80ms] hover:bg-[var(--color-encre)] hover:text-[var(--color-jaune)]"
      >
        Voir le calendrier
      </button>
      <button
        type="button"
        className="border-2 border-[var(--color-accent)] px-5 py-2.5 font-semibold text-[var(--color-accent)] transition-colors duration-[80ms] hover:bg-[var(--color-accent)] hover:text-[var(--color-papier)]"
      >
        Toute l&apos;équipe
      </button>
      <a
        href="#bandeaux"
        className="font-semibold text-[var(--color-accent)] underline decoration-2 underline-offset-4 transition-colors duration-[80ms] hover:bg-[var(--color-jaune)] hover:text-[var(--color-encre)]"
      >
        Un lien dans le texte
      </a>
      <span className="bg-[var(--color-jaune)] px-2 py-1 text-xs font-semibold tracking-[0.2em] text-[var(--color-encre)] uppercase">
        Nouvel épisode
      </span>
      <span className="text-sm font-semibold text-[var(--color-ocre)]">Ocre : 3 jours</span>
    </div>
  );
}

function Resultats() {
  const lignes: [string, boolean, string][] = [
    ["Samedi 27 septembre", true, "3-1"],
    ["Samedi 20 septembre", false, "2-3"],
    ["Samedi 13 septembre", true, "3-0"],
  ];
  return (
    <ul className="mt-8 border-t border-[var(--color-trait)]">
      {lignes.map(([date, victoire, score], i) => (
        <li
          key={date}
          className={`flex items-center gap-4 border-b border-[var(--color-trait)] px-3 py-3 ${
            i % 2 === 1 ? "bg-[var(--color-papier-creuse)]" : ""
          }`}
        >
          <PastilleResultat victoire={victoire} className="text-lg" />
          <span className="flex-1">{date}</span>
          <span className={`titre-affiche text-3xl ${victoire ? "" : "font-normal text-[var(--color-encre-douce)]"}`}>
            {score}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Bandeaux() {
  return (
    <section id="bandeaux" className="border-t border-[var(--color-trait)]">
      <div className="grain relative">
        <div className="colonne-large relative py-20">
          <p className={styles.etiquette}>02 · Bandeaux et états</p>
          <h2 className="titre-affiche mt-3 text-5xl sm:text-7xl">Papier, couleur, papier</h2>
          <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--color-encre-douce)]">
            Le jaune n&apos;est jamais un fond de section : un bouton, une pastille, un survol. Le
            focus clavier est un contour d&apos;encre, en papier sur le violet (touche Tab pour le
            voir).
          </p>
          <Etats />
        </div>
      </div>

      <div className="grain relative bg-[var(--color-turquoise)] text-[var(--color-encre)]">
        <div className="colonne-large relative py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">L&apos;équipe · turquoise</p>
          <p className="titre-affiche mt-3 text-6xl sm:text-8xl">Douze joueurs</p>
          <p className="mt-4 max-w-[52ch] leading-relaxed">
            Sur le turquoise, l&apos;encre (5,4 pour 1). Le papier n&apos;y sert qu&apos;aux très gros
            titres.
          </p>
        </div>
      </div>

      <div className="grain relative">
        <div className="colonne-large relative py-16">
          <p className={styles.etiquette}>Derniers résultats</p>
          <Resultats />
        </div>
      </div>

      <div data-surface="violet" className="grain relative bg-[var(--color-violet)] text-[var(--color-papier)]">
        <div className="colonne-large relative py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">Les matchs · violet</p>
          <p className="titre-affiche mt-3 text-6xl sm:text-8xl">Samedi, 20 h 30</p>
          <a href="#bandeaux" className="mt-6 inline-block font-semibold underline decoration-2 underline-offset-4">
            Le calendrier complet
          </a>
        </div>
      </div>

      <div className="grain relative">
        <div className="colonne-large relative py-16">
          <p className={styles.etiquette}>Le tableau du prochain match</p>
          <div className="mt-8 max-w-3xl">
            <TableauProchainMatch
              match={{
                adversaire: "Adversaire",
                domicile: true,
                dateLisible: "Samedi 4 octobre · 20 h 30",
                salle: "Gymnase du Bourg, Francheville",
                compteRebours: { jours: 4, heures: 7, minutes: 12 },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
