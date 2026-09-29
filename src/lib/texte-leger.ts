/**
 * Le « texte leger » des actualites : quatre mises en forme, pas une de plus.
 *
 *   ## Intertitre          en debut de bloc
 *   **gras**  *italique*   dans le texte
 *   [texte du lien](https://adresse)
 *
 * Une ligne vide separe deux paragraphes, un simple retour a la ligne reste un
 * retour a la ligne. Tout le reste est du texte, y compris un balisage HTML,
 * qui s'affichera tel quel : le rendu produit des elements React, jamais du
 * HTML injecte, et c'est ce qui ferme la porte aux scripts.
 *
 * Choisi le 29-09-2026 contre un editeur riche complet : assez pour un compte
 * rendu de match lisible, trop peu pour casser la mise en page (principe du
 * codex, des champs et jamais de la mise en page). Ecrit ici plutot qu'importe,
 * pour ne dependre d'aucun paquet et pouvoir le lire en entier.
 */

export type Enligne =
  | { type: "texte"; valeur: string }
  | { type: "saut" }
  | { type: "gras"; contenu: Enligne[] }
  | { type: "italique"; contenu: Enligne[] }
  | { type: "lien"; href: string; contenu: Enligne[] };

export type Bloc =
  | { type: "paragraphe"; contenu: Enligne[] }
  | { type: "intertitre"; contenu: Enligne[] };

/**
 * Seules les adresses web et de messagerie deviennent des liens. Un
 * « javascript: » ou un « data: » reste du texte : c'est la seule porte par
 * laquelle un lien pourrait executer quelque chose.
 */
export function adresseSure(adresse: string): string | null {
  const nettoyee = adresse.trim();
  if (/^mailto:[^\s@]+@[^\s@]+$/i.test(nettoyee)) return nettoyee;
  try {
    const url = new URL(nettoyee);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

const MOTIFS: { type: "lien" | "gras" | "italique"; regle: RegExp }[] = [
  { type: "lien", regle: /\[([^\]\n]+)\]\(([^)\s]+)\)/ },
  { type: "gras", regle: /\*\*(?=\S)([^\n]*?\S)\*\*/ },
  { type: "italique", regle: /\*(?=\S)([^*\n]*?\S)\*/ },
];

function ajouterTexte(sortie: Enligne[], valeur: string) {
  if (!valeur) return;
  const lignes = valeur.split("\n");
  lignes.forEach((ligne, index) => {
    if (index > 0) sortie.push({ type: "saut" });
    if (!ligne) return;
    const dernier = sortie[sortie.length - 1];
    if (dernier?.type === "texte") dernier.valeur += ligne;
    else sortie.push({ type: "texte", valeur: ligne });
  });
}

/** Analyse la mise en forme d'un bloc. `profondeur` borne l'imbrication. */
export function analyserEnligne(texte: string, profondeur = 0): Enligne[] {
  const sortie: Enligne[] = [];
  let reste = texte;

  while (reste) {
    // Le motif qui commence le plus tot l'emporte ; a egalite, l'ordre de
    // MOTIFS decide (un lien avant du gras, du gras avant de l'italique).
    let meilleur: { type: (typeof MOTIFS)[number]["type"]; trouve: RegExpExecArray } | null =
      null;
    for (const { type, regle } of MOTIFS) {
      if (profondeur >= 2 && type !== "lien") continue;
      const trouve = regle.exec(reste);
      if (trouve && (!meilleur || trouve.index < meilleur.trouve.index)) {
        meilleur = { type, trouve };
      }
    }
    if (!meilleur) {
      ajouterTexte(sortie, reste);
      break;
    }

    const { type, trouve } = meilleur;
    ajouterTexte(sortie, reste.slice(0, trouve.index));
    const interieur = trouve[1] ?? "";

    if (type === "lien") {
      const href = adresseSure(trouve[2] ?? "");
      if (href) {
        sortie.push({ type: "lien", href, contenu: analyserEnligne(interieur, 2) });
      } else {
        ajouterTexte(sortie, trouve[0]);
      }
    } else {
      sortie.push({ type, contenu: analyserEnligne(interieur, profondeur + 1) });
    }
    reste = reste.slice(trouve.index + trouve[0].length);
  }

  return sortie;
}

export function analyserTexteLeger(texte: string): Bloc[] {
  return texte
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n+/)
    .map((bloc) => bloc.trim())
    .filter(Boolean)
    .flatMap((bloc): Bloc[] => {
      // Un intertitre suivi directement de texte, sans ligne vide, reste un
      // intertitre : c'est ainsi qu'on l'ecrit spontanement.
      const [premiere = "", ...suite] = bloc.split("\n");
      const intertitre = /^##[ \t]+(.+)$/.exec(premiere);
      if (!intertitre) return [{ type: "paragraphe", contenu: analyserEnligne(bloc) }];
      const titre: Bloc = { type: "intertitre", contenu: analyserEnligne(intertitre[1] ?? "") };
      const reste = suite.join("\n").trim();
      return reste ? [titre, { type: "paragraphe", contenu: analyserEnligne(reste) }] : [titre];
    });
}

/** Le texte sans balisage, pour un extrait ou une description de page. */
export function texteBrut(texte: string): string {
  const aplatir = (contenu: Enligne[]): string =>
    contenu
      .map((e) =>
        e.type === "texte" ? e.valeur : e.type === "saut" ? " " : aplatir(e.contenu),
      )
      .join("");
  return analyserTexteLeger(texte)
    .map((bloc) => aplatir(bloc.contenu))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
