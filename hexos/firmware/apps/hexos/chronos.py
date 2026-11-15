import math
import time
from lib import (
    ORANGE, ORANGE_DIM, BG, PANEL, WHITE, DIM, GREEN, MUTED,
    panel, hint_bar, caselight_chase, text_w, battery_pip,
)

DAYS = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"]
MONTHS = ["JAN", "FEB", "MAR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"]


def enter(_ctrl, _sensors):
    pass


def _hand(cx, cy, ang, length, thick_color, end_r=0):
    x = int(cx + math.sin(ang) * length)
    y = int(cy - math.cos(ang) * length)
    screen.pen = thick_color
    screen.line(cx, cy, x, y)
    if end_r:
        screen.circle(x, y, end_r)


def tick(ctrl, sensors):
    caselight_chase(0.02)
    sensors.update()
    w, h = screen.width, screen.height
    screen.pen = BG
    screen.clear()
    panel(6, 22, w - 12, h - 40)

    tm = time.localtime()
    hh, mm, ss = tm[3], tm[4], tm[5]
    yyyy, mo, dd, wd = tm[0], tm[1], tm[2], tm[6]

    cx, cy, r = 86, 122, 64
    screen.pen = PANEL
    screen.circle(cx, cy, r + 4)
    screen.pen = BG
    screen.circle(cx, cy, r)
    for i in range(12):
        a = i / 12 * math.pi * 2
        x0 = int(cx + math.sin(a) * (r - 2))
        y0 = int(cy - math.cos(a) * (r - 2))
        x1 = int(cx + math.sin(a) * (r - 10 if i % 3 == 0 else r - 6))
        y1 = int(cy - math.cos(a) * (r - 10 if i % 3 == 0 else r - 6))
        screen.pen = ORANGE if i % 3 == 0 else MUTED
        screen.line(x0, y0, x1, y1)

    hour_a = ((hh % 12) + mm / 60) / 12 * math.pi * 2
    min_a = (mm + ss / 60) / 60 * math.pi * 2
    sec_a = ss / 60 * math.pi * 2
    _hand(cx, cy, hour_a, 32, WHITE)
    _hand(cx, cy, min_a, 46, ORANGE)
    _hand(cx, cy, sec_a, 52, ORANGE_DIM, 2)
    screen.pen = WHITE
    screen.circle(cx, cy, 3)

    screen.font = font.absolute
    clock = "{:02d}:{:02d}".format(hh, mm)
    screen.pen = WHITE
    screen.text(clock, 170, 70)
    screen.font = font.sins
    screen.pen = ORANGE
    screen.text("{:02d}".format(ss), 170 + text_w(clock, 1) + 8, 78)

    screen.pen = DIM
    date = "{} {:02d} {} {}".format(DAYS[wd % 7], dd, MONTHS[(mo - 1) % 12], yyyy)
    screen.text(date, 170, 108)
    screen.pen = GREEN
    screen.text("{:.1f}C  {}% RH".format(sensors.temp, int(sensors.humid)), 170, 128)

    pct = battery_pip(170, 152)
    screen.font = font.ark
    screen.pen = DIM
    screen.text(str(pct) + "%  CELL", 192, 152)

    hint_bar("C BACK", "RTC", "HEXOS")
    if ctrl.pressed("B") or ctrl.pressed("C") or ctrl.pressed("-"):
        return "home"
    return None
