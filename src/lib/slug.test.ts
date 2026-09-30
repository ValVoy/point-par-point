import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FORME_SLUG, premiereLibre, slugifier, slugOuSecours } from "./slug";

describe("slugifier", () => {
  it("retire accents, capitales et ponctuation", () => {
    assert.equal(slugifier("Victoire à l'Arraché : 3-2 !"), "victoire-a-l-arrache-3-2");
  });
});

describe("premiereLibre", () => {
  it("ajoute le premier suffixe libre", () => {
    assert.equal(premiereLibre("match", new Set()), "match");
    assert.equal(premiereLibre("match", new Set(["match", "match-2"])), "match-3");
  });
});

describe("slugifier face aux noms et titres reels (audit D1)", () => {
  it("translittere les lettres que la decomposition ne simplifie pas", () => {
    assert.equal(slugifier("Łukasz Żuk"), "lukasz-zuk");
    assert.equal(slugifier("Ørjan Æsir"), "orjan-aesir");
    assert.equal(slugifier("Straße"), "strasse");
  });

  it("borne la longueur, sur une limite de mot, et reste acceptee par les pages", () => {
    const long = slugifier("Une actualité au titre vraiment très long ".repeat(4));
    assert.ok(long.length <= 100);
    assert.ok(!long.endsWith("-"));
    assert.ok(FORME_SLUG.test(premiereLibre(long, new Set([long]))));
    assert.ok(FORME_SLUG.test(slugifier("a".repeat(300))));
  });

  it("se replie sur une adresse de secours quand il ne reste rien", () => {
    assert.equal(slugifier("李 王"), "");
    assert.equal(slugOuSecours("🏐 🔥", "joueur"), "joueur");
  });
});

