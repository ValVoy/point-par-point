import { and, count, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "./db";
import {
  actualites,
  classements,
  effectifs,
  episodes,
  etapesProjet,
  feuillesRencontre,
  joueurs,
  lignesClassement,
  membresStaff,
  partenaires,
  rencontres,
  saisons,
  setsRencontre,
} from "./db/schema";

/**
 * Le site est livre rempli de faux joueurs et de faux matchs, pour que l'ami
 * n'ait pas a decouvrir un site vide. Le risque connu de cette approche est
 * qu'un faux joueur reste en ligne le jour de la mise en service.
 *
 * La parade n'est pas une note dans un coin : chaque enregistrement de
 * demonstration porte `demo = true`, l'administration affiche un bandeau tant
 * qu'il en reste un seul, et `purgerDemo()` les enleve tous d'un geste. Il
 * faut alors vouloir ignorer un bandeau pour se tromper.
 */

/** Les tables porteuses de la colonne `demo`, dans l'ordre d'affichage. */
const TABLES_DEMO = [
  { cle: "saisons", libelle: "saisons", table: saisons },
  { cle: "joueurs", libelle: "joueurs", table: joueurs },
  { cle: "effectifs", libelle: "lignes d'effectif", table: effectifs },
  { cle: "rencontres", libelle: "matchs", table: rencontres },
  { cle: "classements", libelle: "classements", table: classements },
  { cle: "episodes", libelle: "episodes", table: episodes },
  { cle: "actualites", libelle: "actualites", table: actualites },
  { cle: "etapesProjet", libelle: "etapes de chronologie", table: etapesProjet },
  { cle: "membresStaff", libelle: "membres du staff", table: membresStaff },
  { cle: "partenaires", libelle: "partenaires", table: partenaires },
] as const;

export type CompteDemo = { libelle: string; nombre: number };

/**
 * Compte ce qui reste de donnees de demonstration, table par table. Le total a
 * zero est la condition de mise en ligne.
 */
export async function compterDemo(): Promise<{
  total: number;
  detail: CompteDemo[];
}> {
  const detail: CompteDemo[] = [];
  let total = 0;

  for (const { libelle, table } of TABLES_DEMO) {
    const lignes = await db()
      .select({ nombre: count() })
      .from(table)
      .where(and(eq(table.demo, true), isNull(table.supprimeLe)));
    const nombre = lignes[0]?.nombre ?? 0;
    if (nombre > 0) detail.push({ libelle, nombre });
    total += nombre;
  }

  return { total, detail };
}

/**
 * Efface definitivement toutes les donnees de demonstration. C'est la seule
 * suppression reelle du systeme, corbeille comprise : une donnee de
 * demonstration n'a aucune valeur et sa presence est un risque, pas une perte.
 *
 * L'ordre suit les dependances, des enfants vers les parents, parce que SQLite
 * refuserait sinon d'effacer une ligne encore referencee.
 */
export async function purgerDemo(): Promise<number> {
  const base = db();
  let effaces = 0;

  const idsRencontresDemo = (
    await base
      .select({ id: rencontres.id })
      .from(rencontres)
      .where(eq(rencontres.demo, true))
  ).map((l) => l.id);

  const idsClassementsDemo = (
    await base
      .select({ id: classements.id })
      .from(classements)
      .where(eq(classements.demo, true))
  ).map((l) => l.id);

  if (idsRencontresDemo.length > 0) {
    // Un episode reel pourrait pointer un match de demonstration. On le
    // detache avant d'effacer, plutot que de le supprimer avec.
    await base
      .update(episodes)
      .set({ rencontreId: null })
      .where(inArray(episodes.rencontreId, idsRencontresDemo));

    const r1 = await base
      .delete(feuillesRencontre)
      .where(inArray(feuillesRencontre.rencontreId, idsRencontresDemo));
    const r2 = await base
      .delete(setsRencontre)
      .where(inArray(setsRencontre.rencontreId, idsRencontresDemo));
    effaces += (r1.rowsAffected ?? 0) + (r2.rowsAffected ?? 0);
  }

  if (idsClassementsDemo.length > 0) {
    const r = await base
      .delete(lignesClassement)
      .where(inArray(lignesClassement.classementId, idsClassementsDemo));
    effaces += r.rowsAffected ?? 0;
  }

  // Des enfants vers les parents.
  const ordre = [
    episodes,
    rencontres,
    classements,
    effectifs,
    joueurs,
    actualites,
    etapesProjet,
    membresStaff,
    partenaires,
    saisons,
  ] as const;

  for (const table of ordre) {
    const r = await base.delete(table).where(eq(table.demo, true));
    effaces += r.rowsAffected ?? 0;
  }

  return effaces;
}

/** Remet les compteurs d'auto-incrementation a plat apres une purge. */
export async function tasserIdentifiants(): Promise<void> {
  await db().run(sql`vacuum`);
}
