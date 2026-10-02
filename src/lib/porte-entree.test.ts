import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cartesEquipe, decouperMots, extraitEtape, manifeste, MANIFESTE_DEPART } from "./porte-entree";

describe("manifeste", () => {
  it("reprend le texte de depart quand rien n'est saisi", () => {
    assert.deepEqual(manifeste(null, null), MANIFESTE_DEPART);
  });

  it("garde chaque champ saisi, et complete l'autre par le depart", () => {
    assert.deepEqual(manifeste("Un titre", null), { titre: "Un titre", texte: MANIFESTE_DEPART.texte });
    assert.deepEqual(manifeste(null, "Un texte"), { titre: MANIFESTE_DEPART.titre, texte: "Un texte" });
  });
});

describe("decouperMots", () => {
  it("rend chaque mot, separe du precedent par une espace", () => {
    assert.deepEqual(decouperMots("Sur le terrain"), [
      { mot: "Sur", accent: false, espaceAvant: false },
      { mot: "le", accent: false, espaceAvant: true },
      { mot: "terrain", accent: false, espaceAvant: true },
    ]);
  });

  it("met en accent ce qui est entre doubles etoiles", () => {
    const mots = decouperMots("dans **la série** le reste");
    assert.deepEqual(mots.filter((m) => m.accent).map((m) => m.mot), ["la", "série"]);
    assert.deepEqual(mots.map((m) => m.mot), ["dans", "la", "série", "le", "reste"]);
  });

  it("colle la ponctuation qui suit un accent, sans espace", () => {
    const mots = decouperMots("la **série**, puis");
    assert.deepEqual(mots[2], { mot: ",", accent: false, espaceAvant: false });
    assert.deepEqual(mots[3], { mot: "puis", accent: false, espaceAvant: true });
  });

  it("laisse une etoile orpheline telle quelle", () => {
    assert.deepEqual(decouperMots("un **seul").map((m) => [m.mot, m.accent]), [
      ["un", false],
      ["**seul", false],
    ]);
  });

  it("rend une liste vide pour un texte vide", () => {
    assert.deepEqual(decouperMots("   "), []);
  });
});

const joueur = (id: number, numero: number | null, nom = `Nom${id}`) => ({ id, numero, nom });

describe("cartesEquipe", () => {
  it("trie par numero, les joueurs sans numero en dernier, puis par nom", () => {
    const { cartes } = cartesEquipe([joueur(1, null, "B"), joueur(2, 7), joueur(3, null, "A"), joueur(4, 2)], 12);
    assert.deepEqual(cartes.map((c) => c.id), [4, 2, 3, 1]);
  });

  it("montre tout le monde quand l'equipe tient dans la limite", () => {
    const equipe = Array.from({ length: 6 }, (_, i) => joueur(i, i + 1));
    assert.equal(cartesEquipe(equipe, 6).reste, 0);
    assert.equal(cartesEquipe(equipe, 6).cartes.length, 6);
  });

  it("au-dela, garde une place pour la carte des autres joueurs", () => {
    const equipe = Array.from({ length: 14 }, (_, i) => joueur(i, i + 1));
    const { cartes, reste } = cartesEquipe(equipe, 12);
    assert.equal(cartes.length, 11);
    assert.equal(reste, 3);
  });
});

describe("extraitEtape", () => {
  it("ne coupe jamais un emoji en deux (audit T12)", () => {
    const extrait = extraitEtape("🏐".repeat(30), 15) ?? "";
    assert.equal(extrait.isWellFormed(), true);
    assert.equal(Array.from(extrait).length, 16);
  });

  it("rend un texte court tel quel", () => {
    assert.equal(extraitEtape("Premier match.", 200), "Premier match.");
  });

  it("coupe a la derniere phrase entiere quand elle est assez longue", () => {
    const texte = "Une premiere phrase assez longue pour compter. Une seconde qui depasse la limite fixee.";
    assert.equal(extraitEtape(texte, 60), "Une premiere phrase assez longue pour compter.");
  });

  it("sinon coupe au dernier mot entier, avec des points de suspension", () => {
    assert.equal(extraitEtape("Un texte sans aucun point qui continue longtemps", 20), "Un texte sans aucun…");
  });

  it("rend null pour un texte vide", () => {
    assert.equal(extraitEtape("  ", 200), null);
    assert.equal(extraitEtape(null, 200), null);
  });
});
