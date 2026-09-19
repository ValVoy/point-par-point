import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie autonome pour le conteneur Coolify : le serveur produit est
  // .next/standalone/server.js. Sans cette ligne, ce dossier n'existe pas et
  // l'image demarre sans serveur.
  output: "standalone",

  // Contrairement a ope_cdm, le lint et la verification des types restent
  // actifs pendant le build. Le VPS Hetzner a 4 vCPU, un swap et 5 Go libres :
  // rien a voir avec l'instance Clever Cloud plafonnee a 644 Mo qui avait
  // impose de les desactiver la-bas. Le filet vaut mieux que les secondes
  // gagnees.

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
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
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
