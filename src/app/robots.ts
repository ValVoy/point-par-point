import type { MetadataRoute } from "next";

/**
 * robots.txt (audit du 01-10-2026, T8) : tout le site public s'indexe,
 * l'administration et les routes techniques non. Ce n'est pas une protection,
 * seulement une consigne aux moteurs : chaque page d'administration garde sa
 * propre garde.
 */
export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/administration", "/planche", "/prototype", "/fichiers-locaux", "/sante", "/agenda", "/taches"] },
    ...(site ? { sitemap: new URL("/sitemap.xml", site).toString() } : {}),
  };
}
