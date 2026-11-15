import math
from lib import (
    ORANGE, BG, WHITE, DIM, GREEN, RED, PANEL, MUTED, AMBER,
    hint_bar, caselight_chase, lo, clamp,
)

SHIP_X = 80
SHIP_Y = 100
VX = 0
BULLETS = []
ROCKS = []
PARTS = []
SCORE = 0
LIVES = 3
DEAD = 0
BEST = 0
SPAWN = 0
FLASH = 0


def enter(_ctrl, _sensors):
    global SHIP_X, SHIP_Y, VX, BULLETS, ROCKS, PARTS, SCORE, LIVES, DEAD, SPAWN, FLASH, BEST
    lo()
    SHIP_X, SHIP_Y, VX = 80, 100, 0
    BULLETS = []
    ROCKS = []
    PARTS = []
    SCORE = 0
    LIVES = 3
    DEAD = 0
    SPAWN = 0
    FLASH = 0
    try:
        data = {"best": 0}
        State.load("hexos_void", data)
        BEST = int(data.get("best", 0))
    except Exception:
        BEST = 0


def _burst(x, y, n=10):
    for i in range(n):
        a = i / n * math.pi * 2
        PARTS.append([x, y, math.cos(a) * 2.2, math.sin(a) * 2.2, 14])


def _reset_round():
    global SHIP_X, VX, BULLETS, ROCKS
    SHIP_X, VX = 80, 0
    BULLETS = []
    ROCKS = []


def tick(ctrl, sensors):
    global SHIP_X, SHIP_Y, VX, SCORE, LIVES, DEAD, SPAWN, FLASH, BEST
    caselight_chase(0.1)
    sensors.update()
    w, h = screen.width, screen.height
    dt = max(1, badge.ticks_delta) / 16.0

    if DEAD:
        DEAD -= 1
        if DEAD == 0:
            if LIVES <= 0:
                try:
                    State.modify("hexos_void", {"best": BEST})
                except Exception:
                    pass
                from lib import hi
                hi()
                return "home"
            _reset_round()

    if not DEAD:
        ax = 0
        if ctrl.is_held("L"):
            ax -= 0.35
        if ctrl.is_held("R"):
            ax += 0.35
        ax += sensors.ax * 0.55
        VX = clamp(VX + ax, -3.2, 3.2)
        VX *= 0.92
        SHIP_X = clamp(SHIP_X + VX * dt, 8, w - 8)
        if ctrl.is_held("U"):
            SHIP_Y = clamp(SHIP_Y - 1.6 * dt, 20, h - 16)
        if ctrl.is_held("D"):
            SHIP_Y = clamp(SHIP_Y + 1.6 * dt, 20, h - 16)
        if ctrl.pressed("A") or ctrl.pressed("X"):
            BULLETS.append([SHIP_X, SHIP_Y - 6, -3.4])
            FLASH = 4

        SPAWN += dt
        rate = max(8, 28 - SCORE / 40)
        if SPAWN > rate:
            SPAWN = 0
            ROCKS.append([
                8 + (badge.ticks * 13) % (w - 16),
                -8,
                0.4 + (SCORE % 7) * 0.08,
                4 + (badge.ticks % 5),
            ])

        for b in BULLETS:
            b[1] += b[2] * dt
        BULLETS[:] = [b for b in BULLETS if b[1] > -4]

        for r in ROCKS:
            r[1] += r[2] * dt * (1.4 + SCORE * 0.002)
        ROCKS[:] = [r for r in ROCKS if r[1] < h + 10]

        for b in BULLETS[:]:
            for r in ROCKS[:]:
                if abs(b[0] - r[0]) < r[3] + 1 and abs(b[1] - r[1]) < r[3] + 1:
                    try:
                        BULLETS.remove(b)
                    except ValueError:
                        pass
                    try:
                        ROCKS.remove(r)
                    except ValueError:
                        pass
                    _burst(r[0], r[1], 8)
                    SCORE += 10
                    if SCORE > BEST:
                        BEST = SCORE
                    break

        for r in ROCKS:
            if abs(r[0] - SHIP_X) < r[3] + 4 and abs(r[1] - SHIP_Y) < r[3] + 4:
                LIVES -= 1
                DEAD = 40
                _burst(SHIP_X, SHIP_Y, 16)
                break

    for p in PARTS:
        p[0] += p[2]
        p[1] += p[3]
        p[4] -= 1
    PARTS[:] = [p for p in PARTS if p[4] > 0]
    if FLASH:
        FLASH -= 1

    screen.pen = BG
    screen.clear()
    # star dust
    for i in range(24):
        x = (i * 53 + badge.ticks // 2) % w
        y = (i * 29 + badge.ticks) % h
        screen.pen = MUTED if i % 3 else DIM
        screen.put(x, y)

    for r in ROCKS:
        screen.pen = ORANGE if int(r[3]) > 6 else AMBER
        screen.circle(int(r[0]), int(r[1]), int(r[3]))
        screen.pen = BG
        screen.circle(int(r[0]) - 1, int(r[1]) - 1, max(1, int(r[3]) - 3))

    screen.pen = WHITE
    for b in BULLETS:
        screen.rectangle(int(b[0]) - 1, int(b[1]) - 4, 2, 6)

    screen.pen = GREEN if not DEAD else RED
    sx, sy = int(SHIP_X), int(SHIP_Y)
    screen.triangle(sx, sy - 7, sx - 6, sy + 5, sx + 6, sy + 5)
    screen.pen = ORANGE
    screen.triangle(sx, sy - 2, sx - 3, sy + 5, sx + 3, sy + 5)

    for p in PARTS:
        screen.pen = ORANGE if p[4] > 6 else AMBER
        screen.circle(int(p[0]), int(p[1]), 1)

    if FLASH:
        screen.pen = WHITE
        screen.rectangle(0, 0, w, 1)
        screen.rectangle(0, h - 1, w, 1)

    screen.font = font.ark
    screen.pen = WHITE
    screen.text("SCR " + str(SCORE), 4, 4)
    screen.pen = DIM
    screen.text("BEST " + str(BEST), 4, 14)
    screen.pen = ORANGE
    screen.text("HP " + ("I" * max(0, LIVES)), w - 40, 4)

    if LIVES <= 0 and DEAD:
        screen.pen = PANEL
        screen.rectangle(20, 44, w - 40, 28)
        screen.pen = ORANGE
        screen.font = font.sins
        screen.text("UNIT DOWN", 36, 54)

    if ctrl.pressed("B") or ctrl.pressed("C") or ctrl.pressed("-"):
        try:
            State.modify("hexos_void", {"best": BEST})
        except Exception:
            pass
        from lib import hi
        hi()
        return "home"
    return None
