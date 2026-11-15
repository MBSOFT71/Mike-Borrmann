# HEXOS

Taktisches OS für das **Pimoroni Tufty 2350 STEM Kit**.  
Look: schwarzes Clamshell, orange Panzerkanten, hexagonale Face-Buttons — Tufty-Screen oben, Qw/ST-Pad unten.

Der Tufty selbst ist ein flaches Badge. HEXOS behandelt Screen + Pad + Sensor-Stick als eine Ridge-Unit: dieselbe Silhouette wie auf dem Referenzfoto, dieselbe Sprache auf dem Display.

## Was drauf ist

| App | Was passiert |
|---|---|
| **ID** | Operator-Karte, Loadout, Uplink-Sigil |
| **PULSE** | STEM-HUD: Temp, Feuchte, Druck, Horizont, Lux |
| **VOID** | Runner. D-Pad steuert, A/X feuert, Neigung vom Stick hilft |
| **FIELD** | Warp, Ribbon, Sweep, Ember — reagiert auf Licht und Tilt |
| **RADIO** | WLAN-Sweep als Radar |
| **TIME** | Feld-Uhr mit RTC und Sensor-Zeile |

Ohne Sensor-Stick oder Pad stürzt nichts ab: Fronttasten und Demo-Feed greifen.

## Simulator

Im Ordner `simulator/` die `index.html` öffnen (oder lokal serven). Das Gerät auf der Seite ist der Look, das Display läuft live.

Steuerung: Pfeile = D-Pad, `A` `S` `X` `Y` = Face, `+` `−`, Enter bestätigt, Esc zurück.

## Auf den Tufty bringen

1. Badgeware-Firmware aktuell halten: [tufty2350 releases](https://github.com/pimoroni/tufty2350/releases)
2. USB-C, **RESET zweimal** tippen → Laufwerk `TUFTY`
3. Ordner `firmware/apps/hexos` nach `/apps/hexos` kopieren
4. `profile.py` auf deinen Namen drehen
5. Auswerfen, RESET, im Badge-Menü **Hexos** starten

Qw/ST-Pad an **I2C** auf der Rückseite. Multi-Sensor-Stick am zweiten Kabel (oder in Reihe). HOME auf der Rückseite bringt dich ins Badgeware-Menü, **− / B / C** in HEXOS zurück zum HEXOS-Home.

WLAN für RADIO: `secrets.py.example` als `/secrets.py` auf das Badge, SSID und Passwort eintragen.

## Profil

```python
NAME = "MIKE"
SURNAME = "BORRMANN"
CALLSIGN = "RIDGE-01"
TITLE = "OPERATOR"
```

in `firmware/apps/hexos/profile.py`.

## Hardware, die HEXOS voraussetzt

- Tufty 2350, 320×240 IPS, RP2350, 1000 mAh
- STEM Kit: Qw/ST Pad (D-Pad, A/B/X/Y, +/−) und Multi-Sensor Stick (BME280, LTR559, LSM6DS3)
