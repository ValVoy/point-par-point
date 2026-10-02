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

**00:35** · **[administration] Connexion, rôles et bandeau de démonstration**

Autonomie sur la base de données accordée en cours de séance, inscrite dans le `CLAUDE.md` du
projet avec deux réserves que je me suis gardées faute d'accord explicite : la base de production
et les migrations destructives se demandent toujours.

La base Turso de développement était déjà branchée, l'utilisateur ayant posé le `.env.local`
pendant la séance précédente. Migrée, semée, et la connexion vérifiée avant tout le reste.

Point d'outillage tranché définitivement : **il n'existe pas de CLI Turso pour Windows**. Vérifié
plutôt que supposé, la version `1.0.32` ne publie que des binaires Darwin et Linux, et la
documentation officielle exige toujours WSL, abandonné mi-2026. Le carnet d'`ope_cdm` le
documentait depuis des mois et je ne l'avais pas lu avant de proposer la commande. Plutôt que
d'installer un manifest tiers, j'ai écrit `npm run db:sql`, qui couvre l'usage réel de
`turso db shell` en passant par `@libsql/client`, déjà installé.

L'écran de connexion a reçu une **limitation de débit** qui n'était pas au plan, reprise de ce qui
existe sur `ope_cdm`. Elle se justifie par le cadrage lui-même : la connexion est, avec le
formulaire de contact, l'un des deux seuls endroits où une entrée non contrôlée entre dans le
système, donc l'un des deux qui déclenchent la revue de sécurité. Deux compteurs en fenêtre
glissante, serré par adresse visée, large par adresse réseau, parce que l'équipe peut partager une
connexion. Le contrôle passe avant le hachage du mot de passe : laisser déclencher sans limite un
calcul volontairement coûteux serait offrir un déni de service sur le processeur.

Deux défauts corrigés dans ma propre copie avant de committer. D'abord, j'avais écrit une purge des
tentatives qui effaçait aussi par adresse réseau après une connexion réussie : quiconque possède un
compte valide aurait pu remettre son compteur à zéro à volonté et contourner la protection contre
le balayage. Restreinte à l'adresse visée. Ensuite, mon premier layout d'administration lisait un
en-tête `x-chemin` qui n'existe pas, pour distinguer la page de connexion du reste. Remplacé par un
groupe de routes `(interieur)`, qui est la vraie réponse Next.js : la connexion garde son adresse
mais n'hérite ni de la navigation ni de l'exigence d'être connecté, ce qui serait circulaire.

Deux défauts trouvés à l'écran, et non dans le code. Le formulaire se vidait après un échec, il
fallait retaper son adresse : c'est le correctif que le carnet d'`ope_cdm` mentionne déjà, l'adresse
revient désormais avec l'erreur, jamais le mot de passe. Et le bandeau de démonstration affichait
« 1 saisons, 1 classements », sans accents et sans accord. Un garde-fou qu'on veut voir pris au
sérieux ne peut pas être écrit à la va-vite, les libellés portent maintenant un singulier et un
pluriel.

- Portée : `src/lib/auth/tentatives.ts`, `src/lib/db/schema/exploitation.ts` (table
  `tentatives_auth`, migration `0001`), `src/app/administration/` (layout, groupe `(interieur)`,
  connexion, coquille, bandeau, tableau de bord), `src/lib/demo.ts`, `scripts/sql.ts`,
  `CLAUDE.md`, `PLAN.md`, `ROADMAP.md`.
- Vérifié : `next build`, `tsc --noEmit` et `eslint` sans erreur ; migration `0001` appliquée sur
  Turso et table relue ; dans le navigateur, refus sur mauvais mot de passe, connexion réussie,
  redirection de `/administration` vers la connexion, déconnexion effective, et navigation
  réellement réduite en rôle rédacteur, cinq rubriques au lieu de huit ; limitation de débit
  éprouvée, blocage au sixième essai, adresse voisine épargnée, compteur remis à zéro après succès.
  Compte d'essai et tentatives effacés de la base après le test.
- Suite : les écrans de saisie, en commençant par les saisons et l'effectif, puisque tout le reste
  s'y rattache. Changer le mot de passe provisoire affiché en clair dans le terminal.

**00:50** · **[administration] Saisons et effectif, les deux écrans dont tout dépend**

Premiers écrans de saisie. Ils passent en premier parce que tout le reste s'y rattache : un match
appartient à une saison, une feuille de match désigne des joueurs, et sans ces deux tables rien
d'autre ne peut être saisi.

Les règles métier tenues par le code plutôt que par la base, chacune pour une raison. **Une seule
saison courante** : SQLite ne sait pas exprimer « un seul vrai dans cette colonne », et deux
saisons courantes rendraient la page d'accueil indéterministe. **Un numéro de maillot unique par
saison** : une contrainte d'unicité aurait renvoyé « constraint failed », alors que l'écran dit
maintenant « Le numéro 10 est déjà porté par Romain Démo ». **Un seul capitaine par saison**, même
logique. Et **une saison courante ne peut pas partir à la corbeille**, ce serait laisser le site
sans saison affichable.

Le retrait d'un joueur du groupe ne touche pas au joueur lui-même, seulement à sa ligne d'effectif :
ses feuilles de match des saisons passées y font référence, et il peut revenir l'année suivante.
C'est le principe de la source unique appliqué à l'effectif.

Trois défauts trouvés à l'écran, aucun par le compilateur. Le bouton « Enregistrer » sautait à la
ligne dès qu'un nom était long : `flex-wrap` fait dépendre le retour à la ligne de la largeur du
contenu, remplacé par une grille dont les colonnes sont décidées. Les actions « désigner capitaine »
et « retirer du groupe » flottaient hors de la carte, sur le fond gris, faute d'être dans le
composant de ligne. Et le badge « capitaine » se faisait couper par la troncature du nom alors
qu'il est plus court que lui : il est descendu sur la ligne de détails.

Une correction avant même l'écran : j'avais placé des `<div>` en enfants directs d'un `<ul>`, ce qui
est invalide en HTML. Le composant de ligne rend désormais un `<div>` et c'est la page qui
l'enveloppe dans son `<li>`.

Noté au passage, parce que la panne est déroutante : lancer `next build` pendant que le serveur de
développement tourne écrase son `.next` et casse tous ses fichiers statiques, sans message clair.
Le serveur continue de répondre en HTML mais la page arrive sans style ni script.

- Portée : `src/components/formulaire.tsx`, `src/lib/dates.ts`, `src/lib/postes.ts`,
  `src/lib/saisons.ts`, `src/app/administration/(interieur)/saisons/` et `.../effectif/`.
- Vérifié : `next build`, `tsc --noEmit` et `eslint` sans erreur. Dans le navigateur : création
  d'une saison, mise à la corbeille et restauration, tri de l'effectif par poste puis par numéro,
  refus d'un numéro en double avec le nom du joueur en conflit, ajout de deux joueurs homonymes
  produisant `etienne-demo` et `etienne-demo-2`. Données d'essai effacées de la base après le test,
  les 50 enregistrements de démonstration sont intacts.
- Suite : les matchs, calendrier de la saison saisi d'un coup, puis le score set par set sur un
  écran court pensé pour le téléphone.

**00:55** · **[direction artistique] Deux exigences de design posées en fin de séance**

Fin de la première journée de code. L'utilisateur arrête la séance mais pose deux demandes qu'il
veut voir survivre à la session, et elles sont notées dans `codex.md`, `ROADMAP.md`, `PLAN.md` et
en mémoire plutôt que dans une seule.

**La largeur.** Tout le site est aujourd'hui dans une colonne de `max-w-5xl`, jugée trop étroite.
La marge latérale reste, elle n'est pas remise en cause, mais elle doit maigrir. Et surtout, elle
cesse d'être absolue : les bandeaux doivent pouvoir aller d'un bord à l'autre de l'écran, images,
bandes de résultats, lecteurs vidéo, sections colorées. La conséquence pratique est qu'il faut une
échelle de largeurs nommée appliquée partout, sinon chaque page aura la sienne.

**Le motion design**, avec insistance, le mot « vraiment » en majuscules. Ce n'est pas une finition
de fin de projet mais une ambition du site. L'exemple donné dit bien l'intention : au défilement,
un ballon de volley qui passe au-dessus d'un filet. Ce qui compte n'est pas l'effet, c'est que le
mouvement raconte le sport dont le site parle.

La conséquence sur l'ordre des travaux est réelle et vaut d'être écrite : **la bibliothèque
d'animation se tranche avant d'écrire les pages publiques**, pas après. Plaquer du mouvement sur
des pages déjà faites coûte toujours plus cher que de les concevoir animées. Trois garde-fous
notés au codex pour que l'ambition ne se retourne pas contre le site : `prefers-reduced-motion`
respecté sans exception, le mouvement qui ne retarde jamais la lecture d'une information, et rien
de tout cela dans l'administration, où l'ami veut de la vitesse et de la prévisibilité.

- Portée : `codex.md` (nouvelle section Direction artistique), `ROADMAP.md` (chantier dédié),
  `PLAN.md` (ligne Animation dans l'architecture), mémoire de projet.
- Vérifié : rien à vérifier, aucun code écrit dans cette entrée.
- Suite : trancher la bibliothèque d'animation et l'échelle de largeurs, **avant** d'écrire les
  pages publiques. Côté administration, reprendre aux matchs : calendrier de la saison saisi d'un
  coup, puis score set par set sur un écran court pensé pour le gymnase.

## 29-09-2026

**12:35** · **[méthode] Trois casquettes, refonte visuelle et première veille**

Reprise après neuf jours. L'utilisateur relève encore l'exigence : un site très haut de gamme, avec
un vrai motion design, et il veut que je tienne pendant tout le projet trois rôles à la fois,
développeur fullstack senior, directeur artistique en veille permanente, directeur artistique UX et
UI. Il m'a laissé carte blanche sur l'organisation, y compris en plusieurs agents.

J'ai proposé une seule main pour le code et trois étapes par page, qui produisent une fiche validée
avant le code. Trois agents qui codent chacun de leur côté casseraient la cohérence, et c'est
précisément la cohérence qui fait un site haut de gamme. Les agents gardent deux rôles où ils
apportent quelque chose que je n'ai pas seul : la veille en parallèle, et la critique à froid d'une
page qu'ils n'ont pas construite. Méthode validée telle quelle, inscrite dans `CLAUDE.md` et en
mémoire.

Il a ajouté de lui-même que tout le visuel existant pouvait repartir de zéro. L'inventaire montre
qu'il est petit : les jetons de `globals.css`, les polices, l'habillage de l'administration. La
logique n'est pas concernée. Les polices actuelles, Instrument Serif et Inter, forment un duo très
répandu qui ferait générique : elles sont les premières à partir.

La veille a tourné en trois agents parallèles, triée dans `veille.md`. Ce qui en sort de plus
utile n'est pas un effet mais une règle : les meilleurs sites ont **une seule scène spectaculaire**
et une grammaire sobre partout ailleurs. La pile proposée est GSAP seul plus le CSS natif, sans
Lenis, Motion, Rive ni 3D au premier lot, et j'ai revérifié moi-même les versions dans le registre
plutôt que de me fier aux rapports. Les deux agents du web ont croisé une injection dans la
documentation Next.js, un bloc qui invite les agents à installer un paquet : ignorée, rien
d'exécuté.

- Portée : `CLAUDE.md`, `ROADMAP.md`, `veille.md` (nouveau), mémoire de projet.
- Vérifié : versions de `gsap`, `@gsap/react` et `next` relues dans le registre npm. Aucune
  référence encore vue à l'écran, c'est une limite assumée de cette passe.
- Suite : ouvrir les références retenues dans le navigateur, puis trancher le système de design
  (couleurs, typographie, largeurs, grammaire du mouvement) et la montée vers Next 16.3.5.

**12:40** · **[technique] Montée vers Next 16.3.5 et React 19.3.0**

Décidée avec l'utilisateur avant d'écrire la moindre page publique : les transitions entre pages,
qui porteront le passage de la carte d'un joueur à sa fiche, ne sont qu'expérimentales en 15.5 et
stables en 16. Le code est encore petit, la montée ne coûtera jamais moins cher qu'aujourd'hui.

Versions choisies sous la règle des quinze jours et lues dans le registre, pas déduites : Next
16.3.7 était sortie le matin même, la 16.3.5 du 11-09 est la plus récente admissible. React, ses
types et `eslint-config-next` suivent, en versions exactes. Aucun nouveau paquet ne lance de script
à l'installation, l'audit de production est vide.

Deux effets de bord de Next 16, qui valent d'être écrits. `next build` ne lance plus le lint : le
commentaire de `next.config.ts` le promettait encore, il est corrigé et le lint se passe à part.
Et `next dev` a écrit de lui-même un bloc d'instructions pour agents dans `CLAUDE.md`. Traité
d'abord comme une injection possible, vérifié en lisant le code de Next : c'est un comportement
voulu, qui réécrit le bloc à chaque lancement si on l'efface. Il est déplacé dans `AGENTS.md`, que
Next préfère, et la convention est au codex.

- Portée : `package.json`, `package-lock.json`, `eslint.config.mjs` (configuration plate native),
  `next.config.ts`, `tsconfig.json` (ajusté par Next), `AGENTS.md` (nouveau), `codex.md`,
  `ROADMAP.md`.
- Vérifié : `tsc --noEmit`, `npm run lint` et `next build` sans erreur. Dans le navigateur, écrans
  saisons et effectif affichés depuis la base, console sans erreur ni avertissement, `CLAUDE.md`
  intact après relancement du serveur.
- Suite : l'utilisateur parcourt les références de `veille.md` et dit ce qui lui parle, puis on
  tranche le système de design en salves de questions.

**14:30** · **[cadrage] Références jugées et système de design orienté**

Reprise après une coupure de session, reconstituée depuis `veille.md` et ce carnet. L'utilisateur a
ouvert les références et les a jugées à l'écran. Retenus : Lando Norris pour le mouvement, Cadillac
F1 pour la fiche joueur, Toulouse FC pour l'effectif, Radian pour le terrain et les postes,
Volleyball World pour la série intégrée. Écartés : LOVB, EF, The Immortals, et The Last Dance, jugé
à la limite de l'illisible. Alaba est superbe mais hors de portée d'une équipe amateur, qui n'aura
jamais autant de matière par joueur : la fiche se conçoit donc sur peu de données.

Quatre salves ont suivi et toutes les options recommandées ont été prises sauf une. Pour les
portraits, pas de séance photo dédiée : on reprend les photos existantes et c'est le site qui les
harmonise, par une bichromie aux couleurs de l'équipe et un point de visage cliqué dans
l'administration. Ce choix déplace le travail vers le code, et il ajoute un champ au schéma.

Le reste : fond sombre et une couleur vive, titres en grotesque condensée libre, bandeaux pleine
largeur et colonne de lecture étroite, mouvement nerveux et net, scène du ballon en transition sous
l'ouverture de l'accueil avec une version mobile courte, prochain match en tableau de score de
gymnase. Le détail est dans `veille.md`, sections 6 et 7.

- Portée : `veille.md`, `ROADMAP.md`, `carnetdebord.md`.
- Vérifié : rien à vérifier, aucun code écrit dans cette entrée.
- Suite : récupérer les couleurs de l'équipe (maillot, logo, réseaux), puis construire la planche
  de style : palette, trois polices condensées libres, un portrait en bichromie, le tableau de
  score. Le prototype du ballon vient ensuite.

**14:40** · **[cadrage] Palette tirée du maillot**

L'utilisateur a donné la page compétition du club. L'équipe de Projet Volley est le Départemental 2
masculin du VF Francheville. Le club est en marine et rouge, mais les maillots sont turquoise avec
un motif de triangles marine, violet et blanc : c'est le maillot qui est retenu. C'est lui qu'on
voit dans la série et sur les photos, la bichromie des portraits tombera donc juste, et le site se
distingue de celui du club au lieu de le doubler.

Le motif de triangles est la meilleure trouvaille de la séance : une signature propre à l'équipe,
qu'aucune référence de la veille ne pouvait donner. Il reste discret, en texture et en volet de
transition. Le club est cité sobrement, avec un lien, sans son logo, faute d'accord du bureau.

- Portée : `veille.md` (section 8), `carnetdebord.md`.
- Vérifié : page du club vue à l'écran en 1440 px, les maillots lus sur les photos des équipes.
- Suite : construire la planche de style, avec le fond nuit, le turquoise mesuré sur de vraies
  photos, trois condensées libres, un portrait en bichromie, le motif de triangles et le tableau
  de score.

**14:55** · **[design] Planche de style**

Pas encore de photo de la D2 : la planche est construite avec une photo d'une équipe senior du club,
téléchargée dans `public/_local/`, ignoré par git. Elle ne quitte pas le poste et sera remplacée.

La planche est une route `/planche`, réservée au développement (`notFound` en production, jamais
indexée), avec ses propres jetons : `globals.css` et l'administration ne bougent pas tant que rien
n'est tranché. Elle montre la palette (teinte d'écran à côté de la teinte mesurée sur la photo),
les trois condensées candidates sur le même texte, la photo en bichromie et en trichromie, quatre
cartes joueurs, le motif du maillot à trois intensités et le tableau de score avant et après
match. Un bouton bascule la police des cartes et du tableau entre les trois candidates.

Les cartes sont toutes découpées dans une seule photo de groupe, par un point de visage relevé à la
main : le pire cas, et il tient. Un défaut trouvé en le regardant : l'optimiseur d'images servait
la taille affichée du cadre, puis la photo était agrandie cinq fois, d'où du flou. La taille
demandée intègre désormais le zoom. La leçon vaudra pour le vrai composant.

