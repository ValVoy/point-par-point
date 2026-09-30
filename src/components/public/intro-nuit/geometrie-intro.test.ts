import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { margeAuFilet } from "../ballon-geometrie";
import { TITRE_TRACES } from "../titre-traces";
import { INTRO_GRAND, INTRO_PORTRAIT, placementTitre, pointsDuPublic, type GeometrieIntro } from "./geometrie-intro";

const cadrages: [string, GeometrieIntro][] = [
  ["grand", INTRO_GRAND],
  ["portrait", INTRO_PORTRAIT],
];

describe("geometrie de l'intro", () => {
  for (const [nom, g] of cadrages) {
    const t = g.terrain;

    it(`${nom} : le ballon passe au-dessus du filet et repose au sol a l'impact`, () => {
      assert.ok(margeAuFilet(t) > 4, `marge de ${margeAuFilet(t).toFixed(1)}`);
      assert.equal(t.impact.y + t.rayon, t.sol);
    });

    it(`${nom} : la passe reste tendue et le rebond sort du cadre`, () => {
      assert.ok(t.sommet.y < t.frappe.y && t.sommet.y < t.depart.y);
      assert.ok(t.depart.y - t.sommet.y < t.hauteur / 3);
      assert.ok(t.sortie.x - t.rayon > t.largeur);
    });

    it(`${nom} : de haut en bas, tableau, tribunes, bandeau, puis le geste`, () => {
      const basTribunes = g.tribunes.haut + (g.tribunes.rangs - 1) * g.tribunes.ecart * 0.9;
      assert.ok(g.tableau.y + g.tableau.hauteur < g.tribunes.haut);
      assert.ok(basTribunes < g.bandeau.y);
      // Le sommet de la passe, ballon compris, reste sous le bandeau.
      assert.ok(g.bandeau.y + g.bandeau.hauteur < t.sommet.y - t.rayon);
    });

    it(`${nom} : le titre tient dans sa boite et dans la scene`, () => {
      const titre = TITRE_TRACES[g.miseEnPage];
      const p = placementTitre(g, titre);
      assert.ok(p.x >= 0 && p.x + titre.largeur * p.echelle <= t.largeur + 0.01);
      assert.ok(p.y >= g.bandeau.y + g.bandeau.hauteur);
      assert.ok(p.y + titre.hauteur * p.echelle <= t.sol);
    });

    it(`${nom} : le public a assez de monde pour ressembler a une tribune`, () => {
      assert.ok(pointsDuPublic(g).length > 60);
    });
  }
});
