import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Client Turso. Instancie paresseusement : un client cree au chargement du
 * module fait echouer `next build` a l'etape « Collecting page data » quand la
 * variable d'environnement est absente, piege deja rencontre sur ope_cdm.
 */
let instance: ReturnType<typeof creer> | null = null;

function creer() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL est absente. Renseigner .env.local en local, " +
        "ou les variables d'execution de Coolify en production.",
    );
  }
  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

export function db() {
  if (!instance) instance = creer();
  return instance;
}

export { schema };
