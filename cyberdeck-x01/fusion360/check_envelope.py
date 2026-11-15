#!/usr/bin/env python3
"""Closed-stack check from parameters.json. No Fusion required."""
from __future__ import annotations

import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
P = json.loads((HERE / "parameters.json").read_text(encoding="utf-8"))

C = P["confirmed_mm"]
S = P["shop_approx_mm"]
D = P["derived_mm"]
V = P["provisional_mm"]


def main() -> None:
    rails_lateral = True
    stack_clip = (
        V["P_wall"]
        + C["C_tufty_t_clip"]
        + V["P_gap_display"]
        + S["C_pad_h"]
        + V["P_sled_plate"]
        + V["P_floor"]
    )
    stack_body = (
        V["P_wall"]
        + D["D_tufty_t_body"]
        + V["P_gap_display"]
        + S["C_pad_h"]
        + V["P_sled_plate"]
        + V["P_floor"]
    )
    extra_z = V["P_target_d"] - C["C_tufty_h"]
    z_budget = extra_z - 2 * V["P_wall"] - V["P_hinge_knuckle"]
    extra_x = V["P_target_w"] - C["C_tufty_w"]
    print("X-01 envelope check (mm)")
    print(f"  target        {V['P_target_w']:.1f} x {V['P_target_d']:.1f} x {V['P_target_h']:.1f}")
    print(f"  tufty XY/Z    {C['C_tufty_w']:.3f} x {C['C_tufty_h']:.3f}, t_clip={C['C_tufty_t_clip']:.3f}")
    print(f"  extra width   {extra_x:.1f}  (armor both sides {extra_x/2:.1f})")
    print(f"  extra depth   {extra_z:.1f}  after walls+hinge leftover {z_budget:.1f}")
    print(f"  stack w/ clip {stack_clip:.2f}  vs target {V['P_target_h']:.1f}  spare {V['P_target_h']-stack_clip:.2f}")
    print(f"  stack no clip {stack_body:.2f}  spare {V['P_target_h']-stack_body:.2f}")
    print(f"  rails lateral {rails_lateral} (not in height stack)")
    print(f"  pad footprint {S['C_pad_l']:.1f} x {S['C_pad_w']:.1f} in sled, travel P={V['P_sled_travel']:.1f}")
    if stack_clip > V["P_target_h"]:
        print("  RESULT: 45 mm TOO SMALL if clip is stacked with pad and walls.")
    else:
        print("  RESULT: 45 mm is enough IF rails sit beside the pad, not under it.")
        print("          Clip stays: lid pocket. No official clip-free STEP exists.")
    print("  pad Z is under the display (clamshell), not in the leftover depth strip.")
    if z_budget < 0:
        print("  WARN: hinge+walls eat the extra depth.")


if __name__ == "__main__":
    main()
