"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Champ photo de l'administration (fiche fiches/photos.md) : la photo
 * actuelle, le choix d'une nouvelle avec son apercu, et une case pour la
 * retirer. Le controle de poids ici n'est qu'un confort : le serveur refait
 * tout, format compris, dans src/lib/images.ts.
 */

const TAILLE_MAX = 12 * 1024 * 1024;

export function ChampImage({
  nom,
  libelle,
  actuelle,
  aide,
  forme = "portrait",
  position,
}: {
  nom: string;
  libelle: string;
  actuelle: string | null;
  aide?: string;
  forme?: "portrait" | "paysage" | "logo";
  /** `object-position` de la photo en place (point de visage d'un joueur). */
  position?: string;
}) {
  const [apercu, setApercu] = useState<string | null>(null);
  const [trop, setTrop] = useState(false);
  const [retirer, setRetirer] = useState(false);

  const champ = useRef<HTMLInputElement>(null);
  // Un identifiant par instance (audit U1) : une page porte souvent plusieurs
  // formulaires avec un champ « photo ».
  const id = `${nom}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => () => {
    if (apercu) URL.revokeObjectURL(apercu);
  }, [apercu]);

  // React vide le formulaire apres un envoi (form.reset()) : l'apercu et la
  // case « retirer » suivent, sinon ils montreraient une photo deja partie.
  useEffect(() => {
    const formulaire = champ.current?.form;
    if (!formulaire) return;
    const remettre = () => {
      setApercu(null);
      setTrop(false);
      setRetirer(false);
    };
    formulaire.addEventListener("reset", remettre);
    return () => formulaire.removeEventListener("reset", remettre);
  }, []);

  const cadre =
    forme === "portrait" ? "aspect-[4/5] w-28" : forme === "paysage" ? "aspect-[16/9] w-48" : "aspect-[3/2] w-36";
  const montree = retirer ? null : (apercu ?? actuelle);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-craie-douce)]">
        {libelle}{" "}
        <span className="ml-1 text-xs font-normal text-[var(--color-craie-tenue)]">(facultatif)</span>
      </label>
      <div className="mt-1.5 flex flex-wrap items-start gap-4">
        <div
          className={`${cadre} shrink-0 overflow-hidden rounded-lg border border-[var(--color-nuit-trait)] bg-[var(--color-nuit)]`}
        >
          {montree ? (
            // Apercu local (blob:) ou photo deja optimisee : next/image n'apporterait rien ici.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={montree}
              alt=""
              style={apercu ? undefined : { objectPosition: position }}
              className={`h-full w-full ${forme === "logo" ? "object-contain p-2" : "object-cover"}`}
            />
          ) : (
            <span className="grid h-full place-items-center text-xs text-[var(--color-craie-tenue)]">Aucune</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={champ}
            id={id}
            name={nom}
            aria-describedby={`${id}-aide`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="block w-full text-sm text-[var(--color-craie-douce)] file:mr-3 file:min-h-11 file:rounded-lg file:border file:border-[var(--color-nuit-trait)] file:bg-[var(--color-nuit)] file:px-4 file:text-[var(--color-craie)]"
            onChange={(e) => {
              const fichier = e.currentTarget.files?.[0];
              const tropLourde = Boolean(fichier && fichier.size > TAILLE_MAX);
              setTrop(tropLourde);
              // Bloque l'envoi dans le navigateur : au-dela de 13 Mo, c'est Next qui
              // couperait la requete, avec une page d'erreur au lieu d'une phrase.
              e.currentTarget.setCustomValidity(tropLourde ? "Cette photo dépasse 12 Mo." : "");
              setApercu(fichier ? URL.createObjectURL(fichier) : null);
              if (fichier) setRetirer(false);
            }}
          />
          <p id={`${id}-aide`} className="text-sm text-[var(--color-craie-tenue)]">
            {aide ?? "JPEG, PNG, WebP ou AVIF, 12 Mo au plus. Le site la redimensionne et retire la position GPS."}
          </p>
          {trop ? (
            <p role="alert" className="text-xs text-[var(--color-erreur)]">
              Cette photo dépasse 12 Mo : elle sera refusée. Choisissez une version plus légère.
            </p>
          ) : null}
          {actuelle && !apercu ? (
            <label className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-craie-douce)]">
              <input
                type="checkbox"
                name={`${nom}_retirer`}
                value="1"
                checked={retirer}
                onChange={(e) => setRetirer(e.currentTarget.checked)}
              />
              Retirer la photo
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
}
