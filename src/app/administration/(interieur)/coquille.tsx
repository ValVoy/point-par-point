import Link from "next/link";
import type { UtilisateurConnecte } from "@/lib/auth/sessions";
import { peut, type Action } from "@/lib/auth/roles";
import { NOM_DU_SITE } from "@/lib/site";
import { deconnecter } from "../connexion/actions";

/**
 * Navigation de l'administration. Chaque entree porte le droit qu'elle exige :
 * un redacteur ne voit tout simplement pas les rubriques qui lui sont fermees,
 * plutot que de decouvrir un refus en cliquant.
 *
 * Cacher n'est pas proteger : chaque page refait le controle de son cote, via
 * `exigerDroit`. Ceci n'est que le confort.
 */
const RUBRIQUES: { href: string; libelle: string; droit: Action }[] = [
  { href: "/administration", libelle: "Tableau de bord", droit: "redigerContenu" },
  { href: "/administration/matchs", libelle: "Matchs", droit: "saisirResultats" },
  { href: "/administration/effectif", libelle: "Effectif", droit: "gererEffectif" },
  { href: "/administration/episodes", libelle: "Épisodes", droit: "redigerContenu" },
  { href: "/administration/actualites", libelle: "Actualités", droit: "redigerContenu" },
  { href: "/administration/projet", libelle: "Le projet", droit: "gererProjet" },
  { href: "/administration/messages", libelle: "Messages", droit: "lireMessages" },
  { href: "/administration/saisons", libelle: "Saisons", droit: "gererSaisons" },
  { href: "/administration/comptes", libelle: "Comptes", droit: "gererComptes" },
];

export function Coquille({
  utilisateur,
  children,
}: {
  utilisateur: UtilisateurConnecte;
  children: React.ReactNode;
}) {
  const rubriques = RUBRIQUES.filter((r) => peut(utilisateur, r.droit));

  return (
    <div className="min-h-dvh bg-[var(--color-papier-creuse)]">
      <header className="border-b border-[var(--color-trait)] bg-[var(--color-papier)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link href="/" className="text-sm font-semibold">
            {NOM_DU_SITE}
          </Link>
          <span className="text-xs text-[var(--color-encre-tenue)]">
            Administration
          </span>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-[var(--color-encre-douce)]">
              {utilisateur.nom}
              <span className="ml-1.5 rounded bg-[var(--color-accent-sourd)] px-1.5 py-0.5 text-[var(--color-accent)]">
                {utilisateur.role}
              </span>
            </span>
            <form action={deconnecter}>
              <button
                type="submit"
                className="text-xs text-[var(--color-encre-douce)] underline underline-offset-2 hover:text-[var(--color-encre)]"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>

        <nav className="mx-auto max-w-5xl overflow-x-auto px-4">
          <ul className="flex gap-4 pb-2 text-sm whitespace-nowrap">
            {rubriques.map((rubrique) => (
              <li key={rubrique.href}>
                <Link
                  href={rubrique.href}
                  className="text-[var(--color-encre-douce)] hover:text-[var(--color-accent)]"
                >
                  {rubrique.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
