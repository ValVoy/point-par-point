# Fiche , l'accueil (sous l'ouverture)

> Fiche de page, selon la méthode des trois casquettes (`CLAUDE.md`). L'ouverture a sa propre
> fiche (`accueil-ouverture.md`) ; celle-ci couvre ce qui vient dessous.
>
> Rédigée le 30-09-2026 à 13:15, en autonomie accordée par l'utilisateur à 13:03. Veille :
> `veille.md`, section 12. Palette : `palette.md`, variante « net ».

## 1. Direction artistique

### L'intention

Après l'ouverture, la page tient en **deux rendez-vous et une mémoire** : l'épisode qu'on regarde,
le match où l'on vient, et les scores qui disent où en est l'équipe. Rien d'autre au premier lot.
Chaque bloc a un verbe : **Regarder, Y aller, Revoir**.

Le mouvement reprend la règle FIVB de la veille : rien ne bouge pendant la lecture. Un bloc se
révèle une fois en entrant, et les tableaux **s'allument** quand on arrive devant eux, comme la
salle qu'on rallume. La lumière reste un événement.

### Les références, et ce qu'on en prend

| Référence | Ce qu'on prend |
|---|---|
| Stade Toulousain | Le dernier score posé à côté du prochain match, juste après le héros |
| Angel City FC | Le rendez-vous comme sujet principal, date et heure en très grand |
| Cadillac F1 | Un mouvement mesuré : quelques révélations, rien d'épinglé à outrance |
| Wrexham AFC | Club et série documentaire dans le même site, sans noyer la série |
| Contre-exemples | Iframes YouTube chargées d'emblée (Angel City, Kings League), compte à rebours bloqué à 00 (Cadillac), zéros d'un classement vide (Stade Toulousain), page de 14 761 px (Toulouse FC) |

## 2. UX et UI

### L'ordre des blocs

1. **L'ouverture** (fiche à part) : l'intro puis le titre.
2. **La série** : le dernier épisode publié, grand, en pleine largeur de colonne large. C'est le
   premier but du site (s'abonner). Vignette sombre, bouton lecture, titre et numéro, résumé
   court ; **« S'abonner »** vers la chaîne. Le lecteur YouTube ne se charge **qu'au clic**
   (domaine `youtube-nocookie`), jamais avant : ni poids, ni cookie tiers au chargement.
3. **Au tableau**, chapitre violet : le **prochain match** et le **dernier résultat** côte à côte
   en tableaux LED, le duo que l'utilisateur a aimé sur la planche. Sous le prochain match, les
   deux actions du deuxième but (venir voir un match) : **Itinéraire** et **Ajouter à l'agenda**.
4. **Avant ça** : les résultats précédents en cartes défilantes, score géant plein ou en contour.
   Le seul défilement horizontal de la page.
5. **Pied de page** sobre : nom, saison, lien vers l'administration non affiché.

**Hors de ce lot, et pourquoi** : les actualités et les partenaires attendent leurs propres pages.
Une carte d'actualité qui ne s'ouvre sur rien, ou un logo qui n'existe pas encore (R2 non
configuré), feraient pire que leur absence.

### Les états

| Cas | Ce que montre la page |
|---|---|
| Aucun épisode publié | Le bloc série disparaît |
| Aucun match à venir | Le tableau du prochain match disparaît ; le dernier résultat prend la largeur |
| Aucun résultat | Le tableau du dernier résultat disparaît ; le prochain match prend la largeur |
| Ni l'un ni l'autre | Le chapitre disparaît |
| Score sans détail des sets | Le tableau garde le score, la rangée des sets disparaît |
| Coup d'envoi passé pendant la lecture | Les chiffres restent à 00, et la légende devient « C'est parti » ; au rechargement le match quitte le tableau |
| Match à l'extérieur | Adversaire à gauche, comme sur le tableau de sa salle ; l'itinéraire mène à sa salle |
| Salle ou adresse non saisie | Le bouton Itinéraire disparaît ; la date reste |
| Chaîne YouTube non renseignée | Le bouton S'abonner disparaît ; Regarder reste |

### Mobile d'abord

Un bloc par écran sur téléphone, les tableaux empilés, le prochain match en premier. Les actions
en boutons pleine largeur, 48 px de haut, au pouce. Les dates et heures en blanc épais, lisibles
dehors.

### Accessibilité

Toute information en LED existe en texte clair. La façade vidéo est un vrai bouton nommé
« Lire l'épisode … ». La rangée défilante est focalisable et nommée. Tout le mouvement se coupe
sous `prefers-reduced-motion` : les tableaux sont alors allumés d'emblée.

## 3. Fullstack

- **Données** : `lib/accueil.ts` lit tout en une fois, requêtes parallèles, contenu publié
  seulement ; `lib/resultats.ts` décide ce qui est un résultat et le compte à rebours, logique
  pure testée.
- **Rendu** : dynamique à chaque visite. Un score saisi doit se voir tout de suite, et le prochain
  match dépend de l'heure. Une requête par visite à cette échelle ne coûte rien.
- **Compte à rebours** : premier rendu calculé par le serveur, puis un composant client qui avance
  toutes les 15 secondes, sans écart à l'hydratation.
- **Agenda** : une route `/agenda/[slug]` qui renvoie un fichier `.ics` (RFC 5545) du match. Point
  d'entrée public nouveau : revue adversariale à la main avant de committer (lecture seule, slug
  borné, texte échappé, match supprimé ou passé refusé).
- **Itinéraire** : lien sortant vers Google Maps avec l'adresse, sans script ni carte chargée.
- **Vidéo** : façade serveur (miniature par l'optimiseur de Next, donc aucun appel du navigateur
  à Google) et composant client minimal pour le clic.
- **Mouvement** : GSAP et ScrollTrigger déjà enregistrés ; une révélation par bloc, l'allumage des
  tableaux par la variable `--allume`, tout sous `gsap.matchMedia()`.
- **Vérification** : tests, `tsc`, lint, `next build`, rendu à l'écran en 390 et 1440 px avec les
  données de démonstration, puis chaque état vide provoqué à la main.
