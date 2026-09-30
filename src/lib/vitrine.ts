import { and, asc, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "./db";
import { etapesProjet, partenaires, rencontres } from "./db/schema";
import { matchDuTableau } from "./resultats";
import { saisonCourante } from "./saisons";

/**
 * Lectures des pages de vitrine : le projet, ou nous voir, les partenaires
 * (fiche fiches/vitrine.md). Seul le contenu publie, actif et hors corbeille
 * en sort.
 */

/** La chronologie publiee, dans l'ordre du recit choisi dans l'administration. */
export async function etapesPubliees() {
  return db()
    .select()
    .from(etapesProjet)
    .where(and(eq(etapesProjet.etat, "publie"), isNull(etapesProjet.supprimeLe)))
    .orderBy(asc(etapesProjet.ordre), asc(etapesProjet.survenuLe), asc(etapesProjet.id));
}

/** Les partenaires affiches, dans l'ordre choisi dans l'administration. */
export async function partenairesAffiches() {
  return db()
    .select({ id: partenaires.id, nom: partenaires.nom, lien: partenaires.lien, logoCle: partenaires.logoCle })
    .from(partenaires)
    .where(and(eq(partenaires.actif, true), isNull(partenaires.supprimeLe)))
    .orderBy(asc(partenaires.ordre), asc(partenaires.id));
}

/**
 * La salle de l'equipe et ses prochains matchs a domicile. Aucune table ne
 * decrit la salle : elle se deduit des matchs a domicile de la saison, la
 * plus frequente l'emporte (une salle d'appoint une fois dans l'annee ne la
 * remplace pas).
 */
export async function ouNousVoir(maintenant = new Date()) {
  const saison = await saisonCourante();
  const aDomicile = saison
    ? await db()
        .select()
        .from(rencontres)
        .where(
          and(
            eq(rencontres.saisonId, saison.id),
            eq(rencontres.aDomicile, true),
            isNull(rencontres.supprimeLe),
            isNotNull(rencontres.salleNom),
          ),
        )
        .orderBy(asc(rencontres.joueLe))
    : [];

  const frequences = new Map<string, { nom: string; adresse: string | null; latitude: number | null; longitude: number | null; fois: number }>();
  for (const m of aDomicile) {
    const cle = `${m.salleNom}|${m.salleAdresse ?? ""}`;
    const deja = frequences.get(cle);
    if (deja) deja.fois += 1;
    else frequences.set(cle, { nom: m.salleNom!, adresse: m.salleAdresse, latitude: m.salleLatitude, longitude: m.salleLongitude, fois: 1 });
  }
  const salle = [...frequences.values()].sort((a, b) => b.fois - a.fois)[0] ?? null;

  // Les matchs a venir, en gardant trois heures celui qui vient de commencer.
  const premier = matchDuTableau(aDomicile, maintenant);
  const aVenir = premier ? aDomicile.slice(aDomicile.indexOf(premier)).filter((m) => m.etat === "a_venir") : [];

  return { maintenant, saison: saison?.libelle ?? null, salle, aVenir };
}
