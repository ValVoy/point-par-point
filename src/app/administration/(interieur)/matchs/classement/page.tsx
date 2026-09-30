import Link from "next/link";
import { exigerDroit } from "@/lib/auth/session-courante";
import { classementAJour, PEREMPTION_CLASSEMENT_JOURS } from "@/lib/classement";
import { classementDeLaSaison } from "@/lib/classement-base";
import { dateLongue } from "@/lib/dates";
import { saisonCourante } from "@/lib/saisons";
import { GrilleClassement } from "./grille-classement";

export const metadata = { title: "Classement" };

/**
 * Le classement de la poule de la saison courante (fiche fiches/classement.md).
 * La grille reprend la derniere version enregistree : la mise a jour de la
 * semaine ne demande que les chiffres.
 */
export default async function PageClassement() {
  await exigerDroit("saisirResultats");
  const saison = await saisonCourante();
  const maintenant = new Date();

  if (!saison) {
    return (
      <>
        <h1 className="titre-admin text-3xl">Classement</h1>
        <p className="mt-4 text-sm text-[var(--color-craie-douce)]">
          Aucune saison courante :{" "}
          <Link href="/administration/saisons" className="text-[var(--color-turquoise)] underline">
            en choisir une
          </Link>{" "}
          avant de saisir le classement.
        </p>
      </>
    );
  }

  const classement = await classementDeLaSaison(saison.id);
  const aJour = classement ? classementAJour(classement.misAJourLe, maintenant) : false;

  return (
    <>
      <Link href="/administration/matchs" className="inline-flex min-h-11 items-center text-sm text-[var(--color-turquoise)] hover:underline">
        Retour aux matchs
      </Link>
      <h1 className="titre-admin mt-2 text-3xl">Classement, saison {saison.libelle}</h1>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-craie-douce)]">
        Recopiez le classement de la poule après chaque journée : les équipes restent, changez les chiffres et
        l&apos;ordre. Le rang est la position dans la liste. Sans mise à jour pendant {PEREMPTION_CLASSEMENT_JOURS}{" "}
        jours, le classement disparaît du site plutôt que d&apos;afficher des chiffres dépassés.
      </p>
      {classement?.misAJourLe ? (
        <p className={`mt-3 text-sm ${aJour ? "text-[var(--color-craie-tenue)]" : "text-[var(--color-jaune)]"}`}>
          Dernière mise à jour le {dateLongue(classement.misAJourLe)}
          {aJour ? "." : " : il n'apparaît plus sur le site."}
        </p>
      ) : null}
      <GrilleClassement
        saisonId={saison.id}
        intitule={classement?.intitule ?? ""}
        initiales={(classement?.lignes ?? []).map((l) => ({
          equipe: l.equipe,
          estNous: l.estNous,
          points: l.points?.toString() ?? "",
          joues: l.joues?.toString() ?? "",
          gagnes: l.gagnes?.toString() ?? "",
          perdus: l.perdus?.toString() ?? "",
        }))}
      />
    </>
  );
}
