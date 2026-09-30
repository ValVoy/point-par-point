import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { genererMotDePasse, refusChangement } from "./comptes";
import { motDePasseAcceptable } from "./auth/mots-de-passe";

describe("genererMotDePasse", () => {
  it("donne quatre groupes de quatre, sans caractere ambigu, acceptable", () => {
    const mdp = genererMotDePasse();
    assert.match(mdp, /^[a-zA-Z2-9]{4}(-[a-zA-Z2-9]{4}){3}$/);
    assert.doesNotMatch(mdp, /[01lIoO]/);
    assert.equal(motDePasseAcceptable(mdp), true);
  });

  it("ne se repete pas", () => {
    const tirages = new Set(Array.from({ length: 200 }, genererMotDePasse));
    assert.equal(tirages.size, 200);
  });
});

describe("refusChangement", () => {
  const admin = { id: 1, role: "admin" as const, actif: true };
  const redacteur = { id: 2, role: "redacteur" as const, actif: true };

  it("interdit de toucher a son propre role ou de se desactiver", () => {
    assert.ok(refusChangement(1, admin, { role: "redacteur" }, 3));
    assert.ok(refusChangement(1, admin, { actif: false }, 3));
    assert.equal(refusChangement(1, admin, { role: "admin" }, 1), null);
  });

  it("garde toujours un administrateur actif", () => {
    const autreAdmin = { id: 3, role: "admin" as const, actif: true };
    assert.ok(refusChangement(1, autreAdmin, { actif: false }, 1));
    assert.ok(refusChangement(1, autreAdmin, { role: "redacteur" }, 1));
    assert.equal(refusChangement(1, autreAdmin, { actif: false }, 2), null);
  });

  it("laisse gerer librement les redacteurs", () => {
    assert.equal(refusChangement(1, redacteur, { actif: false }, 1), null);
    assert.equal(refusChangement(1, redacteur, { role: "admin" }, 1), null);
  });

  it("reactiver un admin desactive n'est jamais bloque", () => {
    assert.equal(refusChangement(1, { id: 4, role: "admin", actif: false }, { actif: true }, 1), null);
  });
});
