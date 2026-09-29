import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { depuisChampDateHeure, pourChampDateHeure } from "./dates";

describe("depuisChampDateHeure", () => {
  it("lit une heure d'ete comme heure de Paris, UTC+2", () => {
    const date = depuisChampDateHeure("2026-10-04T20:30");
    assert.equal(date?.toISOString(), "2026-10-04T18:30:00.000Z");
  });

  it("lit une heure d'hiver comme heure de Paris, UTC+1", () => {
    const date = depuisChampDateHeure("2026-12-12T20:30");
    assert.equal(date?.toISOString(), "2026-12-12T19:30:00.000Z");
  });

  it("tient le jour du passage a l'heure d'hiver", () => {
    // 25-10-2026 : a 3 h, il est 2 h. Le soir, on est en heure d'hiver.
    const date = depuisChampDateHeure("2026-10-25T20:00");
    assert.equal(date?.toISOString(), "2026-10-25T19:00:00.000Z");
  });

  it("fait l'aller-retour avec pourChampDateHeure", () => {
    for (const valeur of ["2027-03-28T18:00", "2027-01-01T00:00", "2026-09-30T23:59"]) {
      const date = depuisChampDateHeure(valeur);
      assert.ok(date);
      assert.equal(pourChampDateHeure(date), valeur);
    }
  });

  it("refuse une date qui n'existe pas ou une saisie malformee", () => {
    assert.equal(depuisChampDateHeure("2027-02-31T20:00"), null);
    assert.equal(depuisChampDateHeure("2027-03-28T02:30"), null);
    assert.equal(depuisChampDateHeure("04/10/2026 20:30"), null);
    assert.equal(depuisChampDateHeure(""), null);
  });
});
