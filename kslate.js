/*jslint sloppy: true, vars: true */
var KS, S;
if (KS === undefined) KS = {};

(function(KS, S) {
	"use strict";

	Object.defineProperties(KS, {
		columns: {value: function (param, wr, sr) {
			switch (param) {
			case "40":
				wr.width = sr.width * 0.4;
				wr.height = sr.height;
				break;
			case "60":
				wr.width = sr.width * 0.6;
				wr.height = sr.height;
				break;
			case "full":
				wr.width = sr.width;
				wr.height = sr.height;
				break;
			case "one-half":
				wr.width = sr.width * 0.5;
				wr.height = sr.height;
				break;
			case "one-third":
				wr.width = sr.width * 0.333;
				wr.height = sr.height;
				break;
			case "one-quarter":
				wr.width = sr.width * 0.25;
				wr.height = sr.height;
				break;
			case "two-thirds":
				wr.width = sr.width * 0.667;
				wr.height = sr.height;
				break;
			case "three-quarters":
				wr.width = sr.width * 0.75;
				wr.height = sr.height;
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
		mode: {enumerable: true, value: function(mode) {
			return function(window) {
				S.log("[SLATE] mode: " + mode + "; window: " + window);
				if (window === undefined) return; // silently ignore when no window is defined.

				var wr = window.rect();
				var sr = window.screen().visibleRect();

				switch (mode) {
				case "full-screen":
					wr.width = sr.width;
					wr.height = sr.height;
					wr.y = sr.y;
					wr.x = sr.x;
					window.doop("move", wr);
					break;

				case "width-third":
					wr.width = sr.width * 0.333;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "width-half":
					wr.width = sr.width * 0.5;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "width-two-thirds":
					wr.width = sr.width * 0.667;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "width-full":
					wr.width = sr.width;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;

				case "height-third":
					wr.height = sr.height * 0.333;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "height-half":
					wr.height = sr.height * 0.5;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "height-two-thirds":
					wr.height = sr.height * 0.667;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "height-full":
					wr.height = sr.height;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;

				case "top":
					wr.y = sr.y;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "right":
					wr.x = sr.x + sr.width - wr.width;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "bottom":
					wr.y = sr.y + sr.height - wr.height;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "left":
					wr.x = sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;

				case "left-half":
					wr.width = sr.width * 0.5;
					wr.height = sr.height;
					wr.y = sr.y;
					wr.x = sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "right-half":
					wr.width = sr.width * 0.5;
					wr.height = sr.height;
					wr.y = sr.y;
					wr.x = sr.x + sr.width - wr.width;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;

				case "left-third":
					wr.width = sr.width * 0.333;
					wr.height = sr.height;
					wr.y = sr.y;
					wr.x = sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "left-two-thirds":
					wr.width = sr.width * 0.667;
					wr.height = sr.height;
					wr.y = sr.y;
					wr.x = sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "middle-third":
					wr.width = sr.width * 0.333;
					wr.height = sr.height;
					wr.y = sr.y;
					wr.x = sr.width * 0.333 + sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "right-third":
					wr.width = sr.width * 0.333;
					wr.height = sr.height;
					wr.y = sr.y;
					wr.x = sr.x + sr.width - wr.width;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "right-two-thirds":
					wr.width = sr.width * 0.667;
					wr.height = sr.height;
					wr.y = sr.y;
					wr.x = sr.width * 0.333 + sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;

				case "top-third":
					wr.width = sr.width;
					wr.height = sr.height * 0.333;
					wr.y = sr.y;
					wr.x = sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "top-half":
					wr.width = sr.width;
					wr.height = sr.height * 0.5;
					wr.y = sr.y;
					wr.x = sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "top-two-thirds":
					wr.width = sr.width;
					wr.height = sr.height * 0.667;
					wr.y = sr.y;
					wr.x = sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;

				case "bottom-third":
					wr.width = sr.width;
					wr.height = sr.height * 0.333;
					wr.y = sr.y + sr.height - wr.height;
					wr.x = sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "bottom-half":
					wr.width = sr.width;
					wr.height = sr.height * 0.5;
					wr.y = sr.y + sr.height - wr.height;
					wr.x = sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;
				case "bottom-two-thirds":
					wr.width = sr.width;
					wr.height = sr.height * 0.667;
					wr.y = sr.y + sr.height - wr.height;
					wr.x = sr.x;
					window.doop("move", KS.restrictRectToVisible(wr, sr));
					break;

				default:
					S.log("[SLATE] cannot perform unknown mode operation: " + mode);
					break;
				}
			};
		}},
		position: {value: function (param, wr, sr) {
			switch (param) {
			case "top-left":
				wr.x = sr.x;
				wr.y = sr.y;
				break;
			case "top-center":
				wr.x = (sr.width - wr.width) * 0.5 + sr.x;
				wr.y = sr.y;
				break;
			case "top-right":
				wr.x = sr.x + sr.width - wr.width;
				wr.y = sr.y;
				break;
			case "middle-left":
				wr.x = sr.x;
				wr.y = (sr.height - wr.height) * 0.5 + sr.y;
				break;
			case "middle-center":
				wr.x = (sr.width - wr.width) * 0.5 + sr.x;
				wr.y = (sr.height - wr.height) * 0.5 + sr.y;
				break;
			case "middle-right":
				wr.x = sr.x + sr.width - wr.width;
				wr.y = (sr.height - wr.height) * 0.5 + sr.y;
				break;
			case "bottom-left":
				wr.x = sr.x;
				wr.y = sr.y + sr.height - wr.height;
				break;
			case "bottom-center":
				wr.x = (sr.width - wr.width) * 0.5 + sr.x;
				wr.y = sr.y + sr.height - wr.height;
				break;
			case "bottom-right":
				wr.x = sr.x + sr.width - wr.width;
				wr.y = sr.y + sr.height - wr.height;
				break;
			default:
				S.log("[SLATE] cannot move in unknown direction: " + param);
			}
			return wr;
		}},
		register: {enumerable: true, value: function (op, keystrokes) {
			keystrokes.forEach(function (keystroke) {
				S.bind(keystroke, op);
			});
		}},
		resize: {value: function (param, wr, sr, dx, dy) {
			switch (param) {
			case "grow":
				wr.x -= dx;
				wr.width += dx * 2;
				wr.y -= dy;
				wr.height += dy * 2;
				break;
			case "grow-horizontal":
				wr.x -= dx;
				wr.width += dx * 2;
				break;
			case "grow-vertical":
				wr.y -= dy;
				wr.height += dy * 2;
				break;
			case "shrink":
				wr.x += dx;
				wr.width -= dx * 2;
				wr.y += dy;
				wr.height -= dy * 2;
				break;
			case "shrink-horizontal":
				wr.x += dx;
				wr.width -= dx * 2;
				break;
			case "shrink-vertical":
				wr.y += dy;
				wr.height -= dy * 2;
				break;
			case "full-height":
				wr.height = sr.height;
				break;
			case "half-height":
				wr.height = sr.height * 0.5;
				break;
			case "full-width":
				wr.width = sr.width;
				break;
			case "half-width":
				wr.width = sr.width * 0.5;
				break;
			default:
				S.log("[SLATE] cannot resize in unknown direction: " + param);
			}
			return wr;
		}},
		restrictRectToVisible: {value: function (wr, sr) {
			if (wr.x < sr.x) wr.x = sr.x;
			if (wr.y < sr.y) wr.y = sr.y;
			if (wr.width > sr.width) wr.width = sr.width;
			if (wr.height > sr.height) wr.height = sr.height;

			var maxX = sr.x + sr.width - wr.width;
			if (wr.x > maxX) wr.x = maxX;

			var maxY = sr.y + sr.height - wr.height;
			if (wr.y > maxY) wr.y = maxY;

			return wr;
		}},
		snapWhenDone: {value: function (wr, sr, someFunction) {
			var edge = KS.whichEdge(wr, sr);
			wr = someFunction(wr);
			if (edge !== undefined && edge !== '') {
				if (edge.indexOf("top") !== -1) wr.y = sr.y;
				if (edge.indexOf("left") !== -1) wr.x = sr.x;
				if (edge.indexOf("bottom") !== -1) wr.y = (sr.y + sr.height) - wr.height;
				if (edge.indexOf("right") !== -1) wr.x = (sr.x + sr.width) - wr.width;
			}
			return wr;
		}},
		whichEdge: {value: function (wr, sr) {
			// RESULT: top|topleft|topright|bottom|bottomleft|bottomright|left|right
			var snapTolerance = 25;
			var result = '';
			// snapTop takes priority over snapBottom
			if (wr.y <= sr.y + snapTolerance) {
				result = 'top';
			} else if (wr.y + wr.height + snapTolerance >= sr.y + sr.height) {
				result = 'bottom';
			}
			// snapLeft takes priority over snapRight
			if (wr.x <= sr.x + snapTolerance) {
				result += 'left';
			} else if (wr.x + wr.width + snapTolerance >= sr.x + sr.width) {
				result += 'right';
			}
			return result;
		}}
	});
}(KS, S));
