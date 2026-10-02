import { createHash, timingSafeEqual } from "crypto";
import { purgerDonneesEchues } from "@/lib/purges";

/**
 * Purge nocturne des donnees echues (audit R3, decision du 01-10-2026),
 * appelee chaque nuit par une tache planifiee de Coolify, depuis le conteneur :
 *
 *   wget -q -O - --post-data="" --header="Authorization: Bearer $PURGE_JETON" http://127.0.0.1:3000/taches/purge
 *
 * Sans `PURGE_JETON`, la route n'existe pas (404). Le jeton se compare en temps
 * constant, sur son empreinte, pour ne rien laisser deviner par la duree de la
 * reponse. Rien d'autre n'est dit : ni ce qui a ete efface, ni pourquoi un
 * appel est refuse.
 */
export const dynamic = "force-dynamic";

const empreinte = (valeur: string) => createHash("sha256").update(valeur).digest();

export async function POST(requete: Request) {
  const attendu = process.env.PURGE_JETON;
  if (!attendu || attendu.length < 32) return new Response(null, { status: 404 });

  const recu = requete.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!timingSafeEqual(empreinte(recu), empreinte(attendu))) return new Response(null, { status: 401 });

  // Un echec repond 500 : la tache planifiee le voit, au lieu d'un succes de facade (audit F14).
  const reussie = await purgerDonneesEchues();
  return new Response(null, { status: reussie ? 204 : 500, headers: { "cache-control": "no-store" } });
}
