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

/**
 * Premiere adresse libre a partir d'une base : « theo-demo », puis
 * « theo-demo-2 », « theo-demo-3 »... Deux contenus peuvent porter le meme
 * titre, et l'adresse doit rester unique sans que personne n'y pense.
 */
export function premiereLibre(base: string, prises: Set<string>): string {
  if (!prises.has(base)) return base;
  let suffixe = 2;
  while (prises.has(`${base}-${suffixe}`)) suffixe += 1;
  return `${base}-${suffixe}`;
}
