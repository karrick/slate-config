/*jslint sloppy: true, vars: true */
var KS, S;
if (KS === undefined) KS = {};

(function(KS, S) {
    "use strict";

    Object.defineProperties(KS, {
        nudge: {value: function (param, rect, amount) {
            switch (param) {
            case "left":
                rect.x -= amount;
                break;
            case "right":
                rect.x += amount;
                break;
            case "up":
                rect.y -= amount;
                break;
            case "down":
                rect.y += amount;
                break;
            default:
                S.log("[SLATE] cannot nudge in unknown direction: " + param);
            }
            return rect;
        }},
        position: {value: function (param, rect, visible) {
            switch (param) {
            case "top-left":
                rect.x = visible.x;
                rect.y = visible.y;
                break;
            case "top-center":
                rect.x = (visible.x + visible.width - rect.width) / 2;
                rect.y = visible.y;
                break;
            case "top-right":
                rect.x = visible.x + visible.width - rect.width;
                rect.y = visible.y;
                break;
            case "left":
                rect.x = visible.x;
                rect.y = (visible.y + visible.height - rect.height) / 2;
                break;
            case "center":
                rect.x = (visible.x + visible.width - rect.width) / 2;
                rect.y = (visible.y + visible.height - rect.height) / 2;
                break;
            case "right":
                rect.x = visible.x + visible.width - rect.width;
                rect.y = (visible.y + visible.height - rect.height) / 2;
                break;
            case "bottom-left":
                rect.x = visible.x;
                rect.y = visible.y + visible.height - rect.height;
                break;
            case "bottom-center":
                rect.x = (visible.x + visible.width - rect.width) / 2;
                rect.y = visible.y + visible.height - rect.height;
                break;
            case "bottom-right":
                rect.x = visible.x + visible.width - rect.width;
                rect.y = visible.y + visible.height - rect.height;
                break;
            default:
                S.log("[SLATE] cannot move in unknown direction: " + param);
            }
            return rect;
        }},
        resize: {value: function (param, rect, visible, dx, dy) {
            switch (param) {
            case "grow":
                rect.x -= dx;
                rect.width += 2 * dx;
                rect.y -= dy;
                rect.height += 2 * dy;
                break;
            case "grow-horizontal":
                rect.x -= dx;
                rect.width += 2 * dx;
                break;
            case "grow-vertical":
                rect.y -= dy;
                rect.height += 2 * dy;
                break;
            case "shrink":
                rect.x += dx;
                rect.width -= 2 * dx;
                rect.y += dy;
                rect.height -= 2 * dy;
                break;
            case "shrink-horizontal":
                rect.x += dx;
                rect.width -= 2 * dx;
                break;
            case "shrink-vertical":
                rect.y += dy;
                rect.height -= 2 * dy;
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
            // TODO: normalize on 5% size of visible
            return rect;
        }},
        restrictRectToVisible: {value: function (rect, visible) {
            if (rect.width > visible.width) rect.width = visible.width;
            if (rect.height > visible.height) rect.height = visible.height;
            if (rect.x < visible.x) rect.x = visible.x;
            if (rect.y < visible.y) rect.y = visible.y;

            var maxX = (visible.x + visible.width) - rect.width;
            if (rect.x > maxX) rect.x = maxX;

            var maxY = (visible.y + visible.height) - rect.height;
            if (rect.y > maxY) rect.y = maxY;

            return {"x" : rect.x, "y" : rect.y, "width" : rect.width, "height" : rect.height};
        }},
        whichEdge: {value: function (window, visible) {
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
        }},
        snapWindowToEdgeOfVisible: {value: function (window, visible, edge) {
            if (edge !== undefined && edge !== '') {
                var rect = window.rect();
                if (edge.indexOf("top") !== -1) {
                    rect.y = visible.y;
                }
                if (edge.indexOf("left") !== -1) {
                    rect.x = visible.x;
                }
                if (edge.indexOf("bottom") !== -1) {
                    rect.y = (visible.y + visible.height) - rect.height;
                }
                if (edge.indexOf("right") !== -1) {
                    rect.x = (visible.x + visible.width) - rect.width;
                }
                window.doop("move", rect);
            }
        }},
        snapWhenDone: {value: function (window, visible, someFunction) {
            var edge = KS.whichEdge(window, visible);
            someFunction(window);
            KS.snapWindowToEdgeOfVisible(window, visible, edge);
        }},
        register: {enumerable: true, value: function (op, keystrokes) {
            keystrokes.forEach(function (keystroke) {
                S.bind(keystroke, op);
            });
        }},
        op: {enumerable: true, value: function (op, param, factor) {
            return function (window) {
                S.log("[SLATE] operation: " + op + "; param: " + param);
                var visible = S.screen().visibleRect();
                var rect = window.rect();
                switch (op) {
                case "nudge":
                    var amount = 100;
                    rect = KS.nudge(param, rect, amount);
                    rect = KS.restrictRectToVisible(rect, visible);
                    window.doop("move", rect);
                    break;
                case "position":
                    rect = KS.position(param, rect, visible);
                    rect = KS.restrictRectToVisible(rect, visible);
                    window.doop("move", rect);
                    break;
                case "resize":
                    KS.snapWhenDone(window, visible, function () {
                        if (factor === undefined) {
                            factor = 0.05;
                        }
                        var dx = Math.round(visible.width * factor);
                        var dy = Math.round(visible.height * factor);
                        rect = KS.resize(param, rect, visible, dx, dy);
                        rect = KS.restrictRectToVisible(rect, visible);
                        window.doop("move", rect);
                    });
                    break;
                default:
                    S.log("[SLATE] cannot perform unknown operation: " + op);
                    return;
                }
            };
        }}
    });
}(KS, S));
