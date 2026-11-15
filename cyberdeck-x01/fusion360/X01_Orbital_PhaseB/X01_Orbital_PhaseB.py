# CYBERDECK X-01 ORBITAL — Phase B / B.1
# Fusion 360 script. Creates a NEW design. Does not overwrite existing documents.
# Layout matches fusion360/layout.py. Not executed in the authoring environment.
# Placeholder bodies only — no STL/3MF, STEP files are imported read-only.

import adsk.core
import adsk.fusion
import os
import traceback
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

PARAMS = [
    ("C_tufty_w", "84.002 mm", "mm", "STEP vertex span X. Confirmed."),
    ("C_tufty_h", "76.001 mm", "mm", "STEP vertex span Z. Confirmed."),
    ("C_tufty_t_clip", "21.358 mm", "mm", "STEP Y span including clothing clip. Confirmed."),
    ("C_tufty_xmin", "-42.001 mm", "mm", "STEP. Confirmed."),
    ("C_tufty_xmax", "42.001 mm", "mm", "STEP. Confirmed."),
    ("C_tufty_ymin", "-14.758 mm", "mm", "Clip tip. Confirmed."),
    ("C_tufty_ymax", "6.6 mm", "mm", "Front face. Confirmed."),
    ("C_tufty_zmin", "-43 mm", "mm", "Lanyard edge. Confirmed."),
    ("C_tufty_zmax", "33.001 mm", "mm", "Three-button edge. Confirmed."),
    ("C_usb_cx", "-40.106 mm", "mm", "USB-C stadium centre X. Confirmed."),
    ("C_usb_cy", "-3.581 mm", "mm", "USB-C stadium centre Y. Confirmed."),
    ("C_usb_cz", "0.016 mm", "mm", "USB-C stadium centre Z. Confirmed."),
    ("C_usb_len", "11.9 mm", "mm", "USB-C stadium length. Confirmed."),
    ("C_usb_ht", "4.8 mm", "mm", "USB-C stadium height. Confirmed."),
    ("C_usb_r", "2.4 mm", "mm", "USB-C stadium cap radius. Confirmed."),
    ("C_btn_pitch", "18 mm", "mm", "Front button well pitch. Confirmed."),
    ("C_btn_well", "6.8 mm", "mm", "Front button well outer. Confirmed."),
    ("C_pad_l", "58 mm", "mm", "Qw/ST Pad length. Shop approx."),
    ("C_pad_w", "25 mm", "mm", "Qw/ST Pad width. Shop approx."),
    ("C_pad_h", "6.7 mm", "mm", "Qw/ST Pad height. Shop approx."),
    ("C_pad_hole_ctc", "52 mm", "mm", "Pad M2.5 centres. Shop notes."),
    ("C_pad_hole_inset", "3 mm", "mm", "Pad holes from top corners. Shop notes."),
    ("C_stick_l", "52 mm", "mm", "Sensor stick length incl. connector. Shop."),
    ("C_stick_w", "7.9 mm", "mm", "Sensor stick width. Shop."),
    ("C_stick_h", "4.2 mm", "mm", "Sensor stick height. Shop."),
    ("C_jst_h", "2.95 mm", "mm", "JST SH side-entry height. Datasheet."),
    ("C_jst_d", "5.55 mm", "mm", "JST SH side-entry depth. Datasheet."),
    ("D_tufty_t_body", "13.652 mm", "mm", "DERIVED: body Y without clip. Not a second official STEP."),
    ("D_body_ymin", "-7.052 mm", "mm", "DERIVED: back of body excluding clip."),
    ("D_clip_extra", "7.706 mm", "mm", "DERIVED: clip protrusion beyond body."),
    ("P_target_w", "160 mm", "mm", "PROVISIONAL closed width."),
    ("P_target_d", "110 mm", "mm", "PROVISIONAL closed depth."),
    ("P_target_h", "45 mm", "mm", "PROVISIONAL closed height."),
    ("P_wall", "3 mm", "mm", "PROVISIONAL FDM wall."),
    ("P_floor", "3 mm", "mm", "PROVISIONAL FDM floor."),
    ("P_sled_plate", "3 mm", "mm", "PROVISIONAL sled plate."),
    ("P_clearance", "0.3 mm", "mm", "PROVISIONAL assembly clearance."),
    ("P_gap_display", "2 mm", "mm", "PROVISIONAL display-to-pad gap. Related to M08."),
    ("P_hinge_knuckle", "8 mm", "mm", "PROVISIONAL hinge space behind lanyard."),
    ("P_hinge_setback", "4 mm", "mm", "PROVISIONAL: axis 4 mm behind lanyard so 110° clears the base."),
    ("P_hinge_angle", "110 deg", "deg", "PROVISIONAL opening."),
    ("P_sled_travel", "40 mm", "mm", "PROVISIONAL full slide."),
    ("P_sled_half", "P_sled_travel / 2", "mm", "PROVISIONAL mid detent."),
    ("P_rail_overlap", "28 mm", "mm", "PROVISIONAL rail overlap when fully out."),
    ("P_rail_w", "8 mm", "mm", "PROVISIONAL rail width."),
    ("P_rail_h", "6 mm", "mm", "PROVISIONAL rail height, beside pad."),
    ("P_print_gap", "0.2 mm", "mm", "PROVISIONAL FDM running fit."),
    ("M01_usb_overtravel", "8 mm", "mm", "MISSING M01 USB plug overtravel. Placeholder."),
    ("M02_cable_bend", "10 mm", "mm", "MISSING M02 cable loop. Placeholder."),
    ("M08_pad_travel", "1.5 mm", "mm", "MISSING M08 keycap travel. Placeholder."),
    ("M09_stick_hole_ctc", "45 mm", "mm", "MISSING M09 stick hole spacing. Placeholder."),
    ("M10_cable_len", "200 mm", "mm", "MISSING M10 kit cable. Shop option, not kit contents."),
]


