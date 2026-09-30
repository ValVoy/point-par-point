"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { exigerDroit } from "@/lib/auth/session-courante";
import { db } from "@/lib/db";
import { joueurs } from "@/lib/db/schema";
import { lireImageDuFormulaire } from "@/lib/envoi-image";
import { lireFicheJoueur } from "@/lib/fiche-joueur";
import { effacerJoueur } from "@/lib/effacement";
import { redirect } from "next/navigation";

/**
 * La fiche d'un joueur (fiche fiches/fiche-joueur.md). L'adresse publique ne
 * suit pas le nom : corriger une faute ne doit pas casser un lien deja
 * partage. Une nouvelle photo, ou son retrait, remet le point de visage a
 * zero : il a ete place sur l'ancienne.
 */

export type EtatFiche = { erreur: string | null; enregistre?: boolean };

export async function enregistrerFicheJoueur(_precedent: EtatFiche, donnees: FormData): Promise<EtatFiche> {
  await exigerDroit("gererEffectif");
  const id = Number(donnees.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { erreur: "Joueur inconnu." };

  const [joueur] = await db()
    .select({ slug: joueurs.slug, photoCle: joueurs.photoCle })
    .from(joueurs)
    .where(eq(joueurs.id, id))
    .limit(1);
  if (!joueur) return { erreur: "Joueur inconnu." };

  const lu = lireFicheJoueur(donnees, new Date());
  if (!lu.ok) return { erreur: lu.erreur };

  const image = await lireImageDuFormulaire(donnees, "photo", { dossier: "joueurs", genre: "photo", ancienne: joueur.photoCle });
  if (!image.ok) return { erreur: image.erreur };

  const photoChange = image.cle !== undefined;
  const { visage, ...fiche } = lu.fiche;
  try {
    await db()
      .update(joueurs)
      .set({
        ...fiche,
        ...(photoChange ? { photoCle: image.cle, visageX: null, visageY: null } : { visageX: visage?.x ?? null, visageY: visage?.y ?? null }),
        modifieLe: new Date(),
      })
      .where(eq(joueurs.id, id));
  } catch (erreur) {
    await image.annuler();
    throw erreur;
  }
  await image.apresEnregistrement();

  revalidatePath("/administration/effectif");
  revalidatePath(`/administration/effectif/joueur/${id}`);
  revalidatePath("/effectif");
  revalidatePath(`/effectif/${joueur.slug}`);
  return { erreur: null, enregistre: true };
}

/**
 * Effacement definitif d'un joueur (audit R1, R2) : sa fiche, ses lignes
 * d'effectif de toutes les saisons, ses feuilles de match et sa photo. Pour
 * une demande de retrait ; un depart se gere en le retirant de l'effectif.
 */
export async function effacerJoueurDefinitivement(donnees: FormData): Promise<void> {
  await exigerDroit("viderCorbeille");
  if (donnees.get("confirme") !== "1") return;
  const id = Number(donnees.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  if (await effacerJoueur(id)) {
    revalidatePath("/administration/effectif");
    revalidatePath("/effectif");
    revalidatePath("/matchs");
    redirect("/administration/effectif");
  }
}
