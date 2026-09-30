import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TITRE_TRACES } from "../titre-traces";
import { INTRO_GRAND } from "./geometrie-intro";
import { decouper, echantillonnerTrajectoire, sourcesDuTitre } from "./sources-titre";

describe("sources des lettres du titre", () => {
  it("decoupe une ligne en morceaux jointifs de meme longueur", () => {
    const morceaux = decouper(
      [
        { x: 0, y: 0 },
        { x: 120, y: 0 },
      ],
      3,
      5,
    );
    assert.equal(morceaux.length, 3);
    assert.deepEqual(morceaux[0]![0], { x: 0, y: 0 });
    assert.deepEqual(morceaux[0]![4], { x: 40, y: 0 });
    // Le morceau suivant reprend exactement ou le precedent s'arrete.
    assert.deepEqual(morceaux[1]![0], morceaux[0]![4]);
    assert.deepEqual(morceaux[2]![4], { x: 120, y: 0 });
  });

  it("la trajectoire part de la passe et finit a l'impact", () => {
    const t = INTRO_GRAND.terrain;
    const points = echantillonnerTrajectoire(t);
    assert.deepEqual(points[0], t.depart);
    assert.deepEqual(points.at(-1), t.impact);
  });

  it("une trace par lettre, exprimee dans le repere du titre", () => {
    const titre = TITRE_TRACES.uneLigne;
    const placement = { echelle: 0.2, x: 100, y: 50 };
    const sources = sourcesDuTitre(INTRO_GRAND.terrain, placement, titre.lettres.length);
    assert.equal(sources.length, titre.lettres.length);
    // Premiere lettre : elle part du point de passe, ramene dans le repere du titre.
    const [x, y] = sources[0]!.slice(1).split(" ").map(Number);
    assert.equal(x, (INTRO_GRAND.terrain.depart.x - 100) / 0.2);
    assert.equal(y, (INTRO_GRAND.terrain.depart.y - 50) / 0.2);
    // Derniere lettre : elle finit au bout du sol.
    assert.ok(sources.at(-1)!.endsWith(`${((1600 - 100) / 0.2).toFixed(1)} ${((INTRO_GRAND.terrain.sol - 50) / 0.2).toFixed(1)}`));
  });
});
