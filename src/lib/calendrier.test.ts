import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { grouperParMois, statutPublic, type MatchCalendrier } from "./calendrier";

const HEURE = 3_600_000;
const maintenant = new Date("2026-10-03T19:00:00Z");

function match(partiel: Partial<MatchCalendrier>): MatchCalendrier {
  return { joueLe: new Date("2026-10-10T18:30:00Z"), etat: "a_venir", setsNous: null, setsEux: null, ...partiel };
}

describe("statutPublic", () => {
  it("annonce un match a venir", () => {
    assert.equal(statutPublic(match({}), maintenant), "a_venir");
  });

  it("dit « en cours » pendant les trois heures qui suivent le coup d'envoi", () => {
    assert.equal(statutPublic(match({ joueLe: new Date(maintenant.getTime() - HEURE) }), maintenant), "en_cours");
  });

  it("dit « score a venir » quand le match est passe sans score, jamais un 0-0", () => {
    assert.equal(statutPublic(match({ joueLe: new Date(maintenant.getTime() - 5 * HEURE) }), maintenant), "score_a_venir");
    assert.equal(statutPublic(match({ etat: "jouee" }), maintenant), "score_a_venir");
  });

  it("ne dit jamais « en cours » pour un match sans horaire : il est a venir jusqu'au soir", () => {
    // Range a 23 h 59 (lib/horaire.ts) : apres, c'est le score qu'on attend.
    const sansHeure = match({ joueLe: new Date("2026-10-03T21:59:00Z"), heureConnue: false });
    assert.equal(statutPublic(sansHeure, maintenant), "a_venir");
    assert.equal(statutPublic(sansHeure, new Date("2026-10-03T22:30:00Z")), "score_a_venir");
  });

  it("dit « joue » quand le total en sets est connu", () => {
    assert.equal(statutPublic(match({ etat: "jouee", setsNous: 3, setsEux: 1 }), maintenant), "jouee");
  });

  it("garde reporte et annule tels quels", () => {
    assert.equal(statutPublic(match({ etat: "reportee" }), maintenant), "reportee");
    assert.equal(statutPublic(match({ etat: "annulee" }), maintenant), "annulee");
  });
});

describe("grouperParMois", () => {
  it("regroupe par mois a Paris, dans l'ordre, avec un libelle lisible", () => {
    const groupes = grouperParMois([
      match({ joueLe: new Date("2026-09-12T18:00:00Z") }),
      match({ joueLe: new Date("2026-09-26T18:00:00Z") }),
      // Le 31 octobre a 23 h 30 UTC est le 1er novembre a 0 h 30 a Paris : le
      // mois se decide a l'heure de Paris, pas en UTC.
      match({ joueLe: new Date("2026-10-31T23:30:00Z") }),
    ]);
    assert.deepEqual(
      groupes.map((g) => [g.cle, g.libelle, g.matchs.length]),
      [
        ["2026-09", "septembre 2026", 2],
        ["2026-11", "novembre 2026", 1],
      ],
    );
  });
});
