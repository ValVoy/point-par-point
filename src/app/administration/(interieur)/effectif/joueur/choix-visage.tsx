"use client";

import { useState } from "react";
import { positionPhoto } from "@/lib/position-photo";

/**
 * Placer le point de visage : un clic sur la photo, ou les deux curseurs au
 * clavier. A cote, l'apercu du cadrage tel qu'il sortira sur la carte de
 * l'effectif (4:5), pour juger sans aller-retour sur le site.
 */
export function ChoixVisage({ photo, x: x0, y: y0 }: { photo: string; x: number | null; y: number | null }) {
  const [x, setX] = useState<number | null>(x0);
  const [y, setY] = useState<number | null>(y0);
  const place = x !== null && y !== null;

  return (
    <fieldset className="rounded-xl border border-[var(--color-nuit-trait)] p-4">
      <legend className="px-1 text-sm font-medium text-[var(--color-craie-douce)]">Point de visage</legend>
      <p className="text-xs text-[var(--color-craie-tenue)]">
        Cliquez sur le visage : chaque cadrage du site le gardera dans le champ. Sans point, la photo est calée
        en haut. Une nouvelle photo remet le point à zéro.
      </p>
      <input type="hidden" name="visageX" value={x ?? ""} />
      <input type="hidden" name="visageY" value={y ?? ""} />

      <div className="mt-3 flex flex-wrap items-start gap-4">
        <button
          type="button"
          aria-label="Placer le point de visage à l'endroit du clic"
          className="relative w-56 max-w-full cursor-crosshair overflow-hidden rounded-lg"
          onClick={(e) => {
            const cadre = e.currentTarget.getBoundingClientRect();
            setX(Math.round(((e.clientX - cadre.left) / cadre.width) * 100));
            setY(Math.round(((e.clientY - cadre.top) / cadre.height) * 100));
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" className="block w-full" />
          {place ? (
            <span
              aria-hidden="true"
              className="absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-jaune)] shadow-[0_0_0_2px_rgba(0,0,0,0.6)]"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          ) : null}
        </button>

        <div className="space-y-3">
          <p className="text-xs text-[var(--color-craie-tenue)]">Sur la carte de l&apos;effectif</p>
          <div className="aspect-[4/5] w-28 overflow-hidden rounded-lg bg-[var(--color-nuit)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" className="h-full w-full object-cover grayscale" style={{ objectPosition: positionPhoto({ x, y }) }} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-[var(--color-craie-douce)]">
          De gauche à droite : {x ?? "non placé"}
          <input
            type="range"
            min={0}
            max={100}
            value={x ?? 50}
            onChange={(e) => {
              setX(Number(e.currentTarget.value));
              if (y === null) setY(20);
            }}
            className="mt-1 block min-h-11 w-full accent-[var(--color-jaune)]"
          />
        </label>
        <label className="text-xs text-[var(--color-craie-douce)]">
          De haut en bas : {y ?? "non placé"}
          <input
            type="range"
            min={0}
            max={100}
            value={y ?? 20}
            onChange={(e) => {
              setY(Number(e.currentTarget.value));
              if (x === null) setX(50);
            }}
            className="mt-1 block min-h-11 w-full accent-[var(--color-jaune)]"
          />
        </label>
      </div>
      {place ? (
        <button
          type="button"
          className="action-admin mt-3 text-sm text-[var(--color-craie-douce)]"
          onClick={() => {
            setX(null);
            setY(null);
          }}
        >
          Enlever le point
        </button>
      ) : null}
    </fieldset>
  );
}
