"""
Convertit le titre du site en traces SVG, lettre par lettre, dans la police du
site (Archivo, largeur 62, graisse 800 : le style `titre-affiche`).

Pourquoi : l'intro de l'accueil transforme les lignes du terrain en lettres
(MorphSVG), ce qui demande les contours de chaque lettre. Le resultat est un
fichier TypeScript genere, versionne ; ce script n'est relance que si le titre
change : il a servi pour « Projet Volley », puis pour « Point Par Point » le
30-09-2026, quand le vrai nom de la serie est arrive.

Outil : fontTools, en version epinglee (4.65.0, regle des quinze jours), dans
un environnement Python isole. Aucune dependance npm.

    python -m venv .venv-polices
    .venv-polices/Scripts/python -m pip install "fonttools==4.65.0"
    .venv-polices/Scripts/python scripts/titre-en-traces.py <Archivo[wdth,wght].ttf>

La police variable vient du depot officiel de Google Fonts
(github.com/google/fonts, ofl/archivo), sous licence SIL OFL 1.1.
"""

import json
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

TITRE = "Point Par Point"
AXES = {"wght": 800, "wdth": 62}
INTERLIGNE = 0.86  # celui de `titre-affiche`, en fraction de la taille
SORTIE = Path(__file__).resolve().parent.parent / "src/components/public/titre-traces.ts"


def arrondir(commandes: str) -> str:
    """Un chiffre apres la virgule suffit, en unites de police (1000 par cadratin)."""
    morceaux = []
    for morceau in commandes.replace(",", " ").split(" "):
        try:
            morceaux.append(f"{float(morceau):.1f}".rstrip("0").rstrip("."))
        except ValueError:
            morceaux.append(morceau)
    return " ".join(morceaux)


def mettre_en_page(police, lignes):
    """Place les lettres ligne par ligne ; y descend, la ligne de base de la premiere a la hauteur de capitale."""
    jeu = police.getGlyphSet()
    table = police.getBestCmap()
    capitale = police["OS/2"].sCapHeight
    em = police["head"].unitsPerEm
    pas = em * INTERLIGNE

    lettres = []
    largeurs = []
    for rang, ligne in enumerate(lignes):
        x = 0.0
        base = capitale + rang * pas
        for caractere in ligne:
            nom = table[ord(caractere)]
            avance = police["hmtx"][nom][0]
            if caractere != " ":
                stylo = SVGPathPen(jeu)
                # Les polices ont y vers le haut, le SVG vers le bas : on retourne.
                jeu[nom].draw(TransformPen(stylo, (1, 0, 0, -1, x, base)))
                lettres.append({"lettre": caractere, "ligne": rang, "x": round(x, 1), "largeur": avance, "d": arrondir(stylo.getCommands())})
            x += avance
        largeurs.append(x)

    return {
        "largeur": round(max(largeurs), 1),
        "hauteur": round(capitale + (len(lignes) - 1) * pas, 1),
        "lettres": lettres,
    }


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    variable = TTFont(sys.argv[1])
    police = instancer.instantiateVariableFont(variable, AXES)

    mots = TITRE.upper().split(" ")
    mises_en_page = {
        # Sur une ligne pour les grands ecrans, un mot par ligne sur un telephone.
        "uneLigne": mettre_en_page(police, [" ".join(mots)]),
        "parMot": mettre_en_page(police, mots),
    }

    entete = (
        "/*\n"
        " * GENERE par scripts/titre-en-traces.py : ne pas modifier a la main.\n"
        f" * Titre « {TITRE} », Archivo largeur {AXES['wdth']} graisse {AXES['wght']}, unites de police\n"
        " * (1000 par cadratin), y vers le bas, origine au coin haut gauche des capitales.\n"
        " */\n\n"
    )
    corps = (
        "export type LettreTracee = { lettre: string; ligne: number; x: number; largeur: number; d: string };\n"
        "export type MiseEnPageTitre = { largeur: number; hauteur: number; lettres: LettreTracee[] };\n\n"
        f"export const TITRE = {json.dumps(TITRE, ensure_ascii=False)};\n\n"
        "export const TITRE_TRACES: Record<\"uneLigne\" | \"parMot\", MiseEnPageTitre> = "
        + json.dumps(mises_en_page, ensure_ascii=False, indent=2)
        + ";\n"
    )
    SORTIE.write_text(entete + corps, encoding="utf-8")
    print(f"{SORTIE.name} : {sum(len(m['lettres']) for m in mises_en_page.values())} lettres ecrites")


if __name__ == "__main__":
    main()
