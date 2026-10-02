# Codex , concepts du projet

> Base de connaissances curatée. À chaque ajout : bonne catégorie + sommaire à jour.

## Sommaire

- [Principes de conception](#principes-de-conception)
  - [Le volley est un sport d'équipe](#le-volley-est-un-sport-déquipe)
  - [Le match est la source unique](#le-match-est-la-source-unique)
  - [La saisie est partielle par nature](#la-saisie-est-partielle-par-nature)
  - [Le site vieillit dignement](#le-site-vieillit-dignement)
  - [Des champs, jamais de la mise en page](#des-champs-jamais-de-la-mise-en-page)
- [Direction artistique](#direction-artistique)
  - [La largeur : des marges, mais moins, et des bandeaux pleine largeur](#la-largeur--des-marges-mais-moins-et-des-bandeaux-pleine-largeur)
  - [Le motion design est un objectif, pas une décoration](#le-motion-design-est-un-objectif-pas-une-décoration)
  - [Le système de design, figé le 29-09-2026](#le-système-de-design-figé-le-29-09-2026)
- [Conventions](#conventions)
  - [Le marquage des données de démonstration](#le-marquage-des-données-de-démonstration)
  - [L'effectif appartient à la saison, pas au joueur](#leffectif-appartient-à-la-saison-pas-au-joueur)
  - [Une heure saisie est une heure de Paris](#une-heure-saisie-est-une-heure-de-paris)
  - [Un score inhabituel s'enregistre, un score impossible non](#un-score-inhabituel-senregistre-un-score-impossible-non)
  - [Une grille de saisie survit à un refus](#une-grille-de-saisie-survit-à-un-refus)
  - [Le texte léger des actualités](#le-texte-léger-des-actualités)

## Principes de conception

### Le volley est un sport d'équipe

Posé par l'utilisateur au cadrage du 19-09-2026, en refusant un classement interne des marqueurs
que je proposais. **Le site ne classe jamais les joueurs entre eux.** Pas de palmarès individuel,
pas de meilleur marqueur mis en avant, pas de tri décroissant sur une statistique de joueur.

Ce que cela n'interdit pas : afficher les chiffres d'un joueur **sur sa propre page**, seuls, sans
comparaison possible. Et mettre en avant, partout ailleurs, les chiffres collectifs.

C'est un principe de fond, pas une préférence d'affichage : il tranche d'avance toute demande de
fonctionnalité qui reviendrait à hiérarchiser douze copains.

### Le match est la source unique

Aucune statistique n'est saisie deux fois. On remplit une feuille de match, et les fiches joueurs,
les totaux de saison et le bilan collectif en découlent par calcul. Conséquence directe : aucune
donnée dérivée n'est stockée telle quelle, et deux pages du site ne peuvent pas se contredire.

### La saisie est partielle par nature

Tous les champs de statistique sont nullables, et c'est volontaire. Un match peut n'avoir qu'un
score, ou un score plus quelques joueurs, ou une feuille complète. Le site doit s'afficher
proprement dans les trois cas, sans jamais montrer de case vide ni de zéro trompeur.

La raison est humaine et non technique : le dépouillement vidéo, c'est vingt minutes par match
pendant huit mois. Le site doit tenir la semaine où personne n'a le temps, sinon il meurt en
novembre comme tous les sites d'équipe.

### Le site vieillit dignement

Une section sans contenu à jour **disparaît** plutôt que d'afficher une donnée périmée. Pas de
prochain match connu, pas de bloc prochain match sur l'accueil. Classement non tenu depuis trop
longtemps, section masquée. Un site qui affiche une date de novembre au mois de mars décrédibilise
tout ce qu'il dit par ailleurs, y compris ce qui est encore vrai.

### Des champs, jamais de la mise en page

L'administration saisit des champs typés. Pas de HTML libre, pas de blocs à disposer, pas de
création de pages nouvelles. La structure du site est fixe, seul son contenu bouge.

Deux effets recherchés : le site ne peut pas devenir laid en trois mois, et un CMS complet ne peut
pas naître par accident au fil des demandes.

## Direction artistique

Demandé par l'utilisateur le 20-09-2026, en fin de première séance de code, après avoir vu les
premiers écrans d'administration. **Ces deux points sont à revoir**, ils ne sont pas tenus par
l'existant : les écrans actuels ont été posés pour valider la mécanique, pas l'apparence.

### La largeur : des marges, mais moins, et des bandeaux pleine largeur

Le site est actuellement contenu dans une colonne centrée de `max-w-5xl`, soit 1024 pixels, avec
une marge latérale importante sur un écran large. **La marge reste**, elle n'est pas remise en
cause : c'est elle qui rend le texte lisible et le site respirable.

Ce qui change, c'est son dosage et son caractère absolu.

- **Réduire la marge**, donc élargir la colonne de contenu. Un site de média sportif qui vit de
  photos et de vidéos ne peut pas tenir dans une colonne de texte.
- **Ne pas hésiter aux bandeaux pleine largeur.** Une image de match, une bande de résultats, un
  lecteur vidéo, une section de couleur : ces éléments vont d'un bord à l'autre de l'écran, et
  seul leur contenu textuel reste dans la colonne. C'est l'alternance entre pleine largeur et
  colonne contenue qui donne son rythme à une page.
- Conséquence pratique : la largeur ne se décide plus page par page. Il faut une **échelle de
  largeurs** nommée (colonne de lecture, colonne large, pleine largeur) appliquée partout, sinon
  chaque écran aura la sienne.

### Le motion design est un objectif, pas une décoration

Demande explicite et insistante de l'utilisateur : **« je voudrais qu'on travaille VRAIMENT le
motion design »**. Ce n'est pas une finition de fin de projet, c'est une ambition à part entière
du site, et elle doit être prévue dans la conception plutôt que plaquée après coup.

L'exemple donné, qui dit bien l'intention : **au défilement, un ballon de volley qui passe
au-dessus d'un filet**. L'idée n'est pas l'effet en soi, c'est que le mouvement raconte le sport
dont le site parle.

Pistes à explorer le moment venu, pour ne pas repartir de zéro :

- **Le défilement comme trame de jeu** : un ballon qui traverse la page, un filet qui sépare deux
  sections, une trajectoire qui relie le dernier épisode au prochain match.
- **Les chiffres qui se posent** : un score qui s'inscrit set par set plutôt que d'apparaître
  d'un bloc, un bilan de saison qui se construit.
- **Les entrées d'éléments** : fiches joueurs qui se placent comme une composition d'équipe,
  cartes de match qui arrivent dans l'ordre du calendrier.
- **Les transitions entre pages**, de la liste de l'effectif vers la page d'un joueur.

Trois garde-fous, pour que l'ambition ne se retourne pas contre le site.

1. **`prefers-reduced-motion` est respecté**, déjà en place dans `globals.css`. Toute animation
   ajoutée doit s'y plier, sans exception.
2. **Le mouvement ne retarde jamais la lecture.** Un visiteur qui cherche l'heure du prochain match
   ne doit pas attendre la fin d'une animation pour la voir.
3. **Rien de tout cela ne va dans l'administration.** L'ami y saisit des résultats, il veut de la
   vitesse et de la prévisibilité, pas un spectacle.

### Le système de design, figé le 29-09-2026

Tranché par l'utilisateur sur la planche de style (`/planche`, développement seulement), détail et
raisons dans `veille.md`, sections 7 à 9. Les jetons vivent dans `src/app/globals.css`, nulle part
ailleurs.

- **Couleurs** (version 2, variante « net », 30-09-2026, `fiches/palette.md`) : le gymnase le
  soir. Fond `nuit` `#0e0c11`, noir profond à peine violacé ; texte `craie` `#f5f6f7`, un blanc
  d'écran net. Le turquoise en accent (mot, filet, motif), plus de grand aplat turquoise. Turquoise `#64979d` et violet `#66486b` réels du maillot, jaune ballon `#f2bf2e`.
  Une fonction par couleur : **turquoise l'équipe, violet les matchs (chapitre `nuit-violet`),
  jaune ce qui est en direct ou nouveau**. Le violet ne porte jamais de texte. **La lumière
  n'existe que sur les objets lumineux** : tableau de score (`led` `#ffae1f`, segments éteints
  `led-eteinte`, halo `--led-halo`), bandeau LED, ballon. Survol par inversion ou remplissage,
  jamais par une lueur ; focus en contour jaune. Victoire et défaite sans couleur : pastille
  pleine V ou contour D (`components/pastille-resultat.tsx`). Seul signal hors palette : `erreur`.
  Ni bleu nuit, ni cyan ravivé, ni dégradé, ni verre dépoli. L'administration partage tout.
- **Afficheur LED** (`components/public/afficheur-led.tsx`) : sept segments dessinés en SVG, chaque
  segment une rangée de points (trait en pointillés à bouts ronds, comme les tableaux Bodet),
  segments éteints visibles dessous, glow en trois couches sur les seuls chiffres allumés.
  Préféré à la police DSEG : aucune dépendance à télécharger.
- **Résultats** : le dernier match en tableau LED (`tableau-resultat.tsx`), à côté du prochain ;
  les précédents en cartes défilantes (`resultats-precedents.tsx`), score géant plein pour une
  victoire, en contour pour une défaite.
- **Typographie** : une seule famille, **Archivo**, chargée avec son axe de largeur.
  `titre-affiche` (largeur 62 %, graisse 800, capitales, chiffres à largeur fixe) pour la voix du
  site public ; `titre-admin` (largeur 80 %, graisse 700) pour les écrans de travail ; largeur
  normale pour le texte. Les chiffres à largeur fixe sont une exigence : un score qui défile ne doit
  pas bouger latéralement, et c'est ce qui a écarté Big Shoulders, pourtant la plus typée.
- **Largeurs** : `colonne-lecture` (62 caractères), `colonne-large` (84 rem plus la marge),
  `pleine-largeur`. La marge suit l'écran, de 1 à 4 rem.
- **Mouvement** : nerveux et net. Trois durées (`--duree-breve` 160 ms, `--duree` 280 ms,
  `--duree-appuyee` 420 ms) et deux courbes (`ease-ressort`, léger rebond ; `ease-sortie`, arrêt
  franc), partagées avec GSAP.
- **Portraits** : surimpression sur la couleur de fonction (nuit, turquoise, craie pour
  l'effectif), avec cadrage sur le point de visage.
- **Motif du maillot** : en filigrane, un contour fin et à peine perceptible ; le halo, qui ne
  révèle le motif que sous une lumière, est réservé à la scène du ballon.

### L'accueil et ses rendez-vous (30-09-2026)

- **Données** : `lib/accueil.ts` lit tout en une fois, contenu publié seulement ;
  `lib/resultats.ts` (logique pure, testée) décide ce qui est un résultat et calcule le compte à
  rebours. Rendu dynamique à chaque visite.
- **Agenda** : `/agenda/<slug>` renvoie le fichier `.ics` d'un match à venir (`lib/agenda.ts`,
  RFC 5545, testé). Slug vérifié par expression avant toute requête ; tout le reste répond 404.
- **Vidéo** : façade (`lecteur-episode.tsx`) ; YouTube ne se charge qu'au clic, en
  `youtube-nocookie`. La miniature passe par l'optimiseur de Next, donc par notre serveur.
- **`EQUIPE` et `CHAINE_YOUTUBE`** vivent dans `lib/site.ts`, comme le nom du site. Tant que la
  chaîne vaut `null`, le bouton « S'abonner » ne s'affiche pas.
- **Mouvement** : `data-apparait` (un bloc monte une fois) et `data-allume` (un tableau s'allume
  avec un seul scintillement), dans `accueil/revelations.tsx`, coupés sous mouvement réduit.

### Les matchs publics (30-09-2026)

- **Statut public** (`lib/calendrier.ts`, testé) : l'état saisi ne suffit pas. Un match à venir
  dont l'heure est passée est « en cours » trois heures (`DUREE_EN_COURS`), puis « score à
  venir ». Jamais de 0-0 inventé.
- **Heure** : toujours celle de la salle, à Paris, écrite à la française (`heure()`,
  `dateEtHeure()` : « samedi 3 octobre à 20 h 30 »), quel que soit le fuseau du visiteur.
- **Adresses** : `/matchs?saison=2026-2027` (en paramètre, pour ne pas entrer en collision avec
  `/matchs/<slug>`) et `/matchs/<slug>`.
- **Lumière** : les lignes du calendrier sont mates ; seuls les tableaux s'allument.
- **Ordre du score** (décision de l'utilisateur, 30-09-2026) : notre score d'abord dans les listes
  (calendrier, cartes de l'accueil) ; locaux d'abord dans les tableaux LED, où les noms sont écrits.
- **Anciennes adresses** : quand l'administration change le slug d'un match, l'ancien va dans
  `anciens_slugs_rencontre` et `/matchs/<ancien>` redirige en 308. Un lien partagé survit à un report.
- **Composants partagés** : `ActionsMatch` (agenda, itinéraire, Google Agenda), `EnTete` pour les
  pages hors accueil, `matchPublic` mis en cache par requête (page et métadonnées).

### La série publique (30-09-2026)

- **Lectures** : `lib/serie.ts`, épisodes publiés avec leur match visible, voisins, anciennes
  adresses (`anciens_slugs_episode`, redirection 308 comme pour les matchs).
- **Lien réciproque** : la page d'un épisode montre le match raconté en tableau LED et mène à sa
  page ; la page d'un match mène à la page de l'épisode.
- **Jaune** : « S'abonner » et « Nouveau » (épisode de moins de quatorze jours) seulement ; deux
  appels à l'abonnement au plus par page, jamais de fenêtre surgissante.
- **Pas de donnée absente** : ni durée, ni chapitres, ni prochain épisode tant qu'ils ne sont
  pas en base. Le texte d'accroche reste neutre en attendant celui de l'ami.

### Le focus clavier (30-09-2026)

La règle globale `:focus-visible` vit dans `@layer base` : hors couche, elle écraserait toute
classe utilitaire. Sur un bouton qui porte une image positionnée (façade vidéo), l'anneau se
dessine sur un calque au-dessus de l'image, sinon elle le recouvre.

### L'effectif public (30-09-2026)

- **Grille** : par poste (`grouperParPoste`), cartes égales, jamais de tri par statistique ni de
  compteur. Le capitaine porte un « C » discret, pas une carte plus grande.
- **Portrait** (`PortraitJoueur`) : photo en surimpression turquoise, sinon le numéro géant sur le
  motif, sinon le poste. Photos : `urlPhoto()` renvoie l'adresse R2 ou rien.
- **Vie privée** : l'âge seulement, jamais la date de naissance ; prénom et nom complet (décision
  de l'utilisateur). Le slug d'un joueur naît avec lui et n'est jamais réattribué.

## Conventions

### Le marquage des données de démonstration

Le site est livré rempli de faux joueurs et de faux matchs, pour que l'ami n'ait pas à remplir un
site vide avant de l'avoir vu vivre. Le risque connu de cette approche est qu'un faux joueur reste
en ligne le jour de la mise en service.

La parade retenue n'est pas une note dans un coin : **chaque enregistrement de démonstration porte
une colonne `demo`**, l'administration affiche un bandeau tant qu'il en reste un seul, et une
commande unique les purge tous. Il faut alors vouloir ignorer un bandeau pour se tromper.

### L'effectif appartient à la saison, pas au joueur

Le numéro de maillot et le poste changent d'une année sur l'autre. Ils sont donc portés par la
table `effectif`, qui relie un joueur à une saison, et non par la table `joueur`. Sans cela,
changer de numéro en septembre réécrirait rétroactivement toutes les feuilles de match des saisons
passées.

### Le bloc que Next écrit pour les agents vit dans `AGENTS.md`

Depuis Next 16, `next dev` détecte un assistant de code et **écrit de lui-même un bloc
d'instructions** entre les marqueurs `<!-- BEGIN:nextjs-agent-rules -->` et `END`, dans `CLAUDE.md`
s'il n'existe pas d'`AGENTS.md`. L'effacer ne sert à rien, il revient au lancement suivant (lu dans
`node_modules/next/dist/server/lib/generate-agent-files.js` le 29-09-2026, ce n'est pas une
injection).

Le bloc est donc placé dans `AGENTS.md`, que Next préfère dès qu'il l'y trouve. `CLAUDE.md` reste
écrit par nous seuls. Si le bloc réapparaît dans `CLAUDE.md` après une montée de version de Next,
c'est que son contenu a changé : le redéplacer dans `AGENTS.md`.

### Une heure saisie est une heure de Paris

Un match saisi à « 20:30 » a lieu à 20 h 30 à Paris. `new Date("2026-10-04T20:30")` lirait cette
heure dans le fuseau de la machine, et le VPS tourne en heure universelle : chaque match serait
décalé d'une ou deux heures selon la saison. Toute date avec heure venant d'un formulaire passe donc
par `depuisChampDateHeure` (`src/lib/dates.ts`), testée sur les deux changements d'heure.

### Un score inhabituel s'enregistre, un score impossible non

L'analyse d'un score (`src/lib/score.ts`) distingue deux gravités. Une **erreur** bloque : un set à
égalité, un set à moitié saisi, un trou dans la suite des sets. Une **alerte** prévient sans
bloquer : un set gagné à 24, un écart d'un point, un set joué après la fin du match. Un championnat
départemental peut avoir ses formats particuliers, et c'est l'ami qui sait ce qui s'est passé dans
la salle, pas le code. La même fonction tourne en direct sur l'écran du gymnase et dans l'action
serveur, qui seule fait foi.

### Une grille de saisie survit à un refus

React vide les champs non contrôlés d'un formulaire après chaque envoi, y compris quand le serveur
le refuse. Sur un formulaire de trois champs, c'est une gêne ; sur un calendrier de vingt lignes ou
un score de cinq sets, c'est l'abandon. Les écrans de saisie longue gardent donc leurs valeurs dans
l'état du composant, avec des champs contrôlés. Et un enregistrement groupé est tout ou rien : une
seule ligne fautive et rien ne part, avec le numéro de chaque ligne à corriger.

Pour un formulaire court, une technique plus légère suffit : en cas de refus, l'action renvoie les
valeurs saisies, que le formulaire prend comme valeurs par défaut. React remet le formulaire à ses
valeurs par défaut après l'envoi, donc il restaure la saisie au lieu de la vider, sans aucun champ
contrôlé (écrans de la vitrine du projet).

### Le texte léger des actualités

Décidé le 29-09-2026 contre un éditeur riche : quatre mises en forme et pas une de plus,
l'intertitre (`## `), le gras (`**`), l'italique (`*`) et le lien (`[texte](adresse)`). Assez pour
un compte rendu de match, trop peu pour casser la mise en page.

Le format est écrit dans le projet (`src/lib/texte-leger.ts`) plutôt qu'importé : aucun paquet de
plus, et un analyseur qu'on peut lire en entier. Le rendu produit des éléments React, **jamais du
HTML injecté**, et seules les adresses `http`, `https` et `mailto` deviennent des liens : un
`<script>` tapé dans le texte s'affiche comme du texte. Les boutons de l'éditeur posent la syntaxe,
l'ami n'a pas à la connaître. Les pages publiques réutiliseront le même composant `TexteLeger`,
habillé autrement.

### Le message d'un inconnu : borné, compté, et vraiment effacé

Le formulaire de contact (`src/lib/contact.ts`, fiche `fiches/contact.md`) est le seul endroit où
un inconnu écrit dans la base. Tout y est borné (nom 80, e-mail 160, message 3 000 caractères), un
champ piège invisible écarte les robots sans captcha, et un robot pris reçoit la même confirmation
qu'un humain, pour ne rien lui apprendre. Deux plafonds par heure : 3 envois par adresse réseau,
30 au total, ce second plafond ne dépendant d'aucun en-tête.

Les adresses réseau vivent dans `envois_contact`, jamais reliées au message, purgées après
24 heures. Les messages, eux, sont **la seule exception à « rien ne disparaît par accident »** :
ils s'effacent réellement un an après leur arrivée, parce que c'est ce que le formulaire promet.
Une donnée personnelle ne se garde pas au-delà de ce qui a été annoncé.

### L'adresse réseau est la dernière de `X-Forwarded-For`

Le Traefik de Coolify ajoute l'adresse réelle du client en fin de liste (vérifié en production
pour Todai). La première entrée est ce que le client a bien voulu envoyer. `lireIp` retient donc
la dernière, corrigé le 30-09-2026 : avant, un robot contournait tout plafond par adresse en
changeant l'en-tête à chaque envoi. Si un relais s'ajoute un jour devant Traefik (Cloudflare en
nuage orange), la dernière entrée deviendra ce relais : à revoir à ce moment-là.

### La mesure d'audience ne compte que le site public

Umami (choix du 30-09-2026) est chargé par `MesureAudience`, lu à l'exécution : sans `UMAMI_URL`
et `UMAMI_SITE_ID`, aucun script, ce qui est le cas en développement. L'administration, la planche
et les prototypes ne sont pas comptés, sinon l'ami ferait gonfler lui-même les chiffres qu'il
montrera aux partenaires. La règle vit deux fois, dans `pageComptee` (testée) et dans le filtre
envoyé au navigateur, mais sur **la même liste** `SEGMENTS_NON_COMPTES` : ajouter une page de
travail, c'est l'ajouter à cette liste.

Le filtre n'utilise pas d'expression régulière : une première version en avait une, et ses barres
obliques inverses se perdaient dans le HTML, ce qui cassait le filtre sans erreur visible côté
serveur.

### Un mot de passe provisoire se voit une fois, et nulle part ailleurs

Le site n'envoie pas d'e-mail : un compte créé ou réinitialisé reçoit un mot de passe provisoire
(`genererMotDePasse`, `src/lib/comptes.ts`), rendu une seule fois dans l'état de l'action et
jamais stocké en clair. Next journalisait par défaut le résultat des actions serveur, mot de passe
compris, dans `.next/dev/logs` : `logging.serverFunctions` est coupé dans `next.config.ts`. Toute
nouvelle action qui rend ou reçoit une donnée sensible profite de ce réglage ; ne pas le rallumer.

Deux règles de `refusChangement`, testées : on ne se retire pas ses propres droits, et il reste
toujours un administrateur actif.

### Une photo envoyée est relue, réduite, et nettoyée

`src/lib/images.ts` lit le format dans le contenu (jamais le nom ni le type annoncé), refuse SVG,
GIF et tout ce qui n'est pas une image, plafonne à 12 Mo et 40 millions de pixels, pivote selon
l'appareil, réduit et sort du WebP **sans aucune métadonnée** : la position GPS qu'un téléphone
inscrit dans chaque photo ne part jamais en ligne. Les clés d'objet sont tirées au hasard par le
serveur et validées avant toute lecture ou effacement (`cleValide`), ce qui protège la route de
développement contre une remontée de dossiers.

L'ancien objet s'efface **après** l'enregistrement en base, l'objet neuf **si** l'enregistrement
échoue (`lireImageDuFormulaire`). Un objet orphelin coûte moins qu'un formulaire bloqué :
l'effacement ne fait jamais échouer une action. En développement sans R2, les photos vont dans
`.stockage-local/` ; en production sans R2, l'envoi est refusé, le disque d'un conteneur
s'effaçant à chaque déploiement.

### Le classement se recopie, et se périme

Saisi à la main sur une grille préremplie (`src/lib/classement.ts`) : le rang est la position dans
la grille, une seule vérité. Au-delà de 30 jours sans mise à jour, il disparaît du site courant,
page Matchs comme accueil (`classementAJour`) ; le classement d'une saison passée est final et ne
se périme pas. Un chiffre non renseigné s'écrit « – », jamais 0.

### Le premier du mois s'écrit « 1er »

`Intl` écrit « jeudi 1 octobre » ; `dateLongue` et `dateEtHeure` passent par `jourEnLettres`,
qui écrit « 1er ». Toute nouvelle date au mois en toutes lettres doit passer par là.

### Une lecture faite resert jusqu'à la prochaine écriture

Le site ne change que quand quelqu'un écrit dans l'administration, et un aller-retour vers Turso
coûte plus que tout le rendu d'une page (100 à 130 ms depuis le VPS, mesuré le 02-10-2026). Le
client de base est donc enveloppé (`src/lib/db/cache-lectures.ts`) : un `select` identique rend la
réponse gardée en mémoire, et **toute écriture vide la mémoire une fois terminée**. La règle vit
au niveau du client, pas des pages : aucune action future ne peut oublier d'invalider.

Les comptes, sessions, tentatives de connexion et messages ne sont jamais gardés, et une écriture
qui ne touche qu'eux ne vide rien. Passé 5 minutes, une réponse est encore servie une fois
pendant qu'une lecture neuve part en coulisse : c'est le filet des écritures faites hors du
processus (`db:sql` depuis le poste, conteneur voisin pendant un déploiement). **Conséquence
pratique** : une correction faite en base de production à la main n'apparaît sur le site qu'à la
deuxième visite après 5 minutes, ou au redéploiement.

### Ce qui n'a pas à faire attendre passe après la réponse

La purge des données échues est une écriture : elle part dans `after()`, une fois la page envoyée,
dans l'administration, à la connexion et à l'envoi de contact. Même règle pour tout futur ménage,
journal ou notification.

### La voix de l'équipe : « on » sujet, « nous » complément

Tranché le 02-10-2026 (audit W15) : l'équipe parle avec « on » (« on lit tout », « on en parle »),
et « nous » n'apparaît qu'en complément ou à l'impératif (« Écrivez-nous », « Où nous voir »,
« dites-nous »). Le visiteur est vouvoyé partout.
