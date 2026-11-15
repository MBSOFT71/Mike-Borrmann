# HEXOS shared drawing, input, sensors. Badgeware injects screen/color/font/badge/shape.
import math

try:
    from machine import I2C
except ImportError:
    I2C = None

ORANGE = color.rgb(255, 107, 26)
ORANGE_DIM = color.rgb(168, 64, 12)
AMBER = color.rgb(255, 176, 64)
BG = color.rgb(10, 11, 13)
PANEL = color.rgb(26, 29, 33)
PANEL2 = color.rgb(36, 40, 46)
WHITE = color.rgb(236, 236, 238)
DIM = color.rgb(118, 122, 128)
MUTED = color.rgb(72, 76, 82)
GREEN = color.rgb(110, 220, 96)
RED = color.rgb(232, 64, 48)
CYAN = color.rgb(80, 210, 220)


def hi():
    badge.mode(HIRES | VSYNC)


def lo():
    badge.mode(LORES | VSYNC)


def hsv(h, s, v, a=255):
    return color.hsv(int(h) % 256, int(s), int(v), a)


def lerp(a, b, t):
    return a + (b - a) * t


def clamp(v, vmin, vmax):
    if v < vmin:
        return vmin
    if v > vmax:
        return vmax
    return v


def pulse(speed=0.004, lo=0.25, hi=1.0):
    return lo + (hi - lo) * (0.5 + 0.5 * math.sin(badge.ticks * speed))


def text_w(msg, size=1):
    try:
        return int(screen.measure_text(msg, size)[0])
    except TypeError:
        return int(screen.measure_text(msg)[0])


