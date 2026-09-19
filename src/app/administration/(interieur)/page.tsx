import { exigerConnexion } from "@/lib/auth/session-courante";
import { peut } from "@/lib/auth/roles";

export default async function TableauDeBord() {
  const utilisateur = await exigerConnexion();

  return (
    <>
      <h1 className="font-[family-name:var(--font-titre)] text-3xl">
        Bonjour {utilisateur.nom}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-encre-douce)]">
        {peut(utilisateur, "gererComptes")
          ? "Vous avez accès à l'ensemble de l'administration."
          : "Vous pouvez rédiger et saisir. La structure du site et les comptes sont réservés à l'administrateur."}
      </p>

      <div className="mt-8 rounded-xl border border-[var(--color-trait)] bg-[var(--color-papier)] p-5">
        <p className="text-sm text-[var(--color-encre-douce)]">
          Les écrans de saisie arrivent dans les prochaines séances. Les
          fondations sont en place : comptes, rôles, et la base contient déjà le
          jeu de démonstration.
        </p>
      </div>
    </>
  );
}
