# ROADMAP , Point Par Point

> Plan vivant. Consulter avant chaque tâche, mettre à jour à chaque jalon.

## État actuel

**Plan validé le 19-09-2026 au soir, fondations posées dans la nuit du 19 au 20-09-2026.**

Ce qui tourne et a été vérifié : Next.js 16.3.5 et React 19.3.0 en TypeScript strict, 18 tables Drizzle migrées sur
Turso, jeu de démonstration de 50 enregistrements et sa purge.

Ce qui marche à l'écran : connexion avec limitation des tentatives, déconnexion, navigation
réduite selon le rôle, bandeau de démonstration, gestion des saisons et de l'effectif.
**Aucune page publique réelle**, l'accueil est encore provisoire.

**Palette refaite le 30-09-2026, version 2** (fiche `fiches/palette.md`) : le gymnase le soir.
Noir violacé du maillot, turquoise et violet réels, jaune du ballon, et de la lumière seulement sur
les objets lumineux (tableau de score en LED ambre, bandeau LED, ballon). Appliquée au site, à
l'intro, à l'administration et à la planche. La version 1, papier imprimé, a été essayée et
écartée le même matin.

**Accueil en ligne en local le 30-09-2026** (fiche `fiches/accueil.md`) : l'intro, le dernier
épisode (lecteur chargé au clic seulement), le prochain match et le dernier résultat en tableaux
LED avec « Ajouter à l'agenda » et « Itinéraire », les matchs précédents en cartes défilantes.
Tout branché sur la base, chaque bloc disparaît s'il n'a rien à montrer.

**Calendrier et page d'un match le 30-09-2026** (fiche `fiches/matchs.md`) : `/matchs?saison=…`
avec le prochain match en tableau, la liste par mois et le filet « Aujourd'hui » ; `/matchs/<slug>`
dont l'ordre des blocs suit l'état du match (à venir, en cours, joué, score à venir, reporté,
annulé), avec l'épisode lié et les matchs voisins. En-tête publique commune.

**La série le 30-09-2026** (fiche `fiches/serie.md`) : `/serie`, épisode vedette et liste
numérotée avec le match de chaque épisode ; `/serie/<slug>`, lecteur au clic, match raconté en
tableau LED relié à sa page, abonnement, épisodes voisins. Lien réciproque match ↔ épisode.

**L'effectif le 30-09-2026** (fiche `fiches/effectif.md`) : `/effectif`, grille par poste aux
cartes égales, numéro géant en guise de portrait ; `/effectif/<slug>`, identité, âge et taille,
présentation, parcours, ses matchs de la saison, coéquipiers par numéro.

**Les actualités le 30-09-2026** (fiche `fiches/actualites.md`) : liste datée, article réglé pour
la lecture sur fond sombre, partage sans script tiers, bloc de l'accueil masqué au-delà de 90 jours.

**La vitrine le 30-09-2026** (fiche `fiches/vitrine.md`) : `/le-projet`, `/ou-nous-voir` (avec le
texte « Venir à la salle » saisi dans l'onglet « La salle » de l'administration), `/partenaires`.

**Le contact le 30-09-2026** (fiche `fiches/contact.md`) : `/contact` (sujet pré-choisi par
l'adresse, piège à robots, 3 envois par heure et par adresse réseau, 30 au total), écran
« Messages » de l'administration, effacement réel des messages après un an.

**Les pages juridiques le 30-09-2026** (fiche `fiches/juridique.md`) : `/mentions-legales` (Tom
Oger, éditeur particulier en nom seul ; Hetzner, Turso et Cloudflare nommés) et `/confidentialite`
(chaque durée annoncée tenue par le code), reliées depuis le pied de page.

**La mesure d'audience le 30-09-2026** : Umami, sans cookie, branché côté site (variables
d'exécution `UMAMI_URL` et `UMAMI_SITE_ID`, rien de chargé sans elles), administration et pages de
travail exclues, politique de confidentialité à jour. **Umami 3.0.3 installé le 30-09-2026** sur
`https://stats.valentincheron.fr` (projet Coolify `stats`, sonde Todai en place) ; ce qui reste
se fait au déploiement du site, voir « Avant la mise en ligne ».

**Les comptes le 30-09-2026** (fiche `fiches/comptes.md`) : écran « Comptes » (mot de passe
provisoire affiché une fois, rôles, désactivation) et « Mon compte » pour changer le sien.

**L'envoi des photos, la fiche joueur et le classement le 01-10-2026** (fiches `photos.md`,
`fiche-joueur.md`, `classement.md`).

