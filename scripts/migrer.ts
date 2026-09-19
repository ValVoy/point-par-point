import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { config } from "dotenv";

config({ path: ".env.local" });

/**
 * Applique les migrations du dossier drizzle/ a la base pointee par
 * TURSO_DATABASE_URL. Sert en local, et en production avant un deploiement.
 *
 * Accepte aussi une URL `file:` pour verifier le schema hors ligne :
 *   TURSO_DATABASE_URL=file:essai.db npx tsx scripts/migrer.ts
 */
async function principal() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    console.error(
      "TURSO_DATABASE_URL est absente. Renseigner .env.local, ou la passer " +
        "en ligne de commande.",
    );
    process.exit(1);
  }

  const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  const base = drizzle(client);

  console.log(`Migration de ${url.replace(/\?.*$/, "")}`);
  await migrate(base, { migrationsFolder: "./drizzle" });
  console.log("Migrations appliquees.");

  client.close();
}

principal().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
