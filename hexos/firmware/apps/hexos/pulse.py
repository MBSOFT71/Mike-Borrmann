import math
from lib import (
    ORANGE, ORANGE_DIM, BG, PANEL, WHITE, DIM, GREEN, MUTED, AMBER, RED, CYAN,
    panel, hint_bar, caselight_chase, clamp, text_w,
)

HIST_T = []
HIST_H = []
HIST_L = []


def enter(_ctrl, sensors):
    global HIST_T, HIST_H, HIST_L
    HIST_T, HIST_H, HIST_L = [22] * 48, [50] * 48, [80] * 48
    sensors.update(force=True)


def _gauge(cx, cy, r, value, vmin, vmax, label, unit, col):
    screen.pen = PANEL
    screen.circle(cx, cy, r)
    screen.pen = BG
    screen.circle(cx, cy, r - 2)
    t = clamp((value - vmin) / float(vmax - vmin), 0.0, 1.0)
    start = math.pi * 0.75
    span = math.pi * 1.5
    steps = 18
    for i in range(steps):
        a0 = start + span * (i / steps)
        a1 = start + span * ((i + 1) / steps)
        on = (i / steps) <= t
        screen.pen = col if on else MUTED
        x0 = int(cx + math.cos(a0) * (r - 5))
        y0 = int(cy + math.sin(a0) * (r - 5))
        x1 = int(cx + math.cos(a1) * (r - 5))
        y1 = int(cy + math.sin(a1) * (r - 5))
        screen.line(x0, y0, x1, y1)
    screen.font = font.sins
    txt = str(value)
    screen.pen = WHITE
    screen.text(txt, cx - text_w(txt) // 2, cy - 6)
    screen.font = font.ark
    screen.pen = DIM
    screen.text(label, cx - text_w(label) // 2, cy + 10)
    screen.pen = col
    screen.text(unit, cx - text_w(unit) // 2, cy + 20)


def _spark(x, y, w, h, data, col, vmin, vmax):
    screen.pen = PANEL
    screen.rectangle(x, y, w, h)
    if len(data) < 2:
        return
    prev = None
    n = len(data)
    for i, v in enumerate(data):
        px = x + int(i * (w - 2) / max(1, n - 1))
        t = clamp((v - vmin) / float(max(0.001, vmax - vmin)), 0.0, 1.0)
        py = y + h - 2 - int(t * (h - 4))
        screen.pen = col
        if prev:
            screen.line(prev[0], prev[1], px, py)
        prev = (px, py)


def tick(ctrl, sensors):
    caselight_chase(0.03)
    sensors.update()
    w, h = screen.width, screen.height
    screen.pen = BG
    screen.clear()
    panel(6, 22, w - 12, h - 40)

    screen.font = font.ark
    screen.pen = ORANGE
    screen.text("FIELD SENSORS", 14, 28)
    screen.pen = GREEN if sensors.ok else DIM
    screen.text("STEM LINK" if sensors.ok else "DEMO FEED", w - 80, 28)

    _gauge(64, 100, 42, sensors.temp, 10, 40, "TEMP", "C", ORANGE)
    _gauge(160, 100, 42, sensors.humid, 0, 100, "RH", "%", CYAN)
    _gauge(256, 100, 42, sensors.press, 980, 1040, "hPa", "", GREEN)

    # tilt horizon
    hx, hy, hw, hh = 14, 152, 90, 48
    screen.pen = PANEL
    screen.rectangle(hx, hy, hw, hh)
    mid = hy + hh // 2 + int(clamp(sensors.ay, -1, 1) * 14)
    screen.pen = ORANGE_DIM
    screen.rectangle(hx, mid, hw, hy + hh - mid)
    screen.pen = AMBER
    screen.line(hx, mid, hx + hw, mid)
    screen.pen = WHITE
    screen.font = font.ark
    screen.text("HORIZON", hx + 4, hy + 4)
    screen.text("X{:+.2f}".format(sensors.ax), hx + 4, hy + 16)

    _spark(114, 152, 90, 48, HIST_T[-48:], ORANGE, 16, 30)
    screen.font = font.ark
    screen.pen = DIM
    screen.text("TEMP", 118, 156)

    lux_bar = int(clamp(sensors.lux, 0, 400) / 400 * 88)
    screen.pen = PANEL
    screen.rectangle(214, 152, 92, 48)
    screen.pen = AMBER
    screen.rectangle(220, 184, lux_bar, 8)
    screen.pen = DIM
    screen.text("LUX " + str(int(sensors.lux)), 220, 156)
    if sensors.prox:
        screen.pen = RED
        screen.text("PROX " + str(int(sensors.prox)), 220, 168)

    if badge.ticks % 8 == 0:
        HIST_T.append(sensors.temp)
        HIST_H.append(sensors.humid)
        HIST_L.append(sensors.lux)
        if len(HIST_T) > 64:
            del HIST_T[0]
            del HIST_H[0]
            del HIST_L[0]

    hint_bar("C BACK", "TILT UNIT", "LIVE" if sensors.ok else "SIM")

    if ctrl.pressed("B") or ctrl.pressed("C") or ctrl.pressed("-"):
        return "home"
    return None
