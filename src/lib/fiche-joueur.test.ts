import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { lireFicheJoueur } from "./fiche-joueur";
import { positionPhoto } from "./position-photo";

const MAINTENANT = new Date("2026-10-01T12:00:00Z");
const donnees = (valeurs: Record<string, string>) => {
  const d = new FormData();
  for (const [cle, valeur] of Object.entries({ prenom: "Lucas", nom: "Martin", ...valeurs })) d.set(cle, valeur);
  return d;
};

describe("lireFicheJoueur", () => {
  it("accepte une fiche reduite au prenom et au nom", () => {
    const lu = lireFicheJoueur(donnees({}), MAINTENANT);
    assert.equal(lu.ok, true);
    if (lu.ok) {
      assert.equal(lu.fiche.neLe, null);
      assert.equal(lu.fiche.visage, null);
    }
  });

  it("lit une fiche complete", () => {
    const lu = lireFicheJoueur(
      donnees({ neLe: "2001-03-14", tailleCm: "192", presentation: " Réceptionneur. ", visageX: "48", visageY: "22" }),
      MAINTENANT,
    );
    assert.equal(lu.ok, true);
    if (lu.ok) {
      assert.equal(lu.fiche.neLe?.toISOString().slice(0, 10), "2001-03-14");
      assert.equal(lu.fiche.tailleCm, 192);
      assert.equal(lu.fiche.presentation, "Réceptionneur.");
      assert.deepEqual(lu.fiche.visage, { x: 48, y: 22 });
    }
  });

  it("refuse une date impossible ou peu plausible", () => {
    assert.equal(lireFicheJoueur(donnees({ neLe: "2001-02-30" }), MAINTENANT).ok, false);
    assert.equal(lireFicheJoueur(donnees({ neLe: "2030-01-01" }), MAINTENANT).ok, false);
    assert.equal(lireFicheJoueur(donnees({ neLe: "1901-01-01" }), MAINTENANT).ok, false);
  });

  it("refuse une taille hors bornes ou avec virgule", () => {
    assert.equal(lireFicheJoueur(donnees({ tailleCm: "85" }), MAINTENANT).ok, false);
    assert.equal(lireFicheJoueur(donnees({ tailleCm: "1,92" }), MAINTENANT).ok, false);
  });

  it("ignore un point de visage incomplet ou hors cadre", () => {
    const incomplet = lireFicheJoueur(donnees({ visageX: "40", visageY: "" }), MAINTENANT);
    const horsCadre = lireFicheJoueur(donnees({ visageX: "140", visageY: "20" }), MAINTENANT);
    assert.ok(incomplet.ok && incomplet.fiche.visage === null);
    assert.ok(horsCadre.ok && horsCadre.fiche.visage === null);
  });

  it("refuse un nom vide ou trop long", () => {
    assert.equal(lireFicheJoueur(donnees({ nom: "  " }), MAINTENANT).ok, false);
    assert.equal(lireFicheJoueur(donnees({ prenom: "a".repeat(61) }), MAINTENANT).ok, false);
  });
});

describe("positionPhoto", () => {
  it("cadre sur le visage, sinon en haut", () => {
    assert.equal(positionPhoto({ x: 48, y: 22 }), "48% 22%");
    assert.equal(positionPhoto({ x: null, y: null }), "50% 0%");
  });
});
