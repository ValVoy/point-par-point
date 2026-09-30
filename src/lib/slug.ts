/**
 * Fabrique l'identifiant d'adresse d'un contenu : « Théo Démo » devient
 * « theo-demo ». Les accents sont decomposes puis leurs diacritiques retires,
 * de sorte qu'une URL ne porte jamais de caractere accentue.
 *
 * Partage entre le semis de demonstration et l'administration : deux
 * implementations divergentes produiraient un jour deux adresses pour le meme
 * contenu.
 */
/**
 * Lettres que la decomposition Unicode ne ramene pas a l'alphabet latin de
 * base : sans elles, « Łukasz » devenait « ukasz » (audit D1). Un club de
 * volley compte des joueurs polonais, scandinaves, allemands.
 */
const TRANSLITTERATIONS: Record<string, string> = {
  ł: "l", ø: "o", æ: "ae", œ: "oe", ß: "ss", đ: "d", ð: "d", þ: "th", ı: "i",
};

/** Longueur maximale d'une adresse fabriquee, suffixe « -2 » non compris. */
export const LONGUEUR_MAX_SLUG = 100;

/**
 * La forme d'une adresse acceptee par les pages publiques. Une seule
 * definition (il y en avait cinq copies) : la borne de 120 laisse la place du
 * suffixe au-dela des 100 caracteres fabriques.
 */
export const FORME_SLUG = /^[a-z0-9-]{1,120}$/;

export function slugifier(texte: string): string {
  const brut = texte
    .toLowerCase()
    .replace(/[łøæœßđðþı]/g, (lettre) => TRANSLITTERATIONS[lettre] ?? lettre)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (brut.length <= LONGUEUR_MAX_SLUG) return brut;
  // Coupe sur une limite de mot quand c'est possible, jamais sur un tiret final.
  const coupe = brut.slice(0, LONGUEUR_MAX_SLUG);
  const dernierTiret = coupe.lastIndexOf("-");
  return (dernierTiret > LONGUEUR_MAX_SLUG / 2 ? coupe.slice(0, dernierTiret) : coupe).replace(/-+$/, "");
}

/** L'adresse d'un texte, ou une adresse de secours s'il n'en reste rien (« 李 王 », emoji). */
export function slugOuSecours(texte: string, secours: string): string {
  return slugifier(texte) || secours;
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
