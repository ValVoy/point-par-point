import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../src/lib/db";
import {
  actualites,
  classements,
  effectifs,
  episodes,
  etapesProjet,
  feuillesRencontre,
  joueurs,
  lignesClassement,
  membresStaff,
  partenaires,
  rencontres,
  saisons,
  setsRencontre,
  type Poste,
} from "../src/lib/db/schema";
import { depuisChampDateHeure, pourChampDate } from "../src/lib/dates";
import { slugifier } from "../src/lib/slug";

/**
 * Jeu de demonstration. Tout ce qui est ecrit ici porte `demo: true`, donc
 * l'administration affichera un bandeau tant qu'il en restera, et
 * `npm run db:purge-demo` enlevera l'ensemble.
 *
 * Le nom de famille est volontairement « Demo » pour tous les joueurs : meme
 * sans le bandeau, un faux joueur reste impossible a confondre avec un vrai.
 */

const MAINTENANT = Date.now();
const JOUR = 24 * 60 * 60 * 1000;

const EFFECTIF: { prenom: string; poste: Poste; numero: number; taille: number }[] =
  [
    { prenom: "Lucas", poste: "passeur", numero: 1, taille: 183 },
    { prenom: "Théo", poste: "pointu", numero: 4, taille: 194 },
    { prenom: "Malik", poste: "central", numero: 5, taille: 199 },
    { prenom: "Antoine", poste: "receptionneur", numero: 6, taille: 189 },
    { prenom: "Nathan", poste: "receptionneur", numero: 7, taille: 187 },
    { prenom: "Hugo", poste: "libero", numero: 8, taille: 176 },
    { prenom: "Yanis", poste: "central", numero: 9, taille: 196 },
    { prenom: "Romain", poste: "passeur", numero: 10, taille: 181 },
    { prenom: "Bastien", poste: "pointu", numero: 11, taille: 192 },
    { prenom: "Kevin", poste: "receptionneur", numero: 12, taille: 186 },
    { prenom: "Samuel", poste: "central", numero: 13, taille: 197 },
    { prenom: "Adrien", poste: "libero", numero: 14, taille: 174 },
  ];

/**
 * Les matchs joues illustrent volontairement les trois niveaux de saisie du
 * principe 3 : feuille complete, feuille partielle, score seul. C'est le seul
 * moyen de verifier a l'oeil que le site tient dans les trois cas.
 */
const MATCHS = [
  {
    adversaire: "VBC Sainte-Colombe",
    jours: -42,
    domicile: true,
    sets: [
      [25, 20],
      [23, 25],
      [25, 18],
      [25, 22],
    ],
    saisie: "complete" as const,
  },
  {
    adversaire: "Entente Val-Fleury",
    jours: -35,
    domicile: false,
    sets: [
      [22, 25],
      [25, 27],
      [20, 25],
    ],
    saisie: "complete" as const,
  },
  {
    adversaire: "AS Montbrison",
    jours: -21,
    domicile: true,
    sets: [
      [25, 17],
      [25, 23],
      [25, 19],
    ],
    saisie: "partielle" as const,
  },
  {
    adversaire: "Volley Club des Trois Rivières",
    jours: -14,
    domicile: false,
    sets: [
      [25, 23],
      [18, 25],
      [25, 21],
      [21, 25],
      [13, 15],
    ],
    saisie: "partielle" as const,
  },
  {
    adversaire: "US Chantemerle",
    jours: -7,
    domicile: true,
    sets: [
      [25, 21],
      [25, 16],
      [25, 23],
    ],
    saisie: "score-seul" as const,
  },
  { adversaire: "VBC Sainte-Colombe", jours: 6, domicile: false },
  { adversaire: "Entente Val-Fleury", jours: 13, domicile: true },
  { adversaire: "AS Montbrison", jours: 27, domicile: false },
];

