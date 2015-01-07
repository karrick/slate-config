// load KS library
S.src(".kslate.js", true);

KS.register(KS.op("move", "bottom-left"), ["m:ctrl,cmd", "pad1:ctrl,cmd"]);
KS.register(KS.op("move", "bottom-center"), [",:ctrl,cmd", "pad2:ctrl,cmd"]);
KS.register(KS.op("move", "bottom-right"), [".:ctrl,cmd", "pad3:ctrl,cmd"]);
KS.register(KS.op("move", "left"), ["j:ctrl,cmd", "pad4:ctrl,cmd"]);
KS.register(KS.op("move", "center"), ["k:ctrl,cmd", "pad5:ctrl,cmd"]);
KS.register(KS.op("move", "right"), ["l:ctrl,cmd", "pad6:ctrl,cmd"]);
KS.register(KS.op('move', 'top-left'), ["u:ctrl,cmd", "pad7:ctrl,cmd"]);
KS.register(KS.op("move", "top-center"), ["i:ctrl,cmd", "pad8:ctrl,cmd"]);
KS.register(KS.op("move", "top-right"), ["o:ctrl,cmd", "pad9:ctrl,cmd"]);

KS.register(KS.op("resize", "grow"), ["g:ctrl,cmd"]);
KS.register(KS.op("resize", "shrink"), ["s:ctrl,cmd"]);

KS.register(KS.op("resize", "grow-horizontal"), ["right:ctrl,cmd"]);
KS.register(KS.op("resize", "shrink-horizontal"), ["left:ctrl,cmd"]);
KS.register(KS.op("resize", "full-width"), ["right:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "half-width"), ["left:shift,ctrl,cmd"]);

KS.register(KS.op("resize", "grow-vertical"), ["down:ctrl,cmd"]);
KS.register(KS.op("resize", "shrink-vertical"), ["up:ctrl,cmd"]);
KS.register(KS.op("resize", "full-height"), ["down:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "half-height"), ["up:shift,ctrl,cmd"]);

// Bind All. NOTE: some of these may *not* work if you have not
// removed the expose/spaces/mission control bindings.
S.bnda({
    "c:ctrl,cmd" : S.op("focus", { "app" : "LimeChat" }),
    "e:ctrl,cmd" : S.op("focus", { "app" : "Emacs" }),
    "t:ctrl,cmd" : S.op("focus", { "app" : "Terminal" }),
    // "w:ctrl,cmd" : S.op("focus", { "app" : "Chrome" }),

    // // change which window is in focus
    // "right:cmd" : S.op("focus", { "direction" : "right" }),
    // "left:cmd" : S.op("focus", { "direction" : "left" }),
    // "up:cmd" : S.op("focus", { "direction" : "up" }),
    // "down:cmd" : S.op("focus", { "direction" : "down" }),
    // // Window Hints
    // "esc:cmd" : S.op("hint"),

    // Grid
    "esc:ctrl" : S.op("grid")
});

// Configs
S.cfga({
    "defaultToCurrentScreen" : true,
    "secondsBetweenRepeat" : 0.5,
    "checkDefaultsOnLoad" : true,
    "focusCheckWidthMax" : 3000,
    "orderScreensLeftToRight" : true
});

// Log that we're done configuring
S.log("[SLATE] -------------- Finished Loading Config --------------");
