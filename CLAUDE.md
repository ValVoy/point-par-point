# CLAUDE.md

Guide pour Claude Code sur ce dépôt.

## Contexte du projet

Site de **Projet Volley**, le concept monté par un ami de l'utilisateur autour d'une équipe de
volley. Le concept vit déjà en contenu : Instagram, et **une série YouTube lancée pour accompagner
le projet**. Le site vient donner ce que les réseaux ne savent pas faire, des informations qui se
consultent et qui durent : l'effectif poste par poste, les âges, les résultats de matchs.

**`Projet Volley` est un nom provisoire**, posé le 19-09-2026 faute de mieux. Le vrai nom du concept
est à récupérer auprès de l'ami, et le dossier comme le dépôt seront renommés à ce moment-là.

Projet coup de coeur, mené en aide à un ami. Cela ne change rien aux exigences techniques, mais
beaucoup à ce qu'on promet dans la durée : voir la question de la maintenance au cadrage.

Rien n'est commencé. Le dossier est un squelette posé le 19-09-2026 pour pouvoir démarrer sans
refaire le cadrage de zéro.

## Les trois choses déjà tranchées

Elles ne se rouvrent pas sans raison neuve, et la première commande toute l'architecture.

- **Le site a une interface d'administration.** Décidé le 19-09-2026. Le but est de mettre à jour le
  site régulièrement, au rythme de la saison et de la série : ce n'est donc pas un site vitrine en
  fichiers, mais une application avec une base de données, une authentification et un back-office
  que l'ami utilise seul, sans l'utilisateur. Toute proposition de contenu figé en dur contredit le
  besoin exprimé.
- **L'hébergement est le VPS Coolify de l'utilisateur** (cf. `APP/Coolify/ETAT.md`). À prévoir avant
  mise en ligne, comme pour tout service de cette machine : une sonde Todai, et la sauvegarde
  nocturne de la base.
- **Pas d'intégration Instagram pour l'instant.** Écartée du premier lot le 19-09-2026. C'est une
  bonne nouvelle technique : l'ancienne API publique d'affichage a fermé fin 2024 et la voie
  actuelle demande un compte professionnel et une application déclarée. La série **YouTube**, elle,
  s'intègre par simple lecteur intégré, sans clé ni API.

**Stack présumée, à confirmer au cadrage** : Next.js 15 (App Router), TypeScript strict, Tailwind,
et une base de données, Turso étant celle de tous les autres projets de l'utilisateur. L'interface
d'administration rend la base et l'authentification obligatoires, elles ne sont plus une option.

## La première séance est un cadrage, pas du code

**Ne pas écrire une ligne de code avant que le cadrage soit terminé et le plan validé.**

Les questions se posent avec l'outil **`AskUserQuestion`**, avec à chaque fois des réponses
plausibles à choisir, jamais en liste à puces dans le texte. L'outil accepte 4 questions par appel
et 2 à 4 options chacune : enchaîner plusieurs salves de 4 plutôt que de se limiter. Pour chaque
question, recommander une option et dire pourquoi en une phrase.

Terrains à couvrir, au minimum :

- **Ce qu'est le concept, exactement** : une équipe qui joue en championnat, un projet de média
  autour du volley, ou les deux. Le rôle de l'ami là-dedans, et qui décide du contenu.
- **Le but du site** : prolonger l'audience de la série, présenter l'équipe à des sponsors, recruter
  des joueurs, annoncer les matchs. Ce que devient un visiteur convaincu.
- **Le contenu** : fiches joueurs (poste, âge, taille, numéro, photo, parcours), résultats de
  matchs, calendrier, classement, actualités, épisodes de la série.
- **Ce que l'interface d'administration doit permettre**, poste par poste : ajouter un joueur,
  saisir un résultat, publier un épisode, écrire une actualité. Et ce qu'elle n'a pas à permettre,
  qui est tout aussi important pour ne pas construire un CMS complet.
- **Qui a le droit d'y entrer** : l'ami seul, ou plusieurs personnes de l'équipe. Décide s'il faut
  des rôles ou un simple compte unique.
- **La source des résultats** : saisie à la main après chaque match (défaut à retenir), ou données
  récupérées d'une fédération. **Ne rien présumer sur ce que la fédération publie ni à quelles
  conditions**, vérifier avant de concevoir.
- **Les photos et les vidéos** : qui les héberge et où. Un bucket R2 est déjà utilisé sur d'autres
  projets de l'utilisateur ; la série reste sur YouTube.
- **Les données personnelles des joueurs** : le droit à l'image est acquis, les joueurs sont filmés
  pour la série et ont donné leur accord. Reste à vérifier une seule chose au cadrage, sans en faire
  un obstacle : que cet accord couvre aussi la publication sur un site public, et pas seulement le
  tournage. Prévoir dans tous les cas mentions légales et politique de confidentialité.
- **Le nom de domaine** : qui l'achète et à quel nom il est déposé. Point à ne pas laisser flou
  entre amis.
- **Ce qui est offert et ce qui ne l'est pas** : la construction est un cadeau, la maintenance dans
  la durée en est un autre. Dire dès le départ qui répare quoi, et pendant combien de temps.
- **Le périmètre du premier lot**, et ce qui attend un lot 2.

En sortie : un plan écrit, validé par l'utilisateur, avant le premier fichier de code.

## Écarts par rapport au socle global

Le socle de `~/.claude/CLAUDE.md` s'applique tel quel. Trois précisions propres à ce dépôt :

- **Autonomie git complète** : Claude exécute lui-même `add`, `commit` et `push`. Jamais de commande
  destructive (`reset --hard`, `push --force`, réécriture d'historique) sans accord explicite.
- **Autonomie sur la base de données** (accordée le 20-09-2026) : Claude exécute lui-même les
  migrations et les opérations courantes sur la **base de développement** : `db:generate`,
  `db:migrate`, `db:demo`, `db:purge-demo`, `db:admin`, `db:sql`. Inutile de fournir les commandes
  à copier-coller. Deux réserves subsistent : toute opération sur la **base de production** se
  demande d'abord, et une migration **destructive** (colonne ou table supprimée, données
  réécrites) se demande aussi, même en développement.
- **Commits au nom de l'utilisateur, sans aucune trace d'outil** : pas de `Co-Authored-By`, pas de
  `@`, pas de mention d'IA, ni dans les commits ni nulle part ailleurs. Conventional Commits,
  rédigés en français **et** en anglais.

Pas de revue croisée par une autre IA sur ce projet. Si un second regard est mis en place un jour,
poser la convention `_interne/ClaudeDocs/` + `_interne/GeminiDocs/` du socle global.

## Fichiers de suivi

- `ROADMAP.md` : consulter avant chaque tâche, mettre à jour à chaque jalon.
- `codex.md` : consigner chaque nouveau concept immédiatement.
- `carnetdebord.md` : journal append-only, au format du socle global, jamais modifier une entrée
  passée. La ligne `Suite :` est obligatoire.
