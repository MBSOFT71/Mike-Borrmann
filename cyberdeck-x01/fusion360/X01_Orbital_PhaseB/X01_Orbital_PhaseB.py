# CYBERDECK X-01 ORBITAL — Phase B
# Fusion 360 script. Creates a NEW design. Does not overwrite existing documents.
# Not tested in Fusion 360 in the environment that authored this file.
# Placeholder bodies only — no STL/3MF, no finished housing.

import adsk.core
import adsk.fusion
import os
import traceback
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

# C_ confirmed STEP/shop, D_ derived from STEP vertices, P_ provisional, M_ missing hardware.
PARAMS = [
    # name, expression, unit, comment
    ("C_tufty_w", "84.002 mm", "mm", "STEP vertex span X. Confirmed."),
    ("C_tufty_h", "76.001 mm", "mm", "STEP vertex span Z. Confirmed."),
    ("C_tufty_t_clip", "21.358 mm", "mm", "STEP Y span including clothing clip. Confirmed."),
    ("C_tufty_xmin", "-42.001 mm", "mm", "STEP. Confirmed."),
    ("C_tufty_xmax", "42.001 mm", "mm", "STEP. Confirmed."),
    ("C_tufty_ymin", "-14.758 mm", "mm", "Clip tip. Confirmed."),
    ("C_tufty_ymax", "6.6 mm", "mm", "Front face. Confirmed."),
    ("C_tufty_zmin", "-43 mm", "mm", "Lanyard edge / hinge side. Confirmed."),
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
    ("P_target_w", "160 mm", "mm", "PROVISIONAL closed width. Design target, not hardware."),
    ("P_target_d", "110 mm", "mm", "PROVISIONAL closed depth. Design target, not hardware."),
    ("P_target_h", "45 mm", "mm", "PROVISIONAL closed height. Design target, not hardware."),
    ("P_wall", "3 mm", "mm", "PROVISIONAL FDM wall. Check in Phase G."),
    ("P_floor", "3 mm", "mm", "PROVISIONAL FDM floor."),
    ("P_sled_plate", "3 mm", "mm", "PROVISIONAL sled plate."),
    ("P_clearance", "0.3 mm", "mm", "PROVISIONAL assembly clearance."),
    ("P_gap_display", "2 mm", "mm", "PROVISIONAL display-to-pad gap. Related to M08."),
    ("P_hinge_knuckle", "8 mm", "mm", "PROVISIONAL hinge space behind lanyard edge."),
    ("P_hinge_angle", "110 deg", "deg", "PROVISIONAL opening. Mechanical stop in Phase E."),
    ("P_sled_travel", "40 mm", "mm", "PROVISIONAL full slide. Buttons stay reachable at 0."),
    ("P_sled_half", "P_sled_travel / 2", "mm", "PROVISIONAL mid detent."),
    ("P_rail_overlap", "28 mm", "mm", "PROVISIONAL rail overlap when fully out."),
    ("P_rail_w", "8 mm", "mm", "PROVISIONAL rail width."),
    ("P_rail_h", "6 mm", "mm", "PROVISIONAL rail height, lateral to pad (not in Y-stack)."),
    ("P_print_gap", "0.2 mm", "mm", "PROVISIONAL FDM running fit."),
    ("M01_usb_overtravel", "8 mm", "mm", "MISSING M01 USB plug overtravel. Placeholder."),
    ("M02_cable_bend", "10 mm", "mm", "MISSING M02 cable loop. Placeholder."),
    ("M08_pad_travel", "1.5 mm", "mm", "MISSING M08 keycap travel. Placeholder."),
    ("M09_stick_hole_ctc", "45 mm", "mm", "MISSING M09 stick hole spacing. Placeholder, not measured."),
    ("M10_cable_len", "200 mm", "mm", "MISSING M10 kit cable. Shop 200 mm option, not kit contents."),
]


def mm(val):
    """Fusion Point3D is centimetres."""
    return float(val) / 10.0


def find_step(ui, filename):
    candidates = [
        os.path.join(SCRIPT_DIR, filename),
        os.path.join(SCRIPT_DIR, "..", "..", "refs", filename),
        os.path.join(SCRIPT_DIR, "..", "refs", filename),
        os.path.join(SCRIPT_DIR, "refs", filename),
    ]
    for path in candidates:
        if os.path.isfile(path):
            return os.path.abspath(path)
    if ui:
        dlg = ui.createFileDialog()
        dlg.title = "STEP: " + filename
        dlg.filter = "STEP (*.step *.stp)"
        if dlg.showOpen() == adsk.core.DialogResults.DialogOK:
            return dlg.filename
    return None


def add_params(design):
    params = design.userParameters
    for name, expr, unit, comment in PARAMS:
        existing = params.itemByName(name)
        if existing:
            existing.expression = expr
            existing.comment = comment
        else:
            params.add(name, adsk.core.ValueInput.createByString(expr), unit, comment)


