# CYBERDECK X-01 ORBITAL — Phase B.1

CAD-Validierung und räumliche Vorschau. Phase A/B bleiben. **Fusion 360 wurde nicht ausgeführt.**

Vorschau: [`preview/`](preview/) (PNG, kein STL). Layout: [`fusion360/layout.py`](fusion360/layout.py).

Ansichten: geschlossen (Seite/Front/Drauf/Iso), offen 110° Schlitten IN/HALF/OUT, Draufsicht ausgefahren. Übersicht: [`preview/contact_sheet.png`](preview/contact_sheet.png).

---

## Skriptprüfung

`X01_Orbital_PhaseB.py` — `python3 -m py_compile` ohne Fehler. `adsk` existiert nur in Fusion; hier kein Lauf.

| Thema | Befund | Änderung in B.1 |
|---|---|---|
| Syntax | OK | — |
| STEP-Pfade | relativ `../../refs` zu knapp, wenn das Skript in Autodesk/Scripts liegt | Suche mehrere Ebenen aufwärts + Dateidialog |
| Import | `importToTarget`, STEPs read-only | unverändert, beide Dateinamen |
| XZ-Skizze → Extrusion | Fusion mappt Sketch-Y oft auf −Z; Hüllen können spiegeln | **TemporaryBRepManager.createBox** (Fallback: alte Extrusion) |
| Construction points | `setByPoint(Point3D)` oft ungültig | SketchPoint auf XY-Ebene bei Z |
| `design.designType` | wirft, wenn schon parametrisch | try/except |
| `doc.name` | unzuverlässig | `activeDocument.name` |

Gefundene **Geometriefehler** der B-Platzhalter (behoben in `layout.py` und im Skript):

1. **Schienen** ragten auf Z≈101 mm, Envelope nur bis 56 mm — auch bei eingefahrenem Schlitten.
2. **Sensor/Stick** lagen bei Y≈−7 (im Deckel, Kollision mit Tufty). Jetzt in der Untergehäuse-Panzerung (+X).
3. **Pad** bündig an Tufty-Zmax: 40 mm Hub passten nicht in 110 mm. Pad jetzt in Z unter dem Display (Konstruktion, nicht Hardware).
4. **Scharnier** in der Display-Ebene an der Lanyard-Kante: bei 110° liefen 14 Mesh-Vertices in die Base-AABB. Achse **4 mm hinter** der Lasche (noch im 8-mm-Knöchel). Mesh-Check: **0** Treffer.

---

## STEP-Einbindung

Beide Dateien unverändert unter `refs/`. Skript importiert sie als `_REF_Tufty_Buck` und `_REF_Tufty_Holes` (Lampe aus). Kein Boolean, kein Scale.

---

## Stapelhöhe 39,1 mm

Bestätigt aus denselben Summanden, jetzt an den AABBs:

`P_wall 3 + C_tufty_t_clip 21,358 + P_gap_display 2 + C_pad_h 6,7 + P_sled_plate 3 + P_floor 3` = **39,058 mm**.

Ziel 45 mm → **5,94 mm Reserve**, wenn die Schienen **neben** dem Pad liegen (X), nicht darunter. Schienen Y=8,6…14,6, Pad Y=8,6…15,3 — gleicher Start, 6 mm vs 6,7 mm Höhe.

Y-Spalt Deckel/Base = 2,00 mm (= `P_gap_display`, vorläufig, M08).

---

## Was geometrisch existiert vs. Platzhalter

| Teil | Status |
|---|---|
| Tufty-Case (Clip, USB, Kontur) | **STEP-Geometrie** `Badgeware_Solid` |
| USB/Tasten/Lanyard-Löcher | **STEP-Geometrie** `w_Holes` (in Fusion optional sichtbar) |
| Cliptasche, Deckelhülle, Displayrahmen | Platzhalter-AABB |
| Untergehäuse, Cover | Platzhalter |
| Pad 58×25×6,7, Schlitten, zwei Schienen | Platzhalter (Shop-approx / P_) |
| Drei Rastpunkte IN/HALF/OUT | Konstruktionspunkte |
| Scharnier 110°, Achse X bei Y=6,6 Z=−47 | Konstruktion + Knöchel-AABB |
| Sensorhalter + Stick | Platzhalter in der +X-Bucht |

---

## Offene Konstruktionsprobleme

- Lid- und Base-AABBs sind **volle Quader**, keine Schalen — sie überdecken das Tufty optisch; in Fusion Körpertransparenz setzen.
- Rotiertes Lid-AABB bei 110° ist konservativ und überlappt die Base-Box; **Mesh tut es nicht**.
- `P_gap_display = 2 mm` und `M08` Tastenhub unbekannt — Kollision Pad/Display möglich.
- USB-C-Fenster und Steckerzugabe (M01) nicht ausgeschnitten.
- Kabelkanal Scharnier (M02), HOME/RESET (M03), Glas (M05) fehlen.
- Rastfedern, Anschlagform, FDM-Spiel nicht modelliert.
- 110°-Gelenk in Fusion nicht als Joint getestet.
- KI-Facetten/Farbe nicht in den Platzhaltern.

Noch messen: M01–M03, M05, M07–M10.

---

## Lokaler Fusion-Test (nicht hier gelaufen)

Siehe [`fusion360/README.md`](fusion360/README.md). Erwartung: neues Dokument, zwei importierte STEPs, `PLACEHOLDER_*`-Boxen, Parameter `C_`/`D_`/`P_`/`M_`. Kein STL-Export.

Vorschau ohne Fusion: `python3 fusion360/preview.py` → `preview/contact_sheet.png`.
