"""X-01 ORBITAL Phase B.1 layout in STEP millimetres.

Single source for placeholder AABBs. Fusion script and the preview both follow this.
Does not invent hardware sizes: C_/shop from Phase A, P_ are construction.
"""
from __future__ import annotations

import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
PARAMS_PATH = HERE / "parameters.json"


def load_params():
    raw = json.loads(PARAMS_PATH.read_text(encoding="utf-8"))
    p = {}
    p.update(raw["confirmed_mm"])
    p.update({k: v for k, v in raw["shop_approx_mm"].items() if k != "comment"})
    p.update({k: v for k, v in raw["derived_mm"].items() if k != "comment"})
    p.update(raw["provisional_mm"])
    p.update(raw["missing_placeholders_mm"])
    return p


P = load_params()


def aabb(xmin, ymin, zmin, xmax, ymax, zmax):
    return {
        "xmin": float(xmin),
        "ymin": float(ymin),
        "zmin": float(zmin),
        "xmax": float(xmax),
        "ymax": float(ymax),
        "zmax": float(zmax),
    }


def span(box):
    return (
        box["xmax"] - box["xmin"],
        box["ymax"] - box["ymin"],
        box["zmax"] - box["zmin"],
    )


def center(box):
    return (
        0.5 * (box["xmin"] + box["xmax"]),
        0.5 * (box["ymin"] + box["ymax"]),
        0.5 * (box["zmin"] + box["zmax"]),
    )


def overlap_1d(a0, a1, b0, b1):
    return min(a1, b1) - max(a0, b0)


def aabbs_overlap(a, b, eps=0.01):
    return (
        overlap_1d(a["xmin"], a["xmax"], b["xmin"], b["xmax"]) > eps
        and overlap_1d(a["ymin"], a["ymax"], b["ymin"], b["ymax"]) > eps
        and overlap_1d(a["zmin"], a["zmax"], b["zmin"], b["zmax"]) > eps
    )


def translate(box, dx=0.0, dy=0.0, dz=0.0):
    return aabb(
        box["xmin"] + dx,
        box["ymin"] + dy,
        box["zmin"] + dz,
        box["xmax"] + dx,
        box["ymax"] + dy,
        box["zmax"] + dz,
    )


def rotate_x(x, y, z, origin_y, origin_z, deg):
    """Right-hand rotation about +X through (origin_y, origin_z)."""
    import math

    th = math.radians(deg)
    cy, cz = math.cos(th), math.sin(th)
    yr, zr = y - origin_y, z - origin_z
    y2 = origin_y + cy * yr - cz * zr
    z2 = origin_z + cz * yr + cy * zr
    return x, y2, z2


def rotate_aabb_x(box, origin_y, origin_z, deg):
    corners = []
    for x in (box["xmin"], box["xmax"]):
        for y in (box["ymin"], box["ymax"]):
            for z in (box["zmin"], box["zmax"]):
                corners.append(rotate_x(x, y, z, origin_y, origin_z, deg))
    xs, ys, zs = zip(*corners)
    return aabb(min(xs), min(ys), min(zs), max(xs), max(ys), max(zs))


