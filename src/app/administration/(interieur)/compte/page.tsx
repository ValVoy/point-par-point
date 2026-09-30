import { LONGUEUR_MINIMALE } from "@/lib/auth/mots-de-passe";
import { exigerConnexion } from "@/lib/auth/session-courante";
import { FormulaireMotDePasse } from "./formulaire-mot-de-passe";

export const metadata = { title: "Mon compte" };

/** Ouvert a tout compte connecte : c'est ici qu'on remplace un mot de passe provisoire. */
export default async function PageMonCompte() {
  const moi = await exigerConnexion();
  return (
    <>
      <h1 className="titre-admin text-3xl">Mon compte</h1>
      <p className="mt-2 text-sm text-[var(--color-craie-douce)]">
        {moi.nom} ({moi.email}), {moi.role === "admin" ? "administrateur" : "rédacteur"}.
      </p>
      <section className="mt-8">
        <h2 className="font-semibold">Changer de mot de passe</h2>
        <p className="mt-1 max-w-prose text-sm text-[var(--color-craie-tenue)]">
          À faire dès la première connexion si vous avez reçu un mot de passe provisoire.
        </p>
        <FormulaireMotDePasse longueurMinimale={LONGUEUR_MINIMALE} />
      </section>
    </>
  );
}
