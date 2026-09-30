/**
 * Le titre d'un episode tel qu'il s'affiche (audit du 01-10-2026, W2). Le
 * site ecrit lui-meme « Episode 3 : » ; un titre saisi ou copie depuis YouTube
 * qui commence deja par son numero le portait deux fois. On retire ce prefixe
 * a l'affichage, sans toucher a ce qui est enregistre.
 */
export function titreSansNumero(episode: { numero: number | null; titre: string }): string {
  if (episode.numero === null) return episode.titre;
  const prefixe = new RegExp(String.raw`^\s*(?:[ée]pisode|[ée]p\.?)\s*0*${episode.numero}\s*[:.\-–|]\s*`, "i");
  const nettoye = episode.titre.replace(prefixe, "");
  return nettoye.trim() ? nettoye : episode.titre;
}