def build():
    """Return named AABBs and points for the closed, sled-in pose."""
    C = P
    env_xmin = -C["P_target_w"] / 2.0
    env_xmax = C["P_target_w"] / 2.0
    env_zmin = C["C_tufty_zmin"] - C["P_hinge_knuckle"] - C["P_wall"]
    env_zmax = env_zmin + C["P_target_d"]
    env = {"xmin": env_xmin, "xmax": env_xmax, "zmin": env_zmin, "zmax": env_zmax}

    lid_ymin = C["C_tufty_ymin"] - C["P_wall"]
    lid_ymax = C["C_tufty_ymax"]
    lid = aabb(env["xmin"], lid_ymin, env["zmin"], env["xmax"], lid_ymax, env["zmax"])

    clip_pocket = aabb(
        -17.0,
        lid_ymin,
        5.72,
        17.0,
        C["D_body_ymin"],
        31.15,
    )

    tufty = aabb(
        C["C_tufty_xmin"],
        C["C_tufty_ymin"],
        C["C_tufty_zmin"],
        C["C_tufty_xmax"],
        C["C_tufty_ymax"],
        C["C_tufty_zmax"],
    )

    display_mount = aabb(
        C["C_tufty_xmin"] - 1.5,
        5.1,
        C["C_tufty_zmin"] - 1.5,
        C["C_tufty_xmax"] + 1.5,
        C["C_tufty_ymax"],
        C["C_tufty_zmax"] + 1.5,
    )

    # Pad sits on +Y of the display (closed clamshell). Z centred on Tufty so
    # P_sled_travel can stay inside the 110 mm envelope (old Z-flush placement could not).
    tufty_z_c = 0.5 * (C["C_tufty_zmin"] + C["C_tufty_zmax"])
    pad_ymin = C["C_tufty_ymax"] + C["P_gap_display"]
    pad_ymax = pad_ymin + C["C_pad_h"]
    pad_zmin = tufty_z_c - C["C_pad_w"] / 2.0
    pad_zmax = tufty_z_c + C["C_pad_w"] / 2.0
    pad_xmin = -C["C_pad_l"] / 2.0
    pad_xmax = C["C_pad_l"] / 2.0
    pad = aabb(pad_xmin, pad_ymin, pad_zmin, pad_xmax, pad_ymax, pad_zmax)

    sled_ymin = pad_ymin
    sled_ymax = pad_ymin + C["P_sled_plate"]
    sled_extra_z = 8.0
    sled = aabb(
        pad_xmin - 4.0,
        sled_ymin,
        pad_zmin - sled_extra_z,
        pad_xmax + 4.0,
        sled_ymax,
        pad_zmax,
    )

    base_ymin = pad_ymin
    base_ymax = pad_ymax + C["P_sled_plate"] + C["P_floor"]
    env["ymin"] = lid_ymin
    env["ymax"] = base_ymax
    base = aabb(env["xmin"], base_ymin, env["zmin"], env["xmax"], base_ymax, env["zmax"])

    rail_h = C["P_rail_h"]
    rail_w = C["P_rail_w"]
    # Rails stay inside the closed envelope; length covers inserted sled plus travel plus overlap.
    rail_zmin = sled["zmin"]
    rail_zmax = sled["zmax"] + C["P_sled_travel"]
    if rail_zmax > env["zmax"] - C["P_wall"]:
        rail_zmax = env["zmax"] - C["P_wall"]
    if rail_zmin < env["zmin"] + C["P_wall"]:
        rail_zmin = env["zmin"] + C["P_wall"]
    rail_l = aabb(
        sled["xmin"] - rail_w,
        sled_ymin,
        rail_zmin,
        sled["xmin"],
        sled_ymin + rail_h,
        rail_zmax,
    )
    rail_r = aabb(
        sled["xmax"],
        sled_ymin,
        rail_zmin,
        sled["xmax"] + rail_w,
        sled_ymin + rail_h,
        rail_zmax,
    )

    # Stick in the BASE armour bay (not in the lid). Provisional placement.
    stick = aabb(
        env["xmax"] - C["P_wall"] - C["C_stick_w"],
        base_ymin + 0.5,
        C["C_tufty_zmin"],
        env["xmax"] - C["P_wall"],
        base_ymin + 0.5 + C["C_stick_h"],
        C["C_tufty_zmin"] + C["C_stick_l"],
    )
    sensor = aabb(
        stick["xmin"] - 1.5,
        max(stick["ymin"] - 1.0, base_ymin),
        stick["zmin"] - 1.5,
        stick["xmax"] + 1.5,
        min(stick["ymax"] + 2.0, base_ymax),
        stick["zmax"] + 1.5,
    )

    hinge_y = C["C_tufty_ymax"]
    hinge_z = C["C_tufty_zmin"] - C["P_hinge_setback"]
    hinge = aabb(
        -20.0,
        hinge_y - 2.6,
        env["zmin"],
        20.0,
        hinge_y + 2.0,
        C["C_tufty_zmin"],
    )
    cover = aabb(
        env["xmin"] + C["P_wall"],
        base_ymax - 1.0,
        env["zmin"] + C["P_wall"],
        env["xmax"] - C["P_wall"],
        base_ymax,
        env["zmax"] - C["P_wall"],
    )

    hinge_axis = {
        "origin": (0.0, hinge_y, hinge_z),
        "axis": "X",
        "open_deg": C["P_hinge_angle"],
        "open_sign": +1,
        "note": "+110 deg about +X, axis 4 mm behind the lanyard so the tab does not arc into the base.",
    }

    detents = {
        "IN": 0.0,
        "HALF": C["P_sled_travel"] / 2.0,
        "OUT": C["P_sled_travel"],
    }

    pad_holes = [
        ( -C["C_pad_hole_ctc"] / 2.0, pad_ymin, pad_zmax - C["C_pad_hole_inset"] ),
        (  C["C_pad_hole_ctc"] / 2.0, pad_ymin, pad_zmax - C["C_pad_hole_inset"] ),
    ]

    closed_h = base_ymax - lid_ymin
    return {
        "params": C,
        "env": env,
        "boxes": {
            "tufty": tufty,
            "lid": lid,
            "clip_pocket": clip_pocket,
            "display_mount": display_mount,
            "base": base,
            "pad": pad,
            "sled": sled,
            "rail_l": rail_l,
            "rail_r": rail_r,
            "stick": stick,
            "sensor": sensor,
            "hinge": hinge,
            "cover": cover,
        },
        "hinge_axis": hinge_axis,
        "detents": detents,
        "pad_holes": pad_holes,
        "closed_height": closed_h,
        "roles": {
            "tufty": "geometry",
            "clip_pocket": "placeholder",
            "lid": "placeholder",
            "display_mount": "placeholder",
            "base": "placeholder",
            "pad": "placeholder",
            "sled": "placeholder",
            "rail_l": "placeholder",
            "rail_r": "placeholder",
            "stick": "placeholder",
            "sensor": "placeholder",
            "hinge": "placeholder",
            "cover": "placeholder",
        },
    }


