import type { Client, InArgs, InStatement, ResultSet, Transaction } from "@libsql/client";

/**
 * Cache des lectures en memoire (audit du 02-10-2026, lenteur en production).
 *
 * Mesure : depuis le VPS, chaque aller-retour vers Turso (Irlande) coute 100 a
 * 130 ms, et une page en enchaine une a quatre vagues. Le rendu lui-meme ne
 * coute que quelques millisecondes. Le site ne change que quand quelqu'un
 * ecrit dans l'administration : une lecture deja faite peut donc resservir
 * tant que rien n'a ete ecrit.
 *
 * La regle, posee au niveau du client et non page par page, pour qu'aucune
 * action future ne puisse l'oublier :
 * - un `select` identique (meme texte, memes arguments) rend la reponse
 *   gardee en memoire ;
 * - toute ecriture vide la memoire, une fois l'ecriture terminee : une
 *   lecture lancee pendant l'ecriture ne survit donc pas a son resultat ;
 * - les tables sensibles (comptes, sessions, tentatives de connexion,
 *   messages) ne sont jamais gardees, et une ecriture qui ne touche qu'elles
 *   ne vide rien : une connexion ou un message de contact ne fait pas perdre
 *   le cache du site public ;
 * - une entree reste fraiche cinq minutes, pour les ecritures faites hors de
 *   ce processus (script lance depuis le poste, conteneur voisin pendant un
 *   deploiement). Passe ce delai, elle est encore servie une fois pendant
 *   qu'une lecture neuve part en coulisse : sur un site peu visite, la
 *   connexion a Turso se ferme entre deux visites, et la rouvrir coute
 *   plusieurs allers-retours que le visiteur n'a pas a attendre ;
 * - au plus 300 entrees, les plus anciennes sortent d'abord : une requete
 *   dont les arguments changent a chaque visite ne fait pas gonfler la
 *   memoire.
 *
 * Le magasin vit sur `globalThis` : Next peut charger ce module plusieurs fois
 * (un exemplaire par paquet de route), et une ecriture faite depuis l'un doit
 * vider la memoire lue par tous.
 */

export const TABLES_SENSIBLES = [
  "utilisateurs",
  "sessions",
  "tentatives_auth",
  "messages_contact",
  "envois_contact",
] as const;

export const DUREE_DE_VIE_MS = 5 * 60_000;
export const ENTREES_MAX = 300;

/** Le texte et les arguments d'une instruction, sous ses deux formes d'appel. */
export function decomposer(stmt: InStatement | string, args?: InArgs): { sql: string; args: unknown } {
  if (typeof stmt === "string") return { sql: stmt, args: args ?? [] };
  return { sql: stmt.sql, args: stmt.args ?? [] };
}

/** Une lecture pure : `select`, ou `with ... select` sans ecriture. */
export function estLecture(sql: string): boolean {
  const debut = sql.trimStart().slice(0, 7).toLowerCase();
  if (debut.startsWith("select")) return true;
  if (debut.startsWith("with")) return !/\b(insert|update|delete|replace)\b/i.test(sql);
  return false;
}

function citeTable(sql: string, table: string): boolean {
  return sql.includes(`"${table}"`) || new RegExp(`\\b${table}\\b`).test(sql);
}

/** Une lecture qui touche une table sensible ne se garde jamais. */
export function toucheTableSensible(sql: string): boolean {
  return TABLES_SENSIBLES.some((table) => citeTable(sql, table));
}

/** La table visee par une ecriture simple, sinon null (ecriture inconnue). */
export function tableEcrite(sql: string): string | null {
  const trouve = /^\s*(?:insert\s+(?:or\s+\w+\s+)?into|replace\s+into|update(?:\s+or\s+\w+)?|delete\s+from)\s+"?(\w+)"?/i.exec(sql);
  return trouve?.[1] ?? null;
}

/** Une ecriture vide la memoire, sauf si elle ne vise qu'une table sensible. */
export function ecritureVideLeCache(sql: string): boolean {
  const table = tableEcrite(sql);
  return !(table && (TABLES_SENSIBLES as readonly string[]).includes(table));
}

/** La cle d'une lecture, ou null si ses arguments ne se serialisent pas. */
export function cleDeLecture(sql: string, args: unknown): string | null {
  try {
    return `${sql}\u0000${JSON.stringify(args)}`;
  } catch {
    return null;
  }
}

type Entree = { resultat: Promise<ResultSet>; fraicheJusqua: number; enRafraichissement: boolean };

export class MagasinDeLectures {
  private entrees = new Map<string, Entree>();
  /** Augmente a chaque vidage : un rafraichissement lance avant ne se range pas apres. */
  private generation = 0;

  constructor(
    private readonly horloge: () => number = Date.now,
    private readonly dureeMs = DUREE_DE_VIE_MS,
    private readonly maximum = ENTREES_MAX,
  ) {}

