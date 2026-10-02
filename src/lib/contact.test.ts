import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHAMP_PIEGE, lireMessage, sujetInitial } from "./contact";

function donnees(valeurs: Record<string, string>) {
  const d = new FormData();
  for (const [cle, valeur] of Object.entries(valeurs)) d.set(cle, valeur);
  return d;
}

const VALIDE = { nom: "Camille", email: "camille@exemple.fr", sujet: "question", message: "Bonjour, à quelle heure ouvre la salle ?" };

describe("lireMessage", () => {
  it("accepte un message complet et nettoie les espaces", () => {
    const lu = lireMessage(donnees({ ...VALIDE, nom: "  Camille  " }));
    assert.equal(lu.ok, true);
    if (lu.ok) assert.equal(lu.message.nom, "Camille");
  });

  it("refuse une adresse e-mail invalide", () => {
    const lu = lireMessage(donnees({ ...VALIDE, email: "pas-une-adresse" }));
    assert.equal(lu.ok, false);
    if (!lu.ok) assert.equal(lu.champ, "email");
  });

  it("refuse un message trop court ou trop long", () => {
    assert.equal(lireMessage(donnees({ ...VALIDE, message: "Salut" })).ok, false);
    assert.equal(lireMessage(donnees({ ...VALIDE, message: " ".repeat(12) })).ok, false);
    assert.equal(lireMessage(donnees({ ...VALIDE, message: "a".repeat(3001) })).ok, false);
  });

  it("ramene un sujet inconnu a « autre », sans refuser le message", () => {
    const lu = lireMessage(donnees({ ...VALIDE, sujet: "<script>" }));
    assert.equal(lu.ok, true);
    if (lu.ok) assert.equal(lu.message.sujet, "autre");
  });

  it("signale un robot quand le champ piege est rempli", () => {
    const lu = lireMessage(donnees({ ...VALIDE, [CHAMP_PIEGE]: "http://spam.example" }));
    assert.equal(lu.ok, false);
    if (!lu.ok) assert.equal(lu.robot, true);
  });
});

describe("sujetInitial", () => {
  it("ne retient qu'un sujet connu de l'adresse", () => {
    assert.equal(sujetInitial("partenariat"), "partenariat");
    assert.equal(sujetInitial("n'importe quoi"), "question");
    assert.equal(sujetInitial(undefined), "question");
    // Les cles heritees de l'objet ne sont pas des sujets (audit du 02-10-2026, S20).
    assert.equal(sujetInitial("constructor"), "question");
    assert.equal(sujetInitial("__proto__"), "question");
    assert.equal(sujetInitial("toString"), "question");
  });
});