def sled_at(layout, travel):
    boxes = dict(layout["boxes"])
    boxes["pad"] = translate(boxes["pad"], dz=travel)
    boxes["sled"] = translate(boxes["sled"], dz=travel)
    return boxes


def open_lid_boxes(layout, deg=None):
    if deg is None:
        deg = layout["hinge_axis"]["open_deg"] * layout["hinge_axis"]["open_sign"]
    oy = layout["hinge_axis"]["origin"][1]
    oz = layout["hinge_axis"]["origin"][2]
    lid_names = ("tufty", "lid", "clip_pocket", "display_mount", "hinge")
    out = dict(layout["boxes"])
    for name in lid_names:
        out[name] = rotate_aabb_x(layout["boxes"][name], oy, oz, deg)
    return out


EXPECTED_CONTAIN = [
    ("lid", "tufty"),
    ("lid", "clip_pocket"),
    ("base", "pad"),
    ("base", "sled"),
    ("sensor", "stick"),
]

EXPECTED_CLEAR = [
    ("tufty", "pad"),
    ("tufty", "base"),
    ("tufty", "sled"),
    ("tufty", "stick"),
    ("tufty", "rail_l"),
    ("tufty", "rail_r"),
    ("lid", "base"),
    ("lid", "pad"),
    ("lid", "sled"),
    ("lid", "stick"),
]


def _contains(outer, inner, eps=0.05):
    return (
        inner["xmin"] >= outer["xmin"] - eps
        and inner["xmax"] <= outer["xmax"] + eps
        and inner["ymin"] >= outer["ymin"] - eps
        and inner["ymax"] <= outer["ymax"] + eps
        and inner["zmin"] >= outer["zmin"] - eps
        and inner["zmax"] <= outer["zmax"] + eps
    )


