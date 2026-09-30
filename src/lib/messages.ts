import { and, count, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "./db";
import { messagesContact } from "./db/schema";

/**
 * Les messages du formulaire de contact, cote administration. Leur duree de
 * conservation (un an) est tenue par src/lib/purges.ts.
 */

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
