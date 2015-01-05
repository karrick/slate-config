var KS = (function(S) {
        var that = {};
        var move = function(param, rect, visible) {
                switch (param) {
                case "top-left":
                        rect.x = visible.x;
                        rect.y = visible.y;
                        break;
                case "top-center":
                        rect.x = (visible.x + visible.width) / 2 - rect.width / 2;
                        rect.y = visible.y;
                        break;
                case "top-right":
                        rect.x = (visible.x + visible.width) - rect.width;
                        rect.y = visible.y;
                        break;
                case "left":
                        rect.x = visible.x;
                        rect.y = (visible.y + visible.height) / 2 - rect.height / 2;
                        break;
                case "center":
                        rect.x = (visible.x + visible.width) / 2 - rect.width / 2;
                        rect.y = (visible.y + visible.height) / 2 - rect.height / 2;
                        break;
                case "right":
                        rect.x = (visible.x + visible.width) - rect.width;
                        rect.y = (visible.y + visible.height) / 2 - rect.height / 2;
                        break;
                case "bottom-left":
                        rect.x = visible.x;
                        rect.y = (visible.y + visible.height) - rect.height;
                        break;
                case "bottom-center":
                        rect.x = (visible.x + visible.width) / 2 - rect.width / 2;
                        rect.y = (visible.y + visible.height) - rect.height;
                        break;
                case "bottom-right":
                        rect.x = (visible.x + visible.width) - rect.width;
                        rect.y = (visible.y + visible.height) - rect.height;
                        break;
                default:
                        S.log("[SLATE] cannot move in unknown direction: " + param);
                }
                return rect;
        };
        var resize = function(param, rect, visible) {
                switch (param) {
                case "grow":
                        rect.x -= Math.round(rect.width * 0.05);
                        rect.y -= Math.round(rect.height * 0.05);
                        rect.width = Math.round(rect.width * 1.1);
                        rect.height = Math.round(rect.height * 1.1);
                        break;
                case "grow-horizontal":
                        rect.x -= Math.round(rect.width * 0.05);
                        rect.width = Math.round(rect.width * 1.1);
                        break;
                case "grow-vertical":
                        rect.y -= Math.round(rect.height * 0.05);
                        rect.height = Math.round(rect.height * 1.1);
                        break;
                case "shrink":
                        rect.x += Math.round(rect.width * 0.05);
                        rect.y += Math.round(rect.height * 0.05);
                        rect.width = Math.round(rect.width * 0.9);
                        rect.height = Math.round(rect.height * 0.9);
                        break;
                case "shrink-horizontal":
                        rect.x += Math.round(rect.width * 0.05);
                        rect.width = Math.round(rect.width * 0.9);
                        break;
                case "shrink-vertical":
                        rect.y += Math.round(rect.height * 0.05);
                        rect.height = Math.round(rect.height * 0.9);
                        break;
                case "full-height":
                        rect.height = visible.height;
                        break;
                case "half-height":
                        rect.height = visible.height / 2;
                        break;
                case "full-width":
                        rect.width = visible.width;
                        break;
                case "half-width":
                        rect.width = visible.width / 2;
                        break;
                default:
                        S.log("[SLATE] cannot resize in unknown direction: " + param);
                }
                return rect;
        };
        var restrictRectToVisible = function(rect, visible) {
                if (rect.width > visible.width) {
                        rect.width = visible.width;
                }
                if (rect.height > visible.height) {
                        rect.height = visible.height;
                }
                if (rect.x < visible.x) {
                        rect.x = visible.x;
                }
                if (rect.y < visible.y) {
                        rect.y = visible.y;
                }
                if (rect.x + rect.width > visible.x + visible.width) {
                        rect.x = (visible.x + visible.width) - rect.width;
                }
                if (rect.y + rect.height > visible.y + visible.height) {
                        rect.y = (visible.y + visible.height) - rect.height;
                }
                return {"x":rect.x, "y":rect.y, "width":rect.width, "height": rect.height};
        };
        var snapWhenDone = function(window, someFunction) {
                var visible = S.screen().visibleRect();
                var edge = whichEdge(window, visible);
                someFunction(window);
                snapWindowToEdgeOfVisible(window, visible, edge);
        };
        var whichEdge = function(window, visible) {
                // RESULT: top|topleft|topright|bottom|bottomleft|bottomright|left|right
                var snapTolerance = 5;
                var result = '';
                var rect = window.rect();
                // snapTop takes priority over snapBottom
                if (rect.y <= visible.y + snapTolerance) {
                        result = 'top';
                } else if (rect.y + rect.height + snapTolerance >= visible.y + visible.height) {
                        result = 'bottom';
                }
                // snapLeft takes priority over snapRight
                if (rect.x <= visible.x + snapTolerance) {
                        result += 'left';
                } else if (rect.x + rect.width + snapTolerance >= visible.x + visible.width) {
                        result += 'right';
                }
                return result;
        };
        var snapWindowToEdgeOfVisible = function(window, visible, edge) {
                if (edge !== undefined && edge !== '') {
                        var rect = window.rect();
                        if (edge.indexOf("top") != -1) {
                                rect.y = visible.y;
                        }
                        if (edge.indexOf("left") != -1) {
                                rect.x = visible.x;
                        }
                        if (edge.indexOf("bottom") != -1) {
                                rect.y = (visible.y + visible.height) - rect.height;
                        }
                        if (edge.indexOf("right") != -1) {
                                rect.x = (visible.x + visible.width) - rect.width;
                        }
                        window.doop("move", rect);
                }
        };
        that.register = function(op, keystrokes) {
                keystrokes.forEach(function(keystroke) {
                        S.bind(keystroke, op);
                });
        };
        that.op = function(op, param) {
                return function(window) {
                        S.log("[SLATE] operation: " + op + "; param: " + param + "; window: " + JSON.stringify(window.title()));
                        var visible = S.screen().visibleRect();
                        var rect = window.rect();
                        switch (op) {
                        case "move":
                                rect = move(param, rect, visible);
                                rect = restrictRectToVisible(rect, visible);
                                window.doop("move", rect);
                                break;
                        case "resize":
                                snapWhenDone(window, function() {
                                        rect = resize(param, rect, visible);
                                        rect = restrictRectToVisible(rect, visible);
                                        window.doop("move", rect);
                                });
                                break;
                        default:
                                S.log("[SLATE] cannot perform unknown operation: " + op);
                                return;
                        }
                };
        };
        return that;
})(S);

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

KS.register(KS.op("resize", "grow-horizontal"), ["[:ctrl,cmd"]);
KS.register(KS.op("resize", "shrink-horizontal"), ["[:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "full-width"), ["]:ctrl,cmd"]);
KS.register(KS.op("resize", "half-width"), ["]:shift,ctrl,cmd"]);

KS.register(KS.op("resize", "grow-vertical"), [";:ctrl,cmd"]);
KS.register(KS.op("resize", "shrink-vertical"), [";:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "full-height"), ["':ctrl,cmd"]);
KS.register(KS.op("resize", "half-height"), ["':shift,ctrl,cmd"]);

// Bind All. NOTE: some of these may *not* work if you have not
// removed the expose/spaces/mission control bindings.
S.bnda({
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
