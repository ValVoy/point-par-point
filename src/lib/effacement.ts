import { eq } from "drizzle-orm";
import { db } from "./db";
import { effectifs, etapesProjet, feuillesRencontre, joueurs, membresStaff, messagesContact, partenaires } from "./db/schema";
import { effacer } from "./stockage";

/**
 * L'effacement definitif (audit du 01-10-2026, R1 et R2) : la politique de
 * confidentialite promet qu'une personne peut faire retirer ses donnees. La
 * corbeille ne suffit pas, la ligne et la photo restaient. Ici, la ligne, ce
 * qui en depend, puis l'objet sur R2 disparaissent pour de bon.
 *
 * Exception assumee au principe « rien ne disparait par accident » : reserve
 * au droit `viderCorbeille` (l'administrateur), toujours confirme a l'ecran,
 * et limite aux elements deja a la corbeille (sauf un joueur, qui n'en a pas).
 */

async function effacerObjet(cle: string | null) {
  try {
    await effacer(cle);
  } catch (erreur) {
    console.error("[effacement] objet R2 non efface", cle, erreur instanceof Error ? erreur.message : erreur);
  }
}

/** Un joueur, ses lignes d'effectif et ses feuilles de match, puis sa photo. */
export async function effacerJoueur(id: number): Promise<boolean> {
  const base = db();
  const [joueur] = await base.select({ photoCle: joueurs.photoCle }).from(joueurs).where(eq(joueurs.id, id)).limit(1);
  if (!joueur) return false;
  await base.batch([
    base.delete(feuillesRencontre).where(eq(feuillesRencontre.joueurId, id)),
    base.delete(effectifs).where(eq(effectifs.joueurId, id)),
    base.delete(joueurs).where(eq(joueurs.id, id)),
  ]);
  await effacerObjet(joueur.photoCle);
  return true;
}

export type ListeEffacable = "staff" | "partenaires" | "etapes";

/** Un element du projet deja a la corbeille, et son image. */
export async function effacerElementProjet(liste: ListeEffacable, id: number): Promise<boolean> {
  const base = db();
  if (liste === "staff") {
    const [ligne] = await base.select({ cle: membresStaff.photoCle, supprimeLe: membresStaff.supprimeLe }).from(membresStaff).where(eq(membresStaff.id, id)).limit(1);
    if (!ligne?.supprimeLe) return false;
    await base.delete(membresStaff).where(eq(membresStaff.id, id));
    await effacerObjet(ligne.cle);
  } else if (liste === "partenaires") {
    const [ligne] = await base.select({ cle: partenaires.logoCle, supprimeLe: partenaires.supprimeLe }).from(partenaires).where(eq(partenaires.id, id)).limit(1);
    if (!ligne?.supprimeLe) return false;
    await base.delete(partenaires).where(eq(partenaires.id, id));
    await effacerObjet(ligne.cle);
  } else {
    const [ligne] = await base.select({ cle: etapesProjet.imageCle, supprimeLe: etapesProjet.supprimeLe }).from(etapesProjet).where(eq(etapesProjet.id, id)).limit(1);
    if (!ligne?.supprimeLe) return false;
    await base.delete(etapesProjet).where(eq(etapesProjet.id, id));
    await effacerObjet(ligne.cle);
  }
  return true;
}

/** Un message deja a la corbeille. */
export async function effacerMessage(id: number): Promise<boolean> {
  const base = db();
  const [ligne] = await base.select({ supprimeLe: messagesContact.supprimeLe }).from(messagesContact).where(eq(messagesContact.id, id)).limit(1);
  if (!ligne?.supprimeLe) return false;
  await base.delete(messagesContact).where(eq(messagesContact.id, id));
  return true;
}