**Le bilan de saison le 01-10-2026**, enrichi à la demande de l'utilisateur : le lot 1 est
construit.

Ensuite : la liste « Avant la mise en ligne », dont la passe de sécurité complète.
À vérifier avant la mise en ligne : l'accord de droit à l'image couvre le site ; mentions légales
et politique de confidentialité.
À régler avant la mise en ligne : la sauvegarde nocturne de cette base garde **30 jours** au plus, durée annoncée par la politique de confidentialité.
À préparer pour la mise en ligne : appliquer en production les migrations 0002 à 0009
(anciennes adresses, réglages), avec l'accord de l'utilisateur.
Reporté : abonnement d'agenda à toute la saison, carte statique, transition animée liste → match.
Le nom (« Point Par Point ») et la chaîne YouTube sont arrivés le 30-09-2026 et sont en place.

**À revoir avant d'écrire les pages publiques** : la largeur de la mise en page et le motion
design, demandés le 20-09-2026. Voir la section dédiée plus bas et `codex.md`.

## Lot 1 , le site en ligne

### Fondations

- [x] Créer le dépôt GitHub privé et pousser le squelette
- [x] Initialiser Next.js 15, TypeScript strict, Tailwind
- [x] Schéma Drizzle complet, 17 tables, colonnes du lot 2 comprises, migration vérifiée
- [x] Base Turso de développement migrée et semée (`projet-volley-local-valvoy`, `aws-eu-west-1`)
- [ ] Base Turso de production, le jour du déploiement
- [x] Authentification identifiant et mot de passe, sessions en base, deux rôles
- [x] Envoi d'images vers R2 avec redimension (01-10-2026, fiche `fiches/photos.md`) : staff, logos, étapes, actualités ; la photo de joueur arrive avec sa fiche
- [x] Jeu de données de démonstration marqué `demo`, comptage et commande de purge
- [x] Bandeau de démonstration dans l'administration

### Administration

- [x] Écran de connexion, limitation des tentatives, coquille et navigation par rôle
- [x] Saisons : création, modification, saison courante, corbeille
- [x] Effectif : ajout de joueur, numéro et poste par saison, capitaine, retrait
- [x] Fiche joueur détaillée : identité, taille, photo, présentation, parcours (01-10-2026, fiche `fiches/fiche-joueur.md`)
- [x] Matchs : liste par saison, scores à saisir en tête, ajout isolé, modification, état,
      commentaire, corbeille (29-09-2026)
- [x] Calendrier de la saison, saisie en masse, tout ou rien (29-09-2026)
- [x] Score et détail set par set, écran court pensé pour le téléphone, ou score final seul
      (29-09-2026)
- [x] Tableau de bord : scores à saisir, épisodes en brouillon, prochain match (29-09-2026)
- [x] Point de visage des photos de joueurs (deux colonnes sur `joueurs`, migration 0007) (01-10-2026)
- [x] Épisodes : adresse YouTube, résumé, lien vers un match, brouillon puis publication (29-09-2026)
- [x] Actualités, avec brouillon obligatoire et mise en forme légère maison (29-09-2026)
- [x] Chronologie du projet, staff, partenaires, ordre à la main, réservés à l'admin (29-09-2026). Photos et logos avec l'envoi vers R2
- [x] Classement de la poule, avec sa date de mise à jour (01-10-2026, fiche `fiches/classement.md`)
- [x] Messages de contact (30-09-2026)
- [x] Comptes utilisateurs et « Mon compte » (30-09-2026) ; corbeille : chaque écran a la sienne

