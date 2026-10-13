// Demo setup for the README GIF: builds a comp from two stills, runs the rig, animates the null.
// Edit the two paths, then run in After Effects or EffectCraft.
(function () {
    var A = "/path/to/demo_setup/demo_A.jpg";   // edit
    var B = "/path/to/demo_setup/demo_B.jpg";   // edit
    var comp = app.project.items.addComp("demo", 1920, 1080, 1, 6, 25);
    var fa = app.project.importFile(new ImportOptions(new File(A)));
    var fb = app.project.importFile(new ImportOptions(new File(B)));
    var lb = comp.layers.add(fb), la = comp.layers.add(fa);
    // layers.add puts the newest on top: la (A) is above lb (B), so A = left
    la.selected = true; lb.selected = true;
    app.project.activeItem = comp;
    return "ready " + comp.numLayers;
})();
