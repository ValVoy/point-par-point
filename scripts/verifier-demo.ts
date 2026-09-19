import { config } from "dotenv";
config({ path: ".env.local" });

import { compterDemo } from "../src/lib/demo";

/**
 * Dit s'il reste des donnees de demonstration. Sort en erreur s'il en reste,
 * pour pouvoir servir de garde-fou avant une mise en ligne.
 */
async function principal() {
  const { total, detail } = await compterDemo();
  if (total === 0) {
    console.log("Aucune donnee de demonstration. La base est prete.");
    return;
  }

  console.log(`${total} enregistrements de demonstration :`);
  for (const ligne of detail) console.log(`  ${ligne.nombre} ${ligne.libelle}`);
  console.log("\nPour les enlever : npm run db:purge-demo");
  process.exit(1);
}

principal().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
