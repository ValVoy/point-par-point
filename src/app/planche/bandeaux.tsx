import { PastilleResultat } from "@/components/pastille-resultat";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";
import styles from "./planche.module.css";

/*
 * Une page en vrai : des chapitres, chacun dans sa teinte, et la lumiere
 * seulement sur le tableau. Chaque couleur tient sa fonction : turquoise
 * l'equipe, violet les matchs, jaune ce qui est en direct ou nouveau. Les
 * etats se font par inversion ou remplissage, jamais par une lueur.
 */

function Etats() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <button
        type="button"
        className="bg-[var(--color-jaune)] px-5 py-3 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
      >
        Voir le calendrier
      </button>
      <button
        type="button"
        className="border-2 border-[var(--color-turquoise)] px-5 py-2.5 font-semibold text-[var(--color-turquoise-clair)] transition-colors duration-[80ms] hover:bg-[var(--color-turquoise)] hover:text-[var(--color-nuit)]"
      >
        Toute l&apos;équipe
      </button>
      <a
        href="#bandeaux"
        className="font-semibold text-[var(--color-turquoise-clair)] underline decoration-2 underline-offset-4 transition-colors duration-[80ms] hover:bg-[var(--color-turquoise)] hover:text-[var(--color-nuit)]"
      >
        Un lien dans le texte
      </a>
      <span className="bg-[var(--color-jaune)] px-2 py-1 text-xs font-semibold tracking-[0.2em] text-[var(--color-nuit)] uppercase">
        Nouvel épisode
      </span>
      <span className="text-sm font-semibold text-[var(--color-jaune-eteint)]">Dans 3 jours</span>
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
    <ul className="mt-8 border-t border-[var(--color-nuit-trait)]">
      {lignes.map(([date, victoire, score], i) => (
        <li
          key={date}
          className={`flex items-center gap-4 border-b border-[var(--color-nuit-trait)] px-3 py-3 ${
            i % 2 === 1 ? "bg-[var(--color-nuit)]/40" : ""
          }`}
        >
          <PastilleResultat victoire={victoire} className="text-lg" />
          <span className="flex-1">{date}</span>
          <span className={`titre-affiche text-3xl ${victoire ? "" : "font-normal text-[var(--color-craie-douce)]"}`}>
            {score}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Bandeaux() {
  return (
    <section id="bandeaux" className="border-t border-[var(--color-nuit-trait)]">
      <div className="grain relative">
        <div className="colonne-large relative py-20">
          <p className={styles.etiquette}>02 · Chapitres et états</p>
          <h2 className="titre-affiche mt-3 text-5xl sm:text-7xl">Mat, sauf ce qui éclaire</h2>
          <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--color-craie-douce)]">
            Survol par inversion ou remplissage, jamais par une lueur. Le focus clavier est un contour
            jaune net (touche Tab pour le voir).
          </p>
          <Etats />
        </div>
      </div>

      <div className="grain relative bg-[var(--color-turquoise)] text-[var(--color-nuit)]">
        <div className="colonne-large relative py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">L&apos;équipe · turquoise</p>
          <p className="titre-affiche mt-3 text-6xl sm:text-8xl">Douze joueurs</p>
          <p className="mt-4 max-w-[52ch] leading-relaxed">
            Un aplat du maillot, la nuit par-dessus (5,8 pour 1).
          </p>
        </div>
      </div>

      <div className="grain relative bg-[var(--color-nuit-violet)]">
        <div className="colonne-large relative py-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
            Les matchs · chapitre violet
          </p>
          <p className="titre-affiche mt-3 text-6xl sm:text-8xl">Derniers résultats</p>
          <Resultats />
          <div className="mt-12 max-w-3xl">
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
