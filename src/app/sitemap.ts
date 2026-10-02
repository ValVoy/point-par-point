import type { MetadataRoute } from "next";
import { actualitesPubliees } from "@/lib/actualites-publiques";
import { effectifDeLaSaison } from "@/lib/effectif-public";
import { calendrierDeLaSaison } from "@/lib/matchs-publics";
import { episodesPublies } from "@/lib/serie";

/**
 * Le plan du site (audit T8) : les pages fixes, puis ce qui est publie de la
 * saison courante. Rien de ce qui n'est pas public n'y entre : les lecteurs
 * utilises sont ceux des pages publiques, qui filtrent brouillons et corbeille.
 */
export const dynamic = "force-dynamic";

const FIXES = ["/", "/matchs", "/effectif", "/serie", "/actualites", "/le-projet", "/ou-nous-voir", "/partenaires", "/contact", "/mentions-legales", "/confidentialite"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) return [];
  const adresse = (chemin: string) => new URL(chemin, site).toString();
  const [calendrier, effectif, episodes, actualites] = await Promise.all([
    calendrierDeLaSaison(),
    effectifDeLaSaison(),
    episodesPublies(),
    actualitesPubliees(),
  ]);
  return [
    ...FIXES.map((chemin) => ({ url: adresse(chemin) })),
    ...calendrier.matchs.map((m) => ({ url: adresse(`/matchs/${m.slug}`), lastModified: m.modifieLe })),
    ...effectif.membres.map((m) => ({ url: adresse(`/effectif/${m.slug}`) })),
    ...episodes.map(({ episode }) => ({ url: adresse(`/serie/${episode.slug}`), lastModified: episode.modifieLe })),
    ...actualites.map((a) => ({ url: adresse(`/actualites/${a.slug}`), lastModified: a.publieLe ?? undefined })),
  ];
}
