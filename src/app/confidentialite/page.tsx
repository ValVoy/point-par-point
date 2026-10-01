import type { Metadata } from "next";
import Link from "next/link";
import { PageJuridique } from "@/components/public/page-juridique";
import { EDITEUR, NOM_DU_SITE } from "@/lib/site";

/**
 * Politique de confidentialite (fiche fiches/juridique.md). Chaque duree
 * annoncee ici est tenue par le code, et c'est la regle : le texte suit le
 * code, jamais l'inverse.
 *  - messages de contact : un an (src/lib/messages.ts) ;
 *  - adresse reseau du formulaire : 24 h (src/lib/envois-contact.ts) ;
 *  - tentatives de connexion : 15 min (src/lib/auth/tentatives.ts) ;
 *  - session d'administration : 30 jours (src/lib/auth/sessions.ts) ;
 *  - sauvegardes : 30 jours, a regler avant la mise en ligne (ROADMAP) ;
 *  - mesure d'audience Umami, sans cookie, hors administration
 *    (src/lib/mesure-audience.ts).
 * Toute nouvelle collecte met cette page a jour, dans le meme commit.
 */
export const metadata: Metadata = {
  title: "Confidentialité",
  description: `Les données que ${NOM_DU_SITE} collecte, pourquoi, combien de temps, et vos droits.`,
};

export default function PageConfidentialite() {
  return (
    <PageJuridique surtitre={NOM_DU_SITE} titre="Confidentialité" misAJour="30 septembre 2026">
      <p>
        Ce site collecte peu de choses, et seulement ce dont il a besoin. Voici tout ce qu&apos;il garde, pourquoi,
        et pour combien de temps.
      </p>

      <h2>Qui est responsable</h2>
      <p>
        {EDITEUR}, éditeur du site (voir les <Link href="/mentions-legales">mentions légales</Link>), joignable par
        le <Link href="/contact">formulaire de contact</Link>.
      </p>

      <h2>Ce que le site garde</h2>

      <h3>Si vous nous écrivez</h3>
      <p>
        Votre nom, votre adresse e-mail, le sujet et votre message, pour vous répondre. Base légale : notre intérêt
        légitime à répondre à ceux qui nous écrivent. Seule l&apos;équipe du site les lit. Ils sont effacés un an
        après leur arrivée.
      </p>
      <p>
        L&apos;adresse réseau (IP) de l&apos;envoi est gardée à part, 24 heures, pour limiter les envois des robots.
        Elle n&apos;est jamais reliée à votre message.
      </p>

      <h3>Si vous êtes joueur, joueuse ou membre de l&apos;équipe</h3>
      <p>
        Selon ce que chacun accepte : prénom, nom, poste, numéro, âge (calculé depuis la date de naissance, qui
        n&apos;est pas affichée), taille, photo et parcours. Base légale : votre consentement, que vous pouvez
        retirer à tout moment. Ces informations restent en ligne tant que vous faites partie du projet, et sont
        retirées sur simple demande.
      </p>

      <h3>Si vous gérez le site</h3>
      <p>
        Les personnes qui ont accès à l&apos;administration ont un compte : nom, adresse e-mail, mot de passe
        (jamais stocké en clair), date de dernière connexion. Un cookie de session les garde connectées 30 jours au
        plus. Les tentatives de connexion, avec l&apos;adresse réseau, sont gardées 15 minutes pour bloquer les
        essais de mots de passe.
      </p>

      <h3>Quand vous visitez le site</h3>
      <p>
        Pour savoir combien de personnes le lisent, le site utilise Umami, un compteur de visites installé sur notre
        propre serveur. Il ne dépose aucun cookie et ne garde pas votre adresse réseau. Il retient la page vue, le
        site d&apos;où vous venez, le type d&apos;appareil, le navigateur, la langue et le pays. Une visite est
        reconnue par une empreinte calculée, qui ne permet pas de savoir qui vous êtes. Ces chiffres ne sont
        partagés avec personne. Si votre navigateur demande à ne pas être suivi (réglage « Do Not Track »), rien
        n&apos;est compté.
      </p>

      <h2>Cookies et traceurs</h2>
      <p>
        Un simple visiteur ne reçoit <strong>aucun cookie</strong> de ce site, et aucun outil de publicité ou de
        pistage n&apos;y est installé. Le seul cookie est celui de la session d&apos;administration, indispensable
        pour se connecter, qui ne demande donc pas de consentement.
      </p>
      <p>
        Votre navigateur retient, le temps de votre visite, que l&apos;animation d&apos;ouverture a déjà été jouée.
        Cette information ne quitte pas votre appareil.
      </p>
      <p>
        Les vidéos de la série ne se chargent que si vous cliquez dessus, depuis le domaine youtube-nocookie.com.
        Avant ce clic, YouTube ne reçoit rien. Après, c&apos;est la{" "}
        <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noopener noreferrer">
          politique de confidentialité de Google
        </a>{" "}
        qui s&apos;applique. De même, le bouton « Itinéraire » ouvre Google Maps, hors de ce site.
      </p>

      <h2>Où sont les données</h2>
      <p>
        Le serveur est en Allemagne (Hetzner), la base de données en Irlande (Turso), les photos chez Cloudflare.
        Turso et Cloudflare sont des sociétés américaines : même stockées en Europe, les données peuvent donc
        relever aussi du droit des États-Unis. La base est sauvegardée chaque nuit, chiffrée, et chaque sauvegarde est
        effacée au bout de 30 jours : une donnée effacée du site peut donc y subsister jusqu&apos;à 30 jours, sans
        être consultée. Une photo effacée peut aussi rester en cache chez Cloudflare jusqu&apos;à 24 heures, à une
        adresse que plus aucune page ne donne. Le détail des prestataires est dans les{" "}
        <Link href="/mentions-legales">mentions légales</Link>.
      </p>
      <p>Aucune donnée n&apos;est vendue, louée ni transmise à qui que ce soit d&apos;autre.</p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander à consulter, corriger ou effacer les données qui vous concernent, vous opposer à leur
        utilisation, en limiter l&apos;usage, ou les recevoir dans un format lisible. Il suffit d&apos;écrire par le{" "}
        <Link href="/contact?sujet=donnees">formulaire de contact</Link>, sujet « Mes données personnelles », en
        précisant votre demande. Réponse sous un mois au
        plus.
      </p>
      <p>
        Si la réponse ne vous satisfait pas, vous pouvez saisir la CNIL, sur{" "}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
          cnil.fr
        </a>
        .
      </p>
    </PageJuridique>
  );
}
