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
                if (window === undefined) {
                    return;     // silently ignore when no window is defined.
                }

                var wr = window.rect();
                var svr = window.screen().visibleRect();
                // S.log("[SLATE] svr: " + JSON.stringify(svr));

                switch (op) {
                case "retile":
                    var screen = S.screen();
                    var sid = screen.id();
                    var cw = S.window();
                    var wr = cw.rect();
                    var svr = screen.visibleRect();
                    var quarter = svr.width * 0.25;

                    wr.width = svr.width * 0.5;
                    wr.height = svr.height;
                    wr.y = svr.y;                        // top-edge
                    wr.x = svr.x + quarter;
                    cw.doop("move", wr);

                    var windows = [];
                    S.eachApp(function(someApp) {
                        someApp.eachWindow(function(someWindow) {
                            if (someWindow.screen().id() !== sid) {
                                S.log("[SLATE] ignoring window on a different screen: [" + someWindow + "]");
                                return;
                            }
                            if (someWindow.isMinimizedOrHidden()) {
                                S.log("[SLATE] ignoring hidden window: [" + someWindow + "]");
                                return;
                            }
                            if (!someWindow.isMovable()) {
                                S.log("[SLATE] ignoring immovable window: [" + someWindow + "]");
                                return;
                            }
                            if (!someWindow.isResizable()) {
                                S.log("[SLATE] ignoring not resizable window: [" + someWindow + "]");
                                return;
                            }
                            if (someWindow.title() == cw.title()) {
                                S.log("[SLATE] ignoring current window: [" + someWindow + "]");
                                return;
                            }
                            if (someWindow.title() === "") {
                                S.log("[SLATE] ignoring window with empty title: [" + someWindow + "]");
                                return;
                            }
                            windows.push(someWindow);
                        });
                    });

                    var l = windows.length;

                    // put half remaining windows on left and half on right
                    var width = quarter;

                    var half = l / 2;
                    var odd = l % 2 > 0;
                    if (odd) half -= 0.5;

                    var leftHeight = svr.height / half;
                    var leftX = svr.x;
                    var rightHeight = leftHeight; // assume even number of windows
                    var rightX = svr.x + (svr.width * 0.75);

                    if (odd) {
                        S.log("[SLATE] " + l + " odd number of windows: put " + half + " windows on left, and " + (half+1) + " windows on right.");
                        rightHeight = svr.height / (half+1);
                    } else {
                        S.log("[SLATE] even number of windows: put " + half + " windows on each side.");
                    }

                    var x = svr.x;
                    var y = svr.y;

                    // Left
                    for (var i = 0; i < half; i++) {
                        S.log("[SLATE] left window: [" + windows[i].title() + "]");
                        wr = windows[i].rect();
                        wr.x = leftX;
                        wr.y = y;
                        wr.width = width;
                        wr.height = leftHeight;
                        windows[i].doop("move", wr);
                        y += leftHeight;
                    }

                    // Right
                    y = svr.y;
                    for (; i < l; i++) {
                        S.log("[SLATE] right window: [" + windows[i].title() + "]");
                        wr = windows[i].rect();
                        wr.x = rightX;
                        wr.y = y;
                        wr.width = width;
                        wr.height = rightHeight;
                        windows[i].doop("move", wr);
                        y += rightHeight;
                    }

                    break;
                case "tile-swap":
                    var screen = S.screen();
                    var sid = screen.id();
                    var cw = S.window();
                    var cwr = cw.rect();

                    // Find window which is currently in middle, with below coordinates:
                    var quarter = svr.width * 0.25;
                    var fWidth = svr.width * 0.5;
                    var fHeight = svr.height;
                    var fX = svr.x + quarter;
                    var fY = svr.y; // top-edge
                    var found = false;

                    S.eachApp(function(someApp) {
                        someApp.eachWindow(function(someWindow) {
                            if (found === true) return;
                            if (someWindow.screen().id() !== sid) {
                                S.log("[SLATE] ignoring window on a different screen: [" + someWindow + "]");
                                return;
                            }
                            if (someWindow.isMinimizedOrHidden()) {
                                S.log("[SLATE] ignoring hidden window: [" + someWindow + "]");
                                return;
                            }
                            if (!someWindow.isMovable()) {
                                S.log("[SLATE] ignoring immovable window: [" + someWindow + "]");
                                return;
                            }
                            if (!someWindow.isResizable()) {
                                S.log("[SLATE] ignoring not resizable window: [" + someWindow + "]");
                                return;
                            }
                            var wr = someWindow.rect();
                            if (Math.abs(wr.x - fX) > 10 || Math.abs(wr.y - fY) > 10) {
                                S.log("[SLATE] ignoring window not close to middle: [" + someWindow + "]");
                                return;
                            }
                            wr.x = cwr.x;
                            wr.y = cwr.y;
                            wr.width = cwr.width;
                            wr.height = cwr.height;
                            someWindow.doop("move", wr);
                            found = true;
                        });
                    });

                    if (found === false) {
                        S.log("[SLATE] cannot find window in the middle");
                    }
                    cwr.x = fX;
                    cwr.y = fY;
                    cwr.width = fWidth;
                    cwr.height = fHeight;
                    cw.doop("move", cwr);

                    break;
                case "retile-third":
                    var screen = S.screen();
                    var sid = screen.id();
                    var cw = S.window();
                    var wr = cw.rect();
                    var svr = screen.visibleRect();
                    wr.width = svr.width / 3;
                    wr.height = svr.height;
                    wr.y = svr.y;                        // top-edge
                    wr.x = svr.x + wr.width;
                    cw.doop("move", wr);

                    var windows = [];
                    S.eachApp(function(someApp) {
                        someApp.eachWindow(function(someWindow) {
                            if (someWindow.screen().id() !== sid) {
                                S.log("[SLATE] ignoring window on a different screen: [" + someWindow + "]");
                                return;
                            }
                            if (someWindow.isMinimizedOrHidden()) {
                                S.log("[SLATE] ignoring hidden window: [" + someWindow + "]");
                                return;
                            }
                            if (!someWindow.isMovable()) {
                                S.log("[SLATE] ignoring immovable window: [" + someWindow + "]");
                                return;
                            }
                            if (!someWindow.isResizable()) {
                                S.log("[SLATE] ignoring not resizable window: [" + someWindow + "]");
                                return;
                            }
                            if (someWindow.title() == cw.title()) {
                                S.log("[SLATE] ignoring current window: [" + someWindow + "]");
                                return;
                            }
                            if (someWindow.title() === "") {
                                S.log("[SLATE] ignoring window with empty title: [" + someWindow + "]");
                                return;
                            }
                            windows.push(someWindow);
                        });
                    });

                    var l = windows.length;

                    // put half remaining windows on left and half on right
                    var width = svr.width / 3;

                    var half = l / 2;
                    var odd = l % 2 > 0;
                    if (odd) half -= 0.5;

                    var leftHeight = svr.height / half;
                    var leftX = svr.x;
                    var rightHeight = leftHeight; // assume even number of windows
                    var rightX = svr.x + (2 * width);

                    if (odd) {
                        S.log("[SLATE] " + l + " odd number of windows: put " + half + " windows on left, and " + (half+1) + " windows on right.");
                        rightHeight = svr.height / (half+1);
                    } else {
                        S.log("[SLATE] even number of windows: put " + half + " windows on each side.");
                    }

                    var x = svr.x;
                    var y = svr.y;

                    // Left
                    for (var i = 0; i < half; i++) {
                        S.log("[SLATE] left window: [" + windows[i].title() + "]");
                        wr = windows[i].rect();
                        wr.x = leftX;
                        wr.y = y;
                        wr.width = width;
                        wr.height = leftHeight;
                        windows[i].doop("move", wr);
                        y += leftHeight;
                    }

                    // Right
                    y = svr.y;
                    for (; i < l; i++) {
                        S.log("[SLATE] right window: [" + windows[i].title() + "]");
                        wr = windows[i].rect();
                        wr.x = rightX;
                        wr.y = y;
                        wr.width = width;
                        wr.height = rightHeight;
                        windows[i].doop("move", wr);
                        y += rightHeight;
                    }

                    break;
                case "tile-swap-third":
                    var screen = S.screen();
                    var sid = screen.id();
                    var cw = S.window();
                    var cwr = cw.rect();

                    // Find window which is currently in middle, with below coordinates:
                    var fWidth = svr.width / 3;
                    var fHeight = svr.height;
                    var fX = svr.x + fWidth;
                    var fY = svr.y; // top-edge
                    var found = false;

                    S.eachApp(function(someApp) {
                        someApp.eachWindow(function(someWindow) {
                            if (found === true) return;
                            if (someWindow.screen().id() !== sid) {
                                S.log("[SLATE] ignoring window on a different screen: [" + someWindow + "]");
                                return;
                            }
                            if (someWindow.isMinimizedOrHidden()) {
                                S.log("[SLATE] ignoring hidden window: [" + someWindow + "]");
                                return;
                            }
                            if (!someWindow.isMovable()) {
                                S.log("[SLATE] ignoring immovable window: [" + someWindow + "]");
                                return;
                            }
                            if (!someWindow.isResizable()) {
                                S.log("[SLATE] ignoring not resizable window: [" + someWindow + "]");
                                return;
                            }
                            var wr = someWindow.rect();
                            if (Math.abs(wr.x - fX) > 10 || Math.abs(wr.y - fY) > 10) {
                                S.log("[SLATE] ignoring window not close to middle: [" + someWindow + "]");
                                return;
                            }
                            wr.x = cwr.x;
                            wr.y = cwr.y;
                            wr.width = cwr.width;
                            wr.height = cwr.height;
                            someWindow.doop("move", wr);
                            found = true;
                        });
                    });

                    if (found === false) {
                        S.log("[SLATE] cannot find window in the middle");
                    }
                    cwr.x = fX;
                    cwr.y = fY;
                    cwr.width = fWidth;
                    cwr.height = fHeight;
                    cw.doop("move", cwr);

                    break;
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
                S.log("[SLATE] mode: " + mode + "; window: " + window);
                if (window === undefined) {
                    return;     // silently ignore when no window is defined.
                }
                var wr = window.rect();
                var svr = window.screen().visibleRect();

                switch (mode) {
                case "full-screen":
                    wr.width = svr.width;   // full-width
                    wr.height = svr.height; // full-height
                    wr.y = svr.y;           // top-edge
                    wr.x = svr.x;           // left-side
                    window.doop("move", wr);
                    break;
                case "left-half":
                    wr.width = svr.width >> 1; // half-width
                    wr.height = svr.height;    // full-height
                    wr.y = svr.y;              // top-edge
                    wr.x = svr.x;              // left-side
                    window.doop("move", wr);
                    break;
                case "right-half":
                    wr.width = svr.width >> 1;           // half-width
                    wr.height = svr.height;              // full-height
                    wr.y = svr.y;                        // top-edge
                    wr.x = svr.x + svr.width - wr.width; // right-side
                    window.doop("move", wr);
                    break;
                case "left-third":
                    wr.width = svr.width / 3;
                    wr.height = svr.height;
                    wr.y = svr.y;                // top-edge
                    wr.x = svr.x;                // left-side
                    window.doop("move", wr);
                    break;
                case "middle-third":
                    wr.width = svr.width / 3;
                    wr.height = svr.height;
                    wr.y = svr.y;                        // top-edge
                    wr.x = svr.x + svr.width / 3;
                    window.doop("move", wr);
                    break;
                case "right-third":
                    wr.width = svr.width / 3;
                    wr.height = svr.height;
                    wr.y = svr.y;                        // top-edge
                    wr.x = svr.x + svr.width - wr.width; // right-side
                    window.doop("move", wr);
                    break;
                case "right-two-thirds":
                    wr.width = 2 * svr.width / 3;
                    wr.height = svr.height;
                    wr.y = svr.y;                        // top-edge
                    wr.x = svr.x + svr.width / 3;
                    window.doop("move", wr);
                    break;

                case "top-left":
                    wr.width = svr.width >> 1;   // half-width
                    wr.height = svr.height >> 1; // half-height
                    wr.y = svr.y;                // top-edge
                    wr.x = svr.x;                // left-side
                    window.doop("move", wr);
                    break;
                case "top-half":
                    wr.width = svr.width;        // full-width
                    wr.height = svr.height >> 1; // half-height
                    wr.y = svr.y;                // top-edge
                    wr.x = svr.x;                // left-side
                    window.doop("move", wr);
                    break;
                case "top-right":
                    wr.width = svr.width >> 1;           // half-width
                    wr.height = svr.height >> 1;         // half-height
                    wr.y = svr.y;                        // top-edge
                    wr.x = svr.x + svr.width - wr.width; // right-side
                    window.doop("move", wr);
                    break;
                case "bottom-left":
                    wr.width = svr.width >> 1;             // half-width
                    wr.height = svr.height >> 1;           // half-height
                    wr.y = svr.y + svr.height - wr.height; // bottom-edge
                    wr.x = svr.x;                          // left-side
                    window.doop("move", wr);
                    break;
                case "bottom-half":
                    wr.width = svr.width;                  // full-width
                    wr.height = svr.height >> 1;           // half-width
                    wr.y = svr.y + svr.height - wr.height; // bottom-edge
                    wr.x = svr.x;                          // left-side
                    window.doop("move", wr);
                    break;
                case "bottom-right":
                    wr.width = svr.width >> 1;             // half-width
                    wr.height = svr.height >> 1;           // half-height
                    wr.y = svr.y + svr.height - wr.height; // bottom-edge
                    wr.x = svr.x + svr.width - wr.width;   // right-side
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
