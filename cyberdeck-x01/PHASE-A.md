# CYBERDECK X-01 ORBITAL — Phase A

Hardwaredaten und CAD-Referenzen. **Kein Gehäuse modelliert.**  
HEXOS (`hexos/`) bleibt getrennt und unangetastet.

Quellen abgerufen: 15. Nov 2026.

## Ergebnis in einem Satz

Fusion 360 darf **parametrische Hüllen und ein Maßgerüst** anlegen. **Druckfertige Teile nicht**, solange der offizielle Badgeware-Blank und die Messliste M01–M10 fehlen.

Die im Auftrag genannte STEP-Datei liegt **nicht** im Repo und nicht in den Anhängen. Nur die KI-Referenzbilder sind vorhanden.

---

## Bestätigte Maße

| Bauteil | Größe | Wert | Quelle | Bemerkung |
|---|---|---|---|---|
| Tufty 2350 | Außen mit Case | **84 × 76 × 20 mm** (B × H × T) | [Pimoroni Shop](https://shop.pimoroni.com/products/tufty-2350) | Komplettgerät inkl. Polycarbonat-Gehäuse |
| Tufty 2350 | Display | 2,8″ IPS, 320 × 240, 4:3 | Shop + [Badgeware-Docs](https://badgewa.re/docs) | Aktive Fläche **gerechnet** aus 2,8″ und 4:3: **≈ 56,9 × 42,7 mm**. Modulrahmen **nicht** vom Hersteller angegeben |
| Tufty 2350 | USB-C | linke Gehäusekante | [Meet your badge](https://github.com/pimoroni/badgeware-docs/blob/main/introduction/meet-your-badge.md) | Offset unbestätigt |
| Tufty 2350 | I2C | 1× Qw/ST auf der Rückseite | Shop + Docs | Koordinaten unbestätigt |
| Tufty 2350 | Tasten | 5 vorn (A, B, C, UP, DOWN); HOME + RESET hinten | Docs | Raster unbestätigt |
| Tufty 2350 | Licht | Phototransistor vorn; 4 Zonen Case-LEDs hinten | Shop | Lage unbestätigt |
| Qw/ST Pad | Außen | **58 × 25 × 6,7 mm** (L × B × H), *approx.* | [Qw/ST Pad](https://shop.pimoroni.com/products/qwst-pad) | Shop selbst: Näherung |
| Qw/ST Pad | Löcher | **M2.5**, 3 mm von den **oberen** Ecken, **52 mm** Achsmaß | Shop Notes | Nur die oberen zwei Löcher beschrieben |
| Qw/ST Pad | Ecken | oben **R3**, unten **R10** | Shop Notes | Für Schlitten-Kontur |
| Qw/ST Pad | Tasten | U D L R, A B X Y, +/−; keine Analogsticks | Shop | Layout/Hub unbestätigt |
| Multi-Sensor Stick | Außen inkl. Stecker | **52 × 7,9 × 4,2 mm** | [Multi-Sensor Stick](https://shop.pimoroni.com/products/multi-sensor-stick) | |
| Multi-Sensor Stick | Löcher | M2.5 | Shop Notes | **Achsmaß fehlt** |
| Qw/ST Stecker | Standard | JST SH 1,0 mm, 4 pol; Side-entry **Höhe 2,95 mm**, **Tiefe 5,55 mm** | [JST SH](https://media.digikey.com/PDF/Data%20Sheets/JST%20PDFs/SH%20Connector.pdf) | Qw/ST = Qwiic = STEMMA QT |
| Qw/ST Kabel | Handelslängen | JST-SH–JST-SH **50 / 200 / 500 mm** | [Pimoroni Kabel](https://shop.pimoroni.com/products/jst-sh-cable-qwiic-stemma-qt-compatible) | Kit-Inhalt: 2 Kabel, **Länge unbekannt** |

GitHub `pimoroni/tufty2350` enthält Firmware und `pins.csv`, **kein** mechanisches CAD.

---

## Offizielles CAD, das existiert — aber hier nicht liegt

Pimoroni hat am 13. Juli 2026 den **Badgeware Blank** veröffentlicht:

- https://www.printables.com/model/1779998-pimoroni-badgeware-blank
- Dateien: `Badgeware_Solid.step` / `.stl`, `Badge_Case_Solid_w_Holes.step` / `.stl`
- Zweck: 1:1-Buck der **Außenkontur** von Board + mitgeliefertem Case, zum Drumherum-Konstruieren

Ohne Login auf Printables hier nicht heruntergeladen (Listing 500). Das ist die Datei, die der Auftrag meint.

Weitere Printables von Pimoroni (nicht importiert, nur Hinweis):

- Qw/ST Pad Game Controller Case
- Badgeware Multi-Sensor Stick Clip

KiCad/STEP für Pad- und Stick-**Platinen** öffentlich nicht gefunden. Schema-PDFs existieren (Kamami), ohne Board-Outline.

---

## Noch zu messen (nicht erfunden)

| ID | Messung | Blockiert |
|---|---|---|
| M01 | USB-C: Mitte, Höhe über Boden, Steckerzugabe | Deckelausschnitt, Laden bei geschlossenem Gerät |
| M02 | I2C-Buchse: Lage, Kabelabgang | Kanal durch Scharnier |
| M03 | HOME / RESET / BOOT: Lage, Durchmesser | Zugang |
| M04 | Fünf Fronttasten: Raster, Ø, Überstand | Nur wenn Original-Case ab |
| M05 | Display: Glas zu Gehäuserand | Sichtfenster 2,8″ |
| M06 | Tufty-Rückseite: Clips, Wölbung, Lanyard | Deckelaufnahme |
| M07 | Pad: Kante der Qw/ST-Buchsen | Kabel im Schlitten |
| M08 | Pad: Tasten über 6,7 mm, Hub | Fingerfreiheit eingeschoben |
| M09 | Stick: M2.5-Achsmaß, welche Seite Sensoren | Luft/Licht/Nähe |
| M10 | Kit-Kabel: Länge, Biegeradius | Schleife für 3 Schlittenpositionen |

---

## KI-Referenz vs. Hardware

Die sechs Ansichten (geschlossen, USB-Stirn, offen, Schlitten) gelten **nur als Form**: Facetten, Orange, weiße Balken, Clamshell, Schlitten nach vorn, ~110° Deckel.

Nicht übernehmen:

- Bildschirmgröße (Rendering >> 2,8″ auf 84 × 76 mm)
- Gamepad-Platte (Rendering >> 58 × 25 mm Pad)
- USB-C in der Scharnier-Stirn (echt: **linke Tufty-Kante**)
- Sechs App-Icons auf dem Display als mechanisches Feature

Vorläufiges Außenmaß **160 × 110 × 45 mm** (geschlossen) ist unverbindlich. Um 84 × 76 × 20 bleibt seitlich Platz für Panzerung; **45 mm Höhe** gegen Tufty-Dicke + Wände + Pad 6,7 mm + Schienen ist **knapp** und nach Blank-Import zu prüfen.

---

## Einbaukonzept (Empfehlung)

1. **Tufty im Original-Case lassen** und als Block 84 × 76 × 20 mm in den Deckel setzen. PCB-CAD fehlt; der Blank beschreibt genau diesen Block.
2. **Pad** als eigenes Board im Schlitten, zwei M2.5, 52 mm, Kontur R3/R10.
3. **Stick** in belüfteter Tasche, Licht-/Nähefenster, nicht luftdicht.
4. **Kabel:** mindestens 200 mm für den Schlitten (50 mm reicht geometrisch fast sicher nicht für drei Positionen + Scharnier). Kit-Länge erst messen (M10), sonst 200 mm-Kabel vorsehen.
5. Schlitten: gerade nach vorn, drei Rasten, zwei Schienen, Anschläge. Tasten in allen drei Lagen erreichbar — das zwingt den Schlitten, das Pad **nicht** vollständig in einer Blende zu verstecken.

---

## Fusion 360 — was jetzt erlaubt ist

| Arbeit | Jetzt | Sperre |
|---|---|---|
| User-Parameters, Ursprung | ja | — |
| Tufty-Quader 84 × 76 × 20 als Platzhalter | ja, grob | Blank für echte Kontur |
| Pad-Platte 58 × 25, Löcher 52 mm | ja, grob | Steckerseite, Tastenhub |
| Stick-Quader 52 × 7,9 × 4,2 | ja, grob | Lochabstand |
| Schienen / drei Rasten | Skizze | Hub, Kabel, Pad-Höhe |
| Scharnier 110° + Anschlag | Konzept | Deckelmasse |
| STL / 3MF für Bambu H2D | **nein** | M01–M10 + Blank |

Keine Fusion-Skripte in diesem Schritt, keine Volumenkörper als „fertiges Gehäuse“.

---

## Nächster Schritt

1. `Badgeware_Solid.step` von Printables laden und hier unter `cyberdeck-x01/refs/` ablegen.
2. STEM-Kit mit Messschieber: M01–M10.
3. Phase B: Maßplan + Fusion-Parameter, immer noch ohne druckfertiges Gehäuse.
