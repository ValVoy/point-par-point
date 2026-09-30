# Plan , Point Par Point

> Issu du cadrage du 19-09-2026, 40 questions en neuf salves. Ce document dit **ce qu'on construit
> et pourquoi**. La `ROADMAP.md` dit où on en est, le `codex.md` garde les concepts, le
> `carnetdebord.md` garde le récit.
>
> **Aucune ligne de code n'est écrite tant que ce plan n'est pas validé.**

## 1. Ce qu'est ce site

Un ami a monté un concept autour d'une équipe de volley amateur, qu'il fait vivre sur Instagram et
par une série YouTube. Le site est **un projet média d'abord, adossé à une vraie équipe** : il
raconte autant qu'il informe, et il doit survivre à une mauvaise saison sportive.

L'équipe joue en **championnat FFVB départemental ou régional**, à confirmer. Ce niveau a une
conséquence directe : les résultats officiels existent mais ne sont pas exploitables
automatiquement, donc tout se saisit à la main.

Deux choses qu'un visiteur convaincu doit pouvoir faire, et elles commandent la page d'accueil :

1. **S'abonner à la série.** C'est l'audience qui existe déjà et qu'il faut prolonger.
2. **Venir voir un match.** Ce qui suppose une date, une salle, une adresse et un bouton pour
   mettre le match dans son agenda.

Le **sponsoring** est une piste tiède : on la rend possible sans la construire. Une table
`partenaire`, un bandeau de logos, et le formulaire de contact fait office de porte d'entrée.

## 2. Les sept principes de conception

Ce sont les invariants. Ils ne se rouvrent pas sans raison neuve, et ils tranchent d'avance la
plupart des arbitrages à venir.

1. **Le volley est un sport d'équipe, le site ne classe jamais les joueurs entre eux.** Aucun
   palmarès individuel, aucun meilleur marqueur, aucun tri décroissant sur une statistique de
   joueur. Les chiffres collectifs sont mis en avant ; les chiffres d'un joueur n'existent que sur
   sa propre page, seuls, sans comparaison.
2. **Le match est la source unique.** On saisit une feuille de match, et les fiches joueurs, les
   totaux de saison et le bilan collectif se recalculent. Rien n'est jamais saisi deux fois, donc
   rien ne peut se contredire.
3. **La saisie est partielle par nature.** Un match peut n'avoir qu'un score, ou un score plus
   quelques joueurs, ou une feuille complète. Le site affiche proprement dans les trois cas et ne
   montre jamais de case vide. La semaine où personne n'a le temps, le site ne s'effondre pas.
4. **Le site vieillit dignement.** Une section sans contenu à jour disparaît au lieu d'afficher une
   donnée périmée. Pas de prochain match annoncé, pas de bloc prochain match. Un classement non
   tenu s'efface plutôt que de mentir.
5. **L'administration saisit des champs, jamais de la mise en page.** Pas de HTML libre, pas de
   blocs à disposer, pas de création de pages. La structure du site est fixe, seul le contenu bouge.
   C'est ce qui empêche un CMS complet de naître par accident, et le site de devenir laid en trois
   mois.
6. **Rien ne disparaît par accident, rien ne se publie par accident.** Toute suppression part en
   corbeille et se récupère. Tout contenu passe par un état brouillon avant d'être visible.
7. **Aucun inconnu n'écrit directement sur le site.** Tout contenu venant de l'extérieur est mis en
   attente et validé à la main avant d'apparaître.

## 3. Architecture technique

