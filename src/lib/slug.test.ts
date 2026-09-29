import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { premiereLibre, slugifier } from "./slug";

describe("slugifier", () => {
  it("retire accents, capitales et ponctuation", () => {
    assert.equal(slugifier("Victoire à l'Arraché : 3-2 !"), "victoire-a-l-arrache-3-2");
  });
});

describe("premiereLibre", () => {
  it("ajoute le premier suffixe libre", () => {
    assert.equal(premiereLibre("match", new Set()), "match");
    assert.equal(premiereLibre("match", new Set(["match", "match-2"])), "match-3");
  });
});
