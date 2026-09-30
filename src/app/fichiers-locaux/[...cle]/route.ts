import { lireLocal } from "@/lib/stockage";

/**
 * Sert les photos envoyees en developpement sans R2 (fiche fiches/photos.md).
 * En production, ou des que R2 est configure, `lireLocal` rend null : la route
 * repond 404 et ne lit jamais le disque. La cle est validee avant toute
 * lecture, ce qui ferme la porte a un chemin qui remonterait les dossiers.
 */
export async function GET(_requete: Request, { params }: { params: Promise<{ cle: string[] }> }) {
  const { cle } = await params;
  const octets = await lireLocal(cle.join("/"));
  if (!octets) return new Response("Introuvable", { status: 404 });
  return new Response(new Uint8Array(octets), {
    headers: { "content-type": "image/webp", "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
}
