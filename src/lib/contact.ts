import { z } from "zod";

/**
 * Les regles du formulaire de contact (fiche fiches/contact.md), logique pure
 * et testee. Le formulaire est le premier endroit ou un inconnu ecrit dans la
 * base : tout est borne, et un robot qui remplit le champ piege est ecarte en
 * silence (il croit avoir reussi, il ne recommence pas autrement).
 */

export const SUJETS = {
  question: "Une question",
  partenariat: "Devenir partenaire",
  presse: "Presse ou média",
  rejoindre: "Rejoindre l'équipe",
  serie: "Une idée pour la série",
  autre: "Autre chose",
} as const;

export type Sujet = keyof typeof SUJETS;

const estSujet = (valeur: unknown): valeur is Sujet => typeof valeur === "string" && valeur in SUJETS;

/** Le sujet pre-rempli depuis l'adresse (/contact?sujet=partenariat), s'il est connu. */
export function sujetInitial(valeur: string | undefined): Sujet {
  return estSujet(valeur) ? valeur : "question";
}

/**
 * Le nom du champ piege : invisible et hors du parcours clavier, seul un robot
 * le remplit. Volontairement sans sens : un nom comme « site_web » attirerait
 * le remplissage automatique des navigateurs, et un vrai visiteur serait
 * ecarte en silence.
 */
export const CHAMP_PIEGE = "zq_ref";

const schema = z.object({
  nom: z.string().trim().min(1, "Indiquez votre nom.").max(80, "Le nom dépasse 80 caractères."),
  email: z
    .string()
    .trim()
    .max(160, "L'adresse dépasse 160 caractères.")
    .pipe(z.email("Cette adresse e-mail n'est pas valide.")),
  message: z
    .string()
    .trim()
    .min(10, "Le message est trop court (10 caractères au moins).")
    .max(3000, "Le message dépasse 3 000 caractères."),
});

export type MessageLu = { nom: string; email: string; sujet: Sujet; message: string };

export type ChampContact = "nom" | "email" | "message";

export function lireMessage(
  donnees: FormData,
): { ok: true; message: MessageLu } | { ok: false; robot: boolean; erreur: string; champ?: ChampContact } {
  if ((donnees.get(CHAMP_PIEGE) ?? "").toString() !== "") {
    return { ok: false, robot: true, erreur: "" };
  }
  const texte = (cle: string) => (donnees.get(cle) ?? "").toString();
  const analyse = schema.safeParse({ nom: texte("nom"), email: texte("email"), message: texte("message") });
  if (!analyse.success) {
    const probleme = analyse.error.issues[0];
    return {
      ok: false,
      robot: false,
      erreur: probleme?.message ?? "Message invalide.",
      champ: probleme?.path[0] as ChampContact | undefined,
    };
  }
  const sujet = texte("sujet");
  return { ok: true, message: { ...analyse.data, sujet: estSujet(sujet) ? sujet : "autre" } };
}