async function principal() {
  const base = db();
  const demo = true;

  console.log("Semis des données de démonstration...");

  const [saison] = await base
    .insert(saisons)
    .values({
      libelle: "2026-2027",
      debuteLe: new Date(MAINTENANT - 60 * JOUR),
      finitLe: new Date(MAINTENANT + 210 * JOUR),
      courante: true,
      demo,
    })
    .returning();
  if (!saison) throw new Error("La saison n'a pas ete creee.");

  const idsJoueurs: number[] = [];
  for (const membre of EFFECTIF) {
    const [joueur] = await base
      .insert(joueurs)
      .values({
        prenom: membre.prenom,
        nom: "Démo",
        slug: slugifier(`${membre.prenom}-demo`),
        neLe: new Date(MAINTENANT - (19 + (membre.numero % 12)) * 365 * JOUR),
        tailleCm: membre.taille,
        presentation:
          "Fiche de démonstration. Le texte de présentation du joueur viendra " +
          "ici, en deux ou trois lignes.",
        parcours: "Parcours de démonstration, à remplacer.",
        demo,
      })
      .returning();
    if (!joueur) throw new Error("Joueur non cree.");
    idsJoueurs.push(joueur.id);

    await base.insert(effectifs).values({
      saisonId: saison.id,
      joueurId: joueur.id,
      numero: membre.numero,
      poste: membre.poste,
      capitaine: membre.numero === 1,
      demo,
    });
  }

  const idsRencontresJouees: number[] = [];
  for (const match of MATCHS) {
    // Un match se joue le soir, a 20 h 30 a Paris ; l'adresse prend la date
    // de Paris, comme dans l'administration (critique du 30-09-2026 : en UTC,
    // l'adresse avait un jour de retard sur la page).
    const jourDuMatch = pourChampDate(new Date(MAINTENANT + match.jours * JOUR));
    const joueLe = depuisChampDateHeure(`${jourDuMatch}T20:30`)!;
    const jouee = match.jours < 0 && match.sets;
    const setsNous = jouee
      ? match.sets!.filter(([n, e]) => (n ?? 0) > (e ?? 0)).length
      : null;
    const setsEux = jouee
      ? match.sets!.filter(([n, e]) => (n ?? 0) < (e ?? 0)).length
      : null;

    const [rencontre] = await base
      .insert(rencontres)
      .values({
        saisonId: saison.id,
        slug: slugifier(
          `${pourChampDate(joueLe)}-${match.adversaire}`,
        ),
        joueLe,
        adversaire: match.adversaire,
        aDomicile: match.domicile,
        competition: "Championnat départemental, poule A",
        salleNom: match.domicile ? "Gymnase de démonstration" : null,
        salleAdresse: match.domicile ? "1 rue du Gymnase, 00000 Ville" : null,
        etat: jouee ? "jouee" : "a_venir",
        setsNous,
        setsEux,
        commentaire: jouee
          ? "Commentaire d'après-match de démonstration."
          : null,
        demo,
      })
      .returning();
    if (!rencontre) throw new Error("Rencontre non creee.");
    if (!jouee) continue;
    idsRencontresJouees.push(rencontre.id);

    for (const [index, set] of match.sets!.entries()) {
      await base.insert(setsRencontre).values({
        rencontreId: rencontre.id,
        numero: index + 1,
        pointsNous: set[0] ?? null,
        pointsEux: set[1] ?? null,
      });
    }

    // Principe 3 : la saisie est partielle par nature.
    if (match.saisie === "score-seul") continue;

    const alignes = idsJoueurs.slice(0, match.saisie === "complete" ? 12 : 8);
    for (const [index, joueurId] of alignes.entries()) {
      const complet = match.saisie === "complete";
      await base.insert(feuillesRencontre).values({
        rencontreId: rencontre.id,
        joueurId,
        present: true,
        points: complet ? 4 + ((index * 3) % 15) : index < 4 ? 6 + index : null,
        attaquesReussies: complet ? 3 + ((index * 2) % 11) : null,
        attaquesTentees: complet ? 9 + ((index * 3) % 17) : null,
        aces: complet ? index % 3 : null,
        servicesFautes: complet ? index % 4 : null,
        blocs: complet ? index % 5 : null,
        receptionsReussies: complet ? 5 + (index % 9) : null,
        receptionsTentees: complet ? 8 + (index % 13) : null,
        fautes: complet ? index % 6 : null,
      });
    }
  }

  const [classement] = await base
    .insert(classements)
    .values({
      saisonId: saison.id,
      intitule: "Championnat départemental, poule A",
      misAJourLe: new Date(MAINTENANT - 5 * JOUR),
      demo,
    })
    .returning();
  if (!classement) throw new Error("Classement non cree.");

  const EQUIPES = [
    "Entente Val-Fleury",
    "Point Par Point (démonstration)",
    "AS Montbrison",
    "VBC Sainte-Colombe",
    "US Chantemerle",
    "Volley Club des Trois Rivières",
    "SC Pierreville",
    "AL Bois-Joli",
  ];
  for (const [index, equipe] of EQUIPES.entries()) {
    await base.insert(lignesClassement).values({
      classementId: classement.id,
      rang: index + 1,
      equipe,
      estNous: index === 1,
      points: 21 - index * 2,
      joues: 8,
      gagnes: 7 - index,
      perdus: 1 + index,
    });
  }

  for (const [index, id] of idsRencontresJouees.slice(0, 3).entries()) {
    await base.insert(episodes).values({
      saisonId: saison.id,
      numero: index + 1,
      titre: `Épisode ${index + 1} : titre de démonstration`,
      slug: `episode-${index + 1}-demonstration`,
      youtubeId: "dQw4w9WgXcQ",
      resume:
        "Résumé de démonstration. Deux ou trois phrases sur ce que raconte " +
        "l'épisode, et le lien vers le match concerné.",
      publieLe: new Date(MAINTENANT - (30 - index * 10) * JOUR),
      rencontreId: id,
      etat: "publie",
      demo,
    });
  }

  for (let index = 0; index < 3; index++) {
    await base.insert(actualites).values({
      titre: `Actualité de démonstration numéro ${index + 1}`,
      slug: `actualite-demonstration-${index + 1}`,
      chapo: "Chapô de démonstration, une phrase qui donne envie de lire.",
      corps:
        "Corps de l'actualité de démonstration. Plusieurs paragraphes de " +
        "texte viendront ici.\n\nSecond paragraphe.",
      publieLe: new Date(MAINTENANT - (20 - index * 6) * JOUR),
      etat: "publie",
      demo,
    });
  }

  const ETAPES = [
    { titre: "L'idée", texte: "Naissance du concept.", jours: -400 },
    { titre: "La première équipe", texte: "Douze joueurs.", jours: -300 },
    { titre: "Le premier épisode", texte: "La série démarre.", jours: -120 },
    { titre: "Le site", texte: "Les informations qui durent.", jours: -10 },
  ];
  for (const [index, etape] of ETAPES.entries()) {
    await base.insert(etapesProjet).values({
      survenuLe: new Date(MAINTENANT + etape.jours * JOUR),
      titre: `${etape.titre} (démonstration)`,
      texte: etape.texte,
      ordre: index,
      etat: "publie",
      demo,
    });
  }

  const STAFF = [
    { nom: "Coach Démo", role: "Entraîneur" },
    { nom: "Caméra Démo", role: "Image et montage" },
    { nom: "Capitaine Démo", role: "Capitaine" },
  ];
  for (const [index, membre] of STAFF.entries()) {
    await base.insert(membresStaff).values({
      nom: membre.nom,
      role: membre.role,
      texte: "Présentation de démonstration.",
      ordre: index,
      demo,
    });
  }

  for (let index = 0; index < 3; index++) {
    await base.insert(partenaires).values({
      nom: `Partenaire de démonstration ${index + 1}`,
      lien: "https://example.org",
      ordre: index,
      demo,
    });
  }

  console.log("Terminé. Toutes ces données portent demo = true.");
  console.log("Pour les enlever : npm run db:purge-demo");
}

principal().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
