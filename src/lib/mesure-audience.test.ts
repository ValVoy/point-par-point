import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { configurationUmami, pageComptee, SCRIPT_FILTRE } from "./mesure-audience";

describe("pageComptee", () => {
  it("compte le site public", () => {
    assert.equal(pageComptee("/"), true);
    assert.equal(pageComptee("/matchs/contre-x"), true);
    assert.equal(pageComptee("https://exemple.fr/effectif?saison=2"), true);
  });

  it("ne compte ni l'administration ni les pages de travail", () => {
    assert.equal(pageComptee("/administration"), false);
    assert.equal(pageComptee("/administration/messages"), false);
    assert.equal(pageComptee("https://exemple.fr/planche"), false);
    assert.equal(pageComptee("/prototype/ouverture"), false);
  });

  it("ne confond pas une page qui commence pareil", () => {
    assert.equal(pageComptee("/administrations-locales"), true);
  });
});

describe("configurationUmami", () => {
  afterEach(() => {
    delete process.env.UMAMI_URL;
    delete process.env.UMAMI_SITE_ID;
  });

  it("reste muette sans configuration complete", () => {
    assert.equal(configurationUmami(), null);
    process.env.UMAMI_URL = "https://stats.exemple.fr";
    assert.equal(configurationUmami(), null);
  });

  it("refuse une adresse en clair hors developpement", () => {
    process.env.UMAMI_URL = "http://stats.exemple.fr";
    process.env.UMAMI_SITE_ID = "abc";
    assert.equal(configurationUmami(), null);
  });

  it("donne l'adresse du script", () => {
    process.env.UMAMI_URL = "https://stats.exemple.fr/";
    process.env.UMAMI_SITE_ID = "abc";
    assert.deepEqual(configurationUmami(), { script: "https://stats.exemple.fr/script.js", site: "abc" });
  });
});

describe("SCRIPT_FILTRE, le filtre reellement envoye au navigateur", () => {
  it("donne les memes reponses que pageComptee", () => {
    const fenetre: { pppAvantEnvoi?: (t: string, p: { url: string }) => unknown } = {};
    new Function("window", "location", SCRIPT_FILTRE)(fenetre, { origin: "https://site.exemple" });
    for (const url of ["/", "/matchs", "/administration/messages", "/planche", "/prototype/x", "/administrations-locales"]) {
      assert.equal(fenetre.pppAvantEnvoi?.("event", { url }) !== false, pageComptee(url), url);
    }
  });
});

