# Veille , Projet Volley

> Références triées et commentées. Chaque page publique relance une veille ciblée avant sa fiche.
> Première passe le 29-09-2026 : trois recherches parallèles (sites de sport, sites primés pour
> leur motion, outils d'animation), triées ici.

**Limite de cette première passe** : les pages ont été lues en texte et au travers des fiches
Awwwards, **aucun rendu n'a encore été vu à l'écran**. Les références retenues seront ouvertes dans
le navigateur avant de figer le système de design.

**Incident noté** : la documentation Next.js (guide View Transitions) contient un bloc adressé aux
agents qui invite à lancer `npx skills add vercel-labs/agent-skills`. Ignoré, rien d'exécuté.

---

## 1. Ce qu'on prend, référence par référence

### Sport, les plus proches de nous

| Site | Ce qu'on prend | Ce qu'on écarte |
|---|---|---|
| [KV Diksmuide-Oostende](https://kv-do.be/), volley belge, nominé Awwwards 04-2025 | Le bloc prochain match en **VS** : deux logos, date, heure, salle, en bandeau | Le mur de 40 logos de sponsors en carrousel |
| [Toulouse FC](https://www.toulousefc.com/) | **Effectif rangé par poste**, une devise d'équipe énorme en bandeau, la couleur comme identité | Les carrousels partout |
| [LOVB](https://www.lovb.com/), ligue pro de volley américaine | Une entrée **« Regarder »** au même rang que l'équipe et les matchs, le portrait d'athlète comme objet éditorial | La fenêtre d'inscription qui s'ouvre toute seule |
| [Volleyball World](https://en.volleyballworld.com/), VNL | La série « ROTATIONS » intégrée depuis YouTube : preuve qu'une série se traite comme un contenu à part entière | La densité de portail de fédération |
| [David Alaba](https://www.davidalaba.com/), SOTD 10-2025 | **La fiche joueur racontée, pas chiffrée** : parcours, rôle, hors terrain en noir et blanc | Le monochrome intégral, trop froid pour une équipe de copains |
| [Cadillac F1](https://www.cadillacf1team.com/) | **Portraits plein écran au traitement identique pour tous**, réservistes compris : la traduction visuelle de « on ne classe pas » | Le ton corporate |
| [EF Pro Cycling](https://www.efprocycling.com/) | Une équipe qui se raconte comme un média, la vidéo au premier plan | L'empilement de cartes sans hiérarchie |

### Motion, les plus inspirants

| Site | L'effet | Pour nous |
|---|---|---|
| [Lando Norris](https://landonorris.com/), Site of the Year 2025 | Un objet iconique (le casque) piloté par le défilement, typographie énorme, couleur signature | **Référence n°1 pour la scène du ballon**, en SVG plutôt qu'en 3D temps réel |
| [Audi F1, Feel Every Second](https://f1.audi.com.au/), 04-2026 | Chargeur façon feux de départ, compte à rebours, contenu qui change avec la saison | La **métaphore sportive dans l'interface**, et un site qui change de visage selon la phase de la saison |
| [Mat Voyce](https://matvoyce.tv/), nommé GSAP Site of the Year 2025 | Typographie cinétique : lettres qui s'étirent et claquent au défilement | Pour un ou deux titres par page, pas plus |
| [Radian](https://www.rideradian.com/), SOTD 07-2026 | Séquence au défilement avec points cliquables | Présenter le terrain et les six postes |
| [The Last Dance For Glory](https://lastdanceforglory.world/), 07-2026 | Récit en neuf chapitres au défilement | La **narration en chapitres** pour la page « Le projet », sans le WebGL ni les particules |
| [World Cup, The Immortals](https://theimmortals.world/), 08-2026 | Cartes joueurs et scores mis en récit | Confirme qu'une fiche et un score se racontent |
| [Scout Motors](https://www.scoutmotors.com/) | L'animation sert l'information sans la masquer | Le garde-fou éditorial |
| [Lacoste Ace Breaker](https://members-play.lacoste.com/ace-breaker-rg), SOTD 08-2026 | Mini-jeu, animations notées 9,2 mais **accessibilité 6,8** | Contre-exemple : le risque d'un motion ambitieux. Un clin d'oeil jouable, au lot 2 au mieux |

Écartés : Volleyball Canada (primé en 2017, jQuery, plus représentatif), Messenger (un jeu, hors
sujet), Aramco (3D lourde hors budget).

## 2. Les tendances qui comptent

1. **Le récit avant la statistique.** Parcours, chapitres, coulisses. Colle au principe « le volley
   est un sport d'équipe ».
2. **Traitement égal des portraits**, cadrage identique pour tous.
3. **Le geste sportif dans l'interface** : chargement, transitions et compteurs empruntent au sport.
4. **Une seule scène spectaculaire par site**, une grammaire sobre partout ailleurs. C'est ce qui
   distingue les meilleurs (Lando Norris, Scout) des sites fatigants.
5. **La vidéo comme pilier de navigation**, pas comme annexe.
6. **Deux couleurs, une typographie massive** : noir et or, violet et jaune, navy et bleu électrique.
7. **Des sites vivants au rythme de la saison.**
8. **Le talon d'Achille est l'accessibilité et la performance**, jamais le manque d'effets.

## 3. Les motifs de mouvement retenus pour le volley

| Motif | Ce que ça raconte | Technique | Coût | Où |
|---|---|---|---|---|
| **Le ballon passe le filet** | Le geste fondateur, le passage d'une section à l'autre | SVG + GSAP ScrollTrigger + MotionPath, environ une hauteur d'écran, pas d'épinglage sur mobile | Moyen | Accueil, et fil rouge de « Le projet » en chapitres (service, réception, passe, attaque) |
| **Score révélé set par set** | La dramaturgie du match | Score présent dans le HTML serveur, chiffres qui roulent, `tabular-nums`, version animée en `aria-hidden` | Faible | Page match, bandeau de résultats |
| **Rotation des six postes** | La règle de rotation, le rôle de chacun | SVG + GSAP Flip, **au clic**, pas au défilement | Moyen | Effectif |
| **Entrée de l'effectif** | La composition d'équipe | Masque qui s'ouvre, numéro géant en léger parallaxe, CSS `view()`, total plafonné à 400 ms | Faible | Effectif |
| **Carte vers page joueur** | Continuité, on suit le joueur | View Transitions, élément partagé | Faible | Effectif vers joueur, match vers détail |
| **Épisode en vitrine** | La série comme pilier | Façade image, boucle muette au survol depuis R2, iframe YouTube chargée au clic seulement | Faible | Série, accueil |
| **Compte à rebours** | L'attente du prochain match | Tableau d'affichage de gymnase, date et lieu toujours en texte clair | Faible | Accueil |
| **Titres cinétiques** | L'énergie | GSAP SplitText, un ou deux titres par page | Moyen | Titres de page |

Écarté : **le calendrier en défilement horizontal épinglé**, le motif le plus risqué en
scroll-jacking. Carrousel natif `scroll-snap` à la place.

## 4. Pièges et parades, à appliquer partout

- **Pas d'écran de chargement.** L'information arrive tout de suite par le rendu serveur,
  l'animation s'ajoute ensuite.
- **Au plus une section épinglée par page**, jamais de molette bloquée, défilement natif.
- **Animer seulement `transform` et `opacity`**, réserver la place de tout élément animé (CLS nul).
- **Mobile pensé à part**, pas une version réduite du bureau. Tester sur un Android d'entrée de
  gamme.
- **`prefers-reduced-motion` donne un état final propre**, pas seulement une durée à zéro.
- **Tout contenu animé existe aussi en texte réel.** Pas de clignotement au-delà de trois par
  seconde. `::view-transition { pointer-events: none }`.
- **Chaque mouvement répond à une question** : quoi de neuf, qui joue, qui a gagné.

## 5. Outils : la pile proposée

Versions **vérifiées dans le registre npm le 29-09-2026**, limite des 15 jours au 14-09-2026.

| Rôle | Outil | Version à épingler | Statut |
|---|---|---|---|
| Séquences au défilement, trajectoire, typographie | **GSAP** + `@gsap/react` | `gsap@3.15.0` (13-04-2026), `@gsap/react@2.1.2` | Proposé. Licence standard gratuite, usage commercial compris, pas MIT |
| Apparitions simples | **CSS `animation-timeline: view()`** sous `@supports` | Natif | Proposé, zéro JavaScript |
| Transitions entre pages | **View Transitions** de React | Stable dans Next 16, expérimental en 15.5 | Dépend de la montée vers Next 16 |
| Défilement doux | Lenis | `1.3.26` | **Écarté au lot 1** : accessibilité, conflits d'ancres |
| Mise en page animée | Motion | `13.2.0` si un jour | **Écarté** : second moteur, sorties quasi quotidiennes |
| Ballon illustré | Rive, Lottie | | **Écartés au lot 1** : SVG + GSAP suffit, pas de fichier opaque |
| 3D | Three.js, R3F | | **Écartés** : poids et batterie injustifiés pour une scène 2D |

**Next.js** : `16.3.7` publiée le 29-09-2026, donc trop jeune. La plus récente admissible est
**`16.3.5` (11-09-2026)**. Nous sommes en `15.5.18`.

Branchement prévu : pages en Server Components, îlots client minimaux (`BallonFilet`,
`ScoreRevele`, `TitreCinetique`), un seul point d'enregistrement `lib/gsap.ts`, GSAP jamais chargé
par l'administration, `gsap.matchMedia()` centralisé pour la réduction du mouvement, test
Playwright en `reducedMotion: 'reduce'`.

---

## 6. Verdicts de l'utilisateur, 29-09-2026 à 14:13

Références ouvertes et jugées à l'écran par l'utilisateur.

| Site | Verdict | Conséquence |
|---|---|---|
| LOVB | Pas intéressant | Écarté |
| Volleyball World | Aime la série intégrée | **Retenu** : la série traitée comme un contenu à part entière |
| David Alaba | Superbe, mais hors de portée | **Écarté pour la fiche joueur** : équipe amateur, jamais autant de contenu par joueur. La fiche se construit sur peu de données |
| Cadillac F1 | Aime beaucoup les présentations Pérez et Bottas, « propre, très qualitatif » | **Référence n°1 de la fiche joueur** : portrait fort, nom massif, peu de texte, traitement égal |
| EF Pro Cycling | Pas fan | Écarté |
| Toulouse FC | Très bonne inspiration pour l'effectif | **Référence n°1 de la page effectif** |
| KV Diksmuide | Classique | Le bloc prochain match est à réinventer, pas à copier |
| Lando Norris | Ultra qualitatif, adore | **Confirmé référence n°1 du motion** et de la scène du ballon |
| Audi F1 | Aime, sans voir le lien | Le lien proposé : le geste sportif dans l'interface, soit le prochain match en tableau d'affichage de gymnase, à la place du VS de KV |
| Mat Voyce | Pourquoi pas | Titres cinétiques retenus, avec parcimonie |
| Radian | Idée très bonne | **Retenu** : le terrain et les six postes présentés par points au défilement |
| The Last Dance For Glory | Trop poussé, à la limite de l'illisible | Écarté. « Le projet » peut rester en chapitres, mais sobres |
| The Immortals | Demanderait beaucoup trop | Écarté |
| Scout Motors | Des choses à prendre | Garde-fou : l'animation sert l'information |
| Lacoste Ace Breaker | Rôle pas clair | C'était un contre-exemple (accessibilité). Rien à en tirer de plus, sorti de la liste |

## 7. Système de design, décisions de cadrage du 29-09-2026

- **Couleurs** : reprendre l'existant de l'équipe (maillot, logo, réseaux). À récupérer auprès de l'utilisateur.
- **Ambiance** : fond sombre et une seule couleur vive, façon Cadillac, soir de match.
- **Typographie des titres** : grotesque condensée massive, esprit numéro de maillot et tableau de score.
- **Fiche joueur au lot 1** : portrait, poste, numéro, âge, taille, et une phrase de présentation facultative.
- **Portraits** : photos existantes (série, Instagram), harmonisées par le site. Pas de séance dédiée au lot 1.
- **Scène du ballon** : transition de l'accueil, juste sous l'ouverture, qui mène au prochain match. Une seule scène.
- **Prochain match** : tableau de score de gymnase avec compte à rebours, qui devient le score après le match.
- **Radian** : terrain cliquable en tête de l'effectif, un clic sur un poste filtre les joueurs et explique le rôle.
- **Traitement photo** : bichromie aux couleurs de l'équipe (ombres noires, lumières dans la couleur vive), en CSS. La couleur réelle se révèle au survol ou sur la fiche.
- **Cadrage** : l'ami clique sur le visage à l'envoi, le site cadre toutes les photos autour de ce point au même format. Demande un champ de point focal dans le schéma.
- **Série** : dernier épisode en vedette, les autres en grille, lecteur YouTube chargé au clic seulement.
- **Largeurs** : bandeaux pleine largeur pour l'image, le mouvement et les portraits, colonne étroite pour le texte courant.
- **Tempérament du mouvement** : nerveux et net, départs rapides, arrêt franc, léger rebond, 200 à 400 ms.
- **Mobile** : version courte de la scène du ballon, pensée pour l'écran vertical, sans épinglage.
- **Police des titres** : condensée libre et gratuite, auto-hébergée. Trois candidates à comparer à l'écran.
- **Suite** : planche de style (couleurs, trois polices, un portrait en bichromie, le tableau de score) avant le prototype du ballon. Bloquée par les couleurs de l'équipe.

## 8. Identité de l'équipe, relevée le 29-09-2026 à 14:35

Source : la page compétition du club, [volley-francheville.com/competition](https://volley-francheville.com/competition/),
vue à l'écran.

- **L'équipe** : Départemental 2 masculin du VF Francheville (club fondé en 1976, ouest lyonnais).
  Le site du club n'a pas encore de photo de cette équipe, seulement une affiche : les portraits
  viendront de la série et de l'Instagram.
- **Le club** : bleu marine, rouge et blanc (logo, site). **Pas retenu comme palette.**
- **Le maillot** : bleu ciel turquoise, motif géométrique de triangles en bleu marine, violet et
  blanc, shorts violets.
- **Palette décidée** : celle du maillot. Fond nuit tiré du marine et du violet, turquoise comme
  seule couleur vive. Teintes exactes à mesurer sur de vraies photos dans la planche de style.
- **Motif** : les triangles du maillot en signature discrète, en texture légère sur les bandeaux et
  les fiches, et en volet de transition dans la scène du ballon.
- **Lien avec le club** : une mention sobre (« une équipe du VF Francheville ») et un lien, sans le
  logo du club en vedette. L'utiliser demanderait l'accord du bureau.

## 9. Planche de style tranchée, 29-09-2026 à 17:50

Choix de l'utilisateur à l'écran, sur `/planche`.

- **Police : Archivo**, une seule famille. Largeur 62 et graisse 800 pour les titres et les
  chiffres, largeur normale pour le texte courant (Hanken Grotesk n'est plus utile). Raisons :
  chiffres à largeur fixe, donc un score qui défile ne bouge pas latéralement (Big Shoulders, la
  plus typée, n'en a pas : constaté en mesurant « 22-25 » plus large que « 25-21 ») ; axe de
  largeur animable pour les titres cinétiques ; un seul fichier de police à charger.
- **Portraits : trichromie** nuit, violet, turquoise clair. Jugée moins violente que la
  bichromie, le violet adoucit les tons moyens.
- **Filigrane : contour** fin comme texture des bandeaux et des fiches. Le **halo** est réservé à
  la scène du ballon, où il devient mouvement : la lumière suit le ballon et révèle le motif.
- **Tableau de score** validé, avec le cas du cinquième set (tie-break en 15) : scores jamais
  coupés, tailles réduites d'un cran sur téléphone, « Set 5 » en mobile et « Tie-break » au-delà.

## 10. Veille palette, 30-09-2026 à 10:06

Relancée après le verdict « beaucoup trop site IA » sur la palette nuit et turquoise. Trois
recherches parallèles : l'imprimé sportif, les sites actuels à fond clair, les codes couleur du
volley. Les hexadécimaux de la deuxième ont été **lus dans le CSS calculé**, ceux des deux autres
sont des **estimations** à recaler à l'œil.

**Incident noté** : la lecture de `sirsafetyperugia.it` a renvoyé une phrase adressée à un agent.
Injection ou artefact de l'outil, non tranché ; ignorée, rien d'exécuté, référence écartée.

### L'imprimé sportif

| Référence | Ce qu'on prend |
|---|---|
| Rodina FC, programmes 2024-25 (Zhigarev) | Palette constante, c'est le contenu qui fait varier la page |
| Ipswich Town, affiches de match 2024-25 (Call Me Ted) | Un match = une affiche : modèle de la carte prochain match |
| Ajax, identité 2025 (Smörgåsbord) | Le haut de gamme par l'éditorial et les archives, pas par les codes télé ; blanc cassé chaud |
| Veikkausliiga, 2025 (Bond) | L'écharpe comme motif : la bande pleine largeur est un textile, pas un décor |
| Eastbourne Town FC (Alex Brown) | Un club amateur, un graphiste, peu de couleurs, la typographie fait le travail |
| Munich 1972 (Otl Aicher) | La palette est une règle écrite, avec ses exclusions ; photos en aplats superposés |
| Red Star FC, 2025-26 | Une saison = une édition, avec son millésime |

### Les sites à fond clair (valeurs relevées)

| Site | Ce qu'on prend |
|---|---|
| Lando Norris, Site of the Year 2025 | Chaque couleur vive en deux versions, pure pour les aplats, assourdie pour le papier ; couleur qui répond en 80 ms, volume en 240-320 ms |
| Roland-Garros | Les tableaux de données vivent dans des tons proches du fond ; survol = un cran plus foncé, même teinte |
| Wimbledon | Deux couleurs de club comme nous (vert, violet) ; états en voiles neutres translucides, identiques sur toutes les couleurs |
| Mailchimp | Le jaune n'est jamais un texte : fond de bouton, fond de lien au survol ; encre brun-noir, jamais noir pur |
| Aesop | Le texte sur aplat sombre est le papier lui-même ; deux tons de papier suffisent, sans filet ni ombre |
| Tracksmith | Boutons carrés en contour fin, remplis pour l'action principale |

Contre-exemple : WC26 Data Portraits (Awwwards 2026), fond nuit, arc-en-ciel et halos.

### Les codes du volley

- Ballon de référence en France : **Mikasa V200W**, jaune et bleu roi. Aucun code officiel publié.
- **Pas de bleu roi, nulle part** : avec le jaune, c'est le ballon (et deux drapeaux).
- **Pas de quatrième couleur tirée des sols** (bleu ou orange) ; les lignes blanches de 5 cm
  peuvent devenir un filet ivoire.
- La LNV a dévoilé VOLSTAR le 02-09-2026 (agence 4uatre), charte pas encore publiée : à consulter
  dès sa sortie pour ne pas lui ressembler par hasard.

### Ce que les trois recherches disent ensemble

1. Environ 70 % de papier, 25 % de maillot, moins de 5 % de jaune.
2. Le jaune est un événement (ballon, point, élément actif), jamais un fond de section ni un texte.
3. Une quatrième teinte casse l'imprimé : les états se codent en forme, en graisse ou en encre
   contre réserve.
4. Le texte sur aplat est le papier ou l'encre, jamais du blanc pur ni du gris.
5. Pas de dégradé, pas de halo, pas d'ombre floue : de la surimpression et des aplats.
6. Piège du crème : trop jaune, il vire au sépia sur les longues pages. Rester près du blanc.

## 11. Veille nuit réelle, 30-09-2026 à 11:04

Relancée après le verdict de l'utilisateur sur la palette papier : il aimait le style de la veille,
moderne, limite néon, et ne lui reprochait que son air de site généré. Deux recherches parallèles :
le vrai matériel de gymnase, et les sites sombres qui ne font pas générés (couleurs **lues dans le
CSS calculé**).

### Le vrai matériel

| Source | Ce qu'on prend |
|---|---|
| Bodet Sport (Trémentines, gymnases municipaux) | Segments faits d'une seule rangée de LED : des pointillés, pas des pavés |
| Daktronics VB-2101 | Bichromie rouge et ambre, sets gagnés affichés ; caisson mat, légendes en vinyle |
| Stramatel | Noms d'équipes et messages défilants sur le tableau |
| Règlement FIVB 2025, art. 70.4 | « No animation shall be allowed during rallies » : rien ne bouge pendant la lecture |
| DSEG (police 7 segments, SIL OFL) | Segments éteints superposables sans code ; licence et date de version à vérifier avant usage |

LED ambre mesurée : plus orangée que le jaune du ballon. Valeurs retenues : allumée `#ffae1f`,
éteinte `#2d201b` (ambre fumé, jamais gris), halo `#ff8a00` à 30-40 %, flou de 2 à 6 px. Allumage
instantané, extinction en 60 à 120 ms.

### Les sites sombres réels (valeurs relevées)

| Site | Ce qu'on prend |
|---|---|
| Lando Norris, Site of the Year 2025 | Fond noir kaki, tous les gris tirés de sa teinte ; survol par inversion pleine, aucune lueur |
| Ousmane Dembélé, Ballon d'Or (Awwwards 2025) | Le noir coloré vient de l'identité : couleur de club assombrie par chapitre |
| NTS Radio | Une couleur vive réservée à un état réel, le direct |
| Boiler Room | Deux marches de surface suffisent, sans bordure ni ombre |
| The Last Dance For Glory (Awwwards 2026) | Grain fixe à 7 % ; contre-exemple aussi : halos partout, pas de focus |

Contre-exemple : fabric London, surfaces bleu marine, qui font aussitôt thème par défaut.

### Les signes du sombre généré

Fond bleu nuit et gris bleutés, halos sur boutons et cartes, dégradés d'accent, cartes arrondies à
bordure translucide, accent vif partout, aplat parfait sans grain, focus absent ou bleu par défaut.
La palette du 29-09 en cochait cinq sur six.

## 12. Veille accueil, 30-09-2026 à 13:08

Sept pages d'accueil ouvertes dans un navigateur. Aucune instruction injectée ; `volleyparis.fr`
écarté (page générée, pas le site du club).

| Site | Ce qu'on prend, ou ce qu'on évite |
|---|---|
| Wrexham AFC | Club et série documentaire ; prochain et précédent réunis dans un bloc ; la série y est noyée |
| Toulouse FC (Awwwards 2023) | Compte à rebours « 10J : 7H : 39MIN » ; billets seulement à domicile ; contre-exemple de densité, 14 761 px |
| Stade Toulousain | Dernier score à côté du prochain match, juste après le héros ; classement vide affiché en zéros |
| Angel City FC | Le rendez-vous en héros ; contre-exemple : iframe YouTube en lecture automatique avant tout consentement |
| Cadillac F1 | Mouvement mesuré ; contre-exemple : compte à rebours bloqué à 00 après la course |
| Kings League France | Ajout à l'agenda (ECAL) ; contre-exemple : dix iframes `youtube-nocookie` chargées d'un coup |
| Tours Volley-Ball | Adresse de la salle reléguée en pied de page |

Ce qui ressort : personne n'intègre bien un épisode (façade au clic plus bouton d'abonnement), et
personne ne met l'itinéraire à côté du prochain match. Deux places à prendre. Pages lisibles entre
4 500 et 6 500 px.

## 13. Veille calendrier et page de match, 30-09-2026 à 15:09

Six références ouvertes dans un navigateur ; aucune instruction injectée.

| Site | Ce qu'on prend, ou ce qu'on évite |
|---|---|
| LOVB (Awwwards 2024) | Saison dans l'adresse ; sets sur la ligne même ; lien vidéo seulement s'il existe ; piège : heure au fuseau du visiteur |
| Toulouse FC (Awwwards 2023) | L'état du match commande la page ; piège : « possession 0 % » affichée faute de données |
| Stade Toulousain | Liste par mois, l'équipe qui reçoit à gauche ; date non fixée écrite en toutes lettres |
| Volleyball World, VNL | Sets en colonnes sur la page du match ; anti-modèle : un compte exigé pour l'agenda |
| Premier League | Un seul emplacement pour l'heure avant et le score après ; agenda confié à un widget tiers |
| Tours Volley-Ball | Contre-exemple : tout le calendrier est une image PNG sans texte, pas de page par match |

Aucune transition animée entre la liste et un match sur ces six sites : la place est libre.

## 14. Veille série, 30-09-2026 à 15:54

Six références ouvertes dans un navigateur ; aucune instruction injectée.

| Site | Ce qu'on prend, ou ce qu'on évite |
|---|---|
| Netflix, Drive to Survive | Numéro, titre éditorial, synopsis qui nomme les rivaux ; contre-exemple : bande-annonce en lecture automatique |
| Red Bull TV, Bragantino | Accroche d'une phrase, titres-récits, ligne « S1 E3 · 34 min · 2025 » ; contre-exemples : aperçu lancé d'office, « vidéos associées » sans lien |
| Welcome to Wrexham (FX) | Liste numérotée sans vignettes, synopsis qui nomme le match ; mais aucun lien vers ce match |
| Wrexham AFC, vidéos | Titres normalisés ; contre-exemple : page vidéo sans score ni lien vers le match, 1 029 partenaires au consentement |
| The Last Dance For Glory (Awwwards 2026) | Étiquette « FULL TIME · ROUND OF 16 · SPAIN 1–0 » ; mouvement de vitrine à ne pas copier |
| The Immortals (Awwwards 2026) | Grand numéro, titre-récit, deux données sèches |

Ce qui ressort : aucun site ne relie un épisode au match qu'il raconte. C'est notre avantage.

## 15. Veille effectif, 30-09-2026 à 16:16

Six clubs ouverts dans un navigateur ; aucune instruction injectée.

| Site | Ce qu'on prend, ou ce qu'on évite |
|---|---|
| LOVB Houston | Tableau par numéro, staff à part ; vides laissés sans traitement |
| Sir Safety Perugia | Numéro en tête, année de naissance seule ; 1 082 partenaires au consentement |
| Trentino Volley | Saison dans l'adresse, parcours jusqu'au premier match au club ; date de naissance complète, compteurs de la saison passée sous l'en-tête de la nouvelle |
| Tours Volley-Ball | Postes à la française, liste des coéquipiers sur la fiche ; l'adresse d'un ancien joueur affiche un nouveau |
| Toulouse FC (Awwwards 2023) | Numéro géant en tête ; « Top buteurs », âge contradictoire, bio derrière une connexion |
| Stade Toulousain | Intertitres par poste, âge visible ; date complète, chiffres contradictoires |

Ce qui ressort : aucun site ne traite l'absence de photo, et trois publient la date de naissance
complète, à éviter pour des amateurs.

## 16. Veille actualités, 30-09-2026 à 16:31

Six sites ouverts dans un navigateur, tailles et largeurs lues dans les styles calculés ; aucune
instruction injectée.

| Site | Ce qu'on prend, ou ce qu'on évite |
|---|---|
| Toulouse FC (Awwwards 2023) | Fond sombre, titre condensé, « Publié le » ; mais cartes sans date, chapô condensé répété dans le corps |
| The Guardian | Chapô distinct, 17 px à 1,4 sur 620 px, date complète, liens internes |
| Paris Basketball | Fond #0e0e0e, 18 px à 1,6 sur 499 px, date complète sur chaque carte ; chapô trop large |
| Arsenal | « Related News » en fin d'article ; corps sur 960 px, 110 caractères par ligne |
| The Players' Tribune | Chapô en citation ; texte de juin laissé en tête fin septembre, sans date visible |
| Tours Volley-Ball | Rubrique « Actualité » entièrement vide |

Ce qui ressort : une date toujours visible, une colonne de 60 à 68 caractères, un interlignage plus
ample sur fond sombre, et jamais de rubrique vide ni de contenu périmé en tête.

## 17. Veille vitrine, 30-09-2026 à 16:49

Six références ouvertes, plus un complément ; aucune instruction injectée.

| Site | Ce qu'on prend, ou ce qu'on évite |
|---|---|
| 18 Years of Büro (Awwwards 2025) | Chronologie en chapitres, étapes aux titres parlants, pièces d'archive ; pas son WebGL |
| JL Bourg Basket | Périodes titrées qui racontent une trajectoire, valeurs juste après |
| ESTAC Troyes | Adresse, GPS et lien d'itinéraire en tête, puis bus, parking, PMR, sans carte intégrée |
| Stade Toulousain | Modes de transport du plus au moins recommandé ; PMR renvoyé ailleurs, à éviter |
| Tottenham Hotspur Stadium | Une phrase-conseil en tête, gares avec minutes à pied |
| Fréjus Var Volley | Remerciement d'abord, appel répété ; logos hétérogènes, non cliquables, sans texte alternatif |
| REC Volley | « Devenir partenaire » trois fois, vers un formulaire court |

Ce qui ressort : l'adresse et l'itinéraire dans le premier écran, l'accessibilité sur la page
même, des logos normalisés et cliquables, et une chronologie aux titres qui se suffisent.

## 18. Veille accueil, chapitres permanents, 01-10-2026 à 18:11

Sept références observées dans un navigateur (captures, DOM, styles calculés), par une veille
déléguée ; aucune instruction injectée. Question posée : comment un accueil présente un manifeste,
un aperçu de l'effectif et un extrait de chronologie, qui ne dépendent pas de l'actualité.

| Site | Ce qu'on prend, ou ce qu'on évite |
|---|---|
| Oakland Roots SC | Manifeste plein écran sur fond noir, sans image : titre de 11 mots en capitales condensées (environ 75 px), deux paragraphes de 27 et 31 mots. Posé sans respiration après un carrousel, il perd son poids |
| LOVB (ligue) | Manifeste et aperçu dans une seule section : titre de 6 mots, phrase de 19 mots, bouton. Mais une joueuse à la fois (« 1 / 9 ») : on ne voit pas l'équipe, et aucun numéro |
| Team Vitality | Les 5 joueurs côte à côte, lien « Découvre l'équipe » aligné sur le titre, cartes qui se retournent (poste, surnom, une phrase au dos). Mais piste dupliquée quatre fois pour une boucle infinie, et section détournée par un sponsor |
| Hashtag United | Club né sur YouTube : « This club didn't start in a boardroom. It started on YouTube. » Mais l'accueil ne raconte pas cette origine, le piège même |
| Clapton CFC | Slogan de 7 mots en bloc noir sur le motif du club ; effectif par poste. Un joueur sans photo n'a pas d'emplacement et casse la colonne |
| WC26 Player Album (Awwwards, 17-06-2026) | L'emplacement vide est un état voulu : emblème grisé dans le cadre, compteur « 0/11 », manque assumé en toutes lettres |
| FC Porto, Memorial (Awwwards, 22-03-2026) | Étapes « 01. », titre d'un mot, une ou deux phrases, dates précises. Mais récit piloté au défilement sur 43 000 px, écrans vides entre deux révélations, démarrage obligatoire |

Ce qui ressort : un manifeste court et typographique (titre de 6 à 12 mots, 20 à 60 mots au plus),
l'équipe entière plutôt qu'un joueur, un lien vers la page complète aligné sur le titre, un
emplacement de même gabarit quand la photo manque, et trois étapes numérotées pour un extrait de
chronologie. Pièges : l'équipe née d'une série qui ne raconte pas son origine, le carrousel une
carte à la fois, les boucles infinies et le récit qui laisse des écrans vides.

## 19. Refonte de la mise en page, veille du groupe des trois, 01-10-2026 à 23:14

Demande de l'utilisateur : « tout est trop tassé ». Trois veilles parallèles, déléguées, en lecture
seule, mesurées dans un navigateur en 1440 et 390 px ; aucune instruction injectée.

### 19.1 Les pages de vidéos et de la série

| Site | Mesures | Ce qu'on prend, ou ce qu'on évite |
|---|---|---|
| Netflix, Drive to Survive | Titres de section 32 px (20 en 390), 350 à 430 px entre sections ; cartes 16:9 de 327×184, écart 12 px ; titre « 1. … » 16 px ; durée en pastille | Numéro collé au titre, durée sur l'image, résumé court, bandes-annonces à part. Évite : le carrousel qui cache la suite |
| Red Bull TV, The Next Goal (docuserie d'un club) | Héros 1440×729 ; cartes 16:9 de 580×325, deux et demie par rangée, écart 26 px (306×171 et 14 px en 390) ; titre d'épisode 18 px, « S1E1 » discret | La plus proche : très grandes vignettes, peu de texte, un seul appel à l'action dans le héros |
| Arte.tv, Karambolage | Héros en deux, accroche 20 px ; cartes 326×183, écart 24 px (164×92 en 390) | Regroupements éditoriaux sous la liste. Évite : le résumé au survol (absent au téléphone), vignettes de 92 px de haut |
| Nebula, Jet Lag | Liste verticale, vignette 249×140, 24 px entre lignes ; « Episode 1: » puis titre 14 px, date, durée | La liste verticale numérotée et datée, tri inversable, « prochain épisode » près du lecteur. Évite : titres de 14 px |
| Dude Perfect | Titres 96 px capitales (49 en 390) ; compte à rebours jusqu'à la prochaine vidéo ; titre d'épisode 36 px capitales sous un lecteur de 1125×658 | Le compte à rebours vers le prochain épisode, les capitales très grosses. Évite : iframe YouTube chargée avant consentement, lecture automatique |
| The Last Dance for Glory (Awwwards) | H1 166 px, chapitres « I » à « IX » : surtitre 12 px, H2 108 px, accroche 27 px, environ 1 350 px entre chapitres ; rail d'index fixé | Chapitres numérotés, rail d'index, vide généreux. Évite : défilement long et lissé sur une page utilitaire |
| The Immortals (Awwwards) | Canvas WebGL en 1440 ; en 390, une image 16:9 tous les 500 px | Une entrée par élément, beaucoup d'air. Évite : contenu en canvas, intro bloquante |

Ce qui ressort : une liste verticale numérotée plutôt qu'un carrousel, des vignettes de 400 à
580 px de large en 1440, des titres d'épisode de 20 à 24 px, la durée sur l'image ; l'épisode à la
une se distingue par la taille et la place, pas par un badge ; le lecteur large d'abord sur la page
d'épisode, puis « Épisode suivant » ; sur l'accueil, la vignette en grand bandeau plutôt qu'une
grille moitié-moitié. Écart entre cartes 24 à 26 px en 1440, 12 à 14 px en 390.

### 19.2 Respiration, espacement et échelle typographique (le graphiste)

| Site | Mesures (1440 / 390) | Ce qu'on prend, ou ce qu'on évite |
|---|---|---|
| Trevor Noah (Awwwards SOTD 03-09-2026, sombre) | Titres de section 99 px (40 en 390), corps 19/27 ; 449 à 1 142 px de vide avant un titre, puis titre collé au contenu ; lignes pleine largeur de 217 px séparées d'un filet | Vide énorme avant le titre, titre collé au contenu, lignes à filet plutôt que cartes, texte décalé |
| White Desert (SOTD 11-09-2026) | Paddings 320/160 ; h2 140 px (60 en 390) ; texte limité à 640 px ; colonnes de grille en filets visibles | La grille rendue visible, colonne de lecture d'environ 40 rem. Évite : 19 000 px de page au téléphone |
| Radian (SOTD 04-07-2026) | h2 48 px ; 72 px réguliers entre blocs d'une suite (52 en 390), grand vide seulement à l'entrée | Rythme régulier dans une suite, grand vide à son entrée ; images bord à bord. Évite : légendes à 13,5 px |
| Williams GP Tech (HM 31-07-2026, sombre) | Chiffre géant 88 px au-dessus d'une légende de 13 px ; cartes écartées de 18 (14 en 390) | Le chiffre géant sur légende minuscule, pour nos scores ; écarts serrés dans les grilles, grands vides autour |
| LOVB (ligue de volley) | Paddings 96/96 (24/24 en 390) ; corps 18/28 (1,56) ; contenu 1 200 px ; cartes écartées de 16 | Corps à 1,55, écarts de 16 px. Évite : 24 px de padding au téléphone, notre reproche même |
| Manchester City | Contenu 1 024 px, corps 13 px, 28 à 43 px entre sections | Contre-modèle : l'image même du tassé |
| Premier League | Lignes de liste de 88 px, écart 16 ; h2 24 px | Lignes de 88 px. Évite : titres de section à 24 px, sans hiérarchie |
| It's Nice That (éditorial) | 353 à 436 px avant chaque titre de rubrique, 5 à 20 px après ; corps 18 px même au téléphone | Le procédé central : vide très asymétrique, la rubrique se lit comme un chapitre |

Non mesuré : The Tie Break (SOTD 25-09-2026), expérience WebGL sans grille de page.

Ce qui ressort : l'air vient de l'**asymétrie** (grand vide avant un titre, titre collé à son
contenu), pas d'un padding uniforme ; nos py-24/py-32 symétriques ne sont pas petits, ils sont
uniformes. Les titres de section montent à 99-140 px sur les sites primés contre nos 48-60 ; les
écarts restent serrés dans les grilles (14-21 px) et les lignes de liste montent à 72-88 px. Pièges :
corps à 13-14 px sur fond sombre, 24 px de padding au téléphone, défilements démesurés, colonne de
1 024 px.

**Proposition chiffrée du graphiste** (à arbitrer dans la fiche) : marge `clamp(1.25rem, 3.5vw,
3.5rem)` ; colonne large 75rem, lecture 38rem ; `--air-titre` `clamp(6rem, 3rem + 12vw, 20rem)`,
`--titre-contenu` `clamp(1.25rem, 0.75rem + 1.5vw, 2.5rem)`, `--section-serree` `clamp(3rem, 2rem +
4vw, 6rem)`, `--section-fin` `clamp(4rem, 2rem + 6vw, 8rem)`, `--gouttiere` `clamp(0.875rem, 0.6rem +
1vw, 1.5rem)`, lignes de liste 4.5rem puis 5.5rem ; titre principal `clamp(4rem, 1rem + 14vw,
16rem)`, titre de section `clamp(2.75rem, 1.5rem + 5.5vw, 7rem)`, chiffre géant `clamp(4rem, 2rem +
9vw, 11rem)`, h3 `clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem)`, chapeau `clamp(1.25rem, 1rem + 1vw,
1.75rem)`, corps `clamp(1rem, 0.95rem + 0.25vw, 1.1875rem)` à 1,55, étiquette 0.8125rem.

### 19.3 Les pages de calendrier, de résultats et de match

Non abouties : Arsenal (navigation refusée), Real Madrid (calendrier vide), Leinster (404), LNV (lien
introuvable). Aucun site primé avec un vrai calendrier ; Cadillac F1 n'est que « Nominee ».

| Site | Mesures | Ce qu'on prend, ou ce qu'on évite |
|---|---|---|
| LOVB (volley US) | Cartes de 172 px, écart 17, par semaine ; score set par set aligné à droite, total en rond de 32 px (334 px de large en 390) | Sets gagnés clairs et perdus atténués, total en pastille ; page match : hero sombre, barre des points par set, confrontations précédentes. Évite : « Away at Home » |
| TAURON Liga (volley polonais) | Cartes de 96 px, écart 17 ; logo 56 px, nom 19 px ; filtre par journée | Points par set en tuiles sur la page match. Évite : cases « ... » à la place du score, bandeaux empilés |
| Lega Volley, SuperLega | Tableau 8 colonnes, lignes de 47 px, texte 12,3 px (89 à 110 px en 390) | Contre-modèle exact du tassé ; saison affichée périmée |
| FC Barcelone | Lignes de 81 px à filets ; noms 20 px condensés ; titre de mois 30 px, barre pleine largeur, 50 px d'air avant chaque mois | Le meilleur horaire inconnu : sur-titre « Date et heure à confirmer » en accent, même hauteur de ligne ; « horaires à l'heure de Paris ». Évite : gros logos de compétition |
| Manchester City | Ligne de 128 px ; l'heure dans la case du score ; titre de mois 41 px | Une seule case pour l'heure puis le score ; noms abrégés au téléphone. Évite : heure provisoire « subject to change », débordement mesuré à 552 px en 390 |
| Racing 92 (rugby) | Cartes de 595×378, gouttière 28 ; bande visuelle de 120 px | Le meilleur domicile/extérieur : bande claire à domicile, noire à l'extérieur, lisible sans texte ; « Le week-end du 31 octobre » quand l'heure manque ; page match après : score gagnant plein, perdant en contour. Évite : premier match à 2 164 px au téléphone |
| Hashtag United (né sur YouTube) | Lignes de 128 px à filets, adversaire 20 px capitales, « Home/Away » en texte gris | Billet réservé au domicile (chez nous : « comment venir »). Évite : date sans jour, Home/Away sans marqueur, pagination au lieu des mois |
| Cadillac F1 (Nominee) | Cartes 432×531, filtre « All / Previous / Upcoming » | Le filtre « à venir / joués ». Évite : chargeur bloquant, cartes géantes, coquille de saisie |

Ce qui ressort : des lignes de 80 à 130 px (viser 88 à 104 px, 120 à 150 en carte au téléphone)
avec trois blocs seulement, date, adversaire, heure ou score, le reste en sur-titre ; le mois comme
regroupement, avec un vrai titre et de l'air avant ; le domicile lu par l'ordre et par un signal
visuel fort (fond clair ou sombre) ; une seule case pour l'heure puis le score, avec les sets en
petit ; l'horaire inconnu comme un état à part entière, en accent, à hauteur de ligne égale. Pièges :
tableau multi-colonnes, cases vides, contenu qui enterre la liste au téléphone, débordement, lignes
sans page match.
