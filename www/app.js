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
// managers
const ScenesManager = require('./managers/ScenesManager');
const SplashManager = require('./managers/SplashManager');
const DebuggerManager = require('./managers/DebuggerManager');
// objects
const Sphere = require('./subjects/Sphere');

// filters
const GrayscaleFilter = require('./filters/GrayscaleFilter');
const NoiseBlurFilter = require('./filters/NoiseBlurFilter');
const CloudsFilter = require('./filters/CloudsFilter');


class Game extends PIXI.Application {
  constructor() {
    super();

    this.lang = 'ru';
    this.w = 1920;
    this.h = 880;

    this.stage.interactive = true;
    this.stage.cursor = 'none';

    this.scenes = new ScenesManager(this);
    this.stage.addChild(this.scenes);

    this.grayscale = new GrayscaleFilter();
    this.noiseBlur = new NoiseBlurFilter();
    this.stage.filters = [this.grayscale, this.noiseBlur];

    this.mouse = new Sphere();
    this.stage.addChild(this.mouse);

    this.splash = new SplashManager(this);
    this.stage.addChild(this.splash);

    this.debug = new DebuggerManager(this);
    this.stage.addChild(this.debug);

    this._bindEvents();
    this._initTicker();
    this.resize();

    this.splash.show(0xECEEFF, 10, 1000);
  }
  _bindEvents() {
    window.addEventListener("resize", this.resize.bind(this));

    this.stage.on('pointermove', (e) => {
      this.mouse.setPos({x: e.data.global.x/this.scale, y: e.data.global.y/this.scale});
      this.grayscale.x = e.data.global.x/this.w/this.scale;
      this.grayscale.y = e.data.global.y/this.h/this.scale;
    });
    this.stage.on('pointerup', (e) => {
      console.log(e.data.global.x, e.data.global.y)
      console.log(this.mouse.emitter.spawnPos.x, this.mouse.emitter.spawnPos.y);
    });
  }
  _initTicker() {
    this.ticker.add((dt) => {
      PIXI.tweenManager.update();
      this.scenes.update(dt);
      this.mouse.update(dt);
      this.debug.update(dt);
    });
  }
  resize() {
    this.scale = window.innerWidth/this.w;
    this.renderer.resize(window.innerWidth, this.h*this.scale);
    this.view.style.marginTop = window.innerHeight/2-this.h*this.scale/2 + 'px';
    this.stage.scale.set(this.scale);
  }
}

module.exports = Game;

},{"./filters/CloudsFilter":38,"./filters/GrayscaleFilter":40,"./filters/NoiseBlurFilter":41,"./managers/DebuggerManager":45,"./managers/ScenesManager":48,"./managers/SplashManager":49,"./subjects/Sphere":56}],31:[function(require,module,exports){
class Loader {
  constructor(bannerUrl, onLoaded) {
    this.bannerUrl = bannerUrl;
    this.onLoaded = onLoaded;

    this.banner = document.createElement('img');
    this.banner.src = bannerUrl;
    this.banner.style.position = 'absolute';
    this.banner.style.top = (window.innerHeight/2-100) + 'px';
    this.banner.style.left = (window.innerWidth/2-256) + 'px';
    document.body.appendChild(this.banner);

    this.showBanner();
    this._loadResources();
  }
  showBanner() {
    this.banner.style.display = 'block';
  }
  hideBanner() {
    this.banner.style.display = 'none';
    this.onLoaded && this.onLoaded();
  }
  _loadResources() {
    PIXI.loader
      .add('sun', 'assets/menu/sun.png')
      .add('sky', 'assets/menu/sky.png')
      .add('mount', 'assets/menu/mount.png')
      .add('cloud', 'assets/menu/cloud.png')

      .add('bg', 'assets/bg.png')
      .add('thlen', 'assets/thlen.png')

      .add('player', 'assets/spritesheets/player.json')
      .add('blocks', 'assets/spritesheets/blocks.json')

      .add('displacement', 'assets/filters/displacement.png')
      .add('noise', 'assets/filters/noise_grayscale.png')
      .add('particle', 'assets/filters/particle.png')

      .add('history_family', 'assets/history/family.png')
      .add('music', 'assets/sounds/music.mp3')
      .load(() => this._loadFonts(() => this.hideBanner()));
  }
  _loadFonts(cb) {
    WebFont.load({
      google: {
        families: ['Amatic SC']
      },
      custom: {
        families: ['Opificio Bold'],
        urls: ['assets/fonts/fonts.css']
      },
      timeout: 1000,
      active: cb
    });
  }
}

module.exports = Loader;

},{}],32:[function(require,module,exports){
module.exports={ "columns":3,
 "image":"..\/..\/www\/assets\/spritesheets\/blocks.png",
 "imageheight":505,
 "imagewidth":504,
 "margin":0,
 "name":"blocks",
 "spacing":0,
 "terrains":[
        {
         "name":"\u041d\u043e\u0432\u044b\u0439 \u0443\u0447\u0430\u0441\u0442\u043e\u043a",
         "tile":0
        }],
 "tilecount":9,
 "tileheight":150,
 "tileproperties":
    {
     "0":
        {
         "activatedTexture":"blockActivated",
         "activation":8,
         "active":false,
         "deactivatedTexture":"blockDeactivated",
         "score":1
        },
     "1":
        {
         "activatedTexture":"block3Activated",
         "active":true,
         "deactivatedTexture":"",
         "score":1
        },
     "3":
        {
         "activatedTexture":"",
         "active":false,
         "deactivatedTexture":"block2Deactivated",
         "score":0
        },
     "4":
        {
         "activatedTexture":"block4Activated",
         "activation":20,
         "active":false,
         "deactivatedTexture":"block4Deactivated",
         "score":1
        },
     "6":
        {
         "activatedTexture":"blockActivated",
         "activation":0,
         "active":true,
         "deactivatedTexture":"blockDeactivated",
         "score":1
        },
     "7":
        {
         "activatedTexture":"block4Activated",
         "activation":0,
         "active":true,
         "deactivatedTexture":"block4Deactivated",
         "score":1
        }
    },
 "tilepropertytypes":
    {
     "0":
        {
         "activatedTexture":"string",
         "activation":"int",
         "active":"bool",
         "deactivatedTexture":"string",
         "score":"int"
        },
     "1":
        {
         "activatedTexture":"string",
         "active":"bool",
         "deactivatedTexture":"string",
         "score":"int"
        },
     "3":
        {
         "activatedTexture":"string",
         "active":"bool",
         "deactivatedTexture":"string",
         "score":"int"
        },
     "4":
        {
         "activatedTexture":"string",
         "activation":"int",
         "active":"bool",
         "deactivatedTexture":"string",
         "score":"int"
        },
     "6":
        {
         "activatedTexture":"string",
         "activation":"int",
         "active":"bool",
         "deactivatedTexture":"string",
         "score":"int"
        },
     "7":
        {
         "activatedTexture":"string",
         "activation":"int",
         "active":"bool",
         "deactivatedTexture":"string",
         "score":"int"
        }
    },
 "tilewidth":150,
 "type":"tileset"
}
},{}],33:[function(require,module,exports){
module.exports={
  "0": {
    "text": {
      "ru": "Тлен идет за тобой по пятам. \n Отступись и он тебя поглатит... \n Но не стоит отчаиваться, ведь музыка всегда с тобой."
    },
    "time": 6000,
    "image": "history_family"
  },
  "1": {
    "text": {
      "ru": "Тлен не щадит никого. Летучие змеи падут на землю и погрузятся в рутину бытия..."
    },
    "time": 6000,
    "image": "history_family"
  },
  "2": {
    "text": {
      "ru": "И тогда он понес свечу через чужие земли освобождая летучих змей и свой народ..."
    },
    "time": 6000,
    "image": "history_family"
  },
  "3": {
    "text": {
      "ru": "Продолжение следует..."
    },
    "time": 6000,
    "image": "history_family"
  }
}

},{}],34:[function(require,module,exports){
module.exports={ "height":100,
 "layers":[
        {
         "data":[7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 7, 1, 1, 7, 7, 7, 7, 7, 1, 1, 0, 1, 1, 1, 7, 7, 7, 7, 7, 1, 0, 0, 1, 1, 1, 1, 7, 7, 7, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 5, 0, 0, 1, 0, 0, 1, 0, 0, 4, 4, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 1, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 0, 0],
         "height":100,
         "name":"map",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":100,
         "name":"triggers",
         "opacity":0.330000013113022,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }],
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.0.3",
 "tileheight":150,
 "tilesets":[
        {
         "firstgid":1,
         "source":"blocks.json"
        }],
 "tilewidth":150,
 "type":"map",
 "version":1,
 "width":11
}
},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
const frag = require('./alpha.frag');
const vert = require('../basic.vert');

class AlphaGradientFilter extends PIXI.Filter {
  constructor(startGradient, endGradient) {
    super(vert(), frag());

    this.startGradient = startGradient || .5;
    this.endGradient = endGradient || .2;
  }
  set startGradient(v) {
    this.uniforms.startGradient = v;
  }
  get startGradient() {
    return this.uniforms.startGradient;
  }
  set endGradient(v) {
    this.uniforms.endGradient = v;
  }
  get endGradient() {
    return this.uniforms.endGradient;
  }
}

module.exports = AlphaGradientFilter;

},{"../basic.vert":43,"./alpha.frag":35}],37:[function(require,module,exports){
module.exports = function parse(params){
      var template = "precision mediump float; \n" +" \n" +
" \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
" \n" +" \n" +
"uniform sampler2D uSampler; \n" +" \n" +
"uniform sampler2D noiseTexture; \n" +" \n" +
"uniform float iTime; \n" +" \n" +
" \n" +" \n" +
"//SETTINGS// \n" +" \n" +
"const float timeScale = 10.0; \n" +" \n" +
"const float cloudScale = 1.5; \n" +" \n" +
"const float skyCover = 0.6; //overwritten by mouse x drag \n" +" \n" +
"const float softness = 0.2; \n" +" \n" +
"const float brightness = 1.0; \n" +" \n" +
"const int noiseOctaves = 8; \n" +" \n" +
"const float curlStrain = 3.0; \n" +" \n" +
"//SETTINGS// \n" +" \n" +
" \n" +" \n" +
"float saturate(float num) { \n" +" \n" +
"    return clamp(num, 0.0, 1.0); \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"float noise(vec2 uv) { \n" +" \n" +
"    return texture2D(noiseTexture, uv).r; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"vec2 rotate(vec2 uv) { \n" +" \n" +
"    uv = uv + noise(uv*0.2)*0.005; \n" +" \n" +
"    float rot = curlStrain; \n" +" \n" +
"    float sinRot=sin(rot); \n" +" \n" +
"    float cosRot=cos(rot); \n" +" \n" +
"    mat2 rotMat = mat2(cosRot,-sinRot,sinRot,cosRot); \n" +" \n" +
"    return uv * rotMat; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"float fbm (vec2 uv) { \n" +" \n" +
"    float rot = 1.57; \n" +" \n" +
"    float sinRot=sin(rot); \n" +" \n" +
"    float cosRot=cos(rot); \n" +" \n" +
"    float f = 0.0; \n" +" \n" +
"    float total = 0.0; \n" +" \n" +
"    float mul = 0.5; \n" +" \n" +
"    mat2 rotMat = mat2(cosRot,-sinRot,sinRot,cosRot); \n" +" \n" +
" \n" +" \n" +
"    for(int i = 0; i < noiseOctaves; i++) { \n" +" \n" +
"        f += noise(uv+iTime*0.00015*timeScale*(1.0-mul))*mul; \n" +" \n" +
"        total += mul; \n" +" \n" +
"        uv *= 3.0; \n" +" \n" +
"        uv=rotate(uv); \n" +" \n" +
"        mul *= 0.5; \n" +" \n" +
"    } \n" +" \n" +
"    return f/total; \n" +" \n" +
"} \n" +" \n" +
" \n" +" \n" +
"void main() { \n" +" \n" +
"  vec2 uv = vTextureCoord.xy/(40000.0*cloudScale); \n" +" \n" +
" \n" +" \n" +
"  float cover = 0.5; \n" +" \n" +
"  float bright = brightness*(1.8-cover); \n" +" \n" +
" \n" +" \n" +
"  float color1 = fbm(vTextureCoord.xy-0.5+iTime*0.00004*timeScale); \n" +" \n" +
"  float color2 = fbm(vTextureCoord.xy-10.5+iTime*0.00002*timeScale); \n" +" \n" +
" \n" +" \n" +
"  float clouds1 = smoothstep(1.0-cover,min((1.0-cover)+softness*2.0,1.0),color1); \n" +" \n" +
"  float clouds2 = smoothstep(1.0-cover,min((1.0-cover)+softness,1.0),color2); \n" +" \n" +
" \n" +" \n" +
"  float cloudsFormComb = saturate(clouds1+clouds2); \n" +" \n" +
" \n" +" \n" +
"  vec4 skyCol = vec4(0.6,0.8,1.0,1.0); \n" +" \n" +
"  float cloudCol = saturate(saturate(1.0-pow(color1,1.0)*0.2)*bright); \n" +" \n" +
"  vec4 clouds1Color = vec4(cloudCol,cloudCol,cloudCol,1.0); \n" +" \n" +
"  vec4 clouds2Color = mix(clouds1Color,skyCol,0.25); \n" +" \n" +
"  vec4 cloudColComb = mix(clouds1Color,clouds2Color,saturate(clouds2-clouds1)); \n" +" \n" +
" \n" +" \n" +
"	gl_FragColor = mix(texture2D(uSampler, vTextureCoord), cloudColComb, cloudsFormComb); \n" +" \n" +
"} \n" +" \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],38:[function(require,module,exports){
const frag = require('./clouds.frag');
const vert = require('../basic.vert');

class CloudsFilter extends PIXI.Filter {
  constructor(texture) {
    super(vert(), frag());

    this.time = performance.now();
    this.noiseTexture = texture;
  }
  set time(v) {
    this.uniforms.iTime = v;
  }
  get time() {
    return this.uniforms.iTime;
  }
  set noiseTexture(v) {
    this.uniforms.noiseTexture = v;
  }
  get noiseTexture() {
    return this.uniforms.noiseTexture;
  }
}

module.exports = CloudsFilter;

},{"../basic.vert":43,"./clouds.frag":37}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
const frag = require('./grayscale.frag');
const vert = require('../basic.vert');

class GrayscaleFilter extends PIXI.Filter {
  constructor(x, y, r) {
    super(vert(), frag());

    this.x = x || .5;
    this.y = y || .5;
    this.r = r || 0.8;
  }
  set x(v) {
    this.uniforms.x = v;
  }
  get x() {
    return this.uniforms.x;
  }
  set y(v) {
    this.uniforms.y = v;
  }
  get y() {
    return this.uniforms.y;
  }
  set r(v) {
    this.uniforms.r = v;
  }
  get r() {
    return this.uniforms.r;
  }
}

module.exports = GrayscaleFilter;

},{"../basic.vert":43,"./grayscale.frag":39}],41:[function(require,module,exports){
const frag = require('./noiseBlur.frag');
const vert = require('../basic.vert');

class NoiseBlurFilter extends PIXI.Filter {
  constructor() {
    super(vert(), frag());

    this.blurRadius = 0.0002;
  }
  set blurRadius(v) {
    this.uniforms.blurRadius = v;
  }
  get blurRadius() {
    return this.uniforms.blurRadius;
  }
}

module.exports = NoiseBlurFilter;

},{"../basic.vert":43,"./noiseBlur.frag":42}],42:[function(require,module,exports){
module.exports = function parse(params){
      var template = "precision mediump float; \n" +" \n" +
" \n" +" \n" +
"varying vec2 vTextureCoord; \n" +" \n" +
"uniform sampler2D uSampler; \n" +" \n" +
" \n" +" \n" +
"uniform float blurRadius; \n" +" \n" +
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
require('pixi-particles');
require('pixi-filters');

const Loader = require('./Loader');
const Game = require('./Game');

new Loader('assets/banner.png', () => {
  window.game = new Game();

  document.body.appendChild(game.view);
  game.scenes.enableScene('menu');
});

},{"./Game":30,"./Loader":31,"pixi-filters":25,"pixi-particles":26,"pixi-projection":27,"pixi-sound":28,"pixi-tween":29}],45:[function(require,module,exports){
class DebuggerManager extends PIXI.Graphics {
  constructor(game) {
    super();

    this.game = game;

    this.points = [];
    this.rects = [];
  }
  addPoint(point) {
    this.points.push(point);
  }
  addRect(rect) {
    this.rects.push(rect);
  }
  update() {
    this.clear();

    for(let i = 0; i < this.points.length; i++) {
      this.beginFill(0x44a73f);
      this.drawRect(this.points[i].x-5, this.points[i].y-5, 10, 10);
    }

    for(let i = 0; i < this.rects.length; i++) {
      this.beginFill(0x44a73f, 0.3);
      this.lineStyle(2, 0x44a73f);
      this.drawRect(this.rects[i].x, this.rects[i].y, this.rects[i].width, this.rects[i].height);
    }
  }
}

module.exports = DebuggerManager;

},{}],46:[function(require,module,exports){
class HistoryManager extends PIXI.Container {
  constructor(scene, history) {
    super();

    this.game = scene.game;
    this.scene = scene;

    this.history = history;
    this.alpha = 0;

    this.displacementSprite = new PIXI.Sprite(PIXI.Texture.fromImage('displacement'));
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.addChild(this.displacementSprite);
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

    this.image = new PIXI.Sprite();
    this.image.anchor.set(.5, 0);
    this.image.x = this.game.w/2;
    this.image.y = 75;
    this.image.scale.set(.5);
    this.image.filters = [this.displacementFilter];
    this.addChild(this.image);

    this.text = new PIXI.Text('', {
      font: 'normal 30px Amatic SC',
      wordWrap: true,
      wordWrapWidth: this.game.w/2,
      fill: '#fff',
      padding: 10,
      align: 'center'
    });
    this.text.setText('Text');
    this.text.anchor.set(.5, 0);
    this.text.x = this.game.w/2;
    this.text.y = 300;
    this.addChild(this.text);
  }
  show(id) {
    let data = this.history[id];

    this.image.texture = PIXI.Texture.fromImage(data.image);
    this.text.setText(data.text[this.game.lang]);

    let show = PIXI.tweenManager.createTween(this);
    show.from({alpha: 0}).to({alpha: 1});
    show.time = 1000;
    show.start();
    this.emit('showen');

    setTimeout(() => this._hide(), data.time);
  }
  _hide() {
    let hide = PIXI.tweenManager.createTween(this);
    hide.from({alpha: 1}).to({alpha: 0});
    hide.time = 1000;
    hide.start();
    this.emit('hidden');
  }
  update() {
    this.displacementSprite.x += .5;
    this.displacementSprite.y += .5;
  }
}

module.exports = HistoryManager;

},{}],47:[function(require,module,exports){
/*
  Движок тайловой карты
  События:
    scrolledDown => dtDown
    scrolledTop => dtTop
*/
const Block = require('../subjects/Block');

class MapManager extends PIXI.projection.Container2d {
  constructor(scene, map, blocks) {
    super('levels');

    this.scene = scene;
    this.game = scene.game;

    this.tileSize = map.tilewidth;
    this.mapWidth = map.width;
    this.mapHeight = map.height;

    this.map = map.layers[0].data;
    this.triggers = map.layers[1].data;
    this.blocks = blocks.tileproperties;

    this.PROJECTION_PADDING_BOTTOM = 280;
    this.x = this.game.w/2-this.mapWidth*this.tileSize/2;
    this.y = -this.mapHeight*this.tileSize+this.game.h-this.PROJECTION_PADDING_BOTTOM;

    this.isStop = false;
    this.speed = 500;

    this._parseMap();
  }
  _parseMap() {
    for(let y = 0; y < this.mapHeight; y++) {
      for(let x = 0; x < this.mapWidth; x++) {
        !this.map[y*this.mapWidth+x] || this.addBlock(x*this.tileSize, y*this.tileSize, this.map[y*this.mapWidth+x], this.triggers[y*this.mapWidth+x]);
      }
    }
    this.checkOutRangeBlocks();
  }
  addBlock(x, y, blockID, triggerID) {
    let block = new Block(this, x, y, this.blocks[blockID-1], this.blocks[triggerID-1]);
    this.addChild(block);
  }

  // Collision Widh Block
  getBlock(pos) {
    for(let i = 0; i < this.children.length; i++) {
      let block = this.children[i];
      let x = block.transform.worldTransform.tx/this.game.scale-block.width/2;
      let y = block.transform.worldTransform.ty/this.game.scale-block.height/2;
      let w = block.width;
      let h = block.height;

      if(pos.x >= x && pos.x <= x+w && pos.y >= y && pos.y <= y+h) return this.children[i];
    }
  }
  getNearBlocks(pos) {
    return {
      center: this.getBlock(pos),
      top: this.getBlock({x: pos.x, y: pos.y-this.tileSize}),
      bottom: this.getBlock({x: pos.x, y: pos.y+this.tileSize}),
      left: this.getBlock({x: pos.x-this.tileSize, y: pos.y}),
      right: this.getBlock({x: pos.x+this.tileSize, y: pos.y}),
    }
  }

  // Moving Map
  scrollDown(blocks) {
    if(this.isStop) return;

    // Scroll map down on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y+blocks*this.tileSize});
    move.time = this.speed*blocks;

    move.on('end', () => {
      this.emit('scrolledDown', blocks);
      this.checkOutRangeBlocks();
    });
    move.start();
  }
  scrollTop(blocks) {
    if(this.isStop) return;

    // Scroll map top on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y-blocks*this.tileSize});
    move.time = this.speed*blocks;

    move.on('end', () => {
      this.emit('scrolledTop', blocks);
      this.checkOutRangeBlocks();
    });
    move.start();
  }

  // clear out range map blocks
  checkOutRangeBlocks() {
    for(let i = 0; i < this.children.length; i++) {
      let y = this.children[i].transform.worldTransform.ty-this.tileSize/2;
      if(y > this.game.h || y < -this.tileSize) {
        this.children[i].renderable && this.children[i].hide();
      } else !this.children[i].renderable && this.children[i].show();
    }
  }
}

module.exports = MapManager;

},{"../subjects/Block":54}],48:[function(require,module,exports){
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
    this.activeScene && this.disableScene();

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

},{"../scenes":53}],49:[function(require,module,exports){
class SplashManager extends PIXI.Graphics {
  constructor(game) {
    super();
    this.game = game;

    this.alpha = 0;
  }
  show(color=0xFFFFFF, showTime=1000, endTime=1000, showEvent, endEvent) {
    this.beginFill(color);
    this.drawRect(0, 0, this.game.w, this.game.h);

    let hide = PIXI.tweenManager.createTween(this)
      .from({alpha: 1}).to({alpha: 0});
    hide.on('end', () => endEvent && endEvent());
    hide.time = endTime;

    let show = PIXI.tweenManager.createTween(this)
      .from({alpha: 0}).to({alpha: 1});
    show.time = showTime;
    show.on('end', () => {
      showEvent && showEvent();
      hide.start();
    });
    show.start();
  }
}

module.exports = SplashManager;

},{}],50:[function(require,module,exports){
class Final extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;
  }
}

module.exports = Final;

},{}],51:[function(require,module,exports){
class Menu extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.game.noiseBlur.blurRadius = 0.0005;
    this.game.grayscale.r = 5.0;

    this.sky = new PIXI.Sprite(PIXI.Texture.fromImage('sky'));
    this.addChild(this.sky);

    this.sun = new PIXI.Sprite(PIXI.Texture.fromImage('sun'));
    this.sun.x = 700;
    this.sun.y = 130;
    this.addChild(this.sun);

    this.mount = new PIXI.Sprite(PIXI.Texture.fromImage('mount'));
    this.mount.y = 160;
    this.addChild(this.mount);

    this.label = new PIXI.Text('Mottion', {
      font: 'normal 200px Opificio Bold',
      fill: '#5774f6',
      align: 'center'
    });
    this.label.anchor.set(.5);
    this.label.y = 330;
    this.label.x = this.game.w/2;
    this.addChild(this.label);

    this.citaty = new PIXI.Text('He played with his dreams, and dreams played to them.', {
      font: 'normal 60px Opificio Bold',
      fill: '#5774f6',
      wordWrap: true,
      wordWrapWidth: this.game.w/2,
      align: 'center'
    });
    this.citaty.anchor.set(.5);
    this.citaty.y = 500;
    this.citaty.x = this.game.w/2;
    this.addChild(this.citaty);

    this.displacementSprite = new PIXI.Sprite(PIXI.Texture.fromImage('displacement'));
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

    this.clouds = new PIXI.Container();
    this.clouds.filter = [this.displacementFilter];

    this.addChild(this.clouds);
    this.clouds.addChild(this.displacementSprite);

    this.count = 0;

    this.c1 = new PIXI.Sprite(PIXI.Texture.fromImage('cloud'));
    this.c1.y = 430-50;
    this.c1.alpha = .4;
    this.c1.scale.set(3);
    this.c1.x = -100;
    this.clouds.addChild(this.c1);

    this.c2 = new PIXI.Sprite(PIXI.Texture.fromImage('cloud'));
    this.c2.y = 500-50;
    this.c2.alpha = .4;
    this.c2.scale.set(-3, 3);
    this.c2.x = this.game.w+100;
    this.clouds.addChild(this.c2);

    this.c3 = new PIXI.Sprite(PIXI.Texture.fromImage('cloud'));
    this.c3.y = 650-50;
    this.c3.alpha = .4;
    this.c3.scale.set(-5, 5);
    this.c3.x = this.game.w+300;
    this.clouds.addChild(this.c3);

    this.c4 = new PIXI.Sprite(PIXI.Texture.fromImage('cloud'));
    this.c4.y = 550-50;
    this.c4.alpha = .4;
    this.c4.scale.set(4);
    this.c4.x = -290;
    this.clouds.addChild(this.c4);

    this.filters = [new PIXI.filters.AdvancedBloomFilter({
      bloomScale: .4,
      brightness: 0.5
    })];

    this.interactive = true;
    this.on('pointerdown', () => this.toPlayground())
  }
  toPlayground() {
    this.game.splash.show(0xF9E4FF, 1000, 1000, () => {
      this.game.scenes.enableScene('playground');
    });
  }
  update() {
    this.count += 0.05;

    for(var i = 0; i < this.clouds.children.length; i++) {
      this.clouds.children[i].x += Math.sin(i * 30 + this.count);
    }
    this.displacementSprite.x += 10;
    this.displacementSprite.y += 10;
  }
}

module.exports = Menu;

},{}],52:[function(require,module,exports){
// content
const map = require('../content/map');
const blocks = require('../content/blocks');
const history = require('../content/history');

// managers
const MapManager = require('../managers/MapManager');
const HistoryManager = require('../managers/HistoryManager');

// subjects
const Player = require('../subjects/Player');
const Thlen = require('../subjects/Thlen');

// filters
const AlphaGradientFilter = require('../filters/AlphaGradientFilter');


class Playground extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.game.noiseBlur.blurRadius = 0.0001;
    this.game.grayscale.r = 0.8;

    this.bg = new PIXI.Sprite(PIXI.Texture.fromImage('bg'));
    this.bg.width = this.game.w;
    this.bg.height = this.game.h;
    this.addChild(this.bg);

    // Init objects
    this.projection = new PIXI.projection.Container2d();
    this.projection.proj.setAxisY({x: -this.game.w/2+50, y: 4000}, -1);
    this.projection.filters = [new AlphaGradientFilter(.3, .1)];
    this.addChild(this.projection);

    this.map = new MapManager(this, map, blocks);
    this.projection.addChild(this.map);

    this.history = new HistoryManager(this, history);
    this.player = new Player(this, this.map);
    this.thlen = new Thlen(this);
    this.addChild(this.history, this.player, this.thlen);

    // Controls
    this.interactive = true;
    this._bindEvents();
  }
  _bindEvents() {
    this.on('pointerdown', () => this.player.immunity());
    this.on('pointermove', (e) => {
      for(let i = 0; i < this.map.children.length; i++) {
        let block = this.map.children[i];
        if(block.containsPoint(e.data.global)) {
          return block.hit();
        } else block.unhit();
      }
    });

    this.history.on('showen', () => {
      this.player.stopMove();
      this.projection.filters[0].enabled = false;
    });
    this.history.on('hidden', () => {
      this.player.startMove();
      this.projection.filters[0].enabled = true;
    });

    this.player.on('deaded', () => this.restart());
    this.player.on('collision', (block) => {
      block.historyID && this.history.show(block.historyID);
    });
    this.player.top();
  }
  restart() {
    this.game.splash.show(0xEEEEEE, 500, 500, () => {
      this.game.scenes.enableScene('playground');
    });
  }
  update() {
    this.history.update();
    this.thlen.update();
  }
}

module.exports = Playground;

},{"../content/blocks":32,"../content/history":33,"../content/map":34,"../filters/AlphaGradientFilter":36,"../managers/HistoryManager":46,"../managers/MapManager":47,"../subjects/Player":55,"../subjects/Thlen":57}],53:[function(require,module,exports){
module.exports = {
  'menu': require('./Menu'),
  'playground': require('./Playground'),
  'final': require('./Final')
}

},{"./Final":50,"./Menu":51,"./Playground":52}],54:[function(require,module,exports){
/*
  Класс Блока, используется для тайлового движка
  События:
    showen
    hidden
    activated
    deactivated
    hited
*/

class Block extends PIXI.projection.Sprite2d {
  constructor(map, x, y, block={}, trigger={}) {
    super();

    this.map = map;
    this.game = this.map.game;

    this.active = block.active || false;
    this.activation = block.activation || null;
    this.score = block.score || 0;

    this.playerDir = trigger.playerDir;
    this.historyID = trigger.historyID;
    this.action = trigger.action;

    this.activatedTexture = block.activatedTexture ? PIXI.Texture.fromFrame(block.activatedTexture) : null;
    this.deactivatedTexture = block.deactivatedTexture ? PIXI.Texture.fromFrame(block.deactivatedTexture) : null;
    this.texture = this.active ? this.activatedTexture : this.deactivatedTexture;

    this.anchor.set(.5);
    this.renderable = false;
    this.width = map.tileSize+1;
    this.height = map.tileSize+1;
    this.x = x+map.tileSize/2+.5;
    this.y = y+map.tileSize/2+.5;

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 200;
    this.jolting.pingPong = true;
    this.jolting.repeat = Infinity;
  }
  show() {
    this.renderable = true;

    let show = PIXI.tweenManager.createTween(this);
    show.from({alpha: 0}).to({alpha: 1})
    show.time = 1000;
    show.start();

    this.emit('showen');
  }
  hide() {
    this.renderable = false;

    this.emit('hidden');
  }

  activate() {
    let activating = PIXI.tweenManager.createTween(this)
      .from({width: this.width*3/4, height: this.height*3/4})
      .to({width: this.width, height: this.height, rotation: 0});
    activating.time = 500;
    activating.easing = PIXI.tween.Easing.outBounce();
    activating.start();

    this.unhit();

    this.active = true;
    this.texture = this.activatedTexture;

    this.emit('activated');
  }
  deactivate() {
    this.active = false;
    if(this.deactivatedTexture) this.texture = this.deactivatedTexture;

    this.emit('deactivated');
  }

  unhit() {
    this.jolting.stop();
    this.rotation = 0;
  }
  hit() {
    if(this.activation === null || this.active) return;

    this.jolting.start();
    if(this.activation) this.activation--;
    else this.activate();

    this.emit('hited');
  }
}

module.exports = Block;

},{}],55:[function(require,module,exports){
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

const RUN_TOP = [];
for(let i = 0; i < 8; i++) {
  let texture = PIXI.Texture.fromImage('player_run_top_' + (i+1));
  RUN_TOP.push({texture, time: 70});
}

const RUN_LEFT = [];
for(let i = 0; i < 5; i++) {
  let texture = PIXI.Texture.fromImage('player_run_left_' + (i+1));
  RUN_LEFT.push({texture, time: 70});
}

class Player extends PIXI.extras.AnimatedSprite {
  constructor(scene, map) {
    super(RUN_TOP);

    this.game = scene.game;
    this.scene = scene;
    this.map = map;

    this.SCALE = .7;

    this.loop = true;
    this.anchor.set(.5, 1);
    this.scale.set(this.SCALE);
    this.x = this.game.w/2+5;
    this.y = this.game.h-this.map.tileSize*1;

    this.collisionPoint = new PIXI.Point(960, 716);

    this.walking = PIXI.tweenManager.createTween(this);
    this.walking.from({y: this.y}).to({y: this.y-15});
    this.walking.time = 800;
    this.walking.loop = true;
    this.walking.pingPong = true;
    this.walking.start();

    this.lastMove = null;
    this.speed = this.map.speed || 500;
    this.isDead = false;
    this.isStop = false;

    this.OFFSET_X = 20;
    this.IMMUNITY_BLOCKS = 1;
    this.immunityCount = 5;
  }
  moving() {
    if(this.isDead || this.isStop) return;

    let blocks = this.map.getNearBlocks(this.collisionPoint);
    if(blocks.center && blocks.center.active) {
      this.emit('moved');
      this.emit('collision', blocks.center);

      if(blocks.center.playerDir === 'top') return this.top();
      if(blocks.center.playerDir === 'left') return this.left();
      if(blocks.center.playerDir === 'right') return this.right();

      //check top
      if(blocks.top && blocks.top.active && this.lastMove !== 'bottom') return this.top();
      // check left
      if(blocks.left && blocks.left.active && this.lastMove !== 'right') return this.left();
      // check rigth
      if(blocks.right && blocks.right.active && this.lastMove !== 'left') return this.right();
      // or die
      this.top();
    } else this.dead();
  }
  dead() {
    this.walking.stop();
    this.isDead = true;

    let dead = PIXI.tweenManager.createTween(this.scale);
    dead.from(this.scale).to({x: 0, y: 0});
    dead.time = 200;
    dead.start();
    dead.on('end', () => this.emit('deaded'));
  }
  immunity() {
    if(!this.immunityCount) return;

    let block = this.map.getBlock({x: this.x, y: this.y-this.map.tileSize});
    if(block) {
      this.immunityCount--;
      block.activate('cell1-fill.png');

      this.emit('actionImmunity');
    }
  }
  startMove() {
    this.isStop = false;
    this.textures = RUN_TOP;
    this.scale.x = this.SCALE;
    this.walking.start();
    this.gotoAndPlay(0);
  }
  stopMove() {
    this.isStop = true;
    this.textures = RUN_TOP;
    this.scale.x = this.SCALE;
    this.walking.stop();
    this.gotoAndStop(0);

    this.emit('actionStop');
  }
  top() {
    if(this.lastMove !== 'top') {
      this.textures = RUN_TOP;
      this.scale.x = this.SCALE;
      this.gotoAndPlay(0);
    }

    this.lastMove = 'top';
    this.map.scrollDown(1);
    this.map.once('scrolledDown', () => this.moving());

    this.emit('actionTop');
  }
  left() {
    if(this.lastMove !== 'left') {
      this.scale.x = this.SCALE;
      this.textures = RUN_LEFT;
      this.gotoAndPlay(0);
    }

    this.lastMove = 'left';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x-this.map.tileSize-this.OFFSET_X});
    move.time = this.speed/2;
    move.start();

    this.collisionPoint.x -= this.map.tileSize;

    move.on('end', () => this.moving());
    this.emit('actionLeft');
  }
  right() {
    if(this.lastMove !== 'right') {
      this.scale.x = -this.SCALE;
      this.textures = RUN_LEFT;
      this.gotoAndPlay(0);
    }

    this.lastMove = 'right';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x+this.map.tileSize+this.OFFSET_X});
    move.time = this.speed/2;
    move.start();

    this.collisionPoint.x += this.map.tileSize;

    move.on('end', () => this.moving());
    this.emit('actionRight');
  }
}

module.exports = Player;

},{}],56:[function(require,module,exports){
class Sphere extends PIXI.Container {
  constructor(scene) {
    super();

    this.emitter = new PIXI.particles.Emitter(this, [PIXI.Texture.fromImage('particle')], require('./emitter.json'));
  }
  lerp(start, end, amt) {
    return (1-amt)*start+amt*end;
  }
  setPos(pos) {
    this.emitter.spawnPos.x = pos.x;
    this.emitter.spawnPos.y = pos.y;
    // 
    // this.emitter.spawnPos.x = this.lerp(this.emitter.spawnPos.x, pos.x, 0.2);
    // this.emitter.spawnPos.y = this.lerp(this.emitter.spawnPos.y, pos.y, 0.2);
  }
  update(dt) {
    this.emitter.update(dt*.02);
    this.emitter.emit = true;
  }
}

module.exports = Sphere;

},{"./emitter.json":58}],57:[function(require,module,exports){
class Thlen extends PIXI.Container {
  constructor(scene) {
    super();

    this.scene = scene;
    this.game = scene.game;

    this.displacementSprite = new PIXI.Sprite(PIXI.Texture.fromImage('displacement'));
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.addChild(this.displacementSprite);
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

    this.size = 150;
    this.amt = Math.round(this.game.w/this.size);
    this.PADDIN = 50;
    for(let i = 0; i < this.amt; i++) {
      let thlen = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('thlen')));
      thlen.width = this.size+2;
      thlen.x = i*this.size-1;
      thlen.alpha = .8;
      thlen.blendMode = PIXI.BLEND_MODES.SATURATION;
      thlen.y = this.game.h-this.size;
    }

    this.width += this.PADDIN;
    this.x -= this.PADDIN/2;
    this.filters = [this.displacementFilter];

    this.count = 0;
  }
  update() {
    this.count += 0.05;

    for(var i = 0; i < this.children.length; i++) {
      this.children[i].y += Math.sin(i * 30 + this.count);
    }
    this.displacementSprite.x += 5;
    this.displacementSprite.y += 5;
  }
}

module.exports = Thlen;

},{}],58:[function(require,module,exports){
module.exports={
"alpha": {
"start": 1,
"end": 0
},
"scale": {
"start": 1,
"end": 0.001,
"minimumScaleMultiplier": 0.001
},
"color": {
"start": "#e4f9ff",
"end": "#3fcbff"
},
"speed": {
"start": 1000,
"end": 50,
"minimumSpeedMultiplier": 1
},
"acceleration": {
"x": 0,
"y": -1000
},
"maxSpeed": 60,
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
"spawnType": "circle",
"spawnCircle": {
"x": 0,
"y": 0,
"r": 0
} 
}

},{}]},{},[44])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWFkdmFuY2VkLWJsb29tL2xpYi9maWx0ZXItYWR2YW5jZWQtYmxvb20uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWFzY2lpL2xpYi9maWx0ZXItYXNjaWkuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWJsb29tL2xpYi9maWx0ZXItYmxvb20uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWJ1bGdlLXBpbmNoL2xpYi9maWx0ZXItYnVsZ2UtcGluY2guanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWNvbG9yLXJlcGxhY2UvbGliL2ZpbHRlci1jb2xvci1yZXBsYWNlLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1jb252b2x1dGlvbi9saWIvZmlsdGVyLWNvbnZvbHV0aW9uLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1jcm9zcy1oYXRjaC9saWIvZmlsdGVyLWNyb3NzLWhhdGNoLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1kb3QvbGliL2ZpbHRlci1kb3QuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93L2xpYi9maWx0ZXItZHJvcC1zaGFkb3cuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWVtYm9zcy9saWIvZmlsdGVyLWVtYm9zcy5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZ2xvdy9saWIvZmlsdGVyLWdsb3cuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWdvZHJheS9saWIvZmlsdGVyLWdvZHJheS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItbW90aW9uLWJsdXIvbGliL2ZpbHRlci1tb3Rpb24tYmx1ci5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZS9saWIvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLW9sZC1maWxtL2xpYi9maWx0ZXItb2xkLWZpbG0uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLW91dGxpbmUvbGliL2ZpbHRlci1vdXRsaW5lLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1waXhlbGF0ZS9saWIvZmlsdGVyLXBpeGVsYXRlLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1yYWRpYWwtYmx1ci9saWIvZmlsdGVyLXJhZGlhbC1ibHVyLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1yZ2Itc3BsaXQvbGliL2ZpbHRlci1yZ2Itc3BsaXQuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLXNob2Nrd2F2ZS9saWIvZmlsdGVyLXNob2Nrd2F2ZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwL2xpYi9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci10aWx0LXNoaWZ0L2xpYi9maWx0ZXItdGlsdC1zaGlmdC5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItdHdpc3QvbGliL2ZpbHRlci10d2lzdC5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItem9vbS1ibHVyL2xpYi9maWx0ZXItem9vbS1ibHVyLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktZmlsdGVycy9saWIvcGl4aS1maWx0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktcGFydGljbGVzL2Rpc3QvcGl4aS1wYXJ0aWNsZXMubWluLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktcHJvamVjdGlvbi9kaXN0L3BpeGktcHJvamVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9waXhpLXNvdW5kL2Rpc3QvcGl4aS1zb3VuZC5qcyIsIm5vZGVfbW9kdWxlcy9waXhpLXR3ZWVuL2J1aWxkL3BpeGktdHdlZW4uanMiLCJzcmMvR2FtZS5qcyIsInNyYy9Mb2FkZXIuanMiLCJzcmMvY29udGVudC9ibG9ja3MuanNvbiIsInNyYy9jb250ZW50L2hpc3RvcnkuanNvbiIsInNyYy9jb250ZW50L21hcC5qc29uIiwic3JjL2ZpbHRlcnMvQWxwaGFHcmFkaWVudEZpbHRlci9hbHBoYS5mcmFnIiwic3JjL2ZpbHRlcnMvQWxwaGFHcmFkaWVudEZpbHRlci9pbmRleC5qcyIsInNyYy9maWx0ZXJzL0Nsb3Vkc0ZpbHRlci9jbG91ZHMuZnJhZyIsInNyYy9maWx0ZXJzL0Nsb3Vkc0ZpbHRlci9pbmRleC5qcyIsInNyYy9maWx0ZXJzL0dyYXlzY2FsZUZpbHRlci9ncmF5c2NhbGUuZnJhZyIsInNyYy9maWx0ZXJzL0dyYXlzY2FsZUZpbHRlci9pbmRleC5qcyIsInNyYy9maWx0ZXJzL05vaXNlQmx1ckZpbHRlci9pbmRleC5qcyIsInNyYy9maWx0ZXJzL05vaXNlQmx1ckZpbHRlci9ub2lzZUJsdXIuZnJhZyIsInNyYy9maWx0ZXJzL2Jhc2ljLnZlcnQiLCJzcmMvaW5kZXguanMiLCJzcmMvbWFuYWdlcnMvRGVidWdnZXJNYW5hZ2VyLmpzIiwic3JjL21hbmFnZXJzL0hpc3RvcnlNYW5hZ2VyLmpzIiwic3JjL21hbmFnZXJzL01hcE1hbmFnZXIuanMiLCJzcmMvbWFuYWdlcnMvU2NlbmVzTWFuYWdlci5qcyIsInNyYy9tYW5hZ2Vycy9TcGxhc2hNYW5hZ2VyLmpzIiwic3JjL3NjZW5lcy9GaW5hbC5qcyIsInNyYy9zY2VuZXMvTWVudS5qcyIsInNyYy9zY2VuZXMvUGxheWdyb3VuZC5qcyIsInNyYy9zY2VuZXMvaW5kZXguanMiLCJzcmMvc3ViamVjdHMvQmxvY2suanMiLCJzcmMvc3ViamVjdHMvUGxheWVyLmpzIiwic3JjL3N1YmplY3RzL1NwaGVyZS5qcyIsInNyYy9zdWJqZWN0cy9UaGxlbi5qcyIsInNyYy9zdWJqZWN0cy9lbWl0dGVyLmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdG5FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItYWR2YW5jZWQtYmxvb20gLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWFkdmFuY2VkLWJsb29tIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUscil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/cihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0scik6cihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciByPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIGZsb2F0IHRocmVzaG9sZDtcXG5cXG52b2lkIG1haW4oKSB7XFxuICAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICAvLyBBIHNpbXBsZSAmIGZhc3QgYWxnb3JpdGhtIGZvciBnZXR0aW5nIGJyaWdodG5lc3MuXFxuICAgIC8vIEl0J3MgaW5hY2N1cmFjeSAsIGJ1dCBnb29kIGVub3VnaHQgZm9yIHRoaXMgZmVhdHVyZS5cXG4gICAgZmxvYXQgX21heCA9IG1heChtYXgoY29sb3IuciwgY29sb3IuZyksIGNvbG9yLmIpO1xcbiAgICBmbG9hdCBfbWluID0gbWluKG1pbihjb2xvci5yLCBjb2xvci5nKSwgY29sb3IuYik7XFxuICAgIGZsb2F0IGJyaWdodG5lc3MgPSAoX21heCArIF9taW4pICogMC41O1xcblxcbiAgICBpZihicmlnaHRuZXNzID4gdGhyZXNob2xkKSB7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSBjb2xvcjtcXG4gICAgfSBlbHNlIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMC4wKTtcXG4gICAgfVxcbn1cXG5cIixvPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG8obyl7dm9pZCAwPT09byYmKG89LjUpLGUuY2FsbCh0aGlzLHIsdCksdGhpcy50aHJlc2hvbGQ9b31lJiYoby5fX3Byb3RvX189ZSksKG8ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1vO3ZhciBuPXt0aHJlc2hvbGQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnRocmVzaG9sZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy50aHJlc2hvbGR9LG4udGhyZXNob2xkLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnRocmVzaG9sZD1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvLnByb3RvdHlwZSxuKSxvfShQSVhJLkZpbHRlciksbj1cInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIGJsb29tVGV4dHVyZTtcXG51bmlmb3JtIGZsb2F0IGJsb29tU2NhbGU7XFxudW5pZm9ybSBmbG9hdCBicmlnaHRuZXNzO1xcblxcbnZvaWQgbWFpbigpIHtcXG4gICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIGNvbG9yLnJnYiAqPSBicmlnaHRuZXNzO1xcbiAgICB2ZWM0IGJsb29tQ29sb3IgPSB2ZWM0KHRleHR1cmUyRChibG9vbVRleHR1cmUsIHZUZXh0dXJlQ29vcmQpLnJnYiwgMC4wKTtcXG4gICAgYmxvb21Db2xvci5yZ2IgKj0gYmxvb21TY2FsZTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gY29sb3IgKyBibG9vbUNvbG9yO1xcbn1cXG5cIixpPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCl7ZS5jYWxsKHRoaXMscixuKSxcIm51bWJlclwiPT10eXBlb2YgdCYmKHQ9e3RocmVzaG9sZDp0fSksdD1PYmplY3QuYXNzaWduKHt0aHJlc2hvbGQ6LjUsYmxvb21TY2FsZToxLGJyaWdodG5lc3M6MSxibHVyOjgscXVhbGl0eTo0LHJlc29sdXRpb246UElYSS5zZXR0aW5ncy5SRVNPTFVUSU9OLGtlcm5lbFNpemU6NX0sdCksdGhpcy5ibG9vbVNjYWxlPXQuYmxvb21TY2FsZSx0aGlzLmJyaWdodG5lc3M9dC5icmlnaHRuZXNzO3ZhciBpPXQuYmx1cixsPXQucXVhbGl0eSxzPXQucmVzb2x1dGlvbix1PXQua2VybmVsU2l6ZSxhPVBJWEkuZmlsdGVycyxjPWEuQmx1clhGaWx0ZXIsaD1hLkJsdXJZRmlsdGVyO3RoaXMuX2V4dHJhY3Q9bmV3IG8odC50aHJlc2hvbGQpLHRoaXMuX2JsdXJYPW5ldyBjKGksbCxzLHUpLHRoaXMuX2JsdXJZPW5ldyBoKGksbCxzLHUpfWUmJih0Ll9fcHJvdG9fXz1lKSwodC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXQ7dmFyIGk9e3RocmVzaG9sZDp7Y29uZmlndXJhYmxlOiEwfSxibHVyOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gdC5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSxyLHQsbyxuKXt2YXIgaT1lLmdldFJlbmRlclRhcmdldCghMCk7dGhpcy5fZXh0cmFjdC5hcHBseShlLHIsaSwhMCxuKSx0aGlzLl9ibHVyWC5hcHBseShlLGksaSwhMCxuKSx0aGlzLl9ibHVyWS5hcHBseShlLGksaSwhMCxuKSx0aGlzLnVuaWZvcm1zLmJsb29tU2NhbGU9dGhpcy5ibG9vbVNjYWxlLHRoaXMudW5pZm9ybXMuYnJpZ2h0bmVzcz10aGlzLmJyaWdodG5lc3MsdGhpcy51bmlmb3Jtcy5ibG9vbVRleHR1cmU9aSxlLmFwcGx5RmlsdGVyKHRoaXMscix0LG8pLGUucmV0dXJuUmVuZGVyVGFyZ2V0KGkpfSxpLnRocmVzaG9sZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZXh0cmFjdC50aHJlc2hvbGR9LGkudGhyZXNob2xkLnNldD1mdW5jdGlvbihlKXt0aGlzLl9leHRyYWN0LnRocmVzaG9sZD1lfSxpLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2JsdXJYLmJsdXJ9LGkuYmx1ci5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5fYmx1clguYmx1cj10aGlzLl9ibHVyWS5ibHVyPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQucHJvdG90eXBlLGkpLHR9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQWR2YW5jZWRCbG9vbUZpbHRlcj1pLGUuQWR2YW5jZWRCbG9vbUZpbHRlcj1pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItYWR2YW5jZWQtYmxvb20uanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1hc2NpaSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItYXNjaWkgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsbz1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gZmxvYXQgcGl4ZWxTaXplO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnZlYzIgbWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgKj0gZmlsdGVyQXJlYS54eTtcXG4gICAgY29vcmQgKz0gZmlsdGVyQXJlYS56dztcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHVubWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgLT0gZmlsdGVyQXJlYS56dztcXG4gICAgY29vcmQgLz0gZmlsdGVyQXJlYS54eTtcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHBpeGVsYXRlKHZlYzIgY29vcmQsIHZlYzIgc2l6ZSlcXG57XFxuICAgIHJldHVybiBmbG9vciggY29vcmQgLyBzaXplICkgKiBzaXplO1xcbn1cXG5cXG52ZWMyIGdldE1vZCh2ZWMyIGNvb3JkLCB2ZWMyIHNpemUpXFxue1xcbiAgICByZXR1cm4gbW9kKCBjb29yZCAsIHNpemUpIC8gc2l6ZTtcXG59XFxuXFxuZmxvYXQgY2hhcmFjdGVyKGZsb2F0IG4sIHZlYzIgcClcXG57XFxuICAgIHAgPSBmbG9vcihwKnZlYzIoNC4wLCAtNC4wKSArIDIuNSk7XFxuICAgIGlmIChjbGFtcChwLngsIDAuMCwgNC4wKSA9PSBwLnggJiYgY2xhbXAocC55LCAwLjAsIDQuMCkgPT0gcC55KVxcbiAgICB7XFxuICAgICAgICBpZiAoaW50KG1vZChuL2V4cDIocC54ICsgNS4wKnAueSksIDIuMCkpID09IDEpIHJldHVybiAxLjA7XFxuICAgIH1cXG4gICAgcmV0dXJuIDAuMDtcXG59XFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgIHZlYzIgY29vcmQgPSBtYXBDb29yZCh2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgLy8gZ2V0IHRoZSByb3VuZGVkIGNvbG9yLi5cXG4gICAgdmVjMiBwaXhDb29yZCA9IHBpeGVsYXRlKGNvb3JkLCB2ZWMyKHBpeGVsU2l6ZSkpO1xcbiAgICBwaXhDb29yZCA9IHVubWFwQ29vcmQocGl4Q29vcmQpO1xcblxcbiAgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBwaXhDb29yZCk7XFxuXFxuICAgIC8vIGRldGVybWluZSB0aGUgY2hhcmFjdGVyIHRvIHVzZVxcbiAgICBmbG9hdCBncmF5ID0gKGNvbG9yLnIgKyBjb2xvci5nICsgY29sb3IuYikgLyAzLjA7XFxuXFxuICAgIGZsb2F0IG4gPSAgNjU1MzYuMDsgICAgICAgICAgICAgLy8gLlxcbiAgICBpZiAoZ3JheSA+IDAuMikgbiA9IDY1NjAwLjA7ICAgIC8vIDpcXG4gICAgaWYgKGdyYXkgPiAwLjMpIG4gPSAzMzI3NzIuMDsgICAvLyAqXFxuICAgIGlmIChncmF5ID4gMC40KSBuID0gMTUyNTUwODYuMDsgLy8gb1xcbiAgICBpZiAoZ3JheSA+IDAuNSkgbiA9IDIzMzg1MTY0LjA7IC8vICZcXG4gICAgaWYgKGdyYXkgPiAwLjYpIG4gPSAxNTI1MjAxNC4wOyAvLyA4XFxuICAgIGlmIChncmF5ID4gMC43KSBuID0gMTMxOTk0NTIuMDsgLy8gQFxcbiAgICBpZiAoZ3JheSA+IDAuOCkgbiA9IDExNTEyODEwLjA7IC8vICNcXG5cXG4gICAgLy8gZ2V0IHRoZSBtb2QuLlxcbiAgICB2ZWMyIG1vZGQgPSBnZXRNb2QoY29vcmQsIHZlYzIocGl4ZWxTaXplKSk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yICogY2hhcmFjdGVyKCBuLCB2ZWMyKC0xLjApICsgbW9kZCAqIDIuMCk7XFxuXFxufVwiLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihyKXt2b2lkIDA9PT1yJiYocj04KSxlLmNhbGwodGhpcyxuLG8pLHRoaXMuc2l6ZT1yfWUmJihyLl9fcHJvdG9fXz1lKSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIGk9e3NpemU6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLnNpemUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucGl4ZWxTaXplfSxpLnNpemUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMucGl4ZWxTaXplPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHIucHJvdG90eXBlLGkpLHJ9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQXNjaWlGaWx0ZXI9cixlLkFzY2lpRmlsdGVyPXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1hc2NpaS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWJsb29tIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1ibG9vbSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbih0LHIpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3IoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHIpOnIodC5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj1QSVhJLmZpbHRlcnMsZT1yLkJsdXJYRmlsdGVyLGk9ci5CbHVyWUZpbHRlcixsPXIuQWxwaGFGaWx0ZXIsdT1mdW5jdGlvbih0KXtmdW5jdGlvbiByKHIsdSxuLG8pe3ZvaWQgMD09PXImJihyPTIpLHZvaWQgMD09PXUmJih1PTQpLHZvaWQgMD09PW4mJihuPVBJWEkuc2V0dGluZ3MuUkVTT0xVVElPTiksdm9pZCAwPT09byYmKG89NSksdC5jYWxsKHRoaXMpO3ZhciBiLHM7XCJudW1iZXJcIj09dHlwZW9mIHI/KGI9cixzPXIpOnIgaW5zdGFuY2VvZiBQSVhJLlBvaW50PyhiPXIueCxzPXIueSk6QXJyYXkuaXNBcnJheShyKSYmKGI9clswXSxzPXJbMV0pLHRoaXMuYmx1clhGaWx0ZXI9bmV3IGUoYix1LG4sbyksdGhpcy5ibHVyWUZpbHRlcj1uZXcgaShzLHUsbixvKSx0aGlzLmJsdXJZRmlsdGVyLmJsZW5kTW9kZT1QSVhJLkJMRU5EX01PREVTLlNDUkVFTix0aGlzLmRlZmF1bHRGaWx0ZXI9bmV3IGx9dCYmKHIuX19wcm90b19fPXQpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgdT17Ymx1cjp7Y29uZmlndXJhYmxlOiEwfSxibHVyWDp7Y29uZmlndXJhYmxlOiEwfSxibHVyWTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKHQscixlKXt2YXIgaT10LmdldFJlbmRlclRhcmdldCghMCk7dGhpcy5kZWZhdWx0RmlsdGVyLmFwcGx5KHQscixlKSx0aGlzLmJsdXJYRmlsdGVyLmFwcGx5KHQscixpKSx0aGlzLmJsdXJZRmlsdGVyLmFwcGx5KHQsaSxlKSx0LnJldHVyblJlbmRlclRhcmdldChpKX0sdS5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJYRmlsdGVyLmJsdXJ9LHUuYmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5ibHVyWEZpbHRlci5ibHVyPXRoaXMuYmx1cllGaWx0ZXIuYmx1cj10fSx1LmJsdXJYLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJYRmlsdGVyLmJsdXJ9LHUuYmx1clguc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1clhGaWx0ZXIuYmx1cj10fSx1LmJsdXJZLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJZRmlsdGVyLmJsdXJ9LHUuYmx1clkuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1cllGaWx0ZXIuYmx1cj10fSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSx1KSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkJsb29tRmlsdGVyPXUsdC5CbG9vbUZpbHRlcj11LE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItYmxvb20uanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1idWxnZS1waW5jaCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItYnVsZ2UtcGluY2ggaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInVuaWZvcm0gZmxvYXQgcmFkaXVzO1xcbnVuaWZvcm0gZmxvYXQgc3RyZW5ndGg7XFxudW5pZm9ybSB2ZWMyIGNlbnRlcjtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkICogZmlsdGVyQXJlYS54eTtcXG4gICAgY29vcmQgLT0gY2VudGVyICogZGltZW5zaW9ucy54eTtcXG4gICAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoY29vcmQpO1xcbiAgICBpZiAoZGlzdGFuY2UgPCByYWRpdXMpIHtcXG4gICAgICAgIGZsb2F0IHBlcmNlbnQgPSBkaXN0YW5jZSAvIHJhZGl1cztcXG4gICAgICAgIGlmIChzdHJlbmd0aCA+IDAuMCkge1xcbiAgICAgICAgICAgIGNvb3JkICo9IG1peCgxLjAsIHNtb290aHN0ZXAoMC4wLCByYWRpdXMgLyBkaXN0YW5jZSwgcGVyY2VudCksIHN0cmVuZ3RoICogMC43NSk7XFxuICAgICAgICB9IGVsc2Uge1xcbiAgICAgICAgICAgIGNvb3JkICo9IG1peCgxLjAsIHBvdyhwZXJjZW50LCAxLjAgKyBzdHJlbmd0aCAqIDAuNzUpICogcmFkaXVzIC8gZGlzdGFuY2UsIDEuMCAtIHBlcmNlbnQpO1xcbiAgICAgICAgfVxcbiAgICB9XFxuICAgIGNvb3JkICs9IGNlbnRlciAqIGRpbWVuc2lvbnMueHk7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuICAgIHZlYzIgY2xhbXBlZENvb3JkID0gY2xhbXAoY29vcmQsIGZpbHRlckNsYW1wLnh5LCBmaWx0ZXJDbGFtcC56dyk7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY2xhbXBlZENvb3JkKTtcXG4gICAgaWYgKGNvb3JkICE9IGNsYW1wZWRDb29yZCkge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yICo9IG1heCgwLjAsIDEuMCAtIGxlbmd0aChjb29yZCAtIGNsYW1wZWRDb29yZCkpO1xcbiAgICB9XFxufVxcblwiLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihyLG8saSl7ZS5jYWxsKHRoaXMsbix0KSx0aGlzLmNlbnRlcj1yfHxbLjUsLjVdLHRoaXMucmFkaXVzPW98fDEwMCx0aGlzLnN0cmVuZ3RoPWl8fDF9ZSYmKHIuX19wcm90b19fPWUpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgbz17cmFkaXVzOntjb25maWd1cmFibGU6ITB9LHN0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9LGNlbnRlcjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsbix0LHIpe3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT1uLnNvdXJjZUZyYW1lLndpZHRoLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT1uLnNvdXJjZUZyYW1lLmhlaWdodCxlLmFwcGx5RmlsdGVyKHRoaXMsbix0LHIpfSxvLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5yYWRpdXN9LG8ucmFkaXVzLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnJhZGl1cz1lfSxvLnN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnN0cmVuZ3RofSxvLnN0cmVuZ3RoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnN0cmVuZ3RoPWV9LG8uY2VudGVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmNlbnRlcn0sby5jZW50ZXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuY2VudGVyPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHIucHJvdG90eXBlLG8pLHJ9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQnVsZ2VQaW5jaEZpbHRlcj1yLGUuQnVsZ2VQaW5jaEZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItYnVsZ2UtcGluY2guanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1jb2xvci1yZXBsYWNlIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1jb2xvci1yZXBsYWNlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG8sZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZShvLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG8pe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlO1xcbnVuaWZvcm0gdmVjMyBvcmlnaW5hbENvbG9yO1xcbnVuaWZvcm0gdmVjMyBuZXdDb2xvcjtcXG51bmlmb3JtIGZsb2F0IGVwc2lsb247XFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgdmVjNCBjdXJyZW50Q29sb3IgPSB0ZXh0dXJlMkQodGV4dHVyZSwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzMgY29sb3JEaWZmID0gb3JpZ2luYWxDb2xvciAtIChjdXJyZW50Q29sb3IucmdiIC8gbWF4KGN1cnJlbnRDb2xvci5hLCAwLjAwMDAwMDAwMDEpKTtcXG4gICAgZmxvYXQgY29sb3JEaXN0YW5jZSA9IGxlbmd0aChjb2xvckRpZmYpO1xcbiAgICBmbG9hdCBkb1JlcGxhY2UgPSBzdGVwKGNvbG9yRGlzdGFuY2UsIGVwc2lsb24pO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KG1peChjdXJyZW50Q29sb3IucmdiLCAobmV3Q29sb3IgKyBjb2xvckRpZmYpICogY3VycmVudENvbG9yLmEsIGRvUmVwbGFjZSksIGN1cnJlbnRDb2xvci5hKTtcXG59XFxuXCIsbj1mdW5jdGlvbihvKXtmdW5jdGlvbiBuKG4saSx0KXt2b2lkIDA9PT1uJiYobj0xNjcxMTY4MCksdm9pZCAwPT09aSYmKGk9MCksdm9pZCAwPT09dCYmKHQ9LjQpLG8uY2FsbCh0aGlzLGUsciksdGhpcy5vcmlnaW5hbENvbG9yPW4sdGhpcy5uZXdDb2xvcj1pLHRoaXMuZXBzaWxvbj10fW8mJihuLl9fcHJvdG9fXz1vKSwobi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShvJiZvLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW47dmFyIGk9e29yaWdpbmFsQ29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sbmV3Q29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sZXBzaWxvbjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkub3JpZ2luYWxDb2xvci5zZXQ9ZnVuY3Rpb24obyl7dmFyIGU9dGhpcy51bmlmb3Jtcy5vcmlnaW5hbENvbG9yO1wibnVtYmVyXCI9PXR5cGVvZiBvPyhQSVhJLnV0aWxzLmhleDJyZ2IobyxlKSx0aGlzLl9vcmlnaW5hbENvbG9yPW8pOihlWzBdPW9bMF0sZVsxXT1vWzFdLGVbMl09b1syXSx0aGlzLl9vcmlnaW5hbENvbG9yPVBJWEkudXRpbHMucmdiMmhleChlKSl9LGkub3JpZ2luYWxDb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fb3JpZ2luYWxDb2xvcn0saS5uZXdDb2xvci5zZXQ9ZnVuY3Rpb24obyl7dmFyIGU9dGhpcy51bmlmb3Jtcy5uZXdDb2xvcjtcIm51bWJlclwiPT10eXBlb2Ygbz8oUElYSS51dGlscy5oZXgycmdiKG8sZSksdGhpcy5fbmV3Q29sb3I9byk6KGVbMF09b1swXSxlWzFdPW9bMV0sZVsyXT1vWzJdLHRoaXMuX25ld0NvbG9yPVBJWEkudXRpbHMucmdiMmhleChlKSl9LGkubmV3Q29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX25ld0NvbG9yfSxpLmVwc2lsb24uc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMuZXBzaWxvbj1vfSxpLmVwc2lsb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZXBzaWxvbn0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsaSksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Db2xvclJlcGxhY2VGaWx0ZXI9bixvLkNvbG9yUmVwbGFjZUZpbHRlcj1uLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItY29sb3ItcmVwbGFjZS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWNvbnZvbHV0aW9uIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1jb252b2x1dGlvbiBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzIgdGV4ZWxTaXplO1xcbnVuaWZvcm0gZmxvYXQgbWF0cml4WzldO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICB2ZWM0IGMxMSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCAtIHRleGVsU2l6ZSk7IC8vIHRvcCBsZWZ0XFxuICAgdmVjNCBjMTIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgLSB0ZXhlbFNpemUueSkpOyAvLyB0b3AgY2VudGVyXFxuICAgdmVjNCBjMTMgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54ICsgdGV4ZWxTaXplLngsIHZUZXh0dXJlQ29vcmQueSAtIHRleGVsU2l6ZS55KSk7IC8vIHRvcCByaWdodFxcblxcbiAgIHZlYzQgYzIxID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCAtIHRleGVsU2l6ZS54LCB2VGV4dHVyZUNvb3JkLnkpKTsgLy8gbWlkIGxlZnRcXG4gICB2ZWM0IGMyMiA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7IC8vIG1pZCBjZW50ZXJcXG4gICB2ZWM0IGMyMyA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggKyB0ZXhlbFNpemUueCwgdlRleHR1cmVDb29yZC55KSk7IC8vIG1pZCByaWdodFxcblxcbiAgIHZlYzQgYzMxID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCAtIHRleGVsU2l6ZS54LCB2VGV4dHVyZUNvb3JkLnkgKyB0ZXhlbFNpemUueSkpOyAvLyBib3R0b20gbGVmdFxcbiAgIHZlYzQgYzMyID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55ICsgdGV4ZWxTaXplLnkpKTsgLy8gYm90dG9tIGNlbnRlclxcbiAgIHZlYzQgYzMzID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgdGV4ZWxTaXplKTsgLy8gYm90dG9tIHJpZ2h0XFxuXFxuICAgZ2xfRnJhZ0NvbG9yID1cXG4gICAgICAgYzExICogbWF0cml4WzBdICsgYzEyICogbWF0cml4WzFdICsgYzEzICogbWF0cml4WzJdICtcXG4gICAgICAgYzIxICogbWF0cml4WzNdICsgYzIyICogbWF0cml4WzRdICsgYzIzICogbWF0cml4WzVdICtcXG4gICAgICAgYzMxICogbWF0cml4WzZdICsgYzMyICogbWF0cml4WzddICsgYzMzICogbWF0cml4WzhdO1xcblxcbiAgIGdsX0ZyYWdDb2xvci5hID0gYzIyLmE7XFxufVxcblwiLG89ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbyhvLGksbil7ZS5jYWxsKHRoaXMsdCxyKSx0aGlzLm1hdHJpeD1vLHRoaXMud2lkdGg9aSx0aGlzLmhlaWdodD1ufWUmJihvLl9fcHJvdG9fXz1lKSwoby5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW87dmFyIGk9e21hdHJpeDp7Y29uZmlndXJhYmxlOiEwfSx3aWR0aDp7Y29uZmlndXJhYmxlOiEwfSxoZWlnaHQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLm1hdHJpeC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5tYXRyaXh9LGkubWF0cml4LnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLm1hdHJpeD1uZXcgRmxvYXQzMkFycmF5KGUpfSxpLndpZHRoLmdldD1mdW5jdGlvbigpe3JldHVybiAxL3RoaXMudW5pZm9ybXMudGV4ZWxTaXplWzBdfSxpLndpZHRoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnRleGVsU2l6ZVswXT0xL2V9LGkuaGVpZ2h0LmdldD1mdW5jdGlvbigpe3JldHVybiAxL3RoaXMudW5pZm9ybXMudGV4ZWxTaXplWzFdfSxpLmhlaWdodC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy50ZXhlbFNpemVbMV09MS9lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvLnByb3RvdHlwZSxpKSxvfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkNvbnZvbHV0aW9uRmlsdGVyPW8sZS5Db252b2x1dGlvbkZpbHRlcj1vLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItY29udm9sdXRpb24uanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1jcm9zcy1oYXRjaCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItY3Jvc3MtaGF0Y2ggaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obyxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKG8uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZmxvYXQgbHVtID0gbGVuZ3RoKHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZC54eSkucmdiKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgxLjAsIDEuMCwgMS4wLCAxLjApO1xcblxcbiAgICBpZiAobHVtIDwgMS4wMClcXG4gICAge1xcbiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCArIGdsX0ZyYWdDb29yZC55LCAxMC4wKSA9PSAwLjApXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAxLjApO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIGlmIChsdW0gPCAwLjc1KVxcbiAgICB7XFxuICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54IC0gZ2xfRnJhZ0Nvb3JkLnksIDEwLjApID09IDAuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgaWYgKGx1bSA8IDAuNTApXFxuICAgIHtcXG4gICAgICAgIGlmIChtb2QoZ2xfRnJhZ0Nvb3JkLnggKyBnbF9GcmFnQ29vcmQueSAtIDUuMCwgMTAuMCkgPT0gMC4wKVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBpZiAobHVtIDwgMC4zKVxcbiAgICB7XFxuICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54IC0gZ2xfRnJhZ0Nvb3JkLnkgLSA1LjAsIDEwLjApID09IDAuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XFxuICAgICAgICB9XFxuICAgIH1cXG59XFxuXCIsZT1mdW5jdGlvbihvKXtmdW5jdGlvbiBlKCl7by5jYWxsKHRoaXMsbixyKX1yZXR1cm4gbyYmKGUuX19wcm90b19fPW8pLGUucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobyYmby5wcm90b3R5cGUpLGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPWUsZX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Dcm9zc0hhdGNoRmlsdGVyPWUsby5Dcm9zc0hhdGNoRmlsdGVyPWUsT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1jcm9zcy1oYXRjaC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWRvdCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItZG90IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcblxcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gZmxvYXQgYW5nbGU7XFxudW5pZm9ybSBmbG9hdCBzY2FsZTtcXG5cXG5mbG9hdCBwYXR0ZXJuKClcXG57XFxuICAgZmxvYXQgcyA9IHNpbihhbmdsZSksIGMgPSBjb3MoYW5nbGUpO1xcbiAgIHZlYzIgdGV4ID0gdlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHk7XFxuICAgdmVjMiBwb2ludCA9IHZlYzIoXFxuICAgICAgIGMgKiB0ZXgueCAtIHMgKiB0ZXgueSxcXG4gICAgICAgcyAqIHRleC54ICsgYyAqIHRleC55XFxuICAgKSAqIHNjYWxlO1xcbiAgIHJldHVybiAoc2luKHBvaW50LngpICogc2luKHBvaW50LnkpKSAqIDQuMDtcXG59XFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgZmxvYXQgYXZlcmFnZSA9IChjb2xvci5yICsgY29sb3IuZyArIGNvbG9yLmIpIC8gMy4wO1xcbiAgIGdsX0ZyYWdDb2xvciA9IHZlYzQodmVjMyhhdmVyYWdlICogMTAuMCAtIDUuMCArIHBhdHRlcm4oKSksIGNvbG9yLmEpO1xcbn1cXG5cIixvPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG8obyxyKXt2b2lkIDA9PT1vJiYobz0xKSx2b2lkIDA9PT1yJiYocj01KSxlLmNhbGwodGhpcyxuLHQpLHRoaXMuc2NhbGU9byx0aGlzLmFuZ2xlPXJ9ZSYmKG8uX19wcm90b19fPWUpLChvLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bzt2YXIgcj17c2NhbGU6e2NvbmZpZ3VyYWJsZTohMH0sYW5nbGU6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnNjYWxlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNjYWxlfSxyLnNjYWxlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnNjYWxlPWV9LHIuYW5nbGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYW5nbGV9LHIuYW5nbGUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYW5nbGU9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoby5wcm90b3R5cGUsciksb30oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Eb3RGaWx0ZXI9byxlLkRvdEZpbHRlcj1vLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZG90LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKHQsZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZSh0Ll9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IGFscGhhO1xcbnVuaWZvcm0gdmVjMyBjb2xvcjtcXG52b2lkIG1haW4odm9pZCl7XFxuICAgIHZlYzQgc2FtcGxlID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgLy8gVW4tcHJlbXVsdGlwbHkgYWxwaGEgYmVmb3JlIGFwcGx5aW5nIHRoZSBjb2xvclxcbiAgICBpZiAoc2FtcGxlLmEgPiAwLjApIHtcXG4gICAgICAgIHNhbXBsZS5yZ2IgLz0gc2FtcGxlLmE7XFxuICAgIH1cXG5cXG4gICAgLy8gUHJlbXVsdGlwbHkgYWxwaGEgYWdhaW5cXG4gICAgc2FtcGxlLnJnYiA9IGNvbG9yLnJnYiAqIHNhbXBsZS5hO1xcblxcbiAgICAvLyBhbHBoYSB1c2VyIGFscGhhXFxuICAgIHNhbXBsZSAqPSBhbHBoYTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gc2FtcGxlO1xcbn1cIixpPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGkoaSxuLG8sYSxsKXt2b2lkIDA9PT1pJiYoaT00NSksdm9pZCAwPT09biYmKG49NSksdm9pZCAwPT09byYmKG89Miksdm9pZCAwPT09YSYmKGE9MCksdm9pZCAwPT09bCYmKGw9LjUpLHQuY2FsbCh0aGlzKSx0aGlzLnRpbnRGaWx0ZXI9bmV3IFBJWEkuRmlsdGVyKGUsciksdGhpcy5ibHVyRmlsdGVyPW5ldyBQSVhJLmZpbHRlcnMuQmx1ckZpbHRlcix0aGlzLmJsdXJGaWx0ZXIuYmx1cj1vLHRoaXMudGFyZ2V0VHJhbnNmb3JtPW5ldyBQSVhJLk1hdHJpeCx0aGlzLnJvdGF0aW9uPWksdGhpcy5wYWRkaW5nPW4sdGhpcy5kaXN0YW5jZT1uLHRoaXMuYWxwaGE9bCx0aGlzLmNvbG9yPWF9dCYmKGkuX19wcm90b19fPXQpLChpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9aTt2YXIgbj17ZGlzdGFuY2U6e2NvbmZpZ3VyYWJsZTohMH0scm90YXRpb246e2NvbmZpZ3VyYWJsZTohMH0sYmx1cjp7Y29uZmlndXJhYmxlOiEwfSxhbHBoYTp7Y29uZmlndXJhYmxlOiEwfSxjb2xvcjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKHQsZSxyLGkpe3ZhciBuPXQuZ2V0UmVuZGVyVGFyZ2V0KCk7bi50cmFuc2Zvcm09dGhpcy50YXJnZXRUcmFuc2Zvcm0sdGhpcy50aW50RmlsdGVyLmFwcGx5KHQsZSxuLCEwKSx0aGlzLmJsdXJGaWx0ZXIuYXBwbHkodCxuLHIpLHQuYXBwbHlGaWx0ZXIodGhpcyxlLHIsaSksbi50cmFuc2Zvcm09bnVsbCx0LnJldHVyblJlbmRlclRhcmdldChuKX0saS5wcm90b3R5cGUuX3VwZGF0ZVBhZGRpbmc9ZnVuY3Rpb24oKXt0aGlzLnBhZGRpbmc9dGhpcy5kaXN0YW5jZSsyKnRoaXMuYmx1cn0saS5wcm90b3R5cGUuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMudGFyZ2V0VHJhbnNmb3JtLnR4PXRoaXMuZGlzdGFuY2UqTWF0aC5jb3ModGhpcy5hbmdsZSksdGhpcy50YXJnZXRUcmFuc2Zvcm0udHk9dGhpcy5kaXN0YW5jZSpNYXRoLnNpbih0aGlzLmFuZ2xlKX0sbi5kaXN0YW5jZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGlzdGFuY2V9LG4uZGlzdGFuY2Uuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuX2Rpc3RhbmNlPXQsdGhpcy5fdXBkYXRlUGFkZGluZygpLHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxuLnJvdGF0aW9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmFuZ2xlL1BJWEkuREVHX1RPX1JBRH0sbi5yb3RhdGlvbi5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5hbmdsZT10KlBJWEkuREVHX1RPX1JBRCx0aGlzLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm0oKX0sbi5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJGaWx0ZXIuYmx1cn0sbi5ibHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLmJsdXJGaWx0ZXIuYmx1cj10LHRoaXMuX3VwZGF0ZVBhZGRpbmcoKX0sbi5hbHBoYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhfSxuLmFscGhhLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuYWxwaGE9dH0sbi5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gUElYSS51dGlscy5yZ2IyaGV4KHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LG4uY29sb3Iuc2V0PWZ1bmN0aW9uKHQpe1BJWEkudXRpbHMuaGV4MnJnYih0LHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGkucHJvdG90eXBlLG4pLGl9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuRHJvcFNoYWRvd0ZpbHRlcj1pLHQuRHJvcFNoYWRvd0ZpbHRlcj1pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZHJvcC1zaGFkb3cuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1lbWJvc3MgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWVtYm9zcyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBzdHJlbmd0aDtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuXFx0dmVjMiBvbmVQaXhlbCA9IHZlYzIoMS4wIC8gZmlsdGVyQXJlYSk7XFxuXFxuXFx0dmVjNCBjb2xvcjtcXG5cXG5cXHRjb2xvci5yZ2IgPSB2ZWMzKDAuNSk7XFxuXFxuXFx0Y29sb3IgLT0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkIC0gb25lUGl4ZWwpICogc3RyZW5ndGg7XFxuXFx0Y29sb3IgKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgb25lUGl4ZWwpICogc3RyZW5ndGg7XFxuXFxuXFx0Y29sb3IucmdiID0gdmVjMygoY29sb3IuciArIGNvbG9yLmcgKyBjb2xvci5iKSAvIDMuMCk7XFxuXFxuXFx0ZmxvYXQgYWxwaGEgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpLmE7XFxuXFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvci5yZ2IgKiBhbHBoYSwgYWxwaGEpO1xcbn1cXG5cIixvPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG8obyl7dm9pZCAwPT09byYmKG89NSksZS5jYWxsKHRoaXMsdCxyKSx0aGlzLnN0cmVuZ3RoPW99ZSYmKG8uX19wcm90b19fPWUpLChvLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bzt2YXIgbj17c3RyZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnN0cmVuZ3RofSxuLnN0cmVuZ3RoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnN0cmVuZ3RoPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG8ucHJvdG90eXBlLG4pLG99KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuRW1ib3NzRmlsdGVyPW8sZS5FbWJvc3NGaWx0ZXI9byxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWVtYm9zcy5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWdsb3cgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWdsb3cgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obyxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKG8uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSBmbG9hdCBkaXN0YW5jZTtcXG51bmlmb3JtIGZsb2F0IG91dGVyU3RyZW5ndGg7XFxudW5pZm9ybSBmbG9hdCBpbm5lclN0cmVuZ3RoO1xcbnVuaWZvcm0gdmVjNCBnbG93Q29sb3I7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckNsYW1wO1xcbnZlYzIgcHggPSB2ZWMyKDEuMCAvIGZpbHRlckFyZWEueCwgMS4wIC8gZmlsdGVyQXJlYS55KTtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICBjb25zdCBmbG9hdCBQSSA9IDMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQ7XFxuICAgIHZlYzQgb3duQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWM0IGN1ckNvbG9yO1xcbiAgICBmbG9hdCB0b3RhbEFscGhhID0gMC4wO1xcbiAgICBmbG9hdCBtYXhUb3RhbEFscGhhID0gMC4wO1xcbiAgICBmbG9hdCBjb3NBbmdsZTtcXG4gICAgZmxvYXQgc2luQW5nbGU7XFxuICAgIHZlYzIgZGlzcGxhY2VkO1xcbiAgICBmb3IgKGZsb2F0IGFuZ2xlID0gMC4wOyBhbmdsZSA8PSBQSSAqIDIuMDsgYW5nbGUgKz0gJVFVQUxJVFlfRElTVCUpIHtcXG4gICAgICAgY29zQW5nbGUgPSBjb3MoYW5nbGUpO1xcbiAgICAgICBzaW5BbmdsZSA9IHNpbihhbmdsZSk7XFxuICAgICAgIGZvciAoZmxvYXQgY3VyRGlzdGFuY2UgPSAxLjA7IGN1ckRpc3RhbmNlIDw9ICVESVNUJTsgY3VyRGlzdGFuY2UrKykge1xcbiAgICAgICAgICAgZGlzcGxhY2VkLnggPSB2VGV4dHVyZUNvb3JkLnggKyBjb3NBbmdsZSAqIGN1ckRpc3RhbmNlICogcHgueDtcXG4gICAgICAgICAgIGRpc3BsYWNlZC55ID0gdlRleHR1cmVDb29yZC55ICsgc2luQW5nbGUgKiBjdXJEaXN0YW5jZSAqIHB4Lnk7XFxuICAgICAgICAgICBjdXJDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY2xhbXAoZGlzcGxhY2VkLCBmaWx0ZXJDbGFtcC54eSwgZmlsdGVyQ2xhbXAuencpKTtcXG4gICAgICAgICAgIHRvdGFsQWxwaGEgKz0gKGRpc3RhbmNlIC0gY3VyRGlzdGFuY2UpICogY3VyQ29sb3IuYTtcXG4gICAgICAgICAgIG1heFRvdGFsQWxwaGEgKz0gKGRpc3RhbmNlIC0gY3VyRGlzdGFuY2UpO1xcbiAgICAgICB9XFxuICAgIH1cXG4gICAgbWF4VG90YWxBbHBoYSA9IG1heChtYXhUb3RhbEFscGhhLCAwLjAwMDEpO1xcblxcbiAgICBvd25Db2xvci5hID0gbWF4KG93bkNvbG9yLmEsIDAuMDAwMSk7XFxuICAgIG93bkNvbG9yLnJnYiA9IG93bkNvbG9yLnJnYiAvIG93bkNvbG9yLmE7XFxuICAgIGZsb2F0IG91dGVyR2xvd0FscGhhID0gKHRvdGFsQWxwaGEgLyBtYXhUb3RhbEFscGhhKSAgKiBvdXRlclN0cmVuZ3RoICogKDEuIC0gb3duQ29sb3IuYSk7XFxuICAgIGZsb2F0IGlubmVyR2xvd0FscGhhID0gKChtYXhUb3RhbEFscGhhIC0gdG90YWxBbHBoYSkgLyBtYXhUb3RhbEFscGhhKSAqIGlubmVyU3RyZW5ndGggKiBvd25Db2xvci5hO1xcbiAgICBmbG9hdCByZXN1bHRBbHBoYSA9IChvd25Db2xvci5hICsgb3V0ZXJHbG93QWxwaGEpO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KG1peChtaXgob3duQ29sb3IucmdiLCBnbG93Q29sb3IucmdiLCBpbm5lckdsb3dBbHBoYSAvIG93bkNvbG9yLmEpLCBnbG93Q29sb3IucmdiLCBvdXRlckdsb3dBbHBoYSAvIHJlc3VsdEFscGhhKSAqIHJlc3VsdEFscGhhLCByZXN1bHRBbHBoYSk7XFxufVxcblwiLGU9ZnVuY3Rpb24obyl7ZnVuY3Rpb24gZShlLHIsaSxsLGEpe3ZvaWQgMD09PWUmJihlPTEwKSx2b2lkIDA9PT1yJiYocj00KSx2b2lkIDA9PT1pJiYoaT0wKSx2b2lkIDA9PT1sJiYobD0xNjc3NzIxNSksdm9pZCAwPT09YSYmKGE9LjEpLG8uY2FsbCh0aGlzLG4sdC5yZXBsYWNlKC8lUVVBTElUWV9ESVNUJS9naSxcIlwiKygxL2EvZSkudG9GaXhlZCg3KSkucmVwbGFjZSgvJURJU1QlL2dpLFwiXCIrZS50b0ZpeGVkKDcpKSksdGhpcy51bmlmb3Jtcy5nbG93Q29sb3I9bmV3IEZsb2F0MzJBcnJheShbMCwwLDAsMV0pLHRoaXMuZGlzdGFuY2U9ZSx0aGlzLmNvbG9yPWwsdGhpcy5vdXRlclN0cmVuZ3RoPXIsdGhpcy5pbm5lclN0cmVuZ3RoPWl9byYmKGUuX19wcm90b19fPW8pLChlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG8mJm8ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9ZTt2YXIgcj17Y29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sZGlzdGFuY2U6e2NvbmZpZ3VyYWJsZTohMH0sb3V0ZXJTdHJlbmd0aDp7Y29uZmlndXJhYmxlOiEwfSxpbm5lclN0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gUElYSS51dGlscy5yZ2IyaGV4KHRoaXMudW5pZm9ybXMuZ2xvd0NvbG9yKX0sci5jb2xvci5zZXQ9ZnVuY3Rpb24obyl7UElYSS51dGlscy5oZXgycmdiKG8sdGhpcy51bmlmb3Jtcy5nbG93Q29sb3IpfSxyLmRpc3RhbmNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmRpc3RhbmNlfSxyLmRpc3RhbmNlLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLmRpc3RhbmNlPW99LHIub3V0ZXJTdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5vdXRlclN0cmVuZ3RofSxyLm91dGVyU3RyZW5ndGguc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMub3V0ZXJTdHJlbmd0aD1vfSxyLmlubmVyU3RyZW5ndGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuaW5uZXJTdHJlbmd0aH0sci5pbm5lclN0cmVuZ3RoLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLmlubmVyU3RyZW5ndGg9b30sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZS5wcm90b3R5cGUsciksZX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5HbG93RmlsdGVyPWUsby5HbG93RmlsdGVyPWUsT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1nbG93LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItZ29kcmF5IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1nb2RyYXkgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obixlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKG4uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInZlYzMgbW9kMjg5KHZlYzMgeClcXG57XFxuICAgIHJldHVybiB4IC0gZmxvb3IoeCAqICgxLjAgLyAyODkuMCkpICogMjg5LjA7XFxufVxcbnZlYzQgbW9kMjg5KHZlYzQgeClcXG57XFxuICAgIHJldHVybiB4IC0gZmxvb3IoeCAqICgxLjAgLyAyODkuMCkpICogMjg5LjA7XFxufVxcbnZlYzQgcGVybXV0ZSh2ZWM0IHgpXFxue1xcbiAgICByZXR1cm4gbW9kMjg5KCgoeCAqIDM0LjApICsgMS4wKSAqIHgpO1xcbn1cXG52ZWM0IHRheWxvckludlNxcnQodmVjNCByKVxcbntcXG4gICAgcmV0dXJuIDEuNzkyODQyOTE0MDAxNTkgLSAwLjg1MzczNDcyMDk1MzE0ICogcjtcXG59XFxudmVjMyBmYWRlKHZlYzMgdClcXG57XFxuICAgIHJldHVybiB0ICogdCAqIHQgKiAodCAqICh0ICogNi4wIC0gMTUuMCkgKyAxMC4wKTtcXG59XFxuLy8gQ2xhc3NpYyBQZXJsaW4gbm9pc2UsIHBlcmlvZGljIHZhcmlhbnRcXG5mbG9hdCBwbm9pc2UodmVjMyBQLCB2ZWMzIHJlcClcXG57XFxuICAgIHZlYzMgUGkwID0gbW9kKGZsb29yKFApLCByZXApOyAvLyBJbnRlZ2VyIHBhcnQsIG1vZHVsbyBwZXJpb2RcXG4gICAgdmVjMyBQaTEgPSBtb2QoUGkwICsgdmVjMygxLjApLCByZXApOyAvLyBJbnRlZ2VyIHBhcnQgKyAxLCBtb2QgcGVyaW9kXFxuICAgIFBpMCA9IG1vZDI4OShQaTApO1xcbiAgICBQaTEgPSBtb2QyODkoUGkxKTtcXG4gICAgdmVjMyBQZjAgPSBmcmFjdChQKTsgLy8gRnJhY3Rpb25hbCBwYXJ0IGZvciBpbnRlcnBvbGF0aW9uXFxuICAgIHZlYzMgUGYxID0gUGYwIC0gdmVjMygxLjApOyAvLyBGcmFjdGlvbmFsIHBhcnQgLSAxLjBcXG4gICAgdmVjNCBpeCA9IHZlYzQoUGkwLngsIFBpMS54LCBQaTAueCwgUGkxLngpO1xcbiAgICB2ZWM0IGl5ID0gdmVjNChQaTAueXksIFBpMS55eSk7XFxuICAgIHZlYzQgaXowID0gUGkwLnp6eno7XFxuICAgIHZlYzQgaXoxID0gUGkxLnp6eno7XFxuICAgIHZlYzQgaXh5ID0gcGVybXV0ZShwZXJtdXRlKGl4KSArIGl5KTtcXG4gICAgdmVjNCBpeHkwID0gcGVybXV0ZShpeHkgKyBpejApO1xcbiAgICB2ZWM0IGl4eTEgPSBwZXJtdXRlKGl4eSArIGl6MSk7XFxuICAgIHZlYzQgZ3gwID0gaXh5MCAqICgxLjAgLyA3LjApO1xcbiAgICB2ZWM0IGd5MCA9IGZyYWN0KGZsb29yKGd4MCkgKiAoMS4wIC8gNy4wKSkgLSAwLjU7XFxuICAgIGd4MCA9IGZyYWN0KGd4MCk7XFxuICAgIHZlYzQgZ3owID0gdmVjNCgwLjUpIC0gYWJzKGd4MCkgLSBhYnMoZ3kwKTtcXG4gICAgdmVjNCBzejAgPSBzdGVwKGd6MCwgdmVjNCgwLjApKTtcXG4gICAgZ3gwIC09IHN6MCAqIChzdGVwKDAuMCwgZ3gwKSAtIDAuNSk7XFxuICAgIGd5MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd5MCkgLSAwLjUpO1xcbiAgICB2ZWM0IGd4MSA9IGl4eTEgKiAoMS4wIC8gNy4wKTtcXG4gICAgdmVjNCBneTEgPSBmcmFjdChmbG9vcihneDEpICogKDEuMCAvIDcuMCkpIC0gMC41O1xcbiAgICBneDEgPSBmcmFjdChneDEpO1xcbiAgICB2ZWM0IGd6MSA9IHZlYzQoMC41KSAtIGFicyhneDEpIC0gYWJzKGd5MSk7XFxuICAgIHZlYzQgc3oxID0gc3RlcChnejEsIHZlYzQoMC4wKSk7XFxuICAgIGd4MSAtPSBzejEgKiAoc3RlcCgwLjAsIGd4MSkgLSAwLjUpO1xcbiAgICBneTEgLT0gc3oxICogKHN0ZXAoMC4wLCBneTEpIC0gMC41KTtcXG4gICAgdmVjMyBnMDAwID0gdmVjMyhneDAueCwgZ3kwLngsIGd6MC54KTtcXG4gICAgdmVjMyBnMTAwID0gdmVjMyhneDAueSwgZ3kwLnksIGd6MC55KTtcXG4gICAgdmVjMyBnMDEwID0gdmVjMyhneDAueiwgZ3kwLnosIGd6MC56KTtcXG4gICAgdmVjMyBnMTEwID0gdmVjMyhneDAudywgZ3kwLncsIGd6MC53KTtcXG4gICAgdmVjMyBnMDAxID0gdmVjMyhneDEueCwgZ3kxLngsIGd6MS54KTtcXG4gICAgdmVjMyBnMTAxID0gdmVjMyhneDEueSwgZ3kxLnksIGd6MS55KTtcXG4gICAgdmVjMyBnMDExID0gdmVjMyhneDEueiwgZ3kxLnosIGd6MS56KTtcXG4gICAgdmVjMyBnMTExID0gdmVjMyhneDEudywgZ3kxLncsIGd6MS53KTtcXG4gICAgdmVjNCBub3JtMCA9IHRheWxvckludlNxcnQodmVjNChkb3QoZzAwMCwgZzAwMCksIGRvdChnMDEwLCBnMDEwKSwgZG90KGcxMDAsIGcxMDApLCBkb3QoZzExMCwgZzExMCkpKTtcXG4gICAgZzAwMCAqPSBub3JtMC54O1xcbiAgICBnMDEwICo9IG5vcm0wLnk7XFxuICAgIGcxMDAgKj0gbm9ybTAuejtcXG4gICAgZzExMCAqPSBub3JtMC53O1xcbiAgICB2ZWM0IG5vcm0xID0gdGF5bG9ySW52U3FydCh2ZWM0KGRvdChnMDAxLCBnMDAxKSwgZG90KGcwMTEsIGcwMTEpLCBkb3QoZzEwMSwgZzEwMSksIGRvdChnMTExLCBnMTExKSkpO1xcbiAgICBnMDAxICo9IG5vcm0xLng7XFxuICAgIGcwMTEgKj0gbm9ybTEueTtcXG4gICAgZzEwMSAqPSBub3JtMS56O1xcbiAgICBnMTExICo9IG5vcm0xLnc7XFxuICAgIGZsb2F0IG4wMDAgPSBkb3QoZzAwMCwgUGYwKTtcXG4gICAgZmxvYXQgbjEwMCA9IGRvdChnMTAwLCB2ZWMzKFBmMS54LCBQZjAueXopKTtcXG4gICAgZmxvYXQgbjAxMCA9IGRvdChnMDEwLCB2ZWMzKFBmMC54LCBQZjEueSwgUGYwLnopKTtcXG4gICAgZmxvYXQgbjExMCA9IGRvdChnMTEwLCB2ZWMzKFBmMS54eSwgUGYwLnopKTtcXG4gICAgZmxvYXQgbjAwMSA9IGRvdChnMDAxLCB2ZWMzKFBmMC54eSwgUGYxLnopKTtcXG4gICAgZmxvYXQgbjEwMSA9IGRvdChnMTAxLCB2ZWMzKFBmMS54LCBQZjAueSwgUGYxLnopKTtcXG4gICAgZmxvYXQgbjAxMSA9IGRvdChnMDExLCB2ZWMzKFBmMC54LCBQZjEueXopKTtcXG4gICAgZmxvYXQgbjExMSA9IGRvdChnMTExLCBQZjEpO1xcbiAgICB2ZWMzIGZhZGVfeHl6ID0gZmFkZShQZjApO1xcbiAgICB2ZWM0IG5feiA9IG1peCh2ZWM0KG4wMDAsIG4xMDAsIG4wMTAsIG4xMTApLCB2ZWM0KG4wMDEsIG4xMDEsIG4wMTEsIG4xMTEpLCBmYWRlX3h5ei56KTtcXG4gICAgdmVjMiBuX3l6ID0gbWl4KG5fei54eSwgbl96Lnp3LCBmYWRlX3h5ei55KTtcXG4gICAgZmxvYXQgbl94eXogPSBtaXgobl95ei54LCBuX3l6LnksIGZhZGVfeHl6LngpO1xcbiAgICByZXR1cm4gMi4yICogbl94eXo7XFxufVxcbmZsb2F0IHR1cmIodmVjMyBQLCB2ZWMzIHJlcCwgZmxvYXQgbGFjdW5hcml0eSwgZmxvYXQgZ2FpbilcXG57XFxuICAgIGZsb2F0IHN1bSA9IDAuMDtcXG4gICAgZmxvYXQgc2MgPSAxLjA7XFxuICAgIGZsb2F0IHRvdGFsZ2FpbiA9IDEuMDtcXG4gICAgZm9yIChmbG9hdCBpID0gMC4wOyBpIDwgNi4wOyBpKyspXFxuICAgIHtcXG4gICAgICAgIHN1bSArPSB0b3RhbGdhaW4gKiBwbm9pc2UoUCAqIHNjLCByZXApO1xcbiAgICAgICAgc2MgKj0gbGFjdW5hcml0eTtcXG4gICAgICAgIHRvdGFsZ2FpbiAqPSBnYWluO1xcbiAgICB9XFxuICAgIHJldHVybiBhYnMoc3VtKTtcXG59XFxuXCIsaT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjMiBkaW1lbnNpb25zO1xcblxcbnVuaWZvcm0gdmVjMiBhbmdsZURpcjtcXG51bmlmb3JtIGZsb2F0IGdhaW47XFxudW5pZm9ybSBmbG9hdCBsYWN1bmFyaXR5O1xcbnVuaWZvcm0gZmxvYXQgdGltZTtcXG5cXG4ke3Blcmxpbn1cXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHkgLyBkaW1lbnNpb25zLnh5O1xcblxcbiAgICBmbG9hdCB4eCA9IGFuZ2xlRGlyLng7XFxuICAgIGZsb2F0IHl5ID0gYW5nbGVEaXIueTtcXG5cXG4gICAgZmxvYXQgZCA9ICh4eCAqIGNvb3JkLngpICsgKHl5ICogY29vcmQueSk7XFxuICAgIHZlYzMgZGlyID0gdmVjMyhkLCBkLCAwLjApO1xcblxcbiAgICBmbG9hdCBub2lzZSA9IHR1cmIoZGlyICsgdmVjMyh0aW1lLCAwLjAsIDYyLjEgKyB0aW1lKSAqIDAuMDUsIHZlYzMoNDgwLjAsIDMyMC4wLCA0ODAuMCksIGxhY3VuYXJpdHksIGdhaW4pO1xcbiAgICBub2lzZSA9IG1peChub2lzZSwgMC4wLCAwLjMpO1xcbiAgICAvL2ZhZGUgdmVydGljYWxseS5cXG4gICAgdmVjNCBtaXN0ID0gdmVjNChub2lzZSwgbm9pc2UsIG5vaXNlLCAxLjApICogKDEuMCAtIGNvb3JkLnkpO1xcbiAgICBtaXN0LmEgPSAxLjA7XFxuICAgIGdsX0ZyYWdDb2xvciArPSBtaXN0O1xcbn1cXG5cIixvPWZ1bmN0aW9uKG4pe2Z1bmN0aW9uIG8obyxyLGEsYyl7dm9pZCAwPT09byYmKG89MzApLHZvaWQgMD09PXImJihyPS41KSx2b2lkIDA9PT1hJiYoYT0yLjUpLHZvaWQgMD09PWMmJihjPTApLG4uY2FsbCh0aGlzLGUsaS5yZXBsYWNlKFwiJHtwZXJsaW59XCIsdCkpLHRoaXMuYW5nbGU9byx0aGlzLmdhaW49cix0aGlzLmxhY3VuYXJpdHk9YSx0aGlzLnRpbWU9Y31uJiYoby5fX3Byb3RvX189biksKG8ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobiYmbi5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1vO3ZhciByPXthbmdsZTp7Y29uZmlndXJhYmxlOiEwfSxnYWluOntjb25maWd1cmFibGU6ITB9LGxhY3VuYXJpdHk6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBvLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihuLGUsdCxpKXt2YXIgbz1lLnNvdXJjZUZyYW1lLndpZHRoLHI9ZS5zb3VyY2VGcmFtZS5oZWlnaHQ7dGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzBdPW8sdGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzFdPXIsdGhpcy51bmlmb3Jtcy50aW1lPXRoaXMudGltZSx0aGlzLnVuaWZvcm1zLmFuZ2xlRGlyWzFdPXRoaXMuX2FuZ2xlU2luKnIvbyxuLmFwcGx5RmlsdGVyKHRoaXMsZSx0LGkpfSxyLmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9hbmdsZX0sci5hbmdsZS5zZXQ9ZnVuY3Rpb24obil7dmFyIGU9bipQSVhJLkRFR19UT19SQUQ7dGhpcy5fYW5nbGVDb3M9TWF0aC5jb3MoZSksdGhpcy5fYW5nbGVTaW49TWF0aC5zaW4oZSksdGhpcy51bmlmb3Jtcy5hbmdsZURpclswXT10aGlzLl9hbmdsZUNvcyx0aGlzLl9hbmdsZT1ufSxyLmdhaW4uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZ2Fpbn0sci5nYWluLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLmdhaW49bn0sci5sYWN1bmFyaXR5LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmxhY3VuYXJpdHl9LHIubGFjdW5hcml0eS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5sYWN1bmFyaXR5PW59LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG8ucHJvdG90eXBlLHIpLG99KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuR29kcmF5RmlsdGVyPW8sbi5Hb2RyYXlGaWx0ZXI9byxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWdvZHJheS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLW1vdGlvbi1ibHVyIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1tb3Rpb24tYmx1ciBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixpPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxuXFxudW5pZm9ybSB2ZWMyIHVWZWxvY2l0eTtcXG51bmlmb3JtIGludCB1S2VybmVsU2l6ZTtcXG51bmlmb3JtIGZsb2F0IHVPZmZzZXQ7XFxuXFxuY29uc3QgaW50IE1BWF9LRVJORUxfU0laRSA9IDIwNDg7XFxuY29uc3QgaW50IElURVJBVElPTiA9IE1BWF9LRVJORUxfU0laRSAtIDE7XFxuXFxudmVjMiB2ZWxvY2l0eSA9IHVWZWxvY2l0eSAvIGZpbHRlckFyZWEueHk7XFxuXFxuLy8gZmxvYXQga2VybmVsU2l6ZSA9IG1pbihmbG9hdCh1S2VybmVsU2l6ZSksIGZsb2F0KE1BWF9LRVJORUxTSVpFKSk7XFxuXFxuLy8gSW4gcmVhbCB1c2UtY2FzZSAsIHVLZXJuZWxTaXplIDwgTUFYX0tFUk5FTFNJWkUgYWxtb3N0IGFsd2F5cy5cXG4vLyBTbyB1c2UgdUtlcm5lbFNpemUgZGlyZWN0bHkuXFxuZmxvYXQga2VybmVsU2l6ZSA9IGZsb2F0KHVLZXJuZWxTaXplKTtcXG5mbG9hdCBrID0ga2VybmVsU2l6ZSAtIDEuMDtcXG5mbG9hdCBvZmZzZXQgPSAtdU9mZnNldCAvIGxlbmd0aCh1VmVsb2NpdHkpIC0gMC41O1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgaWYgKHVLZXJuZWxTaXplID09IDApXFxuICAgIHtcXG4gICAgICAgIHJldHVybjtcXG4gICAgfVxcblxcbiAgICBmb3IoaW50IGkgPSAwOyBpIDwgSVRFUkFUSU9OOyBpKyspIHtcXG4gICAgICAgIGlmIChpID09IGludChrKSkge1xcbiAgICAgICAgICAgIGJyZWFrO1xcbiAgICAgICAgfVxcbiAgICAgICAgdmVjMiBiaWFzID0gdmVsb2NpdHkgKiAoZmxvYXQoaSkgLyBrICsgb2Zmc2V0KTtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBiaWFzKTtcXG4gICAgfVxcbiAgICBnbF9GcmFnQ29sb3IgLz0ga2VybmVsU2l6ZTtcXG59XFxuXCIsbj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKG4sbyxyKXt2b2lkIDA9PT1uJiYobj1bMCwwXSksdm9pZCAwPT09byYmKG89NSksdm9pZCAwPT09ciYmKHI9MCksZS5jYWxsKHRoaXMsdCxpKSx0aGlzLl92ZWxvY2l0eT1uZXcgUElYSS5Qb2ludCgwLDApLHRoaXMudmVsb2NpdHk9bix0aGlzLmtlcm5lbFNpemU9byx0aGlzLm9mZnNldD1yfWUmJihuLl9fcHJvdG9fXz1lKSwobi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW47dmFyIG89e3ZlbG9jaXR5Ontjb25maWd1cmFibGU6ITB9LG9mZnNldDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIG4ucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsdCxpLG4pe3ZhciBvPXRoaXMudmVsb2NpdHkscj1vLngsbD1vLnk7dGhpcy51bmlmb3Jtcy51S2VybmVsU2l6ZT0wIT09cnx8MCE9PWw/dGhpcy5rZXJuZWxTaXplOjAsZS5hcHBseUZpbHRlcih0aGlzLHQsaSxuKX0sby52ZWxvY2l0eS5zZXQ9ZnVuY3Rpb24oZSl7QXJyYXkuaXNBcnJheShlKT8odGhpcy5fdmVsb2NpdHkueD1lWzBdLHRoaXMuX3ZlbG9jaXR5Lnk9ZVsxXSk6ZSBpbnN0YW5jZW9mIFBJWEkuUG9pbnQmJih0aGlzLl92ZWxvY2l0eS54PWUueCx0aGlzLl92ZWxvY2l0eS55PWUueSksdGhpcy51bmlmb3Jtcy51VmVsb2NpdHlbMF09dGhpcy5fdmVsb2NpdHkueCx0aGlzLnVuaWZvcm1zLnVWZWxvY2l0eVsxXT10aGlzLl92ZWxvY2l0eS55fSxvLnZlbG9jaXR5LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl92ZWxvY2l0eX0sby5vZmZzZXQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudU9mZnNldD1lfSxvLm9mZnNldC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51T2Zmc2V0fSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxvKSxufShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLk1vdGlvbkJsdXJGaWx0ZXI9bixlLk1vdGlvbkJsdXJGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLW1vdGlvbi1ibHVyLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihvLGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUoby5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihvKXtcInVzZSBzdHJpY3RcIjt2YXIgZT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSBmbG9hdCBlcHNpbG9uO1xcblxcbmNvbnN0IGludCBNQVhfQ09MT1JTID0gJW1heENvbG9ycyU7XFxuXFxudW5pZm9ybSB2ZWMzIG9yaWdpbmFsQ29sb3JzW01BWF9DT0xPUlNdO1xcbnVuaWZvcm0gdmVjMyB0YXJnZXRDb2xvcnNbTUFYX0NPTE9SU107XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBmbG9hdCBhbHBoYSA9IGdsX0ZyYWdDb2xvci5hO1xcbiAgICBpZiAoYWxwaGEgPCAwLjAwMDEpXFxuICAgIHtcXG4gICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgdmVjMyBjb2xvciA9IGdsX0ZyYWdDb2xvci5yZ2IgLyBhbHBoYTtcXG5cXG4gICAgZm9yKGludCBpID0gMDsgaSA8IE1BWF9DT0xPUlM7IGkrKylcXG4gICAge1xcbiAgICAgIHZlYzMgb3JpZ0NvbG9yID0gb3JpZ2luYWxDb2xvcnNbaV07XFxuICAgICAgaWYgKG9yaWdDb2xvci5yIDwgMC4wKVxcbiAgICAgIHtcXG4gICAgICAgIGJyZWFrO1xcbiAgICAgIH1cXG4gICAgICB2ZWMzIGNvbG9yRGlmZiA9IG9yaWdDb2xvciAtIGNvbG9yO1xcbiAgICAgIGlmIChsZW5ndGgoY29sb3JEaWZmKSA8IGVwc2lsb24pXFxuICAgICAge1xcbiAgICAgICAgdmVjMyB0YXJnZXRDb2xvciA9IHRhcmdldENvbG9yc1tpXTtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoKHRhcmdldENvbG9yICsgY29sb3JEaWZmKSAqIGFscGhhLCBhbHBoYSk7XFxuICAgICAgICByZXR1cm47XFxuICAgICAgfVxcbiAgICB9XFxufVxcblwiLG49ZnVuY3Rpb24obyl7ZnVuY3Rpb24gbihuLHQsaSl7dm9pZCAwPT09dCYmKHQ9LjA1KSx2b2lkIDA9PT1pJiYoaT1udWxsKSxpPWl8fG4ubGVuZ3RoLG8uY2FsbCh0aGlzLGUsci5yZXBsYWNlKC8lbWF4Q29sb3JzJS9nLGkpKSx0aGlzLmVwc2lsb249dCx0aGlzLl9tYXhDb2xvcnM9aSx0aGlzLl9yZXBsYWNlbWVudHM9bnVsbCx0aGlzLnVuaWZvcm1zLm9yaWdpbmFsQ29sb3JzPW5ldyBGbG9hdDMyQXJyYXkoMyppKSx0aGlzLnVuaWZvcm1zLnRhcmdldENvbG9ycz1uZXcgRmxvYXQzMkFycmF5KDMqaSksdGhpcy5yZXBsYWNlbWVudHM9bn1vJiYobi5fX3Byb3RvX189byksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobyYmby5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciB0PXtyZXBsYWNlbWVudHM6e2NvbmZpZ3VyYWJsZTohMH0sbWF4Q29sb3JzOntjb25maWd1cmFibGU6ITB9LGVwc2lsb246e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiB0LnJlcGxhY2VtZW50cy5zZXQ9ZnVuY3Rpb24obyl7dmFyIGU9dGhpcy51bmlmb3Jtcy5vcmlnaW5hbENvbG9ycyxyPXRoaXMudW5pZm9ybXMudGFyZ2V0Q29sb3JzLG49by5sZW5ndGg7aWYobj50aGlzLl9tYXhDb2xvcnMpdGhyb3dcIkxlbmd0aCBvZiByZXBsYWNlbWVudHMgKFwiK24rXCIpIGV4Y2VlZHMgdGhlIG1heGltdW0gY29sb3JzIGxlbmd0aCAoXCIrdGhpcy5fbWF4Q29sb3JzK1wiKVwiO2VbMypuXT0tMTtmb3IodmFyIHQ9MDt0PG47dCsrKXt2YXIgaT1vW3RdLGw9aVswXTtcIm51bWJlclwiPT10eXBlb2YgbD9sPVBJWEkudXRpbHMuaGV4MnJnYihsKTppWzBdPVBJWEkudXRpbHMucmdiMmhleChsKSxlWzMqdF09bFswXSxlWzMqdCsxXT1sWzFdLGVbMyp0KzJdPWxbMl07dmFyIGE9aVsxXTtcIm51bWJlclwiPT10eXBlb2YgYT9hPVBJWEkudXRpbHMuaGV4MnJnYihhKTppWzFdPVBJWEkudXRpbHMucmdiMmhleChhKSxyWzMqdF09YVswXSxyWzMqdCsxXT1hWzFdLHJbMyp0KzJdPWFbMl19dGhpcy5fcmVwbGFjZW1lbnRzPW99LHQucmVwbGFjZW1lbnRzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZXBsYWNlbWVudHN9LG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt0aGlzLnJlcGxhY2VtZW50cz10aGlzLl9yZXBsYWNlbWVudHN9LHQubWF4Q29sb3JzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9tYXhDb2xvcnN9LHQuZXBzaWxvbi5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5lcHNpbG9uPW99LHQuZXBzaWxvbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5lcHNpbG9ufSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSx0KSxufShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLk11bHRpQ29sb3JSZXBsYWNlRmlsdGVyPW4sby5NdWx0aUNvbG9yUmVwbGFjZUZpbHRlcj1uLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLW9sZC1maWxtIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1vbGQtZmlsbSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihuLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQobi5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihuKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixpPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxuXFxudW5pZm9ybSBmbG9hdCBzZXBpYTtcXG51bmlmb3JtIGZsb2F0IG5vaXNlO1xcbnVuaWZvcm0gZmxvYXQgbm9pc2VTaXplO1xcbnVuaWZvcm0gZmxvYXQgc2NyYXRjaDtcXG51bmlmb3JtIGZsb2F0IHNjcmF0Y2hEZW5zaXR5O1xcbnVuaWZvcm0gZmxvYXQgc2NyYXRjaFdpZHRoO1xcbnVuaWZvcm0gZmxvYXQgdmlnbmV0dGluZztcXG51bmlmb3JtIGZsb2F0IHZpZ25ldHRpbmdBbHBoYTtcXG51bmlmb3JtIGZsb2F0IHZpZ25ldHRpbmdCbHVyO1xcbnVuaWZvcm0gZmxvYXQgc2VlZDtcXG5cXG5jb25zdCBmbG9hdCBTUVJUXzIgPSAxLjQxNDIxMztcXG5jb25zdCB2ZWMzIFNFUElBX1JHQiA9IHZlYzMoMTEyLjAgLyAyNTUuMCwgNjYuMCAvIDI1NS4wLCAyMC4wIC8gMjU1LjApO1xcblxcbmZsb2F0IHJhbmQodmVjMiBjbykge1xcbiAgICByZXR1cm4gZnJhY3Qoc2luKGRvdChjby54eSwgdmVjMigxMi45ODk4LCA3OC4yMzMpKSkgKiA0Mzc1OC41NDUzKTtcXG59XFxuXFxudmVjMyBPdmVybGF5KHZlYzMgc3JjLCB2ZWMzIGRzdClcXG57XFxuICAgIC8vIGlmIChkc3QgPD0gMC41KSB0aGVuOiAyICogc3JjICogZHN0XFxuICAgIC8vIGlmIChkc3QgPiAwLjUpIHRoZW46IDEgLSAyICogKDEgLSBkc3QpICogKDEgLSBzcmMpXFxuICAgIHJldHVybiB2ZWMzKChkc3QueCA8PSAwLjUpID8gKDIuMCAqIHNyYy54ICogZHN0LngpIDogKDEuMCAtIDIuMCAqICgxLjAgLSBkc3QueCkgKiAoMS4wIC0gc3JjLngpKSxcXG4gICAgICAgICAgICAgICAgKGRzdC55IDw9IDAuNSkgPyAoMi4wICogc3JjLnkgKiBkc3QueSkgOiAoMS4wIC0gMi4wICogKDEuMCAtIGRzdC55KSAqICgxLjAgLSBzcmMueSkpLFxcbiAgICAgICAgICAgICAgICAoZHN0LnogPD0gMC41KSA/ICgyLjAgKiBzcmMueiAqIGRzdC56KSA6ICgxLjAgLSAyLjAgKiAoMS4wIC0gZHN0LnopICogKDEuMCAtIHNyYy56KSkpO1xcbn1cXG5cXG5cXG52b2lkIG1haW4oKVxcbntcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjMyBjb2xvciA9IGdsX0ZyYWdDb2xvci5yZ2I7XFxuXFxuICAgIGlmIChzZXBpYSA+IDAuMClcXG4gICAge1xcbiAgICAgICAgZmxvYXQgZ3JheSA9IChjb2xvci54ICsgY29sb3IueSArIGNvbG9yLnopIC8gMy4wO1xcbiAgICAgICAgdmVjMyBncmF5c2NhbGUgPSB2ZWMzKGdyYXkpO1xcblxcbiAgICAgICAgY29sb3IgPSBPdmVybGF5KFNFUElBX1JHQiwgZ3JheXNjYWxlKTtcXG5cXG4gICAgICAgIGNvbG9yID0gZ3JheXNjYWxlICsgc2VwaWEgKiAoY29sb3IgLSBncmF5c2NhbGUpO1xcbiAgICB9XFxuXFxuICAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkICogZmlsdGVyQXJlYS54eSAvIGRpbWVuc2lvbnMueHk7XFxuXFxuICAgIGlmICh2aWduZXR0aW5nID4gMC4wKVxcbiAgICB7XFxuICAgICAgICBmbG9hdCBvdXR0ZXIgPSBTUVJUXzIgLSB2aWduZXR0aW5nICogU1FSVF8yO1xcbiAgICAgICAgdmVjMiBkaXIgPSB2ZWMyKHZlYzIoMC41LCAwLjUpIC0gY29vcmQpO1xcbiAgICAgICAgZGlyLnkgKj0gZGltZW5zaW9ucy55IC8gZGltZW5zaW9ucy54O1xcbiAgICAgICAgZmxvYXQgZGFya2VyID0gY2xhbXAoKG91dHRlciAtIGxlbmd0aChkaXIpICogU1FSVF8yKSAvICggMC4wMDAwMSArIHZpZ25ldHRpbmdCbHVyICogU1FSVF8yKSwgMC4wLCAxLjApO1xcbiAgICAgICAgY29sb3IucmdiICo9IGRhcmtlciArICgxLjAgLSBkYXJrZXIpICogKDEuMCAtIHZpZ25ldHRpbmdBbHBoYSk7XFxuICAgIH1cXG5cXG4gICAgaWYgKHNjcmF0Y2hEZW5zaXR5ID4gc2VlZCAmJiBzY3JhdGNoICE9IDAuMClcXG4gICAge1xcbiAgICAgICAgZmxvYXQgcGhhc2UgPSBzZWVkICogMjU2LjA7XFxuICAgICAgICBmbG9hdCBzID0gbW9kKGZsb29yKHBoYXNlKSwgMi4wKTtcXG4gICAgICAgIGZsb2F0IGRpc3QgPSAxLjAgLyBzY3JhdGNoRGVuc2l0eTtcXG4gICAgICAgIGZsb2F0IGQgPSBkaXN0YW5jZShjb29yZCwgdmVjMihzZWVkICogZGlzdCwgYWJzKHMgLSBzZWVkICogZGlzdCkpKTtcXG4gICAgICAgIGlmIChkIDwgc2VlZCAqIDAuNiArIDAuNClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBoaWdocCBmbG9hdCBwZXJpb2QgPSBzY3JhdGNoRGVuc2l0eSAqIDEwLjA7XFxuXFxuICAgICAgICAgICAgZmxvYXQgeHggPSBjb29yZC54ICogcGVyaW9kICsgcGhhc2U7XFxuICAgICAgICAgICAgZmxvYXQgYWEgPSBhYnMobW9kKHh4LCAwLjUpICogNC4wKTtcXG4gICAgICAgICAgICBmbG9hdCBiYiA9IG1vZChmbG9vcih4eCAvIDAuNSksIDIuMCk7XFxuICAgICAgICAgICAgZmxvYXQgeXkgPSAoMS4wIC0gYmIpICogYWEgKyBiYiAqICgyLjAgLSBhYSk7XFxuXFxuICAgICAgICAgICAgZmxvYXQga2sgPSAyLjAgKiBwZXJpb2Q7XFxuICAgICAgICAgICAgZmxvYXQgZHcgPSBzY3JhdGNoV2lkdGggLyBkaW1lbnNpb25zLnggKiAoMC43NSArIHNlZWQpO1xcbiAgICAgICAgICAgIGZsb2F0IGRoID0gZHcgKiBraztcXG5cXG4gICAgICAgICAgICBmbG9hdCB0aW5lID0gKHl5IC0gKDIuMCAtIGRoKSk7XFxuXFxuICAgICAgICAgICAgaWYgKHRpbmUgPiAwLjApIHtcXG4gICAgICAgICAgICAgICAgZmxvYXQgX3NpZ24gPSBzaWduKHNjcmF0Y2gpO1xcblxcbiAgICAgICAgICAgICAgICB0aW5lID0gcyAqIHRpbmUgLyBwZXJpb2QgKyBzY3JhdGNoICsgMC4xO1xcbiAgICAgICAgICAgICAgICB0aW5lID0gY2xhbXAodGluZSArIDEuMCwgMC41ICsgX3NpZ24gKiAwLjUsIDEuNSArIF9zaWduICogMC41KTtcXG5cXG4gICAgICAgICAgICAgICAgY29sb3IucmdiICo9IHRpbmU7XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIGlmIChub2lzZSA+IDAuMCAmJiBub2lzZVNpemUgPiAwLjApXFxuICAgIHtcXG4gICAgICAgIHZlYzIgcGl4ZWxDb29yZCA9IHZUZXh0dXJlQ29vcmQueHkgKiBmaWx0ZXJBcmVhLnh5O1xcbiAgICAgICAgcGl4ZWxDb29yZC54ID0gZmxvb3IocGl4ZWxDb29yZC54IC8gbm9pc2VTaXplKTtcXG4gICAgICAgIHBpeGVsQ29vcmQueSA9IGZsb29yKHBpeGVsQ29vcmQueSAvIG5vaXNlU2l6ZSk7XFxuICAgICAgICAvLyB2ZWMyIGQgPSBwaXhlbENvb3JkICogbm9pc2VTaXplICogdmVjMigxMDI0LjAgKyBzZWVkICogNTEyLjAsIDEwMjQuMCAtIHNlZWQgKiA1MTIuMCk7XFxuICAgICAgICAvLyBmbG9hdCBfbm9pc2UgPSBzbm9pc2UoZCkgKiAwLjU7XFxuICAgICAgICBmbG9hdCBfbm9pc2UgPSByYW5kKHBpeGVsQ29vcmQgKiBub2lzZVNpemUgKiBzZWVkKSAtIDAuNTtcXG4gICAgICAgIGNvbG9yICs9IF9ub2lzZSAqIG5vaXNlO1xcbiAgICB9XFxuXFxuICAgIGdsX0ZyYWdDb2xvci5yZ2IgPSBjb2xvcjtcXG59XFxuXCIsZT1mdW5jdGlvbihuKXtmdW5jdGlvbiBlKGUsbyl7dm9pZCAwPT09byYmKG89MCksbi5jYWxsKHRoaXMsdCxpKSxcIm51bWJlclwiPT10eXBlb2YgZT8odGhpcy5zZWVkPWUsZT1udWxsKTp0aGlzLnNlZWQ9byxPYmplY3QuYXNzaWduKHRoaXMse3NlcGlhOi4zLG5vaXNlOi4zLG5vaXNlU2l6ZToxLHNjcmF0Y2g6LjUsc2NyYXRjaERlbnNpdHk6LjMsc2NyYXRjaFdpZHRoOjEsdmlnbmV0dGluZzouMyx2aWduZXR0aW5nQWxwaGE6MSx2aWduZXR0aW5nQmx1cjouM30sZSl9biYmKGUuX19wcm90b19fPW4pLChlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG4mJm4ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9ZTt2YXIgbz17c2VwaWE6e2NvbmZpZ3VyYWJsZTohMH0sbm9pc2U6e2NvbmZpZ3VyYWJsZTohMH0sbm9pc2VTaXplOntjb25maWd1cmFibGU6ITB9LHNjcmF0Y2g6e2NvbmZpZ3VyYWJsZTohMH0sc2NyYXRjaERlbnNpdHk6e2NvbmZpZ3VyYWJsZTohMH0sc2NyYXRjaFdpZHRoOntjb25maWd1cmFibGU6ITB9LHZpZ25ldHRpbmc6e2NvbmZpZ3VyYWJsZTohMH0sdmlnbmV0dGluZ0FscGhhOntjb25maWd1cmFibGU6ITB9LHZpZ25ldHRpbmdCbHVyOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gZS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24obix0LGksZSl7dGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzBdPXQuc291cmNlRnJhbWUud2lkdGgsdGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzFdPXQuc291cmNlRnJhbWUuaGVpZ2h0LHRoaXMudW5pZm9ybXMuc2VlZD10aGlzLnNlZWQsbi5hcHBseUZpbHRlcih0aGlzLHQsaSxlKX0sby5zZXBpYS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5zZXBpYT1ufSxvLnNlcGlhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNlcGlhfSxvLm5vaXNlLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLm5vaXNlPW59LG8ubm9pc2UuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMubm9pc2V9LG8ubm9pc2VTaXplLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLm5vaXNlU2l6ZT1ufSxvLm5vaXNlU2l6ZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ub2lzZVNpemV9LG8uc2NyYXRjaC5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5zY3JhdGNoPW59LG8uc2NyYXRjaC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY3JhdGNofSxvLnNjcmF0Y2hEZW5zaXR5LnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnNjcmF0Y2hEZW5zaXR5PW59LG8uc2NyYXRjaERlbnNpdHkuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2NyYXRjaERlbnNpdHl9LG8uc2NyYXRjaFdpZHRoLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnNjcmF0Y2hXaWR0aD1ufSxvLnNjcmF0Y2hXaWR0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY3JhdGNoV2lkdGh9LG8udmlnbmV0dGluZy5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy52aWduZXR0aW5nPW59LG8udmlnbmV0dGluZy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy52aWduZXR0aW5nfSxvLnZpZ25ldHRpbmdBbHBoYS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy52aWduZXR0aW5nQWxwaGE9bn0sby52aWduZXR0aW5nQWxwaGEuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudmlnbmV0dGluZ0FscGhhfSxvLnZpZ25ldHRpbmdCbHVyLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmdCbHVyPW59LG8udmlnbmV0dGluZ0JsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudmlnbmV0dGluZ0JsdXJ9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGUucHJvdG90eXBlLG8pLGV9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuT2xkRmlsbUZpbHRlcj1lLG4uT2xkRmlsbUZpbHRlcj1lLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItb2xkLWZpbG0uanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1vdXRsaW5lIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1vdXRsaW5lIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbyl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/byhleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbyk6byhlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBvPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIGZsb2F0IHRoaWNrbmVzcztcXG51bmlmb3JtIHZlYzQgb3V0bGluZUNvbG9yO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJDbGFtcDtcXG52ZWMyIHB4ID0gdmVjMigxLjAgLyBmaWx0ZXJBcmVhLngsIDEuMCAvIGZpbHRlckFyZWEueSk7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0O1xcbiAgICB2ZWM0IG93bkNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjNCBjdXJDb2xvcjtcXG4gICAgZmxvYXQgbWF4QWxwaGEgPSAwLjtcXG4gICAgdmVjMiBkaXNwbGFjZWQ7XFxuICAgIGZvciAoZmxvYXQgYW5nbGUgPSAwLjsgYW5nbGUgPCBQSSAqIDIuOyBhbmdsZSArPSAlVEhJQ0tORVNTJSApIHtcXG4gICAgICAgIGRpc3BsYWNlZC54ID0gdlRleHR1cmVDb29yZC54ICsgdGhpY2tuZXNzICogcHgueCAqIGNvcyhhbmdsZSk7XFxuICAgICAgICBkaXNwbGFjZWQueSA9IHZUZXh0dXJlQ29vcmQueSArIHRoaWNrbmVzcyAqIHB4LnkgKiBzaW4oYW5nbGUpO1xcbiAgICAgICAgY3VyQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wKGRpc3BsYWNlZCwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KSk7XFxuICAgICAgICBtYXhBbHBoYSA9IG1heChtYXhBbHBoYSwgY3VyQ29sb3IuYSk7XFxuICAgIH1cXG4gICAgZmxvYXQgcmVzdWx0QWxwaGEgPSBtYXgobWF4QWxwaGEsIG93bkNvbG9yLmEpO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KChvd25Db2xvci5yZ2IgKyBvdXRsaW5lQ29sb3IucmdiICogKDEuIC0gb3duQ29sb3IuYSkpICogcmVzdWx0QWxwaGEsIHJlc3VsdEFscGhhKTtcXG59XFxuXCIsbj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKG4scil7dm9pZCAwPT09biYmKG49MSksdm9pZCAwPT09ciYmKHI9MCksZS5jYWxsKHRoaXMsbyx0LnJlcGxhY2UoLyVUSElDS05FU1MlL2dpLCgxL24pLnRvRml4ZWQoNykpKSx0aGlzLnRoaWNrbmVzcz1uLHRoaXMudW5pZm9ybXMub3V0bGluZUNvbG9yPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDFdKSx0aGlzLmNvbG9yPXJ9ZSYmKG4uX19wcm90b19fPWUpLChuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bjt2YXIgcj17Y29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sdGhpY2tuZXNzOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gUElYSS51dGlscy5yZ2IyaGV4KHRoaXMudW5pZm9ybXMub3V0bGluZUNvbG9yKX0sci5jb2xvci5zZXQ9ZnVuY3Rpb24oZSl7UElYSS51dGlscy5oZXgycmdiKGUsdGhpcy51bmlmb3Jtcy5vdXRsaW5lQ29sb3IpfSxyLnRoaWNrbmVzcy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy50aGlja25lc3N9LHIudGhpY2tuZXNzLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnRoaWNrbmVzcz1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxyKSxufShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLk91dGxpbmVGaWx0ZXI9bixlLk91dGxpbmVGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLW91dGxpbmUuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1waXhlbGF0ZSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItcGl4ZWxhdGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxvKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9vKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxvKTpvKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG89XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gdmVjMiBzaXplO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnZlYzIgbWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgKj0gZmlsdGVyQXJlYS54eTtcXG4gICAgY29vcmQgKz0gZmlsdGVyQXJlYS56dztcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHVubWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgLT0gZmlsdGVyQXJlYS56dztcXG4gICAgY29vcmQgLz0gZmlsdGVyQXJlYS54eTtcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHBpeGVsYXRlKHZlYzIgY29vcmQsIHZlYzIgc2l6ZSlcXG57XFxuXFx0cmV0dXJuIGZsb29yKCBjb29yZCAvIHNpemUgKSAqIHNpemU7XFxufVxcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgdmVjMiBjb29yZCA9IG1hcENvb3JkKHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBjb29yZCA9IHBpeGVsYXRlKGNvb3JkLCBzaXplKTtcXG5cXG4gICAgY29vcmQgPSB1bm1hcENvb3JkKGNvb3JkKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb29yZCk7XFxufVxcblwiLG49ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuKXt2b2lkIDA9PT1uJiYobj0xMCksZS5jYWxsKHRoaXMsbyxyKSx0aGlzLnNpemU9bn1lJiYobi5fX3Byb3RvX189ZSksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciB0PXtzaXplOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gdC5zaXplLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNpemV9LHQuc2l6ZS5zZXQ9ZnVuY3Rpb24oZSl7XCJudW1iZXJcIj09dHlwZW9mIGUmJihlPVtlLGVdKSx0aGlzLnVuaWZvcm1zLnNpemU9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsdCksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5QaXhlbGF0ZUZpbHRlcj1uLGUuUGl4ZWxhdGVGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXBpeGVsYXRlLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItcmFkaWFsLWJsdXIgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXJhZGlhbC1ibHVyIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG51bmlmb3JtIGZsb2F0IHVSYWRpYW47XFxudW5pZm9ybSB2ZWMyIHVDZW50ZXI7XFxudW5pZm9ybSBmbG9hdCB1UmFkaXVzO1xcbnVuaWZvcm0gaW50IHVLZXJuZWxTaXplO1xcblxcbmNvbnN0IGludCBNQVhfS0VSTkVMX1NJWkUgPSAyMDQ4O1xcbmNvbnN0IGludCBJVEVSQVRJT04gPSBNQVhfS0VSTkVMX1NJWkUgLSAxO1xcblxcbi8vIGZsb2F0IGtlcm5lbFNpemUgPSBtaW4oZmxvYXQodUtlcm5lbFNpemUpLCBmbG9hdChNQVhfS0VSTkVMU0laRSkpO1xcblxcbi8vIEluIHJlYWwgdXNlLWNhc2UgLCB1S2VybmVsU2l6ZSA8IE1BWF9LRVJORUxTSVpFIGFsbW9zdCBhbHdheXMuXFxuLy8gU28gdXNlIHVLZXJuZWxTaXplIGRpcmVjdGx5LlxcbmZsb2F0IGtlcm5lbFNpemUgPSBmbG9hdCh1S2VybmVsU2l6ZSk7XFxuZmxvYXQgayA9IGtlcm5lbFNpemUgLSAxLjA7XFxuXFxuXFxudmVjMiBjZW50ZXIgPSB1Q2VudGVyLnh5IC8gZmlsdGVyQXJlYS54eTtcXG5mbG9hdCBhc3BlY3QgPSBmaWx0ZXJBcmVhLnkgLyBmaWx0ZXJBcmVhLng7XFxuXFxuZmxvYXQgZ3JhZGllbnQgPSB1UmFkaXVzIC8gZmlsdGVyQXJlYS54ICogMC4zO1xcbmZsb2F0IHJhZGl1cyA9IHVSYWRpdXMgLyBmaWx0ZXJBcmVhLnggLSBncmFkaWVudCAqIDAuNTtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIGlmICh1S2VybmVsU2l6ZSA9PSAwKVxcbiAgICB7XFxuICAgICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgdmVjMiBjb29yZCA9IHZUZXh0dXJlQ29vcmQ7XFxuXFxuICAgIHZlYzIgZGlyID0gdmVjMihjZW50ZXIgLSBjb29yZCk7XFxuICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgodmVjMihkaXIueCwgZGlyLnkgKiBhc3BlY3QpKTtcXG5cXG4gICAgZmxvYXQgcmFkaWFuU3RlcDtcXG5cXG4gICAgaWYgKHJhZGl1cyA+PSAwLjAgJiYgZGlzdCA+IHJhZGl1cykge1xcbiAgICAgICAgZmxvYXQgZGVsdGEgPSBkaXN0IC0gcmFkaXVzO1xcbiAgICAgICAgZmxvYXQgZ2FwID0gZ3JhZGllbnQ7XFxuICAgICAgICBmbG9hdCBzY2FsZSA9IDEuMCAtIGFicyhkZWx0YSAvIGdhcCk7XFxuICAgICAgICBpZiAoc2NhbGUgPD0gMC4wKSB7XFxuICAgICAgICAgICAgcmV0dXJuO1xcbiAgICAgICAgfVxcbiAgICAgICAgcmFkaWFuU3RlcCA9IHVSYWRpYW4gKiBzY2FsZSAvIGs7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgICByYWRpYW5TdGVwID0gdVJhZGlhbiAvIGs7XFxuICAgIH1cXG5cXG4gICAgZmxvYXQgcyA9IHNpbihyYWRpYW5TdGVwKTtcXG4gICAgZmxvYXQgYyA9IGNvcyhyYWRpYW5TdGVwKTtcXG4gICAgbWF0MiByb3RhdGlvbk1hdHJpeCA9IG1hdDIodmVjMihjLCAtcyksIHZlYzIocywgYykpO1xcblxcbiAgICBmb3IoaW50IGkgPSAwOyBpIDwgSVRFUkFUSU9OOyBpKyspIHtcXG4gICAgICAgIGlmIChpID09IGludChrKSkge1xcbiAgICAgICAgICAgIGJyZWFrO1xcbiAgICAgICAgfVxcblxcbiAgICAgICAgY29vcmQgLT0gY2VudGVyO1xcbiAgICAgICAgY29vcmQueSAqPSBhc3BlY3Q7XFxuICAgICAgICBjb29yZCA9IHJvdGF0aW9uTWF0cml4ICogY29vcmQ7XFxuICAgICAgICBjb29yZC55IC89IGFzcGVjdDtcXG4gICAgICAgIGNvb3JkICs9IGNlbnRlcjtcXG5cXG4gICAgICAgIHZlYzQgc2FtcGxlID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb29yZCk7XFxuXFxuICAgICAgICAvLyBzd2l0Y2ggdG8gcHJlLW11bHRpcGxpZWQgYWxwaGEgdG8gY29ycmVjdGx5IGJsdXIgdHJhbnNwYXJlbnQgaW1hZ2VzXFxuICAgICAgICAvLyBzYW1wbGUucmdiICo9IHNhbXBsZS5hO1xcblxcbiAgICAgICAgZ2xfRnJhZ0NvbG9yICs9IHNhbXBsZTtcXG4gICAgfVxcbiAgICBnbF9GcmFnQ29sb3IgLz0ga2VybmVsU2l6ZTtcXG59XFxuXCIscj1mdW5jdGlvbihlKXtmdW5jdGlvbiByKHIsaSxvLGEpe3ZvaWQgMD09PXImJihyPTApLHZvaWQgMD09PWkmJihpPVswLDBdKSx2b2lkIDA9PT1vJiYobz01KSx2b2lkIDA9PT1hJiYoYT0tMSksZS5jYWxsKHRoaXMsbix0KSx0aGlzLl9hbmdsZT0wLHRoaXMuYW5nbGU9cix0aGlzLmNlbnRlcj1pLHRoaXMua2VybmVsU2l6ZT1vLHRoaXMucmFkaXVzPWF9ZSYmKHIuX19wcm90b19fPWUpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgaT17YW5nbGU6e2NvbmZpZ3VyYWJsZTohMH0sY2VudGVyOntjb25maWd1cmFibGU6ITB9LHJhZGl1czp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsbix0LHIpe3RoaXMudW5pZm9ybXMudUtlcm5lbFNpemU9MCE9PXRoaXMuX2FuZ2xlP3RoaXMua2VybmVsU2l6ZTowLGUuYXBwbHlGaWx0ZXIodGhpcyxuLHQscil9LGkuYW5nbGUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2FuZ2xlPWUsdGhpcy51bmlmb3Jtcy51UmFkaWFuPWUqTWF0aC5QSS8xODB9LGkuYW5nbGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FuZ2xlfSxpLmNlbnRlci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51Q2VudGVyfSxpLmNlbnRlci5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy51Q2VudGVyPWV9LGkucmFkaXVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVSYWRpdXN9LGkucmFkaXVzLnNldD1mdW5jdGlvbihlKXsoZTwwfHxlPT09MS8wKSYmKGU9LTEpLHRoaXMudW5pZm9ybXMudVJhZGl1cz1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxpKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlJhZGlhbEJsdXJGaWx0ZXI9cixlLlJhZGlhbEJsdXJGaWx0ZXI9cixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXJhZGlhbC1ibHVyLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItcmdiLXNwbGl0IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1yZ2Itc3BsaXQgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxyKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9yKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxyKTpyKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjMiByZWQ7XFxudW5pZm9ybSB2ZWMyIGdyZWVuO1xcbnVuaWZvcm0gdmVjMiBibHVlO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICBnbF9GcmFnQ29sb3IuciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIHJlZC9maWx0ZXJBcmVhLnh5KS5yO1xcbiAgIGdsX0ZyYWdDb2xvci5nID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgZ3JlZW4vZmlsdGVyQXJlYS54eSkuZztcXG4gICBnbF9GcmFnQ29sb3IuYiA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIGJsdWUvZmlsdGVyQXJlYS54eSkuYjtcXG4gICBnbF9GcmFnQ29sb3IuYSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkuYTtcXG59XFxuXCIsbj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKG4sbyxpKXt2b2lkIDA9PT1uJiYobj1bLTEwLDBdKSx2b2lkIDA9PT1vJiYobz1bMCwxMF0pLHZvaWQgMD09PWkmJihpPVswLDBdKSxlLmNhbGwodGhpcyxyLHQpLHRoaXMucmVkPW4sdGhpcy5ncmVlbj1vLHRoaXMuYmx1ZT1pfWUmJihuLl9fcHJvdG9fXz1lKSwobi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW47dmFyIG89e3JlZDp7Y29uZmlndXJhYmxlOiEwfSxncmVlbjp7Y29uZmlndXJhYmxlOiEwfSxibHVlOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gby5yZWQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucmVkfSxvLnJlZC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5yZWQ9ZX0sby5ncmVlbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ncmVlbn0sby5ncmVlbi5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5ncmVlbj1lfSxvLmJsdWUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYmx1ZX0sby5ibHVlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmJsdWU9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsbyksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5SR0JTcGxpdEZpbHRlcj1uLGUuUkdCU3BsaXRGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXJnYi1zcGxpdC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXNob2Nrd2F2ZSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItc2hvY2t3YXZlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciB0PVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLG49XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxuXFxudW5pZm9ybSB2ZWMyIGNlbnRlcjtcXG5cXG51bmlmb3JtIGZsb2F0IGFtcGxpdHVkZTtcXG51bmlmb3JtIGZsb2F0IHdhdmVsZW5ndGg7XFxuLy8gdW5pZm9ybSBmbG9hdCBwb3dlcjtcXG51bmlmb3JtIGZsb2F0IGJyaWdodG5lc3M7XFxudW5pZm9ybSBmbG9hdCBzcGVlZDtcXG51bmlmb3JtIGZsb2F0IHJhZGl1cztcXG5cXG51bmlmb3JtIGZsb2F0IHRpbWU7XFxuXFxuY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5O1xcblxcbnZvaWQgbWFpbigpXFxue1xcbiAgICBmbG9hdCBoYWxmV2F2ZWxlbmd0aCA9IHdhdmVsZW5ndGggKiAwLjUgLyBmaWx0ZXJBcmVhLng7XFxuICAgIGZsb2F0IG1heFJhZGl1cyA9IHJhZGl1cyAvIGZpbHRlckFyZWEueDtcXG4gICAgZmxvYXQgY3VycmVudFJhZGl1cyA9IHRpbWUgKiBzcGVlZCAvIGZpbHRlckFyZWEueDtcXG5cXG4gICAgZmxvYXQgZmFkZSA9IDEuMDtcXG5cXG4gICAgaWYgKG1heFJhZGl1cyA+IDAuMCkge1xcbiAgICAgICAgaWYgKGN1cnJlbnRSYWRpdXMgPiBtYXhSYWRpdXMpIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICAgICAgICAgIHJldHVybjtcXG4gICAgICAgIH1cXG4gICAgICAgIGZhZGUgPSAxLjAgLSBwb3coY3VycmVudFJhZGl1cyAvIG1heFJhZGl1cywgMi4wKTtcXG4gICAgfVxcblxcbiAgICB2ZWMyIGRpciA9IHZlYzIodlRleHR1cmVDb29yZCAtIGNlbnRlciAvIGZpbHRlckFyZWEueHkpO1xcbiAgICBkaXIueSAqPSBmaWx0ZXJBcmVhLnkgLyBmaWx0ZXJBcmVhLng7XFxuICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgoZGlyKTtcXG5cXG4gICAgaWYgKGRpc3QgPD0gMC4wIHx8IGRpc3QgPCBjdXJyZW50UmFkaXVzIC0gaGFsZldhdmVsZW5ndGggfHwgZGlzdCA+IGN1cnJlbnRSYWRpdXMgKyBoYWxmV2F2ZWxlbmd0aCkge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgICAgIHJldHVybjtcXG4gICAgfVxcblxcbiAgICB2ZWMyIGRpZmZVViA9IG5vcm1hbGl6ZShkaXIpO1xcblxcbiAgICBmbG9hdCBkaWZmID0gKGRpc3QgLSBjdXJyZW50UmFkaXVzKSAvIGhhbGZXYXZlbGVuZ3RoO1xcblxcbiAgICBmbG9hdCBwID0gMS4wIC0gcG93KGFicyhkaWZmKSwgMi4wKTtcXG5cXG4gICAgLy8gZmxvYXQgcG93RGlmZiA9IGRpZmYgKiBwb3cocCwgMi4wKSAqICggYW1wbGl0dWRlICogZmFkZSApO1xcbiAgICBmbG9hdCBwb3dEaWZmID0gMS4yNSAqIHNpbihkaWZmICogUEkpICogcCAqICggYW1wbGl0dWRlICogZmFkZSApO1xcblxcbiAgICB2ZWMyIG9mZnNldCA9IGRpZmZVViAqIHBvd0RpZmYgLyBmaWx0ZXJBcmVhLnh5O1xcblxcbiAgICAvLyBEbyBjbGFtcCA6XFxuICAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkICsgb2Zmc2V0O1xcbiAgICB2ZWMyIGNsYW1wZWRDb29yZCA9IGNsYW1wKGNvb3JkLCBmaWx0ZXJDbGFtcC54eSwgZmlsdGVyQ2xhbXAuencpO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wZWRDb29yZCk7XFxuICAgIGlmIChjb29yZCAhPSBjbGFtcGVkQ29vcmQpIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciAqPSBtYXgoMC4wLCAxLjAgLSBsZW5ndGgoY29vcmQgLSBjbGFtcGVkQ29vcmQpKTtcXG4gICAgfVxcblxcbiAgICAvLyBObyBjbGFtcCA6XFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIG9mZnNldCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvci5yZ2IgKj0gMS4wICsgKGJyaWdodG5lc3MgLSAxLjApICogcCAqIGZhZGU7XFxufVxcblwiLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihyLGksbyl7dm9pZCAwPT09ciYmKHI9WzAsMF0pLHZvaWQgMD09PWkmJihpPXt9KSx2b2lkIDA9PT1vJiYobz0wKSxlLmNhbGwodGhpcyx0LG4pLHRoaXMuY2VudGVyPXIsQXJyYXkuaXNBcnJheShpKSYmKGNvbnNvbGUud2FybihcIkRlcHJlY2F0ZWQgV2FybmluZzogU2hvY2t3YXZlRmlsdGVyIHBhcmFtcyBBcnJheSBoYXMgYmVlbiBjaGFuZ2VkIHRvIG9wdGlvbnMgT2JqZWN0LlwiKSxpPXt9KSxpPU9iamVjdC5hc3NpZ24oe2FtcGxpdHVkZTozMCx3YXZlbGVuZ3RoOjE2MCxicmlnaHRuZXNzOjEsc3BlZWQ6NTAwLHJhZGl1czotMX0saSksdGhpcy5hbXBsaXR1ZGU9aS5hbXBsaXR1ZGUsdGhpcy53YXZlbGVuZ3RoPWkud2F2ZWxlbmd0aCx0aGlzLmJyaWdodG5lc3M9aS5icmlnaHRuZXNzLHRoaXMuc3BlZWQ9aS5zcGVlZCx0aGlzLnJhZGl1cz1pLnJhZGl1cyx0aGlzLnRpbWU9b31lJiYoci5fX3Byb3RvX189ZSksKHIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1yO3ZhciBpPXtjZW50ZXI6e2NvbmZpZ3VyYWJsZTohMH0sYW1wbGl0dWRlOntjb25maWd1cmFibGU6ITB9LHdhdmVsZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH0sYnJpZ2h0bmVzczp7Y29uZmlndXJhYmxlOiEwfSxzcGVlZDp7Y29uZmlndXJhYmxlOiEwfSxyYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsbixyKXt0aGlzLnVuaWZvcm1zLnRpbWU9dGhpcy50aW1lLGUuYXBwbHlGaWx0ZXIodGhpcyx0LG4scil9LGkuY2VudGVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmNlbnRlcn0saS5jZW50ZXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuY2VudGVyPWV9LGkuYW1wbGl0dWRlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmFtcGxpdHVkZX0saS5hbXBsaXR1ZGUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYW1wbGl0dWRlPWV9LGkud2F2ZWxlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy53YXZlbGVuZ3RofSxpLndhdmVsZW5ndGguc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMud2F2ZWxlbmd0aD1lfSxpLmJyaWdodG5lc3MuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYnJpZ2h0bmVzc30saS5icmlnaHRuZXNzLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmJyaWdodG5lc3M9ZX0saS5zcGVlZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zcGVlZH0saS5zcGVlZC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zcGVlZD1lfSxpLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5yYWRpdXN9LGkucmFkaXVzLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnJhZGl1cz1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxpKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlNob2Nrd2F2ZUZpbHRlcj1yLGUuU2hvY2t3YXZlRmlsdGVyPXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1zaG9ja3dhdmUuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1zaW1wbGUtbGlnaHRtYXAgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXNpbXBsZS1saWdodG1hcCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixvPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBzYW1wbGVyMkQgdUxpZ2h0bWFwO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjMiBkaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjNCBhbWJpZW50Q29sb3I7XFxudm9pZCBtYWluKCkge1xcbiAgICB2ZWM0IGRpZmZ1c2VDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzIgbGlnaHRDb29yZCA9ICh2VGV4dHVyZUNvb3JkICogZmlsdGVyQXJlYS54eSkgLyBkaW1lbnNpb25zO1xcbiAgICB2ZWM0IGxpZ2h0ID0gdGV4dHVyZTJEKHVMaWdodG1hcCwgbGlnaHRDb29yZCk7XFxuICAgIHZlYzMgYW1iaWVudCA9IGFtYmllbnRDb2xvci5yZ2IgKiBhbWJpZW50Q29sb3IuYTtcXG4gICAgdmVjMyBpbnRlbnNpdHkgPSBhbWJpZW50ICsgbGlnaHQucmdiO1xcbiAgICB2ZWMzIGZpbmFsQ29sb3IgPSBkaWZmdXNlQ29sb3IucmdiICogaW50ZW5zaXR5O1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGZpbmFsQ29sb3IsIGRpZmZ1c2VDb2xvci5hKTtcXG59XFxuXCIsaT1mdW5jdGlvbihlKXtmdW5jdGlvbiBpKGkscixuKXt2b2lkIDA9PT1yJiYocj0wKSx2b2lkIDA9PT1uJiYobj0xKSxlLmNhbGwodGhpcyx0LG8pLHRoaXMudW5pZm9ybXMuYW1iaWVudENvbG9yPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLG5dKSx0aGlzLnRleHR1cmU9aSx0aGlzLmNvbG9yPXJ9ZSYmKGkuX19wcm90b19fPWUpLChpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9aTt2YXIgcj17dGV4dHVyZTp7Y29uZmlndXJhYmxlOiEwfSxjb2xvcjp7Y29uZmlndXJhYmxlOiEwfSxhbHBoYTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsdCxvLGkpe3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT10LnNvdXJjZUZyYW1lLndpZHRoLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT10LnNvdXJjZUZyYW1lLmhlaWdodCxlLmFwcGx5RmlsdGVyKHRoaXMsdCxvLGkpfSxyLnRleHR1cmUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudUxpZ2h0bWFwfSxyLnRleHR1cmUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudUxpZ2h0bWFwPWV9LHIuY29sb3Iuc2V0PWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMudW5pZm9ybXMuYW1iaWVudENvbG9yO1wibnVtYmVyXCI9PXR5cGVvZiBlPyhQSVhJLnV0aWxzLmhleDJyZ2IoZSx0KSx0aGlzLl9jb2xvcj1lKToodFswXT1lWzBdLHRbMV09ZVsxXSx0WzJdPWVbMl0sdFszXT1lWzNdLHRoaXMuX2NvbG9yPVBJWEkudXRpbHMucmdiMmhleCh0KSl9LHIuY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbG9yfSxyLmFscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmFtYmllbnRDb2xvclszXX0sci5hbHBoYS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5hbWJpZW50Q29sb3JbM109ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaS5wcm90b3R5cGUsciksaX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5TaW1wbGVMaWdodG1hcEZpbHRlcj1pLGUuU2ltcGxlTGlnaHRtYXBGaWx0ZXI9aSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXNpbXBsZS1saWdodG1hcC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXRpbHQtc2hpZnQgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXRpbHQtc2hpZnQgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24odCxpKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9pKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxpKTppKHQuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGk9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsZT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYmx1cjtcXG51bmlmb3JtIGZsb2F0IGdyYWRpZW50Qmx1cjtcXG51bmlmb3JtIHZlYzIgc3RhcnQ7XFxudW5pZm9ybSB2ZWMyIGVuZDtcXG51bmlmb3JtIHZlYzIgZGVsdGE7XFxudW5pZm9ybSB2ZWMyIHRleFNpemU7XFxuXFxuZmxvYXQgcmFuZG9tKHZlYzMgc2NhbGUsIGZsb2F0IHNlZWQpXFxue1xcbiAgICByZXR1cm4gZnJhY3Qoc2luKGRvdChnbF9GcmFnQ29vcmQueHl6ICsgc2VlZCwgc2NhbGUpKSAqIDQzNzU4LjU0NTMgKyBzZWVkKTtcXG59XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICB2ZWM0IGNvbG9yID0gdmVjNCgwLjApO1xcbiAgICBmbG9hdCB0b3RhbCA9IDAuMDtcXG5cXG4gICAgZmxvYXQgb2Zmc2V0ID0gcmFuZG9tKHZlYzMoMTIuOTg5OCwgNzguMjMzLCAxNTEuNzE4MiksIDAuMCk7XFxuICAgIHZlYzIgbm9ybWFsID0gbm9ybWFsaXplKHZlYzIoc3RhcnQueSAtIGVuZC55LCBlbmQueCAtIHN0YXJ0LngpKTtcXG4gICAgZmxvYXQgcmFkaXVzID0gc21vb3Roc3RlcCgwLjAsIDEuMCwgYWJzKGRvdCh2VGV4dHVyZUNvb3JkICogdGV4U2l6ZSAtIHN0YXJ0LCBub3JtYWwpKSAvIGdyYWRpZW50Qmx1cikgKiBibHVyO1xcblxcbiAgICBmb3IgKGZsb2F0IHQgPSAtMzAuMDsgdCA8PSAzMC4wOyB0KyspXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IHBlcmNlbnQgPSAodCArIG9mZnNldCAtIDAuNSkgLyAzMC4wO1xcbiAgICAgICAgZmxvYXQgd2VpZ2h0ID0gMS4wIC0gYWJzKHBlcmNlbnQpO1xcbiAgICAgICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBkZWx0YSAvIHRleFNpemUgKiBwZXJjZW50ICogcmFkaXVzKTtcXG4gICAgICAgIHNhbXBsZS5yZ2IgKj0gc2FtcGxlLmE7XFxuICAgICAgICBjb2xvciArPSBzYW1wbGUgKiB3ZWlnaHQ7XFxuICAgICAgICB0b3RhbCArPSB3ZWlnaHQ7XFxuICAgIH1cXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gY29sb3IgLyB0b3RhbDtcXG4gICAgZ2xfRnJhZ0NvbG9yLnJnYiAvPSBnbF9GcmFnQ29sb3IuYSArIDAuMDAwMDE7XFxufVxcblwiLHI9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gcihyLG4sbyxsKXt2b2lkIDA9PT1yJiYocj0xMDApLHZvaWQgMD09PW4mJihuPTYwMCksdm9pZCAwPT09byYmKG89bnVsbCksdm9pZCAwPT09bCYmKGw9bnVsbCksdC5jYWxsKHRoaXMsaSxlKSx0aGlzLnVuaWZvcm1zLmJsdXI9cix0aGlzLnVuaWZvcm1zLmdyYWRpZW50Qmx1cj1uLHRoaXMudW5pZm9ybXMuc3RhcnQ9b3x8bmV3IFBJWEkuUG9pbnQoMCx3aW5kb3cuaW5uZXJIZWlnaHQvMiksdGhpcy51bmlmb3Jtcy5lbmQ9bHx8bmV3IFBJWEkuUG9pbnQoNjAwLHdpbmRvdy5pbm5lckhlaWdodC8yKSx0aGlzLnVuaWZvcm1zLmRlbHRhPW5ldyBQSVhJLlBvaW50KDMwLDMwKSx0aGlzLnVuaWZvcm1zLnRleFNpemU9bmV3IFBJWEkuUG9pbnQod2luZG93LmlubmVyV2lkdGgsd2luZG93LmlubmVySGVpZ2h0KSx0aGlzLnVwZGF0ZURlbHRhKCl9dCYmKHIuX19wcm90b19fPXQpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgbj17Ymx1cjp7Y29uZmlndXJhYmxlOiEwfSxncmFkaWVudEJsdXI6e2NvbmZpZ3VyYWJsZTohMH0sc3RhcnQ6e2NvbmZpZ3VyYWJsZTohMH0sZW5kOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5wcm90b3R5cGUudXBkYXRlRGVsdGE9ZnVuY3Rpb24oKXt0aGlzLnVuaWZvcm1zLmRlbHRhLng9MCx0aGlzLnVuaWZvcm1zLmRlbHRhLnk9MH0sbi5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJsdXJ9LG4uYmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy51bmlmb3Jtcy5ibHVyPXR9LG4uZ3JhZGllbnRCbHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmdyYWRpZW50Qmx1cn0sbi5ncmFkaWVudEJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudW5pZm9ybXMuZ3JhZGllbnRCbHVyPXR9LG4uc3RhcnQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc3RhcnR9LG4uc3RhcnQuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudW5pZm9ybXMuc3RhcnQ9dCx0aGlzLnVwZGF0ZURlbHRhKCl9LG4uZW5kLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmVuZH0sbi5lbmQuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudW5pZm9ybXMuZW5kPXQsdGhpcy51cGRhdGVEZWx0YSgpfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxuKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlRpbHRTaGlmdEF4aXNGaWx0ZXI9cjt2YXIgbj1mdW5jdGlvbih0KXtmdW5jdGlvbiBpKCl7dC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9cmV0dXJuIHQmJihpLl9fcHJvdG9fXz10KSxpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSxpLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1pLGkucHJvdG90eXBlLnVwZGF0ZURlbHRhPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy51bmlmb3Jtcy5lbmQueC10aGlzLnVuaWZvcm1zLnN0YXJ0LngsaT10aGlzLnVuaWZvcm1zLmVuZC55LXRoaXMudW5pZm9ybXMuc3RhcnQueSxlPU1hdGguc3FydCh0KnQraSppKTt0aGlzLnVuaWZvcm1zLmRlbHRhLng9dC9lLHRoaXMudW5pZm9ybXMuZGVsdGEueT1pL2V9LGl9KHIpO1BJWEkuZmlsdGVycy5UaWx0U2hpZnRYRmlsdGVyPW47dmFyIG89ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaSgpe3QuYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiB0JiYoaS5fX3Byb3RvX189dCksaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSksaS5wcm90b3R5cGUuY29uc3RydWN0b3I9aSxpLnByb3RvdHlwZS51cGRhdGVEZWx0YT1mdW5jdGlvbigpe3ZhciB0PXRoaXMudW5pZm9ybXMuZW5kLngtdGhpcy51bmlmb3Jtcy5zdGFydC54LGk9dGhpcy51bmlmb3Jtcy5lbmQueS10aGlzLnVuaWZvcm1zLnN0YXJ0LnksZT1NYXRoLnNxcnQodCp0K2kqaSk7dGhpcy51bmlmb3Jtcy5kZWx0YS54PS1pL2UsdGhpcy51bmlmb3Jtcy5kZWx0YS55PXQvZX0saX0ocik7UElYSS5maWx0ZXJzLlRpbHRTaGlmdFlGaWx0ZXI9bzt2YXIgbD1mdW5jdGlvbih0KXtmdW5jdGlvbiBpKGksZSxyLGwpe3ZvaWQgMD09PWkmJihpPTEwMCksdm9pZCAwPT09ZSYmKGU9NjAwKSx2b2lkIDA9PT1yJiYocj1udWxsKSx2b2lkIDA9PT1sJiYobD1udWxsKSx0LmNhbGwodGhpcyksdGhpcy50aWx0U2hpZnRYRmlsdGVyPW5ldyBuKGksZSxyLGwpLHRoaXMudGlsdFNoaWZ0WUZpbHRlcj1uZXcgbyhpLGUscixsKX10JiYoaS5fX3Byb3RvX189dCksKGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1pO3ZhciBlPXtibHVyOntjb25maWd1cmFibGU6ITB9LGdyYWRpZW50Qmx1cjp7Y29uZmlndXJhYmxlOiEwfSxzdGFydDp7Y29uZmlndXJhYmxlOiEwfSxlbmQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbih0LGksZSl7dmFyIHI9dC5nZXRSZW5kZXJUYXJnZXQoITApO3RoaXMudGlsdFNoaWZ0WEZpbHRlci5hcHBseSh0LGksciksdGhpcy50aWx0U2hpZnRZRmlsdGVyLmFwcGx5KHQscixlKSx0LnJldHVyblJlbmRlclRhcmdldChyKX0sZS5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuYmx1cn0sZS5ibHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuYmx1cj10aGlzLnRpbHRTaGlmdFlGaWx0ZXIuYmx1cj10fSxlLmdyYWRpZW50Qmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aWx0U2hpZnRYRmlsdGVyLmdyYWRpZW50Qmx1cn0sZS5ncmFkaWVudEJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGlsdFNoaWZ0WEZpbHRlci5ncmFkaWVudEJsdXI9dGhpcy50aWx0U2hpZnRZRmlsdGVyLmdyYWRpZW50Qmx1cj10fSxlLnN0YXJ0LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuc3RhcnR9LGUuc3RhcnQuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGlsdFNoaWZ0WEZpbHRlci5zdGFydD10aGlzLnRpbHRTaGlmdFlGaWx0ZXIuc3RhcnQ9dH0sZS5lbmQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlsdFNoaWZ0WEZpbHRlci5lbmR9LGUuZW5kLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuZW5kPXRoaXMudGlsdFNoaWZ0WUZpbHRlci5lbmQ9dH0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaS5wcm90b3R5cGUsZSksaX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5UaWx0U2hpZnRGaWx0ZXI9bCx0LlRpbHRTaGlmdEZpbHRlcj1sLHQuVGlsdFNoaWZ0WEZpbHRlcj1uLHQuVGlsdFNoaWZ0WUZpbHRlcj1vLHQuVGlsdFNoaWZ0QXhpc0ZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItdGlsdC1zaGlmdC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXR3aXN0IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci10d2lzdCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihvLG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP24oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG4pOm4oby5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihvKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCByYWRpdXM7XFxudW5pZm9ybSBmbG9hdCBhbmdsZTtcXG51bmlmb3JtIHZlYzIgb2Zmc2V0O1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnZlYzIgbWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgKj0gZmlsdGVyQXJlYS54eTtcXG4gICAgY29vcmQgKz0gZmlsdGVyQXJlYS56dztcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHVubWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgLT0gZmlsdGVyQXJlYS56dztcXG4gICAgY29vcmQgLz0gZmlsdGVyQXJlYS54eTtcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHR3aXN0KHZlYzIgY29vcmQpXFxue1xcbiAgICBjb29yZCAtPSBvZmZzZXQ7XFxuXFxuICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgoY29vcmQpO1xcblxcbiAgICBpZiAoZGlzdCA8IHJhZGl1cylcXG4gICAge1xcbiAgICAgICAgZmxvYXQgcmF0aW9EaXN0ID0gKHJhZGl1cyAtIGRpc3QpIC8gcmFkaXVzO1xcbiAgICAgICAgZmxvYXQgYW5nbGVNb2QgPSByYXRpb0Rpc3QgKiByYXRpb0Rpc3QgKiBhbmdsZTtcXG4gICAgICAgIGZsb2F0IHMgPSBzaW4oYW5nbGVNb2QpO1xcbiAgICAgICAgZmxvYXQgYyA9IGNvcyhhbmdsZU1vZCk7XFxuICAgICAgICBjb29yZCA9IHZlYzIoY29vcmQueCAqIGMgLSBjb29yZC55ICogcywgY29vcmQueCAqIHMgKyBjb29yZC55ICogYyk7XFxuICAgIH1cXG5cXG4gICAgY29vcmQgKz0gb2Zmc2V0O1xcblxcbiAgICByZXR1cm4gY29vcmQ7XFxufVxcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG5cXG4gICAgdmVjMiBjb29yZCA9IG1hcENvb3JkKHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBjb29yZCA9IHR3aXN0KGNvb3JkKTtcXG5cXG4gICAgY29vcmQgPSB1bm1hcENvb3JkKGNvb3JkKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb29yZCApO1xcblxcbn1cXG5cIixlPWZ1bmN0aW9uKG8pe2Z1bmN0aW9uIGUoZSx0LGkpe3ZvaWQgMD09PWUmJihlPTIwMCksdm9pZCAwPT09dCYmKHQ9NCksdm9pZCAwPT09aSYmKGk9MjApLG8uY2FsbCh0aGlzLG4sciksdGhpcy5yYWRpdXM9ZSx0aGlzLmFuZ2xlPXQsdGhpcy5wYWRkaW5nPWl9byYmKGUuX19wcm90b19fPW8pLChlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG8mJm8ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9ZTt2YXIgdD17b2Zmc2V0Ontjb25maWd1cmFibGU6ITB9LHJhZGl1czp7Y29uZmlndXJhYmxlOiEwfSxhbmdsZTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQub2Zmc2V0LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLm9mZnNldH0sdC5vZmZzZXQuc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMub2Zmc2V0PW99LHQucmFkaXVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnJhZGl1c30sdC5yYWRpdXMuc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMucmFkaXVzPW99LHQuYW5nbGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYW5nbGV9LHQuYW5nbGUuc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMuYW5nbGU9b30sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZS5wcm90b3R5cGUsdCksZX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Ud2lzdEZpbHRlcj1lLG8uVHdpc3RGaWx0ZXI9ZSxPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXR3aXN0LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItem9vbS1ibHVyIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci16b29tLWJsdXIgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obixlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKG4uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnVuaWZvcm0gdmVjMiB1Q2VudGVyO1xcbnVuaWZvcm0gZmxvYXQgdVN0cmVuZ3RoO1xcbnVuaWZvcm0gZmxvYXQgdUlubmVyUmFkaXVzO1xcbnVuaWZvcm0gZmxvYXQgdVJhZGl1cztcXG5cXG5jb25zdCBmbG9hdCBNQVhfS0VSTkVMX1NJWkUgPSAzMi4wO1xcblxcbmZsb2F0IHJhbmRvbSh2ZWMzIHNjYWxlLCBmbG9hdCBzZWVkKSB7XFxuICAgIC8vIHVzZSB0aGUgZnJhZ21lbnQgcG9zaXRpb24gZm9yIGEgZGlmZmVyZW50IHNlZWQgcGVyLXBpeGVsXFxuICAgIHJldHVybiBmcmFjdChzaW4oZG90KGdsX0ZyYWdDb29yZC54eXogKyBzZWVkLCBzY2FsZSkpICogNDM3NTguNTQ1MyArIHNlZWQpO1xcbn1cXG5cXG52b2lkIG1haW4oKSB7XFxuXFxuICAgIGZsb2F0IG1pbkdyYWRpZW50ID0gdUlubmVyUmFkaXVzICogMC4zO1xcbiAgICBmbG9hdCBpbm5lclJhZGl1cyA9ICh1SW5uZXJSYWRpdXMgKyBtaW5HcmFkaWVudCAqIDAuNSkgLyBmaWx0ZXJBcmVhLng7XFxuXFxuICAgIGZsb2F0IGdyYWRpZW50ID0gdVJhZGl1cyAqIDAuMztcXG4gICAgZmxvYXQgcmFkaXVzID0gKHVSYWRpdXMgLSBncmFkaWVudCAqIDAuNSkgLyBmaWx0ZXJBcmVhLng7XFxuXFxuICAgIGZsb2F0IGNvdW50TGltaXQgPSBNQVhfS0VSTkVMX1NJWkU7XFxuXFxuICAgIHZlYzIgZGlyID0gdmVjMih1Q2VudGVyLnh5IC8gZmlsdGVyQXJlYS54eSAtIHZUZXh0dXJlQ29vcmQpO1xcbiAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKHZlYzIoZGlyLngsIGRpci55ICogZmlsdGVyQXJlYS55IC8gZmlsdGVyQXJlYS54KSk7XFxuXFxuICAgIGZsb2F0IHN0cmVuZ3RoID0gdVN0cmVuZ3RoO1xcblxcbiAgICBmbG9hdCBkZWx0YSA9IDAuMDtcXG4gICAgZmxvYXQgZ2FwO1xcbiAgICBpZiAoZGlzdCA8IGlubmVyUmFkaXVzKSB7XFxuICAgICAgICBkZWx0YSA9IGlubmVyUmFkaXVzIC0gZGlzdDtcXG4gICAgICAgIGdhcCA9IG1pbkdyYWRpZW50O1xcbiAgICB9IGVsc2UgaWYgKHJhZGl1cyA+PSAwLjAgJiYgZGlzdCA+IHJhZGl1cykgeyAvLyByYWRpdXMgPCAwIG1lYW5zIGl0J3MgaW5maW5pdHlcXG4gICAgICAgIGRlbHRhID0gZGlzdCAtIHJhZGl1cztcXG4gICAgICAgIGdhcCA9IGdyYWRpZW50O1xcbiAgICB9XFxuXFxuICAgIGlmIChkZWx0YSA+IDAuMCkge1xcbiAgICAgICAgZmxvYXQgbm9ybWFsQ291bnQgPSBnYXAgLyBmaWx0ZXJBcmVhLng7XFxuICAgICAgICBkZWx0YSA9IChub3JtYWxDb3VudCAtIGRlbHRhKSAvIG5vcm1hbENvdW50O1xcbiAgICAgICAgY291bnRMaW1pdCAqPSBkZWx0YTtcXG4gICAgICAgIHN0cmVuZ3RoICo9IGRlbHRhO1xcbiAgICAgICAgaWYgKGNvdW50TGltaXQgPCAxLjApXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgICAgICAgICByZXR1cm47XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgLy8gcmFuZG9taXplIHRoZSBsb29rdXAgdmFsdWVzIHRvIGhpZGUgdGhlIGZpeGVkIG51bWJlciBvZiBzYW1wbGVzXFxuICAgIGZsb2F0IG9mZnNldCA9IHJhbmRvbSh2ZWMzKDEyLjk4OTgsIDc4LjIzMywgMTUxLjcxODIpLCAwLjApO1xcblxcbiAgICBmbG9hdCB0b3RhbCA9IDAuMDtcXG4gICAgdmVjNCBjb2xvciA9IHZlYzQoMC4wKTtcXG5cXG4gICAgZGlyICo9IHN0cmVuZ3RoO1xcblxcbiAgICBmb3IgKGZsb2F0IHQgPSAwLjA7IHQgPCBNQVhfS0VSTkVMX1NJWkU7IHQrKykge1xcbiAgICAgICAgZmxvYXQgcGVyY2VudCA9ICh0ICsgb2Zmc2V0KSAvIE1BWF9LRVJORUxfU0laRTtcXG4gICAgICAgIGZsb2F0IHdlaWdodCA9IDQuMCAqIChwZXJjZW50IC0gcGVyY2VudCAqIHBlcmNlbnQpO1xcbiAgICAgICAgdmVjMiBwID0gdlRleHR1cmVDb29yZCArIGRpciAqIHBlcmNlbnQ7XFxuICAgICAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgcCk7XFxuXFxuICAgICAgICAvLyBzd2l0Y2ggdG8gcHJlLW11bHRpcGxpZWQgYWxwaGEgdG8gY29ycmVjdGx5IGJsdXIgdHJhbnNwYXJlbnQgaW1hZ2VzXFxuICAgICAgICAvLyBzYW1wbGUucmdiICo9IHNhbXBsZS5hO1xcblxcbiAgICAgICAgY29sb3IgKz0gc2FtcGxlICogd2VpZ2h0O1xcbiAgICAgICAgdG90YWwgKz0gd2VpZ2h0O1xcblxcbiAgICAgICAgaWYgKHQgPiBjb3VudExpbWl0KXtcXG4gICAgICAgICAgICBicmVhaztcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBjb2xvciAvIHRvdGFsO1xcblxcbiAgICAvLyBzd2l0Y2ggYmFjayBmcm9tIHByZS1tdWx0aXBsaWVkIGFscGhhXFxuICAgIGdsX0ZyYWdDb2xvci5yZ2IgLz0gZ2xfRnJhZ0NvbG9yLmEgKyAwLjAwMDAxO1xcblxcbn1cXG5cIixyPWZ1bmN0aW9uKG4pe2Z1bmN0aW9uIHIocixpLG8sYSl7dm9pZCAwPT09ciYmKHI9LjEpLHZvaWQgMD09PWkmJihpPVswLDBdKSx2b2lkIDA9PT1vJiYobz0wKSx2b2lkIDA9PT1hJiYoYT0tMSksbi5jYWxsKHRoaXMsZSx0KSx0aGlzLmNlbnRlcj1pLHRoaXMuc3RyZW5ndGg9cix0aGlzLmlubmVyUmFkaXVzPW8sdGhpcy5yYWRpdXM9YX1uJiYoci5fX3Byb3RvX189biksKHIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobiYmbi5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1yO3ZhciBpPXtjZW50ZXI6e2NvbmZpZ3VyYWJsZTohMH0sc3RyZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH0saW5uZXJSYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH0scmFkaXVzOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5jZW50ZXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudUNlbnRlcn0saS5jZW50ZXIuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudUNlbnRlcj1ufSxpLnN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVTdHJlbmd0aH0saS5zdHJlbmd0aC5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy51U3RyZW5ndGg9bn0saS5pbm5lclJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51SW5uZXJSYWRpdXN9LGkuaW5uZXJSYWRpdXMuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudUlubmVyUmFkaXVzPW59LGkucmFkaXVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVSYWRpdXN9LGkucmFkaXVzLnNldD1mdW5jdGlvbihuKXsobjwwfHxuPT09MS8wKSYmKG49LTEpLHRoaXMudW5pZm9ybXMudVJhZGl1cz1ufSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxpKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlpvb21CbHVyRmlsdGVyPXIsbi5ab29tQmx1ckZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItem9vbS1ibHVyLmpzLm1hcFxuIiwiLyohXG4gKiBwaXhpLWZpbHRlcnMgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogcGl4aS1maWx0ZXJzIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGZpbHRlckFkdmFuY2VkQmxvb209cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1hZHZhbmNlZC1ibG9vbVwiKSxmaWx0ZXJBc2NpaT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWFzY2lpXCIpLGZpbHRlckJsb29tPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItYmxvb21cIiksZmlsdGVyQnVsZ2VQaW5jaD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWJ1bGdlLXBpbmNoXCIpLGZpbHRlckNvbG9yUmVwbGFjZT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWNvbG9yLXJlcGxhY2VcIiksZmlsdGVyQ29udm9sdXRpb249cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1jb252b2x1dGlvblwiKSxmaWx0ZXJDcm9zc0hhdGNoPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItY3Jvc3MtaGF0Y2hcIiksZmlsdGVyRG90PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItZG90XCIpLGZpbHRlckRyb3BTaGFkb3c9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1kcm9wLXNoYWRvd1wiKSxmaWx0ZXJFbWJvc3M9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1lbWJvc3NcIiksZmlsdGVyR2xvdz1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWdsb3dcIiksZmlsdGVyR29kcmF5PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItZ29kcmF5XCIpLGZpbHRlck1vdGlvbkJsdXI9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1tb3Rpb24tYmx1clwiKSxmaWx0ZXJNdWx0aUNvbG9yUmVwbGFjZT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2VcIiksZmlsdGVyT2xkRmlsbT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLW9sZC1maWxtXCIpLGZpbHRlck91dGxpbmU9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1vdXRsaW5lXCIpLGZpbHRlclBpeGVsYXRlPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItcGl4ZWxhdGVcIiksZmlsdGVyUmdiU3BsaXQ9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1yZ2Itc3BsaXRcIiksZmlsdGVyUmFkaWFsQmx1cj1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXJhZGlhbC1ibHVyXCIpLGZpbHRlclNob2Nrd2F2ZT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXNob2Nrd2F2ZVwiKSxmaWx0ZXJTaW1wbGVMaWdodG1hcD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXNpbXBsZS1saWdodG1hcFwiKSxmaWx0ZXJUaWx0U2hpZnQ9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci10aWx0LXNoaWZ0XCIpLGZpbHRlclR3aXN0PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItdHdpc3RcIiksZmlsdGVyWm9vbUJsdXI9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci16b29tLWJsdXJcIik7ZXhwb3J0cy5BZHZhbmNlZEJsb29tRmlsdGVyPWZpbHRlckFkdmFuY2VkQmxvb20uQWR2YW5jZWRCbG9vbUZpbHRlcixleHBvcnRzLkFzY2lpRmlsdGVyPWZpbHRlckFzY2lpLkFzY2lpRmlsdGVyLGV4cG9ydHMuQmxvb21GaWx0ZXI9ZmlsdGVyQmxvb20uQmxvb21GaWx0ZXIsZXhwb3J0cy5CdWxnZVBpbmNoRmlsdGVyPWZpbHRlckJ1bGdlUGluY2guQnVsZ2VQaW5jaEZpbHRlcixleHBvcnRzLkNvbG9yUmVwbGFjZUZpbHRlcj1maWx0ZXJDb2xvclJlcGxhY2UuQ29sb3JSZXBsYWNlRmlsdGVyLGV4cG9ydHMuQ29udm9sdXRpb25GaWx0ZXI9ZmlsdGVyQ29udm9sdXRpb24uQ29udm9sdXRpb25GaWx0ZXIsZXhwb3J0cy5Dcm9zc0hhdGNoRmlsdGVyPWZpbHRlckNyb3NzSGF0Y2guQ3Jvc3NIYXRjaEZpbHRlcixleHBvcnRzLkRvdEZpbHRlcj1maWx0ZXJEb3QuRG90RmlsdGVyLGV4cG9ydHMuRHJvcFNoYWRvd0ZpbHRlcj1maWx0ZXJEcm9wU2hhZG93LkRyb3BTaGFkb3dGaWx0ZXIsZXhwb3J0cy5FbWJvc3NGaWx0ZXI9ZmlsdGVyRW1ib3NzLkVtYm9zc0ZpbHRlcixleHBvcnRzLkdsb3dGaWx0ZXI9ZmlsdGVyR2xvdy5HbG93RmlsdGVyLGV4cG9ydHMuR29kcmF5RmlsdGVyPWZpbHRlckdvZHJheS5Hb2RyYXlGaWx0ZXIsZXhwb3J0cy5Nb3Rpb25CbHVyRmlsdGVyPWZpbHRlck1vdGlvbkJsdXIuTW90aW9uQmx1ckZpbHRlcixleHBvcnRzLk11bHRpQ29sb3JSZXBsYWNlRmlsdGVyPWZpbHRlck11bHRpQ29sb3JSZXBsYWNlLk11bHRpQ29sb3JSZXBsYWNlRmlsdGVyLGV4cG9ydHMuT2xkRmlsbUZpbHRlcj1maWx0ZXJPbGRGaWxtLk9sZEZpbG1GaWx0ZXIsZXhwb3J0cy5PdXRsaW5lRmlsdGVyPWZpbHRlck91dGxpbmUuT3V0bGluZUZpbHRlcixleHBvcnRzLlBpeGVsYXRlRmlsdGVyPWZpbHRlclBpeGVsYXRlLlBpeGVsYXRlRmlsdGVyLGV4cG9ydHMuUkdCU3BsaXRGaWx0ZXI9ZmlsdGVyUmdiU3BsaXQuUkdCU3BsaXRGaWx0ZXIsZXhwb3J0cy5SYWRpYWxCbHVyRmlsdGVyPWZpbHRlclJhZGlhbEJsdXIuUmFkaWFsQmx1ckZpbHRlcixleHBvcnRzLlNob2Nrd2F2ZUZpbHRlcj1maWx0ZXJTaG9ja3dhdmUuU2hvY2t3YXZlRmlsdGVyLGV4cG9ydHMuU2ltcGxlTGlnaHRtYXBGaWx0ZXI9ZmlsdGVyU2ltcGxlTGlnaHRtYXAuU2ltcGxlTGlnaHRtYXBGaWx0ZXIsZXhwb3J0cy5UaWx0U2hpZnRGaWx0ZXI9ZmlsdGVyVGlsdFNoaWZ0LlRpbHRTaGlmdEZpbHRlcixleHBvcnRzLlRpbHRTaGlmdEF4aXNGaWx0ZXI9ZmlsdGVyVGlsdFNoaWZ0LlRpbHRTaGlmdEF4aXNGaWx0ZXIsZXhwb3J0cy5UaWx0U2hpZnRYRmlsdGVyPWZpbHRlclRpbHRTaGlmdC5UaWx0U2hpZnRYRmlsdGVyLGV4cG9ydHMuVGlsdFNoaWZ0WUZpbHRlcj1maWx0ZXJUaWx0U2hpZnQuVGlsdFNoaWZ0WUZpbHRlcixleHBvcnRzLlR3aXN0RmlsdGVyPWZpbHRlclR3aXN0LlR3aXN0RmlsdGVyLGV4cG9ydHMuWm9vbUJsdXJGaWx0ZXI9ZmlsdGVyWm9vbUJsdXIuWm9vbUJsdXJGaWx0ZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLWZpbHRlcnMuanMubWFwXG4iLCIvKiFcbiAqIHBpeGktcGFydGljbGVzIC0gdjIuMS45XG4gKiBDb21waWxlZCBUaHUsIDE2IE5vdiAyMDE3IDAxOjUyOjM5IFVUQ1xuICpcbiAqIHBpeGktcGFydGljbGVzIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlKW1vZHVsZS5leHBvcnRzPXQoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sdCk7ZWxzZXt2YXIgaTtpPVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6dGhpcyxpLnBpeGlQYXJ0aWNsZXM9dCgpfX0oZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24gdChpLGUscyl7ZnVuY3Rpb24gYShuLG8pe2lmKCFlW25dKXtpZighaVtuXSl7dmFyIGg9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighbyYmaClyZXR1cm4gaChuLCEwKTtpZihyKXJldHVybiByKG4sITApO3ZhciBsPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbitcIidcIik7dGhyb3cgbC5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGx9dmFyIHA9ZVtuXT17ZXhwb3J0czp7fX07aVtuXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbih0KXt2YXIgZT1pW25dWzFdW3RdO3JldHVybiBhKGU/ZTp0KX0scCxwLmV4cG9ydHMsdCxpLGUscyl9cmV0dXJuIGVbbl0uZXhwb3J0c31mb3IodmFyIHI9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxuPTA7bjxzLmxlbmd0aDtuKyspYShzW25dKTtyZXR1cm4gYX0oezE6W2Z1bmN0aW9uKHQsaSxlKXtcInVzZSBzdHJpY3RcIjt2YXIgcz10KFwiLi9QYXJ0aWNsZVV0aWxzXCIpLGE9dChcIi4vUGFydGljbGVcIikscj1QSVhJLlRleHR1cmUsbj1mdW5jdGlvbih0KXthLmNhbGwodGhpcyx0KSx0aGlzLnRleHR1cmVzPW51bGwsdGhpcy5kdXJhdGlvbj0wLHRoaXMuZnJhbWVyYXRlPTAsdGhpcy5lbGFwc2VkPTAsdGhpcy5sb29wPSExfSxvPWEucHJvdG90eXBlLGg9bi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShvKTtoLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLlBhcnRpY2xlX2luaXQoKSx0aGlzLmVsYXBzZWQ9MCx0aGlzLmZyYW1lcmF0ZTwwJiYodGhpcy5kdXJhdGlvbj10aGlzLm1heExpZmUsdGhpcy5mcmFtZXJhdGU9dGhpcy50ZXh0dXJlcy5sZW5ndGgvdGhpcy5kdXJhdGlvbil9LGguYXBwbHlBcnQ9ZnVuY3Rpb24odCl7dGhpcy50ZXh0dXJlcz10LnRleHR1cmVzLHRoaXMuZnJhbWVyYXRlPXQuZnJhbWVyYXRlLHRoaXMuZHVyYXRpb249dC5kdXJhdGlvbix0aGlzLmxvb3A9dC5sb29wfSxoLnVwZGF0ZT1mdW5jdGlvbih0KXtpZih0aGlzLlBhcnRpY2xlX3VwZGF0ZSh0KT49MCl7dGhpcy5lbGFwc2VkKz10LHRoaXMuZWxhcHNlZD50aGlzLmR1cmF0aW9uJiYodGhpcy5sb29wP3RoaXMuZWxhcHNlZD10aGlzLmVsYXBzZWQldGhpcy5kdXJhdGlvbjp0aGlzLmVsYXBzZWQ9dGhpcy5kdXJhdGlvbi0xZS02KTt2YXIgaT10aGlzLmVsYXBzZWQqdGhpcy5mcmFtZXJhdGUrMWUtN3wwO3RoaXMudGV4dHVyZT10aGlzLnRleHR1cmVzW2ldfHxzLkVNUFRZX1RFWFRVUkV9fSxoLlBhcnRpY2xlX2Rlc3Ryb3k9YS5wcm90b3R5cGUuZGVzdHJveSxoLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLlBhcnRpY2xlX2Rlc3Ryb3koKSx0aGlzLnRleHR1cmVzPW51bGx9LG4ucGFyc2VBcnQ9ZnVuY3Rpb24odCl7dmFyIGksZSxzLGEsbixvLGg9W107Zm9yKGk9MDtpPHQubGVuZ3RoOysraSl7Zm9yKGU9dFtpXSx0W2ldPWg9e30saC50ZXh0dXJlcz1vPVtdLGE9ZS50ZXh0dXJlcyxzPTA7czxhLmxlbmd0aDsrK3MpaWYobj1hW3NdLFwic3RyaW5nXCI9PXR5cGVvZiBuKW8ucHVzaChyLmZyb21JbWFnZShuKSk7ZWxzZSBpZihuIGluc3RhbmNlb2YgcilvLnB1c2gobik7ZWxzZXt2YXIgbD1uLmNvdW50fHwxO2ZvcihuPVwic3RyaW5nXCI9PXR5cGVvZiBuLnRleHR1cmU/ci5mcm9tSW1hZ2Uobi50ZXh0dXJlKTpuLnRleHR1cmU7bD4wOy0tbClvLnB1c2gobil9XCJtYXRjaExpZmVcIj09ZS5mcmFtZXJhdGU/KGguZnJhbWVyYXRlPS0xLGguZHVyYXRpb249MCxoLmxvb3A9ITEpOihoLmxvb3A9ISFlLmxvb3AsaC5mcmFtZXJhdGU9ZS5mcmFtZXJhdGU+MD9lLmZyYW1lcmF0ZTo2MCxoLmR1cmF0aW9uPW8ubGVuZ3RoL2guZnJhbWVyYXRlKX1yZXR1cm4gdH0saS5leHBvcnRzPW59LHtcIi4vUGFydGljbGVcIjozLFwiLi9QYXJ0aWNsZVV0aWxzXCI6NH1dLDI6W2Z1bmN0aW9uKHQsaSxlKXtcInVzZSBzdHJpY3RcIjt2YXIgcz10KFwiLi9QYXJ0aWNsZVV0aWxzXCIpLGE9dChcIi4vUGFydGljbGVcIikscj1QSVhJLnBhcnRpY2xlcy5QYXJ0aWNsZUNvbnRhaW5lcnx8UElYSS5QYXJ0aWNsZUNvbnRhaW5lcixuPVBJWEkudGlja2VyLnNoYXJlZCxvPWZ1bmN0aW9uKHQsaSxlKXt0aGlzLl9wYXJ0aWNsZUNvbnN0cnVjdG9yPWEsdGhpcy5wYXJ0aWNsZUltYWdlcz1udWxsLHRoaXMuc3RhcnRBbHBoYT0xLHRoaXMuZW5kQWxwaGE9MSx0aGlzLnN0YXJ0U3BlZWQ9MCx0aGlzLmVuZFNwZWVkPTAsdGhpcy5taW5pbXVtU3BlZWRNdWx0aXBsaWVyPTEsdGhpcy5hY2NlbGVyYXRpb249bnVsbCx0aGlzLm1heFNwZWVkPU5hTix0aGlzLnN0YXJ0U2NhbGU9MSx0aGlzLmVuZFNjYWxlPTEsdGhpcy5taW5pbXVtU2NhbGVNdWx0aXBsaWVyPTEsdGhpcy5zdGFydENvbG9yPW51bGwsdGhpcy5lbmRDb2xvcj1udWxsLHRoaXMubWluTGlmZXRpbWU9MCx0aGlzLm1heExpZmV0aW1lPTAsdGhpcy5taW5TdGFydFJvdGF0aW9uPTAsdGhpcy5tYXhTdGFydFJvdGF0aW9uPTAsdGhpcy5ub1JvdGF0aW9uPSExLHRoaXMubWluUm90YXRpb25TcGVlZD0wLHRoaXMubWF4Um90YXRpb25TcGVlZD0wLHRoaXMucGFydGljbGVCbGVuZE1vZGU9MCx0aGlzLmN1c3RvbUVhc2U9bnVsbCx0aGlzLmV4dHJhRGF0YT1udWxsLHRoaXMuX2ZyZXF1ZW5jeT0xLHRoaXMubWF4UGFydGljbGVzPTFlMyx0aGlzLmVtaXR0ZXJMaWZldGltZT0tMSx0aGlzLnNwYXduUG9zPW51bGwsdGhpcy5zcGF3blR5cGU9bnVsbCx0aGlzLl9zcGF3bkZ1bmM9bnVsbCx0aGlzLnNwYXduUmVjdD1udWxsLHRoaXMuc3Bhd25DaXJjbGU9bnVsbCx0aGlzLnBhcnRpY2xlc1BlcldhdmU9MSx0aGlzLnBhcnRpY2xlU3BhY2luZz0wLHRoaXMuYW5nbGVTdGFydD0wLHRoaXMucm90YXRpb249MCx0aGlzLm93bmVyUG9zPW51bGwsdGhpcy5fcHJldkVtaXR0ZXJQb3M9bnVsbCx0aGlzLl9wcmV2UG9zSXNWYWxpZD0hMSx0aGlzLl9wb3NDaGFuZ2VkPSExLHRoaXMuX3BhcmVudElzUEM9ITEsdGhpcy5fcGFyZW50PW51bGwsdGhpcy5hZGRBdEJhY2s9ITEsdGhpcy5wYXJ0aWNsZUNvdW50PTAsdGhpcy5fZW1pdD0hMSx0aGlzLl9zcGF3blRpbWVyPTAsdGhpcy5fZW1pdHRlckxpZmU9LTEsdGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3Q9bnVsbCx0aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0PW51bGwsdGhpcy5fcG9vbEZpcnN0PW51bGwsdGhpcy5fb3JpZ0NvbmZpZz1udWxsLHRoaXMuX29yaWdBcnQ9bnVsbCx0aGlzLl9hdXRvVXBkYXRlPSExLHRoaXMuX2Rlc3Ryb3lXaGVuQ29tcGxldGU9ITEsdGhpcy5fY29tcGxldGVDYWxsYmFjaz1udWxsLHRoaXMucGFyZW50PXQsaSYmZSYmdGhpcy5pbml0KGksZSksdGhpcy5yZWN5Y2xlPXRoaXMucmVjeWNsZSx0aGlzLnVwZGF0ZT10aGlzLnVwZGF0ZSx0aGlzLnJvdGF0ZT10aGlzLnJvdGF0ZSx0aGlzLnVwZGF0ZVNwYXduUG9zPXRoaXMudXBkYXRlU3Bhd25Qb3MsdGhpcy51cGRhdGVPd25lclBvcz10aGlzLnVwZGF0ZU93bmVyUG9zfSxoPW8ucHJvdG90eXBlPXt9LGw9bmV3IFBJWEkuUG9pbnQ7T2JqZWN0LmRlZmluZVByb3BlcnR5KGgsXCJmcmVxdWVuY3lcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2ZyZXF1ZW5jeX0sc2V0OmZ1bmN0aW9uKHQpe1wibnVtYmVyXCI9PXR5cGVvZiB0JiZ0PjA/dGhpcy5fZnJlcXVlbmN5PXQ6dGhpcy5fZnJlcXVlbmN5PTF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGgsXCJwYXJ0aWNsZUNvbnN0cnVjdG9yXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXJ0aWNsZUNvbnN0cnVjdG9yfSxzZXQ6ZnVuY3Rpb24odCl7aWYodCE9dGhpcy5fcGFydGljbGVDb25zdHJ1Y3Rvcil7dGhpcy5fcGFydGljbGVDb25zdHJ1Y3Rvcj10LHRoaXMuY2xlYW51cCgpO2Zvcih2YXIgaT10aGlzLl9wb29sRmlyc3Q7aTtpPWkubmV4dClpLmRlc3Ryb3koKTt0aGlzLl9wb29sRmlyc3Q9bnVsbCx0aGlzLl9vcmlnQ29uZmlnJiZ0aGlzLl9vcmlnQXJ0JiZ0aGlzLmluaXQodGhpcy5fb3JpZ0FydCx0aGlzLl9vcmlnQ29uZmlnKX19fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGgsXCJwYXJlbnRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhcmVudH0sc2V0OmZ1bmN0aW9uKHQpe2lmKHRoaXMuX3BhcmVudElzUEMpZm9yKHZhciBpPXRoaXMuX3Bvb2xGaXJzdDtpO2k9aS5uZXh0KWkucGFyZW50JiZpLnBhcmVudC5yZW1vdmVDaGlsZChpKTt0aGlzLmNsZWFudXAoKSx0aGlzLl9wYXJlbnQ9dCx0aGlzLl9wYXJlbnRJc1BDPXImJnQmJnQgaW5zdGFuY2VvZiByfX0pLGguaW5pdD1mdW5jdGlvbih0LGkpe2lmKHQmJmkpe3RoaXMuY2xlYW51cCgpLHRoaXMuX29yaWdDb25maWc9aSx0aGlzLl9vcmlnQXJ0PXQsdD1BcnJheS5pc0FycmF5KHQpP3Quc2xpY2UoKTpbdF07dmFyIGU9dGhpcy5fcGFydGljbGVDb25zdHJ1Y3Rvcjt0aGlzLnBhcnRpY2xlSW1hZ2VzPWUucGFyc2VBcnQ/ZS5wYXJzZUFydCh0KTp0LGkuYWxwaGE/KHRoaXMuc3RhcnRBbHBoYT1pLmFscGhhLnN0YXJ0LHRoaXMuZW5kQWxwaGE9aS5hbHBoYS5lbmQpOnRoaXMuc3RhcnRBbHBoYT10aGlzLmVuZEFscGhhPTEsaS5zcGVlZD8odGhpcy5zdGFydFNwZWVkPWkuc3BlZWQuc3RhcnQsdGhpcy5lbmRTcGVlZD1pLnNwZWVkLmVuZCx0aGlzLm1pbmltdW1TcGVlZE11bHRpcGxpZXI9aS5zcGVlZC5taW5pbXVtU3BlZWRNdWx0aXBsaWVyfHwxKToodGhpcy5taW5pbXVtU3BlZWRNdWx0aXBsaWVyPTEsdGhpcy5zdGFydFNwZWVkPXRoaXMuZW5kU3BlZWQ9MCk7dmFyIGE9aS5hY2NlbGVyYXRpb247YSYmKGEueHx8YS55KT8odGhpcy5lbmRTcGVlZD10aGlzLnN0YXJ0U3BlZWQsdGhpcy5hY2NlbGVyYXRpb249bmV3IFBJWEkuUG9pbnQoYS54LGEueSksdGhpcy5tYXhTcGVlZD1pLm1heFNwZWVkfHxOYU4pOnRoaXMuYWNjZWxlcmF0aW9uPW5ldyBQSVhJLlBvaW50LGkuc2NhbGU/KHRoaXMuc3RhcnRTY2FsZT1pLnNjYWxlLnN0YXJ0LHRoaXMuZW5kU2NhbGU9aS5zY2FsZS5lbmQsdGhpcy5taW5pbXVtU2NhbGVNdWx0aXBsaWVyPWkuc2NhbGUubWluaW11bVNjYWxlTXVsdGlwbGllcnx8MSk6dGhpcy5zdGFydFNjYWxlPXRoaXMuZW5kU2NhbGU9dGhpcy5taW5pbXVtU2NhbGVNdWx0aXBsaWVyPTEsaS5jb2xvciYmKHRoaXMuc3RhcnRDb2xvcj1zLmhleFRvUkdCKGkuY29sb3Iuc3RhcnQpLGkuY29sb3Iuc3RhcnQhPWkuY29sb3IuZW5kP3RoaXMuZW5kQ29sb3I9cy5oZXhUb1JHQihpLmNvbG9yLmVuZCk6dGhpcy5lbmRDb2xvcj1udWxsKSxpLnN0YXJ0Um90YXRpb24/KHRoaXMubWluU3RhcnRSb3RhdGlvbj1pLnN0YXJ0Um90YXRpb24ubWluLHRoaXMubWF4U3RhcnRSb3RhdGlvbj1pLnN0YXJ0Um90YXRpb24ubWF4KTp0aGlzLm1pblN0YXJ0Um90YXRpb249dGhpcy5tYXhTdGFydFJvdGF0aW9uPTAsaS5ub1JvdGF0aW9uJiYodGhpcy5taW5TdGFydFJvdGF0aW9ufHx0aGlzLm1heFN0YXJ0Um90YXRpb24pP3RoaXMubm9Sb3RhdGlvbj0hIWkubm9Sb3RhdGlvbjp0aGlzLm5vUm90YXRpb249ITEsaS5yb3RhdGlvblNwZWVkPyh0aGlzLm1pblJvdGF0aW9uU3BlZWQ9aS5yb3RhdGlvblNwZWVkLm1pbix0aGlzLm1heFJvdGF0aW9uU3BlZWQ9aS5yb3RhdGlvblNwZWVkLm1heCk6dGhpcy5taW5Sb3RhdGlvblNwZWVkPXRoaXMubWF4Um90YXRpb25TcGVlZD0wLHRoaXMubWluTGlmZXRpbWU9aS5saWZldGltZS5taW4sdGhpcy5tYXhMaWZldGltZT1pLmxpZmV0aW1lLm1heCx0aGlzLnBhcnRpY2xlQmxlbmRNb2RlPXMuZ2V0QmxlbmRNb2RlKGkuYmxlbmRNb2RlKSxpLmVhc2U/dGhpcy5jdXN0b21FYXNlPVwiZnVuY3Rpb25cIj09dHlwZW9mIGkuZWFzZT9pLmVhc2U6cy5nZW5lcmF0ZUVhc2UoaS5lYXNlKTp0aGlzLmN1c3RvbUVhc2U9bnVsbCxlLnBhcnNlRGF0YT90aGlzLmV4dHJhRGF0YT1lLnBhcnNlRGF0YShpLmV4dHJhRGF0YSk6dGhpcy5leHRyYURhdGE9aS5leHRyYURhdGF8fG51bGwsdGhpcy5zcGF3blJlY3Q9dGhpcy5zcGF3bkNpcmNsZT1udWxsLHRoaXMucGFydGljbGVzUGVyV2F2ZT0xLHRoaXMucGFydGljbGVTcGFjaW5nPTAsdGhpcy5hbmdsZVN0YXJ0PTA7dmFyIHI7c3dpdGNoKGkuc3Bhd25UeXBlKXtjYXNlXCJyZWN0XCI6dGhpcy5zcGF3blR5cGU9XCJyZWN0XCIsdGhpcy5fc3Bhd25GdW5jPXRoaXMuX3NwYXduUmVjdDt2YXIgbj1pLnNwYXduUmVjdDt0aGlzLnNwYXduUmVjdD1uZXcgUElYSS5SZWN0YW5nbGUobi54LG4ueSxuLncsbi5oKTticmVhaztjYXNlXCJjaXJjbGVcIjp0aGlzLnNwYXduVHlwZT1cImNpcmNsZVwiLHRoaXMuX3NwYXduRnVuYz10aGlzLl9zcGF3bkNpcmNsZSxyPWkuc3Bhd25DaXJjbGUsdGhpcy5zcGF3bkNpcmNsZT1uZXcgUElYSS5DaXJjbGUoci54LHIueSxyLnIpO2JyZWFrO2Nhc2VcInJpbmdcIjp0aGlzLnNwYXduVHlwZT1cInJpbmdcIix0aGlzLl9zcGF3bkZ1bmM9dGhpcy5fc3Bhd25SaW5nLHI9aS5zcGF3bkNpcmNsZSx0aGlzLnNwYXduQ2lyY2xlPW5ldyBQSVhJLkNpcmNsZShyLngsci55LHIuciksdGhpcy5zcGF3bkNpcmNsZS5taW5SYWRpdXM9ci5taW5SO2JyZWFrO2Nhc2VcImJ1cnN0XCI6dGhpcy5zcGF3blR5cGU9XCJidXJzdFwiLHRoaXMuX3NwYXduRnVuYz10aGlzLl9zcGF3bkJ1cnN0LHRoaXMucGFydGljbGVzUGVyV2F2ZT1pLnBhcnRpY2xlc1BlcldhdmUsdGhpcy5wYXJ0aWNsZVNwYWNpbmc9aS5wYXJ0aWNsZVNwYWNpbmcsdGhpcy5hbmdsZVN0YXJ0PWkuYW5nbGVTdGFydD9pLmFuZ2xlU3RhcnQ6MDticmVhaztjYXNlXCJwb2ludFwiOnRoaXMuc3Bhd25UeXBlPVwicG9pbnRcIix0aGlzLl9zcGF3bkZ1bmM9dGhpcy5fc3Bhd25Qb2ludDticmVhaztkZWZhdWx0OnRoaXMuc3Bhd25UeXBlPVwicG9pbnRcIix0aGlzLl9zcGF3bkZ1bmM9dGhpcy5fc3Bhd25Qb2ludH10aGlzLmZyZXF1ZW5jeT1pLmZyZXF1ZW5jeSx0aGlzLmVtaXR0ZXJMaWZldGltZT1pLmVtaXR0ZXJMaWZldGltZXx8LTEsdGhpcy5tYXhQYXJ0aWNsZXM9aS5tYXhQYXJ0aWNsZXM+MD9pLm1heFBhcnRpY2xlczoxZTMsdGhpcy5hZGRBdEJhY2s9ISFpLmFkZEF0QmFjayx0aGlzLnJvdGF0aW9uPTAsdGhpcy5vd25lclBvcz1uZXcgUElYSS5Qb2ludCx0aGlzLnNwYXduUG9zPW5ldyBQSVhJLlBvaW50KGkucG9zLngsaS5wb3MueSksdGhpcy5fcHJldkVtaXR0ZXJQb3M9dGhpcy5zcGF3blBvcy5jbG9uZSgpLHRoaXMuX3ByZXZQb3NJc1ZhbGlkPSExLHRoaXMuX3NwYXduVGltZXI9MCx0aGlzLmVtaXQ9dm9pZCAwPT09aS5lbWl0fHwhIWkuZW1pdCx0aGlzLmF1dG9VcGRhdGU9dm9pZCAwIT09aS5hdXRvVXBkYXRlJiYhIWkuYXV0b1VwZGF0ZX19LGgucmVjeWNsZT1mdW5jdGlvbih0KXt0Lm5leHQmJih0Lm5leHQucHJldj10LnByZXYpLHQucHJldiYmKHQucHJldi5uZXh0PXQubmV4dCksdD09dGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdCYmKHRoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3Q9dC5wcmV2KSx0PT10aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdCYmKHRoaXMuX2FjdGl2ZVBhcnRpY2xlc0ZpcnN0PXQubmV4dCksdC5wcmV2PW51bGwsdC5uZXh0PXRoaXMuX3Bvb2xGaXJzdCx0aGlzLl9wb29sRmlyc3Q9dCx0aGlzLl9wYXJlbnRJc1BDPyh0LmFscGhhPTAsdC52aXNpYmxlPSExKTp0LnBhcmVudCYmdC5wYXJlbnQucmVtb3ZlQ2hpbGQodCksLS10aGlzLnBhcnRpY2xlQ291bnR9LGgucm90YXRlPWZ1bmN0aW9uKHQpe2lmKHRoaXMucm90YXRpb24hPXQpe3ZhciBpPXQtdGhpcy5yb3RhdGlvbjt0aGlzLnJvdGF0aW9uPXQscy5yb3RhdGVQb2ludChpLHRoaXMuc3Bhd25Qb3MpLHRoaXMuX3Bvc0NoYW5nZWQ9ITB9fSxoLnVwZGF0ZVNwYXduUG9zPWZ1bmN0aW9uKHQsaSl7dGhpcy5fcG9zQ2hhbmdlZD0hMCx0aGlzLnNwYXduUG9zLng9dCx0aGlzLnNwYXduUG9zLnk9aX0saC51cGRhdGVPd25lclBvcz1mdW5jdGlvbih0LGkpe3RoaXMuX3Bvc0NoYW5nZWQ9ITAsdGhpcy5vd25lclBvcy54PXQsdGhpcy5vd25lclBvcy55PWl9LGgucmVzZXRQb3NpdGlvblRyYWNraW5nPWZ1bmN0aW9uKCl7dGhpcy5fcHJldlBvc0lzVmFsaWQ9ITF9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShoLFwiZW1pdFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZW1pdH0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuX2VtaXQ9ISF0LHRoaXMuX2VtaXR0ZXJMaWZlPXRoaXMuZW1pdHRlckxpZmV0aW1lfX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShoLFwiYXV0b1VwZGF0ZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXV0b1VwZGF0ZX0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuX2F1dG9VcGRhdGUmJiF0P24ucmVtb3ZlKHRoaXMudXBkYXRlLHRoaXMpOiF0aGlzLl9hdXRvVXBkYXRlJiZ0JiZuLmFkZCh0aGlzLnVwZGF0ZSx0aGlzKSx0aGlzLl9hdXRvVXBkYXRlPSEhdH19KSxoLnBsYXlPbmNlQW5kRGVzdHJveT1mdW5jdGlvbih0KXt0aGlzLmF1dG9VcGRhdGU9ITAsdGhpcy5lbWl0PSEwLHRoaXMuX2Rlc3Ryb3lXaGVuQ29tcGxldGU9ITAsdGhpcy5fY29tcGxldGVDYWxsYmFjaz10fSxoLnBsYXlPbmNlPWZ1bmN0aW9uKHQpe3RoaXMuYXV0b1VwZGF0ZT0hMCx0aGlzLmVtaXQ9ITAsdGhpcy5fY29tcGxldGVDYWxsYmFjaz10fSxoLnVwZGF0ZT1mdW5jdGlvbih0KXtpZih0aGlzLl9hdXRvVXBkYXRlJiYodD10L1BJWEkuc2V0dGluZ3MuVEFSR0VUX0ZQTVMvMWUzKSx0aGlzLl9wYXJlbnQpe3ZhciBpLGUscztmb3IoZT10aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdDtlO2U9cylzPWUubmV4dCxlLnVwZGF0ZSh0KTt2YXIgYSxyO3RoaXMuX3ByZXZQb3NJc1ZhbGlkJiYoYT10aGlzLl9wcmV2RW1pdHRlclBvcy54LHI9dGhpcy5fcHJldkVtaXR0ZXJQb3MueSk7dmFyIG49dGhpcy5vd25lclBvcy54K3RoaXMuc3Bhd25Qb3MueCxvPXRoaXMub3duZXJQb3MueSt0aGlzLnNwYXduUG9zLnk7aWYodGhpcy5fZW1pdClmb3IodGhpcy5fc3Bhd25UaW1lci09dDt0aGlzLl9zcGF3blRpbWVyPD0wOyl7aWYodGhpcy5fZW1pdHRlckxpZmU+MCYmKHRoaXMuX2VtaXR0ZXJMaWZlLT10aGlzLl9mcmVxdWVuY3ksdGhpcy5fZW1pdHRlckxpZmU8PTApKXt0aGlzLl9zcGF3blRpbWVyPTAsdGhpcy5fZW1pdHRlckxpZmU9MCx0aGlzLmVtaXQ9ITE7YnJlYWt9aWYodGhpcy5wYXJ0aWNsZUNvdW50Pj10aGlzLm1heFBhcnRpY2xlcyl0aGlzLl9zcGF3blRpbWVyKz10aGlzLl9mcmVxdWVuY3k7ZWxzZXt2YXIgaDtpZihoPXRoaXMubWluTGlmZXRpbWU9PXRoaXMubWF4TGlmZXRpbWU/dGhpcy5taW5MaWZldGltZTpNYXRoLnJhbmRvbSgpKih0aGlzLm1heExpZmV0aW1lLXRoaXMubWluTGlmZXRpbWUpK3RoaXMubWluTGlmZXRpbWUsLXRoaXMuX3NwYXduVGltZXI8aCl7dmFyIGwscDtpZih0aGlzLl9wcmV2UG9zSXNWYWxpZCYmdGhpcy5fcG9zQ2hhbmdlZCl7dmFyIGM9MSt0aGlzLl9zcGF3blRpbWVyL3Q7bD0obi1hKSpjK2EscD0oby1yKSpjK3J9ZWxzZSBsPW4scD1vO2k9MDtmb3IodmFyIGQ9TWF0aC5taW4odGhpcy5wYXJ0aWNsZXNQZXJXYXZlLHRoaXMubWF4UGFydGljbGVzLXRoaXMucGFydGljbGVDb3VudCk7aTxkOysraSl7dmFyIHUsbTtpZih0aGlzLl9wb29sRmlyc3Q/KHU9dGhpcy5fcG9vbEZpcnN0LHRoaXMuX3Bvb2xGaXJzdD10aGlzLl9wb29sRmlyc3QubmV4dCx1Lm5leHQ9bnVsbCk6dT1uZXcgdGhpcy5wYXJ0aWNsZUNvbnN0cnVjdG9yKHRoaXMpLHRoaXMucGFydGljbGVJbWFnZXMubGVuZ3RoPjE/dS5hcHBseUFydCh0aGlzLnBhcnRpY2xlSW1hZ2VzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSp0aGlzLnBhcnRpY2xlSW1hZ2VzLmxlbmd0aCldKTp1LmFwcGx5QXJ0KHRoaXMucGFydGljbGVJbWFnZXNbMF0pLHUuc3RhcnRBbHBoYT10aGlzLnN0YXJ0QWxwaGEsdS5lbmRBbHBoYT10aGlzLmVuZEFscGhhLDEhPXRoaXMubWluaW11bVNwZWVkTXVsdGlwbGllcj8obT1NYXRoLnJhbmRvbSgpKigxLXRoaXMubWluaW11bVNwZWVkTXVsdGlwbGllcikrdGhpcy5taW5pbXVtU3BlZWRNdWx0aXBsaWVyLHUuc3RhcnRTcGVlZD10aGlzLnN0YXJ0U3BlZWQqbSx1LmVuZFNwZWVkPXRoaXMuZW5kU3BlZWQqbSk6KHUuc3RhcnRTcGVlZD10aGlzLnN0YXJ0U3BlZWQsdS5lbmRTcGVlZD10aGlzLmVuZFNwZWVkKSx1LmFjY2VsZXJhdGlvbi54PXRoaXMuYWNjZWxlcmF0aW9uLngsdS5hY2NlbGVyYXRpb24ueT10aGlzLmFjY2VsZXJhdGlvbi55LHUubWF4U3BlZWQ9dGhpcy5tYXhTcGVlZCwxIT10aGlzLm1pbmltdW1TY2FsZU11bHRpcGxpZXI/KG09TWF0aC5yYW5kb20oKSooMS10aGlzLm1pbmltdW1TY2FsZU11bHRpcGxpZXIpK3RoaXMubWluaW11bVNjYWxlTXVsdGlwbGllcix1LnN0YXJ0U2NhbGU9dGhpcy5zdGFydFNjYWxlKm0sdS5lbmRTY2FsZT10aGlzLmVuZFNjYWxlKm0pOih1LnN0YXJ0U2NhbGU9dGhpcy5zdGFydFNjYWxlLHUuZW5kU2NhbGU9dGhpcy5lbmRTY2FsZSksdS5zdGFydENvbG9yPXRoaXMuc3RhcnRDb2xvcix1LmVuZENvbG9yPXRoaXMuZW5kQ29sb3IsdGhpcy5taW5Sb3RhdGlvblNwZWVkPT10aGlzLm1heFJvdGF0aW9uU3BlZWQ/dS5yb3RhdGlvblNwZWVkPXRoaXMubWluUm90YXRpb25TcGVlZDp1LnJvdGF0aW9uU3BlZWQ9TWF0aC5yYW5kb20oKSoodGhpcy5tYXhSb3RhdGlvblNwZWVkLXRoaXMubWluUm90YXRpb25TcGVlZCkrdGhpcy5taW5Sb3RhdGlvblNwZWVkLHUubm9Sb3RhdGlvbj10aGlzLm5vUm90YXRpb24sdS5tYXhMaWZlPWgsdS5ibGVuZE1vZGU9dGhpcy5wYXJ0aWNsZUJsZW5kTW9kZSx1LmVhc2U9dGhpcy5jdXN0b21FYXNlLHUuZXh0cmFEYXRhPXRoaXMuZXh0cmFEYXRhLHRoaXMuX3NwYXduRnVuYyh1LGwscCxpKSx1LmluaXQoKSx1LnVwZGF0ZSgtdGhpcy5fc3Bhd25UaW1lciksdGhpcy5fcGFyZW50SXNQQyYmdS5wYXJlbnQpe3ZhciBmPXRoaXMuX3BhcmVudC5jaGlsZHJlbjtpZihmWzBdPT11KWYuc2hpZnQoKTtlbHNlIGlmKGZbZi5sZW5ndGgtMV09PXUpZi5wb3AoKTtlbHNle3ZhciBfPWYuaW5kZXhPZih1KTtmLnNwbGljZShfLDEpfXRoaXMuYWRkQXRCYWNrP2YudW5zaGlmdCh1KTpmLnB1c2godSl9ZWxzZSB0aGlzLmFkZEF0QmFjaz90aGlzLl9wYXJlbnQuYWRkQ2hpbGRBdCh1LDApOnRoaXMuX3BhcmVudC5hZGRDaGlsZCh1KTt0aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0Pyh0aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0Lm5leHQ9dSx1LnByZXY9dGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdCx0aGlzLl9hY3RpdmVQYXJ0aWNsZXNMYXN0PXUpOnRoaXMuX2FjdGl2ZVBhcnRpY2xlc0xhc3Q9dGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3Q9dSwrK3RoaXMucGFydGljbGVDb3VudH19dGhpcy5fc3Bhd25UaW1lcis9dGhpcy5fZnJlcXVlbmN5fX10aGlzLl9wb3NDaGFuZ2VkJiYodGhpcy5fcHJldkVtaXR0ZXJQb3MueD1uLHRoaXMuX3ByZXZFbWl0dGVyUG9zLnk9byx0aGlzLl9wcmV2UG9zSXNWYWxpZD0hMCx0aGlzLl9wb3NDaGFuZ2VkPSExKSx0aGlzLl9lbWl0fHx0aGlzLl9hY3RpdmVQYXJ0aWNsZXNGaXJzdHx8KHRoaXMuX2NvbXBsZXRlQ2FsbGJhY2smJnRoaXMuX2NvbXBsZXRlQ2FsbGJhY2soKSx0aGlzLl9kZXN0cm95V2hlbkNvbXBsZXRlJiZ0aGlzLmRlc3Ryb3koKSl9fSxoLl9zcGF3blBvaW50PWZ1bmN0aW9uKHQsaSxlKXt0aGlzLm1pblN0YXJ0Um90YXRpb249PXRoaXMubWF4U3RhcnRSb3RhdGlvbj90LnJvdGF0aW9uPXRoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uOnQucm90YXRpb249TWF0aC5yYW5kb20oKSoodGhpcy5tYXhTdGFydFJvdGF0aW9uLXRoaXMubWluU3RhcnRSb3RhdGlvbikrdGhpcy5taW5TdGFydFJvdGF0aW9uK3RoaXMucm90YXRpb24sdC5wb3NpdGlvbi54PWksdC5wb3NpdGlvbi55PWV9LGguX3NwYXduUmVjdD1mdW5jdGlvbih0LGksZSl7dGhpcy5taW5TdGFydFJvdGF0aW9uPT10aGlzLm1heFN0YXJ0Um90YXRpb24/dC5yb3RhdGlvbj10aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbjp0LnJvdGF0aW9uPU1hdGgucmFuZG9tKCkqKHRoaXMubWF4U3RhcnRSb3RhdGlvbi10aGlzLm1pblN0YXJ0Um90YXRpb24pK3RoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uLGwueD1NYXRoLnJhbmRvbSgpKnRoaXMuc3Bhd25SZWN0LndpZHRoK3RoaXMuc3Bhd25SZWN0LngsbC55PU1hdGgucmFuZG9tKCkqdGhpcy5zcGF3blJlY3QuaGVpZ2h0K3RoaXMuc3Bhd25SZWN0LnksMCE9PXRoaXMucm90YXRpb24mJnMucm90YXRlUG9pbnQodGhpcy5yb3RhdGlvbixsKSx0LnBvc2l0aW9uLng9aStsLngsdC5wb3NpdGlvbi55PWUrbC55fSxoLl9zcGF3bkNpcmNsZT1mdW5jdGlvbih0LGksZSl7dGhpcy5taW5TdGFydFJvdGF0aW9uPT10aGlzLm1heFN0YXJ0Um90YXRpb24/dC5yb3RhdGlvbj10aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbjp0LnJvdGF0aW9uPU1hdGgucmFuZG9tKCkqKHRoaXMubWF4U3RhcnRSb3RhdGlvbi10aGlzLm1pblN0YXJ0Um90YXRpb24pK3RoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uLGwueD1NYXRoLnJhbmRvbSgpKnRoaXMuc3Bhd25DaXJjbGUucmFkaXVzLGwueT0wLHMucm90YXRlUG9pbnQoMzYwKk1hdGgucmFuZG9tKCksbCksbC54Kz10aGlzLnNwYXduQ2lyY2xlLngsbC55Kz10aGlzLnNwYXduQ2lyY2xlLnksMCE9PXRoaXMucm90YXRpb24mJnMucm90YXRlUG9pbnQodGhpcy5yb3RhdGlvbixsKSx0LnBvc2l0aW9uLng9aStsLngsdC5wb3NpdGlvbi55PWUrbC55fSxoLl9zcGF3blJpbmc9ZnVuY3Rpb24odCxpLGUpe3ZhciBhPXRoaXMuc3Bhd25DaXJjbGU7dGhpcy5taW5TdGFydFJvdGF0aW9uPT10aGlzLm1heFN0YXJ0Um90YXRpb24/dC5yb3RhdGlvbj10aGlzLm1pblN0YXJ0Um90YXRpb24rdGhpcy5yb3RhdGlvbjp0LnJvdGF0aW9uPU1hdGgucmFuZG9tKCkqKHRoaXMubWF4U3RhcnRSb3RhdGlvbi10aGlzLm1pblN0YXJ0Um90YXRpb24pK3RoaXMubWluU3RhcnRSb3RhdGlvbit0aGlzLnJvdGF0aW9uLGEubWluUmFkaXVzPT1hLnJhZGl1cz9sLng9TWF0aC5yYW5kb20oKSooYS5yYWRpdXMtYS5taW5SYWRpdXMpK2EubWluUmFkaXVzOmwueD1hLnJhZGl1cyxsLnk9MDt2YXIgcj0zNjAqTWF0aC5yYW5kb20oKTt0LnJvdGF0aW9uKz1yLHMucm90YXRlUG9pbnQocixsKSxsLngrPXRoaXMuc3Bhd25DaXJjbGUueCxsLnkrPXRoaXMuc3Bhd25DaXJjbGUueSwwIT09dGhpcy5yb3RhdGlvbiYmcy5yb3RhdGVQb2ludCh0aGlzLnJvdGF0aW9uLGwpLHQucG9zaXRpb24ueD1pK2wueCx0LnBvc2l0aW9uLnk9ZStsLnl9LGguX3NwYXduQnVyc3Q9ZnVuY3Rpb24odCxpLGUscyl7MD09PXRoaXMucGFydGljbGVTcGFjaW5nP3Qucm90YXRpb249MzYwKk1hdGgucmFuZG9tKCk6dC5yb3RhdGlvbj10aGlzLmFuZ2xlU3RhcnQrdGhpcy5wYXJ0aWNsZVNwYWNpbmcqcyt0aGlzLnJvdGF0aW9uLHQucG9zaXRpb24ueD1pLHQucG9zaXRpb24ueT1lfSxoLmNsZWFudXA9ZnVuY3Rpb24oKXt2YXIgdCxpO2Zvcih0PXRoaXMuX2FjdGl2ZVBhcnRpY2xlc0ZpcnN0O3Q7dD1pKWk9dC5uZXh0LHRoaXMucmVjeWNsZSh0KSx0LnBhcmVudCYmdC5wYXJlbnQucmVtb3ZlQ2hpbGQodCk7dGhpcy5fYWN0aXZlUGFydGljbGVzRmlyc3Q9dGhpcy5fYWN0aXZlUGFydGljbGVzTGFzdD1udWxsLHRoaXMucGFydGljbGVDb3VudD0wfSxoLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmF1dG9VcGRhdGU9ITEsdGhpcy5jbGVhbnVwKCk7Zm9yKHZhciB0LGk9dGhpcy5fcG9vbEZpcnN0O2k7aT10KXQ9aS5uZXh0LGkuZGVzdHJveSgpO3RoaXMuX3Bvb2xGaXJzdD10aGlzLl9wYXJlbnQ9dGhpcy5wYXJ0aWNsZUltYWdlcz10aGlzLnNwYXduUG9zPXRoaXMub3duZXJQb3M9dGhpcy5zdGFydENvbG9yPXRoaXMuZW5kQ29sb3I9dGhpcy5jdXN0b21FYXNlPXRoaXMuX2NvbXBsZXRlQ2FsbGJhY2s9bnVsbH0saS5leHBvcnRzPW99LHtcIi4vUGFydGljbGVcIjozLFwiLi9QYXJ0aWNsZVV0aWxzXCI6NH1dLDM6W2Z1bmN0aW9uKHQsaSxlKXt2YXIgcz10KFwiLi9QYXJ0aWNsZVV0aWxzXCIpLGE9UElYSS5TcHJpdGUscj1mdW5jdGlvbih0KXthLmNhbGwodGhpcyksdGhpcy5lbWl0dGVyPXQsdGhpcy5hbmNob3IueD10aGlzLmFuY2hvci55PS41LHRoaXMudmVsb2NpdHk9bmV3IFBJWEkuUG9pbnQsdGhpcy5tYXhMaWZlPTAsdGhpcy5hZ2U9MCx0aGlzLmVhc2U9bnVsbCx0aGlzLmV4dHJhRGF0YT1udWxsLHRoaXMuc3RhcnRBbHBoYT0wLHRoaXMuZW5kQWxwaGE9MCx0aGlzLnN0YXJ0U3BlZWQ9MCx0aGlzLmVuZFNwZWVkPTAsdGhpcy5hY2NlbGVyYXRpb249bmV3IFBJWEkuUG9pbnQsdGhpcy5tYXhTcGVlZD1OYU4sdGhpcy5zdGFydFNjYWxlPTAsdGhpcy5lbmRTY2FsZT0wLHRoaXMuc3RhcnRDb2xvcj1udWxsLHRoaXMuX3NSPTAsdGhpcy5fc0c9MCx0aGlzLl9zQj0wLHRoaXMuZW5kQ29sb3I9bnVsbCx0aGlzLl9lUj0wLHRoaXMuX2VHPTAsdGhpcy5fZUI9MCx0aGlzLl9kb0FscGhhPSExLHRoaXMuX2RvU2NhbGU9ITEsdGhpcy5fZG9TcGVlZD0hMSx0aGlzLl9kb0FjY2VsZXJhdGlvbj0hMSx0aGlzLl9kb0NvbG9yPSExLHRoaXMuX2RvTm9ybWFsTW92ZW1lbnQ9ITEsdGhpcy5fb25lT3ZlckxpZmU9MCx0aGlzLm5leHQ9bnVsbCx0aGlzLnByZXY9bnVsbCx0aGlzLmluaXQ9dGhpcy5pbml0LHRoaXMuUGFydGljbGVfaW5pdD10aGlzLlBhcnRpY2xlX2luaXQsdGhpcy51cGRhdGU9dGhpcy51cGRhdGUsdGhpcy5QYXJ0aWNsZV91cGRhdGU9dGhpcy5QYXJ0aWNsZV91cGRhdGUsdGhpcy5hcHBseUFydD10aGlzLmFwcGx5QXJ0LHRoaXMua2lsbD10aGlzLmtpbGx9LG49ci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShhLnByb3RvdHlwZSk7bi5pbml0PW4uUGFydGljbGVfaW5pdD1mdW5jdGlvbigpe3RoaXMuYWdlPTAsdGhpcy52ZWxvY2l0eS54PXRoaXMuc3RhcnRTcGVlZCx0aGlzLnZlbG9jaXR5Lnk9MCxzLnJvdGF0ZVBvaW50KHRoaXMucm90YXRpb24sdGhpcy52ZWxvY2l0eSksdGhpcy5ub1JvdGF0aW9uP3RoaXMucm90YXRpb249MDp0aGlzLnJvdGF0aW9uKj1zLkRFR19UT19SQURTLHRoaXMucm90YXRpb25TcGVlZCo9cy5ERUdfVE9fUkFEUyx0aGlzLmFscGhhPXRoaXMuc3RhcnRBbHBoYSx0aGlzLnNjYWxlLng9dGhpcy5zY2FsZS55PXRoaXMuc3RhcnRTY2FsZSx0aGlzLnN0YXJ0Q29sb3ImJih0aGlzLl9zUj10aGlzLnN0YXJ0Q29sb3JbMF0sdGhpcy5fc0c9dGhpcy5zdGFydENvbG9yWzFdLHRoaXMuX3NCPXRoaXMuc3RhcnRDb2xvclsyXSx0aGlzLmVuZENvbG9yJiYodGhpcy5fZVI9dGhpcy5lbmRDb2xvclswXSx0aGlzLl9lRz10aGlzLmVuZENvbG9yWzFdLHRoaXMuX2VCPXRoaXMuZW5kQ29sb3JbMl0pKSx0aGlzLl9kb0FscGhhPXRoaXMuc3RhcnRBbHBoYSE9dGhpcy5lbmRBbHBoYSx0aGlzLl9kb1NwZWVkPXRoaXMuc3RhcnRTcGVlZCE9dGhpcy5lbmRTcGVlZCx0aGlzLl9kb1NjYWxlPXRoaXMuc3RhcnRTY2FsZSE9dGhpcy5lbmRTY2FsZSx0aGlzLl9kb0NvbG9yPSEhdGhpcy5lbmRDb2xvcix0aGlzLl9kb0FjY2VsZXJhdGlvbj0wIT09dGhpcy5hY2NlbGVyYXRpb24ueHx8MCE9PXRoaXMuYWNjZWxlcmF0aW9uLnksdGhpcy5fZG9Ob3JtYWxNb3ZlbWVudD10aGlzLl9kb1NwZWVkfHwwIT09dGhpcy5zdGFydFNwZWVkfHx0aGlzLl9kb0FjY2VsZXJhdGlvbix0aGlzLl9vbmVPdmVyTGlmZT0xL3RoaXMubWF4TGlmZSx0aGlzLnRpbnQ9cy5jb21iaW5lUkdCQ29tcG9uZW50cyh0aGlzLl9zUix0aGlzLl9zRyx0aGlzLl9zQiksdGhpcy52aXNpYmxlPSEwfSxuLmFwcGx5QXJ0PWZ1bmN0aW9uKHQpe3RoaXMudGV4dHVyZT10fHxzLkVNUFRZX1RFWFRVUkV9LG4udXBkYXRlPW4uUGFydGljbGVfdXBkYXRlPWZ1bmN0aW9uKHQpe2lmKHRoaXMuYWdlKz10LHRoaXMuYWdlPj10aGlzLm1heExpZmUpcmV0dXJuIHRoaXMua2lsbCgpLC0xO3ZhciBpPXRoaXMuYWdlKnRoaXMuX29uZU92ZXJMaWZlO2lmKHRoaXMuZWFzZSYmKGk9ND09dGhpcy5lYXNlLmxlbmd0aD90aGlzLmVhc2UoaSwwLDEsMSk6dGhpcy5lYXNlKGkpKSx0aGlzLl9kb0FscGhhJiYodGhpcy5hbHBoYT0odGhpcy5lbmRBbHBoYS10aGlzLnN0YXJ0QWxwaGEpKmkrdGhpcy5zdGFydEFscGhhKSx0aGlzLl9kb1NjYWxlKXt2YXIgZT0odGhpcy5lbmRTY2FsZS10aGlzLnN0YXJ0U2NhbGUpKmkrdGhpcy5zdGFydFNjYWxlO3RoaXMuc2NhbGUueD10aGlzLnNjYWxlLnk9ZX1pZih0aGlzLl9kb05vcm1hbE1vdmVtZW50KXtpZih0aGlzLl9kb1NwZWVkKXt2YXIgYT0odGhpcy5lbmRTcGVlZC10aGlzLnN0YXJ0U3BlZWQpKmkrdGhpcy5zdGFydFNwZWVkO3Mubm9ybWFsaXplKHRoaXMudmVsb2NpdHkpLHMuc2NhbGVCeSh0aGlzLnZlbG9jaXR5LGEpfWVsc2UgaWYodGhpcy5fZG9BY2NlbGVyYXRpb24mJih0aGlzLnZlbG9jaXR5LngrPXRoaXMuYWNjZWxlcmF0aW9uLngqdCx0aGlzLnZlbG9jaXR5LnkrPXRoaXMuYWNjZWxlcmF0aW9uLnkqdCx0aGlzLm1heFNwZWVkKSl7dmFyIHI9cy5sZW5ndGgodGhpcy52ZWxvY2l0eSk7cj50aGlzLm1heFNwZWVkJiZzLnNjYWxlQnkodGhpcy52ZWxvY2l0eSx0aGlzLm1heFNwZWVkL3IpfXRoaXMucG9zaXRpb24ueCs9dGhpcy52ZWxvY2l0eS54KnQsdGhpcy5wb3NpdGlvbi55Kz10aGlzLnZlbG9jaXR5LnkqdH1pZih0aGlzLl9kb0NvbG9yKXt2YXIgbj0odGhpcy5fZVItdGhpcy5fc1IpKmkrdGhpcy5fc1Isbz0odGhpcy5fZUctdGhpcy5fc0cpKmkrdGhpcy5fc0csaD0odGhpcy5fZUItdGhpcy5fc0IpKmkrdGhpcy5fc0I7dGhpcy50aW50PXMuY29tYmluZVJHQkNvbXBvbmVudHMobixvLGgpfXJldHVybiAwIT09dGhpcy5yb3RhdGlvblNwZWVkP3RoaXMucm90YXRpb24rPXRoaXMucm90YXRpb25TcGVlZCp0OnRoaXMuYWNjZWxlcmF0aW9uJiYhdGhpcy5ub1JvdGF0aW9uJiYodGhpcy5yb3RhdGlvbj1NYXRoLmF0YW4yKHRoaXMudmVsb2NpdHkueSx0aGlzLnZlbG9jaXR5LngpKSxpfSxuLmtpbGw9ZnVuY3Rpb24oKXt0aGlzLmVtaXR0ZXIucmVjeWNsZSh0aGlzKX0sbi5TcHJpdGVfRGVzdHJveT1hLnByb3RvdHlwZS5kZXN0cm95LG4uZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucGFyZW50JiZ0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKSx0aGlzLlNwcml0ZV9EZXN0cm95JiZ0aGlzLlNwcml0ZV9EZXN0cm95KCksdGhpcy5lbWl0dGVyPXRoaXMudmVsb2NpdHk9dGhpcy5zdGFydENvbG9yPXRoaXMuZW5kQ29sb3I9dGhpcy5lYXNlPXRoaXMubmV4dD10aGlzLnByZXY9bnVsbH0sci5wYXJzZUFydD1mdW5jdGlvbih0KXt2YXIgaTtmb3IoaT10Lmxlbmd0aDtpPj0wOy0taSlcInN0cmluZ1wiPT10eXBlb2YgdFtpXSYmKHRbaV09UElYSS5UZXh0dXJlLmZyb21JbWFnZSh0W2ldKSk7aWYocy52ZXJib3NlKWZvcihpPXQubGVuZ3RoLTE7aT4wOy0taSlpZih0W2ldLmJhc2VUZXh0dXJlIT10W2ktMV0uYmFzZVRleHR1cmUpe3dpbmRvdy5jb25zb2xlJiZjb25zb2xlLndhcm4oXCJQaXhpUGFydGljbGVzOiB1c2luZyBwYXJ0aWNsZSB0ZXh0dXJlcyBmcm9tIGRpZmZlcmVudCBpbWFnZXMgbWF5IGhpbmRlciBwZXJmb3JtYW5jZSBpbiBXZWJHTFwiKTticmVha31yZXR1cm4gdH0sci5wYXJzZURhdGE9ZnVuY3Rpb24odCl7cmV0dXJuIHR9LGkuZXhwb3J0cz1yfSx7XCIuL1BhcnRpY2xlVXRpbHNcIjo0fV0sNDpbZnVuY3Rpb24odCxpLGUpe1widXNlIHN0cmljdFwiO3ZhciBzPVBJWEkuQkxFTkRfTU9ERVN8fFBJWEkuYmxlbmRNb2RlcyxhPVBJWEkuVGV4dHVyZSxyPXt9O3IudmVyYm9zZT0hMTt2YXIgbj1yLkRFR19UT19SQURTPU1hdGguUEkvMTgwLG89ci5FTVBUWV9URVhUVVJFPWEuRU1QVFk7by5vbj1vLmRlc3Ryb3k9by5vbmNlPW8uZW1pdD1mdW5jdGlvbigpe30sci5yb3RhdGVQb2ludD1mdW5jdGlvbih0LGkpe2lmKHQpe3QqPW47dmFyIGU9TWF0aC5zaW4odCkscz1NYXRoLmNvcyh0KSxhPWkueCpzLWkueSplLHI9aS54KmUraS55KnM7aS54PWEsaS55PXJ9fSxyLmNvbWJpbmVSR0JDb21wb25lbnRzPWZ1bmN0aW9uKHQsaSxlKXtyZXR1cm4gdDw8MTZ8aTw8OHxlfSxyLm5vcm1hbGl6ZT1mdW5jdGlvbih0KXt2YXIgaT0xL3IubGVuZ3RoKHQpO3QueCo9aSx0LnkqPWl9LHIuc2NhbGVCeT1mdW5jdGlvbih0LGkpe3QueCo9aSx0LnkqPWl9LHIubGVuZ3RoPWZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNxcnQodC54KnQueCt0LnkqdC55KX0sci5oZXhUb1JHQj1mdW5jdGlvbih0LGkpe2k/aS5sZW5ndGg9MDppPVtdLFwiI1wiPT10LmNoYXJBdCgwKT90PXQuc3Vic3RyKDEpOjA9PT10LmluZGV4T2YoXCIweFwiKSYmKHQ9dC5zdWJzdHIoMikpO3ZhciBlO3JldHVybiA4PT10Lmxlbmd0aCYmKGU9dC5zdWJzdHIoMCwyKSx0PXQuc3Vic3RyKDIpKSxpLnB1c2gocGFyc2VJbnQodC5zdWJzdHIoMCwyKSwxNikpLGkucHVzaChwYXJzZUludCh0LnN1YnN0cigyLDIpLDE2KSksaS5wdXNoKHBhcnNlSW50KHQuc3Vic3RyKDQsMiksMTYpKSxlJiZpLnB1c2gocGFyc2VJbnQoZSwxNikpLGl9LHIuZ2VuZXJhdGVFYXNlPWZ1bmN0aW9uKHQpe3ZhciBpPXQubGVuZ3RoLGU9MS9pLHM9ZnVuY3Rpb24ocyl7dmFyIGEscixuPWkqc3wwO3JldHVybiBhPShzLW4qZSkqaSxyPXRbbl18fHRbaS0xXSxyLnMrYSooMiooMS1hKSooci5jcC1yLnMpK2EqKHIuZS1yLnMpKX07cmV0dXJuIHN9LHIuZ2V0QmxlbmRNb2RlPWZ1bmN0aW9uKHQpe2lmKCF0KXJldHVybiBzLk5PUk1BTDtmb3IodD10LnRvVXBwZXJDYXNlKCk7dC5pbmRleE9mKFwiIFwiKT49MDspdD10LnJlcGxhY2UoXCIgXCIsXCJfXCIpO3JldHVybiBzW3RdfHxzLk5PUk1BTH0saS5leHBvcnRzPXJ9LHt9XSw1OltmdW5jdGlvbih0LGksZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHM9dChcIi4vUGFydGljbGVVdGlsc1wiKSxhPXQoXCIuL1BhcnRpY2xlXCIpLHI9ZnVuY3Rpb24odCl7YS5jYWxsKHRoaXMsdCksdGhpcy5wYXRoPW51bGwsdGhpcy5pbml0aWFsUm90YXRpb249MCx0aGlzLmluaXRpYWxQb3NpdGlvbj1uZXcgUElYSS5Qb2ludCx0aGlzLm1vdmVtZW50PTB9LG49YS5wcm90b3R5cGUsbz1yLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG4pLGg9bmV3IFBJWEkuUG9pbnQ7by5pbml0PWZ1bmN0aW9uKCl7dGhpcy5pbml0aWFsUm90YXRpb249dGhpcy5yb3RhdGlvbix0aGlzLlBhcnRpY2xlX2luaXQoKSx0aGlzLnBhdGg9dGhpcy5leHRyYURhdGEucGF0aCx0aGlzLl9kb05vcm1hbE1vdmVtZW50PSF0aGlzLnBhdGgsdGhpcy5tb3ZlbWVudD0wLHRoaXMuaW5pdGlhbFBvc2l0aW9uLng9dGhpcy5wb3NpdGlvbi54LHRoaXMuaW5pdGlhbFBvc2l0aW9uLnk9dGhpcy5wb3NpdGlvbi55fTtmb3IodmFyIGw9W1wicG93XCIsXCJzcXJ0XCIsXCJhYnNcIixcImZsb29yXCIsXCJyb3VuZFwiLFwiY2VpbFwiLFwiRVwiLFwiUElcIixcInNpblwiLFwiY29zXCIsXCJ0YW5cIixcImFzaW5cIixcImFjb3NcIixcImF0YW5cIixcImF0YW4yXCIsXCJsb2dcIl0scD1cIlswMTIzNDU2Nzg5MFxcXFwuXFxcXCpcXFxcLVxcXFwrXFxcXC9cXFxcKFxcXFwpeCAsXVwiLGM9bC5sZW5ndGgtMTtjPj0wOy0tYylwKz1cInxcIitsW2NdO3A9bmV3IFJlZ0V4cChwLFwiZ1wiKTt2YXIgZD1mdW5jdGlvbih0KXtmb3IodmFyIGk9dC5tYXRjaChwKSxlPWkubGVuZ3RoLTE7ZT49MDstLWUpbC5pbmRleE9mKGlbZV0pPj0wJiYoaVtlXT1cIk1hdGguXCIraVtlXSk7cmV0dXJuIHQ9aS5qb2luKFwiXCIpLG5ldyBGdW5jdGlvbihcInhcIixcInJldHVybiBcIit0K1wiO1wiKX07by51cGRhdGU9ZnVuY3Rpb24odCl7dmFyIGk9dGhpcy5QYXJ0aWNsZV91cGRhdGUodCk7aWYoaT49MCYmdGhpcy5wYXRoKXt2YXIgZT0odGhpcy5lbmRTcGVlZC10aGlzLnN0YXJ0U3BlZWQpKmkrdGhpcy5zdGFydFNwZWVkO3RoaXMubW92ZW1lbnQrPWUqdCxoLng9dGhpcy5tb3ZlbWVudCxoLnk9dGhpcy5wYXRoKHRoaXMubW92ZW1lbnQpLHMucm90YXRlUG9pbnQodGhpcy5pbml0aWFsUm90YXRpb24saCksdGhpcy5wb3NpdGlvbi54PXRoaXMuaW5pdGlhbFBvc2l0aW9uLngraC54LHRoaXMucG9zaXRpb24ueT10aGlzLmluaXRpYWxQb3NpdGlvbi55K2gueX19LG8uUGFydGljbGVfZGVzdHJveT1hLnByb3RvdHlwZS5kZXN0cm95LG8uZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuUGFydGljbGVfZGVzdHJveSgpLHRoaXMucGF0aD10aGlzLmluaXRpYWxQb3NpdGlvbj1udWxsfSxyLnBhcnNlQXJ0PWZ1bmN0aW9uKHQpe3JldHVybiBhLnBhcnNlQXJ0KHQpfSxyLnBhcnNlRGF0YT1mdW5jdGlvbih0KXt2YXIgaT17fTtpZih0JiZ0LnBhdGgpdHJ5e2kucGF0aD1kKHQucGF0aCl9Y2F0Y2godCl7cy52ZXJib3NlJiZjb25zb2xlLmVycm9yKFwiUGF0aFBhcnRpY2xlOiBlcnJvciBpbiBwYXJzaW5nIHBhdGggZXhwcmVzc2lvblwiKSxpLnBhdGg9bnVsbH1lbHNlIHMudmVyYm9zZSYmY29uc29sZS5lcnJvcihcIlBhdGhQYXJ0aWNsZSByZXF1aXJlcyBhIHBhdGggc3RyaW5nIGluIGV4dHJhRGF0YSFcIiksaS5wYXRoPW51bGw7cmV0dXJuIGl9LGkuZXhwb3J0cz1yfSx7XCIuL1BhcnRpY2xlXCI6MyxcIi4vUGFydGljbGVVdGlsc1wiOjR9XSw2OltmdW5jdGlvbih0LGksZSl7fSx7fV0sNzpbZnVuY3Rpb24odCxpLGUpe2UuUGFydGljbGVVdGlscz10KFwiLi9QYXJ0aWNsZVV0aWxzLmpzXCIpLGUuUGFydGljbGU9dChcIi4vUGFydGljbGUuanNcIiksZS5FbWl0dGVyPXQoXCIuL0VtaXR0ZXIuanNcIiksZS5QYXRoUGFydGljbGU9dChcIi4vUGF0aFBhcnRpY2xlLmpzXCIpLGUuQW5pbWF0ZWRQYXJ0aWNsZT10KFwiLi9BbmltYXRlZFBhcnRpY2xlLmpzXCIpLHQoXCIuL2RlcHJlY2F0aW9uLmpzXCIpfSx7XCIuL0FuaW1hdGVkUGFydGljbGUuanNcIjoxLFwiLi9FbWl0dGVyLmpzXCI6MixcIi4vUGFydGljbGUuanNcIjozLFwiLi9QYXJ0aWNsZVV0aWxzLmpzXCI6NCxcIi4vUGF0aFBhcnRpY2xlLmpzXCI6NSxcIi4vZGVwcmVjYXRpb24uanNcIjo2fV0sODpbZnVuY3Rpb24odCxpLGUpe1widXNlIHN0cmljdFwiO3ZhciBzPVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OkdMT0JBTDtpZihzLlBJWEkucGFydGljbGVzfHwocy5QSVhJLnBhcnRpY2xlcz17fSksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGkmJmkuZXhwb3J0cylcInVuZGVmaW5lZFwiPT10eXBlb2YgUElYSSYmdChcInBpeGkuanNcIiksaS5leHBvcnRzPXMuUElYSS5wYXJ0aWNsZXN8fGE7ZWxzZSBpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgUElYSSl0aHJvd1wicGl4aS1wYXJ0aWNsZXMgcmVxdWlyZXMgcGl4aS5qcyB0byBiZSBsb2FkZWQgZmlyc3RcIjt2YXIgYT10KFwiLi9wYXJ0aWNsZXNcIik7Zm9yKHZhciByIGluIGEpcy5QSVhJLnBhcnRpY2xlc1tyXT1hW3JdfSx7XCIuL3BhcnRpY2xlc1wiOjcsXCJwaXhpLmpzXCI6dm9pZCAwfV19LHt9LFs4XSkoOCl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktcGFydGljbGVzLm1pbi5qcy5tYXBcbiIsInZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgdXRpbHM7XHJcbiAgICAoZnVuY3Rpb24gKHV0aWxzKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlSW5kaWNlc0ZvclF1YWRzKHNpemUpIHtcclxuICAgICAgICAgICAgdmFyIHRvdGFsSW5kaWNlcyA9IHNpemUgKiA2O1xyXG4gICAgICAgICAgICB2YXIgaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheSh0b3RhbEluZGljZXMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IDA7IGkgPCB0b3RhbEluZGljZXM7IGkgKz0gNiwgaiArPSA0KSB7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAwXSA9IGogKyAwO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgMV0gPSBqICsgMTtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDJdID0gaiArIDI7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAzXSA9IGogKyAwO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgNF0gPSBqICsgMjtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDVdID0gaiArIDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluZGljZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmNyZWF0ZUluZGljZXNGb3JRdWFkcyA9IGNyZWF0ZUluZGljZXNGb3JRdWFkcztcclxuICAgICAgICBmdW5jdGlvbiBpc1BvdzIodikge1xyXG4gICAgICAgICAgICByZXR1cm4gISh2ICYgKHYgLSAxKSkgJiYgKCEhdik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmlzUG93MiA9IGlzUG93MjtcclxuICAgICAgICBmdW5jdGlvbiBuZXh0UG93Mih2KSB7XHJcbiAgICAgICAgICAgIHYgKz0gKyh2ID09PSAwKTtcclxuICAgICAgICAgICAgLS12O1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDE7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gMjtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiA0O1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDg7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gMTY7XHJcbiAgICAgICAgICAgIHJldHVybiB2ICsgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMubmV4dFBvdzIgPSBuZXh0UG93MjtcclxuICAgICAgICBmdW5jdGlvbiBsb2cyKHYpIHtcclxuICAgICAgICAgICAgdmFyIHIsIHNoaWZ0O1xyXG4gICAgICAgICAgICByID0gKyh2ID4gMHhGRkZGKSA8PCA0O1xyXG4gICAgICAgICAgICB2ID4+Pj0gcjtcclxuICAgICAgICAgICAgc2hpZnQgPSArKHYgPiAweEZGKSA8PCAzO1xyXG4gICAgICAgICAgICB2ID4+Pj0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgfD0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHNoaWZ0ID0gKyh2ID4gMHhGKSA8PCAyO1xyXG4gICAgICAgICAgICB2ID4+Pj0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgfD0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHNoaWZ0ID0gKyh2ID4gMHgzKSA8PCAxO1xyXG4gICAgICAgICAgICB2ID4+Pj0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgfD0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHJldHVybiByIHwgKHYgPj4gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmxvZzIgPSBsb2cyO1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldEludGVyc2VjdGlvbkZhY3RvcihwMSwgcDIsIHAzLCBwNCwgb3V0KSB7XHJcbiAgICAgICAgICAgIHZhciBBMSA9IHAyLnggLSBwMS54LCBCMSA9IHAzLnggLSBwNC54LCBDMSA9IHAzLnggLSBwMS54O1xyXG4gICAgICAgICAgICB2YXIgQTIgPSBwMi55IC0gcDEueSwgQjIgPSBwMy55IC0gcDQueSwgQzIgPSBwMy55IC0gcDEueTtcclxuICAgICAgICAgICAgdmFyIEQgPSBBMSAqIEIyIC0gQTIgKiBCMTtcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKEQpIDwgMWUtNykge1xyXG4gICAgICAgICAgICAgICAgb3V0LnggPSBBMTtcclxuICAgICAgICAgICAgICAgIG91dC55ID0gQTI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgVCA9IEMxICogQjIgLSBDMiAqIEIxO1xyXG4gICAgICAgICAgICB2YXIgVSA9IEExICogQzIgLSBBMiAqIEMxO1xyXG4gICAgICAgICAgICB2YXIgdCA9IFQgLyBELCB1ID0gVSAvIEQ7XHJcbiAgICAgICAgICAgIGlmICh1IDwgKDFlLTYpIHx8IHUgLSAxID4gLTFlLTYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQueCA9IHAxLnggKyB0ICogKHAyLnggLSBwMS54KTtcclxuICAgICAgICAgICAgb3V0LnkgPSBwMS55ICsgdCAqIChwMi55IC0gcDEueSk7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5nZXRJbnRlcnNlY3Rpb25GYWN0b3IgPSBnZXRJbnRlcnNlY3Rpb25GYWN0b3I7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UG9zaXRpb25Gcm9tUXVhZChwLCBhbmNob3IsIG91dCkge1xyXG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGExID0gMS4wIC0gYW5jaG9yLngsIGEyID0gMS4wIC0gYTE7XHJcbiAgICAgICAgICAgIHZhciBiMSA9IDEuMCAtIGFuY2hvci55LCBiMiA9IDEuMCAtIGIxO1xyXG4gICAgICAgICAgICBvdXQueCA9IChwWzBdLnggKiBhMSArIHBbMV0ueCAqIGEyKSAqIGIxICsgKHBbM10ueCAqIGExICsgcFsyXS54ICogYTIpICogYjI7XHJcbiAgICAgICAgICAgIG91dC55ID0gKHBbMF0ueSAqIGExICsgcFsxXS55ICogYTIpICogYjEgKyAocFszXS55ICogYTEgKyBwWzJdLnkgKiBhMikgKiBiMjtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuZ2V0UG9zaXRpb25Gcm9tUXVhZCA9IGdldFBvc2l0aW9uRnJvbVF1YWQ7XHJcbiAgICB9KSh1dGlscyA9IHBpeGlfcHJvamVjdGlvbi51dGlscyB8fCAocGl4aV9wcm9qZWN0aW9uLnV0aWxzID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG5QSVhJLnByb2plY3Rpb24gPSBwaXhpX3Byb2plY3Rpb247XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgUHJvamVjdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvbihsZWdhY3ksIGVuYWJsZSkge1xyXG4gICAgICAgICAgICBpZiAoZW5hYmxlID09PSB2b2lkIDApIHsgZW5hYmxlID0gdHJ1ZTsgfVxyXG4gICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubGVnYWN5ID0gbGVnYWN5O1xyXG4gICAgICAgICAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubGVnYWN5LnByb2ogPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvbi5wcm90b3R5cGUsIFwiZW5hYmxlZFwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb247XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24gPSBQcm9qZWN0aW9uO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgd2ViZ2w7XHJcbiAgICAoZnVuY3Rpb24gKHdlYmdsKSB7XHJcbiAgICAgICAgdmFyIEJhdGNoQnVmZmVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gQmF0Y2hCdWZmZXIoc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG5ldyBBcnJheUJ1ZmZlcihzaXplKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXQzMlZpZXcgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMudmVydGljZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51aW50MzJWaWV3ID0gbmV3IFVpbnQzMkFycmF5KHRoaXMudmVydGljZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEJhdGNoQnVmZmVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG51bGw7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBCYXRjaEJ1ZmZlcjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIHdlYmdsLkJhdGNoQnVmZmVyID0gQmF0Y2hCdWZmZXI7XHJcbiAgICB9KSh3ZWJnbCA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbCB8fCAocGl4aV9wcm9qZWN0aW9uLndlYmdsID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHdlYmdsO1xyXG4gICAgKGZ1bmN0aW9uICh3ZWJnbCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyKHZlcnRleFNyYywgZnJhZ21lbnRTcmMsIGdsLCBtYXhUZXh0dXJlcykge1xyXG4gICAgICAgICAgICBmcmFnbWVudFNyYyA9IGZyYWdtZW50U3JjLnJlcGxhY2UoLyVjb3VudCUvZ2ksIG1heFRleHR1cmVzICsgJycpO1xyXG4gICAgICAgICAgICBmcmFnbWVudFNyYyA9IGZyYWdtZW50U3JjLnJlcGxhY2UoLyVmb3Jsb29wJS9naSwgZ2VuZXJhdGVTYW1wbGVTcmMobWF4VGV4dHVyZXMpKTtcclxuICAgICAgICAgICAgdmFyIHNoYWRlciA9IG5ldyBQSVhJLlNoYWRlcihnbCwgdmVydGV4U3JjLCBmcmFnbWVudFNyYyk7XHJcbiAgICAgICAgICAgIHZhciBzYW1wbGVWYWx1ZXMgPSBuZXcgSW50MzJBcnJheShtYXhUZXh0dXJlcyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4VGV4dHVyZXM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlVmFsdWVzW2ldID0gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzaGFkZXIuYmluZCgpO1xyXG4gICAgICAgICAgICBzaGFkZXIudW5pZm9ybXMudVNhbXBsZXJzID0gc2FtcGxlVmFsdWVzO1xyXG4gICAgICAgICAgICByZXR1cm4gc2hhZGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3ZWJnbC5nZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlciA9IGdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyO1xyXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2FtcGxlU3JjKG1heFRleHR1cmVzKSB7XHJcbiAgICAgICAgICAgIHZhciBzcmMgPSAnJztcclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4VGV4dHVyZXM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjICs9ICdcXG5lbHNlICc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IG1heFRleHR1cmVzIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYyArPSBcImlmKHRleHR1cmVJZCA9PSBcIiArIGkgKyBcIi4wKVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3JjICs9ICdcXG57JztcclxuICAgICAgICAgICAgICAgIHNyYyArPSBcIlxcblxcdGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyc1tcIiArIGkgKyBcIl0sIHRleHR1cmVDb29yZCk7XCI7XHJcbiAgICAgICAgICAgICAgICBzcmMgKz0gJ1xcbn0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICByZXR1cm4gc3JjO1xyXG4gICAgICAgIH1cclxuICAgIH0pKHdlYmdsID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsIHx8IChwaXhpX3Byb2plY3Rpb24ud2ViZ2wgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHdlYmdsO1xyXG4gICAgKGZ1bmN0aW9uICh3ZWJnbCkge1xyXG4gICAgICAgIHZhciBPYmplY3RSZW5kZXJlciA9IFBJWEkuT2JqZWN0UmVuZGVyZXI7XHJcbiAgICAgICAgdmFyIHNldHRpbmdzID0gUElYSS5zZXR0aW5ncztcclxuICAgICAgICB2YXIgR0xCdWZmZXIgPSBQSVhJLmdsQ29yZS5HTEJ1ZmZlcjtcclxuICAgICAgICB2YXIgcHJlbXVsdGlwbHlUaW50ID0gUElYSS51dGlscy5wcmVtdWx0aXBseVRpbnQ7XHJcbiAgICAgICAgdmFyIHByZW11bHRpcGx5QmxlbmRNb2RlID0gUElYSS51dGlscy5wcmVtdWx0aXBseUJsZW5kTW9kZTtcclxuICAgICAgICB2YXIgVElDSyA9IDA7XHJcbiAgICAgICAgdmFyIEJhdGNoR3JvdXAgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBCYXRjaEdyb3VwKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxlbmQgPSBQSVhJLkJMRU5EX01PREVTLk5PUk1BTDtcclxuICAgICAgICAgICAgICAgIHRoaXMudW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCYXRjaEdyb3VwO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgd2ViZ2wuQmF0Y2hHcm91cCA9IEJhdGNoR3JvdXA7XHJcbiAgICAgICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcihyZW5kZXJlcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgcmVuZGVyZXIpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gJyc7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gJyc7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwgPSAzMjtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRTaXplID0gNTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRCeXRlU2l6ZSA9IF90aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNpemUgPSBzZXR0aW5ncy5TUFJJVEVfQkFUQ0hfU0laRTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zcHJpdGVzID0gW107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0ZXhCdWZmZXJzID0gW107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YW9zID0gW107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YW9NYXggPSAyO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTID0gMTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmluZGljZXMgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMuY3JlYXRlSW5kaWNlc0ZvclF1YWRzKF90aGlzLnNpemUpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZ3JvdXBzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IF90aGlzLnNpemU7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmdyb3Vwc1trXSA9IG5ldyBCYXRjaEdyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YW9NYXggPSAyO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucmVuZGVyZXIub24oJ3ByZXJlbmRlcicsIF90aGlzLm9uUHJlcmVuZGVyLCBfdGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLmdldFVuaWZvcm1zID0gZnVuY3Rpb24gKHNwcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5zeW5jVW5pZm9ybXMgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9iailcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB2YXIgc2ggPSB0aGlzLnNoYWRlcjtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBzaC51bmlmb3Jtc1trZXldID0gb2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5vbkNvbnRleHRDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NQVhfVEVYVFVSRVMgPSBNYXRoLm1pbih0aGlzLk1BWF9URVhUVVJFU19MT0NBTCwgdGhpcy5yZW5kZXJlci5wbHVnaW5zWydzcHJpdGUnXS5NQVhfVEVYVFVSRVMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIgPSB3ZWJnbC5nZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlcih0aGlzLnNoYWRlclZlcnQsIHRoaXMuc2hhZGVyRnJhZywgZ2wsIHRoaXMuTUFYX1RFWFRVUkVTKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBHTEJ1ZmZlci5jcmVhdGVJbmRleEJ1ZmZlcihnbCwgdGhpcy5pbmRpY2VzLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRWYW8obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZhb01heDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZlcnRleEJ1ZmZlciA9IHRoaXMudmVydGV4QnVmZmVyc1tpXSA9IEdMQnVmZmVyLmNyZWF0ZVZlcnRleEJ1ZmZlcihnbCwgbnVsbCwgZ2wuU1RSRUFNX0RSQVcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFvc1tpXSA9IHRoaXMuY3JlYXRlVmFvKHZlcnRleEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYnVmZmVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVycyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IHBpeGlfcHJvamVjdGlvbi51dGlscy5uZXh0UG93Mih0aGlzLnNpemUpOyBpICo9IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJzLnB1c2gobmV3IHdlYmdsLkJhdGNoQnVmZmVyKGkgKiA0ICogdGhpcy52ZXJ0Qnl0ZVNpemUpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbyA9IHRoaXMudmFvc1swXTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLm9uUHJlcmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5kZXggPj0gdGhpcy5zaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbHVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFzcHJpdGUuX3RleHR1cmUuX3V2cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghc3ByaXRlLl90ZXh0dXJlLmJhc2VUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVzW3RoaXMuY3VycmVudEluZGV4KytdID0gc3ByaXRlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuZmx1c2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICAgICAgdmFyIE1BWF9URVhUVVJFUyA9IHRoaXMuTUFYX1RFWFRVUkVTO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5wMiA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5uZXh0UG93Mih0aGlzLmN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9nMiA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5sb2cyKG5wMik7XHJcbiAgICAgICAgICAgICAgICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXJzW2xvZzJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwcml0ZXMgPSB0aGlzLnNwcml0ZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBzID0gdGhpcy5ncm91cHM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmxvYXQzMlZpZXcgPSBidWZmZXIuZmxvYXQzMlZpZXc7XHJcbiAgICAgICAgICAgICAgICB2YXIgdWludDMyVmlldyA9IGJ1ZmZlci51aW50MzJWaWV3O1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwQ291bnQgPSAxO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudEdyb3VwID0gZ3JvdXBzWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZlcnRleERhdGE7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXZzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJsZW5kTW9kZSA9IHByZW11bHRpcGx5QmxlbmRNb2RlW3Nwcml0ZXNbMF0uX3RleHR1cmUuYmFzZVRleHR1cmUucHJlbXVsdGlwbGllZEFscGhhID8gMSA6IDBdW3Nwcml0ZXNbMF0uYmxlbmRNb2RlXTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC50ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5ibGVuZCA9IGJsZW5kTW9kZTtcclxuICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY3VycmVudEluZGV4OyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3ByaXRlID0gc3ByaXRlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0VGV4dHVyZSA9IHNwcml0ZS5fdGV4dHVyZS5iYXNlVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3ByaXRlQmxlbmRNb2RlID0gcHJlbXVsdGlwbHlCbGVuZE1vZGVbTnVtYmVyKG5leHRUZXh0dXJlLnByZW11bHRpcGxpZWRBbHBoYSldW3Nwcml0ZS5ibGVuZE1vZGVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibGVuZE1vZGUgIT09IHNwcml0ZUJsZW5kTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibGVuZE1vZGUgPSBzcHJpdGVCbGVuZE1vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50ID0gTUFYX1RFWFRVUkVTO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1bmlmb3JtcyA9IHRoaXMuZ2V0VW5pZm9ybXMoc3ByaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFVuaWZvcm1zICE9PSB1bmlmb3Jtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VW5pZm9ybXMgPSB1bmlmb3JtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQgPSBNQVhfVEVYVFVSRVM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUZXh0dXJlICE9PSBuZXh0VGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGV4dHVyZSA9IG5leHRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFRleHR1cmUuX2VuYWJsZWQgIT09IFRJQ0spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0dXJlQ291bnQgPT09IE1BWF9URVhUVVJFUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zaXplID0gaSAtIGN1cnJlbnRHcm91cC5zdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAgPSBncm91cHNbZ3JvdXBDb3VudCsrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuYmxlbmQgPSBibGVuZE1vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnN0YXJ0ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudW5pZm9ybXMgPSBjdXJyZW50VW5pZm9ybXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGV4dHVyZS5fZW5hYmxlZCA9IFRJQ0s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGV4dHVyZS5fdmlydGFsQm91bmRJZCA9IHRleHR1cmVDb3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC50ZXh0dXJlc1tjdXJyZW50R3JvdXAudGV4dHVyZUNvdW50KytdID0gbmV4dFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxwaGEgPSBNYXRoLm1pbihzcHJpdGUud29ybGRBbHBoYSwgMS4wKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJnYiA9IGFscGhhIDwgMS4wICYmIG5leHRUZXh0dXJlLnByZW11bHRpcGxpZWRBbHBoYSA/IHByZW11bHRpcGx5VGludChzcHJpdGUuX3RpbnRSR0IsIGFscGhhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHNwcml0ZS5fdGludFJHQiArIChhbHBoYSAqIDI1NSA8PCAyNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxsVmVydGljZXMoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIG5leHRUZXh0dXJlLl92aXJ0YWxCb3VuZElkKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCArPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zaXplID0gaSAtIGN1cnJlbnRHcm91cC5zdGFydDtcclxuICAgICAgICAgICAgICAgIGlmICghc2V0dGluZ3MuQ0FOX1VQTE9BRF9TQU1FX0JVRkZFUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhb01heCA8PSB0aGlzLnZlcnRleENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFvTWF4Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0gPSBHTEJ1ZmZlci5jcmVhdGVWZXJ0ZXhCdWZmZXIoZ2wsIG51bGwsIGdsLlNUUkVBTV9EUkFXKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9zW3RoaXMudmVydGV4Q291bnRdID0gdGhpcy5jcmVhdGVWYW8odmVydGV4QnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVmFvKHRoaXMudmFvc1t0aGlzLnZlcnRleENvdW50XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdLnVwbG9hZChidWZmZXIudmVydGljZXMsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0udXBsb2FkKGJ1ZmZlci52ZXJ0aWNlcywgMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGdyb3VwQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3Vwc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBUZXh0dXJlQ291bnQgPSBncm91cC50ZXh0dXJlQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwLnVuaWZvcm1zICE9PSBjdXJyZW50VW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jVW5pZm9ybXMoZ3JvdXAudW5pZm9ybXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGdyb3VwVGV4dHVyZUNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVGV4dHVyZShncm91cC50ZXh0dXJlc1tqXSwgaiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwLnRleHR1cmVzW2pdLl92aXJ0YWxCb3VuZElkID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gdGhpcy5zaGFkZXIudW5pZm9ybXMuc2FtcGxlclNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2WzBdID0gZ3JvdXAudGV4dHVyZXNbal0ucmVhbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdlsxXSA9IGdyb3VwLnRleHR1cmVzW2pdLnJlYWxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYWRlci51bmlmb3Jtcy5zYW1wbGVyU2l6ZSA9IHY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zdGF0ZS5zZXRCbGVuZE1vZGUoZ3JvdXAuYmxlbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmRyYXdFbGVtZW50cyhnbC5UUklBTkdMRVMsIGdyb3VwLnNpemUgKiA2LCBnbC5VTlNJR05FRF9TSE9SVCwgZ3JvdXAuc3RhcnQgKiA2ICogMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFNoYWRlcih0aGlzLnNoYWRlcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0FOX1VQTE9BRF9TQU1FX0JVRkZFUikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFZhbyh0aGlzLnZhb3NbdGhpcy52ZXJ0ZXhDb3VudF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XS5iaW5kKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbHVzaCgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52YW9NYXg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRleEJ1ZmZlcnNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFvc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb3NbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLm9mZigncHJlcmVuZGVyJywgdGhpcy5vblByZXJlbmRlciwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNoYWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYWRlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YW9zID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2VzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnVmZmVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgICAgICB9KE9iamVjdFJlbmRlcmVyKSk7XHJcbiAgICAgICAgd2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIH0pKHdlYmdsID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsIHx8IChwaXhpX3Byb2plY3Rpb24ud2ViZ2wgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgcCA9IFtuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpXTtcclxuICAgIHZhciBhID0gWzAsIDAsIDAsIDBdO1xyXG4gICAgdmFyIFN1cmZhY2UgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIFN1cmZhY2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VyZmFjZUlEID0gXCJkZWZhdWx0XCI7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUlEID0gMDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhTcmMgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmZyYWdtZW50U3JjID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgU3VyZmFjZS5wcm90b3R5cGUuZmlsbFVuaWZvcm1zID0gZnVuY3Rpb24gKHVuaWZvcm1zKSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN1cmZhY2UucHJvdG90eXBlLmJvdW5kc1F1YWQgPSBmdW5jdGlvbiAodiwgb3V0LCBhZnRlcikge1xyXG4gICAgICAgICAgICB2YXIgbWluWCA9IG91dFswXSwgbWluWSA9IG91dFsxXTtcclxuICAgICAgICAgICAgdmFyIG1heFggPSBvdXRbMF0sIG1heFkgPSBvdXRbMV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwgODsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWluWCA+IG91dFtpXSlcclxuICAgICAgICAgICAgICAgICAgICBtaW5YID0gb3V0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1heFggPCBvdXRbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4WCA9IG91dFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChtaW5ZID4gb3V0W2kgKyAxXSlcclxuICAgICAgICAgICAgICAgICAgICBtaW5ZID0gb3V0W2kgKyAxXTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXhZIDwgb3V0W2kgKyAxXSlcclxuICAgICAgICAgICAgICAgICAgICBtYXhZID0gb3V0W2kgKyAxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwWzBdLnNldChtaW5YLCBtaW5ZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzBdLCBwWzBdKTtcclxuICAgICAgICAgICAgcFsxXS5zZXQobWF4WCwgbWluWSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFsxXSwgcFsxXSk7XHJcbiAgICAgICAgICAgIHBbMl0uc2V0KG1heFgsIG1heFkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbMl0sIHBbMl0pO1xyXG4gICAgICAgICAgICBwWzNdLnNldChtaW5YLCBtYXhZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzNdLCBwWzNdKTtcclxuICAgICAgICAgICAgaWYgKGFmdGVyKSB7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzBdLCBwWzBdKTtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbMV0sIHBbMV0pO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFsyXSwgcFsyXSk7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzNdLCBwWzNdKTtcclxuICAgICAgICAgICAgICAgIG91dFswXSA9IHBbMF0ueDtcclxuICAgICAgICAgICAgICAgIG91dFsxXSA9IHBbMF0ueTtcclxuICAgICAgICAgICAgICAgIG91dFsyXSA9IHBbMV0ueDtcclxuICAgICAgICAgICAgICAgIG91dFszXSA9IHBbMV0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs0XSA9IHBbMl0ueDtcclxuICAgICAgICAgICAgICAgIG91dFs1XSA9IHBbMl0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs2XSA9IHBbM10ueDtcclxuICAgICAgICAgICAgICAgIG91dFs3XSA9IHBbM10ueTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwW2ldLnkgPCBwWzBdLnkgfHwgcFtpXS55ID09IHBbMF0ueSAmJiBwW2ldLnggPCBwWzBdLngpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwWzBdID0gcFtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcFtpXSA9IHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYVtpXSA9IE1hdGguYXRhbjIocFtpXS55IC0gcFswXS55LCBwW2ldLnggLSBwWzBdLngpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IGkgKyAxOyBqIDw9IDM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYVtpXSA+IGFbal0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gcFtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBbaV0gPSBwW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFtqXSA9IHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdDIgPSBhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYVtpXSA9IGFbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhW2pdID0gdDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvdXRbMF0gPSBwWzBdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbMV0gPSBwWzBdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMl0gPSBwWzFdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbM10gPSBwWzFdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNF0gPSBwWzJdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbNV0gPSBwWzJdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNl0gPSBwWzNdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbN10gPSBwWzNdLnk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHBbM10ueCAtIHBbMl0ueCkgKiAocFsxXS55IC0gcFsyXS55KSAtIChwWzFdLnggLSBwWzJdLngpICogKHBbM10ueSAtIHBbMl0ueSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0WzRdID0gcFszXS54O1xyXG4gICAgICAgICAgICAgICAgICAgIG91dFs1XSA9IHBbM10ueTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTdXJmYWNlO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TdXJmYWNlID0gU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgIHZhciB0ZW1wUmVjdCA9IG5ldyBQSVhJLlJlY3RhbmdsZSgpO1xyXG4gICAgdmFyIHRlbXBQb2ludCA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICB2YXIgQmlsaW5lYXJTdXJmYWNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQmlsaW5lYXJTdXJmYWNlLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIEJpbGluZWFyU3VyZmFjZSgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuZGlzdG9ydGlvbiA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXN0b3J0aW9uLnNldCgwLCAwKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBkID0gdGhpcy5kaXN0b3J0aW9uO1xyXG4gICAgICAgICAgICB2YXIgbSA9IHBvcy54ICogcG9zLnk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy54ID0gcG9zLnggKyBkLnggKiBtO1xyXG4gICAgICAgICAgICBuZXdQb3MueSA9IHBvcy55ICsgZC55ICogbTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgdnggPSBwb3MueCwgdnkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGR4ID0gdGhpcy5kaXN0b3J0aW9uLngsIGR5ID0gdGhpcy5kaXN0b3J0aW9uLnk7XHJcbiAgICAgICAgICAgIGlmIChkeCA9PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdng7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHZ5IC8gKDEuMCArIGR5ICogdngpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGR5ID09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2eTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdnggLyAoMS4wICsgZHggKiB2eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYiA9ICh2eSAqIGR4IC0gdnggKiBkeSArIDEuMCkgKiAwLjUgLyBkeTtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gYiAqIGIgKyB2eCAvIGR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKGQgPD0gMC4wMDAwMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Bvcy5zZXQoTmFOLCBOYU4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChkeSA+IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gLWIgKyBNYXRoLnNxcnQoZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQb3MueCA9IC1iIC0gTWF0aC5zcXJ0KGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSAodnggLyBuZXdQb3MueCAtIDEuMCkgLyBkeDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5tYXBTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC54ID0gLXNwcml0ZS5hbmNob3IueCAqIHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gLXNwcml0ZS5hbmNob3IueSAqIHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdGVtcFJlY3Qud2lkdGggPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBRdWFkKHRlbXBSZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0gfHwgc3ByaXRlLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLm1hcFF1YWQgPSBmdW5jdGlvbiAocmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciBheCA9IC1yZWN0LnggLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkgPSAtcmVjdC55IC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheDIgPSAoMS4wIC0gcmVjdC54KSAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheTIgPSAoMS4wIC0gcmVjdC55KSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgdXAxeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsxXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAxeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsxXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB1cDJ5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheDIpICsgcXVhZFsxXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsyXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnggPSAocXVhZFszXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheDIpICsgcXVhZFsyXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHgwMCA9IHVwMXggKiAoMS4wIC0gYXkpICsgZG93bjF4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MDAgPSB1cDF5ICogKDEuMCAtIGF5KSArIGRvd24xeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDEwID0gdXAyeCAqICgxLjAgLSBheSkgKyBkb3duMnggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkxMCA9IHVwMnkgKiAoMS4wIC0gYXkpICsgZG93bjJ5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MDEgPSB1cDF4ICogKDEuMCAtIGF5MikgKyBkb3duMXggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MDEgPSB1cDF5ICogKDEuMCAtIGF5MikgKyBkb3duMXkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB4MTEgPSB1cDJ4ICogKDEuMCAtIGF5MikgKyBkb3duMnggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MTEgPSB1cDJ5ICogKDEuMCAtIGF5MikgKyBkb3duMnkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciBtYXQgPSB0ZW1wTWF0O1xyXG4gICAgICAgICAgICBtYXQudHggPSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC50eSA9IHkwMDtcclxuICAgICAgICAgICAgbWF0LmEgPSB4MTAgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5iID0geTEwIC0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYyA9IHgwMSAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmQgPSB5MDEgLSB5MDA7XHJcbiAgICAgICAgICAgIHRlbXBQb2ludC5zZXQoeDExLCB5MTEpO1xyXG4gICAgICAgICAgICBtYXQuYXBwbHlJbnZlcnNlKHRlbXBQb2ludCwgdGVtcFBvaW50KTtcclxuICAgICAgICAgICAgdGhpcy5kaXN0b3J0aW9uLnNldCh0ZW1wUG9pbnQueCAtIDEsIHRlbXBQb2ludC55IC0gMSk7XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5zZXRGcm9tTWF0cml4KG1hdCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5maWxsVW5pZm9ybXMgPSBmdW5jdGlvbiAodW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvbiA9IHVuaWZvcm1zLmRpc3RvcnRpb24gfHwgbmV3IEZsb2F0MzJBcnJheShbMCwgMCwgMCwgMF0pO1xyXG4gICAgICAgICAgICB2YXIgYXggPSBNYXRoLmFicyh0aGlzLmRpc3RvcnRpb24ueCk7XHJcbiAgICAgICAgICAgIHZhciBheSA9IE1hdGguYWJzKHRoaXMuZGlzdG9ydGlvbi55KTtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblswXSA9IGF4ICogMTAwMDAgPD0gYXkgPyAwIDogdGhpcy5kaXN0b3J0aW9uLng7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bMV0gPSBheSAqIDEwMDAwIDw9IGF4ID8gMCA6IHRoaXMuZGlzdG9ydGlvbi55O1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzJdID0gMS4wIC8gdW5pZm9ybXMuZGlzdG9ydGlvblswXTtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblszXSA9IDEuMCAvIHVuaWZvcm1zLmRpc3RvcnRpb25bMV07XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gQmlsaW5lYXJTdXJmYWNlO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uU3VyZmFjZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLkJpbGluZWFyU3VyZmFjZSA9IEJpbGluZWFyU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIENvbnRhaW5lcjJzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQ29udGFpbmVyMnMsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gQ29udGFpbmVyMnMoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbnRhaW5lcjJzLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIENvbnRhaW5lcjJzO1xyXG4gICAgfShQSVhJLkNvbnRhaW5lcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLkNvbnRhaW5lcjJzID0gQ29udGFpbmVyMnM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBmdW4gPSBQSVhJLlRyYW5zZm9ybVN0YXRpYy5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtO1xyXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtSGFjayhwYXJlbnRUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2YXIgcHJvaiA9IHRoaXMucHJvajtcclxuICAgICAgICB2YXIgcHAgPSBwYXJlbnRUcmFuc2Zvcm0ucHJvajtcclxuICAgICAgICB2YXIgdGEgPSB0aGlzO1xyXG4gICAgICAgIGlmICghcHApIHtcclxuICAgICAgICAgICAgZnVuLmNhbGwodGhpcywgcGFyZW50VHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcHJvai5fYWN0aXZlUHJvamVjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBwLl9zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgIHByb2ouX2FjdGl2ZVByb2plY3Rpb24gPSBwcDtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMb2NhbFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2FsVHJhbnNmb3JtLmNvcHkodGhpcy53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIGlmICh0YS5fcGFyZW50SUQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICArK3RhLl93b3JsZElEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuLmNhbGwodGhpcywgcGFyZW50VHJhbnNmb3JtKTtcclxuICAgICAgICBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uID0gcHAuX2FjdGl2ZVByb2plY3Rpb247XHJcbiAgICB9XHJcbiAgICB2YXIgUHJvamVjdGlvblN1cmZhY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhQcm9qZWN0aW9uU3VyZmFjZSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uU3VyZmFjZShsZWdhY3ksIGVuYWJsZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBsZWdhY3ksIGVuYWJsZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuX3N1cmZhY2UgPSBudWxsO1xyXG4gICAgICAgICAgICBfdGhpcy5fYWN0aXZlUHJvamVjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50U3VyZmFjZUlEID0gLTE7XHJcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50TGVnYWN5SUQgPSAtMTtcclxuICAgICAgICAgICAgX3RoaXMuX2xhc3RVbmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZSwgXCJlbmFibGVkXCIsIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IHRyYW5zZm9ybUhhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSBQSVhJLlRyYW5zZm9ybVN0YXRpYy5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLCBcInN1cmZhY2VcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdXJmYWNlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXJmYWNlID0gdmFsdWUgfHwgbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlQYXJ0aWFsID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VyZmFjZS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMuc3VyZmFjZS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5fc3VyZmFjZS5hcHBseUludmVyc2UobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3VyZmFjZS5hcHBseUludmVyc2UobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLm1hcEJpbGluZWFyU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCkge1xyXG4gICAgICAgICAgICBpZiAoISh0aGlzLl9zdXJmYWNlIGluc3RhbmNlb2YgcGl4aV9wcm9qZWN0aW9uLkJpbGluZWFyU3VyZmFjZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VyZmFjZSA9IG5ldyBwaXhpX3Byb2plY3Rpb24uQmlsaW5lYXJTdXJmYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zdXJmYWNlLm1hcFNwcml0ZShzcHJpdGUsIHF1YWQsIHRoaXMubGVnYWN5KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VyZmFjZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJmYWNlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUsIFwidW5pZm9ybXNcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50TGVnYWN5SUQgPT09IHRoaXMubGVnYWN5Ll93b3JsZElEICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFN1cmZhY2VJRCA9PT0gdGhpcy5zdXJmYWNlLl91cGRhdGVJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYXN0VW5pZm9ybXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VW5pZm9ybXMgPSB0aGlzLl9sYXN0VW5pZm9ybXMgfHwge307XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VW5pZm9ybXMud29ybGRUcmFuc2Zvcm0gPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS50b0FycmF5KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3VyZmFjZS5maWxsVW5pZm9ybXModGhpcy5fbGFzdFVuaWZvcm1zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYXN0VW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uU3VyZmFjZTtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24pKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZSA9IFByb2plY3Rpb25TdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB2YXIgU3ByaXRlQmlsaW5lYXJSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZUJpbGluZWFyUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlQmlsaW5lYXJSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnNpemUgPSAxMDA7XHJcbiAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFU19MT0NBTCA9IDE7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMTtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMyO1xcbmF0dHJpYnV0ZSB2ZWM0IGFGcmFtZTtcXG5hdHRyaWJ1dGUgdmVjNCBhQ29sb3I7XFxuYXR0cmlidXRlIGZsb2F0IGFUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHdvcmxkVHJhbnNmb3JtO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogd29ybGRUcmFuc2Zvcm0gKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG4gICAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVmVydGV4UG9zaXRpb247XFxuICAgIHZUcmFuczEgPSBhVHJhbnMxO1xcbiAgICB2VHJhbnMyID0gYVRyYW5zMjtcXG4gICAgdlRleHR1cmVJZCA9IGFUZXh0dXJlSWQ7XFxuICAgIHZDb2xvciA9IGFDb2xvcjtcXG4gICAgdkZyYW1lID0gYUZyYW1lO1xcbn1cXG5cIjtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXJzWyVjb3VudCVdO1xcbnVuaWZvcm0gdmVjMiBzYW1wbGVyU2l6ZVslY291bnQlXTsgXFxudW5pZm9ybSB2ZWM0IGRpc3RvcnRpb247XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbnZlYzIgc3VyZmFjZTtcXG52ZWMyIHN1cmZhY2UyO1xcblxcbmZsb2F0IHZ4ID0gdlRleHR1cmVDb29yZC54O1xcbmZsb2F0IHZ5ID0gdlRleHR1cmVDb29yZC55O1xcbmZsb2F0IGR4ID0gZGlzdG9ydGlvbi54O1xcbmZsb2F0IGR5ID0gZGlzdG9ydGlvbi55O1xcbmZsb2F0IHJldnggPSBkaXN0b3J0aW9uLno7XFxuZmxvYXQgcmV2eSA9IGRpc3RvcnRpb24udztcXG5cXG5pZiAoZGlzdG9ydGlvbi54ID09IDAuMCkge1xcbiAgICBzdXJmYWNlLnggPSB2eDtcXG4gICAgc3VyZmFjZS55ID0gdnkgLyAoMS4wICsgZHkgKiB2eCk7XFxuICAgIHN1cmZhY2UyID0gc3VyZmFjZTtcXG59IGVsc2VcXG5pZiAoZGlzdG9ydGlvbi55ID09IDAuMCkge1xcbiAgICBzdXJmYWNlLnkgPSB2eTtcXG4gICAgc3VyZmFjZS54ID0gdngvICgxLjAgKyBkeCAqIHZ5KTtcXG4gICAgc3VyZmFjZTIgPSBzdXJmYWNlO1xcbn0gZWxzZSB7XFxuICAgIGZsb2F0IGMgPSB2eSAqIGR4IC0gdnggKiBkeTtcXG4gICAgZmxvYXQgYiA9IChjICsgMS4wKSAqIDAuNTtcXG4gICAgZmxvYXQgYjIgPSAoLWMgKyAxLjApICogMC41O1xcbiAgICBmbG9hdCBkID0gYiAqIGIgKyB2eCAqIGR5O1xcbiAgICBpZiAoZCA8IC0wLjAwMDAxKSB7XFxuICAgICAgICBkaXNjYXJkO1xcbiAgICB9XFxuICAgIGQgPSBzcXJ0KG1heChkLCAwLjApKTtcXG4gICAgc3VyZmFjZS54ID0gKC0gYiArIGQpICogcmV2eTtcXG4gICAgc3VyZmFjZTIueCA9ICgtIGIgLSBkKSAqIHJldnk7XFxuICAgIHN1cmZhY2UueSA9ICgtIGIyICsgZCkgKiByZXZ4O1xcbiAgICBzdXJmYWNlMi55ID0gKC0gYjIgLSBkKSAqIHJldng7XFxufVxcblxcbnZlYzIgdXY7XFxudXYueCA9IHZUcmFuczEueCAqIHN1cmZhY2UueCArIHZUcmFuczEueSAqIHN1cmZhY2UueSArIHZUcmFuczEuejtcXG51di55ID0gdlRyYW5zMi54ICogc3VyZmFjZS54ICsgdlRyYW5zMi55ICogc3VyZmFjZS55ICsgdlRyYW5zMi56O1xcblxcbnZlYzIgcGl4ZWxzID0gdXYgKiBzYW1wbGVyU2l6ZVswXTtcXG5cXG5pZiAocGl4ZWxzLnggPCB2RnJhbWUueCB8fCBwaXhlbHMueCA+IHZGcmFtZS56IHx8XFxuICAgIHBpeGVscy55IDwgdkZyYW1lLnkgfHwgcGl4ZWxzLnkgPiB2RnJhbWUudykge1xcbiAgICB1di54ID0gdlRyYW5zMS54ICogc3VyZmFjZTIueCArIHZUcmFuczEueSAqIHN1cmZhY2UyLnkgKyB2VHJhbnMxLno7XFxuICAgIHV2LnkgPSB2VHJhbnMyLnggKiBzdXJmYWNlMi54ICsgdlRyYW5zMi55ICogc3VyZmFjZTIueSArIHZUcmFuczIuejtcXG4gICAgcGl4ZWxzID0gdXYgKiBzYW1wbGVyU2l6ZVswXTtcXG4gICAgXFxuICAgIGlmIChwaXhlbHMueCA8IHZGcmFtZS54IHx8IHBpeGVscy54ID4gdkZyYW1lLnogfHxcXG4gICAgICAgIHBpeGVscy55IDwgdkZyYW1lLnkgfHwgcGl4ZWxzLnkgPiB2RnJhbWUudykge1xcbiAgICAgICAgZGlzY2FyZDtcXG4gICAgfVxcbn1cXG5cXG52ZWM0IGVkZ2U7XFxuZWRnZS54eSA9IGNsYW1wKHBpeGVscyAtIHZGcmFtZS54eSArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5lZGdlLnp3ID0gY2xhbXAodkZyYW1lLnp3IC0gcGl4ZWxzICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcblxcbmZsb2F0IGFscGhhID0gMS4wOyAvL2VkZ2UueCAqIGVkZ2UueSAqIGVkZ2UueiAqIGVkZ2UudztcXG52ZWM0IHJDb2xvciA9IHZDb2xvciAqIGFscGhhO1xcblxcbmZsb2F0IHRleHR1cmVJZCA9IGZsb29yKHZUZXh0dXJlSWQrMC41KTtcXG52ZWM0IGNvbG9yO1xcbnZlYzIgdGV4dHVyZUNvb3JkID0gdXY7XFxuJWZvcmxvb3AlXFxuZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiByQ29sb3I7XFxufVwiO1xyXG4gICAgICAgICAgICBfdGhpcy5kZWZVbmlmb3JtcyA9IHtcclxuICAgICAgICAgICAgICAgIHdvcmxkVHJhbnNmb3JtOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAxXSksXHJcbiAgICAgICAgICAgICAgICBkaXN0b3J0aW9uOiBuZXcgRmxvYXQzMkFycmF5KFswLCAwXSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGVCaWxpbmVhclJlbmRlcmVyLnByb3RvdHlwZS5nZXRVbmlmb3JtcyA9IGZ1bmN0aW9uIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIHByb2ogPSBzcHJpdGUucHJvajtcclxuICAgICAgICAgICAgdmFyIHNoYWRlciA9IHRoaXMuc2hhZGVyO1xyXG4gICAgICAgICAgICBpZiAocHJvai5zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvai5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2ouX2FjdGl2ZVByb2plY3Rpb24udW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmVW5pZm9ybXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVCaWxpbmVhclJlbmRlcmVyLnByb3RvdHlwZS5jcmVhdGVWYW8gPSBmdW5jdGlvbiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudmVydFNpemUgPSAxNDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0Qnl0ZVNpemUgPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdmFyIHZhbyA9IHRoaXMucmVuZGVyZXIuY3JlYXRlVmFvKClcclxuICAgICAgICAgICAgICAgIC5hZGRJbmRleCh0aGlzLmluZGV4QnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFWZXJ0ZXhQb3NpdGlvbiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMxLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAyICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMyLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA1ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hRnJhbWUsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDggKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFDb2xvciwgZ2wuVU5TSUdORURfQllURSwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEyICogNCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5hVGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YW8uYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVJZCwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTMgKiA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFvO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlQmlsaW5lYXJSZW5kZXJlci5wcm90b3R5cGUuZmlsbFZlcnRpY2VzID0gZnVuY3Rpb24gKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCB0ZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSBzcHJpdGUudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHcgPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGggPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheCA9IHNwcml0ZS5fYW5jaG9yLl94O1xyXG4gICAgICAgICAgICB2YXIgYXkgPSBzcHJpdGUuX2FuY2hvci5feTtcclxuICAgICAgICAgICAgdmFyIGZyYW1lID0gdGV4Ll9mcmFtZTtcclxuICAgICAgICAgICAgdmFyIGFUcmFucyA9IHNwcml0ZS5hVHJhbnM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhW2kgKiAyXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhW2kgKiAyICsgMV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gYVRyYW5zLmE7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDNdID0gYVRyYW5zLmM7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDRdID0gYVRyYW5zLnR4O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA1XSA9IGFUcmFucy5iO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IGFUcmFucy5kO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IGFUcmFucy50eTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSBmcmFtZS54O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA5XSA9IGZyYW1lLnk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEwXSA9IGZyYW1lLnggKyBmcmFtZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTFdID0gZnJhbWUueSArIGZyYW1lLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAxMl0gPSBhcmdiO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB0ZXh0dXJlSWQ7XHJcbiAgICAgICAgICAgICAgICBpbmRleCArPSAxNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZUJpbGluZWFyUmVuZGVyZXI7XHJcbiAgICB9KE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKSk7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Nwcml0ZV9iaWxpbmVhcicsIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB2YXIgU3ByaXRlU3RyYW5nZVJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlU3RyYW5nZVJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZVN0cmFuZ2VSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnNpemUgPSAxMDA7XHJcbiAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFU19MT0NBTCA9IDE7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMTtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMyO1xcbmF0dHJpYnV0ZSB2ZWM0IGFGcmFtZTtcXG5hdHRyaWJ1dGUgdmVjNCBhQ29sb3I7XFxuYXR0cmlidXRlIGZsb2F0IGFUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHdvcmxkVHJhbnNmb3JtO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogd29ybGRUcmFuc2Zvcm0gKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG4gICAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVmVydGV4UG9zaXRpb247XFxuICAgIHZUcmFuczEgPSBhVHJhbnMxO1xcbiAgICB2VHJhbnMyID0gYVRyYW5zMjtcXG4gICAgdlRleHR1cmVJZCA9IGFUZXh0dXJlSWQ7XFxuICAgIHZDb2xvciA9IGFDb2xvcjtcXG4gICAgdkZyYW1lID0gYUZyYW1lO1xcbn1cXG5cIjtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXJzWyVjb3VudCVdO1xcbnVuaWZvcm0gdmVjMiBzYW1wbGVyU2l6ZVslY291bnQlXTsgXFxudW5pZm9ybSB2ZWM0IHBhcmFtcztcXG5cXG52b2lkIG1haW4odm9pZCl7XFxudmVjMiBzdXJmYWNlO1xcblxcbmZsb2F0IHZ4ID0gdlRleHR1cmVDb29yZC54O1xcbmZsb2F0IHZ5ID0gdlRleHR1cmVDb29yZC55O1xcbmZsb2F0IGFsZXBoID0gcGFyYW1zLng7XFxuZmxvYXQgYmV0ID0gcGFyYW1zLnk7XFxuZmxvYXQgQSA9IHBhcmFtcy56O1xcbmZsb2F0IEIgPSBwYXJhbXMudztcXG5cXG5pZiAoYWxlcGggPT0gMC4wKSB7XFxuXFx0c3VyZmFjZS55ID0gdnkgLyAoMS4wICsgdnggKiBiZXQpO1xcblxcdHN1cmZhY2UueCA9IHZ4O1xcbn1cXG5lbHNlIGlmIChiZXQgPT0gMC4wKSB7XFxuXFx0c3VyZmFjZS54ID0gdnggLyAoMS4wICsgdnkgKiBhbGVwaCk7XFxuXFx0c3VyZmFjZS55ID0gdnk7XFxufSBlbHNlIHtcXG5cXHRzdXJmYWNlLnggPSB2eCAqIChiZXQgKyAxLjApIC8gKGJldCArIDEuMCArIHZ5ICogYWxlcGgpO1xcblxcdHN1cmZhY2UueSA9IHZ5ICogKGFsZXBoICsgMS4wKSAvIChhbGVwaCArIDEuMCArIHZ4ICogYmV0KTtcXG59XFxuXFxudmVjMiB1djtcXG51di54ID0gdlRyYW5zMS54ICogc3VyZmFjZS54ICsgdlRyYW5zMS55ICogc3VyZmFjZS55ICsgdlRyYW5zMS56O1xcbnV2LnkgPSB2VHJhbnMyLnggKiBzdXJmYWNlLnggKyB2VHJhbnMyLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMyLno7XFxuXFxudmVjMiBwaXhlbHMgPSB1diAqIHNhbXBsZXJTaXplWzBdO1xcblxcbnZlYzQgZWRnZTtcXG5lZGdlLnh5ID0gY2xhbXAocGl4ZWxzIC0gdkZyYW1lLnh5ICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcbmVkZ2UuencgPSBjbGFtcCh2RnJhbWUuencgLSBwaXhlbHMgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuXFxuZmxvYXQgYWxwaGEgPSBlZGdlLnggKiBlZGdlLnkgKiBlZGdlLnogKiBlZGdlLnc7XFxudmVjNCByQ29sb3IgPSB2Q29sb3IgKiBhbHBoYTtcXG5cXG5mbG9hdCB0ZXh0dXJlSWQgPSBmbG9vcih2VGV4dHVyZUlkKzAuNSk7XFxudmVjNCBjb2xvcjtcXG52ZWMyIHRleHR1cmVDb29yZCA9IHV2O1xcbiVmb3Jsb29wJVxcbmdsX0ZyYWdDb2xvciA9IGNvbG9yICogckNvbG9yO1xcbn1cIjtcclxuICAgICAgICAgICAgX3RoaXMuZGVmVW5pZm9ybXMgPSB7XHJcbiAgICAgICAgICAgICAgICB3b3JsZFRyYW5zZm9ybTogbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV0pLFxyXG4gICAgICAgICAgICAgICAgZGlzdG9ydGlvbjogbmV3IEZsb2F0MzJBcnJheShbMCwgMF0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlU3RyYW5nZVJlbmRlcmVyLnByb3RvdHlwZS5nZXRVbmlmb3JtcyA9IGZ1bmN0aW9uIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIHByb2ogPSBzcHJpdGUucHJvajtcclxuICAgICAgICAgICAgdmFyIHNoYWRlciA9IHRoaXMuc2hhZGVyO1xyXG4gICAgICAgICAgICBpZiAocHJvai5zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvai5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2ouX2FjdGl2ZVByb2plY3Rpb24udW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmVW5pZm9ybXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVTdHJhbmdlUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZVZhbyA9IGZ1bmN0aW9uICh2ZXJ0ZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgdGhpcy52ZXJ0U2l6ZSA9IDE0O1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRCeXRlU2l6ZSA9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB2YXIgdmFvID0gdGhpcy5yZW5kZXJlci5jcmVhdGVWYW8oKVxyXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KHRoaXMuaW5kZXhCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVZlcnRleFBvc2l0aW9uLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAwKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczEsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDIgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczIsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDUgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFGcmFtZSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgOCAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUNvbG9yLCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTIgKiA0KTtcclxuICAgICAgICAgICAgaWYgKGF0dHJzLmFUZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgICAgIHZhby5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUlkLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAxMyAqIDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YW87XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVTdHJhbmdlUmVuZGVyZXIucHJvdG90eXBlLmZpbGxWZXJ0aWNlcyA9IGZ1bmN0aW9uIChmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgdGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gc3ByaXRlLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB3ID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXggPSBzcHJpdGUuX2FuY2hvci5feDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gc3ByaXRlLl9hbmNob3IuX3k7XHJcbiAgICAgICAgICAgIHZhciBmcmFtZSA9IHRleC5fZnJhbWU7XHJcbiAgICAgICAgICAgIHZhciBhVHJhbnMgPSBzcHJpdGUuYVRyYW5zO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVtpICogMl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVtpICogMiArIDFdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IGFUcmFucy5hO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAzXSA9IGFUcmFucy5jO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA0XSA9IGFUcmFucy50eDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNV0gPSBhVHJhbnMuYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSBhVHJhbnMuZDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSBhVHJhbnMudHk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gZnJhbWUueDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOV0gPSBmcmFtZS55O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMF0gPSBmcmFtZS54ICsgZnJhbWUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDExXSA9IGZyYW1lLnkgKyBmcmFtZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMTJdID0gYXJnYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdGV4dHVyZUlkO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGVTdHJhbmdlUmVuZGVyZXI7XHJcbiAgICB9KE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKSk7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Nwcml0ZV9zdHJhbmdlJywgU3ByaXRlU3RyYW5nZVJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgIHZhciB0ZW1wUmVjdCA9IG5ldyBQSVhJLlJlY3RhbmdsZSgpO1xyXG4gICAgdmFyIHRlbXBQb2ludCA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICB2YXIgU3RyYW5nZVN1cmZhY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTdHJhbmdlU3VyZmFjZSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTdHJhbmdlU3VyZmFjZSgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucGFyYW1zID0gWzAsIDAsIE5hTiwgTmFOXTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIHBbMF0gPSAwO1xyXG4gICAgICAgICAgICBwWzFdID0gMDtcclxuICAgICAgICAgICAgcFsyXSA9IE5hTjtcclxuICAgICAgICAgICAgcFszXSA9IE5hTjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5zZXRBeGlzWCA9IGZ1bmN0aW9uIChwb3MsIGZhY3Rvciwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLngsIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciByb3QgPSBvdXRUcmFuc2Zvcm0ucm90YXRpb247XHJcbiAgICAgICAgICAgIGlmIChyb3QgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll94IC09IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll95ICs9IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5yb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcueSA9IE1hdGguYXRhbjIoeSwgeCk7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHBbMl0gPSAtZCAqIGZhY3RvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBbMl0gPSBOYU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fY2FsYzAxKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuc2V0QXhpc1kgPSBmdW5jdGlvbiAocG9zLCBmYWN0b3IsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54LCB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgcm90ID0gb3V0VHJhbnNmb3JtLnJvdGF0aW9uO1xyXG4gICAgICAgICAgICBpZiAocm90ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feCAtPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feSArPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0ucm90YXRpb24gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3LnggPSAtTWF0aC5hdGFuMih5LCB4KSArIE1hdGguUEkgLyAyO1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwWzNdID0gLWQgKiBmYWN0b3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwWzNdID0gTmFOO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGMwMSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLl9jYWxjMDEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIGlmIChpc05hTihwWzJdKSkge1xyXG4gICAgICAgICAgICAgICAgcFsxXSA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocFszXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAxLjAgLyBwWzNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKHBbM10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcFsxXSA9IDEuMCAvIHBbMl07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IDEuMCAtIHBbMl0gKiBwWzNdO1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAoMS4wIC0gcFsyXSkgLyBkO1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMV0gPSAoMS4wIC0gcFszXSkgLyBkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhbGVwaCA9IHRoaXMucGFyYW1zWzBdLCBiZXQgPSB0aGlzLnBhcmFtc1sxXSwgQSA9IHRoaXMucGFyYW1zWzJdLCBCID0gdGhpcy5wYXJhbXNbM107XHJcbiAgICAgICAgICAgIHZhciB1ID0gcG9zLngsIHYgPSBwb3MueTtcclxuICAgICAgICAgICAgaWYgKGFsZXBoID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdiAqICgxICsgdSAqIGJldCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYmV0ID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdSAqICgxICsgdiAqIGFsZXBoKTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBEID0gQSAqIEIgLSB2ICogdTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gQSAqIHUgKiAoQiArIHYpIC8gRDtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gQiAqIHYgKiAoQSArIHUpIC8gRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGFsZXBoID0gdGhpcy5wYXJhbXNbMF0sIGJldCA9IHRoaXMucGFyYW1zWzFdLCBBID0gdGhpcy5wYXJhbXNbMl0sIEIgPSB0aGlzLnBhcmFtc1szXTtcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueCwgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICBpZiAoYWxlcGggPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB5IC8gKDEgKyB4ICogYmV0KTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0geDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChiZXQgPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB4ICogKDEgKyB5ICogYWxlcGgpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB4ICogKGJldCArIDEpIC8gKGJldCArIDEgKyB5ICogYWxlcGgpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB5ICogKGFsZXBoICsgMSkgLyAoYWxlcGggKyAxICsgeCAqIGJldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5tYXBTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC54ID0gLXNwcml0ZS5hbmNob3IueCAqIHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gLXNwcml0ZS5hbmNob3IueSAqIHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdGVtcFJlY3Qud2lkdGggPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBRdWFkKHRlbXBSZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0gfHwgc3ByaXRlLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUubWFwUXVhZCA9IGZ1bmN0aW9uIChyZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIGF4ID0gLXJlY3QueCAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheSA9IC1yZWN0LnkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4MiA9ICgxLjAgLSByZWN0LngpIC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5MiA9ICgxLjAgLSByZWN0LnkpIC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciB1cDF4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDF5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDJ4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheDIpICsgcXVhZFsxXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHVwMnkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgeDAwID0gdXAxeCAqICgxLjAgLSBheSkgKyBkb3duMXggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkwMCA9IHVwMXkgKiAoMS4wIC0gYXkpICsgZG93bjF5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MTAgPSB1cDJ4ICogKDEuMCAtIGF5KSArIGRvd24yeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTEwID0gdXAyeSAqICgxLjAgLSBheSkgKyBkb3duMnkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgwMSA9IHVwMXggKiAoMS4wIC0gYXkyKSArIGRvd24xeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkwMSA9IHVwMXkgKiAoMS4wIC0gYXkyKSArIGRvd24xeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHgxMSA9IHVwMnggKiAoMS4wIC0gYXkyKSArIGRvd24yeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkxMSA9IHVwMnkgKiAoMS4wIC0gYXkyKSArIGRvd24yeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIG1hdCA9IHRlbXBNYXQ7XHJcbiAgICAgICAgICAgIG1hdC50eCA9IHgwMDtcclxuICAgICAgICAgICAgbWF0LnR5ID0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYSA9IHgxMCAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmIgPSB5MTAgLSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5jID0geDAxIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuZCA9IHkwMSAtIHkwMDtcclxuICAgICAgICAgICAgdGVtcFBvaW50LnNldCh4MTEsIHkxMSk7XHJcbiAgICAgICAgICAgIG1hdC5hcHBseUludmVyc2UodGVtcFBvaW50LCB0ZW1wUG9pbnQpO1xyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2V0RnJvbU1hdHJpeChtYXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5maWxsVW5pZm9ybXMgPSBmdW5jdGlvbiAodW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICB2YXIgZGlzdG9ydGlvbiA9IHVuaWZvcm1zLnBhcmFtcyB8fCBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAwXSk7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLnBhcmFtcyA9IGRpc3RvcnRpb247XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bMF0gPSBwYXJhbXNbMF07XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bMV0gPSBwYXJhbXNbMV07XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bMl0gPSBwYXJhbXNbMl07XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bM10gPSBwYXJhbXNbM107XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3RyYW5nZVN1cmZhY2U7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5TdXJmYWNlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3RyYW5nZVN1cmZhY2UgPSBTdHJhbmdlU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgUElYSS5TcHJpdGUucHJvdG90eXBlLmNvbnZlcnRUbzJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlX2JpbGluZWFyJztcclxuICAgICAgICB0aGlzLmFUcmFucyA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG4gICAgICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0VG8ycy5jYWxsKHRoaXMpO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0VG8ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFN1YnRyZWVUbzJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY29udmVydFRvMnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jb252ZXJ0U3VidHJlZVRvMnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgU3ByaXRlMnMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGUycywgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGUycyh0ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHR1cmUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLmFUcmFucyA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZShfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZV9iaWxpbmVhcic7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlMnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kcy5hZGRRdWFkKHRoaXMudmVydGV4VHJpbW1lZERhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90cmFuc2Zvcm1JRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybUlEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdHJpbSA9IHRleHR1cmUudHJpbTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IDA7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0cmltKSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IHRyaW0ueCAtIChhbmNob3IuX3ggKiBvcmlnLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyB0cmltLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSB0cmltLnkgLSAoYW5jaG9yLl95ICogb3JpZy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIHRyaW0uaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fc3VyZmFjZSkge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gd3QuYTtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gd3QuYjtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gd3QuYztcclxuICAgICAgICAgICAgICAgIHZhciBkID0gd3QuZDtcclxuICAgICAgICAgICAgICAgIHZhciB0eCA9IHd0LnR4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5ID0gd3QudHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gKGEgKiB3MSkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IChkICogaDEpICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSAoYSAqIHcwKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gKGQgKiBoMSkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IChhICogdzApICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSAoZCAqIGgwKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gKGEgKiB3MSkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IChkICogaDApICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGV4dHVyZS50cmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgICAgIHRleHR1cmUudHJhbnNmb3JtID0gbmV3IFBJWEkuZXh0cmFzLlRleHR1cmVUcmFuc2Zvcm0odGV4dHVyZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dHVyZS50cmFuc2Zvcm0udXBkYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBhVHJhbnMgPSB0aGlzLmFUcmFucztcclxuICAgICAgICAgICAgYVRyYW5zLnNldChvcmlnLndpZHRoLCAwLCAwLCBvcmlnLmhlaWdodCwgdzEsIGgxKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fc3VyZmFjZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYVRyYW5zLnByZXBlbmQodGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFUcmFucy5pbnZlcnQoKTtcclxuICAgICAgICAgICAgYVRyYW5zLnByZXBlbmQodGV4dHVyZS50cmFuc2Zvcm0ubWFwQ29vcmQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmVydGV4VHJpbW1lZERhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4VHJpbW1lZERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fc3VyZmFjZSkge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSwgdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IHd0LmE7XHJcbiAgICAgICAgICAgICAgICB2YXIgYiA9IHd0LmI7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHd0LmM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHd0LmQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHggPSB3dC50eDtcclxuICAgICAgICAgICAgICAgIHZhciB0eSA9IHd0LnR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IChhICogdzEpICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSAoZCAqIGgxKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gKGEgKiB3MCkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IChkICogaDEpICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSAoYSAqIHcwKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gKGQgKiBoMCkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IChhICogdzEpICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSAoZCAqIGgwKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhLCB0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24ubGVnYWN5LndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNwcml0ZTJzLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZTJzO1xyXG4gICAgfShQSVhJLlNwcml0ZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzID0gU3ByaXRlMnM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBUZXh0MnMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhUZXh0MnMsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gVGV4dDJzKHRleHQsIHN0eWxlLCBjYW52YXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dCwgc3R5bGUsIGNhbnZhcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuYVRyYW5zID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlX2JpbGluZWFyJztcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dDJzLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFRleHQycztcclxuICAgIH0oUElYSS5UZXh0KSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uVGV4dDJzID0gVGV4dDJzO1xyXG4gICAgVGV4dDJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICBUZXh0MnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgVGV4dDJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBmdW5jdGlvbiBjb250YWluZXIyZFdvcmxkVHJhbnNmb3JtKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICB9XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSA9IGNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm07XHJcbiAgICB2YXIgQ29udGFpbmVyMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhDb250YWluZXIyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBDb250YWluZXIyZCgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbnRhaW5lcjJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIENvbnRhaW5lcjJkO1xyXG4gICAgfShQSVhJLkNvbnRhaW5lcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLkNvbnRhaW5lcjJkID0gQ29udGFpbmVyMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBQb2ludCA9IFBJWEkuUG9pbnQ7XHJcbiAgICB2YXIgbWF0M2lkID0gWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdO1xyXG4gICAgdmFyIEFGRklORTtcclxuICAgIChmdW5jdGlvbiAoQUZGSU5FKSB7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIk5PTkVcIl0gPSAwXSA9IFwiTk9ORVwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJGUkVFXCJdID0gMV0gPSBcIkZSRUVcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiQVhJU19YXCJdID0gMl0gPSBcIkFYSVNfWFwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJBWElTX1lcIl0gPSAzXSA9IFwiQVhJU19ZXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIlBPSU5UXCJdID0gNF0gPSBcIlBPSU5UXCI7XHJcbiAgICB9KShBRkZJTkUgPSBwaXhpX3Byb2plY3Rpb24uQUZGSU5FIHx8IChwaXhpX3Byb2plY3Rpb24uQUZGSU5FID0ge30pKTtcclxuICAgIHZhciBNYXRyaXgyZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gTWF0cml4MmQoYmFja2luZ0FycmF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmxvYXRBcnJheSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMubWF0MyA9IG5ldyBGbG9hdDY0QXJyYXkoYmFja2luZ0FycmF5IHx8IG1hdDNpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiYVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1swXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1swXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImJcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbMV07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbMV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJjXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzNdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzNdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiZFwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1s0XTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1s0XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcInR4XCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzZdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzZdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwidHlcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbN107XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbN10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB0eCwgdHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBhO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gYjtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBjO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gZDtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSB0eDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHR5O1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICh0cmFuc3Bvc2UsIG91dCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZmxvYXRBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG9hdEFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSg5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBvdXQgfHwgdGhpcy5mbG9hdEFycmF5O1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgaWYgKHRyYW5zcG9zZSkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMF0gPSBtYXQzWzBdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMV0gPSBtYXQzWzFdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMl0gPSBtYXQzWzJdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbM10gPSBtYXQzWzNdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNF0gPSBtYXQzWzRdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNV0gPSBtYXQzWzVdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNl0gPSBtYXQzWzZdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbN10gPSBtYXQzWzddO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbOF0gPSBtYXQzWzhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMF0gPSBtYXQzWzBdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMV0gPSBtYXQzWzNdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMl0gPSBtYXQzWzZdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbM10gPSBtYXQzWzFdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNF0gPSBtYXQzWzRdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNV0gPSBtYXQzWzddO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNl0gPSBtYXQzWzJdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbN10gPSBtYXQzWzVdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbOF0gPSBtYXQzWzhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLng7XHJcbiAgICAgICAgICAgIHZhciB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciB6ID0gMS4wIC8gKG1hdDNbMl0gKiB4ICsgbWF0M1s1XSAqIHkgKyBtYXQzWzhdKTtcclxuICAgICAgICAgICAgbmV3UG9zLnggPSB6ICogKG1hdDNbMF0gKiB4ICsgbWF0M1szXSAqIHkgKyBtYXQzWzZdKTtcclxuICAgICAgICAgICAgbmV3UG9zLnkgPSB6ICogKG1hdDNbMV0gKiB4ICsgbWF0M1s0XSAqIHkgKyBtYXQzWzddKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbiAodHgsIHR5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdICs9IHR4ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1sxXSArPSB0eSAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbM10gKz0gdHggKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzRdICs9IHR5ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s2XSArPSB0eCAqIG1hdDNbOF07XHJcbiAgICAgICAgICAgIG1hdDNbN10gKz0gdHkgKiBtYXQzWzhdO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdICo9IHg7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gKj0geTtcclxuICAgICAgICAgICAgbWF0M1szXSAqPSB4O1xyXG4gICAgICAgICAgICBtYXQzWzRdICo9IHk7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gKj0geDtcclxuICAgICAgICAgICAgbWF0M1s3XSAqPSB5O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zY2FsZUFuZFRyYW5zbGF0ZSA9IGZ1bmN0aW9uIChzY2FsZVgsIHNjYWxlWSwgdHgsIHR5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gc2NhbGVYICogbWF0M1swXSArIHR4ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHNjYWxlWSAqIG1hdDNbMV0gKyB0eSAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBzY2FsZVggKiBtYXQzWzNdICsgdHggKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gc2NhbGVZICogbWF0M1s0XSArIHR5ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHNjYWxlWCAqIG1hdDNbNl0gKyB0eCAqIG1hdDNbOF07XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSBzY2FsZVkgKiBtYXQzWzddICsgdHkgKiBtYXQzWzhdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54O1xyXG4gICAgICAgICAgICB2YXIgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVszXSwgYTAyID0gYVs2XSwgYTEwID0gYVsxXSwgYTExID0gYVs0XSwgYTEyID0gYVs3XSwgYTIwID0gYVsyXSwgYTIxID0gYVs1XSwgYTIyID0gYVs4XTtcclxuICAgICAgICAgICAgdmFyIG5ld1ggPSAoYTIyICogYTExIC0gYTEyICogYTIxKSAqIHggKyAoLWEyMiAqIGEwMSArIGEwMiAqIGEyMSkgKiB5ICsgKGExMiAqIGEwMSAtIGEwMiAqIGExMSk7XHJcbiAgICAgICAgICAgIHZhciBuZXdZID0gKC1hMjIgKiBhMTAgKyBhMTIgKiBhMjApICogeCArIChhMjIgKiBhMDAgLSBhMDIgKiBhMjApICogeSArICgtYTEyICogYTAwICsgYTAyICogYTEwKTtcclxuICAgICAgICAgICAgdmFyIG5ld1ogPSAoYTIxICogYTEwIC0gYTExICogYTIwKSAqIHggKyAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiB5ICsgKGExMSAqIGEwMCAtIGEwMSAqIGExMCk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy54ID0gbmV3WCAvIG5ld1o7XHJcbiAgICAgICAgICAgIG5ld1Bvcy55ID0gbmV3WSAvIG5ld1o7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sIGIwMSA9IGEyMiAqIGExMSAtIGExMiAqIGEyMSwgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMCwgYjIxID0gYTIxICogYTEwIC0gYTExICogYTIwO1xyXG4gICAgICAgICAgICB2YXIgZGV0ID0gYTAwICogYjAxICsgYTAxICogYjExICsgYTAyICogYjIxO1xyXG4gICAgICAgICAgICBpZiAoIWRldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xyXG4gICAgICAgICAgICBhWzBdID0gYjAxICogZGV0O1xyXG4gICAgICAgICAgICBhWzFdID0gKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogZGV0O1xyXG4gICAgICAgICAgICBhWzJdID0gKGExMiAqIGEwMSAtIGEwMiAqIGExMSkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbM10gPSBiMTEgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbNF0gPSAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIGRldDtcclxuICAgICAgICAgICAgYVs1XSA9ICgtYTEyICogYTAwICsgYTAyICogYTEwKSAqIGRldDtcclxuICAgICAgICAgICAgYVs2XSA9IGIyMSAqIGRldDtcclxuICAgICAgICAgICAgYVs3XSA9ICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIGRldDtcclxuICAgICAgICAgICAgYVs4XSA9IChhMTEgKiBhMDAgLSBhMDEgKiBhMTApICogZGV0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5pZGVudGl0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gMDtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gMTtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzddID0gMDtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeDJkKHRoaXMubWF0Myk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY29weVRvID0gZnVuY3Rpb24gKG1hdHJpeCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGFyMiA9IG1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBhcjJbMF0gPSBtYXQzWzBdO1xyXG4gICAgICAgICAgICBhcjJbMV0gPSBtYXQzWzFdO1xyXG4gICAgICAgICAgICBhcjJbMl0gPSBtYXQzWzJdO1xyXG4gICAgICAgICAgICBhcjJbM10gPSBtYXQzWzNdO1xyXG4gICAgICAgICAgICBhcjJbNF0gPSBtYXQzWzRdO1xyXG4gICAgICAgICAgICBhcjJbNV0gPSBtYXQzWzVdO1xyXG4gICAgICAgICAgICBhcjJbNl0gPSBtYXQzWzZdO1xyXG4gICAgICAgICAgICBhcjJbN10gPSBtYXQzWzddO1xyXG4gICAgICAgICAgICBhcjJbOF0gPSBtYXQzWzhdO1xyXG4gICAgICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAobWF0cml4LCBhZmZpbmUpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBkID0gMS4wIC8gbWF0M1s4XTtcclxuICAgICAgICAgICAgdmFyIHR4ID0gbWF0M1s2XSAqIGQsIHR5ID0gbWF0M1s3XSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5hID0gKG1hdDNbMF0gLSBtYXQzWzJdICogdHgpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmIgPSAobWF0M1sxXSAtIG1hdDNbMl0gKiB0eSkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguYyA9IChtYXQzWzNdIC0gbWF0M1s1XSAqIHR4KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5kID0gKG1hdDNbNF0gLSBtYXQzWzVdICogdHkpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LnR4ID0gdHg7XHJcbiAgICAgICAgICAgIG1hdHJpeC50eSA9IHR5O1xyXG4gICAgICAgICAgICBpZiAoYWZmaW5lID49IDIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhZmZpbmUgPT09IEFGRklORS5QT0lOVCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5hID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5kID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFmZmluZSA9PT0gQUZGSU5FLkFYSVNfWCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5jID0gLW1hdHJpeC5iO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5kID0gbWF0cml4LmE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhZmZpbmUgPT09IEFGRklORS5BWElTX1kpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYSA9IG1hdHJpeC5kO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5jID0gLW1hdHJpeC5iO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY29weUZyb20gPSBmdW5jdGlvbiAobWF0cml4KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gbWF0cml4LmE7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBtYXRyaXguYjtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBtYXRyaXguYztcclxuICAgICAgICAgICAgbWF0M1s0XSA9IG1hdHJpeC5kO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IG1hdHJpeC50eDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IG1hdHJpeC50eTtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDEuMDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2V0VG9NdWx0TGVnYWN5ID0gZnVuY3Rpb24gKHB0LCBsdCkge1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYiA9IGx0Lm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBwdC5hLCBhMDEgPSBwdC5iLCBhMTAgPSBwdC5jLCBhMTEgPSBwdC5kLCBhMjAgPSBwdC50eCwgYTIxID0gcHQudHksIGIwMCA9IGJbMF0sIGIwMSA9IGJbMV0sIGIwMiA9IGJbMl0sIGIxMCA9IGJbM10sIGIxMSA9IGJbNF0sIGIxMiA9IGJbNV0sIGIyMCA9IGJbNl0sIGIyMSA9IGJbN10sIGIyMiA9IGJbOF07XHJcbiAgICAgICAgICAgIG91dFswXSA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzFdID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbMl0gPSBiMDI7XHJcbiAgICAgICAgICAgIG91dFszXSA9IGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbNV0gPSBiMTI7XHJcbiAgICAgICAgICAgIG91dFs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbOF0gPSBiMjI7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNldFRvTXVsdDJkID0gZnVuY3Rpb24gKHB0LCBsdCkge1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYSA9IHB0Lm1hdDMsIGIgPSBsdC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSwgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XSwgYjAwID0gYlswXSwgYjAxID0gYlsxXSwgYjAyID0gYlsyXSwgYjEwID0gYlszXSwgYjExID0gYls0XSwgYjEyID0gYls1XSwgYjIwID0gYls2XSwgYjIxID0gYls3XSwgYjIyID0gYls4XTtcclxuICAgICAgICAgICAgb3V0WzBdID0gYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbMV0gPSBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFsyXSA9IGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMjtcclxuICAgICAgICAgICAgb3V0WzNdID0gYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbNF0gPSBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs1XSA9IGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMjtcclxuICAgICAgICAgICAgb3V0WzZdID0gYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbN10gPSBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs4XSA9IGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMjtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5JREVOVElUWSA9IG5ldyBNYXRyaXgyZCgpO1xyXG4gICAgICAgIE1hdHJpeDJkLlRFTVBfTUFUUklYID0gbmV3IE1hdHJpeDJkKCk7XHJcbiAgICAgICAgcmV0dXJuIE1hdHJpeDJkO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCA9IE1hdHJpeDJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1IYWNrKHBhcmVudFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZhciBwcm9qID0gdGhpcy5wcm9qO1xyXG4gICAgICAgIHZhciB0YSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHB3aWQgPSBwYXJlbnRUcmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgdmFyIGx0ID0gdGEubG9jYWxUcmFuc2Zvcm07XHJcbiAgICAgICAgaWYgKHRhLl9sb2NhbElEICE9PSB0YS5fY3VycmVudExvY2FsSUQpIHtcclxuICAgICAgICAgICAgbHQuYSA9IHRhLl9jeCAqIHRhLnNjYWxlLl94O1xyXG4gICAgICAgICAgICBsdC5iID0gdGEuX3N4ICogdGEuc2NhbGUuX3g7XHJcbiAgICAgICAgICAgIGx0LmMgPSB0YS5fY3kgKiB0YS5zY2FsZS5feTtcclxuICAgICAgICAgICAgbHQuZCA9IHRhLl9zeSAqIHRhLnNjYWxlLl95O1xyXG4gICAgICAgICAgICBsdC50eCA9IHRhLnBvc2l0aW9uLl94IC0gKCh0YS5waXZvdC5feCAqIGx0LmEpICsgKHRhLnBpdm90Ll95ICogbHQuYykpO1xyXG4gICAgICAgICAgICBsdC50eSA9IHRhLnBvc2l0aW9uLl95IC0gKCh0YS5waXZvdC5feCAqIGx0LmIpICsgKHRhLnBpdm90Ll95ICogbHQuZCkpO1xyXG4gICAgICAgICAgICB0YS5fY3VycmVudExvY2FsSUQgPSB0YS5fbG9jYWxJRDtcclxuICAgICAgICAgICAgcHJvai5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgX21hdHJpeElEID0gcHJvai5fcHJvaklEO1xyXG4gICAgICAgIGlmIChwcm9qLl9jdXJyZW50UHJvaklEICE9PSBfbWF0cml4SUQpIHtcclxuICAgICAgICAgICAgcHJvai5fY3VycmVudFByb2pJRCA9IF9tYXRyaXhJRDtcclxuICAgICAgICAgICAgaWYgKF9tYXRyaXhJRCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcHJvai5sb2NhbC5zZXRUb011bHRMZWdhY3kobHQsIHByb2oubWF0cml4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb2oubG9jYWwuY29weUZyb20obHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhLl9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGEuX3BhcmVudElEICE9PSBwd2lkKSB7XHJcbiAgICAgICAgICAgIHZhciBwcCA9IHBhcmVudFRyYW5zZm9ybS5wcm9qO1xyXG4gICAgICAgICAgICBpZiAocHAgJiYgIXBwLmFmZmluZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvai53b3JsZC5zZXRUb011bHQyZChwcC53b3JsZCwgcHJvai5sb2NhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLndvcmxkLnNldFRvTXVsdExlZ2FjeShwYXJlbnRUcmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0sIHByb2oubG9jYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb2oud29ybGQuY29weSh0YS53b3JsZFRyYW5zZm9ybSwgcHJvai5fYWZmaW5lKTtcclxuICAgICAgICAgICAgdGEuX3BhcmVudElEID0gcHdpZDtcclxuICAgICAgICAgICAgdGEuX3dvcmxkSUQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgdDAgPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgdmFyIHR0ID0gW25ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCldO1xyXG4gICAgdmFyIHRlbXBSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKCk7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgIHZhciBQcm9qZWN0aW9uMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhQcm9qZWN0aW9uMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvbjJkKGxlZ2FjeSwgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGxlZ2FjeSwgZW5hYmxlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5tYXRyaXggPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIF90aGlzLmxvY2FsID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy53b3JsZCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb2pJRCA9IDA7XHJcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgICAgIF90aGlzLl9hZmZpbmUgPSBwaXhpX3Byb2plY3Rpb24uQUZGSU5FLk5PTkU7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb24yZC5wcm90b3R5cGUsIFwiYWZmaW5lXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWZmaW5lO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FmZmluZSA9PSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hZmZpbmUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb24yZC5wcm90b3R5cGUsIFwiZW5hYmxlZFwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuX2VuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1IYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gUElYSS5UcmFuc2Zvcm1TdGF0aWMucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5zZXRBeGlzWCA9IGZ1bmN0aW9uIChwLCBmYWN0b3IpIHtcclxuICAgICAgICAgICAgaWYgKGZhY3RvciA9PT0gdm9pZCAwKSB7IGZhY3RvciA9IDE7IH1cclxuICAgICAgICAgICAgdmFyIHggPSBwLngsIHkgPSBwLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSB4IC8gZDtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHkgLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gZmFjdG9yIC8gZDtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEKys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLnNldEF4aXNZID0gZnVuY3Rpb24gKHAsIGZhY3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yID09PSB2b2lkIDApIHsgZmFjdG9yID0gMTsgfVxyXG4gICAgICAgICAgICB2YXIgeCA9IHAueCwgeSA9IHAueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXRyaXgubWF0MztcclxuICAgICAgICAgICAgbWF0M1szXSA9IHggLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0geSAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSBmYWN0b3IgLyBkO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUubWFwU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCkge1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSAtc3ByaXRlLmFuY2hvci54ICogdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnkgPSAtc3ByaXRlLmFuY2hvci55ICogdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC53aWR0aCA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcFF1YWQodGVtcFJlY3QsIHF1YWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5tYXBRdWFkID0gZnVuY3Rpb24gKHJlY3QsIHApIHtcclxuICAgICAgICAgICAgdHRbMF0uc2V0KHJlY3QueCwgcmVjdC55KTtcclxuICAgICAgICAgICAgdHRbMV0uc2V0KHJlY3QueCArIHJlY3Qud2lkdGgsIHJlY3QueSk7XHJcbiAgICAgICAgICAgIHR0WzJdLnNldChyZWN0LnggKyByZWN0LndpZHRoLCByZWN0LnkgKyByZWN0LmhlaWdodCk7XHJcbiAgICAgICAgICAgIHR0WzNdLnNldChyZWN0LngsIHJlY3QueSArIHJlY3QuaGVpZ2h0KTtcclxuICAgICAgICAgICAgdmFyIGsxID0gMSwgazIgPSAyLCBrMyA9IDM7XHJcbiAgICAgICAgICAgIHZhciBmID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLmdldEludGVyc2VjdGlvbkZhY3RvcihwWzBdLCBwWzJdLCBwWzFdLCBwWzNdLCB0MCk7XHJcbiAgICAgICAgICAgIGlmIChmICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBrMSA9IDE7XHJcbiAgICAgICAgICAgICAgICBrMiA9IDM7XHJcbiAgICAgICAgICAgICAgICBrMyA9IDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGQwID0gTWF0aC5zcXJ0KChwWzBdLnggLSB0MC54KSAqIChwWzBdLnggLSB0MC54KSArIChwWzBdLnkgLSB0MC55KSAqIChwWzBdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBkMSA9IE1hdGguc3FydCgocFtrMV0ueCAtIHQwLngpICogKHBbazFdLnggLSB0MC54KSArIChwW2sxXS55IC0gdDAueSkgKiAocFtrMV0ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIGQyID0gTWF0aC5zcXJ0KChwW2syXS54IC0gdDAueCkgKiAocFtrMl0ueCAtIHQwLngpICsgKHBbazJdLnkgLSB0MC55KSAqIChwW2syXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgZDMgPSBNYXRoLnNxcnQoKHBbazNdLnggLSB0MC54KSAqIChwW2szXS54IC0gdDAueCkgKyAocFtrM10ueSAtIHQwLnkpICogKHBbazNdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBxMCA9IChkMCArIGQzKSAvIGQzO1xyXG4gICAgICAgICAgICB2YXIgcTEgPSAoZDEgKyBkMikgLyBkMjtcclxuICAgICAgICAgICAgdmFyIHEyID0gKGQxICsgZDIpIC8gZDE7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXRyaXgubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHR0WzBdLnggKiBxMDtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHR0WzBdLnkgKiBxMDtcclxuICAgICAgICAgICAgbWF0M1syXSA9IHEwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gdHRbazFdLnggKiBxMTtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHR0W2sxXS55ICogcTE7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSBxMTtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHR0W2syXS54ICogcTI7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSB0dFtrMl0ueSAqIHEyO1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gcTI7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4LmludmVydCgpO1xyXG4gICAgICAgICAgICBtYXQzID0gdGVtcE1hdC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gcFswXS54O1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gcFswXS55O1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMTtcclxuICAgICAgICAgICAgbWF0M1szXSA9IHBbazFdLng7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBwW2sxXS55O1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMTtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHBbazJdLng7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSBwW2syXS55O1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMTtcclxuICAgICAgICAgICAgdGhpcy5tYXRyaXguc2V0VG9NdWx0MmQodGVtcE1hdCwgdGhpcy5tYXRyaXgpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEID0gMDtcclxuICAgICAgICAgICAgdGhpcy5tYXRyaXguaWRlbnRpdHkoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uMmQ7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkID0gUHJvamVjdGlvbjJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTWVzaDJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoTWVzaDJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIE1lc2gyZCh0ZXh0dXJlLCB2ZXJ0aWNlcywgdXZzLCBpbmRpY2VzLCBkcmF3TW9kZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0dXJlLCB2ZXJ0aWNlcywgdXZzLCBpbmRpY2VzLCBkcmF3TW9kZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnbWVzaDJkJztcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVzaDJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIE1lc2gyZDtcclxuICAgIH0oUElYSS5tZXNoLk1lc2gpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5NZXNoMmQgPSBNZXNoMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBzaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHRyYW5zbGF0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB1VHJhbnNmb3JtO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIHRyYW5zbGF0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuXFxuICAgIHZUZXh0dXJlQ29vcmQgPSAodVRyYW5zZm9ybSAqIHZlYzMoYVRleHR1cmVDb29yZCwgMS4wKSkueHk7XFxufVxcblwiO1xyXG4gICAgdmFyIHNoYWRlckZyYWcgPSBcIlxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gdmVjNCB1Q29sb3I7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpICogdUNvbG9yO1xcbn1cIjtcclxuICAgIHZhciBNZXNoMmRSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKE1lc2gyZFJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIE1lc2gyZFJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE1lc2gyZFJlbmRlcmVyLnByb3RvdHlwZS5vbkNvbnRleHRDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhZGVyID0gbmV3IFBJWEkuU2hhZGVyKGdsLCBzaGFkZXJWZXJ0LCBzaGFkZXJGcmFnKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBNZXNoMmRSZW5kZXJlcjtcclxuICAgIH0oUElYSS5tZXNoLk1lc2hSZW5kZXJlcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLk1lc2gyZFJlbmRlcmVyID0gTWVzaDJkUmVuZGVyZXI7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ21lc2gyZCcsIE1lc2gyZFJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgUElYSS5TcHJpdGUucHJvdG90eXBlLmNvbnZlcnRUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZTJkJztcclxuICAgICAgICB0aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkubWVzaC5NZXNoLnByb3RvdHlwZS5jb252ZXJ0VG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMucGx1Z2luTmFtZSA9ICdtZXNoMmQnO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFN1YnRyZWVUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY29udmVydFRvMmQoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jb252ZXJ0U3VidHJlZVRvMmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgU3ByaXRlMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGUyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGUyZCh0ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHR1cmUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZTJkJztcclxuICAgICAgICAgICAgX3RoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZTJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcygpO1xyXG4gICAgICAgICAgICB0aGlzLl9ib3VuZHMuYWRkUXVhZCh0aGlzLnZlcnRleFRyaW1tZWREYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWZmaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0ZXhEYXRhLmxlbmd0aCAhPSA4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSg4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy52ZXJ0ZXhEYXRhLmxlbmd0aCAhPSAxMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNmb3JtSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1JRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUlEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnByb2oud29ybGQubWF0MztcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0cmltID0gdGV4dHVyZS50cmltO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHcwID0gMDtcclxuICAgICAgICAgICAgdmFyIHcxID0gMDtcclxuICAgICAgICAgICAgdmFyIGgwID0gMDtcclxuICAgICAgICAgICAgdmFyIGgxID0gMDtcclxuICAgICAgICAgICAgaWYgKHRyaW0pIHtcclxuICAgICAgICAgICAgICAgIHcxID0gdHJpbS54IC0gKGFuY2hvci5feCAqIG9yaWcud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIHRyaW0ud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IHRyaW0ueSAtIChhbmNob3IuX3kgKiBvcmlnLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgdHJpbS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gKHd0WzBdICogdzEpICsgKHd0WzNdICogaDEpICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSAod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9ICh3dFsyXSAqIHcxKSArICh3dFs1XSAqIGgxKSArIHd0WzhdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gKHd0WzBdICogdzApICsgKHd0WzNdICogaDEpICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSAod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9ICh3dFsyXSAqIHcwKSArICh3dFs1XSAqIGgxKSArIHd0WzhdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gKHd0WzBdICogdzApICsgKHd0WzNdICogaDApICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSAod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs4XSA9ICh3dFsyXSAqIHcwKSArICh3dFs1XSAqIGgwKSArIHd0WzhdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzldID0gKHd0WzBdICogdzEpICsgKHd0WzNdICogaDApICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMTBdID0gKHd0WzFdICogdzEpICsgKHd0WzRdICogaDApICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMTFdID0gKHd0WzJdICogdzEpICsgKHd0WzVdICogaDApICsgd3RbOF07XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hZmZpbmUpIHtcclxuICAgICAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmVydGV4VHJpbW1lZERhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4VHJpbW1lZERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3dCA9IHRoaXMucHJvai53b3JsZC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciB6ID0gMS4wIC8gKHd0WzJdICogdzEgKyB3dFs1XSAqIGgxICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0geiAqICgod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMSkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSB6ICogKCh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgxKSArIHd0WzddKTtcclxuICAgICAgICAgICAgeiA9IDEuMCAvICh3dFsyXSAqIHcwICsgd3RbNV0gKiBoMSArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IHogKiAoKHd0WzBdICogdzApICsgKHd0WzNdICogaDEpICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0geiAqICgod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XSk7XHJcbiAgICAgICAgICAgIHogPSAxLjAgLyAod3RbMl0gKiB3MCArIHd0WzVdICogaDAgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSB6ICogKCh3dFswXSAqIHcwKSArICh3dFszXSAqIGgwKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IHogKiAoKHd0WzFdICogdzApICsgKHd0WzRdICogaDApICsgd3RbN10pO1xyXG4gICAgICAgICAgICB6ID0gMS4wIC8gKHd0WzJdICogdzEgKyB3dFs1XSAqIGgwICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0geiAqICgod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMCkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSB6ICogKCh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgwKSArIHd0WzddKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTcHJpdGUyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBTcHJpdGUyZDtcclxuICAgIH0oUElYSS5TcHJpdGUpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZCA9IFNwcml0ZTJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB2YXIgU3ByaXRlMmRSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZTJkUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlMmRSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5hdHRyaWJ1dGUgdmVjNCBhQ29sb3I7XFxuYXR0cmlidXRlIGZsb2F0IGFUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogYVZlcnRleFBvc2l0aW9uO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcbiAgICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuICAgIHZUZXh0dXJlSWQgPSBhVGV4dHVyZUlkO1xcbiAgICB2Q29sb3IgPSBhQ29sb3I7XFxufVxcblwiO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gXCJcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcnNbJWNvdW50JV07XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbnZlYzQgY29sb3I7XFxudmVjMiB0ZXh0dXJlQ29vcmQgPSB2VGV4dHVyZUNvb3JkO1xcbmZsb2F0IHRleHR1cmVJZCA9IGZsb29yKHZUZXh0dXJlSWQrMC41KTtcXG4lZm9ybG9vcCVcXG5nbF9GcmFnQ29sb3IgPSBjb2xvciAqIHZDb2xvcjtcXG59XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlMmRSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlVmFvID0gZnVuY3Rpb24gKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRTaXplID0gNjtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0Qnl0ZVNpemUgPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdmFyIHZhbyA9IHRoaXMucmVuZGVyZXIuY3JlYXRlVmFvKClcclxuICAgICAgICAgICAgICAgIC5hZGRJbmRleCh0aGlzLmluZGV4QnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFWZXJ0ZXhQb3NpdGlvbiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUNvb3JkLCBnbC5VTlNJR05FRF9TSE9SVCwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDMgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFDb2xvciwgZ2wuVU5TSUdORURfQllURSwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDQgKiA0KTtcclxuICAgICAgICAgICAgaWYgKGF0dHJzLmFUZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgICAgIHZhby5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUlkLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA1ICogNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJkUmVuZGVyZXIucHJvdG90eXBlLmZpbGxWZXJ0aWNlcyA9IGZ1bmN0aW9uIChmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgdGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gc3ByaXRlLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB1dnMgPSBzcHJpdGUuX3RleHR1cmUuX3V2cy51dnNVaW50MzI7XHJcbiAgICAgICAgICAgIGlmICh2ZXJ0ZXhEYXRhLmxlbmd0aCA9PT0gOCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyZXIucm91bmRQaXhlbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb2x1dGlvbiA9IHRoaXMucmVuZGVyZXIucmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSAoKHZlcnRleERhdGFbMF0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gKCh2ZXJ0ZXhEYXRhWzFdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gKCh2ZXJ0ZXhEYXRhWzJdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9ICgodmVydGV4RGF0YVszXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMl0gPSAoKHZlcnRleERhdGFbNF0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9ICgodmVydGV4RGF0YVs1XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTRdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMThdID0gKCh2ZXJ0ZXhEYXRhWzZdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOV0gPSAoKHZlcnRleERhdGFbN10gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDIwXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gdmVydGV4RGF0YVsyXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gdmVydGV4RGF0YVszXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTJdID0gdmVydGV4RGF0YVs0XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHZlcnRleERhdGFbNV07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxNF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOF0gPSB2ZXJ0ZXhEYXRhWzZdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTldID0gdmVydGV4RGF0YVs3XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDIwXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbMF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVsxXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSB2ZXJ0ZXhEYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IHZlcnRleERhdGFbM107XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gdmVydGV4RGF0YVs0XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSB2ZXJ0ZXhEYXRhWzVdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMl0gPSB2ZXJ0ZXhEYXRhWzZdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB2ZXJ0ZXhEYXRhWzddO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxNF0gPSB2ZXJ0ZXhEYXRhWzhdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOF0gPSB2ZXJ0ZXhEYXRhWzldO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOV0gPSB2ZXJ0ZXhEYXRhWzEwXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMjBdID0gdmVydGV4RGF0YVsxMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDNdID0gdXZzWzBdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgOV0gPSB1dnNbMV07XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAxNV0gPSB1dnNbMl07XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAyMV0gPSB1dnNbM107XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyA0XSA9IHVpbnQzMlZpZXdbaW5kZXggKyAxMF0gPSB1aW50MzJWaWV3W2luZGV4ICsgMTZdID0gdWludDMyVmlld1tpbmRleCArIDIyXSA9IGFyZ2I7XHJcbiAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNV0gPSBmbG9hdDMyVmlld1tpbmRleCArIDExXSA9IGZsb2F0MzJWaWV3W2luZGV4ICsgMTddID0gZmxvYXQzMlZpZXdbaW5kZXggKyAyM10gPSB0ZXh0dXJlSWQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlMmRSZW5kZXJlcjtcclxuICAgIH0oTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIpKTtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignc3ByaXRlMmQnLCBTcHJpdGUyZFJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFRleHQyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFRleHQyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBUZXh0MmQodGV4dCwgc3R5bGUsIGNhbnZhcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0LCBzdHlsZSwgY2FudmFzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGUyZCc7XHJcbiAgICAgICAgICAgIF90aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dDJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFRleHQyZDtcclxuICAgIH0oUElYSS5UZXh0KSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uVGV4dDJkID0gVGV4dDJkO1xyXG4gICAgVGV4dDJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICBUZXh0MmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgVGV4dDJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgUHJvamVjdGlvbnNNYW5hZ2VyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uc01hbmFnZXIocmVuZGVyZXIpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5vbkNvbnRleHRDaGFuZ2UgPSBmdW5jdGlvbiAoZ2wpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmdsID0gZ2w7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW5kZXJlci5tYXNrTWFuYWdlci5wdXNoU3ByaXRlTWFzayA9IHB1c2hTcHJpdGVNYXNrO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLm9uKCdjb250ZXh0JywgdGhpcy5vbkNvbnRleHRDaGFuZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBQcm9qZWN0aW9uc01hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIub2ZmKCdjb250ZXh0JywgdGhpcy5vbkNvbnRleHRDaGFuZ2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb25zTWFuYWdlcjtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbnNNYW5hZ2VyID0gUHJvamVjdGlvbnNNYW5hZ2VyO1xyXG4gICAgZnVuY3Rpb24gcHVzaFNwcml0ZU1hc2sodGFyZ2V0LCBtYXNrRGF0YSkge1xyXG4gICAgICAgIHZhciBhbHBoYU1hc2tGaWx0ZXIgPSB0aGlzLmFscGhhTWFza1Bvb2xbdGhpcy5hbHBoYU1hc2tJbmRleF07XHJcbiAgICAgICAgaWYgKCFhbHBoYU1hc2tGaWx0ZXIpIHtcclxuICAgICAgICAgICAgYWxwaGFNYXNrRmlsdGVyID0gdGhpcy5hbHBoYU1hc2tQb29sW3RoaXMuYWxwaGFNYXNrSW5kZXhdID0gW25ldyBwaXhpX3Byb2plY3Rpb24uU3ByaXRlTWFza0ZpbHRlcjJkKG1hc2tEYXRhKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFscGhhTWFza0ZpbHRlclswXS5yZXNvbHV0aW9uID0gdGhpcy5yZW5kZXJlci5yZXNvbHV0aW9uO1xyXG4gICAgICAgIGFscGhhTWFza0ZpbHRlclswXS5tYXNrU3ByaXRlID0gbWFza0RhdGE7XHJcbiAgICAgICAgdGFyZ2V0LmZpbHRlckFyZWEgPSBtYXNrRGF0YS5nZXRCb3VuZHModHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5maWx0ZXJNYW5hZ2VyLnB1c2hGaWx0ZXIodGFyZ2V0LCBhbHBoYU1hc2tGaWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuYWxwaGFNYXNrSW5kZXgrKztcclxuICAgIH1cclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbigncHJvamVjdGlvbnMnLCBQcm9qZWN0aW9uc01hbmFnZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgc3ByaXRlTWFza1ZlcnQgPSBcIlxcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyBvdGhlck1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzMgdk1hc2tDb29yZDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuXFxuXFx0dlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuXFx0dk1hc2tDb29yZCA9IG90aGVyTWF0cml4ICogdmVjMyggYVRleHR1cmVDb29yZCwgMS4wKTtcXG59XFxuXCI7XHJcbiAgICB2YXIgc3ByaXRlTWFza0ZyYWcgPSBcIlxcbnZhcnlpbmcgdmVjMyB2TWFza0Nvb3JkO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYWxwaGE7XFxudW5pZm9ybSBzYW1wbGVyMkQgbWFzaztcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIHZlYzIgdXYgPSB2TWFza0Nvb3JkLnh5IC8gdk1hc2tDb29yZC56O1xcbiAgICBcXG4gICAgdmVjMiB0ZXh0ID0gYWJzKCB1diAtIDAuNSApO1xcbiAgICB0ZXh0ID0gc3RlcCgwLjUsIHRleHQpO1xcblxcbiAgICBmbG9hdCBjbGlwID0gMS4wIC0gbWF4KHRleHQueSwgdGV4dC54KTtcXG4gICAgdmVjNCBvcmlnaW5hbCA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzQgbWFza3kgPSB0ZXh0dXJlMkQobWFzaywgdXYpO1xcblxcbiAgICBvcmlnaW5hbCAqPSAobWFza3kuciAqIG1hc2t5LmEgKiBhbHBoYSAqIGNsaXApO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBvcmlnaW5hbDtcXG59XFxuXCI7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgIHZhciBTcHJpdGVNYXNrRmlsdGVyMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGVNYXNrRmlsdGVyMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlTWFza0ZpbHRlcjJkKHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzcHJpdGVNYXNrVmVydCwgc3ByaXRlTWFza0ZyYWcpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLm1hc2tNYXRyaXggPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIHNwcml0ZS5yZW5kZXJhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF90aGlzLm1hc2tTcHJpdGUgPSBzcHJpdGU7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlTWFza0ZpbHRlcjJkLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChmaWx0ZXJNYW5hZ2VyLCBpbnB1dCwgb3V0cHV0LCBjbGVhciwgY3VycmVudFN0YXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXNrU3ByaXRlID0gdGhpcy5tYXNrU3ByaXRlO1xyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1zLm1hc2sgPSBtYXNrU3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybXMub3RoZXJNYXRyaXggPSBTcHJpdGVNYXNrRmlsdGVyMmQuY2FsY3VsYXRlU3ByaXRlTWF0cml4KGN1cnJlbnRTdGF0ZSwgdGhpcy5tYXNrTWF0cml4LCBtYXNrU3ByaXRlKTtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3Jtcy5hbHBoYSA9IG1hc2tTcHJpdGUud29ybGRBbHBoYTtcclxuICAgICAgICAgICAgZmlsdGVyTWFuYWdlci5hcHBseUZpbHRlcih0aGlzLCBpbnB1dCwgb3V0cHV0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZU1hc2tGaWx0ZXIyZC5jYWxjdWxhdGVTcHJpdGVNYXRyaXggPSBmdW5jdGlvbiAoY3VycmVudFN0YXRlLCBtYXBwZWRNYXRyaXgsIHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvaiA9IHNwcml0ZS5wcm9qO1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyQXJlYSA9IGN1cnJlbnRTdGF0ZS5zb3VyY2VGcmFtZTtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmVTaXplID0gY3VycmVudFN0YXRlLnJlbmRlclRhcmdldC5zaXplO1xyXG4gICAgICAgICAgICB2YXIgd29ybGRUcmFuc2Zvcm0gPSBwcm9qICYmICFwcm9qLl9hZmZpbmUgPyBwcm9qLndvcmxkLmNvcHlUbyh0ZW1wTWF0KSA6IHRlbXBNYXQuY29weUZyb20oc3ByaXRlLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gc3ByaXRlLnRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgbWFwcGVkTWF0cml4LnNldCh0ZXh0dXJlU2l6ZS53aWR0aCwgMCwgMCwgdGV4dHVyZVNpemUuaGVpZ2h0LCBmaWx0ZXJBcmVhLngsIGZpbHRlckFyZWEueSk7XHJcbiAgICAgICAgICAgIHdvcmxkVHJhbnNmb3JtLmludmVydCgpO1xyXG4gICAgICAgICAgICBtYXBwZWRNYXRyaXguc2V0VG9NdWx0MmQod29ybGRUcmFuc2Zvcm0sIG1hcHBlZE1hdHJpeCk7XHJcbiAgICAgICAgICAgIG1hcHBlZE1hdHJpeC5zY2FsZUFuZFRyYW5zbGF0ZSgxLjAgLyB0ZXh0dXJlLndpZHRoLCAxLjAgLyB0ZXh0dXJlLmhlaWdodCwgc3ByaXRlLmFuY2hvci54LCBzcHJpdGUuYW5jaG9yLnkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbWFwcGVkTWF0cml4O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZU1hc2tGaWx0ZXIyZDtcclxuICAgIH0oUElYSS5GaWx0ZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TcHJpdGVNYXNrRmlsdGVyMmQgPSBTcHJpdGVNYXNrRmlsdGVyMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS1wcm9qZWN0aW9uLmpzLm1hcCIsIi8qIVxuICogcGl4aS1zb3VuZCAtIHYyLjAuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL3BpeGlqcy9waXhpLXNvdW5kXG4gKiBDb21waWxlZCBUdWUsIDE0IE5vdiAyMDE3IDE3OjUzOjQ3IFVUQ1xuICpcbiAqIHBpeGktc291bmQgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpU291bmQ9ZS5fX3BpeGlTb3VuZHx8e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHQoZSx0KXtmdW5jdGlvbiBuKCl7dGhpcy5jb25zdHJ1Y3Rvcj1lfW8oZSx0KSxlLnByb3RvdHlwZT1udWxsPT09dD9PYmplY3QuY3JlYXRlKHQpOihuLnByb3RvdHlwZT10LnByb3RvdHlwZSxuZXcgbil9aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFBJWEkpdGhyb3dcIlBpeGlKUyByZXF1aXJlZFwiO3ZhciBuPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMuX291dHB1dD10LHRoaXMuX2lucHV0PWV9cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImRlc3RpbmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pbnB1dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcztpZih0aGlzLl9maWx0ZXJzJiYodGhpcy5fZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UmJmUuZGlzY29ubmVjdCgpfSksdGhpcy5fZmlsdGVycz1udWxsLHRoaXMuX2lucHV0LmNvbm5lY3QodGhpcy5fb3V0cHV0KSksZSYmZS5sZW5ndGgpe3RoaXMuX2ZpbHRlcnM9ZS5zbGljZSgwKSx0aGlzLl9pbnB1dC5kaXNjb25uZWN0KCk7dmFyIG49bnVsbDtlLmZvckVhY2goZnVuY3Rpb24oZSl7bnVsbD09PW4/dC5faW5wdXQuY29ubmVjdChlLmRlc3RpbmF0aW9uKTpuLmNvbm5lY3QoZS5kZXN0aW5hdGlvbiksbj1lfSksbi5jb25uZWN0KHRoaXMuX291dHB1dCl9fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmZpbHRlcnM9bnVsbCx0aGlzLl9pbnB1dD1udWxsLHRoaXMuX291dHB1dD1udWxsfSxlfSgpLG89T2JqZWN0LnNldFByb3RvdHlwZU9mfHx7X19wcm90b19fOltdfWluc3RhbmNlb2YgQXJyYXkmJmZ1bmN0aW9uKGUsdCl7ZS5fX3Byb3RvX189dH18fGZ1bmN0aW9uKGUsdCl7Zm9yKHZhciBuIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShuKSYmKGVbbl09dFtuXSl9LGk9MCxyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dmFyIG49ZS5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiBuLmlkPWkrKyxuLmluaXQodCksbn1yZXR1cm4gdChuLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInByb2dyZXNzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2UuY3VycmVudFRpbWUvdGhpcy5fZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYXVzZWQ9ZSx0aGlzLnJlZnJlc2hQYXVzZWQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5fb25QbGF5PWZ1bmN0aW9uKCl7dGhpcy5fcGxheWluZz0hMH0sbi5wcm90b3R5cGUuX29uUGF1c2U9ZnVuY3Rpb24oKXt0aGlzLl9wbGF5aW5nPSExfSxuLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMuX3BsYXlpbmc9ITEsdGhpcy5fZHVyYXRpb249ZS5zb3VyY2UuZHVyYXRpb247dmFyIHQ9dGhpcy5fc291cmNlPWUuc291cmNlLmNsb25lTm9kZSghMSk7dC5zcmM9ZS5wYXJlbnQudXJsLHQub25wbGF5PXRoaXMuX29uUGxheS5iaW5kKHRoaXMpLHQub25wYXVzZT10aGlzLl9vblBhdXNlLmJpbmQodGhpcyksZS5jb250ZXh0Lm9uKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSxlLmNvbnRleHQub24oXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpLHRoaXMuX21lZGlhPWV9LG4ucHJvdG90eXBlLl9pbnRlcm5hbFN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJnRoaXMuX3BsYXlpbmcmJih0aGlzLl9zb3VyY2Uub25lbmRlZD1udWxsLHRoaXMuX3NvdXJjZS5wYXVzZSgpKX0sbi5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe3RoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuX3NvdXJjZSYmdGhpcy5lbWl0KFwic3RvcFwiKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic3BlZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc3BlZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJ2b2x1bWVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3ZvbHVtZT1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImxvb3BcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xvb3B9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9sb29wPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibXV0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX211dGVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbXV0ZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudDt0aGlzLl9zb3VyY2UubG9vcD10aGlzLl9sb29wfHx0Lmxvb3A7dmFyIG49ZS52b2x1bWUqKGUubXV0ZWQ/MDoxKSxvPXQudm9sdW1lKih0Lm11dGVkPzA6MSksaT10aGlzLl92b2x1bWUqKHRoaXMuX211dGVkPzA6MSk7dGhpcy5fc291cmNlLnZvbHVtZT1pKm4qbyx0aGlzLl9zb3VyY2UucGxheWJhY2tSYXRlPXRoaXMuX3NwZWVkKmUuc3BlZWQqdC5zcGVlZH0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQsbj10aGlzLl9wYXVzZWR8fHQucGF1c2VkfHxlLnBhdXNlZDtuIT09dGhpcy5fcGF1c2VkUmVhbCYmKHRoaXMuX3BhdXNlZFJlYWw9bixuPyh0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJwYXVzZWRcIikpOih0aGlzLmVtaXQoXCJyZXN1bWVkXCIpLHRoaXMucGxheSh7c3RhcnQ6dGhpcy5fc291cmNlLmN1cnJlbnRUaW1lLGVuZDp0aGlzLl9lbmQsdm9sdW1lOnRoaXMuX3ZvbHVtZSxzcGVlZDp0aGlzLl9zcGVlZCxsb29wOnRoaXMuX2xvb3B9KSksdGhpcy5lbWl0KFwicGF1c2VcIixuKSl9LG4ucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxvPWUuc3RhcnQsaT1lLmVuZCxyPWUuc3BlZWQscz1lLmxvb3AsdT1lLnZvbHVtZSxhPWUubXV0ZWQ7aSYmY29uc29sZS5hc3NlcnQoaT5vLFwiRW5kIHRpbWUgaXMgYmVmb3JlIHN0YXJ0IHRpbWVcIiksdGhpcy5fc3BlZWQ9cix0aGlzLl92b2x1bWU9dSx0aGlzLl9sb29wPSEhcyx0aGlzLl9tdXRlZD1hLHRoaXMucmVmcmVzaCgpLHRoaXMubG9vcCYmbnVsbCE9PWkmJihjb25zb2xlLndhcm4oJ0xvb3Bpbmcgbm90IHN1cHBvcnQgd2hlbiBzcGVjaWZ5aW5nIGFuIFwiZW5kXCIgdGltZScpLHRoaXMubG9vcD0hMSksdGhpcy5fc3RhcnQ9byx0aGlzLl9lbmQ9aXx8dGhpcy5fZHVyYXRpb24sdGhpcy5fc3RhcnQ9TWF0aC5tYXgoMCx0aGlzLl9zdGFydC1uLlBBRERJTkcpLHRoaXMuX2VuZD1NYXRoLm1pbih0aGlzLl9lbmQrbi5QQURESU5HLHRoaXMuX2R1cmF0aW9uKSx0aGlzLl9zb3VyY2Uub25sb2FkZWRtZXRhZGF0YT1mdW5jdGlvbigpe3QuX3NvdXJjZSYmKHQuX3NvdXJjZS5jdXJyZW50VGltZT1vLHQuX3NvdXJjZS5vbmxvYWRlZG1ldGFkYXRhPW51bGwsdC5lbWl0KFwicHJvZ3Jlc3NcIixvLHQuX2R1cmF0aW9uKSxQSVhJLnRpY2tlci5zaGFyZWQuYWRkKHQuX29uVXBkYXRlLHQpKX0sdGhpcy5fc291cmNlLm9uZW5kZWQ9dGhpcy5fb25Db21wbGV0ZS5iaW5kKHRoaXMpLHRoaXMuX3NvdXJjZS5wbGF5KCksdGhpcy5lbWl0KFwic3RhcnRcIil9LG4ucHJvdG90eXBlLl9vblVwZGF0ZT1mdW5jdGlvbigpe3RoaXMuZW1pdChcInByb2dyZXNzXCIsdGhpcy5wcm9ncmVzcyx0aGlzLl9kdXJhdGlvbiksdGhpcy5fc291cmNlLmN1cnJlbnRUaW1lPj10aGlzLl9lbmQmJiF0aGlzLl9zb3VyY2UubG9vcCYmdGhpcy5fb25Db21wbGV0ZSgpfSxuLnByb3RvdHlwZS5fb25Db21wbGV0ZT1mdW5jdGlvbigpe1BJWEkudGlja2VyLnNoYXJlZC5yZW1vdmUodGhpcy5fb25VcGRhdGUsdGhpcyksdGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwicHJvZ3Jlc3NcIiwxLHRoaXMuX2R1cmF0aW9uKSx0aGlzLmVtaXQoXCJlbmRcIix0aGlzKX0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe1BJWEkudGlja2VyLnNoYXJlZC5yZW1vdmUodGhpcy5fb25VcGRhdGUsdGhpcyksdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTt2YXIgZT10aGlzLl9zb3VyY2U7ZSYmKGUub25lbmRlZD1udWxsLGUub25wbGF5PW51bGwsZS5vbnBhdXNlPW51bGwsdGhpcy5faW50ZXJuYWxTdG9wKCkpLHRoaXMuX3NvdXJjZT1udWxsLHRoaXMuX3NwZWVkPTEsdGhpcy5fdm9sdW1lPTEsdGhpcy5fbG9vcD0hMSx0aGlzLl9lbmQ9bnVsbCx0aGlzLl9zdGFydD0wLHRoaXMuX2R1cmF0aW9uPTAsdGhpcy5fcGxheWluZz0hMSx0aGlzLl9wYXVzZWRSZWFsPSExLHRoaXMuX3BhdXNlZD0hMSx0aGlzLl9tdXRlZD0hMSx0aGlzLl9tZWRpYSYmKHRoaXMuX21lZGlhLmNvbnRleHQub2ZmKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSx0aGlzLl9tZWRpYS5jb250ZXh0Lm9mZihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyksdGhpcy5fbWVkaWE9bnVsbCl9LG4ucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJbSFRNTEF1ZGlvSW5zdGFuY2UgaWQ9XCIrdGhpcy5pZCtcIl1cIn0sbi5QQURESU5HPS4xLG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSxzPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXtyZXR1cm4gbnVsbCE9PWUmJmUuYXBwbHkodGhpcyxhcmd1bWVudHMpfHx0aGlzfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLnBhcmVudD1lLHRoaXMuX3NvdXJjZT1lLm9wdGlvbnMuc291cmNlfHxuZXcgQXVkaW8sZS51cmwmJih0aGlzLl9zb3VyY2Uuc3JjPWUudXJsKX0sbi5wcm90b3R5cGUuY3JlYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyByKHRoaXMpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJpc1BsYXlhYmxlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiEhdGhpcy5fc291cmNlJiY0PT09dGhpcy5fc291cmNlLnJlYWR5U3RhdGV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZHVyYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZS5kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhcmVudC5jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LHNldDpmdW5jdGlvbihlKXtjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgZmlsdGVyc1wiKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLnBhcmVudD1udWxsLHRoaXMuX3NvdXJjZSYmKHRoaXMuX3NvdXJjZS5zcmM9XCJcIix0aGlzLl9zb3VyY2UubG9hZCgpLHRoaXMuX3NvdXJjZT1udWxsKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic291cmNlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2V9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihlKXt2YXIgdD10aGlzLl9zb3VyY2Usbj10aGlzLnBhcmVudDtpZig0PT09dC5yZWFkeVN0YXRlKXtuLmlzTG9hZGVkPSEwO3ZhciBvPW4uYXV0b1BsYXlTdGFydCgpO3JldHVybiB2b2lkKGUmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKG51bGwsbixvKX0sMCkpfWlmKCFuLnVybClyZXR1cm4gZShuZXcgRXJyb3IoXCJzb3VuZC51cmwgb3Igc291bmQuc291cmNlIG11c3QgYmUgc2V0XCIpKTt0LnNyYz1uLnVybDt2YXIgaT1mdW5jdGlvbigpe3QucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNhbnBsYXl0aHJvdWdoXCIsciksdC5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLHIpLHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIscyksdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIix1KX0scj1mdW5jdGlvbigpe2koKSxuLmlzTG9hZGVkPSEwO3ZhciB0PW4uYXV0b1BsYXlTdGFydCgpO2UmJmUobnVsbCxuLHQpfSxzPWZ1bmN0aW9uKCl7aSgpLGUmJmUobmV3IEVycm9yKFwiU291bmQgbG9hZGluZyBoYXMgYmVlbiBhYm9ydGVkXCIpKX0sdT1mdW5jdGlvbigpe2koKTt2YXIgbj1cIkZhaWxlZCB0byBsb2FkIGF1ZGlvIGVsZW1lbnQgKGNvZGU6IFwiK3QuZXJyb3IuY29kZStcIilcIjtlP2UobmV3IEVycm9yKG4pKTpjb25zb2xlLmVycm9yKG4pfTt0LmFkZEV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5dGhyb3VnaFwiLHIsITEpLHQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixyLCExKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLHMsITEpLHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsdSwhMSksdC5sb2FkKCl9LG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSx1PVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6e30sYT1mdW5jdGlvbihlLHQpe3JldHVybiB0PXtleHBvcnRzOnt9fSxlKHQsdC5leHBvcnRzKSx0LmV4cG9ydHN9KGZ1bmN0aW9uKGUpeyFmdW5jdGlvbih0KXtmdW5jdGlvbiBuKCl7fWZ1bmN0aW9uIG8oZSx0KXtyZXR1cm4gZnVuY3Rpb24oKXtlLmFwcGx5KHQsYXJndW1lbnRzKX19ZnVuY3Rpb24gaShlKXtpZihcIm9iamVjdFwiIT10eXBlb2YgdGhpcyl0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3XCIpO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBhIGZ1bmN0aW9uXCIpO3RoaXMuX3N0YXRlPTAsdGhpcy5faGFuZGxlZD0hMSx0aGlzLl92YWx1ZT12b2lkIDAsdGhpcy5fZGVmZXJyZWRzPVtdLGwoZSx0aGlzKX1mdW5jdGlvbiByKGUsdCl7Zm9yKDszPT09ZS5fc3RhdGU7KWU9ZS5fdmFsdWU7aWYoMD09PWUuX3N0YXRlKXJldHVybiB2b2lkIGUuX2RlZmVycmVkcy5wdXNoKHQpO2UuX2hhbmRsZWQ9ITAsaS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKXt2YXIgbj0xPT09ZS5fc3RhdGU/dC5vbkZ1bGZpbGxlZDp0Lm9uUmVqZWN0ZWQ7aWYobnVsbD09PW4pcmV0dXJuIHZvaWQoMT09PWUuX3N0YXRlP3M6dSkodC5wcm9taXNlLGUuX3ZhbHVlKTt2YXIgbzt0cnl7bz1uKGUuX3ZhbHVlKX1jYXRjaChlKXtyZXR1cm4gdm9pZCB1KHQucHJvbWlzZSxlKX1zKHQucHJvbWlzZSxvKX0pfWZ1bmN0aW9uIHMoZSx0KXt0cnl7aWYodD09PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkEgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuXCIpO2lmKHQmJihcIm9iamVjdFwiPT10eXBlb2YgdHx8XCJmdW5jdGlvblwiPT10eXBlb2YgdCkpe3ZhciBuPXQudGhlbjtpZih0IGluc3RhbmNlb2YgaSlyZXR1cm4gZS5fc3RhdGU9MyxlLl92YWx1ZT10LHZvaWQgYShlKTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBuKXJldHVybiB2b2lkIGwobyhuLHQpLGUpfWUuX3N0YXRlPTEsZS5fdmFsdWU9dCxhKGUpfWNhdGNoKHQpe3UoZSx0KX19ZnVuY3Rpb24gdShlLHQpe2UuX3N0YXRlPTIsZS5fdmFsdWU9dCxhKGUpfWZ1bmN0aW9uIGEoZSl7Mj09PWUuX3N0YXRlJiYwPT09ZS5fZGVmZXJyZWRzLmxlbmd0aCYmaS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKXtlLl9oYW5kbGVkfHxpLl91bmhhbmRsZWRSZWplY3Rpb25GbihlLl92YWx1ZSl9KTtmb3IodmFyIHQ9MCxuPWUuX2RlZmVycmVkcy5sZW5ndGg7dDxuO3QrKylyKGUsZS5fZGVmZXJyZWRzW3RdKTtlLl9kZWZlcnJlZHM9bnVsbH1mdW5jdGlvbiBjKGUsdCxuKXt0aGlzLm9uRnVsZmlsbGVkPVwiZnVuY3Rpb25cIj09dHlwZW9mIGU/ZTpudWxsLHRoaXMub25SZWplY3RlZD1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Q6bnVsbCx0aGlzLnByb21pc2U9bn1mdW5jdGlvbiBsKGUsdCl7dmFyIG49ITE7dHJ5e2UoZnVuY3Rpb24oZSl7bnx8KG49ITAscyh0LGUpKX0sZnVuY3Rpb24oZSl7bnx8KG49ITAsdSh0LGUpKX0pfWNhdGNoKGUpe2lmKG4pcmV0dXJuO249ITAsdSh0LGUpfX12YXIgcD1zZXRUaW1lb3V0O2kucHJvdG90eXBlLmNhdGNoPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnRoZW4obnVsbCxlKX0saS5wcm90b3R5cGUudGhlbj1mdW5jdGlvbihlLHQpe3ZhciBvPW5ldyB0aGlzLmNvbnN0cnVjdG9yKG4pO3JldHVybiByKHRoaXMsbmV3IGMoZSx0LG8pKSxvfSxpLmFsbD1mdW5jdGlvbihlKXt2YXIgdD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlKTtyZXR1cm4gbmV3IGkoZnVuY3Rpb24oZSxuKXtmdW5jdGlvbiBvKHIscyl7dHJ5e2lmKHMmJihcIm9iamVjdFwiPT10eXBlb2Ygc3x8XCJmdW5jdGlvblwiPT10eXBlb2Ygcykpe3ZhciB1PXMudGhlbjtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiB1KXJldHVybiB2b2lkIHUuY2FsbChzLGZ1bmN0aW9uKGUpe28ocixlKX0sbil9dFtyXT1zLDA9PS0taSYmZSh0KX1jYXRjaChlKXtuKGUpfX1pZigwPT09dC5sZW5ndGgpcmV0dXJuIGUoW10pO2Zvcih2YXIgaT10Lmxlbmd0aCxyPTA7cjx0Lmxlbmd0aDtyKyspbyhyLHRbcl0pfSl9LGkucmVzb2x2ZT1mdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJvYmplY3RcIj09dHlwZW9mIGUmJmUuY29uc3RydWN0b3I9PT1pP2U6bmV3IGkoZnVuY3Rpb24odCl7dChlKX0pfSxpLnJlamVjdD1mdW5jdGlvbihlKXtyZXR1cm4gbmV3IGkoZnVuY3Rpb24odCxuKXtuKGUpfSl9LGkucmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gbmV3IGkoZnVuY3Rpb24odCxuKXtmb3IodmFyIG89MCxpPWUubGVuZ3RoO288aTtvKyspZVtvXS50aGVuKHQsbil9KX0saS5faW1tZWRpYXRlRm49XCJmdW5jdGlvblwiPT10eXBlb2Ygc2V0SW1tZWRpYXRlJiZmdW5jdGlvbihlKXtzZXRJbW1lZGlhdGUoZSl9fHxmdW5jdGlvbihlKXtwKGUsMCl9LGkuX3VuaGFuZGxlZFJlamVjdGlvbkZuPWZ1bmN0aW9uKGUpe1widW5kZWZpbmVkXCIhPXR5cGVvZiBjb25zb2xlJiZjb25zb2xlJiZjb25zb2xlLndhcm4oXCJQb3NzaWJsZSBVbmhhbmRsZWQgUHJvbWlzZSBSZWplY3Rpb246XCIsZSl9LGkuX3NldEltbWVkaWF0ZUZuPWZ1bmN0aW9uKGUpe2kuX2ltbWVkaWF0ZUZuPWV9LGkuX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuPWZ1bmN0aW9uKGUpe2kuX3VuaGFuZGxlZFJlamVjdGlvbkZuPWV9LGUuZXhwb3J0cz9lLmV4cG9ydHM9aTp0LlByb21pc2V8fCh0LlByb21pc2U9aSl9KHUpfSksYz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLmRlc3RpbmF0aW9uPWUsdGhpcy5zb3VyY2U9dHx8ZX1yZXR1cm4gZS5wcm90b3R5cGUuY29ubmVjdD1mdW5jdGlvbihlKXt0aGlzLnNvdXJjZS5jb25uZWN0KGUpfSxlLnByb3RvdHlwZS5kaXNjb25uZWN0PWZ1bmN0aW9uKCl7dGhpcy5zb3VyY2UuZGlzY29ubmVjdCgpfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5kaXNjb25uZWN0KCksdGhpcy5kZXN0aW5hdGlvbj1udWxsLHRoaXMuc291cmNlPW51bGx9LGV9KCksbD1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUuc2V0UGFyYW1WYWx1ZT1mdW5jdGlvbihlLHQpe2lmKGUuc2V0VmFsdWVBdFRpbWUpe3ZhciBuPVMuaW5zdGFuY2UuY29udGV4dDtlLnNldFZhbHVlQXRUaW1lKHQsbi5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUpfWVsc2UgZS52YWx1ZT10O3JldHVybiB0fSxlfSgpLHA9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG8saSxyLHMsdSxhLGMscCxoKXt2b2lkIDA9PT10JiYodD0wKSx2b2lkIDA9PT1vJiYobz0wKSx2b2lkIDA9PT1pJiYoaT0wKSx2b2lkIDA9PT1yJiYocj0wKSx2b2lkIDA9PT1zJiYocz0wKSx2b2lkIDA9PT11JiYodT0wKSx2b2lkIDA9PT1hJiYoYT0wKSx2b2lkIDA9PT1jJiYoYz0wKSx2b2lkIDA9PT1wJiYocD0wKSx2b2lkIDA9PT1oJiYoaD0wKTt2YXIgZD10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKGQ9ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBmPVt7ZjpuLkYzMix0eXBlOlwibG93c2hlbGZcIixnYWluOnR9LHtmOm4uRjY0LHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpvfSx7ZjpuLkYxMjUsdHlwZTpcInBlYWtpbmdcIixnYWluOml9LHtmOm4uRjI1MCx0eXBlOlwicGVha2luZ1wiLGdhaW46cn0se2Y6bi5GNTAwLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpzfSx7ZjpuLkYxSyx0eXBlOlwicGVha2luZ1wiLGdhaW46dX0se2Y6bi5GMkssdHlwZTpcInBlYWtpbmdcIixnYWluOmF9LHtmOm4uRjRLLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpjfSx7ZjpuLkY4Syx0eXBlOlwicGVha2luZ1wiLGdhaW46cH0se2Y6bi5GMTZLLHR5cGU6XCJoaWdoc2hlbGZcIixnYWluOmh9XS5tYXAoZnVuY3Rpb24oZSl7dmFyIHQ9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtyZXR1cm4gdC50eXBlPWUudHlwZSxsLnNldFBhcmFtVmFsdWUodC5nYWluLGUuZ2FpbiksbC5zZXRQYXJhbVZhbHVlKHQuUSwxKSxsLnNldFBhcmFtVmFsdWUodC5mcmVxdWVuY3ksZS5mKSx0fSk7KGQ9ZS5jYWxsKHRoaXMsZlswXSxmW2YubGVuZ3RoLTFdKXx8dGhpcykuYmFuZHM9ZixkLmJhbmRzTWFwPXt9O2Zvcih2YXIgXz0wO188ZC5iYW5kcy5sZW5ndGg7XysrKXt2YXIgeT1kLmJhbmRzW19dO18+MCYmZC5iYW5kc1tfLTFdLmNvbm5lY3QoeSksZC5iYW5kc01hcFt5LmZyZXF1ZW5jeS52YWx1ZV09eX1yZXR1cm4gZH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLnNldEdhaW49ZnVuY3Rpb24oZSx0KXtpZih2b2lkIDA9PT10JiYodD0wKSwhdGhpcy5iYW5kc01hcFtlXSl0aHJvd1wiTm8gYmFuZCBmb3VuZCBmb3IgZnJlcXVlbmN5IFwiK2U7bC5zZXRQYXJhbVZhbHVlKHRoaXMuYmFuZHNNYXBbZV0uZ2Fpbix0KX0sbi5wcm90b3R5cGUuZ2V0R2Fpbj1mdW5jdGlvbihlKXtpZighdGhpcy5iYW5kc01hcFtlXSl0aHJvd1wiTm8gYmFuZCBmb3VuZCBmb3IgZnJlcXVlbmN5IFwiK2U7cmV0dXJuIHRoaXMuYmFuZHNNYXBbZV0uZ2Fpbi52YWx1ZX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjMyXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMzIpfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjMyLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY2NFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjY0KX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY2NCxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMTI1XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMTI1KX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYxMjUsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjI1MFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjI1MCl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMjUwLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY1MDBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY1MDApfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjUwMCxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMWtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYxSyl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMUssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjJrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMkspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjJLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY0a1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjRLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY0SyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmOGtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY4Syl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GOEssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjE2a1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjE2Syl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMTZLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlc2V0PWZ1bmN0aW9uKCl7dGhpcy5iYW5kcy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2wuc2V0UGFyYW1WYWx1ZShlLmdhaW4sMCl9KX0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuYmFuZHMuZm9yRWFjaChmdW5jdGlvbihlKXtlLmRpc2Nvbm5lY3QoKX0pLHRoaXMuYmFuZHM9bnVsbCx0aGlzLmJhbmRzTWFwPW51bGx9LG4uRjMyPTMyLG4uRjY0PTY0LG4uRjEyNT0xMjUsbi5GMjUwPTI1MCxuLkY1MDA9NTAwLG4uRjFLPTFlMyxuLkYySz0yZTMsbi5GNEs9NGUzLG4uRjhLPThlMyxuLkYxNks9MTZlMyxufShjKSxoPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dm9pZCAwPT09dCYmKHQ9MCk7dmFyIG49dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChuPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgbz1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZVdhdmVTaGFwZXIoKTtyZXR1cm4gbj1lLmNhbGwodGhpcyxvKXx8dGhpcyxuLl9kaXN0b3J0aW9uPW8sbi5hbW91bnQ9dCxufXJldHVybiB0KG4sZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiYW1vdW50XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hbW91bnR9LHNldDpmdW5jdGlvbihlKXtlKj0xZTMsdGhpcy5fYW1vdW50PWU7Zm9yKHZhciB0LG49bmV3IEZsb2F0MzJBcnJheSg0NDEwMCksbz1NYXRoLlBJLzE4MCxpPTA7aTw0NDEwMDsrK2kpdD0yKmkvNDQxMDAtMSxuW2ldPSgzK2UpKnQqMjAqby8oTWF0aC5QSStlKk1hdGguYWJzKHQpKTt0aGlzLl9kaXN0b3J0aW9uLmN1cnZlPW4sdGhpcy5fZGlzdG9ydGlvbi5vdmVyc2FtcGxlPVwiNHhcIn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fZGlzdG9ydGlvbj1udWxsLGUucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKX0sbn0oYyksZD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZvaWQgMD09PXQmJih0PTApO3ZhciBuPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQobj1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIG8saSxyLHM9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dDtyZXR1cm4gcy5jcmVhdGVTdGVyZW9QYW5uZXI/cj1vPXMuY3JlYXRlU3RlcmVvUGFubmVyKCk6KChpPXMuY3JlYXRlUGFubmVyKCkpLnBhbm5pbmdNb2RlbD1cImVxdWFscG93ZXJcIixyPWkpLG49ZS5jYWxsKHRoaXMscil8fHRoaXMsbi5fc3RlcmVvPW8sbi5fcGFubmVyPWksbi5wYW49dCxufXJldHVybiB0KG4sZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGFuXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYW59LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYW49ZSx0aGlzLl9zdGVyZW8/bC5zZXRQYXJhbVZhbHVlKHRoaXMuX3N0ZXJlby5wYW4sZSk6dGhpcy5fcGFubmVyLnNldFBvc2l0aW9uKGUsMCwxLU1hdGguYWJzKGUpKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7ZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpLHRoaXMuX3N0ZXJlbz1udWxsLHRoaXMuX3Bhbm5lcj1udWxsfSxufShjKSxmPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxuLG8pe3ZvaWQgMD09PXQmJih0PTMpLHZvaWQgMD09PW4mJihuPTIpLHZvaWQgMD09PW8mJihvPSExKTt2YXIgaT10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKGk9ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciByPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQ29udm9sdmVyKCk7cmV0dXJuIGk9ZS5jYWxsKHRoaXMscil8fHRoaXMsaS5fY29udm9sdmVyPXIsaS5fc2Vjb25kcz1pLl9jbGFtcCh0LDEsNTApLGkuX2RlY2F5PWkuX2NsYW1wKG4sMCwxMDApLGkuX3JldmVyc2U9byxpLl9yZWJ1aWxkKCksaX1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLl9jbGFtcD1mdW5jdGlvbihlLHQsbil7cmV0dXJuIE1hdGgubWluKG4sTWF0aC5tYXgodCxlKSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNlY29uZHNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NlY29uZHN9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zZWNvbmRzPXRoaXMuX2NsYW1wKGUsMSw1MCksdGhpcy5fcmVidWlsZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImRlY2F5XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9kZWNheX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2RlY2F5PXRoaXMuX2NsYW1wKGUsMCwxMDApLHRoaXMuX3JlYnVpbGQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJyZXZlcnNlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZXZlcnNlfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcmV2ZXJzZT1lLHRoaXMuX3JlYnVpbGQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5fcmVidWlsZD1mdW5jdGlvbigpe2Zvcih2YXIgZSx0PVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQsbj10LnNhbXBsZVJhdGUsbz1uKnRoaXMuX3NlY29uZHMsaT10LmNyZWF0ZUJ1ZmZlcigyLG8sbikscj1pLmdldENoYW5uZWxEYXRhKDApLHM9aS5nZXRDaGFubmVsRGF0YSgxKSx1PTA7dTxvO3UrKyllPXRoaXMuX3JldmVyc2U/by11OnUsclt1XT0oMipNYXRoLnJhbmRvbSgpLTEpKk1hdGgucG93KDEtZS9vLHRoaXMuX2RlY2F5KSxzW3VdPSgyKk1hdGgucmFuZG9tKCktMSkqTWF0aC5wb3coMS1lL28sdGhpcy5fZGVjYXkpO3RoaXMuX2NvbnZvbHZlci5idWZmZXI9aX0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX2NvbnZvbHZlcj1udWxsLGUucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKX0sbn0oYyksXz1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7dmFyIHQ9dGhpcztTLmluc3RhbmNlLnVzZUxlZ2FjeSYmKHQ9ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBuPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQsbz1uLmNyZWF0ZUNoYW5uZWxTcGxpdHRlcigpLGk9bi5jcmVhdGVDaGFubmVsTWVyZ2VyKCk7cmV0dXJuIGkuY29ubmVjdChvKSx0PWUuY2FsbCh0aGlzLGksbyl8fHRoaXMsdC5fbWVyZ2VyPWksdH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9tZXJnZXIuZGlzY29ubmVjdCgpLHRoaXMuX21lcmdlcj1udWxsLGUucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKX0sbn0oYykseT1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQoZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciB0PVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQsbj10LmNyZWF0ZUJpcXVhZEZpbHRlcigpLG89dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxpPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCkscj10LmNyZWF0ZUJpcXVhZEZpbHRlcigpO3JldHVybiBuLnR5cGU9XCJsb3dwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKG4uZnJlcXVlbmN5LDJlMyksby50eXBlPVwibG93cGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShvLmZyZXF1ZW5jeSwyZTMpLGkudHlwZT1cImhpZ2hwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKGkuZnJlcXVlbmN5LDUwMCksci50eXBlPVwiaGlnaHBhc3NcIixsLnNldFBhcmFtVmFsdWUoci5mcmVxdWVuY3ksNTAwKSxuLmNvbm5lY3Qobyksby5jb25uZWN0KGkpLGkuY29ubmVjdChyKSxlLmNhbGwodGhpcyxuLHIpfHx0aGlzfXJldHVybiB0KG4sZSksbn0oYyksbT1PYmplY3QuZnJlZXplKHtGaWx0ZXI6YyxFcXVhbGl6ZXJGaWx0ZXI6cCxEaXN0b3J0aW9uRmlsdGVyOmgsU3RlcmVvRmlsdGVyOmQsUmV2ZXJiRmlsdGVyOmYsTW9ub0ZpbHRlcjpfLFRlbGVwaG9uZUZpbHRlcjp5fSksYj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7dmFyIHQ9ZS5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiB0LnNwZWVkPTEsdC52b2x1bWU9MSx0Lm11dGVkPSExLHQucGF1c2VkPSExLHR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwicmVmcmVzaFwiKX0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3RoaXMuZW1pdChcInJlZnJlc2hQYXVzZWRcIil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBmaWx0ZXJzXCIpLG51bGx9LHNldDpmdW5jdGlvbihlKXtjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgZmlsdGVyc1wiKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJhdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBhdWRpb0NvbnRleHRcIiksbnVsbH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS50b2dnbGVNdXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubXV0ZWQ9IXRoaXMubXV0ZWQsdGhpcy5yZWZyZXNoKCksdGhpcy5tdXRlZH0sbi5wcm90b3R5cGUudG9nZ2xlUGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXVzZWQ9IXRoaXMucGF1c2VkLHRoaXMucmVmcmVzaFBhdXNlZCgpLHRoaXMucGF1c2VkfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKX0sbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLGc9T2JqZWN0LmZyZWV6ZSh7SFRNTEF1ZGlvTWVkaWE6cyxIVE1MQXVkaW9JbnN0YW5jZTpyLEhUTUxBdWRpb0NvbnRleHQ6Yn0pLHY9MCxQPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dmFyIG49ZS5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiBuLmlkPXYrKyxuLl9tZWRpYT1udWxsLG4uX3BhdXNlZD0hMSxuLl9tdXRlZD0hMSxuLl9lbGFwc2VkPTAsbi5fdXBkYXRlTGlzdGVuZXI9bi5fdXBkYXRlLmJpbmQobiksbi5pbml0KHQpLG59cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiYodGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwic3RvcFwiKSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNwZWVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NwZWVkPWUsdGhpcy5yZWZyZXNoKCksdGhpcy5fdXBkYXRlKCEwKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJ2b2x1bWVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3ZvbHVtZT1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIm11dGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tdXRlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX211dGVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibG9vcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbG9vcH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2xvb3A9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudDt0aGlzLl9zb3VyY2UubG9vcD10aGlzLl9sb29wfHx0Lmxvb3A7dmFyIG49ZS52b2x1bWUqKGUubXV0ZWQ/MDoxKSxvPXQudm9sdW1lKih0Lm11dGVkPzA6MSksaT10aGlzLl92b2x1bWUqKHRoaXMuX211dGVkPzA6MSk7bC5zZXRQYXJhbVZhbHVlKHRoaXMuX2dhaW4uZ2FpbixpKm8qbiksbC5zZXRQYXJhbVZhbHVlKHRoaXMuX3NvdXJjZS5wbGF5YmFja1JhdGUsdGhpcy5fc3BlZWQqdC5zcGVlZCplLnNwZWVkKX0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQsbj10aGlzLl9wYXVzZWR8fHQucGF1c2VkfHxlLnBhdXNlZDtuIT09dGhpcy5fcGF1c2VkUmVhbCYmKHRoaXMuX3BhdXNlZFJlYWw9bixuPyh0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJwYXVzZWRcIikpOih0aGlzLmVtaXQoXCJyZXN1bWVkXCIpLHRoaXMucGxheSh7c3RhcnQ6dGhpcy5fZWxhcHNlZCV0aGlzLl9kdXJhdGlvbixlbmQ6dGhpcy5fZW5kLHNwZWVkOnRoaXMuX3NwZWVkLGxvb3A6dGhpcy5fbG9vcCx2b2x1bWU6dGhpcy5fdm9sdW1lfSkpLHRoaXMuZW1pdChcInBhdXNlXCIsbikpfSxuLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUpe3ZhciB0PWUuc3RhcnQsbj1lLmVuZCxvPWUuc3BlZWQsaT1lLmxvb3Ascj1lLnZvbHVtZSxzPWUubXV0ZWQ7biYmY29uc29sZS5hc3NlcnQobj50LFwiRW5kIHRpbWUgaXMgYmVmb3JlIHN0YXJ0IHRpbWVcIiksdGhpcy5fcGF1c2VkPSExO3ZhciB1PXRoaXMuX21lZGlhLm5vZGVzLmNsb25lQnVmZmVyU291cmNlKCksYT11LnNvdXJjZSxjPXUuZ2Fpbjt0aGlzLl9zb3VyY2U9YSx0aGlzLl9nYWluPWMsdGhpcy5fc3BlZWQ9byx0aGlzLl92b2x1bWU9cix0aGlzLl9sb29wPSEhaSx0aGlzLl9tdXRlZD1zLHRoaXMucmVmcmVzaCgpLHRoaXMubG9vcCYmbnVsbCE9PW4mJihjb25zb2xlLndhcm4oJ0xvb3Bpbmcgbm90IHN1cHBvcnQgd2hlbiBzcGVjaWZ5aW5nIGFuIFwiZW5kXCIgdGltZScpLHRoaXMubG9vcD0hMSksdGhpcy5fZW5kPW47dmFyIGw9dGhpcy5fc291cmNlLmJ1ZmZlci5kdXJhdGlvbjt0aGlzLl9kdXJhdGlvbj1sLHRoaXMuX2xhc3RVcGRhdGU9dGhpcy5fbm93KCksdGhpcy5fZWxhcHNlZD10LHRoaXMuX3NvdXJjZS5vbmVuZGVkPXRoaXMuX29uQ29tcGxldGUuYmluZCh0aGlzKSxuP3RoaXMuX3NvdXJjZS5zdGFydCgwLHQsbi10KTp0aGlzLl9zb3VyY2Uuc3RhcnQoMCx0KSx0aGlzLmVtaXQoXCJzdGFydFwiKSx0aGlzLl91cGRhdGUoITApLHRoaXMuX2VuYWJsZWQ9ITB9LG4ucHJvdG90eXBlLl90b1NlYz1mdW5jdGlvbihlKXtyZXR1cm4gZT4xMCYmKGUvPTFlMyksZXx8MH0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiX2VuYWJsZWRcIix7c2V0OmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX21lZGlhLm5vZGVzLnNjcmlwdDt0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhdWRpb3Byb2Nlc3NcIix0aGlzLl91cGRhdGVMaXN0ZW5lciksZSYmdC5hZGRFdmVudExpc3RlbmVyKFwiYXVkaW9wcm9jZXNzXCIsdGhpcy5fdXBkYXRlTGlzdGVuZXIpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInByb2dyZXNzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wcm9ncmVzc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3BhdXNlZD1lLHRoaXMucmVmcmVzaFBhdXNlZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuX3NvdXJjZSYmKHRoaXMuX3NvdXJjZS5kaXNjb25uZWN0KCksdGhpcy5fc291cmNlPW51bGwpLHRoaXMuX2dhaW4mJih0aGlzLl9nYWluLmRpc2Nvbm5lY3QoKSx0aGlzLl9nYWluPW51bGwpLHRoaXMuX21lZGlhJiYodGhpcy5fbWVkaWEuY29udGV4dC5ldmVudHMub2ZmKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSx0aGlzLl9tZWRpYS5jb250ZXh0LmV2ZW50cy5vZmYoXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpLHRoaXMuX21lZGlhPW51bGwpLHRoaXMuX2VuZD1udWxsLHRoaXMuX3NwZWVkPTEsdGhpcy5fdm9sdW1lPTEsdGhpcy5fbG9vcD0hMSx0aGlzLl9lbGFwc2VkPTAsdGhpcy5fZHVyYXRpb249MCx0aGlzLl9wYXVzZWQ9ITEsdGhpcy5fbXV0ZWQ9ITEsdGhpcy5fcGF1c2VkUmVhbD0hMX0sbi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIltXZWJBdWRpb0luc3RhbmNlIGlkPVwiK3RoaXMuaWQrXCJdXCJ9LG4ucHJvdG90eXBlLl9ub3c9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbWVkaWEuY29udGV4dC5hdWRpb0NvbnRleHQuY3VycmVudFRpbWV9LG4ucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oZSl7aWYodm9pZCAwPT09ZSYmKGU9ITEpLHRoaXMuX3NvdXJjZSl7dmFyIHQ9dGhpcy5fbm93KCksbj10LXRoaXMuX2xhc3RVcGRhdGU7aWYobj4wfHxlKXt2YXIgbz10aGlzLl9zb3VyY2UucGxheWJhY2tSYXRlLnZhbHVlO3RoaXMuX2VsYXBzZWQrPW4qbyx0aGlzLl9sYXN0VXBkYXRlPXQ7dmFyIGk9dGhpcy5fZHVyYXRpb24scj10aGlzLl9lbGFwc2VkJWkvaTt0aGlzLl9wcm9ncmVzcz1yLHRoaXMuZW1pdChcInByb2dyZXNzXCIsdGhpcy5fcHJvZ3Jlc3MsaSl9fX0sbi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLl9tZWRpYT1lLGUuY29udGV4dC5ldmVudHMub24oXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLGUuY29udGV4dC5ldmVudHMub24oXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpfSxuLnByb3RvdHlwZS5faW50ZXJuYWxTdG9wPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiYodGhpcy5fZW5hYmxlZD0hMSx0aGlzLl9zb3VyY2Uub25lbmRlZD1udWxsLHRoaXMuX3NvdXJjZS5zdG9wKCksdGhpcy5fc291cmNlPW51bGwpfSxuLnByb3RvdHlwZS5fb25Db21wbGV0ZT1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmKHRoaXMuX2VuYWJsZWQ9ITEsdGhpcy5fc291cmNlLm9uZW5kZWQ9bnVsbCksdGhpcy5fc291cmNlPW51bGwsdGhpcy5fcHJvZ3Jlc3M9MSx0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLDEsdGhpcy5fZHVyYXRpb24pLHRoaXMuZW1pdChcImVuZFwiLHRoaXMpfSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlcikseD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZhciBvPXRoaXMsaT10LmF1ZGlvQ29udGV4dCxyPWkuY3JlYXRlQnVmZmVyU291cmNlKCkscz1pLmNyZWF0ZVNjcmlwdFByb2Nlc3NvcihuLkJVRkZFUl9TSVpFKSx1PWkuY3JlYXRlR2FpbigpLGE9aS5jcmVhdGVBbmFseXNlcigpO3JldHVybiByLmNvbm5lY3QoYSksYS5jb25uZWN0KHUpLHUuY29ubmVjdCh0LmRlc3RpbmF0aW9uKSxzLmNvbm5lY3QodC5kZXN0aW5hdGlvbiksbz1lLmNhbGwodGhpcyxhLHUpfHx0aGlzLG8uY29udGV4dD10LG8uYnVmZmVyU291cmNlPXIsby5zY3JpcHQ9cyxvLmdhaW49dSxvLmFuYWx5c2VyPWEsb31yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyksdGhpcy5idWZmZXJTb3VyY2UuZGlzY29ubmVjdCgpLHRoaXMuc2NyaXB0LmRpc2Nvbm5lY3QoKSx0aGlzLmdhaW4uZGlzY29ubmVjdCgpLHRoaXMuYW5hbHlzZXIuZGlzY29ubmVjdCgpLHRoaXMuYnVmZmVyU291cmNlPW51bGwsdGhpcy5zY3JpcHQ9bnVsbCx0aGlzLmdhaW49bnVsbCx0aGlzLmFuYWx5c2VyPW51bGwsdGhpcy5jb250ZXh0PW51bGx9LG4ucHJvdG90eXBlLmNsb25lQnVmZmVyU291cmNlPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5idWZmZXJTb3VyY2UsdD10aGlzLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO3QuYnVmZmVyPWUuYnVmZmVyLGwuc2V0UGFyYW1WYWx1ZSh0LnBsYXliYWNrUmF0ZSxlLnBsYXliYWNrUmF0ZS52YWx1ZSksdC5sb29wPWUubG9vcDt2YXIgbj10aGlzLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtyZXR1cm4gdC5jb25uZWN0KG4pLG4uY29ubmVjdCh0aGlzLmRlc3RpbmF0aW9uKSx7c291cmNlOnQsZ2FpbjpufX0sbi5CVUZGRVJfU0laRT0yNTYsbn0obiksTz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5wYXJlbnQ9ZSx0aGlzLl9ub2Rlcz1uZXcgeCh0aGlzLmNvbnRleHQpLHRoaXMuX3NvdXJjZT10aGlzLl9ub2Rlcy5idWZmZXJTb3VyY2UsdGhpcy5zb3VyY2U9ZS5vcHRpb25zLnNvdXJjZX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucGFyZW50PW51bGwsdGhpcy5fbm9kZXMuZGVzdHJveSgpLHRoaXMuX25vZGVzPW51bGwsdGhpcy5fc291cmNlPW51bGwsdGhpcy5zb3VyY2U9bnVsbH0sZS5wcm90b3R5cGUuY3JlYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBQKHRoaXMpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhcmVudC5jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImlzUGxheWFibGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuISF0aGlzLl9zb3VyY2UmJiEhdGhpcy5fc291cmNlLmJ1ZmZlcn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9ub2Rlcy5maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbm9kZXMuZmlsdGVycz1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImR1cmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBjb25zb2xlLmFzc2VydCh0aGlzLmlzUGxheWFibGUsXCJTb3VuZCBub3QgeWV0IHBsYXlhYmxlLCBubyBkdXJhdGlvblwiKSx0aGlzLl9zb3VyY2UuYnVmZmVyLmR1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImJ1ZmZlclwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlLmJ1ZmZlcn0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NvdXJjZS5idWZmZXI9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJub2Rlc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbm9kZXN9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihlKXt0aGlzLnNvdXJjZT90aGlzLl9kZWNvZGUodGhpcy5zb3VyY2UsZSk6dGhpcy5wYXJlbnQudXJsP3RoaXMuX2xvYWRVcmwoZSk6ZT9lKG5ldyBFcnJvcihcInNvdW5kLnVybCBvciBzb3VuZC5zb3VyY2UgbXVzdCBiZSBzZXRcIikpOmNvbnNvbGUuZXJyb3IoXCJzb3VuZC51cmwgb3Igc291bmQuc291cmNlIG11c3QgYmUgc2V0XCIpfSxlLnByb3RvdHlwZS5fbG9hZFVybD1mdW5jdGlvbihlKXt2YXIgdD10aGlzLG49bmV3IFhNTEh0dHBSZXF1ZXN0LG89dGhpcy5wYXJlbnQudXJsO24ub3BlbihcIkdFVFwiLG8sITApLG4ucmVzcG9uc2VUeXBlPVwiYXJyYXlidWZmZXJcIixuLm9ubG9hZD1mdW5jdGlvbigpe3Quc291cmNlPW4ucmVzcG9uc2UsdC5fZGVjb2RlKG4ucmVzcG9uc2UsZSl9LG4uc2VuZCgpfSxlLnByb3RvdHlwZS5fZGVjb2RlPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpczt0aGlzLnBhcmVudC5jb250ZXh0LmRlY29kZShlLGZ1bmN0aW9uKGUsbyl7aWYoZSl0JiZ0KGUpO2Vsc2V7bi5wYXJlbnQuaXNMb2FkZWQ9ITAsbi5idWZmZXI9bzt2YXIgaT1uLnBhcmVudC5hdXRvUGxheVN0YXJ0KCk7dCYmdChudWxsLG4ucGFyZW50LGkpfX0pfSxlfSgpLHc9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLnJlc29sdmVVcmw9ZnVuY3Rpb24odCl7dmFyIG49ZS5GT1JNQVRfUEFUVEVSTixvPVwic3RyaW5nXCI9PXR5cGVvZiB0P3Q6dC51cmw7aWYobi50ZXN0KG8pKXtmb3IodmFyIGk9bi5leGVjKG8pLHI9aVsyXS5zcGxpdChcIixcIikscz1yW3IubGVuZ3RoLTFdLHU9MCxhPXIubGVuZ3RoO3U8YTt1Kyspe3ZhciBjPXJbdV07aWYoZS5zdXBwb3J0ZWRbY10pe3M9YzticmVha319dmFyIGw9by5yZXBsYWNlKGlbMV0scyk7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIHQmJih0LmV4dGVuc2lvbj1zLHQudXJsPWwpLGx9cmV0dXJuIG99LGUuc2luZVRvbmU9ZnVuY3Rpb24oZSx0KXt2b2lkIDA9PT1lJiYoZT0yMDApLHZvaWQgMD09PXQmJih0PTEpO3ZhciBuPUkuZnJvbSh7c2luZ2xlSW5zdGFuY2U6ITB9KTtpZighKG4ubWVkaWEgaW5zdGFuY2VvZiBPKSlyZXR1cm4gbjtmb3IodmFyIG89bi5tZWRpYSxpPW4uY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsNDhlMyp0LDQ4ZTMpLHI9aS5nZXRDaGFubmVsRGF0YSgwKSxzPTA7czxyLmxlbmd0aDtzKyspe3ZhciB1PWUqKHMvaS5zYW1wbGVSYXRlKSpNYXRoLlBJO3Jbc109MipNYXRoLnNpbih1KX1yZXR1cm4gby5idWZmZXI9aSxuLmlzTG9hZGVkPSEwLG59LGUucmVuZGVyPWZ1bmN0aW9uKGUsdCl7dmFyIG49ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTt0PU9iamVjdC5hc3NpZ24oe3dpZHRoOjUxMixoZWlnaHQ6MTI4LGZpbGw6XCJibGFja1wifSx0fHx7fSksbi53aWR0aD10LndpZHRoLG4uaGVpZ2h0PXQuaGVpZ2h0O3ZhciBvPVBJWEkuQmFzZVRleHR1cmUuZnJvbUNhbnZhcyhuKTtpZighKGUubWVkaWEgaW5zdGFuY2VvZiBPKSlyZXR1cm4gbzt2YXIgaT1lLm1lZGlhO2NvbnNvbGUuYXNzZXJ0KCEhaS5idWZmZXIsXCJObyBidWZmZXIgZm91bmQsIGxvYWQgZmlyc3RcIik7dmFyIHI9bi5nZXRDb250ZXh0KFwiMmRcIik7ci5maWxsU3R5bGU9dC5maWxsO2Zvcih2YXIgcz1pLmJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSx1PU1hdGguY2VpbChzLmxlbmd0aC90LndpZHRoKSxhPXQuaGVpZ2h0LzIsYz0wO2M8dC53aWR0aDtjKyspe2Zvcih2YXIgbD0xLHA9LTEsaD0wO2g8dTtoKyspe3ZhciBkPXNbYyp1K2hdO2Q8bCYmKGw9ZCksZD5wJiYocD1kKX1yLmZpbGxSZWN0KGMsKDErbCkqYSwxLE1hdGgubWF4KDEsKHAtbCkqYSkpfXJldHVybiBvfSxlLnBsYXlPbmNlPWZ1bmN0aW9uKHQsbil7dmFyIG89XCJhbGlhc1wiK2UuUExBWV9JRCsrO3JldHVybiBTLmluc3RhbmNlLmFkZChvLHt1cmw6dCxwcmVsb2FkOiEwLGF1dG9QbGF5OiEwLGxvYWRlZDpmdW5jdGlvbihlKXtlJiYoY29uc29sZS5lcnJvcihlKSxTLmluc3RhbmNlLnJlbW92ZShvKSxuJiZuKGUpKX0sY29tcGxldGU6ZnVuY3Rpb24oKXtTLmluc3RhbmNlLnJlbW92ZShvKSxuJiZuKG51bGwpfX0pLG99LGUuUExBWV9JRD0wLGUuRk9STUFUX1BBVFRFUk49L1xcLihcXHsoW15cXH1dKylcXH0pKFxcPy4qKT8kLyxlLmV4dGVuc2lvbnM9W1wibXAzXCIsXCJvZ2dcIixcIm9nYVwiLFwib3B1c1wiLFwibXBlZ1wiLFwid2F2XCIsXCJtNGFcIixcIm1wNFwiLFwiYWlmZlwiLFwid21hXCIsXCJtaWRcIl0sZS5zdXBwb3J0ZWQ9ZnVuY3Rpb24oKXt2YXIgdD17bTRhOlwibXA0XCIsb2dhOlwib2dnXCJ9LG49ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpLG89e307cmV0dXJuIGUuZXh0ZW5zaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciBpPXRbZV18fGUscj1uLmNhblBsYXlUeXBlKFwiYXVkaW8vXCIrZSkucmVwbGFjZSgvXm5vJC8sXCJcIikscz1uLmNhblBsYXlUeXBlKFwiYXVkaW8vXCIraSkucmVwbGFjZSgvXm5vJC8sXCJcIik7b1tlXT0hIXJ8fCEhc30pLE9iamVjdC5mcmVlemUobyl9KCksZX0oKSxqPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxuKXt2YXIgbz1lLmNhbGwodGhpcyx0LG4pfHx0aGlzO3JldHVybiBvLnVzZShBLnBsdWdpbiksby5wcmUoQS5yZXNvbHZlKSxvfXJldHVybiB0KG4sZSksbi5hZGRQaXhpTWlkZGxld2FyZT1mdW5jdGlvbih0KXtlLmFkZFBpeGlNaWRkbGV3YXJlLmNhbGwodGhpcyx0KX0sbn0oUElYSS5sb2FkZXJzLkxvYWRlciksQT1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUuaW5zdGFsbD1mdW5jdGlvbih0KXtlLl9zb3VuZD10LGUubGVnYWN5PXQudXNlTGVnYWN5LFBJWEkubG9hZGVycy5Mb2FkZXI9aixQSVhJLmxvYWRlci51c2UoZS5wbHVnaW4pLFBJWEkubG9hZGVyLnByZShlLnJlc29sdmUpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImxlZ2FjeVwiLHtzZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9UElYSS5sb2FkZXJzLlJlc291cmNlLG49dy5leHRlbnNpb25zO2U/bi5mb3JFYWNoKGZ1bmN0aW9uKGUpe3Quc2V0RXh0ZW5zaW9uWGhyVHlwZShlLHQuWEhSX1JFU1BPTlNFX1RZUEUuREVGQVVMVCksdC5zZXRFeHRlbnNpb25Mb2FkVHlwZShlLHQuTE9BRF9UWVBFLkFVRElPKX0pOm4uZm9yRWFjaChmdW5jdGlvbihlKXt0LnNldEV4dGVuc2lvblhoclR5cGUoZSx0LlhIUl9SRVNQT05TRV9UWVBFLkJVRkZFUiksdC5zZXRFeHRlbnNpb25Mb2FkVHlwZShlLHQuTE9BRF9UWVBFLlhIUil9KX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnJlc29sdmU9ZnVuY3Rpb24oZSx0KXt3LnJlc29sdmVVcmwoZSksdCgpfSxlLnBsdWdpbj1mdW5jdGlvbih0LG4pe3QuZGF0YSYmdy5leHRlbnNpb25zLmluZGV4T2YodC5leHRlbnNpb24pPi0xP3Quc291bmQ9ZS5fc291bmQuYWRkKHQubmFtZSx7bG9hZGVkOm4scHJlbG9hZDohMCx1cmw6dC51cmwsc291cmNlOnQuZGF0YX0pOm4oKX0sZX0oKSxGPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMucGFyZW50PWUsT2JqZWN0LmFzc2lnbih0aGlzLHQpLHRoaXMuZHVyYXRpb249dGhpcy5lbmQtdGhpcy5zdGFydCxjb25zb2xlLmFzc2VydCh0aGlzLmR1cmF0aW9uPjAsXCJFbmQgdGltZSBtdXN0IGJlIGFmdGVyIHN0YXJ0IHRpbWVcIil9cmV0dXJuIGUucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMucGFyZW50LnBsYXkoT2JqZWN0LmFzc2lnbih7Y29tcGxldGU6ZSxzcGVlZDp0aGlzLnNwZWVkfHx0aGlzLnBhcmVudC5zcGVlZCxlbmQ6dGhpcy5lbmQsc3RhcnQ6dGhpcy5zdGFydH0pKX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucGFyZW50PW51bGx9LGV9KCksRT1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7dmFyIHQ9dGhpcyxvPW5ldyBuLkF1ZGlvQ29udGV4dCxpPW8uY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCkscj1vLmNyZWF0ZUFuYWx5c2VyKCk7cmV0dXJuIHIuY29ubmVjdChpKSxpLmNvbm5lY3Qoby5kZXN0aW5hdGlvbiksdD1lLmNhbGwodGhpcyxyLGkpfHx0aGlzLHQuX2N0eD1vLHQuX29mZmxpbmVDdHg9bmV3IG4uT2ZmbGluZUF1ZGlvQ29udGV4dCgxLDIsby5zYW1wbGVSYXRlKSx0Ll91bmxvY2tlZD0hMSx0LmNvbXByZXNzb3I9aSx0LmFuYWx5c2VyPXIsdC5ldmVudHM9bmV3IFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyLHQudm9sdW1lPTEsdC5zcGVlZD0xLHQubXV0ZWQ9ITEsdC5wYXVzZWQ9ITEsXCJvbnRvdWNoc3RhcnRcImluIHdpbmRvdyYmXCJydW5uaW5nXCIhPT1vLnN0YXRlJiYodC5fdW5sb2NrKCksdC5fdW5sb2NrPXQuX3VubG9jay5iaW5kKHQpLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIix0Ll91bmxvY2ssITApLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsdC5fdW5sb2NrLCEwKSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIix0Ll91bmxvY2ssITApKSx0fXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuX3VubG9jaz1mdW5jdGlvbigpe3RoaXMuX3VubG9ja2VkfHwodGhpcy5wbGF5RW1wdHlTb3VuZCgpLFwicnVubmluZ1wiPT09dGhpcy5fY3R4LnN0YXRlJiYoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHRoaXMuX3VubG9jaywhMCksZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsdGhpcy5fdW5sb2NrLCEwKSxkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLHRoaXMuX3VubG9jaywhMCksdGhpcy5fdW5sb2NrZWQ9ITApKX0sbi5wcm90b3R5cGUucGxheUVtcHR5U291bmQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7ZS5idWZmZXI9dGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlcigxLDEsMjIwNTApLGUuY29ubmVjdCh0aGlzLl9jdHguZGVzdGluYXRpb24pLGUuc3RhcnQoMCwwLDApfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIkF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgZT13aW5kb3c7cmV0dXJuIGUuQXVkaW9Db250ZXh0fHxlLndlYmtpdEF1ZGlvQ29udGV4dHx8bnVsbH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIk9mZmxpbmVBdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7dmFyIGU9d2luZG93O3JldHVybiBlLk9mZmxpbmVBdWRpb0NvbnRleHR8fGUud2Via2l0T2ZmbGluZUF1ZGlvQ29udGV4dHx8bnVsbH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7ZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO3ZhciB0PXRoaXMuX2N0eDt2b2lkIDAhPT10LmNsb3NlJiZ0LmNsb3NlKCksdGhpcy5ldmVudHMucmVtb3ZlQWxsTGlzdGVuZXJzKCksdGhpcy5hbmFseXNlci5kaXNjb25uZWN0KCksdGhpcy5jb21wcmVzc29yLmRpc2Nvbm5lY3QoKSx0aGlzLmFuYWx5c2VyPW51bGwsdGhpcy5jb21wcmVzc29yPW51bGwsdGhpcy5ldmVudHM9bnVsbCx0aGlzLl9vZmZsaW5lQ3R4PW51bGwsdGhpcy5fY3R4PW51bGx9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY3R4fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIm9mZmxpbmVDb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9vZmZsaW5lQ3R4fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7ZSYmXCJydW5uaW5nXCI9PT10aGlzLl9jdHguc3RhdGU/dGhpcy5fY3R4LnN1c3BlbmQoKTplfHxcInN1c3BlbmRlZFwiIT09dGhpcy5fY3R4LnN0YXRlfHx0aGlzLl9jdHgucmVzdW1lKCksdGhpcy5fcGF1c2VkPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3RoaXMuZXZlbnRzLmVtaXQoXCJyZWZyZXNoXCIpfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dGhpcy5ldmVudHMuZW1pdChcInJlZnJlc2hQYXVzZWRcIil9LG4ucHJvdG90eXBlLnRvZ2dsZU11dGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tdXRlZD0hdGhpcy5tdXRlZCx0aGlzLnJlZnJlc2goKSx0aGlzLm11dGVkfSxuLnByb3RvdHlwZS50b2dnbGVQYXVzZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdXNlZD0hdGhpcy5wYXVzZWQsdGhpcy5yZWZyZXNoUGF1c2VkKCksdGhpcy5fcGF1c2VkfSxuLnByb3RvdHlwZS5kZWNvZGU9ZnVuY3Rpb24oZSx0KXt0aGlzLl9vZmZsaW5lQ3R4LmRlY29kZUF1ZGlvRGF0YShlLGZ1bmN0aW9uKGUpe3QobnVsbCxlKX0sZnVuY3Rpb24oKXt0KG5ldyBFcnJvcihcIlVuYWJsZSB0byBkZWNvZGUgZmlsZVwiKSl9KX0sbn0obiksTD1PYmplY3QuZnJlZXplKHtXZWJBdWRpb01lZGlhOk8sV2ViQXVkaW9JbnN0YW5jZTpQLFdlYkF1ZGlvTm9kZXM6eCxXZWJBdWRpb0NvbnRleHQ6RSxXZWJBdWRpb1V0aWxzOmx9KSxTPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe3RoaXMuaW5pdCgpfXJldHVybiBlLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc3VwcG9ydGVkJiYodGhpcy5fd2ViQXVkaW9Db250ZXh0PW5ldyBFKSx0aGlzLl9odG1sQXVkaW9Db250ZXh0PW5ldyBiLHRoaXMuX3NvdW5kcz17fSx0aGlzLnVzZUxlZ2FjeT0hdGhpcy5zdXBwb3J0ZWQsdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLmluaXQ9ZnVuY3Rpb24oKXtpZihlLmluc3RhbmNlKXRocm93IG5ldyBFcnJvcihcIlNvdW5kTGlicmFyeSBpcyBhbHJlYWR5IGNyZWF0ZWRcIik7dmFyIHQ9ZS5pbnN0YW5jZT1uZXcgZTtcInVuZGVmaW5lZFwiPT10eXBlb2YgUHJvbWlzZSYmKHdpbmRvdy5Qcm9taXNlPWEpLHZvaWQgMCE9PVBJWEkubG9hZGVycyYmQS5pbnN0YWxsKHQpLHZvaWQgMD09PXdpbmRvdy5fX3BpeGlTb3VuZCYmZGVsZXRlIHdpbmRvdy5fX3BpeGlTb3VuZDt2YXIgbz1QSVhJO3JldHVybiBvLnNvdW5kfHwoT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJzb3VuZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LHtmaWx0ZXJzOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbX19LGh0bWxhdWRpbzp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGd9fSx3ZWJhdWRpbzp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEx9fSx1dGlsczp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHd9fSxTb3VuZDp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEl9fSxTb3VuZFNwcml0ZTp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEZ9fSxGaWx0ZXJhYmxlOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbn19LFNvdW5kTGlicmFyeTp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGV9fX0pKSx0fSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzQWxsXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVzZUxlZ2FjeT9bXTp0aGlzLl9jb250ZXh0LmZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt0aGlzLnVzZUxlZ2FjeXx8KHRoaXMuX2NvbnRleHQuZmlsdGVycz1lKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzdXBwb3J0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG51bGwhPT1FLkF1ZGlvQ29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24oZSx0KXtpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7dmFyIG49e307Zm9yKHZhciBvIGluIGUpe2k9dGhpcy5fZ2V0T3B0aW9ucyhlW29dLHQpO25bb109dGhpcy5hZGQobyxpKX1yZXR1cm4gbn1pZihcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYoY29uc29sZS5hc3NlcnQoIXRoaXMuX3NvdW5kc1tlXSxcIlNvdW5kIHdpdGggYWxpYXMgXCIrZStcIiBhbHJlYWR5IGV4aXN0cy5cIiksdCBpbnN0YW5jZW9mIEkpcmV0dXJuIHRoaXMuX3NvdW5kc1tlXT10LHQ7dmFyIGk9dGhpcy5fZ2V0T3B0aW9ucyh0KSxyPUkuZnJvbShpKTtyZXR1cm4gdGhpcy5fc291bmRzW2VdPXIscn19LGUucHJvdG90eXBlLl9nZXRPcHRpb25zPWZ1bmN0aW9uKGUsdCl7dmFyIG47cmV0dXJuIG49XCJzdHJpbmdcIj09dHlwZW9mIGU/e3VybDplfTplIGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ8fGUgaW5zdGFuY2VvZiBIVE1MQXVkaW9FbGVtZW50P3tzb3VyY2U6ZX06ZSxPYmplY3QuYXNzaWduKG4sdHx8e30pfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJ1c2VMZWdhY3lcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3VzZUxlZ2FjeX0sc2V0OmZ1bmN0aW9uKGUpe0EubGVnYWN5PWUsdGhpcy5fdXNlTGVnYWN5PWUsIWUmJnRoaXMuc3VwcG9ydGVkP3RoaXMuX2NvbnRleHQ9dGhpcy5fd2ViQXVkaW9Db250ZXh0OnRoaXMuX2NvbnRleHQ9dGhpcy5faHRtbEF1ZGlvQ29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZXhpc3RzKGUsITApLHRoaXMuX3NvdW5kc1tlXS5kZXN0cm95KCksZGVsZXRlIHRoaXMuX3NvdW5kc1tlXSx0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJ2b2x1bWVBbGxcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQudm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fY29udGV4dC52b2x1bWU9ZSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzcGVlZEFsbFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2NvbnRleHQuc3BlZWQ9ZSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS50b2dnbGVQYXVzZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnRvZ2dsZVBhdXNlKCl9LGUucHJvdG90eXBlLnBhdXNlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQucGF1c2VkPSEwLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnJlc3VtZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnBhdXNlZD0hMSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS50b2dnbGVNdXRlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQudG9nZ2xlTXV0ZSgpfSxlLnByb3RvdHlwZS5tdXRlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQubXV0ZWQ9ITAsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUudW5tdXRlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQubXV0ZWQ9ITEsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUucmVtb3ZlQWxsPWZ1bmN0aW9uKCl7Zm9yKHZhciBlIGluIHRoaXMuX3NvdW5kcyl0aGlzLl9zb3VuZHNbZV0uZGVzdHJveSgpLGRlbGV0ZSB0aGlzLl9zb3VuZHNbZV07cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLnN0b3BBbGw9ZnVuY3Rpb24oKXtmb3IodmFyIGUgaW4gdGhpcy5fc291bmRzKXRoaXMuX3NvdW5kc1tlXS5zdG9wKCk7cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLmV4aXN0cz1mdW5jdGlvbihlLHQpe3ZvaWQgMD09PXQmJih0PSExKTt2YXIgbj0hIXRoaXMuX3NvdW5kc1tlXTtyZXR1cm4gdCYmY29uc29sZS5hc3NlcnQobixcIk5vIHNvdW5kIG1hdGNoaW5nIGFsaWFzICdcIitlK1wiJy5cIiksbn0sZS5wcm90b3R5cGUuZmluZD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5leGlzdHMoZSwhMCksdGhpcy5fc291bmRzW2VdfSxlLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuZmluZChlKS5wbGF5KHQpfSxlLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkuc3RvcCgpfSxlLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLnBhdXNlKCl9LGUucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLnJlc3VtZSgpfSxlLnByb3RvdHlwZS52b2x1bWU9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzLmZpbmQoZSk7cmV0dXJuIHZvaWQgMCE9PXQmJihuLnZvbHVtZT10KSxuLnZvbHVtZX0sZS5wcm90b3R5cGUuc3BlZWQ9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzLmZpbmQoZSk7cmV0dXJuIHZvaWQgMCE9PXQmJihuLnNwZWVkPXQpLG4uc3BlZWR9LGUucHJvdG90eXBlLmR1cmF0aW9uPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkuZHVyYXRpb259LGUucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmVtb3ZlQWxsKCksdGhpcy5fc291bmRzPW51bGwsdGhpcy5fd2ViQXVkaW9Db250ZXh0JiYodGhpcy5fd2ViQXVkaW9Db250ZXh0LmRlc3Ryb3koKSx0aGlzLl93ZWJBdWRpb0NvbnRleHQ9bnVsbCksdGhpcy5faHRtbEF1ZGlvQ29udGV4dCYmKHRoaXMuX2h0bWxBdWRpb0NvbnRleHQuZGVzdHJveSgpLHRoaXMuX2h0bWxBdWRpb0NvbnRleHQ9bnVsbCksdGhpcy5fY29udGV4dD1udWxsLHRoaXN9LGV9KCksST1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLm1lZGlhPWUsdGhpcy5vcHRpb25zPXQsdGhpcy5faW5zdGFuY2VzPVtdLHRoaXMuX3Nwcml0ZXM9e30sdGhpcy5tZWRpYS5pbml0KHRoaXMpO3ZhciBuPXQuY29tcGxldGU7dGhpcy5fYXV0b1BsYXlPcHRpb25zPW4/e2NvbXBsZXRlOm59Om51bGwsdGhpcy5pc0xvYWRlZD0hMSx0aGlzLmlzUGxheWluZz0hMSx0aGlzLmF1dG9QbGF5PXQuYXV0b1BsYXksdGhpcy5zaW5nbGVJbnN0YW5jZT10LnNpbmdsZUluc3RhbmNlLHRoaXMucHJlbG9hZD10LnByZWxvYWR8fHRoaXMuYXV0b1BsYXksdGhpcy51cmw9dC51cmwsdGhpcy5zcGVlZD10LnNwZWVkLHRoaXMudm9sdW1lPXQudm9sdW1lLHRoaXMubG9vcD10Lmxvb3AsdC5zcHJpdGVzJiZ0aGlzLmFkZFNwcml0ZXModC5zcHJpdGVzKSx0aGlzLnByZWxvYWQmJnRoaXMuX3ByZWxvYWQodC5sb2FkZWQpfXJldHVybiBlLmZyb209ZnVuY3Rpb24odCl7dmFyIG49e307cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIHQ/bi51cmw9dDp0IGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ8fHQgaW5zdGFuY2VvZiBIVE1MQXVkaW9FbGVtZW50P24uc291cmNlPXQ6bj10LChuPU9iamVjdC5hc3NpZ24oe2F1dG9QbGF5OiExLHNpbmdsZUluc3RhbmNlOiExLHVybDpudWxsLHNvdXJjZTpudWxsLHByZWxvYWQ6ITEsdm9sdW1lOjEsc3BlZWQ6MSxjb21wbGV0ZTpudWxsLGxvYWRlZDpudWxsLGxvb3A6ITF9LG4pKS51cmwmJihuLnVybD13LnJlc29sdmVVcmwobi51cmwpKSxPYmplY3QuZnJlZXplKG4pLG5ldyBlKFMuaW5zdGFuY2UudXNlTGVnYWN5P25ldyBzOm5ldyBPLG4pfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiBTLmluc3RhbmNlLmNvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc1BsYXlpbmc9ITEsdGhpcy5wYXVzZWQ9ITAsdGhpc30sZS5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNQbGF5aW5nPXRoaXMuX2luc3RhbmNlcy5sZW5ndGg+MCx0aGlzLnBhdXNlZD0hMSx0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3BhdXNlZD1lLHRoaXMucmVmcmVzaFBhdXNlZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInNwZWVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NwZWVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tZWRpYS5maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5tZWRpYS5maWx0ZXJzPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuYWRkU3ByaXRlcz1mdW5jdGlvbihlLHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXt2YXIgbj17fTtmb3IodmFyIG8gaW4gZSluW29dPXRoaXMuYWRkU3ByaXRlcyhvLGVbb10pO3JldHVybiBufWlmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXtjb25zb2xlLmFzc2VydCghdGhpcy5fc3ByaXRlc1tlXSxcIkFsaWFzIFwiK2UrXCIgaXMgYWxyZWFkeSB0YWtlblwiKTt2YXIgaT1uZXcgRih0aGlzLHQpO3JldHVybiB0aGlzLl9zcHJpdGVzW2VdPWksaX19LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9yZW1vdmVJbnN0YW5jZXMoKSx0aGlzLnJlbW92ZVNwcml0ZXMoKSx0aGlzLm1lZGlhLmRlc3Ryb3koKSx0aGlzLm1lZGlhPW51bGwsdGhpcy5fc3ByaXRlcz1udWxsLHRoaXMuX2luc3RhbmNlcz1udWxsfSxlLnByb3RvdHlwZS5yZW1vdmVTcHJpdGVzPWZ1bmN0aW9uKGUpe2lmKGUpe3ZhciB0PXRoaXMuX3Nwcml0ZXNbZV07dm9pZCAwIT09dCYmKHQuZGVzdHJveSgpLGRlbGV0ZSB0aGlzLl9zcHJpdGVzW2VdKX1lbHNlIGZvcih2YXIgbiBpbiB0aGlzLl9zcHJpdGVzKXRoaXMucmVtb3ZlU3ByaXRlcyhuKTtyZXR1cm4gdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiaXNQbGF5YWJsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc0xvYWRlZCYmdGhpcy5tZWRpYSYmdGhpcy5tZWRpYS5pc1BsYXlhYmxlfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXtpZighdGhpcy5pc1BsYXlhYmxlKXJldHVybiB0aGlzLmF1dG9QbGF5PSExLHRoaXMuX2F1dG9QbGF5T3B0aW9ucz1udWxsLHRoaXM7dGhpcy5pc1BsYXlpbmc9ITE7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgtMTtlPj0wO2UtLSl0aGlzLl9pbnN0YW5jZXNbZV0uc3RvcCgpO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUsdCl7dmFyIG4sbz10aGlzO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlP249e3Nwcml0ZTpyPWUsY29tcGxldGU6dH06XCJmdW5jdGlvblwiPT10eXBlb2YgZT8obj17fSkuY29tcGxldGU9ZTpuPWUsKG49T2JqZWN0LmFzc2lnbih7Y29tcGxldGU6bnVsbCxsb2FkZWQ6bnVsbCxzcHJpdGU6bnVsbCxlbmQ6bnVsbCxzdGFydDowLHZvbHVtZToxLHNwZWVkOjEsbXV0ZWQ6ITEsbG9vcDohMX0sbnx8e30pKS5zcHJpdGUpe3ZhciBpPW4uc3ByaXRlO2NvbnNvbGUuYXNzZXJ0KCEhdGhpcy5fc3ByaXRlc1tpXSxcIkFsaWFzIFwiK2krXCIgaXMgbm90IGF2YWlsYWJsZVwiKTt2YXIgcj10aGlzLl9zcHJpdGVzW2ldO24uc3RhcnQ9ci5zdGFydCxuLmVuZD1yLmVuZCxuLnNwZWVkPXIuc3BlZWR8fDEsZGVsZXRlIG4uc3ByaXRlfWlmKG4ub2Zmc2V0JiYobi5zdGFydD1uLm9mZnNldCksIXRoaXMuaXNMb2FkZWQpcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGUsdCl7by5hdXRvUGxheT0hMCxvLl9hdXRvUGxheU9wdGlvbnM9bixvLl9wcmVsb2FkKGZ1bmN0aW9uKG8saSxyKXtvP3Qobyk6KG4ubG9hZGVkJiZuLmxvYWRlZChvLGksciksZShyKSl9KX0pO3RoaXMuc2luZ2xlSW5zdGFuY2UmJnRoaXMuX3JlbW92ZUluc3RhbmNlcygpO3ZhciBzPXRoaXMuX2NyZWF0ZUluc3RhbmNlKCk7cmV0dXJuIHRoaXMuX2luc3RhbmNlcy5wdXNoKHMpLHRoaXMuaXNQbGF5aW5nPSEwLHMub25jZShcImVuZFwiLGZ1bmN0aW9uKCl7bi5jb21wbGV0ZSYmbi5jb21wbGV0ZShvKSxvLl9vbkNvbXBsZXRlKHMpfSkscy5vbmNlKFwic3RvcFwiLGZ1bmN0aW9uKCl7by5fb25Db21wbGV0ZShzKX0pLHMucGxheShuKSxzfSxlLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgsdD0wO3Q8ZTt0KyspdGhpcy5faW5zdGFuY2VzW3RdLnJlZnJlc2goKX0sZS5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLHQ9MDt0PGU7dCsrKXRoaXMuX2luc3RhbmNlc1t0XS5yZWZyZXNoUGF1c2VkKCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInZvbHVtZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fdm9sdW1lPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwibXV0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX211dGVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbXV0ZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJsb29wXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9sb29wfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbG9vcD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLl9wcmVsb2FkPWZ1bmN0aW9uKGUpe3RoaXMubWVkaWEubG9hZChlKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiaW5zdGFuY2VzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pbnN0YW5jZXN9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3ByaXRlc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3ByaXRlc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJkdXJhdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tZWRpYS5kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5hdXRvUGxheVN0YXJ0PWZ1bmN0aW9uKCl7dmFyIGU7cmV0dXJuIHRoaXMuYXV0b1BsYXkmJihlPXRoaXMucGxheSh0aGlzLl9hdXRvUGxheU9wdGlvbnMpKSxlfSxlLnByb3RvdHlwZS5fcmVtb3ZlSW5zdGFuY2VzPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgtMTtlPj0wO2UtLSl0aGlzLl9wb29sSW5zdGFuY2UodGhpcy5faW5zdGFuY2VzW2VdKTt0aGlzLl9pbnN0YW5jZXMubGVuZ3RoPTB9LGUucHJvdG90eXBlLl9vbkNvbXBsZXRlPWZ1bmN0aW9uKGUpe2lmKHRoaXMuX2luc3RhbmNlcyl7dmFyIHQ9dGhpcy5faW5zdGFuY2VzLmluZGV4T2YoZSk7dD4tMSYmdGhpcy5faW5zdGFuY2VzLnNwbGljZSh0LDEpLHRoaXMuaXNQbGF5aW5nPXRoaXMuX2luc3RhbmNlcy5sZW5ndGg+MH10aGlzLl9wb29sSW5zdGFuY2UoZSl9LGUucHJvdG90eXBlLl9jcmVhdGVJbnN0YW5jZT1mdW5jdGlvbigpe2lmKGUuX3Bvb2wubGVuZ3RoPjApe3ZhciB0PWUuX3Bvb2wucG9wKCk7cmV0dXJuIHQuaW5pdCh0aGlzLm1lZGlhKSx0fXJldHVybiB0aGlzLm1lZGlhLmNyZWF0ZSgpfSxlLnByb3RvdHlwZS5fcG9vbEluc3RhbmNlPWZ1bmN0aW9uKHQpe3QuZGVzdHJveSgpLGUuX3Bvb2wuaW5kZXhPZih0KTwwJiZlLl9wb29sLnB1c2godCl9LGUuX3Bvb2w9W10sZX0oKSxDPVMuaW5pdCgpO2Uuc291bmQ9QyxlLmZpbHRlcnM9bSxlLmh0bWxhdWRpbz1nLGUud2ViYXVkaW89TCxlLkZpbHRlcmFibGU9bixlLlNvdW5kPUksZS5Tb3VuZExpYnJhcnk9UyxlLlNvdW5kU3ByaXRlPUYsZS51dGlscz13LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLXNvdW5kLmpzLm1hcFxuIiwiIWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUoaSl7aWYobltpXSlyZXR1cm4gbltpXS5leHBvcnRzO3ZhciByPW5baV09e2V4cG9ydHM6e30saWQ6aSxsb2FkZWQ6ITF9O3JldHVybiB0W2ldLmNhbGwoci5leHBvcnRzLHIsci5leHBvcnRzLGUpLHIubG9hZGVkPSEwLHIuZXhwb3J0c312YXIgbj17fTtyZXR1cm4gZS5tPXQsZS5jPW4sZS5wPVwiXCIsZSgwKX0oW2Z1bmN0aW9uKHQsZSxuKXt0LmV4cG9ydHM9big2KX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9UElYSX0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbj17bGluZWFyOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0fX0saW5RdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnR9fSxvdXRRdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KigyLXQpfX0saW5PdXRRdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQ6LS41KigtLXQqKHQtMiktMSl9fSxpbkN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdH19LG91dEN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi0tdCp0KnQrMX19LGluT3V0Q3ViaWM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdCp0Oih0LT0yLC41Kih0KnQqdCsyKSl9fSxpblF1YXJ0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdCp0fX0sb3V0UXVhcnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtIC0tdCp0KnQqdH19LGluT3V0UXVhcnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdCp0KnQ6KHQtPTIsLS41Kih0KnQqdCp0LTIpKX19LGluUXVpbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqdCp0KnQqdH19LG91dFF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi0tdCp0KnQqdCp0KzF9fSxpbk91dFF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQqdCp0KnQ6KHQtPTIsLjUqKHQqdCp0KnQqdCsyKSl9fSxpblNpbmU6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtTWF0aC5jb3ModCpNYXRoLlBJLzIpfX0sb3V0U2luZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zaW4odCpNYXRoLlBJLzIpfX0saW5PdXRTaW5lOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi41KigxLU1hdGguY29zKE1hdGguUEkqdCkpfX0saW5FeHBvOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAwPT09dD8wOk1hdGgucG93KDEwMjQsdC0xKX19LG91dEV4cG86ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDE9PT10PzE6MS1NYXRoLnBvdygyLC0xMCp0KX19LGluT3V0RXhwbzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMD09PXQ/MDoxPT09dD8xOih0Kj0yLDE+dD8uNSpNYXRoLnBvdygxMDI0LHQtMSk6LjUqKC1NYXRoLnBvdygyLC0xMCoodC0xKSkrMikpfX0saW5DaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLU1hdGguc3FydCgxLXQqdCl9fSxvdXRDaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNxcnQoMS0gLS10KnQpfX0saW5PdXRDaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8tLjUqKE1hdGguc3FydCgxLXQqdCktMSk6LjUqKE1hdGguc3FydCgxLSh0LTIpKih0LTIpKSsxKX19LGluRWxhc3RpYzpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg8PTB8fHZvaWQgMD09PWFyZ3VtZW50c1swXT8uMTphcmd1bWVudHNbMF0sZT1hcmd1bWVudHMubGVuZ3RoPD0xfHx2b2lkIDA9PT1hcmd1bWVudHNbMV0/LjQ6YXJndW1lbnRzWzFdO3JldHVybiBmdW5jdGlvbihuKXt2YXIgaT12b2lkIDA7cmV0dXJuIDA9PT1uPzA6MT09PW4/MTooIXR8fDE+dD8odD0xLGk9ZS80KTppPWUqTWF0aC5hc2luKDEvdCkvKDIqTWF0aC5QSSksLSh0Kk1hdGgucG93KDIsMTAqKG4tMSkpKk1hdGguc2luKChuLTEtaSkqKDIqTWF0aC5QSSkvZSkpKX19LG91dEVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLHQqTWF0aC5wb3coMiwtMTAqbikqTWF0aC5zaW4oKG4taSkqKDIqTWF0aC5QSSkvZSkrMSl9fSxpbk91dEVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLG4qPTIsMT5uPy0uNSoodCpNYXRoLnBvdygyLDEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKTp0Kk1hdGgucG93KDIsLTEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKi41KzEpfX0saW5CYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj10fHwxLjcwMTU4O3JldHVybiBlKmUqKChuKzEpKmUtbil9fSxvdXRCYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj10fHwxLjcwMTU4O3JldHVybi0tZSplKigobisxKSplK24pKzF9fSxpbk91dEJhY2s6ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciBuPTEuNTI1Kih0fHwxLjcwMTU4KTtyZXR1cm4gZSo9MiwxPmU/LjUqKGUqZSooKG4rMSkqZS1uKSk6LjUqKChlLTIpKihlLTIpKigobisxKSooZS0yKStuKSsyKX19LGluQm91bmNlOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLW4ub3V0Qm91bmNlKCkoMS10KX19LG91dEJvdW5jZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS8yLjc1PnQ/Ny41NjI1KnQqdDoyLzIuNzU+dD8odC09MS41LzIuNzUsNy41NjI1KnQqdCsuNzUpOjIuNS8yLjc1PnQ/KHQtPTIuMjUvMi43NSw3LjU2MjUqdCp0Ky45Mzc1KToodC09Mi42MjUvMi43NSw3LjU2MjUqdCp0Ky45ODQzNzUpfX0saW5PdXRCb3VuY2U6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuLjU+dD8uNSpuLmluQm91bmNlKCkoMip0KTouNSpuLm91dEJvdW5jZSgpKDIqdC0xKSsuNX19LGN1c3RvbUFycmF5OmZ1bmN0aW9uKHQpe3JldHVybiB0P2Z1bmN0aW9uKHQpe3JldHVybiB0fTpuLmxpbmVhcigpfX07ZVtcImRlZmF1bHRcIl09bn0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1mdW5jdGlvbiByKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgZT17fTtpZihudWxsIT10KWZvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKTtyZXR1cm4gZVtcImRlZmF1bHRcIl09dCxlfWZ1bmN0aW9uIHModCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfWZ1bmN0aW9uIG8odCxlKXtpZighdCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIWV8fFwib2JqZWN0XCIhPXR5cGVvZiBlJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBlP3Q6ZX1mdW5jdGlvbiBhKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmbnVsbCE9PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIrdHlwZW9mIGUpO3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LGVudW1lcmFibGU6ITEsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLGUmJihPYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LnNldFByb3RvdHlwZU9mKHQsZSk6dC5fX3Byb3RvX189ZSl9ZnVuY3Rpb24gdSh0LGUsbixpLHIscyl7Zm9yKHZhciBvIGluIHQpaWYoYyh0W29dKSl1KHRbb10sZVtvXSxuW29dLGkscixzKTtlbHNle3ZhciBhPWVbb10saD10W29dLWVbb10sbD1pLGY9ci9sO25bb109YStoKnMoZil9fWZ1bmN0aW9uIGgodCxlLG4pe2Zvcih2YXIgaSBpbiB0KTA9PT1lW2ldfHxlW2ldfHwoYyhuW2ldKT8oZVtpXT1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG5baV0pKSxoKHRbaV0sZVtpXSxuW2ldKSk6ZVtpXT1uW2ldKX1mdW5jdGlvbiBjKHQpe3JldHVyblwiW29iamVjdCBPYmplY3RdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCl9dmFyIGw9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgZj1uKDEpLHA9cihmKSxkPW4oMiksZz1pKGQpLHY9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0LG4pe3ModGhpcyxlKTt2YXIgaT1vKHRoaXMsT2JqZWN0LmdldFByb3RvdHlwZU9mKGUpLmNhbGwodGhpcykpO3JldHVybiBpLnRhcmdldD10LG4mJmkuYWRkVG8obiksaS5jbGVhcigpLGl9cmV0dXJuIGEoZSx0KSxsKGUsW3trZXk6XCJhZGRUb1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLm1hbmFnZXI9dCx0aGlzLm1hbmFnZXIuYWRkVHdlZW4odGhpcyksdGhpc319LHtrZXk6XCJjaGFpblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0fHwodD1uZXcgZSh0aGlzLnRhcmdldCkpLHRoaXMuX2NoYWluVHdlZW49dCx0fX0se2tleTpcInN0YXJ0XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hY3RpdmU9ITAsdGhpc319LHtrZXk6XCJzdG9wXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hY3RpdmU9ITEsdGhpcy5lbWl0KFwic3RvcFwiKSx0aGlzfX0se2tleTpcInRvXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX3RvPXQsdGhpc319LHtrZXk6XCJmcm9tXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2Zyb209dCx0aGlzfX0se2tleTpcInJlbW92ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWFuYWdlcj8odGhpcy5tYW5hZ2VyLnJlbW92ZVR3ZWVuKHRoaXMpLHRoaXMpOnRoaXN9fSx7a2V5OlwiY2xlYXJcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMudGltZT0wLHRoaXMuYWN0aXZlPSExLHRoaXMuZWFzaW5nPWdbXCJkZWZhdWx0XCJdLmxpbmVhcigpLHRoaXMuZXhwaXJlPSExLHRoaXMucmVwZWF0PTAsdGhpcy5sb29wPSExLHRoaXMuZGVsYXk9MCx0aGlzLnBpbmdQb25nPSExLHRoaXMuaXNTdGFydGVkPSExLHRoaXMuaXNFbmRlZD0hMSx0aGlzLl90bz1udWxsLHRoaXMuX2Zyb209bnVsbCx0aGlzLl9kZWxheVRpbWU9MCx0aGlzLl9lbGFwc2VkVGltZT0wLHRoaXMuX3JlcGVhdD0wLHRoaXMuX3BpbmdQb25nPSExLHRoaXMuX2NoYWluVHdlZW49bnVsbCx0aGlzLnBhdGg9bnVsbCx0aGlzLnBhdGhSZXZlcnNlPSExLHRoaXMucGF0aEZyb209MCx0aGlzLnBhdGhUbz0wfX0se2tleTpcInJlc2V0XCIsdmFsdWU6ZnVuY3Rpb24oKXtpZih0aGlzLl9lbGFwc2VkVGltZT0wLHRoaXMuX3JlcGVhdD0wLHRoaXMuX2RlbGF5VGltZT0wLHRoaXMuaXNTdGFydGVkPSExLHRoaXMuaXNFbmRlZD0hMSx0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyl7dmFyIHQ9dGhpcy5fdG8sZT10aGlzLl9mcm9tO3RoaXMuX3RvPWUsdGhpcy5fZnJvbT10LHRoaXMuX3BpbmdQb25nPSExfXJldHVybiB0aGlzfX0se2tleTpcInVwZGF0ZVwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7aWYodGhpcy5fY2FuVXBkYXRlKCl8fCF0aGlzLl90byYmIXRoaXMucGF0aCl7dmFyIG49dm9pZCAwLGk9dm9pZCAwO2lmKHRoaXMuZGVsYXk+dGhpcy5fZGVsYXlUaW1lKXJldHVybiB2b2lkKHRoaXMuX2RlbGF5VGltZSs9ZSk7dGhpcy5pc1N0YXJ0ZWR8fCh0aGlzLl9wYXJzZURhdGEoKSx0aGlzLmlzU3RhcnRlZD0hMCx0aGlzLmVtaXQoXCJzdGFydFwiKSk7dmFyIHI9dGhpcy5waW5nUG9uZz90aGlzLnRpbWUvMjp0aGlzLnRpbWU7aWYocj50aGlzLl9lbGFwc2VkVGltZSl7dmFyIHM9dGhpcy5fZWxhcHNlZFRpbWUrZSxvPXM+PXI7dGhpcy5fZWxhcHNlZFRpbWU9bz9yOnMsdGhpcy5fYXBwbHkocik7dmFyIGE9dGhpcy5fcGluZ1Bvbmc/cit0aGlzLl9lbGFwc2VkVGltZTp0aGlzLl9lbGFwc2VkVGltZTtpZih0aGlzLmVtaXQoXCJ1cGRhdGVcIixhKSxvKXtpZih0aGlzLnBpbmdQb25nJiYhdGhpcy5fcGluZ1BvbmcpcmV0dXJuIHRoaXMuX3BpbmdQb25nPSEwLG49dGhpcy5fdG8saT10aGlzLl9mcm9tLHRoaXMuX2Zyb209bix0aGlzLl90bz1pLHRoaXMucGF0aCYmKG49dGhpcy5wYXRoVG8saT10aGlzLnBhdGhGcm9tLHRoaXMucGF0aFRvPWksdGhpcy5wYXRoRnJvbT1uKSx0aGlzLmVtaXQoXCJwaW5ncG9uZ1wiKSx2b2lkKHRoaXMuX2VsYXBzZWRUaW1lPTApO2lmKHRoaXMubG9vcHx8dGhpcy5yZXBlYXQ+dGhpcy5fcmVwZWF0KXJldHVybiB0aGlzLl9yZXBlYXQrKyx0aGlzLmVtaXQoXCJyZXBlYXRcIix0aGlzLl9yZXBlYXQpLHRoaXMuX2VsYXBzZWRUaW1lPTAsdm9pZCh0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyYmKG49dGhpcy5fdG8saT10aGlzLl9mcm9tLHRoaXMuX3RvPWksdGhpcy5fZnJvbT1uLHRoaXMucGF0aCYmKG49dGhpcy5wYXRoVG8saT10aGlzLnBhdGhGcm9tLHRoaXMucGF0aFRvPWksdGhpcy5wYXRoRnJvbT1uKSx0aGlzLl9waW5nUG9uZz0hMSkpO3RoaXMuaXNFbmRlZD0hMCx0aGlzLmFjdGl2ZT0hMSx0aGlzLmVtaXQoXCJlbmRcIiksdGhpcy5fY2hhaW5Ud2VlbiYmKHRoaXMuX2NoYWluVHdlZW4uYWRkVG8odGhpcy5tYW5hZ2VyKSx0aGlzLl9jaGFpblR3ZWVuLnN0YXJ0KCkpfX19fX0se2tleTpcIl9wYXJzZURhdGFcIix2YWx1ZTpmdW5jdGlvbigpe2lmKCF0aGlzLmlzU3RhcnRlZCYmKHRoaXMuX2Zyb218fCh0aGlzLl9mcm9tPXt9KSxoKHRoaXMuX3RvLHRoaXMuX2Zyb20sdGhpcy50YXJnZXQpLHRoaXMucGF0aCkpe3ZhciB0PXRoaXMucGF0aC50b3RhbERpc3RhbmNlKCk7dGhpcy5wYXRoUmV2ZXJzZT8odGhpcy5wYXRoRnJvbT10LHRoaXMucGF0aFRvPTApOih0aGlzLnBhdGhGcm9tPTAsdGhpcy5wYXRoVG89dCl9fX0se2tleTpcIl9hcHBseVwiLHZhbHVlOmZ1bmN0aW9uKHQpe2lmKHUodGhpcy5fdG8sdGhpcy5fZnJvbSx0aGlzLnRhcmdldCx0LHRoaXMuX2VsYXBzZWRUaW1lLHRoaXMuZWFzaW5nKSx0aGlzLnBhdGgpe3ZhciBlPXRoaXMucGluZ1Bvbmc/dGhpcy50aW1lLzI6dGhpcy50aW1lLG49dGhpcy5wYXRoRnJvbSxpPXRoaXMucGF0aFRvLXRoaXMucGF0aEZyb20scj1lLHM9dGhpcy5fZWxhcHNlZFRpbWUvcixvPW4raSp0aGlzLmVhc2luZyhzKSxhPXRoaXMucGF0aC5nZXRQb2ludEF0RGlzdGFuY2Uobyk7dGhpcy50YXJnZXQucG9zaXRpb24uc2V0KGEueCxhLnkpfX19LHtrZXk6XCJfY2FuVXBkYXRlXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aW1lJiZ0aGlzLmFjdGl2ZSYmdGhpcy50YXJnZXR9fV0pLGV9KHAudXRpbHMuRXZlbnRFbWl0dGVyKTtlW1wiZGVmYXVsdFwiXT12fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIHIodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89bigzKSxhPWkobyksdT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtyKHRoaXMsdCksdGhpcy50d2VlbnM9W10sdGhpcy5fdHdlZW5zVG9EZWxldGU9W10sdGhpcy5fbGFzdD0wfXJldHVybiBzKHQsW3trZXk6XCJ1cGRhdGVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT12b2lkIDA7dHx8MD09PXQ/ZT0xZTMqdDooZT10aGlzLl9nZXREZWx0YU1TKCksdD1lLzFlMyk7Zm9yKHZhciBuPTA7bjx0aGlzLnR3ZWVucy5sZW5ndGg7bisrKXt2YXIgaT10aGlzLnR3ZWVuc1tuXTtpLmFjdGl2ZSYmKGkudXBkYXRlKHQsZSksaS5pc0VuZGVkJiZpLmV4cGlyZSYmaS5yZW1vdmUoKSl9aWYodGhpcy5fdHdlZW5zVG9EZWxldGUubGVuZ3RoKXtmb3IodmFyIG49MDtuPHRoaXMuX3R3ZWVuc1RvRGVsZXRlLmxlbmd0aDtuKyspdGhpcy5fcmVtb3ZlKHRoaXMuX3R3ZWVuc1RvRGVsZXRlW25dKTt0aGlzLl90d2VlbnNUb0RlbGV0ZS5sZW5ndGg9MH19fSx7a2V5OlwiZ2V0VHdlZW5zRm9yVGFyZ2V0XCIsdmFsdWU6ZnVuY3Rpb24odCl7Zm9yKHZhciBlPVtdLG49MDtuPHRoaXMudHdlZW5zLmxlbmd0aDtuKyspdGhpcy50d2VlbnNbbl0udGFyZ2V0PT09dCYmZS5wdXNoKHRoaXMudHdlZW5zW25dKTtyZXR1cm4gZX19LHtrZXk6XCJjcmVhdGVUd2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBuZXcgYVtcImRlZmF1bHRcIl0odCx0aGlzKX19LHtrZXk6XCJhZGRUd2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3QubWFuYWdlcj10aGlzLHRoaXMudHdlZW5zLnB1c2godCl9fSx7a2V5OlwicmVtb3ZlVHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLl90d2VlbnNUb0RlbGV0ZS5wdXNoKHQpfX0se2tleTpcIl9yZW1vdmVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLnR3ZWVucy5pbmRleE9mKHQpOy0xIT09ZSYmdGhpcy50d2VlbnMuc3BsaWNlKGUsMSl9fSx7a2V5OlwiX2dldERlbHRhTVNcIix2YWx1ZTpmdW5jdGlvbigpezA9PT10aGlzLl9sYXN0JiYodGhpcy5fbGFzdD1EYXRlLm5vdygpKTt2YXIgdD1EYXRlLm5vdygpLGU9dC10aGlzLl9sYXN0O3JldHVybiB0aGlzLl9sYXN0PXQsZX19XSksdH0oKTtlW1wiZGVmYXVsdFwiXT11fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1mdW5jdGlvbiByKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgcz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPW4oMSksYT1pKG8pLHU9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7cih0aGlzLHQpLHRoaXMuX2NvbHNlZD0hMSx0aGlzLnBvbHlnb249bmV3IGEuUG9seWdvbix0aGlzLnBvbHlnb24uY2xvc2VkPSExLHRoaXMuX3RtcFBvaW50PW5ldyBhLlBvaW50LHRoaXMuX3RtcFBvaW50Mj1uZXcgYS5Qb2ludCx0aGlzLl90bXBEaXN0YW5jZT1bXSx0aGlzLmN1cnJlbnRQYXRoPW51bGwsdGhpcy5ncmFwaGljc0RhdGE9W10sdGhpcy5kaXJ0eT0hMH1yZXR1cm4gcyh0LFt7a2V5OlwibW92ZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUubW92ZVRvLmNhbGwodGhpcyx0LGUpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJsaW5lVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5saW5lVG8uY2FsbCh0aGlzLHQsZSksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImJlemllckN1cnZlVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpLHIscyl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmJlemllckN1cnZlVG8uY2FsbCh0aGlzLHQsZSxuLGkscixzKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwicXVhZHJhdGljQ3VydmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5xdWFkcmF0aWNDdXJ2ZVRvLmNhbGwodGhpcyx0LGUsbixpKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiYXJjVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpLHIpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5hcmNUby5jYWxsKHRoaXMsdCxlLG4saSxyKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiYXJjXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSxyLHMpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5hcmMuY2FsbCh0aGlzLHQsZSxuLGkscixzKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiZHJhd1NoYXBlXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmRyYXdTaGFwZS5jYWxsKHRoaXMsdCksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImdldFBvaW50XCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5wYXJzZVBvaW50cygpO3ZhciBlPXRoaXMuY2xvc2VkJiZ0Pj10aGlzLmxlbmd0aC0xPzA6Mip0O3JldHVybiB0aGlzLl90bXBQb2ludC5zZXQodGhpcy5wb2x5Z29uLnBvaW50c1tlXSx0aGlzLnBvbHlnb24ucG9pbnRzW2UrMV0pLHRoaXMuX3RtcFBvaW50fX0se2tleTpcImRpc3RhbmNlQmV0d2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7dGhpcy5wYXJzZVBvaW50cygpO3ZhciBuPXRoaXMuZ2V0UG9pbnQodCksaT1uLngscj1uLnkscz10aGlzLmdldFBvaW50KGUpLG89cy54LGE9cy55LHU9by1pLGg9YS1yO3JldHVybiBNYXRoLnNxcnQodSp1K2gqaCl9fSx7a2V5OlwidG90YWxEaXN0YW5jZVwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5wYXJzZVBvaW50cygpLHRoaXMuX3RtcERpc3RhbmNlLmxlbmd0aD0wLHRoaXMuX3RtcERpc3RhbmNlLnB1c2goMCk7Zm9yKHZhciB0PXRoaXMubGVuZ3RoLGU9MCxuPTA7dC0xPm47bisrKWUrPXRoaXMuZGlzdGFuY2VCZXR3ZWVuKG4sbisxKSx0aGlzLl90bXBEaXN0YW5jZS5wdXNoKGUpO3JldHVybiBlfX0se2tleTpcImdldFBvaW50QXRcIix2YWx1ZTpmdW5jdGlvbih0KXtpZih0aGlzLnBhcnNlUG9pbnRzKCksdD50aGlzLmxlbmd0aClyZXR1cm4gdGhpcy5nZXRQb2ludCh0aGlzLmxlbmd0aC0xKTtpZih0JTE9PT0wKXJldHVybiB0aGlzLmdldFBvaW50KHQpO3RoaXMuX3RtcFBvaW50Mi5zZXQoMCwwKTt2YXIgZT10JTEsbj10aGlzLmdldFBvaW50KE1hdGguY2VpbCh0KSksaT1uLngscj1uLnkscz10aGlzLmdldFBvaW50KE1hdGguZmxvb3IodCkpLG89cy54LGE9cy55LHU9LSgoby1pKSplKSxoPS0oKGEtcikqZSk7cmV0dXJuIHRoaXMuX3RtcFBvaW50Mi5zZXQobyt1LGEraCksdGhpcy5fdG1wUG9pbnQyfX0se2tleTpcImdldFBvaW50QXREaXN0YW5jZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMucGFyc2VQb2ludHMoKSx0aGlzLl90bXBEaXN0YW5jZXx8dGhpcy50b3RhbERpc3RhbmNlKCk7dmFyIGU9dGhpcy5fdG1wRGlzdGFuY2UubGVuZ3RoLG49MCxpPXRoaXMuX3RtcERpc3RhbmNlW3RoaXMuX3RtcERpc3RhbmNlLmxlbmd0aC0xXTswPnQ/dD1pK3Q6dD5pJiYodC09aSk7Zm9yKHZhciByPTA7ZT5yJiYodD49dGhpcy5fdG1wRGlzdGFuY2Vbcl0mJihuPXIpLCEodDx0aGlzLl90bXBEaXN0YW5jZVtyXSkpO3IrKyk7aWYobj09PXRoaXMubGVuZ3RoLTEpcmV0dXJuIHRoaXMuZ2V0UG9pbnRBdChuKTt2YXIgcz10LXRoaXMuX3RtcERpc3RhbmNlW25dLG89dGhpcy5fdG1wRGlzdGFuY2VbbisxXS10aGlzLl90bXBEaXN0YW5jZVtuXTtyZXR1cm4gdGhpcy5nZXRQb2ludEF0KG4rcy9vKX19LHtrZXk6XCJwYXJzZVBvaW50c1wiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoIXRoaXMuZGlydHkpcmV0dXJuIHRoaXM7dGhpcy5kaXJ0eT0hMSx0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aD0wO2Zvcih2YXIgdD0wO3Q8dGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoO3QrKyl7dmFyIGU9dGhpcy5ncmFwaGljc0RhdGFbdF0uc2hhcGU7ZSYmZS5wb2ludHMmJih0aGlzLnBvbHlnb24ucG9pbnRzPXRoaXMucG9seWdvbi5wb2ludHMuY29uY2F0KGUucG9pbnRzKSl9cmV0dXJuIHRoaXN9fSx7a2V5OlwiY2xlYXJcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg9MCx0aGlzLmN1cnJlbnRQYXRoPW51bGwsdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGg9MCx0aGlzLl9jbG9zZWQ9ITEsdGhpcy5kaXJ0eT0hMSx0aGlzfX0se2tleTpcImNsb3NlZFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jbG9zZWR9LHNldDpmdW5jdGlvbih0KXt0aGlzLl9jbG9zZWQhPT10JiYodGhpcy5wb2x5Z29uLmNsb3NlZD10LHRoaXMuX2Nsb3NlZD10LHRoaXMuZGlydHk9ITApfX0se2tleTpcImxlbmd0aFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aD90aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aC8yKyh0aGlzLl9jbG9zZWQ/MTowKTowfX1dKSx0fSgpO2VbXCJkZWZhdWx0XCJdPXV9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gcih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgcz1uKDEpLG89cihzKSxhPW4oNCksdT1pKGEpLGg9bigzKSxjPWkoaCksbD1uKDUpLGY9aShsKSxwPW4oMiksZD1pKHApO28uR3JhcGhpY3MucHJvdG90eXBlLmRyYXdQYXRoPWZ1bmN0aW9uKHQpe3JldHVybiB0LnBhcnNlUG9pbnRzKCksdGhpcy5kcmF3U2hhcGUodC5wb2x5Z29uKSx0aGlzfTt2YXIgZz17VHdlZW5NYW5hZ2VyOnVbXCJkZWZhdWx0XCJdLFR3ZWVuOmNbXCJkZWZhdWx0XCJdLEVhc2luZzpkW1wiZGVmYXVsdFwiXSxUd2VlblBhdGg6ZltcImRlZmF1bHRcIl19O28udHdlZW5NYW5hZ2VyfHwoby50d2Vlbk1hbmFnZXI9bmV3IHVbXCJkZWZhdWx0XCJdLG8udHdlZW49ZyksZVtcImRlZmF1bHRcIl09Z31dKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktdHdlZW4uanMubWFwIiwiLy8gbWFuYWdlcnNcclxuY29uc3QgU2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4vbWFuYWdlcnMvU2NlbmVzTWFuYWdlcicpO1xyXG5jb25zdCBTcGxhc2hNYW5hZ2VyID0gcmVxdWlyZSgnLi9tYW5hZ2Vycy9TcGxhc2hNYW5hZ2VyJyk7XHJcbmNvbnN0IERlYnVnZ2VyTWFuYWdlciA9IHJlcXVpcmUoJy4vbWFuYWdlcnMvRGVidWdnZXJNYW5hZ2VyJyk7XHJcbi8vIG9iamVjdHNcclxuY29uc3QgU3BoZXJlID0gcmVxdWlyZSgnLi9zdWJqZWN0cy9TcGhlcmUnKTtcclxuXHJcbi8vIGZpbHRlcnNcclxuY29uc3QgR3JheXNjYWxlRmlsdGVyID0gcmVxdWlyZSgnLi9maWx0ZXJzL0dyYXlzY2FsZUZpbHRlcicpO1xyXG5jb25zdCBOb2lzZUJsdXJGaWx0ZXIgPSByZXF1aXJlKCcuL2ZpbHRlcnMvTm9pc2VCbHVyRmlsdGVyJyk7XHJcbmNvbnN0IENsb3Vkc0ZpbHRlciA9IHJlcXVpcmUoJy4vZmlsdGVycy9DbG91ZHNGaWx0ZXInKTtcclxuXHJcblxyXG5jbGFzcyBHYW1lIGV4dGVuZHMgUElYSS5BcHBsaWNhdGlvbiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMubGFuZyA9ICdydSc7XHJcbiAgICB0aGlzLncgPSAxOTIwO1xyXG4gICAgdGhpcy5oID0gODgwO1xyXG5cclxuICAgIHRoaXMuc3RhZ2UuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG4gICAgdGhpcy5zdGFnZS5jdXJzb3IgPSAnbm9uZSc7XHJcblxyXG4gICAgdGhpcy5zY2VuZXMgPSBuZXcgU2NlbmVzTWFuYWdlcih0aGlzKTtcclxuICAgIHRoaXMuc3RhZ2UuYWRkQ2hpbGQodGhpcy5zY2VuZXMpO1xyXG5cclxuICAgIHRoaXMuZ3JheXNjYWxlID0gbmV3IEdyYXlzY2FsZUZpbHRlcigpO1xyXG4gICAgdGhpcy5ub2lzZUJsdXIgPSBuZXcgTm9pc2VCbHVyRmlsdGVyKCk7XHJcbiAgICB0aGlzLnN0YWdlLmZpbHRlcnMgPSBbdGhpcy5ncmF5c2NhbGUsIHRoaXMubm9pc2VCbHVyXTtcclxuXHJcbiAgICB0aGlzLm1vdXNlID0gbmV3IFNwaGVyZSgpO1xyXG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLm1vdXNlKTtcclxuXHJcbiAgICB0aGlzLnNwbGFzaCA9IG5ldyBTcGxhc2hNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLnNwbGFzaCk7XHJcblxyXG4gICAgdGhpcy5kZWJ1ZyA9IG5ldyBEZWJ1Z2dlck1hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLnN0YWdlLmFkZENoaWxkKHRoaXMuZGVidWcpO1xyXG5cclxuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcclxuICAgIHRoaXMuX2luaXRUaWNrZXIoKTtcclxuICAgIHRoaXMucmVzaXplKCk7XHJcblxyXG4gICAgdGhpcy5zcGxhc2guc2hvdygweEVDRUVGRiwgMTAsIDEwMDApO1xyXG4gIH1cclxuICBfYmluZEV2ZW50cygpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMucmVzaXplLmJpbmQodGhpcykpO1xyXG5cclxuICAgIHRoaXMuc3RhZ2Uub24oJ3BvaW50ZXJtb3ZlJywgKGUpID0+IHtcclxuICAgICAgdGhpcy5tb3VzZS5zZXRQb3Moe3g6IGUuZGF0YS5nbG9iYWwueC90aGlzLnNjYWxlLCB5OiBlLmRhdGEuZ2xvYmFsLnkvdGhpcy5zY2FsZX0pO1xyXG4gICAgICB0aGlzLmdyYXlzY2FsZS54ID0gZS5kYXRhLmdsb2JhbC54L3RoaXMudy90aGlzLnNjYWxlO1xyXG4gICAgICB0aGlzLmdyYXlzY2FsZS55ID0gZS5kYXRhLmdsb2JhbC55L3RoaXMuaC90aGlzLnNjYWxlO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnN0YWdlLm9uKCdwb2ludGVydXAnLCAoZSkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLmRhdGEuZ2xvYmFsLngsIGUuZGF0YS5nbG9iYWwueSlcclxuICAgICAgY29uc29sZS5sb2codGhpcy5tb3VzZS5lbWl0dGVyLnNwYXduUG9zLngsIHRoaXMubW91c2UuZW1pdHRlci5zcGF3blBvcy55KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBfaW5pdFRpY2tlcigpIHtcclxuICAgIHRoaXMudGlja2VyLmFkZCgoZHQpID0+IHtcclxuICAgICAgUElYSS50d2Vlbk1hbmFnZXIudXBkYXRlKCk7XHJcbiAgICAgIHRoaXMuc2NlbmVzLnVwZGF0ZShkdCk7XHJcbiAgICAgIHRoaXMubW91c2UudXBkYXRlKGR0KTtcclxuICAgICAgdGhpcy5kZWJ1Zy51cGRhdGUoZHQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJlc2l6ZSgpIHtcclxuICAgIHRoaXMuc2NhbGUgPSB3aW5kb3cuaW5uZXJXaWR0aC90aGlzLnc7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgdGhpcy5oKnRoaXMuc2NhbGUpO1xyXG4gICAgdGhpcy52aWV3LnN0eWxlLm1hcmdpblRvcCA9IHdpbmRvdy5pbm5lckhlaWdodC8yLXRoaXMuaCp0aGlzLnNjYWxlLzIgKyAncHgnO1xyXG4gICAgdGhpcy5zdGFnZS5zY2FsZS5zZXQodGhpcy5zY2FsZSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcbiIsImNsYXNzIExvYWRlciB7XHJcbiAgY29uc3RydWN0b3IoYmFubmVyVXJsLCBvbkxvYWRlZCkge1xyXG4gICAgdGhpcy5iYW5uZXJVcmwgPSBiYW5uZXJVcmw7XHJcbiAgICB0aGlzLm9uTG9hZGVkID0gb25Mb2FkZWQ7XHJcblxyXG4gICAgdGhpcy5iYW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgIHRoaXMuYmFubmVyLnNyYyA9IGJhbm5lclVybDtcclxuICAgIHRoaXMuYmFubmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgIHRoaXMuYmFubmVyLnN0eWxlLnRvcCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQvMi0xMDApICsgJ3B4JztcclxuICAgIHRoaXMuYmFubmVyLnN0eWxlLmxlZnQgPSAod2luZG93LmlubmVyV2lkdGgvMi0yNTYpICsgJ3B4JztcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5iYW5uZXIpO1xyXG5cclxuICAgIHRoaXMuc2hvd0Jhbm5lcigpO1xyXG4gICAgdGhpcy5fbG9hZFJlc291cmNlcygpO1xyXG4gIH1cclxuICBzaG93QmFubmVyKCkge1xyXG4gICAgdGhpcy5iYW5uZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgfVxyXG4gIGhpZGVCYW5uZXIoKSB7XHJcbiAgICB0aGlzLmJhbm5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgdGhpcy5vbkxvYWRlZCAmJiB0aGlzLm9uTG9hZGVkKCk7XHJcbiAgfVxyXG4gIF9sb2FkUmVzb3VyY2VzKCkge1xyXG4gICAgUElYSS5sb2FkZXJcclxuICAgICAgLmFkZCgnc3VuJywgJ2Fzc2V0cy9tZW51L3N1bi5wbmcnKVxyXG4gICAgICAuYWRkKCdza3knLCAnYXNzZXRzL21lbnUvc2t5LnBuZycpXHJcbiAgICAgIC5hZGQoJ21vdW50JywgJ2Fzc2V0cy9tZW51L21vdW50LnBuZycpXHJcbiAgICAgIC5hZGQoJ2Nsb3VkJywgJ2Fzc2V0cy9tZW51L2Nsb3VkLnBuZycpXHJcblxyXG4gICAgICAuYWRkKCdiZycsICdhc3NldHMvYmcucG5nJylcclxuICAgICAgLmFkZCgndGhsZW4nLCAnYXNzZXRzL3RobGVuLnBuZycpXHJcblxyXG4gICAgICAuYWRkKCdwbGF5ZXInLCAnYXNzZXRzL3Nwcml0ZXNoZWV0cy9wbGF5ZXIuanNvbicpXHJcbiAgICAgIC5hZGQoJ2Jsb2NrcycsICdhc3NldHMvc3ByaXRlc2hlZXRzL2Jsb2Nrcy5qc29uJylcclxuXHJcbiAgICAgIC5hZGQoJ2Rpc3BsYWNlbWVudCcsICdhc3NldHMvZmlsdGVycy9kaXNwbGFjZW1lbnQucG5nJylcclxuICAgICAgLmFkZCgnbm9pc2UnLCAnYXNzZXRzL2ZpbHRlcnMvbm9pc2VfZ3JheXNjYWxlLnBuZycpXHJcbiAgICAgIC5hZGQoJ3BhcnRpY2xlJywgJ2Fzc2V0cy9maWx0ZXJzL3BhcnRpY2xlLnBuZycpXHJcblxyXG4gICAgICAuYWRkKCdoaXN0b3J5X2ZhbWlseScsICdhc3NldHMvaGlzdG9yeS9mYW1pbHkucG5nJylcclxuICAgICAgLmFkZCgnbXVzaWMnLCAnYXNzZXRzL3NvdW5kcy9tdXNpYy5tcDMnKVxyXG4gICAgICAubG9hZCgoKSA9PiB0aGlzLl9sb2FkRm9udHMoKCkgPT4gdGhpcy5oaWRlQmFubmVyKCkpKTtcclxuICB9XHJcbiAgX2xvYWRGb250cyhjYikge1xyXG4gICAgV2ViRm9udC5sb2FkKHtcclxuICAgICAgZ29vZ2xlOiB7XHJcbiAgICAgICAgZmFtaWxpZXM6IFsnQW1hdGljIFNDJ11cclxuICAgICAgfSxcclxuICAgICAgY3VzdG9tOiB7XHJcbiAgICAgICAgZmFtaWxpZXM6IFsnT3BpZmljaW8gQm9sZCddLFxyXG4gICAgICAgIHVybHM6IFsnYXNzZXRzL2ZvbnRzL2ZvbnRzLmNzcyddXHJcbiAgICAgIH0sXHJcbiAgICAgIHRpbWVvdXQ6IDEwMDAsXHJcbiAgICAgIGFjdGl2ZTogY2JcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMb2FkZXI7XHJcbiIsIm1vZHVsZS5leHBvcnRzPXsgXCJjb2x1bW5zXCI6MyxcclxuIFwiaW1hZ2VcIjpcIi4uXFwvLi5cXC93d3dcXC9hc3NldHNcXC9zcHJpdGVzaGVldHNcXC9ibG9ja3MucG5nXCIsXHJcbiBcImltYWdlaGVpZ2h0XCI6NTA1LFxyXG4gXCJpbWFnZXdpZHRoXCI6NTA0LFxyXG4gXCJtYXJnaW5cIjowLFxyXG4gXCJuYW1lXCI6XCJibG9ja3NcIixcclxuIFwic3BhY2luZ1wiOjAsXHJcbiBcInRlcnJhaW5zXCI6W1xyXG4gICAgICAgIHtcclxuICAgICAgICAgXCJuYW1lXCI6XCJcXHUwNDFkXFx1MDQzZVxcdTA0MzJcXHUwNDRiXFx1MDQzOSBcXHUwNDQzXFx1MDQ0N1xcdTA0MzBcXHUwNDQxXFx1MDQ0MlxcdTA0M2VcXHUwNDNhXCIsXHJcbiAgICAgICAgIFwidGlsZVwiOjBcclxuICAgICAgICB9XSxcclxuIFwidGlsZWNvdW50XCI6OSxcclxuIFwidGlsZWhlaWdodFwiOjE1MCxcclxuIFwidGlsZXByb3BlcnRpZXNcIjpcclxuICAgIHtcclxuICAgICBcIjBcIjpcclxuICAgICAgICB7XHJcbiAgICAgICAgIFwiYWN0aXZhdGVkVGV4dHVyZVwiOlwiYmxvY2tBY3RpdmF0ZWRcIixcclxuICAgICAgICAgXCJhY3RpdmF0aW9uXCI6OCxcclxuICAgICAgICAgXCJhY3RpdmVcIjpmYWxzZSxcclxuICAgICAgICAgXCJkZWFjdGl2YXRlZFRleHR1cmVcIjpcImJsb2NrRGVhY3RpdmF0ZWRcIixcclxuICAgICAgICAgXCJzY29yZVwiOjFcclxuICAgICAgICB9LFxyXG4gICAgIFwiMVwiOlxyXG4gICAgICAgIHtcclxuICAgICAgICAgXCJhY3RpdmF0ZWRUZXh0dXJlXCI6XCJibG9jazNBY3RpdmF0ZWRcIixcclxuICAgICAgICAgXCJhY3RpdmVcIjp0cnVlLFxyXG4gICAgICAgICBcImRlYWN0aXZhdGVkVGV4dHVyZVwiOlwiXCIsXHJcbiAgICAgICAgIFwic2NvcmVcIjoxXHJcbiAgICAgICAgfSxcclxuICAgICBcIjNcIjpcclxuICAgICAgICB7XHJcbiAgICAgICAgIFwiYWN0aXZhdGVkVGV4dHVyZVwiOlwiXCIsXHJcbiAgICAgICAgIFwiYWN0aXZlXCI6ZmFsc2UsXHJcbiAgICAgICAgIFwiZGVhY3RpdmF0ZWRUZXh0dXJlXCI6XCJibG9jazJEZWFjdGl2YXRlZFwiLFxyXG4gICAgICAgICBcInNjb3JlXCI6MFxyXG4gICAgICAgIH0sXHJcbiAgICAgXCI0XCI6XHJcbiAgICAgICAge1xyXG4gICAgICAgICBcImFjdGl2YXRlZFRleHR1cmVcIjpcImJsb2NrNEFjdGl2YXRlZFwiLFxyXG4gICAgICAgICBcImFjdGl2YXRpb25cIjoyMCxcclxuICAgICAgICAgXCJhY3RpdmVcIjpmYWxzZSxcclxuICAgICAgICAgXCJkZWFjdGl2YXRlZFRleHR1cmVcIjpcImJsb2NrNERlYWN0aXZhdGVkXCIsXHJcbiAgICAgICAgIFwic2NvcmVcIjoxXHJcbiAgICAgICAgfSxcclxuICAgICBcIjZcIjpcclxuICAgICAgICB7XHJcbiAgICAgICAgIFwiYWN0aXZhdGVkVGV4dHVyZVwiOlwiYmxvY2tBY3RpdmF0ZWRcIixcclxuICAgICAgICAgXCJhY3RpdmF0aW9uXCI6MCxcclxuICAgICAgICAgXCJhY3RpdmVcIjp0cnVlLFxyXG4gICAgICAgICBcImRlYWN0aXZhdGVkVGV4dHVyZVwiOlwiYmxvY2tEZWFjdGl2YXRlZFwiLFxyXG4gICAgICAgICBcInNjb3JlXCI6MVxyXG4gICAgICAgIH0sXHJcbiAgICAgXCI3XCI6XHJcbiAgICAgICAge1xyXG4gICAgICAgICBcImFjdGl2YXRlZFRleHR1cmVcIjpcImJsb2NrNEFjdGl2YXRlZFwiLFxyXG4gICAgICAgICBcImFjdGl2YXRpb25cIjowLFxyXG4gICAgICAgICBcImFjdGl2ZVwiOnRydWUsXHJcbiAgICAgICAgIFwiZGVhY3RpdmF0ZWRUZXh0dXJlXCI6XCJibG9jazREZWFjdGl2YXRlZFwiLFxyXG4gICAgICAgICBcInNjb3JlXCI6MVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiBcInRpbGVwcm9wZXJ0eXR5cGVzXCI6XHJcbiAgICB7XHJcbiAgICAgXCIwXCI6XHJcbiAgICAgICAge1xyXG4gICAgICAgICBcImFjdGl2YXRlZFRleHR1cmVcIjpcInN0cmluZ1wiLFxyXG4gICAgICAgICBcImFjdGl2YXRpb25cIjpcImludFwiLFxyXG4gICAgICAgICBcImFjdGl2ZVwiOlwiYm9vbFwiLFxyXG4gICAgICAgICBcImRlYWN0aXZhdGVkVGV4dHVyZVwiOlwic3RyaW5nXCIsXHJcbiAgICAgICAgIFwic2NvcmVcIjpcImludFwiXHJcbiAgICAgICAgfSxcclxuICAgICBcIjFcIjpcclxuICAgICAgICB7XHJcbiAgICAgICAgIFwiYWN0aXZhdGVkVGV4dHVyZVwiOlwic3RyaW5nXCIsXHJcbiAgICAgICAgIFwiYWN0aXZlXCI6XCJib29sXCIsXHJcbiAgICAgICAgIFwiZGVhY3RpdmF0ZWRUZXh0dXJlXCI6XCJzdHJpbmdcIixcclxuICAgICAgICAgXCJzY29yZVwiOlwiaW50XCJcclxuICAgICAgICB9LFxyXG4gICAgIFwiM1wiOlxyXG4gICAgICAgIHtcclxuICAgICAgICAgXCJhY3RpdmF0ZWRUZXh0dXJlXCI6XCJzdHJpbmdcIixcclxuICAgICAgICAgXCJhY3RpdmVcIjpcImJvb2xcIixcclxuICAgICAgICAgXCJkZWFjdGl2YXRlZFRleHR1cmVcIjpcInN0cmluZ1wiLFxyXG4gICAgICAgICBcInNjb3JlXCI6XCJpbnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgXCI0XCI6XHJcbiAgICAgICAge1xyXG4gICAgICAgICBcImFjdGl2YXRlZFRleHR1cmVcIjpcInN0cmluZ1wiLFxyXG4gICAgICAgICBcImFjdGl2YXRpb25cIjpcImludFwiLFxyXG4gICAgICAgICBcImFjdGl2ZVwiOlwiYm9vbFwiLFxyXG4gICAgICAgICBcImRlYWN0aXZhdGVkVGV4dHVyZVwiOlwic3RyaW5nXCIsXHJcbiAgICAgICAgIFwic2NvcmVcIjpcImludFwiXHJcbiAgICAgICAgfSxcclxuICAgICBcIjZcIjpcclxuICAgICAgICB7XHJcbiAgICAgICAgIFwiYWN0aXZhdGVkVGV4dHVyZVwiOlwic3RyaW5nXCIsXHJcbiAgICAgICAgIFwiYWN0aXZhdGlvblwiOlwiaW50XCIsXHJcbiAgICAgICAgIFwiYWN0aXZlXCI6XCJib29sXCIsXHJcbiAgICAgICAgIFwiZGVhY3RpdmF0ZWRUZXh0dXJlXCI6XCJzdHJpbmdcIixcclxuICAgICAgICAgXCJzY29yZVwiOlwiaW50XCJcclxuICAgICAgICB9LFxyXG4gICAgIFwiN1wiOlxyXG4gICAgICAgIHtcclxuICAgICAgICAgXCJhY3RpdmF0ZWRUZXh0dXJlXCI6XCJzdHJpbmdcIixcclxuICAgICAgICAgXCJhY3RpdmF0aW9uXCI6XCJpbnRcIixcclxuICAgICAgICAgXCJhY3RpdmVcIjpcImJvb2xcIixcclxuICAgICAgICAgXCJkZWFjdGl2YXRlZFRleHR1cmVcIjpcInN0cmluZ1wiLFxyXG4gICAgICAgICBcInNjb3JlXCI6XCJpbnRcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiBcInRpbGV3aWR0aFwiOjE1MCxcclxuIFwidHlwZVwiOlwidGlsZXNldFwiXHJcbn0iLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgXCIwXCI6IHtcclxuICAgIFwidGV4dFwiOiB7XHJcbiAgICAgIFwicnVcIjogXCLQotC70LXQvSDQuNC00LXRgiDQt9CwINGC0L7QsdC+0Lkg0L/QviDQv9GP0YLQsNC8LiBcXG4g0J7RgtGB0YLRg9C/0LjRgdGMINC4INC+0L0g0YLQtdCx0Y8g0L/QvtCz0LvQsNGC0LjRgi4uLiBcXG4g0J3QviDQvdC1INGB0YLQvtC40YIg0L7RgtGH0LDQuNCy0LDRgtGM0YHRjywg0LLQtdC00Ywg0LzRg9C30YvQutCwINCy0YHQtdCz0LTQsCDRgSDRgtC+0LHQvtC5LlwiXHJcbiAgICB9LFxyXG4gICAgXCJ0aW1lXCI6IDYwMDAsXHJcbiAgICBcImltYWdlXCI6IFwiaGlzdG9yeV9mYW1pbHlcIlxyXG4gIH0sXHJcbiAgXCIxXCI6IHtcclxuICAgIFwidGV4dFwiOiB7XHJcbiAgICAgIFwicnVcIjogXCLQotC70LXQvSDQvdC1INGJ0LDQtNC40YIg0L3QuNC60L7Qs9C+LiDQm9C10YLRg9GH0LjQtSDQt9C80LXQuCDQv9Cw0LTRg9GCINC90LAg0LfQtdC80LvRjiDQuCDQv9C+0LPRgNGD0LfRj9GC0YHRjyDQsiDRgNGD0YLQuNC90YMg0LHRi9GC0LjRjy4uLlwiXHJcbiAgICB9LFxyXG4gICAgXCJ0aW1lXCI6IDYwMDAsXHJcbiAgICBcImltYWdlXCI6IFwiaGlzdG9yeV9mYW1pbHlcIlxyXG4gIH0sXHJcbiAgXCIyXCI6IHtcclxuICAgIFwidGV4dFwiOiB7XHJcbiAgICAgIFwicnVcIjogXCLQmCDRgtC+0LPQtNCwINC+0L0g0L/QvtC90LXRgSDRgdCy0LXRh9GDINGH0LXRgNC10Lcg0YfRg9C20LjQtSDQt9C10LzQu9C4INC+0YHQstC+0LHQvtC20LTQsNGPINC70LXRgtGD0YfQuNGFINC30LzQtdC5INC4INGB0LLQvtC5INC90LDRgNC+0LQuLi5cIlxyXG4gICAgfSxcclxuICAgIFwidGltZVwiOiA2MDAwLFxyXG4gICAgXCJpbWFnZVwiOiBcImhpc3RvcnlfZmFtaWx5XCJcclxuICB9LFxyXG4gIFwiM1wiOiB7XHJcbiAgICBcInRleHRcIjoge1xyXG4gICAgICBcInJ1XCI6IFwi0J/RgNC+0LTQvtC70LbQtdC90LjQtSDRgdC70LXQtNGD0LXRgi4uLlwiXHJcbiAgICB9LFxyXG4gICAgXCJ0aW1lXCI6IDYwMDAsXHJcbiAgICBcImltYWdlXCI6IFwiaGlzdG9yeV9mYW1pbHlcIlxyXG4gIH1cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cz17IFwiaGVpZ2h0XCI6MTAwLFxyXG4gXCJsYXllcnNcIjpbXHJcbiAgICAgICAge1xyXG4gICAgICAgICBcImRhdGFcIjpbNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgNywgMSwgNywgNywgNywgNywgNywgNywgNywgNywgNywgMSwgMSwgMSwgNywgNywgNywgNywgNywgNywgNywgNywgMSwgMSwgMSwgNywgMSwgMSwgNywgNywgNywgNywgNywgMSwgMSwgMCwgMSwgMSwgMSwgNywgNywgNywgNywgNywgMSwgMCwgMCwgMSwgMSwgMSwgMSwgNywgNywgNywgMSwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMCwgMSwgMSwgNSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgNCwgNCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgNCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNCwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgNCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgNCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNCwgNSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNSwgNCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgNCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNSwgNSwgNSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgNSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgNSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgNCwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNCwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNywgNywgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNywgNywgNywgNywgMCwgMCwgMCwgMCwgMCwgMCwgNywgNywgNywgNywgNywgNywgMCwgMCwgMCwgMCwgMCwgNywgNywgNywgNywgNywgNywgNywgMCwgMF0sXHJcbiAgICAgICAgIFwiaGVpZ2h0XCI6MTAwLFxyXG4gICAgICAgICBcIm5hbWVcIjpcIm1hcFwiLFxyXG4gICAgICAgICBcIm9wYWNpdHlcIjoxLFxyXG4gICAgICAgICBcInR5cGVcIjpcInRpbGVsYXllclwiLFxyXG4gICAgICAgICBcInZpc2libGVcIjp0cnVlLFxyXG4gICAgICAgICBcIndpZHRoXCI6MTEsXHJcbiAgICAgICAgIFwieFwiOjAsXHJcbiAgICAgICAgIFwieVwiOjBcclxuICAgICAgICB9LCBcclxuICAgICAgICB7XHJcbiAgICAgICAgIFwiZGF0YVwiOlswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICAgXCJoZWlnaHRcIjoxMDAsXHJcbiAgICAgICAgIFwibmFtZVwiOlwidHJpZ2dlcnNcIixcclxuICAgICAgICAgXCJvcGFjaXR5XCI6MC4zMzAwMDAwMTMxMTMwMjIsXHJcbiAgICAgICAgIFwidHlwZVwiOlwidGlsZWxheWVyXCIsXHJcbiAgICAgICAgIFwidmlzaWJsZVwiOnRydWUsXHJcbiAgICAgICAgIFwid2lkdGhcIjoxMSxcclxuICAgICAgICAgXCJ4XCI6MCxcclxuICAgICAgICAgXCJ5XCI6MFxyXG4gICAgICAgIH1dLFxyXG4gXCJuZXh0b2JqZWN0aWRcIjoxLFxyXG4gXCJvcmllbnRhdGlvblwiOlwib3J0aG9nb25hbFwiLFxyXG4gXCJyZW5kZXJvcmRlclwiOlwicmlnaHQtZG93blwiLFxyXG4gXCJ0aWxlZHZlcnNpb25cIjpcIjEuMC4zXCIsXHJcbiBcInRpbGVoZWlnaHRcIjoxNTAsXHJcbiBcInRpbGVzZXRzXCI6W1xyXG4gICAgICAgIHtcclxuICAgICAgICAgXCJmaXJzdGdpZFwiOjEsXHJcbiAgICAgICAgIFwic291cmNlXCI6XCJibG9ja3MuanNvblwiXHJcbiAgICAgICAgfV0sXHJcbiBcInRpbGV3aWR0aFwiOjE1MCxcclxuIFwidHlwZVwiOlwibWFwXCIsXHJcbiBcInZlcnNpb25cIjoxLFxyXG4gXCJ3aWR0aFwiOjExXHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlKHBhcmFtcyl7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgc3RhcnRHcmFkaWVudDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IGVuZEdyYWRpZW50OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZvaWQgbWFpbigpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgaWYodlRleHR1cmVDb29yZC55ID4gc3RhcnRHcmFkaWVudCkgZ2xfRnJhZ0NvbG9yID0gY29sb3I7IFxcblwiICtcclwiIFxcblwiICtcblwiICBlbHNlIGlmKHZUZXh0dXJlQ29vcmQueSA8IGVuZEdyYWRpZW50KSBnbF9GcmFnQ29sb3IgPSBjb2xvciowLjA7IFxcblwiICtcclwiIFxcblwiICtcblwiICBlbHNlIGdsX0ZyYWdDb2xvciA9IGNvbG9yKih2VGV4dHVyZUNvb3JkLnktZW5kR3JhZGllbnQpLyhzdGFydEdyYWRpZW50LWVuZEdyYWRpZW50KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiIFxuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9XG4gICAgICBmb3IodmFyIGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgdmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFwie3tcIitrZXkrXCJ9fVwiLFwiZ1wiKVxuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UobWF0Y2hlciwgcGFyYW1zW2tleV0pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcGxhdGVcbiAgICB9O1xuIiwiY29uc3QgZnJhZyA9IHJlcXVpcmUoJy4vYWxwaGEuZnJhZycpO1xyXG5jb25zdCB2ZXJ0ID0gcmVxdWlyZSgnLi4vYmFzaWMudmVydCcpO1xyXG5cclxuY2xhc3MgQWxwaGFHcmFkaWVudEZpbHRlciBleHRlbmRzIFBJWEkuRmlsdGVyIHtcclxuICBjb25zdHJ1Y3RvcihzdGFydEdyYWRpZW50LCBlbmRHcmFkaWVudCkge1xyXG4gICAgc3VwZXIodmVydCgpLCBmcmFnKCkpO1xyXG5cclxuICAgIHRoaXMuc3RhcnRHcmFkaWVudCA9IHN0YXJ0R3JhZGllbnQgfHwgLjU7XHJcbiAgICB0aGlzLmVuZEdyYWRpZW50ID0gZW5kR3JhZGllbnQgfHwgLjI7XHJcbiAgfVxyXG4gIHNldCBzdGFydEdyYWRpZW50KHYpIHtcclxuICAgIHRoaXMudW5pZm9ybXMuc3RhcnRHcmFkaWVudCA9IHY7XHJcbiAgfVxyXG4gIGdldCBzdGFydEdyYWRpZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5pZm9ybXMuc3RhcnRHcmFkaWVudDtcclxuICB9XHJcbiAgc2V0IGVuZEdyYWRpZW50KHYpIHtcclxuICAgIHRoaXMudW5pZm9ybXMuZW5kR3JhZGllbnQgPSB2O1xyXG4gIH1cclxuICBnZXQgZW5kR3JhZGllbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5lbmRHcmFkaWVudDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWxwaGFHcmFkaWVudEZpbHRlcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShwYXJhbXMpe1xuICAgICAgdmFyIHRlbXBsYXRlID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIHNhbXBsZXIyRCBub2lzZVRleHR1cmU7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBmbG9hdCBpVGltZTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvL1NFVFRJTkdTLy8gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJjb25zdCBmbG9hdCB0aW1lU2NhbGUgPSAxMC4wOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cImNvbnN0IGZsb2F0IGNsb3VkU2NhbGUgPSAxLjU7IFxcblwiICtcclwiIFxcblwiICtcblwiY29uc3QgZmxvYXQgc2t5Q292ZXIgPSAwLjY7IC8vb3ZlcndyaXR0ZW4gYnkgbW91c2UgeCBkcmFnIFxcblwiICtcclwiIFxcblwiICtcblwiY29uc3QgZmxvYXQgc29mdG5lc3MgPSAwLjI7IFxcblwiICtcclwiIFxcblwiICtcblwiY29uc3QgZmxvYXQgYnJpZ2h0bmVzcyA9IDEuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJjb25zdCBpbnQgbm9pc2VPY3RhdmVzID0gODsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJjb25zdCBmbG9hdCBjdXJsU3RyYWluID0gMy4wOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vU0VUVElOR1MvLyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cImZsb2F0IHNhdHVyYXRlKGZsb2F0IG51bSkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICByZXR1cm4gY2xhbXAobnVtLCAwLjAsIDEuMCk7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cImZsb2F0IG5vaXNlKHZlYzIgdXYpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgcmV0dXJuIHRleHR1cmUyRChub2lzZVRleHR1cmUsIHV2KS5yOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2ZWMyIHJvdGF0ZSh2ZWMyIHV2KSB7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIHV2ID0gdXYgKyBub2lzZSh1diowLjIpKjAuMDA1OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmbG9hdCByb3QgPSBjdXJsU3RyYWluOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmbG9hdCBzaW5Sb3Q9c2luKHJvdCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIGZsb2F0IGNvc1JvdD1jb3Mocm90KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgbWF0MiByb3RNYXQgPSBtYXQyKGNvc1JvdCwtc2luUm90LHNpblJvdCxjb3NSb3QpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICByZXR1cm4gdXYgKiByb3RNYXQ7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cImZsb2F0IGZibSAodmVjMiB1dikgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmbG9hdCByb3QgPSAxLjU3OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmbG9hdCBzaW5Sb3Q9c2luKHJvdCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIGZsb2F0IGNvc1JvdD1jb3Mocm90KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgZmxvYXQgZiA9IDAuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgZmxvYXQgdG90YWwgPSAwLjA7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIGZsb2F0IG11bCA9IDAuNTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgbWF0MiByb3RNYXQgPSBtYXQyKGNvc1JvdCwtc2luUm90LHNpblJvdCxjb3NSb3QpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBmb3IoaW50IGkgPSAwOyBpIDwgbm9pc2VPY3RhdmVzOyBpKyspIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgICAgIGYgKz0gbm9pc2UodXYraVRpbWUqMC4wMDAxNSp0aW1lU2NhbGUqKDEuMC1tdWwpKSptdWw7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgICAgICB0b3RhbCArPSBtdWw7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgICAgICB1diAqPSAzLjA7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgICAgICB1dj1yb3RhdGUodXYpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICAgICAgbXVsICo9IDAuNTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgfSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICByZXR1cm4gZi90b3RhbDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidm9pZCBtYWluKCkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMiB1diA9IHZUZXh0dXJlQ29vcmQueHkvKDQwMDAwLjAqY2xvdWRTY2FsZSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBjb3ZlciA9IDAuNTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIGZsb2F0IGJyaWdodCA9IGJyaWdodG5lc3MqKDEuOC1jb3Zlcik7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBjb2xvcjEgPSBmYm0odlRleHR1cmVDb29yZC54eS0wLjUraVRpbWUqMC4wMDAwNCp0aW1lU2NhbGUpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZmxvYXQgY29sb3IyID0gZmJtKHZUZXh0dXJlQ29vcmQueHktMTAuNStpVGltZSowLjAwMDAyKnRpbWVTY2FsZSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBjbG91ZHMxID0gc21vb3Roc3RlcCgxLjAtY292ZXIsbWluKCgxLjAtY292ZXIpK3NvZnRuZXNzKjIuMCwxLjApLGNvbG9yMSk7IFxcblwiICtcclwiIFxcblwiICtcblwiICBmbG9hdCBjbG91ZHMyID0gc21vb3Roc3RlcCgxLjAtY292ZXIsbWluKCgxLjAtY292ZXIpK3NvZnRuZXNzLDEuMCksY29sb3IyKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIGZsb2F0IGNsb3Vkc0Zvcm1Db21iID0gc2F0dXJhdGUoY2xvdWRzMStjbG91ZHMyKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgc2t5Q29sID0gdmVjNCgwLjYsMC44LDEuMCwxLjApOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZmxvYXQgY2xvdWRDb2wgPSBzYXR1cmF0ZShzYXR1cmF0ZSgxLjAtcG93KGNvbG9yMSwxLjApKjAuMikqYnJpZ2h0KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgY2xvdWRzMUNvbG9yID0gdmVjNChjbG91ZENvbCxjbG91ZENvbCxjbG91ZENvbCwxLjApOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBjbG91ZHMyQ29sb3IgPSBtaXgoY2xvdWRzMUNvbG9yLHNreUNvbCwwLjI1KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgY2xvdWRDb2xDb21iID0gbWl4KGNsb3VkczFDb2xvcixjbG91ZHMyQ29sb3Isc2F0dXJhdGUoY2xvdWRzMi1jbG91ZHMxKSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiXHRnbF9GcmFnQ29sb3IgPSBtaXgodGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKSwgY2xvdWRDb2xDb21iLCBjbG91ZHNGb3JtQ29tYik7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiBcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICAgICAgZm9yKHZhciBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcInt7XCIra2V5K1wifX1cIixcImdcIilcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKG1hdGNoZXIsIHBhcmFtc1trZXldKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgfTtcbiIsImNvbnN0IGZyYWcgPSByZXF1aXJlKCcuL2Nsb3Vkcy5mcmFnJyk7XHJcbmNvbnN0IHZlcnQgPSByZXF1aXJlKCcuLi9iYXNpYy52ZXJ0Jyk7XHJcblxyXG5jbGFzcyBDbG91ZHNGaWx0ZXIgZXh0ZW5kcyBQSVhJLkZpbHRlciB7XHJcbiAgY29uc3RydWN0b3IodGV4dHVyZSkge1xyXG4gICAgc3VwZXIodmVydCgpLCBmcmFnKCkpO1xyXG5cclxuICAgIHRoaXMudGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgdGhpcy5ub2lzZVRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gIH1cclxuICBzZXQgdGltZSh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLmlUaW1lID0gdjtcclxuICB9XHJcbiAgZ2V0IHRpbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5pVGltZTtcclxuICB9XHJcbiAgc2V0IG5vaXNlVGV4dHVyZSh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLm5vaXNlVGV4dHVyZSA9IHY7XHJcbiAgfVxyXG4gIGdldCBub2lzZVRleHR1cmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5ub2lzZVRleHR1cmU7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENsb3Vkc0ZpbHRlcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShwYXJhbXMpe1xuICAgICAgdmFyIHRlbXBsYXRlID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IHg7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBmbG9hdCB5OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgcjsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2b2lkIG1haW4oKSB7IFxcblwiICtcclwiIFxcblwiICtcblwiICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyBncmF5ID0gdmVjMygwLjMsIDAuNTksIDAuMTEpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZmxvYXQgY29sID0gZG90KGdsX0ZyYWdDb2xvci54eXosIGdyYXkpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZmxvYXQgZGlzdCA9IGRpc3RhbmNlKHZUZXh0dXJlQ29vcmQueHksIHZlYzIoeCwgeSkpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgZ2xfRnJhZ0NvbG9yLnh5eiA9IG1peChnbF9GcmFnQ29sb3IueHl6LCB2ZWMzKGNvbCksIG1pbihkaXN0L3IsIDEuMCktLjIpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgXG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge31cbiAgICAgIGZvcih2YXIga2V5IGluIHBhcmFtcykge1xuICAgICAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJ7e1wiK2tleStcIn19XCIsXCJnXCIpXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShtYXRjaGVyLCBwYXJhbXNba2V5XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgIH07XG4iLCJjb25zdCBmcmFnID0gcmVxdWlyZSgnLi9ncmF5c2NhbGUuZnJhZycpO1xyXG5jb25zdCB2ZXJ0ID0gcmVxdWlyZSgnLi4vYmFzaWMudmVydCcpO1xyXG5cclxuY2xhc3MgR3JheXNjYWxlRmlsdGVyIGV4dGVuZHMgUElYSS5GaWx0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKHgsIHksIHIpIHtcclxuICAgIHN1cGVyKHZlcnQoKSwgZnJhZygpKTtcclxuXHJcbiAgICB0aGlzLnggPSB4IHx8IC41O1xyXG4gICAgdGhpcy55ID0geSB8fCAuNTtcclxuICAgIHRoaXMuciA9IHIgfHwgMC44O1xyXG4gIH1cclxuICBzZXQgeCh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLnggPSB2O1xyXG4gIH1cclxuICBnZXQgeCgpIHtcclxuICAgIHJldHVybiB0aGlzLnVuaWZvcm1zLng7XHJcbiAgfVxyXG4gIHNldCB5KHYpIHtcclxuICAgIHRoaXMudW5pZm9ybXMueSA9IHY7XHJcbiAgfVxyXG4gIGdldCB5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5pZm9ybXMueTtcclxuICB9XHJcbiAgc2V0IHIodikge1xyXG4gICAgdGhpcy51bmlmb3Jtcy5yID0gdjtcclxuICB9XHJcbiAgZ2V0IHIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5yO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHcmF5c2NhbGVGaWx0ZXI7XHJcbiIsImNvbnN0IGZyYWcgPSByZXF1aXJlKCcuL25vaXNlQmx1ci5mcmFnJyk7XHJcbmNvbnN0IHZlcnQgPSByZXF1aXJlKCcuLi9iYXNpYy52ZXJ0Jyk7XHJcblxyXG5jbGFzcyBOb2lzZUJsdXJGaWx0ZXIgZXh0ZW5kcyBQSVhJLkZpbHRlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcih2ZXJ0KCksIGZyYWcoKSk7XHJcblxyXG4gICAgdGhpcy5ibHVyUmFkaXVzID0gMC4wMDAyO1xyXG4gIH1cclxuICBzZXQgYmx1clJhZGl1cyh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLmJsdXJSYWRpdXMgPSB2O1xyXG4gIH1cclxuICBnZXQgYmx1clJhZGl1cygpIHtcclxuICAgIHJldHVybiB0aGlzLnVuaWZvcm1zLmJsdXJSYWRpdXM7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5vaXNlQmx1ckZpbHRlcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShwYXJhbXMpe1xuICAgICAgdmFyIHRlbXBsYXRlID0gXCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IGJsdXJSYWRpdXM7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidmVjMiByYW5kb20odmVjMiBwKSB7IFxcblwiICtcclwiIFxcblwiICtcblwiXHRwID0gZnJhY3QocCAqIHZlYzIoNDQzLjg5NywgNDQxLjQyMykpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBwICs9IGRvdChwLCBwLnl4KzE5LjkxKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgcmV0dXJuIGZyYWN0KChwLnh4K3AueXgpKnAueHkpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2b2lkIG1haW4oKSB7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMyIHIgPSByYW5kb20odlRleHR1cmVDb29yZCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICByLnggKj0gNi4yODMwNTMwODsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzIgY3IgPSB2ZWMyKHNpbihyLngpLGNvcyhyLngpKSpzcXJ0KHIueSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiXHRnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQrY3IqYmx1clJhZGl1cyk7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiBcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICAgICAgZm9yKHZhciBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcInt7XCIra2V5K1wifX1cIixcImdcIilcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKG1hdGNoZXIsIHBhcmFtc1trZXldKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2UocGFyYW1zKXtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IFwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cImF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7IFxcblwiICtcclwiIFxcblwiICtcblwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidm9pZCBtYWluKHZvaWQpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgXG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge31cbiAgICAgIGZvcih2YXIga2V5IGluIHBhcmFtcykge1xuICAgICAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJ7e1wiK2tleStcIn19XCIsXCJnXCIpXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShtYXRjaGVyLCBwYXJhbXNba2V5XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgIH07XG4iLCJyZXF1aXJlKCdwaXhpLXNvdW5kJyk7XHJcbnJlcXVpcmUoJ3BpeGktdHdlZW4nKTtcclxucmVxdWlyZSgncGl4aS1wcm9qZWN0aW9uJyk7XHJcbnJlcXVpcmUoJ3BpeGktcGFydGljbGVzJyk7XHJcbnJlcXVpcmUoJ3BpeGktZmlsdGVycycpO1xyXG5cclxuY29uc3QgTG9hZGVyID0gcmVxdWlyZSgnLi9Mb2FkZXInKTtcclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vR2FtZScpO1xyXG5cclxubmV3IExvYWRlcignYXNzZXRzL2Jhbm5lci5wbmcnLCAoKSA9PiB7XHJcbiAgd2luZG93LmdhbWUgPSBuZXcgR2FtZSgpO1xyXG5cclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGdhbWUudmlldyk7XHJcbiAgZ2FtZS5zY2VuZXMuZW5hYmxlU2NlbmUoJ21lbnUnKTtcclxufSk7XHJcbiIsImNsYXNzIERlYnVnZ2VyTWFuYWdlciBleHRlbmRzIFBJWEkuR3JhcGhpY3Mge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcbiAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG4gICAgdGhpcy5yZWN0cyA9IFtdO1xyXG4gIH1cclxuICBhZGRQb2ludChwb2ludCkge1xyXG4gICAgdGhpcy5wb2ludHMucHVzaChwb2ludCk7XHJcbiAgfVxyXG4gIGFkZFJlY3QocmVjdCkge1xyXG4gICAgdGhpcy5yZWN0cy5wdXNoKHJlY3QpO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuYmVnaW5GaWxsKDB4NDRhNzNmKTtcclxuICAgICAgdGhpcy5kcmF3UmVjdCh0aGlzLnBvaW50c1tpXS54LTUsIHRoaXMucG9pbnRzW2ldLnktNSwgMTAsIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5yZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLmJlZ2luRmlsbCgweDQ0YTczZiwgMC4zKTtcclxuICAgICAgdGhpcy5saW5lU3R5bGUoMiwgMHg0NGE3M2YpO1xyXG4gICAgICB0aGlzLmRyYXdSZWN0KHRoaXMucmVjdHNbaV0ueCwgdGhpcy5yZWN0c1tpXS55LCB0aGlzLnJlY3RzW2ldLndpZHRoLCB0aGlzLnJlY3RzW2ldLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlYnVnZ2VyTWFuYWdlcjtcclxuIiwiY2xhc3MgSGlzdG9yeU1hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUsIGhpc3RvcnkpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5nYW1lID0gc2NlbmUuZ2FtZTtcclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuXHJcbiAgICB0aGlzLmhpc3RvcnkgPSBoaXN0b3J5O1xyXG4gICAgdGhpcy5hbHBoYSA9IDA7XHJcblxyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnZGlzcGxhY2VtZW50JykpO1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUudGV4dHVyZS5iYXNlVGV4dHVyZS53cmFwTW9kZSA9IFBJWEkuV1JBUF9NT0RFUy5SRVBFQVQ7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlKTtcclxuICAgIHRoaXMuZGlzcGxhY2VtZW50RmlsdGVyID0gbmV3IFBJWEkuZmlsdGVycy5EaXNwbGFjZW1lbnRGaWx0ZXIodGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUpO1xyXG5cclxuICAgIHRoaXMuaW1hZ2UgPSBuZXcgUElYSS5TcHJpdGUoKTtcclxuICAgIHRoaXMuaW1hZ2UuYW5jaG9yLnNldCguNSwgMCk7XHJcbiAgICB0aGlzLmltYWdlLnggPSB0aGlzLmdhbWUudy8yO1xyXG4gICAgdGhpcy5pbWFnZS55ID0gNzU7XHJcbiAgICB0aGlzLmltYWdlLnNjYWxlLnNldCguNSk7XHJcbiAgICB0aGlzLmltYWdlLmZpbHRlcnMgPSBbdGhpcy5kaXNwbGFjZW1lbnRGaWx0ZXJdO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLmltYWdlKTtcclxuXHJcbiAgICB0aGlzLnRleHQgPSBuZXcgUElYSS5UZXh0KCcnLCB7XHJcbiAgICAgIGZvbnQ6ICdub3JtYWwgMzBweCBBbWF0aWMgU0MnLFxyXG4gICAgICB3b3JkV3JhcDogdHJ1ZSxcclxuICAgICAgd29yZFdyYXBXaWR0aDogdGhpcy5nYW1lLncvMixcclxuICAgICAgZmlsbDogJyNmZmYnLFxyXG4gICAgICBwYWRkaW5nOiAxMCxcclxuICAgICAgYWxpZ246ICdjZW50ZXInXHJcbiAgICB9KTtcclxuICAgIHRoaXMudGV4dC5zZXRUZXh0KCdUZXh0Jyk7XHJcbiAgICB0aGlzLnRleHQuYW5jaG9yLnNldCguNSwgMCk7XHJcbiAgICB0aGlzLnRleHQueCA9IHRoaXMuZ2FtZS53LzI7XHJcbiAgICB0aGlzLnRleHQueSA9IDMwMDtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy50ZXh0KTtcclxuICB9XHJcbiAgc2hvdyhpZCkge1xyXG4gICAgbGV0IGRhdGEgPSB0aGlzLmhpc3RvcnlbaWRdO1xyXG5cclxuICAgIHRoaXMuaW1hZ2UudGV4dHVyZSA9IFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoZGF0YS5pbWFnZSk7XHJcbiAgICB0aGlzLnRleHQuc2V0VGV4dChkYXRhLnRleHRbdGhpcy5nYW1lLmxhbmddKTtcclxuXHJcbiAgICBsZXQgc2hvdyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgc2hvdy5mcm9tKHthbHBoYTogMH0pLnRvKHthbHBoYTogMX0pO1xyXG4gICAgc2hvdy50aW1lID0gMTAwMDtcclxuICAgIHNob3cuc3RhcnQoKTtcclxuICAgIHRoaXMuZW1pdCgnc2hvd2VuJyk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9oaWRlKCksIGRhdGEudGltZSk7XHJcbiAgfVxyXG4gIF9oaWRlKCkge1xyXG4gICAgbGV0IGhpZGUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIGhpZGUuZnJvbSh7YWxwaGE6IDF9KS50byh7YWxwaGE6IDB9KTtcclxuICAgIGhpZGUudGltZSA9IDEwMDA7XHJcbiAgICBoaWRlLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmVtaXQoJ2hpZGRlbicpO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudFNwcml0ZS54ICs9IC41O1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUueSArPSAuNTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGlzdG9yeU1hbmFnZXI7XHJcbiIsIi8qXHJcbiAg0JTQstC40LbQvtC6INGC0LDQudC70L7QstC+0Lkg0LrQsNGA0YLRi1xyXG4gINCh0L7QsdGL0YLQuNGPOlxyXG4gICAgc2Nyb2xsZWREb3duID0+IGR0RG93blxyXG4gICAgc2Nyb2xsZWRUb3AgPT4gZHRUb3BcclxuKi9cclxuY29uc3QgQmxvY2sgPSByZXF1aXJlKCcuLi9zdWJqZWN0cy9CbG9jaycpO1xyXG5cclxuY2xhc3MgTWFwTWFuYWdlciBleHRlbmRzIFBJWEkucHJvamVjdGlvbi5Db250YWluZXIyZCB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUsIG1hcCwgYmxvY2tzKSB7XHJcbiAgICBzdXBlcignbGV2ZWxzJyk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5nYW1lID0gc2NlbmUuZ2FtZTtcclxuXHJcbiAgICB0aGlzLnRpbGVTaXplID0gbWFwLnRpbGV3aWR0aDtcclxuICAgIHRoaXMubWFwV2lkdGggPSBtYXAud2lkdGg7XHJcbiAgICB0aGlzLm1hcEhlaWdodCA9IG1hcC5oZWlnaHQ7XHJcblxyXG4gICAgdGhpcy5tYXAgPSBtYXAubGF5ZXJzWzBdLmRhdGE7XHJcbiAgICB0aGlzLnRyaWdnZXJzID0gbWFwLmxheWVyc1sxXS5kYXRhO1xyXG4gICAgdGhpcy5ibG9ja3MgPSBibG9ja3MudGlsZXByb3BlcnRpZXM7XHJcblxyXG4gICAgdGhpcy5QUk9KRUNUSU9OX1BBRERJTkdfQk9UVE9NID0gMjgwO1xyXG4gICAgdGhpcy54ID0gdGhpcy5nYW1lLncvMi10aGlzLm1hcFdpZHRoKnRoaXMudGlsZVNpemUvMjtcclxuICAgIHRoaXMueSA9IC10aGlzLm1hcEhlaWdodCp0aGlzLnRpbGVTaXplK3RoaXMuZ2FtZS5oLXRoaXMuUFJPSkVDVElPTl9QQURESU5HX0JPVFRPTTtcclxuXHJcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xyXG4gICAgdGhpcy5zcGVlZCA9IDUwMDtcclxuXHJcbiAgICB0aGlzLl9wYXJzZU1hcCgpO1xyXG4gIH1cclxuICBfcGFyc2VNYXAoKSB7XHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgdGhpcy5tYXBIZWlnaHQ7IHkrKykge1xyXG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgdGhpcy5tYXBXaWR0aDsgeCsrKSB7XHJcbiAgICAgICAgIXRoaXMubWFwW3kqdGhpcy5tYXBXaWR0aCt4XSB8fCB0aGlzLmFkZEJsb2NrKHgqdGhpcy50aWxlU2l6ZSwgeSp0aGlzLnRpbGVTaXplLCB0aGlzLm1hcFt5KnRoaXMubWFwV2lkdGgreF0sIHRoaXMudHJpZ2dlcnNbeSp0aGlzLm1hcFdpZHRoK3hdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5jaGVja091dFJhbmdlQmxvY2tzKCk7XHJcbiAgfVxyXG4gIGFkZEJsb2NrKHgsIHksIGJsb2NrSUQsIHRyaWdnZXJJRCkge1xyXG4gICAgbGV0IGJsb2NrID0gbmV3IEJsb2NrKHRoaXMsIHgsIHksIHRoaXMuYmxvY2tzW2Jsb2NrSUQtMV0sIHRoaXMuYmxvY2tzW3RyaWdnZXJJRC0xXSk7XHJcbiAgICB0aGlzLmFkZENoaWxkKGJsb2NrKTtcclxuICB9XHJcblxyXG4gIC8vIENvbGxpc2lvbiBXaWRoIEJsb2NrXHJcbiAgZ2V0QmxvY2socG9zKSB7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgYmxvY2sgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG4gICAgICBsZXQgeCA9IGJsb2NrLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybS50eC90aGlzLmdhbWUuc2NhbGUtYmxvY2sud2lkdGgvMjtcclxuICAgICAgbGV0IHkgPSBibG9jay50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0udHkvdGhpcy5nYW1lLnNjYWxlLWJsb2NrLmhlaWdodC8yO1xyXG4gICAgICBsZXQgdyA9IGJsb2NrLndpZHRoO1xyXG4gICAgICBsZXQgaCA9IGJsb2NrLmhlaWdodDtcclxuXHJcbiAgICAgIGlmKHBvcy54ID49IHggJiYgcG9zLnggPD0geCt3ICYmIHBvcy55ID49IHkgJiYgcG9zLnkgPD0geStoKSByZXR1cm4gdGhpcy5jaGlsZHJlbltpXTtcclxuICAgIH1cclxuICB9XHJcbiAgZ2V0TmVhckJsb2Nrcyhwb3MpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNlbnRlcjogdGhpcy5nZXRCbG9jayhwb3MpLFxyXG4gICAgICB0b3A6IHRoaXMuZ2V0QmxvY2soe3g6IHBvcy54LCB5OiBwb3MueS10aGlzLnRpbGVTaXplfSksXHJcbiAgICAgIGJvdHRvbTogdGhpcy5nZXRCbG9jayh7eDogcG9zLngsIHk6IHBvcy55K3RoaXMudGlsZVNpemV9KSxcclxuICAgICAgbGVmdDogdGhpcy5nZXRCbG9jayh7eDogcG9zLngtdGhpcy50aWxlU2l6ZSwgeTogcG9zLnl9KSxcclxuICAgICAgcmlnaHQ6IHRoaXMuZ2V0QmxvY2soe3g6IHBvcy54K3RoaXMudGlsZVNpemUsIHk6IHBvcy55fSksXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBNb3ZpbmcgTWFwXHJcbiAgc2Nyb2xsRG93bihibG9ja3MpIHtcclxuICAgIGlmKHRoaXMuaXNTdG9wKSByZXR1cm47XHJcblxyXG4gICAgLy8gU2Nyb2xsIG1hcCBkb3duIG9uIFggYmxvY2tzXHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt5OiB0aGlzLnl9KS50byh7eTogdGhpcy55K2Jsb2Nrcyp0aGlzLnRpbGVTaXplfSk7XHJcbiAgICBtb3ZlLnRpbWUgPSB0aGlzLnNwZWVkKmJsb2NrcztcclxuXHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZW1pdCgnc2Nyb2xsZWREb3duJywgYmxvY2tzKTtcclxuICAgICAgdGhpcy5jaGVja091dFJhbmdlQmxvY2tzKCk7XHJcbiAgICB9KTtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuICB9XHJcbiAgc2Nyb2xsVG9wKGJsb2Nrcykge1xyXG4gICAgaWYodGhpcy5pc1N0b3ApIHJldHVybjtcclxuXHJcbiAgICAvLyBTY3JvbGwgbWFwIHRvcCBvbiBYIGJsb2Nrc1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eTogdGhpcy55fSkudG8oe3k6IHRoaXMueS1ibG9ja3MqdGhpcy50aWxlU2l6ZX0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZCpibG9ja3M7XHJcblxyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmVtaXQoJ3Njcm9sbGVkVG9wJywgYmxvY2tzKTtcclxuICAgICAgdGhpcy5jaGVja091dFJhbmdlQmxvY2tzKCk7XHJcbiAgICB9KTtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuICB9XHJcblxyXG4gIC8vIGNsZWFyIG91dCByYW5nZSBtYXAgYmxvY2tzXHJcbiAgY2hlY2tPdXRSYW5nZUJsb2NrcygpIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCB5ID0gdGhpcy5jaGlsZHJlbltpXS50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0udHktdGhpcy50aWxlU2l6ZS8yO1xyXG4gICAgICBpZih5ID4gdGhpcy5nYW1lLmggfHwgeSA8IC10aGlzLnRpbGVTaXplKSB7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5yZW5kZXJhYmxlICYmIHRoaXMuY2hpbGRyZW5baV0uaGlkZSgpO1xyXG4gICAgICB9IGVsc2UgIXRoaXMuY2hpbGRyZW5baV0ucmVuZGVyYWJsZSAmJiB0aGlzLmNoaWxkcmVuW2ldLnNob3coKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwTWFuYWdlcjtcclxuIiwiLypcclxuICDQmtC70LDRgdGBINC00LvRjyDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LLQuNC00LjQvNC+0LPQviDQutC+0L3RgtC10LnQvdC10YDQsCAo0YDQsNCx0L7Rh9C40YUg0YHRhtC10L0pXHJcbiAg0KHQvtCx0YvRgtC40Y86XHJcbiAgICBhZGRlZFNjZW5lcyA9PiBzY2VuZXNcclxuICAgIGFkZGVkU2NlbmUgPT4gc2NlbmVzXHJcbiAgICByZW1vdmVkU2NlbmUgPT4gc2NlbmVcclxuICAgIHJlc3RhcnRlZFNjZW5lID0+IHNjZW5lXHJcbiAgICBkaXNhYmxlZFNjZW5lID0+IHNjZW5lXHJcbiAgICBlbmFibGVkU2NlbmUgPT4gc2NlbmVzXHJcbiAgICB1cGRhdGVkID0+IGR0XHJcbiovXHJcblxyXG5jbGFzcyBTY2VuZXNNYW5hZ2VyIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIHRoaXMuc2NlbmVzID0gcmVxdWlyZSgnLi4vc2NlbmVzJyk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gbnVsbDtcclxuICB9XHJcbiAgZ2V0U2NlbmUoaWQpIHtcclxuICAgIHJldHVybiB0aGlzLnNjZW5lc1tpZF07XHJcbiAgfVxyXG5cclxuICAvLyBhZGRpbmcgc2NlbmVzXHJcbiAgYWRkU2NlbmVzKHNjZW5lcykge1xyXG4gICAgZm9yKGxldCBpZCBpbiBzY2VuZXMpIHtcclxuICAgICAgdGhpcy5hZGRTY2VuZShpZCwgc2NlbmVzW2lkXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkU2NlbmVzJywgc2NlbmVzKTtcclxuICB9XHJcbiAgYWRkU2NlbmUoaWQsIHNjZW5lKSB7XHJcbiAgICB0aGlzLnNjZW5lc1tpZF0gPSBzY2VuZTtcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRTY2VuZScsIHNjZW5lKTtcclxuICB9XHJcbiAgcmVtb3ZlU2NlbmUoaWQpIHtcclxuICAgIGxldCBfc2NlbmUgPSB0aGlzLnNjZW5lc1tpZF07XHJcbiAgICB0aGlzLnNjZW5lc1tpZF0gPSBudWxsO1xyXG4gICAgdGhpcy5lbWl0KCdyZW1vdmVkU2NlbmUnLCBfc2NlbmUpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udHJvbHNcclxuICByZXN0YXJ0U2NlbmUoKSB7XHJcbiAgICB0aGlzLmVuYWJsZVNjZW5lKHRoaXMuYWN0aXZlU2NlbmUuX2lkU2NlbmUpO1xyXG4gICAgdGhpcy5lbWl0KCdyZXN0YXJ0ZWRTY2VuZScsIHRoaXMuYWN0aXZlU2NlbmUpO1xyXG4gIH1cclxuICBkaXNhYmxlU2NlbmUoKSB7XHJcbiAgICBsZXQgc2NlbmUgPSB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuYWN0aXZlU2NlbmUpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSA9IG51bGw7XHJcbiAgICB0aGlzLmVtaXQoJ2Rpc2FibGVkU2NlbmUnLCBzY2VuZSk7XHJcbiAgfVxyXG4gIGVuYWJsZVNjZW5lKGlkKSB7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lICYmIHRoaXMuZGlzYWJsZVNjZW5lKCk7XHJcblxyXG4gICAgbGV0IFNjZW5lID0gdGhpcy5nZXRTY2VuZShpZCk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gdGhpcy5hZGRDaGlsZChuZXcgU2NlbmUodGhpcy5nYW1lLCB0aGlzKSk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lLl9pZFNjZW5lID0gaWQ7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdlbmFibGVkU2NlbmUnLCB0aGlzLmFjdGl2ZVNjZW5lKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSAmJiB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZSAmJiB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZShkdCk7XHJcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZWQnLCBkdCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lc01hbmFnZXI7XHJcbiIsImNsYXNzIFNwbGFzaE1hbmFnZXIgZXh0ZW5kcyBQSVhJLkdyYXBoaWNzIHtcclxuICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcbiAgICB0aGlzLmFscGhhID0gMDtcclxuICB9XHJcbiAgc2hvdyhjb2xvcj0weEZGRkZGRiwgc2hvd1RpbWU9MTAwMCwgZW5kVGltZT0xMDAwLCBzaG93RXZlbnQsIGVuZEV2ZW50KSB7XHJcbiAgICB0aGlzLmJlZ2luRmlsbChjb2xvcik7XHJcbiAgICB0aGlzLmRyYXdSZWN0KDAsIDAsIHRoaXMuZ2FtZS53LCB0aGlzLmdhbWUuaCk7XHJcblxyXG4gICAgbGV0IGhpZGUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKVxyXG4gICAgICAuZnJvbSh7YWxwaGE6IDF9KS50byh7YWxwaGE6IDB9KTtcclxuICAgIGhpZGUub24oJ2VuZCcsICgpID0+IGVuZEV2ZW50ICYmIGVuZEV2ZW50KCkpO1xyXG4gICAgaGlkZS50aW1lID0gZW5kVGltZTtcclxuXHJcbiAgICBsZXQgc2hvdyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpXHJcbiAgICAgIC5mcm9tKHthbHBoYTogMH0pLnRvKHthbHBoYTogMX0pO1xyXG4gICAgc2hvdy50aW1lID0gc2hvd1RpbWU7XHJcbiAgICBzaG93Lm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICAgIHNob3dFdmVudCAmJiBzaG93RXZlbnQoKTtcclxuICAgICAgaGlkZS5zdGFydCgpO1xyXG4gICAgfSk7XHJcbiAgICBzaG93LnN0YXJ0KCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNwbGFzaE1hbmFnZXI7XHJcbiIsImNsYXNzIEZpbmFsIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaW5hbDtcclxuIiwiY2xhc3MgTWVudSBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcbiAgICB0aGlzLmdhbWUubm9pc2VCbHVyLmJsdXJSYWRpdXMgPSAwLjAwMDU7XHJcbiAgICB0aGlzLmdhbWUuZ3JheXNjYWxlLnIgPSA1LjA7XHJcblxyXG4gICAgdGhpcy5za3kgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnc2t5JykpO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLnNreSk7XHJcblxyXG4gICAgdGhpcy5zdW4gPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnc3VuJykpO1xyXG4gICAgdGhpcy5zdW4ueCA9IDcwMDtcclxuICAgIHRoaXMuc3VuLnkgPSAxMzA7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuc3VuKTtcclxuXHJcbiAgICB0aGlzLm1vdW50ID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ21vdW50JykpO1xyXG4gICAgdGhpcy5tb3VudC55ID0gMTYwO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLm1vdW50KTtcclxuXHJcbiAgICB0aGlzLmxhYmVsID0gbmV3IFBJWEkuVGV4dCgnTW90dGlvbicsIHtcclxuICAgICAgZm9udDogJ25vcm1hbCAyMDBweCBPcGlmaWNpbyBCb2xkJyxcclxuICAgICAgZmlsbDogJyM1Nzc0ZjYnLFxyXG4gICAgICBhbGlnbjogJ2NlbnRlcidcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KC41KTtcclxuICAgIHRoaXMubGFiZWwueSA9IDMzMDtcclxuICAgIHRoaXMubGFiZWwueCA9IHRoaXMuZ2FtZS53LzI7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMubGFiZWwpO1xyXG5cclxuICAgIHRoaXMuY2l0YXR5ID0gbmV3IFBJWEkuVGV4dCgnSGUgcGxheWVkIHdpdGggaGlzIGRyZWFtcywgYW5kIGRyZWFtcyBwbGF5ZWQgdG8gdGhlbS4nLCB7XHJcbiAgICAgIGZvbnQ6ICdub3JtYWwgNjBweCBPcGlmaWNpbyBCb2xkJyxcclxuICAgICAgZmlsbDogJyM1Nzc0ZjYnLFxyXG4gICAgICB3b3JkV3JhcDogdHJ1ZSxcclxuICAgICAgd29yZFdyYXBXaWR0aDogdGhpcy5nYW1lLncvMixcclxuICAgICAgYWxpZ246ICdjZW50ZXInXHJcbiAgICB9KTtcclxuICAgIHRoaXMuY2l0YXR5LmFuY2hvci5zZXQoLjUpO1xyXG4gICAgdGhpcy5jaXRhdHkueSA9IDUwMDtcclxuICAgIHRoaXMuY2l0YXR5LnggPSB0aGlzLmdhbWUudy8yO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLmNpdGF0eSk7XHJcblxyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnZGlzcGxhY2VtZW50JykpO1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUudGV4dHVyZS5iYXNlVGV4dHVyZS53cmFwTW9kZSA9IFBJWEkuV1JBUF9NT0RFUy5SRVBFQVQ7XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudEZpbHRlciA9IG5ldyBQSVhJLmZpbHRlcnMuRGlzcGxhY2VtZW50RmlsdGVyKHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlKTtcclxuXHJcbiAgICB0aGlzLmNsb3VkcyA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG4gICAgdGhpcy5jbG91ZHMuZmlsdGVyID0gW3RoaXMuZGlzcGxhY2VtZW50RmlsdGVyXTtcclxuXHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuY2xvdWRzKTtcclxuICAgIHRoaXMuY2xvdWRzLmFkZENoaWxkKHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlKTtcclxuXHJcbiAgICB0aGlzLmNvdW50ID0gMDtcclxuXHJcbiAgICB0aGlzLmMxID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ2Nsb3VkJykpO1xyXG4gICAgdGhpcy5jMS55ID0gNDMwLTUwO1xyXG4gICAgdGhpcy5jMS5hbHBoYSA9IC40O1xyXG4gICAgdGhpcy5jMS5zY2FsZS5zZXQoMyk7XHJcbiAgICB0aGlzLmMxLnggPSAtMTAwO1xyXG4gICAgdGhpcy5jbG91ZHMuYWRkQ2hpbGQodGhpcy5jMSk7XHJcblxyXG4gICAgdGhpcy5jMiA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdjbG91ZCcpKTtcclxuICAgIHRoaXMuYzIueSA9IDUwMC01MDtcclxuICAgIHRoaXMuYzIuYWxwaGEgPSAuNDtcclxuICAgIHRoaXMuYzIuc2NhbGUuc2V0KC0zLCAzKTtcclxuICAgIHRoaXMuYzIueCA9IHRoaXMuZ2FtZS53KzEwMDtcclxuICAgIHRoaXMuY2xvdWRzLmFkZENoaWxkKHRoaXMuYzIpO1xyXG5cclxuICAgIHRoaXMuYzMgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnY2xvdWQnKSk7XHJcbiAgICB0aGlzLmMzLnkgPSA2NTAtNTA7XHJcbiAgICB0aGlzLmMzLmFscGhhID0gLjQ7XHJcbiAgICB0aGlzLmMzLnNjYWxlLnNldCgtNSwgNSk7XHJcbiAgICB0aGlzLmMzLnggPSB0aGlzLmdhbWUudyszMDA7XHJcbiAgICB0aGlzLmNsb3Vkcy5hZGRDaGlsZCh0aGlzLmMzKTtcclxuXHJcbiAgICB0aGlzLmM0ID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ2Nsb3VkJykpO1xyXG4gICAgdGhpcy5jNC55ID0gNTUwLTUwO1xyXG4gICAgdGhpcy5jNC5hbHBoYSA9IC40O1xyXG4gICAgdGhpcy5jNC5zY2FsZS5zZXQoNCk7XHJcbiAgICB0aGlzLmM0LnggPSAtMjkwO1xyXG4gICAgdGhpcy5jbG91ZHMuYWRkQ2hpbGQodGhpcy5jNCk7XHJcblxyXG4gICAgdGhpcy5maWx0ZXJzID0gW25ldyBQSVhJLmZpbHRlcnMuQWR2YW5jZWRCbG9vbUZpbHRlcih7XHJcbiAgICAgIGJsb29tU2NhbGU6IC40LFxyXG4gICAgICBicmlnaHRuZXNzOiAwLjVcclxuICAgIH0pXTtcclxuXHJcbiAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIHRoaXMub24oJ3BvaW50ZXJkb3duJywgKCkgPT4gdGhpcy50b1BsYXlncm91bmQoKSlcclxuICB9XHJcbiAgdG9QbGF5Z3JvdW5kKCkge1xyXG4gICAgdGhpcy5nYW1lLnNwbGFzaC5zaG93KDB4RjlFNEZGLCAxMDAwLCAxMDAwLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZ2FtZS5zY2VuZXMuZW5hYmxlU2NlbmUoJ3BsYXlncm91bmQnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLmNvdW50ICs9IDAuMDU7XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuY2xvdWRzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuY2xvdWRzLmNoaWxkcmVuW2ldLnggKz0gTWF0aC5zaW4oaSAqIDMwICsgdGhpcy5jb3VudCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudFNwcml0ZS54ICs9IDEwO1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUueSArPSAxMDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiLy8gY29udGVudFxyXG5jb25zdCBtYXAgPSByZXF1aXJlKCcuLi9jb250ZW50L21hcCcpO1xyXG5jb25zdCBibG9ja3MgPSByZXF1aXJlKCcuLi9jb250ZW50L2Jsb2NrcycpO1xyXG5jb25zdCBoaXN0b3J5ID0gcmVxdWlyZSgnLi4vY29udGVudC9oaXN0b3J5Jyk7XHJcblxyXG4vLyBtYW5hZ2Vyc1xyXG5jb25zdCBNYXBNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvTWFwTWFuYWdlcicpO1xyXG5jb25zdCBIaXN0b3J5TWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL0hpc3RvcnlNYW5hZ2VyJyk7XHJcblxyXG4vLyBzdWJqZWN0c1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuLi9zdWJqZWN0cy9QbGF5ZXInKTtcclxuY29uc3QgVGhsZW4gPSByZXF1aXJlKCcuLi9zdWJqZWN0cy9UaGxlbicpO1xyXG5cclxuLy8gZmlsdGVyc1xyXG5jb25zdCBBbHBoYUdyYWRpZW50RmlsdGVyID0gcmVxdWlyZSgnLi4vZmlsdGVycy9BbHBoYUdyYWRpZW50RmlsdGVyJyk7XHJcblxyXG5cclxuY2xhc3MgUGxheWdyb3VuZCBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcbiAgICB0aGlzLmdhbWUubm9pc2VCbHVyLmJsdXJSYWRpdXMgPSAwLjAwMDE7XHJcbiAgICB0aGlzLmdhbWUuZ3JheXNjYWxlLnIgPSAwLjg7XHJcblxyXG4gICAgdGhpcy5iZyA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdiZycpKTtcclxuICAgIHRoaXMuYmcud2lkdGggPSB0aGlzLmdhbWUudztcclxuICAgIHRoaXMuYmcuaGVpZ2h0ID0gdGhpcy5nYW1lLmg7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuYmcpO1xyXG5cclxuICAgIC8vIEluaXQgb2JqZWN0c1xyXG4gICAgdGhpcy5wcm9qZWN0aW9uID0gbmV3IFBJWEkucHJvamVjdGlvbi5Db250YWluZXIyZCgpO1xyXG4gICAgdGhpcy5wcm9qZWN0aW9uLnByb2ouc2V0QXhpc1koe3g6IC10aGlzLmdhbWUudy8yKzUwLCB5OiA0MDAwfSwgLTEpO1xyXG4gICAgdGhpcy5wcm9qZWN0aW9uLmZpbHRlcnMgPSBbbmV3IEFscGhhR3JhZGllbnRGaWx0ZXIoLjMsIC4xKV07XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMucHJvamVjdGlvbik7XHJcblxyXG4gICAgdGhpcy5tYXAgPSBuZXcgTWFwTWFuYWdlcih0aGlzLCBtYXAsIGJsb2Nrcyk7XHJcbiAgICB0aGlzLnByb2plY3Rpb24uYWRkQ2hpbGQodGhpcy5tYXApO1xyXG5cclxuICAgIHRoaXMuaGlzdG9yeSA9IG5ldyBIaXN0b3J5TWFuYWdlcih0aGlzLCBoaXN0b3J5KTtcclxuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcih0aGlzLCB0aGlzLm1hcCk7XHJcbiAgICB0aGlzLnRobGVuID0gbmV3IFRobGVuKHRoaXMpO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLmhpc3RvcnksIHRoaXMucGxheWVyLCB0aGlzLnRobGVuKTtcclxuXHJcbiAgICAvLyBDb250cm9sc1xyXG4gICAgdGhpcy5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcbiAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XHJcbiAgfVxyXG4gIF9iaW5kRXZlbnRzKCkge1xyXG4gICAgdGhpcy5vbigncG9pbnRlcmRvd24nLCAoKSA9PiB0aGlzLnBsYXllci5pbW11bml0eSgpKTtcclxuICAgIHRoaXMub24oJ3BvaW50ZXJtb3ZlJywgKGUpID0+IHtcclxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubWFwLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5tYXAuY2hpbGRyZW5baV07XHJcbiAgICAgICAgaWYoYmxvY2suY29udGFpbnNQb2ludChlLmRhdGEuZ2xvYmFsKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGJsb2NrLmhpdCgpO1xyXG4gICAgICAgIH0gZWxzZSBibG9jay51bmhpdCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmhpc3Rvcnkub24oJ3Nob3dlbicsICgpID0+IHtcclxuICAgICAgdGhpcy5wbGF5ZXIuc3RvcE1vdmUoKTtcclxuICAgICAgdGhpcy5wcm9qZWN0aW9uLmZpbHRlcnNbMF0uZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmhpc3Rvcnkub24oJ2hpZGRlbicsICgpID0+IHtcclxuICAgICAgdGhpcy5wbGF5ZXIuc3RhcnRNb3ZlKCk7XHJcbiAgICAgIHRoaXMucHJvamVjdGlvbi5maWx0ZXJzWzBdLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5wbGF5ZXIub24oJ2RlYWRlZCcsICgpID0+IHRoaXMucmVzdGFydCgpKTtcclxuICAgIHRoaXMucGxheWVyLm9uKCdjb2xsaXNpb24nLCAoYmxvY2spID0+IHtcclxuICAgICAgYmxvY2suaGlzdG9yeUlEICYmIHRoaXMuaGlzdG9yeS5zaG93KGJsb2NrLmhpc3RvcnlJRCk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMucGxheWVyLnRvcCgpO1xyXG4gIH1cclxuICByZXN0YXJ0KCkge1xyXG4gICAgdGhpcy5nYW1lLnNwbGFzaC5zaG93KDB4RUVFRUVFLCA1MDAsIDUwMCwgKCkgPT4ge1xyXG4gICAgICB0aGlzLmdhbWUuc2NlbmVzLmVuYWJsZVNjZW5lKCdwbGF5Z3JvdW5kJyk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy5oaXN0b3J5LnVwZGF0ZSgpO1xyXG4gICAgdGhpcy50aGxlbi51cGRhdGUoKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWdyb3VuZDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgJ21lbnUnOiByZXF1aXJlKCcuL01lbnUnKSxcclxuICAncGxheWdyb3VuZCc6IHJlcXVpcmUoJy4vUGxheWdyb3VuZCcpLFxyXG4gICdmaW5hbCc6IHJlcXVpcmUoJy4vRmluYWwnKVxyXG59XHJcbiIsIi8qXHJcbiAg0JrQu9Cw0YHRgSDQkdC70L7QutCwLCDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LTQu9GPINGC0LDQudC70L7QstC+0LPQviDQtNCy0LjQttC60LBcclxuICDQodC+0LHRi9GC0LjRjzpcclxuICAgIHNob3dlblxyXG4gICAgaGlkZGVuXHJcbiAgICBhY3RpdmF0ZWRcclxuICAgIGRlYWN0aXZhdGVkXHJcbiAgICBoaXRlZFxyXG4qL1xyXG5cclxuY2xhc3MgQmxvY2sgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uU3ByaXRlMmQge1xyXG4gIGNvbnN0cnVjdG9yKG1hcCwgeCwgeSwgYmxvY2s9e30sIHRyaWdnZXI9e30pIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5tYXAgPSBtYXA7XHJcbiAgICB0aGlzLmdhbWUgPSB0aGlzLm1hcC5nYW1lO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlID0gYmxvY2suYWN0aXZlIHx8IGZhbHNlO1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uID0gYmxvY2suYWN0aXZhdGlvbiB8fCBudWxsO1xyXG4gICAgdGhpcy5zY29yZSA9IGJsb2NrLnNjb3JlIHx8IDA7XHJcblxyXG4gICAgdGhpcy5wbGF5ZXJEaXIgPSB0cmlnZ2VyLnBsYXllckRpcjtcclxuICAgIHRoaXMuaGlzdG9yeUlEID0gdHJpZ2dlci5oaXN0b3J5SUQ7XHJcbiAgICB0aGlzLmFjdGlvbiA9IHRyaWdnZXIuYWN0aW9uO1xyXG5cclxuICAgIHRoaXMuYWN0aXZhdGVkVGV4dHVyZSA9IGJsb2NrLmFjdGl2YXRlZFRleHR1cmUgPyBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKGJsb2NrLmFjdGl2YXRlZFRleHR1cmUpIDogbnVsbDtcclxuICAgIHRoaXMuZGVhY3RpdmF0ZWRUZXh0dXJlID0gYmxvY2suZGVhY3RpdmF0ZWRUZXh0dXJlID8gUElYSS5UZXh0dXJlLmZyb21GcmFtZShibG9jay5kZWFjdGl2YXRlZFRleHR1cmUpIDogbnVsbDtcclxuICAgIHRoaXMudGV4dHVyZSA9IHRoaXMuYWN0aXZlID8gdGhpcy5hY3RpdmF0ZWRUZXh0dXJlIDogdGhpcy5kZWFjdGl2YXRlZFRleHR1cmU7XHJcblxyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuICAgIHRoaXMucmVuZGVyYWJsZSA9IGZhbHNlO1xyXG4gICAgdGhpcy53aWR0aCA9IG1hcC50aWxlU2l6ZSsxO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBtYXAudGlsZVNpemUrMTtcclxuICAgIHRoaXMueCA9IHgrbWFwLnRpbGVTaXplLzIrLjU7XHJcbiAgICB0aGlzLnkgPSB5K21hcC50aWxlU2l6ZS8yKy41O1xyXG5cclxuICAgIHRoaXMuam9sdGluZyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgdGhpcy5qb2x0aW5nLmZyb20oe3JvdGF0aW9uOiAtLjF9KS50byh7cm90YXRpb246IC4xfSk7XHJcbiAgICB0aGlzLmpvbHRpbmcudGltZSA9IDIwMDtcclxuICAgIHRoaXMuam9sdGluZy5waW5nUG9uZyA9IHRydWU7XHJcbiAgICB0aGlzLmpvbHRpbmcucmVwZWF0ID0gSW5maW5pdHk7XHJcbiAgfVxyXG4gIHNob3coKSB7XHJcbiAgICB0aGlzLnJlbmRlcmFibGUgPSB0cnVlO1xyXG5cclxuICAgIGxldCBzaG93ID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBzaG93LmZyb20oe2FscGhhOiAwfSkudG8oe2FscGhhOiAxfSlcclxuICAgIHNob3cudGltZSA9IDEwMDA7XHJcbiAgICBzaG93LnN0YXJ0KCk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdzaG93ZW4nKTtcclxuICB9XHJcbiAgaGlkZSgpIHtcclxuICAgIHRoaXMucmVuZGVyYWJsZSA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnaGlkZGVuJyk7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZSgpIHtcclxuICAgIGxldCBhY3RpdmF0aW5nID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcylcclxuICAgICAgLmZyb20oe3dpZHRoOiB0aGlzLndpZHRoKjMvNCwgaGVpZ2h0OiB0aGlzLmhlaWdodCozLzR9KVxyXG4gICAgICAudG8oe3dpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0LCByb3RhdGlvbjogMH0pO1xyXG4gICAgYWN0aXZhdGluZy50aW1lID0gNTAwO1xyXG4gICAgYWN0aXZhdGluZy5lYXNpbmcgPSBQSVhJLnR3ZWVuLkVhc2luZy5vdXRCb3VuY2UoKTtcclxuICAgIGFjdGl2YXRpbmcuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLnVuaGl0KCk7XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgdGhpcy50ZXh0dXJlID0gdGhpcy5hY3RpdmF0ZWRUZXh0dXJlO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnYWN0aXZhdGVkJyk7XHJcbiAgfVxyXG4gIGRlYWN0aXZhdGUoKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgaWYodGhpcy5kZWFjdGl2YXRlZFRleHR1cmUpIHRoaXMudGV4dHVyZSA9IHRoaXMuZGVhY3RpdmF0ZWRUZXh0dXJlO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnZGVhY3RpdmF0ZWQnKTtcclxuICB9XHJcblxyXG4gIHVuaGl0KCkge1xyXG4gICAgdGhpcy5qb2x0aW5nLnN0b3AoKTtcclxuICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gIH1cclxuICBoaXQoKSB7XHJcbiAgICBpZih0aGlzLmFjdGl2YXRpb24gPT09IG51bGwgfHwgdGhpcy5hY3RpdmUpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmpvbHRpbmcuc3RhcnQoKTtcclxuICAgIGlmKHRoaXMuYWN0aXZhdGlvbikgdGhpcy5hY3RpdmF0aW9uLS07XHJcbiAgICBlbHNlIHRoaXMuYWN0aXZhdGUoKTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ2hpdGVkJyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCIvKlxyXG4gINCa0LvQsNGB0YEgUGxheWVyLCDQstC30LDQuNC80L7QtNC10LnRgdGC0LLRg9C10YIg0YEgTWFwTWFuYWdlclxyXG4gINCh0L7QsdGL0YLQuNGPXHJcbiAgICBjb2xsaXNpb24gPT4gY29sbGlzaW9uIGJsb2NrXHJcbiAgICBtb3ZlZFxyXG4gICAgZGVhZGVkXHJcblxyXG4gICAgYWN0aW9uSW1tdW5pdHlcclxuICAgIGFjdGlvblRvcFxyXG4gICAgYWN0aW9uTGVmdFxyXG4gICAgYWN0aW9uUmlnaHRcclxuKi9cclxuXHJcbmNvbnN0IFJVTl9UT1AgPSBbXTtcclxuZm9yKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xyXG4gIGxldCB0ZXh0dXJlID0gUElYSS5UZXh0dXJlLmZyb21JbWFnZSgncGxheWVyX3J1bl90b3BfJyArIChpKzEpKTtcclxuICBSVU5fVE9QLnB1c2goe3RleHR1cmUsIHRpbWU6IDcwfSk7XHJcbn1cclxuXHJcbmNvbnN0IFJVTl9MRUZUID0gW107XHJcbmZvcihsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcclxuICBsZXQgdGV4dHVyZSA9IFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ3BsYXllcl9ydW5fbGVmdF8nICsgKGkrMSkpO1xyXG4gIFJVTl9MRUZULnB1c2goe3RleHR1cmUsIHRpbWU6IDcwfSk7XHJcbn1cclxuXHJcbmNsYXNzIFBsYXllciBleHRlbmRzIFBJWEkuZXh0cmFzLkFuaW1hdGVkU3ByaXRlIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSwgbWFwKSB7XHJcbiAgICBzdXBlcihSVU5fVE9QKTtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5tYXAgPSBtYXA7XHJcblxyXG4gICAgdGhpcy5TQ0FMRSA9IC43O1xyXG5cclxuICAgIHRoaXMubG9vcCA9IHRydWU7XHJcbiAgICB0aGlzLmFuY2hvci5zZXQoLjUsIDEpO1xyXG4gICAgdGhpcy5zY2FsZS5zZXQodGhpcy5TQ0FMRSk7XHJcbiAgICB0aGlzLnggPSB0aGlzLmdhbWUudy8yKzU7XHJcbiAgICB0aGlzLnkgPSB0aGlzLmdhbWUuaC10aGlzLm1hcC50aWxlU2l6ZSoxO1xyXG5cclxuICAgIHRoaXMuY29sbGlzaW9uUG9pbnQgPSBuZXcgUElYSS5Qb2ludCg5NjAsIDcxNik7XHJcblxyXG4gICAgdGhpcy53YWxraW5nID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICB0aGlzLndhbGtpbmcuZnJvbSh7eTogdGhpcy55fSkudG8oe3k6IHRoaXMueS0xNX0pO1xyXG4gICAgdGhpcy53YWxraW5nLnRpbWUgPSA4MDA7XHJcbiAgICB0aGlzLndhbGtpbmcubG9vcCA9IHRydWU7XHJcbiAgICB0aGlzLndhbGtpbmcucGluZ1BvbmcgPSB0cnVlO1xyXG4gICAgdGhpcy53YWxraW5nLnN0YXJ0KCk7XHJcblxyXG4gICAgdGhpcy5sYXN0TW92ZSA9IG51bGw7XHJcbiAgICB0aGlzLnNwZWVkID0gdGhpcy5tYXAuc3BlZWQgfHwgNTAwO1xyXG4gICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5PRkZTRVRfWCA9IDIwO1xyXG4gICAgdGhpcy5JTU1VTklUWV9CTE9DS1MgPSAxO1xyXG4gICAgdGhpcy5pbW11bml0eUNvdW50ID0gNTtcclxuICB9XHJcbiAgbW92aW5nKCkge1xyXG4gICAgaWYodGhpcy5pc0RlYWQgfHwgdGhpcy5pc1N0b3ApIHJldHVybjtcclxuXHJcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5tYXAuZ2V0TmVhckJsb2Nrcyh0aGlzLmNvbGxpc2lvblBvaW50KTtcclxuICAgIGlmKGJsb2Nrcy5jZW50ZXIgJiYgYmxvY2tzLmNlbnRlci5hY3RpdmUpIHtcclxuICAgICAgdGhpcy5lbWl0KCdtb3ZlZCcpO1xyXG4gICAgICB0aGlzLmVtaXQoJ2NvbGxpc2lvbicsIGJsb2Nrcy5jZW50ZXIpO1xyXG5cclxuICAgICAgaWYoYmxvY2tzLmNlbnRlci5wbGF5ZXJEaXIgPT09ICd0b3AnKSByZXR1cm4gdGhpcy50b3AoKTtcclxuICAgICAgaWYoYmxvY2tzLmNlbnRlci5wbGF5ZXJEaXIgPT09ICdsZWZ0JykgcmV0dXJuIHRoaXMubGVmdCgpO1xyXG4gICAgICBpZihibG9ja3MuY2VudGVyLnBsYXllckRpciA9PT0gJ3JpZ2h0JykgcmV0dXJuIHRoaXMucmlnaHQoKTtcclxuXHJcbiAgICAgIC8vY2hlY2sgdG9wXHJcbiAgICAgIGlmKGJsb2Nrcy50b3AgJiYgYmxvY2tzLnRvcC5hY3RpdmUgJiYgdGhpcy5sYXN0TW92ZSAhPT0gJ2JvdHRvbScpIHJldHVybiB0aGlzLnRvcCgpO1xyXG4gICAgICAvLyBjaGVjayBsZWZ0XHJcbiAgICAgIGlmKGJsb2Nrcy5sZWZ0ICYmIGJsb2Nrcy5sZWZ0LmFjdGl2ZSAmJiB0aGlzLmxhc3RNb3ZlICE9PSAncmlnaHQnKSByZXR1cm4gdGhpcy5sZWZ0KCk7XHJcbiAgICAgIC8vIGNoZWNrIHJpZ3RoXHJcbiAgICAgIGlmKGJsb2Nrcy5yaWdodCAmJiBibG9ja3MucmlnaHQuYWN0aXZlICYmIHRoaXMubGFzdE1vdmUgIT09ICdsZWZ0JykgcmV0dXJuIHRoaXMucmlnaHQoKTtcclxuICAgICAgLy8gb3IgZGllXHJcbiAgICAgIHRoaXMudG9wKCk7XHJcbiAgICB9IGVsc2UgdGhpcy5kZWFkKCk7XHJcbiAgfVxyXG4gIGRlYWQoKSB7XHJcbiAgICB0aGlzLndhbGtpbmcuc3RvcCgpO1xyXG4gICAgdGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cclxuICAgIGxldCBkZWFkID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcy5zY2FsZSk7XHJcbiAgICBkZWFkLmZyb20odGhpcy5zY2FsZSkudG8oe3g6IDAsIHk6IDB9KTtcclxuICAgIGRlYWQudGltZSA9IDIwMDtcclxuICAgIGRlYWQuc3RhcnQoKTtcclxuICAgIGRlYWQub24oJ2VuZCcsICgpID0+IHRoaXMuZW1pdCgnZGVhZGVkJykpO1xyXG4gIH1cclxuICBpbW11bml0eSgpIHtcclxuICAgIGlmKCF0aGlzLmltbXVuaXR5Q291bnQpIHJldHVybjtcclxuXHJcbiAgICBsZXQgYmxvY2sgPSB0aGlzLm1hcC5nZXRCbG9jayh7eDogdGhpcy54LCB5OiB0aGlzLnktdGhpcy5tYXAudGlsZVNpemV9KTtcclxuICAgIGlmKGJsb2NrKSB7XHJcbiAgICAgIHRoaXMuaW1tdW5pdHlDb3VudC0tO1xyXG4gICAgICBibG9jay5hY3RpdmF0ZSgnY2VsbDEtZmlsbC5wbmcnKTtcclxuXHJcbiAgICAgIHRoaXMuZW1pdCgnYWN0aW9uSW1tdW5pdHknKTtcclxuICAgIH1cclxuICB9XHJcbiAgc3RhcnRNb3ZlKCkge1xyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuICAgIHRoaXMudGV4dHVyZXMgPSBSVU5fVE9QO1xyXG4gICAgdGhpcy5zY2FsZS54ID0gdGhpcy5TQ0FMRTtcclxuICAgIHRoaXMud2Fsa2luZy5zdGFydCgpO1xyXG4gICAgdGhpcy5nb3RvQW5kUGxheSgwKTtcclxuICB9XHJcbiAgc3RvcE1vdmUoKSB7XHJcbiAgICB0aGlzLmlzU3RvcCA9IHRydWU7XHJcbiAgICB0aGlzLnRleHR1cmVzID0gUlVOX1RPUDtcclxuICAgIHRoaXMuc2NhbGUueCA9IHRoaXMuU0NBTEU7XHJcbiAgICB0aGlzLndhbGtpbmcuc3RvcCgpO1xyXG4gICAgdGhpcy5nb3RvQW5kU3RvcCgwKTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ2FjdGlvblN0b3AnKTtcclxuICB9XHJcbiAgdG9wKCkge1xyXG4gICAgaWYodGhpcy5sYXN0TW92ZSAhPT0gJ3RvcCcpIHtcclxuICAgICAgdGhpcy50ZXh0dXJlcyA9IFJVTl9UT1A7XHJcbiAgICAgIHRoaXMuc2NhbGUueCA9IHRoaXMuU0NBTEU7XHJcbiAgICAgIHRoaXMuZ290b0FuZFBsYXkoMCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICd0b3AnO1xyXG4gICAgdGhpcy5tYXAuc2Nyb2xsRG93bigxKTtcclxuICAgIHRoaXMubWFwLm9uY2UoJ3Njcm9sbGVkRG93bicsICgpID0+IHRoaXMubW92aW5nKCkpO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uVG9wJyk7XHJcbiAgfVxyXG4gIGxlZnQoKSB7XHJcbiAgICBpZih0aGlzLmxhc3RNb3ZlICE9PSAnbGVmdCcpIHtcclxuICAgICAgdGhpcy5zY2FsZS54ID0gdGhpcy5TQ0FMRTtcclxuICAgICAgdGhpcy50ZXh0dXJlcyA9IFJVTl9MRUZUO1xyXG4gICAgICB0aGlzLmdvdG9BbmRQbGF5KDApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGFzdE1vdmUgPSAnbGVmdCc7XHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt4OiB0aGlzLnh9KS50byh7eDogdGhpcy54LXRoaXMubWFwLnRpbGVTaXplLXRoaXMuT0ZGU0VUX1h9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQvMjtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLmNvbGxpc2lvblBvaW50LnggLT0gdGhpcy5tYXAudGlsZVNpemU7XHJcblxyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4gdGhpcy5tb3ZpbmcoKSk7XHJcbiAgICB0aGlzLmVtaXQoJ2FjdGlvbkxlZnQnKTtcclxuICB9XHJcbiAgcmlnaHQoKSB7XHJcbiAgICBpZih0aGlzLmxhc3RNb3ZlICE9PSAncmlnaHQnKSB7XHJcbiAgICAgIHRoaXMuc2NhbGUueCA9IC10aGlzLlNDQUxFO1xyXG4gICAgICB0aGlzLnRleHR1cmVzID0gUlVOX0xFRlQ7XHJcbiAgICAgIHRoaXMuZ290b0FuZFBsYXkoMCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICdyaWdodCc7XHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt4OiB0aGlzLnh9KS50byh7eDogdGhpcy54K3RoaXMubWFwLnRpbGVTaXplK3RoaXMuT0ZGU0VUX1h9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQvMjtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLmNvbGxpc2lvblBvaW50LnggKz0gdGhpcy5tYXAudGlsZVNpemU7XHJcblxyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4gdGhpcy5tb3ZpbmcoKSk7XHJcbiAgICB0aGlzLmVtaXQoJ2FjdGlvblJpZ2h0Jyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcclxuIiwiY2xhc3MgU3BoZXJlIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBQSVhJLnBhcnRpY2xlcy5FbWl0dGVyKHRoaXMsIFtQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdwYXJ0aWNsZScpXSwgcmVxdWlyZSgnLi9lbWl0dGVyLmpzb24nKSk7XHJcbiAgfVxyXG4gIGxlcnAoc3RhcnQsIGVuZCwgYW10KSB7XHJcbiAgICByZXR1cm4gKDEtYW10KSpzdGFydCthbXQqZW5kO1xyXG4gIH1cclxuICBzZXRQb3MocG9zKSB7XHJcbiAgICB0aGlzLmVtaXR0ZXIuc3Bhd25Qb3MueCA9IHBvcy54O1xyXG4gICAgdGhpcy5lbWl0dGVyLnNwYXduUG9zLnkgPSBwb3MueTtcclxuICAgIC8vIFxyXG4gICAgLy8gdGhpcy5lbWl0dGVyLnNwYXduUG9zLnggPSB0aGlzLmxlcnAodGhpcy5lbWl0dGVyLnNwYXduUG9zLngsIHBvcy54LCAwLjIpO1xyXG4gICAgLy8gdGhpcy5lbWl0dGVyLnNwYXduUG9zLnkgPSB0aGlzLmxlcnAodGhpcy5lbWl0dGVyLnNwYXduUG9zLnksIHBvcy55LCAwLjIpO1xyXG4gIH1cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIHRoaXMuZW1pdHRlci51cGRhdGUoZHQqLjAyKTtcclxuICAgIHRoaXMuZW1pdHRlci5lbWl0ID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3BoZXJlO1xyXG4iLCJjbGFzcyBUaGxlbiBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG5cclxuICAgIHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ2Rpc3BsYWNlbWVudCcpKTtcclxuICAgIHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlLnRleHR1cmUuYmFzZVRleHR1cmUud3JhcE1vZGUgPSBQSVhJLldSQVBfTU9ERVMuUkVQRUFUO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLmRpc3BsYWNlbWVudFNwcml0ZSk7XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudEZpbHRlciA9IG5ldyBQSVhJLmZpbHRlcnMuRGlzcGxhY2VtZW50RmlsdGVyKHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlKTtcclxuXHJcbiAgICB0aGlzLnNpemUgPSAxNTA7XHJcbiAgICB0aGlzLmFtdCA9IE1hdGgucm91bmQodGhpcy5nYW1lLncvdGhpcy5zaXplKTtcclxuICAgIHRoaXMuUEFERElOID0gNTA7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5hbXQ7IGkrKykge1xyXG4gICAgICBsZXQgdGhsZW4gPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKCd0aGxlbicpKSk7XHJcbiAgICAgIHRobGVuLndpZHRoID0gdGhpcy5zaXplKzI7XHJcbiAgICAgIHRobGVuLnggPSBpKnRoaXMuc2l6ZS0xO1xyXG4gICAgICB0aGxlbi5hbHBoYSA9IC44O1xyXG4gICAgICB0aGxlbi5ibGVuZE1vZGUgPSBQSVhJLkJMRU5EX01PREVTLlNBVFVSQVRJT047XHJcbiAgICAgIHRobGVuLnkgPSB0aGlzLmdhbWUuaC10aGlzLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy53aWR0aCArPSB0aGlzLlBBRERJTjtcclxuICAgIHRoaXMueCAtPSB0aGlzLlBBRERJTi8yO1xyXG4gICAgdGhpcy5maWx0ZXJzID0gW3RoaXMuZGlzcGxhY2VtZW50RmlsdGVyXTtcclxuXHJcbiAgICB0aGlzLmNvdW50ID0gMDtcclxuICB9XHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy5jb3VudCArPSAwLjA1O1xyXG5cclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0ueSArPSBNYXRoLnNpbihpICogMzAgKyB0aGlzLmNvdW50KTtcclxuICAgIH1cclxuICAgIHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlLnggKz0gNTtcclxuICAgIHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlLnkgKz0gNTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGhsZW47XHJcbiIsIm1vZHVsZS5leHBvcnRzPXtcblwiYWxwaGFcIjoge1xuXCJzdGFydFwiOiAxLFxuXCJlbmRcIjogMFxufSxcblwic2NhbGVcIjoge1xuXCJzdGFydFwiOiAxLFxuXCJlbmRcIjogMC4wMDEsXG5cIm1pbmltdW1TY2FsZU11bHRpcGxpZXJcIjogMC4wMDFcbn0sXG5cImNvbG9yXCI6IHtcblwic3RhcnRcIjogXCIjZTRmOWZmXCIsXG5cImVuZFwiOiBcIiMzZmNiZmZcIlxufSxcblwic3BlZWRcIjoge1xuXCJzdGFydFwiOiAxMDAwLFxuXCJlbmRcIjogNTAsXG5cIm1pbmltdW1TcGVlZE11bHRpcGxpZXJcIjogMVxufSxcblwiYWNjZWxlcmF0aW9uXCI6IHtcblwieFwiOiAwLFxuXCJ5XCI6IC0xMDAwXG59LFxuXCJtYXhTcGVlZFwiOiA2MCxcblwic3RhcnRSb3RhdGlvblwiOiB7XG5cIm1pblwiOiAwLFxuXCJtYXhcIjogMzYwXG59LFxuXCJub1JvdGF0aW9uXCI6IGZhbHNlLFxuXCJyb3RhdGlvblNwZWVkXCI6IHtcblwibWluXCI6IDAsXG5cIm1heFwiOiAwXG59LFxuXCJsaWZldGltZVwiOiB7XG5cIm1pblwiOiAwLjIsXG5cIm1heFwiOiAxXG59LFxuXCJibGVuZE1vZGVcIjogXCJhZGRcIixcblwiZnJlcXVlbmN5XCI6IDAuMDAxLFxuXCJlbWl0dGVyTGlmZXRpbWVcIjogLTEsXG5cIm1heFBhcnRpY2xlc1wiOiA1MDAsXG5cInBvc1wiOiB7XG5cInhcIjogMCxcblwieVwiOiAwXG59LFxuXCJhZGRBdEJhY2tcIjogZmFsc2UsXG5cInNwYXduVHlwZVwiOiBcImNpcmNsZVwiLFxuXCJzcGF3bkNpcmNsZVwiOiB7XG5cInhcIjogMCxcblwieVwiOiAwLFxuXCJyXCI6IDBcbn0gXG59XG4iXX0=
