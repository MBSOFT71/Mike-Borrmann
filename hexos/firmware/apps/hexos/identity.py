import math
from lib import (
    ORANGE, ORANGE_DIM, BG, PANEL, WHITE, DIM, GREEN, MUTED, AMBER,
    panel, hint_bar, hexagon, text_w, caselight_chase, pulse,
)
import profile as P

PAGE = 0
ORBIT = []


def enter(_ctrl, _sensors):
    global PAGE, ORBIT
    PAGE = 0
    ORBIT = []
    for i in range(18):
        ORBIT.append([i / 18.0 * math.pi * 2, 28 + (i % 4) * 6, 0.8 + (i % 3) * 0.25])


def _sigil(cx, cy, size, seed):
    screen.pen = PANEL
    screen.rectangle(cx, cy, size, size)
    screen.pen = MUTED
    screen.rectangle(cx, cy, size, 1)
    screen.rectangle(cx, cy + size - 1, size, 1)
    cell = 5
    n = size // cell
    for y in range(n):
        for x in range(n):
            v = (x * 17 + y * 31 + seed + (x ^ y) * 13) & 7
            if v < 3:
                screen.pen = ORANGE if (x + y + seed) & 3 == 0 else WHITE
                screen.rectangle(cx + x * cell + 1, cy + y * cell + 1, cell - 1, cell - 1)


def _page_id(w, h):
    screen.font = font.ark
    screen.pen = ORANGE
    screen.text("OPERATOR ID", 14, 28)
    screen.pen = DIM
    screen.text(P.CALLSIGN, w - text_w(P.CALLSIGN) - 14, 28)

    cx, cy = 54, 108
    hexagon(cx, cy, 34, True)
    screen.pen = BG
    hexagon(cx, cy, 28, True)
    screen.pen = ORANGE
    hexagon(cx, cy, 22, True)
    screen.pen = BG
    hexagon(cx, cy, 16, True)
    t = badge.ticks / 400.0
    for a0, r, sp in ORBIT:
        a = a0 + t * sp
        px = int(cx + math.cos(a) * r)
        py = int(cy + math.sin(a) * r * 0.55)
        screen.pen = AMBER if int(a * 3) % 2 == 0 else WHITE
        screen.circle(px, py, 1)

    screen.font = font.absolute
    screen.pen = WHITE
    screen.text(P.NAME, 100, 52)
    screen.font = font.sins
    screen.pen = ORANGE
    screen.text(P.SURNAME, 100, 72)
    screen.pen = DIM
    screen.text(P.TITLE + "  //  " + P.LOCATION, 100, 92)
    screen.pen = GREEN
    screen.text("STATUS  " + P.STATUS, 100, 108)

    screen.pen = PANEL
    screen.rectangle(14, 148, w - 28, 36)
    screen.pen = ORANGE
    screen.rectangle(14, 148, 3, 36)
    screen.font = font.sins
    screen.pen = WHITE
    screen.text(P.TAGLINE, 24, 156)
    screen.pen = DIM
    screen.text(P.HANDLE, 24, 170)


def _page_skills(w, h):
    screen.font = font.ark
    screen.pen = ORANGE
    screen.text("LOADOUT", 14, 28)
    chips = list(P.SKILLS)
    x, y = 14, 52
    screen.font = font.sins
    for i, skill in enumerate(chips):
        tw = text_w(skill) + 16
        if x + tw > w - 14:
            x = 14
            y += 28
        screen.pen = PANEL
        screen.rectangle(x, y, tw, 22)
        screen.pen = ORANGE if i == (badge.ticks // 400) % max(1, len(chips)) else MUTED
        screen.rectangle(x, y, tw, 1)
        screen.rectangle(x, y + 21, tw, 1)
        screen.pen = WHITE
        screen.text(skill, x + 8, y + 7)
        x += tw + 8
    screen.pen = DIM
    screen.text("FIELD UNIT TUFTY 2350", 14, 150)
    screen.text("STEM LINK  QW/ST PAD + SENSOR", 14, 164)


def _page_link(w, h):
    screen.font = font.ark
    screen.pen = ORANGE
    screen.text("UPLINK", 14, 28)
    seed = 0
    for ch in P.URL:
        seed = (seed * 33 + ord(ch)) & 255
    _sigil(24, 48, 110, seed)
    screen.font = font.sins
    screen.pen = WHITE
    screen.text("SCAN / MIRROR", 148, 56)
    screen.pen = DIM
    # wrap url crudely
    url = P.URL.replace("https://", "")
    y = 76
    while url:
        chunk = url[:18]
        screen.text(chunk, 148, y)
        url = url[18:]
        y += 12
        if y > 160:
            break
    screen.pen = GREEN
    screen.text("CHANNEL OPEN", 148, 170)


def tick(ctrl, sensors):
    global PAGE
    caselight_chase(0.05)
    w, h = screen.width, screen.height
    screen.pen = BG
    screen.clear()
    panel(6, 22, w - 12, h - 40, fill=True)

    if PAGE == 0:
        _page_id(w, h)
    elif PAGE == 1:
        _page_skills(w, h)
    else:
        _page_link(w, h)

    # page pips
    for i in range(3):
        screen.pen = ORANGE if i == PAGE else MUTED
        hexagon(w // 2 - 16 + i * 16, h - 28, 4, True)

    hint_bar("C BACK", "A PAGE", "PAD OK" if ctrl.pad else "PAD --")

    if ctrl.pressed("A") or ctrl.pressed("R") or ctrl.pressed("+"):
        PAGE = (PAGE + 1) % 3
    if ctrl.pressed("L"):
        PAGE = (PAGE - 1) % 3
    if ctrl.pressed("B") or ctrl.pressed("C") or ctrl.pressed("-"):
        return "home"
    return None
