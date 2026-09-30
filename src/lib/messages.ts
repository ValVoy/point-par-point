import { and, count, desc, eq, isNotNull, isNull, lt } from "drizzle-orm";
import { db } from "./db";
import { messagesContact } from "./db/schema";

/**
 * Les messages du formulaire de contact, cote administration. Duree de
 * conservation annoncee au visiteur : un an. C'est la seule table ou une
 * ligne s'efface vraiment (principe 6 du codex, exception RGPD) : une
 * donnee personnelle ne se garde pas au-dela de ce qui a ete promis.
 */

const CONSERVATION_MS = 365 * 24 * 60 * 60 * 1000;

export async function purgerMessagesAnciens(): Promise<void> {
  await db().delete(messagesContact).where(lt(messagesContact.creeLe, new Date(Date.now() - CONSERVATION_MS)));
}

/** Non lus d'abord, puis du plus recent au plus ancien. */
export function messagesActifs() {
  return db()
    .select()
    .from(messagesContact)
    .where(isNull(messagesContact.supprimeLe))
    .orderBy(messagesContact.lu, desc(messagesContact.creeLe));
}

export function messagesALaCorbeille() {
  return db()
    .select()
    .from(messagesContact)
    .where(isNotNull(messagesContact.supprimeLe))
    .orderBy(desc(messagesContact.supprimeLe));
}

export async function nombreNonLus(): Promise<number> {
  const [ligne] = await db()
    .select({ nombre: count() })
    .from(messagesContact)
    .where(and(eq(messagesContact.lu, false), isNull(messagesContact.supprimeLe)));
  return ligne?.nombre ?? 0;
}
