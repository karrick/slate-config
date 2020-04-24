/*jslint sloppy: true, vars: true */
var KS, S;
if (KS === undefined) KS = {};

(function(KS, S) {
    "use strict";

    // allWindows invokes callback for each window.
    var allWindows = function(callback) {
        var results = [];
        S.eachApp(function(someApp) {
            someApp.eachWindow(function(someWindow) {
                if (someWindow.isMinimizedOrHidden()) return;
                if (!someWindow.isMovable()) return;
                if (!someWindow.isResizable()) return;
                var result = callback(someWindow);
                if (result !== undefined) results.push(result);
            });
        });
        return results;
    };

    var grid = function(mainWindows, sidebarWindows) {
        var screen = S.screen();
        var svr = screen.visibleRect();

        // Compute placement of main windows first. If no main windows, then
        // allow center portion of screen to be used for sidebar windows.

        var mainCount = mainWindows.length;
        if (mainCount < 1) {
            // When no main windows, behave as if all were main windows.
            mainWindows = sidebarWindows;
            sidebarWindows = [];
        }
        var sidebarCount = sidebarWindows.length;

        var mainWidthTotal = svr.width * KS.mainWidth;
        var sidebarWidth = (svr.width - mainWidthTotal) / 2;
        var sidebarLeftX = svr.x;
        var mainLeftX = sidebarLeftX + sidebarWidth;
        var sidebarRightX = mainLeftX + mainWidthTotal;
        var mainWidth = mainCount > 1 ? mainWidthTotal / 2 : mainWidthTotal;
        var mainRightX = mainLeftX + mainWidth;
        var computedTotal = (2*sidebarWidth) + mainWidthTotal;
        if (true || Math.abs(svr.width - computedTotal) > 10) {
            S.log('[SLATE] mainWidthTotal: ' + mainWidthTotal);
            S.log('[SLATE] sidebarWidth: ' + sidebarWidth);
            S.log('[SLATE] left sidebar from ' + sidebarLeftX + ' to ' + (sidebarLeftX + sidebarWidth));
            S.log('[SLATE] mainLeftX: ' + mainLeftX);
            S.log('[SLATE] right sidebar from ' + sidebarRightX + ' to ' + (sidebarRightX + sidebarWidth));
            S.log('[SLATE] mainWidth: ' + mainWidth);
            S.log('[SLATE] mainRightX: ' + mainRightX);
            S.log('[SLATE] svr.width: ' + svr.width + '; computed total: ' + computedTotal);
            // return;
        }

        //
        // Main Windows
        //

        var half = mainCount / 2;
        var odd = mainCount % 2;
        if (odd && mainCount > 1) {
            if (true) { // || !KS.extraOnLeft) {
                half -= 0.5; // extra on right
            } else {
                half += 0.5; // extra on left
            }
        }

        // Main Left
        var y = svr.y;
        var height = svr.height / half;
        for (var i = 0; i < half; i++) {
            S.log("[SLATE] left main window: [" + mainWindows[i].title() + "]");
            var wr = mainWindows[i].rect();
            wr.x = mainLeftX;
            wr.y = y;
            wr.width = mainWidth;
            wr.height = height;
            mainWindows[i].doop("move", wr);
            y += height;
        }

        // Main Right
        y = svr.y;
        height = svr.height / (mainCount - i);
        for (; i < mainCount; i++) {
            S.log("[SLATE] right main window: [" + mainWindows[i].title() + "]");
            wr = mainWindows[i].rect();
            wr.x = mainRightX;
            wr.y = y;
            wr.width = mainWidth;
            wr.height = height;
            mainWindows[i].doop("move", wr);
            y += height;
        }

        //
        // Sidebars
        //

        half = sidebarCount / 2;
        odd = sidebarCount % 2;
        if (odd && sidebarCount > 1) {
            if (true) { // || !KS.extraOnLeft) {
                half -= 0.5; // extra on right
            } else {
                half += 0.5; // extra on left
            }
        }

        // Sidebar Left
        y = svr.y;
        height = svr.height / half;
        for (i = 0; i < half; i++) {
            S.log("[SLATE] left sidebar window: [" + sidebarWindows[i].title() + "]");
            wr = sidebarWindows[i].rect();
            wr.x = sidebarLeftX;
            wr.y = y;
            wr.width = sidebarWidth;
            wr.height = height;
            sidebarWindows[i].doop("move", wr);
            y += height;
        }

        // Sidebar Right
        y = svr.y;
        height = svr.height / (sidebarCount - i);
        for (; i < sidebarCount; i++) {
            S.log("[SLATE] right sidebar window: [" + sidebarWindows[i].title() + "]");
            wr = sidebarWindows[i].rect();
            wr.x = sidebarRightX;
            wr.y = y;
            wr.width = sidebarWidth;
            wr.height = height;
            sidebarWindows[i].doop("move", wr);
            y += height;
        }
    };

    Object.defineProperties(KS, {
        deltaX: {writable: true, value: 0.1},
        deltaY: {writable: true, value: 0.1},
        slopX: {writable: true, value: 10},
        slopY: {writable: true, value: 10},
        extraOnLeft: {writable: true, value: true},
        mainWidth: {writable: true, value: 0.5},
        mains: {writable: true, value: []},
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
                S.log("[SLATE] operation: " + op + "; param: " + param + '; window: ' + window);

                var screen = S.screen();
                var sid = screen.id();
                var sr = screen.visibleRect();
                // S.log("[SLATE] sr: " + JSON.stringify(sr));
                var wr = window.rect();
                // S.log("[SLATE] wr: " + JSON.stringify(wr));

                var windows = [];
                S.eachApp(function(someApp) {
                    someApp.eachWindow(function(someWindow) {
                        if (someWindow.isMinimizedOrHidden()) return;
                        if (!someWindow.isMovable()) return;
                        if (!someWindow.isResizable()) return;
                        if (someWindow.screen().id() !== sid) return;
                        windows.push(someWindow);
                    });
                });
                var windowsCount = windows.length;

                switch (op) {
                case "retile":
                    var title = window.title();
                    var sidebars = [];
                    for (var i = 0; i < windowsCount; i++) {
                        var someWindow = windows[i];
                        var swt = someWindow.title();
                        if (swt !== "" && swt !== title) {
                            sidebars.push(windows[i]);
                        }
                    }
                    grid([window], sidebars);
                    break;                    
                    // case "grow-left":
                    //     var gridWidth = sr.width * KS.deltaX;
                    //     var wx = wr.x;

                    //     var snap = KS.slopX;
                    //     // S.log('[SLATE] grid width: ' + gridWidth + '; wx: ' + wx + '; snap: ' + snap);

                    //     var offset = (wr.x - sr.x);
                    //     var columnIndex = Math.floor(offset / gridWidth);
                    //     if (columnIndex < 0) columnIndex = 0;
                    //     var left = (columnIndex * gridWidth) + sr.x;
                    //     if (columnIndex > 0 && wx - left <= snap) {
                    //         left -= gridWidth;
                    //     }
                    //     S.log('[SLATE] offset: ' + offset + '; columnIndex: ' + columnIndex + '; left: ' + left);
                    //     for (var i = 0; i < windowsCount; i++) {
                    //         var someWindow = windows[i];
                    //         var someRect = someWindow.rect();
                    //         S.log('[SLATE] title: ' + someWindow.title() + '; rect: ' + JSON.stringify(someRect));

                    //         if (someRect.x === oldLeft) {
                    //             someRect.x = left;
                    //             someRect.width -= (left - oldLeft);
                    //             someWindow.doop("move", someRect);
                    //             continue;
                    //         }
                    //         if (someRect.x + someRect.width === oldLeft) {
                    //             someRect.width += (left - oldLeft);
                    //             someWindow.doop("move", someRect);
                    //             continue;
                    //         }

                    //         var diff = someRect.x - left;
                    //         if (diff > 0 && someRect.x <= wx) {
                    //             S.log('[SLATE] left edge diff: ' + diff + '; someRect.x: ' + someRect.x + '; wx: ' + wx);
                    //             // Move the left edge of windows that share a
                    //             // left edge with the main window.
                    //             someRect.width += diff;
                    //             someRect.x = left;
                    //             someWindow.doop("move", someRect);
                    //             S.log('[SLATE] move left edge to the left, growing window: ' + someWindow.title());
                    //         } else {
                    //             // Move the right edge of windows that share a
                    //             // right edge with the main window.
                    //             x = someRect.x + someRect.width;
                    //             diff = x - left;
                    //             if (diff > 0 && x < wx) {
                    //                 S.log('[SLATE] right edge diff: ' + diff);
                    //                 someRect.width -= diff;
                    //                 var tw = someRect.width;
                    //                 someWindow.doop("move", someRect);
                    //                 // Check whether shrink worked
                    //                 someRect = someWindow.rect();
                    //                 var leftDiff = someRect.width - tw;
                    //                 S.log('[SLATE] width target: ' + tw + '; actual: ' + someRect.width + '; tw: ' + tw + '; title: ' + someWindow.title());
                    //                 if (leftDiff > 0) {
                    //                     var oldLeft = left;
                    //                     left += leftDiff;
                    //                     for (var ii = 0; ii < i; ii++) {
                    //                         someWindow = windows[ii];
                    //                         someRect = someWindow.rect();
                    //                         if (someRect.x === oldLeft) {
                    //                             someRect.x = left;
                    //                             someRect.width -= leftDiff;
                    //                             S.log('[SLATE] shrinking left: ' + someWindow.title());
                    //                             someWindow.doop("move", someRect);
                    //                         } else if (someRect.x + someRect.width === oldLeft) {
                    //                             someRect.width += leftDiff;
                    //                             S.log('[SLATE] growing left: ' + someWindow.title());
                    //                             someWindow.doop("move", someRect);
                    //                         }
                    //                     }
                    //                 }
                    //                 //     S.log('[SLATE] move right edge to the left, shrinking window: ' + someWindow.title());
                    //                 // } else if (false) {
                    //                 //     S.log('[SLATE] do nothing: ' + someWindow.title());
                    //             }
                    //         }
                    //     }

                    //     break;
                    // case "shrink-left":
                    //     var screen = S.screen();
                    //     var sid = screen.id();
                    //     var svr = screen.visibleRect();
                    //     var width = KS.deltaX * sr.width;

                    //     var cw = S.window();
                    //     var cwr = cw.rect();
                    //     // S.log('[SLATE] cwr: ' + JSON.stringify(cwr));

                    //     // Windows with a border between minX and maxX will get
                    //     // adjusted together to move that edge to targetX.
                    //     var minX = Math.floor(cwr.x / width) * width;
                    //     var maxX = (1 + Math.floor(cwr.x / width)) * width;
                    //     var targetX = maxX;
                    //     var rightX = (sr.x + sr.width) - width;
                    //     if (targetX > rightX) {
                    //         targetX = rightX;
                    //     }
                    //     S.log('[SLATE] width: ' + width + '; minX: ' + minX + '; maxX: ' + maxX + '; targetX: ' + targetX);

                    //     // // find all windows that have same left x, and subtract constant
                    //     // // find all windows that have right x that equals the above left x, and subtract constant
                    //     for (var i = 0, l = windows.length; i < l; i++) {
                    //         var someWindow = windows[i];
                    //         var someRect = someWindow.rect();
                    //         if (someRect.x >= minX && someRect.x <= maxX) {
                    //             someRect.width -= (targetX - someRect.x);
                    //             someRect.x = targetX;
                    //             someWindow.doop("move", someRect);
                    //             S.log('[SLATE] move left edge to the right, shrinking window: ' + someWindow.title());
                    //         } else {
                    //             var x = someRect.x + someRect.width;
                    //             if (x >= minX && y <= maxX) {
                    //                 someRect.width += (someRect.x - minX) + width;
                    //                 someWindow.doop("move", someRect);
                    //                 S.log('[SLATE] move right edge to the right, growing window: ' + someWindow.title());
                    //             } else {
                    //                 S.log('[SLATE] do nothing: ' + someWindow.title());
                    //             }
                    //         }
                    //     }
                    //     break;
                    // case "grow-right":
                    //     S.log('[SLATE] todo'); return;
                    //     S.log('[SLATE] wr: ' + JSON.stringify(wr));
                    //     var leftX = wr.x;
                    //     var tolerance = 10;

                    //     // find all windows that have same left x, and subtract constant
                    //     // find all windows that have right x that equals the above left x, and subtract constant
                    //     for (var i = 0, l = windows.length; i < l; i++) {
                    //         var someWindow = windows[i];
                    //         var someRect = someWindow.rect();
                    //         // S.log('[SLATE] someRect: ' + JSON.stringify(someRect));
                    //         if (Math.abs(someRect.x - leftX) < tolerance) {
                    //             someRect.x -= KS.deltaX;
                    //             someRect.width += KS.deltaX;
                    //             someWindow.doop("move", someRect);
                    //             S.log('[SLATE] move left edge to the left, growing window: ' + someWindow.title());
                    //         } else if (Math.abs(someRect.x + someRect.width - leftX) < tolerance) {
                    //             someRect.width -= KS.deltaX;
                    //             someWindow.doop("move", someRect);
                    //             S.log('[SLATE] move right edge to the left, shrinking window: ' + someWindow.title());
                    //         } else {
                    //             S.log('[SLATE] do nothing: ' + someWindow.title());
                    //         }
                    //     }
                    //     break;
                case "promote":
                    // Promote current window to the list of main windows if it
                    // is not already there, then trigger window tiling update.
                    var title = window.title();
                    var cwDescriptor = JSON.stringify({title: title, pid: window.pid()});

                    var found = false;
                    var l = KS.mains.length;
                    while (l--) {
                        S.log("[SLATE] mains descriptor: " + KS.mains[l]);
                        if (KS.mains[l] === cwDescriptor) {
                            S.log("[SLATE] found index " + l);
                            found = true;
                            break;
                        }
                    }
                    if (found === false) {
                        KS.mains.push(cwDescriptor);
                    }

                    // TODO: calculate the grid flow for mains.length, repaint all mains and not mains

                    // Sort all windows into two groups: sidebars and mains.
                    var sidebars = [], mains = [];

                    for (var i = 0; i < windowsCount; i++) {
                        var someWindow = windows[i];
                        var descriptor = JSON.stringify({title: someWindow.title(), pid: someWindow.pid()});
                        var ii = KS.mains.length;
                        while (ii--) {
                            if (descriptor === KS.mains[ii]) {
                                mains.push(someWindow);
                                return;
                            }
                        }
                        sidebars.push(someWindow);
                    }

                    S.log("[SLATE] There are " + mains.length + " main windows and " + sidebars.length + " sidebar windows.");
                    for (var i = 0, l = mains.length; i < l; i++) {
                        S.log("[SLATE] mains[" + i + "]: " + mains[i].title());
                    }
                    S.log("[SLATE] sidebars: " + sidebars);
                    for (var i = 0, l = sidebars.length; i < l; i++) {
                        S.log("[SLATE] sidebars[" + i + "]: " + sidebars[i].title());
                    }
                    grid(mains, sidebars);
                    break;
                case "demote":
                    var cwDescriptor = JSON.stringify({title: window.title(), pid: window.pid()});

                    var i = KS.mains.length;
                    while (i--) {
                        if (KS.mains[i] === cwDescriptor) {
                            KS.mains.splice(i, 1);
                            break;
                        }
                    }

                    // Sort all windows into two groups: sidebars and mains.
                    var sidebars = [], mains = [];

                    for (var i = 0; i < windowsCount; i++) {
                        var someWindow = windows[i];
                        var descriptor = JSON.stringify({title: someWindow.title(), pid: someWindow.pid()});
                        var ii = KS.mains.length;
                        while (ii--) {
                            if (descriptor === KS.mains[ii]) {
                                mains.push(someWindow);
                                return;
                            }
                        }
                        sidebars.push(someWindow);
                    }

                    S.log("[SLATE] There are " + mains.length + " main windows and " + sidebars.length + " sidebar windows.");
                    for (var i = 0, l = mains.length; i < l; i++) {
                        S.log("[SLATE] mains[" + i + "]: " + mains[i].title());
                    }
                    S.log("[SLATE] sidebars: " + sidebars);
                    for (var i = 0, l = sidebars.length; i < l; i++) {
                        S.log("[SLATE] sidebars[" + i + "]: " + sidebars[i].title());
                    }
                    grid(mains, sidebars);
                    break;
                case "tile-swap":
                    // Find window which is currently in middle, with below coordinates:
                    var quarter = sr.width * 0.25;
                    var fWidth = sr.width * 0.5;
                    var fHeight = sr.height;
                    var fX = sr.x + quarter;
                    var fY = sr.y;
                    var found = false;

                    for (var i = 0; i < windowsCount; i++) {
                        if (found === true) continue;
                        var someWindow = someWindows[i];
                        var wr = someWindow.rect();
                        if (Math.abs(wr.x - fX) > 10 || Math.abs(wr.y - fY) > 10) {
                            S.log("[SLATE] ignoring window not close to middle: [" + someWindow + "]");
                            continue;
                        }
                        wr.x = cwr.x;
                        wr.y = cwr.y;
                        wr.width = cwr.width;
                        wr.height = cwr.height;
                        someWindow.doop("move", wr);
                        break;
                        found = true;
                    }
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
