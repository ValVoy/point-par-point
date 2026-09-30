import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { age, dateEtHeure, dateLongue, depuisChampDateHeure, heure, pourChampDateHeure } from "./dates";

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

describe("heure", () => {
  it("ecrit l'heure a la francaise, a l'heure de Paris", () => {
    // 18 h 30 UTC en octobre, c'est 20 h 30 a Paris (heure d'ete).
    assert.equal(heure(new Date("2026-10-03T18:30:00Z")), "20 h 30");
    // En hiver, une heure d'ecart seulement ; l'heure pile n'a pas de minutes.
    assert.equal(heure(new Date("2026-12-12T14:00:00Z")), "15 h");
  });
});

describe("dateEtHeure", () => {
  it("donne le jour puis l'heure a la francaise", () => {
    assert.equal(dateEtHeure(new Date("2026-10-03T18:30:00Z")), "samedi 3 octobre à 20 h 30");
  });
});

describe("le premier du mois", () => {
  it("s'ecrit 1er, pas 1", () => {
    assert.equal(dateLongue(new Date("2026-10-01T10:00:00Z")), "jeudi 1er octobre 2026");
    assert.equal(dateEtHeure(new Date("2026-11-01T19:30:00Z")), "dimanche 1er novembre à 20 h 30");
    assert.equal(dateLongue(new Date("2026-10-11T10:00:00Z")), "dimanche 11 octobre 2026");
  });
});

describe("age a l'heure de Paris (audit T7)", () => {
  it("prend un an le jour de l'anniversaire des minuit a Paris", () => {
    const ne = new Date("2000-10-01T12:00:00Z");
    // 00 h 30 le 1er octobre a Paris, encore le 30 septembre en UTC.
    assert.equal(age(ne, new Date("2026-09-30T22:30:00Z")), 26);
    assert.equal(age(ne, new Date("2026-09-30T21:30:00Z")), 25);
  });

  it("lit aussi les dates anciennes stockees a minuit UTC", () => {
    assert.equal(age(new Date("2000-10-01T00:00:00Z"), new Date("2026-09-30T22:30:00Z")), 26);
  });
});