| Élément | Choix | Raison |
|---|---|---|
| Cadre | Next.js 15, App Router, TypeScript strict | Même stack que le reste des projets, rendu serveur pour le référencement |
| Style | Tailwind | Cohérence avec les autres projets |
| Animation | À trancher avant les pages publiques | Le motion design est un objectif du projet, pas une finition : voir `codex.md` |
| Base | **Turso** (libSQL), accès par Drizzle | Même fournisseur que le CRM et les pronostics, procédure de sauvegarde déjà connue, le VPS reste sans base à administrer |
| Images | **Bucket R2**, redimension à l'envoi | Déjà en service sur le CRM, gratuit à cette échelle, et le disque du VPS reste tranquille |
| Authentification | **Identifiant et mot de passe**, maison, session en base, cookie `httpOnly` | Demandé explicitement ; hachage **bcrypt** (voir ci-dessous), pas de dépendance d'authentification tierce |
| Audience | Compteur sans cookie (Plausible ou Umami) | Pas de bannière de consentement, et c'est le chiffre qu'un sponsor demandera |
| Envoi d'e-mail | **Aucun** | Ni lettre d'information, ni notification : les messages de contact se lisent dans l'administration |
| Hébergement | VPS Hetzner, Coolify, `Dockerfile` | Conforme à `APP/Coolify/ETAT.md`, budget mémoire estimé 300 à 500 Mo |
| Dépôt | GitHub **privé**, déploiement Coolify depuis `main` | Le dossier n'a aucun distant aujourd'hui, c'est le risque à lever en premier |

**Pas de CLI Turso sur cette machine**, vérifié le 20-09-2026 : la version `1.0.32` ne publie
que des binaires Darwin et Linux, et la documentation officielle exige WSL, abandonné mi-2026. Les
bases et les jetons se créent au tableau de bord `turso.tech` ; tout le reste passe par
`@libsql/client`, déjà installé (`npm run db:migrate`, `db:demo`, `db:sql`).

Pas de dépendance à une API tierce au premier lot : ni Instagram, ni fédération, ni YouTube Data.
Les épisodes se saisissent par leur adresse publique.

**Écart assumé par rapport au cadrage** : le plan annonçait argon2id, l'implémentation utilise
bcrypt. Les portages argon2 pour Node demandent une compilation native ou des binaires par
plateforme, ce qui alourdit l'image Docker et casse au moindre changement d'architecture. bcrypt en
JavaScript pur n'a aucune de ces contraintes, tourne déjà en production sur `ope_cdm`, et reste
adapté : le pire dégât possible derrière ce mot de passe est un faux résultat de match publié.

**Second écart, dans l'autre sens** : contrairement à `ope_cdm`, le lint et la vérification des
types restent **actifs pendant le build**. Ils avaient été désactivés là-bas parce que l'instance
Clever Cloud était plafonnée à 644 Mo ; le VPS Hetzner n'a pas cette contrainte.

## 4. Modèle de données

Tout contenu daté est **rattaché à une saison**, décidé au cadrage. La colonne coûte une ligne
aujourd'hui et évite une migration pénible en septembre prochain.

**Contenu sportif**

- `saison` : libellé, dates de début et de fin, indicateur de saison courante.
- `joueur` : prénom, nom, identifiant d'adresse, date de naissance, taille, photo, présentation
  courte, parcours, actif.
