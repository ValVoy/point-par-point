# Fiche , la palette (version 2, la nuit réelle)

> Fiche du système de design, selon la méthode des trois casquettes (`CLAUDE.md`).
>
> **Version 2, rédigée le 30-09-2026 à 11:05.** La version 1 (papier imprimé, commit `c4d89e2`) a
> été appliquée puis écartée par l'utilisateur : il aimait le style de nuit du 29-09, moderne et
> limite néon, et ne lui reprochait que son air de site généré. La version 2 garde l'énergie de la
> nuit et retire ce qui faisait générique. Veille : `veille.md`, sections 10 et 11. **Validée le
> 30-09-2026 à 11:20.**

## 1. Direction artistique

### L'intention

**Le gymnase le soir.** La salle est sombre, et la lumière ne vient que de ce qui éclaire vraiment :
le tableau de score, le bandeau LED du bord de terrain, le projecteur sur le ballon. Tout le reste
est mat. La lumière redevient un événement, et c'est ce qui la rend crédible.

Ce qui faisait générique le 29-09, et que la version 2 retire : le bleu nuit par défaut, le cyan
ravivé, les lueurs posées partout, le dégradé d'accent, les bordures bleutées.

### Les références, et ce qu'on en prend

| Référence | Ce qu'on prend |
|---|---|
| Tableaux Bodet Sport | Segments en pointillés, segments éteints visibles |
| Règlement FIVB 2025 | Rien ne bouge pendant la lecture ; le bandeau s'anime aux respirations |
| Lando Norris, 2025 | Gris tirés de la teinte du fond ; survol par inversion, sans lueur |
| Ousmane Dembélé, 2025 | Le noir coloré vient de l'équipe ; un chapitre, une teinte |
| NTS Radio | La couleur vive signale un état réel |

### Les exclusions

- Pas de bleu nuit, pas de gris bleuté, pas de cyan ravivé.
- Pas de lueur hors des objets lumineux (tableau, bandeau LED, ballon sous le projecteur).
- Pas de dégradé d'accent, pas de carte en verre dépoli, pas d'ombre floue colorée.

## 2. UX et UI

### Les valeurs du site public

Contrastes mesurés sur `nuit` (4,5 pour 1 exigé pour le texte courant, 7 visé pour les scores,
horaires et adresses, lus au téléphone en extérieur).

| Rôle | Jeton | Valeur | Contraste |
|---|---|---|---|
| Fond, noir violacé du maillot | `nuit` | `#16101a` | |
| Surface (cartes, blocs) | `nuit-surface` | `#1f1724` | |
| Surface relevée, survols | `nuit-releve` | `#2a2030` | |
| Chapitre matchs, violet assombri | `nuit-violet` | `#2b1b30` | |
| Filets | `nuit-trait` | `#3a2e40` | |
| Texte, craie chaude | `craie` | `#f1ece6` | 15,9 |
| Texte secondaire | `craie-douce` | `#b9adb8` | 8,7 |
| Légendes seulement | `craie-tenue` | `#958a95` | 5,7 |
| Turquoise réel du maillot, l'équipe | `turquoise` | `#64979d` | 5,8 : **se lit tel quel** |
| Violet réel du maillot, aplat | `violet` | `#66486b` | 2,4 : aplat seulement, craie dessus (6,6) |
| Jaune ballon, l'accent | `jaune` | `#f2bf2e` | 10,9 |
| Jaune éteint, états secondaires | `jaune-eteint` | `#b8922c` | 6,4 |
| LED allumée | `led` | `#ffae1f` | objet lumineux seulement |
| LED éteinte | `led-eteinte` | `#2d201b` | segment fantôme |
| Erreur | `erreur` | `#e0707e` | 6,0 |

Le point clé : **le turquoise réel du maillot se lit sur ce noir sans aucune retouche**. Le cyan
ravivé du 29-09 n'était pas nécessaire, et c'est lui qui tirait le site vers le cliché.

### Les règles d'usage

- **Une fonction par couleur** (acquise en version 1) : turquoise l'équipe, violet les matchs
  (en chapitre `nuit-violet` ou en aplat), jaune ce qui est en direct ou nouveau.
- **La lumière** : seulement sur le tableau de score, le bandeau LED et le ballon sous le
  projecteur. Halo court et serré, flou de 2 à 6 px, `#ff8a00` à 30-40 %.
- **Les LED** : segments en pointillés, segments éteints toujours visibles, allumage instantané,
  extinction en 60 à 120 ms, changement de chiffre segment par segment.
- **Le mouvement** : rien ne bouge pendant la lecture ; le bandeau LED s'anime aux transitions de
  section ou quand un point tombe (règle FIVB transposée).
- **États** : survol par inversion ou remplissage plein, jamais par une lueur. Focus : contour
  jaune net de 2 px (10,9 pour 1).
- **Victoire et défaite** (acquis) : pastille pleine V en craie, pastille contour D.
- **Portraits** : surimpression nuit, turquoise, craie pour l'effectif ; nuit, violet, craie pour
  les matchs.
- **Grain** : fixe, 5 à 7 %, sur le site public ; vignette discrète au besoin. Re-mesurer les
  contrastes par-dessus.
- **Plein soleil** : scores, dates et lieux en `craie`, en graisse épaisse ; `craie-tenue`
  réservée aux légendes.

### L'administration

De nuit elle aussi, par cohérence (décision de l'utilisateur, 30-09-2026). Les contrastes le
permettent : 15,9 pour 1 pour le texte, 8,7 pour le secondaire. Page en `nuit`, blocs en
`nuit-surface`, champs creusés en `nuit`, boutons en turquoise avec le texte nuit. Pas de grain ni
de lumière sur les écrans de travail.

## 3. Fullstack

- **Jetons** : `globals.css` porte deux familles, la nuit (site public) et le papier
  (administration).
- **Tableau du prochain match** : retour au tableau de gymnase de la veille, en LED ambre à
  segments pointillés et segments éteints visibles. DSEG vérifiée (licence, date de version)
  avant usage, sinon segments dessinés en SVG.
- **Planche** : réécrite sur la nuit réelle.
- **Vérification** : tests, `tsc`, lint, `next build`, rendu à l'écran en 390 et 1440 px.

## Décisions du 30-09-2026 à 11:20

Fiche validée par l'utilisateur.

1. **L'intro validée passe à la nuit réelle** : même animation, nouvelles couleurs, tableau en LED
   ambre. L'original reste retrouvable par l'étiquette git `intro-nuit-v1`.
2. **L'administration est de nuit**, par cohérence avec le site.