def mm(val):
    return float(val) / 10.0


def find_step(ui, filename):
    walked = []
    folder = SCRIPT_DIR
    for _ in range(6):
        walked.append(os.path.join(folder, filename))
        walked.append(os.path.join(folder, "refs", filename))
        walked.append(os.path.join(folder, "cyberdeck-x01", "refs", filename))
        parent = os.path.dirname(folder)
        if parent == folder:
            break
        folder = parent
    for path in walked:
        if os.path.isfile(path):
            return os.path.abspath(path)
    if ui:
        dlg = ui.createFileDialog()
        dlg.title = "STEP (read-only import): " + filename
        dlg.filter = "STEP (*.step *.stp)"
        if dlg.showOpen() == adsk.core.DialogResults.DialogOK:
            return dlg.filename
    return None


def add_params(design):
    params = design.userParameters
    for name, expr, unit, comment in PARAMS:
        existing = params.itemByName(name)
        if existing:
            try:
                existing.expression = expr
                existing.comment = comment
            except Exception:
                pass
        else:
            params.add(name, adsk.core.ValueInput.createByString(expr), unit, comment)


def new_component(root, name):
    occ = root.occurrences.addNewComponent(adsk.core.Matrix3D.create())
    occ.component.name = name
    return occ, occ.component


