import { exigerDroit } from "@/lib/auth/session-courante";
import { Onglets } from "./onglets";

/**
 * La vitrine du projet : trois listes courtes, reunies sous un meme onglet de
 * l'administration parce qu'elles nourrissent les memes pages publiques (le
 * projet, l'equipe derriere, les partenaires).
 */
export default async function LayoutProjet({ children }: { children: React.ReactNode }) {
  await exigerDroit("gererProjet");

  return (
    <>
      <h1 className="titre-admin text-3xl">Le projet</h1>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-craie-douce)]">
        Ce que le site raconte de lui-même : l&apos;histoire du projet, les
        personnes derrière, les partenaires, et comment venir à la salle.
      </p>
      <Onglets />
      <div className="mt-6">{children}</div>
    </>
  );
}
