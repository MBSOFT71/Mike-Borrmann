import math
from lib import ORANGE, ORANGE_DIM, BG, WHITE, DIM, GREEN, PANEL, MUTED, hsv, hint_bar, caselight_chase, lo

MODE = 0
MODES = ("WARP", "RIBBON", "SWEEP", "EMBER")
STARS = []
DROPS = []


def enter(_ctrl, _sensors):
    global MODE, STARS, DROPS
    MODE = 0
    lo()
    STARS = []
    for i in range(42):
        STARS.append([
            (i * 37) % 160,
            (i * 19) % 120,
            0.4 + (i % 5) * 0.35,
        ])
    DROPS = []
    for i in range(28):
        DROPS.append([(i * 13) % 160, (i * 29) % 120, 1 + i % 4])


def _warp(t, sensors):
    cx, cy = screen.width // 2, screen.height // 2
    tilt_x = int(sensors.ax * 18)
    tilt_y = int(sensors.ay * 14)
    for i in range(14):
        z = (t * 0.08 + i * 9) % 90 + 8
        s = 8 + z * 1.6
        k = int(40 + z * 2)
        screen.pen = hsv(18 + i * 4, 220, k)
        screen.circle(cx + tilt_x, cy + tilt_y, int(s))
        screen.pen = BG
        screen.circle(cx + tilt_x, cy + tilt_y, int(s) - 2)
    screen.pen = ORANGE
    screen.circle(cx + tilt_x, cy + tilt_y, 3)


def _ribbon(t, sensors):
    for band in range(4):
        phase = t * 0.03 + band * 0.9
        amp = 16 + band * 4 + sensors.lux * 0.02
        prev = None
        ybase = 28 + band * 18
        for x in range(0, screen.width, 4):
            y = int(ybase + math.sin(x * 0.08 + phase) * amp)
            screen.pen = hsv(12 + band * 8, 230, 180 - band * 20)
            if prev:
                screen.line(prev[0], prev[1], x, y)
                screen.line(prev[0], prev[1] + 1, x, y + 1)
            prev = (x, y)


def _sweep(t, _sensors):
    cx, cy = screen.width // 2, screen.height // 2 + 4
    screen.pen = PANEL
    for r in (18, 32, 46, 58):
        screen.circle(cx, cy, r)
        screen.pen = BG
        screen.circle(cx, cy, r - 1)
        screen.pen = MUTED
    ang = t * 0.05
    x2 = int(cx + math.cos(ang) * 60)
    y2 = int(cy + math.sin(ang) * 60)
    screen.pen = ORANGE
    screen.line(cx, cy, x2, y2)
    for i, star in enumerate(STARS):
        blink = (int(t / 80) + i) % 7
        screen.pen = GREEN if blink == 0 else DIM
        screen.circle(int(star[0]), int(star[1]), 1 if i % 4 else 2)


def _ember(t, sensors):
    heat = 0.4 + sensors.temp / 80.0
    for d in DROPS:
        d[1] -= d[2] * heat
        if d[1] < -4:
            d[1] = screen.height + 4
            d[0] = (d[0] + 17) % screen.width
        screen.pen = hsv(12, 230, 120 + d[2] * 30)
        screen.rectangle(int(d[0]), int(d[1]), 2, 6 + d[2])
    screen.pen = ORANGE_DIM
    screen.rectangle(0, screen.height - 10, screen.width, 10)


def tick(ctrl, sensors):
    global MODE
    caselight_chase(0.08)
    sensors.update()
    t = badge.ticks
    screen.pen = BG
    screen.clear()
    if MODE == 0:
        _warp(t, sensors)
    elif MODE == 1:
        _ribbon(t, sensors)
    elif MODE == 2:
        _sweep(t, sensors)
    else:
        _ember(t, sensors)

    screen.font = font.ark
    screen.pen = ORANGE
    screen.text(MODES[MODE], 4, 4)
    screen.pen = DIM
    screen.text("A MODE", 4, 14)

    if ctrl.pressed("A") or ctrl.pressed("+") or ctrl.pressed("R"):
        MODE = (MODE + 1) % len(MODES)
    if ctrl.pressed("L"):
        MODE = (MODE - 1) % len(MODES)
    if ctrl.pressed("B") or ctrl.pressed("C") or ctrl.pressed("-"):
        from lib import hi
        hi()
        return "home"
    return None
