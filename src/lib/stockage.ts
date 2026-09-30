import { randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { AwsClient } from "aws4fetch";

/**
 * Le stockage des images (fiche fiches/photos.md). En production, R2 ; en
 * developpement sans identifiants R2, un dossier local servi par une route
 * reservee au developpement. En production sans R2, rien ne s'ecrit : le
 * disque d'un conteneur s'efface a chaque deploiement, une photo y serait
 * perdue sans bruit.
 *
 * Les cles sont tirees au hasard ici, jamais derivees d'un nom de fichier, et
 * toute cle lue ou effacee est d'abord validee : c'est ce qui rend la route
 * locale sure contre un chemin du genre `../../.env.local`.
 */

export const DOSSIERS = ["joueurs", "staff", "partenaires", "actualites", "projet"] as const;
export type Dossier = (typeof DOSSIERS)[number];

const FORME_CLE = new RegExp(`^(${DOSSIERS.join("|")})/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$`);

export function cleValide(cle: string): boolean {
  return FORME_CLE.test(cle);
}

export function nouvelleCle(dossier: Dossier): string {
  return `${dossier}/${randomUUID()}.webp`;
}

function configurationR2() {
  const compte = process.env.R2_COMPTE_ID;
  const bucket = process.env.R2_BUCKET;
  const acces = process.env.R2_CLE_ACCES;
  const secret = process.env.R2_CLE_SECRETE;
  if (!compte || !bucket || !acces || !secret) return null;
  return { compte, bucket, client: new AwsClient({ accessKeyId: acces, secretAccessKey: secret, service: "s3", region: "auto" }) };
}

/** Le mode de stockage disponible, ou null s'il n'y en a aucun (production sans R2). */
export function modeStockage(): "r2" | "local" | null {
  if (configurationR2()) return "r2";
  return process.env.NODE_ENV === "production" ? null : "local";
}

export const DOSSIER_LOCAL = path.join(process.cwd(), ".stockage-local");

export class StockageIndisponible extends Error {}

export async function deposer(cle: string, octets: Buffer): Promise<void> {
  if (!cleValide(cle)) throw new Error("Clé de stockage invalide.");
  const r2 = configurationR2();
  if (r2) {
    const reponse = await r2.client.fetch(`https://${r2.compte}.r2.cloudflarestorage.com/${r2.bucket}/${cle}`, {
      method: "PUT",
      body: new Uint8Array(octets),
      // Longueur explicite : sans elle, le corps peut partir decoupe, ce que R2 refuse (411).
      headers: { "content-type": "image/webp", "content-length": String(octets.byteLength), "cache-control": "public, max-age=31536000, immutable" },
    });
    if (!reponse.ok) throw new Error(`Envoi vers R2 refusé (${reponse.status}).`);
    return;
  }
  if (modeStockage() !== "local") throw new StockageIndisponible("L'envoi de photos n'est pas configuré sur ce serveur.");
  const fichier = path.join(DOSSIER_LOCAL, cle);
  await mkdir(path.dirname(fichier), { recursive: true });
  await writeFile(fichier, octets);
}

/** Efface un objet ; une cle absente ou deja effacee n'est pas une erreur. */
export async function effacer(cle: string | null | undefined): Promise<void> {
  if (!cle || !cleValide(cle)) return;
  const r2 = configurationR2();
  if (r2) {
    const reponse = await r2.client.fetch(`https://${r2.compte}.r2.cloudflarestorage.com/${r2.bucket}/${cle}`, { method: "DELETE" });
    if (!reponse.ok && reponse.status !== 404) throw new Error(`Effacement R2 refusé (${reponse.status}).`);
    return;
  }
  if (modeStockage() === "local") await unlink(path.join(DOSSIER_LOCAL, cle)).catch(() => undefined);
}

/** Lecture locale, pour la route de developpement seulement. */
export async function lireLocal(cle: string): Promise<Buffer | null> {
  if (modeStockage() !== "local" || !cleValide(cle)) return null;
  return readFile(path.join(DOSSIER_LOCAL, cle)).catch(() => null);
}
