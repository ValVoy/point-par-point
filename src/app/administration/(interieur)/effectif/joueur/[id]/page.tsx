import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { exigerDroit } from "@/lib/auth/session-courante";
import { pourChampDate } from "@/lib/dates";
import { db } from "@/lib/db";
import { joueurs } from "@/lib/db/schema";
import { urlPhoto } from "@/lib/effectif-public";
import { EffacerDefinitivement } from "@/components/effacer-definitivement";
import { FormulaireFiche } from "../formulaire-fiche";
import { effacerJoueurDefinitivement } from "../actions";

export const metadata = { title: "Fiche joueur" };

/** La fiche d'un joueur (fiche fiches/fiche-joueur.md), ouverte depuis l'effectif. */
export default async function PageFicheJoueur({ params }: { params: Promise<{ id: string }> }) {
  await exigerDroit("gererEffectif");
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [j] = await db().select().from(joueurs).where(eq(joueurs.id, id)).limit(1);
  if (!j) notFound();

  return (
    <>
      <Link
        href="/administration/effectif"
        className="inline-flex min-h-11 items-center text-sm text-[var(--color-turquoise)] hover:underline"
      >
        Retour à l&apos;effectif
      </Link>
      <h1 className="titre-admin mt-2 text-3xl">
        {j.prenom} {j.nom}
      </h1>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-craie-douce)]">
        Ce que le site montre de lui, sur sa page{" "}
        <Link href={`/effectif/${j.slug}`} className="text-[var(--color-turquoise)] underline underline-offset-2">
          /effectif/{j.slug}
        </Link>
        . Tout est facultatif sauf le prénom et le nom : une fiche à moitié remplie s&apos;affiche proprement. Le numéro et le
        poste se changent dans l&apos;effectif de la saison.
      </p>
      <FormulaireFiche
        fiche={{
          id: j.id,
          prenom: j.prenom,
          nom: j.nom,
          neLe: pourChampDate(j.neLe),
          tailleCm: j.tailleCm ? String(j.tailleCm) : "",
          presentation: j.presentation ?? "",
          parcours: j.parcours ?? "",
          photo: urlPhoto(j.photoCle),
          visageX: j.visageX,
          visageY: j.visageY,
        }}
      />

      {/* Pour une demande de retrait (politique de confidentialite, audit R1). */}
      <section className="mt-12 max-w-3xl rounded-xl border border-[var(--color-erreur)]/60 p-5">
        <h2 className="font-semibold">Effacer ce joueur</h2>
        <p className="mt-1 max-w-prose text-sm text-[var(--color-craie-douce)]">
          À faire seulement s&apos;il demande le retrait de ses données : sa fiche, sa photo, sa présence dans les
          effectifs de toutes les saisons et ses feuilles de match disparaissent pour de bon. S&apos;il quitte
          simplement l&apos;équipe, retirez-le plutôt de l&apos;effectif de la saison.
        </p>
        <div className="mt-4">
          <EffacerDefinitivement
            action={effacerJoueurDefinitivement}
            champs={{ id: j.id }}
            libelle={`Effacer ${j.prenom} ${j.nom}`}
            explication="Je comprends que c'est définitif"
          />
        </div>
      </section>
    </>
  );
}
