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
      className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-amber-950"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold">
          Ce site contient encore {total} {total > 1 ? "éléments" : "élément"} de
          démonstration.
        </p>
        <p className="mt-1 text-sm text-amber-900">
          {detail.map((ligne) => `${ligne.nombre} ${ligne.libelle}`).join(", ")}.
          À retirer avant la mise en ligne, avec la commande{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
            npm run db:purge-demo
          </code>
          .
        </p>
      </div>
    </div>
  );
}
