# Carnet de bord , Projet Volley

## 19-09-2026

**15:34** · **[bootstrap] Dossier du projet posé, rien de codé**

Squelette créé depuis la session du chantier d'hébergement. Le projet était le seul des quatre à ne
pas avoir été cité au cadrage du 17-09 : l'utilisateur l'a rattrapé aujourd'hui. Un ami a monté un
concept autour d'une équipe de volley, qu'il fait vivre sur Instagram et par une série YouTube
lancée pour accompagner le projet. L'utilisateur lui a proposé le site. L'idée tient en une phrase :
donner ce que les réseaux ne savent pas faire, des informations qui se consultent et qui durent,
l'effectif poste par poste, les âges, les résultats.

Trois décisions sont prises d'emblée, et la première commande tout le reste. Le site aura une
**interface d'administration**, parce que le but est de le mettre à jour régulièrement, au rythme de
la saison et de la série : il faut donc une base, une authentification et un back-office que l'ami
utilise seul. L'hébergement sera le VPS Coolify. Et **pas d'Instagram dans le premier lot**, ce qui
écarte au passage le seul vrai piège technique du lot, l'ancienne API publique d'affichage ayant
fermé fin 2024 ; la série YouTube, elle, s'intègre par simple lecteur intégré.

Le point de droit à l'image, qui aurait pu bloquer la publication des fiches joueurs, est réglé en
amont : les joueurs sont filmés pour la série et ont donné leur accord. Reste une vérification de
cadrage, pas un obstacle, que cet accord couvre aussi un site public et pas seulement le tournage.

`Projet Volley` est un nom de travail. Le vrai nom du concept est à récupérer auprès de l'ami, et le
dossier comme le dépôt seront renommés à ce moment-là.

- Portée : `CLAUDE.md`, `ROADMAP.md`, `codex.md`, `carnetdebord.md`, `.gitignore`, dépôt git local
  sans distant.
- Vérifié : rien à vérifier, aucun code.
- Suite : ouvrir une séance dans ce dossier et lancer le cadrage par questions décrit dans
  `CLAUDE.md`. Première chose à établir avec l'ami : le vrai nom, puis ce que l'interface
  d'administration doit permettre, poste par poste.

**23:15** · **[cadrage] Cadrage d'ouverture terminé, plan écrit**

Neuf salves, quarante questions, tous les terrains du `CLAUDE.md` couverts. Le projet sort de la
séance avec `PLAN.md`, cinq principes de conception dans le codex et une roadmap en trois lots.
Aucune ligne de code, comme prévu.

Le concept est un projet média d'abord, adossé à une vraie équipe de championnat FFVB
départemental ou régional. Le site doit servir deux choses et pas dix : faire s'abonner à la série,
et faire venir au match. La page d'accueil découle directement de là, dernier épisode et prochain
match en tête, parce que ce sont les deux seuls contenus qui bougent souvent.

La décision la plus structurante est venue de l'utilisateur, pas de moi. Sur la question des
statistiques, il a refusé l'arbitrage que je proposais entre fiche riche et fiche pauvre, et a posé
l'architecture correcte : le match est la source unique, on saisit une feuille de match et tout le
reste se recalcule. Cela l'a conduit à demander les statistiques volley complètes, ce qui est
ambitieux, le dépouillement vidéo représentant une vingtaine de minutes par match pendant huit
mois. La parade est dans le principe de saisie partielle : tous les champs de statistique sont
nullables, un match peut n'avoir qu'un score, et le site s'affiche proprement dans tous les cas.
L'ambition est gardée sans que le site meure en novembre comme tous les sites d'équipe.

La deuxième décision de fond est un refus, et elle vaut mieux qu'une fonctionnalité. J'ai proposé
un classement interne des marqueurs, présenté comme la récompense naturelle des statistiques
saisies. Réponse : le volley est avant tout un sport d'équipe. Le site ne classera donc jamais les
joueurs entre eux, les chiffres collectifs passent devant, et les chiffres individuels n'existent
que sur la page du joueur concerné, sans comparaison. C'est écrit dans le codex comme principe, pas
comme préférence d'affichage : cela tranche d'avance toutes les demandes futures qui reviendraient
à hiérarchiser douze copains.

Le reste s'est joué sur des garde-fous, tous retenus : pas de mise en page libre, pas de création
de pages, pas de suppression définitive, pas de publication sans brouillon. C'est ce qui empêche un
CMS complet de naître par accident. S'y ajoute une idée de l'utilisateur, durcie d'un cran : le
site sera livré avec des données de démonstration pour ne pas imposer à l'ami de remplir un site
vide, mais chaque faux enregistrement portera une colonne `demo`, l'administration affichera un
bandeau tant qu'il en reste un, et une commande unique purgera l'ensemble. Une note dans un coin
s'oublie, un bandeau rouge non.

Deux points ont été posés pour ne pas rester flous entre amis. La maintenance : la construction et
l'hébergement sont offerts, les pannes corrigées au fil de l'eau, aucune nouvelle fonctionnalité
promise au-delà du lot 1. Et le domaine : acheté par l'utilisateur et offert, alors que l'éditeur
déclaré du site sera l'ami à titre de particulier. Les deux rôles sont distincts et c'est normal,
mais les relances de renouvellement arriveront chez l'utilisateur, d'où le transfert prévu et
documenté à l'avance.

