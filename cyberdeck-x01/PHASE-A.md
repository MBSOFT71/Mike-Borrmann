# CYBERDECK X-01 ORBITAL — Phase A

Hardwaredaten und CAD-Referenzen. **Kein Gehäuse modelliert.**  
HEXOS (`hexos/`) bleibt getrennt und unangetastet.

Quellen abgerufen: 15. Nov 2026. STEP ausgewertet: 15. Nov 2026.

## Ergebnis in einem Satz

Die offizielle Case-STEP liegt jetzt im Repo. Fusion 360 darf **diese Kontur importieren** und parametrische Hüllen anlegen. **Druckfertige Teile nicht**, solange M01 (Steckerzugabe), M02, M03, M05, M07–M10 fehlen.

---

## STEP, die jetzt da ist

Datei: [`refs/Badge_Case_Solid_w_Holes.step`](refs/Badge_Case_Solid_w_Holes.step)

- Header-Name: `Badge_Case_Solid_w_Holes.step`
- Zeitstempel: `2026-07-13T10:26:38+01:00`
- System: Autodesk Translation Framework (Printables *Pimoroni Badgeware Blank*, Modell 1779998)
- Inhalt: **ein** Solid `Badge Case Solid` — Außenkontur des Tufty-2350-Polycarbonat-Gehäuses inklusive Tasten- und Lanyard-Löchern
- **Kein** PCB, kein Displayglas als eigenes Teil, kein Pad, kein Stick

Zahlen: [`refs/tufty-case-from-step.json`](refs/tufty-case-from-step.json)  
Ansichten der Tessellation: [`refs/views/`](refs/views/)

Auswertung über `VERTEX_POINT` und Zylinder/Kreise. Spline-Polpunkte (Schein-BBox hunderte mm) ignoriert.

### Koordinatensystem der STEP (behalten)

| Achse | Richtung am Badge |
|---|---|
| **+X** | rechts, Blick aufs Display |
| **+Y** | nach vorn aus dem Display |
| **+Z** | zu den drei oberen Tasten |
| Ursprung | X in der Breitenmitte; **nicht** in der Dicken- oder Höhenmitte (Z-Mitte der Hülle ≈ −5 mm) |

USB-C sitzt auf **−X**. Lanyard-Lasche auf **−Z**. Kleiderclip auf **−Y**.

---

## Bestätigte Maße

