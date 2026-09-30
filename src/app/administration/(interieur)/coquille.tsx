import Link from "next/link";
import type { UtilisateurConnecte } from "@/lib/auth/sessions";
import { peut, type Action } from "@/lib/auth/roles";
import { NOM_DU_SITE } from "@/lib/site";
import { deconnecter } from "../connexion/actions";
import { NavAdministration } from "./nav-administration";

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
  nonLus = 0,
  children,
}: {
  utilisateur: UtilisateurConnecte;
  nonLus?: number;
  children: React.ReactNode;
}) {
  const rubriques = RUBRIQUES.filter((r) => peut(utilisateur, r.droit));

  return (
    <div className="min-h-dvh bg-[var(--color-nuit)]">
      <header className="border-b border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold">
            {NOM_DU_SITE}
          </Link>
          <span className="text-xs text-[var(--color-craie-tenue)]">
            Administration
          </span>

          <div className="ml-auto flex items-center gap-6">
            <Link
              href="/administration/compte"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-[var(--color-craie-douce)] hover:text-[var(--color-craie)]"
            >
              {utilisateur.nom}
              <span className="rounded bg-[var(--color-turquoise-sourd)] px-1.5 py-0.5 text-xs text-[var(--color-turquoise-clair)]">
                {utilisateur.role === "admin" ? "administrateur" : "rédacteur"}
              </span>
              <span className="sr-only"> : mon compte</span>
            </Link>
            <form action={deconnecter} className="border-l border-[var(--color-nuit-trait)] pl-6">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center text-sm text-[var(--color-craie-douce)] underline underline-offset-2 hover:text-[var(--color-craie)]"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>

        <NavAdministration rubriques={rubriques.map(({ href, libelle }) => ({ href, libelle }))} nonLus={nonLus} />
      </header>

      <main id="contenu" className="mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
