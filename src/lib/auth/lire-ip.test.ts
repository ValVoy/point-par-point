import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { lireIp } from "./tentatives";

describe("lireIp", () => {
  it("retient l'adresse ajoutee par le proxy, pas celle envoyee par le client", () => {
    assert.equal(lireIp(new Headers({ "x-forwarded-for": "1.2.3.4, 203.0.113.9" })), "203.0.113.9");
  });

  it("se replie sur x-real-ip, puis sur rien", () => {
    assert.equal(lireIp(new Headers({ "x-real-ip": "203.0.113.9" })), "203.0.113.9");
    assert.equal(lireIp(new Headers()), null);
  });
});
