import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { adresseSure, analyserEnligne, analyserTexteLeger, texteBrut } from "./texte-leger";

describe("analyserTexteLeger", () => {
  it("separe les paragraphes sur une ligne vide et garde les retours simples", () => {
    const blocs = analyserTexteLeger("Premier\nsuite\n\n\nSecond");
    assert.equal(blocs.length, 2);
    assert.deepEqual(blocs[0], {
      type: "paragraphe",
      contenu: [{ type: "texte", valeur: "Premier" }, { type: "saut" }, { type: "texte", valeur: "suite" }],
    });
  });

  it("reconnait un intertitre sur une ligne seule", () => {
    const [bloc] = analyserTexteLeger("## Le match");
    assert.deepEqual(bloc, { type: "intertitre", contenu: [{ type: "texte", valeur: "Le match" }] });
  });

  it("detache un intertitre colle au paragraphe suivant", () => {
    const blocs = analyserTexteLeger("## Le match\nBelle victoire.");
    assert.deepEqual(
      blocs.map((bloc) => bloc.type),
      ["intertitre", "paragraphe"],
    );
  });

  it("tolere les fins de ligne Windows", () => {
    assert.equal(analyserTexteLeger("Un\r\n\r\nDeux").length, 2);
  });
});

describe("analyserEnligne", () => {
  it("lit le gras, l'italique et leur imbrication", () => {
    assert.deepEqual(analyserEnligne("un **gros *vrai* point** final"), [
      { type: "texte", valeur: "un " },
      {
        type: "gras",
        contenu: [
          { type: "texte", valeur: "gros " },
          { type: "italique", contenu: [{ type: "texte", valeur: "vrai" }] },
          { type: "texte", valeur: " point" },
        ],
      },
      { type: "texte", valeur: " final" },
    ]);
  });

  it("lit un lien et son texte mis en forme", () => {
    assert.deepEqual(analyserEnligne("voir [le **club**](https://volley-francheville.com)"), [
      { type: "texte", valeur: "voir " },
      {
        type: "lien",
        href: "https://volley-francheville.com/",
        contenu: [{ type: "texte", valeur: "le **club**" }],
      },
    ]);
  });

  it("laisse en texte ce qui n'est pas une mise en forme complete", () => {
    assert.deepEqual(analyserEnligne("3 * 4 = 12 et ** seul"), [
      { type: "texte", valeur: "3 * 4 = 12 et ** seul" },
    ]);
  });

  it("n'active jamais un lien dangereux", () => {
    const resultat = analyserEnligne("[clic](javascript:alert(1))");
    assert.ok(resultat.every((e) => e.type !== "lien"));
  });

  it("garde le HTML comme du texte", () => {
    assert.deepEqual(analyserEnligne("<script>alert(1)</script>"), [
      { type: "texte", valeur: "<script>alert(1)</script>" },
    ]);
  });
});

describe("adresseSure", () => {
  it("accepte le web et la messagerie, refuse le reste", () => {
    assert.equal(adresseSure("https://youtu.be/x"), "https://youtu.be/x");
    assert.equal(adresseSure("mailto:contact@exemple.fr"), "mailto:contact@exemple.fr");
    assert.equal(adresseSure("javascript:alert(1)"), null);
    assert.equal(adresseSure("data:text/html,<b>x</b>"), null);
    assert.equal(adresseSure("volley-francheville.com"), null);
  });
});

describe("texteBrut", () => {
  it("retire le balisage pour un extrait", () => {
    assert.equal(
      texteBrut("## Titre\n\nUn **gros** [lien](https://a.fr)\nsuite"),
      "Titre Un gros lien suite",
    );
  });
});
