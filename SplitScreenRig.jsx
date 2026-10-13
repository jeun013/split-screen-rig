/*
 * Split Screen Rig 1.0
 * Select two layers (images or footage) in a comp, run this script.
 * It builds a two-panel split controlled by one null.
 *
 *   Split Ctrl (null)
 *     position X   the split line. Move or keyframe it.
 *     Gap          space between the panels
 *     Edge Gap     on: the outer margin equals Gap, so edge and middle gaps match
 *                  off: panels run to the frame edge
 *     Roundness    corner radius of both panels
 *     Parallax     100 = image follows its panel centre, 0 = image stays put
 *                  and the panel slides over it (0 to 100 keeps panels covered)
 *
 * Push the null past an edge and one panel closes while the other fills the frame.
 * Top selected layer = left panel, the other = right panel.
 * Works in After Effects and EffectCraft (File > Scripts > Run Script File...).
 * Made for Key Stage Stories. MIT licence.
 */
(function () {
    var CTRL = "Split Ctrl";

    function say(msg) {
        try { alert(msg); } catch (e) { }
        return msg;
    }

    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) return say("Open a composition, select two layers, then run the script.");

    var sel = comp.selectedLayers, imgs = [];
    for (var i = 0; i < sel.length; i++) {
        if (sel[i].source && sel[i].source.width) imgs.push(sel[i]);
    }
    if (imgs.length != 2) return say("Select exactly two image or footage layers.");
    for (var j = 1; j <= comp.numLayers; j++) {
        if (comp.layer(j).name == CTRL) return say("This comp already has a Split Ctrl.");
    }
    imgs.sort(function (a, b) { return a.index - b.index; });
    var imgL = imgs[0], imgR = imgs[1];

    if (app.beginUndoGroup) app.beginUndoGroup("Split Screen Rig");

    var W = comp.width, H = comp.height;

    // control null
    var ctrl = comp.layers.addNull();
    ctrl.name = CTRL;
    ctrl.property("ADBE Transform Group").property("ADBE Position").setValue([W / 2, H / 2]);
    var fx = ctrl.property("ADBE Effect Parade");
    function control(matchName, name, value) {
        var p = fx.addProperty(matchName);
        p.name = name;
        p.property(1).setValue(value);
    }
    control("ADBE Slider Control", "Gap", 20);
    control("ADBE Checkbox Control", "Edge Gap", 1);
    control("ADBE Slider Control", "Roundness", 0);
    control("ADBE Slider Control", "Parallax", 100);

    var head =
        'c = thisComp.layer("' + CTRL + '");\n' +
        'g = c.effect("Gap")(1);\n' +
        'm = c.effect("Edge Gap")(1) > 0 ? g : 0;\n' +
        'W = thisComp.width; H = thisComp.height;\n' +
        'x = c.toComp(c.anchorPoint)[0];\n';
    function span(l, r) {
        return 'l = clamp(' + l + ', m, W - m); r = clamp(' + r + ', l, W - m);\n';
    }
    var spanL = span("m", "x - g/2");
    var spanR = span("x + g/2", "W - m");

    // panel shapes (used as alpha mattes)
    function panel(name, sp) {
        var s = comp.layers.addShape();
        s.name = name;
        var tr = s.property("ADBE Transform Group");
        tr.property("ADBE Anchor Point").setValue([0, 0]);
        tr.property("ADBE Position").setValue([0, 0]);
        var cont = s.property("ADBE Root Vectors Group")
            .addProperty("ADBE Vector Group").property("ADBE Vectors Group");
        var rect = cont.addProperty("ADBE Vector Shape - Rect");
        cont.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([1, 1, 1, 1]);
        rect.property("ADBE Vector Rect Size").expression = head + sp + '[r - l, H - 2*m]';
        rect.property("ADBE Vector Rect Position").expression = head + sp + '[(l + r)/2, H/2]';
        rect.property("ADBE Vector Rect Roundness").expression =
            'thisComp.layer("' + CTRL + '").effect("Roundness")(1)';
        return s;
    }
    var screenL = panel("Screen L", spanL);
    var screenR = panel("Screen R", spanR);

    // each panel goes directly above its image and mattes it
    screenL.moveBefore(imgL);
    screenR.moveBefore(imgR);
    ctrl.moveToBeginning();

    function fill(img, screen, sp) {
        if (img.setTrackMatte) img.setTrackMatte(screen, TrackMatteType.ALPHA);
        else img.trackMatteType = TrackMatteType.ALPHA;
        screen.enabled = false;
        var tr = img.property("ADBE Transform Group");
        tr.property("ADBE Anchor Point").setValue([img.source.width / 2, img.source.height / 2]);
        tr.property("ADBE Position").expression = head + sp +
            'p = clamp(c.effect("Parallax")(1), 0, 100) / 100;\n' +
            '[W/2 + ((l + r)/2 - W/2) * p, H/2]';
        // cover the whole inner area, so no image edge shows at any split
        tr.property("ADBE Scale").expression = head +
            's = Math.max((W - 2*m) / width, (H - 2*m) / height) * 100;\n[s, s]';
    }
    fill(imgL, screenL, spanL);
    fill(imgR, screenR, spanR);

    for (var k = 1; k <= comp.numLayers; k++) comp.layer(k).selected = false;
    ctrl.selected = true;

    if (app.endUndoGroup) app.endUndoGroup();
    return "ok";
})();
