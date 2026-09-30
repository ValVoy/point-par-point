/**
 * Analyse d'un score saisi set par set. Logique pure, sans base ni serveur :
 * elle tourne a l'identique dans le navigateur, pour le calcul en direct sur
 * l'ecran du gymnase, et dans l'action serveur, qui seule fait foi.
 *
 * Deux niveaux de gravite, et la distinction est voulue. Une erreur rend le
 * score inenregistrable (un set a egalite n'existe pas). Une alerte signale un
 * score inhabituel sans le refuser : un championnat departemental peut jouer
 * des formats particuliers, et c'est l'ami qui sait ce qui s'est passe dans la
 * salle, pas le code.
 */

export const NOMBRE_DE_SETS_MAX = 5;
const POINTS_SET = 25;
const POINTS_TIE_BREAK = 15;
const SETS_GAGNANTS = 3;

export type SetSaisi = { nous: string; eux: string };
export type SetValide = { numero: number; nous: number; eux: number };

export type AnalyseScore = {
  sets: SetValide[];
  setsNous: number;
  setsEux: number;
  erreurs: string[];
  alertes: string[];
};

function lirePoints(valeur: string): number | null | "invalide" {
  const nettoyee = valeur.trim();
  if (nettoyee === "") return null;
  if (!/^\d{1,2}$/.test(nettoyee)) return "invalide";
  return Number(nettoyee);
}

function alertesDuSet(numero: number, nous: number, eux: number): string[] {
  const cible = numero === NOMBRE_DE_SETS_MAX ? POINTS_TIE_BREAK : POINTS_SET;
  const gagnant = Math.max(nous, eux);
  const ecart = Math.abs(nous - eux);

  if (gagnant < cible) {
    return [`Set ${numero} : le vainqueur n'a pas atteint ${cible} points.`];
  }
  if (ecart < 2) {
    return [`Set ${numero} : un set se gagne avec deux points d'écart.`];
  }
  if (gagnant > cible && ecart !== 2) {
    return [
      `Set ${numero} : au-delà de ${cible} points, l'écart final est toujours de deux.`,
    ];
  }
  return [];
}

export function analyserSets(saisis: SetSaisi[]): AnalyseScore {
  const sets: SetValide[] = [];
  const erreurs: string[] = [];
  const alertes: string[] = [];
  let premierVide: number | null = null;

  saisis.slice(0, NOMBRE_DE_SETS_MAX).forEach((saisi, index) => {
    const numero = index + 1;
    const nous = lirePoints(saisi.nous);
    const eux = lirePoints(saisi.eux);

    if (nous === null && eux === null) {
      premierVide ??= numero;
      return;
    }
    if (nous === "invalide" || eux === "invalide") {
      erreurs.push(`Set ${numero} : les points sont des nombres entiers.`);
      return;
    }
    if (nous === null || eux === null) {
      erreurs.push(`Set ${numero} : il manque les points d'une des deux équipes.`);
      return;
    }
    if (premierVide !== null) {
      erreurs.push(`Set ${premierVide} vide alors que le set ${numero} est rempli.`);
      premierVide = null;
    }
    if (nous === eux) {
      erreurs.push(`Set ${numero} : un set ne se termine jamais à égalité.`);
      return;
    }

    sets.push({ numero, nous, eux });
    alertes.push(...alertesDuSet(numero, nous, eux));
  });

  const setsNous = sets.filter((s) => s.nous > s.eux).length;
  const setsEux = sets.filter((s) => s.eux > s.nous).length;

  // Un match en trois sets gagnants s'arrete des qu'une equipe en compte
  // trois. Un set joue au-dela, ou un match sans vainqueur, merite un regard.
  if (erreurs.length === 0 && sets.length > 0) {
    const decisif = sets.findIndex((_, i) => {
      const jusquIci = sets.slice(0, i + 1);
      const n = jusquIci.filter((s) => s.nous > s.eux).length;
      const e = jusquIci.filter((s) => s.eux > s.nous).length;
      return n === SETS_GAGNANTS || e === SETS_GAGNANTS;
    });
    if (decisif !== -1 && decisif < sets.length - 1) {
      alertes.push("Des sets sont saisis après la fin du match, en trois sets gagnants.");
    }
    if (decisif === -1) {
      alertes.push("Aucune équipe n'a gagné trois sets : le match semble incomplet.");
    }
  }

  // Un match joue a toujours un vainqueur (audit D3) : une egalite de sets
  // enregistree passait pour une defaite dans le bilan.
  if (erreurs.length === 0 && sets.length > 0 && setsNous === setsEux) {
    erreurs.push(`Égalité ${setsNous}-${setsEux} : un match se termine toujours avec un vainqueur. Complétez les sets.`);
  }

  return { sets, setsNous, setsEux, erreurs, alertes };
}

/** Le score final seul, quand le detail des sets n'est pas connu. */
export function analyserScoreFinal(
  nous: string,
  eux: string,
): { setsNous: number; setsEux: number } | { erreur: string } {
  const n = lirePoints(nous);
  const e = lirePoints(eux);
  if (n === null || e === null || n === "invalide" || e === "invalide") {
    return { erreur: "Le score final demande le nombre de sets des deux équipes." };
  }
  if (n > SETS_GAGNANTS || e > SETS_GAGNANTS) {
    return { erreur: `Une équipe gagne au plus ${SETS_GAGNANTS} sets.` };
  }
  if (n === e) return { erreur: "Un match ne se termine pas à égalité de sets." };
  return { setsNous: n, setsEux: e };
}
