import type { ListeOrdonnee } from "@/lib/ordre";
import { corbeilleElement, deplacerElement } from "./actions";

/**
 * Briques partagees par les trois listes de la vitrine : une ligne qui se
 * deplie sur son formulaire, avec ses boutons de deplacement, et la corbeille.
 * La ligne repliee est un <details> natif : ouverture au clavier et au doigt
 * sans une ligne de JavaScript.
 */

function Bouton({
  liste,
  id,
  action,
  champ,
  valeur,
  libelle,
  children,
  desactive,
}: {
  liste: ListeOrdonnee;
  id: number;
  action: (donnees: FormData) => Promise<void>;
  champ?: string;
  valeur?: string;
  libelle: string;
  children: React.ReactNode;
  desactive?: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="liste" value={liste} />
      <input type="hidden" name="id" value={id} />
      {champ ? <input type="hidden" name={champ} value={valeur} /> : null}
      <button
        type="submit"
        aria-label={libelle}
        title={libelle}
        disabled={desactive}
        className="rounded-md px-2 py-1 text-[var(--color-encre-douce)] hover:bg-[var(--color-papier-creuse)] disabled:opacity-30"
      >
        {children}
      </button>
    </form>
  );
}

export function LigneElement({
  liste,
  id,
  titre,
  details,
  premier,
  dernier,
  actions,
  children,
}: {
  liste: ListeOrdonnee;
  id: number;
  titre: string;
  details?: React.ReactNode;
  premier: boolean;
  dernier: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-xl border border-[var(--color-trait)] bg-[var(--color-papier)]">
      <div className="flex flex-wrap items-center gap-2 p-3">
        <div className="flex flex-col">
          <Bouton liste={liste} id={id} action={deplacerElement} champ="sens" valeur="haut" libelle={`Monter « ${titre} »`} desactive={premier}>
            ▲
          </Bouton>
          <Bouton liste={liste} id={id} action={deplacerElement} champ="sens" valeur="bas" libelle={`Descendre « ${titre} »`} desactive={dernier}>
            ▼
          </Bouton>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{titre}</p>
          {details ? <div className="mt-0.5 text-xs text-[var(--color-encre-tenue)]">{details}</div> : null}
        </div>
        <div className="flex items-center gap-2 text-sm">{actions}</div>
      </div>
      <details className="group border-t border-[var(--color-trait)]">
        <summary className="cursor-pointer px-4 py-2 text-sm text-[var(--color-accent)] hover:underline">
          Modifier
        </summary>
        <div className="space-y-4 px-4 pb-4">
          {children}
          <Bouton liste={liste} id={id} action={corbeilleElement} libelle="Mettre à la corbeille">
            <span className="text-xs text-[var(--color-encre-tenue)] underline">Mettre à la corbeille</span>
          </Bouton>
        </div>
      </details>
    </li>
  );
}

export function Corbeille({
  liste,
  elements,
}: {
  liste: ListeOrdonnee;
  elements: { id: number; libelle: string }[];
}) {
  if (elements.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold text-[var(--color-encre-douce)]">Corbeille</h2>
      <p className="mt-1 text-xs text-[var(--color-encre-tenue)]">Rien n&apos;est effacé : ces éléments peuvent revenir.</p>
      <ul className="mt-3 space-y-2">
        {elements.map((element) => (
          <li
            key={element.id}
            className="flex items-center gap-4 rounded-lg border border-dashed border-[var(--color-trait)] px-4 py-2.5 text-sm"
          >
            <span className="text-[var(--color-encre-tenue)]">{element.libelle}</span>
            <form action={corbeilleElement} className="ml-auto">
              <input type="hidden" name="liste" value={liste} />
              <input type="hidden" name="id" value={element.id} />
              <input type="hidden" name="restaurer" value="1" />
              <button type="submit" className="text-[var(--color-accent)] hover:underline">
                Restaurer
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
