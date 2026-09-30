import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compteRebours, derniersResultats, resultatDepuis, type RencontreScoree } from "./resultats";

const MINUTE = 60_000;
const JOUR = 24 * 60 * MINUTE;

function rencontre(partiel: Partial<RencontreScoree>): RencontreScoree {
  return {
    adversaire: "Adversaire",
    aDomicile: true,
    joueLe: new Date("2026-09-27T18:30:00Z"),
    etat: "jouee",
    setsNous: 3,
    setsEux: 1,
    sets: [],
    ...partiel,
  };
}

describe("compteRebours", () => {
  it("decoupe l'ecart en jours, heures et minutes entieres", () => {
    const maintenant = new Date("2026-10-01T10:00:00Z");
    const joueLe = new Date(maintenant.getTime() + 4 * JOUR + 7 * 60 * MINUTE + 12 * MINUTE + 30_000);
    assert.deepEqual(compteRebours(joueLe, maintenant), { jours: 4, heures: 7, minutes: 12 });
  });

  it("ne passe jamais sous zero quand l'heure est depassee", () => {
    const maintenant = new Date("2026-10-01T10:00:00Z");
    assert.deepEqual(compteRebours(new Date(maintenant.getTime() - MINUTE), maintenant), {
      jours: 0,
      heures: 0,
      minutes: 0,
    });
  });

  it("plafonne les jours a 99, la place de deux chiffres sur le tableau", () => {
    const maintenant = new Date("2026-10-01T10:00:00Z");
    assert.equal(compteRebours(new Date(maintenant.getTime() + 150 * JOUR), maintenant).jours, 99);
  });
});

describe("resultatDepuis", () => {
  it("ignore un match qui n'est pas joue", () => {
    assert.equal(resultatDepuis(rencontre({ etat: "a_venir" })), null);
  });

  it("ignore un match joue dont le score n'a pas ete saisi", () => {
    assert.equal(resultatDepuis(rencontre({ setsNous: null })), null);
  });

  it("garde un score sans detail des sets : la saisie est partielle par nature", () => {
    const resultat = resultatDepuis(rencontre({ sets: [] }));
    assert.ok(resultat);
    assert.equal(resultat.setsNous, 3);
    assert.deepEqual(resultat.sets, []);
  });

  it("ne garde que les sets dont les deux scores sont connus", () => {
    const resultat = resultatDepuis(
      rencontre({
        sets: [
          { pointsNous: 25, pointsEux: 21 },
          { pointsNous: null, pointsEux: 25 },
          { pointsNous: 25, pointsEux: 19 },
        ],
      }),
    );
    assert.deepEqual(resultat?.sets, [
      [25, 21],
      [25, 19],
    ]);
  });
});

describe("derniersResultats", () => {
  it("renvoie les matchs scores du plus recent au plus ancien, sans les autres", () => {
    const liste = [
      rencontre({ adversaire: "A", joueLe: new Date("2026-09-06T18:00:00Z") }),
      rencontre({ adversaire: "B", joueLe: new Date("2026-09-20T18:00:00Z") }),
      rencontre({ adversaire: "C", joueLe: new Date("2026-09-27T18:00:00Z"), setsNous: null }),
      rencontre({ adversaire: "D", joueLe: new Date("2026-10-04T18:00:00Z"), etat: "a_venir" }),
      rencontre({ adversaire: "E", joueLe: new Date("2026-09-13T18:00:00Z") }),
    ];
    assert.deepEqual(
      derniersResultats(liste).map((r) => r.adversaire),
      ["B", "E", "A"],
    );
  });
});