  get taille() {
    return this.entrees.size;
  }

  lire(cle: string, charger: () => Promise<ResultSet>): Promise<ResultSet> {
    const presente = this.entrees.get(cle);
    if (presente) {
      if (presente.fraicheJusqua <= this.horloge() && !presente.enRafraichissement) {
        this.rafraichir(cle, presente, charger);
      }
      return presente.resultat;
    }
    const resultat = charger();
    const entree = this.ranger(cle, resultat);
    // Un echec ne se garde pas : la visite suivante retente.
    resultat.catch(() => {
      if (this.entrees.get(cle) === entree) this.entrees.delete(cle);
    });
    return resultat;
  }

  vider() {
    this.generation++;
    this.entrees.clear();
  }

  private ranger(cle: string, resultat: Promise<ResultSet>): Entree {
    const entree = { resultat, fraicheJusqua: this.horloge() + this.dureeMs, enRafraichissement: false };
    this.entrees.delete(cle);
    this.entrees.set(cle, entree);
    while (this.entrees.size > this.maximum) {
      const plusAncienne = this.entrees.keys().next().value;
      if (plusAncienne === undefined) break;
      this.entrees.delete(plusAncienne);
    }
    return entree;
  }

  /**
   * Passe sa duree de fraicheur, une entree continue d'etre servie pendant
   * qu'une lecture neuve part en coulisse : un site peu visite ne fait jamais
   * attendre son visiteur. La reponse neuve ne se range que si rien n'a ete
   * ecrit entre-temps ; en cas d'echec, l'ancienne reste servie.
   */
  private rafraichir(cle: string, entree: Entree, charger: () => Promise<ResultSet>) {
    entree.enRafraichissement = true;
    const generation = this.generation;
    charger().then(
      (neuve) => {
        if (this.generation === generation && this.entrees.get(cle) === entree) {
          this.ranger(cle, Promise.resolve(neuve));
        }
      },
      () => {
        entree.enRafraichissement = false;
      },
    );
  }
}

const CLE_GLOBALE = Symbol.for("point-par-point.cache-lectures");

export function magasinPartage(): MagasinDeLectures {
  const global = globalThis as typeof globalThis & { [CLE_GLOBALE]?: MagasinDeLectures };
  global[CLE_GLOBALE] ??= new MagasinDeLectures();
  return global[CLE_GLOBALE];
}

/** Vide la memoire une fois la promesse tenue, et aussi si elle echoue (etat incertain). */
async function puisVider<T>(magasin: MagasinDeLectures, travail: Promise<T>): Promise<T> {
  try {
    return await travail;
  } finally {
    magasin.vider();
  }
}

/**
 * Le client Turso, enveloppe sur place : seuls `execute`, `batch`, `migrate`
 * et `transaction` sont remplaces, ce sont les quatre qu'appelle drizzle. Le
 * reste de l'instance (fermeture, etat, champs prives) reste intact.
 */
export function avecCacheDeLectures(client: Client, magasin = magasinPartage()): Client {
  const execute = client.execute.bind(client) as (stmt: InStatement | string, args?: InArgs) => Promise<ResultSet>;
  const batch = client.batch.bind(client);
  const migrate = client.migrate.bind(client);
  const transaction = client.transaction.bind(client);

  return Object.assign(client, {
    execute(stmt: InStatement | string, args?: InArgs) {
      const { sql, args: valeurs } = decomposer(stmt, args);
      if (estLecture(sql)) {
        const cle = toucheTableSensible(sql) ? null : cleDeLecture(sql, valeurs);
        return cle ? magasin.lire(cle, () => execute(stmt, args)) : execute(stmt, args);
      }
      const travail = execute(stmt, args);
      return ecritureVideLeCache(sql) ? puisVider(magasin, travail) : travail;
    },
    batch(...parametres: Parameters<Client["batch"]>) {
      const [instructions, mode] = parametres;
      if (mode === "read") return batch(...parametres);
      const videra = instructions.some((instruction) => {
        const { sql } = decomposer(Array.isArray(instruction) ? instruction[0] : instruction);
        return !estLecture(sql) && ecritureVideLeCache(sql);
      });
      const travail = batch(...parametres);
      return videra ? puisVider(magasin, travail) : travail;
    },
    migrate(...parametres: Parameters<Client["migrate"]>) {
      return puisVider(magasin, migrate(...parametres));
    },
    async transaction(...parametres: Parameters<Client["transaction"]>): Promise<Transaction> {
      const tx = await transaction(...parametres);
      // Les lectures d'une transaction passent par `tx`, jamais par le cache.
      // La memoire se vide au moment ou les ecritures deviennent visibles.
      const commit = tx.commit.bind(tx);
      tx.commit = () => puisVider(magasin, commit());
      return tx;
    },
  });
}
