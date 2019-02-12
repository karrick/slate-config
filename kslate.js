/*jslint sloppy: true, vars: true */
var KS, S;
if (KS === undefined) KS = {};

(function(KS, S) {
    "use strict";

    Object.defineProperties(KS, {
        columns: {value: function (param, wr, svr) {
            switch (param) {
            case "40":
                wr.width = svr.width * 0.4;
                wr.height = svr.height;
                break;
            case "60":
                wr.width = svr.width * 0.6;
                wr.height = svr.height;
                break;
            case "full":
                wr.width = svr.width;
                wr.height = svr.height;
                break;
            case "one-half":
                wr.width = svr.width >> 1;
                wr.height = svr.height;
                break;
            case "one-third":
                wr.width = svr.width / 3;
                wr.height = svr.height;
                break;
            case "one-quarter":
                wr.width = svr.width >> 2;
                wr.height = svr.height;
                break;
            case "two-thirds":
                wr.width = svr.width * 2 / 3;
                wr.height = svr.height;
                break;
            case "three-quarters":
                wr.width = (svr.width >> 2) * 3;
                wr.height = svr.height;
                break;
            default:
                S.log("[SLATE] cannot set to unknown column description: " + param);
            }
            return wr;
        }},
        nudge: {value: function (param, wr, pixels) {
            switch (param) {
            case "left":
                wr.x -= pixels;
                break;
            case "right":
                wr.x += pixels;
                break;
            case "up":
                wr.y -= pixels;
                break;
            case "down":
                wr.y += pixels;
                break;
            default:
                S.log("[SLATE] cannot nudge in unknown direction: " + param);
            }
            return wr;
        }},
        position: {value: function (param, wr, svr) {
            switch (param) {
            case "top-left":
                wr.x = svr.x;
                wr.y = svr.y;
                break;
            case "top-center":
                wr.x = (svr.width - wr.width) / 2 + svr.x;
                wr.y = svr.y;
                break;
            case "top-right":
                wr.x = svr.x + svr.width - wr.width;
                wr.y = svr.y;
                break;
            case "middle-left":
                wr.x = svr.x;
                wr.y = (svr.height - wr.height) / 2 + svr.y;
                break;
            case "middle-center":
                wr.x = (svr.width - wr.width) / 2 + svr.x;
                wr.y = (svr.height - wr.height) / 2 + svr.y;
                break;
            case "middle-right":
                wr.x = svr.x + svr.width - wr.width;
                wr.y = (svr.height - wr.height) / 2 + svr.y;
                break;
            case "bottom-left":
                wr.x = svr.x;
                wr.y = svr.y + svr.height - wr.height;
                break;
            case "bottom-center":
                wr.x = (svr.width - wr.width) / 2 + svr.x;
                wr.y = svr.y + svr.height - wr.height;
                break;
            case "bottom-right":
                wr.x = svr.x + svr.width - wr.width;
                wr.y = svr.y + svr.height - wr.height;
                break;
            default:
                S.log("[SLATE] cannot move in unknown direction: " + param);
            }
            return wr;
        }},
        resize: {value: function (param, wr, svr, dx, dy) {
            switch (param) {
            case "grow":
                wr.x -= dx;
                wr.width += dx << 1;
                wr.y -= dy;
                wr.height += dy << 1;
                break;
            case "grow-horizontal":
                wr.x -= dx;
                wr.width += dx << 1;
                break;
            case "grow-vertical":
                wr.y -= dy;
                wr.height += dy << 1;
                break;
            case "shrink":
                wr.x += dx;
                wr.width -= dx << 1;
                wr.y += dy;
                wr.height -= dy << 1;
                break;
            case "shrink-horizontal":
                wr.x += dx;
                wr.width -= dx << 1;
                break;
            case "shrink-vertical":
                wr.y += dy;
                wr.height -= dy << 1;
                break;
            case "full-height":
                wr.height = svr.height;
                break;
            case "half-height":
                wr.height = svr.height >> 1;
                break;
            case "full-width":
                wr.width = svr.width;
                break;
            case "half-width":
                wr.width = svr.width >> 1;
                break;
            default:
                S.log("[SLATE] cannot resize in unknown direction: " + param);
            }
            return wr;
        }},
        restrictRectToVisible: {value: function (wr, svr) {
            if (wr.x < svr.x) wr.x = svr.x;
            if (wr.y < svr.y) wr.y = svr.y;
            if (wr.width > svr.width) wr.width = svr.width;
            if (wr.height > svr.height) wr.height = svr.height;

            var maxX = svr.x + svr.width - wr.width;
            if (wr.x > maxX) wr.x = maxX;

            var maxY = svr.y + svr.height - wr.height;
            if (wr.y > maxY) wr.y = maxY;

            return wr;
        }},
        snapWhenDone: {value: function (wr, svr, someFunction) {
            var edge = KS.whichEdge(wr, svr);
            wr = someFunction(wr);
            if (edge !== undefined && edge !== '') {
                if (edge.indexOf("top") !== -1) {
                    wr.y = svr.y;
                }
                if (edge.indexOf("left") !== -1) {
                    wr.x = svr.x;
                }
                if (edge.indexOf("bottom") !== -1) {
                    wr.y = (svr.y + svr.height) - wr.height;
                }
                if (edge.indexOf("right") !== -1) {
                    wr.x = (svr.x + svr.width) - wr.width;
                }
            }
            return wr;
        }},
        whichEdge: {value: function (wr, svr) {
            // RESULT: top|topleft|topright|bottom|bottomleft|bottomright|left|right
            var snapTolerance = 25;
            var result = '';
            // snapTop takes priority over snapBottom
            if (wr.y <= svr.y + snapTolerance) {
                result = 'top';
            } else if (wr.y + wr.height + snapTolerance >= svr.y + svr.height) {
                result = 'bottom';
            }
            // snapLeft takes priority over snapRight
            if (wr.x <= svr.x + snapTolerance) {
                result += 'left';
            } else if (wr.x + wr.width + snapTolerance >= svr.x + svr.width) {
                result += 'right';
            }
            return result;
        }},
        register: {enumerable: true, value: function (op, keystrokes) {
            keystrokes.forEach(function (keystroke) {
                S.bind(keystroke, op);
            });
        }},
        op: {enumerable: true, value: function (op, param, factor) {
            return function (window) {
                S.log("[SLATE] operation: " + op + "; param: " + param);

                var wr = window.rect();
                var svr = window.screen().visibleRect();
                // S.log("[SLATE] svr: " + JSON.stringify(svr));

                switch (op) {
                case "columns":
                    window.doop("move", KS.snapWhenDone(wr, svr, function () {return KS.columns(param, wr, svr);}));
                    break;
                case "nudge":
                    window.doop("move", KS.restrictRectToVisible(KS.nudge(param, wr, /* pixels: */ 100), svr));
                    break;
                case "position":
                    window.doop("move", KS.position(param, wr, svr));
                    break;
                case "resize":
                    window.doop("move", KS.snapWhenDone(wr, svr, function () {
                        if (factor === undefined) {
                            factor = 0.05;
                        }
                        var dx = Math.round(svr.width * factor);
                        var dy = Math.round(svr.height * factor);
                        return KS.restrictRectToVisible(KS.resize(param, wr, svr, dx, dy), svr);
                    }));
                    break;
                default:
                    S.log("[SLATE] cannot perform unknown operation: " + op);
                    return;
                }
            };
        }},
        mode: {enumerable: true, value: function(mode) {
            return function(window) {
                // S.log("[SLATE] mode: " + mode);
                var wr = window.rect();
                var svr = window.screen().visibleRect();

                switch (mode) {
                case "full-screen":
                    // top-left
                    wr.x = svr.x;
                    wr.y = svr.y;
                    // full screen
                    wr.width = svr.width;
                    wr.height = svr.height;
                    window.doop("move", wr);
                    break;
                case "left-side":
                    // 40% wide; full height
                    wr.width = svr.width >> 1;
                    wr.height = svr.height;
                    // top-left
                    wr.x = svr.x;
                    wr.y = svr.y;
                    window.doop("move", wr);
                    break;
                case "right-side":
                    // 60% wide; full height
                    wr.width = svr.width >> 1;
                    wr.height = svr.height;
                    // top-right
                    wr.x = svr.x + svr.width - wr.width;
                    wr.y = svr.y;
                    window.doop("move", wr);
                    break;
                default:
                    S.log("[SLATE] cannot perform unknown mode operation: " + mode);
                    break;
                }
            };
        }}
    });
}(KS, S));
