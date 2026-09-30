import { z } from "zod";

/**
 * Le classement de la poule (fiche fiches/classement.md), logique pure et
 * testee. Saisi a la main chaque semaine sur une grille preremplie : les
 * equipes restent, seuls les chiffres et l'ordre changent. Le rang est la
 * position dans la grille, pour qu'il n'y ait qu'une seule verite.
 *
 * Principe 4 du codex : au-dela de 30 jours sans mise a jour (choix du
 * 01-10-2026), le classement disparait du site plutot que de mentir.
 */

export const PEREMPTION_CLASSEMENT_JOURS = 30;
export const LIGNES_MAX = 20;

export type LigneSaisie = {
  equipe: string;
  estNous: boolean;
  points: number | null;
  joues: number | null;
  gagnes: number | null;
  perdus: number | null;
};

const nombre = z.string().regex(/^\d{0,3}$/, "Les chiffres du classement sont des nombres entiers.");

/** Lit la grille : champs `equipe_<i>`, `points_<i>`... et le bouton radio `nous`. */
export function lireClassement(
  donnees: FormData,
): { ok: true; intitule: string | null; lignes: LigneSaisie[] } | { ok: false; erreur: string } {
  const texte = (cle: string) => {
    const v = donnees.get(cle);
    return typeof v === "string" ? v.trim() : "";
  };
  const intitule = texte("intitule");
  if (intitule.length > 80) return { ok: false, erreur: "L'intitulé dépasse 80 caractères." };

  const total = Math.min(Number(texte("nombre")) || 0, LIGNES_MAX);
  const nous = texte("nous");
  const lignes: LigneSaisie[] = [];
  for (let i = 0; i < total; i++) {
    const equipe = texte(`equipe_${i}`);
    if (!equipe) continue;
    if (equipe.length > 60) return { ok: false, erreur: `Le nom « ${equipe.slice(0, 20)}... » dépasse 60 caractères.` };
    const chiffres: Record<string, number | null> = {};
    for (const cle of ["points", "joues", "gagnes", "perdus"]) {
      const brut = texte(`${cle}_${i}`);
      const analyse = nombre.safeParse(brut);
      if (!analyse.success) return { ok: false, erreur: `${equipe} : ${analyse.error.issues[0]?.message}` };
      chiffres[cle] = brut === "" ? null : Number(brut);
    }
    const { points, joues, gagnes, perdus } = chiffres as Record<"points" | "joues" | "gagnes" | "perdus", number | null>;
    if (joues !== null && gagnes !== null && perdus !== null && gagnes + perdus > joues) {
      return { ok: false, erreur: `${equipe} : plus de victoires et de défaites que de matchs joués.` };
    }
    lignes.push({ equipe, estNous: nous === String(i), points, joues, gagnes, perdus });
  }

  if (lignes.length === 0) return { ok: false, erreur: "Ajoutez au moins une équipe." };
  const noms = new Set(lignes.map((l) => l.equipe.toLowerCase()));
  if (noms.size !== lignes.length) return { ok: false, erreur: "Une équipe apparaît deux fois." };
  if (lignes.filter((l) => l.estNous).length !== 1) return { ok: false, erreur: "Indiquez laquelle des équipes est la nôtre." };

  return { ok: true, intitule: intitule || null, lignes };
}

/** Le classement se montre s'il a ete mis a jour il y a 30 jours au plus. */
export function classementAJour(misAJourLe: Date | null, maintenant: Date): boolean {
  if (!misAJourLe) return false;
  const ecart = maintenant.getTime() - misAJourLe.getTime();
  return ecart >= 0 && ecart <= PEREMPTION_CLASSEMENT_JOURS * 24 * 60 * 60 * 1000;
}

/** « 3e sur 10 », « 1er sur 10 ». */
export function rangEnToutesLettres(rang: number, total: number): string {
  return `${rang}${rang === 1 ? "er" : "e"} sur ${total}`;
}

/** Au-dela, le tableau de bord rappelle le classement, avant qu'il ne disparaisse du site. */
export const RAPPEL_CLASSEMENT_JOURS = 21;

/**
 * Pourquoi le classement est a revoir, ou null (audit U6) : absent alors qu'un
 * match a ete joue, plus ancien que le dernier match joue, ou vieux de trois
 * semaines.
 */
export function raisonDeRevoirLeClassement(
  misAJourLe: Date | null,
  dernierMatchJoue: Date | null,
  maintenant: Date,
): string | null {
  if (!misAJourLe) return dernierMatchJoue ? "Pas encore de classement pour cette saison." : null;
  if (dernierMatchJoue && dernierMatchJoue > misAJourLe) return "Un match a été joué depuis la dernière mise à jour.";
  if (maintenant.getTime() - misAJourLe.getTime() > RAPPEL_CLASSEMENT_JOURS * 24 * 60 * 60 * 1000) {
    return `Il a plus de trois semaines : il disparaîtra du site à ${PEREMPTION_CLASSEMENT_JOURS} jours.`;
  }
  return null;
}

