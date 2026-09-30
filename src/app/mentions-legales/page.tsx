import type { Metadata } from "next";
import Link from "next/link";
import { PageJuridique } from "@/components/public/page-juridique";
import { EDITEUR, NOM_DU_SITE } from "@/lib/site";

/**
 * Mentions legales (fiche fiches/juridique.md), au titre de l'article 6 de la
 * loi du 21 juin 2004 (LCEN). Editeur particulier, nom seul (choix du
 * 30-09-2026) ; les trois prestataires techniques nommes, raisons sociales
 * et adresses relevees sur leurs propres pages le 30-09-2026.
 */
export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Qui édite ${NOM_DU_SITE}, qui l'héberge, et à qui écrire.`,
};

export default function PageMentionsLegales() {
  return (
    <PageJuridique surtitre={NOM_DU_SITE} titre="Mentions légales" misAJour="30 septembre 2026">
      <h2>Éditeur</h2>
      <p>
        Le site {NOM_DU_SITE} est édité par <strong>{EDITEUR}</strong>, à titre personnel et non professionnel. Il
        est aussi directeur de la publication.
      </p>
      <p>
        Comme le permet l&apos;article 6, III, 2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
        l&apos;économie numérique, l&apos;éditeur, personne physique, ne publie pas ses coordonnées personnelles.
        Elles sont connues de la personne qui assure l&apos;hébergement du site et tenues à la disposition de
        l&apos;autorité judiciaire.
      </p>

      <h2>Nous écrire</h2>
      <p>
        Pour toute question, demande de retrait ou signalement d&apos;un contenu :{" "}
        <Link href="/contact">le formulaire de contact</Link>.
      </p>

      <h2>Hébergement</h2>
      <p>Le site repose sur trois prestataires techniques.</p>
      <ul>
        <li>
          <strong>Le serveur</strong> : Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Allemagne,
          téléphone +49 9831 505-0.
        </li>
        <li>
          <strong>La base de données</strong> : CHISELSTRIKE INC. (Turso), 2093 Philadelphia Pike #6336, Claymont,
          Delaware 19703, États-Unis. Les données sont stockées en Irlande.
        </li>
        <li>
          <strong>Les photos</strong> : Cloudflare, Inc. (service R2), 101 Townsend St, San Francisco, CA 94107,
          États-Unis.
        </li>
      </ul>

      <h2>Contenus et droit à l&apos;image</h2>
      <p>
        Les textes, photos et vidéos publiés sur ce site appartiennent à leurs auteurs. Les reproduire demande leur
        accord. Les épisodes de la série sont hébergés et diffusés par YouTube.
      </p>
      <p>
        Les joueurs et membres de l&apos;équipe qui apparaissent sur le site ont donné leur accord. Chacun peut
        demander à tout moment le retrait d&apos;une photo ou d&apos;une information le concernant, par le{" "}
        <Link href="/contact">formulaire de contact</Link>.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Ce que le site collecte, pourquoi, et combien de temps :{" "}
        <Link href="/confidentialite">la politique de confidentialité</Link>.
      </p>
    </PageJuridique>
  );
}
