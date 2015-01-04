// Configs
S.cfga({
        "defaultToCurrentScreen" : true,
        "secondsBetweenRepeat" : 0.5,
        "checkDefaultsOnLoad" : true,
        "focusCheckWidthMax" : 3000,
        "orderScreensLeftToRight" : true
});

// Operations
var full = S.op("move", {
        "x" : "screenOriginX",
        "y" : "screenOriginY",
        "width" : "screenSizeX",
        "height" : "screenSizeY"
});
var topRight = S.op("corner", {
        "direction" : "top-right",
        "width" : "screenSizeX/2",
        "height" : "screenSizeY/2"
});
var bottomRight = S.op("corner", {
        "direction" : "bottom-right",
        "width" : "screenSizeX/2",
        "height" : "screenSizeY/2"
});
var bottomLeft = S.op("corner", {
        "direction" : "bottom-left",
        "width" : "screenSizeX/2",
        "height" : "screenSizeY/2"
});
var topLeft = S.op("corner", {
        "direction" : "top-left",
        "width" : "screenSizeX/2",
        "height" : "screenSizeY/2"
});

var restrict = function(rect, visible) {
        // S.log("[SLATE] before restrict; rect: " + JSON.stringify(rect) + "; visible: " + JSON.stringify(visible));
        if (rect.width > visible.width) {
                rect.width = visible.width;
                // S.log("[SLATE] too wide; new width: " + rect.width);
        }
        if (rect.height > visible.height) {
                rect.height = visible.height;
                // S.log("[SLATE] too high; new height: " + rect.height);
        }
        if (rect.x < visible.x) {
                rect.x = visible.x;
                // S.log("[SLATE] nudge right; new x: " + rect.x);
        }
        if (rect.y < visible.y) {
                rect.y = visible.y;
                // S.log("[SLATE] nudge down; new y: " + rect.y);
        }
        if (rect.x + rect.width > visible.x + visible.width) {
                rect.x = (visible.x + visible.width) - rect.width;
                // S.log("[SLATE] nudge left; new x: " + rect.x);
        }
        if (rect.y + rect.height > visible.y + visible.height) {
                rect.y = (visible.y + visible.height) - rect.height;
                // S.log("[SLATE] nudge up; new y: " + rect.y);
        }
        return {"x":rect.x, "y":rect.y, "width":rect.width, "height": rect.height};
};

var whichEdge = function(window, visible) {
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
        // S.log("[SLATE] whichEdge: " + result + "; rect: " + JSON.stringify(rect) + "; visible: " + JSON.stringify(visible));
        return result; // top|topleft|topright|bottom|bottomleft|bottomright|left|right
};

var snap = function(window, visible, edge) {
        if (edge !== '') {
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

var flubber = function(op) {
        return function(window) {
                var visible = S.screen().visibleRect();
                var edge = whichEdge(window, visible);
                var rect = window.rect();
                switch (op) {
                case "grow":
                        rect.width = Math.round(rect.width * 1.1);
                        rect.height = Math.round(rect.height * 1.1);
                        break;
                case "shrink":
                        rect.width = Math.round(rect.width * 0.9);
                        rect.height = Math.round(rect.height * 0.9);
                        break;
                default:
                        S.log("[SLATE] cannot perform unknown operation: " + op);
                        return;
                }
                // NOTE: some windows have discrete sizes; for best
                // adherence to edges, need to resize, then snap.
                window.doop("move", restrict(rect, visible);
                snap(window, visible, edge);
        };
};

// Bind All. NOTE: some of these may *not* work if you have not
// removed the expose/spaces/mission control bindings.
S.bnda({
        "1:alt" : flubber("grow"),
        "2:alt" : flubber("shrink"),

        // resize top left corner
        "right:ctrl" : S.op("resize", { "width" : "-10%", "height" : "+0", "anchor" : "bottom-right" }),
        "left:ctrl" : S.op("resize", { "width" : "+10%", "height" : "+0", "anchor" : "bottom-right" }),
        "up:ctrl" : S.op("resize", { "width" : "+0", "height" : "+10%", "anchor" : "bottom-right" }),
        "down:ctrl" : S.op("resize", { "width" : "+0", "height" : "-10%", "anchor" : "bottom-right" }),
        // resize bottom right corner
        "up:alt" : S.op("resize", { "width" : "+0", "height" : "-10%" }),
        "down:alt" : S.op("resize", { "width" : "+0", "height" : "+10%" }),
        "left:alt" : S.op("resize", { "width" : "-10%", "height" : "+0" }),
        "right:alt" : S.op("resize", { "width" : "+10%", "height" : "+0" }),
        // move entire window
        "right:ctrl;alt" : S.op("nudge", { "x" : "+10%", "y" : "+0" }),
        "left:ctrl;alt" : S.op("nudge", { "x" : "-10%", "y" : "+0" }),
        "up:ctrl;alt" : S.op("nudge", { "x" : "+0", "y" : "-10%" }),
        "down:ctrl;alt" : S.op("nudge", { "x" : "+0", "y" : "+10%" }),
        // shove window to edge
        "right:ctrl;shift" : S.op("push", { "direction" : "right", "style" : "bar-resize:screenSizeX/2" }),
        "left:ctrl;shift" : S.op("push", { "direction" : "left", "style" : "bar-resize:screenSizeX/2" }),
        "up:ctrl;shift" : S.op("push", { "direction" : "up", "style" : "bar-resize:screenSizeY/2" }),
        "down:ctrl;shift" : S.op("push", { "direction" : "down", "style" : "bar-resize:screenSizeY/2" }),
        // shove window to corner
        "u:shift;ctrl;cmd" : topLeft,
        "i:shift;ctrl;cmd" : topRight,
        "j:shift;ctrl;cmd" : full, // all corners ;)
        "n:shift;ctrl;cmd" : bottomLeft,
        "m:shift;ctrl;cmd" : bottomRight,
        // change which window is in focus
        "right:cmd" : S.op("focus", { "direction" : "right" }),
        "left:cmd" : S.op("focus", { "direction" : "left" }),
        "up:cmd" : S.op("focus", { "direction" : "up" }),
        "down:cmd" : S.op("focus", { "direction" : "down" }),
        // Window Hints
        "esc:cmd" : S.op("hint"),
        // Grid
        "esc:ctrl" : S.op("grid")
});

// Log that we're done configuring
S.log("[SLATE] -------------- Finished Loading Config --------------");