def validate(layout):
    issues = []
    boxes = layout["boxes"]
    C = layout["params"]
    h = layout["closed_height"]
    issues.append(
        {
            "id": "STACK",
            "severity": "info" if h <= C["P_target_h"] else "error",
            "msg": "Closed stack {:.2f} mm vs target {:.1f} mm (spare {:.2f}).".format(
                h, C["P_target_h"], C["P_target_h"] - h
            ),
        }
    )
    if h > C["P_target_h"]:
        issues[-1]["severity"] = "error"

    for a, b in EXPECTED_CONTAIN:
        if not _contains(boxes[a], boxes[b]):
            issues.append(
                {
                    "id": "CONTAIN_{}_{}".format(a, b),
                    "severity": "warn",
                    "msg": "{} does not fully contain {}.".format(a, b),
                }
            )

    for a, b in EXPECTED_CLEAR:
        if aabbs_overlap(boxes[a], boxes[b]):
            issues.append(
                {
                    "id": "COLLIDE_{}_{}".format(a, b),
                    "severity": "error",
                    "msg": "Closed pose: {} overlaps {} (placeholder AABBs).".format(a, b),
                }
            )

    # Lid vs base: lid ymax == display 6.6, base ymin = 8.6, gap = P_gap_display.
    gap = boxes["base"]["ymin"] - boxes["lid"]["ymax"]
    issues.append(
        {
            "id": "GAP_LID_BASE",
            "severity": "info" if gap >= C["P_gap_display"] - 0.05 else "error",
            "msg": "Y-gap lid to base {:.2f} mm (P_gap_display={:.2f}).".format(
                gap, C["P_gap_display"]
            ),
        }
    )

    open_boxes = open_lid_boxes(layout)
    if aabbs_overlap(open_boxes["tufty"], boxes["base"]):
        issues.append(
            {
                "id": "OPEN_TUFT_BASE_AABB",
                "severity": "warn",
                "msg": "Open 110° rotated tufty AABB overlaps base (AABB is conservative; mesh check is in preview.py).",
            }
        )
    else:
        issues.append(
            {
                "id": "OPEN_TUFT_BASE_AABB",
                "severity": "info",
                "msg": "Open 110°: tufty AABB clears the base.",
            }
        )

    for name, travel in layout["detents"].items():
        moved = sled_at(layout, travel)
        still_on_l = overlap_1d(
            moved["sled"]["zmin"],
            moved["sled"]["zmax"],
            boxes["rail_l"]["zmin"],
            boxes["rail_l"]["zmax"],
        )
        if still_on_l < C["P_rail_overlap"] - 0.5:
            issues.append(
                {
                    "id": "RAIL_OVERLAP_{}".format(name),
                    "severity": "warn",
                    "msg": "Detent {} rail overlap {:.1f} mm < P_rail_overlap {:.1f}.".format(
                        name, still_on_l, C["P_rail_overlap"]
                    ),
                }
            )
        if moved["sled"]["zmax"] > layout["env"]["zmax"] + 0.5:
            issues.append(
                {
                    "id": "SLED_PAST_ENV_{}".format(name),
                    "severity": "warn",
                    "msg": "Detent {}: sled zmax {:.1f} past envelope {:.1f} (extended pose).".format(
                        name, moved["sled"]["zmax"], layout["env"]["zmax"]
                    ),
                }
            )

    inner_z = layout["env"]["zmax"] - layout["env"]["zmin"] - 2 * C["P_wall"]
    issues.append(
        {
            "id": "Z_BUDGET",
            "severity": "info",
            "msg": "Inner Z {:.1f} mm; pad {:.1f} + travel {:.1f} = {:.1f}.".format(
                inner_z,
                C["C_pad_w"],
                C["P_sled_travel"],
                C["C_pad_w"] + C["P_sled_travel"],
            ),
        }
    )

    # Rails vs pad in Y: rails 6 mm, pad 6.7 mm starting same ymin — rails sit beside, Y overlap is OK.
    if aabbs_overlap(boxes["rail_l"], boxes["pad"]):
        issues.append(
            {
                "id": "RAIL_PAD_Y",
                "severity": "info",
                "msg": "Left rail Y-overlaps pad AABB; X is beside the pad (intended).",
            }
        )

    return issues
