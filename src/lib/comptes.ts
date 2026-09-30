import { randomInt } from "crypto";
import { and, asc, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import { utilisateurs, type Role } from "./db/schema";

/**
 * Les comptes de l'administration (fiche fiches/comptes.md). Aucun e-mail ne
 * part du site : un compte nait avec un mot de passe provisoire, affiche une
 * seule fois a l'administrateur qui le transmet de la main a la main, et que
 * la personne remplace depuis « Mon compte ».
 *
 * Deux regles protegent contre le verrouillage : on ne retrograde ni ne
 * desactive son propre compte, et il reste toujours au moins un
 * administrateur actif.
 */

/** Sans 0/O, 1/l/I : un mot de passe dicte ou recopie ne doit pas preter a confusion. */
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Quatre groupes de quatre : 16 caracteres tires au hasard, environ 92 bits. */
export function genererMotDePasse(): string {
  const groupes: string[] = [];
  for (let g = 0; g < 4; g++) {
    let groupe = "";
    for (let i = 0; i < 4; i++) groupe += ALPHABET[randomInt(ALPHABET.length)];
    groupes.push(groupe);
  }
  return groupes.join("-");
}

export type ChangementCompte = { role?: Role; actif?: boolean };

/**
 * Dit pourquoi un changement est refuse, ou null s'il est permis. Logique
 * pure : l'appelant fournit le nombre d'administrateurs actifs.
 */
export function refusChangement(
  acteurId: number,
  cible: { id: number; role: Role; actif: boolean },
  changement: ChangementCompte,
  adminsActifs: number,
): string | null {
  const soiMeme = acteurId === cible.id;
  if (soiMeme && changement.role && changement.role !== cible.role) {
    return "Vous ne pouvez pas changer votre propre rôle.";
  }
  if (soiMeme && changement.actif === false) {
    return "Vous ne pouvez pas désactiver votre propre compte.";
  }
  const perdUnAdmin =
    cible.role === "admin" &&
    cible.actif &&
    ((changement.role !== undefined && changement.role !== "admin") || changement.actif === false);
  if (perdUnAdmin && adminsActifs <= 1) {
    return "Il doit rester au moins un administrateur actif.";
  }
  return null;
}

export function listerComptes() {
  return db()
    .select({
      id: utilisateurs.id,
      nom: utilisateurs.nom,
      email: utilisateurs.email,
      role: utilisateurs.role,
      actif: utilisateurs.actif,
      derniereConnexionLe: utilisateurs.derniereConnexionLe,
    })
    .from(utilisateurs)
    .where(isNull(utilisateurs.supprimeLe))
    .orderBy(desc(utilisateurs.actif), asc(utilisateurs.nom));
}

export async function compterAdminsActifs(): Promise<number> {
  const [ligne] = await db()
    .select({ nombre: count() })
    .from(utilisateurs)
    .where(and(eq(utilisateurs.role, "admin"), eq(utilisateurs.actif, true), isNull(utilisateurs.supprimeLe)));
  return ligne?.nombre ?? 0;
}