def text_cx(msg, y, size=1):
    screen.text(msg, (screen.width - text_w(msg, size)) // 2, y, size)


def hexagon(cx, cy, r, fill=True):
    pts = []
    for i in range(6):
        a = math.pi / 6 + i * math.pi / 3
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    if fill:
        for i in range(6):
            x1, y1 = pts[i]
            x2, y2 = pts[(i + 1) % 6]
            screen.triangle(cx, cy, int(x1), int(y1), int(x2), int(y2))
    else:
        for i in range(6):
            x1, y1 = pts[i]
            x2, y2 = pts[(i + 1) % 6]
            screen.line(int(x1), int(y1), int(x2), int(y2))


def corner_brackets(x, y, w, h, arm=10, inset=2):
    screen.pen = ORANGE
    x += inset
    y += inset
    w -= inset * 2
    h -= inset * 2
    screen.line(x, y, x + arm, y)
    screen.line(x, y, x, y + arm)
    screen.line(x + w, y, x + w - arm, y)
    screen.line(x + w, y, x + w, y + arm)
    screen.line(x, y + h, x + arm, y + h)
    screen.line(x, y + h, x, y + h - arm)
    screen.line(x + w, y + h, x + w - arm, y + h)
    screen.line(x + w, y + h, x + w, y + h - arm)


def panel(x, y, w, h, fill=True):
    if fill:
        screen.pen = PANEL
        screen.rectangle(x, y, w, h)
    screen.pen = MUTED
    screen.rectangle(x, y, w, 1)
    screen.rectangle(x, y + h - 1, w, 1)
    screen.rectangle(x, y, 1, h)
    screen.rectangle(x + w - 1, y, 1, h)
    corner_brackets(x, y, w, h, arm=8, inset=3)


def caution_bar(y, h=6):
    w = screen.width
    screen.pen = ORANGE_DIM
    screen.rectangle(0, y, w, h)
    screen.pen = BG
    stripe = 10
    shift = (badge.ticks // 40) % (stripe * 2)
    x = -stripe * 2 + shift
    while x < w:
        screen.triangle(x, y, x + stripe, y, x + stripe // 2, y + h)
        x += stripe * 2


def status_bar(title, extra=""):
    screen.pen = PANEL2
    screen.rectangle(0, 0, screen.width, 18)
    screen.pen = ORANGE
    screen.rectangle(0, 0, 4, 18)
    screen.font = font.sins
    screen.pen = ORANGE
    screen.text("HEXOS", 10, 5)
    screen.pen = WHITE
    screen.text(title, 52, 5)
    if extra:
        screen.pen = DIM
        tw = text_w(extra)
        screen.text(extra, screen.width - tw - 8, 5)
    screen.pen = ORANGE
    screen.rectangle(0, 18, screen.width, 1)


def hint_bar(left, mid, right):
    y = screen.height - 14
    screen.pen = PANEL2
    screen.rectangle(0, y, screen.width, 14)
    screen.pen = ORANGE
    screen.rectangle(0, y, screen.width, 1)
    screen.font = font.ark
    screen.pen = DIM
    screen.text(left, 6, y + 4)
    mw = text_w(mid)
    screen.text(mid, (screen.width - mw) // 2, y + 4)
    rw = text_w(right)
    screen.text(right, screen.width - rw - 6, y + 4)


def battery_pip(x, y):
    try:
        pct = int(badge.battery_level())
    except Exception:
        pct = 88
    screen.pen = GREEN if pct > 20 else RED
    screen.rectangle(x, y, 16, 8)
    screen.rectangle(x + 16, y + 2, 2, 4)
    screen.pen = BG
    fill = int(14 * clamp(pct, 0, 100) / 100)
    screen.rectangle(x + 1, y + 1, 14, 6)
    screen.pen = GREEN if pct > 20 else RED
    screen.rectangle(x + 1, y + 1, max(1, fill), 6)
    return pct


def caselight_chase(hue_speed=0.04):
    t = badge.ticks * hue_speed
    levels = []
    for i in range(4):
        levels.append(0.12 + 0.55 * (0.5 + 0.5 * math.sin(t + i * 0.9)))
    try:
        badge.caselights(*levels)
    except Exception:
        pass


def caselight_solid(level=0.35):
    try:
        badge.caselights(level)
    except Exception:
        pass


# --- Qw/ST Pad (TCA9555 @ 0x21) + badge buttons ---

_PAD_MAP = {
    "U": 0x1, "D": 0x4, "L": 0x2, "R": 0x3,
    "A": 0xE, "B": 0xC, "X": 0xF, "Y": 0xD,
    "+": 0xB, "-": 0x5,
}


class Controls:
    def __init__(self):
        self.held = {k: False for k in list(_PAD_MAP) + ["C"]}
        self.down = {k: False for k in self.held}
        self.prev = {k: False for k in self.held}
        self.pad = False
        self._i2c = None
        self._addr = 0x21
        if I2C is not None:
            try:
                self._i2c = I2C()
                self._i2c.readfrom_mem(self._addr, 0x00, 2)
                self.pad = True
            except Exception:
                self._i2c = None
                self.pad = False

    def _read_pad(self):
        if not self._i2c:
            return
        try:
            data = self._i2c.readfrom_mem(self._addr, 0x00, 2)
            bits = data[0] | (data[1] << 8)
            for name, bit in _PAD_MAP.items():
                self.held[name] = not ((bits >> bit) & 1)
        except Exception:
            self.pad = False
            self._i2c = None

    def poll(self):
        for k in self.held:
            self.prev[k] = self.held[k]
            if k != "C":
                self.held[k] = False
            else:
                self.held["C"] = False
        self._read_pad()
        # Badge front buttons as fallback / extra
        try:
            if badge.held(BUTTON_UP):
                self.held["U"] = True
            if badge.held(BUTTON_DOWN):
                self.held["D"] = True
            if badge.held(BUTTON_A):
                self.held["A"] = True
            if badge.held(BUTTON_B):
                self.held["B"] = True
            if badge.held(BUTTON_C):
                self.held["C"] = True
                self.held["-"] = True
        except Exception:
            pass
        for k in self.held:
            self.down[k] = self.held[k] and not self.prev[k]

    def pressed(self, name):
        return self.down.get(name, False)

    def is_held(self, name):
        return self.held.get(name, False)


# --- Multi-Sensor Stick (optional) ---

class Sensors:
    def __init__(self):
        self.ok = False
        self.temp = 22.4
        self.press = 1013
        self.humid = 48.0
        self.lux = 120
        self.prox = 0
        self.ax = 0.0
        self.ay = 0.0
        self.az = 1.0
        self.gx = 0.0
        self.gy = 0.0
        self.gz = 0.0
        self._bme = None
        self._ltr = None
        self._imu = None
        self._last = 0
        if I2C is None:
            return
        try:
            from breakout_bme280 import BreakoutBME280
            from breakout_ltr559 import BreakoutLTR559
            from lsm6ds3 import LSM6DS3, NORMAL_MODE_104HZ
            bus = I2C()
            self._bme = BreakoutBME280(bus)
            self._ltr = BreakoutLTR559(bus)
            self._imu = LSM6DS3(bus, mode=NORMAL_MODE_104HZ)
            self.ok = True
        except Exception:
            self.ok = False

    def update(self, force=False):
        now = badge.ticks
        if not force and now - self._last < 80:
            return
        self._last = now
        if not self.ok:
            t = now / 1000.0
            self.temp = 22.0 + 1.4 * math.sin(t * 0.3)
            self.humid = 46 + 6 * math.sin(t * 0.21)
            self.press = 1012 + 3 * math.sin(t * 0.12)
            self.lux = 80 + 60 * (0.5 + 0.5 * math.sin(t * 0.7))
            self.ax = 0.15 * math.sin(t * 1.4)
            self.ay = 0.12 * math.cos(t * 1.1)
            self.az = 0.98
            return
        try:
            reading = self._bme.read()
            self.temp = round(reading[0], 1)
            self.press = round(reading[1] / 100)
            self.humid = round(reading[2], 1)
        except Exception:
            pass
        try:
            pack = self._ltr.get_reading()
            if pack is not None:
                if isinstance(pack, dict) or hasattr(pack, "__getitem__"):
                    try:
                        from breakout_ltr559 import BreakoutLTR559
                        self.lux = pack[BreakoutLTR559.LUX]
                        self.prox = pack[BreakoutLTR559.PROXIMITY]
                    except Exception:
                        self.lux = pack[-1] if len(pack) > 1 else 0
        except Exception:
            pass
        try:
            ax, ay, az, gx, gy, gz = self._imu.get_readings()
            self.ax = ax / 16384.0
            self.ay = ay / 16384.0
            self.az = az / 16384.0
            self.gx, self.gy, self.gz = gx, gy, gz
        except Exception:
            pass
        try:
            onboard = badge.light_level()
            if not self.ok:
                self.lux = onboard / 256
        except Exception:
            pass
