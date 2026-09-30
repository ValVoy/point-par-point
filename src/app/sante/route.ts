import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

/**
 * Sonde de sante (audit du 01-10-2026, F7), pour la verification de Coolify
 * au deploiement et pour Todai : le serveur repond ET la base aussi, en moins
 * de deux secondes. Rien d'autre n'est dit : ni version, ni detail d'erreur.
 */
export const dynamic = "force-dynamic";

const DELAI_MS = 2000;

export async function GET() {
  const entetes = { "cache-control": "no-store" };
  try {
    await Promise.race([
      db().run(sql`select 1`),
      new Promise((_, rejeter) => setTimeout(() => rejeter(new Error("delai depasse")), DELAI_MS)),
    ]);
    return Response.json({ ok: true }, { headers: entetes });
  } catch (erreur) {
    console.error("[sante] base injoignable", erreur instanceof Error ? erreur.message : erreur);
    return Response.json({ ok: false }, { status: 503, headers: entetes });
  }
}
