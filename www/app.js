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
var GrayscaleFilter = require('./shaders/GrayscaleFilter');
var NoiseBlurFilter = require('./shaders/NoiseBlurFilter');

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
        _this.grayscale = new GrayscaleFilter();
        _this.container.filters = [_this.grayscale, new NoiseBlurFilter()];

        _this.container.interactive = true;
        _this.container.cursor = 'none';
        _this.mouse = new Sphere();
        _this.container.addChild(_this.mouse);

        _this.container.on('pointermove', function (e) {
            _this.grayscale.x = e.data.global.x / _this.w;
            _this.grayscale.y = e.data.global.y / _this.h;
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
                _this2.mouse.update(dt);
                // this.container.filters[0].time += .01;
            });
        }
    }]);

    return Game;
}(PIXI.Application);

module.exports = Game;

},{"./managers/ScenesManager":38,"./shaders/GrayscaleFilter":45,"./shaders/NoiseBlurFilter":46,"./subjects/Sphere":51,"pixi-filters":25}],34:[function(require,module,exports){
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
      fill: '#fff',
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

},{"../content/blocks":30,"../subjects/Block":49,"../utils/DataFragmentConverter":54}],38:[function(require,module,exports){
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
                    if (block.containsPoint(e.data.global)) {
                        return block.hit();
                    } else block.unhit();
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
                tween.from({ startGradient: .7, endGradient: .5 }).to({ startGradient: .3, endGradient: .1 });
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

},{"../managers/HistoryManager":35,"../managers/LevelManager":36,"../managers/MapManager":37,"../managers/ScreenManager":39,"../shaders/AlphaGradientFilter":43,"../subjects/Player":50,"../subjects/Thlen":52}],41:[function(require,module,exports){
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

},{"../basic.vert":48,"./alpha.frag":42}],44:[function(require,module,exports){
module.exports = function parse(params){
      var template = "precision mediump float; \n" +" \n" +
" \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
"uniform sampler2D uSampler; \n" +" \n" +
"uniform float x; \n" +" \n" +
"uniform float y; \n" +" \n" +
"uniform float r; \n" +" \n" +
" \n" +" \n" +
"void main() { \n" +" \n" +
"  gl_FragColor = texture2D(uSampler, vTextureCoord); \n" +" \n" +
"  vec3 gray = vec3(0.3, 0.59, 0.11); \n" +" \n" +
"  float col = dot(gl_FragColor.xyz, gray); \n" +" \n" +
" \n" +" \n" +
"  float dist = distance(vTextureCoord.xy, vec2(x, y)); \n" +" \n" +
"  gl_FragColor.xyz = mix(gl_FragColor.xyz, vec3(col), min(dist/r, 1.0)-.2); \n" +" \n" +
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var frag = require('./grayscale.frag');
var vert = require('../basic.vert');

var GrayscaleFilter = function (_PIXI$Filter) {
  _inherits(GrayscaleFilter, _PIXI$Filter);

  function GrayscaleFilter(x, y, r) {
    _classCallCheck(this, GrayscaleFilter);

    var _this = _possibleConstructorReturn(this, (GrayscaleFilter.__proto__ || Object.getPrototypeOf(GrayscaleFilter)).call(this, vert(), frag()));

    _this.x = x || .5;
    _this.y = y || .5;
    _this.r = r || 0.8;
    return _this;
  }

  _createClass(GrayscaleFilter, [{
    key: 'x',
    set: function set(v) {
      this.uniforms.x = v;
    },
    get: function get() {
      return this.uniforms.x;
    }
  }, {
    key: 'y',
    set: function set(v) {
      this.uniforms.y = v;
    },
    get: function get() {
      return this.uniforms.y;
    }
  }, {
    key: 'r',
    set: function set(v) {
      this.uniforms.r = v;
    },
    get: function get() {
      return this.uniforms.r;
    }
  }]);

  return GrayscaleFilter;
}(PIXI.Filter);

module.exports = GrayscaleFilter;

},{"../basic.vert":48,"./grayscale.frag":44}],46:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var frag = require('./noiseBlur.frag');
var vert = require('../basic.vert');

var NoiseBlurFilter = function (_PIXI$Filter) {
  _inherits(NoiseBlurFilter, _PIXI$Filter);

  function NoiseBlurFilter() {
    _classCallCheck(this, NoiseBlurFilter);

    return _possibleConstructorReturn(this, (NoiseBlurFilter.__proto__ || Object.getPrototypeOf(NoiseBlurFilter)).call(this, vert(), frag()));
  }

  return NoiseBlurFilter;
}(PIXI.Filter);

module.exports = NoiseBlurFilter;

},{"../basic.vert":48,"./noiseBlur.frag":47}],47:[function(require,module,exports){
module.exports = function parse(params){
      var template = "precision mediump float; \n" +" \n" +
" \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
"uniform sampler2D uSampler; \n" +" \n" +
" \n" +" \n" +
"float blurRadius = 0.001; \n" +" \n" +
" \n" +" \n" +
"vec2 random(vec2 p) { \n" +" \n" +
"	p = fract(p * vec2(443.897, 441.423)); \n" +" \n" +
"    p += dot(p, p.yx+19.91); \n" +" \n" +
"    return fract((p.xx+p.yx)*p.xy); \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"void main() { \n" +" \n" +
"  vec2 r = random(vTextureCoord); \n" +" \n" +
"  r.x *= 6.28305308; \n" +" \n" +
"  vec2 cr = vec2(sin(r.x),cos(r.x))*sqrt(r.y); \n" +" \n" +
" \n" +" \n" +
"	gl_FragColor = texture2D(uSampler, vTextureCoord+cr*blurRadius); \n" +" \n" +
"} \n" +" \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

        _this.glow = new PIXI.filters.AlphaFilter();
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

            this.glow.alpha = 1.0;
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
            this.glow.alpha = 5.0;

            if (this.activation) this.activation--;else this.activate();
            this.emit('hited');
        }
    }]);

    return Block;
}(PIXI.projection.Sprite2d);

module.exports = Block;

},{}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
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

},{"./emitter.json":53}],52:[function(require,module,exports){
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
            this.displacementSprite.x += 5;
            this.displacementSprite.y += 5;
        }
    }]);

    return Thlen;
}(PIXI.Container);

module.exports = Thlen;

},{}],53:[function(require,module,exports){
module.exports={
	"alpha": {
		"start": 0.48,
		"end": 0
	},
	"scale": {
		"start": 0.5,
		"end": 0.5,
		"minimumScaleMultiplier": 0.05
	},
	"color": {
		"start": "#ffffff",
		"end": "#ffffff"
	},
	"speed": {
		"start": 90,
		"end": 0,
		"minimumSpeedMultiplier": 1
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
		"min": 0.2,
		"max": 1
	},
	"blendMode": "add",
	"frequency": 0.001,
	"emitterLifetime": -1,
	"maxParticles": 500,
	"pos": {
		"x": 0,
		"y": 0
	},
	"addAtBack": false,
	"spawnType": "rect",
	"spawnRect": {
		"x": 0,
		"y": 0,
		"w": 0,
		"h": 0
	}
}

},{}],54:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWFkdmFuY2VkLWJsb29tL2xpYi9maWx0ZXItYWR2YW5jZWQtYmxvb20uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWFzY2lpL2xpYi9maWx0ZXItYXNjaWkuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWJsb29tL2xpYi9maWx0ZXItYmxvb20uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWJ1bGdlLXBpbmNoL2xpYi9maWx0ZXItYnVsZ2UtcGluY2guanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWNvbG9yLXJlcGxhY2UvbGliL2ZpbHRlci1jb2xvci1yZXBsYWNlLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1jb252b2x1dGlvbi9saWIvZmlsdGVyLWNvbnZvbHV0aW9uLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1jcm9zcy1oYXRjaC9saWIvZmlsdGVyLWNyb3NzLWhhdGNoLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1kb3QvbGliL2ZpbHRlci1kb3QuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93L2xpYi9maWx0ZXItZHJvcC1zaGFkb3cuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWVtYm9zcy9saWIvZmlsdGVyLWVtYm9zcy5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZ2xvdy9saWIvZmlsdGVyLWdsb3cuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWdvZHJheS9saWIvZmlsdGVyLWdvZHJheS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItbW90aW9uLWJsdXIvbGliL2ZpbHRlci1tb3Rpb24tYmx1ci5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZS9saWIvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLW9sZC1maWxtL2xpYi9maWx0ZXItb2xkLWZpbG0uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLW91dGxpbmUvbGliL2ZpbHRlci1vdXRsaW5lLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1waXhlbGF0ZS9saWIvZmlsdGVyLXBpeGVsYXRlLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1yYWRpYWwtYmx1ci9saWIvZmlsdGVyLXJhZGlhbC1ibHVyLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1yZ2Itc3BsaXQvbGliL2ZpbHRlci1yZ2Itc3BsaXQuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLXNob2Nrd2F2ZS9saWIvZmlsdGVyLXNob2Nrd2F2ZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwL2xpYi9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci10aWx0LXNoaWZ0L2xpYi9maWx0ZXItdGlsdC1zaGlmdC5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItdHdpc3QvbGliL2ZpbHRlci10d2lzdC5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItem9vbS1ibHVyL2xpYi9maWx0ZXItem9vbS1ibHVyLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktZmlsdGVycy9saWIvcGl4aS1maWx0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktcGFydGljbGVzL2Rpc3QvcGl4aS1wYXJ0aWNsZXMubWluLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktcHJvamVjdGlvbi9kaXN0L3BpeGktcHJvamVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9waXhpLXNvdW5kL2Rpc3QvcGl4aS1zb3VuZC5qcyIsIm5vZGVfbW9kdWxlcy9waXhpLXR3ZWVuL2J1aWxkL3BpeGktdHdlZW4uanMiLCJzcmMvY29udGVudC9ibG9ja3MuanNvbiIsInNyYy9jb250ZW50L2ZyYWdtZW50cy5qc29uIiwic3JjL2NvbnRlbnQvbGV2ZWxzLmpzb24iLCJzcmNcXGdhbWUuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFxtYW5hZ2Vyc1xcSGlzdG9yeU1hbmFnZXIuanMiLCJzcmNcXG1hbmFnZXJzXFxMZXZlbE1hbmFnZXIuanMiLCJzcmNcXG1hbmFnZXJzXFxNYXBNYW5hZ2VyLmpzIiwic3JjXFxtYW5hZ2Vyc1xcU2NlbmVzTWFuYWdlci5qcyIsInNyY1xcbWFuYWdlcnNcXFNjcmVlbk1hbmFnZXIuanMiLCJzcmNcXHNjZW5lc1xcUGxheWdyb3VuZC5qcyIsInNyY1xcc2NlbmVzXFxpbmRleC5qcyIsInNyYy9zaGFkZXJzL0FscGhhR3JhZGllbnRGaWx0ZXIvYWxwaGEuZnJhZyIsInNyY1xcc2hhZGVyc1xcQWxwaGFHcmFkaWVudEZpbHRlclxcaW5kZXguanMiLCJzcmMvc2hhZGVycy9HcmF5c2NhbGVGaWx0ZXIvZ3JheXNjYWxlLmZyYWciLCJzcmNcXHNoYWRlcnNcXEdyYXlzY2FsZUZpbHRlclxcaW5kZXguanMiLCJzcmNcXHNoYWRlcnNcXE5vaXNlQmx1ckZpbHRlclxcaW5kZXguanMiLCJzcmMvc2hhZGVycy9Ob2lzZUJsdXJGaWx0ZXIvbm9pc2VCbHVyLmZyYWciLCJzcmMvc2hhZGVycy9iYXNpYy52ZXJ0Iiwic3JjXFxzdWJqZWN0c1xcQmxvY2suanMiLCJzcmNcXHN1YmplY3RzXFxQbGF5ZXIuanMiLCJzcmNcXHN1YmplY3RzXFxTcGhlcmUuanMiLCJzcmNcXHN1YmplY3RzXFxUaGxlbi5qcyIsInNyYy9zdWJqZWN0cy9lbWl0dGVyLmpzb24iLCJzcmNcXHV0aWxzXFxEYXRhRnJhZ21lbnRDb252ZXJ0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdG5FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMxQ0EsSUFBTSxnQkFBZ0IsUUFBUSwwQkFBUixDQUF0QjtBQUNBLElBQU0sVUFBVSxRQUFRLGNBQVIsQ0FBaEI7QUFDQSxJQUFNLGtCQUFrQixRQUFRLDJCQUFSLENBQXhCO0FBQ0EsSUFBTSxrQkFBa0IsUUFBUSwyQkFBUixDQUF4Qjs7QUFFQSxJQUFNLFNBQVMsUUFBUSxtQkFBUixDQUFmOztJQUVNLEk7OztBQUNKLG9CQUFjO0FBQUE7O0FBQUEsZ0hBQ04sT0FBTyxVQURELEVBQ2EsT0FBTyxXQURwQixFQUNpQyxFQUFDLGlCQUFpQixRQUFsQixFQURqQzs7QUFFWixpQkFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixNQUFLLElBQS9COztBQUVBLGNBQUssQ0FBTCxHQUFTLE9BQU8sVUFBaEI7QUFDQSxjQUFLLENBQUwsR0FBUyxPQUFPLFdBQWhCOztBQUVBLGNBQUssU0FBTCxHQUFpQixJQUFJLEtBQUssU0FBVCxFQUFqQjtBQUNBLGNBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsTUFBSyxTQUF6Qjs7QUFFQSxjQUFLLEVBQUwsR0FBVSxJQUFJLEtBQUssTUFBVCxDQUFnQixLQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLElBQXZCLENBQWhCLENBQVY7QUFDQSxjQUFLLEVBQUwsQ0FBUSxLQUFSLEdBQWdCLE1BQUssQ0FBckI7QUFDQSxjQUFLLEVBQUwsQ0FBUSxNQUFSLEdBQWlCLE1BQUssQ0FBdEI7QUFDQSxjQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLE1BQUssRUFBN0I7O0FBRUEsY0FBSyxNQUFMLEdBQWMsSUFBSSxhQUFKLE9BQWQ7QUFDQSxjQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLE1BQUssTUFBN0I7O0FBRUEsY0FBSyxTQUFMLENBQWUsVUFBZixHQUE0QixJQUFJLEtBQUssU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixNQUFLLENBQTlCLEVBQWlDLE1BQUssQ0FBdEMsQ0FBNUI7QUFDQSxjQUFLLFNBQUwsR0FBaUIsSUFBSSxlQUFKLEVBQWpCO0FBQ0EsY0FBSyxTQUFMLENBQWUsT0FBZixHQUF5QixDQUFDLE1BQUssU0FBTixFQUFpQixJQUFJLGVBQUosRUFBakIsQ0FBekI7O0FBRUEsY0FBSyxTQUFMLENBQWUsV0FBZixHQUE2QixJQUE3QjtBQUNBLGNBQUssU0FBTCxDQUFlLE1BQWYsR0FBd0IsTUFBeEI7QUFDQSxjQUFLLEtBQUwsR0FBYSxJQUFJLE1BQUosRUFBYjtBQUNBLGNBQUssU0FBTCxDQUFlLFFBQWYsQ0FBd0IsTUFBSyxLQUE3Qjs7QUFFQSxjQUFLLFNBQUwsQ0FBZSxFQUFmLENBQWtCLGFBQWxCLEVBQWlDLFVBQUMsQ0FBRCxFQUFPO0FBQ3RDLGtCQUFLLFNBQUwsQ0FBZSxDQUFmLEdBQW1CLEVBQUUsSUFBRixDQUFPLE1BQVAsQ0FBYyxDQUFkLEdBQWdCLE1BQUssQ0FBeEM7QUFDQSxrQkFBSyxTQUFMLENBQWUsQ0FBZixHQUFtQixFQUFFLElBQUYsQ0FBTyxNQUFQLENBQWMsQ0FBZCxHQUFnQixNQUFLLENBQXhDO0FBQ0Esa0JBQUssS0FBTCxDQUFXLENBQVgsR0FBZSxFQUFFLElBQUYsQ0FBTyxNQUFQLENBQWMsQ0FBN0I7QUFDQSxrQkFBSyxLQUFMLENBQVcsQ0FBWCxHQUFlLEVBQUUsSUFBRixDQUFPLE1BQVAsQ0FBYyxDQUE3QjtBQUNELFNBTEQ7O0FBT0EsY0FBSyxXQUFMO0FBbENZO0FBbUNiOzs7O3NDQUNhO0FBQUE7O0FBQ1osaUJBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsVUFBQyxFQUFELEVBQVE7QUFDdEIsdUJBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsRUFBbkI7QUFDQSxxQkFBSyxZQUFMLENBQWtCLE1BQWxCO0FBQ0EsdUJBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsRUFBbEI7QUFDQTtBQUNELGFBTEQ7QUFNRDs7OztFQTVDZ0IsS0FBSyxXOztBQStDeEIsT0FBTyxPQUFQLEdBQWlCLElBQWpCOzs7OztBQ3REQSxRQUFRLFlBQVI7QUFDQSxRQUFRLFlBQVI7QUFDQSxRQUFRLGlCQUFSO0FBQ0EsUUFBUSxnQkFBUjs7QUFFQSxJQUFNLE9BQU8sUUFBUSxRQUFSLENBQWI7O0FBRUEsUUFBUSxJQUFSLENBQWE7QUFDWCxVQUFRO0FBQ04sY0FBVSxDQUFDLFdBQUQ7QUFESixHQURHO0FBSVgsUUFKVyxvQkFJRjtBQUNQLFNBQUssTUFBTCxDQUNHLEdBREgsQ0FDTyxRQURQLEVBQ2lCLG9CQURqQixFQUVHLEdBRkgsQ0FFTyxRQUZQLEVBRWlCLG1CQUZqQixFQUdHLEdBSEgsQ0FHTyxJQUhQLEVBR2EsZUFIYixFQUlHLEdBSkgsQ0FJTyxjQUpQLEVBSXVCLHlCQUp2QixFQUtHLEdBTEgsQ0FLTyxPQUxQLEVBS2dCLGtCQUxoQixFQU1HLEdBTkgsQ0FNTyxVQU5QLEVBTW1CLHFCQU5uQixFQU9HLEdBUEgsQ0FPTyxNQVBQLEVBT2UsaUJBUGYsRUFRRyxHQVJILENBUU8sVUFSUCxFQVFtQixxQkFSbkIsRUFTRyxHQVRILENBU08sT0FUUCxFQVNnQixrQkFUaEIsRUFVRyxJQVZILENBVVEsVUFBQyxNQUFELEVBQVMsU0FBVCxFQUF1QjtBQUMzQjtBQUNBLFVBQUksT0FBTyxJQUFJLElBQUosRUFBWDtBQUNBLFdBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsWUFBeEI7O0FBRUEsYUFBTyxJQUFQLEdBQWMsSUFBZDtBQUNELEtBaEJIO0FBaUJEO0FBdEJVLENBQWI7Ozs7Ozs7Ozs7Ozs7SUNQTSxjOzs7QUFDSiwwQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBR2pCLFVBQUssSUFBTCxHQUFZLE1BQU0sSUFBbEI7QUFDQSxVQUFLLEtBQUwsR0FBYSxLQUFiOztBQUVBLFVBQUssS0FBTCxHQUFhLENBQWI7QUFDQSxVQUFLLElBQUwsR0FBWSxJQUFJLEtBQUssSUFBVCxDQUFjLE1BQWQsRUFBc0I7QUFDaEMsWUFBTSx1QkFEMEI7QUFFaEMsZ0JBQVUsSUFGc0I7QUFHaEMscUJBQWUsTUFBSyxJQUFMLENBQVUsQ0FBVixHQUFZLENBSEs7QUFJaEMsWUFBTSxNQUowQjtBQUtoQyxlQUFTLEVBTHVCO0FBTWhDLGFBQU87QUFOeUIsS0FBdEIsQ0FBWjtBQVFBLFVBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsR0FBakIsQ0FBcUIsRUFBckI7QUFDQSxVQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWMsTUFBSyxJQUFMLENBQVUsQ0FBVixHQUFZLENBQTFCO0FBQ0EsVUFBSyxJQUFMLENBQVUsQ0FBVixHQUFjLEdBQWQ7QUFDQSxVQUFLLFFBQUwsQ0FBYyxNQUFLLElBQW5CO0FBbEJpQjtBQW1CbEI7Ozs7NkJBQ1EsRyxFQUFLLEksRUFBTTtBQUNsQixXQUFLLElBQUwsQ0FBVSxVQUFWLEdBQXVCLFdBQXZCO0FBQ0EsV0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixHQUFsQjs7QUFFQSxVQUFJLE9BQU8sS0FBSyxZQUFMLENBQWtCLFdBQWxCLENBQThCLElBQTlCLENBQVg7QUFDQSxXQUFLLElBQUwsQ0FBVSxFQUFDLE9BQU8sQ0FBUixFQUFWLEVBQXNCLEVBQXRCLENBQXlCLEVBQUMsT0FBTyxDQUFSLEVBQXpCO0FBQ0EsV0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFdBQUssS0FBTDtBQUNBLFdBQUssSUFBTCxDQUFVLFFBQVY7O0FBRUEsaUJBQVcsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFYLEVBQXFDLElBQXJDO0FBQ0Q7OzsrQkFDVTtBQUNULFVBQUksT0FBTyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBOEIsSUFBOUIsQ0FBWDtBQUNBLFdBQUssSUFBTCxDQUFVLEVBQUMsT0FBTyxDQUFSLEVBQVYsRUFBc0IsRUFBdEIsQ0FBeUIsRUFBQyxPQUFPLENBQVIsRUFBekI7QUFDQSxXQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsV0FBSyxLQUFMO0FBQ0EsV0FBSyxJQUFMLENBQVUsUUFBVjtBQUNEOzs7O0VBdkMwQixLQUFLLFM7O0FBMENsQyxPQUFPLE9BQVAsR0FBaUIsY0FBakI7Ozs7Ozs7Ozs7Ozs7QUMxQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJNLFk7OztBQUNKLHdCQUFZLEtBQVosRUFBbUIsR0FBbkIsRUFBd0I7QUFBQTs7QUFBQTs7QUFHdEIsVUFBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLFVBQUssR0FBTCxHQUFXLEdBQVg7O0FBRUEsVUFBSyxNQUFMLEdBQWMsRUFBZDtBQUNBLFVBQUssYUFBTCxHQUFxQixFQUFyQjtBQUNBLFVBQUssZ0JBQUwsQ0FBc0IsUUFBUSxzQkFBUixDQUF0QjtBQUNBLFVBQUssU0FBTCxDQUFlLFFBQVEsbUJBQVIsQ0FBZjs7QUFFQSxVQUFLLGFBQUwsR0FBcUIsQ0FBckI7QUFDQSxVQUFLLGdCQUFMLEdBQXdCLENBQXhCO0FBWnNCO0FBYXZCO0FBQ0Q7Ozs7O3NDQUNrQjtBQUNoQixhQUFPLEtBQUssTUFBTCxDQUFZLEtBQUssYUFBakIsQ0FBUDtBQUNEOzs7eUNBQ29CO0FBQ25CLGFBQU8sS0FBSyxlQUFMLE1BQTBCLEtBQUssZUFBTCxHQUF1QixJQUF2QixDQUE0QixLQUFLLGdCQUFqQyxDQUFqQztBQUNEOztBQUVEOzs7O3VDQUMwQjtBQUFBLFVBQVQsSUFBUyx1RUFBSixFQUFJOztBQUN4QixhQUFPLE1BQVAsQ0FBYyxLQUFLLGFBQW5CLEVBQWtDLElBQWxDO0FBQ0EsV0FBSyxJQUFMLENBQVUsb0JBQVYsRUFBZ0MsSUFBaEM7QUFDRDs7QUFFRDs7OztnQ0FDcUI7QUFBQSxVQUFYLE1BQVcsdUVBQUosRUFBSTs7QUFDbkIsV0FBSSxJQUFJLElBQUksQ0FBWixFQUFlLElBQUksT0FBTyxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxhQUFLLFFBQUwsQ0FBYyxPQUFPLENBQVAsQ0FBZDtBQUNEO0FBQ0QsV0FBSyxJQUFMLENBQVUsYUFBVixFQUF5QixNQUF6QjtBQUNEOzs7K0JBQ2dCO0FBQUEsVUFBUixHQUFRLHVFQUFKLEVBQUk7O0FBQ2YsV0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixHQUFqQjs7QUFFQTtBQUNBLFVBQUksSUFBSixHQUFXLEVBQVg7QUFDQSxXQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxJQUFJLFNBQUosQ0FBYyxNQUFqQyxFQUF5QyxHQUF6QyxFQUE4QztBQUM1QyxhQUFJLElBQUksR0FBUixJQUFlLElBQUksU0FBSixDQUFjLENBQWQsQ0FBZixFQUFpQztBQUMvQixlQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxJQUFJLFNBQUosQ0FBYyxDQUFkLEVBQWlCLEdBQWpCLENBQW5CLEVBQTBDLEdBQTFDLEVBQStDO0FBQzdDLGdCQUFJLElBQUosQ0FBUyxJQUFULENBQWMsS0FBSyxhQUFMLENBQW1CLEdBQW5CLENBQWQ7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxXQUFLLElBQUwsQ0FBVSxZQUFWLEVBQXdCLEdBQXhCO0FBQ0Q7O0FBRUQ7Ozs7Z0NBQ1ksRyxFQUFLO0FBQ2YsVUFBRyxPQUFPLEtBQUssTUFBTCxDQUFZLE1BQW5CLElBQTZCLE1BQU0sQ0FBdEMsRUFBeUM7O0FBRXpDLFdBQUssYUFBTCxHQUFxQixHQUFyQjtBQUNBLFdBQUssY0FBTCxDQUFvQixDQUFwQjs7QUFFQSxXQUFLLElBQUwsQ0FBVSxjQUFWO0FBQ0EsV0FBSyxJQUFMLENBQVUsZUFBVjtBQUNEOzs7Z0NBQ1c7QUFDVixXQUFLLFdBQUwsQ0FBaUIsS0FBSyxhQUFMLEdBQW1CLENBQXBDO0FBQ0EsV0FBSyxJQUFMLENBQVUsZUFBVjtBQUNEOzs7Z0NBQ1c7QUFDVixXQUFLLFdBQUwsQ0FBaUIsS0FBSyxhQUFMLEdBQW1CLENBQXBDO0FBQ0EsV0FBSyxJQUFMLENBQVUsZUFBVjtBQUNEOztBQUVEOzs7O21DQUNlLEksRUFBTTtBQUNuQixVQUFHLE9BQU8sQ0FBVixFQUFhO0FBQ2IsV0FBSyxnQkFBTCxHQUF3QixJQUF4Qjs7QUFFQSxVQUFHLEtBQUssa0JBQUwsRUFBSCxFQUE4QixLQUFLLEdBQUwsQ0FBUyxNQUFULENBQWdCLEtBQUssa0JBQUwsRUFBaEIsRUFBOUIsS0FDSyxLQUFLLElBQUwsQ0FBVSxZQUFWO0FBQ0wsV0FBSyxJQUFMLENBQVUsa0JBQVY7QUFDRDs7O21DQUNjO0FBQ2IsV0FBSyxjQUFMLENBQW9CLEtBQUssZ0JBQUwsR0FBc0IsQ0FBMUM7QUFDQSxXQUFLLElBQUwsQ0FBVSxrQkFBVjtBQUNEOzs7bUNBQ2M7QUFDYixXQUFLLGNBQUwsQ0FBb0IsS0FBSyxnQkFBTCxHQUFzQixDQUExQztBQUNBLFdBQUssSUFBTCxDQUFVLGtCQUFWO0FBQ0Q7Ozs7RUF0RndCLEtBQUssS0FBTCxDQUFXLFk7O0FBeUZ0QyxPQUFPLE9BQVAsR0FBaUIsWUFBakI7Ozs7Ozs7Ozs7Ozs7QUM5R0E7Ozs7Ozs7Ozs7Ozs7O0FBZUEsSUFBTSxRQUFRLFFBQVEsbUJBQVIsQ0FBZDtBQUNBLElBQU0sd0JBQXdCLFFBQVEsZ0NBQVIsQ0FBOUI7O0lBRU0sVTs7O0FBQ0osc0JBQVksS0FBWixFQUE4QjtBQUFBLFFBQVgsTUFBVyx1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUU1QixVQUFNLFFBQU47O0FBRUEsVUFBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLFVBQUssSUFBTCxHQUFZLE1BQU0sSUFBbEI7O0FBRUEsVUFBSyxjQUFMLEdBQXNCLEdBQXRCOztBQUVBLFVBQUssUUFBTCxHQUFnQixPQUFPLElBQVAsSUFBZSxDQUEvQjtBQUNBLFVBQUssU0FBTCxHQUFpQixPQUFPLFFBQVAsSUFBbUIsR0FBcEM7QUFDQSxVQUFLLGFBQUwsQ0FBbUIsUUFBUSxtQkFBUixDQUFuQjtBQUNBLFVBQUssTUFBTDs7QUFFQSxVQUFLLE1BQUwsR0FBYyxLQUFkOztBQUVBLFVBQUssS0FBTCxHQUFhLEdBQWI7QUFDQSxVQUFLLFNBQUwsR0FBaUIsQ0FBakI7QUFqQjRCO0FBa0I3Qjs7Ozs2QkFDUTtBQUNQLFdBQUssQ0FBTCxHQUFTLEtBQUssSUFBTCxDQUFVLENBQVYsR0FBWSxDQUFaLEdBQWMsS0FBSyxRQUFMLEdBQWMsS0FBSyxTQUFuQixHQUE2QixDQUFwRDtBQUNBLFdBQUssQ0FBTCxHQUFTLEtBQUssSUFBTCxDQUFVLENBQVYsR0FBWSxLQUFLLGNBQTFCO0FBQ0EsV0FBSyxJQUFMLENBQVUsU0FBVjtBQUNEOztBQUVEOzs7O2tDQUNjLEksRUFBTTtBQUNsQixXQUFLLE1BQUwsR0FBYyxRQUFRLEVBQXRCO0FBQ0Q7OztnQ0FDVyxHLEVBQUs7QUFDZixXQUFLLFFBQUwsR0FBZ0IsT0FBTyxDQUF2QjtBQUNBLFdBQUssTUFBTDtBQUNEOzs7aUNBQ1ksSSxFQUFNO0FBQ2pCLFdBQUssU0FBTCxHQUFpQixRQUFRLEdBQXpCO0FBQ0EsV0FBSyxNQUFMO0FBQ0Q7Ozs2QkFDUSxLLEVBQU87QUFDZCxXQUFLLEtBQUwsR0FBYSxTQUFTLEdBQXRCO0FBQ0Q7O0FBR0Q7Ozs7MkJBQ08sRyxFQUFLO0FBQ1YsV0FBSSxJQUFJLElBQUksSUFBSSxNQUFKLEdBQVcsQ0FBdkIsRUFBMEIsS0FBSyxDQUEvQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxhQUFLLFdBQUwsQ0FBaUIsSUFBSSxDQUFKLENBQWpCO0FBQ0Q7QUFDRCxXQUFLLElBQUwsQ0FBVSxVQUFWLEVBQXNCLEdBQXRCO0FBQ0EsV0FBSyxlQUFMO0FBQ0Q7OztnQ0FDVyxRLEVBQVU7QUFDcEIsVUFBSSxPQUFPLElBQUkscUJBQUosQ0FBMEIsUUFBMUIsRUFBb0MsUUFBL0M7QUFDQTtBQUNBLFdBQUksSUFBSSxJQUFJLENBQVosRUFBZSxJQUFJLEtBQUssTUFBeEIsRUFBZ0MsR0FBaEMsRUFBcUM7QUFDbkMsYUFBSyxRQUFMLENBQWMsS0FBSyxDQUFMLENBQWQsRUFBdUIsS0FBSyxLQUFMLENBQVcsQ0FBQyxLQUFLLFFBQUwsR0FBYyxLQUFLLE1BQXBCLElBQTRCLENBQXZDLElBQTBDLENBQWpFLEVBQW9FLEtBQUssU0FBekU7QUFDRDs7QUFFRCxXQUFLLFNBQUw7QUFDQSxXQUFLLElBQUwsQ0FBVSxlQUFWLEVBQTJCLFFBQTNCO0FBQ0Q7Ozs2QkFDUSxFLEVBQUksQyxFQUFHLEMsRUFBRztBQUNqQixVQUFHLE9BQU8sR0FBVixFQUFlOztBQUVmLFVBQUksT0FBTyxJQUFFLEtBQUssU0FBbEI7QUFDQSxVQUFJLE9BQU8sQ0FBQyxDQUFELEdBQUcsS0FBSyxTQUFuQjtBQUNBLFVBQUksUUFBUSxLQUFLLFFBQUwsQ0FBYyxJQUFJLEtBQUosQ0FBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCLElBQXRCLEVBQTRCLEtBQUssTUFBTCxDQUFZLEVBQVosQ0FBNUIsQ0FBZCxDQUFaO0FBQ0EsV0FBSyxJQUFMLENBQVUsWUFBVixFQUF3QixLQUF4QjtBQUNEOztBQUVEOzs7O29DQUNnQixHLEVBQUs7QUFDbkIsV0FBSSxJQUFJLElBQUksQ0FBWixFQUFlLElBQUksS0FBSyxRQUFMLENBQWMsTUFBakMsRUFBeUMsR0FBekMsRUFBOEM7QUFDNUMsWUFBRyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLGFBQWpCLENBQStCLEdBQS9CLENBQUgsRUFBd0MsT0FBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQVA7QUFDekM7QUFDRjs7QUFFRDs7OzsrQkFDVyxNLEVBQVE7QUFBQTs7QUFDakIsVUFBRyxLQUFLLE1BQVIsRUFBZ0I7O0FBRWhCO0FBQ0EsVUFBSSxPQUFPLEtBQUssWUFBTCxDQUFrQixXQUFsQixDQUE4QixJQUE5QixDQUFYO0FBQ0EsV0FBSyxJQUFMLENBQVUsRUFBQyxHQUFHLEtBQUssQ0FBVCxFQUFWLEVBQXVCLEVBQXZCLENBQTBCLEVBQUMsR0FBRyxLQUFLLENBQUwsR0FBTyxTQUFPLEtBQUssU0FBdkIsRUFBMUI7QUFDQSxXQUFLLElBQUwsR0FBWSxLQUFLLEtBQUwsR0FBVyxNQUF2QjtBQUNBLFdBQUssRUFBTCxDQUFRLEtBQVIsRUFBZSxZQUFNO0FBQ25CLGVBQUssSUFBTCxDQUFVLGNBQVYsRUFBMEIsTUFBMUI7QUFDQSxlQUFLLG1CQUFMO0FBQ0EsZUFBSyxlQUFMO0FBQ0QsT0FKRDtBQUtBLFdBQUssS0FBTDtBQUNEOzs7OEJBQ1MsTSxFQUFRO0FBQUE7O0FBQ2hCLFVBQUcsS0FBSyxNQUFSLEVBQWdCOztBQUVoQjtBQUNBLFVBQUksT0FBTyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBOEIsSUFBOUIsQ0FBWDtBQUNBLFdBQUssSUFBTCxDQUFVLEVBQUMsR0FBRyxLQUFLLENBQVQsRUFBVixFQUF1QixFQUF2QixDQUEwQixFQUFDLEdBQUcsS0FBSyxDQUFMLEdBQU8sU0FBTyxLQUFLLFNBQXZCLEVBQTFCO0FBQ0EsV0FBSyxJQUFMLEdBQVksS0FBSyxLQUFMLEdBQVcsTUFBdkI7QUFDQSxXQUFLLEVBQUwsQ0FBUSxLQUFSLEVBQWUsWUFBTTtBQUNuQixlQUFLLElBQUwsQ0FBVSxhQUFWLEVBQXlCLE1BQXpCO0FBQ0EsZUFBSyxtQkFBTDtBQUNBLGVBQUssZUFBTDtBQUNELE9BSkQ7QUFLQSxXQUFLLEtBQUw7QUFDRDs7QUFFRDs7OztzQ0FDa0I7QUFDaEIsVUFBRyxLQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLEtBQUssUUFBTCxJQUFlLEtBQUssSUFBTCxDQUFVLENBQVYsR0FBWSxLQUFLLFNBQWhDLElBQTJDLENBQXJFLEVBQXdFO0FBQ3RFLGFBQUssSUFBTCxDQUFVLFVBQVY7QUFDRDtBQUNGOztBQUVEOzs7OzBDQUNzQjtBQUNwQixXQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxLQUFLLFFBQUwsQ0FBYyxNQUFqQyxFQUF5QyxHQUF6QyxFQUE4QztBQUM1QyxZQUFHLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsY0FBakIsQ0FBZ0MsRUFBaEMsR0FBbUMsS0FBSyxTQUFMLEdBQWUsQ0FBbEQsR0FBc0QsS0FBSyxJQUFMLENBQVUsQ0FBbkUsRUFBc0U7QUFDcEUsZUFBSyxXQUFMLENBQWlCLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBakI7QUFDRDtBQUNGO0FBQ0QsV0FBSyxJQUFMLENBQVUsdUJBQVY7QUFDRDs7OztFQTFIc0IsS0FBSyxVQUFMLENBQWdCLFc7O0FBNkh6QyxPQUFPLE9BQVAsR0FBaUIsVUFBakI7Ozs7Ozs7Ozs7Ozs7QUMvSUE7Ozs7Ozs7Ozs7OztJQVlNLGE7OztBQUNKLHlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFBQTs7QUFFaEIsVUFBSyxJQUFMLEdBQVksSUFBWjs7QUFFQSxVQUFLLE1BQUwsR0FBYyxRQUFRLFdBQVIsQ0FBZDtBQUNBLFVBQUssV0FBTCxHQUFtQixJQUFuQjtBQUxnQjtBQU1qQjs7Ozs2QkFDUSxFLEVBQUk7QUFDWCxhQUFPLEtBQUssTUFBTCxDQUFZLEVBQVosQ0FBUDtBQUNEOztBQUVEOzs7OzhCQUNVLE0sRUFBUTtBQUNoQixXQUFJLElBQUksRUFBUixJQUFjLE1BQWQsRUFBc0I7QUFDcEIsYUFBSyxRQUFMLENBQWMsRUFBZCxFQUFrQixPQUFPLEVBQVAsQ0FBbEI7QUFDRDtBQUNELFdBQUssSUFBTCxDQUFVLGFBQVYsRUFBeUIsTUFBekI7QUFDRDs7OzZCQUNRLEUsRUFBSSxLLEVBQU87QUFDbEIsV0FBSyxNQUFMLENBQVksRUFBWixJQUFrQixLQUFsQjtBQUNBLFdBQUssSUFBTCxDQUFVLFlBQVYsRUFBd0IsS0FBeEI7QUFDRDs7O2dDQUNXLEUsRUFBSTtBQUNkLFVBQUksU0FBUyxLQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWI7QUFDQSxXQUFLLE1BQUwsQ0FBWSxFQUFaLElBQWtCLElBQWxCO0FBQ0EsV0FBSyxJQUFMLENBQVUsY0FBVixFQUEwQixNQUExQjtBQUNEOztBQUVEOzs7O21DQUNlO0FBQ2IsV0FBSyxXQUFMLENBQWlCLEtBQUssV0FBTCxDQUFpQixRQUFsQztBQUNBLFdBQUssSUFBTCxDQUFVLGdCQUFWLEVBQTRCLEtBQUssV0FBakM7QUFDRDs7O21DQUNjO0FBQ2IsVUFBSSxRQUFRLEtBQUssV0FBTCxDQUFpQixLQUFLLFdBQXRCLENBQVo7QUFDQSxXQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxXQUFLLElBQUwsQ0FBVSxlQUFWLEVBQTJCLEtBQTNCO0FBQ0Q7OztnQ0FDVyxFLEVBQUk7QUFDZCxXQUFLLFlBQUw7O0FBRUEsVUFBSSxRQUFRLEtBQUssUUFBTCxDQUFjLEVBQWQsQ0FBWjtBQUNBLFdBQUssV0FBTCxHQUFtQixLQUFLLFFBQUwsQ0FBYyxJQUFJLEtBQUosQ0FBVSxLQUFLLElBQWYsRUFBcUIsSUFBckIsQ0FBZCxDQUFuQjtBQUNBLFdBQUssV0FBTCxDQUFpQixRQUFqQixHQUE0QixFQUE1Qjs7QUFFQSxXQUFLLElBQUwsQ0FBVSxjQUFWLEVBQTBCLEtBQUssV0FBL0I7QUFDRDs7OzJCQUVNLEUsRUFBSTtBQUNULFdBQUssV0FBTCxJQUFvQixLQUFLLFdBQUwsQ0FBaUIsTUFBckMsSUFBK0MsS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBQXdCLEVBQXhCLENBQS9DO0FBQ0EsV0FBSyxJQUFMLENBQVUsU0FBVixFQUFxQixFQUFyQjtBQUNEOzs7O0VBcER5QixLQUFLLFM7O0FBdURqQyxPQUFPLE9BQVAsR0FBaUIsYUFBakI7Ozs7Ozs7Ozs7O0lDbkVNLGE7OztBQUNKLHlCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFHakIsVUFBSyxLQUFMLEdBQWEsS0FBYjtBQUhpQjtBQUlsQjs7O0VBTHlCLEtBQUssUzs7QUFRakMsT0FBTyxPQUFQLEdBQWlCLGFBQWpCOzs7Ozs7Ozs7Ozs7O0FDUkEsSUFBTSxzQkFBc0IsUUFBUSxnQ0FBUixDQUE1Qjs7QUFFQSxJQUFNLGFBQWEsUUFBUSx3QkFBUixDQUFuQjtBQUNBLElBQU0sZUFBZSxRQUFRLDBCQUFSLENBQXJCO0FBQ0EsSUFBTSxpQkFBaUIsUUFBUSw0QkFBUixDQUF2QjtBQUNBLElBQU0sZ0JBQWdCLFFBQVEsMkJBQVIsQ0FBdEI7QUFDQSxJQUFNLFNBQVMsUUFBUSxvQkFBUixDQUFmO0FBQ0EsSUFBTSxRQUFRLFFBQVEsbUJBQVIsQ0FBZDs7SUFFTSxVOzs7QUFDSix3QkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQUE7O0FBRWhCLGNBQUssSUFBTCxHQUFZLElBQVo7O0FBRUE7QUFDQSxjQUFLLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUE7QUFDQSxjQUFLLFVBQUwsR0FBa0IsSUFBSSxLQUFLLFVBQUwsQ0FBZ0IsV0FBcEIsRUFBbEI7QUFDQSxjQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsUUFBckIsQ0FBOEIsRUFBQyxHQUFHLENBQUMsTUFBSyxJQUFMLENBQVUsQ0FBWCxHQUFhLENBQWIsR0FBZSxFQUFuQixFQUF1QixHQUFHLElBQTFCLEVBQTlCLEVBQStELENBQUMsQ0FBaEU7QUFDQSxjQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsR0FBMEIsQ0FBQyxJQUFJLG1CQUFKLENBQXdCLEVBQXhCLEVBQTRCLEVBQTVCLENBQUQsQ0FBMUI7QUFDQSxjQUFLLFFBQUwsQ0FBYyxNQUFLLFVBQW5COztBQUVBLGNBQUssR0FBTCxHQUFXLElBQUksVUFBSixPQUFYO0FBQ0EsY0FBSyxVQUFMLENBQWdCLFFBQWhCLENBQXlCLE1BQUssR0FBOUI7O0FBRUEsY0FBSyxNQUFMLEdBQWMsSUFBSSxZQUFKLFFBQXVCLE1BQUssR0FBNUIsQ0FBZDs7QUFFQSxjQUFLLE1BQUwsR0FBYyxJQUFJLGFBQUosT0FBZDtBQUNBLGNBQUssT0FBTCxHQUFlLElBQUksY0FBSixPQUFmO0FBQ0EsY0FBSyxNQUFMLEdBQWMsSUFBSSxNQUFKLFFBQWlCLE1BQUssR0FBdEIsQ0FBZDtBQUNBLGNBQUssS0FBTCxHQUFhLElBQUksS0FBSixPQUFiO0FBQ0EsY0FBSyxRQUFMLENBQWMsTUFBSyxNQUFuQixFQUEyQixNQUFLLE9BQWhDLEVBQXlDLE1BQUssTUFBOUMsRUFBc0QsTUFBSyxLQUEzRDs7QUFFQTtBQUNBLGNBQUssV0FBTDtBQXpCZ0I7QUEwQmpCOzs7O3NDQUNhO0FBQUE7O0FBQ1osaUJBQUssRUFBTCxDQUFRLGFBQVIsRUFBdUI7QUFBQSx1QkFBTSxPQUFLLE1BQUwsQ0FBWSxRQUFaLEVBQU47QUFBQSxhQUF2QjtBQUNBLGlCQUFLLEVBQUwsQ0FBUSxhQUFSLEVBQXVCLFVBQUMsQ0FBRCxFQUFPO0FBQzVCLHFCQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxPQUFLLEdBQUwsQ0FBUyxRQUFULENBQWtCLE1BQXJDLEVBQTZDLEdBQTdDLEVBQWtEO0FBQ2hELHdCQUFJLFFBQVEsT0FBSyxHQUFMLENBQVMsUUFBVCxDQUFrQixDQUFsQixDQUFaO0FBQ0Esd0JBQUcsTUFBTSxhQUFOLENBQW9CLEVBQUUsSUFBRixDQUFPLE1BQTNCLENBQUgsRUFBdUM7QUFDckMsK0JBQU8sTUFBTSxHQUFOLEVBQVA7QUFDRCxxQkFGRCxNQUVPLE1BQU0sS0FBTjtBQUNSO0FBQ0YsYUFQRDs7QUFTQSxpQkFBSyxNQUFMLENBQVksRUFBWixDQUFlLFFBQWYsRUFBeUI7QUFBQSx1QkFBTSxPQUFLLE9BQUwsRUFBTjtBQUFBLGFBQXpCO0FBQ0EsaUJBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxXQUFmLEVBQTRCLFVBQUMsS0FBRCxFQUFXO0FBQ3JDLG9CQUFHLE1BQU0sTUFBTixLQUFpQixTQUFwQixFQUErQixPQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLE9BQUssTUFBTCxDQUFZLGVBQVosR0FBOEIsT0FBOUIsQ0FBc0MsRUFBNUQsRUFBZ0UsSUFBaEU7QUFDaEMsYUFGRDs7QUFJQSxpQkFBSyxPQUFMLENBQWEsRUFBYixDQUFnQixRQUFoQixFQUEwQixZQUFNO0FBQzlCLG9CQUFJLFFBQVEsS0FBSyxZQUFMLENBQWtCLFdBQWxCLENBQThCLE9BQUssVUFBTCxDQUFnQixPQUFoQixDQUF3QixDQUF4QixDQUE5QixDQUFaO0FBQ0Esc0JBQU0sSUFBTixDQUFXLEVBQUMsZUFBZSxFQUFoQixFQUFvQixhQUFhLEVBQWpDLEVBQVgsRUFBaUQsRUFBakQsQ0FBb0QsRUFBQyxlQUFlLEVBQWhCLEVBQW9CLGFBQWEsRUFBakMsRUFBcEQ7QUFDQSxzQkFBTSxJQUFOLEdBQWEsSUFBYjtBQUNBLHNCQUFNLEtBQU47O0FBRUEsdUJBQUssR0FBTCxDQUFTLE1BQVQsR0FBa0IsSUFBbEI7QUFDRCxhQVBEO0FBUUEsaUJBQUssT0FBTCxDQUFhLEVBQWIsQ0FBZ0IsUUFBaEIsRUFBMEIsWUFBTTtBQUM5QixvQkFBSSxRQUFRLEtBQUssWUFBTCxDQUFrQixXQUFsQixDQUE4QixPQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBd0IsQ0FBeEIsQ0FBOUIsQ0FBWjtBQUNBLHNCQUFNLElBQU4sQ0FBVyxFQUFDLGVBQWUsRUFBaEIsRUFBb0IsYUFBYSxFQUFqQyxFQUFYLEVBQWlELEVBQWpELENBQW9ELEVBQUMsZUFBZSxFQUFoQixFQUFvQixhQUFhLEVBQWpDLEVBQXBEO0FBQ0Esc0JBQU0sSUFBTixHQUFhLElBQWI7QUFDQSxzQkFBTSxLQUFOOztBQUVBLHVCQUFLLEdBQUwsQ0FBUyxNQUFULEdBQWtCLEtBQWxCO0FBQ0EsdUJBQUssR0FBTCxDQUFTLFVBQVQsQ0FBb0IsQ0FBcEI7QUFDRCxhQVJEOztBQVVBLGlCQUFLLEdBQUwsQ0FBUyxFQUFULENBQVksVUFBWixFQUF3QjtBQUFBLHVCQUFNLE9BQUssTUFBTCxDQUFZLFlBQVosRUFBTjtBQUFBLGFBQXhCO0FBQ0EsaUJBQUssR0FBTCxDQUFTLEVBQVQsQ0FBWSxjQUFaLEVBQTRCO0FBQUEsdUJBQU0sT0FBSyxNQUFMLENBQVksTUFBWixFQUFOO0FBQUEsYUFBNUI7O0FBRUEsaUJBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxZQUFmLEVBQTZCO0FBQUEsdUJBQU0sT0FBSyxNQUFMLENBQVksU0FBWixFQUFOO0FBQUEsYUFBN0I7O0FBRUEsaUJBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsQ0FBeEI7QUFDQSxpQkFBSyxHQUFMLENBQVMsVUFBVCxDQUFvQixDQUFwQjtBQUNEOzs7a0NBQ1M7QUFDUixpQkFBSyxJQUFMLENBQVUsTUFBVixDQUFpQixZQUFqQixDQUE4QixZQUE5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDRDs7O2lDQUNRO0FBQ1AsaUJBQUssS0FBTCxDQUFXLE1BQVg7QUFDRDs7OztFQS9Fc0IsS0FBSyxVQUFMLENBQWdCLFc7O0FBa0Z6QyxPQUFPLE9BQVAsR0FBaUIsVUFBakI7Ozs7O0FDM0ZBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLGdCQUFjLFFBQVEsY0FBUjtBQURDLENBQWpCOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6QkEsSUFBTSxPQUFPLFFBQVEsY0FBUixDQUFiO0FBQ0EsSUFBTSxPQUFPLFFBQVEsZUFBUixDQUFiOztJQUVNLG1COzs7QUFDSiwrQkFBWSxhQUFaLEVBQTJCLFdBQTNCLEVBQXdDO0FBQUE7O0FBQUEsMElBQ2hDLE1BRGdDLEVBQ3hCLE1BRHdCOztBQUd0QyxVQUFLLGFBQUwsR0FBcUIsaUJBQWlCLEVBQXRDO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLGVBQWUsRUFBbEM7QUFKc0M7QUFLdkM7Ozs7c0JBQ2lCLEMsRUFBRztBQUNuQixXQUFLLFFBQUwsQ0FBYyxhQUFkLEdBQThCLENBQTlCO0FBQ0QsSzt3QkFDbUI7QUFDbEIsYUFBTyxLQUFLLFFBQUwsQ0FBYyxhQUFyQjtBQUNEOzs7c0JBQ2UsQyxFQUFHO0FBQ2pCLFdBQUssUUFBTCxDQUFjLFdBQWQsR0FBNEIsQ0FBNUI7QUFDRCxLO3dCQUNpQjtBQUNoQixhQUFPLEtBQUssUUFBTCxDQUFjLFdBQXJCO0FBQ0Q7Ozs7RUFsQitCLEtBQUssTTs7QUFxQnZDLE9BQU8sT0FBUCxHQUFpQixtQkFBakI7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6QkEsSUFBTSxPQUFPLFFBQVEsa0JBQVIsQ0FBYjtBQUNBLElBQU0sT0FBTyxRQUFRLGVBQVIsQ0FBYjs7SUFFTSxlOzs7QUFDSiwyQkFBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQjtBQUFBOztBQUFBLGtJQUNiLE1BRGEsRUFDTCxNQURLOztBQUduQixVQUFLLENBQUwsR0FBUyxLQUFLLEVBQWQ7QUFDQSxVQUFLLENBQUwsR0FBUyxLQUFLLEVBQWQ7QUFDQSxVQUFLLENBQUwsR0FBUyxLQUFLLEdBQWQ7QUFMbUI7QUFNcEI7Ozs7c0JBQ0ssQyxFQUFHO0FBQ1AsV0FBSyxRQUFMLENBQWMsQ0FBZCxHQUFrQixDQUFsQjtBQUNELEs7d0JBQ087QUFDTixhQUFPLEtBQUssUUFBTCxDQUFjLENBQXJCO0FBQ0Q7OztzQkFDSyxDLEVBQUc7QUFDUCxXQUFLLFFBQUwsQ0FBYyxDQUFkLEdBQWtCLENBQWxCO0FBQ0QsSzt3QkFDTztBQUNOLGFBQU8sS0FBSyxRQUFMLENBQWMsQ0FBckI7QUFDRDs7O3NCQUNLLEMsRUFBRztBQUNQLFdBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsQ0FBbEI7QUFDRCxLO3dCQUNPO0FBQ04sYUFBTyxLQUFLLFFBQUwsQ0FBYyxDQUFyQjtBQUNEOzs7O0VBekIyQixLQUFLLE07O0FBNEJuQyxPQUFPLE9BQVAsR0FBaUIsZUFBakI7Ozs7Ozs7Ozs7O0FDL0JBLElBQU0sT0FBTyxRQUFRLGtCQUFSLENBQWI7QUFDQSxJQUFNLE9BQU8sUUFBUSxlQUFSLENBQWI7O0lBRU0sZTs7O0FBQ0osNkJBQWM7QUFBQTs7QUFBQSw2SEFDTixNQURNLEVBQ0UsTUFERjtBQUViOzs7RUFIMkIsS0FBSyxNOztBQU1uQyxPQUFPLE9BQVAsR0FBaUIsZUFBakI7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xCQTs7Ozs7Ozs7SUFRTSxLOzs7QUFDSixtQkFBWSxHQUFaLEVBQWlCLENBQWpCLEVBQW9CLENBQXBCLEVBQWtDO0FBQUEsWUFBWCxNQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEsa0hBQzFCLEtBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsT0FBTyxLQUFQLElBQWdCLE9BQU8sZUFBOUMsQ0FEMEI7O0FBR2hDLGNBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxjQUFLLElBQUwsR0FBWSxNQUFLLEdBQUwsQ0FBUyxJQUFyQjs7QUFFQSxjQUFLLEtBQUwsR0FBYSxPQUFPLEtBQXBCO0FBQ0EsY0FBSyxVQUFMLEdBQWtCLE9BQU8sVUFBUCxJQUFxQixJQUF2QztBQUNBLGNBQUssbUJBQUwsR0FBMkIsT0FBTyxLQUFQLEdBQWUsS0FBSyxPQUFMLENBQWEsU0FBYixDQUF1QixPQUFPLEtBQTlCLENBQWYsR0FBc0QsSUFBakY7QUFDQSxjQUFLLGlCQUFMLEdBQXlCLE9BQU8sZUFBUCxHQUF5QixLQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLE9BQU8sZUFBOUIsQ0FBekIsR0FBMEUsSUFBbkc7QUFDQSxjQUFLLFFBQUwsR0FBZ0IsT0FBTyxNQUF2QjtBQUNBLGNBQUssU0FBTCxHQUFpQixPQUFPLFNBQVAsSUFBb0IsSUFBckM7QUFDQSxjQUFLLE1BQUwsR0FBYyxPQUFPLE1BQVAsSUFBaUIsSUFBL0I7O0FBRUEsY0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixFQUFoQjtBQUNBLGNBQUssS0FBTCxHQUFhLElBQUksU0FBSixHQUFjLENBQTNCO0FBQ0EsY0FBSyxNQUFMLEdBQWMsSUFBSSxTQUFKLEdBQWMsQ0FBNUI7QUFDQSxjQUFLLENBQUwsR0FBUyxJQUFFLElBQUksU0FBSixHQUFjLENBQWhCLEdBQWtCLEVBQTNCO0FBQ0EsY0FBSyxDQUFMLEdBQVMsSUFBRSxJQUFJLFNBQUosR0FBYyxDQUFoQixHQUFrQixFQUEzQjs7QUFFQSxjQUFLLE9BQUwsR0FBZSxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsT0FBZjtBQUNBLGNBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsRUFBQyxVQUFVLENBQUMsRUFBWixFQUFsQixFQUFtQyxFQUFuQyxDQUFzQyxFQUFDLFVBQVUsRUFBWCxFQUF0QztBQUNBLGNBQUssT0FBTCxDQUFhLElBQWIsR0FBb0IsR0FBcEI7QUFDQSxjQUFLLE9BQUwsQ0FBYSxRQUFiLEdBQXdCLElBQXhCO0FBQ0EsY0FBSyxPQUFMLENBQWEsTUFBYixHQUFzQixRQUF0Qjs7QUFFQSxjQUFLLElBQUwsR0FBWSxJQUFJLEtBQUssT0FBTCxDQUFhLFdBQWpCLEVBQVo7QUFDQSxjQUFLLElBQUwsQ0FBVSxPQUFWLEdBQW9CLEtBQXBCO0FBQ0EsY0FBSyxPQUFMLEdBQWUsQ0FBQyxNQUFLLElBQU4sQ0FBZjtBQTVCZ0M7QUE2QmpDOzs7O21DQUNVO0FBQ1QsZ0JBQUksYUFBYSxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBOEIsSUFBOUIsRUFDZCxJQURjLENBQ1QsRUFBQyxPQUFPLEtBQUssS0FBTCxHQUFXLENBQVgsR0FBYSxDQUFyQixFQUF3QixRQUFRLEtBQUssTUFBTCxHQUFZLENBQVosR0FBYyxDQUE5QyxFQURTLEVBRWQsRUFGYyxDQUVYLEVBQUMsT0FBTyxLQUFLLEtBQWIsRUFBb0IsUUFBUSxLQUFLLE1BQWpDLEVBQXlDLFVBQVUsQ0FBbkQsRUFGVyxDQUFqQjtBQUdBLHVCQUFXLElBQVgsR0FBa0IsR0FBbEI7QUFDQSx1QkFBVyxNQUFYLEdBQW9CLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsU0FBbEIsRUFBcEI7QUFDQSx1QkFBVyxLQUFYOztBQUVBLGlCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEdBQWxCO0FBQ0EsaUJBQUssT0FBTCxDQUFhLElBQWI7QUFDQSxpQkFBSyxRQUFMLEdBQWdCLENBQWhCOztBQUVBLGlCQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxnQkFBRyxLQUFLLGlCQUFSLEVBQTJCLEtBQUssT0FBTCxHQUFlLEtBQUssaUJBQXBCOztBQUUzQixpQkFBSyxJQUFMLENBQVUsV0FBVjtBQUNEOzs7cUNBQ1k7QUFDWCxpQkFBSyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsZ0JBQUcsS0FBSyxtQkFBUixFQUE2QixLQUFLLE9BQUwsR0FBZSxLQUFLLG1CQUFwQjtBQUM3QixpQkFBSyxJQUFMLENBQVUsYUFBVjtBQUNEOzs7Z0NBQ087QUFDTixpQkFBSyxJQUFMLENBQVUsT0FBVixHQUFvQixLQUFwQjtBQUNBLGlCQUFLLE9BQUwsQ0FBYSxJQUFiO0FBQ0EsaUJBQUssUUFBTCxHQUFnQixDQUFoQjtBQUNEOzs7OEJBQ0s7QUFDSixnQkFBRyxLQUFLLFVBQUwsS0FBb0IsSUFBcEIsSUFBNEIsS0FBSyxRQUFwQyxFQUE4Qzs7QUFFOUMsaUJBQUssT0FBTCxDQUFhLEtBQWI7QUFDQSxpQkFBSyxJQUFMLENBQVUsT0FBVixHQUFvQixJQUFwQjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEdBQWxCOztBQUVBLGdCQUFHLEtBQUssVUFBUixFQUFvQixLQUFLLFVBQUwsR0FBcEIsS0FDSyxLQUFLLFFBQUw7QUFDTCxpQkFBSyxJQUFMLENBQVUsT0FBVjtBQUNEOzs7O0VBcEVpQixLQUFLLFVBQUwsQ0FBZ0IsUTs7QUF1RXBDLE9BQU8sT0FBUCxHQUFpQixLQUFqQjs7Ozs7Ozs7Ozs7OztBQy9FQTs7Ozs7Ozs7Ozs7OztJQWFNLE07OztBQUNKLG9CQUFZLEtBQVosRUFBbUIsR0FBbkIsRUFBd0I7QUFBQTs7QUFBQSxvSEFDaEIsS0FBSyxPQUFMLENBQWEsU0FBYixDQUF1QixRQUF2QixDQURnQjs7QUFHdEIsY0FBSyxJQUFMLEdBQVksTUFBTSxJQUFsQjtBQUNBLGNBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxjQUFLLEdBQUwsR0FBVyxHQUFYOztBQUVBLGNBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsRUFBaEIsRUFBb0IsQ0FBcEI7QUFDQSxjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsRUFBZjtBQUNBLGNBQUssQ0FBTCxHQUFTLE1BQUssSUFBTCxDQUFVLENBQVYsR0FBWSxDQUFaLEdBQWMsQ0FBdkI7QUFDQSxjQUFLLENBQUwsR0FBUyxNQUFLLElBQUwsQ0FBVSxDQUFWLEdBQVksTUFBSyxHQUFMLENBQVMsU0FBVCxHQUFtQixDQUF4Qzs7QUFFQSxjQUFLLE9BQUwsR0FBZSxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsT0FBZjtBQUNBLGNBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsRUFBQyxHQUFHLE1BQUssQ0FBVCxFQUFsQixFQUErQixFQUEvQixDQUFrQyxFQUFDLEdBQUcsTUFBSyxDQUFMLEdBQU8sRUFBWCxFQUFsQztBQUNBLGNBQUssT0FBTCxDQUFhLElBQWIsR0FBb0IsR0FBcEI7QUFDQSxjQUFLLE9BQUwsQ0FBYSxJQUFiLEdBQW9CLElBQXBCO0FBQ0EsY0FBSyxPQUFMLENBQWEsUUFBYixHQUF3QixJQUF4QjtBQUNBLGNBQUssT0FBTCxDQUFhLEtBQWI7O0FBRUEsY0FBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsY0FBSyxLQUFMLEdBQWEsTUFBSyxHQUFMLENBQVMsS0FBVCxJQUFrQixHQUEvQjtBQUNBLGNBQUssTUFBTCxHQUFjLEtBQWQ7O0FBRUEsY0FBSyxlQUFMLEdBQXVCLENBQXZCO0FBQ0EsY0FBSyxhQUFMLEdBQXFCLENBQXJCO0FBQ0EsY0FBSyxVQUFMLEdBQWtCLEtBQWxCO0FBekJzQjtBQTBCdkI7Ozs7aUNBQ1E7QUFDUCxnQkFBRyxLQUFLLE1BQUwsSUFBZSxLQUFLLFVBQXZCLEVBQW1DOztBQUVuQyxnQkFBSSxNQUFNLEtBQUssR0FBTCxDQUFTLGVBQVQsQ0FBeUIsRUFBQyxHQUFHLEtBQUssQ0FBVCxFQUFZLEdBQUcsS0FBSyxDQUFwQixFQUF6QixDQUFWO0FBQ0EsZ0JBQUcsT0FBTyxJQUFJLFFBQWQsRUFBd0I7QUFDdEIscUJBQUssSUFBTCxDQUFVLFdBQVYsRUFBdUIsR0FBdkI7O0FBRUEsb0JBQUcsSUFBSSxTQUFKLEtBQWtCLEtBQXJCLEVBQTRCLE9BQU8sS0FBSyxHQUFMLEVBQVA7QUFDNUIsb0JBQUcsSUFBSSxTQUFKLEtBQWtCLE1BQXJCLEVBQTZCLE9BQU8sS0FBSyxJQUFMLEVBQVA7QUFDN0Isb0JBQUcsSUFBSSxTQUFKLEtBQWtCLE9BQXJCLEVBQThCLE9BQU8sS0FBSyxLQUFMLEVBQVA7O0FBRTlCO0FBQ0Esb0JBQUksTUFBTSxLQUFLLEdBQUwsQ0FBUyxlQUFULENBQXlCLEVBQUMsR0FBRyxLQUFLLENBQVQsRUFBWSxHQUFHLEtBQUssQ0FBTCxHQUFPLEtBQUssR0FBTCxDQUFTLFNBQS9CLEVBQXpCLENBQVY7QUFDQSxvQkFBRyxPQUFPLElBQUksUUFBWCxJQUF1QixLQUFLLFFBQUwsS0FBa0IsUUFBNUMsRUFBc0QsT0FBTyxLQUFLLEdBQUwsRUFBUDs7QUFFdEQ7QUFDQSxvQkFBSSxPQUFPLEtBQUssR0FBTCxDQUFTLGVBQVQsQ0FBeUIsRUFBQyxHQUFHLEtBQUssQ0FBTCxHQUFPLEtBQUssR0FBTCxDQUFTLFNBQXBCLEVBQStCLEdBQUcsS0FBSyxDQUF2QyxFQUF6QixDQUFYO0FBQ0Esb0JBQUcsUUFBUSxLQUFLLFFBQWIsSUFBeUIsS0FBSyxRQUFMLEtBQWtCLE9BQTlDLEVBQXVELE9BQU8sS0FBSyxJQUFMLEVBQVA7O0FBRXZEO0FBQ0Esb0JBQUksUUFBUSxLQUFLLEdBQUwsQ0FBUyxlQUFULENBQXlCLEVBQUMsR0FBRyxLQUFLLENBQUwsR0FBTyxLQUFLLEdBQUwsQ0FBUyxTQUFwQixFQUErQixHQUFHLEtBQUssQ0FBdkMsRUFBekIsQ0FBWjtBQUNBLG9CQUFHLFNBQVMsTUFBTSxRQUFmLElBQTJCLEtBQUssUUFBTCxLQUFrQixNQUFoRCxFQUF3RCxPQUFPLEtBQUssS0FBTCxFQUFQOztBQUV4RDtBQUNBLHFCQUFLLEdBQUw7QUFDRCxhQXJCRCxNQXFCTyxLQUFLLElBQUw7O0FBRVAsaUJBQUssSUFBTCxDQUFVLE9BQVY7QUFDRDs7OytCQUNNO0FBQUE7O0FBQ0wsaUJBQUssT0FBTCxDQUFhLElBQWI7QUFDQSxpQkFBSyxNQUFMLEdBQWMsSUFBZDs7QUFFQSxnQkFBSSxPQUFPLEtBQUssWUFBTCxDQUFrQixXQUFsQixDQUE4QixLQUFLLEtBQW5DLENBQVg7QUFDQSxpQkFBSyxJQUFMLENBQVUsS0FBSyxLQUFmLEVBQXNCLEVBQXRCLENBQXlCLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxDQUFWLEVBQXpCO0FBQ0EsaUJBQUssSUFBTCxHQUFZLEdBQVo7QUFDQSxpQkFBSyxLQUFMO0FBQ0EsaUJBQUssRUFBTCxDQUFRLEtBQVIsRUFBZTtBQUFBLHVCQUFNLE9BQUssSUFBTCxDQUFVLFFBQVYsQ0FBTjtBQUFBLGFBQWY7QUFDRDs7O21DQUNVO0FBQUE7O0FBQ1QsZ0JBQUcsQ0FBQyxLQUFLLGFBQVQsRUFBd0I7O0FBRXhCLGdCQUFJLFdBQVcsS0FBSyxZQUFMLENBQWtCLFdBQWxCLENBQThCLElBQTlCLENBQWY7QUFDQSxxQkFBUyxJQUFULENBQWMsRUFBQyxPQUFPLEVBQVIsRUFBZCxFQUEyQixFQUEzQixDQUE4QixFQUFDLE9BQU8sQ0FBUixFQUE5QjtBQUNBLHFCQUFTLElBQVQsR0FBZ0IsS0FBSyxLQUFMLEdBQVcsS0FBSyxlQUFoQztBQUNBLHFCQUFTLEtBQVQ7O0FBRUEsaUJBQUssR0FBTCxDQUFTLFVBQVQsQ0FBb0IsS0FBSyxlQUF6QjtBQUNBLHFCQUFTLEVBQVQsQ0FBWSxLQUFaLEVBQW1CO0FBQUEsdUJBQU0sT0FBSyxVQUFMLEdBQWtCLEtBQXhCO0FBQUEsYUFBbkI7QUFDQSxpQkFBSyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsaUJBQUssUUFBTCxHQUFnQixLQUFoQjtBQUNBLGlCQUFLLGFBQUw7O0FBRUEsaUJBQUssSUFBTCxDQUFVLGdCQUFWO0FBQ0Q7Ozs4QkFDSztBQUNKLGlCQUFLLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxpQkFBSyxHQUFMLENBQVMsVUFBVCxDQUFvQixDQUFwQjs7QUFFQSxpQkFBSyxJQUFMLENBQVUsV0FBVjtBQUNEOzs7K0JBQ007QUFBQTs7QUFDTCxpQkFBSyxRQUFMLEdBQWdCLE1BQWhCO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBOEIsSUFBOUIsQ0FBWDtBQUNBLGlCQUFLLElBQUwsQ0FBVSxFQUFDLEdBQUcsS0FBSyxDQUFULEVBQVYsRUFBdUIsRUFBdkIsQ0FBMEIsRUFBQyxHQUFHLEtBQUssQ0FBTCxHQUFPLEtBQUssR0FBTCxDQUFTLFNBQWhCLEdBQTBCLEVBQTlCLEVBQTFCO0FBQ0EsaUJBQUssSUFBTCxHQUFZLEtBQUssS0FBTCxHQUFXLENBQXZCO0FBQ0EsaUJBQUssS0FBTDs7QUFFQSxpQkFBSyxFQUFMLENBQVEsS0FBUixFQUFlO0FBQUEsdUJBQU0sT0FBSyxNQUFMLEVBQU47QUFBQSxhQUFmO0FBQ0EsaUJBQUssSUFBTCxDQUFVLFlBQVY7QUFDRDs7O2dDQUNPO0FBQUE7O0FBQ04saUJBQUssUUFBTCxHQUFnQixPQUFoQjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxZQUFMLENBQWtCLFdBQWxCLENBQThCLElBQTlCLENBQVg7QUFDQSxpQkFBSyxJQUFMLENBQVUsRUFBQyxHQUFHLEtBQUssQ0FBVCxFQUFWLEVBQXVCLEVBQXZCLENBQTBCLEVBQUMsR0FBRyxLQUFLLENBQUwsR0FBTyxLQUFLLEdBQUwsQ0FBUyxTQUFoQixHQUEwQixFQUE5QixFQUExQjtBQUNBLGlCQUFLLElBQUwsR0FBWSxLQUFLLEtBQUwsR0FBVyxDQUF2QjtBQUNBLGlCQUFLLEtBQUw7O0FBRUEsaUJBQUssRUFBTCxDQUFRLEtBQVIsRUFBZTtBQUFBLHVCQUFNLE9BQUssTUFBTCxFQUFOO0FBQUEsYUFBZjtBQUNBLGlCQUFLLElBQUwsQ0FBVSxhQUFWO0FBQ0Q7Ozs7RUE1R2tCLEtBQUssTTs7QUErRzFCLE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7Ozs7Ozs7Ozs7OztJQzVITSxNOzs7QUFDSixrQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBR2pCLFVBQUssT0FBTCxHQUFlLElBQUksS0FBSyxTQUFMLENBQWUsT0FBbkIsUUFBaUMsQ0FBQyxLQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLFVBQXZCLENBQUQsQ0FBakMsRUFBdUUsUUFBUSxnQkFBUixDQUF2RSxDQUFmO0FBSGlCO0FBSWxCOzs7OzJCQUNNLEUsRUFBSTtBQUNULFdBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsS0FBRyxHQUF2QjtBQUNBLFdBQUssT0FBTCxDQUFhLElBQWIsR0FBb0IsSUFBcEI7QUFDRDs7OztFQVRrQixLQUFLLFM7O0FBWTFCLE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7Ozs7Ozs7Ozs7OztJQ1pNLEs7OztBQUNKLG1CQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFHakIsY0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLGNBQUssSUFBTCxHQUFZLE1BQU0sSUFBbEI7O0FBRUEsY0FBSyxNQUFMLEdBQWMsRUFBZDs7QUFFQSxjQUFLLGtCQUFMLEdBQTBCLElBQUksS0FBSyxNQUFULENBQWdCLEtBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsY0FBdkIsQ0FBaEIsQ0FBMUI7QUFDQSxjQUFLLGtCQUFMLENBQXdCLE9BQXhCLENBQWdDLFdBQWhDLENBQTRDLFFBQTVDLEdBQXVELEtBQUssVUFBTCxDQUFnQixNQUF2RTtBQUNBLGNBQU0sUUFBTixDQUFlLE1BQUssa0JBQXBCO0FBQ0EsY0FBSyxrQkFBTCxHQUEwQixJQUFJLEtBQUssT0FBTCxDQUFhLGtCQUFqQixDQUFvQyxNQUFLLGtCQUF6QyxDQUExQjs7QUFFQSxjQUFLLEtBQUwsR0FBYSxJQUFJLEtBQUssTUFBVCxDQUFnQixLQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLE9BQXZCLENBQWhCLENBQWI7QUFDQSxjQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQW1CLE1BQUssSUFBTCxDQUFVLENBQVYsR0FBWSxNQUFLLE1BQXBDO0FBQ0EsY0FBSyxLQUFMLENBQVcsQ0FBWCxHQUFlLE1BQUssSUFBTCxDQUFVLENBQVYsR0FBWSxNQUFLLEtBQUwsQ0FBVyxNQUF2QixHQUE4QixNQUFLLE1BQWxEO0FBQ0EsY0FBSyxLQUFMLENBQVcsQ0FBWCxHQUFlLENBQUMsTUFBSyxNQUFOLEdBQWEsQ0FBNUI7QUFDQSxjQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLENBQUMsTUFBSyxrQkFBTixDQUFyQjtBQUNBLGNBQU0sUUFBTixDQUFlLE1BQUssS0FBcEI7QUFsQmlCO0FBbUJsQjs7OztpQ0FDUTtBQUNQLGlCQUFLLGtCQUFMLENBQXdCLENBQXhCLElBQTZCLENBQTdCO0FBQ0EsaUJBQUssa0JBQUwsQ0FBd0IsQ0FBeEIsSUFBNkIsQ0FBN0I7QUFDRDs7OztFQXhCaUIsS0FBSyxTOztBQTJCekIsT0FBTyxPQUFQLEdBQWlCLEtBQWpCOzs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2xEQTs7Ozs7SUFLTSxxQjtBQUNKLGlDQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFNBQUssUUFBTCxHQUFnQixLQUFLLEdBQXJCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEVBQWhCOztBQUVBO0FBQ0EsU0FBSSxJQUFJLElBQUksQ0FBWixFQUFlLElBQUksS0FBSyxHQUFMLENBQVMsTUFBNUIsRUFBb0MsR0FBcEMsRUFBeUM7QUFDdkMsVUFBRyxDQUFDLENBQUMsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE9BQVosQ0FBb0IsR0FBcEIsQ0FBTCxFQUErQixLQUFLLFlBQUwsQ0FBa0IsS0FBSyxHQUFMLENBQVMsQ0FBVCxDQUFsQixFQUErQixDQUEvQixFQUEvQixLQUNLLEtBQUssUUFBTCxDQUFjLENBQWQsSUFBbUIsS0FBSyxHQUFMLENBQVMsQ0FBVCxDQUFuQjtBQUNOOztBQUVEO0FBQ0EsU0FBSyxJQUFMLElBQWEsS0FBSyxVQUFMLENBQWdCLEtBQUssSUFBckIsQ0FBYjtBQUNBLFNBQUssTUFBTCxJQUFlLEtBQUssWUFBTCxDQUFrQixLQUFLLE1BQXZCLENBQWY7QUFDQSxTQUFLLE9BQUwsSUFBZ0IsS0FBSyxPQUFMLEVBQWhCO0FBQ0Q7O0FBRUQ7QUFDQTs7Ozs7aUNBQ2EsRyxFQUFLLEMsRUFBRztBQUNuQixVQUFJLE1BQU0sSUFBSSxLQUFKLENBQVUsR0FBVixDQUFWO0FBQ0EsV0FBSyxRQUFMLENBQWMsQ0FBZCxJQUFtQixJQUFJLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFjLElBQUksTUFBN0IsQ0FBSixDQUFuQjtBQUNBLGFBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0E7Ozs7K0JBQ1csRyxFQUFLO0FBQ2QsV0FBSyxRQUFMLENBQWMsTUFBZCxHQUF1QixLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsTUFBaUIsS0FBSyxRQUFMLENBQWMsTUFBZCxHQUFxQixDQUFyQixHQUF5QixHQUExQyxJQUFpRCxHQUE1RCxDQUF2QjtBQUNBLGFBQU8sSUFBUDtBQUNEO0FBQ0Q7Ozs7OEJBQ1U7QUFDUixXQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxlQUFVLEtBQUssTUFBTCxLQUFnQixFQUFoQixHQUFxQixDQUFDLENBQXRCLEdBQTBCLENBQXBDO0FBQUEsT0FBbkI7QUFDQSxhQUFPLElBQVA7QUFDRDtBQUNEOzs7O2lDQUNhLEUsRUFBSTtBQUNmLFdBQUssUUFBTCxDQUFjLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFjLEtBQUssUUFBTCxDQUFjLE1BQXZDLENBQWQsSUFBZ0UsRUFBaEU7QUFDQSxhQUFPLElBQVA7QUFDRDs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLHFCQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1hZHZhbmNlZC1ibG9vbSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItYWR2YW5jZWQtYmxvb20gaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxyKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9yKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxyKTpyKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cIlxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gZmxvYXQgdGhyZXNob2xkO1xcblxcbnZvaWQgbWFpbigpIHtcXG4gICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIC8vIEEgc2ltcGxlICYgZmFzdCBhbGdvcml0aG0gZm9yIGdldHRpbmcgYnJpZ2h0bmVzcy5cXG4gICAgLy8gSXQncyBpbmFjY3VyYWN5ICwgYnV0IGdvb2QgZW5vdWdodCBmb3IgdGhpcyBmZWF0dXJlLlxcbiAgICBmbG9hdCBfbWF4ID0gbWF4KG1heChjb2xvci5yLCBjb2xvci5nKSwgY29sb3IuYik7XFxuICAgIGZsb2F0IF9taW4gPSBtaW4obWluKGNvbG9yLnIsIGNvbG9yLmcpLCBjb2xvci5iKTtcXG4gICAgZmxvYXQgYnJpZ2h0bmVzcyA9IChfbWF4ICsgX21pbikgKiAwLjU7XFxuXFxuICAgIGlmKGJyaWdodG5lc3MgPiB0aHJlc2hvbGQpIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAwLjApO1xcbiAgICB9XFxufVxcblwiLG89ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbyhvKXt2b2lkIDA9PT1vJiYobz0uNSksZS5jYWxsKHRoaXMscix0KSx0aGlzLnRocmVzaG9sZD1vfWUmJihvLl9fcHJvdG9fXz1lKSwoby5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW87dmFyIG49e3RocmVzaG9sZDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIG4udGhyZXNob2xkLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnRocmVzaG9sZH0sbi50aHJlc2hvbGQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudGhyZXNob2xkPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG8ucHJvdG90eXBlLG4pLG99KFBJWEkuRmlsdGVyKSxuPVwidW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgYmxvb21UZXh0dXJlO1xcbnVuaWZvcm0gZmxvYXQgYmxvb21TY2FsZTtcXG51bmlmb3JtIGZsb2F0IGJyaWdodG5lc3M7XFxuXFxudm9pZCBtYWluKCkge1xcbiAgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgY29sb3IucmdiICo9IGJyaWdodG5lc3M7XFxuICAgIHZlYzQgYmxvb21Db2xvciA9IHZlYzQodGV4dHVyZTJEKGJsb29tVGV4dHVyZSwgdlRleHR1cmVDb29yZCkucmdiLCAwLjApO1xcbiAgICBibG9vbUNvbG9yLnJnYiAqPSBibG9vbVNjYWxlO1xcbiAgICBnbF9GcmFnQ29sb3IgPSBjb2xvciArIGJsb29tQ29sb3I7XFxufVxcblwiLGk9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCh0KXtlLmNhbGwodGhpcyxyLG4pLFwibnVtYmVyXCI9PXR5cGVvZiB0JiYodD17dGhyZXNob2xkOnR9KSx0PU9iamVjdC5hc3NpZ24oe3RocmVzaG9sZDouNSxibG9vbVNjYWxlOjEsYnJpZ2h0bmVzczoxLGJsdXI6OCxxdWFsaXR5OjQscmVzb2x1dGlvbjpQSVhJLnNldHRpbmdzLlJFU09MVVRJT04sa2VybmVsU2l6ZTo1fSx0KSx0aGlzLmJsb29tU2NhbGU9dC5ibG9vbVNjYWxlLHRoaXMuYnJpZ2h0bmVzcz10LmJyaWdodG5lc3M7dmFyIGk9dC5ibHVyLGw9dC5xdWFsaXR5LHM9dC5yZXNvbHV0aW9uLHU9dC5rZXJuZWxTaXplLGE9UElYSS5maWx0ZXJzLGM9YS5CbHVyWEZpbHRlcixoPWEuQmx1cllGaWx0ZXI7dGhpcy5fZXh0cmFjdD1uZXcgbyh0LnRocmVzaG9sZCksdGhpcy5fYmx1clg9bmV3IGMoaSxsLHMsdSksdGhpcy5fYmx1clk9bmV3IGgoaSxsLHMsdSl9ZSYmKHQuX19wcm90b19fPWUpLCh0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9dDt2YXIgaT17dGhyZXNob2xkOntjb25maWd1cmFibGU6ITB9LGJsdXI6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiB0LnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHIsdCxvLG4pe3ZhciBpPWUuZ2V0UmVuZGVyVGFyZ2V0KCEwKTt0aGlzLl9leHRyYWN0LmFwcGx5KGUscixpLCEwLG4pLHRoaXMuX2JsdXJYLmFwcGx5KGUsaSxpLCEwLG4pLHRoaXMuX2JsdXJZLmFwcGx5KGUsaSxpLCEwLG4pLHRoaXMudW5pZm9ybXMuYmxvb21TY2FsZT10aGlzLmJsb29tU2NhbGUsdGhpcy51bmlmb3Jtcy5icmlnaHRuZXNzPXRoaXMuYnJpZ2h0bmVzcyx0aGlzLnVuaWZvcm1zLmJsb29tVGV4dHVyZT1pLGUuYXBwbHlGaWx0ZXIodGhpcyxyLHQsbyksZS5yZXR1cm5SZW5kZXJUYXJnZXQoaSl9LGkudGhyZXNob2xkLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9leHRyYWN0LnRocmVzaG9sZH0saS50aHJlc2hvbGQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2V4dHJhY3QudGhyZXNob2xkPWV9LGkuYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYmx1clguYmx1cn0saS5ibHVyLnNldD1mdW5jdGlvbihlKXt0aGlzLl9ibHVyWC5ibHVyPXRoaXMuX2JsdXJZLmJsdXI9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXModC5wcm90b3R5cGUsaSksdH0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5BZHZhbmNlZEJsb29tRmlsdGVyPWksZS5BZHZhbmNlZEJsb29tRmlsdGVyPWksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1hZHZhbmNlZC1ibG9vbS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWFzY2lpIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1hc2NpaSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP24oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG4pOm4oZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixvPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSBmbG9hdCBwaXhlbFNpemU7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudmVjMiBtYXBDb29yZCggdmVjMiBjb29yZCApXFxue1xcbiAgICBjb29yZCAqPSBmaWx0ZXJBcmVhLnh5O1xcbiAgICBjb29yZCArPSBmaWx0ZXJBcmVhLnp3O1xcblxcbiAgICByZXR1cm4gY29vcmQ7XFxufVxcblxcbnZlYzIgdW5tYXBDb29yZCggdmVjMiBjb29yZCApXFxue1xcbiAgICBjb29yZCAtPSBmaWx0ZXJBcmVhLnp3O1xcbiAgICBjb29yZCAvPSBmaWx0ZXJBcmVhLnh5O1xcblxcbiAgICByZXR1cm4gY29vcmQ7XFxufVxcblxcbnZlYzIgcGl4ZWxhdGUodmVjMiBjb29yZCwgdmVjMiBzaXplKVxcbntcXG4gICAgcmV0dXJuIGZsb29yKCBjb29yZCAvIHNpemUgKSAqIHNpemU7XFxufVxcblxcbnZlYzIgZ2V0TW9kKHZlYzIgY29vcmQsIHZlYzIgc2l6ZSlcXG57XFxuICAgIHJldHVybiBtb2QoIGNvb3JkICwgc2l6ZSkgLyBzaXplO1xcbn1cXG5cXG5mbG9hdCBjaGFyYWN0ZXIoZmxvYXQgbiwgdmVjMiBwKVxcbntcXG4gICAgcCA9IGZsb29yKHAqdmVjMig0LjAsIC00LjApICsgMi41KTtcXG4gICAgaWYgKGNsYW1wKHAueCwgMC4wLCA0LjApID09IHAueCAmJiBjbGFtcChwLnksIDAuMCwgNC4wKSA9PSBwLnkpXFxuICAgIHtcXG4gICAgICAgIGlmIChpbnQobW9kKG4vZXhwMihwLnggKyA1LjAqcC55KSwgMi4wKSkgPT0gMSkgcmV0dXJuIDEuMDtcXG4gICAgfVxcbiAgICByZXR1cm4gMC4wO1xcbn1cXG5cXG52b2lkIG1haW4oKVxcbntcXG4gICAgdmVjMiBjb29yZCA9IG1hcENvb3JkKHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICAvLyBnZXQgdGhlIHJvdW5kZWQgY29sb3IuLlxcbiAgICB2ZWMyIHBpeENvb3JkID0gcGl4ZWxhdGUoY29vcmQsIHZlYzIocGl4ZWxTaXplKSk7XFxuICAgIHBpeENvb3JkID0gdW5tYXBDb29yZChwaXhDb29yZCk7XFxuXFxuICAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHBpeENvb3JkKTtcXG5cXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBjaGFyYWN0ZXIgdG8gdXNlXFxuICAgIGZsb2F0IGdyYXkgPSAoY29sb3IuciArIGNvbG9yLmcgKyBjb2xvci5iKSAvIDMuMDtcXG5cXG4gICAgZmxvYXQgbiA9ICA2NTUzNi4wOyAgICAgICAgICAgICAvLyAuXFxuICAgIGlmIChncmF5ID4gMC4yKSBuID0gNjU2MDAuMDsgICAgLy8gOlxcbiAgICBpZiAoZ3JheSA+IDAuMykgbiA9IDMzMjc3Mi4wOyAgIC8vICpcXG4gICAgaWYgKGdyYXkgPiAwLjQpIG4gPSAxNTI1NTA4Ni4wOyAvLyBvXFxuICAgIGlmIChncmF5ID4gMC41KSBuID0gMjMzODUxNjQuMDsgLy8gJlxcbiAgICBpZiAoZ3JheSA+IDAuNikgbiA9IDE1MjUyMDE0LjA7IC8vIDhcXG4gICAgaWYgKGdyYXkgPiAwLjcpIG4gPSAxMzE5OTQ1Mi4wOyAvLyBAXFxuICAgIGlmIChncmF5ID4gMC44KSBuID0gMTE1MTI4MTAuMDsgLy8gI1xcblxcbiAgICAvLyBnZXQgdGhlIG1vZC4uXFxuICAgIHZlYzIgbW9kZCA9IGdldE1vZChjb29yZCwgdmVjMihwaXhlbFNpemUpKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiBjaGFyYWN0ZXIoIG4sIHZlYzIoLTEuMCkgKyBtb2RkICogMi4wKTtcXG5cXG59XCIscj1mdW5jdGlvbihlKXtmdW5jdGlvbiByKHIpe3ZvaWQgMD09PXImJihyPTgpLGUuY2FsbCh0aGlzLG4sbyksdGhpcy5zaXplPXJ9ZSYmKHIuX19wcm90b19fPWUpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgaT17c2l6ZTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkuc2l6ZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5waXhlbFNpemV9LGkuc2l6ZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5waXhlbFNpemU9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsaSkscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Bc2NpaUZpbHRlcj1yLGUuQXNjaWlGaWx0ZXI9cixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWFzY2lpLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItYmxvb20gLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWJsb29tIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKHQscil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/cihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0scik6cih0Ll9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciByPVBJWEkuZmlsdGVycyxlPXIuQmx1clhGaWx0ZXIsaT1yLkJsdXJZRmlsdGVyLGw9ci5BbHBoYUZpbHRlcix1PWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIHIocix1LG4sbyl7dm9pZCAwPT09ciYmKHI9Miksdm9pZCAwPT09dSYmKHU9NCksdm9pZCAwPT09biYmKG49UElYSS5zZXR0aW5ncy5SRVNPTFVUSU9OKSx2b2lkIDA9PT1vJiYobz01KSx0LmNhbGwodGhpcyk7dmFyIGIscztcIm51bWJlclwiPT10eXBlb2Ygcj8oYj1yLHM9cik6ciBpbnN0YW5jZW9mIFBJWEkuUG9pbnQ/KGI9ci54LHM9ci55KTpBcnJheS5pc0FycmF5KHIpJiYoYj1yWzBdLHM9clsxXSksdGhpcy5ibHVyWEZpbHRlcj1uZXcgZShiLHUsbixvKSx0aGlzLmJsdXJZRmlsdGVyPW5ldyBpKHMsdSxuLG8pLHRoaXMuYmx1cllGaWx0ZXIuYmxlbmRNb2RlPVBJWEkuQkxFTkRfTU9ERVMuU0NSRUVOLHRoaXMuZGVmYXVsdEZpbHRlcj1uZXcgbH10JiYoci5fX3Byb3RvX189dCksKHIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1yO3ZhciB1PXtibHVyOntjb25maWd1cmFibGU6ITB9LGJsdXJYOntjb25maWd1cmFibGU6ITB9LGJsdXJZOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24odCxyLGUpe3ZhciBpPXQuZ2V0UmVuZGVyVGFyZ2V0KCEwKTt0aGlzLmRlZmF1bHRGaWx0ZXIuYXBwbHkodCxyLGUpLHRoaXMuYmx1clhGaWx0ZXIuYXBwbHkodCxyLGkpLHRoaXMuYmx1cllGaWx0ZXIuYXBwbHkodCxpLGUpLHQucmV0dXJuUmVuZGVyVGFyZ2V0KGkpfSx1LmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1clhGaWx0ZXIuYmx1cn0sdS5ibHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLmJsdXJYRmlsdGVyLmJsdXI9dGhpcy5ibHVyWUZpbHRlci5ibHVyPXR9LHUuYmx1clguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1clhGaWx0ZXIuYmx1cn0sdS5ibHVyWC5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5ibHVyWEZpbHRlci5ibHVyPXR9LHUuYmx1clkuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1cllGaWx0ZXIuYmx1cn0sdS5ibHVyWS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5ibHVyWUZpbHRlci5ibHVyPXR9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHIucHJvdG90eXBlLHUpLHJ9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQmxvb21GaWx0ZXI9dSx0LkJsb29tRmlsdGVyPXUsT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1ibG9vbS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWJ1bGdlLXBpbmNoIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1idWxnZS1waW5jaCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP24oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG4pOm4oZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwidW5pZm9ybSBmbG9hdCByYWRpdXM7XFxudW5pZm9ybSBmbG9hdCBzdHJlbmd0aDtcXG51bmlmb3JtIHZlYzIgY2VudGVyO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJDbGFtcDtcXG51bmlmb3JtIHZlYzIgZGltZW5zaW9ucztcXG5cXG52b2lkIG1haW4oKVxcbntcXG4gICAgdmVjMiBjb29yZCA9IHZUZXh0dXJlQ29vcmQgKiBmaWx0ZXJBcmVhLnh5O1xcbiAgICBjb29yZCAtPSBjZW50ZXIgKiBkaW1lbnNpb25zLnh5O1xcbiAgICBmbG9hdCBkaXN0YW5jZSA9IGxlbmd0aChjb29yZCk7XFxuICAgIGlmIChkaXN0YW5jZSA8IHJhZGl1cykge1xcbiAgICAgICAgZmxvYXQgcGVyY2VudCA9IGRpc3RhbmNlIC8gcmFkaXVzO1xcbiAgICAgICAgaWYgKHN0cmVuZ3RoID4gMC4wKSB7XFxuICAgICAgICAgICAgY29vcmQgKj0gbWl4KDEuMCwgc21vb3Roc3RlcCgwLjAsIHJhZGl1cyAvIGRpc3RhbmNlLCBwZXJjZW50KSwgc3RyZW5ndGggKiAwLjc1KTtcXG4gICAgICAgIH0gZWxzZSB7XFxuICAgICAgICAgICAgY29vcmQgKj0gbWl4KDEuMCwgcG93KHBlcmNlbnQsIDEuMCArIHN0cmVuZ3RoICogMC43NSkgKiByYWRpdXMgLyBkaXN0YW5jZSwgMS4wIC0gcGVyY2VudCk7XFxuICAgICAgICB9XFxuICAgIH1cXG4gICAgY29vcmQgKz0gY2VudGVyICogZGltZW5zaW9ucy54eTtcXG4gICAgY29vcmQgLz0gZmlsdGVyQXJlYS54eTtcXG4gICAgdmVjMiBjbGFtcGVkQ29vcmQgPSBjbGFtcChjb29yZCwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjbGFtcGVkQ29vcmQpO1xcbiAgICBpZiAoY29vcmQgIT0gY2xhbXBlZENvb3JkKSB7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgKj0gbWF4KDAuMCwgMS4wIC0gbGVuZ3RoKGNvb3JkIC0gY2xhbXBlZENvb3JkKSk7XFxuICAgIH1cXG59XFxuXCIscj1mdW5jdGlvbihlKXtmdW5jdGlvbiByKHIsbyxpKXtlLmNhbGwodGhpcyxuLHQpLHRoaXMuY2VudGVyPXJ8fFsuNSwuNV0sdGhpcy5yYWRpdXM9b3x8MTAwLHRoaXMuc3RyZW5ndGg9aXx8MX1lJiYoci5fX3Byb3RvX189ZSksKHIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1yO3ZhciBvPXtyYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH0sc3RyZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH0sY2VudGVyOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSxuLHQscil7dGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzBdPW4uc291cmNlRnJhbWUud2lkdGgsdGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzFdPW4uc291cmNlRnJhbWUuaGVpZ2h0LGUuYXBwbHlGaWx0ZXIodGhpcyxuLHQscil9LG8ucmFkaXVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnJhZGl1c30sby5yYWRpdXMuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMucmFkaXVzPWV9LG8uc3RyZW5ndGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc3RyZW5ndGh9LG8uc3RyZW5ndGguc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuc3RyZW5ndGg9ZX0sby5jZW50ZXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuY2VudGVyfSxvLmNlbnRlci5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5jZW50ZXI9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoci5wcm90b3R5cGUsbykscn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5CdWxnZVBpbmNoRmlsdGVyPXIsZS5CdWxnZVBpbmNoRmlsdGVyPXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1idWxnZS1waW5jaC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWNvbG9yLXJlcGxhY2UgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWNvbG9yLXJlcGxhY2UgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obyxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKG8uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHRleHR1cmU7XFxudW5pZm9ybSB2ZWMzIG9yaWdpbmFsQ29sb3I7XFxudW5pZm9ybSB2ZWMzIG5ld0NvbG9yO1xcbnVuaWZvcm0gZmxvYXQgZXBzaWxvbjtcXG52b2lkIG1haW4odm9pZCkge1xcbiAgICB2ZWM0IGN1cnJlbnRDb2xvciA9IHRleHR1cmUyRCh0ZXh0dXJlLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjMyBjb2xvckRpZmYgPSBvcmlnaW5hbENvbG9yIC0gKGN1cnJlbnRDb2xvci5yZ2IgLyBtYXgoY3VycmVudENvbG9yLmEsIDAuMDAwMDAwMDAwMSkpO1xcbiAgICBmbG9hdCBjb2xvckRpc3RhbmNlID0gbGVuZ3RoKGNvbG9yRGlmZik7XFxuICAgIGZsb2F0IGRvUmVwbGFjZSA9IHN0ZXAoY29sb3JEaXN0YW5jZSwgZXBzaWxvbik7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQobWl4KGN1cnJlbnRDb2xvci5yZ2IsIChuZXdDb2xvciArIGNvbG9yRGlmZikgKiBjdXJyZW50Q29sb3IuYSwgZG9SZXBsYWNlKSwgY3VycmVudENvbG9yLmEpO1xcbn1cXG5cIixuPWZ1bmN0aW9uKG8pe2Z1bmN0aW9uIG4obixpLHQpe3ZvaWQgMD09PW4mJihuPTE2NzExNjgwKSx2b2lkIDA9PT1pJiYoaT0wKSx2b2lkIDA9PT10JiYodD0uNCksby5jYWxsKHRoaXMsZSxyKSx0aGlzLm9yaWdpbmFsQ29sb3I9bix0aGlzLm5ld0NvbG9yPWksdGhpcy5lcHNpbG9uPXR9byYmKG4uX19wcm90b19fPW8pLChuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG8mJm8ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bjt2YXIgaT17b3JpZ2luYWxDb2xvcjp7Y29uZmlndXJhYmxlOiEwfSxuZXdDb2xvcjp7Y29uZmlndXJhYmxlOiEwfSxlcHNpbG9uOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5vcmlnaW5hbENvbG9yLnNldD1mdW5jdGlvbihvKXt2YXIgZT10aGlzLnVuaWZvcm1zLm9yaWdpbmFsQ29sb3I7XCJudW1iZXJcIj09dHlwZW9mIG8/KFBJWEkudXRpbHMuaGV4MnJnYihvLGUpLHRoaXMuX29yaWdpbmFsQ29sb3I9byk6KGVbMF09b1swXSxlWzFdPW9bMV0sZVsyXT1vWzJdLHRoaXMuX29yaWdpbmFsQ29sb3I9UElYSS51dGlscy5yZ2IyaGV4KGUpKX0saS5vcmlnaW5hbENvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9vcmlnaW5hbENvbG9yfSxpLm5ld0NvbG9yLnNldD1mdW5jdGlvbihvKXt2YXIgZT10aGlzLnVuaWZvcm1zLm5ld0NvbG9yO1wibnVtYmVyXCI9PXR5cGVvZiBvPyhQSVhJLnV0aWxzLmhleDJyZ2IobyxlKSx0aGlzLl9uZXdDb2xvcj1vKTooZVswXT1vWzBdLGVbMV09b1sxXSxlWzJdPW9bMl0sdGhpcy5fbmV3Q29sb3I9UElYSS51dGlscy5yZ2IyaGV4KGUpKX0saS5uZXdDb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbmV3Q29sb3J9LGkuZXBzaWxvbi5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5lcHNpbG9uPW99LGkuZXBzaWxvbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5lcHNpbG9ufSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxpKSxufShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkNvbG9yUmVwbGFjZUZpbHRlcj1uLG8uQ29sb3JSZXBsYWNlRmlsdGVyPW4sT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1jb2xvci1yZXBsYWNlLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItY29udm9sdXRpb24gLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWNvbnZvbHV0aW9uIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciB0PVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjMiB0ZXhlbFNpemU7XFxudW5pZm9ybSBmbG9hdCBtYXRyaXhbOV07XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgIHZlYzQgYzExID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkIC0gdGV4ZWxTaXplKTsgLy8gdG9wIGxlZnRcXG4gICB2ZWM0IGMxMiA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLngsIHZUZXh0dXJlQ29vcmQueSAtIHRleGVsU2l6ZS55KSk7IC8vIHRvcCBjZW50ZXJcXG4gICB2ZWM0IGMxMyA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggKyB0ZXhlbFNpemUueCwgdlRleHR1cmVDb29yZC55IC0gdGV4ZWxTaXplLnkpKTsgLy8gdG9wIHJpZ2h0XFxuXFxuICAgdmVjNCBjMjEgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54IC0gdGV4ZWxTaXplLngsIHZUZXh0dXJlQ29vcmQueSkpOyAvLyBtaWQgbGVmdFxcbiAgIHZlYzQgYzIyID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTsgLy8gbWlkIGNlbnRlclxcbiAgIHZlYzQgYzIzID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCArIHRleGVsU2l6ZS54LCB2VGV4dHVyZUNvb3JkLnkpKTsgLy8gbWlkIHJpZ2h0XFxuXFxuICAgdmVjNCBjMzEgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54IC0gdGV4ZWxTaXplLngsIHZUZXh0dXJlQ29vcmQueSArIHRleGVsU2l6ZS55KSk7IC8vIGJvdHRvbSBsZWZ0XFxuICAgdmVjNCBjMzIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgKyB0ZXhlbFNpemUueSkpOyAvLyBib3R0b20gY2VudGVyXFxuICAgdmVjNCBjMzMgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyB0ZXhlbFNpemUpOyAvLyBib3R0b20gcmlnaHRcXG5cXG4gICBnbF9GcmFnQ29sb3IgPVxcbiAgICAgICBjMTEgKiBtYXRyaXhbMF0gKyBjMTIgKiBtYXRyaXhbMV0gKyBjMTMgKiBtYXRyaXhbMl0gK1xcbiAgICAgICBjMjEgKiBtYXRyaXhbM10gKyBjMjIgKiBtYXRyaXhbNF0gKyBjMjMgKiBtYXRyaXhbNV0gK1xcbiAgICAgICBjMzEgKiBtYXRyaXhbNl0gKyBjMzIgKiBtYXRyaXhbN10gKyBjMzMgKiBtYXRyaXhbOF07XFxuXFxuICAgZ2xfRnJhZ0NvbG9yLmEgPSBjMjIuYTtcXG59XFxuXCIsbz1mdW5jdGlvbihlKXtmdW5jdGlvbiBvKG8saSxuKXtlLmNhbGwodGhpcyx0LHIpLHRoaXMubWF0cml4PW8sdGhpcy53aWR0aD1pLHRoaXMuaGVpZ2h0PW59ZSYmKG8uX19wcm90b19fPWUpLChvLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bzt2YXIgaT17bWF0cml4Ontjb25maWd1cmFibGU6ITB9LHdpZHRoOntjb25maWd1cmFibGU6ITB9LGhlaWdodDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkubWF0cml4LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLm1hdHJpeH0saS5tYXRyaXguc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMubWF0cml4PW5ldyBGbG9hdDMyQXJyYXkoZSl9LGkud2lkdGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIDEvdGhpcy51bmlmb3Jtcy50ZXhlbFNpemVbMF19LGkud2lkdGguc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudGV4ZWxTaXplWzBdPTEvZX0saS5oZWlnaHQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIDEvdGhpcy51bmlmb3Jtcy50ZXhlbFNpemVbMV19LGkuaGVpZ2h0LnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnRleGVsU2l6ZVsxXT0xL2V9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG8ucHJvdG90eXBlLGkpLG99KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQ29udm9sdXRpb25GaWx0ZXI9byxlLkNvbnZvbHV0aW9uRmlsdGVyPW8sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1jb252b2x1dGlvbi5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWNyb3NzLWhhdGNoIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1jcm9zcy1oYXRjaCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihvLG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP24oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG4pOm4oby5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihvKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBmbG9hdCBsdW0gPSBsZW5ndGgodGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkLnh5KS5yZ2IpO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDEuMCwgMS4wLCAxLjAsIDEuMCk7XFxuXFxuICAgIGlmIChsdW0gPCAxLjAwKVxcbiAgICB7XFxuICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54ICsgZ2xfRnJhZ0Nvb3JkLnksIDEwLjApID09IDAuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgaWYgKGx1bSA8IDAuNzUpXFxuICAgIHtcXG4gICAgICAgIGlmIChtb2QoZ2xfRnJhZ0Nvb3JkLnggLSBnbF9GcmFnQ29vcmQueSwgMTAuMCkgPT0gMC4wKVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBpZiAobHVtIDwgMC41MClcXG4gICAge1xcbiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCArIGdsX0ZyYWdDb29yZC55IC0gNS4wLCAxMC4wKSA9PSAwLjApXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAxLjApO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIGlmIChsdW0gPCAwLjMpXFxuICAgIHtcXG4gICAgICAgIGlmIChtb2QoZ2xfRnJhZ0Nvb3JkLnggLSBnbF9GcmFnQ29vcmQueSAtIDUuMCwgMTAuMCkgPT0gMC4wKVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcXG4gICAgICAgIH1cXG4gICAgfVxcbn1cXG5cIixlPWZ1bmN0aW9uKG8pe2Z1bmN0aW9uIGUoKXtvLmNhbGwodGhpcyxuLHIpfXJldHVybiBvJiYoZS5fX3Byb3RvX189byksZS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShvJiZvLnByb3RvdHlwZSksZS5wcm90b3R5cGUuY29uc3RydWN0b3I9ZSxlfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkNyb3NzSGF0Y2hGaWx0ZXI9ZSxvLkNyb3NzSGF0Y2hGaWx0ZXI9ZSxPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWNyb3NzLWhhdGNoLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItZG90IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1kb3QgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxuXFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSBmbG9hdCBhbmdsZTtcXG51bmlmb3JtIGZsb2F0IHNjYWxlO1xcblxcbmZsb2F0IHBhdHRlcm4oKVxcbntcXG4gICBmbG9hdCBzID0gc2luKGFuZ2xlKSwgYyA9IGNvcyhhbmdsZSk7XFxuICAgdmVjMiB0ZXggPSB2VGV4dHVyZUNvb3JkICogZmlsdGVyQXJlYS54eTtcXG4gICB2ZWMyIHBvaW50ID0gdmVjMihcXG4gICAgICAgYyAqIHRleC54IC0gcyAqIHRleC55LFxcbiAgICAgICBzICogdGV4LnggKyBjICogdGV4LnlcXG4gICApICogc2NhbGU7XFxuICAgcmV0dXJuIChzaW4ocG9pbnQueCkgKiBzaW4ocG9pbnQueSkpICogNC4wO1xcbn1cXG5cXG52b2lkIG1haW4oKVxcbntcXG4gICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICBmbG9hdCBhdmVyYWdlID0gKGNvbG9yLnIgKyBjb2xvci5nICsgY29sb3IuYikgLyAzLjA7XFxuICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2ZWMzKGF2ZXJhZ2UgKiAxMC4wIC0gNS4wICsgcGF0dGVybigpKSwgY29sb3IuYSk7XFxufVxcblwiLG89ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbyhvLHIpe3ZvaWQgMD09PW8mJihvPTEpLHZvaWQgMD09PXImJihyPTUpLGUuY2FsbCh0aGlzLG4sdCksdGhpcy5zY2FsZT1vLHRoaXMuYW5nbGU9cn1lJiYoby5fX3Byb3RvX189ZSksKG8ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1vO3ZhciByPXtzY2FsZTp7Y29uZmlndXJhYmxlOiEwfSxhbmdsZTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIuc2NhbGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2NhbGV9LHIuc2NhbGUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuc2NhbGU9ZX0sci5hbmdsZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbmdsZX0sci5hbmdsZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5hbmdsZT1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvLnByb3RvdHlwZSxyKSxvfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkRvdEZpbHRlcj1vLGUuRG90RmlsdGVyPW8sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1kb3QuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1kcm9wLXNoYWRvdyAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKHQuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYWxwaGE7XFxudW5pZm9ybSB2ZWMzIGNvbG9yO1xcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICAvLyBVbi1wcmVtdWx0aXBseSBhbHBoYSBiZWZvcmUgYXBwbHlpbmcgdGhlIGNvbG9yXFxuICAgIGlmIChzYW1wbGUuYSA+IDAuMCkge1xcbiAgICAgICAgc2FtcGxlLnJnYiAvPSBzYW1wbGUuYTtcXG4gICAgfVxcblxcbiAgICAvLyBQcmVtdWx0aXBseSBhbHBoYSBhZ2FpblxcbiAgICBzYW1wbGUucmdiID0gY29sb3IucmdiICogc2FtcGxlLmE7XFxuXFxuICAgIC8vIGFscGhhIHVzZXIgYWxwaGFcXG4gICAgc2FtcGxlICo9IGFscGhhO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBzYW1wbGU7XFxufVwiLGk9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaShpLG4sbyxhLGwpe3ZvaWQgMD09PWkmJihpPTQ1KSx2b2lkIDA9PT1uJiYobj01KSx2b2lkIDA9PT1vJiYobz0yKSx2b2lkIDA9PT1hJiYoYT0wKSx2b2lkIDA9PT1sJiYobD0uNSksdC5jYWxsKHRoaXMpLHRoaXMudGludEZpbHRlcj1uZXcgUElYSS5GaWx0ZXIoZSxyKSx0aGlzLmJsdXJGaWx0ZXI9bmV3IFBJWEkuZmlsdGVycy5CbHVyRmlsdGVyLHRoaXMuYmx1ckZpbHRlci5ibHVyPW8sdGhpcy50YXJnZXRUcmFuc2Zvcm09bmV3IFBJWEkuTWF0cml4LHRoaXMucm90YXRpb249aSx0aGlzLnBhZGRpbmc9bix0aGlzLmRpc3RhbmNlPW4sdGhpcy5hbHBoYT1sLHRoaXMuY29sb3I9YX10JiYoaS5fX3Byb3RvX189dCksKGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1pO3ZhciBuPXtkaXN0YW5jZTp7Y29uZmlndXJhYmxlOiEwfSxyb3RhdGlvbjp7Y29uZmlndXJhYmxlOiEwfSxibHVyOntjb25maWd1cmFibGU6ITB9LGFscGhhOntjb25maWd1cmFibGU6ITB9LGNvbG9yOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24odCxlLHIsaSl7dmFyIG49dC5nZXRSZW5kZXJUYXJnZXQoKTtuLnRyYW5zZm9ybT10aGlzLnRhcmdldFRyYW5zZm9ybSx0aGlzLnRpbnRGaWx0ZXIuYXBwbHkodCxlLG4sITApLHRoaXMuYmx1ckZpbHRlci5hcHBseSh0LG4sciksdC5hcHBseUZpbHRlcih0aGlzLGUscixpKSxuLnRyYW5zZm9ybT1udWxsLHQucmV0dXJuUmVuZGVyVGFyZ2V0KG4pfSxpLnByb3RvdHlwZS5fdXBkYXRlUGFkZGluZz1mdW5jdGlvbigpe3RoaXMucGFkZGluZz10aGlzLmRpc3RhbmNlKzIqdGhpcy5ibHVyfSxpLnByb3RvdHlwZS5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtPWZ1bmN0aW9uKCl7dGhpcy50YXJnZXRUcmFuc2Zvcm0udHg9dGhpcy5kaXN0YW5jZSpNYXRoLmNvcyh0aGlzLmFuZ2xlKSx0aGlzLnRhcmdldFRyYW5zZm9ybS50eT10aGlzLmRpc3RhbmNlKk1hdGguc2luKHRoaXMuYW5nbGUpfSxuLmRpc3RhbmNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9kaXN0YW5jZX0sbi5kaXN0YW5jZS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5fZGlzdGFuY2U9dCx0aGlzLl91cGRhdGVQYWRkaW5nKCksdGhpcy5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtKCl9LG4ucm90YXRpb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYW5nbGUvUElYSS5ERUdfVE9fUkFEfSxuLnJvdGF0aW9uLnNldD1mdW5jdGlvbih0KXt0aGlzLmFuZ2xlPXQqUElYSS5ERUdfVE9fUkFELHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxuLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1ckZpbHRlci5ibHVyfSxuLmJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1ckZpbHRlci5ibHVyPXQsdGhpcy5fdXBkYXRlUGFkZGluZygpfSxuLmFscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuYWxwaGF9LG4uYWxwaGEuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGludEZpbHRlci51bmlmb3Jtcy5hbHBoYT10fSxuLmNvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiBQSVhJLnV0aWxzLnJnYjJoZXgodGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sbi5jb2xvci5zZXQ9ZnVuY3Rpb24odCl7UElYSS51dGlscy5oZXgycmdiKHQsdGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaS5wcm90b3R5cGUsbiksaX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Ecm9wU2hhZG93RmlsdGVyPWksdC5Ecm9wU2hhZG93RmlsdGVyPWksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1kcm9wLXNoYWRvdy5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWVtYm9zcyAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItZW1ib3NzIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciB0PVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IHN0cmVuZ3RoO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG5cXHR2ZWMyIG9uZVBpeGVsID0gdmVjMigxLjAgLyBmaWx0ZXJBcmVhKTtcXG5cXG5cXHR2ZWM0IGNvbG9yO1xcblxcblxcdGNvbG9yLnJnYiA9IHZlYzMoMC41KTtcXG5cXG5cXHRjb2xvciAtPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgLSBvbmVQaXhlbCkgKiBzdHJlbmd0aDtcXG5cXHRjb2xvciArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBvbmVQaXhlbCkgKiBzdHJlbmd0aDtcXG5cXG5cXHRjb2xvci5yZ2IgPSB2ZWMzKChjb2xvci5yICsgY29sb3IuZyArIGNvbG9yLmIpIC8gMy4wKTtcXG5cXG5cXHRmbG9hdCBhbHBoYSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkuYTtcXG5cXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiAqIGFscGhhLCBhbHBoYSk7XFxufVxcblwiLG89ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbyhvKXt2b2lkIDA9PT1vJiYobz01KSxlLmNhbGwodGhpcyx0LHIpLHRoaXMuc3RyZW5ndGg9b31lJiYoby5fX3Byb3RvX189ZSksKG8ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1vO3ZhciBuPXtzdHJlbmd0aDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIG4uc3RyZW5ndGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc3RyZW5ndGh9LG4uc3RyZW5ndGguc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuc3RyZW5ndGg9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoby5wcm90b3R5cGUsbiksb30oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5FbWJvc3NGaWx0ZXI9byxlLkVtYm9zc0ZpbHRlcj1vLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZW1ib3NzLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItZ2xvdyAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItZ2xvdyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihvLG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP24oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG4pOm4oby5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihvKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIGZsb2F0IGRpc3RhbmNlO1xcbnVuaWZvcm0gZmxvYXQgb3V0ZXJTdHJlbmd0aDtcXG51bmlmb3JtIGZsb2F0IGlubmVyU3RyZW5ndGg7XFxudW5pZm9ybSB2ZWM0IGdsb3dDb2xvcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxudmVjMiBweCA9IHZlYzIoMS4wIC8gZmlsdGVyQXJlYS54LCAxLjAgLyBmaWx0ZXJBcmVhLnkpO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIGNvbnN0IGZsb2F0IFBJID0gMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDtcXG4gICAgdmVjNCBvd25Db2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzQgY3VyQ29sb3I7XFxuICAgIGZsb2F0IHRvdGFsQWxwaGEgPSAwLjA7XFxuICAgIGZsb2F0IG1heFRvdGFsQWxwaGEgPSAwLjA7XFxuICAgIGZsb2F0IGNvc0FuZ2xlO1xcbiAgICBmbG9hdCBzaW5BbmdsZTtcXG4gICAgdmVjMiBkaXNwbGFjZWQ7XFxuICAgIGZvciAoZmxvYXQgYW5nbGUgPSAwLjA7IGFuZ2xlIDw9IFBJICogMi4wOyBhbmdsZSArPSAlUVVBTElUWV9ESVNUJSkge1xcbiAgICAgICBjb3NBbmdsZSA9IGNvcyhhbmdsZSk7XFxuICAgICAgIHNpbkFuZ2xlID0gc2luKGFuZ2xlKTtcXG4gICAgICAgZm9yIChmbG9hdCBjdXJEaXN0YW5jZSA9IDEuMDsgY3VyRGlzdGFuY2UgPD0gJURJU1QlOyBjdXJEaXN0YW5jZSsrKSB7XFxuICAgICAgICAgICBkaXNwbGFjZWQueCA9IHZUZXh0dXJlQ29vcmQueCArIGNvc0FuZ2xlICogY3VyRGlzdGFuY2UgKiBweC54O1xcbiAgICAgICAgICAgZGlzcGxhY2VkLnkgPSB2VGV4dHVyZUNvb3JkLnkgKyBzaW5BbmdsZSAqIGN1ckRpc3RhbmNlICogcHgueTtcXG4gICAgICAgICAgIGN1ckNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjbGFtcChkaXNwbGFjZWQsIGZpbHRlckNsYW1wLnh5LCBmaWx0ZXJDbGFtcC56dykpO1xcbiAgICAgICAgICAgdG90YWxBbHBoYSArPSAoZGlzdGFuY2UgLSBjdXJEaXN0YW5jZSkgKiBjdXJDb2xvci5hO1xcbiAgICAgICAgICAgbWF4VG90YWxBbHBoYSArPSAoZGlzdGFuY2UgLSBjdXJEaXN0YW5jZSk7XFxuICAgICAgIH1cXG4gICAgfVxcbiAgICBtYXhUb3RhbEFscGhhID0gbWF4KG1heFRvdGFsQWxwaGEsIDAuMDAwMSk7XFxuXFxuICAgIG93bkNvbG9yLmEgPSBtYXgob3duQ29sb3IuYSwgMC4wMDAxKTtcXG4gICAgb3duQ29sb3IucmdiID0gb3duQ29sb3IucmdiIC8gb3duQ29sb3IuYTtcXG4gICAgZmxvYXQgb3V0ZXJHbG93QWxwaGEgPSAodG90YWxBbHBoYSAvIG1heFRvdGFsQWxwaGEpICAqIG91dGVyU3RyZW5ndGggKiAoMS4gLSBvd25Db2xvci5hKTtcXG4gICAgZmxvYXQgaW5uZXJHbG93QWxwaGEgPSAoKG1heFRvdGFsQWxwaGEgLSB0b3RhbEFscGhhKSAvIG1heFRvdGFsQWxwaGEpICogaW5uZXJTdHJlbmd0aCAqIG93bkNvbG9yLmE7XFxuICAgIGZsb2F0IHJlc3VsdEFscGhhID0gKG93bkNvbG9yLmEgKyBvdXRlckdsb3dBbHBoYSk7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQobWl4KG1peChvd25Db2xvci5yZ2IsIGdsb3dDb2xvci5yZ2IsIGlubmVyR2xvd0FscGhhIC8gb3duQ29sb3IuYSksIGdsb3dDb2xvci5yZ2IsIG91dGVyR2xvd0FscGhhIC8gcmVzdWx0QWxwaGEpICogcmVzdWx0QWxwaGEsIHJlc3VsdEFscGhhKTtcXG59XFxuXCIsZT1mdW5jdGlvbihvKXtmdW5jdGlvbiBlKGUscixpLGwsYSl7dm9pZCAwPT09ZSYmKGU9MTApLHZvaWQgMD09PXImJihyPTQpLHZvaWQgMD09PWkmJihpPTApLHZvaWQgMD09PWwmJihsPTE2Nzc3MjE1KSx2b2lkIDA9PT1hJiYoYT0uMSksby5jYWxsKHRoaXMsbix0LnJlcGxhY2UoLyVRVUFMSVRZX0RJU1QlL2dpLFwiXCIrKDEvYS9lKS50b0ZpeGVkKDcpKS5yZXBsYWNlKC8lRElTVCUvZ2ksXCJcIitlLnRvRml4ZWQoNykpKSx0aGlzLnVuaWZvcm1zLmdsb3dDb2xvcj1uZXcgRmxvYXQzMkFycmF5KFswLDAsMCwxXSksdGhpcy5kaXN0YW5jZT1lLHRoaXMuY29sb3I9bCx0aGlzLm91dGVyU3RyZW5ndGg9cix0aGlzLmlubmVyU3RyZW5ndGg9aX1vJiYoZS5fX3Byb3RvX189byksKGUucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobyYmby5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1lO3ZhciByPXtjb2xvcjp7Y29uZmlndXJhYmxlOiEwfSxkaXN0YW5jZTp7Y29uZmlndXJhYmxlOiEwfSxvdXRlclN0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9LGlubmVyU3RyZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLmNvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiBQSVhJLnV0aWxzLnJnYjJoZXgodGhpcy51bmlmb3Jtcy5nbG93Q29sb3IpfSxyLmNvbG9yLnNldD1mdW5jdGlvbihvKXtQSVhJLnV0aWxzLmhleDJyZ2Iobyx0aGlzLnVuaWZvcm1zLmdsb3dDb2xvcil9LHIuZGlzdGFuY2UuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZGlzdGFuY2V9LHIuZGlzdGFuY2Uuc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMuZGlzdGFuY2U9b30sci5vdXRlclN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLm91dGVyU3RyZW5ndGh9LHIub3V0ZXJTdHJlbmd0aC5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5vdXRlclN0cmVuZ3RoPW99LHIuaW5uZXJTdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5pbm5lclN0cmVuZ3RofSxyLmlubmVyU3RyZW5ndGguc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMuaW5uZXJTdHJlbmd0aD1vfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhlLnByb3RvdHlwZSxyKSxlfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkdsb3dGaWx0ZXI9ZSxvLkdsb3dGaWx0ZXI9ZSxPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWdsb3cuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1nb2RyYXkgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWdvZHJheSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihuLGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUobi5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihuKXtcInVzZSBzdHJpY3RcIjt2YXIgZT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwidmVjMyBtb2QyODkodmVjMyB4KVxcbntcXG4gICAgcmV0dXJuIHggLSBmbG9vcih4ICogKDEuMCAvIDI4OS4wKSkgKiAyODkuMDtcXG59XFxudmVjNCBtb2QyODkodmVjNCB4KVxcbntcXG4gICAgcmV0dXJuIHggLSBmbG9vcih4ICogKDEuMCAvIDI4OS4wKSkgKiAyODkuMDtcXG59XFxudmVjNCBwZXJtdXRlKHZlYzQgeClcXG57XFxuICAgIHJldHVybiBtb2QyODkoKCh4ICogMzQuMCkgKyAxLjApICogeCk7XFxufVxcbnZlYzQgdGF5bG9ySW52U3FydCh2ZWM0IHIpXFxue1xcbiAgICByZXR1cm4gMS43OTI4NDI5MTQwMDE1OSAtIDAuODUzNzM0NzIwOTUzMTQgKiByO1xcbn1cXG52ZWMzIGZhZGUodmVjMyB0KVxcbntcXG4gICAgcmV0dXJuIHQgKiB0ICogdCAqICh0ICogKHQgKiA2LjAgLSAxNS4wKSArIDEwLjApO1xcbn1cXG4vLyBDbGFzc2ljIFBlcmxpbiBub2lzZSwgcGVyaW9kaWMgdmFyaWFudFxcbmZsb2F0IHBub2lzZSh2ZWMzIFAsIHZlYzMgcmVwKVxcbntcXG4gICAgdmVjMyBQaTAgPSBtb2QoZmxvb3IoUCksIHJlcCk7IC8vIEludGVnZXIgcGFydCwgbW9kdWxvIHBlcmlvZFxcbiAgICB2ZWMzIFBpMSA9IG1vZChQaTAgKyB2ZWMzKDEuMCksIHJlcCk7IC8vIEludGVnZXIgcGFydCArIDEsIG1vZCBwZXJpb2RcXG4gICAgUGkwID0gbW9kMjg5KFBpMCk7XFxuICAgIFBpMSA9IG1vZDI4OShQaTEpO1xcbiAgICB2ZWMzIFBmMCA9IGZyYWN0KFApOyAvLyBGcmFjdGlvbmFsIHBhcnQgZm9yIGludGVycG9sYXRpb25cXG4gICAgdmVjMyBQZjEgPSBQZjAgLSB2ZWMzKDEuMCk7IC8vIEZyYWN0aW9uYWwgcGFydCAtIDEuMFxcbiAgICB2ZWM0IGl4ID0gdmVjNChQaTAueCwgUGkxLngsIFBpMC54LCBQaTEueCk7XFxuICAgIHZlYzQgaXkgPSB2ZWM0KFBpMC55eSwgUGkxLnl5KTtcXG4gICAgdmVjNCBpejAgPSBQaTAuenp6ejtcXG4gICAgdmVjNCBpejEgPSBQaTEuenp6ejtcXG4gICAgdmVjNCBpeHkgPSBwZXJtdXRlKHBlcm11dGUoaXgpICsgaXkpO1xcbiAgICB2ZWM0IGl4eTAgPSBwZXJtdXRlKGl4eSArIGl6MCk7XFxuICAgIHZlYzQgaXh5MSA9IHBlcm11dGUoaXh5ICsgaXoxKTtcXG4gICAgdmVjNCBneDAgPSBpeHkwICogKDEuMCAvIDcuMCk7XFxuICAgIHZlYzQgZ3kwID0gZnJhY3QoZmxvb3IoZ3gwKSAqICgxLjAgLyA3LjApKSAtIDAuNTtcXG4gICAgZ3gwID0gZnJhY3QoZ3gwKTtcXG4gICAgdmVjNCBnejAgPSB2ZWM0KDAuNSkgLSBhYnMoZ3gwKSAtIGFicyhneTApO1xcbiAgICB2ZWM0IHN6MCA9IHN0ZXAoZ3owLCB2ZWM0KDAuMCkpO1xcbiAgICBneDAgLT0gc3owICogKHN0ZXAoMC4wLCBneDApIC0gMC41KTtcXG4gICAgZ3kwIC09IHN6MCAqIChzdGVwKDAuMCwgZ3kwKSAtIDAuNSk7XFxuICAgIHZlYzQgZ3gxID0gaXh5MSAqICgxLjAgLyA3LjApO1xcbiAgICB2ZWM0IGd5MSA9IGZyYWN0KGZsb29yKGd4MSkgKiAoMS4wIC8gNy4wKSkgLSAwLjU7XFxuICAgIGd4MSA9IGZyYWN0KGd4MSk7XFxuICAgIHZlYzQgZ3oxID0gdmVjNCgwLjUpIC0gYWJzKGd4MSkgLSBhYnMoZ3kxKTtcXG4gICAgdmVjNCBzejEgPSBzdGVwKGd6MSwgdmVjNCgwLjApKTtcXG4gICAgZ3gxIC09IHN6MSAqIChzdGVwKDAuMCwgZ3gxKSAtIDAuNSk7XFxuICAgIGd5MSAtPSBzejEgKiAoc3RlcCgwLjAsIGd5MSkgLSAwLjUpO1xcbiAgICB2ZWMzIGcwMDAgPSB2ZWMzKGd4MC54LCBneTAueCwgZ3owLngpO1xcbiAgICB2ZWMzIGcxMDAgPSB2ZWMzKGd4MC55LCBneTAueSwgZ3owLnkpO1xcbiAgICB2ZWMzIGcwMTAgPSB2ZWMzKGd4MC56LCBneTAueiwgZ3owLnopO1xcbiAgICB2ZWMzIGcxMTAgPSB2ZWMzKGd4MC53LCBneTAudywgZ3owLncpO1xcbiAgICB2ZWMzIGcwMDEgPSB2ZWMzKGd4MS54LCBneTEueCwgZ3oxLngpO1xcbiAgICB2ZWMzIGcxMDEgPSB2ZWMzKGd4MS55LCBneTEueSwgZ3oxLnkpO1xcbiAgICB2ZWMzIGcwMTEgPSB2ZWMzKGd4MS56LCBneTEueiwgZ3oxLnopO1xcbiAgICB2ZWMzIGcxMTEgPSB2ZWMzKGd4MS53LCBneTEudywgZ3oxLncpO1xcbiAgICB2ZWM0IG5vcm0wID0gdGF5bG9ySW52U3FydCh2ZWM0KGRvdChnMDAwLCBnMDAwKSwgZG90KGcwMTAsIGcwMTApLCBkb3QoZzEwMCwgZzEwMCksIGRvdChnMTEwLCBnMTEwKSkpO1xcbiAgICBnMDAwICo9IG5vcm0wLng7XFxuICAgIGcwMTAgKj0gbm9ybTAueTtcXG4gICAgZzEwMCAqPSBub3JtMC56O1xcbiAgICBnMTEwICo9IG5vcm0wLnc7XFxuICAgIHZlYzQgbm9ybTEgPSB0YXlsb3JJbnZTcXJ0KHZlYzQoZG90KGcwMDEsIGcwMDEpLCBkb3QoZzAxMSwgZzAxMSksIGRvdChnMTAxLCBnMTAxKSwgZG90KGcxMTEsIGcxMTEpKSk7XFxuICAgIGcwMDEgKj0gbm9ybTEueDtcXG4gICAgZzAxMSAqPSBub3JtMS55O1xcbiAgICBnMTAxICo9IG5vcm0xLno7XFxuICAgIGcxMTEgKj0gbm9ybTEudztcXG4gICAgZmxvYXQgbjAwMCA9IGRvdChnMDAwLCBQZjApO1xcbiAgICBmbG9hdCBuMTAwID0gZG90KGcxMDAsIHZlYzMoUGYxLngsIFBmMC55eikpO1xcbiAgICBmbG9hdCBuMDEwID0gZG90KGcwMTAsIHZlYzMoUGYwLngsIFBmMS55LCBQZjAueikpO1xcbiAgICBmbG9hdCBuMTEwID0gZG90KGcxMTAsIHZlYzMoUGYxLnh5LCBQZjAueikpO1xcbiAgICBmbG9hdCBuMDAxID0gZG90KGcwMDEsIHZlYzMoUGYwLnh5LCBQZjEueikpO1xcbiAgICBmbG9hdCBuMTAxID0gZG90KGcxMDEsIHZlYzMoUGYxLngsIFBmMC55LCBQZjEueikpO1xcbiAgICBmbG9hdCBuMDExID0gZG90KGcwMTEsIHZlYzMoUGYwLngsIFBmMS55eikpO1xcbiAgICBmbG9hdCBuMTExID0gZG90KGcxMTEsIFBmMSk7XFxuICAgIHZlYzMgZmFkZV94eXogPSBmYWRlKFBmMCk7XFxuICAgIHZlYzQgbl96ID0gbWl4KHZlYzQobjAwMCwgbjEwMCwgbjAxMCwgbjExMCksIHZlYzQobjAwMSwgbjEwMSwgbjAxMSwgbjExMSksIGZhZGVfeHl6LnopO1xcbiAgICB2ZWMyIG5feXogPSBtaXgobl96Lnh5LCBuX3ouencsIGZhZGVfeHl6LnkpO1xcbiAgICBmbG9hdCBuX3h5eiA9IG1peChuX3l6LngsIG5feXoueSwgZmFkZV94eXoueCk7XFxuICAgIHJldHVybiAyLjIgKiBuX3h5ejtcXG59XFxuZmxvYXQgdHVyYih2ZWMzIFAsIHZlYzMgcmVwLCBmbG9hdCBsYWN1bmFyaXR5LCBmbG9hdCBnYWluKVxcbntcXG4gICAgZmxvYXQgc3VtID0gMC4wO1xcbiAgICBmbG9hdCBzYyA9IDEuMDtcXG4gICAgZmxvYXQgdG90YWxnYWluID0gMS4wO1xcbiAgICBmb3IgKGZsb2F0IGkgPSAwLjA7IGkgPCA2LjA7IGkrKylcXG4gICAge1xcbiAgICAgICAgc3VtICs9IHRvdGFsZ2FpbiAqIHBub2lzZShQICogc2MsIHJlcCk7XFxuICAgICAgICBzYyAqPSBsYWN1bmFyaXR5O1xcbiAgICAgICAgdG90YWxnYWluICo9IGdhaW47XFxuICAgIH1cXG4gICAgcmV0dXJuIGFicyhzdW0pO1xcbn1cXG5cIixpPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxuXFxudW5pZm9ybSB2ZWMyIGFuZ2xlRGlyO1xcbnVuaWZvcm0gZmxvYXQgZ2FpbjtcXG51bmlmb3JtIGZsb2F0IGxhY3VuYXJpdHk7XFxudW5pZm9ybSBmbG9hdCB0aW1lO1xcblxcbiR7cGVybGlufVxcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkICogZmlsdGVyQXJlYS54eSAvIGRpbWVuc2lvbnMueHk7XFxuXFxuICAgIGZsb2F0IHh4ID0gYW5nbGVEaXIueDtcXG4gICAgZmxvYXQgeXkgPSBhbmdsZURpci55O1xcblxcbiAgICBmbG9hdCBkID0gKHh4ICogY29vcmQueCkgKyAoeXkgKiBjb29yZC55KTtcXG4gICAgdmVjMyBkaXIgPSB2ZWMzKGQsIGQsIDAuMCk7XFxuXFxuICAgIGZsb2F0IG5vaXNlID0gdHVyYihkaXIgKyB2ZWMzKHRpbWUsIDAuMCwgNjIuMSArIHRpbWUpICogMC4wNSwgdmVjMyg0ODAuMCwgMzIwLjAsIDQ4MC4wKSwgbGFjdW5hcml0eSwgZ2Fpbik7XFxuICAgIG5vaXNlID0gbWl4KG5vaXNlLCAwLjAsIDAuMyk7XFxuICAgIC8vZmFkZSB2ZXJ0aWNhbGx5LlxcbiAgICB2ZWM0IG1pc3QgPSB2ZWM0KG5vaXNlLCBub2lzZSwgbm9pc2UsIDEuMCkgKiAoMS4wIC0gY29vcmQueSk7XFxuICAgIG1pc3QuYSA9IDEuMDtcXG4gICAgZ2xfRnJhZ0NvbG9yICs9IG1pc3Q7XFxufVxcblwiLG89ZnVuY3Rpb24obil7ZnVuY3Rpb24gbyhvLHIsYSxjKXt2b2lkIDA9PT1vJiYobz0zMCksdm9pZCAwPT09ciYmKHI9LjUpLHZvaWQgMD09PWEmJihhPTIuNSksdm9pZCAwPT09YyYmKGM9MCksbi5jYWxsKHRoaXMsZSxpLnJlcGxhY2UoXCIke3Blcmxpbn1cIix0KSksdGhpcy5hbmdsZT1vLHRoaXMuZ2Fpbj1yLHRoaXMubGFjdW5hcml0eT1hLHRoaXMudGltZT1jfW4mJihvLl9fcHJvdG9fXz1uKSwoby5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShuJiZuLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW87dmFyIHI9e2FuZ2xlOntjb25maWd1cmFibGU6ITB9LGdhaW46e2NvbmZpZ3VyYWJsZTohMH0sbGFjdW5hcml0eTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIG8ucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKG4sZSx0LGkpe3ZhciBvPWUuc291cmNlRnJhbWUud2lkdGgscj1lLnNvdXJjZUZyYW1lLmhlaWdodDt0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMF09byx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMV09cix0aGlzLnVuaWZvcm1zLnRpbWU9dGhpcy50aW1lLHRoaXMudW5pZm9ybXMuYW5nbGVEaXJbMV09dGhpcy5fYW5nbGVTaW4qci9vLG4uYXBwbHlGaWx0ZXIodGhpcyxlLHQsaSl9LHIuYW5nbGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FuZ2xlfSxyLmFuZ2xlLnNldD1mdW5jdGlvbihuKXt2YXIgZT1uKlBJWEkuREVHX1RPX1JBRDt0aGlzLl9hbmdsZUNvcz1NYXRoLmNvcyhlKSx0aGlzLl9hbmdsZVNpbj1NYXRoLnNpbihlKSx0aGlzLnVuaWZvcm1zLmFuZ2xlRGlyWzBdPXRoaXMuX2FuZ2xlQ29zLHRoaXMuX2FuZ2xlPW59LHIuZ2Fpbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5nYWlufSxyLmdhaW4uc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMuZ2Fpbj1ufSxyLmxhY3VuYXJpdHkuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMubGFjdW5hcml0eX0sci5sYWN1bmFyaXR5LnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLmxhY3VuYXJpdHk9bn0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoby5wcm90b3R5cGUsciksb30oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Hb2RyYXlGaWx0ZXI9byxuLkdvZHJheUZpbHRlcj1vLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZ29kcmF5LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItbW90aW9uLWJsdXIgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLW1vdGlvbi1ibHVyIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciB0PVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLGk9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG51bmlmb3JtIHZlYzIgdVZlbG9jaXR5O1xcbnVuaWZvcm0gaW50IHVLZXJuZWxTaXplO1xcbnVuaWZvcm0gZmxvYXQgdU9mZnNldDtcXG5cXG5jb25zdCBpbnQgTUFYX0tFUk5FTF9TSVpFID0gMjA0ODtcXG5jb25zdCBpbnQgSVRFUkFUSU9OID0gTUFYX0tFUk5FTF9TSVpFIC0gMTtcXG5cXG52ZWMyIHZlbG9jaXR5ID0gdVZlbG9jaXR5IC8gZmlsdGVyQXJlYS54eTtcXG5cXG4vLyBmbG9hdCBrZXJuZWxTaXplID0gbWluKGZsb2F0KHVLZXJuZWxTaXplKSwgZmxvYXQoTUFYX0tFUk5FTFNJWkUpKTtcXG5cXG4vLyBJbiByZWFsIHVzZS1jYXNlICwgdUtlcm5lbFNpemUgPCBNQVhfS0VSTkVMU0laRSBhbG1vc3QgYWx3YXlzLlxcbi8vIFNvIHVzZSB1S2VybmVsU2l6ZSBkaXJlY3RseS5cXG5mbG9hdCBrZXJuZWxTaXplID0gZmxvYXQodUtlcm5lbFNpemUpO1xcbmZsb2F0IGsgPSBrZXJuZWxTaXplIC0gMS4wO1xcbmZsb2F0IG9mZnNldCA9IC11T2Zmc2V0IC8gbGVuZ3RoKHVWZWxvY2l0eSkgLSAwLjU7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBpZiAodUtlcm5lbFNpemUgPT0gMClcXG4gICAge1xcbiAgICAgICAgcmV0dXJuO1xcbiAgICB9XFxuXFxuICAgIGZvcihpbnQgaSA9IDA7IGkgPCBJVEVSQVRJT047IGkrKykge1xcbiAgICAgICAgaWYgKGkgPT0gaW50KGspKSB7XFxuICAgICAgICAgICAgYnJlYWs7XFxuICAgICAgICB9XFxuICAgICAgICB2ZWMyIGJpYXMgPSB2ZWxvY2l0eSAqIChmbG9hdChpKSAvIGsgKyBvZmZzZXQpO1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yICs9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIGJpYXMpO1xcbiAgICB9XFxuICAgIGdsX0ZyYWdDb2xvciAvPSBrZXJuZWxTaXplO1xcbn1cXG5cIixuPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4obixvLHIpe3ZvaWQgMD09PW4mJihuPVswLDBdKSx2b2lkIDA9PT1vJiYobz01KSx2b2lkIDA9PT1yJiYocj0wKSxlLmNhbGwodGhpcyx0LGkpLHRoaXMuX3ZlbG9jaXR5PW5ldyBQSVhJLlBvaW50KDAsMCksdGhpcy52ZWxvY2l0eT1uLHRoaXMua2VybmVsU2l6ZT1vLHRoaXMub2Zmc2V0PXJ9ZSYmKG4uX19wcm90b19fPWUpLChuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bjt2YXIgbz17dmVsb2NpdHk6e2NvbmZpZ3VyYWJsZTohMH0sb2Zmc2V0Ontjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gbi5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LGksbil7dmFyIG89dGhpcy52ZWxvY2l0eSxyPW8ueCxsPW8ueTt0aGlzLnVuaWZvcm1zLnVLZXJuZWxTaXplPTAhPT1yfHwwIT09bD90aGlzLmtlcm5lbFNpemU6MCxlLmFwcGx5RmlsdGVyKHRoaXMsdCxpLG4pfSxvLnZlbG9jaXR5LnNldD1mdW5jdGlvbihlKXtBcnJheS5pc0FycmF5KGUpPyh0aGlzLl92ZWxvY2l0eS54PWVbMF0sdGhpcy5fdmVsb2NpdHkueT1lWzFdKTplIGluc3RhbmNlb2YgUElYSS5Qb2ludCYmKHRoaXMuX3ZlbG9jaXR5Lng9ZS54LHRoaXMuX3ZlbG9jaXR5Lnk9ZS55KSx0aGlzLnVuaWZvcm1zLnVWZWxvY2l0eVswXT10aGlzLl92ZWxvY2l0eS54LHRoaXMudW5pZm9ybXMudVZlbG9jaXR5WzFdPXRoaXMuX3ZlbG9jaXR5Lnl9LG8udmVsb2NpdHkuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZlbG9jaXR5fSxvLm9mZnNldC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy51T2Zmc2V0PWV9LG8ub2Zmc2V0LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVPZmZzZXR9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLG8pLG59KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuTW90aW9uQmx1ckZpbHRlcj1uLGUuTW90aW9uQmx1ckZpbHRlcj1uLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItbW90aW9uLWJsdXIuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1tdWx0aS1jb2xvci1yZXBsYWNlIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1tdWx0aS1jb2xvci1yZXBsYWNlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG8sZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZShvLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG8pe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIGZsb2F0IGVwc2lsb247XFxuXFxuY29uc3QgaW50IE1BWF9DT0xPUlMgPSAlbWF4Q29sb3JzJTtcXG5cXG51bmlmb3JtIHZlYzMgb3JpZ2luYWxDb2xvcnNbTUFYX0NPTE9SU107XFxudW5pZm9ybSB2ZWMzIHRhcmdldENvbG9yc1tNQVhfQ09MT1JTXTtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIGZsb2F0IGFscGhhID0gZ2xfRnJhZ0NvbG9yLmE7XFxuICAgIGlmIChhbHBoYSA8IDAuMDAwMSlcXG4gICAge1xcbiAgICAgIHJldHVybjtcXG4gICAgfVxcblxcbiAgICB2ZWMzIGNvbG9yID0gZ2xfRnJhZ0NvbG9yLnJnYiAvIGFscGhhO1xcblxcbiAgICBmb3IoaW50IGkgPSAwOyBpIDwgTUFYX0NPTE9SUzsgaSsrKVxcbiAgICB7XFxuICAgICAgdmVjMyBvcmlnQ29sb3IgPSBvcmlnaW5hbENvbG9yc1tpXTtcXG4gICAgICBpZiAob3JpZ0NvbG9yLnIgPCAwLjApXFxuICAgICAge1xcbiAgICAgICAgYnJlYWs7XFxuICAgICAgfVxcbiAgICAgIHZlYzMgY29sb3JEaWZmID0gb3JpZ0NvbG9yIC0gY29sb3I7XFxuICAgICAgaWYgKGxlbmd0aChjb2xvckRpZmYpIDwgZXBzaWxvbilcXG4gICAgICB7XFxuICAgICAgICB2ZWMzIHRhcmdldENvbG9yID0gdGFyZ2V0Q29sb3JzW2ldO1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgodGFyZ2V0Q29sb3IgKyBjb2xvckRpZmYpICogYWxwaGEsIGFscGhhKTtcXG4gICAgICAgIHJldHVybjtcXG4gICAgICB9XFxuICAgIH1cXG59XFxuXCIsbj1mdW5jdGlvbihvKXtmdW5jdGlvbiBuKG4sdCxpKXt2b2lkIDA9PT10JiYodD0uMDUpLHZvaWQgMD09PWkmJihpPW51bGwpLGk9aXx8bi5sZW5ndGgsby5jYWxsKHRoaXMsZSxyLnJlcGxhY2UoLyVtYXhDb2xvcnMlL2csaSkpLHRoaXMuZXBzaWxvbj10LHRoaXMuX21heENvbG9ycz1pLHRoaXMuX3JlcGxhY2VtZW50cz1udWxsLHRoaXMudW5pZm9ybXMub3JpZ2luYWxDb2xvcnM9bmV3IEZsb2F0MzJBcnJheSgzKmkpLHRoaXMudW5pZm9ybXMudGFyZ2V0Q29sb3JzPW5ldyBGbG9hdDMyQXJyYXkoMyppKSx0aGlzLnJlcGxhY2VtZW50cz1ufW8mJihuLl9fcHJvdG9fXz1vKSwobi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShvJiZvLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW47dmFyIHQ9e3JlcGxhY2VtZW50czp7Y29uZmlndXJhYmxlOiEwfSxtYXhDb2xvcnM6e2NvbmZpZ3VyYWJsZTohMH0sZXBzaWxvbjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQucmVwbGFjZW1lbnRzLnNldD1mdW5jdGlvbihvKXt2YXIgZT10aGlzLnVuaWZvcm1zLm9yaWdpbmFsQ29sb3JzLHI9dGhpcy51bmlmb3Jtcy50YXJnZXRDb2xvcnMsbj1vLmxlbmd0aDtpZihuPnRoaXMuX21heENvbG9ycyl0aHJvd1wiTGVuZ3RoIG9mIHJlcGxhY2VtZW50cyAoXCIrbitcIikgZXhjZWVkcyB0aGUgbWF4aW11bSBjb2xvcnMgbGVuZ3RoIChcIit0aGlzLl9tYXhDb2xvcnMrXCIpXCI7ZVszKm5dPS0xO2Zvcih2YXIgdD0wO3Q8bjt0Kyspe3ZhciBpPW9bdF0sbD1pWzBdO1wibnVtYmVyXCI9PXR5cGVvZiBsP2w9UElYSS51dGlscy5oZXgycmdiKGwpOmlbMF09UElYSS51dGlscy5yZ2IyaGV4KGwpLGVbMyp0XT1sWzBdLGVbMyp0KzFdPWxbMV0sZVszKnQrMl09bFsyXTt2YXIgYT1pWzFdO1wibnVtYmVyXCI9PXR5cGVvZiBhP2E9UElYSS51dGlscy5oZXgycmdiKGEpOmlbMV09UElYSS51dGlscy5yZ2IyaGV4KGEpLHJbMyp0XT1hWzBdLHJbMyp0KzFdPWFbMV0sclszKnQrMl09YVsyXX10aGlzLl9yZXBsYWNlbWVudHM9b30sdC5yZXBsYWNlbWVudHMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JlcGxhY2VtZW50c30sbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3RoaXMucmVwbGFjZW1lbnRzPXRoaXMuX3JlcGxhY2VtZW50c30sdC5tYXhDb2xvcnMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX21heENvbG9yc30sdC5lcHNpbG9uLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLmVwc2lsb249b30sdC5lcHNpbG9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmVwc2lsb259LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHQpLG59KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuTXVsdGlDb2xvclJlcGxhY2VGaWx0ZXI9bixvLk11bHRpQ29sb3JSZXBsYWNlRmlsdGVyPW4sT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1tdWx0aS1jb2xvci1yZXBsYWNlLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItb2xkLWZpbG0gLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLW9sZC1maWxtIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG4sdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChuLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG4pe1widXNlIHN0cmljdFwiO3ZhciB0PVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLGk9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzIgZGltZW5zaW9ucztcXG5cXG51bmlmb3JtIGZsb2F0IHNlcGlhO1xcbnVuaWZvcm0gZmxvYXQgbm9pc2U7XFxudW5pZm9ybSBmbG9hdCBub2lzZVNpemU7XFxudW5pZm9ybSBmbG9hdCBzY3JhdGNoO1xcbnVuaWZvcm0gZmxvYXQgc2NyYXRjaERlbnNpdHk7XFxudW5pZm9ybSBmbG9hdCBzY3JhdGNoV2lkdGg7XFxudW5pZm9ybSBmbG9hdCB2aWduZXR0aW5nO1xcbnVuaWZvcm0gZmxvYXQgdmlnbmV0dGluZ0FscGhhO1xcbnVuaWZvcm0gZmxvYXQgdmlnbmV0dGluZ0JsdXI7XFxudW5pZm9ybSBmbG9hdCBzZWVkO1xcblxcbmNvbnN0IGZsb2F0IFNRUlRfMiA9IDEuNDE0MjEzO1xcbmNvbnN0IHZlYzMgU0VQSUFfUkdCID0gdmVjMygxMTIuMCAvIDI1NS4wLCA2Ni4wIC8gMjU1LjAsIDIwLjAgLyAyNTUuMCk7XFxuXFxuZmxvYXQgcmFuZCh2ZWMyIGNvKSB7XFxuICAgIHJldHVybiBmcmFjdChzaW4oZG90KGNvLnh5LCB2ZWMyKDEyLjk4OTgsIDc4LjIzMykpKSAqIDQzNzU4LjU0NTMpO1xcbn1cXG5cXG52ZWMzIE92ZXJsYXkodmVjMyBzcmMsIHZlYzMgZHN0KVxcbntcXG4gICAgLy8gaWYgKGRzdCA8PSAwLjUpIHRoZW46IDIgKiBzcmMgKiBkc3RcXG4gICAgLy8gaWYgKGRzdCA+IDAuNSkgdGhlbjogMSAtIDIgKiAoMSAtIGRzdCkgKiAoMSAtIHNyYylcXG4gICAgcmV0dXJuIHZlYzMoKGRzdC54IDw9IDAuNSkgPyAoMi4wICogc3JjLnggKiBkc3QueCkgOiAoMS4wIC0gMi4wICogKDEuMCAtIGRzdC54KSAqICgxLjAgLSBzcmMueCkpLFxcbiAgICAgICAgICAgICAgICAoZHN0LnkgPD0gMC41KSA/ICgyLjAgKiBzcmMueSAqIGRzdC55KSA6ICgxLjAgLSAyLjAgKiAoMS4wIC0gZHN0LnkpICogKDEuMCAtIHNyYy55KSksXFxuICAgICAgICAgICAgICAgIChkc3QueiA8PSAwLjUpID8gKDIuMCAqIHNyYy56ICogZHN0LnopIDogKDEuMCAtIDIuMCAqICgxLjAgLSBkc3QueikgKiAoMS4wIC0gc3JjLnopKSk7XFxufVxcblxcblxcbnZvaWQgbWFpbigpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWMzIGNvbG9yID0gZ2xfRnJhZ0NvbG9yLnJnYjtcXG5cXG4gICAgaWYgKHNlcGlhID4gMC4wKVxcbiAgICB7XFxuICAgICAgICBmbG9hdCBncmF5ID0gKGNvbG9yLnggKyBjb2xvci55ICsgY29sb3IueikgLyAzLjA7XFxuICAgICAgICB2ZWMzIGdyYXlzY2FsZSA9IHZlYzMoZ3JheSk7XFxuXFxuICAgICAgICBjb2xvciA9IE92ZXJsYXkoU0VQSUFfUkdCLCBncmF5c2NhbGUpO1xcblxcbiAgICAgICAgY29sb3IgPSBncmF5c2NhbGUgKyBzZXBpYSAqIChjb2xvciAtIGdyYXlzY2FsZSk7XFxuICAgIH1cXG5cXG4gICAgdmVjMiBjb29yZCA9IHZUZXh0dXJlQ29vcmQgKiBmaWx0ZXJBcmVhLnh5IC8gZGltZW5zaW9ucy54eTtcXG5cXG4gICAgaWYgKHZpZ25ldHRpbmcgPiAwLjApXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IG91dHRlciA9IFNRUlRfMiAtIHZpZ25ldHRpbmcgKiBTUVJUXzI7XFxuICAgICAgICB2ZWMyIGRpciA9IHZlYzIodmVjMigwLjUsIDAuNSkgLSBjb29yZCk7XFxuICAgICAgICBkaXIueSAqPSBkaW1lbnNpb25zLnkgLyBkaW1lbnNpb25zLng7XFxuICAgICAgICBmbG9hdCBkYXJrZXIgPSBjbGFtcCgob3V0dGVyIC0gbGVuZ3RoKGRpcikgKiBTUVJUXzIpIC8gKCAwLjAwMDAxICsgdmlnbmV0dGluZ0JsdXIgKiBTUVJUXzIpLCAwLjAsIDEuMCk7XFxuICAgICAgICBjb2xvci5yZ2IgKj0gZGFya2VyICsgKDEuMCAtIGRhcmtlcikgKiAoMS4wIC0gdmlnbmV0dGluZ0FscGhhKTtcXG4gICAgfVxcblxcbiAgICBpZiAoc2NyYXRjaERlbnNpdHkgPiBzZWVkICYmIHNjcmF0Y2ggIT0gMC4wKVxcbiAgICB7XFxuICAgICAgICBmbG9hdCBwaGFzZSA9IHNlZWQgKiAyNTYuMDtcXG4gICAgICAgIGZsb2F0IHMgPSBtb2QoZmxvb3IocGhhc2UpLCAyLjApO1xcbiAgICAgICAgZmxvYXQgZGlzdCA9IDEuMCAvIHNjcmF0Y2hEZW5zaXR5O1xcbiAgICAgICAgZmxvYXQgZCA9IGRpc3RhbmNlKGNvb3JkLCB2ZWMyKHNlZWQgKiBkaXN0LCBhYnMocyAtIHNlZWQgKiBkaXN0KSkpO1xcbiAgICAgICAgaWYgKGQgPCBzZWVkICogMC42ICsgMC40KVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGhpZ2hwIGZsb2F0IHBlcmlvZCA9IHNjcmF0Y2hEZW5zaXR5ICogMTAuMDtcXG5cXG4gICAgICAgICAgICBmbG9hdCB4eCA9IGNvb3JkLnggKiBwZXJpb2QgKyBwaGFzZTtcXG4gICAgICAgICAgICBmbG9hdCBhYSA9IGFicyhtb2QoeHgsIDAuNSkgKiA0LjApO1xcbiAgICAgICAgICAgIGZsb2F0IGJiID0gbW9kKGZsb29yKHh4IC8gMC41KSwgMi4wKTtcXG4gICAgICAgICAgICBmbG9hdCB5eSA9ICgxLjAgLSBiYikgKiBhYSArIGJiICogKDIuMCAtIGFhKTtcXG5cXG4gICAgICAgICAgICBmbG9hdCBrayA9IDIuMCAqIHBlcmlvZDtcXG4gICAgICAgICAgICBmbG9hdCBkdyA9IHNjcmF0Y2hXaWR0aCAvIGRpbWVuc2lvbnMueCAqICgwLjc1ICsgc2VlZCk7XFxuICAgICAgICAgICAgZmxvYXQgZGggPSBkdyAqIGtrO1xcblxcbiAgICAgICAgICAgIGZsb2F0IHRpbmUgPSAoeXkgLSAoMi4wIC0gZGgpKTtcXG5cXG4gICAgICAgICAgICBpZiAodGluZSA+IDAuMCkge1xcbiAgICAgICAgICAgICAgICBmbG9hdCBfc2lnbiA9IHNpZ24oc2NyYXRjaCk7XFxuXFxuICAgICAgICAgICAgICAgIHRpbmUgPSBzICogdGluZSAvIHBlcmlvZCArIHNjcmF0Y2ggKyAwLjE7XFxuICAgICAgICAgICAgICAgIHRpbmUgPSBjbGFtcCh0aW5lICsgMS4wLCAwLjUgKyBfc2lnbiAqIDAuNSwgMS41ICsgX3NpZ24gKiAwLjUpO1xcblxcbiAgICAgICAgICAgICAgICBjb2xvci5yZ2IgKj0gdGluZTtcXG4gICAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgaWYgKG5vaXNlID4gMC4wICYmIG5vaXNlU2l6ZSA+IDAuMClcXG4gICAge1xcbiAgICAgICAgdmVjMiBwaXhlbENvb3JkID0gdlRleHR1cmVDb29yZC54eSAqIGZpbHRlckFyZWEueHk7XFxuICAgICAgICBwaXhlbENvb3JkLnggPSBmbG9vcihwaXhlbENvb3JkLnggLyBub2lzZVNpemUpO1xcbiAgICAgICAgcGl4ZWxDb29yZC55ID0gZmxvb3IocGl4ZWxDb29yZC55IC8gbm9pc2VTaXplKTtcXG4gICAgICAgIC8vIHZlYzIgZCA9IHBpeGVsQ29vcmQgKiBub2lzZVNpemUgKiB2ZWMyKDEwMjQuMCArIHNlZWQgKiA1MTIuMCwgMTAyNC4wIC0gc2VlZCAqIDUxMi4wKTtcXG4gICAgICAgIC8vIGZsb2F0IF9ub2lzZSA9IHNub2lzZShkKSAqIDAuNTtcXG4gICAgICAgIGZsb2F0IF9ub2lzZSA9IHJhbmQocGl4ZWxDb29yZCAqIG5vaXNlU2l6ZSAqIHNlZWQpIC0gMC41O1xcbiAgICAgICAgY29sb3IgKz0gX25vaXNlICogbm9pc2U7XFxuICAgIH1cXG5cXG4gICAgZ2xfRnJhZ0NvbG9yLnJnYiA9IGNvbG9yO1xcbn1cXG5cIixlPWZ1bmN0aW9uKG4pe2Z1bmN0aW9uIGUoZSxvKXt2b2lkIDA9PT1vJiYobz0wKSxuLmNhbGwodGhpcyx0LGkpLFwibnVtYmVyXCI9PXR5cGVvZiBlPyh0aGlzLnNlZWQ9ZSxlPW51bGwpOnRoaXMuc2VlZD1vLE9iamVjdC5hc3NpZ24odGhpcyx7c2VwaWE6LjMsbm9pc2U6LjMsbm9pc2VTaXplOjEsc2NyYXRjaDouNSxzY3JhdGNoRGVuc2l0eTouMyxzY3JhdGNoV2lkdGg6MSx2aWduZXR0aW5nOi4zLHZpZ25ldHRpbmdBbHBoYToxLHZpZ25ldHRpbmdCbHVyOi4zfSxlKX1uJiYoZS5fX3Byb3RvX189biksKGUucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobiYmbi5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1lO3ZhciBvPXtzZXBpYTp7Y29uZmlndXJhYmxlOiEwfSxub2lzZTp7Y29uZmlndXJhYmxlOiEwfSxub2lzZVNpemU6e2NvbmZpZ3VyYWJsZTohMH0sc2NyYXRjaDp7Y29uZmlndXJhYmxlOiEwfSxzY3JhdGNoRGVuc2l0eTp7Y29uZmlndXJhYmxlOiEwfSxzY3JhdGNoV2lkdGg6e2NvbmZpZ3VyYWJsZTohMH0sdmlnbmV0dGluZzp7Y29uZmlndXJhYmxlOiEwfSx2aWduZXR0aW5nQWxwaGE6e2NvbmZpZ3VyYWJsZTohMH0sdmlnbmV0dGluZ0JsdXI6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBlLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihuLHQsaSxlKXt0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMF09dC5zb3VyY2VGcmFtZS53aWR0aCx0aGlzLnVuaWZvcm1zLmRpbWVuc2lvbnNbMV09dC5zb3VyY2VGcmFtZS5oZWlnaHQsdGhpcy51bmlmb3Jtcy5zZWVkPXRoaXMuc2VlZCxuLmFwcGx5RmlsdGVyKHRoaXMsdCxpLGUpfSxvLnNlcGlhLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnNlcGlhPW59LG8uc2VwaWEuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2VwaWF9LG8ubm9pc2Uuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMubm9pc2U9bn0sby5ub2lzZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ub2lzZX0sby5ub2lzZVNpemUuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMubm9pc2VTaXplPW59LG8ubm9pc2VTaXplLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLm5vaXNlU2l6ZX0sby5zY3JhdGNoLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnNjcmF0Y2g9bn0sby5zY3JhdGNoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNjcmF0Y2h9LG8uc2NyYXRjaERlbnNpdHkuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMuc2NyYXRjaERlbnNpdHk9bn0sby5zY3JhdGNoRGVuc2l0eS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY3JhdGNoRGVuc2l0eX0sby5zY3JhdGNoV2lkdGguc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMuc2NyYXRjaFdpZHRoPW59LG8uc2NyYXRjaFdpZHRoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNjcmF0Y2hXaWR0aH0sby52aWduZXR0aW5nLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmc9bn0sby52aWduZXR0aW5nLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmd9LG8udmlnbmV0dGluZ0FscGhhLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmdBbHBoYT1ufSxvLnZpZ25ldHRpbmdBbHBoYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy52aWduZXR0aW5nQWxwaGF9LG8udmlnbmV0dGluZ0JsdXIuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudmlnbmV0dGluZ0JsdXI9bn0sby52aWduZXR0aW5nQmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy52aWduZXR0aW5nQmx1cn0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZS5wcm90b3R5cGUsbyksZX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5PbGRGaWxtRmlsdGVyPWUsbi5PbGRGaWxtRmlsdGVyPWUsT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1vbGQtZmlsbS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLW91dGxpbmUgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLW91dGxpbmUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxvKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9vKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxvKTpvKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG89XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gZmxvYXQgdGhpY2tuZXNzO1xcbnVuaWZvcm0gdmVjNCBvdXRsaW5lQ29sb3I7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckNsYW1wO1xcbnZlYzIgcHggPSB2ZWMyKDEuMCAvIGZpbHRlckFyZWEueCwgMS4wIC8gZmlsdGVyQXJlYS55KTtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICBjb25zdCBmbG9hdCBQSSA9IDMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQ7XFxuICAgIHZlYzQgb3duQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWM0IGN1ckNvbG9yO1xcbiAgICBmbG9hdCBtYXhBbHBoYSA9IDAuO1xcbiAgICB2ZWMyIGRpc3BsYWNlZDtcXG4gICAgZm9yIChmbG9hdCBhbmdsZSA9IDAuOyBhbmdsZSA8IFBJICogMi47IGFuZ2xlICs9ICVUSElDS05FU1MlICkge1xcbiAgICAgICAgZGlzcGxhY2VkLnggPSB2VGV4dHVyZUNvb3JkLnggKyB0aGlja25lc3MgKiBweC54ICogY29zKGFuZ2xlKTtcXG4gICAgICAgIGRpc3BsYWNlZC55ID0gdlRleHR1cmVDb29yZC55ICsgdGhpY2tuZXNzICogcHgueSAqIHNpbihhbmdsZSk7XFxuICAgICAgICBjdXJDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY2xhbXAoZGlzcGxhY2VkLCBmaWx0ZXJDbGFtcC54eSwgZmlsdGVyQ2xhbXAuencpKTtcXG4gICAgICAgIG1heEFscGhhID0gbWF4KG1heEFscGhhLCBjdXJDb2xvci5hKTtcXG4gICAgfVxcbiAgICBmbG9hdCByZXN1bHRBbHBoYSA9IG1heChtYXhBbHBoYSwgb3duQ29sb3IuYSk7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoKG93bkNvbG9yLnJnYiArIG91dGxpbmVDb2xvci5yZ2IgKiAoMS4gLSBvd25Db2xvci5hKSkgKiByZXN1bHRBbHBoYSwgcmVzdWx0QWxwaGEpO1xcbn1cXG5cIixuPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4obixyKXt2b2lkIDA9PT1uJiYobj0xKSx2b2lkIDA9PT1yJiYocj0wKSxlLmNhbGwodGhpcyxvLHQucmVwbGFjZSgvJVRISUNLTkVTUyUvZ2ksKDEvbikudG9GaXhlZCg3KSkpLHRoaXMudGhpY2tuZXNzPW4sdGhpcy51bmlmb3Jtcy5vdXRsaW5lQ29sb3I9bmV3IEZsb2F0MzJBcnJheShbMCwwLDAsMV0pLHRoaXMuY29sb3I9cn1lJiYobi5fX3Byb3RvX189ZSksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciByPXtjb2xvcjp7Y29uZmlndXJhYmxlOiEwfSx0aGlja25lc3M6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLmNvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiBQSVhJLnV0aWxzLnJnYjJoZXgodGhpcy51bmlmb3Jtcy5vdXRsaW5lQ29sb3IpfSxyLmNvbG9yLnNldD1mdW5jdGlvbihlKXtQSVhJLnV0aWxzLmhleDJyZ2IoZSx0aGlzLnVuaWZvcm1zLm91dGxpbmVDb2xvcil9LHIudGhpY2tuZXNzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnRoaWNrbmVzc30sci50aGlja25lc3Muc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudGhpY2tuZXNzPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4ucHJvdG90eXBlLHIpLG59KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuT3V0bGluZUZpbHRlcj1uLGUuT3V0bGluZUZpbHRlcj1uLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItb3V0bGluZS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXBpeGVsYXRlIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1waXhlbGF0ZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLG8pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP28oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG8pOm8oZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgbz1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSB2ZWMyIHNpemU7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxuXFxudmVjMiBtYXBDb29yZCggdmVjMiBjb29yZCApXFxue1xcbiAgICBjb29yZCAqPSBmaWx0ZXJBcmVhLnh5O1xcbiAgICBjb29yZCArPSBmaWx0ZXJBcmVhLnp3O1xcblxcbiAgICByZXR1cm4gY29vcmQ7XFxufVxcblxcbnZlYzIgdW5tYXBDb29yZCggdmVjMiBjb29yZCApXFxue1xcbiAgICBjb29yZCAtPSBmaWx0ZXJBcmVhLnp3O1xcbiAgICBjb29yZCAvPSBmaWx0ZXJBcmVhLnh5O1xcblxcbiAgICByZXR1cm4gY29vcmQ7XFxufVxcblxcbnZlYzIgcGl4ZWxhdGUodmVjMiBjb29yZCwgdmVjMiBzaXplKVxcbntcXG5cXHRyZXR1cm4gZmxvb3IoIGNvb3JkIC8gc2l6ZSApICogc2l6ZTtcXG59XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICB2ZWMyIGNvb3JkID0gbWFwQ29vcmQodlRleHR1cmVDb29yZCk7XFxuXFxuICAgIGNvb3JkID0gcGl4ZWxhdGUoY29vcmQsIHNpemUpO1xcblxcbiAgICBjb29yZCA9IHVubWFwQ29vcmQoY29vcmQpO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNvb3JkKTtcXG59XFxuXCIsbj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKG4pe3ZvaWQgMD09PW4mJihuPTEwKSxlLmNhbGwodGhpcyxvLHIpLHRoaXMuc2l6ZT1ufWUmJihuLl9fcHJvdG9fXz1lKSwobi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW47dmFyIHQ9e3NpemU6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiB0LnNpemUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2l6ZX0sdC5zaXplLnNldD1mdW5jdGlvbihlKXtcIm51bWJlclwiPT10eXBlb2YgZSYmKGU9W2UsZV0pLHRoaXMudW5pZm9ybXMuc2l6ZT1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSx0KSxufShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlBpeGVsYXRlRmlsdGVyPW4sZS5QaXhlbGF0ZUZpbHRlcj1uLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItcGl4ZWxhdGUuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1yYWRpYWwtYmx1ciAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItcmFkaWFsLWJsdXIgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnVuaWZvcm0gZmxvYXQgdVJhZGlhbjtcXG51bmlmb3JtIHZlYzIgdUNlbnRlcjtcXG51bmlmb3JtIGZsb2F0IHVSYWRpdXM7XFxudW5pZm9ybSBpbnQgdUtlcm5lbFNpemU7XFxuXFxuY29uc3QgaW50IE1BWF9LRVJORUxfU0laRSA9IDIwNDg7XFxuY29uc3QgaW50IElURVJBVElPTiA9IE1BWF9LRVJORUxfU0laRSAtIDE7XFxuXFxuLy8gZmxvYXQga2VybmVsU2l6ZSA9IG1pbihmbG9hdCh1S2VybmVsU2l6ZSksIGZsb2F0KE1BWF9LRVJORUxTSVpFKSk7XFxuXFxuLy8gSW4gcmVhbCB1c2UtY2FzZSAsIHVLZXJuZWxTaXplIDwgTUFYX0tFUk5FTFNJWkUgYWxtb3N0IGFsd2F5cy5cXG4vLyBTbyB1c2UgdUtlcm5lbFNpemUgZGlyZWN0bHkuXFxuZmxvYXQga2VybmVsU2l6ZSA9IGZsb2F0KHVLZXJuZWxTaXplKTtcXG5mbG9hdCBrID0ga2VybmVsU2l6ZSAtIDEuMDtcXG5cXG5cXG52ZWMyIGNlbnRlciA9IHVDZW50ZXIueHkgLyBmaWx0ZXJBcmVhLnh5O1xcbmZsb2F0IGFzcGVjdCA9IGZpbHRlckFyZWEueSAvIGZpbHRlckFyZWEueDtcXG5cXG5mbG9hdCBncmFkaWVudCA9IHVSYWRpdXMgLyBmaWx0ZXJBcmVhLnggKiAwLjM7XFxuZmxvYXQgcmFkaXVzID0gdVJhZGl1cyAvIGZpbHRlckFyZWEueCAtIGdyYWRpZW50ICogMC41O1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgaWYgKHVLZXJuZWxTaXplID09IDApXFxuICAgIHtcXG4gICAgICAgIHJldHVybjtcXG4gICAgfVxcblxcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZDtcXG5cXG4gICAgdmVjMiBkaXIgPSB2ZWMyKGNlbnRlciAtIGNvb3JkKTtcXG4gICAgZmxvYXQgZGlzdCA9IGxlbmd0aCh2ZWMyKGRpci54LCBkaXIueSAqIGFzcGVjdCkpO1xcblxcbiAgICBmbG9hdCByYWRpYW5TdGVwO1xcblxcbiAgICBpZiAocmFkaXVzID49IDAuMCAmJiBkaXN0ID4gcmFkaXVzKSB7XFxuICAgICAgICBmbG9hdCBkZWx0YSA9IGRpc3QgLSByYWRpdXM7XFxuICAgICAgICBmbG9hdCBnYXAgPSBncmFkaWVudDtcXG4gICAgICAgIGZsb2F0IHNjYWxlID0gMS4wIC0gYWJzKGRlbHRhIC8gZ2FwKTtcXG4gICAgICAgIGlmIChzY2FsZSA8PSAwLjApIHtcXG4gICAgICAgICAgICByZXR1cm47XFxuICAgICAgICB9XFxuICAgICAgICByYWRpYW5TdGVwID0gdVJhZGlhbiAqIHNjYWxlIC8gaztcXG4gICAgfSBlbHNlIHtcXG4gICAgICAgIHJhZGlhblN0ZXAgPSB1UmFkaWFuIC8gaztcXG4gICAgfVxcblxcbiAgICBmbG9hdCBzID0gc2luKHJhZGlhblN0ZXApO1xcbiAgICBmbG9hdCBjID0gY29zKHJhZGlhblN0ZXApO1xcbiAgICBtYXQyIHJvdGF0aW9uTWF0cml4ID0gbWF0Mih2ZWMyKGMsIC1zKSwgdmVjMihzLCBjKSk7XFxuXFxuICAgIGZvcihpbnQgaSA9IDA7IGkgPCBJVEVSQVRJT047IGkrKykge1xcbiAgICAgICAgaWYgKGkgPT0gaW50KGspKSB7XFxuICAgICAgICAgICAgYnJlYWs7XFxuICAgICAgICB9XFxuXFxuICAgICAgICBjb29yZCAtPSBjZW50ZXI7XFxuICAgICAgICBjb29yZC55ICo9IGFzcGVjdDtcXG4gICAgICAgIGNvb3JkID0gcm90YXRpb25NYXRyaXggKiBjb29yZDtcXG4gICAgICAgIGNvb3JkLnkgLz0gYXNwZWN0O1xcbiAgICAgICAgY29vcmQgKz0gY2VudGVyO1xcblxcbiAgICAgICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNvb3JkKTtcXG5cXG4gICAgICAgIC8vIHN3aXRjaCB0byBwcmUtbXVsdGlwbGllZCBhbHBoYSB0byBjb3JyZWN0bHkgYmx1ciB0cmFuc3BhcmVudCBpbWFnZXNcXG4gICAgICAgIC8vIHNhbXBsZS5yZ2IgKj0gc2FtcGxlLmE7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgKz0gc2FtcGxlO1xcbiAgICB9XFxuICAgIGdsX0ZyYWdDb2xvciAvPSBrZXJuZWxTaXplO1xcbn1cXG5cIixyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHIocixpLG8sYSl7dm9pZCAwPT09ciYmKHI9MCksdm9pZCAwPT09aSYmKGk9WzAsMF0pLHZvaWQgMD09PW8mJihvPTUpLHZvaWQgMD09PWEmJihhPS0xKSxlLmNhbGwodGhpcyxuLHQpLHRoaXMuX2FuZ2xlPTAsdGhpcy5hbmdsZT1yLHRoaXMuY2VudGVyPWksdGhpcy5rZXJuZWxTaXplPW8sdGhpcy5yYWRpdXM9YX1lJiYoci5fX3Byb3RvX189ZSksKHIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1yO3ZhciBpPXthbmdsZTp7Y29uZmlndXJhYmxlOiEwfSxjZW50ZXI6e2NvbmZpZ3VyYWJsZTohMH0scmFkaXVzOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSxuLHQscil7dGhpcy51bmlmb3Jtcy51S2VybmVsU2l6ZT0wIT09dGhpcy5fYW5nbGU/dGhpcy5rZXJuZWxTaXplOjAsZS5hcHBseUZpbHRlcih0aGlzLG4sdCxyKX0saS5hbmdsZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5fYW5nbGU9ZSx0aGlzLnVuaWZvcm1zLnVSYWRpYW49ZSpNYXRoLlBJLzE4MH0saS5hbmdsZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYW5nbGV9LGkuY2VudGVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVDZW50ZXJ9LGkuY2VudGVyLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnVDZW50ZXI9ZX0saS5yYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudVJhZGl1c30saS5yYWRpdXMuc2V0PWZ1bmN0aW9uKGUpeyhlPDB8fGU9PT0xLzApJiYoZT0tMSksdGhpcy51bmlmb3Jtcy51UmFkaXVzPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHIucHJvdG90eXBlLGkpLHJ9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuUmFkaWFsQmx1ckZpbHRlcj1yLGUuUmFkaWFsQmx1ckZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItcmFkaWFsLWJsdXIuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1yZ2Itc3BsaXQgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXJnYi1zcGxpdCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHIpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3IoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHIpOnIoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWMyIHJlZDtcXG51bmlmb3JtIHZlYzIgZ3JlZW47XFxudW5pZm9ybSB2ZWMyIGJsdWU7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgIGdsX0ZyYWdDb2xvci5yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgcmVkL2ZpbHRlckFyZWEueHkpLnI7XFxuICAgZ2xfRnJhZ0NvbG9yLmcgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBncmVlbi9maWx0ZXJBcmVhLnh5KS5nO1xcbiAgIGdsX0ZyYWdDb2xvci5iID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgYmx1ZS9maWx0ZXJBcmVhLnh5KS5iO1xcbiAgIGdsX0ZyYWdDb2xvci5hID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKS5hO1xcbn1cXG5cIixuPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4obixvLGkpe3ZvaWQgMD09PW4mJihuPVstMTAsMF0pLHZvaWQgMD09PW8mJihvPVswLDEwXSksdm9pZCAwPT09aSYmKGk9WzAsMF0pLGUuY2FsbCh0aGlzLHIsdCksdGhpcy5yZWQ9bix0aGlzLmdyZWVuPW8sdGhpcy5ibHVlPWl9ZSYmKG4uX19wcm90b19fPWUpLChuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bjt2YXIgbz17cmVkOntjb25maWd1cmFibGU6ITB9LGdyZWVuOntjb25maWd1cmFibGU6ITB9LGJsdWU6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBvLnJlZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5yZWR9LG8ucmVkLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnJlZD1lfSxvLmdyZWVuLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmdyZWVufSxvLmdyZWVuLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmdyZWVuPWV9LG8uYmx1ZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ibHVlfSxvLmJsdWUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYmx1ZT1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxvKSxufShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlJHQlNwbGl0RmlsdGVyPW4sZS5SR0JTcGxpdEZpbHRlcj1uLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItcmdiLXNwbGl0LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItc2hvY2t3YXZlIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1zaG9ja3dhdmUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsbj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJDbGFtcDtcXG5cXG51bmlmb3JtIHZlYzIgY2VudGVyO1xcblxcbnVuaWZvcm0gZmxvYXQgYW1wbGl0dWRlO1xcbnVuaWZvcm0gZmxvYXQgd2F2ZWxlbmd0aDtcXG4vLyB1bmlmb3JtIGZsb2F0IHBvd2VyO1xcbnVuaWZvcm0gZmxvYXQgYnJpZ2h0bmVzcztcXG51bmlmb3JtIGZsb2F0IHNwZWVkO1xcbnVuaWZvcm0gZmxvYXQgcmFkaXVzO1xcblxcbnVuaWZvcm0gZmxvYXQgdGltZTtcXG5cXG5jb25zdCBmbG9hdCBQSSA9IDMuMTQxNTk7XFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgIGZsb2F0IGhhbGZXYXZlbGVuZ3RoID0gd2F2ZWxlbmd0aCAqIDAuNSAvIGZpbHRlckFyZWEueDtcXG4gICAgZmxvYXQgbWF4UmFkaXVzID0gcmFkaXVzIC8gZmlsdGVyQXJlYS54O1xcbiAgICBmbG9hdCBjdXJyZW50UmFkaXVzID0gdGltZSAqIHNwZWVkIC8gZmlsdGVyQXJlYS54O1xcblxcbiAgICBmbG9hdCBmYWRlID0gMS4wO1xcblxcbiAgICBpZiAobWF4UmFkaXVzID4gMC4wKSB7XFxuICAgICAgICBpZiAoY3VycmVudFJhZGl1cyA+IG1heFJhZGl1cykge1xcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgICAgICAgICAgcmV0dXJuO1xcbiAgICAgICAgfVxcbiAgICAgICAgZmFkZSA9IDEuMCAtIHBvdyhjdXJyZW50UmFkaXVzIC8gbWF4UmFkaXVzLCAyLjApO1xcbiAgICB9XFxuXFxuICAgIHZlYzIgZGlyID0gdmVjMih2VGV4dHVyZUNvb3JkIC0gY2VudGVyIC8gZmlsdGVyQXJlYS54eSk7XFxuICAgIGRpci55ICo9IGZpbHRlckFyZWEueSAvIGZpbHRlckFyZWEueDtcXG4gICAgZmxvYXQgZGlzdCA9IGxlbmd0aChkaXIpO1xcblxcbiAgICBpZiAoZGlzdCA8PSAwLjAgfHwgZGlzdCA8IGN1cnJlbnRSYWRpdXMgLSBoYWxmV2F2ZWxlbmd0aCB8fCBkaXN0ID4gY3VycmVudFJhZGl1cyArIGhhbGZXYXZlbGVuZ3RoKSB7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICAgICAgcmV0dXJuO1xcbiAgICB9XFxuXFxuICAgIHZlYzIgZGlmZlVWID0gbm9ybWFsaXplKGRpcik7XFxuXFxuICAgIGZsb2F0IGRpZmYgPSAoZGlzdCAtIGN1cnJlbnRSYWRpdXMpIC8gaGFsZldhdmVsZW5ndGg7XFxuXFxuICAgIGZsb2F0IHAgPSAxLjAgLSBwb3coYWJzKGRpZmYpLCAyLjApO1xcblxcbiAgICAvLyBmbG9hdCBwb3dEaWZmID0gZGlmZiAqIHBvdyhwLCAyLjApICogKCBhbXBsaXR1ZGUgKiBmYWRlICk7XFxuICAgIGZsb2F0IHBvd0RpZmYgPSAxLjI1ICogc2luKGRpZmYgKiBQSSkgKiBwICogKCBhbXBsaXR1ZGUgKiBmYWRlICk7XFxuXFxuICAgIHZlYzIgb2Zmc2V0ID0gZGlmZlVWICogcG93RGlmZiAvIGZpbHRlckFyZWEueHk7XFxuXFxuICAgIC8vIERvIGNsYW1wIDpcXG4gICAgdmVjMiBjb29yZCA9IHZUZXh0dXJlQ29vcmQgKyBvZmZzZXQ7XFxuICAgIHZlYzIgY2xhbXBlZENvb3JkID0gY2xhbXAoY29vcmQsIGZpbHRlckNsYW1wLnh5LCBmaWx0ZXJDbGFtcC56dyk7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY2xhbXBlZENvb3JkKTtcXG4gICAgaWYgKGNvb3JkICE9IGNsYW1wZWRDb29yZCkge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yICo9IG1heCgwLjAsIDEuMCAtIGxlbmd0aChjb29yZCAtIGNsYW1wZWRDb29yZCkpO1xcbiAgICB9XFxuXFxuICAgIC8vIE5vIGNsYW1wIDpcXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgb2Zmc2V0KTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yLnJnYiAqPSAxLjAgKyAoYnJpZ2h0bmVzcyAtIDEuMCkgKiBwICogZmFkZTtcXG59XFxuXCIscj1mdW5jdGlvbihlKXtmdW5jdGlvbiByKHIsaSxvKXt2b2lkIDA9PT1yJiYocj1bMCwwXSksdm9pZCAwPT09aSYmKGk9e30pLHZvaWQgMD09PW8mJihvPTApLGUuY2FsbCh0aGlzLHQsbiksdGhpcy5jZW50ZXI9cixBcnJheS5pc0FycmF5KGkpJiYoY29uc29sZS53YXJuKFwiRGVwcmVjYXRlZCBXYXJuaW5nOiBTaG9ja3dhdmVGaWx0ZXIgcGFyYW1zIEFycmF5IGhhcyBiZWVuIGNoYW5nZWQgdG8gb3B0aW9ucyBPYmplY3QuXCIpLGk9e30pLGk9T2JqZWN0LmFzc2lnbih7YW1wbGl0dWRlOjMwLHdhdmVsZW5ndGg6MTYwLGJyaWdodG5lc3M6MSxzcGVlZDo1MDAscmFkaXVzOi0xfSxpKSx0aGlzLmFtcGxpdHVkZT1pLmFtcGxpdHVkZSx0aGlzLndhdmVsZW5ndGg9aS53YXZlbGVuZ3RoLHRoaXMuYnJpZ2h0bmVzcz1pLmJyaWdodG5lc3MsdGhpcy5zcGVlZD1pLnNwZWVkLHRoaXMucmFkaXVzPWkucmFkaXVzLHRoaXMudGltZT1vfWUmJihyLl9fcHJvdG9fXz1lKSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIGk9e2NlbnRlcjp7Y29uZmlndXJhYmxlOiEwfSxhbXBsaXR1ZGU6e2NvbmZpZ3VyYWJsZTohMH0sd2F2ZWxlbmd0aDp7Y29uZmlndXJhYmxlOiEwfSxicmlnaHRuZXNzOntjb25maWd1cmFibGU6ITB9LHNwZWVkOntjb25maWd1cmFibGU6ITB9LHJhZGl1czp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsdCxuLHIpe3RoaXMudW5pZm9ybXMudGltZT10aGlzLnRpbWUsZS5hcHBseUZpbHRlcih0aGlzLHQsbixyKX0saS5jZW50ZXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuY2VudGVyfSxpLmNlbnRlci5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5jZW50ZXI9ZX0saS5hbXBsaXR1ZGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYW1wbGl0dWRlfSxpLmFtcGxpdHVkZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5hbXBsaXR1ZGU9ZX0saS53YXZlbGVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLndhdmVsZW5ndGh9LGkud2F2ZWxlbmd0aC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy53YXZlbGVuZ3RoPWV9LGkuYnJpZ2h0bmVzcy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5icmlnaHRuZXNzfSxpLmJyaWdodG5lc3Muc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYnJpZ2h0bmVzcz1lfSxpLnNwZWVkLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNwZWVkfSxpLnNwZWVkLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnNwZWVkPWV9LGkucmFkaXVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnJhZGl1c30saS5yYWRpdXMuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMucmFkaXVzPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHIucHJvdG90eXBlLGkpLHJ9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuU2hvY2t3YXZlRmlsdGVyPXIsZS5TaG9ja3dhdmVGaWx0ZXI9cixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXNob2Nrd2F2ZS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXNpbXBsZS1saWdodG1hcCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciB0PVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLG89XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHNhbXBsZXIyRCB1TGlnaHRtYXA7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxudW5pZm9ybSB2ZWM0IGFtYmllbnRDb2xvcjtcXG52b2lkIG1haW4oKSB7XFxuICAgIHZlYzQgZGlmZnVzZUNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjMiBsaWdodENvb3JkID0gKHZUZXh0dXJlQ29vcmQgKiBmaWx0ZXJBcmVhLnh5KSAvIGRpbWVuc2lvbnM7XFxuICAgIHZlYzQgbGlnaHQgPSB0ZXh0dXJlMkQodUxpZ2h0bWFwLCBsaWdodENvb3JkKTtcXG4gICAgdmVjMyBhbWJpZW50ID0gYW1iaWVudENvbG9yLnJnYiAqIGFtYmllbnRDb2xvci5hO1xcbiAgICB2ZWMzIGludGVuc2l0eSA9IGFtYmllbnQgKyBsaWdodC5yZ2I7XFxuICAgIHZlYzMgZmluYWxDb2xvciA9IGRpZmZ1c2VDb2xvci5yZ2IgKiBpbnRlbnNpdHk7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZmluYWxDb2xvciwgZGlmZnVzZUNvbG9yLmEpO1xcbn1cXG5cIixpPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIGkoaSxyLG4pe3ZvaWQgMD09PXImJihyPTApLHZvaWQgMD09PW4mJihuPTEpLGUuY2FsbCh0aGlzLHQsbyksdGhpcy51bmlmb3Jtcy5hbWJpZW50Q29sb3I9bmV3IEZsb2F0MzJBcnJheShbMCwwLDAsbl0pLHRoaXMudGV4dHVyZT1pLHRoaXMuY29sb3I9cn1lJiYoaS5fX3Byb3RvX189ZSksKGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1pO3ZhciByPXt0ZXh0dXJlOntjb25maWd1cmFibGU6ITB9LGNvbG9yOntjb25maWd1cmFibGU6ITB9LGFscGhhOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSx0LG8saSl7dGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzBdPXQuc291cmNlRnJhbWUud2lkdGgsdGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzFdPXQuc291cmNlRnJhbWUuaGVpZ2h0LGUuYXBwbHlGaWx0ZXIodGhpcyx0LG8saSl9LHIudGV4dHVyZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51TGlnaHRtYXB9LHIudGV4dHVyZS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy51TGlnaHRtYXA9ZX0sci5jb2xvci5zZXQ9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy51bmlmb3Jtcy5hbWJpZW50Q29sb3I7XCJudW1iZXJcIj09dHlwZW9mIGU/KFBJWEkudXRpbHMuaGV4MnJnYihlLHQpLHRoaXMuX2NvbG9yPWUpOih0WzBdPWVbMF0sdFsxXT1lWzFdLHRbMl09ZVsyXSx0WzNdPWVbM10sdGhpcy5fY29sb3I9UElYSS51dGlscy5yZ2IyaGV4KHQpKX0sci5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29sb3J9LHIuYWxwaGEuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYW1iaWVudENvbG9yWzNdfSxyLmFscGhhLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmFtYmllbnRDb2xvclszXT1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhpLnByb3RvdHlwZSxyKSxpfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlNpbXBsZUxpZ2h0bWFwRmlsdGVyPWksZS5TaW1wbGVMaWdodG1hcEZpbHRlcj1pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItc2ltcGxlLWxpZ2h0bWFwLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItdGlsdC1zaGlmdCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItdGlsdC1zaGlmdCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbih0LGkpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2koZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGkpOmkodC5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgaT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixlPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBibHVyO1xcbnVuaWZvcm0gZmxvYXQgZ3JhZGllbnRCbHVyO1xcbnVuaWZvcm0gdmVjMiBzdGFydDtcXG51bmlmb3JtIHZlYzIgZW5kO1xcbnVuaWZvcm0gdmVjMiBkZWx0YTtcXG51bmlmb3JtIHZlYzIgdGV4U2l6ZTtcXG5cXG5mbG9hdCByYW5kb20odmVjMyBzY2FsZSwgZmxvYXQgc2VlZClcXG57XFxuICAgIHJldHVybiBmcmFjdChzaW4oZG90KGdsX0ZyYWdDb29yZC54eXogKyBzZWVkLCBzY2FsZSkpICogNDM3NTguNTQ1MyArIHNlZWQpO1xcbn1cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIHZlYzQgY29sb3IgPSB2ZWM0KDAuMCk7XFxuICAgIGZsb2F0IHRvdGFsID0gMC4wO1xcblxcbiAgICBmbG9hdCBvZmZzZXQgPSByYW5kb20odmVjMygxMi45ODk4LCA3OC4yMzMsIDE1MS43MTgyKSwgMC4wKTtcXG4gICAgdmVjMiBub3JtYWwgPSBub3JtYWxpemUodmVjMihzdGFydC55IC0gZW5kLnksIGVuZC54IC0gc3RhcnQueCkpO1xcbiAgICBmbG9hdCByYWRpdXMgPSBzbW9vdGhzdGVwKDAuMCwgMS4wLCBhYnMoZG90KHZUZXh0dXJlQ29vcmQgKiB0ZXhTaXplIC0gc3RhcnQsIG5vcm1hbCkpIC8gZ3JhZGllbnRCbHVyKSAqIGJsdXI7XFxuXFxuICAgIGZvciAoZmxvYXQgdCA9IC0zMC4wOyB0IDw9IDMwLjA7IHQrKylcXG4gICAge1xcbiAgICAgICAgZmxvYXQgcGVyY2VudCA9ICh0ICsgb2Zmc2V0IC0gMC41KSAvIDMwLjA7XFxuICAgICAgICBmbG9hdCB3ZWlnaHQgPSAxLjAgLSBhYnMocGVyY2VudCk7XFxuICAgICAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIGRlbHRhIC8gdGV4U2l6ZSAqIHBlcmNlbnQgKiByYWRpdXMpO1xcbiAgICAgICAgc2FtcGxlLnJnYiAqPSBzYW1wbGUuYTtcXG4gICAgICAgIGNvbG9yICs9IHNhbXBsZSAqIHdlaWdodDtcXG4gICAgICAgIHRvdGFsICs9IHdlaWdodDtcXG4gICAgfVxcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBjb2xvciAvIHRvdGFsO1xcbiAgICBnbF9GcmFnQ29sb3IucmdiIC89IGdsX0ZyYWdDb2xvci5hICsgMC4wMDAwMTtcXG59XFxuXCIscj1mdW5jdGlvbih0KXtmdW5jdGlvbiByKHIsbixvLGwpe3ZvaWQgMD09PXImJihyPTEwMCksdm9pZCAwPT09biYmKG49NjAwKSx2b2lkIDA9PT1vJiYobz1udWxsKSx2b2lkIDA9PT1sJiYobD1udWxsKSx0LmNhbGwodGhpcyxpLGUpLHRoaXMudW5pZm9ybXMuYmx1cj1yLHRoaXMudW5pZm9ybXMuZ3JhZGllbnRCbHVyPW4sdGhpcy51bmlmb3Jtcy5zdGFydD1vfHxuZXcgUElYSS5Qb2ludCgwLHdpbmRvdy5pbm5lckhlaWdodC8yKSx0aGlzLnVuaWZvcm1zLmVuZD1sfHxuZXcgUElYSS5Qb2ludCg2MDAsd2luZG93LmlubmVySGVpZ2h0LzIpLHRoaXMudW5pZm9ybXMuZGVsdGE9bmV3IFBJWEkuUG9pbnQoMzAsMzApLHRoaXMudW5pZm9ybXMudGV4U2l6ZT1uZXcgUElYSS5Qb2ludCh3aW5kb3cuaW5uZXJXaWR0aCx3aW5kb3cuaW5uZXJIZWlnaHQpLHRoaXMudXBkYXRlRGVsdGEoKX10JiYoci5fX3Byb3RvX189dCksKHIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1yO3ZhciBuPXtibHVyOntjb25maWd1cmFibGU6ITB9LGdyYWRpZW50Qmx1cjp7Y29uZmlndXJhYmxlOiEwfSxzdGFydDp7Y29uZmlndXJhYmxlOiEwfSxlbmQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnByb3RvdHlwZS51cGRhdGVEZWx0YT1mdW5jdGlvbigpe3RoaXMudW5pZm9ybXMuZGVsdGEueD0wLHRoaXMudW5pZm9ybXMuZGVsdGEueT0wfSxuLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYmx1cn0sbi5ibHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLnVuaWZvcm1zLmJsdXI9dH0sbi5ncmFkaWVudEJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZ3JhZGllbnRCbHVyfSxuLmdyYWRpZW50Qmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy51bmlmb3Jtcy5ncmFkaWVudEJsdXI9dH0sbi5zdGFydC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zdGFydH0sbi5zdGFydC5zZXQ9ZnVuY3Rpb24odCl7dGhpcy51bmlmb3Jtcy5zdGFydD10LHRoaXMudXBkYXRlRGVsdGEoKX0sbi5lbmQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZW5kfSxuLmVuZC5zZXQ9ZnVuY3Rpb24odCl7dGhpcy51bmlmb3Jtcy5lbmQ9dCx0aGlzLnVwZGF0ZURlbHRhKCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHIucHJvdG90eXBlLG4pLHJ9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuVGlsdFNoaWZ0QXhpc0ZpbHRlcj1yO3ZhciBuPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGkoKXt0LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gdCYmKGkuX19wcm90b19fPXQpLGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpLGkucHJvdG90eXBlLmNvbnN0cnVjdG9yPWksaS5wcm90b3R5cGUudXBkYXRlRGVsdGE9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnVuaWZvcm1zLmVuZC54LXRoaXMudW5pZm9ybXMuc3RhcnQueCxpPXRoaXMudW5pZm9ybXMuZW5kLnktdGhpcy51bmlmb3Jtcy5zdGFydC55LGU9TWF0aC5zcXJ0KHQqdCtpKmkpO3RoaXMudW5pZm9ybXMuZGVsdGEueD10L2UsdGhpcy51bmlmb3Jtcy5kZWx0YS55PWkvZX0saX0ocik7UElYSS5maWx0ZXJzLlRpbHRTaGlmdFhGaWx0ZXI9bjt2YXIgbz1mdW5jdGlvbih0KXtmdW5jdGlvbiBpKCl7dC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9cmV0dXJuIHQmJihpLl9fcHJvdG9fXz10KSxpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSxpLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1pLGkucHJvdG90eXBlLnVwZGF0ZURlbHRhPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy51bmlmb3Jtcy5lbmQueC10aGlzLnVuaWZvcm1zLnN0YXJ0LngsaT10aGlzLnVuaWZvcm1zLmVuZC55LXRoaXMudW5pZm9ybXMuc3RhcnQueSxlPU1hdGguc3FydCh0KnQraSppKTt0aGlzLnVuaWZvcm1zLmRlbHRhLng9LWkvZSx0aGlzLnVuaWZvcm1zLmRlbHRhLnk9dC9lfSxpfShyKTtQSVhJLmZpbHRlcnMuVGlsdFNoaWZ0WUZpbHRlcj1vO3ZhciBsPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGkoaSxlLHIsbCl7dm9pZCAwPT09aSYmKGk9MTAwKSx2b2lkIDA9PT1lJiYoZT02MDApLHZvaWQgMD09PXImJihyPW51bGwpLHZvaWQgMD09PWwmJihsPW51bGwpLHQuY2FsbCh0aGlzKSx0aGlzLnRpbHRTaGlmdFhGaWx0ZXI9bmV3IG4oaSxlLHIsbCksdGhpcy50aWx0U2hpZnRZRmlsdGVyPW5ldyBvKGksZSxyLGwpfXQmJihpLl9fcHJvdG9fXz10KSwoaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWk7dmFyIGU9e2JsdXI6e2NvbmZpZ3VyYWJsZTohMH0sZ3JhZGllbnRCbHVyOntjb25maWd1cmFibGU6ITB9LHN0YXJ0Ontjb25maWd1cmFibGU6ITB9LGVuZDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKHQsaSxlKXt2YXIgcj10LmdldFJlbmRlclRhcmdldCghMCk7dGhpcy50aWx0U2hpZnRYRmlsdGVyLmFwcGx5KHQsaSxyKSx0aGlzLnRpbHRTaGlmdFlGaWx0ZXIuYXBwbHkodCxyLGUpLHQucmV0dXJuUmVuZGVyVGFyZ2V0KHIpfSxlLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlsdFNoaWZ0WEZpbHRlci5ibHVyfSxlLmJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGlsdFNoaWZ0WEZpbHRlci5ibHVyPXRoaXMudGlsdFNoaWZ0WUZpbHRlci5ibHVyPXR9LGUuZ3JhZGllbnRCbHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuZ3JhZGllbnRCbHVyfSxlLmdyYWRpZW50Qmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy50aWx0U2hpZnRYRmlsdGVyLmdyYWRpZW50Qmx1cj10aGlzLnRpbHRTaGlmdFlGaWx0ZXIuZ3JhZGllbnRCbHVyPXR9LGUuc3RhcnQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlsdFNoaWZ0WEZpbHRlci5zdGFydH0sZS5zdGFydC5zZXQ9ZnVuY3Rpb24odCl7dGhpcy50aWx0U2hpZnRYRmlsdGVyLnN0YXJ0PXRoaXMudGlsdFNoaWZ0WUZpbHRlci5zdGFydD10fSxlLmVuZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aWx0U2hpZnRYRmlsdGVyLmVuZH0sZS5lbmQuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGlsdFNoaWZ0WEZpbHRlci5lbmQ9dGhpcy50aWx0U2hpZnRZRmlsdGVyLmVuZD10fSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhpLnByb3RvdHlwZSxlKSxpfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlRpbHRTaGlmdEZpbHRlcj1sLHQuVGlsdFNoaWZ0RmlsdGVyPWwsdC5UaWx0U2hpZnRYRmlsdGVyPW4sdC5UaWx0U2hpZnRZRmlsdGVyPW8sdC5UaWx0U2hpZnRBeGlzRmlsdGVyPXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci10aWx0LXNoaWZ0LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItdHdpc3QgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXR3aXN0IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG8sbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihvLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG8pe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IHJhZGl1cztcXG51bmlmb3JtIGZsb2F0IGFuZ2xlO1xcbnVuaWZvcm0gdmVjMiBvZmZzZXQ7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxuXFxudmVjMiBtYXBDb29yZCggdmVjMiBjb29yZCApXFxue1xcbiAgICBjb29yZCAqPSBmaWx0ZXJBcmVhLnh5O1xcbiAgICBjb29yZCArPSBmaWx0ZXJBcmVhLnp3O1xcblxcbiAgICByZXR1cm4gY29vcmQ7XFxufVxcblxcbnZlYzIgdW5tYXBDb29yZCggdmVjMiBjb29yZCApXFxue1xcbiAgICBjb29yZCAtPSBmaWx0ZXJBcmVhLnp3O1xcbiAgICBjb29yZCAvPSBmaWx0ZXJBcmVhLnh5O1xcblxcbiAgICByZXR1cm4gY29vcmQ7XFxufVxcblxcbnZlYzIgdHdpc3QodmVjMiBjb29yZClcXG57XFxuICAgIGNvb3JkIC09IG9mZnNldDtcXG5cXG4gICAgZmxvYXQgZGlzdCA9IGxlbmd0aChjb29yZCk7XFxuXFxuICAgIGlmIChkaXN0IDwgcmFkaXVzKVxcbiAgICB7XFxuICAgICAgICBmbG9hdCByYXRpb0Rpc3QgPSAocmFkaXVzIC0gZGlzdCkgLyByYWRpdXM7XFxuICAgICAgICBmbG9hdCBhbmdsZU1vZCA9IHJhdGlvRGlzdCAqIHJhdGlvRGlzdCAqIGFuZ2xlO1xcbiAgICAgICAgZmxvYXQgcyA9IHNpbihhbmdsZU1vZCk7XFxuICAgICAgICBmbG9hdCBjID0gY29zKGFuZ2xlTW9kKTtcXG4gICAgICAgIGNvb3JkID0gdmVjMihjb29yZC54ICogYyAtIGNvb3JkLnkgKiBzLCBjb29yZC54ICogcyArIGNvb3JkLnkgKiBjKTtcXG4gICAgfVxcblxcbiAgICBjb29yZCArPSBvZmZzZXQ7XFxuXFxuICAgIHJldHVybiBjb29yZDtcXG59XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcblxcbiAgICB2ZWMyIGNvb3JkID0gbWFwQ29vcmQodlRleHR1cmVDb29yZCk7XFxuXFxuICAgIGNvb3JkID0gdHdpc3QoY29vcmQpO1xcblxcbiAgICBjb29yZCA9IHVubWFwQ29vcmQoY29vcmQpO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNvb3JkICk7XFxuXFxufVxcblwiLGU9ZnVuY3Rpb24obyl7ZnVuY3Rpb24gZShlLHQsaSl7dm9pZCAwPT09ZSYmKGU9MjAwKSx2b2lkIDA9PT10JiYodD00KSx2b2lkIDA9PT1pJiYoaT0yMCksby5jYWxsKHRoaXMsbixyKSx0aGlzLnJhZGl1cz1lLHRoaXMuYW5nbGU9dCx0aGlzLnBhZGRpbmc9aX1vJiYoZS5fX3Byb3RvX189byksKGUucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobyYmby5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1lO3ZhciB0PXtvZmZzZXQ6e2NvbmZpZ3VyYWJsZTohMH0scmFkaXVzOntjb25maWd1cmFibGU6ITB9LGFuZ2xlOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gdC5vZmZzZXQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMub2Zmc2V0fSx0Lm9mZnNldC5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5vZmZzZXQ9b30sdC5yYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucmFkaXVzfSx0LnJhZGl1cy5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5yYWRpdXM9b30sdC5hbmdsZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5hbmdsZX0sdC5hbmdsZS5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5hbmdsZT1vfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhlLnByb3RvdHlwZSx0KSxlfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlR3aXN0RmlsdGVyPWUsby5Ud2lzdEZpbHRlcj1lLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItdHdpc3QuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci16b29tLWJsdXIgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXpvb20tYmx1ciBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihuLGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUobi5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihuKXtcInVzZSBzdHJpY3RcIjt2YXIgZT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIix0PVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxuXFxudW5pZm9ybSB2ZWMyIHVDZW50ZXI7XFxudW5pZm9ybSBmbG9hdCB1U3RyZW5ndGg7XFxudW5pZm9ybSBmbG9hdCB1SW5uZXJSYWRpdXM7XFxudW5pZm9ybSBmbG9hdCB1UmFkaXVzO1xcblxcbmNvbnN0IGZsb2F0IE1BWF9LRVJORUxfU0laRSA9IDMyLjA7XFxuXFxuZmxvYXQgcmFuZG9tKHZlYzMgc2NhbGUsIGZsb2F0IHNlZWQpIHtcXG4gICAgLy8gdXNlIHRoZSBmcmFnbWVudCBwb3NpdGlvbiBmb3IgYSBkaWZmZXJlbnQgc2VlZCBwZXItcGl4ZWxcXG4gICAgcmV0dXJuIGZyYWN0KHNpbihkb3QoZ2xfRnJhZ0Nvb3JkLnh5eiArIHNlZWQsIHNjYWxlKSkgKiA0Mzc1OC41NDUzICsgc2VlZCk7XFxufVxcblxcbnZvaWQgbWFpbigpIHtcXG5cXG4gICAgZmxvYXQgbWluR3JhZGllbnQgPSB1SW5uZXJSYWRpdXMgKiAwLjM7XFxuICAgIGZsb2F0IGlubmVyUmFkaXVzID0gKHVJbm5lclJhZGl1cyArIG1pbkdyYWRpZW50ICogMC41KSAvIGZpbHRlckFyZWEueDtcXG5cXG4gICAgZmxvYXQgZ3JhZGllbnQgPSB1UmFkaXVzICogMC4zO1xcbiAgICBmbG9hdCByYWRpdXMgPSAodVJhZGl1cyAtIGdyYWRpZW50ICogMC41KSAvIGZpbHRlckFyZWEueDtcXG5cXG4gICAgZmxvYXQgY291bnRMaW1pdCA9IE1BWF9LRVJORUxfU0laRTtcXG5cXG4gICAgdmVjMiBkaXIgPSB2ZWMyKHVDZW50ZXIueHkgLyBmaWx0ZXJBcmVhLnh5IC0gdlRleHR1cmVDb29yZCk7XFxuICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgodmVjMihkaXIueCwgZGlyLnkgKiBmaWx0ZXJBcmVhLnkgLyBmaWx0ZXJBcmVhLngpKTtcXG5cXG4gICAgZmxvYXQgc3RyZW5ndGggPSB1U3RyZW5ndGg7XFxuXFxuICAgIGZsb2F0IGRlbHRhID0gMC4wO1xcbiAgICBmbG9hdCBnYXA7XFxuICAgIGlmIChkaXN0IDwgaW5uZXJSYWRpdXMpIHtcXG4gICAgICAgIGRlbHRhID0gaW5uZXJSYWRpdXMgLSBkaXN0O1xcbiAgICAgICAgZ2FwID0gbWluR3JhZGllbnQ7XFxuICAgIH0gZWxzZSBpZiAocmFkaXVzID49IDAuMCAmJiBkaXN0ID4gcmFkaXVzKSB7IC8vIHJhZGl1cyA8IDAgbWVhbnMgaXQncyBpbmZpbml0eVxcbiAgICAgICAgZGVsdGEgPSBkaXN0IC0gcmFkaXVzO1xcbiAgICAgICAgZ2FwID0gZ3JhZGllbnQ7XFxuICAgIH1cXG5cXG4gICAgaWYgKGRlbHRhID4gMC4wKSB7XFxuICAgICAgICBmbG9hdCBub3JtYWxDb3VudCA9IGdhcCAvIGZpbHRlckFyZWEueDtcXG4gICAgICAgIGRlbHRhID0gKG5vcm1hbENvdW50IC0gZGVsdGEpIC8gbm9ybWFsQ291bnQ7XFxuICAgICAgICBjb3VudExpbWl0ICo9IGRlbHRhO1xcbiAgICAgICAgc3RyZW5ndGggKj0gZGVsdGE7XFxuICAgICAgICBpZiAoY291bnRMaW1pdCA8IDEuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICAgICAgICAgIHJldHVybjtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICAvLyByYW5kb21pemUgdGhlIGxvb2t1cCB2YWx1ZXMgdG8gaGlkZSB0aGUgZml4ZWQgbnVtYmVyIG9mIHNhbXBsZXNcXG4gICAgZmxvYXQgb2Zmc2V0ID0gcmFuZG9tKHZlYzMoMTIuOTg5OCwgNzguMjMzLCAxNTEuNzE4MiksIDAuMCk7XFxuXFxuICAgIGZsb2F0IHRvdGFsID0gMC4wO1xcbiAgICB2ZWM0IGNvbG9yID0gdmVjNCgwLjApO1xcblxcbiAgICBkaXIgKj0gc3RyZW5ndGg7XFxuXFxuICAgIGZvciAoZmxvYXQgdCA9IDAuMDsgdCA8IE1BWF9LRVJORUxfU0laRTsgdCsrKSB7XFxuICAgICAgICBmbG9hdCBwZXJjZW50ID0gKHQgKyBvZmZzZXQpIC8gTUFYX0tFUk5FTF9TSVpFO1xcbiAgICAgICAgZmxvYXQgd2VpZ2h0ID0gNC4wICogKHBlcmNlbnQgLSBwZXJjZW50ICogcGVyY2VudCk7XFxuICAgICAgICB2ZWMyIHAgPSB2VGV4dHVyZUNvb3JkICsgZGlyICogcGVyY2VudDtcXG4gICAgICAgIHZlYzQgc2FtcGxlID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBwKTtcXG5cXG4gICAgICAgIC8vIHN3aXRjaCB0byBwcmUtbXVsdGlwbGllZCBhbHBoYSB0byBjb3JyZWN0bHkgYmx1ciB0cmFuc3BhcmVudCBpbWFnZXNcXG4gICAgICAgIC8vIHNhbXBsZS5yZ2IgKj0gc2FtcGxlLmE7XFxuXFxuICAgICAgICBjb2xvciArPSBzYW1wbGUgKiB3ZWlnaHQ7XFxuICAgICAgICB0b3RhbCArPSB3ZWlnaHQ7XFxuXFxuICAgICAgICBpZiAodCA+IGNvdW50TGltaXQpe1xcbiAgICAgICAgICAgIGJyZWFrO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yIC8gdG90YWw7XFxuXFxuICAgIC8vIHN3aXRjaCBiYWNrIGZyb20gcHJlLW11bHRpcGxpZWQgYWxwaGFcXG4gICAgZ2xfRnJhZ0NvbG9yLnJnYiAvPSBnbF9GcmFnQ29sb3IuYSArIDAuMDAwMDE7XFxuXFxufVxcblwiLHI9ZnVuY3Rpb24obil7ZnVuY3Rpb24gcihyLGksbyxhKXt2b2lkIDA9PT1yJiYocj0uMSksdm9pZCAwPT09aSYmKGk9WzAsMF0pLHZvaWQgMD09PW8mJihvPTApLHZvaWQgMD09PWEmJihhPS0xKSxuLmNhbGwodGhpcyxlLHQpLHRoaXMuY2VudGVyPWksdGhpcy5zdHJlbmd0aD1yLHRoaXMuaW5uZXJSYWRpdXM9byx0aGlzLnJhZGl1cz1hfW4mJihyLl9fcHJvdG9fXz1uKSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShuJiZuLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIGk9e2NlbnRlcjp7Y29uZmlndXJhYmxlOiEwfSxzdHJlbmd0aDp7Y29uZmlndXJhYmxlOiEwfSxpbm5lclJhZGl1czp7Y29uZmlndXJhYmxlOiEwfSxyYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLmNlbnRlci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51Q2VudGVyfSxpLmNlbnRlci5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy51Q2VudGVyPW59LGkuc3RyZW5ndGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudVN0cmVuZ3RofSxpLnN0cmVuZ3RoLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnVTdHJlbmd0aD1ufSxpLmlubmVyUmFkaXVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVJbm5lclJhZGl1c30saS5pbm5lclJhZGl1cy5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy51SW5uZXJSYWRpdXM9bn0saS5yYWRpdXMuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudVJhZGl1c30saS5yYWRpdXMuc2V0PWZ1bmN0aW9uKG4peyhuPDB8fG49PT0xLzApJiYobj0tMSksdGhpcy51bmlmb3Jtcy51UmFkaXVzPW59LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHIucHJvdG90eXBlLGkpLHJ9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuWm9vbUJsdXJGaWx0ZXI9cixuLlpvb21CbHVyRmlsdGVyPXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci16b29tLWJsdXIuanMubWFwXG4iLCIvKiFcbiAqIHBpeGktZmlsdGVycyAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBwaXhpLWZpbHRlcnMgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG5cInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgZmlsdGVyQWR2YW5jZWRCbG9vbT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWFkdmFuY2VkLWJsb29tXCIpLGZpbHRlckFzY2lpPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItYXNjaWlcIiksZmlsdGVyQmxvb209cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1ibG9vbVwiKSxmaWx0ZXJCdWxnZVBpbmNoPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItYnVsZ2UtcGluY2hcIiksZmlsdGVyQ29sb3JSZXBsYWNlPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItY29sb3ItcmVwbGFjZVwiKSxmaWx0ZXJDb252b2x1dGlvbj1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWNvbnZvbHV0aW9uXCIpLGZpbHRlckNyb3NzSGF0Y2g9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1jcm9zcy1oYXRjaFwiKSxmaWx0ZXJEb3Q9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1kb3RcIiksZmlsdGVyRHJvcFNoYWRvdz1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93XCIpLGZpbHRlckVtYm9zcz1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWVtYm9zc1wiKSxmaWx0ZXJHbG93PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItZ2xvd1wiKSxmaWx0ZXJHb2RyYXk9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1nb2RyYXlcIiksZmlsdGVyTW90aW9uQmx1cj1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLW1vdGlvbi1ibHVyXCIpLGZpbHRlck11bHRpQ29sb3JSZXBsYWNlPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZVwiKSxmaWx0ZXJPbGRGaWxtPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItb2xkLWZpbG1cIiksZmlsdGVyT3V0bGluZT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLW91dGxpbmVcIiksZmlsdGVyUGl4ZWxhdGU9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1waXhlbGF0ZVwiKSxmaWx0ZXJSZ2JTcGxpdD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXJnYi1zcGxpdFwiKSxmaWx0ZXJSYWRpYWxCbHVyPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItcmFkaWFsLWJsdXJcIiksZmlsdGVyU2hvY2t3YXZlPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItc2hvY2t3YXZlXCIpLGZpbHRlclNpbXBsZUxpZ2h0bWFwPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwXCIpLGZpbHRlclRpbHRTaGlmdD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXRpbHQtc2hpZnRcIiksZmlsdGVyVHdpc3Q9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci10d2lzdFwiKSxmaWx0ZXJab29tQmx1cj1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXpvb20tYmx1clwiKTtleHBvcnRzLkFkdmFuY2VkQmxvb21GaWx0ZXI9ZmlsdGVyQWR2YW5jZWRCbG9vbS5BZHZhbmNlZEJsb29tRmlsdGVyLGV4cG9ydHMuQXNjaWlGaWx0ZXI9ZmlsdGVyQXNjaWkuQXNjaWlGaWx0ZXIsZXhwb3J0cy5CbG9vbUZpbHRlcj1maWx0ZXJCbG9vbS5CbG9vbUZpbHRlcixleHBvcnRzLkJ1bGdlUGluY2hGaWx0ZXI9ZmlsdGVyQnVsZ2VQaW5jaC5CdWxnZVBpbmNoRmlsdGVyLGV4cG9ydHMuQ29sb3JSZXBsYWNlRmlsdGVyPWZpbHRlckNvbG9yUmVwbGFjZS5Db2xvclJlcGxhY2VGaWx0ZXIsZXhwb3J0cy5Db252b2x1dGlvbkZpbHRlcj1maWx0ZXJDb252b2x1dGlvbi5Db252b2x1dGlvbkZpbHRlcixleHBvcnRzLkNyb3NzSGF0Y2hGaWx0ZXI9ZmlsdGVyQ3Jvc3NIYXRjaC5Dcm9zc0hhdGNoRmlsdGVyLGV4cG9ydHMuRG90RmlsdGVyPWZpbHRlckRvdC5Eb3RGaWx0ZXIsZXhwb3J0cy5Ecm9wU2hhZG93RmlsdGVyPWZpbHRlckRyb3BTaGFkb3cuRHJvcFNoYWRvd0ZpbHRlcixleHBvcnRzLkVtYm9zc0ZpbHRlcj1maWx0ZXJFbWJvc3MuRW1ib3NzRmlsdGVyLGV4cG9ydHMuR2xvd0ZpbHRlcj1maWx0ZXJHbG93Lkdsb3dGaWx0ZXIsZXhwb3J0cy5Hb2RyYXlGaWx0ZXI9ZmlsdGVyR29kcmF5LkdvZHJheUZpbHRlcixleHBvcnRzLk1vdGlvbkJsdXJGaWx0ZXI9ZmlsdGVyTW90aW9uQmx1ci5Nb3Rpb25CbHVyRmlsdGVyLGV4cG9ydHMuTXVsdGlDb2xvclJlcGxhY2VGaWx0ZXI9ZmlsdGVyTXVsdGlDb2xvclJlcGxhY2UuTXVsdGlDb2xvclJlcGxhY2VGaWx0ZXIsZXhwb3J0cy5PbGRGaWxtRmlsdGVyPWZpbHRlck9sZEZpbG0uT2xkRmlsbUZpbHRlcixleHBvcnRzLk91dGxpbmVGaWx0ZXI9ZmlsdGVyT3V0bGluZS5PdXRsaW5lRmlsdGVyLGV4cG9ydHMuUGl4ZWxhdGVGaWx0ZXI9ZmlsdGVyUGl4ZWxhdGUuUGl4ZWxhdGVGaWx0ZXIsZXhwb3J0cy5SR0JTcGxpdEZpbHRlcj1maWx0ZXJSZ2JTcGxpdC5SR0JTcGxpdEZpbHRlcixleHBvcnRzLlJhZGlhbEJsdXJGaWx0ZXI9ZmlsdGVyUmFkaWFsQmx1ci5SYWRpYWxCbHVyRmlsdGVyLGV4cG9ydHMuU2hvY2t3YXZlRmlsdGVyPWZpbHRlclNob2Nrd2F2ZS5TaG9ja3dhdmVGaWx0ZXIsZXhwb3J0cy5TaW1wbGVMaWdodG1hcEZpbHRlcj1maWx0ZXJTaW1wbGVMaWdodG1hcC5TaW1wbGVMaWdodG1hcEZpbHRlcixleHBvcnRzLlRpbHRTaGlmdEZpbHRlcj1maWx0ZXJUaWx0U2hpZnQuVGlsdFNoaWZ0RmlsdGVyLGV4cG9ydHMuVGlsdFNoaWZ0QXhpc0ZpbHRlcj1maWx0ZXJUaWx0U2hpZnQuVGlsdFNoaWZ0QXhpc0ZpbHRlcixleHBvcnRzLlRpbHRTaGlmdFhGaWx0ZXI9ZmlsdGVyVGlsdFNoaWZ0LlRpbHRTaGlmdFhGaWx0ZXIsZXhwb3J0cy5UaWx0U2hpZnRZRmlsdGVyPWZpbHRlclRpbHRTaGlmdC5UaWx0U2hpZnRZRmlsdGVyLGV4cG9ydHMuVHdpc3RGaWx0ZXI9ZmlsdGVyVHdpc3QuVHdpc3RGaWx0ZXIsZXhwb3J0cy5ab29tQmx1ckZpbHRlcj1maWx0ZXJab29tQmx1ci5ab29tQmx1ckZpbHRlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktZmlsdGVycy5qcy5tYXBcbiIsIi8qIVxuICogcGl4aS1wYXJ0aWNsZXMgLSB2Mi4xLjlcbiAqIENvbXBpbGVkIFRodSwgMTYgTm92IDIwMTcgMDE6NTI6MzkgVVRDXG4gKlxuICogcGl4aS1wYXJ0aWNsZXMgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24odCl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUpbW9kdWxlLmV4cG9ydHM9dCgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSx0KTtlbHNle3ZhciBpO2k9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjp0aGlzLGkucGl4aVBhcnRpY2xlcz10KCl9fShmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbiB0KGksZSxzKXtmdW5jdGlvbiBhKG4sbyl7aWYoIWVbbl0pe2lmKCFpW25dKXt2YXIgaD1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFvJiZoKXJldHVybiBoKG4sITApO2lmKHIpcmV0dXJuIHIobiwhMCk7dmFyIGw9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIituK1wiJ1wiKTt0aHJvdyBsLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsbH12YXIgcD1lW25dPXtleHBvcnRzOnt9fTtpW25dWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHQpe3ZhciBlPWlbbl1bMV1bdF07cmV0dXJuIGEoZT9lOnQpfSxwLHAuZXhwb3J0cyx0LGksZSxzKX1yZXR1cm4gZVtuXS5leHBvcnRzfWZvcih2YXIgcj1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLG49MDtuPHMubGVuZ3RoO24rKylhKHNbbl0pO3JldHVybiBhfSh7MTpbZnVuY3Rpb24odCxpLGUpe1widXNlIHN0cmljdFwiO3ZhciBzPXQoXCIuL1BhcnRpY2xlVXRpbHNcIiksYT10KFwiLi9QYXJ0aWNsZVwiKSxyPVBJWEkuVGV4dHVyZSxuPWZ1bmN0aW9uKHQpe2EuY2FsbCh0aGlzLHQpLHRoaXMudGV4dHVyZXM9bnVsbCx0aGlzLmR1cmF0aW9uPTAsdGhpcy5mcmFtZXJhdGU9MCx0aGlzLmVsYXBzZWQ9MCx0aGlzLmxvb3A9ITF9LG89YS5wcm90b3R5cGUsaD1uLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG8pO2guaW5pdD1mdW5jdGlvbigpe3RoaXMuUGFydGljbGVfaW5pdCgpLHRoaXMuZWxhcHNlZD0wLHRoaXMuZnJhbWVyYXRlPDAmJih0aGlzLmR1cmF0aW9uPXRoaXMubWF4TGlmZSx0aGlzLmZyYW1lcmF0ZT10aGlzLnRleHR1cmVzLmxlbmd0aC90aGlzLmR1cmF0aW9uKX0saC5hcHBseUFydD1mdW5jdGlvbih0KXt0aGlzLnRleHR1cmVzPXQudGV4dHVyZXMsdGhpcy5mcmFtZXJhdGU9dC5mcmFtZXJhdGUsdGhpcy5kdXJhdGlvbj10LmR1cmF0aW9uLHRoaXMubG9vcD10Lmxvb3B9LGgudXBkYXRlPWZ1bmN0aW9uKHQpe2lmKHRoaXMuUGFydGljbGVfdXBkYXRlKHQpPj0wKXt0aGlzLmVsYXBzZWQrPXQsdGhpcy5lbGFwc2VkPnRoaXMuZHVyYXRpb24mJih0aGlzLmxvb3A/dGhpcy5lbGFwc2VkPXRoaXMuZWxhcHNlZCV0aGlzLmR1cmF0aW9uOnRoaXMuZWxhcHNlZD10aGlzLmR1cmF0aW9uLTFlLTYpO3ZhciBpPXRoaXMuZWxhcHNlZCp0aGlzLmZyYW1lcmF0ZSsxZS03fDA7dGhpcy50ZXh0dXJlPXRoaXMudGV4dHVyZXNbaV18fHMuRU1QVFlfVEVYVFVSRX19LGguUGFydGljbGVfZGVzdHJveT1hLnByb3RvdHlwZS5kZXN0cm95LGguZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuUGFydGljbGVfZGVzdHJveSgpLHRoaXMudGV4dHVyZXM9bnVsbH0sbi5wYXJzZUFydD1mdW5jdGlvbih0KXt2YXIgaSxlLHMsYSxuLG8saD1bXTtmb3IoaT0wO2k8dC5sZW5ndGg7KytpKXtmb3IoZT10W2ldLHRbaV09aD17fSxoLnRleHR1cmVzPW89W10sYT1lLnRleHR1cmVzLHM9MDtzPGEubGVuZ3RoOysrcylpZihuPWFbc10sXCJzdHJpbmdcIj09dHlwZW9mIG4pby5wdXNoKHIuZnJvbUltYWdlKG4pKTtlbHNlIGlmKG4gaW5zdGFuY2VvZiByKW8ucHVzaChuKTtlbHNle3ZhciBsPW4uY291bnR8fDE7Zm9yKG49XCJzdHJpbmdcIj09dHlwZW9mIG4udGV4dHVyZT9yLmZyb21JbWFnZShuLnRleHR1cmUpOm4udGV4dHVyZTtsPjA7LS1sKW8ucHVzaChuKX1cIm1hdGNoTGlmZVwiPT1lLmZyYW1lcmF0ZT8oaC5mcmFtZXJhdGU9LTEsaC5kdXJhdGlvbj0wLGgubG9vcD0hMSk6KGgubG9vcD0hIWUubG9vcCxoLmZyYW1lcmF0ZT1lLmZyYW1lcmF0ZT4wP2UuZnJhbWVyYXRlOjYwLGguZHVyYXRpb249by5sZW5ndGgvaC5mcmFtZXJhdGUpfXJldHVybiB0fSxpLmV4cG9ydHM9bn0se1wiLi9QYXJ0aWNsZVwiOjMsXCIuL1BhcnRpY2xlVXRpbHNcIjo0fV0sMjpbZnVuY3Rpb24odCxpLGUpe1widXNlIHN0cmljdFwiO3ZhciBzPXQoXCIuL1BhcnRpY2xlVXRpbHNcIiksYT10KFwiLi9QYXJ0aWNsZVwiKSxyPVBJWEkucGFydGljbGVzLlBhcnRpY2xlQ29udGFpbmVyfHxQSVhJLlBhcnRpY2xlQ29udGFpbmVyLG49UElYSS50aWNrZXIuc2hhcmVkLG89ZnVuY3Rpb24odCxpLGUpe3RoaXMuX3BhcnRpY2xlQ29uc3RydWN0b3I9YSx0aGlzLnBhcnRpY2xlSW1hZ2VzPW51bGwsdGhpcy5zdGFydEFscGhhPTEsdGhpcy5lbmRBbHBoYT0xLHRoaXMuc3RhcnRTcGVlZD0wLHRoaXMuZW5kU3BlZWQ9MCx0aGlzLm1pbmltdW1TcGVlZE11bHRpcGxpZXI9MSx0aGlzLmFjY2VsZXJhdGlvbj1udWxsLHRoaXMubWF4U3BlZWQ9TmFOLHRoaXMuc3RhcnRTY2FsZT0xLHRoaXMuZW5kU2NhbGU9MSx0aGlzLm1pbmltdW1TY2FsZU11bHRpcGxpZXI9MSx0aGlzLnN0YXJ0Q29sb3I9bnVsbCx0aGlzLmVuZENvbG9yPW51bGwsdGhpcy5taW5MaWZldGltZT0wLHRoaXMubWF4TGlmZXRpbWU9MCx0aGlzLm1pblN0YXJ0Um90YXRpb249MCx0aGlzLm1heFN0YXJ0Um90YXRpb249MCx0aGlzLm5vUm90YXRpb249ITEsdGhpcy5taW5Sb3RhdGlvblNwZWVkPTAsdGhpcy5tYXhSb3RhdGlvblNwZWVkPTAsdGhpcy5wYXJ0aWNsZUJsZW5kTW9kZT0wLHRoaXMuY3VzdG9tRWFzZT1udWxsLHRoaXMuZXh0cmFEYXRhPW51bGwsdGhpcy5fZnJlcXVlbmN5PTEsdGhpcy5tYXhQYXJ0aWNsZXM9MWUzLHRoaXMuZW1pdHRlckxpZmV0aW1lPS0xLHRoaXMuc3Bhd25Qb3M9bnVsbCx0aGlzLnNwYXduVHlwZT1udWxsLHRoaXMuX3NwYXduRnVuYz1udWxsLHRoaXMuc3Bhd25SZWN0PW51bGwsdGhpcy5zcGF3bkNpcmNsZT1udWxsLHRoaXMucGFydGljbGVzUGVyV2F2ZT0xLHRoaXMucGFydGljbGVTcGFjaW5nPTAsdGhpcy5hbmdsZVN0YXJ0PTAsdGhpcy5yb3RhdGlvbj0wLHRoaXMub3duZXJQb3M9bnVsbCx0aGlzLl9wcmV2RW1pdHRlclBvcz1udWxsLHRoaXMuX3ByZXZQb3NJc1ZhbGlkPSExLHRoaXMuX3Bvc0NoYW5nZWQ9ITEsdGhpcy5fcGFyZW50SXNQQz0hMSx0aGlzLl9wYXJlbnQ9bnVsbCx0aGlzLmFkZEF0QmFjaz0hMSx0aGlzLnBhcnRpY2xlQ291bnQ9MCx0aGlzLl9lbWl0PSExLHRoaXMuX3NwYXduVGltZXI9MCx0aGlzLl9lbWl0dGVyTGlmZT0tMSx0aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdD1udWxsLHRoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3Q9bnVsbCx0aGlzLl9wb29sRmlyc3Q9bnVsbCx0aGlzLl9vcmlnQ29uZmlnPW51bGwsdGhpcy5fb3JpZ0FydD1udWxsLHRoaXMuX2F1dG9VcGRhdGU9ITEsdGhpcy5fZGVzdHJveVdoZW5Db21wbGV0ZT0hMSx0aGlzLl9jb21wbGV0ZUNhbGxiYWNrPW51bGwsdGhpcy5wYXJlbnQ9dCxpJiZlJiZ0aGlzLmluaXQoaSxlKSx0aGlzLnJlY3ljbGU9dGhpcy5yZWN5Y2xlLHRoaXMudXBkYXRlPXRoaXMudXBkYXRlLHRoaXMucm90YXRlPXRoaXMucm90YXRlLHRoaXMudXBkYXRlU3Bhd25Qb3M9dGhpcy51cGRhdGVTcGF3blBvcyx0aGlzLnVwZGF0ZU93bmVyUG9zPXRoaXMudXBkYXRlT3duZXJQb3N9LGg9by5wcm90b3R5cGU9e30sbD1uZXcgUElYSS5Qb2ludDtPYmplY3QuZGVmaW5lUHJvcGVydHkoaCxcImZyZXF1ZW5jeVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZnJlcXVlbmN5fSxzZXQ6ZnVuY3Rpb24odCl7XCJudW1iZXJcIj09dHlwZW9mIHQmJnQ+MD90aGlzLl9mcmVxdWVuY3k9dDp0aGlzLl9mcmVxdWVuY3k9MX19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoaCxcInBhcnRpY2xlQ29uc3RydWN0b3JcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhcnRpY2xlQ29uc3RydWN0b3J9LHNldDpmdW5jdGlvbih0KXtpZih0IT10aGlzLl9wYXJ0aWNsZUNvbnN0cnVjdG9yKXt0aGlzLl9wYXJ0aWNsZUNvbnN0cnVjdG9yPXQsdGhpcy5jbGVhbnVwKCk7Zm9yKHZhciBpPXRoaXMuX3Bvb2xGaXJzdDtpO2k9aS5uZXh0KWkuZGVzdHJveSgpO3RoaXMuX3Bvb2xGaXJzdD1udWxsLHRoaXMuX29yaWdDb25maWcmJnRoaXMuX29yaWdBcnQmJnRoaXMuaW5pdCh0aGlzLl9vcmlnQXJ0LHRoaXMuX29yaWdDb25maWcpfX19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoaCxcInBhcmVudFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGFyZW50fSxzZXQ6ZnVuY3Rpb24odCl7aWYodGhpcy5fcGFyZW50SXNQQylmb3IodmFyIGk9dGhpcy5fcG9vbEZpcnN0O2k7aT1pLm5leHQpaS5wYXJlbnQmJmkucGFyZW50LnJlbW92ZUNoaWxkKGkpO3RoaXMuY2xlYW51cCgpLHRoaXMuX3BhcmVudD10LHRoaXMuX3BhcmVudElzUEM9ciYmdCYmdCBpbnN0YW5jZW9mIHJ9fSksaC5pbml0PWZ1bmN0aW9uKHQsaSl7aWYodCYmaSl7dGhpcy5jbGVhbnVwKCksdGhpcy5fb3JpZ0NvbmZpZz1pLHRoaXMuX29yaWdBcnQ9dCx0PUFycmF5LmlzQXJyYXkodCk/dC5zbGljZSgpOlt0XTt2YXIgZT10aGlzLl9wYXJ0aWNsZUNvbnN0cnVjdG9yO3RoaXMucGFydGljbGVJbWFnZXM9ZS5wYXJzZUFydD9lLnBhcnNlQXJ0KHQpOnQsaS5hbHBoYT8odGhpcy5zdGFydEFscGhhPWkuYWxwaGEuc3RhcnQsdGhpcy5lbmRBbHBoYT1pLmFscGhhLmVuZCk6dGhpcy5zdGFydEFscGhhPXRoaXMuZW5kQWxwaGE9MSxpLnNwZWVkPyh0aGlzLnN0YXJ0U3BlZWQ9aS5zcGVlZC5zdGFydCx0aGlzLmVuZFNwZWVkPWkuc3BlZWQuZW5kLHRoaXMubWluaW11bVNwZWVkTXVsdGlwbGllcj1pLnNwZWVkLm1pbmltdW1TcGVlZE11bHRpcGxpZXJ8fDEpOih0aGlzLm1pbmltdW1TcGVlZE11bHRpcGxpZXI9MSx0aGlzLnN0YXJ0U3BlZWQ9dGhpcy5lbmRTcGVlZD0wKTt2YXIgYT1pLmFjY2VsZXJhdGlvbjthJiYoYS54fHxhLnkpPyh0aGlzLmVuZFNwZWVkPXRoaXMuc3RhcnRTcGVlZCx0aGlzLmFjY2VsZXJhdGlvbj1uZXcgUElYSS5Qb2ludChhLngsYS55KSx0aGlzLm1heFNwZWVkPWkubWF4U3BlZWR8fE5hTik6dGhpcy5hY2NlbGVyYXRpb249bmV3IFBJWEkuUG9pbnQsaS5zY2FsZT8odGhpcy5zdGFydFNjYWxlPWkuc2NhbGUuc3RhcnQsdGhpcy5lbmRTY2FsZT1pLnNjYWxlLmVuZCx0aGlzLm1pbmltdW1TY2FsZU11bHRpcGxpZXI9aS5zY2FsZS5taW5pbXVtU2NhbGVNdWx0aXBsaWVyfHwxKTp0aGlzLnN0YXJ0U2NhbGU9dGhpcy5lbmRTY2FsZT10aGlzLm1pbmltdW1TY2FsZU11bHRpcGxpZXI9MSxpLmNvbG9yJiYodGhpcy5zdGFydENvbG9yPXMuaGV4VG9SR0IoaS5jb2xvci5zdGFydCksaS5jb2xvci5zdGFydCE9aS5jb2xvci5lbmQ/dGhpcy5lbmRDb2xvcj1zLmhleFRvUkdCKGkuY29sb3IuZW5kKTp0aGlzLmVuZENvbG9yPW51bGwpLGkuc3RhcnRSb3RhdGlvbj8odGhpcy5taW5TdGFydFJvdGF0aW9uPWkuc3RhcnRSb3RhdGlvbi5taW4sdGhpcy5tYXhTdGFydFJvdGF0aW9uPWkuc3RhcnRSb3RhdGlvbi5tYXgpOnRoaXMubWluU3RhcnRSb3RhdGlvbj10aGlzLm1heFN0YXJ0Um90YXRpb249MCxpLm5vUm90YXRpb24mJih0aGlzLm1pblN0YXJ0Um90YXRpb258fHRoaXMubWF4U3RhcnRSb3RhdGlvbik/dGhpcy5ub1JvdGF0aW9uPSEhaS5ub1JvdGF0aW9uOnRoaXMubm9Sb3RhdGlvbj0hMSxpLnJvdGF0aW9uU3BlZWQ/KHRoaXMubWluUm90YXRpb25TcGVlZD1pLnJvdGF0aW9uU3BlZWQubWluLHRoaXMubWF4Um90YXRpb25TcGVlZD1pLnJvdGF0aW9uU3BlZWQubWF4KTp0aGlzLm1pblJvdGF0aW9uU3BlZWQ9dGhpcy5tYXhSb3RhdGlvblNwZWVkPTAsdGhpcy5taW5MaWZldGltZT1pLmxpZmV0aW1lLm1pbix0aGlzLm1heExpZmV0aW1lPWkubGlmZXRpbWUubWF4LHRoaXMucGFydGljbGVCbGVuZE1vZGU9cy5nZXRCbGVuZE1vZGUoaS5ibGVuZE1vZGUpLGkuZWFzZT90aGlzLmN1c3RvbUVhc2U9XCJmdW5jdGlvblwiPT10eXBlb2YgaS5lYXNlP2kuZWFzZTpzLmdlbmVyYXRlRWFzZShpLmVhc2UpOnRoaXMuY3VzdG9tRWFzZT1udWxsLGUucGFyc2VEYXRhP3RoaXMuZXh0cmFEYXRhPWUucGFyc2VEYXRhKGkuZXh0cmFEYXRhKTp0aGlzLmV4dHJhRGF0YT1pLmV4dHJhRGF0YXx8bnVsbCx0aGlzLnNwYXduUmVjdD10aGlzLnNwYXduQ2lyY2xlPW51bGwsdGhpcy5wYXJ0aWNsZXNQZXJXYXZlPTEsdGhpcy5wYXJ0aWNsZVNwYWNpbmc9MCx0aGlzLmFuZ2xlU3RhcnQ9MDt2YXIgcjtzd2l0Y2goaS5zcGF3blR5cGUpe2Nhc2VcInJlY3RcIjp0aGlzLnNwYXduVHlwZT1cInJlY3RcIix0aGlzLl9zcGF3bkZ1bmM9dGhpcy5fc3Bhd25SZWN0O3ZhciBuPWkuc3Bhd25SZWN0O3RoaXMuc3Bhd25SZWN0PW5ldyBQSVhJLlJlY3RhbmdsZShuLngsbi55LG4udyxuLmgpO2JyZWFrO2Nhc2VcImNpcmNsZVwiOnRoaXMuc3Bhd25UeXBlPVwiY2lyY2xlXCIsdGhpcy5fc3Bhd25GdW5jPXRoaXMuX3NwYXduQ2lyY2xlLHI9aS5zcGF3bkNpcmNsZSx0aGlzLnNwYXduQ2lyY2xlPW5ldyBQSVhJLkNpcmNsZShyLngsci55LHIucik7YnJlYWs7Y2FzZVwicmluZ1wiOnRoaXMuc3Bhd25UeXBlPVwicmluZ1wiLHRoaXMuX3NwYXduRnVuYz10aGlzLl9zcGF3blJpbmcscj1pLnNwYXduQ2lyY2xlLHRoaXMuc3Bhd25DaXJjbGU9bmV3IFBJWEkuQ2lyY2xlKHIueCxyLnksci5yKSx0aGlzLnNwYXduQ2lyY2xlLm1pblJhZGl1cz1yLm1pblI7YnJlYWs7Y2FzZVwiYnVyc3RcIjp0aGlzLnNwYXduVHlwZT1cImJ1cnN0XCIsdGhpcy5fc3Bhd25GdW5jPXRoaXMuX3NwYXduQnVyc3QsdGhpcy5wYXJ0aWNsZXNQZXJXYXZlPWkucGFydGljbGVzUGVyV2F2ZSx0aGlzLnBhcnRpY2xlU3BhY2luZz1pLnBhcnRpY2xlU3BhY2luZyx0aGlzLmFuZ2xlU3RhcnQ9aS5hbmdsZVN0YXJ0P2kuYW5nbGVTdGFydDowO2JyZWFrO2Nhc2VcInBvaW50XCI6dGhpcy5zcGF3blR5cGU9XCJwb2ludFwiLHRoaXMuX3NwYXduRnVuYz10aGlzLl9zcGF3blBvaW50O2JyZWFrO2RlZmF1bHQ6dGhpcy5zcGF3blR5cGU9XCJwb2ludFwiLHRoaXMuX3NwYXduRnVuYz10aGlzLl9zcGF3blBvaW50fXRoaXMuZnJlcXVlbmN5PWkuZnJlcXVlbmN5LHRoaXMuZW1pdHRlckxpZmV0aW1lPWkuZW1pdHRlckxpZmV0aW1lfHwtMSx0aGlzLm1heFBhcnRpY2xlcz1pLm1heFBhcnRpY2xlcz4wP2kubWF4UGFydGljbGVzOjFlMyx0aGlzLmFkZEF0QmFjaz0hIWkuYWRkQXRCYWNrLHRoaXMucm90YXRpb249MCx0aGlzLm93bmVyUG9zPW5ldyBQSVhJLlBvaW50LHRoaXMuc3Bhd25Qb3M9bmV3IFBJWEkuUG9pbnQoaS5wb3MueCxpLnBvcy55KSx0aGlzLl9wcmV2RW1pdHRlclBvcz10aGlzLnNwYXduUG9zLmNsb25lKCksdGhpcy5fcHJldlBvc0lzVmFsaWQ9ITEsdGhpcy5fc3Bhd25UaW1lcj0wLHRoaXMuZW1pdD12b2lkIDA9PT1pLmVtaXR8fCEhaS5lbWl0LHRoaXMuYXV0b1VwZGF0ZT12b2lkIDAhPT1pLmF1dG9VcGRhdGUmJiEhaS5hdXRvVXBkYXRlfX0saC5yZWN5Y2xlPWZ1bmN0aW9uKHQpe3QubmV4dCYmKHQubmV4dC5wcmV2PXQucHJldiksdC5wcmV2JiYodC5wcmV2Lm5leHQ9dC5uZXh0KSx0PT10aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0JiYodGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdD10LnByZXYpLHQ9PXRoaXMuX2FjdGl2ZVBhcnRpY2xlc0ZpcnN0JiYodGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3Q9dC5uZXh0KSx0LnByZXY9bnVsbCx0Lm5leHQ9dGhpcy5fcG9vbEZpcnN0LHRoaXMuX3Bvb2xGaXJzdD10LHRoaXMuX3BhcmVudElzUEM/KHQuYWxwaGE9MCx0LnZpc2libGU9ITEpOnQucGFyZW50JiZ0LnBhcmVudC5yZW1vdmVDaGlsZCh0KSwtLXRoaXMucGFydGljbGVDb3VudH0saC5yb3RhdGU9ZnVuY3Rpb24odCl7aWYodGhpcy5yb3RhdGlvbiE9dCl7dmFyIGk9dC10aGlzLnJvdGF0aW9uO3RoaXMucm90YXRpb249dCxzLnJvdGF0ZVBvaW50KGksdGhpcy5zcGF3blBvcyksdGhpcy5fcG9zQ2hhbmdlZD0hMH19LGgudXBkYXRlU3Bhd25Qb3M9ZnVuY3Rpb24odCxpKXt0aGlzLl9wb3NDaGFuZ2VkPSEwLHRoaXMuc3Bhd25Qb3MueD10LHRoaXMuc3Bhd25Qb3MueT1pfSxoLnVwZGF0ZU93bmVyUG9zPWZ1bmN0aW9uKHQsaSl7dGhpcy5fcG9zQ2hhbmdlZD0hMCx0aGlzLm93bmVyUG9zLng9dCx0aGlzLm93bmVyUG9zLnk9aX0saC5yZXNldFBvc2l0aW9uVHJhY2tpbmc9ZnVuY3Rpb24oKXt0aGlzLl9wcmV2UG9zSXNWYWxpZD0hMX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGgsXCJlbWl0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9lbWl0fSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5fZW1pdD0hIXQsdGhpcy5fZW1pdHRlckxpZmU9dGhpcy5lbWl0dGVyTGlmZXRpbWV9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGgsXCJhdXRvVXBkYXRlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hdXRvVXBkYXRlfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5fYXV0b1VwZGF0ZSYmIXQ/bi5yZW1vdmUodGhpcy51cGRhdGUsdGhpcyk6IXRoaXMuX2F1dG9VcGRhdGUmJnQmJm4uYWRkKHRoaXMudXBkYXRlLHRoaXMpLHRoaXMuX2F1dG9VcGRhdGU9ISF0fX0pLGgucGxheU9uY2VBbmREZXN0cm95PWZ1bmN0aW9uKHQpe3RoaXMuYXV0b1VwZGF0ZT0hMCx0aGlzLmVtaXQ9ITAsdGhpcy5fZGVzdHJveVdoZW5Db21wbGV0ZT0hMCx0aGlzLl9jb21wbGV0ZUNhbGxiYWNrPXR9LGgucGxheU9uY2U9ZnVuY3Rpb24odCl7dGhpcy5hdXRvVXBkYXRlPSEwLHRoaXMuZW1pdD0hMCx0aGlzLl9jb21wbGV0ZUNhbGxiYWNrPXR9LGgudXBkYXRlPWZ1bmN0aW9uKHQpe2lmKHRoaXMuX2F1dG9VcGRhdGUmJih0PXQvUElYSS5zZXR0aW5ncy5UQVJHRVRfRlBNUy8xZTMpLHRoaXMuX3BhcmVudCl7dmFyIGksZSxzO2ZvcihlPXRoaXMuX2FjdGl2ZVBhcnRpY2xlc0ZpcnN0O2U7ZT1zKXM9ZS5uZXh0LGUudXBkYXRlKHQpO3ZhciBhLHI7dGhpcy5fcHJldlBvc0lzVmFsaWQmJihhPXRoaXMuX3ByZXZFbWl0dGVyUG9zLngscj10aGlzLl9wcmV2RW1pdHRlclBvcy55KTt2YXIgbj10aGlzLm93bmVyUG9zLngrdGhpcy5zcGF3blBvcy54LG89dGhpcy5vd25lclBvcy55K3RoaXMuc3Bhd25Qb3MueTtpZih0aGlzLl9lbWl0KWZvcih0aGlzLl9zcGF3blRpbWVyLT10O3RoaXMuX3NwYXduVGltZXI8PTA7KXtpZih0aGlzLl9lbWl0dGVyTGlmZT4wJiYodGhpcy5fZW1pdHRlckxpZmUtPXRoaXMuX2ZyZXF1ZW5jeSx0aGlzLl9lbWl0dGVyTGlmZTw9MCkpe3RoaXMuX3NwYXduVGltZXI9MCx0aGlzLl9lbWl0dGVyTGlmZT0wLHRoaXMuZW1pdD0hMTticmVha31pZih0aGlzLnBhcnRpY2xlQ291bnQ+PXRoaXMubWF4UGFydGljbGVzKXRoaXMuX3NwYXduVGltZXIrPXRoaXMuX2ZyZXF1ZW5jeTtlbHNle3ZhciBoO2lmKGg9dGhpcy5taW5MaWZldGltZT09dGhpcy5tYXhMaWZldGltZT90aGlzLm1pbkxpZmV0aW1lOk1hdGgucmFuZG9tKCkqKHRoaXMubWF4TGlmZXRpbWUtdGhpcy5taW5MaWZldGltZSkrdGhpcy5taW5MaWZldGltZSwtdGhpcy5fc3Bhd25UaW1lcjxoKXt2YXIgbCxwO2lmKHRoaXMuX3ByZXZQb3NJc1ZhbGlkJiZ0aGlzLl9wb3NDaGFuZ2VkKXt2YXIgYz0xK3RoaXMuX3NwYXduVGltZXIvdDtsPShuLWEpKmMrYSxwPShvLXIpKmMrcn1lbHNlIGw9bixwPW87aT0wO2Zvcih2YXIgZD1NYXRoLm1pbih0aGlzLnBhcnRpY2xlc1BlcldhdmUsdGhpcy5tYXhQYXJ0aWNsZXMtdGhpcy5wYXJ0aWNsZUNvdW50KTtpPGQ7KytpKXt2YXIgdSxtO2lmKHRoaXMuX3Bvb2xGaXJzdD8odT10aGlzLl9wb29sRmlyc3QsdGhpcy5fcG9vbEZpcnN0PXRoaXMuX3Bvb2xGaXJzdC5uZXh0LHUubmV4dD1udWxsKTp1PW5ldyB0aGlzLnBhcnRpY2xlQ29uc3RydWN0b3IodGhpcyksdGhpcy5wYXJ0aWNsZUltYWdlcy5sZW5ndGg+MT91LmFwcGx5QXJ0KHRoaXMucGFydGljbGVJbWFnZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnRoaXMucGFydGljbGVJbWFnZXMubGVuZ3RoKV0pOnUuYXBwbHlBcnQodGhpcy5wYXJ0aWNsZUltYWdlc1swXSksdS5zdGFydEFscGhhPXRoaXMuc3RhcnRBbHBoYSx1LmVuZEFscGhhPXRoaXMuZW5kQWxwaGEsMSE9dGhpcy5taW5pbXVtU3BlZWRNdWx0aXBsaWVyPyhtPU1hdGgucmFuZG9tKCkqKDEtdGhpcy5taW5pbXVtU3BlZWRNdWx0aXBsaWVyKSt0aGlzLm1pbmltdW1TcGVlZE11bHRpcGxpZXIsdS5zdGFydFNwZWVkPXRoaXMuc3RhcnRTcGVlZCptLHUuZW5kU3BlZWQ9dGhpcy5lbmRTcGVlZCptKToodS5zdGFydFNwZWVkPXRoaXMuc3RhcnRTcGVlZCx1LmVuZFNwZWVkPXRoaXMuZW5kU3BlZWQpLHUuYWNjZWxlcmF0aW9uLng9dGhpcy5hY2NlbGVyYXRpb24ueCx1LmFjY2VsZXJhdGlvbi55PXRoaXMuYWNjZWxlcmF0aW9uLnksdS5tYXhTcGVlZD10aGlzLm1heFNwZWVkLDEhPXRoaXMubWluaW11bVNjYWxlTXVsdGlwbGllcj8obT1NYXRoLnJhbmRvbSgpKigxLXRoaXMubWluaW11bVNjYWxlTXVsdGlwbGllcikrdGhpcy5taW5pbXVtU2NhbGVNdWx0aXBsaWVyLHUuc3RhcnRTY2FsZT10aGlzLnN0YXJ0U2NhbGUqbSx1LmVuZFNjYWxlPXRoaXMuZW5kU2NhbGUqbSk6KHUuc3RhcnRTY2FsZT10aGlzLnN0YXJ0U2NhbGUsdS5lbmRTY2FsZT10aGlzLmVuZFNjYWxlKSx1LnN0YXJ0Q29sb3I9dGhpcy5zdGFydENvbG9yLHUuZW5kQ29sb3I9dGhpcy5lbmRDb2xvcix0aGlzLm1pblJvdGF0aW9uU3BlZWQ9PXRoaXMubWF4Um90YXRpb25TcGVlZD91LnJvdGF0aW9uU3BlZWQ9dGhpcy5taW5Sb3RhdGlvblNwZWVkOnUucm90YXRpb25TcGVlZD1NYXRoLnJhbmRvbSgpKih0aGlzLm1heFJvdGF0aW9uU3BlZWQtdGhpcy5taW5Sb3RhdGlvblNwZWVkKSt0aGlzLm1pblJvdGF0aW9uU3BlZWQsdS5ub1JvdGF0aW9uPXRoaXMubm9Sb3RhdGlvbix1Lm1heExpZmU9aCx1LmJsZW5kTW9kZT10aGlzLnBhcnRpY2xlQmxlbmRNb2RlLHUuZWFzZT10aGlzLmN1c3RvbUVhc2UsdS5leHRyYURhdGE9dGhpcy5leHRyYURhdGEsdGhpcy5fc3Bhd25GdW5jKHUsbCxwLGkpLHUuaW5pdCgpLHUudXBkYXRlKC10aGlzLl9zcGF3blRpbWVyKSx0aGlzLl9wYXJlbnRJc1BDJiZ1LnBhcmVudCl7dmFyIGY9dGhpcy5fcGFyZW50LmNoaWxkcmVuO2lmKGZbMF09PXUpZi5zaGlmdCgpO2Vsc2UgaWYoZltmLmxlbmd0aC0xXT09dSlmLnBvcCgpO2Vsc2V7dmFyIF89Zi5pbmRleE9mKHUpO2Yuc3BsaWNlKF8sMSl9dGhpcy5hZGRBdEJhY2s/Zi51bnNoaWZ0KHUpOmYucHVzaCh1KX1lbHNlIHRoaXMuYWRkQXRCYWNrP3RoaXMuX3BhcmVudC5hZGRDaGlsZEF0KHUsMCk6dGhpcy5fcGFyZW50LmFkZENoaWxkKHUpO3RoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3Q/KHRoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3QubmV4dD11LHUucHJldj10aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0LHRoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3Q9dSk6dGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdD10aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdD11LCsrdGhpcy5wYXJ0aWNsZUNvdW50fX10aGlzLl9zcGF3blRpbWVyKz10aGlzLl9mcmVxdWVuY3l9fXRoaXMuX3Bvc0NoYW5nZWQmJih0aGlzLl9wcmV2RW1pdHRlclBvcy54PW4sdGhpcy5fcHJldkVtaXR0ZXJQb3MueT1vLHRoaXMuX3ByZXZQb3NJc1ZhbGlkPSEwLHRoaXMuX3Bvc0NoYW5nZWQ9ITEpLHRoaXMuX2VtaXR8fHRoaXMuX2FjdGl2ZVBhcnRpY2xlc0ZpcnN0fHwodGhpcy5fY29tcGxldGVDYWxsYmFjayYmdGhpcy5fY29tcGxldGVDYWxsYmFjaygpLHRoaXMuX2Rlc3Ryb3lXaGVuQ29tcGxldGUmJnRoaXMuZGVzdHJveSgpKX19LGguX3NwYXduUG9pbnQ9ZnVuY3Rpb24odCxpLGUpe3RoaXMubWluU3RhcnRSb3RhdGlvbj09dGhpcy5tYXhTdGFydFJvdGF0aW9uP3Qucm90YXRpb249dGhpcy5taW5TdGFydFJvdGF0aW9uK3RoaXMucm90YXRpb246dC5yb3RhdGlvbj1NYXRoLnJhbmRvbSgpKih0aGlzLm1heFN0YXJ0Um90YXRpb24tdGhpcy5taW5TdGFydFJvdGF0aW9uKSt0aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbix0LnBvc2l0aW9uLng9aSx0LnBvc2l0aW9uLnk9ZX0saC5fc3Bhd25SZWN0PWZ1bmN0aW9uKHQsaSxlKXt0aGlzLm1pblN0YXJ0Um90YXRpb249PXRoaXMubWF4U3RhcnRSb3RhdGlvbj90LnJvdGF0aW9uPXRoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uOnQucm90YXRpb249TWF0aC5yYW5kb20oKSoodGhpcy5tYXhTdGFydFJvdGF0aW9uLXRoaXMubWluU3RhcnRSb3RhdGlvbikrdGhpcy5taW5TdGFydFJvdGF0aW9uK3RoaXMucm90YXRpb24sbC54PU1hdGgucmFuZG9tKCkqdGhpcy5zcGF3blJlY3Qud2lkdGgrdGhpcy5zcGF3blJlY3QueCxsLnk9TWF0aC5yYW5kb20oKSp0aGlzLnNwYXduUmVjdC5oZWlnaHQrdGhpcy5zcGF3blJlY3QueSwwIT09dGhpcy5yb3RhdGlvbiYmcy5yb3RhdGVQb2ludCh0aGlzLnJvdGF0aW9uLGwpLHQucG9zaXRpb24ueD1pK2wueCx0LnBvc2l0aW9uLnk9ZStsLnl9LGguX3NwYXduQ2lyY2xlPWZ1bmN0aW9uKHQsaSxlKXt0aGlzLm1pblN0YXJ0Um90YXRpb249PXRoaXMubWF4U3RhcnRSb3RhdGlvbj90LnJvdGF0aW9uPXRoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uOnQucm90YXRpb249TWF0aC5yYW5kb20oKSoodGhpcy5tYXhTdGFydFJvdGF0aW9uLXRoaXMubWluU3RhcnRSb3RhdGlvbikrdGhpcy5taW5TdGFydFJvdGF0aW9uK3RoaXMucm90YXRpb24sbC54PU1hdGgucmFuZG9tKCkqdGhpcy5zcGF3bkNpcmNsZS5yYWRpdXMsbC55PTAscy5yb3RhdGVQb2ludCgzNjAqTWF0aC5yYW5kb20oKSxsKSxsLngrPXRoaXMuc3Bhd25DaXJjbGUueCxsLnkrPXRoaXMuc3Bhd25DaXJjbGUueSwwIT09dGhpcy5yb3RhdGlvbiYmcy5yb3RhdGVQb2ludCh0aGlzLnJvdGF0aW9uLGwpLHQucG9zaXRpb24ueD1pK2wueCx0LnBvc2l0aW9uLnk9ZStsLnl9LGguX3NwYXduUmluZz1mdW5jdGlvbih0LGksZSl7dmFyIGE9dGhpcy5zcGF3bkNpcmNsZTt0aGlzLm1pblN0YXJ0Um90YXRpb249PXRoaXMubWF4U3RhcnRSb3RhdGlvbj90LnJvdGF0aW9uPXRoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uOnQucm90YXRpb249TWF0aC5yYW5kb20oKSoodGhpcy5tYXhTdGFydFJvdGF0aW9uLXRoaXMubWluU3RhcnRSb3RhdGlvbikrdGhpcy5taW5TdGFydFJvdGF0aW9uK3RoaXMucm90YXRpb24sYS5taW5SYWRpdXM9PWEucmFkaXVzP2wueD1NYXRoLnJhbmRvbSgpKihhLnJhZGl1cy1hLm1pblJhZGl1cykrYS5taW5SYWRpdXM6bC54PWEucmFkaXVzLGwueT0wO3ZhciByPTM2MCpNYXRoLnJhbmRvbSgpO3Qucm90YXRpb24rPXIscy5yb3RhdGVQb2ludChyLGwpLGwueCs9dGhpcy5zcGF3bkNpcmNsZS54LGwueSs9dGhpcy5zcGF3bkNpcmNsZS55LDAhPT10aGlzLnJvdGF0aW9uJiZzLnJvdGF0ZVBvaW50KHRoaXMucm90YXRpb24sbCksdC5wb3NpdGlvbi54PWkrbC54LHQucG9zaXRpb24ueT1lK2wueX0saC5fc3Bhd25CdXJzdD1mdW5jdGlvbih0LGksZSxzKXswPT09dGhpcy5wYXJ0aWNsZVNwYWNpbmc/dC5yb3RhdGlvbj0zNjAqTWF0aC5yYW5kb20oKTp0LnJvdGF0aW9uPXRoaXMuYW5nbGVTdGFydCt0aGlzLnBhcnRpY2xlU3BhY2luZypzK3RoaXMucm90YXRpb24sdC5wb3NpdGlvbi54PWksdC5wb3NpdGlvbi55PWV9LGguY2xlYW51cD1mdW5jdGlvbigpe3ZhciB0LGk7Zm9yKHQ9dGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3Q7dDt0PWkpaT10Lm5leHQsdGhpcy5yZWN5Y2xlKHQpLHQucGFyZW50JiZ0LnBhcmVudC5yZW1vdmVDaGlsZCh0KTt0aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdD10aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0PW51bGwsdGhpcy5wYXJ0aWNsZUNvdW50PTB9LGguZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuYXV0b1VwZGF0ZT0hMSx0aGlzLmNsZWFudXAoKTtmb3IodmFyIHQsaT10aGlzLl9wb29sRmlyc3Q7aTtpPXQpdD1pLm5leHQsaS5kZXN0cm95KCk7dGhpcy5fcG9vbEZpcnN0PXRoaXMuX3BhcmVudD10aGlzLnBhcnRpY2xlSW1hZ2VzPXRoaXMuc3Bhd25Qb3M9dGhpcy5vd25lclBvcz10aGlzLnN0YXJ0Q29sb3I9dGhpcy5lbmRDb2xvcj10aGlzLmN1c3RvbUVhc2U9dGhpcy5fY29tcGxldGVDYWxsYmFjaz1udWxsfSxpLmV4cG9ydHM9b30se1wiLi9QYXJ0aWNsZVwiOjMsXCIuL1BhcnRpY2xlVXRpbHNcIjo0fV0sMzpbZnVuY3Rpb24odCxpLGUpe3ZhciBzPXQoXCIuL1BhcnRpY2xlVXRpbHNcIiksYT1QSVhJLlNwcml0ZSxyPWZ1bmN0aW9uKHQpe2EuY2FsbCh0aGlzKSx0aGlzLmVtaXR0ZXI9dCx0aGlzLmFuY2hvci54PXRoaXMuYW5jaG9yLnk9LjUsdGhpcy52ZWxvY2l0eT1uZXcgUElYSS5Qb2ludCx0aGlzLm1heExpZmU9MCx0aGlzLmFnZT0wLHRoaXMuZWFzZT1udWxsLHRoaXMuZXh0cmFEYXRhPW51bGwsdGhpcy5zdGFydEFscGhhPTAsdGhpcy5lbmRBbHBoYT0wLHRoaXMuc3RhcnRTcGVlZD0wLHRoaXMuZW5kU3BlZWQ9MCx0aGlzLmFjY2VsZXJhdGlvbj1uZXcgUElYSS5Qb2ludCx0aGlzLm1heFNwZWVkPU5hTix0aGlzLnN0YXJ0U2NhbGU9MCx0aGlzLmVuZFNjYWxlPTAsdGhpcy5zdGFydENvbG9yPW51bGwsdGhpcy5fc1I9MCx0aGlzLl9zRz0wLHRoaXMuX3NCPTAsdGhpcy5lbmRDb2xvcj1udWxsLHRoaXMuX2VSPTAsdGhpcy5fZUc9MCx0aGlzLl9lQj0wLHRoaXMuX2RvQWxwaGE9ITEsdGhpcy5fZG9TY2FsZT0hMSx0aGlzLl9kb1NwZWVkPSExLHRoaXMuX2RvQWNjZWxlcmF0aW9uPSExLHRoaXMuX2RvQ29sb3I9ITEsdGhpcy5fZG9Ob3JtYWxNb3ZlbWVudD0hMSx0aGlzLl9vbmVPdmVyTGlmZT0wLHRoaXMubmV4dD1udWxsLHRoaXMucHJldj1udWxsLHRoaXMuaW5pdD10aGlzLmluaXQsdGhpcy5QYXJ0aWNsZV9pbml0PXRoaXMuUGFydGljbGVfaW5pdCx0aGlzLnVwZGF0ZT10aGlzLnVwZGF0ZSx0aGlzLlBhcnRpY2xlX3VwZGF0ZT10aGlzLlBhcnRpY2xlX3VwZGF0ZSx0aGlzLmFwcGx5QXJ0PXRoaXMuYXBwbHlBcnQsdGhpcy5raWxsPXRoaXMua2lsbH0sbj1yLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGEucHJvdG90eXBlKTtuLmluaXQ9bi5QYXJ0aWNsZV9pbml0PWZ1bmN0aW9uKCl7dGhpcy5hZ2U9MCx0aGlzLnZlbG9jaXR5Lng9dGhpcy5zdGFydFNwZWVkLHRoaXMudmVsb2NpdHkueT0wLHMucm90YXRlUG9pbnQodGhpcy5yb3RhdGlvbix0aGlzLnZlbG9jaXR5KSx0aGlzLm5vUm90YXRpb24/dGhpcy5yb3RhdGlvbj0wOnRoaXMucm90YXRpb24qPXMuREVHX1RPX1JBRFMsdGhpcy5yb3RhdGlvblNwZWVkKj1zLkRFR19UT19SQURTLHRoaXMuYWxwaGE9dGhpcy5zdGFydEFscGhhLHRoaXMuc2NhbGUueD10aGlzLnNjYWxlLnk9dGhpcy5zdGFydFNjYWxlLHRoaXMuc3RhcnRDb2xvciYmKHRoaXMuX3NSPXRoaXMuc3RhcnRDb2xvclswXSx0aGlzLl9zRz10aGlzLnN0YXJ0Q29sb3JbMV0sdGhpcy5fc0I9dGhpcy5zdGFydENvbG9yWzJdLHRoaXMuZW5kQ29sb3ImJih0aGlzLl9lUj10aGlzLmVuZENvbG9yWzBdLHRoaXMuX2VHPXRoaXMuZW5kQ29sb3JbMV0sdGhpcy5fZUI9dGhpcy5lbmRDb2xvclsyXSkpLHRoaXMuX2RvQWxwaGE9dGhpcy5zdGFydEFscGhhIT10aGlzLmVuZEFscGhhLHRoaXMuX2RvU3BlZWQ9dGhpcy5zdGFydFNwZWVkIT10aGlzLmVuZFNwZWVkLHRoaXMuX2RvU2NhbGU9dGhpcy5zdGFydFNjYWxlIT10aGlzLmVuZFNjYWxlLHRoaXMuX2RvQ29sb3I9ISF0aGlzLmVuZENvbG9yLHRoaXMuX2RvQWNjZWxlcmF0aW9uPTAhPT10aGlzLmFjY2VsZXJhdGlvbi54fHwwIT09dGhpcy5hY2NlbGVyYXRpb24ueSx0aGlzLl9kb05vcm1hbE1vdmVtZW50PXRoaXMuX2RvU3BlZWR8fDAhPT10aGlzLnN0YXJ0U3BlZWR8fHRoaXMuX2RvQWNjZWxlcmF0aW9uLHRoaXMuX29uZU92ZXJMaWZlPTEvdGhpcy5tYXhMaWZlLHRoaXMudGludD1zLmNvbWJpbmVSR0JDb21wb25lbnRzKHRoaXMuX3NSLHRoaXMuX3NHLHRoaXMuX3NCKSx0aGlzLnZpc2libGU9ITB9LG4uYXBwbHlBcnQ9ZnVuY3Rpb24odCl7dGhpcy50ZXh0dXJlPXR8fHMuRU1QVFlfVEVYVFVSRX0sbi51cGRhdGU9bi5QYXJ0aWNsZV91cGRhdGU9ZnVuY3Rpb24odCl7aWYodGhpcy5hZ2UrPXQsdGhpcy5hZ2U+PXRoaXMubWF4TGlmZSlyZXR1cm4gdGhpcy5raWxsKCksLTE7dmFyIGk9dGhpcy5hZ2UqdGhpcy5fb25lT3ZlckxpZmU7aWYodGhpcy5lYXNlJiYoaT00PT10aGlzLmVhc2UubGVuZ3RoP3RoaXMuZWFzZShpLDAsMSwxKTp0aGlzLmVhc2UoaSkpLHRoaXMuX2RvQWxwaGEmJih0aGlzLmFscGhhPSh0aGlzLmVuZEFscGhhLXRoaXMuc3RhcnRBbHBoYSkqaSt0aGlzLnN0YXJ0QWxwaGEpLHRoaXMuX2RvU2NhbGUpe3ZhciBlPSh0aGlzLmVuZFNjYWxlLXRoaXMuc3RhcnRTY2FsZSkqaSt0aGlzLnN0YXJ0U2NhbGU7dGhpcy5zY2FsZS54PXRoaXMuc2NhbGUueT1lfWlmKHRoaXMuX2RvTm9ybWFsTW92ZW1lbnQpe2lmKHRoaXMuX2RvU3BlZWQpe3ZhciBhPSh0aGlzLmVuZFNwZWVkLXRoaXMuc3RhcnRTcGVlZCkqaSt0aGlzLnN0YXJ0U3BlZWQ7cy5ub3JtYWxpemUodGhpcy52ZWxvY2l0eSkscy5zY2FsZUJ5KHRoaXMudmVsb2NpdHksYSl9ZWxzZSBpZih0aGlzLl9kb0FjY2VsZXJhdGlvbiYmKHRoaXMudmVsb2NpdHkueCs9dGhpcy5hY2NlbGVyYXRpb24ueCp0LHRoaXMudmVsb2NpdHkueSs9dGhpcy5hY2NlbGVyYXRpb24ueSp0LHRoaXMubWF4U3BlZWQpKXt2YXIgcj1zLmxlbmd0aCh0aGlzLnZlbG9jaXR5KTtyPnRoaXMubWF4U3BlZWQmJnMuc2NhbGVCeSh0aGlzLnZlbG9jaXR5LHRoaXMubWF4U3BlZWQvcil9dGhpcy5wb3NpdGlvbi54Kz10aGlzLnZlbG9jaXR5LngqdCx0aGlzLnBvc2l0aW9uLnkrPXRoaXMudmVsb2NpdHkueSp0fWlmKHRoaXMuX2RvQ29sb3Ipe3ZhciBuPSh0aGlzLl9lUi10aGlzLl9zUikqaSt0aGlzLl9zUixvPSh0aGlzLl9lRy10aGlzLl9zRykqaSt0aGlzLl9zRyxoPSh0aGlzLl9lQi10aGlzLl9zQikqaSt0aGlzLl9zQjt0aGlzLnRpbnQ9cy5jb21iaW5lUkdCQ29tcG9uZW50cyhuLG8saCl9cmV0dXJuIDAhPT10aGlzLnJvdGF0aW9uU3BlZWQ/dGhpcy5yb3RhdGlvbis9dGhpcy5yb3RhdGlvblNwZWVkKnQ6dGhpcy5hY2NlbGVyYXRpb24mJiF0aGlzLm5vUm90YXRpb24mJih0aGlzLnJvdGF0aW9uPU1hdGguYXRhbjIodGhpcy52ZWxvY2l0eS55LHRoaXMudmVsb2NpdHkueCkpLGl9LG4ua2lsbD1mdW5jdGlvbigpe3RoaXMuZW1pdHRlci5yZWN5Y2xlKHRoaXMpfSxuLlNwcml0ZV9EZXN0cm95PWEucHJvdG90eXBlLmRlc3Ryb3ksbi5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5wYXJlbnQmJnRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpLHRoaXMuU3ByaXRlX0Rlc3Ryb3kmJnRoaXMuU3ByaXRlX0Rlc3Ryb3koKSx0aGlzLmVtaXR0ZXI9dGhpcy52ZWxvY2l0eT10aGlzLnN0YXJ0Q29sb3I9dGhpcy5lbmRDb2xvcj10aGlzLmVhc2U9dGhpcy5uZXh0PXRoaXMucHJldj1udWxsfSxyLnBhcnNlQXJ0PWZ1bmN0aW9uKHQpe3ZhciBpO2ZvcihpPXQubGVuZ3RoO2k+PTA7LS1pKVwic3RyaW5nXCI9PXR5cGVvZiB0W2ldJiYodFtpXT1QSVhJLlRleHR1cmUuZnJvbUltYWdlKHRbaV0pKTtpZihzLnZlcmJvc2UpZm9yKGk9dC5sZW5ndGgtMTtpPjA7LS1pKWlmKHRbaV0uYmFzZVRleHR1cmUhPXRbaS0xXS5iYXNlVGV4dHVyZSl7d2luZG93LmNvbnNvbGUmJmNvbnNvbGUud2FybihcIlBpeGlQYXJ0aWNsZXM6IHVzaW5nIHBhcnRpY2xlIHRleHR1cmVzIGZyb20gZGlmZmVyZW50IGltYWdlcyBtYXkgaGluZGVyIHBlcmZvcm1hbmNlIGluIFdlYkdMXCIpO2JyZWFrfXJldHVybiB0fSxyLnBhcnNlRGF0YT1mdW5jdGlvbih0KXtyZXR1cm4gdH0saS5leHBvcnRzPXJ9LHtcIi4vUGFydGljbGVVdGlsc1wiOjR9XSw0OltmdW5jdGlvbih0LGksZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHM9UElYSS5CTEVORF9NT0RFU3x8UElYSS5ibGVuZE1vZGVzLGE9UElYSS5UZXh0dXJlLHI9e307ci52ZXJib3NlPSExO3ZhciBuPXIuREVHX1RPX1JBRFM9TWF0aC5QSS8xODAsbz1yLkVNUFRZX1RFWFRVUkU9YS5FTVBUWTtvLm9uPW8uZGVzdHJveT1vLm9uY2U9by5lbWl0PWZ1bmN0aW9uKCl7fSxyLnJvdGF0ZVBvaW50PWZ1bmN0aW9uKHQsaSl7aWYodCl7dCo9bjt2YXIgZT1NYXRoLnNpbih0KSxzPU1hdGguY29zKHQpLGE9aS54KnMtaS55KmUscj1pLngqZStpLnkqcztpLng9YSxpLnk9cn19LHIuY29tYmluZVJHQkNvbXBvbmVudHM9ZnVuY3Rpb24odCxpLGUpe3JldHVybiB0PDwxNnxpPDw4fGV9LHIubm9ybWFsaXplPWZ1bmN0aW9uKHQpe3ZhciBpPTEvci5sZW5ndGgodCk7dC54Kj1pLHQueSo9aX0sci5zY2FsZUJ5PWZ1bmN0aW9uKHQsaSl7dC54Kj1pLHQueSo9aX0sci5sZW5ndGg9ZnVuY3Rpb24odCl7cmV0dXJuIE1hdGguc3FydCh0LngqdC54K3QueSp0LnkpfSxyLmhleFRvUkdCPWZ1bmN0aW9uKHQsaSl7aT9pLmxlbmd0aD0wOmk9W10sXCIjXCI9PXQuY2hhckF0KDApP3Q9dC5zdWJzdHIoMSk6MD09PXQuaW5kZXhPZihcIjB4XCIpJiYodD10LnN1YnN0cigyKSk7dmFyIGU7cmV0dXJuIDg9PXQubGVuZ3RoJiYoZT10LnN1YnN0cigwLDIpLHQ9dC5zdWJzdHIoMikpLGkucHVzaChwYXJzZUludCh0LnN1YnN0cigwLDIpLDE2KSksaS5wdXNoKHBhcnNlSW50KHQuc3Vic3RyKDIsMiksMTYpKSxpLnB1c2gocGFyc2VJbnQodC5zdWJzdHIoNCwyKSwxNikpLGUmJmkucHVzaChwYXJzZUludChlLDE2KSksaX0sci5nZW5lcmF0ZUVhc2U9ZnVuY3Rpb24odCl7dmFyIGk9dC5sZW5ndGgsZT0xL2kscz1mdW5jdGlvbihzKXt2YXIgYSxyLG49aSpzfDA7cmV0dXJuIGE9KHMtbiplKSppLHI9dFtuXXx8dFtpLTFdLHIucythKigyKigxLWEpKihyLmNwLXIucykrYSooci5lLXIucykpfTtyZXR1cm4gc30sci5nZXRCbGVuZE1vZGU9ZnVuY3Rpb24odCl7aWYoIXQpcmV0dXJuIHMuTk9STUFMO2Zvcih0PXQudG9VcHBlckNhc2UoKTt0LmluZGV4T2YoXCIgXCIpPj0wOyl0PXQucmVwbGFjZShcIiBcIixcIl9cIik7cmV0dXJuIHNbdF18fHMuTk9STUFMfSxpLmV4cG9ydHM9cn0se31dLDU6W2Z1bmN0aW9uKHQsaSxlKXtcInVzZSBzdHJpY3RcIjt2YXIgcz10KFwiLi9QYXJ0aWNsZVV0aWxzXCIpLGE9dChcIi4vUGFydGljbGVcIikscj1mdW5jdGlvbih0KXthLmNhbGwodGhpcyx0KSx0aGlzLnBhdGg9bnVsbCx0aGlzLmluaXRpYWxSb3RhdGlvbj0wLHRoaXMuaW5pdGlhbFBvc2l0aW9uPW5ldyBQSVhJLlBvaW50LHRoaXMubW92ZW1lbnQ9MH0sbj1hLnByb3RvdHlwZSxvPXIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobiksaD1uZXcgUElYSS5Qb2ludDtvLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLmluaXRpYWxSb3RhdGlvbj10aGlzLnJvdGF0aW9uLHRoaXMuUGFydGljbGVfaW5pdCgpLHRoaXMucGF0aD10aGlzLmV4dHJhRGF0YS5wYXRoLHRoaXMuX2RvTm9ybWFsTW92ZW1lbnQ9IXRoaXMucGF0aCx0aGlzLm1vdmVtZW50PTAsdGhpcy5pbml0aWFsUG9zaXRpb24ueD10aGlzLnBvc2l0aW9uLngsdGhpcy5pbml0aWFsUG9zaXRpb24ueT10aGlzLnBvc2l0aW9uLnl9O2Zvcih2YXIgbD1bXCJwb3dcIixcInNxcnRcIixcImFic1wiLFwiZmxvb3JcIixcInJvdW5kXCIsXCJjZWlsXCIsXCJFXCIsXCJQSVwiLFwic2luXCIsXCJjb3NcIixcInRhblwiLFwiYXNpblwiLFwiYWNvc1wiLFwiYXRhblwiLFwiYXRhbjJcIixcImxvZ1wiXSxwPVwiWzAxMjM0NTY3ODkwXFxcXC5cXFxcKlxcXFwtXFxcXCtcXFxcL1xcXFwoXFxcXCl4ICxdXCIsYz1sLmxlbmd0aC0xO2M+PTA7LS1jKXArPVwifFwiK2xbY107cD1uZXcgUmVnRXhwKHAsXCJnXCIpO3ZhciBkPWZ1bmN0aW9uKHQpe2Zvcih2YXIgaT10Lm1hdGNoKHApLGU9aS5sZW5ndGgtMTtlPj0wOy0tZSlsLmluZGV4T2YoaVtlXSk+PTAmJihpW2VdPVwiTWF0aC5cIitpW2VdKTtyZXR1cm4gdD1pLmpvaW4oXCJcIiksbmV3IEZ1bmN0aW9uKFwieFwiLFwicmV0dXJuIFwiK3QrXCI7XCIpfTtvLnVwZGF0ZT1mdW5jdGlvbih0KXt2YXIgaT10aGlzLlBhcnRpY2xlX3VwZGF0ZSh0KTtpZihpPj0wJiZ0aGlzLnBhdGgpe3ZhciBlPSh0aGlzLmVuZFNwZWVkLXRoaXMuc3RhcnRTcGVlZCkqaSt0aGlzLnN0YXJ0U3BlZWQ7dGhpcy5tb3ZlbWVudCs9ZSp0LGgueD10aGlzLm1vdmVtZW50LGgueT10aGlzLnBhdGgodGhpcy5tb3ZlbWVudCkscy5yb3RhdGVQb2ludCh0aGlzLmluaXRpYWxSb3RhdGlvbixoKSx0aGlzLnBvc2l0aW9uLng9dGhpcy5pbml0aWFsUG9zaXRpb24ueCtoLngsdGhpcy5wb3NpdGlvbi55PXRoaXMuaW5pdGlhbFBvc2l0aW9uLnkraC55fX0sby5QYXJ0aWNsZV9kZXN0cm95PWEucHJvdG90eXBlLmRlc3Ryb3ksby5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5QYXJ0aWNsZV9kZXN0cm95KCksdGhpcy5wYXRoPXRoaXMuaW5pdGlhbFBvc2l0aW9uPW51bGx9LHIucGFyc2VBcnQ9ZnVuY3Rpb24odCl7cmV0dXJuIGEucGFyc2VBcnQodCl9LHIucGFyc2VEYXRhPWZ1bmN0aW9uKHQpe3ZhciBpPXt9O2lmKHQmJnQucGF0aCl0cnl7aS5wYXRoPWQodC5wYXRoKX1jYXRjaCh0KXtzLnZlcmJvc2UmJmNvbnNvbGUuZXJyb3IoXCJQYXRoUGFydGljbGU6IGVycm9yIGluIHBhcnNpbmcgcGF0aCBleHByZXNzaW9uXCIpLGkucGF0aD1udWxsfWVsc2Ugcy52ZXJib3NlJiZjb25zb2xlLmVycm9yKFwiUGF0aFBhcnRpY2xlIHJlcXVpcmVzIGEgcGF0aCBzdHJpbmcgaW4gZXh0cmFEYXRhIVwiKSxpLnBhdGg9bnVsbDtyZXR1cm4gaX0saS5leHBvcnRzPXJ9LHtcIi4vUGFydGljbGVcIjozLFwiLi9QYXJ0aWNsZVV0aWxzXCI6NH1dLDY6W2Z1bmN0aW9uKHQsaSxlKXt9LHt9XSw3OltmdW5jdGlvbih0LGksZSl7ZS5QYXJ0aWNsZVV0aWxzPXQoXCIuL1BhcnRpY2xlVXRpbHMuanNcIiksZS5QYXJ0aWNsZT10KFwiLi9QYXJ0aWNsZS5qc1wiKSxlLkVtaXR0ZXI9dChcIi4vRW1pdHRlci5qc1wiKSxlLlBhdGhQYXJ0aWNsZT10KFwiLi9QYXRoUGFydGljbGUuanNcIiksZS5BbmltYXRlZFBhcnRpY2xlPXQoXCIuL0FuaW1hdGVkUGFydGljbGUuanNcIiksdChcIi4vZGVwcmVjYXRpb24uanNcIil9LHtcIi4vQW5pbWF0ZWRQYXJ0aWNsZS5qc1wiOjEsXCIuL0VtaXR0ZXIuanNcIjoyLFwiLi9QYXJ0aWNsZS5qc1wiOjMsXCIuL1BhcnRpY2xlVXRpbHMuanNcIjo0LFwiLi9QYXRoUGFydGljbGUuanNcIjo1LFwiLi9kZXByZWNhdGlvbi5qc1wiOjZ9XSw4OltmdW5jdGlvbih0LGksZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6R0xPQkFMO2lmKHMuUElYSS5wYXJ0aWNsZXN8fChzLlBJWEkucGFydGljbGVzPXt9KSxcInVuZGVmaW5lZFwiIT10eXBlb2YgaSYmaS5leHBvcnRzKVwidW5kZWZpbmVkXCI9PXR5cGVvZiBQSVhJJiZ0KFwicGl4aS5qc1wiKSxpLmV4cG9ydHM9cy5QSVhJLnBhcnRpY2xlc3x8YTtlbHNlIGlmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBQSVhJKXRocm93XCJwaXhpLXBhcnRpY2xlcyByZXF1aXJlcyBwaXhpLmpzIHRvIGJlIGxvYWRlZCBmaXJzdFwiO3ZhciBhPXQoXCIuL3BhcnRpY2xlc1wiKTtmb3IodmFyIHIgaW4gYSlzLlBJWEkucGFydGljbGVzW3JdPWFbcl19LHtcIi4vcGFydGljbGVzXCI6NyxcInBpeGkuanNcIjp2b2lkIDB9XX0se30sWzhdKSg4KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS1wYXJ0aWNsZXMubWluLmpzLm1hcFxuIiwidmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB1dGlscztcclxuICAgIChmdW5jdGlvbiAodXRpbHMpIHtcclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVJbmRpY2VzRm9yUXVhZHMoc2l6ZSkge1xyXG4gICAgICAgICAgICB2YXIgdG90YWxJbmRpY2VzID0gc2l6ZSAqIDY7XHJcbiAgICAgICAgICAgIHZhciBpbmRpY2VzID0gbmV3IFVpbnQxNkFycmF5KHRvdGFsSW5kaWNlcyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IHRvdGFsSW5kaWNlczsgaSArPSA2LCBqICs9IDQpIHtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDBdID0gaiArIDA7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAxXSA9IGogKyAxO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgMl0gPSBqICsgMjtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDNdID0gaiArIDA7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyA0XSA9IGogKyAyO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgNV0gPSBqICsgMztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5kaWNlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuY3JlYXRlSW5kaWNlc0ZvclF1YWRzID0gY3JlYXRlSW5kaWNlc0ZvclF1YWRzO1xyXG4gICAgICAgIGZ1bmN0aW9uIGlzUG93Mih2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhKHYgJiAodiAtIDEpKSAmJiAoISF2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuaXNQb3cyID0gaXNQb3cyO1xyXG4gICAgICAgIGZ1bmN0aW9uIG5leHRQb3cyKHYpIHtcclxuICAgICAgICAgICAgdiArPSArKHYgPT09IDApO1xyXG4gICAgICAgICAgICAtLXY7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gMTtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiAyO1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDQ7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gODtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiAxNjtcclxuICAgICAgICAgICAgcmV0dXJuIHYgKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5uZXh0UG93MiA9IG5leHRQb3cyO1xyXG4gICAgICAgIGZ1bmN0aW9uIGxvZzIodikge1xyXG4gICAgICAgICAgICB2YXIgciwgc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgPSArKHYgPiAweEZGRkYpIDw8IDQ7XHJcbiAgICAgICAgICAgIHYgPj4+PSByO1xyXG4gICAgICAgICAgICBzaGlmdCA9ICsodiA+IDB4RkYpIDw8IDM7XHJcbiAgICAgICAgICAgIHYgPj4+PSBzaGlmdDtcclxuICAgICAgICAgICAgciB8PSBzaGlmdDtcclxuICAgICAgICAgICAgc2hpZnQgPSArKHYgPiAweEYpIDw8IDI7XHJcbiAgICAgICAgICAgIHYgPj4+PSBzaGlmdDtcclxuICAgICAgICAgICAgciB8PSBzaGlmdDtcclxuICAgICAgICAgICAgc2hpZnQgPSArKHYgPiAweDMpIDw8IDE7XHJcbiAgICAgICAgICAgIHYgPj4+PSBzaGlmdDtcclxuICAgICAgICAgICAgciB8PSBzaGlmdDtcclxuICAgICAgICAgICAgcmV0dXJuIHIgfCAodiA+PiAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMubG9nMiA9IGxvZzI7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0SW50ZXJzZWN0aW9uRmFjdG9yKHAxLCBwMiwgcDMsIHA0LCBvdXQpIHtcclxuICAgICAgICAgICAgdmFyIEExID0gcDIueCAtIHAxLngsIEIxID0gcDMueCAtIHA0LngsIEMxID0gcDMueCAtIHAxLng7XHJcbiAgICAgICAgICAgIHZhciBBMiA9IHAyLnkgLSBwMS55LCBCMiA9IHAzLnkgLSBwNC55LCBDMiA9IHAzLnkgLSBwMS55O1xyXG4gICAgICAgICAgICB2YXIgRCA9IEExICogQjIgLSBBMiAqIEIxO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoRCkgPCAxZS03KSB7XHJcbiAgICAgICAgICAgICAgICBvdXQueCA9IEExO1xyXG4gICAgICAgICAgICAgICAgb3V0LnkgPSBBMjtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBUID0gQzEgKiBCMiAtIEMyICogQjE7XHJcbiAgICAgICAgICAgIHZhciBVID0gQTEgKiBDMiAtIEEyICogQzE7XHJcbiAgICAgICAgICAgIHZhciB0ID0gVCAvIEQsIHUgPSBVIC8gRDtcclxuICAgICAgICAgICAgaWYgKHUgPCAoMWUtNikgfHwgdSAtIDEgPiAtMWUtNikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dC54ID0gcDEueCArIHQgKiAocDIueCAtIHAxLngpO1xyXG4gICAgICAgICAgICBvdXQueSA9IHAxLnkgKyB0ICogKHAyLnkgLSBwMS55KTtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmdldEludGVyc2VjdGlvbkZhY3RvciA9IGdldEludGVyc2VjdGlvbkZhY3RvcjtcclxuICAgICAgICBmdW5jdGlvbiBnZXRQb3NpdGlvbkZyb21RdWFkKHAsIGFuY2hvciwgb3V0KSB7XHJcbiAgICAgICAgICAgIG91dCA9IG91dCB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYTEgPSAxLjAgLSBhbmNob3IueCwgYTIgPSAxLjAgLSBhMTtcclxuICAgICAgICAgICAgdmFyIGIxID0gMS4wIC0gYW5jaG9yLnksIGIyID0gMS4wIC0gYjE7XHJcbiAgICAgICAgICAgIG91dC54ID0gKHBbMF0ueCAqIGExICsgcFsxXS54ICogYTIpICogYjEgKyAocFszXS54ICogYTEgKyBwWzJdLnggKiBhMikgKiBiMjtcclxuICAgICAgICAgICAgb3V0LnkgPSAocFswXS55ICogYTEgKyBwWzFdLnkgKiBhMikgKiBiMSArIChwWzNdLnkgKiBhMSArIHBbMl0ueSAqIGEyKSAqIGIyO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5nZXRQb3NpdGlvbkZyb21RdWFkID0gZ2V0UG9zaXRpb25Gcm9tUXVhZDtcclxuICAgIH0pKHV0aWxzID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzIHx8IChwaXhpX3Byb2plY3Rpb24udXRpbHMgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcblBJWEkucHJvamVjdGlvbiA9IHBpeGlfcHJvamVjdGlvbjtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBQcm9qZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uKGxlZ2FjeSwgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIGlmIChlbmFibGUgPT09IHZvaWQgMCkgeyBlbmFibGUgPSB0cnVlOyB9XHJcbiAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sZWdhY3kgPSBsZWdhY3k7XHJcbiAgICAgICAgICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5sZWdhY3kucHJvaiA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uLnByb3RvdHlwZSwgXCJlbmFibGVkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUHJvamVjdGlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvbjtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbiA9IFByb2plY3Rpb247XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB3ZWJnbDtcclxuICAgIChmdW5jdGlvbiAod2ViZ2wpIHtcclxuICAgICAgICB2YXIgQmF0Y2hCdWZmZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBCYXRjaEJ1ZmZlcihzaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzID0gbmV3IEFycmF5QnVmZmVyKHNpemUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG9hdDMyVmlldyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkodGhpcy52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQmF0Y2hCdWZmZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzID0gbnVsbDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIEJhdGNoQnVmZmVyO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgd2ViZ2wuQmF0Y2hCdWZmZXIgPSBCYXRjaEJ1ZmZlcjtcclxuICAgIH0pKHdlYmdsID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsIHx8IChwaXhpX3Byb2plY3Rpb24ud2ViZ2wgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgd2ViZ2w7XHJcbiAgICAoZnVuY3Rpb24gKHdlYmdsKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXIodmVydGV4U3JjLCBmcmFnbWVudFNyYywgZ2wsIG1heFRleHR1cmVzKSB7XHJcbiAgICAgICAgICAgIGZyYWdtZW50U3JjID0gZnJhZ21lbnRTcmMucmVwbGFjZSgvJWNvdW50JS9naSwgbWF4VGV4dHVyZXMgKyAnJyk7XHJcbiAgICAgICAgICAgIGZyYWdtZW50U3JjID0gZnJhZ21lbnRTcmMucmVwbGFjZSgvJWZvcmxvb3AlL2dpLCBnZW5lcmF0ZVNhbXBsZVNyYyhtYXhUZXh0dXJlcykpO1xyXG4gICAgICAgICAgICB2YXIgc2hhZGVyID0gbmV3IFBJWEkuU2hhZGVyKGdsLCB2ZXJ0ZXhTcmMsIGZyYWdtZW50U3JjKTtcclxuICAgICAgICAgICAgdmFyIHNhbXBsZVZhbHVlcyA9IG5ldyBJbnQzMkFycmF5KG1heFRleHR1cmVzKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhUZXh0dXJlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBzYW1wbGVWYWx1ZXNbaV0gPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNoYWRlci5iaW5kKCk7XHJcbiAgICAgICAgICAgIHNoYWRlci51bmlmb3Jtcy51U2FtcGxlcnMgPSBzYW1wbGVWYWx1ZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdlYmdsLmdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyID0gZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXI7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTYW1wbGVTcmMobWF4VGV4dHVyZXMpIHtcclxuICAgICAgICAgICAgdmFyIHNyYyA9ICcnO1xyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhUZXh0dXJlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzcmMgKz0gJ1xcbmVsc2UgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpIDwgbWF4VGV4dHVyZXMgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjICs9IFwiaWYodGV4dHVyZUlkID09IFwiICsgaSArIFwiLjApXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzcmMgKz0gJ1xcbnsnO1xyXG4gICAgICAgICAgICAgICAgc3JjICs9IFwiXFxuXFx0Y29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXJzW1wiICsgaSArIFwiXSwgdGV4dHVyZUNvb3JkKTtcIjtcclxuICAgICAgICAgICAgICAgIHNyYyArPSAnXFxufSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIHJldHVybiBzcmM7XHJcbiAgICAgICAgfVxyXG4gICAgfSkod2ViZ2wgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wgfHwgKHBpeGlfcHJvamVjdGlvbi53ZWJnbCA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgd2ViZ2w7XHJcbiAgICAoZnVuY3Rpb24gKHdlYmdsKSB7XHJcbiAgICAgICAgdmFyIE9iamVjdFJlbmRlcmVyID0gUElYSS5PYmplY3RSZW5kZXJlcjtcclxuICAgICAgICB2YXIgc2V0dGluZ3MgPSBQSVhJLnNldHRpbmdzO1xyXG4gICAgICAgIHZhciBHTEJ1ZmZlciA9IFBJWEkuZ2xDb3JlLkdMQnVmZmVyO1xyXG4gICAgICAgIHZhciBwcmVtdWx0aXBseVRpbnQgPSBQSVhJLnV0aWxzLnByZW11bHRpcGx5VGludDtcclxuICAgICAgICB2YXIgcHJlbXVsdGlwbHlCbGVuZE1vZGUgPSBQSVhJLnV0aWxzLnByZW11bHRpcGx5QmxlbmRNb2RlO1xyXG4gICAgICAgIHZhciBUSUNLID0gMDtcclxuICAgICAgICB2YXIgQmF0Y2hHcm91cCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEJhdGNoR3JvdXAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlkcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaXplID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibGVuZCA9IFBJWEkuQkxFTkRfTU9ERVMuTk9STUFMO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51bmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhdGNoR3JvdXA7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICB3ZWJnbC5CYXRjaEdyb3VwID0gQmF0Y2hHcm91cDtcclxuICAgICAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICBfX2V4dGVuZHMoTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKHJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCByZW5kZXJlcikgfHwgdGhpcztcclxuICAgICAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSAnJztcclxuICAgICAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSAnJztcclxuICAgICAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFU19MT0NBTCA9IDMyO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydFNpemUgPSA1O1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydEJ5dGVTaXplID0gX3RoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2l6ZSA9IHNldHRpbmdzLlNQUklURV9CQVRDSF9TSVpFO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuY3VycmVudEluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNwcml0ZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRleEJ1ZmZlcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZhb3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZhb01heCA9IDI7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0ZXhDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVMgPSAxO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuaW5kaWNlcyA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5jcmVhdGVJbmRpY2VzRm9yUXVhZHMoX3RoaXMuc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ncm91cHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgX3RoaXMuc2l6ZTsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZ3JvdXBzW2tdID0gbmV3IEJhdGNoR3JvdXAoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF90aGlzLnZhb01heCA9IDI7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0ZXhDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW5kZXJlci5vbigncHJlcmVuZGVyJywgX3RoaXMub25QcmVyZW5kZXIsIF90aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuZ2V0VW5pZm9ybXMgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnN5bmNVbmlmb3JtcyA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmICghb2JqKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHZhciBzaCA9IHRoaXMuc2hhZGVyO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoLnVuaWZvcm1zW2tleV0gPSBvYmpba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLm9uQ29udGV4dENoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk1BWF9URVhUVVJFUyA9IE1hdGgubWluKHRoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMLCB0aGlzLnJlbmRlcmVyLnBsdWdpbnNbJ3Nwcml0ZSddLk1BWF9URVhUVVJFUyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoYWRlciA9IHdlYmdsLmdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyKHRoaXMuc2hhZGVyVmVydCwgdGhpcy5zaGFkZXJGcmFnLCBnbCwgdGhpcy5NQVhfVEVYVFVSRVMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IEdMQnVmZmVyLmNyZWF0ZUluZGV4QnVmZmVyKGdsLCB0aGlzLmluZGljZXMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFZhbyhudWxsKTtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmFvTWF4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmVydGV4QnVmZmVyID0gdGhpcy52ZXJ0ZXhCdWZmZXJzW2ldID0gR0xCdWZmZXIuY3JlYXRlVmVydGV4QnVmZmVyKGdsLCBudWxsLCBnbC5TVFJFQU1fRFJBVyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9zW2ldID0gdGhpcy5jcmVhdGVWYW8odmVydGV4QnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5idWZmZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLm5leHRQb3cyKHRoaXMuc2l6ZSk7IGkgKj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcnMucHVzaChuZXcgd2ViZ2wuQmF0Y2hCdWZmZXIoaSAqIDQgKiB0aGlzLnZlcnRCeXRlU2l6ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudmFvID0gdGhpcy52YW9zWzBdO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUub25QcmVyZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbmRleCA+PSB0aGlzLnNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsdXNoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNwcml0ZS5fdGV4dHVyZS5fdXZzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFzcHJpdGUuX3RleHR1cmUuYmFzZVRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZXNbdGhpcy5jdXJyZW50SW5kZXgrK10gPSBzcHJpdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5mbHVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgICAgICB2YXIgTUFYX1RFWFRVUkVTID0gdGhpcy5NQVhfVEVYVFVSRVM7XHJcbiAgICAgICAgICAgICAgICB2YXIgbnAyID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLm5leHRQb3cyKHRoaXMuY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgICAgIHZhciBsb2cyID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLmxvZzIobnAyKTtcclxuICAgICAgICAgICAgICAgIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlcnNbbG9nMl07XHJcbiAgICAgICAgICAgICAgICB2YXIgc3ByaXRlcyA9IHRoaXMuc3ByaXRlcztcclxuICAgICAgICAgICAgICAgIHZhciBncm91cHMgPSB0aGlzLmdyb3VwcztcclxuICAgICAgICAgICAgICAgIHZhciBmbG9hdDMyVmlldyA9IGJ1ZmZlci5mbG9hdDMyVmlldztcclxuICAgICAgICAgICAgICAgIHZhciB1aW50MzJWaWV3ID0gYnVmZmVyLnVpbnQzMlZpZXc7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRVbmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBDb3VudCA9IDE7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50R3JvdXAgPSBncm91cHNbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdmVydGV4RGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciB1dnM7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmxlbmRNb2RlID0gcHJlbXVsdGlwbHlCbGVuZE1vZGVbc3ByaXRlc1swXS5fdGV4dHVyZS5iYXNlVGV4dHVyZS5wcmVtdWx0aXBsaWVkQWxwaGEgPyAxIDogMF1bc3ByaXRlc1swXS5ibGVuZE1vZGVdO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc3RhcnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmJsZW5kID0gYmxlbmRNb2RlO1xyXG4gICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5jdXJyZW50SW5kZXg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcHJpdGUgPSBzcHJpdGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRUZXh0dXJlID0gc3ByaXRlLl90ZXh0dXJlLmJhc2VUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcHJpdGVCbGVuZE1vZGUgPSBwcmVtdWx0aXBseUJsZW5kTW9kZVtOdW1iZXIobmV4dFRleHR1cmUucHJlbXVsdGlwbGllZEFscGhhKV1bc3ByaXRlLmJsZW5kTW9kZV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsZW5kTW9kZSAhPT0gc3ByaXRlQmxlbmRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZSA9IHNwcml0ZUJsZW5kTW9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQgPSBNQVhfVEVYVFVSRVM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVuaWZvcm1zID0gdGhpcy5nZXRVbmlmb3JtcyhzcHJpdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VW5pZm9ybXMgIT09IHVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVbmlmb3JtcyA9IHVuaWZvcm1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCA9IE1BWF9URVhUVVJFUztcclxuICAgICAgICAgICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRleHR1cmUgIT09IG5leHRUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUZXh0dXJlID0gbmV4dFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0VGV4dHVyZS5fZW5hYmxlZCAhPT0gVElDSykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHR1cmVDb3VudCA9PT0gTUFYX1RFWFRVUkVTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnNpemUgPSBpIC0gY3VycmVudEdyb3VwLnN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cCA9IGdyb3Vwc1tncm91cENvdW50KytdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC50ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5ibGVuZCA9IGJsZW5kTW9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc3RhcnQgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC51bmlmb3JtcyA9IGN1cnJlbnRVbmlmb3JtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRUZXh0dXJlLl9lbmFibGVkID0gVElDSztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRUZXh0dXJlLl92aXJ0YWxCb3VuZElkID0gdGV4dHVyZUNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnRleHR1cmVzW2N1cnJlbnRHcm91cC50ZXh0dXJlQ291bnQrK10gPSBuZXh0VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbHBoYSA9IE1hdGgubWluKHNwcml0ZS53b3JsZEFscGhhLCAxLjApO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdiID0gYWxwaGEgPCAxLjAgJiYgbmV4dFRleHR1cmUucHJlbXVsdGlwbGllZEFscGhhID8gcHJlbXVsdGlwbHlUaW50KHNwcml0ZS5fdGludFJHQiwgYWxwaGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogc3ByaXRlLl90aW50UkdCICsgKGFscGhhICogMjU1IDw8IDI0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGxWZXJ0aWNlcyhmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgbmV4dFRleHR1cmUuX3ZpcnRhbEJvdW5kSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ICs9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnNpemUgPSBpIC0gY3VycmVudEdyb3VwLnN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzZXR0aW5ncy5DQU5fVVBMT0FEX1NBTUVfQlVGRkVSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFvTWF4IDw9IHRoaXMudmVydGV4Q291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9NYXgrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZlcnRleEJ1ZmZlciA9IHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XSA9IEdMQnVmZmVyLmNyZWF0ZVZlcnRleEJ1ZmZlcihnbCwgbnVsbCwgZ2wuU1RSRUFNX0RSQVcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb3NbdGhpcy52ZXJ0ZXhDb3VudF0gPSB0aGlzLmNyZWF0ZVZhbyh2ZXJ0ZXhCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRWYW8odGhpcy52YW9zW3RoaXMudmVydGV4Q291bnRdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0udXBsb2FkKGJ1ZmZlci52ZXJ0aWNlcywgMCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4Q291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XS51cGxvYWQoYnVmZmVyLnZlcnRpY2VzLCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRVbmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBncm91cFRleHR1cmVDb3VudCA9IGdyb3VwLnRleHR1cmVDb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXAudW5pZm9ybXMgIT09IGN1cnJlbnRVbmlmb3Jtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN5bmNVbmlmb3Jtcyhncm91cC51bmlmb3Jtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZ3JvdXBUZXh0dXJlQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRUZXh0dXJlKGdyb3VwLnRleHR1cmVzW2pdLCBqLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAudGV4dHVyZXNbal0uX3ZpcnRhbEJvdW5kSWQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSB0aGlzLnNoYWRlci51bmlmb3Jtcy5zYW1wbGVyU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZbMF0gPSBncm91cC50ZXh0dXJlc1tqXS5yZWFsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2WzFdID0gZ3JvdXAudGV4dHVyZXNbal0ucmVhbEhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyLnVuaWZvcm1zLnNhbXBsZXJTaXplID0gdjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnN0YXRlLnNldEJsZW5kTW9kZShncm91cC5ibGVuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKGdsLlRSSUFOR0xFUywgZ3JvdXAuc2l6ZSAqIDYsIGdsLlVOU0lHTkVEX1NIT1JULCBncm91cC5zdGFydCAqIDYgKiAyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gMDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kU2hhZGVyKHRoaXMuc2hhZGVyKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5DQU5fVVBMT0FEX1NBTUVfQlVGRkVSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVmFvKHRoaXMudmFvc1t0aGlzLnZlcnRleENvdW50XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdLmJpbmQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZhb01heDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGV4QnVmZmVyc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YW9zW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFvc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIub2ZmKCdwcmVyZW5kZXInLCB0aGlzLm9uUHJlcmVuZGVyLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhb3MgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGljZXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idWZmZXJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgICAgIH0oT2JqZWN0UmVuZGVyZXIpKTtcclxuICAgICAgICB3ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgfSkod2ViZ2wgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wgfHwgKHBpeGlfcHJvamVjdGlvbi53ZWJnbCA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBwID0gW25ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCldO1xyXG4gICAgdmFyIGEgPSBbMCwgMCwgMCwgMF07XHJcbiAgICB2YXIgU3VyZmFjZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gU3VyZmFjZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJmYWNlSUQgPSBcImRlZmF1bHRcIjtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSUQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRleFNyYyA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhZ21lbnRTcmMgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTdXJmYWNlLnByb3RvdHlwZS5maWxsVW5pZm9ybXMgPSBmdW5jdGlvbiAodW5pZm9ybXMpIHtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3VyZmFjZS5wcm90b3R5cGUuYm91bmRzUXVhZCA9IGZ1bmN0aW9uICh2LCBvdXQsIGFmdGVyKSB7XHJcbiAgICAgICAgICAgIHZhciBtaW5YID0gb3V0WzBdLCBtaW5ZID0gb3V0WzFdO1xyXG4gICAgICAgICAgICB2YXIgbWF4WCA9IG91dFswXSwgbWF4WSA9IG91dFsxXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDI7IGkgPCA4OyBpICs9IDIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtaW5YID4gb3V0W2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIG1pblggPSBvdXRbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4WCA8IG91dFtpXSlcclxuICAgICAgICAgICAgICAgICAgICBtYXhYID0gb3V0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pblkgPiBvdXRbaSArIDFdKVxyXG4gICAgICAgICAgICAgICAgICAgIG1pblkgPSBvdXRbaSArIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1heFkgPCBvdXRbaSArIDFdKVxyXG4gICAgICAgICAgICAgICAgICAgIG1heFkgPSBvdXRbaSArIDFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBbMF0uc2V0KG1pblgsIG1pblkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbMF0sIHBbMF0pO1xyXG4gICAgICAgICAgICBwWzFdLnNldChtYXhYLCBtaW5ZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzFdLCBwWzFdKTtcclxuICAgICAgICAgICAgcFsyXS5zZXQobWF4WCwgbWF4WSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFsyXSwgcFsyXSk7XHJcbiAgICAgICAgICAgIHBbM10uc2V0KG1pblgsIG1heFkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbM10sIHBbM10pO1xyXG4gICAgICAgICAgICBpZiAoYWZ0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbMF0sIHBbMF0pO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFsxXSwgcFsxXSk7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzJdLCBwWzJdKTtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbM10sIHBbM10pO1xyXG4gICAgICAgICAgICAgICAgb3V0WzBdID0gcFswXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzFdID0gcFswXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzJdID0gcFsxXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzNdID0gcFsxXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzRdID0gcFsyXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzVdID0gcFsyXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzZdID0gcFszXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzddID0gcFszXS55O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBbaV0ueSA8IHBbMF0ueSB8fCBwW2ldLnkgPT0gcFswXS55ICYmIHBbaV0ueCA8IHBbMF0ueCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IHBbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBbMF0gPSBwW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwW2ldID0gdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhW2ldID0gTWF0aC5hdGFuMihwW2ldLnkgLSBwWzBdLnksIHBbaV0ueCAtIHBbMF0ueCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gaSArIDE7IGogPD0gMzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhW2ldID4gYVtqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBwW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFtpXSA9IHBbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwW2pdID0gdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0MiA9IGFbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhW2ldID0gYVtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFbal0gPSB0MjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dFswXSA9IHBbMF0ueDtcclxuICAgICAgICAgICAgICAgIG91dFsxXSA9IHBbMF0ueTtcclxuICAgICAgICAgICAgICAgIG91dFsyXSA9IHBbMV0ueDtcclxuICAgICAgICAgICAgICAgIG91dFszXSA9IHBbMV0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs0XSA9IHBbMl0ueDtcclxuICAgICAgICAgICAgICAgIG91dFs1XSA9IHBbMl0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs2XSA9IHBbM10ueDtcclxuICAgICAgICAgICAgICAgIG91dFs3XSA9IHBbM10ueTtcclxuICAgICAgICAgICAgICAgIGlmICgocFszXS54IC0gcFsyXS54KSAqIChwWzFdLnkgLSBwWzJdLnkpIC0gKHBbMV0ueCAtIHBbMl0ueCkgKiAocFszXS55IC0gcFsyXS55KSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRbNF0gPSBwWzNdLng7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0WzVdID0gcFszXS55O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFN1cmZhY2U7XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlN1cmZhY2UgPSBTdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgdmFyIHRlbXBSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKCk7XHJcbiAgICB2YXIgdGVtcFBvaW50ID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgIHZhciBCaWxpbmVhclN1cmZhY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhCaWxpbmVhclN1cmZhY2UsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gQmlsaW5lYXJTdXJmYWNlKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5kaXN0b3J0aW9uID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3RvcnRpb24uc2V0KDAsIDApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGQgPSB0aGlzLmRpc3RvcnRpb247XHJcbiAgICAgICAgICAgIHZhciBtID0gcG9zLnggKiBwb3MueTtcclxuICAgICAgICAgICAgbmV3UG9zLnggPSBwb3MueCArIGQueCAqIG07XHJcbiAgICAgICAgICAgIG5ld1Bvcy55ID0gcG9zLnkgKyBkLnkgKiBtO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciB2eCA9IHBvcy54LCB2eSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgZHggPSB0aGlzLmRpc3RvcnRpb24ueCwgZHkgPSB0aGlzLmRpc3RvcnRpb24ueTtcclxuICAgICAgICAgICAgaWYgKGR4ID09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB2eDtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdnkgLyAoMS4wICsgZHkgKiB2eCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZHkgPT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHZ5O1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB2eCAvICgxLjAgKyBkeCAqIHZ5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gKHZ5ICogZHggLSB2eCAqIGR5ICsgMS4wKSAqIDAuNSAvIGR5O1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBiICogYiArIHZ4IC8gZHk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZCA8PSAwLjAwMDAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnNldChOYU4sIE5hTik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGR5ID4gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnggPSAtYiArIE1hdGguc3FydChkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gLWIgLSBNYXRoLnNxcnQoZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9ICh2eCAvIG5ld1Bvcy54IC0gMS4wKSAvIGR4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLm1hcFNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSAtc3ByaXRlLmFuY2hvci54ICogdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnkgPSAtc3ByaXRlLmFuY2hvci55ICogdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC53aWR0aCA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcFF1YWQodGVtcFJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSB8fCBzcHJpdGUudHJhbnNmb3JtKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUubWFwUXVhZCA9IGZ1bmN0aW9uIChyZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIGF4ID0gLXJlY3QueCAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheSA9IC1yZWN0LnkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4MiA9ICgxLjAgLSByZWN0LngpIC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5MiA9ICgxLjAgLSByZWN0LnkpIC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciB1cDF4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDF5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDJ4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheDIpICsgcXVhZFsxXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHVwMnkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgeDAwID0gdXAxeCAqICgxLjAgLSBheSkgKyBkb3duMXggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkwMCA9IHVwMXkgKiAoMS4wIC0gYXkpICsgZG93bjF5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MTAgPSB1cDJ4ICogKDEuMCAtIGF5KSArIGRvd24yeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTEwID0gdXAyeSAqICgxLjAgLSBheSkgKyBkb3duMnkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgwMSA9IHVwMXggKiAoMS4wIC0gYXkyKSArIGRvd24xeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkwMSA9IHVwMXkgKiAoMS4wIC0gYXkyKSArIGRvd24xeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHgxMSA9IHVwMnggKiAoMS4wIC0gYXkyKSArIGRvd24yeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkxMSA9IHVwMnkgKiAoMS4wIC0gYXkyKSArIGRvd24yeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIG1hdCA9IHRlbXBNYXQ7XHJcbiAgICAgICAgICAgIG1hdC50eCA9IHgwMDtcclxuICAgICAgICAgICAgbWF0LnR5ID0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYSA9IHgxMCAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmIgPSB5MTAgLSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5jID0geDAxIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuZCA9IHkwMSAtIHkwMDtcclxuICAgICAgICAgICAgdGVtcFBvaW50LnNldCh4MTEsIHkxMSk7XHJcbiAgICAgICAgICAgIG1hdC5hcHBseUludmVyc2UodGVtcFBvaW50LCB0ZW1wUG9pbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3RvcnRpb24uc2V0KHRlbXBQb2ludC54IC0gMSwgdGVtcFBvaW50LnkgLSAxKTtcclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNldEZyb21NYXRyaXgobWF0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmZpbGxVbmlmb3JtcyA9IGZ1bmN0aW9uICh1bmlmb3Jtcykge1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uID0gdW5pZm9ybXMuZGlzdG9ydGlvbiB8fCBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAwXSk7XHJcbiAgICAgICAgICAgIHZhciBheCA9IE1hdGguYWJzKHRoaXMuZGlzdG9ydGlvbi54KTtcclxuICAgICAgICAgICAgdmFyIGF5ID0gTWF0aC5hYnModGhpcy5kaXN0b3J0aW9uLnkpO1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzBdID0gYXggKiAxMDAwMCA8PSBheSA/IDAgOiB0aGlzLmRpc3RvcnRpb24ueDtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblsxXSA9IGF5ICogMTAwMDAgPD0gYXggPyAwIDogdGhpcy5kaXN0b3J0aW9uLnk7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bMl0gPSAxLjAgLyB1bmlmb3Jtcy5kaXN0b3J0aW9uWzBdO1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzNdID0gMS4wIC8gdW5pZm9ybXMuZGlzdG9ydGlvblsxXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBCaWxpbmVhclN1cmZhY2U7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5TdXJmYWNlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uQmlsaW5lYXJTdXJmYWNlID0gQmlsaW5lYXJTdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgQ29udGFpbmVyMnMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhDb250YWluZXIycywgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBDb250YWluZXIycygpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29udGFpbmVyMnMucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gQ29udGFpbmVyMnM7XHJcbiAgICB9KFBJWEkuQ29udGFpbmVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uQ29udGFpbmVyMnMgPSBDb250YWluZXIycztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIGZ1biA9IFBJWEkuVHJhbnNmb3JtU3RhdGljLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1IYWNrKHBhcmVudFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZhciBwcm9qID0gdGhpcy5wcm9qO1xyXG4gICAgICAgIHZhciBwcCA9IHBhcmVudFRyYW5zZm9ybS5wcm9qO1xyXG4gICAgICAgIHZhciB0YSA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCFwcCkge1xyXG4gICAgICAgICAgICBmdW4uY2FsbCh0aGlzLCBwYXJlbnRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocHAuX3N1cmZhY2UpIHtcclxuICAgICAgICAgICAgcHJvai5fYWN0aXZlUHJvamVjdGlvbiA9IHBwO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxvY2FsVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxUcmFuc2Zvcm0uY29weSh0aGlzLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgaWYgKHRhLl9wYXJlbnRJRCA8IDApIHtcclxuICAgICAgICAgICAgICAgICsrdGEuX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW4uY2FsbCh0aGlzLCBwYXJlbnRUcmFuc2Zvcm0pO1xyXG4gICAgICAgIHByb2ouX2FjdGl2ZVByb2plY3Rpb24gPSBwcC5fYWN0aXZlUHJvamVjdGlvbjtcclxuICAgIH1cclxuICAgIHZhciBQcm9qZWN0aW9uU3VyZmFjZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFByb2plY3Rpb25TdXJmYWNlLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb25TdXJmYWNlKGxlZ2FjeSwgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGxlZ2FjeSwgZW5hYmxlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5fc3VyZmFjZSA9IG51bGw7XHJcbiAgICAgICAgICAgIF90aGlzLl9hY3RpdmVQcm9qZWN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnRTdXJmYWNlSUQgPSAtMTtcclxuICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnRMZWdhY3lJRCA9IC0xO1xyXG4gICAgICAgICAgICBfdGhpcy5fbGFzdFVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLCBcImVuYWJsZWRcIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl9lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gdHJhbnNmb3JtSGFjaztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IFBJWEkuVHJhbnNmb3JtU3RhdGljLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUsIFwic3VyZmFjZVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1cmZhY2U7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSA9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1cmZhY2UgPSB2YWx1ZSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5hcHBseVBhcnRpYWwgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdXJmYWNlLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24ubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5zdXJmYWNlLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMuX2FjdGl2ZVByb2plY3Rpb24ubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLl9zdXJmYWNlLmFwcGx5SW52ZXJzZShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdXJmYWNlLmFwcGx5SW52ZXJzZShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUubWFwQmlsaW5lYXJTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkKSB7XHJcbiAgICAgICAgICAgIGlmICghKHRoaXMuX3N1cmZhY2UgaW5zdGFuY2VvZiBwaXhpX3Byb2plY3Rpb24uQmlsaW5lYXJTdXJmYWNlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJmYWNlID0gbmV3IHBpeGlfcHJvamVjdGlvbi5CaWxpbmVhclN1cmZhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cmZhY2UubWFwU3ByaXRlKHNwcml0ZSwgcXVhZCwgdGhpcy5sZWdhY3kpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cmZhY2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZSwgXCJ1bmlmb3Jtc1wiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRMZWdhY3lJRCA9PT0gdGhpcy5sZWdhY3kuX3dvcmxkSUQgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50U3VyZmFjZUlEID09PSB0aGlzLnN1cmZhY2UuX3VwZGF0ZUlEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3RVbmlmb3JtcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RVbmlmb3JtcyA9IHRoaXMuX2xhc3RVbmlmb3JtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RVbmlmb3Jtcy53b3JsZFRyYW5zZm9ybSA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLnRvQXJyYXkodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXJmYWNlLmZpbGxVbmlmb3Jtcyh0aGlzLl9sYXN0VW5pZm9ybXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3RVbmlmb3JtcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb25TdXJmYWNlO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlID0gUHJvamVjdGlvblN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIHZhciBTcHJpdGVCaWxpbmVhclJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlQmlsaW5lYXJSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGVCaWxpbmVhclJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuc2l6ZSA9IDEwMDtcclxuICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMID0gMTtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMxO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczI7XFxuYXR0cmlidXRlIHZlYzQgYUZyYW1lO1xcbmF0dHJpYnV0ZSB2ZWM0IGFDb2xvcjtcXG5hdHRyaWJ1dGUgZmxvYXQgYVRleHR1cmVJZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgd29ybGRUcmFuc2Zvcm07XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiB3b3JsZFRyYW5zZm9ybSAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcbiAgICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG4gICAgdlRyYW5zMSA9IGFUcmFuczE7XFxuICAgIHZUcmFuczIgPSBhVHJhbnMyO1xcbiAgICB2VGV4dHVyZUlkID0gYVRleHR1cmVJZDtcXG4gICAgdkNvbG9yID0gYUNvbG9yO1xcbiAgICB2RnJhbWUgPSBhRnJhbWU7XFxufVxcblwiO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcnNbJWNvdW50JV07XFxudW5pZm9ybSB2ZWMyIHNhbXBsZXJTaXplWyVjb3VudCVdOyBcXG51bmlmb3JtIHZlYzQgZGlzdG9ydGlvbjtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxudmVjMiBzdXJmYWNlO1xcbnZlYzIgc3VyZmFjZTI7XFxuXFxuZmxvYXQgdnggPSB2VGV4dHVyZUNvb3JkLng7XFxuZmxvYXQgdnkgPSB2VGV4dHVyZUNvb3JkLnk7XFxuZmxvYXQgZHggPSBkaXN0b3J0aW9uLng7XFxuZmxvYXQgZHkgPSBkaXN0b3J0aW9uLnk7XFxuZmxvYXQgcmV2eCA9IGRpc3RvcnRpb24uejtcXG5mbG9hdCByZXZ5ID0gZGlzdG9ydGlvbi53O1xcblxcbmlmIChkaXN0b3J0aW9uLnggPT0gMC4wKSB7XFxuICAgIHN1cmZhY2UueCA9IHZ4O1xcbiAgICBzdXJmYWNlLnkgPSB2eSAvICgxLjAgKyBkeSAqIHZ4KTtcXG4gICAgc3VyZmFjZTIgPSBzdXJmYWNlO1xcbn0gZWxzZVxcbmlmIChkaXN0b3J0aW9uLnkgPT0gMC4wKSB7XFxuICAgIHN1cmZhY2UueSA9IHZ5O1xcbiAgICBzdXJmYWNlLnggPSB2eC8gKDEuMCArIGR4ICogdnkpO1xcbiAgICBzdXJmYWNlMiA9IHN1cmZhY2U7XFxufSBlbHNlIHtcXG4gICAgZmxvYXQgYyA9IHZ5ICogZHggLSB2eCAqIGR5O1xcbiAgICBmbG9hdCBiID0gKGMgKyAxLjApICogMC41O1xcbiAgICBmbG9hdCBiMiA9ICgtYyArIDEuMCkgKiAwLjU7XFxuICAgIGZsb2F0IGQgPSBiICogYiArIHZ4ICogZHk7XFxuICAgIGlmIChkIDwgLTAuMDAwMDEpIHtcXG4gICAgICAgIGRpc2NhcmQ7XFxuICAgIH1cXG4gICAgZCA9IHNxcnQobWF4KGQsIDAuMCkpO1xcbiAgICBzdXJmYWNlLnggPSAoLSBiICsgZCkgKiByZXZ5O1xcbiAgICBzdXJmYWNlMi54ID0gKC0gYiAtIGQpICogcmV2eTtcXG4gICAgc3VyZmFjZS55ID0gKC0gYjIgKyBkKSAqIHJldng7XFxuICAgIHN1cmZhY2UyLnkgPSAoLSBiMiAtIGQpICogcmV2eDtcXG59XFxuXFxudmVjMiB1djtcXG51di54ID0gdlRyYW5zMS54ICogc3VyZmFjZS54ICsgdlRyYW5zMS55ICogc3VyZmFjZS55ICsgdlRyYW5zMS56O1xcbnV2LnkgPSB2VHJhbnMyLnggKiBzdXJmYWNlLnggKyB2VHJhbnMyLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMyLno7XFxuXFxudmVjMiBwaXhlbHMgPSB1diAqIHNhbXBsZXJTaXplWzBdO1xcblxcbmlmIChwaXhlbHMueCA8IHZGcmFtZS54IHx8IHBpeGVscy54ID4gdkZyYW1lLnogfHxcXG4gICAgcGl4ZWxzLnkgPCB2RnJhbWUueSB8fCBwaXhlbHMueSA+IHZGcmFtZS53KSB7XFxuICAgIHV2LnggPSB2VHJhbnMxLnggKiBzdXJmYWNlMi54ICsgdlRyYW5zMS55ICogc3VyZmFjZTIueSArIHZUcmFuczEuejtcXG4gICAgdXYueSA9IHZUcmFuczIueCAqIHN1cmZhY2UyLnggKyB2VHJhbnMyLnkgKiBzdXJmYWNlMi55ICsgdlRyYW5zMi56O1xcbiAgICBwaXhlbHMgPSB1diAqIHNhbXBsZXJTaXplWzBdO1xcbiAgICBcXG4gICAgaWYgKHBpeGVscy54IDwgdkZyYW1lLnggfHwgcGl4ZWxzLnggPiB2RnJhbWUueiB8fFxcbiAgICAgICAgcGl4ZWxzLnkgPCB2RnJhbWUueSB8fCBwaXhlbHMueSA+IHZGcmFtZS53KSB7XFxuICAgICAgICBkaXNjYXJkO1xcbiAgICB9XFxufVxcblxcbnZlYzQgZWRnZTtcXG5lZGdlLnh5ID0gY2xhbXAocGl4ZWxzIC0gdkZyYW1lLnh5ICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcbmVkZ2UuencgPSBjbGFtcCh2RnJhbWUuencgLSBwaXhlbHMgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuXFxuZmxvYXQgYWxwaGEgPSAxLjA7IC8vZWRnZS54ICogZWRnZS55ICogZWRnZS56ICogZWRnZS53O1xcbnZlYzQgckNvbG9yID0gdkNvbG9yICogYWxwaGE7XFxuXFxuZmxvYXQgdGV4dHVyZUlkID0gZmxvb3IodlRleHR1cmVJZCswLjUpO1xcbnZlYzQgY29sb3I7XFxudmVjMiB0ZXh0dXJlQ29vcmQgPSB1djtcXG4lZm9ybG9vcCVcXG5nbF9GcmFnQ29sb3IgPSBjb2xvciAqIHJDb2xvcjtcXG59XCI7XHJcbiAgICAgICAgICAgIF90aGlzLmRlZlVuaWZvcm1zID0ge1xyXG4gICAgICAgICAgICAgICAgd29ybGRUcmFuc2Zvcm06IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdKSxcclxuICAgICAgICAgICAgICAgIGRpc3RvcnRpb246IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDBdKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIucHJvdG90eXBlLmdldFVuaWZvcm1zID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvaiA9IHNwcml0ZS5wcm9qO1xyXG4gICAgICAgICAgICB2YXIgc2hhZGVyID0gdGhpcy5zaGFkZXI7XHJcbiAgICAgICAgICAgIGlmIChwcm9qLnN1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9qLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai5fYWN0aXZlUHJvamVjdGlvbi51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZVbmlmb3JtcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZVZhbyA9IGZ1bmN0aW9uICh2ZXJ0ZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgdGhpcy52ZXJ0U2l6ZSA9IDE0O1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRCeXRlU2l6ZSA9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB2YXIgdmFvID0gdGhpcy5yZW5kZXJlci5jcmVhdGVWYW8oKVxyXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KHRoaXMuaW5kZXhCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVZlcnRleFBvc2l0aW9uLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAwKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczEsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDIgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczIsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDUgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFGcmFtZSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgOCAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUNvbG9yLCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTIgKiA0KTtcclxuICAgICAgICAgICAgaWYgKGF0dHJzLmFUZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgICAgIHZhby5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUlkLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAxMyAqIDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YW87XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVCaWxpbmVhclJlbmRlcmVyLnByb3RvdHlwZS5maWxsVmVydGljZXMgPSBmdW5jdGlvbiAoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIHRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHNwcml0ZS52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdyA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4ID0gc3ByaXRlLl9hbmNob3IuX3g7XHJcbiAgICAgICAgICAgIHZhciBheSA9IHNwcml0ZS5fYW5jaG9yLl95O1xyXG4gICAgICAgICAgICB2YXIgZnJhbWUgPSB0ZXguX2ZyYW1lO1xyXG4gICAgICAgICAgICB2YXIgYVRyYW5zID0gc3ByaXRlLmFUcmFucztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbaSAqIDJdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbaSAqIDIgKyAxXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSBhVHJhbnMuYTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgM10gPSBhVHJhbnMuYztcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNF0gPSBhVHJhbnMudHg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDVdID0gYVRyYW5zLmI7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gYVRyYW5zLmQ7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gYVRyYW5zLnR5O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IGZyYW1lLng7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDldID0gZnJhbWUueTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTBdID0gZnJhbWUueCArIGZyYW1lLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMV0gPSBmcmFtZS55ICsgZnJhbWUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDEyXSA9IGFyZ2I7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHRleHR1cmVJZDtcclxuICAgICAgICAgICAgICAgIGluZGV4ICs9IDE0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlQmlsaW5lYXJSZW5kZXJlcjtcclxuICAgIH0oTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIpKTtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignc3ByaXRlX2JpbGluZWFyJywgU3ByaXRlQmlsaW5lYXJSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIHZhciBTcHJpdGVTdHJhbmdlUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGVTdHJhbmdlUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlU3RyYW5nZVJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuc2l6ZSA9IDEwMDtcclxuICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMID0gMTtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMxO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczI7XFxuYXR0cmlidXRlIHZlYzQgYUZyYW1lO1xcbmF0dHJpYnV0ZSB2ZWM0IGFDb2xvcjtcXG5hdHRyaWJ1dGUgZmxvYXQgYVRleHR1cmVJZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgd29ybGRUcmFuc2Zvcm07XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiB3b3JsZFRyYW5zZm9ybSAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcbiAgICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG4gICAgdlRyYW5zMSA9IGFUcmFuczE7XFxuICAgIHZUcmFuczIgPSBhVHJhbnMyO1xcbiAgICB2VGV4dHVyZUlkID0gYVRleHR1cmVJZDtcXG4gICAgdkNvbG9yID0gYUNvbG9yO1xcbiAgICB2RnJhbWUgPSBhRnJhbWU7XFxufVxcblwiO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcnNbJWNvdW50JV07XFxudW5pZm9ybSB2ZWMyIHNhbXBsZXJTaXplWyVjb3VudCVdOyBcXG51bmlmb3JtIHZlYzQgcGFyYW1zO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG52ZWMyIHN1cmZhY2U7XFxuXFxuZmxvYXQgdnggPSB2VGV4dHVyZUNvb3JkLng7XFxuZmxvYXQgdnkgPSB2VGV4dHVyZUNvb3JkLnk7XFxuZmxvYXQgYWxlcGggPSBwYXJhbXMueDtcXG5mbG9hdCBiZXQgPSBwYXJhbXMueTtcXG5mbG9hdCBBID0gcGFyYW1zLno7XFxuZmxvYXQgQiA9IHBhcmFtcy53O1xcblxcbmlmIChhbGVwaCA9PSAwLjApIHtcXG5cXHRzdXJmYWNlLnkgPSB2eSAvICgxLjAgKyB2eCAqIGJldCk7XFxuXFx0c3VyZmFjZS54ID0gdng7XFxufVxcbmVsc2UgaWYgKGJldCA9PSAwLjApIHtcXG5cXHRzdXJmYWNlLnggPSB2eCAvICgxLjAgKyB2eSAqIGFsZXBoKTtcXG5cXHRzdXJmYWNlLnkgPSB2eTtcXG59IGVsc2Uge1xcblxcdHN1cmZhY2UueCA9IHZ4ICogKGJldCArIDEuMCkgLyAoYmV0ICsgMS4wICsgdnkgKiBhbGVwaCk7XFxuXFx0c3VyZmFjZS55ID0gdnkgKiAoYWxlcGggKyAxLjApIC8gKGFsZXBoICsgMS4wICsgdnggKiBiZXQpO1xcbn1cXG5cXG52ZWMyIHV2O1xcbnV2LnggPSB2VHJhbnMxLnggKiBzdXJmYWNlLnggKyB2VHJhbnMxLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMxLno7XFxudXYueSA9IHZUcmFuczIueCAqIHN1cmZhY2UueCArIHZUcmFuczIueSAqIHN1cmZhY2UueSArIHZUcmFuczIuejtcXG5cXG52ZWMyIHBpeGVscyA9IHV2ICogc2FtcGxlclNpemVbMF07XFxuXFxudmVjNCBlZGdlO1xcbmVkZ2UueHkgPSBjbGFtcChwaXhlbHMgLSB2RnJhbWUueHkgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuZWRnZS56dyA9IGNsYW1wKHZGcmFtZS56dyAtIHBpeGVscyArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5cXG5mbG9hdCBhbHBoYSA9IGVkZ2UueCAqIGVkZ2UueSAqIGVkZ2UueiAqIGVkZ2UudztcXG52ZWM0IHJDb2xvciA9IHZDb2xvciAqIGFscGhhO1xcblxcbmZsb2F0IHRleHR1cmVJZCA9IGZsb29yKHZUZXh0dXJlSWQrMC41KTtcXG52ZWM0IGNvbG9yO1xcbnZlYzIgdGV4dHVyZUNvb3JkID0gdXY7XFxuJWZvcmxvb3AlXFxuZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiByQ29sb3I7XFxufVwiO1xyXG4gICAgICAgICAgICBfdGhpcy5kZWZVbmlmb3JtcyA9IHtcclxuICAgICAgICAgICAgICAgIHdvcmxkVHJhbnNmb3JtOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAxXSksXHJcbiAgICAgICAgICAgICAgICBkaXN0b3J0aW9uOiBuZXcgRmxvYXQzMkFycmF5KFswLCAwXSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGVTdHJhbmdlUmVuZGVyZXIucHJvdG90eXBlLmdldFVuaWZvcm1zID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvaiA9IHNwcml0ZS5wcm9qO1xyXG4gICAgICAgICAgICB2YXIgc2hhZGVyID0gdGhpcy5zaGFkZXI7XHJcbiAgICAgICAgICAgIGlmIChwcm9qLnN1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9qLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai5fYWN0aXZlUHJvamVjdGlvbi51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZVbmlmb3JtcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZVN0cmFuZ2VSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlVmFvID0gZnVuY3Rpb24gKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRTaXplID0gMTQ7XHJcbiAgICAgICAgICAgIHRoaXMudmVydEJ5dGVTaXplID0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHZhciB2YW8gPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZVZhbygpXHJcbiAgICAgICAgICAgICAgICAuYWRkSW5kZXgodGhpcy5pbmRleEJ1ZmZlcilcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDApXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMiAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNSAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUZyYW1lLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA4ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hQ29sb3IsIGdsLlVOU0lHTkVEX0JZVEUsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCAxMiAqIDQpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cnMuYVRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICAgICAgdmFvLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlSWQsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEzICogNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZVN0cmFuZ2VSZW5kZXJlci5wcm90b3R5cGUuZmlsbFZlcnRpY2VzID0gZnVuY3Rpb24gKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCB0ZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSBzcHJpdGUudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHcgPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGggPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheCA9IHNwcml0ZS5fYW5jaG9yLl94O1xyXG4gICAgICAgICAgICB2YXIgYXkgPSBzcHJpdGUuX2FuY2hvci5feTtcclxuICAgICAgICAgICAgdmFyIGZyYW1lID0gdGV4Ll9mcmFtZTtcclxuICAgICAgICAgICAgdmFyIGFUcmFucyA9IHNwcml0ZS5hVHJhbnM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhW2kgKiAyXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhW2kgKiAyICsgMV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gYVRyYW5zLmE7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDNdID0gYVRyYW5zLmM7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDRdID0gYVRyYW5zLnR4O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA1XSA9IGFUcmFucy5iO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IGFUcmFucy5kO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IGFUcmFucy50eTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSBmcmFtZS54O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA5XSA9IGZyYW1lLnk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEwXSA9IGZyYW1lLnggKyBmcmFtZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTFdID0gZnJhbWUueSArIGZyYW1lLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAxMl0gPSBhcmdiO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB0ZXh0dXJlSWQ7XHJcbiAgICAgICAgICAgICAgICBpbmRleCArPSAxNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZVN0cmFuZ2VSZW5kZXJlcjtcclxuICAgIH0oTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIpKTtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignc3ByaXRlX3N0cmFuZ2UnLCBTcHJpdGVTdHJhbmdlUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgdmFyIHRlbXBSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKCk7XHJcbiAgICB2YXIgdGVtcFBvaW50ID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgIHZhciBTdHJhbmdlU3VyZmFjZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFN0cmFuZ2VTdXJmYWNlLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFN0cmFuZ2VTdXJmYWNlKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wYXJhbXMgPSBbMCwgMCwgTmFOLCBOYU5dO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgcFswXSA9IDA7XHJcbiAgICAgICAgICAgIHBbMV0gPSAwO1xyXG4gICAgICAgICAgICBwWzJdID0gTmFOO1xyXG4gICAgICAgICAgICBwWzNdID0gTmFOO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLnNldEF4aXNYID0gZnVuY3Rpb24gKHBvcywgZmFjdG9yLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueCwgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIHJvdCA9IG91dFRyYW5zZm9ybS5yb3RhdGlvbjtcclxuICAgICAgICAgICAgaWYgKHJvdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3ggLT0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3kgKz0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnJvdGF0aW9uID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy55ID0gTWF0aC5hdGFuMih5LCB4KTtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgaWYgKGZhY3RvciAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcFsyXSA9IC1kICogZmFjdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcFsyXSA9IE5hTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jYWxjMDEoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5zZXRBeGlzWSA9IGZ1bmN0aW9uIChwb3MsIGZhY3Rvciwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLngsIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciByb3QgPSBvdXRUcmFuc2Zvcm0ucm90YXRpb247XHJcbiAgICAgICAgICAgIGlmIChyb3QgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll94IC09IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll95ICs9IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5yb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcueCA9IC1NYXRoLmF0YW4yKHksIHgpICsgTWF0aC5QSSAvIDI7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHBbM10gPSAtZCAqIGZhY3RvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBbM10gPSBOYU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fY2FsYzAxKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuX2NhbGMwMSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgaWYgKGlzTmFOKHBbMl0pKSB7XHJcbiAgICAgICAgICAgICAgICBwWzFdID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihwWzNdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9IDEuMCAvIHBbM107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocFszXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBwWzFdID0gMS4wIC8gcFsyXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkID0gMS4wIC0gcFsyXSAqIHBbM107XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9ICgxLjAgLSBwWzJdKSAvIGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcFsxXSA9ICgxLjAgLSBwWzNdKSAvIGQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGFsZXBoID0gdGhpcy5wYXJhbXNbMF0sIGJldCA9IHRoaXMucGFyYW1zWzFdLCBBID0gdGhpcy5wYXJhbXNbMl0sIEIgPSB0aGlzLnBhcmFtc1szXTtcclxuICAgICAgICAgICAgdmFyIHUgPSBwb3MueCwgdiA9IHBvcy55O1xyXG4gICAgICAgICAgICBpZiAoYWxlcGggPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2ICogKDEgKyB1ICogYmV0KTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChiZXQgPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB1ICogKDEgKyB2ICogYWxlcGgpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIEQgPSBBICogQiAtIHYgKiB1O1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSBBICogdSAqIChCICsgdikgLyBEO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSBCICogdiAqIChBICsgdSkgLyBEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYWxlcGggPSB0aGlzLnBhcmFtc1swXSwgYmV0ID0gdGhpcy5wYXJhbXNbMV0sIEEgPSB0aGlzLnBhcmFtc1syXSwgQiA9IHRoaXMucGFyYW1zWzNdO1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54LCB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIGlmIChhbGVwaCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHkgLyAoMSArIHggKiBiZXQpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGJldCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHggKiAoMSArIHkgKiBhbGVwaCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHggKiAoYmV0ICsgMSkgLyAoYmV0ICsgMSArIHkgKiBhbGVwaCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHkgKiAoYWxlcGggKyAxKSAvIChhbGVwaCArIDEgKyB4ICogYmV0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLm1hcFNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSAtc3ByaXRlLmFuY2hvci54ICogdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnkgPSAtc3ByaXRlLmFuY2hvci55ICogdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC53aWR0aCA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcFF1YWQodGVtcFJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSB8fCBzcHJpdGUudHJhbnNmb3JtKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5tYXBRdWFkID0gZnVuY3Rpb24gKHJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgYXggPSAtcmVjdC54IC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gLXJlY3QueSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXgyID0gKDEuMCAtIHJlY3QueCkgLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkyID0gKDEuMCAtIHJlY3QueSkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIHVwMXggPSAocXVhZFswXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMXkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMnggPSAocXVhZFswXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXggPSAocXVhZFszXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsyXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheDIpICsgcXVhZFsyXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB4MDAgPSB1cDF4ICogKDEuMCAtIGF5KSArIGRvd24xeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTAwID0gdXAxeSAqICgxLjAgLSBheSkgKyBkb3duMXkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgxMCA9IHVwMnggKiAoMS4wIC0gYXkpICsgZG93bjJ4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MTAgPSB1cDJ5ICogKDEuMCAtIGF5KSArIGRvd24yeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDAxID0gdXAxeCAqICgxLjAgLSBheTIpICsgZG93bjF4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTAxID0gdXAxeSAqICgxLjAgLSBheTIpICsgZG93bjF5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeDExID0gdXAyeCAqICgxLjAgLSBheTIpICsgZG93bjJ4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTExID0gdXAyeSAqICgxLjAgLSBheTIpICsgZG93bjJ5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgbWF0ID0gdGVtcE1hdDtcclxuICAgICAgICAgICAgbWF0LnR4ID0geDAwO1xyXG4gICAgICAgICAgICBtYXQudHkgPSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5hID0geDEwIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuYiA9IHkxMCAtIHkwMDtcclxuICAgICAgICAgICAgbWF0LmMgPSB4MDEgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5kID0geTAxIC0geTAwO1xyXG4gICAgICAgICAgICB0ZW1wUG9pbnQuc2V0KHgxMSwgeTExKTtcclxuICAgICAgICAgICAgbWF0LmFwcGx5SW52ZXJzZSh0ZW1wUG9pbnQsIHRlbXBQb2ludCk7XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5zZXRGcm9tTWF0cml4KG1hdCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmZpbGxVbmlmb3JtcyA9IGZ1bmN0aW9uICh1bmlmb3Jtcykge1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIHZhciBkaXN0b3J0aW9uID0gdW5pZm9ybXMucGFyYW1zIHx8IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDAsIDAsIDBdKTtcclxuICAgICAgICAgICAgdW5pZm9ybXMucGFyYW1zID0gZGlzdG9ydGlvbjtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblswXSA9IHBhcmFtc1swXTtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblsxXSA9IHBhcmFtc1sxXTtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblsyXSA9IHBhcmFtc1syXTtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblszXSA9IHBhcmFtc1szXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTdHJhbmdlU3VyZmFjZTtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlN1cmZhY2UpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TdHJhbmdlU3VyZmFjZSA9IFN0cmFuZ2VTdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBQSVhJLlNwcml0ZS5wcm90b3R5cGUuY29udmVydFRvMnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGVfYmlsaW5lYXInO1xyXG4gICAgICAgIHRoaXMuYVRyYW5zID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbiAgICAgICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRUbzJzLmNhbGwodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRUbzJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0U3VidHJlZVRvMnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0VG8ycygpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmNvbnZlcnRTdWJ0cmVlVG8ycygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBTcHJpdGUycyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZTJzLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZTJzKHRleHR1cmUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dHVyZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuYVRyYW5zID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlX2JpbGluZWFyJztcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGUycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5fYm91bmRzLmFkZFF1YWQodGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RyYW5zZm9ybUlEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZUlEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0cmltID0gdGV4dHVyZS50cmltO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHcwID0gMDtcclxuICAgICAgICAgICAgdmFyIHcxID0gMDtcclxuICAgICAgICAgICAgdmFyIGgwID0gMDtcclxuICAgICAgICAgICAgdmFyIGgxID0gMDtcclxuICAgICAgICAgICAgaWYgKHRyaW0pIHtcclxuICAgICAgICAgICAgICAgIHcxID0gdHJpbS54IC0gKGFuY2hvci5feCAqIG9yaWcud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIHRyaW0ud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IHRyaW0ueSAtIChhbmNob3IuX3kgKiBvcmlnLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgdHJpbS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gaDA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gaDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2ouX3N1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB3dCA9IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSB3dC5hO1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSB3dC5iO1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSB3dC5jO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSB3dC5kO1xyXG4gICAgICAgICAgICAgICAgdmFyIHR4ID0gd3QudHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHkgPSB3dC50eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSAoYSAqIHcxKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gKGQgKiBoMSkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IChhICogdzApICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSAoZCAqIGgxKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gKGEgKiB3MCkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IChkICogaDApICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSAoYSAqIHcxKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gKGQgKiBoMCkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0ZXh0dXJlLnRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICAgICAgdGV4dHVyZS50cmFuc2Zvcm0gPSBuZXcgUElYSS5leHRyYXMuVGV4dHVyZVRyYW5zZm9ybSh0ZXh0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZXh0dXJlLnRyYW5zZm9ybS51cGRhdGUoKTtcclxuICAgICAgICAgICAgdmFyIGFUcmFucyA9IHRoaXMuYVRyYW5zO1xyXG4gICAgICAgICAgICBhVHJhbnMuc2V0KG9yaWcud2lkdGgsIDAsIDAsIG9yaWcuaGVpZ2h0LCB3MSwgaDEpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9zdXJmYWNlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhVHJhbnMucHJlcGVuZCh0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYVRyYW5zLmludmVydCgpO1xyXG4gICAgICAgICAgICBhVHJhbnMucHJlcGVuZCh0ZXh0dXJlLnRyYW5zZm9ybS5tYXBDb29yZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoOCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleFRyaW1tZWREYXRhO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gaDA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gaDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2ouX3N1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhLCB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gd3QuYTtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gd3QuYjtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gd3QuYztcclxuICAgICAgICAgICAgICAgIHZhciBkID0gd3QuZDtcclxuICAgICAgICAgICAgICAgIHZhciB0eCA9IHd0LnR4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5ID0gd3QudHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gKGEgKiB3MSkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IChkICogaDEpICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSAoYSAqIHcwKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gKGQgKiBoMSkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IChhICogdzApICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSAoZCAqIGgwKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gKGEgKiB3MSkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IChkICogaDApICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEsIHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbi5sZWdhY3kud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ByaXRlMnMucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlMnM7XHJcbiAgICB9KFBJWEkuU3ByaXRlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMgPSBTcHJpdGUycztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFRleHQycyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFRleHQycywgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBUZXh0MnModGV4dCwgc3R5bGUsIGNhbnZhcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0LCBzdHlsZSwgY2FudmFzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5hVHJhbnMgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGVfYmlsaW5lYXInO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUZXh0MnMucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gVGV4dDJzO1xyXG4gICAgfShQSVhJLlRleHQpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5UZXh0MnMgPSBUZXh0MnM7XHJcbiAgICBUZXh0MnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgIFRleHQycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICBUZXh0MnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIGZ1bmN0aW9uIGNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgIH1cclxuICAgIHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtID0gY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybTtcclxuICAgIHZhciBDb250YWluZXIyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKENvbnRhaW5lcjJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIENvbnRhaW5lcjJkKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29udGFpbmVyMmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gQ29udGFpbmVyMmQ7XHJcbiAgICB9KFBJWEkuQ29udGFpbmVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uQ29udGFpbmVyMmQgPSBDb250YWluZXIyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFBvaW50ID0gUElYSS5Qb2ludDtcclxuICAgIHZhciBtYXQzaWQgPSBbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV07XHJcbiAgICB2YXIgQUZGSU5FO1xyXG4gICAgKGZ1bmN0aW9uIChBRkZJTkUpIHtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiTk9ORVwiXSA9IDBdID0gXCJOT05FXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIkZSRUVcIl0gPSAxXSA9IFwiRlJFRVwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJBWElTX1hcIl0gPSAyXSA9IFwiQVhJU19YXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIkFYSVNfWVwiXSA9IDNdID0gXCJBWElTX1lcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiUE9JTlRcIl0gPSA0XSA9IFwiUE9JTlRcIjtcclxuICAgIH0pKEFGRklORSA9IHBpeGlfcHJvamVjdGlvbi5BRkZJTkUgfHwgKHBpeGlfcHJvamVjdGlvbi5BRkZJTkUgPSB7fSkpO1xyXG4gICAgdmFyIE1hdHJpeDJkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBNYXRyaXgyZChiYWNraW5nQXJyYXkpIHtcclxuICAgICAgICAgICAgdGhpcy5mbG9hdEFycmF5ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5tYXQzID0gbmV3IEZsb2F0NjRBcnJheShiYWNraW5nQXJyYXkgfHwgbWF0M2lkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJhXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzBdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzBdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiYlwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1sxXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1sxXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImNcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbM107XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbM10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzRdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzRdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwidHhcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbNl07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbNl0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJ0eVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1s3XTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1s3XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHR4LCB0eSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IGE7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBiO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IGM7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBkO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHR4O1xyXG4gICAgICAgICAgICBtYXQzWzddID0gdHk7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKHRyYW5zcG9zZSwgb3V0KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5mbG9hdEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb2F0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KDkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IG91dCB8fCB0aGlzLmZsb2F0QXJyYXk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBpZiAodHJhbnNwb3NlKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVswXSA9IG1hdDNbMF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVsxXSA9IG1hdDNbMV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVsyXSA9IG1hdDNbMl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVszXSA9IG1hdDNbM107XHJcbiAgICAgICAgICAgICAgICBhcnJheVs0XSA9IG1hdDNbNF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs1XSA9IG1hdDNbNV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs2XSA9IG1hdDNbNl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs3XSA9IG1hdDNbN107XHJcbiAgICAgICAgICAgICAgICBhcnJheVs4XSA9IG1hdDNbOF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVswXSA9IG1hdDNbMF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVsxXSA9IG1hdDNbM107XHJcbiAgICAgICAgICAgICAgICBhcnJheVsyXSA9IG1hdDNbNl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVszXSA9IG1hdDNbMV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs0XSA9IG1hdDNbNF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs1XSA9IG1hdDNbN107XHJcbiAgICAgICAgICAgICAgICBhcnJheVs2XSA9IG1hdDNbMl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs3XSA9IG1hdDNbNV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs4XSA9IG1hdDNbOF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueDtcclxuICAgICAgICAgICAgdmFyIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIHogPSAxLjAgLyAobWF0M1syXSAqIHggKyBtYXQzWzVdICogeSArIG1hdDNbOF0pO1xyXG4gICAgICAgICAgICBuZXdQb3MueCA9IHogKiAobWF0M1swXSAqIHggKyBtYXQzWzNdICogeSArIG1hdDNbNl0pO1xyXG4gICAgICAgICAgICBuZXdQb3MueSA9IHogKiAobWF0M1sxXSAqIHggKyBtYXQzWzRdICogeSArIG1hdDNbN10pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uICh0eCwgdHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gKz0gdHggKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzFdICs9IHR5ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1szXSArPSB0eCAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNF0gKz0gdHkgKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzZdICs9IHR4ICogbWF0M1s4XTtcclxuICAgICAgICAgICAgbWF0M1s3XSArPSB0eSAqIG1hdDNbOF07XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gKj0geDtcclxuICAgICAgICAgICAgbWF0M1sxXSAqPSB5O1xyXG4gICAgICAgICAgICBtYXQzWzNdICo9IHg7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gKj0geTtcclxuICAgICAgICAgICAgbWF0M1s2XSAqPSB4O1xyXG4gICAgICAgICAgICBtYXQzWzddICo9IHk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNjYWxlQW5kVHJhbnNsYXRlID0gZnVuY3Rpb24gKHNjYWxlWCwgc2NhbGVZLCB0eCwgdHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBzY2FsZVggKiBtYXQzWzBdICsgdHggKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gc2NhbGVZICogbWF0M1sxXSArIHR5ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1szXSA9IHNjYWxlWCAqIG1hdDNbM10gKyB0eCAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBzY2FsZVkgKiBtYXQzWzRdICsgdHkgKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gc2NhbGVYICogbWF0M1s2XSArIHR4ICogbWF0M1s4XTtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHNjYWxlWSAqIG1hdDNbN10gKyB0eSAqIG1hdDNbOF07XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLng7XHJcbiAgICAgICAgICAgIHZhciB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzNdLCBhMDIgPSBhWzZdLCBhMTAgPSBhWzFdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzddLCBhMjAgPSBhWzJdLCBhMjEgPSBhWzVdLCBhMjIgPSBhWzhdO1xyXG4gICAgICAgICAgICB2YXIgbmV3WCA9IChhMjIgKiBhMTEgLSBhMTIgKiBhMjEpICogeCArICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIHkgKyAoYTEyICogYTAxIC0gYTAyICogYTExKTtcclxuICAgICAgICAgICAgdmFyIG5ld1kgPSAoLWEyMiAqIGExMCArIGExMiAqIGEyMCkgKiB4ICsgKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiB5ICsgKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApO1xyXG4gICAgICAgICAgICB2YXIgbmV3WiA9IChhMjEgKiBhMTAgLSBhMTEgKiBhMjApICogeCArICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIHkgKyAoYTExICogYTAwIC0gYTAxICogYTEwKTtcclxuICAgICAgICAgICAgbmV3UG9zLnggPSBuZXdYIC8gbmV3WjtcclxuICAgICAgICAgICAgbmV3UG9zLnkgPSBuZXdZIC8gbmV3WjtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSwgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XSwgYjAxID0gYTIyICogYTExIC0gYTEyICogYTIxLCBiMTEgPSAtYTIyICogYTEwICsgYTEyICogYTIwLCBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjA7XHJcbiAgICAgICAgICAgIHZhciBkZXQgPSBhMDAgKiBiMDEgKyBhMDEgKiBiMTEgKyBhMDIgKiBiMjE7XHJcbiAgICAgICAgICAgIGlmICghZGV0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XHJcbiAgICAgICAgICAgIGFbMF0gPSBiMDEgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbMV0gPSAoLWEyMiAqIGEwMSArIGEwMiAqIGEyMSkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbMl0gPSAoYTEyICogYTAxIC0gYTAyICogYTExKSAqIGRldDtcclxuICAgICAgICAgICAgYVszXSA9IGIxMSAqIGRldDtcclxuICAgICAgICAgICAgYVs0XSA9IChhMjIgKiBhMDAgLSBhMDIgKiBhMjApICogZGV0O1xyXG4gICAgICAgICAgICBhWzVdID0gKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApICogZGV0O1xyXG4gICAgICAgICAgICBhWzZdID0gYjIxICogZGV0O1xyXG4gICAgICAgICAgICBhWzddID0gKC1hMjEgKiBhMDAgKyBhMDEgKiBhMjApICogZGV0O1xyXG4gICAgICAgICAgICBhWzhdID0gKGExMSAqIGEwMCAtIGEwMSAqIGExMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmlkZW50aXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4MmQodGhpcy5tYXQzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jb3B5VG8gPSBmdW5jdGlvbiAobWF0cml4KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYXIyID0gbWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIGFyMlswXSA9IG1hdDNbMF07XHJcbiAgICAgICAgICAgIGFyMlsxXSA9IG1hdDNbMV07XHJcbiAgICAgICAgICAgIGFyMlsyXSA9IG1hdDNbMl07XHJcbiAgICAgICAgICAgIGFyMlszXSA9IG1hdDNbM107XHJcbiAgICAgICAgICAgIGFyMls0XSA9IG1hdDNbNF07XHJcbiAgICAgICAgICAgIGFyMls1XSA9IG1hdDNbNV07XHJcbiAgICAgICAgICAgIGFyMls2XSA9IG1hdDNbNl07XHJcbiAgICAgICAgICAgIGFyMls3XSA9IG1hdDNbN107XHJcbiAgICAgICAgICAgIGFyMls4XSA9IG1hdDNbOF07XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIChtYXRyaXgsIGFmZmluZSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGQgPSAxLjAgLyBtYXQzWzhdO1xyXG4gICAgICAgICAgICB2YXIgdHggPSBtYXQzWzZdICogZCwgdHkgPSBtYXQzWzddICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmEgPSAobWF0M1swXSAtIG1hdDNbMl0gKiB0eCkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguYiA9IChtYXQzWzFdIC0gbWF0M1syXSAqIHR5KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5jID0gKG1hdDNbM10gLSBtYXQzWzVdICogdHgpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmQgPSAobWF0M1s0XSAtIG1hdDNbNV0gKiB0eSkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXgudHggPSB0eDtcclxuICAgICAgICAgICAgbWF0cml4LnR5ID0gdHk7XHJcbiAgICAgICAgICAgIGlmIChhZmZpbmUgPj0gMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFmZmluZSA9PT0gQUZGSU5FLlBPSU5UKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmEgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5iID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmQgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWZmaW5lID09PSBBRkZJTkUuQVhJU19YKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmMgPSAtbWF0cml4LmI7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmQgPSBtYXRyaXguYTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFmZmluZSA9PT0gQUZGSU5FLkFYSVNfWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5hID0gbWF0cml4LmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmMgPSAtbWF0cml4LmI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jb3B5RnJvbSA9IGZ1bmN0aW9uIChtYXRyaXgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBtYXRyaXguYTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IG1hdHJpeC5iO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IG1hdHJpeC5jO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gbWF0cml4LmQ7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gbWF0cml4LnR4O1xyXG4gICAgICAgICAgICBtYXQzWzddID0gbWF0cml4LnR5O1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMS4wO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zZXRUb011bHRMZWdhY3kgPSBmdW5jdGlvbiAocHQsIGx0KSB7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBiID0gbHQubWF0MztcclxuICAgICAgICAgICAgdmFyIGEwMCA9IHB0LmEsIGEwMSA9IHB0LmIsIGExMCA9IHB0LmMsIGExMSA9IHB0LmQsIGEyMCA9IHB0LnR4LCBhMjEgPSBwdC50eSwgYjAwID0gYlswXSwgYjAxID0gYlsxXSwgYjAyID0gYlsyXSwgYjEwID0gYlszXSwgYjExID0gYls0XSwgYjEyID0gYls1XSwgYjIwID0gYls2XSwgYjIxID0gYls3XSwgYjIyID0gYls4XTtcclxuICAgICAgICAgICAgb3V0WzBdID0gYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbMV0gPSBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFsyXSA9IGIwMjtcclxuICAgICAgICAgICAgb3V0WzNdID0gYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbNF0gPSBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs1XSA9IGIxMjtcclxuICAgICAgICAgICAgb3V0WzZdID0gYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbN10gPSBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs4XSA9IGIyMjtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2V0VG9NdWx0MmQgPSBmdW5jdGlvbiAocHQsIGx0KSB7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhID0gcHQubWF0MywgYiA9IGx0Lm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLCBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdLCBiMDAgPSBiWzBdLCBiMDEgPSBiWzFdLCBiMDIgPSBiWzJdLCBiMTAgPSBiWzNdLCBiMTEgPSBiWzRdLCBiMTIgPSBiWzVdLCBiMjAgPSBiWzZdLCBiMjEgPSBiWzddLCBiMjIgPSBiWzhdO1xyXG4gICAgICAgICAgICBvdXRbMF0gPSBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFsxXSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzJdID0gYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyO1xyXG4gICAgICAgICAgICBvdXRbM10gPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs0XSA9IGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzVdID0gYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyO1xyXG4gICAgICAgICAgICBvdXRbNl0gPSBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs3XSA9IGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzhdID0gYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLklERU5USVRZID0gbmV3IE1hdHJpeDJkKCk7XHJcbiAgICAgICAgTWF0cml4MmQuVEVNUF9NQVRSSVggPSBuZXcgTWF0cml4MmQoKTtcclxuICAgICAgICByZXR1cm4gTWF0cml4MmQ7XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkID0gTWF0cml4MmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUhhY2socGFyZW50VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmFyIHByb2ogPSB0aGlzLnByb2o7XHJcbiAgICAgICAgdmFyIHRhID0gdGhpcztcclxuICAgICAgICB2YXIgcHdpZCA9IHBhcmVudFRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICB2YXIgbHQgPSB0YS5sb2NhbFRyYW5zZm9ybTtcclxuICAgICAgICBpZiAodGEuX2xvY2FsSUQgIT09IHRhLl9jdXJyZW50TG9jYWxJRCkge1xyXG4gICAgICAgICAgICBsdC5hID0gdGEuX2N4ICogdGEuc2NhbGUuX3g7XHJcbiAgICAgICAgICAgIGx0LmIgPSB0YS5fc3ggKiB0YS5zY2FsZS5feDtcclxuICAgICAgICAgICAgbHQuYyA9IHRhLl9jeSAqIHRhLnNjYWxlLl95O1xyXG4gICAgICAgICAgICBsdC5kID0gdGEuX3N5ICogdGEuc2NhbGUuX3k7XHJcbiAgICAgICAgICAgIGx0LnR4ID0gdGEucG9zaXRpb24uX3ggLSAoKHRhLnBpdm90Ll94ICogbHQuYSkgKyAodGEucGl2b3QuX3kgKiBsdC5jKSk7XHJcbiAgICAgICAgICAgIGx0LnR5ID0gdGEucG9zaXRpb24uX3kgLSAoKHRhLnBpdm90Ll94ICogbHQuYikgKyAodGEucGl2b3QuX3kgKiBsdC5kKSk7XHJcbiAgICAgICAgICAgIHRhLl9jdXJyZW50TG9jYWxJRCA9IHRhLl9sb2NhbElEO1xyXG4gICAgICAgICAgICBwcm9qLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBfbWF0cml4SUQgPSBwcm9qLl9wcm9qSUQ7XHJcbiAgICAgICAgaWYgKHByb2ouX2N1cnJlbnRQcm9qSUQgIT09IF9tYXRyaXhJRCkge1xyXG4gICAgICAgICAgICBwcm9qLl9jdXJyZW50UHJvaklEID0gX21hdHJpeElEO1xyXG4gICAgICAgICAgICBpZiAoX21hdHJpeElEICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLmxvY2FsLnNldFRvTXVsdExlZ2FjeShsdCwgcHJvai5tYXRyaXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvai5sb2NhbC5jb3B5RnJvbShsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGEuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0YS5fcGFyZW50SUQgIT09IHB3aWQpIHtcclxuICAgICAgICAgICAgdmFyIHBwID0gcGFyZW50VHJhbnNmb3JtLnByb2o7XHJcbiAgICAgICAgICAgIGlmIChwcCAmJiAhcHAuYWZmaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLndvcmxkLnNldFRvTXVsdDJkKHBwLndvcmxkLCBwcm9qLmxvY2FsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb2oud29ybGQuc2V0VG9NdWx0TGVnYWN5KHBhcmVudFRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSwgcHJvai5sb2NhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvai53b3JsZC5jb3B5KHRhLndvcmxkVHJhbnNmb3JtLCBwcm9qLl9hZmZpbmUpO1xyXG4gICAgICAgICAgICB0YS5fcGFyZW50SUQgPSBwd2lkO1xyXG4gICAgICAgICAgICB0YS5fd29ybGRJRCsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciB0MCA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICB2YXIgdHQgPSBbbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKV07XHJcbiAgICB2YXIgdGVtcFJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoKTtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgdmFyIFByb2plY3Rpb24yZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFByb2plY3Rpb24yZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uMmQobGVnYWN5LCBlbmFibGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbGVnYWN5LCBlbmFibGUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLm1hdHJpeCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgX3RoaXMubG9jYWwgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIF90aGlzLndvcmxkID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvaklEID0gMDtcclxuICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICAgICAgX3RoaXMuX2FmZmluZSA9IHBpeGlfcHJvamVjdGlvbi5BRkZJTkUuTk9ORTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvbjJkLnByb3RvdHlwZSwgXCJhZmZpbmVcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZmZpbmU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWZmaW5lID09IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FmZmluZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvbjJkLnByb3RvdHlwZSwgXCJlbmFibGVkXCIsIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IHRyYW5zZm9ybUhhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSBQSVhJLlRyYW5zZm9ybVN0YXRpYy5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLnNldEF4aXNYID0gZnVuY3Rpb24gKHAsIGZhY3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yID09PSB2b2lkIDApIHsgZmFjdG9yID0gMTsgfVxyXG4gICAgICAgICAgICB2YXIgeCA9IHAueCwgeSA9IHAueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXRyaXgubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHggLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0geSAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSBmYWN0b3IgLyBkO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUuc2V0QXhpc1kgPSBmdW5jdGlvbiAocCwgZmFjdG9yKSB7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgPT09IHZvaWQgMCkgeyBmYWN0b3IgPSAxOyB9XHJcbiAgICAgICAgICAgIHZhciB4ID0gcC54LCB5ID0gcC55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0geCAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSB5IC8gZDtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IGZhY3RvciAvIGQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5tYXBTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGVtcFJlY3QueCA9IC1zcHJpdGUuYW5jaG9yLnggKiB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QueSA9IC1zcHJpdGUuYW5jaG9yLnkgKiB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LndpZHRoID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LmhlaWdodCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwUXVhZCh0ZW1wUmVjdCwgcXVhZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLm1hcFF1YWQgPSBmdW5jdGlvbiAocmVjdCwgcCkge1xyXG4gICAgICAgICAgICB0dFswXS5zZXQocmVjdC54LCByZWN0LnkpO1xyXG4gICAgICAgICAgICB0dFsxXS5zZXQocmVjdC54ICsgcmVjdC53aWR0aCwgcmVjdC55KTtcclxuICAgICAgICAgICAgdHRbMl0uc2V0KHJlY3QueCArIHJlY3Qud2lkdGgsIHJlY3QueSArIHJlY3QuaGVpZ2h0KTtcclxuICAgICAgICAgICAgdHRbM10uc2V0KHJlY3QueCwgcmVjdC55ICsgcmVjdC5oZWlnaHQpO1xyXG4gICAgICAgICAgICB2YXIgazEgPSAxLCBrMiA9IDIsIGszID0gMztcclxuICAgICAgICAgICAgdmFyIGYgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMuZ2V0SW50ZXJzZWN0aW9uRmFjdG9yKHBbMF0sIHBbMl0sIHBbMV0sIHBbM10sIHQwKTtcclxuICAgICAgICAgICAgaWYgKGYgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGsxID0gMTtcclxuICAgICAgICAgICAgICAgIGsyID0gMztcclxuICAgICAgICAgICAgICAgIGszID0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZDAgPSBNYXRoLnNxcnQoKHBbMF0ueCAtIHQwLngpICogKHBbMF0ueCAtIHQwLngpICsgKHBbMF0ueSAtIHQwLnkpICogKHBbMF0ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIGQxID0gTWF0aC5zcXJ0KChwW2sxXS54IC0gdDAueCkgKiAocFtrMV0ueCAtIHQwLngpICsgKHBbazFdLnkgLSB0MC55KSAqIChwW2sxXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgZDIgPSBNYXRoLnNxcnQoKHBbazJdLnggLSB0MC54KSAqIChwW2syXS54IC0gdDAueCkgKyAocFtrMl0ueSAtIHQwLnkpICogKHBbazJdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBkMyA9IE1hdGguc3FydCgocFtrM10ueCAtIHQwLngpICogKHBbazNdLnggLSB0MC54KSArIChwW2szXS55IC0gdDAueSkgKiAocFtrM10ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIHEwID0gKGQwICsgZDMpIC8gZDM7XHJcbiAgICAgICAgICAgIHZhciBxMSA9IChkMSArIGQyKSAvIGQyO1xyXG4gICAgICAgICAgICB2YXIgcTIgPSAoZDEgKyBkMikgLyBkMTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gdHRbMF0ueCAqIHEwO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gdHRbMF0ueSAqIHEwO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gcTA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSB0dFtrMV0ueCAqIHExO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gdHRbazFdLnkgKiBxMTtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IHExO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gdHRbazJdLnggKiBxMjtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHR0W2syXS55ICogcTI7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSBxMjtcclxuICAgICAgICAgICAgdGhpcy5tYXRyaXguaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgIG1hdDMgPSB0ZW1wTWF0Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBwWzBdLng7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBwWzBdLnk7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gcFtrMV0ueDtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHBbazFdLnk7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gcFtrMl0ueDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHBbazJdLnk7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxO1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeC5zZXRUb011bHQyZCh0ZW1wTWF0LCB0aGlzLm1hdHJpeCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeC5pZGVudGl0eSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb24yZDtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24pKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQgPSBQcm9qZWN0aW9uMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNZXNoMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhNZXNoMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gTWVzaDJkKHRleHR1cmUsIHZlcnRpY2VzLCB1dnMsIGluZGljZXMsIGRyYXdNb2RlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHR1cmUsIHZlcnRpY2VzLCB1dnMsIGluZGljZXMsIGRyYXdNb2RlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdtZXNoMmQnO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZXNoMmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gTWVzaDJkO1xyXG4gICAgfShQSVhJLm1lc2guTWVzaCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLk1lc2gyZCA9IE1lc2gyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgdHJhbnNsYXRpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHVUcmFuc2Zvcm07XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogdHJhbnNsYXRpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG5cXG4gICAgdlRleHR1cmVDb29yZCA9ICh1VHJhbnNmb3JtICogdmVjMyhhVGV4dHVyZUNvb3JkLCAxLjApKS54eTtcXG59XFxuXCI7XHJcbiAgICB2YXIgc2hhZGVyRnJhZyA9IFwiXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSB2ZWM0IHVDb2xvcjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkgKiB1Q29sb3I7XFxufVwiO1xyXG4gICAgdmFyIE1lc2gyZFJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoTWVzaDJkUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gTWVzaDJkUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgTWVzaDJkUmVuZGVyZXIucHJvdG90eXBlLm9uQ29udGV4dENoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdGhpcy5zaGFkZXIgPSBuZXcgUElYSS5TaGFkZXIoZ2wsIHNoYWRlclZlcnQsIHNoYWRlckZyYWcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIE1lc2gyZFJlbmRlcmVyO1xyXG4gICAgfShQSVhJLm1lc2guTWVzaFJlbmRlcmVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uTWVzaDJkUmVuZGVyZXIgPSBNZXNoMmRSZW5kZXJlcjtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignbWVzaDJkJywgTWVzaDJkUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBQSVhJLlNwcml0ZS5wcm90b3R5cGUuY29udmVydFRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlMmQnO1xyXG4gICAgICAgIHRoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5tZXNoLk1lc2gucHJvdG90eXBlLmNvbnZlcnRUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgdGhpcy5wbHVnaW5OYW1lID0gJ21lc2gyZCc7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0U3VidHJlZVRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0VG8yZCgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmNvbnZlcnRTdWJ0cmVlVG8yZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBTcHJpdGUyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZTJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZTJkKHRleHR1cmUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dHVyZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlMmQnO1xyXG4gICAgICAgICAgICBfdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlMmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kcy5hZGRRdWFkKHRoaXMudmVydGV4VHJpbW1lZERhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hZmZpbmUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRleERhdGEubGVuZ3RoICE9IDgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcy5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZlcnRleERhdGEubGVuZ3RoICE9IDEyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90cmFuc2Zvcm1JRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybUlEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB3dCA9IHRoaXMucHJvai53b3JsZC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRyaW0gPSB0ZXh0dXJlLnRyaW07XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAwO1xyXG4gICAgICAgICAgICBpZiAodHJpbSkge1xyXG4gICAgICAgICAgICAgICAgdzEgPSB0cmltLnggLSAoYW5jaG9yLl94ICogb3JpZy53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgdHJpbS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gdHJpbS55IC0gKGFuY2hvci5feSAqIG9yaWcuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyB0cmltLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSAod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMSkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9ICh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgxKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gKHd0WzJdICogdzEpICsgKHd0WzVdICogaDEpICsgd3RbOF07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSAod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMSkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9ICh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgxKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gKHd0WzJdICogdzApICsgKHd0WzVdICogaDEpICsgd3RbOF07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSAod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMCkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9ICh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgwKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzhdID0gKHd0WzJdICogdzApICsgKHd0WzVdICogaDApICsgd3RbOF07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbOV0gPSAod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMCkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxMF0gPSAod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxMV0gPSAod3RbMl0gKiB3MSkgKyAod3RbNV0gKiBoMCkgKyB3dFs4XTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FmZmluZSkge1xyXG4gICAgICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoOCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleFRyaW1tZWREYXRhO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy5wcm9qLndvcmxkLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIHogPSAxLjAgLyAod3RbMl0gKiB3MSArIHd0WzVdICogaDEgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSB6ICogKCh3dFswXSAqIHcxKSArICh3dFszXSAqIGgxKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IHogKiAoKHd0WzFdICogdzEpICsgKHd0WzRdICogaDEpICsgd3RbN10pO1xyXG4gICAgICAgICAgICB6ID0gMS4wIC8gKHd0WzJdICogdzAgKyB3dFs1XSAqIGgxICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0geiAqICgod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMSkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSB6ICogKCh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgxKSArIHd0WzddKTtcclxuICAgICAgICAgICAgeiA9IDEuMCAvICh3dFsyXSAqIHcwICsgd3RbNV0gKiBoMCArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IHogKiAoKHd0WzBdICogdzApICsgKHd0WzNdICogaDApICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0geiAqICgod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XSk7XHJcbiAgICAgICAgICAgIHogPSAxLjAgLyAod3RbMl0gKiB3MSArIHd0WzVdICogaDAgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSB6ICogKCh3dFswXSAqIHcxKSArICh3dFszXSAqIGgwKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IHogKiAoKHd0WzFdICogdzEpICsgKHd0WzRdICogaDApICsgd3RbN10pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNwcml0ZTJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZTJkO1xyXG4gICAgfShQSVhJLlNwcml0ZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkID0gU3ByaXRlMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIHZhciBTcHJpdGUyZFJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlMmRSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGUyZFJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcbmF0dHJpYnV0ZSB2ZWM0IGFDb2xvcjtcXG5hdHRyaWJ1dGUgZmxvYXQgYVRleHR1cmVJZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiBhVmVydGV4UG9zaXRpb247XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuICAgIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG4gICAgdlRleHR1cmVJZCA9IGFUZXh0dXJlSWQ7XFxuICAgIHZDb2xvciA9IGFDb2xvcjtcXG59XFxuXCI7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSBcIlxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyc1slY291bnQlXTtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxudmVjNCBjb2xvcjtcXG52ZWMyIHRleHR1cmVDb29yZCA9IHZUZXh0dXJlQ29vcmQ7XFxuZmxvYXQgdGV4dHVyZUlkID0gZmxvb3IodlRleHR1cmVJZCswLjUpO1xcbiVmb3Jsb29wJVxcbmdsX0ZyYWdDb2xvciA9IGNvbG9yICogdkNvbG9yO1xcbn1cIjtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGUyZFJlbmRlcmVyLnByb3RvdHlwZS5jcmVhdGVWYW8gPSBmdW5jdGlvbiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudmVydFNpemUgPSA2O1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRCeXRlU2l6ZSA9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB2YXIgdmFvID0gdGhpcy5yZW5kZXJlci5jcmVhdGVWYW8oKVxyXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KHRoaXMuaW5kZXhCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVZlcnRleFBvc2l0aW9uLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAwKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlQ29vcmQsIGdsLlVOU0lHTkVEX1NIT1JULCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMyAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUNvbG9yLCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNCAqIDQpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cnMuYVRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICAgICAgdmFvLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlSWQsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDUgKiA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFvO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMmRSZW5kZXJlci5wcm90b3R5cGUuZmlsbFZlcnRpY2VzID0gZnVuY3Rpb24gKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCB0ZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSBzcHJpdGUudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHV2cyA9IHNwcml0ZS5fdGV4dHVyZS5fdXZzLnV2c1VpbnQzMjtcclxuICAgICAgICAgICAgaWYgKHZlcnRleERhdGEubGVuZ3RoID09PSA4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJlci5yb3VuZFBpeGVscykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNvbHV0aW9uID0gdGhpcy5yZW5kZXJlci5yZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9ICgodmVydGV4RGF0YVswXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSAoKHZlcnRleERhdGFbMV0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSAoKHZlcnRleERhdGFbMl0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gKCh2ZXJ0ZXhEYXRhWzNdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEyXSA9ICgodmVydGV4RGF0YVs0XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gKCh2ZXJ0ZXhEYXRhWzVdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxNF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOF0gPSAoKHZlcnRleERhdGFbNl0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE5XSA9ICgodmVydGV4RGF0YVs3XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMjBdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVswXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVsxXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSB2ZXJ0ZXhEYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSB2ZXJ0ZXhEYXRhWzNdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMl0gPSB2ZXJ0ZXhEYXRhWzRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdmVydGV4RGF0YVs1XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE0XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE4XSA9IHZlcnRleERhdGFbNl07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOV0gPSB2ZXJ0ZXhEYXRhWzddO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMjBdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVswXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IHZlcnRleERhdGFbMl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gdmVydGV4RGF0YVszXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSB2ZXJ0ZXhEYXRhWzRdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IHZlcnRleERhdGFbNV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEyXSA9IHZlcnRleERhdGFbNl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHZlcnRleERhdGFbN107XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE0XSA9IHZlcnRleERhdGFbOF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE4XSA9IHZlcnRleERhdGFbOV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE5XSA9IHZlcnRleERhdGFbMTBdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyMF0gPSB2ZXJ0ZXhEYXRhWzExXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgM10gPSB1dnNbMF07XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyA5XSA9IHV2c1sxXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDE1XSA9IHV2c1syXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDIxXSA9IHV2c1szXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDRdID0gdWludDMyVmlld1tpbmRleCArIDEwXSA9IHVpbnQzMlZpZXdbaW5kZXggKyAxNl0gPSB1aW50MzJWaWV3W2luZGV4ICsgMjJdID0gYXJnYjtcclxuICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA1XSA9IGZsb2F0MzJWaWV3W2luZGV4ICsgMTFdID0gZmxvYXQzMlZpZXdbaW5kZXggKyAxN10gPSBmbG9hdDMyVmlld1tpbmRleCArIDIzXSA9IHRleHR1cmVJZDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGUyZFJlbmRlcmVyO1xyXG4gICAgfShNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcikpO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdzcHJpdGUyZCcsIFNwcml0ZTJkUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgVGV4dDJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoVGV4dDJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFRleHQyZCh0ZXh0LCBzdHlsZSwgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHQsIHN0eWxlLCBjYW52YXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZTJkJztcclxuICAgICAgICAgICAgX3RoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUZXh0MmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gVGV4dDJkO1xyXG4gICAgfShQSVhJLlRleHQpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5UZXh0MmQgPSBUZXh0MmQ7XHJcbiAgICBUZXh0MmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgIFRleHQyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICBUZXh0MmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBQcm9qZWN0aW9uc01hbmFnZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb25zTWFuYWdlcihyZW5kZXJlcikge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29udGV4dENoYW5nZSA9IGZ1bmN0aW9uIChnbCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZ2wgPSBnbDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJlbmRlcmVyLm1hc2tNYW5hZ2VyLnB1c2hTcHJpdGVNYXNrID0gcHVzaFNwcml0ZU1hc2s7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcclxuICAgICAgICAgICAgcmVuZGVyZXIub24oJ2NvbnRleHQnLCB0aGlzLm9uQ29udGV4dENoYW5nZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFByb2plY3Rpb25zTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5vZmYoJ2NvbnRleHQnLCB0aGlzLm9uQ29udGV4dENoYW5nZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvbnNNYW5hZ2VyO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uc01hbmFnZXIgPSBQcm9qZWN0aW9uc01hbmFnZXI7XHJcbiAgICBmdW5jdGlvbiBwdXNoU3ByaXRlTWFzayh0YXJnZXQsIG1hc2tEYXRhKSB7XHJcbiAgICAgICAgdmFyIGFscGhhTWFza0ZpbHRlciA9IHRoaXMuYWxwaGFNYXNrUG9vbFt0aGlzLmFscGhhTWFza0luZGV4XTtcclxuICAgICAgICBpZiAoIWFscGhhTWFza0ZpbHRlcikge1xyXG4gICAgICAgICAgICBhbHBoYU1hc2tGaWx0ZXIgPSB0aGlzLmFscGhhTWFza1Bvb2xbdGhpcy5hbHBoYU1hc2tJbmRleF0gPSBbbmV3IHBpeGlfcHJvamVjdGlvbi5TcHJpdGVNYXNrRmlsdGVyMmQobWFza0RhdGEpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWxwaGFNYXNrRmlsdGVyWzBdLnJlc29sdXRpb24gPSB0aGlzLnJlbmRlcmVyLnJlc29sdXRpb247XHJcbiAgICAgICAgYWxwaGFNYXNrRmlsdGVyWzBdLm1hc2tTcHJpdGUgPSBtYXNrRGF0YTtcclxuICAgICAgICB0YXJnZXQuZmlsdGVyQXJlYSA9IG1hc2tEYXRhLmdldEJvdW5kcyh0cnVlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLmZpbHRlck1hbmFnZXIucHVzaEZpbHRlcih0YXJnZXQsIGFscGhhTWFza0ZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hbHBoYU1hc2tJbmRleCsrO1xyXG4gICAgfVxyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdwcm9qZWN0aW9ucycsIFByb2plY3Rpb25zTWFuYWdlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBzcHJpdGVNYXNrVmVydCA9IFwiXFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIG90aGVyTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMyB2TWFza0Nvb3JkO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG5cXG5cXHR2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG5cXHR2TWFza0Nvb3JkID0gb3RoZXJNYXRyaXggKiB2ZWMzKCBhVGV4dHVyZUNvb3JkLCAxLjApO1xcbn1cXG5cIjtcclxuICAgIHZhciBzcHJpdGVNYXNrRnJhZyA9IFwiXFxudmFyeWluZyB2ZWMzIHZNYXNrQ29vcmQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBhbHBoYTtcXG51bmlmb3JtIHNhbXBsZXIyRCBtYXNrO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgdmVjMiB1diA9IHZNYXNrQ29vcmQueHkgLyB2TWFza0Nvb3JkLno7XFxuICAgIFxcbiAgICB2ZWMyIHRleHQgPSBhYnMoIHV2IC0gMC41ICk7XFxuICAgIHRleHQgPSBzdGVwKDAuNSwgdGV4dCk7XFxuXFxuICAgIGZsb2F0IGNsaXAgPSAxLjAgLSBtYXgodGV4dC55LCB0ZXh0LngpO1xcbiAgICB2ZWM0IG9yaWdpbmFsID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjNCBtYXNreSA9IHRleHR1cmUyRChtYXNrLCB1dik7XFxuXFxuICAgIG9yaWdpbmFsICo9IChtYXNreS5yICogbWFza3kuYSAqIGFscGhhICogY2xpcCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IG9yaWdpbmFsO1xcbn1cXG5cIjtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgdmFyIFNwcml0ZU1hc2tGaWx0ZXIyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZU1hc2tGaWx0ZXIyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGVNYXNrRmlsdGVyMmQoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNwcml0ZU1hc2tWZXJ0LCBzcHJpdGVNYXNrRnJhZykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMubWFza01hdHJpeCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgc3ByaXRlLnJlbmRlcmFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgX3RoaXMubWFza1Nwcml0ZSA9IHNwcml0ZTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGVNYXNrRmlsdGVyMmQucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKGZpbHRlck1hbmFnZXIsIGlucHV0LCBvdXRwdXQsIGNsZWFyLCBjdXJyZW50U3RhdGUpIHtcclxuICAgICAgICAgICAgdmFyIG1hc2tTcHJpdGUgPSB0aGlzLm1hc2tTcHJpdGU7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybXMubWFzayA9IG1hc2tTcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3Jtcy5vdGhlck1hdHJpeCA9IFNwcml0ZU1hc2tGaWx0ZXIyZC5jYWxjdWxhdGVTcHJpdGVNYXRyaXgoY3VycmVudFN0YXRlLCB0aGlzLm1hc2tNYXRyaXgsIG1hc2tTcHJpdGUpO1xyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1zLmFscGhhID0gbWFza1Nwcml0ZS53b3JsZEFscGhhO1xyXG4gICAgICAgICAgICBmaWx0ZXJNYW5hZ2VyLmFwcGx5RmlsdGVyKHRoaXMsIGlucHV0LCBvdXRwdXQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlTWFza0ZpbHRlcjJkLmNhbGN1bGF0ZVNwcml0ZU1hdHJpeCA9IGZ1bmN0aW9uIChjdXJyZW50U3RhdGUsIG1hcHBlZE1hdHJpeCwgc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9qID0gc3ByaXRlLnByb2o7XHJcbiAgICAgICAgICAgIHZhciBmaWx0ZXJBcmVhID0gY3VycmVudFN0YXRlLnNvdXJjZUZyYW1lO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZVNpemUgPSBjdXJyZW50U3RhdGUucmVuZGVyVGFyZ2V0LnNpemU7XHJcbiAgICAgICAgICAgIHZhciB3b3JsZFRyYW5zZm9ybSA9IHByb2ogJiYgIXByb2ouX2FmZmluZSA/IHByb2oud29ybGQuY29weVRvKHRlbXBNYXQpIDogdGVtcE1hdC5jb3B5RnJvbShzcHJpdGUudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSBzcHJpdGUudGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICBtYXBwZWRNYXRyaXguc2V0KHRleHR1cmVTaXplLndpZHRoLCAwLCAwLCB0ZXh0dXJlU2l6ZS5oZWlnaHQsIGZpbHRlckFyZWEueCwgZmlsdGVyQXJlYS55KTtcclxuICAgICAgICAgICAgd29ybGRUcmFuc2Zvcm0uaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgIG1hcHBlZE1hdHJpeC5zZXRUb011bHQyZCh3b3JsZFRyYW5zZm9ybSwgbWFwcGVkTWF0cml4KTtcclxuICAgICAgICAgICAgbWFwcGVkTWF0cml4LnNjYWxlQW5kVHJhbnNsYXRlKDEuMCAvIHRleHR1cmUud2lkdGgsIDEuMCAvIHRleHR1cmUuaGVpZ2h0LCBzcHJpdGUuYW5jaG9yLngsIHNwcml0ZS5hbmNob3IueSk7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXBwZWRNYXRyaXg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlTWFza0ZpbHRlcjJkO1xyXG4gICAgfShQSVhJLkZpbHRlcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZU1hc2tGaWx0ZXIyZCA9IFNwcml0ZU1hc2tGaWx0ZXIyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLXByb2plY3Rpb24uanMubWFwIiwiLyohXG4gKiBwaXhpLXNvdW5kIC0gdjIuMC4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcGl4aWpzL3BpeGktc291bmRcbiAqIENvbXBpbGVkIFR1ZSwgMTQgTm92IDIwMTcgMTc6NTM6NDcgVVRDXG4gKlxuICogcGl4aS1zb3VuZCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlTb3VuZD1lLl9fcGl4aVNvdW5kfHx7fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlLHQpe2Z1bmN0aW9uIG4oKXt0aGlzLmNvbnN0cnVjdG9yPWV9byhlLHQpLGUucHJvdG90eXBlPW51bGw9PT10P09iamVjdC5jcmVhdGUodCk6KG4ucHJvdG90eXBlPXQucHJvdG90eXBlLG5ldyBuKX1pZihcInVuZGVmaW5lZFwiPT10eXBlb2YgUElYSSl0aHJvd1wiUGl4aUpTIHJlcXVpcmVkXCI7dmFyIG49ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5fb3V0cHV0PXQsdGhpcy5faW5wdXQ9ZX1yZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZGVzdGluYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2lucHV0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2ZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt2YXIgdD10aGlzO2lmKHRoaXMuX2ZpbHRlcnMmJih0aGlzLl9maWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oZSl7ZSYmZS5kaXNjb25uZWN0KCl9KSx0aGlzLl9maWx0ZXJzPW51bGwsdGhpcy5faW5wdXQuY29ubmVjdCh0aGlzLl9vdXRwdXQpKSxlJiZlLmxlbmd0aCl7dGhpcy5fZmlsdGVycz1lLnNsaWNlKDApLHRoaXMuX2lucHV0LmRpc2Nvbm5lY3QoKTt2YXIgbj1udWxsO2UuZm9yRWFjaChmdW5jdGlvbihlKXtudWxsPT09bj90Ll9pbnB1dC5jb25uZWN0KGUuZGVzdGluYXRpb24pOm4uY29ubmVjdChlLmRlc3RpbmF0aW9uKSxuPWV9KSxuLmNvbm5lY3QodGhpcy5fb3V0cHV0KX19LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuZmlsdGVycz1udWxsLHRoaXMuX2lucHV0PW51bGwsdGhpcy5fb3V0cHV0PW51bGx9LGV9KCksbz1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fHtfX3Byb3RvX186W119aW5zdGFuY2VvZiBBcnJheSYmZnVuY3Rpb24oZSx0KXtlLl9fcHJvdG9fXz10fXx8ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG4gaW4gdCl0Lmhhc093blByb3BlcnR5KG4pJiYoZVtuXT10W25dKX0saT0wLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2YXIgbj1lLmNhbGwodGhpcyl8fHRoaXM7cmV0dXJuIG4uaWQ9aSsrLG4uaW5pdCh0KSxufXJldHVybiB0KG4sZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicHJvZ3Jlc3NcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZS5jdXJyZW50VGltZS90aGlzLl9kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3BhdXNlZD1lLHRoaXMucmVmcmVzaFBhdXNlZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLl9vblBsYXk9ZnVuY3Rpb24oKXt0aGlzLl9wbGF5aW5nPSEwfSxuLnByb3RvdHlwZS5fb25QYXVzZT1mdW5jdGlvbigpe3RoaXMuX3BsYXlpbmc9ITF9LG4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5fcGxheWluZz0hMSx0aGlzLl9kdXJhdGlvbj1lLnNvdXJjZS5kdXJhdGlvbjt2YXIgdD10aGlzLl9zb3VyY2U9ZS5zb3VyY2UuY2xvbmVOb2RlKCExKTt0LnNyYz1lLnBhcmVudC51cmwsdC5vbnBsYXk9dGhpcy5fb25QbGF5LmJpbmQodGhpcyksdC5vbnBhdXNlPXRoaXMuX29uUGF1c2UuYmluZCh0aGlzKSxlLmNvbnRleHQub24oXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLGUuY29udGV4dC5vbihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyksdGhpcy5fbWVkaWE9ZX0sbi5wcm90b3R5cGUuX2ludGVybmFsU3RvcD1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmdGhpcy5fcGxheWluZyYmKHRoaXMuX3NvdXJjZS5vbmVuZGVkPW51bGwsdGhpcy5fc291cmNlLnBhdXNlKCkpfSxuLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7dGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5fc291cmNlJiZ0aGlzLmVtaXQoXCJzdG9wXCIpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzcGVlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zcGVlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInZvbHVtZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fdm9sdW1lPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibG9vcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbG9vcH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2xvb3A9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJtdXRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbXV0ZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9tdXRlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50O3RoaXMuX3NvdXJjZS5sb29wPXRoaXMuX2xvb3B8fHQubG9vcDt2YXIgbj1lLnZvbHVtZSooZS5tdXRlZD8wOjEpLG89dC52b2x1bWUqKHQubXV0ZWQ/MDoxKSxpPXRoaXMuX3ZvbHVtZSoodGhpcy5fbXV0ZWQ/MDoxKTt0aGlzLl9zb3VyY2Uudm9sdW1lPWkqbipvLHRoaXMuX3NvdXJjZS5wbGF5YmFja1JhdGU9dGhpcy5fc3BlZWQqZS5zcGVlZCp0LnNwZWVkfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudCxuPXRoaXMuX3BhdXNlZHx8dC5wYXVzZWR8fGUucGF1c2VkO24hPT10aGlzLl9wYXVzZWRSZWFsJiYodGhpcy5fcGF1c2VkUmVhbD1uLG4/KHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInBhdXNlZFwiKSk6KHRoaXMuZW1pdChcInJlc3VtZWRcIiksdGhpcy5wbGF5KHtzdGFydDp0aGlzLl9zb3VyY2UuY3VycmVudFRpbWUsZW5kOnRoaXMuX2VuZCx2b2x1bWU6dGhpcy5fdm9sdW1lLHNwZWVkOnRoaXMuX3NwZWVkLGxvb3A6dGhpcy5fbG9vcH0pKSx0aGlzLmVtaXQoXCJwYXVzZVwiLG4pKX0sbi5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlKXt2YXIgdD10aGlzLG89ZS5zdGFydCxpPWUuZW5kLHI9ZS5zcGVlZCxzPWUubG9vcCx1PWUudm9sdW1lLGE9ZS5tdXRlZDtpJiZjb25zb2xlLmFzc2VydChpPm8sXCJFbmQgdGltZSBpcyBiZWZvcmUgc3RhcnQgdGltZVwiKSx0aGlzLl9zcGVlZD1yLHRoaXMuX3ZvbHVtZT11LHRoaXMuX2xvb3A9ISFzLHRoaXMuX211dGVkPWEsdGhpcy5yZWZyZXNoKCksdGhpcy5sb29wJiZudWxsIT09aSYmKGNvbnNvbGUud2FybignTG9vcGluZyBub3Qgc3VwcG9ydCB3aGVuIHNwZWNpZnlpbmcgYW4gXCJlbmRcIiB0aW1lJyksdGhpcy5sb29wPSExKSx0aGlzLl9zdGFydD1vLHRoaXMuX2VuZD1pfHx0aGlzLl9kdXJhdGlvbix0aGlzLl9zdGFydD1NYXRoLm1heCgwLHRoaXMuX3N0YXJ0LW4uUEFERElORyksdGhpcy5fZW5kPU1hdGgubWluKHRoaXMuX2VuZCtuLlBBRERJTkcsdGhpcy5fZHVyYXRpb24pLHRoaXMuX3NvdXJjZS5vbmxvYWRlZG1ldGFkYXRhPWZ1bmN0aW9uKCl7dC5fc291cmNlJiYodC5fc291cmNlLmN1cnJlbnRUaW1lPW8sdC5fc291cmNlLm9ubG9hZGVkbWV0YWRhdGE9bnVsbCx0LmVtaXQoXCJwcm9ncmVzc1wiLG8sdC5fZHVyYXRpb24pLFBJWEkudGlja2VyLnNoYXJlZC5hZGQodC5fb25VcGRhdGUsdCkpfSx0aGlzLl9zb3VyY2Uub25lbmRlZD10aGlzLl9vbkNvbXBsZXRlLmJpbmQodGhpcyksdGhpcy5fc291cmNlLnBsYXkoKSx0aGlzLmVtaXQoXCJzdGFydFwiKX0sbi5wcm90b3R5cGUuX29uVXBkYXRlPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwicHJvZ3Jlc3NcIix0aGlzLnByb2dyZXNzLHRoaXMuX2R1cmF0aW9uKSx0aGlzLl9zb3VyY2UuY3VycmVudFRpbWU+PXRoaXMuX2VuZCYmIXRoaXMuX3NvdXJjZS5sb29wJiZ0aGlzLl9vbkNvbXBsZXRlKCl9LG4ucHJvdG90eXBlLl9vbkNvbXBsZXRlPWZ1bmN0aW9uKCl7UElYSS50aWNrZXIuc2hhcmVkLnJlbW92ZSh0aGlzLl9vblVwZGF0ZSx0aGlzKSx0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLDEsdGhpcy5fZHVyYXRpb24pLHRoaXMuZW1pdChcImVuZFwiLHRoaXMpfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7UElYSS50aWNrZXIuc2hhcmVkLnJlbW92ZSh0aGlzLl9vblVwZGF0ZSx0aGlzKSx0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO3ZhciBlPXRoaXMuX3NvdXJjZTtlJiYoZS5vbmVuZGVkPW51bGwsZS5vbnBsYXk9bnVsbCxlLm9ucGF1c2U9bnVsbCx0aGlzLl9pbnRlcm5hbFN0b3AoKSksdGhpcy5fc291cmNlPW51bGwsdGhpcy5fc3BlZWQ9MSx0aGlzLl92b2x1bWU9MSx0aGlzLl9sb29wPSExLHRoaXMuX2VuZD1udWxsLHRoaXMuX3N0YXJ0PTAsdGhpcy5fZHVyYXRpb249MCx0aGlzLl9wbGF5aW5nPSExLHRoaXMuX3BhdXNlZFJlYWw9ITEsdGhpcy5fcGF1c2VkPSExLHRoaXMuX211dGVkPSExLHRoaXMuX21lZGlhJiYodGhpcy5fbWVkaWEuY29udGV4dC5vZmYoXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLHRoaXMuX21lZGlhLmNvbnRleHQub2ZmKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKSx0aGlzLl9tZWRpYT1udWxsKX0sbi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIltIVE1MQXVkaW9JbnN0YW5jZSBpZD1cIit0aGlzLmlkK1wiXVwifSxuLlBBRERJTkc9LjEsbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLHM9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3JldHVybiBudWxsIT09ZSYmZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl8fHRoaXN9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMucGFyZW50PWUsdGhpcy5fc291cmNlPWUub3B0aW9ucy5zb3VyY2V8fG5ldyBBdWRpbyxlLnVybCYmKHRoaXMuX3NvdXJjZS5zcmM9ZS51cmwpfSxuLnByb3RvdHlwZS5jcmVhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IHIodGhpcyl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImlzUGxheWFibGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuISF0aGlzLl9zb3VyY2UmJjQ9PT10aGlzLl9zb3VyY2UucmVhZHlTdGF0ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJkdXJhdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlLmR1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGFyZW50LmNvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0sc2V0OmZ1bmN0aW9uKGUpe2NvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBmaWx0ZXJzXCIpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMucGFyZW50PW51bGwsdGhpcy5fc291cmNlJiYodGhpcy5fc291cmNlLnNyYz1cIlwiLHRoaXMuX3NvdXJjZS5sb2FkKCksdGhpcy5fc291cmNlPW51bGwpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzb3VyY2VcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX3NvdXJjZSxuPXRoaXMucGFyZW50O2lmKDQ9PT10LnJlYWR5U3RhdGUpe24uaXNMb2FkZWQ9ITA7dmFyIG89bi5hdXRvUGxheVN0YXJ0KCk7cmV0dXJuIHZvaWQoZSYmc2V0VGltZW91dChmdW5jdGlvbigpe2UobnVsbCxuLG8pfSwwKSl9aWYoIW4udXJsKXJldHVybiBlKG5ldyBFcnJvcihcInNvdW5kLnVybCBvciBzb3VuZC5zb3VyY2UgbXVzdCBiZSBzZXRcIikpO3Quc3JjPW4udXJsO3ZhciBpPWZ1bmN0aW9uKCl7dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2FucGxheXRocm91Z2hcIixyKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsciksdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIixzKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLHUpfSxyPWZ1bmN0aW9uKCl7aSgpLG4uaXNMb2FkZWQ9ITA7dmFyIHQ9bi5hdXRvUGxheVN0YXJ0KCk7ZSYmZShudWxsLG4sdCl9LHM9ZnVuY3Rpb24oKXtpKCksZSYmZShuZXcgRXJyb3IoXCJTb3VuZCBsb2FkaW5nIGhhcyBiZWVuIGFib3J0ZWRcIikpfSx1PWZ1bmN0aW9uKCl7aSgpO3ZhciBuPVwiRmFpbGVkIHRvIGxvYWQgYXVkaW8gZWxlbWVudCAoY29kZTogXCIrdC5lcnJvci5jb2RlK1wiKVwiO2U/ZShuZXcgRXJyb3IobikpOmNvbnNvbGUuZXJyb3Iobil9O3QuYWRkRXZlbnRMaXN0ZW5lcihcImNhbnBsYXl0aHJvdWdoXCIsciwhMSksdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLHIsITEpLHQuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIscywhMSksdC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIix1LCExKSx0LmxvYWQoKX0sbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLHU9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjp7fSxhPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHQ9e2V4cG9ydHM6e319LGUodCx0LmV4cG9ydHMpLHQuZXhwb3J0c30oZnVuY3Rpb24oZSl7IWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIG4oKXt9ZnVuY3Rpb24gbyhlLHQpe3JldHVybiBmdW5jdGlvbigpe2UuYXBwbHkodCxhcmd1bWVudHMpfX1mdW5jdGlvbiBpKGUpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiB0aGlzKXRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXdcIik7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGEgZnVuY3Rpb25cIik7dGhpcy5fc3RhdGU9MCx0aGlzLl9oYW5kbGVkPSExLHRoaXMuX3ZhbHVlPXZvaWQgMCx0aGlzLl9kZWZlcnJlZHM9W10sbChlLHRoaXMpfWZ1bmN0aW9uIHIoZSx0KXtmb3IoOzM9PT1lLl9zdGF0ZTspZT1lLl92YWx1ZTtpZigwPT09ZS5fc3RhdGUpcmV0dXJuIHZvaWQgZS5fZGVmZXJyZWRzLnB1c2godCk7ZS5faGFuZGxlZD0hMCxpLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpe3ZhciBuPTE9PT1lLl9zdGF0ZT90Lm9uRnVsZmlsbGVkOnQub25SZWplY3RlZDtpZihudWxsPT09bilyZXR1cm4gdm9pZCgxPT09ZS5fc3RhdGU/czp1KSh0LnByb21pc2UsZS5fdmFsdWUpO3ZhciBvO3RyeXtvPW4oZS5fdmFsdWUpfWNhdGNoKGUpe3JldHVybiB2b2lkIHUodC5wcm9taXNlLGUpfXModC5wcm9taXNlLG8pfSl9ZnVuY3Rpb24gcyhlLHQpe3RyeXtpZih0PT09ZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi5cIik7aWYodCYmKFwib2JqZWN0XCI9PXR5cGVvZiB0fHxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0KSl7dmFyIG49dC50aGVuO2lmKHQgaW5zdGFuY2VvZiBpKXJldHVybiBlLl9zdGF0ZT0zLGUuX3ZhbHVlPXQsdm9pZCBhKGUpO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG4pcmV0dXJuIHZvaWQgbChvKG4sdCksZSl9ZS5fc3RhdGU9MSxlLl92YWx1ZT10LGEoZSl9Y2F0Y2godCl7dShlLHQpfX1mdW5jdGlvbiB1KGUsdCl7ZS5fc3RhdGU9MixlLl92YWx1ZT10LGEoZSl9ZnVuY3Rpb24gYShlKXsyPT09ZS5fc3RhdGUmJjA9PT1lLl9kZWZlcnJlZHMubGVuZ3RoJiZpLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpe2UuX2hhbmRsZWR8fGkuX3VuaGFuZGxlZFJlamVjdGlvbkZuKGUuX3ZhbHVlKX0pO2Zvcih2YXIgdD0wLG49ZS5fZGVmZXJyZWRzLmxlbmd0aDt0PG47dCsrKXIoZSxlLl9kZWZlcnJlZHNbdF0pO2UuX2RlZmVycmVkcz1udWxsfWZ1bmN0aW9uIGMoZSx0LG4pe3RoaXMub25GdWxmaWxsZWQ9XCJmdW5jdGlvblwiPT10eXBlb2YgZT9lOm51bGwsdGhpcy5vblJlamVjdGVkPVwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dDpudWxsLHRoaXMucHJvbWlzZT1ufWZ1bmN0aW9uIGwoZSx0KXt2YXIgbj0hMTt0cnl7ZShmdW5jdGlvbihlKXtufHwobj0hMCxzKHQsZSkpfSxmdW5jdGlvbihlKXtufHwobj0hMCx1KHQsZSkpfSl9Y2F0Y2goZSl7aWYobilyZXR1cm47bj0hMCx1KHQsZSl9fXZhciBwPXNldFRpbWVvdXQ7aS5wcm90b3R5cGUuY2F0Y2g9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMudGhlbihudWxsLGUpfSxpLnByb3RvdHlwZS50aGVuPWZ1bmN0aW9uKGUsdCl7dmFyIG89bmV3IHRoaXMuY29uc3RydWN0b3Iobik7cmV0dXJuIHIodGhpcyxuZXcgYyhlLHQsbykpLG99LGkuYWxsPWZ1bmN0aW9uKGUpe3ZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGUpO3JldHVybiBuZXcgaShmdW5jdGlvbihlLG4pe2Z1bmN0aW9uIG8ocixzKXt0cnl7aWYocyYmKFwib2JqZWN0XCI9PXR5cGVvZiBzfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBzKSl7dmFyIHU9cy50aGVuO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHUpcmV0dXJuIHZvaWQgdS5jYWxsKHMsZnVuY3Rpb24oZSl7byhyLGUpfSxuKX10W3JdPXMsMD09LS1pJiZlKHQpfWNhdGNoKGUpe24oZSl9fWlmKDA9PT10Lmxlbmd0aClyZXR1cm4gZShbXSk7Zm9yKHZhciBpPXQubGVuZ3RoLHI9MDtyPHQubGVuZ3RoO3IrKylvKHIsdFtyXSl9KX0saS5yZXNvbHZlPWZ1bmN0aW9uKGUpe3JldHVybiBlJiZcIm9iamVjdFwiPT10eXBlb2YgZSYmZS5jb25zdHJ1Y3Rvcj09PWk/ZTpuZXcgaShmdW5jdGlvbih0KXt0KGUpfSl9LGkucmVqZWN0PWZ1bmN0aW9uKGUpe3JldHVybiBuZXcgaShmdW5jdGlvbih0LG4pe24oZSl9KX0saS5yYWNlPWZ1bmN0aW9uKGUpe3JldHVybiBuZXcgaShmdW5jdGlvbih0LG4pe2Zvcih2YXIgbz0wLGk9ZS5sZW5ndGg7bzxpO28rKyllW29dLnRoZW4odCxuKX0pfSxpLl9pbW1lZGlhdGVGbj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBzZXRJbW1lZGlhdGUmJmZ1bmN0aW9uKGUpe3NldEltbWVkaWF0ZShlKX18fGZ1bmN0aW9uKGUpe3AoZSwwKX0saS5fdW5oYW5kbGVkUmVqZWN0aW9uRm49ZnVuY3Rpb24oZSl7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGNvbnNvbGUmJmNvbnNvbGUmJmNvbnNvbGUud2FybihcIlBvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjpcIixlKX0saS5fc2V0SW1tZWRpYXRlRm49ZnVuY3Rpb24oZSl7aS5faW1tZWRpYXRlRm49ZX0saS5fc2V0VW5oYW5kbGVkUmVqZWN0aW9uRm49ZnVuY3Rpb24oZSl7aS5fdW5oYW5kbGVkUmVqZWN0aW9uRm49ZX0sZS5leHBvcnRzP2UuZXhwb3J0cz1pOnQuUHJvbWlzZXx8KHQuUHJvbWlzZT1pKX0odSl9KSxjPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMuZGVzdGluYXRpb249ZSx0aGlzLnNvdXJjZT10fHxlfXJldHVybiBlLnByb3RvdHlwZS5jb25uZWN0PWZ1bmN0aW9uKGUpe3RoaXMuc291cmNlLmNvbm5lY3QoZSl9LGUucHJvdG90eXBlLmRpc2Nvbm5lY3Q9ZnVuY3Rpb24oKXt0aGlzLnNvdXJjZS5kaXNjb25uZWN0KCl9LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmRpc2Nvbm5lY3QoKSx0aGlzLmRlc3RpbmF0aW9uPW51bGwsdGhpcy5zb3VyY2U9bnVsbH0sZX0oKSxsPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5zZXRQYXJhbVZhbHVlPWZ1bmN0aW9uKGUsdCl7aWYoZS5zZXRWYWx1ZUF0VGltZSl7dmFyIG49Uy5pbnN0YW5jZS5jb250ZXh0O2Uuc2V0VmFsdWVBdFRpbWUodCxuLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSl9ZWxzZSBlLnZhbHVlPXQ7cmV0dXJuIHR9LGV9KCkscD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQsbyxpLHIscyx1LGEsYyxwLGgpe3ZvaWQgMD09PXQmJih0PTApLHZvaWQgMD09PW8mJihvPTApLHZvaWQgMD09PWkmJihpPTApLHZvaWQgMD09PXImJihyPTApLHZvaWQgMD09PXMmJihzPTApLHZvaWQgMD09PXUmJih1PTApLHZvaWQgMD09PWEmJihhPTApLHZvaWQgMD09PWMmJihjPTApLHZvaWQgMD09PXAmJihwPTApLHZvaWQgMD09PWgmJihoPTApO3ZhciBkPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQoZD1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIGY9W3tmOm4uRjMyLHR5cGU6XCJsb3dzaGVsZlwiLGdhaW46dH0se2Y6bi5GNjQsdHlwZTpcInBlYWtpbmdcIixnYWluOm99LHtmOm4uRjEyNSx0eXBlOlwicGVha2luZ1wiLGdhaW46aX0se2Y6bi5GMjUwLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpyfSx7ZjpuLkY1MDAsdHlwZTpcInBlYWtpbmdcIixnYWluOnN9LHtmOm4uRjFLLHR5cGU6XCJwZWFraW5nXCIsZ2Fpbjp1fSx7ZjpuLkYySyx0eXBlOlwicGVha2luZ1wiLGdhaW46YX0se2Y6bi5GNEssdHlwZTpcInBlYWtpbmdcIixnYWluOmN9LHtmOm4uRjhLLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpwfSx7ZjpuLkYxNkssdHlwZTpcImhpZ2hzaGVsZlwiLGdhaW46aH1dLm1hcChmdW5jdGlvbihlKXt2YXIgdD1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO3JldHVybiB0LnR5cGU9ZS50eXBlLGwuc2V0UGFyYW1WYWx1ZSh0LmdhaW4sZS5nYWluKSxsLnNldFBhcmFtVmFsdWUodC5RLDEpLGwuc2V0UGFyYW1WYWx1ZSh0LmZyZXF1ZW5jeSxlLmYpLHR9KTsoZD1lLmNhbGwodGhpcyxmWzBdLGZbZi5sZW5ndGgtMV0pfHx0aGlzKS5iYW5kcz1mLGQuYmFuZHNNYXA9e307Zm9yKHZhciBfPTA7XzxkLmJhbmRzLmxlbmd0aDtfKyspe3ZhciB5PWQuYmFuZHNbX107Xz4wJiZkLmJhbmRzW18tMV0uY29ubmVjdCh5KSxkLmJhbmRzTWFwW3kuZnJlcXVlbmN5LnZhbHVlXT15fXJldHVybiBkfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuc2V0R2Fpbj1mdW5jdGlvbihlLHQpe2lmKHZvaWQgMD09PXQmJih0PTApLCF0aGlzLmJhbmRzTWFwW2VdKXRocm93XCJObyBiYW5kIGZvdW5kIGZvciBmcmVxdWVuY3kgXCIrZTtsLnNldFBhcmFtVmFsdWUodGhpcy5iYW5kc01hcFtlXS5nYWluLHQpfSxuLnByb3RvdHlwZS5nZXRHYWluPWZ1bmN0aW9uKGUpe2lmKCF0aGlzLmJhbmRzTWFwW2VdKXRocm93XCJObyBiYW5kIGZvdW5kIGZvciBmcmVxdWVuY3kgXCIrZTtyZXR1cm4gdGhpcy5iYW5kc01hcFtlXS5nYWluLnZhbHVlfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMzJcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYzMil9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMzIsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjY0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GNjQpfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjY0LGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYxMjVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYxMjUpfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjEyNSxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMjUwXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMjUwKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYyNTAsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjUwMFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjUwMCl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GNTAwLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYxa1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjFLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYxSyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMmtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYySyl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMkssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjRrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GNEspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjRLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY4a1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjhLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY4SyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMTZrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMTZLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYxNkssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLmJhbmRzLmZvckVhY2goZnVuY3Rpb24oZSl7bC5zZXRQYXJhbVZhbHVlKGUuZ2FpbiwwKX0pfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5iYW5kcy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UuZGlzY29ubmVjdCgpfSksdGhpcy5iYW5kcz1udWxsLHRoaXMuYmFuZHNNYXA9bnVsbH0sbi5GMzI9MzIsbi5GNjQ9NjQsbi5GMTI1PTEyNSxuLkYyNTA9MjUwLG4uRjUwMD01MDAsbi5GMUs9MWUzLG4uRjJLPTJlMyxuLkY0Sz00ZTMsbi5GOEs9OGUzLG4uRjE2Sz0xNmUzLG59KGMpLGg9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2b2lkIDA9PT10JiYodD0wKTt2YXIgbj10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKG49ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBvPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlV2F2ZVNoYXBlcigpO3JldHVybiBuPWUuY2FsbCh0aGlzLG8pfHx0aGlzLG4uX2Rpc3RvcnRpb249byxuLmFtb3VudD10LG59cmV0dXJuIHQobixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJhbW91bnRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Ftb3VudH0sc2V0OmZ1bmN0aW9uKGUpe2UqPTFlMyx0aGlzLl9hbW91bnQ9ZTtmb3IodmFyIHQsbj1uZXcgRmxvYXQzMkFycmF5KDQ0MTAwKSxvPU1hdGguUEkvMTgwLGk9MDtpPDQ0MTAwOysraSl0PTIqaS80NDEwMC0xLG5baV09KDMrZSkqdCoyMCpvLyhNYXRoLlBJK2UqTWF0aC5hYnModCkpO3RoaXMuX2Rpc3RvcnRpb24uY3VydmU9bix0aGlzLl9kaXN0b3J0aW9uLm92ZXJzYW1wbGU9XCI0eFwifSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9kaXN0b3J0aW9uPW51bGwsZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpfSxufShjKSxkPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dm9pZCAwPT09dCYmKHQ9MCk7dmFyIG49dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChuPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgbyxpLHIscz1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0O3JldHVybiBzLmNyZWF0ZVN0ZXJlb1Bhbm5lcj9yPW89cy5jcmVhdGVTdGVyZW9QYW5uZXIoKTooKGk9cy5jcmVhdGVQYW5uZXIoKSkucGFubmluZ01vZGVsPVwiZXF1YWxwb3dlclwiLHI9aSksbj1lLmNhbGwodGhpcyxyKXx8dGhpcyxuLl9zdGVyZW89byxuLl9wYW5uZXI9aSxuLnBhbj10LG59cmV0dXJuIHQobixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYW5cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bhbn0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3Bhbj1lLHRoaXMuX3N0ZXJlbz9sLnNldFBhcmFtVmFsdWUodGhpcy5fc3RlcmVvLnBhbixlKTp0aGlzLl9wYW5uZXIuc2V0UG9zaXRpb24oZSwwLDEtTWF0aC5hYnMoZSkpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyksdGhpcy5fc3RlcmVvPW51bGwsdGhpcy5fcGFubmVyPW51bGx9LG59KGMpLGY9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG4sbyl7dm9pZCAwPT09dCYmKHQ9Myksdm9pZCAwPT09biYmKG49Miksdm9pZCAwPT09byYmKG89ITEpO3ZhciBpPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQoaT1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIHI9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVDb252b2x2ZXIoKTtyZXR1cm4gaT1lLmNhbGwodGhpcyxyKXx8dGhpcyxpLl9jb252b2x2ZXI9cixpLl9zZWNvbmRzPWkuX2NsYW1wKHQsMSw1MCksaS5fZGVjYXk9aS5fY2xhbXAobiwwLDEwMCksaS5fcmV2ZXJzZT1vLGkuX3JlYnVpbGQoKSxpfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuX2NsYW1wPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gTWF0aC5taW4obixNYXRoLm1heCh0LGUpKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic2Vjb25kc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Vjb25kc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NlY29uZHM9dGhpcy5fY2xhbXAoZSwxLDUwKSx0aGlzLl9yZWJ1aWxkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZGVjYXlcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2RlY2F5fSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fZGVjYXk9dGhpcy5fY2xhbXAoZSwwLDEwMCksdGhpcy5fcmVidWlsZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInJldmVyc2VcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JldmVyc2V9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9yZXZlcnNlPWUsdGhpcy5fcmVidWlsZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLl9yZWJ1aWxkPWZ1bmN0aW9uKCl7Zm9yKHZhciBlLHQ9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dCxuPXQuc2FtcGxlUmF0ZSxvPW4qdGhpcy5fc2Vjb25kcyxpPXQuY3JlYXRlQnVmZmVyKDIsbyxuKSxyPWkuZ2V0Q2hhbm5lbERhdGEoMCkscz1pLmdldENoYW5uZWxEYXRhKDEpLHU9MDt1PG87dSsrKWU9dGhpcy5fcmV2ZXJzZT9vLXU6dSxyW3VdPSgyKk1hdGgucmFuZG9tKCktMSkqTWF0aC5wb3coMS1lL28sdGhpcy5fZGVjYXkpLHNbdV09KDIqTWF0aC5yYW5kb20oKS0xKSpNYXRoLnBvdygxLWUvbyx0aGlzLl9kZWNheSk7dGhpcy5fY29udm9sdmVyLmJ1ZmZlcj1pfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fY29udm9sdmVyPW51bGwsZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpfSxufShjKSxfPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt2YXIgdD10aGlzO1MuaW5zdGFuY2UudXNlTGVnYWN5JiYodD1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIG49Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dCxvPW4uY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKCksaT1uLmNyZWF0ZUNoYW5uZWxNZXJnZXIoKTtyZXR1cm4gaS5jb25uZWN0KG8pLHQ9ZS5jYWxsKHRoaXMsaSxvKXx8dGhpcyx0Ll9tZXJnZXI9aSx0fXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX21lcmdlci5kaXNjb25uZWN0KCksdGhpcy5fbWVyZ2VyPW51bGwsZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpfSxufShjKSx5PWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXtpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChlLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIHQ9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dCxuPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCksbz10LmNyZWF0ZUJpcXVhZEZpbHRlcigpLGk9dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxyPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7cmV0dXJuIG4udHlwZT1cImxvd3Bhc3NcIixsLnNldFBhcmFtVmFsdWUobi5mcmVxdWVuY3ksMmUzKSxvLnR5cGU9XCJsb3dwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKG8uZnJlcXVlbmN5LDJlMyksaS50eXBlPVwiaGlnaHBhc3NcIixsLnNldFBhcmFtVmFsdWUoaS5mcmVxdWVuY3ksNTAwKSxyLnR5cGU9XCJoaWdocGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShyLmZyZXF1ZW5jeSw1MDApLG4uY29ubmVjdChvKSxvLmNvbm5lY3QoaSksaS5jb25uZWN0KHIpLGUuY2FsbCh0aGlzLG4scil8fHRoaXN9cmV0dXJuIHQobixlKSxufShjKSxtPU9iamVjdC5mcmVlemUoe0ZpbHRlcjpjLEVxdWFsaXplckZpbHRlcjpwLERpc3RvcnRpb25GaWx0ZXI6aCxTdGVyZW9GaWx0ZXI6ZCxSZXZlcmJGaWx0ZXI6ZixNb25vRmlsdGVyOl8sVGVsZXBob25lRmlsdGVyOnl9KSxiPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt2YXIgdD1lLmNhbGwodGhpcyl8fHRoaXM7cmV0dXJuIHQuc3BlZWQ9MSx0LnZvbHVtZT0xLHQubXV0ZWQ9ITEsdC5wYXVzZWQ9ITEsdH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJyZWZyZXNoXCIpfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwicmVmcmVzaFBhdXNlZFwiKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGZpbHRlcnNcIiksbnVsbH0sc2V0OmZ1bmN0aW9uKGUpe2NvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBmaWx0ZXJzXCIpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGF1ZGlvQ29udGV4dFwiKSxudWxsfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnRvZ2dsZU11dGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tdXRlZD0hdGhpcy5tdXRlZCx0aGlzLnJlZnJlc2goKSx0aGlzLm11dGVkfSxuLnByb3RvdHlwZS50b2dnbGVQYXVzZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdXNlZD0hdGhpcy5wYXVzZWQsdGhpcy5yZWZyZXNoUGF1c2VkKCksdGhpcy5wYXVzZWR9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpfSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlciksZz1PYmplY3QuZnJlZXplKHtIVE1MQXVkaW9NZWRpYTpzLEhUTUxBdWRpb0luc3RhbmNlOnIsSFRNTEF1ZGlvQ29udGV4dDpifSksdj0wLFA9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2YXIgbj1lLmNhbGwodGhpcyl8fHRoaXM7cmV0dXJuIG4uaWQ9disrLG4uX21lZGlhPW51bGwsbi5fcGF1c2VkPSExLG4uX211dGVkPSExLG4uX2VsYXBzZWQ9MCxuLl91cGRhdGVMaXN0ZW5lcj1uLl91cGRhdGUuYmluZChuKSxuLmluaXQodCksbn1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJih0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJzdG9wXCIpKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic3BlZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc3BlZWQ9ZSx0aGlzLnJlZnJlc2goKSx0aGlzLl91cGRhdGUoITApfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInZvbHVtZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fdm9sdW1lPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibXV0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX211dGVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbXV0ZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJsb29wXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9sb29wfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbG9vcD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50O3RoaXMuX3NvdXJjZS5sb29wPXRoaXMuX2xvb3B8fHQubG9vcDt2YXIgbj1lLnZvbHVtZSooZS5tdXRlZD8wOjEpLG89dC52b2x1bWUqKHQubXV0ZWQ/MDoxKSxpPXRoaXMuX3ZvbHVtZSoodGhpcy5fbXV0ZWQ/MDoxKTtsLnNldFBhcmFtVmFsdWUodGhpcy5fZ2Fpbi5nYWluLGkqbypuKSxsLnNldFBhcmFtVmFsdWUodGhpcy5fc291cmNlLnBsYXliYWNrUmF0ZSx0aGlzLl9zcGVlZCp0LnNwZWVkKmUuc3BlZWQpfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudCxuPXRoaXMuX3BhdXNlZHx8dC5wYXVzZWR8fGUucGF1c2VkO24hPT10aGlzLl9wYXVzZWRSZWFsJiYodGhpcy5fcGF1c2VkUmVhbD1uLG4/KHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInBhdXNlZFwiKSk6KHRoaXMuZW1pdChcInJlc3VtZWRcIiksdGhpcy5wbGF5KHtzdGFydDp0aGlzLl9lbGFwc2VkJXRoaXMuX2R1cmF0aW9uLGVuZDp0aGlzLl9lbmQsc3BlZWQ6dGhpcy5fc3BlZWQsbG9vcDp0aGlzLl9sb29wLHZvbHVtZTp0aGlzLl92b2x1bWV9KSksdGhpcy5lbWl0KFwicGF1c2VcIixuKSl9LG4ucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5zdGFydCxuPWUuZW5kLG89ZS5zcGVlZCxpPWUubG9vcCxyPWUudm9sdW1lLHM9ZS5tdXRlZDtuJiZjb25zb2xlLmFzc2VydChuPnQsXCJFbmQgdGltZSBpcyBiZWZvcmUgc3RhcnQgdGltZVwiKSx0aGlzLl9wYXVzZWQ9ITE7dmFyIHU9dGhpcy5fbWVkaWEubm9kZXMuY2xvbmVCdWZmZXJTb3VyY2UoKSxhPXUuc291cmNlLGM9dS5nYWluO3RoaXMuX3NvdXJjZT1hLHRoaXMuX2dhaW49Yyx0aGlzLl9zcGVlZD1vLHRoaXMuX3ZvbHVtZT1yLHRoaXMuX2xvb3A9ISFpLHRoaXMuX211dGVkPXMsdGhpcy5yZWZyZXNoKCksdGhpcy5sb29wJiZudWxsIT09biYmKGNvbnNvbGUud2FybignTG9vcGluZyBub3Qgc3VwcG9ydCB3aGVuIHNwZWNpZnlpbmcgYW4gXCJlbmRcIiB0aW1lJyksdGhpcy5sb29wPSExKSx0aGlzLl9lbmQ9bjt2YXIgbD10aGlzLl9zb3VyY2UuYnVmZmVyLmR1cmF0aW9uO3RoaXMuX2R1cmF0aW9uPWwsdGhpcy5fbGFzdFVwZGF0ZT10aGlzLl9ub3coKSx0aGlzLl9lbGFwc2VkPXQsdGhpcy5fc291cmNlLm9uZW5kZWQ9dGhpcy5fb25Db21wbGV0ZS5iaW5kKHRoaXMpLG4/dGhpcy5fc291cmNlLnN0YXJ0KDAsdCxuLXQpOnRoaXMuX3NvdXJjZS5zdGFydCgwLHQpLHRoaXMuZW1pdChcInN0YXJ0XCIpLHRoaXMuX3VwZGF0ZSghMCksdGhpcy5fZW5hYmxlZD0hMH0sbi5wcm90b3R5cGUuX3RvU2VjPWZ1bmN0aW9uKGUpe3JldHVybiBlPjEwJiYoZS89MWUzKSxlfHwwfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJfZW5hYmxlZFwiLHtzZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5fbWVkaWEubm9kZXMuc2NyaXB0O3QucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImF1ZGlvcHJvY2Vzc1wiLHRoaXMuX3VwZGF0ZUxpc3RlbmVyKSxlJiZ0LmFkZEV2ZW50TGlzdGVuZXIoXCJhdWRpb3Byb2Nlc3NcIix0aGlzLl91cGRhdGVMaXN0ZW5lcil9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicHJvZ3Jlc3NcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Byb2dyZXNzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGF1c2VkPWUsdGhpcy5yZWZyZXNoUGF1c2VkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCksdGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5fc291cmNlJiYodGhpcy5fc291cmNlLmRpc2Nvbm5lY3QoKSx0aGlzLl9zb3VyY2U9bnVsbCksdGhpcy5fZ2FpbiYmKHRoaXMuX2dhaW4uZGlzY29ubmVjdCgpLHRoaXMuX2dhaW49bnVsbCksdGhpcy5fbWVkaWEmJih0aGlzLl9tZWRpYS5jb250ZXh0LmV2ZW50cy5vZmYoXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLHRoaXMuX21lZGlhLmNvbnRleHQuZXZlbnRzLm9mZihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyksdGhpcy5fbWVkaWE9bnVsbCksdGhpcy5fZW5kPW51bGwsdGhpcy5fc3BlZWQ9MSx0aGlzLl92b2x1bWU9MSx0aGlzLl9sb29wPSExLHRoaXMuX2VsYXBzZWQ9MCx0aGlzLl9kdXJhdGlvbj0wLHRoaXMuX3BhdXNlZD0hMSx0aGlzLl9tdXRlZD0hMSx0aGlzLl9wYXVzZWRSZWFsPSExfSxuLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiW1dlYkF1ZGlvSW5zdGFuY2UgaWQ9XCIrdGhpcy5pZCtcIl1cIn0sbi5wcm90b3R5cGUuX25vdz1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9tZWRpYS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZX0sbi5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbihlKXtpZih2b2lkIDA9PT1lJiYoZT0hMSksdGhpcy5fc291cmNlKXt2YXIgdD10aGlzLl9ub3coKSxuPXQtdGhpcy5fbGFzdFVwZGF0ZTtpZihuPjB8fGUpe3ZhciBvPXRoaXMuX3NvdXJjZS5wbGF5YmFja1JhdGUudmFsdWU7dGhpcy5fZWxhcHNlZCs9bipvLHRoaXMuX2xhc3RVcGRhdGU9dDt2YXIgaT10aGlzLl9kdXJhdGlvbixyPXRoaXMuX2VsYXBzZWQlaS9pO3RoaXMuX3Byb2dyZXNzPXIsdGhpcy5lbWl0KFwicHJvZ3Jlc3NcIix0aGlzLl9wcm9ncmVzcyxpKX19fSxuLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMuX21lZGlhPWUsZS5jb250ZXh0LmV2ZW50cy5vbihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksZS5jb250ZXh0LmV2ZW50cy5vbihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyl9LG4ucHJvdG90eXBlLl9pbnRlcm5hbFN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJih0aGlzLl9lbmFibGVkPSExLHRoaXMuX3NvdXJjZS5vbmVuZGVkPW51bGwsdGhpcy5fc291cmNlLnN0b3AoKSx0aGlzLl9zb3VyY2U9bnVsbCl9LG4ucHJvdG90eXBlLl9vbkNvbXBsZXRlPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiYodGhpcy5fZW5hYmxlZD0hMSx0aGlzLl9zb3VyY2Uub25lbmRlZD1udWxsKSx0aGlzLl9zb3VyY2U9bnVsbCx0aGlzLl9wcm9ncmVzcz0xLHRoaXMuZW1pdChcInByb2dyZXNzXCIsMSx0aGlzLl9kdXJhdGlvbiksdGhpcy5lbWl0KFwiZW5kXCIsdGhpcyl9LG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSx4PWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dmFyIG89dGhpcyxpPXQuYXVkaW9Db250ZXh0LHI9aS5jcmVhdGVCdWZmZXJTb3VyY2UoKSxzPWkuY3JlYXRlU2NyaXB0UHJvY2Vzc29yKG4uQlVGRkVSX1NJWkUpLHU9aS5jcmVhdGVHYWluKCksYT1pLmNyZWF0ZUFuYWx5c2VyKCk7cmV0dXJuIHIuY29ubmVjdChhKSxhLmNvbm5lY3QodSksdS5jb25uZWN0KHQuZGVzdGluYXRpb24pLHMuY29ubmVjdCh0LmRlc3RpbmF0aW9uKSxvPWUuY2FsbCh0aGlzLGEsdSl8fHRoaXMsby5jb250ZXh0PXQsby5idWZmZXJTb3VyY2U9cixvLnNjcmlwdD1zLG8uZ2Fpbj11LG8uYW5hbHlzZXI9YSxvfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2UucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKSx0aGlzLmJ1ZmZlclNvdXJjZS5kaXNjb25uZWN0KCksdGhpcy5zY3JpcHQuZGlzY29ubmVjdCgpLHRoaXMuZ2Fpbi5kaXNjb25uZWN0KCksdGhpcy5hbmFseXNlci5kaXNjb25uZWN0KCksdGhpcy5idWZmZXJTb3VyY2U9bnVsbCx0aGlzLnNjcmlwdD1udWxsLHRoaXMuZ2Fpbj1udWxsLHRoaXMuYW5hbHlzZXI9bnVsbCx0aGlzLmNvbnRleHQ9bnVsbH0sbi5wcm90b3R5cGUuY2xvbmVCdWZmZXJTb3VyY2U9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmJ1ZmZlclNvdXJjZSx0PXRoaXMuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7dC5idWZmZXI9ZS5idWZmZXIsbC5zZXRQYXJhbVZhbHVlKHQucGxheWJhY2tSYXRlLGUucGxheWJhY2tSYXRlLnZhbHVlKSx0Lmxvb3A9ZS5sb29wO3ZhciBuPXRoaXMuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO3JldHVybiB0LmNvbm5lY3Qobiksbi5jb25uZWN0KHRoaXMuZGVzdGluYXRpb24pLHtzb3VyY2U6dCxnYWluOm59fSxuLkJVRkZFUl9TSVpFPTI1NixufShuKSxPPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLnBhcmVudD1lLHRoaXMuX25vZGVzPW5ldyB4KHRoaXMuY29udGV4dCksdGhpcy5fc291cmNlPXRoaXMuX25vZGVzLmJ1ZmZlclNvdXJjZSx0aGlzLnNvdXJjZT1lLm9wdGlvbnMuc291cmNlfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5wYXJlbnQ9bnVsbCx0aGlzLl9ub2Rlcy5kZXN0cm95KCksdGhpcy5fbm9kZXM9bnVsbCx0aGlzLl9zb3VyY2U9bnVsbCx0aGlzLnNvdXJjZT1udWxsfSxlLnByb3RvdHlwZS5jcmVhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IFAodGhpcyl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGFyZW50LmNvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiaXNQbGF5YWJsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4hIXRoaXMuX3NvdXJjZSYmISF0aGlzLl9zb3VyY2UuYnVmZmVyfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX25vZGVzLmZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9ub2Rlcy5maWx0ZXJzPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZHVyYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNvbnNvbGUuYXNzZXJ0KHRoaXMuaXNQbGF5YWJsZSxcIlNvdW5kIG5vdCB5ZXQgcGxheWFibGUsIG5vIGR1cmF0aW9uXCIpLHRoaXMuX3NvdXJjZS5idWZmZXIuZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiYnVmZmVyXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2UuYnVmZmVyfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc291cmNlLmJ1ZmZlcj1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcIm5vZGVzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9ub2Rlc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGUpe3RoaXMuc291cmNlP3RoaXMuX2RlY29kZSh0aGlzLnNvdXJjZSxlKTp0aGlzLnBhcmVudC51cmw/dGhpcy5fbG9hZFVybChlKTplP2UobmV3IEVycm9yKFwic291bmQudXJsIG9yIHNvdW5kLnNvdXJjZSBtdXN0IGJlIHNldFwiKSk6Y29uc29sZS5lcnJvcihcInNvdW5kLnVybCBvciBzb3VuZC5zb3VyY2UgbXVzdCBiZSBzZXRcIil9LGUucHJvdG90eXBlLl9sb2FkVXJsPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMsbj1uZXcgWE1MSHR0cFJlcXVlc3Qsbz10aGlzLnBhcmVudC51cmw7bi5vcGVuKFwiR0VUXCIsbywhMCksbi5yZXNwb25zZVR5cGU9XCJhcnJheWJ1ZmZlclwiLG4ub25sb2FkPWZ1bmN0aW9uKCl7dC5zb3VyY2U9bi5yZXNwb25zZSx0Ll9kZWNvZGUobi5yZXNwb25zZSxlKX0sbi5zZW5kKCl9LGUucHJvdG90eXBlLl9kZWNvZGU9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzO3RoaXMucGFyZW50LmNvbnRleHQuZGVjb2RlKGUsZnVuY3Rpb24oZSxvKXtpZihlKXQmJnQoZSk7ZWxzZXtuLnBhcmVudC5pc0xvYWRlZD0hMCxuLmJ1ZmZlcj1vO3ZhciBpPW4ucGFyZW50LmF1dG9QbGF5U3RhcnQoKTt0JiZ0KG51bGwsbi5wYXJlbnQsaSl9fSl9LGV9KCksdz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUucmVzb2x2ZVVybD1mdW5jdGlvbih0KXt2YXIgbj1lLkZPUk1BVF9QQVRURVJOLG89XCJzdHJpbmdcIj09dHlwZW9mIHQ/dDp0LnVybDtpZihuLnRlc3Qobykpe2Zvcih2YXIgaT1uLmV4ZWMobykscj1pWzJdLnNwbGl0KFwiLFwiKSxzPXJbci5sZW5ndGgtMV0sdT0wLGE9ci5sZW5ndGg7dTxhO3UrKyl7dmFyIGM9clt1XTtpZihlLnN1cHBvcnRlZFtjXSl7cz1jO2JyZWFrfX12YXIgbD1vLnJlcGxhY2UoaVsxXSxzKTtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2YgdCYmKHQuZXh0ZW5zaW9uPXMsdC51cmw9bCksbH1yZXR1cm4gb30sZS5zaW5lVG9uZT1mdW5jdGlvbihlLHQpe3ZvaWQgMD09PWUmJihlPTIwMCksdm9pZCAwPT09dCYmKHQ9MSk7dmFyIG49SS5mcm9tKHtzaW5nbGVJbnN0YW5jZTohMH0pO2lmKCEobi5tZWRpYSBpbnN0YW5jZW9mIE8pKXJldHVybiBuO2Zvcih2YXIgbz1uLm1lZGlhLGk9bi5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSw0OGUzKnQsNDhlMykscj1pLmdldENoYW5uZWxEYXRhKDApLHM9MDtzPHIubGVuZ3RoO3MrKyl7dmFyIHU9ZSoocy9pLnNhbXBsZVJhdGUpKk1hdGguUEk7cltzXT0yKk1hdGguc2luKHUpfXJldHVybiBvLmJ1ZmZlcj1pLG4uaXNMb2FkZWQ9ITAsbn0sZS5yZW5kZXI9ZnVuY3Rpb24oZSx0KXt2YXIgbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3Q9T2JqZWN0LmFzc2lnbih7d2lkdGg6NTEyLGhlaWdodDoxMjgsZmlsbDpcImJsYWNrXCJ9LHR8fHt9KSxuLndpZHRoPXQud2lkdGgsbi5oZWlnaHQ9dC5oZWlnaHQ7dmFyIG89UElYSS5CYXNlVGV4dHVyZS5mcm9tQ2FudmFzKG4pO2lmKCEoZS5tZWRpYSBpbnN0YW5jZW9mIE8pKXJldHVybiBvO3ZhciBpPWUubWVkaWE7Y29uc29sZS5hc3NlcnQoISFpLmJ1ZmZlcixcIk5vIGJ1ZmZlciBmb3VuZCwgbG9hZCBmaXJzdFwiKTt2YXIgcj1uLmdldENvbnRleHQoXCIyZFwiKTtyLmZpbGxTdHlsZT10LmZpbGw7Zm9yKHZhciBzPWkuYnVmZmVyLmdldENoYW5uZWxEYXRhKDApLHU9TWF0aC5jZWlsKHMubGVuZ3RoL3Qud2lkdGgpLGE9dC5oZWlnaHQvMixjPTA7Yzx0LndpZHRoO2MrKyl7Zm9yKHZhciBsPTEscD0tMSxoPTA7aDx1O2grKyl7dmFyIGQ9c1tjKnUraF07ZDxsJiYobD1kKSxkPnAmJihwPWQpfXIuZmlsbFJlY3QoYywoMStsKSphLDEsTWF0aC5tYXgoMSwocC1sKSphKSl9cmV0dXJuIG99LGUucGxheU9uY2U9ZnVuY3Rpb24odCxuKXt2YXIgbz1cImFsaWFzXCIrZS5QTEFZX0lEKys7cmV0dXJuIFMuaW5zdGFuY2UuYWRkKG8se3VybDp0LHByZWxvYWQ6ITAsYXV0b1BsYXk6ITAsbG9hZGVkOmZ1bmN0aW9uKGUpe2UmJihjb25zb2xlLmVycm9yKGUpLFMuaW5zdGFuY2UucmVtb3ZlKG8pLG4mJm4oZSkpfSxjb21wbGV0ZTpmdW5jdGlvbigpe1MuaW5zdGFuY2UucmVtb3ZlKG8pLG4mJm4obnVsbCl9fSksb30sZS5QTEFZX0lEPTAsZS5GT1JNQVRfUEFUVEVSTj0vXFwuKFxceyhbXlxcfV0rKVxcfSkoXFw/LiopPyQvLGUuZXh0ZW5zaW9ucz1bXCJtcDNcIixcIm9nZ1wiLFwib2dhXCIsXCJvcHVzXCIsXCJtcGVnXCIsXCJ3YXZcIixcIm00YVwiLFwibXA0XCIsXCJhaWZmXCIsXCJ3bWFcIixcIm1pZFwiXSxlLnN1cHBvcnRlZD1mdW5jdGlvbigpe3ZhciB0PXttNGE6XCJtcDRcIixvZ2E6XCJvZ2dcIn0sbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIiksbz17fTtyZXR1cm4gZS5leHRlbnNpb25zLmZvckVhY2goZnVuY3Rpb24oZSl7dmFyIGk9dFtlXXx8ZSxyPW4uY2FuUGxheVR5cGUoXCJhdWRpby9cIitlKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxzPW4uY2FuUGxheVR5cGUoXCJhdWRpby9cIitpKS5yZXBsYWNlKC9ebm8kLyxcIlwiKTtvW2VdPSEhcnx8ISFzfSksT2JqZWN0LmZyZWV6ZShvKX0oKSxlfSgpLGo9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG4pe3ZhciBvPWUuY2FsbCh0aGlzLHQsbil8fHRoaXM7cmV0dXJuIG8udXNlKEEucGx1Z2luKSxvLnByZShBLnJlc29sdmUpLG99cmV0dXJuIHQobixlKSxuLmFkZFBpeGlNaWRkbGV3YXJlPWZ1bmN0aW9uKHQpe2UuYWRkUGl4aU1pZGRsZXdhcmUuY2FsbCh0aGlzLHQpfSxufShQSVhJLmxvYWRlcnMuTG9hZGVyKSxBPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5pbnN0YWxsPWZ1bmN0aW9uKHQpe2UuX3NvdW5kPXQsZS5sZWdhY3k9dC51c2VMZWdhY3ksUElYSS5sb2FkZXJzLkxvYWRlcj1qLFBJWEkubG9hZGVyLnVzZShlLnBsdWdpbiksUElYSS5sb2FkZXIucHJlKGUucmVzb2x2ZSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwibGVnYWN5XCIse3NldDpmdW5jdGlvbihlKXt2YXIgdD1QSVhJLmxvYWRlcnMuUmVzb3VyY2Usbj13LmV4dGVuc2lvbnM7ZT9uLmZvckVhY2goZnVuY3Rpb24oZSl7dC5zZXRFeHRlbnNpb25YaHJUeXBlKGUsdC5YSFJfUkVTUE9OU0VfVFlQRS5ERUZBVUxUKSx0LnNldEV4dGVuc2lvbkxvYWRUeXBlKGUsdC5MT0FEX1RZUEUuQVVESU8pfSk6bi5mb3JFYWNoKGZ1bmN0aW9uKGUpe3Quc2V0RXh0ZW5zaW9uWGhyVHlwZShlLHQuWEhSX1JFU1BPTlNFX1RZUEUuQlVGRkVSKSx0LnNldEV4dGVuc2lvbkxvYWRUeXBlKGUsdC5MT0FEX1RZUEUuWEhSKX0pfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucmVzb2x2ZT1mdW5jdGlvbihlLHQpe3cucmVzb2x2ZVVybChlKSx0KCl9LGUucGx1Z2luPWZ1bmN0aW9uKHQsbil7dC5kYXRhJiZ3LmV4dGVuc2lvbnMuaW5kZXhPZih0LmV4dGVuc2lvbik+LTE/dC5zb3VuZD1lLl9zb3VuZC5hZGQodC5uYW1lLHtsb2FkZWQ6bixwcmVsb2FkOiEwLHVybDp0LnVybCxzb3VyY2U6dC5kYXRhfSk6bigpfSxlfSgpLEY9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5wYXJlbnQ9ZSxPYmplY3QuYXNzaWduKHRoaXMsdCksdGhpcy5kdXJhdGlvbj10aGlzLmVuZC10aGlzLnN0YXJ0LGNvbnNvbGUuYXNzZXJ0KHRoaXMuZHVyYXRpb24+MCxcIkVuZCB0aW1lIG11c3QgYmUgYWZ0ZXIgc3RhcnQgdGltZVwiKX1yZXR1cm4gZS5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5wYXJlbnQucGxheShPYmplY3QuYXNzaWduKHtjb21wbGV0ZTplLHNwZWVkOnRoaXMuc3BlZWR8fHRoaXMucGFyZW50LnNwZWVkLGVuZDp0aGlzLmVuZCxzdGFydDp0aGlzLnN0YXJ0fSkpfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5wYXJlbnQ9bnVsbH0sZX0oKSxFPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt2YXIgdD10aGlzLG89bmV3IG4uQXVkaW9Db250ZXh0LGk9by5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKSxyPW8uY3JlYXRlQW5hbHlzZXIoKTtyZXR1cm4gci5jb25uZWN0KGkpLGkuY29ubmVjdChvLmRlc3RpbmF0aW9uKSx0PWUuY2FsbCh0aGlzLHIsaSl8fHRoaXMsdC5fY3R4PW8sdC5fb2ZmbGluZUN0eD1uZXcgbi5PZmZsaW5lQXVkaW9Db250ZXh0KDEsMixvLnNhbXBsZVJhdGUpLHQuX3VubG9ja2VkPSExLHQuY29tcHJlc3Nvcj1pLHQuYW5hbHlzZXI9cix0LmV2ZW50cz1uZXcgUElYSS51dGlscy5FdmVudEVtaXR0ZXIsdC52b2x1bWU9MSx0LnNwZWVkPTEsdC5tdXRlZD0hMSx0LnBhdXNlZD0hMSxcIm9udG91Y2hzdGFydFwiaW4gd2luZG93JiZcInJ1bm5pbmdcIiE9PW8uc3RhdGUmJih0Ll91bmxvY2soKSx0Ll91bmxvY2s9dC5fdW5sb2NrLmJpbmQodCksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHQuX3VubG9jaywhMCksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIix0Ll91bmxvY2ssITApLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLHQuX3VubG9jaywhMCkpLHR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5fdW5sb2NrPWZ1bmN0aW9uKCl7dGhpcy5fdW5sb2NrZWR8fCh0aGlzLnBsYXlFbXB0eVNvdW5kKCksXCJydW5uaW5nXCI9PT10aGlzLl9jdHguc3RhdGUmJihkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsdGhpcy5fdW5sb2NrLCEwKSxkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIix0aGlzLl91bmxvY2ssITApLGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsdGhpcy5fdW5sb2NrLCEwKSx0aGlzLl91bmxvY2tlZD0hMCkpfSxuLnByb3RvdHlwZS5wbGF5RW1wdHlTb3VuZD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX2N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtlLmJ1ZmZlcj10aGlzLl9jdHguY3JlYXRlQnVmZmVyKDEsMSwyMjA1MCksZS5jb25uZWN0KHRoaXMuX2N0eC5kZXN0aW5hdGlvbiksZS5zdGFydCgwLDAsMCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiQXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3ZhciBlPXdpbmRvdztyZXR1cm4gZS5BdWRpb0NvbnRleHR8fGUud2Via2l0QXVkaW9Db250ZXh0fHxudWxsfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiT2ZmbGluZUF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgZT13aW5kb3c7cmV0dXJuIGUuT2ZmbGluZUF1ZGlvQ29udGV4dHx8ZS53ZWJraXRPZmZsaW5lQXVkaW9Db250ZXh0fHxudWxsfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7dmFyIHQ9dGhpcy5fY3R4O3ZvaWQgMCE9PXQuY2xvc2UmJnQuY2xvc2UoKSx0aGlzLmV2ZW50cy5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLmFuYWx5c2VyLmRpc2Nvbm5lY3QoKSx0aGlzLmNvbXByZXNzb3IuZGlzY29ubmVjdCgpLHRoaXMuYW5hbHlzZXI9bnVsbCx0aGlzLmNvbXByZXNzb3I9bnVsbCx0aGlzLmV2ZW50cz1udWxsLHRoaXMuX29mZmxpbmVDdHg9bnVsbCx0aGlzLl9jdHg9bnVsbH0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiYXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jdHh9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwib2ZmbGluZUNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX29mZmxpbmVDdHh9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXtlJiZcInJ1bm5pbmdcIj09PXRoaXMuX2N0eC5zdGF0ZT90aGlzLl9jdHguc3VzcGVuZCgpOmV8fFwic3VzcGVuZGVkXCIhPT10aGlzLl9jdHguc3RhdGV8fHRoaXMuX2N0eC5yZXN1bWUoKSx0aGlzLl9wYXVzZWQ9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dGhpcy5ldmVudHMuZW1pdChcInJlZnJlc2hcIil9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt0aGlzLmV2ZW50cy5lbWl0KFwicmVmcmVzaFBhdXNlZFwiKX0sbi5wcm90b3R5cGUudG9nZ2xlTXV0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLm11dGVkPSF0aGlzLm11dGVkLHRoaXMucmVmcmVzaCgpLHRoaXMubXV0ZWR9LG4ucHJvdG90eXBlLnRvZ2dsZVBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF1c2VkPSF0aGlzLnBhdXNlZCx0aGlzLnJlZnJlc2hQYXVzZWQoKSx0aGlzLl9wYXVzZWR9LG4ucHJvdG90eXBlLmRlY29kZT1mdW5jdGlvbihlLHQpe3RoaXMuX29mZmxpbmVDdHguZGVjb2RlQXVkaW9EYXRhKGUsZnVuY3Rpb24oZSl7dChudWxsLGUpfSxmdW5jdGlvbigpe3QobmV3IEVycm9yKFwiVW5hYmxlIHRvIGRlY29kZSBmaWxlXCIpKX0pfSxufShuKSxMPU9iamVjdC5mcmVlemUoe1dlYkF1ZGlvTWVkaWE6TyxXZWJBdWRpb0luc3RhbmNlOlAsV2ViQXVkaW9Ob2Rlczp4LFdlYkF1ZGlvQ29udGV4dDpFLFdlYkF1ZGlvVXRpbHM6bH0pLFM9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7dGhpcy5pbml0KCl9cmV0dXJuIGUucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zdXBwb3J0ZWQmJih0aGlzLl93ZWJBdWRpb0NvbnRleHQ9bmV3IEUpLHRoaXMuX2h0bWxBdWRpb0NvbnRleHQ9bmV3IGIsdGhpcy5fc291bmRzPXt9LHRoaXMudXNlTGVnYWN5PSF0aGlzLnN1cHBvcnRlZCx0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUuaW5pdD1mdW5jdGlvbigpe2lmKGUuaW5zdGFuY2UpdGhyb3cgbmV3IEVycm9yKFwiU291bmRMaWJyYXJ5IGlzIGFscmVhZHkgY3JlYXRlZFwiKTt2YXIgdD1lLmluc3RhbmNlPW5ldyBlO1widW5kZWZpbmVkXCI9PXR5cGVvZiBQcm9taXNlJiYod2luZG93LlByb21pc2U9YSksdm9pZCAwIT09UElYSS5sb2FkZXJzJiZBLmluc3RhbGwodCksdm9pZCAwPT09d2luZG93Ll9fcGl4aVNvdW5kJiZkZWxldGUgd2luZG93Ll9fcGl4aVNvdW5kO3ZhciBvPVBJWEk7cmV0dXJuIG8uc291bmR8fChPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcInNvdW5kXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQse2ZpbHRlcnM6e2dldDpmdW5jdGlvbigpe3JldHVybiBtfX0saHRtbGF1ZGlvOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZ319LHdlYmF1ZGlvOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gTH19LHV0aWxzOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gd319LFNvdW5kOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gSX19LFNvdW5kU3ByaXRlOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gRn19LEZpbHRlcmFibGU6e2dldDpmdW5jdGlvbigpe3JldHVybiBufX0sU291bmRMaWJyYXJ5OntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZX19fSkpLHR9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNBbGxcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudXNlTGVnYWN5P1tdOnRoaXMuX2NvbnRleHQuZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMudXNlTGVnYWN5fHwodGhpcy5fY29udGV4dC5maWx0ZXJzPWUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInN1cHBvcnRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9PUUuQXVkaW9Db250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmFkZD1mdW5jdGlvbihlLHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXt2YXIgbj17fTtmb3IodmFyIG8gaW4gZSl7aT10aGlzLl9nZXRPcHRpb25zKGVbb10sdCk7bltvXT10aGlzLmFkZChvLGkpfXJldHVybiBufWlmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZihjb25zb2xlLmFzc2VydCghdGhpcy5fc291bmRzW2VdLFwiU291bmQgd2l0aCBhbGlhcyBcIitlK1wiIGFscmVhZHkgZXhpc3RzLlwiKSx0IGluc3RhbmNlb2YgSSlyZXR1cm4gdGhpcy5fc291bmRzW2VdPXQsdDt2YXIgaT10aGlzLl9nZXRPcHRpb25zKHQpLHI9SS5mcm9tKGkpO3JldHVybiB0aGlzLl9zb3VuZHNbZV09cixyfX0sZS5wcm90b3R5cGUuX2dldE9wdGlvbnM9ZnVuY3Rpb24oZSx0KXt2YXIgbjtyZXR1cm4gbj1cInN0cmluZ1wiPT10eXBlb2YgZT97dXJsOmV9OmUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcnx8ZSBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQ/e3NvdXJjZTplfTplLE9iamVjdC5hc3NpZ24obix0fHx7fSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInVzZUxlZ2FjeVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdXNlTGVnYWN5fSxzZXQ6ZnVuY3Rpb24oZSl7QS5sZWdhY3k9ZSx0aGlzLl91c2VMZWdhY3k9ZSwhZSYmdGhpcy5zdXBwb3J0ZWQ/dGhpcy5fY29udGV4dD10aGlzLl93ZWJBdWRpb0NvbnRleHQ6dGhpcy5fY29udGV4dD10aGlzLl9odG1sQXVkaW9Db250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5leGlzdHMoZSwhMCksdGhpcy5fc291bmRzW2VdLmRlc3Ryb3koKSxkZWxldGUgdGhpcy5fc291bmRzW2VdLHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInZvbHVtZUFsbFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC52b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9jb250ZXh0LnZvbHVtZT1lLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInNwZWVkQWxsXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnNwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fY29udGV4dC5zcGVlZD1lLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnRvZ2dsZVBhdXNlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQudG9nZ2xlUGF1c2UoKX0sZS5wcm90b3R5cGUucGF1c2VBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5wYXVzZWQ9ITAsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUucmVzdW1lQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQucGF1c2VkPSExLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnRvZ2dsZU11dGVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC50b2dnbGVNdXRlKCl9LGUucHJvdG90eXBlLm11dGVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5tdXRlZD0hMCx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS51bm11dGVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5tdXRlZD0hMSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS5yZW1vdmVBbGw9ZnVuY3Rpb24oKXtmb3IodmFyIGUgaW4gdGhpcy5fc291bmRzKXRoaXMuX3NvdW5kc1tlXS5kZXN0cm95KCksZGVsZXRlIHRoaXMuX3NvdW5kc1tlXTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUuc3RvcEFsbD1mdW5jdGlvbigpe2Zvcih2YXIgZSBpbiB0aGlzLl9zb3VuZHMpdGhpcy5fc291bmRzW2VdLnN0b3AoKTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUuZXhpc3RzPWZ1bmN0aW9uKGUsdCl7dm9pZCAwPT09dCYmKHQ9ITEpO3ZhciBuPSEhdGhpcy5fc291bmRzW2VdO3JldHVybiB0JiZjb25zb2xlLmFzc2VydChuLFwiTm8gc291bmQgbWF0Y2hpbmcgYWxpYXMgJ1wiK2UrXCInLlwiKSxufSxlLnByb3RvdHlwZS5maW5kPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmV4aXN0cyhlLCEwKSx0aGlzLl9zb3VuZHNbZV19LGUucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5maW5kKGUpLnBsYXkodCl9LGUucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5zdG9wKCl9LGUucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkucGF1c2UoKX0sZS5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkucmVzdW1lKCl9LGUucHJvdG90eXBlLnZvbHVtZT1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMuZmluZChlKTtyZXR1cm4gdm9pZCAwIT09dCYmKG4udm9sdW1lPXQpLG4udm9sdW1lfSxlLnByb3RvdHlwZS5zcGVlZD1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMuZmluZChlKTtyZXR1cm4gdm9pZCAwIT09dCYmKG4uc3BlZWQ9dCksbi5zcGVlZH0sZS5wcm90b3R5cGUuZHVyYXRpb249ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5kdXJhdGlvbn0sZS5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZW1vdmVBbGwoKSx0aGlzLl9zb3VuZHM9bnVsbCx0aGlzLl93ZWJBdWRpb0NvbnRleHQmJih0aGlzLl93ZWJBdWRpb0NvbnRleHQuZGVzdHJveSgpLHRoaXMuX3dlYkF1ZGlvQ29udGV4dD1udWxsKSx0aGlzLl9odG1sQXVkaW9Db250ZXh0JiYodGhpcy5faHRtbEF1ZGlvQ29udGV4dC5kZXN0cm95KCksdGhpcy5faHRtbEF1ZGlvQ29udGV4dD1udWxsKSx0aGlzLl9jb250ZXh0PW51bGwsdGhpc30sZX0oKSxJPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMubWVkaWE9ZSx0aGlzLm9wdGlvbnM9dCx0aGlzLl9pbnN0YW5jZXM9W10sdGhpcy5fc3ByaXRlcz17fSx0aGlzLm1lZGlhLmluaXQodGhpcyk7dmFyIG49dC5jb21wbGV0ZTt0aGlzLl9hdXRvUGxheU9wdGlvbnM9bj97Y29tcGxldGU6bn06bnVsbCx0aGlzLmlzTG9hZGVkPSExLHRoaXMuaXNQbGF5aW5nPSExLHRoaXMuYXV0b1BsYXk9dC5hdXRvUGxheSx0aGlzLnNpbmdsZUluc3RhbmNlPXQuc2luZ2xlSW5zdGFuY2UsdGhpcy5wcmVsb2FkPXQucHJlbG9hZHx8dGhpcy5hdXRvUGxheSx0aGlzLnVybD10LnVybCx0aGlzLnNwZWVkPXQuc3BlZWQsdGhpcy52b2x1bWU9dC52b2x1bWUsdGhpcy5sb29wPXQubG9vcCx0LnNwcml0ZXMmJnRoaXMuYWRkU3ByaXRlcyh0LnNwcml0ZXMpLHRoaXMucHJlbG9hZCYmdGhpcy5fcHJlbG9hZCh0LmxvYWRlZCl9cmV0dXJuIGUuZnJvbT1mdW5jdGlvbih0KXt2YXIgbj17fTtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdD9uLnVybD10OnQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcnx8dCBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQ/bi5zb3VyY2U9dDpuPXQsKG49T2JqZWN0LmFzc2lnbih7YXV0b1BsYXk6ITEsc2luZ2xlSW5zdGFuY2U6ITEsdXJsOm51bGwsc291cmNlOm51bGwscHJlbG9hZDohMSx2b2x1bWU6MSxzcGVlZDoxLGNvbXBsZXRlOm51bGwsbG9hZGVkOm51bGwsbG9vcDohMX0sbikpLnVybCYmKG4udXJsPXcucmVzb2x2ZVVybChuLnVybCkpLE9iamVjdC5mcmVlemUobiksbmV3IGUoUy5pbnN0YW5jZS51c2VMZWdhY3k/bmV3IHM6bmV3IE8sbil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIFMuaW5zdGFuY2UuY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmlzUGxheWluZz0hMSx0aGlzLnBhdXNlZD0hMCx0aGlzfSxlLnByb3RvdHlwZS5yZXN1bWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc1BsYXlpbmc9dGhpcy5faW5zdGFuY2VzLmxlbmd0aD4wLHRoaXMucGF1c2VkPSExLHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGF1c2VkPWUsdGhpcy5yZWZyZXNoUGF1c2VkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3BlZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc3BlZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1lZGlhLmZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt0aGlzLm1lZGlhLmZpbHRlcnM9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5hZGRTcHJpdGVzPWZ1bmN0aW9uKGUsdCl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGUpe3ZhciBuPXt9O2Zvcih2YXIgbyBpbiBlKW5bb109dGhpcy5hZGRTcHJpdGVzKG8sZVtvXSk7cmV0dXJuIG59aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUpe2NvbnNvbGUuYXNzZXJ0KCF0aGlzLl9zcHJpdGVzW2VdLFwiQWxpYXMgXCIrZStcIiBpcyBhbHJlYWR5IHRha2VuXCIpO3ZhciBpPW5ldyBGKHRoaXMsdCk7cmV0dXJuIHRoaXMuX3Nwcml0ZXNbZV09aSxpfX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX3JlbW92ZUluc3RhbmNlcygpLHRoaXMucmVtb3ZlU3ByaXRlcygpLHRoaXMubWVkaWEuZGVzdHJveSgpLHRoaXMubWVkaWE9bnVsbCx0aGlzLl9zcHJpdGVzPW51bGwsdGhpcy5faW5zdGFuY2VzPW51bGx9LGUucHJvdG90eXBlLnJlbW92ZVNwcml0ZXM9ZnVuY3Rpb24oZSl7aWYoZSl7dmFyIHQ9dGhpcy5fc3ByaXRlc1tlXTt2b2lkIDAhPT10JiYodC5kZXN0cm95KCksZGVsZXRlIHRoaXMuX3Nwcml0ZXNbZV0pfWVsc2UgZm9yKHZhciBuIGluIHRoaXMuX3Nwcml0ZXMpdGhpcy5yZW1vdmVTcHJpdGVzKG4pO3JldHVybiB0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJpc1BsYXlhYmxlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmlzTG9hZGVkJiZ0aGlzLm1lZGlhJiZ0aGlzLm1lZGlhLmlzUGxheWFibGV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe2lmKCF0aGlzLmlzUGxheWFibGUpcmV0dXJuIHRoaXMuYXV0b1BsYXk9ITEsdGhpcy5fYXV0b1BsYXlPcHRpb25zPW51bGwsdGhpczt0aGlzLmlzUGxheWluZz0hMTtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aC0xO2U+PTA7ZS0tKXRoaXMuX2luc3RhbmNlc1tlXS5zdG9wKCk7cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSx0KXt2YXIgbixvPXRoaXM7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGU/bj17c3ByaXRlOnI9ZSxjb21wbGV0ZTp0fTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBlPyhuPXt9KS5jb21wbGV0ZT1lOm49ZSwobj1PYmplY3QuYXNzaWduKHtjb21wbGV0ZTpudWxsLGxvYWRlZDpudWxsLHNwcml0ZTpudWxsLGVuZDpudWxsLHN0YXJ0OjAsdm9sdW1lOjEsc3BlZWQ6MSxtdXRlZDohMSxsb29wOiExfSxufHx7fSkpLnNwcml0ZSl7dmFyIGk9bi5zcHJpdGU7Y29uc29sZS5hc3NlcnQoISF0aGlzLl9zcHJpdGVzW2ldLFwiQWxpYXMgXCIraStcIiBpcyBub3QgYXZhaWxhYmxlXCIpO3ZhciByPXRoaXMuX3Nwcml0ZXNbaV07bi5zdGFydD1yLnN0YXJ0LG4uZW5kPXIuZW5kLG4uc3BlZWQ9ci5zcGVlZHx8MSxkZWxldGUgbi5zcHJpdGV9aWYobi5vZmZzZXQmJihuLnN0YXJ0PW4ub2Zmc2V0KSwhdGhpcy5pc0xvYWRlZClyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oZSx0KXtvLmF1dG9QbGF5PSEwLG8uX2F1dG9QbGF5T3B0aW9ucz1uLG8uX3ByZWxvYWQoZnVuY3Rpb24obyxpLHIpe28/dChvKToobi5sb2FkZWQmJm4ubG9hZGVkKG8saSxyKSxlKHIpKX0pfSk7dGhpcy5zaW5nbGVJbnN0YW5jZSYmdGhpcy5fcmVtb3ZlSW5zdGFuY2VzKCk7dmFyIHM9dGhpcy5fY3JlYXRlSW5zdGFuY2UoKTtyZXR1cm4gdGhpcy5faW5zdGFuY2VzLnB1c2gocyksdGhpcy5pc1BsYXlpbmc9ITAscy5vbmNlKFwiZW5kXCIsZnVuY3Rpb24oKXtuLmNvbXBsZXRlJiZuLmNvbXBsZXRlKG8pLG8uX29uQ29tcGxldGUocyl9KSxzLm9uY2UoXCJzdG9wXCIsZnVuY3Rpb24oKXtvLl9vbkNvbXBsZXRlKHMpfSkscy5wbGF5KG4pLHN9LGUucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aCx0PTA7dDxlO3QrKyl0aGlzLl9pbnN0YW5jZXNbdF0ucmVmcmVzaCgpfSxlLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgsdD0wO3Q8ZTt0KyspdGhpcy5faW5zdGFuY2VzW3RdLnJlZnJlc2hQYXVzZWQoKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwidm9sdW1lXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl92b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl92b2x1bWU9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJtdXRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbXV0ZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9tdXRlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImxvb3BcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xvb3B9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9sb29wPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuX3ByZWxvYWQ9ZnVuY3Rpb24oZSl7dGhpcy5tZWRpYS5sb2FkKGUpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJpbnN0YW5jZXNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2luc3RhbmNlc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzcHJpdGVzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcHJpdGVzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImR1cmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1lZGlhLmR1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmF1dG9QbGF5U3RhcnQ9ZnVuY3Rpb24oKXt2YXIgZTtyZXR1cm4gdGhpcy5hdXRvUGxheSYmKGU9dGhpcy5wbGF5KHRoaXMuX2F1dG9QbGF5T3B0aW9ucykpLGV9LGUucHJvdG90eXBlLl9yZW1vdmVJbnN0YW5jZXM9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aC0xO2U+PTA7ZS0tKXRoaXMuX3Bvb2xJbnN0YW5jZSh0aGlzLl9pbnN0YW5jZXNbZV0pO3RoaXMuX2luc3RhbmNlcy5sZW5ndGg9MH0sZS5wcm90b3R5cGUuX29uQ29tcGxldGU9ZnVuY3Rpb24oZSl7aWYodGhpcy5faW5zdGFuY2VzKXt2YXIgdD10aGlzLl9pbnN0YW5jZXMuaW5kZXhPZihlKTt0Pi0xJiZ0aGlzLl9pbnN0YW5jZXMuc3BsaWNlKHQsMSksdGhpcy5pc1BsYXlpbmc9dGhpcy5faW5zdGFuY2VzLmxlbmd0aD4wfXRoaXMuX3Bvb2xJbnN0YW5jZShlKX0sZS5wcm90b3R5cGUuX2NyZWF0ZUluc3RhbmNlPWZ1bmN0aW9uKCl7aWYoZS5fcG9vbC5sZW5ndGg+MCl7dmFyIHQ9ZS5fcG9vbC5wb3AoKTtyZXR1cm4gdC5pbml0KHRoaXMubWVkaWEpLHR9cmV0dXJuIHRoaXMubWVkaWEuY3JlYXRlKCl9LGUucHJvdG90eXBlLl9wb29sSW5zdGFuY2U9ZnVuY3Rpb24odCl7dC5kZXN0cm95KCksZS5fcG9vbC5pbmRleE9mKHQpPDAmJmUuX3Bvb2wucHVzaCh0KX0sZS5fcG9vbD1bXSxlfSgpLEM9Uy5pbml0KCk7ZS5zb3VuZD1DLGUuZmlsdGVycz1tLGUuaHRtbGF1ZGlvPWcsZS53ZWJhdWRpbz1MLGUuRmlsdGVyYWJsZT1uLGUuU291bmQ9SSxlLlNvdW5kTGlicmFyeT1TLGUuU291bmRTcHJpdGU9RixlLnV0aWxzPXcsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktc291bmQuanMubWFwXG4iLCIhZnVuY3Rpb24odCl7ZnVuY3Rpb24gZShpKXtpZihuW2ldKXJldHVybiBuW2ldLmV4cG9ydHM7dmFyIHI9bltpXT17ZXhwb3J0czp7fSxpZDppLGxvYWRlZDohMX07cmV0dXJuIHRbaV0uY2FsbChyLmV4cG9ydHMscixyLmV4cG9ydHMsZSksci5sb2FkZWQ9ITAsci5leHBvcnRzfXZhciBuPXt9O3JldHVybiBlLm09dCxlLmM9bixlLnA9XCJcIixlKDApfShbZnVuY3Rpb24odCxlLG4pe3QuZXhwb3J0cz1uKDYpfSxmdW5jdGlvbih0LGUpe3QuZXhwb3J0cz1QSVhJfSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBuPXtsaW5lYXI6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHR9fSxpblF1YWQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqdH19LG91dFF1YWQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqKDItdCl9fSxpbk91dFF1YWQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdDotLjUqKC0tdCoodC0yKS0xKX19LGluQ3ViaWM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqdCp0fX0sb3V0Q3ViaWM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuLS10KnQqdCsxfX0saW5PdXRDdWJpYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LjUqdCp0KnQ6KHQtPTIsLjUqKHQqdCp0KzIpKX19LGluUXVhcnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqdCp0KnR9fSxvdXRRdWFydDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS0gLS10KnQqdCp0fX0saW5PdXRRdWFydDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LjUqdCp0KnQqdDoodC09MiwtLjUqKHQqdCp0KnQtMikpfX0saW5RdWludDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0KnQqdCp0fX0sb3V0UXVpbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuLS10KnQqdCp0KnQrMX19LGluT3V0UXVpbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdCp0KnQqdDoodC09MiwuNSoodCp0KnQqdCp0KzIpKX19LGluU2luZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS1NYXRoLmNvcyh0Kk1hdGguUEkvMil9fSxvdXRTaW5lOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNpbih0Kk1hdGguUEkvMil9fSxpbk91dFNpbmU6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuLjUqKDEtTWF0aC5jb3MoTWF0aC5QSSp0KSl9fSxpbkV4cG86ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDA9PT10PzA6TWF0aC5wb3coMTAyNCx0LTEpfX0sb3V0RXhwbzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMT09PXQ/MToxLU1hdGgucG93KDIsLTEwKnQpfX0saW5PdXRFeHBvOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAwPT09dD8wOjE9PT10PzE6KHQqPTIsMT50Py41Kk1hdGgucG93KDEwMjQsdC0xKTouNSooLU1hdGgucG93KDIsLTEwKih0LTEpKSsyKSl9fSxpbkNpcmM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtTWF0aC5zcXJ0KDEtdCp0KX19LG91dENpcmM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIE1hdGguc3FydCgxLSAtLXQqdCl9fSxpbk91dENpcmM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py0uNSooTWF0aC5zcXJ0KDEtdCp0KS0xKTouNSooTWF0aC5zcXJ0KDEtKHQtMikqKHQtMikpKzEpfX0saW5FbGFzdGljOmZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdPy4xOmFyZ3VtZW50c1swXSxlPWFyZ3VtZW50cy5sZW5ndGg8PTF8fHZvaWQgMD09PWFyZ3VtZW50c1sxXT8uNDphcmd1bWVudHNbMV07cmV0dXJuIGZ1bmN0aW9uKG4pe3ZhciBpPXZvaWQgMDtyZXR1cm4gMD09PW4/MDoxPT09bj8xOighdHx8MT50Pyh0PTEsaT1lLzQpOmk9ZSpNYXRoLmFzaW4oMS90KS8oMipNYXRoLlBJKSwtKHQqTWF0aC5wb3coMiwxMCoobi0xKSkqTWF0aC5zaW4oKG4tMS1pKSooMipNYXRoLlBJKS9lKSkpfX0sb3V0RWxhc3RpYzpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg8PTB8fHZvaWQgMD09PWFyZ3VtZW50c1swXT8uMTphcmd1bWVudHNbMF0sZT1hcmd1bWVudHMubGVuZ3RoPD0xfHx2b2lkIDA9PT1hcmd1bWVudHNbMV0/LjQ6YXJndW1lbnRzWzFdO3JldHVybiBmdW5jdGlvbihuKXt2YXIgaT12b2lkIDA7cmV0dXJuIDA9PT1uPzA6MT09PW4/MTooIXR8fDE+dD8odD0xLGk9ZS80KTppPWUqTWF0aC5hc2luKDEvdCkvKDIqTWF0aC5QSSksdCpNYXRoLnBvdygyLC0xMCpuKSpNYXRoLnNpbigobi1pKSooMipNYXRoLlBJKS9lKSsxKX19LGluT3V0RWxhc3RpYzpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg8PTB8fHZvaWQgMD09PWFyZ3VtZW50c1swXT8uMTphcmd1bWVudHNbMF0sZT1hcmd1bWVudHMubGVuZ3RoPD0xfHx2b2lkIDA9PT1hcmd1bWVudHNbMV0/LjQ6YXJndW1lbnRzWzFdO3JldHVybiBmdW5jdGlvbihuKXt2YXIgaT12b2lkIDA7cmV0dXJuIDA9PT1uPzA6MT09PW4/MTooIXR8fDE+dD8odD0xLGk9ZS80KTppPWUqTWF0aC5hc2luKDEvdCkvKDIqTWF0aC5QSSksbio9MiwxPm4/LS41Kih0Kk1hdGgucG93KDIsMTAqKG4tMSkpKk1hdGguc2luKChuLTEtaSkqKDIqTWF0aC5QSSkvZSkpOnQqTWF0aC5wb3coMiwtMTAqKG4tMSkpKk1hdGguc2luKChuLTEtaSkqKDIqTWF0aC5QSSkvZSkqLjUrMSl9fSxpbkJhY2s6ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciBuPXR8fDEuNzAxNTg7cmV0dXJuIGUqZSooKG4rMSkqZS1uKX19LG91dEJhY2s6ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciBuPXR8fDEuNzAxNTg7cmV0dXJuLS1lKmUqKChuKzEpKmUrbikrMX19LGluT3V0QmFjazpmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIG49MS41MjUqKHR8fDEuNzAxNTgpO3JldHVybiBlKj0yLDE+ZT8uNSooZSplKigobisxKSplLW4pKTouNSooKGUtMikqKGUtMikqKChuKzEpKihlLTIpK24pKzIpfX0saW5Cb3VuY2U6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtbi5vdXRCb3VuY2UoKSgxLXQpfX0sb3V0Qm91bmNlOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLzIuNzU+dD83LjU2MjUqdCp0OjIvMi43NT50Pyh0LT0xLjUvMi43NSw3LjU2MjUqdCp0Ky43NSk6Mi41LzIuNzU+dD8odC09Mi4yNS8yLjc1LDcuNTYyNSp0KnQrLjkzNzUpOih0LT0yLjYyNS8yLjc1LDcuNTYyNSp0KnQrLjk4NDM3NSl9fSxpbk91dEJvdW5jZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4uNT50Py41Km4uaW5Cb3VuY2UoKSgyKnQpOi41Km4ub3V0Qm91bmNlKCkoMip0LTEpKy41fX0sY3VzdG9tQXJyYXk6ZnVuY3Rpb24odCl7cmV0dXJuIHQ/ZnVuY3Rpb24odCl7cmV0dXJuIHR9Om4ubGluZWFyKCl9fTtlW1wiZGVmYXVsdFwiXT1ufSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIHIodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBlPXt9O2lmKG51bGwhPXQpZm9yKHZhciBuIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbikmJihlW25dPXRbbl0pO3JldHVybiBlW1wiZGVmYXVsdFwiXT10LGV9ZnVuY3Rpb24gcyh0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9ZnVuY3Rpb24gbyh0LGUpe2lmKCF0KXRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtyZXR1cm4hZXx8XCJvYmplY3RcIiE9dHlwZW9mIGUmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGU/dDplfWZ1bmN0aW9uIGEodCxlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiZudWxsIT09ZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIit0eXBlb2YgZSk7dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOnQsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksZSYmKE9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3Quc2V0UHJvdG90eXBlT2YodCxlKTp0Ll9fcHJvdG9fXz1lKX1mdW5jdGlvbiB1KHQsZSxuLGkscixzKXtmb3IodmFyIG8gaW4gdClpZihjKHRbb10pKXUodFtvXSxlW29dLG5bb10saSxyLHMpO2Vsc2V7dmFyIGE9ZVtvXSxoPXRbb10tZVtvXSxsPWksZj1yL2w7bltvXT1hK2gqcyhmKX19ZnVuY3Rpb24gaCh0LGUsbil7Zm9yKHZhciBpIGluIHQpMD09PWVbaV18fGVbaV18fChjKG5baV0pPyhlW2ldPUpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobltpXSkpLGgodFtpXSxlW2ldLG5baV0pKTplW2ldPW5baV0pfWZ1bmN0aW9uIGModCl7cmV0dXJuXCJbb2JqZWN0IE9iamVjdF1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KX12YXIgbD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBmPW4oMSkscD1yKGYpLGQ9bigyKSxnPWkoZCksdj1mdW5jdGlvbih0KXtmdW5jdGlvbiBlKHQsbil7cyh0aGlzLGUpO3ZhciBpPW8odGhpcyxPYmplY3QuZ2V0UHJvdG90eXBlT2YoZSkuY2FsbCh0aGlzKSk7cmV0dXJuIGkudGFyZ2V0PXQsbiYmaS5hZGRUbyhuKSxpLmNsZWFyKCksaX1yZXR1cm4gYShlLHQpLGwoZSxbe2tleTpcImFkZFRvXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMubWFuYWdlcj10LHRoaXMubWFuYWdlci5hZGRUd2Vlbih0aGlzKSx0aGlzfX0se2tleTpcImNoYWluXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHR8fCh0PW5ldyBlKHRoaXMudGFyZ2V0KSksdGhpcy5fY2hhaW5Ud2Vlbj10LHR9fSx7a2V5Olwic3RhcnRcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmFjdGl2ZT0hMCx0aGlzfX0se2tleTpcInN0b3BcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmFjdGl2ZT0hMSx0aGlzLmVtaXQoXCJzdG9wXCIpLHRoaXN9fSx7a2V5OlwidG9cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fdG89dCx0aGlzfX0se2tleTpcImZyb21cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fZnJvbT10LHRoaXN9fSx7a2V5OlwicmVtb3ZlXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tYW5hZ2VyPyh0aGlzLm1hbmFnZXIucmVtb3ZlVHdlZW4odGhpcyksdGhpcyk6dGhpc319LHtrZXk6XCJjbGVhclwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy50aW1lPTAsdGhpcy5hY3RpdmU9ITEsdGhpcy5lYXNpbmc9Z1tcImRlZmF1bHRcIl0ubGluZWFyKCksdGhpcy5leHBpcmU9ITEsdGhpcy5yZXBlYXQ9MCx0aGlzLmxvb3A9ITEsdGhpcy5kZWxheT0wLHRoaXMucGluZ1Bvbmc9ITEsdGhpcy5pc1N0YXJ0ZWQ9ITEsdGhpcy5pc0VuZGVkPSExLHRoaXMuX3RvPW51bGwsdGhpcy5fZnJvbT1udWxsLHRoaXMuX2RlbGF5VGltZT0wLHRoaXMuX2VsYXBzZWRUaW1lPTAsdGhpcy5fcmVwZWF0PTAsdGhpcy5fcGluZ1Bvbmc9ITEsdGhpcy5fY2hhaW5Ud2Vlbj1udWxsLHRoaXMucGF0aD1udWxsLHRoaXMucGF0aFJldmVyc2U9ITEsdGhpcy5wYXRoRnJvbT0wLHRoaXMucGF0aFRvPTB9fSx7a2V5OlwicmVzZXRcIix2YWx1ZTpmdW5jdGlvbigpe2lmKHRoaXMuX2VsYXBzZWRUaW1lPTAsdGhpcy5fcmVwZWF0PTAsdGhpcy5fZGVsYXlUaW1lPTAsdGhpcy5pc1N0YXJ0ZWQ9ITEsdGhpcy5pc0VuZGVkPSExLHRoaXMucGluZ1BvbmcmJnRoaXMuX3BpbmdQb25nKXt2YXIgdD10aGlzLl90byxlPXRoaXMuX2Zyb207dGhpcy5fdG89ZSx0aGlzLl9mcm9tPXQsdGhpcy5fcGluZ1Bvbmc9ITF9cmV0dXJuIHRoaXN9fSx7a2V5OlwidXBkYXRlXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtpZih0aGlzLl9jYW5VcGRhdGUoKXx8IXRoaXMuX3RvJiYhdGhpcy5wYXRoKXt2YXIgbj12b2lkIDAsaT12b2lkIDA7aWYodGhpcy5kZWxheT50aGlzLl9kZWxheVRpbWUpcmV0dXJuIHZvaWQodGhpcy5fZGVsYXlUaW1lKz1lKTt0aGlzLmlzU3RhcnRlZHx8KHRoaXMuX3BhcnNlRGF0YSgpLHRoaXMuaXNTdGFydGVkPSEwLHRoaXMuZW1pdChcInN0YXJ0XCIpKTt2YXIgcj10aGlzLnBpbmdQb25nP3RoaXMudGltZS8yOnRoaXMudGltZTtpZihyPnRoaXMuX2VsYXBzZWRUaW1lKXt2YXIgcz10aGlzLl9lbGFwc2VkVGltZStlLG89cz49cjt0aGlzLl9lbGFwc2VkVGltZT1vP3I6cyx0aGlzLl9hcHBseShyKTt2YXIgYT10aGlzLl9waW5nUG9uZz9yK3RoaXMuX2VsYXBzZWRUaW1lOnRoaXMuX2VsYXBzZWRUaW1lO2lmKHRoaXMuZW1pdChcInVwZGF0ZVwiLGEpLG8pe2lmKHRoaXMucGluZ1BvbmcmJiF0aGlzLl9waW5nUG9uZylyZXR1cm4gdGhpcy5fcGluZ1Bvbmc9ITAsbj10aGlzLl90byxpPXRoaXMuX2Zyb20sdGhpcy5fZnJvbT1uLHRoaXMuX3RvPWksdGhpcy5wYXRoJiYobj10aGlzLnBhdGhUbyxpPXRoaXMucGF0aEZyb20sdGhpcy5wYXRoVG89aSx0aGlzLnBhdGhGcm9tPW4pLHRoaXMuZW1pdChcInBpbmdwb25nXCIpLHZvaWQodGhpcy5fZWxhcHNlZFRpbWU9MCk7aWYodGhpcy5sb29wfHx0aGlzLnJlcGVhdD50aGlzLl9yZXBlYXQpcmV0dXJuIHRoaXMuX3JlcGVhdCsrLHRoaXMuZW1pdChcInJlcGVhdFwiLHRoaXMuX3JlcGVhdCksdGhpcy5fZWxhcHNlZFRpbWU9MCx2b2lkKHRoaXMucGluZ1BvbmcmJnRoaXMuX3BpbmdQb25nJiYobj10aGlzLl90byxpPXRoaXMuX2Zyb20sdGhpcy5fdG89aSx0aGlzLl9mcm9tPW4sdGhpcy5wYXRoJiYobj10aGlzLnBhdGhUbyxpPXRoaXMucGF0aEZyb20sdGhpcy5wYXRoVG89aSx0aGlzLnBhdGhGcm9tPW4pLHRoaXMuX3BpbmdQb25nPSExKSk7dGhpcy5pc0VuZGVkPSEwLHRoaXMuYWN0aXZlPSExLHRoaXMuZW1pdChcImVuZFwiKSx0aGlzLl9jaGFpblR3ZWVuJiYodGhpcy5fY2hhaW5Ud2Vlbi5hZGRUbyh0aGlzLm1hbmFnZXIpLHRoaXMuX2NoYWluVHdlZW4uc3RhcnQoKSl9fX19fSx7a2V5OlwiX3BhcnNlRGF0YVwiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoIXRoaXMuaXNTdGFydGVkJiYodGhpcy5fZnJvbXx8KHRoaXMuX2Zyb209e30pLGgodGhpcy5fdG8sdGhpcy5fZnJvbSx0aGlzLnRhcmdldCksdGhpcy5wYXRoKSl7dmFyIHQ9dGhpcy5wYXRoLnRvdGFsRGlzdGFuY2UoKTt0aGlzLnBhdGhSZXZlcnNlPyh0aGlzLnBhdGhGcm9tPXQsdGhpcy5wYXRoVG89MCk6KHRoaXMucGF0aEZyb209MCx0aGlzLnBhdGhUbz10KX19fSx7a2V5OlwiX2FwcGx5XCIsdmFsdWU6ZnVuY3Rpb24odCl7aWYodSh0aGlzLl90byx0aGlzLl9mcm9tLHRoaXMudGFyZ2V0LHQsdGhpcy5fZWxhcHNlZFRpbWUsdGhpcy5lYXNpbmcpLHRoaXMucGF0aCl7dmFyIGU9dGhpcy5waW5nUG9uZz90aGlzLnRpbWUvMjp0aGlzLnRpbWUsbj10aGlzLnBhdGhGcm9tLGk9dGhpcy5wYXRoVG8tdGhpcy5wYXRoRnJvbSxyPWUscz10aGlzLl9lbGFwc2VkVGltZS9yLG89bitpKnRoaXMuZWFzaW5nKHMpLGE9dGhpcy5wYXRoLmdldFBvaW50QXREaXN0YW5jZShvKTt0aGlzLnRhcmdldC5wb3NpdGlvbi5zZXQoYS54LGEueSl9fX0se2tleTpcIl9jYW5VcGRhdGVcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbWUmJnRoaXMuYWN0aXZlJiZ0aGlzLnRhcmdldH19XSksZX0ocC51dGlscy5FdmVudEVtaXR0ZXIpO2VbXCJkZWZhdWx0XCJdPXZ9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gcih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9dmFyIHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbz1uKDMpLGE9aShvKSx1PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3IodGhpcyx0KSx0aGlzLnR3ZWVucz1bXSx0aGlzLl90d2VlbnNUb0RlbGV0ZT1bXSx0aGlzLl9sYXN0PTB9cmV0dXJuIHModCxbe2tleTpcInVwZGF0ZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXZvaWQgMDt0fHwwPT09dD9lPTFlMyp0OihlPXRoaXMuX2dldERlbHRhTVMoKSx0PWUvMWUzKTtmb3IodmFyIG49MDtuPHRoaXMudHdlZW5zLmxlbmd0aDtuKyspe3ZhciBpPXRoaXMudHdlZW5zW25dO2kuYWN0aXZlJiYoaS51cGRhdGUodCxlKSxpLmlzRW5kZWQmJmkuZXhwaXJlJiZpLnJlbW92ZSgpKX1pZih0aGlzLl90d2VlbnNUb0RlbGV0ZS5sZW5ndGgpe2Zvcih2YXIgbj0wO248dGhpcy5fdHdlZW5zVG9EZWxldGUubGVuZ3RoO24rKyl0aGlzLl9yZW1vdmUodGhpcy5fdHdlZW5zVG9EZWxldGVbbl0pO3RoaXMuX3R3ZWVuc1RvRGVsZXRlLmxlbmd0aD0wfX19LHtrZXk6XCJnZXRUd2VlbnNGb3JUYXJnZXRcIix2YWx1ZTpmdW5jdGlvbih0KXtmb3IodmFyIGU9W10sbj0wO248dGhpcy50d2VlbnMubGVuZ3RoO24rKyl0aGlzLnR3ZWVuc1tuXS50YXJnZXQ9PT10JiZlLnB1c2godGhpcy50d2VlbnNbbl0pO3JldHVybiBlfX0se2tleTpcImNyZWF0ZVR3ZWVuXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIG5ldyBhW1wiZGVmYXVsdFwiXSh0LHRoaXMpfX0se2tleTpcImFkZFR3ZWVuXCIsdmFsdWU6ZnVuY3Rpb24odCl7dC5tYW5hZ2VyPXRoaXMsdGhpcy50d2VlbnMucHVzaCh0KX19LHtrZXk6XCJyZW1vdmVUd2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMuX3R3ZWVuc1RvRGVsZXRlLnB1c2godCl9fSx7a2V5OlwiX3JlbW92ZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMudHdlZW5zLmluZGV4T2YodCk7LTEhPT1lJiZ0aGlzLnR3ZWVucy5zcGxpY2UoZSwxKX19LHtrZXk6XCJfZ2V0RGVsdGFNU1wiLHZhbHVlOmZ1bmN0aW9uKCl7MD09PXRoaXMuX2xhc3QmJih0aGlzLl9sYXN0PURhdGUubm93KCkpO3ZhciB0PURhdGUubm93KCksZT10LXRoaXMuX2xhc3Q7cmV0dXJuIHRoaXMuX2xhc3Q9dCxlfX1dKSx0fSgpO2VbXCJkZWZhdWx0XCJdPXV9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgZT17fTtpZihudWxsIT10KWZvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKTtyZXR1cm4gZVtcImRlZmF1bHRcIl09dCxlfWZ1bmN0aW9uIHIodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89bigxKSxhPWkobyksdT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtyKHRoaXMsdCksdGhpcy5fY29sc2VkPSExLHRoaXMucG9seWdvbj1uZXcgYS5Qb2x5Z29uLHRoaXMucG9seWdvbi5jbG9zZWQ9ITEsdGhpcy5fdG1wUG9pbnQ9bmV3IGEuUG9pbnQsdGhpcy5fdG1wUG9pbnQyPW5ldyBhLlBvaW50LHRoaXMuX3RtcERpc3RhbmNlPVtdLHRoaXMuY3VycmVudFBhdGg9bnVsbCx0aGlzLmdyYXBoaWNzRGF0YT1bXSx0aGlzLmRpcnR5PSEwfXJldHVybiBzKHQsW3trZXk6XCJtb3ZlVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5tb3ZlVG8uY2FsbCh0aGlzLHQsZSksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImxpbmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmxpbmVUby5jYWxsKHRoaXMsdCxlKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiYmV6aWVyQ3VydmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkscixzKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUuYmV6aWVyQ3VydmVUby5jYWxsKHRoaXMsdCxlLG4saSxyLHMpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJxdWFkcmF0aWNDdXJ2ZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLnF1YWRyYXRpY0N1cnZlVG8uY2FsbCh0aGlzLHQsZSxuLGkpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJhcmNUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkscil7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmFyY1RvLmNhbGwodGhpcyx0LGUsbixpLHIpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJhcmNcIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpLHIscyl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmFyYy5jYWxsKHRoaXMsdCxlLG4saSxyLHMpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJkcmF3U2hhcGVcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUuZHJhd1NoYXBlLmNhbGwodGhpcyx0KSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiZ2V0UG9pbnRcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLnBhcnNlUG9pbnRzKCk7dmFyIGU9dGhpcy5jbG9zZWQmJnQ+PXRoaXMubGVuZ3RoLTE/MDoyKnQ7cmV0dXJuIHRoaXMuX3RtcFBvaW50LnNldCh0aGlzLnBvbHlnb24ucG9pbnRzW2VdLHRoaXMucG9seWdvbi5wb2ludHNbZSsxXSksdGhpcy5fdG1wUG9pbnR9fSx7a2V5OlwiZGlzdGFuY2VCZXR3ZWVuXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXt0aGlzLnBhcnNlUG9pbnRzKCk7dmFyIG49dGhpcy5nZXRQb2ludCh0KSxpPW4ueCxyPW4ueSxzPXRoaXMuZ2V0UG9pbnQoZSksbz1zLngsYT1zLnksdT1vLWksaD1hLXI7cmV0dXJuIE1hdGguc3FydCh1KnUraCpoKX19LHtrZXk6XCJ0b3RhbERpc3RhbmNlXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLnBhcnNlUG9pbnRzKCksdGhpcy5fdG1wRGlzdGFuY2UubGVuZ3RoPTAsdGhpcy5fdG1wRGlzdGFuY2UucHVzaCgwKTtmb3IodmFyIHQ9dGhpcy5sZW5ndGgsZT0wLG49MDt0LTE+bjtuKyspZSs9dGhpcy5kaXN0YW5jZUJldHdlZW4obixuKzEpLHRoaXMuX3RtcERpc3RhbmNlLnB1c2goZSk7cmV0dXJuIGV9fSx7a2V5OlwiZ2V0UG9pbnRBdFwiLHZhbHVlOmZ1bmN0aW9uKHQpe2lmKHRoaXMucGFyc2VQb2ludHMoKSx0PnRoaXMubGVuZ3RoKXJldHVybiB0aGlzLmdldFBvaW50KHRoaXMubGVuZ3RoLTEpO2lmKHQlMT09PTApcmV0dXJuIHRoaXMuZ2V0UG9pbnQodCk7dGhpcy5fdG1wUG9pbnQyLnNldCgwLDApO3ZhciBlPXQlMSxuPXRoaXMuZ2V0UG9pbnQoTWF0aC5jZWlsKHQpKSxpPW4ueCxyPW4ueSxzPXRoaXMuZ2V0UG9pbnQoTWF0aC5mbG9vcih0KSksbz1zLngsYT1zLnksdT0tKChvLWkpKmUpLGg9LSgoYS1yKSplKTtyZXR1cm4gdGhpcy5fdG1wUG9pbnQyLnNldChvK3UsYStoKSx0aGlzLl90bXBQb2ludDJ9fSx7a2V5OlwiZ2V0UG9pbnRBdERpc3RhbmNlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5wYXJzZVBvaW50cygpLHRoaXMuX3RtcERpc3RhbmNlfHx0aGlzLnRvdGFsRGlzdGFuY2UoKTt2YXIgZT10aGlzLl90bXBEaXN0YW5jZS5sZW5ndGgsbj0wLGk9dGhpcy5fdG1wRGlzdGFuY2VbdGhpcy5fdG1wRGlzdGFuY2UubGVuZ3RoLTFdOzA+dD90PWkrdDp0PmkmJih0LT1pKTtmb3IodmFyIHI9MDtlPnImJih0Pj10aGlzLl90bXBEaXN0YW5jZVtyXSYmKG49ciksISh0PHRoaXMuX3RtcERpc3RhbmNlW3JdKSk7cisrKTtpZihuPT09dGhpcy5sZW5ndGgtMSlyZXR1cm4gdGhpcy5nZXRQb2ludEF0KG4pO3ZhciBzPXQtdGhpcy5fdG1wRGlzdGFuY2Vbbl0sbz10aGlzLl90bXBEaXN0YW5jZVtuKzFdLXRoaXMuX3RtcERpc3RhbmNlW25dO3JldHVybiB0aGlzLmdldFBvaW50QXQobitzL28pfX0se2tleTpcInBhcnNlUG9pbnRzXCIsdmFsdWU6ZnVuY3Rpb24oKXtpZighdGhpcy5kaXJ0eSlyZXR1cm4gdGhpczt0aGlzLmRpcnR5PSExLHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoPTA7Zm9yKHZhciB0PTA7dDx0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg7dCsrKXt2YXIgZT10aGlzLmdyYXBoaWNzRGF0YVt0XS5zaGFwZTtlJiZlLnBvaW50cyYmKHRoaXMucG9seWdvbi5wb2ludHM9dGhpcy5wb2x5Z29uLnBvaW50cy5jb25jYXQoZS5wb2ludHMpKX1yZXR1cm4gdGhpc319LHtrZXk6XCJjbGVhclwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aD0wLHRoaXMuY3VycmVudFBhdGg9bnVsbCx0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aD0wLHRoaXMuX2Nsb3NlZD0hMSx0aGlzLmRpcnR5PSExLHRoaXN9fSx7a2V5OlwiY2xvc2VkXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Nsb3NlZH0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuX2Nsb3NlZCE9PXQmJih0aGlzLnBvbHlnb24uY2xvc2VkPXQsdGhpcy5fY2xvc2VkPXQsdGhpcy5kaXJ0eT0hMCl9fSx7a2V5OlwibGVuZ3RoXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoP3RoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoLzIrKHRoaXMuX2Nsb3NlZD8xOjApOjB9fV0pLHR9KCk7ZVtcImRlZmF1bHRcIl09dX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1mdW5jdGlvbiByKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgZT17fTtpZihudWxsIT10KWZvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKTtyZXR1cm4gZVtcImRlZmF1bHRcIl09dCxlfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBzPW4oMSksbz1yKHMpLGE9big0KSx1PWkoYSksaD1uKDMpLGM9aShoKSxsPW4oNSksZj1pKGwpLHA9bigyKSxkPWkocCk7by5HcmFwaGljcy5wcm90b3R5cGUuZHJhd1BhdGg9ZnVuY3Rpb24odCl7cmV0dXJuIHQucGFyc2VQb2ludHMoKSx0aGlzLmRyYXdTaGFwZSh0LnBvbHlnb24pLHRoaXN9O3ZhciBnPXtUd2Vlbk1hbmFnZXI6dVtcImRlZmF1bHRcIl0sVHdlZW46Y1tcImRlZmF1bHRcIl0sRWFzaW5nOmRbXCJkZWZhdWx0XCJdLFR3ZWVuUGF0aDpmW1wiZGVmYXVsdFwiXX07by50d2Vlbk1hbmFnZXJ8fChvLnR3ZWVuTWFuYWdlcj1uZXcgdVtcImRlZmF1bHRcIl0sby50d2Vlbj1nKSxlW1wiZGVmYXVsdFwiXT1nfV0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS10d2Vlbi5qcy5tYXAiLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgXCJBXCI6IHtcclxuICAgIFwiaW1hZ2VcIjogXCJjZWxsMS5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IGZhbHNlLFxyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJjZWxsMS1maWxsLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDgsXHJcbiAgICBcInNjb3JlXCI6IDFcclxuICB9LFxyXG4gIFwiQlwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiY2VsbDIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiBmYWxzZVxyXG4gIH0sXHJcbiAgXCJDXCI6IHtcclxuICAgIFwiaW1hZ2VcIjogXCJjZWxsNC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IGZhbHNlLFxyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJjZWxsNC1maWxsLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDIyLFxyXG4gICAgXCJzY29yZVwiOiAzXHJcbiAgfSxcclxuICBcIklDXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kQy5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiLFxyXG4gICAgXCJhY3Rpb25cIjogXCJoaXN0b3J5XCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMFxyXG4gIH0sXHJcbiAgXCJJVExcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRUTC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklUXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kVC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklUUlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFRSLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSVJcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRSLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwiYWN0aW9uXCI6IFwiaGlzdG9yeVwiLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJQlJcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRCUi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklCXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kQi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklCTFwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEJMLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSUxcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRMLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCIsXHJcbiAgICBcImFjdGlvblwiOiBcImhpc3RvcnlcIixcclxuICAgIFwiYWN0aXZhdGlvblwiOiAwXHJcbiAgfVxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzPXtcclxuICBcImxldFwiOiBbXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIkFcIiwgXCJBfEN8QlwiLCBcIkFcIiwgXCJBXCIsIFwiQVwiXSxcclxuICAgICAgXCJzaHVmZmxlXCI6IHRydWUsXHJcbiAgICAgIFwidHJpbVwiOiAzXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBfEF8Q1wiLCBcIkF8QlwiLCBcIkFcIiwgXCJCXCIsIFwiQVwiXSxcclxuICAgICAgXCJzaHVmZmxlXCI6IHRydWUsXHJcbiAgICB9XHJcbiAgXSxcclxuICBcImVuZFwiOiBbXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIkFcIiwgXCJBXCIsIFwiQVwiLCBcIkFcIiwgXCJBXCJdLFxyXG4gICAgfVxyXG4gIF0sXHJcbiAgXCJsYWJpcmludFwiOiBbXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIkJcIiwgXCJCXCIsIFwiQlwiLCBcIkJcIiwgXCJCXCJdLFxyXG4gICAgICBcImFwcGVuZFwiOiBcIkFcIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQVwiLCBcIkFcIiwgXCJBXCIsIFwiQVwiLCBcIkFcIl0sXHJcbiAgICB9XHJcbiAgXSxcclxuICBcImlzbGFuZFwiOiBbXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIkF8Q3xCXCIsIFwiQVwiLCBcIkF8Q3xCXCJdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJJVExcIiwgXCJJVFwiLCBcIklUUlwiXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiSUxcIiwgIFwiSUNcIiwgIFwiSVJcIl1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIklCTFwiLCBcIklCXCIsIFwiSUJSXCJdXHJcbiAgICB9XHJcbiAgXVxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzPVtcclxuICB7XHJcbiAgICBcImZyYWdtZW50c1wiOiBbXHJcbiAgICAgIHtcImlzbGFuZFwiOiAxfSxcclxuICAgICAge1wibGV0XCI6IDR9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wiZW5kXCI6IDF9LFxyXG4gICAgICB7XCJpc2xhbmRcIjogMX0sXHJcbiAgICBdLFxyXG4gICAgXCJoaXN0b3J5XCI6IHtcclxuICAgICAgXCJydVwiOiBcItCi0LvQtdC9INC40LTQtdGCINC30LAg0YLQvtCx0L7QuSDQv9C+INC/0Y/RgtCw0LwuIFxcbiDQntGC0YHRgtGD0L/QuNGB0Ywg0Lgg0L7QvSDRgtC10LHRjyDQv9C+0LPQu9Cw0YLQuNGCLi4uIFxcbiDQndC+INC90LUg0YHRgtC+0LjRgiDQvtGC0YfQsNC40LLQsNGC0YzRgdGPLCDQstC10LTRjCDQvNGD0LfRi9C60LAg0LLRgdC10LPQtNCwINGBINGC0L7QsdC+0LkuXCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwiZnJhZ21lbnRzXCI6IFtcclxuICAgICAge1wibGV0XCI6IDEwfSxcclxuICAgICAge1wibGFiaXJpbnRcIjogMTB9LFxyXG4gICAgICB7XCJlbmRcIjogMX0sXHJcbiAgICAgIHtcImlzbGFuZFwiOiAxfVxyXG4gICAgXSxcclxuICAgIFwiaGlzdG9yeVwiOiB7XHJcbiAgICAgIFwicnVcIjogXCLQotC70LXQvSDQvdC1INGJ0LDQtNC40YIg0L3QuNC60L7Qs9C+LiDQm9C10YLRg9GH0LjQtSDQt9C80LXQuCDQv9Cw0LTRg9GCINC90LAg0LfQtdC80LvRjiDQuCDQv9C+0LPRgNGD0LfRj9GC0YHRjyDQsiDRgNGD0YLQuNC90YMg0LHRi9GC0LjRjy4uLlwiXHJcbiAgICB9XHJcbiAgfSxcclxuICB7XHJcbiAgICBcImZyYWdtZW50c1wiOiBbXHJcbiAgICAgIHtcImxldFwiOiA1fSxcclxuICAgICAge1wibGFiaXJpbnRcIjogNX0sXHJcbiAgICAgIHtcImxldFwiOiA1fSxcclxuICAgICAge1wibGFiaXJpbnRcIjogNX0sXHJcbiAgICAgIHtcImxldFwiOiA1fSxcclxuICAgICAge1wibGFiaXJpbnRcIjogNX0sXHJcbiAgICAgIHtcImxldFwiOiA1fSxcclxuICAgICAge1wibGFiaXJpbnRcIjogNX0sXHJcbiAgICAgIHtcImVuZFwiOiAxfSxcclxuICAgICAge1wiaXNsYW5kXCI6IDF9XHJcbiAgICBdLFxyXG4gICAgXCJoaXN0b3J5XCI6IHtcclxuICAgICAgXCJydVwiOiBcItCYINGC0L7Qs9C00LAg0L7QvSDQv9C+0L3QtdGBINGB0LLQtdGH0YMg0YfQtdGA0LXQtyDRh9GD0LbQuNC1INC30LXQvNC70Lgg0L7RgdCy0L7QsdC+0LbQtNCw0Y8g0LvQtdGC0YPRh9C40YUg0LfQvNC10Lkg0Lgg0YHQstC+0Lkg0L3QsNGA0L7QtC4uLlwiXHJcbiAgICB9XHJcbiAgfVxyXG5dXHJcbiIsImNvbnN0IFNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuL21hbmFnZXJzL1NjZW5lc01hbmFnZXInKTtcclxuY29uc3QgZmlsdGVycyA9IHJlcXVpcmUoJ3BpeGktZmlsdGVycycpO1xyXG5jb25zdCBHcmF5c2NhbGVGaWx0ZXIgPSByZXF1aXJlKCcuL3NoYWRlcnMvR3JheXNjYWxlRmlsdGVyJyk7XHJcbmNvbnN0IE5vaXNlQmx1ckZpbHRlciA9IHJlcXVpcmUoJy4vc2hhZGVycy9Ob2lzZUJsdXJGaWx0ZXInKTtcclxuXHJcbmNvbnN0IFNwaGVyZSA9IHJlcXVpcmUoJy4vc3ViamVjdHMvU3BoZXJlJyk7XHJcblxyXG5jbGFzcyBHYW1lIGV4dGVuZHMgUElYSS5BcHBsaWNhdGlvbiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0LCB7YmFja2dyb3VuZENvbG9yOiAweGZjZmNmY30pXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlldyk7XHJcblxyXG4gICAgdGhpcy53ID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICB0aGlzLmggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcclxuICAgIHRoaXMuc3RhZ2UuYWRkQ2hpbGQodGhpcy5jb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMuYmcgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnYmcnKSk7XHJcbiAgICB0aGlzLmJnLndpZHRoID0gdGhpcy53O1xyXG4gICAgdGhpcy5iZy5oZWlnaHQgPSB0aGlzLmg7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLmJnKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lcyA9IG5ldyBTY2VuZXNNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5jb250YWluZXIuYWRkQ2hpbGQodGhpcy5zY2VuZXMpO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLmZpbHRlckFyZWEgPSBuZXcgUElYSS5SZWN0YW5nbGUoMCwgMCwgdGhpcy53LCB0aGlzLmgpO1xyXG4gICAgdGhpcy5ncmF5c2NhbGUgPSBuZXcgR3JheXNjYWxlRmlsdGVyKCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5maWx0ZXJzID0gW3RoaXMuZ3JheXNjYWxlLCBuZXcgTm9pc2VCbHVyRmlsdGVyKCldO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIHRoaXMuY29udGFpbmVyLmN1cnNvciA9ICdub25lJztcclxuICAgIHRoaXMubW91c2UgPSBuZXcgU3BoZXJlKCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLm1vdXNlKTtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lci5vbigncG9pbnRlcm1vdmUnLCAoZSkgPT4ge1xyXG4gICAgICB0aGlzLmdyYXlzY2FsZS54ID0gZS5kYXRhLmdsb2JhbC54L3RoaXMudztcclxuICAgICAgdGhpcy5ncmF5c2NhbGUueSA9IGUuZGF0YS5nbG9iYWwueS90aGlzLmg7XHJcbiAgICAgIHRoaXMubW91c2UueCA9IGUuZGF0YS5nbG9iYWwueDtcclxuICAgICAgdGhpcy5tb3VzZS55ID0gZS5kYXRhLmdsb2JhbC55O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5faW5pdFRpY2tlcigpO1xyXG4gIH1cclxuICBfaW5pdFRpY2tlcigpIHtcclxuICAgIHRoaXMudGlja2VyLmFkZCgoZHQpID0+IHtcclxuICAgICAgdGhpcy5zY2VuZXMudXBkYXRlKGR0KTtcclxuICAgICAgUElYSS50d2Vlbk1hbmFnZXIudXBkYXRlKCk7XHJcbiAgICAgIHRoaXMubW91c2UudXBkYXRlKGR0KTtcclxuICAgICAgLy8gdGhpcy5jb250YWluZXIuZmlsdGVyc1swXS50aW1lICs9IC4wMTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xyXG4iLCJyZXF1aXJlKCdwaXhpLXNvdW5kJyk7XHJcbnJlcXVpcmUoJ3BpeGktdHdlZW4nKTtcclxucmVxdWlyZSgncGl4aS1wcm9qZWN0aW9uJyk7XHJcbnJlcXVpcmUoJ3BpeGktcGFydGljbGVzJyk7XHJcblxyXG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJyk7XHJcblxyXG5XZWJGb250LmxvYWQoe1xyXG4gIGdvb2dsZToge1xyXG4gICAgZmFtaWxpZXM6IFsnQW1hdGljIFNDJ11cclxuICB9LFxyXG4gIGFjdGl2ZSgpIHtcclxuICAgIFBJWEkubG9hZGVyXHJcbiAgICAgIC5hZGQoJ2Jsb2NrcycsICdhc3NldHMvYmxvY2tzLmpzb24nKVxyXG4gICAgICAuYWRkKCdwbGF5ZXInLCAnYXNzZXRzL3BsYXllci5wbmcnKVxyXG4gICAgICAuYWRkKCdiZycsICdhc3NldHMvYmcucG5nJylcclxuICAgICAgLmFkZCgnZGlzcGxhY2VtZW50JywgJ2Fzc2V0cy9kaXNwbGFjZW1lbnQucG5nJylcclxuICAgICAgLmFkZCgndGhsZW4nLCAnYXNzZXRzL3RobGVuLnBuZycpXHJcbiAgICAgIC5hZGQoJ2xpZ2h0bWFwJywgJ2Fzc2V0cy9saWdodG1hcC5wbmcnKVxyXG4gICAgICAuYWRkKCdtYXNrJywgJ2Fzc2V0cy9tYXNrLnBuZycpXHJcbiAgICAgIC5hZGQoJ3BhcnRpY2xlJywgJ2Fzc2V0cy9wYXJ0aWNsZS5wbmcnKVxyXG4gICAgICAuYWRkKCdtdXNpYycsICdhc3NldHMvbXVzaWMubXAzJylcclxuICAgICAgLmxvYWQoKGxvYWRlciwgcmVzb3VyY2VzKSA9PiB7XHJcbiAgICAgICAgLy8gUElYSS5zb3VuZC5wbGF5KCdtdXNpYycpO1xyXG4gICAgICAgIGxldCBnYW1lID0gbmV3IEdhbWUoKTtcclxuICAgICAgICBnYW1lLnNjZW5lcy5lbmFibGVTY2VuZSgncGxheWdyb3VuZCcpO1xyXG5cclxuICAgICAgICB3aW5kb3cuZ2FtZSA9IGdhbWU7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufSk7XHJcbiIsImNsYXNzIEhpc3RvcnlNYW5hZ2VyIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuZ2FtZSA9IHNjZW5lLmdhbWU7XHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcblxyXG4gICAgdGhpcy5hbHBoYSA9IDA7XHJcbiAgICB0aGlzLnRleHQgPSBuZXcgUElYSS5UZXh0KCdUZXh0Jywge1xyXG4gICAgICBmb250OiAnbm9ybWFsIDQwcHggQW1hdGljIFNDJyxcclxuICAgICAgd29yZFdyYXA6IHRydWUsXHJcbiAgICAgIHdvcmRXcmFwV2lkdGg6IHRoaXMuZ2FtZS53LzIsXHJcbiAgICAgIGZpbGw6ICcjZmZmJyxcclxuICAgICAgcGFkZGluZzogMTAsXHJcbiAgICAgIGFsaWduOiAnY2VudGVyJ1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRleHQuYW5jaG9yLnNldCguNSk7XHJcbiAgICB0aGlzLnRleHQueCA9IHRoaXMuZ2FtZS53LzI7XHJcbiAgICB0aGlzLnRleHQueSA9IDE1MDtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy50ZXh0KTtcclxuICB9XHJcbiAgc2hvd1RleHQodHh0LCB0aW1lKSB7XHJcbiAgICB0aGlzLnRleHQuZm9udEZhbWlseSA9ICdBbWF0aWMgU0MnO1xyXG4gICAgdGhpcy50ZXh0LnNldFRleHQodHh0KTtcclxuXHJcbiAgICBsZXQgc2hvdyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgc2hvdy5mcm9tKHthbHBoYTogMH0pLnRvKHthbHBoYTogMX0pO1xyXG4gICAgc2hvdy50aW1lID0gMTAwMDtcclxuICAgIHNob3cuc3RhcnQoKTtcclxuICAgIHRoaXMuZW1pdCgnc2hvd2VuJyk7XHJcblxyXG4gICAgc2V0VGltZW91dCh0aGlzLmhpZGVUZXh0LmJpbmQodGhpcyksIHRpbWUpO1xyXG4gIH1cclxuICBoaWRlVGV4dCgpIHtcclxuICAgIGxldCBoaWRlID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBoaWRlLmZyb20oe2FscGhhOiAxfSkudG8oe2FscGhhOiAwfSk7XHJcbiAgICBoaWRlLnRpbWUgPSAxMDAwO1xyXG4gICAgaGlkZS5zdGFydCgpO1xyXG4gICAgdGhpcy5lbWl0KCdoaWRkZW4nKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGlzdG9yeU1hbmFnZXI7XHJcbiIsIi8qXHJcbiAg0JzQtdC90LXQtNC20LXRgCDRg9GA0L7QstC90LXQuSwg0YDQsNCx0L7RgtCw0LXRgiDQvdCw0L/RgNGP0LzRg9GOINGBIE1hcE1hbmFnZXJcclxuICDQuNGB0L/QvtC70YzQt9GD0Y8g0LTQsNC90L3Ri9C1IGxldmVscy5qc29uINC4ICBmcmFnbWVudHMuanNvblxyXG5cclxuICDQodC+0LHRi9GC0LjRjzpcclxuICAgIGFkZGVkRnJhZ21lbnRzRGF0YSA9PiBuZXcgZnJhZ21lbnRzRGF0YVxyXG4gICAgYWRkZWRMZXZlbHMgPT4gbmV3IGxldmVsc1xyXG4gICAgYWRkZWRMZXZlbCA9PiBuZXcgbHZsXHJcblxyXG4gICAgc3dpdGNoZWRMZXZlbCA9PiBjdXIgbHZsXHJcbiAgICB3ZW50TmV4dExldmVsID0+IGN1ciBsdmxcclxuICAgIHdlbnRCYWNrTGV2ZWwgPT4gY3VyIGx2bFxyXG4gICAgc3dpdGNoZWRGcmFnbWVudCA9PiBjdXIgZnJhZ1xyXG4gICAgd2VudE5leHRGcmFnbWVudCA9PiBjdXIgZnJhZ1xyXG4gICAgd2VudEJhY2tGcmFnbWVudCA9PiBjdXIgZnJhZ1xyXG5cclxuICAgIHN0YXJ0ZWRMZXZlbCA9PiBuZXcgbHZsXHJcbiAgICBlbmRlZExldmVsID0+IHByZXYgbHZsXHJcbiovXHJcblxyXG5cclxuY2xhc3MgTGV2ZWxNYW5hZ2VyIGV4dGVuZHMgUElYSS51dGlscy5FdmVudEVtaXR0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lLCBtYXApIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5tYXAgPSBtYXA7XHJcblxyXG4gICAgdGhpcy5sZXZlbHMgPSBbXTtcclxuICAgIHRoaXMuZnJhZ21lbnRzRGF0YSA9IHt9O1xyXG4gICAgdGhpcy5hZGRGcmFnbWVudHNEYXRhKHJlcXVpcmUoJy4uL2NvbnRlbnQvZnJhZ21lbnRzJykpO1xyXG4gICAgdGhpcy5hZGRMZXZlbHMocmVxdWlyZSgnLi4vY29udGVudC9sZXZlbHMnKSlcclxuXHJcbiAgICB0aGlzLmN1ckxldmVsSW5kZXggPSAwO1xyXG4gICAgdGhpcy5jdXJGcmFnbWVudEluZGV4ID0gMDtcclxuICB9XHJcbiAgLy8gZ2V0dGVyc1xyXG4gIGdldEN1cnJlbnRMZXZlbCgpIHtcclxuICAgIHJldHVybiB0aGlzLmxldmVsc1t0aGlzLmN1ckxldmVsSW5kZXhdO1xyXG4gIH1cclxuICBnZXRDdXJyZW50RnJhZ21lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRDdXJyZW50TGV2ZWwoKSAmJiB0aGlzLmdldEN1cnJlbnRMZXZlbCgpLm1hcHNbdGhpcy5jdXJGcmFnbWVudEluZGV4XTtcclxuICB9XHJcblxyXG4gIC8vIGFkZCBmcmFnbWVudHMgdG8gZGIgZnJhZ21lbnRzXHJcbiAgYWRkRnJhZ21lbnRzRGF0YShkYXRhPXt9KSB7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZnJhZ21lbnRzRGF0YSwgZGF0YSk7XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkRnJhZ21lbnRzRGF0YScsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLy8gYWRkIGxldmVscyB0byBkYiBsZXZlbHNcclxuICBhZGRMZXZlbHMobGV2ZWxzPVtdKSB7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGV2ZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuYWRkTGV2ZWwobGV2ZWxzW2ldKTtcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdCgnYWRkZWRMZXZlbHMnLCBsZXZlbHMpO1xyXG4gIH1cclxuICBhZGRMZXZlbChsdmw9e30pIHtcclxuICAgIHRoaXMubGV2ZWxzLnB1c2gobHZsKTtcclxuXHJcbiAgICAvLyBnZW5lcmF0ZWQgbWFwcyB0byBsdmwgb2JqZWN0XHJcbiAgICBsdmwubWFwcyA9IFtdO1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGx2bC5mcmFnbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZm9yKGxldCBrZXkgaW4gbHZsLmZyYWdtZW50c1tpXSkge1xyXG4gICAgICAgIGZvcihsZXQgYyA9IDA7IGMgPCBsdmwuZnJhZ21lbnRzW2ldW2tleV07IGMrKykge1xyXG4gICAgICAgICAgbHZsLm1hcHMucHVzaCh0aGlzLmZyYWdtZW50c0RhdGFba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkTGV2ZWwnLCBsdmwpO1xyXG4gIH1cclxuXHJcbiAgLy8gTWV0aG9kcyBmb3IgbGV2ZWxzIGNvbnRyb2xcclxuICBzd2l0Y2hMZXZlbChsdmwpIHtcclxuICAgIGlmKGx2bCA+PSB0aGlzLmxldmVscy5sZW5ndGggfHwgbHZsIDwgMCkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuY3VyTGV2ZWxJbmRleCA9IGx2bDtcclxuICAgIHRoaXMuc3dpdGNoRnJhZ21lbnQoMCk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdzdGFydGVkTGV2ZWwnKTtcclxuICAgIHRoaXMuZW1pdCgnc3dpdGNoZWRMZXZlbCcpO1xyXG4gIH1cclxuICBuZXh0TGV2ZWwoKSB7XHJcbiAgICB0aGlzLnN3aXRjaExldmVsKHRoaXMuY3VyTGV2ZWxJbmRleCsxKTtcclxuICAgIHRoaXMuZW1pdCgnd2VudE5leHRMZXZlbCcpO1xyXG4gIH1cclxuICBiYWNrTGV2ZWwoKSB7XHJcbiAgICB0aGlzLnN3aXRjaExldmVsKHRoaXMuY3VyTGV2ZWxJbmRleC0xKTtcclxuICAgIHRoaXMuZW1pdCgnd2VudEJhY2tMZXZlbCcpO1xyXG4gIH1cclxuXHJcbiAgLy8gTWV0aG9kcyBmb3IgZnJhZ21lbnRzIGNvbnRyb2xcclxuICBzd2l0Y2hGcmFnbWVudChmcmFnKSB7XHJcbiAgICBpZihmcmFnIDwgMCkgcmV0dXJuO1xyXG4gICAgdGhpcy5jdXJGcmFnbWVudEluZGV4ID0gZnJhZztcclxuXHJcbiAgICBpZih0aGlzLmdldEN1cnJlbnRGcmFnbWVudCgpKSB0aGlzLm1hcC5hZGRNYXAodGhpcy5nZXRDdXJyZW50RnJhZ21lbnQoKSk7XHJcbiAgICBlbHNlIHRoaXMuZW1pdCgnZW5kZWRMZXZlbCcpO1xyXG4gICAgdGhpcy5lbWl0KCdzd2l0Y2hlZEZyYWdtZW50Jyk7XHJcbiAgfVxyXG4gIG5leHRGcmFnbWVudCgpIHtcclxuICAgIHRoaXMuc3dpdGNoRnJhZ21lbnQodGhpcy5jdXJGcmFnbWVudEluZGV4KzEpO1xyXG4gICAgdGhpcy5lbWl0KCd3ZW50TmV4dEZyYWdtZW50Jyk7XHJcbiAgfVxyXG4gIGJhY2tGcmFnbWVudCgpIHtcclxuICAgIHRoaXMuc3dpdGNoRnJhZ21lbnQodGhpcy5jdXJGcmFnbWVudEluZGV4LTEpO1xyXG4gICAgdGhpcy5lbWl0KCd3ZW50QmFja0ZyYWdtZW50Jyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsTWFuYWdlcjtcclxuIiwiLypcclxuICDQlNCy0LjQttC+0Log0YLQsNC50LvQvtCy0L7QuSDQutCw0YDRgtGLXHJcbiAg0KHQvtCx0YvRgtC40Y86XHJcbiAgICBhZGRlZE1hcCA9PiBtYXBcclxuICAgIGFkZGVkRnJhZ21lbnQgPT4gZnJhZ21lbnRzXHJcbiAgICBhZGRlZEJsb2NrID0+IGJsb2NrXHJcbiAgICBzY3JvbGxlZERvd24gPT4gZHREb3duXHJcbiAgICBzY3JvbGxlZFRvcCA9PiBkdFRvcFxyXG5cclxuICAgIHJlc2l6ZWRcclxuICAgIGVuZGVkTWFwXHJcbiAgICBjbGVhcmVkT3V0UmFuZ2VCbG9ja3NcclxuKi9cclxuXHJcblxyXG5jb25zdCBCbG9jayA9IHJlcXVpcmUoJy4uL3N1YmplY3RzL0Jsb2NrJyk7XHJcbmNvbnN0IERhdGFGcmFnbWVudENvbnZlcnRlciA9IHJlcXVpcmUoJy4uL3V0aWxzL0RhdGFGcmFnbWVudENvbnZlcnRlcicpO1xyXG5cclxuY2xhc3MgTWFwTWFuYWdlciBleHRlbmRzIFBJWEkucHJvamVjdGlvbi5Db250YWluZXIyZCB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUsIHBhcmFtcz17fSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHNjZW5lLmFkZENoaWxkKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgIHRoaXMuZ2FtZSA9IHNjZW5lLmdhbWU7XHJcblxyXG4gICAgdGhpcy5QQURESU5HX0JPVFRPTSA9IDI4MDtcclxuXHJcbiAgICB0aGlzLm1heEF4aXNYID0gcGFyYW1zLm1heFggfHwgNTtcclxuICAgIHRoaXMuYmxvY2tTaXplID0gcGFyYW1zLnRpbGVTaXplIHx8IDEwMDtcclxuICAgIHRoaXMuc2V0QmxvY2tzRGF0YShyZXF1aXJlKCcuLi9jb250ZW50L2Jsb2NrcycpKTtcclxuICAgIHRoaXMucmVzaXplKCk7XHJcblxyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnNwZWVkID0gNTAwO1xyXG4gICAgdGhpcy5sYXN0SW5kZXggPSAwO1xyXG4gIH1cclxuICByZXNpemUoKSB7XHJcbiAgICB0aGlzLnggPSB0aGlzLmdhbWUudy8yLXRoaXMubWF4QXhpc1gqdGhpcy5ibG9ja1NpemUvMjtcclxuICAgIHRoaXMueSA9IHRoaXMuZ2FtZS5oLXRoaXMuUEFERElOR19CT1RUT007XHJcbiAgICB0aGlzLmVtaXQoJ3Jlc2l6ZWQnKTtcclxuICB9XHJcblxyXG4gIC8vIFNldCBwYXJhbXNcclxuICBzZXRCbG9ja3NEYXRhKGRhdGEpIHtcclxuICAgIHRoaXMuQkxPQ0tTID0gZGF0YSB8fCB7fTtcclxuICB9XHJcbiAgc2V0TWF4QXhpc1gobWF4KSB7XHJcbiAgICB0aGlzLm1heEF4aXNYID0gbWF4IHx8IDY7XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gIH1cclxuICBzZXRCbG9ja1NpemUoc2l6ZSkge1xyXG4gICAgdGhpcy5ibG9ja1NpemUgPSBzaXplIHx8IDEwMDtcclxuICAgIHRoaXMucmVzaXplKCk7XHJcbiAgfVxyXG4gIHNldFNwZWVkKHNwZWVkKSB7XHJcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQgfHwgNTAwO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIE1hcCBNYW5hZ2VyXHJcbiAgYWRkTWFwKG1hcCkge1xyXG4gICAgZm9yKGxldCBpID0gbWFwLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xyXG4gICAgICB0aGlzLmFkZEZyYWdtZW50KG1hcFtpXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkTWFwJywgbWFwKTtcclxuICAgIHRoaXMuY29tcHV0aW5nTWFwRW5kKCk7XHJcbiAgfVxyXG4gIGFkZEZyYWdtZW50KGZyYWdEYXRhKSB7XHJcbiAgICBsZXQgZnJhZyA9IG5ldyBEYXRhRnJhZ21lbnRDb252ZXJ0ZXIoZnJhZ0RhdGEpLmZyYWdtZW50O1xyXG4gICAgLy8gYWRkIGJsb2NrIHRvIGNlbnRlciBYIGF4aXMsIGZvciBleGFtcGxlOiByb3VuZCgoOC00KS8yKSA9PiArMiBwYWRkaW5nIHRvIGJsb2NrIFggcG9zXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZnJhZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLmFkZEJsb2NrKGZyYWdbaV0sIE1hdGgucm91bmQoKHRoaXMubWF4QXhpc1gtZnJhZy5sZW5ndGgpLzIpK2ksIHRoaXMubGFzdEluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxhc3RJbmRleCsrO1xyXG4gICAgdGhpcy5lbWl0KCdhZGRlZEZyYWdtZW50JywgZnJhZ0RhdGEpO1xyXG4gIH1cclxuICBhZGRCbG9jayhpZCwgeCwgeSkge1xyXG4gICAgaWYoaWQgPT09ICdfJykgcmV0dXJuO1xyXG5cclxuICAgIGxldCBwb3NYID0geCp0aGlzLmJsb2NrU2l6ZTtcclxuICAgIGxldCBwb3NZID0gLXkqdGhpcy5ibG9ja1NpemU7XHJcbiAgICBsZXQgYmxvY2sgPSB0aGlzLmFkZENoaWxkKG5ldyBCbG9jayh0aGlzLCBwb3NYLCBwb3NZLCB0aGlzLkJMT0NLU1tpZF0pKTtcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRCbG9jaycsIGJsb2NrKTtcclxuICB9XHJcblxyXG4gIC8vIENvbGxpc2lvbiBXaWRoIEJsb2NrXHJcbiAgZ2V0QmxvY2tGcm9tUG9zKHBvcykge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS5jb250YWluc1BvaW50KHBvcykpIHJldHVybiB0aGlzLmNoaWxkcmVuW2ldO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gTW92aW5nIE1hcFxyXG4gIHNjcm9sbERvd24oYmxvY2tzKSB7XHJcbiAgICBpZih0aGlzLmlzU3RvcCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIFNjcm9sbCBtYXAgZG93biBvbiBYIGJsb2Nrc1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eTogdGhpcy55fSkudG8oe3k6IHRoaXMueStibG9ja3MqdGhpcy5ibG9ja1NpemV9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQqYmxvY2tzO1xyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmVtaXQoJ3Njcm9sbGVkRG93bicsIGJsb2Nrcyk7XHJcbiAgICAgIHRoaXMuY2xlYXJPdXRSYW5nZUJsb2NrcygpO1xyXG4gICAgICB0aGlzLmNvbXB1dGluZ01hcEVuZCgpO1xyXG4gICAgfSk7XHJcbiAgICBtb3ZlLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIHNjcm9sbFRvcChibG9ja3MpIHtcclxuICAgIGlmKHRoaXMuaXNTdG9wKSByZXR1cm47XHJcblxyXG4gICAgLy8gU2Nyb2xsIG1hcCB0b3Agb24gWCBibG9ja3NcclxuICAgIGxldCBtb3ZlID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBtb3ZlLmZyb20oe3k6IHRoaXMueX0pLnRvKHt5OiB0aGlzLnktYmxvY2tzKnRoaXMuYmxvY2tTaXplfSk7XHJcbiAgICBtb3ZlLnRpbWUgPSB0aGlzLnNwZWVkKmJsb2NrcztcclxuICAgIG1vdmUub24oJ2VuZCcsICgpID0+IHtcclxuICAgICAgdGhpcy5lbWl0KCdzY3JvbGxlZFRvcCcsIGJsb2Nrcyk7XHJcbiAgICAgIHRoaXMuY2xlYXJPdXRSYW5nZUJsb2NrcygpO1xyXG4gICAgICB0aGlzLmNvbXB1dGluZ01hcEVuZCgpO1xyXG4gICAgfSk7XHJcbiAgICBtb3ZlLnN0YXJ0KCk7XHJcbiAgfVxyXG5cclxuICAvLyBDb21wdXRpbmcgbWFwIGVuZCAoYW10IGJsb2NrcyA8IG1heCBhbXQgYmxvY2tzKVxyXG4gIGNvbXB1dGluZ01hcEVuZCgpIHtcclxuICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoIDwgdGhpcy5tYXhBeGlzWCoodGhpcy5nYW1lLmgvdGhpcy5ibG9ja1NpemUpKjIpIHtcclxuICAgICAgdGhpcy5lbWl0KCdlbmRlZE1hcCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gY2xlYXIgb3V0IHJhbmdlIG1hcCBibG9ja3NcclxuICBjbGVhck91dFJhbmdlQmxvY2tzKCkge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS53b3JsZFRyYW5zZm9ybS50eS10aGlzLmJsb2NrU2l6ZS8yID4gdGhpcy5nYW1lLmgpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuY2hpbGRyZW5baV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2NsZWFyZWRPdXRSYW5nZUJsb2NrcycpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBNYW5hZ2VyO1xyXG4iLCIvKlxyXG4gINCa0LvQsNGB0YEg0LTQu9GPINC/0LXRgNC10LrQu9GO0YfQtdC90LjRjyDQstC40LTQuNC80L7Qs9C+INC60L7QvdGC0LXQudC90LXRgNCwICjRgNCw0LHQvtGH0LjRhSDRgdGG0LXQvSlcclxuICDQodC+0LHRi9GC0LjRjzpcclxuICAgIGFkZGVkU2NlbmVzID0+IHNjZW5lc1xyXG4gICAgYWRkZWRTY2VuZSA9PiBzY2VuZXNcclxuICAgIHJlbW92ZWRTY2VuZSA9PiBzY2VuZVxyXG4gICAgcmVzdGFydGVkU2NlbmUgPT4gc2NlbmVcclxuICAgIGRpc2FibGVkU2NlbmUgPT4gc2NlbmVcclxuICAgIGVuYWJsZWRTY2VuZSA9PiBzY2VuZXNcclxuICAgIHVwZGF0ZWQgPT4gZHRcclxuKi9cclxuXHJcbmNsYXNzIFNjZW5lc01hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgdGhpcy5zY2VuZXMgPSByZXF1aXJlKCcuLi9zY2VuZXMnKTtcclxuICAgIHRoaXMuYWN0aXZlU2NlbmUgPSBudWxsO1xyXG4gIH1cclxuICBnZXRTY2VuZShpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2NlbmVzW2lkXTtcclxuICB9XHJcblxyXG4gIC8vIGFkZGluZyBzY2VuZXNcclxuICBhZGRTY2VuZXMoc2NlbmVzKSB7XHJcbiAgICBmb3IobGV0IGlkIGluIHNjZW5lcykge1xyXG4gICAgICB0aGlzLmFkZFNjZW5lKGlkLCBzY2VuZXNbaWRdKTtcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdCgnYWRkZWRTY2VuZXMnLCBzY2VuZXMpO1xyXG4gIH1cclxuICBhZGRTY2VuZShpZCwgc2NlbmUpIHtcclxuICAgIHRoaXMuc2NlbmVzW2lkXSA9IHNjZW5lO1xyXG4gICAgdGhpcy5lbWl0KCdhZGRlZFNjZW5lJywgc2NlbmUpO1xyXG4gIH1cclxuICByZW1vdmVTY2VuZShpZCkge1xyXG4gICAgbGV0IF9zY2VuZSA9IHRoaXMuc2NlbmVzW2lkXTtcclxuICAgIHRoaXMuc2NlbmVzW2lkXSA9IG51bGw7XHJcbiAgICB0aGlzLmVtaXQoJ3JlbW92ZWRTY2VuZScsIF9zY2VuZSk7XHJcbiAgfVxyXG5cclxuICAvLyBDb250cm9sc1xyXG4gIHJlc3RhcnRTY2VuZSgpIHtcclxuICAgIHRoaXMuZW5hYmxlU2NlbmUodGhpcy5hY3RpdmVTY2VuZS5faWRTY2VuZSk7XHJcbiAgICB0aGlzLmVtaXQoJ3Jlc3RhcnRlZFNjZW5lJywgdGhpcy5hY3RpdmVTY2VuZSk7XHJcbiAgfVxyXG4gIGRpc2FibGVTY2VuZSgpIHtcclxuICAgIGxldCBzY2VuZSA9IHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5hY3RpdmVTY2VuZSk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gbnVsbDtcclxuICAgIHRoaXMuZW1pdCgnZGlzYWJsZWRTY2VuZScsIHNjZW5lKTtcclxuICB9XHJcbiAgZW5hYmxlU2NlbmUoaWQpIHtcclxuICAgIHRoaXMuZGlzYWJsZVNjZW5lKCk7XHJcblxyXG4gICAgbGV0IFNjZW5lID0gdGhpcy5nZXRTY2VuZShpZCk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gdGhpcy5hZGRDaGlsZChuZXcgU2NlbmUodGhpcy5nYW1lLCB0aGlzKSk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lLl9pZFNjZW5lID0gaWQ7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdlbmFibGVkU2NlbmUnLCB0aGlzLmFjdGl2ZVNjZW5lKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSAmJiB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZSAmJiB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZShkdCk7XHJcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZWQnLCBkdCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lc01hbmFnZXI7XHJcbiIsImNsYXNzIFNjcmVlbk1hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5NYW5hZ2VyO1xyXG4iLCJjb25zdCBBbHBoYUdyYWRpZW50RmlsdGVyID0gcmVxdWlyZSgnLi4vc2hhZGVycy9BbHBoYUdyYWRpZW50RmlsdGVyJyk7XHJcblxyXG5jb25zdCBNYXBNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvTWFwTWFuYWdlcicpO1xyXG5jb25zdCBMZXZlbE1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9MZXZlbE1hbmFnZXInKTtcclxuY29uc3QgSGlzdG9yeU1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9IaXN0b3J5TWFuYWdlcicpO1xyXG5jb25zdCBTY3JlZW5NYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvU2NyZWVuTWFuYWdlcicpO1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuLi9zdWJqZWN0cy9QbGF5ZXInKTtcclxuY29uc3QgVGhsZW4gPSByZXF1aXJlKCcuLi9zdWJqZWN0cy9UaGxlbicpO1xyXG5cclxuY2xhc3MgUGxheWdyb3VuZCBleHRlbmRzIFBJWEkucHJvamVjdGlvbi5Db250YWluZXIyZCB7XHJcbiAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgLy8gQ29uc3RhbnQgZm9yIHBvc2l0aW9uIG9iamVjdCBpbiBwcm9qZWN0aW9uXHJcbiAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBJbml0IG9iamVjdHNcclxuICAgIHRoaXMucHJvamVjdGlvbiA9IG5ldyBQSVhJLnByb2plY3Rpb24uQ29udGFpbmVyMmQoKTtcclxuICAgIHRoaXMucHJvamVjdGlvbi5wcm9qLnNldEF4aXNZKHt4OiAtdGhpcy5nYW1lLncvMis1MCwgeTogNDAwMH0sIC0xKTtcclxuICAgIHRoaXMucHJvamVjdGlvbi5maWx0ZXJzID0gW25ldyBBbHBoYUdyYWRpZW50RmlsdGVyKC4zLCAuMSldO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLnByb2plY3Rpb24pO1xyXG5cclxuICAgIHRoaXMubWFwID0gbmV3IE1hcE1hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLnByb2plY3Rpb24uYWRkQ2hpbGQodGhpcy5tYXApO1xyXG5cclxuICAgIHRoaXMubGV2ZWxzID0gbmV3IExldmVsTWFuYWdlcih0aGlzLCB0aGlzLm1hcCk7XHJcblxyXG4gICAgdGhpcy5zY3JlZW4gPSBuZXcgU2NyZWVuTWFuYWdlcih0aGlzKTtcclxuICAgIHRoaXMuaGlzdG9yeSA9IG5ldyBIaXN0b3J5TWFuYWdlcih0aGlzKTtcclxuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcih0aGlzLCB0aGlzLm1hcCk7XHJcbiAgICB0aGlzLnRobGVuID0gbmV3IFRobGVuKHRoaXMpO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLnNjcmVlbiwgdGhpcy5oaXN0b3J5LCB0aGlzLnBsYXllciwgdGhpcy50aGxlbik7XHJcblxyXG4gICAgLy8gQ29udHJvbHNcclxuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcclxuICB9XHJcbiAgX2JpbmRFdmVudHMoKSB7XHJcbiAgICB0aGlzLm9uKCdwb2ludGVyZG93bicsICgpID0+IHRoaXMucGxheWVyLmltbXVuaXR5KCkpO1xyXG4gICAgdGhpcy5vbigncG9pbnRlcm1vdmUnLCAoZSkgPT4ge1xyXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5tYXAuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLm1hcC5jaGlsZHJlbltpXTtcclxuICAgICAgICBpZihibG9jay5jb250YWluc1BvaW50KGUuZGF0YS5nbG9iYWwpKSB7XHJcbiAgICAgICAgICByZXR1cm4gYmxvY2suaGl0KCk7XHJcbiAgICAgICAgfSBlbHNlIGJsb2NrLnVuaGl0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucGxheWVyLm9uKCdkZWFkZWQnLCAoKSA9PiB0aGlzLnJlc3RhcnQoKSk7XHJcbiAgICB0aGlzLnBsYXllci5vbignY29sbGlzaW9uJywgKGJsb2NrKSA9PiB7XHJcbiAgICAgIGlmKGJsb2NrLmFjdGlvbiA9PT0gJ2hpc3RvcnknKSB0aGlzLmhpc3Rvcnkuc2hvd1RleHQodGhpcy5sZXZlbHMuZ2V0Q3VycmVudExldmVsKCkuaGlzdG9yeS5ydSwgMzAwMCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmhpc3Rvcnkub24oJ3Nob3dlbicsICgpID0+IHtcclxuICAgICAgbGV0IHR3ZWVuID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcy5wcm9qZWN0aW9uLmZpbHRlcnNbMF0pO1xyXG4gICAgICB0d2Vlbi5mcm9tKHtzdGFydEdyYWRpZW50OiAuMywgZW5kR3JhZGllbnQ6IC4xfSkudG8oe3N0YXJ0R3JhZGllbnQ6IC43LCBlbmRHcmFkaWVudDogLjV9KTtcclxuICAgICAgdHdlZW4udGltZSA9IDEwMDA7XHJcbiAgICAgIHR3ZWVuLnN0YXJ0KCk7XHJcblxyXG4gICAgICB0aGlzLm1hcC5pc1N0b3AgPSB0cnVlXHJcbiAgICB9KTtcclxuICAgIHRoaXMuaGlzdG9yeS5vbignaGlkZGVuJywgKCkgPT4ge1xyXG4gICAgICBsZXQgdHdlZW4gPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzLnByb2plY3Rpb24uZmlsdGVyc1swXSk7XHJcbiAgICAgIHR3ZWVuLmZyb20oe3N0YXJ0R3JhZGllbnQ6IC43LCBlbmRHcmFkaWVudDogLjV9KS50byh7c3RhcnRHcmFkaWVudDogLjMsIGVuZEdyYWRpZW50OiAuMX0pO1xyXG4gICAgICB0d2Vlbi50aW1lID0gMTAwMDtcclxuICAgICAgdHdlZW4uc3RhcnQoKTtcclxuXHJcbiAgICAgIHRoaXMubWFwLmlzU3RvcCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLm1hcC5zY3JvbGxEb3duKDEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5tYXAub24oJ2VuZGVkTWFwJywgKCkgPT4gdGhpcy5sZXZlbHMubmV4dEZyYWdtZW50KCkpO1xyXG4gICAgdGhpcy5tYXAub24oJ3Njcm9sbGVkRG93bicsICgpID0+IHRoaXMucGxheWVyLm1vdmluZygpKTtcclxuXHJcbiAgICB0aGlzLmxldmVscy5vbignZW5kZWRMZXZlbCcsICgpID0+IHRoaXMubGV2ZWxzLm5leHRMZXZlbCgpKTtcclxuXHJcbiAgICB0aGlzLmxldmVscy5zd2l0Y2hMZXZlbCgwKTtcclxuICAgIHRoaXMubWFwLnNjcm9sbERvd24oMSk7XHJcbiAgfVxyXG4gIHJlc3RhcnQoKSB7XHJcbiAgICB0aGlzLmdhbWUuc2NlbmVzLnJlc3RhcnRTY2VuZSgncGxheWdyb3VuZCcpO1xyXG5cclxuICAgIC8vIHRoaXMuc2NyZWVuLnNwbGFzaCgweEZGRkZGRiwgMTAwMCkudGhlbigoKSA9PiB7XHJcbiAgICAvLyAgIHRoaXMuZ2FtZS5zY2VuZXMucmVzdGFydFNjZW5lKCdwbGF5Z3JvdW5kJyk7XHJcbiAgICAvLyB9KTtcclxuICB9XHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy50aGxlbi51cGRhdGUoKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWdyb3VuZDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgJ3BsYXlncm91bmQnOiByZXF1aXJlKCcuL1BsYXlncm91bmQnKVxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2UocGFyYW1zKXtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBmbG9hdCBzdGFydEdyYWRpZW50OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgZW5kR3JhZGllbnQ7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidm9pZCBtYWluKCkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICBpZih2VGV4dHVyZUNvb3JkLnkgPiBzdGFydEdyYWRpZW50KSBnbF9GcmFnQ29sb3IgPSBjb2xvcjsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIGVsc2UgaWYodlRleHR1cmVDb29yZC55IDwgZW5kR3JhZGllbnQpIGdsX0ZyYWdDb2xvciA9IGNvbG9yKjAuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIGVsc2UgZ2xfRnJhZ0NvbG9yID0gY29sb3IqKHZUZXh0dXJlQ29vcmQueS1lbmRHcmFkaWVudCkvKHN0YXJ0R3JhZGllbnQtZW5kR3JhZGllbnQpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgXG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge31cbiAgICAgIGZvcih2YXIga2V5IGluIHBhcmFtcykge1xuICAgICAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJ7e1wiK2tleStcIn19XCIsXCJnXCIpXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShtYXRjaGVyLCBwYXJhbXNba2V5XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgIH07XG4iLCJjb25zdCBmcmFnID0gcmVxdWlyZSgnLi9hbHBoYS5mcmFnJyk7XHJcbmNvbnN0IHZlcnQgPSByZXF1aXJlKCcuLi9iYXNpYy52ZXJ0Jyk7XHJcblxyXG5jbGFzcyBBbHBoYUdyYWRpZW50RmlsdGVyIGV4dGVuZHMgUElYSS5GaWx0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXJ0R3JhZGllbnQsIGVuZEdyYWRpZW50KSB7XHJcbiAgICBzdXBlcih2ZXJ0KCksIGZyYWcoKSk7XHJcblxyXG4gICAgdGhpcy5zdGFydEdyYWRpZW50ID0gc3RhcnRHcmFkaWVudCB8fCAuNTtcclxuICAgIHRoaXMuZW5kR3JhZGllbnQgPSBlbmRHcmFkaWVudCB8fCAuMjtcclxuICB9XHJcbiAgc2V0IHN0YXJ0R3JhZGllbnQodikge1xyXG4gICAgdGhpcy51bmlmb3Jtcy5zdGFydEdyYWRpZW50ID0gdjtcclxuICB9XHJcbiAgZ2V0IHN0YXJ0R3JhZGllbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5zdGFydEdyYWRpZW50O1xyXG4gIH1cclxuICBzZXQgZW5kR3JhZGllbnQodikge1xyXG4gICAgdGhpcy51bmlmb3Jtcy5lbmRHcmFkaWVudCA9IHY7XHJcbiAgfVxyXG4gIGdldCBlbmRHcmFkaWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnVuaWZvcm1zLmVuZEdyYWRpZW50O1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBbHBoYUdyYWRpZW50RmlsdGVyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlKHBhcmFtcyl7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgeDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IHk7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBmbG9hdCByOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZvaWQgbWFpbigpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzIGdyYXkgPSB2ZWMzKDAuMywgMC41OSwgMC4xMSk7IFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBjb2wgPSBkb3QoZ2xfRnJhZ0NvbG9yLnh5eiwgZ3JheSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBkaXN0ID0gZGlzdGFuY2UodlRleHR1cmVDb29yZC54eSwgdmVjMih4LCB5KSk7IFxcblwiICtcclwiIFxcblwiICtcblwiICBnbF9GcmFnQ29sb3IueHl6ID0gbWl4KGdsX0ZyYWdDb2xvci54eXosIHZlYzMoY29sKSwgbWluKGRpc3QvciwgMS4wKS0uMik7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiBcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICAgICAgZm9yKHZhciBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcInt7XCIra2V5K1wifX1cIixcImdcIilcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKG1hdGNoZXIsIHBhcmFtc1trZXldKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgfTtcbiIsImNvbnN0IGZyYWcgPSByZXF1aXJlKCcuL2dyYXlzY2FsZS5mcmFnJyk7XHJcbmNvbnN0IHZlcnQgPSByZXF1aXJlKCcuLi9iYXNpYy52ZXJ0Jyk7XHJcblxyXG5jbGFzcyBHcmF5c2NhbGVGaWx0ZXIgZXh0ZW5kcyBQSVhJLkZpbHRlciB7XHJcbiAgY29uc3RydWN0b3IoeCwgeSwgcikge1xyXG4gICAgc3VwZXIodmVydCgpLCBmcmFnKCkpO1xyXG5cclxuICAgIHRoaXMueCA9IHggfHwgLjU7XHJcbiAgICB0aGlzLnkgPSB5IHx8IC41O1xyXG4gICAgdGhpcy5yID0gciB8fCAwLjg7XHJcbiAgfVxyXG4gIHNldCB4KHYpIHtcclxuICAgIHRoaXMudW5pZm9ybXMueCA9IHY7XHJcbiAgfVxyXG4gIGdldCB4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5pZm9ybXMueDtcclxuICB9XHJcbiAgc2V0IHkodikge1xyXG4gICAgdGhpcy51bmlmb3Jtcy55ID0gdjtcclxuICB9XHJcbiAgZ2V0IHkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy55O1xyXG4gIH1cclxuICBzZXQgcih2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLnIgPSB2O1xyXG4gIH1cclxuICBnZXQgcigpIHtcclxuICAgIHJldHVybiB0aGlzLnVuaWZvcm1zLnI7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdyYXlzY2FsZUZpbHRlcjtcclxuIiwiY29uc3QgZnJhZyA9IHJlcXVpcmUoJy4vbm9pc2VCbHVyLmZyYWcnKTtcclxuY29uc3QgdmVydCA9IHJlcXVpcmUoJy4uL2Jhc2ljLnZlcnQnKTtcclxuXHJcbmNsYXNzIE5vaXNlQmx1ckZpbHRlciBleHRlbmRzIFBJWEkuRmlsdGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKHZlcnQoKSwgZnJhZygpKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTm9pc2VCbHVyRmlsdGVyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlKHBhcmFtcyl7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cImZsb2F0IGJsdXJSYWRpdXMgPSAwLjAwMTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2ZWMyIHJhbmRvbSh2ZWMyIHApIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJcdHAgPSBmcmFjdChwICogdmVjMig0NDMuODk3LCA0NDEuNDIzKSk7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIHAgKz0gZG90KHAsIHAueXgrMTkuOTEpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICByZXR1cm4gZnJhY3QoKHAueHgrcC55eCkqcC54eSk7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZvaWQgbWFpbigpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzIgciA9IHJhbmRvbSh2VGV4dHVyZUNvb3JkKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHIueCAqPSA2LjI4MzA1MzA4OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMiBjciA9IHZlYzIoc2luKHIueCksY29zKHIueCkpKnNxcnQoci55KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJcdGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCtjcipibHVyUmFkaXVzKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiIFxuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9XG4gICAgICBmb3IodmFyIGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgdmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFwie3tcIitrZXkrXCJ9fVwiLFwiZ1wiKVxuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UobWF0Y2hlciwgcGFyYW1zW2tleV0pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcGxhdGVcbiAgICB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShwYXJhbXMpe1xuICAgICAgdmFyIHRlbXBsYXRlID0gXCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247IFxcblwiICtcclwiIFxcblwiICtcblwiYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2b2lkIG1haW4odm9pZCkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiBcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICAgICAgZm9yKHZhciBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcInt7XCIra2V5K1wifX1cIixcImdcIilcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKG1hdGNoZXIsIHBhcmFtc1trZXldKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgfTtcbiIsIi8qXHJcbiAg0JrQu9Cw0YHRgSDQkdC70L7QutCwLCDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LTQu9GPINGC0LDQudC70L7QstC+0LPQviDQtNCy0LjQttC60LBcclxuICDQodC+0LHRi9GC0LjRjzpcclxuICAgIGFjdGl2YXRlZFxyXG4gICAgZGVhY3RpdmF0ZWRcclxuICAgIGhpdGVkXHJcbiovXHJcblxyXG5jbGFzcyBCbG9jayBleHRlbmRzIFBJWEkucHJvamVjdGlvbi5TcHJpdGUyZCB7XHJcbiAgY29uc3RydWN0b3IobWFwLCB4LCB5LCBwYXJhbXM9e30pIHtcclxuICAgIHN1cGVyKFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUocGFyYW1zLmltYWdlIHx8IHBhcmFtcy5hY3RpdmF0aW9uSW1hZ2UpKTtcclxuXHJcbiAgICB0aGlzLm1hcCA9IG1hcDtcclxuICAgIHRoaXMuZ2FtZSA9IHRoaXMubWFwLmdhbWU7XHJcblxyXG4gICAgdGhpcy5zY29yZSA9IHBhcmFtcy5zY29yZTtcclxuICAgIHRoaXMuYWN0aXZhdGlvbiA9IHBhcmFtcy5hY3RpdmF0aW9uIHx8IG51bGw7XHJcbiAgICB0aGlzLmRlYWN0aXZhdGlvblRleHR1cmUgPSBwYXJhbXMuaW1hZ2UgPyBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKHBhcmFtcy5pbWFnZSkgOiBudWxsO1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uVGV4dHVyZSA9IHBhcmFtcy5hY3RpdmF0aW9uSW1hZ2UgPyBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKHBhcmFtcy5hY3RpdmF0aW9uSW1hZ2UpIDogbnVsbDtcclxuICAgIHRoaXMuaXNBY3RpdmUgPSBwYXJhbXMuYWN0aXZlO1xyXG4gICAgdGhpcy5wbGF5ZXJEaXIgPSBwYXJhbXMucGxheWVyRGlyIHx8IG51bGw7XHJcbiAgICB0aGlzLmFjdGlvbiA9IHBhcmFtcy5hY3Rpb24gfHwgbnVsbDtcclxuXHJcbiAgICB0aGlzLmFuY2hvci5zZXQoLjUpO1xyXG4gICAgdGhpcy53aWR0aCA9IG1hcC5ibG9ja1NpemUrMTtcclxuICAgIHRoaXMuaGVpZ2h0ID0gbWFwLmJsb2NrU2l6ZSsxO1xyXG4gICAgdGhpcy54ID0geCttYXAuYmxvY2tTaXplLzIrLjU7XHJcbiAgICB0aGlzLnkgPSB5K21hcC5ibG9ja1NpemUvMisuNTtcclxuXHJcbiAgICB0aGlzLmpvbHRpbmcgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIHRoaXMuam9sdGluZy5mcm9tKHtyb3RhdGlvbjogLS4xfSkudG8oe3JvdGF0aW9uOiAuMX0pO1xyXG4gICAgdGhpcy5qb2x0aW5nLnRpbWUgPSAyMDA7XHJcbiAgICB0aGlzLmpvbHRpbmcucGluZ1BvbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5qb2x0aW5nLnJlcGVhdCA9IEluZmluaXR5O1xyXG5cclxuICAgIHRoaXMuZ2xvdyA9IG5ldyBQSVhJLmZpbHRlcnMuQWxwaGFGaWx0ZXIoKTtcclxuICAgIHRoaXMuZ2xvdy5lbmFibGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLmZpbHRlcnMgPSBbdGhpcy5nbG93XTtcclxuICB9XHJcbiAgYWN0aXZhdGUoKSB7XHJcbiAgICBsZXQgYWN0aXZhdGluZyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpXHJcbiAgICAgIC5mcm9tKHt3aWR0aDogdGhpcy53aWR0aCozLzQsIGhlaWdodDogdGhpcy5oZWlnaHQqMy80fSlcclxuICAgICAgLnRvKHt3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCwgcm90YXRpb246IDB9KTtcclxuICAgIGFjdGl2YXRpbmcudGltZSA9IDUwMDtcclxuICAgIGFjdGl2YXRpbmcuZWFzaW5nID0gUElYSS50d2Vlbi5FYXNpbmcub3V0Qm91bmNlKCk7XHJcbiAgICBhY3RpdmF0aW5nLnN0YXJ0KCk7XHJcblxyXG4gICAgdGhpcy5nbG93LmFscGhhID0gMS4wO1xyXG4gICAgdGhpcy5qb2x0aW5nLnN0b3AoKTtcclxuICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG5cclxuICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uVGV4dHVyZSkgdGhpcy50ZXh0dXJlID0gdGhpcy5hY3RpdmF0aW9uVGV4dHVyZTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ2FjdGl2YXRlZCcpO1xyXG4gIH1cclxuICBkZWFjdGl2YXRlKCkge1xyXG4gICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgaWYodGhpcy5kZWFjdGl2YXRpb25UZXh0dXJlKSB0aGlzLnRleHR1cmUgPSB0aGlzLmRlYWN0aXZhdGlvblRleHR1cmU7XHJcbiAgICB0aGlzLmVtaXQoJ2RlYWN0aXZhdGVkJyk7XHJcbiAgfVxyXG4gIHVuaGl0KCkge1xyXG4gICAgdGhpcy5nbG93LmVuYWJsZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuam9sdGluZy5zdG9wKCk7XHJcbiAgICB0aGlzLnJvdGF0aW9uID0gMDtcclxuICB9XHJcbiAgaGl0KCkge1xyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uID09PSBudWxsIHx8IHRoaXMuaXNBY3RpdmUpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmpvbHRpbmcuc3RhcnQoKTtcclxuICAgIHRoaXMuZ2xvdy5lbmFibGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuZ2xvdy5hbHBoYSA9IDUuMDtcclxuXHJcbiAgICBpZih0aGlzLmFjdGl2YXRpb24pIHRoaXMuYWN0aXZhdGlvbi0tO1xyXG4gICAgZWxzZSB0aGlzLmFjdGl2YXRlKCk7XHJcbiAgICB0aGlzLmVtaXQoJ2hpdGVkJyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCIvKlxyXG4gINCa0LvQsNGB0YEgUGxheWVyLCDQstC30LDQuNC80L7QtNC10LnRgdGC0LLRg9C10YIg0YEgTWFwTWFuYWdlclxyXG4gINCh0L7QsdGL0YLQuNGPXHJcbiAgICBjb2xsaXNpb24gPT4gY29sbGlzaW9uIGJsb2NrXHJcbiAgICBtb3ZlZFxyXG4gICAgZGVhZGVkXHJcblxyXG4gICAgYWN0aW9uSW1tdW5pdHlcclxuICAgIGFjdGlvblRvcFxyXG4gICAgYWN0aW9uTGVmdFxyXG4gICAgYWN0aW9uUmlnaHRcclxuKi9cclxuXHJcbmNsYXNzIFBsYXllciBleHRlbmRzIFBJWEkuU3ByaXRlIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSwgbWFwKSB7XHJcbiAgICBzdXBlcihQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdwbGF5ZXInKSk7XHJcblxyXG4gICAgdGhpcy5nYW1lID0gc2NlbmUuZ2FtZTtcclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgIHRoaXMubWFwID0gbWFwO1xyXG5cclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSwgMSk7XHJcbiAgICB0aGlzLnNjYWxlLnNldCguNyk7XHJcbiAgICB0aGlzLnggPSB0aGlzLmdhbWUudy8yKzU7XHJcbiAgICB0aGlzLnkgPSB0aGlzLmdhbWUuaC10aGlzLm1hcC5ibG9ja1NpemUqMjtcclxuXHJcbiAgICB0aGlzLndhbGtpbmcgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIHRoaXMud2Fsa2luZy5mcm9tKHt5OiB0aGlzLnl9KS50byh7eTogdGhpcy55LTE1fSk7XHJcbiAgICB0aGlzLndhbGtpbmcudGltZSA9IDgwMDtcclxuICAgIHRoaXMud2Fsa2luZy5sb29wID0gdHJ1ZTtcclxuICAgIHRoaXMud2Fsa2luZy5waW5nUG9uZyA9IHRydWU7XHJcbiAgICB0aGlzLndhbGtpbmcuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gbnVsbDtcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLm1hcC5zcGVlZCB8fCA1MDA7XHJcbiAgICB0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuSU1NVU5JVFlfQkxPQ0tTID0gMjtcclxuICAgIHRoaXMuaW1tdW5pdHlDb3VudCA9IDU7XHJcbiAgICB0aGlzLmlzSW1tdW5pdHkgPSBmYWxzZTtcclxuICB9XHJcbiAgbW92aW5nKCkge1xyXG4gICAgaWYodGhpcy5pc0RlYWQgfHwgdGhpcy5pc0ltbXVuaXR5KSByZXR1cm47XHJcblxyXG4gICAgbGV0IGN1ciA9IHRoaXMubWFwLmdldEJsb2NrRnJvbVBvcyh7eDogdGhpcy54LCB5OiB0aGlzLnl9KTtcclxuICAgIGlmKGN1ciAmJiBjdXIuaXNBY3RpdmUpIHtcclxuICAgICAgdGhpcy5lbWl0KCdjb2xsaXNpb24nLCBjdXIpO1xyXG5cclxuICAgICAgaWYoY3VyLnBsYXllckRpciA9PT0gJ3RvcCcpIHJldHVybiB0aGlzLnRvcCgpO1xyXG4gICAgICBpZihjdXIucGxheWVyRGlyID09PSAnbGVmdCcpIHJldHVybiB0aGlzLmxlZnQoKTtcclxuICAgICAgaWYoY3VyLnBsYXllckRpciA9PT0gJ3JpZ2h0JykgcmV0dXJuIHRoaXMucmlnaHQoKTtcclxuXHJcbiAgICAgIC8vY2hlY2sgdG9wXHJcbiAgICAgIGxldCB0b3AgPSB0aGlzLm1hcC5nZXRCbG9ja0Zyb21Qb3Moe3g6IHRoaXMueCwgeTogdGhpcy55LXRoaXMubWFwLmJsb2NrU2l6ZX0pO1xyXG4gICAgICBpZih0b3AgJiYgdG9wLmlzQWN0aXZlICYmIHRoaXMubGFzdE1vdmUgIT09ICdib3R0b20nKSByZXR1cm4gdGhpcy50b3AoKTtcclxuXHJcbiAgICAgIC8vIGNoZWNrIGxlZnRcclxuICAgICAgbGV0IGxlZnQgPSB0aGlzLm1hcC5nZXRCbG9ja0Zyb21Qb3Moe3g6IHRoaXMueC10aGlzLm1hcC5ibG9ja1NpemUsIHk6IHRoaXMueX0pO1xyXG4gICAgICBpZihsZWZ0ICYmIGxlZnQuaXNBY3RpdmUgJiYgdGhpcy5sYXN0TW92ZSAhPT0gJ3JpZ2h0JykgcmV0dXJuIHRoaXMubGVmdCgpO1xyXG5cclxuICAgICAgLy8gY2hlY2sgcmlndGhcclxuICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHt4OiB0aGlzLngrdGhpcy5tYXAuYmxvY2tTaXplLCB5OiB0aGlzLnl9KTtcclxuICAgICAgaWYocmlnaHQgJiYgcmlnaHQuaXNBY3RpdmUgJiYgdGhpcy5sYXN0TW92ZSAhPT0gJ2xlZnQnKSByZXR1cm4gdGhpcy5yaWdodCgpO1xyXG5cclxuICAgICAgLy8gb3IgZGllXHJcbiAgICAgIHRoaXMudG9wKCk7XHJcbiAgICB9IGVsc2UgdGhpcy5kZWFkKCk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdtb3ZlZCcpO1xyXG4gIH1cclxuICBkZWFkKCkge1xyXG4gICAgdGhpcy53YWxraW5nLnN0b3AoKTtcclxuICAgIHRoaXMuaXNEZWFkID0gdHJ1ZTtcclxuXHJcbiAgICBsZXQgZGVhZCA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMuc2NhbGUpO1xyXG4gICAgZGVhZC5mcm9tKHRoaXMuc2NhbGUpLnRvKHt4OiAwLCB5OiAwfSk7XHJcbiAgICBkZWFkLnRpbWUgPSAyMDA7XHJcbiAgICBkZWFkLnN0YXJ0KCk7XHJcbiAgICBkZWFkLm9uKCdlbmQnLCAoKSA9PiB0aGlzLmVtaXQoJ2RlYWRlZCcpKTtcclxuICB9XHJcbiAgaW1tdW5pdHkoKSB7XHJcbiAgICBpZighdGhpcy5pbW11bml0eUNvdW50KSByZXR1cm47XHJcblxyXG4gICAgbGV0IGltbXVuaXR5ID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBpbW11bml0eS5mcm9tKHthbHBoYTogLjV9KS50byh7YWxwaGE6IDF9KTtcclxuICAgIGltbXVuaXR5LnRpbWUgPSB0aGlzLnNwZWVkKnRoaXMuSU1NVU5JVFlfQkxPQ0tTO1xyXG4gICAgaW1tdW5pdHkuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLm1hcC5zY3JvbGxEb3duKHRoaXMuSU1NVU5JVFlfQkxPQ0tTKTtcclxuICAgIGltbXVuaXR5Lm9uKCdlbmQnLCAoKSA9PiB0aGlzLmlzSW1tdW5pdHkgPSBmYWxzZSk7XHJcbiAgICB0aGlzLmlzSW1tdW5pdHkgPSB0cnVlO1xyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICd0b3AnO1xyXG4gICAgdGhpcy5pbW11bml0eUNvdW50LS07XHJcblxyXG4gICAgdGhpcy5lbWl0KCdhY3Rpb25JbW11bml0eScpO1xyXG4gIH1cclxuICB0b3AoKSB7XHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gJ3RvcCc7XHJcbiAgICB0aGlzLm1hcC5zY3JvbGxEb3duKDEpO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uVG9wJyk7XHJcbiAgfVxyXG4gIGxlZnQoKSB7XHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gJ2xlZnQnO1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eDogdGhpcy54fSkudG8oe3g6IHRoaXMueC10aGlzLm1hcC5ibG9ja1NpemUtMjB9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQvMjtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuXHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB0aGlzLm1vdmluZygpKTtcclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uTGVmdCcpO1xyXG4gIH1cclxuICByaWdodCgpIHtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAncmlnaHQnO1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eDogdGhpcy54fSkudG8oe3g6IHRoaXMueCt0aGlzLm1hcC5ibG9ja1NpemUrMjB9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQvMjtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuXHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB0aGlzLm1vdmluZygpKTtcclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uUmlnaHQnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xyXG4iLCJjbGFzcyBTcGhlcmUgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IFBJWEkucGFydGljbGVzLkVtaXR0ZXIodGhpcywgW1BJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ3BhcnRpY2xlJyldLCByZXF1aXJlKCcuL2VtaXR0ZXIuanNvbicpKTtcclxuICB9XHJcbiAgdXBkYXRlKGR0KSB7XHJcbiAgICB0aGlzLmVtaXR0ZXIudXBkYXRlKGR0Ki4wMSk7XHJcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCA9IHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwaGVyZTtcclxuIiwiY2xhc3MgVGhsZW4gZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5nYW1lID0gc2NlbmUuZ2FtZTtcclxuXHJcbiAgICB0aGlzLlBBRERJTiA9IDUwO1xyXG5cclxuICAgIHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ2Rpc3BsYWNlbWVudCcpKTtcclxuICAgIHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlLnRleHR1cmUuYmFzZVRleHR1cmUud3JhcE1vZGUgPSBQSVhJLldSQVBfTU9ERVMuUkVQRUFUO1xyXG4gICAgc2NlbmUuYWRkQ2hpbGQodGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUpO1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRGaWx0ZXIgPSBuZXcgUElYSS5maWx0ZXJzLkRpc3BsYWNlbWVudEZpbHRlcih0aGlzLmRpc3BsYWNlbWVudFNwcml0ZSk7XHJcblxyXG4gICAgdGhpcy50aGxlbiA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKCd0aGxlbicpKTtcclxuICAgIHRoaXMudGhsZW4ud2lkdGggPSB0aGlzLmdhbWUudyt0aGlzLlBBRERJTjtcclxuICAgIHRoaXMudGhsZW4ueSA9IHRoaXMuZ2FtZS5oLXRoaXMudGhsZW4uaGVpZ2h0K3RoaXMuUEFERElOO1xyXG4gICAgdGhpcy50aGxlbi54ID0gLXRoaXMuUEFERElOLzI7XHJcbiAgICB0aGlzLnRobGVuLmZpbHRlcnMgPSBbdGhpcy5kaXNwbGFjZW1lbnRGaWx0ZXJdO1xyXG4gICAgc2NlbmUuYWRkQ2hpbGQodGhpcy50aGxlbik7XHJcbiAgfVxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlLnggKz0gNTtcclxuICAgIHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlLnkgKz0gNTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGhsZW47XHJcbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJhbHBoYVwiOiB7XG5cdFx0XCJzdGFydFwiOiAwLjQ4LFxuXHRcdFwiZW5kXCI6IDBcblx0fSxcblx0XCJzY2FsZVwiOiB7XG5cdFx0XCJzdGFydFwiOiAwLjUsXG5cdFx0XCJlbmRcIjogMC41LFxuXHRcdFwibWluaW11bVNjYWxlTXVsdGlwbGllclwiOiAwLjA1XG5cdH0sXG5cdFwiY29sb3JcIjoge1xuXHRcdFwic3RhcnRcIjogXCIjZmZmZmZmXCIsXG5cdFx0XCJlbmRcIjogXCIjZmZmZmZmXCJcblx0fSxcblx0XCJzcGVlZFwiOiB7XG5cdFx0XCJzdGFydFwiOiA5MCxcblx0XHRcImVuZFwiOiAwLFxuXHRcdFwibWluaW11bVNwZWVkTXVsdGlwbGllclwiOiAxXG5cdH0sXG5cdFwibWF4U3BlZWRcIjogMCxcblx0XCJzdGFydFJvdGF0aW9uXCI6IHtcblx0XHRcIm1pblwiOiAwLFxuXHRcdFwibWF4XCI6IDM2MFxuXHR9LFxuXHRcIm5vUm90YXRpb25cIjogZmFsc2UsXG5cdFwicm90YXRpb25TcGVlZFwiOiB7XG5cdFx0XCJtaW5cIjogMCxcblx0XHRcIm1heFwiOiAwXG5cdH0sXG5cdFwibGlmZXRpbWVcIjoge1xuXHRcdFwibWluXCI6IDAuMixcblx0XHRcIm1heFwiOiAxXG5cdH0sXG5cdFwiYmxlbmRNb2RlXCI6IFwiYWRkXCIsXG5cdFwiZnJlcXVlbmN5XCI6IDAuMDAxLFxuXHRcImVtaXR0ZXJMaWZldGltZVwiOiAtMSxcblx0XCJtYXhQYXJ0aWNsZXNcIjogNTAwLFxuXHRcInBvc1wiOiB7XG5cdFx0XCJ4XCI6IDAsXG5cdFx0XCJ5XCI6IDBcblx0fSxcblx0XCJhZGRBdEJhY2tcIjogZmFsc2UsXG5cdFwic3Bhd25UeXBlXCI6IFwicmVjdFwiLFxuXHRcInNwYXduUmVjdFwiOiB7XG5cdFx0XCJ4XCI6IDAsXG5cdFx0XCJ5XCI6IDAsXG5cdFx0XCJ3XCI6IDAsXG5cdFx0XCJoXCI6IDBcblx0fVxufVxuIiwiLypcclxuVGhpcyB1dGlsIGNsYXNzIGZvciBjb252ZXJ0ZWQgZGF0YSBmcm9tIGZyYWdtZW50cy5qc29uXHJcbm9iamVjdCB0byBzaW1wbGUgbWFwIGFycmF5LCBmb3IgZXhhbXBsZTogWydBJywgJ0EnLCAnQScsICdBJ11cclxuKi9cclxuXHJcbmNsYXNzIERhdGFGcmFnbWVudENvbnZlcnRlciB7XHJcbiAgY29uc3RydWN0b3IoZGF0YSkge1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMuaW5wdXRNYXAgPSBkYXRhLm1hcDtcclxuICAgIHRoaXMuZnJhZ21lbnQgPSBbXTtcclxuXHJcbiAgICAvLyBPUEVSQVRPUlNcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBkYXRhLm1hcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZih+fmRhdGEubWFwW2ldLmluZGV4T2YoJ3wnKSkgdGhpcy5jYXNlT3BlcmF0b3IoZGF0YS5tYXBbaV0sIGkpO1xyXG4gICAgICBlbHNlIHRoaXMuZnJhZ21lbnRbaV0gPSBkYXRhLm1hcFtpXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNRVRIT0RTXHJcbiAgICBkYXRhLnRyaW0gJiYgdGhpcy5yYW5kb21UcmltKGRhdGEudHJpbSk7XHJcbiAgICBkYXRhLmFwcGVuZCAmJiB0aGlzLnJhbmRvbUFwcGVuZChkYXRhLmFwcGVuZCk7XHJcbiAgICBkYXRhLnNodWZmbGUgJiYgdGhpcy5zaHVmZmxlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBPUEVSQVRPUlNcclxuICAvLyBDYXNlIG9wZXJhdG9yOiAnQXxCfEN8RCcgPT4gQyBhbmQgZXRjLi4uXHJcbiAgY2FzZU9wZXJhdG9yKHN0ciwgaSkge1xyXG4gICAgbGV0IGlkcyA9IHN0ci5zcGxpdCgnfCcpO1xyXG4gICAgdGhpcy5mcmFnbWVudFtpXSA9IGlkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqaWRzLmxlbmd0aCldO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyBNRVRIT0RTXHJcbiAgLy8gVHJpbW1pbmcgYXJyYXkgaW4gcmFuZ2UgMC4ucmFuZChtaW4sIGxlbmd0aClcclxuICByYW5kb21UcmltKG1pbikge1xyXG4gICAgdGhpcy5mcmFnbWVudC5sZW5ndGggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodGhpcy5mcmFnbWVudC5sZW5ndGgrMSAtIG1pbikgKyBtaW4pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIC8vIFNodWZmbGUgYXJyYXkgWzEsMiwzXSA9PiBbMiwxLDNdIGFuZCBldGMuLi5cclxuICBzaHVmZmxlKCkge1xyXG4gICAgdGhpcy5mcmFnbWVudC5zb3J0KChhLCBiKSA9PiBNYXRoLnJhbmRvbSgpIDwgLjUgPyAtMSA6IDEpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIC8vIEFkZHMgYSBibG9jayB0byB0aGUgcmFuZG9tIGxvY2F0aW9uIG9mIHRoZSBhcnJheTogW0EsQSxBXSA9PiBbQixBLEFdIGFuZCBldGMuLi5cclxuICByYW5kb21BcHBlbmQoaWQpIHtcclxuICAgIHRoaXMuZnJhZ21lbnRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnRoaXMuZnJhZ21lbnQubGVuZ3RoKV0gPSBpZDtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXRhRnJhZ21lbnRDb252ZXJ0ZXI7XHJcbiJdfQ==
