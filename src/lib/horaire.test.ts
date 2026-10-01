import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { heureDuMatch, instantDuMatch, joursAvant, quandDuMatch } from "./horaire";

describe("instantDuMatch", () => {
  it("garde l'heure saisie, heure de Paris", () => {
    const { joueLe, heureConnue } = instantDuMatch("2026-10-03", "20:00")!;
    assert.equal(heureConnue, true);
    assert.equal(joueLe.toISOString(), "2026-10-03T18:00:00.000Z");
  });

  it("sans heure, range le match a 23 h 59 ce jour-la", () => {
    const { joueLe, heureConnue } = instantDuMatch("2026-10-17", "  ")!;
    assert.equal(heureConnue, false);
    assert.equal(joueLe.toISOString(), "2026-10-17T21:59:00.000Z");
  });

  it("rend null pour une date qui n'existe pas", () => {
    assert.equal(instantDuMatch("2026-02-30", ""), null);
  });
});

describe("joursAvant", () => {
  it("compte les jours du calendrier, pas les tranches de 24 heures", () => {
    const maintenant = new Date("2026-10-01T21:30:00Z"); // 23 h 30 a Paris, le 1er
    assert.equal(joursAvant(new Date("2026-10-02T06:00:00Z"), maintenant), 1);
    assert.equal(joursAvant(new Date("2026-10-17T21:59:00Z"), maintenant), 16);
  });

  it("vaut zero le jour meme, et jamais moins", () => {
    const maintenant = new Date("2026-10-17T08:00:00Z");
    assert.equal(joursAvant(new Date("2026-10-17T21:59:00Z"), maintenant), 0);
    assert.equal(joursAvant(new Date("2026-10-10T21:59:00Z"), maintenant), 0);
  });
});

describe("heureDuMatch et quandDuMatch", () => {
  const connu = { joueLe: new Date("2026-10-03T18:00:00Z"), heureConnue: true };
  const inconnu = { joueLe: new Date("2026-10-17T21:59:00Z"), heureConnue: false };

  it("disent l'heure quand elle est connue", () => {
    assert.equal(heureDuMatch(connu), "20 h");
    assert.equal(quandDuMatch(connu), "samedi 3 octobre à 20 h");
  });

  it("disent « horaire à confirmer » sinon, sans jamais montrer 23 h 59", () => {
    assert.equal(heureDuMatch(inconnu), null);
    assert.equal(quandDuMatch(inconnu), "samedi 17 octobre, horaire à confirmer");
  });
});
