//
// Matrix4.js is distributed under the FreeBSD License
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
// http://carlosrafaelgn.com.br/WebGL/Matrix4.js
//
"use strict";

function Matrix4(emptyOrOriginal) {
	this.m = ((emptyOrOriginal && (emptyOrOriginal.length === 16)) ? new Float32Array(emptyOrOriginal) : new Float32Array(emptyOrOriginal ? 16 : [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
}
Matrix4.prototype = {
	//Column-major order
	//0..3 = column 1
	//4..7 = column 2
	//8..11 = column 3
	//12..15 = column 4
	setUniform: function (context, location) {
		context.uniformMatrix4fv(location, false, this.m);
		return this;
	},
	clone: function () {
		return new Matrix4(this.m);
	},
	copy: function (matrix) {
		this.m.set(matrix.m);
		return this;
	},
	identity: function () {
		var m = this.m;
		m[0] = 1;
		m[1] = 0;
		m[2] = 0;
		m[3] = 0;
		m[4] = 0;
		m[5] = 1;
		m[6] = 0;
		m[7] = 0;
		m[8] = 0;
		m[9] = 0;
		m[10] = 1;
		m[11] = 0;
		m[12] = 0;
		m[13] = 0;
		m[14] = 0;
		m[15] = 1;
		return this;
	},
	make3x3: function () {
		var m = this.m;
		m[3] = 0;
		m[7] = 0;
		m[11] = 0;
		m[12] = 0;
		m[13] = 0;
		m[14] = 0;
		m[15] = 1;
		return this;
	},
	det3: function () {
		//based on: http://en.wikipedia.org/wiki/Inverse_matrix
		var m = this.m,
		a = m[0], b = m[4], c = m[8],
		d = m[1], e = m[5], f = m[9],
		g = m[2], h = m[6], i = m[10];
		return ((a * ((e * i) - (f * h))) + (b * ((f * g) - (i * d))) + (c * ((d * h) - (e * g))));
	},
	invert3: function () {
		//based on: http://en.wikipedia.org/wiki/Inverse_matrix
		var m = this.m,
		a = m[0], b = m[4], c = m[8],
		d = m[1], e = m[5], f = m[9],
		g = m[2], h = m[6], i = m[10], invdet = 1 / ((a * ((e * i) - (f * h))) + (b * ((f * g) - (i * d))) + (c * ((d * h) - (e * g))));
		m[0] = ((e * i) - (f * h)) * invdet;
		m[1] = ((f * g) - (d * i)) * invdet;
		m[2] = ((d * h) - (e * g)) * invdet;
		m[4] = ((c * h) - (b * i)) * invdet;
		m[5] = ((a * i) - (c * g)) * invdet;
		m[6] = ((g * b) - (a * h)) * invdet;
		m[8] = ((b * f) - (c * e)) * invdet;
		m[9] = ((c * d) - (a * f)) * invdet;
		m[10] = ((a * e) - (b * d)) * invdet;
		return this;
	},
	multiplyVector: function (v) {
		//v = this * v
		var m = this.m, v0 = v[0], v1 = v[1], v2 = v[2], v3 = v[3];
		v[0] = (m[0] * v0) + (m[4] * v1) + (m[8] * v2) + (m[12] * v3);
		v[1] = (m[1] * v0) + (m[5] * v1) + (m[9] * v2) + (m[13] * v3);
		v[2] = (m[2] * v0) + (m[6] * v1) + (m[10] * v2) + (m[14] * v3);
		v[3] = (m[3] * v0) + (m[7] * v1) + (m[11] * v2) + (m[15] * v3);
		return v;
	},
	multiplyVector3: function (v) {
		//v = this * v
		var m = this.m, v0 = v[0], v1 = v[1], v2 = v[2];
		v[0] = (m[0] * v0) + (m[4] * v1) + (m[8] * v2);
		v[1] = (m[1] * v0) + (m[5] * v1) + (m[9] * v2);
		v[2] = (m[2] * v0) + (m[6] * v1) + (m[10] * v2);
		return v;
	},
	multiply: function (matrix) {
		//this = this * matrix
		var m = this.m, om = matrix.m,
		a1 = m[0], b1 = m[4], c1 = m[8], d1 = m[12],
		a2 = om[0], b2 = om[4], c2 = om[8], d2 = om[12],
		e2 = om[1], f2 = om[5], g2 = om[9], h2 = om[13],
		i2 = om[2], j2 = om[6], k2 = om[10], l2 = om[14],
		m2 = om[3], n2 = om[7], o2 = om[11], p2 = om[15];
		m[0] = (a1 * a2) + (b1 * e2) + (c1 * i2) + (d1 * m2);
		m[4] = (a1 * b2) + (b1 * f2) + (c1 * j2) + (d1 * n2);
		m[8] = (a1 * c2) + (b1 * g2) + (c1 * k2) + (d1 * o2);
		m[12] = (a1 * d2) + (b1 * h2) + (c1 * l2) + (d1 * p2);
		a1 = m[1]; b1 = m[5]; c1 = m[9]; d1 = m[13];
		m[1] = (a1 * a2) + (b1 * e2) + (c1 * i2) + (d1 * m2);
		m[5] = (a1 * b2) + (b1 * f2) + (c1 * j2) + (d1 * n2);
		m[9] = (a1 * c2) + (b1 * g2) + (c1 * k2) + (d1 * o2);
		m[13] = (a1 * d2) + (b1 * h2) + (c1 * l2) + (d1 * p2);
		a1 = m[2]; b1 = m[6]; c1 = m[10]; d1 = m[14];
		m[2] = (a1 * a2) + (b1 * e2) + (c1 * i2) + (d1 * m2);
		m[6] = (a1 * b2) + (b1 * f2) + (c1 * j2) + (d1 * n2);
		m[10] = (a1 * c2) + (b1 * g2) + (c1 * k2) + (d1 * o2);
		m[14] = (a1 * d2) + (b1 * h2) + (c1 * l2) + (d1 * p2);
		a1 = m[3]; b1 = m[7]; c1 = m[11]; d1 = m[15];
		m[3] = (a1 * a2) + (b1 * e2) + (c1 * i2) + (d1 * m2);
		m[7] = (a1 * b2) + (b1 * f2) + (c1 * j2) + (d1 * n2);
		m[11] = (a1 * c2) + (b1 * g2) + (c1 * k2) + (d1 * o2);
		m[15] = (a1 * d2) + (b1 * h2) + (c1 * l2) + (d1 * p2);
		return this;
	},
	transpose: function () {
		var m = this.m, t;
		t = m[1];
		m[1] = m[4];
		m[4] = t;
		t = m[2];
		m[2] = m[8];
		m[8] = t;
		t = m[3];
		m[3] = m[12];
		m[12] = t;
		t = m[6];
		m[6] = m[9];
		m[9] = t;
		t = m[7];
		m[7] = m[13];
		m[13] = t;
		t = m[11];
		m[11] = m[14];
		m[14] = t;
		return this;
	},
	makeNormalMatrix: function () {
		//based on: http://www.songho.ca/opengl/gl_normaltransform.html
		//http://www.lighthouse3d.com/tutorials/glsl-tutorial/the-normal-matrix/
		//http://www.gamedev.net/topic/598985-gl-normalmatrix-in-glsl-how-to-calculate/
		//http://stackoverflow.com/questions/5823438/opengl-gl-normalmatrix
		//http://www.cs.uaf.edu/2007/spring/cs481/lecture/01_23_matrices.html

		//normalMatrix = matrix.invert3().make3x3().transpose();

		var m = this.m,
		a = m[0], b = m[4], c = m[8],
		d = m[1], e = m[5], f = m[9],
		g = m[2], h = m[6], i = m[10], invdet = 1 / ((a * ((e * i) - (f * h))) + (b * ((f * g) - (d * i))) + (c * ((d * h) - (e * g))));
		m[0] = ((e * i) - (f * h)) * invdet;
		m[4] = ((f * g) - (d * i)) * invdet;
		m[8] = ((d * h) - (e * g)) * invdet;
		m[12] = 0;
		m[1] = ((c * h) - (b * i)) * invdet;
		m[5] = ((a * i) - (c * g)) * invdet;
		m[9] = ((b * g) - (a * h)) * invdet;
		m[13] = 0;
		m[2] = ((b * f) - (c * e)) * invdet;
		m[6] = ((c * d) - (a * f)) * invdet;
		m[10] = ((a * e) - (b * d)) * invdet;
		m[14] = 0;
		m[3] = 0;
		m[7] = 0;
		m[11] = 0;
		m[15] = 1;
		return this;
	},
	translate: function (x, y, z) {
		//this = this * matrix
		var m = this.m;
		m[12] += (m[0] * x) + (m[4] * y) + (m[8] * z);
		m[13] += (m[1] * x) + (m[5] * y) + (m[9] * z);
		m[14] += (m[2] * x) + (m[6] * y) + (m[10] * z);
		m[15] += (m[3] * x) + (m[7] * y) + (m[11] * z);
		return this;
	},
	translateFromLeft: function (x, y, z) {
		//this = matrix * this
		var m = this.m,
		m3 = m[3], m7 = m[7], m11 = m[11], m15 = m[15];
		m[0] += x * m3;
		m[4] += x * m7;
		m[8] += x * m11;
		m[12] += x * m15;
		m[1] += y * m3;
		m[5] += y * m7;
		m[9] += y * m11;
		m[13] += y * m15;
		m[2] += z * m3;
		m[6] += z * m7;
		m[10] += z * m11;
		m[14] += z * m15;
		return this;
	},
	translateIdentity: function (x, y, z) {
		var m = this.m;
		m[0] = 1;
		m[1] = 0;
		m[2] = 0;
		m[3] = 0;
		m[4] = 0;
		m[5] = 1;
		m[6] = 0;
		m[7] = 0;
		m[8] = 0;
		m[9] = 0;
		m[10] = 1;
		m[11] = 0;
		m[12] = x;
		m[13] = y;
		m[14] = z;
		m[15] = 1;
		return this;
	},
	scale: function (x, y, z) {
		//this = this * matrix
		var m = this.m;
		m[0] *= x;
		m[1] *= x;
		m[2] *= x;
		m[3] *= x;
		m[4] *= y;
		m[5] *= y;
		m[6] *= y;
		m[7] *= y;
		m[8] *= z;
		m[9] *= z;
		m[10] *= z;
		m[11] *= z;
		return this;
	},
	scaleIdentity: function (x, y, z) {
		var m = this.m;
		m[0] = x;
		m[1] = 0;
		m[2] = 0;
		m[3] = 0;
		m[4] = 0;
		m[5] = y;
		m[6] = 0;
		m[7] = 0;
		m[8] = 0;
		m[9] = 0;
		m[10] = z;
		m[11] = 0;
		m[12] = 0;
		m[13] = 0;
		m[14] = 0;
		m[15] = 1;
		return this;
	},
	rotateX: function (radians) {
		//this = this * matrix
		var m = this.m,
		co = Math.cos(radians), si = Math.sin(radians),
		a = m[4], b = m[8];
		m[4] = (a * co) + (b * si);
		m[8] = (b * co) - (a * si);
		a = m[5]; b = m[9];
		m[5] = (a * co) + (b * si);
		m[9] = (b * co) - (a * si);
		a = m[6]; b = m[10];
		m[6] = (a * co) + (b * si);
		m[10] = (b * co) - (a * si);
		a = m[7]; b = m[11];
		m[7] = (a * co) + (b * si);
		m[11] = (b * co) - (a * si);
		return this;
	},
	rotateXIdentity: function (radians) {
		var m = this.m,
		co = Math.cos(radians), si = Math.sin(radians);
		m[0] = 1;
		m[1] = 0;
		m[2] = 0;
		m[3] = 0;
		m[4] = 0;
		m[5] = co;
		m[6] = si;
		m[7] = 0;
		m[8] = 0;
		m[9] = -si;
		m[10] = co;
		m[11] = 0;
		m[12] = 0;
		m[13] = 0;
		m[14] = 0;
		m[15] = 1;
		return this;
	},
	rotateY: function (radians) {
		//this = this * matrix
		var m = this.m,
		co = Math.cos(radians), si = Math.sin(radians),
		a = m[0], b = m[8];
		m[0] = (a * co) - (b * si);
		m[8] = (b * co) + (a * si);
		a = m[1]; b = m[9];
		m[1] = (a * co) - (b * si);
		m[9] = (b * co) + (a * si);
		a = m[2]; b = m[10];
		m[2] = (a * co) - (b * si);
		m[10] = (b * co) + (a * si);
		a = m[3]; b = m[11];
		m[3] = (a * co) - (b * si);
		m[11] = (b * co) + (a * si);
		return this;
	},
	rotateYIdentity: function (radians) {
		var m = this.m,
		co = Math.cos(radians), si = Math.sin(radians);
		m[0] = co;
		m[1] = 0;
		m[2] = -si;
		m[3] = 0;
		m[4] = 0;
		m[5] = 1;
		m[6] = 0;
		m[7] = 0;
		m[8] = si;
		m[9] = 0;
		m[10] = co;
		m[11] = 0;
		m[12] = 0;
		m[13] = 0;
		m[14] = 0;
		m[15] = 1;
		return this;
	},
	rotateZ: function (radians) {
		//this = this * matrix
		var m = this.m,
		co = Math.cos(radians), si = Math.sin(radians),
		a = m[0], b = m[4];
		m[0] = (a * co) + (b * si);
		m[4] = (b * co) - (a * si);
		a = m[1]; b = m[5];
		m[1] = (a * co) + (b * si);
		m[5] = (b * co) - (a * si);
		a = m[2]; b = m[6];
		m[2] = (a * co) + (b * si);
		m[6] = (b * co) - (a * si);
		a = m[3]; b = m[7];
		m[3] = (a * co) + (b * si);
		m[7] = (b * co) - (a * si);
		return this;
	},
	rotateZIdentity: function (radians) {
		var m = this.m,
		co = Math.cos(radians), si = Math.sin(radians);
		m[0] = co;
		m[1] = si;
		m[2] = 0;
		m[3] = 0;
		m[4] = -si;
		m[5] = co;
		m[6] = 0;
		m[7] = 0;
		m[8] = 0;
		m[9] = 0;
		m[10] = 1;
		m[11] = 0;
		m[12] = 0;
		m[13] = 0;
		m[14] = 0;
		m[15] = 1;
		return this;
	},
	perspectiveFovFromLeft: function (fovyInDegrees, aspectRatio, zNear, zFar) {
		//this = matrix * this

		//based on D3DXMatrixPerspectiveFovRH
		//http://msdn.microsoft.com/en-us/library/windows/desktop/bb205351(v=vs.85).aspx
		var m = this.m, yScale = Math.tan((Math.PI * 0.5) - (fovyInDegrees * Math.PI / 360)), //cot(x) = tan(PI/2 - x)
		A = yScale / aspectRatio, B, m2 = m[2], m6 = m[6], m10 = m[10], m14 = m[14];
		m[0] *= A;
		m[4] *= A;
		m[8] *= A;
		m[12] *= A;
		m[1] *= yScale;
		m[5] *= yScale;
		m[9] *= yScale;
		m[13] *= yScale;
		A = zFar / (zNear - zFar);
		B = zNear * zFar / (zNear - zFar);
		m[2] = (A * m2) + (B * m[3]);
		m[6] = (A * m6) + (B * m[7]);
		m[10] = (A * m10) + (B * m[11]);
		m[14] = (A * m14) + (B * m[15]);
		m[3] = -m2;
		m[7] = -m6;
		m[11] = -m10;
		m[15] = -m14;
		return this;
	},
	perspectiveFovIdentity: function (fovyInDegrees, aspectRatio, zNear, zFar) {
		//based on D3DXMatrixPerspectiveFovRH
		//http://msdn.microsoft.com/en-us/library/windows/desktop/bb205351(v=vs.85).aspx
		var m = this.m, yScale = Math.tan((Math.PI * 0.5) - (fovyInDegrees * Math.PI / 360)); //cot(x) = tan(PI/2 - x)
		m[0] = yScale / aspectRatio;
		m[1] = 0;
		m[2] = 0;
		m[3] = 0;
		m[4] = 0;
		m[5] = yScale;
		m[6] = 0;
		m[7] = 0;
		m[8] = 0;
		m[9] = 0;
		m[10] = zFar / (zNear - zFar);
		m[11] = -1;
		m[12] = 0;
		m[13] = 0;
		m[14] = zNear * zFar / (zNear - zFar);
		m[15] = 0;
		return this;
	},
	perspectiveFromLeft: function (viewWidth, viewHeight, zNear, zFar) {
		//this = matrix * this

		//based on D3DXMatrixPerspectiveRH
		//http://msdn.microsoft.com/en-us/library/windows/desktop/bb205355(v=vs.85).aspx
		//and on
		//http://msdn.microsoft.com/en-us/library/windows/desktop/bb147302(v=vs.85).aspx
		var m = this.m, yScale = Math.tan((Math.PI * 0.5) - (fovyInDegrees * Math.PI / 360)), //cot(x) = tan(PI/2 - x)
		A = 2 * zNear, B, m2 = m[2], m6 = m[6], m10 = m[10], m14 = m[14];
		m[0] *= A;
		m[4] *= A;
		m[8] *= A;
		m[12] *= A;
		A = 2 * zNear * (viewWidth / viewHeight);
		m[1] *= A;
		m[5] *= A;
		m[9] *= A;
		m[13] *= A;
		A = zFar / (zNear - zFar);
		B = zNear * zFar / (zNear - zFar);
		m[2] = (A * m2) + (B * m[3]);
		m[6] = (A * m6) + (B * m[7]);
		m[10] = (A * m10) + (B * m[11]);
		m[14] = (A * m14) + (B * m[15]);
		m[3] = -m2;
		m[7] = -m6;
		m[11] = -m10;
		m[15] = -m14;
		return this;
	},
	perspectiveIdentity: function (viewWidth, viewHeight, zNear, zFar) {
		//based on D3DXMatrixPerspectiveRH
		//http://msdn.microsoft.com/en-us/library/windows/desktop/bb205355(v=vs.85).aspx
		//and on
		//http://msdn.microsoft.com/en-us/library/windows/desktop/bb147302(v=vs.85).aspx
		var m = this.m;
		m[0] = 2 * zNear;
		m[1] = 0;
		m[2] = 0;
		m[3] = 0;
		m[4] = 0;
		m[5] = 2 * zNear * (viewWidth / viewHeight);
		m[6] = 0;
		m[7] = 0;
		m[8] = 0;
		m[9] = 0;
		m[10] = zFar / (zNear - zFar);
		m[11] = -1;
		m[12] = 0;
		m[13] = 0;
		m[14] = zNear * zFar / (zNear - zFar);
		m[15] = 0;
		return this;
	},
	orthoFromLeft: function (viewWidth, viewHeight, zNear, zFar) {
		//this = matrix * this

		//based on D3DXMatrixOrthoOffCenterRH
		//http://msdn.microsoft.com/en-us/library/windows/desktop/bb205354(v=vs.85).aspx
		var m = this.m, A = 2 / viewWidth, B = zNear / (zNear - zFar);
		m[0] *= A;
		m[4] *= A;
		m[8] *= A;
		m[12] *= A;
		A = 2 / viewHeight;
		m[1] *= A;
		m[5] *= A;
		m[9] *= A;
		m[13] *= A;
		A = 1 / (zNear - zFar);
		m[2] = (A * m[2]) + (B * m[3]);
		m[6] = (A * m[6]) + (B * m[7]);
		m[10] = (A * m[10]) + (B * m[11]);
		m[14] = (A * m[14]) + (B * m[15]);
		return this;
	},
	orthoIdentity: function (viewWidth, viewHeight, zNear, zFar) {
		//based on D3DXMatrixOrthoRH
		//http://msdn.microsoft.com/en-us/library/windows/desktop/bb205349(v=vs.85).aspx
		var m = this.m;
		m[0] = 2 / viewWidth;
		m[1] = 0;
		m[2] = 0;
		m[3] = 0;
		m[4] = 0;
		m[5] = 2 / viewHeight;
		m[6] = 0;
		m[7] = 0;
		m[8] = 0;
		m[9] = 0;
		m[10] = 1 / (zNear - zFar);
		m[11] = 0;
		m[12] = 0;
		m[13] = 0;
		m[14] = zNear / (zNear - zFar);
		m[15] = 1;
		return this;
	},
	orthoOffsetFromLeft: function (centerX, centerY, viewWidth, viewHeight, zNear, zFar) {
		//this = matrix * this

		//based on D3DXMatrixOrthoOffCenterRH
		//http://msdn.microsoft.com/en-us/library/windows/desktop/bb205354(v=vs.85).aspx
		var m = this.m, A = 2 / viewWidth, B = -2 * centerX / viewWidth,
		m3 = m[3], m7 = m[7], m11 = m[11], m15 = m[15];
		m[0] = (A * m[0]) + (B * m3);
		m[4] = (A * m[4]) + (B * m7);
		m[8] = (A * m[8]) + (B * m11);
		m[12] = (A * m[12]) + (B * m15);
		A = 2 / viewHeight;
		B = -2 * centerY / viewHeight;
		m[1] = (A * m[1]) + (B * m3);
		m[5] = (A * m[5]) + (B * m7);
		m[9] = (A * m[9]) + (B * m11);
		m[13] = (A * m[13]) + (B * m15);
		A = 1 / (zNear - zFar);
		B = zNear / (zNear - zFar);
		m[2] = (A * m[2]) + (B * m3);
		m[6] = (A * m[6]) + (B * m7);
		m[10] = (A * m[10]) + (B * m11);
		m[14] = (A * m[14]) + (B * m15);
		return this;
	},
	orthoOffsetIdentity: function (centerX, centerY, viewWidth, viewHeight, zNear, zFar) {
		//based on D3DXMatrixOrthoOffCenterRH
		//http://msdn.microsoft.com/en-us/library/windows/desktop/bb205354(v=vs.85).aspx
		var m = this.m;
		m[0] = 2 / viewWidth;
		m[1] = 0;
		m[2] = 0;
		m[3] = 0;
		m[4] = 0;
		m[5] = 2 / viewHeight;
		m[6] = 0;
		m[7] = 0;
		m[8] = 0;
		m[9] = 0;
		m[10] = 1 / (zNear - zFar);
		m[11] = 0;
		m[12] = -2 * centerX / viewWidth;
		m[13] = -2 * centerY / viewHeight;
		m[14] = zNear / (zNear - zFar);
		m[15] = 1;
		return this;
	}
};
