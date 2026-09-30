import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { grouperParPoste } from "./postes";

describe("grouperParPoste", () => {
  it("presente l'equipe par poste, puis par numero, sans numero en dernier", () => {
    const groupes = grouperParPoste([
      { nom: "C1", poste: "central" as const, numero: 9 },
      { nom: "P1", poste: "passeur" as const, numero: 10 },
      { nom: "L1", poste: "libero" as const, numero: null },
      { nom: "C2", poste: "central" as const, numero: 5 },
      { nom: "P2", poste: "passeur" as const, numero: 1 },
      { nom: "L2", poste: "libero" as const, numero: 8 },
    ]);
    assert.deepEqual(
      groupes.map((g) => [g.poste, g.membres.map((m) => m.nom)]),
      [
        ["passeur", ["P2", "P1"]],
        ["central", ["C2", "C1"]],
        ["libero", ["L2", "L1"]],
      ],
    );
  });
});
