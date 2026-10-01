import type { ReactNode } from "react";

/**
 * Le titre d'un chapitre (fiche fiches/refonte-respiration.md) : en grand,
 * colle a son contenu, et decouvert par le volet en triangle quand la page
 * est enveloppee dans `Volets`. Le grand vide, lui, est avant : c'est la
 * section qui le porte (utilitaire `chapitre`).
 */
export function TitreChapitre({
  id,
  surtitre,
  children,
  action,
}: {
  id: string;
  surtitre?: string;
  children: ReactNode;
  /** Un lien aligne sur le titre, « Tout l'effectif » par exemple. */
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        {surtitre ? <p className="etiquette text-[var(--color-turquoise)]">{surtitre}</p> : null}
        <h2 id={id} data-volet className={`titre-affiche titre-chapitre text-balance ${surtitre ? "mt-3" : ""}`}>
          {children}
        </h2>
      </div>
      {action ? <div className="pb-1">{action}</div> : null}
    </div>
  );
}