### Site public

- [x] Accueil : dernier épisode et prochain match
- [x] Accueil en porte d'entrée (01-10-2026, fiche `fiches/accueil-porte-entree.md`) : manifeste
      « Qui on est » modifiable dans l'administration, aperçu de l'équipe, extrait du projet, repli
      de la série sans épisode ; trois gestes (mots qui s'allument, numéros qui roulent, fil qui se
      trace)
- [x] Effectif, et une page par joueur
- [x] Matchs : calendrier, page d'un match, bouton d'ajout à l'agenda
- [x] Série : liste et page par épisode
- [x] Actualités
- [x] Le projet et sa chronologie, l'équipe derrière
- [x] Où nous voir jouer : salle, adresse, itinéraire (sans carte intégrée)
- [x] Partenaires, contact
- [x] Bilan de saison calculé depuis les scores : victoires et défaites, sets, domicile et extérieur, série en cours (01-10-2026)
- [x] Mentions légales et politique de confidentialité (30-09-2026)
- [x] Compteur d'audience sans cookie : Umami (30-09-2026)
- [ ] Favicon et identité visuelle (attend le vrai nom et les couleurs du maillot)

### Direction artistique , à revoir (demandé le 20-09-2026)

Le détail et les raisons sont dans `codex.md`, section Direction artistique. Ces deux chantiers
concernent le **site public**, pas l'administration.

- [ ] **Élargir la mise en page** : réduire la marge latérale sans la supprimer, définir une
      échelle de largeurs nommée (colonne de lecture, colonne large, pleine largeur) et
      l'appliquer partout plutôt que de décider page par page
- [ ] **Bandeaux pleine largeur** : images, bandes de résultats, lecteurs vidéo et sections
      colorées vont d'un bord à l'autre, seul le texte reste dans la colonne
- [ ] **Motion design, chantier à part entière** : le mouvement doit raconter le volley.
      Repère donné par l'utilisateur, un ballon qui passe au-dessus d'un filet au défilement
- [ ] Choisir la bibliothèque d'animation (Framer Motion est déjà en service sur `ope_cdm`) ou
      s'en tenir au CSS, **avant** d'écrire les pages publiques : plaquer l'animation après coup
      coûte toujours plus cher
- [ ] Vérifier `prefers-reduced-motion` sur chaque animation ajoutée

### Refonte visuelle complète (décidée le 29-09-2026)

Méthode décrite dans `CLAUDE.md`, section « Méthode de travail ». Le visuel existant repart de
zéro, la logique reste.

- [x] Veille : sites de sport haut de gamme, sites primés pour leur motion, outils d'animation,
      synthèse commentée dans `veille.md`, références jugées par l'utilisateur (29-09-2026)
- [x] Système de design figé le 29-09-2026 dans `globals.css` (codex, « Le système de design »),
      après la planche de style : Archivo, palette du maillot, largeurs, grammaire du mouvement Couleurs, typographie (remplacer le duo provisoire Instrument Serif et
      Inter), échelle de largeurs, espacements, grammaire du mouvement
- [x] Choix de la bibliothèque d'animation : GSAP 3.15.0 et `@gsap/react` 2.1.2, plus le CSS
      natif (29-09-2026), à installer avec le prototype
- [x] Montée vers Next 16.3.5 et React 19.3.0 (29-09-2026), pour les View Transitions stables
- [x] Prototype de la scène signature : le ballon au-dessus du filet (`/prototype/ballon`, 29-09-2026), en attente de l'avis de l'utilisateur
- [x] Intro de l'accueil, prototype validé le 30-09-2026 (`/prototype/ouverture`, fiche
      `fiches/accueil-ouverture.md`) : 3,9 s, une fois par visite, passable, état final rendu par
      le serveur
- [x] Installer l'intro sur l'accueil (30-09-2026), avec le bloc prochain match branché sur la base (et la
      décision : que révèle l'accueil quand il n'y a pas de prochain match)
