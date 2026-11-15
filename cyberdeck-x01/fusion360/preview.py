#!/usr/bin/env python3
"""Orthographic previews of the X-01 layout. Not Fusion. Not printable STL."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
OUT = ROOT / "preview"
sys.path.insert(0, str(HERE))

from layout import (  # noqa: E402
    build,
    open_lid_boxes,
    rotate_x,
    sled_at,
    validate,
)

BOX_ORDER = [
    "lid",
    "base",
    "clip_pocket",
    "display_mount",
    "pad",
    "sled",
    "rail_l",
    "rail_r",
    "stick",
    "sensor",
    "hinge",
    "cover",
]

COLORS = {
    "lid": "#c45a12",
    "clip_pocket": "#e09040",
    "display_mount": "#888888",
    "base": "#222222",
    "pad": "#d9a441",
    "sled": "#c45a12",
    "rail_l": "#666666",
    "rail_r": "#666666",
    "stick": "#3d6b4f",
    "sensor": "#5a8f6a",
    "hinge": "#555555",
    "cover": "#444444",
    "tufty": "#2a2a2a",
}


def load_step_mesh(path: Path, lin_def=0.35, ang_def=0.6):
    import cascadio

    obj = Path("/tmp") / (path.stem + "_preview.obj")
    cascadio.step_to_obj(str(path), str(obj), lin_def, ang_def)
    verts = []
    faces = []
    with obj.open() as f:
        for line in f:
            if line.startswith("v "):
                verts.append([float(x) for x in line.split()[1:4]])
            elif line.startswith("f "):
                faces.append([int(t.split("/")[0]) - 1 for t in line.split()[1:]])
    return np.array(verts), np.array(faces)


def rotate_mesh_x(verts, origin_y, origin_z, deg):
    out = np.empty_like(verts)
    for i, (x, y, z) in enumerate(verts):
        out[i] = rotate_x(x, y, z, origin_y, origin_z, deg)
    return out


def box_edges(b):
    x0, x1 = b["xmin"], b["xmax"]
    y0, y1 = b["ymin"], b["ymax"]
    z0, z1 = b["zmin"], b["zmax"]
    c = [
        (x0, y0, z0),
        (x1, y0, z0),
        (x1, y1, z0),
        (x0, y1, z0),
        (x0, y0, z1),
        (x1, y0, z1),
        (x1, y1, z1),
        (x0, y1, z1),
    ]
    e = [
        (0, 1),
        (1, 2),
        (2, 3),
        (3, 0),
        (4, 5),
        (5, 6),
        (6, 7),
        (7, 4),
        (0, 4),
        (1, 5),
        (2, 6),
        (3, 7),
    ]
    return c, e


def project(p, mode):
    x, y, z = p
    if mode == "side":
        return z, y
    if mode == "front":
        return x, y
    if mode == "top":
        return x, z
    if mode == "iso":
        return x * 0.86 + z * 0.50, y + z * 0.18 - x * 0.10
    raise ValueError(mode)


def draw_view(ax, boxes, mesh, mode, title):
    for name in BOX_ORDER:
        if name not in boxes:
            continue
        b = boxes[name]
        cols, edges = box_edges(b)
        lw = 1.8 if name in ("lid", "base", "sled") else 0.9
        alpha = 0.95 if name in ("lid", "base", "sled", "rail_l", "rail_r") else 0.55
        for a, c in edges:
            p0 = project(cols[a], mode)
            p1 = project(cols[c], mode)
            ax.plot(
                [p0[0], p1[0]],
                [p0[1], p1[1]],
                color=COLORS.get(name, "#888"),
                lw=lw,
                alpha=alpha,
                solid_capstyle="round",
            )
    if mesh is not None:
        V, F = mesh
        # subsample edges: unique triangle edges
        seen = set()
        step = max(1, len(F) // 900)
        for tri in F[::step]:
            for i in range(3):
                a, b = int(tri[i]), int(tri[(i + 1) % 3])
                key = (min(a, b), max(a, b))
                if key in seen:
                    continue
                seen.add(key)
                p0 = project(V[a], mode)
                p1 = project(V[b], mode)
                ax.plot(
                    [p0[0], p1[0]],
                    [p0[1], p1[1]],
                    color=COLORS["tufty"],
                    lw=0.25,
                    alpha=0.35,
                )
    ax.set_aspect("equal")
    ax.set_title(title, fontsize=10)
    ax.set_xlabel({"side": "Z mm", "front": "X mm", "top": "X mm", "iso": "iso X"}[mode])
    ax.set_ylabel({"side": "Y mm", "front": "Y mm", "top": "Z mm", "iso": "iso Y"}[mode])
    ax.grid(True, alpha=0.25)


def save_fig(path, boxes, mesh, mode, title):
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(8.2, 6.2), dpi=130)
    draw_view(ax, boxes, mesh, mode, title)
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def contact_sheet(path, panels):
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    n = len(panels)
    cols = 2
    rows = (n + 1) // 2
    fig, axes = plt.subplots(rows, cols, figsize=(12.5, 5.6 * rows), dpi=120)
    axes = np.atleast_2d(axes)
    for i, (boxes, mesh, mode, title) in enumerate(panels):
        ax = axes[i // cols, i % cols]
        draw_view(ax, boxes, mesh, mode, title)
    for j in range(i + 1, rows * cols):
        axes[j // cols, j % cols].axis("off")
    fig.suptitle("X-01 ORBITAL Phase B.1 — layout preview (not Fusion, not printable)", fontsize=12)
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def write_report(path, layout, issues):
    lines = [
        "# Phase B.1 validation",
        "",
        "Generated by `fusion360/preview.py`. Fusion 360 was **not** executed.",
        "",
        "## Closed stack",
        "",
        "- Height: **{:.2f} mm** (target P_target_h = {:.1f}, spare {:.2f}).".format(
            layout["closed_height"],
            layout["params"]["P_target_h"],
            layout["params"]["P_target_h"] - layout["closed_height"],
        ),
        "- Envelope: {:.1f} × {:.1f} × {:.1f} mm (X × Y-span × Z).".format(
            layout["env"]["xmax"] - layout["env"]["xmin"],
            layout["closed_height"],
            layout["env"]["zmax"] - layout["env"]["zmin"],
        ),
        "- Rails sit **beside** the pad (X), same Y-start, height 6 mm vs pad 6.7 mm.",
        "",
        "## Issues",
        "",
    ]
    for it in issues:
        lines.append("- **{}** [{}] {}".format(it["severity"], it["id"], it["msg"]))
    lines += ["", "## Placeholder vs geometry", ""]
    for name, role in layout["roles"].items():
        b = layout["boxes"][name]
        lines.append(
            "- `{}`: **{}**  X[{:.1f},{:.1f}] Y[{:.1f},{:.1f}] Z[{:.1f},{:.1f}]".format(
                name,
                role,
                b["xmin"],
                b["xmax"],
                b["ymin"],
                b["ymax"],
                b["zmin"],
                b["zmax"],
            )
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    layout = build()
    issues = validate(layout)
    oy = layout["hinge_axis"]["origin"][1]
    oz = layout["hinge_axis"]["origin"][2]
    deg = layout["hinge_axis"]["open_deg"] * layout["hinge_axis"]["open_sign"]

    step = ROOT / "refs" / "Badgeware_Solid.step"
    mesh_closed = None
    mesh_open = None
    if step.is_file():
        V, F = load_step_mesh(step)
        mesh_closed = (V, F)
        R = rotate_mesh_x(V, oy, oz, deg)
        mesh_open = (R, F)
        base = layout["boxes"]["base"]
        inside = (
            (R[:, 0] >= base["xmin"])
            & (R[:, 0] <= base["xmax"])
            & (R[:, 1] >= base["ymin"])
            & (R[:, 1] <= base["ymax"])
            & (R[:, 2] >= base["zmin"])
            & (R[:, 2] <= base["zmax"])
        )
        n_in = int(inside.sum())
        issues.append(
            {
                "id": "OPEN_MESH_BASE",
                "severity": "error" if n_in else "info",
                "msg": "Open 110° STEP mesh vertices inside base AABB: {} (hinge Y={:.2f}, Z={:.2f}).".format(
                    n_in, oy, oz
                ),
            }
        )

    closed = layout["boxes"]
    open_in = open_lid_boxes(layout)
    open_in.update({k: v for k, v in sled_at(layout, 0.0).items() if k in ("pad", "sled")})
    open_half = open_lid_boxes(layout)
    open_half.update(
        {
            k: v
            for k, v in sled_at(layout, layout["detents"]["HALF"]).items()
            if k in ("pad", "sled")
        }
    )
    open_out = open_lid_boxes(layout)
    open_out.update(
        {
            k: v
            for k, v in sled_at(layout, layout["params"]["P_sled_travel"]).items()
            if k in ("pad", "sled")
        }
    )

    save_fig(OUT / "closed_side.png", closed, mesh_closed, "side", "Closed — side (Z/Y)")
    save_fig(OUT / "closed_front.png", closed, mesh_closed, "front", "Closed — front (X/Y)")
    save_fig(OUT / "closed_top.png", closed, mesh_closed, "top", "Closed — top (X/Z)")
    save_fig(OUT / "closed_iso.png", closed, mesh_closed, "iso", "Closed — iso")
    save_fig(OUT / "open_side.png", open_in, mesh_open, "side", "Open 110° — sled IN")
    save_fig(OUT / "open_iso.png", open_in, mesh_open, "iso", "Open 110° — sled IN")
    save_fig(OUT / "open_sled_half_side.png", open_half, mesh_open, "side", "Open 110° — sled HALF")
    save_fig(OUT / "open_sled_out_side.png", open_out, mesh_open, "side", "Open 110° — sled OUT")
    save_fig(OUT / "open_sled_out_top.png", open_out, mesh_open, "top", "Open 110° — sled OUT top")

    contact_sheet(
        OUT / "contact_sheet.png",
        [
            (closed, mesh_closed, "side", "Closed side"),
            (closed, mesh_closed, "top", "Closed top"),
            (open_in, mesh_open, "side", "Open 110°, sled in"),
            (open_half, mesh_open, "side", "Open 110°, sled half"),
            (open_out, mesh_open, "side", "Open 110°, sled out"),
            (open_out, mesh_open, "top", "Open 110°, sled out, top"),
        ],
    )
    write_report(OUT / "VALIDATION.md", layout, issues)
    n_err = sum(1 for i in issues if i["severity"] == "error")
    print("preview ->", OUT)
    print("closed_height", round(layout["closed_height"], 3))
    for it in issues:
        print("{:5} {:24} {}".format(it["severity"], it["id"], it["msg"]))
    return 1 if n_err else 0


if __name__ == "__main__":
    raise SystemExit(main())
