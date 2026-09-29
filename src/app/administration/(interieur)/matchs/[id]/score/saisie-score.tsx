"use client";

import Link from "next/link";
import { useActionState, useState, type ChangeEvent } from "react";
import { BoutonEnvoi } from "@/components/formulaire";
import { analyserSets, NOMBRE_DE_SETS_MAX, type SetSaisi } from "@/lib/score";
import { enregistrerScore, type EtatScore } from "../../actions";

/*
 * L'ecran du gymnase. Pense pour un pouce, un telephone et une salle bruyante :
 * gros chiffres, clavier numerique, passage automatique au champ suivant, et
 * le total calcule sous les yeux avant d'envoyer. Les champs sont controles
 * pour survivre a un refus du serveur, comme sur la grille du calendrier.
 */

type Mode = "sets" | "final";

const ETAT_INITIAL: EtatScore = { erreurs: [], alertes: [], enregistre: false };

const CLASSE_POINTS =
  "h-16 w-full rounded-xl border border-[var(--color-trait)] bg-white text-center text-3xl font-semibold tabular-nums outline-none focus:border-[var(--color-accent)]";

/** Deux chiffres tapes : on passe au champ suivant, sans lever le pouce. */
function avancer(evenement: ChangeEvent<HTMLInputElement>) {
  if (evenement.target.value.length < 2) return;
  const champs = Array.from(
    evenement.target.form?.querySelectorAll<HTMLInputElement>("input[data-points]") ?? [],
  );
  champs[champs.indexOf(evenement.target) + 1]?.focus();
}

/** Un set de plus n'apparait que si le match n'est pas encore decide. */
function setsAffiches(sets: SetSaisi[]): number {
  let affiches = 3;
  for (let n = 3; n < NOMBRE_DE_SETS_MAX; n += 1) {
    const jusquIci = analyserSets(sets.slice(0, n));
    const complet = sets.slice(0, n).every((s) => s.nous && s.eux);
    const decide = jusquIci.setsNous === 3 || jusquIci.setsEux === 3;
    const dejaRempli = Boolean(sets[n]?.nous || sets[n]?.eux);
    if ((complet && !decide) || dejaRempli) affiches = n + 1;
    else break;
  }
  return affiches;
}

