import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { titreSansNumero } from "./titre-episode";

describe("titreSansNumero", () => {
  it("retire un numero deja present en tete", () => {
    assert.equal(titreSansNumero({ numero: 3, titre: "Épisode 3 : titre de démonstration" }), "titre de démonstration");
    assert.equal(titreSansNumero({ numero: 3, titre: "EP.03 - La reprise" }), "La reprise");
    assert.equal(titreSansNumero({ numero: 12, titre: "episode 12 | Le derby" }), "Le derby");
  });

  it("ne touche ni un autre numero, ni un titre sans prefixe, ni un titre qui ne serait plus rien", () => {
    assert.equal(titreSansNumero({ numero: 3, titre: "Épisode 4 : ailleurs" }), "Épisode 4 : ailleurs");
    assert.equal(titreSansNumero({ numero: 3, titre: "La reprise" }), "La reprise");
    assert.equal(titreSansNumero({ numero: null, titre: "Épisode 3 : bonus" }), "Épisode 3 : bonus");
    assert.equal(titreSansNumero({ numero: 3, titre: "Épisode 3 :" }), "Épisode 3 :");
  });
});