def new_component(root, name):
    occ = root.occurrences.addNewComponent(adsk.core.Matrix3D.create())
    occ.component.name = name
    return occ, occ.component


def add_aabb(comp, body_name, xmin, ymin, zmin, xmax, ymax, zmax, dist_expr=None):
    """Axis-aligned placeholder in STEP millimetres. Extrude along +Y."""
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
    dy = ymax - ymin
    expr = dist_expr if dist_expr else "{0} mm".format(dy)
    ein.setDistanceExtent(False, adsk.core.ValueInput.createByString(expr))
    feat = ext.add(ein)
    feat.name = body_name
    if feat.bodies.count > 0:
        feat.bodies.item(0).name = body_name
    return feat


def add_point(comp, name, x, y, z):
    pts = comp.constructionPoints
    pin = pts.createInput()
    pin.setByPoint(adsk.core.Point3D.create(mm(x), mm(y), mm(z)))
    pt = pts.add(pin)
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
        doc = app.documents.add(adsk.core.DocumentTypes.FusionDesignDocumentType)
        try:
            doc.name = "X01_ORBITAL_PhaseB_" + stamp
        except Exception:
            pass
        design = adsk.fusion.FusionDesign.cast(app.activeProduct)
        design.designType = adsk.fusion.DesignTypes.ParametricDesignType
        root = design.rootComponent
        root.name = "X01_ORBITAL"

        add_params(design)
        notes.append("User-Parameters C_/D_/P_/M_ angelegt.")

        # --- reference components (STEP CS identity) ---
        buck_occ, buck = new_component(root, "_REF_Tufty_Buck")
        holes_occ, holes = new_component(root, "_REF_Tufty_Holes")
        pad_occ, pad = new_component(root, "_REF_Pad_Envelope")
        stick_occ, stick = new_component(root, "_REF_Stick_Envelope")

        solid_path = find_step(ui, "Badgeware_Solid.step")
        holes_path = find_step(ui, "Badge_Case_Solid_w_Holes.step")
        if import_step(app, buck, solid_path):
            notes.append("Badgeware_Solid.step importiert (Bohr-Körper, ohne Lanyard-Löcher).")
        else:
            notes.append("WARN: Badgeware_Solid.step nicht importiert.")
        if import_step(app, holes, holes_path):
            notes.append("Badge_Case_Solid_w_Holes.step importiert (USB/Tasten/Lanyard).")
        else:
            notes.append("WARN: Badge_Case_Solid_w_Holes.step nicht importiert.")
        try:
            holes_occ.isLightBulbOn = False
        except Exception:
            pass

        # Pad envelope: 58 along X, 6.7 along Y, 25 along Z, sitting on +Y of the display.
        # Position: centred X, Y from front+gap, Z in front shelf (provisional).
        pad_ymin = 6.6 + 2.0  # C_tufty_ymax + P_gap_display numeric snapshot
        pad_ymax = pad_ymin + 6.7
        pad_zmin = 33.001 - 25.0
        pad_zmax = 33.001
        add_aabb(pad, "PLACEHOLDER_Pad", -29.0, pad_ymin, pad_zmin, 29.0, pad_ymax, pad_zmax, "C_pad_h")
        # M2.5 holes as construction points (shop 52 mm CTC, 3 mm from top corners).
        add_point(pad, "PAD_HOLE_L", -26.0, pad_ymin, pad_zmax - 3.0)
        add_point(pad, "PAD_HOLE_R", 26.0, pad_ymin, pad_zmax - 3.0)

        # Stick: inner right wall of base, rear, provisional.
        add_aabb(
            stick,
            "PLACEHOLDER_Stick",
            42.001 + 0.3,
            -7.052,
            -43.0,
            42.001 + 0.3 + 7.9,
            -7.052 + 4.2,
            -43.0 + 52.0,
        )

        # --- structure ---
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

        # Closed envelope 160 x 45 x 110 aligned to STEP:
        # X ±80, Y from clip-wall to base floor, Z from hinge-back to front.
        env_xmin, env_xmax = -80.0, 80.0
        env_zmin = -43.0 - 8.0 - 3.0  # zmin - knuckle - wall
        env_zmax = env_zmin + 110.0
        lid_ymin = -14.758 - 3.0  # clip + outer wall
        lid_ymax = 6.6
        add_aabb(lid, "PLACEHOLDER_Lid", env_xmin, lid_ymin, env_zmin, env_xmax, lid_ymax, env_zmax)
        add_aabb(
            mount,
            "PLACEHOLDER_DisplayMount",
            -42.001 - 1.5,
            5.1,
            -43.0 - 1.5,
            42.001 + 1.5,
            6.6 + 1.5,
            33.001 + 1.5,
        )

        base_ymin = pad_ymin
        base_ymax = pad_ymax + 3.0 + 3.0  # sled plate + floor
        add_aabb(base, "PLACEHOLDER_Base", env_xmin, base_ymin, env_zmin, env_xmax, base_ymax, env_zmax)

        # Sled at inserted position (detent 0). Pad must remain reachable.
        sled_ymin = pad_ymin
        sled_ymax = pad_ymin + 3.0
        add_aabb(sled, "PLACEHOLDER_Sled", -29.0 - 4.0, sled_ymin, pad_zmin - 8.0, 29.0 + 4.0, sled_ymax, pad_zmax)

        rail_len_z0 = pad_zmin - 8.0
        rail_len_z1 = pad_zmax + 40.0 + 28.0  # travel + overlap snapshot
        add_aabb(rail_l, "PLACEHOLDER_RailL", -29.0 - 4.0 - 8.0, sled_ymin, rail_len_z0, -29.0 - 4.0, sled_ymin + 6.0, rail_len_z1)
        add_aabb(rail_r, "PLACEHOLDER_RailR", 29.0 + 4.0, sled_ymin, rail_len_z0, 29.0 + 4.0 + 8.0, sled_ymin + 6.0, rail_len_z1)

        # Three usable positions: inserted, half, full. Construction points on sled axis.
        axis_x, axis_y = 0.0, (sled_ymin + sled_ymax) / 2.0
        add_point(det, "DETENT_IN", axis_x, axis_y, pad_zmin)
        add_point(det, "DETENT_HALF", axis_x, axis_y, pad_zmin + 20.0)
        add_point(det, "DETENT_OUT", axis_x, axis_y, pad_zmin + 40.0)
        add_point(det, "STOP_IN", axis_x, axis_y, pad_zmin - 2.0)
        add_point(det, "STOP_OUT", axis_x, axis_y, pad_zmin + 40.0 + 2.0)

        # Hinge axis // X through lanyard edge at the display plane (Z = C_tufty_zmin).
        hinge_l = add_point(hinge, "HINGE_L", -40.0, 6.6, -43.0)
        hinge_r = add_point(hinge, "HINGE_R", 40.0, 6.6, -43.0)
        try:
            axes = hinge.constructionAxes
            ain = axes.createInput()
            ain.setByTwoPoints(hinge_l, hinge_r)
            ax = axes.add(ain)
            ax.name = "HINGE_AXIS"
        except Exception:
            notes.append("Scharnierachse als Punkte HINGE_L/R; Axis-API nicht gebunden.")
        add_aabb(hinge, "PLACEHOLDER_HingeKnuckle", -20.0, 4.0, -54.0, 20.0, 10.0, -43.0)

        # Sensor mount: pocket around stick envelope, not sealed.
        add_aabb(
            sensor,
            "PLACEHOLDER_SensorMount",
            42.001,
            -8.0,
            -44.0,
            42.001 + 0.3 + 7.9 + 3.0,
            -7.052 + 4.2 + 3.0,
            -43.0 + 52.0 + 3.0,
        )
        add_aabb(cover, "PLACEHOLDER_Cover", env_xmin, base_ymax - 1.0, env_zmin, env_xmax, base_ymax + 2.0, env_zmax)

        # Closed-stack sketch on YZ (side view) for the Maßplan.
        try:
            sks = root.sketches.add(root.yZConstructionPlane)
            sks.name = "MASS_Seitenansicht_geschlossen"
            sks.sketchCurves.sketchLines.addTwoPointRectangle(
                adsk.core.Point3D.create(mm(lid_ymin), mm(env_zmin), 0),
                adsk.core.Point3D.create(mm(base_ymax), mm(env_zmax), 0),
            )
            skf = root.sketches.add(root.xZConstructionPlane)
            skf.name = "MASS_Draufsicht"
            skf.sketchCurves.sketchLines.addTwoPointRectangle(
                adsk.core.Point3D.create(mm(env_xmin), mm(env_zmin), 0),
                adsk.core.Point3D.create(mm(env_xmax), mm(env_zmax), 0),
            )
        except Exception:
            notes.append("Maßskizzen übersprungen.")

        closed_h = base_ymax - lid_ymin
        notes.append(
            "Platzhalter-Hüllen: Lid, Base, Sled, Rail_Left, Rail_Right, Hinge, Sensor_Mount, Display_Mount, Covers."
        )
        notes.append(
            "Geschlossene Stapelhöhe dieser Platzhalter: {0:.2f} mm (Ziel P_target_h=45). Clip in der Deckelhöhe.".format(
                closed_h
            )
        )
        notes.append("Keine STL/3MF. Keine druckfertigen Volumen. HEXOS unangetastet.")
        notes.append("Dieses Skript wurde vom Autor nicht in Fusion 360 ausgeführt.")

        ui.messageBox(
            "X-01 ORBITAL Phase B\nNeues Dokument, bestehende Dateien unangetastet.\n\n"
            + "\n".join(notes),
            "X-01 Phase B",
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