- `effectif` : rattache un joueur à une saison avec **son numéro et son poste de cette saison-là**
  (les deux changent d'une année sur l'autre, ils n'appartiennent donc pas au joueur).
- `rencontre` : saison, date et heure, adversaire, domicile ou extérieur, salle (nom, adresse,
  coordonnées), compétition, état (à venir, jouée, annulée), sets gagnés de part et d'autre,
  commentaire libre d'après-match.
- `set_rencontre` : numéro du set, points de chaque côté.
- `feuille_rencontre` : une ligne par joueur et par match. Présence, puis **tous les champs de
  statistique nullables** (points, attaques réussies et tentées, aces, fautes au service, blocs,
  réceptions réussies et tentées, fautes). Les colonnes existent dès le premier lot, l'écran de
  saisie détaillée arrive au lot 2.
- `ligne_classement` : rang, équipe, points, joués, gagnés, perdus, plus une **date de mise à
  jour** qui commande l'affichage ou l'effacement de la section.

**Contenu éditorial**

- `episode` : numéro, titre, identifiant YouTube, résumé, date de publication, **rencontre liée**
  éventuelle, identifiant d'adresse.
- `actualite` : titre, identifiant d'adresse, chapô, corps, image, date, état de publication.
- `etape_projet` : la chronologie du concept, saisie à la main (date, titre, texte, image).
- `membre_staff` : nom, rôle, photo, texte.
- `partenaire` : nom, logo, lien, ordre d'affichage, actif.

**Exploitation et comptes**

- `utilisateur` : adresse, mot de passe haché, nom, **rôle `admin` ou `redacteur`**, actif.
- `session` : jeton, utilisateur, expiration.
- `message_contact` : nom, adresse, sujet, message, lu ou non.
- `soutien` (lot 2) : auteur, message, état en attente, validé ou rejeté.

**Deux colonnes transversales sur toutes les tables de contenu**

- `supprime_le` : la corbeille du principe 6. Rien n'est effacé physiquement.
- `demo` : marque un enregistrement de démonstration. **L'administration affiche un bandeau tant
  qu'il en reste un seul**, et une commande unique les purge tous. Un oubli au jour de la mise en
  ligne devient impossible.

## 5. Les pages publiques

| Page | Contenu | Lot |
|---|---|---|
| Accueil | **Dernier épisode et prochain match** en tête, puis dernier résultat, dernières actualités, bandeau partenaires | 1 |
| Effectif | Grille de l'équipe de la saison courante, par poste | 1 |
| Page d'un joueur | Adresse propre, identité sportive, présentation, parcours, ses matchs. Ses chiffres quand ils existeront, sans comparaison | 1 |
| Matchs | Calendrier de la saison, à venir et joués, filtrables par saison | 1 |
| Page d'un match | Score, détail set par set, commentaire, salle et carte, **bouton d'ajout à l'agenda**, épisode lié | 1 |
| Série | Liste des épisodes | 1 |
| Page d'un épisode | Lecteur YouTube intégré, résumé, lien vers le match concerné | 1 |
| Actualités | Fil, plus une page par actualité | 1 |
| Le projet | Récit du concept et **chronologie** | 1 |
| L'équipe derrière | Staff, coach, série | 1 |
| Où nous voir | Salle, adresse, accès, carte, prochains matchs à domicile | 1 |
| Partenaires | Logos et invitation à prendre contact | 1 |
| Contact | Formulaire, message stocké en base | 1 |
| Mentions légales et confidentialité | Éditeur, hébergeur, traitement des données | 1 |
| Classement | Tableau de la poule, **avec sa date de mise à jour, masqué s'il n'est pas tenu** | 1 |
| Bilan de saison | Victoires, défaites, sets, série en cours, calculé depuis les scores | 1 |
| Statistiques collectives | Efficacité d'attaque de l'équipe et le reste, depuis les feuilles de match | 2 |
| Confrontations | Historique face à un adversaire donné | 2 |
| Mur de soutiens | Messages validés | 2 |
| Kit presse | Logos, photos, chiffres à télécharger | 2 |

## 6. L'administration

Deux rôles figés dans le code, pas d'écran de permissions.

- **Admin** : tout, y compris les comptes, les saisons, la corbeille et la purge des données de
  démonstration.
- **Rédacteur** : crée et modifie actualités, matchs, épisodes et feuilles de match. Ne supprime
  rien définitivement, ne touche ni aux comptes ni aux saisons.

Ce que l'administration permet : gérer les saisons et l'effectif, saisir le calendrier complet de
la saison d'un coup, entrer un score et le détail des sets, coller une adresse YouTube et écrire un
résumé, rédiger une actualité, compléter la chronologie, gérer staff et partenaires, tenir le
classement, lire les messages de contact, gérer les comptes.

Ce qu'elle ne permet pas, volontairement : **créer une page**, **mettre en page librement**,
**supprimer définitivement**, **publier sans passer par un brouillon**.

**La connexion est limitée en débit**, ajout du 20-09-2026 non prévu au cadrage. Deux compteurs en
fenêtre glissante de quinze minutes : cinq échecs par adresse visée, cinquante par adresse réseau.
Le contrôle passe **avant** le hachage du mot de passe, sinon un attaquant déclencherait à volonté
un calcul volontairement coûteux. Le seuil par réseau est large à dessein : l'ami et ses
coéquipiers peuvent partager une connexion, et verrouiller tout le monde serait pire que le mal.

**La saisie se fait à deux mains**, décidé au cadrage : le score part du gymnase depuis un
téléphone, écran court et gros boutons ; les statistiques détaillées se complètent plus tard depuis
un ordinateur, dans une grille pensée pour le clavier. Ce sont deux écrans distincts, et le second
arrive au lot 2.

## 7. Le premier lot, précisément

**Dedans** : tout le site public marqué 1 dans le tableau ci-dessus, l'administration complète avec
les deux rôles, les brouillons, la corbeille, le marquage des données de démonstration, le compteur
d'audience, les mentions légales, le déploiement sur le VPS.

**Dehors, et assumé** : l'écran de saisie des statistiques détaillées, les statistiques collectives
publiées, le mur de soutiens, le kit presse, l'historique des confrontations, le score en direct, la
galerie photos, toute intégration Instagram ou fédération, la boutique.

Le schéma de base prévoit déjà les statistiques et le mur : le lot 2 ajoutera des écrans, pas des
migrations douloureuses.

**Aucune échéance imposée.** C'est un cadeau, pas une commande : on met en ligne quand c'est bien.
Si une date de début de saison apparaît, on accélère.

## 8. Les lots suivants

- **Lot 2** : saisie tabulaire des feuilles de match, statistiques collectives publiées, chiffres
  sur les fiches joueurs, bilan chiffré, mur de soutiens modéré, kit presse, confrontations.
- **Lot 3** : score en direct depuis le gymnase, récupération automatique du classement fédéral,
  galerie photos, intégration Instagram si l'API le permet un jour.

## 9. Avant la mise en ligne

1. **Sonde Todai** sur le domaine, comme tout service de cette machine.
2. **Sauvegarde nocturne** de la base Turso.
3. **Revue de sécurité manuelle en passe adversariale.** Déclenchée par deux choses : le formulaire
   de contact et, au lot 2, le mur de soutiens, qui sont les seuls endroits où une entrée non
   contrôlée entre dans le système. À faire aussi une fois en passe complète avant la mise en ligne.
4. **Purge des données de démonstration**, vérifiée par la disparition du bandeau.
5. **Mentions légales renseignées** avec le nom de l'éditeur.
6. Vérification des en-têtes de sécurité, comme sur les autres applications du VPS.

## 10. Ce qui reste à vérifier auprès de l'ami

Rien de tout cela ne bloque le démarrage du développement.

- **Le vrai nom du concept.** Le dossier et le dépôt seront renommés à ce moment-là.
- **L'identité graphique de la série** : logo, couleurs, typographie déjà utilisés sur YouTube et
  Instagram. La direction retenue est **claire et éditoriale**, avec un accent **bleu vers violet**
  inspiré des maillots, à confirmer sur une vraie photo.
- **Le championnat exact** et la poule, pour le classement.
- **L'accord de droit à l'image** : il est acquis pour le tournage, reste à confirmer qu'il couvre
  aussi la publication sur un site public. Ce n'est pas un obstacle, c'est une vérification.
- **La salle et ses horaires**, pour la page Où nous voir.
- **Qui saisira**, et donc s'il faut vraiment deux comptes dès le départ.

## 11. Ce qui est offert, et ce qui ne l'est pas

Point posé au cadrage pour qu'il ne reste pas flou entre amis.

- **La construction du site est un cadeau.**
- **L'hébergement est offert** sur le VPS.
- **Les pannes sont corrigées au fil de l'eau**, sans engagement de délai.
- **Aucune nouvelle fonctionnalité n'est promise** au-delà du lot 1.
- **Le nom de domaine est acheté par Valentin** et offert. L'éditeur déclaré du site reste l'ami,
  à titre de particulier : les deux rôles sont distincts et c'est normal. Le transfert du domaine à
  son nom est prévu et reste possible à tout moment, c'est une manipulation de dix minutes si elle
  est anticipée.
