import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GRAND, PORTRAIT, margeAuFilet, type Geometrie } from "./ballon-geometrie";

describe("geometrie de la scene du ballon", () => {
  for (const [nom, g] of [["grand", GRAND], ["portrait", PORTRAIT]] as [string, Geometrie][]) {
    it(`${nom} : le ballon passe au-dessus du filet, d'un poteau a l'autre`, () => {
      // En SVG, y croit vers le bas : la marge compte du bas du ballon a la bande.
      assert.ok(margeAuFilet(g) > 4, `marge de ${margeAuFilet(g).toFixed(1)}`);
    });

    it(`${nom} : la passe part et la frappe a lieu de notre cote`, () => {
      assert.ok(g.depart.x < g.filet.x && g.frappe.x < g.filet.x);
      assert.ok(g.impact.x > g.filet.x);
    });

    it(`${nom} : le sommet est le point le plus haut et le ballon repose au sol a l'impact`, () => {
      assert.ok(g.sommet.y < g.frappe.y && g.sommet.y < g.depart.y);
      assert.equal(g.impact.y + g.rayon, g.sol);
    });
  }
});
