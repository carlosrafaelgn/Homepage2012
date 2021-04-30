//
// Vector3.js is distributed under the FreeBSD License
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
// http://carlosrafaelgn.com.br/WebGL/Vector3.js
//
"use strict";

var Vector3 = {
	create: function (x, y, z) {
		return [x, y, z];
	},
	clone: function (v) {
		return [v[0], v[1], v[2]];
	},
	normalize: function (v) {
		var x = v[0], y = v[1], z = v[2], n = 1 / Math.sqrt((x * x) + (y * y) + (z * z));
		v[0] = x * n;
		v[1] = y * n;
		v[2] = z * n;
		return v;
	},
	normalizeArray: function (array, index) {
		var x = array[index], y = array[index + 1], z = array[index + 2], n = 1 / Math.sqrt((x * x) + (y * y) + (z * z));
		array[index] = (x * n);
		array[index + 1] = (y * n);
		array[index + 2] = (z * n);
		return array;
	},
	copyIntoArray: function (v, array, index) {
		array[index] = v[0];
		array[index + 1] = v[1];
		array[index + 2] = v[2];
		return v;
	},
	fromArray: function (array, index) {
		return [
			array[index],
			array[index + 1],
			array[index + 2]
		];
	}
};
freeze$(Vector3);
