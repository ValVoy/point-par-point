import { compterDemo } from "@/lib/demo";

/**
 * Le garde-fou decide au cadrage. Le site est livre rempli de faux joueurs
 * pour que l'ami n'ait pas a decouvrir un site vide ; ce bandeau est ce qui
 * rend l'oubli impossible le jour de la mise en ligne.
 *
 * Il est volontairement impossible a fermer : un bandeau qu'on peut faire
 * taire est un bandeau qu'on fera taire.
 */
export async function BandeauDemo() {
  const { total, detail } = await compterDemo();
  if (total === 0) return null;

  return (
    <div
      role="status"
      className="border-b border-l-8 border-[var(--color-nuit-trait)] border-l-[var(--color-jaune)] bg-[var(--color-nuit)] px-4 py-3 text-[var(--color-craie)]"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold">
          Ce site contient encore {total} {total > 1 ? "éléments" : "élément"} de
          démonstration.
        </p>
        <p className="mt-1 text-sm text-[var(--color-craie-douce)]">
          {detail.map((ligne) => `${ligne.nombre} ${ligne.libelle}`).join(", ")}.
          À retirer avant la mise en ligne : Valentin s&apos;en charge le jour venu.
        </p>
      </div>
    </div>
  );
}
