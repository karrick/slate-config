// load KS library
S.src(".kslate.js");

KS.register(KS.mode("full-screen"), ["1:ctrl,cmd"]);
KS.register(KS.mode("left-half"), ["2:ctrl,cmd"]);
KS.register(KS.mode("right-half"), ["3:ctrl,cmd"]);
KS.register(KS.mode("left-third"), ["4:ctrl,cmd"]);
KS.register(KS.mode("middle-third"), ["5:ctrl,cmd"]);
KS.register(KS.mode("right-third"), ["6:ctrl,cmd"]);

KS.register(KS.op("nudge", "left"), ["left:ctrl,cmd"]);
KS.register(KS.op("nudge", "right"), ["right:ctrl,cmd"]);
KS.register(KS.op("nudge", "up"), ["up:ctrl,cmd"]);
KS.register(KS.op("nudge", "down"), ["down:ctrl,cmd"]);

KS.register(KS.op("resize", "grow-horizontal"), ["right:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "shrink-horizontal"), ["left:shift,ctrl,cmd"]);

KS.register(KS.op("resize", "grow-vertical"), ["up:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "shrink-vertical"), ["down:shift,ctrl,cmd"]);

KS.register(KS.op("resize", "full-width"), ["right:ctrl,alt,cmd"]);
KS.register(KS.op("resize", "half-width"), ["left:ctrl,alt,cmd"]);

KS.register(KS.op("resize", "full-height"), ["up:ctrl,alt,cmd"]);
KS.register(KS.op("resize", "half-height"), ["down:ctrl,alt,cmd"]);

KS.register(KS.op("resize", "grow"), ["g:ctrl,cmd"]);
// KS.register(KS.op("resize", "shrink"), ["s:ctrl,cmd"]);

// Bind All. NOTE: some of these may *not* work if you have not
// removed the expose/spaces/mission control bindings.
S.bnda({
    // Grid
    // "esc:ctrl" : S.op("grid"),

    "-:ctrl,cmd": S.op("relaunch"),

    "tab:ctrl,cmd": S.op("switch"),

    // "b:ctrl,cmd" : S.op("focus", { "app" : "Blue Jeans" }),
    "c:ctrl,cmd" : S.op("focus", { "app" : "Slack" }),
    "e:ctrl,cmd" : S.op("focus", { "app" : "Emacs" }),
    // "p:ctrl,cmd" : S.op("focus", { "app" : "Safari Technology Preview" }),
    "o:ctrl,cmd" : S.op("focus", { "app" : "Microsoft Outlook" }),
    "i:ctrl,cmd" : S.op("focus", { "app" : "iTerm2" }),
    "f:ctrl,cmd" : S.op("focus", { "app" : "Firefox" }),

    // change which window is in focus
    "right:cmd" : S.op("focus", { "direction" : "right" }),
    "left:cmd" : S.op("focus", { "direction" : "left" }),
    "up:cmd" : S.op("focus", { "direction" : "up" }),
    "down:cmd" : S.op("focus", { "direction" : "down" }),

    // Window Hints
    "esc:cmd" : S.op("hint")
});

// Configs
S.configAll({
    "defaultToCurrentScreen" : true,
    "checkDefaultsOnLoad" : true
});

// Log that we're done configuring
S.log("[SLATE] -------------- Finished Loading Config --------------");
