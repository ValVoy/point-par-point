import { Motif } from "@/components/motif";
import { ResultatsPrecedents } from "@/components/public/resultats-precedents";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";
import { TableauResultat, type Resultat } from "@/components/public/tableau-resultat";
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

const DERNIER: Resultat = {
  adversaire: "VBC Sainte-Colombe",
  domicile: false,
  dateLisible: "Samedi 27 septembre",
  sets: [[25, 21], [22, 25], [25, 19], [25, 23]],
};

const PRECEDENTS: Resultat[] = [
  { adversaire: "US Chantemerle", domicile: true, dateLisible: "samedi 20 septembre", sets: [[23, 25], [25, 22], [21, 25], [25, 23], [12, 15]] },
  { adversaire: "Volley Club des Trois Rivières", domicile: true, dateLisible: "samedi 13 septembre", sets: [[25, 16], [25, 23], [25, 19]] },
  { adversaire: "AS Montbrison", domicile: false, dateLisible: "samedi 6 septembre", sets: [[22, 25], [25, 27], [20, 25]] },
  { adversaire: "Entente Val-Fleury", domicile: true, dateLisible: "samedi 30 août", sets: [[25, 20], [23, 25], [25, 18], [25, 22]] },
];

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

      <div className="grain relative overflow-hidden border-y border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)]">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 opacity-[0.14] [mask-image:linear-gradient(90deg,transparent,#000)]">
          <Motif contour sombre="var(--color-turquoise)" taille={32} />
        </div>
        <div className="colonne-large relative py-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">
            L&apos;équipe · turquoise en accent
          </p>
          <p className="titre-affiche mt-3 text-6xl sm:text-8xl">
            Douze <span className="text-[var(--color-turquoise)]">joueurs</span>
          </p>
          <p className="mt-4 max-w-[52ch] leading-relaxed text-[var(--color-craie-douce)]">
            Le turquoise du maillot en accent : un mot, un filet, le motif qui s&apos;efface. Plus de
            grand aplat terne.
          </p>
        </div>
      </div>

      <div className="grain relative bg-[var(--color-nuit-violet)] py-16">
        <div className="colonne-large relative">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
            Les matchs · chapitre violet
          </p>
          <p className="titre-affiche mt-3 text-6xl sm:text-8xl">Au tableau</p>
          <div className="mt-10 grid items-start gap-6 xl:grid-cols-2">
            <TableauResultat resultat={DERNIER} />
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
          <p className="mt-16 text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
            Avant ça
          </p>
        </div>
        <div className="relative mt-6">
          <ResultatsPrecedents resultats={PRECEDENTS} />
        </div>
      </div>
    </section>
  );
}
