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
