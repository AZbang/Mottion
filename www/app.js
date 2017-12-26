(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * @pixi/filter-advanced-bloom - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-advanced-bloom is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r(e.__pixiFilters={})}(this,function(e){"use strict";var r="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform float threshold;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    // A simple & fast algorithm for getting brightness.\n    // It's inaccuracy , but good enought for this feature.\n    float _max = max(max(color.r, color.g), color.b);\n    float _min = min(min(color.r, color.g), color.b);\n    float brightness = (_max + _min) * 0.5;\n\n    if(brightness > threshold) {\n        gl_FragColor = color;\n    } else {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n}\n",o=function(e){function o(o){void 0===o&&(o=.5),e.call(this,r,t),this.threshold=o}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var n={threshold:{configurable:!0}};return n.threshold.get=function(){return this.uniforms.threshold},n.threshold.set=function(e){this.uniforms.threshold=e},Object.defineProperties(o.prototype,n),o}(PIXI.Filter),n="uniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D bloomTexture;\nuniform float bloomScale;\nuniform float brightness;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    color.rgb *= brightness;\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\n    bloomColor.rgb *= bloomScale;\n    gl_FragColor = color + bloomColor;\n}\n",i=function(e){function t(t){e.call(this,r,n),"number"==typeof t&&(t={threshold:t}),t=Object.assign({threshold:.5,bloomScale:1,brightness:1,blur:8,quality:4,resolution:PIXI.settings.RESOLUTION,kernelSize:5},t),this.bloomScale=t.bloomScale,this.brightness=t.brightness;var i=t.blur,l=t.quality,s=t.resolution,u=t.kernelSize,a=PIXI.filters,c=a.BlurXFilter,h=a.BlurYFilter;this._extract=new o(t.threshold),this._blurX=new c(i,l,s,u),this._blurY=new h(i,l,s,u)}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var i={threshold:{configurable:!0},blur:{configurable:!0}};return t.prototype.apply=function(e,r,t,o,n){var i=e.getRenderTarget(!0);this._extract.apply(e,r,i,!0,n),this._blurX.apply(e,i,i,!0,n),this._blurY.apply(e,i,i,!0,n),this.uniforms.bloomScale=this.bloomScale,this.uniforms.brightness=this.brightness,this.uniforms.bloomTexture=i,e.applyFilter(this,r,t,o),e.returnRenderTarget(i)},i.threshold.get=function(){return this._extract.threshold},i.threshold.set=function(e){this._extract.threshold=e},i.blur.get=function(){return this._blurX.blur},i.blur.set=function(e){this._blurX.blur=this._blurY.blur=e},Object.defineProperties(t.prototype,i),t}(PIXI.Filter);PIXI.filters.AdvancedBloomFilter=i,e.AdvancedBloomFilter=i,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],2:[function(require,module,exports){
/*!
 * @pixi/filter-ascii - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-ascii is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.__pixiFilters={})}(this,function(e){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",o="varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}",r=function(e){function r(r){void 0===r&&(r=8),e.call(this,n,o),this.size=r}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var i={size:{configurable:!0}};return i.size.get=function(){return this.uniforms.pixelSize},i.size.set=function(e){this.uniforms.pixelSize=e},Object.defineProperties(r.prototype,i),r}(PIXI.Filter);PIXI.filters.AsciiFilter=r,e.AsciiFilter=r,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],3:[function(require,module,exports){
/*!
 * @pixi/filter-bloom - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-bloom is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r(t.__pixiFilters={})}(this,function(t){"use strict";var r=PIXI.filters,e=r.BlurXFilter,i=r.BlurYFilter,l=r.AlphaFilter,u=function(t){function r(r,u,n,o){void 0===r&&(r=2),void 0===u&&(u=4),void 0===n&&(n=PIXI.settings.RESOLUTION),void 0===o&&(o=5),t.call(this);var b,s;"number"==typeof r?(b=r,s=r):r instanceof PIXI.Point?(b=r.x,s=r.y):Array.isArray(r)&&(b=r[0],s=r[1]),this.blurXFilter=new e(b,u,n,o),this.blurYFilter=new i(s,u,n,o),this.blurYFilter.blendMode=PIXI.BLEND_MODES.SCREEN,this.defaultFilter=new l}t&&(r.__proto__=t),(r.prototype=Object.create(t&&t.prototype)).constructor=r;var u={blur:{configurable:!0},blurX:{configurable:!0},blurY:{configurable:!0}};return r.prototype.apply=function(t,r,e){var i=t.getRenderTarget(!0);this.defaultFilter.apply(t,r,e),this.blurXFilter.apply(t,r,i),this.blurYFilter.apply(t,i,e),t.returnRenderTarget(i)},u.blur.get=function(){return this.blurXFilter.blur},u.blur.set=function(t){this.blurXFilter.blur=this.blurYFilter.blur=t},u.blurX.get=function(){return this.blurXFilter.blur},u.blurX.set=function(t){this.blurXFilter.blur=t},u.blurY.get=function(){return this.blurYFilter.blur},u.blurY.set=function(t){this.blurYFilter.blur=t},Object.defineProperties(r.prototype,u),r}(PIXI.Filter);PIXI.filters.BloomFilter=u,t.BloomFilter=u,Object.defineProperty(t,"__esModule",{value:!0})});


},{}],4:[function(require,module,exports){
/*!
 * @pixi/filter-bulge-pinch - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-bulge-pinch is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.__pixiFilters={})}(this,function(e){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n",r=function(e){function r(r,o,i){e.call(this,n,t),this.center=r||[.5,.5],this.radius=o||100,this.strength=i||1}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var o={radius:{configurable:!0},strength:{configurable:!0},center:{configurable:!0}};return r.prototype.apply=function(e,n,t,r){this.uniforms.dimensions[0]=n.sourceFrame.width,this.uniforms.dimensions[1]=n.sourceFrame.height,e.applyFilter(this,n,t,r)},o.radius.get=function(){return this.uniforms.radius},o.radius.set=function(e){this.uniforms.radius=e},o.strength.get=function(){return this.uniforms.strength},o.strength.set=function(e){this.uniforms.strength=e},o.center.get=function(){return this.uniforms.center},o.center.set=function(e){this.uniforms.center=e},Object.defineProperties(r.prototype,o),r}(PIXI.Filter);PIXI.filters.BulgePinchFilter=r,e.BulgePinchFilter=r,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],5:[function(require,module,exports){
/*!
 * @pixi/filter-color-replace - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-color-replace is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(o,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(o.__pixiFilters={})}(this,function(o){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(texture, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n",n=function(o){function n(n,i,t){void 0===n&&(n=16711680),void 0===i&&(i=0),void 0===t&&(t=.4),o.call(this,e,r),this.originalColor=n,this.newColor=i,this.epsilon=t}o&&(n.__proto__=o),(n.prototype=Object.create(o&&o.prototype)).constructor=n;var i={originalColor:{configurable:!0},newColor:{configurable:!0},epsilon:{configurable:!0}};return i.originalColor.set=function(o){var e=this.uniforms.originalColor;"number"==typeof o?(PIXI.utils.hex2rgb(o,e),this._originalColor=o):(e[0]=o[0],e[1]=o[1],e[2]=o[2],this._originalColor=PIXI.utils.rgb2hex(e))},i.originalColor.get=function(){return this._originalColor},i.newColor.set=function(o){var e=this.uniforms.newColor;"number"==typeof o?(PIXI.utils.hex2rgb(o,e),this._newColor=o):(e[0]=o[0],e[1]=o[1],e[2]=o[2],this._newColor=PIXI.utils.rgb2hex(e))},i.newColor.get=function(){return this._newColor},i.epsilon.set=function(o){this.uniforms.epsilon=o},i.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(n.prototype,i),n}(PIXI.Filter);PIXI.filters.ColorReplaceFilter=n,o.ColorReplaceFilter=n,Object.defineProperty(o,"__esModule",{value:!0})});


},{}],6:[function(require,module,exports){
/*!
 * @pixi/filter-convolution - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-convolution is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiFilters={})}(this,function(e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n",o=function(e){function o(o,i,n){e.call(this,t,r),this.matrix=o,this.width=i,this.height=n}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var i={matrix:{configurable:!0},width:{configurable:!0},height:{configurable:!0}};return i.matrix.get=function(){return this.uniforms.matrix},i.matrix.set=function(e){this.uniforms.matrix=new Float32Array(e)},i.width.get=function(){return 1/this.uniforms.texelSize[0]},i.width.set=function(e){this.uniforms.texelSize[0]=1/e},i.height.get=function(){return 1/this.uniforms.texelSize[1]},i.height.set=function(e){this.uniforms.texelSize[1]=1/e},Object.defineProperties(o.prototype,i),o}(PIXI.Filter);PIXI.filters.ConvolutionFilter=o,e.ConvolutionFilter=o,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],7:[function(require,module,exports){
/*!
 * @pixi/filter-cross-hatch - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-cross-hatch is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(o,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(o.__pixiFilters={})}(this,function(o){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n",e=function(o){function e(){o.call(this,n,r)}return o&&(e.__proto__=o),e.prototype=Object.create(o&&o.prototype),e.prototype.constructor=e,e}(PIXI.Filter);PIXI.filters.CrossHatchFilter=e,o.CrossHatchFilter=e,Object.defineProperty(o,"__esModule",{value:!0})});


},{}],8:[function(require,module,exports){
/*!
 * @pixi/filter-dot - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-dot is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.__pixiFilters={})}(this,function(e){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n",o=function(e){function o(o,r){void 0===o&&(o=1),void 0===r&&(r=5),e.call(this,n,t),this.scale=o,this.angle=r}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var r={scale:{configurable:!0},angle:{configurable:!0}};return r.scale.get=function(){return this.uniforms.scale},r.scale.set=function(e){this.uniforms.scale=e},r.angle.get=function(){return this.uniforms.angle},r.angle.set=function(e){this.uniforms.angle=e},Object.defineProperties(o.prototype,r),o}(PIXI.Filter);PIXI.filters.DotFilter=o,e.DotFilter=o,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],9:[function(require,module,exports){
/*!
 * @pixi/filter-drop-shadow - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-drop-shadow is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.__pixiFilters={})}(this,function(t){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n\n    // Un-premultiply alpha before applying the color\n    if (sample.a > 0.0) {\n        sample.rgb /= sample.a;\n    }\n\n    // Premultiply alpha again\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}",i=function(t){function i(i,n,o,a,l){void 0===i&&(i=45),void 0===n&&(n=5),void 0===o&&(o=2),void 0===a&&(a=0),void 0===l&&(l=.5),t.call(this),this.tintFilter=new PIXI.Filter(e,r),this.blurFilter=new PIXI.filters.BlurFilter,this.blurFilter.blur=o,this.targetTransform=new PIXI.Matrix,this.rotation=i,this.padding=n,this.distance=n,this.alpha=l,this.color=a}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var n={distance:{configurable:!0},rotation:{configurable:!0},blur:{configurable:!0},alpha:{configurable:!0},color:{configurable:!0}};return i.prototype.apply=function(t,e,r,i){var n=t.getRenderTarget();n.transform=this.targetTransform,this.tintFilter.apply(t,e,n,!0),this.blurFilter.apply(t,n,r),t.applyFilter(this,e,r,i),n.transform=null,t.returnRenderTarget(n)},i.prototype._updatePadding=function(){this.padding=this.distance+2*this.blur},i.prototype._updateTargetTransform=function(){this.targetTransform.tx=this.distance*Math.cos(this.angle),this.targetTransform.ty=this.distance*Math.sin(this.angle)},n.distance.get=function(){return this._distance},n.distance.set=function(t){this._distance=t,this._updatePadding(),this._updateTargetTransform()},n.rotation.get=function(){return this.angle/PIXI.DEG_TO_RAD},n.rotation.set=function(t){this.angle=t*PIXI.DEG_TO_RAD,this._updateTargetTransform()},n.blur.get=function(){return this.blurFilter.blur},n.blur.set=function(t){this.blurFilter.blur=t,this._updatePadding()},n.alpha.get=function(){return this.tintFilter.uniforms.alpha},n.alpha.set=function(t){this.tintFilter.uniforms.alpha=t},n.color.get=function(){return PIXI.utils.rgb2hex(this.tintFilter.uniforms.color)},n.color.set=function(t){PIXI.utils.hex2rgb(t,this.tintFilter.uniforms.color)},Object.defineProperties(i.prototype,n),i}(PIXI.Filter);PIXI.filters.DropShadowFilter=i,t.DropShadowFilter=i,Object.defineProperty(t,"__esModule",{value:!0})});


},{}],10:[function(require,module,exports){
/*!
 * @pixi/filter-emboss - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-emboss is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiFilters={})}(this,function(e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n",o=function(e){function o(o){void 0===o&&(o=5),e.call(this,t,r),this.strength=o}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var n={strength:{configurable:!0}};return n.strength.get=function(){return this.uniforms.strength},n.strength.set=function(e){this.uniforms.strength=e},Object.defineProperties(o.prototype,n),o}(PIXI.Filter);PIXI.filters.EmbossFilter=o,e.EmbossFilter=o,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],11:[function(require,module,exports){
/*!
 * @pixi/filter-glow - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-glow is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(o,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(o.__pixiFilters={})}(this,function(o){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n",e=function(o){function e(e,r,i,l,a){void 0===e&&(e=10),void 0===r&&(r=4),void 0===i&&(i=0),void 0===l&&(l=16777215),void 0===a&&(a=.1),o.call(this,n,t.replace(/%QUALITY_DIST%/gi,""+(1/a/e).toFixed(7)).replace(/%DIST%/gi,""+e.toFixed(7))),this.uniforms.glowColor=new Float32Array([0,0,0,1]),this.distance=e,this.color=l,this.outerStrength=r,this.innerStrength=i}o&&(e.__proto__=o),(e.prototype=Object.create(o&&o.prototype)).constructor=e;var r={color:{configurable:!0},distance:{configurable:!0},outerStrength:{configurable:!0},innerStrength:{configurable:!0}};return r.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.glowColor)},r.color.set=function(o){PIXI.utils.hex2rgb(o,this.uniforms.glowColor)},r.distance.get=function(){return this.uniforms.distance},r.distance.set=function(o){this.uniforms.distance=o},r.outerStrength.get=function(){return this.uniforms.outerStrength},r.outerStrength.set=function(o){this.uniforms.outerStrength=o},r.innerStrength.get=function(){return this.uniforms.innerStrength},r.innerStrength.set=function(o){this.uniforms.innerStrength=o},Object.defineProperties(e.prototype,r),e}(PIXI.Filter);PIXI.filters.GlowFilter=e,o.GlowFilter=e,Object.defineProperty(o,"__esModule",{value:!0})});


},{}],12:[function(require,module,exports){
/*!
 * @pixi/filter-godray - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-godray is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(n.__pixiFilters={})}(this,function(n){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="vec3 mod289(vec3 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x)\n{\n    return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r)\n{\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t)\n{\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n    Pi0 = mod289(Pi0);\n    Pi1 = mod289(Pi1);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n    return 2.2 * n_xyz;\n}\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\n{\n    float sum = 0.0;\n    float sc = 1.0;\n    float totalgain = 1.0;\n    for (float i = 0.0; i < 6.0; i++)\n    {\n        sum += totalgain * pnoise(P * sc, rep);\n        sc *= lacunarity;\n        totalgain *= gain;\n    }\n    return abs(sum);\n}\n",i="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform vec2 angleDir;\nuniform float gain;\nuniform float lacunarity;\nuniform float time;\n\n${perlin}\n\nvoid main(void) {\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    float xx = angleDir.x;\n    float yy = angleDir.y;\n\n    float d = (xx * coord.x) + (yy * coord.y);\n    vec3 dir = vec3(d, d, 0.0);\n\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);\n    noise = mix(noise, 0.0, 0.3);\n    //fade vertically.\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\n    mist.a = 1.0;\n    gl_FragColor += mist;\n}\n",o=function(n){function o(o,r,a,c){void 0===o&&(o=30),void 0===r&&(r=.5),void 0===a&&(a=2.5),void 0===c&&(c=0),n.call(this,e,i.replace("${perlin}",t)),this.angle=o,this.gain=r,this.lacunarity=a,this.time=c}n&&(o.__proto__=n),(o.prototype=Object.create(n&&n.prototype)).constructor=o;var r={angle:{configurable:!0},gain:{configurable:!0},lacunarity:{configurable:!0}};return o.prototype.apply=function(n,e,t,i){var o=e.sourceFrame.width,r=e.sourceFrame.height;this.uniforms.dimensions[0]=o,this.uniforms.dimensions[1]=r,this.uniforms.time=this.time,this.uniforms.angleDir[1]=this._angleSin*r/o,n.applyFilter(this,e,t,i)},r.angle.get=function(){return this._angle},r.angle.set=function(n){var e=n*PIXI.DEG_TO_RAD;this._angleCos=Math.cos(e),this._angleSin=Math.sin(e),this.uniforms.angleDir[0]=this._angleCos,this._angle=n},r.gain.get=function(){return this.uniforms.gain},r.gain.set=function(n){this.uniforms.gain=n},r.lacunarity.get=function(){return this.uniforms.lacunarity},r.lacunarity.set=function(n){this.uniforms.lacunarity=n},Object.defineProperties(o.prototype,r),o}(PIXI.Filter);PIXI.filters.GodrayFilter=o,n.GodrayFilter=o,Object.defineProperty(n,"__esModule",{value:!0})});


},{}],13:[function(require,module,exports){
/*!
 * @pixi/filter-motion-blur - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-motion-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiFilters={})}(this,function(e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",i="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uVelocity;\nuniform int uKernelSize;\nuniform float uOffset;\n\nconst int MAX_KERNEL_SIZE = 2048;\nconst int ITERATION = MAX_KERNEL_SIZE - 1;\n\nvec2 velocity = uVelocity / filterArea.xy;\n\n// float kernelSize = min(float(uKernelSize), float(MAX_KERNELSIZE));\n\n// In real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\nfloat kernelSize = float(uKernelSize);\nfloat k = kernelSize - 1.0;\nfloat offset = -uOffset / length(uVelocity) - 0.5;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        return;\n    }\n\n    for(int i = 0; i < ITERATION; i++) {\n        if (i == int(k)) {\n            break;\n        }\n        vec2 bias = velocity * (float(i) / k + offset);\n        gl_FragColor += texture2D(uSampler, vTextureCoord + bias);\n    }\n    gl_FragColor /= kernelSize;\n}\n",n=function(e){function n(n,o,r){void 0===n&&(n=[0,0]),void 0===o&&(o=5),void 0===r&&(r=0),e.call(this,t,i),this._velocity=new PIXI.Point(0,0),this.velocity=n,this.kernelSize=o,this.offset=r}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var o={velocity:{configurable:!0},offset:{configurable:!0}};return n.prototype.apply=function(e,t,i,n){var o=this.velocity,r=o.x,l=o.y;this.uniforms.uKernelSize=0!==r||0!==l?this.kernelSize:0,e.applyFilter(this,t,i,n)},o.velocity.set=function(e){Array.isArray(e)?(this._velocity.x=e[0],this._velocity.y=e[1]):e instanceof PIXI.Point&&(this._velocity.x=e.x,this._velocity.y=e.y),this.uniforms.uVelocity[0]=this._velocity.x,this.uniforms.uVelocity[1]=this._velocity.y},o.velocity.get=function(){return this._velocity},o.offset.set=function(e){this.uniforms.uOffset=e},o.offset.get=function(){return this.uniforms.uOffset},Object.defineProperties(n.prototype,o),n}(PIXI.Filter);PIXI.filters.MotionBlurFilter=n,e.MotionBlurFilter=n,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],14:[function(require,module,exports){
/*!
 * @pixi/filter-multi-color-replace - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-multi-color-replace is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(o,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(o.__pixiFilters={})}(this,function(o){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float epsilon;\n\nconst int MAX_COLORS = %maxColors%;\n\nuniform vec3 originalColors[MAX_COLORS];\nuniform vec3 targetColors[MAX_COLORS];\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    float alpha = gl_FragColor.a;\n    if (alpha < 0.0001)\n    {\n      return;\n    }\n\n    vec3 color = gl_FragColor.rgb / alpha;\n\n    for(int i = 0; i < MAX_COLORS; i++)\n    {\n      vec3 origColor = originalColors[i];\n      if (origColor.r < 0.0)\n      {\n        break;\n      }\n      vec3 colorDiff = origColor - color;\n      if (length(colorDiff) < epsilon)\n      {\n        vec3 targetColor = targetColors[i];\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\n        return;\n      }\n    }\n}\n",n=function(o){function n(n,t,i){void 0===t&&(t=.05),void 0===i&&(i=null),i=i||n.length,o.call(this,e,r.replace(/%maxColors%/g,i)),this.epsilon=t,this._maxColors=i,this._replacements=null,this.uniforms.originalColors=new Float32Array(3*i),this.uniforms.targetColors=new Float32Array(3*i),this.replacements=n}o&&(n.__proto__=o),(n.prototype=Object.create(o&&o.prototype)).constructor=n;var t={replacements:{configurable:!0},maxColors:{configurable:!0},epsilon:{configurable:!0}};return t.replacements.set=function(o){var e=this.uniforms.originalColors,r=this.uniforms.targetColors,n=o.length;if(n>this._maxColors)throw"Length of replacements ("+n+") exceeds the maximum colors length ("+this._maxColors+")";e[3*n]=-1;for(var t=0;t<n;t++){var i=o[t],l=i[0];"number"==typeof l?l=PIXI.utils.hex2rgb(l):i[0]=PIXI.utils.rgb2hex(l),e[3*t]=l[0],e[3*t+1]=l[1],e[3*t+2]=l[2];var a=i[1];"number"==typeof a?a=PIXI.utils.hex2rgb(a):i[1]=PIXI.utils.rgb2hex(a),r[3*t]=a[0],r[3*t+1]=a[1],r[3*t+2]=a[2]}this._replacements=o},t.replacements.get=function(){return this._replacements},n.prototype.refresh=function(){this.replacements=this._replacements},t.maxColors.get=function(){return this._maxColors},t.epsilon.set=function(o){this.uniforms.epsilon=o},t.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(n.prototype,t),n}(PIXI.Filter);PIXI.filters.MultiColorReplaceFilter=n,o.MultiColorReplaceFilter=n,Object.defineProperty(o,"__esModule",{value:!0})});


},{}],15:[function(require,module,exports){
/*!
 * @pixi/filter-old-film - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-old-film is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(n.__pixiFilters={})}(this,function(n){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",i="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform float sepia;\nuniform float noise;\nuniform float noiseSize;\nuniform float scratch;\nuniform float scratchDensity;\nuniform float scratchWidth;\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\nuniform float seed;\n\nconst float SQRT_2 = 1.414213;\nconst vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvec3 Overlay(vec3 src, vec3 dst)\n{\n    // if (dst <= 0.5) then: 2 * src * dst\n    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)\n    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),\n                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),\n                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\n}\n\n\nvoid main()\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 color = gl_FragColor.rgb;\n\n    if (sepia > 0.0)\n    {\n        float gray = (color.x + color.y + color.z) / 3.0;\n        vec3 grayscale = vec3(gray);\n\n        color = Overlay(SEPIA_RGB, grayscale);\n\n        color = grayscale + sepia * (color - grayscale);\n    }\n\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        vec2 dir = vec2(vec2(0.5, 0.5) - coord);\n        dir.y *= dimensions.y / dimensions.x;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    if (scratchDensity > seed && scratch != 0.0)\n    {\n        float phase = seed * 256.0;\n        float s = mod(floor(phase), 2.0);\n        float dist = 1.0 / scratchDensity;\n        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));\n        if (d < seed * 0.6 + 0.4)\n        {\n            highp float period = scratchDensity * 10.0;\n\n            float xx = coord.x * period + phase;\n            float aa = abs(mod(xx, 0.5) * 4.0);\n            float bb = mod(floor(xx / 0.5), 2.0);\n            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);\n\n            float kk = 2.0 * period;\n            float dw = scratchWidth / dimensions.x * (0.75 + seed);\n            float dh = dw * kk;\n\n            float tine = (yy - (2.0 - dh));\n\n            if (tine > 0.0) {\n                float _sign = sign(scratch);\n\n                tine = s * tine / period + scratch + 0.1;\n                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);\n\n                color.rgb *= tine;\n            }\n        }\n    }\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);\n        // float _noise = snoise(d) * 0.5;\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        color += _noise * noise;\n    }\n\n    gl_FragColor.rgb = color;\n}\n",e=function(n){function e(e,o){void 0===o&&(o=0),n.call(this,t,i),"number"==typeof e?(this.seed=e,e=null):this.seed=o,Object.assign(this,{sepia:.3,noise:.3,noiseSize:1,scratch:.5,scratchDensity:.3,scratchWidth:1,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3},e)}n&&(e.__proto__=n),(e.prototype=Object.create(n&&n.prototype)).constructor=e;var o={sepia:{configurable:!0},noise:{configurable:!0},noiseSize:{configurable:!0},scratch:{configurable:!0},scratchDensity:{configurable:!0},scratchWidth:{configurable:!0},vignetting:{configurable:!0},vignettingAlpha:{configurable:!0},vignettingBlur:{configurable:!0}};return e.prototype.apply=function(n,t,i,e){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,this.uniforms.seed=this.seed,n.applyFilter(this,t,i,e)},o.sepia.set=function(n){this.uniforms.sepia=n},o.sepia.get=function(){return this.uniforms.sepia},o.noise.set=function(n){this.uniforms.noise=n},o.noise.get=function(){return this.uniforms.noise},o.noiseSize.set=function(n){this.uniforms.noiseSize=n},o.noiseSize.get=function(){return this.uniforms.noiseSize},o.scratch.set=function(n){this.uniforms.scratch=n},o.scratch.get=function(){return this.uniforms.scratch},o.scratchDensity.set=function(n){this.uniforms.scratchDensity=n},o.scratchDensity.get=function(){return this.uniforms.scratchDensity},o.scratchWidth.set=function(n){this.uniforms.scratchWidth=n},o.scratchWidth.get=function(){return this.uniforms.scratchWidth},o.vignetting.set=function(n){this.uniforms.vignetting=n},o.vignetting.get=function(){return this.uniforms.vignetting},o.vignettingAlpha.set=function(n){this.uniforms.vignettingAlpha=n},o.vignettingAlpha.get=function(){return this.uniforms.vignettingAlpha},o.vignettingBlur.set=function(n){this.uniforms.vignettingBlur=n},o.vignettingBlur.get=function(){return this.uniforms.vignettingBlur},Object.defineProperties(e.prototype,o),e}(PIXI.Filter);PIXI.filters.OldFilmFilter=e,n.OldFilmFilter=e,Object.defineProperty(n,"__esModule",{value:!0})});


},{}],16:[function(require,module,exports){
/*!
 * @pixi/filter-outline - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-outline is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?o(exports):"function"==typeof define&&define.amd?define(["exports"],o):o(e.__pixiFilters={})}(this,function(e){"use strict";var o="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {\n        displaced.x = vTextureCoord.x + thickness * px.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness * px.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n",n=function(e){function n(n,r){void 0===n&&(n=1),void 0===r&&(r=0),e.call(this,o,t.replace(/%THICKNESS%/gi,(1/n).toFixed(7))),this.thickness=n,this.uniforms.outlineColor=new Float32Array([0,0,0,1]),this.color=r}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var r={color:{configurable:!0},thickness:{configurable:!0}};return r.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.outlineColor)},r.color.set=function(e){PIXI.utils.hex2rgb(e,this.uniforms.outlineColor)},r.thickness.get=function(){return this.uniforms.thickness},r.thickness.set=function(e){this.uniforms.thickness=e},Object.defineProperties(n.prototype,r),n}(PIXI.Filter);PIXI.filters.OutlineFilter=n,e.OutlineFilter=n,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],17:[function(require,module,exports){
/*!
 * @pixi/filter-pixelate - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-pixelate is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?o(exports):"function"==typeof define&&define.amd?define(["exports"],o):o(e.__pixiFilters={})}(this,function(e){"use strict";var o="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n",n=function(e){function n(n){void 0===n&&(n=10),e.call(this,o,r),this.size=n}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var t={size:{configurable:!0}};return t.size.get=function(){return this.uniforms.size},t.size.set=function(e){"number"==typeof e&&(e=[e,e]),this.uniforms.size=e},Object.defineProperties(n.prototype,t),n}(PIXI.Filter);PIXI.filters.PixelateFilter=n,e.PixelateFilter=n,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],18:[function(require,module,exports){
/*!
 * @pixi/filter-radial-blur - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-radial-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.__pixiFilters={})}(this,function(e){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float uRadian;\nuniform vec2 uCenter;\nuniform float uRadius;\nuniform int uKernelSize;\n\nconst int MAX_KERNEL_SIZE = 2048;\nconst int ITERATION = MAX_KERNEL_SIZE - 1;\n\n// float kernelSize = min(float(uKernelSize), float(MAX_KERNELSIZE));\n\n// In real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\nfloat kernelSize = float(uKernelSize);\nfloat k = kernelSize - 1.0;\n\n\nvec2 center = uCenter.xy / filterArea.xy;\nfloat aspect = filterArea.y / filterArea.x;\n\nfloat gradient = uRadius / filterArea.x * 0.3;\nfloat radius = uRadius / filterArea.x - gradient * 0.5;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        return;\n    }\n\n    vec2 coord = vTextureCoord;\n\n    vec2 dir = vec2(center - coord);\n    float dist = length(vec2(dir.x, dir.y * aspect));\n\n    float radianStep;\n\n    if (radius >= 0.0 && dist > radius) {\n        float delta = dist - radius;\n        float gap = gradient;\n        float scale = 1.0 - abs(delta / gap);\n        if (scale <= 0.0) {\n            return;\n        }\n        radianStep = uRadian * scale / k;\n    } else {\n        radianStep = uRadian / k;\n    }\n\n    float s = sin(radianStep);\n    float c = cos(radianStep);\n    mat2 rotationMatrix = mat2(vec2(c, -s), vec2(s, c));\n\n    for(int i = 0; i < ITERATION; i++) {\n        if (i == int(k)) {\n            break;\n        }\n\n        coord -= center;\n        coord.y *= aspect;\n        coord = rotationMatrix * coord;\n        coord.y /= aspect;\n        coord += center;\n\n        vec4 sample = texture2D(uSampler, coord);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        gl_FragColor += sample;\n    }\n    gl_FragColor /= kernelSize;\n}\n",r=function(e){function r(r,i,o,a){void 0===r&&(r=0),void 0===i&&(i=[0,0]),void 0===o&&(o=5),void 0===a&&(a=-1),e.call(this,n,t),this._angle=0,this.angle=r,this.center=i,this.kernelSize=o,this.radius=a}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var i={angle:{configurable:!0},center:{configurable:!0},radius:{configurable:!0}};return r.prototype.apply=function(e,n,t,r){this.uniforms.uKernelSize=0!==this._angle?this.kernelSize:0,e.applyFilter(this,n,t,r)},i.angle.set=function(e){this._angle=e,this.uniforms.uRadian=e*Math.PI/180},i.angle.get=function(){return this._angle},i.center.get=function(){return this.uniforms.uCenter},i.center.set=function(e){this.uniforms.uCenter=e},i.radius.get=function(){return this.uniforms.uRadius},i.radius.set=function(e){(e<0||e===1/0)&&(e=-1),this.uniforms.uRadius=e},Object.defineProperties(r.prototype,i),r}(PIXI.Filter);PIXI.filters.RadialBlurFilter=r,e.RadialBlurFilter=r,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],19:[function(require,module,exports){
/*!
 * @pixi/filter-rgb-split - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-rgb-split is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r(e.__pixiFilters={})}(this,function(e){"use strict";var r="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n",n=function(e){function n(n,o,i){void 0===n&&(n=[-10,0]),void 0===o&&(o=[0,10]),void 0===i&&(i=[0,0]),e.call(this,r,t),this.red=n,this.green=o,this.blue=i}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var o={red:{configurable:!0},green:{configurable:!0},blue:{configurable:!0}};return o.red.get=function(){return this.uniforms.red},o.red.set=function(e){this.uniforms.red=e},o.green.get=function(){return this.uniforms.green},o.green.set=function(e){this.uniforms.green=e},o.blue.get=function(){return this.uniforms.blue},o.blue.set=function(e){this.uniforms.blue=e},Object.defineProperties(n.prototype,o),n}(PIXI.Filter);PIXI.filters.RGBSplitFilter=n,e.RGBSplitFilter=n,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],20:[function(require,module,exports){
/*!
 * @pixi/filter-shockwave - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-shockwave is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiFilters={})}(this,function(e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",n="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nuniform vec2 center;\n\nuniform float amplitude;\nuniform float wavelength;\n// uniform float power;\nuniform float brightness;\nuniform float speed;\nuniform float radius;\n\nuniform float time;\n\nconst float PI = 3.14159;\n\nvoid main()\n{\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\n    float maxRadius = radius / filterArea.x;\n    float currentRadius = time * speed / filterArea.x;\n\n    float fade = 1.0;\n\n    if (maxRadius > 0.0) {\n        if (currentRadius > maxRadius) {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\n    }\n\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\n    dir.y *= filterArea.y / filterArea.x;\n    float dist = length(dir);\n\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    vec2 diffUV = normalize(dir);\n\n    float diff = (dist - currentRadius) / halfWavelength;\n\n    float p = 1.0 - pow(abs(diff), 2.0);\n\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\n\n    vec2 offset = diffUV * powDiff / filterArea.xy;\n\n    // Do clamp :\n    vec2 coord = vTextureCoord + offset;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    // No clamp :\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\n\n    gl_FragColor.rgb *= 1.0 + (brightness - 1.0) * p * fade;\n}\n",r=function(e){function r(r,i,o){void 0===r&&(r=[0,0]),void 0===i&&(i={}),void 0===o&&(o=0),e.call(this,t,n),this.center=r,Array.isArray(i)&&(console.warn("Deprecated Warning: ShockwaveFilter params Array has been changed to options Object."),i={}),i=Object.assign({amplitude:30,wavelength:160,brightness:1,speed:500,radius:-1},i),this.amplitude=i.amplitude,this.wavelength=i.wavelength,this.brightness=i.brightness,this.speed=i.speed,this.radius=i.radius,this.time=o}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var i={center:{configurable:!0},amplitude:{configurable:!0},wavelength:{configurable:!0},brightness:{configurable:!0},speed:{configurable:!0},radius:{configurable:!0}};return r.prototype.apply=function(e,t,n,r){this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},i.center.get=function(){return this.uniforms.center},i.center.set=function(e){this.uniforms.center=e},i.amplitude.get=function(){return this.uniforms.amplitude},i.amplitude.set=function(e){this.uniforms.amplitude=e},i.wavelength.get=function(){return this.uniforms.wavelength},i.wavelength.set=function(e){this.uniforms.wavelength=e},i.brightness.get=function(){return this.uniforms.brightness},i.brightness.set=function(e){this.uniforms.brightness=e},i.speed.get=function(){return this.uniforms.speed},i.speed.set=function(e){this.uniforms.speed=e},i.radius.get=function(){return this.uniforms.radius},i.radius.set=function(e){this.uniforms.radius=e},Object.defineProperties(r.prototype,i),r}(PIXI.Filter);PIXI.filters.ShockwaveFilter=r,e.ShockwaveFilter=r,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],21:[function(require,module,exports){
/*!
 * @pixi/filter-simple-lightmap - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-simple-lightmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.__pixiFilters={})}(this,function(e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",o="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D uLightmap;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 ambientColor;\nvoid main() {\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\n    vec4 light = texture2D(uLightmap, lightCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n",i=function(e){function i(i,r,n){void 0===r&&(r=0),void 0===n&&(n=1),e.call(this,t,o),this.uniforms.ambientColor=new Float32Array([0,0,0,n]),this.texture=i,this.color=r}e&&(i.__proto__=e),(i.prototype=Object.create(e&&e.prototype)).constructor=i;var r={texture:{configurable:!0},color:{configurable:!0},alpha:{configurable:!0}};return i.prototype.apply=function(e,t,o,i){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,e.applyFilter(this,t,o,i)},r.texture.get=function(){return this.uniforms.uLightmap},r.texture.set=function(e){this.uniforms.uLightmap=e},r.color.set=function(e){var t=this.uniforms.ambientColor;"number"==typeof e?(PIXI.utils.hex2rgb(e,t),this._color=e):(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],this._color=PIXI.utils.rgb2hex(t))},r.color.get=function(){return this._color},r.alpha.get=function(){return this.uniforms.ambientColor[3]},r.alpha.set=function(e){this.uniforms.ambientColor[3]=e},Object.defineProperties(i.prototype,r),i}(PIXI.Filter);PIXI.filters.SimpleLightmapFilter=i,e.SimpleLightmapFilter=i,Object.defineProperty(e,"__esModule",{value:!0})});


},{}],22:[function(require,module,exports){
/*!
 * @pixi/filter-tilt-shift - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-tilt-shift is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):i(t.__pixiFilters={})}(this,function(t){"use strict";var i="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",e="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n",r=function(t){function r(r,n,o,l){void 0===r&&(r=100),void 0===n&&(n=600),void 0===o&&(o=null),void 0===l&&(l=null),t.call(this,i,e),this.uniforms.blur=r,this.uniforms.gradientBlur=n,this.uniforms.start=o||new PIXI.Point(0,window.innerHeight/2),this.uniforms.end=l||new PIXI.Point(600,window.innerHeight/2),this.uniforms.delta=new PIXI.Point(30,30),this.uniforms.texSize=new PIXI.Point(window.innerWidth,window.innerHeight),this.updateDelta()}t&&(r.__proto__=t),(r.prototype=Object.create(t&&t.prototype)).constructor=r;var n={blur:{configurable:!0},gradientBlur:{configurable:!0},start:{configurable:!0},end:{configurable:!0}};return r.prototype.updateDelta=function(){this.uniforms.delta.x=0,this.uniforms.delta.y=0},n.blur.get=function(){return this.uniforms.blur},n.blur.set=function(t){this.uniforms.blur=t},n.gradientBlur.get=function(){return this.uniforms.gradientBlur},n.gradientBlur.set=function(t){this.uniforms.gradientBlur=t},n.start.get=function(){return this.uniforms.start},n.start.set=function(t){this.uniforms.start=t,this.updateDelta()},n.end.get=function(){return this.uniforms.end},n.end.set=function(t){this.uniforms.end=t,this.updateDelta()},Object.defineProperties(r.prototype,n),r}(PIXI.Filter);PIXI.filters.TiltShiftAxisFilter=r;var n=function(t){function i(){t.apply(this,arguments)}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,i=this.uniforms.end.y-this.uniforms.start.y,e=Math.sqrt(t*t+i*i);this.uniforms.delta.x=t/e,this.uniforms.delta.y=i/e},i}(r);PIXI.filters.TiltShiftXFilter=n;var o=function(t){function i(){t.apply(this,arguments)}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,i=this.uniforms.end.y-this.uniforms.start.y,e=Math.sqrt(t*t+i*i);this.uniforms.delta.x=-i/e,this.uniforms.delta.y=t/e},i}(r);PIXI.filters.TiltShiftYFilter=o;var l=function(t){function i(i,e,r,l){void 0===i&&(i=100),void 0===e&&(e=600),void 0===r&&(r=null),void 0===l&&(l=null),t.call(this),this.tiltShiftXFilter=new n(i,e,r,l),this.tiltShiftYFilter=new o(i,e,r,l)}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var e={blur:{configurable:!0},gradientBlur:{configurable:!0},start:{configurable:!0},end:{configurable:!0}};return i.prototype.apply=function(t,i,e){var r=t.getRenderTarget(!0);this.tiltShiftXFilter.apply(t,i,r),this.tiltShiftYFilter.apply(t,r,e),t.returnRenderTarget(r)},e.blur.get=function(){return this.tiltShiftXFilter.blur},e.blur.set=function(t){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=t},e.gradientBlur.get=function(){return this.tiltShiftXFilter.gradientBlur},e.gradientBlur.set=function(t){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=t},e.start.get=function(){return this.tiltShiftXFilter.start},e.start.set=function(t){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=t},e.end.get=function(){return this.tiltShiftXFilter.end},e.end.set=function(t){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=t},Object.defineProperties(i.prototype,e),i}(PIXI.Filter);PIXI.filters.TiltShiftFilter=l,t.TiltShiftFilter=l,t.TiltShiftXFilter=n,t.TiltShiftYFilter=o,t.TiltShiftAxisFilter=r,Object.defineProperty(t,"__esModule",{value:!0})});


},{}],23:[function(require,module,exports){
/*!
 * @pixi/filter-twist - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-twist is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(o,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(o.__pixiFilters={})}(this,function(o){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n",e=function(o){function e(e,t,i){void 0===e&&(e=200),void 0===t&&(t=4),void 0===i&&(i=20),o.call(this,n,r),this.radius=e,this.angle=t,this.padding=i}o&&(e.__proto__=o),(e.prototype=Object.create(o&&o.prototype)).constructor=e;var t={offset:{configurable:!0},radius:{configurable:!0},angle:{configurable:!0}};return t.offset.get=function(){return this.uniforms.offset},t.offset.set=function(o){this.uniforms.offset=o},t.radius.get=function(){return this.uniforms.radius},t.radius.set=function(o){this.uniforms.radius=o},t.angle.get=function(){return this.uniforms.angle},t.angle.set=function(o){this.uniforms.angle=o},Object.defineProperties(e.prototype,t),e}(PIXI.Filter);PIXI.filters.TwistFilter=e,o.TwistFilter=e,Object.defineProperty(o,"__esModule",{value:!0})});


},{}],24:[function(require,module,exports){
/*!
 * @pixi/filter-zoom-blur - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * @pixi/filter-zoom-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(n.__pixiFilters={})}(this,function(n){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",t="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nconst float MAX_KERNEL_SIZE = 32.0;\n\nfloat random(vec3 scale, float seed) {\n    // use the fragment position for a different seed per-pixel\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main() {\n\n    float minGradient = uInnerRadius * 0.3;\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n\n    float gradient = uRadius * 0.3;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float countLimit = MAX_KERNEL_SIZE;\n\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    gl_FragColor = color / total;\n\n    // switch back from pre-multiplied alpha\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n\n}\n",r=function(n){function r(r,i,o,a){void 0===r&&(r=.1),void 0===i&&(i=[0,0]),void 0===o&&(o=0),void 0===a&&(a=-1),n.call(this,e,t),this.center=i,this.strength=r,this.innerRadius=o,this.radius=a}n&&(r.__proto__=n),(r.prototype=Object.create(n&&n.prototype)).constructor=r;var i={center:{configurable:!0},strength:{configurable:!0},innerRadius:{configurable:!0},radius:{configurable:!0}};return i.center.get=function(){return this.uniforms.uCenter},i.center.set=function(n){this.uniforms.uCenter=n},i.strength.get=function(){return this.uniforms.uStrength},i.strength.set=function(n){this.uniforms.uStrength=n},i.innerRadius.get=function(){return this.uniforms.uInnerRadius},i.innerRadius.set=function(n){this.uniforms.uInnerRadius=n},i.radius.get=function(){return this.uniforms.uRadius},i.radius.set=function(n){(n<0||n===1/0)&&(n=-1),this.uniforms.uRadius=n},Object.defineProperties(r.prototype,i),r}(PIXI.Filter);PIXI.filters.ZoomBlurFilter=r,n.ZoomBlurFilter=r,Object.defineProperty(n,"__esModule",{value:!0})});


},{}],25:[function(require,module,exports){
/*!
 * pixi-filters - v2.4.0
 * Compiled Mon, 18 Dec 2017 00:36:23 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var filterAdvancedBloom=require("@pixi/filter-advanced-bloom"),filterAscii=require("@pixi/filter-ascii"),filterBloom=require("@pixi/filter-bloom"),filterBulgePinch=require("@pixi/filter-bulge-pinch"),filterColorReplace=require("@pixi/filter-color-replace"),filterConvolution=require("@pixi/filter-convolution"),filterCrossHatch=require("@pixi/filter-cross-hatch"),filterDot=require("@pixi/filter-dot"),filterDropShadow=require("@pixi/filter-drop-shadow"),filterEmboss=require("@pixi/filter-emboss"),filterGlow=require("@pixi/filter-glow"),filterGodray=require("@pixi/filter-godray"),filterMotionBlur=require("@pixi/filter-motion-blur"),filterMultiColorReplace=require("@pixi/filter-multi-color-replace"),filterOldFilm=require("@pixi/filter-old-film"),filterOutline=require("@pixi/filter-outline"),filterPixelate=require("@pixi/filter-pixelate"),filterRgbSplit=require("@pixi/filter-rgb-split"),filterRadialBlur=require("@pixi/filter-radial-blur"),filterShockwave=require("@pixi/filter-shockwave"),filterSimpleLightmap=require("@pixi/filter-simple-lightmap"),filterTiltShift=require("@pixi/filter-tilt-shift"),filterTwist=require("@pixi/filter-twist"),filterZoomBlur=require("@pixi/filter-zoom-blur");exports.AdvancedBloomFilter=filterAdvancedBloom.AdvancedBloomFilter,exports.AsciiFilter=filterAscii.AsciiFilter,exports.BloomFilter=filterBloom.BloomFilter,exports.BulgePinchFilter=filterBulgePinch.BulgePinchFilter,exports.ColorReplaceFilter=filterColorReplace.ColorReplaceFilter,exports.ConvolutionFilter=filterConvolution.ConvolutionFilter,exports.CrossHatchFilter=filterCrossHatch.CrossHatchFilter,exports.DotFilter=filterDot.DotFilter,exports.DropShadowFilter=filterDropShadow.DropShadowFilter,exports.EmbossFilter=filterEmboss.EmbossFilter,exports.GlowFilter=filterGlow.GlowFilter,exports.GodrayFilter=filterGodray.GodrayFilter,exports.MotionBlurFilter=filterMotionBlur.MotionBlurFilter,exports.MultiColorReplaceFilter=filterMultiColorReplace.MultiColorReplaceFilter,exports.OldFilmFilter=filterOldFilm.OldFilmFilter,exports.OutlineFilter=filterOutline.OutlineFilter,exports.PixelateFilter=filterPixelate.PixelateFilter,exports.RGBSplitFilter=filterRgbSplit.RGBSplitFilter,exports.RadialBlurFilter=filterRadialBlur.RadialBlurFilter,exports.ShockwaveFilter=filterShockwave.ShockwaveFilter,exports.SimpleLightmapFilter=filterSimpleLightmap.SimpleLightmapFilter,exports.TiltShiftFilter=filterTiltShift.TiltShiftFilter,exports.TiltShiftAxisFilter=filterTiltShift.TiltShiftAxisFilter,exports.TiltShiftXFilter=filterTiltShift.TiltShiftXFilter,exports.TiltShiftYFilter=filterTiltShift.TiltShiftYFilter,exports.TwistFilter=filterTwist.TwistFilter,exports.ZoomBlurFilter=filterZoomBlur.ZoomBlurFilter;


},{"@pixi/filter-advanced-bloom":1,"@pixi/filter-ascii":2,"@pixi/filter-bloom":3,"@pixi/filter-bulge-pinch":4,"@pixi/filter-color-replace":5,"@pixi/filter-convolution":6,"@pixi/filter-cross-hatch":7,"@pixi/filter-dot":8,"@pixi/filter-drop-shadow":9,"@pixi/filter-emboss":10,"@pixi/filter-glow":11,"@pixi/filter-godray":12,"@pixi/filter-motion-blur":13,"@pixi/filter-multi-color-replace":14,"@pixi/filter-old-film":15,"@pixi/filter-outline":16,"@pixi/filter-pixelate":17,"@pixi/filter-radial-blur":18,"@pixi/filter-rgb-split":19,"@pixi/filter-shockwave":20,"@pixi/filter-simple-lightmap":21,"@pixi/filter-tilt-shift":22,"@pixi/filter-twist":23,"@pixi/filter-zoom-blur":24}],26:[function(require,module,exports){
(function (global){
/*!
 * pixi-particles - v2.1.9
 * Compiled Thu, 16 Nov 2017 01:52:39 UTC
 *
 * pixi-particles is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var i;i="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,i.pixiParticles=t()}}(function(){return function t(i,e,s){function a(n,o){if(!e[n]){if(!i[n]){var h="function"==typeof require&&require;if(!o&&h)return h(n,!0);if(r)return r(n,!0);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}var p=e[n]={exports:{}};i[n][0].call(p.exports,function(t){var e=i[n][1][t];return a(e?e:t)},p,p.exports,t,i,e,s)}return e[n].exports}for(var r="function"==typeof require&&require,n=0;n<s.length;n++)a(s[n]);return a}({1:[function(t,i,e){"use strict";var s=t("./ParticleUtils"),a=t("./Particle"),r=PIXI.Texture,n=function(t){a.call(this,t),this.textures=null,this.duration=0,this.framerate=0,this.elapsed=0,this.loop=!1},o=a.prototype,h=n.prototype=Object.create(o);h.init=function(){this.Particle_init(),this.elapsed=0,this.framerate<0&&(this.duration=this.maxLife,this.framerate=this.textures.length/this.duration)},h.applyArt=function(t){this.textures=t.textures,this.framerate=t.framerate,this.duration=t.duration,this.loop=t.loop},h.update=function(t){if(this.Particle_update(t)>=0){this.elapsed+=t,this.elapsed>this.duration&&(this.loop?this.elapsed=this.elapsed%this.duration:this.elapsed=this.duration-1e-6);var i=this.elapsed*this.framerate+1e-7|0;this.texture=this.textures[i]||s.EMPTY_TEXTURE}},h.Particle_destroy=a.prototype.destroy,h.destroy=function(){this.Particle_destroy(),this.textures=null},n.parseArt=function(t){var i,e,s,a,n,o,h=[];for(i=0;i<t.length;++i){for(e=t[i],t[i]=h={},h.textures=o=[],a=e.textures,s=0;s<a.length;++s)if(n=a[s],"string"==typeof n)o.push(r.fromImage(n));else if(n instanceof r)o.push(n);else{var l=n.count||1;for(n="string"==typeof n.texture?r.fromImage(n.texture):n.texture;l>0;--l)o.push(n)}"matchLife"==e.framerate?(h.framerate=-1,h.duration=0,h.loop=!1):(h.loop=!!e.loop,h.framerate=e.framerate>0?e.framerate:60,h.duration=o.length/h.framerate)}return t},i.exports=n},{"./Particle":3,"./ParticleUtils":4}],2:[function(t,i,e){"use strict";var s=t("./ParticleUtils"),a=t("./Particle"),r=PIXI.particles.ParticleContainer||PIXI.ParticleContainer,n=PIXI.ticker.shared,o=function(t,i,e){this._particleConstructor=a,this.particleImages=null,this.startAlpha=1,this.endAlpha=1,this.startSpeed=0,this.endSpeed=0,this.minimumSpeedMultiplier=1,this.acceleration=null,this.maxSpeed=NaN,this.startScale=1,this.endScale=1,this.minimumScaleMultiplier=1,this.startColor=null,this.endColor=null,this.minLifetime=0,this.maxLifetime=0,this.minStartRotation=0,this.maxStartRotation=0,this.noRotation=!1,this.minRotationSpeed=0,this.maxRotationSpeed=0,this.particleBlendMode=0,this.customEase=null,this.extraData=null,this._frequency=1,this.maxParticles=1e3,this.emitterLifetime=-1,this.spawnPos=null,this.spawnType=null,this._spawnFunc=null,this.spawnRect=null,this.spawnCircle=null,this.particlesPerWave=1,this.particleSpacing=0,this.angleStart=0,this.rotation=0,this.ownerPos=null,this._prevEmitterPos=null,this._prevPosIsValid=!1,this._posChanged=!1,this._parentIsPC=!1,this._parent=null,this.addAtBack=!1,this.particleCount=0,this._emit=!1,this._spawnTimer=0,this._emitterLife=-1,this._activeParticlesFirst=null,this._activeParticlesLast=null,this._poolFirst=null,this._origConfig=null,this._origArt=null,this._autoUpdate=!1,this._destroyWhenComplete=!1,this._completeCallback=null,this.parent=t,i&&e&&this.init(i,e),this.recycle=this.recycle,this.update=this.update,this.rotate=this.rotate,this.updateSpawnPos=this.updateSpawnPos,this.updateOwnerPos=this.updateOwnerPos},h=o.prototype={},l=new PIXI.Point;Object.defineProperty(h,"frequency",{get:function(){return this._frequency},set:function(t){"number"==typeof t&&t>0?this._frequency=t:this._frequency=1}}),Object.defineProperty(h,"particleConstructor",{get:function(){return this._particleConstructor},set:function(t){if(t!=this._particleConstructor){this._particleConstructor=t,this.cleanup();for(var i=this._poolFirst;i;i=i.next)i.destroy();this._poolFirst=null,this._origConfig&&this._origArt&&this.init(this._origArt,this._origConfig)}}}),Object.defineProperty(h,"parent",{get:function(){return this._parent},set:function(t){if(this._parentIsPC)for(var i=this._poolFirst;i;i=i.next)i.parent&&i.parent.removeChild(i);this.cleanup(),this._parent=t,this._parentIsPC=r&&t&&t instanceof r}}),h.init=function(t,i){if(t&&i){this.cleanup(),this._origConfig=i,this._origArt=t,t=Array.isArray(t)?t.slice():[t];var e=this._particleConstructor;this.particleImages=e.parseArt?e.parseArt(t):t,i.alpha?(this.startAlpha=i.alpha.start,this.endAlpha=i.alpha.end):this.startAlpha=this.endAlpha=1,i.speed?(this.startSpeed=i.speed.start,this.endSpeed=i.speed.end,this.minimumSpeedMultiplier=i.speed.minimumSpeedMultiplier||1):(this.minimumSpeedMultiplier=1,this.startSpeed=this.endSpeed=0);var a=i.acceleration;a&&(a.x||a.y)?(this.endSpeed=this.startSpeed,this.acceleration=new PIXI.Point(a.x,a.y),this.maxSpeed=i.maxSpeed||NaN):this.acceleration=new PIXI.Point,i.scale?(this.startScale=i.scale.start,this.endScale=i.scale.end,this.minimumScaleMultiplier=i.scale.minimumScaleMultiplier||1):this.startScale=this.endScale=this.minimumScaleMultiplier=1,i.color&&(this.startColor=s.hexToRGB(i.color.start),i.color.start!=i.color.end?this.endColor=s.hexToRGB(i.color.end):this.endColor=null),i.startRotation?(this.minStartRotation=i.startRotation.min,this.maxStartRotation=i.startRotation.max):this.minStartRotation=this.maxStartRotation=0,i.noRotation&&(this.minStartRotation||this.maxStartRotation)?this.noRotation=!!i.noRotation:this.noRotation=!1,i.rotationSpeed?(this.minRotationSpeed=i.rotationSpeed.min,this.maxRotationSpeed=i.rotationSpeed.max):this.minRotationSpeed=this.maxRotationSpeed=0,this.minLifetime=i.lifetime.min,this.maxLifetime=i.lifetime.max,this.particleBlendMode=s.getBlendMode(i.blendMode),i.ease?this.customEase="function"==typeof i.ease?i.ease:s.generateEase(i.ease):this.customEase=null,e.parseData?this.extraData=e.parseData(i.extraData):this.extraData=i.extraData||null,this.spawnRect=this.spawnCircle=null,this.particlesPerWave=1,this.particleSpacing=0,this.angleStart=0;var r;switch(i.spawnType){case"rect":this.spawnType="rect",this._spawnFunc=this._spawnRect;var n=i.spawnRect;this.spawnRect=new PIXI.Rectangle(n.x,n.y,n.w,n.h);break;case"circle":this.spawnType="circle",this._spawnFunc=this._spawnCircle,r=i.spawnCircle,this.spawnCircle=new PIXI.Circle(r.x,r.y,r.r);break;case"ring":this.spawnType="ring",this._spawnFunc=this._spawnRing,r=i.spawnCircle,this.spawnCircle=new PIXI.Circle(r.x,r.y,r.r),this.spawnCircle.minRadius=r.minR;break;case"burst":this.spawnType="burst",this._spawnFunc=this._spawnBurst,this.particlesPerWave=i.particlesPerWave,this.particleSpacing=i.particleSpacing,this.angleStart=i.angleStart?i.angleStart:0;break;case"point":this.spawnType="point",this._spawnFunc=this._spawnPoint;break;default:this.spawnType="point",this._spawnFunc=this._spawnPoint}this.frequency=i.frequency,this.emitterLifetime=i.emitterLifetime||-1,this.maxParticles=i.maxParticles>0?i.maxParticles:1e3,this.addAtBack=!!i.addAtBack,this.rotation=0,this.ownerPos=new PIXI.Point,this.spawnPos=new PIXI.Point(i.pos.x,i.pos.y),this._prevEmitterPos=this.spawnPos.clone(),this._prevPosIsValid=!1,this._spawnTimer=0,this.emit=void 0===i.emit||!!i.emit,this.autoUpdate=void 0!==i.autoUpdate&&!!i.autoUpdate}},h.recycle=function(t){t.next&&(t.next.prev=t.prev),t.prev&&(t.prev.next=t.next),t==this._activeParticlesLast&&(this._activeParticlesLast=t.prev),t==this._activeParticlesFirst&&(this._activeParticlesFirst=t.next),t.prev=null,t.next=this._poolFirst,this._poolFirst=t,this._parentIsPC?(t.alpha=0,t.visible=!1):t.parent&&t.parent.removeChild(t),--this.particleCount},h.rotate=function(t){if(this.rotation!=t){var i=t-this.rotation;this.rotation=t,s.rotatePoint(i,this.spawnPos),this._posChanged=!0}},h.updateSpawnPos=function(t,i){this._posChanged=!0,this.spawnPos.x=t,this.spawnPos.y=i},h.updateOwnerPos=function(t,i){this._posChanged=!0,this.ownerPos.x=t,this.ownerPos.y=i},h.resetPositionTracking=function(){this._prevPosIsValid=!1},Object.defineProperty(h,"emit",{get:function(){return this._emit},set:function(t){this._emit=!!t,this._emitterLife=this.emitterLifetime}}),Object.defineProperty(h,"autoUpdate",{get:function(){return this._autoUpdate},set:function(t){this._autoUpdate&&!t?n.remove(this.update,this):!this._autoUpdate&&t&&n.add(this.update,this),this._autoUpdate=!!t}}),h.playOnceAndDestroy=function(t){this.autoUpdate=!0,this.emit=!0,this._destroyWhenComplete=!0,this._completeCallback=t},h.playOnce=function(t){this.autoUpdate=!0,this.emit=!0,this._completeCallback=t},h.update=function(t){if(this._autoUpdate&&(t=t/PIXI.settings.TARGET_FPMS/1e3),this._parent){var i,e,s;for(e=this._activeParticlesFirst;e;e=s)s=e.next,e.update(t);var a,r;this._prevPosIsValid&&(a=this._prevEmitterPos.x,r=this._prevEmitterPos.y);var n=this.ownerPos.x+this.spawnPos.x,o=this.ownerPos.y+this.spawnPos.y;if(this._emit)for(this._spawnTimer-=t;this._spawnTimer<=0;){if(this._emitterLife>0&&(this._emitterLife-=this._frequency,this._emitterLife<=0)){this._spawnTimer=0,this._emitterLife=0,this.emit=!1;break}if(this.particleCount>=this.maxParticles)this._spawnTimer+=this._frequency;else{var h;if(h=this.minLifetime==this.maxLifetime?this.minLifetime:Math.random()*(this.maxLifetime-this.minLifetime)+this.minLifetime,-this._spawnTimer<h){var l,p;if(this._prevPosIsValid&&this._posChanged){var c=1+this._spawnTimer/t;l=(n-a)*c+a,p=(o-r)*c+r}else l=n,p=o;i=0;for(var d=Math.min(this.particlesPerWave,this.maxParticles-this.particleCount);i<d;++i){var u,m;if(this._poolFirst?(u=this._poolFirst,this._poolFirst=this._poolFirst.next,u.next=null):u=new this.particleConstructor(this),this.particleImages.length>1?u.applyArt(this.particleImages[Math.floor(Math.random()*this.particleImages.length)]):u.applyArt(this.particleImages[0]),u.startAlpha=this.startAlpha,u.endAlpha=this.endAlpha,1!=this.minimumSpeedMultiplier?(m=Math.random()*(1-this.minimumSpeedMultiplier)+this.minimumSpeedMultiplier,u.startSpeed=this.startSpeed*m,u.endSpeed=this.endSpeed*m):(u.startSpeed=this.startSpeed,u.endSpeed=this.endSpeed),u.acceleration.x=this.acceleration.x,u.acceleration.y=this.acceleration.y,u.maxSpeed=this.maxSpeed,1!=this.minimumScaleMultiplier?(m=Math.random()*(1-this.minimumScaleMultiplier)+this.minimumScaleMultiplier,u.startScale=this.startScale*m,u.endScale=this.endScale*m):(u.startScale=this.startScale,u.endScale=this.endScale),u.startColor=this.startColor,u.endColor=this.endColor,this.minRotationSpeed==this.maxRotationSpeed?u.rotationSpeed=this.minRotationSpeed:u.rotationSpeed=Math.random()*(this.maxRotationSpeed-this.minRotationSpeed)+this.minRotationSpeed,u.noRotation=this.noRotation,u.maxLife=h,u.blendMode=this.particleBlendMode,u.ease=this.customEase,u.extraData=this.extraData,this._spawnFunc(u,l,p,i),u.init(),u.update(-this._spawnTimer),this._parentIsPC&&u.parent){var f=this._parent.children;if(f[0]==u)f.shift();else if(f[f.length-1]==u)f.pop();else{var _=f.indexOf(u);f.splice(_,1)}this.addAtBack?f.unshift(u):f.push(u)}else this.addAtBack?this._parent.addChildAt(u,0):this._parent.addChild(u);this._activeParticlesLast?(this._activeParticlesLast.next=u,u.prev=this._activeParticlesLast,this._activeParticlesLast=u):this._activeParticlesLast=this._activeParticlesFirst=u,++this.particleCount}}this._spawnTimer+=this._frequency}}this._posChanged&&(this._prevEmitterPos.x=n,this._prevEmitterPos.y=o,this._prevPosIsValid=!0,this._posChanged=!1),this._emit||this._activeParticlesFirst||(this._completeCallback&&this._completeCallback(),this._destroyWhenComplete&&this.destroy())}},h._spawnPoint=function(t,i,e){this.minStartRotation==this.maxStartRotation?t.rotation=this.minStartRotation+this.rotation:t.rotation=Math.random()*(this.maxStartRotation-this.minStartRotation)+this.minStartRotation+this.rotation,t.position.x=i,t.position.y=e},h._spawnRect=function(t,i,e){this.minStartRotation==this.maxStartRotation?t.rotation=this.minStartRotation+this.rotation:t.rotation=Math.random()*(this.maxStartRotation-this.minStartRotation)+this.minStartRotation+this.rotation,l.x=Math.random()*this.spawnRect.width+this.spawnRect.x,l.y=Math.random()*this.spawnRect.height+this.spawnRect.y,0!==this.rotation&&s.rotatePoint(this.rotation,l),t.position.x=i+l.x,t.position.y=e+l.y},h._spawnCircle=function(t,i,e){this.minStartRotation==this.maxStartRotation?t.rotation=this.minStartRotation+this.rotation:t.rotation=Math.random()*(this.maxStartRotation-this.minStartRotation)+this.minStartRotation+this.rotation,l.x=Math.random()*this.spawnCircle.radius,l.y=0,s.rotatePoint(360*Math.random(),l),l.x+=this.spawnCircle.x,l.y+=this.spawnCircle.y,0!==this.rotation&&s.rotatePoint(this.rotation,l),t.position.x=i+l.x,t.position.y=e+l.y},h._spawnRing=function(t,i,e){var a=this.spawnCircle;this.minStartRotation==this.maxStartRotation?t.rotation=this.minStartRotation+this.rotation:t.rotation=Math.random()*(this.maxStartRotation-this.minStartRotation)+this.minStartRotation+this.rotation,a.minRadius==a.radius?l.x=Math.random()*(a.radius-a.minRadius)+a.minRadius:l.x=a.radius,l.y=0;var r=360*Math.random();t.rotation+=r,s.rotatePoint(r,l),l.x+=this.spawnCircle.x,l.y+=this.spawnCircle.y,0!==this.rotation&&s.rotatePoint(this.rotation,l),t.position.x=i+l.x,t.position.y=e+l.y},h._spawnBurst=function(t,i,e,s){0===this.particleSpacing?t.rotation=360*Math.random():t.rotation=this.angleStart+this.particleSpacing*s+this.rotation,t.position.x=i,t.position.y=e},h.cleanup=function(){var t,i;for(t=this._activeParticlesFirst;t;t=i)i=t.next,this.recycle(t),t.parent&&t.parent.removeChild(t);this._activeParticlesFirst=this._activeParticlesLast=null,this.particleCount=0},h.destroy=function(){this.autoUpdate=!1,this.cleanup();for(var t,i=this._poolFirst;i;i=t)t=i.next,i.destroy();this._poolFirst=this._parent=this.particleImages=this.spawnPos=this.ownerPos=this.startColor=this.endColor=this.customEase=this._completeCallback=null},i.exports=o},{"./Particle":3,"./ParticleUtils":4}],3:[function(t,i,e){var s=t("./ParticleUtils"),a=PIXI.Sprite,r=function(t){a.call(this),this.emitter=t,this.anchor.x=this.anchor.y=.5,this.velocity=new PIXI.Point,this.maxLife=0,this.age=0,this.ease=null,this.extraData=null,this.startAlpha=0,this.endAlpha=0,this.startSpeed=0,this.endSpeed=0,this.acceleration=new PIXI.Point,this.maxSpeed=NaN,this.startScale=0,this.endScale=0,this.startColor=null,this._sR=0,this._sG=0,this._sB=0,this.endColor=null,this._eR=0,this._eG=0,this._eB=0,this._doAlpha=!1,this._doScale=!1,this._doSpeed=!1,this._doAcceleration=!1,this._doColor=!1,this._doNormalMovement=!1,this._oneOverLife=0,this.next=null,this.prev=null,this.init=this.init,this.Particle_init=this.Particle_init,this.update=this.update,this.Particle_update=this.Particle_update,this.applyArt=this.applyArt,this.kill=this.kill},n=r.prototype=Object.create(a.prototype);n.init=n.Particle_init=function(){this.age=0,this.velocity.x=this.startSpeed,this.velocity.y=0,s.rotatePoint(this.rotation,this.velocity),this.noRotation?this.rotation=0:this.rotation*=s.DEG_TO_RADS,this.rotationSpeed*=s.DEG_TO_RADS,this.alpha=this.startAlpha,this.scale.x=this.scale.y=this.startScale,this.startColor&&(this._sR=this.startColor[0],this._sG=this.startColor[1],this._sB=this.startColor[2],this.endColor&&(this._eR=this.endColor[0],this._eG=this.endColor[1],this._eB=this.endColor[2])),this._doAlpha=this.startAlpha!=this.endAlpha,this._doSpeed=this.startSpeed!=this.endSpeed,this._doScale=this.startScale!=this.endScale,this._doColor=!!this.endColor,this._doAcceleration=0!==this.acceleration.x||0!==this.acceleration.y,this._doNormalMovement=this._doSpeed||0!==this.startSpeed||this._doAcceleration,this._oneOverLife=1/this.maxLife,this.tint=s.combineRGBComponents(this._sR,this._sG,this._sB),this.visible=!0},n.applyArt=function(t){this.texture=t||s.EMPTY_TEXTURE},n.update=n.Particle_update=function(t){if(this.age+=t,this.age>=this.maxLife)return this.kill(),-1;var i=this.age*this._oneOverLife;if(this.ease&&(i=4==this.ease.length?this.ease(i,0,1,1):this.ease(i)),this._doAlpha&&(this.alpha=(this.endAlpha-this.startAlpha)*i+this.startAlpha),this._doScale){var e=(this.endScale-this.startScale)*i+this.startScale;this.scale.x=this.scale.y=e}if(this._doNormalMovement){if(this._doSpeed){var a=(this.endSpeed-this.startSpeed)*i+this.startSpeed;s.normalize(this.velocity),s.scaleBy(this.velocity,a)}else if(this._doAcceleration&&(this.velocity.x+=this.acceleration.x*t,this.velocity.y+=this.acceleration.y*t,this.maxSpeed)){var r=s.length(this.velocity);r>this.maxSpeed&&s.scaleBy(this.velocity,this.maxSpeed/r)}this.position.x+=this.velocity.x*t,this.position.y+=this.velocity.y*t}if(this._doColor){var n=(this._eR-this._sR)*i+this._sR,o=(this._eG-this._sG)*i+this._sG,h=(this._eB-this._sB)*i+this._sB;this.tint=s.combineRGBComponents(n,o,h)}return 0!==this.rotationSpeed?this.rotation+=this.rotationSpeed*t:this.acceleration&&!this.noRotation&&(this.rotation=Math.atan2(this.velocity.y,this.velocity.x)),i},n.kill=function(){this.emitter.recycle(this)},n.Sprite_Destroy=a.prototype.destroy,n.destroy=function(){this.parent&&this.parent.removeChild(this),this.Sprite_Destroy&&this.Sprite_Destroy(),this.emitter=this.velocity=this.startColor=this.endColor=this.ease=this.next=this.prev=null},r.parseArt=function(t){var i;for(i=t.length;i>=0;--i)"string"==typeof t[i]&&(t[i]=PIXI.Texture.fromImage(t[i]));if(s.verbose)for(i=t.length-1;i>0;--i)if(t[i].baseTexture!=t[i-1].baseTexture){window.console&&console.warn("PixiParticles: using particle textures from different images may hinder performance in WebGL");break}return t},r.parseData=function(t){return t},i.exports=r},{"./ParticleUtils":4}],4:[function(t,i,e){"use strict";var s=PIXI.BLEND_MODES||PIXI.blendModes,a=PIXI.Texture,r={};r.verbose=!1;var n=r.DEG_TO_RADS=Math.PI/180,o=r.EMPTY_TEXTURE=a.EMPTY;o.on=o.destroy=o.once=o.emit=function(){},r.rotatePoint=function(t,i){if(t){t*=n;var e=Math.sin(t),s=Math.cos(t),a=i.x*s-i.y*e,r=i.x*e+i.y*s;i.x=a,i.y=r}},r.combineRGBComponents=function(t,i,e){return t<<16|i<<8|e},r.normalize=function(t){var i=1/r.length(t);t.x*=i,t.y*=i},r.scaleBy=function(t,i){t.x*=i,t.y*=i},r.length=function(t){return Math.sqrt(t.x*t.x+t.y*t.y)},r.hexToRGB=function(t,i){i?i.length=0:i=[],"#"==t.charAt(0)?t=t.substr(1):0===t.indexOf("0x")&&(t=t.substr(2));var e;return 8==t.length&&(e=t.substr(0,2),t=t.substr(2)),i.push(parseInt(t.substr(0,2),16)),i.push(parseInt(t.substr(2,2),16)),i.push(parseInt(t.substr(4,2),16)),e&&i.push(parseInt(e,16)),i},r.generateEase=function(t){var i=t.length,e=1/i,s=function(s){var a,r,n=i*s|0;return a=(s-n*e)*i,r=t[n]||t[i-1],r.s+a*(2*(1-a)*(r.cp-r.s)+a*(r.e-r.s))};return s},r.getBlendMode=function(t){if(!t)return s.NORMAL;for(t=t.toUpperCase();t.indexOf(" ")>=0;)t=t.replace(" ","_");return s[t]||s.NORMAL},i.exports=r},{}],5:[function(t,i,e){"use strict";var s=t("./ParticleUtils"),a=t("./Particle"),r=function(t){a.call(this,t),this.path=null,this.initialRotation=0,this.initialPosition=new PIXI.Point,this.movement=0},n=a.prototype,o=r.prototype=Object.create(n),h=new PIXI.Point;o.init=function(){this.initialRotation=this.rotation,this.Particle_init(),this.path=this.extraData.path,this._doNormalMovement=!this.path,this.movement=0,this.initialPosition.x=this.position.x,this.initialPosition.y=this.position.y};for(var l=["pow","sqrt","abs","floor","round","ceil","E","PI","sin","cos","tan","asin","acos","atan","atan2","log"],p="[01234567890\\.\\*\\-\\+\\/\\(\\)x ,]",c=l.length-1;c>=0;--c)p+="|"+l[c];p=new RegExp(p,"g");var d=function(t){for(var i=t.match(p),e=i.length-1;e>=0;--e)l.indexOf(i[e])>=0&&(i[e]="Math."+i[e]);return t=i.join(""),new Function("x","return "+t+";")};o.update=function(t){var i=this.Particle_update(t);if(i>=0&&this.path){var e=(this.endSpeed-this.startSpeed)*i+this.startSpeed;this.movement+=e*t,h.x=this.movement,h.y=this.path(this.movement),s.rotatePoint(this.initialRotation,h),this.position.x=this.initialPosition.x+h.x,this.position.y=this.initialPosition.y+h.y}},o.Particle_destroy=a.prototype.destroy,o.destroy=function(){this.Particle_destroy(),this.path=this.initialPosition=null},r.parseArt=function(t){return a.parseArt(t)},r.parseData=function(t){var i={};if(t&&t.path)try{i.path=d(t.path)}catch(t){s.verbose&&console.error("PathParticle: error in parsing path expression"),i.path=null}else s.verbose&&console.error("PathParticle requires a path string in extraData!"),i.path=null;return i},i.exports=r},{"./Particle":3,"./ParticleUtils":4}],6:[function(t,i,e){},{}],7:[function(t,i,e){e.ParticleUtils=t("./ParticleUtils.js"),e.Particle=t("./Particle.js"),e.Emitter=t("./Emitter.js"),e.PathParticle=t("./PathParticle.js"),e.AnimatedParticle=t("./AnimatedParticle.js"),t("./deprecation.js")},{"./AnimatedParticle.js":1,"./Emitter.js":2,"./Particle.js":3,"./ParticleUtils.js":4,"./PathParticle.js":5,"./deprecation.js":6}],8:[function(t,i,e){"use strict";var s="undefined"!=typeof window?window:GLOBAL;if(s.PIXI.particles||(s.PIXI.particles={}),"undefined"!=typeof i&&i.exports)"undefined"==typeof PIXI&&t("pixi.js"),i.exports=s.PIXI.particles||a;else if("undefined"==typeof PIXI)throw"pixi-particles requires pixi.js to be loaded first";var a=t("./particles");for(var r in a)s.PIXI.particles[r]=a[r]},{"./particles":7,"pixi.js":void 0}]},{},[8])(8)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],29:[function(require,module,exports){
!function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(6)},function(t,e){t.exports=PIXI},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={linear:function(){return function(t){return t}},inQuad:function(){return function(t){return t*t}},outQuad:function(){return function(t){return t*(2-t)}},inOutQuad:function(){return function(t){return t*=2,1>t?.5*t*t:-.5*(--t*(t-2)-1)}},inCubic:function(){return function(t){return t*t*t}},outCubic:function(){return function(t){return--t*t*t+1}},inOutCubic:function(){return function(t){return t*=2,1>t?.5*t*t*t:(t-=2,.5*(t*t*t+2))}},inQuart:function(){return function(t){return t*t*t*t}},outQuart:function(){return function(t){return 1- --t*t*t*t}},inOutQuart:function(){return function(t){return t*=2,1>t?.5*t*t*t*t:(t-=2,-.5*(t*t*t*t-2))}},inQuint:function(){return function(t){return t*t*t*t*t}},outQuint:function(){return function(t){return--t*t*t*t*t+1}},inOutQuint:function(){return function(t){return t*=2,1>t?.5*t*t*t*t*t:(t-=2,.5*(t*t*t*t*t+2))}},inSine:function(){return function(t){return 1-Math.cos(t*Math.PI/2)}},outSine:function(){return function(t){return Math.sin(t*Math.PI/2)}},inOutSine:function(){return function(t){return.5*(1-Math.cos(Math.PI*t))}},inExpo:function(){return function(t){return 0===t?0:Math.pow(1024,t-1)}},outExpo:function(){return function(t){return 1===t?1:1-Math.pow(2,-10*t)}},inOutExpo:function(){return function(t){return 0===t?0:1===t?1:(t*=2,1>t?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2))}},inCirc:function(){return function(t){return 1-Math.sqrt(1-t*t)}},outCirc:function(){return function(t){return Math.sqrt(1- --t*t)}},inOutCirc:function(){return function(t){return t*=2,1>t?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-2)*(t-2))+1)}},inElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),-(t*Math.pow(2,10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)))}},outElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),t*Math.pow(2,-10*n)*Math.sin((n-i)*(2*Math.PI)/e)+1)}},inOutElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),n*=2,1>n?-.5*(t*Math.pow(2,10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)):t*Math.pow(2,-10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)*.5+1)}},inBack:function(t){return function(e){var n=t||1.70158;return e*e*((n+1)*e-n)}},outBack:function(t){return function(e){var n=t||1.70158;return--e*e*((n+1)*e+n)+1}},inOutBack:function(t){return function(e){var n=1.525*(t||1.70158);return e*=2,1>e?.5*(e*e*((n+1)*e-n)):.5*((e-2)*(e-2)*((n+1)*(e-2)+n)+2)}},inBounce:function(){return function(t){return 1-n.outBounce()(1-t)}},outBounce:function(){return function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?(t-=1.5/2.75,7.5625*t*t+.75):2.5/2.75>t?(t-=2.25/2.75,7.5625*t*t+.9375):(t-=2.625/2.75,7.5625*t*t+.984375)}},inOutBounce:function(){return function(t){return.5>t?.5*n.inBounce()(2*t):.5*n.outBounce()(2*t-1)+.5}},customArray:function(t){return t?function(t){return t}:n.linear()}};e["default"]=n},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e,n,i,r,s){for(var o in t)if(c(t[o]))u(t[o],e[o],n[o],i,r,s);else{var a=e[o],h=t[o]-e[o],l=i,f=r/l;n[o]=a+h*s(f)}}function h(t,e,n){for(var i in t)0===e[i]||e[i]||(c(n[i])?(e[i]=JSON.parse(JSON.stringify(n[i])),h(t[i],e[i],n[i])):e[i]=n[i])}function c(t){return"[object Object]"===Object.prototype.toString.call(t)}var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var f=n(1),p=r(f),d=n(2),g=i(d),v=function(t){function e(t,n){s(this,e);var i=o(this,Object.getPrototypeOf(e).call(this));return i.target=t,n&&i.addTo(n),i.clear(),i}return a(e,t),l(e,[{key:"addTo",value:function(t){return this.manager=t,this.manager.addTween(this),this}},{key:"chain",value:function(t){return t||(t=new e(this.target)),this._chainTween=t,t}},{key:"start",value:function(){return this.active=!0,this}},{key:"stop",value:function(){return this.active=!1,this.emit("stop"),this}},{key:"to",value:function(t){return this._to=t,this}},{key:"from",value:function(t){return this._from=t,this}},{key:"remove",value:function(){return this.manager?(this.manager.removeTween(this),this):this}},{key:"clear",value:function(){this.time=0,this.active=!1,this.easing=g["default"].linear(),this.expire=!1,this.repeat=0,this.loop=!1,this.delay=0,this.pingPong=!1,this.isStarted=!1,this.isEnded=!1,this._to=null,this._from=null,this._delayTime=0,this._elapsedTime=0,this._repeat=0,this._pingPong=!1,this._chainTween=null,this.path=null,this.pathReverse=!1,this.pathFrom=0,this.pathTo=0}},{key:"reset",value:function(){if(this._elapsedTime=0,this._repeat=0,this._delayTime=0,this.isStarted=!1,this.isEnded=!1,this.pingPong&&this._pingPong){var t=this._to,e=this._from;this._to=e,this._from=t,this._pingPong=!1}return this}},{key:"update",value:function(t,e){if(this._canUpdate()||!this._to&&!this.path){var n=void 0,i=void 0;if(this.delay>this._delayTime)return void(this._delayTime+=e);this.isStarted||(this._parseData(),this.isStarted=!0,this.emit("start"));var r=this.pingPong?this.time/2:this.time;if(r>this._elapsedTime){var s=this._elapsedTime+e,o=s>=r;this._elapsedTime=o?r:s,this._apply(r);var a=this._pingPong?r+this._elapsedTime:this._elapsedTime;if(this.emit("update",a),o){if(this.pingPong&&!this._pingPong)return this._pingPong=!0,n=this._to,i=this._from,this._from=n,this._to=i,this.path&&(n=this.pathTo,i=this.pathFrom,this.pathTo=i,this.pathFrom=n),this.emit("pingpong"),void(this._elapsedTime=0);if(this.loop||this.repeat>this._repeat)return this._repeat++,this.emit("repeat",this._repeat),this._elapsedTime=0,void(this.pingPong&&this._pingPong&&(n=this._to,i=this._from,this._to=i,this._from=n,this.path&&(n=this.pathTo,i=this.pathFrom,this.pathTo=i,this.pathFrom=n),this._pingPong=!1));this.isEnded=!0,this.active=!1,this.emit("end"),this._chainTween&&(this._chainTween.addTo(this.manager),this._chainTween.start())}}}}},{key:"_parseData",value:function(){if(!this.isStarted&&(this._from||(this._from={}),h(this._to,this._from,this.target),this.path)){var t=this.path.totalDistance();this.pathReverse?(this.pathFrom=t,this.pathTo=0):(this.pathFrom=0,this.pathTo=t)}}},{key:"_apply",value:function(t){if(u(this._to,this._from,this.target,t,this._elapsedTime,this.easing),this.path){var e=this.pingPong?this.time/2:this.time,n=this.pathFrom,i=this.pathTo-this.pathFrom,r=e,s=this._elapsedTime/r,o=n+i*this.easing(s),a=this.path.getPointAtDistance(o);this.target.position.set(a.x,a.y)}}},{key:"_canUpdate",value:function(){return this.time&&this.active&&this.target}}]),e}(p.utils.EventEmitter);e["default"]=v},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),a=i(o),u=function(){function t(){r(this,t),this.tweens=[],this._tweensToDelete=[],this._last=0}return s(t,[{key:"update",value:function(t){var e=void 0;t||0===t?e=1e3*t:(e=this._getDeltaMS(),t=e/1e3);for(var n=0;n<this.tweens.length;n++){var i=this.tweens[n];i.active&&(i.update(t,e),i.isEnded&&i.expire&&i.remove())}if(this._tweensToDelete.length){for(var n=0;n<this._tweensToDelete.length;n++)this._remove(this._tweensToDelete[n]);this._tweensToDelete.length=0}}},{key:"getTweensForTarget",value:function(t){for(var e=[],n=0;n<this.tweens.length;n++)this.tweens[n].target===t&&e.push(this.tweens[n]);return e}},{key:"createTween",value:function(t){return new a["default"](t,this)}},{key:"addTween",value:function(t){t.manager=this,this.tweens.push(t)}},{key:"removeTween",value:function(t){this._tweensToDelete.push(t)}},{key:"_remove",value:function(t){var e=this.tweens.indexOf(t);-1!==e&&this.tweens.splice(e,1)}},{key:"_getDeltaMS",value:function(){0===this._last&&(this._last=Date.now());var t=Date.now(),e=t-this._last;return this._last=t,e}}]),t}();e["default"]=u},function(t,e,n){"use strict";function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),u=function(){function t(){r(this,t),this._colsed=!1,this.polygon=new a.Polygon,this.polygon.closed=!1,this._tmpPoint=new a.Point,this._tmpPoint2=new a.Point,this._tmpDistance=[],this.currentPath=null,this.graphicsData=[],this.dirty=!0}return s(t,[{key:"moveTo",value:function(t,e){return a.Graphics.prototype.moveTo.call(this,t,e),this.dirty=!0,this}},{key:"lineTo",value:function(t,e){return a.Graphics.prototype.lineTo.call(this,t,e),this.dirty=!0,this}},{key:"bezierCurveTo",value:function(t,e,n,i,r,s){return a.Graphics.prototype.bezierCurveTo.call(this,t,e,n,i,r,s),this.dirty=!0,this}},{key:"quadraticCurveTo",value:function(t,e,n,i){return a.Graphics.prototype.quadraticCurveTo.call(this,t,e,n,i),this.dirty=!0,this}},{key:"arcTo",value:function(t,e,n,i,r){return a.Graphics.prototype.arcTo.call(this,t,e,n,i,r),this.dirty=!0,this}},{key:"arc",value:function(t,e,n,i,r,s){return a.Graphics.prototype.arc.call(this,t,e,n,i,r,s),this.dirty=!0,this}},{key:"drawShape",value:function(t){return a.Graphics.prototype.drawShape.call(this,t),this.dirty=!0,this}},{key:"getPoint",value:function(t){this.parsePoints();var e=this.closed&&t>=this.length-1?0:2*t;return this._tmpPoint.set(this.polygon.points[e],this.polygon.points[e+1]),this._tmpPoint}},{key:"distanceBetween",value:function(t,e){this.parsePoints();var n=this.getPoint(t),i=n.x,r=n.y,s=this.getPoint(e),o=s.x,a=s.y,u=o-i,h=a-r;return Math.sqrt(u*u+h*h)}},{key:"totalDistance",value:function(){this.parsePoints(),this._tmpDistance.length=0,this._tmpDistance.push(0);for(var t=this.length,e=0,n=0;t-1>n;n++)e+=this.distanceBetween(n,n+1),this._tmpDistance.push(e);return e}},{key:"getPointAt",value:function(t){if(this.parsePoints(),t>this.length)return this.getPoint(this.length-1);if(t%1===0)return this.getPoint(t);this._tmpPoint2.set(0,0);var e=t%1,n=this.getPoint(Math.ceil(t)),i=n.x,r=n.y,s=this.getPoint(Math.floor(t)),o=s.x,a=s.y,u=-((o-i)*e),h=-((a-r)*e);return this._tmpPoint2.set(o+u,a+h),this._tmpPoint2}},{key:"getPointAtDistance",value:function(t){this.parsePoints(),this._tmpDistance||this.totalDistance();var e=this._tmpDistance.length,n=0,i=this._tmpDistance[this._tmpDistance.length-1];0>t?t=i+t:t>i&&(t-=i);for(var r=0;e>r&&(t>=this._tmpDistance[r]&&(n=r),!(t<this._tmpDistance[r]));r++);if(n===this.length-1)return this.getPointAt(n);var s=t-this._tmpDistance[n],o=this._tmpDistance[n+1]-this._tmpDistance[n];return this.getPointAt(n+s/o)}},{key:"parsePoints",value:function(){if(!this.dirty)return this;this.dirty=!1,this.polygon.points.length=0;for(var t=0;t<this.graphicsData.length;t++){var e=this.graphicsData[t].shape;e&&e.points&&(this.polygon.points=this.polygon.points.concat(e.points))}return this}},{key:"clear",value:function(){return this.graphicsData.length=0,this.currentPath=null,this.polygon.points.length=0,this._closed=!1,this.dirty=!1,this}},{key:"closed",get:function(){return this._closed},set:function(t){this._closed!==t&&(this.polygon.closed=t,this._closed=t,this.dirty=!0)}},{key:"length",get:function(){return this.polygon.points.length?this.polygon.points.length/2+(this._closed?1:0):0}}]),t}();e["default"]=u},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(4),u=i(a),h=n(3),c=i(h),l=n(5),f=i(l),p=n(2),d=i(p);o.Graphics.prototype.drawPath=function(t){return t.parsePoints(),this.drawShape(t.polygon),this};var g={TweenManager:u["default"],Tween:c["default"],Easing:d["default"],TweenPath:f["default"]};o.tweenManager||(o.tweenManager=new u["default"],o.tween=g),e["default"]=g}]);

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
module.exports={
  "let": [
    {
      "map": ["A", "A|C|B", "A", "A", "A"],
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
      "map": ["B", "B", "B", "B", "B"],
      "append": "A"
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScenesManager = require('./managers/ScenesManager');
var filters = require('pixi-filters');
var CloudsFilter = require('./shaders/clouds');
var Sphere = require('./subjects/Sphere');

var Game = function (_PIXI$Application) {
    _inherits(Game, _PIXI$Application);

    function Game() {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, window.innerWidth, window.innerHeight, { backgroundColor: 0xfcfcfc }));

        document.body.appendChild(_this.view);

        _this.w = window.innerWidth;
        _this.h = window.innerHeight;

        _this.container = new PIXI.Container();
        _this.stage.addChild(_this.container);

        _this.bg = new PIXI.Sprite(PIXI.Texture.fromImage('bg'));
        _this.bg.width = _this.w;
        _this.bg.height = _this.h;
        _this.container.addChild(_this.bg);

        _this.scenes = new ScenesManager(_this);
        _this.container.addChild(_this.scenes);

        _this.container.filterArea = new PIXI.Rectangle(0, 0, _this.w, _this.h);
        _this.container.filters = [new filters.OldFilmFilter({
            sepia: 0,
            vignetting: 0,
            noise: .1,
            vignettingBlur: 1
        })];

        _this.container.interactive = true;
        _this.container.cursor = 'none';
        _this.mouse = new Sphere();
        _this.container.addChild(_this.mouse);

        _this.container.on('pointermove', function (e) {
            _this.mouse.x = e.data.global.x;
            _this.mouse.y = e.data.global.y;
        });

        _this._initTicker();
        return _this;
    }

    _createClass(Game, [{
        key: '_initTicker',
        value: function _initTicker() {
            var _this2 = this;

            this.ticker.add(function (dt) {
                _this2.scenes.update(dt);
                PIXI.tweenManager.update();
                _this2.container.filters[0].seed = Math.random();
                _this2.mouse.update(dt);
                // this.container.filters[0].time += .01;
            });
        }
    }]);

    return Game;
}(PIXI.Application);

module.exports = Game;

},{"./managers/ScenesManager":38,"./shaders/clouds":46,"./subjects/Sphere":49,"pixi-filters":25}],34:[function(require,module,exports){
'use strict';

require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
require('pixi-particles');

var Game = require('./game');

WebFont.load({
  google: {
    families: ['Amatic SC']
  },
  active: function active() {
    PIXI.loader.add('blocks', 'assets/blocks.json').add('player', 'assets/player.png').add('bg', 'assets/bg.png').add('displacement', 'assets/displacement.png').add('thlen', 'assets/thlen.png').add('lightmap', 'assets/lightmap.png').add('mask', 'assets/mask.png').add('particle', 'assets/particle.png').add('music', 'assets/music.mp3').load(function (loader, resources) {
      // PIXI.sound.play('music');
      var game = new Game();
      game.scenes.enableScene('playground');

      window.game = game;
    });
  }
});

},{"./game":33,"pixi-particles":26,"pixi-projection":27,"pixi-sound":28,"pixi-tween":29}],35:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HistoryManager = function (_PIXI$Container) {
  _inherits(HistoryManager, _PIXI$Container);

  function HistoryManager(scene) {
    _classCallCheck(this, HistoryManager);

    var _this = _possibleConstructorReturn(this, (HistoryManager.__proto__ || Object.getPrototypeOf(HistoryManager)).call(this));

    _this.game = scene.game;
    _this.scene = scene;

    _this.alpha = 0;
    _this.text = new PIXI.Text('Text', {
      font: 'normal 40px Amatic SC',
      wordWrap: true,
      wordWrapWidth: _this.game.w / 2,
      fill: '#2d5bff',
      padding: 10,
      align: 'center'
    });
    _this.text.anchor.set(.5);
    _this.text.x = _this.game.w / 2;
    _this.text.y = 150;
    _this.addChild(_this.text);
    return _this;
  }

  _createClass(HistoryManager, [{
    key: 'showText',
    value: function showText(txt, time) {
      this.text.fontFamily = 'Amatic SC';
      this.text.setText(txt);

      var show = PIXI.tweenManager.createTween(this);
      show.from({ alpha: 0 }).to({ alpha: 1 });
      show.time = 1000;
      show.start();
      this.emit('showen');

      setTimeout(this.hideText.bind(this), time);
    }
  }, {
    key: 'hideText',
    value: function hideText() {
      var hide = PIXI.tweenManager.createTween(this);
      hide.from({ alpha: 1 }).to({ alpha: 0 });
      hide.time = 1000;
      hide.start();
      this.emit('hidden');
    }
  }]);

  return HistoryManager;
}(PIXI.Container);

module.exports = HistoryManager;

},{}],36:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var LevelManager = function (_PIXI$utils$EventEmit) {
  _inherits(LevelManager, _PIXI$utils$EventEmit);

  function LevelManager(scene, map) {
    _classCallCheck(this, LevelManager);

    var _this = _possibleConstructorReturn(this, (LevelManager.__proto__ || Object.getPrototypeOf(LevelManager)).call(this));

    _this.scene = scene;
    _this.map = map;

    _this.levels = [];
    _this.fragmentsData = {};
    _this.addFragmentsData(require('../content/fragments'));
    _this.addLevels(require('../content/levels'));

    _this.curLevelIndex = 0;
    _this.curFragmentIndex = 0;
    return _this;
  }
  // getters


  _createClass(LevelManager, [{
    key: 'getCurrentLevel',
    value: function getCurrentLevel() {
      return this.levels[this.curLevelIndex];
    }
  }, {
    key: 'getCurrentFragment',
    value: function getCurrentFragment() {
      return this.getCurrentLevel() && this.getCurrentLevel().maps[this.curFragmentIndex];
    }

    // add fragments to db fragments

  }, {
    key: 'addFragmentsData',
    value: function addFragmentsData() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.assign(this.fragmentsData, data);
      this.emit('addedFragmentsData', data);
    }

    // add levels to db levels

  }, {
    key: 'addLevels',
    value: function addLevels() {
      var levels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      for (var i = 0; i < levels.length; i++) {
        this.addLevel(levels[i]);
      }
      this.emit('addedLevels', levels);
    }
  }, {
    key: 'addLevel',
    value: function addLevel() {
      var lvl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.levels.push(lvl);

      // generated maps to lvl object
      lvl.maps = [];
      for (var i = 0; i < lvl.fragments.length; i++) {
        for (var key in lvl.fragments[i]) {
          for (var c = 0; c < lvl.fragments[i][key]; c++) {
            lvl.maps.push(this.fragmentsData[key]);
          }
        }
      }
      this.emit('addedLevel', lvl);
    }

    // Methods for levels control

  }, {
    key: 'switchLevel',
    value: function switchLevel(lvl) {
      if (lvl >= this.levels.length || lvl < 0) return;

      this.curLevelIndex = lvl;
      this.switchFragment(0);

      this.emit('startedLevel');
      this.emit('switchedLevel');
    }
  }, {
    key: 'nextLevel',
    value: function nextLevel() {
      this.switchLevel(this.curLevelIndex + 1);
      this.emit('wentNextLevel');
    }
  }, {
    key: 'backLevel',
    value: function backLevel() {
      this.switchLevel(this.curLevelIndex - 1);
      this.emit('wentBackLevel');
    }

    // Methods for fragments control

  }, {
    key: 'switchFragment',
    value: function switchFragment(frag) {
      if (frag < 0) return;
      this.curFragmentIndex = frag;

      if (this.getCurrentFragment()) this.map.addMap(this.getCurrentFragment());else this.emit('endedLevel');
      this.emit('switchedFragment');
    }
  }, {
    key: 'nextFragment',
    value: function nextFragment() {
      this.switchFragment(this.curFragmentIndex + 1);
      this.emit('wentNextFragment');
    }
  }, {
    key: 'backFragment',
    value: function backFragment() {
      this.switchFragment(this.curFragmentIndex - 1);
      this.emit('wentBackFragment');
    }
  }]);

  return LevelManager;
}(PIXI.utils.EventEmitter);

module.exports = LevelManager;

},{"../content/fragments":31,"../content/levels":32}],37:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Block = require('../subjects/Block');
var DataFragmentConverter = require('../utils/DataFragmentConverter');

var MapManager = function (_PIXI$projection$Cont) {
  _inherits(MapManager, _PIXI$projection$Cont);

  function MapManager(scene) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MapManager);

    var _this = _possibleConstructorReturn(this, (MapManager.__proto__ || Object.getPrototypeOf(MapManager)).call(this));

    scene.addChild(_this);

    _this.scene = scene;
    _this.game = scene.game;

    _this.PADDING_BOTTOM = 280;

    _this.maxAxisX = params.maxX || 5;
    _this.blockSize = params.tileSize || 100;
    _this.setBlocksData(require('../content/blocks'));
    _this.resize();

    _this.isStop = false;

    _this.speed = 500;
    _this.lastIndex = 0;
    return _this;
  }

  _createClass(MapManager, [{
    key: 'resize',
    value: function resize() {
      this.x = this.game.w / 2 - this.maxAxisX * this.blockSize / 2;
      this.y = this.game.h - this.PADDING_BOTTOM;
      this.emit('resized');
    }

    // Set params

  }, {
    key: 'setBlocksData',
    value: function setBlocksData(data) {
      this.BLOCKS = data || {};
    }
  }, {
    key: 'setMaxAxisX',
    value: function setMaxAxisX(max) {
      this.maxAxisX = max || 6;
      this.resize();
    }
  }, {
    key: 'setBlockSize',
    value: function setBlockSize(size) {
      this.blockSize = size || 100;
      this.resize();
    }
  }, {
    key: 'setSpeed',
    value: function setSpeed(speed) {
      this.speed = speed || 500;
    }

    // Map Manager

  }, {
    key: 'addMap',
    value: function addMap(map) {
      for (var i = map.length - 1; i >= 0; i--) {
        this.addFragment(map[i]);
      }
      this.emit('addedMap', map);
      this.computingMapEnd();
    }
  }, {
    key: 'addFragment',
    value: function addFragment(fragData) {
      var frag = new DataFragmentConverter(fragData).fragment;
      // add block to center X axis, for example: round((8-4)/2) => +2 padding to block X pos
      for (var i = 0; i < frag.length; i++) {
        this.addBlock(frag[i], Math.round((this.maxAxisX - frag.length) / 2) + i, this.lastIndex);
      }

      this.lastIndex++;
      this.emit('addedFragment', fragData);
    }
  }, {
    key: 'addBlock',
    value: function addBlock(id, x, y) {
      if (id === '_') return;

      var posX = x * this.blockSize;
      var posY = -y * this.blockSize;
      var block = this.addChild(new Block(this, posX, posY, this.BLOCKS[id]));
      this.emit('addedBlock', block);
    }

    // Collision Widh Block

  }, {
    key: 'getBlockFromPos',
    value: function getBlockFromPos(pos) {
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].containsPoint(pos)) return this.children[i];
      }
    }

    // Moving Map

  }, {
    key: 'scrollDown',
    value: function scrollDown(blocks) {
      var _this2 = this;

      if (this.isStop) return;

      // Scroll map down on X blocks
      var move = PIXI.tweenManager.createTween(this);
      move.from({ y: this.y }).to({ y: this.y + blocks * this.blockSize });
      move.time = this.speed * blocks;
      move.on('end', function () {
        _this2.emit('scrolledDown', blocks);
        _this2.clearOutRangeBlocks();
        _this2.computingMapEnd();
      });
      move.start();
    }
  }, {
    key: 'scrollTop',
    value: function scrollTop(blocks) {
      var _this3 = this;

      if (this.isStop) return;

      // Scroll map top on X blocks
      var move = PIXI.tweenManager.createTween(this);
      move.from({ y: this.y }).to({ y: this.y - blocks * this.blockSize });
      move.time = this.speed * blocks;
      move.on('end', function () {
        _this3.emit('scrolledTop', blocks);
        _this3.clearOutRangeBlocks();
        _this3.computingMapEnd();
      });
      move.start();
    }

    // Computing map end (amt blocks < max amt blocks)

  }, {
    key: 'computingMapEnd',
    value: function computingMapEnd() {
      if (this.children.length < this.maxAxisX * (this.game.h / this.blockSize) * 2) {
        this.emit('endedMap');
      }
    }

    // clear out range map blocks

  }, {
    key: 'clearOutRangeBlocks',
    value: function clearOutRangeBlocks() {
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].worldTransform.ty - this.blockSize / 2 > this.game.h) {
          this.removeChild(this.children[i]);
        }
      }
      this.emit('clearedOutRangeBlocks');
    }
  }]);

  return MapManager;
}(PIXI.projection.Container2d);

module.exports = MapManager;

},{"../content/blocks":30,"../subjects/Block":47,"../utils/DataFragmentConverter":52}],38:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var ScenesManager = function (_PIXI$Container) {
  _inherits(ScenesManager, _PIXI$Container);

  function ScenesManager(game) {
    _classCallCheck(this, ScenesManager);

    var _this = _possibleConstructorReturn(this, (ScenesManager.__proto__ || Object.getPrototypeOf(ScenesManager)).call(this));

    _this.game = game;

    _this.scenes = require('../scenes');
    _this.activeScene = null;
    return _this;
  }

  _createClass(ScenesManager, [{
    key: 'getScene',
    value: function getScene(id) {
      return this.scenes[id];
    }

    // adding scenes

  }, {
    key: 'addScenes',
    value: function addScenes(scenes) {
      for (var id in scenes) {
        this.addScene(id, scenes[id]);
      }
      this.emit('addedScenes', scenes);
    }
  }, {
    key: 'addScene',
    value: function addScene(id, scene) {
      this.scenes[id] = scene;
      this.emit('addedScene', scene);
    }
  }, {
    key: 'removeScene',
    value: function removeScene(id) {
      var _scene = this.scenes[id];
      this.scenes[id] = null;
      this.emit('removedScene', _scene);
    }

    // Controls

  }, {
    key: 'restartScene',
    value: function restartScene() {
      this.enableScene(this.activeScene._idScene);
      this.emit('restartedScene', this.activeScene);
    }
  }, {
    key: 'disableScene',
    value: function disableScene() {
      var scene = this.removeChild(this.activeScene);
      this.activeScene = null;
      this.emit('disabledScene', scene);
    }
  }, {
    key: 'enableScene',
    value: function enableScene(id) {
      this.disableScene();

      var Scene = this.getScene(id);
      this.activeScene = this.addChild(new Scene(this.game, this));
      this.activeScene._idScene = id;

      this.emit('enabledScene', this.activeScene);
    }
  }, {
    key: 'update',
    value: function update(dt) {
      this.activeScene && this.activeScene.update && this.activeScene.update(dt);
      this.emit('updated', dt);
    }
  }]);

  return ScenesManager;
}(PIXI.Container);

module.exports = ScenesManager;

},{"../scenes":41}],39:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScreenManager = function (_PIXI$Container) {
  _inherits(ScreenManager, _PIXI$Container);

  function ScreenManager(scene) {
    _classCallCheck(this, ScreenManager);

    var _this = _possibleConstructorReturn(this, (ScreenManager.__proto__ || Object.getPrototypeOf(ScreenManager)).call(this));

    _this.scene = scene;
    return _this;
  }

  return ScreenManager;
}(PIXI.Container);

module.exports = ScreenManager;

},{}],40:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AlphaGradientFilter = require('../shaders/AlphaGradientFilter');

var MapManager = require('../managers/MapManager');
var LevelManager = require('../managers/LevelManager');
var HistoryManager = require('../managers/HistoryManager');
var ScreenManager = require('../managers/ScreenManager');
var Player = require('../subjects/Player');
var Thlen = require('../subjects/Thlen');

var Playground = function (_PIXI$projection$Cont) {
    _inherits(Playground, _PIXI$projection$Cont);

    function Playground(game) {
        _classCallCheck(this, Playground);

        var _this = _possibleConstructorReturn(this, (Playground.__proto__ || Object.getPrototypeOf(Playground)).call(this));

        _this.game = game;

        // Constant for position object in projection
        _this.interactive = true;

        // Init objects
        _this.projection = new PIXI.projection.Container2d();
        _this.projection.proj.setAxisY({ x: -_this.game.w / 2 + 50, y: 4000 }, -1);
        _this.projection.filters = [new AlphaGradientFilter(.3, .1)];
        _this.addChild(_this.projection);

        _this.map = new MapManager(_this);
        _this.projection.addChild(_this.map);

        _this.levels = new LevelManager(_this, _this.map);

        _this.screen = new ScreenManager(_this);
        _this.history = new HistoryManager(_this);
        _this.player = new Player(_this, _this.map);
        _this.thlen = new Thlen(_this);
        _this.addChild(_this.screen, _this.history, _this.player, _this.thlen);

        // Controls
        _this._bindEvents();
        return _this;
    }

    _createClass(Playground, [{
        key: '_bindEvents',
        value: function _bindEvents() {
            var _this2 = this;

            this.on('pointerdown', function () {
                return _this2.player.immunity();
            });
            this.on('pointermove', function (e) {
                for (var i = 0; i < _this2.map.children.length; i++) {
                    var block = _this2.map.children[i];
                    if (block.containsPoint(e.data.global)) return block.hit();else block.unhit();
                }
            });

            this.player.on('deaded', function () {
                return _this2.restart();
            });
            this.player.on('collision', function (block) {
                if (block.action === 'history') _this2.history.showText(_this2.levels.getCurrentLevel().history.ru, 3000);
            });

            this.history.on('showen', function () {
                var tween = PIXI.tweenManager.createTween(_this2.projection.filters[0]);
                tween.from({ startGradient: .3, endGradient: .1 }).to({ startGradient: .7, endGradient: .5 });
                tween.time = 1000;
                tween.start();

                _this2.map.isStop = true;
            });
            this.history.on('hidden', function () {
                var tween = PIXI.tweenManager.createTween(_this2.projection.filters[0]);
                tween.from({ startGradient: .7, endGradient: .5 }).to({ startGradient: .5, endGradient: .2 });
                tween.time = 1000;
                tween.start();

                _this2.map.isStop = false;
                _this2.map.scrollDown(1);
            });

            this.map.on('endedMap', function () {
                return _this2.levels.nextFragment();
            });
            this.map.on('scrolledDown', function () {
                return _this2.player.moving();
            });

            this.levels.on('endedLevel', function () {
                return _this2.levels.nextLevel();
            });

            this.levels.switchLevel(0);
            this.map.scrollDown(1);
        }
    }, {
        key: 'restart',
        value: function restart() {
            this.game.scenes.restartScene('playground');

            // this.screen.splash(0xFFFFFF, 1000).then(() => {
            //   this.game.scenes.restartScene('playground');
            // });
        }
    }, {
        key: 'update',
        value: function update() {
            this.thlen.update();
        }
    }]);

    return Playground;
}(PIXI.projection.Container2d);

module.exports = Playground;

},{"../managers/HistoryManager":35,"../managers/LevelManager":36,"../managers/MapManager":37,"../managers/ScreenManager":39,"../shaders/AlphaGradientFilter":43,"../subjects/Player":48,"../subjects/Thlen":50}],41:[function(require,module,exports){
'use strict';

module.exports = {
  'playground': require('./Playground')
};

},{"./Playground":40}],42:[function(require,module,exports){
module.exports = function parse(params){
      var template = "precision mediump float; \n" +" \n" +
" \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
" \n" +" \n" +
"uniform vec4 filterArea; \n" +" \n" +
"uniform float startGradient; \n" +" \n" +
"uniform float endGradient; \n" +" \n" +
"uniform sampler2D uSampler; \n" +" \n" +
" \n" +" \n" +
"void main() { \n" +" \n" +
"  vec4 color = texture2D(uSampler, vTextureCoord); \n" +" \n" +
" \n" +" \n" +
"  if(vTextureCoord.y > startGradient) gl_FragColor = color; \n" +" \n" +
"  else if(vTextureCoord.y < endGradient) gl_FragColor = color*0.0; \n" +" \n" +
"  else gl_FragColor = color*(vTextureCoord.y-endGradient)/(startGradient-endGradient); \n" +" \n" +
"} \n" +" \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],43:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var frag = require('./alpha.frag');
var vert = require('../basic.vert');

var AlphaGradientFilter = function (_PIXI$Filter) {
  _inherits(AlphaGradientFilter, _PIXI$Filter);

  function AlphaGradientFilter(startGradient, endGradient) {
    _classCallCheck(this, AlphaGradientFilter);

    var _this = _possibleConstructorReturn(this, (AlphaGradientFilter.__proto__ || Object.getPrototypeOf(AlphaGradientFilter)).call(this, vert(), frag()));

    _this.startGradient = startGradient || .5;
    _this.endGradient = endGradient || .2;
    return _this;
  }

  _createClass(AlphaGradientFilter, [{
    key: 'startGradient',
    set: function set(v) {
      this.uniforms.startGradient = v;
    },
    get: function get() {
      return this.uniforms.startGradient;
    }
  }, {
    key: 'endGradient',
    set: function set(v) {
      this.uniforms.endGradient = v;
    },
    get: function get() {
      return this.uniforms.endGradient;
    }
  }]);

  return AlphaGradientFilter;
}(PIXI.Filter);

module.exports = AlphaGradientFilter;

},{"../basic.vert":44,"./alpha.frag":42}],44:[function(require,module,exports){
module.exports = function parse(params){
      var template = "attribute vec2 aVertexPosition; \n" +" \n" +
"attribute vec2 aTextureCoord; \n" +" \n" +
"uniform mat3 projectionMatrix; \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
" \n" +" \n" +
"void main(void) { \n" +" \n" +
"    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0); \n" +" \n" +
"    vTextureCoord = aTextureCoord; \n" +" \n" +
"} \n" +" \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],45:[function(require,module,exports){
module.exports = function parse(params){
      var template = "precision mediump float; \n" +" \n" +
" \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
"uniform vec4 filterArea; \n" +" \n" +
" \n" +" \n" +
"uniform float time; \n" +" \n" +
"uniform float cloudDensity; 	// overall density [0,1] \n" +" \n" +
"uniform float noisiness; 	// overall strength of the noise effect [0,1] \n" +" \n" +
"uniform float speed;			// controls the animation speed [0, 0.1 ish) \n" +" \n" +
"uniform float cloudHeight; 	// (inverse) height of the input gradient [0,...) \n" +" \n" +
" \n" +" \n" +
" \n" +" \n" +
"// Simplex noise below = ctrl+c, ctrl+v: \n" +" \n" +
"// Description : Array and textureless GLSL 2D/3D/4D simplex \n" +" \n" +
"//               noise functions. \n" +" \n" +
"//      Author : Ian McEwan, Ashima Arts. \n" +" \n" +
"//  Maintainer : ijm \n" +" \n" +
"//     Lastmod : 20110822 (ijm) \n" +" \n" +
"//     License : Copyright (C) 2011 Ashima Arts. All rights reserved. \n" +" \n" +
"//               Distributed under the MIT License. See LICENSE file. \n" +" \n" +
"//               https://github.com/ashima/webgl-noise \n" +" \n" +
"// \n" +" \n" +
" \n" +" \n" +
"vec2 mapCoord(vec2 coord) { \n" +" \n" +
"    coord *= filterArea.xy; \n" +" \n" +
"    coord += filterArea.zw; \n" +" \n" +
" \n" +" \n" +
"    return coord; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
" \n" +" \n" +
"vec3 mod289(vec3 x) { \n" +" \n" +
"  return x - floor(x * (1.0 / 289.0)) * 289.0; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"vec4 mod289(vec4 x) { \n" +" \n" +
"  return x - floor(x * (1.0 / 289.0)) * 289.0; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"vec4 permute(vec4 x) { \n" +" \n" +
"     return mod289(((x*34.0)+1.0)*x); \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"vec4 taylorInvSqrt(vec4 r) \n" +" \n" +
"{ \n" +" \n" +
"  return 1.79284291400159 - 0.85373472095314 * r; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"float snoise(vec3 v) \n" +" \n" +
"  { \n" +" \n" +
"  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ; \n" +" \n" +
"  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0); \n" +" \n" +
" \n" +" \n" +
"// First corner \n" +" \n" +
"  vec3 i  = floor(v + dot(v, C.yyy) ); \n" +" \n" +
"  vec3 x0 =   v - i + dot(i, C.xxx) ; \n" +" \n" +
" \n" +" \n" +
"// Other corners \n" +" \n" +
"  vec3 g = step(x0.yzx, x0.xyz); \n" +" \n" +
"  vec3 l = 1.0 - g; \n" +" \n" +
"  vec3 i1 = min( g.xyz, l.zxy ); \n" +" \n" +
"  vec3 i2 = max( g.xyz, l.zxy ); \n" +" \n" +
" \n" +" \n" +
"  //   x0 = x0 - 0.0 + 0.0 * C.xxx; \n" +" \n" +
"  //   x1 = x0 - i1  + 1.0 * C.xxx; \n" +" \n" +
"  //   x2 = x0 - i2  + 2.0 * C.xxx; \n" +" \n" +
"  //   x3 = x0 - 1.0 + 3.0 * C.xxx; \n" +" \n" +
"  vec3 x1 = x0 - i1 + C.xxx; \n" +" \n" +
"  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y \n" +" \n" +
"  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y \n" +" \n" +
" \n" +" \n" +
"// Permutations \n" +" \n" +
"  i = mod289(i); \n" +" \n" +
"  vec4 p = permute( permute( permute( \n" +" \n" +
"             i.z + vec4(0.0, i1.z, i2.z, 1.0 )) \n" +" \n" +
"           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n" +" \n" +
"           + i.x + vec4(0.0, i1.x, i2.x, 1.0 )); \n" +" \n" +
" \n" +" \n" +
"// Gradients: 7x7 points over a square, mapped onto an octahedron. \n" +" \n" +
"// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294) \n" +" \n" +
"  float n_ = 0.142857142857; // 1.0/7.0 \n" +" \n" +
"  vec3  ns = n_ * D.wyz - D.xzx; \n" +" \n" +
" \n" +" \n" +
"  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7) \n" +" \n" +
" \n" +" \n" +
"  vec4 x_ = floor(j * ns.z); \n" +" \n" +
"  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N) \n" +" \n" +
" \n" +" \n" +
"  vec4 x = x_ *ns.x + ns.yyyy; \n" +" \n" +
"  vec4 y = y_ *ns.x + ns.yyyy; \n" +" \n" +
"  vec4 h = 1.0 - abs(x) - abs(y); \n" +" \n" +
" \n" +" \n" +
"  vec4 b0 = vec4( x.xy, y.xy ); \n" +" \n" +
"  vec4 b1 = vec4( x.zw, y.zw ); \n" +" \n" +
" \n" +" \n" +
"  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0; \n" +" \n" +
"  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0; \n" +" \n" +
"  vec4 s0 = floor(b0)*2.0 + 1.0; \n" +" \n" +
"  vec4 s1 = floor(b1)*2.0 + 1.0; \n" +" \n" +
"  vec4 sh = -step(h, vec4(0.0)); \n" +" \n" +
" \n" +" \n" +
"  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ; \n" +" \n" +
"  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ; \n" +" \n" +
" \n" +" \n" +
"  vec3 p0 = vec3(a0.xy,h.x); \n" +" \n" +
"  vec3 p1 = vec3(a0.zw,h.y); \n" +" \n" +
"  vec3 p2 = vec3(a1.xy,h.z); \n" +" \n" +
"  vec3 p3 = vec3(a1.zw,h.w); \n" +" \n" +
" \n" +" \n" +
"//Normalise gradients \n" +" \n" +
"  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3))); \n" +" \n" +
"  p0 *= norm.x; \n" +" \n" +
"  p1 *= norm.y; \n" +" \n" +
"  p2 *= norm.z; \n" +" \n" +
"  p3 *= norm.w; \n" +" \n" +
" \n" +" \n" +
"// Mix final noise value \n" +" \n" +
"  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); \n" +" \n" +
"  m = m * m; \n" +" \n" +
"  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \n" +" \n" +
"                                dot(p2,x2), dot(p3,x3) ) ); \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"/// Cloud stuff: \n" +" \n" +
"const float maximum = 1.0/1.0 + 1.0/2.0 + 1.0/3.0 + 1.0/4.0 + 1.0/5.0 + 1.0/6.0 + 1.0/7.0 + 1.0/8.0; \n" +" \n" +
"// Fractal Brownian motion, or something that passes for it anyway: range [-1, 1] \n" +" \n" +
"float fBm(vec3 uv) \n" +" \n" +
"{ \n" +" \n" +
"    float sum = 0.0; \n" +" \n" +
"    for (int i = 0; i < 8; ++i) { \n" +" \n" +
"        float f = float(i+1); \n" +" \n" +
"        sum += snoise(uv*f) / f; \n" +" \n" +
"    } \n" +" \n" +
"    return sum / maximum; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"// Simple vertical gradient: \n" +" \n" +
"float gradient(vec2 uv) { \n" +" \n" +
" 	return (1.0 - uv.y * uv.y * cloudHeight); \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"void main() { \n" +" \n" +
"	// vec2 uv = mapCoord(vTextureCoord); \n" +" \n" +
"  // vec3 p = vec3(uv, time*speed); \n" +" \n" +
"  // vec3 someRandomOffset = vec3(0.1, 0.3, 0.2); \n" +" \n" +
"  // vec2 duv = vec2(fBm(p), fBm(p + someRandomOffset)) * noisiness; \n" +" \n" +
"  // float q = gradient(uv + duv) * cloudDensity; \n" +" \n" +
"	gl_FragColor = vec4(.1, .1, .1, 1.0); \n" +" \n" +
"} \n" +" \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],46:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var frag = require('./clouds.frag');
var vert = require('../basic.vert');

var CloudsFilter = function (_PIXI$Filter) {
  _inherits(CloudsFilter, _PIXI$Filter);

  function CloudsFilter(options) {
    _classCallCheck(this, CloudsFilter);

    var _this = _possibleConstructorReturn(this, (CloudsFilter.__proto__ || Object.getPrototypeOf(CloudsFilter)).call(this, vert(), frag()));

    Object.assign(_this, {
      cloudDensity: 0.3,
      noisiness: 0.3,
      speed: 1.0,
      cloudHeight: 0.5
    }, options);
    return _this;
  }

  _createClass(CloudsFilter, [{
    key: 'cloudDensity',
    set: function set(v) {
      this.uniforms.cloudDensity = v;
    },
    get: function get() {
      return this.uniforms.cloudDensity;
    }
  }, {
    key: 'noisiness',
    set: function set(v) {
      this.uniforms.noisiness = v;
    },
    get: function get() {
      return this.uniforms.noisiness;
    }
  }, {
    key: 'speed',
    set: function set(v) {
      this.uniforms.speed = v;
    },
    get: function get() {
      return this.uniforms.speed;
    }
  }, {
    key: 'cloudHeight',
    set: function set(v) {
      this.uniforms.cloudHeight = v;
    },
    get: function get() {
      return this.uniforms.cloudHeight;
    }
  }]);

  return CloudsFilter;
}(PIXI.Filter);

module.exports = CloudsFilter;

},{"../basic.vert":44,"./clouds.frag":45}],47:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Класс Блока, используется для тайлового движка
  События:
    activated
    deactivated
    hited
*/

var Block = function (_PIXI$projection$Spri) {
    _inherits(Block, _PIXI$projection$Spri);

    function Block(map, x, y) {
        var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        _classCallCheck(this, Block);

        var _this = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, PIXI.Texture.fromFrame(params.image || params.activationImage)));

        _this.map = map;
        _this.game = _this.map.game;

        _this.score = params.score;
        _this.activation = params.activation || null;
        _this.deactivationTexture = params.image ? PIXI.Texture.fromFrame(params.image) : null;
        _this.activationTexture = params.activationImage ? PIXI.Texture.fromFrame(params.activationImage) : null;
        _this.isActive = params.active;
        _this.playerDir = params.playerDir || null;
        _this.action = params.action || null;

        _this.anchor.set(.5);
        _this.width = map.blockSize + 1;
        _this.height = map.blockSize + 1;
        _this.x = x + map.blockSize / 2 + .5;
        _this.y = y + map.blockSize / 2 + .5;

        _this.jolting = PIXI.tweenManager.createTween(_this);
        _this.jolting.from({ rotation: -.1 }).to({ rotation: .1 });
        _this.jolting.time = 200;
        _this.jolting.pingPong = true;
        _this.jolting.repeat = Infinity;

        _this.glow = new PIXI.filters.GlowFilter();
        _this.glow.enabled = false;
        _this.filters = [_this.glow];
        return _this;
    }

    _createClass(Block, [{
        key: 'activate',
        value: function activate() {
            var activating = PIXI.tweenManager.createTween(this).from({ width: this.width * 3 / 4, height: this.height * 3 / 4 }).to({ width: this.width, height: this.height, rotation: 0 });
            activating.time = 500;
            activating.easing = PIXI.tween.Easing.outBounce();
            activating.start();

            this.glow.enabled = false;
            this.jolting.stop();
            this.rotation = 0;

            this.isActive = true;
            if (this.activationTexture) this.texture = this.activationTexture;

            this.emit('activated');
        }
    }, {
        key: 'deactivate',
        value: function deactivate() {
            this.isActive = false;
            if (this.deactivationTexture) this.texture = this.deactivationTexture;
            this.emit('deactivated');
        }
    }, {
        key: 'unhit',
        value: function unhit() {
            this.glow.enabled = false;
            this.jolting.stop();
            this.rotation = 0;
        }
    }, {
        key: 'hit',
        value: function hit() {
            if (this.activation === null || this.isActive) return;

            this.jolting.start();
            this.glow.enabled = true;

            if (this.activation) this.activation--;else this.activate();
            this.emit('hited');
        }
    }]);

    return Block;
}(PIXI.projection.Sprite2d);

module.exports = Block;

},{}],48:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Класс Player, взаимодействует с MapManager
  События
    collision => collision block
    moved
    deaded

    actionImmunity
    actionTop
    actionLeft
    actionRight
*/

var Player = function (_PIXI$Sprite) {
    _inherits(Player, _PIXI$Sprite);

    function Player(scene, map) {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, PIXI.Texture.fromImage('player')));

        _this.game = scene.game;
        _this.scene = scene;
        _this.map = map;

        _this.anchor.set(.5, 1);
        _this.scale.set(.7);
        _this.x = _this.game.w / 2 + 5;
        _this.y = _this.game.h - _this.map.blockSize * 2;

        _this.walking = PIXI.tweenManager.createTween(_this);
        _this.walking.from({ y: _this.y }).to({ y: _this.y - 15 });
        _this.walking.time = 800;
        _this.walking.loop = true;
        _this.walking.pingPong = true;
        _this.walking.start();

        _this.lastMove = null;
        _this.speed = _this.map.speed || 500;
        _this.isDead = false;

        _this.IMMUNITY_BLOCKS = 2;
        _this.immunityCount = 5;
        _this.isImmunity = false;
        return _this;
    }

    _createClass(Player, [{
        key: 'moving',
        value: function moving() {
            if (this.isDead || this.isImmunity) return;

            var cur = this.map.getBlockFromPos({ x: this.x, y: this.y });
            if (cur && cur.isActive) {
                this.emit('collision', cur);

                if (cur.playerDir === 'top') return this.top();
                if (cur.playerDir === 'left') return this.left();
                if (cur.playerDir === 'right') return this.right();

                //check top
                var top = this.map.getBlockFromPos({ x: this.x, y: this.y - this.map.blockSize });
                if (top && top.isActive && this.lastMove !== 'bottom') return this.top();

                // check left
                var left = this.map.getBlockFromPos({ x: this.x - this.map.blockSize, y: this.y });
                if (left && left.isActive && this.lastMove !== 'right') return this.left();

                // check rigth
                var right = this.map.getBlockFromPos({ x: this.x + this.map.blockSize, y: this.y });
                if (right && right.isActive && this.lastMove !== 'left') return this.right();

                // or die
                this.top();
            } else this.dead();

            this.emit('moved');
        }
    }, {
        key: 'dead',
        value: function dead() {
            var _this2 = this;

            this.walking.stop();
            this.isDead = true;

            var dead = PIXI.tweenManager.createTween(this.scale);
            dead.from(this.scale).to({ x: 0, y: 0 });
            dead.time = 200;
            dead.start();
            dead.on('end', function () {
                return _this2.emit('deaded');
            });
        }
    }, {
        key: 'immunity',
        value: function immunity() {
            var _this3 = this;

            if (!this.immunityCount) return;

            var immunity = PIXI.tweenManager.createTween(this);
            immunity.from({ alpha: .5 }).to({ alpha: 1 });
            immunity.time = this.speed * this.IMMUNITY_BLOCKS;
            immunity.start();

            this.map.scrollDown(this.IMMUNITY_BLOCKS);
            immunity.on('end', function () {
                return _this3.isImmunity = false;
            });
            this.isImmunity = true;
            this.lastMove = 'top';
            this.immunityCount--;

            this.emit('actionImmunity');
        }
    }, {
        key: 'top',
        value: function top() {
            this.lastMove = 'top';
            this.map.scrollDown(1);

            this.emit('actionTop');
        }
    }, {
        key: 'left',
        value: function left() {
            var _this4 = this;

            this.lastMove = 'left';
            var move = PIXI.tweenManager.createTween(this);
            move.from({ x: this.x }).to({ x: this.x - this.map.blockSize - 20 });
            move.time = this.speed / 2;
            move.start();

            move.on('end', function () {
                return _this4.moving();
            });
            this.emit('actionLeft');
        }
    }, {
        key: 'right',
        value: function right() {
            var _this5 = this;

            this.lastMove = 'right';
            var move = PIXI.tweenManager.createTween(this);
            move.from({ x: this.x }).to({ x: this.x + this.map.blockSize + 20 });
            move.time = this.speed / 2;
            move.start();

            move.on('end', function () {
                return _this5.moving();
            });
            this.emit('actionRight');
        }
    }]);

    return Player;
}(PIXI.Sprite);

module.exports = Player;

},{}],49:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sphere = function (_PIXI$Container) {
  _inherits(Sphere, _PIXI$Container);

  function Sphere(scene) {
    _classCallCheck(this, Sphere);

    var _this = _possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this));

    _this.emitter = new PIXI.particles.Emitter(_this, [PIXI.Texture.fromImage('particle')], require('./emitter.json'));
    return _this;
  }

  _createClass(Sphere, [{
    key: 'update',
    value: function update(dt) {
      this.emitter.update(dt * .01);
      this.emitter.emit = true;
    }
  }]);

  return Sphere;
}(PIXI.Container);

module.exports = Sphere;

},{"./emitter.json":51}],50:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Thlen = function (_PIXI$Container) {
    _inherits(Thlen, _PIXI$Container);

    function Thlen(scene) {
        _classCallCheck(this, Thlen);

        var _this = _possibleConstructorReturn(this, (Thlen.__proto__ || Object.getPrototypeOf(Thlen)).call(this));

        _this.scene = scene;
        _this.game = scene.game;

        _this.PADDIN = 50;

        _this.displacementSprite = new PIXI.Sprite(PIXI.Texture.fromImage('displacement'));
        _this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        scene.addChild(_this.displacementSprite);
        _this.displacementFilter = new PIXI.filters.DisplacementFilter(_this.displacementSprite);

        _this.thlen = new PIXI.Sprite(PIXI.Texture.fromImage('thlen'));
        _this.thlen.width = _this.game.w + _this.PADDIN;
        _this.thlen.y = _this.game.h - _this.thlen.height + _this.PADDIN;
        _this.thlen.x = -_this.PADDIN / 2;
        _this.thlen.filters = [_this.displacementFilter];
        scene.addChild(_this.thlen);
        return _this;
    }

    _createClass(Thlen, [{
        key: 'update',
        value: function update() {
            this.displacementSprite.x += 10;
            this.displacementSprite.y += 10;
        }
    }]);

    return Thlen;
}(PIXI.Container);

module.exports = Thlen;

},{}],51:[function(require,module,exports){
module.exports={
	"alpha": {
		"start": 0.48,
		"end": 0
	},
	"scale": {
		"start": 0.4,
		"end": 0.4
	},
	"color": {
		"start": "#ffffff",
		"end": "#310fff"
	},
	"speed": {
		"start": 90,
		"end": 0,
		"minimumSpeedMultiplier": 1
	},
	"acceleration": {
		"x": 0,
		"y": 0
	},
	"maxSpeed": 0,
	"startRotation": {
		"min": 0,
		"max": 360
	},
	"noRotation": false,
	"rotationSpeed": {
		"min": 0,
		"max": 0
	},
	"lifetime": {
		"min": 0.1,
		"max": 0.3
	},
	"blendMode": "add",
	"frequency": 0.001,
	"emitterLifetime": -1,
	"maxParticles": 500,
	"pos": {
		"x": 0,
		"y": 0
	},
	"addAtBack": true,
	"spawnType": "rect",
	"spawnRect": {
		"x": 0,
		"y": 0,
		"w": 0,
		"h": 0
	}
}

},{}],52:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
This util class for converted data from fragments.json
object to simple map array, for example: ['A', 'A', 'A', 'A']
*/

var DataFragmentConverter = function () {
  function DataFragmentConverter(data) {
    _classCallCheck(this, DataFragmentConverter);

    this.data = data;
    this.inputMap = data.map;
    this.fragment = [];

    // OPERATORS
    for (var i = 0; i < data.map.length; i++) {
      if (~~data.map[i].indexOf('|')) this.caseOperator(data.map[i], i);else this.fragment[i] = data.map[i];
    }

    // METHODS
    data.trim && this.randomTrim(data.trim);
    data.append && this.randomAppend(data.append);
    data.shuffle && this.shuffle();
  }

  // OPERATORS
  // Case operator: 'A|B|C|D' => C and etc...


  _createClass(DataFragmentConverter, [{
    key: 'caseOperator',
    value: function caseOperator(str, i) {
      var ids = str.split('|');
      this.fragment[i] = ids[Math.floor(Math.random() * ids.length)];
      return this;
    }

    // METHODS
    // Trimming array in range 0..rand(min, length)

  }, {
    key: 'randomTrim',
    value: function randomTrim(min) {
      this.fragment.length = Math.floor(Math.random() * (this.fragment.length + 1 - min) + min);
      return this;
    }
    // Shuffle array [1,2,3] => [2,1,3] and etc...

  }, {
    key: 'shuffle',
    value: function shuffle() {
      this.fragment.sort(function (a, b) {
        return Math.random() < .5 ? -1 : 1;
      });
      return this;
    }
    // Adds a block to the random location of the array: [A,A,A] => [B,A,A] and etc...

  }, {
    key: 'randomAppend',
    value: function randomAppend(id) {
      this.fragment[Math.floor(Math.random() * this.fragment.length)] = id;
      return this;
    }
  }]);

  return DataFragmentConverter;
}();

module.exports = DataFragmentConverter;

},{}]},{},[34])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWFkdmFuY2VkLWJsb29tL2xpYi9maWx0ZXItYWR2YW5jZWQtYmxvb20uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWFzY2lpL2xpYi9maWx0ZXItYXNjaWkuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWJsb29tL2xpYi9maWx0ZXItYmxvb20uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWJ1bGdlLXBpbmNoL2xpYi9maWx0ZXItYnVsZ2UtcGluY2guanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWNvbG9yLXJlcGxhY2UvbGliL2ZpbHRlci1jb2xvci1yZXBsYWNlLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1jb252b2x1dGlvbi9saWIvZmlsdGVyLWNvbnZvbHV0aW9uLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1jcm9zcy1oYXRjaC9saWIvZmlsdGVyLWNyb3NzLWhhdGNoLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1kb3QvbGliL2ZpbHRlci1kb3QuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93L2xpYi9maWx0ZXItZHJvcC1zaGFkb3cuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWVtYm9zcy9saWIvZmlsdGVyLWVtYm9zcy5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZ2xvdy9saWIvZmlsdGVyLWdsb3cuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWdvZHJheS9saWIvZmlsdGVyLWdvZHJheS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItbW90aW9uLWJsdXIvbGliL2ZpbHRlci1tb3Rpb24tYmx1ci5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZS9saWIvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLW9sZC1maWxtL2xpYi9maWx0ZXItb2xkLWZpbG0uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLW91dGxpbmUvbGliL2ZpbHRlci1vdXRsaW5lLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1waXhlbGF0ZS9saWIvZmlsdGVyLXBpeGVsYXRlLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1yYWRpYWwtYmx1ci9saWIvZmlsdGVyLXJhZGlhbC1ibHVyLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1yZ2Itc3BsaXQvbGliL2ZpbHRlci1yZ2Itc3BsaXQuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLXNob2Nrd2F2ZS9saWIvZmlsdGVyLXNob2Nrd2F2ZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwL2xpYi9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci10aWx0LXNoaWZ0L2xpYi9maWx0ZXItdGlsdC1zaGlmdC5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItdHdpc3QvbGliL2ZpbHRlci10d2lzdC5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItem9vbS1ibHVyL2xpYi9maWx0ZXItem9vbS1ibHVyLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktZmlsdGVycy9saWIvcGl4aS1maWx0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktcGFydGljbGVzL2Rpc3QvcGl4aS1wYXJ0aWNsZXMubWluLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktcHJvamVjdGlvbi9kaXN0L3BpeGktcHJvamVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9waXhpLXNvdW5kL2Rpc3QvcGl4aS1zb3VuZC5qcyIsIm5vZGVfbW9kdWxlcy9waXhpLXR3ZWVuL2J1aWxkL3BpeGktdHdlZW4uanMiLCJzcmMvY29udGVudC9ibG9ja3MuanNvbiIsInNyYy9jb250ZW50L2ZyYWdtZW50cy5qc29uIiwic3JjL2NvbnRlbnQvbGV2ZWxzLmpzb24iLCJzcmNcXGdhbWUuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFxtYW5hZ2Vyc1xcSGlzdG9yeU1hbmFnZXIuanMiLCJzcmNcXG1hbmFnZXJzXFxMZXZlbE1hbmFnZXIuanMiLCJzcmNcXG1hbmFnZXJzXFxNYXBNYW5hZ2VyLmpzIiwic3JjXFxtYW5hZ2Vyc1xcU2NlbmVzTWFuYWdlci5qcyIsInNyY1xcbWFuYWdlcnNcXFNjcmVlbk1hbmFnZXIuanMiLCJzcmNcXHNjZW5lc1xcUGxheWdyb3VuZC5qcyIsInNyY1xcc2NlbmVzXFxpbmRleC5qcyIsInNyYy9zaGFkZXJzL0FscGhhR3JhZGllbnRGaWx0ZXIvYWxwaGEuZnJhZyIsInNyY1xcc2hhZGVyc1xcQWxwaGFHcmFkaWVudEZpbHRlclxcaW5kZXguanMiLCJzcmMvc2hhZGVycy9iYXNpYy52ZXJ0Iiwic3JjL3NoYWRlcnMvY2xvdWRzL2Nsb3Vkcy5mcmFnIiwic3JjXFxzaGFkZXJzXFxjbG91ZHNcXGluZGV4LmpzIiwic3JjXFxzdWJqZWN0c1xcQmxvY2suanMiLCJzcmNcXHN1YmplY3RzXFxQbGF5ZXIuanMiLCJzcmNcXHN1YmplY3RzXFxTcGhlcmUuanMiLCJzcmNcXHN1YmplY3RzXFxUaGxlbi5qcyIsInNyYy9zdWJqZWN0cy9lbWl0dGVyLmpzb24iLCJzcmNcXHV0aWxzXFxEYXRhRnJhZ21lbnRDb252ZXJ0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdG5FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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TCxDQUFjLElBQWQsQ0FBbUIsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLGVBQVUsS0FBSyxNQUFMLEtBQWdCLEVBQWhCLEdBQXFCLENBQUMsQ0FBdEIsR0FBMEIsQ0FBcEM7QUFBQSxPQUFuQjtBQUNBLGFBQU8sSUFBUDtBQUNEO0FBQ0Q7Ozs7aUNBQ2EsRSxFQUFJO0FBQ2YsV0FBSyxRQUFMLENBQWMsS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWMsS0FBSyxRQUFMLENBQWMsTUFBdkMsQ0FBZCxJQUFnRSxFQUFoRTtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7QUFHSCxPQUFPLE9BQVAsR0FBaUIscUJBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWFkdmFuY2VkLWJsb29tIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1hZHZhbmNlZC1ibG9vbSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHIpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3IoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHIpOnIoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwiXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBmbG9hdCB0aHJlc2hvbGQ7XFxuXFxudm9pZCBtYWluKCkge1xcbiAgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgLy8gQSBzaW1wbGUgJiBmYXN0IGFsZ29yaXRobSBmb3IgZ2V0dGluZyBicmlnaHRuZXNzLlxcbiAgICAvLyBJdCdzIGluYWNjdXJhY3kgLCBidXQgZ29vZCBlbm91Z2h0IGZvciB0aGlzIGZlYXR1cmUuXFxuICAgIGZsb2F0IF9tYXggPSBtYXgobWF4KGNvbG9yLnIsIGNvbG9yLmcpLCBjb2xvci5iKTtcXG4gICAgZmxvYXQgX21pbiA9IG1pbihtaW4oY29sb3IuciwgY29sb3IuZyksIGNvbG9yLmIpO1xcbiAgICBmbG9hdCBicmlnaHRuZXNzID0gKF9tYXggKyBfbWluKSAqIDAuNTtcXG5cXG4gICAgaWYoYnJpZ2h0bmVzcyA+IHRocmVzaG9sZCkge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gY29sb3I7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDAuMCk7XFxuICAgIH1cXG59XFxuXCIsbz1mdW5jdGlvbihlKXtmdW5jdGlvbiBvKG8pe3ZvaWQgMD09PW8mJihvPS41KSxlLmNhbGwodGhpcyxyLHQpLHRoaXMudGhyZXNob2xkPW99ZSYmKG8uX19wcm90b19fPWUpLChvLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bzt2YXIgbj17dGhyZXNob2xkOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi50aHJlc2hvbGQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudGhyZXNob2xkfSxuLnRocmVzaG9sZC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy50aHJlc2hvbGQ9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoby5wcm90b3R5cGUsbiksb30oUElYSS5GaWx0ZXIpLG49XCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCBibG9vbVRleHR1cmU7XFxudW5pZm9ybSBmbG9hdCBibG9vbVNjYWxlO1xcbnVuaWZvcm0gZmxvYXQgYnJpZ2h0bmVzcztcXG5cXG52b2lkIG1haW4oKSB7XFxuICAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICBjb2xvci5yZ2IgKj0gYnJpZ2h0bmVzcztcXG4gICAgdmVjNCBibG9vbUNvbG9yID0gdmVjNCh0ZXh0dXJlMkQoYmxvb21UZXh0dXJlLCB2VGV4dHVyZUNvb3JkKS5yZ2IsIDAuMCk7XFxuICAgIGJsb29tQ29sb3IucmdiICo9IGJsb29tU2NhbGU7XFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yICsgYmxvb21Db2xvcjtcXG59XFxuXCIsaT1mdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQpe2UuY2FsbCh0aGlzLHIsbiksXCJudW1iZXJcIj09dHlwZW9mIHQmJih0PXt0aHJlc2hvbGQ6dH0pLHQ9T2JqZWN0LmFzc2lnbih7dGhyZXNob2xkOi41LGJsb29tU2NhbGU6MSxicmlnaHRuZXNzOjEsYmx1cjo4LHF1YWxpdHk6NCxyZXNvbHV0aW9uOlBJWEkuc2V0dGluZ3MuUkVTT0xVVElPTixrZXJuZWxTaXplOjV9LHQpLHRoaXMuYmxvb21TY2FsZT10LmJsb29tU2NhbGUsdGhpcy5icmlnaHRuZXNzPXQuYnJpZ2h0bmVzczt2YXIgaT10LmJsdXIsbD10LnF1YWxpdHkscz10LnJlc29sdXRpb24sdT10Lmtlcm5lbFNpemUsYT1QSVhJLmZpbHRlcnMsYz1hLkJsdXJYRmlsdGVyLGg9YS5CbHVyWUZpbHRlcjt0aGlzLl9leHRyYWN0PW5ldyBvKHQudGhyZXNob2xkKSx0aGlzLl9ibHVyWD1uZXcgYyhpLGwscyx1KSx0aGlzLl9ibHVyWT1uZXcgaChpLGwscyx1KX1lJiYodC5fX3Byb3RvX189ZSksKHQucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj10O3ZhciBpPXt0aHJlc2hvbGQ6e2NvbmZpZ3VyYWJsZTohMH0sYmx1cjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUscix0LG8sbil7dmFyIGk9ZS5nZXRSZW5kZXJUYXJnZXQoITApO3RoaXMuX2V4dHJhY3QuYXBwbHkoZSxyLGksITAsbiksdGhpcy5fYmx1clguYXBwbHkoZSxpLGksITAsbiksdGhpcy5fYmx1clkuYXBwbHkoZSxpLGksITAsbiksdGhpcy51bmlmb3Jtcy5ibG9vbVNjYWxlPXRoaXMuYmxvb21TY2FsZSx0aGlzLnVuaWZvcm1zLmJyaWdodG5lc3M9dGhpcy5icmlnaHRuZXNzLHRoaXMudW5pZm9ybXMuYmxvb21UZXh0dXJlPWksZS5hcHBseUZpbHRlcih0aGlzLHIsdCxvKSxlLnJldHVyblJlbmRlclRhcmdldChpKX0saS50aHJlc2hvbGQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2V4dHJhY3QudGhyZXNob2xkfSxpLnRocmVzaG9sZC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5fZXh0cmFjdC50aHJlc2hvbGQ9ZX0saS5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9ibHVyWC5ibHVyfSxpLmJsdXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2JsdXJYLmJsdXI9dGhpcy5fYmx1clkuYmx1cj1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LnByb3RvdHlwZSxpKSx0fShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkFkdmFuY2VkQmxvb21GaWx0ZXI9aSxlLkFkdmFuY2VkQmxvb21GaWx0ZXI9aSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWFkdmFuY2VkLWJsb29tLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItYXNjaWkgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWFzY2lpIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLG89XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIGZsb2F0IHBpeGVsU2l6ZTtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG52ZWMyIG1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkICo9IGZpbHRlckFyZWEueHk7XFxuICAgIGNvb3JkICs9IGZpbHRlckFyZWEuenc7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB1bm1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkIC09IGZpbHRlckFyZWEuenc7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiBwaXhlbGF0ZSh2ZWMyIGNvb3JkLCB2ZWMyIHNpemUpXFxue1xcbiAgICByZXR1cm4gZmxvb3IoIGNvb3JkIC8gc2l6ZSApICogc2l6ZTtcXG59XFxuXFxudmVjMiBnZXRNb2QodmVjMiBjb29yZCwgdmVjMiBzaXplKVxcbntcXG4gICAgcmV0dXJuIG1vZCggY29vcmQgLCBzaXplKSAvIHNpemU7XFxufVxcblxcbmZsb2F0IGNoYXJhY3RlcihmbG9hdCBuLCB2ZWMyIHApXFxue1xcbiAgICBwID0gZmxvb3IocCp2ZWMyKDQuMCwgLTQuMCkgKyAyLjUpO1xcbiAgICBpZiAoY2xhbXAocC54LCAwLjAsIDQuMCkgPT0gcC54ICYmIGNsYW1wKHAueSwgMC4wLCA0LjApID09IHAueSlcXG4gICAge1xcbiAgICAgICAgaWYgKGludChtb2Qobi9leHAyKHAueCArIDUuMCpwLnkpLCAyLjApKSA9PSAxKSByZXR1cm4gMS4wO1xcbiAgICB9XFxuICAgIHJldHVybiAwLjA7XFxufVxcblxcbnZvaWQgbWFpbigpXFxue1xcbiAgICB2ZWMyIGNvb3JkID0gbWFwQ29vcmQodlRleHR1cmVDb29yZCk7XFxuXFxuICAgIC8vIGdldCB0aGUgcm91bmRlZCBjb2xvci4uXFxuICAgIHZlYzIgcGl4Q29vcmQgPSBwaXhlbGF0ZShjb29yZCwgdmVjMihwaXhlbFNpemUpKTtcXG4gICAgcGl4Q29vcmQgPSB1bm1hcENvb3JkKHBpeENvb3JkKTtcXG5cXG4gICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgcGl4Q29vcmQpO1xcblxcbiAgICAvLyBkZXRlcm1pbmUgdGhlIGNoYXJhY3RlciB0byB1c2VcXG4gICAgZmxvYXQgZ3JheSA9IChjb2xvci5yICsgY29sb3IuZyArIGNvbG9yLmIpIC8gMy4wO1xcblxcbiAgICBmbG9hdCBuID0gIDY1NTM2LjA7ICAgICAgICAgICAgIC8vIC5cXG4gICAgaWYgKGdyYXkgPiAwLjIpIG4gPSA2NTYwMC4wOyAgICAvLyA6XFxuICAgIGlmIChncmF5ID4gMC4zKSBuID0gMzMyNzcyLjA7ICAgLy8gKlxcbiAgICBpZiAoZ3JheSA+IDAuNCkgbiA9IDE1MjU1MDg2LjA7IC8vIG9cXG4gICAgaWYgKGdyYXkgPiAwLjUpIG4gPSAyMzM4NTE2NC4wOyAvLyAmXFxuICAgIGlmIChncmF5ID4gMC42KSBuID0gMTUyNTIwMTQuMDsgLy8gOFxcbiAgICBpZiAoZ3JheSA+IDAuNykgbiA9IDEzMTk5NDUyLjA7IC8vIEBcXG4gICAgaWYgKGdyYXkgPiAwLjgpIG4gPSAxMTUxMjgxMC4wOyAvLyAjXFxuXFxuICAgIC8vIGdldCB0aGUgbW9kLi5cXG4gICAgdmVjMiBtb2RkID0gZ2V0TW9kKGNvb3JkLCB2ZWMyKHBpeGVsU2l6ZSkpO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBjb2xvciAqIGNoYXJhY3RlciggbiwgdmVjMigtMS4wKSArIG1vZGQgKiAyLjApO1xcblxcbn1cIixyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHIocil7dm9pZCAwPT09ciYmKHI9OCksZS5jYWxsKHRoaXMsbixvKSx0aGlzLnNpemU9cn1lJiYoci5fX3Byb3RvX189ZSksKHIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1yO3ZhciBpPXtzaXplOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5zaXplLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnBpeGVsU2l6ZX0saS5zaXplLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnBpeGVsU2l6ZT1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxpKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkFzY2lpRmlsdGVyPXIsZS5Bc2NpaUZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItYXNjaWkuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1ibG9vbSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItYmxvb20gaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24odCxyKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9yKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxyKTpyKHQuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9UElYSS5maWx0ZXJzLGU9ci5CbHVyWEZpbHRlcixpPXIuQmx1cllGaWx0ZXIsbD1yLkFscGhhRmlsdGVyLHU9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gcihyLHUsbixvKXt2b2lkIDA9PT1yJiYocj0yKSx2b2lkIDA9PT11JiYodT00KSx2b2lkIDA9PT1uJiYobj1QSVhJLnNldHRpbmdzLlJFU09MVVRJT04pLHZvaWQgMD09PW8mJihvPTUpLHQuY2FsbCh0aGlzKTt2YXIgYixzO1wibnVtYmVyXCI9PXR5cGVvZiByPyhiPXIscz1yKTpyIGluc3RhbmNlb2YgUElYSS5Qb2ludD8oYj1yLngscz1yLnkpOkFycmF5LmlzQXJyYXkocikmJihiPXJbMF0scz1yWzFdKSx0aGlzLmJsdXJYRmlsdGVyPW5ldyBlKGIsdSxuLG8pLHRoaXMuYmx1cllGaWx0ZXI9bmV3IGkocyx1LG4sbyksdGhpcy5ibHVyWUZpbHRlci5ibGVuZE1vZGU9UElYSS5CTEVORF9NT0RFUy5TQ1JFRU4sdGhpcy5kZWZhdWx0RmlsdGVyPW5ldyBsfXQmJihyLl9fcHJvdG9fXz10KSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIHU9e2JsdXI6e2NvbmZpZ3VyYWJsZTohMH0sYmx1clg6e2NvbmZpZ3VyYWJsZTohMH0sYmx1clk6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbih0LHIsZSl7dmFyIGk9dC5nZXRSZW5kZXJUYXJnZXQoITApO3RoaXMuZGVmYXVsdEZpbHRlci5hcHBseSh0LHIsZSksdGhpcy5ibHVyWEZpbHRlci5hcHBseSh0LHIsaSksdGhpcy5ibHVyWUZpbHRlci5hcHBseSh0LGksZSksdC5yZXR1cm5SZW5kZXJUYXJnZXQoaSl9LHUuYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyWEZpbHRlci5ibHVyfSx1LmJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1clhGaWx0ZXIuYmx1cj10aGlzLmJsdXJZRmlsdGVyLmJsdXI9dH0sdS5ibHVyWC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyWEZpbHRlci5ibHVyfSx1LmJsdXJYLnNldD1mdW5jdGlvbih0KXt0aGlzLmJsdXJYRmlsdGVyLmJsdXI9dH0sdS5ibHVyWS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyWUZpbHRlci5ibHVyfSx1LmJsdXJZLnNldD1mdW5jdGlvbih0KXt0aGlzLmJsdXJZRmlsdGVyLmJsdXI9dH0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsdSkscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5CbG9vbUZpbHRlcj11LHQuQmxvb21GaWx0ZXI9dSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWJsb29tLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItYnVsZ2UtcGluY2ggLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWJ1bGdlLXBpbmNoIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ1bmlmb3JtIGZsb2F0IHJhZGl1cztcXG51bmlmb3JtIGZsb2F0IHN0cmVuZ3RoO1xcbnVuaWZvcm0gdmVjMiBjZW50ZXI7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckNsYW1wO1xcbnVuaWZvcm0gdmVjMiBkaW1lbnNpb25zO1xcblxcbnZvaWQgbWFpbigpXFxue1xcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHk7XFxuICAgIGNvb3JkIC09IGNlbnRlciAqIGRpbWVuc2lvbnMueHk7XFxuICAgIGZsb2F0IGRpc3RhbmNlID0gbGVuZ3RoKGNvb3JkKTtcXG4gICAgaWYgKGRpc3RhbmNlIDwgcmFkaXVzKSB7XFxuICAgICAgICBmbG9hdCBwZXJjZW50ID0gZGlzdGFuY2UgLyByYWRpdXM7XFxuICAgICAgICBpZiAoc3RyZW5ndGggPiAwLjApIHtcXG4gICAgICAgICAgICBjb29yZCAqPSBtaXgoMS4wLCBzbW9vdGhzdGVwKDAuMCwgcmFkaXVzIC8gZGlzdGFuY2UsIHBlcmNlbnQpLCBzdHJlbmd0aCAqIDAuNzUpO1xcbiAgICAgICAgfSBlbHNlIHtcXG4gICAgICAgICAgICBjb29yZCAqPSBtaXgoMS4wLCBwb3cocGVyY2VudCwgMS4wICsgc3RyZW5ndGggKiAwLjc1KSAqIHJhZGl1cyAvIGRpc3RhbmNlLCAxLjAgLSBwZXJjZW50KTtcXG4gICAgICAgIH1cXG4gICAgfVxcbiAgICBjb29yZCArPSBjZW50ZXIgKiBkaW1lbnNpb25zLnh5O1xcbiAgICBjb29yZCAvPSBmaWx0ZXJBcmVhLnh5O1xcbiAgICB2ZWMyIGNsYW1wZWRDb29yZCA9IGNsYW1wKGNvb3JkLCBmaWx0ZXJDbGFtcC54eSwgZmlsdGVyQ2xhbXAuencpO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wZWRDb29yZCk7XFxuICAgIGlmIChjb29yZCAhPSBjbGFtcGVkQ29vcmQpIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciAqPSBtYXgoMC4wLCAxLjAgLSBsZW5ndGgoY29vcmQgLSBjbGFtcGVkQ29vcmQpKTtcXG4gICAgfVxcbn1cXG5cIixyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHIocixvLGkpe2UuY2FsbCh0aGlzLG4sdCksdGhpcy5jZW50ZXI9cnx8Wy41LC41XSx0aGlzLnJhZGl1cz1vfHwxMDAsdGhpcy5zdHJlbmd0aD1pfHwxfWUmJihyLl9fcHJvdG9fXz1lKSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIG89e3JhZGl1czp7Y29uZmlndXJhYmxlOiEwfSxzdHJlbmd0aDp7Y29uZmlndXJhYmxlOiEwfSxjZW50ZXI6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLG4sdCxyKXt0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMF09bi5zb3VyY2VGcmFtZS53aWR0aCx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMV09bi5zb3VyY2VGcmFtZS5oZWlnaHQsZS5hcHBseUZpbHRlcih0aGlzLG4sdCxyKX0sby5yYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucmFkaXVzfSxvLnJhZGl1cy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5yYWRpdXM9ZX0sby5zdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zdHJlbmd0aH0sby5zdHJlbmd0aC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zdHJlbmd0aD1lfSxvLmNlbnRlci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5jZW50ZXJ9LG8uY2VudGVyLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmNlbnRlcj1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxvKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkJ1bGdlUGluY2hGaWx0ZXI9cixlLkJ1bGdlUGluY2hGaWx0ZXI9cixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWJ1bGdlLXBpbmNoLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItY29sb3ItcmVwbGFjZSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItY29sb3ItcmVwbGFjZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihvLGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUoby5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihvKXtcInVzZSBzdHJpY3RcIjt2YXIgZT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTtcXG51bmlmb3JtIHZlYzMgb3JpZ2luYWxDb2xvcjtcXG51bmlmb3JtIHZlYzMgbmV3Q29sb3I7XFxudW5pZm9ybSBmbG9hdCBlcHNpbG9uO1xcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIHZlYzQgY3VycmVudENvbG9yID0gdGV4dHVyZTJEKHRleHR1cmUsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWMzIGNvbG9yRGlmZiA9IG9yaWdpbmFsQ29sb3IgLSAoY3VycmVudENvbG9yLnJnYiAvIG1heChjdXJyZW50Q29sb3IuYSwgMC4wMDAwMDAwMDAxKSk7XFxuICAgIGZsb2F0IGNvbG9yRGlzdGFuY2UgPSBsZW5ndGgoY29sb3JEaWZmKTtcXG4gICAgZmxvYXQgZG9SZXBsYWNlID0gc3RlcChjb2xvckRpc3RhbmNlLCBlcHNpbG9uKTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChtaXgoY3VycmVudENvbG9yLnJnYiwgKG5ld0NvbG9yICsgY29sb3JEaWZmKSAqIGN1cnJlbnRDb2xvci5hLCBkb1JlcGxhY2UpLCBjdXJyZW50Q29sb3IuYSk7XFxufVxcblwiLG49ZnVuY3Rpb24obyl7ZnVuY3Rpb24gbihuLGksdCl7dm9pZCAwPT09biYmKG49MTY3MTE2ODApLHZvaWQgMD09PWkmJihpPTApLHZvaWQgMD09PXQmJih0PS40KSxvLmNhbGwodGhpcyxlLHIpLHRoaXMub3JpZ2luYWxDb2xvcj1uLHRoaXMubmV3Q29sb3I9aSx0aGlzLmVwc2lsb249dH1vJiYobi5fX3Byb3RvX189byksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobyYmby5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciBpPXtvcmlnaW5hbENvbG9yOntjb25maWd1cmFibGU6ITB9LG5ld0NvbG9yOntjb25maWd1cmFibGU6ITB9LGVwc2lsb246e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLm9yaWdpbmFsQ29sb3Iuc2V0PWZ1bmN0aW9uKG8pe3ZhciBlPXRoaXMudW5pZm9ybXMub3JpZ2luYWxDb2xvcjtcIm51bWJlclwiPT10eXBlb2Ygbz8oUElYSS51dGlscy5oZXgycmdiKG8sZSksdGhpcy5fb3JpZ2luYWxDb2xvcj1vKTooZVswXT1vWzBdLGVbMV09b1sxXSxlWzJdPW9bMl0sdGhpcy5fb3JpZ2luYWxDb2xvcj1QSVhJLnV0aWxzLnJnYjJoZXgoZSkpfSxpLm9yaWdpbmFsQ29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX29yaWdpbmFsQ29sb3J9LGkubmV3Q29sb3Iuc2V0PWZ1bmN0aW9uKG8pe3ZhciBlPXRoaXMudW5pZm9ybXMubmV3Q29sb3I7XCJudW1iZXJcIj09dHlwZW9mIG8/KFBJWEkudXRpbHMuaGV4MnJnYihvLGUpLHRoaXMuX25ld0NvbG9yPW8pOihlWzBdPW9bMF0sZVsxXT1vWzFdLGVbMl09b1syXSx0aGlzLl9uZXdDb2xvcj1QSVhJLnV0aWxzLnJnYjJoZXgoZSkpfSxpLm5ld0NvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9uZXdDb2xvcn0saS5lcHNpbG9uLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLmVwc2lsb249b30saS5lcHNpbG9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmVwc2lsb259LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLGkpLG59KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQ29sb3JSZXBsYWNlRmlsdGVyPW4sby5Db2xvclJlcGxhY2VGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWNvbG9yLXJlcGxhY2UuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1jb252b2x1dGlvbiAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItY29udm9sdXRpb24gaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWMyIHRleGVsU2l6ZTtcXG51bmlmb3JtIGZsb2F0IG1hdHJpeFs5XTtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgdmVjNCBjMTEgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgLSB0ZXhlbFNpemUpOyAvLyB0b3AgbGVmdFxcbiAgIHZlYzQgYzEyID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55IC0gdGV4ZWxTaXplLnkpKTsgLy8gdG9wIGNlbnRlclxcbiAgIHZlYzQgYzEzID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCArIHRleGVsU2l6ZS54LCB2VGV4dHVyZUNvb3JkLnkgLSB0ZXhlbFNpemUueSkpOyAvLyB0b3AgcmlnaHRcXG5cXG4gICB2ZWM0IGMyMSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSB0ZXhlbFNpemUueCwgdlRleHR1cmVDb29yZC55KSk7IC8vIG1pZCBsZWZ0XFxuICAgdmVjNCBjMjIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpOyAvLyBtaWQgY2VudGVyXFxuICAgdmVjNCBjMjMgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54ICsgdGV4ZWxTaXplLngsIHZUZXh0dXJlQ29vcmQueSkpOyAvLyBtaWQgcmlnaHRcXG5cXG4gICB2ZWM0IGMzMSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggLSB0ZXhlbFNpemUueCwgdlRleHR1cmVDb29yZC55ICsgdGV4ZWxTaXplLnkpKTsgLy8gYm90dG9tIGxlZnRcXG4gICB2ZWM0IGMzMiA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLngsIHZUZXh0dXJlQ29vcmQueSArIHRleGVsU2l6ZS55KSk7IC8vIGJvdHRvbSBjZW50ZXJcXG4gICB2ZWM0IGMzMyA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIHRleGVsU2l6ZSk7IC8vIGJvdHRvbSByaWdodFxcblxcbiAgIGdsX0ZyYWdDb2xvciA9XFxuICAgICAgIGMxMSAqIG1hdHJpeFswXSArIGMxMiAqIG1hdHJpeFsxXSArIGMxMyAqIG1hdHJpeFsyXSArXFxuICAgICAgIGMyMSAqIG1hdHJpeFszXSArIGMyMiAqIG1hdHJpeFs0XSArIGMyMyAqIG1hdHJpeFs1XSArXFxuICAgICAgIGMzMSAqIG1hdHJpeFs2XSArIGMzMiAqIG1hdHJpeFs3XSArIGMzMyAqIG1hdHJpeFs4XTtcXG5cXG4gICBnbF9GcmFnQ29sb3IuYSA9IGMyMi5hO1xcbn1cXG5cIixvPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG8obyxpLG4pe2UuY2FsbCh0aGlzLHQsciksdGhpcy5tYXRyaXg9byx0aGlzLndpZHRoPWksdGhpcy5oZWlnaHQ9bn1lJiYoby5fX3Byb3RvX189ZSksKG8ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1vO3ZhciBpPXttYXRyaXg6e2NvbmZpZ3VyYWJsZTohMH0sd2lkdGg6e2NvbmZpZ3VyYWJsZTohMH0saGVpZ2h0Ontjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5tYXRyaXguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMubWF0cml4fSxpLm1hdHJpeC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5tYXRyaXg9bmV3IEZsb2F0MzJBcnJheShlKX0saS53aWR0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gMS90aGlzLnVuaWZvcm1zLnRleGVsU2l6ZVswXX0saS53aWR0aC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy50ZXhlbFNpemVbMF09MS9lfSxpLmhlaWdodC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gMS90aGlzLnVuaWZvcm1zLnRleGVsU2l6ZVsxXX0saS5oZWlnaHQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudGV4ZWxTaXplWzFdPTEvZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoby5wcm90b3R5cGUsaSksb30oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Db252b2x1dGlvbkZpbHRlcj1vLGUuQ29udm9sdXRpb25GaWx0ZXI9byxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWNvbnZvbHV0aW9uLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItY3Jvc3MtaGF0Y2ggLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWNyb3NzLWhhdGNoIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG8sbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihvLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG8pe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGZsb2F0IGx1bSA9IGxlbmd0aCh0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQueHkpLnJnYik7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMS4wLCAxLjAsIDEuMCwgMS4wKTtcXG5cXG4gICAgaWYgKGx1bSA8IDEuMDApXFxuICAgIHtcXG4gICAgICAgIGlmIChtb2QoZ2xfRnJhZ0Nvb3JkLnggKyBnbF9GcmFnQ29vcmQueSwgMTAuMCkgPT0gMC4wKVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBpZiAobHVtIDwgMC43NSlcXG4gICAge1xcbiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCAtIGdsX0ZyYWdDb29yZC55LCAxMC4wKSA9PSAwLjApXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAxLjApO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIGlmIChsdW0gPCAwLjUwKVxcbiAgICB7XFxuICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54ICsgZ2xfRnJhZ0Nvb3JkLnkgLSA1LjAsIDEwLjApID09IDAuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgaWYgKGx1bSA8IDAuMylcXG4gICAge1xcbiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCAtIGdsX0ZyYWdDb29yZC55IC0gNS4wLCAxMC4wKSA9PSAwLjApXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAxLjApO1xcbiAgICAgICAgfVxcbiAgICB9XFxufVxcblwiLGU9ZnVuY3Rpb24obyl7ZnVuY3Rpb24gZSgpe28uY2FsbCh0aGlzLG4scil9cmV0dXJuIG8mJihlLl9fcHJvdG9fXz1vKSxlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG8mJm8ucHJvdG90eXBlKSxlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1lLGV9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQ3Jvc3NIYXRjaEZpbHRlcj1lLG8uQ3Jvc3NIYXRjaEZpbHRlcj1lLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItY3Jvc3MtaGF0Y2guanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1kb3QgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWRvdCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP24oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG4pOm4oZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIGZsb2F0IGFuZ2xlO1xcbnVuaWZvcm0gZmxvYXQgc2NhbGU7XFxuXFxuZmxvYXQgcGF0dGVybigpXFxue1xcbiAgIGZsb2F0IHMgPSBzaW4oYW5nbGUpLCBjID0gY29zKGFuZ2xlKTtcXG4gICB2ZWMyIHRleCA9IHZUZXh0dXJlQ29vcmQgKiBmaWx0ZXJBcmVhLnh5O1xcbiAgIHZlYzIgcG9pbnQgPSB2ZWMyKFxcbiAgICAgICBjICogdGV4LnggLSBzICogdGV4LnksXFxuICAgICAgIHMgKiB0ZXgueCArIGMgKiB0ZXgueVxcbiAgICkgKiBzY2FsZTtcXG4gICByZXR1cm4gKHNpbihwb2ludC54KSAqIHNpbihwb2ludC55KSkgKiA0LjA7XFxufVxcblxcbnZvaWQgbWFpbigpXFxue1xcbiAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgIGZsb2F0IGF2ZXJhZ2UgPSAoY29sb3IuciArIGNvbG9yLmcgKyBjb2xvci5iKSAvIDMuMDtcXG4gICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZlYzMoYXZlcmFnZSAqIDEwLjAgLSA1LjAgKyBwYXR0ZXJuKCkpLCBjb2xvci5hKTtcXG59XFxuXCIsbz1mdW5jdGlvbihlKXtmdW5jdGlvbiBvKG8scil7dm9pZCAwPT09byYmKG89MSksdm9pZCAwPT09ciYmKHI9NSksZS5jYWxsKHRoaXMsbix0KSx0aGlzLnNjYWxlPW8sdGhpcy5hbmdsZT1yfWUmJihvLl9fcHJvdG9fXz1lKSwoby5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW87dmFyIHI9e3NjYWxlOntjb25maWd1cmFibGU6ITB9LGFuZ2xlOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5zY2FsZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY2FsZX0sci5zY2FsZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zY2FsZT1lfSxyLmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmFuZ2xlfSxyLmFuZ2xlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmFuZ2xlPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG8ucHJvdG90eXBlLHIpLG99KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuRG90RmlsdGVyPW8sZS5Eb3RGaWx0ZXI9byxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWRvdC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1kcm9wLXNoYWRvdyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUodC5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgZT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBhbHBoYTtcXG51bmlmb3JtIHZlYzMgY29sb3I7XFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIC8vIFVuLXByZW11bHRpcGx5IGFscGhhIGJlZm9yZSBhcHBseWluZyB0aGUgY29sb3JcXG4gICAgaWYgKHNhbXBsZS5hID4gMC4wKSB7XFxuICAgICAgICBzYW1wbGUucmdiIC89IHNhbXBsZS5hO1xcbiAgICB9XFxuXFxuICAgIC8vIFByZW11bHRpcGx5IGFscGhhIGFnYWluXFxuICAgIHNhbXBsZS5yZ2IgPSBjb2xvci5yZ2IgKiBzYW1wbGUuYTtcXG5cXG4gICAgLy8gYWxwaGEgdXNlciBhbHBoYVxcbiAgICBzYW1wbGUgKj0gYWxwaGE7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHNhbXBsZTtcXG59XCIsaT1mdW5jdGlvbih0KXtmdW5jdGlvbiBpKGksbixvLGEsbCl7dm9pZCAwPT09aSYmKGk9NDUpLHZvaWQgMD09PW4mJihuPTUpLHZvaWQgMD09PW8mJihvPTIpLHZvaWQgMD09PWEmJihhPTApLHZvaWQgMD09PWwmJihsPS41KSx0LmNhbGwodGhpcyksdGhpcy50aW50RmlsdGVyPW5ldyBQSVhJLkZpbHRlcihlLHIpLHRoaXMuYmx1ckZpbHRlcj1uZXcgUElYSS5maWx0ZXJzLkJsdXJGaWx0ZXIsdGhpcy5ibHVyRmlsdGVyLmJsdXI9byx0aGlzLnRhcmdldFRyYW5zZm9ybT1uZXcgUElYSS5NYXRyaXgsdGhpcy5yb3RhdGlvbj1pLHRoaXMucGFkZGluZz1uLHRoaXMuZGlzdGFuY2U9bix0aGlzLmFscGhhPWwsdGhpcy5jb2xvcj1hfXQmJihpLl9fcHJvdG9fXz10KSwoaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWk7dmFyIG49e2Rpc3RhbmNlOntjb25maWd1cmFibGU6ITB9LHJvdGF0aW9uOntjb25maWd1cmFibGU6ITB9LGJsdXI6e2NvbmZpZ3VyYWJsZTohMH0sYWxwaGE6e2NvbmZpZ3VyYWJsZTohMH0sY29sb3I6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbih0LGUscixpKXt2YXIgbj10LmdldFJlbmRlclRhcmdldCgpO24udHJhbnNmb3JtPXRoaXMudGFyZ2V0VHJhbnNmb3JtLHRoaXMudGludEZpbHRlci5hcHBseSh0LGUsbiwhMCksdGhpcy5ibHVyRmlsdGVyLmFwcGx5KHQsbixyKSx0LmFwcGx5RmlsdGVyKHRoaXMsZSxyLGkpLG4udHJhbnNmb3JtPW51bGwsdC5yZXR1cm5SZW5kZXJUYXJnZXQobil9LGkucHJvdG90eXBlLl91cGRhdGVQYWRkaW5nPWZ1bmN0aW9uKCl7dGhpcy5wYWRkaW5nPXRoaXMuZGlzdGFuY2UrMip0aGlzLmJsdXJ9LGkucHJvdG90eXBlLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm09ZnVuY3Rpb24oKXt0aGlzLnRhcmdldFRyYW5zZm9ybS50eD10aGlzLmRpc3RhbmNlKk1hdGguY29zKHRoaXMuYW5nbGUpLHRoaXMudGFyZ2V0VHJhbnNmb3JtLnR5PXRoaXMuZGlzdGFuY2UqTWF0aC5zaW4odGhpcy5hbmdsZSl9LG4uZGlzdGFuY2UuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Rpc3RhbmNlfSxuLmRpc3RhbmNlLnNldD1mdW5jdGlvbih0KXt0aGlzLl9kaXN0YW5jZT10LHRoaXMuX3VwZGF0ZVBhZGRpbmcoKSx0aGlzLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm0oKX0sbi5yb3RhdGlvbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hbmdsZS9QSVhJLkRFR19UT19SQUR9LG4ucm90YXRpb24uc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYW5nbGU9dCpQSVhJLkRFR19UT19SQUQsdGhpcy5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtKCl9LG4uYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyRmlsdGVyLmJsdXJ9LG4uYmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5ibHVyRmlsdGVyLmJsdXI9dCx0aGlzLl91cGRhdGVQYWRkaW5nKCl9LG4uYWxwaGEuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5hbHBoYX0sbi5hbHBoYS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhPXR9LG4uY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIFBJWEkudXRpbHMucmdiMmhleCh0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuY29sb3IpfSxuLmNvbG9yLnNldD1mdW5jdGlvbih0KXtQSVhJLnV0aWxzLmhleDJyZ2IodCx0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuY29sb3IpfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhpLnByb3RvdHlwZSxuKSxpfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkRyb3BTaGFkb3dGaWx0ZXI9aSx0LkRyb3BTaGFkb3dGaWx0ZXI9aSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWRyb3Atc2hhZG93LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItZW1ib3NzIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1lbWJvc3MgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgc3RyZW5ndGg7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxuXFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcblxcdHZlYzIgb25lUGl4ZWwgPSB2ZWMyKDEuMCAvIGZpbHRlckFyZWEpO1xcblxcblxcdHZlYzQgY29sb3I7XFxuXFxuXFx0Y29sb3IucmdiID0gdmVjMygwLjUpO1xcblxcblxcdGNvbG9yIC09IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCAtIG9uZVBpeGVsKSAqIHN0cmVuZ3RoO1xcblxcdGNvbG9yICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIG9uZVBpeGVsKSAqIHN0cmVuZ3RoO1xcblxcblxcdGNvbG9yLnJnYiA9IHZlYzMoKGNvbG9yLnIgKyBjb2xvci5nICsgY29sb3IuYikgLyAzLjApO1xcblxcblxcdGZsb2F0IGFscGhhID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKS5hO1xcblxcblxcdGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IucmdiICogYWxwaGEsIGFscGhhKTtcXG59XFxuXCIsbz1mdW5jdGlvbihlKXtmdW5jdGlvbiBvKG8pe3ZvaWQgMD09PW8mJihvPTUpLGUuY2FsbCh0aGlzLHQsciksdGhpcy5zdHJlbmd0aD1vfWUmJihvLl9fcHJvdG9fXz1lKSwoby5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW87dmFyIG49e3N0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5zdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zdHJlbmd0aH0sbi5zdHJlbmd0aC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zdHJlbmd0aD1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvLnByb3RvdHlwZSxuKSxvfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkVtYm9zc0ZpbHRlcj1vLGUuRW1ib3NzRmlsdGVyPW8sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1lbWJvc3MuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1nbG93IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1nbG93IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG8sbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihvLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG8pe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gZmxvYXQgZGlzdGFuY2U7XFxudW5pZm9ybSBmbG9hdCBvdXRlclN0cmVuZ3RoO1xcbnVuaWZvcm0gZmxvYXQgaW5uZXJTdHJlbmd0aDtcXG51bmlmb3JtIHZlYzQgZ2xvd0NvbG9yO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJDbGFtcDtcXG52ZWMyIHB4ID0gdmVjMigxLjAgLyBmaWx0ZXJBcmVhLngsIDEuMCAvIGZpbHRlckFyZWEueSk7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0O1xcbiAgICB2ZWM0IG93bkNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjNCBjdXJDb2xvcjtcXG4gICAgZmxvYXQgdG90YWxBbHBoYSA9IDAuMDtcXG4gICAgZmxvYXQgbWF4VG90YWxBbHBoYSA9IDAuMDtcXG4gICAgZmxvYXQgY29zQW5nbGU7XFxuICAgIGZsb2F0IHNpbkFuZ2xlO1xcbiAgICB2ZWMyIGRpc3BsYWNlZDtcXG4gICAgZm9yIChmbG9hdCBhbmdsZSA9IDAuMDsgYW5nbGUgPD0gUEkgKiAyLjA7IGFuZ2xlICs9ICVRVUFMSVRZX0RJU1QlKSB7XFxuICAgICAgIGNvc0FuZ2xlID0gY29zKGFuZ2xlKTtcXG4gICAgICAgc2luQW5nbGUgPSBzaW4oYW5nbGUpO1xcbiAgICAgICBmb3IgKGZsb2F0IGN1ckRpc3RhbmNlID0gMS4wOyBjdXJEaXN0YW5jZSA8PSAlRElTVCU7IGN1ckRpc3RhbmNlKyspIHtcXG4gICAgICAgICAgIGRpc3BsYWNlZC54ID0gdlRleHR1cmVDb29yZC54ICsgY29zQW5nbGUgKiBjdXJEaXN0YW5jZSAqIHB4Lng7XFxuICAgICAgICAgICBkaXNwbGFjZWQueSA9IHZUZXh0dXJlQ29vcmQueSArIHNpbkFuZ2xlICogY3VyRGlzdGFuY2UgKiBweC55O1xcbiAgICAgICAgICAgY3VyQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wKGRpc3BsYWNlZCwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KSk7XFxuICAgICAgICAgICB0b3RhbEFscGhhICs9IChkaXN0YW5jZSAtIGN1ckRpc3RhbmNlKSAqIGN1ckNvbG9yLmE7XFxuICAgICAgICAgICBtYXhUb3RhbEFscGhhICs9IChkaXN0YW5jZSAtIGN1ckRpc3RhbmNlKTtcXG4gICAgICAgfVxcbiAgICB9XFxuICAgIG1heFRvdGFsQWxwaGEgPSBtYXgobWF4VG90YWxBbHBoYSwgMC4wMDAxKTtcXG5cXG4gICAgb3duQ29sb3IuYSA9IG1heChvd25Db2xvci5hLCAwLjAwMDEpO1xcbiAgICBvd25Db2xvci5yZ2IgPSBvd25Db2xvci5yZ2IgLyBvd25Db2xvci5hO1xcbiAgICBmbG9hdCBvdXRlckdsb3dBbHBoYSA9ICh0b3RhbEFscGhhIC8gbWF4VG90YWxBbHBoYSkgICogb3V0ZXJTdHJlbmd0aCAqICgxLiAtIG93bkNvbG9yLmEpO1xcbiAgICBmbG9hdCBpbm5lckdsb3dBbHBoYSA9ICgobWF4VG90YWxBbHBoYSAtIHRvdGFsQWxwaGEpIC8gbWF4VG90YWxBbHBoYSkgKiBpbm5lclN0cmVuZ3RoICogb3duQ29sb3IuYTtcXG4gICAgZmxvYXQgcmVzdWx0QWxwaGEgPSAob3duQ29sb3IuYSArIG91dGVyR2xvd0FscGhhKTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChtaXgobWl4KG93bkNvbG9yLnJnYiwgZ2xvd0NvbG9yLnJnYiwgaW5uZXJHbG93QWxwaGEgLyBvd25Db2xvci5hKSwgZ2xvd0NvbG9yLnJnYiwgb3V0ZXJHbG93QWxwaGEgLyByZXN1bHRBbHBoYSkgKiByZXN1bHRBbHBoYSwgcmVzdWx0QWxwaGEpO1xcbn1cXG5cIixlPWZ1bmN0aW9uKG8pe2Z1bmN0aW9uIGUoZSxyLGksbCxhKXt2b2lkIDA9PT1lJiYoZT0xMCksdm9pZCAwPT09ciYmKHI9NCksdm9pZCAwPT09aSYmKGk9MCksdm9pZCAwPT09bCYmKGw9MTY3NzcyMTUpLHZvaWQgMD09PWEmJihhPS4xKSxvLmNhbGwodGhpcyxuLHQucmVwbGFjZSgvJVFVQUxJVFlfRElTVCUvZ2ksXCJcIisoMS9hL2UpLnRvRml4ZWQoNykpLnJlcGxhY2UoLyVESVNUJS9naSxcIlwiK2UudG9GaXhlZCg3KSkpLHRoaXMudW5pZm9ybXMuZ2xvd0NvbG9yPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDFdKSx0aGlzLmRpc3RhbmNlPWUsdGhpcy5jb2xvcj1sLHRoaXMub3V0ZXJTdHJlbmd0aD1yLHRoaXMuaW5uZXJTdHJlbmd0aD1pfW8mJihlLl9fcHJvdG9fXz1vKSwoZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShvJiZvLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWU7dmFyIHI9e2NvbG9yOntjb25maWd1cmFibGU6ITB9LGRpc3RhbmNlOntjb25maWd1cmFibGU6ITB9LG91dGVyU3RyZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH0saW5uZXJTdHJlbmd0aDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIuY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIFBJWEkudXRpbHMucmdiMmhleCh0aGlzLnVuaWZvcm1zLmdsb3dDb2xvcil9LHIuY29sb3Iuc2V0PWZ1bmN0aW9uKG8pe1BJWEkudXRpbHMuaGV4MnJnYihvLHRoaXMudW5pZm9ybXMuZ2xvd0NvbG9yKX0sci5kaXN0YW5jZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5kaXN0YW5jZX0sci5kaXN0YW5jZS5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5kaXN0YW5jZT1vfSxyLm91dGVyU3RyZW5ndGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMub3V0ZXJTdHJlbmd0aH0sci5vdXRlclN0cmVuZ3RoLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLm91dGVyU3RyZW5ndGg9b30sci5pbm5lclN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmlubmVyU3RyZW5ndGh9LHIuaW5uZXJTdHJlbmd0aC5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5pbm5lclN0cmVuZ3RoPW99LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGUucHJvdG90eXBlLHIpLGV9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuR2xvd0ZpbHRlcj1lLG8uR2xvd0ZpbHRlcj1lLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZ2xvdy5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWdvZHJheSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItZ29kcmF5IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG4sZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZShuLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG4pe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ2ZWMzIG1vZDI4OSh2ZWMzIHgpXFxue1xcbiAgICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wO1xcbn1cXG52ZWM0IG1vZDI4OSh2ZWM0IHgpXFxue1xcbiAgICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wO1xcbn1cXG52ZWM0IHBlcm11dGUodmVjNCB4KVxcbntcXG4gICAgcmV0dXJuIG1vZDI4OSgoKHggKiAzNC4wKSArIDEuMCkgKiB4KTtcXG59XFxudmVjNCB0YXlsb3JJbnZTcXJ0KHZlYzQgcilcXG57XFxuICAgIHJldHVybiAxLjc5Mjg0MjkxNDAwMTU5IC0gMC44NTM3MzQ3MjA5NTMxNCAqIHI7XFxufVxcbnZlYzMgZmFkZSh2ZWMzIHQpXFxue1xcbiAgICByZXR1cm4gdCAqIHQgKiB0ICogKHQgKiAodCAqIDYuMCAtIDE1LjApICsgMTAuMCk7XFxufVxcbi8vIENsYXNzaWMgUGVybGluIG5vaXNlLCBwZXJpb2RpYyB2YXJpYW50XFxuZmxvYXQgcG5vaXNlKHZlYzMgUCwgdmVjMyByZXApXFxue1xcbiAgICB2ZWMzIFBpMCA9IG1vZChmbG9vcihQKSwgcmVwKTsgLy8gSW50ZWdlciBwYXJ0LCBtb2R1bG8gcGVyaW9kXFxuICAgIHZlYzMgUGkxID0gbW9kKFBpMCArIHZlYzMoMS4wKSwgcmVwKTsgLy8gSW50ZWdlciBwYXJ0ICsgMSwgbW9kIHBlcmlvZFxcbiAgICBQaTAgPSBtb2QyODkoUGkwKTtcXG4gICAgUGkxID0gbW9kMjg5KFBpMSk7XFxuICAgIHZlYzMgUGYwID0gZnJhY3QoUCk7IC8vIEZyYWN0aW9uYWwgcGFydCBmb3IgaW50ZXJwb2xhdGlvblxcbiAgICB2ZWMzIFBmMSA9IFBmMCAtIHZlYzMoMS4wKTsgLy8gRnJhY3Rpb25hbCBwYXJ0IC0gMS4wXFxuICAgIHZlYzQgaXggPSB2ZWM0KFBpMC54LCBQaTEueCwgUGkwLngsIFBpMS54KTtcXG4gICAgdmVjNCBpeSA9IHZlYzQoUGkwLnl5LCBQaTEueXkpO1xcbiAgICB2ZWM0IGl6MCA9IFBpMC56enp6O1xcbiAgICB2ZWM0IGl6MSA9IFBpMS56enp6O1xcbiAgICB2ZWM0IGl4eSA9IHBlcm11dGUocGVybXV0ZShpeCkgKyBpeSk7XFxuICAgIHZlYzQgaXh5MCA9IHBlcm11dGUoaXh5ICsgaXowKTtcXG4gICAgdmVjNCBpeHkxID0gcGVybXV0ZShpeHkgKyBpejEpO1xcbiAgICB2ZWM0IGd4MCA9IGl4eTAgKiAoMS4wIC8gNy4wKTtcXG4gICAgdmVjNCBneTAgPSBmcmFjdChmbG9vcihneDApICogKDEuMCAvIDcuMCkpIC0gMC41O1xcbiAgICBneDAgPSBmcmFjdChneDApO1xcbiAgICB2ZWM0IGd6MCA9IHZlYzQoMC41KSAtIGFicyhneDApIC0gYWJzKGd5MCk7XFxuICAgIHZlYzQgc3owID0gc3RlcChnejAsIHZlYzQoMC4wKSk7XFxuICAgIGd4MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd4MCkgLSAwLjUpO1xcbiAgICBneTAgLT0gc3owICogKHN0ZXAoMC4wLCBneTApIC0gMC41KTtcXG4gICAgdmVjNCBneDEgPSBpeHkxICogKDEuMCAvIDcuMCk7XFxuICAgIHZlYzQgZ3kxID0gZnJhY3QoZmxvb3IoZ3gxKSAqICgxLjAgLyA3LjApKSAtIDAuNTtcXG4gICAgZ3gxID0gZnJhY3QoZ3gxKTtcXG4gICAgdmVjNCBnejEgPSB2ZWM0KDAuNSkgLSBhYnMoZ3gxKSAtIGFicyhneTEpO1xcbiAgICB2ZWM0IHN6MSA9IHN0ZXAoZ3oxLCB2ZWM0KDAuMCkpO1xcbiAgICBneDEgLT0gc3oxICogKHN0ZXAoMC4wLCBneDEpIC0gMC41KTtcXG4gICAgZ3kxIC09IHN6MSAqIChzdGVwKDAuMCwgZ3kxKSAtIDAuNSk7XFxuICAgIHZlYzMgZzAwMCA9IHZlYzMoZ3gwLngsIGd5MC54LCBnejAueCk7XFxuICAgIHZlYzMgZzEwMCA9IHZlYzMoZ3gwLnksIGd5MC55LCBnejAueSk7XFxuICAgIHZlYzMgZzAxMCA9IHZlYzMoZ3gwLnosIGd5MC56LCBnejAueik7XFxuICAgIHZlYzMgZzExMCA9IHZlYzMoZ3gwLncsIGd5MC53LCBnejAudyk7XFxuICAgIHZlYzMgZzAwMSA9IHZlYzMoZ3gxLngsIGd5MS54LCBnejEueCk7XFxuICAgIHZlYzMgZzEwMSA9IHZlYzMoZ3gxLnksIGd5MS55LCBnejEueSk7XFxuICAgIHZlYzMgZzAxMSA9IHZlYzMoZ3gxLnosIGd5MS56LCBnejEueik7XFxuICAgIHZlYzMgZzExMSA9IHZlYzMoZ3gxLncsIGd5MS53LCBnejEudyk7XFxuICAgIHZlYzQgbm9ybTAgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDAsIGcwMDApLCBkb3QoZzAxMCwgZzAxMCksIGRvdChnMTAwLCBnMTAwKSwgZG90KGcxMTAsIGcxMTApKSk7XFxuICAgIGcwMDAgKj0gbm9ybTAueDtcXG4gICAgZzAxMCAqPSBub3JtMC55O1xcbiAgICBnMTAwICo9IG5vcm0wLno7XFxuICAgIGcxMTAgKj0gbm9ybTAudztcXG4gICAgdmVjNCBub3JtMSA9IHRheWxvckludlNxcnQodmVjNChkb3QoZzAwMSwgZzAwMSksIGRvdChnMDExLCBnMDExKSwgZG90KGcxMDEsIGcxMDEpLCBkb3QoZzExMSwgZzExMSkpKTtcXG4gICAgZzAwMSAqPSBub3JtMS54O1xcbiAgICBnMDExICo9IG5vcm0xLnk7XFxuICAgIGcxMDEgKj0gbm9ybTEuejtcXG4gICAgZzExMSAqPSBub3JtMS53O1xcbiAgICBmbG9hdCBuMDAwID0gZG90KGcwMDAsIFBmMCk7XFxuICAgIGZsb2F0IG4xMDAgPSBkb3QoZzEwMCwgdmVjMyhQZjEueCwgUGYwLnl6KSk7XFxuICAgIGZsb2F0IG4wMTAgPSBkb3QoZzAxMCwgdmVjMyhQZjAueCwgUGYxLnksIFBmMC56KSk7XFxuICAgIGZsb2F0IG4xMTAgPSBkb3QoZzExMCwgdmVjMyhQZjEueHksIFBmMC56KSk7XFxuICAgIGZsb2F0IG4wMDEgPSBkb3QoZzAwMSwgdmVjMyhQZjAueHksIFBmMS56KSk7XFxuICAgIGZsb2F0IG4xMDEgPSBkb3QoZzEwMSwgdmVjMyhQZjEueCwgUGYwLnksIFBmMS56KSk7XFxuICAgIGZsb2F0IG4wMTEgPSBkb3QoZzAxMSwgdmVjMyhQZjAueCwgUGYxLnl6KSk7XFxuICAgIGZsb2F0IG4xMTEgPSBkb3QoZzExMSwgUGYxKTtcXG4gICAgdmVjMyBmYWRlX3h5eiA9IGZhZGUoUGYwKTtcXG4gICAgdmVjNCBuX3ogPSBtaXgodmVjNChuMDAwLCBuMTAwLCBuMDEwLCBuMTEwKSwgdmVjNChuMDAxLCBuMTAxLCBuMDExLCBuMTExKSwgZmFkZV94eXoueik7XFxuICAgIHZlYzIgbl95eiA9IG1peChuX3oueHksIG5fei56dywgZmFkZV94eXoueSk7XFxuICAgIGZsb2F0IG5feHl6ID0gbWl4KG5feXoueCwgbl95ei55LCBmYWRlX3h5ei54KTtcXG4gICAgcmV0dXJuIDIuMiAqIG5feHl6O1xcbn1cXG5mbG9hdCB0dXJiKHZlYzMgUCwgdmVjMyByZXAsIGZsb2F0IGxhY3VuYXJpdHksIGZsb2F0IGdhaW4pXFxue1xcbiAgICBmbG9hdCBzdW0gPSAwLjA7XFxuICAgIGZsb2F0IHNjID0gMS4wO1xcbiAgICBmbG9hdCB0b3RhbGdhaW4gPSAxLjA7XFxuICAgIGZvciAoZmxvYXQgaSA9IDAuMDsgaSA8IDYuMDsgaSsrKVxcbiAgICB7XFxuICAgICAgICBzdW0gKz0gdG90YWxnYWluICogcG5vaXNlKFAgKiBzYywgcmVwKTtcXG4gICAgICAgIHNjICo9IGxhY3VuYXJpdHk7XFxuICAgICAgICB0b3RhbGdhaW4gKj0gZ2FpbjtcXG4gICAgfVxcbiAgICByZXR1cm4gYWJzKHN1bSk7XFxufVxcblwiLGk9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzIgZGltZW5zaW9ucztcXG5cXG51bmlmb3JtIHZlYzIgYW5nbGVEaXI7XFxudW5pZm9ybSBmbG9hdCBnYWluO1xcbnVuaWZvcm0gZmxvYXQgbGFjdW5hcml0eTtcXG51bmlmb3JtIGZsb2F0IHRpbWU7XFxuXFxuJHtwZXJsaW59XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjMiBjb29yZCA9IHZUZXh0dXJlQ29vcmQgKiBmaWx0ZXJBcmVhLnh5IC8gZGltZW5zaW9ucy54eTtcXG5cXG4gICAgZmxvYXQgeHggPSBhbmdsZURpci54O1xcbiAgICBmbG9hdCB5eSA9IGFuZ2xlRGlyLnk7XFxuXFxuICAgIGZsb2F0IGQgPSAoeHggKiBjb29yZC54KSArICh5eSAqIGNvb3JkLnkpO1xcbiAgICB2ZWMzIGRpciA9IHZlYzMoZCwgZCwgMC4wKTtcXG5cXG4gICAgZmxvYXQgbm9pc2UgPSB0dXJiKGRpciArIHZlYzModGltZSwgMC4wLCA2Mi4xICsgdGltZSkgKiAwLjA1LCB2ZWMzKDQ4MC4wLCAzMjAuMCwgNDgwLjApLCBsYWN1bmFyaXR5LCBnYWluKTtcXG4gICAgbm9pc2UgPSBtaXgobm9pc2UsIDAuMCwgMC4zKTtcXG4gICAgLy9mYWRlIHZlcnRpY2FsbHkuXFxuICAgIHZlYzQgbWlzdCA9IHZlYzQobm9pc2UsIG5vaXNlLCBub2lzZSwgMS4wKSAqICgxLjAgLSBjb29yZC55KTtcXG4gICAgbWlzdC5hID0gMS4wO1xcbiAgICBnbF9GcmFnQ29sb3IgKz0gbWlzdDtcXG59XFxuXCIsbz1mdW5jdGlvbihuKXtmdW5jdGlvbiBvKG8scixhLGMpe3ZvaWQgMD09PW8mJihvPTMwKSx2b2lkIDA9PT1yJiYocj0uNSksdm9pZCAwPT09YSYmKGE9Mi41KSx2b2lkIDA9PT1jJiYoYz0wKSxuLmNhbGwodGhpcyxlLGkucmVwbGFjZShcIiR7cGVybGlufVwiLHQpKSx0aGlzLmFuZ2xlPW8sdGhpcy5nYWluPXIsdGhpcy5sYWN1bmFyaXR5PWEsdGhpcy50aW1lPWN9biYmKG8uX19wcm90b19fPW4pLChvLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG4mJm4ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bzt2YXIgcj17YW5nbGU6e2NvbmZpZ3VyYWJsZTohMH0sZ2Fpbjp7Y29uZmlndXJhYmxlOiEwfSxsYWN1bmFyaXR5Ontjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gby5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24obixlLHQsaSl7dmFyIG89ZS5zb3VyY2VGcmFtZS53aWR0aCxyPWUuc291cmNlRnJhbWUuaGVpZ2h0O3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT1vLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT1yLHRoaXMudW5pZm9ybXMudGltZT10aGlzLnRpbWUsdGhpcy51bmlmb3Jtcy5hbmdsZURpclsxXT10aGlzLl9hbmdsZVNpbipyL28sbi5hcHBseUZpbHRlcih0aGlzLGUsdCxpKX0sci5hbmdsZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYW5nbGV9LHIuYW5nbGUuc2V0PWZ1bmN0aW9uKG4pe3ZhciBlPW4qUElYSS5ERUdfVE9fUkFEO3RoaXMuX2FuZ2xlQ29zPU1hdGguY29zKGUpLHRoaXMuX2FuZ2xlU2luPU1hdGguc2luKGUpLHRoaXMudW5pZm9ybXMuYW5nbGVEaXJbMF09dGhpcy5fYW5nbGVDb3MsdGhpcy5fYW5nbGU9bn0sci5nYWluLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmdhaW59LHIuZ2Fpbi5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5nYWluPW59LHIubGFjdW5hcml0eS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5sYWN1bmFyaXR5fSxyLmxhY3VuYXJpdHkuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMubGFjdW5hcml0eT1ufSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvLnByb3RvdHlwZSxyKSxvfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkdvZHJheUZpbHRlcj1vLG4uR29kcmF5RmlsdGVyPW8sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1nb2RyYXkuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1tb3Rpb24tYmx1ciAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItbW90aW9uLWJsdXIgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsaT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnVuaWZvcm0gdmVjMiB1VmVsb2NpdHk7XFxudW5pZm9ybSBpbnQgdUtlcm5lbFNpemU7XFxudW5pZm9ybSBmbG9hdCB1T2Zmc2V0O1xcblxcbmNvbnN0IGludCBNQVhfS0VSTkVMX1NJWkUgPSAyMDQ4O1xcbmNvbnN0IGludCBJVEVSQVRJT04gPSBNQVhfS0VSTkVMX1NJWkUgLSAxO1xcblxcbnZlYzIgdmVsb2NpdHkgPSB1VmVsb2NpdHkgLyBmaWx0ZXJBcmVhLnh5O1xcblxcbi8vIGZsb2F0IGtlcm5lbFNpemUgPSBtaW4oZmxvYXQodUtlcm5lbFNpemUpLCBmbG9hdChNQVhfS0VSTkVMU0laRSkpO1xcblxcbi8vIEluIHJlYWwgdXNlLWNhc2UgLCB1S2VybmVsU2l6ZSA8IE1BWF9LRVJORUxTSVpFIGFsbW9zdCBhbHdheXMuXFxuLy8gU28gdXNlIHVLZXJuZWxTaXplIGRpcmVjdGx5LlxcbmZsb2F0IGtlcm5lbFNpemUgPSBmbG9hdCh1S2VybmVsU2l6ZSk7XFxuZmxvYXQgayA9IGtlcm5lbFNpemUgLSAxLjA7XFxuZmxvYXQgb2Zmc2V0ID0gLXVPZmZzZXQgLyBsZW5ndGgodVZlbG9jaXR5KSAtIDAuNTtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIGlmICh1S2VybmVsU2l6ZSA9PSAwKVxcbiAgICB7XFxuICAgICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgZm9yKGludCBpID0gMDsgaSA8IElURVJBVElPTjsgaSsrKSB7XFxuICAgICAgICBpZiAoaSA9PSBpbnQoaykpIHtcXG4gICAgICAgICAgICBicmVhaztcXG4gICAgICAgIH1cXG4gICAgICAgIHZlYzIgYmlhcyA9IHZlbG9jaXR5ICogKGZsb2F0KGkpIC8gayArIG9mZnNldCk7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgYmlhcyk7XFxuICAgIH1cXG4gICAgZ2xfRnJhZ0NvbG9yIC89IGtlcm5lbFNpemU7XFxufVxcblwiLG49ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuLG8scil7dm9pZCAwPT09biYmKG49WzAsMF0pLHZvaWQgMD09PW8mJihvPTUpLHZvaWQgMD09PXImJihyPTApLGUuY2FsbCh0aGlzLHQsaSksdGhpcy5fdmVsb2NpdHk9bmV3IFBJWEkuUG9pbnQoMCwwKSx0aGlzLnZlbG9jaXR5PW4sdGhpcy5rZXJuZWxTaXplPW8sdGhpcy5vZmZzZXQ9cn1lJiYobi5fX3Byb3RvX189ZSksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciBvPXt2ZWxvY2l0eTp7Y29uZmlndXJhYmxlOiEwfSxvZmZzZXQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsaSxuKXt2YXIgbz10aGlzLnZlbG9jaXR5LHI9by54LGw9by55O3RoaXMudW5pZm9ybXMudUtlcm5lbFNpemU9MCE9PXJ8fDAhPT1sP3RoaXMua2VybmVsU2l6ZTowLGUuYXBwbHlGaWx0ZXIodGhpcyx0LGksbil9LG8udmVsb2NpdHkuc2V0PWZ1bmN0aW9uKGUpe0FycmF5LmlzQXJyYXkoZSk/KHRoaXMuX3ZlbG9jaXR5Lng9ZVswXSx0aGlzLl92ZWxvY2l0eS55PWVbMV0pOmUgaW5zdGFuY2VvZiBQSVhJLlBvaW50JiYodGhpcy5fdmVsb2NpdHkueD1lLngsdGhpcy5fdmVsb2NpdHkueT1lLnkpLHRoaXMudW5pZm9ybXMudVZlbG9jaXR5WzBdPXRoaXMuX3ZlbG9jaXR5LngsdGhpcy51bmlmb3Jtcy51VmVsb2NpdHlbMV09dGhpcy5fdmVsb2NpdHkueX0sby52ZWxvY2l0eS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdmVsb2NpdHl9LG8ub2Zmc2V0LnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnVPZmZzZXQ9ZX0sby5vZmZzZXQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudU9mZnNldH0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsbyksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Nb3Rpb25CbHVyRmlsdGVyPW4sZS5Nb3Rpb25CbHVyRmlsdGVyPW4sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1tb3Rpb24tYmx1ci5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obyxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKG8uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gZmxvYXQgZXBzaWxvbjtcXG5cXG5jb25zdCBpbnQgTUFYX0NPTE9SUyA9ICVtYXhDb2xvcnMlO1xcblxcbnVuaWZvcm0gdmVjMyBvcmlnaW5hbENvbG9yc1tNQVhfQ09MT1JTXTtcXG51bmlmb3JtIHZlYzMgdGFyZ2V0Q29sb3JzW01BWF9DT0xPUlNdO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgZmxvYXQgYWxwaGEgPSBnbF9GcmFnQ29sb3IuYTtcXG4gICAgaWYgKGFscGhhIDwgMC4wMDAxKVxcbiAgICB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuXFxuICAgIHZlYzMgY29sb3IgPSBnbF9GcmFnQ29sb3IucmdiIC8gYWxwaGE7XFxuXFxuICAgIGZvcihpbnQgaSA9IDA7IGkgPCBNQVhfQ09MT1JTOyBpKyspXFxuICAgIHtcXG4gICAgICB2ZWMzIG9yaWdDb2xvciA9IG9yaWdpbmFsQ29sb3JzW2ldO1xcbiAgICAgIGlmIChvcmlnQ29sb3IuciA8IDAuMClcXG4gICAgICB7XFxuICAgICAgICBicmVhaztcXG4gICAgICB9XFxuICAgICAgdmVjMyBjb2xvckRpZmYgPSBvcmlnQ29sb3IgLSBjb2xvcjtcXG4gICAgICBpZiAobGVuZ3RoKGNvbG9yRGlmZikgPCBlcHNpbG9uKVxcbiAgICAgIHtcXG4gICAgICAgIHZlYzMgdGFyZ2V0Q29sb3IgPSB0YXJnZXRDb2xvcnNbaV07XFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCh0YXJnZXRDb2xvciArIGNvbG9yRGlmZikgKiBhbHBoYSwgYWxwaGEpO1xcbiAgICAgICAgcmV0dXJuO1xcbiAgICAgIH1cXG4gICAgfVxcbn1cXG5cIixuPWZ1bmN0aW9uKG8pe2Z1bmN0aW9uIG4obix0LGkpe3ZvaWQgMD09PXQmJih0PS4wNSksdm9pZCAwPT09aSYmKGk9bnVsbCksaT1pfHxuLmxlbmd0aCxvLmNhbGwodGhpcyxlLHIucmVwbGFjZSgvJW1heENvbG9ycyUvZyxpKSksdGhpcy5lcHNpbG9uPXQsdGhpcy5fbWF4Q29sb3JzPWksdGhpcy5fcmVwbGFjZW1lbnRzPW51bGwsdGhpcy51bmlmb3Jtcy5vcmlnaW5hbENvbG9ycz1uZXcgRmxvYXQzMkFycmF5KDMqaSksdGhpcy51bmlmb3Jtcy50YXJnZXRDb2xvcnM9bmV3IEZsb2F0MzJBcnJheSgzKmkpLHRoaXMucmVwbGFjZW1lbnRzPW59byYmKG4uX19wcm90b19fPW8pLChuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG8mJm8ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bjt2YXIgdD17cmVwbGFjZW1lbnRzOntjb25maWd1cmFibGU6ITB9LG1heENvbG9yczp7Y29uZmlndXJhYmxlOiEwfSxlcHNpbG9uOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gdC5yZXBsYWNlbWVudHMuc2V0PWZ1bmN0aW9uKG8pe3ZhciBlPXRoaXMudW5pZm9ybXMub3JpZ2luYWxDb2xvcnMscj10aGlzLnVuaWZvcm1zLnRhcmdldENvbG9ycyxuPW8ubGVuZ3RoO2lmKG4+dGhpcy5fbWF4Q29sb3JzKXRocm93XCJMZW5ndGggb2YgcmVwbGFjZW1lbnRzIChcIituK1wiKSBleGNlZWRzIHRoZSBtYXhpbXVtIGNvbG9ycyBsZW5ndGggKFwiK3RoaXMuX21heENvbG9ycytcIilcIjtlWzMqbl09LTE7Zm9yKHZhciB0PTA7dDxuO3QrKyl7dmFyIGk9b1t0XSxsPWlbMF07XCJudW1iZXJcIj09dHlwZW9mIGw/bD1QSVhJLnV0aWxzLmhleDJyZ2IobCk6aVswXT1QSVhJLnV0aWxzLnJnYjJoZXgobCksZVszKnRdPWxbMF0sZVszKnQrMV09bFsxXSxlWzMqdCsyXT1sWzJdO3ZhciBhPWlbMV07XCJudW1iZXJcIj09dHlwZW9mIGE/YT1QSVhJLnV0aWxzLmhleDJyZ2IoYSk6aVsxXT1QSVhJLnV0aWxzLnJnYjJoZXgoYSksclszKnRdPWFbMF0sclszKnQrMV09YVsxXSxyWzMqdCsyXT1hWzJdfXRoaXMuX3JlcGxhY2VtZW50cz1vfSx0LnJlcGxhY2VtZW50cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVwbGFjZW1lbnRzfSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dGhpcy5yZXBsYWNlbWVudHM9dGhpcy5fcmVwbGFjZW1lbnRzfSx0Lm1heENvbG9ycy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbWF4Q29sb3JzfSx0LmVwc2lsb24uc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMuZXBzaWxvbj1vfSx0LmVwc2lsb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZXBzaWxvbn0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsdCksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5NdWx0aUNvbG9yUmVwbGFjZUZpbHRlcj1uLG8uTXVsdGlDb2xvclJlcGxhY2VGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1vbGQtZmlsbSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItb2xkLWZpbG0gaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obix0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KG4uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsaT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjMiBkaW1lbnNpb25zO1xcblxcbnVuaWZvcm0gZmxvYXQgc2VwaWE7XFxudW5pZm9ybSBmbG9hdCBub2lzZTtcXG51bmlmb3JtIGZsb2F0IG5vaXNlU2l6ZTtcXG51bmlmb3JtIGZsb2F0IHNjcmF0Y2g7XFxudW5pZm9ybSBmbG9hdCBzY3JhdGNoRGVuc2l0eTtcXG51bmlmb3JtIGZsb2F0IHNjcmF0Y2hXaWR0aDtcXG51bmlmb3JtIGZsb2F0IHZpZ25ldHRpbmc7XFxudW5pZm9ybSBmbG9hdCB2aWduZXR0aW5nQWxwaGE7XFxudW5pZm9ybSBmbG9hdCB2aWduZXR0aW5nQmx1cjtcXG51bmlmb3JtIGZsb2F0IHNlZWQ7XFxuXFxuY29uc3QgZmxvYXQgU1FSVF8yID0gMS40MTQyMTM7XFxuY29uc3QgdmVjMyBTRVBJQV9SR0IgPSB2ZWMzKDExMi4wIC8gMjU1LjAsIDY2LjAgLyAyNTUuMCwgMjAuMCAvIDI1NS4wKTtcXG5cXG5mbG9hdCByYW5kKHZlYzIgY28pIHtcXG4gICAgcmV0dXJuIGZyYWN0KHNpbihkb3QoY28ueHksIHZlYzIoMTIuOTg5OCwgNzguMjMzKSkpICogNDM3NTguNTQ1Myk7XFxufVxcblxcbnZlYzMgT3ZlcmxheSh2ZWMzIHNyYywgdmVjMyBkc3QpXFxue1xcbiAgICAvLyBpZiAoZHN0IDw9IDAuNSkgdGhlbjogMiAqIHNyYyAqIGRzdFxcbiAgICAvLyBpZiAoZHN0ID4gMC41KSB0aGVuOiAxIC0gMiAqICgxIC0gZHN0KSAqICgxIC0gc3JjKVxcbiAgICByZXR1cm4gdmVjMygoZHN0LnggPD0gMC41KSA/ICgyLjAgKiBzcmMueCAqIGRzdC54KSA6ICgxLjAgLSAyLjAgKiAoMS4wIC0gZHN0LngpICogKDEuMCAtIHNyYy54KSksXFxuICAgICAgICAgICAgICAgIChkc3QueSA8PSAwLjUpID8gKDIuMCAqIHNyYy55ICogZHN0LnkpIDogKDEuMCAtIDIuMCAqICgxLjAgLSBkc3QueSkgKiAoMS4wIC0gc3JjLnkpKSxcXG4gICAgICAgICAgICAgICAgKGRzdC56IDw9IDAuNSkgPyAoMi4wICogc3JjLnogKiBkc3QueikgOiAoMS4wIC0gMi4wICogKDEuMCAtIGRzdC56KSAqICgxLjAgLSBzcmMueikpKTtcXG59XFxuXFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzMgY29sb3IgPSBnbF9GcmFnQ29sb3IucmdiO1xcblxcbiAgICBpZiAoc2VwaWEgPiAwLjApXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IGdyYXkgPSAoY29sb3IueCArIGNvbG9yLnkgKyBjb2xvci56KSAvIDMuMDtcXG4gICAgICAgIHZlYzMgZ3JheXNjYWxlID0gdmVjMyhncmF5KTtcXG5cXG4gICAgICAgIGNvbG9yID0gT3ZlcmxheShTRVBJQV9SR0IsIGdyYXlzY2FsZSk7XFxuXFxuICAgICAgICBjb2xvciA9IGdyYXlzY2FsZSArIHNlcGlhICogKGNvbG9yIC0gZ3JheXNjYWxlKTtcXG4gICAgfVxcblxcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHkgLyBkaW1lbnNpb25zLnh5O1xcblxcbiAgICBpZiAodmlnbmV0dGluZyA+IDAuMClcXG4gICAge1xcbiAgICAgICAgZmxvYXQgb3V0dGVyID0gU1FSVF8yIC0gdmlnbmV0dGluZyAqIFNRUlRfMjtcXG4gICAgICAgIHZlYzIgZGlyID0gdmVjMih2ZWMyKDAuNSwgMC41KSAtIGNvb3JkKTtcXG4gICAgICAgIGRpci55ICo9IGRpbWVuc2lvbnMueSAvIGRpbWVuc2lvbnMueDtcXG4gICAgICAgIGZsb2F0IGRhcmtlciA9IGNsYW1wKChvdXR0ZXIgLSBsZW5ndGgoZGlyKSAqIFNRUlRfMikgLyAoIDAuMDAwMDEgKyB2aWduZXR0aW5nQmx1ciAqIFNRUlRfMiksIDAuMCwgMS4wKTtcXG4gICAgICAgIGNvbG9yLnJnYiAqPSBkYXJrZXIgKyAoMS4wIC0gZGFya2VyKSAqICgxLjAgLSB2aWduZXR0aW5nQWxwaGEpO1xcbiAgICB9XFxuXFxuICAgIGlmIChzY3JhdGNoRGVuc2l0eSA+IHNlZWQgJiYgc2NyYXRjaCAhPSAwLjApXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IHBoYXNlID0gc2VlZCAqIDI1Ni4wO1xcbiAgICAgICAgZmxvYXQgcyA9IG1vZChmbG9vcihwaGFzZSksIDIuMCk7XFxuICAgICAgICBmbG9hdCBkaXN0ID0gMS4wIC8gc2NyYXRjaERlbnNpdHk7XFxuICAgICAgICBmbG9hdCBkID0gZGlzdGFuY2UoY29vcmQsIHZlYzIoc2VlZCAqIGRpc3QsIGFicyhzIC0gc2VlZCAqIGRpc3QpKSk7XFxuICAgICAgICBpZiAoZCA8IHNlZWQgKiAwLjYgKyAwLjQpXFxuICAgICAgICB7XFxuICAgICAgICAgICAgaGlnaHAgZmxvYXQgcGVyaW9kID0gc2NyYXRjaERlbnNpdHkgKiAxMC4wO1xcblxcbiAgICAgICAgICAgIGZsb2F0IHh4ID0gY29vcmQueCAqIHBlcmlvZCArIHBoYXNlO1xcbiAgICAgICAgICAgIGZsb2F0IGFhID0gYWJzKG1vZCh4eCwgMC41KSAqIDQuMCk7XFxuICAgICAgICAgICAgZmxvYXQgYmIgPSBtb2QoZmxvb3IoeHggLyAwLjUpLCAyLjApO1xcbiAgICAgICAgICAgIGZsb2F0IHl5ID0gKDEuMCAtIGJiKSAqIGFhICsgYmIgKiAoMi4wIC0gYWEpO1xcblxcbiAgICAgICAgICAgIGZsb2F0IGtrID0gMi4wICogcGVyaW9kO1xcbiAgICAgICAgICAgIGZsb2F0IGR3ID0gc2NyYXRjaFdpZHRoIC8gZGltZW5zaW9ucy54ICogKDAuNzUgKyBzZWVkKTtcXG4gICAgICAgICAgICBmbG9hdCBkaCA9IGR3ICoga2s7XFxuXFxuICAgICAgICAgICAgZmxvYXQgdGluZSA9ICh5eSAtICgyLjAgLSBkaCkpO1xcblxcbiAgICAgICAgICAgIGlmICh0aW5lID4gMC4wKSB7XFxuICAgICAgICAgICAgICAgIGZsb2F0IF9zaWduID0gc2lnbihzY3JhdGNoKTtcXG5cXG4gICAgICAgICAgICAgICAgdGluZSA9IHMgKiB0aW5lIC8gcGVyaW9kICsgc2NyYXRjaCArIDAuMTtcXG4gICAgICAgICAgICAgICAgdGluZSA9IGNsYW1wKHRpbmUgKyAxLjAsIDAuNSArIF9zaWduICogMC41LCAxLjUgKyBfc2lnbiAqIDAuNSk7XFxuXFxuICAgICAgICAgICAgICAgIGNvbG9yLnJnYiAqPSB0aW5lO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBpZiAobm9pc2UgPiAwLjAgJiYgbm9pc2VTaXplID4gMC4wKVxcbiAgICB7XFxuICAgICAgICB2ZWMyIHBpeGVsQ29vcmQgPSB2VGV4dHVyZUNvb3JkLnh5ICogZmlsdGVyQXJlYS54eTtcXG4gICAgICAgIHBpeGVsQ29vcmQueCA9IGZsb29yKHBpeGVsQ29vcmQueCAvIG5vaXNlU2l6ZSk7XFxuICAgICAgICBwaXhlbENvb3JkLnkgPSBmbG9vcihwaXhlbENvb3JkLnkgLyBub2lzZVNpemUpO1xcbiAgICAgICAgLy8gdmVjMiBkID0gcGl4ZWxDb29yZCAqIG5vaXNlU2l6ZSAqIHZlYzIoMTAyNC4wICsgc2VlZCAqIDUxMi4wLCAxMDI0LjAgLSBzZWVkICogNTEyLjApO1xcbiAgICAgICAgLy8gZmxvYXQgX25vaXNlID0gc25vaXNlKGQpICogMC41O1xcbiAgICAgICAgZmxvYXQgX25vaXNlID0gcmFuZChwaXhlbENvb3JkICogbm9pc2VTaXplICogc2VlZCkgLSAwLjU7XFxuICAgICAgICBjb2xvciArPSBfbm9pc2UgKiBub2lzZTtcXG4gICAgfVxcblxcbiAgICBnbF9GcmFnQ29sb3IucmdiID0gY29sb3I7XFxufVxcblwiLGU9ZnVuY3Rpb24obil7ZnVuY3Rpb24gZShlLG8pe3ZvaWQgMD09PW8mJihvPTApLG4uY2FsbCh0aGlzLHQsaSksXCJudW1iZXJcIj09dHlwZW9mIGU/KHRoaXMuc2VlZD1lLGU9bnVsbCk6dGhpcy5zZWVkPW8sT2JqZWN0LmFzc2lnbih0aGlzLHtzZXBpYTouMyxub2lzZTouMyxub2lzZVNpemU6MSxzY3JhdGNoOi41LHNjcmF0Y2hEZW5zaXR5Oi4zLHNjcmF0Y2hXaWR0aDoxLHZpZ25ldHRpbmc6LjMsdmlnbmV0dGluZ0FscGhhOjEsdmlnbmV0dGluZ0JsdXI6LjN9LGUpfW4mJihlLl9fcHJvdG9fXz1uKSwoZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShuJiZuLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWU7dmFyIG89e3NlcGlhOntjb25maWd1cmFibGU6ITB9LG5vaXNlOntjb25maWd1cmFibGU6ITB9LG5vaXNlU2l6ZTp7Y29uZmlndXJhYmxlOiEwfSxzY3JhdGNoOntjb25maWd1cmFibGU6ITB9LHNjcmF0Y2hEZW5zaXR5Ontjb25maWd1cmFibGU6ITB9LHNjcmF0Y2hXaWR0aDp7Y29uZmlndXJhYmxlOiEwfSx2aWduZXR0aW5nOntjb25maWd1cmFibGU6ITB9LHZpZ25ldHRpbmdBbHBoYTp7Y29uZmlndXJhYmxlOiEwfSx2aWduZXR0aW5nQmx1cjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGUucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKG4sdCxpLGUpe3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT10LnNvdXJjZUZyYW1lLndpZHRoLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT10LnNvdXJjZUZyYW1lLmhlaWdodCx0aGlzLnVuaWZvcm1zLnNlZWQ9dGhpcy5zZWVkLG4uYXBwbHlGaWx0ZXIodGhpcyx0LGksZSl9LG8uc2VwaWEuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMuc2VwaWE9bn0sby5zZXBpYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zZXBpYX0sby5ub2lzZS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5ub2lzZT1ufSxvLm5vaXNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLm5vaXNlfSxvLm5vaXNlU2l6ZS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5ub2lzZVNpemU9bn0sby5ub2lzZVNpemUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMubm9pc2VTaXplfSxvLnNjcmF0Y2guc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMuc2NyYXRjaD1ufSxvLnNjcmF0Y2guZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2NyYXRjaH0sby5zY3JhdGNoRGVuc2l0eS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5zY3JhdGNoRGVuc2l0eT1ufSxvLnNjcmF0Y2hEZW5zaXR5LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNjcmF0Y2hEZW5zaXR5fSxvLnNjcmF0Y2hXaWR0aC5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5zY3JhdGNoV2lkdGg9bn0sby5zY3JhdGNoV2lkdGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2NyYXRjaFdpZHRofSxvLnZpZ25ldHRpbmcuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudmlnbmV0dGluZz1ufSxvLnZpZ25ldHRpbmcuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudmlnbmV0dGluZ30sby52aWduZXR0aW5nQWxwaGEuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudmlnbmV0dGluZ0FscGhhPW59LG8udmlnbmV0dGluZ0FscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmdBbHBoYX0sby52aWduZXR0aW5nQmx1ci5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy52aWduZXR0aW5nQmx1cj1ufSxvLnZpZ25ldHRpbmdCbHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmdCbHVyfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhlLnByb3RvdHlwZSxvKSxlfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLk9sZEZpbG1GaWx0ZXI9ZSxuLk9sZEZpbG1GaWx0ZXI9ZSxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLW9sZC1maWxtLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItb3V0bGluZSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItb3V0bGluZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLG8pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP28oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG8pOm8oZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgbz1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSBmbG9hdCB0aGlja25lc3M7XFxudW5pZm9ybSB2ZWM0IG91dGxpbmVDb2xvcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxudmVjMiBweCA9IHZlYzIoMS4wIC8gZmlsdGVyQXJlYS54LCAxLjAgLyBmaWx0ZXJBcmVhLnkpO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIGNvbnN0IGZsb2F0IFBJID0gMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDtcXG4gICAgdmVjNCBvd25Db2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzQgY3VyQ29sb3I7XFxuICAgIGZsb2F0IG1heEFscGhhID0gMC47XFxuICAgIHZlYzIgZGlzcGxhY2VkO1xcbiAgICBmb3IgKGZsb2F0IGFuZ2xlID0gMC47IGFuZ2xlIDwgUEkgKiAyLjsgYW5nbGUgKz0gJVRISUNLTkVTUyUgKSB7XFxuICAgICAgICBkaXNwbGFjZWQueCA9IHZUZXh0dXJlQ29vcmQueCArIHRoaWNrbmVzcyAqIHB4LnggKiBjb3MoYW5nbGUpO1xcbiAgICAgICAgZGlzcGxhY2VkLnkgPSB2VGV4dHVyZUNvb3JkLnkgKyB0aGlja25lc3MgKiBweC55ICogc2luKGFuZ2xlKTtcXG4gICAgICAgIGN1ckNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjbGFtcChkaXNwbGFjZWQsIGZpbHRlckNsYW1wLnh5LCBmaWx0ZXJDbGFtcC56dykpO1xcbiAgICAgICAgbWF4QWxwaGEgPSBtYXgobWF4QWxwaGEsIGN1ckNvbG9yLmEpO1xcbiAgICB9XFxuICAgIGZsb2F0IHJlc3VsdEFscGhhID0gbWF4KG1heEFscGhhLCBvd25Db2xvci5hKTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgob3duQ29sb3IucmdiICsgb3V0bGluZUNvbG9yLnJnYiAqICgxLiAtIG93bkNvbG9yLmEpKSAqIHJlc3VsdEFscGhhLCByZXN1bHRBbHBoYSk7XFxufVxcblwiLG49ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuLHIpe3ZvaWQgMD09PW4mJihuPTEpLHZvaWQgMD09PXImJihyPTApLGUuY2FsbCh0aGlzLG8sdC5yZXBsYWNlKC8lVEhJQ0tORVNTJS9naSwoMS9uKS50b0ZpeGVkKDcpKSksdGhpcy50aGlja25lc3M9bix0aGlzLnVuaWZvcm1zLm91dGxpbmVDb2xvcj1uZXcgRmxvYXQzMkFycmF5KFswLDAsMCwxXSksdGhpcy5jb2xvcj1yfWUmJihuLl9fcHJvdG9fXz1lKSwobi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW47dmFyIHI9e2NvbG9yOntjb25maWd1cmFibGU6ITB9LHRoaWNrbmVzczp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIuY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIFBJWEkudXRpbHMucmdiMmhleCh0aGlzLnVuaWZvcm1zLm91dGxpbmVDb2xvcil9LHIuY29sb3Iuc2V0PWZ1bmN0aW9uKGUpe1BJWEkudXRpbHMuaGV4MnJnYihlLHRoaXMudW5pZm9ybXMub3V0bGluZUNvbG9yKX0sci50aGlja25lc3MuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudGhpY2tuZXNzfSxyLnRoaWNrbmVzcy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy50aGlja25lc3M9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsciksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5PdXRsaW5lRmlsdGVyPW4sZS5PdXRsaW5lRmlsdGVyPW4sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1vdXRsaW5lLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItcGl4ZWxhdGUgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXBpeGVsYXRlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbyl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/byhleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbyk6byhlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBvPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHZlYzIgc2l6ZTtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG52ZWMyIG1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkICo9IGZpbHRlckFyZWEueHk7XFxuICAgIGNvb3JkICs9IGZpbHRlckFyZWEuenc7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB1bm1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkIC09IGZpbHRlckFyZWEuenc7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiBwaXhlbGF0ZSh2ZWMyIGNvb3JkLCB2ZWMyIHNpemUpXFxue1xcblxcdHJldHVybiBmbG9vciggY29vcmQgLyBzaXplICkgKiBzaXplO1xcbn1cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIHZlYzIgY29vcmQgPSBtYXBDb29yZCh2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgY29vcmQgPSBwaXhlbGF0ZShjb29yZCwgc2l6ZSk7XFxuXFxuICAgIGNvb3JkID0gdW5tYXBDb29yZChjb29yZCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY29vcmQpO1xcbn1cXG5cIixuPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4obil7dm9pZCAwPT09biYmKG49MTApLGUuY2FsbCh0aGlzLG8sciksdGhpcy5zaXplPW59ZSYmKG4uX19wcm90b19fPWUpLChuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bjt2YXIgdD17c2l6ZTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQuc2l6ZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zaXplfSx0LnNpemUuc2V0PWZ1bmN0aW9uKGUpe1wibnVtYmVyXCI9PXR5cGVvZiBlJiYoZT1bZSxlXSksdGhpcy51bmlmb3Jtcy5zaXplPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHQpLG59KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuUGl4ZWxhdGVGaWx0ZXI9bixlLlBpeGVsYXRlRmlsdGVyPW4sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1waXhlbGF0ZS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXJhZGlhbC1ibHVyIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1yYWRpYWwtYmx1ciBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP24oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG4pOm4oZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxuXFxudW5pZm9ybSBmbG9hdCB1UmFkaWFuO1xcbnVuaWZvcm0gdmVjMiB1Q2VudGVyO1xcbnVuaWZvcm0gZmxvYXQgdVJhZGl1cztcXG51bmlmb3JtIGludCB1S2VybmVsU2l6ZTtcXG5cXG5jb25zdCBpbnQgTUFYX0tFUk5FTF9TSVpFID0gMjA0ODtcXG5jb25zdCBpbnQgSVRFUkFUSU9OID0gTUFYX0tFUk5FTF9TSVpFIC0gMTtcXG5cXG4vLyBmbG9hdCBrZXJuZWxTaXplID0gbWluKGZsb2F0KHVLZXJuZWxTaXplKSwgZmxvYXQoTUFYX0tFUk5FTFNJWkUpKTtcXG5cXG4vLyBJbiByZWFsIHVzZS1jYXNlICwgdUtlcm5lbFNpemUgPCBNQVhfS0VSTkVMU0laRSBhbG1vc3QgYWx3YXlzLlxcbi8vIFNvIHVzZSB1S2VybmVsU2l6ZSBkaXJlY3RseS5cXG5mbG9hdCBrZXJuZWxTaXplID0gZmxvYXQodUtlcm5lbFNpemUpO1xcbmZsb2F0IGsgPSBrZXJuZWxTaXplIC0gMS4wO1xcblxcblxcbnZlYzIgY2VudGVyID0gdUNlbnRlci54eSAvIGZpbHRlckFyZWEueHk7XFxuZmxvYXQgYXNwZWN0ID0gZmlsdGVyQXJlYS55IC8gZmlsdGVyQXJlYS54O1xcblxcbmZsb2F0IGdyYWRpZW50ID0gdVJhZGl1cyAvIGZpbHRlckFyZWEueCAqIDAuMztcXG5mbG9hdCByYWRpdXMgPSB1UmFkaXVzIC8gZmlsdGVyQXJlYS54IC0gZ3JhZGllbnQgKiAwLjU7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBpZiAodUtlcm5lbFNpemUgPT0gMClcXG4gICAge1xcbiAgICAgICAgcmV0dXJuO1xcbiAgICB9XFxuXFxuICAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkO1xcblxcbiAgICB2ZWMyIGRpciA9IHZlYzIoY2VudGVyIC0gY29vcmQpO1xcbiAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKHZlYzIoZGlyLngsIGRpci55ICogYXNwZWN0KSk7XFxuXFxuICAgIGZsb2F0IHJhZGlhblN0ZXA7XFxuXFxuICAgIGlmIChyYWRpdXMgPj0gMC4wICYmIGRpc3QgPiByYWRpdXMpIHtcXG4gICAgICAgIGZsb2F0IGRlbHRhID0gZGlzdCAtIHJhZGl1cztcXG4gICAgICAgIGZsb2F0IGdhcCA9IGdyYWRpZW50O1xcbiAgICAgICAgZmxvYXQgc2NhbGUgPSAxLjAgLSBhYnMoZGVsdGEgLyBnYXApO1xcbiAgICAgICAgaWYgKHNjYWxlIDw9IDAuMCkge1xcbiAgICAgICAgICAgIHJldHVybjtcXG4gICAgICAgIH1cXG4gICAgICAgIHJhZGlhblN0ZXAgPSB1UmFkaWFuICogc2NhbGUgLyBrO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgICAgcmFkaWFuU3RlcCA9IHVSYWRpYW4gLyBrO1xcbiAgICB9XFxuXFxuICAgIGZsb2F0IHMgPSBzaW4ocmFkaWFuU3RlcCk7XFxuICAgIGZsb2F0IGMgPSBjb3MocmFkaWFuU3RlcCk7XFxuICAgIG1hdDIgcm90YXRpb25NYXRyaXggPSBtYXQyKHZlYzIoYywgLXMpLCB2ZWMyKHMsIGMpKTtcXG5cXG4gICAgZm9yKGludCBpID0gMDsgaSA8IElURVJBVElPTjsgaSsrKSB7XFxuICAgICAgICBpZiAoaSA9PSBpbnQoaykpIHtcXG4gICAgICAgICAgICBicmVhaztcXG4gICAgICAgIH1cXG5cXG4gICAgICAgIGNvb3JkIC09IGNlbnRlcjtcXG4gICAgICAgIGNvb3JkLnkgKj0gYXNwZWN0O1xcbiAgICAgICAgY29vcmQgPSByb3RhdGlvbk1hdHJpeCAqIGNvb3JkO1xcbiAgICAgICAgY29vcmQueSAvPSBhc3BlY3Q7XFxuICAgICAgICBjb29yZCArPSBjZW50ZXI7XFxuXFxuICAgICAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgY29vcmQpO1xcblxcbiAgICAgICAgLy8gc3dpdGNoIHRvIHByZS1tdWx0aXBsaWVkIGFscGhhIHRvIGNvcnJlY3RseSBibHVyIHRyYW5zcGFyZW50IGltYWdlc1xcbiAgICAgICAgLy8gc2FtcGxlLnJnYiAqPSBzYW1wbGUuYTtcXG5cXG4gICAgICAgIGdsX0ZyYWdDb2xvciArPSBzYW1wbGU7XFxuICAgIH1cXG4gICAgZ2xfRnJhZ0NvbG9yIC89IGtlcm5lbFNpemU7XFxufVxcblwiLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihyLGksbyxhKXt2b2lkIDA9PT1yJiYocj0wKSx2b2lkIDA9PT1pJiYoaT1bMCwwXSksdm9pZCAwPT09byYmKG89NSksdm9pZCAwPT09YSYmKGE9LTEpLGUuY2FsbCh0aGlzLG4sdCksdGhpcy5fYW5nbGU9MCx0aGlzLmFuZ2xlPXIsdGhpcy5jZW50ZXI9aSx0aGlzLmtlcm5lbFNpemU9byx0aGlzLnJhZGl1cz1hfWUmJihyLl9fcHJvdG9fXz1lKSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIGk9e2FuZ2xlOntjb25maWd1cmFibGU6ITB9LGNlbnRlcjp7Y29uZmlndXJhYmxlOiEwfSxyYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLG4sdCxyKXt0aGlzLnVuaWZvcm1zLnVLZXJuZWxTaXplPTAhPT10aGlzLl9hbmdsZT90aGlzLmtlcm5lbFNpemU6MCxlLmFwcGx5RmlsdGVyKHRoaXMsbix0LHIpfSxpLmFuZ2xlLnNldD1mdW5jdGlvbihlKXt0aGlzLl9hbmdsZT1lLHRoaXMudW5pZm9ybXMudVJhZGlhbj1lKk1hdGguUEkvMTgwfSxpLmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9hbmdsZX0saS5jZW50ZXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudUNlbnRlcn0saS5jZW50ZXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudUNlbnRlcj1lfSxpLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51UmFkaXVzfSxpLnJhZGl1cy5zZXQ9ZnVuY3Rpb24oZSl7KGU8MHx8ZT09PTEvMCkmJihlPS0xKSx0aGlzLnVuaWZvcm1zLnVSYWRpdXM9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsaSkscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5SYWRpYWxCbHVyRmlsdGVyPXIsZS5SYWRpYWxCbHVyRmlsdGVyPXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1yYWRpYWwtYmx1ci5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXJnYi1zcGxpdCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItcmdiLXNwbGl0IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUscil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/cihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0scik6cihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciByPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzIgcmVkO1xcbnVuaWZvcm0gdmVjMiBncmVlbjtcXG51bmlmb3JtIHZlYzIgYmx1ZTtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgZ2xfRnJhZ0NvbG9yLnIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyByZWQvZmlsdGVyQXJlYS54eSkucjtcXG4gICBnbF9GcmFnQ29sb3IuZyA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIGdyZWVuL2ZpbHRlckFyZWEueHkpLmc7XFxuICAgZ2xfRnJhZ0NvbG9yLmIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBibHVlL2ZpbHRlckFyZWEueHkpLmI7XFxuICAgZ2xfRnJhZ0NvbG9yLmEgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpLmE7XFxufVxcblwiLG49ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuLG8saSl7dm9pZCAwPT09biYmKG49Wy0xMCwwXSksdm9pZCAwPT09byYmKG89WzAsMTBdKSx2b2lkIDA9PT1pJiYoaT1bMCwwXSksZS5jYWxsKHRoaXMscix0KSx0aGlzLnJlZD1uLHRoaXMuZ3JlZW49byx0aGlzLmJsdWU9aX1lJiYobi5fX3Byb3RvX189ZSksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciBvPXtyZWQ6e2NvbmZpZ3VyYWJsZTohMH0sZ3JlZW46e2NvbmZpZ3VyYWJsZTohMH0sYmx1ZTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIG8ucmVkLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnJlZH0sby5yZWQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMucmVkPWV9LG8uZ3JlZW4uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZ3JlZW59LG8uZ3JlZW4uc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuZ3JlZW49ZX0sby5ibHVlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJsdWV9LG8uYmx1ZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5ibHVlPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLG8pLG59KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuUkdCU3BsaXRGaWx0ZXI9bixlLlJHQlNwbGl0RmlsdGVyPW4sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1yZ2Itc3BsaXQuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1zaG9ja3dhdmUgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXNob2Nrd2F2ZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixuPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckNsYW1wO1xcblxcbnVuaWZvcm0gdmVjMiBjZW50ZXI7XFxuXFxudW5pZm9ybSBmbG9hdCBhbXBsaXR1ZGU7XFxudW5pZm9ybSBmbG9hdCB3YXZlbGVuZ3RoO1xcbi8vIHVuaWZvcm0gZmxvYXQgcG93ZXI7XFxudW5pZm9ybSBmbG9hdCBicmlnaHRuZXNzO1xcbnVuaWZvcm0gZmxvYXQgc3BlZWQ7XFxudW5pZm9ybSBmbG9hdCByYWRpdXM7XFxuXFxudW5pZm9ybSBmbG9hdCB0aW1lO1xcblxcbmNvbnN0IGZsb2F0IFBJID0gMy4xNDE1OTtcXG5cXG52b2lkIG1haW4oKVxcbntcXG4gICAgZmxvYXQgaGFsZldhdmVsZW5ndGggPSB3YXZlbGVuZ3RoICogMC41IC8gZmlsdGVyQXJlYS54O1xcbiAgICBmbG9hdCBtYXhSYWRpdXMgPSByYWRpdXMgLyBmaWx0ZXJBcmVhLng7XFxuICAgIGZsb2F0IGN1cnJlbnRSYWRpdXMgPSB0aW1lICogc3BlZWQgLyBmaWx0ZXJBcmVhLng7XFxuXFxuICAgIGZsb2F0IGZhZGUgPSAxLjA7XFxuXFxuICAgIGlmIChtYXhSYWRpdXMgPiAwLjApIHtcXG4gICAgICAgIGlmIChjdXJyZW50UmFkaXVzID4gbWF4UmFkaXVzKSB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgICAgICAgICByZXR1cm47XFxuICAgICAgICB9XFxuICAgICAgICBmYWRlID0gMS4wIC0gcG93KGN1cnJlbnRSYWRpdXMgLyBtYXhSYWRpdXMsIDIuMCk7XFxuICAgIH1cXG5cXG4gICAgdmVjMiBkaXIgPSB2ZWMyKHZUZXh0dXJlQ29vcmQgLSBjZW50ZXIgLyBmaWx0ZXJBcmVhLnh5KTtcXG4gICAgZGlyLnkgKj0gZmlsdGVyQXJlYS55IC8gZmlsdGVyQXJlYS54O1xcbiAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKGRpcik7XFxuXFxuICAgIGlmIChkaXN0IDw9IDAuMCB8fCBkaXN0IDwgY3VycmVudFJhZGl1cyAtIGhhbGZXYXZlbGVuZ3RoIHx8IGRpc3QgPiBjdXJyZW50UmFkaXVzICsgaGFsZldhdmVsZW5ndGgpIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgdmVjMiBkaWZmVVYgPSBub3JtYWxpemUoZGlyKTtcXG5cXG4gICAgZmxvYXQgZGlmZiA9IChkaXN0IC0gY3VycmVudFJhZGl1cykgLyBoYWxmV2F2ZWxlbmd0aDtcXG5cXG4gICAgZmxvYXQgcCA9IDEuMCAtIHBvdyhhYnMoZGlmZiksIDIuMCk7XFxuXFxuICAgIC8vIGZsb2F0IHBvd0RpZmYgPSBkaWZmICogcG93KHAsIDIuMCkgKiAoIGFtcGxpdHVkZSAqIGZhZGUgKTtcXG4gICAgZmxvYXQgcG93RGlmZiA9IDEuMjUgKiBzaW4oZGlmZiAqIFBJKSAqIHAgKiAoIGFtcGxpdHVkZSAqIGZhZGUgKTtcXG5cXG4gICAgdmVjMiBvZmZzZXQgPSBkaWZmVVYgKiBwb3dEaWZmIC8gZmlsdGVyQXJlYS54eTtcXG5cXG4gICAgLy8gRG8gY2xhbXAgOlxcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCArIG9mZnNldDtcXG4gICAgdmVjMiBjbGFtcGVkQ29vcmQgPSBjbGFtcChjb29yZCwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjbGFtcGVkQ29vcmQpO1xcbiAgICBpZiAoY29vcmQgIT0gY2xhbXBlZENvb3JkKSB7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgKj0gbWF4KDAuMCwgMS4wIC0gbGVuZ3RoKGNvb3JkIC0gY2xhbXBlZENvb3JkKSk7XFxuICAgIH1cXG5cXG4gICAgLy8gTm8gY2xhbXAgOlxcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBvZmZzZXQpO1xcblxcbiAgICBnbF9GcmFnQ29sb3IucmdiICo9IDEuMCArIChicmlnaHRuZXNzIC0gMS4wKSAqIHAgKiBmYWRlO1xcbn1cXG5cIixyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHIocixpLG8pe3ZvaWQgMD09PXImJihyPVswLDBdKSx2b2lkIDA9PT1pJiYoaT17fSksdm9pZCAwPT09byYmKG89MCksZS5jYWxsKHRoaXMsdCxuKSx0aGlzLmNlbnRlcj1yLEFycmF5LmlzQXJyYXkoaSkmJihjb25zb2xlLndhcm4oXCJEZXByZWNhdGVkIFdhcm5pbmc6IFNob2Nrd2F2ZUZpbHRlciBwYXJhbXMgQXJyYXkgaGFzIGJlZW4gY2hhbmdlZCB0byBvcHRpb25zIE9iamVjdC5cIiksaT17fSksaT1PYmplY3QuYXNzaWduKHthbXBsaXR1ZGU6MzAsd2F2ZWxlbmd0aDoxNjAsYnJpZ2h0bmVzczoxLHNwZWVkOjUwMCxyYWRpdXM6LTF9LGkpLHRoaXMuYW1wbGl0dWRlPWkuYW1wbGl0dWRlLHRoaXMud2F2ZWxlbmd0aD1pLndhdmVsZW5ndGgsdGhpcy5icmlnaHRuZXNzPWkuYnJpZ2h0bmVzcyx0aGlzLnNwZWVkPWkuc3BlZWQsdGhpcy5yYWRpdXM9aS5yYWRpdXMsdGhpcy50aW1lPW99ZSYmKHIuX19wcm90b19fPWUpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgaT17Y2VudGVyOntjb25maWd1cmFibGU6ITB9LGFtcGxpdHVkZTp7Y29uZmlndXJhYmxlOiEwfSx3YXZlbGVuZ3RoOntjb25maWd1cmFibGU6ITB9LGJyaWdodG5lc3M6e2NvbmZpZ3VyYWJsZTohMH0sc3BlZWQ6e2NvbmZpZ3VyYWJsZTohMH0scmFkaXVzOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG4scil7dGhpcy51bmlmb3Jtcy50aW1lPXRoaXMudGltZSxlLmFwcGx5RmlsdGVyKHRoaXMsdCxuLHIpfSxpLmNlbnRlci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5jZW50ZXJ9LGkuY2VudGVyLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmNlbnRlcj1lfSxpLmFtcGxpdHVkZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbXBsaXR1ZGV9LGkuYW1wbGl0dWRlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmFtcGxpdHVkZT1lfSxpLndhdmVsZW5ndGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMud2F2ZWxlbmd0aH0saS53YXZlbGVuZ3RoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLndhdmVsZW5ndGg9ZX0saS5icmlnaHRuZXNzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJyaWdodG5lc3N9LGkuYnJpZ2h0bmVzcy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5icmlnaHRuZXNzPWV9LGkuc3BlZWQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc3BlZWR9LGkuc3BlZWQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuc3BlZWQ9ZX0saS5yYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucmFkaXVzfSxpLnJhZGl1cy5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5yYWRpdXM9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsaSkscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5TaG9ja3dhdmVGaWx0ZXI9cixlLlNob2Nrd2F2ZUZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItc2hvY2t3YXZlLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1zaW1wbGUtbGlnaHRtYXAgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsbz1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVMaWdodG1hcDtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzIgZGltZW5zaW9ucztcXG51bmlmb3JtIHZlYzQgYW1iaWVudENvbG9yO1xcbnZvaWQgbWFpbigpIHtcXG4gICAgdmVjNCBkaWZmdXNlQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWMyIGxpZ2h0Q29vcmQgPSAodlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHkpIC8gZGltZW5zaW9ucztcXG4gICAgdmVjNCBsaWdodCA9IHRleHR1cmUyRCh1TGlnaHRtYXAsIGxpZ2h0Q29vcmQpO1xcbiAgICB2ZWMzIGFtYmllbnQgPSBhbWJpZW50Q29sb3IucmdiICogYW1iaWVudENvbG9yLmE7XFxuICAgIHZlYzMgaW50ZW5zaXR5ID0gYW1iaWVudCArIGxpZ2h0LnJnYjtcXG4gICAgdmVjMyBmaW5hbENvbG9yID0gZGlmZnVzZUNvbG9yLnJnYiAqIGludGVuc2l0eTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChmaW5hbENvbG9yLCBkaWZmdXNlQ29sb3IuYSk7XFxufVxcblwiLGk9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gaShpLHIsbil7dm9pZCAwPT09ciYmKHI9MCksdm9pZCAwPT09biYmKG49MSksZS5jYWxsKHRoaXMsdCxvKSx0aGlzLnVuaWZvcm1zLmFtYmllbnRDb2xvcj1uZXcgRmxvYXQzMkFycmF5KFswLDAsMCxuXSksdGhpcy50ZXh0dXJlPWksdGhpcy5jb2xvcj1yfWUmJihpLl9fcHJvdG9fXz1lKSwoaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWk7dmFyIHI9e3RleHR1cmU6e2NvbmZpZ3VyYWJsZTohMH0sY29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sYWxwaGE6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsbyxpKXt0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMF09dC5zb3VyY2VGcmFtZS53aWR0aCx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMV09dC5zb3VyY2VGcmFtZS5oZWlnaHQsZS5hcHBseUZpbHRlcih0aGlzLHQsbyxpKX0sci50ZXh0dXJlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVMaWdodG1hcH0sci50ZXh0dXJlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnVMaWdodG1hcD1lfSxyLmNvbG9yLnNldD1mdW5jdGlvbihlKXt2YXIgdD10aGlzLnVuaWZvcm1zLmFtYmllbnRDb2xvcjtcIm51bWJlclwiPT10eXBlb2YgZT8oUElYSS51dGlscy5oZXgycmdiKGUsdCksdGhpcy5fY29sb3I9ZSk6KHRbMF09ZVswXSx0WzFdPWVbMV0sdFsyXT1lWzJdLHRbM109ZVszXSx0aGlzLl9jb2xvcj1QSVhJLnV0aWxzLnJnYjJoZXgodCkpfSxyLmNvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb2xvcn0sci5hbHBoYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbWJpZW50Q29sb3JbM119LHIuYWxwaGEuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYW1iaWVudENvbG9yWzNdPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGkucHJvdG90eXBlLHIpLGl9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuU2ltcGxlTGlnaHRtYXBGaWx0ZXI9aSxlLlNpbXBsZUxpZ2h0bWFwRmlsdGVyPWksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1zaW1wbGUtbGlnaHRtYXAuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci10aWx0LXNoaWZ0IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci10aWx0LXNoaWZ0IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKHQsaSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/aShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0saSk6aSh0Ll9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciBpPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLGU9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IGJsdXI7XFxudW5pZm9ybSBmbG9hdCBncmFkaWVudEJsdXI7XFxudW5pZm9ybSB2ZWMyIHN0YXJ0O1xcbnVuaWZvcm0gdmVjMiBlbmQ7XFxudW5pZm9ybSB2ZWMyIGRlbHRhO1xcbnVuaWZvcm0gdmVjMiB0ZXhTaXplO1xcblxcbmZsb2F0IHJhbmRvbSh2ZWMzIHNjYWxlLCBmbG9hdCBzZWVkKVxcbntcXG4gICAgcmV0dXJuIGZyYWN0KHNpbihkb3QoZ2xfRnJhZ0Nvb3JkLnh5eiArIHNlZWQsIHNjYWxlKSkgKiA0Mzc1OC41NDUzICsgc2VlZCk7XFxufVxcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgdmVjNCBjb2xvciA9IHZlYzQoMC4wKTtcXG4gICAgZmxvYXQgdG90YWwgPSAwLjA7XFxuXFxuICAgIGZsb2F0IG9mZnNldCA9IHJhbmRvbSh2ZWMzKDEyLjk4OTgsIDc4LjIzMywgMTUxLjcxODIpLCAwLjApO1xcbiAgICB2ZWMyIG5vcm1hbCA9IG5vcm1hbGl6ZSh2ZWMyKHN0YXJ0LnkgLSBlbmQueSwgZW5kLnggLSBzdGFydC54KSk7XFxuICAgIGZsb2F0IHJhZGl1cyA9IHNtb290aHN0ZXAoMC4wLCAxLjAsIGFicyhkb3QodlRleHR1cmVDb29yZCAqIHRleFNpemUgLSBzdGFydCwgbm9ybWFsKSkgLyBncmFkaWVudEJsdXIpICogYmx1cjtcXG5cXG4gICAgZm9yIChmbG9hdCB0ID0gLTMwLjA7IHQgPD0gMzAuMDsgdCsrKVxcbiAgICB7XFxuICAgICAgICBmbG9hdCBwZXJjZW50ID0gKHQgKyBvZmZzZXQgLSAwLjUpIC8gMzAuMDtcXG4gICAgICAgIGZsb2F0IHdlaWdodCA9IDEuMCAtIGFicyhwZXJjZW50KTtcXG4gICAgICAgIHZlYzQgc2FtcGxlID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgZGVsdGEgLyB0ZXhTaXplICogcGVyY2VudCAqIHJhZGl1cyk7XFxuICAgICAgICBzYW1wbGUucmdiICo9IHNhbXBsZS5hO1xcbiAgICAgICAgY29sb3IgKz0gc2FtcGxlICogd2VpZ2h0O1xcbiAgICAgICAgdG90YWwgKz0gd2VpZ2h0O1xcbiAgICB9XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yIC8gdG90YWw7XFxuICAgIGdsX0ZyYWdDb2xvci5yZ2IgLz0gZ2xfRnJhZ0NvbG9yLmEgKyAwLjAwMDAxO1xcbn1cXG5cIixyPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIHIocixuLG8sbCl7dm9pZCAwPT09ciYmKHI9MTAwKSx2b2lkIDA9PT1uJiYobj02MDApLHZvaWQgMD09PW8mJihvPW51bGwpLHZvaWQgMD09PWwmJihsPW51bGwpLHQuY2FsbCh0aGlzLGksZSksdGhpcy51bmlmb3Jtcy5ibHVyPXIsdGhpcy51bmlmb3Jtcy5ncmFkaWVudEJsdXI9bix0aGlzLnVuaWZvcm1zLnN0YXJ0PW98fG5ldyBQSVhJLlBvaW50KDAsd2luZG93LmlubmVySGVpZ2h0LzIpLHRoaXMudW5pZm9ybXMuZW5kPWx8fG5ldyBQSVhJLlBvaW50KDYwMCx3aW5kb3cuaW5uZXJIZWlnaHQvMiksdGhpcy51bmlmb3Jtcy5kZWx0YT1uZXcgUElYSS5Qb2ludCgzMCwzMCksdGhpcy51bmlmb3Jtcy50ZXhTaXplPW5ldyBQSVhJLlBvaW50KHdpbmRvdy5pbm5lcldpZHRoLHdpbmRvdy5pbm5lckhlaWdodCksdGhpcy51cGRhdGVEZWx0YSgpfXQmJihyLl9fcHJvdG9fXz10KSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIG49e2JsdXI6e2NvbmZpZ3VyYWJsZTohMH0sZ3JhZGllbnRCbHVyOntjb25maWd1cmFibGU6ITB9LHN0YXJ0Ontjb25maWd1cmFibGU6ITB9LGVuZDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIucHJvdG90eXBlLnVwZGF0ZURlbHRhPWZ1bmN0aW9uKCl7dGhpcy51bmlmb3Jtcy5kZWx0YS54PTAsdGhpcy51bmlmb3Jtcy5kZWx0YS55PTB9LG4uYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ibHVyfSxuLmJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudW5pZm9ybXMuYmx1cj10fSxuLmdyYWRpZW50Qmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ncmFkaWVudEJsdXJ9LG4uZ3JhZGllbnRCbHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLnVuaWZvcm1zLmdyYWRpZW50Qmx1cj10fSxuLnN0YXJ0LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnN0YXJ0fSxuLnN0YXJ0LnNldD1mdW5jdGlvbih0KXt0aGlzLnVuaWZvcm1zLnN0YXJ0PXQsdGhpcy51cGRhdGVEZWx0YSgpfSxuLmVuZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5lbmR9LG4uZW5kLnNldD1mdW5jdGlvbih0KXt0aGlzLnVuaWZvcm1zLmVuZD10LHRoaXMudXBkYXRlRGVsdGEoKX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsbikscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5UaWx0U2hpZnRBeGlzRmlsdGVyPXI7dmFyIG49ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaSgpe3QuYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiB0JiYoaS5fX3Byb3RvX189dCksaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSksaS5wcm90b3R5cGUuY29uc3RydWN0b3I9aSxpLnByb3RvdHlwZS51cGRhdGVEZWx0YT1mdW5jdGlvbigpe3ZhciB0PXRoaXMudW5pZm9ybXMuZW5kLngtdGhpcy51bmlmb3Jtcy5zdGFydC54LGk9dGhpcy51bmlmb3Jtcy5lbmQueS10aGlzLnVuaWZvcm1zLnN0YXJ0LnksZT1NYXRoLnNxcnQodCp0K2kqaSk7dGhpcy51bmlmb3Jtcy5kZWx0YS54PXQvZSx0aGlzLnVuaWZvcm1zLmRlbHRhLnk9aS9lfSxpfShyKTtQSVhJLmZpbHRlcnMuVGlsdFNoaWZ0WEZpbHRlcj1uO3ZhciBvPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGkoKXt0LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gdCYmKGkuX19wcm90b19fPXQpLGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpLGkucHJvdG90eXBlLmNvbnN0cnVjdG9yPWksaS5wcm90b3R5cGUudXBkYXRlRGVsdGE9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnVuaWZvcm1zLmVuZC54LXRoaXMudW5pZm9ybXMuc3RhcnQueCxpPXRoaXMudW5pZm9ybXMuZW5kLnktdGhpcy51bmlmb3Jtcy5zdGFydC55LGU9TWF0aC5zcXJ0KHQqdCtpKmkpO3RoaXMudW5pZm9ybXMuZGVsdGEueD0taS9lLHRoaXMudW5pZm9ybXMuZGVsdGEueT10L2V9LGl9KHIpO1BJWEkuZmlsdGVycy5UaWx0U2hpZnRZRmlsdGVyPW87dmFyIGw9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaShpLGUscixsKXt2b2lkIDA9PT1pJiYoaT0xMDApLHZvaWQgMD09PWUmJihlPTYwMCksdm9pZCAwPT09ciYmKHI9bnVsbCksdm9pZCAwPT09bCYmKGw9bnVsbCksdC5jYWxsKHRoaXMpLHRoaXMudGlsdFNoaWZ0WEZpbHRlcj1uZXcgbihpLGUscixsKSx0aGlzLnRpbHRTaGlmdFlGaWx0ZXI9bmV3IG8oaSxlLHIsbCl9dCYmKGkuX19wcm90b19fPXQpLChpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9aTt2YXIgZT17Ymx1cjp7Y29uZmlndXJhYmxlOiEwfSxncmFkaWVudEJsdXI6e2NvbmZpZ3VyYWJsZTohMH0sc3RhcnQ6e2NvbmZpZ3VyYWJsZTohMH0sZW5kOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24odCxpLGUpe3ZhciByPXQuZ2V0UmVuZGVyVGFyZ2V0KCEwKTt0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuYXBwbHkodCxpLHIpLHRoaXMudGlsdFNoaWZ0WUZpbHRlci5hcHBseSh0LHIsZSksdC5yZXR1cm5SZW5kZXJUYXJnZXQocil9LGUuYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aWx0U2hpZnRYRmlsdGVyLmJsdXJ9LGUuYmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy50aWx0U2hpZnRYRmlsdGVyLmJsdXI9dGhpcy50aWx0U2hpZnRZRmlsdGVyLmJsdXI9dH0sZS5ncmFkaWVudEJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlsdFNoaWZ0WEZpbHRlci5ncmFkaWVudEJsdXJ9LGUuZ3JhZGllbnRCbHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuZ3JhZGllbnRCbHVyPXRoaXMudGlsdFNoaWZ0WUZpbHRlci5ncmFkaWVudEJsdXI9dH0sZS5zdGFydC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aWx0U2hpZnRYRmlsdGVyLnN0YXJ0fSxlLnN0YXJ0LnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuc3RhcnQ9dGhpcy50aWx0U2hpZnRZRmlsdGVyLnN0YXJ0PXR9LGUuZW5kLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuZW5kfSxlLmVuZC5zZXQ9ZnVuY3Rpb24odCl7dGhpcy50aWx0U2hpZnRYRmlsdGVyLmVuZD10aGlzLnRpbHRTaGlmdFlGaWx0ZXIuZW5kPXR9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGkucHJvdG90eXBlLGUpLGl9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuVGlsdFNoaWZ0RmlsdGVyPWwsdC5UaWx0U2hpZnRGaWx0ZXI9bCx0LlRpbHRTaGlmdFhGaWx0ZXI9bix0LlRpbHRTaGlmdFlGaWx0ZXI9byx0LlRpbHRTaGlmdEF4aXNGaWx0ZXI9cixPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXRpbHQtc2hpZnQuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci10d2lzdCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItdHdpc3QgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obyxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKG8uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgcmFkaXVzO1xcbnVuaWZvcm0gZmxvYXQgYW5nbGU7XFxudW5pZm9ybSB2ZWMyIG9mZnNldDtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG52ZWMyIG1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkICo9IGZpbHRlckFyZWEueHk7XFxuICAgIGNvb3JkICs9IGZpbHRlckFyZWEuenc7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB1bm1hcENvb3JkKCB2ZWMyIGNvb3JkIClcXG57XFxuICAgIGNvb3JkIC09IGZpbHRlckFyZWEuenc7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudmVjMiB0d2lzdCh2ZWMyIGNvb3JkKVxcbntcXG4gICAgY29vcmQgLT0gb2Zmc2V0O1xcblxcbiAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKGNvb3JkKTtcXG5cXG4gICAgaWYgKGRpc3QgPCByYWRpdXMpXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IHJhdGlvRGlzdCA9IChyYWRpdXMgLSBkaXN0KSAvIHJhZGl1cztcXG4gICAgICAgIGZsb2F0IGFuZ2xlTW9kID0gcmF0aW9EaXN0ICogcmF0aW9EaXN0ICogYW5nbGU7XFxuICAgICAgICBmbG9hdCBzID0gc2luKGFuZ2xlTW9kKTtcXG4gICAgICAgIGZsb2F0IGMgPSBjb3MoYW5nbGVNb2QpO1xcbiAgICAgICAgY29vcmQgPSB2ZWMyKGNvb3JkLnggKiBjIC0gY29vcmQueSAqIHMsIGNvb3JkLnggKiBzICsgY29vcmQueSAqIGMpO1xcbiAgICB9XFxuXFxuICAgIGNvb3JkICs9IG9mZnNldDtcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuXFxuICAgIHZlYzIgY29vcmQgPSBtYXBDb29yZCh2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgY29vcmQgPSB0d2lzdChjb29yZCk7XFxuXFxuICAgIGNvb3JkID0gdW5tYXBDb29yZChjb29yZCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY29vcmQgKTtcXG5cXG59XFxuXCIsZT1mdW5jdGlvbihvKXtmdW5jdGlvbiBlKGUsdCxpKXt2b2lkIDA9PT1lJiYoZT0yMDApLHZvaWQgMD09PXQmJih0PTQpLHZvaWQgMD09PWkmJihpPTIwKSxvLmNhbGwodGhpcyxuLHIpLHRoaXMucmFkaXVzPWUsdGhpcy5hbmdsZT10LHRoaXMucGFkZGluZz1pfW8mJihlLl9fcHJvdG9fXz1vKSwoZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShvJiZvLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWU7dmFyIHQ9e29mZnNldDp7Y29uZmlndXJhYmxlOiEwfSxyYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH0sYW5nbGU6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiB0Lm9mZnNldC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5vZmZzZXR9LHQub2Zmc2V0LnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLm9mZnNldD1vfSx0LnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5yYWRpdXN9LHQucmFkaXVzLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLnJhZGl1cz1vfSx0LmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmFuZ2xlfSx0LmFuZ2xlLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLmFuZ2xlPW99LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGUucHJvdG90eXBlLHQpLGV9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuVHdpc3RGaWx0ZXI9ZSxvLlR3aXN0RmlsdGVyPWUsT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci10d2lzdC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXpvb20tYmx1ciAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItem9vbS1ibHVyIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG4sZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZShuLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG4pe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG51bmlmb3JtIHZlYzIgdUNlbnRlcjtcXG51bmlmb3JtIGZsb2F0IHVTdHJlbmd0aDtcXG51bmlmb3JtIGZsb2F0IHVJbm5lclJhZGl1cztcXG51bmlmb3JtIGZsb2F0IHVSYWRpdXM7XFxuXFxuY29uc3QgZmxvYXQgTUFYX0tFUk5FTF9TSVpFID0gMzIuMDtcXG5cXG5mbG9hdCByYW5kb20odmVjMyBzY2FsZSwgZmxvYXQgc2VlZCkge1xcbiAgICAvLyB1c2UgdGhlIGZyYWdtZW50IHBvc2l0aW9uIGZvciBhIGRpZmZlcmVudCBzZWVkIHBlci1waXhlbFxcbiAgICByZXR1cm4gZnJhY3Qoc2luKGRvdChnbF9GcmFnQ29vcmQueHl6ICsgc2VlZCwgc2NhbGUpKSAqIDQzNzU4LjU0NTMgKyBzZWVkKTtcXG59XFxuXFxudm9pZCBtYWluKCkge1xcblxcbiAgICBmbG9hdCBtaW5HcmFkaWVudCA9IHVJbm5lclJhZGl1cyAqIDAuMztcXG4gICAgZmxvYXQgaW5uZXJSYWRpdXMgPSAodUlubmVyUmFkaXVzICsgbWluR3JhZGllbnQgKiAwLjUpIC8gZmlsdGVyQXJlYS54O1xcblxcbiAgICBmbG9hdCBncmFkaWVudCA9IHVSYWRpdXMgKiAwLjM7XFxuICAgIGZsb2F0IHJhZGl1cyA9ICh1UmFkaXVzIC0gZ3JhZGllbnQgKiAwLjUpIC8gZmlsdGVyQXJlYS54O1xcblxcbiAgICBmbG9hdCBjb3VudExpbWl0ID0gTUFYX0tFUk5FTF9TSVpFO1xcblxcbiAgICB2ZWMyIGRpciA9IHZlYzIodUNlbnRlci54eSAvIGZpbHRlckFyZWEueHkgLSB2VGV4dHVyZUNvb3JkKTtcXG4gICAgZmxvYXQgZGlzdCA9IGxlbmd0aCh2ZWMyKGRpci54LCBkaXIueSAqIGZpbHRlckFyZWEueSAvIGZpbHRlckFyZWEueCkpO1xcblxcbiAgICBmbG9hdCBzdHJlbmd0aCA9IHVTdHJlbmd0aDtcXG5cXG4gICAgZmxvYXQgZGVsdGEgPSAwLjA7XFxuICAgIGZsb2F0IGdhcDtcXG4gICAgaWYgKGRpc3QgPCBpbm5lclJhZGl1cykge1xcbiAgICAgICAgZGVsdGEgPSBpbm5lclJhZGl1cyAtIGRpc3Q7XFxuICAgICAgICBnYXAgPSBtaW5HcmFkaWVudDtcXG4gICAgfSBlbHNlIGlmIChyYWRpdXMgPj0gMC4wICYmIGRpc3QgPiByYWRpdXMpIHsgLy8gcmFkaXVzIDwgMCBtZWFucyBpdCdzIGluZmluaXR5XFxuICAgICAgICBkZWx0YSA9IGRpc3QgLSByYWRpdXM7XFxuICAgICAgICBnYXAgPSBncmFkaWVudDtcXG4gICAgfVxcblxcbiAgICBpZiAoZGVsdGEgPiAwLjApIHtcXG4gICAgICAgIGZsb2F0IG5vcm1hbENvdW50ID0gZ2FwIC8gZmlsdGVyQXJlYS54O1xcbiAgICAgICAgZGVsdGEgPSAobm9ybWFsQ291bnQgLSBkZWx0YSkgLyBub3JtYWxDb3VudDtcXG4gICAgICAgIGNvdW50TGltaXQgKj0gZGVsdGE7XFxuICAgICAgICBzdHJlbmd0aCAqPSBkZWx0YTtcXG4gICAgICAgIGlmIChjb3VudExpbWl0IDwgMS4wKVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgICAgICAgICAgcmV0dXJuO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIC8vIHJhbmRvbWl6ZSB0aGUgbG9va3VwIHZhbHVlcyB0byBoaWRlIHRoZSBmaXhlZCBudW1iZXIgb2Ygc2FtcGxlc1xcbiAgICBmbG9hdCBvZmZzZXQgPSByYW5kb20odmVjMygxMi45ODk4LCA3OC4yMzMsIDE1MS43MTgyKSwgMC4wKTtcXG5cXG4gICAgZmxvYXQgdG90YWwgPSAwLjA7XFxuICAgIHZlYzQgY29sb3IgPSB2ZWM0KDAuMCk7XFxuXFxuICAgIGRpciAqPSBzdHJlbmd0aDtcXG5cXG4gICAgZm9yIChmbG9hdCB0ID0gMC4wOyB0IDwgTUFYX0tFUk5FTF9TSVpFOyB0KyspIHtcXG4gICAgICAgIGZsb2F0IHBlcmNlbnQgPSAodCArIG9mZnNldCkgLyBNQVhfS0VSTkVMX1NJWkU7XFxuICAgICAgICBmbG9hdCB3ZWlnaHQgPSA0LjAgKiAocGVyY2VudCAtIHBlcmNlbnQgKiBwZXJjZW50KTtcXG4gICAgICAgIHZlYzIgcCA9IHZUZXh0dXJlQ29vcmQgKyBkaXIgKiBwZXJjZW50O1xcbiAgICAgICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHApO1xcblxcbiAgICAgICAgLy8gc3dpdGNoIHRvIHByZS1tdWx0aXBsaWVkIGFscGhhIHRvIGNvcnJlY3RseSBibHVyIHRyYW5zcGFyZW50IGltYWdlc1xcbiAgICAgICAgLy8gc2FtcGxlLnJnYiAqPSBzYW1wbGUuYTtcXG5cXG4gICAgICAgIGNvbG9yICs9IHNhbXBsZSAqIHdlaWdodDtcXG4gICAgICAgIHRvdGFsICs9IHdlaWdodDtcXG5cXG4gICAgICAgIGlmICh0ID4gY291bnRMaW1pdCl7XFxuICAgICAgICAgICAgYnJlYWs7XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gY29sb3IgLyB0b3RhbDtcXG5cXG4gICAgLy8gc3dpdGNoIGJhY2sgZnJvbSBwcmUtbXVsdGlwbGllZCBhbHBoYVxcbiAgICBnbF9GcmFnQ29sb3IucmdiIC89IGdsX0ZyYWdDb2xvci5hICsgMC4wMDAwMTtcXG5cXG59XFxuXCIscj1mdW5jdGlvbihuKXtmdW5jdGlvbiByKHIsaSxvLGEpe3ZvaWQgMD09PXImJihyPS4xKSx2b2lkIDA9PT1pJiYoaT1bMCwwXSksdm9pZCAwPT09byYmKG89MCksdm9pZCAwPT09YSYmKGE9LTEpLG4uY2FsbCh0aGlzLGUsdCksdGhpcy5jZW50ZXI9aSx0aGlzLnN0cmVuZ3RoPXIsdGhpcy5pbm5lclJhZGl1cz1vLHRoaXMucmFkaXVzPWF9biYmKHIuX19wcm90b19fPW4pLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG4mJm4ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgaT17Y2VudGVyOntjb25maWd1cmFibGU6ITB9LHN0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9LGlubmVyUmFkaXVzOntjb25maWd1cmFibGU6ITB9LHJhZGl1czp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkuY2VudGVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVDZW50ZXJ9LGkuY2VudGVyLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnVDZW50ZXI9bn0saS5zdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51U3RyZW5ndGh9LGkuc3RyZW5ndGguc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudVN0cmVuZ3RoPW59LGkuaW5uZXJSYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudUlubmVyUmFkaXVzfSxpLmlubmVyUmFkaXVzLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnVJbm5lclJhZGl1cz1ufSxpLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51UmFkaXVzfSxpLnJhZGl1cy5zZXQ9ZnVuY3Rpb24obil7KG48MHx8bj09PTEvMCkmJihuPS0xKSx0aGlzLnVuaWZvcm1zLnVSYWRpdXM9bn0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsaSkscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5ab29tQmx1ckZpbHRlcj1yLG4uWm9vbUJsdXJGaWx0ZXI9cixPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXpvb20tYmx1ci5qcy5tYXBcbiIsIi8qIVxuICogcGl4aS1maWx0ZXJzIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIHBpeGktZmlsdGVycyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cblwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBmaWx0ZXJBZHZhbmNlZEJsb29tPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItYWR2YW5jZWQtYmxvb21cIiksZmlsdGVyQXNjaWk9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1hc2NpaVwiKSxmaWx0ZXJCbG9vbT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWJsb29tXCIpLGZpbHRlckJ1bGdlUGluY2g9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1idWxnZS1waW5jaFwiKSxmaWx0ZXJDb2xvclJlcGxhY2U9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1jb2xvci1yZXBsYWNlXCIpLGZpbHRlckNvbnZvbHV0aW9uPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItY29udm9sdXRpb25cIiksZmlsdGVyQ3Jvc3NIYXRjaD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWNyb3NzLWhhdGNoXCIpLGZpbHRlckRvdD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWRvdFwiKSxmaWx0ZXJEcm9wU2hhZG93PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItZHJvcC1zaGFkb3dcIiksZmlsdGVyRW1ib3NzPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItZW1ib3NzXCIpLGZpbHRlckdsb3c9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1nbG93XCIpLGZpbHRlckdvZHJheT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWdvZHJheVwiKSxmaWx0ZXJNb3Rpb25CbHVyPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItbW90aW9uLWJsdXJcIiksZmlsdGVyTXVsdGlDb2xvclJlcGxhY2U9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1tdWx0aS1jb2xvci1yZXBsYWNlXCIpLGZpbHRlck9sZEZpbG09cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1vbGQtZmlsbVwiKSxmaWx0ZXJPdXRsaW5lPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItb3V0bGluZVwiKSxmaWx0ZXJQaXhlbGF0ZT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXBpeGVsYXRlXCIpLGZpbHRlclJnYlNwbGl0PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItcmdiLXNwbGl0XCIpLGZpbHRlclJhZGlhbEJsdXI9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1yYWRpYWwtYmx1clwiKSxmaWx0ZXJTaG9ja3dhdmU9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1zaG9ja3dhdmVcIiksZmlsdGVyU2ltcGxlTGlnaHRtYXA9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1zaW1wbGUtbGlnaHRtYXBcIiksZmlsdGVyVGlsdFNoaWZ0PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItdGlsdC1zaGlmdFwiKSxmaWx0ZXJUd2lzdD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXR3aXN0XCIpLGZpbHRlclpvb21CbHVyPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItem9vbS1ibHVyXCIpO2V4cG9ydHMuQWR2YW5jZWRCbG9vbUZpbHRlcj1maWx0ZXJBZHZhbmNlZEJsb29tLkFkdmFuY2VkQmxvb21GaWx0ZXIsZXhwb3J0cy5Bc2NpaUZpbHRlcj1maWx0ZXJBc2NpaS5Bc2NpaUZpbHRlcixleHBvcnRzLkJsb29tRmlsdGVyPWZpbHRlckJsb29tLkJsb29tRmlsdGVyLGV4cG9ydHMuQnVsZ2VQaW5jaEZpbHRlcj1maWx0ZXJCdWxnZVBpbmNoLkJ1bGdlUGluY2hGaWx0ZXIsZXhwb3J0cy5Db2xvclJlcGxhY2VGaWx0ZXI9ZmlsdGVyQ29sb3JSZXBsYWNlLkNvbG9yUmVwbGFjZUZpbHRlcixleHBvcnRzLkNvbnZvbHV0aW9uRmlsdGVyPWZpbHRlckNvbnZvbHV0aW9uLkNvbnZvbHV0aW9uRmlsdGVyLGV4cG9ydHMuQ3Jvc3NIYXRjaEZpbHRlcj1maWx0ZXJDcm9zc0hhdGNoLkNyb3NzSGF0Y2hGaWx0ZXIsZXhwb3J0cy5Eb3RGaWx0ZXI9ZmlsdGVyRG90LkRvdEZpbHRlcixleHBvcnRzLkRyb3BTaGFkb3dGaWx0ZXI9ZmlsdGVyRHJvcFNoYWRvdy5Ecm9wU2hhZG93RmlsdGVyLGV4cG9ydHMuRW1ib3NzRmlsdGVyPWZpbHRlckVtYm9zcy5FbWJvc3NGaWx0ZXIsZXhwb3J0cy5HbG93RmlsdGVyPWZpbHRlckdsb3cuR2xvd0ZpbHRlcixleHBvcnRzLkdvZHJheUZpbHRlcj1maWx0ZXJHb2RyYXkuR29kcmF5RmlsdGVyLGV4cG9ydHMuTW90aW9uQmx1ckZpbHRlcj1maWx0ZXJNb3Rpb25CbHVyLk1vdGlvbkJsdXJGaWx0ZXIsZXhwb3J0cy5NdWx0aUNvbG9yUmVwbGFjZUZpbHRlcj1maWx0ZXJNdWx0aUNvbG9yUmVwbGFjZS5NdWx0aUNvbG9yUmVwbGFjZUZpbHRlcixleHBvcnRzLk9sZEZpbG1GaWx0ZXI9ZmlsdGVyT2xkRmlsbS5PbGRGaWxtRmlsdGVyLGV4cG9ydHMuT3V0bGluZUZpbHRlcj1maWx0ZXJPdXRsaW5lLk91dGxpbmVGaWx0ZXIsZXhwb3J0cy5QaXhlbGF0ZUZpbHRlcj1maWx0ZXJQaXhlbGF0ZS5QaXhlbGF0ZUZpbHRlcixleHBvcnRzLlJHQlNwbGl0RmlsdGVyPWZpbHRlclJnYlNwbGl0LlJHQlNwbGl0RmlsdGVyLGV4cG9ydHMuUmFkaWFsQmx1ckZpbHRlcj1maWx0ZXJSYWRpYWxCbHVyLlJhZGlhbEJsdXJGaWx0ZXIsZXhwb3J0cy5TaG9ja3dhdmVGaWx0ZXI9ZmlsdGVyU2hvY2t3YXZlLlNob2Nrd2F2ZUZpbHRlcixleHBvcnRzLlNpbXBsZUxpZ2h0bWFwRmlsdGVyPWZpbHRlclNpbXBsZUxpZ2h0bWFwLlNpbXBsZUxpZ2h0bWFwRmlsdGVyLGV4cG9ydHMuVGlsdFNoaWZ0RmlsdGVyPWZpbHRlclRpbHRTaGlmdC5UaWx0U2hpZnRGaWx0ZXIsZXhwb3J0cy5UaWx0U2hpZnRBeGlzRmlsdGVyPWZpbHRlclRpbHRTaGlmdC5UaWx0U2hpZnRBeGlzRmlsdGVyLGV4cG9ydHMuVGlsdFNoaWZ0WEZpbHRlcj1maWx0ZXJUaWx0U2hpZnQuVGlsdFNoaWZ0WEZpbHRlcixleHBvcnRzLlRpbHRTaGlmdFlGaWx0ZXI9ZmlsdGVyVGlsdFNoaWZ0LlRpbHRTaGlmdFlGaWx0ZXIsZXhwb3J0cy5Ud2lzdEZpbHRlcj1maWx0ZXJUd2lzdC5Ud2lzdEZpbHRlcixleHBvcnRzLlpvb21CbHVyRmlsdGVyPWZpbHRlclpvb21CbHVyLlpvb21CbHVyRmlsdGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS1maWx0ZXJzLmpzLm1hcFxuIiwiLyohXG4gKiBwaXhpLXBhcnRpY2xlcyAtIHYyLjEuOVxuICogQ29tcGlsZWQgVGh1LCAxNiBOb3YgMjAxNyAwMTo1MjozOSBVVENcbiAqXG4gKiBwaXhpLXBhcnRpY2xlcyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbih0KXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz10KCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLHQpO2Vsc2V7dmFyIGk7aT1cInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOnRoaXMsaS5waXhpUGFydGljbGVzPXQoKX19KGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uIHQoaSxlLHMpe2Z1bmN0aW9uIGEobixvKXtpZighZVtuXSl7aWYoIWlbbl0pe3ZhciBoPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIW8mJmgpcmV0dXJuIGgobiwhMCk7aWYocilyZXR1cm4gcihuLCEwKTt2YXIgbD1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK24rXCInXCIpO3Rocm93IGwuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixsfXZhciBwPWVbbl09e2V4cG9ydHM6e319O2lbbl1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24odCl7dmFyIGU9aVtuXVsxXVt0XTtyZXR1cm4gYShlP2U6dCl9LHAscC5leHBvcnRzLHQsaSxlLHMpfXJldHVybiBlW25dLmV4cG9ydHN9Zm9yKHZhciByPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsbj0wO248cy5sZW5ndGg7bisrKWEoc1tuXSk7cmV0dXJuIGF9KHsxOltmdW5jdGlvbih0LGksZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHM9dChcIi4vUGFydGljbGVVdGlsc1wiKSxhPXQoXCIuL1BhcnRpY2xlXCIpLHI9UElYSS5UZXh0dXJlLG49ZnVuY3Rpb24odCl7YS5jYWxsKHRoaXMsdCksdGhpcy50ZXh0dXJlcz1udWxsLHRoaXMuZHVyYXRpb249MCx0aGlzLmZyYW1lcmF0ZT0wLHRoaXMuZWxhcHNlZD0wLHRoaXMubG9vcD0hMX0sbz1hLnByb3RvdHlwZSxoPW4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobyk7aC5pbml0PWZ1bmN0aW9uKCl7dGhpcy5QYXJ0aWNsZV9pbml0KCksdGhpcy5lbGFwc2VkPTAsdGhpcy5mcmFtZXJhdGU8MCYmKHRoaXMuZHVyYXRpb249dGhpcy5tYXhMaWZlLHRoaXMuZnJhbWVyYXRlPXRoaXMudGV4dHVyZXMubGVuZ3RoL3RoaXMuZHVyYXRpb24pfSxoLmFwcGx5QXJ0PWZ1bmN0aW9uKHQpe3RoaXMudGV4dHVyZXM9dC50ZXh0dXJlcyx0aGlzLmZyYW1lcmF0ZT10LmZyYW1lcmF0ZSx0aGlzLmR1cmF0aW9uPXQuZHVyYXRpb24sdGhpcy5sb29wPXQubG9vcH0saC51cGRhdGU9ZnVuY3Rpb24odCl7aWYodGhpcy5QYXJ0aWNsZV91cGRhdGUodCk+PTApe3RoaXMuZWxhcHNlZCs9dCx0aGlzLmVsYXBzZWQ+dGhpcy5kdXJhdGlvbiYmKHRoaXMubG9vcD90aGlzLmVsYXBzZWQ9dGhpcy5lbGFwc2VkJXRoaXMuZHVyYXRpb246dGhpcy5lbGFwc2VkPXRoaXMuZHVyYXRpb24tMWUtNik7dmFyIGk9dGhpcy5lbGFwc2VkKnRoaXMuZnJhbWVyYXRlKzFlLTd8MDt0aGlzLnRleHR1cmU9dGhpcy50ZXh0dXJlc1tpXXx8cy5FTVBUWV9URVhUVVJFfX0saC5QYXJ0aWNsZV9kZXN0cm95PWEucHJvdG90eXBlLmRlc3Ryb3ksaC5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5QYXJ0aWNsZV9kZXN0cm95KCksdGhpcy50ZXh0dXJlcz1udWxsfSxuLnBhcnNlQXJ0PWZ1bmN0aW9uKHQpe3ZhciBpLGUscyxhLG4sbyxoPVtdO2ZvcihpPTA7aTx0Lmxlbmd0aDsrK2kpe2ZvcihlPXRbaV0sdFtpXT1oPXt9LGgudGV4dHVyZXM9bz1bXSxhPWUudGV4dHVyZXMscz0wO3M8YS5sZW5ndGg7KytzKWlmKG49YVtzXSxcInN0cmluZ1wiPT10eXBlb2YgbilvLnB1c2goci5mcm9tSW1hZ2UobikpO2Vsc2UgaWYobiBpbnN0YW5jZW9mIHIpby5wdXNoKG4pO2Vsc2V7dmFyIGw9bi5jb3VudHx8MTtmb3Iobj1cInN0cmluZ1wiPT10eXBlb2Ygbi50ZXh0dXJlP3IuZnJvbUltYWdlKG4udGV4dHVyZSk6bi50ZXh0dXJlO2w+MDstLWwpby5wdXNoKG4pfVwibWF0Y2hMaWZlXCI9PWUuZnJhbWVyYXRlPyhoLmZyYW1lcmF0ZT0tMSxoLmR1cmF0aW9uPTAsaC5sb29wPSExKTooaC5sb29wPSEhZS5sb29wLGguZnJhbWVyYXRlPWUuZnJhbWVyYXRlPjA/ZS5mcmFtZXJhdGU6NjAsaC5kdXJhdGlvbj1vLmxlbmd0aC9oLmZyYW1lcmF0ZSl9cmV0dXJuIHR9LGkuZXhwb3J0cz1ufSx7XCIuL1BhcnRpY2xlXCI6MyxcIi4vUGFydGljbGVVdGlsc1wiOjR9XSwyOltmdW5jdGlvbih0LGksZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHM9dChcIi4vUGFydGljbGVVdGlsc1wiKSxhPXQoXCIuL1BhcnRpY2xlXCIpLHI9UElYSS5wYXJ0aWNsZXMuUGFydGljbGVDb250YWluZXJ8fFBJWEkuUGFydGljbGVDb250YWluZXIsbj1QSVhJLnRpY2tlci5zaGFyZWQsbz1mdW5jdGlvbih0LGksZSl7dGhpcy5fcGFydGljbGVDb25zdHJ1Y3Rvcj1hLHRoaXMucGFydGljbGVJbWFnZXM9bnVsbCx0aGlzLnN0YXJ0QWxwaGE9MSx0aGlzLmVuZEFscGhhPTEsdGhpcy5zdGFydFNwZWVkPTAsdGhpcy5lbmRTcGVlZD0wLHRoaXMubWluaW11bVNwZWVkTXVsdGlwbGllcj0xLHRoaXMuYWNjZWxlcmF0aW9uPW51bGwsdGhpcy5tYXhTcGVlZD1OYU4sdGhpcy5zdGFydFNjYWxlPTEsdGhpcy5lbmRTY2FsZT0xLHRoaXMubWluaW11bVNjYWxlTXVsdGlwbGllcj0xLHRoaXMuc3RhcnRDb2xvcj1udWxsLHRoaXMuZW5kQ29sb3I9bnVsbCx0aGlzLm1pbkxpZmV0aW1lPTAsdGhpcy5tYXhMaWZldGltZT0wLHRoaXMubWluU3RhcnRSb3RhdGlvbj0wLHRoaXMubWF4U3RhcnRSb3RhdGlvbj0wLHRoaXMubm9Sb3RhdGlvbj0hMSx0aGlzLm1pblJvdGF0aW9uU3BlZWQ9MCx0aGlzLm1heFJvdGF0aW9uU3BlZWQ9MCx0aGlzLnBhcnRpY2xlQmxlbmRNb2RlPTAsdGhpcy5jdXN0b21FYXNlPW51bGwsdGhpcy5leHRyYURhdGE9bnVsbCx0aGlzLl9mcmVxdWVuY3k9MSx0aGlzLm1heFBhcnRpY2xlcz0xZTMsdGhpcy5lbWl0dGVyTGlmZXRpbWU9LTEsdGhpcy5zcGF3blBvcz1udWxsLHRoaXMuc3Bhd25UeXBlPW51bGwsdGhpcy5fc3Bhd25GdW5jPW51bGwsdGhpcy5zcGF3blJlY3Q9bnVsbCx0aGlzLnNwYXduQ2lyY2xlPW51bGwsdGhpcy5wYXJ0aWNsZXNQZXJXYXZlPTEsdGhpcy5wYXJ0aWNsZVNwYWNpbmc9MCx0aGlzLmFuZ2xlU3RhcnQ9MCx0aGlzLnJvdGF0aW9uPTAsdGhpcy5vd25lclBvcz1udWxsLHRoaXMuX3ByZXZFbWl0dGVyUG9zPW51bGwsdGhpcy5fcHJldlBvc0lzVmFsaWQ9ITEsdGhpcy5fcG9zQ2hhbmdlZD0hMSx0aGlzLl9wYXJlbnRJc1BDPSExLHRoaXMuX3BhcmVudD1udWxsLHRoaXMuYWRkQXRCYWNrPSExLHRoaXMucGFydGljbGVDb3VudD0wLHRoaXMuX2VtaXQ9ITEsdGhpcy5fc3Bhd25UaW1lcj0wLHRoaXMuX2VtaXR0ZXJMaWZlPS0xLHRoaXMuX2FjdGl2ZVBhcnRpY2xlc0ZpcnN0PW51bGwsdGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdD1udWxsLHRoaXMuX3Bvb2xGaXJzdD1udWxsLHRoaXMuX29yaWdDb25maWc9bnVsbCx0aGlzLl9vcmlnQXJ0PW51bGwsdGhpcy5fYXV0b1VwZGF0ZT0hMSx0aGlzLl9kZXN0cm95V2hlbkNvbXBsZXRlPSExLHRoaXMuX2NvbXBsZXRlQ2FsbGJhY2s9bnVsbCx0aGlzLnBhcmVudD10LGkmJmUmJnRoaXMuaW5pdChpLGUpLHRoaXMucmVjeWNsZT10aGlzLnJlY3ljbGUsdGhpcy51cGRhdGU9dGhpcy51cGRhdGUsdGhpcy5yb3RhdGU9dGhpcy5yb3RhdGUsdGhpcy51cGRhdGVTcGF3blBvcz10aGlzLnVwZGF0ZVNwYXduUG9zLHRoaXMudXBkYXRlT3duZXJQb3M9dGhpcy51cGRhdGVPd25lclBvc30saD1vLnByb3RvdHlwZT17fSxsPW5ldyBQSVhJLlBvaW50O09iamVjdC5kZWZpbmVQcm9wZXJ0eShoLFwiZnJlcXVlbmN5XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9mcmVxdWVuY3l9LHNldDpmdW5jdGlvbih0KXtcIm51bWJlclwiPT10eXBlb2YgdCYmdD4wP3RoaXMuX2ZyZXF1ZW5jeT10OnRoaXMuX2ZyZXF1ZW5jeT0xfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShoLFwicGFydGljbGVDb25zdHJ1Y3RvclwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGFydGljbGVDb25zdHJ1Y3Rvcn0sc2V0OmZ1bmN0aW9uKHQpe2lmKHQhPXRoaXMuX3BhcnRpY2xlQ29uc3RydWN0b3Ipe3RoaXMuX3BhcnRpY2xlQ29uc3RydWN0b3I9dCx0aGlzLmNsZWFudXAoKTtmb3IodmFyIGk9dGhpcy5fcG9vbEZpcnN0O2k7aT1pLm5leHQpaS5kZXN0cm95KCk7dGhpcy5fcG9vbEZpcnN0PW51bGwsdGhpcy5fb3JpZ0NvbmZpZyYmdGhpcy5fb3JpZ0FydCYmdGhpcy5pbml0KHRoaXMuX29yaWdBcnQsdGhpcy5fb3JpZ0NvbmZpZyl9fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShoLFwicGFyZW50XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXJlbnR9LHNldDpmdW5jdGlvbih0KXtpZih0aGlzLl9wYXJlbnRJc1BDKWZvcih2YXIgaT10aGlzLl9wb29sRmlyc3Q7aTtpPWkubmV4dClpLnBhcmVudCYmaS5wYXJlbnQucmVtb3ZlQ2hpbGQoaSk7dGhpcy5jbGVhbnVwKCksdGhpcy5fcGFyZW50PXQsdGhpcy5fcGFyZW50SXNQQz1yJiZ0JiZ0IGluc3RhbmNlb2Ygcn19KSxoLmluaXQ9ZnVuY3Rpb24odCxpKXtpZih0JiZpKXt0aGlzLmNsZWFudXAoKSx0aGlzLl9vcmlnQ29uZmlnPWksdGhpcy5fb3JpZ0FydD10LHQ9QXJyYXkuaXNBcnJheSh0KT90LnNsaWNlKCk6W3RdO3ZhciBlPXRoaXMuX3BhcnRpY2xlQ29uc3RydWN0b3I7dGhpcy5wYXJ0aWNsZUltYWdlcz1lLnBhcnNlQXJ0P2UucGFyc2VBcnQodCk6dCxpLmFscGhhPyh0aGlzLnN0YXJ0QWxwaGE9aS5hbHBoYS5zdGFydCx0aGlzLmVuZEFscGhhPWkuYWxwaGEuZW5kKTp0aGlzLnN0YXJ0QWxwaGE9dGhpcy5lbmRBbHBoYT0xLGkuc3BlZWQ/KHRoaXMuc3RhcnRTcGVlZD1pLnNwZWVkLnN0YXJ0LHRoaXMuZW5kU3BlZWQ9aS5zcGVlZC5lbmQsdGhpcy5taW5pbXVtU3BlZWRNdWx0aXBsaWVyPWkuc3BlZWQubWluaW11bVNwZWVkTXVsdGlwbGllcnx8MSk6KHRoaXMubWluaW11bVNwZWVkTXVsdGlwbGllcj0xLHRoaXMuc3RhcnRTcGVlZD10aGlzLmVuZFNwZWVkPTApO3ZhciBhPWkuYWNjZWxlcmF0aW9uO2EmJihhLnh8fGEueSk/KHRoaXMuZW5kU3BlZWQ9dGhpcy5zdGFydFNwZWVkLHRoaXMuYWNjZWxlcmF0aW9uPW5ldyBQSVhJLlBvaW50KGEueCxhLnkpLHRoaXMubWF4U3BlZWQ9aS5tYXhTcGVlZHx8TmFOKTp0aGlzLmFjY2VsZXJhdGlvbj1uZXcgUElYSS5Qb2ludCxpLnNjYWxlPyh0aGlzLnN0YXJ0U2NhbGU9aS5zY2FsZS5zdGFydCx0aGlzLmVuZFNjYWxlPWkuc2NhbGUuZW5kLHRoaXMubWluaW11bVNjYWxlTXVsdGlwbGllcj1pLnNjYWxlLm1pbmltdW1TY2FsZU11bHRpcGxpZXJ8fDEpOnRoaXMuc3RhcnRTY2FsZT10aGlzLmVuZFNjYWxlPXRoaXMubWluaW11bVNjYWxlTXVsdGlwbGllcj0xLGkuY29sb3ImJih0aGlzLnN0YXJ0Q29sb3I9cy5oZXhUb1JHQihpLmNvbG9yLnN0YXJ0KSxpLmNvbG9yLnN0YXJ0IT1pLmNvbG9yLmVuZD90aGlzLmVuZENvbG9yPXMuaGV4VG9SR0IoaS5jb2xvci5lbmQpOnRoaXMuZW5kQ29sb3I9bnVsbCksaS5zdGFydFJvdGF0aW9uPyh0aGlzLm1pblN0YXJ0Um90YXRpb249aS5zdGFydFJvdGF0aW9uLm1pbix0aGlzLm1heFN0YXJ0Um90YXRpb249aS5zdGFydFJvdGF0aW9uLm1heCk6dGhpcy5taW5TdGFydFJvdGF0aW9uPXRoaXMubWF4U3RhcnRSb3RhdGlvbj0wLGkubm9Sb3RhdGlvbiYmKHRoaXMubWluU3RhcnRSb3RhdGlvbnx8dGhpcy5tYXhTdGFydFJvdGF0aW9uKT90aGlzLm5vUm90YXRpb249ISFpLm5vUm90YXRpb246dGhpcy5ub1JvdGF0aW9uPSExLGkucm90YXRpb25TcGVlZD8odGhpcy5taW5Sb3RhdGlvblNwZWVkPWkucm90YXRpb25TcGVlZC5taW4sdGhpcy5tYXhSb3RhdGlvblNwZWVkPWkucm90YXRpb25TcGVlZC5tYXgpOnRoaXMubWluUm90YXRpb25TcGVlZD10aGlzLm1heFJvdGF0aW9uU3BlZWQ9MCx0aGlzLm1pbkxpZmV0aW1lPWkubGlmZXRpbWUubWluLHRoaXMubWF4TGlmZXRpbWU9aS5saWZldGltZS5tYXgsdGhpcy5wYXJ0aWNsZUJsZW5kTW9kZT1zLmdldEJsZW5kTW9kZShpLmJsZW5kTW9kZSksaS5lYXNlP3RoaXMuY3VzdG9tRWFzZT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBpLmVhc2U/aS5lYXNlOnMuZ2VuZXJhdGVFYXNlKGkuZWFzZSk6dGhpcy5jdXN0b21FYXNlPW51bGwsZS5wYXJzZURhdGE/dGhpcy5leHRyYURhdGE9ZS5wYXJzZURhdGEoaS5leHRyYURhdGEpOnRoaXMuZXh0cmFEYXRhPWkuZXh0cmFEYXRhfHxudWxsLHRoaXMuc3Bhd25SZWN0PXRoaXMuc3Bhd25DaXJjbGU9bnVsbCx0aGlzLnBhcnRpY2xlc1BlcldhdmU9MSx0aGlzLnBhcnRpY2xlU3BhY2luZz0wLHRoaXMuYW5nbGVTdGFydD0wO3ZhciByO3N3aXRjaChpLnNwYXduVHlwZSl7Y2FzZVwicmVjdFwiOnRoaXMuc3Bhd25UeXBlPVwicmVjdFwiLHRoaXMuX3NwYXduRnVuYz10aGlzLl9zcGF3blJlY3Q7dmFyIG49aS5zcGF3blJlY3Q7dGhpcy5zcGF3blJlY3Q9bmV3IFBJWEkuUmVjdGFuZ2xlKG4ueCxuLnksbi53LG4uaCk7YnJlYWs7Y2FzZVwiY2lyY2xlXCI6dGhpcy5zcGF3blR5cGU9XCJjaXJjbGVcIix0aGlzLl9zcGF3bkZ1bmM9dGhpcy5fc3Bhd25DaXJjbGUscj1pLnNwYXduQ2lyY2xlLHRoaXMuc3Bhd25DaXJjbGU9bmV3IFBJWEkuQ2lyY2xlKHIueCxyLnksci5yKTticmVhaztjYXNlXCJyaW5nXCI6dGhpcy5zcGF3blR5cGU9XCJyaW5nXCIsdGhpcy5fc3Bhd25GdW5jPXRoaXMuX3NwYXduUmluZyxyPWkuc3Bhd25DaXJjbGUsdGhpcy5zcGF3bkNpcmNsZT1uZXcgUElYSS5DaXJjbGUoci54LHIueSxyLnIpLHRoaXMuc3Bhd25DaXJjbGUubWluUmFkaXVzPXIubWluUjticmVhaztjYXNlXCJidXJzdFwiOnRoaXMuc3Bhd25UeXBlPVwiYnVyc3RcIix0aGlzLl9zcGF3bkZ1bmM9dGhpcy5fc3Bhd25CdXJzdCx0aGlzLnBhcnRpY2xlc1BlcldhdmU9aS5wYXJ0aWNsZXNQZXJXYXZlLHRoaXMucGFydGljbGVTcGFjaW5nPWkucGFydGljbGVTcGFjaW5nLHRoaXMuYW5nbGVTdGFydD1pLmFuZ2xlU3RhcnQ/aS5hbmdsZVN0YXJ0OjA7YnJlYWs7Y2FzZVwicG9pbnRcIjp0aGlzLnNwYXduVHlwZT1cInBvaW50XCIsdGhpcy5fc3Bhd25GdW5jPXRoaXMuX3NwYXduUG9pbnQ7YnJlYWs7ZGVmYXVsdDp0aGlzLnNwYXduVHlwZT1cInBvaW50XCIsdGhpcy5fc3Bhd25GdW5jPXRoaXMuX3NwYXduUG9pbnR9dGhpcy5mcmVxdWVuY3k9aS5mcmVxdWVuY3ksdGhpcy5lbWl0dGVyTGlmZXRpbWU9aS5lbWl0dGVyTGlmZXRpbWV8fC0xLHRoaXMubWF4UGFydGljbGVzPWkubWF4UGFydGljbGVzPjA/aS5tYXhQYXJ0aWNsZXM6MWUzLHRoaXMuYWRkQXRCYWNrPSEhaS5hZGRBdEJhY2ssdGhpcy5yb3RhdGlvbj0wLHRoaXMub3duZXJQb3M9bmV3IFBJWEkuUG9pbnQsdGhpcy5zcGF3blBvcz1uZXcgUElYSS5Qb2ludChpLnBvcy54LGkucG9zLnkpLHRoaXMuX3ByZXZFbWl0dGVyUG9zPXRoaXMuc3Bhd25Qb3MuY2xvbmUoKSx0aGlzLl9wcmV2UG9zSXNWYWxpZD0hMSx0aGlzLl9zcGF3blRpbWVyPTAsdGhpcy5lbWl0PXZvaWQgMD09PWkuZW1pdHx8ISFpLmVtaXQsdGhpcy5hdXRvVXBkYXRlPXZvaWQgMCE9PWkuYXV0b1VwZGF0ZSYmISFpLmF1dG9VcGRhdGV9fSxoLnJlY3ljbGU9ZnVuY3Rpb24odCl7dC5uZXh0JiYodC5uZXh0LnByZXY9dC5wcmV2KSx0LnByZXYmJih0LnByZXYubmV4dD10Lm5leHQpLHQ9PXRoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3QmJih0aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0PXQucHJldiksdD09dGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3QmJih0aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdD10Lm5leHQpLHQucHJldj1udWxsLHQubmV4dD10aGlzLl9wb29sRmlyc3QsdGhpcy5fcG9vbEZpcnN0PXQsdGhpcy5fcGFyZW50SXNQQz8odC5hbHBoYT0wLHQudmlzaWJsZT0hMSk6dC5wYXJlbnQmJnQucGFyZW50LnJlbW92ZUNoaWxkKHQpLC0tdGhpcy5wYXJ0aWNsZUNvdW50fSxoLnJvdGF0ZT1mdW5jdGlvbih0KXtpZih0aGlzLnJvdGF0aW9uIT10KXt2YXIgaT10LXRoaXMucm90YXRpb247dGhpcy5yb3RhdGlvbj10LHMucm90YXRlUG9pbnQoaSx0aGlzLnNwYXduUG9zKSx0aGlzLl9wb3NDaGFuZ2VkPSEwfX0saC51cGRhdGVTcGF3blBvcz1mdW5jdGlvbih0LGkpe3RoaXMuX3Bvc0NoYW5nZWQ9ITAsdGhpcy5zcGF3blBvcy54PXQsdGhpcy5zcGF3blBvcy55PWl9LGgudXBkYXRlT3duZXJQb3M9ZnVuY3Rpb24odCxpKXt0aGlzLl9wb3NDaGFuZ2VkPSEwLHRoaXMub3duZXJQb3MueD10LHRoaXMub3duZXJQb3MueT1pfSxoLnJlc2V0UG9zaXRpb25UcmFja2luZz1mdW5jdGlvbigpe3RoaXMuX3ByZXZQb3NJc1ZhbGlkPSExfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoaCxcImVtaXRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2VtaXR9LHNldDpmdW5jdGlvbih0KXt0aGlzLl9lbWl0PSEhdCx0aGlzLl9lbWl0dGVyTGlmZT10aGlzLmVtaXR0ZXJMaWZldGltZX19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoaCxcImF1dG9VcGRhdGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2F1dG9VcGRhdGV9LHNldDpmdW5jdGlvbih0KXt0aGlzLl9hdXRvVXBkYXRlJiYhdD9uLnJlbW92ZSh0aGlzLnVwZGF0ZSx0aGlzKTohdGhpcy5fYXV0b1VwZGF0ZSYmdCYmbi5hZGQodGhpcy51cGRhdGUsdGhpcyksdGhpcy5fYXV0b1VwZGF0ZT0hIXR9fSksaC5wbGF5T25jZUFuZERlc3Ryb3k9ZnVuY3Rpb24odCl7dGhpcy5hdXRvVXBkYXRlPSEwLHRoaXMuZW1pdD0hMCx0aGlzLl9kZXN0cm95V2hlbkNvbXBsZXRlPSEwLHRoaXMuX2NvbXBsZXRlQ2FsbGJhY2s9dH0saC5wbGF5T25jZT1mdW5jdGlvbih0KXt0aGlzLmF1dG9VcGRhdGU9ITAsdGhpcy5lbWl0PSEwLHRoaXMuX2NvbXBsZXRlQ2FsbGJhY2s9dH0saC51cGRhdGU9ZnVuY3Rpb24odCl7aWYodGhpcy5fYXV0b1VwZGF0ZSYmKHQ9dC9QSVhJLnNldHRpbmdzLlRBUkdFVF9GUE1TLzFlMyksdGhpcy5fcGFyZW50KXt2YXIgaSxlLHM7Zm9yKGU9dGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3Q7ZTtlPXMpcz1lLm5leHQsZS51cGRhdGUodCk7dmFyIGEscjt0aGlzLl9wcmV2UG9zSXNWYWxpZCYmKGE9dGhpcy5fcHJldkVtaXR0ZXJQb3MueCxyPXRoaXMuX3ByZXZFbWl0dGVyUG9zLnkpO3ZhciBuPXRoaXMub3duZXJQb3MueCt0aGlzLnNwYXduUG9zLngsbz10aGlzLm93bmVyUG9zLnkrdGhpcy5zcGF3blBvcy55O2lmKHRoaXMuX2VtaXQpZm9yKHRoaXMuX3NwYXduVGltZXItPXQ7dGhpcy5fc3Bhd25UaW1lcjw9MDspe2lmKHRoaXMuX2VtaXR0ZXJMaWZlPjAmJih0aGlzLl9lbWl0dGVyTGlmZS09dGhpcy5fZnJlcXVlbmN5LHRoaXMuX2VtaXR0ZXJMaWZlPD0wKSl7dGhpcy5fc3Bhd25UaW1lcj0wLHRoaXMuX2VtaXR0ZXJMaWZlPTAsdGhpcy5lbWl0PSExO2JyZWFrfWlmKHRoaXMucGFydGljbGVDb3VudD49dGhpcy5tYXhQYXJ0aWNsZXMpdGhpcy5fc3Bhd25UaW1lcis9dGhpcy5fZnJlcXVlbmN5O2Vsc2V7dmFyIGg7aWYoaD10aGlzLm1pbkxpZmV0aW1lPT10aGlzLm1heExpZmV0aW1lP3RoaXMubWluTGlmZXRpbWU6TWF0aC5yYW5kb20oKSoodGhpcy5tYXhMaWZldGltZS10aGlzLm1pbkxpZmV0aW1lKSt0aGlzLm1pbkxpZmV0aW1lLC10aGlzLl9zcGF3blRpbWVyPGgpe3ZhciBsLHA7aWYodGhpcy5fcHJldlBvc0lzVmFsaWQmJnRoaXMuX3Bvc0NoYW5nZWQpe3ZhciBjPTErdGhpcy5fc3Bhd25UaW1lci90O2w9KG4tYSkqYythLHA9KG8tcikqYytyfWVsc2UgbD1uLHA9bztpPTA7Zm9yKHZhciBkPU1hdGgubWluKHRoaXMucGFydGljbGVzUGVyV2F2ZSx0aGlzLm1heFBhcnRpY2xlcy10aGlzLnBhcnRpY2xlQ291bnQpO2k8ZDsrK2kpe3ZhciB1LG07aWYodGhpcy5fcG9vbEZpcnN0Pyh1PXRoaXMuX3Bvb2xGaXJzdCx0aGlzLl9wb29sRmlyc3Q9dGhpcy5fcG9vbEZpcnN0Lm5leHQsdS5uZXh0PW51bGwpOnU9bmV3IHRoaXMucGFydGljbGVDb25zdHJ1Y3Rvcih0aGlzKSx0aGlzLnBhcnRpY2xlSW1hZ2VzLmxlbmd0aD4xP3UuYXBwbHlBcnQodGhpcy5wYXJ0aWNsZUltYWdlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqdGhpcy5wYXJ0aWNsZUltYWdlcy5sZW5ndGgpXSk6dS5hcHBseUFydCh0aGlzLnBhcnRpY2xlSW1hZ2VzWzBdKSx1LnN0YXJ0QWxwaGE9dGhpcy5zdGFydEFscGhhLHUuZW5kQWxwaGE9dGhpcy5lbmRBbHBoYSwxIT10aGlzLm1pbmltdW1TcGVlZE11bHRpcGxpZXI/KG09TWF0aC5yYW5kb20oKSooMS10aGlzLm1pbmltdW1TcGVlZE11bHRpcGxpZXIpK3RoaXMubWluaW11bVNwZWVkTXVsdGlwbGllcix1LnN0YXJ0U3BlZWQ9dGhpcy5zdGFydFNwZWVkKm0sdS5lbmRTcGVlZD10aGlzLmVuZFNwZWVkKm0pOih1LnN0YXJ0U3BlZWQ9dGhpcy5zdGFydFNwZWVkLHUuZW5kU3BlZWQ9dGhpcy5lbmRTcGVlZCksdS5hY2NlbGVyYXRpb24ueD10aGlzLmFjY2VsZXJhdGlvbi54LHUuYWNjZWxlcmF0aW9uLnk9dGhpcy5hY2NlbGVyYXRpb24ueSx1Lm1heFNwZWVkPXRoaXMubWF4U3BlZWQsMSE9dGhpcy5taW5pbXVtU2NhbGVNdWx0aXBsaWVyPyhtPU1hdGgucmFuZG9tKCkqKDEtdGhpcy5taW5pbXVtU2NhbGVNdWx0aXBsaWVyKSt0aGlzLm1pbmltdW1TY2FsZU11bHRpcGxpZXIsdS5zdGFydFNjYWxlPXRoaXMuc3RhcnRTY2FsZSptLHUuZW5kU2NhbGU9dGhpcy5lbmRTY2FsZSptKToodS5zdGFydFNjYWxlPXRoaXMuc3RhcnRTY2FsZSx1LmVuZFNjYWxlPXRoaXMuZW5kU2NhbGUpLHUuc3RhcnRDb2xvcj10aGlzLnN0YXJ0Q29sb3IsdS5lbmRDb2xvcj10aGlzLmVuZENvbG9yLHRoaXMubWluUm90YXRpb25TcGVlZD09dGhpcy5tYXhSb3RhdGlvblNwZWVkP3Uucm90YXRpb25TcGVlZD10aGlzLm1pblJvdGF0aW9uU3BlZWQ6dS5yb3RhdGlvblNwZWVkPU1hdGgucmFuZG9tKCkqKHRoaXMubWF4Um90YXRpb25TcGVlZC10aGlzLm1pblJvdGF0aW9uU3BlZWQpK3RoaXMubWluUm90YXRpb25TcGVlZCx1Lm5vUm90YXRpb249dGhpcy5ub1JvdGF0aW9uLHUubWF4TGlmZT1oLHUuYmxlbmRNb2RlPXRoaXMucGFydGljbGVCbGVuZE1vZGUsdS5lYXNlPXRoaXMuY3VzdG9tRWFzZSx1LmV4dHJhRGF0YT10aGlzLmV4dHJhRGF0YSx0aGlzLl9zcGF3bkZ1bmModSxsLHAsaSksdS5pbml0KCksdS51cGRhdGUoLXRoaXMuX3NwYXduVGltZXIpLHRoaXMuX3BhcmVudElzUEMmJnUucGFyZW50KXt2YXIgZj10aGlzLl9wYXJlbnQuY2hpbGRyZW47aWYoZlswXT09dSlmLnNoaWZ0KCk7ZWxzZSBpZihmW2YubGVuZ3RoLTFdPT11KWYucG9wKCk7ZWxzZXt2YXIgXz1mLmluZGV4T2YodSk7Zi5zcGxpY2UoXywxKX10aGlzLmFkZEF0QmFjaz9mLnVuc2hpZnQodSk6Zi5wdXNoKHUpfWVsc2UgdGhpcy5hZGRBdEJhY2s/dGhpcy5fcGFyZW50LmFkZENoaWxkQXQodSwwKTp0aGlzLl9wYXJlbnQuYWRkQ2hpbGQodSk7dGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdD8odGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdC5uZXh0PXUsdS5wcmV2PXRoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3QsdGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdD11KTp0aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0PXRoaXMuX2FjdGl2ZVBhcnRpY2xlc0ZpcnN0PXUsKyt0aGlzLnBhcnRpY2xlQ291bnR9fXRoaXMuX3NwYXduVGltZXIrPXRoaXMuX2ZyZXF1ZW5jeX19dGhpcy5fcG9zQ2hhbmdlZCYmKHRoaXMuX3ByZXZFbWl0dGVyUG9zLng9bix0aGlzLl9wcmV2RW1pdHRlclBvcy55PW8sdGhpcy5fcHJldlBvc0lzVmFsaWQ9ITAsdGhpcy5fcG9zQ2hhbmdlZD0hMSksdGhpcy5fZW1pdHx8dGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3R8fCh0aGlzLl9jb21wbGV0ZUNhbGxiYWNrJiZ0aGlzLl9jb21wbGV0ZUNhbGxiYWNrKCksdGhpcy5fZGVzdHJveVdoZW5Db21wbGV0ZSYmdGhpcy5kZXN0cm95KCkpfX0saC5fc3Bhd25Qb2ludD1mdW5jdGlvbih0LGksZSl7dGhpcy5taW5TdGFydFJvdGF0aW9uPT10aGlzLm1heFN0YXJ0Um90YXRpb24/dC5yb3RhdGlvbj10aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbjp0LnJvdGF0aW9uPU1hdGgucmFuZG9tKCkqKHRoaXMubWF4U3RhcnRSb3RhdGlvbi10aGlzLm1pblN0YXJ0Um90YXRpb24pK3RoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uLHQucG9zaXRpb24ueD1pLHQucG9zaXRpb24ueT1lfSxoLl9zcGF3blJlY3Q9ZnVuY3Rpb24odCxpLGUpe3RoaXMubWluU3RhcnRSb3RhdGlvbj09dGhpcy5tYXhTdGFydFJvdGF0aW9uP3Qucm90YXRpb249dGhpcy5taW5TdGFydFJvdGF0aW9uK3RoaXMucm90YXRpb246dC5yb3RhdGlvbj1NYXRoLnJhbmRvbSgpKih0aGlzLm1heFN0YXJ0Um90YXRpb24tdGhpcy5taW5TdGFydFJvdGF0aW9uKSt0aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbixsLng9TWF0aC5yYW5kb20oKSp0aGlzLnNwYXduUmVjdC53aWR0aCt0aGlzLnNwYXduUmVjdC54LGwueT1NYXRoLnJhbmRvbSgpKnRoaXMuc3Bhd25SZWN0LmhlaWdodCt0aGlzLnNwYXduUmVjdC55LDAhPT10aGlzLnJvdGF0aW9uJiZzLnJvdGF0ZVBvaW50KHRoaXMucm90YXRpb24sbCksdC5wb3NpdGlvbi54PWkrbC54LHQucG9zaXRpb24ueT1lK2wueX0saC5fc3Bhd25DaXJjbGU9ZnVuY3Rpb24odCxpLGUpe3RoaXMubWluU3RhcnRSb3RhdGlvbj09dGhpcy5tYXhTdGFydFJvdGF0aW9uP3Qucm90YXRpb249dGhpcy5taW5TdGFydFJvdGF0aW9uK3RoaXMucm90YXRpb246dC5yb3RhdGlvbj1NYXRoLnJhbmRvbSgpKih0aGlzLm1heFN0YXJ0Um90YXRpb24tdGhpcy5taW5TdGFydFJvdGF0aW9uKSt0aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbixsLng9TWF0aC5yYW5kb20oKSp0aGlzLnNwYXduQ2lyY2xlLnJhZGl1cyxsLnk9MCxzLnJvdGF0ZVBvaW50KDM2MCpNYXRoLnJhbmRvbSgpLGwpLGwueCs9dGhpcy5zcGF3bkNpcmNsZS54LGwueSs9dGhpcy5zcGF3bkNpcmNsZS55LDAhPT10aGlzLnJvdGF0aW9uJiZzLnJvdGF0ZVBvaW50KHRoaXMucm90YXRpb24sbCksdC5wb3NpdGlvbi54PWkrbC54LHQucG9zaXRpb24ueT1lK2wueX0saC5fc3Bhd25SaW5nPWZ1bmN0aW9uKHQsaSxlKXt2YXIgYT10aGlzLnNwYXduQ2lyY2xlO3RoaXMubWluU3RhcnRSb3RhdGlvbj09dGhpcy5tYXhTdGFydFJvdGF0aW9uP3Qucm90YXRpb249dGhpcy5taW5TdGFydFJvdGF0aW9uK3RoaXMucm90YXRpb246dC5yb3RhdGlvbj1NYXRoLnJhbmRvbSgpKih0aGlzLm1heFN0YXJ0Um90YXRpb24tdGhpcy5taW5TdGFydFJvdGF0aW9uKSt0aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbixhLm1pblJhZGl1cz09YS5yYWRpdXM/bC54PU1hdGgucmFuZG9tKCkqKGEucmFkaXVzLWEubWluUmFkaXVzKSthLm1pblJhZGl1czpsLng9YS5yYWRpdXMsbC55PTA7dmFyIHI9MzYwKk1hdGgucmFuZG9tKCk7dC5yb3RhdGlvbis9cixzLnJvdGF0ZVBvaW50KHIsbCksbC54Kz10aGlzLnNwYXduQ2lyY2xlLngsbC55Kz10aGlzLnNwYXduQ2lyY2xlLnksMCE9PXRoaXMucm90YXRpb24mJnMucm90YXRlUG9pbnQodGhpcy5yb3RhdGlvbixsKSx0LnBvc2l0aW9uLng9aStsLngsdC5wb3NpdGlvbi55PWUrbC55fSxoLl9zcGF3bkJ1cnN0PWZ1bmN0aW9uKHQsaSxlLHMpezA9PT10aGlzLnBhcnRpY2xlU3BhY2luZz90LnJvdGF0aW9uPTM2MCpNYXRoLnJhbmRvbSgpOnQucm90YXRpb249dGhpcy5hbmdsZVN0YXJ0K3RoaXMucGFydGljbGVTcGFjaW5nKnMrdGhpcy5yb3RhdGlvbix0LnBvc2l0aW9uLng9aSx0LnBvc2l0aW9uLnk9ZX0saC5jbGVhbnVwPWZ1bmN0aW9uKCl7dmFyIHQsaTtmb3IodD10aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdDt0O3Q9aSlpPXQubmV4dCx0aGlzLnJlY3ljbGUodCksdC5wYXJlbnQmJnQucGFyZW50LnJlbW92ZUNoaWxkKHQpO3RoaXMuX2FjdGl2ZVBhcnRpY2xlc0ZpcnN0PXRoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3Q9bnVsbCx0aGlzLnBhcnRpY2xlQ291bnQ9MH0saC5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5hdXRvVXBkYXRlPSExLHRoaXMuY2xlYW51cCgpO2Zvcih2YXIgdCxpPXRoaXMuX3Bvb2xGaXJzdDtpO2k9dCl0PWkubmV4dCxpLmRlc3Ryb3koKTt0aGlzLl9wb29sRmlyc3Q9dGhpcy5fcGFyZW50PXRoaXMucGFydGljbGVJbWFnZXM9dGhpcy5zcGF3blBvcz10aGlzLm93bmVyUG9zPXRoaXMuc3RhcnRDb2xvcj10aGlzLmVuZENvbG9yPXRoaXMuY3VzdG9tRWFzZT10aGlzLl9jb21wbGV0ZUNhbGxiYWNrPW51bGx9LGkuZXhwb3J0cz1vfSx7XCIuL1BhcnRpY2xlXCI6MyxcIi4vUGFydGljbGVVdGlsc1wiOjR9XSwzOltmdW5jdGlvbih0LGksZSl7dmFyIHM9dChcIi4vUGFydGljbGVVdGlsc1wiKSxhPVBJWEkuU3ByaXRlLHI9ZnVuY3Rpb24odCl7YS5jYWxsKHRoaXMpLHRoaXMuZW1pdHRlcj10LHRoaXMuYW5jaG9yLng9dGhpcy5hbmNob3IueT0uNSx0aGlzLnZlbG9jaXR5PW5ldyBQSVhJLlBvaW50LHRoaXMubWF4TGlmZT0wLHRoaXMuYWdlPTAsdGhpcy5lYXNlPW51bGwsdGhpcy5leHRyYURhdGE9bnVsbCx0aGlzLnN0YXJ0QWxwaGE9MCx0aGlzLmVuZEFscGhhPTAsdGhpcy5zdGFydFNwZWVkPTAsdGhpcy5lbmRTcGVlZD0wLHRoaXMuYWNjZWxlcmF0aW9uPW5ldyBQSVhJLlBvaW50LHRoaXMubWF4U3BlZWQ9TmFOLHRoaXMuc3RhcnRTY2FsZT0wLHRoaXMuZW5kU2NhbGU9MCx0aGlzLnN0YXJ0Q29sb3I9bnVsbCx0aGlzLl9zUj0wLHRoaXMuX3NHPTAsdGhpcy5fc0I9MCx0aGlzLmVuZENvbG9yPW51bGwsdGhpcy5fZVI9MCx0aGlzLl9lRz0wLHRoaXMuX2VCPTAsdGhpcy5fZG9BbHBoYT0hMSx0aGlzLl9kb1NjYWxlPSExLHRoaXMuX2RvU3BlZWQ9ITEsdGhpcy5fZG9BY2NlbGVyYXRpb249ITEsdGhpcy5fZG9Db2xvcj0hMSx0aGlzLl9kb05vcm1hbE1vdmVtZW50PSExLHRoaXMuX29uZU92ZXJMaWZlPTAsdGhpcy5uZXh0PW51bGwsdGhpcy5wcmV2PW51bGwsdGhpcy5pbml0PXRoaXMuaW5pdCx0aGlzLlBhcnRpY2xlX2luaXQ9dGhpcy5QYXJ0aWNsZV9pbml0LHRoaXMudXBkYXRlPXRoaXMudXBkYXRlLHRoaXMuUGFydGljbGVfdXBkYXRlPXRoaXMuUGFydGljbGVfdXBkYXRlLHRoaXMuYXBwbHlBcnQ9dGhpcy5hcHBseUFydCx0aGlzLmtpbGw9dGhpcy5raWxsfSxuPXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoYS5wcm90b3R5cGUpO24uaW5pdD1uLlBhcnRpY2xlX2luaXQ9ZnVuY3Rpb24oKXt0aGlzLmFnZT0wLHRoaXMudmVsb2NpdHkueD10aGlzLnN0YXJ0U3BlZWQsdGhpcy52ZWxvY2l0eS55PTAscy5yb3RhdGVQb2ludCh0aGlzLnJvdGF0aW9uLHRoaXMudmVsb2NpdHkpLHRoaXMubm9Sb3RhdGlvbj90aGlzLnJvdGF0aW9uPTA6dGhpcy5yb3RhdGlvbio9cy5ERUdfVE9fUkFEUyx0aGlzLnJvdGF0aW9uU3BlZWQqPXMuREVHX1RPX1JBRFMsdGhpcy5hbHBoYT10aGlzLnN0YXJ0QWxwaGEsdGhpcy5zY2FsZS54PXRoaXMuc2NhbGUueT10aGlzLnN0YXJ0U2NhbGUsdGhpcy5zdGFydENvbG9yJiYodGhpcy5fc1I9dGhpcy5zdGFydENvbG9yWzBdLHRoaXMuX3NHPXRoaXMuc3RhcnRDb2xvclsxXSx0aGlzLl9zQj10aGlzLnN0YXJ0Q29sb3JbMl0sdGhpcy5lbmRDb2xvciYmKHRoaXMuX2VSPXRoaXMuZW5kQ29sb3JbMF0sdGhpcy5fZUc9dGhpcy5lbmRDb2xvclsxXSx0aGlzLl9lQj10aGlzLmVuZENvbG9yWzJdKSksdGhpcy5fZG9BbHBoYT10aGlzLnN0YXJ0QWxwaGEhPXRoaXMuZW5kQWxwaGEsdGhpcy5fZG9TcGVlZD10aGlzLnN0YXJ0U3BlZWQhPXRoaXMuZW5kU3BlZWQsdGhpcy5fZG9TY2FsZT10aGlzLnN0YXJ0U2NhbGUhPXRoaXMuZW5kU2NhbGUsdGhpcy5fZG9Db2xvcj0hIXRoaXMuZW5kQ29sb3IsdGhpcy5fZG9BY2NlbGVyYXRpb249MCE9PXRoaXMuYWNjZWxlcmF0aW9uLnh8fDAhPT10aGlzLmFjY2VsZXJhdGlvbi55LHRoaXMuX2RvTm9ybWFsTW92ZW1lbnQ9dGhpcy5fZG9TcGVlZHx8MCE9PXRoaXMuc3RhcnRTcGVlZHx8dGhpcy5fZG9BY2NlbGVyYXRpb24sdGhpcy5fb25lT3ZlckxpZmU9MS90aGlzLm1heExpZmUsdGhpcy50aW50PXMuY29tYmluZVJHQkNvbXBvbmVudHModGhpcy5fc1IsdGhpcy5fc0csdGhpcy5fc0IpLHRoaXMudmlzaWJsZT0hMH0sbi5hcHBseUFydD1mdW5jdGlvbih0KXt0aGlzLnRleHR1cmU9dHx8cy5FTVBUWV9URVhUVVJFfSxuLnVwZGF0ZT1uLlBhcnRpY2xlX3VwZGF0ZT1mdW5jdGlvbih0KXtpZih0aGlzLmFnZSs9dCx0aGlzLmFnZT49dGhpcy5tYXhMaWZlKXJldHVybiB0aGlzLmtpbGwoKSwtMTt2YXIgaT10aGlzLmFnZSp0aGlzLl9vbmVPdmVyTGlmZTtpZih0aGlzLmVhc2UmJihpPTQ9PXRoaXMuZWFzZS5sZW5ndGg/dGhpcy5lYXNlKGksMCwxLDEpOnRoaXMuZWFzZShpKSksdGhpcy5fZG9BbHBoYSYmKHRoaXMuYWxwaGE9KHRoaXMuZW5kQWxwaGEtdGhpcy5zdGFydEFscGhhKSppK3RoaXMuc3RhcnRBbHBoYSksdGhpcy5fZG9TY2FsZSl7dmFyIGU9KHRoaXMuZW5kU2NhbGUtdGhpcy5zdGFydFNjYWxlKSppK3RoaXMuc3RhcnRTY2FsZTt0aGlzLnNjYWxlLng9dGhpcy5zY2FsZS55PWV9aWYodGhpcy5fZG9Ob3JtYWxNb3ZlbWVudCl7aWYodGhpcy5fZG9TcGVlZCl7dmFyIGE9KHRoaXMuZW5kU3BlZWQtdGhpcy5zdGFydFNwZWVkKSppK3RoaXMuc3RhcnRTcGVlZDtzLm5vcm1hbGl6ZSh0aGlzLnZlbG9jaXR5KSxzLnNjYWxlQnkodGhpcy52ZWxvY2l0eSxhKX1lbHNlIGlmKHRoaXMuX2RvQWNjZWxlcmF0aW9uJiYodGhpcy52ZWxvY2l0eS54Kz10aGlzLmFjY2VsZXJhdGlvbi54KnQsdGhpcy52ZWxvY2l0eS55Kz10aGlzLmFjY2VsZXJhdGlvbi55KnQsdGhpcy5tYXhTcGVlZCkpe3ZhciByPXMubGVuZ3RoKHRoaXMudmVsb2NpdHkpO3I+dGhpcy5tYXhTcGVlZCYmcy5zY2FsZUJ5KHRoaXMudmVsb2NpdHksdGhpcy5tYXhTcGVlZC9yKX10aGlzLnBvc2l0aW9uLngrPXRoaXMudmVsb2NpdHkueCp0LHRoaXMucG9zaXRpb24ueSs9dGhpcy52ZWxvY2l0eS55KnR9aWYodGhpcy5fZG9Db2xvcil7dmFyIG49KHRoaXMuX2VSLXRoaXMuX3NSKSppK3RoaXMuX3NSLG89KHRoaXMuX2VHLXRoaXMuX3NHKSppK3RoaXMuX3NHLGg9KHRoaXMuX2VCLXRoaXMuX3NCKSppK3RoaXMuX3NCO3RoaXMudGludD1zLmNvbWJpbmVSR0JDb21wb25lbnRzKG4sbyxoKX1yZXR1cm4gMCE9PXRoaXMucm90YXRpb25TcGVlZD90aGlzLnJvdGF0aW9uKz10aGlzLnJvdGF0aW9uU3BlZWQqdDp0aGlzLmFjY2VsZXJhdGlvbiYmIXRoaXMubm9Sb3RhdGlvbiYmKHRoaXMucm90YXRpb249TWF0aC5hdGFuMih0aGlzLnZlbG9jaXR5LnksdGhpcy52ZWxvY2l0eS54KSksaX0sbi5raWxsPWZ1bmN0aW9uKCl7dGhpcy5lbWl0dGVyLnJlY3ljbGUodGhpcyl9LG4uU3ByaXRlX0Rlc3Ryb3k9YS5wcm90b3R5cGUuZGVzdHJveSxuLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnBhcmVudCYmdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyksdGhpcy5TcHJpdGVfRGVzdHJveSYmdGhpcy5TcHJpdGVfRGVzdHJveSgpLHRoaXMuZW1pdHRlcj10aGlzLnZlbG9jaXR5PXRoaXMuc3RhcnRDb2xvcj10aGlzLmVuZENvbG9yPXRoaXMuZWFzZT10aGlzLm5leHQ9dGhpcy5wcmV2PW51bGx9LHIucGFyc2VBcnQ9ZnVuY3Rpb24odCl7dmFyIGk7Zm9yKGk9dC5sZW5ndGg7aT49MDstLWkpXCJzdHJpbmdcIj09dHlwZW9mIHRbaV0mJih0W2ldPVBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UodFtpXSkpO2lmKHMudmVyYm9zZSlmb3IoaT10Lmxlbmd0aC0xO2k+MDstLWkpaWYodFtpXS5iYXNlVGV4dHVyZSE9dFtpLTFdLmJhc2VUZXh0dXJlKXt3aW5kb3cuY29uc29sZSYmY29uc29sZS53YXJuKFwiUGl4aVBhcnRpY2xlczogdXNpbmcgcGFydGljbGUgdGV4dHVyZXMgZnJvbSBkaWZmZXJlbnQgaW1hZ2VzIG1heSBoaW5kZXIgcGVyZm9ybWFuY2UgaW4gV2ViR0xcIik7YnJlYWt9cmV0dXJuIHR9LHIucGFyc2VEYXRhPWZ1bmN0aW9uKHQpe3JldHVybiB0fSxpLmV4cG9ydHM9cn0se1wiLi9QYXJ0aWNsZVV0aWxzXCI6NH1dLDQ6W2Z1bmN0aW9uKHQsaSxlKXtcInVzZSBzdHJpY3RcIjt2YXIgcz1QSVhJLkJMRU5EX01PREVTfHxQSVhJLmJsZW5kTW9kZXMsYT1QSVhJLlRleHR1cmUscj17fTtyLnZlcmJvc2U9ITE7dmFyIG49ci5ERUdfVE9fUkFEUz1NYXRoLlBJLzE4MCxvPXIuRU1QVFlfVEVYVFVSRT1hLkVNUFRZO28ub249by5kZXN0cm95PW8ub25jZT1vLmVtaXQ9ZnVuY3Rpb24oKXt9LHIucm90YXRlUG9pbnQ9ZnVuY3Rpb24odCxpKXtpZih0KXt0Kj1uO3ZhciBlPU1hdGguc2luKHQpLHM9TWF0aC5jb3ModCksYT1pLngqcy1pLnkqZSxyPWkueCplK2kueSpzO2kueD1hLGkueT1yfX0sci5jb21iaW5lUkdCQ29tcG9uZW50cz1mdW5jdGlvbih0LGksZSl7cmV0dXJuIHQ8PDE2fGk8PDh8ZX0sci5ub3JtYWxpemU9ZnVuY3Rpb24odCl7dmFyIGk9MS9yLmxlbmd0aCh0KTt0LngqPWksdC55Kj1pfSxyLnNjYWxlQnk9ZnVuY3Rpb24odCxpKXt0LngqPWksdC55Kj1pfSxyLmxlbmd0aD1mdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zcXJ0KHQueCp0LngrdC55KnQueSl9LHIuaGV4VG9SR0I9ZnVuY3Rpb24odCxpKXtpP2kubGVuZ3RoPTA6aT1bXSxcIiNcIj09dC5jaGFyQXQoMCk/dD10LnN1YnN0cigxKTowPT09dC5pbmRleE9mKFwiMHhcIikmJih0PXQuc3Vic3RyKDIpKTt2YXIgZTtyZXR1cm4gOD09dC5sZW5ndGgmJihlPXQuc3Vic3RyKDAsMiksdD10LnN1YnN0cigyKSksaS5wdXNoKHBhcnNlSW50KHQuc3Vic3RyKDAsMiksMTYpKSxpLnB1c2gocGFyc2VJbnQodC5zdWJzdHIoMiwyKSwxNikpLGkucHVzaChwYXJzZUludCh0LnN1YnN0cig0LDIpLDE2KSksZSYmaS5wdXNoKHBhcnNlSW50KGUsMTYpKSxpfSxyLmdlbmVyYXRlRWFzZT1mdW5jdGlvbih0KXt2YXIgaT10Lmxlbmd0aCxlPTEvaSxzPWZ1bmN0aW9uKHMpe3ZhciBhLHIsbj1pKnN8MDtyZXR1cm4gYT0ocy1uKmUpKmkscj10W25dfHx0W2ktMV0sci5zK2EqKDIqKDEtYSkqKHIuY3Atci5zKSthKihyLmUtci5zKSl9O3JldHVybiBzfSxyLmdldEJsZW5kTW9kZT1mdW5jdGlvbih0KXtpZighdClyZXR1cm4gcy5OT1JNQUw7Zm9yKHQ9dC50b1VwcGVyQ2FzZSgpO3QuaW5kZXhPZihcIiBcIik+PTA7KXQ9dC5yZXBsYWNlKFwiIFwiLFwiX1wiKTtyZXR1cm4gc1t0XXx8cy5OT1JNQUx9LGkuZXhwb3J0cz1yfSx7fV0sNTpbZnVuY3Rpb24odCxpLGUpe1widXNlIHN0cmljdFwiO3ZhciBzPXQoXCIuL1BhcnRpY2xlVXRpbHNcIiksYT10KFwiLi9QYXJ0aWNsZVwiKSxyPWZ1bmN0aW9uKHQpe2EuY2FsbCh0aGlzLHQpLHRoaXMucGF0aD1udWxsLHRoaXMuaW5pdGlhbFJvdGF0aW9uPTAsdGhpcy5pbml0aWFsUG9zaXRpb249bmV3IFBJWEkuUG9pbnQsdGhpcy5tb3ZlbWVudD0wfSxuPWEucHJvdG90eXBlLG89ci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShuKSxoPW5ldyBQSVhJLlBvaW50O28uaW5pdD1mdW5jdGlvbigpe3RoaXMuaW5pdGlhbFJvdGF0aW9uPXRoaXMucm90YXRpb24sdGhpcy5QYXJ0aWNsZV9pbml0KCksdGhpcy5wYXRoPXRoaXMuZXh0cmFEYXRhLnBhdGgsdGhpcy5fZG9Ob3JtYWxNb3ZlbWVudD0hdGhpcy5wYXRoLHRoaXMubW92ZW1lbnQ9MCx0aGlzLmluaXRpYWxQb3NpdGlvbi54PXRoaXMucG9zaXRpb24ueCx0aGlzLmluaXRpYWxQb3NpdGlvbi55PXRoaXMucG9zaXRpb24ueX07Zm9yKHZhciBsPVtcInBvd1wiLFwic3FydFwiLFwiYWJzXCIsXCJmbG9vclwiLFwicm91bmRcIixcImNlaWxcIixcIkVcIixcIlBJXCIsXCJzaW5cIixcImNvc1wiLFwidGFuXCIsXCJhc2luXCIsXCJhY29zXCIsXCJhdGFuXCIsXCJhdGFuMlwiLFwibG9nXCJdLHA9XCJbMDEyMzQ1Njc4OTBcXFxcLlxcXFwqXFxcXC1cXFxcK1xcXFwvXFxcXChcXFxcKXggLF1cIixjPWwubGVuZ3RoLTE7Yz49MDstLWMpcCs9XCJ8XCIrbFtjXTtwPW5ldyBSZWdFeHAocCxcImdcIik7dmFyIGQ9ZnVuY3Rpb24odCl7Zm9yKHZhciBpPXQubWF0Y2gocCksZT1pLmxlbmd0aC0xO2U+PTA7LS1lKWwuaW5kZXhPZihpW2VdKT49MCYmKGlbZV09XCJNYXRoLlwiK2lbZV0pO3JldHVybiB0PWkuam9pbihcIlwiKSxuZXcgRnVuY3Rpb24oXCJ4XCIsXCJyZXR1cm4gXCIrdCtcIjtcIil9O28udXBkYXRlPWZ1bmN0aW9uKHQpe3ZhciBpPXRoaXMuUGFydGljbGVfdXBkYXRlKHQpO2lmKGk+PTAmJnRoaXMucGF0aCl7dmFyIGU9KHRoaXMuZW5kU3BlZWQtdGhpcy5zdGFydFNwZWVkKSppK3RoaXMuc3RhcnRTcGVlZDt0aGlzLm1vdmVtZW50Kz1lKnQsaC54PXRoaXMubW92ZW1lbnQsaC55PXRoaXMucGF0aCh0aGlzLm1vdmVtZW50KSxzLnJvdGF0ZVBvaW50KHRoaXMuaW5pdGlhbFJvdGF0aW9uLGgpLHRoaXMucG9zaXRpb24ueD10aGlzLmluaXRpYWxQb3NpdGlvbi54K2gueCx0aGlzLnBvc2l0aW9uLnk9dGhpcy5pbml0aWFsUG9zaXRpb24ueStoLnl9fSxvLlBhcnRpY2xlX2Rlc3Ryb3k9YS5wcm90b3R5cGUuZGVzdHJveSxvLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLlBhcnRpY2xlX2Rlc3Ryb3koKSx0aGlzLnBhdGg9dGhpcy5pbml0aWFsUG9zaXRpb249bnVsbH0sci5wYXJzZUFydD1mdW5jdGlvbih0KXtyZXR1cm4gYS5wYXJzZUFydCh0KX0sci5wYXJzZURhdGE9ZnVuY3Rpb24odCl7dmFyIGk9e307aWYodCYmdC5wYXRoKXRyeXtpLnBhdGg9ZCh0LnBhdGgpfWNhdGNoKHQpe3MudmVyYm9zZSYmY29uc29sZS5lcnJvcihcIlBhdGhQYXJ0aWNsZTogZXJyb3IgaW4gcGFyc2luZyBwYXRoIGV4cHJlc3Npb25cIiksaS5wYXRoPW51bGx9ZWxzZSBzLnZlcmJvc2UmJmNvbnNvbGUuZXJyb3IoXCJQYXRoUGFydGljbGUgcmVxdWlyZXMgYSBwYXRoIHN0cmluZyBpbiBleHRyYURhdGEhXCIpLGkucGF0aD1udWxsO3JldHVybiBpfSxpLmV4cG9ydHM9cn0se1wiLi9QYXJ0aWNsZVwiOjMsXCIuL1BhcnRpY2xlVXRpbHNcIjo0fV0sNjpbZnVuY3Rpb24odCxpLGUpe30se31dLDc6W2Z1bmN0aW9uKHQsaSxlKXtlLlBhcnRpY2xlVXRpbHM9dChcIi4vUGFydGljbGVVdGlscy5qc1wiKSxlLlBhcnRpY2xlPXQoXCIuL1BhcnRpY2xlLmpzXCIpLGUuRW1pdHRlcj10KFwiLi9FbWl0dGVyLmpzXCIpLGUuUGF0aFBhcnRpY2xlPXQoXCIuL1BhdGhQYXJ0aWNsZS5qc1wiKSxlLkFuaW1hdGVkUGFydGljbGU9dChcIi4vQW5pbWF0ZWRQYXJ0aWNsZS5qc1wiKSx0KFwiLi9kZXByZWNhdGlvbi5qc1wiKX0se1wiLi9BbmltYXRlZFBhcnRpY2xlLmpzXCI6MSxcIi4vRW1pdHRlci5qc1wiOjIsXCIuL1BhcnRpY2xlLmpzXCI6MyxcIi4vUGFydGljbGVVdGlscy5qc1wiOjQsXCIuL1BhdGhQYXJ0aWNsZS5qc1wiOjUsXCIuL2RlcHJlY2F0aW9uLmpzXCI6Nn1dLDg6W2Z1bmN0aW9uKHQsaSxlKXtcInVzZSBzdHJpY3RcIjt2YXIgcz1cInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzpHTE9CQUw7aWYocy5QSVhJLnBhcnRpY2xlc3x8KHMuUElYSS5wYXJ0aWNsZXM9e30pLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBpJiZpLmV4cG9ydHMpXCJ1bmRlZmluZWRcIj09dHlwZW9mIFBJWEkmJnQoXCJwaXhpLmpzXCIpLGkuZXhwb3J0cz1zLlBJWEkucGFydGljbGVzfHxhO2Vsc2UgaWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFBJWEkpdGhyb3dcInBpeGktcGFydGljbGVzIHJlcXVpcmVzIHBpeGkuanMgdG8gYmUgbG9hZGVkIGZpcnN0XCI7dmFyIGE9dChcIi4vcGFydGljbGVzXCIpO2Zvcih2YXIgciBpbiBhKXMuUElYSS5wYXJ0aWNsZXNbcl09YVtyXX0se1wiLi9wYXJ0aWNsZXNcIjo3LFwicGl4aS5qc1wiOnZvaWQgMH1dfSx7fSxbOF0pKDgpfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLXBhcnRpY2xlcy5taW4uanMubWFwXG4iLCJ2YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHV0aWxzO1xyXG4gICAgKGZ1bmN0aW9uICh1dGlscykge1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUluZGljZXNGb3JRdWFkcyhzaXplKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbEluZGljZXMgPSBzaXplICogNjtcclxuICAgICAgICAgICAgdmFyIGluZGljZXMgPSBuZXcgVWludDE2QXJyYXkodG90YWxJbmRpY2VzKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgdG90YWxJbmRpY2VzOyBpICs9IDYsIGogKz0gNCkge1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgMF0gPSBqICsgMDtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDFdID0gaiArIDE7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAyXSA9IGogKyAyO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgM10gPSBqICsgMDtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDRdID0gaiArIDI7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyA1XSA9IGogKyAzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2VzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5jcmVhdGVJbmRpY2VzRm9yUXVhZHMgPSBjcmVhdGVJbmRpY2VzRm9yUXVhZHM7XHJcbiAgICAgICAgZnVuY3Rpb24gaXNQb3cyKHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuICEodiAmICh2IC0gMSkpICYmICghIXYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5pc1BvdzIgPSBpc1BvdzI7XHJcbiAgICAgICAgZnVuY3Rpb24gbmV4dFBvdzIodikge1xyXG4gICAgICAgICAgICB2ICs9ICsodiA9PT0gMCk7XHJcbiAgICAgICAgICAgIC0tdjtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiAxO1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDI7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gNDtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiA4O1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDE2O1xyXG4gICAgICAgICAgICByZXR1cm4gdiArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLm5leHRQb3cyID0gbmV4dFBvdzI7XHJcbiAgICAgICAgZnVuY3Rpb24gbG9nMih2KSB7XHJcbiAgICAgICAgICAgIHZhciByLCBzaGlmdDtcclxuICAgICAgICAgICAgciA9ICsodiA+IDB4RkZGRikgPDwgNDtcclxuICAgICAgICAgICAgdiA+Pj49IHI7XHJcbiAgICAgICAgICAgIHNoaWZ0ID0gKyh2ID4gMHhGRikgPDwgMztcclxuICAgICAgICAgICAgdiA+Pj49IHNoaWZ0O1xyXG4gICAgICAgICAgICByIHw9IHNoaWZ0O1xyXG4gICAgICAgICAgICBzaGlmdCA9ICsodiA+IDB4RikgPDwgMjtcclxuICAgICAgICAgICAgdiA+Pj49IHNoaWZ0O1xyXG4gICAgICAgICAgICByIHw9IHNoaWZ0O1xyXG4gICAgICAgICAgICBzaGlmdCA9ICsodiA+IDB4MykgPDwgMTtcclxuICAgICAgICAgICAgdiA+Pj49IHNoaWZ0O1xyXG4gICAgICAgICAgICByIHw9IHNoaWZ0O1xyXG4gICAgICAgICAgICByZXR1cm4gciB8ICh2ID4+IDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5sb2cyID0gbG9nMjtcclxuICAgICAgICBmdW5jdGlvbiBnZXRJbnRlcnNlY3Rpb25GYWN0b3IocDEsIHAyLCBwMywgcDQsIG91dCkge1xyXG4gICAgICAgICAgICB2YXIgQTEgPSBwMi54IC0gcDEueCwgQjEgPSBwMy54IC0gcDQueCwgQzEgPSBwMy54IC0gcDEueDtcclxuICAgICAgICAgICAgdmFyIEEyID0gcDIueSAtIHAxLnksIEIyID0gcDMueSAtIHA0LnksIEMyID0gcDMueSAtIHAxLnk7XHJcbiAgICAgICAgICAgIHZhciBEID0gQTEgKiBCMiAtIEEyICogQjE7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhEKSA8IDFlLTcpIHtcclxuICAgICAgICAgICAgICAgIG91dC54ID0gQTE7XHJcbiAgICAgICAgICAgICAgICBvdXQueSA9IEEyO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIFQgPSBDMSAqIEIyIC0gQzIgKiBCMTtcclxuICAgICAgICAgICAgdmFyIFUgPSBBMSAqIEMyIC0gQTIgKiBDMTtcclxuICAgICAgICAgICAgdmFyIHQgPSBUIC8gRCwgdSA9IFUgLyBEO1xyXG4gICAgICAgICAgICBpZiAodSA8ICgxZS02KSB8fCB1IC0gMSA+IC0xZS02KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0LnggPSBwMS54ICsgdCAqIChwMi54IC0gcDEueCk7XHJcbiAgICAgICAgICAgIG91dC55ID0gcDEueSArIHQgKiAocDIueSAtIHAxLnkpO1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuZ2V0SW50ZXJzZWN0aW9uRmFjdG9yID0gZ2V0SW50ZXJzZWN0aW9uRmFjdG9yO1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBvc2l0aW9uRnJvbVF1YWQocCwgYW5jaG9yLCBvdXQpIHtcclxuICAgICAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhMSA9IDEuMCAtIGFuY2hvci54LCBhMiA9IDEuMCAtIGExO1xyXG4gICAgICAgICAgICB2YXIgYjEgPSAxLjAgLSBhbmNob3IueSwgYjIgPSAxLjAgLSBiMTtcclxuICAgICAgICAgICAgb3V0LnggPSAocFswXS54ICogYTEgKyBwWzFdLnggKiBhMikgKiBiMSArIChwWzNdLnggKiBhMSArIHBbMl0ueCAqIGEyKSAqIGIyO1xyXG4gICAgICAgICAgICBvdXQueSA9IChwWzBdLnkgKiBhMSArIHBbMV0ueSAqIGEyKSAqIGIxICsgKHBbM10ueSAqIGExICsgcFsyXS55ICogYTIpICogYjI7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmdldFBvc2l0aW9uRnJvbVF1YWQgPSBnZXRQb3NpdGlvbkZyb21RdWFkO1xyXG4gICAgfSkodXRpbHMgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMgfHwgKHBpeGlfcHJvamVjdGlvbi51dGlscyA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxuUElYSS5wcm9qZWN0aW9uID0gcGl4aV9wcm9qZWN0aW9uO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFByb2plY3Rpb24gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb24obGVnYWN5LCBlbmFibGUpIHtcclxuICAgICAgICAgICAgaWYgKGVuYWJsZSA9PT0gdm9pZCAwKSB7IGVuYWJsZSA9IHRydWU7IH1cclxuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmxlZ2FjeSA9IGxlZ2FjeTtcclxuICAgICAgICAgICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmxlZ2FjeS5wcm9qID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb24ucHJvdG90eXBlLCBcImVuYWJsZWRcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBQcm9qZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uID0gUHJvamVjdGlvbjtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHdlYmdsO1xyXG4gICAgKGZ1bmN0aW9uICh3ZWJnbCkge1xyXG4gICAgICAgIHZhciBCYXRjaEJ1ZmZlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEJhdGNoQnVmZmVyKHNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXMgPSBuZXcgQXJyYXlCdWZmZXIoc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb2F0MzJWaWV3ID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnZlcnRpY2VzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheSh0aGlzLnZlcnRpY2VzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBCYXRjaEJ1ZmZlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXMgPSBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gQmF0Y2hCdWZmZXI7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICB3ZWJnbC5CYXRjaEJ1ZmZlciA9IEJhdGNoQnVmZmVyO1xyXG4gICAgfSkod2ViZ2wgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wgfHwgKHBpeGlfcHJvamVjdGlvbi53ZWJnbCA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB3ZWJnbDtcclxuICAgIChmdW5jdGlvbiAod2ViZ2wpIHtcclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlcih2ZXJ0ZXhTcmMsIGZyYWdtZW50U3JjLCBnbCwgbWF4VGV4dHVyZXMpIHtcclxuICAgICAgICAgICAgZnJhZ21lbnRTcmMgPSBmcmFnbWVudFNyYy5yZXBsYWNlKC8lY291bnQlL2dpLCBtYXhUZXh0dXJlcyArICcnKTtcclxuICAgICAgICAgICAgZnJhZ21lbnRTcmMgPSBmcmFnbWVudFNyYy5yZXBsYWNlKC8lZm9ybG9vcCUvZ2ksIGdlbmVyYXRlU2FtcGxlU3JjKG1heFRleHR1cmVzKSk7XHJcbiAgICAgICAgICAgIHZhciBzaGFkZXIgPSBuZXcgUElYSS5TaGFkZXIoZ2wsIHZlcnRleFNyYywgZnJhZ21lbnRTcmMpO1xyXG4gICAgICAgICAgICB2YXIgc2FtcGxlVmFsdWVzID0gbmV3IEludDMyQXJyYXkobWF4VGV4dHVyZXMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heFRleHR1cmVzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHNhbXBsZVZhbHVlc1tpXSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2hhZGVyLmJpbmQoKTtcclxuICAgICAgICAgICAgc2hhZGVyLnVuaWZvcm1zLnVTYW1wbGVycyA9IHNhbXBsZVZhbHVlcztcclxuICAgICAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2ViZ2wuZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXIgPSBnZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlcjtcclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVNhbXBsZVNyYyhtYXhUZXh0dXJlcykge1xyXG4gICAgICAgICAgICB2YXIgc3JjID0gJyc7XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heFRleHR1cmVzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYyArPSAnXFxuZWxzZSAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCBtYXhUZXh0dXJlcyAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzcmMgKz0gXCJpZih0ZXh0dXJlSWQgPT0gXCIgKyBpICsgXCIuMClcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNyYyArPSAnXFxueyc7XHJcbiAgICAgICAgICAgICAgICBzcmMgKz0gXCJcXG5cXHRjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlcnNbXCIgKyBpICsgXCJdLCB0ZXh0dXJlQ29vcmQpO1wiO1xyXG4gICAgICAgICAgICAgICAgc3JjICs9ICdcXG59JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgcmV0dXJuIHNyYztcclxuICAgICAgICB9XHJcbiAgICB9KSh3ZWJnbCA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbCB8fCAocGl4aV9wcm9qZWN0aW9uLndlYmdsID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB3ZWJnbDtcclxuICAgIChmdW5jdGlvbiAod2ViZ2wpIHtcclxuICAgICAgICB2YXIgT2JqZWN0UmVuZGVyZXIgPSBQSVhJLk9iamVjdFJlbmRlcmVyO1xyXG4gICAgICAgIHZhciBzZXR0aW5ncyA9IFBJWEkuc2V0dGluZ3M7XHJcbiAgICAgICAgdmFyIEdMQnVmZmVyID0gUElYSS5nbENvcmUuR0xCdWZmZXI7XHJcbiAgICAgICAgdmFyIHByZW11bHRpcGx5VGludCA9IFBJWEkudXRpbHMucHJlbXVsdGlwbHlUaW50O1xyXG4gICAgICAgIHZhciBwcmVtdWx0aXBseUJsZW5kTW9kZSA9IFBJWEkudXRpbHMucHJlbXVsdGlwbHlCbGVuZE1vZGU7XHJcbiAgICAgICAgdmFyIFRJQ0sgPSAwO1xyXG4gICAgICAgIHZhciBCYXRjaEdyb3VwID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gQmF0Y2hHcm91cCgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWRzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNpemUgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsZW5kID0gUElYSS5CTEVORF9NT0RFUy5OT1JNQUw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmF0Y2hHcm91cDtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIHdlYmdsLkJhdGNoR3JvdXAgPSBCYXRjaEdyb3VwO1xyXG4gICAgICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgIF9fZXh0ZW5kcyhNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIocmVuZGVyZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHJlbmRlcmVyKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMID0gMzI7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0U2l6ZSA9IDU7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0Qnl0ZVNpemUgPSBfdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zaXplID0gc2V0dGluZ3MuU1BSSVRFX0JBVENIX1NJWkU7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc3ByaXRlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydGV4QnVmZmVycyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFvcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFvTWF4ID0gMjtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFUyA9IDE7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5pbmRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLmNyZWF0ZUluZGljZXNGb3JRdWFkcyhfdGhpcy5zaXplKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBfdGhpcy5zaXplOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5ncm91cHNba10gPSBuZXcgQmF0Y2hHcm91cCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFvTWF4ID0gMjtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJlbmRlcmVyLm9uKCdwcmVyZW5kZXInLCBfdGhpcy5vblByZXJlbmRlciwgX3RoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5nZXRVbmlmb3JtcyA9IGZ1bmN0aW9uIChzcHIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuc3luY1VuaWZvcm1zID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvYmopXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNoID0gdGhpcy5zaGFkZXI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2gudW5pZm9ybXNba2V5XSA9IG9ialtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUub25Db250ZXh0Q2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuTUFYX1RFWFRVUkVTID0gTWF0aC5taW4odGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwsIHRoaXMucmVuZGVyZXIucGx1Z2luc1snc3ByaXRlJ10uTUFYX1RFWFRVUkVTKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyID0gd2ViZ2wuZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXIodGhpcy5zaGFkZXJWZXJ0LCB0aGlzLnNoYWRlckZyYWcsIGdsLCB0aGlzLk1BWF9URVhUVVJFUyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gR0xCdWZmZXIuY3JlYXRlSW5kZXhCdWZmZXIoZ2wsIHRoaXMuaW5kaWNlcywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVmFvKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52YW9NYXg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLnZlcnRleEJ1ZmZlcnNbaV0gPSBHTEJ1ZmZlci5jcmVhdGVWZXJ0ZXhCdWZmZXIoZ2wsIG51bGwsIGdsLlNUUkVBTV9EUkFXKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb3NbaV0gPSB0aGlzLmNyZWF0ZVZhbyh2ZXJ0ZXhCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJ1ZmZlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBwaXhpX3Byb2plY3Rpb24udXRpbHMubmV4dFBvdzIodGhpcy5zaXplKTsgaSAqPSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVycy5wdXNoKG5ldyB3ZWJnbC5CYXRjaEJ1ZmZlcihpICogNCAqIHRoaXMudmVydEJ5dGVTaXplKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52YW8gPSB0aGlzLnZhb3NbMF07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5vblByZXJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID49IHRoaXMuc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmx1c2goKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghc3ByaXRlLl90ZXh0dXJlLl91dnMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNwcml0ZS5fdGV4dHVyZS5iYXNlVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlc1t0aGlzLmN1cnJlbnRJbmRleCsrXSA9IHNwcml0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLmZsdXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgICAgIHZhciBNQVhfVEVYVFVSRVMgPSB0aGlzLk1BWF9URVhUVVJFUztcclxuICAgICAgICAgICAgICAgIHZhciBucDIgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMubmV4dFBvdzIodGhpcy5jdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvZzIgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMubG9nMihucDIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyc1tsb2cyXTtcclxuICAgICAgICAgICAgICAgIHZhciBzcHJpdGVzID0gdGhpcy5zcHJpdGVzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZsb2F0MzJWaWV3ID0gYnVmZmVyLmZsb2F0MzJWaWV3O1xyXG4gICAgICAgICAgICAgICAgdmFyIHVpbnQzMlZpZXcgPSBidWZmZXIudWludDMyVmlldztcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciBncm91cENvdW50ID0gMTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRHcm91cCA9IGdyb3Vwc1swXTtcclxuICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICAgICAgdmFyIHV2cztcclxuICAgICAgICAgICAgICAgIHZhciBibGVuZE1vZGUgPSBwcmVtdWx0aXBseUJsZW5kTW9kZVtzcHJpdGVzWzBdLl90ZXh0dXJlLmJhc2VUZXh0dXJlLnByZW11bHRpcGxpZWRBbHBoYSA/IDEgOiAwXVtzcHJpdGVzWzBdLmJsZW5kTW9kZV07XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuYmxlbmQgPSBibGVuZE1vZGU7XHJcbiAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnRJbmRleDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwcml0ZSA9IHNwcml0ZXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFRleHR1cmUgPSBzcHJpdGUuX3RleHR1cmUuYmFzZVRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwcml0ZUJsZW5kTW9kZSA9IHByZW11bHRpcGx5QmxlbmRNb2RlW051bWJlcihuZXh0VGV4dHVyZS5wcmVtdWx0aXBsaWVkQWxwaGEpXVtzcHJpdGUuYmxlbmRNb2RlXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxlbmRNb2RlICE9PSBzcHJpdGVCbGVuZE1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxlbmRNb2RlID0gc3ByaXRlQmxlbmRNb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCA9IE1BWF9URVhUVVJFUztcclxuICAgICAgICAgICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdW5pZm9ybXMgPSB0aGlzLmdldFVuaWZvcm1zKHNwcml0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRVbmlmb3JtcyAhPT0gdW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVuaWZvcm1zID0gdW5pZm9ybXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50ID0gTUFYX1RFWFRVUkVTO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGV4dHVyZSAhPT0gbmV4dFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHR1cmUgPSBuZXh0VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRUZXh0dXJlLl9lbmFibGVkICE9PSBUSUNLKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dHVyZUNvdW50ID09PSBNQVhfVEVYVFVSRVMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc2l6ZSA9IGkgLSBjdXJyZW50R3JvdXAuc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwID0gZ3JvdXBzW2dyb3VwQ291bnQrK107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmJsZW5kID0gYmxlbmRNb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zdGFydCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnVuaWZvcm1zID0gY3VycmVudFVuaWZvcm1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFRleHR1cmUuX2VuYWJsZWQgPSBUSUNLO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFRleHR1cmUuX3ZpcnRhbEJvdW5kSWQgPSB0ZXh0dXJlQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudGV4dHVyZXNbY3VycmVudEdyb3VwLnRleHR1cmVDb3VudCsrXSA9IG5leHRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFscGhhID0gTWF0aC5taW4oc3ByaXRlLndvcmxkQWxwaGEsIDEuMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ2IgPSBhbHBoYSA8IDEuMCAmJiBuZXh0VGV4dHVyZS5wcmVtdWx0aXBsaWVkQWxwaGEgPyBwcmVtdWx0aXBseVRpbnQoc3ByaXRlLl90aW50UkdCLCBhbHBoYSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBzcHJpdGUuX3RpbnRSR0IgKyAoYWxwaGEgKiAyNTUgPDwgMjQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbFZlcnRpY2VzKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCBuZXh0VGV4dHVyZS5fdmlydGFsQm91bmRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggKz0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc2l6ZSA9IGkgLSBjdXJyZW50R3JvdXAuc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNldHRpbmdzLkNBTl9VUExPQURfU0FNRV9CVUZGRVIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YW9NYXggPD0gdGhpcy52ZXJ0ZXhDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb01heCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmVydGV4QnVmZmVyID0gdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdID0gR0xCdWZmZXIuY3JlYXRlVmVydGV4QnVmZmVyKGdsLCBudWxsLCBnbC5TVFJFQU1fRFJBVyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFvc1t0aGlzLnZlcnRleENvdW50XSA9IHRoaXMuY3JlYXRlVmFvKHZlcnRleEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFZhbyh0aGlzLnZhb3NbdGhpcy52ZXJ0ZXhDb3VudF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XS51cGxvYWQoYnVmZmVyLnZlcnRpY2VzLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdLnVwbG9hZChidWZmZXIudmVydGljZXMsIDAsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudFVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBncm91cENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBncm91cHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwVGV4dHVyZUNvdW50ID0gZ3JvdXAudGV4dHVyZUNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cC51bmlmb3JtcyAhPT0gY3VycmVudFVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3luY1VuaWZvcm1zKGdyb3VwLnVuaWZvcm1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBncm91cFRleHR1cmVDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFRleHR1cmUoZ3JvdXAudGV4dHVyZXNbal0sIGosIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cC50ZXh0dXJlc1tqXS5fdmlydGFsQm91bmRJZCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zLnNhbXBsZXJTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdlswXSA9IGdyb3VwLnRleHR1cmVzW2pdLnJlYWxXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZbMV0gPSBncm91cC50ZXh0dXJlc1tqXS5yZWFsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIudW5pZm9ybXMuc2FtcGxlclNpemUgPSB2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc3RhdGUuc2V0QmxlbmRNb2RlKGdyb3VwLmJsZW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kcmF3RWxlbWVudHMoZ2wuVFJJQU5HTEVTLCBncm91cC5zaXplICogNiwgZ2wuVU5TSUdORURfU0hPUlQsIGdyb3VwLnN0YXJ0ICogNiAqIDIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRTaGFkZXIodGhpcy5zaGFkZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNBTl9VUExPQURfU0FNRV9CVUZGRVIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRWYW8odGhpcy52YW9zW3RoaXMudmVydGV4Q291bnRdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0uYmluZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmx1c2goKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmFvTWF4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0ZXhCdWZmZXJzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhb3NbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9zW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5vZmYoJ3ByZXJlbmRlcicsIHRoaXMub25QcmVyZW5kZXIsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zaGFkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYWRlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFvcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kaWNlcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1ZmZlcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcnNbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICAgICAgfShPYmplY3RSZW5kZXJlcikpO1xyXG4gICAgICAgIHdlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB9KSh3ZWJnbCA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbCB8fCAocGl4aV9wcm9qZWN0aW9uLndlYmdsID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHAgPSBbbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKV07XHJcbiAgICB2YXIgYSA9IFswLCAwLCAwLCAwXTtcclxuICAgIHZhciBTdXJmYWNlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBTdXJmYWNlKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cmZhY2VJRCA9IFwiZGVmYXVsdFwiO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVJRCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4U3JjID0gXCJcIjtcclxuICAgICAgICAgICAgdGhpcy5mcmFnbWVudFNyYyA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFN1cmZhY2UucHJvdG90eXBlLmZpbGxVbmlmb3JtcyA9IGZ1bmN0aW9uICh1bmlmb3Jtcykge1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdXJmYWNlLnByb3RvdHlwZS5ib3VuZHNRdWFkID0gZnVuY3Rpb24gKHYsIG91dCwgYWZ0ZXIpIHtcclxuICAgICAgICAgICAgdmFyIG1pblggPSBvdXRbMF0sIG1pblkgPSBvdXRbMV07XHJcbiAgICAgICAgICAgIHZhciBtYXhYID0gb3V0WzBdLCBtYXhZID0gb3V0WzFdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMjsgaSA8IDg7IGkgKz0gMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pblggPiBvdXRbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWluWCA9IG91dFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXhYIDwgb3V0W2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIG1heFggPSBvdXRbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAobWluWSA+IG91dFtpICsgMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWluWSA9IG91dFtpICsgMV07XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4WSA8IG91dFtpICsgMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4WSA9IG91dFtpICsgMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcFswXS5zZXQobWluWCwgbWluWSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFswXSwgcFswXSk7XHJcbiAgICAgICAgICAgIHBbMV0uc2V0KG1heFgsIG1pblkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbMV0sIHBbMV0pO1xyXG4gICAgICAgICAgICBwWzJdLnNldChtYXhYLCBtYXhZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzJdLCBwWzJdKTtcclxuICAgICAgICAgICAgcFszXS5zZXQobWluWCwgbWF4WSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFszXSwgcFszXSk7XHJcbiAgICAgICAgICAgIGlmIChhZnRlcikge1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFswXSwgcFswXSk7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzFdLCBwWzFdKTtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbMl0sIHBbMl0pO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFszXSwgcFszXSk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMF0gPSBwWzBdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbMV0gPSBwWzBdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMl0gPSBwWzFdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbM10gPSBwWzFdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNF0gPSBwWzJdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbNV0gPSBwWzJdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNl0gPSBwWzNdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbN10gPSBwWzNdLnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocFtpXS55IDwgcFswXS55IHx8IHBbaV0ueSA9PSBwWzBdLnkgJiYgcFtpXS54IDwgcFswXS54KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gcFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcFswXSA9IHBbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBbaV0gPSB0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFbaV0gPSBNYXRoLmF0YW4yKHBbaV0ueSAtIHBbMF0ueSwgcFtpXS54IC0gcFswXS54KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBpICsgMTsgaiA8PSAzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFbaV0gPiBhW2pdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IHBbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwW2ldID0gcFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBbal0gPSB0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQyID0gYVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFbaV0gPSBhW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYVtqXSA9IHQyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3V0WzBdID0gcFswXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzFdID0gcFswXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzJdID0gcFsxXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzNdID0gcFsxXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzRdID0gcFsyXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzVdID0gcFsyXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzZdID0gcFszXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzddID0gcFszXS55O1xyXG4gICAgICAgICAgICAgICAgaWYgKChwWzNdLnggLSBwWzJdLngpICogKHBbMV0ueSAtIHBbMl0ueSkgLSAocFsxXS54IC0gcFsyXS54KSAqIChwWzNdLnkgLSBwWzJdLnkpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dFs0XSA9IHBbM10ueDtcclxuICAgICAgICAgICAgICAgICAgICBvdXRbNV0gPSBwWzNdLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3VyZmFjZTtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3VyZmFjZSA9IFN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICB2YXIgdGVtcFJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoKTtcclxuICAgIHZhciB0ZW1wUG9pbnQgPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgdmFyIEJpbGluZWFyU3VyZmFjZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKEJpbGluZWFyU3VyZmFjZSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBCaWxpbmVhclN1cmZhY2UoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLmRpc3RvcnRpb24gPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzdG9ydGlvbi5zZXQoMCwgMCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgZCA9IHRoaXMuZGlzdG9ydGlvbjtcclxuICAgICAgICAgICAgdmFyIG0gPSBwb3MueCAqIHBvcy55O1xyXG4gICAgICAgICAgICBuZXdQb3MueCA9IHBvcy54ICsgZC54ICogbTtcclxuICAgICAgICAgICAgbmV3UG9zLnkgPSBwb3MueSArIGQueSAqIG07XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIHZ4ID0gcG9zLngsIHZ5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBkeCA9IHRoaXMuZGlzdG9ydGlvbi54LCBkeSA9IHRoaXMuZGlzdG9ydGlvbi55O1xyXG4gICAgICAgICAgICBpZiAoZHggPT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHZ4O1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2eSAvICgxLjAgKyBkeSAqIHZ4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkeSA9PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdnk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHZ4IC8gKDEuMCArIGR4ICogdnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSAodnkgKiBkeCAtIHZ4ICogZHkgKyAxLjApICogMC41IC8gZHk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IGIgKiBiICsgdnggLyBkeTtcclxuICAgICAgICAgICAgICAgIGlmIChkIDw9IDAuMDAwMDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQb3Muc2V0KE5hTiwgTmFOKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZHkgPiAwLjApIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQb3MueCA9IC1iICsgTWF0aC5zcXJ0KGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnggPSAtYiAtIE1hdGguc3FydChkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gKHZ4IC8gbmV3UG9zLnggLSAxLjApIC8gZHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUubWFwU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGVtcFJlY3QueCA9IC1zcHJpdGUuYW5jaG9yLnggKiB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QueSA9IC1zcHJpdGUuYW5jaG9yLnkgKiB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LndpZHRoID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LmhlaWdodCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwUXVhZCh0ZW1wUmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtIHx8IHNwcml0ZS50cmFuc2Zvcm0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5tYXBRdWFkID0gZnVuY3Rpb24gKHJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgYXggPSAtcmVjdC54IC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gLXJlY3QueSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXgyID0gKDEuMCAtIHJlY3QueCkgLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkyID0gKDEuMCAtIHJlY3QueSkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIHVwMXggPSAocXVhZFswXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMXkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMnggPSAocXVhZFswXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXggPSAocXVhZFszXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsyXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheDIpICsgcXVhZFsyXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB4MDAgPSB1cDF4ICogKDEuMCAtIGF5KSArIGRvd24xeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTAwID0gdXAxeSAqICgxLjAgLSBheSkgKyBkb3duMXkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgxMCA9IHVwMnggKiAoMS4wIC0gYXkpICsgZG93bjJ4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MTAgPSB1cDJ5ICogKDEuMCAtIGF5KSArIGRvd24yeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDAxID0gdXAxeCAqICgxLjAgLSBheTIpICsgZG93bjF4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTAxID0gdXAxeSAqICgxLjAgLSBheTIpICsgZG93bjF5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeDExID0gdXAyeCAqICgxLjAgLSBheTIpICsgZG93bjJ4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTExID0gdXAyeSAqICgxLjAgLSBheTIpICsgZG93bjJ5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgbWF0ID0gdGVtcE1hdDtcclxuICAgICAgICAgICAgbWF0LnR4ID0geDAwO1xyXG4gICAgICAgICAgICBtYXQudHkgPSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5hID0geDEwIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuYiA9IHkxMCAtIHkwMDtcclxuICAgICAgICAgICAgbWF0LmMgPSB4MDEgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5kID0geTAxIC0geTAwO1xyXG4gICAgICAgICAgICB0ZW1wUG9pbnQuc2V0KHgxMSwgeTExKTtcclxuICAgICAgICAgICAgbWF0LmFwcGx5SW52ZXJzZSh0ZW1wUG9pbnQsIHRlbXBQb2ludCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzdG9ydGlvbi5zZXQodGVtcFBvaW50LnggLSAxLCB0ZW1wUG9pbnQueSAtIDEpO1xyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2V0RnJvbU1hdHJpeChtYXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuZmlsbFVuaWZvcm1zID0gZnVuY3Rpb24gKHVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb24gPSB1bmlmb3Jtcy5kaXN0b3J0aW9uIHx8IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDAsIDAsIDBdKTtcclxuICAgICAgICAgICAgdmFyIGF4ID0gTWF0aC5hYnModGhpcy5kaXN0b3J0aW9uLngpO1xyXG4gICAgICAgICAgICB2YXIgYXkgPSBNYXRoLmFicyh0aGlzLmRpc3RvcnRpb24ueSk7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bMF0gPSBheCAqIDEwMDAwIDw9IGF5ID8gMCA6IHRoaXMuZGlzdG9ydGlvbi54O1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzFdID0gYXkgKiAxMDAwMCA8PSBheCA/IDAgOiB0aGlzLmRpc3RvcnRpb24ueTtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblsyXSA9IDEuMCAvIHVuaWZvcm1zLmRpc3RvcnRpb25bMF07XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bM10gPSAxLjAgLyB1bmlmb3Jtcy5kaXN0b3J0aW9uWzFdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIEJpbGluZWFyU3VyZmFjZTtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlN1cmZhY2UpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5CaWxpbmVhclN1cmZhY2UgPSBCaWxpbmVhclN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBDb250YWluZXIycyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKENvbnRhaW5lcjJzLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIENvbnRhaW5lcjJzKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZShfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb250YWluZXIycy5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBDb250YWluZXIycztcclxuICAgIH0oUElYSS5Db250YWluZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Db250YWluZXIycyA9IENvbnRhaW5lcjJzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgZnVuID0gUElYSS5UcmFuc2Zvcm1TdGF0aWMucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybTtcclxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUhhY2socGFyZW50VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmFyIHByb2ogPSB0aGlzLnByb2o7XHJcbiAgICAgICAgdmFyIHBwID0gcGFyZW50VHJhbnNmb3JtLnByb2o7XHJcbiAgICAgICAgdmFyIHRhID0gdGhpcztcclxuICAgICAgICBpZiAoIXBwKSB7XHJcbiAgICAgICAgICAgIGZ1bi5jYWxsKHRoaXMsIHBhcmVudFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHByb2ouX2FjdGl2ZVByb2plY3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwcC5fc3VyZmFjZSkge1xyXG4gICAgICAgICAgICBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uID0gcHA7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTG9jYWxUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhbFRyYW5zZm9ybS5jb3B5KHRoaXMud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBpZiAodGEuX3BhcmVudElEIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgKyt0YS5fd29ybGRJRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bi5jYWxsKHRoaXMsIHBhcmVudFRyYW5zZm9ybSk7XHJcbiAgICAgICAgcHJvai5fYWN0aXZlUHJvamVjdGlvbiA9IHBwLl9hY3RpdmVQcm9qZWN0aW9uO1xyXG4gICAgfVxyXG4gICAgdmFyIFByb2plY3Rpb25TdXJmYWNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoUHJvamVjdGlvblN1cmZhY2UsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvblN1cmZhY2UobGVnYWN5LCBlbmFibGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbGVnYWN5LCBlbmFibGUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLl9zdXJmYWNlID0gbnVsbDtcclxuICAgICAgICAgICAgX3RoaXMuX2FjdGl2ZVByb2plY3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICBfdGhpcy5fY3VycmVudFN1cmZhY2VJRCA9IC0xO1xyXG4gICAgICAgICAgICBfdGhpcy5fY3VycmVudExlZ2FjeUlEID0gLTE7XHJcbiAgICAgICAgICAgIF90aGlzLl9sYXN0VW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUsIFwiZW5hYmxlZFwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuX2VuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1IYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gUElYSS5UcmFuc2Zvcm1TdGF0aWMucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZSwgXCJzdXJmYWNlXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3VyZmFjZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlID09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3VyZmFjZSA9IHZhbHVlIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmFwcGx5UGFydGlhbCA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN1cmZhY2UuYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLnN1cmZhY2UuYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24uX3N1cmZhY2UuYXBwbHlJbnZlcnNlKG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1cmZhY2UuYXBwbHlJbnZlcnNlKG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKHBvcywgbmV3UG9zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5tYXBCaWxpbmVhclNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQpIHtcclxuICAgICAgICAgICAgaWYgKCEodGhpcy5fc3VyZmFjZSBpbnN0YW5jZW9mIHBpeGlfcHJvamVjdGlvbi5CaWxpbmVhclN1cmZhY2UpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cmZhY2UgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLkJpbGluZWFyU3VyZmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VyZmFjZS5tYXBTcHJpdGUoc3ByaXRlLCBxdWFkLCB0aGlzLmxlZ2FjeSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cmZhY2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VyZmFjZS5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLCBcInVuaWZvcm1zXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudExlZ2FjeUlEID09PSB0aGlzLmxlZ2FjeS5fd29ybGRJRCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTdXJmYWNlSUQgPT09IHRoaXMuc3VyZmFjZS5fdXBkYXRlSUQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGFzdFVuaWZvcm1zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFVuaWZvcm1zID0gdGhpcy5fbGFzdFVuaWZvcm1zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFVuaWZvcm1zLndvcmxkVHJhbnNmb3JtID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0udG9BcnJheSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1cmZhY2UuZmlsbFVuaWZvcm1zKHRoaXMuX2xhc3RVbmlmb3Jtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGFzdFVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvblN1cmZhY2U7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UgPSBQcm9qZWN0aW9uU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgdmFyIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGVCaWxpbmVhclJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5zaXplID0gMTAwO1xyXG4gICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwgPSAxO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczE7XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMjtcXG5hdHRyaWJ1dGUgdmVjNCBhRnJhbWU7XFxuYXR0cmlidXRlIHZlYzQgYUNvbG9yO1xcbmF0dHJpYnV0ZSBmbG9hdCBhVGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB3b3JsZFRyYW5zZm9ybTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIHdvcmxkVHJhbnNmb3JtICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuICAgIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVZlcnRleFBvc2l0aW9uO1xcbiAgICB2VHJhbnMxID0gYVRyYW5zMTtcXG4gICAgdlRyYW5zMiA9IGFUcmFuczI7XFxuICAgIHZUZXh0dXJlSWQgPSBhVGV4dHVyZUlkO1xcbiAgICB2Q29sb3IgPSBhQ29sb3I7XFxuICAgIHZGcmFtZSA9IGFGcmFtZTtcXG59XFxuXCI7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyc1slY291bnQlXTtcXG51bmlmb3JtIHZlYzIgc2FtcGxlclNpemVbJWNvdW50JV07IFxcbnVuaWZvcm0gdmVjNCBkaXN0b3J0aW9uO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG52ZWMyIHN1cmZhY2U7XFxudmVjMiBzdXJmYWNlMjtcXG5cXG5mbG9hdCB2eCA9IHZUZXh0dXJlQ29vcmQueDtcXG5mbG9hdCB2eSA9IHZUZXh0dXJlQ29vcmQueTtcXG5mbG9hdCBkeCA9IGRpc3RvcnRpb24ueDtcXG5mbG9hdCBkeSA9IGRpc3RvcnRpb24ueTtcXG5mbG9hdCByZXZ4ID0gZGlzdG9ydGlvbi56O1xcbmZsb2F0IHJldnkgPSBkaXN0b3J0aW9uLnc7XFxuXFxuaWYgKGRpc3RvcnRpb24ueCA9PSAwLjApIHtcXG4gICAgc3VyZmFjZS54ID0gdng7XFxuICAgIHN1cmZhY2UueSA9IHZ5IC8gKDEuMCArIGR5ICogdngpO1xcbiAgICBzdXJmYWNlMiA9IHN1cmZhY2U7XFxufSBlbHNlXFxuaWYgKGRpc3RvcnRpb24ueSA9PSAwLjApIHtcXG4gICAgc3VyZmFjZS55ID0gdnk7XFxuICAgIHN1cmZhY2UueCA9IHZ4LyAoMS4wICsgZHggKiB2eSk7XFxuICAgIHN1cmZhY2UyID0gc3VyZmFjZTtcXG59IGVsc2Uge1xcbiAgICBmbG9hdCBjID0gdnkgKiBkeCAtIHZ4ICogZHk7XFxuICAgIGZsb2F0IGIgPSAoYyArIDEuMCkgKiAwLjU7XFxuICAgIGZsb2F0IGIyID0gKC1jICsgMS4wKSAqIDAuNTtcXG4gICAgZmxvYXQgZCA9IGIgKiBiICsgdnggKiBkeTtcXG4gICAgaWYgKGQgPCAtMC4wMDAwMSkge1xcbiAgICAgICAgZGlzY2FyZDtcXG4gICAgfVxcbiAgICBkID0gc3FydChtYXgoZCwgMC4wKSk7XFxuICAgIHN1cmZhY2UueCA9ICgtIGIgKyBkKSAqIHJldnk7XFxuICAgIHN1cmZhY2UyLnggPSAoLSBiIC0gZCkgKiByZXZ5O1xcbiAgICBzdXJmYWNlLnkgPSAoLSBiMiArIGQpICogcmV2eDtcXG4gICAgc3VyZmFjZTIueSA9ICgtIGIyIC0gZCkgKiByZXZ4O1xcbn1cXG5cXG52ZWMyIHV2O1xcbnV2LnggPSB2VHJhbnMxLnggKiBzdXJmYWNlLnggKyB2VHJhbnMxLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMxLno7XFxudXYueSA9IHZUcmFuczIueCAqIHN1cmZhY2UueCArIHZUcmFuczIueSAqIHN1cmZhY2UueSArIHZUcmFuczIuejtcXG5cXG52ZWMyIHBpeGVscyA9IHV2ICogc2FtcGxlclNpemVbMF07XFxuXFxuaWYgKHBpeGVscy54IDwgdkZyYW1lLnggfHwgcGl4ZWxzLnggPiB2RnJhbWUueiB8fFxcbiAgICBwaXhlbHMueSA8IHZGcmFtZS55IHx8IHBpeGVscy55ID4gdkZyYW1lLncpIHtcXG4gICAgdXYueCA9IHZUcmFuczEueCAqIHN1cmZhY2UyLnggKyB2VHJhbnMxLnkgKiBzdXJmYWNlMi55ICsgdlRyYW5zMS56O1xcbiAgICB1di55ID0gdlRyYW5zMi54ICogc3VyZmFjZTIueCArIHZUcmFuczIueSAqIHN1cmZhY2UyLnkgKyB2VHJhbnMyLno7XFxuICAgIHBpeGVscyA9IHV2ICogc2FtcGxlclNpemVbMF07XFxuICAgIFxcbiAgICBpZiAocGl4ZWxzLnggPCB2RnJhbWUueCB8fCBwaXhlbHMueCA+IHZGcmFtZS56IHx8XFxuICAgICAgICBwaXhlbHMueSA8IHZGcmFtZS55IHx8IHBpeGVscy55ID4gdkZyYW1lLncpIHtcXG4gICAgICAgIGRpc2NhcmQ7XFxuICAgIH1cXG59XFxuXFxudmVjNCBlZGdlO1xcbmVkZ2UueHkgPSBjbGFtcChwaXhlbHMgLSB2RnJhbWUueHkgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuZWRnZS56dyA9IGNsYW1wKHZGcmFtZS56dyAtIHBpeGVscyArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5cXG5mbG9hdCBhbHBoYSA9IDEuMDsgLy9lZGdlLnggKiBlZGdlLnkgKiBlZGdlLnogKiBlZGdlLnc7XFxudmVjNCByQ29sb3IgPSB2Q29sb3IgKiBhbHBoYTtcXG5cXG5mbG9hdCB0ZXh0dXJlSWQgPSBmbG9vcih2VGV4dHVyZUlkKzAuNSk7XFxudmVjNCBjb2xvcjtcXG52ZWMyIHRleHR1cmVDb29yZCA9IHV2O1xcbiVmb3Jsb29wJVxcbmdsX0ZyYWdDb2xvciA9IGNvbG9yICogckNvbG9yO1xcbn1cIjtcclxuICAgICAgICAgICAgX3RoaXMuZGVmVW5pZm9ybXMgPSB7XHJcbiAgICAgICAgICAgICAgICB3b3JsZFRyYW5zZm9ybTogbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV0pLFxyXG4gICAgICAgICAgICAgICAgZGlzdG9ydGlvbjogbmV3IEZsb2F0MzJBcnJheShbMCwgMF0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlQmlsaW5lYXJSZW5kZXJlci5wcm90b3R5cGUuZ2V0VW5pZm9ybXMgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9qID0gc3ByaXRlLnByb2o7XHJcbiAgICAgICAgICAgIHZhciBzaGFkZXIgPSB0aGlzLnNoYWRlcjtcclxuICAgICAgICAgICAgaWYgKHByb2ouc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2oudW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb2ouX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZlVuaWZvcm1zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlQmlsaW5lYXJSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlVmFvID0gZnVuY3Rpb24gKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRTaXplID0gMTQ7XHJcbiAgICAgICAgICAgIHRoaXMudmVydEJ5dGVTaXplID0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHZhciB2YW8gPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZVZhbygpXHJcbiAgICAgICAgICAgICAgICAuYWRkSW5kZXgodGhpcy5pbmRleEJ1ZmZlcilcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDApXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMiAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNSAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUZyYW1lLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA4ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hQ29sb3IsIGdsLlVOU0lHTkVEX0JZVEUsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCAxMiAqIDQpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cnMuYVRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICAgICAgdmFvLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlSWQsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEzICogNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIucHJvdG90eXBlLmZpbGxWZXJ0aWNlcyA9IGZ1bmN0aW9uIChmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgdGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gc3ByaXRlLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB3ID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXggPSBzcHJpdGUuX2FuY2hvci5feDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gc3ByaXRlLl9hbmNob3IuX3k7XHJcbiAgICAgICAgICAgIHZhciBmcmFtZSA9IHRleC5fZnJhbWU7XHJcbiAgICAgICAgICAgIHZhciBhVHJhbnMgPSBzcHJpdGUuYVRyYW5zO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVtpICogMl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVtpICogMiArIDFdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IGFUcmFucy5hO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAzXSA9IGFUcmFucy5jO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA0XSA9IGFUcmFucy50eDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNV0gPSBhVHJhbnMuYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSBhVHJhbnMuZDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSBhVHJhbnMudHk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gZnJhbWUueDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOV0gPSBmcmFtZS55O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMF0gPSBmcmFtZS54ICsgZnJhbWUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDExXSA9IGZyYW1lLnkgKyBmcmFtZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMTJdID0gYXJnYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdGV4dHVyZUlkO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGVCaWxpbmVhclJlbmRlcmVyO1xyXG4gICAgfShNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcikpO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdzcHJpdGVfYmlsaW5lYXInLCBTcHJpdGVCaWxpbmVhclJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgdmFyIFNwcml0ZVN0cmFuZ2VSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZVN0cmFuZ2VSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGVTdHJhbmdlUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5zaXplID0gMTAwO1xyXG4gICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwgPSAxO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczE7XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMjtcXG5hdHRyaWJ1dGUgdmVjNCBhRnJhbWU7XFxuYXR0cmlidXRlIHZlYzQgYUNvbG9yO1xcbmF0dHJpYnV0ZSBmbG9hdCBhVGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB3b3JsZFRyYW5zZm9ybTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIHdvcmxkVHJhbnNmb3JtICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuICAgIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVZlcnRleFBvc2l0aW9uO1xcbiAgICB2VHJhbnMxID0gYVRyYW5zMTtcXG4gICAgdlRyYW5zMiA9IGFUcmFuczI7XFxuICAgIHZUZXh0dXJlSWQgPSBhVGV4dHVyZUlkO1xcbiAgICB2Q29sb3IgPSBhQ29sb3I7XFxuICAgIHZGcmFtZSA9IGFGcmFtZTtcXG59XFxuXCI7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyc1slY291bnQlXTtcXG51bmlmb3JtIHZlYzIgc2FtcGxlclNpemVbJWNvdW50JV07IFxcbnVuaWZvcm0gdmVjNCBwYXJhbXM7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbnZlYzIgc3VyZmFjZTtcXG5cXG5mbG9hdCB2eCA9IHZUZXh0dXJlQ29vcmQueDtcXG5mbG9hdCB2eSA9IHZUZXh0dXJlQ29vcmQueTtcXG5mbG9hdCBhbGVwaCA9IHBhcmFtcy54O1xcbmZsb2F0IGJldCA9IHBhcmFtcy55O1xcbmZsb2F0IEEgPSBwYXJhbXMuejtcXG5mbG9hdCBCID0gcGFyYW1zLnc7XFxuXFxuaWYgKGFsZXBoID09IDAuMCkge1xcblxcdHN1cmZhY2UueSA9IHZ5IC8gKDEuMCArIHZ4ICogYmV0KTtcXG5cXHRzdXJmYWNlLnggPSB2eDtcXG59XFxuZWxzZSBpZiAoYmV0ID09IDAuMCkge1xcblxcdHN1cmZhY2UueCA9IHZ4IC8gKDEuMCArIHZ5ICogYWxlcGgpO1xcblxcdHN1cmZhY2UueSA9IHZ5O1xcbn0gZWxzZSB7XFxuXFx0c3VyZmFjZS54ID0gdnggKiAoYmV0ICsgMS4wKSAvIChiZXQgKyAxLjAgKyB2eSAqIGFsZXBoKTtcXG5cXHRzdXJmYWNlLnkgPSB2eSAqIChhbGVwaCArIDEuMCkgLyAoYWxlcGggKyAxLjAgKyB2eCAqIGJldCk7XFxufVxcblxcbnZlYzIgdXY7XFxudXYueCA9IHZUcmFuczEueCAqIHN1cmZhY2UueCArIHZUcmFuczEueSAqIHN1cmZhY2UueSArIHZUcmFuczEuejtcXG51di55ID0gdlRyYW5zMi54ICogc3VyZmFjZS54ICsgdlRyYW5zMi55ICogc3VyZmFjZS55ICsgdlRyYW5zMi56O1xcblxcbnZlYzIgcGl4ZWxzID0gdXYgKiBzYW1wbGVyU2l6ZVswXTtcXG5cXG52ZWM0IGVkZ2U7XFxuZWRnZS54eSA9IGNsYW1wKHBpeGVscyAtIHZGcmFtZS54eSArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5lZGdlLnp3ID0gY2xhbXAodkZyYW1lLnp3IC0gcGl4ZWxzICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcblxcbmZsb2F0IGFscGhhID0gZWRnZS54ICogZWRnZS55ICogZWRnZS56ICogZWRnZS53O1xcbnZlYzQgckNvbG9yID0gdkNvbG9yICogYWxwaGE7XFxuXFxuZmxvYXQgdGV4dHVyZUlkID0gZmxvb3IodlRleHR1cmVJZCswLjUpO1xcbnZlYzQgY29sb3I7XFxudmVjMiB0ZXh0dXJlQ29vcmQgPSB1djtcXG4lZm9ybG9vcCVcXG5nbF9GcmFnQ29sb3IgPSBjb2xvciAqIHJDb2xvcjtcXG59XCI7XHJcbiAgICAgICAgICAgIF90aGlzLmRlZlVuaWZvcm1zID0ge1xyXG4gICAgICAgICAgICAgICAgd29ybGRUcmFuc2Zvcm06IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdKSxcclxuICAgICAgICAgICAgICAgIGRpc3RvcnRpb246IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDBdKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZVN0cmFuZ2VSZW5kZXJlci5wcm90b3R5cGUuZ2V0VW5pZm9ybXMgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9qID0gc3ByaXRlLnByb2o7XHJcbiAgICAgICAgICAgIHZhciBzaGFkZXIgPSB0aGlzLnNoYWRlcjtcclxuICAgICAgICAgICAgaWYgKHByb2ouc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2oudW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb2ouX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZlVuaWZvcm1zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlU3RyYW5nZVJlbmRlcmVyLnByb3RvdHlwZS5jcmVhdGVWYW8gPSBmdW5jdGlvbiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudmVydFNpemUgPSAxNDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0Qnl0ZVNpemUgPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdmFyIHZhbyA9IHRoaXMucmVuZGVyZXIuY3JlYXRlVmFvKClcclxuICAgICAgICAgICAgICAgIC5hZGRJbmRleCh0aGlzLmluZGV4QnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFWZXJ0ZXhQb3NpdGlvbiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMxLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAyICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMyLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA1ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hRnJhbWUsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDggKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFDb2xvciwgZ2wuVU5TSUdORURfQllURSwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEyICogNCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5hVGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YW8uYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVJZCwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTMgKiA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFvO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlU3RyYW5nZVJlbmRlcmVyLnByb3RvdHlwZS5maWxsVmVydGljZXMgPSBmdW5jdGlvbiAoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIHRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHNwcml0ZS52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdyA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4ID0gc3ByaXRlLl9hbmNob3IuX3g7XHJcbiAgICAgICAgICAgIHZhciBheSA9IHNwcml0ZS5fYW5jaG9yLl95O1xyXG4gICAgICAgICAgICB2YXIgZnJhbWUgPSB0ZXguX2ZyYW1lO1xyXG4gICAgICAgICAgICB2YXIgYVRyYW5zID0gc3ByaXRlLmFUcmFucztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbaSAqIDJdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbaSAqIDIgKyAxXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSBhVHJhbnMuYTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgM10gPSBhVHJhbnMuYztcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNF0gPSBhVHJhbnMudHg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDVdID0gYVRyYW5zLmI7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gYVRyYW5zLmQ7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gYVRyYW5zLnR5O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IGZyYW1lLng7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDldID0gZnJhbWUueTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTBdID0gZnJhbWUueCArIGZyYW1lLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMV0gPSBmcmFtZS55ICsgZnJhbWUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDEyXSA9IGFyZ2I7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHRleHR1cmVJZDtcclxuICAgICAgICAgICAgICAgIGluZGV4ICs9IDE0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlU3RyYW5nZVJlbmRlcmVyO1xyXG4gICAgfShNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcikpO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdzcHJpdGVfc3RyYW5nZScsIFNwcml0ZVN0cmFuZ2VSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICB2YXIgdGVtcFJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoKTtcclxuICAgIHZhciB0ZW1wUG9pbnQgPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgdmFyIFN0cmFuZ2VTdXJmYWNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3RyYW5nZVN1cmZhY2UsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3RyYW5nZVN1cmZhY2UoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnBhcmFtcyA9IFswLCAwLCBOYU4sIE5hTl07XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBwWzBdID0gMDtcclxuICAgICAgICAgICAgcFsxXSA9IDA7XHJcbiAgICAgICAgICAgIHBbMl0gPSBOYU47XHJcbiAgICAgICAgICAgIHBbM10gPSBOYU47XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuc2V0QXhpc1ggPSBmdW5jdGlvbiAocG9zLCBmYWN0b3IsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54LCB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgcm90ID0gb3V0VHJhbnNmb3JtLnJvdGF0aW9uO1xyXG4gICAgICAgICAgICBpZiAocm90ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feCAtPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feSArPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0ucm90YXRpb24gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3LnkgPSBNYXRoLmF0YW4yKHksIHgpO1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwWzJdID0gLWQgKiBmYWN0b3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwWzJdID0gTmFOO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGMwMSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLnNldEF4aXNZID0gZnVuY3Rpb24gKHBvcywgZmFjdG9yLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueCwgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIHJvdCA9IG91dFRyYW5zZm9ybS5yb3RhdGlvbjtcclxuICAgICAgICAgICAgaWYgKHJvdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3ggLT0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3kgKz0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnJvdGF0aW9uID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy54ID0gLU1hdGguYXRhbjIoeSwgeCkgKyBNYXRoLlBJIC8gMjtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgaWYgKGZhY3RvciAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcFszXSA9IC1kICogZmFjdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcFszXSA9IE5hTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jYWxjMDEoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5fY2FsYzAxID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4ocFsyXSkpIHtcclxuICAgICAgICAgICAgICAgIHBbMV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKHBbM10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gMS4wIC8gcFszXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihwWzNdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMV0gPSAxLjAgLyBwWzJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSAxLjAgLSBwWzJdICogcFszXTtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gKDEuMCAtIHBbMl0pIC8gZDtcclxuICAgICAgICAgICAgICAgICAgICBwWzFdID0gKDEuMCAtIHBbM10pIC8gZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYWxlcGggPSB0aGlzLnBhcmFtc1swXSwgYmV0ID0gdGhpcy5wYXJhbXNbMV0sIEEgPSB0aGlzLnBhcmFtc1syXSwgQiA9IHRoaXMucGFyYW1zWzNdO1xyXG4gICAgICAgICAgICB2YXIgdSA9IHBvcy54LCB2ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIGlmIChhbGVwaCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHYgKiAoMSArIHUgKiBiZXQpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGJldCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHUgKiAoMSArIHYgKiBhbGVwaCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgRCA9IEEgKiBCIC0gdiAqIHU7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IEEgKiB1ICogKEIgKyB2KSAvIEQ7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IEIgKiB2ICogKEEgKyB1KSAvIEQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhbGVwaCA9IHRoaXMucGFyYW1zWzBdLCBiZXQgPSB0aGlzLnBhcmFtc1sxXSwgQSA9IHRoaXMucGFyYW1zWzJdLCBCID0gdGhpcy5wYXJhbXNbM107XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLngsIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgaWYgKGFsZXBoID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0geSAvICgxICsgeCAqIGJldCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYmV0ID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0geCAqICgxICsgeSAqIGFsZXBoKTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0geTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0geCAqIChiZXQgKyAxKSAvIChiZXQgKyAxICsgeSAqIGFsZXBoKTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0geSAqIChhbGVwaCArIDEpIC8gKGFsZXBoICsgMSArIHggKiBiZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUubWFwU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGVtcFJlY3QueCA9IC1zcHJpdGUuYW5jaG9yLnggKiB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QueSA9IC1zcHJpdGUuYW5jaG9yLnkgKiB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LndpZHRoID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LmhlaWdodCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwUXVhZCh0ZW1wUmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtIHx8IHNwcml0ZS50cmFuc2Zvcm0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLm1hcFF1YWQgPSBmdW5jdGlvbiAocmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciBheCA9IC1yZWN0LnggLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkgPSAtcmVjdC55IC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheDIgPSAoMS4wIC0gcmVjdC54KSAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheTIgPSAoMS4wIC0gcmVjdC55KSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgdXAxeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsxXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAxeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsxXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB1cDJ5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheDIpICsgcXVhZFsxXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsyXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnggPSAocXVhZFszXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheDIpICsgcXVhZFsyXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHgwMCA9IHVwMXggKiAoMS4wIC0gYXkpICsgZG93bjF4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MDAgPSB1cDF5ICogKDEuMCAtIGF5KSArIGRvd24xeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDEwID0gdXAyeCAqICgxLjAgLSBheSkgKyBkb3duMnggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkxMCA9IHVwMnkgKiAoMS4wIC0gYXkpICsgZG93bjJ5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MDEgPSB1cDF4ICogKDEuMCAtIGF5MikgKyBkb3duMXggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MDEgPSB1cDF5ICogKDEuMCAtIGF5MikgKyBkb3duMXkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB4MTEgPSB1cDJ4ICogKDEuMCAtIGF5MikgKyBkb3duMnggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MTEgPSB1cDJ5ICogKDEuMCAtIGF5MikgKyBkb3duMnkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciBtYXQgPSB0ZW1wTWF0O1xyXG4gICAgICAgICAgICBtYXQudHggPSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC50eSA9IHkwMDtcclxuICAgICAgICAgICAgbWF0LmEgPSB4MTAgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5iID0geTEwIC0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYyA9IHgwMSAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmQgPSB5MDEgLSB5MDA7XHJcbiAgICAgICAgICAgIHRlbXBQb2ludC5zZXQoeDExLCB5MTEpO1xyXG4gICAgICAgICAgICBtYXQuYXBwbHlJbnZlcnNlKHRlbXBQb2ludCwgdGVtcFBvaW50KTtcclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNldEZyb21NYXRyaXgobWF0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuZmlsbFVuaWZvcm1zID0gZnVuY3Rpb24gKHVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgdmFyIGRpc3RvcnRpb24gPSB1bmlmb3Jtcy5wYXJhbXMgfHwgbmV3IEZsb2F0MzJBcnJheShbMCwgMCwgMCwgMF0pO1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5wYXJhbXMgPSBkaXN0b3J0aW9uO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzBdID0gcGFyYW1zWzBdO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzFdID0gcGFyYW1zWzFdO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzJdID0gcGFyYW1zWzJdO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzNdID0gcGFyYW1zWzNdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFN0cmFuZ2VTdXJmYWNlO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uU3VyZmFjZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlN0cmFuZ2VTdXJmYWNlID0gU3RyYW5nZVN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIFBJWEkuU3ByaXRlLnByb3RvdHlwZS5jb252ZXJ0VG8ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZV9iaWxpbmVhcic7XHJcbiAgICAgICAgdGhpcy5hVHJhbnMgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxuICAgICAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFRvMnMuY2FsbCh0aGlzKTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFRvMnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRTdWJ0cmVlVG8ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNvbnZlcnRUbzJzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29udmVydFN1YnRyZWVUbzJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFNwcml0ZTJzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlMnMsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlMnModGV4dHVyZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0dXJlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5hVHJhbnMgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGVfYmlsaW5lYXInO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZTJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcygpO1xyXG4gICAgICAgICAgICB0aGlzLl9ib3VuZHMuYWRkUXVhZCh0aGlzLnZlcnRleFRyaW1tZWREYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNmb3JtSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1JRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUlEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRyaW0gPSB0ZXh0dXJlLnRyaW07XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAwO1xyXG4gICAgICAgICAgICBpZiAodHJpbSkge1xyXG4gICAgICAgICAgICAgICAgdzEgPSB0cmltLnggLSAoYW5jaG9yLl94ICogb3JpZy53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgdHJpbS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gdHJpbS55IC0gKGFuY2hvci5feSAqIG9yaWcuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyB0cmltLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX3N1cmZhY2UpIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSBoMDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSBoMDtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvai5fc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IHd0LmE7XHJcbiAgICAgICAgICAgICAgICB2YXIgYiA9IHd0LmI7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHd0LmM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHd0LmQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHggPSB3dC50eDtcclxuICAgICAgICAgICAgICAgIHZhciB0eSA9IHd0LnR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IChhICogdzEpICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSAoZCAqIGgxKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gKGEgKiB3MCkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IChkICogaDEpICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSAoYSAqIHcwKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gKGQgKiBoMCkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IChhICogdzEpICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSAoZCAqIGgwKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRleHR1cmUudHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlLnRyYW5zZm9ybSA9IG5ldyBQSVhJLmV4dHJhcy5UZXh0dXJlVHJhbnNmb3JtKHRleHR1cmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRleHR1cmUudHJhbnNmb3JtLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgYVRyYW5zID0gdGhpcy5hVHJhbnM7XHJcbiAgICAgICAgICAgIGFUcmFucy5zZXQob3JpZy53aWR0aCwgMCwgMCwgb3JpZy5oZWlnaHQsIHcxLCBoMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX3N1cmZhY2UgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFUcmFucy5wcmVwZW5kKHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhVHJhbnMuaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgIGFUcmFucy5wcmVwZW5kKHRleHR1cmUudHJhbnNmb3JtLm1hcENvb3JkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZlcnRleFRyaW1tZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleFRyaW1tZWREYXRhID0gbmV3IEZsb2F0MzJBcnJheSg4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4VHJpbW1lZERhdGE7XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX3N1cmZhY2UpIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSBoMDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSBoMDtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvai5fc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEsIHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB3dCA9IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSB3dC5hO1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSB3dC5iO1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSB3dC5jO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSB3dC5kO1xyXG4gICAgICAgICAgICAgICAgdmFyIHR4ID0gd3QudHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHkgPSB3dC50eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSAoYSAqIHcxKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gKGQgKiBoMSkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IChhICogdzApICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSAoZCAqIGgxKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gKGEgKiB3MCkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IChkICogaDApICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSAoYSAqIHcxKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gKGQgKiBoMCkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSwgdGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uLmxlZ2FjeS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTcHJpdGUycy5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBTcHJpdGUycztcclxuICAgIH0oUElYSS5TcHJpdGUpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycyA9IFNwcml0ZTJzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgVGV4dDJzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoVGV4dDJzLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFRleHQycyh0ZXh0LCBzdHlsZSwgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHQsIHN0eWxlLCBjYW52YXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLmFUcmFucyA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZShfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZV9iaWxpbmVhcic7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRleHQycy5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBUZXh0MnM7XHJcbiAgICB9KFBJWEkuVGV4dCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlRleHQycyA9IFRleHQycztcclxuICAgIFRleHQycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgVGV4dDJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgIFRleHQycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgZnVuY3Rpb24gY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgfVxyXG4gICAgcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0gPSBjb250YWluZXIyZFdvcmxkVHJhbnNmb3JtO1xyXG4gICAgdmFyIENvbnRhaW5lcjJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQ29udGFpbmVyMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gQ29udGFpbmVyMmQoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb250YWluZXIyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBDb250YWluZXIyZDtcclxuICAgIH0oUElYSS5Db250YWluZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Db250YWluZXIyZCA9IENvbnRhaW5lcjJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgUG9pbnQgPSBQSVhJLlBvaW50O1xyXG4gICAgdmFyIG1hdDNpZCA9IFsxLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAxXTtcclxuICAgIHZhciBBRkZJTkU7XHJcbiAgICAoZnVuY3Rpb24gKEFGRklORSkge1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJOT05FXCJdID0gMF0gPSBcIk5PTkVcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiRlJFRVwiXSA9IDFdID0gXCJGUkVFXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIkFYSVNfWFwiXSA9IDJdID0gXCJBWElTX1hcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiQVhJU19ZXCJdID0gM10gPSBcIkFYSVNfWVwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJQT0lOVFwiXSA9IDRdID0gXCJQT0lOVFwiO1xyXG4gICAgfSkoQUZGSU5FID0gcGl4aV9wcm9qZWN0aW9uLkFGRklORSB8fCAocGl4aV9wcm9qZWN0aW9uLkFGRklORSA9IHt9KSk7XHJcbiAgICB2YXIgTWF0cml4MmQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIE1hdHJpeDJkKGJhY2tpbmdBcnJheSkge1xyXG4gICAgICAgICAgICB0aGlzLmZsb2F0QXJyYXkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLm1hdDMgPSBuZXcgRmxvYXQ2NEFycmF5KGJhY2tpbmdBcnJheSB8fCBtYXQzaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImFcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbMF07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbMF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJiXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzFdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzFdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiY1wiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1szXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1szXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImRcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbNF07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbNF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJ0eFwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1s2XTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1s2XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcInR5XCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzddO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzddID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgdHgsIHR5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gYTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IGI7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gYztcclxuICAgICAgICAgICAgbWF0M1s0XSA9IGQ7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gdHg7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSB0eTtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAodHJhbnNwb3NlLCBvdXQpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZsb2F0QXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXRBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoOSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gb3V0IHx8IHRoaXMuZmxvYXRBcnJheTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIGlmICh0cmFuc3Bvc2UpIHtcclxuICAgICAgICAgICAgICAgIGFycmF5WzBdID0gbWF0M1swXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzFdID0gbWF0M1sxXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzJdID0gbWF0M1syXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzNdID0gbWF0M1szXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzRdID0gbWF0M1s0XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzVdID0gbWF0M1s1XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzZdID0gbWF0M1s2XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzddID0gbWF0M1s3XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzhdID0gbWF0M1s4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFycmF5WzBdID0gbWF0M1swXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzFdID0gbWF0M1szXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzJdID0gbWF0M1s2XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzNdID0gbWF0M1sxXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzRdID0gbWF0M1s0XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzVdID0gbWF0M1s3XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzZdID0gbWF0M1syXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzddID0gbWF0M1s1XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzhdID0gbWF0M1s4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54O1xyXG4gICAgICAgICAgICB2YXIgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgeiA9IDEuMCAvIChtYXQzWzJdICogeCArIG1hdDNbNV0gKiB5ICsgbWF0M1s4XSk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy54ID0geiAqIChtYXQzWzBdICogeCArIG1hdDNbM10gKiB5ICsgbWF0M1s2XSk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy55ID0geiAqIChtYXQzWzFdICogeCArIG1hdDNbNF0gKiB5ICsgbWF0M1s3XSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKHR4LCB0eSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSArPSB0eCAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbMV0gKz0gdHkgKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzNdICs9IHR4ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s0XSArPSB0eSAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNl0gKz0gdHggKiBtYXQzWzhdO1xyXG4gICAgICAgICAgICBtYXQzWzddICs9IHR5ICogbWF0M1s4XTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSAqPSB4O1xyXG4gICAgICAgICAgICBtYXQzWzFdICo9IHk7XHJcbiAgICAgICAgICAgIG1hdDNbM10gKj0geDtcclxuICAgICAgICAgICAgbWF0M1s0XSAqPSB5O1xyXG4gICAgICAgICAgICBtYXQzWzZdICo9IHg7XHJcbiAgICAgICAgICAgIG1hdDNbN10gKj0geTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2NhbGVBbmRUcmFuc2xhdGUgPSBmdW5jdGlvbiAoc2NhbGVYLCBzY2FsZVksIHR4LCB0eSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHNjYWxlWCAqIG1hdDNbMF0gKyB0eCAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBzY2FsZVkgKiBtYXQzWzFdICsgdHkgKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gc2NhbGVYICogbWF0M1szXSArIHR4ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHNjYWxlWSAqIG1hdDNbNF0gKyB0eSAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSBzY2FsZVggKiBtYXQzWzZdICsgdHggKiBtYXQzWzhdO1xyXG4gICAgICAgICAgICBtYXQzWzddID0gc2NhbGVZICogbWF0M1s3XSArIHR5ICogbWF0M1s4XTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueDtcclxuICAgICAgICAgICAgdmFyIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbM10sIGEwMiA9IGFbNl0sIGExMCA9IGFbMV0sIGExMSA9IGFbNF0sIGExMiA9IGFbN10sIGEyMCA9IGFbMl0sIGEyMSA9IGFbNV0sIGEyMiA9IGFbOF07XHJcbiAgICAgICAgICAgIHZhciBuZXdYID0gKGEyMiAqIGExMSAtIGExMiAqIGEyMSkgKiB4ICsgKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogeSArIChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpO1xyXG4gICAgICAgICAgICB2YXIgbmV3WSA9ICgtYTIyICogYTEwICsgYTEyICogYTIwKSAqIHggKyAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIHkgKyAoLWExMiAqIGEwMCArIGEwMiAqIGExMCk7XHJcbiAgICAgICAgICAgIHZhciBuZXdaID0gKGEyMSAqIGExMCAtIGExMSAqIGEyMCkgKiB4ICsgKC1hMjEgKiBhMDAgKyBhMDEgKiBhMjApICogeSArIChhMTEgKiBhMDAgLSBhMDEgKiBhMTApO1xyXG4gICAgICAgICAgICBuZXdQb3MueCA9IG5ld1ggLyBuZXdaO1xyXG4gICAgICAgICAgICBuZXdQb3MueSA9IG5ld1kgLyBuZXdaO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLCBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdLCBiMDEgPSBhMjIgKiBhMTEgLSBhMTIgKiBhMjEsIGIxMSA9IC1hMjIgKiBhMTAgKyBhMTIgKiBhMjAsIGIyMSA9IGEyMSAqIGExMCAtIGExMSAqIGEyMDtcclxuICAgICAgICAgICAgdmFyIGRldCA9IGEwMCAqIGIwMSArIGEwMSAqIGIxMSArIGEwMiAqIGIyMTtcclxuICAgICAgICAgICAgaWYgKCFkZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRldCA9IDEuMCAvIGRldDtcclxuICAgICAgICAgICAgYVswXSA9IGIwMSAqIGRldDtcclxuICAgICAgICAgICAgYVsxXSA9ICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIGRldDtcclxuICAgICAgICAgICAgYVsyXSA9IChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpICogZGV0O1xyXG4gICAgICAgICAgICBhWzNdID0gYjExICogZGV0O1xyXG4gICAgICAgICAgICBhWzRdID0gKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbNV0gPSAoLWExMiAqIGEwMCArIGEwMiAqIGExMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbNl0gPSBiMjEgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbN10gPSAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbOF0gPSAoYTExICogYTAwIC0gYTAxICogYTEwKSAqIGRldDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuaWRlbnRpdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gMTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgyZCh0aGlzLm1hdDMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNvcHlUbyA9IGZ1bmN0aW9uIChtYXRyaXgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhcjIgPSBtYXRyaXgubWF0MztcclxuICAgICAgICAgICAgYXIyWzBdID0gbWF0M1swXTtcclxuICAgICAgICAgICAgYXIyWzFdID0gbWF0M1sxXTtcclxuICAgICAgICAgICAgYXIyWzJdID0gbWF0M1syXTtcclxuICAgICAgICAgICAgYXIyWzNdID0gbWF0M1szXTtcclxuICAgICAgICAgICAgYXIyWzRdID0gbWF0M1s0XTtcclxuICAgICAgICAgICAgYXIyWzVdID0gbWF0M1s1XTtcclxuICAgICAgICAgICAgYXIyWzZdID0gbWF0M1s2XTtcclxuICAgICAgICAgICAgYXIyWzddID0gbWF0M1s3XTtcclxuICAgICAgICAgICAgYXIyWzhdID0gbWF0M1s4XTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKG1hdHJpeCwgYWZmaW5lKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgZCA9IDEuMCAvIG1hdDNbOF07XHJcbiAgICAgICAgICAgIHZhciB0eCA9IG1hdDNbNl0gKiBkLCB0eSA9IG1hdDNbN10gKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguYSA9IChtYXQzWzBdIC0gbWF0M1syXSAqIHR4KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5iID0gKG1hdDNbMV0gLSBtYXQzWzJdICogdHkpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmMgPSAobWF0M1szXSAtIG1hdDNbNV0gKiB0eCkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguZCA9IChtYXQzWzRdIC0gbWF0M1s1XSAqIHR5KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC50eCA9IHR4O1xyXG4gICAgICAgICAgICBtYXRyaXgudHkgPSB0eTtcclxuICAgICAgICAgICAgaWYgKGFmZmluZSA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWZmaW5lID09PSBBRkZJTkUuUE9JTlQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmIgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5jID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguZCA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhZmZpbmUgPT09IEFGRklORS5BWElTX1gpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYyA9IC1tYXRyaXguYjtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguZCA9IG1hdHJpeC5hO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWZmaW5lID09PSBBRkZJTkUuQVhJU19ZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmEgPSBtYXRyaXguZDtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYyA9IC1tYXRyaXguYjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNvcHlGcm9tID0gZnVuY3Rpb24gKG1hdHJpeCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IG1hdHJpeC5hO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gbWF0cml4LmI7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gbWF0cml4LmM7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBtYXRyaXguZDtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSBtYXRyaXgudHg7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSBtYXRyaXgudHk7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxLjA7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNldFRvTXVsdExlZ2FjeSA9IGZ1bmN0aW9uIChwdCwgbHQpIHtcclxuICAgICAgICAgICAgdmFyIG91dCA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGIgPSBsdC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gcHQuYSwgYTAxID0gcHQuYiwgYTEwID0gcHQuYywgYTExID0gcHQuZCwgYTIwID0gcHQudHgsIGEyMSA9IHB0LnR5LCBiMDAgPSBiWzBdLCBiMDEgPSBiWzFdLCBiMDIgPSBiWzJdLCBiMTAgPSBiWzNdLCBiMTEgPSBiWzRdLCBiMTIgPSBiWzVdLCBiMjAgPSBiWzZdLCBiMjEgPSBiWzddLCBiMjIgPSBiWzhdO1xyXG4gICAgICAgICAgICBvdXRbMF0gPSBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFsxXSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzJdID0gYjAyO1xyXG4gICAgICAgICAgICBvdXRbM10gPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs0XSA9IGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzVdID0gYjEyO1xyXG4gICAgICAgICAgICBvdXRbNl0gPSBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs3XSA9IGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzhdID0gYjIyO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zZXRUb011bHQyZCA9IGZ1bmN0aW9uIChwdCwgbHQpIHtcclxuICAgICAgICAgICAgdmFyIG91dCA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGEgPSBwdC5tYXQzLCBiID0gbHQubWF0MztcclxuICAgICAgICAgICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sIGIwMCA9IGJbMF0sIGIwMSA9IGJbMV0sIGIwMiA9IGJbMl0sIGIxMCA9IGJbM10sIGIxMSA9IGJbNF0sIGIxMiA9IGJbNV0sIGIyMCA9IGJbNl0sIGIyMSA9IGJbN10sIGIyMiA9IGJbOF07XHJcbiAgICAgICAgICAgIG91dFswXSA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzFdID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbMl0gPSBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjI7XHJcbiAgICAgICAgICAgIG91dFszXSA9IGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbNV0gPSBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjI7XHJcbiAgICAgICAgICAgIG91dFs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbOF0gPSBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjI7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQuSURFTlRJVFkgPSBuZXcgTWF0cml4MmQoKTtcclxuICAgICAgICBNYXRyaXgyZC5URU1QX01BVFJJWCA9IG5ldyBNYXRyaXgyZCgpO1xyXG4gICAgICAgIHJldHVybiBNYXRyaXgyZDtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQgPSBNYXRyaXgyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtSGFjayhwYXJlbnRUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2YXIgcHJvaiA9IHRoaXMucHJvajtcclxuICAgICAgICB2YXIgdGEgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwd2lkID0gcGFyZW50VHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgIHZhciBsdCA9IHRhLmxvY2FsVHJhbnNmb3JtO1xyXG4gICAgICAgIGlmICh0YS5fbG9jYWxJRCAhPT0gdGEuX2N1cnJlbnRMb2NhbElEKSB7XHJcbiAgICAgICAgICAgIGx0LmEgPSB0YS5fY3ggKiB0YS5zY2FsZS5feDtcclxuICAgICAgICAgICAgbHQuYiA9IHRhLl9zeCAqIHRhLnNjYWxlLl94O1xyXG4gICAgICAgICAgICBsdC5jID0gdGEuX2N5ICogdGEuc2NhbGUuX3k7XHJcbiAgICAgICAgICAgIGx0LmQgPSB0YS5fc3kgKiB0YS5zY2FsZS5feTtcclxuICAgICAgICAgICAgbHQudHggPSB0YS5wb3NpdGlvbi5feCAtICgodGEucGl2b3QuX3ggKiBsdC5hKSArICh0YS5waXZvdC5feSAqIGx0LmMpKTtcclxuICAgICAgICAgICAgbHQudHkgPSB0YS5wb3NpdGlvbi5feSAtICgodGEucGl2b3QuX3ggKiBsdC5iKSArICh0YS5waXZvdC5feSAqIGx0LmQpKTtcclxuICAgICAgICAgICAgdGEuX2N1cnJlbnRMb2NhbElEID0gdGEuX2xvY2FsSUQ7XHJcbiAgICAgICAgICAgIHByb2ouX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9tYXRyaXhJRCA9IHByb2ouX3Byb2pJRDtcclxuICAgICAgICBpZiAocHJvai5fY3VycmVudFByb2pJRCAhPT0gX21hdHJpeElEKSB7XHJcbiAgICAgICAgICAgIHByb2ouX2N1cnJlbnRQcm9qSUQgPSBfbWF0cml4SUQ7XHJcbiAgICAgICAgICAgIGlmIChfbWF0cml4SUQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHByb2oubG9jYWwuc2V0VG9NdWx0TGVnYWN5KGx0LCBwcm9qLm1hdHJpeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLmxvY2FsLmNvcHlGcm9tKGx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRhLl9wYXJlbnRJRCAhPT0gcHdpZCkge1xyXG4gICAgICAgICAgICB2YXIgcHAgPSBwYXJlbnRUcmFuc2Zvcm0ucHJvajtcclxuICAgICAgICAgICAgaWYgKHBwICYmICFwcC5hZmZpbmUpIHtcclxuICAgICAgICAgICAgICAgIHByb2oud29ybGQuc2V0VG9NdWx0MmQocHAud29ybGQsIHByb2oubG9jYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvai53b3JsZC5zZXRUb011bHRMZWdhY3kocGFyZW50VHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtLCBwcm9qLmxvY2FsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9qLndvcmxkLmNvcHkodGEud29ybGRUcmFuc2Zvcm0sIHByb2ouX2FmZmluZSk7XHJcbiAgICAgICAgICAgIHRhLl9wYXJlbnRJRCA9IHB3aWQ7XHJcbiAgICAgICAgICAgIHRhLl93b3JsZElEKys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIHQwID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgIHZhciB0dCA9IFtuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpXTtcclxuICAgIHZhciB0ZW1wUmVjdCA9IG5ldyBQSVhJLlJlY3RhbmdsZSgpO1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICB2YXIgUHJvamVjdGlvbjJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoUHJvamVjdGlvbjJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb24yZChsZWdhY3ksIGVuYWJsZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBsZWdhY3ksIGVuYWJsZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMubWF0cml4ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5sb2NhbCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgX3RoaXMud29ybGQgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qSUQgPSAwO1xyXG4gICAgICAgICAgICBfdGhpcy5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgICAgICBfdGhpcy5fYWZmaW5lID0gcGl4aV9wcm9qZWN0aW9uLkFGRklORS5OT05FO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uMmQucHJvdG90eXBlLCBcImFmZmluZVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FmZmluZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hZmZpbmUgPT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWZmaW5lID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uMmQucHJvdG90eXBlLCBcImVuYWJsZWRcIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl9lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gdHJhbnNmb3JtSGFjaztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IFBJWEkuVHJhbnNmb3JtU3RhdGljLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUuc2V0QXhpc1ggPSBmdW5jdGlvbiAocCwgZmFjdG9yKSB7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgPT09IHZvaWQgMCkgeyBmYWN0b3IgPSAxOyB9XHJcbiAgICAgICAgICAgIHZhciB4ID0gcC54LCB5ID0gcC55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0geCAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSB5IC8gZDtcclxuICAgICAgICAgICAgbWF0M1syXSA9IGZhY3RvciAvIGQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5zZXRBeGlzWSA9IGZ1bmN0aW9uIChwLCBmYWN0b3IpIHtcclxuICAgICAgICAgICAgaWYgKGZhY3RvciA9PT0gdm9pZCAwKSB7IGZhY3RvciA9IDE7IH1cclxuICAgICAgICAgICAgdmFyIHggPSBwLngsIHkgPSBwLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSB4IC8gZDtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHkgLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gZmFjdG9yIC8gZDtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEKys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLm1hcFNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQpIHtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC54ID0gLXNwcml0ZS5hbmNob3IueCAqIHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gLXNwcml0ZS5hbmNob3IueSAqIHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdGVtcFJlY3Qud2lkdGggPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBRdWFkKHRlbXBSZWN0LCBxdWFkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUubWFwUXVhZCA9IGZ1bmN0aW9uIChyZWN0LCBwKSB7XHJcbiAgICAgICAgICAgIHR0WzBdLnNldChyZWN0LngsIHJlY3QueSk7XHJcbiAgICAgICAgICAgIHR0WzFdLnNldChyZWN0LnggKyByZWN0LndpZHRoLCByZWN0LnkpO1xyXG4gICAgICAgICAgICB0dFsyXS5zZXQocmVjdC54ICsgcmVjdC53aWR0aCwgcmVjdC55ICsgcmVjdC5oZWlnaHQpO1xyXG4gICAgICAgICAgICB0dFszXS5zZXQocmVjdC54LCByZWN0LnkgKyByZWN0LmhlaWdodCk7XHJcbiAgICAgICAgICAgIHZhciBrMSA9IDEsIGsyID0gMiwgazMgPSAzO1xyXG4gICAgICAgICAgICB2YXIgZiA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5nZXRJbnRlcnNlY3Rpb25GYWN0b3IocFswXSwgcFsyXSwgcFsxXSwgcFszXSwgdDApO1xyXG4gICAgICAgICAgICBpZiAoZiAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgazEgPSAxO1xyXG4gICAgICAgICAgICAgICAgazIgPSAzO1xyXG4gICAgICAgICAgICAgICAgazMgPSAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkMCA9IE1hdGguc3FydCgocFswXS54IC0gdDAueCkgKiAocFswXS54IC0gdDAueCkgKyAocFswXS55IC0gdDAueSkgKiAocFswXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgZDEgPSBNYXRoLnNxcnQoKHBbazFdLnggLSB0MC54KSAqIChwW2sxXS54IC0gdDAueCkgKyAocFtrMV0ueSAtIHQwLnkpICogKHBbazFdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBkMiA9IE1hdGguc3FydCgocFtrMl0ueCAtIHQwLngpICogKHBbazJdLnggLSB0MC54KSArIChwW2syXS55IC0gdDAueSkgKiAocFtrMl0ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIGQzID0gTWF0aC5zcXJ0KChwW2szXS54IC0gdDAueCkgKiAocFtrM10ueCAtIHQwLngpICsgKHBbazNdLnkgLSB0MC55KSAqIChwW2szXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgcTAgPSAoZDAgKyBkMykgLyBkMztcclxuICAgICAgICAgICAgdmFyIHExID0gKGQxICsgZDIpIC8gZDI7XHJcbiAgICAgICAgICAgIHZhciBxMiA9IChkMSArIGQyKSAvIGQxO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSB0dFswXS54ICogcTA7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSB0dFswXS55ICogcTA7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSBxMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IHR0W2sxXS54ICogcTE7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSB0dFtrMV0ueSAqIHExO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gcTE7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSB0dFtrMl0ueCAqIHEyO1xyXG4gICAgICAgICAgICBtYXQzWzddID0gdHRbazJdLnkgKiBxMjtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IHEyO1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeC5pbnZlcnQoKTtcclxuICAgICAgICAgICAgbWF0MyA9IHRlbXBNYXQubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHBbMF0ueDtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHBbMF0ueTtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBwW2sxXS54O1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gcFtrMV0ueTtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSBwW2syXS54O1xyXG4gICAgICAgICAgICBtYXQzWzddID0gcFtrMl0ueTtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4LnNldFRvTXVsdDJkKHRlbXBNYXQsIHRoaXMubWF0cml4KTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEKys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4LmlkZW50aXR5KCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvbjJkO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCA9IFByb2plY3Rpb24yZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE1lc2gyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKE1lc2gyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBNZXNoMmQodGV4dHVyZSwgdmVydGljZXMsIHV2cywgaW5kaWNlcywgZHJhd01vZGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dHVyZSwgdmVydGljZXMsIHV2cywgaW5kaWNlcywgZHJhd01vZGUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ21lc2gyZCc7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lc2gyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBNZXNoMmQ7XHJcbiAgICB9KFBJWEkubWVzaC5NZXNoKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uTWVzaDJkID0gTWVzaDJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB0cmFuc2xhdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgdVRyYW5zZm9ybTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiB0cmFuc2xhdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcblxcbiAgICB2VGV4dHVyZUNvb3JkID0gKHVUcmFuc2Zvcm0gKiB2ZWMzKGFUZXh0dXJlQ29vcmQsIDEuMCkpLnh5O1xcbn1cXG5cIjtcclxuICAgIHZhciBzaGFkZXJGcmFnID0gXCJcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHZlYzQgdUNvbG9yO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKSAqIHVDb2xvcjtcXG59XCI7XHJcbiAgICB2YXIgTWVzaDJkUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhNZXNoMmRSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBNZXNoMmRSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBNZXNoMmRSZW5kZXJlci5wcm90b3R5cGUub25Db250ZXh0Q2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB0aGlzLnNoYWRlciA9IG5ldyBQSVhJLlNoYWRlcihnbCwgc2hhZGVyVmVydCwgc2hhZGVyRnJhZyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gTWVzaDJkUmVuZGVyZXI7XHJcbiAgICB9KFBJWEkubWVzaC5NZXNoUmVuZGVyZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5NZXNoMmRSZW5kZXJlciA9IE1lc2gyZFJlbmRlcmVyO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdtZXNoMmQnLCBNZXNoMmRSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIFBJWEkuU3ByaXRlLnByb3RvdHlwZS5jb252ZXJ0VG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGUyZCc7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLm1lc2guTWVzaC5wcm90b3R5cGUuY29udmVydFRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLnBsdWdpbk5hbWUgPSAnbWVzaDJkJztcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0VG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRTdWJ0cmVlVG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNvbnZlcnRUbzJkKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29udmVydFN1YnRyZWVUbzJkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFNwcml0ZTJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlMmQodGV4dHVyZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0dXJlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGUyZCc7XHJcbiAgICAgICAgICAgIF90aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGUyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5fYm91bmRzLmFkZFF1YWQodGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FmZmluZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGV4RGF0YS5sZW5ndGggIT0gOCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoOCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMudmVydGV4RGF0YS5sZW5ndGggIT0gMTIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RyYW5zZm9ybUlEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZUlEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy5wcm9qLndvcmxkLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdHJpbSA9IHRleHR1cmUudHJpbTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IDA7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0cmltKSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IHRyaW0ueCAtIChhbmNob3IuX3ggKiBvcmlnLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyB0cmltLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSB0cmltLnkgLSAoYW5jaG9yLl95ICogb3JpZy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIHRyaW0uaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9ICh3dFswXSAqIHcxKSArICh3dFszXSAqIGgxKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gKHd0WzFdICogdzEpICsgKHd0WzRdICogaDEpICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSAod3RbMl0gKiB3MSkgKyAod3RbNV0gKiBoMSkgKyB3dFs4XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9ICh3dFswXSAqIHcwKSArICh3dFszXSAqIGgxKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gKHd0WzFdICogdzApICsgKHd0WzRdICogaDEpICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSAod3RbMl0gKiB3MCkgKyAod3RbNV0gKiBoMSkgKyB3dFs4XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9ICh3dFswXSAqIHcwKSArICh3dFszXSAqIGgwKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gKHd0WzFdICogdzApICsgKHd0WzRdICogaDApICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbOF0gPSAod3RbMl0gKiB3MCkgKyAod3RbNV0gKiBoMCkgKyB3dFs4XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs5XSA9ICh3dFswXSAqIHcxKSArICh3dFszXSAqIGgwKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzEwXSA9ICh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgwKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzExXSA9ICh3dFsyXSAqIHcxKSArICh3dFs1XSAqIGgwKSArIHd0WzhdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWZmaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcy5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZlcnRleFRyaW1tZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleFRyaW1tZWREYXRhID0gbmV3IEZsb2F0MzJBcnJheSg4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4VHJpbW1lZERhdGE7XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnByb2oud29ybGQubWF0MztcclxuICAgICAgICAgICAgdmFyIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgeiA9IDEuMCAvICh3dFsyXSAqIHcxICsgd3RbNV0gKiBoMSArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IHogKiAoKHd0WzBdICogdzEpICsgKHd0WzNdICogaDEpICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0geiAqICgod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XSk7XHJcbiAgICAgICAgICAgIHogPSAxLjAgLyAod3RbMl0gKiB3MCArIHd0WzVdICogaDEgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSB6ICogKCh3dFswXSAqIHcwKSArICh3dFszXSAqIGgxKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IHogKiAoKHd0WzFdICogdzApICsgKHd0WzRdICogaDEpICsgd3RbN10pO1xyXG4gICAgICAgICAgICB6ID0gMS4wIC8gKHd0WzJdICogdzAgKyB3dFs1XSAqIGgwICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0geiAqICgod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMCkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSB6ICogKCh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgwKSArIHd0WzddKTtcclxuICAgICAgICAgICAgeiA9IDEuMCAvICh3dFsyXSAqIHcxICsgd3RbNV0gKiBoMCArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IHogKiAoKHd0WzBdICogdzEpICsgKHd0WzNdICogaDApICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0geiAqICgod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ByaXRlMmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlMmQ7XHJcbiAgICB9KFBJWEkuU3ByaXRlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQgPSBTcHJpdGUyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgdmFyIFNwcml0ZTJkUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGUyZFJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZTJkUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuYXR0cmlidXRlIHZlYzQgYUNvbG9yO1xcbmF0dHJpYnV0ZSBmbG9hdCBhVGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIGFWZXJ0ZXhQb3NpdGlvbjtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG4gICAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbiAgICB2VGV4dHVyZUlkID0gYVRleHR1cmVJZDtcXG4gICAgdkNvbG9yID0gYUNvbG9yO1xcbn1cXG5cIjtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9IFwiXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXJzWyVjb3VudCVdO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG52ZWM0IGNvbG9yO1xcbnZlYzIgdGV4dHVyZUNvb3JkID0gdlRleHR1cmVDb29yZDtcXG5mbG9hdCB0ZXh0dXJlSWQgPSBmbG9vcih2VGV4dHVyZUlkKzAuNSk7XFxuJWZvcmxvb3AlXFxuZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiB2Q29sb3I7XFxufVwiO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZTJkUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZVZhbyA9IGZ1bmN0aW9uICh2ZXJ0ZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgdGhpcy52ZXJ0U2l6ZSA9IDY7XHJcbiAgICAgICAgICAgIHRoaXMudmVydEJ5dGVTaXplID0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHZhciB2YW8gPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZVZhbygpXHJcbiAgICAgICAgICAgICAgICAuYWRkSW5kZXgodGhpcy5pbmRleEJ1ZmZlcilcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDApXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVDb29yZCwgZ2wuVU5TSUdORURfU0hPUlQsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCAzICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hQ29sb3IsIGdsLlVOU0lHTkVEX0JZVEUsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCA0ICogNCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5hVGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YW8uYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVJZCwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNSAqIDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YW87XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUyZFJlbmRlcmVyLnByb3RvdHlwZS5maWxsVmVydGljZXMgPSBmdW5jdGlvbiAoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIHRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHNwcml0ZS52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdXZzID0gc3ByaXRlLl90ZXh0dXJlLl91dnMudXZzVWludDMyO1xyXG4gICAgICAgICAgICBpZiAodmVydGV4RGF0YS5sZW5ndGggPT09IDgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmVyLnJvdW5kUGl4ZWxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc29sdXRpb24gPSB0aGlzLnJlbmRlcmVyLnJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gKCh2ZXJ0ZXhEYXRhWzBdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9ICgodmVydGV4RGF0YVsxXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9ICgodmVydGV4RGF0YVsyXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSAoKHZlcnRleERhdGFbM10gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTJdID0gKCh2ZXJ0ZXhEYXRhWzRdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSAoKHZlcnRleERhdGFbNV0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE0XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE4XSA9ICgodmVydGV4RGF0YVs2XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTldID0gKCh2ZXJ0ZXhEYXRhWzddICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyMF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IHZlcnRleERhdGFbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IHZlcnRleERhdGFbM107XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEyXSA9IHZlcnRleERhdGFbNF07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB2ZXJ0ZXhEYXRhWzVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTRdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMThdID0gdmVydGV4RGF0YVs2XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE5XSA9IHZlcnRleERhdGFbN107XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyMF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhWzBdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbMV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gdmVydGV4RGF0YVsyXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSB2ZXJ0ZXhEYXRhWzNdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IHZlcnRleERhdGFbNF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gdmVydGV4RGF0YVs1XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTJdID0gdmVydGV4RGF0YVs2XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdmVydGV4RGF0YVs3XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTRdID0gdmVydGV4RGF0YVs4XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMThdID0gdmVydGV4RGF0YVs5XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTldID0gdmVydGV4RGF0YVsxMF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDIwXSA9IHZlcnRleERhdGFbMTFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAzXSA9IHV2c1swXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDldID0gdXZzWzFdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMTVdID0gdXZzWzJdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMjFdID0gdXZzWzNdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgNF0gPSB1aW50MzJWaWV3W2luZGV4ICsgMTBdID0gdWludDMyVmlld1tpbmRleCArIDE2XSA9IHVpbnQzMlZpZXdbaW5kZXggKyAyMl0gPSBhcmdiO1xyXG4gICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDVdID0gZmxvYXQzMlZpZXdbaW5kZXggKyAxMV0gPSBmbG9hdDMyVmlld1tpbmRleCArIDE3XSA9IGZsb2F0MzJWaWV3W2luZGV4ICsgMjNdID0gdGV4dHVyZUlkO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZTJkUmVuZGVyZXI7XHJcbiAgICB9KE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKSk7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Nwcml0ZTJkJywgU3ByaXRlMmRSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBUZXh0MmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhUZXh0MmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gVGV4dDJkKHRleHQsIHN0eWxlLCBjYW52YXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dCwgc3R5bGUsIGNhbnZhcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlMmQnO1xyXG4gICAgICAgICAgICBfdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRleHQyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBUZXh0MmQ7XHJcbiAgICB9KFBJWEkuVGV4dCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlRleHQyZCA9IFRleHQyZDtcclxuICAgIFRleHQyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgVGV4dDJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgIFRleHQyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFByb2plY3Rpb25zTWFuYWdlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvbnNNYW5hZ2VyKHJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMub25Db250ZXh0Q2hhbmdlID0gZnVuY3Rpb24gKGdsKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5nbCA9IGdsO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucmVuZGVyZXIubWFza01hbmFnZXIucHVzaFNwcml0ZU1hc2sgPSBwdXNoU3ByaXRlTWFzaztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xyXG4gICAgICAgICAgICByZW5kZXJlci5vbignY29udGV4dCcsIHRoaXMub25Db250ZXh0Q2hhbmdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgUHJvamVjdGlvbnNNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLm9mZignY29udGV4dCcsIHRoaXMub25Db250ZXh0Q2hhbmdlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uc01hbmFnZXI7XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25zTWFuYWdlciA9IFByb2plY3Rpb25zTWFuYWdlcjtcclxuICAgIGZ1bmN0aW9uIHB1c2hTcHJpdGVNYXNrKHRhcmdldCwgbWFza0RhdGEpIHtcclxuICAgICAgICB2YXIgYWxwaGFNYXNrRmlsdGVyID0gdGhpcy5hbHBoYU1hc2tQb29sW3RoaXMuYWxwaGFNYXNrSW5kZXhdO1xyXG4gICAgICAgIGlmICghYWxwaGFNYXNrRmlsdGVyKSB7XHJcbiAgICAgICAgICAgIGFscGhhTWFza0ZpbHRlciA9IHRoaXMuYWxwaGFNYXNrUG9vbFt0aGlzLmFscGhhTWFza0luZGV4XSA9IFtuZXcgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZU1hc2tGaWx0ZXIyZChtYXNrRGF0YSldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhbHBoYU1hc2tGaWx0ZXJbMF0ucmVzb2x1dGlvbiA9IHRoaXMucmVuZGVyZXIucmVzb2x1dGlvbjtcclxuICAgICAgICBhbHBoYU1hc2tGaWx0ZXJbMF0ubWFza1Nwcml0ZSA9IG1hc2tEYXRhO1xyXG4gICAgICAgIHRhcmdldC5maWx0ZXJBcmVhID0gbWFza0RhdGEuZ2V0Qm91bmRzKHRydWUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuZmlsdGVyTWFuYWdlci5wdXNoRmlsdGVyKHRhcmdldCwgYWxwaGFNYXNrRmlsdGVyKTtcclxuICAgICAgICB0aGlzLmFscGhhTWFza0luZGV4Kys7XHJcbiAgICB9XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Byb2plY3Rpb25zJywgUHJvamVjdGlvbnNNYW5hZ2VyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHNwcml0ZU1hc2tWZXJ0ID0gXCJcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgb3RoZXJNYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMzIHZNYXNrQ29vcmQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcblxcdGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcblxcblxcdHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcblxcdHZNYXNrQ29vcmQgPSBvdGhlck1hdHJpeCAqIHZlYzMoIGFUZXh0dXJlQ29vcmQsIDEuMCk7XFxufVxcblwiO1xyXG4gICAgdmFyIHNwcml0ZU1hc2tGcmFnID0gXCJcXG52YXJ5aW5nIHZlYzMgdk1hc2tDb29yZDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IGFscGhhO1xcbnVuaWZvcm0gc2FtcGxlcjJEIG1hc2s7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICB2ZWMyIHV2ID0gdk1hc2tDb29yZC54eSAvIHZNYXNrQ29vcmQuejtcXG4gICAgXFxuICAgIHZlYzIgdGV4dCA9IGFicyggdXYgLSAwLjUgKTtcXG4gICAgdGV4dCA9IHN0ZXAoMC41LCB0ZXh0KTtcXG5cXG4gICAgZmxvYXQgY2xpcCA9IDEuMCAtIG1heCh0ZXh0LnksIHRleHQueCk7XFxuICAgIHZlYzQgb3JpZ2luYWwgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWM0IG1hc2t5ID0gdGV4dHVyZTJEKG1hc2ssIHV2KTtcXG5cXG4gICAgb3JpZ2luYWwgKj0gKG1hc2t5LnIgKiBtYXNreS5hICogYWxwaGEgKiBjbGlwKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gb3JpZ2luYWw7XFxufVxcblwiO1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICB2YXIgU3ByaXRlTWFza0ZpbHRlcjJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlTWFza0ZpbHRlcjJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZU1hc2tGaWx0ZXIyZChzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc3ByaXRlTWFza1ZlcnQsIHNwcml0ZU1hc2tGcmFnKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5tYXNrTWF0cml4ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBzcHJpdGUucmVuZGVyYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfdGhpcy5tYXNrU3ByaXRlID0gc3ByaXRlO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZU1hc2tGaWx0ZXIyZC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAoZmlsdGVyTWFuYWdlciwgaW5wdXQsIG91dHB1dCwgY2xlYXIsIGN1cnJlbnRTdGF0ZSkge1xyXG4gICAgICAgICAgICB2YXIgbWFza1Nwcml0ZSA9IHRoaXMubWFza1Nwcml0ZTtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3Jtcy5tYXNrID0gbWFza1Nwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1zLm90aGVyTWF0cml4ID0gU3ByaXRlTWFza0ZpbHRlcjJkLmNhbGN1bGF0ZVNwcml0ZU1hdHJpeChjdXJyZW50U3RhdGUsIHRoaXMubWFza01hdHJpeCwgbWFza1Nwcml0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybXMuYWxwaGEgPSBtYXNrU3ByaXRlLndvcmxkQWxwaGE7XHJcbiAgICAgICAgICAgIGZpbHRlck1hbmFnZXIuYXBwbHlGaWx0ZXIodGhpcywgaW5wdXQsIG91dHB1dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVNYXNrRmlsdGVyMmQuY2FsY3VsYXRlU3ByaXRlTWF0cml4ID0gZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgbWFwcGVkTWF0cml4LCBzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIHByb2ogPSBzcHJpdGUucHJvajtcclxuICAgICAgICAgICAgdmFyIGZpbHRlckFyZWEgPSBjdXJyZW50U3RhdGUuc291cmNlRnJhbWU7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlU2l6ZSA9IGN1cnJlbnRTdGF0ZS5yZW5kZXJUYXJnZXQuc2l6ZTtcclxuICAgICAgICAgICAgdmFyIHdvcmxkVHJhbnNmb3JtID0gcHJvaiAmJiAhcHJvai5fYWZmaW5lID8gcHJvai53b3JsZC5jb3B5VG8odGVtcE1hdCkgOiB0ZW1wTWF0LmNvcHlGcm9tKHNwcml0ZS50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHNwcml0ZS50ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIG1hcHBlZE1hdHJpeC5zZXQodGV4dHVyZVNpemUud2lkdGgsIDAsIDAsIHRleHR1cmVTaXplLmhlaWdodCwgZmlsdGVyQXJlYS54LCBmaWx0ZXJBcmVhLnkpO1xyXG4gICAgICAgICAgICB3b3JsZFRyYW5zZm9ybS5pbnZlcnQoKTtcclxuICAgICAgICAgICAgbWFwcGVkTWF0cml4LnNldFRvTXVsdDJkKHdvcmxkVHJhbnNmb3JtLCBtYXBwZWRNYXRyaXgpO1xyXG4gICAgICAgICAgICBtYXBwZWRNYXRyaXguc2NhbGVBbmRUcmFuc2xhdGUoMS4wIC8gdGV4dHVyZS53aWR0aCwgMS4wIC8gdGV4dHVyZS5oZWlnaHQsIHNwcml0ZS5hbmNob3IueCwgc3ByaXRlLmFuY2hvci55KTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hcHBlZE1hdHJpeDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGVNYXNrRmlsdGVyMmQ7XHJcbiAgICB9KFBJWEkuRmlsdGVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3ByaXRlTWFza0ZpbHRlcjJkID0gU3ByaXRlTWFza0ZpbHRlcjJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktcHJvamVjdGlvbi5qcy5tYXAiLCIvKiFcbiAqIHBpeGktc291bmQgLSB2Mi4wLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9waXhpanMvcGl4aS1zb3VuZFxuICogQ29tcGlsZWQgVHVlLCAxNCBOb3YgMjAxNyAxNzo1Mzo0NyBVVENcbiAqXG4gKiBwaXhpLXNvdW5kIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLl9fcGl4aVNvdW5kPWUuX19waXhpU291bmR8fHt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUsdCl7ZnVuY3Rpb24gbigpe3RoaXMuY29uc3RydWN0b3I9ZX1vKGUsdCksZS5wcm90b3R5cGU9bnVsbD09PXQ/T2JqZWN0LmNyZWF0ZSh0KToobi5wcm90b3R5cGU9dC5wcm90b3R5cGUsbmV3IG4pfWlmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBQSVhJKXRocm93XCJQaXhpSlMgcmVxdWlyZWRcIjt2YXIgbj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLl9vdXRwdXQ9dCx0aGlzLl9pbnB1dD1lfXJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJkZXN0aW5hdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW5wdXR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7aWYodGhpcy5fZmlsdGVycyYmKHRoaXMuX2ZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihlKXtlJiZlLmRpc2Nvbm5lY3QoKX0pLHRoaXMuX2ZpbHRlcnM9bnVsbCx0aGlzLl9pbnB1dC5jb25uZWN0KHRoaXMuX291dHB1dCkpLGUmJmUubGVuZ3RoKXt0aGlzLl9maWx0ZXJzPWUuc2xpY2UoMCksdGhpcy5faW5wdXQuZGlzY29ubmVjdCgpO3ZhciBuPW51bGw7ZS5mb3JFYWNoKGZ1bmN0aW9uKGUpe251bGw9PT1uP3QuX2lucHV0LmNvbm5lY3QoZS5kZXN0aW5hdGlvbik6bi5jb25uZWN0KGUuZGVzdGluYXRpb24pLG49ZX0pLG4uY29ubmVjdCh0aGlzLl9vdXRwdXQpfX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5maWx0ZXJzPW51bGwsdGhpcy5faW5wdXQ9bnVsbCx0aGlzLl9vdXRwdXQ9bnVsbH0sZX0oKSxvPU9iamVjdC5zZXRQcm90b3R5cGVPZnx8e19fcHJvdG9fXzpbXX1pbnN0YW5jZW9mIEFycmF5JiZmdW5jdGlvbihlLHQpe2UuX19wcm90b19fPXR9fHxmdW5jdGlvbihlLHQpe2Zvcih2YXIgbiBpbiB0KXQuaGFzT3duUHJvcGVydHkobikmJihlW25dPXRbbl0pfSxpPTAscj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZhciBuPWUuY2FsbCh0aGlzKXx8dGhpcztyZXR1cm4gbi5pZD1pKyssbi5pbml0KHQpLG59cmV0dXJuIHQobixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwcm9ncmVzc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlLmN1cnJlbnRUaW1lL3RoaXMuX2R1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGF1c2VkPWUsdGhpcy5yZWZyZXNoUGF1c2VkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuX29uUGxheT1mdW5jdGlvbigpe3RoaXMuX3BsYXlpbmc9ITB9LG4ucHJvdG90eXBlLl9vblBhdXNlPWZ1bmN0aW9uKCl7dGhpcy5fcGxheWluZz0hMX0sbi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLl9wbGF5aW5nPSExLHRoaXMuX2R1cmF0aW9uPWUuc291cmNlLmR1cmF0aW9uO3ZhciB0PXRoaXMuX3NvdXJjZT1lLnNvdXJjZS5jbG9uZU5vZGUoITEpO3Quc3JjPWUucGFyZW50LnVybCx0Lm9ucGxheT10aGlzLl9vblBsYXkuYmluZCh0aGlzKSx0Lm9ucGF1c2U9dGhpcy5fb25QYXVzZS5iaW5kKHRoaXMpLGUuY29udGV4dC5vbihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksZS5jb250ZXh0Lm9uKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKSx0aGlzLl9tZWRpYT1lfSxuLnByb3RvdHlwZS5faW50ZXJuYWxTdG9wPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiZ0aGlzLl9wbGF5aW5nJiYodGhpcy5fc291cmNlLm9uZW5kZWQ9bnVsbCx0aGlzLl9zb3VyY2UucGF1c2UoKSl9LG4ucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLl9zb3VyY2UmJnRoaXMuZW1pdChcInN0b3BcIil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNwZWVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NwZWVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwidm9sdW1lXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl92b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl92b2x1bWU9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJsb29wXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9sb29wfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbG9vcD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIm11dGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tdXRlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX211dGVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQ7dGhpcy5fc291cmNlLmxvb3A9dGhpcy5fbG9vcHx8dC5sb29wO3ZhciBuPWUudm9sdW1lKihlLm11dGVkPzA6MSksbz10LnZvbHVtZSoodC5tdXRlZD8wOjEpLGk9dGhpcy5fdm9sdW1lKih0aGlzLl9tdXRlZD8wOjEpO3RoaXMuX3NvdXJjZS52b2x1bWU9aSpuKm8sdGhpcy5fc291cmNlLnBsYXliYWNrUmF0ZT10aGlzLl9zcGVlZCplLnNwZWVkKnQuc3BlZWR9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50LG49dGhpcy5fcGF1c2VkfHx0LnBhdXNlZHx8ZS5wYXVzZWQ7biE9PXRoaXMuX3BhdXNlZFJlYWwmJih0aGlzLl9wYXVzZWRSZWFsPW4sbj8odGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwicGF1c2VkXCIpKToodGhpcy5lbWl0KFwicmVzdW1lZFwiKSx0aGlzLnBsYXkoe3N0YXJ0OnRoaXMuX3NvdXJjZS5jdXJyZW50VGltZSxlbmQ6dGhpcy5fZW5kLHZvbHVtZTp0aGlzLl92b2x1bWUsc3BlZWQ6dGhpcy5fc3BlZWQsbG9vcDp0aGlzLl9sb29wfSkpLHRoaXMuZW1pdChcInBhdXNlXCIsbikpfSxuLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMsbz1lLnN0YXJ0LGk9ZS5lbmQscj1lLnNwZWVkLHM9ZS5sb29wLHU9ZS52b2x1bWUsYT1lLm11dGVkO2kmJmNvbnNvbGUuYXNzZXJ0KGk+byxcIkVuZCB0aW1lIGlzIGJlZm9yZSBzdGFydCB0aW1lXCIpLHRoaXMuX3NwZWVkPXIsdGhpcy5fdm9sdW1lPXUsdGhpcy5fbG9vcD0hIXMsdGhpcy5fbXV0ZWQ9YSx0aGlzLnJlZnJlc2goKSx0aGlzLmxvb3AmJm51bGwhPT1pJiYoY29uc29sZS53YXJuKCdMb29waW5nIG5vdCBzdXBwb3J0IHdoZW4gc3BlY2lmeWluZyBhbiBcImVuZFwiIHRpbWUnKSx0aGlzLmxvb3A9ITEpLHRoaXMuX3N0YXJ0PW8sdGhpcy5fZW5kPWl8fHRoaXMuX2R1cmF0aW9uLHRoaXMuX3N0YXJ0PU1hdGgubWF4KDAsdGhpcy5fc3RhcnQtbi5QQURESU5HKSx0aGlzLl9lbmQ9TWF0aC5taW4odGhpcy5fZW5kK24uUEFERElORyx0aGlzLl9kdXJhdGlvbiksdGhpcy5fc291cmNlLm9ubG9hZGVkbWV0YWRhdGE9ZnVuY3Rpb24oKXt0Ll9zb3VyY2UmJih0Ll9zb3VyY2UuY3VycmVudFRpbWU9byx0Ll9zb3VyY2Uub25sb2FkZWRtZXRhZGF0YT1udWxsLHQuZW1pdChcInByb2dyZXNzXCIsbyx0Ll9kdXJhdGlvbiksUElYSS50aWNrZXIuc2hhcmVkLmFkZCh0Ll9vblVwZGF0ZSx0KSl9LHRoaXMuX3NvdXJjZS5vbmVuZGVkPXRoaXMuX29uQ29tcGxldGUuYmluZCh0aGlzKSx0aGlzLl9zb3VyY2UucGxheSgpLHRoaXMuZW1pdChcInN0YXJ0XCIpfSxuLnByb3RvdHlwZS5fb25VcGRhdGU9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLHRoaXMucHJvZ3Jlc3MsdGhpcy5fZHVyYXRpb24pLHRoaXMuX3NvdXJjZS5jdXJyZW50VGltZT49dGhpcy5fZW5kJiYhdGhpcy5fc291cmNlLmxvb3AmJnRoaXMuX29uQ29tcGxldGUoKX0sbi5wcm90b3R5cGUuX29uQ29tcGxldGU9ZnVuY3Rpb24oKXtQSVhJLnRpY2tlci5zaGFyZWQucmVtb3ZlKHRoaXMuX29uVXBkYXRlLHRoaXMpLHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInByb2dyZXNzXCIsMSx0aGlzLl9kdXJhdGlvbiksdGhpcy5lbWl0KFwiZW5kXCIsdGhpcyl9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtQSVhJLnRpY2tlci5zaGFyZWQucmVtb3ZlKHRoaXMuX29uVXBkYXRlLHRoaXMpLHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7dmFyIGU9dGhpcy5fc291cmNlO2UmJihlLm9uZW5kZWQ9bnVsbCxlLm9ucGxheT1udWxsLGUub25wYXVzZT1udWxsLHRoaXMuX2ludGVybmFsU3RvcCgpKSx0aGlzLl9zb3VyY2U9bnVsbCx0aGlzLl9zcGVlZD0xLHRoaXMuX3ZvbHVtZT0xLHRoaXMuX2xvb3A9ITEsdGhpcy5fZW5kPW51bGwsdGhpcy5fc3RhcnQ9MCx0aGlzLl9kdXJhdGlvbj0wLHRoaXMuX3BsYXlpbmc9ITEsdGhpcy5fcGF1c2VkUmVhbD0hMSx0aGlzLl9wYXVzZWQ9ITEsdGhpcy5fbXV0ZWQ9ITEsdGhpcy5fbWVkaWEmJih0aGlzLl9tZWRpYS5jb250ZXh0Lm9mZihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksdGhpcy5fbWVkaWEuY29udGV4dC5vZmYoXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpLHRoaXMuX21lZGlhPW51bGwpfSxuLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiW0hUTUxBdWRpb0luc3RhbmNlIGlkPVwiK3RoaXMuaWQrXCJdXCJ9LG4uUEFERElORz0uMSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlcikscz1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7cmV0dXJuIG51bGwhPT1lJiZlLmFwcGx5KHRoaXMsYXJndW1lbnRzKXx8dGhpc31yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5wYXJlbnQ9ZSx0aGlzLl9zb3VyY2U9ZS5vcHRpb25zLnNvdXJjZXx8bmV3IEF1ZGlvLGUudXJsJiYodGhpcy5fc291cmNlLnNyYz1lLnVybCl9LG4ucHJvdG90eXBlLmNyZWF0ZT1mdW5jdGlvbigpe3JldHVybiBuZXcgcih0aGlzKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiaXNQbGF5YWJsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4hIXRoaXMuX3NvdXJjZSYmND09PXRoaXMuX3NvdXJjZS5yZWFkeVN0YXRlfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImR1cmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2UuZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXJlbnQuY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBudWxsfSxzZXQ6ZnVuY3Rpb24oZSl7Y29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGZpbHRlcnNcIil9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCksdGhpcy5wYXJlbnQ9bnVsbCx0aGlzLl9zb3VyY2UmJih0aGlzLl9zb3VyY2Uuc3JjPVwiXCIsdGhpcy5fc291cmNlLmxvYWQoKSx0aGlzLl9zb3VyY2U9bnVsbCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNvdXJjZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5fc291cmNlLG49dGhpcy5wYXJlbnQ7aWYoND09PXQucmVhZHlTdGF0ZSl7bi5pc0xvYWRlZD0hMDt2YXIgbz1uLmF1dG9QbGF5U3RhcnQoKTtyZXR1cm4gdm9pZChlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShudWxsLG4sbyl9LDApKX1pZighbi51cmwpcmV0dXJuIGUobmV3IEVycm9yKFwic291bmQudXJsIG9yIHNvdW5kLnNvdXJjZSBtdXN0IGJlIHNldFwiKSk7dC5zcmM9bi51cmw7dmFyIGk9ZnVuY3Rpb24oKXt0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5dGhyb3VnaFwiLHIpLHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIixyKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLHMpLHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsdSl9LHI9ZnVuY3Rpb24oKXtpKCksbi5pc0xvYWRlZD0hMDt2YXIgdD1uLmF1dG9QbGF5U3RhcnQoKTtlJiZlKG51bGwsbix0KX0scz1mdW5jdGlvbigpe2koKSxlJiZlKG5ldyBFcnJvcihcIlNvdW5kIGxvYWRpbmcgaGFzIGJlZW4gYWJvcnRlZFwiKSl9LHU9ZnVuY3Rpb24oKXtpKCk7dmFyIG49XCJGYWlsZWQgdG8gbG9hZCBhdWRpbyBlbGVtZW50IChjb2RlOiBcIit0LmVycm9yLmNvZGUrXCIpXCI7ZT9lKG5ldyBFcnJvcihuKSk6Y29uc29sZS5lcnJvcihuKX07dC5hZGRFdmVudExpc3RlbmVyKFwiY2FucGxheXRocm91Z2hcIixyLCExKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsciwhMSksdC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIixzLCExKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLHUsITEpLHQubG9hZCgpfSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlciksdT1cInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOnt9LGE9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdD17ZXhwb3J0czp7fX0sZSh0LHQuZXhwb3J0cyksdC5leHBvcnRzfShmdW5jdGlvbihlKXshZnVuY3Rpb24odCl7ZnVuY3Rpb24gbigpe31mdW5jdGlvbiBvKGUsdCl7cmV0dXJuIGZ1bmN0aW9uKCl7ZS5hcHBseSh0LGFyZ3VtZW50cyl9fWZ1bmN0aW9uIGkoZSl7aWYoXCJvYmplY3RcIiE9dHlwZW9mIHRoaXMpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ld1wiKTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlKXRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgYSBmdW5jdGlvblwiKTt0aGlzLl9zdGF0ZT0wLHRoaXMuX2hhbmRsZWQ9ITEsdGhpcy5fdmFsdWU9dm9pZCAwLHRoaXMuX2RlZmVycmVkcz1bXSxsKGUsdGhpcyl9ZnVuY3Rpb24gcihlLHQpe2Zvcig7Mz09PWUuX3N0YXRlOyllPWUuX3ZhbHVlO2lmKDA9PT1lLl9zdGF0ZSlyZXR1cm4gdm9pZCBlLl9kZWZlcnJlZHMucHVzaCh0KTtlLl9oYW5kbGVkPSEwLGkuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCl7dmFyIG49MT09PWUuX3N0YXRlP3Qub25GdWxmaWxsZWQ6dC5vblJlamVjdGVkO2lmKG51bGw9PT1uKXJldHVybiB2b2lkKDE9PT1lLl9zdGF0ZT9zOnUpKHQucHJvbWlzZSxlLl92YWx1ZSk7dmFyIG87dHJ5e289bihlLl92YWx1ZSl9Y2F0Y2goZSl7cmV0dXJuIHZvaWQgdSh0LnByb21pc2UsZSl9cyh0LnByb21pc2Usbyl9KX1mdW5jdGlvbiBzKGUsdCl7dHJ5e2lmKHQ9PT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLlwiKTtpZih0JiYoXCJvYmplY3RcIj09dHlwZW9mIHR8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHQpKXt2YXIgbj10LnRoZW47aWYodCBpbnN0YW5jZW9mIGkpcmV0dXJuIGUuX3N0YXRlPTMsZS5fdmFsdWU9dCx2b2lkIGEoZSk7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgbilyZXR1cm4gdm9pZCBsKG8obix0KSxlKX1lLl9zdGF0ZT0xLGUuX3ZhbHVlPXQsYShlKX1jYXRjaCh0KXt1KGUsdCl9fWZ1bmN0aW9uIHUoZSx0KXtlLl9zdGF0ZT0yLGUuX3ZhbHVlPXQsYShlKX1mdW5jdGlvbiBhKGUpezI9PT1lLl9zdGF0ZSYmMD09PWUuX2RlZmVycmVkcy5sZW5ndGgmJmkuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCl7ZS5faGFuZGxlZHx8aS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oZS5fdmFsdWUpfSk7Zm9yKHZhciB0PTAsbj1lLl9kZWZlcnJlZHMubGVuZ3RoO3Q8bjt0KyspcihlLGUuX2RlZmVycmVkc1t0XSk7ZS5fZGVmZXJyZWRzPW51bGx9ZnVuY3Rpb24gYyhlLHQsbil7dGhpcy5vbkZ1bGZpbGxlZD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBlP2U6bnVsbCx0aGlzLm9uUmVqZWN0ZWQ9XCJmdW5jdGlvblwiPT10eXBlb2YgdD90Om51bGwsdGhpcy5wcm9taXNlPW59ZnVuY3Rpb24gbChlLHQpe3ZhciBuPSExO3RyeXtlKGZ1bmN0aW9uKGUpe258fChuPSEwLHModCxlKSl9LGZ1bmN0aW9uKGUpe258fChuPSEwLHUodCxlKSl9KX1jYXRjaChlKXtpZihuKXJldHVybjtuPSEwLHUodCxlKX19dmFyIHA9c2V0VGltZW91dDtpLnByb3RvdHlwZS5jYXRjaD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy50aGVuKG51bGwsZSl9LGkucHJvdG90eXBlLnRoZW49ZnVuY3Rpb24oZSx0KXt2YXIgbz1uZXcgdGhpcy5jb25zdHJ1Y3RvcihuKTtyZXR1cm4gcih0aGlzLG5ldyBjKGUsdCxvKSksb30saS5hbGw9ZnVuY3Rpb24oZSl7dmFyIHQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZSk7cmV0dXJuIG5ldyBpKGZ1bmN0aW9uKGUsbil7ZnVuY3Rpb24gbyhyLHMpe3RyeXtpZihzJiYoXCJvYmplY3RcIj09dHlwZW9mIHN8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHMpKXt2YXIgdT1zLnRoZW47aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdSlyZXR1cm4gdm9pZCB1LmNhbGwocyxmdW5jdGlvbihlKXtvKHIsZSl9LG4pfXRbcl09cywwPT0tLWkmJmUodCl9Y2F0Y2goZSl7bihlKX19aWYoMD09PXQubGVuZ3RoKXJldHVybiBlKFtdKTtmb3IodmFyIGk9dC5sZW5ndGgscj0wO3I8dC5sZW5ndGg7cisrKW8ocix0W3JdKX0pfSxpLnJlc29sdmU9ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwib2JqZWN0XCI9PXR5cGVvZiBlJiZlLmNvbnN0cnVjdG9yPT09aT9lOm5ldyBpKGZ1bmN0aW9uKHQpe3QoZSl9KX0saS5yZWplY3Q9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBpKGZ1bmN0aW9uKHQsbil7bihlKX0pfSxpLnJhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBpKGZ1bmN0aW9uKHQsbil7Zm9yKHZhciBvPTAsaT1lLmxlbmd0aDtvPGk7bysrKWVbb10udGhlbih0LG4pfSl9LGkuX2ltbWVkaWF0ZUZuPVwiZnVuY3Rpb25cIj09dHlwZW9mIHNldEltbWVkaWF0ZSYmZnVuY3Rpb24oZSl7c2V0SW1tZWRpYXRlKGUpfXx8ZnVuY3Rpb24oZSl7cChlLDApfSxpLl91bmhhbmRsZWRSZWplY3Rpb25Gbj1mdW5jdGlvbihlKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgY29uc29sZSYmY29uc29sZSYmY29uc29sZS53YXJuKFwiUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOlwiLGUpfSxpLl9zZXRJbW1lZGlhdGVGbj1mdW5jdGlvbihlKXtpLl9pbW1lZGlhdGVGbj1lfSxpLl9zZXRVbmhhbmRsZWRSZWplY3Rpb25Gbj1mdW5jdGlvbihlKXtpLl91bmhhbmRsZWRSZWplY3Rpb25Gbj1lfSxlLmV4cG9ydHM/ZS5leHBvcnRzPWk6dC5Qcm9taXNlfHwodC5Qcm9taXNlPWkpfSh1KX0pLGM9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5kZXN0aW5hdGlvbj1lLHRoaXMuc291cmNlPXR8fGV9cmV0dXJuIGUucHJvdG90eXBlLmNvbm5lY3Q9ZnVuY3Rpb24oZSl7dGhpcy5zb3VyY2UuY29ubmVjdChlKX0sZS5wcm90b3R5cGUuZGlzY29ubmVjdD1mdW5jdGlvbigpe3RoaXMuc291cmNlLmRpc2Nvbm5lY3QoKX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuZGlzY29ubmVjdCgpLHRoaXMuZGVzdGluYXRpb249bnVsbCx0aGlzLnNvdXJjZT1udWxsfSxlfSgpLGw9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLnNldFBhcmFtVmFsdWU9ZnVuY3Rpb24oZSx0KXtpZihlLnNldFZhbHVlQXRUaW1lKXt2YXIgbj1TLmluc3RhbmNlLmNvbnRleHQ7ZS5zZXRWYWx1ZUF0VGltZSh0LG4uYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKX1lbHNlIGUudmFsdWU9dDtyZXR1cm4gdH0sZX0oKSxwPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxvLGkscixzLHUsYSxjLHAsaCl7dm9pZCAwPT09dCYmKHQ9MCksdm9pZCAwPT09byYmKG89MCksdm9pZCAwPT09aSYmKGk9MCksdm9pZCAwPT09ciYmKHI9MCksdm9pZCAwPT09cyYmKHM9MCksdm9pZCAwPT09dSYmKHU9MCksdm9pZCAwPT09YSYmKGE9MCksdm9pZCAwPT09YyYmKGM9MCksdm9pZCAwPT09cCYmKHA9MCksdm9pZCAwPT09aCYmKGg9MCk7dmFyIGQ9dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChkPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgZj1be2Y6bi5GMzIsdHlwZTpcImxvd3NoZWxmXCIsZ2Fpbjp0fSx7ZjpuLkY2NCx0eXBlOlwicGVha2luZ1wiLGdhaW46b30se2Y6bi5GMTI1LHR5cGU6XCJwZWFraW5nXCIsZ2FpbjppfSx7ZjpuLkYyNTAsdHlwZTpcInBlYWtpbmdcIixnYWluOnJ9LHtmOm4uRjUwMCx0eXBlOlwicGVha2luZ1wiLGdhaW46c30se2Y6bi5GMUssdHlwZTpcInBlYWtpbmdcIixnYWluOnV9LHtmOm4uRjJLLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjphfSx7ZjpuLkY0Syx0eXBlOlwicGVha2luZ1wiLGdhaW46Y30se2Y6bi5GOEssdHlwZTpcInBlYWtpbmdcIixnYWluOnB9LHtmOm4uRjE2Syx0eXBlOlwiaGlnaHNoZWxmXCIsZ2FpbjpofV0ubWFwKGZ1bmN0aW9uKGUpe3ZhciB0PVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7cmV0dXJuIHQudHlwZT1lLnR5cGUsbC5zZXRQYXJhbVZhbHVlKHQuZ2FpbixlLmdhaW4pLGwuc2V0UGFyYW1WYWx1ZSh0LlEsMSksbC5zZXRQYXJhbVZhbHVlKHQuZnJlcXVlbmN5LGUuZiksdH0pOyhkPWUuY2FsbCh0aGlzLGZbMF0sZltmLmxlbmd0aC0xXSl8fHRoaXMpLmJhbmRzPWYsZC5iYW5kc01hcD17fTtmb3IodmFyIF89MDtfPGQuYmFuZHMubGVuZ3RoO18rKyl7dmFyIHk9ZC5iYW5kc1tfXTtfPjAmJmQuYmFuZHNbXy0xXS5jb25uZWN0KHkpLGQuYmFuZHNNYXBbeS5mcmVxdWVuY3kudmFsdWVdPXl9cmV0dXJuIGR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5zZXRHYWluPWZ1bmN0aW9uKGUsdCl7aWYodm9pZCAwPT09dCYmKHQ9MCksIXRoaXMuYmFuZHNNYXBbZV0pdGhyb3dcIk5vIGJhbmQgZm91bmQgZm9yIGZyZXF1ZW5jeSBcIitlO2wuc2V0UGFyYW1WYWx1ZSh0aGlzLmJhbmRzTWFwW2VdLmdhaW4sdCl9LG4ucHJvdG90eXBlLmdldEdhaW49ZnVuY3Rpb24oZSl7aWYoIXRoaXMuYmFuZHNNYXBbZV0pdGhyb3dcIk5vIGJhbmQgZm91bmQgZm9yIGZyZXF1ZW5jeSBcIitlO3JldHVybiB0aGlzLmJhbmRzTWFwW2VdLmdhaW4udmFsdWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYzMlwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjMyKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYzMixlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmNjRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY2NCl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GNjQsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjEyNVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjEyNSl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMTI1LGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYyNTBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYyNTApfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjI1MCxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmNTAwXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GNTAwKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY1MDAsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjFrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMUspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjFLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYya1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjJLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYySyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmNGtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY0Syl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GNEssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjhrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GOEspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjhLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYxNmtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYxNkspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjE2SyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuYmFuZHMuZm9yRWFjaChmdW5jdGlvbihlKXtsLnNldFBhcmFtVmFsdWUoZS5nYWluLDApfSl9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmJhbmRzLmZvckVhY2goZnVuY3Rpb24oZSl7ZS5kaXNjb25uZWN0KCl9KSx0aGlzLmJhbmRzPW51bGwsdGhpcy5iYW5kc01hcD1udWxsfSxuLkYzMj0zMixuLkY2ND02NCxuLkYxMjU9MTI1LG4uRjI1MD0yNTAsbi5GNTAwPTUwMCxuLkYxSz0xZTMsbi5GMks9MmUzLG4uRjRLPTRlMyxuLkY4Sz04ZTMsbi5GMTZLPTE2ZTMsbn0oYyksaD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZvaWQgMD09PXQmJih0PTApO3ZhciBuPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQobj1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIG89Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVXYXZlU2hhcGVyKCk7cmV0dXJuIG49ZS5jYWxsKHRoaXMsbyl8fHRoaXMsbi5fZGlzdG9ydGlvbj1vLG4uYW1vdW50PXQsbn1yZXR1cm4gdChuLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImFtb3VudFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYW1vdW50fSxzZXQ6ZnVuY3Rpb24oZSl7ZSo9MWUzLHRoaXMuX2Ftb3VudD1lO2Zvcih2YXIgdCxuPW5ldyBGbG9hdDMyQXJyYXkoNDQxMDApLG89TWF0aC5QSS8xODAsaT0wO2k8NDQxMDA7KytpKXQ9MippLzQ0MTAwLTEsbltpXT0oMytlKSp0KjIwKm8vKE1hdGguUEkrZSpNYXRoLmFicyh0KSk7dGhpcy5fZGlzdG9ydGlvbi5jdXJ2ZT1uLHRoaXMuX2Rpc3RvcnRpb24ub3ZlcnNhbXBsZT1cIjR4XCJ9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX2Rpc3RvcnRpb249bnVsbCxlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyl9LG59KGMpLGQ9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2b2lkIDA9PT10JiYodD0wKTt2YXIgbj10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKG49ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBvLGkscixzPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQ7cmV0dXJuIHMuY3JlYXRlU3RlcmVvUGFubmVyP3I9bz1zLmNyZWF0ZVN0ZXJlb1Bhbm5lcigpOigoaT1zLmNyZWF0ZVBhbm5lcigpKS5wYW5uaW5nTW9kZWw9XCJlcXVhbHBvd2VyXCIscj1pKSxuPWUuY2FsbCh0aGlzLHIpfHx0aGlzLG4uX3N0ZXJlbz1vLG4uX3Bhbm5lcj1pLG4ucGFuPXQsbn1yZXR1cm4gdChuLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGFufSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGFuPWUsdGhpcy5fc3RlcmVvP2wuc2V0UGFyYW1WYWx1ZSh0aGlzLl9zdGVyZW8ucGFuLGUpOnRoaXMuX3Bhbm5lci5zZXRQb3NpdGlvbihlLDAsMS1NYXRoLmFicyhlKSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2UucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKSx0aGlzLl9zdGVyZW89bnVsbCx0aGlzLl9wYW5uZXI9bnVsbH0sbn0oYyksZj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQsbixvKXt2b2lkIDA9PT10JiYodD0zKSx2b2lkIDA9PT1uJiYobj0yKSx2b2lkIDA9PT1vJiYobz0hMSk7dmFyIGk9dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChpPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgcj1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUNvbnZvbHZlcigpO3JldHVybiBpPWUuY2FsbCh0aGlzLHIpfHx0aGlzLGkuX2NvbnZvbHZlcj1yLGkuX3NlY29uZHM9aS5fY2xhbXAodCwxLDUwKSxpLl9kZWNheT1pLl9jbGFtcChuLDAsMTAwKSxpLl9yZXZlcnNlPW8saS5fcmVidWlsZCgpLGl9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5fY2xhbXA9ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBNYXRoLm1pbihuLE1hdGgubWF4KHQsZSkpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzZWNvbmRzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zZWNvbmRzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc2Vjb25kcz10aGlzLl9jbGFtcChlLDEsNTApLHRoaXMuX3JlYnVpbGQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJkZWNheVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGVjYXl9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9kZWNheT10aGlzLl9jbGFtcChlLDAsMTAwKSx0aGlzLl9yZWJ1aWxkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicmV2ZXJzZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmV2ZXJzZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3JldmVyc2U9ZSx0aGlzLl9yZWJ1aWxkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuX3JlYnVpbGQ9ZnVuY3Rpb24oKXtmb3IodmFyIGUsdD1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LG49dC5zYW1wbGVSYXRlLG89bip0aGlzLl9zZWNvbmRzLGk9dC5jcmVhdGVCdWZmZXIoMixvLG4pLHI9aS5nZXRDaGFubmVsRGF0YSgwKSxzPWkuZ2V0Q2hhbm5lbERhdGEoMSksdT0wO3U8bzt1KyspZT10aGlzLl9yZXZlcnNlP28tdTp1LHJbdV09KDIqTWF0aC5yYW5kb20oKS0xKSpNYXRoLnBvdygxLWUvbyx0aGlzLl9kZWNheSksc1t1XT0oMipNYXRoLnJhbmRvbSgpLTEpKk1hdGgucG93KDEtZS9vLHRoaXMuX2RlY2F5KTt0aGlzLl9jb252b2x2ZXIuYnVmZmVyPWl9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9jb252b2x2ZXI9bnVsbCxlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyl9LG59KGMpLF89ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3ZhciB0PXRoaXM7Uy5pbnN0YW5jZS51c2VMZWdhY3kmJih0PWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgbj1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LG89bi5jcmVhdGVDaGFubmVsU3BsaXR0ZXIoKSxpPW4uY3JlYXRlQ2hhbm5lbE1lcmdlcigpO3JldHVybiBpLmNvbm5lY3QobyksdD1lLmNhbGwodGhpcyxpLG8pfHx0aGlzLHQuX21lcmdlcj1pLHR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fbWVyZ2VyLmRpc2Nvbm5lY3QoKSx0aGlzLl9tZXJnZXI9bnVsbCxlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyl9LG59KGMpLHk9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKGUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgdD1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LG49dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxvPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCksaT10LmNyZWF0ZUJpcXVhZEZpbHRlcigpLHI9dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtyZXR1cm4gbi50eXBlPVwibG93cGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShuLmZyZXF1ZW5jeSwyZTMpLG8udHlwZT1cImxvd3Bhc3NcIixsLnNldFBhcmFtVmFsdWUoby5mcmVxdWVuY3ksMmUzKSxpLnR5cGU9XCJoaWdocGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShpLmZyZXF1ZW5jeSw1MDApLHIudHlwZT1cImhpZ2hwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKHIuZnJlcXVlbmN5LDUwMCksbi5jb25uZWN0KG8pLG8uY29ubmVjdChpKSxpLmNvbm5lY3QociksZS5jYWxsKHRoaXMsbixyKXx8dGhpc31yZXR1cm4gdChuLGUpLG59KGMpLG09T2JqZWN0LmZyZWV6ZSh7RmlsdGVyOmMsRXF1YWxpemVyRmlsdGVyOnAsRGlzdG9ydGlvbkZpbHRlcjpoLFN0ZXJlb0ZpbHRlcjpkLFJldmVyYkZpbHRlcjpmLE1vbm9GaWx0ZXI6XyxUZWxlcGhvbmVGaWx0ZXI6eX0pLGI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3ZhciB0PWUuY2FsbCh0aGlzKXx8dGhpcztyZXR1cm4gdC5zcGVlZD0xLHQudm9sdW1lPTEsdC5tdXRlZD0hMSx0LnBhdXNlZD0hMSx0fXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3RoaXMuZW1pdChcInJlZnJlc2hcIil9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJyZWZyZXNoUGF1c2VkXCIpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgZmlsdGVyc1wiKSxudWxsfSxzZXQ6ZnVuY3Rpb24oZSl7Y29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGZpbHRlcnNcIil9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiYXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiBjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgYXVkaW9Db250ZXh0XCIpLG51bGx9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUudG9nZ2xlTXV0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLm11dGVkPSF0aGlzLm11dGVkLHRoaXMucmVmcmVzaCgpLHRoaXMubXV0ZWR9LG4ucHJvdG90eXBlLnRvZ2dsZVBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF1c2VkPSF0aGlzLnBhdXNlZCx0aGlzLnJlZnJlc2hQYXVzZWQoKSx0aGlzLnBhdXNlZH0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCl9LG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSxnPU9iamVjdC5mcmVlemUoe0hUTUxBdWRpb01lZGlhOnMsSFRNTEF1ZGlvSW5zdGFuY2U6cixIVE1MQXVkaW9Db250ZXh0OmJ9KSx2PTAsUD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZhciBuPWUuY2FsbCh0aGlzKXx8dGhpcztyZXR1cm4gbi5pZD12Kyssbi5fbWVkaWE9bnVsbCxuLl9wYXVzZWQ9ITEsbi5fbXV0ZWQ9ITEsbi5fZWxhcHNlZD0wLG4uX3VwZGF0ZUxpc3RlbmVyPW4uX3VwZGF0ZS5iaW5kKG4pLG4uaW5pdCh0KSxufXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmKHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInN0b3BcIikpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzcGVlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zcGVlZD1lLHRoaXMucmVmcmVzaCgpLHRoaXMuX3VwZGF0ZSghMCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwidm9sdW1lXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl92b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl92b2x1bWU9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJtdXRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbXV0ZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9tdXRlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImxvb3BcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xvb3B9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9sb29wPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQ7dGhpcy5fc291cmNlLmxvb3A9dGhpcy5fbG9vcHx8dC5sb29wO3ZhciBuPWUudm9sdW1lKihlLm11dGVkPzA6MSksbz10LnZvbHVtZSoodC5tdXRlZD8wOjEpLGk9dGhpcy5fdm9sdW1lKih0aGlzLl9tdXRlZD8wOjEpO2wuc2V0UGFyYW1WYWx1ZSh0aGlzLl9nYWluLmdhaW4saSpvKm4pLGwuc2V0UGFyYW1WYWx1ZSh0aGlzLl9zb3VyY2UucGxheWJhY2tSYXRlLHRoaXMuX3NwZWVkKnQuc3BlZWQqZS5zcGVlZCl9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50LG49dGhpcy5fcGF1c2VkfHx0LnBhdXNlZHx8ZS5wYXVzZWQ7biE9PXRoaXMuX3BhdXNlZFJlYWwmJih0aGlzLl9wYXVzZWRSZWFsPW4sbj8odGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwicGF1c2VkXCIpKToodGhpcy5lbWl0KFwicmVzdW1lZFwiKSx0aGlzLnBsYXkoe3N0YXJ0OnRoaXMuX2VsYXBzZWQldGhpcy5fZHVyYXRpb24sZW5kOnRoaXMuX2VuZCxzcGVlZDp0aGlzLl9zcGVlZCxsb29wOnRoaXMuX2xvb3Asdm9sdW1lOnRoaXMuX3ZvbHVtZX0pKSx0aGlzLmVtaXQoXCJwYXVzZVwiLG4pKX0sbi5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlKXt2YXIgdD1lLnN0YXJ0LG49ZS5lbmQsbz1lLnNwZWVkLGk9ZS5sb29wLHI9ZS52b2x1bWUscz1lLm11dGVkO24mJmNvbnNvbGUuYXNzZXJ0KG4+dCxcIkVuZCB0aW1lIGlzIGJlZm9yZSBzdGFydCB0aW1lXCIpLHRoaXMuX3BhdXNlZD0hMTt2YXIgdT10aGlzLl9tZWRpYS5ub2Rlcy5jbG9uZUJ1ZmZlclNvdXJjZSgpLGE9dS5zb3VyY2UsYz11LmdhaW47dGhpcy5fc291cmNlPWEsdGhpcy5fZ2Fpbj1jLHRoaXMuX3NwZWVkPW8sdGhpcy5fdm9sdW1lPXIsdGhpcy5fbG9vcD0hIWksdGhpcy5fbXV0ZWQ9cyx0aGlzLnJlZnJlc2goKSx0aGlzLmxvb3AmJm51bGwhPT1uJiYoY29uc29sZS53YXJuKCdMb29waW5nIG5vdCBzdXBwb3J0IHdoZW4gc3BlY2lmeWluZyBhbiBcImVuZFwiIHRpbWUnKSx0aGlzLmxvb3A9ITEpLHRoaXMuX2VuZD1uO3ZhciBsPXRoaXMuX3NvdXJjZS5idWZmZXIuZHVyYXRpb247dGhpcy5fZHVyYXRpb249bCx0aGlzLl9sYXN0VXBkYXRlPXRoaXMuX25vdygpLHRoaXMuX2VsYXBzZWQ9dCx0aGlzLl9zb3VyY2Uub25lbmRlZD10aGlzLl9vbkNvbXBsZXRlLmJpbmQodGhpcyksbj90aGlzLl9zb3VyY2Uuc3RhcnQoMCx0LG4tdCk6dGhpcy5fc291cmNlLnN0YXJ0KDAsdCksdGhpcy5lbWl0KFwic3RhcnRcIiksdGhpcy5fdXBkYXRlKCEwKSx0aGlzLl9lbmFibGVkPSEwfSxuLnByb3RvdHlwZS5fdG9TZWM9ZnVuY3Rpb24oZSl7cmV0dXJuIGU+MTAmJihlLz0xZTMpLGV8fDB9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIl9lbmFibGVkXCIse3NldDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLl9tZWRpYS5ub2Rlcy5zY3JpcHQ7dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYXVkaW9wcm9jZXNzXCIsdGhpcy5fdXBkYXRlTGlzdGVuZXIpLGUmJnQuYWRkRXZlbnRMaXN0ZW5lcihcImF1ZGlvcHJvY2Vzc1wiLHRoaXMuX3VwZGF0ZUxpc3RlbmVyKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwcm9ncmVzc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcHJvZ3Jlc3N9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYXVzZWQ9ZSx0aGlzLnJlZnJlc2hQYXVzZWQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLl9zb3VyY2UmJih0aGlzLl9zb3VyY2UuZGlzY29ubmVjdCgpLHRoaXMuX3NvdXJjZT1udWxsKSx0aGlzLl9nYWluJiYodGhpcy5fZ2Fpbi5kaXNjb25uZWN0KCksdGhpcy5fZ2Fpbj1udWxsKSx0aGlzLl9tZWRpYSYmKHRoaXMuX21lZGlhLmNvbnRleHQuZXZlbnRzLm9mZihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksdGhpcy5fbWVkaWEuY29udGV4dC5ldmVudHMub2ZmKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKSx0aGlzLl9tZWRpYT1udWxsKSx0aGlzLl9lbmQ9bnVsbCx0aGlzLl9zcGVlZD0xLHRoaXMuX3ZvbHVtZT0xLHRoaXMuX2xvb3A9ITEsdGhpcy5fZWxhcHNlZD0wLHRoaXMuX2R1cmF0aW9uPTAsdGhpcy5fcGF1c2VkPSExLHRoaXMuX211dGVkPSExLHRoaXMuX3BhdXNlZFJlYWw9ITF9LG4ucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJbV2ViQXVkaW9JbnN0YW5jZSBpZD1cIit0aGlzLmlkK1wiXVwifSxuLnByb3RvdHlwZS5fbm93PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX21lZGlhLmNvbnRleHQuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lfSxuLnByb3RvdHlwZS5fdXBkYXRlPWZ1bmN0aW9uKGUpe2lmKHZvaWQgMD09PWUmJihlPSExKSx0aGlzLl9zb3VyY2Upe3ZhciB0PXRoaXMuX25vdygpLG49dC10aGlzLl9sYXN0VXBkYXRlO2lmKG4+MHx8ZSl7dmFyIG89dGhpcy5fc291cmNlLnBsYXliYWNrUmF0ZS52YWx1ZTt0aGlzLl9lbGFwc2VkKz1uKm8sdGhpcy5fbGFzdFVwZGF0ZT10O3ZhciBpPXRoaXMuX2R1cmF0aW9uLHI9dGhpcy5fZWxhcHNlZCVpL2k7dGhpcy5fcHJvZ3Jlc3M9cix0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLHRoaXMuX3Byb2dyZXNzLGkpfX19LG4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5fbWVkaWE9ZSxlLmNvbnRleHQuZXZlbnRzLm9uKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSxlLmNvbnRleHQuZXZlbnRzLm9uKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKX0sbi5wcm90b3R5cGUuX2ludGVybmFsU3RvcD1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmKHRoaXMuX2VuYWJsZWQ9ITEsdGhpcy5fc291cmNlLm9uZW5kZWQ9bnVsbCx0aGlzLl9zb3VyY2Uuc3RvcCgpLHRoaXMuX3NvdXJjZT1udWxsKX0sbi5wcm90b3R5cGUuX29uQ29tcGxldGU9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJih0aGlzLl9lbmFibGVkPSExLHRoaXMuX3NvdXJjZS5vbmVuZGVkPW51bGwpLHRoaXMuX3NvdXJjZT1udWxsLHRoaXMuX3Byb2dyZXNzPTEsdGhpcy5lbWl0KFwicHJvZ3Jlc3NcIiwxLHRoaXMuX2R1cmF0aW9uKSx0aGlzLmVtaXQoXCJlbmRcIix0aGlzKX0sbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLHg9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2YXIgbz10aGlzLGk9dC5hdWRpb0NvbnRleHQscj1pLmNyZWF0ZUJ1ZmZlclNvdXJjZSgpLHM9aS5jcmVhdGVTY3JpcHRQcm9jZXNzb3Iobi5CVUZGRVJfU0laRSksdT1pLmNyZWF0ZUdhaW4oKSxhPWkuY3JlYXRlQW5hbHlzZXIoKTtyZXR1cm4gci5jb25uZWN0KGEpLGEuY29ubmVjdCh1KSx1LmNvbm5lY3QodC5kZXN0aW5hdGlvbikscy5jb25uZWN0KHQuZGVzdGluYXRpb24pLG89ZS5jYWxsKHRoaXMsYSx1KXx8dGhpcyxvLmNvbnRleHQ9dCxvLmJ1ZmZlclNvdXJjZT1yLG8uc2NyaXB0PXMsby5nYWluPXUsby5hbmFseXNlcj1hLG99cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7ZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpLHRoaXMuYnVmZmVyU291cmNlLmRpc2Nvbm5lY3QoKSx0aGlzLnNjcmlwdC5kaXNjb25uZWN0KCksdGhpcy5nYWluLmRpc2Nvbm5lY3QoKSx0aGlzLmFuYWx5c2VyLmRpc2Nvbm5lY3QoKSx0aGlzLmJ1ZmZlclNvdXJjZT1udWxsLHRoaXMuc2NyaXB0PW51bGwsdGhpcy5nYWluPW51bGwsdGhpcy5hbmFseXNlcj1udWxsLHRoaXMuY29udGV4dD1udWxsfSxuLnByb3RvdHlwZS5jbG9uZUJ1ZmZlclNvdXJjZT1mdW5jdGlvbigpe3ZhciBlPXRoaXMuYnVmZmVyU291cmNlLHQ9dGhpcy5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTt0LmJ1ZmZlcj1lLmJ1ZmZlcixsLnNldFBhcmFtVmFsdWUodC5wbGF5YmFja1JhdGUsZS5wbGF5YmFja1JhdGUudmFsdWUpLHQubG9vcD1lLmxvb3A7dmFyIG49dGhpcy5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7cmV0dXJuIHQuY29ubmVjdChuKSxuLmNvbm5lY3QodGhpcy5kZXN0aW5hdGlvbikse3NvdXJjZTp0LGdhaW46bn19LG4uQlVGRkVSX1NJWkU9MjU2LG59KG4pLE89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMucGFyZW50PWUsdGhpcy5fbm9kZXM9bmV3IHgodGhpcy5jb250ZXh0KSx0aGlzLl9zb3VyY2U9dGhpcy5fbm9kZXMuYnVmZmVyU291cmNlLHRoaXMuc291cmNlPWUub3B0aW9ucy5zb3VyY2V9LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnBhcmVudD1udWxsLHRoaXMuX25vZGVzLmRlc3Ryb3koKSx0aGlzLl9ub2Rlcz1udWxsLHRoaXMuX3NvdXJjZT1udWxsLHRoaXMuc291cmNlPW51bGx9LGUucHJvdG90eXBlLmNyZWF0ZT1mdW5jdGlvbigpe3JldHVybiBuZXcgUCh0aGlzKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXJlbnQuY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJpc1BsYXlhYmxlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiEhdGhpcy5fc291cmNlJiYhIXRoaXMuX3NvdXJjZS5idWZmZXJ9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbm9kZXMuZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX25vZGVzLmZpbHRlcnM9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJkdXJhdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY29uc29sZS5hc3NlcnQodGhpcy5pc1BsYXlhYmxlLFwiU291bmQgbm90IHlldCBwbGF5YWJsZSwgbm8gZHVyYXRpb25cIiksdGhpcy5fc291cmNlLmJ1ZmZlci5kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJidWZmZXJcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZS5idWZmZXJ9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zb3VyY2UuYnVmZmVyPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwibm9kZXNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX25vZGVzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oZSl7dGhpcy5zb3VyY2U/dGhpcy5fZGVjb2RlKHRoaXMuc291cmNlLGUpOnRoaXMucGFyZW50LnVybD90aGlzLl9sb2FkVXJsKGUpOmU/ZShuZXcgRXJyb3IoXCJzb3VuZC51cmwgb3Igc291bmQuc291cmNlIG11c3QgYmUgc2V0XCIpKTpjb25zb2xlLmVycm9yKFwic291bmQudXJsIG9yIHNvdW5kLnNvdXJjZSBtdXN0IGJlIHNldFwiKX0sZS5wcm90b3R5cGUuX2xvYWRVcmw9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxuPW5ldyBYTUxIdHRwUmVxdWVzdCxvPXRoaXMucGFyZW50LnVybDtuLm9wZW4oXCJHRVRcIixvLCEwKSxuLnJlc3BvbnNlVHlwZT1cImFycmF5YnVmZmVyXCIsbi5vbmxvYWQ9ZnVuY3Rpb24oKXt0LnNvdXJjZT1uLnJlc3BvbnNlLHQuX2RlY29kZShuLnJlc3BvbnNlLGUpfSxuLnNlbmQoKX0sZS5wcm90b3R5cGUuX2RlY29kZT1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXM7dGhpcy5wYXJlbnQuY29udGV4dC5kZWNvZGUoZSxmdW5jdGlvbihlLG8pe2lmKGUpdCYmdChlKTtlbHNle24ucGFyZW50LmlzTG9hZGVkPSEwLG4uYnVmZmVyPW87dmFyIGk9bi5wYXJlbnQuYXV0b1BsYXlTdGFydCgpO3QmJnQobnVsbCxuLnBhcmVudCxpKX19KX0sZX0oKSx3PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5yZXNvbHZlVXJsPWZ1bmN0aW9uKHQpe3ZhciBuPWUuRk9STUFUX1BBVFRFUk4sbz1cInN0cmluZ1wiPT10eXBlb2YgdD90OnQudXJsO2lmKG4udGVzdChvKSl7Zm9yKHZhciBpPW4uZXhlYyhvKSxyPWlbMl0uc3BsaXQoXCIsXCIpLHM9cltyLmxlbmd0aC0xXSx1PTAsYT1yLmxlbmd0aDt1PGE7dSsrKXt2YXIgYz1yW3VdO2lmKGUuc3VwcG9ydGVkW2NdKXtzPWM7YnJlYWt9fXZhciBsPW8ucmVwbGFjZShpWzFdLHMpO3JldHVyblwic3RyaW5nXCIhPXR5cGVvZiB0JiYodC5leHRlbnNpb249cyx0LnVybD1sKSxsfXJldHVybiBvfSxlLnNpbmVUb25lPWZ1bmN0aW9uKGUsdCl7dm9pZCAwPT09ZSYmKGU9MjAwKSx2b2lkIDA9PT10JiYodD0xKTt2YXIgbj1JLmZyb20oe3NpbmdsZUluc3RhbmNlOiEwfSk7aWYoIShuLm1lZGlhIGluc3RhbmNlb2YgTykpcmV0dXJuIG47Zm9yKHZhciBvPW4ubWVkaWEsaT1uLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLDQ4ZTMqdCw0OGUzKSxyPWkuZ2V0Q2hhbm5lbERhdGEoMCkscz0wO3M8ci5sZW5ndGg7cysrKXt2YXIgdT1lKihzL2kuc2FtcGxlUmF0ZSkqTWF0aC5QSTtyW3NdPTIqTWF0aC5zaW4odSl9cmV0dXJuIG8uYnVmZmVyPWksbi5pc0xvYWRlZD0hMCxufSxlLnJlbmRlcj1mdW5jdGlvbihlLHQpe3ZhciBuPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7dD1PYmplY3QuYXNzaWduKHt3aWR0aDo1MTIsaGVpZ2h0OjEyOCxmaWxsOlwiYmxhY2tcIn0sdHx8e30pLG4ud2lkdGg9dC53aWR0aCxuLmhlaWdodD10LmhlaWdodDt2YXIgbz1QSVhJLkJhc2VUZXh0dXJlLmZyb21DYW52YXMobik7aWYoIShlLm1lZGlhIGluc3RhbmNlb2YgTykpcmV0dXJuIG87dmFyIGk9ZS5tZWRpYTtjb25zb2xlLmFzc2VydCghIWkuYnVmZmVyLFwiTm8gYnVmZmVyIGZvdW5kLCBsb2FkIGZpcnN0XCIpO3ZhciByPW4uZ2V0Q29udGV4dChcIjJkXCIpO3IuZmlsbFN0eWxlPXQuZmlsbDtmb3IodmFyIHM9aS5idWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCksdT1NYXRoLmNlaWwocy5sZW5ndGgvdC53aWR0aCksYT10LmhlaWdodC8yLGM9MDtjPHQud2lkdGg7YysrKXtmb3IodmFyIGw9MSxwPS0xLGg9MDtoPHU7aCsrKXt2YXIgZD1zW2MqdStoXTtkPGwmJihsPWQpLGQ+cCYmKHA9ZCl9ci5maWxsUmVjdChjLCgxK2wpKmEsMSxNYXRoLm1heCgxLChwLWwpKmEpKX1yZXR1cm4gb30sZS5wbGF5T25jZT1mdW5jdGlvbih0LG4pe3ZhciBvPVwiYWxpYXNcIitlLlBMQVlfSUQrKztyZXR1cm4gUy5pbnN0YW5jZS5hZGQobyx7dXJsOnQscHJlbG9hZDohMCxhdXRvUGxheTohMCxsb2FkZWQ6ZnVuY3Rpb24oZSl7ZSYmKGNvbnNvbGUuZXJyb3IoZSksUy5pbnN0YW5jZS5yZW1vdmUobyksbiYmbihlKSl9LGNvbXBsZXRlOmZ1bmN0aW9uKCl7Uy5pbnN0YW5jZS5yZW1vdmUobyksbiYmbihudWxsKX19KSxvfSxlLlBMQVlfSUQ9MCxlLkZPUk1BVF9QQVRURVJOPS9cXC4oXFx7KFteXFx9XSspXFx9KShcXD8uKik/JC8sZS5leHRlbnNpb25zPVtcIm1wM1wiLFwib2dnXCIsXCJvZ2FcIixcIm9wdXNcIixcIm1wZWdcIixcIndhdlwiLFwibTRhXCIsXCJtcDRcIixcImFpZmZcIixcIndtYVwiLFwibWlkXCJdLGUuc3VwcG9ydGVkPWZ1bmN0aW9uKCl7dmFyIHQ9e200YTpcIm1wNFwiLG9nYTpcIm9nZ1wifSxuPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKSxvPXt9O3JldHVybiBlLmV4dGVuc2lvbnMuZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgaT10W2VdfHxlLHI9bi5jYW5QbGF5VHlwZShcImF1ZGlvL1wiK2UpLnJlcGxhY2UoL15ubyQvLFwiXCIpLHM9bi5jYW5QbGF5VHlwZShcImF1ZGlvL1wiK2kpLnJlcGxhY2UoL15ubyQvLFwiXCIpO29bZV09ISFyfHwhIXN9KSxPYmplY3QuZnJlZXplKG8pfSgpLGV9KCksaj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQsbil7dmFyIG89ZS5jYWxsKHRoaXMsdCxuKXx8dGhpcztyZXR1cm4gby51c2UoQS5wbHVnaW4pLG8ucHJlKEEucmVzb2x2ZSksb31yZXR1cm4gdChuLGUpLG4uYWRkUGl4aU1pZGRsZXdhcmU9ZnVuY3Rpb24odCl7ZS5hZGRQaXhpTWlkZGxld2FyZS5jYWxsKHRoaXMsdCl9LG59KFBJWEkubG9hZGVycy5Mb2FkZXIpLEE9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLmluc3RhbGw9ZnVuY3Rpb24odCl7ZS5fc291bmQ9dCxlLmxlZ2FjeT10LnVzZUxlZ2FjeSxQSVhJLmxvYWRlcnMuTG9hZGVyPWosUElYSS5sb2FkZXIudXNlKGUucGx1Z2luKSxQSVhJLmxvYWRlci5wcmUoZS5yZXNvbHZlKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJsZWdhY3lcIix7c2V0OmZ1bmN0aW9uKGUpe3ZhciB0PVBJWEkubG9hZGVycy5SZXNvdXJjZSxuPXcuZXh0ZW5zaW9ucztlP24uZm9yRWFjaChmdW5jdGlvbihlKXt0LnNldEV4dGVuc2lvblhoclR5cGUoZSx0LlhIUl9SRVNQT05TRV9UWVBFLkRFRkFVTFQpLHQuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZSx0LkxPQURfVFlQRS5BVURJTyl9KTpuLmZvckVhY2goZnVuY3Rpb24oZSl7dC5zZXRFeHRlbnNpb25YaHJUeXBlKGUsdC5YSFJfUkVTUE9OU0VfVFlQRS5CVUZGRVIpLHQuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZSx0LkxPQURfVFlQRS5YSFIpfSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5yZXNvbHZlPWZ1bmN0aW9uKGUsdCl7dy5yZXNvbHZlVXJsKGUpLHQoKX0sZS5wbHVnaW49ZnVuY3Rpb24odCxuKXt0LmRhdGEmJncuZXh0ZW5zaW9ucy5pbmRleE9mKHQuZXh0ZW5zaW9uKT4tMT90LnNvdW5kPWUuX3NvdW5kLmFkZCh0Lm5hbWUse2xvYWRlZDpuLHByZWxvYWQ6ITAsdXJsOnQudXJsLHNvdXJjZTp0LmRhdGF9KTpuKCl9LGV9KCksRj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLnBhcmVudD1lLE9iamVjdC5hc3NpZ24odGhpcyx0KSx0aGlzLmR1cmF0aW9uPXRoaXMuZW5kLXRoaXMuc3RhcnQsY29uc29sZS5hc3NlcnQodGhpcy5kdXJhdGlvbj4wLFwiRW5kIHRpbWUgbXVzdCBiZSBhZnRlciBzdGFydCB0aW1lXCIpfXJldHVybiBlLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnBhcmVudC5wbGF5KE9iamVjdC5hc3NpZ24oe2NvbXBsZXRlOmUsc3BlZWQ6dGhpcy5zcGVlZHx8dGhpcy5wYXJlbnQuc3BlZWQsZW5kOnRoaXMuZW5kLHN0YXJ0OnRoaXMuc3RhcnR9KSl9LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnBhcmVudD1udWxsfSxlfSgpLEU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3ZhciB0PXRoaXMsbz1uZXcgbi5BdWRpb0NvbnRleHQsaT1vLmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpLHI9by5jcmVhdGVBbmFseXNlcigpO3JldHVybiByLmNvbm5lY3QoaSksaS5jb25uZWN0KG8uZGVzdGluYXRpb24pLHQ9ZS5jYWxsKHRoaXMscixpKXx8dGhpcyx0Ll9jdHg9byx0Ll9vZmZsaW5lQ3R4PW5ldyBuLk9mZmxpbmVBdWRpb0NvbnRleHQoMSwyLG8uc2FtcGxlUmF0ZSksdC5fdW5sb2NrZWQ9ITEsdC5jb21wcmVzc29yPWksdC5hbmFseXNlcj1yLHQuZXZlbnRzPW5ldyBQSVhJLnV0aWxzLkV2ZW50RW1pdHRlcix0LnZvbHVtZT0xLHQuc3BlZWQ9MSx0Lm11dGVkPSExLHQucGF1c2VkPSExLFwib250b3VjaHN0YXJ0XCJpbiB3aW5kb3cmJlwicnVubmluZ1wiIT09by5zdGF0ZSYmKHQuX3VubG9jaygpLHQuX3VubG9jaz10Ll91bmxvY2suYmluZCh0KSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsdC5fdW5sb2NrLCEwKSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLHQuX3VubG9jaywhMCksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsdC5fdW5sb2NrLCEwKSksdH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLl91bmxvY2s9ZnVuY3Rpb24oKXt0aGlzLl91bmxvY2tlZHx8KHRoaXMucGxheUVtcHR5U291bmQoKSxcInJ1bm5pbmdcIj09PXRoaXMuX2N0eC5zdGF0ZSYmKGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIix0aGlzLl91bmxvY2ssITApLGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLHRoaXMuX3VubG9jaywhMCksZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIix0aGlzLl91bmxvY2ssITApLHRoaXMuX3VubG9ja2VkPSEwKSl9LG4ucHJvdG90eXBlLnBsYXlFbXB0eVNvdW5kPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO2UuYnVmZmVyPXRoaXMuX2N0eC5jcmVhdGVCdWZmZXIoMSwxLDIyMDUwKSxlLmNvbm5lY3QodGhpcy5fY3R4LmRlc3RpbmF0aW9uKSxlLnN0YXJ0KDAsMCwwKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJBdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7dmFyIGU9d2luZG93O3JldHVybiBlLkF1ZGlvQ29udGV4dHx8ZS53ZWJraXRBdWRpb0NvbnRleHR8fG51bGx9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJPZmZsaW5lQXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3ZhciBlPXdpbmRvdztyZXR1cm4gZS5PZmZsaW5lQXVkaW9Db250ZXh0fHxlLndlYmtpdE9mZmxpbmVBdWRpb0NvbnRleHR8fG51bGx9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2UucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKTt2YXIgdD10aGlzLl9jdHg7dm9pZCAwIT09dC5jbG9zZSYmdC5jbG9zZSgpLHRoaXMuZXZlbnRzLnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMuYW5hbHlzZXIuZGlzY29ubmVjdCgpLHRoaXMuY29tcHJlc3Nvci5kaXNjb25uZWN0KCksdGhpcy5hbmFseXNlcj1udWxsLHRoaXMuY29tcHJlc3Nvcj1udWxsLHRoaXMuZXZlbnRzPW51bGwsdGhpcy5fb2ZmbGluZUN0eD1udWxsLHRoaXMuX2N0eD1udWxsfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJhdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2N0eH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJvZmZsaW5lQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fb2ZmbGluZUN0eH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe2UmJlwicnVubmluZ1wiPT09dGhpcy5fY3R4LnN0YXRlP3RoaXMuX2N0eC5zdXNwZW5kKCk6ZXx8XCJzdXNwZW5kZWRcIiE9PXRoaXMuX2N0eC5zdGF0ZXx8dGhpcy5fY3R4LnJlc3VtZSgpLHRoaXMuX3BhdXNlZD1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt0aGlzLmV2ZW50cy5lbWl0KFwicmVmcmVzaFwiKX0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3RoaXMuZXZlbnRzLmVtaXQoXCJyZWZyZXNoUGF1c2VkXCIpfSxuLnByb3RvdHlwZS50b2dnbGVNdXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubXV0ZWQ9IXRoaXMubXV0ZWQsdGhpcy5yZWZyZXNoKCksdGhpcy5tdXRlZH0sbi5wcm90b3R5cGUudG9nZ2xlUGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXVzZWQ9IXRoaXMucGF1c2VkLHRoaXMucmVmcmVzaFBhdXNlZCgpLHRoaXMuX3BhdXNlZH0sbi5wcm90b3R5cGUuZGVjb2RlPWZ1bmN0aW9uKGUsdCl7dGhpcy5fb2ZmbGluZUN0eC5kZWNvZGVBdWRpb0RhdGEoZSxmdW5jdGlvbihlKXt0KG51bGwsZSl9LGZ1bmN0aW9uKCl7dChuZXcgRXJyb3IoXCJVbmFibGUgdG8gZGVjb2RlIGZpbGVcIikpfSl9LG59KG4pLEw9T2JqZWN0LmZyZWV6ZSh7V2ViQXVkaW9NZWRpYTpPLFdlYkF1ZGlvSW5zdGFuY2U6UCxXZWJBdWRpb05vZGVzOngsV2ViQXVkaW9Db250ZXh0OkUsV2ViQXVkaW9VdGlsczpsfSksUz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt0aGlzLmluaXQoKX1yZXR1cm4gZS5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnN1cHBvcnRlZCYmKHRoaXMuX3dlYkF1ZGlvQ29udGV4dD1uZXcgRSksdGhpcy5faHRtbEF1ZGlvQ29udGV4dD1uZXcgYix0aGlzLl9zb3VuZHM9e30sdGhpcy51c2VMZWdhY3k9IXRoaXMuc3VwcG9ydGVkLHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5pbml0PWZ1bmN0aW9uKCl7aWYoZS5pbnN0YW5jZSl0aHJvdyBuZXcgRXJyb3IoXCJTb3VuZExpYnJhcnkgaXMgYWxyZWFkeSBjcmVhdGVkXCIpO3ZhciB0PWUuaW5zdGFuY2U9bmV3IGU7XCJ1bmRlZmluZWRcIj09dHlwZW9mIFByb21pc2UmJih3aW5kb3cuUHJvbWlzZT1hKSx2b2lkIDAhPT1QSVhJLmxvYWRlcnMmJkEuaW5zdGFsbCh0KSx2b2lkIDA9PT13aW5kb3cuX19waXhpU291bmQmJmRlbGV0ZSB3aW5kb3cuX19waXhpU291bmQ7dmFyIG89UElYSTtyZXR1cm4gby5zb3VuZHx8KE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwic291bmRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnRpZXModCx7ZmlsdGVyczp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG19fSxodG1sYXVkaW86e2dldDpmdW5jdGlvbigpe3JldHVybiBnfX0sd2ViYXVkaW86e2dldDpmdW5jdGlvbigpe3JldHVybiBMfX0sdXRpbHM6e2dldDpmdW5jdGlvbigpe3JldHVybiB3fX0sU291bmQ6e2dldDpmdW5jdGlvbigpe3JldHVybiBJfX0sU291bmRTcHJpdGU6e2dldDpmdW5jdGlvbigpe3JldHVybiBGfX0sRmlsdGVyYWJsZTp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG59fSxTb3VuZExpYnJhcnk6e2dldDpmdW5jdGlvbigpe3JldHVybiBlfX19KSksdH0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc0FsbFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51c2VMZWdhY3k/W106dGhpcy5fY29udGV4dC5maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy51c2VMZWdhY3l8fCh0aGlzLl9jb250ZXh0LmZpbHRlcnM9ZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3VwcG9ydGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBudWxsIT09RS5BdWRpb0NvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuYWRkPWZ1bmN0aW9uKGUsdCl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGUpe3ZhciBuPXt9O2Zvcih2YXIgbyBpbiBlKXtpPXRoaXMuX2dldE9wdGlvbnMoZVtvXSx0KTtuW29dPXRoaXMuYWRkKG8saSl9cmV0dXJuIG59aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKGNvbnNvbGUuYXNzZXJ0KCF0aGlzLl9zb3VuZHNbZV0sXCJTb3VuZCB3aXRoIGFsaWFzIFwiK2UrXCIgYWxyZWFkeSBleGlzdHMuXCIpLHQgaW5zdGFuY2VvZiBJKXJldHVybiB0aGlzLl9zb3VuZHNbZV09dCx0O3ZhciBpPXRoaXMuX2dldE9wdGlvbnModCkscj1JLmZyb20oaSk7cmV0dXJuIHRoaXMuX3NvdW5kc1tlXT1yLHJ9fSxlLnByb3RvdHlwZS5fZ2V0T3B0aW9ucz1mdW5jdGlvbihlLHQpe3ZhciBuO3JldHVybiBuPVwic3RyaW5nXCI9PXR5cGVvZiBlP3t1cmw6ZX06ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfHxlIGluc3RhbmNlb2YgSFRNTEF1ZGlvRWxlbWVudD97c291cmNlOmV9OmUsT2JqZWN0LmFzc2lnbihuLHR8fHt9KX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwidXNlTGVnYWN5XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl91c2VMZWdhY3l9LHNldDpmdW5jdGlvbihlKXtBLmxlZ2FjeT1lLHRoaXMuX3VzZUxlZ2FjeT1lLCFlJiZ0aGlzLnN1cHBvcnRlZD90aGlzLl9jb250ZXh0PXRoaXMuX3dlYkF1ZGlvQ29udGV4dDp0aGlzLl9jb250ZXh0PXRoaXMuX2h0bWxBdWRpb0NvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmV4aXN0cyhlLCEwKSx0aGlzLl9zb3VuZHNbZV0uZGVzdHJveSgpLGRlbGV0ZSB0aGlzLl9zb3VuZHNbZV0sdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwidm9sdW1lQWxsXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2NvbnRleHQudm9sdW1lPWUsdGhpcy5fY29udGV4dC5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3BlZWRBbGxcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQuc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9jb250ZXh0LnNwZWVkPWUsdGhpcy5fY29udGV4dC5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUudG9nZ2xlUGF1c2VBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC50b2dnbGVQYXVzZSgpfSxlLnByb3RvdHlwZS5wYXVzZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnBhdXNlZD0hMCx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS5yZXN1bWVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5wYXVzZWQ9ITEsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUudG9nZ2xlTXV0ZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnRvZ2dsZU11dGUoKX0sZS5wcm90b3R5cGUubXV0ZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0Lm11dGVkPSEwLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnVubXV0ZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0Lm11dGVkPSExLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnJlbW92ZUFsbD1mdW5jdGlvbigpe2Zvcih2YXIgZSBpbiB0aGlzLl9zb3VuZHMpdGhpcy5fc291bmRzW2VdLmRlc3Ryb3koKSxkZWxldGUgdGhpcy5fc291bmRzW2VdO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5zdG9wQWxsPWZ1bmN0aW9uKCl7Zm9yKHZhciBlIGluIHRoaXMuX3NvdW5kcyl0aGlzLl9zb3VuZHNbZV0uc3RvcCgpO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5leGlzdHM9ZnVuY3Rpb24oZSx0KXt2b2lkIDA9PT10JiYodD0hMSk7dmFyIG49ISF0aGlzLl9zb3VuZHNbZV07cmV0dXJuIHQmJmNvbnNvbGUuYXNzZXJ0KG4sXCJObyBzb3VuZCBtYXRjaGluZyBhbGlhcyAnXCIrZStcIicuXCIpLG59LGUucHJvdG90eXBlLmZpbmQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZXhpc3RzKGUsITApLHRoaXMuX3NvdW5kc1tlXX0sZS5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmZpbmQoZSkucGxheSh0KX0sZS5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLnN0b3AoKX0sZS5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5wYXVzZSgpfSxlLnByb3RvdHlwZS5yZXN1bWU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5yZXN1bWUoKX0sZS5wcm90b3R5cGUudm9sdW1lPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcy5maW5kKGUpO3JldHVybiB2b2lkIDAhPT10JiYobi52b2x1bWU9dCksbi52b2x1bWV9LGUucHJvdG90eXBlLnNwZWVkPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcy5maW5kKGUpO3JldHVybiB2b2lkIDAhPT10JiYobi5zcGVlZD10KSxuLnNwZWVkfSxlLnByb3RvdHlwZS5kdXJhdGlvbj1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLmR1cmF0aW9ufSxlLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnJlbW92ZUFsbCgpLHRoaXMuX3NvdW5kcz1udWxsLHRoaXMuX3dlYkF1ZGlvQ29udGV4dCYmKHRoaXMuX3dlYkF1ZGlvQ29udGV4dC5kZXN0cm95KCksdGhpcy5fd2ViQXVkaW9Db250ZXh0PW51bGwpLHRoaXMuX2h0bWxBdWRpb0NvbnRleHQmJih0aGlzLl9odG1sQXVkaW9Db250ZXh0LmRlc3Ryb3koKSx0aGlzLl9odG1sQXVkaW9Db250ZXh0PW51bGwpLHRoaXMuX2NvbnRleHQ9bnVsbCx0aGlzfSxlfSgpLEk9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5tZWRpYT1lLHRoaXMub3B0aW9ucz10LHRoaXMuX2luc3RhbmNlcz1bXSx0aGlzLl9zcHJpdGVzPXt9LHRoaXMubWVkaWEuaW5pdCh0aGlzKTt2YXIgbj10LmNvbXBsZXRlO3RoaXMuX2F1dG9QbGF5T3B0aW9ucz1uP3tjb21wbGV0ZTpufTpudWxsLHRoaXMuaXNMb2FkZWQ9ITEsdGhpcy5pc1BsYXlpbmc9ITEsdGhpcy5hdXRvUGxheT10LmF1dG9QbGF5LHRoaXMuc2luZ2xlSW5zdGFuY2U9dC5zaW5nbGVJbnN0YW5jZSx0aGlzLnByZWxvYWQ9dC5wcmVsb2FkfHx0aGlzLmF1dG9QbGF5LHRoaXMudXJsPXQudXJsLHRoaXMuc3BlZWQ9dC5zcGVlZCx0aGlzLnZvbHVtZT10LnZvbHVtZSx0aGlzLmxvb3A9dC5sb29wLHQuc3ByaXRlcyYmdGhpcy5hZGRTcHJpdGVzKHQuc3ByaXRlcyksdGhpcy5wcmVsb2FkJiZ0aGlzLl9wcmVsb2FkKHQubG9hZGVkKX1yZXR1cm4gZS5mcm9tPWZ1bmN0aW9uKHQpe3ZhciBuPXt9O3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiB0P24udXJsPXQ6dCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfHx0IGluc3RhbmNlb2YgSFRNTEF1ZGlvRWxlbWVudD9uLnNvdXJjZT10Om49dCwobj1PYmplY3QuYXNzaWduKHthdXRvUGxheTohMSxzaW5nbGVJbnN0YW5jZTohMSx1cmw6bnVsbCxzb3VyY2U6bnVsbCxwcmVsb2FkOiExLHZvbHVtZToxLHNwZWVkOjEsY29tcGxldGU6bnVsbCxsb2FkZWQ6bnVsbCxsb29wOiExfSxuKSkudXJsJiYobi51cmw9dy5yZXNvbHZlVXJsKG4udXJsKSksT2JqZWN0LmZyZWV6ZShuKSxuZXcgZShTLmluc3RhbmNlLnVzZUxlZ2FjeT9uZXcgczpuZXcgTyxuKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gUy5pbnN0YW5jZS5jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNQbGF5aW5nPSExLHRoaXMucGF1c2VkPSEwLHRoaXN9LGUucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmlzUGxheWluZz10aGlzLl9pbnN0YW5jZXMubGVuZ3RoPjAsdGhpcy5wYXVzZWQ9ITEsdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYXVzZWQ9ZSx0aGlzLnJlZnJlc2hQYXVzZWQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzcGVlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zcGVlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWVkaWEuZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMubWVkaWEuZmlsdGVycz1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmFkZFNwcml0ZXM9ZnVuY3Rpb24oZSx0KXtpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7dmFyIG49e307Zm9yKHZhciBvIGluIGUpbltvXT10aGlzLmFkZFNwcml0ZXMobyxlW29dKTtyZXR1cm4gbn1pZihcInN0cmluZ1wiPT10eXBlb2YgZSl7Y29uc29sZS5hc3NlcnQoIXRoaXMuX3Nwcml0ZXNbZV0sXCJBbGlhcyBcIitlK1wiIGlzIGFscmVhZHkgdGFrZW5cIik7dmFyIGk9bmV3IEYodGhpcyx0KTtyZXR1cm4gdGhpcy5fc3ByaXRlc1tlXT1pLGl9fSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fcmVtb3ZlSW5zdGFuY2VzKCksdGhpcy5yZW1vdmVTcHJpdGVzKCksdGhpcy5tZWRpYS5kZXN0cm95KCksdGhpcy5tZWRpYT1udWxsLHRoaXMuX3Nwcml0ZXM9bnVsbCx0aGlzLl9pbnN0YW5jZXM9bnVsbH0sZS5wcm90b3R5cGUucmVtb3ZlU3ByaXRlcz1mdW5jdGlvbihlKXtpZihlKXt2YXIgdD10aGlzLl9zcHJpdGVzW2VdO3ZvaWQgMCE9PXQmJih0LmRlc3Ryb3koKSxkZWxldGUgdGhpcy5fc3ByaXRlc1tlXSl9ZWxzZSBmb3IodmFyIG4gaW4gdGhpcy5fc3ByaXRlcyl0aGlzLnJlbW92ZVNwcml0ZXMobik7cmV0dXJuIHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImlzUGxheWFibGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNMb2FkZWQmJnRoaXMubWVkaWEmJnRoaXMubWVkaWEuaXNQbGF5YWJsZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7aWYoIXRoaXMuaXNQbGF5YWJsZSlyZXR1cm4gdGhpcy5hdXRvUGxheT0hMSx0aGlzLl9hdXRvUGxheU9wdGlvbnM9bnVsbCx0aGlzO3RoaXMuaXNQbGF5aW5nPSExO2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLTE7ZT49MDtlLS0pdGhpcy5faW5zdGFuY2VzW2VdLnN0b3AoKTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlLHQpe3ZhciBuLG89dGhpcztpZihcInN0cmluZ1wiPT10eXBlb2YgZT9uPXtzcHJpdGU6cj1lLGNvbXBsZXRlOnR9OlwiZnVuY3Rpb25cIj09dHlwZW9mIGU/KG49e30pLmNvbXBsZXRlPWU6bj1lLChuPU9iamVjdC5hc3NpZ24oe2NvbXBsZXRlOm51bGwsbG9hZGVkOm51bGwsc3ByaXRlOm51bGwsZW5kOm51bGwsc3RhcnQ6MCx2b2x1bWU6MSxzcGVlZDoxLG11dGVkOiExLGxvb3A6ITF9LG58fHt9KSkuc3ByaXRlKXt2YXIgaT1uLnNwcml0ZTtjb25zb2xlLmFzc2VydCghIXRoaXMuX3Nwcml0ZXNbaV0sXCJBbGlhcyBcIitpK1wiIGlzIG5vdCBhdmFpbGFibGVcIik7dmFyIHI9dGhpcy5fc3ByaXRlc1tpXTtuLnN0YXJ0PXIuc3RhcnQsbi5lbmQ9ci5lbmQsbi5zcGVlZD1yLnNwZWVkfHwxLGRlbGV0ZSBuLnNwcml0ZX1pZihuLm9mZnNldCYmKG4uc3RhcnQ9bi5vZmZzZXQpLCF0aGlzLmlzTG9hZGVkKXJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihlLHQpe28uYXV0b1BsYXk9ITAsby5fYXV0b1BsYXlPcHRpb25zPW4sby5fcHJlbG9hZChmdW5jdGlvbihvLGkscil7bz90KG8pOihuLmxvYWRlZCYmbi5sb2FkZWQobyxpLHIpLGUocikpfSl9KTt0aGlzLnNpbmdsZUluc3RhbmNlJiZ0aGlzLl9yZW1vdmVJbnN0YW5jZXMoKTt2YXIgcz10aGlzLl9jcmVhdGVJbnN0YW5jZSgpO3JldHVybiB0aGlzLl9pbnN0YW5jZXMucHVzaChzKSx0aGlzLmlzUGxheWluZz0hMCxzLm9uY2UoXCJlbmRcIixmdW5jdGlvbigpe24uY29tcGxldGUmJm4uY29tcGxldGUobyksby5fb25Db21wbGV0ZShzKX0pLHMub25jZShcInN0b3BcIixmdW5jdGlvbigpe28uX29uQ29tcGxldGUocyl9KSxzLnBsYXkobiksc30sZS5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLHQ9MDt0PGU7dCsrKXRoaXMuX2luc3RhbmNlc1t0XS5yZWZyZXNoKCl9LGUucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aCx0PTA7dDxlO3QrKyl0aGlzLl9pbnN0YW5jZXNbdF0ucmVmcmVzaFBhdXNlZCgpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJ2b2x1bWVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3ZvbHVtZT1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcIm11dGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tdXRlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX211dGVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwibG9vcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbG9vcH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2xvb3A9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5fcHJlbG9hZD1mdW5jdGlvbihlKXt0aGlzLm1lZGlhLmxvYWQoZSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImluc3RhbmNlc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW5zdGFuY2VzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInNwcml0ZXNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Nwcml0ZXN9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZHVyYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWVkaWEuZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuYXV0b1BsYXlTdGFydD1mdW5jdGlvbigpe3ZhciBlO3JldHVybiB0aGlzLmF1dG9QbGF5JiYoZT10aGlzLnBsYXkodGhpcy5fYXV0b1BsYXlPcHRpb25zKSksZX0sZS5wcm90b3R5cGUuX3JlbW92ZUluc3RhbmNlcz1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLTE7ZT49MDtlLS0pdGhpcy5fcG9vbEluc3RhbmNlKHRoaXMuX2luc3RhbmNlc1tlXSk7dGhpcy5faW5zdGFuY2VzLmxlbmd0aD0wfSxlLnByb3RvdHlwZS5fb25Db21wbGV0ZT1mdW5jdGlvbihlKXtpZih0aGlzLl9pbnN0YW5jZXMpe3ZhciB0PXRoaXMuX2luc3RhbmNlcy5pbmRleE9mKGUpO3Q+LTEmJnRoaXMuX2luc3RhbmNlcy5zcGxpY2UodCwxKSx0aGlzLmlzUGxheWluZz10aGlzLl9pbnN0YW5jZXMubGVuZ3RoPjB9dGhpcy5fcG9vbEluc3RhbmNlKGUpfSxlLnByb3RvdHlwZS5fY3JlYXRlSW5zdGFuY2U9ZnVuY3Rpb24oKXtpZihlLl9wb29sLmxlbmd0aD4wKXt2YXIgdD1lLl9wb29sLnBvcCgpO3JldHVybiB0LmluaXQodGhpcy5tZWRpYSksdH1yZXR1cm4gdGhpcy5tZWRpYS5jcmVhdGUoKX0sZS5wcm90b3R5cGUuX3Bvb2xJbnN0YW5jZT1mdW5jdGlvbih0KXt0LmRlc3Ryb3koKSxlLl9wb29sLmluZGV4T2YodCk8MCYmZS5fcG9vbC5wdXNoKHQpfSxlLl9wb29sPVtdLGV9KCksQz1TLmluaXQoKTtlLnNvdW5kPUMsZS5maWx0ZXJzPW0sZS5odG1sYXVkaW89ZyxlLndlYmF1ZGlvPUwsZS5GaWx0ZXJhYmxlPW4sZS5Tb3VuZD1JLGUuU291bmRMaWJyYXJ5PVMsZS5Tb3VuZFNwcml0ZT1GLGUudXRpbHM9dyxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS1zb3VuZC5qcy5tYXBcbiIsIiFmdW5jdGlvbih0KXtmdW5jdGlvbiBlKGkpe2lmKG5baV0pcmV0dXJuIG5baV0uZXhwb3J0czt2YXIgcj1uW2ldPXtleHBvcnRzOnt9LGlkOmksbG9hZGVkOiExfTtyZXR1cm4gdFtpXS5jYWxsKHIuZXhwb3J0cyxyLHIuZXhwb3J0cyxlKSxyLmxvYWRlZD0hMCxyLmV4cG9ydHN9dmFyIG49e307cmV0dXJuIGUubT10LGUuYz1uLGUucD1cIlwiLGUoMCl9KFtmdW5jdGlvbih0LGUsbil7dC5leHBvcnRzPW4oNil9LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPVBJWEl9LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG49e2xpbmVhcjpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdH19LGluUXVhZDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0fX0sb3V0UXVhZDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCooMi10KX19LGluT3V0UXVhZDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LjUqdCp0Oi0uNSooLS10Kih0LTIpLTEpfX0saW5DdWJpYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0KnR9fSxvdXRDdWJpYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4tLXQqdCp0KzF9fSxpbk91dEN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQqdDoodC09MiwuNSoodCp0KnQrMikpfX0saW5RdWFydDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0KnQqdH19LG91dFF1YXJ0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLSAtLXQqdCp0KnR9fSxpbk91dFF1YXJ0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQqdCp0Oih0LT0yLC0uNSoodCp0KnQqdC0yKSl9fSxpblF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdCp0KnR9fSxvdXRRdWludDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4tLXQqdCp0KnQqdCsxfX0saW5PdXRRdWludDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LjUqdCp0KnQqdCp0Oih0LT0yLC41Kih0KnQqdCp0KnQrMikpfX0saW5TaW5lOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLU1hdGguY29zKHQqTWF0aC5QSS8yKX19LG91dFNpbmU6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIE1hdGguc2luKHQqTWF0aC5QSS8yKX19LGluT3V0U2luZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4uNSooMS1NYXRoLmNvcyhNYXRoLlBJKnQpKX19LGluRXhwbzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMD09PXQ/MDpNYXRoLnBvdygxMDI0LHQtMSl9fSxvdXRFeHBvOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxPT09dD8xOjEtTWF0aC5wb3coMiwtMTAqdCl9fSxpbk91dEV4cG86ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDA9PT10PzA6MT09PXQ/MToodCo9MiwxPnQ/LjUqTWF0aC5wb3coMTAyNCx0LTEpOi41KigtTWF0aC5wb3coMiwtMTAqKHQtMSkpKzIpKX19LGluQ2lyYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS1NYXRoLnNxcnQoMS10KnQpfX0sb3V0Q2lyYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zcXJ0KDEtIC0tdCp0KX19LGluT3V0Q2lyYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LS41KihNYXRoLnNxcnQoMS10KnQpLTEpOi41KihNYXRoLnNxcnQoMS0odC0yKSoodC0yKSkrMSl9fSxpbkVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLC0odCpNYXRoLnBvdygyLDEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKSl9fSxvdXRFbGFzdGljOmZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdPy4xOmFyZ3VtZW50c1swXSxlPWFyZ3VtZW50cy5sZW5ndGg8PTF8fHZvaWQgMD09PWFyZ3VtZW50c1sxXT8uNDphcmd1bWVudHNbMV07cmV0dXJuIGZ1bmN0aW9uKG4pe3ZhciBpPXZvaWQgMDtyZXR1cm4gMD09PW4/MDoxPT09bj8xOighdHx8MT50Pyh0PTEsaT1lLzQpOmk9ZSpNYXRoLmFzaW4oMS90KS8oMipNYXRoLlBJKSx0Kk1hdGgucG93KDIsLTEwKm4pKk1hdGguc2luKChuLWkpKigyKk1hdGguUEkpL2UpKzEpfX0saW5PdXRFbGFzdGljOmZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdPy4xOmFyZ3VtZW50c1swXSxlPWFyZ3VtZW50cy5sZW5ndGg8PTF8fHZvaWQgMD09PWFyZ3VtZW50c1sxXT8uNDphcmd1bWVudHNbMV07cmV0dXJuIGZ1bmN0aW9uKG4pe3ZhciBpPXZvaWQgMDtyZXR1cm4gMD09PW4/MDoxPT09bj8xOighdHx8MT50Pyh0PTEsaT1lLzQpOmk9ZSpNYXRoLmFzaW4oMS90KS8oMipNYXRoLlBJKSxuKj0yLDE+bj8tLjUqKHQqTWF0aC5wb3coMiwxMCoobi0xKSkqTWF0aC5zaW4oKG4tMS1pKSooMipNYXRoLlBJKS9lKSk6dCpNYXRoLnBvdygyLC0xMCoobi0xKSkqTWF0aC5zaW4oKG4tMS1pKSooMipNYXRoLlBJKS9lKSouNSsxKX19LGluQmFjazpmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIG49dHx8MS43MDE1ODtyZXR1cm4gZSplKigobisxKSplLW4pfX0sb3V0QmFjazpmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIG49dHx8MS43MDE1ODtyZXR1cm4tLWUqZSooKG4rMSkqZStuKSsxfX0saW5PdXRCYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj0xLjUyNSoodHx8MS43MDE1OCk7cmV0dXJuIGUqPTIsMT5lPy41KihlKmUqKChuKzEpKmUtbikpOi41KigoZS0yKSooZS0yKSooKG4rMSkqKGUtMikrbikrMil9fSxpbkJvdW5jZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS1uLm91dEJvdW5jZSgpKDEtdCl9fSxvdXRCb3VuY2U6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEvMi43NT50PzcuNTYyNSp0KnQ6Mi8yLjc1PnQ/KHQtPTEuNS8yLjc1LDcuNTYyNSp0KnQrLjc1KToyLjUvMi43NT50Pyh0LT0yLjI1LzIuNzUsNy41NjI1KnQqdCsuOTM3NSk6KHQtPTIuNjI1LzIuNzUsNy41NjI1KnQqdCsuOTg0Mzc1KX19LGluT3V0Qm91bmNlOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi41PnQ/LjUqbi5pbkJvdW5jZSgpKDIqdCk6LjUqbi5vdXRCb3VuY2UoKSgyKnQtMSkrLjV9fSxjdXN0b21BcnJheTpmdW5jdGlvbih0KXtyZXR1cm4gdD9mdW5jdGlvbih0KXtyZXR1cm4gdH06bi5saW5lYXIoKX19O2VbXCJkZWZhdWx0XCJdPW59LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gcih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1mdW5jdGlvbiBzKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX1mdW5jdGlvbiBvKHQsZSl7aWYoIXQpdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO3JldHVybiFlfHxcIm9iamVjdFwiIT10eXBlb2YgZSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZT90OmV9ZnVuY3Rpb24gYSh0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiK3R5cGVvZiBlKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxlJiYoT2JqZWN0LnNldFByb3RvdHlwZU9mP09iamVjdC5zZXRQcm90b3R5cGVPZih0LGUpOnQuX19wcm90b19fPWUpfWZ1bmN0aW9uIHUodCxlLG4saSxyLHMpe2Zvcih2YXIgbyBpbiB0KWlmKGModFtvXSkpdSh0W29dLGVbb10sbltvXSxpLHIscyk7ZWxzZXt2YXIgYT1lW29dLGg9dFtvXS1lW29dLGw9aSxmPXIvbDtuW29dPWEraCpzKGYpfX1mdW5jdGlvbiBoKHQsZSxuKXtmb3IodmFyIGkgaW4gdCkwPT09ZVtpXXx8ZVtpXXx8KGMobltpXSk/KGVbaV09SlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShuW2ldKSksaCh0W2ldLGVbaV0sbltpXSkpOmVbaV09bltpXSl9ZnVuY3Rpb24gYyh0KXtyZXR1cm5cIltvYmplY3QgT2JqZWN0XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpfXZhciBsPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGY9bigxKSxwPXIoZiksZD1uKDIpLGc9aShkKSx2PWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCxuKXtzKHRoaXMsZSk7dmFyIGk9byh0aGlzLE9iamVjdC5nZXRQcm90b3R5cGVPZihlKS5jYWxsKHRoaXMpKTtyZXR1cm4gaS50YXJnZXQ9dCxuJiZpLmFkZFRvKG4pLGkuY2xlYXIoKSxpfXJldHVybiBhKGUsdCksbChlLFt7a2V5OlwiYWRkVG9cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5tYW5hZ2VyPXQsdGhpcy5tYW5hZ2VyLmFkZFR3ZWVuKHRoaXMpLHRoaXN9fSx7a2V5OlwiY2hhaW5cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdHx8KHQ9bmV3IGUodGhpcy50YXJnZXQpKSx0aGlzLl9jaGFpblR3ZWVuPXQsdH19LHtrZXk6XCJzdGFydFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYWN0aXZlPSEwLHRoaXN9fSx7a2V5Olwic3RvcFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYWN0aXZlPSExLHRoaXMuZW1pdChcInN0b3BcIiksdGhpc319LHtrZXk6XCJ0b1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl90bz10LHRoaXN9fSx7a2V5OlwiZnJvbVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9mcm9tPXQsdGhpc319LHtrZXk6XCJyZW1vdmVcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1hbmFnZXI/KHRoaXMubWFuYWdlci5yZW1vdmVUd2Vlbih0aGlzKSx0aGlzKTp0aGlzfX0se2tleTpcImNsZWFyXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLnRpbWU9MCx0aGlzLmFjdGl2ZT0hMSx0aGlzLmVhc2luZz1nW1wiZGVmYXVsdFwiXS5saW5lYXIoKSx0aGlzLmV4cGlyZT0hMSx0aGlzLnJlcGVhdD0wLHRoaXMubG9vcD0hMSx0aGlzLmRlbGF5PTAsdGhpcy5waW5nUG9uZz0hMSx0aGlzLmlzU3RhcnRlZD0hMSx0aGlzLmlzRW5kZWQ9ITEsdGhpcy5fdG89bnVsbCx0aGlzLl9mcm9tPW51bGwsdGhpcy5fZGVsYXlUaW1lPTAsdGhpcy5fZWxhcHNlZFRpbWU9MCx0aGlzLl9yZXBlYXQ9MCx0aGlzLl9waW5nUG9uZz0hMSx0aGlzLl9jaGFpblR3ZWVuPW51bGwsdGhpcy5wYXRoPW51bGwsdGhpcy5wYXRoUmV2ZXJzZT0hMSx0aGlzLnBhdGhGcm9tPTAsdGhpcy5wYXRoVG89MH19LHtrZXk6XCJyZXNldFwiLHZhbHVlOmZ1bmN0aW9uKCl7aWYodGhpcy5fZWxhcHNlZFRpbWU9MCx0aGlzLl9yZXBlYXQ9MCx0aGlzLl9kZWxheVRpbWU9MCx0aGlzLmlzU3RhcnRlZD0hMSx0aGlzLmlzRW5kZWQ9ITEsdGhpcy5waW5nUG9uZyYmdGhpcy5fcGluZ1Bvbmcpe3ZhciB0PXRoaXMuX3RvLGU9dGhpcy5fZnJvbTt0aGlzLl90bz1lLHRoaXMuX2Zyb209dCx0aGlzLl9waW5nUG9uZz0hMX1yZXR1cm4gdGhpc319LHtrZXk6XCJ1cGRhdGVcIix2YWx1ZTpmdW5jdGlvbih0LGUpe2lmKHRoaXMuX2NhblVwZGF0ZSgpfHwhdGhpcy5fdG8mJiF0aGlzLnBhdGgpe3ZhciBuPXZvaWQgMCxpPXZvaWQgMDtpZih0aGlzLmRlbGF5PnRoaXMuX2RlbGF5VGltZSlyZXR1cm4gdm9pZCh0aGlzLl9kZWxheVRpbWUrPWUpO3RoaXMuaXNTdGFydGVkfHwodGhpcy5fcGFyc2VEYXRhKCksdGhpcy5pc1N0YXJ0ZWQ9ITAsdGhpcy5lbWl0KFwic3RhcnRcIikpO3ZhciByPXRoaXMucGluZ1Bvbmc/dGhpcy50aW1lLzI6dGhpcy50aW1lO2lmKHI+dGhpcy5fZWxhcHNlZFRpbWUpe3ZhciBzPXRoaXMuX2VsYXBzZWRUaW1lK2Usbz1zPj1yO3RoaXMuX2VsYXBzZWRUaW1lPW8/cjpzLHRoaXMuX2FwcGx5KHIpO3ZhciBhPXRoaXMuX3BpbmdQb25nP3IrdGhpcy5fZWxhcHNlZFRpbWU6dGhpcy5fZWxhcHNlZFRpbWU7aWYodGhpcy5lbWl0KFwidXBkYXRlXCIsYSksbyl7aWYodGhpcy5waW5nUG9uZyYmIXRoaXMuX3BpbmdQb25nKXJldHVybiB0aGlzLl9waW5nUG9uZz0hMCxuPXRoaXMuX3RvLGk9dGhpcy5fZnJvbSx0aGlzLl9mcm9tPW4sdGhpcy5fdG89aSx0aGlzLnBhdGgmJihuPXRoaXMucGF0aFRvLGk9dGhpcy5wYXRoRnJvbSx0aGlzLnBhdGhUbz1pLHRoaXMucGF0aEZyb209biksdGhpcy5lbWl0KFwicGluZ3BvbmdcIiksdm9pZCh0aGlzLl9lbGFwc2VkVGltZT0wKTtpZih0aGlzLmxvb3B8fHRoaXMucmVwZWF0PnRoaXMuX3JlcGVhdClyZXR1cm4gdGhpcy5fcmVwZWF0KyssdGhpcy5lbWl0KFwicmVwZWF0XCIsdGhpcy5fcmVwZWF0KSx0aGlzLl9lbGFwc2VkVGltZT0wLHZvaWQodGhpcy5waW5nUG9uZyYmdGhpcy5fcGluZ1BvbmcmJihuPXRoaXMuX3RvLGk9dGhpcy5fZnJvbSx0aGlzLl90bz1pLHRoaXMuX2Zyb209bix0aGlzLnBhdGgmJihuPXRoaXMucGF0aFRvLGk9dGhpcy5wYXRoRnJvbSx0aGlzLnBhdGhUbz1pLHRoaXMucGF0aEZyb209biksdGhpcy5fcGluZ1Bvbmc9ITEpKTt0aGlzLmlzRW5kZWQ9ITAsdGhpcy5hY3RpdmU9ITEsdGhpcy5lbWl0KFwiZW5kXCIpLHRoaXMuX2NoYWluVHdlZW4mJih0aGlzLl9jaGFpblR3ZWVuLmFkZFRvKHRoaXMubWFuYWdlciksdGhpcy5fY2hhaW5Ud2Vlbi5zdGFydCgpKX19fX19LHtrZXk6XCJfcGFyc2VEYXRhXCIsdmFsdWU6ZnVuY3Rpb24oKXtpZighdGhpcy5pc1N0YXJ0ZWQmJih0aGlzLl9mcm9tfHwodGhpcy5fZnJvbT17fSksaCh0aGlzLl90byx0aGlzLl9mcm9tLHRoaXMudGFyZ2V0KSx0aGlzLnBhdGgpKXt2YXIgdD10aGlzLnBhdGgudG90YWxEaXN0YW5jZSgpO3RoaXMucGF0aFJldmVyc2U/KHRoaXMucGF0aEZyb209dCx0aGlzLnBhdGhUbz0wKToodGhpcy5wYXRoRnJvbT0wLHRoaXMucGF0aFRvPXQpfX19LHtrZXk6XCJfYXBwbHlcIix2YWx1ZTpmdW5jdGlvbih0KXtpZih1KHRoaXMuX3RvLHRoaXMuX2Zyb20sdGhpcy50YXJnZXQsdCx0aGlzLl9lbGFwc2VkVGltZSx0aGlzLmVhc2luZyksdGhpcy5wYXRoKXt2YXIgZT10aGlzLnBpbmdQb25nP3RoaXMudGltZS8yOnRoaXMudGltZSxuPXRoaXMucGF0aEZyb20saT10aGlzLnBhdGhUby10aGlzLnBhdGhGcm9tLHI9ZSxzPXRoaXMuX2VsYXBzZWRUaW1lL3Isbz1uK2kqdGhpcy5lYXNpbmcocyksYT10aGlzLnBhdGguZ2V0UG9pbnRBdERpc3RhbmNlKG8pO3RoaXMudGFyZ2V0LnBvc2l0aW9uLnNldChhLngsYS55KX19fSx7a2V5OlwiX2NhblVwZGF0ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGltZSYmdGhpcy5hY3RpdmUmJnRoaXMudGFyZ2V0fX1dKSxlfShwLnV0aWxzLkV2ZW50RW1pdHRlcik7ZVtcImRlZmF1bHRcIl09dn0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1mdW5jdGlvbiByKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgcz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPW4oMyksYT1pKG8pLHU9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7cih0aGlzLHQpLHRoaXMudHdlZW5zPVtdLHRoaXMuX3R3ZWVuc1RvRGVsZXRlPVtdLHRoaXMuX2xhc3Q9MH1yZXR1cm4gcyh0LFt7a2V5OlwidXBkYXRlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dm9pZCAwO3R8fDA9PT10P2U9MWUzKnQ6KGU9dGhpcy5fZ2V0RGVsdGFNUygpLHQ9ZS8xZTMpO2Zvcih2YXIgbj0wO248dGhpcy50d2VlbnMubGVuZ3RoO24rKyl7dmFyIGk9dGhpcy50d2VlbnNbbl07aS5hY3RpdmUmJihpLnVwZGF0ZSh0LGUpLGkuaXNFbmRlZCYmaS5leHBpcmUmJmkucmVtb3ZlKCkpfWlmKHRoaXMuX3R3ZWVuc1RvRGVsZXRlLmxlbmd0aCl7Zm9yKHZhciBuPTA7bjx0aGlzLl90d2VlbnNUb0RlbGV0ZS5sZW5ndGg7bisrKXRoaXMuX3JlbW92ZSh0aGlzLl90d2VlbnNUb0RlbGV0ZVtuXSk7dGhpcy5fdHdlZW5zVG9EZWxldGUubGVuZ3RoPTB9fX0se2tleTpcImdldFR3ZWVuc0ZvclRhcmdldFwiLHZhbHVlOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT1bXSxuPTA7bjx0aGlzLnR3ZWVucy5sZW5ndGg7bisrKXRoaXMudHdlZW5zW25dLnRhcmdldD09PXQmJmUucHVzaCh0aGlzLnR3ZWVuc1tuXSk7cmV0dXJuIGV9fSx7a2V5OlwiY3JlYXRlVHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gbmV3IGFbXCJkZWZhdWx0XCJdKHQsdGhpcyl9fSx7a2V5OlwiYWRkVHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0KXt0Lm1hbmFnZXI9dGhpcyx0aGlzLnR3ZWVucy5wdXNoKHQpfX0se2tleTpcInJlbW92ZVR3ZWVuXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5fdHdlZW5zVG9EZWxldGUucHVzaCh0KX19LHtrZXk6XCJfcmVtb3ZlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy50d2VlbnMuaW5kZXhPZih0KTstMSE9PWUmJnRoaXMudHdlZW5zLnNwbGljZShlLDEpfX0se2tleTpcIl9nZXREZWx0YU1TXCIsdmFsdWU6ZnVuY3Rpb24oKXswPT09dGhpcy5fbGFzdCYmKHRoaXMuX2xhc3Q9RGF0ZS5ub3coKSk7dmFyIHQ9RGF0ZS5ub3coKSxlPXQtdGhpcy5fbGFzdDtyZXR1cm4gdGhpcy5fbGFzdD10LGV9fV0pLHR9KCk7ZVtcImRlZmF1bHRcIl09dX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBlPXt9O2lmKG51bGwhPXQpZm9yKHZhciBuIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbikmJihlW25dPXRbbl0pO3JldHVybiBlW1wiZGVmYXVsdFwiXT10LGV9ZnVuY3Rpb24gcih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9dmFyIHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbz1uKDEpLGE9aShvKSx1PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3IodGhpcyx0KSx0aGlzLl9jb2xzZWQ9ITEsdGhpcy5wb2x5Z29uPW5ldyBhLlBvbHlnb24sdGhpcy5wb2x5Z29uLmNsb3NlZD0hMSx0aGlzLl90bXBQb2ludD1uZXcgYS5Qb2ludCx0aGlzLl90bXBQb2ludDI9bmV3IGEuUG9pbnQsdGhpcy5fdG1wRGlzdGFuY2U9W10sdGhpcy5jdXJyZW50UGF0aD1udWxsLHRoaXMuZ3JhcGhpY3NEYXRhPVtdLHRoaXMuZGlydHk9ITB9cmV0dXJuIHModCxbe2tleTpcIm1vdmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLm1vdmVUby5jYWxsKHRoaXMsdCxlKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwibGluZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUubGluZVRvLmNhbGwodGhpcyx0LGUpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJiZXppZXJDdXJ2ZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSxyLHMpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5iZXppZXJDdXJ2ZVRvLmNhbGwodGhpcyx0LGUsbixpLHIscyksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcInF1YWRyYXRpY0N1cnZlVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUucXVhZHJhdGljQ3VydmVUby5jYWxsKHRoaXMsdCxlLG4saSksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImFyY1RvXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSxyKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUuYXJjVG8uY2FsbCh0aGlzLHQsZSxuLGksciksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImFyY1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkscixzKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUuYXJjLmNhbGwodGhpcyx0LGUsbixpLHIscyksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImRyYXdTaGFwZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5kcmF3U2hhcGUuY2FsbCh0aGlzLHQpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJnZXRQb2ludFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMucGFyc2VQb2ludHMoKTt2YXIgZT10aGlzLmNsb3NlZCYmdD49dGhpcy5sZW5ndGgtMT8wOjIqdDtyZXR1cm4gdGhpcy5fdG1wUG9pbnQuc2V0KHRoaXMucG9seWdvbi5wb2ludHNbZV0sdGhpcy5wb2x5Z29uLnBvaW50c1tlKzFdKSx0aGlzLl90bXBQb2ludH19LHtrZXk6XCJkaXN0YW5jZUJldHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3RoaXMucGFyc2VQb2ludHMoKTt2YXIgbj10aGlzLmdldFBvaW50KHQpLGk9bi54LHI9bi55LHM9dGhpcy5nZXRQb2ludChlKSxvPXMueCxhPXMueSx1PW8taSxoPWEtcjtyZXR1cm4gTWF0aC5zcXJ0KHUqdStoKmgpfX0se2tleTpcInRvdGFsRGlzdGFuY2VcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMucGFyc2VQb2ludHMoKSx0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGg9MCx0aGlzLl90bXBEaXN0YW5jZS5wdXNoKDApO2Zvcih2YXIgdD10aGlzLmxlbmd0aCxlPTAsbj0wO3QtMT5uO24rKyllKz10aGlzLmRpc3RhbmNlQmV0d2VlbihuLG4rMSksdGhpcy5fdG1wRGlzdGFuY2UucHVzaChlKTtyZXR1cm4gZX19LHtrZXk6XCJnZXRQb2ludEF0XCIsdmFsdWU6ZnVuY3Rpb24odCl7aWYodGhpcy5wYXJzZVBvaW50cygpLHQ+dGhpcy5sZW5ndGgpcmV0dXJuIHRoaXMuZ2V0UG9pbnQodGhpcy5sZW5ndGgtMSk7aWYodCUxPT09MClyZXR1cm4gdGhpcy5nZXRQb2ludCh0KTt0aGlzLl90bXBQb2ludDIuc2V0KDAsMCk7dmFyIGU9dCUxLG49dGhpcy5nZXRQb2ludChNYXRoLmNlaWwodCkpLGk9bi54LHI9bi55LHM9dGhpcy5nZXRQb2ludChNYXRoLmZsb29yKHQpKSxvPXMueCxhPXMueSx1PS0oKG8taSkqZSksaD0tKChhLXIpKmUpO3JldHVybiB0aGlzLl90bXBQb2ludDIuc2V0KG8rdSxhK2gpLHRoaXMuX3RtcFBvaW50Mn19LHtrZXk6XCJnZXRQb2ludEF0RGlzdGFuY2VcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLnBhcnNlUG9pbnRzKCksdGhpcy5fdG1wRGlzdGFuY2V8fHRoaXMudG90YWxEaXN0YW5jZSgpO3ZhciBlPXRoaXMuX3RtcERpc3RhbmNlLmxlbmd0aCxuPTAsaT10aGlzLl90bXBEaXN0YW5jZVt0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGgtMV07MD50P3Q9aSt0OnQ+aSYmKHQtPWkpO2Zvcih2YXIgcj0wO2U+ciYmKHQ+PXRoaXMuX3RtcERpc3RhbmNlW3JdJiYobj1yKSwhKHQ8dGhpcy5fdG1wRGlzdGFuY2Vbcl0pKTtyKyspO2lmKG49PT10aGlzLmxlbmd0aC0xKXJldHVybiB0aGlzLmdldFBvaW50QXQobik7dmFyIHM9dC10aGlzLl90bXBEaXN0YW5jZVtuXSxvPXRoaXMuX3RtcERpc3RhbmNlW24rMV0tdGhpcy5fdG1wRGlzdGFuY2Vbbl07cmV0dXJuIHRoaXMuZ2V0UG9pbnRBdChuK3Mvbyl9fSx7a2V5OlwicGFyc2VQb2ludHNcIix2YWx1ZTpmdW5jdGlvbigpe2lmKCF0aGlzLmRpcnR5KXJldHVybiB0aGlzO3RoaXMuZGlydHk9ITEsdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGg9MDtmb3IodmFyIHQ9MDt0PHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aDt0Kyspe3ZhciBlPXRoaXMuZ3JhcGhpY3NEYXRhW3RdLnNoYXBlO2UmJmUucG9pbnRzJiYodGhpcy5wb2x5Z29uLnBvaW50cz10aGlzLnBvbHlnb24ucG9pbnRzLmNvbmNhdChlLnBvaW50cykpfXJldHVybiB0aGlzfX0se2tleTpcImNsZWFyXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoPTAsdGhpcy5jdXJyZW50UGF0aD1udWxsLHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoPTAsdGhpcy5fY2xvc2VkPSExLHRoaXMuZGlydHk9ITEsdGhpc319LHtrZXk6XCJjbG9zZWRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY2xvc2VkfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5fY2xvc2VkIT09dCYmKHRoaXMucG9seWdvbi5jbG9zZWQ9dCx0aGlzLl9jbG9zZWQ9dCx0aGlzLmRpcnR5PSEwKX19LHtrZXk6XCJsZW5ndGhcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGg/dGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGgvMisodGhpcy5fY2xvc2VkPzE6MCk6MH19XSksdH0oKTtlW1wiZGVmYXVsdFwiXT11fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIHIodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBlPXt9O2lmKG51bGwhPXQpZm9yKHZhciBuIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbikmJihlW25dPXRbbl0pO3JldHVybiBlW1wiZGVmYXVsdFwiXT10LGV9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHM9bigxKSxvPXIocyksYT1uKDQpLHU9aShhKSxoPW4oMyksYz1pKGgpLGw9big1KSxmPWkobCkscD1uKDIpLGQ9aShwKTtvLkdyYXBoaWNzLnByb3RvdHlwZS5kcmF3UGF0aD1mdW5jdGlvbih0KXtyZXR1cm4gdC5wYXJzZVBvaW50cygpLHRoaXMuZHJhd1NoYXBlKHQucG9seWdvbiksdGhpc307dmFyIGc9e1R3ZWVuTWFuYWdlcjp1W1wiZGVmYXVsdFwiXSxUd2VlbjpjW1wiZGVmYXVsdFwiXSxFYXNpbmc6ZFtcImRlZmF1bHRcIl0sVHdlZW5QYXRoOmZbXCJkZWZhdWx0XCJdfTtvLnR3ZWVuTWFuYWdlcnx8KG8udHdlZW5NYW5hZ2VyPW5ldyB1W1wiZGVmYXVsdFwiXSxvLnR3ZWVuPWcpLGVbXCJkZWZhdWx0XCJdPWd9XSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLXR3ZWVuLmpzLm1hcCIsIm1vZHVsZS5leHBvcnRzPXtcclxuICBcIkFcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGwxLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogZmFsc2UsXHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImNlbGwxLWZpbGwucG5nXCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogOCxcclxuICAgIFwic2NvcmVcIjogMVxyXG4gIH0sXHJcbiAgXCJCXCI6IHtcclxuICAgIFwiaW1hZ2VcIjogXCJjZWxsMi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IGZhbHNlXHJcbiAgfSxcclxuICBcIkNcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGw0LnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogZmFsc2UsXHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImNlbGw0LWZpbGwucG5nXCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMjIsXHJcbiAgICBcInNjb3JlXCI6IDNcclxuICB9LFxyXG4gIFwiSUNcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRDLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCIsXHJcbiAgICBcImFjdGlvblwiOiBcImhpc3RvcnlcIixcclxuICAgIFwiYWN0aXZhdGlvblwiOiAwXHJcbiAgfSxcclxuICBcIklUTFwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFRMLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSVRcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRULnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSVRSXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kVFIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJUlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJhY3Rpb25cIjogXCJoaXN0b3J5XCIsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklCUlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEJSLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSUJcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRCLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSUJMXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kQkwucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJTFwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEwucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIixcclxuICAgIFwiYWN0aW9uXCI6IFwiaGlzdG9yeVwiLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDBcclxuICB9XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHM9e1xyXG4gIFwibGV0XCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQVwiLCBcIkF8Q3xCXCIsIFwiQVwiLCBcIkFcIiwgXCJBXCJdLFxyXG4gICAgICBcInNodWZmbGVcIjogdHJ1ZSxcclxuICAgICAgXCJ0cmltXCI6IDNcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIkF8QXxDXCIsIFwiQXxCXCIsIFwiQVwiLCBcIkJcIiwgXCJBXCJdLFxyXG4gICAgICBcInNodWZmbGVcIjogdHJ1ZSxcclxuICAgIH1cclxuICBdLFxyXG4gIFwiZW5kXCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQVwiLCBcIkFcIiwgXCJBXCIsIFwiQVwiLCBcIkFcIl0sXHJcbiAgICB9XHJcbiAgXSxcclxuICBcImxhYmlyaW50XCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQlwiLCBcIkJcIiwgXCJCXCIsIFwiQlwiLCBcIkJcIl0sXHJcbiAgICAgIFwiYXBwZW5kXCI6IFwiQVwiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBXCIsIFwiQVwiLCBcIkFcIiwgXCJBXCIsIFwiQVwiXSxcclxuICAgIH1cclxuICBdLFxyXG4gIFwiaXNsYW5kXCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQXxDfEJcIiwgXCJBXCIsIFwiQXxDfEJcIl1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIklUTFwiLCBcIklUXCIsIFwiSVRSXCJdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJJTFwiLCAgXCJJQ1wiLCAgXCJJUlwiXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiSUJMXCIsIFwiSUJcIiwgXCJJQlJcIl1cclxuICAgIH1cclxuICBdXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHM9W1xyXG4gIHtcclxuICAgIFwiZnJhZ21lbnRzXCI6IFtcclxuICAgICAge1wiaXNsYW5kXCI6IDF9LFxyXG4gICAgICB7XCJsZXRcIjogNH0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJlbmRcIjogMX0sXHJcbiAgICAgIHtcImlzbGFuZFwiOiAxfSxcclxuICAgIF0sXHJcbiAgICBcImhpc3RvcnlcIjoge1xyXG4gICAgICBcInJ1XCI6IFwi0KLQu9C10L0g0LjQtNC10YIg0LfQsCDRgtC+0LHQvtC5INC/0L4g0L/Rj9GC0LDQvC4gXFxuINCe0YLRgdGC0YPQv9C40YHRjCDQuCDQvtC9INGC0LXQsdGPINC/0L7Qs9C70LDRgtC40YIuLi4gXFxuINCd0L4g0L3QtSDRgdGC0L7QuNGCINC+0YLRh9Cw0LjQstCw0YLRjNGB0Y8sINCy0LXQtNGMINC80YPQt9GL0LrQsCDQstGB0LXQs9C00LAg0YEg0YLQvtCx0L7QuS5cIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJmcmFnbWVudHNcIjogW1xyXG4gICAgICB7XCJsZXRcIjogMTB9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiAxMH0sXHJcbiAgICAgIHtcImVuZFwiOiAxfSxcclxuICAgICAge1wiaXNsYW5kXCI6IDF9XHJcbiAgICBdLFxyXG4gICAgXCJoaXN0b3J5XCI6IHtcclxuICAgICAgXCJydVwiOiBcItCi0LvQtdC9INC90LUg0YnQsNC00LjRgiDQvdC40LrQvtCz0L4uINCb0LXRgtGD0YfQuNC1INC30LzQtdC4INC/0LDQtNGD0YIg0L3QsCDQt9C10LzQu9GOINC4INC/0L7Qs9GA0YPQt9GP0YLRgdGPINCyINGA0YPRgtC40L3RgyDQsdGL0YLQuNGPLi4uXCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwiZnJhZ21lbnRzXCI6IFtcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wiZW5kXCI6IDF9LFxyXG4gICAgICB7XCJpc2xhbmRcIjogMX1cclxuICAgIF0sXHJcbiAgICBcImhpc3RvcnlcIjoge1xyXG4gICAgICBcInJ1XCI6IFwi0Jgg0YLQvtCz0LTQsCDQvtC9INC/0L7QvdC10YEg0YHQstC10YfRgyDRh9C10YDQtdC3INGH0YPQttC40LUg0LfQtdC80LvQuCDQvtGB0LLQvtCx0L7QttC00LDRjyDQu9C10YLRg9GH0LjRhSDQt9C80LXQuSDQuCDRgdCy0L7QuSDQvdCw0YDQvtC0Li4uXCJcclxuICAgIH1cclxuICB9XHJcbl1cclxuIiwiY29uc3QgU2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4vbWFuYWdlcnMvU2NlbmVzTWFuYWdlcicpO1xyXG5jb25zdCBmaWx0ZXJzID0gcmVxdWlyZSgncGl4aS1maWx0ZXJzJyk7XHJcbmNvbnN0IENsb3Vkc0ZpbHRlciA9IHJlcXVpcmUoJy4vc2hhZGVycy9jbG91ZHMnKTtcclxuY29uc3QgU3BoZXJlID0gcmVxdWlyZSgnLi9zdWJqZWN0cy9TcGhlcmUnKTtcclxuXHJcbmNsYXNzIEdhbWUgZXh0ZW5kcyBQSVhJLkFwcGxpY2F0aW9uIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHtiYWNrZ3JvdW5kQ29sb3I6IDB4ZmNmY2ZjfSlcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcclxuXHJcbiAgICB0aGlzLncgPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgIHRoaXMuaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy5iZyA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdiZycpKTtcclxuICAgIHRoaXMuYmcud2lkdGggPSB0aGlzLnc7XHJcbiAgICB0aGlzLmJnLmhlaWdodCA9IHRoaXMuaDtcclxuICAgIHRoaXMuY29udGFpbmVyLmFkZENoaWxkKHRoaXMuYmcpO1xyXG5cclxuICAgIHRoaXMuc2NlbmVzID0gbmV3IFNjZW5lc01hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLnNjZW5lcyk7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuZmlsdGVyQXJlYSA9IG5ldyBQSVhJLlJlY3RhbmdsZSgwLCAwLCB0aGlzLncsIHRoaXMuaCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5maWx0ZXJzID0gW25ldyBmaWx0ZXJzLk9sZEZpbG1GaWx0ZXIoe1xyXG4gICAgICBzZXBpYTogMCxcclxuICAgICAgdmlnbmV0dGluZzogMCxcclxuICAgICAgbm9pc2U6IC4xLFxyXG4gICAgICB2aWduZXR0aW5nQmx1cjogMVxyXG4gICAgfSldO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIHRoaXMuY29udGFpbmVyLmN1cnNvciA9ICdub25lJztcclxuICAgIHRoaXMubW91c2UgPSBuZXcgU3BoZXJlKCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLm1vdXNlKTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5vbigncG9pbnRlcm1vdmUnLCAoZSkgPT4ge1xyXG4gICAgICB0aGlzLm1vdXNlLnggPSBlLmRhdGEuZ2xvYmFsLng7XHJcbiAgICAgIHRoaXMubW91c2UueSA9IGUuZGF0YS5nbG9iYWwueTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX2luaXRUaWNrZXIoKTtcclxuICB9XHJcbiAgX2luaXRUaWNrZXIoKSB7XHJcbiAgICB0aGlzLnRpY2tlci5hZGQoKGR0KSA9PiB7XHJcbiAgICAgIHRoaXMuc2NlbmVzLnVwZGF0ZShkdCk7XHJcbiAgICAgIFBJWEkudHdlZW5NYW5hZ2VyLnVwZGF0ZSgpO1xyXG4gICAgICB0aGlzLmNvbnRhaW5lci5maWx0ZXJzWzBdLnNlZWQgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICB0aGlzLm1vdXNlLnVwZGF0ZShkdCk7XHJcbiAgICAgIC8vIHRoaXMuY29udGFpbmVyLmZpbHRlcnNbMF0udGltZSArPSAuMDE7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuIiwicmVxdWlyZSgncGl4aS1zb3VuZCcpO1xyXG5yZXF1aXJlKCdwaXhpLXR3ZWVuJyk7XHJcbnJlcXVpcmUoJ3BpeGktcHJvamVjdGlvbicpO1xyXG5yZXF1aXJlKCdwaXhpLXBhcnRpY2xlcycpO1xyXG5cclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpO1xyXG5cclxuV2ViRm9udC5sb2FkKHtcclxuICBnb29nbGU6IHtcclxuICAgIGZhbWlsaWVzOiBbJ0FtYXRpYyBTQyddXHJcbiAgfSxcclxuICBhY3RpdmUoKSB7XHJcbiAgICBQSVhJLmxvYWRlclxyXG4gICAgICAuYWRkKCdibG9ja3MnLCAnYXNzZXRzL2Jsb2Nrcy5qc29uJylcclxuICAgICAgLmFkZCgncGxheWVyJywgJ2Fzc2V0cy9wbGF5ZXIucG5nJylcclxuICAgICAgLmFkZCgnYmcnLCAnYXNzZXRzL2JnLnBuZycpXHJcbiAgICAgIC5hZGQoJ2Rpc3BsYWNlbWVudCcsICdhc3NldHMvZGlzcGxhY2VtZW50LnBuZycpXHJcbiAgICAgIC5hZGQoJ3RobGVuJywgJ2Fzc2V0cy90aGxlbi5wbmcnKVxyXG4gICAgICAuYWRkKCdsaWdodG1hcCcsICdhc3NldHMvbGlnaHRtYXAucG5nJylcclxuICAgICAgLmFkZCgnbWFzaycsICdhc3NldHMvbWFzay5wbmcnKVxyXG4gICAgICAuYWRkKCdwYXJ0aWNsZScsICdhc3NldHMvcGFydGljbGUucG5nJylcclxuICAgICAgLmFkZCgnbXVzaWMnLCAnYXNzZXRzL211c2ljLm1wMycpXHJcbiAgICAgIC5sb2FkKChsb2FkZXIsIHJlc291cmNlcykgPT4ge1xyXG4gICAgICAgIC8vIFBJWEkuc291bmQucGxheSgnbXVzaWMnKTtcclxuICAgICAgICBsZXQgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbiAgICAgICAgZ2FtZS5zY2VuZXMuZW5hYmxlU2NlbmUoJ3BsYXlncm91bmQnKTtcclxuXHJcbiAgICAgICAgd2luZG93LmdhbWUgPSBnYW1lO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4iLCJjbGFzcyBIaXN0b3J5TWFuYWdlciBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG5cclxuICAgIHRoaXMuYWxwaGEgPSAwO1xyXG4gICAgdGhpcy50ZXh0ID0gbmV3IFBJWEkuVGV4dCgnVGV4dCcsIHtcclxuICAgICAgZm9udDogJ25vcm1hbCA0MHB4IEFtYXRpYyBTQycsXHJcbiAgICAgIHdvcmRXcmFwOiB0cnVlLFxyXG4gICAgICB3b3JkV3JhcFdpZHRoOiB0aGlzLmdhbWUudy8yLFxyXG4gICAgICBmaWxsOiAnIzJkNWJmZicsXHJcbiAgICAgIHBhZGRpbmc6IDEwLFxyXG4gICAgICBhbGlnbjogJ2NlbnRlcidcclxuICAgIH0pO1xyXG4gICAgdGhpcy50ZXh0LmFuY2hvci5zZXQoLjUpO1xyXG4gICAgdGhpcy50ZXh0LnggPSB0aGlzLmdhbWUudy8yO1xyXG4gICAgdGhpcy50ZXh0LnkgPSAxNTA7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMudGV4dCk7XHJcbiAgfVxyXG4gIHNob3dUZXh0KHR4dCwgdGltZSkge1xyXG4gICAgdGhpcy50ZXh0LmZvbnRGYW1pbHkgPSAnQW1hdGljIFNDJztcclxuICAgIHRoaXMudGV4dC5zZXRUZXh0KHR4dCk7XHJcblxyXG4gICAgbGV0IHNob3cgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIHNob3cuZnJvbSh7YWxwaGE6IDB9KS50byh7YWxwaGE6IDF9KTtcclxuICAgIHNob3cudGltZSA9IDEwMDA7XHJcbiAgICBzaG93LnN0YXJ0KCk7XHJcbiAgICB0aGlzLmVtaXQoJ3Nob3dlbicpO1xyXG5cclxuICAgIHNldFRpbWVvdXQodGhpcy5oaWRlVGV4dC5iaW5kKHRoaXMpLCB0aW1lKTtcclxuICB9XHJcbiAgaGlkZVRleHQoKSB7XHJcbiAgICBsZXQgaGlkZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgaGlkZS5mcm9tKHthbHBoYTogMX0pLnRvKHthbHBoYTogMH0pO1xyXG4gICAgaGlkZS50aW1lID0gMTAwMDtcclxuICAgIGhpZGUuc3RhcnQoKTtcclxuICAgIHRoaXMuZW1pdCgnaGlkZGVuJyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhpc3RvcnlNYW5hZ2VyO1xyXG4iLCIvKlxyXG4gINCc0LXQvdC10LTQttC10YAg0YPRgNC+0LLQvdC10LksINGA0LDQsdC+0YLQsNC10YIg0L3QsNC/0YDRj9C80YPRjiDRgSBNYXBNYW5hZ2VyXHJcbiAg0LjRgdC/0L7Qu9GM0LfRg9GPINC00LDQvdC90YvQtSBsZXZlbHMuanNvbiDQuCAgZnJhZ21lbnRzLmpzb25cclxuXHJcbiAg0KHQvtCx0YvRgtC40Y86XHJcbiAgICBhZGRlZEZyYWdtZW50c0RhdGEgPT4gbmV3IGZyYWdtZW50c0RhdGFcclxuICAgIGFkZGVkTGV2ZWxzID0+IG5ldyBsZXZlbHNcclxuICAgIGFkZGVkTGV2ZWwgPT4gbmV3IGx2bFxyXG5cclxuICAgIHN3aXRjaGVkTGV2ZWwgPT4gY3VyIGx2bFxyXG4gICAgd2VudE5leHRMZXZlbCA9PiBjdXIgbHZsXHJcbiAgICB3ZW50QmFja0xldmVsID0+IGN1ciBsdmxcclxuICAgIHN3aXRjaGVkRnJhZ21lbnQgPT4gY3VyIGZyYWdcclxuICAgIHdlbnROZXh0RnJhZ21lbnQgPT4gY3VyIGZyYWdcclxuICAgIHdlbnRCYWNrRnJhZ21lbnQgPT4gY3VyIGZyYWdcclxuXHJcbiAgICBzdGFydGVkTGV2ZWwgPT4gbmV3IGx2bFxyXG4gICAgZW5kZWRMZXZlbCA9PiBwcmV2IGx2bFxyXG4qL1xyXG5cclxuXHJcbmNsYXNzIExldmVsTWFuYWdlciBleHRlbmRzIFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSwgbWFwKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgIHRoaXMubWFwID0gbWFwO1xyXG5cclxuICAgIHRoaXMubGV2ZWxzID0gW107XHJcbiAgICB0aGlzLmZyYWdtZW50c0RhdGEgPSB7fTtcclxuICAgIHRoaXMuYWRkRnJhZ21lbnRzRGF0YShyZXF1aXJlKCcuLi9jb250ZW50L2ZyYWdtZW50cycpKTtcclxuICAgIHRoaXMuYWRkTGV2ZWxzKHJlcXVpcmUoJy4uL2NvbnRlbnQvbGV2ZWxzJykpXHJcblxyXG4gICAgdGhpcy5jdXJMZXZlbEluZGV4ID0gMDtcclxuICAgIHRoaXMuY3VyRnJhZ21lbnRJbmRleCA9IDA7XHJcbiAgfVxyXG4gIC8vIGdldHRlcnNcclxuICBnZXRDdXJyZW50TGV2ZWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5sZXZlbHNbdGhpcy5jdXJMZXZlbEluZGV4XTtcclxuICB9XHJcbiAgZ2V0Q3VycmVudEZyYWdtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudExldmVsKCkgJiYgdGhpcy5nZXRDdXJyZW50TGV2ZWwoKS5tYXBzW3RoaXMuY3VyRnJhZ21lbnRJbmRleF07XHJcbiAgfVxyXG5cclxuICAvLyBhZGQgZnJhZ21lbnRzIHRvIGRiIGZyYWdtZW50c1xyXG4gIGFkZEZyYWdtZW50c0RhdGEoZGF0YT17fSkge1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmZyYWdtZW50c0RhdGEsIGRhdGEpO1xyXG4gICAgdGhpcy5lbWl0KCdhZGRlZEZyYWdtZW50c0RhdGEnLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIC8vIGFkZCBsZXZlbHMgdG8gZGIgbGV2ZWxzXHJcbiAgYWRkTGV2ZWxzKGxldmVscz1bXSkge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGxldmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLmFkZExldmVsKGxldmVsc1tpXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkTGV2ZWxzJywgbGV2ZWxzKTtcclxuICB9XHJcbiAgYWRkTGV2ZWwobHZsPXt9KSB7XHJcbiAgICB0aGlzLmxldmVscy5wdXNoKGx2bCk7XHJcblxyXG4gICAgLy8gZ2VuZXJhdGVkIG1hcHMgdG8gbHZsIG9iamVjdFxyXG4gICAgbHZsLm1hcHMgPSBbXTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsdmwuZnJhZ21lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGZvcihsZXQga2V5IGluIGx2bC5mcmFnbWVudHNbaV0pIHtcclxuICAgICAgICBmb3IobGV0IGMgPSAwOyBjIDwgbHZsLmZyYWdtZW50c1tpXVtrZXldOyBjKyspIHtcclxuICAgICAgICAgIGx2bC5tYXBzLnB1c2godGhpcy5mcmFnbWVudHNEYXRhW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdhZGRlZExldmVsJywgbHZsKTtcclxuICB9XHJcblxyXG4gIC8vIE1ldGhvZHMgZm9yIGxldmVscyBjb250cm9sXHJcbiAgc3dpdGNoTGV2ZWwobHZsKSB7XHJcbiAgICBpZihsdmwgPj0gdGhpcy5sZXZlbHMubGVuZ3RoIHx8IGx2bCA8IDApIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmN1ckxldmVsSW5kZXggPSBsdmw7XHJcbiAgICB0aGlzLnN3aXRjaEZyYWdtZW50KDApO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnc3RhcnRlZExldmVsJyk7XHJcbiAgICB0aGlzLmVtaXQoJ3N3aXRjaGVkTGV2ZWwnKTtcclxuICB9XHJcbiAgbmV4dExldmVsKCkge1xyXG4gICAgdGhpcy5zd2l0Y2hMZXZlbCh0aGlzLmN1ckxldmVsSW5kZXgrMSk7XHJcbiAgICB0aGlzLmVtaXQoJ3dlbnROZXh0TGV2ZWwnKTtcclxuICB9XHJcbiAgYmFja0xldmVsKCkge1xyXG4gICAgdGhpcy5zd2l0Y2hMZXZlbCh0aGlzLmN1ckxldmVsSW5kZXgtMSk7XHJcbiAgICB0aGlzLmVtaXQoJ3dlbnRCYWNrTGV2ZWwnKTtcclxuICB9XHJcblxyXG4gIC8vIE1ldGhvZHMgZm9yIGZyYWdtZW50cyBjb250cm9sXHJcbiAgc3dpdGNoRnJhZ21lbnQoZnJhZykge1xyXG4gICAgaWYoZnJhZyA8IDApIHJldHVybjtcclxuICAgIHRoaXMuY3VyRnJhZ21lbnRJbmRleCA9IGZyYWc7XHJcblxyXG4gICAgaWYodGhpcy5nZXRDdXJyZW50RnJhZ21lbnQoKSkgdGhpcy5tYXAuYWRkTWFwKHRoaXMuZ2V0Q3VycmVudEZyYWdtZW50KCkpO1xyXG4gICAgZWxzZSB0aGlzLmVtaXQoJ2VuZGVkTGV2ZWwnKTtcclxuICAgIHRoaXMuZW1pdCgnc3dpdGNoZWRGcmFnbWVudCcpO1xyXG4gIH1cclxuICBuZXh0RnJhZ21lbnQoKSB7XHJcbiAgICB0aGlzLnN3aXRjaEZyYWdtZW50KHRoaXMuY3VyRnJhZ21lbnRJbmRleCsxKTtcclxuICAgIHRoaXMuZW1pdCgnd2VudE5leHRGcmFnbWVudCcpO1xyXG4gIH1cclxuICBiYWNrRnJhZ21lbnQoKSB7XHJcbiAgICB0aGlzLnN3aXRjaEZyYWdtZW50KHRoaXMuY3VyRnJhZ21lbnRJbmRleC0xKTtcclxuICAgIHRoaXMuZW1pdCgnd2VudEJhY2tGcmFnbWVudCcpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMZXZlbE1hbmFnZXI7XHJcbiIsIi8qXHJcbiAg0JTQstC40LbQvtC6INGC0LDQudC70L7QstC+0Lkg0LrQsNGA0YLRi1xyXG4gINCh0L7QsdGL0YLQuNGPOlxyXG4gICAgYWRkZWRNYXAgPT4gbWFwXHJcbiAgICBhZGRlZEZyYWdtZW50ID0+IGZyYWdtZW50c1xyXG4gICAgYWRkZWRCbG9jayA9PiBibG9ja1xyXG4gICAgc2Nyb2xsZWREb3duID0+IGR0RG93blxyXG4gICAgc2Nyb2xsZWRUb3AgPT4gZHRUb3BcclxuXHJcbiAgICByZXNpemVkXHJcbiAgICBlbmRlZE1hcFxyXG4gICAgY2xlYXJlZE91dFJhbmdlQmxvY2tzXHJcbiovXHJcblxyXG5cclxuY29uc3QgQmxvY2sgPSByZXF1aXJlKCcuLi9zdWJqZWN0cy9CbG9jaycpO1xyXG5jb25zdCBEYXRhRnJhZ21lbnRDb252ZXJ0ZXIgPSByZXF1aXJlKCcuLi91dGlscy9EYXRhRnJhZ21lbnRDb252ZXJ0ZXInKTtcclxuXHJcbmNsYXNzIE1hcE1hbmFnZXIgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uQ29udGFpbmVyMmQge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lLCBwYXJhbXM9e30pIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBzY2VuZS5hZGRDaGlsZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG5cclxuICAgIHRoaXMuUEFERElOR19CT1RUT00gPSAyODA7XHJcblxyXG4gICAgdGhpcy5tYXhBeGlzWCA9IHBhcmFtcy5tYXhYIHx8IDU7XHJcbiAgICB0aGlzLmJsb2NrU2l6ZSA9IHBhcmFtcy50aWxlU2l6ZSB8fCAxMDA7XHJcbiAgICB0aGlzLnNldEJsb2Nrc0RhdGEocmVxdWlyZSgnLi4vY29udGVudC9ibG9ja3MnKSk7XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG5cclxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5zcGVlZCA9IDUwMDtcclxuICAgIHRoaXMubGFzdEluZGV4ID0gMDtcclxuICB9XHJcbiAgcmVzaXplKCkge1xyXG4gICAgdGhpcy54ID0gdGhpcy5nYW1lLncvMi10aGlzLm1heEF4aXNYKnRoaXMuYmxvY2tTaXplLzI7XHJcbiAgICB0aGlzLnkgPSB0aGlzLmdhbWUuaC10aGlzLlBBRERJTkdfQk9UVE9NO1xyXG4gICAgdGhpcy5lbWl0KCdyZXNpemVkJyk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgcGFyYW1zXHJcbiAgc2V0QmxvY2tzRGF0YShkYXRhKSB7XHJcbiAgICB0aGlzLkJMT0NLUyA9IGRhdGEgfHwge307XHJcbiAgfVxyXG4gIHNldE1heEF4aXNYKG1heCkge1xyXG4gICAgdGhpcy5tYXhBeGlzWCA9IG1heCB8fCA2O1xyXG4gICAgdGhpcy5yZXNpemUoKTtcclxuICB9XHJcbiAgc2V0QmxvY2tTaXplKHNpemUpIHtcclxuICAgIHRoaXMuYmxvY2tTaXplID0gc2l6ZSB8fCAxMDA7XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gIH1cclxuICBzZXRTcGVlZChzcGVlZCkge1xyXG4gICAgdGhpcy5zcGVlZCA9IHNwZWVkIHx8IDUwMDtcclxuICB9XHJcblxyXG5cclxuICAvLyBNYXAgTWFuYWdlclxyXG4gIGFkZE1hcChtYXApIHtcclxuICAgIGZvcihsZXQgaSA9IG1hcC5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgdGhpcy5hZGRGcmFnbWVudChtYXBbaV0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdhZGRlZE1hcCcsIG1hcCk7XHJcbiAgICB0aGlzLmNvbXB1dGluZ01hcEVuZCgpO1xyXG4gIH1cclxuICBhZGRGcmFnbWVudChmcmFnRGF0YSkge1xyXG4gICAgbGV0IGZyYWcgPSBuZXcgRGF0YUZyYWdtZW50Q29udmVydGVyKGZyYWdEYXRhKS5mcmFnbWVudDtcclxuICAgIC8vIGFkZCBibG9jayB0byBjZW50ZXIgWCBheGlzLCBmb3IgZXhhbXBsZTogcm91bmQoKDgtNCkvMikgPT4gKzIgcGFkZGluZyB0byBibG9jayBYIHBvc1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGZyYWcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5hZGRCbG9jayhmcmFnW2ldLCBNYXRoLnJvdW5kKCh0aGlzLm1heEF4aXNYLWZyYWcubGVuZ3RoKS8yKStpLCB0aGlzLmxhc3RJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sYXN0SW5kZXgrKztcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRGcmFnbWVudCcsIGZyYWdEYXRhKTtcclxuICB9XHJcbiAgYWRkQmxvY2soaWQsIHgsIHkpIHtcclxuICAgIGlmKGlkID09PSAnXycpIHJldHVybjtcclxuXHJcbiAgICBsZXQgcG9zWCA9IHgqdGhpcy5ibG9ja1NpemU7XHJcbiAgICBsZXQgcG9zWSA9IC15KnRoaXMuYmxvY2tTaXplO1xyXG4gICAgbGV0IGJsb2NrID0gdGhpcy5hZGRDaGlsZChuZXcgQmxvY2sodGhpcywgcG9zWCwgcG9zWSwgdGhpcy5CTE9DS1NbaWRdKSk7XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkQmxvY2snLCBibG9jayk7XHJcbiAgfVxyXG5cclxuICAvLyBDb2xsaXNpb24gV2lkaCBCbG9ja1xyXG4gIGdldEJsb2NrRnJvbVBvcyhwb3MpIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKHRoaXMuY2hpbGRyZW5baV0uY29udGFpbnNQb2ludChwb3MpKSByZXR1cm4gdGhpcy5jaGlsZHJlbltpXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIE1vdmluZyBNYXBcclxuICBzY3JvbGxEb3duKGJsb2Nrcykge1xyXG4gICAgaWYodGhpcy5pc1N0b3ApIHJldHVybjtcclxuXHJcbiAgICAvLyBTY3JvbGwgbWFwIGRvd24gb24gWCBibG9ja3NcclxuICAgIGxldCBtb3ZlID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBtb3ZlLmZyb20oe3k6IHRoaXMueX0pLnRvKHt5OiB0aGlzLnkrYmxvY2tzKnRoaXMuYmxvY2tTaXplfSk7XHJcbiAgICBtb3ZlLnRpbWUgPSB0aGlzLnNwZWVkKmJsb2NrcztcclxuICAgIG1vdmUub24oJ2VuZCcsICgpID0+IHtcclxuICAgICAgdGhpcy5lbWl0KCdzY3JvbGxlZERvd24nLCBibG9ja3MpO1xyXG4gICAgICB0aGlzLmNsZWFyT3V0UmFuZ2VCbG9ja3MoKTtcclxuICAgICAgdGhpcy5jb21wdXRpbmdNYXBFbmQoKTtcclxuICAgIH0pO1xyXG4gICAgbW92ZS5zdGFydCgpO1xyXG4gIH1cclxuICBzY3JvbGxUb3AoYmxvY2tzKSB7XHJcbiAgICBpZih0aGlzLmlzU3RvcCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIFNjcm9sbCBtYXAgdG9wIG9uIFggYmxvY2tzXHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt5OiB0aGlzLnl9KS50byh7eTogdGhpcy55LWJsb2Nrcyp0aGlzLmJsb2NrU2l6ZX0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZCpibG9ja3M7XHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZW1pdCgnc2Nyb2xsZWRUb3AnLCBibG9ja3MpO1xyXG4gICAgICB0aGlzLmNsZWFyT3V0UmFuZ2VCbG9ja3MoKTtcclxuICAgICAgdGhpcy5jb21wdXRpbmdNYXBFbmQoKTtcclxuICAgIH0pO1xyXG4gICAgbW92ZS5zdGFydCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29tcHV0aW5nIG1hcCBlbmQgKGFtdCBibG9ja3MgPCBtYXggYW10IGJsb2NrcylcclxuICBjb21wdXRpbmdNYXBFbmQoKSB7XHJcbiAgICBpZih0aGlzLmNoaWxkcmVuLmxlbmd0aCA8IHRoaXMubWF4QXhpc1gqKHRoaXMuZ2FtZS5oL3RoaXMuYmxvY2tTaXplKSoyKSB7XHJcbiAgICAgIHRoaXMuZW1pdCgnZW5kZWRNYXAnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGNsZWFyIG91dCByYW5nZSBtYXAgYmxvY2tzXHJcbiAgY2xlYXJPdXRSYW5nZUJsb2NrcygpIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKHRoaXMuY2hpbGRyZW5baV0ud29ybGRUcmFuc2Zvcm0udHktdGhpcy5ibG9ja1NpemUvMiA+IHRoaXMuZ2FtZS5oKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuW2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdjbGVhcmVkT3V0UmFuZ2VCbG9ja3MnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwTWFuYWdlcjtcclxuIiwiLypcclxuICDQmtC70LDRgdGBINC00LvRjyDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LLQuNC00LjQvNC+0LPQviDQutC+0L3RgtC10LnQvdC10YDQsCAo0YDQsNCx0L7Rh9C40YUg0YHRhtC10L0pXHJcbiAg0KHQvtCx0YvRgtC40Y86XHJcbiAgICBhZGRlZFNjZW5lcyA9PiBzY2VuZXNcclxuICAgIGFkZGVkU2NlbmUgPT4gc2NlbmVzXHJcbiAgICByZW1vdmVkU2NlbmUgPT4gc2NlbmVcclxuICAgIHJlc3RhcnRlZFNjZW5lID0+IHNjZW5lXHJcbiAgICBkaXNhYmxlZFNjZW5lID0+IHNjZW5lXHJcbiAgICBlbmFibGVkU2NlbmUgPT4gc2NlbmVzXHJcbiAgICB1cGRhdGVkID0+IGR0XHJcbiovXHJcblxyXG5jbGFzcyBTY2VuZXNNYW5hZ2VyIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIHRoaXMuc2NlbmVzID0gcmVxdWlyZSgnLi4vc2NlbmVzJyk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gbnVsbDtcclxuICB9XHJcbiAgZ2V0U2NlbmUoaWQpIHtcclxuICAgIHJldHVybiB0aGlzLnNjZW5lc1tpZF07XHJcbiAgfVxyXG5cclxuICAvLyBhZGRpbmcgc2NlbmVzXHJcbiAgYWRkU2NlbmVzKHNjZW5lcykge1xyXG4gICAgZm9yKGxldCBpZCBpbiBzY2VuZXMpIHtcclxuICAgICAgdGhpcy5hZGRTY2VuZShpZCwgc2NlbmVzW2lkXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkU2NlbmVzJywgc2NlbmVzKTtcclxuICB9XHJcbiAgYWRkU2NlbmUoaWQsIHNjZW5lKSB7XHJcbiAgICB0aGlzLnNjZW5lc1tpZF0gPSBzY2VuZTtcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRTY2VuZScsIHNjZW5lKTtcclxuICB9XHJcbiAgcmVtb3ZlU2NlbmUoaWQpIHtcclxuICAgIGxldCBfc2NlbmUgPSB0aGlzLnNjZW5lc1tpZF07XHJcbiAgICB0aGlzLnNjZW5lc1tpZF0gPSBudWxsO1xyXG4gICAgdGhpcy5lbWl0KCdyZW1vdmVkU2NlbmUnLCBfc2NlbmUpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udHJvbHNcclxuICByZXN0YXJ0U2NlbmUoKSB7XHJcbiAgICB0aGlzLmVuYWJsZVNjZW5lKHRoaXMuYWN0aXZlU2NlbmUuX2lkU2NlbmUpO1xyXG4gICAgdGhpcy5lbWl0KCdyZXN0YXJ0ZWRTY2VuZScsIHRoaXMuYWN0aXZlU2NlbmUpO1xyXG4gIH1cclxuICBkaXNhYmxlU2NlbmUoKSB7XHJcbiAgICBsZXQgc2NlbmUgPSB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuYWN0aXZlU2NlbmUpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSA9IG51bGw7XHJcbiAgICB0aGlzLmVtaXQoJ2Rpc2FibGVkU2NlbmUnLCBzY2VuZSk7XHJcbiAgfVxyXG4gIGVuYWJsZVNjZW5lKGlkKSB7XHJcbiAgICB0aGlzLmRpc2FibGVTY2VuZSgpO1xyXG5cclxuICAgIGxldCBTY2VuZSA9IHRoaXMuZ2V0U2NlbmUoaWQpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSA9IHRoaXMuYWRkQ2hpbGQobmV3IFNjZW5lKHRoaXMuZ2FtZSwgdGhpcykpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZS5faWRTY2VuZSA9IGlkO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnZW5hYmxlZFNjZW5lJywgdGhpcy5hY3RpdmVTY2VuZSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIHRoaXMuYWN0aXZlU2NlbmUgJiYgdGhpcy5hY3RpdmVTY2VuZS51cGRhdGUgJiYgdGhpcy5hY3RpdmVTY2VuZS51cGRhdGUoZHQpO1xyXG4gICAgdGhpcy5lbWl0KCd1cGRhdGVkJywgZHQpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xyXG4iLCJjbGFzcyBTY3JlZW5NYW5hZ2VyIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTWFuYWdlcjtcclxuIiwiY29uc3QgQWxwaGFHcmFkaWVudEZpbHRlciA9IHJlcXVpcmUoJy4uL3NoYWRlcnMvQWxwaGFHcmFkaWVudEZpbHRlcicpO1xyXG5cclxuY29uc3QgTWFwTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL01hcE1hbmFnZXInKTtcclxuY29uc3QgTGV2ZWxNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvTGV2ZWxNYW5hZ2VyJyk7XHJcbmNvbnN0IEhpc3RvcnlNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvSGlzdG9yeU1hbmFnZXInKTtcclxuY29uc3QgU2NyZWVuTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL1NjcmVlbk1hbmFnZXInKTtcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi4vc3ViamVjdHMvUGxheWVyJyk7XHJcbmNvbnN0IFRobGVuID0gcmVxdWlyZSgnLi4vc3ViamVjdHMvVGhsZW4nKTtcclxuXHJcbmNsYXNzIFBsYXlncm91bmQgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uQ29udGFpbmVyMmQge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIC8vIENvbnN0YW50IGZvciBwb3NpdGlvbiBvYmplY3QgaW4gcHJvamVjdGlvblxyXG4gICAgdGhpcy5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgLy8gSW5pdCBvYmplY3RzXHJcbiAgICB0aGlzLnByb2plY3Rpb24gPSBuZXcgUElYSS5wcm9qZWN0aW9uLkNvbnRhaW5lcjJkKCk7XHJcbiAgICB0aGlzLnByb2plY3Rpb24ucHJvai5zZXRBeGlzWSh7eDogLXRoaXMuZ2FtZS53LzIrNTAsIHk6IDQwMDB9LCAtMSk7XHJcbiAgICB0aGlzLnByb2plY3Rpb24uZmlsdGVycyA9IFtuZXcgQWxwaGFHcmFkaWVudEZpbHRlciguMywgLjEpXTtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5wcm9qZWN0aW9uKTtcclxuXHJcbiAgICB0aGlzLm1hcCA9IG5ldyBNYXBNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5wcm9qZWN0aW9uLmFkZENoaWxkKHRoaXMubWFwKTtcclxuXHJcbiAgICB0aGlzLmxldmVscyA9IG5ldyBMZXZlbE1hbmFnZXIodGhpcywgdGhpcy5tYXApO1xyXG5cclxuICAgIHRoaXMuc2NyZWVuID0gbmV3IFNjcmVlbk1hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLmhpc3RvcnkgPSBuZXcgSGlzdG9yeU1hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcywgdGhpcy5tYXApO1xyXG4gICAgdGhpcy50aGxlbiA9IG5ldyBUaGxlbih0aGlzKTtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5zY3JlZW4sIHRoaXMuaGlzdG9yeSwgdGhpcy5wbGF5ZXIsIHRoaXMudGhsZW4pO1xyXG5cclxuICAgIC8vIENvbnRyb2xzXHJcbiAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XHJcbiAgfVxyXG4gIF9iaW5kRXZlbnRzKCkge1xyXG4gICAgdGhpcy5vbigncG9pbnRlcmRvd24nLCAoKSA9PiB0aGlzLnBsYXllci5pbW11bml0eSgpKTtcclxuICAgIHRoaXMub24oJ3BvaW50ZXJtb3ZlJywgKGUpID0+IHtcclxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubWFwLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5tYXAuY2hpbGRyZW5baV07XHJcbiAgICAgICAgaWYoYmxvY2suY29udGFpbnNQb2ludChlLmRhdGEuZ2xvYmFsKSkgcmV0dXJuIGJsb2NrLmhpdCgpO1xyXG4gICAgICAgIGVsc2UgYmxvY2sudW5oaXQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5wbGF5ZXIub24oJ2RlYWRlZCcsICgpID0+IHRoaXMucmVzdGFydCgpKTtcclxuICAgIHRoaXMucGxheWVyLm9uKCdjb2xsaXNpb24nLCAoYmxvY2spID0+IHtcclxuICAgICAgaWYoYmxvY2suYWN0aW9uID09PSAnaGlzdG9yeScpIHRoaXMuaGlzdG9yeS5zaG93VGV4dCh0aGlzLmxldmVscy5nZXRDdXJyZW50TGV2ZWwoKS5oaXN0b3J5LnJ1LCAzMDAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaGlzdG9yeS5vbignc2hvd2VuJywgKCkgPT4ge1xyXG4gICAgICBsZXQgdHdlZW4gPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzLnByb2plY3Rpb24uZmlsdGVyc1swXSk7XHJcbiAgICAgIHR3ZWVuLmZyb20oe3N0YXJ0R3JhZGllbnQ6IC4zLCBlbmRHcmFkaWVudDogLjF9KS50byh7c3RhcnRHcmFkaWVudDogLjcsIGVuZEdyYWRpZW50OiAuNX0pO1xyXG4gICAgICB0d2Vlbi50aW1lID0gMTAwMDtcclxuICAgICAgdHdlZW4uc3RhcnQoKTtcclxuXHJcbiAgICAgIHRoaXMubWFwLmlzU3RvcCA9IHRydWVcclxuICAgIH0pO1xyXG4gICAgdGhpcy5oaXN0b3J5Lm9uKCdoaWRkZW4nLCAoKSA9PiB7XHJcbiAgICAgIGxldCB0d2VlbiA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMucHJvamVjdGlvbi5maWx0ZXJzWzBdKTtcclxuICAgICAgdHdlZW4uZnJvbSh7c3RhcnRHcmFkaWVudDogLjcsIGVuZEdyYWRpZW50OiAuNX0pLnRvKHtzdGFydEdyYWRpZW50OiAuNSwgZW5kR3JhZGllbnQ6IC4yfSk7XHJcbiAgICAgIHR3ZWVuLnRpbWUgPSAxMDAwO1xyXG4gICAgICB0d2Vlbi5zdGFydCgpO1xyXG5cclxuICAgICAgdGhpcy5tYXAuaXNTdG9wID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubWFwLnNjcm9sbERvd24oMSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm1hcC5vbignZW5kZWRNYXAnLCAoKSA9PiB0aGlzLmxldmVscy5uZXh0RnJhZ21lbnQoKSk7XHJcbiAgICB0aGlzLm1hcC5vbignc2Nyb2xsZWREb3duJywgKCkgPT4gdGhpcy5wbGF5ZXIubW92aW5nKCkpO1xyXG5cclxuICAgIHRoaXMubGV2ZWxzLm9uKCdlbmRlZExldmVsJywgKCkgPT4gdGhpcy5sZXZlbHMubmV4dExldmVsKCkpO1xyXG5cclxuICAgIHRoaXMubGV2ZWxzLnN3aXRjaExldmVsKDApO1xyXG4gICAgdGhpcy5tYXAuc2Nyb2xsRG93bigxKTtcclxuICB9XHJcbiAgcmVzdGFydCgpIHtcclxuICAgIHRoaXMuZ2FtZS5zY2VuZXMucmVzdGFydFNjZW5lKCdwbGF5Z3JvdW5kJyk7XHJcblxyXG4gICAgLy8gdGhpcy5zY3JlZW4uc3BsYXNoKDB4RkZGRkZGLCAxMDAwKS50aGVuKCgpID0+IHtcclxuICAgIC8vICAgdGhpcy5nYW1lLnNjZW5lcy5yZXN0YXJ0U2NlbmUoJ3BsYXlncm91bmQnKTtcclxuICAgIC8vIH0pO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLnRobGVuLnVwZGF0ZSgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Z3JvdW5kO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAncGxheWdyb3VuZCc6IHJlcXVpcmUoJy4vUGxheWdyb3VuZCcpXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShwYXJhbXMpe1xuICAgICAgdmFyIHRlbXBsYXRlID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IHN0YXJ0R3JhZGllbnQ7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBmbG9hdCBlbmRHcmFkaWVudDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2b2lkIG1haW4oKSB7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIGlmKHZUZXh0dXJlQ29vcmQueSA+IHN0YXJ0R3JhZGllbnQpIGdsX0ZyYWdDb2xvciA9IGNvbG9yOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZWxzZSBpZih2VGV4dHVyZUNvb3JkLnkgPCBlbmRHcmFkaWVudCkgZ2xfRnJhZ0NvbG9yID0gY29sb3IqMC4wOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZWxzZSBnbF9GcmFnQ29sb3IgPSBjb2xvcioodlRleHR1cmVDb29yZC55LWVuZEdyYWRpZW50KS8oc3RhcnRHcmFkaWVudC1lbmRHcmFkaWVudCk7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiBcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICAgICAgZm9yKHZhciBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcInt7XCIra2V5K1wifX1cIixcImdcIilcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKG1hdGNoZXIsIHBhcmFtc1trZXldKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgfTtcbiIsImNvbnN0IGZyYWcgPSByZXF1aXJlKCcuL2FscGhhLmZyYWcnKTtcclxuY29uc3QgdmVydCA9IHJlcXVpcmUoJy4uL2Jhc2ljLnZlcnQnKTtcclxuXHJcbmNsYXNzIEFscGhhR3JhZGllbnRGaWx0ZXIgZXh0ZW5kcyBQSVhJLkZpbHRlciB7XHJcbiAgY29uc3RydWN0b3Ioc3RhcnRHcmFkaWVudCwgZW5kR3JhZGllbnQpIHtcclxuICAgIHN1cGVyKHZlcnQoKSwgZnJhZygpKTtcclxuXHJcbiAgICB0aGlzLnN0YXJ0R3JhZGllbnQgPSBzdGFydEdyYWRpZW50IHx8IC41O1xyXG4gICAgdGhpcy5lbmRHcmFkaWVudCA9IGVuZEdyYWRpZW50IHx8IC4yO1xyXG4gIH1cclxuICBzZXQgc3RhcnRHcmFkaWVudCh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLnN0YXJ0R3JhZGllbnQgPSB2O1xyXG4gIH1cclxuICBnZXQgc3RhcnRHcmFkaWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnVuaWZvcm1zLnN0YXJ0R3JhZGllbnQ7XHJcbiAgfVxyXG4gIHNldCBlbmRHcmFkaWVudCh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLmVuZEdyYWRpZW50ID0gdjtcclxuICB9XHJcbiAgZ2V0IGVuZEdyYWRpZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5pZm9ybXMuZW5kR3JhZGllbnQ7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFscGhhR3JhZGllbnRGaWx0ZXI7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2UocGFyYW1zKXtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IFwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cImF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7IFxcblwiICtcclwiIFxcblwiICtcblwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidm9pZCBtYWluKHZvaWQpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgXG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge31cbiAgICAgIGZvcih2YXIga2V5IGluIHBhcmFtcykge1xuICAgICAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJ7e1wiK2tleStcIn19XCIsXCJnXCIpXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShtYXRjaGVyLCBwYXJhbXNba2V5XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgIH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlKHBhcmFtcyl7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgdGltZTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IGNsb3VkRGVuc2l0eTsgXHQvLyBvdmVyYWxsIGRlbnNpdHkgWzAsMV0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IG5vaXNpbmVzczsgXHQvLyBvdmVyYWxsIHN0cmVuZ3RoIG9mIHRoZSBub2lzZSBlZmZlY3QgWzAsMV0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IHNwZWVkO1x0XHRcdC8vIGNvbnRyb2xzIHRoZSBhbmltYXRpb24gc3BlZWQgWzAsIDAuMSBpc2gpIFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBmbG9hdCBjbG91ZEhlaWdodDsgXHQvLyAoaW52ZXJzZSkgaGVpZ2h0IG9mIHRoZSBpbnB1dCBncmFkaWVudCBbMCwuLi4pIFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiLy8gU2ltcGxleCBub2lzZSBiZWxvdyA9IGN0cmwrYywgY3RybCt2OiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vIERlc2NyaXB0aW9uIDogQXJyYXkgYW5kIHRleHR1cmVsZXNzIEdMU0wgMkQvM0QvNEQgc2ltcGxleCBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vICAgICAgICAgICAgICAgbm9pc2UgZnVuY3Rpb25zLiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vICAgICAgQXV0aG9yIDogSWFuIE1jRXdhbiwgQXNoaW1hIEFydHMuIFxcblwiICtcclwiIFxcblwiICtcblwiLy8gIE1haW50YWluZXIgOiBpam0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyAgICAgTGFzdG1vZCA6IDIwMTEwODIyIChpam0pIFxcblwiICtcclwiIFxcblwiICtcblwiLy8gICAgIExpY2Vuc2UgOiBDb3B5cmlnaHQgKEMpIDIwMTEgQXNoaW1hIEFydHMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIFxcblwiICtcclwiIFxcblwiICtcblwiLy8gICAgICAgICAgICAgICBEaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMSUNFTlNFIGZpbGUuIFxcblwiICtcclwiIFxcblwiICtcblwiLy8gICAgICAgICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vYXNoaW1hL3dlYmdsLW5vaXNlIFxcblwiICtcclwiIFxcblwiICtcblwiLy8gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2ZWMyIG1hcENvb3JkKHZlYzIgY29vcmQpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgY29vcmQgKj0gZmlsdGVyQXJlYS54eTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgY29vcmQgKz0gZmlsdGVyQXJlYS56dzsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgcmV0dXJuIGNvb3JkOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2ZWMzIG1vZDI4OSh2ZWMzIHgpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHJldHVybiB4IC0gZmxvb3IoeCAqICgxLjAgLyAyODkuMCkpICogMjg5LjA7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZlYzQgbW9kMjg5KHZlYzQgeCkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgcmV0dXJuIHggLSBmbG9vcih4ICogKDEuMCAvIDI4OS4wKSkgKiAyODkuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidmVjNCBwZXJtdXRlKHZlYzQgeCkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICAgcmV0dXJuIG1vZDI4OSgoKHgqMzQuMCkrMS4wKSp4KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidmVjNCB0YXlsb3JJbnZTcXJ0KHZlYzQgcikgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ7IFxcblwiICtcclwiIFxcblwiICtcblwiICByZXR1cm4gMS43OTI4NDI5MTQwMDE1OSAtIDAuODUzNzM0NzIwOTUzMTQgKiByOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJmbG9hdCBzbm9pc2UodmVjMyB2KSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgY29uc3QgdmVjMiAgQyA9IHZlYzIoMS4wLzYuMCwgMS4wLzMuMCkgOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgY29uc3QgdmVjNCAgRCA9IHZlYzQoMC4wLCAwLjUsIDEuMCwgMi4wKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyBGaXJzdCBjb3JuZXIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzMgaSAgPSBmbG9vcih2ICsgZG90KHYsIEMueXl5KSApOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyB4MCA9ICAgdiAtIGkgKyBkb3QoaSwgQy54eHgpIDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyBPdGhlciBjb3JuZXJzIFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzIGcgPSBzdGVwKHgwLnl6eCwgeDAueHl6KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzMgbCA9IDEuMCAtIGc7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzIGkxID0gbWluKCBnLnh5eiwgbC56eHkgKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzMgaTIgPSBtYXgoIGcueHl6LCBsLnp4eSApOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgLy8gICB4MCA9IHgwIC0gMC4wICsgMC4wICogQy54eHg7IFxcblwiICtcclwiIFxcblwiICtcblwiICAvLyAgIHgxID0geDAgLSBpMSAgKyAxLjAgKiBDLnh4eDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIC8vICAgeDIgPSB4MCAtIGkyICArIDIuMCAqIEMueHh4OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgLy8gICB4MyA9IHgwIC0gMS4wICsgMy4wICogQy54eHg7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzIHgxID0geDAgLSBpMSArIEMueHh4OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyB4MiA9IHgwIC0gaTIgKyBDLnl5eTsgLy8gMi4wKkMueCA9IDEvMyA9IEMueSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyB4MyA9IHgwIC0gRC55eXk7ICAgICAgLy8gLTEuMCszLjAqQy54ID0gLTAuNSA9IC1ELnkgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyBQZXJtdXRhdGlvbnMgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIGkgPSBtb2QyODkoaSk7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IHAgPSBwZXJtdXRlKCBwZXJtdXRlKCBwZXJtdXRlKCBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICAgICAgICAgICBpLnogKyB2ZWM0KDAuMCwgaTEueiwgaTIueiwgMS4wICkpIFxcblwiICtcclwiIFxcblwiICtcblwiICAgICAgICAgICArIGkueSArIHZlYzQoMC4wLCBpMS55LCBpMi55LCAxLjAgKSkgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgICAgICAgICsgaS54ICsgdmVjNCgwLjAsIGkxLngsIGkyLngsIDEuMCApKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyBHcmFkaWVudHM6IDd4NyBwb2ludHMgb3ZlciBhIHNxdWFyZSwgbWFwcGVkIG9udG8gYW4gb2N0YWhlZHJvbi4gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyBUaGUgcmluZyBzaXplIDE3KjE3ID0gMjg5IGlzIGNsb3NlIHRvIGEgbXVsdGlwbGUgb2YgNDkgKDQ5KjYgPSAyOTQpIFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBuXyA9IDAuMTQyODU3MTQyODU3OyAvLyAxLjAvNy4wIFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzICBucyA9IG5fICogRC53eXogLSBELnh6eDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgaiA9IHAgLSA0OS4wICogZmxvb3IocCAqIG5zLnogKiBucy56KTsgIC8vICBtb2QocCw3KjcpIFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IHhfID0gZmxvb3IoaiAqIG5zLnopOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCB5XyA9IGZsb29yKGogLSA3LjAgKiB4XyApOyAgICAvLyBtb2QoaixOKSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCB4ID0geF8gKm5zLnggKyBucy55eXl5OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCB5ID0geV8gKm5zLnggKyBucy55eXl5OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBoID0gMS4wIC0gYWJzKHgpIC0gYWJzKHkpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBiMCA9IHZlYzQoIHgueHksIHkueHkgKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgYjEgPSB2ZWM0KCB4Lnp3LCB5Lnp3ICk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICAvL3ZlYzQgczAgPSB2ZWM0KGxlc3NUaGFuKGIwLDAuMCkpKjIuMCAtIDEuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIC8vdmVjNCBzMSA9IHZlYzQobGVzc1RoYW4oYjEsMC4wKSkqMi4wIC0gMS4wOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBzMCA9IGZsb29yKGIwKSoyLjAgKyAxLjA7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IHMxID0gZmxvb3IoYjEpKjIuMCArIDEuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgc2ggPSAtc3RlcChoLCB2ZWM0KDAuMCkpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBhMCA9IGIwLnh6eXcgKyBzMC54enl3KnNoLnh4eXkgOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBhMSA9IGIxLnh6eXcgKyBzMS54enl3KnNoLnp6d3cgOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyBwMCA9IHZlYzMoYTAueHksaC54KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzMgcDEgPSB2ZWMzKGEwLnp3LGgueSk7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzIHAyID0gdmVjMyhhMS54eSxoLnopOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyBwMyA9IHZlYzMoYTEuencsaC53KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvL05vcm1hbGlzZSBncmFkaWVudHMgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgbm9ybSA9IHRheWxvckludlNxcnQodmVjNChkb3QocDAscDApLCBkb3QocDEscDEpLCBkb3QocDIsIHAyKSwgZG90KHAzLHAzKSkpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgcDAgKj0gbm9ybS54OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgcDEgKj0gbm9ybS55OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgcDIgKj0gbm9ybS56OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgcDMgKj0gbm9ybS53OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vIE1peCBmaW5hbCBub2lzZSB2YWx1ZSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBtID0gbWF4KDAuNiAtIHZlYzQoZG90KHgwLHgwKSwgZG90KHgxLHgxKSwgZG90KHgyLHgyKSwgZG90KHgzLHgzKSksIDAuMCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICBtID0gbSAqIG07IFxcblwiICtcclwiIFxcblwiICtcblwiICByZXR1cm4gNDIuMCAqIGRvdCggbSptLCB2ZWM0KCBkb3QocDAseDApLCBkb3QocDEseDEpLCBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90KHAyLHgyKSwgZG90KHAzLHgzKSApICk7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vLyBDbG91ZCBzdHVmZjogXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJjb25zdCBmbG9hdCBtYXhpbXVtID0gMS4wLzEuMCArIDEuMC8yLjAgKyAxLjAvMy4wICsgMS4wLzQuMCArIDEuMC81LjAgKyAxLjAvNi4wICsgMS4wLzcuMCArIDEuMC84LjA7IFxcblwiICtcclwiIFxcblwiICtcblwiLy8gRnJhY3RhbCBCcm93bmlhbiBtb3Rpb24sIG9yIHNvbWV0aGluZyB0aGF0IHBhc3NlcyBmb3IgaXQgYW55d2F5OiByYW5nZSBbLTEsIDFdIFxcblwiICtcclwiIFxcblwiICtcblwiZmxvYXQgZkJtKHZlYzMgdXYpIFxcblwiICtcclwiIFxcblwiICtcblwieyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmbG9hdCBzdW0gPSAwLjA7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIGZvciAoaW50IGkgPSAwOyBpIDwgODsgKytpKSB7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgICAgICBmbG9hdCBmID0gZmxvYXQoaSsxKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgICAgIHN1bSArPSBzbm9pc2UodXYqZikgLyBmOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICB9IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIHJldHVybiBzdW0gLyBtYXhpbXVtOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyBTaW1wbGUgdmVydGljYWwgZ3JhZGllbnQ6IFxcblwiICtcclwiIFxcblwiICtcblwiZmxvYXQgZ3JhZGllbnQodmVjMiB1dikgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcdHJldHVybiAoMS4wIC0gdXYueSAqIHV2LnkgKiBjbG91ZEhlaWdodCk7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZvaWQgbWFpbigpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJcdC8vIHZlYzIgdXYgPSBtYXBDb29yZCh2VGV4dHVyZUNvb3JkKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIC8vIHZlYzMgcCA9IHZlYzModXYsIHRpbWUqc3BlZWQpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgLy8gdmVjMyBzb21lUmFuZG9tT2Zmc2V0ID0gdmVjMygwLjEsIDAuMywgMC4yKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIC8vIHZlYzIgZHV2ID0gdmVjMihmQm0ocCksIGZCbShwICsgc29tZVJhbmRvbU9mZnNldCkpICogbm9pc2luZXNzOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgLy8gZmxvYXQgcSA9IGdyYWRpZW50KHV2ICsgZHV2KSAqIGNsb3VkRGVuc2l0eTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJcdGdsX0ZyYWdDb2xvciA9IHZlYzQoLjEsIC4xLCAuMSwgMS4wKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiIFxuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9XG4gICAgICBmb3IodmFyIGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgdmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFwie3tcIitrZXkrXCJ9fVwiLFwiZ1wiKVxuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UobWF0Y2hlciwgcGFyYW1zW2tleV0pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcGxhdGVcbiAgICB9O1xuIiwiY29uc3QgZnJhZyA9IHJlcXVpcmUoJy4vY2xvdWRzLmZyYWcnKTtcclxuY29uc3QgdmVydCA9IHJlcXVpcmUoJy4uL2Jhc2ljLnZlcnQnKTtcclxuXHJcbmNsYXNzIENsb3Vkc0ZpbHRlciBleHRlbmRzIFBJWEkuRmlsdGVyIHtcclxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICBzdXBlcih2ZXJ0KCksIGZyYWcoKSk7XHJcblxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgIGNsb3VkRGVuc2l0eTogMC4zLFxyXG4gICAgICBub2lzaW5lc3M6IDAuMyxcclxuICAgICAgc3BlZWQ6IDEuMCxcclxuICAgICAgY2xvdWRIZWlnaHQ6IDAuNVxyXG4gICAgfSwgb3B0aW9ucyk7XHJcbiAgfVxyXG4gIHNldCBjbG91ZERlbnNpdHkodikge1xyXG4gICAgdGhpcy51bmlmb3Jtcy5jbG91ZERlbnNpdHkgPSB2O1xyXG4gIH1cclxuICBnZXQgY2xvdWREZW5zaXR5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5pZm9ybXMuY2xvdWREZW5zaXR5O1xyXG4gIH1cclxuXHJcbiAgc2V0IG5vaXNpbmVzcyh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLm5vaXNpbmVzcyA9IHY7XHJcbiAgfVxyXG4gIGdldCBub2lzaW5lc3MoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5ub2lzaW5lc3M7XHJcbiAgfVxyXG5cclxuICBzZXQgc3BlZWQodikge1xyXG4gICAgdGhpcy51bmlmb3Jtcy5zcGVlZCA9IHY7XHJcbiAgfVxyXG4gIGdldCBzcGVlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnVuaWZvcm1zLnNwZWVkO1xyXG4gIH1cclxuXHJcbiAgc2V0IGNsb3VkSGVpZ2h0KHYpIHtcclxuICAgIHRoaXMudW5pZm9ybXMuY2xvdWRIZWlnaHQgPSB2O1xyXG4gIH1cclxuICBnZXQgY2xvdWRIZWlnaHQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5jbG91ZEhlaWdodDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2xvdWRzRmlsdGVyO1xyXG4iLCIvKlxyXG4gINCa0LvQsNGB0YEg0JHQu9C+0LrQsCwg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDRgtCw0LnQu9C+0LLQvtCz0L4g0LTQstC40LbQutCwXHJcbiAg0KHQvtCx0YvRgtC40Y86XHJcbiAgICBhY3RpdmF0ZWRcclxuICAgIGRlYWN0aXZhdGVkXHJcbiAgICBoaXRlZFxyXG4qL1xyXG5cclxuY2xhc3MgQmxvY2sgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uU3ByaXRlMmQge1xyXG4gIGNvbnN0cnVjdG9yKG1hcCwgeCwgeSwgcGFyYW1zPXt9KSB7XHJcbiAgICBzdXBlcihQSVhJLlRleHR1cmUuZnJvbUZyYW1lKHBhcmFtcy5pbWFnZSB8fCBwYXJhbXMuYWN0aXZhdGlvbkltYWdlKSk7XHJcblxyXG4gICAgdGhpcy5tYXAgPSBtYXA7XHJcbiAgICB0aGlzLmdhbWUgPSB0aGlzLm1hcC5nYW1lO1xyXG5cclxuICAgIHRoaXMuc2NvcmUgPSBwYXJhbXMuc2NvcmU7XHJcbiAgICB0aGlzLmFjdGl2YXRpb24gPSBwYXJhbXMuYWN0aXZhdGlvbiB8fCBudWxsO1xyXG4gICAgdGhpcy5kZWFjdGl2YXRpb25UZXh0dXJlID0gcGFyYW1zLmltYWdlID8gUElYSS5UZXh0dXJlLmZyb21GcmFtZShwYXJhbXMuaW1hZ2UpIDogbnVsbDtcclxuICAgIHRoaXMuYWN0aXZhdGlvblRleHR1cmUgPSBwYXJhbXMuYWN0aXZhdGlvbkltYWdlID8gUElYSS5UZXh0dXJlLmZyb21GcmFtZShwYXJhbXMuYWN0aXZhdGlvbkltYWdlKSA6IG51bGw7XHJcbiAgICB0aGlzLmlzQWN0aXZlID0gcGFyYW1zLmFjdGl2ZTtcclxuICAgIHRoaXMucGxheWVyRGlyID0gcGFyYW1zLnBsYXllckRpciB8fCBudWxsO1xyXG4gICAgdGhpcy5hY3Rpb24gPSBwYXJhbXMuYWN0aW9uIHx8IG51bGw7XHJcblxyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuICAgIHRoaXMud2lkdGggPSBtYXAuYmxvY2tTaXplKzE7XHJcbiAgICB0aGlzLmhlaWdodCA9IG1hcC5ibG9ja1NpemUrMTtcclxuICAgIHRoaXMueCA9IHgrbWFwLmJsb2NrU2l6ZS8yKy41O1xyXG4gICAgdGhpcy55ID0geSttYXAuYmxvY2tTaXplLzIrLjU7XHJcblxyXG4gICAgdGhpcy5qb2x0aW5nID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICB0aGlzLmpvbHRpbmcuZnJvbSh7cm90YXRpb246IC0uMX0pLnRvKHtyb3RhdGlvbjogLjF9KTtcclxuICAgIHRoaXMuam9sdGluZy50aW1lID0gMjAwO1xyXG4gICAgdGhpcy5qb2x0aW5nLnBpbmdQb25nID0gdHJ1ZTtcclxuICAgIHRoaXMuam9sdGluZy5yZXBlYXQgPSBJbmZpbml0eTtcclxuXHJcbiAgICB0aGlzLmdsb3cgPSBuZXcgUElYSS5maWx0ZXJzLkdsb3dGaWx0ZXIoKTtcclxuICAgIHRoaXMuZ2xvdy5lbmFibGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLmZpbHRlcnMgPSBbdGhpcy5nbG93XTtcclxuICB9XHJcbiAgYWN0aXZhdGUoKSB7XHJcbiAgICBsZXQgYWN0aXZhdGluZyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpXHJcbiAgICAgIC5mcm9tKHt3aWR0aDogdGhpcy53aWR0aCozLzQsIGhlaWdodDogdGhpcy5oZWlnaHQqMy80fSlcclxuICAgICAgLnRvKHt3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCwgcm90YXRpb246IDB9KTtcclxuICAgIGFjdGl2YXRpbmcudGltZSA9IDUwMDtcclxuICAgIGFjdGl2YXRpbmcuZWFzaW5nID0gUElYSS50d2Vlbi5FYXNpbmcub3V0Qm91bmNlKCk7XHJcbiAgICBhY3RpdmF0aW5nLnN0YXJ0KCk7XHJcblxyXG4gICAgdGhpcy5nbG93LmVuYWJsZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuam9sdGluZy5zdG9wKCk7XHJcbiAgICB0aGlzLnJvdGF0aW9uID0gMDtcclxuXHJcbiAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcclxuICAgIGlmKHRoaXMuYWN0aXZhdGlvblRleHR1cmUpIHRoaXMudGV4dHVyZSA9IHRoaXMuYWN0aXZhdGlvblRleHR1cmU7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdhY3RpdmF0ZWQnKTtcclxuICB9XHJcbiAgZGVhY3RpdmF0ZSgpIHtcclxuICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcclxuICAgIGlmKHRoaXMuZGVhY3RpdmF0aW9uVGV4dHVyZSkgdGhpcy50ZXh0dXJlID0gdGhpcy5kZWFjdGl2YXRpb25UZXh0dXJlO1xyXG4gICAgdGhpcy5lbWl0KCdkZWFjdGl2YXRlZCcpO1xyXG4gIH1cclxuICB1bmhpdCgpIHtcclxuICAgIHRoaXMuZ2xvdy5lbmFibGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLmpvbHRpbmcuc3RvcCgpO1xyXG4gICAgdGhpcy5yb3RhdGlvbiA9IDA7XHJcbiAgfVxyXG4gIGhpdCgpIHtcclxuICAgIGlmKHRoaXMuYWN0aXZhdGlvbiA9PT0gbnVsbCB8fCB0aGlzLmlzQWN0aXZlKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5qb2x0aW5nLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmdsb3cuZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uKSB0aGlzLmFjdGl2YXRpb24tLTtcclxuICAgIGVsc2UgdGhpcy5hY3RpdmF0ZSgpO1xyXG4gICAgdGhpcy5lbWl0KCdoaXRlZCcpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcclxuIiwiLypcclxuICDQmtC70LDRgdGBIFBsYXllciwg0LLQt9Cw0LjQvNC+0LTQtdC50YHRgtCy0YPQtdGCINGBIE1hcE1hbmFnZXJcclxuICDQodC+0LHRi9GC0LjRj1xyXG4gICAgY29sbGlzaW9uID0+IGNvbGxpc2lvbiBibG9ja1xyXG4gICAgbW92ZWRcclxuICAgIGRlYWRlZFxyXG5cclxuICAgIGFjdGlvbkltbXVuaXR5XHJcbiAgICBhY3Rpb25Ub3BcclxuICAgIGFjdGlvbkxlZnRcclxuICAgIGFjdGlvblJpZ2h0XHJcbiovXHJcblxyXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBQSVhJLlNwcml0ZSB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUsIG1hcCkge1xyXG4gICAgc3VwZXIoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgncGxheWVyJykpO1xyXG5cclxuICAgIHRoaXMuZ2FtZSA9IHNjZW5lLmdhbWU7XHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLm1hcCA9IG1hcDtcclxuXHJcbiAgICB0aGlzLmFuY2hvci5zZXQoLjUsIDEpO1xyXG4gICAgdGhpcy5zY2FsZS5zZXQoLjcpO1xyXG4gICAgdGhpcy54ID0gdGhpcy5nYW1lLncvMis1O1xyXG4gICAgdGhpcy55ID0gdGhpcy5nYW1lLmgtdGhpcy5tYXAuYmxvY2tTaXplKjI7XHJcblxyXG4gICAgdGhpcy53YWxraW5nID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICB0aGlzLndhbGtpbmcuZnJvbSh7eTogdGhpcy55fSkudG8oe3k6IHRoaXMueS0xNX0pO1xyXG4gICAgdGhpcy53YWxraW5nLnRpbWUgPSA4MDA7XHJcbiAgICB0aGlzLndhbGtpbmcubG9vcCA9IHRydWU7XHJcbiAgICB0aGlzLndhbGtpbmcucGluZ1BvbmcgPSB0cnVlO1xyXG4gICAgdGhpcy53YWxraW5nLnN0YXJ0KCk7XHJcblxyXG4gICAgdGhpcy5sYXN0TW92ZSA9IG51bGw7XHJcbiAgICB0aGlzLnNwZWVkID0gdGhpcy5tYXAuc3BlZWQgfHwgNTAwO1xyXG4gICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLklNTVVOSVRZX0JMT0NLUyA9IDI7XHJcbiAgICB0aGlzLmltbXVuaXR5Q291bnQgPSA1O1xyXG4gICAgdGhpcy5pc0ltbXVuaXR5ID0gZmFsc2U7XHJcbiAgfVxyXG4gIG1vdmluZygpIHtcclxuICAgIGlmKHRoaXMuaXNEZWFkIHx8IHRoaXMuaXNJbW11bml0eSkgcmV0dXJuO1xyXG5cclxuICAgIGxldCBjdXIgPSB0aGlzLm1hcC5nZXRCbG9ja0Zyb21Qb3Moe3g6IHRoaXMueCwgeTogdGhpcy55fSk7XHJcbiAgICBpZihjdXIgJiYgY3VyLmlzQWN0aXZlKSB7XHJcbiAgICAgIHRoaXMuZW1pdCgnY29sbGlzaW9uJywgY3VyKTtcclxuXHJcbiAgICAgIGlmKGN1ci5wbGF5ZXJEaXIgPT09ICd0b3AnKSByZXR1cm4gdGhpcy50b3AoKTtcclxuICAgICAgaWYoY3VyLnBsYXllckRpciA9PT0gJ2xlZnQnKSByZXR1cm4gdGhpcy5sZWZ0KCk7XHJcbiAgICAgIGlmKGN1ci5wbGF5ZXJEaXIgPT09ICdyaWdodCcpIHJldHVybiB0aGlzLnJpZ2h0KCk7XHJcblxyXG4gICAgICAvL2NoZWNrIHRvcFxyXG4gICAgICBsZXQgdG9wID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHt4OiB0aGlzLngsIHk6IHRoaXMueS10aGlzLm1hcC5ibG9ja1NpemV9KTtcclxuICAgICAgaWYodG9wICYmIHRvcC5pc0FjdGl2ZSAmJiB0aGlzLmxhc3RNb3ZlICE9PSAnYm90dG9tJykgcmV0dXJuIHRoaXMudG9wKCk7XHJcblxyXG4gICAgICAvLyBjaGVjayBsZWZ0XHJcbiAgICAgIGxldCBsZWZ0ID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHt4OiB0aGlzLngtdGhpcy5tYXAuYmxvY2tTaXplLCB5OiB0aGlzLnl9KTtcclxuICAgICAgaWYobGVmdCAmJiBsZWZ0LmlzQWN0aXZlICYmIHRoaXMubGFzdE1vdmUgIT09ICdyaWdodCcpIHJldHVybiB0aGlzLmxlZnQoKTtcclxuXHJcbiAgICAgIC8vIGNoZWNrIHJpZ3RoXHJcbiAgICAgIGxldCByaWdodCA9IHRoaXMubWFwLmdldEJsb2NrRnJvbVBvcyh7eDogdGhpcy54K3RoaXMubWFwLmJsb2NrU2l6ZSwgeTogdGhpcy55fSk7XHJcbiAgICAgIGlmKHJpZ2h0ICYmIHJpZ2h0LmlzQWN0aXZlICYmIHRoaXMubGFzdE1vdmUgIT09ICdsZWZ0JykgcmV0dXJuIHRoaXMucmlnaHQoKTtcclxuXHJcbiAgICAgIC8vIG9yIGRpZVxyXG4gICAgICB0aGlzLnRvcCgpO1xyXG4gICAgfSBlbHNlIHRoaXMuZGVhZCgpO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnbW92ZWQnKTtcclxuICB9XHJcbiAgZGVhZCgpIHtcclxuICAgIHRoaXMud2Fsa2luZy5zdG9wKCk7XHJcbiAgICB0aGlzLmlzRGVhZCA9IHRydWU7XHJcblxyXG4gICAgbGV0IGRlYWQgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzLnNjYWxlKTtcclxuICAgIGRlYWQuZnJvbSh0aGlzLnNjYWxlKS50byh7eDogMCwgeTogMH0pO1xyXG4gICAgZGVhZC50aW1lID0gMjAwO1xyXG4gICAgZGVhZC5zdGFydCgpO1xyXG4gICAgZGVhZC5vbignZW5kJywgKCkgPT4gdGhpcy5lbWl0KCdkZWFkZWQnKSk7XHJcbiAgfVxyXG4gIGltbXVuaXR5KCkge1xyXG4gICAgaWYoIXRoaXMuaW1tdW5pdHlDb3VudCkgcmV0dXJuO1xyXG5cclxuICAgIGxldCBpbW11bml0eSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgaW1tdW5pdHkuZnJvbSh7YWxwaGE6IC41fSkudG8oe2FscGhhOiAxfSk7XHJcbiAgICBpbW11bml0eS50aW1lID0gdGhpcy5zcGVlZCp0aGlzLklNTVVOSVRZX0JMT0NLUztcclxuICAgIGltbXVuaXR5LnN0YXJ0KCk7XHJcblxyXG4gICAgdGhpcy5tYXAuc2Nyb2xsRG93bih0aGlzLklNTVVOSVRZX0JMT0NLUyk7XHJcbiAgICBpbW11bml0eS5vbignZW5kJywgKCkgPT4gdGhpcy5pc0ltbXVuaXR5ID0gZmFsc2UpO1xyXG4gICAgdGhpcy5pc0ltbXVuaXR5ID0gdHJ1ZTtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAndG9wJztcclxuICAgIHRoaXMuaW1tdW5pdHlDb3VudC0tO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uSW1tdW5pdHknKTtcclxuICB9XHJcbiAgdG9wKCkge1xyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICd0b3AnO1xyXG4gICAgdGhpcy5tYXAuc2Nyb2xsRG93bigxKTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ2FjdGlvblRvcCcpO1xyXG4gIH1cclxuICBsZWZ0KCkge1xyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICdsZWZ0JztcclxuICAgIGxldCBtb3ZlID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBtb3ZlLmZyb20oe3g6IHRoaXMueH0pLnRvKHt4OiB0aGlzLngtdGhpcy5tYXAuYmxvY2tTaXplLTIwfSk7XHJcbiAgICBtb3ZlLnRpbWUgPSB0aGlzLnNwZWVkLzI7XHJcbiAgICBtb3ZlLnN0YXJ0KCk7XHJcblxyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4gdGhpcy5tb3ZpbmcoKSk7XHJcbiAgICB0aGlzLmVtaXQoJ2FjdGlvbkxlZnQnKTtcclxuICB9XHJcbiAgcmlnaHQoKSB7XHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gJ3JpZ2h0JztcclxuICAgIGxldCBtb3ZlID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBtb3ZlLmZyb20oe3g6IHRoaXMueH0pLnRvKHt4OiB0aGlzLngrdGhpcy5tYXAuYmxvY2tTaXplKzIwfSk7XHJcbiAgICBtb3ZlLnRpbWUgPSB0aGlzLnNwZWVkLzI7XHJcbiAgICBtb3ZlLnN0YXJ0KCk7XHJcblxyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4gdGhpcy5tb3ZpbmcoKSk7XHJcbiAgICB0aGlzLmVtaXQoJ2FjdGlvblJpZ2h0Jyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcclxuIiwiY2xhc3MgU3BoZXJlIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBQSVhJLnBhcnRpY2xlcy5FbWl0dGVyKHRoaXMsIFtQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdwYXJ0aWNsZScpXSwgcmVxdWlyZSgnLi9lbWl0dGVyLmpzb24nKSk7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy5lbWl0dGVyLnVwZGF0ZShkdCouMDEpO1xyXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQgPSB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcGhlcmU7XHJcbiIsImNsYXNzIFRobGVuIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgIHRoaXMuZ2FtZSA9IHNjZW5lLmdhbWU7XHJcblxyXG4gICAgdGhpcy5QQURESU4gPSA1MDtcclxuXHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudFNwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdkaXNwbGFjZW1lbnQnKSk7XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudFNwcml0ZS50ZXh0dXJlLmJhc2VUZXh0dXJlLndyYXBNb2RlID0gUElYSS5XUkFQX01PREVTLlJFUEVBVDtcclxuICAgIHNjZW5lLmFkZENoaWxkKHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlKTtcclxuICAgIHRoaXMuZGlzcGxhY2VtZW50RmlsdGVyID0gbmV3IFBJWEkuZmlsdGVycy5EaXNwbGFjZW1lbnRGaWx0ZXIodGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUpO1xyXG5cclxuICAgIHRoaXMudGhsZW4gPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgndGhsZW4nKSk7XHJcbiAgICB0aGlzLnRobGVuLndpZHRoID0gdGhpcy5nYW1lLncrdGhpcy5QQURESU47XHJcbiAgICB0aGlzLnRobGVuLnkgPSB0aGlzLmdhbWUuaC10aGlzLnRobGVuLmhlaWdodCt0aGlzLlBBRERJTjtcclxuICAgIHRoaXMudGhsZW4ueCA9IC10aGlzLlBBRERJTi8yO1xyXG4gICAgdGhpcy50aGxlbi5maWx0ZXJzID0gW3RoaXMuZGlzcGxhY2VtZW50RmlsdGVyXTtcclxuICAgIHNjZW5lLmFkZENoaWxkKHRoaXMudGhsZW4pO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudFNwcml0ZS54ICs9IDEwO1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUueSArPSAxMDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGhsZW47XHJcbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJhbHBoYVwiOiB7XG5cdFx0XCJzdGFydFwiOiAwLjQ4LFxuXHRcdFwiZW5kXCI6IDBcblx0fSxcblx0XCJzY2FsZVwiOiB7XG5cdFx0XCJzdGFydFwiOiAwLjQsXG5cdFx0XCJlbmRcIjogMC40XG5cdH0sXG5cdFwiY29sb3JcIjoge1xuXHRcdFwic3RhcnRcIjogXCIjZmZmZmZmXCIsXG5cdFx0XCJlbmRcIjogXCIjMzEwZmZmXCJcblx0fSxcblx0XCJzcGVlZFwiOiB7XG5cdFx0XCJzdGFydFwiOiA5MCxcblx0XHRcImVuZFwiOiAwLFxuXHRcdFwibWluaW11bVNwZWVkTXVsdGlwbGllclwiOiAxXG5cdH0sXG5cdFwiYWNjZWxlcmF0aW9uXCI6IHtcblx0XHRcInhcIjogMCxcblx0XHRcInlcIjogMFxuXHR9LFxuXHRcIm1heFNwZWVkXCI6IDAsXG5cdFwic3RhcnRSb3RhdGlvblwiOiB7XG5cdFx0XCJtaW5cIjogMCxcblx0XHRcIm1heFwiOiAzNjBcblx0fSxcblx0XCJub1JvdGF0aW9uXCI6IGZhbHNlLFxuXHRcInJvdGF0aW9uU3BlZWRcIjoge1xuXHRcdFwibWluXCI6IDAsXG5cdFx0XCJtYXhcIjogMFxuXHR9LFxuXHRcImxpZmV0aW1lXCI6IHtcblx0XHRcIm1pblwiOiAwLjEsXG5cdFx0XCJtYXhcIjogMC4zXG5cdH0sXG5cdFwiYmxlbmRNb2RlXCI6IFwiYWRkXCIsXG5cdFwiZnJlcXVlbmN5XCI6IDAuMDAxLFxuXHRcImVtaXR0ZXJMaWZldGltZVwiOiAtMSxcblx0XCJtYXhQYXJ0aWNsZXNcIjogNTAwLFxuXHRcInBvc1wiOiB7XG5cdFx0XCJ4XCI6IDAsXG5cdFx0XCJ5XCI6IDBcblx0fSxcblx0XCJhZGRBdEJhY2tcIjogdHJ1ZSxcblx0XCJzcGF3blR5cGVcIjogXCJyZWN0XCIsXG5cdFwic3Bhd25SZWN0XCI6IHtcblx0XHRcInhcIjogMCxcblx0XHRcInlcIjogMCxcblx0XHRcIndcIjogMCxcblx0XHRcImhcIjogMFxuXHR9XG59XG4iLCIvKlxyXG5UaGlzIHV0aWwgY2xhc3MgZm9yIGNvbnZlcnRlZCBkYXRhIGZyb20gZnJhZ21lbnRzLmpzb25cclxub2JqZWN0IHRvIHNpbXBsZSBtYXAgYXJyYXksIGZvciBleGFtcGxlOiBbJ0EnLCAnQScsICdBJywgJ0EnXVxyXG4qL1xyXG5cclxuY2xhc3MgRGF0YUZyYWdtZW50Q29udmVydGVyIHtcclxuICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy5pbnB1dE1hcCA9IGRhdGEubWFwO1xyXG4gICAgdGhpcy5mcmFnbWVudCA9IFtdO1xyXG5cclxuICAgIC8vIE9QRVJBVE9SU1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGRhdGEubWFwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKH5+ZGF0YS5tYXBbaV0uaW5kZXhPZignfCcpKSB0aGlzLmNhc2VPcGVyYXRvcihkYXRhLm1hcFtpXSwgaSk7XHJcbiAgICAgIGVsc2UgdGhpcy5mcmFnbWVudFtpXSA9IGRhdGEubWFwW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1FVEhPRFNcclxuICAgIGRhdGEudHJpbSAmJiB0aGlzLnJhbmRvbVRyaW0oZGF0YS50cmltKTtcclxuICAgIGRhdGEuYXBwZW5kICYmIHRoaXMucmFuZG9tQXBwZW5kKGRhdGEuYXBwZW5kKTtcclxuICAgIGRhdGEuc2h1ZmZsZSAmJiB0aGlzLnNodWZmbGUoKTtcclxuICB9XHJcblxyXG4gIC8vIE9QRVJBVE9SU1xyXG4gIC8vIENhc2Ugb3BlcmF0b3I6ICdBfEJ8Q3xEJyA9PiBDIGFuZCBldGMuLi5cclxuICBjYXNlT3BlcmF0b3Ioc3RyLCBpKSB7XHJcbiAgICBsZXQgaWRzID0gc3RyLnNwbGl0KCd8Jyk7XHJcbiAgICB0aGlzLmZyYWdtZW50W2ldID0gaWRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSppZHMubGVuZ3RoKV07XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIE1FVEhPRFNcclxuICAvLyBUcmltbWluZyBhcnJheSBpbiByYW5nZSAwLi5yYW5kKG1pbiwgbGVuZ3RoKVxyXG4gIHJhbmRvbVRyaW0obWluKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50Lmxlbmd0aCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLmZyYWdtZW50Lmxlbmd0aCsxIC0gbWluKSArIG1pbik7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgLy8gU2h1ZmZsZSBhcnJheSBbMSwyLDNdID0+IFsyLDEsM10gYW5kIGV0Yy4uLlxyXG4gIHNodWZmbGUoKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50LnNvcnQoKGEsIGIpID0+IE1hdGgucmFuZG9tKCkgPCAuNSA/IC0xIDogMSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgLy8gQWRkcyBhIGJsb2NrIHRvIHRoZSByYW5kb20gbG9jYXRpb24gb2YgdGhlIGFycmF5OiBbQSxBLEFdID0+IFtCLEEsQV0gYW5kIGV0Yy4uLlxyXG4gIHJhbmRvbUFwcGVuZChpZCkge1xyXG4gICAgdGhpcy5mcmFnbWVudFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqdGhpcy5mcmFnbWVudC5sZW5ndGgpXSA9IGlkO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFGcmFnbWVudENvbnZlcnRlcjtcclxuIl19
