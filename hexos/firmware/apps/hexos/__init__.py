# HEXOS — tactical OS for Pimoroni Tufty 2350 + STEM kit
# Drop this folder into /apps on the badge (disk mode), then reset.

import sys
import math

APP_DIR = "/apps/hexos"
try:
    import os
    if is_dir(APP_DIR):
        os.chdir(APP_DIR)
        if APP_DIR not in sys.path:
            sys.path.insert(0, APP_DIR)
except Exception:
    pass

from lib import (
    ORANGE, ORANGE_DIM, BG, PANEL, PANEL2, WHITE, DIM, GREEN, MUTED, AMBER,
    hi, panel, hexagon, hint_bar, status_bar, caselight_chase, text_w,
    Controls, Sensors, battery_pip,
)
import profile as P
import identity
import field
import voidrun
import pulse as pulse_app
import radar
import chronos

hi()
badge.default_clear = BG
badge.default_pen = WHITE

ctrl = Controls()
sensors = Sensors()

APPS = [
    ("ID", "OPERATOR", identity, 0),
    ("PULSE", "SENSORS", pulse_app, 1),
    ("VOID", "RUNNER", voidrun, 2),
    ("FIELD", "VISUAL", field, 3),
    ("RADIO", "SWEEP", radar, 4),
    ("TIME", "CHRONOS", chronos, 5),
]

scene = "boot"
selected = 0
boot_until = 0
current = None


def start_boot():
    global scene, boot_until
    scene = "boot"
    boot_until = badge.ticks + 2200
    hi()


def open_app(idx):
    global scene, current
    scene = "app"
    current = APPS[idx][2]
    if hasattr(current, "enter"):
        current.enter(ctrl, sensors)


def draw_boot():
    w, h = screen.width, screen.height
    screen.pen = BG
    screen.clear()
    t = 1.0 - max(0, boot_until - badge.ticks) / 2200.0
    caselight_chase(0.12)

    # assembling brackets
    span = int(40 + t * 80)
    screen.pen = ORANGE
    x0, y0 = w // 2 - span, h // 2 - 50
    x1, y1 = w // 2 + span, h // 2 + 40
    arm = 18
    screen.line(x0, y0, x0 + arm, y0)
    screen.line(x0, y0, x0, y0 + arm)
    screen.line(x1, y0, x1 - arm, y0)
    screen.line(x1, y0, x1, y0 + arm)
    screen.line(x0, y1, x0 + arm, y1)
    screen.line(x0, y1, x0, y1 - arm)
    screen.line(x1, y1, x1 - arm, y1)
    screen.line(x1, y1, x1, y1 - arm)

    screen.font = font.ignore
    screen.pen = ORANGE if t > 0.25 else MUTED
    text = "HEXOS"
    screen.text(text, (w - text_w(text, 1)) // 2, h // 2 - 28)

    screen.font = font.sins
    screen.pen = WHITE if t > 0.45 else MUTED
    sub = "TUFTY 2350  //  RIDGE UNIT"
    screen.text(sub, (w - text_w(sub)) // 2, h // 2 + 4)

    screen.pen = DIM
    bar_w = int((w - 80) * min(1.0, t))
    screen.rectangle(40, h // 2 + 28, w - 80, 6)
    screen.pen = ORANGE
    screen.rectangle(40, h // 2 + 28, bar_w, 6)

    screen.font = font.ark
    screen.pen = GREEN if t > 0.85 else DIM
    msg = "SYSTEM ONLINE" if t > 0.85 else "IGNITION"
    screen.text(msg, (w - text_w(msg)) // 2, h // 2 + 42)


def draw_home():
    w, h = screen.width, screen.height
    screen.pen = BG
    screen.clear()
    caselight_chase(0.04)
    sensors.update()

    status_bar("HOME", P.CALLSIGN)
    # caution
    y = 19
    screen.pen = ORANGE_DIM
    screen.rectangle(0, y, w, 5)
    shift = (badge.ticks // 50) % 16
    x = -16 + shift
    screen.pen = BG
    while x < w:
        screen.triangle(x, y, x + 8, y, x + 4, y + 5)
        x += 16

    screen.font = font.sins
    screen.pen = WHITE
    screen.text(P.NAME + " " + P.SURNAME, 12, 32)
    screen.pen = DIM
    screen.text(P.TITLE + "  /  " + ("PAD LINK" if ctrl.pad else "FRONT KEYS"), 12, 46)
    battery_pip(w - 28, 34)

    # hex grid 3x2
    coords = [
        (56, 96), (160, 96), (264, 96),
        (56, 168), (160, 168), (264, 168),
    ]
    for i, app in enumerate(APPS):
        cx, cy = coords[i]
        on = i == selected
        r = 36 if on else 32
        screen.pen = ORANGE if on else PANEL2
        hexagon(cx, cy, r, True)
        screen.pen = BG if on else PANEL
        hexagon(cx, cy, r - 5, True)
        if on:
            screen.pen = ORANGE
            hexagon(cx, cy, r - 5, False)
        screen.font = font.sins
        screen.pen = WHITE if on else DIM
        tw = text_w(app[0])
        screen.text(app[0], cx - tw // 2, cy - 8)
        screen.font = font.ark
        screen.pen = ORANGE if on else MUTED
        tw = text_w(app[1])
        screen.text(app[1], cx - tw // 2, cy + 6)

    hint_bar("U/D SEL", "A OPEN", "B OPEN")


def update():
    global scene, selected, current
    ctrl.poll()

    if scene == "boot":
        draw_boot()
        if badge.ticks >= boot_until or ctrl.pressed("A") or ctrl.pressed("B"):
            scene = "home"
        return

    if scene == "home":
        if ctrl.pressed("L"):
            selected = (selected - 1) % 6
        if ctrl.pressed("R"):
            selected = (selected + 1) % 6
        if ctrl.pressed("U"):
            selected = (selected - 3) % 6
        if ctrl.pressed("D"):
            selected = (selected + 3) % 6
        if ctrl.pressed("A") or ctrl.pressed("B") or ctrl.pressed("X") or ctrl.pressed("+"):
            open_app(selected)
            return
        draw_home()
        return

    if scene == "app" and current:
        nxt = current.tick(ctrl, sensors)
        if nxt == "home":
            current = None
            scene = "home"
            hi()


start_boot()
run(update)
