(() => {
  const W = 320, H = 240;
  const canvas = document.getElementById("lcd");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const C = {
    orange: "#ff6b1a",
    orangeD: "#a8430c",
    amber: "#ffb040",
    bg: "#0a0b0d",
    panel: "#1a1d21",
    panel2: "#24282e",
    white: "#ececee",
    dim: "#767a80",
    muted: "#484c52",
    green: "#6edc60",
    red: "#e84030",
    cyan: "#50d2dc",
  };

  const profile = {
    NAME: "MIKE",
    SURNAME: "BORRMANN",
    CALLSIGN: "RIDGE-01",
    TITLE: "OPERATOR",
    HANDLE: "mike.b",
    TAGLINE: "BUILD / BREAK / REPEAT",
    STATUS: "ONLINE",
    LOCATION: "DE",
    URL: "github.com/Mike-Borrmann",
    SKILLS: ["HARDWARE", "CODE", "FIELD"],
  };

  const keys = Object.create(null);
  const down = Object.create(null);
  const sensors = { temp: 22.4, humid: 48, ax: 0, ay: 0, lux: 120, press: 1013, prox: 0, ok: false };

  let scene = "boot";
  let selected = 0;
  let bootT = 0;
  let ticks = 0;
  let page = 0;
  let fieldMode = 0;
  let idOrbit = Array.from({ length: 18 }, (_, i) => [i / 18 * Math.PI * 2, 28 + (i % 4) * 6, 0.8 + (i % 3) * 0.25]);

  const game = {
    x: 160, y: 200, vx: 0, bullets: [], rocks: [], parts: [],
    score: 0, lives: 3, dead: 0, spawn: 0, best: Number(localStorage.getItem("hexos_best") || 0),
  };
  const histT = Array(48).fill(22);
  const nets = [
    ["RIDGE-NET", -42], ["FIELD-AP", -61], ["GUEST", -78], ["MESH-04", -55],
  ];
  let sweep = 0;
  let radioMsg = "PRESS A TO SWEEP";

  const APPS = [
    ["ID", "OPERATOR"],
    ["PULSE", "SENSORS"],
    ["VOID", "RUNNER"],
    ["FIELD", "VISUAL"],
    ["RADIO", "SWEEP"],
    ["TIME", "CHRONOS"],
  ];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function hsv(h, s, v) {
    s /= 255; v /= 255;
    const hh = ((h % 360) + 360) % 360 / 60;
    const i = Math.floor(hh), f = hh - i;
    const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    const rgb = [
      [v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q],
    ][i % 6];
    return `rgb(${(rgb[0] * 255) | 0},${(rgb[1] * 255) | 0},${(rgb[2] * 255) | 0})`;
  }

  function fill(c) { ctx.fillStyle = c; }
  function rect(x, y, w, h) { ctx.fillRect(x | 0, y | 0, w | 0, h | 0); }
  function circle(x, y, r) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  function line(x0, y0, x1, y1) {
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  }
  function tri(x0, y0, x1, y1, x2, y2) {
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.closePath(); ctx.fill();
  }
  function hexagon(cx, cy, r, strokeOnly) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + i * Math.PI / 3;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    strokeOnly ? ctx.stroke() : ctx.fill();
  }
  function font(px) { ctx.font = `${px}px ui-monospace, "Cascadia Mono", Menlo, monospace`; }
  function text(s, x, y) { ctx.fillText(s, x, y); }
  function textW(s) { return ctx.measureText(s).width; }
  function textCx(s, y) { text(s, (W - textW(s)) / 2, y); }
  function corners(x, y, w, h, arm = 10) {
    ctx.strokeStyle = C.orange; ctx.lineWidth = 1;
    line(x, y, x + arm, y); line(x, y, x, y + arm);
    line(x + w, y, x + w - arm, y); line(x + w, y, x + w, y + arm);
    line(x, y + h, x + arm, y + h); line(x, y + h, x, y + h - arm);
    line(x + w, y + h, x + w - arm, y + h); line(x + w, y + h, x + w, y + h - arm);
  }
  function panel(x, y, w, h) {
    fill(C.panel); rect(x, y, w, h);
    ctx.strokeStyle = C.muted; ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    corners(x + 3, y + 3, w - 6, h - 6, 8);
  }
  function hint(l, m, r) {
    fill(C.panel2); rect(0, H - 14, W, 14);
    fill(C.orange); rect(0, H - 14, W, 1);
    font(9); fill(C.dim);
    ctx.textBaseline = "top";
    text(l, 6, H - 11);
    text(m, (W - textW(m)) / 2, H - 11);
    text(r, W - textW(r) - 6, H - 11);
  }
  function status(title, extra) {
    fill(C.panel2); rect(0, 0, W, 18);
    fill(C.orange); rect(0, 0, 4, 18);
    ctx.textBaseline = "top";
    font(10);
    fill(C.orange); text("HEXOS", 10, 5);
    fill(C.white); text(title, 54, 5);
    if (extra) { fill(C.dim); text(extra, W - textW(extra) - 8, 5); }
    fill(C.orange); rect(0, 18, W, 1);
  }
  function pressed(k) { return !!down[k]; }
  function held(k) { return !!keys[k]; }

  function mapKey(e) {
    const k = e.key;
    if (k === "ArrowUp") return "U";
    if (k === "ArrowDown") return "D";
    if (k === "ArrowLeft") return "L";
    if (k === "ArrowRight") return "R";
    if (k === "Enter" || k === " ") return "A";
    if (k === "Escape" || k === "Backspace") return "-";
    if (k === "+" || k === "=") return "+";
    const u = k.toUpperCase();
    if ("ABXY+-".includes(u) || u === "S") return u === "S" ? "B" : u;
    return null;
  }

  function bindPad() {
    document.querySelectorAll("[data-key]").forEach((el) => {
      const k = el.getAttribute("data-key");
      const on = () => { keys[k] = true; down[k] = true; el.classList.add("hot"); };
      const off = () => { keys[k] = false; el.classList.remove("hot"); };
      el.addEventListener("pointerdown", (ev) => { ev.preventDefault(); on(); });
      el.addEventListener("pointerup", off);
      el.addEventListener("pointerleave", off);
    });
    window.addEventListener("keydown", (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = mapKey(e);
      if (!k) return;
      if (!keys[k]) down[k] = true;
      keys[k] = true;
      const btn = document.querySelector(`[data-key="${CSS.escape(k)}"]`);
      if (btn) btn.classList.add("hot");
      e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
      const k = mapKey(e);
      if (!k) return;
      keys[k] = false;
      const btn = document.querySelector(`[data-key="${CSS.escape(k)}"]`);
      if (btn) btn.classList.remove("hot");
    });
  }

  function wireForm() {
    const set = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.type === "range") {
        el.addEventListener("input", () => { sensors[key] = Number(el.value); sensors.ok = true; });
      } else {
        el.value = profile[key] || el.value;
        el.addEventListener("input", () => { profile[key] = el.value.toUpperCase(); });
      }
    };
    ["name", "surname", "callsign", "title"].forEach((id) => {
      const el = document.getElementById(id);
      el.value = profile[id.toUpperCase()] || profile[id] || "";
      if (id === "name") el.value = profile.NAME;
      if (id === "surname") el.value = profile.SURNAME;
      if (id === "callsign") el.value = profile.CALLSIGN;
      if (id === "title") el.value = profile.TITLE;
      el.addEventListener("input", () => {
        const map = { name: "NAME", surname: "SURNAME", callsign: "CALLSIGN", title: "TITLE" };
        profile[map[id]] = el.value.toUpperCase();
      });
    });
    set("temp", "temp"); set("humid", "humid"); set("ax", "ax"); set("ay", "ay"); set("lux", "lux");
  }

  function drawBoot() {
    fill(C.bg); rect(0, 0, W, H);
    const t = clamp(bootT / 2200, 0, 1);
    const span = 40 + t * 80;
    ctx.strokeStyle = C.orange; ctx.lineWidth = 2;
    const x0 = W / 2 - span, y0 = H / 2 - 50, x1 = W / 2 + span, y1 = H / 2 + 40, arm = 18;
    line(x0, y0, x0 + arm, y0); line(x0, y0, x0, y0 + arm);
    line(x1, y0, x1 - arm, y0); line(x1, y0, x1, y0 + arm);
    line(x0, y1, x0 + arm, y1); line(x0, y1, x0, y1 - arm);
    line(x1, y1, x1 - arm, y1); line(x1, y1, x1, y1 - arm);
    ctx.textBaseline = "top";
    font(28); fill(t > 0.25 ? C.orange : C.muted); textCx("HEXOS", H / 2 - 32);
    font(11); fill(t > 0.45 ? C.white : C.muted); textCx("TUFTY 2350  //  RIDGE UNIT", H / 2 + 6);
    fill(C.dim); rect(40, H / 2 + 32, W - 80, 6);
    fill(C.orange); rect(40, H / 2 + 32, (W - 80) * t, 6);
    font(10); fill(t > 0.85 ? C.green : C.dim);
    textCx(t > 0.85 ? "SYSTEM ONLINE" : "IGNITION", H / 2 + 46);
  }

  function drawHome() {
    fill(C.bg); rect(0, 0, W, H);
    status("HOME", profile.CALLSIGN);
    fill(C.orangeD); rect(0, 19, W, 5);
    const shift = (ticks / 50) % 16;
    fill(C.bg);
    for (let x = -16 + shift; x < W; x += 16) tri(x, 19, x + 8, 19, x + 4, 24);
    ctx.textBaseline = "top";
    font(12); fill(C.white); text(profile.NAME + " " + profile.SURNAME, 12, 32);
    font(10); fill(C.dim); text(profile.TITLE + "  /  PAD LINK", 12, 48);
    const coords = [[56, 96], [160, 96], [264, 96], [56, 168], [160, 168], [264, 168]];
    APPS.forEach((app, i) => {
      const [cx, cy] = coords[i];
      const on = i === selected;
      fill(on ? C.orange : C.panel2);
      hexagon(cx, cy, on ? 36 : 32);
      fill(on ? C.bg : C.panel);
      hexagon(cx, cy, on ? 31 : 27);
      if (on) { ctx.strokeStyle = C.orange; ctx.lineWidth = 1; hexagon(cx, cy, 31, true); }
      font(11); fill(on ? C.white : C.dim);
      ctx.textAlign = "center";
      text(app[0], cx, cy - 8);
      font(9); fill(on ? C.orange : C.muted);
      text(app[1], cx, cy + 8);
      ctx.textAlign = "left";
    });
    hint("U/D SEL", "A OPEN", "PAD OK");
  }

  function sigil(cx, cy, size, seed) {
    fill(C.panel); rect(cx, cy, size, size);
    const cell = 5, n = Math.floor(size / cell);
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const v = (x * 17 + y * 31 + seed + (x ^ y) * 13) & 7;
        if (v < 3) {
          fill(((x + y + seed) & 3) === 0 ? C.orange : C.white);
          rect(cx + x * cell + 1, cy + y * cell + 1, cell - 1, cell - 1);
        }
      }
    }
  }

  function drawId() {
    fill(C.bg); rect(0, 0, W, H);
    panel(6, 22, W - 12, H - 40);
    ctx.textBaseline = "top";
    font(10); fill(C.orange); text(page === 0 ? "OPERATOR ID" : page === 1 ? "LOADOUT" : "UPLINK", 14, 28);
    if (page === 0) {
      fill(C.dim); text(profile.CALLSIGN, W - textW(profile.CALLSIGN) - 14, 28);
      const cx = 54, cy = 108;
      fill(C.orange); hexagon(cx, cy, 34);
      fill(C.bg); hexagon(cx, cy, 28);
      fill(C.orange); hexagon(cx, cy, 22);
      fill(C.bg); hexagon(cx, cy, 16);
      const t = ticks / 400;
      idOrbit.forEach(([a0, r, sp]) => {
        const a = a0 + t * sp;
        fill(C.amber); circle(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.55, 1.4);
      });
      font(18); fill(C.white); text(profile.NAME, 100, 52);
      font(12); fill(C.orange); text(profile.SURNAME, 100, 74);
      font(10); fill(C.dim); text(profile.TITLE + "  //  " + profile.LOCATION, 100, 94);
      fill(C.green); text("STATUS  " + profile.STATUS, 100, 110);
      fill(C.panel); rect(14, 148, W - 28, 36);
      fill(C.orange); rect(14, 148, 3, 36);
      font(11); fill(C.white); text(profile.TAGLINE, 24, 156);
      fill(C.dim); text(profile.HANDLE, 24, 172);
    } else if (page === 1) {
      let x = 14, y = 52;
      font(11);
      profile.SKILLS.forEach((skill, i) => {
        const tw = textW(skill) + 16;
        fill(C.panel); rect(x, y, tw, 22);
        fill(i === Math.floor(ticks / 400) % profile.SKILLS.length ? C.orange : C.muted);
        rect(x, y, tw, 1);
        fill(C.white); text(skill, x + 8, y + 6);
        x += tw + 8;
      });
      font(10); fill(C.dim);
      text("FIELD UNIT TUFTY 2350", 14, 150);
      text("STEM LINK  QW/ST PAD + SENSOR", 14, 166);
    } else {
      let seed = 0;
      for (const ch of profile.URL) seed = (seed * 33 + ch.charCodeAt(0)) & 255;
      sigil(24, 48, 110, seed);
      font(11); fill(C.white); text("SCAN / MIRROR", 148, 56);
      fill(C.dim); text(profile.URL.slice(0, 18), 148, 76);
      fill(C.green); text("CHANNEL OPEN", 148, 170);
    }
    for (let i = 0; i < 3; i++) {
      fill(i === page ? C.orange : C.muted);
      hexagon(W / 2 - 16 + i * 16, H - 28, 4);
    }
    hint("C BACK", "A PAGE", "PAD OK");
  }

  function drawPulse() {
    fill(C.bg); rect(0, 0, W, H);
    panel(6, 22, W - 12, H - 40);
    ctx.textBaseline = "top";
    font(10); fill(C.orange); text("FIELD SENSORS", 14, 28);
    fill(sensors.ok ? C.green : C.dim); text(sensors.ok ? "STEM LINK" : "LIVE SLIDERS", W - 100, 28);
    const gauge = (cx, cy, r, value, vmin, vmax, label, unit, col) => {
      fill(C.panel); circle(cx, cy, r);
      fill(C.bg); circle(cx, cy, r - 2);
      const t = clamp((value - vmin) / (vmax - vmin), 0, 1);
      ctx.lineWidth = 3;
      for (let i = 0; i < 18; i++) {
        const a0 = Math.PI * 0.75 + Math.PI * 1.5 * (i / 18);
        const a1 = Math.PI * 0.75 + Math.PI * 1.5 * ((i + 1) / 18);
        ctx.strokeStyle = i / 18 <= t ? col : C.muted;
        line(cx + Math.cos(a0) * (r - 5), cy + Math.sin(a0) * (r - 5),
             cx + Math.cos(a1) * (r - 5), cy + Math.sin(a1) * (r - 5));
      }
      font(12); fill(C.white); ctx.textAlign = "center";
      text(String(Math.round(value * 10) / 10), cx, cy - 8);
      font(9); fill(C.dim); text(label, cx, cy + 10);
      fill(col); text(unit, cx, cy + 22);
      ctx.textAlign = "left";
    };
    gauge(64, 100, 42, sensors.temp, 10, 40, "TEMP", "C", C.orange);
    gauge(160, 100, 42, sensors.humid, 0, 100, "RH", "%", C.cyan);
    gauge(256, 100, 42, sensors.press, 980, 1040, "hPa", "", C.green);
    const hx = 14, hy = 152, hw = 90, hh = 48;
    fill(C.panel); rect(hx, hy, hw, hh);
    const mid = hy + hh / 2 + clamp(sensors.ay, -1, 1) * 14;
    fill(C.orangeD); rect(hx, mid, hw, hy + hh - mid);
    ctx.strokeStyle = C.amber; line(hx, mid, hx + hw, mid);
    font(9); fill(C.white); text("HORIZON", hx + 4, hy + 4);
    fill(C.dim); text("X" + sensors.ax.toFixed(2), hx + 4, hy + 16);
    fill(C.panel); rect(114, 152, 90, 48);
    if (ticks % 8 === 0) {
      histT.push(sensors.temp);
      if (histT.length > 48) histT.shift();
    }
    ctx.strokeStyle = C.orange; ctx.beginPath();
    histT.forEach((v, i) => {
      const px = 116 + i * (86 / 47);
      const py = 198 - clamp((v - 16) / 14, 0, 1) * 40;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    });
    ctx.stroke();
    fill(C.panel); rect(214, 152, 92, 48);
    fill(C.amber); rect(220, 184, clamp(sensors.lux / 400, 0, 1) * 80, 8);
    font(9); fill(C.dim); text("LUX " + Math.round(sensors.lux), 220, 156);
    hint("- BACK", "TILT UNIT", "LIVE");
  }

  function resetGame() {
    game.x = 160; game.y = 200; game.vx = 0;
    game.bullets = []; game.rocks = []; game.parts = [];
    game.score = 0; game.lives = 3; game.dead = 0; game.spawn = 0;
  }
  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      game.parts.push([x, y, Math.cos(a) * 2.2, Math.sin(a) * 2.2, 14]);
    }
  }

  function drawVoid() {
    if (!game.dead) {
      let ax = 0;
      if (held("L")) ax -= 0.35;
      if (held("R")) ax += 0.35;
      ax += sensors.ax * 0.55;
      game.vx = clamp(game.vx + ax, -3.2, 3.2) * 0.92;
      game.x = clamp(game.x + game.vx, 8, W - 8);
      if (held("U")) game.y = clamp(game.y - 1.8, 24, H - 20);
      if (held("D")) game.y = clamp(game.y + 1.8, 24, H - 20);
      if (pressed("A") || pressed("X")) game.bullets.push([game.x, game.y - 6, -3.6]);
      game.spawn++;
      if (game.spawn > Math.max(8, 28 - game.score / 40)) {
        game.spawn = 0;
        game.rocks.push([8 + (ticks * 13) % (W - 16), -8, 0.7 + (game.score % 7) * 0.05, 4 + ticks % 5]);
      }
      game.bullets.forEach((b) => { b[1] += b[2]; });
      game.rocks.forEach((r) => { r[1] += r[2] * (1.5 + game.score * 0.002); });
      game.bullets = game.bullets.filter((b) => b[1] > -6);
      game.rocks = game.rocks.filter((r) => r[1] < H + 10);
      for (const b of game.bullets.slice()) {
        for (const r of game.rocks.slice()) {
          if (Math.abs(b[0] - r[0]) < r[3] + 2 && Math.abs(b[1] - r[1]) < r[3] + 2) {
            game.bullets.splice(game.bullets.indexOf(b), 1);
            game.rocks.splice(game.rocks.indexOf(r), 1);
            burst(r[0], r[1], 8);
            game.score += 10;
            if (game.score > game.best) {
              game.best = game.score;
              localStorage.setItem("hexos_best", String(game.best));
            }
            break;
          }
        }
      }
      for (const r of game.rocks) {
        if (Math.abs(r[0] - game.x) < r[3] + 5 && Math.abs(r[1] - game.y) < r[3] + 5) {
          game.lives--; game.dead = 40; burst(game.x, game.y, 16); break;
        }
      }
    } else {
      game.dead--;
      if (game.dead === 0 && game.lives <= 0) { scene = "home"; resetGame(); }
      if (game.dead === 0 && game.lives > 0) { game.x = 160; game.vx = 0; game.rocks = []; game.bullets = []; }
    }
    game.parts.forEach((p) => { p[0] += p[2]; p[1] += p[3]; p[4]--; });
    game.parts = game.parts.filter((p) => p[4] > 0);

    fill(C.bg); rect(0, 0, W, H);
    for (let i = 0; i < 24; i++) {
      fill(i % 3 ? C.muted : C.dim);
      rect((i * 53 + ticks / 2) % W, (i * 29 + ticks) % H, 1, 1);
    }
    game.rocks.forEach((r) => {
      fill(r[3] > 6 ? C.orange : C.amber); circle(r[0], r[1], r[3]);
      fill(C.bg); circle(r[0] - 1, r[1] - 1, Math.max(1, r[3] - 3));
    });
    fill(C.white);
    game.bullets.forEach((b) => rect(b[0] - 1, b[1] - 4, 2, 6));
    fill(game.dead ? C.red : C.green);
    tri(game.x, game.y - 7, game.x - 6, game.y + 5, game.x + 6, game.y + 5);
    fill(C.orange); tri(game.x, game.y - 2, game.x - 3, game.y + 5, game.x + 3, game.y + 5);
    game.parts.forEach((p) => { fill(p[4] > 6 ? C.orange : C.amber); circle(p[0], p[1], 1.4); });
    ctx.textBaseline = "top"; font(10); fill(C.white); text("SCR " + game.score, 4, 4);
    fill(C.dim); text("BEST " + game.best, 4, 16);
    fill(C.orange); text("HP " + "I".repeat(Math.max(0, game.lives)), W - 50, 4);
    if (game.lives <= 0 && game.dead) {
      fill(C.panel); rect(60, 100, 200, 32);
      fill(C.orange); font(14); text("UNIT DOWN", 110, 108);
    }
  }

  function drawField() {
    fill(C.bg); rect(0, 0, W, H);
    const t = ticks;
    const modes = ["WARP", "RIBBON", "SWEEP", "EMBER"];
    if (fieldMode === 0) {
      const cx = W / 2 + sensors.ax * 18, cy = H / 2 + sensors.ay * 14;
      for (let i = 0; i < 14; i++) {
        const z = (t * 0.08 + i * 9) % 90 + 8;
        fill(hsv(18 + i * 8, 220, 40 + z * 2));
        circle(cx, cy, 8 + z * 1.6);
        fill(C.bg); circle(cx, cy, 6 + z * 1.6);
      }
      fill(C.orange); circle(cx, cy, 3);
    } else if (fieldMode === 1) {
      for (let band = 0; band < 4; band++) {
        ctx.strokeStyle = hsv(18 + band * 12, 230, 200 - band * 20);
        ctx.lineWidth = 2; ctx.beginPath();
        const amp = 16 + band * 4 + sensors.lux * 0.02;
        const yb = 40 + band * 36;
        for (let x = 0; x < W; x += 4) {
          const y = yb + Math.sin(x * 0.08 + t * 0.03 + band) * amp;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    } else if (fieldMode === 2) {
      const cx = W / 2, cy = H / 2 + 4;
      ctx.strokeStyle = C.muted; ctx.lineWidth = 1;
      [28, 52, 76, 96].forEach((r) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); });
      const ang = t * 0.05;
      ctx.strokeStyle = C.orange; ctx.lineWidth = 2;
      line(cx, cy, cx + Math.cos(ang) * 96, cy + Math.sin(ang) * 96);
      for (let i = 0; i < 18; i++) {
        fill((Math.floor(t / 80) + i) % 7 === 0 ? C.green : C.dim);
        circle((i * 47) % W, (i * 31) % H, i % 4 ? 1 : 2);
      }
    } else {
      for (let i = 0; i < 40; i++) {
        const x = (i * 23) % W;
        const y = (H - ((t * (1 + i % 4) + i * 20) % (H + 20)));
        fill(hsv(18, 230, 140 + (i % 4) * 20));
        rect(x, y, 2, 8);
      }
    }
    ctx.textBaseline = "top"; font(11); fill(C.orange); text(modes[fieldMode], 8, 8);
    fill(C.dim); text("A MODE", 8, 22);
  }

  function drawRadar() {
    fill(C.bg); rect(0, 0, W, H);
    panel(6, 22, W - 12, H - 40);
    ctx.textBaseline = "top";
    font(10); fill(C.orange); text("RADIO SWEEP", 14, 28);
    fill(C.dim); text(radioMsg, 14, 42);
    const cx = 74, cy = 128, rad = 58;
    sweep += 0.07;
    ctx.strokeStyle = C.muted; ctx.lineWidth = 1;
    [18, 34, 50, 58].forEach((r) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); });
    line(cx - rad, cy, cx + rad, cy); line(cx, cy - rad, cx, cy + rad);
    ctx.strokeStyle = C.orange; ctx.lineWidth = 2;
    line(cx, cy, cx + Math.cos(sweep) * rad, cy + Math.sin(sweep) * rad);
    fill(C.orangeD); circle(cx, cy, 3);
    nets.forEach((n, i) => {
      const a = i / nets.length * Math.PI * 2 + 0.4;
      const dist = 20 + Math.min(50, (-n[1] - 20) * 0.9);
      fill(n[1] > -60 ? C.green : n[1] > -75 ? C.orange : C.red);
      circle(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, 2);
    });
    font(10);
    nets.slice(0, 6).forEach((n, i) => {
      const y = 56 + i * 22;
      fill(C.panel); rect(148, y, 156, 18);
      fill(n[1] > -60 ? C.green : C.orange);
      rect(250, y + 5, clamp((n[1] + 90) / 60, 0, 1) * 50, 8);
      fill(C.white); text(n[0], 154, y + 4);
    });
    hint("- BACK", "A SWEEP", "WIFI");
  }

  function drawChronos() {
    fill(C.bg); rect(0, 0, W, H);
    panel(6, 22, W - 12, H - 40);
    const now = new Date();
    const hh = now.getHours(), mm = now.getMinutes(), ss = now.getSeconds();
    const cx = 86, cy = 122, r = 64;
    fill(C.panel); circle(cx, cy, r + 4);
    fill(C.bg); circle(cx, cy, r);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      ctx.strokeStyle = i % 3 === 0 ? C.orange : C.muted;
      line(cx + Math.sin(a) * (r - 2), cy - Math.cos(a) * (r - 2),
           cx + Math.sin(a) * (r - (i % 3 === 0 ? 10 : 6)), cy - Math.cos(a) * (r - (i % 3 === 0 ? 10 : 6)));
    }
    const hand = (ang, len, col) => {
      ctx.strokeStyle = col; ctx.lineWidth = 2;
      line(cx, cy, cx + Math.sin(ang) * len, cy - Math.cos(ang) * len);
    };
    hand(((hh % 12) + mm / 60) / 12 * Math.PI * 2, 32, C.white);
    hand((mm + ss / 60) / 60 * Math.PI * 2, 46, C.orange);
    hand(ss / 60 * Math.PI * 2, 52, C.orangeD);
    fill(C.white); circle(cx, cy, 3);
    ctx.textBaseline = "top";
    font(28); fill(C.white); text(String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0"), 170, 70);
    font(12); fill(C.orange); text(String(ss).padStart(2, "0"), 268, 82);
    const days = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"];
    font(10); fill(C.dim);
    text(`${days[now.getDay()]} ${String(now.getDate()).padStart(2, "0")} ${months[now.getMonth()]} ${now.getFullYear()}`, 170, 112);
    fill(C.green); text(`${sensors.temp.toFixed(1)}C  ${Math.round(sensors.humid)}% RH`, 170, 130);
    hint("- BACK", "RTC", "HEXOS");
  }

  function goHome() { scene = "home"; }
  function openApp(i) {
    scene = ["id", "pulse", "void", "field", "radar", "chronos"][i];
    page = 0; fieldMode = 0;
    if (scene === "void") resetGame();
  }

  function tick() {
    ticks++;
    if (scene === "boot") {
      bootT += 16;
      drawBoot();
      if (bootT > 2200 || pressed("A") || pressed("B")) scene = "home";
    } else if (scene === "home") {
      if (pressed("L")) selected = (selected + 5) % 6;
      if (pressed("R")) selected = (selected + 1) % 6;
      if (pressed("U") || pressed("D")) selected = (selected + 3) % 6;
      if (pressed("A") || pressed("B") || pressed("X") || pressed("+")) openApp(selected);
      drawHome();
    } else if (scene === "id") {
      if (pressed("A") || pressed("R") || pressed("+")) page = (page + 1) % 3;
      if (pressed("L")) page = (page + 2) % 3;
      if (pressed("B") || pressed("-") || pressed("Y")) goHome();
      drawId();
    } else if (scene === "pulse") {
      if (pressed("B") || pressed("-") || pressed("Y")) goHome();
      drawPulse();
    } else if (scene === "void") {
      if (pressed("B") || pressed("-") || pressed("Y")) goHome();
      drawVoid();
    } else if (scene === "field") {
      if (pressed("A") || pressed("+") || pressed("R")) fieldMode = (fieldMode + 1) % 4;
      if (pressed("B") || pressed("-") || pressed("Y")) goHome();
      drawField();
    } else if (scene === "radar") {
      if (pressed("A") || pressed("X") || pressed("+")) radioMsg = nets.length + " CONTACTS";
      if (pressed("B") || pressed("-") || pressed("Y")) goHome();
      drawRadar();
    } else if (scene === "chronos") {
      if (pressed("B") || pressed("-") || pressed("Y")) goHome();
      drawChronos();
    }
    for (const k of Object.keys(down)) down[k] = false;
    requestAnimationFrame(tick);
  }

  bindPad();
  wireForm();
  tick();
})();
