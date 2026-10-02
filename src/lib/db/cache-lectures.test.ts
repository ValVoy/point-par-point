import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Client, ResultSet, Transaction } from "@libsql/client";
import {
  avecCacheDeLectures,
  cleDeLecture,
  ecritureVideLeCache,
  estLecture,
  MagasinDeLectures,
  tableEcrite,
  toucheTableSensible,
} from "./cache-lectures";

function reponse(valeur: number): ResultSet {
  return {
    rows: [],
    columns: [String(valeur)],
    columnTypes: [],
    rowsAffected: 0,
    lastInsertRowid: undefined,
    toJSON: () => ({}),
  };
}

/** Un faux client qui compte ses appels ; chaque reponse porte son numero d'appel. */
function fauxClient(attendreAvant?: (sql: string) => Promise<void>) {
  const appels: string[] = [];
  let compteur = 0;
  let commits = 0;
  const client = {
    execute: async (stmt: string | { sql: string }) => {
      const sql = typeof stmt === "string" ? stmt : stmt.sql;
      appels.push(sql);
      if (attendreAvant) await attendreAvant(sql);
      return reponse(++compteur);
    },
    batch: async (liste: unknown[]) => liste.map(() => reponse(++compteur)),
    migrate: async () => [],
    transaction: async () =>
      ({
        execute: async () => reponse(++compteur),
        commit: async () => {
          commits++;
        },
      }) as unknown as Transaction,
  } as unknown as Client;
  return { client, appels, commits: () => commits };
}

const numero = (rs: ResultSet) => rs.columns[0];

describe("estLecture", () => {
  it("reconnait select et with sans ecriture", () => {
    assert.equal(estLecture('select "id" from "joueurs"'), true);
    assert.equal(estLecture("  SELECT 1"), true);
    assert.equal(estLecture("with t as (select 1) select * from t"), true);
  });

  it("refuse les ecritures, y compris derriere un with", () => {
    assert.equal(estLecture('insert into "joueurs" values (1)'), false);
    assert.equal(estLecture('update "joueurs" set "nom" = ?'), false);
    assert.equal(estLecture("with t as (select 1) delete from joueurs"), false);
    assert.equal(estLecture("pragma foreign_keys"), false);
  });
});

describe("tables sensibles", () => {
  it("ne garde aucune lecture des comptes, sessions, tentatives et messages", () => {
    assert.equal(toucheTableSensible('select * from "sessions" where "jeton" = ?'), true);
    assert.equal(toucheTableSensible('select * from "joueurs" inner join "utilisateurs" on 1'), true);
    assert.equal(toucheTableSensible('select * from "rencontres"'), false);
  });

  it("une ecriture qui ne vise qu'une table sensible ne vide rien", () => {
    assert.equal(tableEcrite('insert into "tentatives_auth" ("ip") values (?)'), "tentatives_auth");
    assert.equal(tableEcrite('update "rencontres" set "etat" = ?'), "rencontres");
    assert.equal(tableEcrite('delete from "sessions" where 1'), "sessions");
    assert.equal(ecritureVideLeCache('insert into "messages_contact" values (?)'), false);
    assert.equal(ecritureVideLeCache('update "joueurs" set "nom" = ?'), true);
    assert.equal(ecritureVideLeCache("create table t (id)"), true);
  });
});

describe("cleDeLecture", () => {
  it("distingue les arguments, et renonce a ce qui ne se serialise pas", () => {
    assert.notEqual(cleDeLecture("select ?", [1]), cleDeLecture("select ?", [2]));
    assert.equal(cleDeLecture("select ?", [BigInt(1)]), null);
  });
});