def add_aabb(comp, body_name, xmin, ymin, zmin, xmax, ymax, zmax):
    """Axis-aligned placeholder in STEP millimetres.

    Prefers TemporaryBRepManager so X/Y/Z are unambiguous (XZ-sketch mapping
    in Fusion is a known footgun). Falls back to an XZ sketch extrude.
    """
    try:
        mgr = adsk.fusion.TemporaryBRepManager.get()
        center = adsk.core.Point3D.create(
            mm((xmin + xmax) / 2.0),
            mm((ymin + ymax) / 2.0),
            mm((zmin + zmax) / 2.0),
        )
        obb = adsk.core.OrientedBoundingBox3D.create(
            center,
            adsk.core.Vector3D.create(1, 0, 0),
            adsk.core.Vector3D.create(0, 1, 0),
            abs(mm(xmax - xmin)),
            abs(mm(ymax - ymin)),
            abs(mm(zmax - zmin)),
        )
        tbody = mgr.createBox(obb)
        base_feat = comp.features.baseFeatures.add()
        base_feat.startEdit()
        body = comp.bRepBodies.add(tbody, base_feat)
        body.name = body_name
        base_feat.finishEdit()
        base_feat.name = body_name
        return body
    except Exception:
        planes = comp.constructionPlanes
        pin = planes.createInput()
        pin.setByOffset(
            comp.xZConstructionPlane,
            adsk.core.ValueInput.createByString("{0} mm".format(ymin)),
        )
        pl = planes.add(pin)
        pl.name = body_name + "_pl"
        sk = comp.sketches.add(pl)
        sk.name = body_name + "_sk"
        sk.sketchCurves.sketchLines.addTwoPointRectangle(
            adsk.core.Point3D.create(mm(xmin), mm(zmin), 0),
            adsk.core.Point3D.create(mm(xmax), mm(zmax), 0),
        )
        if sk.profiles.count < 1:
            return None
        ext = comp.features.extrudeFeatures
        ein = ext.createInput(
            sk.profiles.item(0), adsk.fusion.FeatureOperations.NewBodyFeatureOperation
        )
        ein.setDistanceExtent(
            False, adsk.core.ValueInput.createByString("{0} mm".format(ymax - ymin))
        )
        feat = ext.add(ein)
        feat.name = body_name
        if feat.bodies.count > 0:
            feat.bodies.item(0).name = body_name
        return feat


def add_point(comp, name, x, y, z):
    """Construction point via a sketch on an XY plane offset to Z (reliable API)."""
    planes = comp.constructionPlanes
    pin = planes.createInput()
    pin.setByOffset(
        comp.xYConstructionPlane,
        adsk.core.ValueInput.createByString("{0} mm".format(z)),
    )
    pl = planes.add(pin)
    pl.name = name + "_pl"
    sk = comp.sketches.add(pl)
    sk.name = name + "_sk"
    sp = sk.sketchPoints.add(adsk.core.Point3D.create(mm(x), mm(y), 0))
    pts = comp.constructionPoints
    cin = pts.createInput()
    cin.setByPoint(sp)
    pt = pts.add(cin)
    pt.name = name
    return pt


def import_step(app, comp, path):
    if not path or not os.path.isfile(path):
        return False
    im = app.importManager
    opts = im.createSTEPImportOptions(path)
    opts.isViewFit = False
    try:
        im.importToTarget(opts, comp)
        return True
    except Exception:
        return False


