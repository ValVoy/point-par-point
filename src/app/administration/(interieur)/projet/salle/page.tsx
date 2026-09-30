import { CLES_REGLAGE, lireReglage } from "@/lib/reglages";
import { FormulaireSalle } from "./formulaire-salle";

export const metadata = { title: "Venir à la salle" };

/**
 * Le texte « Venir a la salle » de la page publique « Ou nous voir » : ce que
 * le visiteur demanderait sinon par message. Le nom et l'adresse de la salle,
 * eux, viennent des matchs a domicile.
 */
export default async function PageSalle() {
  const texte = (await lireReglage(CLES_REGLAGE.venirALaSalle)) ?? "";
  return (
    <section className="max-w-3xl">
      <p className="mb-4 max-w-prose text-sm text-[var(--color-craie-douce)]">
        Ce qui aide à venir voir un match : transports en commun (ligne, arrêt, minutes à pied),
        vélo, voiture et parking, accès pour les personnes à mobilité réduite, entrée gratuite ou
        non, heure d&apos;ouverture, buvette. Le nom et l&apos;adresse de la salle viennent déjà des
        matchs à domicile. Vide, le bloc n&apos;apparaît pas sur le site.
      </p>
      <FormulaireSalle texte={texte} />
    </section>
  );
}
