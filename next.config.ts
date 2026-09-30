import type { NextConfig } from "next";

/**
 * Politique de securite du contenu (audit S8, decision du 01-10-2026) : une
 * liste blanche de base, sans jeton. Seuls peuvent s'executer ou se charger
 * le site lui-meme, le lecteur YouTube sans cookie, les miniatures YouTube,
 * les photos R2 et le compteur Umami. Construite a la compilation : les
 * domaines R2 et Umami doivent donc etre connus a ce moment-la (variables de
 * build dans Coolify, voir le Dockerfile).
 *
 * `'unsafe-inline'` reste necessaire aux scripts en ligne de Next et de
 * l'intro ; la version a jeton viendra si le besoin s'en fait sentir.
 */
function politiqueDeContenu(): string {
  const origine = (adresse: string | undefined) => {
    try {
      return adresse ? new URL(adresse).origin : null;
    } catch {
      return null;
    }
  };
  const r2 = origine(process.env.R2_DOMAINE_PUBLIC);
  const umami = origine(process.env.UMAMI_URL);
  const dev = process.env.NODE_ENV !== "production";
  const regles: Record<string, (string | null | false)[]> = {
    "default-src": ["'self'"],
    // Le rechargement a chaud de Next a besoin d'eval en developpement, jamais en production.
    "script-src": ["'self'", "'unsafe-inline'", dev && "'unsafe-eval'", umami],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", "https://i.ytimg.com", r2],
    "font-src": ["'self'"],
    "connect-src": ["'self'", umami, dev && "ws:"],
    "frame-src": ["https://www.youtube-nocookie.com"],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "object-src": ["'none'"],
  };
  return Object.entries(regles)
    .map(([directive, sources]) => [directive, ...sources.filter(Boolean)].join(" "))
    .join("; ");
}

const nextConfig: NextConfig = {
  // Sortie autonome pour le conteneur Coolify : le serveur produit est
  // .next/standalone/server.js. Sans cette ligne, ce dossier n'existe pas et
  // l'image demarre sans serveur.
  output: "standalone",

  // Pas d'en-tete « X-Powered-By: Next.js » : inutile de dire a un attaquant
  // quelle version chercher (audit S8).
  poweredByHeader: false,

  // Next journalise par defaut les arguments et le resultat de chaque action
  // serveur. Or une action rend un mot de passe provisoire (comptes) et une
  // autre recoit les messages de contact : rien de cela n'a a finir en clair
  // dans un journal, y compris en developpement (.next/dev/logs).
  logging: { serverFunctions: false },

  // Une photo de telephone depasse vite le mega-octet par defaut des actions
  // serveur. 13 Mo : les 12 Mo acceptes par src/lib/images.ts, plus le reste
  // du formulaire.
  experimental: { serverActions: { bodySizeLimit: "13mb" } },

  // Contrairement a ope_cdm, la verification des types reste active pendant
  // le build. Le VPS Hetzner a 4 vCPU, un swap et 5 Go libres : rien a voir
  // avec l'instance Clever Cloud plafonnee a 644 Mo qui avait impose de la
  // desactiver la-bas. Depuis Next 16, `next build` ne lance plus le lint :
  // `npm run lint` se passe a part, avant chaque commit.

  // Le client Turso tourne cote Node : il ne doit pas etre bundle.
  serverExternalPackages: [
    "@libsql/client",
    "@libsql/core",
    "@libsql/hrana-client",
    "@libsql/isomorphic-ws",
  ],

  images: {
    remotePatterns: [
      // Les photos vivent dans le bucket R2. Le domaine exact est fourni par
      // R2_DOMAINE_PUBLIC ; tant qu'il est absent, aucune source distante
      // n'est autorisee, ce qui est le comportement voulu en developpement.
      ...(process.env.R2_DOMAINE_PUBLIC
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(process.env.R2_DOMAINE_PUBLIC).hostname,
            },
          ]
        : []),
      // Miniatures des episodes, servies par YouTube.
      { protocol: "https" as const, hostname: "i.ytimg.com" },
    ],
  },

  // En-tetes de securite appliques a toutes les routes, alignes sur les autres
  // applications du VPS. HSTS est ignore par les navigateurs en http (dev) et
  // actif en https (prod).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            // Sans « preload » (audit S18, decision du 01-10-2026) : l'inscription en
            // liste des navigateurs engagerait le futur domaine et tous ses
            // sous-domaines, qui n'est ni achete ni attribue. A redecider ensuite.
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: politiqueDeContenu() },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
