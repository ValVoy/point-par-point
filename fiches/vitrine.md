# Fiche , la vitrine (le projet, où nous voir, partenaires)

> Fiche de page, selon la méthode des trois casquettes (`CLAUDE.md`). Rédigée le 30-09-2026 à
> 16:55, en autonomie. Veille : `veille.md`, section 17. Palette : `palette.md`, variante « net ».

## 1. Direction artistique

Trois pages courtes, qui répondent chacune à une question : **d'où vient le projet**, **où
venir voir l'équipe**, **qui la soutient**. Le ton est reconnaissant et concret, sans promesse
que personne n'a validée : les textes viennent de l'administration, la page n'invente rien.

| Référence | Ce qu'on prend |
|---|---|
| 18 Years of Büro (Awwwards 2025) | Une chronologie où chaque étape a un titre qui parle |
| JL Bourg Basket | Des étapes titrées qui racontent une trajectoire |
| ESTAC Troyes | Adresse et lien d'itinéraire en tête, puis transports, parking, PMR, sans carte intégrée |
| Stade Toulousain, Tottenham | Une phrase-conseil en tête ; des distances en minutes à pied ; le PMR sur la page |
| Fréjus Var Volley | Le remerciement d'abord ; contre-exemple : logos hétérogènes, non cliquables, sans texte alternatif |
| REC Volley | Un appel à devenir partenaire, répété, vers un formulaire court |

## 2. UX et UI

### Le projet, `/le-projet`

1. Titre et une phrase qui situe : une équipe de D2 et une série.
2. **La chronologie** verticale, dans l'ordre choisi dans l'administration : la date (exacte ou
   libre, « printemps 2026 »), le titre, le texte, l'image si elle existe. Un fil turquoise la
   relie.
3. Une fin qui mène ailleurs : l'effectif et la série.

Vide : « L'histoire du projet s'écrit ici bientôt », et les deux liens.

### Où nous voir, `/ou-nous-voir`

1. **La salle** : son nom, son adresse, « Itinéraire » en jaune et « Copier l'adresse ». Déduite
   des matchs à domicile de la saison (la plus fréquente).
2. **Le prochain match à domicile** en tableau LED, avec ses actions.
3. **Les autres matchs à domicile**, en liste, chacun relié à sa page.
4. **Venir à la salle** : le texte saisi dans l'administration (décision de l'utilisateur,
   30-09-2026 : transports, parking, PMR, entrée, buvette). Vide, le bloc disparaît.

Sans salle connue : « La salle sera annoncée avec le calendrier », lien vers les matchs.

### Partenaires, `/partenaires`

1. Un remerciement d'une ligne.
2. **Les partenaires**, en cases égales : le logo ramené en blanc (sa couleur au survol et au
   focus), sinon le nom en titre d'affiche ; chaque case est un lien si le partenaire en a un.
3. **Devenir partenaire** : une phrase, un bouton vers le contact.

Vide : seulement l'invitation.

### Navigation

L'en-tête garde ses quatre rubriques ; ces trois pages vivent dans le pied de page, et « Où nous
voir » est aussi relié depuis la page d'un match à domicile.

## 3. Fullstack

- **Données** : `lib/vitrine.ts` (chronologie publiée, partenaires actifs, salle et matchs à
  domicile) ; `lib/reglages.ts` et la table `reglages` (migration additive 0005) pour « Venir à
  la salle », saisi dans l'onglet « La salle » de l'administration.
- **Logos** : `urlPhoto()` (R2), normalisés en CSS (`brightness(0) invert(1)`).
- **Contact** : le bouton « Devenir partenaire » mène à `/contact`, construit juste après, avec
  sa propre revue de sécurité.
