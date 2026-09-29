import { useRef, useState } from "react";
import { TexteLeger } from "./texte-leger";

/*
 * Editeur du texte leger. Les boutons posent la syntaxe autour de la
 * selection : l'ami n'a jamais a connaitre les asterisques, mais peut les
 * taper s'il les connait. L'apercu montre exactement le rendu du site, avec
 * le meme composant.
 *
 * Pas de directive "use client" ici : l'editeur ne s'utilise que depuis un
 * formulaire qui est deja un composant client, dont il herite. La directive
 * ferait de lui une frontiere, ou une fonction `onChange` n'a pas le droit de
 * passer.
 */

export const CLASSES_APERCU =
  "text-[var(--color-encre)] [&_p]:mt-3 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h2:first-child]:mt-0 [&_a]:text-[var(--color-accent)] [&_a]:underline";

type Action = "intertitre" | "gras" | "italique" | "lien";

const BOUTONS: { action: Action; libelle: string; classe: string }[] = [
  { action: "intertitre", libelle: "Intertitre", classe: "font-semibold" },
  { action: "gras", libelle: "Gras", classe: "font-bold" },
  { action: "italique", libelle: "Italique", classe: "italic" },
  { action: "lien", libelle: "Lien", classe: "underline" },
];

/** Applique une mise en forme ; renvoie le nouveau texte et la selection a restaurer. */
function appliquer(texte: string, debut: number, fin: number, action: Action) {
  const choisi = texte.slice(debut, fin);

  if (action === "intertitre") {
    const debutLigne = texte.lastIndexOf("\n", debut - 1) + 1;
    const dejaTitre = texte.startsWith("## ", debutLigne);
    const nouveau = dejaTitre
      ? texte.slice(0, debutLigne) + texte.slice(debutLigne + 3)
      : `${texte.slice(0, debutLigne)}## ${texte.slice(debutLigne)}`;
    const decalage = dejaTitre ? -3 : 3;
    return { texte: nouveau, debut: debut + decalage, fin: fin + decalage };
  }

  if (action === "lien") {
    const libelle = choisi || "texte du lien";
    const insertion = `[${libelle}](https://)`;
    const debutAdresse = debut + libelle.length + 3;
    return {
      texte: texte.slice(0, debut) + insertion + texte.slice(fin),
      debut: debutAdresse,
      fin: debutAdresse + "https://".length,
    };
  }

  const marque = action === "gras" ? "**" : "*";
  const interieur = choisi || (action === "gras" ? "texte en gras" : "texte en italique");
  return {
    texte: texte.slice(0, debut) + marque + interieur + marque + texte.slice(fin),
    debut: debut + marque.length,
    fin: debut + marque.length + interieur.length,
  };
}

export function EditeurTexteLeger({
  nom,
  libelle,
  valeur,
  onChange,
  lignes = 12,
  requis,
}: {
  nom: string;
  libelle: string;
  valeur: string;
  onChange: (valeur: string) => void;
  lignes?: number;
  requis?: boolean;
}) {
  const zone = useRef<HTMLTextAreaElement>(null);
  const [apercu, setApercu] = useState(false);

  function surBouton(action: Action) {
    const element = zone.current;
    if (!element) return;
    const resultat = appliquer(valeur, element.selectionStart, element.selectionEnd, action);
    onChange(resultat.texte);
    // La selection se restaure apres que React a pose la nouvelle valeur.
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(resultat.debut, resultat.fin);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <label htmlFor={nom} className="block text-sm font-medium text-[var(--color-encre-douce)]">
          {libelle}
        </label>
        <div className="flex flex-wrap gap-1 text-xs">
          {BOUTONS.map((bouton) => (
            <button
              key={bouton.action}
              type="button"
              disabled={apercu}
              onClick={() => surBouton(bouton.action)}
              className={`rounded-md border border-[var(--color-trait)] bg-white px-2 py-1 text-[var(--color-encre-douce)] disabled:opacity-40 ${bouton.classe}`}
            >
              {bouton.libelle}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={apercu}
            onClick={() => setApercu((actuel) => !actuel)}
            className="rounded-md border border-[var(--color-trait)] bg-white px-2 py-1 text-[var(--color-accent)] aria-pressed:bg-[var(--color-accent)] aria-pressed:text-white"
          >
            Aperçu
          </button>
        </div>
      </div>

      {/* La zone reste dans le formulaire pendant l'apercu : c'est elle qui est envoyee. */}
      <textarea
        ref={zone}
        id={nom}
        name={nom}
        rows={lignes}
        // Un champ requis mais masque bloquerait l'envoi sans message visible.
        required={requis && !apercu}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        hidden={apercu}
        className="mt-1.5 w-full rounded-lg border border-[var(--color-trait)] bg-white px-3 py-2 font-mono text-sm leading-relaxed text-[var(--color-encre)] outline-none focus:border-[var(--color-accent)]"
      />
      {apercu ? (
        <div className="mt-1.5 min-h-40 rounded-lg border border-dashed border-[var(--color-trait)] bg-white px-4 py-3">
          {valeur.trim() ? (
            <TexteLeger texte={valeur} className={CLASSES_APERCU} />
          ) : (
            <p className="text-sm text-[var(--color-encre-tenue)]">Rien à afficher pour l&apos;instant.</p>
          )}
        </div>
      ) : null}
      <p className="mt-1 text-xs text-[var(--color-encre-tenue)]">
        Une ligne vide sépare deux paragraphes. Sélectionnez un mot puis un bouton pour le mettre
        en forme.
      </p>
    </div>
  );
}
