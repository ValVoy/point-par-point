import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@libsql/client";

/**
 * Remplace `turso db shell` pour l'essentiel de son usage : interroger la base
 * configuree sans quitter le projet.
 *
 * Il n'existe pas de CLI Turso sur Windows (verifie le 20-09-2026 : la version
 * 1.0.32 ne publie que des binaires Darwin et Linux, et la documentation exige
 * WSL). Ce script passe par @libsql/client, deja installe, et n'a donc rien a
 * installer.
 *
 *   npm run db:sql "select prenom, nom from joueurs limit 5"
 *   npm run db:sql "select name from sqlite_master where type='table'"
 */
async function principal() {
  const requete = process.argv.slice(2).join(" ").trim();
  if (!requete) {
    console.error('Usage : npm run db:sql "select ... from ..."');
    process.exit(1);
  }

  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    console.error("TURSO_DATABASE_URL est absente de .env.local.");
    process.exit(1);
  }

  const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  const resultat = await client.execute(requete);

  if (resultat.rows.length === 0) {
    console.log(
      resultat.rowsAffected > 0
        ? `${resultat.rowsAffected} lignes affectees.`
        : "Aucune ligne.",
    );
  } else {
    console.table(resultat.rows.map((ligne) => ({ ...ligne })));
    console.log(`${resultat.rows.length} lignes.`);
  }

  client.close();
}

principal().catch((erreur) => {
  console.error(erreur instanceof Error ? erreur.message : erreur);
  process.exit(1);
});
