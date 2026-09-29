import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Motif } from "@/components/motif";
import { BallonFilet } from "@/components/public/ballon-filet";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";

/*
 * Prototype de la scene signature, cadree le 29-09-2026. Outil de travail,
 * pas une page du site : il n'existe qu'en developpement et n'est jamais
 * indexe. La scene rejoindra la vraie page d'accueil, sous son ouverture.
 */

export const metadata: Metadata = {
  title: "Prototype : le ballon",
  robots: { index: false, follow: false },
};

export default function PrototypeBallon() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="min-h-dvh bg-[var(--color-nuit)] text-[var(--color-craie)] [color-scheme:dark]">
      <header className="relative flex min-h-[80svh] flex-col justify-end overflow-hidden pb-16">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(ellipse_80%_70%_at_70%_30%,#000,transparent_75%)]">
          <Motif contour fond="transparent" gauche="var(--color-turquoise)" />
        </div>
        <div className="colonne-large relative">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">
            Prototype · scène du ballon
          </p>
          <h1 className="titre-affiche mt-4 text-[clamp(4rem,13vw,11rem)]">Projet Volley</h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
            Faites défiler : la passe monte, l&apos;attaquant frappe, le ballon
            passe le filet et allume le tableau du prochain match. Remontez, il
            revient en arrière.
          </p>
        </div>
      </header>

      <BallonFilet>
        <TableauProchainMatch
          match={{
            adversaire: "Adversaire",
            domicile: true,
            dateLisible: "Samedi 4 octobre, 20 h 30",
            salle: "Gymnase du Bourg, Francheville",
            compteRebours: { jours: 4, heures: 7, minutes: 12 },
          }}
        />
      </BallonFilet>

      <section className="colonne-large py-32">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">
          Suite de la page
        </p>
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
          Ici viendront le dernier résultat, les actualités et les partenaires.
          Cette section n&apos;existe que pour pouvoir défiler au-delà de la
          scène et vérifier qu&apos;elle relâche bien la page.
        </p>
      </section>
    </div>
  );
}
