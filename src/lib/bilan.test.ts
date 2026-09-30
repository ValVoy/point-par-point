import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bilanDeLaSaison } from "./bilan";

const m = (jour: number, nous: number | null, eux: number | null, aDomicile = true, etat = "jouee") => ({
  etat,
  setsNous: nous,
  setsEux: eux,
  aDomicile,
  joueLe: new Date(`2026-10-${String(jour).padStart(2, "0")}T18:30:00Z`),
});

describe("bilanDeLaSaison", () => {
  it("rien avant le premier score saisi", () => {
    assert.equal(bilanDeLaSaison([]), null);
    assert.equal(bilanDeLaSaison([m(3, null, null), m(10, 0, 0, true, "a_venir")]), null);
  });

  it("compte victoires, sets, domicile et exterieur", () => {
    const b = bilanDeLaSaison([m(3, 3, 1, true), m(10, 2, 3, false), m(17, 3, 0, false), m(24, null, null)]);
    assert.ok(b);
    assert.equal(b.victoires, 2);
    assert.equal(b.defaites, 1);
    assert.equal(b.setsPour, 8);
    assert.equal(b.setsContre, 4);
    assert.deepEqual(b.domicile, { victoires: 1, defaites: 0 });
    assert.deepEqual(b.exterieur, { victoires: 1, defaites: 1 });
  });

  it("donne la serie en cours dans l'ordre des dates, a partir de deux", () => {
    // Donnes dans le desordre : la serie se lit par date, pas par ordre de saisie.
    const b = bilanDeLaSaison([m(24, 3, 2), m(3, 0, 3), m(17, 3, 1), m(10, 3, 0)]);
    assert.deepEqual(b?.serie, { victoire: true, longueur: 3 });
    assert.equal(bilanDeLaSaison([m(3, 3, 0), m(10, 1, 3)])?.serie, null);
    assert.deepEqual(bilanDeLaSaison([m(3, 3, 0), m(10, 1, 3), m(17, 0, 3)])?.serie, { victoire: false, longueur: 2 });
  });

  it("ignore un match annule ou reporte", () => {
    assert.equal(bilanDeLaSaison([m(3, 3, 0), m(10, 3, 0, true, "annulee")])?.victoires, 1);
  });
});

describe("bilan et egalite (audit D3)", () => {
  it("n'en fait pas une defaite", () => {
    assert.equal(bilanDeLaSaison([m(3, 1, 1)]), null);
  });
});