export function SaisieScore({
  id,
  adversaire,
  setsInitiaux,
  finalInitial,
}: {
  id: number;
  adversaire: string;
  setsInitiaux: SetSaisi[];
  finalInitial: { nous: string; eux: string } | null;
}) {
  const [etat, action] = useActionState(enregistrerScore, ETAT_INITIAL);
  const [mode, setMode] = useState<Mode>(finalInitial ? "final" : "sets");
  const [sets, setSets] = useState<SetSaisi[]>(() =>
    Array.from({ length: NOMBRE_DE_SETS_MAX }, (_, i) => setsInitiaux[i] ?? { nous: "", eux: "" }),
  );
  const [final, setFinal] = useState(finalInitial ?? { nous: "", eux: "" });

  const analyse = analyserSets(sets);
  const nombre = setsAffiches(sets);
  // En direct, un set a moitie saisi est normal : c'est qu'on est en train de
  // le taper. Seul le serveur le refuse, a l'envoi.
  const erreurs =
    etat.erreurs.length > 0
      ? etat.erreurs
      : mode === "sets"
        ? analyse.erreurs.filter((m) => !m.includes("il manque"))
        : [];

  function modifier(index: number, cote: keyof SetSaisi, valeur: string) {
    const chiffres = valeur.replace(/\D/g, "").slice(0, 2);
    setSets((actuels) => actuels.map((s, i) => (i === index ? { ...s, [cote]: chiffres } : s)));
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="mode" value={mode} />

      <div role="group" aria-label="Type de saisie" className="grid grid-cols-2 gap-1 rounded-xl bg-[var(--color-papier-creuse)] p-1 text-sm">
        {(["sets", "final"] as const).map((valeur) => (
          <button
            key={valeur}
            type="button"
            aria-pressed={mode === valeur}
            onClick={() => setMode(valeur)}
            className="rounded-lg py-2.5 font-medium text-[var(--color-encre-douce)] aria-pressed:bg-white aria-pressed:text-[var(--color-encre)] aria-pressed:shadow-sm"
          >
            {valeur === "sets" ? "Set par set" : "Score final seul"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[3.5rem_1fr_1fr] items-end gap-3 text-center text-xs font-medium text-[var(--color-encre-tenue)]">
        <span />
        <span>Nous</span>
        <span className="truncate">{adversaire}</span>
      </div>

      {mode === "sets" ? (
        <ol className="space-y-3">
          {sets.slice(0, nombre).map((set, index) => (
            <li key={index} className="grid grid-cols-[3.5rem_1fr_1fr] items-center gap-3">
              <span className="text-sm font-medium text-[var(--color-encre-douce)]">
                Set {index + 1}
              </span>
              {(["nous", "eux"] as const).map((cote) => (
                <input
                  key={cote}
                  data-points
                  name={`set${index + 1}${cote === "nous" ? "Nous" : "Eux"}`}
                  aria-label={`Set ${index + 1}, points ${cote === "nous" ? "de notre équipe" : adversaire}`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  enterKeyHint="next"
                  value={set[cote]}
                  onChange={(e) => {
                    modifier(index, cote, e.target.value);
                    avancer(e);
                  }}
                  className={CLASSE_POINTS}
                />
              ))}
            </li>
          ))}
        </ol>
      ) : (
        <div className="grid grid-cols-[3.5rem_1fr_1fr] items-center gap-3">
          <span className="text-sm font-medium text-[var(--color-encre-douce)]">Sets</span>
          {(["nous", "eux"] as const).map((cote) => (
            <input
              key={cote}
              name={cote === "nous" ? "finalNous" : "finalEux"}
              aria-label={`Sets gagnés par ${cote === "nous" ? "notre équipe" : adversaire}`}
              inputMode="numeric"
              pattern="[0-3]"
              maxLength={1}
              autoComplete="off"
              value={final[cote]}
              onChange={(e) =>
                setFinal((actuel) => ({ ...actuel, [cote]: e.target.value.replace(/[^0-3]/g, "") }))
              }
              className={CLASSE_POINTS}
            />
          ))}
          <p className="col-span-3 text-xs text-[var(--color-encre-tenue)]">
            Enregistrer un score final seul efface le détail des sets déjà saisi.
          </p>
        </div>
      )}

      {mode === "sets" && analyse.sets.length > 0 ? (
        <p className="text-center text-sm text-[var(--color-encre-douce)]">
          Total{" "}
          <span className="text-2xl font-semibold text-[var(--color-encre)] tabular-nums">
            {analyse.setsNous} - {analyse.setsEux}
          </span>
        </p>
      ) : null}

      {erreurs.length > 0 ? (
        <ul role="alert" className="space-y-1 rounded-lg bg-[var(--color-defaite)]/10 px-3 py-2 text-sm text-[var(--color-defaite)]">
          {erreurs.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      ) : null}

      {mode === "sets" && analyse.alertes.length > 0 ? (
        <ul className="space-y-1 rounded-lg bg-[var(--color-accent-sourd)] px-3 py-2 text-sm text-[var(--color-encre-douce)]">
          {analyse.alertes.map((m) => (
            <li key={m}>{m} Enregistrable quand même.</li>
          ))}
        </ul>
      ) : null}

      {etat.enregistre ? (
        <p role="status" className="rounded-lg bg-[var(--color-victoire)]/10 px-3 py-2 text-sm text-[var(--color-victoire)]">
          Score enregistré.{" "}
          <Link href="/administration/matchs" className="underline">
            Retour aux matchs
          </Link>
        </p>
      ) : null}

      <div className="[&>button]:w-full [&>button]:py-3.5 [&>button]:text-base">
        <BoutonEnvoi>Enregistrer le score</BoutonEnvoi>
      </div>
    </form>
  );
}
