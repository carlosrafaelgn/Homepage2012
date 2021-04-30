//
// Transformation.js is distributed under the FreeBSD License
//
// Copyright (c) 2012, Carlos Rafael Gimenes das Neves
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
// http://carlosrafaelgn.com.br/WebGL/Transformation.js
//
"use strict";

function Transformation(parentList, type, x, y, z) {
	this.m = ["1", "0", "0", "0", "0", "1", "0", "0", "0", "0", "1", "0", "0", "0", "0", "1"];
	this.element = null;
	this.parentList = parentList;
	switch (type) {
		case 0:
			this.toString = Transformation.prototype.toStringT;
			this.toLocaleString = Transformation.prototype.toStringT;
			this.apply = Transformation.prototype.applyT;
			this.m[12] = x.toString();
			this.m[13] = y.toString();
			this.m[14] = z.toString();
			break;
		case 1:
			this.toString = Transformation.prototype.toStringS;
			this.toLocaleString = Transformation.prototype.toStringS;
			this.apply = Transformation.prototype.applyS;
			this._x = (x / 100) - 1;
			this._y = (y / 100) - 1;
			this._z = (z / 100) - 1;
			this.m[0] = (((x % 100) | 0) ? (x / 100).toFixed(2) : ((x / 100) | 0).toString());
			this.m[5] = (((y % 100) | 0) ? (y / 100).toFixed(2) : ((y / 100) | 0).toString());
			this.m[10] = (((z % 100) | 0) ? (z / 100).toFixed(2) : ((z / 100) | 0).toString());
			break;
		case 2:
			this.toString = Transformation.prototype.toStringRX;
			this.toLocaleString = Transformation.prototype.toStringRX;
			this.apply = Transformation.prototype.applyRX;
			this._x = x * 0.01745329251994329576923690768489;
			this.m[5] = "cos(" + x + "°)";
			this.m[6] = "sen(" + x + "°)";
			this.m[9] = "-sen(" + x + "°)";
			this.m[10] = "cos(" + x + "°)";
			break;
		case 3:
			this.toString = Transformation.prototype.toStringRY;
			this.toLocaleString = Transformation.prototype.toStringRY;
			this.apply = Transformation.prototype.applyRY;
			this._x = x * 0.01745329251994329576923690768489;
			this.m[0] = "cos(" + x + "°)";
			this.m[2] = "-sen(" + x + "°)";
			this.m[8] = "sen(" + x + "°)";
			this.m[10] = "cos(" + x + "°)";
			break;
		case 4:
			this.toString = Transformation.prototype.toStringRZ;
			this.toLocaleString = Transformation.prototype.toStringRZ;
			this.apply = Transformation.prototype.applyRZ;
			this._x = x * 0.01745329251994329576923690768489;
			this.m[0] = "cos(" + x + "°)";
			this.m[1] = "sen(" + x + "°)";
			this.m[4] = "-sen(" + x + "°)";
			this.m[5] = "cos(" + x + "°)";
			break;
	}
	this.type = type;
	this.x = x;
	this.y = y;
	this.z = z;
}
Transformation.prototype = {
	clone: function () {
		return new Transformation(this.parentList, this.type, this.x, this.y, this.z);
	},
	toStringT: function () {
		return "Translação (" + this.x + ", " + this.y + ", " + this.z + ")";
	},
	toStringS: function () {
		return "Redimensionamento (" + this.x + "%, " + this.y + "%, " + this.z + "%)";
	},
	toStringRX: function () {
		return "Rotação X (" + this.x + "°)";
	},
	toStringRY: function () {
		return "Rotação Y (" + this.x + "°)";
	},
	toStringRZ: function () {
		return "Rotação Z (" + this.x + "°)";
	},
	applyT: function (matrix, step) {
		return matrix.translate(this.x * step, this.y * step, this.z * step);
	},
	applyS: function (matrix, step) {
		return matrix.scale((this._x * step) + 1, (this._y * step) + 1, (this._z * step) + 1);
	},
	applyRX: function (matrix, step) {
		return matrix.rotateX(this._x * step);
	},
	applyRY: function (matrix, step) {
		return matrix.rotateY(this._x * step);
	},
	applyRZ: function (matrix, step) {
		return matrix.rotateZ(this._x * step);
	},
	div_Click: function () {
		this.t.parentList.setSelectedItem(this.t);
		return true;
	},
	getElement: function () {
		if (!this.element) {
			var el = document.createElement("div"), m = this.m;
			el.className = "MAT";
			el.style.cursor = "pointer";
			el.t = this;
			attachMouse(el, "click", Transformation.prototype.div_Click);
			el.innerHTML = "<div class=\"MATL\"><br /><br /><br />&nbsp;</div><div class=\"MATC\">" + m[0] + "<br />" + m[1] + "<br />" + m[2] + "<br />" + m[3] + "</div><div class=\"MATC\">" + m[4] + "<br />" + m[5] + "<br />" + m[6] + "<br />" + m[7] + "</div><div class=\"MATC\">" + m[8] + "<br />" + m[9] + "<br />" + m[10] + "<br />" + m[11] + "</div><div class=\"MATC\">" + m[12] + "<br />" + m[13] + "<br />" + m[14] + "<br />" + m[15] + "</div><div class=\"MATR\"><br /><br /><br />&nbsp;</div>"; //<div class=\"MATC\"><br />×<br /><br />&nbsp;</div>";
			this.element = el;
		}
		return this.element;
	}
};
