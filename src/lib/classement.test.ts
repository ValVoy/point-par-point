import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classementAJour, lireClassement, raisonDeRevoirLeClassement, rangEnToutesLettres } from "./classement";

function grille(lignes: string[][], nous: number, extra: Record<string, string> = {}) {
  const d = new FormData();
  d.set("nombre", String(lignes.length));
  d.set("nous", String(nous));
  lignes.forEach(([equipe, points, joues, gagnes, perdus], i) => {
    d.set(`equipe_${i}`, equipe ?? "");
    d.set(`points_${i}`, points ?? "");
    d.set(`joues_${i}`, joues ?? "");
    d.set(`gagnes_${i}`, gagnes ?? "");
    d.set(`perdus_${i}`, perdus ?? "");
  });
  for (const [cle, valeur] of Object.entries(extra)) d.set(cle, valeur);
  return d;
}

describe("lireClassement", () => {
  it("lit une grille, rang dans l'ordre, lignes vides ignorees", () => {
    const lu = lireClassement(grille([["Val-Fleury", "12", "4", "4", "0"], ["", "", "", "", ""], ["Nous", "9", "4", "3", "1"]], 2, { intitule: "Poule A" }));
    assert.equal(lu.ok, true);
    if (lu.ok) {
      assert.equal(lu.lignes.length, 2);
      assert.equal(lu.lignes[1]?.estNous, true);
      assert.equal(lu.intitule, "Poule A");
    }
  });

  it("accepte des chiffres manquants", () => {
    const lu = lireClassement(grille([["Nous", "", "", "", ""]], 0));
    assert.equal(lu.ok, true);
    if (lu.ok) assert.equal(lu.lignes[0]?.points, null);
  });

  it("exige une et une seule equipe marquee comme la notre", () => {
    assert.equal(lireClassement(grille([["A", "1"], ["B", "2"]], 5)).ok, false);
  });

  it("refuse un doublon, un chiffre non entier, une incoherence", () => {
    assert.equal(lireClassement(grille([["A"], ["a"]], 0)).ok, false);
    assert.equal(lireClassement(grille([["A", "1,5"]], 0)).ok, false);
    assert.equal(lireClassement(grille([["A", "3", "2", "2", "1"]], 0)).ok, false);
  });

  it("refuse une grille vide", () => {
    assert.equal(lireClassement(grille([["", ""]], 0)).ok, false);
  });
});

describe("classementAJour", () => {
  const maintenant = new Date("2026-10-01T12:00:00Z");
  it("montre jusqu'a 30 jours, pas au-dela", () => {
    assert.equal(classementAJour(new Date("2026-09-02T12:00:00Z"), maintenant), true);
    assert.equal(classementAJour(new Date("2026-08-31T11:00:00Z"), maintenant), false);
    assert.equal(classementAJour(null, maintenant), false);
  });
});

describe("rangEnToutesLettres", () => {
  it("ecrit 1er et 3e", () => {
    assert.equal(rangEnToutesLettres(1, 10), "1er sur 10");
    assert.equal(rangEnToutesLettres(3, 10), "3e sur 10");
  });
});

describe("raisonDeRevoirLeClassement", () => {
  const maintenant = new Date("2026-10-20T12:00:00Z");
  it("rappelle un classement absent seulement s'il y a eu un match", () => {
    assert.equal(raisonDeRevoirLeClassement(null, null, maintenant), null);
    assert.ok(raisonDeRevoirLeClassement(null, new Date("2026-10-03T18:00:00Z"), maintenant));
  });
  it("rappelle apres un match joue depuis la mise a jour, ou a trois semaines", () => {
    assert.ok(raisonDeRevoirLeClassement(new Date("2026-10-10T12:00:00Z"), new Date("2026-10-17T18:00:00Z"), maintenant));
    assert.equal(raisonDeRevoirLeClassement(new Date("2026-10-18T12:00:00Z"), new Date("2026-10-17T18:00:00Z"), maintenant), null);
    assert.ok(raisonDeRevoirLeClassement(new Date("2026-09-20T12:00:00Z"), null, maintenant));
  });
});

