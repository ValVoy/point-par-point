import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyserScoreFinal, analyserSets, type SetSaisi } from "./score";

function sets(...paires: [string, string][]): SetSaisi[] {
  return paires.map(([nous, eux]) => ({ nous, eux }));
}

describe("analyserSets", () => {
  it("compte les sets d'un match classique sans rien signaler", () => {
    const analyse = analyserSets(sets(["25", "21"], ["22", "25"], ["25", "19"], ["25", "23"]));
    assert.equal(analyse.setsNous, 3);
    assert.equal(analyse.setsEux, 1);
    assert.deepEqual(analyse.erreurs, []);
    assert.deepEqual(analyse.alertes, []);
  });

  it("accepte un tie-break a 15 et une prolongation a deux points", () => {
    const analyse = analyserSets(
      sets(["25", "23"], ["18", "25"], ["27", "25"], ["21", "25"], ["13", "15"]),
    );
    assert.equal(analyse.setsNous, 2);
    assert.equal(analyse.setsEux, 3);
    assert.deepEqual(analyse.alertes, []);
  });

  it("ignore les sets vides en fin de saisie", () => {
    const analyse = analyserSets(sets(["25", "10"], ["25", "11"], ["25", "12"], ["", ""], ["", ""]));
    assert.equal(analyse.sets.length, 3);
    assert.deepEqual(analyse.erreurs, []);
  });

  it("refuse un set a egalite", () => {
    const analyse = analyserSets(sets(["25", "25"]));
    assert.equal(analyse.erreurs.length, 1);
    assert.match(analyse.erreurs[0]!, /égalité/);
  });

  it("refuse un set a moitie saisi", () => {
    const analyse = analyserSets(sets(["25", ""]));
    assert.match(analyse.erreurs[0]!, /il manque/);
  });

  it("refuse un trou dans la suite des sets", () => {
    const analyse = analyserSets(sets(["25", "20"], ["", ""], ["25", "18"]));
    assert.match(analyse.erreurs[0]!, /Set 2 vide alors que le set 3/);
  });

  it("refuse ce qui n'est pas un entier", () => {
    const analyse = analyserSets(sets(["25", "2a"]));
    assert.match(analyse.erreurs[0]!, /entiers/);
  });

  it("signale sans refuser un set inhabituel", () => {
    const analyse = analyserSets(sets(["24", "22"], ["25", "24"], ["30", "25"]));
    assert.deepEqual(analyse.erreurs, []);
    assert.equal(analyse.alertes.length, 3);
    assert.match(analyse.alertes.join(" "), /n'a pas atteint 25/);
    assert.match(analyse.alertes.join(" "), /deux points d'écart/);
    assert.match(analyse.alertes.join(" "), /toujours de deux/);
  });

  it("signale un match sans vainqueur", () => {
    const analyse = analyserSets(sets(["25", "20"], ["20", "25"]));
    assert.match(analyse.alertes.join(" "), /incomplet/);
  });

  it("signale un set joue apres la fin du match", () => {
    const analyse = analyserSets(sets(["25", "10"], ["25", "11"], ["25", "12"], ["25", "13"]));
    assert.match(analyse.alertes.join(" "), /après la fin du match/);
  });

  it("ne lit jamais plus de cinq sets", () => {
    const six = sets(["25", "1"], ["1", "25"], ["25", "1"], ["1", "25"], ["15", "1"], ["25", "1"]);
    assert.equal(analyserSets(six).sets.length, 5);
  });
});

describe("analyserScoreFinal", () => {
  it("accepte un score final valide", () => {
    assert.deepEqual(analyserScoreFinal("3", "1"), { setsNous: 3, setsEux: 1 });
  });

  it("refuse l'egalite, les scores impossibles et les champs vides", () => {
    assert.ok("erreur" in analyserScoreFinal("2", "2"));
    assert.ok("erreur" in analyserScoreFinal("4", "1"));
    assert.ok("erreur" in analyserScoreFinal("3", ""));
  });
});