- Portée : `src/app/planche/` (nouveau), `.gitignore`.
- Vérifié : `tsc`, lint, rendu à l'écran en 1440 et 390 px, bascule de police, aucun
  défilement horizontal en mobile, console sans erreur hors l'icône du site absente.
- Suite : l'utilisateur tranche sur la planche (police A, B ou C, bichromie ou trichromie,
  intensité du motif). Puis les jetons montent dans `globals.css` et on attaque le prototype du
  ballon.

**15:20** · **[admin] Filigrane, puis les matchs de bout en bout**

L'utilisateur trouve le motif du maillot trop voyant et le veut à peine perceptible. Il passe en
filigrane sur la planche, en trois variantes : contour fin qui s'efface vers les bords, ton sur ton
presque noir, halo façon projecteur. Les choix de la planche restent en suspens, l'utilisateur
devant partir : il m'a demandé d'enchaîner sur ce que je pouvais faire seul.

J'ai pris les matchs de l'administration, que la feuille de route donnait comme indépendants du
visuel. La liste d'une saison met en tête les matchs passés sans score, parce que c'est la relance
qui fait vivre le site. Le calendrier se saisit d'un coup dans une grille, tout ou rien, et la
grille survit à un refus : React vide un formulaire après chaque envoi, et vingt lignes perdues sur
une faute de frappe feraient abandonner la saisie. Une date posée sans heure reprend celle de la
ligne du dessus, et domicile et extérieur alternent d'office.

L'écran de score est pensé pour le gymnase : gros chiffres, clavier numérique, passage automatique
au champ suivant après deux chiffres, un set de plus seulement si le match n'est pas décidé, total
calculé sous les yeux. Il accepte aussi le score final seul. L'analyse distingue ce qui est
impossible, refusé, de ce qui est inhabituel, signalé mais enregistrable : c'est l'ami qui sait ce
qui s'est passé dans la salle.

Deux pièges évités, qui valent d'être écrits. Une heure saisie doit être lue comme heure de Paris,
alors que le VPS tourne en heure universelle : sans conversion, chaque match aurait été décalé.
Et importer le schéma dans un formulaire client aurait embarqué Drizzle dans le navigateur, d'où un
fichier de libellés à part. Premiers tests automatisés du projet, avec l'exécuteur intégré à Node,
sans nouvelle dépendance.

- Portée : `src/lib/score.ts`, `src/lib/rencontres.ts`, `src/lib/etats-rencontre.ts`,
  `src/lib/dates.ts`, leurs tests, `src/app/administration/(interieur)/matchs/`, `src/app/planche/`,
  `package.json` (script `test`), `codex.md`, `ROADMAP.md`.
- Vérifié : 18 tests (sets, score final, heures d'été et d'hiver, dates impossibles), `tsc`, lint,
  `next build`, `/planche` en 404 sur un serveur de production. À l'écran avec ta session de
  développement : liste, score saisi en une frappe continue sur 390 px puis relu en base, refus
  d'un set à égalité sans perte de saisie, calendrier refusé puis accepté (heure 20 h 30 relue
  19:30 UTC en novembre), modification, corbeille, restauration. Les deux matchs de test et un
  compte de vérification créés pour l'occasion ont été supprimés ; le match de démonstration
  contre Sainte-Colombe garde le score saisi pendant le test.
- Suite : l'utilisateur tranche sur la planche (police A, B ou C, bichromie ou trichromie,
  variante du filigrane), puis les jetons montent dans `globals.css` et on attaque le prototype
  du ballon.

**16:05** · **[admin] Épisodes de la série et tableau de bord**

Toujours en autonomie, l'utilisateur m'ayant demandé ce que je pouvais encore avancer seul. Les
épisodes d'abord, parce que la série est le pilier du site et que le schéma était prêt. L'ami colle
le lien de la vidéo tel qu'il le copie, lien de partage, barre du navigateur, Shorts ou direct, et
le site en tire l'identifiant. Seuls les domaines de YouTube sont acceptés : l'identifiant finit
dans un lecteur intégré, il ne doit pas pouvoir venir d'ailleurs. La miniature s'affiche dès que
le lien est reconnu, ce qui dit tout de suite si c'est la bonne vidéo.

Un épisode naît en brouillon et se publie d'un geste séparé, sous le droit de publier. Publier pose
la date du jour si la date de sortie manque. Un épisode lié à un match prend la saison du match,
sinon la saison courante. Le formulaire garde ses champs contrôlés, pour qu'un lien mal collé
n'efface pas un résumé déjà écrit, et repart vide avec le numéro suivant après un ajout.

Le tableau de bord ne dit plus que ce qui attend une action : les scores à saisir, les épisodes en
brouillon, le prochain match. C'est la première page vue à chaque connexion, donc l'endroit où un
score oublié doit se voir.

- Portée : `src/lib/youtube.ts` et son test, `src/lib/episodes.ts`, `src/lib/rencontres.ts`
  (`prochainMatch`), `src/app/administration/(interieur)/episodes/`,
  `src/app/administration/(interieur)/page.tsx`, `ROADMAP.md`.
