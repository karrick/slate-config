// load KS library
S.src(".kslate.js");

// full <-> three-quarters <-> two-thirds <-> one-half <-> one-third <-> one-quarter
// grow moves to the left and shrink moves to the right

KS.register(KS.mode("full-screen"), ["0:ctrl,cmd"]);

// top (NORTH) (UP), right (EAST) (RIGHT), bottom (SOUTH) (DOWN), left (WEST) (LEFT)
KS.register(KS.mode("left"), ["left:ctrl,cmd"]);
KS.register(KS.mode("right"), ["right:ctrl,cmd"]);
KS.register(KS.mode("top"), ["up:ctrl,cmd"]);
KS.register(KS.mode("bottom"), ["down:ctrl,cmd"]);

// hsize 1 (1), 1/2 (2), 1/3 (3), 2/3 (4)
KS.register(KS.mode("width-full"), ["1:ctrl,cmd"]);
KS.register(KS.mode("width-half"), ["2:ctrl,cmd"]);
KS.register(KS.mode("width-third"), ["3:ctrl,cmd"]);
KS.register(KS.mode("width-two-thirds"), ["4:ctrl,cmd"]);

// vsize 1, 1/2, 1/3, 2/3
KS.register(KS.mode("height-full"), ["5:ctrl,cmd"]);
KS.register(KS.mode("height-half"), ["6:ctrl,cmd"]);
KS.register(KS.mode("height-third"), ["7:ctrl,cmd"]);
KS.register(KS.mode("height-two-thirds"), ["8:ctrl,cmd"]);

KS.register(KS.op("resize", "grow"), ["g:ctrl,cmd"]);
// KS.register(KS.op("resize", "shrink"), ["s:ctrl,cmd"]);

KS.register(KS.op("retile"), ["t:ctrl,cmd"]);
KS.register(KS.op("retile-all-main"), ["t:ctrl,alt,cmd"]);
KS.register(KS.op("tile-swap"), ["s:ctrl,cmd"]);

KS.register(KS.op("promote"), ["p:ctrl,cmd"]);
KS.register(KS.op("demote"), ["d:ctrl,cmd"]);

// TODO: Stick window on corner: it's real estate no longer available.

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
