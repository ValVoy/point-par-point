# ROADMAP , Projet Volley

> Plan vivant. Consulter avant chaque tâche, mettre à jour à chaque jalon.

## État actuel

**Plan validé le 19-09-2026 au soir, fondations posées dans la nuit du 19 au 20-09-2026.**

Ce qui tourne et a été vérifié : Next.js 15 en TypeScript strict, 17 tables Drizzle migrées sur
SQLite, authentification à deux rôles éprouvée bout en bout, jeu de démonstration de 50
enregistrements et sa purge. Aucun écran d'administration, aucune page publique réelle.

Ce qui marche à l'écran : connexion, déconnexion, navigation réduite selon le rôle, bandeau de
démonstration. Aucun écran de saisie, aucune page publique réelle.

Prochaine étape : les écrans de saisie, en commençant par les saisons et l'effectif, puisque tout
le reste s'y rattache.

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
- [ ] Saisons et effectif (numéro et poste portés par la saison)
- [ ] Calendrier de la saison, saisie en masse
- [ ] Score et détail set par set, écran court pensé pour le téléphone
- [ ] Épisodes : adresse YouTube, résumé, lien vers un match
- [ ] Actualités, avec brouillon obligatoire
- [ ] Chronologie du projet, staff, partenaires
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
- [ ] Le championnat exact et la poule
- [ ] Que l'accord de droit à l'image couvre aussi la publication sur un site public
- [ ] La salle, son adresse et ses horaires
- [ ] Qui saisira, et donc s'il faut vraiment deux comptes dès le départ
- [ ] Achat du nom de domaine, et transfert éventuel à son nom plus tard
