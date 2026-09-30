import { TableauResultat } from "@/components/public/tableau-resultat";
import styles from "./planche.module.css";

/*
 * Le tableau du dernier match dans ses cas limites : une victoire a
 * l'exterieur (le score se lit adversaire d'abord, comme sur le tableau de la
 * salle) et une defaite au tie-break, cinq sets, le cas le plus large sur un
 * telephone.
 */

export function TableauScore() {
  return (
    <section className="colonne-large border-t border-[var(--color-nuit-trait)] py-20">
      <p className={styles.etiquette}>04 · Après le match</p>
      <h2 className="titre-affiche mt-3 text-5xl sm:text-7xl">Le score, jusqu&apos;au tie-break</h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--color-craie-douce)]">
        Le cinquième set est le cas le plus large sur un téléphone : cinq scores côte à côte.
      </p>
      <div className="mt-12 grid gap-8 xl:grid-cols-2">
        <TableauResultat
          resultat={{ adversaire: "Adversaire", domicile: false, dateLisible: "Samedi 27 septembre", sets: [[25, 21], [22, 25], [25, 19], [25, 23]] }}
        />
        <TableauResultat
          resultat={{ adversaire: "Adversaire", domicile: true, dateLisible: "Samedi 20 septembre", sets: [[25, 21], [22, 25], [19, 25], [25, 23], [12, 15]] }}
        />
      </div>
    </section>
  );
}
