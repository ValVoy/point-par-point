/**
 * Fabrique l'identifiant d'adresse d'un contenu : « Théo Démo » devient
 * « theo-demo ». Les accents sont decomposes puis leurs diacritiques retires,
 * de sorte qu'une URL ne porte jamais de caractere accentue.
 *
 * Partage entre le semis de demonstration et l'administration : deux
 * implementations divergentes produiraient un jour deux adresses pour le meme
 * contenu.
 */
export function slugifier(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