Écarté au passage, et c'est autant de travail en moins : la lettre d'information, donc tout envoi
d'e-mail et tout le volet données personnelles des visiteurs qui allait avec ; la galerie photos,
parce que personne ne sait s'il y a des photos ; la boutique avec paiement. Le mur de soutiens est
gardé mais renvoyé au lot 2, avec validation obligatoire avant affichage : c'est le seul endroit du
site où un inconnu écrit, et c'est lui qui déclenchera la revue de sécurité manuelle.

- Portée : `PLAN.md` créé, `codex.md` et `ROADMAP.md` réécrits, `carnetdebord.md`.
- Vérifié : rien à vérifier, aucun code. Le plan attend la validation de l'utilisateur.
- Suite : faire valider le plan, créer le dépôt GitHub privé et pousser le squelette, puis
  initialiser Next.js 15 et le schéma Drizzle complet, colonnes du lot 2 comprises.

## 20-09-2026

**00:20** · **[fondations] Plan validé, fondations techniques posées et vérifiées**

Le plan a été validé sans réserve dans la foulée du cadrage. Séance de nuit consacrée aux seules
fondations : rien de visible, tout ce sur quoi le reste va s'appuyer.

Choix de départ qui a évité une heure de tâtonnement : plutôt que de lancer `create-next-app`,
interdit par la règle npm du socle puisqu'il s'exécute en `@latest`, j'ai repris à l'identique les
versions de `ope_cdm`, qui tourne en production depuis des mois. Next 15.5.18, React 19.1.0,
Drizzle 0.45, Tailwind 4. Elles sont éprouvées et publiées depuis longtemps, ce qui règle d'un coup
la question de la chaîne d'approvisionnement. La structure du projet a été posée fichier par
fichier, sans générateur.

Le schéma fait dix-sept tables, découpées en trois fichiers par domaine plutôt qu'un seul gros :
sportif, éditorial, exploitation, plus un fichier de colonnes communes qui porte à lui seul deux
principes du codex. La corbeille et le marquage de démonstration ne sont pas recopiés table par
table, ils sont définis une fois et réutilisés, ce qui rend impossible d'oublier l'un des deux en
ajoutant une table.

Deux écarts au plan, tous deux assumés et écrits dans `PLAN.md`. Le premier : bcrypt au lieu
d'argon2id, parce que les portages argon2 pour Node demandent une compilation native qui alourdit
l'image Docker et casse au moindre changement d'architecture, pour un enjeu qui reste un faux
résultat de match publié. Le second va dans l'autre sens : le lint et la vérification des types
restent actifs pendant le build, alors qu'ils étaient désactivés sur `ope_cdm`. La raison de leur
désactivation là-bas était le plafond mémoire de 644 Mo de Clever Cloud, que le VPS Hetzner n'a pas.

Rien n'a été déclaré fait sur la foi du code. La migration a été appliquée à une vraie base SQLite
jetable, et les dix-sept tables ont été relues depuis `sqlite_master`, colonnes comprises : les
champs de statistique sont bien nullables, ce qui vérifie le principe de saisie partielle dans le
SQL et non seulement dans l'intention. L'authentification a été éprouvée en dix points, dont les
trois qui comptent : le jeton stocké en base diffère bien de celui du cookie, un jeton inventé est
refusé, et désactiver un compte lui retire sa session immédiatement sans qu'il faille penser à la
supprimer. Le cycle de démonstration a tourné en entier, 50 enregistrements marqués semés puis 116
lignes effacées enfants compris, le compte utilisateur survivant à la purge comme prévu.

Un défaut trouvé à l'écran, et c'est précisément pourquoi la règle de vérification visuelle existe :
la page s'affichait sans accents. J'avais écrit les chaînes comme les commentaires, en caractères
simples. Les commentaires peuvent s'en passer, pas ce que lit un visiteur. Tout le texte affiché est
repassé en français correct, jeu de démonstration compris, et la règle est notée dans `src/lib/site.ts`
pour ne pas se reproduire. Au passage, la fabrique d'adresses est sortie du script de démonstration
vers `src/lib/slug.ts` : deux implémentations divergentes auraient fini par produire deux adresses
pour le même joueur.

- Portée : `package.json`, configurations Next, TypeScript, ESLint, PostCSS et Drizzle, `Dockerfile`,
  `src/lib/db/` (schéma en quatre fichiers), `src/lib/auth/` (quatre fichiers), `src/lib/demo.ts`,
  `src/lib/slug.ts`, `src/app/` (layout, accueil provisoire, jetons de style), `scripts/` (migration,
  semis, purge, vérification, création d'administrateur).
- Vérifié : `next build`, `tsc --noEmit` et `eslint` sans erreur ; migration appliquée et relue sur
  base SQLite ; authentification éprouvée en dix points ; semis et purge de démonstration joués en
  entier ; page d'accueil vue dans un navigateur, défaut d'accents trouvé et corrigé.
- Suite : créer la base Turso réelle et y appliquer la migration, puis écrire l'écran de connexion
  et la coquille de l'administration, avec le bandeau de données de démonstration qui attend déjà
  son emplacement.
