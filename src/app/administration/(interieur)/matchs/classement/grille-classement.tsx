"use client";

import { useActionState, useState } from "react";
import { useAvertirAvantDeQuitter } from "@/components/avertir-avant-de-quitter";
import { BoutonEnvoi, Erreur } from "@/components/formulaire";
import { enregistrerClassement, type EtatClassement } from "./actions";

/**
 * La grille du classement (fiche fiches/classement.md), preremplie avec la
 * derniere version : chaque semaine, on ne change que les chiffres et, si
 * besoin, l'ordre. Le rang est la position dans la grille. Sur telephone,
 * une carte par equipe ; sur grand ecran, une ligne.
 */

type Ligne = {
  cle: number;
  equipe: string;
  points: string;
  joues: string;
  gagnes: string;
  perdus: string;
  estNous: boolean;
};

export type LigneInitiale = Omit<Ligne, "cle">;

const INITIAL: EtatClassement = { erreur: null };
const CHAMP =
  "min-h-11 w-full rounded-lg border border-[var(--color-nuit-bord)] bg-[var(--color-nuit)] px-3 text-[var(--color-craie)] focus:border-[var(--color-turquoise)]";
const CHIFFRES = [
  { cle: "points", court: "Pts", long: "Points" },
  { cle: "joues", court: "J", long: "Matchs joués" },
  { cle: "gagnes", court: "G", long: "Gagnés" },
  { cle: "perdus", court: "P", long: "Perdus" },
] as const;

let prochaineCle = 1;
const vide = (): Ligne => ({ cle: prochaineCle++, equipe: "", points: "", joues: "", gagnes: "", perdus: "", estNous: false });

