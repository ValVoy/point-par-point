/**
 * La logique pure des chapitres permanents de l'accueil (fiche
 * fiches/accueil-porte-entree.md) : le manifeste et son texte de depart, son
 * decoupage en mots pour l'allumage, le choix des cartes de l'equipe et
 * l'extrait d'une etape du projet. Aucune lecture en base ici : tout se teste.
 */

/** Le texte de depart, que Tom reecrit dans l'administration. */
export const MANIFESTE_DEPART = {
  titre: "Une équipe de D2, filmée de l'intérieur.",
  texte:
    "Point Par Point suit l'équipe D2 masculine du VF Francheville, dans l'ouest lyonnais, toute la saison. " +
    "Un objectif : passer de **Départementale 2 à Départementale 1**. Sur le terrain le week-end, dans " +
    "**la série** le reste du temps. Ici, tout ce qui dure : l'effectif, les scores, le calendrier.",
} as const;

export const MANIFESTE_TITRE_MAX = 80;
export const MANIFESTE_TEXTE_MAX = 500;

/** Le manifeste affiche : chaque champ saisi, sinon celui du texte de depart. */
export function manifeste(titre: string | null, texte: string | null): { titre: string; texte: string } {
  return { titre: titre ?? MANIFESTE_DEPART.titre, texte: texte ?? MANIFESTE_DEPART.texte };
}

export type Mot = { mot: string; accent: boolean; espaceAvant: boolean };

/**
 * Le texte en mots, pour qu'ils s'allument un a un. Ce qui est entre doubles
 * etoiles passe en accent turquoise ; une etoile orpheline reste du texte.
 * Decoupage par indexOf, sans motif qui puisse revenir sur ses pas.
 */
export function decouperMots(texte: string): Mot[] {
  const morceaux: { texte: string; accent: boolean }[] = [];
  let curseur = 0;
  while (curseur < texte.length) {
    const ouverture = texte.indexOf("**", curseur);
    const fermeture = ouverture === -1 ? -1 : texte.indexOf("**", ouverture + 2);
    if (fermeture === -1) {
      morceaux.push({ texte: texte.slice(curseur), accent: false });
      break;
    }
    morceaux.push({ texte: texte.slice(curseur, ouverture), accent: false });
    morceaux.push({ texte: texte.slice(ouverture + 2, fermeture), accent: true });
    curseur = fermeture + 2;
  }

  const mots: Mot[] = [];
  let finiParEspace = true;
  for (const morceau of morceaux) {
    let premier = true;
    for (const [, espaces = "", mot = ""] of morceau.texte.matchAll(/(\s*)(\S+)/g)) {
      const espaceAvant = mots.length > 0 && (espaces.length > 0 || (premier && finiParEspace));
      mots.push({ mot, accent: morceau.accent, espaceAvant });
      premier = false;
    }
    if (morceau.texte.length > 0) finiParEspace = /\s$/.test(morceau.texte);
  }
  return mots;
}

/**
 * Les cartes de l'equipe sur l'accueil : par numero, les joueurs sans numero
 * a la fin, par nom a numero egal. Au-dela de la limite, la derniere place
 * revient a la carte « + n joueurs ».
 */
export function cartesEquipe<T extends { numero: number | null; nom: string }>(
  membres: T[],
  limite: number,
): { cartes: T[]; reste: number } {
  const sansNumero = Number.POSITIVE_INFINITY;
  const tries = [...membres].sort(
    (a, b) => (a.numero ?? sansNumero) - (b.numero ?? sansNumero) || a.nom.localeCompare(b.nom, "fr"),
  );
  if (tries.length <= limite) return { cartes: tries, reste: 0 };
  const montres = Math.max(limite - 1, 0);
  return { cartes: tries.slice(0, montres), reste: tries.length - montres };
}

/**
 * L'extrait d'une etape : le texte entier s'il tient, sinon jusqu'a la
 * derniere phrase entiere si elle couvre au moins 60 % de la place, sinon
 * jusqu'au dernier mot entier, suivi de points de suspension.
 */
export function extraitEtape(texte: string | null, max: number): string | null {
  const propre = texte?.trim().replace(/\s+/g, " ");
  if (!propre) return null;
  if (propre.length <= max) return propre;

  const debut = propre.slice(0, max + 1);
  const finDePhrase = Math.max(debut.lastIndexOf(". "), debut.lastIndexOf("! "), debut.lastIndexOf("? "));
  if (finDePhrase >= max * 0.6) return debut.slice(0, finDePhrase + 1);

  const espace = debut.lastIndexOf(" ");
  const coupe = espace > 0 ? debut.slice(0, espace) : propre.slice(0, max);
  return `${coupe.replace(/[\s,;:.]+$/, "")}…`;
}
