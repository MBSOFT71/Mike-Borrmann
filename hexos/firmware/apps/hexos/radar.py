import math
from lib import (
    ORANGE, ORANGE_DIM, BG, PANEL, WHITE, DIM, GREEN, MUTED, RED,
    panel, hint_bar, caselight_chase, text_w, clamp,
)

NETS = []
SCANNING = False
MSG = "PRESS A TO SWEEP"
ANGLE = 0.0


def enter(_ctrl, _sensors):
    global NETS, SCANNING, MSG, ANGLE
    NETS = [
        ("RIDGE-NET", -42),
        ("FIELD-AP", -61),
        ("GUEST", -78),
        ("MESH-04", -55),
    ]
    SCANNING = False
    MSG = "PRESS A TO SWEEP"
    ANGLE = 0.0


def _try_scan():
    global NETS, MSG
    try:
        import network
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        found = wlan.scan()
        nets = []
        for row in found[:8]:
            ssid = row[0]
            if isinstance(ssid, bytes):
                ssid = ssid.decode("utf-8", "ignore")
            rssi = row[3] if len(row) > 3 else -70
            if ssid:
                nets.append((ssid[:14], int(rssi)))
        if nets:
            NETS = nets
            MSG = str(len(nets)) + " CONTACTS"
        else:
            MSG = "NO CONTACTS"
    except Exception:
        MSG = "RADIO LOCKED // DEMO"


def tick(ctrl, sensors):
    global ANGLE, SCANNING, MSG
    caselight_chase(0.07)
    w, h = screen.width, screen.height
    screen.pen = BG
    screen.clear()
    panel(6, 22, w - 12, h - 40)

    screen.font = font.ark
    screen.pen = ORANGE
    screen.text("RADIO SWEEP", 14, 28)
    screen.pen = DIM
    screen.text(MSG, 14, 40)

    cx, cy, rad = 74, 128, 58
    ANGLE += 0.07
    screen.pen = MUTED
    for r in (18, 34, 50, 58):
        # ring via many short lines
        for i in range(24):
            a0 = i / 24 * math.pi * 2
            a1 = (i + 1) / 24 * math.pi * 2
            screen.line(
                int(cx + math.cos(a0) * r), int(cy + math.sin(a0) * r),
                int(cx + math.cos(a1) * r), int(cy + math.sin(a1) * r),
            )
    screen.line(cx - rad, cy, cx + rad, cy)
    screen.line(cx, cy - rad, cx, cy + rad)
    x2 = int(cx + math.cos(ANGLE) * rad)
    y2 = int(cy + math.sin(ANGLE) * rad)
    screen.pen = ORANGE
    screen.line(cx, cy, x2, y2)
    screen.pen = ORANGE_DIM
    screen.circle(cx, cy, 3)

    for i, (ssid, rssi) in enumerate(NETS):
        a = i / max(1, len(NETS)) * math.pi * 2 + 0.4
        dist = 20 + min(50, (-rssi - 20) * 0.9)
        px = int(cx + math.cos(a) * dist)
        py = int(cy + math.sin(a) * dist)
        screen.pen = GREEN if rssi > -60 else (ORANGE if rssi > -75 else RED)
        screen.circle(px, py, 2)

    # list
    screen.font = font.sins
    y = 56
    for i, (ssid, rssi) in enumerate(NETS[:6]):
        screen.pen = PANEL
        screen.rectangle(148, y, 156, 18)
        bar = int(clamp((rssi + 90) / 60.0, 0, 1) * 50)
        screen.pen = GREEN if rssi > -60 else ORANGE
        screen.rectangle(250, y + 5, bar, 8)
        screen.pen = WHITE
        screen.text(ssid[:12], 154, y + 4)
        y += 22

    hint_bar("C BACK", "A SWEEP", "WIFI")

    if ctrl.pressed("A") or ctrl.pressed("X") or ctrl.pressed("+"):
        MSG = "SWEEPING..."
        _try_scan()
    if ctrl.pressed("B") or ctrl.pressed("C") or ctrl.pressed("-"):
        return "home"
    return None
