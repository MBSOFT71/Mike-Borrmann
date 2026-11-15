# Fusion 360 — Phase B

In der Autorenumgebung ist Fusion 360 **nicht** installiert. Das Skript ist **nicht** in Fusion getestet.

## Installation

1. Fusion 360 → Dienstprogramme → Add-Ins → **Skripte und Add-Ins**.
2. Ordner `X01_Orbital_PhaseB` nach  
   `…/Autodesk/Autodesk Fusion 360/API/Scripts/` kopieren  
   (Skript **nicht** über eine vorhandene Datei gleichen Namens legen).
3. STEP-Dateien liegen unter `cyberdeck-x01/refs/`. Das Skript sucht  
   `../../refs/Badgeware_Solid.step` relativ zum Skriptordner.  
   Sonst Dateidialog.

## Start

- Neues leeres Dokument ist unnötig: das Skript **erzeugt selbst** `X01_ORBITAL_PhaseB_<UTC>`.
- Ausführen: `X01_Orbital_PhaseB`.
- Erneut ausführen = weiteres neues Dokument, nichts überschreiben.

## Danach in Fusion

- Parameter `C_`/`D_`/`P_`/`M_` prüfen.
- `_REF_Tufty_Holes` sichtbar schalten, wenn USB/Tasten ausgerichtet werden.
- Platzhalter `PLACEHOLDER_*` nicht als Druckteile exportieren.

Parameter-Quelle: [parameters.json](parameters.json)  
Hüllenrechnung (ohne Fusion): `python3 check_envelope.py`
