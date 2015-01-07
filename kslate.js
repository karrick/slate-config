/*jslint sloppy: true, vars: true */
var KS = (function (S) {
    var that = {};
    var move = function (param, rect, visible) {
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
    };
    var resize = function (param, rect, visible) {
        var dx = Math.round(visible.width * 0.05);
        var dy = Math.round(visible.height * 0.05);
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
    };
    var restrictRectToVisible = function (rect, visible) {
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
        return {"x" : rect.x, "y" : rect.y, "width" : rect.width, "height" : rect.height};
    };
    var whichEdge = function (window, visible) {
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
    var snapWindowToEdgeOfVisible = function (window, visible, edge) {
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
    };
    var snapWhenDone = function (window, someFunction) {
        var visible = S.screen().visibleRect();
        var edge = whichEdge(window, visible);
        someFunction(window);
        snapWindowToEdgeOfVisible(window, visible, edge);
    };
    that.register = function (op, keystrokes) {
        keystrokes.forEach(function (keystroke) {
            S.bind(keystroke, op);
        });
    };
    that.op = function (op, param) {
        return function (window) {
            S.log("[SLATE] operation: " + op + "; param: " + param);
            var visible = S.screen().visibleRect();
            var rect = window.rect();
            switch (op) {
            case "move":
                rect = move(param, rect, visible);
                rect = restrictRectToVisible(rect, visible);
                window.doop("move", rect);
                break;
            case "resize":
                snapWhenDone(window, function () {
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
}(S));
