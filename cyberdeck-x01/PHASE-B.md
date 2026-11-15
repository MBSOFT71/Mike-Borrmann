# CYBERDECK X-01 ORBITAL — Phase B

Parametrische Fusion-360-Grundstruktur. **Kein druckfertiges Gehäuse.**  
HEXOS bleibt unangetastet. Phase-A-Dateien bleiben.

Fusion 360 ist in der Autorenumgebung **nicht** installiert. Das Skript wurde **nicht** in Fusion ausgeführt.

---

## STEP-Vergleich (Clip)

Pimoroni Printables 1779998 liefert **zwei** Bucks:

| Datei | Datum | Lanyard-Löcher | Kleiderclip | Hülle |
|---|---|---|---|---|
| [`refs/Badgeware_Solid.step`](refs/Badgeware_Solid.step) | 16. Jun 2026 | **nein** | **ja**, Y bis −14,758 | 84,002 × 76,001 × 21,358 |
| [`refs/Badge_Case_Solid_w_Holes.step`](refs/Badge_Case_Solid_w_Holes.step) | 13. Jul 2026 | **ja** | **ja**, identisch | identisch |

Pimoroni-Text: *„one with, and one without lanyard holes“*. Es gibt **keine** offizielle STEP ohne Clip.

Das STEM-Kit hat den Clip. Deshalb:

- **Bohr-Körper für die Deckelhöhle:** `Badgeware_Solid` (keine Löcher, Boolean bleibt dicht).
- **Merkmals-Referenz:** `w_Holes` (USB-Stadion, fünf Tastenlöcher, Lanyard).
- **Clip:** bleibt als Tasche in der Deckelaußenschale. Kein erfundenes clip-loses Solid.

Koordinaten **unverändert** (STEP-Ursprung).

---

## Platzbedarf gegen 160 × 110 × 45 mm

Rechnung: [`fusion360/check_envelope.py`](fusion360/check_envelope.py)

| Stapel (Schienen **neben** dem Pad, nicht darunter) | Höhe |
|---|---|
| Wand 3 + Case inkl. Clip 21,36 + Luft 2 + Pad 6,7 + Schlitten 3 + Boden 3 | **39,06 mm** |
| dasselbe mit Rumpf ohne Clip (13,65 mm, nur abgeleitet) | **31,35 mm** |
| Ziel | **45 mm** |

**45 mm reicht**, wenn die Schienen seitlich liegen. Extra Breite 160−84 = 76 mm (Panzerung). Extra Tiefe 110−76 = 34 mm (Wände + Scharnier + Schlittenhaus). Das Zielmaß bleibt **vorläufig**.

---

## Was das Fusion-Skript wirklich anlegt

Skript: [`fusion360/X01_Orbital_PhaseB/`](fusion360/X01_Orbital_PhaseB/)  
Parameterliste: [`fusion360/parameters.json`](fusion360/parameters.json)

Jedes Mal ein **neues** Dokument `X01_ORBITAL_PhaseB_<UTC-Zeit>`. Nichts überschreiben.

### Komponenten

| Komponente | Inhalt | Status |
|---|---|---|
| `_REF_Tufty_Buck` | Import `Badgeware_Solid.step` | Referenzkörper |
| `_REF_Tufty_Holes` | Import `w_Holes`, Lampe aus | Referenz, USB/Tasten |
| `_REF_Pad_Envelope` | Quader 58 × 25 × 6,7 + zwei M2.5-Punkte | Shop-approx |
| `_REF_Stick_Envelope` | Quader 52 × 7,9 × 4,2 | Shop |
| `Lid` | Hüllquader inkl. Clip-Wand | Platzhalter |
| `Display_Mount` | Rahmen um das Case | Platzhalter |
| `Base` | Untergehäuse-Hülle | Platzhalter |
| `Sled` | Schlittenplatte, Lage „eingeschoben“ | Platzhalter |
| `Rail_Left` / `Rail_Right` | zwei Schienen, Überlappung + Hub | Platzhalter |
| `Detents` | `DETENT_IN` / `HALF` / `OUT` plus Anschläge | Konstruktion |
| `Hinge` | Punkte `HINGE_L/R`, Achse, Knöchel-Hülle, 110° als Parameter | Konstruktion |
| `Sensor_Mount` | offene Tasche um den Stick | Platzhalter |
| `Covers` | Deckelplatte | Platzhalter |

Skizzen `MASS_Seitenansicht_geschlossen` und `MASS_Draufsicht`.

### Parameter

- **C_** aus STEP oder Shop (Pad/Stick Shop-approx).
- **D_** aus Vertices abgeleitet (Rumpf ohne Clip) — **kein** zweites Hersteller-CAD.
- **P_** Konstruktion (160×110×45, Wände, Hub 40 mm, 110°).
- **M01_ M02_ M08_ M09_ M10_** fehlende Hardware, ausdrücklich Platzhalter.

---

## Nur konzeptionell (nicht als Fertigteil)

- Facetten, Orange-Schwarz, LED-Balken der KI-Bilder.
- USB-C-Fenster mit Steckerzugabe (M01).
- Qw/ST-Kanal durchs Scharnier (M02).
- HOME/RESET-Zugang (M03).
- Sichtfenster aufs Glas (M05).
- Rastfedern, Endanschlag-Geometrie, Kabelkette.
- FDM-Passung, Gewindeeinsätze.
- Gelenk 0…110° als Fusion-Joint (Skript legt Achse/Parameter an, kein getestetes Joint).

Schlittenbewegung: **+Z**, gerade, drei Lagen. Tasten in Lage 0 erreichbar (Pad nicht in einer Blende versteckt).

---

## Nach Hardware-Lieferung noch messen

Unverändert M01–M03, M05, M07–M10. M04 Case-Löcher und M06 Clip/Lasche sind aus STEP da; Kappen-Hub und Clip-Feinform am Gerät prüfen.

Kit-Kabel nicht als 200 mm behaupten — 200 mm ist die **Handelsoption**, Parameter `M10_cable_len`.

---

## Nächster Schritt

Phase B.1 (Validierung und Vorschau): [PHASE-B1.md](PHASE-B1.md).  
Phase C: Schlitten/Schienen aus den Platzhaltern. Keine STL vor Phase G.
