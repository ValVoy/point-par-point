import Link from "next/link";
import { notFound } from "next/navigation";
import { exigerDroit } from "@/lib/auth/session-courante";
import { peut } from "@/lib/auth/roles";
import { dateCourte } from "@/lib/dates";
import { actualiteParId } from "@/lib/actualites";
import { FormulaireActualite } from "../formulaire-actualite";
import { basculerPublicationActualite, mettreActualiteALaCorbeille } from "../actions";
import { urlPhoto } from "@/lib/effectif-public";

export const metadata = { title: "Modifier une actualité" };

export default async function PageActualite({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creee?: string }>;
}) {
  const utilisateur = await exigerDroit("redigerContenu");

  const { id } = await params;
  const { creee } = await searchParams;
  const identifiant = Number(id);
  if (!Number.isInteger(identifiant)) notFound();

  const actualite = await actualiteParId(identifiant);
  if (!actualite || actualite.supprimeLe) notFound();
  const brouillon = actualite.etat === "brouillon";

  return (
    <>
      <Link
        href="/administration/actualites"
        className="text-sm text-[var(--color-turquoise)] inline-flex min-h-11 items-center hover:underline"
      >
        Retour aux actualités
      </Link>
      <h1 className="mt-3 titre-admin text-3xl">{actualite.titre}</h1>
      <p className="mt-1 text-sm text-[var(--color-craie-douce)]">
        {brouillon
          ? "Brouillon, invisible sur le site"
          : `Publiée le ${dateCourte(actualite.publieLe)}`}
      </p>

      {creee ? (
        <p
          role="status"
          className="mt-4 max-w-3xl rounded-lg bg-[var(--color-turquoise-sourd)] px-3 py-2 text-sm text-[var(--color-turquoise-clair)]"
        >
          Brouillon enregistré. Relisez-le avec l&apos;aperçu, puis publiez-le.
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_16rem]">
        <div className="max-w-3xl rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5">
          <FormulaireActualite
            actualite={{
              id: actualite.id,
              titre: actualite.titre,
              chapo: actualite.chapo ?? "",
              corps: actualite.corps,
              image: urlPhoto(actualite.imageCle),
              imageDescription: actualite.imageDescription,
            }}
          />
        </div>

        <aside className="space-y-4 self-start text-sm">
          {peut(utilisateur, "publierContenu") ? (
            <form
              action={basculerPublicationActualite}
              className="rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-4"
            >
              <input type="hidden" name="id" value={actualite.id} />
              <input type="hidden" name="vers" value={actualite.etat === "brouillon" ? "publie" : "brouillon"} />
              <p className="text-xs text-[var(--color-craie-tenue)]">
                {brouillon
                  ? "Publier rend l'actualité visible sur le site, datée d'aujourd'hui. Les modifications non enregistrées ci-contre ne partent pas."
                  : "Dépublier la retire du site sans la perdre."}
              </p>
              <button
                type="submit"
                className={
                  brouillon
                    ? "mt-3 w-full rounded-lg bg-[var(--color-craie)] px-3 py-2 font-medium text-[var(--color-nuit-surface)]"
                    : "mt-2 text-[var(--color-craie-douce)] action-admin"
                }
              >
                {brouillon ? "Publier" : "Dépublier"}
              </button>
            </form>
          ) : null}

          <form
            action={mettreActualiteALaCorbeille}
            className="rounded-xl border border-dashed border-[var(--color-nuit-trait)] p-4"
          >
            <input type="hidden" name="id" value={actualite.id} />
            <p className="text-xs text-[var(--color-craie-tenue)]">
              L&apos;actualité disparaît du site mais reste restaurable.
            </p>
            <button type="submit" className="mt-2 text-[var(--color-craie-tenue)] action-admin">
              Mettre à la corbeille
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}
