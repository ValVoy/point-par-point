import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extraireIdYoutube } from "./youtube";

const ID = "dQw4w9WgXcQ";

describe("extraireIdYoutube", () => {
  it("lit toutes les formes d'adresse qu'on colle en pratique", () => {
    const formes = [
      ID,
      `https://youtu.be/${ID}`,
      `https://youtu.be/${ID}?si=AbCdEf123`,
      `youtu.be/${ID}`,
      `https://www.youtube.com/watch?v=${ID}`,
      `https://www.youtube.com/watch?v=${ID}&t=42s&list=PL123`,
      `https://m.youtube.com/watch?v=${ID}`,
      `https://www.youtube.com/shorts/${ID}`,
      `https://www.youtube.com/live/${ID}?feature=share`,
      `https://www.youtube.com/embed/${ID}`,
      `https://www.youtube-nocookie.com/embed/${ID}`,
      `  https://youtu.be/${ID}  `,
    ];
    for (const forme of formes) assert.equal(extraireIdYoutube(forme), ID, forme);
  });

  it("refuse les autres domaines, meme deguises", () => {
    assert.equal(extraireIdYoutube(`https://example.com/watch?v=${ID}`), null);
    assert.equal(extraireIdYoutube(`https://youtube.com.example.com/watch?v=${ID}`), null);
    assert.equal(extraireIdYoutube(`https://notyoutu.be/${ID}`), null);
  });

  it("refuse un identifiant mal forme ou une page sans video", () => {
    assert.equal(extraireIdYoutube("https://youtu.be/court"), null);
    assert.equal(extraireIdYoutube(`https://www.youtube.com/watch?v=${ID}"><script>`), null);
    assert.equal(extraireIdYoutube("https://www.youtube.com/@projetvolley"), null);
    assert.equal(extraireIdYoutube(""), null);
    assert.equal(extraireIdYoutube("pas une adresse"), null);
  });
});
