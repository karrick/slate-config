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

KS.register(KS.op("move", "bottom-left"), ["m:shift,ctrl,cmd", "pad1:shift,ctrl,cmd"]);
KS.register(KS.op("move", "bottom-center"), [",:shift,ctrl,cmd", "pad2:shift,ctrl,cmd"]);
KS.register(KS.op("move", "bottom-right"), [".:shift,ctrl,cmd", "pad3:shift,ctrl,cmd"]);
KS.register(KS.op("move", "left"), ["j:shift,ctrl,cmd", "pad4:shift,ctrl,cmd"]);
KS.register(KS.op("move", "center"), ["k:shift,ctrl,cmd", "pad5:shift,ctrl,cmd"]);
KS.register(KS.op("move", "right"), ["l:shift,ctrl,cmd", "pad6:shift,ctrl,cmd"]);
KS.register(KS.op('move', 'top-left'), ["u:shift,ctrl,cmd", "pad7:shift,ctrl,cmd"]);
KS.register(KS.op("move", "top-center"), ["i:shift,ctrl,cmd", "pad8:shift,ctrl,cmd"]);
KS.register(KS.op("move", "top-right"), ["o:shift,ctrl,cmd", "pad9:shift,ctrl,cmd"]);

KS.register(KS.op("resize", "grow-vertical"), ["t:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "shrink-vertical"), ["y:shift,ctrl,cmd"]);

KS.register(KS.op("resize", "grow"), ["g:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "shrink"), ["h:shift,ctrl,cmd"]);

KS.register(KS.op("resize", "grow-horizontal"), ["b:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "shrink-horizontal"), ["n:shift,ctrl,cmd"]);

KS.register(KS.op("resize", "full-height"), ["[:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "half-height"), ["[:ctrl,cmd"]);

KS.register(KS.op("resize", "full-width"), ["]:shift,ctrl,cmd"]);
KS.register(KS.op("resize", "half-width"), ["]:ctrl,cmd"]);

// Bind All. NOTE: some of these may *not* work if you have not
// removed the expose/spaces/mission control bindings.
S.bnda({
        // // resize top left corner
        // "right:ctrl" : S.op("resize", { "width" : "-10%", "height" : "+0", "anchor" : "bottom-right" }),
        // "left:ctrl" : S.op("resize", { "width" : "+10%", "height" : "+0", "anchor" : "bottom-right" }),
        // "up:ctrl" : S.op("resize", { "width" : "+0", "height" : "+10%", "anchor" : "bottom-right" }),
        // "down:ctrl" : S.op("resize", { "width" : "+0", "height" : "-10%", "anchor" : "bottom-right" }),
        // // resize bottom right corner
        // "up:alt" : S.op("resize", { "width" : "+0", "height" : "-10%" }),
        // "down:alt" : S.op("resize", { "width" : "+0", "height" : "+10%" }),
        // "left:alt" : S.op("resize", { "width" : "-10%", "height" : "+0" }),
        // "right:alt" : S.op("resize", { "width" : "+10%", "height" : "+0" }),
        // // move entire window
        // "right:ctrl;alt" : S.op("nudge", { "x" : "+10%", "y" : "+0" }),
        // "left:ctrl;alt" : S.op("nudge", { "x" : "-10%", "y" : "+0" }),
        // "up:ctrl;alt" : S.op("nudge", { "x" : "+0", "y" : "-10%" }),
        // "down:ctrl;alt" : S.op("nudge", { "x" : "+0", "y" : "+10%" }),
        // // shove window to edge
        // "right:ctrl;shift" : S.op("push", { "direction" : "right", "style" : "bar-resize:screenSizeX/2" }),
        // "left:ctrl;shift" : S.op("push", { "direction" : "left", "style" : "bar-resize:screenSizeX/2" }),
        // "up:ctrl;shift" : S.op("push", { "direction" : "up", "style" : "bar-resize:screenSizeY/2" }),
        // "down:ctrl;shift" : S.op("push", { "direction" : "down", "style" : "bar-resize:screenSizeY/2" }),
        // // // shove window to corner
        // // "u:shift;ctrl;cmd" : topLeft,
        // // "i:shift;ctrl;cmd" : topRight,
        // // "j:shift;ctrl;cmd" : full, // all corners ;)
        // // "n:shift;ctrl;cmd" : bottomLeft,
        // // "m:shift;ctrl;cmd" : bottomRight,
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
