# Fusion 360 — Phase B / B.1

In der Autorenumgebung ist Fusion 360 **nicht** installiert und **nicht** ausgeführt.

Vorschau ohne Fusion: aus `cyberdeck-x01/`

```
python3 -m pip install cascadio matplotlib numpy
python3 fusion360/preview.py
```

Ausgabe: `preview/*.png` und `preview/VALIDATION.md`. Das ist keine Fusion-Ausführung.

## Installation

1. Fusion → Dienstprogramme → Add-Ins → **Skripte und Add-Ins**.
2. Ordner `X01_Orbital_PhaseB` nach  
   `Autodesk/Autodesk Fusion 360/API/Scripts/` **kopieren**, nichts überschreiben.
3. STEPs liegen in `cyberdeck-x01/refs/`. Das Skript sucht den Ordner mehrere Ebenen über dem Skript. Sonst Dateidialog  
   `Badgeware_Solid.step` und `Badge_Case_Solid_w_Holes.step`.

## Start

- Skript **erzeugt selbst** ein neues Dokument `X01_ORBITAL_PhaseB_<UTC>`.
- Ausführen: `X01_Orbital_PhaseB`.
- Nochmal ausführen = weiteres Dokument.

## Was du sehen solltest

- Browser: `_REF_Tufty_Buck` (Solid), `_REF_Tufty_Holes` (Lampe aus), Lid/Base/Sled/Rails/Hinge/Sensor.
- User-Parameters `C_` / `D_` / `P_` / `M_`.
- Hüllen heißen `PLACEHOLDER_*` — **kein** Druckexport.
- STEPs nur importiert, nicht skaliert.

Wenn der Import fehlschlägt: Dateidialog, danach `fit`.  
Wenn Boxen an der falschen Achse sitzen: BRep-Pfad ist fehlgeschlagen, Fallback-Extrusion — Meldung im Textfenster.

Parameter: [parameters.json](parameters.json)  
Hülle: `python3 check_envelope.py`  
Validierung: [../PHASE-B1.md](../PHASE-B1.md)