export function GrilleClassement({
  saisonId,
  intitule,
  initiales,
}: {
  saisonId: number;
  intitule: string;
  initiales: LigneInitiale[];
}) {
  const [etat, action] = useActionState(enregistrerClassement, INITIAL);
  const [lignes, setLignes] = useState<Ligne[]>(() =>
    initiales.length > 0 ? initiales.map((l) => ({ ...l, cle: prochaineCle++ })) : Array.from({ length: 8 }, vide),
  );

  // Une saisie non enregistree se signale avant de quitter la page (audit U7).
  // La reference suit le dernier enregistrement reussi.
  const empreinte = JSON.stringify(lignes.map((l) => [l.equipe, l.points, l.joues, l.gagnes, l.perdus, l.estNous]));
  const [reference, setReference] = useState(empreinte);
  const [dernierEtat, setDernierEtat] = useState(etat);
  if (etat !== dernierEtat) {
    setDernierEtat(etat);
    if (etat.enregistre) setReference(empreinte);
  }
  useAvertirAvantDeQuitter(empreinte !== reference);

  const changer = (cle: number, champ: keyof Ligne, valeur: string | boolean) =>
    setLignes((avant) =>
      avant.map((l) => (l.cle === cle ? { ...l, [champ]: valeur } : champ === "estNous" && valeur ? { ...l, estNous: false } : l)),
    );
  const deplacer = (index: number, sens: -1 | 1) =>
    setLignes((avant) => {
      const cible = index + sens;
      if (cible < 0 || cible >= avant.length) return avant;
      const copie = [...avant];
      [copie[index], copie[cible]] = [copie[cible]!, copie[index]!];
      return copie;
    });

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="saisonId" value={saisonId} />
      <input type="hidden" name="nombre" value={lignes.length} />
      <div className="max-w-md">
        <label htmlFor="intitule" className="block text-sm font-medium text-[var(--color-craie-douce)]">
          Intitulé <span className="ml-1 text-xs font-normal text-[var(--color-craie-tenue)]">facultatif</span>
        </label>
        <input id="intitule" name="intitule" defaultValue={intitule} maxLength={80} placeholder="Départementale, poule A" className={`mt-1.5 ${CHAMP}`} />
      </div>

      {/* Intitules des colonnes en grand ecran ; sur telephone, chaque chiffre porte le sien. */}
      <div
        aria-hidden="true"
        className="hidden gap-x-3 px-3 text-xs font-semibold tracking-[0.12em] text-[var(--color-craie-tenue)] uppercase lg:grid lg:grid-cols-[2rem_1fr_repeat(4,4.5rem)_5.5rem_12.5rem]"
      >
        <span className="text-center">#</span>
        <span>Équipe</span>
        {CHIFFRES.map((c) => (
          <span key={c.cle} className="text-center" title={c.long}>
            {c.court}
          </span>
        ))}
      </div>
      <ol className="space-y-2">
        {lignes.map((l, i) => (
          <li
            key={l.cle}
            className={`grid grid-cols-[2rem_1fr] items-center gap-x-3 gap-y-2 rounded-xl border p-3 lg:grid-cols-[2rem_1fr_repeat(4,4.5rem)_5.5rem_12.5rem] ${l.estNous ? "border-[var(--color-jaune)] bg-[var(--color-nuit-surface)]" : "border-[var(--color-nuit-trait)]"}`}
          >
            <span className="titre-affiche text-center text-2xl text-[var(--color-craie-douce)]" aria-hidden="true">
              {i + 1}
            </span>
            <input
              aria-label={`Équipe au rang ${i + 1}`}
              name={`equipe_${i}`}
              value={l.equipe}
              maxLength={60}
              onChange={(e) => changer(l.cle, "equipe", e.currentTarget.value)}
              className={CHAMP}
            />
            <div className="col-span-2 grid grid-cols-4 gap-2 lg:contents">
              {CHIFFRES.map((c) => (
                <label key={c.cle} className="text-xs text-[var(--color-craie-tenue)]">
                  <span aria-hidden="true" className="lg:hidden">{c.court}</span>
                  <span className="sr-only">
                    {c.long}, rang {i + 1}
                  </span>
                  <input
                    name={`${c.cle}_${i}`}
                    inputMode="numeric"
                    pattern="\d{0,3}"
                    maxLength={3}
                    value={l[c.cle]}
                    onChange={(e) => changer(l.cle, c.cle, e.currentTarget.value)}
                    className={`${CHAMP} mt-1 text-center text-base tabular-nums lg:mt-0`}
                  />
                </label>
              ))}
            </div>
            <div className="col-span-2 flex flex-wrap items-center gap-2 lg:contents">
              <label className="inline-flex min-h-11 items-center gap-2 pr-2 text-sm text-[var(--color-craie-douce)]">
                <input type="radio" name="nous" value={i} checked={l.estNous} onChange={() => changer(l.cle, "estNous", true)} className="size-5 accent-[var(--color-jaune)]" />
                Nous
              </label>
              <span className="flex gap-2">
                <button type="button" className="action-admin min-w-11 justify-center" aria-label={`Monter l'équipe du rang ${i + 1}`} disabled={i === 0} onClick={() => deplacer(i, -1)}>
                  ▲
                </button>
                <button
                  type="button"
                  className="action-admin min-w-11 justify-center"
                  aria-label={`Descendre l'équipe du rang ${i + 1}`}
                  disabled={i === lignes.length - 1}
                  onClick={() => deplacer(i, 1)}
                >
                  ▼
                </button>
                <button
                  type="button"
                  className="action-admin text-sm text-[var(--color-craie-tenue)]"
                  onClick={() => setLignes((avant) => avant.filter((x) => x.cle !== l.cle))}
                >
                  Enlever
                </button>
              </span>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-4">
        {lignes.length < 20 ? (
          <button type="button" className="action-admin text-sm text-[var(--color-turquoise)]" onClick={() => setLignes((avant) => [...avant, vide()])}>
            Ajouter une équipe
          </button>
        ) : null}
        <BoutonEnvoi>Enregistrer le classement</BoutonEnvoi>
        <Erreur message={etat.erreur} />
        {etat.enregistre ? (
          <p role="status" className="text-sm text-[var(--color-turquoise-clair)]">
            Classement enregistré, à jour à la date d&apos;aujourd&apos;hui.
          </p>
        ) : null}
      </div>
    </form>
  );
}
