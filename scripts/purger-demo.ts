import { config } from "dotenv";
config({ path: ".env.local" });

import { compterDemo, purgerDemo } from "../src/lib/demo";

/**
 * Enleve toutes les donnees de demonstration. A lancer avant la mise en ligne,
 * et a verifier par la disparition du bandeau dans l'administration.
 */
async function principal() {
  const avant = await compterDemo();
  if (avant.total === 0) {
    console.log("Aucune donnee de demonstration. Rien a faire.");
    return;
  }

  console.log("Donnees de demonstration trouvees :");
  for (const ligne of avant.detail) {
    console.log(`  ${ligne.nombre} ${ligne.libelle}`);
  }

  const effaces = await purgerDemo();
  const apres = await compterDemo();

  console.log(`\n${effaces} lignes effacees.`);
  if (apres.total === 0) {
    console.log("Il ne reste aucune donnee de demonstration.");
  } else {
    console.error(`ATTENTION : il reste ${apres.total} lignes de demonstration.`);
    process.exit(1);
  }
}

principal().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
