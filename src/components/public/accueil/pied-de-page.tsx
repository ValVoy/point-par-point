import { EQUIPE, NOM_DU_SITE } from "@/lib/site";

/**
 * Le pied de page de l'accueil, volontairement court tant que les autres
 * pages n'existent pas : on n'annonce pas un lien qui ne mene nulle part.
 * Les mentions legales et la politique de confidentialite s'y ajouteront
 * avant la mise en ligne.
 */
export function PiedDePage({ saison }: { saison: string | null }) {
  return (
    <footer className="border-t border-[var(--color-nuit-trait)]">
      <div className="colonne-large flex flex-wrap items-baseline justify-between gap-4 py-10 text-sm text-[var(--color-craie-douce)]">
        <p>
          <span className="titre-affiche mr-3 text-2xl text-[var(--color-craie)]">{NOM_DU_SITE}</span>
          {EQUIPE}
        </p>
        {saison ? <p>Saison {saison}</p> : null}
      </div>
    </footer>
  );
}