- [ ] Pistes d'amélioration de l'intro, notées le 30-09-2026 :
      - motif du bandeau plus irrégulier, pour retrouver les flèches du maillot
      - naissance des contours intérieurs des lettres (P, R, O) pendant la transformation
      - haut de l'écran vide une fois le tableau parti, dans l'état final
      - police allégée aux deux variantes utilisées (environ 40 Ko de moins sur tout le site)
      - essai sur un vrai téléphone Android d'entrée de gamme
- [x] Réhabillage de l'administration avec le nouveau système, sobre, clair et sans animation (29-09-2026)
- [x] Une fiche de page validée avant chaque page publique

### Avant-première pour Tom (décidée le 01-10-2026)

L'instance de production est mise en ligne **derrière une barrière**, sur
`volley.valentincheron.fr`, pour que Tom voie le site et essaie l'administration. Ce n'est pas une
preview jetable : vraie base Turso, vrai bucket R2, et ce qu'il saisit est gardé. Le lancement
public consistera à retirer la barrière et à brancher le domaine définitif (recompilation, car
`NEXT_PUBLIC_SITE_URL` est figé à la compilation).

- [x] Enregistrement DNS `volley` dans la zone Cloudflare `valentincheron.fr` (01-10-2026)
- [x] Base Turso de production `projet-volley-prod` (aws-eu-west-1), migrations 0000 à 0009 appliquées avec l'accord de l'utilisateur (01-10-2026)
- [x] Bucket R2 `projet-volley`, jeton Object Read & Write limité au bucket, domaine public `photos-volley.valentincheron.fr` ; dépôt, lecture publique et effacement vérifiés (01-10-2026)
- [x] Cache Rule Cloudflare sur `photos-volley` (posée le 01-10-2026, durée non observable dans les en-têtes) : cache du CDN limité à 1 jour, sinon une photo effacée reste servie jusqu'à un an (`immutable`) ; la politique annonce 24 heures
- [x] Application Coolify `yroel53ywoxpwgcxfuhv6gf1` depuis `main`, auto-déploiement à chaque push, santé sur `/sante`, purge à 02:41 UTC (01-10-2026)
- [x] Barrière Basic Auth : 401 sans identifiants, 200 avec, identifiants dans `Coolify/.env` (01-10-2026)
- [x] Sauvegardes de la base (03:17 UTC, 14 jours) et miroir des photos, restauration prouvée par le poste Coolify (01-10-2026)
- [x] Compte administrateur de l'utilisateur, créé par `db:admin` en production (01-10-2026)
- [ ] Compte administrateur de Tom, créé depuis la page « Comptes » avec un mot de passe provisoire
- [ ] Une photo déposée de bout en bout : R2, puis le miroir `photos/volley/courant`
- Pas de données de démonstration en production (décidé le 01-10-2026) : Tom découvre le site vide
  et le remplit, rien à purger ensuite
- Reportés au lancement public : Umami, sonde Todai, retrait de la barrière

### Avant la mise en ligne

- [x] Audit complet du groupe (huit regards) le 01-10-2026 : `audits/2026-10-01-audit-groupe.md`, 66 constats sur 97 corrigés en séance, le reste arbitré ou à faire ci-dessous
- [x] Purge des données de démonstration : sans objet, la production n'en a jamais reçu (01-10-2026)
- [ ] Déploiement Coolify depuis `main`
- [ ] Sonde Todai sur le domaine
- [ ] Sauvegarde nocturne de la base Turso, **30 jours** au plus (durée annoncée par la politique de confidentialité)
- [ ] Migrations 0002 à 0009 appliquées en production, **avant** le déploiement du code, avec l'accord de l'utilisateur
- [ ] Umami : poser `UMAMI_URL=https://stats.valentincheron.fr` et
  `UMAMI_SITE_ID=15868b64-5057-4ce2-bc1a-0bc7adbc6eaa` en variables d'**exécution** (relire
  `is_buildtime` par l'API, Coolify coche Buildtime par défaut) ; renseigner le domaine du site
  dans Umami ; mettre en place la sauvegarde de la base d'Umami ; vérifier qu'une visite apparaît
  (un bloqueur de publicité peut arrêter `script.js`)
