//
// SpriteControl.js is distributed under the FreeBSD License
//
// Copyright (c) 2013, Carlos Rafael Gimenes das Neves
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met: 
//
// 1. Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer. 
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution. 
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those
// of the authors and should not be interpreted as representing official policies, 
// either expressed or implied, of the FreeBSD Project.
//
// http://carlosrafaelgn.com.br/Aula/SpriteControl.js
//
"use strict";

function Frame(width, height, sourceX, sourceY, originX, originY) {
	this.width = width;
	this.height = height;
	this.sourceX = sourceX;
	this.sourceY = sourceY;
	this.originX = originX;
	this.originY = originY;
	this.offsetX = -originX;
	this.offsetY = -originY;
	Object.freeze(this);
}
var SpriteUtils = {
	fullFrame: function (image, frameOriginX, frameOriginY) {
		var w = parseInt(image.width), h = parseInt(image.height);
		return [new Frame(
			w,
			h,
			0,
			0,
			((frameOriginX === undefined || frameOriginX === null) ? (w >>> 1) : frameOriginX),
			((frameOriginY === undefined || frameOriginY === null) ? (h >>> 1) : frameOriginY))];
	},
	singleFrame: function (frameWidth, frameHeight, sourceX, sourceY, frameOriginX, frameOriginY) {
		return [new Frame(
			frameWidth,
			frameHeight,
			(sourceX || 0),
			(sourceY || 0),
			((frameOriginX === undefined || frameOriginX === null) ? (frameWidth >>> 1) : frameOriginX),
			((frameOriginY === undefined || frameOriginY === null) ? (frameHeight >>> 1) : frameOriginY))];
	},
	framesByColumns: function (frameWidth, frameHeight, totalFrameCount, columnCount, sourceX, sourceY, frameOriginX, frameOriginY) {
		var ix = (sourceX || 0), x = ix, y = (sourceY || 0), i, frames = new Array(totalFrameCount), c = 0,
			ox = ((frameOriginX === undefined || frameOriginX === null) ? (frameWidth >>> 1) : frameOriginX),
			oy = ((frameOriginY === undefined || frameOriginY === null) ? (frameHeight >>> 1) : frameOriginY);
		for (i = 0; i < totalFrameCount; i++) {
			frames[i] = new Frame(frameWidth, frameHeight, x, y, ox, oy);
			c++;
			if (c >= columnCount) {
				c = 0;
				x = ix;
				y += frameHeight;
			} else {
				x += frameWidth;
			}
		}
		Object.freeze(frames);
		return frames;
	},
	framesByRows: function (frameWidth, frameHeight, totalFrameCount, rowCount, sourceX, sourceY, frameOriginX, frameOriginY) {
		var x = (sourceX || 0), iy = (sourceY || 0), y = iy, i, frames = new Array[totalFrameCount], c = 0,
			ox = ((frameOriginX === undefined || frameOriginX === null) ? (frameWidth >>> 1) : frameOriginX),
			oy = ((frameOriginY === undefined || frameOriginY === null) ? (frameHeight >>> 1) : frameOriginY);
		for (i = 0; i < totalFrameCount; i++) {
			frames[i] = new Frame(frameWidth, frameHeight, x, y, ox, oy);
			c++;
			if (c >= rowCount) {
				c = 0;
				x += frameWidth;
				y = iy;
			} else {
				y += frameHeight;
			}
		}
		Object.freeze(frames);
		return frames;
	},
	loadImages: function (callback, images) {
		var i, img, idxS, idxE, n, imagesDone, imageCount, onload, onerror, imgsarr, imgs = {};
		if (typeof images === "string") {
			i = 1;
			imgsarr = arguments;
		} else {
			i = 0;
			imgsarr = images;
		}
		onload = function () {
			if (this.alt && this.alt.length > 0) {
				imgs[this.alt] = this;
				this.alt = "";
				imagesDone++;
				if (imagesDone >= imageCount) {
					imagesDone = imageCount;
					callback(1, imgs);
				} else {
					callback(imagesDone / imageCount, null);
				}
			}
			return true;
		};
		onerror = function () {
			if (this.alt && this.alt.length > 0) {
				this.alt = "";
				imagesDone++;
				if (imagesDone >= imageCount) {
					imagesDone = imageCount;
					callback(1, imgs);
				} else {
					callback(imagesDone / imageCount, null);
				}
			}
			return true;
		};
		imagesDone = 0;
		imageCount = imgsarr.length - i;
		for (; i < imgsarr.length; i++) {
			n = imgsarr[i];
			idxS = n.lastIndexOf("/");
			idxS = ((idxS < 0) ? 0 : (idxS + 1));
			idxE = n.lastIndexOf(".");
			n = ((idxE > idxS) ? n.substring(idxS, idxE) : n.substring(idxS));
			img = new Image();
			img.alt = n;
			img.onload = onload;
			img.onabort = onerror;
			img.onerror = onerror;
			imgs[n] = null;
			img.src = imgsarr[i];
		}
		return true;
	}
};
Object.freeze(SpriteUtils);
window.Sprite = (function () {
	function createCopy() {
		var s = new Sprite(this.image, this.frames);
		s.fps = this.fps;
		s.currentFrame = this.currentFrame;
		s.x = this.x;
		s.y = this.y;
		s.scaleX = this.scaleX;
		s.scaleY = this.scaleY;
		s.opacity = this.opacity;
		s.animationType = this.animationType;
		if ("pingPongFrame" in this)
			s.pingPongFrame = this.pingPongFrame;
		if (this.rotation)
			s.rotationDeg = this.rotationDeg;
		return s;
	}
	function createNew() {
		var s = new Sprite(this.image, this.frames), a = this.animationType;
		if (a) s.animationType = a;
		return s;
	}
	function animateLooping(deltaTime) {
		var f = this.currentFrame + (this.fps * deltaTime), count = this.frames.length;
		while (f >= count)
			f -= count;
		this.currentFrame = f;
		return true;
	}
	function animatePingPong(deltaTime) {
		var f = this.pingPongFrame + (this.fps * deltaTime), count = this.frames.length, count2 = count + count - 2;
		while (f >= count2)
			f -= count2;
		this.pingPongFrame = f;
		this.currentFrame = ((f < count) ? f : (count2 - f + 1));
		return true;
	}
	function animateOneShot(deltaTime) {
		var f = this.currentFrame + (this.fps * deltaTime), count = this.frames.length;
		if (f >= count) f = count - 1;
		this.currentFrame = f;
		return true;
	}
	function toObjectSpace(worldX, worldY) {
		var nx, ny, a, b, c, d, rec;
		if (this.rotation) {
			//convert x and y from world space into object space
			nx = worldX - this.x;
			ny = worldY - this.y;
			//now compensate for scaling and rotation
			//w = o.Mo
			//o = w.Inv(Mo)
			//instead of inverting the entire 3x3 matrix,
			//only the 2x2 left-top area of the matrix will be inverted
			//(3rd row will be disconsidered since it only stores the offset)
			//http://mathworld.wolfram.com/MatrixInverse.html
			b = this.scaleX;
			a = b * this.m11;
			b *= this.m21;
			d = this.scaleY;
			c = d * this.m12;
			d *= this.m22;
			rec = 1 / ((a * d) - (b * c));
			return {
				x: (((nx * d) - (ny * c)) * rec),
				y: (((ny * a) - (nx * b)) * rec)
			};
		}
		return { x: (worldX - this.x), y: (worldY - this.y) };
	}
	function toWorldSpace(objectX, objectY) {
		var sx, sy;
		if (this.rotation) {
			//| x | = | m11 m12 |   | objectX |
			//| y | = | m21 m22 | . | objectY |
			sx = this.scaleX;
			sy = this.scaleY;
			return {
				x: ((objectX * sx * this.m11) + (objectY * sy * this.m12)) + this.x,
				y: ((objectX * sx * this.m21) + (objectY * sy * this.m22)) + this.y
			};
		}
		return { x: (objectX + this.x), y: (objectY + this.y) };
	}
	function containsPoint(worldX, worldY) {
		var nx, ny, x, a, b, c, d, rec, f = this.frames[this.currentFrame];
		if (this.rotation) {
			//check out the comments at toObjectSpace
			x = worldX - this.x;
			ny = worldY - this.y;
			b = this.scaleX;
			a = b * this.m11;
			b *= this.m21;
			d = this.scaleY;
			c = d * this.m12;
			d *= this.m22;
			rec = 1 / ((a * d) - (b * c));
			//f.originX and f.originY are used to convert x and y from object space into frame space
			nx = (((x * d) - (ny * c)) * rec) + f.originX;
			ny = f.originY - (((ny * a) - (x * b)) * rec);
		} else {
			nx = worldX - this.x + f.originX;
			ny = f.originY - (worldY - this.y);
		}
		return (nx >= 0 && nx < f.width && ny >= 0 && ny < f.height);
	}
	function prepareGettersSetters(mthis) {
		var deg = 0, anim = 0;
		Object.defineProperty(mthis, "rotationDeg", {
			get: function () { return deg; },
			set: function (x) {
				deg = x;
				while (deg >= 360)
					deg -= 360;
				while (deg <= -360)
					deg += 360;
				var r = deg * -0.01745329251994329576923690768489, c = Math.cos(r), s = Math.sin(r); //(PI / 180)
				this.rotation = -r;
				this.m11 = c;
				this.m12 = s;
				this.m21 = -s;
				this.m22 = c;
				return true;
			}
		});
		Object.defineProperty(mthis, "animationType", {
			get: function () { return anim; },
			set: function (x) {
				switch (x) {
					case 1:
						this.pingPongFrame = this.currentFrame;
						anim = 1;
						this.animate = animatePingPong;
						break;
					case 2:
						if ("pingPongFrame" in this) delete this.pingPongFrame;
						anim = 2;
						this.animate = animateOneShot;
						break;
					default:
						if ("pingPongFrame" in this) delete this.pingPongFrame;
						anim = 0;
						this.animate = animateLooping;
						break;
				}
				return true;
			}
		});
		return true;
	}
	var ret = function (image, frames) {
		this.image = image;
		this.frames = frames;
		this.fps = 0;
		this.currentFrame = 0;
		this.x = 0;
		this.y = 0;
		this.rotation = 0;
		//m[column][row]
		this.m11 = 1;
		this.m12 = 0;
		this.m21 = 0;
		this.m22 = 1;
		this.scaleX = 1;
		this.scaleY = 1;
		this.opacity = 1;
		this.createCopy = createCopy;
		this.createNew = createNew;
		this.containsPoint = containsPoint;
		this.toObjectSpace = toObjectSpace;
		this.toWorldSpace = toWorldSpace;
		prepareGettersSetters(this);
		this.animationType = 0;
	};
	ret.AnimationLooping = 0;
	ret.AnimationPingPong = 1;
	ret.AnimationOneShot = 2;
	return ret;
})();
window.SpriteControl = (function () {
	var isTouch = (("ontouchend" in document) ? true : false),
		cancelEvent = function (e) {
			if (e.stopPropagation)
				e.stopPropagation();
			if (e.preventDefault)
				e.preventDefault();
			if (e.cancelBubble !== undefined)
				e.cancelBubble = true;
			if (e.cancel !== undefined)
				e.cancel = true;
			//if (e.returnValue !== undefined)
			//	e.returnValue = false;
			return false;
		},
		leftTop = function (element) {
			var left, top;
			if (element.getBoundingClientRect) {
				left = element.getBoundingClientRect();
				top = left.top + window.pageYOffset;
				left = left.left + window.pageXOffset;
			} else {
				left = 0;
				top = 0;
				while (element) {
					left += element.offsetLeft;
					top += element.offsetTop;
					element = element.offsetParent;
				}
			}
			return [left, top];
		},
		attachObserver = function (observable, eventName, targetFunction, capturePhase) {
			return observable.addEventListener(eventName, targetFunction, capturePhase ? true : false);
		},
		detachObserver = function (observable, eventName, targetFunction, capturePhase) {
			return observable.removeEventListener(eventName, targetFunction, capturePhase ? true : false);
		},
		touchMouse = (isTouch ? {
			_cloneEvent: function (e, cx, cy, px, py) {
				var c = { button: 0, target: e.target, eventPhase: e.eventPhase, clientX: cx, clientY: cy, pageX: px, pageY: py };
				if (e.stopPropagation) c.stopPropagation = function () { return e.stopPropagation(); };
				if (e.preventDefault) c.preventDefault = function () { return e.preventDefault(); };
				if (e.cancelBubble !== undefined) c.cancelBubble = e.cancelBubble;
				if (e.cancel !== undefined) c.cancel = e.cancel;
				//if (e.returnValue !== undefined) c.returnValue = e.returnValue;
				return c;
			},
			_terminateEvent: function (e, c) {
				if (c.cancelBubble) e.cancelBubble = c.cancelBubble;
				if (c.cancel) e.cancel = c.cancel;
				//if (e.returnValue !== undefined) e.returnValue = c.returnValue;
				return c;
			},
			_touchstartc: function (e) {
				return touchMouse.touchstart(this, "_tc", e);
			},
			_touchstart: function (e) {
				return touchMouse.touchstart(this, "_t", e);
			},
			touchstart: function (t, p, e) {
				if (e.touches.length > 1) return;
				if (t._tstate) touchMouse.touchend(t, p, e);
				t._tstate = true;
				var i, l, c = touchMouse._cloneEvent(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
				l = t[p + "mouseover"];
				if (l) {
					for (i = l.length - 1; i >= 0; i--)
						l[i].call(t, c);
				}
				l = t[p + "mousedown"];
				if (l) {
					for (i = l.length - 1; i >= 0; i--)
						l[i].call(t, c);
				}
				touchMouse._terminateEvent(e, c);
			},
			_touchmovec: function (e) {
				return touchMouse.touchmove(this, "_tc", e);
			},
			_touchmove: function (e) {
				return touchMouse.touchmove(this, "_t", e);
			},
			touchmove: function (t, p, e) {
				if (e.touches.length > 1) return;
				var i, l = t[p + "mousemove"], c = touchMouse._cloneEvent(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
				if (l) {
					for (i = l.length - 1; i >= 0; i--)
						l[i].call(t, c);
				}
				touchMouse._terminateEvent(e, c);
			},
			_touchendc: function (e) {
				return touchMouse.touchend(this, "_tc", e);
			},
			_touchend: function (e) {
				return touchMouse.touchend(this, "_t", e);
			},
			touchend: function (t, p, e) {
				//if (t._tstate) {
				//e.preventDefault();
				t._tstate = false;
				var i, l, c = ((e.changedTouches && e.changedTouches.length >= 1) ? touchMouse._cloneEvent(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY, e.changedTouches[0].pageX, e.changedTouches[0].pageY) : touchMouse._cloneEvent(e, 0, 0, 0, 0));
				l = t[p + "mouseup"];
				if (l) {
					for (i = l.length - 1; i >= 0; i--)
						l[i].call(t, c);
				}
				l = t[p + "mouseout"];
				if (l) {
					for (i = l.length - 1; i >= 0; i--)
						l[i].call(t, c);
				}
				touchMouse._terminateEvent(e, c);
				//}
			}
		} : undefined),
	attachMouse = (isTouch ? function (observable, eventName, targetFunction, capturePhase) {
		var e;
		if (eventName === "click") {
			attachObserver(observable, eventName, targetFunction, capturePhase);
		} else if (eventName === "mousemove") {
			e = (capturePhase ? "_tc" : "_t") + eventName;
			if (!observable[e]) {
				observable[e] = [targetFunction];
				attachObserver(observable, "touchmove", capturePhase ? touchMouse._touchmovec : touchMouse._touchmove, capturePhase);
			} else {
				observable[e].push(targetFunction);
			}
		} else {
			e = (capturePhase ? "_tc" : "_t");
			if (!observable[e]) {
				observable[e] = 1;
				attachObserver(observable, "touchstart", capturePhase ? touchMouse._touchstartc : touchMouse._touchstart, capturePhase);
				attachObserver(observable, "touchend", capturePhase ? touchMouse._touchendc : touchMouse._touchend, capturePhase);
				attachObserver(observable, "touchcancel", capturePhase ? touchMouse._touchendc : touchMouse._touchend, capturePhase);
			} else {
				observable[e]++;
			}
			e += eventName;
			if (!observable[e]) {
				observable[e] = [targetFunction];
			} else {
				observable[e].push(targetFunction);
			}
		}
		return true;
	} : attachObserver),
	detachMouse = (isTouch ? function (observable, eventName, targetFunction, capturePhase) {
		var i, l, p, e;
		if (eventName === "click") {
			detachObserver(observable, eventName, targetFunction, capturePhase);
		} else if (eventName === "mousemove") {
			e = (capturePhase ? "_tc" : "_t") + eventName;
			l = observable[e];
			if (l) {
				for (i = l.length - 1; i >= 0; i--) {
					if (l[i] === targetFunction) {
						if (l.length === 1) {
							delete observable[e];
							detachObserver(observable, "touchmove", capturePhase ? touchMouse._touchmovec : touchMouse._touchmove, capturePhase);
						} else {
							l.splice(i, 1);
						}
						break;
					}
				}
			}
		} else {
			p = (capturePhase ? "_tc" : "_t");
			e = p + eventName;
			i = -1;
			l = observable[e];
			if (l) {
				for (i = l.length - 1; i >= 0; i--) {
					if (l[i] === targetFunction) {
						if (l.length === 1) {
							delete observable[e];
						} else {
							l.splice(i, 1);
						}
						break;
					}
				}
			}
			if (i >= 0) {
				if (observable[p] > 1) {
					observable[p]--;
				} else {
					delete observable[p];
					detachObserver(observable, "touchstart", capturePhase ? touchMouse._touchstartc : touchMouse._touchstart, capturePhase);
					detachObserver(observable, "touchend", capturePhase ? touchMouse._touchendc : touchMouse._touchend, capturePhase);
					detachObserver(observable, "touchcancel", capturePhase ? touchMouse._touchendc : touchMouse._touchend, capturePhase);
				}
			}
		}
		return true;
	} : detachObserver);
	return function (placeholderId, width, height) {
		var mthis = this, i = document.getElementById(placeholderId), mouseMove, mouseUp,
			lastKeyCode = -1, ROTATION_COEF = -0.01745329251994329576923690768489; //(-PI / 180)
		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;
		this.canvas.tabIndex = 0;
		this.canvas.style.outline = "0px none transparent";
		this.canvas.style.border = "0px none transparent";
		this.canvas.style.margin = "0px";
		this.canvas.style.padding = "0px";
		this.canvas.style.verticalAlign = "bottom";
		this.context = this.canvas.getContext("2d");
		i.parentNode.replaceChild(this.canvas, i);
		i = function dummy(e) { return true; };
		this.viewX = 0; //viewX and viewY indicate which virtual coordinate will be present at the bottom/left corner
		this.viewY = 0;
		this.onclick = i;
		this.onmousedown = i;
		this.onmouseup = i;
		this.onmousemove = i;
		this.onkeydown = i;
		this.onkeyup = i;
		this.focus = function () {
			return this.canvas.focus();
		};
		this.resetContext = function () {
			this.context.globalCompositeOperation = "source-over";
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			this.context.globalAlpha = 1;
			return true;
		};
		this.resetAndClearContext = function () {
			this.context.globalCompositeOperation = "source-over";
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			this.context.globalAlpha = 1;
			this.context.clearRect(0, 0, width, height);
			return true;
		};
		this.setLightMode = function (isLightMode) {
			this.context.globalCompositeOperation = (isLightMode ? "lighter" : "source-over");
			return true;
		};
		this.toWorldSpace = function (viewX, viewY) { return { x: viewX + this.viewX, y: viewY + this.viewY }; };
		this.toViewSpace = function (worldX, worldY) { return { x: worldX - this.viewX, y: worldY - this.viewY }; };
		this.drawSprite = function (sprite) {
			var ctx = this.context, frame = sprite.frames[sprite.currentFrame | 0], sx = sprite.scaleX, sy = sprite.scaleY;
			if (sprite.rotation)
				ctx.setTransform(sx * sprite.m11, sx * sprite.m12, sy * sprite.m21, sy * sprite.m22, sprite.x - this.viewX, height - 1 - sprite.y + this.viewY);
			else
				ctx.setTransform(sx, 0, 0, sy, sprite.x - this.viewX, height - 1 - sprite.y + this.viewY);
			ctx.globalAlpha = sprite.opacity;
			return ctx.drawImage(sprite.image, frame.sourceX, frame.sourceY, frame.width, frame.height, frame.offsetX, frame.offsetY, frame.width, frame.height);
		};
		this.drawSpriteFrame = function (sprite, frameIndex) {
			var ctx = this.context, frame = sprite.frames[frameIndex | 0], sx = sprite.scaleX, sy = sprite.scaleY;
			if (sprite.rotation)
				ctx.setTransform(sx * sprite.m11, sx * sprite.m12, sy * sprite.m21, sy * sprite.m22, sprite.x - this.viewX, height - 1 - sprite.y + this.viewY);
			else
				ctx.setTransform(sx, 0, 0, sy, sprite.x - this.viewX, height - 1 - sprite.y + this.viewY);
			ctx.globalAlpha = sprite.opacity;
			return ctx.drawImage(sprite.image, frame.sourceX, frame.sourceY, frame.width, frame.height, frame.offsetX, frame.offsetY, frame.width, frame.height);
		};
		this.drawStatic = function (sprite) {
			var ctx = this.context, frame = sprite.frames[sprite.currentFrame | 0], sx = sprite.scaleX, sy = sprite.scaleY;
			if (sprite.rotation)
				ctx.setTransform(sx * sprite.m11, sx * sprite.m12, sy * sprite.m21, sy * sprite.m22, sprite.x, height - 1 - sprite.y);
			else
				ctx.setTransform(sx, 0, 0, sy, sprite.x, height - 1 - sprite.y);
			ctx.globalAlpha = sprite.opacity;
			return ctx.drawImage(sprite.image, frame.sourceX, frame.sourceY, frame.width, frame.height, frame.offsetX, frame.offsetY, frame.width, frame.height);
		};
		this.drawStaticFrame = function (sprite, frameIndex) {
			var ctx = this.context, frame = sprite.frames[frameIndex | 0], sx = sprite.scaleX, sy = sprite.scaleY;
			if (sprite.rotation)
				ctx.setTransform(sx * sprite.m11, sx * sprite.m12, sy * sprite.m21, sy * sprite.m22, sprite.x, height - 1 - sprite.y);
			else
				ctx.setTransform(sx, 0, 0, sy, sprite.x, height - 1 - sprite.y);
			ctx.globalAlpha = sprite.opacity;
			return ctx.drawImage(sprite.image, frame.sourceX, frame.sourceY, frame.width, frame.height, frame.offsetX, frame.offsetY, frame.width, frame.height);
		};
		mouseMove = function (e) {
			var xy = leftTop(mthis.canvas);
			mthis.onmousemove(e.pageX - xy[0], height - 1 - e.pageY + xy[1]);
			return true;
		};
		mouseUp = function (e) {
			attachMouse(mthis.canvas, "mousemove", mouseMove, false);
			detachMouse(document, "mousemove", mouseMove, true);
			detachMouse(document, "mouseup", mouseUp, true);
			var xy = leftTop(mthis.canvas);
			mthis.onmouseup(e.pageX - xy[0], height - 1 - e.pageY + xy[1], e.button);
			return true;
		};
		attachObserver(this.canvas, "keydown", function (e) {
			var k = e.keyCode;
			if (k !== lastKeyCode) {
				lastKeyCode = k;
				mthis.onkeydown(k);
			}
			return true;
		}, false);
		attachObserver(this.canvas, "keyup", function (e) {
			var k = e.keyCode;
			if (k === lastKeyCode)
				lastKeyCode = -1;
			mthis.onkeyup(k);
			return true;
		}, false);
		attachObserver(this.canvas, "contextmenu", cancelEvent, false);
		attachMouse(this.canvas, "click", function (e) {
			var xy = leftTop(mthis.canvas);
			mthis.onclick(e.pageX - xy[0], height - 1 - e.pageY + xy[1], e.button);
			return cancelEvent(e);
		}, false);
		attachMouse(this.canvas, "mousedown", function (e) {
			detachMouse(mthis.canvas, "mousemove", mouseMove, false);
			attachMouse(document, "mousemove", mouseMove, true);
			attachMouse(document, "mouseup", mouseUp, true);
			mthis.canvas.focus();
			var xy = leftTop(mthis.canvas);
			mthis.onmousedown(e.pageX - xy[0], height - 1 - e.pageY + xy[1], e.button);
			return cancelEvent(e);
		}, false);
		attachMouse(this.canvas, "mousemove", mouseMove, false);
	};
})();
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback, element) { return window.setTimeout(function () { return callback(+new Date()); }, 1000 / 60); });
}
if (!window.cancelAnimationFrame) {
	window.cancelAnimationFrame = (window.webkitCancelAnimationFrame ||
		window.mozCancelAnimationFrame ||
		window.oCancelAnimationFrame ||
		window.msCancelAnimationFrame ||
		function (id) { return window.clearTimeout(id); });
}
if (!Date.now) {
	Date.now = function () {
		return (+new Date());
	};
}
