import sharp from "sharp";

// Une image a la fois, sans cache (audit F9) : une photo de 40 millions de
// pixels se deplie en quelque 160 Mo, deux envois simultanes ne doivent pas
// faire depasser le plafond memoire du conteneur.
sharp.concurrency(1);
sharp.cache(false);

/**
 * Le traitement des images envoyees (fiche fiches/photos.md). Tout ce qui
 * entre ici vient d'un fichier choisi par quelqu'un : le format se lit dans
 * le contenu, jamais dans le nom ni dans le type annonce par le navigateur.
 */

export const TAILLE_MAX_OCTETS = 12 * 1024 * 1024;
/** Contre les « bombes » de decompression : un petit fichier qui se deplie en milliards de pixels. */
const PIXELS_MAX = 40_000_000;
const FORMATS_ACCEPTES = new Set(["jpeg", "png", "webp", "avif"]);

export type GenreImage = "photo" | "logo" | "illustration";
const COTE_MAX: Record<GenreImage, number> = { photo: 1600, logo: 800, illustration: 2000 };

export type ImagePreparee = { octets: Buffer; largeur: number; hauteur: number };

export class ImageRefusee extends Error {}

export async function preparerImage(entree: Buffer, genre: GenreImage): Promise<ImagePreparee> {
  if (entree.byteLength === 0) throw new ImageRefusee("Le fichier est vide.");
  if (entree.byteLength > TAILLE_MAX_OCTETS) {
    throw new ImageRefusee("La photo dépasse 12 Mo : envoyez une version plus légère.");
  }

  let format: string | undefined;
  try {
    format = (await sharp(entree, { limitInputPixels: PIXELS_MAX }).metadata()).format;
  } catch {
    throw new ImageRefusee("Ce fichier n'est pas une image lisible.");
  }
  if (!format || !FORMATS_ACCEPTES.has(format)) {
    throw new ImageRefusee("Format refusé : envoyez une photo en JPEG, PNG, WebP ou AVIF.");
  }

  try {
    const cote = COTE_MAX[genre];
    const { data, info } = await sharp(entree, { limitInputPixels: PIXELS_MAX, failOn: "error" })
      .rotate()
      .resize({ width: cote, height: cote, fit: "inside", withoutEnlargement: true })
      .webp({ quality: genre === "logo" ? 90 : 82 })
      .toBuffer({ resolveWithObject: true });
    return { octets: data, largeur: info.width, hauteur: info.height };
  } catch {
    throw new ImageRefusee("Cette image est trop grande ou abîmée : essayez une autre version.");
  }
}
