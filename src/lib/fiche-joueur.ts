import { z } from "zod";

/**
 * Les regles de la fiche joueur (fiche fiches/fiche-joueur.md), logique pure et
 * testee. Tout est facultatif sauf le prenom et le nom : principe 3 du codex,
 * la saisie est partielle par nature, et une fiche a moitie remplie s'affiche
 * proprement.
 */

const texte = (max: number, nom: string) => z.string().trim().max(max, `${nom} dépasse ${max} caractères.`);

const schema = z.object({
  prenom: texte(60, "Le prénom").min(1, "Le prénom est obligatoire."),
  nom: texte(60, "Le nom").min(1, "Le nom est obligatoire."),
  neLe: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Date de naissance invalide."),
  tailleCm: z.string().regex(/^\d{0,3}$/, "La taille se donne en centimètres, sans virgule."),
  presentation: texte(1000, "La présentation"),
  parcours: texte(1000, "Le parcours"),
  visageX: z.string().regex(/^\d{0,3}$/),
  visageY: z.string().regex(/^\d{0,3}$/),
});

export type FicheJoueur = {
  prenom: string;
  nom: string;
  neLe: Date | null;
  tailleCm: number | null;
  presentation: string | null;
  parcours: string | null;
  visage: { x: number; y: number } | null;
};

const champ = (donnees: FormData, cle: string) => {
  const valeur = donnees.get(cle);
  return typeof valeur === "string" ? valeur : "";
};

export function lireFicheJoueur(
  donnees: FormData,
  maintenant: Date,
): { ok: true; fiche: FicheJoueur } | { ok: false; erreur: string } {
  const analyse = schema.safeParse({
    prenom: champ(donnees, "prenom"),
    nom: champ(donnees, "nom"),
    neLe: champ(donnees, "neLe"),
    tailleCm: champ(donnees, "tailleCm"),
    presentation: champ(donnees, "presentation"),
    parcours: champ(donnees, "parcours"),
    visageX: champ(donnees, "visageX"),
    visageY: champ(donnees, "visageY"),
  });
  if (!analyse.success) return { ok: false, erreur: analyse.error.issues[0]?.message ?? "Saisie invalide." };
  const d = analyse.data;

  let neLe: Date | null = null;
  if (d.neLe) {
    // A midi en heure universelle : aucun fuseau ne fait changer le jour.
    neLe = new Date(`${d.neLe}T12:00:00Z`);
    const annee = neLe.getUTCFullYear();
    if (Number.isNaN(neLe.getTime()) || neLe.toISOString().slice(0, 10) !== d.neLe) {
      return { ok: false, erreur: "Date de naissance invalide." };
    }
    if (annee < maintenant.getUTCFullYear() - 80 || neLe > maintenant) {
      return { ok: false, erreur: "Cette date de naissance ne paraît pas plausible." };
    }
  }

  const tailleCm = d.tailleCm ? Number(d.tailleCm) : null;
  if (tailleCm !== null && (tailleCm < 120 || tailleCm > 240)) {
    return { ok: false, erreur: "La taille se donne en centimètres, entre 120 et 240." };
  }

  const x = d.visageX === "" ? null : Number(d.visageX);
  const y = d.visageY === "" ? null : Number(d.visageY);
  const visage = x !== null && y !== null && x <= 100 && y <= 100 ? { x, y } : null;

  return {
    ok: true,
    fiche: {
      prenom: d.prenom,
      nom: d.nom,
      neLe,
      tailleCm,
      presentation: d.presentation || null,
      parcours: d.parcours || null,
      visage,
    },
  };
}

