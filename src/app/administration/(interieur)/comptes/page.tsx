import Link from "next/link";
import { exigerDroit } from "@/lib/auth/session-courante";
import { listerComptes } from "@/lib/comptes";
import { dateCourte } from "@/lib/dates";
import { LigneCompte } from "./ligne-compte";
import { NouveauCompte } from "./nouveau-compte";

export const metadata = { title: "Comptes" };

/**
 * Les comptes de l'administration (fiche fiches/comptes.md). Deux roles figes
 * dans le code, pas d'ecran de permissions. Rien ne s'efface : un compte qui
 * ne sert plus se desactive, et perd ses sessions sur-le-champ.
 */
export default async function PageComptes() {
  const utilisateur = await exigerDroit("gererComptes");
  const comptes = await listerComptes();

  return (
    <>
      <h1 className="titre-admin text-3xl">Comptes</h1>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-craie-douce)]">
        Qui peut entrer dans l&apos;administration. Un rédacteur écrit, publie, saisit les résultats et lit les
        messages ; un administrateur fait tout, y compris ici. Un compte qui ne sert plus se désactive : il est
        déconnecté aussitôt, et peut revenir. Votre propre mot de passe se change dans{" "}
        <Link href="/administration/compte" className="text-[var(--color-turquoise)] underline underline-offset-2">
          Mon compte
        </Link>
        .
      </p>

      <ul className="mt-8 space-y-3">
        {comptes.map((c) => (
          <LigneCompte
            key={c.id}
            soiMeme={c.id === utilisateur.id}
            compte={{
              id: c.id,
              nom: c.nom,
              email: c.email,
              role: c.role,
              actif: c.actif,
              derniereConnexion: c.derniereConnexionLe ? dateCourte(c.derniereConnexionLe) : null,
            }}
          />
        ))}
      </ul>

      <NouveauCompte />
    </>
  );
}
