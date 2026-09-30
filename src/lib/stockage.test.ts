import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cleValide, nouvelleCle } from "./stockage";

describe("cleValide", () => {
  it("accepte une cle tiree par le serveur", () => {
    assert.equal(cleValide(nouvelleCle("joueurs")), true);
    assert.equal(cleValide(nouvelleCle("partenaires")), true);
  });

  it("refuse tout ce qui pourrait sortir du dossier ou viser autre chose", () => {
    for (const cle of [
      "../.env.local",
      "joueurs/../../.env.local",
      "joueurs/photo.webp",
      "inconnu/0a1b2c3d-0000-4000-8000-000000000000.webp",
      "joueurs/0a1b2c3d-0000-4000-8000-000000000000.svg",
      "joueurs\0a1b2c3d-0000-4000-8000-000000000000.webp",
      "/joueurs/0a1b2c3d-0000-4000-8000-000000000000.webp",
      "joueurs/0a1b2c3d-0000-4000-8000-000000000000Xwebp",
    ]) {
      assert.equal(cleValide(cle), false, cle);
    }
  });
});