describe("MagasinDeLectures", () => {
  it("passe sa fraicheur, sert l'ancienne reponse et rafraichit en coulisse", async () => {
    let maintenant = 0;
    const magasin = new MagasinDeLectures(() => maintenant, 1000, 10);
    let n = 0;
    const charger = async () => reponse(++n);
    await magasin.lire("a", charger);
    await magasin.lire("a", charger);
    assert.equal(n, 1);
    maintenant = 1001;
    const servie = await magasin.lire("a", charger);
    assert.equal(numero(servie), "1");
    // Une seule lecture neuve, meme si plusieurs visites arrivent pendant ce temps.
    await magasin.lire("a", charger);
    assert.equal(n, 2);
    await new Promise((fin) => setImmediate(fin));
    assert.equal(numero(await magasin.lire("a", charger)), "2");
  });

  it("un rafraichissement lance avant une ecriture ne se range pas", async () => {
    let maintenant = 0;
    const magasin = new MagasinDeLectures(() => maintenant, 1000, 10);
    let liberer: () => void = () => {};
    let n = 0;
    await magasin.lire("a", async () => reponse(++n));
    maintenant = 1001;
    magasin.lire("a", async () => {
      await new Promise<void>((fin) => {
        liberer = fin;
      });
      return reponse(++n);
    });
    magasin.vider();
    liberer();
    await new Promise((fin) => setImmediate(fin));
    assert.equal(magasin.taille, 0);
  });

  it("un rafraichissement qui echoue laisse servir l'ancienne reponse", async () => {
    let maintenant = 0;
    const magasin = new MagasinDeLectures(() => maintenant, 1000, 10);
    await magasin.lire("a", async () => reponse(1));
    maintenant = 1001;
    await magasin.lire("a", async () => Promise.reject(new Error("coupure")));
    await new Promise((fin) => setImmediate(fin));
    assert.equal(numero(await magasin.lire("a", async () => reponse(3))), "1");
    await new Promise((fin) => setImmediate(fin));
    assert.equal(numero(await magasin.lire("a", async () => reponse(4))), "3");
  });

  it("borne le nombre d'entrees, les plus anciennes sortent", async () => {
    const magasin = new MagasinDeLectures(() => 0, 1000, 3);
    for (const cle of ["a", "b", "c", "d"]) await magasin.lire(cle, async () => reponse(0));
    assert.equal(magasin.taille, 3);
    let relu = false;
    await magasin.lire("a", async () => {
      relu = true;
      return reponse(0);
    });
    assert.equal(relu, true);
  });

  it("ne garde pas un echec", async () => {
    const magasin = new MagasinDeLectures(() => 0);
    await assert.rejects(magasin.lire("a", async () => Promise.reject(new Error("coupure"))));
    await new Promise((fin) => setImmediate(fin));
    assert.equal(magasin.taille, 0);
  });
});

describe("avecCacheDeLectures", () => {
  it("une lecture identique ne repart pas vers la base, une autre si", async () => {
    const { client, appels } = fauxClient();
    const c = avecCacheDeLectures(client, new MagasinDeLectures());
    const a = await c.execute({ sql: 'select * from "joueurs" where id = ?', args: [1] });
    const b = await c.execute({ sql: 'select * from "joueurs" where id = ?', args: [1] });
    await c.execute({ sql: 'select * from "joueurs" where id = ?', args: [2] });
    assert.equal(numero(a), numero(b));
    assert.equal(appels.length, 2);
  });

  it("une ecriture vide la memoire, la lecture suivante est fraiche", async () => {
    const { client, appels } = fauxClient();
    const c = avecCacheDeLectures(client, new MagasinDeLectures());
    await c.execute('select * from "joueurs"');
    await c.execute({ sql: 'update "joueurs" set "nom" = ?', args: ["x"] });
    await c.execute('select * from "joueurs"');
    assert.equal(appels.filter((sql) => sql.startsWith("select")).length, 2);
  });

  it("la sonde de sante interroge toujours la base", async () => {
    const { client, appels } = fauxClient();
    const c = avecCacheDeLectures(client, new MagasinDeLectures());
    await c.execute("select 1");
    await c.execute("select 1");
    assert.equal(appels.length, 2);
  });

  it("une connexion ou un message de contact ne vide pas le cache public", async () => {
    const { client, appels } = fauxClient();
    const c = avecCacheDeLectures(client, new MagasinDeLectures());
    await c.execute('select * from "joueurs"');
    await c.execute({ sql: 'insert into "sessions" ("jeton") values (?)', args: ["j"] });
    await c.execute({ sql: 'select * from "sessions" where "jeton" = ?', args: ["j"] });
    await c.execute({ sql: 'select * from "sessions" where "jeton" = ?', args: ["j"] });
    await c.execute('select * from "joueurs"');
    assert.equal(appels.filter((sql) => sql.includes('"joueurs"')).length, 1);
    assert.equal(appels.filter((sql) => sql.includes('from "sessions"')).length, 2);
  });

  it("un lot d'ecritures et une transaction validee vident la memoire", async () => {
    const { client, appels, commits } = fauxClient();
    const magasin = new MagasinDeLectures();
    const c = avecCacheDeLectures(client, magasin);
    await c.execute('select * from "rencontres"');
    await c.batch([{ sql: 'delete from "sets_rencontre" where 1' }]);
    assert.equal(magasin.taille, 0);
    await c.execute('select * from "rencontres"');
    assert.equal(magasin.taille, 1);
    const tx = await c.transaction("write");
    await tx.commit();
    assert.equal(commits(), 1);
    assert.equal(magasin.taille, 0);
    assert.equal(appels.length, 2);
  });

  it("une lecture lancee pendant une ecriture ne survit pas a celle-ci", async () => {
    let liberer: () => void = () => {};
    const verrou = new Promise<void>((fin) => {
      liberer = fin;
    });
    const { client } = fauxClient((sql) => (sql.startsWith("update") ? verrou : Promise.resolve()));
    const c = avecCacheDeLectures(client, new MagasinDeLectures());
    const ecriture = c.execute('update "joueurs" set "nom" = 1');
    const pendant = await c.execute('select * from "joueurs"');
    liberer();
    await ecriture;
    const apres = await c.execute('select * from "joueurs"');
    assert.notEqual(numero(apres), numero(pendant));
  });
});
