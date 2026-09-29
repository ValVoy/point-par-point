import {
  Archivo,
  Big_Shoulders,
  Hanken_Grotesk,
  Sofia_Sans_Extra_Condensed,
} from "next/font/google";

/*
 * Les trois condensees candidates pour les titres, plus la police de texte.
 * Chargees ici et nulle part ailleurs : tant que la planche n'a pas tranche,
 * aucune ne touche la mise en page racine.
 */

export const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--police-big-shoulders",
  display: "swap",
});

// L'axe de largeur est ce qui distingue Archivo : il s'anime, ce qui ouvre
// la typographie cinetique sans charger une seconde police.
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--police-archivo",
  display: "swap",
});

export const sofiaCondensee = Sofia_Sans_Extra_Condensed({
  subsets: ["latin"],
  variable: "--police-sofia",
  display: "swap",
});

export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--police-hanken",
  display: "swap",
});

export const variablesPolices = [
  bigShoulders.variable,
  archivo.variable,
  sofiaCondensee.variable,
  hanken.variable,
].join(" ");

export type Candidate = {
  id: string;
  nom: string;
  famille: string;
  graisse: number;
  largeur?: string;
  pourquoi: string;
  reserve: string;
};

export const CANDIDATES: Candidate[] = [
  {
    id: "a",
    nom: "Big Shoulders",
    famille: "var(--police-big-shoulders)",
    graisse: 800,
    pourquoi:
      "Née de la signalétique de Chicago. Des angles droits, une vraie allure de tableau d'affichage et de numéro floqué.",
    reserve: "Très typée : elle donne le ton à tout le site, en bien comme en trop.",
  },
  {
    id: "b",
    nom: "Archivo, largeur 62",
    famille: "var(--police-archivo)",
    graisse: 800,
    largeur: "62%",
    pourquoi:
      "Une grotesque dont la largeur est un axe : les titres peuvent s'étirer et claquer au défilement, et la même famille sert au texte en largeur normale.",
    reserve: "La plus neutre des trois au repos : c'est le mouvement qui lui donne du caractère.",
  },
  {
    id: "c",
    nom: "Sofia Sans Extra Condensed",
    famille: "var(--police-sofia)",
    graisse: 800,
    pourquoi:
      "La plus haute et la plus serrée. Les numéros de maillot y sont massifs, les noms longs tiennent sur une ligne en mobile.",
    reserve: "Moins de personnalité dans les lettres que Big Shoulders.",
  },
];
