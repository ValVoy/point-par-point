import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { echapperTexte, evenementAgenda, lienGoogleAgenda, plierLigne } from "./agenda";

const BASE = {
  uid: "match-42@projet-volley",
  debut: new Date("2026-10-04T18:30:00Z"),
  titre: "VF Francheville - AS Montbrison",
  horodatage: new Date("2026-09-30T11:00:00Z"),
};

describe("echapperTexte", () => {
  it("echappe l'antislash, le point-virgule, la virgule et les retours a la ligne", () => {
    assert.equal(echapperTexte("a\\b;c,d\ne"), "a\\\\b\\;c\\,d\\ne");
  });
});

describe("plierLigne", () => {
  it("laisse une ligne courte intacte", () => {
    assert.equal(plierLigne("SUMMARY:court"), "SUMMARY:court");
  });

  it("plie au-dela de 75 octets, en comptant les accents sur deux octets", () => {
    const ligne = `DESCRIPTION:${"é".repeat(60)}`;
    const morceaux = plierLigne(ligne).split("\r\n");
    assert.ok(morceaux.length > 1);
    for (const morceau of morceaux) assert.ok(Buffer.byteLength(morceau, "utf8") <= 75);
    assert.equal(morceaux.map((m, i) => (i === 0 ? m : m.slice(1))).join(""), ligne);
  });
});

describe("evenementAgenda", () => {
  it("produit un calendrier valide, en CRLF, date en UTC, deux heures par defaut", () => {
    const ics = evenementAgenda(BASE);
    assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
    assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
    assert.ok(!/[^\r]\n/.test(ics), "toutes les fins de ligne sont en CRLF");
    assert.match(ics, /\r\nDTSTART:20261004T183000Z\r\n/);
    assert.match(ics, /\r\nDTEND:20261004T203000Z\r\n/);
    assert.match(ics, /\r\nDTSTAMP:20260930T110000Z\r\n/);
    assert.match(ics, /\r\nUID:match-42@projet-volley\r\n/);
  });

  it("echappe le lieu et omet les champs absents", () => {
    const ics = evenementAgenda({ ...BASE, lieu: "Gymnase du Bourg, 12 rue du Stade" });
    assert.match(ics, /\r\nLOCATION:Gymnase du Bourg\\, 12 rue du Stade\r\n/);
    assert.doesNotMatch(ics, /DESCRIPTION|URL:/);
  });
});

describe("lienGoogleAgenda", () => {
  it("encode le titre, le lieu et les dates en UTC", () => {
    const lien = new URL(lienGoogleAgenda({ ...BASE, lieu: "Gymnase du Bourg, Francheville" }));
    assert.equal(lien.hostname, "calendar.google.com");
    assert.equal(lien.searchParams.get("action"), "TEMPLATE");
    assert.equal(lien.searchParams.get("text"), BASE.titre);
    assert.equal(lien.searchParams.get("dates"), "20261004T183000Z/20261004T203000Z");
    assert.equal(lien.searchParams.get("location"), "Gymnase du Bourg, Francheville");
  });
});
