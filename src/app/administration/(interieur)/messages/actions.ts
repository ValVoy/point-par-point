"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { messagesContact } from "@/lib/db/schema";
import { exigerDroit } from "@/lib/auth/session-courante";
import { effacerMessage } from "@/lib/effacement";

/** Lire, ranger et restaurer les messages du formulaire de contact (droit `lireMessages`). */

const CHEMIN = "/administration/messages";

function lireIdentifiant(donnees: FormData) {
  const nombre = Number(donnees.get("id"));
  return Number.isInteger(nombre) && nombre > 0 ? nombre : null;
}

async function modifier(donnees: FormData, colonnes: { lu?: boolean; supprimeLe?: Date | null }) {
  await exigerDroit("lireMessages");
  const id = lireIdentifiant(donnees);
  if (!id) return;
  await db()
    .update(messagesContact)
    .set({ ...colonnes, modifieLe: new Date() })
    .where(eq(messagesContact.id, id));
  revalidatePath(CHEMIN);
}

export async function basculerLu(donnees: FormData): Promise<void> {
  await modifier(donnees, { lu: donnees.get("lu") === "1" });
}

export async function mettreMessageALaCorbeille(donnees: FormData): Promise<void> {
  await modifier(donnees, { supprimeLe: new Date(), lu: true });
}

export async function restaurerMessage(donnees: FormData): Promise<void> {
  await modifier(donnees, { supprimeLe: null });
}

/** Effacement definitif d'un message deja a la corbeille (audit R1), sur demande de son auteur par exemple. */
export async function effacerMessageDefinitivement(donnees: FormData): Promise<void> {
  await exigerDroit("viderCorbeille");
  if (donnees.get("confirme") !== "1") return;
  const id = lireIdentifiant(donnees);
  if (id && (await effacerMessage(id))) revalidatePath(CHEMIN);
}
