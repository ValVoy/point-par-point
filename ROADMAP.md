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

Ensuite : la page Matchs et la page d'un match (qui reprennent les tableaux), puis la série.
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
- [ ] Envoi d'images vers R2 avec redimension
- [x] Jeu de données de démonstration marqué `demo`, comptage et commande de purge
- [x] Bandeau de démonstration dans l'administration

### Administration

- [x] Écran de connexion, limitation des tentatives, coquille et navigation par rôle
- [x] Saisons : création, modification, saison courante, corbeille
- [x] Effectif : ajout de joueur, numéro et poste par saison, capitaine, retrait
- [ ] Fiche joueur détaillée (photo, présentation longue, parcours)
- [x] Matchs : liste par saison, scores à saisir en tête, ajout isolé, modification, état,
      commentaire, corbeille (29-09-2026)
- [x] Calendrier de la saison, saisie en masse, tout ou rien (29-09-2026)
- [x] Score et détail set par set, écran court pensé pour le téléphone, ou score final seul
      (29-09-2026)
- [x] Tableau de bord : scores à saisir, épisodes en brouillon, prochain match (29-09-2026)
- [ ] Point de visage des photos de joueurs (deux colonnes sur `joueurs`), avec l'envoi vers R2
- [x] Épisodes : adresse YouTube, résumé, lien vers un match, brouillon puis publication (29-09-2026)
- [x] Actualités, avec brouillon obligatoire et mise en forme légère maison (29-09-2026)
- [x] Chronologie du projet, staff, partenaires, ordre à la main, réservés à l'admin (29-09-2026). Photos et logos avec l'envoi vers R2
- [ ] Classement de la poule, avec sa date de mise à jour
- [ ] Messages de contact
- [ ] Comptes utilisateurs, corbeille

### Site public

- [ ] Accueil : dernier épisode et prochain match
- [ ] Effectif, et une page par joueur
- [ ] Matchs : calendrier, page d'un match, bouton d'ajout à l'agenda
- [ ] Série : liste et page par épisode
- [ ] Actualités
- [ ] Le projet et sa chronologie, l'équipe derrière
- [ ] Où nous voir jouer : salle, adresse, carte
- [ ] Partenaires, contact
- [ ] Bilan de saison calculé depuis les scores
- [ ] Mentions légales et politique de confidentialité
- [ ] Compteur d'audience sans cookie
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
- [ ] Installer l'intro sur l'accueil, avec le bloc prochain match branché sur la base (et la
      décision : que révèle l'accueil quand il n'y a pas de prochain match)
- [ ] Pistes d'amélioration de l'intro, notées le 30-09-2026 :
      - motif du bandeau plus irrégulier, pour retrouver les flèches du maillot
      - naissance des contours intérieurs des lettres (P, R, O) pendant la transformation
      - haut de l'écran vide une fois le tableau parti, dans l'état final
      - police allégée aux deux variantes utilisées (environ 40 Ko de moins sur tout le site)
      - essai sur un vrai téléphone Android d'entrée de gamme
- [x] Réhabillage de l'administration avec le nouveau système, sobre, clair et sans animation (29-09-2026)
- [ ] Une fiche de page validée avant chaque page publique

### Avant la mise en ligne

- [ ] Revue de sécurité manuelle en passe adversariale (formulaire de contact, passe complète)
- [ ] Purge des données de démonstration, bandeau disparu
- [ ] Déploiement Coolify depuis `main`
- [ ] Sonde Todai sur le domaine
- [ ] Sauvegarde nocturne de la base Turso

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
- [ ] Le championnat exact et la poule, et son format : trois sets gagnants ou autre (l'écran
      de score alerte sans bloquer sur un format inhabituel)
- [ ] Que l'accord de droit à l'image couvre aussi la publication sur un site public
- [ ] La salle, son adresse et ses horaires
- [ ] Qui saisira, et donc s'il faut vraiment deux comptes dès le départ
- [ ] Achat du nom de domaine, et transfert éventuel à son nom plus tard
