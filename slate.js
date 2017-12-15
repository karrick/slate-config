// load KS library
S.src(".kslate.js");

KS.register(KS.op("columns", "full"), ["1:ctrl,cmd"]);
KS.register(KS.op("columns", "one-half"), ["2:ctrl,cmd"]);
KS.register(KS.op("columns", "one-third"), ["3:ctrl,cmd"]);
KS.register(KS.op("columns", "one-quarter"), ["4:ctrl,cmd"]);
// 5
KS.register(KS.op("columns", "two-thirds"), ["6:ctrl,cmd"]);
KS.register(KS.op("columns", "three-quarters"), ["7:ctrl,cmd"]);
// 8
// 9
// 0

KS.register(KS.op('position', 'top-left'), ["u:ctrl,cmd", "pad7:ctrl,cmd"]);
KS.register(KS.op("position", "top-center"), ["i:ctrl,cmd", "pad8:ctrl,cmd"]);
KS.register(KS.op("position", "top-right"), ["o:ctrl,cmd", "pad9:ctrl,cmd"]);

KS.register(KS.op("position", "middle-left"), ["j:ctrl,cmd", "pad4:ctrl,cmd"]);
KS.register(KS.op("position", "middle-center"), ["k:ctrl,cmd", "pad5:ctrl,cmd"]);
KS.register(KS.op("position", "middle-right"), ["l:ctrl,cmd", "pad6:ctrl,cmd"]);

KS.register(KS.op("position", "bottom-left"), ["m:ctrl,cmd", "pad1:ctrl,cmd"]);
KS.register(KS.op("position", "bottom-center"), [",:ctrl,cmd", "pad2:ctrl,cmd"]);
KS.register(KS.op("position", "bottom-right"), [".:ctrl,cmd", "pad3:ctrl,cmd"]);

KS.register(KS.op("nudge", "left"), ["left:ctrl,cmd"]);
KS.register(KS.op("nudge", "right"), ["right:ctrl,cmd"]);
KS.register(KS.op("nudge", "up"), ["up:ctrl,cmd"]);
KS.register(KS.op("nudge", "down"), ["down:ctrl,cmd"]);

KS.register(KS.op("resize", "grow-horizontal"), ["right:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "shrink-horizontal"), ["left:shift,ctrl,cmd"]);

KS.register(KS.op("resize", "grow-vertical"), ["up:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "shrink-vertical"), ["down:shift,ctrl,cmd"]);

// KS.register(KS.op("resize", "full-width"), ["right:ctrl,alt,cmd"]);
// KS.register(KS.op("resize", "half-width"), ["left:ctrl,alt,cmd"]);

KS.register(KS.op("resize", "full-height"), ["up:ctrl,alt,cmd"]);
KS.register(KS.op("resize", "half-height"), ["down:ctrl,alt,cmd"]);

KS.register(KS.op("resize", "grow"), ["g:ctrl,cmd"]);
KS.register(KS.op("resize", "shrink"), ["s:ctrl,cmd"]);

// Bind All. NOTE: some of these may *not* work if you have not
// removed the expose/spaces/mission control bindings.
S.bnda({
    "b:ctrl,cmd" : S.op("focus", { "app" : "Blue Jeans" }),
    "c:ctrl,cmd" : S.op("focus", { "app" : "Slack" }),
    "e:ctrl,cmd" : S.op("focus", { "app" : "Emacs" }),
    "p:ctrl,cmd" : S.op("focus", { "app" : "Safari Technology Preview" }),
    "q:ctrl,cmd" : S.op("focus", { "app" : "Microsoft Outlook" }),
    "t:ctrl,cmd" : S.op("focus", { "app" : "Terminal" }),
    "w:ctrl,cmd" : S.op("focus", { "app" : "Firefox" }),

    // // change which window is in focus
    // "right:cmd" : S.op("focus", { "direction" : "right" }),
    // "left:cmd" : S.op("focus", { "direction" : "left" }),
    // "up:cmd" : S.op("focus", { "direction" : "up" }),
    // "down:cmd" : S.op("focus", { "direction" : "down" }),
    // // Window Hints
    // "esc:cmd" : S.op("hint")

    // Grid
    // "esc:ctrl" : S.op("grid")
});

// Configs
S.configAll({
    "defaultToCurrentScreen" : true,
    "checkDefaultsOnLoad" : true
});

// Log that we're done configuring
S.log("[SLATE] -------------- Finished Loading Config --------------");