- [ ] Accord de droit à l'image couvrant le site, accord parental pour les mineurs (audit R9)
- [ ] Coolify : vérification de santé sur `/sante` ; variables de build `R2_DOMAINE_PUBLIC`, `NEXT_PUBLIC_SITE_URL` et `UMAMI_URL` (la CSP les fige à la compilation) (audit F5, F7, S8)
- [ ] Purge nocturne : `PURGE_JETON` (32 caractères au moins) en variable d'exécution, et une tâche planifiée Coolify qui lance `wget -q -O - --post-data="" --header="Authorization: Bearer $PURGE_JETON" http://127.0.0.1:3000/taches/purge` (audit R3)
- [ ] Traefik : 64 Ko de corps hors administration, limite de débit sur `/contact` et la connexion (audit S7)
- [ ] Le 07-10-2026 au plus tôt : Next 16.3.6 (correctif de sécurité, règle des 15 jours), contrôle des dépendances tirées (audit S10)
- [ ] Copie nocturne des photos R2, restauration testée avec la base (audit F3) ; seconde copie vérifiée de la clé `age` (F4)
- [ ] Umami : purge au-delà de 25 mois, puis la durée dans la politique (audit R6)
- [ ] Mentions légales : coordonnées de Tom chez l'hébergeur réel, article 6 revérifié ; note de sous-traitance ; registre (audit R7, R8, R10)
- [ ] Fiche « que faire si » pour Tom (audit F12)
- [ ] R2 : créer le bucket `projet-volley`, un jeton limité à ce bucket (lecture et écriture), et
  son domaine public ; poser `R2_COMPTE_ID`, `R2_CLE_ACCES`, `R2_CLE_SECRETE` en variables
  d'exécution et **`R2_DOMAINE_PUBLIC` aussi en variable de build** (lu par `next.config.ts`
  pour autoriser les images) ; sans R2, l'envoi est refusé en production

## Lot 2

- [ ] Saisie tabulaire des feuilles de match, pensée pour le clavier
- [ ] Statistiques collectives publiées, chiffres sur les fiches joueurs
- [ ] Mur de soutiens, validation avant affichage
- [ ] Kit presse et partenaires à télécharger
- [ ] Historique des confrontations

## Lot 3

- [ ] Score en direct depuis le gymnase
- [ ] Récupération automatique du classement fédéral, si le portail le permet
- [ ] Galerie photos
- [ ] Intégration Instagram, si l'API le permet un jour

## À vérifier auprès de l'ami

Aucun de ces points ne bloque le développement.

- [ ] Le vrai nom du concept, puis renommer dossier et dépôt
- [ ] Identité graphique de la série : logo, couleurs, typographie
- [x] Le championnat exact et la poule (01-10-2026, portail FFVB public) : Seniors masculins
      Division 2 du comité du Rhône, poule SMB, 13 équipes, une journée d'exemption. Source :
      `ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php?saison=2026/2027&codent=PTRA69&poule=SMB`.
      Trois sets gagnants d'après les scores de la D1 2025-2026. À confirmer avec Tom que c'est
      bien l'équipe de la série (une seule D2 masculine au club)
- [ ] Les trois matchs sans heure publiée : CO St Fons (17-10), CAVJ (09-01), Fidésienne VB
      (30-01), à saisir quand l'heure sera connue
- [ ] Relire et publier les cinq étapes du projet laissées en brouillon le 01-10-2026
- [ ] Que l'accord de droit à l'image couvre aussi la publication sur un site public
- [ ] La salle, son adresse et ses horaires : le gymnase Jean Boistard (portail FFVB),
      entraînements de la D2 le lundi et le mercredi de 18 h à 20 h (site du club) ; manque
      l'adresse exacte, sans laquelle le bouton Itinéraire n'apparaît pas
- [ ] Qui saisira, et donc s'il faut vraiment deux comptes dès le départ
- [ ] Achat du nom de domaine, et transfert éventuel à son nom plus tard
