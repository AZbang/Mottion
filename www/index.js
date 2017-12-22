(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * @pixi/filter-advanced-bloom - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-advanced-bloom is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r(e.__pixiFilters={})}(this,function(e){"use strict";var r="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform float threshold;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    // A simple & fast algorithm for getting brightness.\n    // It's inaccuracy , but good enought for this feature.\n    float _max = max(max(color.r, color.g), color.b);\n    float _min = min(min(color.r, color.g), color.b);\n    float brightness = (_max + _min) * 0.5;\n\n    if(brightness > threshold) {\n        gl_FragColor = color;\n    } else {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n}\n",o=function(e){function o(o){void 0===o&&(o=.5),e.call(this,r,t),this.threshold=o}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var n={threshold:{configurable:!0}};return n.threshold.get=function(){return this.uniforms.threshold},n.threshold.set=function(e){this.uniforms.threshold=e},Object.defineProperties(o.prototype,n),o}(PIXI.Filter),n="uniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D bloomTexture;\nuniform float bloomScale;\nuniform float brightness;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    color.rgb *= brightness;\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\n    bloomColor.rgb *= bloomScale;\n    gl_FragColor = color + bloomColor;\n}\n",i=function(e){function t(t){e.call(this,r,n),"number"==typeof t&&(t={threshold:t}),t=Object.assign({threshold:.5,bloomScale:1,brightness:1,blur:8,quality:4,resolution:PIXI.settings.RESOLUTION,kernelSize:5},t),this.bloomScale=t.bloomScale,this.brightness=t.brightness;var i=t.blur,l=t.quality,s=t.resolution,u=t.kernelSize,a=PIXI.filters,c=a.BlurXFilter,h=a.BlurYFilter;this._extract=new o(t.threshold),this._blurX=new c(i,l,s,u),this._blurY=new h(i,l,s,u)}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var i={threshold:{configurable:!0},blur:{configurable:!0}};return t.prototype.apply=function(e,r,t,o,n){var i=e.getRenderTarget(!0);this._extract.apply(e,r,i,!0,n),this._blurX.apply(e,i,i,!0,n),this._blurY.apply(e,i,i,!0,n),this.uniforms.bloomScale=this.bloomScale,this.uniforms.brightness=this.brightness,this.uniforms.bloomTexture=i,e.applyFilter(this,r,t,o),e.returnRenderTarget(i)},i.threshold.get=function(){return this._extract.threshold},i.threshold.set=function(e){this._extract.threshold=e},i.blur.get=function(){return this._blurX.blur},i.blur.set=function(e){this._blurX.blur=this._blurY.blur=e},Object.defineProperties(t.prototype,i),t}(PIXI.Filter);PIXI.filters.AdvancedBloomFilter=i,e.AdvancedBloomFilter=i,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-advanced-bloom.js.map

},{}],2:[function(require,module,exports){
/*!
 * @pixi/filter-ascii - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-ascii is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.__pixiFilters={})}(this,function(e){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",o="varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}",r=function(e){function r(r){void 0===r&&(r=8),e.call(this,n,o),this.size=r}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var i={size:{configurable:!0}};return i.size.get=function(){return this.uniforms.pixelSize},i.size.set=function(e){this.uniforms.pixelSize=e},Object.defineProperties(r.prototype,i),r}(PIXI.Filter);PIXI.filters.AsciiFilter=r,e.AsciiFilter=r,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-ascii.js.map

},{}],3:[function(require,module,exports){
/*!
 * @pixi/filter-bloom - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-bloom is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r(t.__pixiFilters={})}(this,function(t){"use strict";var r=PIXI.filters,e=r.BlurXFilter,i=r.BlurYFilter,l=r.AlphaFilter,u=function(t){function r(r,u,n,o){void 0===r&&(r=2),void 0===u&&(u=4),void 0===n&&(n=PIXI.settings.RESOLUTION),void 0===o&&(o=5),t.call(this);var b,s;"number"==typeof r?(b=r,s=r):r instanceof PIXI.Point?(b=r.x,s=r.y):Array.isArray(r)&&(b=r[0],s=r[1]),this.blurXFilter=new e(b,u,n,o),this.blurYFilter=new i(s,u,n,o),this.blurYFilter.blendMode=PIXI.BLEND_MODES.SCREEN,this.defaultFilter=new l}t&&(r.__proto__=t),(r.prototype=Object.create(t&&t.prototype)).constructor=r;var u={blur:{configurable:!0},blurX:{configurable:!0},blurY:{configurable:!0}};return r.prototype.apply=function(t,r,e){var i=t.getRenderTarget(!0);this.defaultFilter.apply(t,r,e),this.blurXFilter.apply(t,r,i),this.blurYFilter.apply(t,i,e),t.returnRenderTarget(i)},u.blur.get=function(){return this.blurXFilter.blur},u.blur.set=function(t){this.blurXFilter.blur=this.blurYFilter.blur=t},u.blurX.get=function(){return this.blurXFilter.blur},u.blurX.set=function(t){this.blurXFilter.blur=t},u.blurY.get=function(){return this.blurYFilter.blur},u.blurY.set=function(t){this.blurYFilter.blur=t},Object.defineProperties(r.prototype,u),r}(PIXI.Filter);PIXI.filters.BloomFilter=u,t.BloomFilter=u,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=filter-bloom.js.map

},{}],4:[function(require,module,exports){
/*!
 * @pixi/filter-bulge-pinch - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-bulge-pinch is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.__pixiFilters={})}(this,function(e){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n",r=function(e){function r(r,o,i){e.call(this,n,t),this.center=r||[.5,.5],this.radius=o||100,this.strength=i||1}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var o={radius:{configurable:!0},strength:{configurable:!0},center:{configurable:!0}};return r.prototype.apply=function(e,n,t,r){this.uniforms.dimensions[0]=n.sourceFrame.width,this.uniforms.dimensions[1]=n.sourceFrame.height,e.applyFilter(this,n,t,r)},o.radius.get=function(){return this.uniforms.radius},o.radius.set=function(e){this.uniforms.radius=e},o.strength.get=function(){return this.uniforms.strength},o.strength.set=function(e){this.uniforms.strength=e},o.center.get=function(){return this.uniforms.center},o.center.set=function(e){this.uniforms.center=e},Object.defineProperties(r.prototype,o),r}(PIXI.Filter);PIXI.filters.BulgePinchFilter=r,e.BulgePinchFilter=r,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-bulge-pinch.js.map

},{}],5:[function(require,module,exports){
/*!
 * @pixi/filter-color-replace - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-color-replace is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(o,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(o.__pixiFilters={})}(this,function(o){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(texture, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n",n=function(o){function n(n,i,t){void 0===n&&(n=16711680),void 0===i&&(i=0),void 0===t&&(t=.4),o.call(this,e,r),this.originalColor=n,this.newColor=i,this.epsilon=t}o&&(n.__proto__=o),(n.prototype=Object.create(o&&o.prototype)).constructor=n;var i={originalColor:{configurable:!0},newColor:{configurable:!0},epsilon:{configurable:!0}};return i.originalColor.set=function(o){var e=this.uniforms.originalColor;"number"==typeof o?(PIXI.utils.hex2rgb(o,e),this._originalColor=o):(e[0]=o[0],e[1]=o[1],e[2]=o[2],this._originalColor=PIXI.utils.rgb2hex(e))},i.originalColor.get=function(){return this._originalColor},i.newColor.set=function(o){var e=this.uniforms.newColor;"number"==typeof o?(PIXI.utils.hex2rgb(o,e),this._newColor=o):(e[0]=o[0],e[1]=o[1],e[2]=o[2],this._newColor=PIXI.utils.rgb2hex(e))},i.newColor.get=function(){return this._newColor},i.epsilon.set=function(o){this.uniforms.epsilon=o},i.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(n.prototype,i),n}(PIXI.Filter);PIXI.filters.ColorReplaceFilter=n,o.ColorReplaceFilter=n,Object.defineProperty(o,"__esModule",{value:!0})});
//# sourceMappingURL=filter-color-replace.js.map

},{}],6:[function(require,module,exports){
/*!
 * @pixi/filter-convolution - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-convolution is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiFilters={})}(this,function(e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n",o=function(e){function o(o,i,n){e.call(this,t,r),this.matrix=o,this.width=i,this.height=n}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var i={matrix:{configurable:!0},width:{configurable:!0},height:{configurable:!0}};return i.matrix.get=function(){return this.uniforms.matrix},i.matrix.set=function(e){this.uniforms.matrix=new Float32Array(e)},i.width.get=function(){return 1/this.uniforms.texelSize[0]},i.width.set=function(e){this.uniforms.texelSize[0]=1/e},i.height.get=function(){return 1/this.uniforms.texelSize[1]},i.height.set=function(e){this.uniforms.texelSize[1]=1/e},Object.defineProperties(o.prototype,i),o}(PIXI.Filter);PIXI.filters.ConvolutionFilter=o,e.ConvolutionFilter=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-convolution.js.map

},{}],7:[function(require,module,exports){
/*!
 * @pixi/filter-cross-hatch - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-cross-hatch is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(o,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(o.__pixiFilters={})}(this,function(o){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n",e=function(o){function e(){o.call(this,n,r)}return o&&(e.__proto__=o),e.prototype=Object.create(o&&o.prototype),e.prototype.constructor=e,e}(PIXI.Filter);PIXI.filters.CrossHatchFilter=e,o.CrossHatchFilter=e,Object.defineProperty(o,"__esModule",{value:!0})});
//# sourceMappingURL=filter-cross-hatch.js.map

},{}],8:[function(require,module,exports){
/*!
 * @pixi/filter-dot - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-dot is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.__pixiFilters={})}(this,function(e){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n",o=function(e){function o(o,r){void 0===o&&(o=1),void 0===r&&(r=5),e.call(this,n,t),this.scale=o,this.angle=r}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var r={scale:{configurable:!0},angle:{configurable:!0}};return r.scale.get=function(){return this.uniforms.scale},r.scale.set=function(e){this.uniforms.scale=e},r.angle.get=function(){return this.uniforms.angle},r.angle.set=function(e){this.uniforms.angle=e},Object.defineProperties(o.prototype,r),o}(PIXI.Filter);PIXI.filters.DotFilter=o,e.DotFilter=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-dot.js.map

},{}],9:[function(require,module,exports){
/*!
 * @pixi/filter-drop-shadow - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-drop-shadow is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.__pixiFilters={})}(this,function(t){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n\n    // Un-premultiply alpha before applying the color\n    if (sample.a > 0.0) {\n        sample.rgb /= sample.a;\n    }\n\n    // Premultiply alpha again\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}",i=function(t){function i(i,n,o,a,l){void 0===i&&(i=45),void 0===n&&(n=5),void 0===o&&(o=2),void 0===a&&(a=0),void 0===l&&(l=.5),t.call(this),this.tintFilter=new PIXI.Filter(e,r),this.blurFilter=new PIXI.filters.BlurFilter,this.blurFilter.blur=o,this.targetTransform=new PIXI.Matrix,this.rotation=i,this.padding=n,this.distance=n,this.alpha=l,this.color=a}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var n={distance:{configurable:!0},rotation:{configurable:!0},blur:{configurable:!0},alpha:{configurable:!0},color:{configurable:!0}};return i.prototype.apply=function(t,e,r,i){var n=t.getRenderTarget();n.transform=this.targetTransform,this.tintFilter.apply(t,e,n,!0),this.blurFilter.apply(t,n,r),t.applyFilter(this,e,r,i),n.transform=null,t.returnRenderTarget(n)},i.prototype._updatePadding=function(){this.padding=this.distance+2*this.blur},i.prototype._updateTargetTransform=function(){this.targetTransform.tx=this.distance*Math.cos(this.angle),this.targetTransform.ty=this.distance*Math.sin(this.angle)},n.distance.get=function(){return this._distance},n.distance.set=function(t){this._distance=t,this._updatePadding(),this._updateTargetTransform()},n.rotation.get=function(){return this.angle/PIXI.DEG_TO_RAD},n.rotation.set=function(t){this.angle=t*PIXI.DEG_TO_RAD,this._updateTargetTransform()},n.blur.get=function(){return this.blurFilter.blur},n.blur.set=function(t){this.blurFilter.blur=t,this._updatePadding()},n.alpha.get=function(){return this.tintFilter.uniforms.alpha},n.alpha.set=function(t){this.tintFilter.uniforms.alpha=t},n.color.get=function(){return PIXI.utils.rgb2hex(this.tintFilter.uniforms.color)},n.color.set=function(t){PIXI.utils.hex2rgb(t,this.tintFilter.uniforms.color)},Object.defineProperties(i.prototype,n),i}(PIXI.Filter);PIXI.filters.DropShadowFilter=i,t.DropShadowFilter=i,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=filter-drop-shadow.js.map

},{}],10:[function(require,module,exports){
/*!
 * @pixi/filter-emboss - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-emboss is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiFilters={})}(this,function(e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n",o=function(e){function o(o){void 0===o&&(o=5),e.call(this,t,r),this.strength=o}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var n={strength:{configurable:!0}};return n.strength.get=function(){return this.uniforms.strength},n.strength.set=function(e){this.uniforms.strength=e},Object.defineProperties(o.prototype,n),o}(PIXI.Filter);PIXI.filters.EmbossFilter=o,e.EmbossFilter=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-emboss.js.map

},{}],11:[function(require,module,exports){
/*!
 * @pixi/filter-glow - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-glow is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(o,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(o.__pixiFilters={})}(this,function(o){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n",e=function(o){function e(e,r,i,l,a){void 0===e&&(e=10),void 0===r&&(r=4),void 0===i&&(i=0),void 0===l&&(l=16777215),void 0===a&&(a=.1),o.call(this,n,t.replace(/%QUALITY_DIST%/gi,""+(1/a/e).toFixed(7)).replace(/%DIST%/gi,""+e.toFixed(7))),this.uniforms.glowColor=new Float32Array([0,0,0,1]),this.distance=e,this.color=l,this.outerStrength=r,this.innerStrength=i}o&&(e.__proto__=o),(e.prototype=Object.create(o&&o.prototype)).constructor=e;var r={color:{configurable:!0},distance:{configurable:!0},outerStrength:{configurable:!0},innerStrength:{configurable:!0}};return r.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.glowColor)},r.color.set=function(o){PIXI.utils.hex2rgb(o,this.uniforms.glowColor)},r.distance.get=function(){return this.uniforms.distance},r.distance.set=function(o){this.uniforms.distance=o},r.outerStrength.get=function(){return this.uniforms.outerStrength},r.outerStrength.set=function(o){this.uniforms.outerStrength=o},r.innerStrength.get=function(){return this.uniforms.innerStrength},r.innerStrength.set=function(o){this.uniforms.innerStrength=o},Object.defineProperties(e.prototype,r),e}(PIXI.Filter);PIXI.filters.GlowFilter=e,o.GlowFilter=e,Object.defineProperty(o,"__esModule",{value:!0})});
//# sourceMappingURL=filter-glow.js.map

},{}],12:[function(require,module,exports){
/*!
 * @pixi/filter-godray - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-godray is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(n.__pixiFilters={})}(this,function(n){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="vec3 mod289(vec3 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x)\n{\n    return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r)\n{\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t)\n{\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n    Pi0 = mod289(Pi0);\n    Pi1 = mod289(Pi1);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n    return 2.2 * n_xyz;\n}\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\n{\n    float sum = 0.0;\n    float sc = 1.0;\n    float totalgain = 1.0;\n    for (float i = 0.0; i < 6.0; i++)\n    {\n        sum += totalgain * pnoise(P * sc, rep);\n        sc *= lacunarity;\n        totalgain *= gain;\n    }\n    return abs(sum);\n}\n",i="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform vec2 angleDir;\nuniform float gain;\nuniform float lacunarity;\nuniform float time;\n\n${perlin}\n\nvoid main(void) {\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    float xx = angleDir.x;\n    float yy = angleDir.y;\n\n    float d = (xx * coord.x) + (yy * coord.y);\n    vec3 dir = vec3(d, d, 0.0);\n\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);\n    noise = mix(noise, 0.0, 0.3);\n    //fade vertically.\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\n    mist.a = 1.0;\n    gl_FragColor += mist;\n}\n",o=function(n){function o(o,r,a,c){void 0===o&&(o=30),void 0===r&&(r=.5),void 0===a&&(a=2.5),void 0===c&&(c=0),n.call(this,e,i.replace("${perlin}",t)),this.angle=o,this.gain=r,this.lacunarity=a,this.time=c}n&&(o.__proto__=n),(o.prototype=Object.create(n&&n.prototype)).constructor=o;var r={angle:{configurable:!0},gain:{configurable:!0},lacunarity:{configurable:!0}};return o.prototype.apply=function(n,e,t,i){var o=e.sourceFrame.width,r=e.sourceFrame.height;this.uniforms.dimensions[0]=o,this.uniforms.dimensions[1]=r,this.uniforms.time=this.time,this.uniforms.angleDir[1]=this._angleSin*r/o,n.applyFilter(this,e,t,i)},r.angle.get=function(){return this._angle},r.angle.set=function(n){var e=n*PIXI.DEG_TO_RAD;this._angleCos=Math.cos(e),this._angleSin=Math.sin(e),this.uniforms.angleDir[0]=this._angleCos,this._angle=n},r.gain.get=function(){return this.uniforms.gain},r.gain.set=function(n){this.uniforms.gain=n},r.lacunarity.get=function(){return this.uniforms.lacunarity},r.lacunarity.set=function(n){this.uniforms.lacunarity=n},Object.defineProperties(o.prototype,r),o}(PIXI.Filter);PIXI.filters.GodrayFilter=o,n.GodrayFilter=o,Object.defineProperty(n,"__esModule",{value:!0})});
//# sourceMappingURL=filter-godray.js.map

},{}],13:[function(require,module,exports){
/*!
 * @pixi/filter-motion-blur - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-motion-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiFilters={})}(this,function(e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",i="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uVelocity;\nuniform int uKernelSize;\nuniform float uOffset;\n\nconst int MAX_KERNEL_SIZE = 2048;\nconst int ITERATION = MAX_KERNEL_SIZE - 1;\n\nvec2 velocity = uVelocity / filterArea.xy;\n\n// float kernelSize = min(float(uKernelSize), float(MAX_KERNELSIZE));\n\n// In real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\nfloat kernelSize = float(uKernelSize);\nfloat k = kernelSize - 1.0;\nfloat offset = -uOffset / length(uVelocity) - 0.5;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        return;\n    }\n\n    for(int i = 0; i < ITERATION; i++) {\n        if (i == int(k)) {\n            break;\n        }\n        vec2 bias = velocity * (float(i) / k + offset);\n        gl_FragColor += texture2D(uSampler, vTextureCoord + bias);\n    }\n    gl_FragColor /= kernelSize;\n}\n",n=function(e){function n(n,o,r){void 0===n&&(n=[0,0]),void 0===o&&(o=5),void 0===r&&(r=0),e.call(this,t,i),this._velocity=new PIXI.Point(0,0),this.velocity=n,this.kernelSize=o,this.offset=r}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var o={velocity:{configurable:!0},offset:{configurable:!0}};return n.prototype.apply=function(e,t,i,n){var o=this.velocity,r=o.x,l=o.y;this.uniforms.uKernelSize=0!==r||0!==l?this.kernelSize:0,e.applyFilter(this,t,i,n)},o.velocity.set=function(e){Array.isArray(e)?(this._velocity.x=e[0],this._velocity.y=e[1]):e instanceof PIXI.Point&&(this._velocity.x=e.x,this._velocity.y=e.y),this.uniforms.uVelocity[0]=this._velocity.x,this.uniforms.uVelocity[1]=this._velocity.y},o.velocity.get=function(){return this._velocity},o.offset.set=function(e){this.uniforms.uOffset=e},o.offset.get=function(){return this.uniforms.uOffset},Object.defineProperties(n.prototype,o),n}(PIXI.Filter);PIXI.filters.MotionBlurFilter=n,e.MotionBlurFilter=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-motion-blur.js.map

},{}],14:[function(require,module,exports){
/*!
 * @pixi/filter-multi-color-replace - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-multi-color-replace is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(o,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(o.__pixiFilters={})}(this,function(o){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float epsilon;\n\nconst int MAX_COLORS = %maxColors%;\n\nuniform vec3 originalColors[MAX_COLORS];\nuniform vec3 targetColors[MAX_COLORS];\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    float alpha = gl_FragColor.a;\n    if (alpha < 0.0001)\n    {\n      return;\n    }\n\n    vec3 color = gl_FragColor.rgb / alpha;\n\n    for(int i = 0; i < MAX_COLORS; i++)\n    {\n      vec3 origColor = originalColors[i];\n      if (origColor.r < 0.0)\n      {\n        break;\n      }\n      vec3 colorDiff = origColor - color;\n      if (length(colorDiff) < epsilon)\n      {\n        vec3 targetColor = targetColors[i];\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\n        return;\n      }\n    }\n}\n",n=function(o){function n(n,t,i){void 0===t&&(t=.05),void 0===i&&(i=null),i=i||n.length,o.call(this,e,r.replace(/%maxColors%/g,i)),this.epsilon=t,this._maxColors=i,this._replacements=null,this.uniforms.originalColors=new Float32Array(3*i),this.uniforms.targetColors=new Float32Array(3*i),this.replacements=n}o&&(n.__proto__=o),(n.prototype=Object.create(o&&o.prototype)).constructor=n;var t={replacements:{configurable:!0},maxColors:{configurable:!0},epsilon:{configurable:!0}};return t.replacements.set=function(o){var e=this.uniforms.originalColors,r=this.uniforms.targetColors,n=o.length;if(n>this._maxColors)throw"Length of replacements ("+n+") exceeds the maximum colors length ("+this._maxColors+")";e[3*n]=-1;for(var t=0;t<n;t++){var i=o[t],l=i[0];"number"==typeof l?l=PIXI.utils.hex2rgb(l):i[0]=PIXI.utils.rgb2hex(l),e[3*t]=l[0],e[3*t+1]=l[1],e[3*t+2]=l[2];var a=i[1];"number"==typeof a?a=PIXI.utils.hex2rgb(a):i[1]=PIXI.utils.rgb2hex(a),r[3*t]=a[0],r[3*t+1]=a[1],r[3*t+2]=a[2]}this._replacements=o},t.replacements.get=function(){return this._replacements},n.prototype.refresh=function(){this.replacements=this._replacements},t.maxColors.get=function(){return this._maxColors},t.epsilon.set=function(o){this.uniforms.epsilon=o},t.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(n.prototype,t),n}(PIXI.Filter);PIXI.filters.MultiColorReplaceFilter=n,o.MultiColorReplaceFilter=n,Object.defineProperty(o,"__esModule",{value:!0})});
//# sourceMappingURL=filter-multi-color-replace.js.map

},{}],15:[function(require,module,exports){
/*!
 * @pixi/filter-old-film - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-old-film is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(n.__pixiFilters={})}(this,function(n){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",i="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform float sepia;\nuniform float noise;\nuniform float noiseSize;\nuniform float scratch;\nuniform float scratchDensity;\nuniform float scratchWidth;\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\nuniform float seed;\n\nconst float SQRT_2 = 1.414213;\nconst vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvec3 Overlay(vec3 src, vec3 dst)\n{\n    // if (dst <= 0.5) then: 2 * src * dst\n    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)\n    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),\n                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),\n                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\n}\n\n\nvoid main()\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 color = gl_FragColor.rgb;\n\n    if (sepia > 0.0)\n    {\n        float gray = (color.x + color.y + color.z) / 3.0;\n        vec3 grayscale = vec3(gray);\n\n        color = Overlay(SEPIA_RGB, grayscale);\n\n        color = grayscale + sepia * (color - grayscale);\n    }\n\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        vec2 dir = vec2(vec2(0.5, 0.5) - coord);\n        dir.y *= dimensions.y / dimensions.x;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    if (scratchDensity > seed && scratch != 0.0)\n    {\n        float phase = seed * 256.0;\n        float s = mod(floor(phase), 2.0);\n        float dist = 1.0 / scratchDensity;\n        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));\n        if (d < seed * 0.6 + 0.4)\n        {\n            highp float period = scratchDensity * 10.0;\n\n            float xx = coord.x * period + phase;\n            float aa = abs(mod(xx, 0.5) * 4.0);\n            float bb = mod(floor(xx / 0.5), 2.0);\n            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);\n\n            float kk = 2.0 * period;\n            float dw = scratchWidth / dimensions.x * (0.75 + seed);\n            float dh = dw * kk;\n\n            float tine = (yy - (2.0 - dh));\n\n            if (tine > 0.0) {\n                float _sign = sign(scratch);\n\n                tine = s * tine / period + scratch + 0.1;\n                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);\n\n                color.rgb *= tine;\n            }\n        }\n    }\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);\n        // float _noise = snoise(d) * 0.5;\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        color += _noise * noise;\n    }\n\n    gl_FragColor.rgb = color;\n}\n",e=function(n){function e(e,o){void 0===o&&(o=0),n.call(this,t,i),"number"==typeof e?(this.seed=e,e=null):this.seed=o,Object.assign(this,{sepia:.3,noise:.3,noiseSize:1,scratch:.5,scratchDensity:.3,scratchWidth:1,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3},e)}n&&(e.__proto__=n),(e.prototype=Object.create(n&&n.prototype)).constructor=e;var o={sepia:{configurable:!0},noise:{configurable:!0},noiseSize:{configurable:!0},scratch:{configurable:!0},scratchDensity:{configurable:!0},scratchWidth:{configurable:!0},vignetting:{configurable:!0},vignettingAlpha:{configurable:!0},vignettingBlur:{configurable:!0}};return e.prototype.apply=function(n,t,i,e){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,this.uniforms.seed=this.seed,n.applyFilter(this,t,i,e)},o.sepia.set=function(n){this.uniforms.sepia=n},o.sepia.get=function(){return this.uniforms.sepia},o.noise.set=function(n){this.uniforms.noise=n},o.noise.get=function(){return this.uniforms.noise},o.noiseSize.set=function(n){this.uniforms.noiseSize=n},o.noiseSize.get=function(){return this.uniforms.noiseSize},o.scratch.set=function(n){this.uniforms.scratch=n},o.scratch.get=function(){return this.uniforms.scratch},o.scratchDensity.set=function(n){this.uniforms.scratchDensity=n},o.scratchDensity.get=function(){return this.uniforms.scratchDensity},o.scratchWidth.set=function(n){this.uniforms.scratchWidth=n},o.scratchWidth.get=function(){return this.uniforms.scratchWidth},o.vignetting.set=function(n){this.uniforms.vignetting=n},o.vignetting.get=function(){return this.uniforms.vignetting},o.vignettingAlpha.set=function(n){this.uniforms.vignettingAlpha=n},o.vignettingAlpha.get=function(){return this.uniforms.vignettingAlpha},o.vignettingBlur.set=function(n){this.uniforms.vignettingBlur=n},o.vignettingBlur.get=function(){return this.uniforms.vignettingBlur},Object.defineProperties(e.prototype,o),e}(PIXI.Filter);PIXI.filters.OldFilmFilter=e,n.OldFilmFilter=e,Object.defineProperty(n,"__esModule",{value:!0})});
//# sourceMappingURL=filter-old-film.js.map

},{}],16:[function(require,module,exports){
/*!
 * @pixi/filter-outline - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-outline is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?o(exports):"function"==typeof define&&define.amd?define(["exports"],o):o(e.__pixiFilters={})}(this,function(e){"use strict";var o="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {\n        displaced.x = vTextureCoord.x + thickness * px.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness * px.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n",n=function(e){function n(n,r){void 0===n&&(n=1),void 0===r&&(r=0),e.call(this,o,t.replace(/%THICKNESS%/gi,(1/n).toFixed(7))),this.thickness=n,this.uniforms.outlineColor=new Float32Array([0,0,0,1]),this.color=r}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var r={color:{configurable:!0},thickness:{configurable:!0}};return r.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.outlineColor)},r.color.set=function(e){PIXI.utils.hex2rgb(e,this.uniforms.outlineColor)},r.thickness.get=function(){return this.uniforms.thickness},r.thickness.set=function(e){this.uniforms.thickness=e},Object.defineProperties(n.prototype,r),n}(PIXI.Filter);PIXI.filters.OutlineFilter=n,e.OutlineFilter=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-outline.js.map

},{}],17:[function(require,module,exports){
/*!
 * @pixi/filter-pixelate - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-pixelate is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?o(exports):"function"==typeof define&&define.amd?define(["exports"],o):o(e.__pixiFilters={})}(this,function(e){"use strict";var o="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n",n=function(e){function n(n){void 0===n&&(n=10),e.call(this,o,r),this.size=n}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var t={size:{configurable:!0}};return t.size.get=function(){return this.uniforms.size},t.size.set=function(e){"number"==typeof e&&(e=[e,e]),this.uniforms.size=e},Object.defineProperties(n.prototype,t),n}(PIXI.Filter);PIXI.filters.PixelateFilter=n,e.PixelateFilter=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-pixelate.js.map

},{}],18:[function(require,module,exports){
/*!
 * @pixi/filter-radial-blur - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-radial-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.__pixiFilters={})}(this,function(e){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float uRadian;\nuniform vec2 uCenter;\nuniform float uRadius;\nuniform int uKernelSize;\n\nconst int MAX_KERNEL_SIZE = 2048;\nconst int ITERATION = MAX_KERNEL_SIZE - 1;\n\n// float kernelSize = min(float(uKernelSize), float(MAX_KERNELSIZE));\n\n// In real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\nfloat kernelSize = float(uKernelSize);\nfloat k = kernelSize - 1.0;\n\n\nvec2 center = uCenter.xy / filterArea.xy;\nfloat aspect = filterArea.y / filterArea.x;\n\nfloat gradient = uRadius / filterArea.x * 0.3;\nfloat radius = uRadius / filterArea.x - gradient * 0.5;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        return;\n    }\n\n    vec2 coord = vTextureCoord;\n\n    vec2 dir = vec2(center - coord);\n    float dist = length(vec2(dir.x, dir.y * aspect));\n\n    float radianStep;\n\n    if (radius >= 0.0 && dist > radius) {\n        float delta = dist - radius;\n        float gap = gradient;\n        float scale = 1.0 - abs(delta / gap);\n        if (scale <= 0.0) {\n            return;\n        }\n        radianStep = uRadian * scale / k;\n    } else {\n        radianStep = uRadian / k;\n    }\n\n    float s = sin(radianStep);\n    float c = cos(radianStep);\n    mat2 rotationMatrix = mat2(vec2(c, -s), vec2(s, c));\n\n    for(int i = 0; i < ITERATION; i++) {\n        if (i == int(k)) {\n            break;\n        }\n\n        coord -= center;\n        coord.y *= aspect;\n        coord = rotationMatrix * coord;\n        coord.y /= aspect;\n        coord += center;\n\n        vec4 sample = texture2D(uSampler, coord);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        gl_FragColor += sample;\n    }\n    gl_FragColor /= kernelSize;\n}\n",r=function(e){function r(r,i,o,a){void 0===r&&(r=0),void 0===i&&(i=[0,0]),void 0===o&&(o=5),void 0===a&&(a=-1),e.call(this,n,t),this._angle=0,this.angle=r,this.center=i,this.kernelSize=o,this.radius=a}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var i={angle:{configurable:!0},center:{configurable:!0},radius:{configurable:!0}};return r.prototype.apply=function(e,n,t,r){this.uniforms.uKernelSize=0!==this._angle?this.kernelSize:0,e.applyFilter(this,n,t,r)},i.angle.set=function(e){this._angle=e,this.uniforms.uRadian=e*Math.PI/180},i.angle.get=function(){return this._angle},i.center.get=function(){return this.uniforms.uCenter},i.center.set=function(e){this.uniforms.uCenter=e},i.radius.get=function(){return this.uniforms.uRadius},i.radius.set=function(e){(e<0||e===1/0)&&(e=-1),this.uniforms.uRadius=e},Object.defineProperties(r.prototype,i),r}(PIXI.Filter);PIXI.filters.RadialBlurFilter=r,e.RadialBlurFilter=r,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-radial-blur.js.map

},{}],19:[function(require,module,exports){
/*!
 * @pixi/filter-rgb-split - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-rgb-split is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r(e.__pixiFilters={})}(this,function(e){"use strict";var r="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n",n=function(e){function n(n,o,i){void 0===n&&(n=[-10,0]),void 0===o&&(o=[0,10]),void 0===i&&(i=[0,0]),e.call(this,r,t),this.red=n,this.green=o,this.blue=i}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var o={red:{configurable:!0},green:{configurable:!0},blue:{configurable:!0}};return o.red.get=function(){return this.uniforms.red},o.red.set=function(e){this.uniforms.red=e},o.green.get=function(){return this.uniforms.green},o.green.set=function(e){this.uniforms.green=e},o.blue.get=function(){return this.uniforms.blue},o.blue.set=function(e){this.uniforms.blue=e},Object.defineProperties(n.prototype,o),n}(PIXI.Filter);PIXI.filters.RGBSplitFilter=n,e.RGBSplitFilter=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-rgb-split.js.map

},{}],20:[function(require,module,exports){
/*!
 * @pixi/filter-shockwave - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-shockwave is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiFilters={})}(this,function(e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",n="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nuniform vec2 center;\n\nuniform float amplitude;\nuniform float wavelength;\n// uniform float power;\nuniform float brightness;\nuniform float speed;\nuniform float radius;\n\nuniform float time;\n\nconst float PI = 3.14159;\n\nvoid main()\n{\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\n    float maxRadius = radius / filterArea.x;\n    float currentRadius = time * speed / filterArea.x;\n\n    float fade = 1.0;\n\n    if (maxRadius > 0.0) {\n        if (currentRadius > maxRadius) {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\n    }\n\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\n    dir.y *= filterArea.y / filterArea.x;\n    float dist = length(dir);\n\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    vec2 diffUV = normalize(dir);\n\n    float diff = (dist - currentRadius) / halfWavelength;\n\n    float p = 1.0 - pow(abs(diff), 2.0);\n\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\n\n    vec2 offset = diffUV * powDiff / filterArea.xy;\n\n    // Do clamp :\n    vec2 coord = vTextureCoord + offset;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    // No clamp :\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\n\n    gl_FragColor.rgb *= 1.0 + (brightness - 1.0) * p * fade;\n}\n",r=function(e){function r(r,i,o){void 0===r&&(r=[0,0]),void 0===i&&(i={}),void 0===o&&(o=0),e.call(this,t,n),this.center=r,Array.isArray(i)&&(console.warn("Deprecated Warning: ShockwaveFilter params Array has been changed to options Object."),i={}),i=Object.assign({amplitude:30,wavelength:160,brightness:1,speed:500,radius:-1},i),this.amplitude=i.amplitude,this.wavelength=i.wavelength,this.brightness=i.brightness,this.speed=i.speed,this.radius=i.radius,this.time=o}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var i={center:{configurable:!0},amplitude:{configurable:!0},wavelength:{configurable:!0},brightness:{configurable:!0},speed:{configurable:!0},radius:{configurable:!0}};return r.prototype.apply=function(e,t,n,r){this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},i.center.get=function(){return this.uniforms.center},i.center.set=function(e){this.uniforms.center=e},i.amplitude.get=function(){return this.uniforms.amplitude},i.amplitude.set=function(e){this.uniforms.amplitude=e},i.wavelength.get=function(){return this.uniforms.wavelength},i.wavelength.set=function(e){this.uniforms.wavelength=e},i.brightness.get=function(){return this.uniforms.brightness},i.brightness.set=function(e){this.uniforms.brightness=e},i.speed.get=function(){return this.uniforms.speed},i.speed.set=function(e){this.uniforms.speed=e},i.radius.get=function(){return this.uniforms.radius},i.radius.set=function(e){this.uniforms.radius=e},Object.defineProperties(r.prototype,i),r}(PIXI.Filter);PIXI.filters.ShockwaveFilter=r,e.ShockwaveFilter=r,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-shockwave.js.map

},{}],21:[function(require,module,exports){
/*!
 * @pixi/filter-simple-lightmap - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-simple-lightmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiFilters={})}(this,function(e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",o="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D uLightmap;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 ambientColor;\nvoid main() {\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\n    vec4 light = texture2D(uLightmap, lightCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n",i=function(e){function i(i,r,n){void 0===r&&(r=0),void 0===n&&(n=1),e.call(this,t,o),this.uniforms.ambientColor=new Float32Array([0,0,0,n]),this.texture=i,this.color=r}e&&(i.__proto__=e),(i.prototype=Object.create(e&&e.prototype)).constructor=i;var r={texture:{configurable:!0},color:{configurable:!0},alpha:{configurable:!0}};return i.prototype.apply=function(e,t,o,i){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,e.applyFilter(this,t,o,i)},r.texture.get=function(){return this.uniforms.uLightmap},r.texture.set=function(e){this.uniforms.uLightmap=e},r.color.set=function(e){var t=this.uniforms.ambientColor;"number"==typeof e?(PIXI.utils.hex2rgb(e,t),this._color=e):(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],this._color=PIXI.utils.rgb2hex(t))},r.color.get=function(){return this._color},r.alpha.get=function(){return this.uniforms.ambientColor[3]},r.alpha.set=function(e){this.uniforms.ambientColor[3]=e},Object.defineProperties(i.prototype,r),i}(PIXI.Filter);PIXI.filters.SimpleLightmapFilter=i,e.SimpleLightmapFilter=i,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=filter-simple-lightmap.js.map

},{}],22:[function(require,module,exports){
/*!
 * @pixi/filter-tilt-shift - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-tilt-shift is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):i(t.__pixiFilters={})}(this,function(t){"use strict";var i="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",e="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n",r=function(t){function r(r,n,o,l){void 0===r&&(r=100),void 0===n&&(n=600),void 0===o&&(o=null),void 0===l&&(l=null),t.call(this,i,e),this.uniforms.blur=r,this.uniforms.gradientBlur=n,this.uniforms.start=o||new PIXI.Point(0,window.innerHeight/2),this.uniforms.end=l||new PIXI.Point(600,window.innerHeight/2),this.uniforms.delta=new PIXI.Point(30,30),this.uniforms.texSize=new PIXI.Point(window.innerWidth,window.innerHeight),this.updateDelta()}t&&(r.__proto__=t),(r.prototype=Object.create(t&&t.prototype)).constructor=r;var n={blur:{configurable:!0},gradientBlur:{configurable:!0},start:{configurable:!0},end:{configurable:!0}};return r.prototype.updateDelta=function(){this.uniforms.delta.x=0,this.uniforms.delta.y=0},n.blur.get=function(){return this.uniforms.blur},n.blur.set=function(t){this.uniforms.blur=t},n.gradientBlur.get=function(){return this.uniforms.gradientBlur},n.gradientBlur.set=function(t){this.uniforms.gradientBlur=t},n.start.get=function(){return this.uniforms.start},n.start.set=function(t){this.uniforms.start=t,this.updateDelta()},n.end.get=function(){return this.uniforms.end},n.end.set=function(t){this.uniforms.end=t,this.updateDelta()},Object.defineProperties(r.prototype,n),r}(PIXI.Filter);PIXI.filters.TiltShiftAxisFilter=r;var n=function(t){function i(){t.apply(this,arguments)}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,i=this.uniforms.end.y-this.uniforms.start.y,e=Math.sqrt(t*t+i*i);this.uniforms.delta.x=t/e,this.uniforms.delta.y=i/e},i}(r);PIXI.filters.TiltShiftXFilter=n;var o=function(t){function i(){t.apply(this,arguments)}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,i=this.uniforms.end.y-this.uniforms.start.y,e=Math.sqrt(t*t+i*i);this.uniforms.delta.x=-i/e,this.uniforms.delta.y=t/e},i}(r);PIXI.filters.TiltShiftYFilter=o;var l=function(t){function i(i,e,r,l){void 0===i&&(i=100),void 0===e&&(e=600),void 0===r&&(r=null),void 0===l&&(l=null),t.call(this),this.tiltShiftXFilter=new n(i,e,r,l),this.tiltShiftYFilter=new o(i,e,r,l)}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var e={blur:{configurable:!0},gradientBlur:{configurable:!0},start:{configurable:!0},end:{configurable:!0}};return i.prototype.apply=function(t,i,e){var r=t.getRenderTarget(!0);this.tiltShiftXFilter.apply(t,i,r),this.tiltShiftYFilter.apply(t,r,e),t.returnRenderTarget(r)},e.blur.get=function(){return this.tiltShiftXFilter.blur},e.blur.set=function(t){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=t},e.gradientBlur.get=function(){return this.tiltShiftXFilter.gradientBlur},e.gradientBlur.set=function(t){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=t},e.start.get=function(){return this.tiltShiftXFilter.start},e.start.set=function(t){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=t},e.end.get=function(){return this.tiltShiftXFilter.end},e.end.set=function(t){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=t},Object.defineProperties(i.prototype,e),i}(PIXI.Filter);PIXI.filters.TiltShiftFilter=l,t.TiltShiftFilter=l,t.TiltShiftXFilter=n,t.TiltShiftYFilter=o,t.TiltShiftAxisFilter=r,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=filter-tilt-shift.js.map

},{}],23:[function(require,module,exports){
/*!
 * @pixi/filter-twist - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-twist is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(o,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(o.__pixiFilters={})}(this,function(o){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n",e=function(o){function e(e,t,i){void 0===e&&(e=200),void 0===t&&(t=4),void 0===i&&(i=20),o.call(this,n,r),this.radius=e,this.angle=t,this.padding=i}o&&(e.__proto__=o),(e.prototype=Object.create(o&&o.prototype)).constructor=e;var t={offset:{configurable:!0},radius:{configurable:!0},angle:{configurable:!0}};return t.offset.get=function(){return this.uniforms.offset},t.offset.set=function(o){this.uniforms.offset=o},t.radius.get=function(){return this.uniforms.radius},t.radius.set=function(o){this.uniforms.radius=o},t.angle.get=function(){return this.uniforms.angle},t.angle.set=function(o){this.uniforms.angle=o},Object.defineProperties(e.prototype,t),e}(PIXI.Filter);PIXI.filters.TwistFilter=e,o.TwistFilter=e,Object.defineProperty(o,"__esModule",{value:!0})});
//# sourceMappingURL=filter-twist.js.map

},{}],24:[function(require,module,exports){
/*!
 * @pixi/filter-zoom-blur - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-zoom-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(n.__pixiFilters={})}(this,function(n){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nconst float MAX_KERNEL_SIZE = 32.0;\n\nfloat random(vec3 scale, float seed) {\n    // use the fragment position for a different seed per-pixel\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main() {\n\n    float minGradient = uInnerRadius * 0.3;\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n\n    float gradient = uRadius * 0.3;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float countLimit = MAX_KERNEL_SIZE;\n\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    gl_FragColor = color / total;\n\n    // switch back from pre-multiplied alpha\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n\n}\n",r=function(n){function r(r,i,o,a){void 0===r&&(r=.1),void 0===i&&(i=[0,0]),void 0===o&&(o=0),void 0===a&&(a=-1),n.call(this,e,t),this.center=i,this.strength=r,this.innerRadius=o,this.radius=a}n&&(r.__proto__=n),(r.prototype=Object.create(n&&n.prototype)).constructor=r;var i={center:{configurable:!0},strength:{configurable:!0},innerRadius:{configurable:!0},radius:{configurable:!0}};return i.center.get=function(){return this.uniforms.uCenter},i.center.set=function(n){this.uniforms.uCenter=n},i.strength.get=function(){return this.uniforms.uStrength},i.strength.set=function(n){this.uniforms.uStrength=n},i.innerRadius.get=function(){return this.uniforms.uInnerRadius},i.innerRadius.set=function(n){this.uniforms.uInnerRadius=n},i.radius.get=function(){return this.uniforms.uRadius},i.radius.set=function(n){(n<0||n===1/0)&&(n=-1),this.uniforms.uRadius=n},Object.defineProperties(r.prototype,i),r}(PIXI.Filter);PIXI.filters.ZoomBlurFilter=r,n.ZoomBlurFilter=r,Object.defineProperty(n,"__esModule",{value:!0})});
//# sourceMappingURL=filter-zoom-blur.js.map

},{}],25:[function(require,module,exports){
/*!
 * pixi-filters - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var filterAdvancedBloom=require("@pixi/filter-advanced-bloom"),filterAscii=require("@pixi/filter-ascii"),filterBloom=require("@pixi/filter-bloom"),filterBulgePinch=require("@pixi/filter-bulge-pinch"),filterColorReplace=require("@pixi/filter-color-replace"),filterConvolution=require("@pixi/filter-convolution"),filterCrossHatch=require("@pixi/filter-cross-hatch"),filterDot=require("@pixi/filter-dot"),filterDropShadow=require("@pixi/filter-drop-shadow"),filterEmboss=require("@pixi/filter-emboss"),filterGlow=require("@pixi/filter-glow"),filterGodray=require("@pixi/filter-godray"),filterMotionBlur=require("@pixi/filter-motion-blur"),filterMultiColorReplace=require("@pixi/filter-multi-color-replace"),filterOldFilm=require("@pixi/filter-old-film"),filterOutline=require("@pixi/filter-outline"),filterPixelate=require("@pixi/filter-pixelate"),filterRgbSplit=require("@pixi/filter-rgb-split"),filterRadialBlur=require("@pixi/filter-radial-blur"),filterShockwave=require("@pixi/filter-shockwave"),filterSimpleLightmap=require("@pixi/filter-simple-lightmap"),filterTiltShift=require("@pixi/filter-tilt-shift"),filterTwist=require("@pixi/filter-twist"),filterZoomBlur=require("@pixi/filter-zoom-blur");exports.AdvancedBloomFilter=filterAdvancedBloom.AdvancedBloomFilter,exports.AsciiFilter=filterAscii.AsciiFilter,exports.BloomFilter=filterBloom.BloomFilter,exports.BulgePinchFilter=filterBulgePinch.BulgePinchFilter,exports.ColorReplaceFilter=filterColorReplace.ColorReplaceFilter,exports.ConvolutionFilter=filterConvolution.ConvolutionFilter,exports.CrossHatchFilter=filterCrossHatch.CrossHatchFilter,exports.DotFilter=filterDot.DotFilter,exports.DropShadowFilter=filterDropShadow.DropShadowFilter,exports.EmbossFilter=filterEmboss.EmbossFilter,exports.GlowFilter=filterGlow.GlowFilter,exports.GodrayFilter=filterGodray.GodrayFilter,exports.MotionBlurFilter=filterMotionBlur.MotionBlurFilter,exports.MultiColorReplaceFilter=filterMultiColorReplace.MultiColorReplaceFilter,exports.OldFilmFilter=filterOldFilm.OldFilmFilter,exports.OutlineFilter=filterOutline.OutlineFilter,exports.PixelateFilter=filterPixelate.PixelateFilter,exports.RGBSplitFilter=filterRgbSplit.RGBSplitFilter,exports.RadialBlurFilter=filterRadialBlur.RadialBlurFilter,exports.ShockwaveFilter=filterShockwave.ShockwaveFilter,exports.SimpleLightmapFilter=filterSimpleLightmap.SimpleLightmapFilter,exports.TiltShiftFilter=filterTiltShift.TiltShiftFilter,exports.TiltShiftAxisFilter=filterTiltShift.TiltShiftAxisFilter,exports.TiltShiftXFilter=filterTiltShift.TiltShiftXFilter,exports.TiltShiftYFilter=filterTiltShift.TiltShiftYFilter,exports.TwistFilter=filterTwist.TwistFilter,exports.ZoomBlurFilter=filterZoomBlur.ZoomBlurFilter;
//# sourceMappingURL=pixi-filters.js.map

},{"@pixi/filter-advanced-bloom":1,"@pixi/filter-ascii":2,"@pixi/filter-bloom":3,"@pixi/filter-bulge-pinch":4,"@pixi/filter-color-replace":5,"@pixi/filter-convolution":6,"@pixi/filter-cross-hatch":7,"@pixi/filter-dot":8,"@pixi/filter-drop-shadow":9,"@pixi/filter-emboss":10,"@pixi/filter-glow":11,"@pixi/filter-godray":12,"@pixi/filter-motion-blur":13,"@pixi/filter-multi-color-replace":14,"@pixi/filter-old-film":15,"@pixi/filter-outline":16,"@pixi/filter-pixelate":17,"@pixi/filter-radial-blur":18,"@pixi/filter-rgb-split":19,"@pixi/filter-shockwave":20,"@pixi/filter-simple-lightmap":21,"@pixi/filter-tilt-shift":22,"@pixi/filter-twist":23,"@pixi/filter-zoom-blur":24}],26:[function(require,module,exports){
var pixi_projection;
(function (pixi_projection) {
    var utils;
    (function (utils) {
        function createIndicesForQuads(size) {
            var totalIndices = size * 6;
            var indices = new Uint16Array(totalIndices);
            for (var i = 0, j = 0; i < totalIndices; i += 6, j += 4) {
                indices[i + 0] = j + 0;
                indices[i + 1] = j + 1;
                indices[i + 2] = j + 2;
                indices[i + 3] = j + 0;
                indices[i + 4] = j + 2;
                indices[i + 5] = j + 3;
            }
            return indices;
        }
        utils.createIndicesForQuads = createIndicesForQuads;
        function isPow2(v) {
            return !(v & (v - 1)) && (!!v);
        }
        utils.isPow2 = isPow2;
        function nextPow2(v) {
            v += +(v === 0);
            --v;
            v |= v >>> 1;
            v |= v >>> 2;
            v |= v >>> 4;
            v |= v >>> 8;
            v |= v >>> 16;
            return v + 1;
        }
        utils.nextPow2 = nextPow2;
        function log2(v) {
            var r, shift;
            r = +(v > 0xFFFF) << 4;
            v >>>= r;
            shift = +(v > 0xFF) << 3;
            v >>>= shift;
            r |= shift;
            shift = +(v > 0xF) << 2;
            v >>>= shift;
            r |= shift;
            shift = +(v > 0x3) << 1;
            v >>>= shift;
            r |= shift;
            return r | (v >> 1);
        }
        utils.log2 = log2;
        function getIntersectionFactor(p1, p2, p3, p4, out) {
            var A1 = p2.x - p1.x, B1 = p3.x - p4.x, C1 = p3.x - p1.x;
            var A2 = p2.y - p1.y, B2 = p3.y - p4.y, C2 = p3.y - p1.y;
            var D = A1 * B2 - A2 * B1;
            if (Math.abs(D) < 1e-7) {
                out.x = A1;
                out.y = A2;
                return 0;
            }
            var T = C1 * B2 - C2 * B1;
            var U = A1 * C2 - A2 * C1;
            var t = T / D, u = U / D;
            if (u < (1e-6) || u - 1 > -1e-6) {
                return -1;
            }
            out.x = p1.x + t * (p2.x - p1.x);
            out.y = p1.y + t * (p2.y - p1.y);
            return 1;
        }
        utils.getIntersectionFactor = getIntersectionFactor;
        function getPositionFromQuad(p, anchor, out) {
            out = out || new PIXI.Point();
            var a1 = 1.0 - anchor.x, a2 = 1.0 - a1;
            var b1 = 1.0 - anchor.y, b2 = 1.0 - b1;
            out.x = (p[0].x * a1 + p[1].x * a2) * b1 + (p[3].x * a1 + p[2].x * a2) * b2;
            out.y = (p[0].y * a1 + p[1].y * a2) * b1 + (p[3].y * a1 + p[2].y * a2) * b2;
            return out;
        }
        utils.getPositionFromQuad = getPositionFromQuad;
    })(utils = pixi_projection.utils || (pixi_projection.utils = {}));
})(pixi_projection || (pixi_projection = {}));
PIXI.projection = pixi_projection;
var pixi_projection;
(function (pixi_projection) {
    var Projection = (function () {
        function Projection(legacy, enable) {
            if (enable === void 0) { enable = true; }
            this._enabled = false;
            this.legacy = legacy;
            if (enable) {
                this.enabled = true;
            }
            this.legacy.proj = this;
        }
        Object.defineProperty(Projection.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                this._enabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Projection.prototype.clear = function () {
        };
        return Projection;
    }());
    pixi_projection.Projection = Projection;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var webgl;
    (function (webgl) {
        var BatchBuffer = (function () {
            function BatchBuffer(size) {
                this.vertices = new ArrayBuffer(size);
                this.float32View = new Float32Array(this.vertices);
                this.uint32View = new Uint32Array(this.vertices);
            }
            BatchBuffer.prototype.destroy = function () {
                this.vertices = null;
            };
            return BatchBuffer;
        }());
        webgl.BatchBuffer = BatchBuffer;
    })(webgl = pixi_projection.webgl || (pixi_projection.webgl = {}));
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var webgl;
    (function (webgl) {
        function generateMultiTextureShader(vertexSrc, fragmentSrc, gl, maxTextures) {
            fragmentSrc = fragmentSrc.replace(/%count%/gi, maxTextures + '');
            fragmentSrc = fragmentSrc.replace(/%forloop%/gi, generateSampleSrc(maxTextures));
            var shader = new PIXI.Shader(gl, vertexSrc, fragmentSrc);
            var sampleValues = new Int32Array(maxTextures);
            for (var i = 0; i < maxTextures; i++) {
                sampleValues[i] = i;
            }
            shader.bind();
            shader.uniforms.uSamplers = sampleValues;
            return shader;
        }
        webgl.generateMultiTextureShader = generateMultiTextureShader;
        function generateSampleSrc(maxTextures) {
            var src = '';
            src += '\n';
            src += '\n';
            for (var i = 0; i < maxTextures; i++) {
                if (i > 0) {
                    src += '\nelse ';
                }
                if (i < maxTextures - 1) {
                    src += "if(textureId == " + i + ".0)";
                }
                src += '\n{';
                src += "\n\tcolor = texture2D(uSamplers[" + i + "], textureCoord);";
                src += '\n}';
            }
            src += '\n';
            src += '\n';
            return src;
        }
    })(webgl = pixi_projection.webgl || (pixi_projection.webgl = {}));
})(pixi_projection || (pixi_projection = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var pixi_projection;
(function (pixi_projection) {
    var webgl;
    (function (webgl) {
        var ObjectRenderer = PIXI.ObjectRenderer;
        var settings = PIXI.settings;
        var GLBuffer = PIXI.glCore.GLBuffer;
        var premultiplyTint = PIXI.utils.premultiplyTint;
        var premultiplyBlendMode = PIXI.utils.premultiplyBlendMode;
        var TICK = 0;
        var BatchGroup = (function () {
            function BatchGroup() {
                this.textures = [];
                this.textureCount = 0;
                this.ids = [];
                this.size = 0;
                this.start = 0;
                this.blend = PIXI.BLEND_MODES.NORMAL;
                this.uniforms = null;
            }
            return BatchGroup;
        }());
        webgl.BatchGroup = BatchGroup;
        var MultiTextureSpriteRenderer = (function (_super) {
            __extends(MultiTextureSpriteRenderer, _super);
            function MultiTextureSpriteRenderer(renderer) {
                var _this = _super.call(this, renderer) || this;
                _this.shaderVert = '';
                _this.shaderFrag = '';
                _this.MAX_TEXTURES_LOCAL = 32;
                _this.vertSize = 5;
                _this.vertByteSize = _this.vertSize * 4;
                _this.size = settings.SPRITE_BATCH_SIZE;
                _this.currentIndex = 0;
                _this.sprites = [];
                _this.vertexBuffers = [];
                _this.vaos = [];
                _this.vaoMax = 2;
                _this.vertexCount = 0;
                _this.MAX_TEXTURES = 1;
                _this.indices = pixi_projection.utils.createIndicesForQuads(_this.size);
                _this.groups = [];
                for (var k = 0; k < _this.size; k++) {
                    _this.groups[k] = new BatchGroup();
                }
                _this.vaoMax = 2;
                _this.vertexCount = 0;
                _this.renderer.on('prerender', _this.onPrerender, _this);
                return _this;
            }
            MultiTextureSpriteRenderer.prototype.getUniforms = function (spr) {
                return null;
            };
            MultiTextureSpriteRenderer.prototype.syncUniforms = function (obj) {
                if (!obj)
                    return;
                var sh = this.shader;
                for (var key in obj) {
                    sh.uniforms[key] = obj[key];
                }
            };
            MultiTextureSpriteRenderer.prototype.onContextChange = function () {
                var gl = this.renderer.gl;
                this.MAX_TEXTURES = Math.min(this.MAX_TEXTURES_LOCAL, this.renderer.plugins['sprite'].MAX_TEXTURES);
                this.shader = webgl.generateMultiTextureShader(this.shaderVert, this.shaderFrag, gl, this.MAX_TEXTURES);
                this.indexBuffer = GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);
                this.renderer.bindVao(null);
                var attrs = this.shader.attributes;
                for (var i = 0; i < this.vaoMax; i++) {
                    var vertexBuffer = this.vertexBuffers[i] = GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
                    this.vaos[i] = this.createVao(vertexBuffer);
                }
                if (!this.buffers) {
                    this.buffers = [];
                    for (var i = 1; i <= pixi_projection.utils.nextPow2(this.size); i *= 2) {
                        this.buffers.push(new webgl.BatchBuffer(i * 4 * this.vertByteSize));
                    }
                }
                this.vao = this.vaos[0];
            };
            MultiTextureSpriteRenderer.prototype.onPrerender = function () {
                this.vertexCount = 0;
            };
            MultiTextureSpriteRenderer.prototype.render = function (sprite) {
                if (this.currentIndex >= this.size) {
                    this.flush();
                }
                if (!sprite._texture._uvs) {
                    return;
                }
                if (!sprite._texture.baseTexture) {
                    return;
                }
                this.sprites[this.currentIndex++] = sprite;
            };
            MultiTextureSpriteRenderer.prototype.flush = function () {
                if (this.currentIndex === 0) {
                    return;
                }
                var gl = this.renderer.gl;
                var MAX_TEXTURES = this.MAX_TEXTURES;
                var np2 = pixi_projection.utils.nextPow2(this.currentIndex);
                var log2 = pixi_projection.utils.log2(np2);
                var buffer = this.buffers[log2];
                var sprites = this.sprites;
                var groups = this.groups;
                var float32View = buffer.float32View;
                var uint32View = buffer.uint32View;
                var index = 0;
                var nextTexture;
                var currentTexture;
                var currentUniforms = null;
                var groupCount = 1;
                var textureCount = 0;
                var currentGroup = groups[0];
                var vertexData;
                var uvs;
                var blendMode = premultiplyBlendMode[sprites[0]._texture.baseTexture.premultipliedAlpha ? 1 : 0][sprites[0].blendMode];
                currentGroup.textureCount = 0;
                currentGroup.start = 0;
                currentGroup.blend = blendMode;
                TICK++;
                var i;
                for (i = 0; i < this.currentIndex; ++i) {
                    var sprite = sprites[i];
                    nextTexture = sprite._texture.baseTexture;
                    var spriteBlendMode = premultiplyBlendMode[Number(nextTexture.premultipliedAlpha)][sprite.blendMode];
                    if (blendMode !== spriteBlendMode) {
                        blendMode = spriteBlendMode;
                        currentTexture = null;
                        textureCount = MAX_TEXTURES;
                        TICK++;
                    }
                    var uniforms = this.getUniforms(sprite);
                    if (currentUniforms !== uniforms) {
                        currentUniforms = uniforms;
                        currentTexture = null;
                        textureCount = MAX_TEXTURES;
                        TICK++;
                    }
                    if (currentTexture !== nextTexture) {
                        currentTexture = nextTexture;
                        if (nextTexture._enabled !== TICK) {
                            if (textureCount === MAX_TEXTURES) {
                                TICK++;
                                textureCount = 0;
                                currentGroup.size = i - currentGroup.start;
                                currentGroup = groups[groupCount++];
                                currentGroup.textureCount = 0;
                                currentGroup.blend = blendMode;
                                currentGroup.start = i;
                                currentGroup.uniforms = currentUniforms;
                            }
                            nextTexture._enabled = TICK;
                            nextTexture._virtalBoundId = textureCount;
                            currentGroup.textures[currentGroup.textureCount++] = nextTexture;
                            textureCount++;
                        }
                    }
                    var alpha = Math.min(sprite.worldAlpha, 1.0);
                    var argb = alpha < 1.0 && nextTexture.premultipliedAlpha ? premultiplyTint(sprite._tintRGB, alpha)
                        : sprite._tintRGB + (alpha * 255 << 24);
                    this.fillVertices(float32View, uint32View, index, sprite, argb, nextTexture._virtalBoundId);
                    index += this.vertSize * 4;
                }
                currentGroup.size = i - currentGroup.start;
                if (!settings.CAN_UPLOAD_SAME_BUFFER) {
                    if (this.vaoMax <= this.vertexCount) {
                        this.vaoMax++;
                        var attrs = this.shader.attributes;
                        var vertexBuffer = this.vertexBuffers[this.vertexCount] = GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
                        this.vaos[this.vertexCount] = this.createVao(vertexBuffer);
                    }
                    this.renderer.bindVao(this.vaos[this.vertexCount]);
                    this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, false);
                    this.vertexCount++;
                }
                else {
                    this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, true);
                }
                currentUniforms = null;
                for (i = 0; i < groupCount; i++) {
                    var group = groups[i];
                    var groupTextureCount = group.textureCount;
                    if (group.uniforms !== currentUniforms) {
                        this.syncUniforms(group.uniforms);
                    }
                    for (var j = 0; j < groupTextureCount; j++) {
                        this.renderer.bindTexture(group.textures[j], j, true);
                        group.textures[j]._virtalBoundId = -1;
                        var v = this.shader.uniforms.samplerSize;
                        if (v) {
                            v[0] = group.textures[j].realWidth;
                            v[1] = group.textures[j].realHeight;
                            this.shader.uniforms.samplerSize = v;
                        }
                    }
                    this.renderer.state.setBlendMode(group.blend);
                    gl.drawElements(gl.TRIANGLES, group.size * 6, gl.UNSIGNED_SHORT, group.start * 6 * 2);
                }
                this.currentIndex = 0;
            };
            MultiTextureSpriteRenderer.prototype.start = function () {
                this.renderer.bindShader(this.shader);
                if (settings.CAN_UPLOAD_SAME_BUFFER) {
                    this.renderer.bindVao(this.vaos[this.vertexCount]);
                    this.vertexBuffers[this.vertexCount].bind();
                }
            };
            MultiTextureSpriteRenderer.prototype.stop = function () {
                this.flush();
            };
            MultiTextureSpriteRenderer.prototype.destroy = function () {
                for (var i = 0; i < this.vaoMax; i++) {
                    if (this.vertexBuffers[i]) {
                        this.vertexBuffers[i].destroy();
                    }
                    if (this.vaos[i]) {
                        this.vaos[i].destroy();
                    }
                }
                if (this.indexBuffer) {
                    this.indexBuffer.destroy();
                }
                this.renderer.off('prerender', this.onPrerender, this);
                _super.prototype.destroy.call(this);
                if (this.shader) {
                    this.shader.destroy();
                    this.shader = null;
                }
                this.vertexBuffers = null;
                this.vaos = null;
                this.indexBuffer = null;
                this.indices = null;
                this.sprites = null;
                for (var i = 0; i < this.buffers.length; ++i) {
                    this.buffers[i].destroy();
                }
            };
            return MultiTextureSpriteRenderer;
        }(ObjectRenderer));
        webgl.MultiTextureSpriteRenderer = MultiTextureSpriteRenderer;
    })(webgl = pixi_projection.webgl || (pixi_projection.webgl = {}));
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var p = [new PIXI.Point(), new PIXI.Point(), new PIXI.Point(), new PIXI.Point()];
    var a = [0, 0, 0, 0];
    var Surface = (function () {
        function Surface() {
            this.surfaceID = "default";
            this._updateID = 0;
            this.vertexSrc = "";
            this.fragmentSrc = "";
        }
        Surface.prototype.fillUniforms = function (uniforms) {
        };
        Surface.prototype.clear = function () {
        };
        Surface.prototype.boundsQuad = function (v, out, after) {
            var minX = out[0], minY = out[1];
            var maxX = out[0], maxY = out[1];
            for (var i = 2; i < 8; i += 2) {
                if (minX > out[i])
                    minX = out[i];
                if (maxX < out[i])
                    maxX = out[i];
                if (minY > out[i + 1])
                    minY = out[i + 1];
                if (maxY < out[i + 1])
                    maxY = out[i + 1];
            }
            p[0].set(minX, minY);
            this.apply(p[0], p[0]);
            p[1].set(maxX, minY);
            this.apply(p[1], p[1]);
            p[2].set(maxX, maxY);
            this.apply(p[2], p[2]);
            p[3].set(minX, maxY);
            this.apply(p[3], p[3]);
            if (after) {
                after.apply(p[0], p[0]);
                after.apply(p[1], p[1]);
                after.apply(p[2], p[2]);
                after.apply(p[3], p[3]);
                out[0] = p[0].x;
                out[1] = p[0].y;
                out[2] = p[1].x;
                out[3] = p[1].y;
                out[4] = p[2].x;
                out[5] = p[2].y;
                out[6] = p[3].x;
                out[7] = p[3].y;
            }
            else {
                for (var i = 1; i <= 3; i++) {
                    if (p[i].y < p[0].y || p[i].y == p[0].y && p[i].x < p[0].x) {
                        var t = p[0];
                        p[0] = p[i];
                        p[i] = t;
                    }
                }
                for (var i = 1; i <= 3; i++) {
                    a[i] = Math.atan2(p[i].y - p[0].y, p[i].x - p[0].x);
                }
                for (var i = 1; i <= 3; i++) {
                    for (var j = i + 1; j <= 3; j++) {
                        if (a[i] > a[j]) {
                            var t = p[i];
                            p[i] = p[j];
                            p[j] = t;
                            var t2 = a[i];
                            a[i] = a[j];
                            a[j] = t2;
                        }
                    }
                }
                out[0] = p[0].x;
                out[1] = p[0].y;
                out[2] = p[1].x;
                out[3] = p[1].y;
                out[4] = p[2].x;
                out[5] = p[2].y;
                out[6] = p[3].x;
                out[7] = p[3].y;
                if ((p[3].x - p[2].x) * (p[1].y - p[2].y) - (p[1].x - p[2].x) * (p[3].y - p[2].y) < 0) {
                    out[4] = p[3].x;
                    out[5] = p[3].y;
                    return;
                }
            }
        };
        return Surface;
    }());
    pixi_projection.Surface = Surface;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var tempMat = new PIXI.Matrix();
    var tempRect = new PIXI.Rectangle();
    var tempPoint = new PIXI.Point();
    var BilinearSurface = (function (_super) {
        __extends(BilinearSurface, _super);
        function BilinearSurface() {
            var _this = _super.call(this) || this;
            _this.distortion = new PIXI.Point();
            return _this;
        }
        BilinearSurface.prototype.clear = function () {
            this.distortion.set(0, 0);
        };
        BilinearSurface.prototype.apply = function (pos, newPos) {
            newPos = newPos || new PIXI.Point();
            var d = this.distortion;
            var m = pos.x * pos.y;
            newPos.x = pos.x + d.x * m;
            newPos.y = pos.y + d.y * m;
            return newPos;
        };
        BilinearSurface.prototype.applyInverse = function (pos, newPos) {
            newPos = newPos || new PIXI.Point();
            var vx = pos.x, vy = pos.y;
            var dx = this.distortion.x, dy = this.distortion.y;
            if (dx == 0.0) {
                newPos.x = vx;
                newPos.y = vy / (1.0 + dy * vx);
            }
            else if (dy == 0.0) {
                newPos.y = vy;
                newPos.x = vx / (1.0 + dx * vy);
            }
            else {
                var b = (vy * dx - vx * dy + 1.0) * 0.5 / dy;
                var d = b * b + vx / dy;
                if (d <= 0.00001) {
                    newPos.set(NaN, NaN);
                    return;
                }
                if (dy > 0.0) {
                    newPos.x = -b + Math.sqrt(d);
                }
                else {
                    newPos.x = -b - Math.sqrt(d);
                }
                newPos.y = (vx / newPos.x - 1.0) / dx;
            }
            return newPos;
        };
        BilinearSurface.prototype.mapSprite = function (sprite, quad, outTransform) {
            var tex = sprite.texture;
            tempRect.x = -sprite.anchor.x * tex.orig.width;
            tempRect.y = -sprite.anchor.y * tex.orig.height;
            tempRect.width = tex.orig.width;
            tempRect.height = tex.orig.height;
            return this.mapQuad(tempRect, quad, outTransform || sprite.transform);
        };
        BilinearSurface.prototype.mapQuad = function (rect, quad, outTransform) {
            var ax = -rect.x / rect.width;
            var ay = -rect.y / rect.height;
            var ax2 = (1.0 - rect.x) / rect.width;
            var ay2 = (1.0 - rect.y) / rect.height;
            var up1x = (quad[0].x * (1.0 - ax) + quad[1].x * ax);
            var up1y = (quad[0].y * (1.0 - ax) + quad[1].y * ax);
            var up2x = (quad[0].x * (1.0 - ax2) + quad[1].x * ax2);
            var up2y = (quad[0].y * (1.0 - ax2) + quad[1].y * ax2);
            var down1x = (quad[3].x * (1.0 - ax) + quad[2].x * ax);
            var down1y = (quad[3].y * (1.0 - ax) + quad[2].y * ax);
            var down2x = (quad[3].x * (1.0 - ax2) + quad[2].x * ax2);
            var down2y = (quad[3].y * (1.0 - ax2) + quad[2].y * ax2);
            var x00 = up1x * (1.0 - ay) + down1x * ay;
            var y00 = up1y * (1.0 - ay) + down1y * ay;
            var x10 = up2x * (1.0 - ay) + down2x * ay;
            var y10 = up2y * (1.0 - ay) + down2y * ay;
            var x01 = up1x * (1.0 - ay2) + down1x * ay2;
            var y01 = up1y * (1.0 - ay2) + down1y * ay2;
            var x11 = up2x * (1.0 - ay2) + down2x * ay2;
            var y11 = up2y * (1.0 - ay2) + down2y * ay2;
            var mat = tempMat;
            mat.tx = x00;
            mat.ty = y00;
            mat.a = x10 - x00;
            mat.b = y10 - y00;
            mat.c = x01 - x00;
            mat.d = y01 - y00;
            tempPoint.set(x11, y11);
            mat.applyInverse(tempPoint, tempPoint);
            this.distortion.set(tempPoint.x - 1, tempPoint.y - 1);
            outTransform.setFromMatrix(mat);
            return this;
        };
        BilinearSurface.prototype.fillUniforms = function (uniforms) {
            uniforms.distortion = uniforms.distortion || new Float32Array([0, 0, 0, 0]);
            var ax = Math.abs(this.distortion.x);
            var ay = Math.abs(this.distortion.y);
            uniforms.distortion[0] = ax * 10000 <= ay ? 0 : this.distortion.x;
            uniforms.distortion[1] = ay * 10000 <= ax ? 0 : this.distortion.y;
            uniforms.distortion[2] = 1.0 / uniforms.distortion[0];
            uniforms.distortion[3] = 1.0 / uniforms.distortion[1];
        };
        return BilinearSurface;
    }(pixi_projection.Surface));
    pixi_projection.BilinearSurface = BilinearSurface;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Container2s = (function (_super) {
        __extends(Container2s, _super);
        function Container2s() {
            var _this = _super.call(this) || this;
            _this.proj = new pixi_projection.ProjectionSurface(_this.transform);
            return _this;
        }
        Object.defineProperty(Container2s.prototype, "worldTransform", {
            get: function () {
                return this.proj;
            },
            enumerable: true,
            configurable: true
        });
        return Container2s;
    }(PIXI.Container));
    pixi_projection.Container2s = Container2s;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var fun = PIXI.TransformStatic.prototype.updateTransform;
    function transformHack(parentTransform) {
        var proj = this.proj;
        var pp = parentTransform.proj;
        var ta = this;
        if (!pp) {
            fun.call(this, parentTransform);
            proj._activeProjection = null;
            return;
        }
        if (pp._surface) {
            proj._activeProjection = pp;
            this.updateLocalTransform();
            this.localTransform.copy(this.worldTransform);
            if (ta._parentID < 0) {
                ++ta._worldID;
            }
            return;
        }
        fun.call(this, parentTransform);
        proj._activeProjection = pp._activeProjection;
    }
    var ProjectionSurface = (function (_super) {
        __extends(ProjectionSurface, _super);
        function ProjectionSurface(legacy, enable) {
            var _this = _super.call(this, legacy, enable) || this;
            _this._surface = null;
            _this._activeProjection = null;
            _this._currentSurfaceID = -1;
            _this._currentLegacyID = -1;
            _this._lastUniforms = null;
            return _this;
        }
        Object.defineProperty(ProjectionSurface.prototype, "enabled", {
            set: function (value) {
                if (value === this._enabled) {
                    return;
                }
                this._enabled = value;
                if (value) {
                    this.legacy.updateTransform = transformHack;
                    this.legacy._parentID = -1;
                }
                else {
                    this.legacy.updateTransform = PIXI.TransformStatic.prototype.updateTransform;
                    this.legacy._parentID = -1;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProjectionSurface.prototype, "surface", {
            get: function () {
                return this._surface;
            },
            set: function (value) {
                if (this._surface == value) {
                    return;
                }
                this._surface = value || null;
                this.legacy._parentID = -1;
            },
            enumerable: true,
            configurable: true
        });
        ProjectionSurface.prototype.applyPartial = function (pos, newPos) {
            if (this._activeProjection !== null) {
                newPos = this.legacy.worldTransform.apply(pos, newPos);
                return this._activeProjection.surface.apply(newPos, newPos);
            }
            if (this._surface !== null) {
                return this.surface.apply(pos, newPos);
            }
            return this.legacy.worldTransform.apply(pos, newPos);
        };
        ProjectionSurface.prototype.apply = function (pos, newPos) {
            if (this._activeProjection !== null) {
                newPos = this.legacy.worldTransform.apply(pos, newPos);
                this._activeProjection.surface.apply(newPos, newPos);
                return this._activeProjection.legacy.worldTransform.apply(newPos, newPos);
            }
            if (this._surface !== null) {
                newPos = this.surface.apply(pos, newPos);
                return this.legacy.worldTransform.apply(newPos, newPos);
            }
            return this.legacy.worldTransform.apply(pos, newPos);
        };
        ProjectionSurface.prototype.applyInverse = function (pos, newPos) {
            if (this._activeProjection !== null) {
                newPos = this._activeProjection.legacy.worldTransform.applyInverse(pos, newPos);
                this._activeProjection._surface.applyInverse(newPos, newPos);
                return this.legacy.worldTransform.applyInverse(newPos, newPos);
            }
            if (this._surface !== null) {
                newPos = this.legacy.worldTransform.applyInverse(pos, newPos);
                return this._surface.applyInverse(newPos, newPos);
            }
            return this.legacy.worldTransform.applyInverse(pos, newPos);
        };
        ProjectionSurface.prototype.mapBilinearSprite = function (sprite, quad) {
            if (!(this._surface instanceof pixi_projection.BilinearSurface)) {
                this.surface = new pixi_projection.BilinearSurface();
            }
            this.surface.mapSprite(sprite, quad, this.legacy);
        };
        ProjectionSurface.prototype.clear = function () {
            if (this.surface) {
                this.surface.clear();
            }
        };
        Object.defineProperty(ProjectionSurface.prototype, "uniforms", {
            get: function () {
                if (this._currentLegacyID === this.legacy._worldID &&
                    this._currentSurfaceID === this.surface._updateID) {
                    return this._lastUniforms;
                }
                this._lastUniforms = this._lastUniforms || {};
                this._lastUniforms.worldTransform = this.legacy.worldTransform.toArray(true);
                this._surface.fillUniforms(this._lastUniforms);
                return this._lastUniforms;
            },
            enumerable: true,
            configurable: true
        });
        return ProjectionSurface;
    }(pixi_projection.Projection));
    pixi_projection.ProjectionSurface = ProjectionSurface;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var MultiTextureSpriteRenderer = pixi_projection.webgl.MultiTextureSpriteRenderer;
    var SpriteBilinearRenderer = (function (_super) {
        __extends(SpriteBilinearRenderer, _super);
        function SpriteBilinearRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.size = 100;
            _this.MAX_TEXTURES_LOCAL = 1;
            _this.shaderVert = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec3 aTrans1;\nattribute vec3 aTrans2;\nattribute vec4 aFrame;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 worldTransform;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vTrans1;\nvarying vec3 vTrans2;\nvarying vec4 vFrame;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position.xyw = projectionMatrix * worldTransform * vec3(aVertexPosition, 1.0);\n    gl_Position.z = 0.0;\n    \n    vTextureCoord = aVertexPosition;\n    vTrans1 = aTrans1;\n    vTrans2 = aTrans2;\n    vTextureId = aTextureId;\n    vColor = aColor;\n    vFrame = aFrame;\n}\n";
            _this.shaderFrag = "precision highp float;\nvarying vec2 vTextureCoord;\nvarying vec3 vTrans1;\nvarying vec3 vTrans2;\nvarying vec4 vFrame;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nuniform sampler2D uSamplers[%count%];\nuniform vec2 samplerSize[%count%]; \nuniform vec4 distortion;\n\nvoid main(void){\nvec2 surface;\nvec2 surface2;\n\nfloat vx = vTextureCoord.x;\nfloat vy = vTextureCoord.y;\nfloat dx = distortion.x;\nfloat dy = distortion.y;\nfloat revx = distortion.z;\nfloat revy = distortion.w;\n\nif (distortion.x == 0.0) {\n    surface.x = vx;\n    surface.y = vy / (1.0 + dy * vx);\n    surface2 = surface;\n} else\nif (distortion.y == 0.0) {\n    surface.y = vy;\n    surface.x = vx/ (1.0 + dx * vy);\n    surface2 = surface;\n} else {\n    float c = vy * dx - vx * dy;\n    float b = (c + 1.0) * 0.5;\n    float b2 = (-c + 1.0) * 0.5;\n    float d = b * b + vx * dy;\n    if (d < -0.00001) {\n        discard;\n    }\n    d = sqrt(max(d, 0.0));\n    surface.x = (- b + d) * revy;\n    surface2.x = (- b - d) * revy;\n    surface.y = (- b2 + d) * revx;\n    surface2.y = (- b2 - d) * revx;\n}\n\nvec2 uv;\nuv.x = vTrans1.x * surface.x + vTrans1.y * surface.y + vTrans1.z;\nuv.y = vTrans2.x * surface.x + vTrans2.y * surface.y + vTrans2.z;\n\nvec2 pixels = uv * samplerSize[0];\n\nif (pixels.x < vFrame.x || pixels.x > vFrame.z ||\n    pixels.y < vFrame.y || pixels.y > vFrame.w) {\n    uv.x = vTrans1.x * surface2.x + vTrans1.y * surface2.y + vTrans1.z;\n    uv.y = vTrans2.x * surface2.x + vTrans2.y * surface2.y + vTrans2.z;\n    pixels = uv * samplerSize[0];\n    \n    if (pixels.x < vFrame.x || pixels.x > vFrame.z ||\n        pixels.y < vFrame.y || pixels.y > vFrame.w) {\n        discard;\n    }\n}\n\nvec4 edge;\nedge.xy = clamp(pixels - vFrame.xy + 0.5, vec2(0.0, 0.0), vec2(1.0, 1.0));\nedge.zw = clamp(vFrame.zw - pixels + 0.5, vec2(0.0, 0.0), vec2(1.0, 1.0));\n\nfloat alpha = 1.0; //edge.x * edge.y * edge.z * edge.w;\nvec4 rColor = vColor * alpha;\n\nfloat textureId = floor(vTextureId+0.5);\nvec4 color;\nvec2 textureCoord = uv;\n%forloop%\ngl_FragColor = color * rColor;\n}";
            _this.defUniforms = {
                worldTransform: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                distortion: new Float32Array([0, 0])
            };
            return _this;
        }
        SpriteBilinearRenderer.prototype.getUniforms = function (sprite) {
            var proj = sprite.proj;
            var shader = this.shader;
            if (proj.surface !== null) {
                return proj.uniforms;
            }
            if (proj._activeProjection !== null) {
                return proj._activeProjection.uniforms;
            }
            return this.defUniforms;
        };
        SpriteBilinearRenderer.prototype.createVao = function (vertexBuffer) {
            var attrs = this.shader.attributes;
            this.vertSize = 14;
            this.vertByteSize = this.vertSize * 4;
            var gl = this.renderer.gl;
            var vao = this.renderer.createVao()
                .addIndex(this.indexBuffer)
                .addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0)
                .addAttribute(vertexBuffer, attrs.aTrans1, gl.FLOAT, false, this.vertByteSize, 2 * 4)
                .addAttribute(vertexBuffer, attrs.aTrans2, gl.FLOAT, false, this.vertByteSize, 5 * 4)
                .addAttribute(vertexBuffer, attrs.aFrame, gl.FLOAT, false, this.vertByteSize, 8 * 4)
                .addAttribute(vertexBuffer, attrs.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 12 * 4);
            if (attrs.aTextureId) {
                vao.addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 13 * 4);
            }
            return vao;
        };
        SpriteBilinearRenderer.prototype.fillVertices = function (float32View, uint32View, index, sprite, argb, textureId) {
            var vertexData = sprite.vertexData;
            var tex = sprite._texture;
            var w = tex.orig.width;
            var h = tex.orig.height;
            var ax = sprite._anchor._x;
            var ay = sprite._anchor._y;
            var frame = tex._frame;
            var aTrans = sprite.aTrans;
            for (var i = 0; i < 4; i++) {
                float32View[index] = vertexData[i * 2];
                float32View[index + 1] = vertexData[i * 2 + 1];
                float32View[index + 2] = aTrans.a;
                float32View[index + 3] = aTrans.c;
                float32View[index + 4] = aTrans.tx;
                float32View[index + 5] = aTrans.b;
                float32View[index + 6] = aTrans.d;
                float32View[index + 7] = aTrans.ty;
                float32View[index + 8] = frame.x;
                float32View[index + 9] = frame.y;
                float32View[index + 10] = frame.x + frame.width;
                float32View[index + 11] = frame.y + frame.height;
                uint32View[index + 12] = argb;
                float32View[index + 13] = textureId;
                index += 14;
            }
        };
        return SpriteBilinearRenderer;
    }(MultiTextureSpriteRenderer));
    PIXI.WebGLRenderer.registerPlugin('sprite_bilinear', SpriteBilinearRenderer);
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var MultiTextureSpriteRenderer = pixi_projection.webgl.MultiTextureSpriteRenderer;
    var SpriteStrangeRenderer = (function (_super) {
        __extends(SpriteStrangeRenderer, _super);
        function SpriteStrangeRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.size = 100;
            _this.MAX_TEXTURES_LOCAL = 1;
            _this.shaderVert = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec3 aTrans1;\nattribute vec3 aTrans2;\nattribute vec4 aFrame;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 worldTransform;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vTrans1;\nvarying vec3 vTrans2;\nvarying vec4 vFrame;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position.xyw = projectionMatrix * worldTransform * vec3(aVertexPosition, 1.0);\n    gl_Position.z = 0.0;\n    \n    vTextureCoord = aVertexPosition;\n    vTrans1 = aTrans1;\n    vTrans2 = aTrans2;\n    vTextureId = aTextureId;\n    vColor = aColor;\n    vFrame = aFrame;\n}\n";
            _this.shaderFrag = "precision highp float;\nvarying vec2 vTextureCoord;\nvarying vec3 vTrans1;\nvarying vec3 vTrans2;\nvarying vec4 vFrame;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nuniform sampler2D uSamplers[%count%];\nuniform vec2 samplerSize[%count%]; \nuniform vec4 params;\n\nvoid main(void){\nvec2 surface;\n\nfloat vx = vTextureCoord.x;\nfloat vy = vTextureCoord.y;\nfloat aleph = params.x;\nfloat bet = params.y;\nfloat A = params.z;\nfloat B = params.w;\n\nif (aleph == 0.0) {\n\tsurface.y = vy / (1.0 + vx * bet);\n\tsurface.x = vx;\n}\nelse if (bet == 0.0) {\n\tsurface.x = vx / (1.0 + vy * aleph);\n\tsurface.y = vy;\n} else {\n\tsurface.x = vx * (bet + 1.0) / (bet + 1.0 + vy * aleph);\n\tsurface.y = vy * (aleph + 1.0) / (aleph + 1.0 + vx * bet);\n}\n\nvec2 uv;\nuv.x = vTrans1.x * surface.x + vTrans1.y * surface.y + vTrans1.z;\nuv.y = vTrans2.x * surface.x + vTrans2.y * surface.y + vTrans2.z;\n\nvec2 pixels = uv * samplerSize[0];\n\nvec4 edge;\nedge.xy = clamp(pixels - vFrame.xy + 0.5, vec2(0.0, 0.0), vec2(1.0, 1.0));\nedge.zw = clamp(vFrame.zw - pixels + 0.5, vec2(0.0, 0.0), vec2(1.0, 1.0));\n\nfloat alpha = edge.x * edge.y * edge.z * edge.w;\nvec4 rColor = vColor * alpha;\n\nfloat textureId = floor(vTextureId+0.5);\nvec4 color;\nvec2 textureCoord = uv;\n%forloop%\ngl_FragColor = color * rColor;\n}";
            _this.defUniforms = {
                worldTransform: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                distortion: new Float32Array([0, 0])
            };
            return _this;
        }
        SpriteStrangeRenderer.prototype.getUniforms = function (sprite) {
            var proj = sprite.proj;
            var shader = this.shader;
            if (proj.surface !== null) {
                return proj.uniforms;
            }
            if (proj._activeProjection !== null) {
                return proj._activeProjection.uniforms;
            }
            return this.defUniforms;
        };
        SpriteStrangeRenderer.prototype.createVao = function (vertexBuffer) {
            var attrs = this.shader.attributes;
            this.vertSize = 14;
            this.vertByteSize = this.vertSize * 4;
            var gl = this.renderer.gl;
            var vao = this.renderer.createVao()
                .addIndex(this.indexBuffer)
                .addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0)
                .addAttribute(vertexBuffer, attrs.aTrans1, gl.FLOAT, false, this.vertByteSize, 2 * 4)
                .addAttribute(vertexBuffer, attrs.aTrans2, gl.FLOAT, false, this.vertByteSize, 5 * 4)
                .addAttribute(vertexBuffer, attrs.aFrame, gl.FLOAT, false, this.vertByteSize, 8 * 4)
                .addAttribute(vertexBuffer, attrs.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 12 * 4);
            if (attrs.aTextureId) {
                vao.addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 13 * 4);
            }
            return vao;
        };
        SpriteStrangeRenderer.prototype.fillVertices = function (float32View, uint32View, index, sprite, argb, textureId) {
            var vertexData = sprite.vertexData;
            var tex = sprite._texture;
            var w = tex.orig.width;
            var h = tex.orig.height;
            var ax = sprite._anchor._x;
            var ay = sprite._anchor._y;
            var frame = tex._frame;
            var aTrans = sprite.aTrans;
            for (var i = 0; i < 4; i++) {
                float32View[index] = vertexData[i * 2];
                float32View[index + 1] = vertexData[i * 2 + 1];
                float32View[index + 2] = aTrans.a;
                float32View[index + 3] = aTrans.c;
                float32View[index + 4] = aTrans.tx;
                float32View[index + 5] = aTrans.b;
                float32View[index + 6] = aTrans.d;
                float32View[index + 7] = aTrans.ty;
                float32View[index + 8] = frame.x;
                float32View[index + 9] = frame.y;
                float32View[index + 10] = frame.x + frame.width;
                float32View[index + 11] = frame.y + frame.height;
                uint32View[index + 12] = argb;
                float32View[index + 13] = textureId;
                index += 14;
            }
        };
        return SpriteStrangeRenderer;
    }(MultiTextureSpriteRenderer));
    PIXI.WebGLRenderer.registerPlugin('sprite_strange', SpriteStrangeRenderer);
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var tempMat = new PIXI.Matrix();
    var tempRect = new PIXI.Rectangle();
    var tempPoint = new PIXI.Point();
    var StrangeSurface = (function (_super) {
        __extends(StrangeSurface, _super);
        function StrangeSurface() {
            var _this = _super.call(this) || this;
            _this.params = [0, 0, NaN, NaN];
            return _this;
        }
        StrangeSurface.prototype.clear = function () {
            var p = this.params;
            p[0] = 0;
            p[1] = 0;
            p[2] = NaN;
            p[3] = NaN;
        };
        StrangeSurface.prototype.setAxisX = function (pos, factor, outTransform) {
            var x = pos.x, y = pos.y;
            var d = Math.sqrt(x * x + y * y);
            var rot = outTransform.rotation;
            if (rot !== 0) {
                outTransform.skew._x -= rot;
                outTransform.skew._y += rot;
                outTransform.rotation = 0;
            }
            outTransform.skew.y = Math.atan2(y, x);
            var p = this.params;
            if (factor !== 0) {
                p[2] = -d * factor;
            }
            else {
                p[2] = NaN;
            }
            this._calc01();
        };
        StrangeSurface.prototype.setAxisY = function (pos, factor, outTransform) {
            var x = pos.x, y = pos.y;
            var d = Math.sqrt(x * x + y * y);
            var rot = outTransform.rotation;
            if (rot !== 0) {
                outTransform.skew._x -= rot;
                outTransform.skew._y += rot;
                outTransform.rotation = 0;
            }
            outTransform.skew.x = -Math.atan2(y, x) + Math.PI / 2;
            var p = this.params;
            if (factor !== 0) {
                p[3] = -d * factor;
            }
            else {
                p[3] = NaN;
            }
            this._calc01();
        };
        StrangeSurface.prototype._calc01 = function () {
            var p = this.params;
            if (isNaN(p[2])) {
                p[1] = 0;
                if (isNaN(p[3])) {
                    p[0] = 0;
                }
                else {
                    p[0] = 1.0 / p[3];
                }
            }
            else {
                if (isNaN(p[3])) {
                    p[0] = 0;
                    p[1] = 1.0 / p[2];
                }
                else {
                    var d = 1.0 - p[2] * p[3];
                    p[0] = (1.0 - p[2]) / d;
                    p[1] = (1.0 - p[3]) / d;
                }
            }
        };
        StrangeSurface.prototype.apply = function (pos, newPos) {
            newPos = newPos || new PIXI.Point();
            var aleph = this.params[0], bet = this.params[1], A = this.params[2], B = this.params[3];
            var u = pos.x, v = pos.y;
            if (aleph === 0.0) {
                newPos.y = v * (1 + u * bet);
                newPos.x = u;
            }
            else if (bet === 0.0) {
                newPos.x = u * (1 + v * aleph);
                newPos.y = v;
            }
            else {
                var D = A * B - v * u;
                newPos.x = A * u * (B + v) / D;
                newPos.y = B * v * (A + u) / D;
            }
            return newPos;
        };
        StrangeSurface.prototype.applyInverse = function (pos, newPos) {
            newPos = newPos || new PIXI.Point();
            var aleph = this.params[0], bet = this.params[1], A = this.params[2], B = this.params[3];
            var x = pos.x, y = pos.y;
            if (aleph === 0.0) {
                newPos.y = y / (1 + x * bet);
                newPos.x = x;
            }
            else if (bet === 0.0) {
                newPos.x = x * (1 + y * aleph);
                newPos.y = y;
            }
            else {
                newPos.x = x * (bet + 1) / (bet + 1 + y * aleph);
                newPos.y = y * (aleph + 1) / (aleph + 1 + x * bet);
            }
            return newPos;
        };
        StrangeSurface.prototype.mapSprite = function (sprite, quad, outTransform) {
            var tex = sprite.texture;
            tempRect.x = -sprite.anchor.x * tex.orig.width;
            tempRect.y = -sprite.anchor.y * tex.orig.height;
            tempRect.width = tex.orig.width;
            tempRect.height = tex.orig.height;
            return this.mapQuad(tempRect, quad, outTransform || sprite.transform);
        };
        StrangeSurface.prototype.mapQuad = function (rect, quad, outTransform) {
            var ax = -rect.x / rect.width;
            var ay = -rect.y / rect.height;
            var ax2 = (1.0 - rect.x) / rect.width;
            var ay2 = (1.0 - rect.y) / rect.height;
            var up1x = (quad[0].x * (1.0 - ax) + quad[1].x * ax);
            var up1y = (quad[0].y * (1.0 - ax) + quad[1].y * ax);
            var up2x = (quad[0].x * (1.0 - ax2) + quad[1].x * ax2);
            var up2y = (quad[0].y * (1.0 - ax2) + quad[1].y * ax2);
            var down1x = (quad[3].x * (1.0 - ax) + quad[2].x * ax);
            var down1y = (quad[3].y * (1.0 - ax) + quad[2].y * ax);
            var down2x = (quad[3].x * (1.0 - ax2) + quad[2].x * ax2);
            var down2y = (quad[3].y * (1.0 - ax2) + quad[2].y * ax2);
            var x00 = up1x * (1.0 - ay) + down1x * ay;
            var y00 = up1y * (1.0 - ay) + down1y * ay;
            var x10 = up2x * (1.0 - ay) + down2x * ay;
            var y10 = up2y * (1.0 - ay) + down2y * ay;
            var x01 = up1x * (1.0 - ay2) + down1x * ay2;
            var y01 = up1y * (1.0 - ay2) + down1y * ay2;
            var x11 = up2x * (1.0 - ay2) + down2x * ay2;
            var y11 = up2y * (1.0 - ay2) + down2y * ay2;
            var mat = tempMat;
            mat.tx = x00;
            mat.ty = y00;
            mat.a = x10 - x00;
            mat.b = y10 - y00;
            mat.c = x01 - x00;
            mat.d = y01 - y00;
            tempPoint.set(x11, y11);
            mat.applyInverse(tempPoint, tempPoint);
            outTransform.setFromMatrix(mat);
            return this;
        };
        StrangeSurface.prototype.fillUniforms = function (uniforms) {
            var params = this.params;
            var distortion = uniforms.params || new Float32Array([0, 0, 0, 0]);
            uniforms.params = distortion;
            distortion[0] = params[0];
            distortion[1] = params[1];
            distortion[2] = params[2];
            distortion[3] = params[3];
        };
        return StrangeSurface;
    }(pixi_projection.Surface));
    pixi_projection.StrangeSurface = StrangeSurface;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    PIXI.Sprite.prototype.convertTo2s = function () {
        if (this.proj)
            return;
        this.pluginName = 'sprite_bilinear';
        this.aTrans = new PIXI.Matrix();
        this.calculateVertices = pixi_projection.Sprite2s.prototype.calculateVertices;
        this.calculateTrimmedVertices = pixi_projection.Sprite2s.prototype.calculateTrimmedVertices;
        this._calculateBounds = pixi_projection.Sprite2s.prototype._calculateBounds;
        PIXI.Container.prototype.convertTo2s.call(this);
    };
    PIXI.Container.prototype.convertTo2s = function () {
        if (this.proj)
            return;
        this.proj = new pixi_projection.Projection2d(this.transform);
        Object.defineProperty(this, "worldTransform", {
            get: function () {
                return this.proj;
            },
            enumerable: true,
            configurable: true
        });
    };
    PIXI.Container.prototype.convertSubtreeTo2s = function () {
        this.convertTo2s();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].convertSubtreeTo2s();
        }
    };
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Sprite2s = (function (_super) {
        __extends(Sprite2s, _super);
        function Sprite2s(texture) {
            var _this = _super.call(this, texture) || this;
            _this.aTrans = new PIXI.Matrix();
            _this.proj = new pixi_projection.ProjectionSurface(_this.transform);
            _this.pluginName = 'sprite_bilinear';
            return _this;
        }
        Sprite2s.prototype._calculateBounds = function () {
            this.calculateTrimmedVertices();
            this._bounds.addQuad(this.vertexTrimmedData);
        };
        Sprite2s.prototype.calculateVertices = function () {
            var wid = this.transform._worldID;
            var tuid = this._texture._updateID;
            if (this._transformID === wid && this._textureID === tuid) {
                return;
            }
            this._transformID = wid;
            this._textureID = tuid;
            var texture = this._texture;
            var vertexData = this.vertexData;
            var trim = texture.trim;
            var orig = texture.orig;
            var anchor = this._anchor;
            var w0 = 0;
            var w1 = 0;
            var h0 = 0;
            var h1 = 0;
            if (trim) {
                w1 = trim.x - (anchor._x * orig.width);
                w0 = w1 + trim.width;
                h1 = trim.y - (anchor._y * orig.height);
                h0 = h1 + trim.height;
            }
            else {
                w1 = -anchor._x * orig.width;
                w0 = w1 + orig.width;
                h1 = -anchor._y * orig.height;
                h0 = h1 + orig.height;
            }
            if (this.proj._surface) {
                vertexData[0] = w1;
                vertexData[1] = h1;
                vertexData[2] = w0;
                vertexData[3] = h1;
                vertexData[4] = w0;
                vertexData[5] = h0;
                vertexData[6] = w1;
                vertexData[7] = h0;
                this.proj._surface.boundsQuad(vertexData, vertexData);
            }
            else {
                var wt = this.transform.worldTransform;
                var a = wt.a;
                var b = wt.b;
                var c = wt.c;
                var d = wt.d;
                var tx = wt.tx;
                var ty = wt.ty;
                vertexData[0] = (a * w1) + (c * h1) + tx;
                vertexData[1] = (d * h1) + (b * w1) + ty;
                vertexData[2] = (a * w0) + (c * h1) + tx;
                vertexData[3] = (d * h1) + (b * w0) + ty;
                vertexData[4] = (a * w0) + (c * h0) + tx;
                vertexData[5] = (d * h0) + (b * w0) + ty;
                vertexData[6] = (a * w1) + (c * h0) + tx;
                vertexData[7] = (d * h0) + (b * w1) + ty;
                if (this.proj._activeProjection) {
                    this.proj._activeProjection.surface.boundsQuad(vertexData, vertexData);
                }
            }
            if (!texture.transform) {
                texture.transform = new PIXI.extras.TextureTransform(texture);
            }
            texture.transform.update();
            var aTrans = this.aTrans;
            aTrans.set(orig.width, 0, 0, orig.height, w1, h1);
            if (this.proj._surface === null) {
                aTrans.prepend(this.transform.worldTransform);
            }
            aTrans.invert();
            aTrans.prepend(texture.transform.mapCoord);
        };
        Sprite2s.prototype.calculateTrimmedVertices = function () {
            var wid = this.transform._worldID;
            var tuid = this._texture._updateID;
            if (!this.vertexTrimmedData) {
                this.vertexTrimmedData = new Float32Array(8);
            }
            else if (this._transformTrimmedID === wid && this._textureTrimmedID === tuid) {
                return;
            }
            this._transformTrimmedID = wid;
            this._textureTrimmedID = tuid;
            var texture = this._texture;
            var vertexData = this.vertexTrimmedData;
            var orig = texture.orig;
            var anchor = this._anchor;
            var w1 = -anchor._x * orig.width;
            var w0 = w1 + orig.width;
            var h1 = -anchor._y * orig.height;
            var h0 = h1 + orig.height;
            if (this.proj._surface) {
                vertexData[0] = w1;
                vertexData[1] = h1;
                vertexData[2] = w0;
                vertexData[3] = h1;
                vertexData[4] = w0;
                vertexData[5] = h0;
                vertexData[6] = w1;
                vertexData[7] = h0;
                this.proj._surface.boundsQuad(vertexData, vertexData, this.transform.worldTransform);
            }
            else {
                var wt = this.transform.worldTransform;
                var a = wt.a;
                var b = wt.b;
                var c = wt.c;
                var d = wt.d;
                var tx = wt.tx;
                var ty = wt.ty;
                vertexData[0] = (a * w1) + (c * h1) + tx;
                vertexData[1] = (d * h1) + (b * w1) + ty;
                vertexData[2] = (a * w0) + (c * h1) + tx;
                vertexData[3] = (d * h1) + (b * w0) + ty;
                vertexData[4] = (a * w0) + (c * h0) + tx;
                vertexData[5] = (d * h0) + (b * w0) + ty;
                vertexData[6] = (a * w1) + (c * h0) + tx;
                vertexData[7] = (d * h0) + (b * w1) + ty;
                if (this.proj._activeProjection) {
                    this.proj._activeProjection.surface.boundsQuad(vertexData, vertexData, this.proj._activeProjection.legacy.worldTransform);
                }
            }
        };
        Object.defineProperty(Sprite2s.prototype, "worldTransform", {
            get: function () {
                return this.proj;
            },
            enumerable: true,
            configurable: true
        });
        return Sprite2s;
    }(PIXI.Sprite));
    pixi_projection.Sprite2s = Sprite2s;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Text2s = (function (_super) {
        __extends(Text2s, _super);
        function Text2s(text, style, canvas) {
            var _this = _super.call(this, text, style, canvas) || this;
            _this.aTrans = new PIXI.Matrix();
            _this.proj = new pixi_projection.ProjectionSurface(_this.transform);
            _this.pluginName = 'sprite_bilinear';
            return _this;
        }
        Object.defineProperty(Text2s.prototype, "worldTransform", {
            get: function () {
                return this.proj;
            },
            enumerable: true,
            configurable: true
        });
        return Text2s;
    }(PIXI.Text));
    pixi_projection.Text2s = Text2s;
    Text2s.prototype.calculateVertices = pixi_projection.Sprite2s.prototype.calculateVertices;
    Text2s.prototype.calculateTrimmedVertices = pixi_projection.Sprite2s.prototype.calculateTrimmedVertices;
    Text2s.prototype._calculateBounds = pixi_projection.Sprite2s.prototype._calculateBounds;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    function container2dWorldTransform() {
        return this.proj.affine ? this.transform.worldTransform : this.proj.world;
    }
    pixi_projection.container2dWorldTransform = container2dWorldTransform;
    var Container2d = (function (_super) {
        __extends(Container2d, _super);
        function Container2d() {
            var _this = _super.call(this) || this;
            _this.proj = new pixi_projection.Projection2d(_this.transform);
            return _this;
        }
        Object.defineProperty(Container2d.prototype, "worldTransform", {
            get: function () {
                return this.proj.affine ? this.transform.worldTransform : this.proj.world;
            },
            enumerable: true,
            configurable: true
        });
        return Container2d;
    }(PIXI.Container));
    pixi_projection.Container2d = Container2d;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Point = PIXI.Point;
    var mat3id = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var AFFINE;
    (function (AFFINE) {
        AFFINE[AFFINE["NONE"] = 0] = "NONE";
        AFFINE[AFFINE["FREE"] = 1] = "FREE";
        AFFINE[AFFINE["AXIS_X"] = 2] = "AXIS_X";
        AFFINE[AFFINE["AXIS_Y"] = 3] = "AXIS_Y";
        AFFINE[AFFINE["POINT"] = 4] = "POINT";
    })(AFFINE = pixi_projection.AFFINE || (pixi_projection.AFFINE = {}));
    var Matrix2d = (function () {
        function Matrix2d(backingArray) {
            this.floatArray = null;
            this.mat3 = new Float64Array(backingArray || mat3id);
        }
        Object.defineProperty(Matrix2d.prototype, "a", {
            get: function () {
                return this.mat3[0];
            },
            set: function (value) {
                this.mat3[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2d.prototype, "b", {
            get: function () {
                return this.mat3[1];
            },
            set: function (value) {
                this.mat3[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2d.prototype, "c", {
            get: function () {
                return this.mat3[3];
            },
            set: function (value) {
                this.mat3[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2d.prototype, "d", {
            get: function () {
                return this.mat3[4];
            },
            set: function (value) {
                this.mat3[4] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2d.prototype, "tx", {
            get: function () {
                return this.mat3[6];
            },
            set: function (value) {
                this.mat3[6] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2d.prototype, "ty", {
            get: function () {
                return this.mat3[7];
            },
            set: function (value) {
                this.mat3[7] = value;
            },
            enumerable: true,
            configurable: true
        });
        Matrix2d.prototype.set = function (a, b, c, d, tx, ty) {
            var mat3 = this.mat3;
            mat3[0] = a;
            mat3[1] = b;
            mat3[2] = 0;
            mat3[3] = c;
            mat3[4] = d;
            mat3[5] = 0;
            mat3[6] = tx;
            mat3[7] = ty;
            mat3[8] = 1;
            return this;
        };
        Matrix2d.prototype.toArray = function (transpose, out) {
            if (!this.floatArray) {
                this.floatArray = new Float32Array(9);
            }
            var array = out || this.floatArray;
            var mat3 = this.mat3;
            if (transpose) {
                array[0] = mat3[0];
                array[1] = mat3[1];
                array[2] = mat3[2];
                array[3] = mat3[3];
                array[4] = mat3[4];
                array[5] = mat3[5];
                array[6] = mat3[6];
                array[7] = mat3[7];
                array[8] = mat3[8];
            }
            else {
                array[0] = mat3[0];
                array[1] = mat3[3];
                array[2] = mat3[6];
                array[3] = mat3[1];
                array[4] = mat3[4];
                array[5] = mat3[7];
                array[6] = mat3[2];
                array[7] = mat3[5];
                array[8] = mat3[8];
            }
            return array;
        };
        Matrix2d.prototype.apply = function (pos, newPos) {
            newPos = newPos || new PIXI.Point();
            var mat3 = this.mat3;
            var x = pos.x;
            var y = pos.y;
            var z = 1.0 / (mat3[2] * x + mat3[5] * y + mat3[8]);
            newPos.x = z * (mat3[0] * x + mat3[3] * y + mat3[6]);
            newPos.y = z * (mat3[1] * x + mat3[4] * y + mat3[7]);
            return newPos;
        };
        Matrix2d.prototype.translate = function (tx, ty) {
            var mat3 = this.mat3;
            mat3[0] += tx * mat3[2];
            mat3[1] += ty * mat3[2];
            mat3[3] += tx * mat3[5];
            mat3[4] += ty * mat3[5];
            mat3[6] += tx * mat3[8];
            mat3[7] += ty * mat3[8];
            return this;
        };
        Matrix2d.prototype.scale = function (x, y) {
            var mat3 = this.mat3;
            mat3[0] *= x;
            mat3[1] *= y;
            mat3[3] *= x;
            mat3[4] *= y;
            mat3[6] *= x;
            mat3[7] *= y;
            return this;
        };
        Matrix2d.prototype.scaleAndTranslate = function (scaleX, scaleY, tx, ty) {
            var mat3 = this.mat3;
            mat3[0] = scaleX * mat3[0] + tx * mat3[2];
            mat3[1] = scaleY * mat3[1] + ty * mat3[2];
            mat3[3] = scaleX * mat3[3] + tx * mat3[5];
            mat3[4] = scaleY * mat3[4] + ty * mat3[5];
            mat3[6] = scaleX * mat3[6] + tx * mat3[8];
            mat3[7] = scaleY * mat3[7] + ty * mat3[8];
        };
        Matrix2d.prototype.applyInverse = function (pos, newPos) {
            newPos = newPos || new Point();
            var a = this.mat3;
            var x = pos.x;
            var y = pos.y;
            var a00 = a[0], a01 = a[3], a02 = a[6], a10 = a[1], a11 = a[4], a12 = a[7], a20 = a[2], a21 = a[5], a22 = a[8];
            var newX = (a22 * a11 - a12 * a21) * x + (-a22 * a01 + a02 * a21) * y + (a12 * a01 - a02 * a11);
            var newY = (-a22 * a10 + a12 * a20) * x + (a22 * a00 - a02 * a20) * y + (-a12 * a00 + a02 * a10);
            var newZ = (a21 * a10 - a11 * a20) * x + (-a21 * a00 + a01 * a20) * y + (a11 * a00 - a01 * a10);
            newPos.x = newX / newZ;
            newPos.y = newY / newZ;
            return newPos;
        };
        Matrix2d.prototype.invert = function () {
            var a = this.mat3;
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20;
            var det = a00 * b01 + a01 * b11 + a02 * b21;
            if (!det) {
                return this;
            }
            det = 1.0 / det;
            a[0] = b01 * det;
            a[1] = (-a22 * a01 + a02 * a21) * det;
            a[2] = (a12 * a01 - a02 * a11) * det;
            a[3] = b11 * det;
            a[4] = (a22 * a00 - a02 * a20) * det;
            a[5] = (-a12 * a00 + a02 * a10) * det;
            a[6] = b21 * det;
            a[7] = (-a21 * a00 + a01 * a20) * det;
            a[8] = (a11 * a00 - a01 * a10) * det;
            return this;
        };
        Matrix2d.prototype.identity = function () {
            var mat3 = this.mat3;
            mat3[0] = 1;
            mat3[1] = 0;
            mat3[2] = 0;
            mat3[3] = 0;
            mat3[4] = 1;
            mat3[5] = 0;
            mat3[6] = 0;
            mat3[7] = 0;
            mat3[8] = 1;
            return this;
        };
        Matrix2d.prototype.clone = function () {
            return new Matrix2d(this.mat3);
        };
        Matrix2d.prototype.copyTo = function (matrix) {
            var mat3 = this.mat3;
            var ar2 = matrix.mat3;
            ar2[0] = mat3[0];
            ar2[1] = mat3[1];
            ar2[2] = mat3[2];
            ar2[3] = mat3[3];
            ar2[4] = mat3[4];
            ar2[5] = mat3[5];
            ar2[6] = mat3[6];
            ar2[7] = mat3[7];
            ar2[8] = mat3[8];
            return matrix;
        };
        Matrix2d.prototype.copy = function (matrix, affine) {
            var mat3 = this.mat3;
            var d = 1.0 / mat3[8];
            var tx = mat3[6] * d, ty = mat3[7] * d;
            matrix.a = (mat3[0] - mat3[2] * tx) * d;
            matrix.b = (mat3[1] - mat3[2] * ty) * d;
            matrix.c = (mat3[3] - mat3[5] * tx) * d;
            matrix.d = (mat3[4] - mat3[5] * ty) * d;
            matrix.tx = tx;
            matrix.ty = ty;
            if (affine >= 2) {
                if (affine === AFFINE.POINT) {
                    matrix.a = 1;
                    matrix.b = 0;
                    matrix.c = 0;
                    matrix.d = 1;
                }
                else if (affine === AFFINE.AXIS_X) {
                    matrix.c = -matrix.b;
                    matrix.d = matrix.a;
                }
                else if (affine === AFFINE.AXIS_Y) {
                    matrix.a = matrix.d;
                    matrix.c = -matrix.b;
                }
            }
        };
        Matrix2d.prototype.copyFrom = function (matrix) {
            var mat3 = this.mat3;
            mat3[0] = matrix.a;
            mat3[1] = matrix.b;
            mat3[2] = 0;
            mat3[3] = matrix.c;
            mat3[4] = matrix.d;
            mat3[5] = 0;
            mat3[6] = matrix.tx;
            mat3[7] = matrix.ty;
            mat3[8] = 1.0;
            return this;
        };
        Matrix2d.prototype.setToMultLegacy = function (pt, lt) {
            var out = this.mat3;
            var b = lt.mat3;
            var a00 = pt.a, a01 = pt.b, a10 = pt.c, a11 = pt.d, a20 = pt.tx, a21 = pt.ty, b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8];
            out[0] = b00 * a00 + b01 * a10 + b02 * a20;
            out[1] = b00 * a01 + b01 * a11 + b02 * a21;
            out[2] = b02;
            out[3] = b10 * a00 + b11 * a10 + b12 * a20;
            out[4] = b10 * a01 + b11 * a11 + b12 * a21;
            out[5] = b12;
            out[6] = b20 * a00 + b21 * a10 + b22 * a20;
            out[7] = b20 * a01 + b21 * a11 + b22 * a21;
            out[8] = b22;
            return this;
        };
        Matrix2d.prototype.setToMult2d = function (pt, lt) {
            var out = this.mat3;
            var a = pt.mat3, b = lt.mat3;
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8];
            out[0] = b00 * a00 + b01 * a10 + b02 * a20;
            out[1] = b00 * a01 + b01 * a11 + b02 * a21;
            out[2] = b00 * a02 + b01 * a12 + b02 * a22;
            out[3] = b10 * a00 + b11 * a10 + b12 * a20;
            out[4] = b10 * a01 + b11 * a11 + b12 * a21;
            out[5] = b10 * a02 + b11 * a12 + b12 * a22;
            out[6] = b20 * a00 + b21 * a10 + b22 * a20;
            out[7] = b20 * a01 + b21 * a11 + b22 * a21;
            out[8] = b20 * a02 + b21 * a12 + b22 * a22;
            return this;
        };
        Matrix2d.IDENTITY = new Matrix2d();
        Matrix2d.TEMP_MATRIX = new Matrix2d();
        return Matrix2d;
    }());
    pixi_projection.Matrix2d = Matrix2d;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    function transformHack(parentTransform) {
        var proj = this.proj;
        var ta = this;
        var pwid = parentTransform._worldID;
        var lt = ta.localTransform;
        if (ta._localID !== ta._currentLocalID) {
            lt.a = ta._cx * ta.scale._x;
            lt.b = ta._sx * ta.scale._x;
            lt.c = ta._cy * ta.scale._y;
            lt.d = ta._sy * ta.scale._y;
            lt.tx = ta.position._x - ((ta.pivot._x * lt.a) + (ta.pivot._y * lt.c));
            lt.ty = ta.position._y - ((ta.pivot._x * lt.b) + (ta.pivot._y * lt.d));
            ta._currentLocalID = ta._localID;
            proj._currentProjID = -1;
        }
        var _matrixID = proj._projID;
        if (proj._currentProjID !== _matrixID) {
            proj._currentProjID = _matrixID;
            if (_matrixID !== 0) {
                proj.local.setToMultLegacy(lt, proj.matrix);
            }
            else {
                proj.local.copyFrom(lt);
            }
            ta._parentID = -1;
        }
        if (ta._parentID !== pwid) {
            var pp = parentTransform.proj;
            if (pp && !pp.affine) {
                proj.world.setToMult2d(pp.world, proj.local);
            }
            else {
                proj.world.setToMultLegacy(parentTransform.worldTransform, proj.local);
            }
            proj.world.copy(ta.worldTransform, proj._affine);
            ta._parentID = pwid;
            ta._worldID++;
        }
    }
    var t0 = new PIXI.Point();
    var tt = [new PIXI.Point(), new PIXI.Point(), new PIXI.Point(), new PIXI.Point()];
    var tempRect = new PIXI.Rectangle();
    var tempMat = new pixi_projection.Matrix2d();
    var Projection2d = (function (_super) {
        __extends(Projection2d, _super);
        function Projection2d(legacy, enable) {
            var _this = _super.call(this, legacy, enable) || this;
            _this.matrix = new pixi_projection.Matrix2d();
            _this.local = new pixi_projection.Matrix2d();
            _this.world = new pixi_projection.Matrix2d();
            _this._projID = 0;
            _this._currentProjID = -1;
            _this._affine = pixi_projection.AFFINE.NONE;
            return _this;
        }
        Object.defineProperty(Projection2d.prototype, "affine", {
            get: function () {
                return this._affine;
            },
            set: function (value) {
                if (this._affine == value)
                    return;
                this._affine = value;
                this._currentProjID = -1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Projection2d.prototype, "enabled", {
            set: function (value) {
                if (value === this._enabled) {
                    return;
                }
                this._enabled = value;
                if (value) {
                    this.legacy.updateTransform = transformHack;
                    this.legacy._parentID = -1;
                }
                else {
                    this.legacy.updateTransform = PIXI.TransformStatic.prototype.updateTransform;
                    this.legacy._parentID = -1;
                }
            },
            enumerable: true,
            configurable: true
        });
        Projection2d.prototype.setAxisX = function (p, factor) {
            if (factor === void 0) { factor = 1; }
            var x = p.x, y = p.y;
            var d = Math.sqrt(x * x + y * y);
            var mat3 = this.matrix.mat3;
            mat3[0] = x / d;
            mat3[1] = y / d;
            mat3[2] = factor / d;
            this._projID++;
        };
        Projection2d.prototype.setAxisY = function (p, factor) {
            if (factor === void 0) { factor = 1; }
            var x = p.x, y = p.y;
            var d = Math.sqrt(x * x + y * y);
            var mat3 = this.matrix.mat3;
            mat3[3] = x / d;
            mat3[4] = y / d;
            mat3[5] = factor / d;
            this._projID++;
        };
        Projection2d.prototype.mapSprite = function (sprite, quad) {
            var tex = sprite.texture;
            tempRect.x = -sprite.anchor.x * tex.orig.width;
            tempRect.y = -sprite.anchor.y * tex.orig.height;
            tempRect.width = tex.orig.width;
            tempRect.height = tex.orig.height;
            return this.mapQuad(tempRect, quad);
        };
        Projection2d.prototype.mapQuad = function (rect, p) {
            tt[0].set(rect.x, rect.y);
            tt[1].set(rect.x + rect.width, rect.y);
            tt[2].set(rect.x + rect.width, rect.y + rect.height);
            tt[3].set(rect.x, rect.y + rect.height);
            var k1 = 1, k2 = 2, k3 = 3;
            var f = pixi_projection.utils.getIntersectionFactor(p[0], p[2], p[1], p[3], t0);
            if (f !== 0) {
                k1 = 1;
                k2 = 3;
                k3 = 2;
            }
            else {
                return;
            }
            var d0 = Math.sqrt((p[0].x - t0.x) * (p[0].x - t0.x) + (p[0].y - t0.y) * (p[0].y - t0.y));
            var d1 = Math.sqrt((p[k1].x - t0.x) * (p[k1].x - t0.x) + (p[k1].y - t0.y) * (p[k1].y - t0.y));
            var d2 = Math.sqrt((p[k2].x - t0.x) * (p[k2].x - t0.x) + (p[k2].y - t0.y) * (p[k2].y - t0.y));
            var d3 = Math.sqrt((p[k3].x - t0.x) * (p[k3].x - t0.x) + (p[k3].y - t0.y) * (p[k3].y - t0.y));
            var q0 = (d0 + d3) / d3;
            var q1 = (d1 + d2) / d2;
            var q2 = (d1 + d2) / d1;
            var mat3 = this.matrix.mat3;
            mat3[0] = tt[0].x * q0;
            mat3[1] = tt[0].y * q0;
            mat3[2] = q0;
            mat3[3] = tt[k1].x * q1;
            mat3[4] = tt[k1].y * q1;
            mat3[5] = q1;
            mat3[6] = tt[k2].x * q2;
            mat3[7] = tt[k2].y * q2;
            mat3[8] = q2;
            this.matrix.invert();
            mat3 = tempMat.mat3;
            mat3[0] = p[0].x;
            mat3[1] = p[0].y;
            mat3[2] = 1;
            mat3[3] = p[k1].x;
            mat3[4] = p[k1].y;
            mat3[5] = 1;
            mat3[6] = p[k2].x;
            mat3[7] = p[k2].y;
            mat3[8] = 1;
            this.matrix.setToMult2d(tempMat, this.matrix);
            this._projID++;
        };
        Projection2d.prototype.clear = function () {
            this._currentProjID = -1;
            this._projID = 0;
            this.matrix.identity();
        };
        return Projection2d;
    }(pixi_projection.Projection));
    pixi_projection.Projection2d = Projection2d;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Mesh2d = (function (_super) {
        __extends(Mesh2d, _super);
        function Mesh2d(texture, vertices, uvs, indices, drawMode) {
            var _this = _super.call(this, texture, vertices, uvs, indices, drawMode) || this;
            _this.proj = new pixi_projection.Projection2d(_this.transform);
            _this.pluginName = 'mesh2d';
            return _this;
        }
        Object.defineProperty(Mesh2d.prototype, "worldTransform", {
            get: function () {
                return this.proj.affine ? this.transform.worldTransform : this.proj.world;
            },
            enumerable: true,
            configurable: true
        });
        return Mesh2d;
    }(PIXI.mesh.Mesh));
    pixi_projection.Mesh2d = Mesh2d;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var shaderVert = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position.xyw = projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0);\n    gl_Position.z = 0.0;\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n";
    var shaderFrag = "\nvarying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}";
    var Mesh2dRenderer = (function (_super) {
        __extends(Mesh2dRenderer, _super);
        function Mesh2dRenderer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Mesh2dRenderer.prototype.onContextChange = function () {
            var gl = this.renderer.gl;
            this.shader = new PIXI.Shader(gl, shaderVert, shaderFrag);
        };
        return Mesh2dRenderer;
    }(PIXI.mesh.MeshRenderer));
    pixi_projection.Mesh2dRenderer = Mesh2dRenderer;
    PIXI.WebGLRenderer.registerPlugin('mesh2d', Mesh2dRenderer);
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    PIXI.Sprite.prototype.convertTo2d = function () {
        if (this.proj)
            return;
        this.calculateVertices = pixi_projection.Sprite2d.prototype.calculateVertices;
        this.calculateTrimmedVertices = pixi_projection.Sprite2d.prototype.calculateTrimmedVertices;
        this._calculateBounds = pixi_projection.Sprite2d.prototype._calculateBounds;
        this.proj = new pixi_projection.Projection2d(this.transform);
        this.pluginName = 'sprite2d';
        this.vertexData = new Float32Array(12);
        Object.defineProperty(this, "worldTransform", {
            get: pixi_projection.container2dWorldTransform,
            enumerable: true,
            configurable: true
        });
    };
    PIXI.mesh.Mesh.prototype.convertTo2d = function () {
        if (this.proj)
            return;
        this.proj = new pixi_projection.Projection2d(this.transform);
        this.pluginName = 'mesh2d';
        Object.defineProperty(this, "worldTransform", {
            get: pixi_projection.container2dWorldTransform,
            enumerable: true,
            configurable: true
        });
    };
    PIXI.Container.prototype.convertTo2d = function () {
        if (this.proj)
            return;
        this.proj = new pixi_projection.Projection2d(this.transform);
        Object.defineProperty(this, "worldTransform", {
            get: pixi_projection.container2dWorldTransform,
            enumerable: true,
            configurable: true
        });
    };
    PIXI.Container.prototype.convertSubtreeTo2d = function () {
        this.convertTo2d();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].convertSubtreeTo2d();
        }
    };
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Sprite2d = (function (_super) {
        __extends(Sprite2d, _super);
        function Sprite2d(texture) {
            var _this = _super.call(this, texture) || this;
            _this.proj = new pixi_projection.Projection2d(_this.transform);
            _this.pluginName = 'sprite2d';
            _this.vertexData = new Float32Array(12);
            return _this;
        }
        Sprite2d.prototype._calculateBounds = function () {
            this.calculateTrimmedVertices();
            this._bounds.addQuad(this.vertexTrimmedData);
        };
        Sprite2d.prototype.calculateVertices = function () {
            if (this.proj._affine) {
                if (this.vertexData.length != 8) {
                    this.vertexData = new Float32Array(8);
                }
                _super.prototype.calculateVertices.call(this);
                return;
            }
            if (this.vertexData.length != 12) {
                this.vertexData = new Float32Array(12);
            }
            var wid = this.transform._worldID;
            var tuid = this._texture._updateID;
            if (this._transformID === wid && this._textureID === tuid) {
                return;
            }
            this._transformID = wid;
            this._textureID = tuid;
            var texture = this._texture;
            var wt = this.proj.world.mat3;
            var vertexData = this.vertexData;
            var trim = texture.trim;
            var orig = texture.orig;
            var anchor = this._anchor;
            var w0 = 0;
            var w1 = 0;
            var h0 = 0;
            var h1 = 0;
            if (trim) {
                w1 = trim.x - (anchor._x * orig.width);
                w0 = w1 + trim.width;
                h1 = trim.y - (anchor._y * orig.height);
                h0 = h1 + trim.height;
            }
            else {
                w1 = -anchor._x * orig.width;
                w0 = w1 + orig.width;
                h1 = -anchor._y * orig.height;
                h0 = h1 + orig.height;
            }
            vertexData[0] = (wt[0] * w1) + (wt[3] * h1) + wt[6];
            vertexData[1] = (wt[1] * w1) + (wt[4] * h1) + wt[7];
            vertexData[2] = (wt[2] * w1) + (wt[5] * h1) + wt[8];
            vertexData[3] = (wt[0] * w0) + (wt[3] * h1) + wt[6];
            vertexData[4] = (wt[1] * w0) + (wt[4] * h1) + wt[7];
            vertexData[5] = (wt[2] * w0) + (wt[5] * h1) + wt[8];
            vertexData[6] = (wt[0] * w0) + (wt[3] * h0) + wt[6];
            vertexData[7] = (wt[1] * w0) + (wt[4] * h0) + wt[7];
            vertexData[8] = (wt[2] * w0) + (wt[5] * h0) + wt[8];
            vertexData[9] = (wt[0] * w1) + (wt[3] * h0) + wt[6];
            vertexData[10] = (wt[1] * w1) + (wt[4] * h0) + wt[7];
            vertexData[11] = (wt[2] * w1) + (wt[5] * h0) + wt[8];
        };
        Sprite2d.prototype.calculateTrimmedVertices = function () {
            if (this.proj._affine) {
                _super.prototype.calculateTrimmedVertices.call(this);
                return;
            }
            var wid = this.transform._worldID;
            var tuid = this._texture._updateID;
            if (!this.vertexTrimmedData) {
                this.vertexTrimmedData = new Float32Array(8);
            }
            else if (this._transformTrimmedID === wid && this._textureTrimmedID === tuid) {
                return;
            }
            this._transformTrimmedID = wid;
            this._textureTrimmedID = tuid;
            var texture = this._texture;
            var vertexData = this.vertexTrimmedData;
            var orig = texture.orig;
            var anchor = this._anchor;
            var wt = this.proj.world.mat3;
            var w1 = -anchor._x * orig.width;
            var w0 = w1 + orig.width;
            var h1 = -anchor._y * orig.height;
            var h0 = h1 + orig.height;
            var z = 1.0 / (wt[2] * w1 + wt[5] * h1 + wt[8]);
            vertexData[0] = z * ((wt[0] * w1) + (wt[3] * h1) + wt[6]);
            vertexData[1] = z * ((wt[1] * w1) + (wt[4] * h1) + wt[7]);
            z = 1.0 / (wt[2] * w0 + wt[5] * h1 + wt[8]);
            vertexData[2] = z * ((wt[0] * w0) + (wt[3] * h1) + wt[6]);
            vertexData[3] = z * ((wt[1] * w0) + (wt[4] * h1) + wt[7]);
            z = 1.0 / (wt[2] * w0 + wt[5] * h0 + wt[8]);
            vertexData[4] = z * ((wt[0] * w0) + (wt[3] * h0) + wt[6]);
            vertexData[5] = z * ((wt[1] * w0) + (wt[4] * h0) + wt[7]);
            z = 1.0 / (wt[2] * w1 + wt[5] * h0 + wt[8]);
            vertexData[6] = z * ((wt[0] * w1) + (wt[3] * h0) + wt[6]);
            vertexData[7] = z * ((wt[1] * w1) + (wt[4] * h0) + wt[7]);
        };
        Object.defineProperty(Sprite2d.prototype, "worldTransform", {
            get: function () {
                return this.proj.affine ? this.transform.worldTransform : this.proj.world;
            },
            enumerable: true,
            configurable: true
        });
        return Sprite2d;
    }(PIXI.Sprite));
    pixi_projection.Sprite2d = Sprite2d;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var MultiTextureSpriteRenderer = pixi_projection.webgl.MultiTextureSpriteRenderer;
    var Sprite2dRenderer = (function (_super) {
        __extends(Sprite2dRenderer, _super);
        function Sprite2dRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.shaderVert = "precision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position.xyw = projectionMatrix * aVertexPosition;\n    gl_Position.z = 0.0;\n    \n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor;\n}\n";
            _this.shaderFrag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\nvec4 color;\nvec2 textureCoord = vTextureCoord;\nfloat textureId = floor(vTextureId+0.5);\n%forloop%\ngl_FragColor = color * vColor;\n}";
            return _this;
        }
        Sprite2dRenderer.prototype.createVao = function (vertexBuffer) {
            var attrs = this.shader.attributes;
            this.vertSize = 6;
            this.vertByteSize = this.vertSize * 4;
            var gl = this.renderer.gl;
            var vao = this.renderer.createVao()
                .addIndex(this.indexBuffer)
                .addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0)
                .addAttribute(vertexBuffer, attrs.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 3 * 4)
                .addAttribute(vertexBuffer, attrs.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 4 * 4);
            if (attrs.aTextureId) {
                vao.addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 5 * 4);
            }
            return vao;
        };
        Sprite2dRenderer.prototype.fillVertices = function (float32View, uint32View, index, sprite, argb, textureId) {
            var vertexData = sprite.vertexData;
            var uvs = sprite._texture._uvs.uvsUint32;
            if (vertexData.length === 8) {
                if (this.renderer.roundPixels) {
                    var resolution = this.renderer.resolution;
                    float32View[index] = ((vertexData[0] * resolution) | 0) / resolution;
                    float32View[index + 1] = ((vertexData[1] * resolution) | 0) / resolution;
                    float32View[index + 2] = 1.0;
                    float32View[index + 6] = ((vertexData[2] * resolution) | 0) / resolution;
                    float32View[index + 7] = ((vertexData[3] * resolution) | 0) / resolution;
                    float32View[index + 8] = 1.0;
                    float32View[index + 12] = ((vertexData[4] * resolution) | 0) / resolution;
                    float32View[index + 13] = ((vertexData[5] * resolution) | 0) / resolution;
                    float32View[index + 14] = 1.0;
                    float32View[index + 18] = ((vertexData[6] * resolution) | 0) / resolution;
                    float32View[index + 19] = ((vertexData[7] * resolution) | 0) / resolution;
                    float32View[index + 20] = 1.0;
                }
                else {
                    float32View[index] = vertexData[0];
                    float32View[index + 1] = vertexData[1];
                    float32View[index + 2] = 1.0;
                    float32View[index + 6] = vertexData[2];
                    float32View[index + 7] = vertexData[3];
                    float32View[index + 8] = 1.0;
                    float32View[index + 12] = vertexData[4];
                    float32View[index + 13] = vertexData[5];
                    float32View[index + 14] = 1.0;
                    float32View[index + 18] = vertexData[6];
                    float32View[index + 19] = vertexData[7];
                    float32View[index + 20] = 1.0;
                }
            }
            else {
                float32View[index] = vertexData[0];
                float32View[index + 1] = vertexData[1];
                float32View[index + 2] = vertexData[2];
                float32View[index + 6] = vertexData[3];
                float32View[index + 7] = vertexData[4];
                float32View[index + 8] = vertexData[5];
                float32View[index + 12] = vertexData[6];
                float32View[index + 13] = vertexData[7];
                float32View[index + 14] = vertexData[8];
                float32View[index + 18] = vertexData[9];
                float32View[index + 19] = vertexData[10];
                float32View[index + 20] = vertexData[11];
            }
            uint32View[index + 3] = uvs[0];
            uint32View[index + 9] = uvs[1];
            uint32View[index + 15] = uvs[2];
            uint32View[index + 21] = uvs[3];
            uint32View[index + 4] = uint32View[index + 10] = uint32View[index + 16] = uint32View[index + 22] = argb;
            float32View[index + 5] = float32View[index + 11] = float32View[index + 17] = float32View[index + 23] = textureId;
        };
        return Sprite2dRenderer;
    }(MultiTextureSpriteRenderer));
    PIXI.WebGLRenderer.registerPlugin('sprite2d', Sprite2dRenderer);
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var Text2d = (function (_super) {
        __extends(Text2d, _super);
        function Text2d(text, style, canvas) {
            var _this = _super.call(this, text, style, canvas) || this;
            _this.proj = new pixi_projection.Projection2d(_this.transform);
            _this.pluginName = 'sprite2d';
            _this.vertexData = new Float32Array(12);
            return _this;
        }
        Object.defineProperty(Text2d.prototype, "worldTransform", {
            get: function () {
                return this.proj.affine ? this.transform.worldTransform : this.proj.world;
            },
            enumerable: true,
            configurable: true
        });
        return Text2d;
    }(PIXI.Text));
    pixi_projection.Text2d = Text2d;
    Text2d.prototype.calculateVertices = pixi_projection.Sprite2d.prototype.calculateVertices;
    Text2d.prototype.calculateTrimmedVertices = pixi_projection.Sprite2d.prototype.calculateTrimmedVertices;
    Text2d.prototype._calculateBounds = pixi_projection.Sprite2d.prototype._calculateBounds;
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var ProjectionsManager = (function () {
        function ProjectionsManager(renderer) {
            var _this = this;
            this.onContextChange = function (gl) {
                _this.gl = gl;
                _this.renderer.maskManager.pushSpriteMask = pushSpriteMask;
            };
            this.renderer = renderer;
            renderer.on('context', this.onContextChange);
        }
        ProjectionsManager.prototype.destroy = function () {
            this.renderer.off('context', this.onContextChange);
        };
        return ProjectionsManager;
    }());
    pixi_projection.ProjectionsManager = ProjectionsManager;
    function pushSpriteMask(target, maskData) {
        var alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];
        if (!alphaMaskFilter) {
            alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new pixi_projection.SpriteMaskFilter2d(maskData)];
        }
        alphaMaskFilter[0].resolution = this.renderer.resolution;
        alphaMaskFilter[0].maskSprite = maskData;
        target.filterArea = maskData.getBounds(true);
        this.renderer.filterManager.pushFilter(target, alphaMaskFilter);
        this.alphaMaskIndex++;
    }
    PIXI.WebGLRenderer.registerPlugin('projections', ProjectionsManager);
})(pixi_projection || (pixi_projection = {}));
var pixi_projection;
(function (pixi_projection) {
    var spriteMaskVert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec3 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n\tgl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n\tvTextureCoord = aTextureCoord;\n\tvMaskCoord = otherMatrix * vec3( aTextureCoord, 1.0);\n}\n";
    var spriteMaskFrag = "\nvarying vec3 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform sampler2D mask;\n\nvoid main(void)\n{\n    vec2 uv = vMaskCoord.xy / vMaskCoord.z;\n    \n    vec2 text = abs( uv - 0.5 );\n    text = step(0.5, text);\n\n    float clip = 1.0 - max(text.y, text.x);\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, uv);\n\n    original *= (masky.r * masky.a * alpha * clip);\n\n    gl_FragColor = original;\n}\n";
    var tempMat = new pixi_projection.Matrix2d();
    var SpriteMaskFilter2d = (function (_super) {
        __extends(SpriteMaskFilter2d, _super);
        function SpriteMaskFilter2d(sprite) {
            var _this = _super.call(this, spriteMaskVert, spriteMaskFrag) || this;
            _this.maskMatrix = new pixi_projection.Matrix2d();
            sprite.renderable = false;
            _this.maskSprite = sprite;
            return _this;
        }
        SpriteMaskFilter2d.prototype.apply = function (filterManager, input, output, clear, currentState) {
            var maskSprite = this.maskSprite;
            this.uniforms.mask = maskSprite.texture;
            this.uniforms.otherMatrix = SpriteMaskFilter2d.calculateSpriteMatrix(currentState, this.maskMatrix, maskSprite);
            this.uniforms.alpha = maskSprite.worldAlpha;
            filterManager.applyFilter(this, input, output);
        };
        SpriteMaskFilter2d.calculateSpriteMatrix = function (currentState, mappedMatrix, sprite) {
            var proj = sprite.proj;
            var filterArea = currentState.sourceFrame;
            var textureSize = currentState.renderTarget.size;
            var worldTransform = proj && !proj._affine ? proj.world.copyTo(tempMat) : tempMat.copyFrom(sprite.transform.worldTransform);
            var texture = sprite.texture.orig;
            mappedMatrix.set(textureSize.width, 0, 0, textureSize.height, filterArea.x, filterArea.y);
            worldTransform.invert();
            mappedMatrix.setToMult2d(worldTransform, mappedMatrix);
            mappedMatrix.scaleAndTranslate(1.0 / texture.width, 1.0 / texture.height, sprite.anchor.x, sprite.anchor.y);
            return mappedMatrix;
        };
        return SpriteMaskFilter2d;
    }(PIXI.Filter));
    pixi_projection.SpriteMaskFilter2d = SpriteMaskFilter2d;
})(pixi_projection || (pixi_projection = {}));
//# sourceMappingURL=pixi-projection.js.map
},{}],27:[function(require,module,exports){
(function (global){
/*!
 * pixi-sound - v2.0.0
 * https://github.com/pixijs/pixi-sound
 * Compiled Tue, 14 Nov 2017 17:53:47 UTC
 *
 * pixi-sound is licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiSound=e.__pixiSound||{})}(this,function(e){"use strict";function t(e,t){function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}if("undefined"==typeof PIXI)throw"PixiJS required";var n=function(){function e(e,t){this._output=t,this._input=e}return Object.defineProperty(e.prototype,"destination",{get:function(){return this._input},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"filters",{get:function(){return this._filters},set:function(e){var t=this;if(this._filters&&(this._filters.forEach(function(e){e&&e.disconnect()}),this._filters=null,this._input.connect(this._output)),e&&e.length){this._filters=e.slice(0),this._input.disconnect();var n=null;e.forEach(function(e){null===n?t._input.connect(e.destination):n.connect(e.destination),n=e}),n.connect(this._output)}},enumerable:!0,configurable:!0}),e.prototype.destroy=function(){this.filters=null,this._input=null,this._output=null},e}(),o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])},i=0,r=function(e){function n(t){var n=e.call(this)||this;return n.id=i++,n.init(t),n}return t(n,e),Object.defineProperty(n.prototype,"progress",{get:function(){return this._source.currentTime/this._duration},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"paused",{get:function(){return this._paused},set:function(e){this._paused=e,this.refreshPaused()},enumerable:!0,configurable:!0}),n.prototype._onPlay=function(){this._playing=!0},n.prototype._onPause=function(){this._playing=!1},n.prototype.init=function(e){this._playing=!1,this._duration=e.source.duration;var t=this._source=e.source.cloneNode(!1);t.src=e.parent.url,t.onplay=this._onPlay.bind(this),t.onpause=this._onPause.bind(this),e.context.on("refresh",this.refresh,this),e.context.on("refreshPaused",this.refreshPaused,this),this._media=e},n.prototype._internalStop=function(){this._source&&this._playing&&(this._source.onended=null,this._source.pause())},n.prototype.stop=function(){this._internalStop(),this._source&&this.emit("stop")},Object.defineProperty(n.prototype,"speed",{get:function(){return this._speed},set:function(e){this._speed=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"volume",{get:function(){return this._volume},set:function(e){this._volume=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"loop",{get:function(){return this._loop},set:function(e){this._loop=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"muted",{get:function(){return this._muted},set:function(e){this._muted=e,this.refresh()},enumerable:!0,configurable:!0}),n.prototype.refresh=function(){var e=this._media.context,t=this._media.parent;this._source.loop=this._loop||t.loop;var n=e.volume*(e.muted?0:1),o=t.volume*(t.muted?0:1),i=this._volume*(this._muted?0:1);this._source.volume=i*n*o,this._source.playbackRate=this._speed*e.speed*t.speed},n.prototype.refreshPaused=function(){var e=this._media.context,t=this._media.parent,n=this._paused||t.paused||e.paused;n!==this._pausedReal&&(this._pausedReal=n,n?(this._internalStop(),this.emit("paused")):(this.emit("resumed"),this.play({start:this._source.currentTime,end:this._end,volume:this._volume,speed:this._speed,loop:this._loop})),this.emit("pause",n))},n.prototype.play=function(e){var t=this,o=e.start,i=e.end,r=e.speed,s=e.loop,u=e.volume,a=e.muted;i&&console.assert(i>o,"End time is before start time"),this._speed=r,this._volume=u,this._loop=!!s,this._muted=a,this.refresh(),this.loop&&null!==i&&(console.warn('Looping not support when specifying an "end" time'),this.loop=!1),this._start=o,this._end=i||this._duration,this._start=Math.max(0,this._start-n.PADDING),this._end=Math.min(this._end+n.PADDING,this._duration),this._source.onloadedmetadata=function(){t._source&&(t._source.currentTime=o,t._source.onloadedmetadata=null,t.emit("progress",o,t._duration),PIXI.ticker.shared.add(t._onUpdate,t))},this._source.onended=this._onComplete.bind(this),this._source.play(),this.emit("start")},n.prototype._onUpdate=function(){this.emit("progress",this.progress,this._duration),this._source.currentTime>=this._end&&!this._source.loop&&this._onComplete()},n.prototype._onComplete=function(){PIXI.ticker.shared.remove(this._onUpdate,this),this._internalStop(),this.emit("progress",1,this._duration),this.emit("end",this)},n.prototype.destroy=function(){PIXI.ticker.shared.remove(this._onUpdate,this),this.removeAllListeners();var e=this._source;e&&(e.onended=null,e.onplay=null,e.onpause=null,this._internalStop()),this._source=null,this._speed=1,this._volume=1,this._loop=!1,this._end=null,this._start=0,this._duration=0,this._playing=!1,this._pausedReal=!1,this._paused=!1,this._muted=!1,this._media&&(this._media.context.off("refresh",this.refresh,this),this._media.context.off("refreshPaused",this.refreshPaused,this),this._media=null)},n.prototype.toString=function(){return"[HTMLAudioInstance id="+this.id+"]"},n.PADDING=.1,n}(PIXI.utils.EventEmitter),s=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return t(n,e),n.prototype.init=function(e){this.parent=e,this._source=e.options.source||new Audio,e.url&&(this._source.src=e.url)},n.prototype.create=function(){return new r(this)},Object.defineProperty(n.prototype,"isPlayable",{get:function(){return!!this._source&&4===this._source.readyState},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"duration",{get:function(){return this._source.duration},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"context",{get:function(){return this.parent.context},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"filters",{get:function(){return null},set:function(e){console.warn("HTML Audio does not support filters")},enumerable:!0,configurable:!0}),n.prototype.destroy=function(){this.removeAllListeners(),this.parent=null,this._source&&(this._source.src="",this._source.load(),this._source=null)},Object.defineProperty(n.prototype,"source",{get:function(){return this._source},enumerable:!0,configurable:!0}),n.prototype.load=function(e){var t=this._source,n=this.parent;if(4===t.readyState){n.isLoaded=!0;var o=n.autoPlayStart();return void(e&&setTimeout(function(){e(null,n,o)},0))}if(!n.url)return e(new Error("sound.url or sound.source must be set"));t.src=n.url;var i=function(){t.removeEventListener("canplaythrough",r),t.removeEventListener("load",r),t.removeEventListener("abort",s),t.removeEventListener("error",u)},r=function(){i(),n.isLoaded=!0;var t=n.autoPlayStart();e&&e(null,n,t)},s=function(){i(),e&&e(new Error("Sound loading has been aborted"))},u=function(){i();var n="Failed to load audio element (code: "+t.error.code+")";e?e(new Error(n)):console.error(n)};t.addEventListener("canplaythrough",r,!1),t.addEventListener("load",r,!1),t.addEventListener("abort",s,!1),t.addEventListener("error",u,!1),t.load()},n}(PIXI.utils.EventEmitter),u="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},a=function(e,t){return t={exports:{}},e(t,t.exports),t.exports}(function(e){!function(t){function n(){}function o(e,t){return function(){e.apply(t,arguments)}}function i(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],l(e,this)}function r(e,t){for(;3===e._state;)e=e._value;if(0===e._state)return void e._deferreds.push(t);e._handled=!0,i._immediateFn(function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null===n)return void(1===e._state?s:u)(t.promise,e._value);var o;try{o=n(e._value)}catch(e){return void u(t.promise,e)}s(t.promise,o)})}function s(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof i)return e._state=3,e._value=t,void a(e);if("function"==typeof n)return void l(o(n,t),e)}e._state=1,e._value=t,a(e)}catch(t){u(e,t)}}function u(e,t){e._state=2,e._value=t,a(e)}function a(e){2===e._state&&0===e._deferreds.length&&i._immediateFn(function(){e._handled||i._unhandledRejectionFn(e._value)});for(var t=0,n=e._deferreds.length;t<n;t++)r(e,e._deferreds[t]);e._deferreds=null}function c(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function l(e,t){var n=!1;try{e(function(e){n||(n=!0,s(t,e))},function(e){n||(n=!0,u(t,e))})}catch(e){if(n)return;n=!0,u(t,e)}}var p=setTimeout;i.prototype.catch=function(e){return this.then(null,e)},i.prototype.then=function(e,t){var o=new this.constructor(n);return r(this,new c(e,t,o)),o},i.all=function(e){var t=Array.prototype.slice.call(e);return new i(function(e,n){function o(r,s){try{if(s&&("object"==typeof s||"function"==typeof s)){var u=s.then;if("function"==typeof u)return void u.call(s,function(e){o(r,e)},n)}t[r]=s,0==--i&&e(t)}catch(e){n(e)}}if(0===t.length)return e([]);for(var i=t.length,r=0;r<t.length;r++)o(r,t[r])})},i.resolve=function(e){return e&&"object"==typeof e&&e.constructor===i?e:new i(function(t){t(e)})},i.reject=function(e){return new i(function(t,n){n(e)})},i.race=function(e){return new i(function(t,n){for(var o=0,i=e.length;o<i;o++)e[o].then(t,n)})},i._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){p(e,0)},i._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},i._setImmediateFn=function(e){i._immediateFn=e},i._setUnhandledRejectionFn=function(e){i._unhandledRejectionFn=e},e.exports?e.exports=i:t.Promise||(t.Promise=i)}(u)}),c=function(){function e(e,t){this.destination=e,this.source=t||e}return e.prototype.connect=function(e){this.source.connect(e)},e.prototype.disconnect=function(){this.source.disconnect()},e.prototype.destroy=function(){this.disconnect(),this.destination=null,this.source=null},e}(),l=function(){function e(){}return e.setParamValue=function(e,t){if(e.setValueAtTime){var n=S.instance.context;e.setValueAtTime(t,n.audioContext.currentTime)}else e.value=t;return t},e}(),p=function(e){function n(t,o,i,r,s,u,a,c,p,h){void 0===t&&(t=0),void 0===o&&(o=0),void 0===i&&(i=0),void 0===r&&(r=0),void 0===s&&(s=0),void 0===u&&(u=0),void 0===a&&(a=0),void 0===c&&(c=0),void 0===p&&(p=0),void 0===h&&(h=0);var d=this;if(S.instance.useLegacy)return void(d=e.call(this,null)||this);var f=[{f:n.F32,type:"lowshelf",gain:t},{f:n.F64,type:"peaking",gain:o},{f:n.F125,type:"peaking",gain:i},{f:n.F250,type:"peaking",gain:r},{f:n.F500,type:"peaking",gain:s},{f:n.F1K,type:"peaking",gain:u},{f:n.F2K,type:"peaking",gain:a},{f:n.F4K,type:"peaking",gain:c},{f:n.F8K,type:"peaking",gain:p},{f:n.F16K,type:"highshelf",gain:h}].map(function(e){var t=S.instance.context.audioContext.createBiquadFilter();return t.type=e.type,l.setParamValue(t.gain,e.gain),l.setParamValue(t.Q,1),l.setParamValue(t.frequency,e.f),t});(d=e.call(this,f[0],f[f.length-1])||this).bands=f,d.bandsMap={};for(var _=0;_<d.bands.length;_++){var y=d.bands[_];_>0&&d.bands[_-1].connect(y),d.bandsMap[y.frequency.value]=y}return d}return t(n,e),n.prototype.setGain=function(e,t){if(void 0===t&&(t=0),!this.bandsMap[e])throw"No band found for frequency "+e;l.setParamValue(this.bandsMap[e].gain,t)},n.prototype.getGain=function(e){if(!this.bandsMap[e])throw"No band found for frequency "+e;return this.bandsMap[e].gain.value},Object.defineProperty(n.prototype,"f32",{get:function(){return this.getGain(n.F32)},set:function(e){this.setGain(n.F32,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f64",{get:function(){return this.getGain(n.F64)},set:function(e){this.setGain(n.F64,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f125",{get:function(){return this.getGain(n.F125)},set:function(e){this.setGain(n.F125,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f250",{get:function(){return this.getGain(n.F250)},set:function(e){this.setGain(n.F250,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f500",{get:function(){return this.getGain(n.F500)},set:function(e){this.setGain(n.F500,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f1k",{get:function(){return this.getGain(n.F1K)},set:function(e){this.setGain(n.F1K,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f2k",{get:function(){return this.getGain(n.F2K)},set:function(e){this.setGain(n.F2K,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f4k",{get:function(){return this.getGain(n.F4K)},set:function(e){this.setGain(n.F4K,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f8k",{get:function(){return this.getGain(n.F8K)},set:function(e){this.setGain(n.F8K,e)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"f16k",{get:function(){return this.getGain(n.F16K)},set:function(e){this.setGain(n.F16K,e)},enumerable:!0,configurable:!0}),n.prototype.reset=function(){this.bands.forEach(function(e){l.setParamValue(e.gain,0)})},n.prototype.destroy=function(){this.bands.forEach(function(e){e.disconnect()}),this.bands=null,this.bandsMap=null},n.F32=32,n.F64=64,n.F125=125,n.F250=250,n.F500=500,n.F1K=1e3,n.F2K=2e3,n.F4K=4e3,n.F8K=8e3,n.F16K=16e3,n}(c),h=function(e){function n(t){void 0===t&&(t=0);var n=this;if(S.instance.useLegacy)return void(n=e.call(this,null)||this);var o=S.instance.context.audioContext.createWaveShaper();return n=e.call(this,o)||this,n._distortion=o,n.amount=t,n}return t(n,e),Object.defineProperty(n.prototype,"amount",{get:function(){return this._amount},set:function(e){e*=1e3,this._amount=e;for(var t,n=new Float32Array(44100),o=Math.PI/180,i=0;i<44100;++i)t=2*i/44100-1,n[i]=(3+e)*t*20*o/(Math.PI+e*Math.abs(t));this._distortion.curve=n,this._distortion.oversample="4x"},enumerable:!0,configurable:!0}),n.prototype.destroy=function(){this._distortion=null,e.prototype.destroy.call(this)},n}(c),d=function(e){function n(t){void 0===t&&(t=0);var n=this;if(S.instance.useLegacy)return void(n=e.call(this,null)||this);var o,i,r,s=S.instance.context.audioContext;return s.createStereoPanner?r=o=s.createStereoPanner():((i=s.createPanner()).panningModel="equalpower",r=i),n=e.call(this,r)||this,n._stereo=o,n._panner=i,n.pan=t,n}return t(n,e),Object.defineProperty(n.prototype,"pan",{get:function(){return this._pan},set:function(e){this._pan=e,this._stereo?l.setParamValue(this._stereo.pan,e):this._panner.setPosition(e,0,1-Math.abs(e))},enumerable:!0,configurable:!0}),n.prototype.destroy=function(){e.prototype.destroy.call(this),this._stereo=null,this._panner=null},n}(c),f=function(e){function n(t,n,o){void 0===t&&(t=3),void 0===n&&(n=2),void 0===o&&(o=!1);var i=this;if(S.instance.useLegacy)return void(i=e.call(this,null)||this);var r=S.instance.context.audioContext.createConvolver();return i=e.call(this,r)||this,i._convolver=r,i._seconds=i._clamp(t,1,50),i._decay=i._clamp(n,0,100),i._reverse=o,i._rebuild(),i}return t(n,e),n.prototype._clamp=function(e,t,n){return Math.min(n,Math.max(t,e))},Object.defineProperty(n.prototype,"seconds",{get:function(){return this._seconds},set:function(e){this._seconds=this._clamp(e,1,50),this._rebuild()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"decay",{get:function(){return this._decay},set:function(e){this._decay=this._clamp(e,0,100),this._rebuild()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"reverse",{get:function(){return this._reverse},set:function(e){this._reverse=e,this._rebuild()},enumerable:!0,configurable:!0}),n.prototype._rebuild=function(){for(var e,t=S.instance.context.audioContext,n=t.sampleRate,o=n*this._seconds,i=t.createBuffer(2,o,n),r=i.getChannelData(0),s=i.getChannelData(1),u=0;u<o;u++)e=this._reverse?o-u:u,r[u]=(2*Math.random()-1)*Math.pow(1-e/o,this._decay),s[u]=(2*Math.random()-1)*Math.pow(1-e/o,this._decay);this._convolver.buffer=i},n.prototype.destroy=function(){this._convolver=null,e.prototype.destroy.call(this)},n}(c),_=function(e){function n(){var t=this;S.instance.useLegacy&&(t=e.call(this,null)||this);var n=S.instance.context.audioContext,o=n.createChannelSplitter(),i=n.createChannelMerger();return i.connect(o),t=e.call(this,i,o)||this,t._merger=i,t}return t(n,e),n.prototype.destroy=function(){this._merger.disconnect(),this._merger=null,e.prototype.destroy.call(this)},n}(c),y=function(e){function n(){if(S.instance.useLegacy)return void(e.call(this,null)||this);var t=S.instance.context.audioContext,n=t.createBiquadFilter(),o=t.createBiquadFilter(),i=t.createBiquadFilter(),r=t.createBiquadFilter();return n.type="lowpass",l.setParamValue(n.frequency,2e3),o.type="lowpass",l.setParamValue(o.frequency,2e3),i.type="highpass",l.setParamValue(i.frequency,500),r.type="highpass",l.setParamValue(r.frequency,500),n.connect(o),o.connect(i),i.connect(r),e.call(this,n,r)||this}return t(n,e),n}(c),m=Object.freeze({Filter:c,EqualizerFilter:p,DistortionFilter:h,StereoFilter:d,ReverbFilter:f,MonoFilter:_,TelephoneFilter:y}),b=function(e){function n(){var t=e.call(this)||this;return t.speed=1,t.volume=1,t.muted=!1,t.paused=!1,t}return t(n,e),n.prototype.refresh=function(){this.emit("refresh")},n.prototype.refreshPaused=function(){this.emit("refreshPaused")},Object.defineProperty(n.prototype,"filters",{get:function(){return console.warn("HTML Audio does not support filters"),null},set:function(e){console.warn("HTML Audio does not support filters")},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"audioContext",{get:function(){return console.warn("HTML Audio does not support audioContext"),null},enumerable:!0,configurable:!0}),n.prototype.toggleMute=function(){return this.muted=!this.muted,this.refresh(),this.muted},n.prototype.togglePause=function(){return this.paused=!this.paused,this.refreshPaused(),this.paused},n.prototype.destroy=function(){this.removeAllListeners()},n}(PIXI.utils.EventEmitter),g=Object.freeze({HTMLAudioMedia:s,HTMLAudioInstance:r,HTMLAudioContext:b}),v=0,P=function(e){function n(t){var n=e.call(this)||this;return n.id=v++,n._media=null,n._paused=!1,n._muted=!1,n._elapsed=0,n._updateListener=n._update.bind(n),n.init(t),n}return t(n,e),n.prototype.stop=function(){this._source&&(this._internalStop(),this.emit("stop"))},Object.defineProperty(n.prototype,"speed",{get:function(){return this._speed},set:function(e){this._speed=e,this.refresh(),this._update(!0)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"volume",{get:function(){return this._volume},set:function(e){this._volume=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"muted",{get:function(){return this._muted},set:function(e){this._muted=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"loop",{get:function(){return this._loop},set:function(e){this._loop=e,this.refresh()},enumerable:!0,configurable:!0}),n.prototype.refresh=function(){var e=this._media.context,t=this._media.parent;this._source.loop=this._loop||t.loop;var n=e.volume*(e.muted?0:1),o=t.volume*(t.muted?0:1),i=this._volume*(this._muted?0:1);l.setParamValue(this._gain.gain,i*o*n),l.setParamValue(this._source.playbackRate,this._speed*t.speed*e.speed)},n.prototype.refreshPaused=function(){var e=this._media.context,t=this._media.parent,n=this._paused||t.paused||e.paused;n!==this._pausedReal&&(this._pausedReal=n,n?(this._internalStop(),this.emit("paused")):(this.emit("resumed"),this.play({start:this._elapsed%this._duration,end:this._end,speed:this._speed,loop:this._loop,volume:this._volume})),this.emit("pause",n))},n.prototype.play=function(e){var t=e.start,n=e.end,o=e.speed,i=e.loop,r=e.volume,s=e.muted;n&&console.assert(n>t,"End time is before start time"),this._paused=!1;var u=this._media.nodes.cloneBufferSource(),a=u.source,c=u.gain;this._source=a,this._gain=c,this._speed=o,this._volume=r,this._loop=!!i,this._muted=s,this.refresh(),this.loop&&null!==n&&(console.warn('Looping not support when specifying an "end" time'),this.loop=!1),this._end=n;var l=this._source.buffer.duration;this._duration=l,this._lastUpdate=this._now(),this._elapsed=t,this._source.onended=this._onComplete.bind(this),n?this._source.start(0,t,n-t):this._source.start(0,t),this.emit("start"),this._update(!0),this._enabled=!0},n.prototype._toSec=function(e){return e>10&&(e/=1e3),e||0},Object.defineProperty(n.prototype,"_enabled",{set:function(e){var t=this._media.nodes.script;t.removeEventListener("audioprocess",this._updateListener),e&&t.addEventListener("audioprocess",this._updateListener)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"progress",{get:function(){return this._progress},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"paused",{get:function(){return this._paused},set:function(e){this._paused=e,this.refreshPaused()},enumerable:!0,configurable:!0}),n.prototype.destroy=function(){this.removeAllListeners(),this._internalStop(),this._source&&(this._source.disconnect(),this._source=null),this._gain&&(this._gain.disconnect(),this._gain=null),this._media&&(this._media.context.events.off("refresh",this.refresh,this),this._media.context.events.off("refreshPaused",this.refreshPaused,this),this._media=null),this._end=null,this._speed=1,this._volume=1,this._loop=!1,this._elapsed=0,this._duration=0,this._paused=!1,this._muted=!1,this._pausedReal=!1},n.prototype.toString=function(){return"[WebAudioInstance id="+this.id+"]"},n.prototype._now=function(){return this._media.context.audioContext.currentTime},n.prototype._update=function(e){if(void 0===e&&(e=!1),this._source){var t=this._now(),n=t-this._lastUpdate;if(n>0||e){var o=this._source.playbackRate.value;this._elapsed+=n*o,this._lastUpdate=t;var i=this._duration,r=this._elapsed%i/i;this._progress=r,this.emit("progress",this._progress,i)}}},n.prototype.init=function(e){this._media=e,e.context.events.on("refresh",this.refresh,this),e.context.events.on("refreshPaused",this.refreshPaused,this)},n.prototype._internalStop=function(){this._source&&(this._enabled=!1,this._source.onended=null,this._source.stop(),this._source=null)},n.prototype._onComplete=function(){this._source&&(this._enabled=!1,this._source.onended=null),this._source=null,this._progress=1,this.emit("progress",1,this._duration),this.emit("end",this)},n}(PIXI.utils.EventEmitter),x=function(e){function n(t){var o=this,i=t.audioContext,r=i.createBufferSource(),s=i.createScriptProcessor(n.BUFFER_SIZE),u=i.createGain(),a=i.createAnalyser();return r.connect(a),a.connect(u),u.connect(t.destination),s.connect(t.destination),o=e.call(this,a,u)||this,o.context=t,o.bufferSource=r,o.script=s,o.gain=u,o.analyser=a,o}return t(n,e),n.prototype.destroy=function(){e.prototype.destroy.call(this),this.bufferSource.disconnect(),this.script.disconnect(),this.gain.disconnect(),this.analyser.disconnect(),this.bufferSource=null,this.script=null,this.gain=null,this.analyser=null,this.context=null},n.prototype.cloneBufferSource=function(){var e=this.bufferSource,t=this.context.audioContext.createBufferSource();t.buffer=e.buffer,l.setParamValue(t.playbackRate,e.playbackRate.value),t.loop=e.loop;var n=this.context.audioContext.createGain();return t.connect(n),n.connect(this.destination),{source:t,gain:n}},n.BUFFER_SIZE=256,n}(n),O=function(){function e(){}return e.prototype.init=function(e){this.parent=e,this._nodes=new x(this.context),this._source=this._nodes.bufferSource,this.source=e.options.source},e.prototype.destroy=function(){this.parent=null,this._nodes.destroy(),this._nodes=null,this._source=null,this.source=null},e.prototype.create=function(){return new P(this)},Object.defineProperty(e.prototype,"context",{get:function(){return this.parent.context},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isPlayable",{get:function(){return!!this._source&&!!this._source.buffer},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"filters",{get:function(){return this._nodes.filters},set:function(e){this._nodes.filters=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"duration",{get:function(){return console.assert(this.isPlayable,"Sound not yet playable, no duration"),this._source.buffer.duration},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"buffer",{get:function(){return this._source.buffer},set:function(e){this._source.buffer=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"nodes",{get:function(){return this._nodes},enumerable:!0,configurable:!0}),e.prototype.load=function(e){this.source?this._decode(this.source,e):this.parent.url?this._loadUrl(e):e?e(new Error("sound.url or sound.source must be set")):console.error("sound.url or sound.source must be set")},e.prototype._loadUrl=function(e){var t=this,n=new XMLHttpRequest,o=this.parent.url;n.open("GET",o,!0),n.responseType="arraybuffer",n.onload=function(){t.source=n.response,t._decode(n.response,e)},n.send()},e.prototype._decode=function(e,t){var n=this;this.parent.context.decode(e,function(e,o){if(e)t&&t(e);else{n.parent.isLoaded=!0,n.buffer=o;var i=n.parent.autoPlayStart();t&&t(null,n.parent,i)}})},e}(),w=function(){function e(){}return e.resolveUrl=function(t){var n=e.FORMAT_PATTERN,o="string"==typeof t?t:t.url;if(n.test(o)){for(var i=n.exec(o),r=i[2].split(","),s=r[r.length-1],u=0,a=r.length;u<a;u++){var c=r[u];if(e.supported[c]){s=c;break}}var l=o.replace(i[1],s);return"string"!=typeof t&&(t.extension=s,t.url=l),l}return o},e.sineTone=function(e,t){void 0===e&&(e=200),void 0===t&&(t=1);var n=I.from({singleInstance:!0});if(!(n.media instanceof O))return n;for(var o=n.media,i=n.context.audioContext.createBuffer(1,48e3*t,48e3),r=i.getChannelData(0),s=0;s<r.length;s++){var u=e*(s/i.sampleRate)*Math.PI;r[s]=2*Math.sin(u)}return o.buffer=i,n.isLoaded=!0,n},e.render=function(e,t){var n=document.createElement("canvas");t=Object.assign({width:512,height:128,fill:"black"},t||{}),n.width=t.width,n.height=t.height;var o=PIXI.BaseTexture.fromCanvas(n);if(!(e.media instanceof O))return o;var i=e.media;console.assert(!!i.buffer,"No buffer found, load first");var r=n.getContext("2d");r.fillStyle=t.fill;for(var s=i.buffer.getChannelData(0),u=Math.ceil(s.length/t.width),a=t.height/2,c=0;c<t.width;c++){for(var l=1,p=-1,h=0;h<u;h++){var d=s[c*u+h];d<l&&(l=d),d>p&&(p=d)}r.fillRect(c,(1+l)*a,1,Math.max(1,(p-l)*a))}return o},e.playOnce=function(t,n){var o="alias"+e.PLAY_ID++;return S.instance.add(o,{url:t,preload:!0,autoPlay:!0,loaded:function(e){e&&(console.error(e),S.instance.remove(o),n&&n(e))},complete:function(){S.instance.remove(o),n&&n(null)}}),o},e.PLAY_ID=0,e.FORMAT_PATTERN=/\.(\{([^\}]+)\})(\?.*)?$/,e.extensions=["mp3","ogg","oga","opus","mpeg","wav","m4a","mp4","aiff","wma","mid"],e.supported=function(){var t={m4a:"mp4",oga:"ogg"},n=document.createElement("audio"),o={};return e.extensions.forEach(function(e){var i=t[e]||e,r=n.canPlayType("audio/"+e).replace(/^no$/,""),s=n.canPlayType("audio/"+i).replace(/^no$/,"");o[e]=!!r||!!s}),Object.freeze(o)}(),e}(),j=function(e){function n(t,n){var o=e.call(this,t,n)||this;return o.use(A.plugin),o.pre(A.resolve),o}return t(n,e),n.addPixiMiddleware=function(t){e.addPixiMiddleware.call(this,t)},n}(PIXI.loaders.Loader),A=function(){function e(){}return e.install=function(t){e._sound=t,e.legacy=t.useLegacy,PIXI.loaders.Loader=j,PIXI.loader.use(e.plugin),PIXI.loader.pre(e.resolve)},Object.defineProperty(e,"legacy",{set:function(e){var t=PIXI.loaders.Resource,n=w.extensions;e?n.forEach(function(e){t.setExtensionXhrType(e,t.XHR_RESPONSE_TYPE.DEFAULT),t.setExtensionLoadType(e,t.LOAD_TYPE.AUDIO)}):n.forEach(function(e){t.setExtensionXhrType(e,t.XHR_RESPONSE_TYPE.BUFFER),t.setExtensionLoadType(e,t.LOAD_TYPE.XHR)})},enumerable:!0,configurable:!0}),e.resolve=function(e,t){w.resolveUrl(e),t()},e.plugin=function(t,n){t.data&&w.extensions.indexOf(t.extension)>-1?t.sound=e._sound.add(t.name,{loaded:n,preload:!0,url:t.url,source:t.data}):n()},e}(),F=function(){function e(e,t){this.parent=e,Object.assign(this,t),this.duration=this.end-this.start,console.assert(this.duration>0,"End time must be after start time")}return e.prototype.play=function(e){return this.parent.play(Object.assign({complete:e,speed:this.speed||this.parent.speed,end:this.end,start:this.start}))},e.prototype.destroy=function(){this.parent=null},e}(),E=function(e){function n(){var t=this,o=new n.AudioContext,i=o.createDynamicsCompressor(),r=o.createAnalyser();return r.connect(i),i.connect(o.destination),t=e.call(this,r,i)||this,t._ctx=o,t._offlineCtx=new n.OfflineAudioContext(1,2,o.sampleRate),t._unlocked=!1,t.compressor=i,t.analyser=r,t.events=new PIXI.utils.EventEmitter,t.volume=1,t.speed=1,t.muted=!1,t.paused=!1,"ontouchstart"in window&&"running"!==o.state&&(t._unlock(),t._unlock=t._unlock.bind(t),document.addEventListener("mousedown",t._unlock,!0),document.addEventListener("touchstart",t._unlock,!0),document.addEventListener("touchend",t._unlock,!0)),t}return t(n,e),n.prototype._unlock=function(){this._unlocked||(this.playEmptySound(),"running"===this._ctx.state&&(document.removeEventListener("mousedown",this._unlock,!0),document.removeEventListener("touchend",this._unlock,!0),document.removeEventListener("touchstart",this._unlock,!0),this._unlocked=!0))},n.prototype.playEmptySound=function(){var e=this._ctx.createBufferSource();e.buffer=this._ctx.createBuffer(1,1,22050),e.connect(this._ctx.destination),e.start(0,0,0)},Object.defineProperty(n,"AudioContext",{get:function(){var e=window;return e.AudioContext||e.webkitAudioContext||null},enumerable:!0,configurable:!0}),Object.defineProperty(n,"OfflineAudioContext",{get:function(){var e=window;return e.OfflineAudioContext||e.webkitOfflineAudioContext||null},enumerable:!0,configurable:!0}),n.prototype.destroy=function(){e.prototype.destroy.call(this);var t=this._ctx;void 0!==t.close&&t.close(),this.events.removeAllListeners(),this.analyser.disconnect(),this.compressor.disconnect(),this.analyser=null,this.compressor=null,this.events=null,this._offlineCtx=null,this._ctx=null},Object.defineProperty(n.prototype,"audioContext",{get:function(){return this._ctx},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"offlineContext",{get:function(){return this._offlineCtx},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"paused",{get:function(){return this._paused},set:function(e){e&&"running"===this._ctx.state?this._ctx.suspend():e||"suspended"!==this._ctx.state||this._ctx.resume(),this._paused=e},enumerable:!0,configurable:!0}),n.prototype.refresh=function(){this.events.emit("refresh")},n.prototype.refreshPaused=function(){this.events.emit("refreshPaused")},n.prototype.toggleMute=function(){return this.muted=!this.muted,this.refresh(),this.muted},n.prototype.togglePause=function(){return this.paused=!this.paused,this.refreshPaused(),this._paused},n.prototype.decode=function(e,t){this._offlineCtx.decodeAudioData(e,function(e){t(null,e)},function(){t(new Error("Unable to decode file"))})},n}(n),L=Object.freeze({WebAudioMedia:O,WebAudioInstance:P,WebAudioNodes:x,WebAudioContext:E,WebAudioUtils:l}),S=function(){function e(){this.init()}return e.prototype.init=function(){return this.supported&&(this._webAudioContext=new E),this._htmlAudioContext=new b,this._sounds={},this.useLegacy=!this.supported,this},Object.defineProperty(e.prototype,"context",{get:function(){return this._context},enumerable:!0,configurable:!0}),e.init=function(){if(e.instance)throw new Error("SoundLibrary is already created");var t=e.instance=new e;"undefined"==typeof Promise&&(window.Promise=a),void 0!==PIXI.loaders&&A.install(t),void 0===window.__pixiSound&&delete window.__pixiSound;var o=PIXI;return o.sound||(Object.defineProperty(o,"sound",{get:function(){return t}}),Object.defineProperties(t,{filters:{get:function(){return m}},htmlaudio:{get:function(){return g}},webaudio:{get:function(){return L}},utils:{get:function(){return w}},Sound:{get:function(){return I}},SoundSprite:{get:function(){return F}},Filterable:{get:function(){return n}},SoundLibrary:{get:function(){return e}}})),t},Object.defineProperty(e.prototype,"filtersAll",{get:function(){return this.useLegacy?[]:this._context.filters},set:function(e){this.useLegacy||(this._context.filters=e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"supported",{get:function(){return null!==E.AudioContext},enumerable:!0,configurable:!0}),e.prototype.add=function(e,t){if("object"==typeof e){var n={};for(var o in e){i=this._getOptions(e[o],t);n[o]=this.add(o,i)}return n}if("string"==typeof e){if(console.assert(!this._sounds[e],"Sound with alias "+e+" already exists."),t instanceof I)return this._sounds[e]=t,t;var i=this._getOptions(t),r=I.from(i);return this._sounds[e]=r,r}},e.prototype._getOptions=function(e,t){var n;return n="string"==typeof e?{url:e}:e instanceof ArrayBuffer||e instanceof HTMLAudioElement?{source:e}:e,Object.assign(n,t||{})},Object.defineProperty(e.prototype,"useLegacy",{get:function(){return this._useLegacy},set:function(e){A.legacy=e,this._useLegacy=e,!e&&this.supported?this._context=this._webAudioContext:this._context=this._htmlAudioContext},enumerable:!0,configurable:!0}),e.prototype.remove=function(e){return this.exists(e,!0),this._sounds[e].destroy(),delete this._sounds[e],this},Object.defineProperty(e.prototype,"volumeAll",{get:function(){return this._context.volume},set:function(e){this._context.volume=e,this._context.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"speedAll",{get:function(){return this._context.speed},set:function(e){this._context.speed=e,this._context.refresh()},enumerable:!0,configurable:!0}),e.prototype.togglePauseAll=function(){return this._context.togglePause()},e.prototype.pauseAll=function(){return this._context.paused=!0,this._context.refresh(),this},e.prototype.resumeAll=function(){return this._context.paused=!1,this._context.refresh(),this},e.prototype.toggleMuteAll=function(){return this._context.toggleMute()},e.prototype.muteAll=function(){return this._context.muted=!0,this._context.refresh(),this},e.prototype.unmuteAll=function(){return this._context.muted=!1,this._context.refresh(),this},e.prototype.removeAll=function(){for(var e in this._sounds)this._sounds[e].destroy(),delete this._sounds[e];return this},e.prototype.stopAll=function(){for(var e in this._sounds)this._sounds[e].stop();return this},e.prototype.exists=function(e,t){void 0===t&&(t=!1);var n=!!this._sounds[e];return t&&console.assert(n,"No sound matching alias '"+e+"'."),n},e.prototype.find=function(e){return this.exists(e,!0),this._sounds[e]},e.prototype.play=function(e,t){return this.find(e).play(t)},e.prototype.stop=function(e){return this.find(e).stop()},e.prototype.pause=function(e){return this.find(e).pause()},e.prototype.resume=function(e){return this.find(e).resume()},e.prototype.volume=function(e,t){var n=this.find(e);return void 0!==t&&(n.volume=t),n.volume},e.prototype.speed=function(e,t){var n=this.find(e);return void 0!==t&&(n.speed=t),n.speed},e.prototype.duration=function(e){return this.find(e).duration},e.prototype.close=function(){return this.removeAll(),this._sounds=null,this._webAudioContext&&(this._webAudioContext.destroy(),this._webAudioContext=null),this._htmlAudioContext&&(this._htmlAudioContext.destroy(),this._htmlAudioContext=null),this._context=null,this},e}(),I=function(){function e(e,t){this.media=e,this.options=t,this._instances=[],this._sprites={},this.media.init(this);var n=t.complete;this._autoPlayOptions=n?{complete:n}:null,this.isLoaded=!1,this.isPlaying=!1,this.autoPlay=t.autoPlay,this.singleInstance=t.singleInstance,this.preload=t.preload||this.autoPlay,this.url=t.url,this.speed=t.speed,this.volume=t.volume,this.loop=t.loop,t.sprites&&this.addSprites(t.sprites),this.preload&&this._preload(t.loaded)}return e.from=function(t){var n={};return"string"==typeof t?n.url=t:t instanceof ArrayBuffer||t instanceof HTMLAudioElement?n.source=t:n=t,(n=Object.assign({autoPlay:!1,singleInstance:!1,url:null,source:null,preload:!1,volume:1,speed:1,complete:null,loaded:null,loop:!1},n)).url&&(n.url=w.resolveUrl(n.url)),Object.freeze(n),new e(S.instance.useLegacy?new s:new O,n)},Object.defineProperty(e.prototype,"context",{get:function(){return S.instance.context},enumerable:!0,configurable:!0}),e.prototype.pause=function(){return this.isPlaying=!1,this.paused=!0,this},e.prototype.resume=function(){return this.isPlaying=this._instances.length>0,this.paused=!1,this},Object.defineProperty(e.prototype,"paused",{get:function(){return this._paused},set:function(e){this._paused=e,this.refreshPaused()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"speed",{get:function(){return this._speed},set:function(e){this._speed=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"filters",{get:function(){return this.media.filters},set:function(e){this.media.filters=e},enumerable:!0,configurable:!0}),e.prototype.addSprites=function(e,t){if("object"==typeof e){var n={};for(var o in e)n[o]=this.addSprites(o,e[o]);return n}if("string"==typeof e){console.assert(!this._sprites[e],"Alias "+e+" is already taken");var i=new F(this,t);return this._sprites[e]=i,i}},e.prototype.destroy=function(){this._removeInstances(),this.removeSprites(),this.media.destroy(),this.media=null,this._sprites=null,this._instances=null},e.prototype.removeSprites=function(e){if(e){var t=this._sprites[e];void 0!==t&&(t.destroy(),delete this._sprites[e])}else for(var n in this._sprites)this.removeSprites(n);return this},Object.defineProperty(e.prototype,"isPlayable",{get:function(){return this.isLoaded&&this.media&&this.media.isPlayable},enumerable:!0,configurable:!0}),e.prototype.stop=function(){if(!this.isPlayable)return this.autoPlay=!1,this._autoPlayOptions=null,this;this.isPlaying=!1;for(var e=this._instances.length-1;e>=0;e--)this._instances[e].stop();return this},e.prototype.play=function(e,t){var n,o=this;if("string"==typeof e?n={sprite:r=e,complete:t}:"function"==typeof e?(n={}).complete=e:n=e,(n=Object.assign({complete:null,loaded:null,sprite:null,end:null,start:0,volume:1,speed:1,muted:!1,loop:!1},n||{})).sprite){var i=n.sprite;console.assert(!!this._sprites[i],"Alias "+i+" is not available");var r=this._sprites[i];n.start=r.start,n.end=r.end,n.speed=r.speed||1,delete n.sprite}if(n.offset&&(n.start=n.offset),!this.isLoaded)return new Promise(function(e,t){o.autoPlay=!0,o._autoPlayOptions=n,o._preload(function(o,i,r){o?t(o):(n.loaded&&n.loaded(o,i,r),e(r))})});this.singleInstance&&this._removeInstances();var s=this._createInstance();return this._instances.push(s),this.isPlaying=!0,s.once("end",function(){n.complete&&n.complete(o),o._onComplete(s)}),s.once("stop",function(){o._onComplete(s)}),s.play(n),s},e.prototype.refresh=function(){for(var e=this._instances.length,t=0;t<e;t++)this._instances[t].refresh()},e.prototype.refreshPaused=function(){for(var e=this._instances.length,t=0;t<e;t++)this._instances[t].refreshPaused()},Object.defineProperty(e.prototype,"volume",{get:function(){return this._volume},set:function(e){this._volume=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"muted",{get:function(){return this._muted},set:function(e){this._muted=e,this.refresh()},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"loop",{get:function(){return this._loop},set:function(e){this._loop=e,this.refresh()},enumerable:!0,configurable:!0}),e.prototype._preload=function(e){this.media.load(e)},Object.defineProperty(e.prototype,"instances",{get:function(){return this._instances},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"sprites",{get:function(){return this._sprites},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"duration",{get:function(){return this.media.duration},enumerable:!0,configurable:!0}),e.prototype.autoPlayStart=function(){var e;return this.autoPlay&&(e=this.play(this._autoPlayOptions)),e},e.prototype._removeInstances=function(){for(var e=this._instances.length-1;e>=0;e--)this._poolInstance(this._instances[e]);this._instances.length=0},e.prototype._onComplete=function(e){if(this._instances){var t=this._instances.indexOf(e);t>-1&&this._instances.splice(t,1),this.isPlaying=this._instances.length>0}this._poolInstance(e)},e.prototype._createInstance=function(){if(e._pool.length>0){var t=e._pool.pop();return t.init(this.media),t}return this.media.create()},e.prototype._poolInstance=function(t){t.destroy(),e._pool.indexOf(t)<0&&e._pool.push(t)},e._pool=[],e}(),C=S.init();e.sound=C,e.filters=m,e.htmlaudio=g,e.webaudio=L,e.Filterable=n,e.Sound=I,e.SoundLibrary=S,e.SoundSprite=F,e.utils=w,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=pixi-sound.js.map

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
!function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(6)},function(t,e){t.exports=PIXI},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={linear:function(){return function(t){return t}},inQuad:function(){return function(t){return t*t}},outQuad:function(){return function(t){return t*(2-t)}},inOutQuad:function(){return function(t){return t*=2,1>t?.5*t*t:-.5*(--t*(t-2)-1)}},inCubic:function(){return function(t){return t*t*t}},outCubic:function(){return function(t){return--t*t*t+1}},inOutCubic:function(){return function(t){return t*=2,1>t?.5*t*t*t:(t-=2,.5*(t*t*t+2))}},inQuart:function(){return function(t){return t*t*t*t}},outQuart:function(){return function(t){return 1- --t*t*t*t}},inOutQuart:function(){return function(t){return t*=2,1>t?.5*t*t*t*t:(t-=2,-.5*(t*t*t*t-2))}},inQuint:function(){return function(t){return t*t*t*t*t}},outQuint:function(){return function(t){return--t*t*t*t*t+1}},inOutQuint:function(){return function(t){return t*=2,1>t?.5*t*t*t*t*t:(t-=2,.5*(t*t*t*t*t+2))}},inSine:function(){return function(t){return 1-Math.cos(t*Math.PI/2)}},outSine:function(){return function(t){return Math.sin(t*Math.PI/2)}},inOutSine:function(){return function(t){return.5*(1-Math.cos(Math.PI*t))}},inExpo:function(){return function(t){return 0===t?0:Math.pow(1024,t-1)}},outExpo:function(){return function(t){return 1===t?1:1-Math.pow(2,-10*t)}},inOutExpo:function(){return function(t){return 0===t?0:1===t?1:(t*=2,1>t?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2))}},inCirc:function(){return function(t){return 1-Math.sqrt(1-t*t)}},outCirc:function(){return function(t){return Math.sqrt(1- --t*t)}},inOutCirc:function(){return function(t){return t*=2,1>t?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-2)*(t-2))+1)}},inElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),-(t*Math.pow(2,10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)))}},outElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),t*Math.pow(2,-10*n)*Math.sin((n-i)*(2*Math.PI)/e)+1)}},inOutElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),n*=2,1>n?-.5*(t*Math.pow(2,10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)):t*Math.pow(2,-10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)*.5+1)}},inBack:function(t){return function(e){var n=t||1.70158;return e*e*((n+1)*e-n)}},outBack:function(t){return function(e){var n=t||1.70158;return--e*e*((n+1)*e+n)+1}},inOutBack:function(t){return function(e){var n=1.525*(t||1.70158);return e*=2,1>e?.5*(e*e*((n+1)*e-n)):.5*((e-2)*(e-2)*((n+1)*(e-2)+n)+2)}},inBounce:function(){return function(t){return 1-n.outBounce()(1-t)}},outBounce:function(){return function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?(t-=1.5/2.75,7.5625*t*t+.75):2.5/2.75>t?(t-=2.25/2.75,7.5625*t*t+.9375):(t-=2.625/2.75,7.5625*t*t+.984375)}},inOutBounce:function(){return function(t){return.5>t?.5*n.inBounce()(2*t):.5*n.outBounce()(2*t-1)+.5}},customArray:function(t){return t?function(t){return t}:n.linear()}};e["default"]=n},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e,n,i,r,s){for(var o in t)if(c(t[o]))u(t[o],e[o],n[o],i,r,s);else{var a=e[o],h=t[o]-e[o],l=i,f=r/l;n[o]=a+h*s(f)}}function h(t,e,n){for(var i in t)0===e[i]||e[i]||(c(n[i])?(e[i]=JSON.parse(JSON.stringify(n[i])),h(t[i],e[i],n[i])):e[i]=n[i])}function c(t){return"[object Object]"===Object.prototype.toString.call(t)}var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var f=n(1),p=r(f),d=n(2),g=i(d),v=function(t){function e(t,n){s(this,e);var i=o(this,Object.getPrototypeOf(e).call(this));return i.target=t,n&&i.addTo(n),i.clear(),i}return a(e,t),l(e,[{key:"addTo",value:function(t){return this.manager=t,this.manager.addTween(this),this}},{key:"chain",value:function(t){return t||(t=new e(this.target)),this._chainTween=t,t}},{key:"start",value:function(){return this.active=!0,this}},{key:"stop",value:function(){return this.active=!1,this.emit("stop"),this}},{key:"to",value:function(t){return this._to=t,this}},{key:"from",value:function(t){return this._from=t,this}},{key:"remove",value:function(){return this.manager?(this.manager.removeTween(this),this):this}},{key:"clear",value:function(){this.time=0,this.active=!1,this.easing=g["default"].linear(),this.expire=!1,this.repeat=0,this.loop=!1,this.delay=0,this.pingPong=!1,this.isStarted=!1,this.isEnded=!1,this._to=null,this._from=null,this._delayTime=0,this._elapsedTime=0,this._repeat=0,this._pingPong=!1,this._chainTween=null,this.path=null,this.pathReverse=!1,this.pathFrom=0,this.pathTo=0}},{key:"reset",value:function(){if(this._elapsedTime=0,this._repeat=0,this._delayTime=0,this.isStarted=!1,this.isEnded=!1,this.pingPong&&this._pingPong){var t=this._to,e=this._from;this._to=e,this._from=t,this._pingPong=!1}return this}},{key:"update",value:function(t,e){if(this._canUpdate()||!this._to&&!this.path){var n=void 0,i=void 0;if(this.delay>this._delayTime)return void(this._delayTime+=e);this.isStarted||(this._parseData(),this.isStarted=!0,this.emit("start"));var r=this.pingPong?this.time/2:this.time;if(r>this._elapsedTime){var s=this._elapsedTime+e,o=s>=r;this._elapsedTime=o?r:s,this._apply(r);var a=this._pingPong?r+this._elapsedTime:this._elapsedTime;if(this.emit("update",a),o){if(this.pingPong&&!this._pingPong)return this._pingPong=!0,n=this._to,i=this._from,this._from=n,this._to=i,this.path&&(n=this.pathTo,i=this.pathFrom,this.pathTo=i,this.pathFrom=n),this.emit("pingpong"),void(this._elapsedTime=0);if(this.loop||this.repeat>this._repeat)return this._repeat++,this.emit("repeat",this._repeat),this._elapsedTime=0,void(this.pingPong&&this._pingPong&&(n=this._to,i=this._from,this._to=i,this._from=n,this.path&&(n=this.pathTo,i=this.pathFrom,this.pathTo=i,this.pathFrom=n),this._pingPong=!1));this.isEnded=!0,this.active=!1,this.emit("end"),this._chainTween&&(this._chainTween.addTo(this.manager),this._chainTween.start())}}}}},{key:"_parseData",value:function(){if(!this.isStarted&&(this._from||(this._from={}),h(this._to,this._from,this.target),this.path)){var t=this.path.totalDistance();this.pathReverse?(this.pathFrom=t,this.pathTo=0):(this.pathFrom=0,this.pathTo=t)}}},{key:"_apply",value:function(t){if(u(this._to,this._from,this.target,t,this._elapsedTime,this.easing),this.path){var e=this.pingPong?this.time/2:this.time,n=this.pathFrom,i=this.pathTo-this.pathFrom,r=e,s=this._elapsedTime/r,o=n+i*this.easing(s),a=this.path.getPointAtDistance(o);this.target.position.set(a.x,a.y)}}},{key:"_canUpdate",value:function(){return this.time&&this.active&&this.target}}]),e}(p.utils.EventEmitter);e["default"]=v},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),a=i(o),u=function(){function t(){r(this,t),this.tweens=[],this._tweensToDelete=[],this._last=0}return s(t,[{key:"update",value:function(t){var e=void 0;t||0===t?e=1e3*t:(e=this._getDeltaMS(),t=e/1e3);for(var n=0;n<this.tweens.length;n++){var i=this.tweens[n];i.active&&(i.update(t,e),i.isEnded&&i.expire&&i.remove())}if(this._tweensToDelete.length){for(var n=0;n<this._tweensToDelete.length;n++)this._remove(this._tweensToDelete[n]);this._tweensToDelete.length=0}}},{key:"getTweensForTarget",value:function(t){for(var e=[],n=0;n<this.tweens.length;n++)this.tweens[n].target===t&&e.push(this.tweens[n]);return e}},{key:"createTween",value:function(t){return new a["default"](t,this)}},{key:"addTween",value:function(t){t.manager=this,this.tweens.push(t)}},{key:"removeTween",value:function(t){this._tweensToDelete.push(t)}},{key:"_remove",value:function(t){var e=this.tweens.indexOf(t);-1!==e&&this.tweens.splice(e,1)}},{key:"_getDeltaMS",value:function(){0===this._last&&(this._last=Date.now());var t=Date.now(),e=t-this._last;return this._last=t,e}}]),t}();e["default"]=u},function(t,e,n){"use strict";function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),u=function(){function t(){r(this,t),this._colsed=!1,this.polygon=new a.Polygon,this.polygon.closed=!1,this._tmpPoint=new a.Point,this._tmpPoint2=new a.Point,this._tmpDistance=[],this.currentPath=null,this.graphicsData=[],this.dirty=!0}return s(t,[{key:"moveTo",value:function(t,e){return a.Graphics.prototype.moveTo.call(this,t,e),this.dirty=!0,this}},{key:"lineTo",value:function(t,e){return a.Graphics.prototype.lineTo.call(this,t,e),this.dirty=!0,this}},{key:"bezierCurveTo",value:function(t,e,n,i,r,s){return a.Graphics.prototype.bezierCurveTo.call(this,t,e,n,i,r,s),this.dirty=!0,this}},{key:"quadraticCurveTo",value:function(t,e,n,i){return a.Graphics.prototype.quadraticCurveTo.call(this,t,e,n,i),this.dirty=!0,this}},{key:"arcTo",value:function(t,e,n,i,r){return a.Graphics.prototype.arcTo.call(this,t,e,n,i,r),this.dirty=!0,this}},{key:"arc",value:function(t,e,n,i,r,s){return a.Graphics.prototype.arc.call(this,t,e,n,i,r,s),this.dirty=!0,this}},{key:"drawShape",value:function(t){return a.Graphics.prototype.drawShape.call(this,t),this.dirty=!0,this}},{key:"getPoint",value:function(t){this.parsePoints();var e=this.closed&&t>=this.length-1?0:2*t;return this._tmpPoint.set(this.polygon.points[e],this.polygon.points[e+1]),this._tmpPoint}},{key:"distanceBetween",value:function(t,e){this.parsePoints();var n=this.getPoint(t),i=n.x,r=n.y,s=this.getPoint(e),o=s.x,a=s.y,u=o-i,h=a-r;return Math.sqrt(u*u+h*h)}},{key:"totalDistance",value:function(){this.parsePoints(),this._tmpDistance.length=0,this._tmpDistance.push(0);for(var t=this.length,e=0,n=0;t-1>n;n++)e+=this.distanceBetween(n,n+1),this._tmpDistance.push(e);return e}},{key:"getPointAt",value:function(t){if(this.parsePoints(),t>this.length)return this.getPoint(this.length-1);if(t%1===0)return this.getPoint(t);this._tmpPoint2.set(0,0);var e=t%1,n=this.getPoint(Math.ceil(t)),i=n.x,r=n.y,s=this.getPoint(Math.floor(t)),o=s.x,a=s.y,u=-((o-i)*e),h=-((a-r)*e);return this._tmpPoint2.set(o+u,a+h),this._tmpPoint2}},{key:"getPointAtDistance",value:function(t){this.parsePoints(),this._tmpDistance||this.totalDistance();var e=this._tmpDistance.length,n=0,i=this._tmpDistance[this._tmpDistance.length-1];0>t?t=i+t:t>i&&(t-=i);for(var r=0;e>r&&(t>=this._tmpDistance[r]&&(n=r),!(t<this._tmpDistance[r]));r++);if(n===this.length-1)return this.getPointAt(n);var s=t-this._tmpDistance[n],o=this._tmpDistance[n+1]-this._tmpDistance[n];return this.getPointAt(n+s/o)}},{key:"parsePoints",value:function(){if(!this.dirty)return this;this.dirty=!1,this.polygon.points.length=0;for(var t=0;t<this.graphicsData.length;t++){var e=this.graphicsData[t].shape;e&&e.points&&(this.polygon.points=this.polygon.points.concat(e.points))}return this}},{key:"clear",value:function(){return this.graphicsData.length=0,this.currentPath=null,this.polygon.points.length=0,this._closed=!1,this.dirty=!1,this}},{key:"closed",get:function(){return this._closed},set:function(t){this._closed!==t&&(this.polygon.closed=t,this._closed=t,this.dirty=!0)}},{key:"length",get:function(){return this.polygon.points.length?this.polygon.points.length/2+(this._closed?1:0):0}}]),t}();e["default"]=u},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(4),u=i(a),h=n(3),c=i(h),l=n(5),f=i(l),p=n(2),d=i(p);o.Graphics.prototype.drawPath=function(t){return t.parsePoints(),this.drawShape(t.polygon),this};var g={TweenManager:u["default"],Tween:c["default"],Easing:d["default"],TweenPath:f["default"]};o.tweenManager||(o.tweenManager=new u["default"],o.tween=g),e["default"]=g}]);
//# sourceMappingURL=pixi-tween.js.map
},{}],29:[function(require,module,exports){
module.exports={
  "A": {
    "image": "cell1.png",
    "active": false,
    "activationImage": "cell1-fill.png",
    "activation": 8,
    "score": 1
  },
  "B": {
    "image": "cell2.png",
    "active": false
  },
  "C": {
    "image": "cell4.png",
    "active": false,
    "activationImage": "cell4-fill.png",
    "activation": 22,
    "score": 3
  },
  "IC": {
    "activationImage": "islandC.png",
    "active": true,
    "playerDir": "top",
    "action": "history",
    "activation": 0
  },
  "ITL": {
    "activationImage": "islandTL.png",
    "active": true,
    "playerDir": "top"
  },
  "IT": {
    "activationImage": "islandT.png",
    "active": true,
    "playerDir": "top"
  },
  "ITR": {
    "activationImage": "islandTR.png",
    "active": true,
    "playerDir": "top"
  },
  "IR": {
    "activationImage": "islandR.png",
    "active": true,
    "action": "history",
    "playerDir": "top"
  },
  "IBR": {
    "activationImage": "islandBR.png",
    "active": true,
    "playerDir": "top"
  },
  "IB": {
    "activationImage": "islandB.png",
    "active": true,
    "playerDir": "top"
  },
  "IBL": {
    "activationImage": "islandBL.png",
    "active": true,
    "playerDir": "top"
  },
  "IL": {
    "activationImage": "islandL.png",
    "active": true,
    "playerDir": "top",
    "action": "history",
    "activation": 0
  }
}

},{}],30:[function(require,module,exports){
module.exports={
  "let": [
    {
      "map": ["A", "A|C|B", "A|A|A|A|C|B", "A"],
      "shuffle": true,
      "trim": 3
    },
    {
      "map": ["A|A|C", "A|B", "A", "B", "A"],
      "shuffle": true,
    }
  ],
  "end": [
    {
      "map": ["A", "A", "A", "A", "A"],
    }
  ],
  "labirint": [
    {
      "map": ["A", "B", "B", "B", "B"],
      "shuffle": true
    },
    {
      "map": ["A", "A", "A", "A", "A"],
    }
  ],
  "island": [
    {
      "map": ["A|C|B", "A", "A|C|B"]
    },
    {
      "map": ["ITL", "IT", "ITR"]
    },
    {
      "map": ["IL",  "IC",  "IR"]
    },
    {
      "map": ["IBL", "IB", "IBR"]
    }
  ]
}

},{}],31:[function(require,module,exports){
module.exports=[
  {
    "fragments": [
      {"island": 1},
      {"let": 4},
      {"labirint": 5},
      {"end": 1},
      {"island": 1},
    ],
    "history": {
      "ru": "Тлен идет за тобой по пятам. \n Отступись и он тебя поглатит... \n Но не стоит отчаиваться, ведь музыка всегда с тобой."
    }
  },
  {
    "fragments": [
      {"let": 10},
      {"labirint": 10},
      {"end": 1},
      {"island": 1}
    ],
    "history": {
      "ru": "Тлен не щадит никого. Летучие змеи падут на землю и погрузятся в рутину бытия..."
    }
  },
  {
    "fragments": [
      {"let": 5},
      {"labirint": 5},
      {"let": 5},
      {"labirint": 5},
      {"let": 5},
      {"labirint": 5},
      {"let": 5},
      {"labirint": 5},
      {"end": 1},
      {"island": 1}
    ],
    "history": {
      "ru": "И тогда он понес свечу через чужие земли освобождая летучих змей и свой народ..."
    }
  }
]

},{}],32:[function(require,module,exports){
const ScenesManager = require('./managers/ScenesManager');
const filters = require('pixi-filters');

class Game extends PIXI.Application {
  constructor() {
    super(window.innerWidth, window.innerHeight, {backgroundColor: 0xfcfcfc})
    document.body.appendChild(this.view);

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.container = new PIXI.Container();
    this.stage.addChild(this.container);

    this.bg = new PIXI.Sprite(PIXI.Texture.fromImage('bg'));
    this.bg.width = this.w;
    this.bg.height = this.h;
    this.container.addChild(this.bg);

    this.scenes = new ScenesManager(this);
    this.container.addChild(this.scenes);

    this.container.filterArea = new PIXI.Rectangle(0, 0, this.w, this.h);
    this.container.filters = [new filters.OldFilmFilter({
      sepia: 0,
      vignetting: .01,
      noise: .1,
      vignettingBlur: 1
    })];

    this._initTicker();
  }
  _initTicker() {
    console.log(this.ticker)

    this.ticker.add((dt) => {
      this.scenes.update(dt);
      PIXI.tweenManager.update();
      this.container.filters[0].seed = Math.random();
      this.container.filters[0].time += .01;
    });
  }
}

module.exports = Game;

},{"./managers/ScenesManager":37,"pixi-filters":25}],33:[function(require,module,exports){
require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
const Game = require('./game');

WebFont.load({
  google: {
    families: ['Amatic SC']
  },
  active() {
    PIXI.loader
      .add('blocks', 'assets/blocks.json')
      .add('player', 'assets/player.png')
      .add('bg', 'assets/bg1.png')
      .add('lightmap', 'assets/lightmap.png')
      .add('mask', 'assets/mask.png')
      .add('music', 'assets/music.mp3')
      .load((loader, resources) => {
        PIXI.sound.play('music');
        let game = new Game();
        game.scenes.enableScene('playground');

        window.game = game;
      });
  }
});

},{"./game":32,"pixi-projection":26,"pixi-sound":27,"pixi-tween":28}],34:[function(require,module,exports){
class HistoryManager extends PIXI.projection.Container2d {
  constructor(scene) {
    super();

    this.game = scene.game;
    this.scene = scene;
    scene.addChild(this);

    this.proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.alpha = 0;

    this.text = new PIXI.Text('Text', {
      font: 'normal 40px Amatic SC',
      wordWrap: true,
      wordWrapWidth: this.game.w/2,
      fill: '#2d5bff',
      padding: 10,
      align: 'center'
    });
    this.text.anchor.set(.5);
    this.text.x = this.game.w/2;
    this.text.y = 150;
    this.addChild(this.text);
  }
  showText(txt, time) {
    this.text.setText(txt);

    let show = PIXI.tweenManager.createTween(this);
    show.from({alpha: 0}).to({alpha: 1});
    show.time = 1000;
    show.start();
    this.emit('showen');

    setTimeout(this.hideText.bind(this), time);
  }
  hideText() {
    let hide = PIXI.tweenManager.createTween(this);
    hide.from({alpha: 1}).to({alpha: 0});
    hide.time = 1000;
    hide.start();
    this.emit('hidden');
  }
}

module.exports = HistoryManager;

},{}],35:[function(require,module,exports){
/*
  Менеджер уровней, работает напрямую с MapManager
  используя данные levels.json и  fragments.json

  События:
    addedFragmentsData => new fragmentsData
    addedLevels => new levels
    addedLevel => new lvl

    switchedLevel => cur lvl
    wentNextLevel => cur lvl
    wentBackLevel => cur lvl
    switchedFragment => cur frag
    wentNextFragment => cur frag
    wentBackFragment => cur frag

    startedLevel => new lvl
    endedLevel => prev lvl
*/


class LevelManager extends PIXI.utils.EventEmitter {
  constructor(scene, map) {
    super();

    this.scene = scene;
    this.map = map;

    this.levels = [];
    this.fragmentsData = {};
    this.addFragmentsData(require('../content/fragments'));
    this.addLevels(require('../content/levels'))

    this.curLevelIndex = 0;
    this.curFragmentIndex = 0;
  }
  // getters
  getCurrentLevel() {
    return this.levels[this.curLevelIndex];
  }
  getCurrentFragment() {
    return this.getCurrentLevel() && this.getCurrentLevel().maps[this.curFragmentIndex];
  }

  // add fragments to db fragments
  addFragmentsData(data={}) {
    Object.assign(this.fragmentsData, data);
    this.emit('addedFragmentsData', data);
  }

  // add levels to db levels
  addLevels(levels=[]) {
    for(let i = 0; i < levels.length; i++) {
      this.addLevel(levels[i]);
    }
    this.emit('addedLevels', levels);
  }
  addLevel(lvl={}) {
    this.levels.push(lvl);

    // generated maps to lvl object
    lvl.maps = [];
    for(let i = 0; i < lvl.fragments.length; i++) {
      for(let key in lvl.fragments[i]) {
        for(let c = 0; c < lvl.fragments[i][key]; c++) {
          lvl.maps.push(this.fragmentsData[key]);
        }
      }
    }
    this.emit('addedLevel', lvl);
  }

  // Methods for levels control
  switchLevel(lvl) {
    if(lvl >= this.levels.length || lvl < 0) return;

    this.curLevelIndex = lvl;
    this.switchFragment(0);

    this.emit('startedLevel');
    this.emit('switchedLevel');
  }
  nextLevel() {
    this.switchLevel(this.curLevelIndex+1);
    this.emit('wentNextLevel');
  }
  backLevel() {
    this.switchLevel(this.curLevelIndex-1);
    this.emit('wentBackLevel');
  }

  // Methods for fragments control
  switchFragment(frag) {
    if(frag < 0) return;
    this.curFragmentIndex = frag;

    if(this.getCurrentFragment()) this.map.addMap(this.getCurrentFragment());
    else this.emit('endedLevel');
    this.emit('switchedFragment');
  }
  nextFragment() {
    this.switchFragment(this.curFragmentIndex+1);
    this.emit('wentNextFragment');
  }
  backFragment() {
    this.switchFragment(this.curFragmentIndex-1);
    this.emit('wentBackFragment');
  }
}

module.exports = LevelManager;

},{"../content/fragments":30,"../content/levels":31}],36:[function(require,module,exports){
/*
  Движок тайловой карты
  События:
    addedMap => map
    addedFragment => fragments
    addedBlock => block
    scrolledDown => dtDown
    scrolledTop => dtTop

    resized
    endedMap
    clearedOutRangeBlocks
*/


const Block = require('../subjects/Block');
const DataFragmentConverter = require('../utils/DataFragmentConverter');

class MapManager extends PIXI.projection.Container2d {
  constructor(scene, params={}) {
    super();
    scene.addChild(this);

    this.scene = scene;
    this.game = scene.game;

    this.maxAxisX = params.maxX || 5;
    this.blockSize = params.tileSize || 100;
    this.setBlocksData(require('../content/blocks'));
    this.resize();

    this.isStop = false;

    this.speed = 500;
    this.lastIndex = 0;
  }
  resize() {
    this.x = this.game.w/2-this.maxAxisX*this.blockSize/2;
    this.y = this.game.h-this.scene.PADDING_BOTTOM;
    this.emit('resized');
  }

  // Set params
  setBlocksData(data) {
    this.BLOCKS = data || {};
  }
  setMaxAxisX(max) {
    this.maxAxisX = max || 6;
    this.resize();
  }
  setBlockSize(size) {
    this.blockSize = size || 100;
    this.resize();
  }
  setSpeed(speed) {
    this.speed = speed || 500;
  }


  // Map Manager
  addMap(map) {
    for(let i = map.length-1; i >= 0; i--) {
      this.addFragment(map[i]);
    }
    this.emit('addedMap', map);
    this.clearOutRangeBlocks();
    this.computingMapEnd();
  }
  addFragment(fragData) {
    let frag = new DataFragmentConverter(fragData).fragment;
    // add block to center X axis, for example: round((8-4)/2) => +2 padding to block X pos
    for(let i = 0; i < frag.length; i++) {
      this.addBlock(frag[i], Math.round((this.maxAxisX-frag.length)/2)+i, this.lastIndex);
    }

    this.lastIndex++;
    this.emit('addedFragment', fragData);
  }
  addBlock(id, x, y) {
    if(id === '_') return;

    let posX = x*this.blockSize;
    let posY = -y*this.blockSize;
    let block = this.addChild(new Block(this, posX, posY, this.BLOCKS[id]));
    this.emit('addedBlock', block);
  }

  // Collision Widh Block
  getBlockFromPos(pos) {
    for(let i = 0; i < this.children.length; i++) {
      if(this.children[i].containsPoint(pos)) return this.children[i];
    }
  }

  // Moving Map
  scrollDown(blocks) {
    if(this.isStop) return;

    // Scroll map down on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y+blocks*this.blockSize});
    move.time = this.speed*blocks;
    move.on('end', () => {
      this.emit('scrolledDown', blocks);
      this.clearOutRangeBlocks();
      this.computingMapEnd();
    });
    move.start();
  }
  scrollTop(blocks) {
    if(this.isStop) return;

    // Scroll map top on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y-blocks*this.blockSize});
    move.time = this.speed*blocks;
    move.on('end', () => {
      this.emit('scrolledTop', blocks);
      this.clearOutRangeBlocks();
      this.computingMapEnd();
    });
    move.start();
  }

  // Computing map end (amt blocks < max amt blocks)
  computingMapEnd() {
    if(this.children.length < this.maxAxisX*(this.game.h/this.blockSize)) {
      this.emit('endedMap');
    }
  }

  // clear out range map blocks
  clearOutRangeBlocks() {
    for(let i = 0; i < this.children.length; i++) {
      if(this.children[i].worldTransform.ty-this.blockSize/2 > this.game.h) {
        this.removeChild(this.children[i]);
      }
    }
    this.emit('clearedOutRangeBlocks');
  }
}

module.exports = MapManager;

},{"../content/blocks":29,"../subjects/Block":41,"../utils/DataFragmentConverter":43}],37:[function(require,module,exports){
/*
  Класс для переключения видимого контейнера (рабочих сцен)
  События:
    addedScenes => scenes
    addedScene => scenes
    removedScene => scene
    restartedScene => scene
    disabledScene => scene
    enabledScene => scenes
    updated => dt
*/

class ScenesManager extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.scenes = require('../scenes');
    this.activeScene = null;
  }
  getScene(id) {
    return this.scenes[id];
  }

  // adding scenes
  addScenes(scenes) {
    for(let id in scenes) {
      this.addScene(id, scenes[id]);
    }
    this.emit('addedScenes', scenes);
  }
  addScene(id, scene) {
    this.scenes[id] = scene;
    this.emit('addedScene', scene);
  }
  removeScene(id) {
    let _scene = this.scenes[id];
    this.scenes[id] = null;
    this.emit('removedScene', _scene);
  }

  // Controls
  restartScene() {
    this.enableScene(this.activeScene._idScene);
    this.emit('restartedScene', this.activeScene);
  }
  disableScene() {
    let scene = this.removeChild(this.activeScene);
    this.activeScene = null;
    this.emit('disabledScene', scene);
  }
  enableScene(id) {
    this.disableScene();

    let Scene = this.getScene(id);
    this.activeScene = this.addChild(new Scene(this.game, this));
    this.activeScene._idScene = id;

    this.emit('enabledScene', this.activeScene);
  }

  update(dt) {
    this.activeScene && this.activeScene.update && this.activeScene.update(dt);
    this.emit('updated', dt);
  }
}

module.exports = ScenesManager;

},{"../scenes":40}],38:[function(require,module,exports){
class ScreenManager extends PIXI.Container {
  constructor(scene) {
    super();

    this.scene = scene;
  }
}

module.exports = ScreenManager;

},{}],39:[function(require,module,exports){
const MapManager = require('../managers/MapManager');
const LevelManager = require('../managers/LevelManager');
const HistoryManager = require('../managers/HistoryManager');
const ScreenManager = require('../managers/ScreenManager');
const Player = require('../subjects/Player');

class Playground extends PIXI.projection.Container2d {
  constructor(game) {
    super();
    this.game = game;

    // Projection scene
    this.proj.setAxisY({x: -this.game.w/2+50, y: 4000}, -1);

    // Constant for position object in projection
    this.interactive = true;
    this.PADDING_BOTTOM = 280;


    // Init objects
    this.map = new MapManager(this);
    this.screen = new ScreenManager(this);
    this.history = new HistoryManager(this);

    this.levels = new LevelManager(this, this.map);
    this.player = new Player(this, this.map);


    // Controls
    this.on('pointerdown', () => this.player.immunity());
    this.on('pointermove', (e) => {
      let block = this.map.getBlockFromPos(e.data.global);
      block && block.hit();
    });

    this.player.on('deaded', () => this.restart());
    this.player.on('collision', (block) => {
      if(block.action === 'history') this.history.showText(this.levels.getCurrentLevel().history.ru, 3000);
    });

    this.history.on('showen', () => {
      this.map.isStop = true;
    });
    this.history.on('hidden', () => {
      this.map.isStop = false;
      this.map.scrollDown(1);
      this.levels.nextLevel();
    });

    this.map.on('endedMap', () => this.levels.nextFragment());
    this.map.on('scrolledDown', () => this.player.moving());

    this.levels.switchLevel(0);
    this.map.scrollDown(1);
  }
  restart() {
    this.game.scenes.restartScene('playground');

    // this.screen.splash(0xFFFFFF, 1000).then(() => {
    //   this.game.scenes.restartScene('playground');
    // });
  }
}

module.exports = Playground;

},{"../managers/HistoryManager":34,"../managers/LevelManager":35,"../managers/MapManager":36,"../managers/ScreenManager":38,"../subjects/Player":42}],40:[function(require,module,exports){
module.exports = {
  'playground': require('./Playground')
}

},{"./Playground":39}],41:[function(require,module,exports){
/*
  Класс Блока, используется для тайлового движка
  События:
    activated
    deactivated
    hited
*/

class Block extends PIXI.projection.Sprite2d {
  constructor(map, x, y, params={}) {
    super(PIXI.Texture.fromFrame(params.image || params.activationImage));

    this.map = map;
    this.game = this.map.game;

    this.score = params.score;
    this.activation = params.activation || null;
    this.deactivationTexture = params.image ? PIXI.Texture.fromFrame(params.image) : null;
    this.activationTexture = params.activationImage ? PIXI.Texture.fromFrame(params.activationImage) : null;
    this.isActive = params.active;
    this.playerDir = params.playerDir || null;
    this.action = params.action || null;

    this.anchor.set(.5);
    this.width = map.blockSize+1;
    this.height = map.blockSize+1;
    this.x = x+map.blockSize/2+.5;
    this.y = y+map.blockSize/2+.5;
  }
  activate() {
    let activating = PIXI.tweenManager.createTween(this)
      .from({width: this.width*3/4, height: this.height*3/4})
      .to({width: this.width, height: this.height, rotation: 0});
    activating.time = 500;
    activating.easing = PIXI.tween.Easing.outBounce();
    activating.start();

    this.isActive = true;
    if(this.activationTexture) this.texture = this.activationTexture;

    this.emit('activated');
  }
  deactivate() {
    this.isActive = false;
    if(this.deactivationTexture) this.texture = this.deactivationTexture;
    this.emit('deactivated');
  }
  hit() {
    if(this.activation === null || this.isActive) return;

    let jolting = PIXI.tweenManager.createTween(this);
    jolting.from({rotation: 0}).to({rotation: Math.random() < .5 ? -.15 : .15});
    jolting.time = 100;
    jolting.pingPong = true;
    jolting.start();

    if(this.activation) this.activation--;
    else this.activate();
    this.emit('hited');
  }
}

module.exports = Block;

},{}],42:[function(require,module,exports){
/*
  Класс Player, взаимодействует с MapManager
  События

*/

class Player extends PIXI.projection.Sprite2d {
  constructor(scene, map) {
    super(PIXI.Texture.fromImage('player'));
    scene.addChild(this);

    this.game = scene.game;
    this.scene = scene;
    this.map = map;

    this.proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.anchor.set(.5, 1);
    this.scale.set(.5);
    this.x = this.game.w/2;
    this.y = this.game.h-this.map.blockSize/2-this.scene.PADDING_BOTTOM;

    this.walking = PIXI.tweenManager.createTween(this.scale);
    this.walking.from({x: .5, y: .5}).to({x: .6, y: .6});
    this.walking.time = 500;
    this.walking.loop = true;
    this.walking.pingPong = true;
    this.walking.start();

    this.lastMove = null;
    this.speed = this.map.speed || 500;
    this.isDead = false;

    this.IMMUNITY_BLOCKS = 2;
    this.immunityCount = 5;
    this.isImmunity = false;
  }
  moving() {
    if(this.isDead || this.isImmunity) return;

    let cur = this.map.getBlockFromPos({x: this.x, y: this.y+this.map.blockSize});
    if(cur && cur.isActive) {
      this.emit('collision', cur);

      if(cur.playerDir === 'top') return this.top();
      if(cur.playerDir === 'left') return this.left();
      if(cur.playerDir === 'right') return this.right();

      //check top
      let top = this.map.getBlockFromPos({x: this.x, y: this.y});
      if(top && top.isActive && this.lastMove !== 'bottom') return this.top();

      // check left
      let left = this.map.getBlockFromPos({x: this.x-this.map.blockSize, y: this.y+this.map.blockSize});
      if(left && left.isActive && this.lastMove !== 'right') return this.left();

      // check rigth
      let right = this.map.getBlockFromPos({x: this.x+this.map.blockSize, y: this.y+this.map.blockSize});
      if(right && right.isActive && this.lastMove !== 'left') return this.right();

      // or die
      this.top();
    } else this.dead();

    this.emit('moved');
  }
  dead() {
    this.walking.stop();
    this.isDead = true;

    let dead = PIXI.tweenManager.createTween(this.scale);
    dead.from({x: .5, y: .5}).to({x: 0, y: 0});
    dead.time = 200;
    dead.start();
    dead.on('end', () => this.emit('deaded'));
  }
  immunity() {
    if(!this.immunityCount) return;

    let immunity = PIXI.tweenManager.createTween(this);
    immunity.from({alpha: .5}).to({alpha: 1});
    immunity.time = this.speed*this.IMMUNITY_BLOCKS;
    immunity.start();

    this.map.scrollDown(this.IMMUNITY_BLOCKS);
    immunity.on('end', () => this.isImmunity = false);
    this.isImmunity = true;
    this.lastMove = 'top';
    this.immunityCount--;

    this.emit('actionImmunity');
  }
  top() {
    this.lastMove = 'top';
    this.map.scrollDown(1);

    this.emit('actionTop');
  }
  left() {
    this.lastMove = 'left';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x-this.map.blockSize});
    move.time = this.speed/2;
    move.start();

    move.on('end', () => this.moving());
    this.emit('actionLeft');
  }
  right() {
    this.lastMove = 'right';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x+this.map.blockSize});
    move.time = this.speed/2;
    move.start();

    move.on('end', () => this.moving());
    this.emit('actionRight');
  }
}

module.exports = Player;

},{}],43:[function(require,module,exports){
/*
This util class for converted data from fragments.json
object to simple map array, for example: ['A', 'A', 'A', 'A']
*/

class DataFragmentConverter {
  constructor(data) {
    this.data = data;
    this.inputMap = data.map;
    this.fragment = [];

    // OPERATORS
    for(let i = 0; i < data.map.length; i++) {
      if(~~data.map[i].indexOf('|')) this.caseOperator(data.map[i], i);
      else this.fragment[i] = data.map[i];
    }

    // METHODS
    data.trim && this.randomTrim(data.trim);
    data.append && this.randomAppend(data.append);
    data.shuffle && this.shuffle();
  }

  // OPERATORS
  // Case operator: 'A|B|C|D' => C and etc...
  caseOperator(str, i) {
    let ids = str.split('|');
    this.fragment[i] = ids[Math.floor(Math.random()*ids.length)];
    return this;
  }

  // METHODS
  // Trimming array in range 0..rand(min, length)
  randomTrim(min) {
    this.fragment.length = Math.floor(Math.random() * (this.fragment.length+1 - min) + min);
    return this;
  }
  // Shuffle array [1,2,3] => [2,1,3] and etc...
  shuffle() {
    this.fragment.sort((a, b) => Math.random() < .5 ? -1 : 1);
    return this;
  }
  // Adds a block to the random location of the array: [A,A,A] => [B,A,A] and etc...
  randomAppend(id) {
    this.fragment[Math.floor(Math.random()*this.fragment.length)] = id;
    return this;
  }
}

module.exports = DataFragmentConverter;

},{}]},{},[33])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItYWR2YW5jZWQtYmxvb20vbGliL2ZpbHRlci1hZHZhbmNlZC1ibG9vbS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vbm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1hc2NpaS9saWIvZmlsdGVyLWFzY2lpLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWJsb29tL2xpYi9maWx0ZXItYmxvb20uanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItYnVsZ2UtcGluY2gvbGliL2ZpbHRlci1idWxnZS1waW5jaC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vbm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1jb2xvci1yZXBsYWNlL2xpYi9maWx0ZXItY29sb3ItcmVwbGFjZS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vbm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1jb252b2x1dGlvbi9saWIvZmlsdGVyLWNvbnZvbHV0aW9uLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWNyb3NzLWhhdGNoL2xpYi9maWx0ZXItY3Jvc3MtaGF0Y2guanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZG90L2xpYi9maWx0ZXItZG90LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93L2xpYi9maWx0ZXItZHJvcC1zaGFkb3cuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZW1ib3NzL2xpYi9maWx0ZXItZW1ib3NzLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWdsb3cvbGliL2ZpbHRlci1nbG93LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWdvZHJheS9saWIvZmlsdGVyLWdvZHJheS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vbm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1tb3Rpb24tYmx1ci9saWIvZmlsdGVyLW1vdGlvbi1ibHVyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UvbGliL2ZpbHRlci1tdWx0aS1jb2xvci1yZXBsYWNlLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLW9sZC1maWxtL2xpYi9maWx0ZXItb2xkLWZpbG0uanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItb3V0bGluZS9saWIvZmlsdGVyLW91dGxpbmUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItcGl4ZWxhdGUvbGliL2ZpbHRlci1waXhlbGF0ZS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vbm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1yYWRpYWwtYmx1ci9saWIvZmlsdGVyLXJhZGlhbC1ibHVyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLXJnYi1zcGxpdC9saWIvZmlsdGVyLXJnYi1zcGxpdC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vbm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1zaG9ja3dhdmUvbGliL2ZpbHRlci1zaG9ja3dhdmUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwL2xpYi9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLXRpbHQtc2hpZnQvbGliL2ZpbHRlci10aWx0LXNoaWZ0LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLXR3aXN0L2xpYi9maWx0ZXItdHdpc3QuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItem9vbS1ibHVyL2xpYi9maWx0ZXItem9vbS1ibHVyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9ub2RlX21vZHVsZXMvcGl4aS1maWx0ZXJzL2xpYi9waXhpLWZpbHRlcnMuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9waXhpLXByb2plY3Rpb24vZGlzdC9waXhpLXByb2plY3Rpb24uanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9waXhpLXNvdW5kL2Rpc3QvcGl4aS1zb3VuZC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vbm9kZV9tb2R1bGVzL3BpeGktdHdlZW4vYnVpbGQvcGl4aS10d2Vlbi5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2NvbnRlbnQvYmxvY2tzLmpzb24iLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9jb250ZW50L2ZyYWdtZW50cy5qc29uIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvY29udGVudC9sZXZlbHMuanNvbiIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2dhbWUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0hpc3RvcnlNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvTGV2ZWxNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvTWFwTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL1NjZW5lc01hbmFnZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9tYW5hZ2Vycy9TY3JlZW5NYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc2NlbmVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zY2VuZXMvaW5kZXguanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdWJqZWN0cy9CbG9jay5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N1YmplY3RzL1BsYXllci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3V0aWxzL0RhdGFGcmFnbWVudENvbnZlcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWFkdmFuY2VkLWJsb29tIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1hZHZhbmNlZC1ibG9vbSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHIpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3IoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHIpOnIoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwiXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBmbG9hdCB0aHJlc2hvbGQ7XFxuXFxudm9pZCBtYWluKCkge1xcbiAgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgLy8gQSBzaW1wbGUgJiBmYXN0IGFsZ29yaXRobSBmb3IgZ2V0dGluZyBicmlnaHRuZXNzLlxcbiAgICAvLyBJdCdzIGluYWNjdXJhY3kgLCBidXQgZ29vZCBlbm91Z2h0IGZvciB0aGlzIGZlYXR1cmUuXFxuICAgIGZsb2F0IF9tYXggPSBtYXgobWF4KGNvbG9yLnIsIGNvbG9yLmcpLCBjb2xvci5iKTtcXG4gICAgZmxvYXQgX21pbiA9IG1pbihtaW4oY29sb3IuciwgY29sb3IuZyksIGNvbG9yLmIpO1xcbiAgICBmbG9hdCBicmlnaHRuZXNzID0gKF9tYXggKyBfbWluKSAqIDAuNTtcXG5cXG4gICAgaWYoYnJpZ2h0bmVzcyA+IHRocmVzaG9sZCkge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gY29sb3I7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDAuMCk7XFxuICAgIH1cXG59XFxuXCIsbz1mdW5jdGlvbihlKXtmdW5jdGlvbiBvKG8pe3ZvaWQgMD09PW8mJihvPS41KSxlLmNhbGwodGhpcyxyLHQpLHRoaXMudGhyZXNob2xkPW99ZSYmKG8uX19wcm90b19fPWUpLChvLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bzt2YXIgbj17dGhyZXNob2xkOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi50aHJlc2hvbGQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudGhyZXNob2xkfSxuLnRocmVzaG9sZC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy50aHJlc2hvbGQ9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoby5wcm90b3R5cGUsbiksb30oUElYSS5GaWx0ZXIpLG49XCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCBibG9vbVRleHR1cmU7XFxudW5pZm9ybSBmbG9hdCBibG9vbVNjYWxlO1xcbnVuaWZvcm0gZmxvYXQgYnJpZ2h0bmVzcztcXG5cXG52b2lkIG1haW4oKSB7XFxuICAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICBjb2xvci5yZ2IgKj0gYnJpZ2h0bmVzcztcXG4gICAgdmVjNCBibG9vbUNvbG9yID0gdmVjNCh0ZXh0dXJlMkQoYmxvb21UZXh0dXJlLCB2VGV4dHVyZUNvb3JkKS5yZ2IsIDAuMCk7XFxuICAgIGJsb29tQ29sb3IucmdiICo9IGJsb29tU2NhbGU7XFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yICsgYmxvb21Db2xvcjtcXG59XFxuXCIsaT1mdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQpe2UuY2FsbCh0aGlzLHIsbiksXCJudW1iZXJcIj09dHlwZW9mIHQmJih0PXt0aHJlc2hvbGQ6dH0pLHQ9T2JqZWN0LmFzc2lnbih7dGhyZXNob2xkOi41LGJsb29tU2NhbGU6MSxicmlnaHRuZXNzOjEsYmx1cjo4LHF1YWxpdHk6NCxyZXNvbHV0aW9uOlBJWEkuc2V0dGluZ3MuUkVTT0xVVElPTixrZXJuZWxTaXplOjV9LHQpLHRoaXMuYmxvb21TY2FsZT10LmJsb29tU2NhbGUsdGhpcy5icmlnaHRuZXNzPXQuYnJpZ2h0bmVzczt2YXIgaT10LmJsdXIsbD10LnF1YWxpdHkscz10LnJlc29sdXRpb24sdT10Lmtlcm5lbFNpemUsYT1QSVhJLmZpbHRlcnMsYz1hLkJsdXJYRmlsdGVyLGg9YS5CbHVyWUZpbHRlcjt0aGlzLl9leHRyYWN0PW5ldyBvKHQudGhyZXNob2xkKSx0aGlzLl9ibHVyWD1uZXcgYyhpLGwscyx1KSx0aGlzLl9ibHVyWT1uZXcgaChpLGwscyx1KX1lJiYodC5fX3Byb3RvX189ZSksKHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj10O3ZhciBpPXt0aHJlc2hvbGQ6e2NvbmZpZ3VyYWJsZTohMH0sYmx1cjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUscix0LG8sbil7dmFyIGk9ZS5nZXRSZW5kZXJUYXJnZXQoITApO3RoaXMuX2V4dHJhY3QuYXBwbHkoZSxyLGksITAsbiksdGhpcy5fYmx1clguYXBwbHkoZSxpLGksITAsbiksdGhpcy5fYmx1clkuYXBwbHkoZSxpLGksITAsbiksdGhpcy51bmlmb3Jtcy5ibG9vbVNjYWxlPXRoaXMuYmxvb21TY2FsZSx0aGlzLnVuaWZvcm1zLmJyaWdodG5lc3M9dGhpcy5icmlnaHRuZXNzLHRoaXMudW5pZm9ybXMuYmxvb21UZXh0dXJlPWksZS5hcHBseUZpbHRlcih0aGlzLHIsdCxvKSxlLnJldHVyblJlbmRlclRhcmdldChpKX0saS50aHJlc2hvbGQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2V4dHJhY3QudGhyZXNob2xkfSxpLnRocmVzaG9sZC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5fZXh0cmFjdC50aHJlc2hvbGQ9ZX0saS5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9ibHVyWC5ibHVyfSxpLmJsdXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2JsdXJYLmJsdXI9dGhpcy5fYmx1clkuYmx1cj1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LnByb3RvdHlwZSxpKSx0fShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkFkdmFuY2VkQmxvb21GaWx0ZXI9aSxlLkFkdmFuY2VkQmxvb21GaWx0ZXI9aSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWFkdmFuY2VkLWJsb29tLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItYXNjaWkgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWFzY2lpIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLG89XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIGZsb2F0IHBpeGVsU2l6ZTtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG52ZWMyIG1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkICo9IGZpbHRlckFyZWEueHk7XFxuICAgIGNvb3JkICs9IGZpbHRlckFyZWEuenc7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB1bm1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkIC09IGZpbHRlckFyZWEuenc7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiBwaXhlbGF0ZSh2ZWMyIGNvb3JkLCB2ZWMyIHNpemUpXFxue1xcbiAgICByZXR1cm4gZmxvb3IoIGNvb3JkIC8gc2l6ZSApICogc2l6ZTtcXG59XFxuXFxudmVjMiBnZXRNb2QodmVjMiBjb29yZCwgdmVjMiBzaXplKVxcbntcXG4gICAgcmV0dXJuIG1vZCggY29vcmQgLCBzaXplKSAvIHNpemU7XFxufVxcblxcbmZsb2F0IGNoYXJhY3RlcihmbG9hdCBuLCB2ZWMyIHApXFxue1xcbiAgICBwID0gZmxvb3IocCp2ZWMyKDQuMCwgLTQuMCkgKyAyLjUpO1xcbiAgICBpZiAoY2xhbXAocC54LCAwLjAsIDQuMCkgPT0gcC54ICYmIGNsYW1wKHAueSwgMC4wLCA0LjApID09IHAueSlcXG4gICAge1xcbiAgICAgICAgaWYgKGludChtb2Qobi9leHAyKHAueCArIDUuMCpwLnkpLCAyLjApKSA9PSAxKSByZXR1cm4gMS4wO1xcbiAgICB9XFxuICAgIHJldHVybiAwLjA7XFxufVxcblxcbnZvaWQgbWFpbigpXFxue1xcbiAgICB2ZWMyIGNvb3JkID0gbWFwQ29vcmQodlRleHR1cmVDb29yZCk7XFxuXFxuICAgIC8vIGdldCB0aGUgcm91bmRlZCBjb2xvci4uXFxuICAgIHZlYzIgcGl4Q29vcmQgPSBwaXhlbGF0ZShjb29yZCwgdmVjMihwaXhlbFNpemUpKTtcXG4gICAgcGl4Q29vcmQgPSB1bm1hcENvb3JkKHBpeENvb3JkKTtcXG5cXG4gICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgcGl4Q29vcmQpO1xcblxcbiAgICAvLyBkZXRlcm1pbmUgdGhlIGNoYXJhY3RlciB0byB1c2VcXG4gICAgZmxvYXQgZ3JheSA9IChjb2xvci5yICsgY29sb3IuZyArIGNvbG9yLmIpIC8gMy4wO1xcblxcbiAgICBmbG9hdCBuID0gIDY1NTM2LjA7ICAgICAgICAgICAgIC8vIC5cXG4gICAgaWYgKGdyYXkgPiAwLjIpIG4gPSA2NTYwMC4wOyAgICAvLyA6XFxuICAgIGlmIChncmF5ID4gMC4zKSBuID0gMzMyNzcyLjA7ICAgLy8gKlxcbiAgICBpZiAoZ3JheSA+IDAuNCkgbiA9IDE1MjU1MDg2LjA7IC8vIG9cXG4gICAgaWYgKGdyYXkgPiAwLjUpIG4gPSAyMzM4NTE2NC4wOyAvLyAmXFxuICAgIGlmIChncmF5ID4gMC42KSBuID0gMTUyNTIwMTQuMDsgLy8gOFxcbiAgICBpZiAoZ3JheSA+IDAuNykgbiA9IDEzMTk5NDUyLjA7IC8vIEBcXG4gICAgaWYgKGdyYXkgPiAwLjgpIG4gPSAxMTUxMjgxMC4wOyAvLyAjXFxuXFxuICAgIC8vIGdldCB0aGUgbW9kLi5cXG4gICAgdmVjMiBtb2RkID0gZ2V0TW9kKGNvb3JkLCB2ZWMyKHBpeGVsU2l6ZSkpO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBjb2xvciAqIGNoYXJhY3RlciggbiwgdmVjMigtMS4wKSArIG1vZGQgKiAyLjApO1xcblxcbn1cIixyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHIocil7dm9pZCAwPT09ciYmKHI9OCksZS5jYWxsKHRoaXMsbixvKSx0aGlzLnNpemU9cn1lJiYoci5fX3Byb3RvX189ZSksKHIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1yO3ZhciBpPXtzaXplOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5zaXplLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnBpeGVsU2l6ZX0saS5zaXplLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnBpeGVsU2l6ZT1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxpKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkFzY2lpRmlsdGVyPXIsZS5Bc2NpaUZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItYXNjaWkuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1ibG9vbSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItYmxvb20gaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24odCxyKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9yKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxyKTpyKHQuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9UElYSS5maWx0ZXJzLGU9ci5CbHVyWEZpbHRlcixpPXIuQmx1cllGaWx0ZXIsbD1yLkFscGhhRmlsdGVyLHU9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gcihyLHUsbixvKXt2b2lkIDA9PT1yJiYocj0yKSx2b2lkIDA9PT11JiYodT00KSx2b2lkIDA9PT1uJiYobj1QSVhJLnNldHRpbmdzLlJFU09MVVRJT04pLHZvaWQgMD09PW8mJihvPTUpLHQuY2FsbCh0aGlzKTt2YXIgYixzO1wibnVtYmVyXCI9PXR5cGVvZiByPyhiPXIscz1yKTpyIGluc3RhbmNlb2YgUElYSS5Qb2ludD8oYj1yLngscz1yLnkpOkFycmF5LmlzQXJyYXkocikmJihiPXJbMF0scz1yWzFdKSx0aGlzLmJsdXJYRmlsdGVyPW5ldyBlKGIsdSxuLG8pLHRoaXMuYmx1cllGaWx0ZXI9bmV3IGkocyx1LG4sbyksdGhpcy5ibHVyWUZpbHRlci5ibGVuZE1vZGU9UElYSS5CTEVORF9NT0RFUy5TQ1JFRU4sdGhpcy5kZWZhdWx0RmlsdGVyPW5ldyBsfXQmJihyLl9fcHJvdG9fXz10KSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIHU9e2JsdXI6e2NvbmZpZ3VyYWJsZTohMH0sYmx1clg6e2NvbmZpZ3VyYWJsZTohMH0sYmx1clk6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbih0LHIsZSl7dmFyIGk9dC5nZXRSZW5kZXJUYXJnZXQoITApO3RoaXMuZGVmYXVsdEZpbHRlci5hcHBseSh0LHIsZSksdGhpcy5ibHVyWEZpbHRlci5hcHBseSh0LHIsaSksdGhpcy5ibHVyWUZpbHRlci5hcHBseSh0LGksZSksdC5yZXR1cm5SZW5kZXJUYXJnZXQoaSl9LHUuYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyWEZpbHRlci5ibHVyfSx1LmJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1clhGaWx0ZXIuYmx1cj10aGlzLmJsdXJZRmlsdGVyLmJsdXI9dH0sdS5ibHVyWC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyWEZpbHRlci5ibHVyfSx1LmJsdXJYLnNldD1mdW5jdGlvbih0KXt0aGlzLmJsdXJYRmlsdGVyLmJsdXI9dH0sdS5ibHVyWS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyWUZpbHRlci5ibHVyfSx1LmJsdXJZLnNldD1mdW5jdGlvbih0KXt0aGlzLmJsdXJZRmlsdGVyLmJsdXI9dH0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsdSkscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5CbG9vbUZpbHRlcj11LHQuQmxvb21GaWx0ZXI9dSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWJsb29tLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItYnVsZ2UtcGluY2ggLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWJ1bGdlLXBpbmNoIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ1bmlmb3JtIGZsb2F0IHJhZGl1cztcXG51bmlmb3JtIGZsb2F0IHN0cmVuZ3RoO1xcbnVuaWZvcm0gdmVjMiBjZW50ZXI7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckNsYW1wO1xcbnVuaWZvcm0gdmVjMiBkaW1lbnNpb25zO1xcblxcbnZvaWQgbWFpbigpXFxue1xcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHk7XFxuICAgIGNvb3JkIC09IGNlbnRlciAqIGRpbWVuc2lvbnMueHk7XFxuICAgIGZsb2F0IGRpc3RhbmNlID0gbGVuZ3RoKGNvb3JkKTtcXG4gICAgaWYgKGRpc3RhbmNlIDwgcmFkaXVzKSB7XFxuICAgICAgICBmbG9hdCBwZXJjZW50ID0gZGlzdGFuY2UgLyByYWRpdXM7XFxuICAgICAgICBpZiAoc3RyZW5ndGggPiAwLjApIHtcXG4gICAgICAgICAgICBjb29yZCAqPSBtaXgoMS4wLCBzbW9vdGhzdGVwKDAuMCwgcmFkaXVzIC8gZGlzdGFuY2UsIHBlcmNlbnQpLCBzdHJlbmd0aCAqIDAuNzUpO1xcbiAgICAgICAgfSBlbHNlIHtcXG4gICAgICAgICAgICBjb29yZCAqPSBtaXgoMS4wLCBwb3cocGVyY2VudCwgMS4wICsgc3RyZW5ndGggKiAwLjc1KSAqIHJhZGl1cyAvIGRpc3RhbmNlLCAxLjAgLSBwZXJjZW50KTtcXG4gICAgICAgIH1cXG4gICAgfVxcbiAgICBjb29yZCArPSBjZW50ZXIgKiBkaW1lbnNpb25zLnh5O1xcbiAgICBjb29yZCAvPSBmaWx0ZXJBcmVhLnh5O1xcbiAgICB2ZWMyIGNsYW1wZWRDb29yZCA9IGNsYW1wKGNvb3JkLCBmaWx0ZXJDbGFtcC54eSwgZmlsdGVyQ2xhbXAuencpO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wZWRDb29yZCk7XFxuICAgIGlmIChjb29yZCAhPSBjbGFtcGVkQ29vcmQpIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciAqPSBtYXgoMC4wLCAxLjAgLSBsZW5ndGgoY29vcmQgLSBjbGFtcGVkQ29vcmQpKTtcXG4gICAgfVxcbn1cXG5cIixyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHIocixvLGkpe2UuY2FsbCh0aGlzLG4sdCksdGhpcy5jZW50ZXI9cnx8Wy41LC41XSx0aGlzLnJhZGl1cz1vfHwxMDAsdGhpcy5zdHJlbmd0aD1pfHwxfWUmJihyLl9fcHJvdG9fXz1lKSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIG89e3JhZGl1czp7Y29uZmlndXJhYmxlOiEwfSxzdHJlbmd0aDp7Y29uZmlndXJhYmxlOiEwfSxjZW50ZXI6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLG4sdCxyKXt0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMF09bi5zb3VyY2VGcmFtZS53aWR0aCx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMV09bi5zb3VyY2VGcmFtZS5oZWlnaHQsZS5hcHBseUZpbHRlcih0aGlzLG4sdCxyKX0sby5yYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucmFkaXVzfSxvLnJhZGl1cy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5yYWRpdXM9ZX0sby5zdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zdHJlbmd0aH0sby5zdHJlbmd0aC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zdHJlbmd0aD1lfSxvLmNlbnRlci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5jZW50ZXJ9LG8uY2VudGVyLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmNlbnRlcj1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxvKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkJ1bGdlUGluY2hGaWx0ZXI9cixlLkJ1bGdlUGluY2hGaWx0ZXI9cixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWJ1bGdlLXBpbmNoLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItY29sb3ItcmVwbGFjZSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItY29sb3ItcmVwbGFjZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihvLGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUoby5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihvKXtcInVzZSBzdHJpY3RcIjt2YXIgZT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTtcXG51bmlmb3JtIHZlYzMgb3JpZ2luYWxDb2xvcjtcXG51bmlmb3JtIHZlYzMgbmV3Q29sb3I7XFxudW5pZm9ybSBmbG9hdCBlcHNpbG9uO1xcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIHZlYzQgY3VycmVudENvbG9yID0gdGV4dHVyZTJEKHRleHR1cmUsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWMzIGNvbG9yRGlmZiA9IG9yaWdpbmFsQ29sb3IgLSAoY3VycmVudENvbG9yLnJnYiAvIG1heChjdXJyZW50Q29sb3IuYSwgMC4wMDAwMDAwMDAxKSk7XFxuICAgIGZsb2F0IGNvbG9yRGlzdGFuY2UgPSBsZW5ndGgoY29sb3JEaWZmKTtcXG4gICAgZmxvYXQgZG9SZXBsYWNlID0gc3RlcChjb2xvckRpc3RhbmNlLCBlcHNpbG9uKTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChtaXgoY3VycmVudENvbG9yLnJnYiwgKG5ld0NvbG9yICsgY29sb3JEaWZmKSAqIGN1cnJlbnRDb2xvci5hLCBkb1JlcGxhY2UpLCBjdXJyZW50Q29sb3IuYSk7XFxufVxcblwiLG49ZnVuY3Rpb24obyl7ZnVuY3Rpb24gbihuLGksdCl7dm9pZCAwPT09biYmKG49MTY3MTE2ODApLHZvaWQgMD09PWkmJihpPTApLHZvaWQgMD09PXQmJih0PS40KSxvLmNhbGwodGhpcyxlLHIpLHRoaXMub3JpZ2luYWxDb2xvcj1uLHRoaXMubmV3Q29sb3I9aSx0aGlzLmVwc2lsb249dH1vJiYobi5fX3Byb3RvX189byksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobyYmby5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciBpPXtvcmlnaW5hbENvbG9yOntjb25maWd1cmFibGU6ITB9LG5ld0NvbG9yOntjb25maWd1cmFibGU6ITB9LGVwc2lsb246e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLm9yaWdpbmFsQ29sb3Iuc2V0PWZ1bmN0aW9uKG8pe3ZhciBlPXRoaXMudW5pZm9ybXMub3JpZ2luYWxDb2xvcjtcIm51bWJlclwiPT10eXBlb2Ygbz8oUElYSS51dGlscy5oZXgycmdiKG8sZSksdGhpcy5fb3JpZ2luYWxDb2xvcj1vKTooZVswXT1vWzBdLGVbMV09b1sxXSxlWzJdPW9bMl0sdGhpcy5fb3JpZ2luYWxDb2xvcj1QSVhJLnV0aWxzLnJnYjJoZXgoZSkpfSxpLm9yaWdpbmFsQ29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX29yaWdpbmFsQ29sb3J9LGkubmV3Q29sb3Iuc2V0PWZ1bmN0aW9uKG8pe3ZhciBlPXRoaXMudW5pZm9ybXMubmV3Q29sb3I7XCJudW1iZXJcIj09dHlwZW9mIG8/KFBJWEkudXRpbHMuaGV4MnJnYihvLGUpLHRoaXMuX25ld0NvbG9yPW8pOihlWzBdPW9bMF0sZVsxXT1vWzFdLGVbMl09b1syXSx0aGlzLl9uZXdDb2xvcj1QSVhJLnV0aWxzLnJnYjJoZXgoZSkpfSxpLm5ld0NvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9uZXdDb2xvcn0saS5lcHNpbG9uLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLmVwc2lsb249b30saS5lcHNpbG9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmVwc2lsb259LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLGkpLG59KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQ29sb3JSZXBsYWNlRmlsdGVyPW4sby5Db2xvclJlcGxhY2VGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWNvbG9yLXJlcGxhY2UuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1jb252b2x1dGlvbiAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItY29udm9sdXRpb24gaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWMyIHRleGVsU2l6ZTtcXG51bmlmb3JtIGZsb2F0IG1hdHJpeFs5XTtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgdmVjNCBjMTEgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgLSB0ZXhlbFNpemUpOyAvLyB0b3AgbGVmdFxcbiAgIHZlYzQgYzEyID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55IC0gdGV4ZWxTaXplLnkpKTsgLy8gdG9wIGNlbnRlclxcbiAgIHZlYzQgYzEzID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCArIHRleGVsU2l6ZS54LCB2VGV4dHVyZUNvb3JkLnkgLSB0ZXhlbFNpemUueSkpOyAvLyB0b3AgcmlnaHRcXG5cXG4gICB2ZWM0IGMyMSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSB0ZXhlbFNpemUueCwgdlRleHR1cmVDb29yZC55KSk7IC8vIG1pZCBsZWZ0XFxuICAgdmVjNCBjMjIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpOyAvLyBtaWQgY2VudGVyXFxuICAgdmVjNCBjMjMgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54ICsgdGV4ZWxTaXplLngsIHZUZXh0dXJlQ29vcmQueSkpOyAvLyBtaWQgcmlnaHRcXG5cXG4gICB2ZWM0IGMzMSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSB0ZXhlbFNpemUueCwgdlRleHR1cmVDb29yZC55ICsgdGV4ZWxTaXplLnkpKTsgLy8gYm90dG9tIGxlZnRcXG4gICB2ZWM0IGMzMiA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLngsIHZUZXh0dXJlQ29vcmQueSArIHRleGVsU2l6ZS55KSk7IC8vIGJvdHRvbSBjZW50ZXJcXG4gICB2ZWM0IGMzMyA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIHRleGVsU2l6ZSk7IC8vIGJvdHRvbSByaWdodFxcblxcbiAgIGdsX0ZyYWdDb2xvciA9XFxuICAgICAgIGMxMSAqIG1hdHJpeFswXSArIGMxMiAqIG1hdHJpeFsxXSArIGMxMyAqIG1hdHJpeFsyXSArXFxuICAgICAgIGMyMSAqIG1hdHJpeFszXSArIGMyMiAqIG1hdHJpeFs0XSArIGMyMyAqIG1hdHJpeFs1XSArXFxuICAgICAgIGMzMSAqIG1hdHJpeFs2XSArIGMzMiAqIG1hdHJpeFs3XSArIGMzMyAqIG1hdHJpeFs4XTtcXG5cXG4gICBnbF9GcmFnQ29sb3IuYSA9IGMyMi5hO1xcbn1cXG5cIixvPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG8obyxpLG4pe2UuY2FsbCh0aGlzLHQsciksdGhpcy5tYXRyaXg9byx0aGlzLndpZHRoPWksdGhpcy5oZWlnaHQ9bn1lJiYoby5fX3Byb3RvX189ZSksKG8ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1vO3ZhciBpPXttYXRyaXg6e2NvbmZpZ3VyYWJsZTohMH0sd2lkdGg6e2NvbmZpZ3VyYWJsZTohMH0saGVpZ2h0Ontjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5tYXRyaXguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMubWF0cml4fSxpLm1hdHJpeC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5tYXRyaXg9bmV3IEZsb2F0MzJBcnJheShlKX0saS53aWR0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gMS90aGlzLnVuaWZvcm1zLnRleGVsU2l6ZVswXX0saS53aWR0aC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy50ZXhlbFNpemVbMF09MS9lfSxpLmhlaWdodC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gMS90aGlzLnVuaWZvcm1zLnRleGVsU2l6ZVsxXX0saS5oZWlnaHQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudGV4ZWxTaXplWzFdPTEvZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoby5wcm90b3R5cGUsaSksb30oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Db252b2x1dGlvbkZpbHRlcj1vLGUuQ29udm9sdXRpb25GaWx0ZXI9byxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWNvbnZvbHV0aW9uLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItY3Jvc3MtaGF0Y2ggLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWNyb3NzLWhhdGNoIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG8sbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihvLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG8pe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGZsb2F0IGx1bSA9IGxlbmd0aCh0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQueHkpLnJnYik7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMS4wLCAxLjAsIDEuMCwgMS4wKTtcXG5cXG4gICAgaWYgKGx1bSA8IDEuMDApXFxuICAgIHtcXG4gICAgICAgIGlmIChtb2QoZ2xfRnJhZ0Nvb3JkLnggKyBnbF9GcmFnQ29vcmQueSwgMTAuMCkgPT0gMC4wKVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBpZiAobHVtIDwgMC43NSlcXG4gICAge1xcbiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCAtIGdsX0ZyYWdDb29yZC55LCAxMC4wKSA9PSAwLjApXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAxLjApO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIGlmIChsdW0gPCAwLjUwKVxcbiAgICB7XFxuICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54ICsgZ2xfRnJhZ0Nvb3JkLnkgLSA1LjAsIDEwLjApID09IDAuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgaWYgKGx1bSA8IDAuMylcXG4gICAge1xcbiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCAtIGdsX0ZyYWdDb29yZC55IC0gNS4wLCAxMC4wKSA9PSAwLjApXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAxLjApO1xcbiAgICAgICAgfVxcbiAgICB9XFxufVxcblwiLGU9ZnVuY3Rpb24obyl7ZnVuY3Rpb24gZSgpe28uY2FsbCh0aGlzLG4scil9cmV0dXJuIG8mJihlLl9fcHJvdG9fXz1vKSxlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG8mJm8ucHJvdG90eXBlKSxlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1lLGV9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQ3Jvc3NIYXRjaEZpbHRlcj1lLG8uQ3Jvc3NIYXRjaEZpbHRlcj1lLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItY3Jvc3MtaGF0Y2guanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1kb3QgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWRvdCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP24oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG4pOm4oZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIGZsb2F0IGFuZ2xlO1xcbnVuaWZvcm0gZmxvYXQgc2NhbGU7XFxuXFxuZmxvYXQgcGF0dGVybigpXFxue1xcbiAgIGZsb2F0IHMgPSBzaW4oYW5nbGUpLCBjID0gY29zKGFuZ2xlKTtcXG4gICB2ZWMyIHRleCA9IHZUZXh0dXJlQ29vcmQgKiBmaWx0ZXJBcmVhLnh5O1xcbiAgIHZlYzIgcG9pbnQgPSB2ZWMyKFxcbiAgICAgICBjICogdGV4LnggLSBzICogdGV4LnksXFxuICAgICAgIHMgKiB0ZXgueCArIGMgKiB0ZXgueVxcbiAgICkgKiBzY2FsZTtcXG4gICByZXR1cm4gKHNpbihwb2ludC54KSAqIHNpbihwb2ludC55KSkgKiA0LjA7XFxufVxcblxcbnZvaWQgbWFpbigpXFxue1xcbiAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgIGZsb2F0IGF2ZXJhZ2UgPSAoY29sb3IuciArIGNvbG9yLmcgKyBjb2xvci5iKSAvIDMuMDtcXG4gICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZlYzMoYXZlcmFnZSAqIDEwLjAgLSA1LjAgKyBwYXR0ZXJuKCkpLCBjb2xvci5hKTtcXG59XFxuXCIsbz1mdW5jdGlvbihlKXtmdW5jdGlvbiBvKG8scil7dm9pZCAwPT09byYmKG89MSksdm9pZCAwPT09ciYmKHI9NSksZS5jYWxsKHRoaXMsbix0KSx0aGlzLnNjYWxlPW8sdGhpcy5hbmdsZT1yfWUmJihvLl9fcHJvdG9fXz1lKSwoby5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW87dmFyIHI9e3NjYWxlOntjb25maWd1cmFibGU6ITB9LGFuZ2xlOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5zY2FsZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY2FsZX0sci5zY2FsZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zY2FsZT1lfSxyLmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmFuZ2xlfSxyLmFuZ2xlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmFuZ2xlPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG8ucHJvdG90eXBlLHIpLG99KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuRG90RmlsdGVyPW8sZS5Eb3RGaWx0ZXI9byxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWRvdC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1kcm9wLXNoYWRvdyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUodC5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgZT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBhbHBoYTtcXG51bmlmb3JtIHZlYzMgY29sb3I7XFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIC8vIFVuLXByZW11bHRpcGx5IGFscGhhIGJlZm9yZSBhcHBseWluZyB0aGUgY29sb3JcXG4gICAgaWYgKHNhbXBsZS5hID4gMC4wKSB7XFxuICAgICAgICBzYW1wbGUucmdiIC89IHNhbXBsZS5hO1xcbiAgICB9XFxuXFxuICAgIC8vIFByZW11bHRpcGx5IGFscGhhIGFnYWluXFxuICAgIHNhbXBsZS5yZ2IgPSBjb2xvci5yZ2IgKiBzYW1wbGUuYTtcXG5cXG4gICAgLy8gYWxwaGEgdXNlciBhbHBoYVxcbiAgICBzYW1wbGUgKj0gYWxwaGE7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHNhbXBsZTtcXG59XCIsaT1mdW5jdGlvbih0KXtmdW5jdGlvbiBpKGksbixvLGEsbCl7dm9pZCAwPT09aSYmKGk9NDUpLHZvaWQgMD09PW4mJihuPTUpLHZvaWQgMD09PW8mJihvPTIpLHZvaWQgMD09PWEmJihhPTApLHZvaWQgMD09PWwmJihsPS41KSx0LmNhbGwodGhpcyksdGhpcy50aW50RmlsdGVyPW5ldyBQSVhJLkZpbHRlcihlLHIpLHRoaXMuYmx1ckZpbHRlcj1uZXcgUElYSS5maWx0ZXJzLkJsdXJGaWx0ZXIsdGhpcy5ibHVyRmlsdGVyLmJsdXI9byx0aGlzLnRhcmdldFRyYW5zZm9ybT1uZXcgUElYSS5NYXRyaXgsdGhpcy5yb3RhdGlvbj1pLHRoaXMucGFkZGluZz1uLHRoaXMuZGlzdGFuY2U9bix0aGlzLmFscGhhPWwsdGhpcy5jb2xvcj1hfXQmJihpLl9fcHJvdG9fXz10KSwoaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWk7dmFyIG49e2Rpc3RhbmNlOntjb25maWd1cmFibGU6ITB9LHJvdGF0aW9uOntjb25maWd1cmFibGU6ITB9LGJsdXI6e2NvbmZpZ3VyYWJsZTohMH0sYWxwaGE6e2NvbmZpZ3VyYWJsZTohMH0sY29sb3I6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbih0LGUscixpKXt2YXIgbj10LmdldFJlbmRlclRhcmdldCgpO24udHJhbnNmb3JtPXRoaXMudGFyZ2V0VHJhbnNmb3JtLHRoaXMudGludEZpbHRlci5hcHBseSh0LGUsbiwhMCksdGhpcy5ibHVyRmlsdGVyLmFwcGx5KHQsbixyKSx0LmFwcGx5RmlsdGVyKHRoaXMsZSxyLGkpLG4udHJhbnNmb3JtPW51bGwsdC5yZXR1cm5SZW5kZXJUYXJnZXQobil9LGkucHJvdG90eXBlLl91cGRhdGVQYWRkaW5nPWZ1bmN0aW9uKCl7dGhpcy5wYWRkaW5nPXRoaXMuZGlzdGFuY2UrMip0aGlzLmJsdXJ9LGkucHJvdG90eXBlLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm09ZnVuY3Rpb24oKXt0aGlzLnRhcmdldFRyYW5zZm9ybS50eD10aGlzLmRpc3RhbmNlKk1hdGguY29zKHRoaXMuYW5nbGUpLHRoaXMudGFyZ2V0VHJhbnNmb3JtLnR5PXRoaXMuZGlzdGFuY2UqTWF0aC5zaW4odGhpcy5hbmdsZSl9LG4uZGlzdGFuY2UuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Rpc3RhbmNlfSxuLmRpc3RhbmNlLnNldD1mdW5jdGlvbih0KXt0aGlzLl9kaXN0YW5jZT10LHRoaXMuX3VwZGF0ZVBhZGRpbmcoKSx0aGlzLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm0oKX0sbi5yb3RhdGlvbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hbmdsZS9QSVhJLkRFR19UT19SQUR9LG4ucm90YXRpb24uc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYW5nbGU9dCpQSVhJLkRFR19UT19SQUQsdGhpcy5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtKCl9LG4uYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyRmlsdGVyLmJsdXJ9LG4uYmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5ibHVyRmlsdGVyLmJsdXI9dCx0aGlzLl91cGRhdGVQYWRkaW5nKCl9LG4uYWxwaGEuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5hbHBoYX0sbi5hbHBoYS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhPXR9LG4uY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIFBJWEkudXRpbHMucmdiMmhleCh0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuY29sb3IpfSxuLmNvbG9yLnNldD1mdW5jdGlvbih0KXtQSVhJLnV0aWxzLmhleDJyZ2IodCx0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuY29sb3IpfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhpLnByb3RvdHlwZSxuKSxpfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkRyb3BTaGFkb3dGaWx0ZXI9aSx0LkRyb3BTaGFkb3dGaWx0ZXI9aSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWRyb3Atc2hhZG93LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItZW1ib3NzIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1lbWJvc3MgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgc3RyZW5ndGg7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxuXFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcblxcdHZlYzIgb25lUGl4ZWwgPSB2ZWMyKDEuMCAvIGZpbHRlckFyZWEpO1xcblxcblxcdHZlYzQgY29sb3I7XFxuXFxuXFx0Y29sb3IucmdiID0gdmVjMygwLjUpO1xcblxcblxcdGNvbG9yIC09IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCAtIG9uZVBpeGVsKSAqIHN0cmVuZ3RoO1xcblxcdGNvbG9yICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIG9uZVBpeGVsKSAqIHN0cmVuZ3RoO1xcblxcblxcdGNvbG9yLnJnYiA9IHZlYzMoKGNvbG9yLnIgKyBjb2xvci5nICsgY29sb3IuYikgLyAzLjApO1xcblxcblxcdGZsb2F0IGFscGhhID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKS5hO1xcblxcblxcdGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IucmdiICogYWxwaGEsIGFscGhhKTtcXG59XFxuXCIsbz1mdW5jdGlvbihlKXtmdW5jdGlvbiBvKG8pe3ZvaWQgMD09PW8mJihvPTUpLGUuY2FsbCh0aGlzLHQsciksdGhpcy5zdHJlbmd0aD1vfWUmJihvLl9fcHJvdG9fXz1lKSwoby5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW87dmFyIG49e3N0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5zdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zdHJlbmd0aH0sbi5zdHJlbmd0aC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zdHJlbmd0aD1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvLnByb3RvdHlwZSxuKSxvfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkVtYm9zc0ZpbHRlcj1vLGUuRW1ib3NzRmlsdGVyPW8sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1lbWJvc3MuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1nbG93IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1nbG93IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG8sbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihvLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG8pe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gZmxvYXQgZGlzdGFuY2U7XFxudW5pZm9ybSBmbG9hdCBvdXRlclN0cmVuZ3RoO1xcbnVuaWZvcm0gZmxvYXQgaW5uZXJTdHJlbmd0aDtcXG51bmlmb3JtIHZlYzQgZ2xvd0NvbG9yO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJDbGFtcDtcXG52ZWMyIHB4ID0gdmVjMigxLjAgLyBmaWx0ZXJBcmVhLngsIDEuMCAvIGZpbHRlckFyZWEueSk7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0O1xcbiAgICB2ZWM0IG93bkNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjNCBjdXJDb2xvcjtcXG4gICAgZmxvYXQgdG90YWxBbHBoYSA9IDAuMDtcXG4gICAgZmxvYXQgbWF4VG90YWxBbHBoYSA9IDAuMDtcXG4gICAgZmxvYXQgY29zQW5nbGU7XFxuICAgIGZsb2F0IHNpbkFuZ2xlO1xcbiAgICB2ZWMyIGRpc3BsYWNlZDtcXG4gICAgZm9yIChmbG9hdCBhbmdsZSA9IDAuMDsgYW5nbGUgPD0gUEkgKiAyLjA7IGFuZ2xlICs9ICVRVUFMSVRZX0RJU1QlKSB7XFxuICAgICAgIGNvc0FuZ2xlID0gY29zKGFuZ2xlKTtcXG4gICAgICAgc2luQW5nbGUgPSBzaW4oYW5nbGUpO1xcbiAgICAgICBmb3IgKGZsb2F0IGN1ckRpc3RhbmNlID0gMS4wOyBjdXJEaXN0YW5jZSA8PSAlRElTVCU7IGN1ckRpc3RhbmNlKyspIHtcXG4gICAgICAgICAgIGRpc3BsYWNlZC54ID0gdlRleHR1cmVDb29yZC54ICsgY29zQW5nbGUgKiBjdXJEaXN0YW5jZSAqIHB4Lng7XFxuICAgICAgICAgICBkaXNwbGFjZWQueSA9IHZUZXh0dXJlQ29vcmQueSArIHNpbkFuZ2xlICogY3VyRGlzdGFuY2UgKiBweC55O1xcbiAgICAgICAgICAgY3VyQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wKGRpc3BsYWNlZCwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KSk7XFxuICAgICAgICAgICB0b3RhbEFscGhhICs9IChkaXN0YW5jZSAtIGN1ckRpc3RhbmNlKSAqIGN1ckNvbG9yLmE7XFxuICAgICAgICAgICBtYXhUb3RhbEFscGhhICs9IChkaXN0YW5jZSAtIGN1ckRpc3RhbmNlKTtcXG4gICAgICAgfVxcbiAgICB9XFxuICAgIG1heFRvdGFsQWxwaGEgPSBtYXgobWF4VG90YWxBbHBoYSwgMC4wMDAxKTtcXG5cXG4gICAgb3duQ29sb3IuYSA9IG1heChvd25Db2xvci5hLCAwLjAwMDEpO1xcbiAgICBvd25Db2xvci5yZ2IgPSBvd25Db2xvci5yZ2IgLyBvd25Db2xvci5hO1xcbiAgICBmbG9hdCBvdXRlckdsb3dBbHBoYSA9ICh0b3RhbEFscGhhIC8gbWF4VG90YWxBbHBoYSkgICogb3V0ZXJTdHJlbmd0aCAqICgxLiAtIG93bkNvbG9yLmEpO1xcbiAgICBmbG9hdCBpbm5lckdsb3dBbHBoYSA9ICgobWF4VG90YWxBbHBoYSAtIHRvdGFsQWxwaGEpIC8gbWF4VG90YWxBbHBoYSkgKiBpbm5lclN0cmVuZ3RoICogb3duQ29sb3IuYTtcXG4gICAgZmxvYXQgcmVzdWx0QWxwaGEgPSAob3duQ29sb3IuYSArIG91dGVyR2xvd0FscGhhKTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChtaXgobWl4KG93bkNvbG9yLnJnYiwgZ2xvd0NvbG9yLnJnYiwgaW5uZXJHbG93QWxwaGEgLyBvd25Db2xvci5hKSwgZ2xvd0NvbG9yLnJnYiwgb3V0ZXJHbG93QWxwaGEgLyByZXN1bHRBbHBoYSkgKiByZXN1bHRBbHBoYSwgcmVzdWx0QWxwaGEpO1xcbn1cXG5cIixlPWZ1bmN0aW9uKG8pe2Z1bmN0aW9uIGUoZSxyLGksbCxhKXt2b2lkIDA9PT1lJiYoZT0xMCksdm9pZCAwPT09ciYmKHI9NCksdm9pZCAwPT09aSYmKGk9MCksdm9pZCAwPT09bCYmKGw9MTY3NzcyMTUpLHZvaWQgMD09PWEmJihhPS4xKSxvLmNhbGwodGhpcyxuLHQucmVwbGFjZSgvJVFVQUxJVFlfRElTVCUvZ2ksXCJcIisoMS9hL2UpLnRvRml4ZWQoNykpLnJlcGxhY2UoLyVESVNUJS9naSxcIlwiK2UudG9GaXhlZCg3KSkpLHRoaXMudW5pZm9ybXMuZ2xvd0NvbG9yPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDFdKSx0aGlzLmRpc3RhbmNlPWUsdGhpcy5jb2xvcj1sLHRoaXMub3V0ZXJTdHJlbmd0aD1yLHRoaXMuaW5uZXJTdHJlbmd0aD1pfW8mJihlLl9fcHJvdG9fXz1vKSwoZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShvJiZvLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWU7dmFyIHI9e2NvbG9yOntjb25maWd1cmFibGU6ITB9LGRpc3RhbmNlOntjb25maWd1cmFibGU6ITB9LG91dGVyU3RyZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH0saW5uZXJTdHJlbmd0aDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIuY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIFBJWEkudXRpbHMucmdiMmhleCh0aGlzLnVuaWZvcm1zLmdsb3dDb2xvcil9LHIuY29sb3Iuc2V0PWZ1bmN0aW9uKG8pe1BJWEkudXRpbHMuaGV4MnJnYihvLHRoaXMudW5pZm9ybXMuZ2xvd0NvbG9yKX0sci5kaXN0YW5jZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5kaXN0YW5jZX0sci5kaXN0YW5jZS5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5kaXN0YW5jZT1vfSxyLm91dGVyU3RyZW5ndGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMub3V0ZXJTdHJlbmd0aH0sci5vdXRlclN0cmVuZ3RoLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLm91dGVyU3RyZW5ndGg9b30sci5pbm5lclN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmlubmVyU3RyZW5ndGh9LHIuaW5uZXJTdHJlbmd0aC5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5pbm5lclN0cmVuZ3RoPW99LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGUucHJvdG90eXBlLHIpLGV9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuR2xvd0ZpbHRlcj1lLG8uR2xvd0ZpbHRlcj1lLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZ2xvdy5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWdvZHJheSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItZ29kcmF5IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG4sZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZShuLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG4pe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ2ZWMzIG1vZDI4OSh2ZWMzIHgpXFxue1xcbiAgICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wO1xcbn1cXG52ZWM0IG1vZDI4OSh2ZWM0IHgpXFxue1xcbiAgICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wO1xcbn1cXG52ZWM0IHBlcm11dGUodmVjNCB4KVxcbntcXG4gICAgcmV0dXJuIG1vZDI4OSgoKHggKiAzNC4wKSArIDEuMCkgKiB4KTtcXG59XFxudmVjNCB0YXlsb3JJbnZTcXJ0KHZlYzQgcilcXG57XFxuICAgIHJldHVybiAxLjc5Mjg0MjkxNDAwMTU5IC0gMC44NTM3MzQ3MjA5NTMxNCAqIHI7XFxufVxcbnZlYzMgZmFkZSh2ZWMzIHQpXFxue1xcbiAgICByZXR1cm4gdCAqIHQgKiB0ICogKHQgKiAodCAqIDYuMCAtIDE1LjApICsgMTAuMCk7XFxufVxcbi8vIENsYXNzaWMgUGVybGluIG5vaXNlLCBwZXJpb2RpYyB2YXJpYW50XFxuZmxvYXQgcG5vaXNlKHZlYzMgUCwgdmVjMyByZXApXFxue1xcbiAgICB2ZWMzIFBpMCA9IG1vZChmbG9vcihQKSwgcmVwKTsgLy8gSW50ZWdlciBwYXJ0LCBtb2R1bG8gcGVyaW9kXFxuICAgIHZlYzMgUGkxID0gbW9kKFBpMCArIHZlYzMoMS4wKSwgcmVwKTsgLy8gSW50ZWdlciBwYXJ0ICsgMSwgbW9kIHBlcmlvZFxcbiAgICBQaTAgPSBtb2QyODkoUGkwKTtcXG4gICAgUGkxID0gbW9kMjg5KFBpMSk7XFxuICAgIHZlYzMgUGYwID0gZnJhY3QoUCk7IC8vIEZyYWN0aW9uYWwgcGFydCBmb3IgaW50ZXJwb2xhdGlvblxcbiAgICB2ZWMzIFBmMSA9IFBmMCAtIHZlYzMoMS4wKTsgLy8gRnJhY3Rpb25hbCBwYXJ0IC0gMS4wXFxuICAgIHZlYzQgaXggPSB2ZWM0KFBpMC54LCBQaTEueCwgUGkwLngsIFBpMS54KTtcXG4gICAgdmVjNCBpeSA9IHZlYzQoUGkwLnl5LCBQaTEueXkpO1xcbiAgICB2ZWM0IGl6MCA9IFBpMC56enp6O1xcbiAgICB2ZWM0IGl6MSA9IFBpMS56enp6O1xcbiAgICB2ZWM0IGl4eSA9IHBlcm11dGUocGVybXV0ZShpeCkgKyBpeSk7XFxuICAgIHZlYzQgaXh5MCA9IHBlcm11dGUoaXh5ICsgaXowKTtcXG4gICAgdmVjNCBpeHkxID0gcGVybXV0ZShpeHkgKyBpejEpO1xcbiAgICB2ZWM0IGd4MCA9IGl4eTAgKiAoMS4wIC8gNy4wKTtcXG4gICAgdmVjNCBneTAgPSBmcmFjdChmbG9vcihneDApICogKDEuMCAvIDcuMCkpIC0gMC41O1xcbiAgICBneDAgPSBmcmFjdChneDApO1xcbiAgICB2ZWM0IGd6MCA9IHZlYzQoMC41KSAtIGFicyhneDApIC0gYWJzKGd5MCk7XFxuICAgIHZlYzQgc3owID0gc3RlcChnejAsIHZlYzQoMC4wKSk7XFxuICAgIGd4MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd4MCkgLSAwLjUpO1xcbiAgICBneTAgLT0gc3owICogKHN0ZXAoMC4wLCBneTApIC0gMC41KTtcXG4gICAgdmVjNCBneDEgPSBpeHkxICogKDEuMCAvIDcuMCk7XFxuICAgIHZlYzQgZ3kxID0gZnJhY3QoZmxvb3IoZ3gxKSAqICgxLjAgLyA3LjApKSAtIDAuNTtcXG4gICAgZ3gxID0gZnJhY3QoZ3gxKTtcXG4gICAgdmVjNCBnejEgPSB2ZWM0KDAuNSkgLSBhYnMoZ3gxKSAtIGFicyhneTEpO1xcbiAgICB2ZWM0IHN6MSA9IHN0ZXAoZ3oxLCB2ZWM0KDAuMCkpO1xcbiAgICBneDEgLT0gc3oxICogKHN0ZXAoMC4wLCBneDEpIC0gMC41KTtcXG4gICAgZ3kxIC09IHN6MSAqIChzdGVwKDAuMCwgZ3kxKSAtIDAuNSk7XFxuICAgIHZlYzMgZzAwMCA9IHZlYzMoZ3gwLngsIGd5MC54LCBnejAueCk7XFxuICAgIHZlYzMgZzEwMCA9IHZlYzMoZ3gwLnksIGd5MC55LCBnejAueSk7XFxuICAgIHZlYzMgZzAxMCA9IHZlYzMoZ3gwLnosIGd5MC56LCBnejAueik7XFxuICAgIHZlYzMgZzExMCA9IHZlYzMoZ3gwLncsIGd5MC53LCBnejAudyk7XFxuICAgIHZlYzMgZzAwMSA9IHZlYzMoZ3gxLngsIGd5MS54LCBnejEueCk7XFxuICAgIHZlYzMgZzEwMSA9IHZlYzMoZ3gxLnksIGd5MS55LCBnejEueSk7XFxuICAgIHZlYzMgZzAxMSA9IHZlYzMoZ3gxLnosIGd5MS56LCBnejEueik7XFxuICAgIHZlYzMgZzExMSA9IHZlYzMoZ3gxLncsIGd5MS53LCBnejEudyk7XFxuICAgIHZlYzQgbm9ybTAgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDAsIGcwMDApLCBkb3QoZzAxMCwgZzAxMCksIGRvdChnMTAwLCBnMTAwKSwgZG90KGcxMTAsIGcxMTApKSk7XFxuICAgIGcwMDAgKj0gbm9ybTAueDtcXG4gICAgZzAxMCAqPSBub3JtMC55O1xcbiAgICBnMTAwICo9IG5vcm0wLno7XFxuICAgIGcxMTAgKj0gbm9ybTAudztcXG4gICAgdmVjNCBub3JtMSA9IHRheWxvckludlNxcnQodmVjNChkb3QoZzAwMSwgZzAwMSksIGRvdChnMDExLCBnMDExKSwgZG90KGcxMDEsIGcxMDEpLCBkb3QoZzExMSwgZzExMSkpKTtcXG4gICAgZzAwMSAqPSBub3JtMS54O1xcbiAgICBnMDExICo9IG5vcm0xLnk7XFxuICAgIGcxMDEgKj0gbm9ybTEuejtcXG4gICAgZzExMSAqPSBub3JtMS53O1xcbiAgICBmbG9hdCBuMDAwID0gZG90KGcwMDAsIFBmMCk7XFxuICAgIGZsb2F0IG4xMDAgPSBkb3QoZzEwMCwgdmVjMyhQZjEueCwgUGYwLnl6KSk7XFxuICAgIGZsb2F0IG4wMTAgPSBkb3QoZzAxMCwgdmVjMyhQZjAueCwgUGYxLnksIFBmMC56KSk7XFxuICAgIGZsb2F0IG4xMTAgPSBkb3QoZzExMCwgdmVjMyhQZjEueHksIFBmMC56KSk7XFxuICAgIGZsb2F0IG4wMDEgPSBkb3QoZzAwMSwgdmVjMyhQZjAueHksIFBmMS56KSk7XFxuICAgIGZsb2F0IG4xMDEgPSBkb3QoZzEwMSwgdmVjMyhQZjEueCwgUGYwLnksIFBmMS56KSk7XFxuICAgIGZsb2F0IG4wMTEgPSBkb3QoZzAxMSwgdmVjMyhQZjAueCwgUGYxLnl6KSk7XFxuICAgIGZsb2F0IG4xMTEgPSBkb3QoZzExMSwgUGYxKTtcXG4gICAgdmVjMyBmYWRlX3h5eiA9IGZhZGUoUGYwKTtcXG4gICAgdmVjNCBuX3ogPSBtaXgodmVjNChuMDAwLCBuMTAwLCBuMDEwLCBuMTEwKSwgdmVjNChuMDAxLCBuMTAxLCBuMDExLCBuMTExKSwgZmFkZV94eXoueik7XFxuICAgIHZlYzIgbl95eiA9IG1peChuX3oueHksIG5fei56dywgZmFkZV94eXoueSk7XFxuICAgIGZsb2F0IG5feHl6ID0gbWl4KG5feXoueCwgbl95ei55LCBmYWRlX3h5ei54KTtcXG4gICAgcmV0dXJuIDIuMiAqIG5feHl6O1xcbn1cXG5mbG9hdCB0dXJiKHZlYzMgUCwgdmVjMyByZXAsIGZsb2F0IGxhY3VuYXJpdHksIGZsb2F0IGdhaW4pXFxue1xcbiAgICBmbG9hdCBzdW0gPSAwLjA7XFxuICAgIGZsb2F0IHNjID0gMS4wO1xcbiAgICBmbG9hdCB0b3RhbGdhaW4gPSAxLjA7XFxuICAgIGZvciAoZmxvYXQgaSA9IDAuMDsgaSA8IDYuMDsgaSsrKVxcbiAgICB7XFxuICAgICAgICBzdW0gKz0gdG90YWxnYWluICogcG5vaXNlKFAgKiBzYywgcmVwKTtcXG4gICAgICAgIHNjICo9IGxhY3VuYXJpdHk7XFxuICAgICAgICB0b3RhbGdhaW4gKj0gZ2FpbjtcXG4gICAgfVxcbiAgICByZXR1cm4gYWJzKHN1bSk7XFxufVxcblwiLGk9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzIgZGltZW5zaW9ucztcXG5cXG51bmlmb3JtIHZlYzIgYW5nbGVEaXI7XFxudW5pZm9ybSBmbG9hdCBnYWluO1xcbnVuaWZvcm0gZmxvYXQgbGFjdW5hcml0eTtcXG51bmlmb3JtIGZsb2F0IHRpbWU7XFxuXFxuJHtwZXJsaW59XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjMiBjb29yZCA9IHZUZXh0dXJlQ29vcmQgKiBmaWx0ZXJBcmVhLnh5IC8gZGltZW5zaW9ucy54eTtcXG5cXG4gICAgZmxvYXQgeHggPSBhbmdsZURpci54O1xcbiAgICBmbG9hdCB5eSA9IGFuZ2xlRGlyLnk7XFxuXFxuICAgIGZsb2F0IGQgPSAoeHggKiBjb29yZC54KSArICh5eSAqIGNvb3JkLnkpO1xcbiAgICB2ZWMzIGRpciA9IHZlYzMoZCwgZCwgMC4wKTtcXG5cXG4gICAgZmxvYXQgbm9pc2UgPSB0dXJiKGRpciArIHZlYzModGltZSwgMC4wLCA2Mi4xICsgdGltZSkgKiAwLjA1LCB2ZWMzKDQ4MC4wLCAzMjAuMCwgNDgwLjApLCBsYWN1bmFyaXR5LCBnYWluKTtcXG4gICAgbm9pc2UgPSBtaXgobm9pc2UsIDAuMCwgMC4zKTtcXG4gICAgLy9mYWRlIHZlcnRpY2FsbHkuXFxuICAgIHZlYzQgbWlzdCA9IHZlYzQobm9pc2UsIG5vaXNlLCBub2lzZSwgMS4wKSAqICgxLjAgLSBjb29yZC55KTtcXG4gICAgbWlzdC5hID0gMS4wO1xcbiAgICBnbF9GcmFnQ29sb3IgKz0gbWlzdDtcXG59XFxuXCIsbz1mdW5jdGlvbihuKXtmdW5jdGlvbiBvKG8scixhLGMpe3ZvaWQgMD09PW8mJihvPTMwKSx2b2lkIDA9PT1yJiYocj0uNSksdm9pZCAwPT09YSYmKGE9Mi41KSx2b2lkIDA9PT1jJiYoYz0wKSxuLmNhbGwodGhpcyxlLGkucmVwbGFjZShcIiR7cGVybGlufVwiLHQpKSx0aGlzLmFuZ2xlPW8sdGhpcy5nYWluPXIsdGhpcy5sYWN1bmFyaXR5PWEsdGhpcy50aW1lPWN9biYmKG8uX19wcm90b19fPW4pLChvLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG4mJm4ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bzt2YXIgcj17YW5nbGU6e2NvbmZpZ3VyYWJsZTohMH0sZ2Fpbjp7Y29uZmlndXJhYmxlOiEwfSxsYWN1bmFyaXR5Ontjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gby5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24obixlLHQsaSl7dmFyIG89ZS5zb3VyY2VGcmFtZS53aWR0aCxyPWUuc291cmNlRnJhbWUuaGVpZ2h0O3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT1vLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT1yLHRoaXMudW5pZm9ybXMudGltZT10aGlzLnRpbWUsdGhpcy51bmlmb3Jtcy5hbmdsZURpclsxXT10aGlzLl9hbmdsZVNpbipyL28sbi5hcHBseUZpbHRlcih0aGlzLGUsdCxpKX0sci5hbmdsZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYW5nbGV9LHIuYW5nbGUuc2V0PWZ1bmN0aW9uKG4pe3ZhciBlPW4qUElYSS5ERUdfVE9fUkFEO3RoaXMuX2FuZ2xlQ29zPU1hdGguY29zKGUpLHRoaXMuX2FuZ2xlU2luPU1hdGguc2luKGUpLHRoaXMudW5pZm9ybXMuYW5nbGVEaXJbMF09dGhpcy5fYW5nbGVDb3MsdGhpcy5fYW5nbGU9bn0sci5nYWluLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmdhaW59LHIuZ2Fpbi5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5nYWluPW59LHIubGFjdW5hcml0eS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5sYWN1bmFyaXR5fSxyLmxhY3VuYXJpdHkuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMubGFjdW5hcml0eT1ufSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvLnByb3RvdHlwZSxyKSxvfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkdvZHJheUZpbHRlcj1vLG4uR29kcmF5RmlsdGVyPW8sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1nb2RyYXkuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1tb3Rpb24tYmx1ciAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItbW90aW9uLWJsdXIgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsaT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnVuaWZvcm0gdmVjMiB1VmVsb2NpdHk7XFxudW5pZm9ybSBpbnQgdUtlcm5lbFNpemU7XFxudW5pZm9ybSBmbG9hdCB1T2Zmc2V0O1xcblxcbmNvbnN0IGludCBNQVhfS0VSTkVMX1NJWkUgPSAyMDQ4O1xcbmNvbnN0IGludCBJVEVSQVRJT04gPSBNQVhfS0VSTkVMX1NJWkUgLSAxO1xcblxcbnZlYzIgdmVsb2NpdHkgPSB1VmVsb2NpdHkgLyBmaWx0ZXJBcmVhLnh5O1xcblxcbi8vIGZsb2F0IGtlcm5lbFNpemUgPSBtaW4oZmxvYXQodUtlcm5lbFNpemUpLCBmbG9hdChNQVhfS0VSTkVMU0laRSkpO1xcblxcbi8vIEluIHJlYWwgdXNlLWNhc2UgLCB1S2VybmVsU2l6ZSA8IE1BWF9LRVJORUxTSVpFIGFsbW9zdCBhbHdheXMuXFxuLy8gU28gdXNlIHVLZXJuZWxTaXplIGRpcmVjdGx5LlxcbmZsb2F0IGtlcm5lbFNpemUgPSBmbG9hdCh1S2VybmVsU2l6ZSk7XFxuZmxvYXQgayA9IGtlcm5lbFNpemUgLSAxLjA7XFxuZmxvYXQgb2Zmc2V0ID0gLXVPZmZzZXQgLyBsZW5ndGgodVZlbG9jaXR5KSAtIDAuNTtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIGlmICh1S2VybmVsU2l6ZSA9PSAwKVxcbiAgICB7XFxuICAgICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgZm9yKGludCBpID0gMDsgaSA8IElURVJBVElPTjsgaSsrKSB7XFxuICAgICAgICBpZiAoaSA9PSBpbnQoaykpIHtcXG4gICAgICAgICAgICBicmVhaztcXG4gICAgICAgIH1cXG4gICAgICAgIHZlYzIgYmlhcyA9IHZlbG9jaXR5ICogKGZsb2F0KGkpIC8gayArIG9mZnNldCk7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgYmlhcyk7XFxuICAgIH1cXG4gICAgZ2xfRnJhZ0NvbG9yIC89IGtlcm5lbFNpemU7XFxufVxcblwiLG49ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuLG8scil7dm9pZCAwPT09biYmKG49WzAsMF0pLHZvaWQgMD09PW8mJihvPTUpLHZvaWQgMD09PXImJihyPTApLGUuY2FsbCh0aGlzLHQsaSksdGhpcy5fdmVsb2NpdHk9bmV3IFBJWEkuUG9pbnQoMCwwKSx0aGlzLnZlbG9jaXR5PW4sdGhpcy5rZXJuZWxTaXplPW8sdGhpcy5vZmZzZXQ9cn1lJiYobi5fX3Byb3RvX189ZSksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciBvPXt2ZWxvY2l0eTp7Y29uZmlndXJhYmxlOiEwfSxvZmZzZXQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsaSxuKXt2YXIgbz10aGlzLnZlbG9jaXR5LHI9by54LGw9by55O3RoaXMudW5pZm9ybXMudUtlcm5lbFNpemU9MCE9PXJ8fDAhPT1sP3RoaXMua2VybmVsU2l6ZTowLGUuYXBwbHlGaWx0ZXIodGhpcyx0LGksbil9LG8udmVsb2NpdHkuc2V0PWZ1bmN0aW9uKGUpe0FycmF5LmlzQXJyYXkoZSk/KHRoaXMuX3ZlbG9jaXR5Lng9ZVswXSx0aGlzLl92ZWxvY2l0eS55PWVbMV0pOmUgaW5zdGFuY2VvZiBQSVhJLlBvaW50JiYodGhpcy5fdmVsb2NpdHkueD1lLngsdGhpcy5fdmVsb2NpdHkueT1lLnkpLHRoaXMudW5pZm9ybXMudVZlbG9jaXR5WzBdPXRoaXMuX3ZlbG9jaXR5LngsdGhpcy51bmlmb3Jtcy51VmVsb2NpdHlbMV09dGhpcy5fdmVsb2NpdHkueX0sby52ZWxvY2l0eS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdmVsb2NpdHl9LG8ub2Zmc2V0LnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnVPZmZzZXQ9ZX0sby5vZmZzZXQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudU9mZnNldH0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsbyksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Nb3Rpb25CbHVyRmlsdGVyPW4sZS5Nb3Rpb25CbHVyRmlsdGVyPW4sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1tb3Rpb24tYmx1ci5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obyxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKG8uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gZmxvYXQgZXBzaWxvbjtcXG5cXG5jb25zdCBpbnQgTUFYX0NPTE9SUyA9ICVtYXhDb2xvcnMlO1xcblxcbnVuaWZvcm0gdmVjMyBvcmlnaW5hbENvbG9yc1tNQVhfQ09MT1JTXTtcXG51bmlmb3JtIHZlYzMgdGFyZ2V0Q29sb3JzW01BWF9DT0xPUlNdO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgZmxvYXQgYWxwaGEgPSBnbF9GcmFnQ29sb3IuYTtcXG4gICAgaWYgKGFscGhhIDwgMC4wMDAxKVxcbiAgICB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuXFxuICAgIHZlYzMgY29sb3IgPSBnbF9GcmFnQ29sb3IucmdiIC8gYWxwaGE7XFxuXFxuICAgIGZvcihpbnQgaSA9IDA7IGkgPCBNQVhfQ09MT1JTOyBpKyspXFxuICAgIHtcXG4gICAgICB2ZWMzIG9yaWdDb2xvciA9IG9yaWdpbmFsQ29sb3JzW2ldO1xcbiAgICAgIGlmIChvcmlnQ29sb3IuciA8IDAuMClcXG4gICAgICB7XFxuICAgICAgICBicmVhaztcXG4gICAgICB9XFxuICAgICAgdmVjMyBjb2xvckRpZmYgPSBvcmlnQ29sb3IgLSBjb2xvcjtcXG4gICAgICBpZiAobGVuZ3RoKGNvbG9yRGlmZikgPCBlcHNpbG9uKVxcbiAgICAgIHtcXG4gICAgICAgIHZlYzMgdGFyZ2V0Q29sb3IgPSB0YXJnZXRDb2xvcnNbaV07XFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCh0YXJnZXRDb2xvciArIGNvbG9yRGlmZikgKiBhbHBoYSwgYWxwaGEpO1xcbiAgICAgICAgcmV0dXJuO1xcbiAgICAgIH1cXG4gICAgfVxcbn1cXG5cIixuPWZ1bmN0aW9uKG8pe2Z1bmN0aW9uIG4obix0LGkpe3ZvaWQgMD09PXQmJih0PS4wNSksdm9pZCAwPT09aSYmKGk9bnVsbCksaT1pfHxuLmxlbmd0aCxvLmNhbGwodGhpcyxlLHIucmVwbGFjZSgvJW1heENvbG9ycyUvZyxpKSksdGhpcy5lcHNpbG9uPXQsdGhpcy5fbWF4Q29sb3JzPWksdGhpcy5fcmVwbGFjZW1lbnRzPW51bGwsdGhpcy51bmlmb3Jtcy5vcmlnaW5hbENvbG9ycz1uZXcgRmxvYXQzMkFycmF5KDMqaSksdGhpcy51bmlmb3Jtcy50YXJnZXRDb2xvcnM9bmV3IEZsb2F0MzJBcnJheSgzKmkpLHRoaXMucmVwbGFjZW1lbnRzPW59byYmKG4uX19wcm90b19fPW8pLChuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG8mJm8ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bjt2YXIgdD17cmVwbGFjZW1lbnRzOntjb25maWd1cmFibGU6ITB9LG1heENvbG9yczp7Y29uZmlndXJhYmxlOiEwfSxlcHNpbG9uOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gdC5yZXBsYWNlbWVudHMuc2V0PWZ1bmN0aW9uKG8pe3ZhciBlPXRoaXMudW5pZm9ybXMub3JpZ2luYWxDb2xvcnMscj10aGlzLnVuaWZvcm1zLnRhcmdldENvbG9ycyxuPW8ubGVuZ3RoO2lmKG4+dGhpcy5fbWF4Q29sb3JzKXRocm93XCJMZW5ndGggb2YgcmVwbGFjZW1lbnRzIChcIituK1wiKSBleGNlZWRzIHRoZSBtYXhpbXVtIGNvbG9ycyBsZW5ndGggKFwiK3RoaXMuX21heENvbG9ycytcIilcIjtlWzMqbl09LTE7Zm9yKHZhciB0PTA7dDxuO3QrKyl7dmFyIGk9b1t0XSxsPWlbMF07XCJudW1iZXJcIj09dHlwZW9mIGw/bD1QSVhJLnV0aWxzLmhleDJyZ2IobCk6aVswXT1QSVhJLnV0aWxzLnJnYjJoZXgobCksZVszKnRdPWxbMF0sZVszKnQrMV09bFsxXSxlWzMqdCsyXT1sWzJdO3ZhciBhPWlbMV07XCJudW1iZXJcIj09dHlwZW9mIGE/YT1QSVhJLnV0aWxzLmhleDJyZ2IoYSk6aVsxXT1QSVhJLnV0aWxzLnJnYjJoZXgoYSksclszKnRdPWFbMF0sclszKnQrMV09YVsxXSxyWzMqdCsyXT1hWzJdfXRoaXMuX3JlcGxhY2VtZW50cz1vfSx0LnJlcGxhY2VtZW50cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVwbGFjZW1lbnRzfSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dGhpcy5yZXBsYWNlbWVudHM9dGhpcy5fcmVwbGFjZW1lbnRzfSx0Lm1heENvbG9ycy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbWF4Q29sb3JzfSx0LmVwc2lsb24uc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMuZXBzaWxvbj1vfSx0LmVwc2lsb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZXBzaWxvbn0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsdCksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5NdWx0aUNvbG9yUmVwbGFjZUZpbHRlcj1uLG8uTXVsdGlDb2xvclJlcGxhY2VGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1vbGQtZmlsbSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItb2xkLWZpbG0gaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obix0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KG4uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsaT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjMiBkaW1lbnNpb25zO1xcblxcbnVuaWZvcm0gZmxvYXQgc2VwaWE7XFxudW5pZm9ybSBmbG9hdCBub2lzZTtcXG51bmlmb3JtIGZsb2F0IG5vaXNlU2l6ZTtcXG51bmlmb3JtIGZsb2F0IHNjcmF0Y2g7XFxudW5pZm9ybSBmbG9hdCBzY3JhdGNoRGVuc2l0eTtcXG51bmlmb3JtIGZsb2F0IHNjcmF0Y2hXaWR0aDtcXG51bmlmb3JtIGZsb2F0IHZpZ25ldHRpbmc7XFxudW5pZm9ybSBmbG9hdCB2aWduZXR0aW5nQWxwaGE7XFxudW5pZm9ybSBmbG9hdCB2aWduZXR0aW5nQmx1cjtcXG51bmlmb3JtIGZsb2F0IHNlZWQ7XFxuXFxuY29uc3QgZmxvYXQgU1FSVF8yID0gMS40MTQyMTM7XFxuY29uc3QgdmVjMyBTRVBJQV9SR0IgPSB2ZWMzKDExMi4wIC8gMjU1LjAsIDY2LjAgLyAyNTUuMCwgMjAuMCAvIDI1NS4wKTtcXG5cXG5mbG9hdCByYW5kKHZlYzIgY28pIHtcXG4gICAgcmV0dXJuIGZyYWN0KHNpbihkb3QoY28ueHksIHZlYzIoMTIuOTg5OCwgNzguMjMzKSkpICogNDM3NTguNTQ1Myk7XFxufVxcblxcbnZlYzMgT3ZlcmxheSh2ZWMzIHNyYywgdmVjMyBkc3QpXFxue1xcbiAgICAvLyBpZiAoZHN0IDw9IDAuNSkgdGhlbjogMiAqIHNyYyAqIGRzdFxcbiAgICAvLyBpZiAoZHN0ID4gMC41KSB0aGVuOiAxIC0gMiAqICgxIC0gZHN0KSAqICgxIC0gc3JjKVxcbiAgICByZXR1cm4gdmVjMygoZHN0LnggPD0gMC41KSA/ICgyLjAgKiBzcmMueCAqIGRzdC54KSA6ICgxLjAgLSAyLjAgKiAoMS4wIC0gZHN0LngpICogKDEuMCAtIHNyYy54KSksXFxuICAgICAgICAgICAgICAgIChkc3QueSA8PSAwLjUpID8gKDIuMCAqIHNyYy55ICogZHN0LnkpIDogKDEuMCAtIDIuMCAqICgxLjAgLSBkc3QueSkgKiAoMS4wIC0gc3JjLnkpKSxcXG4gICAgICAgICAgICAgICAgKGRzdC56IDw9IDAuNSkgPyAoMi4wICogc3JjLnogKiBkc3QueikgOiAoMS4wIC0gMi4wICogKDEuMCAtIGRzdC56KSAqICgxLjAgLSBzcmMueikpKTtcXG59XFxuXFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzMgY29sb3IgPSBnbF9GcmFnQ29sb3IucmdiO1xcblxcbiAgICBpZiAoc2VwaWEgPiAwLjApXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IGdyYXkgPSAoY29sb3IueCArIGNvbG9yLnkgKyBjb2xvci56KSAvIDMuMDtcXG4gICAgICAgIHZlYzMgZ3JheXNjYWxlID0gdmVjMyhncmF5KTtcXG5cXG4gICAgICAgIGNvbG9yID0gT3ZlcmxheShTRVBJQV9SR0IsIGdyYXlzY2FsZSk7XFxuXFxuICAgICAgICBjb2xvciA9IGdyYXlzY2FsZSArIHNlcGlhICogKGNvbG9yIC0gZ3JheXNjYWxlKTtcXG4gICAgfVxcblxcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHkgLyBkaW1lbnNpb25zLnh5O1xcblxcbiAgICBpZiAodmlnbmV0dGluZyA+IDAuMClcXG4gICAge1xcbiAgICAgICAgZmxvYXQgb3V0dGVyID0gU1FSVF8yIC0gdmlnbmV0dGluZyAqIFNRUlRfMjtcXG4gICAgICAgIHZlYzIgZGlyID0gdmVjMih2ZWMyKDAuNSwgMC41KSAtIGNvb3JkKTtcXG4gICAgICAgIGRpci55ICo9IGRpbWVuc2lvbnMueSAvIGRpbWVuc2lvbnMueDtcXG4gICAgICAgIGZsb2F0IGRhcmtlciA9IGNsYW1wKChvdXR0ZXIgLSBsZW5ndGgoZGlyKSAqIFNRUlRfMikgLyAoIDAuMDAwMDEgKyB2aWduZXR0aW5nQmx1ciAqIFNRUlRfMiksIDAuMCwgMS4wKTtcXG4gICAgICAgIGNvbG9yLnJnYiAqPSBkYXJrZXIgKyAoMS4wIC0gZGFya2VyKSAqICgxLjAgLSB2aWduZXR0aW5nQWxwaGEpO1xcbiAgICB9XFxuXFxuICAgIGlmIChzY3JhdGNoRGVuc2l0eSA+IHNlZWQgJiYgc2NyYXRjaCAhPSAwLjApXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IHBoYXNlID0gc2VlZCAqIDI1Ni4wO1xcbiAgICAgICAgZmxvYXQgcyA9IG1vZChmbG9vcihwaGFzZSksIDIuMCk7XFxuICAgICAgICBmbG9hdCBkaXN0ID0gMS4wIC8gc2NyYXRjaERlbnNpdHk7XFxuICAgICAgICBmbG9hdCBkID0gZGlzdGFuY2UoY29vcmQsIHZlYzIoc2VlZCAqIGRpc3QsIGFicyhzIC0gc2VlZCAqIGRpc3QpKSk7XFxuICAgICAgICBpZiAoZCA8IHNlZWQgKiAwLjYgKyAwLjQpXFxuICAgICAgICB7XFxuICAgICAgICAgICAgaGlnaHAgZmxvYXQgcGVyaW9kID0gc2NyYXRjaERlbnNpdHkgKiAxMC4wO1xcblxcbiAgICAgICAgICAgIGZsb2F0IHh4ID0gY29vcmQueCAqIHBlcmlvZCArIHBoYXNlO1xcbiAgICAgICAgICAgIGZsb2F0IGFhID0gYWJzKG1vZCh4eCwgMC41KSAqIDQuMCk7XFxuICAgICAgICAgICAgZmxvYXQgYmIgPSBtb2QoZmxvb3IoeHggLyAwLjUpLCAyLjApO1xcbiAgICAgICAgICAgIGZsb2F0IHl5ID0gKDEuMCAtIGJiKSAqIGFhICsgYmIgKiAoMi4wIC0gYWEpO1xcblxcbiAgICAgICAgICAgIGZsb2F0IGtrID0gMi4wICogcGVyaW9kO1xcbiAgICAgICAgICAgIGZsb2F0IGR3ID0gc2NyYXRjaFdpZHRoIC8gZGltZW5zaW9ucy54ICogKDAuNzUgKyBzZWVkKTtcXG4gICAgICAgICAgICBmbG9hdCBkaCA9IGR3ICoga2s7XFxuXFxuICAgICAgICAgICAgZmxvYXQgdGluZSA9ICh5eSAtICgyLjAgLSBkaCkpO1xcblxcbiAgICAgICAgICAgIGlmICh0aW5lID4gMC4wKSB7XFxuICAgICAgICAgICAgICAgIGZsb2F0IF9zaWduID0gc2lnbihzY3JhdGNoKTtcXG5cXG4gICAgICAgICAgICAgICAgdGluZSA9IHMgKiB0aW5lIC8gcGVyaW9kICsgc2NyYXRjaCArIDAuMTtcXG4gICAgICAgICAgICAgICAgdGluZSA9IGNsYW1wKHRpbmUgKyAxLjAsIDAuNSArIF9zaWduICogMC41LCAxLjUgKyBfc2lnbiAqIDAuNSk7XFxuXFxuICAgICAgICAgICAgICAgIGNvbG9yLnJnYiAqPSB0aW5lO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBpZiAobm9pc2UgPiAwLjAgJiYgbm9pc2VTaXplID4gMC4wKVxcbiAgICB7XFxuICAgICAgICB2ZWMyIHBpeGVsQ29vcmQgPSB2VGV4dHVyZUNvb3JkLnh5ICogZmlsdGVyQXJlYS54eTtcXG4gICAgICAgIHBpeGVsQ29vcmQueCA9IGZsb29yKHBpeGVsQ29vcmQueCAvIG5vaXNlU2l6ZSk7XFxuICAgICAgICBwaXhlbENvb3JkLnkgPSBmbG9vcihwaXhlbENvb3JkLnkgLyBub2lzZVNpemUpO1xcbiAgICAgICAgLy8gdmVjMiBkID0gcGl4ZWxDb29yZCAqIG5vaXNlU2l6ZSAqIHZlYzIoMTAyNC4wICsgc2VlZCAqIDUxMi4wLCAxMDI0LjAgLSBzZWVkICogNTEyLjApO1xcbiAgICAgICAgLy8gZmxvYXQgX25vaXNlID0gc25vaXNlKGQpICogMC41O1xcbiAgICAgICAgZmxvYXQgX25vaXNlID0gcmFuZChwaXhlbENvb3JkICogbm9pc2VTaXplICogc2VlZCkgLSAwLjU7XFxuICAgICAgICBjb2xvciArPSBfbm9pc2UgKiBub2lzZTtcXG4gICAgfVxcblxcbiAgICBnbF9GcmFnQ29sb3IucmdiID0gY29sb3I7XFxufVxcblwiLGU9ZnVuY3Rpb24obil7ZnVuY3Rpb24gZShlLG8pe3ZvaWQgMD09PW8mJihvPTApLG4uY2FsbCh0aGlzLHQsaSksXCJudW1iZXJcIj09dHlwZW9mIGU/KHRoaXMuc2VlZD1lLGU9bnVsbCk6dGhpcy5zZWVkPW8sT2JqZWN0LmFzc2lnbih0aGlzLHtzZXBpYTouMyxub2lzZTouMyxub2lzZVNpemU6MSxzY3JhdGNoOi41LHNjcmF0Y2hEZW5zaXR5Oi4zLHNjcmF0Y2hXaWR0aDoxLHZpZ25ldHRpbmc6LjMsdmlnbmV0dGluZ0FscGhhOjEsdmlnbmV0dGluZ0JsdXI6LjN9LGUpfW4mJihlLl9fcHJvdG9fXz1uKSwoZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShuJiZuLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWU7dmFyIG89e3NlcGlhOntjb25maWd1cmFibGU6ITB9LG5vaXNlOntjb25maWd1cmFibGU6ITB9LG5vaXNlU2l6ZTp7Y29uZmlndXJhYmxlOiEwfSxzY3JhdGNoOntjb25maWd1cmFibGU6ITB9LHNjcmF0Y2hEZW5zaXR5Ontjb25maWd1cmFibGU6ITB9LHNjcmF0Y2hXaWR0aDp7Y29uZmlndXJhYmxlOiEwfSx2aWduZXR0aW5nOntjb25maWd1cmFibGU6ITB9LHZpZ25ldHRpbmdBbHBoYTp7Y29uZmlndXJhYmxlOiEwfSx2aWduZXR0aW5nQmx1cjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGUucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKG4sdCxpLGUpe3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT10LnNvdXJjZUZyYW1lLndpZHRoLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT10LnNvdXJjZUZyYW1lLmhlaWdodCx0aGlzLnVuaWZvcm1zLnNlZWQ9dGhpcy5zZWVkLG4uYXBwbHlGaWx0ZXIodGhpcyx0LGksZSl9LG8uc2VwaWEuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMuc2VwaWE9bn0sby5zZXBpYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zZXBpYX0sby5ub2lzZS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5ub2lzZT1ufSxvLm5vaXNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLm5vaXNlfSxvLm5vaXNlU2l6ZS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5ub2lzZVNpemU9bn0sby5ub2lzZVNpemUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMubm9pc2VTaXplfSxvLnNjcmF0Y2guc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMuc2NyYXRjaD1ufSxvLnNjcmF0Y2guZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2NyYXRjaH0sby5zY3JhdGNoRGVuc2l0eS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5zY3JhdGNoRGVuc2l0eT1ufSxvLnNjcmF0Y2hEZW5zaXR5LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNjcmF0Y2hEZW5zaXR5fSxvLnNjcmF0Y2hXaWR0aC5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5zY3JhdGNoV2lkdGg9bn0sby5zY3JhdGNoV2lkdGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2NyYXRjaFdpZHRofSxvLnZpZ25ldHRpbmcuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudmlnbmV0dGluZz1ufSxvLnZpZ25ldHRpbmcuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudmlnbmV0dGluZ30sby52aWduZXR0aW5nQWxwaGEuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudmlnbmV0dGluZ0FscGhhPW59LG8udmlnbmV0dGluZ0FscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmdBbHBoYX0sby52aWduZXR0aW5nQmx1ci5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy52aWduZXR0aW5nQmx1cj1ufSxvLnZpZ25ldHRpbmdCbHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmdCbHVyfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhlLnByb3RvdHlwZSxvKSxlfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLk9sZEZpbG1GaWx0ZXI9ZSxuLk9sZEZpbG1GaWx0ZXI9ZSxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLW9sZC1maWxtLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItb3V0bGluZSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItb3V0bGluZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLG8pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP28oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG8pOm8oZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgbz1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSBmbG9hdCB0aGlja25lc3M7XFxudW5pZm9ybSB2ZWM0IG91dGxpbmVDb2xvcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxudmVjMiBweCA9IHZlYzIoMS4wIC8gZmlsdGVyQXJlYS54LCAxLjAgLyBmaWx0ZXJBcmVhLnkpO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIGNvbnN0IGZsb2F0IFBJID0gMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDtcXG4gICAgdmVjNCBvd25Db2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzQgY3VyQ29sb3I7XFxuICAgIGZsb2F0IG1heEFscGhhID0gMC47XFxuICAgIHZlYzIgZGlzcGxhY2VkO1xcbiAgICBmb3IgKGZsb2F0IGFuZ2xlID0gMC47IGFuZ2xlIDwgUEkgKiAyLjsgYW5nbGUgKz0gJVRISUNLTkVTUyUgKSB7XFxuICAgICAgICBkaXNwbGFjZWQueCA9IHZUZXh0dXJlQ29vcmQueCArIHRoaWNrbmVzcyAqIHB4LnggKiBjb3MoYW5nbGUpO1xcbiAgICAgICAgZGlzcGxhY2VkLnkgPSB2VGV4dHVyZUNvb3JkLnkgKyB0aGlja25lc3MgKiBweC55ICogc2luKGFuZ2xlKTtcXG4gICAgICAgIGN1ckNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjbGFtcChkaXNwbGFjZWQsIGZpbHRlckNsYW1wLnh5LCBmaWx0ZXJDbGFtcC56dykpO1xcbiAgICAgICAgbWF4QWxwaGEgPSBtYXgobWF4QWxwaGEsIGN1ckNvbG9yLmEpO1xcbiAgICB9XFxuICAgIGZsb2F0IHJlc3VsdEFscGhhID0gbWF4KG1heEFscGhhLCBvd25Db2xvci5hKTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgob3duQ29sb3IucmdiICsgb3V0bGluZUNvbG9yLnJnYiAqICgxLiAtIG93bkNvbG9yLmEpKSAqIHJlc3VsdEFscGhhLCByZXN1bHRBbHBoYSk7XFxufVxcblwiLG49ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuLHIpe3ZvaWQgMD09PW4mJihuPTEpLHZvaWQgMD09PXImJihyPTApLGUuY2FsbCh0aGlzLG8sdC5yZXBsYWNlKC8lVEhJQ0tORVNTJS9naSwoMS9uKS50b0ZpeGVkKDcpKSksdGhpcy50aGlja25lc3M9bix0aGlzLnVuaWZvcm1zLm91dGxpbmVDb2xvcj1uZXcgRmxvYXQzMkFycmF5KFswLDAsMCwxXSksdGhpcy5jb2xvcj1yfWUmJihuLl9fcHJvdG9fXz1lKSwobi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW47dmFyIHI9e2NvbG9yOntjb25maWd1cmFibGU6ITB9LHRoaWNrbmVzczp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIuY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIFBJWEkudXRpbHMucmdiMmhleCh0aGlzLnVuaWZvcm1zLm91dGxpbmVDb2xvcil9LHIuY29sb3Iuc2V0PWZ1bmN0aW9uKGUpe1BJWEkudXRpbHMuaGV4MnJnYihlLHRoaXMudW5pZm9ybXMub3V0bGluZUNvbG9yKX0sci50aGlja25lc3MuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudGhpY2tuZXNzfSxyLnRoaWNrbmVzcy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy50aGlja25lc3M9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsciksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5PdXRsaW5lRmlsdGVyPW4sZS5PdXRsaW5lRmlsdGVyPW4sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1vdXRsaW5lLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItcGl4ZWxhdGUgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXBpeGVsYXRlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbyl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/byhleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbyk6byhlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBvPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHZlYzIgc2l6ZTtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG52ZWMyIG1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkICo9IGZpbHRlckFyZWEueHk7XFxuICAgIGNvb3JkICs9IGZpbHRlckFyZWEuenc7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB1bm1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkIC09IGZpbHRlckFyZWEuenc7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiBwaXhlbGF0ZSh2ZWMyIGNvb3JkLCB2ZWMyIHNpemUpXFxue1xcblxcdHJldHVybiBmbG9vciggY29vcmQgLyBzaXplICkgKiBzaXplO1xcbn1cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIHZlYzIgY29vcmQgPSBtYXBDb29yZCh2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgY29vcmQgPSBwaXhlbGF0ZShjb29yZCwgc2l6ZSk7XFxuXFxuICAgIGNvb3JkID0gdW5tYXBDb29yZChjb29yZCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY29vcmQpO1xcbn1cXG5cIixuPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4obil7dm9pZCAwPT09biYmKG49MTApLGUuY2FsbCh0aGlzLG8sciksdGhpcy5zaXplPW59ZSYmKG4uX19wcm90b19fPWUpLChuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bjt2YXIgdD17c2l6ZTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQuc2l6ZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zaXplfSx0LnNpemUuc2V0PWZ1bmN0aW9uKGUpe1wibnVtYmVyXCI9PXR5cGVvZiBlJiYoZT1bZSxlXSksdGhpcy51bmlmb3Jtcy5zaXplPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHQpLG59KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuUGl4ZWxhdGVGaWx0ZXI9bixlLlBpeGVsYXRlRmlsdGVyPW4sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1waXhlbGF0ZS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXJhZGlhbC1ibHVyIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1yYWRpYWwtYmx1ciBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP24oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG4pOm4oZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxuXFxudW5pZm9ybSBmbG9hdCB1UmFkaWFuO1xcbnVuaWZvcm0gdmVjMiB1Q2VudGVyO1xcbnVuaWZvcm0gZmxvYXQgdVJhZGl1cztcXG51bmlmb3JtIGludCB1S2VybmVsU2l6ZTtcXG5cXG5jb25zdCBpbnQgTUFYX0tFUk5FTF9TSVpFID0gMjA0ODtcXG5jb25zdCBpbnQgSVRFUkFUSU9OID0gTUFYX0tFUk5FTF9TSVpFIC0gMTtcXG5cXG4vLyBmbG9hdCBrZXJuZWxTaXplID0gbWluKGZsb2F0KHVLZXJuZWxTaXplKSwgZmxvYXQoTUFYX0tFUk5FTFNJWkUpKTtcXG5cXG4vLyBJbiByZWFsIHVzZS1jYXNlICwgdUtlcm5lbFNpemUgPCBNQVhfS0VSTkVMU0laRSBhbG1vc3QgYWx3YXlzLlxcbi8vIFNvIHVzZSB1S2VybmVsU2l6ZSBkaXJlY3RseS5cXG5mbG9hdCBrZXJuZWxTaXplID0gZmxvYXQodUtlcm5lbFNpemUpO1xcbmZsb2F0IGsgPSBrZXJuZWxTaXplIC0gMS4wO1xcblxcblxcbnZlYzIgY2VudGVyID0gdUNlbnRlci54eSAvIGZpbHRlckFyZWEueHk7XFxuZmxvYXQgYXNwZWN0ID0gZmlsdGVyQXJlYS55IC8gZmlsdGVyQXJlYS54O1xcblxcbmZsb2F0IGdyYWRpZW50ID0gdVJhZGl1cyAvIGZpbHRlckFyZWEueCAqIDAuMztcXG5mbG9hdCByYWRpdXMgPSB1UmFkaXVzIC8gZmlsdGVyQXJlYS54IC0gZ3JhZGllbnQgKiAwLjU7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBpZiAodUtlcm5lbFNpemUgPT0gMClcXG4gICAge1xcbiAgICAgICAgcmV0dXJuO1xcbiAgICB9XFxuXFxuICAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkO1xcblxcbiAgICB2ZWMyIGRpciA9IHZlYzIoY2VudGVyIC0gY29vcmQpO1xcbiAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKHZlYzIoZGlyLngsIGRpci55ICogYXNwZWN0KSk7XFxuXFxuICAgIGZsb2F0IHJhZGlhblN0ZXA7XFxuXFxuICAgIGlmIChyYWRpdXMgPj0gMC4wICYmIGRpc3QgPiByYWRpdXMpIHtcXG4gICAgICAgIGZsb2F0IGRlbHRhID0gZGlzdCAtIHJhZGl1cztcXG4gICAgICAgIGZsb2F0IGdhcCA9IGdyYWRpZW50O1xcbiAgICAgICAgZmxvYXQgc2NhbGUgPSAxLjAgLSBhYnMoZGVsdGEgLyBnYXApO1xcbiAgICAgICAgaWYgKHNjYWxlIDw9IDAuMCkge1xcbiAgICAgICAgICAgIHJldHVybjtcXG4gICAgICAgIH1cXG4gICAgICAgIHJhZGlhblN0ZXAgPSB1UmFkaWFuICogc2NhbGUgLyBrO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgICAgcmFkaWFuU3RlcCA9IHVSYWRpYW4gLyBrO1xcbiAgICB9XFxuXFxuICAgIGZsb2F0IHMgPSBzaW4ocmFkaWFuU3RlcCk7XFxuICAgIGZsb2F0IGMgPSBjb3MocmFkaWFuU3RlcCk7XFxuICAgIG1hdDIgcm90YXRpb25NYXRyaXggPSBtYXQyKHZlYzIoYywgLXMpLCB2ZWMyKHMsIGMpKTtcXG5cXG4gICAgZm9yKGludCBpID0gMDsgaSA8IElURVJBVElPTjsgaSsrKSB7XFxuICAgICAgICBpZiAoaSA9PSBpbnQoaykpIHtcXG4gICAgICAgICAgICBicmVhaztcXG4gICAgICAgIH1cXG5cXG4gICAgICAgIGNvb3JkIC09IGNlbnRlcjtcXG4gICAgICAgIGNvb3JkLnkgKj0gYXNwZWN0O1xcbiAgICAgICAgY29vcmQgPSByb3RhdGlvbk1hdHJpeCAqIGNvb3JkO1xcbiAgICAgICAgY29vcmQueSAvPSBhc3BlY3Q7XFxuICAgICAgICBjb29yZCArPSBjZW50ZXI7XFxuXFxuICAgICAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgY29vcmQpO1xcblxcbiAgICAgICAgLy8gc3dpdGNoIHRvIHByZS1tdWx0aXBsaWVkIGFscGhhIHRvIGNvcnJlY3RseSBibHVyIHRyYW5zcGFyZW50IGltYWdlc1xcbiAgICAgICAgLy8gc2FtcGxlLnJnYiAqPSBzYW1wbGUuYTtcXG5cXG4gICAgICAgIGdsX0ZyYWdDb2xvciArPSBzYW1wbGU7XFxuICAgIH1cXG4gICAgZ2xfRnJhZ0NvbG9yIC89IGtlcm5lbFNpemU7XFxufVxcblwiLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihyLGksbyxhKXt2b2lkIDA9PT1yJiYocj0wKSx2b2lkIDA9PT1pJiYoaT1bMCwwXSksdm9pZCAwPT09byYmKG89NSksdm9pZCAwPT09YSYmKGE9LTEpLGUuY2FsbCh0aGlzLG4sdCksdGhpcy5fYW5nbGU9MCx0aGlzLmFuZ2xlPXIsdGhpcy5jZW50ZXI9aSx0aGlzLmtlcm5lbFNpemU9byx0aGlzLnJhZGl1cz1hfWUmJihyLl9fcHJvdG9fXz1lKSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIGk9e2FuZ2xlOntjb25maWd1cmFibGU6ITB9LGNlbnRlcjp7Y29uZmlndXJhYmxlOiEwfSxyYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLG4sdCxyKXt0aGlzLnVuaWZvcm1zLnVLZXJuZWxTaXplPTAhPT10aGlzLl9hbmdsZT90aGlzLmtlcm5lbFNpemU6MCxlLmFwcGx5RmlsdGVyKHRoaXMsbix0LHIpfSxpLmFuZ2xlLnNldD1mdW5jdGlvbihlKXt0aGlzLl9hbmdsZT1lLHRoaXMudW5pZm9ybXMudVJhZGlhbj1lKk1hdGguUEkvMTgwfSxpLmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9hbmdsZX0saS5jZW50ZXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudUNlbnRlcn0saS5jZW50ZXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudUNlbnRlcj1lfSxpLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51UmFkaXVzfSxpLnJhZGl1cy5zZXQ9ZnVuY3Rpb24oZSl7KGU8MHx8ZT09PTEvMCkmJihlPS0xKSx0aGlzLnVuaWZvcm1zLnVSYWRpdXM9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsaSkscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5SYWRpYWxCbHVyRmlsdGVyPXIsZS5SYWRpYWxCbHVyRmlsdGVyPXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1yYWRpYWwtYmx1ci5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXJnYi1zcGxpdCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItcmdiLXNwbGl0IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUscil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/cihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0scik6cihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciByPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzIgcmVkO1xcbnVuaWZvcm0gdmVjMiBncmVlbjtcXG51bmlmb3JtIHZlYzIgYmx1ZTtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgZ2xfRnJhZ0NvbG9yLnIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyByZWQvZmlsdGVyQXJlYS54eSkucjtcXG4gICBnbF9GcmFnQ29sb3IuZyA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIGdyZWVuL2ZpbHRlckFyZWEueHkpLmc7XFxuICAgZ2xfRnJhZ0NvbG9yLmIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBibHVlL2ZpbHRlckFyZWEueHkpLmI7XFxuICAgZ2xfRnJhZ0NvbG9yLmEgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpLmE7XFxufVxcblwiLG49ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuLG8saSl7dm9pZCAwPT09biYmKG49Wy0xMCwwXSksdm9pZCAwPT09byYmKG89WzAsMTBdKSx2b2lkIDA9PT1pJiYoaT1bMCwwXSksZS5jYWxsKHRoaXMscix0KSx0aGlzLnJlZD1uLHRoaXMuZ3JlZW49byx0aGlzLmJsdWU9aX1lJiYobi5fX3Byb3RvX189ZSksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciBvPXtyZWQ6e2NvbmZpZ3VyYWJsZTohMH0sZ3JlZW46e2NvbmZpZ3VyYWJsZTohMH0sYmx1ZTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIG8ucmVkLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnJlZH0sby5yZWQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMucmVkPWV9LG8uZ3JlZW4uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZ3JlZW59LG8uZ3JlZW4uc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuZ3JlZW49ZX0sby5ibHVlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJsdWV9LG8uYmx1ZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5ibHVlPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLG8pLG59KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuUkdCU3BsaXRGaWx0ZXI9bixlLlJHQlNwbGl0RmlsdGVyPW4sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1yZ2Itc3BsaXQuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1zaG9ja3dhdmUgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXNob2Nrd2F2ZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixuPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckNsYW1wO1xcblxcbnVuaWZvcm0gdmVjMiBjZW50ZXI7XFxuXFxudW5pZm9ybSBmbG9hdCBhbXBsaXR1ZGU7XFxudW5pZm9ybSBmbG9hdCB3YXZlbGVuZ3RoO1xcbi8vIHVuaWZvcm0gZmxvYXQgcG93ZXI7XFxudW5pZm9ybSBmbG9hdCBicmlnaHRuZXNzO1xcbnVuaWZvcm0gZmxvYXQgc3BlZWQ7XFxudW5pZm9ybSBmbG9hdCByYWRpdXM7XFxuXFxudW5pZm9ybSBmbG9hdCB0aW1lO1xcblxcbmNvbnN0IGZsb2F0IFBJID0gMy4xNDE1OTtcXG5cXG52b2lkIG1haW4oKVxcbntcXG4gICAgZmxvYXQgaGFsZldhdmVsZW5ndGggPSB3YXZlbGVuZ3RoICogMC41IC8gZmlsdGVyQXJlYS54O1xcbiAgICBmbG9hdCBtYXhSYWRpdXMgPSByYWRpdXMgLyBmaWx0ZXJBcmVhLng7XFxuICAgIGZsb2F0IGN1cnJlbnRSYWRpdXMgPSB0aW1lICogc3BlZWQgLyBmaWx0ZXJBcmVhLng7XFxuXFxuICAgIGZsb2F0IGZhZGUgPSAxLjA7XFxuXFxuICAgIGlmIChtYXhSYWRpdXMgPiAwLjApIHtcXG4gICAgICAgIGlmIChjdXJyZW50UmFkaXVzID4gbWF4UmFkaXVzKSB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgICAgICAgICByZXR1cm47XFxuICAgICAgICB9XFxuICAgICAgICBmYWRlID0gMS4wIC0gcG93KGN1cnJlbnRSYWRpdXMgLyBtYXhSYWRpdXMsIDIuMCk7XFxuICAgIH1cXG5cXG4gICAgdmVjMiBkaXIgPSB2ZWMyKHZUZXh0dXJlQ29vcmQgLSBjZW50ZXIgLyBmaWx0ZXJBcmVhLnh5KTtcXG4gICAgZGlyLnkgKj0gZmlsdGVyQXJlYS55IC8gZmlsdGVyQXJlYS54O1xcbiAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKGRpcik7XFxuXFxuICAgIGlmIChkaXN0IDw9IDAuMCB8fCBkaXN0IDwgY3VycmVudFJhZGl1cyAtIGhhbGZXYXZlbGVuZ3RoIHx8IGRpc3QgPiBjdXJyZW50UmFkaXVzICsgaGFsZldhdmVsZW5ndGgpIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgdmVjMiBkaWZmVVYgPSBub3JtYWxpemUoZGlyKTtcXG5cXG4gICAgZmxvYXQgZGlmZiA9IChkaXN0IC0gY3VycmVudFJhZGl1cykgLyBoYWxmV2F2ZWxlbmd0aDtcXG5cXG4gICAgZmxvYXQgcCA9IDEuMCAtIHBvdyhhYnMoZGlmZiksIDIuMCk7XFxuXFxuICAgIC8vIGZsb2F0IHBvd0RpZmYgPSBkaWZmICogcG93KHAsIDIuMCkgKiAoIGFtcGxpdHVkZSAqIGZhZGUgKTtcXG4gICAgZmxvYXQgcG93RGlmZiA9IDEuMjUgKiBzaW4oZGlmZiAqIFBJKSAqIHAgKiAoIGFtcGxpdHVkZSAqIGZhZGUgKTtcXG5cXG4gICAgdmVjMiBvZmZzZXQgPSBkaWZmVVYgKiBwb3dEaWZmIC8gZmlsdGVyQXJlYS54eTtcXG5cXG4gICAgLy8gRG8gY2xhbXAgOlxcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCArIG9mZnNldDtcXG4gICAgdmVjMiBjbGFtcGVkQ29vcmQgPSBjbGFtcChjb29yZCwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjbGFtcGVkQ29vcmQpO1xcbiAgICBpZiAoY29vcmQgIT0gY2xhbXBlZENvb3JkKSB7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgKj0gbWF4KDAuMCwgMS4wIC0gbGVuZ3RoKGNvb3JkIC0gY2xhbXBlZENvb3JkKSk7XFxuICAgIH1cXG5cXG4gICAgLy8gTm8gY2xhbXAgOlxcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBvZmZzZXQpO1xcblxcbiAgICBnbF9GcmFnQ29sb3IucmdiICo9IDEuMCArIChicmlnaHRuZXNzIC0gMS4wKSAqIHAgKiBmYWRlO1xcbn1cXG5cIixyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHIocixpLG8pe3ZvaWQgMD09PXImJihyPVswLDBdKSx2b2lkIDA9PT1pJiYoaT17fSksdm9pZCAwPT09byYmKG89MCksZS5jYWxsKHRoaXMsdCxuKSx0aGlzLmNlbnRlcj1yLEFycmF5LmlzQXJyYXkoaSkmJihjb25zb2xlLndhcm4oXCJEZXByZWNhdGVkIFdhcm5pbmc6IFNob2Nrd2F2ZUZpbHRlciBwYXJhbXMgQXJyYXkgaGFzIGJlZW4gY2hhbmdlZCB0byBvcHRpb25zIE9iamVjdC5cIiksaT17fSksaT1PYmplY3QuYXNzaWduKHthbXBsaXR1ZGU6MzAsd2F2ZWxlbmd0aDoxNjAsYnJpZ2h0bmVzczoxLHNwZWVkOjUwMCxyYWRpdXM6LTF9LGkpLHRoaXMuYW1wbGl0dWRlPWkuYW1wbGl0dWRlLHRoaXMud2F2ZWxlbmd0aD1pLndhdmVsZW5ndGgsdGhpcy5icmlnaHRuZXNzPWkuYnJpZ2h0bmVzcyx0aGlzLnNwZWVkPWkuc3BlZWQsdGhpcy5yYWRpdXM9aS5yYWRpdXMsdGhpcy50aW1lPW99ZSYmKHIuX19wcm90b19fPWUpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgaT17Y2VudGVyOntjb25maWd1cmFibGU6ITB9LGFtcGxpdHVkZTp7Y29uZmlndXJhYmxlOiEwfSx3YXZlbGVuZ3RoOntjb25maWd1cmFibGU6ITB9LGJyaWdodG5lc3M6e2NvbmZpZ3VyYWJsZTohMH0sc3BlZWQ6e2NvbmZpZ3VyYWJsZTohMH0scmFkaXVzOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG4scil7dGhpcy51bmlmb3Jtcy50aW1lPXRoaXMudGltZSxlLmFwcGx5RmlsdGVyKHRoaXMsdCxuLHIpfSxpLmNlbnRlci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5jZW50ZXJ9LGkuY2VudGVyLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmNlbnRlcj1lfSxpLmFtcGxpdHVkZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbXBsaXR1ZGV9LGkuYW1wbGl0dWRlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmFtcGxpdHVkZT1lfSxpLndhdmVsZW5ndGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMud2F2ZWxlbmd0aH0saS53YXZlbGVuZ3RoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLndhdmVsZW5ndGg9ZX0saS5icmlnaHRuZXNzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJyaWdodG5lc3N9LGkuYnJpZ2h0bmVzcy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5icmlnaHRuZXNzPWV9LGkuc3BlZWQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc3BlZWR9LGkuc3BlZWQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuc3BlZWQ9ZX0saS5yYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucmFkaXVzfSxpLnJhZGl1cy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5yYWRpdXM9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsaSkscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5TaG9ja3dhdmVGaWx0ZXI9cixlLlNob2Nrd2F2ZUZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItc2hvY2t3YXZlLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1zaW1wbGUtbGlnaHRtYXAgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsbz1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVMaWdodG1hcDtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzIgZGltZW5zaW9ucztcXG51bmlmb3JtIHZlYzQgYW1iaWVudENvbG9yO1xcbnZvaWQgbWFpbigpIHtcXG4gICAgdmVjNCBkaWZmdXNlQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWMyIGxpZ2h0Q29vcmQgPSAodlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHkpIC8gZGltZW5zaW9ucztcXG4gICAgdmVjNCBsaWdodCA9IHRleHR1cmUyRCh1TGlnaHRtYXAsIGxpZ2h0Q29vcmQpO1xcbiAgICB2ZWMzIGFtYmllbnQgPSBhbWJpZW50Q29sb3IucmdiICogYW1iaWVudENvbG9yLmE7XFxuICAgIHZlYzMgaW50ZW5zaXR5ID0gYW1iaWVudCArIGxpZ2h0LnJnYjtcXG4gICAgdmVjMyBmaW5hbENvbG9yID0gZGlmZnVzZUNvbG9yLnJnYiAqIGludGVuc2l0eTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChmaW5hbENvbG9yLCBkaWZmdXNlQ29sb3IuYSk7XFxufVxcblwiLGk9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gaShpLHIsbil7dm9pZCAwPT09ciYmKHI9MCksdm9pZCAwPT09biYmKG49MSksZS5jYWxsKHRoaXMsdCxvKSx0aGlzLnVuaWZvcm1zLmFtYmllbnRDb2xvcj1uZXcgRmxvYXQzMkFycmF5KFswLDAsMCxuXSksdGhpcy50ZXh0dXJlPWksdGhpcy5jb2xvcj1yfWUmJihpLl9fcHJvdG9fXz1lKSwoaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWk7dmFyIHI9e3RleHR1cmU6e2NvbmZpZ3VyYWJsZTohMH0sY29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sYWxwaGE6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsbyxpKXt0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMF09dC5zb3VyY2VGcmFtZS53aWR0aCx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMV09dC5zb3VyY2VGcmFtZS5oZWlnaHQsZS5hcHBseUZpbHRlcih0aGlzLHQsbyxpKX0sci50ZXh0dXJlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVMaWdodG1hcH0sci50ZXh0dXJlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnVMaWdodG1hcD1lfSxyLmNvbG9yLnNldD1mdW5jdGlvbihlKXt2YXIgdD10aGlzLnVuaWZvcm1zLmFtYmllbnRDb2xvcjtcIm51bWJlclwiPT10eXBlb2YgZT8oUElYSS51dGlscy5oZXgycmdiKGUsdCksdGhpcy5fY29sb3I9ZSk6KHRbMF09ZVswXSx0WzFdPWVbMV0sdFsyXT1lWzJdLHRbM109ZVszXSx0aGlzLl9jb2xvcj1QSVhJLnV0aWxzLnJnYjJoZXgodCkpfSxyLmNvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb2xvcn0sci5hbHBoYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbWJpZW50Q29sb3JbM119LHIuYWxwaGEuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYW1iaWVudENvbG9yWzNdPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGkucHJvdG90eXBlLHIpLGl9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuU2ltcGxlTGlnaHRtYXBGaWx0ZXI9aSxlLlNpbXBsZUxpZ2h0bWFwRmlsdGVyPWksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1zaW1wbGUtbGlnaHRtYXAuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci10aWx0LXNoaWZ0IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci10aWx0LXNoaWZ0IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKHQsaSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/aShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0saSk6aSh0Ll9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciBpPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLGU9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IGJsdXI7XFxudW5pZm9ybSBmbG9hdCBncmFkaWVudEJsdXI7XFxudW5pZm9ybSB2ZWMyIHN0YXJ0O1xcbnVuaWZvcm0gdmVjMiBlbmQ7XFxudW5pZm9ybSB2ZWMyIGRlbHRhO1xcbnVuaWZvcm0gdmVjMiB0ZXhTaXplO1xcblxcbmZsb2F0IHJhbmRvbSh2ZWMzIHNjYWxlLCBmbG9hdCBzZWVkKVxcbntcXG4gICAgcmV0dXJuIGZyYWN0KHNpbihkb3QoZ2xfRnJhZ0Nvb3JkLnh5eiArIHNlZWQsIHNjYWxlKSkgKiA0Mzc1OC41NDUzICsgc2VlZCk7XFxufVxcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgdmVjNCBjb2xvciA9IHZlYzQoMC4wKTtcXG4gICAgZmxvYXQgdG90YWwgPSAwLjA7XFxuXFxuICAgIGZsb2F0IG9mZnNldCA9IHJhbmRvbSh2ZWMzKDEyLjk4OTgsIDc4LjIzMywgMTUxLjcxODIpLCAwLjApO1xcbiAgICB2ZWMyIG5vcm1hbCA9IG5vcm1hbGl6ZSh2ZWMyKHN0YXJ0LnkgLSBlbmQueSwgZW5kLnggLSBzdGFydC54KSk7XFxuICAgIGZsb2F0IHJhZGl1cyA9IHNtb290aHN0ZXAoMC4wLCAxLjAsIGFicyhkb3QodlRleHR1cmVDb29yZCAqIHRleFNpemUgLSBzdGFydCwgbm9ybWFsKSkgLyBncmFkaWVudEJsdXIpICogYmx1cjtcXG5cXG4gICAgZm9yIChmbG9hdCB0ID0gLTMwLjA7IHQgPD0gMzAuMDsgdCsrKVxcbiAgICB7XFxuICAgICAgICBmbG9hdCBwZXJjZW50ID0gKHQgKyBvZmZzZXQgLSAwLjUpIC8gMzAuMDtcXG4gICAgICAgIGZsb2F0IHdlaWdodCA9IDEuMCAtIGFicyhwZXJjZW50KTtcXG4gICAgICAgIHZlYzQgc2FtcGxlID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgZGVsdGEgLyB0ZXhTaXplICogcGVyY2VudCAqIHJhZGl1cyk7XFxuICAgICAgICBzYW1wbGUucmdiICo9IHNhbXBsZS5hO1xcbiAgICAgICAgY29sb3IgKz0gc2FtcGxlICogd2VpZ2h0O1xcbiAgICAgICAgdG90YWwgKz0gd2VpZ2h0O1xcbiAgICB9XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yIC8gdG90YWw7XFxuICAgIGdsX0ZyYWdDb2xvci5yZ2IgLz0gZ2xfRnJhZ0NvbG9yLmEgKyAwLjAwMDAxO1xcbn1cXG5cIixyPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIHIocixuLG8sbCl7dm9pZCAwPT09ciYmKHI9MTAwKSx2b2lkIDA9PT1uJiYobj02MDApLHZvaWQgMD09PW8mJihvPW51bGwpLHZvaWQgMD09PWwmJihsPW51bGwpLHQuY2FsbCh0aGlzLGksZSksdGhpcy51bmlmb3Jtcy5ibHVyPXIsdGhpcy51bmlmb3Jtcy5ncmFkaWVudEJsdXI9bix0aGlzLnVuaWZvcm1zLnN0YXJ0PW98fG5ldyBQSVhJLlBvaW50KDAsd2luZG93LmlubmVySGVpZ2h0LzIpLHRoaXMudW5pZm9ybXMuZW5kPWx8fG5ldyBQSVhJLlBvaW50KDYwMCx3aW5kb3cuaW5uZXJIZWlnaHQvMiksdGhpcy51bmlmb3Jtcy5kZWx0YT1uZXcgUElYSS5Qb2ludCgzMCwzMCksdGhpcy51bmlmb3Jtcy50ZXhTaXplPW5ldyBQSVhJLlBvaW50KHdpbmRvdy5pbm5lcldpZHRoLHdpbmRvdy5pbm5lckhlaWdodCksdGhpcy51cGRhdGVEZWx0YSgpfXQmJihyLl9fcHJvdG9fXz10KSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIG49e2JsdXI6e2NvbmZpZ3VyYWJsZTohMH0sZ3JhZGllbnRCbHVyOntjb25maWd1cmFibGU6ITB9LHN0YXJ0Ontjb25maWd1cmFibGU6ITB9LGVuZDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIucHJvdG90eXBlLnVwZGF0ZURlbHRhPWZ1bmN0aW9uKCl7dGhpcy51bmlmb3Jtcy5kZWx0YS54PTAsdGhpcy51bmlmb3Jtcy5kZWx0YS55PTB9LG4uYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ibHVyfSxuLmJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudW5pZm9ybXMuYmx1cj10fSxuLmdyYWRpZW50Qmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ncmFkaWVudEJsdXJ9LG4uZ3JhZGllbnRCbHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLnVuaWZvcm1zLmdyYWRpZW50Qmx1cj10fSxuLnN0YXJ0LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnN0YXJ0fSxuLnN0YXJ0LnNldD1mdW5jdGlvbih0KXt0aGlzLnVuaWZvcm1zLnN0YXJ0PXQsdGhpcy51cGRhdGVEZWx0YSgpfSxuLmVuZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5lbmR9LG4uZW5kLnNldD1mdW5jdGlvbih0KXt0aGlzLnVuaWZvcm1zLmVuZD10LHRoaXMudXBkYXRlRGVsdGEoKX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsbikscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5UaWx0U2hpZnRBeGlzRmlsdGVyPXI7dmFyIG49ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaSgpe3QuYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiB0JiYoaS5fX3Byb3RvX189dCksaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSksaS5wcm90b3R5cGUuY29uc3RydWN0b3I9aSxpLnByb3RvdHlwZS51cGRhdGVEZWx0YT1mdW5jdGlvbigpe3ZhciB0PXRoaXMudW5pZm9ybXMuZW5kLngtdGhpcy51bmlmb3Jtcy5zdGFydC54LGk9dGhpcy51bmlmb3Jtcy5lbmQueS10aGlzLnVuaWZvcm1zLnN0YXJ0LnksZT1NYXRoLnNxcnQodCp0K2kqaSk7dGhpcy51bmlmb3Jtcy5kZWx0YS54PXQvZSx0aGlzLnVuaWZvcm1zLmRlbHRhLnk9aS9lfSxpfShyKTtQSVhJLmZpbHRlcnMuVGlsdFNoaWZ0WEZpbHRlcj1uO3ZhciBvPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGkoKXt0LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gdCYmKGkuX19wcm90b19fPXQpLGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpLGkucHJvdG90eXBlLmNvbnN0cnVjdG9yPWksaS5wcm90b3R5cGUudXBkYXRlRGVsdGE9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnVuaWZvcm1zLmVuZC54LXRoaXMudW5pZm9ybXMuc3RhcnQueCxpPXRoaXMudW5pZm9ybXMuZW5kLnktdGhpcy51bmlmb3Jtcy5zdGFydC55LGU9TWF0aC5zcXJ0KHQqdCtpKmkpO3RoaXMudW5pZm9ybXMuZGVsdGEueD0taS9lLHRoaXMudW5pZm9ybXMuZGVsdGEueT10L2V9LGl9KHIpO1BJWEkuZmlsdGVycy5UaWx0U2hpZnRZRmlsdGVyPW87dmFyIGw9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaShpLGUscixsKXt2b2lkIDA9PT1pJiYoaT0xMDApLHZvaWQgMD09PWUmJihlPTYwMCksdm9pZCAwPT09ciYmKHI9bnVsbCksdm9pZCAwPT09bCYmKGw9bnVsbCksdC5jYWxsKHRoaXMpLHRoaXMudGlsdFNoaWZ0WEZpbHRlcj1uZXcgbihpLGUscixsKSx0aGlzLnRpbHRTaGlmdFlGaWx0ZXI9bmV3IG8oaSxlLHIsbCl9dCYmKGkuX19wcm90b19fPXQpLChpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9aTt2YXIgZT17Ymx1cjp7Y29uZmlndXJhYmxlOiEwfSxncmFkaWVudEJsdXI6e2NvbmZpZ3VyYWJsZTohMH0sc3RhcnQ6e2NvbmZpZ3VyYWJsZTohMH0sZW5kOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24odCxpLGUpe3ZhciByPXQuZ2V0UmVuZGVyVGFyZ2V0KCEwKTt0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuYXBwbHkodCxpLHIpLHRoaXMudGlsdFNoaWZ0WUZpbHRlci5hcHBseSh0LHIsZSksdC5yZXR1cm5SZW5kZXJUYXJnZXQocil9LGUuYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aWx0U2hpZnRYRmlsdGVyLmJsdXJ9LGUuYmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy50aWx0U2hpZnRYRmlsdGVyLmJsdXI9dGhpcy50aWx0U2hpZnRZRmlsdGVyLmJsdXI9dH0sZS5ncmFkaWVudEJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlsdFNoaWZ0WEZpbHRlci5ncmFkaWVudEJsdXJ9LGUuZ3JhZGllbnRCbHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuZ3JhZGllbnRCbHVyPXRoaXMudGlsdFNoaWZ0WUZpbHRlci5ncmFkaWVudEJsdXI9dH0sZS5zdGFydC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aWx0U2hpZnRYRmlsdGVyLnN0YXJ0fSxlLnN0YXJ0LnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuc3RhcnQ9dGhpcy50aWx0U2hpZnRZRmlsdGVyLnN0YXJ0PXR9LGUuZW5kLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuZW5kfSxlLmVuZC5zZXQ9ZnVuY3Rpb24odCl7dGhpcy50aWx0U2hpZnRYRmlsdGVyLmVuZD10aGlzLnRpbHRTaGlmdFlGaWx0ZXIuZW5kPXR9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGkucHJvdG90eXBlLGUpLGl9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuVGlsdFNoaWZ0RmlsdGVyPWwsdC5UaWx0U2hpZnRGaWx0ZXI9bCx0LlRpbHRTaGlmdFhGaWx0ZXI9bix0LlRpbHRTaGlmdFlGaWx0ZXI9byx0LlRpbHRTaGlmdEF4aXNGaWx0ZXI9cixPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXRpbHQtc2hpZnQuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci10d2lzdCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItdHdpc3QgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obyxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKG8uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgcmFkaXVzO1xcbnVuaWZvcm0gZmxvYXQgYW5nbGU7XFxudW5pZm9ybSB2ZWMyIG9mZnNldDtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG52ZWMyIG1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkICo9IGZpbHRlckFyZWEueHk7XFxuICAgIGNvb3JkICs9IGZpbHRlckFyZWEuenc7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB1bm1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkIC09IGZpbHRlckFyZWEuenc7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB0d2lzdCh2ZWMyIGNvb3JkKVxcbntcXG4gICAgY29vcmQgLT0gb2Zmc2V0O1xcblxcbiAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKGNvb3JkKTtcXG5cXG4gICAgaWYgKGRpc3QgPCByYWRpdXMpXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IHJhdGlvRGlzdCA9IChyYWRpdXMgLSBkaXN0KSAvIHJhZGl1cztcXG4gICAgICAgIGZsb2F0IGFuZ2xlTW9kID0gcmF0aW9EaXN0ICogcmF0aW9EaXN0ICogYW5nbGU7XFxuICAgICAgICBmbG9hdCBzID0gc2luKGFuZ2xlTW9kKTtcXG4gICAgICAgIGZsb2F0IGMgPSBjb3MoYW5nbGVNb2QpO1xcbiAgICAgICAgY29vcmQgPSB2ZWMyKGNvb3JkLnggKiBjIC0gY29vcmQueSAqIHMsIGNvb3JkLnggKiBzICsgY29vcmQueSAqIGMpO1xcbiAgICB9XFxuXFxuICAgIGNvb3JkICs9IG9mZnNldDtcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuXFxuICAgIHZlYzIgY29vcmQgPSBtYXBDb29yZCh2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgY29vcmQgPSB0d2lzdChjb29yZCk7XFxuXFxuICAgIGNvb3JkID0gdW5tYXBDb29yZChjb29yZCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY29vcmQgKTtcXG5cXG59XFxuXCIsZT1mdW5jdGlvbihvKXtmdW5jdGlvbiBlKGUsdCxpKXt2b2lkIDA9PT1lJiYoZT0yMDApLHZvaWQgMD09PXQmJih0PTQpLHZvaWQgMD09PWkmJihpPTIwKSxvLmNhbGwodGhpcyxuLHIpLHRoaXMucmFkaXVzPWUsdGhpcy5hbmdsZT10LHRoaXMucGFkZGluZz1pfW8mJihlLl9fcHJvdG9fXz1vKSwoZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShvJiZvLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWU7dmFyIHQ9e29mZnNldDp7Y29uZmlndXJhYmxlOiEwfSxyYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH0sYW5nbGU6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiB0Lm9mZnNldC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5vZmZzZXR9LHQub2Zmc2V0LnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLm9mZnNldD1vfSx0LnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5yYWRpdXN9LHQucmFkaXVzLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLnJhZGl1cz1vfSx0LmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmFuZ2xlfSx0LmFuZ2xlLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLmFuZ2xlPW99LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGUucHJvdG90eXBlLHQpLGV9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuVHdpc3RGaWx0ZXI9ZSxvLlR3aXN0RmlsdGVyPWUsT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci10d2lzdC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXpvb20tYmx1ciAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItem9vbS1ibHVyIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG4sZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZShuLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG4pe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG51bmlmb3JtIHZlYzIgdUNlbnRlcjtcXG51bmlmb3JtIGZsb2F0IHVTdHJlbmd0aDtcXG51bmlmb3JtIGZsb2F0IHVJbm5lclJhZGl1cztcXG51bmlmb3JtIGZsb2F0IHVSYWRpdXM7XFxuXFxuY29uc3QgZmxvYXQgTUFYX0tFUk5FTF9TSVpFID0gMzIuMDtcXG5cXG5mbG9hdCByYW5kb20odmVjMyBzY2FsZSwgZmxvYXQgc2VlZCkge1xcbiAgICAvLyB1c2UgdGhlIGZyYWdtZW50IHBvc2l0aW9uIGZvciBhIGRpZmZlcmVudCBzZWVkIHBlci1waXhlbFxcbiAgICByZXR1cm4gZnJhY3Qoc2luKGRvdChnbF9GcmFnQ29vcmQueHl6ICsgc2VlZCwgc2NhbGUpKSAqIDQzNzU4LjU0NTMgKyBzZWVkKTtcXG59XFxuXFxudm9pZCBtYWluKCkge1xcblxcbiAgICBmbG9hdCBtaW5HcmFkaWVudCA9IHVJbm5lclJhZGl1cyAqIDAuMztcXG4gICAgZmxvYXQgaW5uZXJSYWRpdXMgPSAodUlubmVyUmFkaXVzICsgbWluR3JhZGllbnQgKiAwLjUpIC8gZmlsdGVyQXJlYS54O1xcblxcbiAgICBmbG9hdCBncmFkaWVudCA9IHVSYWRpdXMgKiAwLjM7XFxuICAgIGZsb2F0IHJhZGl1cyA9ICh1UmFkaXVzIC0gZ3JhZGllbnQgKiAwLjUpIC8gZmlsdGVyQXJlYS54O1xcblxcbiAgICBmbG9hdCBjb3VudExpbWl0ID0gTUFYX0tFUk5FTF9TSVpFO1xcblxcbiAgICB2ZWMyIGRpciA9IHZlYzIodUNlbnRlci54eSAvIGZpbHRlckFyZWEueHkgLSB2VGV4dHVyZUNvb3JkKTtcXG4gICAgZmxvYXQgZGlzdCA9IGxlbmd0aCh2ZWMyKGRpci54LCBkaXIueSAqIGZpbHRlckFyZWEueSAvIGZpbHRlckFyZWEueCkpO1xcblxcbiAgICBmbG9hdCBzdHJlbmd0aCA9IHVTdHJlbmd0aDtcXG5cXG4gICAgZmxvYXQgZGVsdGEgPSAwLjA7XFxuICAgIGZsb2F0IGdhcDtcXG4gICAgaWYgKGRpc3QgPCBpbm5lclJhZGl1cykge1xcbiAgICAgICAgZGVsdGEgPSBpbm5lclJhZGl1cyAtIGRpc3Q7XFxuICAgICAgICBnYXAgPSBtaW5HcmFkaWVudDtcXG4gICAgfSBlbHNlIGlmIChyYWRpdXMgPj0gMC4wICYmIGRpc3QgPiByYWRpdXMpIHsgLy8gcmFkaXVzIDwgMCBtZWFucyBpdCdzIGluZmluaXR5XFxuICAgICAgICBkZWx0YSA9IGRpc3QgLSByYWRpdXM7XFxuICAgICAgICBnYXAgPSBncmFkaWVudDtcXG4gICAgfVxcblxcbiAgICBpZiAoZGVsdGEgPiAwLjApIHtcXG4gICAgICAgIGZsb2F0IG5vcm1hbENvdW50ID0gZ2FwIC8gZmlsdGVyQXJlYS54O1xcbiAgICAgICAgZGVsdGEgPSAobm9ybWFsQ291bnQgLSBkZWx0YSkgLyBub3JtYWxDb3VudDtcXG4gICAgICAgIGNvdW50TGltaXQgKj0gZGVsdGE7XFxuICAgICAgICBzdHJlbmd0aCAqPSBkZWx0YTtcXG4gICAgICAgIGlmIChjb3VudExpbWl0IDwgMS4wKVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgICAgICAgICAgcmV0dXJuO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIC8vIHJhbmRvbWl6ZSB0aGUgbG9va3VwIHZhbHVlcyB0byBoaWRlIHRoZSBmaXhlZCBudW1iZXIgb2Ygc2FtcGxlc1xcbiAgICBmbG9hdCBvZmZzZXQgPSByYW5kb20odmVjMygxMi45ODk4LCA3OC4yMzMsIDE1MS43MTgyKSwgMC4wKTtcXG5cXG4gICAgZmxvYXQgdG90YWwgPSAwLjA7XFxuICAgIHZlYzQgY29sb3IgPSB2ZWM0KDAuMCk7XFxuXFxuICAgIGRpciAqPSBzdHJlbmd0aDtcXG5cXG4gICAgZm9yIChmbG9hdCB0ID0gMC4wOyB0IDwgTUFYX0tFUk5FTF9TSVpFOyB0KyspIHtcXG4gICAgICAgIGZsb2F0IHBlcmNlbnQgPSAodCArIG9mZnNldCkgLyBNQVhfS0VSTkVMX1NJWkU7XFxuICAgICAgICBmbG9hdCB3ZWlnaHQgPSA0LjAgKiAocGVyY2VudCAtIHBlcmNlbnQgKiBwZXJjZW50KTtcXG4gICAgICAgIHZlYzIgcCA9IHZUZXh0dXJlQ29vcmQgKyBkaXIgKiBwZXJjZW50O1xcbiAgICAgICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHApO1xcblxcbiAgICAgICAgLy8gc3dpdGNoIHRvIHByZS1tdWx0aXBsaWVkIGFscGhhIHRvIGNvcnJlY3RseSBibHVyIHRyYW5zcGFyZW50IGltYWdlc1xcbiAgICAgICAgLy8gc2FtcGxlLnJnYiAqPSBzYW1wbGUuYTtcXG5cXG4gICAgICAgIGNvbG9yICs9IHNhbXBsZSAqIHdlaWdodDtcXG4gICAgICAgIHRvdGFsICs9IHdlaWdodDtcXG5cXG4gICAgICAgIGlmICh0ID4gY291bnRMaW1pdCl7XFxuICAgICAgICAgICAgYnJlYWs7XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gY29sb3IgLyB0b3RhbDtcXG5cXG4gICAgLy8gc3dpdGNoIGJhY2sgZnJvbSBwcmUtbXVsdGlwbGllZCBhbHBoYVxcbiAgICBnbF9GcmFnQ29sb3IucmdiIC89IGdsX0ZyYWdDb2xvci5hICsgMC4wMDAwMTtcXG5cXG59XFxuXCIscj1mdW5jdGlvbihuKXtmdW5jdGlvbiByKHIsaSxvLGEpe3ZvaWQgMD09PXImJihyPS4xKSx2b2lkIDA9PT1pJiYoaT1bMCwwXSksdm9pZCAwPT09byYmKG89MCksdm9pZCAwPT09YSYmKGE9LTEpLG4uY2FsbCh0aGlzLGUsdCksdGhpcy5jZW50ZXI9aSx0aGlzLnN0cmVuZ3RoPXIsdGhpcy5pbm5lclJhZGl1cz1vLHRoaXMucmFkaXVzPWF9biYmKHIuX19wcm90b19fPW4pLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG4mJm4ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgaT17Y2VudGVyOntjb25maWd1cmFibGU6ITB9LHN0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9LGlubmVyUmFkaXVzOntjb25maWd1cmFibGU6ITB9LHJhZGl1czp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkuY2VudGVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVDZW50ZXJ9LGkuY2VudGVyLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnVDZW50ZXI9bn0saS5zdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51U3RyZW5ndGh9LGkuc3RyZW5ndGguc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudVN0cmVuZ3RoPW59LGkuaW5uZXJSYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudUlubmVyUmFkaXVzfSxpLmlubmVyUmFkaXVzLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnVJbm5lclJhZGl1cz1ufSxpLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51UmFkaXVzfSxpLnJhZGl1cy5zZXQ9ZnVuY3Rpb24obil7KG48MHx8bj09PTEvMCkmJihuPS0xKSx0aGlzLnVuaWZvcm1zLnVSYWRpdXM9bn0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsaSkscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5ab29tQmx1ckZpbHRlcj1yLG4uWm9vbUJsdXJGaWx0ZXI9cixPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXpvb20tYmx1ci5qcy5tYXBcbiIsIi8qIVxuICogcGl4aS1maWx0ZXJzIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIHBpeGktZmlsdGVycyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cblwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBmaWx0ZXJBZHZhbmNlZEJsb29tPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItYWR2YW5jZWQtYmxvb21cIiksZmlsdGVyQXNjaWk9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1hc2NpaVwiKSxmaWx0ZXJCbG9vbT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWJsb29tXCIpLGZpbHRlckJ1bGdlUGluY2g9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1idWxnZS1waW5jaFwiKSxmaWx0ZXJDb2xvclJlcGxhY2U9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1jb2xvci1yZXBsYWNlXCIpLGZpbHRlckNvbnZvbHV0aW9uPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItY29udm9sdXRpb25cIiksZmlsdGVyQ3Jvc3NIYXRjaD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWNyb3NzLWhhdGNoXCIpLGZpbHRlckRvdD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWRvdFwiKSxmaWx0ZXJEcm9wU2hhZG93PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItZHJvcC1zaGFkb3dcIiksZmlsdGVyRW1ib3NzPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItZW1ib3NzXCIpLGZpbHRlckdsb3c9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1nbG93XCIpLGZpbHRlckdvZHJheT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWdvZHJheVwiKSxmaWx0ZXJNb3Rpb25CbHVyPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItbW90aW9uLWJsdXJcIiksZmlsdGVyTXVsdGlDb2xvclJlcGxhY2U9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1tdWx0aS1jb2xvci1yZXBsYWNlXCIpLGZpbHRlck9sZEZpbG09cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1vbGQtZmlsbVwiKSxmaWx0ZXJPdXRsaW5lPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItb3V0bGluZVwiKSxmaWx0ZXJQaXhlbGF0ZT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXBpeGVsYXRlXCIpLGZpbHRlclJnYlNwbGl0PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItcmdiLXNwbGl0XCIpLGZpbHRlclJhZGlhbEJsdXI9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1yYWRpYWwtYmx1clwiKSxmaWx0ZXJTaG9ja3dhdmU9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1zaG9ja3dhdmVcIiksZmlsdGVyU2ltcGxlTGlnaHRtYXA9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1zaW1wbGUtbGlnaHRtYXBcIiksZmlsdGVyVGlsdFNoaWZ0PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItdGlsdC1zaGlmdFwiKSxmaWx0ZXJUd2lzdD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXR3aXN0XCIpLGZpbHRlclpvb21CbHVyPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItem9vbS1ibHVyXCIpO2V4cG9ydHMuQWR2YW5jZWRCbG9vbUZpbHRlcj1maWx0ZXJBZHZhbmNlZEJsb29tLkFkdmFuY2VkQmxvb21GaWx0ZXIsZXhwb3J0cy5Bc2NpaUZpbHRlcj1maWx0ZXJBc2NpaS5Bc2NpaUZpbHRlcixleHBvcnRzLkJsb29tRmlsdGVyPWZpbHRlckJsb29tLkJsb29tRmlsdGVyLGV4cG9ydHMuQnVsZ2VQaW5jaEZpbHRlcj1maWx0ZXJCdWxnZVBpbmNoLkJ1bGdlUGluY2hGaWx0ZXIsZXhwb3J0cy5Db2xvclJlcGxhY2VGaWx0ZXI9ZmlsdGVyQ29sb3JSZXBsYWNlLkNvbG9yUmVwbGFjZUZpbHRlcixleHBvcnRzLkNvbnZvbHV0aW9uRmlsdGVyPWZpbHRlckNvbnZvbHV0aW9uLkNvbnZvbHV0aW9uRmlsdGVyLGV4cG9ydHMuQ3Jvc3NIYXRjaEZpbHRlcj1maWx0ZXJDcm9zc0hhdGNoLkNyb3NzSGF0Y2hGaWx0ZXIsZXhwb3J0cy5Eb3RGaWx0ZXI9ZmlsdGVyRG90LkRvdEZpbHRlcixleHBvcnRzLkRyb3BTaGFkb3dGaWx0ZXI9ZmlsdGVyRHJvcFNoYWRvdy5Ecm9wU2hhZG93RmlsdGVyLGV4cG9ydHMuRW1ib3NzRmlsdGVyPWZpbHRlckVtYm9zcy5FbWJvc3NGaWx0ZXIsZXhwb3J0cy5HbG93RmlsdGVyPWZpbHRlckdsb3cuR2xvd0ZpbHRlcixleHBvcnRzLkdvZHJheUZpbHRlcj1maWx0ZXJHb2RyYXkuR29kcmF5RmlsdGVyLGV4cG9ydHMuTW90aW9uQmx1ckZpbHRlcj1maWx0ZXJNb3Rpb25CbHVyLk1vdGlvbkJsdXJGaWx0ZXIsZXhwb3J0cy5NdWx0aUNvbG9yUmVwbGFjZUZpbHRlcj1maWx0ZXJNdWx0aUNvbG9yUmVwbGFjZS5NdWx0aUNvbG9yUmVwbGFjZUZpbHRlcixleHBvcnRzLk9sZEZpbG1GaWx0ZXI9ZmlsdGVyT2xkRmlsbS5PbGRGaWxtRmlsdGVyLGV4cG9ydHMuT3V0bGluZUZpbHRlcj1maWx0ZXJPdXRsaW5lLk91dGxpbmVGaWx0ZXIsZXhwb3J0cy5QaXhlbGF0ZUZpbHRlcj1maWx0ZXJQaXhlbGF0ZS5QaXhlbGF0ZUZpbHRlcixleHBvcnRzLlJHQlNwbGl0RmlsdGVyPWZpbHRlclJnYlNwbGl0LlJHQlNwbGl0RmlsdGVyLGV4cG9ydHMuUmFkaWFsQmx1ckZpbHRlcj1maWx0ZXJSYWRpYWxCbHVyLlJhZGlhbEJsdXJGaWx0ZXIsZXhwb3J0cy5TaG9ja3dhdmVGaWx0ZXI9ZmlsdGVyU2hvY2t3YXZlLlNob2Nrd2F2ZUZpbHRlcixleHBvcnRzLlNpbXBsZUxpZ2h0bWFwRmlsdGVyPWZpbHRlclNpbXBsZUxpZ2h0bWFwLlNpbXBsZUxpZ2h0bWFwRmlsdGVyLGV4cG9ydHMuVGlsdFNoaWZ0RmlsdGVyPWZpbHRlclRpbHRTaGlmdC5UaWx0U2hpZnRGaWx0ZXIsZXhwb3J0cy5UaWx0U2hpZnRBeGlzRmlsdGVyPWZpbHRlclRpbHRTaGlmdC5UaWx0U2hpZnRBeGlzRmlsdGVyLGV4cG9ydHMuVGlsdFNoaWZ0WEZpbHRlcj1maWx0ZXJUaWx0U2hpZnQuVGlsdFNoaWZ0WEZpbHRlcixleHBvcnRzLlRpbHRTaGlmdFlGaWx0ZXI9ZmlsdGVyVGlsdFNoaWZ0LlRpbHRTaGlmdFlGaWx0ZXIsZXhwb3J0cy5Ud2lzdEZpbHRlcj1maWx0ZXJUd2lzdC5Ud2lzdEZpbHRlcixleHBvcnRzLlpvb21CbHVyRmlsdGVyPWZpbHRlclpvb21CbHVyLlpvb21CbHVyRmlsdGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS1maWx0ZXJzLmpzLm1hcFxuIiwidmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB1dGlscztcclxuICAgIChmdW5jdGlvbiAodXRpbHMpIHtcclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVJbmRpY2VzRm9yUXVhZHMoc2l6ZSkge1xyXG4gICAgICAgICAgICB2YXIgdG90YWxJbmRpY2VzID0gc2l6ZSAqIDY7XHJcbiAgICAgICAgICAgIHZhciBpbmRpY2VzID0gbmV3IFVpbnQxNkFycmF5KHRvdGFsSW5kaWNlcyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IHRvdGFsSW5kaWNlczsgaSArPSA2LCBqICs9IDQpIHtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDBdID0gaiArIDA7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAxXSA9IGogKyAxO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgMl0gPSBqICsgMjtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDNdID0gaiArIDA7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyA0XSA9IGogKyAyO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgNV0gPSBqICsgMztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5kaWNlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuY3JlYXRlSW5kaWNlc0ZvclF1YWRzID0gY3JlYXRlSW5kaWNlc0ZvclF1YWRzO1xyXG4gICAgICAgIGZ1bmN0aW9uIGlzUG93Mih2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhKHYgJiAodiAtIDEpKSAmJiAoISF2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuaXNQb3cyID0gaXNQb3cyO1xyXG4gICAgICAgIGZ1bmN0aW9uIG5leHRQb3cyKHYpIHtcclxuICAgICAgICAgICAgdiArPSArKHYgPT09IDApO1xyXG4gICAgICAgICAgICAtLXY7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gMTtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiAyO1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDQ7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gODtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiAxNjtcclxuICAgICAgICAgICAgcmV0dXJuIHYgKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5uZXh0UG93MiA9IG5leHRQb3cyO1xyXG4gICAgICAgIGZ1bmN0aW9uIGxvZzIodikge1xyXG4gICAgICAgICAgICB2YXIgciwgc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgPSArKHYgPiAweEZGRkYpIDw8IDQ7XHJcbiAgICAgICAgICAgIHYgPj4+PSByO1xyXG4gICAgICAgICAgICBzaGlmdCA9ICsodiA+IDB4RkYpIDw8IDM7XHJcbiAgICAgICAgICAgIHYgPj4+PSBzaGlmdDtcclxuICAgICAgICAgICAgciB8PSBzaGlmdDtcclxuICAgICAgICAgICAgc2hpZnQgPSArKHYgPiAweEYpIDw8IDI7XHJcbiAgICAgICAgICAgIHYgPj4+PSBzaGlmdDtcclxuICAgICAgICAgICAgciB8PSBzaGlmdDtcclxuICAgICAgICAgICAgc2hpZnQgPSArKHYgPiAweDMpIDw8IDE7XHJcbiAgICAgICAgICAgIHYgPj4+PSBzaGlmdDtcclxuICAgICAgICAgICAgciB8PSBzaGlmdDtcclxuICAgICAgICAgICAgcmV0dXJuIHIgfCAodiA+PiAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMubG9nMiA9IGxvZzI7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0SW50ZXJzZWN0aW9uRmFjdG9yKHAxLCBwMiwgcDMsIHA0LCBvdXQpIHtcclxuICAgICAgICAgICAgdmFyIEExID0gcDIueCAtIHAxLngsIEIxID0gcDMueCAtIHA0LngsIEMxID0gcDMueCAtIHAxLng7XHJcbiAgICAgICAgICAgIHZhciBBMiA9IHAyLnkgLSBwMS55LCBCMiA9IHAzLnkgLSBwNC55LCBDMiA9IHAzLnkgLSBwMS55O1xyXG4gICAgICAgICAgICB2YXIgRCA9IEExICogQjIgLSBBMiAqIEIxO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoRCkgPCAxZS03KSB7XHJcbiAgICAgICAgICAgICAgICBvdXQueCA9IEExO1xyXG4gICAgICAgICAgICAgICAgb3V0LnkgPSBBMjtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBUID0gQzEgKiBCMiAtIEMyICogQjE7XHJcbiAgICAgICAgICAgIHZhciBVID0gQTEgKiBDMiAtIEEyICogQzE7XHJcbiAgICAgICAgICAgIHZhciB0ID0gVCAvIEQsIHUgPSBVIC8gRDtcclxuICAgICAgICAgICAgaWYgKHUgPCAoMWUtNikgfHwgdSAtIDEgPiAtMWUtNikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dC54ID0gcDEueCArIHQgKiAocDIueCAtIHAxLngpO1xyXG4gICAgICAgICAgICBvdXQueSA9IHAxLnkgKyB0ICogKHAyLnkgLSBwMS55KTtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmdldEludGVyc2VjdGlvbkZhY3RvciA9IGdldEludGVyc2VjdGlvbkZhY3RvcjtcclxuICAgICAgICBmdW5jdGlvbiBnZXRQb3NpdGlvbkZyb21RdWFkKHAsIGFuY2hvciwgb3V0KSB7XHJcbiAgICAgICAgICAgIG91dCA9IG91dCB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYTEgPSAxLjAgLSBhbmNob3IueCwgYTIgPSAxLjAgLSBhMTtcclxuICAgICAgICAgICAgdmFyIGIxID0gMS4wIC0gYW5jaG9yLnksIGIyID0gMS4wIC0gYjE7XHJcbiAgICAgICAgICAgIG91dC54ID0gKHBbMF0ueCAqIGExICsgcFsxXS54ICogYTIpICogYjEgKyAocFszXS54ICogYTEgKyBwWzJdLnggKiBhMikgKiBiMjtcclxuICAgICAgICAgICAgb3V0LnkgPSAocFswXS55ICogYTEgKyBwWzFdLnkgKiBhMikgKiBiMSArIChwWzNdLnkgKiBhMSArIHBbMl0ueSAqIGEyKSAqIGIyO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5nZXRQb3NpdGlvbkZyb21RdWFkID0gZ2V0UG9zaXRpb25Gcm9tUXVhZDtcclxuICAgIH0pKHV0aWxzID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzIHx8IChwaXhpX3Byb2plY3Rpb24udXRpbHMgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcblBJWEkucHJvamVjdGlvbiA9IHBpeGlfcHJvamVjdGlvbjtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBQcm9qZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uKGxlZ2FjeSwgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIGlmIChlbmFibGUgPT09IHZvaWQgMCkgeyBlbmFibGUgPSB0cnVlOyB9XHJcbiAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sZWdhY3kgPSBsZWdhY3k7XHJcbiAgICAgICAgICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5sZWdhY3kucHJvaiA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uLnByb3RvdHlwZSwgXCJlbmFibGVkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUHJvamVjdGlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvbjtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbiA9IFByb2plY3Rpb247XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB3ZWJnbDtcclxuICAgIChmdW5jdGlvbiAod2ViZ2wpIHtcclxuICAgICAgICB2YXIgQmF0Y2hCdWZmZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBCYXRjaEJ1ZmZlcihzaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzID0gbmV3IEFycmF5QnVmZmVyKHNpemUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG9hdDMyVmlldyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkodGhpcy52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQmF0Y2hCdWZmZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzID0gbnVsbDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIEJhdGNoQnVmZmVyO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgd2ViZ2wuQmF0Y2hCdWZmZXIgPSBCYXRjaEJ1ZmZlcjtcclxuICAgIH0pKHdlYmdsID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsIHx8IChwaXhpX3Byb2plY3Rpb24ud2ViZ2wgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgd2ViZ2w7XHJcbiAgICAoZnVuY3Rpb24gKHdlYmdsKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXIodmVydGV4U3JjLCBmcmFnbWVudFNyYywgZ2wsIG1heFRleHR1cmVzKSB7XHJcbiAgICAgICAgICAgIGZyYWdtZW50U3JjID0gZnJhZ21lbnRTcmMucmVwbGFjZSgvJWNvdW50JS9naSwgbWF4VGV4dHVyZXMgKyAnJyk7XHJcbiAgICAgICAgICAgIGZyYWdtZW50U3JjID0gZnJhZ21lbnRTcmMucmVwbGFjZSgvJWZvcmxvb3AlL2dpLCBnZW5lcmF0ZVNhbXBsZVNyYyhtYXhUZXh0dXJlcykpO1xyXG4gICAgICAgICAgICB2YXIgc2hhZGVyID0gbmV3IFBJWEkuU2hhZGVyKGdsLCB2ZXJ0ZXhTcmMsIGZyYWdtZW50U3JjKTtcclxuICAgICAgICAgICAgdmFyIHNhbXBsZVZhbHVlcyA9IG5ldyBJbnQzMkFycmF5KG1heFRleHR1cmVzKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhUZXh0dXJlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBzYW1wbGVWYWx1ZXNbaV0gPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNoYWRlci5iaW5kKCk7XHJcbiAgICAgICAgICAgIHNoYWRlci51bmlmb3Jtcy51U2FtcGxlcnMgPSBzYW1wbGVWYWx1ZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdlYmdsLmdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyID0gZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXI7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTYW1wbGVTcmMobWF4VGV4dHVyZXMpIHtcclxuICAgICAgICAgICAgdmFyIHNyYyA9ICcnO1xyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhUZXh0dXJlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzcmMgKz0gJ1xcbmVsc2UgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpIDwgbWF4VGV4dHVyZXMgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjICs9IFwiaWYodGV4dHVyZUlkID09IFwiICsgaSArIFwiLjApXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzcmMgKz0gJ1xcbnsnO1xyXG4gICAgICAgICAgICAgICAgc3JjICs9IFwiXFxuXFx0Y29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXJzW1wiICsgaSArIFwiXSwgdGV4dHVyZUNvb3JkKTtcIjtcclxuICAgICAgICAgICAgICAgIHNyYyArPSAnXFxufSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIHJldHVybiBzcmM7XHJcbiAgICAgICAgfVxyXG4gICAgfSkod2ViZ2wgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wgfHwgKHBpeGlfcHJvamVjdGlvbi53ZWJnbCA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgd2ViZ2w7XHJcbiAgICAoZnVuY3Rpb24gKHdlYmdsKSB7XHJcbiAgICAgICAgdmFyIE9iamVjdFJlbmRlcmVyID0gUElYSS5PYmplY3RSZW5kZXJlcjtcclxuICAgICAgICB2YXIgc2V0dGluZ3MgPSBQSVhJLnNldHRpbmdzO1xyXG4gICAgICAgIHZhciBHTEJ1ZmZlciA9IFBJWEkuZ2xDb3JlLkdMQnVmZmVyO1xyXG4gICAgICAgIHZhciBwcmVtdWx0aXBseVRpbnQgPSBQSVhJLnV0aWxzLnByZW11bHRpcGx5VGludDtcclxuICAgICAgICB2YXIgcHJlbXVsdGlwbHlCbGVuZE1vZGUgPSBQSVhJLnV0aWxzLnByZW11bHRpcGx5QmxlbmRNb2RlO1xyXG4gICAgICAgIHZhciBUSUNLID0gMDtcclxuICAgICAgICB2YXIgQmF0Y2hHcm91cCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEJhdGNoR3JvdXAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlkcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaXplID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibGVuZCA9IFBJWEkuQkxFTkRfTU9ERVMuTk9STUFMO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51bmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhdGNoR3JvdXA7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICB3ZWJnbC5CYXRjaEdyb3VwID0gQmF0Y2hHcm91cDtcclxuICAgICAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICBfX2V4dGVuZHMoTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKHJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCByZW5kZXJlcikgfHwgdGhpcztcclxuICAgICAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSAnJztcclxuICAgICAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSAnJztcclxuICAgICAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFU19MT0NBTCA9IDMyO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydFNpemUgPSA1O1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydEJ5dGVTaXplID0gX3RoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2l6ZSA9IHNldHRpbmdzLlNQUklURV9CQVRDSF9TSVpFO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuY3VycmVudEluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNwcml0ZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRleEJ1ZmZlcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZhb3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZhb01heCA9IDI7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0ZXhDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVMgPSAxO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuaW5kaWNlcyA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5jcmVhdGVJbmRpY2VzRm9yUXVhZHMoX3RoaXMuc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ncm91cHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgX3RoaXMuc2l6ZTsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZ3JvdXBzW2tdID0gbmV3IEJhdGNoR3JvdXAoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF90aGlzLnZhb01heCA9IDI7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0ZXhDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW5kZXJlci5vbigncHJlcmVuZGVyJywgX3RoaXMub25QcmVyZW5kZXIsIF90aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuZ2V0VW5pZm9ybXMgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnN5bmNVbmlmb3JtcyA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmICghb2JqKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHZhciBzaCA9IHRoaXMuc2hhZGVyO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoLnVuaWZvcm1zW2tleV0gPSBvYmpba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLm9uQ29udGV4dENoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk1BWF9URVhUVVJFUyA9IE1hdGgubWluKHRoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMLCB0aGlzLnJlbmRlcmVyLnBsdWdpbnNbJ3Nwcml0ZSddLk1BWF9URVhUVVJFUyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoYWRlciA9IHdlYmdsLmdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyKHRoaXMuc2hhZGVyVmVydCwgdGhpcy5zaGFkZXJGcmFnLCBnbCwgdGhpcy5NQVhfVEVYVFVSRVMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IEdMQnVmZmVyLmNyZWF0ZUluZGV4QnVmZmVyKGdsLCB0aGlzLmluZGljZXMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFZhbyhudWxsKTtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmFvTWF4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmVydGV4QnVmZmVyID0gdGhpcy52ZXJ0ZXhCdWZmZXJzW2ldID0gR0xCdWZmZXIuY3JlYXRlVmVydGV4QnVmZmVyKGdsLCBudWxsLCBnbC5TVFJFQU1fRFJBVyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9zW2ldID0gdGhpcy5jcmVhdGVWYW8odmVydGV4QnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5idWZmZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLm5leHRQb3cyKHRoaXMuc2l6ZSk7IGkgKj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcnMucHVzaChuZXcgd2ViZ2wuQmF0Y2hCdWZmZXIoaSAqIDQgKiB0aGlzLnZlcnRCeXRlU2l6ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudmFvID0gdGhpcy52YW9zWzBdO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUub25QcmVyZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbmRleCA+PSB0aGlzLnNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsdXNoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNwcml0ZS5fdGV4dHVyZS5fdXZzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFzcHJpdGUuX3RleHR1cmUuYmFzZVRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZXNbdGhpcy5jdXJyZW50SW5kZXgrK10gPSBzcHJpdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5mbHVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgICAgICB2YXIgTUFYX1RFWFRVUkVTID0gdGhpcy5NQVhfVEVYVFVSRVM7XHJcbiAgICAgICAgICAgICAgICB2YXIgbnAyID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLm5leHRQb3cyKHRoaXMuY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgICAgIHZhciBsb2cyID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLmxvZzIobnAyKTtcclxuICAgICAgICAgICAgICAgIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlcnNbbG9nMl07XHJcbiAgICAgICAgICAgICAgICB2YXIgc3ByaXRlcyA9IHRoaXMuc3ByaXRlcztcclxuICAgICAgICAgICAgICAgIHZhciBncm91cHMgPSB0aGlzLmdyb3VwcztcclxuICAgICAgICAgICAgICAgIHZhciBmbG9hdDMyVmlldyA9IGJ1ZmZlci5mbG9hdDMyVmlldztcclxuICAgICAgICAgICAgICAgIHZhciB1aW50MzJWaWV3ID0gYnVmZmVyLnVpbnQzMlZpZXc7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRVbmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBDb3VudCA9IDE7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50R3JvdXAgPSBncm91cHNbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdmVydGV4RGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciB1dnM7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmxlbmRNb2RlID0gcHJlbXVsdGlwbHlCbGVuZE1vZGVbc3ByaXRlc1swXS5fdGV4dHVyZS5iYXNlVGV4dHVyZS5wcmVtdWx0aXBsaWVkQWxwaGEgPyAxIDogMF1bc3ByaXRlc1swXS5ibGVuZE1vZGVdO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc3RhcnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmJsZW5kID0gYmxlbmRNb2RlO1xyXG4gICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5jdXJyZW50SW5kZXg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcHJpdGUgPSBzcHJpdGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRUZXh0dXJlID0gc3ByaXRlLl90ZXh0dXJlLmJhc2VUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcHJpdGVCbGVuZE1vZGUgPSBwcmVtdWx0aXBseUJsZW5kTW9kZVtOdW1iZXIobmV4dFRleHR1cmUucHJlbXVsdGlwbGllZEFscGhhKV1bc3ByaXRlLmJsZW5kTW9kZV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsZW5kTW9kZSAhPT0gc3ByaXRlQmxlbmRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZSA9IHNwcml0ZUJsZW5kTW9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQgPSBNQVhfVEVYVFVSRVM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVuaWZvcm1zID0gdGhpcy5nZXRVbmlmb3JtcyhzcHJpdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VW5pZm9ybXMgIT09IHVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVbmlmb3JtcyA9IHVuaWZvcm1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCA9IE1BWF9URVhUVVJFUztcclxuICAgICAgICAgICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRleHR1cmUgIT09IG5leHRUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUZXh0dXJlID0gbmV4dFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0VGV4dHVyZS5fZW5hYmxlZCAhPT0gVElDSykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHR1cmVDb3VudCA9PT0gTUFYX1RFWFRVUkVTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnNpemUgPSBpIC0gY3VycmVudEdyb3VwLnN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cCA9IGdyb3Vwc1tncm91cENvdW50KytdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC50ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5ibGVuZCA9IGJsZW5kTW9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc3RhcnQgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC51bmlmb3JtcyA9IGN1cnJlbnRVbmlmb3JtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRUZXh0dXJlLl9lbmFibGVkID0gVElDSztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRUZXh0dXJlLl92aXJ0YWxCb3VuZElkID0gdGV4dHVyZUNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnRleHR1cmVzW2N1cnJlbnRHcm91cC50ZXh0dXJlQ291bnQrK10gPSBuZXh0VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbHBoYSA9IE1hdGgubWluKHNwcml0ZS53b3JsZEFscGhhLCAxLjApO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdiID0gYWxwaGEgPCAxLjAgJiYgbmV4dFRleHR1cmUucHJlbXVsdGlwbGllZEFscGhhID8gcHJlbXVsdGlwbHlUaW50KHNwcml0ZS5fdGludFJHQiwgYWxwaGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogc3ByaXRlLl90aW50UkdCICsgKGFscGhhICogMjU1IDw8IDI0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGxWZXJ0aWNlcyhmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgbmV4dFRleHR1cmUuX3ZpcnRhbEJvdW5kSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ICs9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnNpemUgPSBpIC0gY3VycmVudEdyb3VwLnN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzZXR0aW5ncy5DQU5fVVBMT0FEX1NBTUVfQlVGRkVSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFvTWF4IDw9IHRoaXMudmVydGV4Q291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9NYXgrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZlcnRleEJ1ZmZlciA9IHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XSA9IEdMQnVmZmVyLmNyZWF0ZVZlcnRleEJ1ZmZlcihnbCwgbnVsbCwgZ2wuU1RSRUFNX0RSQVcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb3NbdGhpcy52ZXJ0ZXhDb3VudF0gPSB0aGlzLmNyZWF0ZVZhbyh2ZXJ0ZXhCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRWYW8odGhpcy52YW9zW3RoaXMudmVydGV4Q291bnRdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0udXBsb2FkKGJ1ZmZlci52ZXJ0aWNlcywgMCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4Q291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XS51cGxvYWQoYnVmZmVyLnZlcnRpY2VzLCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRVbmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBncm91cFRleHR1cmVDb3VudCA9IGdyb3VwLnRleHR1cmVDb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXAudW5pZm9ybXMgIT09IGN1cnJlbnRVbmlmb3Jtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN5bmNVbmlmb3Jtcyhncm91cC51bmlmb3Jtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZ3JvdXBUZXh0dXJlQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRUZXh0dXJlKGdyb3VwLnRleHR1cmVzW2pdLCBqLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAudGV4dHVyZXNbal0uX3ZpcnRhbEJvdW5kSWQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSB0aGlzLnNoYWRlci51bmlmb3Jtcy5zYW1wbGVyU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZbMF0gPSBncm91cC50ZXh0dXJlc1tqXS5yZWFsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2WzFdID0gZ3JvdXAudGV4dHVyZXNbal0ucmVhbEhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyLnVuaWZvcm1zLnNhbXBsZXJTaXplID0gdjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnN0YXRlLnNldEJsZW5kTW9kZShncm91cC5ibGVuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKGdsLlRSSUFOR0xFUywgZ3JvdXAuc2l6ZSAqIDYsIGdsLlVOU0lHTkVEX1NIT1JULCBncm91cC5zdGFydCAqIDYgKiAyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gMDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kU2hhZGVyKHRoaXMuc2hhZGVyKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5DQU5fVVBMT0FEX1NBTUVfQlVGRkVSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVmFvKHRoaXMudmFvc1t0aGlzLnZlcnRleENvdW50XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdLmJpbmQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZhb01heDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGV4QnVmZmVyc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YW9zW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFvc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIub2ZmKCdwcmVyZW5kZXInLCB0aGlzLm9uUHJlcmVuZGVyLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhb3MgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGljZXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idWZmZXJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgICAgIH0oT2JqZWN0UmVuZGVyZXIpKTtcclxuICAgICAgICB3ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgfSkod2ViZ2wgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wgfHwgKHBpeGlfcHJvamVjdGlvbi53ZWJnbCA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBwID0gW25ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCldO1xyXG4gICAgdmFyIGEgPSBbMCwgMCwgMCwgMF07XHJcbiAgICB2YXIgU3VyZmFjZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gU3VyZmFjZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJmYWNlSUQgPSBcImRlZmF1bHRcIjtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSUQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRleFNyYyA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhZ21lbnRTcmMgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTdXJmYWNlLnByb3RvdHlwZS5maWxsVW5pZm9ybXMgPSBmdW5jdGlvbiAodW5pZm9ybXMpIHtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3VyZmFjZS5wcm90b3R5cGUuYm91bmRzUXVhZCA9IGZ1bmN0aW9uICh2LCBvdXQsIGFmdGVyKSB7XHJcbiAgICAgICAgICAgIHZhciBtaW5YID0gb3V0WzBdLCBtaW5ZID0gb3V0WzFdO1xyXG4gICAgICAgICAgICB2YXIgbWF4WCA9IG91dFswXSwgbWF4WSA9IG91dFsxXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDI7IGkgPCA4OyBpICs9IDIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtaW5YID4gb3V0W2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIG1pblggPSBvdXRbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4WCA8IG91dFtpXSlcclxuICAgICAgICAgICAgICAgICAgICBtYXhYID0gb3V0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pblkgPiBvdXRbaSArIDFdKVxyXG4gICAgICAgICAgICAgICAgICAgIG1pblkgPSBvdXRbaSArIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1heFkgPCBvdXRbaSArIDFdKVxyXG4gICAgICAgICAgICAgICAgICAgIG1heFkgPSBvdXRbaSArIDFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBbMF0uc2V0KG1pblgsIG1pblkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbMF0sIHBbMF0pO1xyXG4gICAgICAgICAgICBwWzFdLnNldChtYXhYLCBtaW5ZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzFdLCBwWzFdKTtcclxuICAgICAgICAgICAgcFsyXS5zZXQobWF4WCwgbWF4WSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFsyXSwgcFsyXSk7XHJcbiAgICAgICAgICAgIHBbM10uc2V0KG1pblgsIG1heFkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbM10sIHBbM10pO1xyXG4gICAgICAgICAgICBpZiAoYWZ0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbMF0sIHBbMF0pO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFsxXSwgcFsxXSk7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzJdLCBwWzJdKTtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbM10sIHBbM10pO1xyXG4gICAgICAgICAgICAgICAgb3V0WzBdID0gcFswXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzFdID0gcFswXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzJdID0gcFsxXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzNdID0gcFsxXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzRdID0gcFsyXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzVdID0gcFsyXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzZdID0gcFszXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzddID0gcFszXS55O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBbaV0ueSA8IHBbMF0ueSB8fCBwW2ldLnkgPT0gcFswXS55ICYmIHBbaV0ueCA8IHBbMF0ueCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IHBbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBbMF0gPSBwW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwW2ldID0gdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhW2ldID0gTWF0aC5hdGFuMihwW2ldLnkgLSBwWzBdLnksIHBbaV0ueCAtIHBbMF0ueCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gaSArIDE7IGogPD0gMzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhW2ldID4gYVtqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBwW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFtpXSA9IHBbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwW2pdID0gdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0MiA9IGFbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhW2ldID0gYVtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFbal0gPSB0MjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dFswXSA9IHBbMF0ueDtcclxuICAgICAgICAgICAgICAgIG91dFsxXSA9IHBbMF0ueTtcclxuICAgICAgICAgICAgICAgIG91dFsyXSA9IHBbMV0ueDtcclxuICAgICAgICAgICAgICAgIG91dFszXSA9IHBbMV0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs0XSA9IHBbMl0ueDtcclxuICAgICAgICAgICAgICAgIG91dFs1XSA9IHBbMl0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs2XSA9IHBbM10ueDtcclxuICAgICAgICAgICAgICAgIG91dFs3XSA9IHBbM10ueTtcclxuICAgICAgICAgICAgICAgIGlmICgocFszXS54IC0gcFsyXS54KSAqIChwWzFdLnkgLSBwWzJdLnkpIC0gKHBbMV0ueCAtIHBbMl0ueCkgKiAocFszXS55IC0gcFsyXS55KSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRbNF0gPSBwWzNdLng7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0WzVdID0gcFszXS55O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFN1cmZhY2U7XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlN1cmZhY2UgPSBTdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgdmFyIHRlbXBSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKCk7XHJcbiAgICB2YXIgdGVtcFBvaW50ID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgIHZhciBCaWxpbmVhclN1cmZhY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhCaWxpbmVhclN1cmZhY2UsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gQmlsaW5lYXJTdXJmYWNlKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5kaXN0b3J0aW9uID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3RvcnRpb24uc2V0KDAsIDApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGQgPSB0aGlzLmRpc3RvcnRpb247XHJcbiAgICAgICAgICAgIHZhciBtID0gcG9zLnggKiBwb3MueTtcclxuICAgICAgICAgICAgbmV3UG9zLnggPSBwb3MueCArIGQueCAqIG07XHJcbiAgICAgICAgICAgIG5ld1Bvcy55ID0gcG9zLnkgKyBkLnkgKiBtO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciB2eCA9IHBvcy54LCB2eSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgZHggPSB0aGlzLmRpc3RvcnRpb24ueCwgZHkgPSB0aGlzLmRpc3RvcnRpb24ueTtcclxuICAgICAgICAgICAgaWYgKGR4ID09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB2eDtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdnkgLyAoMS4wICsgZHkgKiB2eCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZHkgPT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHZ5O1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB2eCAvICgxLjAgKyBkeCAqIHZ5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gKHZ5ICogZHggLSB2eCAqIGR5ICsgMS4wKSAqIDAuNSAvIGR5O1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBiICogYiArIHZ4IC8gZHk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZCA8PSAwLjAwMDAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnNldChOYU4sIE5hTik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGR5ID4gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnggPSAtYiArIE1hdGguc3FydChkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gLWIgLSBNYXRoLnNxcnQoZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9ICh2eCAvIG5ld1Bvcy54IC0gMS4wKSAvIGR4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLm1hcFNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSAtc3ByaXRlLmFuY2hvci54ICogdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnkgPSAtc3ByaXRlLmFuY2hvci55ICogdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC53aWR0aCA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcFF1YWQodGVtcFJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSB8fCBzcHJpdGUudHJhbnNmb3JtKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUubWFwUXVhZCA9IGZ1bmN0aW9uIChyZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIGF4ID0gLXJlY3QueCAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheSA9IC1yZWN0LnkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4MiA9ICgxLjAgLSByZWN0LngpIC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5MiA9ICgxLjAgLSByZWN0LnkpIC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciB1cDF4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDF5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDJ4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheDIpICsgcXVhZFsxXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHVwMnkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgeDAwID0gdXAxeCAqICgxLjAgLSBheSkgKyBkb3duMXggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkwMCA9IHVwMXkgKiAoMS4wIC0gYXkpICsgZG93bjF5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MTAgPSB1cDJ4ICogKDEuMCAtIGF5KSArIGRvd24yeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTEwID0gdXAyeSAqICgxLjAgLSBheSkgKyBkb3duMnkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgwMSA9IHVwMXggKiAoMS4wIC0gYXkyKSArIGRvd24xeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkwMSA9IHVwMXkgKiAoMS4wIC0gYXkyKSArIGRvd24xeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHgxMSA9IHVwMnggKiAoMS4wIC0gYXkyKSArIGRvd24yeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkxMSA9IHVwMnkgKiAoMS4wIC0gYXkyKSArIGRvd24yeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIG1hdCA9IHRlbXBNYXQ7XHJcbiAgICAgICAgICAgIG1hdC50eCA9IHgwMDtcclxuICAgICAgICAgICAgbWF0LnR5ID0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYSA9IHgxMCAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmIgPSB5MTAgLSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5jID0geDAxIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuZCA9IHkwMSAtIHkwMDtcclxuICAgICAgICAgICAgdGVtcFBvaW50LnNldCh4MTEsIHkxMSk7XHJcbiAgICAgICAgICAgIG1hdC5hcHBseUludmVyc2UodGVtcFBvaW50LCB0ZW1wUG9pbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3RvcnRpb24uc2V0KHRlbXBQb2ludC54IC0gMSwgdGVtcFBvaW50LnkgLSAxKTtcclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNldEZyb21NYXRyaXgobWF0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmZpbGxVbmlmb3JtcyA9IGZ1bmN0aW9uICh1bmlmb3Jtcykge1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uID0gdW5pZm9ybXMuZGlzdG9ydGlvbiB8fCBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAwXSk7XHJcbiAgICAgICAgICAgIHZhciBheCA9IE1hdGguYWJzKHRoaXMuZGlzdG9ydGlvbi54KTtcclxuICAgICAgICAgICAgdmFyIGF5ID0gTWF0aC5hYnModGhpcy5kaXN0b3J0aW9uLnkpO1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzBdID0gYXggKiAxMDAwMCA8PSBheSA/IDAgOiB0aGlzLmRpc3RvcnRpb24ueDtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblsxXSA9IGF5ICogMTAwMDAgPD0gYXggPyAwIDogdGhpcy5kaXN0b3J0aW9uLnk7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bMl0gPSAxLjAgLyB1bmlmb3Jtcy5kaXN0b3J0aW9uWzBdO1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzNdID0gMS4wIC8gdW5pZm9ybXMuZGlzdG9ydGlvblsxXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBCaWxpbmVhclN1cmZhY2U7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5TdXJmYWNlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uQmlsaW5lYXJTdXJmYWNlID0gQmlsaW5lYXJTdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgQ29udGFpbmVyMnMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhDb250YWluZXIycywgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBDb250YWluZXIycygpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29udGFpbmVyMnMucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gQ29udGFpbmVyMnM7XHJcbiAgICB9KFBJWEkuQ29udGFpbmVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uQ29udGFpbmVyMnMgPSBDb250YWluZXIycztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIGZ1biA9IFBJWEkuVHJhbnNmb3JtU3RhdGljLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1IYWNrKHBhcmVudFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZhciBwcm9qID0gdGhpcy5wcm9qO1xyXG4gICAgICAgIHZhciBwcCA9IHBhcmVudFRyYW5zZm9ybS5wcm9qO1xyXG4gICAgICAgIHZhciB0YSA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCFwcCkge1xyXG4gICAgICAgICAgICBmdW4uY2FsbCh0aGlzLCBwYXJlbnRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocHAuX3N1cmZhY2UpIHtcclxuICAgICAgICAgICAgcHJvai5fYWN0aXZlUHJvamVjdGlvbiA9IHBwO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxvY2FsVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxUcmFuc2Zvcm0uY29weSh0aGlzLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgaWYgKHRhLl9wYXJlbnRJRCA8IDApIHtcclxuICAgICAgICAgICAgICAgICsrdGEuX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW4uY2FsbCh0aGlzLCBwYXJlbnRUcmFuc2Zvcm0pO1xyXG4gICAgICAgIHByb2ouX2FjdGl2ZVByb2plY3Rpb24gPSBwcC5fYWN0aXZlUHJvamVjdGlvbjtcclxuICAgIH1cclxuICAgIHZhciBQcm9qZWN0aW9uU3VyZmFjZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFByb2plY3Rpb25TdXJmYWNlLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb25TdXJmYWNlKGxlZ2FjeSwgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGxlZ2FjeSwgZW5hYmxlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5fc3VyZmFjZSA9IG51bGw7XHJcbiAgICAgICAgICAgIF90aGlzLl9hY3RpdmVQcm9qZWN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnRTdXJmYWNlSUQgPSAtMTtcclxuICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnRMZWdhY3lJRCA9IC0xO1xyXG4gICAgICAgICAgICBfdGhpcy5fbGFzdFVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLCBcImVuYWJsZWRcIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl9lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gdHJhbnNmb3JtSGFjaztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IFBJWEkuVHJhbnNmb3JtU3RhdGljLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUsIFwic3VyZmFjZVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1cmZhY2U7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSA9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1cmZhY2UgPSB2YWx1ZSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5hcHBseVBhcnRpYWwgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdXJmYWNlLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24ubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5zdXJmYWNlLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMuX2FjdGl2ZVByb2plY3Rpb24ubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLl9zdXJmYWNlLmFwcGx5SW52ZXJzZShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdXJmYWNlLmFwcGx5SW52ZXJzZShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUubWFwQmlsaW5lYXJTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkKSB7XHJcbiAgICAgICAgICAgIGlmICghKHRoaXMuX3N1cmZhY2UgaW5zdGFuY2VvZiBwaXhpX3Byb2plY3Rpb24uQmlsaW5lYXJTdXJmYWNlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJmYWNlID0gbmV3IHBpeGlfcHJvamVjdGlvbi5CaWxpbmVhclN1cmZhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cmZhY2UubWFwU3ByaXRlKHNwcml0ZSwgcXVhZCwgdGhpcy5sZWdhY3kpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cmZhY2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZSwgXCJ1bmlmb3Jtc1wiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRMZWdhY3lJRCA9PT0gdGhpcy5sZWdhY3kuX3dvcmxkSUQgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50U3VyZmFjZUlEID09PSB0aGlzLnN1cmZhY2UuX3VwZGF0ZUlEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3RVbmlmb3JtcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RVbmlmb3JtcyA9IHRoaXMuX2xhc3RVbmlmb3JtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RVbmlmb3Jtcy53b3JsZFRyYW5zZm9ybSA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLnRvQXJyYXkodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXJmYWNlLmZpbGxVbmlmb3Jtcyh0aGlzLl9sYXN0VW5pZm9ybXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3RVbmlmb3JtcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb25TdXJmYWNlO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlID0gUHJvamVjdGlvblN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIHZhciBTcHJpdGVCaWxpbmVhclJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlQmlsaW5lYXJSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGVCaWxpbmVhclJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuc2l6ZSA9IDEwMDtcclxuICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMID0gMTtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMxO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczI7XFxuYXR0cmlidXRlIHZlYzQgYUZyYW1lO1xcbmF0dHJpYnV0ZSB2ZWM0IGFDb2xvcjtcXG5hdHRyaWJ1dGUgZmxvYXQgYVRleHR1cmVJZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgd29ybGRUcmFuc2Zvcm07XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiB3b3JsZFRyYW5zZm9ybSAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcbiAgICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG4gICAgdlRyYW5zMSA9IGFUcmFuczE7XFxuICAgIHZUcmFuczIgPSBhVHJhbnMyO1xcbiAgICB2VGV4dHVyZUlkID0gYVRleHR1cmVJZDtcXG4gICAgdkNvbG9yID0gYUNvbG9yO1xcbiAgICB2RnJhbWUgPSBhRnJhbWU7XFxufVxcblwiO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcnNbJWNvdW50JV07XFxudW5pZm9ybSB2ZWMyIHNhbXBsZXJTaXplWyVjb3VudCVdOyBcXG51bmlmb3JtIHZlYzQgZGlzdG9ydGlvbjtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxudmVjMiBzdXJmYWNlO1xcbnZlYzIgc3VyZmFjZTI7XFxuXFxuZmxvYXQgdnggPSB2VGV4dHVyZUNvb3JkLng7XFxuZmxvYXQgdnkgPSB2VGV4dHVyZUNvb3JkLnk7XFxuZmxvYXQgZHggPSBkaXN0b3J0aW9uLng7XFxuZmxvYXQgZHkgPSBkaXN0b3J0aW9uLnk7XFxuZmxvYXQgcmV2eCA9IGRpc3RvcnRpb24uejtcXG5mbG9hdCByZXZ5ID0gZGlzdG9ydGlvbi53O1xcblxcbmlmIChkaXN0b3J0aW9uLnggPT0gMC4wKSB7XFxuICAgIHN1cmZhY2UueCA9IHZ4O1xcbiAgICBzdXJmYWNlLnkgPSB2eSAvICgxLjAgKyBkeSAqIHZ4KTtcXG4gICAgc3VyZmFjZTIgPSBzdXJmYWNlO1xcbn0gZWxzZVxcbmlmIChkaXN0b3J0aW9uLnkgPT0gMC4wKSB7XFxuICAgIHN1cmZhY2UueSA9IHZ5O1xcbiAgICBzdXJmYWNlLnggPSB2eC8gKDEuMCArIGR4ICogdnkpO1xcbiAgICBzdXJmYWNlMiA9IHN1cmZhY2U7XFxufSBlbHNlIHtcXG4gICAgZmxvYXQgYyA9IHZ5ICogZHggLSB2eCAqIGR5O1xcbiAgICBmbG9hdCBiID0gKGMgKyAxLjApICogMC41O1xcbiAgICBmbG9hdCBiMiA9ICgtYyArIDEuMCkgKiAwLjU7XFxuICAgIGZsb2F0IGQgPSBiICogYiArIHZ4ICogZHk7XFxuICAgIGlmIChkIDwgLTAuMDAwMDEpIHtcXG4gICAgICAgIGRpc2NhcmQ7XFxuICAgIH1cXG4gICAgZCA9IHNxcnQobWF4KGQsIDAuMCkpO1xcbiAgICBzdXJmYWNlLnggPSAoLSBiICsgZCkgKiByZXZ5O1xcbiAgICBzdXJmYWNlMi54ID0gKC0gYiAtIGQpICogcmV2eTtcXG4gICAgc3VyZmFjZS55ID0gKC0gYjIgKyBkKSAqIHJldng7XFxuICAgIHN1cmZhY2UyLnkgPSAoLSBiMiAtIGQpICogcmV2eDtcXG59XFxuXFxudmVjMiB1djtcXG51di54ID0gdlRyYW5zMS54ICogc3VyZmFjZS54ICsgdlRyYW5zMS55ICogc3VyZmFjZS55ICsgdlRyYW5zMS56O1xcbnV2LnkgPSB2VHJhbnMyLnggKiBzdXJmYWNlLnggKyB2VHJhbnMyLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMyLno7XFxuXFxudmVjMiBwaXhlbHMgPSB1diAqIHNhbXBsZXJTaXplWzBdO1xcblxcbmlmIChwaXhlbHMueCA8IHZGcmFtZS54IHx8IHBpeGVscy54ID4gdkZyYW1lLnogfHxcXG4gICAgcGl4ZWxzLnkgPCB2RnJhbWUueSB8fCBwaXhlbHMueSA+IHZGcmFtZS53KSB7XFxuICAgIHV2LnggPSB2VHJhbnMxLnggKiBzdXJmYWNlMi54ICsgdlRyYW5zMS55ICogc3VyZmFjZTIueSArIHZUcmFuczEuejtcXG4gICAgdXYueSA9IHZUcmFuczIueCAqIHN1cmZhY2UyLnggKyB2VHJhbnMyLnkgKiBzdXJmYWNlMi55ICsgdlRyYW5zMi56O1xcbiAgICBwaXhlbHMgPSB1diAqIHNhbXBsZXJTaXplWzBdO1xcbiAgICBcXG4gICAgaWYgKHBpeGVscy54IDwgdkZyYW1lLnggfHwgcGl4ZWxzLnggPiB2RnJhbWUueiB8fFxcbiAgICAgICAgcGl4ZWxzLnkgPCB2RnJhbWUueSB8fCBwaXhlbHMueSA+IHZGcmFtZS53KSB7XFxuICAgICAgICBkaXNjYXJkO1xcbiAgICB9XFxufVxcblxcbnZlYzQgZWRnZTtcXG5lZGdlLnh5ID0gY2xhbXAocGl4ZWxzIC0gdkZyYW1lLnh5ICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcbmVkZ2UuencgPSBjbGFtcCh2RnJhbWUuencgLSBwaXhlbHMgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuXFxuZmxvYXQgYWxwaGEgPSAxLjA7IC8vZWRnZS54ICogZWRnZS55ICogZWRnZS56ICogZWRnZS53O1xcbnZlYzQgckNvbG9yID0gdkNvbG9yICogYWxwaGE7XFxuXFxuZmxvYXQgdGV4dHVyZUlkID0gZmxvb3IodlRleHR1cmVJZCswLjUpO1xcbnZlYzQgY29sb3I7XFxudmVjMiB0ZXh0dXJlQ29vcmQgPSB1djtcXG4lZm9ybG9vcCVcXG5nbF9GcmFnQ29sb3IgPSBjb2xvciAqIHJDb2xvcjtcXG59XCI7XHJcbiAgICAgICAgICAgIF90aGlzLmRlZlVuaWZvcm1zID0ge1xyXG4gICAgICAgICAgICAgICAgd29ybGRUcmFuc2Zvcm06IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdKSxcclxuICAgICAgICAgICAgICAgIGRpc3RvcnRpb246IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDBdKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIucHJvdG90eXBlLmdldFVuaWZvcm1zID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvaiA9IHNwcml0ZS5wcm9qO1xyXG4gICAgICAgICAgICB2YXIgc2hhZGVyID0gdGhpcy5zaGFkZXI7XHJcbiAgICAgICAgICAgIGlmIChwcm9qLnN1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9qLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai5fYWN0aXZlUHJvamVjdGlvbi51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZVbmlmb3JtcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZVZhbyA9IGZ1bmN0aW9uICh2ZXJ0ZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgdGhpcy52ZXJ0U2l6ZSA9IDE0O1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRCeXRlU2l6ZSA9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB2YXIgdmFvID0gdGhpcy5yZW5kZXJlci5jcmVhdGVWYW8oKVxyXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KHRoaXMuaW5kZXhCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVZlcnRleFBvc2l0aW9uLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAwKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczEsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDIgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczIsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDUgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFGcmFtZSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgOCAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUNvbG9yLCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTIgKiA0KTtcclxuICAgICAgICAgICAgaWYgKGF0dHJzLmFUZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgICAgIHZhby5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUlkLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAxMyAqIDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YW87XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVCaWxpbmVhclJlbmRlcmVyLnByb3RvdHlwZS5maWxsVmVydGljZXMgPSBmdW5jdGlvbiAoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIHRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHNwcml0ZS52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdyA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4ID0gc3ByaXRlLl9hbmNob3IuX3g7XHJcbiAgICAgICAgICAgIHZhciBheSA9IHNwcml0ZS5fYW5jaG9yLl95O1xyXG4gICAgICAgICAgICB2YXIgZnJhbWUgPSB0ZXguX2ZyYW1lO1xyXG4gICAgICAgICAgICB2YXIgYVRyYW5zID0gc3ByaXRlLmFUcmFucztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbaSAqIDJdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbaSAqIDIgKyAxXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSBhVHJhbnMuYTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgM10gPSBhVHJhbnMuYztcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNF0gPSBhVHJhbnMudHg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDVdID0gYVRyYW5zLmI7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gYVRyYW5zLmQ7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gYVRyYW5zLnR5O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IGZyYW1lLng7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDldID0gZnJhbWUueTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTBdID0gZnJhbWUueCArIGZyYW1lLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMV0gPSBmcmFtZS55ICsgZnJhbWUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDEyXSA9IGFyZ2I7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHRleHR1cmVJZDtcclxuICAgICAgICAgICAgICAgIGluZGV4ICs9IDE0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlQmlsaW5lYXJSZW5kZXJlcjtcclxuICAgIH0oTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIpKTtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignc3ByaXRlX2JpbGluZWFyJywgU3ByaXRlQmlsaW5lYXJSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIHZhciBTcHJpdGVTdHJhbmdlUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGVTdHJhbmdlUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlU3RyYW5nZVJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuc2l6ZSA9IDEwMDtcclxuICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMID0gMTtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMxO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczI7XFxuYXR0cmlidXRlIHZlYzQgYUZyYW1lO1xcbmF0dHJpYnV0ZSB2ZWM0IGFDb2xvcjtcXG5hdHRyaWJ1dGUgZmxvYXQgYVRleHR1cmVJZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgd29ybGRUcmFuc2Zvcm07XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiB3b3JsZFRyYW5zZm9ybSAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcbiAgICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG4gICAgdlRyYW5zMSA9IGFUcmFuczE7XFxuICAgIHZUcmFuczIgPSBhVHJhbnMyO1xcbiAgICB2VGV4dHVyZUlkID0gYVRleHR1cmVJZDtcXG4gICAgdkNvbG9yID0gYUNvbG9yO1xcbiAgICB2RnJhbWUgPSBhRnJhbWU7XFxufVxcblwiO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcnNbJWNvdW50JV07XFxudW5pZm9ybSB2ZWMyIHNhbXBsZXJTaXplWyVjb3VudCVdOyBcXG51bmlmb3JtIHZlYzQgcGFyYW1zO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG52ZWMyIHN1cmZhY2U7XFxuXFxuZmxvYXQgdnggPSB2VGV4dHVyZUNvb3JkLng7XFxuZmxvYXQgdnkgPSB2VGV4dHVyZUNvb3JkLnk7XFxuZmxvYXQgYWxlcGggPSBwYXJhbXMueDtcXG5mbG9hdCBiZXQgPSBwYXJhbXMueTtcXG5mbG9hdCBBID0gcGFyYW1zLno7XFxuZmxvYXQgQiA9IHBhcmFtcy53O1xcblxcbmlmIChhbGVwaCA9PSAwLjApIHtcXG5cXHRzdXJmYWNlLnkgPSB2eSAvICgxLjAgKyB2eCAqIGJldCk7XFxuXFx0c3VyZmFjZS54ID0gdng7XFxufVxcbmVsc2UgaWYgKGJldCA9PSAwLjApIHtcXG5cXHRzdXJmYWNlLnggPSB2eCAvICgxLjAgKyB2eSAqIGFsZXBoKTtcXG5cXHRzdXJmYWNlLnkgPSB2eTtcXG59IGVsc2Uge1xcblxcdHN1cmZhY2UueCA9IHZ4ICogKGJldCArIDEuMCkgLyAoYmV0ICsgMS4wICsgdnkgKiBhbGVwaCk7XFxuXFx0c3VyZmFjZS55ID0gdnkgKiAoYWxlcGggKyAxLjApIC8gKGFsZXBoICsgMS4wICsgdnggKiBiZXQpO1xcbn1cXG5cXG52ZWMyIHV2O1xcbnV2LnggPSB2VHJhbnMxLnggKiBzdXJmYWNlLnggKyB2VHJhbnMxLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMxLno7XFxudXYueSA9IHZUcmFuczIueCAqIHN1cmZhY2UueCArIHZUcmFuczIueSAqIHN1cmZhY2UueSArIHZUcmFuczIuejtcXG5cXG52ZWMyIHBpeGVscyA9IHV2ICogc2FtcGxlclNpemVbMF07XFxuXFxudmVjNCBlZGdlO1xcbmVkZ2UueHkgPSBjbGFtcChwaXhlbHMgLSB2RnJhbWUueHkgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuZWRnZS56dyA9IGNsYW1wKHZGcmFtZS56dyAtIHBpeGVscyArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5cXG5mbG9hdCBhbHBoYSA9IGVkZ2UueCAqIGVkZ2UueSAqIGVkZ2UueiAqIGVkZ2UudztcXG52ZWM0IHJDb2xvciA9IHZDb2xvciAqIGFscGhhO1xcblxcbmZsb2F0IHRleHR1cmVJZCA9IGZsb29yKHZUZXh0dXJlSWQrMC41KTtcXG52ZWM0IGNvbG9yO1xcbnZlYzIgdGV4dHVyZUNvb3JkID0gdXY7XFxuJWZvcmxvb3AlXFxuZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiByQ29sb3I7XFxufVwiO1xyXG4gICAgICAgICAgICBfdGhpcy5kZWZVbmlmb3JtcyA9IHtcclxuICAgICAgICAgICAgICAgIHdvcmxkVHJhbnNmb3JtOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAxXSksXHJcbiAgICAgICAgICAgICAgICBkaXN0b3J0aW9uOiBuZXcgRmxvYXQzMkFycmF5KFswLCAwXSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGVTdHJhbmdlUmVuZGVyZXIucHJvdG90eXBlLmdldFVuaWZvcm1zID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvaiA9IHNwcml0ZS5wcm9qO1xyXG4gICAgICAgICAgICB2YXIgc2hhZGVyID0gdGhpcy5zaGFkZXI7XHJcbiAgICAgICAgICAgIGlmIChwcm9qLnN1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9qLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai5fYWN0aXZlUHJvamVjdGlvbi51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZVbmlmb3JtcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZVN0cmFuZ2VSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlVmFvID0gZnVuY3Rpb24gKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRTaXplID0gMTQ7XHJcbiAgICAgICAgICAgIHRoaXMudmVydEJ5dGVTaXplID0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHZhciB2YW8gPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZVZhbygpXHJcbiAgICAgICAgICAgICAgICAuYWRkSW5kZXgodGhpcy5pbmRleEJ1ZmZlcilcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDApXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMiAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNSAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUZyYW1lLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA4ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hQ29sb3IsIGdsLlVOU0lHTkVEX0JZVEUsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCAxMiAqIDQpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cnMuYVRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICAgICAgdmFvLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlSWQsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEzICogNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZVN0cmFuZ2VSZW5kZXJlci5wcm90b3R5cGUuZmlsbFZlcnRpY2VzID0gZnVuY3Rpb24gKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCB0ZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSBzcHJpdGUudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHcgPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGggPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheCA9IHNwcml0ZS5fYW5jaG9yLl94O1xyXG4gICAgICAgICAgICB2YXIgYXkgPSBzcHJpdGUuX2FuY2hvci5feTtcclxuICAgICAgICAgICAgdmFyIGZyYW1lID0gdGV4Ll9mcmFtZTtcclxuICAgICAgICAgICAgdmFyIGFUcmFucyA9IHNwcml0ZS5hVHJhbnM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhW2kgKiAyXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhW2kgKiAyICsgMV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gYVRyYW5zLmE7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDNdID0gYVRyYW5zLmM7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDRdID0gYVRyYW5zLnR4O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA1XSA9IGFUcmFucy5iO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IGFUcmFucy5kO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IGFUcmFucy50eTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSBmcmFtZS54O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA5XSA9IGZyYW1lLnk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEwXSA9IGZyYW1lLnggKyBmcmFtZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTFdID0gZnJhbWUueSArIGZyYW1lLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAxMl0gPSBhcmdiO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB0ZXh0dXJlSWQ7XHJcbiAgICAgICAgICAgICAgICBpbmRleCArPSAxNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZVN0cmFuZ2VSZW5kZXJlcjtcclxuICAgIH0oTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIpKTtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignc3ByaXRlX3N0cmFuZ2UnLCBTcHJpdGVTdHJhbmdlUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgdmFyIHRlbXBSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKCk7XHJcbiAgICB2YXIgdGVtcFBvaW50ID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgIHZhciBTdHJhbmdlU3VyZmFjZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFN0cmFuZ2VTdXJmYWNlLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFN0cmFuZ2VTdXJmYWNlKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wYXJhbXMgPSBbMCwgMCwgTmFOLCBOYU5dO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgcFswXSA9IDA7XHJcbiAgICAgICAgICAgIHBbMV0gPSAwO1xyXG4gICAgICAgICAgICBwWzJdID0gTmFOO1xyXG4gICAgICAgICAgICBwWzNdID0gTmFOO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLnNldEF4aXNYID0gZnVuY3Rpb24gKHBvcywgZmFjdG9yLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueCwgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIHJvdCA9IG91dFRyYW5zZm9ybS5yb3RhdGlvbjtcclxuICAgICAgICAgICAgaWYgKHJvdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3ggLT0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3kgKz0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnJvdGF0aW9uID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy55ID0gTWF0aC5hdGFuMih5LCB4KTtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgaWYgKGZhY3RvciAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcFsyXSA9IC1kICogZmFjdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcFsyXSA9IE5hTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jYWxjMDEoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5zZXRBeGlzWSA9IGZ1bmN0aW9uIChwb3MsIGZhY3Rvciwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLngsIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciByb3QgPSBvdXRUcmFuc2Zvcm0ucm90YXRpb247XHJcbiAgICAgICAgICAgIGlmIChyb3QgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll94IC09IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll95ICs9IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5yb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcueCA9IC1NYXRoLmF0YW4yKHksIHgpICsgTWF0aC5QSSAvIDI7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHBbM10gPSAtZCAqIGZhY3RvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBbM10gPSBOYU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fY2FsYzAxKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuX2NhbGMwMSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgaWYgKGlzTmFOKHBbMl0pKSB7XHJcbiAgICAgICAgICAgICAgICBwWzFdID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihwWzNdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9IDEuMCAvIHBbM107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocFszXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBwWzFdID0gMS4wIC8gcFsyXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkID0gMS4wIC0gcFsyXSAqIHBbM107XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9ICgxLjAgLSBwWzJdKSAvIGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcFsxXSA9ICgxLjAgLSBwWzNdKSAvIGQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGFsZXBoID0gdGhpcy5wYXJhbXNbMF0sIGJldCA9IHRoaXMucGFyYW1zWzFdLCBBID0gdGhpcy5wYXJhbXNbMl0sIEIgPSB0aGlzLnBhcmFtc1szXTtcclxuICAgICAgICAgICAgdmFyIHUgPSBwb3MueCwgdiA9IHBvcy55O1xyXG4gICAgICAgICAgICBpZiAoYWxlcGggPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2ICogKDEgKyB1ICogYmV0KTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChiZXQgPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB1ICogKDEgKyB2ICogYWxlcGgpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIEQgPSBBICogQiAtIHYgKiB1O1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSBBICogdSAqIChCICsgdikgLyBEO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSBCICogdiAqIChBICsgdSkgLyBEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYWxlcGggPSB0aGlzLnBhcmFtc1swXSwgYmV0ID0gdGhpcy5wYXJhbXNbMV0sIEEgPSB0aGlzLnBhcmFtc1syXSwgQiA9IHRoaXMucGFyYW1zWzNdO1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54LCB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIGlmIChhbGVwaCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHkgLyAoMSArIHggKiBiZXQpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGJldCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHggKiAoMSArIHkgKiBhbGVwaCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHggKiAoYmV0ICsgMSkgLyAoYmV0ICsgMSArIHkgKiBhbGVwaCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHkgKiAoYWxlcGggKyAxKSAvIChhbGVwaCArIDEgKyB4ICogYmV0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLm1hcFNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSAtc3ByaXRlLmFuY2hvci54ICogdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnkgPSAtc3ByaXRlLmFuY2hvci55ICogdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC53aWR0aCA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcFF1YWQodGVtcFJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSB8fCBzcHJpdGUudHJhbnNmb3JtKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5tYXBRdWFkID0gZnVuY3Rpb24gKHJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgYXggPSAtcmVjdC54IC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gLXJlY3QueSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXgyID0gKDEuMCAtIHJlY3QueCkgLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkyID0gKDEuMCAtIHJlY3QueSkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIHVwMXggPSAocXVhZFswXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMXkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMnggPSAocXVhZFswXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXggPSAocXVhZFszXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsyXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheDIpICsgcXVhZFsyXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB4MDAgPSB1cDF4ICogKDEuMCAtIGF5KSArIGRvd24xeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTAwID0gdXAxeSAqICgxLjAgLSBheSkgKyBkb3duMXkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgxMCA9IHVwMnggKiAoMS4wIC0gYXkpICsgZG93bjJ4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MTAgPSB1cDJ5ICogKDEuMCAtIGF5KSArIGRvd24yeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDAxID0gdXAxeCAqICgxLjAgLSBheTIpICsgZG93bjF4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTAxID0gdXAxeSAqICgxLjAgLSBheTIpICsgZG93bjF5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeDExID0gdXAyeCAqICgxLjAgLSBheTIpICsgZG93bjJ4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTExID0gdXAyeSAqICgxLjAgLSBheTIpICsgZG93bjJ5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgbWF0ID0gdGVtcE1hdDtcclxuICAgICAgICAgICAgbWF0LnR4ID0geDAwO1xyXG4gICAgICAgICAgICBtYXQudHkgPSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5hID0geDEwIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuYiA9IHkxMCAtIHkwMDtcclxuICAgICAgICAgICAgbWF0LmMgPSB4MDEgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5kID0geTAxIC0geTAwO1xyXG4gICAgICAgICAgICB0ZW1wUG9pbnQuc2V0KHgxMSwgeTExKTtcclxuICAgICAgICAgICAgbWF0LmFwcGx5SW52ZXJzZSh0ZW1wUG9pbnQsIHRlbXBQb2ludCk7XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5zZXRGcm9tTWF0cml4KG1hdCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmZpbGxVbmlmb3JtcyA9IGZ1bmN0aW9uICh1bmlmb3Jtcykge1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIHZhciBkaXN0b3J0aW9uID0gdW5pZm9ybXMucGFyYW1zIHx8IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDAsIDAsIDBdKTtcclxuICAgICAgICAgICAgdW5pZm9ybXMucGFyYW1zID0gZGlzdG9ydGlvbjtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblswXSA9IHBhcmFtc1swXTtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblsxXSA9IHBhcmFtc1sxXTtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblsyXSA9IHBhcmFtc1syXTtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblszXSA9IHBhcmFtc1szXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTdHJhbmdlU3VyZmFjZTtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlN1cmZhY2UpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TdHJhbmdlU3VyZmFjZSA9IFN0cmFuZ2VTdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBQSVhJLlNwcml0ZS5wcm90b3R5cGUuY29udmVydFRvMnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGVfYmlsaW5lYXInO1xyXG4gICAgICAgIHRoaXMuYVRyYW5zID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbiAgICAgICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRUbzJzLmNhbGwodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRUbzJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0U3VidHJlZVRvMnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0VG8ycygpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmNvbnZlcnRTdWJ0cmVlVG8ycygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBTcHJpdGUycyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZTJzLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZTJzKHRleHR1cmUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dHVyZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuYVRyYW5zID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlX2JpbGluZWFyJztcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGUycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5fYm91bmRzLmFkZFF1YWQodGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RyYW5zZm9ybUlEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZUlEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0cmltID0gdGV4dHVyZS50cmltO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHcwID0gMDtcclxuICAgICAgICAgICAgdmFyIHcxID0gMDtcclxuICAgICAgICAgICAgdmFyIGgwID0gMDtcclxuICAgICAgICAgICAgdmFyIGgxID0gMDtcclxuICAgICAgICAgICAgaWYgKHRyaW0pIHtcclxuICAgICAgICAgICAgICAgIHcxID0gdHJpbS54IC0gKGFuY2hvci5feCAqIG9yaWcud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIHRyaW0ud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IHRyaW0ueSAtIChhbmNob3IuX3kgKiBvcmlnLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgdHJpbS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gaDA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gaDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2ouX3N1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB3dCA9IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSB3dC5hO1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSB3dC5iO1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSB3dC5jO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSB3dC5kO1xyXG4gICAgICAgICAgICAgICAgdmFyIHR4ID0gd3QudHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHkgPSB3dC50eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSAoYSAqIHcxKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gKGQgKiBoMSkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IChhICogdzApICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSAoZCAqIGgxKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gKGEgKiB3MCkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IChkICogaDApICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSAoYSAqIHcxKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gKGQgKiBoMCkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0ZXh0dXJlLnRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICAgICAgdGV4dHVyZS50cmFuc2Zvcm0gPSBuZXcgUElYSS5leHRyYXMuVGV4dHVyZVRyYW5zZm9ybSh0ZXh0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZXh0dXJlLnRyYW5zZm9ybS51cGRhdGUoKTtcclxuICAgICAgICAgICAgdmFyIGFUcmFucyA9IHRoaXMuYVRyYW5zO1xyXG4gICAgICAgICAgICBhVHJhbnMuc2V0KG9yaWcud2lkdGgsIDAsIDAsIG9yaWcuaGVpZ2h0LCB3MSwgaDEpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9zdXJmYWNlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhVHJhbnMucHJlcGVuZCh0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYVRyYW5zLmludmVydCgpO1xyXG4gICAgICAgICAgICBhVHJhbnMucHJlcGVuZCh0ZXh0dXJlLnRyYW5zZm9ybS5tYXBDb29yZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoOCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleFRyaW1tZWREYXRhO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gaDA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gaDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2ouX3N1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhLCB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gd3QuYTtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gd3QuYjtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gd3QuYztcclxuICAgICAgICAgICAgICAgIHZhciBkID0gd3QuZDtcclxuICAgICAgICAgICAgICAgIHZhciB0eCA9IHd0LnR4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5ID0gd3QudHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gKGEgKiB3MSkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IChkICogaDEpICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSAoYSAqIHcwKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gKGQgKiBoMSkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IChhICogdzApICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSAoZCAqIGgwKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gKGEgKiB3MSkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IChkICogaDApICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEsIHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbi5sZWdhY3kud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ByaXRlMnMucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlMnM7XHJcbiAgICB9KFBJWEkuU3ByaXRlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMgPSBTcHJpdGUycztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFRleHQycyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFRleHQycywgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBUZXh0MnModGV4dCwgc3R5bGUsIGNhbnZhcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0LCBzdHlsZSwgY2FudmFzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5hVHJhbnMgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGVfYmlsaW5lYXInO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUZXh0MnMucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gVGV4dDJzO1xyXG4gICAgfShQSVhJLlRleHQpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5UZXh0MnMgPSBUZXh0MnM7XHJcbiAgICBUZXh0MnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgIFRleHQycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICBUZXh0MnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIGZ1bmN0aW9uIGNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgIH1cclxuICAgIHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtID0gY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybTtcclxuICAgIHZhciBDb250YWluZXIyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKENvbnRhaW5lcjJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIENvbnRhaW5lcjJkKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29udGFpbmVyMmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gQ29udGFpbmVyMmQ7XHJcbiAgICB9KFBJWEkuQ29udGFpbmVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uQ29udGFpbmVyMmQgPSBDb250YWluZXIyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFBvaW50ID0gUElYSS5Qb2ludDtcclxuICAgIHZhciBtYXQzaWQgPSBbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV07XHJcbiAgICB2YXIgQUZGSU5FO1xyXG4gICAgKGZ1bmN0aW9uIChBRkZJTkUpIHtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiTk9ORVwiXSA9IDBdID0gXCJOT05FXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIkZSRUVcIl0gPSAxXSA9IFwiRlJFRVwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJBWElTX1hcIl0gPSAyXSA9IFwiQVhJU19YXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIkFYSVNfWVwiXSA9IDNdID0gXCJBWElTX1lcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiUE9JTlRcIl0gPSA0XSA9IFwiUE9JTlRcIjtcclxuICAgIH0pKEFGRklORSA9IHBpeGlfcHJvamVjdGlvbi5BRkZJTkUgfHwgKHBpeGlfcHJvamVjdGlvbi5BRkZJTkUgPSB7fSkpO1xyXG4gICAgdmFyIE1hdHJpeDJkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBNYXRyaXgyZChiYWNraW5nQXJyYXkpIHtcclxuICAgICAgICAgICAgdGhpcy5mbG9hdEFycmF5ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5tYXQzID0gbmV3IEZsb2F0NjRBcnJheShiYWNraW5nQXJyYXkgfHwgbWF0M2lkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJhXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzBdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzBdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiYlwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1sxXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1sxXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImNcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbM107XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbM10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzRdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzRdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwidHhcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbNl07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbNl0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJ0eVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1s3XTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1s3XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHR4LCB0eSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IGE7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBiO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IGM7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBkO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHR4O1xyXG4gICAgICAgICAgICBtYXQzWzddID0gdHk7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKHRyYW5zcG9zZSwgb3V0KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5mbG9hdEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb2F0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KDkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IG91dCB8fCB0aGlzLmZsb2F0QXJyYXk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBpZiAodHJhbnNwb3NlKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVswXSA9IG1hdDNbMF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVsxXSA9IG1hdDNbMV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVsyXSA9IG1hdDNbMl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVszXSA9IG1hdDNbM107XHJcbiAgICAgICAgICAgICAgICBhcnJheVs0XSA9IG1hdDNbNF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs1XSA9IG1hdDNbNV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs2XSA9IG1hdDNbNl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs3XSA9IG1hdDNbN107XHJcbiAgICAgICAgICAgICAgICBhcnJheVs4XSA9IG1hdDNbOF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVswXSA9IG1hdDNbMF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVsxXSA9IG1hdDNbM107XHJcbiAgICAgICAgICAgICAgICBhcnJheVsyXSA9IG1hdDNbNl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVszXSA9IG1hdDNbMV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs0XSA9IG1hdDNbNF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs1XSA9IG1hdDNbN107XHJcbiAgICAgICAgICAgICAgICBhcnJheVs2XSA9IG1hdDNbMl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs3XSA9IG1hdDNbNV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs4XSA9IG1hdDNbOF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueDtcclxuICAgICAgICAgICAgdmFyIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIHogPSAxLjAgLyAobWF0M1syXSAqIHggKyBtYXQzWzVdICogeSArIG1hdDNbOF0pO1xyXG4gICAgICAgICAgICBuZXdQb3MueCA9IHogKiAobWF0M1swXSAqIHggKyBtYXQzWzNdICogeSArIG1hdDNbNl0pO1xyXG4gICAgICAgICAgICBuZXdQb3MueSA9IHogKiAobWF0M1sxXSAqIHggKyBtYXQzWzRdICogeSArIG1hdDNbN10pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uICh0eCwgdHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gKz0gdHggKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzFdICs9IHR5ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1szXSArPSB0eCAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNF0gKz0gdHkgKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzZdICs9IHR4ICogbWF0M1s4XTtcclxuICAgICAgICAgICAgbWF0M1s3XSArPSB0eSAqIG1hdDNbOF07XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gKj0geDtcclxuICAgICAgICAgICAgbWF0M1sxXSAqPSB5O1xyXG4gICAgICAgICAgICBtYXQzWzNdICo9IHg7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gKj0geTtcclxuICAgICAgICAgICAgbWF0M1s2XSAqPSB4O1xyXG4gICAgICAgICAgICBtYXQzWzddICo9IHk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNjYWxlQW5kVHJhbnNsYXRlID0gZnVuY3Rpb24gKHNjYWxlWCwgc2NhbGVZLCB0eCwgdHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBzY2FsZVggKiBtYXQzWzBdICsgdHggKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gc2NhbGVZICogbWF0M1sxXSArIHR5ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1szXSA9IHNjYWxlWCAqIG1hdDNbM10gKyB0eCAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBzY2FsZVkgKiBtYXQzWzRdICsgdHkgKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gc2NhbGVYICogbWF0M1s2XSArIHR4ICogbWF0M1s4XTtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHNjYWxlWSAqIG1hdDNbN10gKyB0eSAqIG1hdDNbOF07XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLng7XHJcbiAgICAgICAgICAgIHZhciB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzNdLCBhMDIgPSBhWzZdLCBhMTAgPSBhWzFdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzddLCBhMjAgPSBhWzJdLCBhMjEgPSBhWzVdLCBhMjIgPSBhWzhdO1xyXG4gICAgICAgICAgICB2YXIgbmV3WCA9IChhMjIgKiBhMTEgLSBhMTIgKiBhMjEpICogeCArICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIHkgKyAoYTEyICogYTAxIC0gYTAyICogYTExKTtcclxuICAgICAgICAgICAgdmFyIG5ld1kgPSAoLWEyMiAqIGExMCArIGExMiAqIGEyMCkgKiB4ICsgKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiB5ICsgKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApO1xyXG4gICAgICAgICAgICB2YXIgbmV3WiA9IChhMjEgKiBhMTAgLSBhMTEgKiBhMjApICogeCArICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIHkgKyAoYTExICogYTAwIC0gYTAxICogYTEwKTtcclxuICAgICAgICAgICAgbmV3UG9zLnggPSBuZXdYIC8gbmV3WjtcclxuICAgICAgICAgICAgbmV3UG9zLnkgPSBuZXdZIC8gbmV3WjtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSwgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XSwgYjAxID0gYTIyICogYTExIC0gYTEyICogYTIxLCBiMTEgPSAtYTIyICogYTEwICsgYTEyICogYTIwLCBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjA7XHJcbiAgICAgICAgICAgIHZhciBkZXQgPSBhMDAgKiBiMDEgKyBhMDEgKiBiMTEgKyBhMDIgKiBiMjE7XHJcbiAgICAgICAgICAgIGlmICghZGV0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XHJcbiAgICAgICAgICAgIGFbMF0gPSBiMDEgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbMV0gPSAoLWEyMiAqIGEwMSArIGEwMiAqIGEyMSkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbMl0gPSAoYTEyICogYTAxIC0gYTAyICogYTExKSAqIGRldDtcclxuICAgICAgICAgICAgYVszXSA9IGIxMSAqIGRldDtcclxuICAgICAgICAgICAgYVs0XSA9IChhMjIgKiBhMDAgLSBhMDIgKiBhMjApICogZGV0O1xyXG4gICAgICAgICAgICBhWzVdID0gKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApICogZGV0O1xyXG4gICAgICAgICAgICBhWzZdID0gYjIxICogZGV0O1xyXG4gICAgICAgICAgICBhWzddID0gKC1hMjEgKiBhMDAgKyBhMDEgKiBhMjApICogZGV0O1xyXG4gICAgICAgICAgICBhWzhdID0gKGExMSAqIGEwMCAtIGEwMSAqIGExMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmlkZW50aXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4MmQodGhpcy5tYXQzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jb3B5VG8gPSBmdW5jdGlvbiAobWF0cml4KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYXIyID0gbWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIGFyMlswXSA9IG1hdDNbMF07XHJcbiAgICAgICAgICAgIGFyMlsxXSA9IG1hdDNbMV07XHJcbiAgICAgICAgICAgIGFyMlsyXSA9IG1hdDNbMl07XHJcbiAgICAgICAgICAgIGFyMlszXSA9IG1hdDNbM107XHJcbiAgICAgICAgICAgIGFyMls0XSA9IG1hdDNbNF07XHJcbiAgICAgICAgICAgIGFyMls1XSA9IG1hdDNbNV07XHJcbiAgICAgICAgICAgIGFyMls2XSA9IG1hdDNbNl07XHJcbiAgICAgICAgICAgIGFyMls3XSA9IG1hdDNbN107XHJcbiAgICAgICAgICAgIGFyMls4XSA9IG1hdDNbOF07XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIChtYXRyaXgsIGFmZmluZSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGQgPSAxLjAgLyBtYXQzWzhdO1xyXG4gICAgICAgICAgICB2YXIgdHggPSBtYXQzWzZdICogZCwgdHkgPSBtYXQzWzddICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmEgPSAobWF0M1swXSAtIG1hdDNbMl0gKiB0eCkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguYiA9IChtYXQzWzFdIC0gbWF0M1syXSAqIHR5KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5jID0gKG1hdDNbM10gLSBtYXQzWzVdICogdHgpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmQgPSAobWF0M1s0XSAtIG1hdDNbNV0gKiB0eSkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXgudHggPSB0eDtcclxuICAgICAgICAgICAgbWF0cml4LnR5ID0gdHk7XHJcbiAgICAgICAgICAgIGlmIChhZmZpbmUgPj0gMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFmZmluZSA9PT0gQUZGSU5FLlBPSU5UKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmEgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5iID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmQgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWZmaW5lID09PSBBRkZJTkUuQVhJU19YKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmMgPSAtbWF0cml4LmI7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmQgPSBtYXRyaXguYTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFmZmluZSA9PT0gQUZGSU5FLkFYSVNfWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5hID0gbWF0cml4LmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmMgPSAtbWF0cml4LmI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jb3B5RnJvbSA9IGZ1bmN0aW9uIChtYXRyaXgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBtYXRyaXguYTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IG1hdHJpeC5iO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IG1hdHJpeC5jO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gbWF0cml4LmQ7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gbWF0cml4LnR4O1xyXG4gICAgICAgICAgICBtYXQzWzddID0gbWF0cml4LnR5O1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMS4wO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zZXRUb011bHRMZWdhY3kgPSBmdW5jdGlvbiAocHQsIGx0KSB7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBiID0gbHQubWF0MztcclxuICAgICAgICAgICAgdmFyIGEwMCA9IHB0LmEsIGEwMSA9IHB0LmIsIGExMCA9IHB0LmMsIGExMSA9IHB0LmQsIGEyMCA9IHB0LnR4LCBhMjEgPSBwdC50eSwgYjAwID0gYlswXSwgYjAxID0gYlsxXSwgYjAyID0gYlsyXSwgYjEwID0gYlszXSwgYjExID0gYls0XSwgYjEyID0gYls1XSwgYjIwID0gYls2XSwgYjIxID0gYls3XSwgYjIyID0gYls4XTtcclxuICAgICAgICAgICAgb3V0WzBdID0gYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbMV0gPSBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFsyXSA9IGIwMjtcclxuICAgICAgICAgICAgb3V0WzNdID0gYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbNF0gPSBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs1XSA9IGIxMjtcclxuICAgICAgICAgICAgb3V0WzZdID0gYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbN10gPSBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs4XSA9IGIyMjtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2V0VG9NdWx0MmQgPSBmdW5jdGlvbiAocHQsIGx0KSB7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhID0gcHQubWF0MywgYiA9IGx0Lm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLCBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdLCBiMDAgPSBiWzBdLCBiMDEgPSBiWzFdLCBiMDIgPSBiWzJdLCBiMTAgPSBiWzNdLCBiMTEgPSBiWzRdLCBiMTIgPSBiWzVdLCBiMjAgPSBiWzZdLCBiMjEgPSBiWzddLCBiMjIgPSBiWzhdO1xyXG4gICAgICAgICAgICBvdXRbMF0gPSBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFsxXSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzJdID0gYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyO1xyXG4gICAgICAgICAgICBvdXRbM10gPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs0XSA9IGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzVdID0gYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyO1xyXG4gICAgICAgICAgICBvdXRbNl0gPSBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs3XSA9IGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzhdID0gYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLklERU5USVRZID0gbmV3IE1hdHJpeDJkKCk7XHJcbiAgICAgICAgTWF0cml4MmQuVEVNUF9NQVRSSVggPSBuZXcgTWF0cml4MmQoKTtcclxuICAgICAgICByZXR1cm4gTWF0cml4MmQ7XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkID0gTWF0cml4MmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUhhY2socGFyZW50VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmFyIHByb2ogPSB0aGlzLnByb2o7XHJcbiAgICAgICAgdmFyIHRhID0gdGhpcztcclxuICAgICAgICB2YXIgcHdpZCA9IHBhcmVudFRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICB2YXIgbHQgPSB0YS5sb2NhbFRyYW5zZm9ybTtcclxuICAgICAgICBpZiAodGEuX2xvY2FsSUQgIT09IHRhLl9jdXJyZW50TG9jYWxJRCkge1xyXG4gICAgICAgICAgICBsdC5hID0gdGEuX2N4ICogdGEuc2NhbGUuX3g7XHJcbiAgICAgICAgICAgIGx0LmIgPSB0YS5fc3ggKiB0YS5zY2FsZS5feDtcclxuICAgICAgICAgICAgbHQuYyA9IHRhLl9jeSAqIHRhLnNjYWxlLl95O1xyXG4gICAgICAgICAgICBsdC5kID0gdGEuX3N5ICogdGEuc2NhbGUuX3k7XHJcbiAgICAgICAgICAgIGx0LnR4ID0gdGEucG9zaXRpb24uX3ggLSAoKHRhLnBpdm90Ll94ICogbHQuYSkgKyAodGEucGl2b3QuX3kgKiBsdC5jKSk7XHJcbiAgICAgICAgICAgIGx0LnR5ID0gdGEucG9zaXRpb24uX3kgLSAoKHRhLnBpdm90Ll94ICogbHQuYikgKyAodGEucGl2b3QuX3kgKiBsdC5kKSk7XHJcbiAgICAgICAgICAgIHRhLl9jdXJyZW50TG9jYWxJRCA9IHRhLl9sb2NhbElEO1xyXG4gICAgICAgICAgICBwcm9qLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBfbWF0cml4SUQgPSBwcm9qLl9wcm9qSUQ7XHJcbiAgICAgICAgaWYgKHByb2ouX2N1cnJlbnRQcm9qSUQgIT09IF9tYXRyaXhJRCkge1xyXG4gICAgICAgICAgICBwcm9qLl9jdXJyZW50UHJvaklEID0gX21hdHJpeElEO1xyXG4gICAgICAgICAgICBpZiAoX21hdHJpeElEICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLmxvY2FsLnNldFRvTXVsdExlZ2FjeShsdCwgcHJvai5tYXRyaXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvai5sb2NhbC5jb3B5RnJvbShsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGEuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0YS5fcGFyZW50SUQgIT09IHB3aWQpIHtcclxuICAgICAgICAgICAgdmFyIHBwID0gcGFyZW50VHJhbnNmb3JtLnByb2o7XHJcbiAgICAgICAgICAgIGlmIChwcCAmJiAhcHAuYWZmaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLndvcmxkLnNldFRvTXVsdDJkKHBwLndvcmxkLCBwcm9qLmxvY2FsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb2oud29ybGQuc2V0VG9NdWx0TGVnYWN5KHBhcmVudFRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSwgcHJvai5sb2NhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvai53b3JsZC5jb3B5KHRhLndvcmxkVHJhbnNmb3JtLCBwcm9qLl9hZmZpbmUpO1xyXG4gICAgICAgICAgICB0YS5fcGFyZW50SUQgPSBwd2lkO1xyXG4gICAgICAgICAgICB0YS5fd29ybGRJRCsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciB0MCA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICB2YXIgdHQgPSBbbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKV07XHJcbiAgICB2YXIgdGVtcFJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoKTtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgdmFyIFByb2plY3Rpb24yZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFByb2plY3Rpb24yZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uMmQobGVnYWN5LCBlbmFibGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbGVnYWN5LCBlbmFibGUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLm1hdHJpeCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgX3RoaXMubG9jYWwgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIF90aGlzLndvcmxkID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvaklEID0gMDtcclxuICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICAgICAgX3RoaXMuX2FmZmluZSA9IHBpeGlfcHJvamVjdGlvbi5BRkZJTkUuTk9ORTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvbjJkLnByb3RvdHlwZSwgXCJhZmZpbmVcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZmZpbmU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWZmaW5lID09IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FmZmluZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvbjJkLnByb3RvdHlwZSwgXCJlbmFibGVkXCIsIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IHRyYW5zZm9ybUhhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSBQSVhJLlRyYW5zZm9ybVN0YXRpYy5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLnNldEF4aXNYID0gZnVuY3Rpb24gKHAsIGZhY3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yID09PSB2b2lkIDApIHsgZmFjdG9yID0gMTsgfVxyXG4gICAgICAgICAgICB2YXIgeCA9IHAueCwgeSA9IHAueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXRyaXgubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHggLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0geSAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSBmYWN0b3IgLyBkO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUuc2V0QXhpc1kgPSBmdW5jdGlvbiAocCwgZmFjdG9yKSB7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgPT09IHZvaWQgMCkgeyBmYWN0b3IgPSAxOyB9XHJcbiAgICAgICAgICAgIHZhciB4ID0gcC54LCB5ID0gcC55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0geCAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSB5IC8gZDtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IGZhY3RvciAvIGQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5tYXBTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGVtcFJlY3QueCA9IC1zcHJpdGUuYW5jaG9yLnggKiB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QueSA9IC1zcHJpdGUuYW5jaG9yLnkgKiB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LndpZHRoID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LmhlaWdodCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwUXVhZCh0ZW1wUmVjdCwgcXVhZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLm1hcFF1YWQgPSBmdW5jdGlvbiAocmVjdCwgcCkge1xyXG4gICAgICAgICAgICB0dFswXS5zZXQocmVjdC54LCByZWN0LnkpO1xyXG4gICAgICAgICAgICB0dFsxXS5zZXQocmVjdC54ICsgcmVjdC53aWR0aCwgcmVjdC55KTtcclxuICAgICAgICAgICAgdHRbMl0uc2V0KHJlY3QueCArIHJlY3Qud2lkdGgsIHJlY3QueSArIHJlY3QuaGVpZ2h0KTtcclxuICAgICAgICAgICAgdHRbM10uc2V0KHJlY3QueCwgcmVjdC55ICsgcmVjdC5oZWlnaHQpO1xyXG4gICAgICAgICAgICB2YXIgazEgPSAxLCBrMiA9IDIsIGszID0gMztcclxuICAgICAgICAgICAgdmFyIGYgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMuZ2V0SW50ZXJzZWN0aW9uRmFjdG9yKHBbMF0sIHBbMl0sIHBbMV0sIHBbM10sIHQwKTtcclxuICAgICAgICAgICAgaWYgKGYgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGsxID0gMTtcclxuICAgICAgICAgICAgICAgIGsyID0gMztcclxuICAgICAgICAgICAgICAgIGszID0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZDAgPSBNYXRoLnNxcnQoKHBbMF0ueCAtIHQwLngpICogKHBbMF0ueCAtIHQwLngpICsgKHBbMF0ueSAtIHQwLnkpICogKHBbMF0ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIGQxID0gTWF0aC5zcXJ0KChwW2sxXS54IC0gdDAueCkgKiAocFtrMV0ueCAtIHQwLngpICsgKHBbazFdLnkgLSB0MC55KSAqIChwW2sxXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgZDIgPSBNYXRoLnNxcnQoKHBbazJdLnggLSB0MC54KSAqIChwW2syXS54IC0gdDAueCkgKyAocFtrMl0ueSAtIHQwLnkpICogKHBbazJdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBkMyA9IE1hdGguc3FydCgocFtrM10ueCAtIHQwLngpICogKHBbazNdLnggLSB0MC54KSArIChwW2szXS55IC0gdDAueSkgKiAocFtrM10ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIHEwID0gKGQwICsgZDMpIC8gZDM7XHJcbiAgICAgICAgICAgIHZhciBxMSA9IChkMSArIGQyKSAvIGQyO1xyXG4gICAgICAgICAgICB2YXIgcTIgPSAoZDEgKyBkMikgLyBkMTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gdHRbMF0ueCAqIHEwO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gdHRbMF0ueSAqIHEwO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gcTA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSB0dFtrMV0ueCAqIHExO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gdHRbazFdLnkgKiBxMTtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IHExO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gdHRbazJdLnggKiBxMjtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHR0W2syXS55ICogcTI7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSBxMjtcclxuICAgICAgICAgICAgdGhpcy5tYXRyaXguaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgIG1hdDMgPSB0ZW1wTWF0Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBwWzBdLng7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBwWzBdLnk7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gcFtrMV0ueDtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHBbazFdLnk7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gcFtrMl0ueDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHBbazJdLnk7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxO1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeC5zZXRUb011bHQyZCh0ZW1wTWF0LCB0aGlzLm1hdHJpeCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeC5pZGVudGl0eSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb24yZDtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24pKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQgPSBQcm9qZWN0aW9uMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNZXNoMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhNZXNoMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gTWVzaDJkKHRleHR1cmUsIHZlcnRpY2VzLCB1dnMsIGluZGljZXMsIGRyYXdNb2RlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHR1cmUsIHZlcnRpY2VzLCB1dnMsIGluZGljZXMsIGRyYXdNb2RlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdtZXNoMmQnO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZXNoMmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gTWVzaDJkO1xyXG4gICAgfShQSVhJLm1lc2guTWVzaCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLk1lc2gyZCA9IE1lc2gyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgdHJhbnNsYXRpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHVUcmFuc2Zvcm07XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogdHJhbnNsYXRpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG5cXG4gICAgdlRleHR1cmVDb29yZCA9ICh1VHJhbnNmb3JtICogdmVjMyhhVGV4dHVyZUNvb3JkLCAxLjApKS54eTtcXG59XFxuXCI7XHJcbiAgICB2YXIgc2hhZGVyRnJhZyA9IFwiXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSB2ZWM0IHVDb2xvcjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkgKiB1Q29sb3I7XFxufVwiO1xyXG4gICAgdmFyIE1lc2gyZFJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoTWVzaDJkUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gTWVzaDJkUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgTWVzaDJkUmVuZGVyZXIucHJvdG90eXBlLm9uQ29udGV4dENoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdGhpcy5zaGFkZXIgPSBuZXcgUElYSS5TaGFkZXIoZ2wsIHNoYWRlclZlcnQsIHNoYWRlckZyYWcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIE1lc2gyZFJlbmRlcmVyO1xyXG4gICAgfShQSVhJLm1lc2guTWVzaFJlbmRlcmVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uTWVzaDJkUmVuZGVyZXIgPSBNZXNoMmRSZW5kZXJlcjtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignbWVzaDJkJywgTWVzaDJkUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBQSVhJLlNwcml0ZS5wcm90b3R5cGUuY29udmVydFRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlMmQnO1xyXG4gICAgICAgIHRoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5tZXNoLk1lc2gucHJvdG90eXBlLmNvbnZlcnRUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgdGhpcy5wbHVnaW5OYW1lID0gJ21lc2gyZCc7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0U3VidHJlZVRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0VG8yZCgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmNvbnZlcnRTdWJ0cmVlVG8yZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBTcHJpdGUyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZTJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZTJkKHRleHR1cmUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dHVyZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlMmQnO1xyXG4gICAgICAgICAgICBfdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlMmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kcy5hZGRRdWFkKHRoaXMudmVydGV4VHJpbW1lZERhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hZmZpbmUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRleERhdGEubGVuZ3RoICE9IDgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcy5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZlcnRleERhdGEubGVuZ3RoICE9IDEyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90cmFuc2Zvcm1JRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybUlEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB3dCA9IHRoaXMucHJvai53b3JsZC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRyaW0gPSB0ZXh0dXJlLnRyaW07XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAwO1xyXG4gICAgICAgICAgICBpZiAodHJpbSkge1xyXG4gICAgICAgICAgICAgICAgdzEgPSB0cmltLnggLSAoYW5jaG9yLl94ICogb3JpZy53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgdHJpbS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gdHJpbS55IC0gKGFuY2hvci5feSAqIG9yaWcuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyB0cmltLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSAod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMSkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9ICh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgxKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gKHd0WzJdICogdzEpICsgKHd0WzVdICogaDEpICsgd3RbOF07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSAod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMSkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9ICh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgxKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gKHd0WzJdICogdzApICsgKHd0WzVdICogaDEpICsgd3RbOF07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSAod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMCkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9ICh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgwKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzhdID0gKHd0WzJdICogdzApICsgKHd0WzVdICogaDApICsgd3RbOF07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbOV0gPSAod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMCkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxMF0gPSAod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxMV0gPSAod3RbMl0gKiB3MSkgKyAod3RbNV0gKiBoMCkgKyB3dFs4XTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FmZmluZSkge1xyXG4gICAgICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoOCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleFRyaW1tZWREYXRhO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy5wcm9qLndvcmxkLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIHogPSAxLjAgLyAod3RbMl0gKiB3MSArIHd0WzVdICogaDEgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSB6ICogKCh3dFswXSAqIHcxKSArICh3dFszXSAqIGgxKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IHogKiAoKHd0WzFdICogdzEpICsgKHd0WzRdICogaDEpICsgd3RbN10pO1xyXG4gICAgICAgICAgICB6ID0gMS4wIC8gKHd0WzJdICogdzAgKyB3dFs1XSAqIGgxICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0geiAqICgod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMSkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSB6ICogKCh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgxKSArIHd0WzddKTtcclxuICAgICAgICAgICAgeiA9IDEuMCAvICh3dFsyXSAqIHcwICsgd3RbNV0gKiBoMCArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IHogKiAoKHd0WzBdICogdzApICsgKHd0WzNdICogaDApICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0geiAqICgod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XSk7XHJcbiAgICAgICAgICAgIHogPSAxLjAgLyAod3RbMl0gKiB3MSArIHd0WzVdICogaDAgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSB6ICogKCh3dFswXSAqIHcxKSArICh3dFszXSAqIGgwKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IHogKiAoKHd0WzFdICogdzEpICsgKHd0WzRdICogaDApICsgd3RbN10pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNwcml0ZTJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZTJkO1xyXG4gICAgfShQSVhJLlNwcml0ZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkID0gU3ByaXRlMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIHZhciBTcHJpdGUyZFJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlMmRSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGUyZFJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcbmF0dHJpYnV0ZSB2ZWM0IGFDb2xvcjtcXG5hdHRyaWJ1dGUgZmxvYXQgYVRleHR1cmVJZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiBhVmVydGV4UG9zaXRpb247XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuICAgIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG4gICAgdlRleHR1cmVJZCA9IGFUZXh0dXJlSWQ7XFxuICAgIHZDb2xvciA9IGFDb2xvcjtcXG59XFxuXCI7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSBcIlxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyc1slY291bnQlXTtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxudmVjNCBjb2xvcjtcXG52ZWMyIHRleHR1cmVDb29yZCA9IHZUZXh0dXJlQ29vcmQ7XFxuZmxvYXQgdGV4dHVyZUlkID0gZmxvb3IodlRleHR1cmVJZCswLjUpO1xcbiVmb3Jsb29wJVxcbmdsX0ZyYWdDb2xvciA9IGNvbG9yICogdkNvbG9yO1xcbn1cIjtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGUyZFJlbmRlcmVyLnByb3RvdHlwZS5jcmVhdGVWYW8gPSBmdW5jdGlvbiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudmVydFNpemUgPSA2O1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRCeXRlU2l6ZSA9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB2YXIgdmFvID0gdGhpcy5yZW5kZXJlci5jcmVhdGVWYW8oKVxyXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KHRoaXMuaW5kZXhCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVZlcnRleFBvc2l0aW9uLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAwKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlQ29vcmQsIGdsLlVOU0lHTkVEX1NIT1JULCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMyAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUNvbG9yLCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNCAqIDQpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cnMuYVRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICAgICAgdmFvLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlSWQsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDUgKiA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFvO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMmRSZW5kZXJlci5wcm90b3R5cGUuZmlsbFZlcnRpY2VzID0gZnVuY3Rpb24gKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCB0ZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSBzcHJpdGUudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHV2cyA9IHNwcml0ZS5fdGV4dHVyZS5fdXZzLnV2c1VpbnQzMjtcclxuICAgICAgICAgICAgaWYgKHZlcnRleERhdGEubGVuZ3RoID09PSA4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJlci5yb3VuZFBpeGVscykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNvbHV0aW9uID0gdGhpcy5yZW5kZXJlci5yZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9ICgodmVydGV4RGF0YVswXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSAoKHZlcnRleERhdGFbMV0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSAoKHZlcnRleERhdGFbMl0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gKCh2ZXJ0ZXhEYXRhWzNdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEyXSA9ICgodmVydGV4RGF0YVs0XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gKCh2ZXJ0ZXhEYXRhWzVdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxNF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOF0gPSAoKHZlcnRleERhdGFbNl0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE5XSA9ICgodmVydGV4RGF0YVs3XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMjBdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVswXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVsxXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSB2ZXJ0ZXhEYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSB2ZXJ0ZXhEYXRhWzNdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMl0gPSB2ZXJ0ZXhEYXRhWzRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdmVydGV4RGF0YVs1XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE0XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE4XSA9IHZlcnRleERhdGFbNl07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOV0gPSB2ZXJ0ZXhEYXRhWzddO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMjBdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVswXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IHZlcnRleERhdGFbMl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gdmVydGV4RGF0YVszXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSB2ZXJ0ZXhEYXRhWzRdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IHZlcnRleERhdGFbNV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEyXSA9IHZlcnRleERhdGFbNl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHZlcnRleERhdGFbN107XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE0XSA9IHZlcnRleERhdGFbOF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE4XSA9IHZlcnRleERhdGFbOV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE5XSA9IHZlcnRleERhdGFbMTBdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyMF0gPSB2ZXJ0ZXhEYXRhWzExXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgM10gPSB1dnNbMF07XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyA5XSA9IHV2c1sxXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDE1XSA9IHV2c1syXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDIxXSA9IHV2c1szXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDRdID0gdWludDMyVmlld1tpbmRleCArIDEwXSA9IHVpbnQzMlZpZXdbaW5kZXggKyAxNl0gPSB1aW50MzJWaWV3W2luZGV4ICsgMjJdID0gYXJnYjtcclxuICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA1XSA9IGZsb2F0MzJWaWV3W2luZGV4ICsgMTFdID0gZmxvYXQzMlZpZXdbaW5kZXggKyAxN10gPSBmbG9hdDMyVmlld1tpbmRleCArIDIzXSA9IHRleHR1cmVJZDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGUyZFJlbmRlcmVyO1xyXG4gICAgfShNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcikpO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdzcHJpdGUyZCcsIFNwcml0ZTJkUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgVGV4dDJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoVGV4dDJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFRleHQyZCh0ZXh0LCBzdHlsZSwgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHQsIHN0eWxlLCBjYW52YXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZTJkJztcclxuICAgICAgICAgICAgX3RoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUZXh0MmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gVGV4dDJkO1xyXG4gICAgfShQSVhJLlRleHQpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5UZXh0MmQgPSBUZXh0MmQ7XHJcbiAgICBUZXh0MmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgIFRleHQyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICBUZXh0MmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBQcm9qZWN0aW9uc01hbmFnZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb25zTWFuYWdlcihyZW5kZXJlcikge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29udGV4dENoYW5nZSA9IGZ1bmN0aW9uIChnbCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZ2wgPSBnbDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJlbmRlcmVyLm1hc2tNYW5hZ2VyLnB1c2hTcHJpdGVNYXNrID0gcHVzaFNwcml0ZU1hc2s7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcclxuICAgICAgICAgICAgcmVuZGVyZXIub24oJ2NvbnRleHQnLCB0aGlzLm9uQ29udGV4dENoYW5nZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFByb2plY3Rpb25zTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5vZmYoJ2NvbnRleHQnLCB0aGlzLm9uQ29udGV4dENoYW5nZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvbnNNYW5hZ2VyO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uc01hbmFnZXIgPSBQcm9qZWN0aW9uc01hbmFnZXI7XHJcbiAgICBmdW5jdGlvbiBwdXNoU3ByaXRlTWFzayh0YXJnZXQsIG1hc2tEYXRhKSB7XHJcbiAgICAgICAgdmFyIGFscGhhTWFza0ZpbHRlciA9IHRoaXMuYWxwaGFNYXNrUG9vbFt0aGlzLmFscGhhTWFza0luZGV4XTtcclxuICAgICAgICBpZiAoIWFscGhhTWFza0ZpbHRlcikge1xyXG4gICAgICAgICAgICBhbHBoYU1hc2tGaWx0ZXIgPSB0aGlzLmFscGhhTWFza1Bvb2xbdGhpcy5hbHBoYU1hc2tJbmRleF0gPSBbbmV3IHBpeGlfcHJvamVjdGlvbi5TcHJpdGVNYXNrRmlsdGVyMmQobWFza0RhdGEpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWxwaGFNYXNrRmlsdGVyWzBdLnJlc29sdXRpb24gPSB0aGlzLnJlbmRlcmVyLnJlc29sdXRpb247XHJcbiAgICAgICAgYWxwaGFNYXNrRmlsdGVyWzBdLm1hc2tTcHJpdGUgPSBtYXNrRGF0YTtcclxuICAgICAgICB0YXJnZXQuZmlsdGVyQXJlYSA9IG1hc2tEYXRhLmdldEJvdW5kcyh0cnVlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLmZpbHRlck1hbmFnZXIucHVzaEZpbHRlcih0YXJnZXQsIGFscGhhTWFza0ZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hbHBoYU1hc2tJbmRleCsrO1xyXG4gICAgfVxyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdwcm9qZWN0aW9ucycsIFByb2plY3Rpb25zTWFuYWdlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBzcHJpdGVNYXNrVmVydCA9IFwiXFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIG90aGVyTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMyB2TWFza0Nvb3JkO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG5cXG5cXHR2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG5cXHR2TWFza0Nvb3JkID0gb3RoZXJNYXRyaXggKiB2ZWMzKCBhVGV4dHVyZUNvb3JkLCAxLjApO1xcbn1cXG5cIjtcclxuICAgIHZhciBzcHJpdGVNYXNrRnJhZyA9IFwiXFxudmFyeWluZyB2ZWMzIHZNYXNrQ29vcmQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBhbHBoYTtcXG51bmlmb3JtIHNhbXBsZXIyRCBtYXNrO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgdmVjMiB1diA9IHZNYXNrQ29vcmQueHkgLyB2TWFza0Nvb3JkLno7XFxuICAgIFxcbiAgICB2ZWMyIHRleHQgPSBhYnMoIHV2IC0gMC41ICk7XFxuICAgIHRleHQgPSBzdGVwKDAuNSwgdGV4dCk7XFxuXFxuICAgIGZsb2F0IGNsaXAgPSAxLjAgLSBtYXgodGV4dC55LCB0ZXh0LngpO1xcbiAgICB2ZWM0IG9yaWdpbmFsID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjNCBtYXNreSA9IHRleHR1cmUyRChtYXNrLCB1dik7XFxuXFxuICAgIG9yaWdpbmFsICo9IChtYXNreS5yICogbWFza3kuYSAqIGFscGhhICogY2xpcCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IG9yaWdpbmFsO1xcbn1cXG5cIjtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgdmFyIFNwcml0ZU1hc2tGaWx0ZXIyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZU1hc2tGaWx0ZXIyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGVNYXNrRmlsdGVyMmQoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNwcml0ZU1hc2tWZXJ0LCBzcHJpdGVNYXNrRnJhZykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMubWFza01hdHJpeCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgc3ByaXRlLnJlbmRlcmFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgX3RoaXMubWFza1Nwcml0ZSA9IHNwcml0ZTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGVNYXNrRmlsdGVyMmQucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKGZpbHRlck1hbmFnZXIsIGlucHV0LCBvdXRwdXQsIGNsZWFyLCBjdXJyZW50U3RhdGUpIHtcclxuICAgICAgICAgICAgdmFyIG1hc2tTcHJpdGUgPSB0aGlzLm1hc2tTcHJpdGU7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybXMubWFzayA9IG1hc2tTcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3Jtcy5vdGhlck1hdHJpeCA9IFNwcml0ZU1hc2tGaWx0ZXIyZC5jYWxjdWxhdGVTcHJpdGVNYXRyaXgoY3VycmVudFN0YXRlLCB0aGlzLm1hc2tNYXRyaXgsIG1hc2tTcHJpdGUpO1xyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1zLmFscGhhID0gbWFza1Nwcml0ZS53b3JsZEFscGhhO1xyXG4gICAgICAgICAgICBmaWx0ZXJNYW5hZ2VyLmFwcGx5RmlsdGVyKHRoaXMsIGlucHV0LCBvdXRwdXQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlTWFza0ZpbHRlcjJkLmNhbGN1bGF0ZVNwcml0ZU1hdHJpeCA9IGZ1bmN0aW9uIChjdXJyZW50U3RhdGUsIG1hcHBlZE1hdHJpeCwgc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9qID0gc3ByaXRlLnByb2o7XHJcbiAgICAgICAgICAgIHZhciBmaWx0ZXJBcmVhID0gY3VycmVudFN0YXRlLnNvdXJjZUZyYW1lO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZVNpemUgPSBjdXJyZW50U3RhdGUucmVuZGVyVGFyZ2V0LnNpemU7XHJcbiAgICAgICAgICAgIHZhciB3b3JsZFRyYW5zZm9ybSA9IHByb2ogJiYgIXByb2ouX2FmZmluZSA/IHByb2oud29ybGQuY29weVRvKHRlbXBNYXQpIDogdGVtcE1hdC5jb3B5RnJvbShzcHJpdGUudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSBzcHJpdGUudGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICBtYXBwZWRNYXRyaXguc2V0KHRleHR1cmVTaXplLndpZHRoLCAwLCAwLCB0ZXh0dXJlU2l6ZS5oZWlnaHQsIGZpbHRlckFyZWEueCwgZmlsdGVyQXJlYS55KTtcclxuICAgICAgICAgICAgd29ybGRUcmFuc2Zvcm0uaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgIG1hcHBlZE1hdHJpeC5zZXRUb011bHQyZCh3b3JsZFRyYW5zZm9ybSwgbWFwcGVkTWF0cml4KTtcclxuICAgICAgICAgICAgbWFwcGVkTWF0cml4LnNjYWxlQW5kVHJhbnNsYXRlKDEuMCAvIHRleHR1cmUud2lkdGgsIDEuMCAvIHRleHR1cmUuaGVpZ2h0LCBzcHJpdGUuYW5jaG9yLngsIHNwcml0ZS5hbmNob3IueSk7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXBwZWRNYXRyaXg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlTWFza0ZpbHRlcjJkO1xyXG4gICAgfShQSVhJLkZpbHRlcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZU1hc2tGaWx0ZXIyZCA9IFNwcml0ZU1hc2tGaWx0ZXIyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLXByb2plY3Rpb24uanMubWFwIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyohXG4gKiBwaXhpLXNvdW5kIC0gdjIuMC4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcGl4aWpzL3BpeGktc291bmRcbiAqIENvbXBpbGVkIFR1ZSwgMTQgTm92IDIwMTcgMTc6NTM6NDcgVVRDXG4gKlxuICogcGl4aS1zb3VuZCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlTb3VuZD1lLl9fcGl4aVNvdW5kfHx7fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlLHQpe2Z1bmN0aW9uIG4oKXt0aGlzLmNvbnN0cnVjdG9yPWV9byhlLHQpLGUucHJvdG90eXBlPW51bGw9PT10P09iamVjdC5jcmVhdGUodCk6KG4ucHJvdG90eXBlPXQucHJvdG90eXBlLG5ldyBuKX1pZihcInVuZGVmaW5lZFwiPT10eXBlb2YgUElYSSl0aHJvd1wiUGl4aUpTIHJlcXVpcmVkXCI7dmFyIG49ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5fb3V0cHV0PXQsdGhpcy5faW5wdXQ9ZX1yZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZGVzdGluYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2lucHV0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2ZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt2YXIgdD10aGlzO2lmKHRoaXMuX2ZpbHRlcnMmJih0aGlzLl9maWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oZSl7ZSYmZS5kaXNjb25uZWN0KCl9KSx0aGlzLl9maWx0ZXJzPW51bGwsdGhpcy5faW5wdXQuY29ubmVjdCh0aGlzLl9vdXRwdXQpKSxlJiZlLmxlbmd0aCl7dGhpcy5fZmlsdGVycz1lLnNsaWNlKDApLHRoaXMuX2lucHV0LmRpc2Nvbm5lY3QoKTt2YXIgbj1udWxsO2UuZm9yRWFjaChmdW5jdGlvbihlKXtudWxsPT09bj90Ll9pbnB1dC5jb25uZWN0KGUuZGVzdGluYXRpb24pOm4uY29ubmVjdChlLmRlc3RpbmF0aW9uKSxuPWV9KSxuLmNvbm5lY3QodGhpcy5fb3V0cHV0KX19LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuZmlsdGVycz1udWxsLHRoaXMuX2lucHV0PW51bGwsdGhpcy5fb3V0cHV0PW51bGx9LGV9KCksbz1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fHtfX3Byb3RvX186W119aW5zdGFuY2VvZiBBcnJheSYmZnVuY3Rpb24oZSx0KXtlLl9fcHJvdG9fXz10fXx8ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG4gaW4gdCl0Lmhhc093blByb3BlcnR5KG4pJiYoZVtuXT10W25dKX0saT0wLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2YXIgbj1lLmNhbGwodGhpcyl8fHRoaXM7cmV0dXJuIG4uaWQ9aSsrLG4uaW5pdCh0KSxufXJldHVybiB0KG4sZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicHJvZ3Jlc3NcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZS5jdXJyZW50VGltZS90aGlzLl9kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3BhdXNlZD1lLHRoaXMucmVmcmVzaFBhdXNlZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLl9vblBsYXk9ZnVuY3Rpb24oKXt0aGlzLl9wbGF5aW5nPSEwfSxuLnByb3RvdHlwZS5fb25QYXVzZT1mdW5jdGlvbigpe3RoaXMuX3BsYXlpbmc9ITF9LG4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5fcGxheWluZz0hMSx0aGlzLl9kdXJhdGlvbj1lLnNvdXJjZS5kdXJhdGlvbjt2YXIgdD10aGlzLl9zb3VyY2U9ZS5zb3VyY2UuY2xvbmVOb2RlKCExKTt0LnNyYz1lLnBhcmVudC51cmwsdC5vbnBsYXk9dGhpcy5fb25QbGF5LmJpbmQodGhpcyksdC5vbnBhdXNlPXRoaXMuX29uUGF1c2UuYmluZCh0aGlzKSxlLmNvbnRleHQub24oXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLGUuY29udGV4dC5vbihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyksdGhpcy5fbWVkaWE9ZX0sbi5wcm90b3R5cGUuX2ludGVybmFsU3RvcD1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmdGhpcy5fcGxheWluZyYmKHRoaXMuX3NvdXJjZS5vbmVuZGVkPW51bGwsdGhpcy5fc291cmNlLnBhdXNlKCkpfSxuLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7dGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5fc291cmNlJiZ0aGlzLmVtaXQoXCJzdG9wXCIpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzcGVlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zcGVlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInZvbHVtZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fdm9sdW1lPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibG9vcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbG9vcH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2xvb3A9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJtdXRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbXV0ZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9tdXRlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50O3RoaXMuX3NvdXJjZS5sb29wPXRoaXMuX2xvb3B8fHQubG9vcDt2YXIgbj1lLnZvbHVtZSooZS5tdXRlZD8wOjEpLG89dC52b2x1bWUqKHQubXV0ZWQ/MDoxKSxpPXRoaXMuX3ZvbHVtZSoodGhpcy5fbXV0ZWQ/MDoxKTt0aGlzLl9zb3VyY2Uudm9sdW1lPWkqbipvLHRoaXMuX3NvdXJjZS5wbGF5YmFja1JhdGU9dGhpcy5fc3BlZWQqZS5zcGVlZCp0LnNwZWVkfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudCxuPXRoaXMuX3BhdXNlZHx8dC5wYXVzZWR8fGUucGF1c2VkO24hPT10aGlzLl9wYXVzZWRSZWFsJiYodGhpcy5fcGF1c2VkUmVhbD1uLG4/KHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInBhdXNlZFwiKSk6KHRoaXMuZW1pdChcInJlc3VtZWRcIiksdGhpcy5wbGF5KHtzdGFydDp0aGlzLl9zb3VyY2UuY3VycmVudFRpbWUsZW5kOnRoaXMuX2VuZCx2b2x1bWU6dGhpcy5fdm9sdW1lLHNwZWVkOnRoaXMuX3NwZWVkLGxvb3A6dGhpcy5fbG9vcH0pKSx0aGlzLmVtaXQoXCJwYXVzZVwiLG4pKX0sbi5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlKXt2YXIgdD10aGlzLG89ZS5zdGFydCxpPWUuZW5kLHI9ZS5zcGVlZCxzPWUubG9vcCx1PWUudm9sdW1lLGE9ZS5tdXRlZDtpJiZjb25zb2xlLmFzc2VydChpPm8sXCJFbmQgdGltZSBpcyBiZWZvcmUgc3RhcnQgdGltZVwiKSx0aGlzLl9zcGVlZD1yLHRoaXMuX3ZvbHVtZT11LHRoaXMuX2xvb3A9ISFzLHRoaXMuX211dGVkPWEsdGhpcy5yZWZyZXNoKCksdGhpcy5sb29wJiZudWxsIT09aSYmKGNvbnNvbGUud2FybignTG9vcGluZyBub3Qgc3VwcG9ydCB3aGVuIHNwZWNpZnlpbmcgYW4gXCJlbmRcIiB0aW1lJyksdGhpcy5sb29wPSExKSx0aGlzLl9zdGFydD1vLHRoaXMuX2VuZD1pfHx0aGlzLl9kdXJhdGlvbix0aGlzLl9zdGFydD1NYXRoLm1heCgwLHRoaXMuX3N0YXJ0LW4uUEFERElORyksdGhpcy5fZW5kPU1hdGgubWluKHRoaXMuX2VuZCtuLlBBRERJTkcsdGhpcy5fZHVyYXRpb24pLHRoaXMuX3NvdXJjZS5vbmxvYWRlZG1ldGFkYXRhPWZ1bmN0aW9uKCl7dC5fc291cmNlJiYodC5fc291cmNlLmN1cnJlbnRUaW1lPW8sdC5fc291cmNlLm9ubG9hZGVkbWV0YWRhdGE9bnVsbCx0LmVtaXQoXCJwcm9ncmVzc1wiLG8sdC5fZHVyYXRpb24pLFBJWEkudGlja2VyLnNoYXJlZC5hZGQodC5fb25VcGRhdGUsdCkpfSx0aGlzLl9zb3VyY2Uub25lbmRlZD10aGlzLl9vbkNvbXBsZXRlLmJpbmQodGhpcyksdGhpcy5fc291cmNlLnBsYXkoKSx0aGlzLmVtaXQoXCJzdGFydFwiKX0sbi5wcm90b3R5cGUuX29uVXBkYXRlPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwicHJvZ3Jlc3NcIix0aGlzLnByb2dyZXNzLHRoaXMuX2R1cmF0aW9uKSx0aGlzLl9zb3VyY2UuY3VycmVudFRpbWU+PXRoaXMuX2VuZCYmIXRoaXMuX3NvdXJjZS5sb29wJiZ0aGlzLl9vbkNvbXBsZXRlKCl9LG4ucHJvdG90eXBlLl9vbkNvbXBsZXRlPWZ1bmN0aW9uKCl7UElYSS50aWNrZXIuc2hhcmVkLnJlbW92ZSh0aGlzLl9vblVwZGF0ZSx0aGlzKSx0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLDEsdGhpcy5fZHVyYXRpb24pLHRoaXMuZW1pdChcImVuZFwiLHRoaXMpfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7UElYSS50aWNrZXIuc2hhcmVkLnJlbW92ZSh0aGlzLl9vblVwZGF0ZSx0aGlzKSx0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO3ZhciBlPXRoaXMuX3NvdXJjZTtlJiYoZS5vbmVuZGVkPW51bGwsZS5vbnBsYXk9bnVsbCxlLm9ucGF1c2U9bnVsbCx0aGlzLl9pbnRlcm5hbFN0b3AoKSksdGhpcy5fc291cmNlPW51bGwsdGhpcy5fc3BlZWQ9MSx0aGlzLl92b2x1bWU9MSx0aGlzLl9sb29wPSExLHRoaXMuX2VuZD1udWxsLHRoaXMuX3N0YXJ0PTAsdGhpcy5fZHVyYXRpb249MCx0aGlzLl9wbGF5aW5nPSExLHRoaXMuX3BhdXNlZFJlYWw9ITEsdGhpcy5fcGF1c2VkPSExLHRoaXMuX211dGVkPSExLHRoaXMuX21lZGlhJiYodGhpcy5fbWVkaWEuY29udGV4dC5vZmYoXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLHRoaXMuX21lZGlhLmNvbnRleHQub2ZmKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKSx0aGlzLl9tZWRpYT1udWxsKX0sbi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIltIVE1MQXVkaW9JbnN0YW5jZSBpZD1cIit0aGlzLmlkK1wiXVwifSxuLlBBRERJTkc9LjEsbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLHM9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3JldHVybiBudWxsIT09ZSYmZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl8fHRoaXN9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMucGFyZW50PWUsdGhpcy5fc291cmNlPWUub3B0aW9ucy5zb3VyY2V8fG5ldyBBdWRpbyxlLnVybCYmKHRoaXMuX3NvdXJjZS5zcmM9ZS51cmwpfSxuLnByb3RvdHlwZS5jcmVhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IHIodGhpcyl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImlzUGxheWFibGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuISF0aGlzLl9zb3VyY2UmJjQ9PT10aGlzLl9zb3VyY2UucmVhZHlTdGF0ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJkdXJhdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlLmR1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGFyZW50LmNvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0sc2V0OmZ1bmN0aW9uKGUpe2NvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBmaWx0ZXJzXCIpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMucGFyZW50PW51bGwsdGhpcy5fc291cmNlJiYodGhpcy5fc291cmNlLnNyYz1cIlwiLHRoaXMuX3NvdXJjZS5sb2FkKCksdGhpcy5fc291cmNlPW51bGwpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzb3VyY2VcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX3NvdXJjZSxuPXRoaXMucGFyZW50O2lmKDQ9PT10LnJlYWR5U3RhdGUpe24uaXNMb2FkZWQ9ITA7dmFyIG89bi5hdXRvUGxheVN0YXJ0KCk7cmV0dXJuIHZvaWQoZSYmc2V0VGltZW91dChmdW5jdGlvbigpe2UobnVsbCxuLG8pfSwwKSl9aWYoIW4udXJsKXJldHVybiBlKG5ldyBFcnJvcihcInNvdW5kLnVybCBvciBzb3VuZC5zb3VyY2UgbXVzdCBiZSBzZXRcIikpO3Quc3JjPW4udXJsO3ZhciBpPWZ1bmN0aW9uKCl7dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2FucGxheXRocm91Z2hcIixyKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsciksdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIixzKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLHUpfSxyPWZ1bmN0aW9uKCl7aSgpLG4uaXNMb2FkZWQ9ITA7dmFyIHQ9bi5hdXRvUGxheVN0YXJ0KCk7ZSYmZShudWxsLG4sdCl9LHM9ZnVuY3Rpb24oKXtpKCksZSYmZShuZXcgRXJyb3IoXCJTb3VuZCBsb2FkaW5nIGhhcyBiZWVuIGFib3J0ZWRcIikpfSx1PWZ1bmN0aW9uKCl7aSgpO3ZhciBuPVwiRmFpbGVkIHRvIGxvYWQgYXVkaW8gZWxlbWVudCAoY29kZTogXCIrdC5lcnJvci5jb2RlK1wiKVwiO2U/ZShuZXcgRXJyb3IobikpOmNvbnNvbGUuZXJyb3Iobil9O3QuYWRkRXZlbnRMaXN0ZW5lcihcImNhbnBsYXl0aHJvdWdoXCIsciwhMSksdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLHIsITEpLHQuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIscywhMSksdC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIix1LCExKSx0LmxvYWQoKX0sbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLHU9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjp7fSxhPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHQ9e2V4cG9ydHM6e319LGUodCx0LmV4cG9ydHMpLHQuZXhwb3J0c30oZnVuY3Rpb24oZSl7IWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIG4oKXt9ZnVuY3Rpb24gbyhlLHQpe3JldHVybiBmdW5jdGlvbigpe2UuYXBwbHkodCxhcmd1bWVudHMpfX1mdW5jdGlvbiBpKGUpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiB0aGlzKXRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXdcIik7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGEgZnVuY3Rpb25cIik7dGhpcy5fc3RhdGU9MCx0aGlzLl9oYW5kbGVkPSExLHRoaXMuX3ZhbHVlPXZvaWQgMCx0aGlzLl9kZWZlcnJlZHM9W10sbChlLHRoaXMpfWZ1bmN0aW9uIHIoZSx0KXtmb3IoOzM9PT1lLl9zdGF0ZTspZT1lLl92YWx1ZTtpZigwPT09ZS5fc3RhdGUpcmV0dXJuIHZvaWQgZS5fZGVmZXJyZWRzLnB1c2godCk7ZS5faGFuZGxlZD0hMCxpLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpe3ZhciBuPTE9PT1lLl9zdGF0ZT90Lm9uRnVsZmlsbGVkOnQub25SZWplY3RlZDtpZihudWxsPT09bilyZXR1cm4gdm9pZCgxPT09ZS5fc3RhdGU/czp1KSh0LnByb21pc2UsZS5fdmFsdWUpO3ZhciBvO3RyeXtvPW4oZS5fdmFsdWUpfWNhdGNoKGUpe3JldHVybiB2b2lkIHUodC5wcm9taXNlLGUpfXModC5wcm9taXNlLG8pfSl9ZnVuY3Rpb24gcyhlLHQpe3RyeXtpZih0PT09ZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi5cIik7aWYodCYmKFwib2JqZWN0XCI9PXR5cGVvZiB0fHxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0KSl7dmFyIG49dC50aGVuO2lmKHQgaW5zdGFuY2VvZiBpKXJldHVybiBlLl9zdGF0ZT0zLGUuX3ZhbHVlPXQsdm9pZCBhKGUpO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG4pcmV0dXJuIHZvaWQgbChvKG4sdCksZSl9ZS5fc3RhdGU9MSxlLl92YWx1ZT10LGEoZSl9Y2F0Y2godCl7dShlLHQpfX1mdW5jdGlvbiB1KGUsdCl7ZS5fc3RhdGU9MixlLl92YWx1ZT10LGEoZSl9ZnVuY3Rpb24gYShlKXsyPT09ZS5fc3RhdGUmJjA9PT1lLl9kZWZlcnJlZHMubGVuZ3RoJiZpLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpe2UuX2hhbmRsZWR8fGkuX3VuaGFuZGxlZFJlamVjdGlvbkZuKGUuX3ZhbHVlKX0pO2Zvcih2YXIgdD0wLG49ZS5fZGVmZXJyZWRzLmxlbmd0aDt0PG47dCsrKXIoZSxlLl9kZWZlcnJlZHNbdF0pO2UuX2RlZmVycmVkcz1udWxsfWZ1bmN0aW9uIGMoZSx0LG4pe3RoaXMub25GdWxmaWxsZWQ9XCJmdW5jdGlvblwiPT10eXBlb2YgZT9lOm51bGwsdGhpcy5vblJlamVjdGVkPVwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dDpudWxsLHRoaXMucHJvbWlzZT1ufWZ1bmN0aW9uIGwoZSx0KXt2YXIgbj0hMTt0cnl7ZShmdW5jdGlvbihlKXtufHwobj0hMCxzKHQsZSkpfSxmdW5jdGlvbihlKXtufHwobj0hMCx1KHQsZSkpfSl9Y2F0Y2goZSl7aWYobilyZXR1cm47bj0hMCx1KHQsZSl9fXZhciBwPXNldFRpbWVvdXQ7aS5wcm90b3R5cGUuY2F0Y2g9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMudGhlbihudWxsLGUpfSxpLnByb3RvdHlwZS50aGVuPWZ1bmN0aW9uKGUsdCl7dmFyIG89bmV3IHRoaXMuY29uc3RydWN0b3Iobik7cmV0dXJuIHIodGhpcyxuZXcgYyhlLHQsbykpLG99LGkuYWxsPWZ1bmN0aW9uKGUpe3ZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGUpO3JldHVybiBuZXcgaShmdW5jdGlvbihlLG4pe2Z1bmN0aW9uIG8ocixzKXt0cnl7aWYocyYmKFwib2JqZWN0XCI9PXR5cGVvZiBzfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBzKSl7dmFyIHU9cy50aGVuO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHUpcmV0dXJuIHZvaWQgdS5jYWxsKHMsZnVuY3Rpb24oZSl7byhyLGUpfSxuKX10W3JdPXMsMD09LS1pJiZlKHQpfWNhdGNoKGUpe24oZSl9fWlmKDA9PT10Lmxlbmd0aClyZXR1cm4gZShbXSk7Zm9yKHZhciBpPXQubGVuZ3RoLHI9MDtyPHQubGVuZ3RoO3IrKylvKHIsdFtyXSl9KX0saS5yZXNvbHZlPWZ1bmN0aW9uKGUpe3JldHVybiBlJiZcIm9iamVjdFwiPT10eXBlb2YgZSYmZS5jb25zdHJ1Y3Rvcj09PWk/ZTpuZXcgaShmdW5jdGlvbih0KXt0KGUpfSl9LGkucmVqZWN0PWZ1bmN0aW9uKGUpe3JldHVybiBuZXcgaShmdW5jdGlvbih0LG4pe24oZSl9KX0saS5yYWNlPWZ1bmN0aW9uKGUpe3JldHVybiBuZXcgaShmdW5jdGlvbih0LG4pe2Zvcih2YXIgbz0wLGk9ZS5sZW5ndGg7bzxpO28rKyllW29dLnRoZW4odCxuKX0pfSxpLl9pbW1lZGlhdGVGbj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBzZXRJbW1lZGlhdGUmJmZ1bmN0aW9uKGUpe3NldEltbWVkaWF0ZShlKX18fGZ1bmN0aW9uKGUpe3AoZSwwKX0saS5fdW5oYW5kbGVkUmVqZWN0aW9uRm49ZnVuY3Rpb24oZSl7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGNvbnNvbGUmJmNvbnNvbGUmJmNvbnNvbGUud2FybihcIlBvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjpcIixlKX0saS5fc2V0SW1tZWRpYXRlRm49ZnVuY3Rpb24oZSl7aS5faW1tZWRpYXRlRm49ZX0saS5fc2V0VW5oYW5kbGVkUmVqZWN0aW9uRm49ZnVuY3Rpb24oZSl7aS5fdW5oYW5kbGVkUmVqZWN0aW9uRm49ZX0sZS5leHBvcnRzP2UuZXhwb3J0cz1pOnQuUHJvbWlzZXx8KHQuUHJvbWlzZT1pKX0odSl9KSxjPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMuZGVzdGluYXRpb249ZSx0aGlzLnNvdXJjZT10fHxlfXJldHVybiBlLnByb3RvdHlwZS5jb25uZWN0PWZ1bmN0aW9uKGUpe3RoaXMuc291cmNlLmNvbm5lY3QoZSl9LGUucHJvdG90eXBlLmRpc2Nvbm5lY3Q9ZnVuY3Rpb24oKXt0aGlzLnNvdXJjZS5kaXNjb25uZWN0KCl9LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmRpc2Nvbm5lY3QoKSx0aGlzLmRlc3RpbmF0aW9uPW51bGwsdGhpcy5zb3VyY2U9bnVsbH0sZX0oKSxsPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5zZXRQYXJhbVZhbHVlPWZ1bmN0aW9uKGUsdCl7aWYoZS5zZXRWYWx1ZUF0VGltZSl7dmFyIG49Uy5pbnN0YW5jZS5jb250ZXh0O2Uuc2V0VmFsdWVBdFRpbWUodCxuLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSl9ZWxzZSBlLnZhbHVlPXQ7cmV0dXJuIHR9LGV9KCkscD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQsbyxpLHIscyx1LGEsYyxwLGgpe3ZvaWQgMD09PXQmJih0PTApLHZvaWQgMD09PW8mJihvPTApLHZvaWQgMD09PWkmJihpPTApLHZvaWQgMD09PXImJihyPTApLHZvaWQgMD09PXMmJihzPTApLHZvaWQgMD09PXUmJih1PTApLHZvaWQgMD09PWEmJihhPTApLHZvaWQgMD09PWMmJihjPTApLHZvaWQgMD09PXAmJihwPTApLHZvaWQgMD09PWgmJihoPTApO3ZhciBkPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQoZD1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIGY9W3tmOm4uRjMyLHR5cGU6XCJsb3dzaGVsZlwiLGdhaW46dH0se2Y6bi5GNjQsdHlwZTpcInBlYWtpbmdcIixnYWluOm99LHtmOm4uRjEyNSx0eXBlOlwicGVha2luZ1wiLGdhaW46aX0se2Y6bi5GMjUwLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpyfSx7ZjpuLkY1MDAsdHlwZTpcInBlYWtpbmdcIixnYWluOnN9LHtmOm4uRjFLLHR5cGU6XCJwZWFraW5nXCIsZ2Fpbjp1fSx7ZjpuLkYySyx0eXBlOlwicGVha2luZ1wiLGdhaW46YX0se2Y6bi5GNEssdHlwZTpcInBlYWtpbmdcIixnYWluOmN9LHtmOm4uRjhLLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpwfSx7ZjpuLkYxNkssdHlwZTpcImhpZ2hzaGVsZlwiLGdhaW46aH1dLm1hcChmdW5jdGlvbihlKXt2YXIgdD1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO3JldHVybiB0LnR5cGU9ZS50eXBlLGwuc2V0UGFyYW1WYWx1ZSh0LmdhaW4sZS5nYWluKSxsLnNldFBhcmFtVmFsdWUodC5RLDEpLGwuc2V0UGFyYW1WYWx1ZSh0LmZyZXF1ZW5jeSxlLmYpLHR9KTsoZD1lLmNhbGwodGhpcyxmWzBdLGZbZi5sZW5ndGgtMV0pfHx0aGlzKS5iYW5kcz1mLGQuYmFuZHNNYXA9e307Zm9yKHZhciBfPTA7XzxkLmJhbmRzLmxlbmd0aDtfKyspe3ZhciB5PWQuYmFuZHNbX107Xz4wJiZkLmJhbmRzW18tMV0uY29ubmVjdCh5KSxkLmJhbmRzTWFwW3kuZnJlcXVlbmN5LnZhbHVlXT15fXJldHVybiBkfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuc2V0R2Fpbj1mdW5jdGlvbihlLHQpe2lmKHZvaWQgMD09PXQmJih0PTApLCF0aGlzLmJhbmRzTWFwW2VdKXRocm93XCJObyBiYW5kIGZvdW5kIGZvciBmcmVxdWVuY3kgXCIrZTtsLnNldFBhcmFtVmFsdWUodGhpcy5iYW5kc01hcFtlXS5nYWluLHQpfSxuLnByb3RvdHlwZS5nZXRHYWluPWZ1bmN0aW9uKGUpe2lmKCF0aGlzLmJhbmRzTWFwW2VdKXRocm93XCJObyBiYW5kIGZvdW5kIGZvciBmcmVxdWVuY3kgXCIrZTtyZXR1cm4gdGhpcy5iYW5kc01hcFtlXS5nYWluLnZhbHVlfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMzJcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYzMil9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMzIsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjY0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GNjQpfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjY0LGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYxMjVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYxMjUpfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjEyNSxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMjUwXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMjUwKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYyNTAsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjUwMFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjUwMCl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GNTAwLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYxa1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjFLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYxSyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMmtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYySyl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMkssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjRrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GNEspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjRLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY4a1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjhLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY4SyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMTZrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMTZLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYxNkssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLmJhbmRzLmZvckVhY2goZnVuY3Rpb24oZSl7bC5zZXRQYXJhbVZhbHVlKGUuZ2FpbiwwKX0pfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5iYW5kcy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UuZGlzY29ubmVjdCgpfSksdGhpcy5iYW5kcz1udWxsLHRoaXMuYmFuZHNNYXA9bnVsbH0sbi5GMzI9MzIsbi5GNjQ9NjQsbi5GMTI1PTEyNSxuLkYyNTA9MjUwLG4uRjUwMD01MDAsbi5GMUs9MWUzLG4uRjJLPTJlMyxuLkY0Sz00ZTMsbi5GOEs9OGUzLG4uRjE2Sz0xNmUzLG59KGMpLGg9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2b2lkIDA9PT10JiYodD0wKTt2YXIgbj10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKG49ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBvPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlV2F2ZVNoYXBlcigpO3JldHVybiBuPWUuY2FsbCh0aGlzLG8pfHx0aGlzLG4uX2Rpc3RvcnRpb249byxuLmFtb3VudD10LG59cmV0dXJuIHQobixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJhbW91bnRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Ftb3VudH0sc2V0OmZ1bmN0aW9uKGUpe2UqPTFlMyx0aGlzLl9hbW91bnQ9ZTtmb3IodmFyIHQsbj1uZXcgRmxvYXQzMkFycmF5KDQ0MTAwKSxvPU1hdGguUEkvMTgwLGk9MDtpPDQ0MTAwOysraSl0PTIqaS80NDEwMC0xLG5baV09KDMrZSkqdCoyMCpvLyhNYXRoLlBJK2UqTWF0aC5hYnModCkpO3RoaXMuX2Rpc3RvcnRpb24uY3VydmU9bix0aGlzLl9kaXN0b3J0aW9uLm92ZXJzYW1wbGU9XCI0eFwifSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9kaXN0b3J0aW9uPW51bGwsZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpfSxufShjKSxkPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dm9pZCAwPT09dCYmKHQ9MCk7dmFyIG49dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChuPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgbyxpLHIscz1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0O3JldHVybiBzLmNyZWF0ZVN0ZXJlb1Bhbm5lcj9yPW89cy5jcmVhdGVTdGVyZW9QYW5uZXIoKTooKGk9cy5jcmVhdGVQYW5uZXIoKSkucGFubmluZ01vZGVsPVwiZXF1YWxwb3dlclwiLHI9aSksbj1lLmNhbGwodGhpcyxyKXx8dGhpcyxuLl9zdGVyZW89byxuLl9wYW5uZXI9aSxuLnBhbj10LG59cmV0dXJuIHQobixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYW5cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bhbn0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3Bhbj1lLHRoaXMuX3N0ZXJlbz9sLnNldFBhcmFtVmFsdWUodGhpcy5fc3RlcmVvLnBhbixlKTp0aGlzLl9wYW5uZXIuc2V0UG9zaXRpb24oZSwwLDEtTWF0aC5hYnMoZSkpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyksdGhpcy5fc3RlcmVvPW51bGwsdGhpcy5fcGFubmVyPW51bGx9LG59KGMpLGY9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG4sbyl7dm9pZCAwPT09dCYmKHQ9Myksdm9pZCAwPT09biYmKG49Miksdm9pZCAwPT09byYmKG89ITEpO3ZhciBpPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQoaT1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIHI9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVDb252b2x2ZXIoKTtyZXR1cm4gaT1lLmNhbGwodGhpcyxyKXx8dGhpcyxpLl9jb252b2x2ZXI9cixpLl9zZWNvbmRzPWkuX2NsYW1wKHQsMSw1MCksaS5fZGVjYXk9aS5fY2xhbXAobiwwLDEwMCksaS5fcmV2ZXJzZT1vLGkuX3JlYnVpbGQoKSxpfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuX2NsYW1wPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gTWF0aC5taW4obixNYXRoLm1heCh0LGUpKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic2Vjb25kc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Vjb25kc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NlY29uZHM9dGhpcy5fY2xhbXAoZSwxLDUwKSx0aGlzLl9yZWJ1aWxkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZGVjYXlcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2RlY2F5fSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fZGVjYXk9dGhpcy5fY2xhbXAoZSwwLDEwMCksdGhpcy5fcmVidWlsZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInJldmVyc2VcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JldmVyc2V9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9yZXZlcnNlPWUsdGhpcy5fcmVidWlsZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLl9yZWJ1aWxkPWZ1bmN0aW9uKCl7Zm9yKHZhciBlLHQ9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dCxuPXQuc2FtcGxlUmF0ZSxvPW4qdGhpcy5fc2Vjb25kcyxpPXQuY3JlYXRlQnVmZmVyKDIsbyxuKSxyPWkuZ2V0Q2hhbm5lbERhdGEoMCkscz1pLmdldENoYW5uZWxEYXRhKDEpLHU9MDt1PG87dSsrKWU9dGhpcy5fcmV2ZXJzZT9vLXU6dSxyW3VdPSgyKk1hdGgucmFuZG9tKCktMSkqTWF0aC5wb3coMS1lL28sdGhpcy5fZGVjYXkpLHNbdV09KDIqTWF0aC5yYW5kb20oKS0xKSpNYXRoLnBvdygxLWUvbyx0aGlzLl9kZWNheSk7dGhpcy5fY29udm9sdmVyLmJ1ZmZlcj1pfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fY29udm9sdmVyPW51bGwsZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpfSxufShjKSxfPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt2YXIgdD10aGlzO1MuaW5zdGFuY2UudXNlTGVnYWN5JiYodD1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIG49Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dCxvPW4uY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKCksaT1uLmNyZWF0ZUNoYW5uZWxNZXJnZXIoKTtyZXR1cm4gaS5jb25uZWN0KG8pLHQ9ZS5jYWxsKHRoaXMsaSxvKXx8dGhpcyx0Ll9tZXJnZXI9aSx0fXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX21lcmdlci5kaXNjb25uZWN0KCksdGhpcy5fbWVyZ2VyPW51bGwsZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpfSxufShjKSx5PWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXtpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChlLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIHQ9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dCxuPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCksbz10LmNyZWF0ZUJpcXVhZEZpbHRlcigpLGk9dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxyPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7cmV0dXJuIG4udHlwZT1cImxvd3Bhc3NcIixsLnNldFBhcmFtVmFsdWUobi5mcmVxdWVuY3ksMmUzKSxvLnR5cGU9XCJsb3dwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKG8uZnJlcXVlbmN5LDJlMyksaS50eXBlPVwiaGlnaHBhc3NcIixsLnNldFBhcmFtVmFsdWUoaS5mcmVxdWVuY3ksNTAwKSxyLnR5cGU9XCJoaWdocGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShyLmZyZXF1ZW5jeSw1MDApLG4uY29ubmVjdChvKSxvLmNvbm5lY3QoaSksaS5jb25uZWN0KHIpLGUuY2FsbCh0aGlzLG4scil8fHRoaXN9cmV0dXJuIHQobixlKSxufShjKSxtPU9iamVjdC5mcmVlemUoe0ZpbHRlcjpjLEVxdWFsaXplckZpbHRlcjpwLERpc3RvcnRpb25GaWx0ZXI6aCxTdGVyZW9GaWx0ZXI6ZCxSZXZlcmJGaWx0ZXI6ZixNb25vRmlsdGVyOl8sVGVsZXBob25lRmlsdGVyOnl9KSxiPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt2YXIgdD1lLmNhbGwodGhpcyl8fHRoaXM7cmV0dXJuIHQuc3BlZWQ9MSx0LnZvbHVtZT0xLHQubXV0ZWQ9ITEsdC5wYXVzZWQ9ITEsdH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJyZWZyZXNoXCIpfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwicmVmcmVzaFBhdXNlZFwiKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGZpbHRlcnNcIiksbnVsbH0sc2V0OmZ1bmN0aW9uKGUpe2NvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBmaWx0ZXJzXCIpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGF1ZGlvQ29udGV4dFwiKSxudWxsfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnRvZ2dsZU11dGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tdXRlZD0hdGhpcy5tdXRlZCx0aGlzLnJlZnJlc2goKSx0aGlzLm11dGVkfSxuLnByb3RvdHlwZS50b2dnbGVQYXVzZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdXNlZD0hdGhpcy5wYXVzZWQsdGhpcy5yZWZyZXNoUGF1c2VkKCksdGhpcy5wYXVzZWR9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpfSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlciksZz1PYmplY3QuZnJlZXplKHtIVE1MQXVkaW9NZWRpYTpzLEhUTUxBdWRpb0luc3RhbmNlOnIsSFRNTEF1ZGlvQ29udGV4dDpifSksdj0wLFA9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2YXIgbj1lLmNhbGwodGhpcyl8fHRoaXM7cmV0dXJuIG4uaWQ9disrLG4uX21lZGlhPW51bGwsbi5fcGF1c2VkPSExLG4uX211dGVkPSExLG4uX2VsYXBzZWQ9MCxuLl91cGRhdGVMaXN0ZW5lcj1uLl91cGRhdGUuYmluZChuKSxuLmluaXQodCksbn1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJih0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJzdG9wXCIpKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic3BlZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc3BlZWQ9ZSx0aGlzLnJlZnJlc2goKSx0aGlzLl91cGRhdGUoITApfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInZvbHVtZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fdm9sdW1lPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibXV0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX211dGVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbXV0ZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJsb29wXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9sb29wfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbG9vcD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50O3RoaXMuX3NvdXJjZS5sb29wPXRoaXMuX2xvb3B8fHQubG9vcDt2YXIgbj1lLnZvbHVtZSooZS5tdXRlZD8wOjEpLG89dC52b2x1bWUqKHQubXV0ZWQ/MDoxKSxpPXRoaXMuX3ZvbHVtZSoodGhpcy5fbXV0ZWQ/MDoxKTtsLnNldFBhcmFtVmFsdWUodGhpcy5fZ2Fpbi5nYWluLGkqbypuKSxsLnNldFBhcmFtVmFsdWUodGhpcy5fc291cmNlLnBsYXliYWNrUmF0ZSx0aGlzLl9zcGVlZCp0LnNwZWVkKmUuc3BlZWQpfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudCxuPXRoaXMuX3BhdXNlZHx8dC5wYXVzZWR8fGUucGF1c2VkO24hPT10aGlzLl9wYXVzZWRSZWFsJiYodGhpcy5fcGF1c2VkUmVhbD1uLG4/KHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInBhdXNlZFwiKSk6KHRoaXMuZW1pdChcInJlc3VtZWRcIiksdGhpcy5wbGF5KHtzdGFydDp0aGlzLl9lbGFwc2VkJXRoaXMuX2R1cmF0aW9uLGVuZDp0aGlzLl9lbmQsc3BlZWQ6dGhpcy5fc3BlZWQsbG9vcDp0aGlzLl9sb29wLHZvbHVtZTp0aGlzLl92b2x1bWV9KSksdGhpcy5lbWl0KFwicGF1c2VcIixuKSl9LG4ucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5zdGFydCxuPWUuZW5kLG89ZS5zcGVlZCxpPWUubG9vcCxyPWUudm9sdW1lLHM9ZS5tdXRlZDtuJiZjb25zb2xlLmFzc2VydChuPnQsXCJFbmQgdGltZSBpcyBiZWZvcmUgc3RhcnQgdGltZVwiKSx0aGlzLl9wYXVzZWQ9ITE7dmFyIHU9dGhpcy5fbWVkaWEubm9kZXMuY2xvbmVCdWZmZXJTb3VyY2UoKSxhPXUuc291cmNlLGM9dS5nYWluO3RoaXMuX3NvdXJjZT1hLHRoaXMuX2dhaW49Yyx0aGlzLl9zcGVlZD1vLHRoaXMuX3ZvbHVtZT1yLHRoaXMuX2xvb3A9ISFpLHRoaXMuX211dGVkPXMsdGhpcy5yZWZyZXNoKCksdGhpcy5sb29wJiZudWxsIT09biYmKGNvbnNvbGUud2FybignTG9vcGluZyBub3Qgc3VwcG9ydCB3aGVuIHNwZWNpZnlpbmcgYW4gXCJlbmRcIiB0aW1lJyksdGhpcy5sb29wPSExKSx0aGlzLl9lbmQ9bjt2YXIgbD10aGlzLl9zb3VyY2UuYnVmZmVyLmR1cmF0aW9uO3RoaXMuX2R1cmF0aW9uPWwsdGhpcy5fbGFzdFVwZGF0ZT10aGlzLl9ub3coKSx0aGlzLl9lbGFwc2VkPXQsdGhpcy5fc291cmNlLm9uZW5kZWQ9dGhpcy5fb25Db21wbGV0ZS5iaW5kKHRoaXMpLG4/dGhpcy5fc291cmNlLnN0YXJ0KDAsdCxuLXQpOnRoaXMuX3NvdXJjZS5zdGFydCgwLHQpLHRoaXMuZW1pdChcInN0YXJ0XCIpLHRoaXMuX3VwZGF0ZSghMCksdGhpcy5fZW5hYmxlZD0hMH0sbi5wcm90b3R5cGUuX3RvU2VjPWZ1bmN0aW9uKGUpe3JldHVybiBlPjEwJiYoZS89MWUzKSxlfHwwfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJfZW5hYmxlZFwiLHtzZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5fbWVkaWEubm9kZXMuc2NyaXB0O3QucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImF1ZGlvcHJvY2Vzc1wiLHRoaXMuX3VwZGF0ZUxpc3RlbmVyKSxlJiZ0LmFkZEV2ZW50TGlzdGVuZXIoXCJhdWRpb3Byb2Nlc3NcIix0aGlzLl91cGRhdGVMaXN0ZW5lcil9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicHJvZ3Jlc3NcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Byb2dyZXNzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGF1c2VkPWUsdGhpcy5yZWZyZXNoUGF1c2VkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCksdGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5fc291cmNlJiYodGhpcy5fc291cmNlLmRpc2Nvbm5lY3QoKSx0aGlzLl9zb3VyY2U9bnVsbCksdGhpcy5fZ2FpbiYmKHRoaXMuX2dhaW4uZGlzY29ubmVjdCgpLHRoaXMuX2dhaW49bnVsbCksdGhpcy5fbWVkaWEmJih0aGlzLl9tZWRpYS5jb250ZXh0LmV2ZW50cy5vZmYoXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLHRoaXMuX21lZGlhLmNvbnRleHQuZXZlbnRzLm9mZihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyksdGhpcy5fbWVkaWE9bnVsbCksdGhpcy5fZW5kPW51bGwsdGhpcy5fc3BlZWQ9MSx0aGlzLl92b2x1bWU9MSx0aGlzLl9sb29wPSExLHRoaXMuX2VsYXBzZWQ9MCx0aGlzLl9kdXJhdGlvbj0wLHRoaXMuX3BhdXNlZD0hMSx0aGlzLl9tdXRlZD0hMSx0aGlzLl9wYXVzZWRSZWFsPSExfSxuLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiW1dlYkF1ZGlvSW5zdGFuY2UgaWQ9XCIrdGhpcy5pZCtcIl1cIn0sbi5wcm90b3R5cGUuX25vdz1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9tZWRpYS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZX0sbi5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbihlKXtpZih2b2lkIDA9PT1lJiYoZT0hMSksdGhpcy5fc291cmNlKXt2YXIgdD10aGlzLl9ub3coKSxuPXQtdGhpcy5fbGFzdFVwZGF0ZTtpZihuPjB8fGUpe3ZhciBvPXRoaXMuX3NvdXJjZS5wbGF5YmFja1JhdGUudmFsdWU7dGhpcy5fZWxhcHNlZCs9bipvLHRoaXMuX2xhc3RVcGRhdGU9dDt2YXIgaT10aGlzLl9kdXJhdGlvbixyPXRoaXMuX2VsYXBzZWQlaS9pO3RoaXMuX3Byb2dyZXNzPXIsdGhpcy5lbWl0KFwicHJvZ3Jlc3NcIix0aGlzLl9wcm9ncmVzcyxpKX19fSxuLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMuX21lZGlhPWUsZS5jb250ZXh0LmV2ZW50cy5vbihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksZS5jb250ZXh0LmV2ZW50cy5vbihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyl9LG4ucHJvdG90eXBlLl9pbnRlcm5hbFN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJih0aGlzLl9lbmFibGVkPSExLHRoaXMuX3NvdXJjZS5vbmVuZGVkPW51bGwsdGhpcy5fc291cmNlLnN0b3AoKSx0aGlzLl9zb3VyY2U9bnVsbCl9LG4ucHJvdG90eXBlLl9vbkNvbXBsZXRlPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiYodGhpcy5fZW5hYmxlZD0hMSx0aGlzLl9zb3VyY2Uub25lbmRlZD1udWxsKSx0aGlzLl9zb3VyY2U9bnVsbCx0aGlzLl9wcm9ncmVzcz0xLHRoaXMuZW1pdChcInByb2dyZXNzXCIsMSx0aGlzLl9kdXJhdGlvbiksdGhpcy5lbWl0KFwiZW5kXCIsdGhpcyl9LG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSx4PWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dmFyIG89dGhpcyxpPXQuYXVkaW9Db250ZXh0LHI9aS5jcmVhdGVCdWZmZXJTb3VyY2UoKSxzPWkuY3JlYXRlU2NyaXB0UHJvY2Vzc29yKG4uQlVGRkVSX1NJWkUpLHU9aS5jcmVhdGVHYWluKCksYT1pLmNyZWF0ZUFuYWx5c2VyKCk7cmV0dXJuIHIuY29ubmVjdChhKSxhLmNvbm5lY3QodSksdS5jb25uZWN0KHQuZGVzdGluYXRpb24pLHMuY29ubmVjdCh0LmRlc3RpbmF0aW9uKSxvPWUuY2FsbCh0aGlzLGEsdSl8fHRoaXMsby5jb250ZXh0PXQsby5idWZmZXJTb3VyY2U9cixvLnNjcmlwdD1zLG8uZ2Fpbj11LG8uYW5hbHlzZXI9YSxvfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2UucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKSx0aGlzLmJ1ZmZlclNvdXJjZS5kaXNjb25uZWN0KCksdGhpcy5zY3JpcHQuZGlzY29ubmVjdCgpLHRoaXMuZ2Fpbi5kaXNjb25uZWN0KCksdGhpcy5hbmFseXNlci5kaXNjb25uZWN0KCksdGhpcy5idWZmZXJTb3VyY2U9bnVsbCx0aGlzLnNjcmlwdD1udWxsLHRoaXMuZ2Fpbj1udWxsLHRoaXMuYW5hbHlzZXI9bnVsbCx0aGlzLmNvbnRleHQ9bnVsbH0sbi5wcm90b3R5cGUuY2xvbmVCdWZmZXJTb3VyY2U9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmJ1ZmZlclNvdXJjZSx0PXRoaXMuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7dC5idWZmZXI9ZS5idWZmZXIsbC5zZXRQYXJhbVZhbHVlKHQucGxheWJhY2tSYXRlLGUucGxheWJhY2tSYXRlLnZhbHVlKSx0Lmxvb3A9ZS5sb29wO3ZhciBuPXRoaXMuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO3JldHVybiB0LmNvbm5lY3Qobiksbi5jb25uZWN0KHRoaXMuZGVzdGluYXRpb24pLHtzb3VyY2U6dCxnYWluOm59fSxuLkJVRkZFUl9TSVpFPTI1NixufShuKSxPPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLnBhcmVudD1lLHRoaXMuX25vZGVzPW5ldyB4KHRoaXMuY29udGV4dCksdGhpcy5fc291cmNlPXRoaXMuX25vZGVzLmJ1ZmZlclNvdXJjZSx0aGlzLnNvdXJjZT1lLm9wdGlvbnMuc291cmNlfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5wYXJlbnQ9bnVsbCx0aGlzLl9ub2Rlcy5kZXN0cm95KCksdGhpcy5fbm9kZXM9bnVsbCx0aGlzLl9zb3VyY2U9bnVsbCx0aGlzLnNvdXJjZT1udWxsfSxlLnByb3RvdHlwZS5jcmVhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IFAodGhpcyl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGFyZW50LmNvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiaXNQbGF5YWJsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4hIXRoaXMuX3NvdXJjZSYmISF0aGlzLl9zb3VyY2UuYnVmZmVyfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX25vZGVzLmZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9ub2Rlcy5maWx0ZXJzPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZHVyYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNvbnNvbGUuYXNzZXJ0KHRoaXMuaXNQbGF5YWJsZSxcIlNvdW5kIG5vdCB5ZXQgcGxheWFibGUsIG5vIGR1cmF0aW9uXCIpLHRoaXMuX3NvdXJjZS5idWZmZXIuZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiYnVmZmVyXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2UuYnVmZmVyfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc291cmNlLmJ1ZmZlcj1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcIm5vZGVzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9ub2Rlc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGUpe3RoaXMuc291cmNlP3RoaXMuX2RlY29kZSh0aGlzLnNvdXJjZSxlKTp0aGlzLnBhcmVudC51cmw/dGhpcy5fbG9hZFVybChlKTplP2UobmV3IEVycm9yKFwic291bmQudXJsIG9yIHNvdW5kLnNvdXJjZSBtdXN0IGJlIHNldFwiKSk6Y29uc29sZS5lcnJvcihcInNvdW5kLnVybCBvciBzb3VuZC5zb3VyY2UgbXVzdCBiZSBzZXRcIil9LGUucHJvdG90eXBlLl9sb2FkVXJsPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMsbj1uZXcgWE1MSHR0cFJlcXVlc3Qsbz10aGlzLnBhcmVudC51cmw7bi5vcGVuKFwiR0VUXCIsbywhMCksbi5yZXNwb25zZVR5cGU9XCJhcnJheWJ1ZmZlclwiLG4ub25sb2FkPWZ1bmN0aW9uKCl7dC5zb3VyY2U9bi5yZXNwb25zZSx0Ll9kZWNvZGUobi5yZXNwb25zZSxlKX0sbi5zZW5kKCl9LGUucHJvdG90eXBlLl9kZWNvZGU9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzO3RoaXMucGFyZW50LmNvbnRleHQuZGVjb2RlKGUsZnVuY3Rpb24oZSxvKXtpZihlKXQmJnQoZSk7ZWxzZXtuLnBhcmVudC5pc0xvYWRlZD0hMCxuLmJ1ZmZlcj1vO3ZhciBpPW4ucGFyZW50LmF1dG9QbGF5U3RhcnQoKTt0JiZ0KG51bGwsbi5wYXJlbnQsaSl9fSl9LGV9KCksdz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUucmVzb2x2ZVVybD1mdW5jdGlvbih0KXt2YXIgbj1lLkZPUk1BVF9QQVRURVJOLG89XCJzdHJpbmdcIj09dHlwZW9mIHQ/dDp0LnVybDtpZihuLnRlc3Qobykpe2Zvcih2YXIgaT1uLmV4ZWMobykscj1pWzJdLnNwbGl0KFwiLFwiKSxzPXJbci5sZW5ndGgtMV0sdT0wLGE9ci5sZW5ndGg7dTxhO3UrKyl7dmFyIGM9clt1XTtpZihlLnN1cHBvcnRlZFtjXSl7cz1jO2JyZWFrfX12YXIgbD1vLnJlcGxhY2UoaVsxXSxzKTtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2YgdCYmKHQuZXh0ZW5zaW9uPXMsdC51cmw9bCksbH1yZXR1cm4gb30sZS5zaW5lVG9uZT1mdW5jdGlvbihlLHQpe3ZvaWQgMD09PWUmJihlPTIwMCksdm9pZCAwPT09dCYmKHQ9MSk7dmFyIG49SS5mcm9tKHtzaW5nbGVJbnN0YW5jZTohMH0pO2lmKCEobi5tZWRpYSBpbnN0YW5jZW9mIE8pKXJldHVybiBuO2Zvcih2YXIgbz1uLm1lZGlhLGk9bi5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSw0OGUzKnQsNDhlMykscj1pLmdldENoYW5uZWxEYXRhKDApLHM9MDtzPHIubGVuZ3RoO3MrKyl7dmFyIHU9ZSoocy9pLnNhbXBsZVJhdGUpKk1hdGguUEk7cltzXT0yKk1hdGguc2luKHUpfXJldHVybiBvLmJ1ZmZlcj1pLG4uaXNMb2FkZWQ9ITAsbn0sZS5yZW5kZXI9ZnVuY3Rpb24oZSx0KXt2YXIgbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3Q9T2JqZWN0LmFzc2lnbih7d2lkdGg6NTEyLGhlaWdodDoxMjgsZmlsbDpcImJsYWNrXCJ9LHR8fHt9KSxuLndpZHRoPXQud2lkdGgsbi5oZWlnaHQ9dC5oZWlnaHQ7dmFyIG89UElYSS5CYXNlVGV4dHVyZS5mcm9tQ2FudmFzKG4pO2lmKCEoZS5tZWRpYSBpbnN0YW5jZW9mIE8pKXJldHVybiBvO3ZhciBpPWUubWVkaWE7Y29uc29sZS5hc3NlcnQoISFpLmJ1ZmZlcixcIk5vIGJ1ZmZlciBmb3VuZCwgbG9hZCBmaXJzdFwiKTt2YXIgcj1uLmdldENvbnRleHQoXCIyZFwiKTtyLmZpbGxTdHlsZT10LmZpbGw7Zm9yKHZhciBzPWkuYnVmZmVyLmdldENoYW5uZWxEYXRhKDApLHU9TWF0aC5jZWlsKHMubGVuZ3RoL3Qud2lkdGgpLGE9dC5oZWlnaHQvMixjPTA7Yzx0LndpZHRoO2MrKyl7Zm9yKHZhciBsPTEscD0tMSxoPTA7aDx1O2grKyl7dmFyIGQ9c1tjKnUraF07ZDxsJiYobD1kKSxkPnAmJihwPWQpfXIuZmlsbFJlY3QoYywoMStsKSphLDEsTWF0aC5tYXgoMSwocC1sKSphKSl9cmV0dXJuIG99LGUucGxheU9uY2U9ZnVuY3Rpb24odCxuKXt2YXIgbz1cImFsaWFzXCIrZS5QTEFZX0lEKys7cmV0dXJuIFMuaW5zdGFuY2UuYWRkKG8se3VybDp0LHByZWxvYWQ6ITAsYXV0b1BsYXk6ITAsbG9hZGVkOmZ1bmN0aW9uKGUpe2UmJihjb25zb2xlLmVycm9yKGUpLFMuaW5zdGFuY2UucmVtb3ZlKG8pLG4mJm4oZSkpfSxjb21wbGV0ZTpmdW5jdGlvbigpe1MuaW5zdGFuY2UucmVtb3ZlKG8pLG4mJm4obnVsbCl9fSksb30sZS5QTEFZX0lEPTAsZS5GT1JNQVRfUEFUVEVSTj0vXFwuKFxceyhbXlxcfV0rKVxcfSkoXFw/LiopPyQvLGUuZXh0ZW5zaW9ucz1bXCJtcDNcIixcIm9nZ1wiLFwib2dhXCIsXCJvcHVzXCIsXCJtcGVnXCIsXCJ3YXZcIixcIm00YVwiLFwibXA0XCIsXCJhaWZmXCIsXCJ3bWFcIixcIm1pZFwiXSxlLnN1cHBvcnRlZD1mdW5jdGlvbigpe3ZhciB0PXttNGE6XCJtcDRcIixvZ2E6XCJvZ2dcIn0sbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIiksbz17fTtyZXR1cm4gZS5leHRlbnNpb25zLmZvckVhY2goZnVuY3Rpb24oZSl7dmFyIGk9dFtlXXx8ZSxyPW4uY2FuUGxheVR5cGUoXCJhdWRpby9cIitlKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxzPW4uY2FuUGxheVR5cGUoXCJhdWRpby9cIitpKS5yZXBsYWNlKC9ebm8kLyxcIlwiKTtvW2VdPSEhcnx8ISFzfSksT2JqZWN0LmZyZWV6ZShvKX0oKSxlfSgpLGo9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG4pe3ZhciBvPWUuY2FsbCh0aGlzLHQsbil8fHRoaXM7cmV0dXJuIG8udXNlKEEucGx1Z2luKSxvLnByZShBLnJlc29sdmUpLG99cmV0dXJuIHQobixlKSxuLmFkZFBpeGlNaWRkbGV3YXJlPWZ1bmN0aW9uKHQpe2UuYWRkUGl4aU1pZGRsZXdhcmUuY2FsbCh0aGlzLHQpfSxufShQSVhJLmxvYWRlcnMuTG9hZGVyKSxBPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5pbnN0YWxsPWZ1bmN0aW9uKHQpe2UuX3NvdW5kPXQsZS5sZWdhY3k9dC51c2VMZWdhY3ksUElYSS5sb2FkZXJzLkxvYWRlcj1qLFBJWEkubG9hZGVyLnVzZShlLnBsdWdpbiksUElYSS5sb2FkZXIucHJlKGUucmVzb2x2ZSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwibGVnYWN5XCIse3NldDpmdW5jdGlvbihlKXt2YXIgdD1QSVhJLmxvYWRlcnMuUmVzb3VyY2Usbj13LmV4dGVuc2lvbnM7ZT9uLmZvckVhY2goZnVuY3Rpb24oZSl7dC5zZXRFeHRlbnNpb25YaHJUeXBlKGUsdC5YSFJfUkVTUE9OU0VfVFlQRS5ERUZBVUxUKSx0LnNldEV4dGVuc2lvbkxvYWRUeXBlKGUsdC5MT0FEX1RZUEUuQVVESU8pfSk6bi5mb3JFYWNoKGZ1bmN0aW9uKGUpe3Quc2V0RXh0ZW5zaW9uWGhyVHlwZShlLHQuWEhSX1JFU1BPTlNFX1RZUEUuQlVGRkVSKSx0LnNldEV4dGVuc2lvbkxvYWRUeXBlKGUsdC5MT0FEX1RZUEUuWEhSKX0pfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucmVzb2x2ZT1mdW5jdGlvbihlLHQpe3cucmVzb2x2ZVVybChlKSx0KCl9LGUucGx1Z2luPWZ1bmN0aW9uKHQsbil7dC5kYXRhJiZ3LmV4dGVuc2lvbnMuaW5kZXhPZih0LmV4dGVuc2lvbik+LTE/dC5zb3VuZD1lLl9zb3VuZC5hZGQodC5uYW1lLHtsb2FkZWQ6bixwcmVsb2FkOiEwLHVybDp0LnVybCxzb3VyY2U6dC5kYXRhfSk6bigpfSxlfSgpLEY9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5wYXJlbnQ9ZSxPYmplY3QuYXNzaWduKHRoaXMsdCksdGhpcy5kdXJhdGlvbj10aGlzLmVuZC10aGlzLnN0YXJ0LGNvbnNvbGUuYXNzZXJ0KHRoaXMuZHVyYXRpb24+MCxcIkVuZCB0aW1lIG11c3QgYmUgYWZ0ZXIgc3RhcnQgdGltZVwiKX1yZXR1cm4gZS5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5wYXJlbnQucGxheShPYmplY3QuYXNzaWduKHtjb21wbGV0ZTplLHNwZWVkOnRoaXMuc3BlZWR8fHRoaXMucGFyZW50LnNwZWVkLGVuZDp0aGlzLmVuZCxzdGFydDp0aGlzLnN0YXJ0fSkpfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5wYXJlbnQ9bnVsbH0sZX0oKSxFPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt2YXIgdD10aGlzLG89bmV3IG4uQXVkaW9Db250ZXh0LGk9by5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKSxyPW8uY3JlYXRlQW5hbHlzZXIoKTtyZXR1cm4gci5jb25uZWN0KGkpLGkuY29ubmVjdChvLmRlc3RpbmF0aW9uKSx0PWUuY2FsbCh0aGlzLHIsaSl8fHRoaXMsdC5fY3R4PW8sdC5fb2ZmbGluZUN0eD1uZXcgbi5PZmZsaW5lQXVkaW9Db250ZXh0KDEsMixvLnNhbXBsZVJhdGUpLHQuX3VubG9ja2VkPSExLHQuY29tcHJlc3Nvcj1pLHQuYW5hbHlzZXI9cix0LmV2ZW50cz1uZXcgUElYSS51dGlscy5FdmVudEVtaXR0ZXIsdC52b2x1bWU9MSx0LnNwZWVkPTEsdC5tdXRlZD0hMSx0LnBhdXNlZD0hMSxcIm9udG91Y2hzdGFydFwiaW4gd2luZG93JiZcInJ1bm5pbmdcIiE9PW8uc3RhdGUmJih0Ll91bmxvY2soKSx0Ll91bmxvY2s9dC5fdW5sb2NrLmJpbmQodCksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHQuX3VubG9jaywhMCksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIix0Ll91bmxvY2ssITApLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLHQuX3VubG9jaywhMCkpLHR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5fdW5sb2NrPWZ1bmN0aW9uKCl7dGhpcy5fdW5sb2NrZWR8fCh0aGlzLnBsYXlFbXB0eVNvdW5kKCksXCJydW5uaW5nXCI9PT10aGlzLl9jdHguc3RhdGUmJihkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsdGhpcy5fdW5sb2NrLCEwKSxkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIix0aGlzLl91bmxvY2ssITApLGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsdGhpcy5fdW5sb2NrLCEwKSx0aGlzLl91bmxvY2tlZD0hMCkpfSxuLnByb3RvdHlwZS5wbGF5RW1wdHlTb3VuZD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX2N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtlLmJ1ZmZlcj10aGlzLl9jdHguY3JlYXRlQnVmZmVyKDEsMSwyMjA1MCksZS5jb25uZWN0KHRoaXMuX2N0eC5kZXN0aW5hdGlvbiksZS5zdGFydCgwLDAsMCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiQXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3ZhciBlPXdpbmRvdztyZXR1cm4gZS5BdWRpb0NvbnRleHR8fGUud2Via2l0QXVkaW9Db250ZXh0fHxudWxsfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiT2ZmbGluZUF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgZT13aW5kb3c7cmV0dXJuIGUuT2ZmbGluZUF1ZGlvQ29udGV4dHx8ZS53ZWJraXRPZmZsaW5lQXVkaW9Db250ZXh0fHxudWxsfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7dmFyIHQ9dGhpcy5fY3R4O3ZvaWQgMCE9PXQuY2xvc2UmJnQuY2xvc2UoKSx0aGlzLmV2ZW50cy5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLmFuYWx5c2VyLmRpc2Nvbm5lY3QoKSx0aGlzLmNvbXByZXNzb3IuZGlzY29ubmVjdCgpLHRoaXMuYW5hbHlzZXI9bnVsbCx0aGlzLmNvbXByZXNzb3I9bnVsbCx0aGlzLmV2ZW50cz1udWxsLHRoaXMuX29mZmxpbmVDdHg9bnVsbCx0aGlzLl9jdHg9bnVsbH0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiYXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jdHh9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwib2ZmbGluZUNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX29mZmxpbmVDdHh9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXtlJiZcInJ1bm5pbmdcIj09PXRoaXMuX2N0eC5zdGF0ZT90aGlzLl9jdHguc3VzcGVuZCgpOmV8fFwic3VzcGVuZGVkXCIhPT10aGlzLl9jdHguc3RhdGV8fHRoaXMuX2N0eC5yZXN1bWUoKSx0aGlzLl9wYXVzZWQ9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dGhpcy5ldmVudHMuZW1pdChcInJlZnJlc2hcIil9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt0aGlzLmV2ZW50cy5lbWl0KFwicmVmcmVzaFBhdXNlZFwiKX0sbi5wcm90b3R5cGUudG9nZ2xlTXV0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLm11dGVkPSF0aGlzLm11dGVkLHRoaXMucmVmcmVzaCgpLHRoaXMubXV0ZWR9LG4ucHJvdG90eXBlLnRvZ2dsZVBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF1c2VkPSF0aGlzLnBhdXNlZCx0aGlzLnJlZnJlc2hQYXVzZWQoKSx0aGlzLl9wYXVzZWR9LG4ucHJvdG90eXBlLmRlY29kZT1mdW5jdGlvbihlLHQpe3RoaXMuX29mZmxpbmVDdHguZGVjb2RlQXVkaW9EYXRhKGUsZnVuY3Rpb24oZSl7dChudWxsLGUpfSxmdW5jdGlvbigpe3QobmV3IEVycm9yKFwiVW5hYmxlIHRvIGRlY29kZSBmaWxlXCIpKX0pfSxufShuKSxMPU9iamVjdC5mcmVlemUoe1dlYkF1ZGlvTWVkaWE6TyxXZWJBdWRpb0luc3RhbmNlOlAsV2ViQXVkaW9Ob2Rlczp4LFdlYkF1ZGlvQ29udGV4dDpFLFdlYkF1ZGlvVXRpbHM6bH0pLFM9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7dGhpcy5pbml0KCl9cmV0dXJuIGUucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zdXBwb3J0ZWQmJih0aGlzLl93ZWJBdWRpb0NvbnRleHQ9bmV3IEUpLHRoaXMuX2h0bWxBdWRpb0NvbnRleHQ9bmV3IGIsdGhpcy5fc291bmRzPXt9LHRoaXMudXNlTGVnYWN5PSF0aGlzLnN1cHBvcnRlZCx0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUuaW5pdD1mdW5jdGlvbigpe2lmKGUuaW5zdGFuY2UpdGhyb3cgbmV3IEVycm9yKFwiU291bmRMaWJyYXJ5IGlzIGFscmVhZHkgY3JlYXRlZFwiKTt2YXIgdD1lLmluc3RhbmNlPW5ldyBlO1widW5kZWZpbmVkXCI9PXR5cGVvZiBQcm9taXNlJiYod2luZG93LlByb21pc2U9YSksdm9pZCAwIT09UElYSS5sb2FkZXJzJiZBLmluc3RhbGwodCksdm9pZCAwPT09d2luZG93Ll9fcGl4aVNvdW5kJiZkZWxldGUgd2luZG93Ll9fcGl4aVNvdW5kO3ZhciBvPVBJWEk7cmV0dXJuIG8uc291bmR8fChPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcInNvdW5kXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQse2ZpbHRlcnM6e2dldDpmdW5jdGlvbigpe3JldHVybiBtfX0saHRtbGF1ZGlvOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZ319LHdlYmF1ZGlvOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gTH19LHV0aWxzOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gd319LFNvdW5kOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gSX19LFNvdW5kU3ByaXRlOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gRn19LEZpbHRlcmFibGU6e2dldDpmdW5jdGlvbigpe3JldHVybiBufX0sU291bmRMaWJyYXJ5OntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZX19fSkpLHR9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNBbGxcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudXNlTGVnYWN5P1tdOnRoaXMuX2NvbnRleHQuZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMudXNlTGVnYWN5fHwodGhpcy5fY29udGV4dC5maWx0ZXJzPWUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInN1cHBvcnRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9PUUuQXVkaW9Db250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmFkZD1mdW5jdGlvbihlLHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXt2YXIgbj17fTtmb3IodmFyIG8gaW4gZSl7aT10aGlzLl9nZXRPcHRpb25zKGVbb10sdCk7bltvXT10aGlzLmFkZChvLGkpfXJldHVybiBufWlmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZihjb25zb2xlLmFzc2VydCghdGhpcy5fc291bmRzW2VdLFwiU291bmQgd2l0aCBhbGlhcyBcIitlK1wiIGFscmVhZHkgZXhpc3RzLlwiKSx0IGluc3RhbmNlb2YgSSlyZXR1cm4gdGhpcy5fc291bmRzW2VdPXQsdDt2YXIgaT10aGlzLl9nZXRPcHRpb25zKHQpLHI9SS5mcm9tKGkpO3JldHVybiB0aGlzLl9zb3VuZHNbZV09cixyfX0sZS5wcm90b3R5cGUuX2dldE9wdGlvbnM9ZnVuY3Rpb24oZSx0KXt2YXIgbjtyZXR1cm4gbj1cInN0cmluZ1wiPT10eXBlb2YgZT97dXJsOmV9OmUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcnx8ZSBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQ/e3NvdXJjZTplfTplLE9iamVjdC5hc3NpZ24obix0fHx7fSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInVzZUxlZ2FjeVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdXNlTGVnYWN5fSxzZXQ6ZnVuY3Rpb24oZSl7QS5sZWdhY3k9ZSx0aGlzLl91c2VMZWdhY3k9ZSwhZSYmdGhpcy5zdXBwb3J0ZWQ/dGhpcy5fY29udGV4dD10aGlzLl93ZWJBdWRpb0NvbnRleHQ6dGhpcy5fY29udGV4dD10aGlzLl9odG1sQXVkaW9Db250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5leGlzdHMoZSwhMCksdGhpcy5fc291bmRzW2VdLmRlc3Ryb3koKSxkZWxldGUgdGhpcy5fc291bmRzW2VdLHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInZvbHVtZUFsbFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC52b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9jb250ZXh0LnZvbHVtZT1lLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInNwZWVkQWxsXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnNwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fY29udGV4dC5zcGVlZD1lLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnRvZ2dsZVBhdXNlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQudG9nZ2xlUGF1c2UoKX0sZS5wcm90b3R5cGUucGF1c2VBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5wYXVzZWQ9ITAsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUucmVzdW1lQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQucGF1c2VkPSExLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnRvZ2dsZU11dGVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC50b2dnbGVNdXRlKCl9LGUucHJvdG90eXBlLm11dGVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5tdXRlZD0hMCx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS51bm11dGVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5tdXRlZD0hMSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS5yZW1vdmVBbGw9ZnVuY3Rpb24oKXtmb3IodmFyIGUgaW4gdGhpcy5fc291bmRzKXRoaXMuX3NvdW5kc1tlXS5kZXN0cm95KCksZGVsZXRlIHRoaXMuX3NvdW5kc1tlXTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUuc3RvcEFsbD1mdW5jdGlvbigpe2Zvcih2YXIgZSBpbiB0aGlzLl9zb3VuZHMpdGhpcy5fc291bmRzW2VdLnN0b3AoKTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUuZXhpc3RzPWZ1bmN0aW9uKGUsdCl7dm9pZCAwPT09dCYmKHQ9ITEpO3ZhciBuPSEhdGhpcy5fc291bmRzW2VdO3JldHVybiB0JiZjb25zb2xlLmFzc2VydChuLFwiTm8gc291bmQgbWF0Y2hpbmcgYWxpYXMgJ1wiK2UrXCInLlwiKSxufSxlLnByb3RvdHlwZS5maW5kPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmV4aXN0cyhlLCEwKSx0aGlzLl9zb3VuZHNbZV19LGUucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5maW5kKGUpLnBsYXkodCl9LGUucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5zdG9wKCl9LGUucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkucGF1c2UoKX0sZS5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkucmVzdW1lKCl9LGUucHJvdG90eXBlLnZvbHVtZT1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMuZmluZChlKTtyZXR1cm4gdm9pZCAwIT09dCYmKG4udm9sdW1lPXQpLG4udm9sdW1lfSxlLnByb3RvdHlwZS5zcGVlZD1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMuZmluZChlKTtyZXR1cm4gdm9pZCAwIT09dCYmKG4uc3BlZWQ9dCksbi5zcGVlZH0sZS5wcm90b3R5cGUuZHVyYXRpb249ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5kdXJhdGlvbn0sZS5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZW1vdmVBbGwoKSx0aGlzLl9zb3VuZHM9bnVsbCx0aGlzLl93ZWJBdWRpb0NvbnRleHQmJih0aGlzLl93ZWJBdWRpb0NvbnRleHQuZGVzdHJveSgpLHRoaXMuX3dlYkF1ZGlvQ29udGV4dD1udWxsKSx0aGlzLl9odG1sQXVkaW9Db250ZXh0JiYodGhpcy5faHRtbEF1ZGlvQ29udGV4dC5kZXN0cm95KCksdGhpcy5faHRtbEF1ZGlvQ29udGV4dD1udWxsKSx0aGlzLl9jb250ZXh0PW51bGwsdGhpc30sZX0oKSxJPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMubWVkaWE9ZSx0aGlzLm9wdGlvbnM9dCx0aGlzLl9pbnN0YW5jZXM9W10sdGhpcy5fc3ByaXRlcz17fSx0aGlzLm1lZGlhLmluaXQodGhpcyk7dmFyIG49dC5jb21wbGV0ZTt0aGlzLl9hdXRvUGxheU9wdGlvbnM9bj97Y29tcGxldGU6bn06bnVsbCx0aGlzLmlzTG9hZGVkPSExLHRoaXMuaXNQbGF5aW5nPSExLHRoaXMuYXV0b1BsYXk9dC5hdXRvUGxheSx0aGlzLnNpbmdsZUluc3RhbmNlPXQuc2luZ2xlSW5zdGFuY2UsdGhpcy5wcmVsb2FkPXQucHJlbG9hZHx8dGhpcy5hdXRvUGxheSx0aGlzLnVybD10LnVybCx0aGlzLnNwZWVkPXQuc3BlZWQsdGhpcy52b2x1bWU9dC52b2x1bWUsdGhpcy5sb29wPXQubG9vcCx0LnNwcml0ZXMmJnRoaXMuYWRkU3ByaXRlcyh0LnNwcml0ZXMpLHRoaXMucHJlbG9hZCYmdGhpcy5fcHJlbG9hZCh0LmxvYWRlZCl9cmV0dXJuIGUuZnJvbT1mdW5jdGlvbih0KXt2YXIgbj17fTtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdD9uLnVybD10OnQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcnx8dCBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQ/bi5zb3VyY2U9dDpuPXQsKG49T2JqZWN0LmFzc2lnbih7YXV0b1BsYXk6ITEsc2luZ2xlSW5zdGFuY2U6ITEsdXJsOm51bGwsc291cmNlOm51bGwscHJlbG9hZDohMSx2b2x1bWU6MSxzcGVlZDoxLGNvbXBsZXRlOm51bGwsbG9hZGVkOm51bGwsbG9vcDohMX0sbikpLnVybCYmKG4udXJsPXcucmVzb2x2ZVVybChuLnVybCkpLE9iamVjdC5mcmVlemUobiksbmV3IGUoUy5pbnN0YW5jZS51c2VMZWdhY3k/bmV3IHM6bmV3IE8sbil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIFMuaW5zdGFuY2UuY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmlzUGxheWluZz0hMSx0aGlzLnBhdXNlZD0hMCx0aGlzfSxlLnByb3RvdHlwZS5yZXN1bWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc1BsYXlpbmc9dGhpcy5faW5zdGFuY2VzLmxlbmd0aD4wLHRoaXMucGF1c2VkPSExLHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGF1c2VkPWUsdGhpcy5yZWZyZXNoUGF1c2VkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3BlZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc3BlZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1lZGlhLmZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt0aGlzLm1lZGlhLmZpbHRlcnM9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5hZGRTcHJpdGVzPWZ1bmN0aW9uKGUsdCl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGUpe3ZhciBuPXt9O2Zvcih2YXIgbyBpbiBlKW5bb109dGhpcy5hZGRTcHJpdGVzKG8sZVtvXSk7cmV0dXJuIG59aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUpe2NvbnNvbGUuYXNzZXJ0KCF0aGlzLl9zcHJpdGVzW2VdLFwiQWxpYXMgXCIrZStcIiBpcyBhbHJlYWR5IHRha2VuXCIpO3ZhciBpPW5ldyBGKHRoaXMsdCk7cmV0dXJuIHRoaXMuX3Nwcml0ZXNbZV09aSxpfX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX3JlbW92ZUluc3RhbmNlcygpLHRoaXMucmVtb3ZlU3ByaXRlcygpLHRoaXMubWVkaWEuZGVzdHJveSgpLHRoaXMubWVkaWE9bnVsbCx0aGlzLl9zcHJpdGVzPW51bGwsdGhpcy5faW5zdGFuY2VzPW51bGx9LGUucHJvdG90eXBlLnJlbW92ZVNwcml0ZXM9ZnVuY3Rpb24oZSl7aWYoZSl7dmFyIHQ9dGhpcy5fc3ByaXRlc1tlXTt2b2lkIDAhPT10JiYodC5kZXN0cm95KCksZGVsZXRlIHRoaXMuX3Nwcml0ZXNbZV0pfWVsc2UgZm9yKHZhciBuIGluIHRoaXMuX3Nwcml0ZXMpdGhpcy5yZW1vdmVTcHJpdGVzKG4pO3JldHVybiB0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJpc1BsYXlhYmxlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmlzTG9hZGVkJiZ0aGlzLm1lZGlhJiZ0aGlzLm1lZGlhLmlzUGxheWFibGV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe2lmKCF0aGlzLmlzUGxheWFibGUpcmV0dXJuIHRoaXMuYXV0b1BsYXk9ITEsdGhpcy5fYXV0b1BsYXlPcHRpb25zPW51bGwsdGhpczt0aGlzLmlzUGxheWluZz0hMTtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aC0xO2U+PTA7ZS0tKXRoaXMuX2luc3RhbmNlc1tlXS5zdG9wKCk7cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSx0KXt2YXIgbixvPXRoaXM7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGU/bj17c3ByaXRlOnI9ZSxjb21wbGV0ZTp0fTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBlPyhuPXt9KS5jb21wbGV0ZT1lOm49ZSwobj1PYmplY3QuYXNzaWduKHtjb21wbGV0ZTpudWxsLGxvYWRlZDpudWxsLHNwcml0ZTpudWxsLGVuZDpudWxsLHN0YXJ0OjAsdm9sdW1lOjEsc3BlZWQ6MSxtdXRlZDohMSxsb29wOiExfSxufHx7fSkpLnNwcml0ZSl7dmFyIGk9bi5zcHJpdGU7Y29uc29sZS5hc3NlcnQoISF0aGlzLl9zcHJpdGVzW2ldLFwiQWxpYXMgXCIraStcIiBpcyBub3QgYXZhaWxhYmxlXCIpO3ZhciByPXRoaXMuX3Nwcml0ZXNbaV07bi5zdGFydD1yLnN0YXJ0LG4uZW5kPXIuZW5kLG4uc3BlZWQ9ci5zcGVlZHx8MSxkZWxldGUgbi5zcHJpdGV9aWYobi5vZmZzZXQmJihuLnN0YXJ0PW4ub2Zmc2V0KSwhdGhpcy5pc0xvYWRlZClyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oZSx0KXtvLmF1dG9QbGF5PSEwLG8uX2F1dG9QbGF5T3B0aW9ucz1uLG8uX3ByZWxvYWQoZnVuY3Rpb24obyxpLHIpe28/dChvKToobi5sb2FkZWQmJm4ubG9hZGVkKG8saSxyKSxlKHIpKX0pfSk7dGhpcy5zaW5nbGVJbnN0YW5jZSYmdGhpcy5fcmVtb3ZlSW5zdGFuY2VzKCk7dmFyIHM9dGhpcy5fY3JlYXRlSW5zdGFuY2UoKTtyZXR1cm4gdGhpcy5faW5zdGFuY2VzLnB1c2gocyksdGhpcy5pc1BsYXlpbmc9ITAscy5vbmNlKFwiZW5kXCIsZnVuY3Rpb24oKXtuLmNvbXBsZXRlJiZuLmNvbXBsZXRlKG8pLG8uX29uQ29tcGxldGUocyl9KSxzLm9uY2UoXCJzdG9wXCIsZnVuY3Rpb24oKXtvLl9vbkNvbXBsZXRlKHMpfSkscy5wbGF5KG4pLHN9LGUucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aCx0PTA7dDxlO3QrKyl0aGlzLl9pbnN0YW5jZXNbdF0ucmVmcmVzaCgpfSxlLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgsdD0wO3Q8ZTt0KyspdGhpcy5faW5zdGFuY2VzW3RdLnJlZnJlc2hQYXVzZWQoKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwidm9sdW1lXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl92b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl92b2x1bWU9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJtdXRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbXV0ZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9tdXRlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImxvb3BcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xvb3B9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9sb29wPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuX3ByZWxvYWQ9ZnVuY3Rpb24oZSl7dGhpcy5tZWRpYS5sb2FkKGUpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJpbnN0YW5jZXNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2luc3RhbmNlc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzcHJpdGVzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcHJpdGVzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImR1cmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1lZGlhLmR1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmF1dG9QbGF5U3RhcnQ9ZnVuY3Rpb24oKXt2YXIgZTtyZXR1cm4gdGhpcy5hdXRvUGxheSYmKGU9dGhpcy5wbGF5KHRoaXMuX2F1dG9QbGF5T3B0aW9ucykpLGV9LGUucHJvdG90eXBlLl9yZW1vdmVJbnN0YW5jZXM9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aC0xO2U+PTA7ZS0tKXRoaXMuX3Bvb2xJbnN0YW5jZSh0aGlzLl9pbnN0YW5jZXNbZV0pO3RoaXMuX2luc3RhbmNlcy5sZW5ndGg9MH0sZS5wcm90b3R5cGUuX29uQ29tcGxldGU9ZnVuY3Rpb24oZSl7aWYodGhpcy5faW5zdGFuY2VzKXt2YXIgdD10aGlzLl9pbnN0YW5jZXMuaW5kZXhPZihlKTt0Pi0xJiZ0aGlzLl9pbnN0YW5jZXMuc3BsaWNlKHQsMSksdGhpcy5pc1BsYXlpbmc9dGhpcy5faW5zdGFuY2VzLmxlbmd0aD4wfXRoaXMuX3Bvb2xJbnN0YW5jZShlKX0sZS5wcm90b3R5cGUuX2NyZWF0ZUluc3RhbmNlPWZ1bmN0aW9uKCl7aWYoZS5fcG9vbC5sZW5ndGg+MCl7dmFyIHQ9ZS5fcG9vbC5wb3AoKTtyZXR1cm4gdC5pbml0KHRoaXMubWVkaWEpLHR9cmV0dXJuIHRoaXMubWVkaWEuY3JlYXRlKCl9LGUucHJvdG90eXBlLl9wb29sSW5zdGFuY2U9ZnVuY3Rpb24odCl7dC5kZXN0cm95KCksZS5fcG9vbC5pbmRleE9mKHQpPDAmJmUuX3Bvb2wucHVzaCh0KX0sZS5fcG9vbD1bXSxlfSgpLEM9Uy5pbml0KCk7ZS5zb3VuZD1DLGUuZmlsdGVycz1tLGUuaHRtbGF1ZGlvPWcsZS53ZWJhdWRpbz1MLGUuRmlsdGVyYWJsZT1uLGUuU291bmQ9SSxlLlNvdW5kTGlicmFyeT1TLGUuU291bmRTcHJpdGU9RixlLnV0aWxzPXcsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktc291bmQuanMubWFwXG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiIWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUoaSl7aWYobltpXSlyZXR1cm4gbltpXS5leHBvcnRzO3ZhciByPW5baV09e2V4cG9ydHM6e30saWQ6aSxsb2FkZWQ6ITF9O3JldHVybiB0W2ldLmNhbGwoci5leHBvcnRzLHIsci5leHBvcnRzLGUpLHIubG9hZGVkPSEwLHIuZXhwb3J0c312YXIgbj17fTtyZXR1cm4gZS5tPXQsZS5jPW4sZS5wPVwiXCIsZSgwKX0oW2Z1bmN0aW9uKHQsZSxuKXt0LmV4cG9ydHM9big2KX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9UElYSX0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbj17bGluZWFyOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0fX0saW5RdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnR9fSxvdXRRdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KigyLXQpfX0saW5PdXRRdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQ6LS41KigtLXQqKHQtMiktMSl9fSxpbkN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdH19LG91dEN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi0tdCp0KnQrMX19LGluT3V0Q3ViaWM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdCp0Oih0LT0yLC41Kih0KnQqdCsyKSl9fSxpblF1YXJ0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdCp0fX0sb3V0UXVhcnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtIC0tdCp0KnQqdH19LGluT3V0UXVhcnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdCp0KnQ6KHQtPTIsLS41Kih0KnQqdCp0LTIpKX19LGluUXVpbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqdCp0KnQqdH19LG91dFF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi0tdCp0KnQqdCp0KzF9fSxpbk91dFF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQqdCp0KnQ6KHQtPTIsLjUqKHQqdCp0KnQqdCsyKSl9fSxpblNpbmU6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtTWF0aC5jb3ModCpNYXRoLlBJLzIpfX0sb3V0U2luZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zaW4odCpNYXRoLlBJLzIpfX0saW5PdXRTaW5lOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi41KigxLU1hdGguY29zKE1hdGguUEkqdCkpfX0saW5FeHBvOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAwPT09dD8wOk1hdGgucG93KDEwMjQsdC0xKX19LG91dEV4cG86ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDE9PT10PzE6MS1NYXRoLnBvdygyLC0xMCp0KX19LGluT3V0RXhwbzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMD09PXQ/MDoxPT09dD8xOih0Kj0yLDE+dD8uNSpNYXRoLnBvdygxMDI0LHQtMSk6LjUqKC1NYXRoLnBvdygyLC0xMCoodC0xKSkrMikpfX0saW5DaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLU1hdGguc3FydCgxLXQqdCl9fSxvdXRDaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNxcnQoMS0gLS10KnQpfX0saW5PdXRDaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8tLjUqKE1hdGguc3FydCgxLXQqdCktMSk6LjUqKE1hdGguc3FydCgxLSh0LTIpKih0LTIpKSsxKX19LGluRWxhc3RpYzpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg8PTB8fHZvaWQgMD09PWFyZ3VtZW50c1swXT8uMTphcmd1bWVudHNbMF0sZT1hcmd1bWVudHMubGVuZ3RoPD0xfHx2b2lkIDA9PT1hcmd1bWVudHNbMV0/LjQ6YXJndW1lbnRzWzFdO3JldHVybiBmdW5jdGlvbihuKXt2YXIgaT12b2lkIDA7cmV0dXJuIDA9PT1uPzA6MT09PW4/MTooIXR8fDE+dD8odD0xLGk9ZS80KTppPWUqTWF0aC5hc2luKDEvdCkvKDIqTWF0aC5QSSksLSh0Kk1hdGgucG93KDIsMTAqKG4tMSkpKk1hdGguc2luKChuLTEtaSkqKDIqTWF0aC5QSSkvZSkpKX19LG91dEVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLHQqTWF0aC5wb3coMiwtMTAqbikqTWF0aC5zaW4oKG4taSkqKDIqTWF0aC5QSSkvZSkrMSl9fSxpbk91dEVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLG4qPTIsMT5uPy0uNSoodCpNYXRoLnBvdygyLDEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKTp0Kk1hdGgucG93KDIsLTEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKi41KzEpfX0saW5CYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj10fHwxLjcwMTU4O3JldHVybiBlKmUqKChuKzEpKmUtbil9fSxvdXRCYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj10fHwxLjcwMTU4O3JldHVybi0tZSplKigobisxKSplK24pKzF9fSxpbk91dEJhY2s6ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciBuPTEuNTI1Kih0fHwxLjcwMTU4KTtyZXR1cm4gZSo9MiwxPmU/LjUqKGUqZSooKG4rMSkqZS1uKSk6LjUqKChlLTIpKihlLTIpKigobisxKSooZS0yKStuKSsyKX19LGluQm91bmNlOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLW4ub3V0Qm91bmNlKCkoMS10KX19LG91dEJvdW5jZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS8yLjc1PnQ/Ny41NjI1KnQqdDoyLzIuNzU+dD8odC09MS41LzIuNzUsNy41NjI1KnQqdCsuNzUpOjIuNS8yLjc1PnQ/KHQtPTIuMjUvMi43NSw3LjU2MjUqdCp0Ky45Mzc1KToodC09Mi42MjUvMi43NSw3LjU2MjUqdCp0Ky45ODQzNzUpfX0saW5PdXRCb3VuY2U6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuLjU+dD8uNSpuLmluQm91bmNlKCkoMip0KTouNSpuLm91dEJvdW5jZSgpKDIqdC0xKSsuNX19LGN1c3RvbUFycmF5OmZ1bmN0aW9uKHQpe3JldHVybiB0P2Z1bmN0aW9uKHQpe3JldHVybiB0fTpuLmxpbmVhcigpfX07ZVtcImRlZmF1bHRcIl09bn0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1mdW5jdGlvbiByKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgZT17fTtpZihudWxsIT10KWZvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKTtyZXR1cm4gZVtcImRlZmF1bHRcIl09dCxlfWZ1bmN0aW9uIHModCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfWZ1bmN0aW9uIG8odCxlKXtpZighdCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIWV8fFwib2JqZWN0XCIhPXR5cGVvZiBlJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBlP3Q6ZX1mdW5jdGlvbiBhKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmbnVsbCE9PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIrdHlwZW9mIGUpO3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LGVudW1lcmFibGU6ITEsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLGUmJihPYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LnNldFByb3RvdHlwZU9mKHQsZSk6dC5fX3Byb3RvX189ZSl9ZnVuY3Rpb24gdSh0LGUsbixpLHIscyl7Zm9yKHZhciBvIGluIHQpaWYoYyh0W29dKSl1KHRbb10sZVtvXSxuW29dLGkscixzKTtlbHNle3ZhciBhPWVbb10saD10W29dLWVbb10sbD1pLGY9ci9sO25bb109YStoKnMoZil9fWZ1bmN0aW9uIGgodCxlLG4pe2Zvcih2YXIgaSBpbiB0KTA9PT1lW2ldfHxlW2ldfHwoYyhuW2ldKT8oZVtpXT1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG5baV0pKSxoKHRbaV0sZVtpXSxuW2ldKSk6ZVtpXT1uW2ldKX1mdW5jdGlvbiBjKHQpe3JldHVyblwiW29iamVjdCBPYmplY3RdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCl9dmFyIGw9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgZj1uKDEpLHA9cihmKSxkPW4oMiksZz1pKGQpLHY9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0LG4pe3ModGhpcyxlKTt2YXIgaT1vKHRoaXMsT2JqZWN0LmdldFByb3RvdHlwZU9mKGUpLmNhbGwodGhpcykpO3JldHVybiBpLnRhcmdldD10LG4mJmkuYWRkVG8obiksaS5jbGVhcigpLGl9cmV0dXJuIGEoZSx0KSxsKGUsW3trZXk6XCJhZGRUb1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLm1hbmFnZXI9dCx0aGlzLm1hbmFnZXIuYWRkVHdlZW4odGhpcyksdGhpc319LHtrZXk6XCJjaGFpblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0fHwodD1uZXcgZSh0aGlzLnRhcmdldCkpLHRoaXMuX2NoYWluVHdlZW49dCx0fX0se2tleTpcInN0YXJ0XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hY3RpdmU9ITAsdGhpc319LHtrZXk6XCJzdG9wXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hY3RpdmU9ITEsdGhpcy5lbWl0KFwic3RvcFwiKSx0aGlzfX0se2tleTpcInRvXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX3RvPXQsdGhpc319LHtrZXk6XCJmcm9tXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2Zyb209dCx0aGlzfX0se2tleTpcInJlbW92ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWFuYWdlcj8odGhpcy5tYW5hZ2VyLnJlbW92ZVR3ZWVuKHRoaXMpLHRoaXMpOnRoaXN9fSx7a2V5OlwiY2xlYXJcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMudGltZT0wLHRoaXMuYWN0aXZlPSExLHRoaXMuZWFzaW5nPWdbXCJkZWZhdWx0XCJdLmxpbmVhcigpLHRoaXMuZXhwaXJlPSExLHRoaXMucmVwZWF0PTAsdGhpcy5sb29wPSExLHRoaXMuZGVsYXk9MCx0aGlzLnBpbmdQb25nPSExLHRoaXMuaXNTdGFydGVkPSExLHRoaXMuaXNFbmRlZD0hMSx0aGlzLl90bz1udWxsLHRoaXMuX2Zyb209bnVsbCx0aGlzLl9kZWxheVRpbWU9MCx0aGlzLl9lbGFwc2VkVGltZT0wLHRoaXMuX3JlcGVhdD0wLHRoaXMuX3BpbmdQb25nPSExLHRoaXMuX2NoYWluVHdlZW49bnVsbCx0aGlzLnBhdGg9bnVsbCx0aGlzLnBhdGhSZXZlcnNlPSExLHRoaXMucGF0aEZyb209MCx0aGlzLnBhdGhUbz0wfX0se2tleTpcInJlc2V0XCIsdmFsdWU6ZnVuY3Rpb24oKXtpZih0aGlzLl9lbGFwc2VkVGltZT0wLHRoaXMuX3JlcGVhdD0wLHRoaXMuX2RlbGF5VGltZT0wLHRoaXMuaXNTdGFydGVkPSExLHRoaXMuaXNFbmRlZD0hMSx0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyl7dmFyIHQ9dGhpcy5fdG8sZT10aGlzLl9mcm9tO3RoaXMuX3RvPWUsdGhpcy5fZnJvbT10LHRoaXMuX3BpbmdQb25nPSExfXJldHVybiB0aGlzfX0se2tleTpcInVwZGF0ZVwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7aWYodGhpcy5fY2FuVXBkYXRlKCl8fCF0aGlzLl90byYmIXRoaXMucGF0aCl7dmFyIG49dm9pZCAwLGk9dm9pZCAwO2lmKHRoaXMuZGVsYXk+dGhpcy5fZGVsYXlUaW1lKXJldHVybiB2b2lkKHRoaXMuX2RlbGF5VGltZSs9ZSk7dGhpcy5pc1N0YXJ0ZWR8fCh0aGlzLl9wYXJzZURhdGEoKSx0aGlzLmlzU3RhcnRlZD0hMCx0aGlzLmVtaXQoXCJzdGFydFwiKSk7dmFyIHI9dGhpcy5waW5nUG9uZz90aGlzLnRpbWUvMjp0aGlzLnRpbWU7aWYocj50aGlzLl9lbGFwc2VkVGltZSl7dmFyIHM9dGhpcy5fZWxhcHNlZFRpbWUrZSxvPXM+PXI7dGhpcy5fZWxhcHNlZFRpbWU9bz9yOnMsdGhpcy5fYXBwbHkocik7dmFyIGE9dGhpcy5fcGluZ1Bvbmc/cit0aGlzLl9lbGFwc2VkVGltZTp0aGlzLl9lbGFwc2VkVGltZTtpZih0aGlzLmVtaXQoXCJ1cGRhdGVcIixhKSxvKXtpZih0aGlzLnBpbmdQb25nJiYhdGhpcy5fcGluZ1BvbmcpcmV0dXJuIHRoaXMuX3BpbmdQb25nPSEwLG49dGhpcy5fdG8saT10aGlzLl9mcm9tLHRoaXMuX2Zyb209bix0aGlzLl90bz1pLHRoaXMucGF0aCYmKG49dGhpcy5wYXRoVG8saT10aGlzLnBhdGhGcm9tLHRoaXMucGF0aFRvPWksdGhpcy5wYXRoRnJvbT1uKSx0aGlzLmVtaXQoXCJwaW5ncG9uZ1wiKSx2b2lkKHRoaXMuX2VsYXBzZWRUaW1lPTApO2lmKHRoaXMubG9vcHx8dGhpcy5yZXBlYXQ+dGhpcy5fcmVwZWF0KXJldHVybiB0aGlzLl9yZXBlYXQrKyx0aGlzLmVtaXQoXCJyZXBlYXRcIix0aGlzLl9yZXBlYXQpLHRoaXMuX2VsYXBzZWRUaW1lPTAsdm9pZCh0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyYmKG49dGhpcy5fdG8saT10aGlzLl9mcm9tLHRoaXMuX3RvPWksdGhpcy5fZnJvbT1uLHRoaXMucGF0aCYmKG49dGhpcy5wYXRoVG8saT10aGlzLnBhdGhGcm9tLHRoaXMucGF0aFRvPWksdGhpcy5wYXRoRnJvbT1uKSx0aGlzLl9waW5nUG9uZz0hMSkpO3RoaXMuaXNFbmRlZD0hMCx0aGlzLmFjdGl2ZT0hMSx0aGlzLmVtaXQoXCJlbmRcIiksdGhpcy5fY2hhaW5Ud2VlbiYmKHRoaXMuX2NoYWluVHdlZW4uYWRkVG8odGhpcy5tYW5hZ2VyKSx0aGlzLl9jaGFpblR3ZWVuLnN0YXJ0KCkpfX19fX0se2tleTpcIl9wYXJzZURhdGFcIix2YWx1ZTpmdW5jdGlvbigpe2lmKCF0aGlzLmlzU3RhcnRlZCYmKHRoaXMuX2Zyb218fCh0aGlzLl9mcm9tPXt9KSxoKHRoaXMuX3RvLHRoaXMuX2Zyb20sdGhpcy50YXJnZXQpLHRoaXMucGF0aCkpe3ZhciB0PXRoaXMucGF0aC50b3RhbERpc3RhbmNlKCk7dGhpcy5wYXRoUmV2ZXJzZT8odGhpcy5wYXRoRnJvbT10LHRoaXMucGF0aFRvPTApOih0aGlzLnBhdGhGcm9tPTAsdGhpcy5wYXRoVG89dCl9fX0se2tleTpcIl9hcHBseVwiLHZhbHVlOmZ1bmN0aW9uKHQpe2lmKHUodGhpcy5fdG8sdGhpcy5fZnJvbSx0aGlzLnRhcmdldCx0LHRoaXMuX2VsYXBzZWRUaW1lLHRoaXMuZWFzaW5nKSx0aGlzLnBhdGgpe3ZhciBlPXRoaXMucGluZ1Bvbmc/dGhpcy50aW1lLzI6dGhpcy50aW1lLG49dGhpcy5wYXRoRnJvbSxpPXRoaXMucGF0aFRvLXRoaXMucGF0aEZyb20scj1lLHM9dGhpcy5fZWxhcHNlZFRpbWUvcixvPW4raSp0aGlzLmVhc2luZyhzKSxhPXRoaXMucGF0aC5nZXRQb2ludEF0RGlzdGFuY2Uobyk7dGhpcy50YXJnZXQucG9zaXRpb24uc2V0KGEueCxhLnkpfX19LHtrZXk6XCJfY2FuVXBkYXRlXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aW1lJiZ0aGlzLmFjdGl2ZSYmdGhpcy50YXJnZXR9fV0pLGV9KHAudXRpbHMuRXZlbnRFbWl0dGVyKTtlW1wiZGVmYXVsdFwiXT12fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIHIodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89bigzKSxhPWkobyksdT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtyKHRoaXMsdCksdGhpcy50d2VlbnM9W10sdGhpcy5fdHdlZW5zVG9EZWxldGU9W10sdGhpcy5fbGFzdD0wfXJldHVybiBzKHQsW3trZXk6XCJ1cGRhdGVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT12b2lkIDA7dHx8MD09PXQ/ZT0xZTMqdDooZT10aGlzLl9nZXREZWx0YU1TKCksdD1lLzFlMyk7Zm9yKHZhciBuPTA7bjx0aGlzLnR3ZWVucy5sZW5ndGg7bisrKXt2YXIgaT10aGlzLnR3ZWVuc1tuXTtpLmFjdGl2ZSYmKGkudXBkYXRlKHQsZSksaS5pc0VuZGVkJiZpLmV4cGlyZSYmaS5yZW1vdmUoKSl9aWYodGhpcy5fdHdlZW5zVG9EZWxldGUubGVuZ3RoKXtmb3IodmFyIG49MDtuPHRoaXMuX3R3ZWVuc1RvRGVsZXRlLmxlbmd0aDtuKyspdGhpcy5fcmVtb3ZlKHRoaXMuX3R3ZWVuc1RvRGVsZXRlW25dKTt0aGlzLl90d2VlbnNUb0RlbGV0ZS5sZW5ndGg9MH19fSx7a2V5OlwiZ2V0VHdlZW5zRm9yVGFyZ2V0XCIsdmFsdWU6ZnVuY3Rpb24odCl7Zm9yKHZhciBlPVtdLG49MDtuPHRoaXMudHdlZW5zLmxlbmd0aDtuKyspdGhpcy50d2VlbnNbbl0udGFyZ2V0PT09dCYmZS5wdXNoKHRoaXMudHdlZW5zW25dKTtyZXR1cm4gZX19LHtrZXk6XCJjcmVhdGVUd2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBuZXcgYVtcImRlZmF1bHRcIl0odCx0aGlzKX19LHtrZXk6XCJhZGRUd2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3QubWFuYWdlcj10aGlzLHRoaXMudHdlZW5zLnB1c2godCl9fSx7a2V5OlwicmVtb3ZlVHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLl90d2VlbnNUb0RlbGV0ZS5wdXNoKHQpfX0se2tleTpcIl9yZW1vdmVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLnR3ZWVucy5pbmRleE9mKHQpOy0xIT09ZSYmdGhpcy50d2VlbnMuc3BsaWNlKGUsMSl9fSx7a2V5OlwiX2dldERlbHRhTVNcIix2YWx1ZTpmdW5jdGlvbigpezA9PT10aGlzLl9sYXN0JiYodGhpcy5fbGFzdD1EYXRlLm5vdygpKTt2YXIgdD1EYXRlLm5vdygpLGU9dC10aGlzLl9sYXN0O3JldHVybiB0aGlzLl9sYXN0PXQsZX19XSksdH0oKTtlW1wiZGVmYXVsdFwiXT11fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1mdW5jdGlvbiByKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgcz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPW4oMSksYT1pKG8pLHU9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7cih0aGlzLHQpLHRoaXMuX2NvbHNlZD0hMSx0aGlzLnBvbHlnb249bmV3IGEuUG9seWdvbix0aGlzLnBvbHlnb24uY2xvc2VkPSExLHRoaXMuX3RtcFBvaW50PW5ldyBhLlBvaW50LHRoaXMuX3RtcFBvaW50Mj1uZXcgYS5Qb2ludCx0aGlzLl90bXBEaXN0YW5jZT1bXSx0aGlzLmN1cnJlbnRQYXRoPW51bGwsdGhpcy5ncmFwaGljc0RhdGE9W10sdGhpcy5kaXJ0eT0hMH1yZXR1cm4gcyh0LFt7a2V5OlwibW92ZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUubW92ZVRvLmNhbGwodGhpcyx0LGUpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJsaW5lVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5saW5lVG8uY2FsbCh0aGlzLHQsZSksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImJlemllckN1cnZlVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpLHIscyl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmJlemllckN1cnZlVG8uY2FsbCh0aGlzLHQsZSxuLGkscixzKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwicXVhZHJhdGljQ3VydmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5xdWFkcmF0aWNDdXJ2ZVRvLmNhbGwodGhpcyx0LGUsbixpKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiYXJjVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpLHIpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5hcmNUby5jYWxsKHRoaXMsdCxlLG4saSxyKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiYXJjXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSxyLHMpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5hcmMuY2FsbCh0aGlzLHQsZSxuLGkscixzKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiZHJhd1NoYXBlXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmRyYXdTaGFwZS5jYWxsKHRoaXMsdCksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImdldFBvaW50XCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5wYXJzZVBvaW50cygpO3ZhciBlPXRoaXMuY2xvc2VkJiZ0Pj10aGlzLmxlbmd0aC0xPzA6Mip0O3JldHVybiB0aGlzLl90bXBQb2ludC5zZXQodGhpcy5wb2x5Z29uLnBvaW50c1tlXSx0aGlzLnBvbHlnb24ucG9pbnRzW2UrMV0pLHRoaXMuX3RtcFBvaW50fX0se2tleTpcImRpc3RhbmNlQmV0d2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7dGhpcy5wYXJzZVBvaW50cygpO3ZhciBuPXRoaXMuZ2V0UG9pbnQodCksaT1uLngscj1uLnkscz10aGlzLmdldFBvaW50KGUpLG89cy54LGE9cy55LHU9by1pLGg9YS1yO3JldHVybiBNYXRoLnNxcnQodSp1K2gqaCl9fSx7a2V5OlwidG90YWxEaXN0YW5jZVwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5wYXJzZVBvaW50cygpLHRoaXMuX3RtcERpc3RhbmNlLmxlbmd0aD0wLHRoaXMuX3RtcERpc3RhbmNlLnB1c2goMCk7Zm9yKHZhciB0PXRoaXMubGVuZ3RoLGU9MCxuPTA7dC0xPm47bisrKWUrPXRoaXMuZGlzdGFuY2VCZXR3ZWVuKG4sbisxKSx0aGlzLl90bXBEaXN0YW5jZS5wdXNoKGUpO3JldHVybiBlfX0se2tleTpcImdldFBvaW50QXRcIix2YWx1ZTpmdW5jdGlvbih0KXtpZih0aGlzLnBhcnNlUG9pbnRzKCksdD50aGlzLmxlbmd0aClyZXR1cm4gdGhpcy5nZXRQb2ludCh0aGlzLmxlbmd0aC0xKTtpZih0JTE9PT0wKXJldHVybiB0aGlzLmdldFBvaW50KHQpO3RoaXMuX3RtcFBvaW50Mi5zZXQoMCwwKTt2YXIgZT10JTEsbj10aGlzLmdldFBvaW50KE1hdGguY2VpbCh0KSksaT1uLngscj1uLnkscz10aGlzLmdldFBvaW50KE1hdGguZmxvb3IodCkpLG89cy54LGE9cy55LHU9LSgoby1pKSplKSxoPS0oKGEtcikqZSk7cmV0dXJuIHRoaXMuX3RtcFBvaW50Mi5zZXQobyt1LGEraCksdGhpcy5fdG1wUG9pbnQyfX0se2tleTpcImdldFBvaW50QXREaXN0YW5jZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMucGFyc2VQb2ludHMoKSx0aGlzLl90bXBEaXN0YW5jZXx8dGhpcy50b3RhbERpc3RhbmNlKCk7dmFyIGU9dGhpcy5fdG1wRGlzdGFuY2UubGVuZ3RoLG49MCxpPXRoaXMuX3RtcERpc3RhbmNlW3RoaXMuX3RtcERpc3RhbmNlLmxlbmd0aC0xXTswPnQ/dD1pK3Q6dD5pJiYodC09aSk7Zm9yKHZhciByPTA7ZT5yJiYodD49dGhpcy5fdG1wRGlzdGFuY2Vbcl0mJihuPXIpLCEodDx0aGlzLl90bXBEaXN0YW5jZVtyXSkpO3IrKyk7aWYobj09PXRoaXMubGVuZ3RoLTEpcmV0dXJuIHRoaXMuZ2V0UG9pbnRBdChuKTt2YXIgcz10LXRoaXMuX3RtcERpc3RhbmNlW25dLG89dGhpcy5fdG1wRGlzdGFuY2VbbisxXS10aGlzLl90bXBEaXN0YW5jZVtuXTtyZXR1cm4gdGhpcy5nZXRQb2ludEF0KG4rcy9vKX19LHtrZXk6XCJwYXJzZVBvaW50c1wiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoIXRoaXMuZGlydHkpcmV0dXJuIHRoaXM7dGhpcy5kaXJ0eT0hMSx0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aD0wO2Zvcih2YXIgdD0wO3Q8dGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoO3QrKyl7dmFyIGU9dGhpcy5ncmFwaGljc0RhdGFbdF0uc2hhcGU7ZSYmZS5wb2ludHMmJih0aGlzLnBvbHlnb24ucG9pbnRzPXRoaXMucG9seWdvbi5wb2ludHMuY29uY2F0KGUucG9pbnRzKSl9cmV0dXJuIHRoaXN9fSx7a2V5OlwiY2xlYXJcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg9MCx0aGlzLmN1cnJlbnRQYXRoPW51bGwsdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGg9MCx0aGlzLl9jbG9zZWQ9ITEsdGhpcy5kaXJ0eT0hMSx0aGlzfX0se2tleTpcImNsb3NlZFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jbG9zZWR9LHNldDpmdW5jdGlvbih0KXt0aGlzLl9jbG9zZWQhPT10JiYodGhpcy5wb2x5Z29uLmNsb3NlZD10LHRoaXMuX2Nsb3NlZD10LHRoaXMuZGlydHk9ITApfX0se2tleTpcImxlbmd0aFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aD90aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aC8yKyh0aGlzLl9jbG9zZWQ/MTowKTowfX1dKSx0fSgpO2VbXCJkZWZhdWx0XCJdPXV9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gcih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgcz1uKDEpLG89cihzKSxhPW4oNCksdT1pKGEpLGg9bigzKSxjPWkoaCksbD1uKDUpLGY9aShsKSxwPW4oMiksZD1pKHApO28uR3JhcGhpY3MucHJvdG90eXBlLmRyYXdQYXRoPWZ1bmN0aW9uKHQpe3JldHVybiB0LnBhcnNlUG9pbnRzKCksdGhpcy5kcmF3U2hhcGUodC5wb2x5Z29uKSx0aGlzfTt2YXIgZz17VHdlZW5NYW5hZ2VyOnVbXCJkZWZhdWx0XCJdLFR3ZWVuOmNbXCJkZWZhdWx0XCJdLEVhc2luZzpkW1wiZGVmYXVsdFwiXSxUd2VlblBhdGg6ZltcImRlZmF1bHRcIl19O28udHdlZW5NYW5hZ2VyfHwoby50d2Vlbk1hbmFnZXI9bmV3IHVbXCJkZWZhdWx0XCJdLG8udHdlZW49ZyksZVtcImRlZmF1bHRcIl09Z31dKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktdHdlZW4uanMubWFwIiwibW9kdWxlLmV4cG9ydHM9e1xyXG4gIFwiQVwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiY2VsbDEucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiBmYWxzZSxcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiY2VsbDEtZmlsbC5wbmdcIixcclxuICAgIFwiYWN0aXZhdGlvblwiOiA4LFxyXG4gICAgXCJzY29yZVwiOiAxXHJcbiAgfSxcclxuICBcIkJcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGwyLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogZmFsc2VcclxuICB9LFxyXG4gIFwiQ1wiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiY2VsbDQucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiBmYWxzZSxcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiY2VsbDQtZmlsbC5wbmdcIixcclxuICAgIFwiYWN0aXZhdGlvblwiOiAyMixcclxuICAgIFwic2NvcmVcIjogM1xyXG4gIH0sXHJcbiAgXCJJQ1wiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEMucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIixcclxuICAgIFwiYWN0aW9uXCI6IFwiaGlzdG9yeVwiLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDBcclxuICB9LFxyXG4gIFwiSVRMXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kVEwucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJVFwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFQucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJVFJcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRUUi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklSXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kUi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcImFjdGlvblwiOiBcImhpc3RvcnlcIixcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSUJSXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kQlIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJQlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJQkxcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRCTC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklMXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kTC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiLFxyXG4gICAgXCJhY3Rpb25cIjogXCJoaXN0b3J5XCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMFxyXG4gIH1cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgXCJsZXRcIjogW1xyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBXCIsIFwiQXxDfEJcIiwgXCJBfEF8QXxBfEN8QlwiLCBcIkFcIl0sXHJcbiAgICAgIFwic2h1ZmZsZVwiOiB0cnVlLFxyXG4gICAgICBcInRyaW1cIjogM1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQXxBfENcIiwgXCJBfEJcIiwgXCJBXCIsIFwiQlwiLCBcIkFcIl0sXHJcbiAgICAgIFwic2h1ZmZsZVwiOiB0cnVlLFxyXG4gICAgfVxyXG4gIF0sXHJcbiAgXCJlbmRcIjogW1xyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBXCIsIFwiQVwiLCBcIkFcIiwgXCJBXCIsIFwiQVwiXSxcclxuICAgIH1cclxuICBdLFxyXG4gIFwibGFiaXJpbnRcIjogW1xyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBXCIsIFwiQlwiLCBcIkJcIiwgXCJCXCIsIFwiQlwiXSxcclxuICAgICAgXCJzaHVmZmxlXCI6IHRydWVcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIkFcIiwgXCJBXCIsIFwiQVwiLCBcIkFcIiwgXCJBXCJdLFxyXG4gICAgfVxyXG4gIF0sXHJcbiAgXCJpc2xhbmRcIjogW1xyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBfEN8QlwiLCBcIkFcIiwgXCJBfEN8QlwiXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiSVRMXCIsIFwiSVRcIiwgXCJJVFJcIl1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIklMXCIsICBcIklDXCIsICBcIklSXCJdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJJQkxcIiwgXCJJQlwiLCBcIklCUlwiXVxyXG4gICAgfVxyXG4gIF1cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cz1bXHJcbiAge1xyXG4gICAgXCJmcmFnbWVudHNcIjogW1xyXG4gICAgICB7XCJpc2xhbmRcIjogMX0sXHJcbiAgICAgIHtcImxldFwiOiA0fSxcclxuICAgICAge1wibGFiaXJpbnRcIjogNX0sXHJcbiAgICAgIHtcImVuZFwiOiAxfSxcclxuICAgICAge1wiaXNsYW5kXCI6IDF9LFxyXG4gICAgXSxcclxuICAgIFwiaGlzdG9yeVwiOiB7XHJcbiAgICAgIFwicnVcIjogXCLQotC70LXQvSDQuNC00LXRgiDQt9CwINGC0L7QsdC+0Lkg0L/QviDQv9GP0YLQsNC8LiBcXG4g0J7RgtGB0YLRg9C/0LjRgdGMINC4INC+0L0g0YLQtdCx0Y8g0L/QvtCz0LvQsNGC0LjRgi4uLiBcXG4g0J3QviDQvdC1INGB0YLQvtC40YIg0L7RgtGH0LDQuNCy0LDRgtGM0YHRjywg0LLQtdC00Ywg0LzRg9C30YvQutCwINCy0YHQtdCz0LTQsCDRgSDRgtC+0LHQvtC5LlwiXHJcbiAgICB9XHJcbiAgfSxcclxuICB7XHJcbiAgICBcImZyYWdtZW50c1wiOiBbXHJcbiAgICAgIHtcImxldFwiOiAxMH0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDEwfSxcclxuICAgICAge1wiZW5kXCI6IDF9LFxyXG4gICAgICB7XCJpc2xhbmRcIjogMX1cclxuICAgIF0sXHJcbiAgICBcImhpc3RvcnlcIjoge1xyXG4gICAgICBcInJ1XCI6IFwi0KLQu9C10L0g0L3QtSDRidCw0LTQuNGCINC90LjQutC+0LPQvi4g0JvQtdGC0YPRh9C40LUg0LfQvNC10Lgg0L/QsNC00YPRgiDQvdCwINC30LXQvNC70Y4g0Lgg0L/QvtCz0YDRg9C30Y/RgtGB0Y8g0LIg0YDRg9GC0LjQvdGDINCx0YvRgtC40Y8uLi5cIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJmcmFnbWVudHNcIjogW1xyXG4gICAgICB7XCJsZXRcIjogNX0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJsZXRcIjogNX0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJsZXRcIjogNX0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJsZXRcIjogNX0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJlbmRcIjogMX0sXHJcbiAgICAgIHtcImlzbGFuZFwiOiAxfVxyXG4gICAgXSxcclxuICAgIFwiaGlzdG9yeVwiOiB7XHJcbiAgICAgIFwicnVcIjogXCLQmCDRgtC+0LPQtNCwINC+0L0g0L/QvtC90LXRgSDRgdCy0LXRh9GDINGH0LXRgNC10Lcg0YfRg9C20LjQtSDQt9C10LzQu9C4INC+0YHQstC+0LHQvtC20LTQsNGPINC70LXRgtGD0YfQuNGFINC30LzQtdC5INC4INGB0LLQvtC5INC90LDRgNC+0LQuLi5cIlxyXG4gICAgfVxyXG4gIH1cclxuXVxyXG4iLCJjb25zdCBTY2VuZXNNYW5hZ2VyID0gcmVxdWlyZSgnLi9tYW5hZ2Vycy9TY2VuZXNNYW5hZ2VyJyk7XHJcbmNvbnN0IGZpbHRlcnMgPSByZXF1aXJlKCdwaXhpLWZpbHRlcnMnKTtcclxuXHJcbmNsYXNzIEdhbWUgZXh0ZW5kcyBQSVhJLkFwcGxpY2F0aW9uIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHtiYWNrZ3JvdW5kQ29sb3I6IDB4ZmNmY2ZjfSlcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcclxuXHJcbiAgICB0aGlzLncgPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgIHRoaXMuaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy5iZyA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdiZycpKTtcclxuICAgIHRoaXMuYmcud2lkdGggPSB0aGlzLnc7XHJcbiAgICB0aGlzLmJnLmhlaWdodCA9IHRoaXMuaDtcclxuICAgIHRoaXMuY29udGFpbmVyLmFkZENoaWxkKHRoaXMuYmcpO1xyXG5cclxuICAgIHRoaXMuc2NlbmVzID0gbmV3IFNjZW5lc01hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLnNjZW5lcyk7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuZmlsdGVyQXJlYSA9IG5ldyBQSVhJLlJlY3RhbmdsZSgwLCAwLCB0aGlzLncsIHRoaXMuaCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5maWx0ZXJzID0gW25ldyBmaWx0ZXJzLk9sZEZpbG1GaWx0ZXIoe1xyXG4gICAgICBzZXBpYTogMCxcclxuICAgICAgdmlnbmV0dGluZzogLjAxLFxyXG4gICAgICBub2lzZTogLjEsXHJcbiAgICAgIHZpZ25ldHRpbmdCbHVyOiAxXHJcbiAgICB9KV07XHJcblxyXG4gICAgdGhpcy5faW5pdFRpY2tlcigpO1xyXG4gIH1cclxuICBfaW5pdFRpY2tlcigpIHtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMudGlja2VyKVxyXG5cclxuICAgIHRoaXMudGlja2VyLmFkZCgoZHQpID0+IHtcclxuICAgICAgdGhpcy5zY2VuZXMudXBkYXRlKGR0KTtcclxuICAgICAgUElYSS50d2Vlbk1hbmFnZXIudXBkYXRlKCk7XHJcbiAgICAgIHRoaXMuY29udGFpbmVyLmZpbHRlcnNbMF0uc2VlZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgIHRoaXMuY29udGFpbmVyLmZpbHRlcnNbMF0udGltZSArPSAuMDE7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuIiwicmVxdWlyZSgncGl4aS1zb3VuZCcpO1xyXG5yZXF1aXJlKCdwaXhpLXR3ZWVuJyk7XHJcbnJlcXVpcmUoJ3BpeGktcHJvamVjdGlvbicpO1xyXG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJyk7XHJcblxyXG5XZWJGb250LmxvYWQoe1xyXG4gIGdvb2dsZToge1xyXG4gICAgZmFtaWxpZXM6IFsnQW1hdGljIFNDJ11cclxuICB9LFxyXG4gIGFjdGl2ZSgpIHtcclxuICAgIFBJWEkubG9hZGVyXHJcbiAgICAgIC5hZGQoJ2Jsb2NrcycsICdhc3NldHMvYmxvY2tzLmpzb24nKVxyXG4gICAgICAuYWRkKCdwbGF5ZXInLCAnYXNzZXRzL3BsYXllci5wbmcnKVxyXG4gICAgICAuYWRkKCdiZycsICdhc3NldHMvYmcxLnBuZycpXHJcbiAgICAgIC5hZGQoJ2xpZ2h0bWFwJywgJ2Fzc2V0cy9saWdodG1hcC5wbmcnKVxyXG4gICAgICAuYWRkKCdtYXNrJywgJ2Fzc2V0cy9tYXNrLnBuZycpXHJcbiAgICAgIC5hZGQoJ211c2ljJywgJ2Fzc2V0cy9tdXNpYy5tcDMnKVxyXG4gICAgICAubG9hZCgobG9hZGVyLCByZXNvdXJjZXMpID0+IHtcclxuICAgICAgICBQSVhJLnNvdW5kLnBsYXkoJ211c2ljJyk7XHJcbiAgICAgICAgbGV0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG4gICAgICAgIGdhbWUuc2NlbmVzLmVuYWJsZVNjZW5lKCdwbGF5Z3JvdW5kJyk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5nYW1lID0gZ2FtZTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59KTtcclxuIiwiY2xhc3MgSGlzdG9yeU1hbmFnZXIgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uQ29udGFpbmVyMmQge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuZ2FtZSA9IHNjZW5lLmdhbWU7XHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICBzY2VuZS5hZGRDaGlsZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnByb2ouYWZmaW5lID0gUElYSS5wcm9qZWN0aW9uLkFGRklORS5BWElTX1g7XHJcbiAgICB0aGlzLmFscGhhID0gMDtcclxuXHJcbiAgICB0aGlzLnRleHQgPSBuZXcgUElYSS5UZXh0KCdUZXh0Jywge1xyXG4gICAgICBmb250OiAnbm9ybWFsIDQwcHggQW1hdGljIFNDJyxcclxuICAgICAgd29yZFdyYXA6IHRydWUsXHJcbiAgICAgIHdvcmRXcmFwV2lkdGg6IHRoaXMuZ2FtZS53LzIsXHJcbiAgICAgIGZpbGw6ICcjMmQ1YmZmJyxcclxuICAgICAgcGFkZGluZzogMTAsXHJcbiAgICAgIGFsaWduOiAnY2VudGVyJ1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRleHQuYW5jaG9yLnNldCguNSk7XHJcbiAgICB0aGlzLnRleHQueCA9IHRoaXMuZ2FtZS53LzI7XHJcbiAgICB0aGlzLnRleHQueSA9IDE1MDtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy50ZXh0KTtcclxuICB9XHJcbiAgc2hvd1RleHQodHh0LCB0aW1lKSB7XHJcbiAgICB0aGlzLnRleHQuc2V0VGV4dCh0eHQpO1xyXG5cclxuICAgIGxldCBzaG93ID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBzaG93LmZyb20oe2FscGhhOiAwfSkudG8oe2FscGhhOiAxfSk7XHJcbiAgICBzaG93LnRpbWUgPSAxMDAwO1xyXG4gICAgc2hvdy5zdGFydCgpO1xyXG4gICAgdGhpcy5lbWl0KCdzaG93ZW4nKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KHRoaXMuaGlkZVRleHQuYmluZCh0aGlzKSwgdGltZSk7XHJcbiAgfVxyXG4gIGhpZGVUZXh0KCkge1xyXG4gICAgbGV0IGhpZGUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIGhpZGUuZnJvbSh7YWxwaGE6IDF9KS50byh7YWxwaGE6IDB9KTtcclxuICAgIGhpZGUudGltZSA9IDEwMDA7XHJcbiAgICBoaWRlLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmVtaXQoJ2hpZGRlbicpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIaXN0b3J5TWFuYWdlcjtcclxuIiwiLypcclxuICDQnNC10L3QtdC00LbQtdGAINGD0YDQvtCy0L3QtdC5LCDRgNCw0LHQvtGC0LDQtdGCINC90LDQv9GA0Y/QvNGD0Y4g0YEgTWFwTWFuYWdlclxyXG4gINC40YHQv9C+0LvRjNC30YPRjyDQtNCw0L3QvdGL0LUgbGV2ZWxzLmpzb24g0LggIGZyYWdtZW50cy5qc29uXHJcblxyXG4gINCh0L7QsdGL0YLQuNGPOlxyXG4gICAgYWRkZWRGcmFnbWVudHNEYXRhID0+IG5ldyBmcmFnbWVudHNEYXRhXHJcbiAgICBhZGRlZExldmVscyA9PiBuZXcgbGV2ZWxzXHJcbiAgICBhZGRlZExldmVsID0+IG5ldyBsdmxcclxuXHJcbiAgICBzd2l0Y2hlZExldmVsID0+IGN1ciBsdmxcclxuICAgIHdlbnROZXh0TGV2ZWwgPT4gY3VyIGx2bFxyXG4gICAgd2VudEJhY2tMZXZlbCA9PiBjdXIgbHZsXHJcbiAgICBzd2l0Y2hlZEZyYWdtZW50ID0+IGN1ciBmcmFnXHJcbiAgICB3ZW50TmV4dEZyYWdtZW50ID0+IGN1ciBmcmFnXHJcbiAgICB3ZW50QmFja0ZyYWdtZW50ID0+IGN1ciBmcmFnXHJcblxyXG4gICAgc3RhcnRlZExldmVsID0+IG5ldyBsdmxcclxuICAgIGVuZGVkTGV2ZWwgPT4gcHJldiBsdmxcclxuKi9cclxuXHJcblxyXG5jbGFzcyBMZXZlbE1hbmFnZXIgZXh0ZW5kcyBQSVhJLnV0aWxzLkV2ZW50RW1pdHRlciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUsIG1hcCkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLm1hcCA9IG1hcDtcclxuXHJcbiAgICB0aGlzLmxldmVscyA9IFtdO1xyXG4gICAgdGhpcy5mcmFnbWVudHNEYXRhID0ge307XHJcbiAgICB0aGlzLmFkZEZyYWdtZW50c0RhdGEocmVxdWlyZSgnLi4vY29udGVudC9mcmFnbWVudHMnKSk7XHJcbiAgICB0aGlzLmFkZExldmVscyhyZXF1aXJlKCcuLi9jb250ZW50L2xldmVscycpKVxyXG5cclxuICAgIHRoaXMuY3VyTGV2ZWxJbmRleCA9IDA7XHJcbiAgICB0aGlzLmN1ckZyYWdtZW50SW5kZXggPSAwO1xyXG4gIH1cclxuICAvLyBnZXR0ZXJzXHJcbiAgZ2V0Q3VycmVudExldmVsKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubGV2ZWxzW3RoaXMuY3VyTGV2ZWxJbmRleF07XHJcbiAgfVxyXG4gIGdldEN1cnJlbnRGcmFnbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLmdldEN1cnJlbnRMZXZlbCgpICYmIHRoaXMuZ2V0Q3VycmVudExldmVsKCkubWFwc1t0aGlzLmN1ckZyYWdtZW50SW5kZXhdO1xyXG4gIH1cclxuXHJcbiAgLy8gYWRkIGZyYWdtZW50cyB0byBkYiBmcmFnbWVudHNcclxuICBhZGRGcmFnbWVudHNEYXRhKGRhdGE9e30pIHtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5mcmFnbWVudHNEYXRhLCBkYXRhKTtcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRGcmFnbWVudHNEYXRhJywgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvLyBhZGQgbGV2ZWxzIHRvIGRiIGxldmVsc1xyXG4gIGFkZExldmVscyhsZXZlbHM9W10pIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsZXZlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5hZGRMZXZlbChsZXZlbHNbaV0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdhZGRlZExldmVscycsIGxldmVscyk7XHJcbiAgfVxyXG4gIGFkZExldmVsKGx2bD17fSkge1xyXG4gICAgdGhpcy5sZXZlbHMucHVzaChsdmwpO1xyXG5cclxuICAgIC8vIGdlbmVyYXRlZCBtYXBzIHRvIGx2bCBvYmplY3RcclxuICAgIGx2bC5tYXBzID0gW107XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgbHZsLmZyYWdtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBmb3IobGV0IGtleSBpbiBsdmwuZnJhZ21lbnRzW2ldKSB7XHJcbiAgICAgICAgZm9yKGxldCBjID0gMDsgYyA8IGx2bC5mcmFnbWVudHNbaV1ba2V5XTsgYysrKSB7XHJcbiAgICAgICAgICBsdmwubWFwcy5wdXNoKHRoaXMuZnJhZ21lbnRzRGF0YVtrZXldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuZW1pdCgnYWRkZWRMZXZlbCcsIGx2bCk7XHJcbiAgfVxyXG5cclxuICAvLyBNZXRob2RzIGZvciBsZXZlbHMgY29udHJvbFxyXG4gIHN3aXRjaExldmVsKGx2bCkge1xyXG4gICAgaWYobHZsID49IHRoaXMubGV2ZWxzLmxlbmd0aCB8fCBsdmwgPCAwKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5jdXJMZXZlbEluZGV4ID0gbHZsO1xyXG4gICAgdGhpcy5zd2l0Y2hGcmFnbWVudCgwKTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ3N0YXJ0ZWRMZXZlbCcpO1xyXG4gICAgdGhpcy5lbWl0KCdzd2l0Y2hlZExldmVsJyk7XHJcbiAgfVxyXG4gIG5leHRMZXZlbCgpIHtcclxuICAgIHRoaXMuc3dpdGNoTGV2ZWwodGhpcy5jdXJMZXZlbEluZGV4KzEpO1xyXG4gICAgdGhpcy5lbWl0KCd3ZW50TmV4dExldmVsJyk7XHJcbiAgfVxyXG4gIGJhY2tMZXZlbCgpIHtcclxuICAgIHRoaXMuc3dpdGNoTGV2ZWwodGhpcy5jdXJMZXZlbEluZGV4LTEpO1xyXG4gICAgdGhpcy5lbWl0KCd3ZW50QmFja0xldmVsJyk7XHJcbiAgfVxyXG5cclxuICAvLyBNZXRob2RzIGZvciBmcmFnbWVudHMgY29udHJvbFxyXG4gIHN3aXRjaEZyYWdtZW50KGZyYWcpIHtcclxuICAgIGlmKGZyYWcgPCAwKSByZXR1cm47XHJcbiAgICB0aGlzLmN1ckZyYWdtZW50SW5kZXggPSBmcmFnO1xyXG5cclxuICAgIGlmKHRoaXMuZ2V0Q3VycmVudEZyYWdtZW50KCkpIHRoaXMubWFwLmFkZE1hcCh0aGlzLmdldEN1cnJlbnRGcmFnbWVudCgpKTtcclxuICAgIGVsc2UgdGhpcy5lbWl0KCdlbmRlZExldmVsJyk7XHJcbiAgICB0aGlzLmVtaXQoJ3N3aXRjaGVkRnJhZ21lbnQnKTtcclxuICB9XHJcbiAgbmV4dEZyYWdtZW50KCkge1xyXG4gICAgdGhpcy5zd2l0Y2hGcmFnbWVudCh0aGlzLmN1ckZyYWdtZW50SW5kZXgrMSk7XHJcbiAgICB0aGlzLmVtaXQoJ3dlbnROZXh0RnJhZ21lbnQnKTtcclxuICB9XHJcbiAgYmFja0ZyYWdtZW50KCkge1xyXG4gICAgdGhpcy5zd2l0Y2hGcmFnbWVudCh0aGlzLmN1ckZyYWdtZW50SW5kZXgtMSk7XHJcbiAgICB0aGlzLmVtaXQoJ3dlbnRCYWNrRnJhZ21lbnQnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWxNYW5hZ2VyO1xyXG4iLCIvKlxyXG4gINCU0LLQuNC20L7QuiDRgtCw0LnQu9C+0LLQvtC5INC60LDRgNGC0YtcclxuICDQodC+0LHRi9GC0LjRjzpcclxuICAgIGFkZGVkTWFwID0+IG1hcFxyXG4gICAgYWRkZWRGcmFnbWVudCA9PiBmcmFnbWVudHNcclxuICAgIGFkZGVkQmxvY2sgPT4gYmxvY2tcclxuICAgIHNjcm9sbGVkRG93biA9PiBkdERvd25cclxuICAgIHNjcm9sbGVkVG9wID0+IGR0VG9wXHJcblxyXG4gICAgcmVzaXplZFxyXG4gICAgZW5kZWRNYXBcclxuICAgIGNsZWFyZWRPdXRSYW5nZUJsb2Nrc1xyXG4qL1xyXG5cclxuXHJcbmNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi4vc3ViamVjdHMvQmxvY2snKTtcclxuY29uc3QgRGF0YUZyYWdtZW50Q29udmVydGVyID0gcmVxdWlyZSgnLi4vdXRpbHMvRGF0YUZyYWdtZW50Q29udmVydGVyJyk7XHJcblxyXG5jbGFzcyBNYXBNYW5hZ2VyIGV4dGVuZHMgUElYSS5wcm9qZWN0aW9uLkNvbnRhaW5lcjJkIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSwgcGFyYW1zPXt9KSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgc2NlbmUuYWRkQ2hpbGQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5nYW1lID0gc2NlbmUuZ2FtZTtcclxuXHJcbiAgICB0aGlzLm1heEF4aXNYID0gcGFyYW1zLm1heFggfHwgNTtcclxuICAgIHRoaXMuYmxvY2tTaXplID0gcGFyYW1zLnRpbGVTaXplIHx8IDEwMDtcclxuICAgIHRoaXMuc2V0QmxvY2tzRGF0YShyZXF1aXJlKCcuLi9jb250ZW50L2Jsb2NrcycpKTtcclxuICAgIHRoaXMucmVzaXplKCk7XHJcblxyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnNwZWVkID0gNTAwO1xyXG4gICAgdGhpcy5sYXN0SW5kZXggPSAwO1xyXG4gIH1cclxuICByZXNpemUoKSB7XHJcbiAgICB0aGlzLnggPSB0aGlzLmdhbWUudy8yLXRoaXMubWF4QXhpc1gqdGhpcy5ibG9ja1NpemUvMjtcclxuICAgIHRoaXMueSA9IHRoaXMuZ2FtZS5oLXRoaXMuc2NlbmUuUEFERElOR19CT1RUT007XHJcbiAgICB0aGlzLmVtaXQoJ3Jlc2l6ZWQnKTtcclxuICB9XHJcblxyXG4gIC8vIFNldCBwYXJhbXNcclxuICBzZXRCbG9ja3NEYXRhKGRhdGEpIHtcclxuICAgIHRoaXMuQkxPQ0tTID0gZGF0YSB8fCB7fTtcclxuICB9XHJcbiAgc2V0TWF4QXhpc1gobWF4KSB7XHJcbiAgICB0aGlzLm1heEF4aXNYID0gbWF4IHx8IDY7XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gIH1cclxuICBzZXRCbG9ja1NpemUoc2l6ZSkge1xyXG4gICAgdGhpcy5ibG9ja1NpemUgPSBzaXplIHx8IDEwMDtcclxuICAgIHRoaXMucmVzaXplKCk7XHJcbiAgfVxyXG4gIHNldFNwZWVkKHNwZWVkKSB7XHJcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQgfHwgNTAwO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIE1hcCBNYW5hZ2VyXHJcbiAgYWRkTWFwKG1hcCkge1xyXG4gICAgZm9yKGxldCBpID0gbWFwLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xyXG4gICAgICB0aGlzLmFkZEZyYWdtZW50KG1hcFtpXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkTWFwJywgbWFwKTtcclxuICAgIHRoaXMuY2xlYXJPdXRSYW5nZUJsb2NrcygpO1xyXG4gICAgdGhpcy5jb21wdXRpbmdNYXBFbmQoKTtcclxuICB9XHJcbiAgYWRkRnJhZ21lbnQoZnJhZ0RhdGEpIHtcclxuICAgIGxldCBmcmFnID0gbmV3IERhdGFGcmFnbWVudENvbnZlcnRlcihmcmFnRGF0YSkuZnJhZ21lbnQ7XHJcbiAgICAvLyBhZGQgYmxvY2sgdG8gY2VudGVyIFggYXhpcywgZm9yIGV4YW1wbGU6IHJvdW5kKCg4LTQpLzIpID0+ICsyIHBhZGRpbmcgdG8gYmxvY2sgWCBwb3NcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmcmFnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuYWRkQmxvY2soZnJhZ1tpXSwgTWF0aC5yb3VuZCgodGhpcy5tYXhBeGlzWC1mcmFnLmxlbmd0aCkvMikraSwgdGhpcy5sYXN0SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGFzdEluZGV4Kys7XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkRnJhZ21lbnQnLCBmcmFnRGF0YSk7XHJcbiAgfVxyXG4gIGFkZEJsb2NrKGlkLCB4LCB5KSB7XHJcbiAgICBpZihpZCA9PT0gJ18nKSByZXR1cm47XHJcblxyXG4gICAgbGV0IHBvc1ggPSB4KnRoaXMuYmxvY2tTaXplO1xyXG4gICAgbGV0IHBvc1kgPSAteSp0aGlzLmJsb2NrU2l6ZTtcclxuICAgIGxldCBibG9jayA9IHRoaXMuYWRkQ2hpbGQobmV3IEJsb2NrKHRoaXMsIHBvc1gsIHBvc1ksIHRoaXMuQkxPQ0tTW2lkXSkpO1xyXG4gICAgdGhpcy5lbWl0KCdhZGRlZEJsb2NrJywgYmxvY2spO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29sbGlzaW9uIFdpZGggQmxvY2tcclxuICBnZXRCbG9ja0Zyb21Qb3MocG9zKSB7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZih0aGlzLmNoaWxkcmVuW2ldLmNvbnRhaW5zUG9pbnQocG9zKSkgcmV0dXJuIHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBNb3ZpbmcgTWFwXHJcbiAgc2Nyb2xsRG93bihibG9ja3MpIHtcclxuICAgIGlmKHRoaXMuaXNTdG9wKSByZXR1cm47XHJcblxyXG4gICAgLy8gU2Nyb2xsIG1hcCBkb3duIG9uIFggYmxvY2tzXHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt5OiB0aGlzLnl9KS50byh7eTogdGhpcy55K2Jsb2Nrcyp0aGlzLmJsb2NrU2l6ZX0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZCpibG9ja3M7XHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZW1pdCgnc2Nyb2xsZWREb3duJywgYmxvY2tzKTtcclxuICAgICAgdGhpcy5jbGVhck91dFJhbmdlQmxvY2tzKCk7XHJcbiAgICAgIHRoaXMuY29tcHV0aW5nTWFwRW5kKCk7XHJcbiAgICB9KTtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuICB9XHJcbiAgc2Nyb2xsVG9wKGJsb2Nrcykge1xyXG4gICAgaWYodGhpcy5pc1N0b3ApIHJldHVybjtcclxuXHJcbiAgICAvLyBTY3JvbGwgbWFwIHRvcCBvbiBYIGJsb2Nrc1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eTogdGhpcy55fSkudG8oe3k6IHRoaXMueS1ibG9ja3MqdGhpcy5ibG9ja1NpemV9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQqYmxvY2tzO1xyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmVtaXQoJ3Njcm9sbGVkVG9wJywgYmxvY2tzKTtcclxuICAgICAgdGhpcy5jbGVhck91dFJhbmdlQmxvY2tzKCk7XHJcbiAgICAgIHRoaXMuY29tcHV0aW5nTWFwRW5kKCk7XHJcbiAgICB9KTtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuICB9XHJcblxyXG4gIC8vIENvbXB1dGluZyBtYXAgZW5kIChhbXQgYmxvY2tzIDwgbWF4IGFtdCBibG9ja3MpXHJcbiAgY29tcHV0aW5nTWFwRW5kKCkge1xyXG4gICAgaWYodGhpcy5jaGlsZHJlbi5sZW5ndGggPCB0aGlzLm1heEF4aXNYKih0aGlzLmdhbWUuaC90aGlzLmJsb2NrU2l6ZSkpIHtcclxuICAgICAgdGhpcy5lbWl0KCdlbmRlZE1hcCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gY2xlYXIgb3V0IHJhbmdlIG1hcCBibG9ja3NcclxuICBjbGVhck91dFJhbmdlQmxvY2tzKCkge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS53b3JsZFRyYW5zZm9ybS50eS10aGlzLmJsb2NrU2l6ZS8yID4gdGhpcy5nYW1lLmgpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuY2hpbGRyZW5baV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2NsZWFyZWRPdXRSYW5nZUJsb2NrcycpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBNYW5hZ2VyO1xyXG4iLCIvKlxyXG4gINCa0LvQsNGB0YEg0LTQu9GPINC/0LXRgNC10LrQu9GO0YfQtdC90LjRjyDQstC40LTQuNC80L7Qs9C+INC60L7QvdGC0LXQudC90LXRgNCwICjRgNCw0LHQvtGH0LjRhSDRgdGG0LXQvSlcclxuICDQodC+0LHRi9GC0LjRjzpcclxuICAgIGFkZGVkU2NlbmVzID0+IHNjZW5lc1xyXG4gICAgYWRkZWRTY2VuZSA9PiBzY2VuZXNcclxuICAgIHJlbW92ZWRTY2VuZSA9PiBzY2VuZVxyXG4gICAgcmVzdGFydGVkU2NlbmUgPT4gc2NlbmVcclxuICAgIGRpc2FibGVkU2NlbmUgPT4gc2NlbmVcclxuICAgIGVuYWJsZWRTY2VuZSA9PiBzY2VuZXNcclxuICAgIHVwZGF0ZWQgPT4gZHRcclxuKi9cclxuXHJcbmNsYXNzIFNjZW5lc01hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgdGhpcy5zY2VuZXMgPSByZXF1aXJlKCcuLi9zY2VuZXMnKTtcclxuICAgIHRoaXMuYWN0aXZlU2NlbmUgPSBudWxsO1xyXG4gIH1cclxuICBnZXRTY2VuZShpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2NlbmVzW2lkXTtcclxuICB9XHJcblxyXG4gIC8vIGFkZGluZyBzY2VuZXNcclxuICBhZGRTY2VuZXMoc2NlbmVzKSB7XHJcbiAgICBmb3IobGV0IGlkIGluIHNjZW5lcykge1xyXG4gICAgICB0aGlzLmFkZFNjZW5lKGlkLCBzY2VuZXNbaWRdKTtcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdCgnYWRkZWRTY2VuZXMnLCBzY2VuZXMpO1xyXG4gIH1cclxuICBhZGRTY2VuZShpZCwgc2NlbmUpIHtcclxuICAgIHRoaXMuc2NlbmVzW2lkXSA9IHNjZW5lO1xyXG4gICAgdGhpcy5lbWl0KCdhZGRlZFNjZW5lJywgc2NlbmUpO1xyXG4gIH1cclxuICByZW1vdmVTY2VuZShpZCkge1xyXG4gICAgbGV0IF9zY2VuZSA9IHRoaXMuc2NlbmVzW2lkXTtcclxuICAgIHRoaXMuc2NlbmVzW2lkXSA9IG51bGw7XHJcbiAgICB0aGlzLmVtaXQoJ3JlbW92ZWRTY2VuZScsIF9zY2VuZSk7XHJcbiAgfVxyXG5cclxuICAvLyBDb250cm9sc1xyXG4gIHJlc3RhcnRTY2VuZSgpIHtcclxuICAgIHRoaXMuZW5hYmxlU2NlbmUodGhpcy5hY3RpdmVTY2VuZS5faWRTY2VuZSk7XHJcbiAgICB0aGlzLmVtaXQoJ3Jlc3RhcnRlZFNjZW5lJywgdGhpcy5hY3RpdmVTY2VuZSk7XHJcbiAgfVxyXG4gIGRpc2FibGVTY2VuZSgpIHtcclxuICAgIGxldCBzY2VuZSA9IHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5hY3RpdmVTY2VuZSk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gbnVsbDtcclxuICAgIHRoaXMuZW1pdCgnZGlzYWJsZWRTY2VuZScsIHNjZW5lKTtcclxuICB9XHJcbiAgZW5hYmxlU2NlbmUoaWQpIHtcclxuICAgIHRoaXMuZGlzYWJsZVNjZW5lKCk7XHJcblxyXG4gICAgbGV0IFNjZW5lID0gdGhpcy5nZXRTY2VuZShpZCk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gdGhpcy5hZGRDaGlsZChuZXcgU2NlbmUodGhpcy5nYW1lLCB0aGlzKSk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lLl9pZFNjZW5lID0gaWQ7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdlbmFibGVkU2NlbmUnLCB0aGlzLmFjdGl2ZVNjZW5lKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSAmJiB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZSAmJiB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZShkdCk7XHJcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZWQnLCBkdCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lc01hbmFnZXI7XHJcbiIsImNsYXNzIFNjcmVlbk1hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5NYW5hZ2VyO1xyXG4iLCJjb25zdCBNYXBNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvTWFwTWFuYWdlcicpO1xyXG5jb25zdCBMZXZlbE1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9MZXZlbE1hbmFnZXInKTtcclxuY29uc3QgSGlzdG9yeU1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9IaXN0b3J5TWFuYWdlcicpO1xyXG5jb25zdCBTY3JlZW5NYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvU2NyZWVuTWFuYWdlcicpO1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuLi9zdWJqZWN0cy9QbGF5ZXInKTtcclxuXHJcbmNsYXNzIFBsYXlncm91bmQgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uQ29udGFpbmVyMmQge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIC8vIFByb2plY3Rpb24gc2NlbmVcclxuICAgIHRoaXMucHJvai5zZXRBeGlzWSh7eDogLXRoaXMuZ2FtZS53LzIrNTAsIHk6IDQwMDB9LCAtMSk7XHJcblxyXG4gICAgLy8gQ29uc3RhbnQgZm9yIHBvc2l0aW9uIG9iamVjdCBpbiBwcm9qZWN0aW9uXHJcbiAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIHRoaXMuUEFERElOR19CT1RUT00gPSAyODA7XHJcblxyXG5cclxuICAgIC8vIEluaXQgb2JqZWN0c1xyXG4gICAgdGhpcy5tYXAgPSBuZXcgTWFwTWFuYWdlcih0aGlzKTtcclxuICAgIHRoaXMuc2NyZWVuID0gbmV3IFNjcmVlbk1hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLmhpc3RvcnkgPSBuZXcgSGlzdG9yeU1hbmFnZXIodGhpcyk7XHJcblxyXG4gICAgdGhpcy5sZXZlbHMgPSBuZXcgTGV2ZWxNYW5hZ2VyKHRoaXMsIHRoaXMubWFwKTtcclxuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcih0aGlzLCB0aGlzLm1hcCk7XHJcblxyXG5cclxuICAgIC8vIENvbnRyb2xzXHJcbiAgICB0aGlzLm9uKCdwb2ludGVyZG93bicsICgpID0+IHRoaXMucGxheWVyLmltbXVuaXR5KCkpO1xyXG4gICAgdGhpcy5vbigncG9pbnRlcm1vdmUnLCAoZSkgPT4ge1xyXG4gICAgICBsZXQgYmxvY2sgPSB0aGlzLm1hcC5nZXRCbG9ja0Zyb21Qb3MoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICAgIGJsb2NrICYmIGJsb2NrLmhpdCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5wbGF5ZXIub24oJ2RlYWRlZCcsICgpID0+IHRoaXMucmVzdGFydCgpKTtcclxuICAgIHRoaXMucGxheWVyLm9uKCdjb2xsaXNpb24nLCAoYmxvY2spID0+IHtcclxuICAgICAgaWYoYmxvY2suYWN0aW9uID09PSAnaGlzdG9yeScpIHRoaXMuaGlzdG9yeS5zaG93VGV4dCh0aGlzLmxldmVscy5nZXRDdXJyZW50TGV2ZWwoKS5oaXN0b3J5LnJ1LCAzMDAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaGlzdG9yeS5vbignc2hvd2VuJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLm1hcC5pc1N0b3AgPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmhpc3Rvcnkub24oJ2hpZGRlbicsICgpID0+IHtcclxuICAgICAgdGhpcy5tYXAuaXNTdG9wID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubWFwLnNjcm9sbERvd24oMSk7XHJcbiAgICAgIHRoaXMubGV2ZWxzLm5leHRMZXZlbCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5tYXAub24oJ2VuZGVkTWFwJywgKCkgPT4gdGhpcy5sZXZlbHMubmV4dEZyYWdtZW50KCkpO1xyXG4gICAgdGhpcy5tYXAub24oJ3Njcm9sbGVkRG93bicsICgpID0+IHRoaXMucGxheWVyLm1vdmluZygpKTtcclxuXHJcbiAgICB0aGlzLmxldmVscy5zd2l0Y2hMZXZlbCgwKTtcclxuICAgIHRoaXMubWFwLnNjcm9sbERvd24oMSk7XHJcbiAgfVxyXG4gIHJlc3RhcnQoKSB7XHJcbiAgICB0aGlzLmdhbWUuc2NlbmVzLnJlc3RhcnRTY2VuZSgncGxheWdyb3VuZCcpO1xyXG5cclxuICAgIC8vIHRoaXMuc2NyZWVuLnNwbGFzaCgweEZGRkZGRiwgMTAwMCkudGhlbigoKSA9PiB7XHJcbiAgICAvLyAgIHRoaXMuZ2FtZS5zY2VuZXMucmVzdGFydFNjZW5lKCdwbGF5Z3JvdW5kJyk7XHJcbiAgICAvLyB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWdyb3VuZDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgJ3BsYXlncm91bmQnOiByZXF1aXJlKCcuL1BsYXlncm91bmQnKVxyXG59XHJcbiIsIi8qXHJcbiAg0JrQu9Cw0YHRgSDQkdC70L7QutCwLCDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LTQu9GPINGC0LDQudC70L7QstC+0LPQviDQtNCy0LjQttC60LBcclxuICDQodC+0LHRi9GC0LjRjzpcclxuICAgIGFjdGl2YXRlZFxyXG4gICAgZGVhY3RpdmF0ZWRcclxuICAgIGhpdGVkXHJcbiovXHJcblxyXG5jbGFzcyBCbG9jayBleHRlbmRzIFBJWEkucHJvamVjdGlvbi5TcHJpdGUyZCB7XHJcbiAgY29uc3RydWN0b3IobWFwLCB4LCB5LCBwYXJhbXM9e30pIHtcclxuICAgIHN1cGVyKFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUocGFyYW1zLmltYWdlIHx8IHBhcmFtcy5hY3RpdmF0aW9uSW1hZ2UpKTtcclxuXHJcbiAgICB0aGlzLm1hcCA9IG1hcDtcclxuICAgIHRoaXMuZ2FtZSA9IHRoaXMubWFwLmdhbWU7XHJcblxyXG4gICAgdGhpcy5zY29yZSA9IHBhcmFtcy5zY29yZTtcclxuICAgIHRoaXMuYWN0aXZhdGlvbiA9IHBhcmFtcy5hY3RpdmF0aW9uIHx8IG51bGw7XHJcbiAgICB0aGlzLmRlYWN0aXZhdGlvblRleHR1cmUgPSBwYXJhbXMuaW1hZ2UgPyBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKHBhcmFtcy5pbWFnZSkgOiBudWxsO1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uVGV4dHVyZSA9IHBhcmFtcy5hY3RpdmF0aW9uSW1hZ2UgPyBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKHBhcmFtcy5hY3RpdmF0aW9uSW1hZ2UpIDogbnVsbDtcclxuICAgIHRoaXMuaXNBY3RpdmUgPSBwYXJhbXMuYWN0aXZlO1xyXG4gICAgdGhpcy5wbGF5ZXJEaXIgPSBwYXJhbXMucGxheWVyRGlyIHx8IG51bGw7XHJcbiAgICB0aGlzLmFjdGlvbiA9IHBhcmFtcy5hY3Rpb24gfHwgbnVsbDtcclxuXHJcbiAgICB0aGlzLmFuY2hvci5zZXQoLjUpO1xyXG4gICAgdGhpcy53aWR0aCA9IG1hcC5ibG9ja1NpemUrMTtcclxuICAgIHRoaXMuaGVpZ2h0ID0gbWFwLmJsb2NrU2l6ZSsxO1xyXG4gICAgdGhpcy54ID0geCttYXAuYmxvY2tTaXplLzIrLjU7XHJcbiAgICB0aGlzLnkgPSB5K21hcC5ibG9ja1NpemUvMisuNTtcclxuICB9XHJcbiAgYWN0aXZhdGUoKSB7XHJcbiAgICBsZXQgYWN0aXZhdGluZyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpXHJcbiAgICAgIC5mcm9tKHt3aWR0aDogdGhpcy53aWR0aCozLzQsIGhlaWdodDogdGhpcy5oZWlnaHQqMy80fSlcclxuICAgICAgLnRvKHt3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCwgcm90YXRpb246IDB9KTtcclxuICAgIGFjdGl2YXRpbmcudGltZSA9IDUwMDtcclxuICAgIGFjdGl2YXRpbmcuZWFzaW5nID0gUElYSS50d2Vlbi5FYXNpbmcub3V0Qm91bmNlKCk7XHJcbiAgICBhY3RpdmF0aW5nLnN0YXJ0KCk7XHJcblxyXG4gICAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XHJcbiAgICBpZih0aGlzLmFjdGl2YXRpb25UZXh0dXJlKSB0aGlzLnRleHR1cmUgPSB0aGlzLmFjdGl2YXRpb25UZXh0dXJlO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnYWN0aXZhdGVkJyk7XHJcbiAgfVxyXG4gIGRlYWN0aXZhdGUoKSB7XHJcbiAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XHJcbiAgICBpZih0aGlzLmRlYWN0aXZhdGlvblRleHR1cmUpIHRoaXMudGV4dHVyZSA9IHRoaXMuZGVhY3RpdmF0aW9uVGV4dHVyZTtcclxuICAgIHRoaXMuZW1pdCgnZGVhY3RpdmF0ZWQnKTtcclxuICB9XHJcbiAgaGl0KCkge1xyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uID09PSBudWxsIHx8IHRoaXMuaXNBY3RpdmUpIHJldHVybjtcclxuXHJcbiAgICBsZXQgam9sdGluZyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgam9sdGluZy5mcm9tKHtyb3RhdGlvbjogMH0pLnRvKHtyb3RhdGlvbjogTWF0aC5yYW5kb20oKSA8IC41ID8gLS4xNSA6IC4xNX0pO1xyXG4gICAgam9sdGluZy50aW1lID0gMTAwO1xyXG4gICAgam9sdGluZy5waW5nUG9uZyA9IHRydWU7XHJcbiAgICBqb2x0aW5nLnN0YXJ0KCk7XHJcblxyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uKSB0aGlzLmFjdGl2YXRpb24tLTtcclxuICAgIGVsc2UgdGhpcy5hY3RpdmF0ZSgpO1xyXG4gICAgdGhpcy5lbWl0KCdoaXRlZCcpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcclxuIiwiLypcclxuICDQmtC70LDRgdGBIFBsYXllciwg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0YPQtdGCINGBIE1hcE1hbmFnZXJcclxuICDQodC+0LHRi9GC0LjRj1xyXG5cclxuKi9cclxuXHJcbmNsYXNzIFBsYXllciBleHRlbmRzIFBJWEkucHJvamVjdGlvbi5TcHJpdGUyZCB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUsIG1hcCkge1xyXG4gICAgc3VwZXIoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgncGxheWVyJykpO1xyXG4gICAgc2NlbmUuYWRkQ2hpbGQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5nYW1lID0gc2NlbmUuZ2FtZTtcclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgIHRoaXMubWFwID0gbWFwO1xyXG5cclxuICAgIHRoaXMucHJvai5hZmZpbmUgPSBQSVhJLnByb2plY3Rpb24uQUZGSU5FLkFYSVNfWDtcclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSwgMSk7XHJcbiAgICB0aGlzLnNjYWxlLnNldCguNSk7XHJcbiAgICB0aGlzLnggPSB0aGlzLmdhbWUudy8yO1xyXG4gICAgdGhpcy55ID0gdGhpcy5nYW1lLmgtdGhpcy5tYXAuYmxvY2tTaXplLzItdGhpcy5zY2VuZS5QQURESU5HX0JPVFRPTTtcclxuXHJcbiAgICB0aGlzLndhbGtpbmcgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzLnNjYWxlKTtcclxuICAgIHRoaXMud2Fsa2luZy5mcm9tKHt4OiAuNSwgeTogLjV9KS50byh7eDogLjYsIHk6IC42fSk7XHJcbiAgICB0aGlzLndhbGtpbmcudGltZSA9IDUwMDtcclxuICAgIHRoaXMud2Fsa2luZy5sb29wID0gdHJ1ZTtcclxuICAgIHRoaXMud2Fsa2luZy5waW5nUG9uZyA9IHRydWU7XHJcbiAgICB0aGlzLndhbGtpbmcuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gbnVsbDtcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLm1hcC5zcGVlZCB8fCA1MDA7XHJcbiAgICB0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuSU1NVU5JVFlfQkxPQ0tTID0gMjtcclxuICAgIHRoaXMuaW1tdW5pdHlDb3VudCA9IDU7XHJcbiAgICB0aGlzLmlzSW1tdW5pdHkgPSBmYWxzZTtcclxuICB9XHJcbiAgbW92aW5nKCkge1xyXG4gICAgaWYodGhpcy5pc0RlYWQgfHwgdGhpcy5pc0ltbXVuaXR5KSByZXR1cm47XHJcblxyXG4gICAgbGV0IGN1ciA9IHRoaXMubWFwLmdldEJsb2NrRnJvbVBvcyh7eDogdGhpcy54LCB5OiB0aGlzLnkrdGhpcy5tYXAuYmxvY2tTaXplfSk7XHJcbiAgICBpZihjdXIgJiYgY3VyLmlzQWN0aXZlKSB7XHJcbiAgICAgIHRoaXMuZW1pdCgnY29sbGlzaW9uJywgY3VyKTtcclxuXHJcbiAgICAgIGlmKGN1ci5wbGF5ZXJEaXIgPT09ICd0b3AnKSByZXR1cm4gdGhpcy50b3AoKTtcclxuICAgICAgaWYoY3VyLnBsYXllckRpciA9PT0gJ2xlZnQnKSByZXR1cm4gdGhpcy5sZWZ0KCk7XHJcbiAgICAgIGlmKGN1ci5wbGF5ZXJEaXIgPT09ICdyaWdodCcpIHJldHVybiB0aGlzLnJpZ2h0KCk7XHJcblxyXG4gICAgICAvL2NoZWNrIHRvcFxyXG4gICAgICBsZXQgdG9wID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHt4OiB0aGlzLngsIHk6IHRoaXMueX0pO1xyXG4gICAgICBpZih0b3AgJiYgdG9wLmlzQWN0aXZlICYmIHRoaXMubGFzdE1vdmUgIT09ICdib3R0b20nKSByZXR1cm4gdGhpcy50b3AoKTtcclxuXHJcbiAgICAgIC8vIGNoZWNrIGxlZnRcclxuICAgICAgbGV0IGxlZnQgPSB0aGlzLm1hcC5nZXRCbG9ja0Zyb21Qb3Moe3g6IHRoaXMueC10aGlzLm1hcC5ibG9ja1NpemUsIHk6IHRoaXMueSt0aGlzLm1hcC5ibG9ja1NpemV9KTtcclxuICAgICAgaWYobGVmdCAmJiBsZWZ0LmlzQWN0aXZlICYmIHRoaXMubGFzdE1vdmUgIT09ICdyaWdodCcpIHJldHVybiB0aGlzLmxlZnQoKTtcclxuXHJcbiAgICAgIC8vIGNoZWNrIHJpZ3RoXHJcbiAgICAgIGxldCByaWdodCA9IHRoaXMubWFwLmdldEJsb2NrRnJvbVBvcyh7eDogdGhpcy54K3RoaXMubWFwLmJsb2NrU2l6ZSwgeTogdGhpcy55K3RoaXMubWFwLmJsb2NrU2l6ZX0pO1xyXG4gICAgICBpZihyaWdodCAmJiByaWdodC5pc0FjdGl2ZSAmJiB0aGlzLmxhc3RNb3ZlICE9PSAnbGVmdCcpIHJldHVybiB0aGlzLnJpZ2h0KCk7XHJcblxyXG4gICAgICAvLyBvciBkaWVcclxuICAgICAgdGhpcy50b3AoKTtcclxuICAgIH0gZWxzZSB0aGlzLmRlYWQoKTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ21vdmVkJyk7XHJcbiAgfVxyXG4gIGRlYWQoKSB7XHJcbiAgICB0aGlzLndhbGtpbmcuc3RvcCgpO1xyXG4gICAgdGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cclxuICAgIGxldCBkZWFkID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcy5zY2FsZSk7XHJcbiAgICBkZWFkLmZyb20oe3g6IC41LCB5OiAuNX0pLnRvKHt4OiAwLCB5OiAwfSk7XHJcbiAgICBkZWFkLnRpbWUgPSAyMDA7XHJcbiAgICBkZWFkLnN0YXJ0KCk7XHJcbiAgICBkZWFkLm9uKCdlbmQnLCAoKSA9PiB0aGlzLmVtaXQoJ2RlYWRlZCcpKTtcclxuICB9XHJcbiAgaW1tdW5pdHkoKSB7XHJcbiAgICBpZighdGhpcy5pbW11bml0eUNvdW50KSByZXR1cm47XHJcblxyXG4gICAgbGV0IGltbXVuaXR5ID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBpbW11bml0eS5mcm9tKHthbHBoYTogLjV9KS50byh7YWxwaGE6IDF9KTtcclxuICAgIGltbXVuaXR5LnRpbWUgPSB0aGlzLnNwZWVkKnRoaXMuSU1NVU5JVFlfQkxPQ0tTO1xyXG4gICAgaW1tdW5pdHkuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLm1hcC5zY3JvbGxEb3duKHRoaXMuSU1NVU5JVFlfQkxPQ0tTKTtcclxuICAgIGltbXVuaXR5Lm9uKCdlbmQnLCAoKSA9PiB0aGlzLmlzSW1tdW5pdHkgPSBmYWxzZSk7XHJcbiAgICB0aGlzLmlzSW1tdW5pdHkgPSB0cnVlO1xyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICd0b3AnO1xyXG4gICAgdGhpcy5pbW11bml0eUNvdW50LS07XHJcblxyXG4gICAgdGhpcy5lbWl0KCdhY3Rpb25JbW11bml0eScpO1xyXG4gIH1cclxuICB0b3AoKSB7XHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gJ3RvcCc7XHJcbiAgICB0aGlzLm1hcC5zY3JvbGxEb3duKDEpO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uVG9wJyk7XHJcbiAgfVxyXG4gIGxlZnQoKSB7XHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gJ2xlZnQnO1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eDogdGhpcy54fSkudG8oe3g6IHRoaXMueC10aGlzLm1hcC5ibG9ja1NpemV9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQvMjtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuXHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB0aGlzLm1vdmluZygpKTtcclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uTGVmdCcpO1xyXG4gIH1cclxuICByaWdodCgpIHtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAncmlnaHQnO1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eDogdGhpcy54fSkudG8oe3g6IHRoaXMueCt0aGlzLm1hcC5ibG9ja1NpemV9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQvMjtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuXHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB0aGlzLm1vdmluZygpKTtcclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uUmlnaHQnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xyXG4iLCIvKlxyXG5UaGlzIHV0aWwgY2xhc3MgZm9yIGNvbnZlcnRlZCBkYXRhIGZyb20gZnJhZ21lbnRzLmpzb25cclxub2JqZWN0IHRvIHNpbXBsZSBtYXAgYXJyYXksIGZvciBleGFtcGxlOiBbJ0EnLCAnQScsICdBJywgJ0EnXVxyXG4qL1xyXG5cclxuY2xhc3MgRGF0YUZyYWdtZW50Q29udmVydGVyIHtcclxuICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy5pbnB1dE1hcCA9IGRhdGEubWFwO1xyXG4gICAgdGhpcy5mcmFnbWVudCA9IFtdO1xyXG5cclxuICAgIC8vIE9QRVJBVE9SU1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGRhdGEubWFwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKH5+ZGF0YS5tYXBbaV0uaW5kZXhPZignfCcpKSB0aGlzLmNhc2VPcGVyYXRvcihkYXRhLm1hcFtpXSwgaSk7XHJcbiAgICAgIGVsc2UgdGhpcy5mcmFnbWVudFtpXSA9IGRhdGEubWFwW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1FVEhPRFNcclxuICAgIGRhdGEudHJpbSAmJiB0aGlzLnJhbmRvbVRyaW0oZGF0YS50cmltKTtcclxuICAgIGRhdGEuYXBwZW5kICYmIHRoaXMucmFuZG9tQXBwZW5kKGRhdGEuYXBwZW5kKTtcclxuICAgIGRhdGEuc2h1ZmZsZSAmJiB0aGlzLnNodWZmbGUoKTtcclxuICB9XHJcblxyXG4gIC8vIE9QRVJBVE9SU1xyXG4gIC8vIENhc2Ugb3BlcmF0b3I6ICdBfEJ8Q3xEJyA9PiBDIGFuZCBldGMuLi5cclxuICBjYXNlT3BlcmF0b3Ioc3RyLCBpKSB7XHJcbiAgICBsZXQgaWRzID0gc3RyLnNwbGl0KCd8Jyk7XHJcbiAgICB0aGlzLmZyYWdtZW50W2ldID0gaWRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSppZHMubGVuZ3RoKV07XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIE1FVEhPRFNcclxuICAvLyBUcmltbWluZyBhcnJheSBpbiByYW5nZSAwLi5yYW5kKG1pbiwgbGVuZ3RoKVxyXG4gIHJhbmRvbVRyaW0obWluKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50Lmxlbmd0aCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLmZyYWdtZW50Lmxlbmd0aCsxIC0gbWluKSArIG1pbik7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgLy8gU2h1ZmZsZSBhcnJheSBbMSwyLDNdID0+IFsyLDEsM10gYW5kIGV0Yy4uLlxyXG4gIHNodWZmbGUoKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50LnNvcnQoKGEsIGIpID0+IE1hdGgucmFuZG9tKCkgPCAuNSA/IC0xIDogMSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgLy8gQWRkcyBhIGJsb2NrIHRvIHRoZSByYW5kb20gbG9jYXRpb24gb2YgdGhlIGFycmF5OiBbQSxBLEFdID0+IFtCLEEsQV0gYW5kIGV0Yy4uLlxyXG4gIHJhbmRvbUFwcGVuZChpZCkge1xyXG4gICAgdGhpcy5mcmFnbWVudFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqdGhpcy5mcmFnbWVudC5sZW5ndGgpXSA9IGlkO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFGcmFnbWVudENvbnZlcnRlcjtcclxuIl19