- Vérifié : 21 tests (dont douze formes d'adresse YouTube et les domaines déguisés), `tsc`, lint,
  `next build`. À l'écran : miniature en direct, ajout en brouillon, formulaire remis à zéro avec
  le numéro suivant, adresse d'un autre domaine refusée sans perte du résumé, brouillon signalé sur
  le tableau de bord, publication (date posée, saison courante), liaison à un match, corbeille.
  L'épisode de test a été supprimé de la base.
- Suite : trancher la planche de style. En autonomie, les actualités ensuite, une fois décidé le
  format du texte (paragraphes simples ou mise en forme légère).

**16:40** · **[admin] Actualités, puis la vitrine du projet**

L'utilisateur a choisi une mise en forme légère pour les actualités, puis le staff, les
partenaires et la chronologie comme chantier suivant.

Le format des actualités est écrit dans le projet : intertitre, gras, italique et lien, rien
d'autre. Aucun paquet ajouté, un analyseur lisible en entier, et un rendu en éléments React qui
n'injecte jamais de HTML : un `<script>` tapé dans le texte s'affiche comme du texte, et seules
les adresses web et de messagerie deviennent des liens. L'éditeur pose la syntaxe par des boutons
et montre l'aperçu avec le composant même que les pages publiques réutiliseront. Le test à l'écran
a trouvé un vrai défaut : un intertitre suivi directement d'un paragraphe s'affichait avec ses
dièses. L'analyseur le détache désormais, puisque c'est ainsi qu'on l'écrit spontanément.

La vitrine du projet est réservée à l'administrateur, sous un droit neuf, `gererProjet` : le plan
ne la confiait pas au rédacteur, c'est ce que le site dit de lui-même. Trois onglets, un ordre
choisi par des boutons monter et descendre plutôt qu'un glisser-déposer, qui se passe mal au doigt
et au clavier, et une liste renumérotée à chaque déplacement. Les étapes naissent en brouillon, les
partenaires se mettent en pause sans disparaître, et leur lien n'accepte qu'une adresse web. Photos
et logos attendent l'envoi vers R2.

- Portée : `src/lib/texte-leger.ts`, `src/components/texte-leger.tsx`,
  `src/components/editeur-texte-leger.tsx`, `src/lib/actualites.ts`, `src/lib/ordre.ts`,
  `src/lib/projet.ts`, `src/lib/slug.ts` (adresse libre factorisée), `src/lib/auth/roles.ts`,
  `src/app/administration/(interieur)/actualites/` et `projet/`, la coquille, le tableau de bord,
  `codex.md`, `ROADMAP.md`.
- Vérifié : 34 tests, `tsc`, lint, `next build`. À l'écran : actualité écrite avec les boutons,
  aperçu (script affiché en texte), brouillon enregistré depuis l'aperçu, publication, extrait sans
  balisage ; étape déplacée puis remise, ajout refusé sans perte de saisie puis accepté ; lien
  `javascript:` d'un partenaire refusé côté serveur. Données de test supprimées, ordre de
  démonstration rétabli.
- Suite : l'utilisateur tranche la planche de style. En autonomie, il reste le classement, les
  comptes et les messages, puis l'envoi d'images vers R2, qui demande le bucket.

**17:55** · **[design] Planche tranchée, système figé**

De retour devant l'écran, l'utilisateur a jugé la planche. Trichromie pour les portraits, jugée
moins violente que la bichromie. Contour pour le filigrane, et le halo gardé pour un seul endroit,
la scène du ballon, où il deviendra mouvement. Il a rappelé qu'un match peut aller au cinquième
set : le tableau de score montre désormais ce cas, le plus large sur un téléphone, et le test a
fait apparaître des scores coupés au tiret, corrigés.

Il n'arrivait pas à choisir la police. La mesure du cinquième set a tranché mieux qu'un goût :
Big Shoulders n'a pas de chiffres à largeur fixe, « 22-25 » y est plus large que « 25-21 », et un
score qui défile bougerait de côté. Archivo retenue, une seule famille pour tout, avec un axe de
largeur qui s'anime. L'administration reste claire, sur les mêmes teintes, avec le turquoise foncé
pour les actions, lisible sur blanc.

Le système est dans `globals.css` : couleurs de nuit et claires, `titre-affiche` et `titre-admin`,
trois largeurs, trois durées et deux courbes partagées avec GSAP. Les quinze écrans
d'administration ont basculé d'un coup, sans toucher à leur logique.

- Portée : `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, les titres de
  `src/app/administration/`, `src/app/planche/tableau-score.tsx`, `veille.md` (section 9),
  `codex.md`, `ROADMAP.md`.
- Vérifié : `tsc`, lint ; cinq sets mesurés sur 375 px avec les trois polices ; administration et
  accueil provisoire vus à l'écran en 1280 px.
- Suite : cadrer puis construire le prototype de la scène du ballon, avec GSAP 3.15.0.

**18:35** · **[motion] Prototype de la scène du ballon**

Cadrée en une salve avec l'utilisateur : une attaque, passe haute puis smash ; un trait fin façon
schéma de coach ; pilotée par le défilement sans bloquer la molette ; le halo révèle le motif du
maillot dans le sillage du ballon, puis le tableau du prochain match s'allume à l'impact.

GSAP 3.15.0 et `@gsap/react` 2.1.2 installés en versions exactes, après lecture des dates de
publication (avril 2026 et janvier 2025) et vérification qu'aucun ne lance de script. Un seul point
d'entrée, `lib/gsap.ts`. Le ballon n'utilise pas l'extension de trajectoire : il est placé à la
main sur trois tracés, ce qui donne au passage sa position exacte pour centrer le halo.

Trois défauts trouvés en regardant, dont deux qu'aucun test n'aurait vus. Le filet en perspective
faisait traverser le ballon à son extrémité lointaine : la marge se vérifie désormais sur toute la
largeur du panneau, par un test, et la frappe est plus haute, ce qui est d'ailleurs plus juste.
Sur téléphone, rien ne s'animait : `gsap.matchMedia()` n'exécute sa fonction que si une condition
au moins est vraie, et ni « grand écran » ni « mouvement réduit » ne l'étaient. Enfin, en
mouvement réduit, la section gardait sa longue course de défilement sans rien à montrer : elle
reprend sa hauteur naturelle.

- Portée : `src/lib/gsap.ts`, `src/components/public/` (scène, géométrie et son test, tableau du
  prochain match), `src/components/motif.tsx` (déplacé depuis la planche), `src/app/prototype/`,
  `package.json`, `package-lock.json`, `ROADMAP.md`.
- Vérifié : 40 tests dont la géométrie des deux cadrages, `tsc`, lint, `next build`, audit de
  production vide. À l'écran en 1440 et 390 px : passe, sommet, frappe, smash, impact et tableau
  allumé, retour en arrière au défilement inverse ; mouvement réduit émulé, état final immédiat et
  section non épinglée.
- Suite : l'utilisateur juge la scène. Puis la fiche de la page d'accueil, où elle prendra place.

**18:55** · **[motion] Scène du ballon, deuxième version**

Retours de l'utilisateur sur le prototype : passe moins en cloche, plus d'étiquettes « Passe » ni
« Attaque », ressentir les deux impacts, un rebond qui sort du champ, un ballon plus gros, et un
déclenchement automatique plutôt qu'un pilotage au défilement.

La scène se joue désormais d'elle-même quand elle est entièrement à l'écran, en moins de deux
secondes, et se rejoue si l'on remonte au-dessus. La longue section épinglée disparaît avec le
pilotage : la page défile normalement. À la frappe, le ballon s'écrase, un éclat part en étoile et
la scène tremble ; au sol, écrasement, trois ondes, secousse plus forte, le sol s'éclaire et le
tableau s'allume en grésillant comme un néon ; puis le ballon rebondit et sort par la droite. Le
rendu serveur est l'état de départ : les tracés portent `pathLength="1"` et se masquent sans être
mesurés, rien ne clignote avant l'animation.

Deux défauts attrapés en figeant la chronologie image par image, ce que permet un accès à GSAP
réservé au développement. La fonction qui enchaîne les temps plaçait tout à la fin de la
chronologie, si bien que le smash serait parti après la fin des effets de frappe : chaque temps
reçoit maintenant sa position. Et changer l'origine d'un même groupe en pleine animation laissait
le ballon décalé de quatorze unités après l'impact : deux groupes d'écrasement, chacun son origine.
Le navigateur de test a aussi bridé les animations à deux images par seconde après un
redimensionnement, page vide comprise : un artefact d'environnement, pas de la scène.

- Portée : `src/components/public/` (géométrie et tests, scène découpée en dessin et animation),
  `src/lib/gsap.ts`, `src/app/prototype/ballon/page.tsx`.
- Vérifié : 44 tests (marge au filet sur toute sa largeur, passe tendue, sortie du cadre), `tsc`,
  lint, `next build`. Chronologie relevée en temps réel en 1440 px (passe, frappe à 0,96 s, sol à
  1,2 s, sortie à 1,9 s, néon), impacts figés à l'image près en 1440 et 390 px, mouvement réduit
  émulé.
- Suite : l'utilisateur juge la deuxième version, puis la fiche de la page d'accueil.

**22:10** · **[motion] Scène du ballon, fluidité**

Trois retours : l'éclat de la frappe « attendait » visible avant la frappe, « Point » devait
partir, et l'utilisateur voulait encore plus de fluidité. Il estime qu'on tient quelque chose.

L'éclat venait d'un comportement de GSAP : `fromTo()` pose son état de départ dès la construction
de la chronologie. L'éclat était donc à opacité pleine dès le chargement, et le sol allumé d'avance.
Ces effets passent en `immediateRender: false`, ils n'existent qu'à leur instant.

Pour la fluidité, le ballon et le halo quittent le SVG pour des calques HTML déplacés par
`translate3d`, avec les setters rapides de GSAP : la carte graphique les fait glisser, là où
déplacer un élément dans un SVG obligeait à repeindre tout le SVG à chaque image. Le halo devient
une fenêtre ronde qui se déplace, avec le motif contre-déplacé dedans pour rester fixe sur le
terrain. Le ballon s'étire dans l'axe du smash, un flou de vitesse dessiné, par trois calques
(orienter, étirer, réorienter). Mesuré en temps réel : 550 images sur le geste, à 240 par seconde,
aucune image perdue, la pire à 8,4 ms.

Un défaut caché trouvé en figeant la chronologie : GSAP arrondit au pixel par défaut, et sur des
tracés normalisés de 0 à 1 le pointillé sautait d'un coup de masqué à complet au lieu de suivre le
ballon. `autoRound: false` sur ces tweens.

- Portée : `src/components/public/ballon-scene.tsx`, `ballon-filet.tsx`.
- Vérifié : 44 tests, `tsc`, lint, `next build` ; éclat à 0 et sol à 0,35 avant la frappe ; tracé
  relevé à 0,94 puis 0,68 pendant le smash ; mesure d'images en temps réel en 1440 px.
- Suite : la scène est validée dans son principe. Fiche de la page d'accueil, où elle prendra
  place sous l'ouverture.

**22:35** · **[cadrage] L'intro de l'accueil, fiche d'ouverture**

Deux retouches sur la scène d'abord : la version téléphone passe d'un cadre 3/4 à 9/10, filet
rapproché de la gauche, et le tableau du prochain match se voit désormais au moment de l'impact.

Puis une proposition de l'utilisateur, qui change l'accueil : ouvrir le site sur le point de
volley, rendu plus riche (tableau de score, public), une exclamation de joie visuelle, puis le
terrain qui se transforme en titre. Jouée une fois par visite. Mon avis a été favorable, avec trois
garde-fous que j'ai posés comme non négociables : quatre secondes au plus, passable dès la première
image, et une fin qui est l'ouverture de la page elle-même plutôt qu'un rideau. Cette intro assouplit
consciemment la règle « pas d'écran de chargement » ; ces garde-fous sont ce qui la rend tenable.

Arbitrages : une fois par visite (session du navigateur) ; à l'impact, le tableau passe de 24-23 à
25-23 et un public en points bondit ; l'utilisateur a refusé le motif qui éclate à l'écran et
proposé de le faire vivre dans le public, en bandeau, que je lis comme le bandeau LED de la salle ;
l'intro devient l'ouverture ; la scène du ballon sous l'ouverture disparaît au profit d'un bloc
prochain match, pour ne pas jouer deux fois le même geste. MorphSVG, DrawSVG et SplitText sont
vérifiés présents dans GSAP 3.15.0 installé : rien à ajouter pour l'animation.

- Portée : `fiches/accueil-ouverture.md` (nouveau), `src/components/public/` (cadrage téléphone).
- Vérifié : 44 tests ; cadrage téléphone vu à l'écran en 390 px ; présence des extensions de GSAP
  lue dans `node_modules`.
- Suite : l'utilisateur valide la fiche d'ouverture, en particulier la lecture « bandeau LED », puis
  on construit l'intro sur `/prototype/ballon` avant de l'installer sur l'accueil.

**23:35** · **[motion] L'intro de l'accueil, premier prototype complet**

Fiche validée par l'utilisateur, « bandeau LED » compris. Construite sur `/prototype/ouverture` :
la salle se trace, le tableau affiche 24-23 (balle de set), le point se joue avec le geste du
prototype, le score roule à 25, le public en points bondit, le bandeau s'emballe, puis les lignes du
terrain se transforment en « PROJET VOLLEY », qui reste en place comme ouverture. 3,8 s, passable
à tout moment, une fois par visite.

Le geste a d'abord été extrait dans `ballon-geste.ts` et le terrain dans `Terrain`, partagés avec
la scène du prototype, vérifiée sans régression au centième. Le titre est converti en tracés par
`scripts/titre-en-traces.py` (fontTools 4.65.0, épinglé sous la règle des quinze jours, dans un
environnement Python isolé, sans aucune dépendance npm) : relancer le script suffira le jour du vrai
nom. Les lettres de « PROJET » naissent de la trajectoire, celles de « VOLLEY » du sol, par un
découpage testé.

Le serveur rend l'état final ; un script en ligne décide avant le premier affichage si l'intro joue,
d'où zéro image parasite pour un visiteur qui l'a déjà vue. Un filet de sécurité CSS rétablit l'état
final au bout de six secondes si le JavaScript échoue. Un défaut trouvé : en développement, React
exécute l'effet deux fois, et le second passage relisait la ligne de départ comme cible, le titre ne
bougeait plus. Les cibles viennent désormais du fichier généré, jamais du DOM.

- Portée : `src/components/public/intro/` (nouveau), `ballon-geste.ts`, `ballon-scene.tsx`,
  `ballon-filet.tsx`, `titre-traces.ts` (généré), `scripts/titre-en-traces.py`, `src/lib/gsap.ts`
  (DrawSVG, MorphSVG), `globals.css`, `layout.tsx`, `src/app/prototype/ouverture/`.
- Vérifié : 57 tests, `tsc`, lint, `next build`. En 1440 px : lecture complète 3,8 s, 896 images
  sans perte (pire 12,6 ms) ; visiteur qui revient sans aucune classe d'intro ; « Passer » en 58 ms
  vers l'état final ; tableau, joie et titre final vus figés. En 390 px : joie et titre final vus.
- Suite : l'utilisateur regarde l'intro (bouton « Rejouer l'intro » en bas du prototype) et sur son
  téléphone. Puis l'installer sur l'accueil, et le bloc prochain match simple à la place de la scène.

**00:15** · **[perf] Intro plus légère au démarrage, motif du maillot corrigé**

Mesure demandée par l'utilisateur, faite sur un build de production local, au processeur bridé six
fois (Android d'entrée de gamme) : environ 315 Ko transférés au premier chargement (socle React et
Next 144 Ko, police 88 Ko, intro 57 Ko, HTML 14 Ko), premier affichage sous 0,35 s, intro fidèle à
3,8 s. Un seul défaut perceptible : un accroc au démarrage, deux blocages de 64 et 87 ms.

Deux causes traitées. Le public était animé point par point, plus de cinq cents animations à
préparer : il bondit désormais par dix-huit groupes (rang et portion de tribune), en ordre
aléatoire. Et en regardant où tombaient les saccades, un défaut plus gênant est apparu : le serveur
montrait la salle dessinée, puis l'animation l'effaçait pour la retracer, d'où un flash sur
téléphone lent. La salle est maintenant rendue en veilleuse et s'allume : la première image de
l'intro est celle déjà affichée. Le tracé progressif et l'extension DrawSVG disparaissent. Résultat
mesuré trois fois : plus aucun blocage au-dessus de 50 ms, opacité du public strictement croissante
depuis la première image, saccades résiduelles toutes dans la demi-seconde de démarrage de la page,
salle immobile.

L'utilisateur trouvait le motif du bandeau méconnaissable. Relevé sur la photo : le maillot n'est
pas fait de losanges fendus mais de carrés coupés en deux par une diagonale, orientés différemment.
Le composant `Motif` est réécrit sur ce modèle, ce qui corrige d'un coup le bandeau, le filigrane et
le halo ; le bandeau passe en motif plein, comme le tissu.

- Portée : `src/components/motif.tsx`, `src/components/public/intro/`, `ballon-scene.tsx`,
  `globals.css`, `src/lib/gsap.ts`, la planche et le prototype du ballon (nouvelle API du motif).
- Vérifié : 57 tests, `tsc`, lint, `next build` ; trois mesures au processeur bridé sur build de
  production (ouverture temporaire des prototypes, retirée après) ; bandeau vu en gros plan.
- Suite : l'utilisateur juge le nouveau motif et l'allumage de la salle. Puis installer l'intro sur
  l'accueil avec le bloc prochain match branché sur la base.

## 30-09-2026

**00:25** · **[motion] La balle de set respire**

L'utilisateur aime l'intro mais la trouvait trop pressée : on n'avait pas le temps de voir le
24-23, qui est tout le suspense. « Balle de set » pulse désormais deux fois sur le tableau et la
passe ne part qu'à la première seconde ; la transformation en titre, un peu plus serrée, garde le
total à 3,9 s, sous les quatre secondes promises par la fiche.

En mesurant la durée, un défaut caché : le public bondissait en quatre vagues successives pendant
2,3 s, bien après la fin de l'intro. Un `repeat` posé à côté d'un échelonnement répète toute la
vague ; placé dans l'échelonnement, il répète chaque groupe. Corrigé, la joie tient en une seconde.

- Portée : `src/components/public/intro/animation-ouverture.tsx`, `fiches/accueil-ouverture.md`.
- Vérifié : 57 tests, `tsc`, lint ; durée mesurée en temps réel à 3,86 s (chronologie 3,90 s),
  l'élément le plus tardif identifié avant et après correction.
- Suite : installer l'intro sur l'accueil, avec le bloc prochain match branché sur la base.

**00:30** · **[cadrage] La palette est à revoir en premier**

Fin de séance. L'utilisateur est content de l'intro pour une première version, et pose la priorité
de la prochaine séance : la palette, qu'il trouve « beaucoup trop site IA ». Fond nuit bleuté,
turquoise lumineux, lueurs de néon : c'est le réflexe générique des sites sombres produits en
série, et il a raison de le relever. La palette avait été tirée du maillot, mais le choix du fond
nuit et de l'éclat turquoise ravivé l'a tirée vers ce cliché.

À cadrer d'abord, avant l'installation de l'intro sur l'accueil : elle touche le site public,
l'intro, l'administration et la planche, qui partagent les mêmes jetons dans `globals.css`, donc un
changement se fera en une fois.

- Portée : `ROADMAP.md`, `carnetdebord.md`.
- Vérifié : rien à vérifier, aucun code dans cette entrée.
- Suite : cadrer la palette en salve de questions (fond clair ou sombre, couleurs du maillot
  gardées ou non, références qui ne ressemblent pas à un site généré), puis la décliner dans
  `globals.css`.

**10:25** · **[design] La palette devient un programme de match imprimé**

Première séance consacrée à la palette jugée « trop site IA ». Deux salves de questions ont fixé
le cap : fond papier clair, teintes réelles du maillot sans les raviver, jaune du ballon en
accent, univers d'imprimé sportif, encre violette pour le texte, grain très léger,
administration sur les mêmes jetons sans matière.

L'utilisateur m'a arrêté avant l'application : la méthode des trois casquettes n'avait pas été
suivie, je proposais des teintes sans veille ni fiche. Rattrapé par trois veilles parallèles
(imprimé sportif, sites actuels à fond clair, codes du volley), triées dans `veille.md` section
10, puis une fiche `fiches/palette.md` validée. La veille a corrigé trois choses : un papier moins
jaune pour éviter le sépia, un ocre pour le jaune en petit, et l'abandon du vert et du rouge des
résultats, remplacés par une pastille pleine ou en contour. L'utilisateur a ajouté une fonction
par couleur (turquoise l'équipe, violet les matchs, jaune le direct).

L'intro validée n'est pas perdue : étiquette `intro-nuit-v1`, dossier `intro-nuit/`, et une
classe `.palette-nuit` qui lui garde ses couleurs. Deux écarts assumés à la fiche : un jeton
`erreur` pour les erreurs de saisie de l'administration, et un jeton `champ`, papier presque
blanc, pour les champs qui étaient en blanc pur. Une lecture de la veille a renvoyé une phrase
adressée à un agent (site de Perugia) : ignorée, référence écartée.

- Portée : `globals.css`, `fiches/palette.md`, `veille.md`, planche réécrite, tableau du prochain
  match, `pastille-resultat.tsx`, administration (messages, champs, bandeau de démonstration),
  intro déplacée dans `intro-nuit/`.
- Vérifié : 57 tests, `tsc`, lint, `next build` ; à l'écran la planche en 1440 et 390 px (aucun
  défilement horizontal), l'accueil et les matchs de l'administration en 390 px.
- Suite : l'utilisateur juge la planche à l'écran (la pastille de résultat sur le violet est à
  trancher). Puis la fiche de la nouvelle intro, salle dessinée à l'encre sur papier.

**11:35** · **[design] Version 2 : le gymnase le soir**

La palette papier n'a pas passé l'écran. L'utilisateur aimait le style de la veille, moderne,
limite néon, et le tableau du prochain match, jugé plus réel. Son reproche du matin ne
visait que l'air de site généré, et je l'avais lu comme un rejet du sombre : mes quatre
recommandations de la première salve fuyaient toutes la nuit. Leçon notée en mémoire.

Recadrage en une salve : on revient au sombre, mais réel. Deux veilles parallèles (le vrai
matériel de gymnase, les sites sombres qui ne font pas générés, `veille.md` section 11) ont donné
le diagnostic : la palette du 29-09 cochait cinq des six signes du sombre généré. Le bleu nuit
devient un noir violacé tiré du maillot, le cyan ravivé redevient le turquoise réel (qui se lit
tel quel sur ce noir, 5,8 pour 1), et la lumière ne vit plus que sur trois objets : le tableau,
le bandeau LED, le ballon. Survol par inversion, focus jaune, plus de verre dépoli.

Le tableau revient en LED ambre, dessinées en SVG : chaque segment est une rangée de points,
comme sur les tableaux Bodet, et les segments éteints restent visibles. Première version trop
espacée, illisible à taille réelle pour les chiffres à peu de segments : points resserrés,
segments éteints assombris. L'intro passe à la nuit réelle sans changer un geste ; défaut trouvé
à l'écran, les scores empilés 24 et 25 s'affichaient côte à côte, corrigé. L'administration passe
de nuit elle aussi, par cohérence, décision de l'utilisateur. La version 1 reste dans l'historique
(`c4d89e2`), l'intro d'origine sous l'étiquette `intro-nuit-v1`.

- Portée : `globals.css`, `fiches/palette.md` (version 2), `veille.md`, `afficheur-led.tsx`
  (nouveau), tableau du prochain match, intro (`salle.tsx`, bouton passer), ballon, planche,
  administration (bascule des jetons dans 38 fichiers).
- Vérifié : 57 tests, `tsc`, lint, `next build` ; à l'écran la planche en 1440 px, le tableau LED
  en gros plan et à taille réelle, l'intro au début, au point marqué et à la fin, les matchs de
  l'administration en 390 px.
- Suite : l'utilisateur juge la version 2 à l'écran (planche, intro, administration). Puis
  installer l'intro sur l'accueil avec le bloc prochain match branché sur la base.

**12:10** · **[design] Modernité : variantes à comparer, et les résultats refaits**

Retour de l'utilisateur sur la version 2 : le tableau du prochain match plaît beaucoup, mais
l'ensemble a perdu en modernité, et la liste des derniers résultats ne convainc pas. Diagnostic
demandé plutôt que deviné, cette fois : couleurs trop ternes, texte crème à l'effet rétro, mise
en page trop sage. Le reste (la lumière réservée aux objets lumineux) n'est pas en cause.

Plutôt que trancher sur description, la planche porte un sélecteur de quatre variantes appliquées
à toute la page : l'actuelle, « éclat » (turquoise `#2ec4b6` plus vert que le cyan du 29-09,
violet `#7d4fc4`), « net » (blanc d'écran `#f5f6f7`, noir plus profond `#0e0c11`), et les deux
ensemble. Contrastes vérifiés pour chacune.

Les résultats sont refaits : le dernier match a son tableau LED (`tableau-resultat.tsx`), frère
de celui du prochain match, les deux côte à côte ; les précédents défilent en cartes pleine
largeur avec un score géant, plein pour une victoire, en contour pour une défaite, la grammaire
de la pastille. Premier pas contre la mise en page trop sage.

- Portée : `planche/` (sélecteur, variantes, chapitre des matchs), `tableau-resultat.tsx` et
  `resultats-precedents.tsx` (nouveaux).
- Vérifié : 57 tests, `tsc`, lint ; à l'écran en 1440 px la planche en variante actuelle et
  « éclat et net ».
- Suite : l'utilisateur choisit une variante sur la planche ; je la reporte dans les jetons de
  `globals.css` et dans la fiche palette, puis j'installe l'intro sur l'accueil.

**12:30** · **[design] Variante « net » retenue, glow des LED renforcé**

L'utilisateur a comparé les variantes à l'écran et penchait pour « net », puis m'a demandé mon
avis. J'ai suivi ce choix, avec une réserve : le blanc net sur un noir profond règle l'effet rétro et
fait la modernité par le contraste, sans raviver le turquoise vers le cyan qu'on a quitté ; mais
le turquoise sourd en grand aplat restait terne. Décision : « net », turquoise en accent (un mot,
un filet, le motif), plus de bandeau turquoise pleine largeur.

Autre demande, un glow plus présent sur les chiffres LED : trois couches, du cœur saturé à
une diffusion large et faible qui éclaire le boîtier. Toujours réservé aux tableaux. Le
sélecteur de variantes est retiré de la planche, il a rempli son rôle.

- Portée : `globals.css`, `afficheur-led.tsx`, planche (bandeau de l'équipe, nuancier),
  `fiches/palette.md`, `codex.md`.
- Vérifié : `tsc`, lint ; à l'écran en 1440 px, le glow sur les deux tableaux et le chapitre de
  l'équipe en accent turquoise.
- Suite : installer l'intro sur l'accueil, avec le bloc prochain match et le dernier résultat
  branchés sur la base.

**13:20** · **[page] L'accueil branché sur la base**

Autonomie accordée à 13:03, avec la consigne de tenir les trois casquettes. Veille ciblée d'abord
(`veille.md` section 12) : sept accueils de clubs ouverts dans un navigateur. Deux places à
prendre en sont sorties, personne n'intègre bien un épisode et personne ne met l'itinéraire à
côté du prochain match, et trois contre-exemples d'états vides ratés. Puis la fiche
`fiches/accueil.md`, puis le code.

Sous l'ouverture, deux rendez-vous et une mémoire. La série : le dernier épisode, vignette
traitée comme les portraits, lecteur YouTube chargé au clic seulement. Les matchs : prochain
match et dernier résultat côte à côte en tableaux LED, qui s'allument avec un scintillement
quand on arrive devant, puis « Ajouter à l'agenda » (fichier `.ics` servi par une route à nous)
et « Itinéraire ». Enfin les matchs précédents en cartes défilantes. Le compte à rebours tourne
dans le navigateur et affiche « C'est parti » au coup d'envoi, la parade au compteur figé à 00
relevé par la veille. Actualités et partenaires attendent leurs pages : une carte qui ne s'ouvre
sur rien ferait pire que son absence.

La route d'agenda est un point d'entrée public : revue adversariale à la main, onze sondes
(slug inventé, match passé, injection d'en-tête, remontée de dossier, apostrophe, caractère de
contrôle Unicode, slug de 300 caractères, POST). Toutes refusées proprement. Un faux départ en
chemin : le serveur de développement avait planté après un `next build` lancé en parallèle, d'où
des 500 sans rapport avec le code ; redémarré, tout répond.

- Portée : `src/app/page.tsx`, `src/app/agenda/`, `src/components/public/accueil/`,
  `lecteur-episode.tsx`, `compte-rebours-led.tsx`, les deux tableaux et les cartes,
  `lib/accueil.ts`, `lib/resultats.ts`, `lib/agenda.ts` (et leurs tests), `lib/site.ts`.
- Vérifié : 70 tests (13 nouveaux), `tsc`, lint ; à l'écran l'accueil en 1440 et 390 px avec les
  données de démonstration (deux défauts mobiles corrigés : bouton sur deux lignes, noms coupés) ;
  la route d'agenda sondée. Pas encore vérifiés à l'écran : les états vides (aucun épisode, aucun
  match), couverts par la logique testée mais pas provoqués en base.
- Suite : obtenir l'adresse de la chaîne YouTube ; puis la page Matchs et la page d'un match.

**13:30** · **[revue] Critique à froid de l'accueil, et ses corrections**

Un agent qui n'avait pas construit la page l'a critiquée à trois casquettes, au navigateur, au
clavier et en mouvement réduit. Il a trouvé un défaut bloquant que je n'avais pas vu : les
révélations au défilement passaient les blocs en `visibility: hidden`, si bien qu'au chargement
la touche Tab n'atteignait aucun lien et qu'un lecteur d'écran ne lisait rien. Corrigé : on
n'anime plus que l'opacité et la position, et un bloc qui reçoit le focus se révèle aussitôt.
Mesuré ensuite : les six éléments interactifs sont joignables, chaque bloc apparaît au focus.

En corrigeant, deux pièges de plus. La scène du ballon de l'intro portait déjà un attribut
`data-revele` : mon composant l'attrapait aussi, au risque de dérégler l'intro validée ; mes blocs
prennent `data-apparait`, cherché dans la seule zone de l'accueil. Et tuer un déclencheur de
défilement dans GSAP tue l'animation qu'il pilote, sauf `kill(false, true)`. Un faux positif
aussi : le navigateur partagé était resté en mouvement réduit après les sondes de l'agent.

Le reste de la critique, appliqué : une seule règle de lecture des scores (locaux d'abord, comme
au gymnase) avec Victoire ou Défaite en toutes lettres ; le match reste trois heures au tableau
après le coup d'envoi, « Match en cours » ; la vignette de l'épisode perd son aplat turquoise ;
« Voir sur YouTube » passe en jaune tant que la chaîne manque ; contours des boutons secondaires
à 5,8 pour 1 ; focus donné au lecteur après le clic ; plus de téléchargement forcé pour l'agenda,
et un lien Google Agenda en secours ; texte lu du compte à rebours qui suit les chiffres ; icône
d'onglet ; route d'agenda non indexée.

Laissé pour plus tard : le vide en haut de l'ouverture à l'état final (intro validée, à ne pas
retoucher sans l'utilisateur), l'heure et le slug des données de démonstration (le semis
n'utilise pas le fuseau de Paris), la mesure de performance sur un vrai build et un téléphone
d'entrée de gamme.

- Portée : `accueil/revelations.tsx`, les tableaux, les cartes, `bloc-serie.tsx`,
  `bloc-tableaux.tsx`, `lecteur-episode.tsx`, `lib/resultats.ts`, `lib/agenda.ts`,
  `lib/accueil.ts`, la route d'agenda, `app/icon.svg`.
- Vérifié : 74 tests, `tsc`, lint ; au navigateur, le parcours clavier et l'état des blocs avant
  et après focus, le rendu du chapitre des matchs en 1440 px.
- Suite : l'adresse de la chaîne YouTube ; puis la page Matchs et la page d'un match.

**14:55** · **[identité] Le site s'appelle Point Par Point**

L'utilisateur a donné le vrai nom, celui de la série : « Point Par Point », et l'adresse de la
chaîne YouTube. Le nom est posé dans `lib/site.ts`, et les tracés du titre de l'intro sont
régénérés par le script prévu pour ce jour-là (fontTools 4.65.0, déjà vérifié à la première
génération, dans un environnement isolé du dossier temporaire ; police Archivo du dépôt Google
Fonts). Treize lettres par mise en page, sur trois lignes au téléphone. Le bouton « S'abonner »
apparaît. La mémoire de l'intro change de clé : chacun la reverra une fois avec le nouveau titre.

En vérifiant, le titre restait invisible à la fin de l'intro. L'enquête a montré que le
navigateur de test tournait à 3 images en 2 secondes (fenêtre masquée, machine à court de
mémoire) : GSAP ralentit alors l'intro plutôt que de sauter des images, et le filet de sécurité
CSS affichait la fin avec des lettres encore sous leur forme de départ. Pas un défaut du nouveau
titre, mais un vrai trou pour un appareil saturé : une garde en temps réel fait désormais sauter
l'intro à sa fin après 6 secondes, comme le bouton « Passer ». Vérifié dans ce navigateur bridé :
titre complet sans intervention.

Le dossier `ProjetVolley` et le dépôt `ValVoy/projet-volley` gardent leur nom : les renommer
touche le dépôt distant et les chemins, c'est à l'utilisateur de le décider.

- Portée : `lib/site.ts`, `titre-traces.ts` (régénéré), `scripts/titre-en-traces.py`,
  `intro-nuit/script-intro.ts` et `animation-ouverture.tsx`, `lib/agenda.ts`, la route d'agenda,
  planche, prototype, semis de démonstration, `CLAUDE.md`, `ROADMAP.md`, `PLAN.md`.
- Vérifié : 74 tests, `tsc`, lint ; titre à l'écran en 1440 et 390 px ; garde vérifiée dans un
  navigateur à 1,5 image par seconde.
- Suite : décision de l'utilisateur sur le renommage du dossier et du dépôt ; la page Matchs et
  la page d'un match.

**15:40** · **[page] Le calendrier et la page d'un match**

Veille d'abord (`veille.md` section 13) : six calendriers et pages de match ouverts dans un
navigateur, dont un contre-exemple parlant, un club de Ligue A qui publie tout son calendrier en
une image sans texte. Puis la fiche `fiches/matchs.md`, puis le code.

Le calendrier : le bilan collectif de la saison, le prochain match en tableau LED avec ses
actions, et une seule liste par mois avec un filet « Aujourd'hui ». Chaque ligne suit la
grammaire relevée chez la Premier League : un seul emplacement qui porte l'heure avant le match,
le score après, ou l'état en toutes lettres. Les lignes restent mates, la lumière est réservée
aux tableaux. La page d'un match : l'état commande l'ordre des blocs, et un match joué met sa
salle et son commentaire à côté du tableau pour équilibrer le grand écran.

Arbitrages faits seul : la saison passe en paramètre (`?saison=`) et non en chemin, qui serait
entré en collision avec les adresses des matchs ; l'abonnement d'agenda à la saison, la carte
statique et la transition animée liste → match sont reportés, notés dans la fiche. Le serveur de
développement est tombé deux fois sur des routes dynamiques : mesure faite, il ne restait que 1,9
Go de mémoire libre sur 32 ; redémarré, tout répond.

- Portée : `src/app/matchs/`, `src/components/public/matchs/`, `entete.tsx`,
  `actions-match.tsx` (extrait de l'accueil), `lib/calendrier.ts`, `lib/matchs-publics.ts`,
  `lib/dates.ts` (heure à la française), `tableau-resultat.tsx` (étiquette), lien depuis l'accueil.
- Vérifié : 82 tests, `tsc`, lint ; à l'écran le calendrier et les pages de match joué, à venir et
  reporté (état provoqué en base de développement puis remis) en 1440 et 390 px ; 404 sur un slug
  inconnu. Pas vus à l'écran : « score à venir » et « annulé » (logique testée).
- Suite : critique à froid des deux pages, puis la série.

**16:00** · **[revue] Critique à froid des matchs, et ses corrections**

Rien de bloquant, mais un défaut qui aurait coûté cher le jour venu : l'administration recalcule
l'adresse d'un match à chaque modification, pour qu'une faute corrigée ne reste pas dans l'URL,
si bien qu'un match reporté changeait d'adresse et que les liens déjà partagés tombaient en 404.
Plutôt que figer l'adresse, une table `anciens_slugs_rencontre` (migration additive
`0002_anciens-slugs`, appliquée en développement) garde les anciennes adresses et la page redirige
en 308. Testé par une ancienne adresse insérée puis retirée.

L'ordre du score opposait les deux critiques : l'utilisateur a tranché, notre score d'abord dans
les listes (calendrier et cartes de l'accueil), l'ordre du gymnase dans les tableaux, où les noms
sont écrits au-dessus des chiffres. Le reste : l'épisode remonte sous le tableau, le tableau prend
la largeur quand rien ne l'accompagne, le filet « Aujourd'hui » devient un vrai séparateur entre
les mois, la salle a son bloc pour un match à venir, date en double retirée, lien « Aller au
contenu », titre d'onglet corrigé, adresse vérifiée par expression avant la base, une requête de
moins, miniature prioritaire, et l'allumage des tableaux sans délai. Le semis de démonstration
prend la date de Paris et une heure réaliste (20 h 30) ; démonstration purgée puis ressemée.

- Portée : `lib/db/schema/sportif.ts`, `drizzle/0002_anciens-slugs.sql`, `lib/demo.ts`, l'action
  de modification d'un match, `lib/matchs-publics.ts`, les deux pages de matchs, les composants de
  matchs et de résultats, `layout.tsx`, `revelations.tsx`, `scripts/semer-demo.ts`.
- Vérifié : 82 tests, `tsc`, lint ; redirection 308, 404 sur une adresse inconnue ou mal formée ;
  à l'écran le calendrier en 390 px et un match joué avec épisode en 1440 px.
- Suite : la série, liste des épisodes et page d'un épisode.

**16:15** · **[page] La série**

Veille d'abord (`veille.md` section 14) : six sites de séries sportives ouverts, dont deux
primés en 2026. Aucun ne relie un épisode au match qu'il raconte, même « Welcome to Wrexham » qui
les nomme dans ses synopsis : c'est l'avantage du site, et il fonctionne dans les deux sens. Puis
la fiche `fiches/serie.md`, puis le code.

La liste : l'accroche et l'abonnement en jaune, le dernier épisode en vedette avec « Nouveau », les
autres en liste numérotée, le grand numéro rythmant la page comme un numéro de maillot. La page
d'un épisode : le lecteur au clic, le titre et le résumé, le match raconté en tableau LED avec
« Voir le match », une carte d'abonnement après le visionnage, les épisodes voisins. L'adresse
d'un épisode suit son titre : même parade que pour les matchs, table `anciens_slugs_episode`
(migration additive 0003, appliquée en développement) et redirection 308, testée.

Deux retenues volontaires : pas de durée ni de chapitres, faute de donnée en base ; et une
accroche neutre, après avoir retiré en relecture des phrases qui promettaient un contenu (les
vestiaires, un épisode après chaque temps fort) que personne n'a validé.

- Portée : `src/app/serie/`, `src/components/public/serie/`, `lib/serie.ts`, schéma éditorial et
  migration 0003, action de modification d'un épisode, purge de démonstration, `entete.tsx`,
  liens depuis la page d'un match et l'accueil.
- Vérifié : 82 tests, `tsc`, lint ; à l'écran la liste en 1440 et 390 px, un épisode en 1440 px ;
  en-tête mesurée à 375 px sans débordement ; redirection 308 d'une ancienne adresse ; 404.
- Suite : critique à froid de la série, puis l'effectif.

**16:35** · **[revue] Critique à froid de la série, et ses corrections**

Un point bloquant : le focus clavier du bouton de lecture était invisible. En le corrigeant, deux
causes empilées, instructives pour tout le site. La règle de focus de `globals.css` était écrite
hors des couches de Tailwind, et une règle hors couche l'emporte sur toutes les classes
utilitaires : aucun anneau ne pouvait être ajusté, ni ici ni sur la rangée des résultats de
l'accueil, dont la correction de la veille n'avait donc jamais pris. Elle passe dans
`@layer base`. Et l'anneau replié dans le cadre était peint sous la vignette, positionnée : le
cadre de focus est maintenant un calque au-dessus d'elle. Vérifié à la vraie touche Tab, gros plan
à l'appui.

Le reste : vignettes en haute définition avec repli (`MiniatureEpisode`, 950 pixels servis au
lieu de 455), image de partage pour les réseaux sur chaque épisode, bouton lecture jaune sur
l'épisode vedette, page d'épisode en deux colonnes avec le titre au-dessus du lecteur, libellés
qui ne disent jamais « Épisode null », tri par date de publication, « Publié le » devant les
dates, noms de liens explicites, surtitres harmonisés, redirection des adresses en majuscules.

- Portée : `globals.css`, `lecteur-episode.tsx`, `miniature-episode.tsx` (nouveau),
  `lib/youtube.ts`, `lib/serie.ts`, les deux pages de la série, `bloc-serie.tsx`,
  `blocs-match.tsx`, page d'un match.
- Vérifié : 82 tests, `tsc`, lint ; au navigateur l'anneau au clavier, la vignette HD, la balise
  `og:image`, la page d'épisode en 1440 px.
- Suite : l'effectif, grille par poste et page d'un joueur.

**16:45** · **[page] L'effectif**

Veille d'abord (`veille.md` section 15) : six clubs ouverts, dont trois qui publient la date de
naissance complète de leurs joueurs, et un club de Ligue A dont l'adresse d'un ancien joueur
affiche un nouveau. Aucun ne traite l'absence de photo. Puis la fiche `fiches/effectif.md`, puis
le code.

La grille : un groupe par poste dans l'ordre de présentation d'une équipe, des cartes toutes
égales, ni vedette ni compteur, un « C » discret pour le capitaine. Sans photo, le grand numéro
sur le motif du maillot fait portrait ; avec une photo, elle se posera en surimpression turquoise
(aucune gestion de photo n'existe encore, le composant est prêt). La page d'un joueur : identité,
âge et taille, présentation, parcours, les matchs de la saison où il était sur le terrain avec le
résultat de l'équipe, puis l'effectif par numéro. Aucun chiffre individuel au premier lot.

L'utilisateur a tranché : prénom et nom complet. L'âge seulement, jamais la date de naissance.
Reste à vérifier avant la mise en ligne que l'accord de droit à l'image couvre le site.

- Portée : `src/app/effectif/`, `src/components/public/effectif/`, `lib/effectif-public.ts`,
  `lib/postes.ts` (regroupement testé), `lib/dates.ts` (âge à instant donné), `entete.tsx`.
- Vérifié : 83 tests, `tsc`, lint ; à l'écran la grille en 1440 et 375 px (en-tête à trois
  rubriques sans débordement) et la page d'un joueur en 1440 px ; 404 sur un joueur inconnu.
- Suite : critique à froid de l'effectif.

**17:00** · **[revue] Le staff, et la critique à froid de l'effectif**

L'utilisateur a relevé l'absence du staff : je l'avais renvoyé à une future page « L'équipe
derrière ». Il ferme désormais la page de l'effectif (rôle, nom, présentation, photo si fournie),
dans l'ordre choisi dans l'administration.

La critique à froid, sans point bloquant, a surtout touché juste sur la chaleur : des groupes de
deux ou trois joueurs sur quatre colonnes laissaient la moitié droite vide, et le premier nom
tombait sous la ligne de flottaison. Recomposition : une grille continue dans l'ordre des postes,
le poste écrit au-dessus de chaque nom, des portraits plus bas, le motif lisible en turquoise, une
accroche collective ; la page passe de 3 444 à 1 549 pixels. Le reste : numéro toujours lu par les
lecteurs d'écran, effet du survol aussi au focus, traitement photo en noir et blanc avec un filet
turquoise (plus d'aplat teinté), compteur « 4 matchs » retiré (chiffre individuel), saison
indiquée pour un joueur d'une saison passée, sigle de poste sans numéro, initiale du nom dans les
raccourcis, redirection des majuscules seulement si la page existe (matchs, série, effectif).
Point ajouté à la mise en ligne : un joueur mineur demande l'accord de ses parents.

- Portée : `src/app/effectif/`, `src/components/public/effectif/` (dont `cartes.tsx`), pages de
  match et d'épisode, `fiches/effectif.md`.
- Vérifié : 83 tests, `tsc`, lint ; à l'écran la grille avec staff en 1440 et 390 px ; 404 sans
  redirection pour une adresse inconnue en majuscules.
- Suite : les actualités, puis les pages « Le projet », « Où nous voir », partenaires, contact et
  les mentions légales.

**17:20** · **[page] Les actualités**

Veille d'abord (`veille.md` section 16) : six sites mesurés dans leurs styles calculés. Ce qui en
sort pour la lecture sur fond sombre : un corps de 18 px, un interlignage plus ample que sur fond
clair, 60 à 68 caractères par ligne, pas de blanc pur. Et deux échecs répétés : des articles sans
date visible, et des rubriques vides ou périmées (celle d'un club de Ligue A est entièrement vide).

La liste : la plus récente en grand, les autres en liste datée d'une colonne, et une rubrique vide
qui renvoie vers les matchs et la série. L'article : date en toutes lettres, chapô distinct, corps
dans une colonne de 612 pixels réglée par une classe `texte-article` (18 px, interlignage 1,7,
craie de lecture à 13,6 pour 1, liens turquoise clair soulignés), partage natif ou copie du lien
sans aucun script tiers, articles voisins. Sur l'accueil, un bloc de trois actualités, masqué si
la plus récente a plus de quatre-vingt-dix jours. L'adresse d'une actualité suit son titre :
troisième table d'anciennes adresses (migration additive 0004) et redirection 308.

L'en-tête compte quatre rubriques : sur téléphone, elles passent sous le nom du site ; le pied de
page les reprend toutes. Un titre d'affiche géant débordait de l'écran au téléphone : tailles
réduites d'un cran et césure française. Débordement mesuré à 375 px sur les six pages publiques :
aucun.

- Portée : `src/app/actualites/`, `src/components/public/actualites/`, `bloc-actualites.tsx`,
  `lib/actualites-publiques.ts`, schéma éditorial et migration 0004, action de modification d'une
  actualité, purge de démonstration, `entete.tsx`, `pied-de-page.tsx`, `globals.css`.
- Vérifié : 83 tests, `tsc`, lint ; à l'écran la liste et un article en 1440 px, la liste en 375
  px, le bloc de l'accueil ; débordement à 375 px sur six pages.
- Suite : critique à froid des actualités, puis « Le projet », « Où nous voir », partenaires,
  contact, mentions légales.

**17:40** · **[retour] La grille de l'effectif par poste, rétablie**

L'utilisateur préférait la grille d'avant, une section par poste avec de grandes cartes au
numéro géant : « un vrai choix identitaire ». Je l'avais remplacée par une grille continue sur la
foi de la critique à froid, qui mesurait du vide et une page trop haute. Rétablie, en gardant ce
qui ne touche pas à ce choix : le staff, l'accroche collective, le numéro lu par les lecteurs
d'écran, l'effet du focus. Leçon notée en mémoire : un défaut se corrige seul, un choix de
composition se propose d'abord.

- Portée : `src/app/effectif/page.tsx`, `src/components/public/effectif/cartes.tsx`.
- Vérifié : `tsc`, lint ; la page en 1440 px.
- Suite : critique à froid des actualités (en cours), puis « Le projet », « Où nous voir »,
  partenaires, contact, mentions légales.

**17:55** · **[revue] Critique à froid des actualités, et ses corrections**

Rien de bloquant, et rien qui touche à un choix d'identité : tout est corrigé sans détour, selon
la règle posée une heure plus tôt. Le plus sérieux : sur ordinateur, « Partager » ouvrait la
feuille de partage de Windows au lieu de copier le lien, sans repli en cas d'erreur ; le partage
natif est désormais réservé aux écrans tactiles, la copie a son message d'échec. La colonne de
lecture comptait 69 à 74 caractères pour une cible de 60 à 68 : 31 em, environ 65. Le pied de
page lit lui-même la saison courante, identique sur toutes les pages. Le reste : hiérarchie des
titres en haut de la liste, dates balisées, titres de liste en `h3`, flèches muettes pour les
lecteurs d'écran, mots longs coupés, liens vers le site lui-même dans le même onglet, ancienne
adresse en majuscules redirigée, plus de corps d'article chargé pour une simple liste.

Effet de bord signalé à l'utilisateur : le test du partage par l'agent critique a écrit une
adresse dans le presse-papiers de la machine.

- Portée : pages et composants des actualités, `pied-de-page.tsx` (et ses neuf usages),
  `texte-leger.tsx`, `lib/actualites-publiques.ts`, `globals.css`.
- Vérifié : 83 tests, `tsc`, lint ; pied de page et colonne mesurés sur un article ; aucun
  débordement à 375 px.
- Suite : « Le projet », « Où nous voir », partenaires, contact, puis mentions légales.

**18:00** · **[rectificatif] Le partage, corrigé pour de bon**

L'entrée de 17:55 et le commit `79e1282` annonçaient le bouton « Partager » corrigé ; ce n'était
pas vrai, le script de corrections ne touchait pas ce fichier. Relevé en relisant, corrigé
maintenant : partage natif sur écran tactile seulement, copie du lien sinon, repli sur la copie
si le partage échoue autrement que par une annulation, message « Copie impossible » en cas
d'échec. Vérifié au navigateur avec une copie simulée, sans toucher au presse-papiers réel.

- Portée : `src/components/public/actualites/partager.tsx`.
- Vérifié : `tsc`, lint ; clic en 1440 px : copie appelée, partage natif non appelé, « Lien
  copié. » annoncé.
- Suite : « Le projet », « Où nous voir », partenaires, contact, puis mentions légales.

**18:20** · **[page] La vitrine : le projet, où nous voir, partenaires**

Une veille pour les trois (`veille.md` section 17) : ESTAC Troyes montre l'ordre juste pour un
petit lieu (adresse et itinéraire en tête, puis transports, parking, PMR, sans carte intégrée),
Fréjus Var Volley le contre-exemple des logos hétérogènes, non cliquables et sans texte
alternatif. Fiche `fiches/vitrine.md`.

Le projet : une phrase qui situe, puis la chronologie saisie dans l'administration, reliée par un
fil turquoise ; aucun récit inventé. Où nous voir : la salle, déduite des matchs à domicile (la
plus fréquente), avec « Itinéraire » et « Copier l'adresse », le prochain match à domicile en
tableau LED, les suivants, et un texte « Venir à la salle ». Ce texte n'existait nulle part :
l'utilisateur a choisi de l'ajouter, d'où une table `reglages` (migration additive 0005) et un
onglet « La salle » dans l'administration, en texte léger. Partenaires : un merci, des cases
égales, logos ramenés en blanc et couleur au survol, sinon le nom ; « Devenir partenaire » mène
au contact, construit juste après.

L'en-tête garde ses quatre rubriques ; ces trois pages vivent dans le pied de page, et « Où nous
voir » est relié depuis la salle d'un match à domicile.

- Portée : `src/app/le-projet/`, `src/app/ou-nous-voir/`, `src/app/partenaires/`,
  `copier-adresse.tsx`, `lib/vitrine.ts`, `lib/reglages.ts`, schéma et migration 0005, onglet
  « La salle » de l'administration, `entete.tsx`, `pied-de-page.tsx`, `blocs-match.tsx`.
- Vérifié : 83 tests, `tsc`, lint ; les trois pages en 1440 px, « Venir à la salle » avec un
  texte de test (retiré ensuite), aucun débordement à 375 px après correction des partenaires.
- Suite : le formulaire de contact, avec sa revue de sécurité.

**18:15** · **[page] Le contact, et l'écran « Messages »**

Fiche `fiches/contact.md` posée avant le code : une page calme, sans mouvement, quatre champs
(sujet, nom, e-mail, message), le sujet pré-choisi par l'adresse (« Devenir partenaire » arrive
sur `?sujet=partenariat`). Refus annoncé en tête avec la saisie conservée, confirmation qui
remplace le formulaire et prend le focus. Une phrase dit ce qu'on garde, qui le lit, et pour
combien de temps : un an.

Côté sécurité : longueurs bornées, piège à robots hors écran et hors tabulation, plafonds de
3 envois par heure et par adresse réseau et de 30 au total, adresses gardées 24 heures dans une
table séparée, jamais reliées au message. La promesse d'un an est tenue par un effacement réel,
seule exception au principe de la corbeille, déclenché à chaque envoi et à chaque ouverture de
l'écran « Messages ».

La passe adversariale a trouvé un défaut qui dépassait le contact : `lireIp` retenait la première
entrée de `X-Forwarded-For`, choisie par le client. `Coolify/ETAT.md` note que le Traefik de
Coolify ajoute la vraie adresse en fin de liste ; la fonction retient désormais la dernière. La
connexion à l'administration en profite aussi, même si son compteur par adresse visée la
protégeait déjà.

L'écran « Messages » de l'administration, relié dans la navigation mais absent jusqu'ici :
non lus d'abord, réponse par un lien e-mail pré-rempli, marquer lu, corbeille restaurable. Le
texte s'affiche en texte brut. L'entrée « Comptes » de la même navigation mène encore à une page
absente.

- Portée : `src/app/contact/`, `src/lib/envois-contact.ts`, `src/lib/messages.ts`,
  `src/lib/auth/tentatives.ts` et son test, `administration/(interieur)/messages/`, schéma et
  migration 0006, `entete.tsx` (Contact au pied de page), `fiches/contact.md`, codex, ROADMAP.
- Vérifié : 91 tests, `tsc`, lint ; à 390 px le sujet pré-choisi et aucun débordement ; un
  message trop court refusé avec saisie gardée et focus sur l'alerte ; trois envois reçus, le
  quatrième refusé ; le piège rempli donne la confirmation sans rien ranger ; en 1440 px,
  marquer lu, corbeille et restauration, une balise `<b>` saisie reste du texte. Essais retirés
  de la base de développement ensuite.
- Suite : critique à froid du contact, puis mentions légales et politique de confidentialité,
  puis l'écran « Comptes ».

**18:05** · **[correctif] La critique à froid du contact**

Un agent qui n'avait pas construit la page l'a relue : sept défauts, deux mineurs, trois
propositions de composition. Tous les défauts sont corrigés ; les propositions attendent l'avis de
l'utilisateur.

Le plus important : l'ami n'aurait jamais su qu'un message l'attendait, puisque rien ne part par
e-mail. Un compteur jaune de non lus s'affiche désormais à côté de « Messages » dans la
navigation de l'administration, et la purge d'un an y passe aussi, pour que la promesse faite au
visiteur ne dépende plus d'un nouvel envoi.

La limite de débit comptait avant d'écrire : une salve simultanée passait. L'envoi est
maintenant réservé d'abord, compté ensuite. Le refus pour plafond global ne dit plus au visiteur
qu'il a trop écrit. Le champ piège s'appelait `site_web`, un nom que les navigateurs remplissent
d'eux-mêmes, au risque d'écarter un humain en silence ; il porte un nom sans sens, et chaque
rejet est journalisé sans contenu. Le sujet choisi est gardé après un refus, le champ fautif est
marqué pour les lecteurs d'écran, la bordure des champs passe à 3,6:1 (nouveau jeton
`--color-nuit-bord`), un sujet « Une idée pour la série » rejoint la liste, et la phrase de
confidentialité mentionne l'adresse réseau gardée 24 heures.

- Portée : `src/app/contact/`, `src/lib/contact.ts` et son test, `src/lib/envois-contact.ts`,
  `src/lib/messages.ts`, `administration/(interieur)/layout.tsx`, `coquille.tsx`, `messages/`,
  `globals.css`, `fiches/contact.md`, ROADMAP.
- Vérifié : 91 tests, `tsc`, lint ; à 390 px un e-mail `a@b` refusé par le serveur garde le
  sujet choisi et marque le champ ; trois envois reçus, le quatrième refusé avec le nouveau
  texte ; compteur « 3 non lus » dans la navigation. Essais retirés de la base ensuite.
- Suite : mentions légales et politique de confidentialité (éditeur en nom seul, anonymat LCEN ;
  demandes par le formulaire ; Hetzner, Turso et R2 nommés), puis Umami sur le VPS, puis l'écran
  « Comptes ».

**18:25** · **[ui] Contact élargi, actions de l'administration à 44 px**

Deux propositions de la critique, validées par l'utilisateur. Sur grand écran, la page Contact
laissait 600 px de nuit à droite : une colonne « Ce qu'on peut vous répondre » y explique les
sujets et renvoie vers ce qui n'a pas besoin d'un message (les matchs, la salle, la série).

Dans l'administration, les actions de ligne étaient de petits liens de 14 px, pénibles au
téléphone, alors que l'ami gérera le site depuis le sien. Une classe commune `.action-admin`
(44 px, bordure discrète) les remplace sur tous les écrans ; les boutons principaux, les liens
« Retour », les onglets de saison et les flèches d'ordre passent aussi à 44 px. Les trois liens
pris dans une phrase restent des liens.

- Portée : `src/app/contact/page.tsx`, `globals.css`, `components/formulaire.tsx`, 18 écrans de
  `administration/(interieur)/`.
- Vérifié : `tsc`, lint ; contact en 1440 et 375 px ; sept écrans d'administration à 390 px,
  aucune action sous 44 px, aucun débordement.
- Suite : mentions légales et politique de confidentialité, puis Umami sur le VPS, puis l'écran
  « Comptes ».

## 30-09-2026

**22:20** · **[page] Mentions légales et confidentialité**

L'utilisateur a tranché quatre points : l'éditeur est Tom Oger, à titre de particulier, en nom
seul comme le permet la LCEN ; toutes les demandes passent par le formulaire de contact ; les trois
prestataires techniques sont nommés ; Umami, sans cookie, est installé au premier lot. Les raisons
sociales et adresses de Hetzner Online GmbH, CHISELSTRIKE INC. (la société de Turso) et Cloudflare,
Inc. ont été relevées sur leurs propres pages, pas écrites de mémoire.

La politique est rangée par situation du visiteur (s'il écrit, s'il est joueur, s'il gère le site)
plutôt que par article du RGPD. Chaque durée qu'elle annonce est tenue par le code, et la liste de
ces durées est en tête du fichier : c'est au texte de suivre le code. Une phrase que je n'avais pas
vérifiée, sur les garanties contractuelles des prestataires américains, a été remplacée par un
constat factuel avant le commit.

Point à garder en tête : l'anonymat de la LCEN suppose que l'hébergeur connaisse l'identité de
l'éditeur. Ici, celui qui héberge en pratique est l'utilisateur, sur un serveur loué chez Hetzner ;
le texte le dit ainsi (« la personne qui assure l'hébergement »), sans le nommer.

- Portée : `src/app/mentions-legales/`, `src/app/confidentialite/`,
  `components/public/page-juridique.tsx`, `pied-de-page.tsx`, `lib/site.ts` (`EDITEUR`),
  `globals.css` (listes et intertitres de `.texte-article`), `fiches/juridique.md`, ROADMAP.
- Vérifié : `tsc`, lint ; les deux pages en 390 et 1440 px, statut 200, aucun débordement.
- Suite : Umami sur le VPS (le code du site, puis l'installation Coolify avec l'utilisateur), et la
  politique mise à jour dans le même commit ; puis l'écran « Comptes ».

**22:40** · **[fonction] La mesure d'audience Umami, côté site**

L'utilisateur ne se souvenait plus du nom de l'outil retenu au cadrage : un compteur de visites
sans cookie, libre, installé sur son propre serveur. Expliqué, puis validé.

Côté site, le script se charge seulement si ses deux variables d'exécution existent, posées dans
Coolify sans reconstruire. Il respecte « Do Not Track », ignore les paramètres d'adresse, et ne
compte ni l'administration ni les pages de travail. Première version cassée : l'expression
régulière du filtre perdait ses barres obliques dans le HTML, et React signalait la balise brute.
Réécrit avec `next/script` et une simple liste de segments, partagée avec la fonction testée.

La politique de confidentialité décrit Umami dans le même commit, comme la fiche l'exige.

L'installation sur le VPS reste à faire par l'utilisateur : elle demande un nom DNS chez
Cloudflare et un service de plus dans Coolify, deux gestes sur sa production.

- Portée : `src/lib/mesure-audience.ts` et son test, `src/components/mesure-audience.tsx`,
  `src/app/layout.tsx`, `src/app/confidentialite/page.tsx`, `.env.example`, codex, ROADMAP.
- Vérifié : 97 tests, `tsc`, lint ; avec une configuration factice en local (retirée ensuite), le
  script est rendu, le filtre écarte `/administration` et `/planche`, garde `/`, `/matchs` et
  `/administrations-locales`, et survit à une navigation interne.
- Suite : l'utilisateur installe Umami dans Coolify ; puis l'écran « Comptes ».

**23:20** · **[infra] Umami installé sur le VPS**

La session Coolify a installé Umami 3.0.3 sur `https://stats.valentincheron.fr`, dans son propre
projet Coolify (`stats`), pour pouvoir compter d'autres sites plus tard. Mot de passe par défaut
changé dès le déploiement, site « Point Par Point » déclaré, sonde Todai active, `script.js`
vérifié en 200. Le détail est dans `APP/Coolify/ETAT.md`, section « Umami, en détail ».

Rien ne change dans le code : les deux valeurs attendues et les gestes du jour du déploiement
(variables d'exécution et non de build, domaine du site dans Umami, sauvegarde de sa base) sont
rangés dans la liste « Avant la mise en ligne » de la ROADMAP, qui a aussi repris les points
jusqu'ici épars dans le texte (migrations, sauvegardes de 30 jours, accords de droit à l'image).

- Portée : ROADMAP.
- Vérifié : rien de mon côté, rapport de la session Coolify relu.
- Suite : l'écran « Comptes » de l'administration.

**23:55** · **[écran] Comptes et Mon compte**

L'entrée « Comptes » du menu menait à une page absente. Elle existe : liste des comptes, création,
changement de rôle, désactivation, mot de passe provisoire. Le site n'envoyant aucun e-mail, un
compte naît avec un mot de passe provisoire affiché une seule fois, sans caractère ambigu, que
l'administrateur transmet de la main à la main. « Mon compte », ouvert à tous et relié depuis le
nom dans l'en-tête, sert à le remplacer, avec le mot de passe actuel exigé et le compteur de
tentatives de la connexion.

Les garde-fous : on ne se retire pas ses propres droits, il reste toujours un administrateur
actif (contrôle refait après écriture), et désactiver déconnecte aussitôt.

Deux trouvailles en vérifiant. Le journal de développement de Next consignait en clair le
résultat des actions serveur, donc le mot de passe provisoire : `logging.serverFunctions` est
coupé. Et le formulaire client importait une constante depuis le fichier qui charge bcrypt, ce qui
l'aurait envoyé au navigateur : la valeur passe désormais par la page serveur.

- Portée : `src/lib/comptes.ts` et son test, `administration/(interieur)/comptes/`,
  `administration/(interieur)/compte/`, `coquille.tsx`, `next.config.ts`, `fiches/comptes.md`,
  codex, ROADMAP.
- Vérifié : 103 tests, `tsc`, lint ; parcours complet avec un second navigateur : création,
  connexion au mot de passe provisoire, rédacteur refusé sur « Comptes », mauvais mot de passe
  actuel et confirmation différente refusés, changement réussi sans déconnexion, aucune action sur
  son propre compte, promotion puis rétrogradation, désactivation qui déconnecte et bloque la
  reconnexion ; 390 px sans débordement. Compte d'essai supprimé de la base ensuite.
- Suite : relire la liste « Avant la mise en ligne » avec l'utilisateur ; passe de sécurité
  complète avant déploiement.

**23:40** · **[rectificatif] Le lot 1 n'est pas terminé**

L'entrée précédente, et mon message à l'utilisateur, disaient que tout le lot 1 était construit.
C'est faux : relue ligne à ligne, la ROADMAP garde quatre chantiers ouverts, dont un bloquant.
L'envoi des photos vers R2 n'existe pas, donc aucune photo de joueur, de staff ni logo de
partenaire ne peut être ajouté depuis l'administration. Restent aussi la fiche joueur détaillée,
le classement de la poule et le bilan de saison. La ROADMAP est corrigée, et la case du compteur
d'audience cochée.

- Portée : ROADMAP.
- Vérifié : relecture complète de la ROADMAP.
- Suite : l'envoi des photos vers R2, puis la fiche joueur détaillée, le classement et le bilan.

## 01-10-2026

**00:05** · **[sécurité] sharp ramené à une version de plus de quinze jours**

En préparant l'envoi des photos, la date de `sharp` a été relue dans le registre : la montée vers
Next 16.3.5 du 29-09 avait tiré `sharp` 0.35.5 et ses binaires natifs, publiés le 27-09, deux
jours plus tôt. Next et React, eux, avaient 18 à 20 jours ce jour-là, conformes.

Les contrôles de la règle ont été faits dans l'ordre, tous propres : aucun script d'installation
dans `sharp` (le « install » de son `package.json` est un dossier livré), aucun crochet inattendu
dans les réglages Claude, aucun dépôt créé sur le compte GitHub depuis le 26-09. `sharp` est
épinglé sur 0.35.4 (26-08) avec un `overrides` pour que Next prenne le même, et `aws4fetch`
1.0.20 (2024, déjà en service sur le CRM) est ajouté pour R2. Seuls ces paquets ont bougé dans
le verrou.

- Portée : `package.json`, `package-lock.json`.
- Vérifié : dates lues dans le registre ; diff du verrou limité à la famille `sharp` et à
  `aws4fetch` ; `sharp` 0.35.4 se charge.
- Suite : l'envoi des photos vers R2.

**00:50** · **[fonction] L'envoi des photos**

Fiche `fiches/photos.md` d'abord. L'ami choisit une photo telle quelle, depuis son téléphone ;
le serveur fait le reste : format lu dans le contenu, SVG et non-images refusés, 12 Mo et
40 millions de pixels au plus, rotation, réduction, WebP, et **toutes les métadonnées retirées**,
position GPS comprise. Clés tirées au hasard, jamais le nom du fichier. L'ancien objet est effacé
après l'enregistrement, le neuf si l'enregistrement échoue.

Les identifiants R2 sont vides en local : un stockage de développement (`.stockage-local/`,
servi par `/fichiers-locaux/`, 404 en production) permet de tout essayer. En production sans R2,
l'envoi est refusé plutôt qu'écrit sur un disque éphémère. Le plafond des actions serveur passe
à 13 Mo, et le navigateur bloque lui-même une photo de plus de 12 Mo, sinon Next couperait la
requête avec une page d'erreur brute.

Branché sur le staff, les logos des partenaires, les étapes du projet et les actualités. La
photo des joueurs attend leur fiche détaillée, qui n'existe pas encore dans l'administration.

- Portée : `src/lib/images.ts`, `stockage.ts`, `envoi-image.ts` et leurs tests,
  `src/components/champ-image.tsx`, `src/app/fichiers-locaux/`, `lib/effectif-public.ts`
  (`urlPhoto`), actions et formulaires du projet et des actualités, `next.config.ts`,
  `.gitignore`, fiche, codex, ROADMAP.
- Vérifié : 110 tests (dont redimension, GPS retiré, SVG déguisé, bombe de pixels, clés de
  remontée refusées), `tsc`, lint ; à l'écran : SVG déguisé en JPEG refusé avec une phrase,
  vraie photo de 3000 × 4000 enregistrée en 1200 × 1600 sans EXIF (6,9 Ko), affichée sur
  `/effectif` ; remplacement et retrait effacent l'ancien fichier ; logo affiché en blanc sur
  `/partenaires` ; actualité avec illustration puis retrait ; 14 Mo bloqués sans envoi ;
  `/fichiers-locaux/..%2F.env.local` en 404. Essais retirés de la base et du disque.
- Suite : la fiche joueur détaillée, avec sa photo et le point de visage.

**00:05** · **[écran] La fiche joueur, et un rectificatif d'heures**

Rectificatif d'abord : les deux entrées précédentes, « sharp ramené » et « L'envoi des photos »,
portent les heures 00:05 et 00:50 du 01-10. Elles sont fausses, je les ai inventées au lieu de
lire l'horloge : elles ont été écrites le 30-09 vers 23:45 et 23:55. Le titre de date
« 01-10-2026 » qui les précède est donc prématuré, sans conséquence sur leur contenu. Les heures
se lisent désormais avec `date` avant chaque entrée.

La fiche joueur existe : l'administration ne savait modifier que le numéro et le poste. Depuis
chaque ligne de l'effectif (« Fiche et photo », ou le nom), on saisit l'identité, la date de
naissance, la taille, la photo, la présentation et le parcours. Le point de visage se place d'un
clic sur la photo, ou au clavier avec deux curseurs, avec l'aperçu du cadrage de la carte à côté ;
deux colonnes (migration additive 0007), rendues en `object-position` partout où le portrait
apparaît. L'adresse publique ne suit pas le nom, pour ne casser aucun lien partagé.

`positionPhoto` vit dans son propre module : importée par le sélecteur, côté navigateur, depuis le
fichier de validation, elle y aurait embarqué zod.

- Portée : `src/lib/fiche-joueur.ts` et son test, `src/lib/position-photo.ts`,
  `administration/(interieur)/effectif/joueur/`, `ligne-effectif.tsx`, `effectif/page.tsx`,
  `champ-image.tsx`, `portrait-joueur.tsx`, `cartes.tsx`, `effectif/[slug]/page.tsx`,
  `lib/effectif-public.ts`, schéma et migration 0007, fiche, ROADMAP.
- Vérifié : 117 tests, `tsc`, lint ; à l'écran : date de naissance en 2030 refusée, photo en
  paysage enregistrée, point placé d'un clic à 75 % / 29 %, repris tel quel sur la carte de
  `/effectif` et sur la page du joueur ; fiche et effectif à 390 px sans débordement. Joueur de
  démonstration remis en état, fichiers d'essai effacés.
- Suite : le classement de la poule, puis le bilan de saison.

**00:10** · **[fonction] Le classement de la poule**

Trois choix de l'utilisateur : le tableau complet sur la page Matchs et le rang sur l'accueil ;
une grille préremplie plutôt qu'un copier-coller depuis la FFVB, dont le format n'est pas
vérifié ; une disparition après 30 jours sans mise à jour.

La grille reprend la dernière version : chaque semaine, seuls les chiffres et l'ordre changent, le
rang étant la position. Contrôles : une seule équipe « Nous », pas de doublon, des entiers, pas plus
de victoires et de défaites que de matchs. Les lignes sont remplacées en un lot atomique. Côté
public, un vrai tableau avec notre ligne en jaune ; la saison courante se périme à 30 jours, une
saison passée affiche son classement final.

En vérifiant, « jeudi 1 octobre » est apparu : `Intl` n'écrit pas « 1er ». Corrigé une fois dans
`dates.ts`, pour tout le site. Deux défauts de la grille aussi : pas d'intitulés de colonnes en
grand écran, et des chiffres écrits trop petit.

- Portée : `src/lib/classement.ts`, `classement-base.ts` et le test, `lib/accueil.ts`,
  `lib/dates.ts` et son test, `administration/(interieur)/matchs/classement/`, écran des matchs,
  `components/public/matchs/tableau-classement.tsx`, `app/matchs/page.tsx`,
  `accueil/bloc-tableaux.tsx`, `app/page.tsx`, fiche, codex, ROADMAP.
- Vérifié : 125 tests, `tsc`, lint ; à l'écran : grille préremplie (8 équipes), déplacement et
  enregistrement, tableau public à jour, « 1er sur 8 » puis rang de démonstration rétabli sur
  l'accueil, intitulés alignés au pixel près, 390 px sans débordement. Démonstration remise en
  cohérence.
- Suite : décider du bilan de saison (la page Matchs dit déjà victoires et défaites), puis la
  liste « Avant la mise en ligne ».

**00:19** · **[fonction] Le bilan de saison**

L'utilisateur a d'abord demandé de quels scores il s'agissait : ceux que l'ami saisit après chaque
match, aujourd'hui ceux des faux matchs de démonstration. Réponse ensuite : enrichir légèrement.

En tête de la page Matchs, avec la grammaire des chiffres de la page joueur : bilan en victoires
et défaites, sets gagnés et perdus, à domicile, à l'extérieur, et la série en cours à partir de
deux matchs. Tout se calcule depuis les scores déjà saisis (principe 2), rien n'est stocké, un
match sans score ne compte pas. La série se lit dans l'ordre des dates, pas dans celui de la
saisie, testé.

Avec ce bilan, les fonctions du lot 1 sont toutes construites.

- Portée : `src/lib/bilan.ts` et son test, `components/public/matchs/bilan-saison.tsx`,
  `app/matchs/page.tsx`, `fiches/matchs.md`, ROADMAP.
- Vérifié : 129 tests, `tsc`, lint ; à l'écran en 1440 et 390 px : 3 V 2 D, 11 sets à 7,
  3-0 à domicile, 0-2 à l'extérieur, aucune série affichée puisque les deux derniers matchs
  diffèrent ; aucun débordement.
- Suite : la liste « Avant la mise en ligne », à commencer par la passe de sécurité complète.

**01:11** · **[audit] Le groupe d'audit, huit regards, premier passage**

Premier audit complet, demandé par l'utilisateur en élargissant la passe de sécurité prévue. Quatre
relectures à froid en parallèle, en lecture seule, puis chaque constat élevé revérifié à la main
avant correction : 97 constats, aucun critique, 15 élevés. Rapport :
`audits/2026-10-01-audit-groupe.md`.

Le plus grave était invisible à l'usage : un texte d'actualité piégé de 20 000 caractères
bloquait le serveur 40 secondes, parce que le motif du gras revenait sur ses pas à chaque
position. L'analyse est devenue linéaire. Ensuite, un inconnu pouvait bloquer le compte de Tom
avec cinq essais, une seule adresse pouvait fermer le formulaire de contact à tout le monde, et
un titre long ou un nom polonais rendait une page introuvable alors qu'elle était listée.

66 constats corrigés en trois lots vérifiés : sécurité, fiabilité et intégrité (pages d'erreur,
sonde de santé, purge commune, bascules idempotentes, égalité de sets refusée), accessibilité et
rédaction (identifiants uniques, bords lisibles, navigation au téléphone, tableau de bord qui
voit le classement et les messages). Migration additive 0008. Les dépendances sont épinglées en
version exacte.

Restent quatre élevés qui ne sont pas du code sûr : l'effacement définitif promis par la
politique (R1, R2), à trancher, et les sauvegardes de la base et des photos (F3, F4), réglages
du serveur avant la mise en ligne.

- Portée : 3 commits (`324c333`, `6bd129f`, `576031b`), environ 70 fichiers, migration 0008,
  rapport, ROADMAP.
- Vérifié : 143 tests, `tsc`, lint ; sondes : 20 000 caractères piégés en moins de 0,5 s ;
  blocage de connexion depuis l'attaquant et connexion réussie d'ailleurs ; `/sante`,
  `robots.txt`, plan du site (37 adresses), agenda vers la page du match, page introuvable ;
  0 champ sans étiquette sur le projet, 0 cible sous 44 px dans l'en-tête à 390 px. Comptes et
  tentatives d'essai supprimés.
- Suite : les questions d'arbitrage de l'audit, puis les démarches « Avant la mise en ligne ».


**01:29** · **[audit] Les arbitrages de l'audit**

L'utilisateur a tranché les questions de l'audit en trois salves. Réalisé dans la foulée :
- l'effacement définitif, confirmé par une case, réservé à l'administrateur : un joueur (fiche,
  effectifs, feuilles de match, photo), un élément du projet ou un message à la corbeille ; la
  promesse de la politique de confidentialité devient vraie ;
- une description d'image facultative, lue aux lecteurs d'écran (migration additive 0009) ;
- une CSP de base, vérifiée sans violation sur quinze pages, lecteur YouTube compris ;
- HSTS sans `preload`, expliqué d'abord : l'inscription engagerait un domaine qui n'est ni
  acheté ni attribué ;
- la purge nocturne, route protégée par un jeton comparé en temps constant, pour une tâche Coolify ;
- la vitrine dans l'en-tête en grand écran, les titres « La série » et « Le projet », un lien
  vers le staff depuis l'effectif, l'administration harmonisée.

Pas de champ d'accord des joueurs dans le site : les accords papier de Tom suffisent. Next 16.3.6
attendra le 07-10, et les limites Traefik se poseront au déploiement.

- Portée : `src/lib/effacement.ts`, `components/effacer-definitivement.tsx`, `app/taches/purge`,
  `next.config.ts`, Dockerfile, schéma et migration 0009, écrans du projet, des messages, de la
  fiche joueur et des actualités, en-tête public, rapport d'audit, ROADMAP.
- Vérifié : 143 tests, `tsc`, lint ; CSP sur 15 pages sans violation ; purge 401, 401, 204 et 405 ;
  joueur jetable avec photo effacé (base et disque vides ensuite), membre du staff effacé depuis
  la corbeille, description lue en texte alternatif ; données d'essai retirées.
- Suite : les démarches « Avant la mise en ligne » (sauvegardes, Coolify, accords, mentions),
  puis le déploiement.

**15:02** · **[décision] Une avant-première derrière une barrière**

L'utilisateur veut que Tom voie le site et donne son avis avant la mise en ligne. Retenu : mettre
en ligne dès maintenant l'instance de production elle-même, sur `volley.valentincheron.fr`,
derrière une barrière Traefik `basicauth`.

Pourquoi la production et pas une preview jetable : Tom va forcément saisir de vrais joueurs et de
vrais matchs en essayant l'administration, et c'est elle qui décidera si le site vit dans la durée.
Rien ne sera à migrer, le lancement reviendra à retirer la barrière et à brancher le domaine. La
contrepartie est que les sauvegardes de la base et des photos passent avant, et non au lancement.

Pourquoi Traefik plutôt qu'un écran dans le site : aucun code à écrire puis à défaire, aucune
indexation possible, et la recette existe déjà sur le VPS. Elle ne gêne ni la session admin
(cookie), ni `/sante` ni la purge, appelées en interne. Umami et la sonde Todai attendent le
lancement public.

- Portée : ROADMAP (section « Avant-première pour Tom »), carnet.
- Vérifié : rien d'exécuté, décision seulement ; recette `basicauth` relue dans `Coolify/ETAT.md`.
- Suite : préparer l'avant-première, DNS, base Turso de production et migrations (avec accord),
  bucket R2, application Coolify, barrière, sauvegardes, puis le compte de Tom.

**16:10** · **[jalon] L'avant-première : la base, les photos et le DNS sont prêts**

Base Turso de production créée par l'utilisateur au tableau de bord, puis migrée depuis le poste
avec son accord : `projet-volley-prod`, 10 migrations, 24 tables, aucun compte. Les valeurs vivent
dans `.env.production.local`, à part de `.env.local` : un `db:demo` lancé par réflexe ne doit pas
pouvoir viser la production.

Bucket R2 `projet-volley` et son domaine public `photos-volley.valentincheron.fr`. Le premier
jeton était en lecture seule : la liste passait, le dépôt rendait `AccessDenied`, corrigé par
l'utilisateur. Le test de bout en bout a trouvé un vrai point : le bucket vidé, la photo restait
servie par le cache de Cloudflare (`HIT`), parce que le site dépose en `immutable` pour un an.
Contraire, à la lettre, à l'effacement définitif réglé ce matin. Choix de l'utilisateur : une
Cache Rule à 1 jour, sans code ni nouveau secret, et la politique de confidentialité le dit.

La suite part au poste de commande Coolify, par une consigne écrite : application, variables,
barrière, purge et sauvegardes. Préalable que seul l'utilisateur peut lever : la GitHub App
`coolify-valvoy` ne voit pas encore le dépôt.

- Portée : `.env.production.local` (ignoré), politique de confidentialité, ROADMAP,
  `Coolify/docs/Consignes/point-par-point-01-avant-premiere.md`.
- Vérifié : migrations comptées en base ; R2 dépôt, lecture publique 200, effacement 404 par
  l'API, bucket à 0 objet ; DNS `volley` sur la même IP que `todai` ; `tsc` et lint. La durée de
  la Cache Rule n'est pas visible dans les en-têtes, donc pas prouvée.
- Suite : la consigne #01 exécutée par le poste Coolify, puis ici le compte de Tom
  (`db:admin` en production) et un envoi de photo de bout en bout.

**18:43** · **[jalon] L'accueil devient la porte d'entrée**

Vu en production sur la base vide, l'accueil ne montrait que l'intro puis le pied de page : la
fiche du 30-09 ne retenait que des blocs de fraîcheur, qui disparaissent tous sans données. Et même
rempli, rien ne disait qui est l'équipe. L'utilisateur a tranché : une porte d'entrée complète, trois
chapitres permanents (Qui on est, L'équipe, Le projet), le manifeste modifiable par Tom, et le
mouvement comme objectif à chaque bloc, « c'est comme ça qu'on crée notre identité ».

Veille déléguée (section 18) puis fiche validée avant le code. Trois gestes tirés de la salle : le
manifeste s'allume mot à mot comme des rampes, les numéros roulent comme un tableau d'affichage, le
fil du projet se trace et allume chaque étape. La série ne disparaît plus : sans épisode, elle
invite à la chaîne. Sur la base vide, la page montre désormais le manifeste et la série, et
s'étoffe à chaque saisie de Tom.

Les essais à l'écran ont trouvé un plantage au rechargement en bas de page (animation appelée
avant d'exister). La critique à froid en a trouvé douze autres, tous corrigés, dont un élevé : juste
avant le pied de page, la page était trop courte pour finir le geste et la dernière étape restait
éteinte. Le fil est désormais fait de tronçons d'un repère au suivant, et sa fin bornée au bas de la
page. Bourde de séance : un Prettier lancé sans configuration a reformaté quatre fichiers que je
n'avais pas touchés ; restaurés depuis git, et mes modifications réappliquées seules.

- Portée : `src/app/page.tsx`, `src/lib/{porte-entree,accueil,reglages}.ts`, cinq composants
  neufs dans `components/public/accueil`, `portrait-joueur.tsx`, écran
  `administration/projet/manifeste`, `onglets.tsx` (débordement d'un pixel corrigé), fiche, veille.
- Vérifié : 157 tests (14 neufs), `tsc`, lint, `next build` ; à l'écran en 1440 et 390 px sur la
  démo, sur une base vide jetable, avec une et deux étapes, projet juste avant le pied de page,
  mouvement réduit ; mesures des trois gestes au défilement ; écran du manifeste de bout en bout
  (enregistrer, texte de départ tel quel, retours à la ligne, confirmation et annulation).
- Suite : l'utilisateur regarde la page en local, puis push sur `main` (déploie chez Tom).

**19:50** · **[contenu] Les épisodes de la chaîne entrent en production**

Sur proposition de l'utilisateur : les vidéos déjà publiées sur la chaîne de Tom (« Tom Com »,
`UCpuZ9Cx5BFLEQfrHMSy6tFg`) lues par son flux RSS public, sans clé ni API. Sept vidéos, dont les
quatre épisodes numérotés de la série ; un live de 2018 et une vidéo courte écartés. Décisions de
l'utilisateur : les quatre épisodes publiés tout de suite, l'annonce du 30-07 en épisode sans
numéro, et l'objectif de la saison dans le manifeste de départ.

Ajout en production avec son accord, par un script ponctuel qui reprend la fabrique d'adresses de
l'administration et ignore une vidéo déjà présente. Titres sans leur suffixe « | EP.0x », le site
affiche déjà le numéro ; résumés condensés des descriptions de Tom, qu'il peut retoucher. Les
descriptions disent l'objectif de la saison, passer de D2 à D1 : le manifeste de départ le dit
désormais (46 mots).

- Portée : base de production (5 lignes dans `episodes`), `src/lib/porte-entree.ts`, fiche.
- Vérifié : relecture des 5 lignes en base ; sur le site derrière la barrière, accueil 200 avec
  l'épisode 4 dans le bloc série, `/serie` 200, page de l'épisode 4 avec sa miniature ; 157 tests,
  `tsc`.
- Suite : feu vert de l'utilisateur sur l'accueil en local, puis push sur `main`.

**21:54** · **[contenu] Le calendrier fédéral et la chronologie entrent en base**

À la question « qu'est-ce qu'on peut déjà inclure », recherche de ce qui est public et vérifiable.
Le site du club donne les entraînements de la D2 masculine et renvoie au portail de résultats de
la FFVB, encore sur 2025-2026. Le portail publie pourtant déjà 2026-2027 : poule SMB, Seniors
masculins Division 2 du comité du Rhône, 13 équipes. Le VBC Francheville finissait dernier de la
D1 la saison passée, ce qui éclaire l'objectif de remonter.

Avec l'accord de l'utilisateur, ajout en production des matchs dont l'heure est publiée : 9 sur
12. Les trois autres, à l'extérieur, n'ont pas d'heure ; le modèle en exige une et rien n'est
inventé, ils attendent Tom. La saison 2026-2027 existait déjà, créée dans l'administration à
16:16. Cinq étapes du projet tirées des vidéos de Tom, en brouillon : c'est son histoire, il la
publie. Les épisodes ne sont rattachés à aucun match : ils racontent des essais et des amicaux.

La relecture du site en ligne a montré « Dans 1 jours » lu aux lecteurs d'écran, et le même
défaut dans « Réessayez dans 1 minutes » : accord en nombre et unités à zéro omises, testés.

- Portée : base de production (9 rencontres, 5 étapes en brouillon), `src/lib/resultats.ts`,
  `compte-rebours-led.tsx`, deux actions de connexion, ROADMAP.
- Vérifié : relecture en base ; site derrière la barrière, accueil avec le prochain match
  (Écully, samedi 20 h) et son compte à rebours, `/matchs` avec le calendrier, `/le-projet` sans
  les brouillons ; 160 tests, `tsc`, lint.
- Suite : feu vert de l'utilisateur, puis push sur `main` ; Tom relit les étapes, saisit les
  trois heures manquantes et l'adresse du gymnase Jean Boistard.

**22:41** · **[jalon] Le tableau défile, les matchs disent où ils se jouent**

Deux demandes de l'utilisateur après avoir vu le site. Le tableau du prochain match doit être
dynamique : il défile désormais à la seconde, et chaque chiffre qui change bascule comme le volet
d'un afficheur, lui seul. Sur `/matchs`, chaque ligne porte sa marque Domicile ou Extérieur ; un
filtre était proposé, l'utilisateur a préféré la marque.

Les mesures à l'écran ont trouvé deux défauts de mise en page, corrigés : les deux-points 9 px
trop bas par rapport aux chiffres, et quatre groupes de chiffres qui débordaient du tableau à
mi-largeur sur l'accueil à 1280 px, puis de 5 px au téléphone. La taille suit maintenant la largeur
du tableau, par requête de conteneur.

L'utilisateur veut ensuite parler de la mise en page des vidéos YouTube et des matchs.

- Portée : `compte-rebours-led.tsx`, `afficheur-led.tsx`, `lib/resultats.ts` (+ tests),
  `globals.css` (keyframes `bascule`), `ligne-calendrier.tsx`, fiche des matchs.
- Vérifié : 160 tests, `tsc`, lint ; un seul chiffre animé par seconde, aucun sous mouvement
  réduit ; place des chiffres et alignement des deux-points mesurés de 360 à 1920 px ; 4 marques
  Domicile et 4 Extérieur sur la démo, noms accessibles relus.
- Suite : feu vert pour pousser (cinq commits locaux), puis la mise en page des vidéos et des
  matchs.

**23:18** · **[jalon] Les matchs sans horaire, et la veille de la refonte**

Le calendrier fédéral publie trois matchs sans heure, et le modèle en exigeait une. Choix de
l'utilisateur : le champ heure devient facultatif ; vide, le site dit « horaire à confirmer », le
tableau du prochain match compte en jours (« J-16 », puis « C'est aujourd'hui ») au lieu d'un faux
compte à rebours, et l'agenda propose la journée entière.

Représentation retenue : une colonne `heure_connue` (migration additive 0010), et un match sans
heure rangé à 23 h 59 ce jour-là. Toute la logique qui compare l'instant du match à maintenant le
garde ainsi « à venir » jusqu'au soir sans être réécrite ; seuls l'affichage (`lib/horaire.ts`),
le statut « en cours », le tableau et l'agenda lisent le drapeau. Un match sans heure n'est jamais
annoncé « en cours ».

En parallèle, trois veilles déléguées pour la refonte « trop tassé » (`veille.md`, section 19) :
pages de vidéos, respiration et échelle (le graphiste), pages de matchs. Le constat central : l'air
vient de l'asymétrie, un grand vide avant un titre puis le titre collé à son contenu, pas d'un
espacement uniforme comme le nôtre.

Incident : l'ancien serveur de développement avait des processus de compilation morts et rendait
des 500 ; arrêté et relancé, rien dans le code.

- Portée : schéma et migration 0010, `lib/horaire.ts` (+ tests), `calendrier.ts`, `resultats.ts`,
  `agenda.ts`, `dates.ts`, tableau du prochain match, afficheur LED (lettre J), ligne de
  calendrier, pages match, où nous voir, série, administration des matchs, veille.
- Vérifié : 171 tests, `tsc`, lint ; sur la démo, tableau en jours, « horaire à confirmer » sur la
  ligne et la page du match, agenda en journée entière (`DTSTART;VALUE=DATE`) ; administration :
  création sans heure, champ vide à la modification, ajout d'une heure pris en compte. Migration
  0010 appliquée en production avec l'accord de l'utilisateur (11 migrations, 10 matchs intacts).
  Données et compte d'essai retirés de la base de développement.
- Suite : push, puis les trois matchs sans heure en production ; ensuite les fiches du système
  d'espacement, de la Série et des Matchs, à valider avant le code.

**23:39** · **[jalon] La refonte respire : le système et la Série**

Fiche `fiches/refonte-respiration.md`, validée avec les quatre recommandations : grande échelle
de titres (189 et 96 px en grand écran), liste verticale à grandes vignettes, signal de lieu fort
sur les matchs, livraison étape par étape. La colonne large reste à 84rem, contre la proposition du
graphiste : l'utilisateur avait demandé un site plus large, l'air vient du vertical.

Étape 1, le système : jetons de respiration (grand vide avant un chapitre, titre collé à son
contenu, suite serrée), nouvelle échelle typographique, utilitaires, et le volet en triangle qui
découvre titres et vignettes. Étape 2, la Série : ouverture avec le compte des épisodes en chiffre
géant, dernier épisode en bandeau titré sur l'image, chapitre « Tous les épisodes » où chaque
épisode a enfin sa vignette, annonce sous « Avant la série » ; page d'épisode avec le lecteur en
bandeau et l'épisode suivant mis en avant ; bloc de l'accueil en bandeau.

La critique à froid a relevé douze points, tous traités : le volet faisait clignoter ce qui était
déjà à l'écran, un mot long débordait au téléphone, le titre posé sur une vignette claire manquait
de contraste, les épisodes avaient perdu leurs niveaux de titre, les annonces disparaissaient sans
épisode numéroté, des étiquettes restaient à 12 px. Une erreur de la séance, aussi : le contrôle
anti-doublon des matchs tenait compte des majuscules ; le Saint-Fons saisi à 20 h par
l'utilisateur a été supprimé avec son accord.

- Portée : `globals.css`, `volets.tsx`, `titre-chapitre.tsx`, `serie/bandeau-episode.tsx`,
  `serie/ligne-episode.tsx`, `serie/elements-serie.tsx`, pages `/serie` et `/serie/[slug]`,
  `accueil/bloc-serie.tsx`, `/contact` (grille à 1024 px), fiche ; base de production : 3 matchs
  sans horaire ajoutés, un doublon retiré, 12 matchs au total.
- Vérifié : 171 tests, `tsc`, lint ; à l'écran en 1440 et 390 px ; titres h1, h2, h3 relus ; volet
  absent sur ce qui est déjà à l'écran ; titre lu une fois sur l'accueil au téléphone ; aucun
  débordement de 390 à 1920 px, `/contact` compris.
- Suite : l'utilisateur regarde `/serie` en local et tranche l'ordre titre ou lecteur sur la page
  d'épisode ; push ; puis l'étape 3, les Matchs.

**23:54** · **[jalon] La refonte respire : les Matchs**

Étape 3 de la refonte. La page `/matchs` s'ouvre sur le titre en très grand et le bilan en
chiffres géants, le prochain match en bandeau dont les chiffres grandissent avec lui, puis un
chapitre par mois. La ligne de match tient en trois blocs : le jour en chiffres de tableau qui
roulent à l'entrée du mois, l'adversaire avec sa marque de lieu, l'heure ou le score avec le
détail des sets. À domicile, la ligne s'éclaire et porte un filet turquoise. La page d'un match
met le score en bandeau, commentaire et salle côte à côte, l'épisode en bandeau.

La critique à froid a relevé huit points, tous traités : lignes trop hautes et colonne de
l'adversaire étranglée au téléphone (la case passe dessous), compétition tronquée et sets
absents du nom accessible, jours affichés « 00 » avant leur mois, adversaire sans niveau de titre,
étiquettes sous 13 px, et le compte à rebours qui tournait pendant la lecture du calendrier : il
ne bat plus que tableau à l'écran.

- Portée : `matchs/ligne-calendrier.tsx`, `app/matchs/page.tsx`, `matchs/bilan-saison.tsx`,
  `matchs/tableau-classement.tsx`, `matchs/blocs-match.tsx`, `app/matchs/[slug]/page.tsx`,
  `compte-rebours-led.tsx`, `tableau-resultat.tsx`, `tableau-prochain-match.tsx`,
  `mouvements-porte-entree.tsx`, fiche.
- Vérifié : 171 tests, `tsc`, lint ; lignes de 116 px en grand écran, 124 à 181 au téléphone ;
  aucun débordement de 360 à 1920 px sur six pages ; jours qui roulent jusqu'à leur valeur ;
  compte à rebours qui défile à l'écran, figé hors écran, repris au retour ; nom accessible avec
  compétition et sets ; aucune erreur console.
- Suite : l'utilisateur regarde `/matchs` en local, push ; puis les autres pages publiques
  (effectif, actualités, projet, où nous voir) au même système.

**23:57** · **[clôture] Fin de séance, la lenteur en tête de la suite**

Séance longue, ouverte à 12:16. Le site est passé en avant-première pour Tom, derrière une
barrière, sur `volley.valentincheron.fr` : base Turso et bucket R2 de production, application
Coolify, sauvegardes. Puis l'accueil en porte d'entrée, le contenu réel (cinq vidéos de la chaîne,
douze matchs du calendrier fédéral dont trois sans horaire), le tableau à la seconde, les matchs
sans horaire, et la refonte « trop tassé » en trois étapes, chacune critiquée à froid puis
validée par l'utilisateur avant le push.

Dernier retour de l'utilisateur : en production, le site lui paraît « vraiment plutôt lent ».
C'est la première chose à regarder à la prochaine séance, en mesurant avant de corriger.

- Portée : ROADMAP (sections « lenteur en production » et « refonte, suite »), carnet.
- Vérifié : tout est poussé sur `main` ; serveur de développement arrêté ; base de développement
  sans données d'essai.
- Suite : mesurer la lenteur en production page par page (serveur, base, navigateur) et la
  corriger ; puis les autres pages publiques au système de la refonte. Pour Tom : relire et
  publier les cinq étapes du projet en brouillon, l'adresse du gymnase Jean Boistard, les trois
  horaires à confirmer, la poule SMB à confirmer, l'accord de droit à l'image.

## 02-10-2026

**11:43** · **[jalon] Audit du groupe, deuxième passage : la lenteur mesurée et corrigée**

Demande de l'utilisateur : un site sans aucun ralentissement, quelque chose de carré, par le groupe
d'audit au complet. La lenteur d'abord, mesurée avant d'être corrigée. En production, derrière la
barrière, l'accueil répondait en 500 à 725 ms et même les mentions légales en 250 ms.

La décomposition est nette. Le rendu ne coûte que quelques millisecondes. La barrière ajoute
environ 70 ms à chaque requête, fichiers statiques compris, et disparaîtra au lancement. Le reste
est l'attente de Turso : 100 à 130 ms par aller-retour depuis le VPS (35 ms depuis le poste, la
connexion se fermant entre deux visites), et les pages en enchaînaient une à quatre vagues, le pied
de page imposant au moins une lecture à toutes.

Le correctif est un cache des lectures posé sur le client de base, vidé à chaque écriture une fois
celle-ci terminée, servi puis rafraîchi en coulisse passé cinq minutes, qui ne garde jamais les
tables sensibles. En local, l'accueil passe de 165 à 16 ms côté serveur, les autres pages à 4 à
9 ms. Prouvé de bout en bout : un manifeste enregistré dans l'administration, puis remis au départ,
apparaît aussitôt sur un accueil déjà en cache. La purge, qui attendait avant chaque page de
l'administration, part après la réponse.

Les quatre relectures à froid ont rendu 58 constats, 64 avec ceux de la mesure. Corrigés : le
blocage du compte d'autrui au-delà de 30 essais (S19, régression du correctif d'hier, prouvé avant
et après), le bandeau LED qui tournait hors écran (D12), MorphSVG chargé partout (D13), les
libellés sous 13 px du tableau de match, la purge qui disait réussir en échouant, la durée de cache
des photos alignée sur la politique, trois faits de la politique, deux saisons au même nom. Deux
constats retirés, dont une fausse alerte de ma part sur des données de démonstration en production :
le fichier analysé avait été réécrit depuis le serveur local.

Erreur de séance à retenir : deux semis de démonstration lancés par moi ont chacun créé une saison
courante avant d'échouer, ce qui a vidé `/matchs` en développement. Le semis refuse désormais un
second passage, et la base de développement a été purgée puis ressemée une fois.

- Portée : `src/lib/db/cache-lectures.ts` et ses tests, `db/index.ts`, `gsap.ts`, `gsap-morph.ts`,
  intro, `tentatives.ts`, `purges.ts`, route de purge, `stockage.ts`, `contact.ts`, saisons,
  tableau de résultat, pastille, politique de confidentialité, `semer-demo.ts`, ROADMAP, codex,
  `audits/2026-10-02-audit-groupe.md`.
- Vérifié : 187 tests (aussi en UTC et en heure du Pacifique), `tsc`, lint ; build de production
  local, mesures avant et après ; parcours de l'administration avec un compte jetable supprimé
  ensuite ; tableau de résultat à 360, 390 et 1440 px ; bandeau figé hors écran ; intro rejouée
  sans erreur. Aucune opération sur la base de production. Pas de Docker sur le poste : l'image
  n'a pas été éprouvée localement.
- Suite : remesurer la production page par page après ce déploiement ; trancher les questions
  d'arbitrage (barrière, `.env.production.local`, sonde Todai, santé du conteneur, tests dans
  l'image, composition) ; puis la refonte des autres pages publiques, avec les espaces insécables.

**13:54** · **[jalon] Les arbitrages de l'audit, faits dans la séance**

Reprise après une coupure de l'API, sans perte : l'audit était déjà poussé. L'utilisateur a
tranché douze questions, toutes sur l'option recommandée sauf une : les demandes d'exercice des
droits seront vues par une relecture hebdomadaire plutôt que par un e-mail.

Faits : le fichier des accès de production renommé en `.env.turso-prod.local`, que Next ne charge
jamais (le build n'annonce plus que `.env.local`) ; les tests dans l'image avant la compilation et
une santé de conteneur qui n'interroge plus la base ; les tableaux de l'accueil qui mènent à la page
du match ; l'en-tête de navigation sur l'accueil, caché pendant l'intro et en fondu ensuite, par la
seule classe que l'intro pose déjà ; un dégradé plus dense sous le titre des miniatures ; un seul
appel à s'abonner par page. La règle « on » et « nous » était déjà tenue, elle passe au codex.

Ce qui revient au poste Coolify part en consigne écrite : santé sur `/robots.txt`, sonde Todai sur
`/sante` dès maintenant, purge toutes les heures avec battement, nom du fichier de secrets, et la
vérification du premier build qui lance les tests.

- Portée : `Dockerfile`, `resultats.ts`, `bloc-tableaux.tsx`, `ouverture.tsx`, `globals.css`,
  `bandeau-episode.tsx`, `elements-serie.tsx`, pages Série, rapport d'audit, codex, ROADMAP,
  `Coolify/docs/Consignes/point-par-point-02-fiabilite.md`, `.env.turso-prod.local` (ignoré).
- Vérifié : 187 tests, lint, build de production local ; à l'écran, en-tête caché pendant l'intro
  puis visible, lien vers l'effectif à 44 px du haut au lieu de 5 827, deux tableaux cliquables,
  aucun débordement à 390 px, aucune erreur console, dégradé en capture à 1440 px, un seul appel
  sur la Série. L'image Docker avec les tests n'a pas été éprouvée sur le poste.
- Suite : le poste Coolify applique la consigne #02 et vérifie le premier build avec tests ;
  remesurer la production page par page ; l'utilisateur dit si le nom de l'en-tête doit
  disparaître de l'accueil ; puis la refonte des autres pages publiques, avec les espaces
  insécables.

**14:03** · **[jalon] La production remesurée après le cache**

Mesure demandée par l'utilisateur, même protocole que le matin : six passages par page, nouvelle
connexion à chaque fois, derrière la barrière. L'accueil passe de 500 à 725 ms à 215 à 240 ms, les
matchs de 470 à 580 ms à 220 à 240 ms, l'effectif de 335 à 445 ms à 200 à 212 ms. Toutes les pages
sont désormais au niveau d'un fichier statique (`/icon.svg`, 186 à 220 ms) : ce qui reste est le
réseau, le chiffrement et la barrière. Sur une connexion réutilisée, les mentions légales répondent
en 113 ms contre 104 pour le statique.

Deux points relevés. La première visite de `/matchs` après le déploiement a pris 3,0 s : conteneur
neuf, cache vide, connexion à Turso à ouvrir ; la page n'est à froid qu'une fois par déploiement.
Et un défaut introduit par le cache : `/sante` répondait aussi vite qu'un statique, son
`select 1` était gardé en mémoire et la sonde aurait dit « ok » base coupée. Corrigé et poussé :
une lecture sans table ne se garde plus, test ajouté.

- Portée : `src/lib/db/cache-lectures.ts` et ses tests.
- Vérifié : nouvelle version en ligne (en-tête de l'accueil présent), ce qui prouve aussi que
  l'image a passé ses tests ; 188 tests, `tsc`, lint.
- Suite : vérifier que `/sante` coûte de nouveau un aller-retour après ce déploiement ; le poste
  Coolify applique la consigne #02 ; fiche de page pour la barre de navigation (avec l'idée du
  ballon qui devient « POINT PAR POINT ») ; puis la refonte des autres pages publiques.

**14:26** · **[jalon] La saccade de l'accueil, à la vidéo et au tableau des matchs**

Signalée par l'utilisateur : un ralentissement en défilant vers la vidéo et le tableau des matchs.
Le fil principal ne montrait rien (aucune tâche longue, même processeur bridé quatre fois) : c'est
la trace de rendu complète qui l'a trouvée. La rastérisation était multipliée par cinq dès que la
section du tableau entrait à l'écran, et le restait sur la section de l'équipe.

Mesures par élimination, même défilement à chaque fois : le grain ne pesait que 15 %. Les deux vrais
coûts étaient les chiffres LED, chacun avec trois lueurs en filtre SVG, redessinés à chaque
allumage et à chaque seconde du compte à rebours, et les portraits posés sur le motif du maillot en
SVG. Retirer les lueurs ou le motif aurait touché l'identité. On les isole donc sur leur propre
couche graphique (`couche-propre`, `will-change: transform`) : ils sont dessinés une fois, puis
composés. Rastérisation du même défilement : 1,2 à 1,4 s avant, 0,47 à 0,61 s après, de 75 à 85 %
de moins dans la zone signalée. Rendu identique, vérifié en capture.

- Portée : `globals.css` (utilitaire `couche-propre`, grain en couche), `tableau-prochain-match.tsx`,
  `tableau-resultat.tsx`, `portrait-joueur.tsx`.
- Vérifié : traces de rendu avant, après et par élimination, deux passages après ; captures du
  tableau LED et de la section Équipe ; 188 tests, `tsc`, lint.
- Suite : l'utilisateur redéfile l'accueil en production pour confirmer à son ressenti ; fiche de
  la barre de navigation (ballon et « POINT PAR POINT ») ; puis la refonte des autres pages.

**15:30** · **[jalon] Les blocs de l'accueil ne sautent plus à la molette**

L'utilisateur voyait encore une saccade après le correctif des couches. Mesurée sur la production
elle-même (relais local qui ajoute les identifiants de la barrière sans les écrire nulle part), avec
un écran haute densité et une molette simulée : aucune image lente sur 1 555, aucune tâche longue,
la miniature chargée avant le défilement. Ni la barrière ni le rendu n'étaient en cause.

Ses réponses ont tranché : Brave, à la molette, « des éléments sautent ». Les blocs de l'accueil
apparaissaient en montant de 48 px avec une courbe `expo.out`, déclenchés quand leur haut atteignait
85 % de l'écran : presque tout le trajet en un dixième de seconde, ajouté au cran de molette. La
montée passe à 24 px, en `power2.out` sur 0,8 s, déclenchée dès l'entrée par le bas. Le geste reste
le même, il n'est plus sec. À juger par l'utilisateur sur la production.

- Portée : `src/components/public/accueil/revelations.tsx`.
- Vérifié : blocs révélés progressivement au défilement, pleine opacité et position finale, aucune
  erreur ; 188 tests, `tsc`, lint, build.
- Suite : l'utilisateur juge à la molette sur la production ; si un saut persiste, le filmer pour
  situer le bloc ; puis la fiche de la barre de navigation.

**16:11** · **[jalon] Une équipe de vérification en production**

Demande de l'utilisateur, avec son accord explicite pour la base de production (question à choix) :
une équipe pour vérifier la mise en page de l'Effectif, numérotée 0 ou 99 pour qu'aucun joueur
fictif ne passe inaperçu. Douze joueurs répartis comme une D2 (2 passeurs, 4 réceptionneurs, 3
centraux, 1 pointu, 2 libéros), un capitaine, présentation « à effacer », adresses en `-verif`.
Tout est marqué `demo = 1` (joueurs et lignes d'effectif), inséré en une transaction, après avoir
vérifié que la production n'avait aucun joueur.

À retenir : la production contient donc des données de démonstration, contrairement à la décision
du 01-10. Elles s'enlèvent avec `db:purge-demo` lancé sur la base de production, avec accord, avant
que Tom ne saisisse sa vraie équipe.

- Portée : base de production, tables `joueurs` et `effectifs` (12 lignes chacune).
- Vérifié : 12 lignes relues après la transaction ; `/effectif` en production les affiche.
- Suite : l'utilisateur valide la fiche de l'étape 4 ; coder l'Effectif dans une nouvelle séance,
  vérifier sur cette équipe ; purger l'équipe de vérification avant la vraie saisie de Tom.

**16:22** · **[jalon] Une vraie démo en production, à côté du contenu réel**

L'utilisateur revient sur la décision du 01-10 : Tom ne voit que la production, c'est donc là que
la démonstration sert à juger le rendu. Accord pour compléter. Règle tenue : rien de réel n'est
touché (les cinq épisodes, les douze matchs du calendrier fédéral, les cinq étapes en brouillon que
Tom doit relire), aucun score inventé pour un vrai match. Seules les rubriques vides reçoivent des
contenus visiblement factices, tous marqués `demo = 1`.

Ajoutés : un match amical de démonstration joué le 26-09 (3-1, sets détaillés) pour que l'accueil
et les Matchs aient un dernier résultat, un classement d'« Équipe démo » où VF Francheville est
troisième, trois actualités, trois membres du staff, trois partenaires. Pas de texte d'accès à la
salle : c'est une vraie information que seul Tom a. Le script refusait de tourner si l'une de ces
rubriques contenait déjà quelque chose.

- Portée : base de production, `rencontres` et `sets_rencontre` (1 match), `classements` et
  `lignes_classement`, `actualites`, `membres_staff`, `partenaires`.
- Vérifié : comptes relus ; l'accueil, `/matchs`, `/actualites` et `/partenaires` les affichent ;
  le staff de `/effectif` attend la fin du cache (écriture faite hors de l'application).
- Suite : `db:purge-demo` sur la production, avec accord, quand Tom commencera la vraie saisie ;
  coder l'Effectif selon la fiche de l'étape 4.

**16:42** · **[jalon] Audit du site avec ses données, et le saut enfin trouvé**

L'utilisateur signale le classement de `/matchs` et demande un audit complet par les trois
casquettes, maintenant que la production a du contenu. Trois relectures en parallèle sur la
production en lecture seule (relais local qui ajoute la barrière sans écrire les identifiants et
refuse tout sauf GET), pendant que je corrigeais le classement.

Le saut à la molette est enfin objectivé : ce n'étaient ni le rendu ni la montée des sections, mais
les numéros de maillot qui roulaient de 0 à 9 (1 267 px en 450 ms avec les 99 de l'équipe de
vérification) pendant que leur section montait encore, et les tableaux LED qui s'allumaient en
sursaut. Roulement réduit à deux crans après la montée, LED en veilleuse. Autres corrections : les
accents des titres en capitales qui touchaient la ligne du dessus, le tableau qui disait « Prochain
match » sur tous les matchs à venir, la compétition du dernier résultat, l'Open Graph, une saison
inconnue en 404, l'agenda sans horaire, l'encart d'abonnement en doublon, les pastilles de lieu.

Le constat le plus gênant me concerne : la démonstration ajoutée en production contredit le réel
(l'épisode 4 raconte un premier match perdu, la démo montre une victoire et un bilan positif). À
arbitrer, avec le bilan des amicaux, les salles sans commune et une série de choix de composition.

- Portée : `audits/2026-10-02-audit-groupe.md` (passe de l'après-midi), 18 fichiers de `src/`.
- Vérifié : 188 tests, `tsc`, lint, build ; captures du titre long à 390 px, du tableau de résultat
  à 1440 px, du classement à 390 px ; aucune erreur console, aucun débordement.
- Suite : trancher les questions d'arbitrage de cette passe ; l'utilisateur rejuge le saut à la
  molette en production ; puis l'Effectif selon la fiche de l'étape 4.

**17:42** · **[clôture] Arbitrages de l'audit du site, la démo remise d'accord avec la série**

Huit arbitrages rendus par l'utilisateur, tous sur l'option recommandée : la démonstration gardée
mais cohérente, un type de rencontre pour sortir les amicaux du bilan, la commune obligatoire pour
une salle, le rang en chiffre géant à côté du classement, le bouton de lecture dans l'image
partout, « Épisode 04 » seul, les miniatures en couleur à l'entrée à l'écran au téléphone, et le
prochain match avec l'équipe en bas du dernier épisode.

Fait dans la foulée, avec son accord, sur les seules lignes marquées démo : le match amical devient
une défaite 0-3 (21-25, 23-25, 19-25), en accord avec l'épisode 4 qui raconte un premier match
perdu, et le classement de démo repasse à zéro match joué. Le reste est inscrit à la ROADMAP.

- Portée : base de production (`rencontres`, `sets_rencontre`, `lignes_classement`, lignes démo
  seulement), ROADMAP.
- Vérifié : relu en base après la transaction (0-3, trois sets, zéro match joué au classement).
- Suite : nouvelle séance pour coder les arbitrages (type de rencontre et sa migration, salles,
  classement, Série) puis l'Effectif selon la fiche de l'étape 4 ; l'utilisateur rejuge le saut à
  la molette en production.

**18:05** · **[jalon] Les arbitrages codés, et l'Effectif refondu**

Travail en autonomie complète, à la demande de l'utilisateur. Le type de rencontre (championnat,
coupe, amical) entre en base par la migration 0011, appliquée en production avant le code, comme
l'ordre l'exige ; seul le championnat compte au bilan, et le match de démo est classé amical. Plus
d'itinéraire vers un nom de salle seul (« Adresse à confirmer », et l'administration signale la
salle à compléter). Notre place en chiffre géant à côté du classement. Sur la Série, bouton de
lecture au centre de l'image partout, un seul signal sur le dernier épisode, miniatures en couleur
à l'entrée à l'écran sur tactile, et le prochain match avec l'équipe en bas du dernier épisode.

L'Effectif suit la fiche de l'étape 4 : ouverture avec chiffre géant, une rangée par poste dont le
nom reste en place au défilement, staff en chapitre, fiche joueur à l'échelle. La critique à froid
a relevé neuf défauts, tous corrigés : classement trop étroit à 1024 px (deux colonnes à 1280 px
seulement), nom long sur cinq lignes (corps des chapitres au-delà de 14 signes), carte du joueur
calée en bas, scores en dents de scie, double bord gauche sur la Série, bouton de lecture pas encore
centré sur la page d'épisode, nombre du poste, textes à 15 px, noms d'équipe coupés au trait
d'union. Aussi : le titre de page à interligne 1, « Avant la série » en double, le lien
d'actualités en double, la page en cours marquée dans le pied de page.

- Portée : migration `0011_type-rencontre`, administration des matchs, `bilan.ts`, classement,
  salles, Série, page d'épisode, Effectif et fiche joueur, pied de page, `globals.css`.
- Vérifié : 189 tests, `tsc`, lint, build ; aucun débordement ni texte sous 13 px de 390 à
  1920 px sur l'Effectif et la fiche ; classement à 1024 et 1440 px ; alignements et centre du
  bouton mesurés au pixel ; aucune erreur console. Base de production migrée et relue (12
  championnats, 1 amical).
- Suite : à proposer à l'utilisateur, les postes à deux joueurs qui laissent un tiers vide et
  « Parcours » sous la carte du joueur ; puis la refonte des pages restantes (actualités, le
  projet, où nous voir, partenaires, contact, juridiques), avec une vraie image par page.

**22:45** · **[jalon] Étape 5 : tout le site public au même système**

Fiche des pages restantes écrite puis arbitrée par l'utilisateur (quatre choix, tous recommandés) :
la une des actualités en bandeau puis des cartes à image, le projet en fil vertical avec photos en
alternance, un mur de logos et l'appel aux partenaires en bandeau, deux colonnes pleines pour Où
nous voir et le contact. Un composant commun, `ImageOuMotif`, montre la photo quand Tom en a mis
une et le motif du maillot sinon : jamais de case vide. Le fil du projet est une version verticale
qui n'assombrit jamais le texte, tracé d'emblée sous mouvement réduit.

Trois écarts assumés au codage, écrits dans la fiche : le mur de logos reste sombre (logos en blanc
qui reprennent leur couleur au survol, plus juste pour l'identité nocturne) ; pas de délai de
réponse annoncé sur le contact, ce serait un engagement pris au nom de Tom ; les pages juridiques
au corps des chapitres, « Confidentialité » ne tenant pas au titre de page.

La critique à froid a relevé sept défauts et quatre propositions, tout est traité : titre de la une
qui n'était pas un titre, chiffre décalé à 1024 px, noms de partenaires qui débordaient au
téléphone, interligne cassé par un lien, mention du contact à 14 px, itinéraire en double, contour
des boutons de la 404 ; chapô dans le bandeau, salle en pleine largeur sans texte d'accès, mur à
autant de colonnes que de partenaires, phrase d'ouverture des actualités.

- Portée : pages actualités, article, le projet, partenaires, où nous voir, contact, juridiques,
  404 ; `image-ou-motif.tsx`, `projet/fil-vertical.tsx`, `actions-match.tsx`, fiche section 8.
- Vérifié : 189 tests, `tsc`, lint, build ; aucun débordement ni texte sous 13 px ni case qui
  déborde sur 9 pages à 390, 1024 et 1440 px ; hiérarchie des titres relue ; fil tracé au
  défilement et d'emblée sous mouvement réduit (critique) ; aucune erreur console. Une première
  sonde avait tourné sur un ancien serveur resté ouvert : écartée et refaite.
- Suite : l'utilisateur et Tom regardent le site complet en production ; fixer avec Tom le délai de
  réponse du contact ; les photos de Tom donneront aux pages leur vraie image ; dette restante à la
  ROADMAP (canonical, données structurées, glossaire, espaces insécables).