def run(context):
    ui = None
    notes = []
    try:
        app = adsk.core.Application.get()
        ui = app.userInterface
        stamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        app.documents.add(adsk.core.DocumentTypes.FusionDesignDocumentType)
        design = adsk.fusion.FusionDesign.cast(app.activeProduct)
        try:
            design.designType = adsk.fusion.DesignTypes.ParametricDesignType
        except Exception:
            pass
        try:
            app.activeDocument.name = "X01_ORBITAL_PhaseB_" + stamp
        except Exception:
            pass
        root = design.rootComponent
        root.name = "X01_ORBITAL"

        add_params(design)
        notes.append("User-Parameters C_/D_/P_/M_ angelegt.")

        buck_occ, buck = new_component(root, "_REF_Tufty_Buck")
        holes_occ, holes = new_component(root, "_REF_Tufty_Holes")
        pad_occ, pad = new_component(root, "_REF_Pad_Envelope")
        stick_occ, stick = new_component(root, "_REF_Stick_Envelope")

        solid_path = find_step(ui, "Badgeware_Solid.step")
        holes_path = find_step(ui, "Badge_Case_Solid_w_Holes.step")
        if import_step(app, buck, solid_path):
            notes.append("Badgeware_Solid.step importiert (read-only, Bohr-Körper).")
        else:
            notes.append("WARN: Badgeware_Solid.step nicht importiert — Datei wählen.")
        if import_step(app, holes, holes_path):
            notes.append("Badge_Case_Solid_w_Holes.step importiert (read-only).")
        else:
            notes.append("WARN: Badge_Case_Solid_w_Holes.step nicht importiert — Datei wählen.")
        try:
            holes_occ.isLightBulbOn = False
        except Exception:
            pass

        # Numbers match fusion360/layout.py (closed, sled-in).
        tufty_xmin, tufty_xmax = -42.001, 42.001
        tufty_ymin, tufty_ymax = -14.758, 6.6
        tufty_zmin, tufty_zmax = -43.0, 33.001
        wall, floor, gap = 3.0, 3.0, 2.0
        knuckle, setback = 8.0, 4.0
        pad_l, pad_w, pad_h = 58.0, 25.0, 6.7
        sled_plate, rail_w, rail_h = 3.0, 8.0, 6.0
        travel = 40.0
        stick_w, stick_h, stick_l = 7.9, 4.2, 52.0

        env_xmin, env_xmax = -80.0, 80.0
        env_zmin = tufty_zmin - knuckle - wall
        env_zmax = env_zmin + 110.0
        lid_ymin = tufty_ymin - wall
        lid_ymax = tufty_ymax

        tufty_z_c = 0.5 * (tufty_zmin + tufty_zmax)
        pad_ymin = tufty_ymax + gap
        pad_ymax = pad_ymin + pad_h
        pad_zmin = tufty_z_c - pad_w / 2.0
        pad_zmax = tufty_z_c + pad_w / 2.0
        pad_xmin, pad_xmax = -pad_l / 2.0, pad_l / 2.0
        sled_ymin = pad_ymin
        sled_ymax = pad_ymin + sled_plate
        sled_xmin, sled_xmax = pad_xmin - 4.0, pad_xmax + 4.0
        sled_zmin, sled_zmax = pad_zmin - 8.0, pad_zmax
        base_ymin = pad_ymin
        base_ymax = pad_ymax + sled_plate + floor
        rail_zmin = sled_zmin
        rail_zmax = min(sled_zmax + travel, env_zmax - wall)
        if rail_zmin < env_zmin + wall:
            rail_zmin = env_zmin + wall
        hinge_y = tufty_ymax
        hinge_z = tufty_zmin - setback

        add_aabb(pad, "PLACEHOLDER_Pad", pad_xmin, pad_ymin, pad_zmin, pad_xmax, pad_ymax, pad_zmax)
        add_point(pad, "PAD_HOLE_L", -26.0, pad_ymin, pad_zmax - 3.0)
        add_point(pad, "PAD_HOLE_R", 26.0, pad_ymin, pad_zmax - 3.0)

        add_aabb(
            stick,
            "PLACEHOLDER_Stick",
            env_xmax - wall - stick_w,
            base_ymin + 0.5,
            tufty_zmin,
            env_xmax - wall,
            base_ymin + 0.5 + stick_h,
            tufty_zmin + stick_l,
        )

        lid_occ, lid = new_component(root, "Lid")
        mount_occ, mount = new_component(root, "Display_Mount")
        base_occ, base = new_component(root, "Base")
        sled_occ, sled = new_component(root, "Sled")
        rail_l_occ, rail_l = new_component(root, "Rail_Left")
        rail_r_occ, rail_r = new_component(root, "Rail_Right")
        det_occ, det = new_component(root, "Detents")
        hinge_occ, hinge = new_component(root, "Hinge")
        sensor_occ, sensor = new_component(root, "Sensor_Mount")
        cover_occ, cover = new_component(root, "Covers")

        add_aabb(lid, "PLACEHOLDER_Lid", env_xmin, lid_ymin, env_zmin, env_xmax, lid_ymax, env_zmax)
        add_aabb(lid, "PLACEHOLDER_ClipPocket", -17.0, lid_ymin, 5.72, 17.0, -7.052, 31.15)
        add_aabb(
            mount,
            "PLACEHOLDER_DisplayMount",
            tufty_xmin - 1.5,
            5.1,
            tufty_zmin - 1.5,
            tufty_xmax + 1.5,
            tufty_ymax,
            tufty_zmax + 1.5,
        )
        add_aabb(base, "PLACEHOLDER_Base", env_xmin, base_ymin, env_zmin, env_xmax, base_ymax, env_zmax)
        add_aabb(sled, "PLACEHOLDER_Sled", sled_xmin, sled_ymin, sled_zmin, sled_xmax, sled_ymax, sled_zmax)
        add_aabb(
            rail_l,
            "PLACEHOLDER_RailL",
            sled_xmin - rail_w,
            sled_ymin,
            rail_zmin,
            sled_xmin,
            sled_ymin + rail_h,
            rail_zmax,
        )
        add_aabb(
            rail_r,
            "PLACEHOLDER_RailR",
            sled_xmax,
            sled_ymin,
            rail_zmin,
            sled_xmax + rail_w,
            sled_ymin + rail_h,
            rail_zmax,
        )

        axis_y = 0.5 * (sled_ymin + sled_ymax)
        add_point(det, "DETENT_IN", 0.0, axis_y, pad_zmin)
        add_point(det, "DETENT_HALF", 0.0, axis_y, pad_zmin + travel / 2.0)
        add_point(det, "DETENT_OUT", 0.0, axis_y, pad_zmin + travel)
        add_point(det, "STOP_IN", 0.0, axis_y, pad_zmin - 2.0)
        add_point(det, "STOP_OUT", 0.0, axis_y, pad_zmin + travel + 2.0)

        hinge_l = add_point(hinge, "HINGE_L", -40.0, hinge_y, hinge_z)
        hinge_r = add_point(hinge, "HINGE_R", 40.0, hinge_y, hinge_z)
        try:
            axes = hinge.constructionAxes
            ain = axes.createInput()
            ain.setByTwoPoints(hinge_l, hinge_r)
            ax = axes.add(ain)
            ax.name = "HINGE_AXIS"
        except Exception:
            notes.append("Scharnierachse als Punkte HINGE_L/R.")
        add_aabb(hinge, "PLACEHOLDER_HingeKnuckle", -20.0, hinge_y - 2.6, env_zmin, 20.0, hinge_y + 2.0, tufty_zmin)

        sensor_ymin = max(base_ymin + 0.5 - 1.0, base_ymin)
        sensor_ymax = min(base_ymin + 0.5 + stick_h + 2.0, base_ymax)
        add_aabb(
            sensor,
            "PLACEHOLDER_SensorMount",
            env_xmax - wall - stick_w - 1.5,
            sensor_ymin,
            tufty_zmin - 1.5,
            env_xmax - wall + 1.5,
            sensor_ymax,
            tufty_zmin + stick_l + 1.5,
        )
        add_aabb(
            cover,
            "PLACEHOLDER_Cover",
            env_xmin + wall,
            base_ymax - 1.0,
            env_zmin + wall,
            env_xmax - wall,
            base_ymax,
            env_zmax - wall,
        )

        closed_h = base_ymax - lid_ymin
        notes.append("Platzhalter an layout.py angeglichen (BRep-Boxen, STEP unverändert).")
        notes.append(
            "Stapelhöhe {:.2f} mm (Ziel 45). Scharnier Y={:.1f} Z={:.1f}.".format(
                closed_h, hinge_y, hinge_z
            )
        )
        notes.append("Keine STL/3MF. HEXOS unangetastet. Fusion-Lauf hier nicht erfolgt.")

        ui.messageBox(
            "X-01 ORBITAL Phase B.1\nNeues Dokument, STEPs nur importiert.\n\n"
            + "\n".join(notes),
            "X-01 Phase B.1",
        )
        try:
            app.activeViewport.fit()
        except Exception:
            pass
    except Exception:
        if ui:
            ui.messageBox("X-01 Phase B fehlgeschlagen:\n{}".format(traceback.format_exc()))


def stop(context):
    return
