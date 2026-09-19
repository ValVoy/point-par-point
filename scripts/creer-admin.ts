import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { utilisateurs } from "../src/lib/db/schema";
import { hacher, motDePasseAcceptable, LONGUEUR_MINIMALE } from "../src/lib/auth/mots-de-passe";

/**
 * Cree le premier compte administrateur, ou met a jour le mot de passe d'un
 * compte existant. Le mot de passe passe par l'environnement et jamais par un
 * argument de ligne de commande, qui resterait dans l'historique du terminal.
 *
 *   ADMIN_EMAIL=... ADMIN_NOM=... ADMIN_MOT_DE_PASSE=... npm run db:admin
 */
async function principal() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const nom = process.env.ADMIN_NOM?.trim();
  const motDePasse = process.env.ADMIN_MOT_DE_PASSE;

  if (!email || !nom || !motDePasse) {
    console.error(
      "Variables attendues : ADMIN_EMAIL, ADMIN_NOM, ADMIN_MOT_DE_PASSE.",
    );
    process.exit(1);
  }

  if (!motDePasseAcceptable(motDePasse)) {
    console.error(`Le mot de passe doit faire au moins ${LONGUEUR_MINIMALE} caracteres.`);
    process.exit(1);
  }

  const base = db();
  const hache = await hacher(motDePasse);

  const existants = await base
    .select({ id: utilisateurs.id })
    .from(utilisateurs)
    .where(eq(utilisateurs.email, email))
    .limit(1);

  const existant = existants[0];
  if (existant) {
    await base
      .update(utilisateurs)
      .set({
        motDePasseHache: hache,
        nom,
        role: "admin",
        actif: true,
        supprimeLe: null,
        modifieLe: new Date(),
      })
      .where(eq(utilisateurs.id, existant.id));
    console.log(`Compte mis a jour : ${email} (admin).`);
    return;
  }

  await base.insert(utilisateurs).values({
    email,
    nom,
    motDePasseHache: hache,
    role: "admin",
    actif: true,
  });
  console.log(`Compte cree : ${email} (admin).`);
}

principal().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