| Bauteil | Größe | Wert | Quelle | Bemerkung |
|---|---|---|---|---|
| Tufty-Case | Breite × Höhe | **84,002 × 76,001 mm** | STEP Vertices | Shop **84 × 76** bestätigt |
| Tufty-Case | Dicke inkl. Clip | **21,358 mm** (Y −14,758 … +6,600) | STEP | Shop **20 mm** rundet; der Clip steht über |
| Tufty-Case | Frontfläche | **Y = 6,600 mm** | STEP Ebenen | |
| Tufty-Case | Tasten-/Display-Rücksprung | **Y = 5,100 mm**, Stufe **1,50 mm** | STEP | |
| Tufty-Case | 5 Fronttasten, Löcher | **6,80 × 6,80 mm**, Ecken **R0,5**, Raster **18 mm** | STEP | Mitten XZ: (−18, 27), (0, 27), (18, 27), (36, 9), (36, −9). Belegung A/B/C/UP/DOWN nicht aus dem Solid allein |
| Tufty-Case | USB-C-Ausschnitt | Stadion **11,90 × 4,80 mm**, R **2,40** | STEP Zylinder | Mitte **(−40,106, −3,581, 0,016)**; 1,90 mm hinter der linken Außenkante; 10,18 mm hinter der Front |
| Tufty-Case | Lanyard-Lasche | Z **−43 … −32**, Dicke **1,60 mm** (Y ±0,80) | STEP | |
| Tufty-Case | Lanyard-Schlitz | Stadion, Kreis **R 1,6166** bei Z **−39,842** | STEP | halbe Breite ≈ 6,49 mm |
| Tufty-Case | Lanyard-Ecken | **Ø 3,0** bei XZ **(±36, −39)**, Außen **R4** | STEP | |
| Tufty-Case | Kleiderclip | Y bis **−14,758**, X-Spanne ≈ 34 mm | STEP | Braucht Tasche im Deckel oder bleibt außerhalb des Stapels |
| Tufty 2350 | Display | 2,8″ IPS, 320 × 240, 4:3 | Shop + Docs | Aktive Fläche **gerechnet** **≈ 56,9 × 42,7 mm**. Glas zu Blendrand **nicht** in der STEP getrennt |
| Tufty 2350 | I2C | 1× Qw/ST auf der Rückseite | Shop + Docs | Case hat eine hintere Tasche (X ≈ 7,4…26,6, Y ≈ −7,1…−3,4, Z ≈ −32…−20) — **nicht** als Buchse bestätigt |
| Qw/ST Pad | Außen | **58 × 25 × 6,7 mm** (L × B × H), *approx.* | [Qw/ST Pad](https://shop.pimoroni.com/products/qwst-pad) | Shop selbst: Näherung |
| Qw/ST Pad | Löcher | **M2.5**, 3 mm von den **oberen** Ecken, **52 mm** Achsmaß | Shop Notes | Nur die oberen zwei Löcher beschrieben |
| Qw/ST Pad | Ecken | oben **R3**, unten **R10** | Shop Notes | Für Schlitten-Kontur |
| Qw/ST Pad | Tasten | U D L R, A B X Y, +/−; keine Analogsticks | Shop | Layout/Hub unbestätigt |
| Multi-Sensor Stick | Außen inkl. Stecker | **52 × 7,9 × 4,2 mm** | [Multi-Sensor Stick](https://shop.pimoroni.com/products/multi-sensor-stick) | |
| Multi-Sensor Stick | Löcher | M2.5 | Shop Notes | **Achsmaß fehlt** |
| Qw/ST Stecker | Standard | JST SH 1,0 mm, 4 pol; Side-entry **Höhe 2,95 mm**, **Tiefe 5,55 mm** | [JST SH](https://media.digikey.com/PDF/Data%20Sheets/JST%20PDFs/SH%20Connector.pdf) | |
| Qw/ST Kabel | Handelslängen | JST-SH–JST-SH **50 / 200 / 500 mm** | Pimoroni | Kit-Länge unbekannt |

GitHub `pimoroni/tufty2350` enthält Firmware, **kein** PCB-CAD.

---

## Noch zu messen (nicht erfunden)

| ID | Messung | Status nach STEP | Blockiert |
|---|---|---|---|
| M01 | USB-C Steckerzugabe über den Case-Ausschnitt | Ausschnitt **bestätigt**; Zugabe/Knick **offen** | Laden bei geschlossenem Gerät |
| M02 | I2C-Buchse: Lage, Kabelabgang | hintere Tasche nur Kandidat | Kanal durch Scharnier |
| M03 | HOME / RESET / BOOT: Lage, Durchmesser | in dieser STEP **nicht** als eigene Löcher gelesen | Zugang |
| M04 | Fünf Fronttasten: Raster, Ø, Überstand | **Case-Löcher bestätigt**; Kappen-Ø und Hub offen | nur wenn Original-Case ab |
| M05 | Display: Glas zu Gehäuserand | Rücksprung-Ebene da, **kein** Glas-Körper | Sichtfenster 2,8″ in *unserer* Blende |
| M06 | Tufty-Rückseite: Clip, Lasche, Wölbung | Clip + Lasche **bestätigt**; Feinform der Wölbung grob | Deckelaufnahme |
| M07 | Pad: Kante der Qw/ST-Buchsen | unverändert | Kabel im Schlitten |
| M08 | Pad: Tasten über 6,7 mm, Hub | unverändert | Fingerfreiheit eingeschoben |
| M09 | Stick: M2.5-Achsmaß, Sensorseite | unverändert | Luft/Licht/Nähe |
| M10 | Kit-Kabel: Länge, Biegeradius | unverändert | Schleife für 3 Schlittenpositionen |

---

## KI-Referenz vs. Hardware

Die sechs Ansichten gelten **nur als Form**: Facetten, Orange, weiße Balken, Clamshell, Schlitten nach vorn, ~110° Deckel.

Nicht übernehmen:

- Bildschirmgröße (Rendering >> 2,8″ auf 84 × 76 mm)
- Gamepad-Platte (Rendering >> 58 × 25 mm Pad)
- USB-C in der Scharnier-Stirn (echt: **linke Tufty-Kante, −X**, Ausschnitt Mitte Z ≈ 0)
- Sechs App-Icons auf dem Display als mechanisches Feature

Vorläufiges Außenmaß **160 × 110 × 45 mm** (geschlossen) bleibt unverbindlich.

**Höhe 45 mm:** Case inkl. Clip **21,4 mm**. Im Clamshell sitzt der Tufty mit dem Display nach innen; der Clip zeigt in den Deckelmantel. Entweder Clip-Tasche in der Deckelaußenschale oder Clip nicht einhäusen. Ohne Clip liegt der Rumpf eher bei **~14,6 mm** plus Lasche. Plus Wände, Pad 6,7 mm und Schienen bleibt 45 mm **knapp** — in Phase B am importierten Solid prüfen, nicht als festes Maß halten.

---

## Einbaukonzept (Empfehlung)

1. **Tufty im Original-Case lassen.** Die STEP **ist** dieser Block. In Fusion als Referenzkörper einfügen, nicht nachbauen.
2. **Pad** als eigenes Board im Schlitten, zwei M2.5, 52 mm, Kontur R3/R10.
3. **Stick** in belüfteter Tasche, Licht-/Nähefenster, nicht luftdicht.
4. **Kabel:** mindestens 200 mm für den Schlitten; Kit-Länge M10.
5. Schlitten: gerade nach vorn, drei Rasten, zwei Schienen, Anschläge. Tasten in allen drei Lagen erreichbar.
6. USB-C-Fenster im X-01-Deckel **auf den Case-Ausschnitt ausrichten**, plus noch zu messende Steckerzugabe (M01).

---

## Fusion 360 — was jetzt erlaubt ist

| Arbeit | Jetzt | Sperre |
|---|---|---|
| User-Parameters, Ursprung = STEP-Ursprung | ja | — |
| `Badge_Case_Solid_w_Holes.step` als Referenzkörper | ja | nicht zerlegen / nicht „nachmodellieren, bis es hübsch ist“ |
| Pad-Platte 58 × 25, Löcher 52 mm | ja, grob | Steckerseite, Tastenhub |
| Stick-Quader 52 × 7,9 × 4,2 | ja, grob | Lochabstand |
| Schienen / drei Rasten | Skizze | Hub, Kabel, Pad-Höhe |
| Scharnier 110° + Anschlag | Konzept | Deckelmasse um importiertes Solid |
| STL / 3MF für Bambu H2D | **nein** | Rest von M01–M10 |

Keine druckfertigen Volumenkörper in diesem Schritt. HEXOS unverändert.

---

## Nächster Schritt

1. STEM-Kit mit Messschieber: Rest M01–M10 (vor allem Steckerzugabe, Qw/ST-Abgang, HOME/RESET, Pad/Stick, Kit-Kabel).
2. Phase B: Maßplan + Fusion-Parameter um das importierte Solid, immer noch ohne druckfertiges Gehäuse.
