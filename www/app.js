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


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],28:[function(require,module,exports){
!function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(6)},function(t,e){t.exports=PIXI},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={linear:function(){return function(t){return t}},inQuad:function(){return function(t){return t*t}},outQuad:function(){return function(t){return t*(2-t)}},inOutQuad:function(){return function(t){return t*=2,1>t?.5*t*t:-.5*(--t*(t-2)-1)}},inCubic:function(){return function(t){return t*t*t}},outCubic:function(){return function(t){return--t*t*t+1}},inOutCubic:function(){return function(t){return t*=2,1>t?.5*t*t*t:(t-=2,.5*(t*t*t+2))}},inQuart:function(){return function(t){return t*t*t*t}},outQuart:function(){return function(t){return 1- --t*t*t*t}},inOutQuart:function(){return function(t){return t*=2,1>t?.5*t*t*t*t:(t-=2,-.5*(t*t*t*t-2))}},inQuint:function(){return function(t){return t*t*t*t*t}},outQuint:function(){return function(t){return--t*t*t*t*t+1}},inOutQuint:function(){return function(t){return t*=2,1>t?.5*t*t*t*t*t:(t-=2,.5*(t*t*t*t*t+2))}},inSine:function(){return function(t){return 1-Math.cos(t*Math.PI/2)}},outSine:function(){return function(t){return Math.sin(t*Math.PI/2)}},inOutSine:function(){return function(t){return.5*(1-Math.cos(Math.PI*t))}},inExpo:function(){return function(t){return 0===t?0:Math.pow(1024,t-1)}},outExpo:function(){return function(t){return 1===t?1:1-Math.pow(2,-10*t)}},inOutExpo:function(){return function(t){return 0===t?0:1===t?1:(t*=2,1>t?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2))}},inCirc:function(){return function(t){return 1-Math.sqrt(1-t*t)}},outCirc:function(){return function(t){return Math.sqrt(1- --t*t)}},inOutCirc:function(){return function(t){return t*=2,1>t?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-2)*(t-2))+1)}},inElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),-(t*Math.pow(2,10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)))}},outElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),t*Math.pow(2,-10*n)*Math.sin((n-i)*(2*Math.PI)/e)+1)}},inOutElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),n*=2,1>n?-.5*(t*Math.pow(2,10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)):t*Math.pow(2,-10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)*.5+1)}},inBack:function(t){return function(e){var n=t||1.70158;return e*e*((n+1)*e-n)}},outBack:function(t){return function(e){var n=t||1.70158;return--e*e*((n+1)*e+n)+1}},inOutBack:function(t){return function(e){var n=1.525*(t||1.70158);return e*=2,1>e?.5*(e*e*((n+1)*e-n)):.5*((e-2)*(e-2)*((n+1)*(e-2)+n)+2)}},inBounce:function(){return function(t){return 1-n.outBounce()(1-t)}},outBounce:function(){return function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?(t-=1.5/2.75,7.5625*t*t+.75):2.5/2.75>t?(t-=2.25/2.75,7.5625*t*t+.9375):(t-=2.625/2.75,7.5625*t*t+.984375)}},inOutBounce:function(){return function(t){return.5>t?.5*n.inBounce()(2*t):.5*n.outBounce()(2*t-1)+.5}},customArray:function(t){return t?function(t){return t}:n.linear()}};e["default"]=n},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e,n,i,r,s){for(var o in t)if(c(t[o]))u(t[o],e[o],n[o],i,r,s);else{var a=e[o],h=t[o]-e[o],l=i,f=r/l;n[o]=a+h*s(f)}}function h(t,e,n){for(var i in t)0===e[i]||e[i]||(c(n[i])?(e[i]=JSON.parse(JSON.stringify(n[i])),h(t[i],e[i],n[i])):e[i]=n[i])}function c(t){return"[object Object]"===Object.prototype.toString.call(t)}var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var f=n(1),p=r(f),d=n(2),g=i(d),v=function(t){function e(t,n){s(this,e);var i=o(this,Object.getPrototypeOf(e).call(this));return i.target=t,n&&i.addTo(n),i.clear(),i}return a(e,t),l(e,[{key:"addTo",value:function(t){return this.manager=t,this.manager.addTween(this),this}},{key:"chain",value:function(t){return t||(t=new e(this.target)),this._chainTween=t,t}},{key:"start",value:function(){return this.active=!0,this}},{key:"stop",value:function(){return this.active=!1,this.emit("stop"),this}},{key:"to",value:function(t){return this._to=t,this}},{key:"from",value:function(t){return this._from=t,this}},{key:"remove",value:function(){return this.manager?(this.manager.removeTween(this),this):this}},{key:"clear",value:function(){this.time=0,this.active=!1,this.easing=g["default"].linear(),this.expire=!1,this.repeat=0,this.loop=!1,this.delay=0,this.pingPong=!1,this.isStarted=!1,this.isEnded=!1,this._to=null,this._from=null,this._delayTime=0,this._elapsedTime=0,this._repeat=0,this._pingPong=!1,this._chainTween=null,this.path=null,this.pathReverse=!1,this.pathFrom=0,this.pathTo=0}},{key:"reset",value:function(){if(this._elapsedTime=0,this._repeat=0,this._delayTime=0,this.isStarted=!1,this.isEnded=!1,this.pingPong&&this._pingPong){var t=this._to,e=this._from;this._to=e,this._from=t,this._pingPong=!1}return this}},{key:"update",value:function(t,e){if(this._canUpdate()||!this._to&&!this.path){var n=void 0,i=void 0;if(this.delay>this._delayTime)return void(this._delayTime+=e);this.isStarted||(this._parseData(),this.isStarted=!0,this.emit("start"));var r=this.pingPong?this.time/2:this.time;if(r>this._elapsedTime){var s=this._elapsedTime+e,o=s>=r;this._elapsedTime=o?r:s,this._apply(r);var a=this._pingPong?r+this._elapsedTime:this._elapsedTime;if(this.emit("update",a),o){if(this.pingPong&&!this._pingPong)return this._pingPong=!0,n=this._to,i=this._from,this._from=n,this._to=i,this.path&&(n=this.pathTo,i=this.pathFrom,this.pathTo=i,this.pathFrom=n),this.emit("pingpong"),void(this._elapsedTime=0);if(this.loop||this.repeat>this._repeat)return this._repeat++,this.emit("repeat",this._repeat),this._elapsedTime=0,void(this.pingPong&&this._pingPong&&(n=this._to,i=this._from,this._to=i,this._from=n,this.path&&(n=this.pathTo,i=this.pathFrom,this.pathTo=i,this.pathFrom=n),this._pingPong=!1));this.isEnded=!0,this.active=!1,this.emit("end"),this._chainTween&&(this._chainTween.addTo(this.manager),this._chainTween.start())}}}}},{key:"_parseData",value:function(){if(!this.isStarted&&(this._from||(this._from={}),h(this._to,this._from,this.target),this.path)){var t=this.path.totalDistance();this.pathReverse?(this.pathFrom=t,this.pathTo=0):(this.pathFrom=0,this.pathTo=t)}}},{key:"_apply",value:function(t){if(u(this._to,this._from,this.target,t,this._elapsedTime,this.easing),this.path){var e=this.pingPong?this.time/2:this.time,n=this.pathFrom,i=this.pathTo-this.pathFrom,r=e,s=this._elapsedTime/r,o=n+i*this.easing(s),a=this.path.getPointAtDistance(o);this.target.position.set(a.x,a.y)}}},{key:"_canUpdate",value:function(){return this.time&&this.active&&this.target}}]),e}(p.utils.EventEmitter);e["default"]=v},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),a=i(o),u=function(){function t(){r(this,t),this.tweens=[],this._tweensToDelete=[],this._last=0}return s(t,[{key:"update",value:function(t){var e=void 0;t||0===t?e=1e3*t:(e=this._getDeltaMS(),t=e/1e3);for(var n=0;n<this.tweens.length;n++){var i=this.tweens[n];i.active&&(i.update(t,e),i.isEnded&&i.expire&&i.remove())}if(this._tweensToDelete.length){for(var n=0;n<this._tweensToDelete.length;n++)this._remove(this._tweensToDelete[n]);this._tweensToDelete.length=0}}},{key:"getTweensForTarget",value:function(t){for(var e=[],n=0;n<this.tweens.length;n++)this.tweens[n].target===t&&e.push(this.tweens[n]);return e}},{key:"createTween",value:function(t){return new a["default"](t,this)}},{key:"addTween",value:function(t){t.manager=this,this.tweens.push(t)}},{key:"removeTween",value:function(t){this._tweensToDelete.push(t)}},{key:"_remove",value:function(t){var e=this.tweens.indexOf(t);-1!==e&&this.tweens.splice(e,1)}},{key:"_getDeltaMS",value:function(){0===this._last&&(this._last=Date.now());var t=Date.now(),e=t-this._last;return this._last=t,e}}]),t}();e["default"]=u},function(t,e,n){"use strict";function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),u=function(){function t(){r(this,t),this._colsed=!1,this.polygon=new a.Polygon,this.polygon.closed=!1,this._tmpPoint=new a.Point,this._tmpPoint2=new a.Point,this._tmpDistance=[],this.currentPath=null,this.graphicsData=[],this.dirty=!0}return s(t,[{key:"moveTo",value:function(t,e){return a.Graphics.prototype.moveTo.call(this,t,e),this.dirty=!0,this}},{key:"lineTo",value:function(t,e){return a.Graphics.prototype.lineTo.call(this,t,e),this.dirty=!0,this}},{key:"bezierCurveTo",value:function(t,e,n,i,r,s){return a.Graphics.prototype.bezierCurveTo.call(this,t,e,n,i,r,s),this.dirty=!0,this}},{key:"quadraticCurveTo",value:function(t,e,n,i){return a.Graphics.prototype.quadraticCurveTo.call(this,t,e,n,i),this.dirty=!0,this}},{key:"arcTo",value:function(t,e,n,i,r){return a.Graphics.prototype.arcTo.call(this,t,e,n,i,r),this.dirty=!0,this}},{key:"arc",value:function(t,e,n,i,r,s){return a.Graphics.prototype.arc.call(this,t,e,n,i,r,s),this.dirty=!0,this}},{key:"drawShape",value:function(t){return a.Graphics.prototype.drawShape.call(this,t),this.dirty=!0,this}},{key:"getPoint",value:function(t){this.parsePoints();var e=this.closed&&t>=this.length-1?0:2*t;return this._tmpPoint.set(this.polygon.points[e],this.polygon.points[e+1]),this._tmpPoint}},{key:"distanceBetween",value:function(t,e){this.parsePoints();var n=this.getPoint(t),i=n.x,r=n.y,s=this.getPoint(e),o=s.x,a=s.y,u=o-i,h=a-r;return Math.sqrt(u*u+h*h)}},{key:"totalDistance",value:function(){this.parsePoints(),this._tmpDistance.length=0,this._tmpDistance.push(0);for(var t=this.length,e=0,n=0;t-1>n;n++)e+=this.distanceBetween(n,n+1),this._tmpDistance.push(e);return e}},{key:"getPointAt",value:function(t){if(this.parsePoints(),t>this.length)return this.getPoint(this.length-1);if(t%1===0)return this.getPoint(t);this._tmpPoint2.set(0,0);var e=t%1,n=this.getPoint(Math.ceil(t)),i=n.x,r=n.y,s=this.getPoint(Math.floor(t)),o=s.x,a=s.y,u=-((o-i)*e),h=-((a-r)*e);return this._tmpPoint2.set(o+u,a+h),this._tmpPoint2}},{key:"getPointAtDistance",value:function(t){this.parsePoints(),this._tmpDistance||this.totalDistance();var e=this._tmpDistance.length,n=0,i=this._tmpDistance[this._tmpDistance.length-1];0>t?t=i+t:t>i&&(t-=i);for(var r=0;e>r&&(t>=this._tmpDistance[r]&&(n=r),!(t<this._tmpDistance[r]));r++);if(n===this.length-1)return this.getPointAt(n);var s=t-this._tmpDistance[n],o=this._tmpDistance[n+1]-this._tmpDistance[n];return this.getPointAt(n+s/o)}},{key:"parsePoints",value:function(){if(!this.dirty)return this;this.dirty=!1,this.polygon.points.length=0;for(var t=0;t<this.graphicsData.length;t++){var e=this.graphicsData[t].shape;e&&e.points&&(this.polygon.points=this.polygon.points.concat(e.points))}return this}},{key:"clear",value:function(){return this.graphicsData.length=0,this.currentPath=null,this.polygon.points.length=0,this._closed=!1,this.dirty=!1,this}},{key:"closed",get:function(){return this._closed},set:function(t){this._closed!==t&&(this.polygon.closed=t,this._closed=t,this.dirty=!0)}},{key:"length",get:function(){return this.polygon.points.length?this.polygon.points.length/2+(this._closed?1:0):0}}]),t}();e["default"]=u},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(4),u=i(a),h=n(3),c=i(h),l=n(5),f=i(l),p=n(2),d=i(p);o.Graphics.prototype.drawPath=function(t){return t.parsePoints(),this.drawShape(t.polygon),this};var g={TweenManager:u["default"],Tween:c["default"],Easing:d["default"],TweenPath:f["default"]};o.tweenManager||(o.tweenManager=new u["default"],o.tween=g),e["default"]=g}]);

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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScenesManager = require('./managers/ScenesManager');
var filters = require('pixi-filters');
var CloudsFilter = require('./shaders/clouds');

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
                // this.container.filters[0].time += .01;
            });
        }
    }]);

    return Game;
}(PIXI.Application);

module.exports = Game;

},{"./managers/ScenesManager":37,"./shaders/clouds":43,"pixi-filters":25}],33:[function(require,module,exports){
'use strict';

require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
var Game = require('./game');

WebFont.load({
  google: {
    families: ['Amatic SC']
  },
  active: function active() {
    PIXI.loader.add('blocks', 'assets/blocks.json').add('player', 'assets/player.png').add('bg', 'assets/bg.png').add('displacement', 'assets/displacement.png').add('thlen', 'assets/thlen.png').add('lightmap', 'assets/lightmap.png').add('mask', 'assets/mask.png').add('music', 'assets/music.mp3').load(function (loader, resources) {
      PIXI.sound.play('music');
      var game = new Game();
      game.scenes.enableScene('playground');

      window.game = game;
    });
  }
});

},{"./game":32,"pixi-projection":26,"pixi-sound":27,"pixi-tween":28}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{"../content/fragments":30,"../content/levels":31}],36:[function(require,module,exports){
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
      this.clearOutRangeBlocks();
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
      if (this.children.length < this.maxAxisX * (this.game.h / this.blockSize)) {
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

},{"../content/blocks":29,"../subjects/Block":44,"../utils/DataFragmentConverter":47}],37:[function(require,module,exports){
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

},{"../scenes":40}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
                var block = _this2.map.getBlockFromPos(e.data.global);
                block && block.hit();
            });

            this.player.on('deaded', function () {
                return _this2.restart();
            });
            this.player.on('collision', function (block) {
                if (block.action === 'history') _this2.history.showText(_this2.levels.getCurrentLevel().history.ru, 3000);
            });

            this.history.on('showen', function () {
                _this2.map.isStop = true;
            });
            this.history.on('hidden', function () {
                _this2.map.isStop = false;
                _this2.map.scrollDown(1);
                _this2.levels.nextLevel();
            });

            this.map.on('endedMap', function () {
                return _this2.levels.nextFragment();
            });
            this.map.on('scrolledDown', function () {
                return _this2.player.moving();
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

},{"../managers/HistoryManager":34,"../managers/LevelManager":35,"../managers/MapManager":36,"../managers/ScreenManager":38,"../subjects/Player":45,"../subjects/Thlen":46}],40:[function(require,module,exports){
'use strict';

module.exports = {
  'playground': require('./Playground')
};

},{"./Playground":39}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

    var _this = _possibleConstructorReturn(this, (CloudsFilter.__proto__ || Object.getPrototypeOf(CloudsFilter)).call(this, vert(), frag(), {
      cloudDensity: {
        type: 'float',
        value: 0.3
      },
      cloudHeight: {
        type: 'float',
        value: 0.3
      },
      speed: {
        type: 'float',
        value: 1.0
      },
      noisiness: {
        type: 'float',
        value: 0.5
      }
    }));

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

},{"../basic.vert":41,"./clouds.frag":42}],44:[function(require,module,exports){
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
    return _this;
  }

  _createClass(Block, [{
    key: 'activate',
    value: function activate() {
      var activating = PIXI.tweenManager.createTween(this).from({ width: this.width * 3 / 4, height: this.height * 3 / 4 }).to({ width: this.width, height: this.height, rotation: 0 });
      activating.time = 500;
      activating.easing = PIXI.tween.Easing.outBounce();
      activating.start();

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
    key: 'hit',
    value: function hit() {
      if (this.activation === null || this.isActive) return;

      var jolting = PIXI.tweenManager.createTween(this);
      jolting.from({ rotation: 0 }).to({ rotation: Math.random() < .5 ? -.15 : .15 });
      jolting.time = 100;
      jolting.pingPong = true;
      jolting.start();

      if (this.activation) this.activation--;else this.activate();
      this.emit('hited');
    }
  }]);

  return Block;
}(PIXI.projection.Sprite2d);

module.exports = Block;

},{}],45:[function(require,module,exports){
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
        _this.y = _this.game.h - _this.map.blockSize * 2.3;

        _this.walking = PIXI.tweenManager.createTween(_this);
        _this.walking.from({ y: _this.y }).to({ y: _this.y - 5 });
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}]},{},[33])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWFkdmFuY2VkLWJsb29tL2xpYi9maWx0ZXItYWR2YW5jZWQtYmxvb20uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWFzY2lpL2xpYi9maWx0ZXItYXNjaWkuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWJsb29tL2xpYi9maWx0ZXItYmxvb20uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWJ1bGdlLXBpbmNoL2xpYi9maWx0ZXItYnVsZ2UtcGluY2guanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWNvbG9yLXJlcGxhY2UvbGliL2ZpbHRlci1jb2xvci1yZXBsYWNlLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1jb252b2x1dGlvbi9saWIvZmlsdGVyLWNvbnZvbHV0aW9uLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1jcm9zcy1oYXRjaC9saWIvZmlsdGVyLWNyb3NzLWhhdGNoLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1kb3QvbGliL2ZpbHRlci1kb3QuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93L2xpYi9maWx0ZXItZHJvcC1zaGFkb3cuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWVtYm9zcy9saWIvZmlsdGVyLWVtYm9zcy5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZ2xvdy9saWIvZmlsdGVyLWdsb3cuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLWdvZHJheS9saWIvZmlsdGVyLWdvZHJheS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItbW90aW9uLWJsdXIvbGliL2ZpbHRlci1tb3Rpb24tYmx1ci5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZS9saWIvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLW9sZC1maWxtL2xpYi9maWx0ZXItb2xkLWZpbG0uanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLW91dGxpbmUvbGliL2ZpbHRlci1vdXRsaW5lLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1waXhlbGF0ZS9saWIvZmlsdGVyLXBpeGVsYXRlLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1yYWRpYWwtYmx1ci9saWIvZmlsdGVyLXJhZGlhbC1ibHVyLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci1yZ2Itc3BsaXQvbGliL2ZpbHRlci1yZ2Itc3BsaXQuanMiLCJub2RlX21vZHVsZXMvQHBpeGkvZmlsdGVyLXNob2Nrd2F2ZS9saWIvZmlsdGVyLXNob2Nrd2F2ZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwL2xpYi9maWx0ZXItc2ltcGxlLWxpZ2h0bWFwLmpzIiwibm9kZV9tb2R1bGVzL0BwaXhpL2ZpbHRlci10aWx0LXNoaWZ0L2xpYi9maWx0ZXItdGlsdC1zaGlmdC5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItdHdpc3QvbGliL2ZpbHRlci10d2lzdC5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItem9vbS1ibHVyL2xpYi9maWx0ZXItem9vbS1ibHVyLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktZmlsdGVycy9saWIvcGl4aS1maWx0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL3BpeGktcHJvamVjdGlvbi9kaXN0L3BpeGktcHJvamVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9waXhpLXNvdW5kL2Rpc3QvcGl4aS1zb3VuZC5qcyIsIm5vZGVfbW9kdWxlcy9waXhpLXR3ZWVuL2J1aWxkL3BpeGktdHdlZW4uanMiLCJzcmMvY29udGVudC9ibG9ja3MuanNvbiIsInNyYy9jb250ZW50L2ZyYWdtZW50cy5qc29uIiwic3JjL2NvbnRlbnQvbGV2ZWxzLmpzb24iLCJzcmNcXGdhbWUuanMiLCJzcmNcXGluZGV4LmpzIiwic3JjXFxtYW5hZ2Vyc1xcSGlzdG9yeU1hbmFnZXIuanMiLCJzcmNcXG1hbmFnZXJzXFxMZXZlbE1hbmFnZXIuanMiLCJzcmNcXG1hbmFnZXJzXFxNYXBNYW5hZ2VyLmpzIiwic3JjXFxtYW5hZ2Vyc1xcU2NlbmVzTWFuYWdlci5qcyIsInNyY1xcbWFuYWdlcnNcXFNjcmVlbk1hbmFnZXIuanMiLCJzcmNcXHNjZW5lc1xcUGxheWdyb3VuZC5qcyIsInNyY1xcc2NlbmVzXFxpbmRleC5qcyIsInNyYy9zaGFkZXJzL2Jhc2ljLnZlcnQiLCJzcmMvc2hhZGVycy9jbG91ZHMvY2xvdWRzLmZyYWciLCJzcmNcXHNoYWRlcnNcXGNsb3Vkc1xcaW5kZXguanMiLCJzcmNcXHN1YmplY3RzXFxCbG9jay5qcyIsInNyY1xcc3ViamVjdHNcXFBsYXllci5qcyIsInNyY1xcc3ViamVjdHNcXFRobGVuLmpzIiwic3JjXFx1dGlsc1xcRGF0YUZyYWdtZW50Q29udmVydGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1ZBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7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aWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItYWR2YW5jZWQtYmxvb20gLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWFkdmFuY2VkLWJsb29tIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUscil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/cihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0scik6cihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciByPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIGZsb2F0IHRocmVzaG9sZDtcXG5cXG52b2lkIG1haW4oKSB7XFxuICAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICAvLyBBIHNpbXBsZSAmIGZhc3QgYWxnb3JpdGhtIGZvciBnZXR0aW5nIGJyaWdodG5lc3MuXFxuICAgIC8vIEl0J3MgaW5hY2N1cmFjeSAsIGJ1dCBnb29kIGVub3VnaHQgZm9yIHRoaXMgZmVhdHVyZS5cXG4gICAgZmxvYXQgX21heCA9IG1heChtYXgoY29sb3IuciwgY29sb3IuZyksIGNvbG9yLmIpO1xcbiAgICBmbG9hdCBfbWluID0gbWluKG1pbihjb2xvci5yLCBjb2xvci5nKSwgY29sb3IuYik7XFxuICAgIGZsb2F0IGJyaWdodG5lc3MgPSAoX21heCArIF9taW4pICogMC41O1xcblxcbiAgICBpZihicmlnaHRuZXNzID4gdGhyZXNob2xkKSB7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSBjb2xvcjtcXG4gICAgfSBlbHNlIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMC4wKTtcXG4gICAgfVxcbn1cXG5cIixvPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG8obyl7dm9pZCAwPT09byYmKG89LjUpLGUuY2FsbCh0aGlzLHIsdCksdGhpcy50aHJlc2hvbGQ9b31lJiYoby5fX3Byb3RvX189ZSksKG8ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1vO3ZhciBuPXt0aHJlc2hvbGQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnRocmVzaG9sZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy50aHJlc2hvbGR9LG4udGhyZXNob2xkLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnRocmVzaG9sZD1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvLnByb3RvdHlwZSxuKSxvfShQSVhJLkZpbHRlciksbj1cInVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIGJsb29tVGV4dHVyZTtcXG51bmlmb3JtIGZsb2F0IGJsb29tU2NhbGU7XFxudW5pZm9ybSBmbG9hdCBicmlnaHRuZXNzO1xcblxcbnZvaWQgbWFpbigpIHtcXG4gICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIGNvbG9yLnJnYiAqPSBicmlnaHRuZXNzO1xcbiAgICB2ZWM0IGJsb29tQ29sb3IgPSB2ZWM0KHRleHR1cmUyRChibG9vbVRleHR1cmUsIHZUZXh0dXJlQ29vcmQpLnJnYiwgMC4wKTtcXG4gICAgYmxvb21Db2xvci5yZ2IgKj0gYmxvb21TY2FsZTtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gY29sb3IgKyBibG9vbUNvbG9yO1xcbn1cXG5cIixpPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCl7ZS5jYWxsKHRoaXMscixuKSxcIm51bWJlclwiPT10eXBlb2YgdCYmKHQ9e3RocmVzaG9sZDp0fSksdD1PYmplY3QuYXNzaWduKHt0aHJlc2hvbGQ6LjUsYmxvb21TY2FsZToxLGJyaWdodG5lc3M6MSxibHVyOjgscXVhbGl0eTo0LHJlc29sdXRpb246UElYSS5zZXR0aW5ncy5SRVNPTFVUSU9OLGtlcm5lbFNpemU6NX0sdCksdGhpcy5ibG9vbVNjYWxlPXQuYmxvb21TY2FsZSx0aGlzLmJyaWdodG5lc3M9dC5icmlnaHRuZXNzO3ZhciBpPXQuYmx1cixsPXQucXVhbGl0eSxzPXQucmVzb2x1dGlvbix1PXQua2VybmVsU2l6ZSxhPVBJWEkuZmlsdGVycyxjPWEuQmx1clhGaWx0ZXIsaD1hLkJsdXJZRmlsdGVyO3RoaXMuX2V4dHJhY3Q9bmV3IG8odC50aHJlc2hvbGQpLHRoaXMuX2JsdXJYPW5ldyBjKGksbCxzLHUpLHRoaXMuX2JsdXJZPW5ldyBoKGksbCxzLHUpfWUmJih0Ll9fcHJvdG9fXz1lKSwodC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXQ7dmFyIGk9e3RocmVzaG9sZDp7Y29uZmlndXJhYmxlOiEwfSxibHVyOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gdC5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oZSxyLHQsbyxuKXt2YXIgaT1lLmdldFJlbmRlclRhcmdldCghMCk7dGhpcy5fZXh0cmFjdC5hcHBseShlLHIsaSwhMCxuKSx0aGlzLl9ibHVyWC5hcHBseShlLGksaSwhMCxuKSx0aGlzLl9ibHVyWS5hcHBseShlLGksaSwhMCxuKSx0aGlzLnVuaWZvcm1zLmJsb29tU2NhbGU9dGhpcy5ibG9vbVNjYWxlLHRoaXMudW5pZm9ybXMuYnJpZ2h0bmVzcz10aGlzLmJyaWdodG5lc3MsdGhpcy51bmlmb3Jtcy5ibG9vbVRleHR1cmU9aSxlLmFwcGx5RmlsdGVyKHRoaXMscix0LG8pLGUucmV0dXJuUmVuZGVyVGFyZ2V0KGkpfSxpLnRocmVzaG9sZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZXh0cmFjdC50aHJlc2hvbGR9LGkudGhyZXNob2xkLnNldD1mdW5jdGlvbihlKXt0aGlzLl9leHRyYWN0LnRocmVzaG9sZD1lfSxpLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2JsdXJYLmJsdXJ9LGkuYmx1ci5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy5fYmx1clguYmx1cj10aGlzLl9ibHVyWS5ibHVyPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQucHJvdG90eXBlLGkpLHR9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQWR2YW5jZWRCbG9vbUZpbHRlcj1pLGUuQWR2YW5jZWRCbG9vbUZpbHRlcj1pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItYWR2YW5jZWQtYmxvb20uanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1hc2NpaSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItYXNjaWkgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsbz1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gZmxvYXQgcGl4ZWxTaXplO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnZlYzIgbWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgKj0gZmlsdGVyQXJlYS54eTtcXG4gICAgY29vcmQgKz0gZmlsdGVyQXJlYS56dztcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHVubWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgLT0gZmlsdGVyQXJlYS56dztcXG4gICAgY29vcmQgLz0gZmlsdGVyQXJlYS54eTtcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHBpeGVsYXRlKHZlYzIgY29vcmQsIHZlYzIgc2l6ZSlcXG57XFxuICAgIHJldHVybiBmbG9vciggY29vcmQgLyBzaXplICkgKiBzaXplO1xcbn1cXG5cXG52ZWMyIGdldE1vZCh2ZWMyIGNvb3JkLCB2ZWMyIHNpemUpXFxue1xcbiAgICByZXR1cm4gbW9kKCBjb29yZCAsIHNpemUpIC8gc2l6ZTtcXG59XFxuXFxuZmxvYXQgY2hhcmFjdGVyKGZsb2F0IG4sIHZlYzIgcClcXG57XFxuICAgIHAgPSBmbG9vcihwKnZlYzIoNC4wLCAtNC4wKSArIDIuNSk7XFxuICAgIGlmIChjbGFtcChwLngsIDAuMCwgNC4wKSA9PSBwLnggJiYgY2xhbXAocC55LCAwLjAsIDQuMCkgPT0gcC55KVxcbiAgICB7XFxuICAgICAgICBpZiAoaW50KG1vZChuL2V4cDIocC54ICsgNS4wKnAueSksIDIuMCkpID09IDEpIHJldHVybiAxLjA7XFxuICAgIH1cXG4gICAgcmV0dXJuIDAuMDtcXG59XFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgIHZlYzIgY29vcmQgPSBtYXBDb29yZCh2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgLy8gZ2V0IHRoZSByb3VuZGVkIGNvbG9yLi5cXG4gICAgdmVjMiBwaXhDb29yZCA9IHBpeGVsYXRlKGNvb3JkLCB2ZWMyKHBpeGVsU2l6ZSkpO1xcbiAgICBwaXhDb29yZCA9IHVubWFwQ29vcmQocGl4Q29vcmQpO1xcblxcbiAgICB2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBwaXhDb29yZCk7XFxuXFxuICAgIC8vIGRldGVybWluZSB0aGUgY2hhcmFjdGVyIHRvIHVzZVxcbiAgICBmbG9hdCBncmF5ID0gKGNvbG9yLnIgKyBjb2xvci5nICsgY29sb3IuYikgLyAzLjA7XFxuXFxuICAgIGZsb2F0IG4gPSAgNjU1MzYuMDsgICAgICAgICAgICAgLy8gLlxcbiAgICBpZiAoZ3JheSA+IDAuMikgbiA9IDY1NjAwLjA7ICAgIC8vIDpcXG4gICAgaWYgKGdyYXkgPiAwLjMpIG4gPSAzMzI3NzIuMDsgICAvLyAqXFxuICAgIGlmIChncmF5ID4gMC40KSBuID0gMTUyNTUwODYuMDsgLy8gb1xcbiAgICBpZiAoZ3JheSA+IDAuNSkgbiA9IDIzMzg1MTY0LjA7IC8vICZcXG4gICAgaWYgKGdyYXkgPiAwLjYpIG4gPSAxNTI1MjAxNC4wOyAvLyA4XFxuICAgIGlmIChncmF5ID4gMC43KSBuID0gMTMxOTk0NTIuMDsgLy8gQFxcbiAgICBpZiAoZ3JheSA+IDAuOCkgbiA9IDExNTEyODEwLjA7IC8vICNcXG5cXG4gICAgLy8gZ2V0IHRoZSBtb2QuLlxcbiAgICB2ZWMyIG1vZGQgPSBnZXRNb2QoY29vcmQsIHZlYzIocGl4ZWxTaXplKSk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yICogY2hhcmFjdGVyKCBuLCB2ZWMyKC0xLjApICsgbW9kZCAqIDIuMCk7XFxuXFxufVwiLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihyKXt2b2lkIDA9PT1yJiYocj04KSxlLmNhbGwodGhpcyxuLG8pLHRoaXMuc2l6ZT1yfWUmJihyLl9fcHJvdG9fXz1lKSwoci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXI7dmFyIGk9e3NpemU6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLnNpemUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucGl4ZWxTaXplfSxpLnNpemUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMucGl4ZWxTaXplPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHIucHJvdG90eXBlLGkpLHJ9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQXNjaWlGaWx0ZXI9cixlLkFzY2lpRmlsdGVyPXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1hc2NpaS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWJsb29tIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1ibG9vbSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbih0LHIpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3IoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHIpOnIodC5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj1QSVhJLmZpbHRlcnMsZT1yLkJsdXJYRmlsdGVyLGk9ci5CbHVyWUZpbHRlcixsPXIuQWxwaGFGaWx0ZXIsdT1mdW5jdGlvbih0KXtmdW5jdGlvbiByKHIsdSxuLG8pe3ZvaWQgMD09PXImJihyPTIpLHZvaWQgMD09PXUmJih1PTQpLHZvaWQgMD09PW4mJihuPVBJWEkuc2V0dGluZ3MuUkVTT0xVVElPTiksdm9pZCAwPT09byYmKG89NSksdC5jYWxsKHRoaXMpO3ZhciBiLHM7XCJudW1iZXJcIj09dHlwZW9mIHI/KGI9cixzPXIpOnIgaW5zdGFuY2VvZiBQSVhJLlBvaW50PyhiPXIueCxzPXIueSk6QXJyYXkuaXNBcnJheShyKSYmKGI9clswXSxzPXJbMV0pLHRoaXMuYmx1clhGaWx0ZXI9bmV3IGUoYix1LG4sbyksdGhpcy5ibHVyWUZpbHRlcj1uZXcgaShzLHUsbixvKSx0aGlzLmJsdXJZRmlsdGVyLmJsZW5kTW9kZT1QSVhJLkJMRU5EX01PREVTLlNDUkVFTix0aGlzLmRlZmF1bHRGaWx0ZXI9bmV3IGx9dCYmKHIuX19wcm90b19fPXQpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgdT17Ymx1cjp7Y29uZmlndXJhYmxlOiEwfSxibHVyWDp7Y29uZmlndXJhYmxlOiEwfSxibHVyWTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKHQscixlKXt2YXIgaT10LmdldFJlbmRlclRhcmdldCghMCk7dGhpcy5kZWZhdWx0RmlsdGVyLmFwcGx5KHQscixlKSx0aGlzLmJsdXJYRmlsdGVyLmFwcGx5KHQscixpKSx0aGlzLmJsdXJZRmlsdGVyLmFwcGx5KHQsaSxlKSx0LnJldHVyblJlbmRlclRhcmdldChpKX0sdS5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJYRmlsdGVyLmJsdXJ9LHUuYmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5ibHVyWEZpbHRlci5ibHVyPXRoaXMuYmx1cllGaWx0ZXIuYmx1cj10fSx1LmJsdXJYLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJYRmlsdGVyLmJsdXJ9LHUuYmx1clguc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1clhGaWx0ZXIuYmx1cj10fSx1LmJsdXJZLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJZRmlsdGVyLmJsdXJ9LHUuYmx1clkuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1cllGaWx0ZXIuYmx1cj10fSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSx1KSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkJsb29tRmlsdGVyPXUsdC5CbG9vbUZpbHRlcj11LE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItYmxvb20uanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1idWxnZS1waW5jaCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItYnVsZ2UtcGluY2ggaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInVuaWZvcm0gZmxvYXQgcmFkaXVzO1xcbnVuaWZvcm0gZmxvYXQgc3RyZW5ndGg7XFxudW5pZm9ybSB2ZWMyIGNlbnRlcjtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkICogZmlsdGVyQXJlYS54eTtcXG4gICAgY29vcmQgLT0gY2VudGVyICogZGltZW5zaW9ucy54eTtcXG4gICAgZmxvYXQgZGlzdGFuY2UgPSBsZW5ndGgoY29vcmQpO1xcbiAgICBpZiAoZGlzdGFuY2UgPCByYWRpdXMpIHtcXG4gICAgICAgIGZsb2F0IHBlcmNlbnQgPSBkaXN0YW5jZSAvIHJhZGl1cztcXG4gICAgICAgIGlmIChzdHJlbmd0aCA+IDAuMCkge1xcbiAgICAgICAgICAgIGNvb3JkICo9IG1peCgxLjAsIHNtb290aHN0ZXAoMC4wLCByYWRpdXMgLyBkaXN0YW5jZSwgcGVyY2VudCksIHN0cmVuZ3RoICogMC43NSk7XFxuICAgICAgICB9IGVsc2Uge1xcbiAgICAgICAgICAgIGNvb3JkICo9IG1peCgxLjAsIHBvdyhwZXJjZW50LCAxLjAgKyBzdHJlbmd0aCAqIDAuNzUpICogcmFkaXVzIC8gZGlzdGFuY2UsIDEuMCAtIHBlcmNlbnQpO1xcbiAgICAgICAgfVxcbiAgICB9XFxuICAgIGNvb3JkICs9IGNlbnRlciAqIGRpbWVuc2lvbnMueHk7XFxuICAgIGNvb3JkIC89IGZpbHRlckFyZWEueHk7XFxuICAgIHZlYzIgY2xhbXBlZENvb3JkID0gY2xhbXAoY29vcmQsIGZpbHRlckNsYW1wLnh5LCBmaWx0ZXJDbGFtcC56dyk7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY2xhbXBlZENvb3JkKTtcXG4gICAgaWYgKGNvb3JkICE9IGNsYW1wZWRDb29yZCkge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yICo9IG1heCgwLjAsIDEuMCAtIGxlbmd0aChjb29yZCAtIGNsYW1wZWRDb29yZCkpO1xcbiAgICB9XFxufVxcblwiLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihyLG8saSl7ZS5jYWxsKHRoaXMsbix0KSx0aGlzLmNlbnRlcj1yfHxbLjUsLjVdLHRoaXMucmFkaXVzPW98fDEwMCx0aGlzLnN0cmVuZ3RoPWl8fDF9ZSYmKHIuX19wcm90b19fPWUpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgbz17cmFkaXVzOntjb25maWd1cmFibGU6ITB9LHN0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9LGNlbnRlcjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsbix0LHIpe3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT1uLnNvdXJjZUZyYW1lLndpZHRoLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT1uLnNvdXJjZUZyYW1lLmhlaWdodCxlLmFwcGx5RmlsdGVyKHRoaXMsbix0LHIpfSxvLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5yYWRpdXN9LG8ucmFkaXVzLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnJhZGl1cz1lfSxvLnN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnN0cmVuZ3RofSxvLnN0cmVuZ3RoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnN0cmVuZ3RoPWV9LG8uY2VudGVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmNlbnRlcn0sby5jZW50ZXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuY2VudGVyPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHIucHJvdG90eXBlLG8pLHJ9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuQnVsZ2VQaW5jaEZpbHRlcj1yLGUuQnVsZ2VQaW5jaEZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItYnVsZ2UtcGluY2guanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1jb2xvci1yZXBsYWNlIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1jb2xvci1yZXBsYWNlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKG8sZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZShvLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKG8pe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlO1xcbnVuaWZvcm0gdmVjMyBvcmlnaW5hbENvbG9yO1xcbnVuaWZvcm0gdmVjMyBuZXdDb2xvcjtcXG51bmlmb3JtIGZsb2F0IGVwc2lsb247XFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgdmVjNCBjdXJyZW50Q29sb3IgPSB0ZXh0dXJlMkQodGV4dHVyZSwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzMgY29sb3JEaWZmID0gb3JpZ2luYWxDb2xvciAtIChjdXJyZW50Q29sb3IucmdiIC8gbWF4KGN1cnJlbnRDb2xvci5hLCAwLjAwMDAwMDAwMDEpKTtcXG4gICAgZmxvYXQgY29sb3JEaXN0YW5jZSA9IGxlbmd0aChjb2xvckRpZmYpO1xcbiAgICBmbG9hdCBkb1JlcGxhY2UgPSBzdGVwKGNvbG9yRGlzdGFuY2UsIGVwc2lsb24pO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KG1peChjdXJyZW50Q29sb3IucmdiLCAobmV3Q29sb3IgKyBjb2xvckRpZmYpICogY3VycmVudENvbG9yLmEsIGRvUmVwbGFjZSksIGN1cnJlbnRDb2xvci5hKTtcXG59XFxuXCIsbj1mdW5jdGlvbihvKXtmdW5jdGlvbiBuKG4saSx0KXt2b2lkIDA9PT1uJiYobj0xNjcxMTY4MCksdm9pZCAwPT09aSYmKGk9MCksdm9pZCAwPT09dCYmKHQ9LjQpLG8uY2FsbCh0aGlzLGUsciksdGhpcy5vcmlnaW5hbENvbG9yPW4sdGhpcy5uZXdDb2xvcj1pLHRoaXMuZXBzaWxvbj10fW8mJihuLl9fcHJvdG9fXz1vKSwobi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShvJiZvLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW47dmFyIGk9e29yaWdpbmFsQ29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sbmV3Q29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sZXBzaWxvbjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkub3JpZ2luYWxDb2xvci5zZXQ9ZnVuY3Rpb24obyl7dmFyIGU9dGhpcy51bmlmb3Jtcy5vcmlnaW5hbENvbG9yO1wibnVtYmVyXCI9PXR5cGVvZiBvPyhQSVhJLnV0aWxzLmhleDJyZ2IobyxlKSx0aGlzLl9vcmlnaW5hbENvbG9yPW8pOihlWzBdPW9bMF0sZVsxXT1vWzFdLGVbMl09b1syXSx0aGlzLl9vcmlnaW5hbENvbG9yPVBJWEkudXRpbHMucmdiMmhleChlKSl9LGkub3JpZ2luYWxDb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fb3JpZ2luYWxDb2xvcn0saS5uZXdDb2xvci5zZXQ9ZnVuY3Rpb24obyl7dmFyIGU9dGhpcy51bmlmb3Jtcy5uZXdDb2xvcjtcIm51bWJlclwiPT10eXBlb2Ygbz8oUElYSS51dGlscy5oZXgycmdiKG8sZSksdGhpcy5fbmV3Q29sb3I9byk6KGVbMF09b1swXSxlWzFdPW9bMV0sZVsyXT1vWzJdLHRoaXMuX25ld0NvbG9yPVBJWEkudXRpbHMucmdiMmhleChlKSl9LGkubmV3Q29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX25ld0NvbG9yfSxpLmVwc2lsb24uc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMuZXBzaWxvbj1vfSxpLmVwc2lsb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZXBzaWxvbn0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsaSksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Db2xvclJlcGxhY2VGaWx0ZXI9bixvLkNvbG9yUmVwbGFjZUZpbHRlcj1uLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItY29sb3ItcmVwbGFjZS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWNvbnZvbHV0aW9uIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1jb252b2x1dGlvbiBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzIgdGV4ZWxTaXplO1xcbnVuaWZvcm0gZmxvYXQgbWF0cml4WzldO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICB2ZWM0IGMxMSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCAtIHRleGVsU2l6ZSk7IC8vIHRvcCBsZWZ0XFxuICAgdmVjNCBjMTIgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54LCB2VGV4dHVyZUNvb3JkLnkgLSB0ZXhlbFNpemUueSkpOyAvLyB0b3AgY2VudGVyXFxuICAgdmVjNCBjMTMgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC54ICsgdGV4ZWxTaXplLngsIHZUZXh0dXJlQ29vcmQueSAtIHRleGVsU2l6ZS55KSk7IC8vIHRvcCByaWdodFxcblxcbiAgIHZlYzQgYzIxID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCAtIHRleGVsU2l6ZS54LCB2VGV4dHVyZUNvb3JkLnkpKTsgLy8gbWlkIGxlZnRcXG4gICB2ZWM0IGMyMiA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7IC8vIG1pZCBjZW50ZXJcXG4gICB2ZWM0IGMyMyA9IHRleHR1cmUyRCh1U2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnggKyB0ZXhlbFNpemUueCwgdlRleHR1cmVDb29yZC55KSk7IC8vIG1pZCByaWdodFxcblxcbiAgIHZlYzQgYzMxID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCAtIHRleGVsU2l6ZS54LCB2VGV4dHVyZUNvb3JkLnkgKyB0ZXhlbFNpemUueSkpOyAvLyBib3R0b20gbGVmdFxcbiAgIHZlYzQgYzMyID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQueCwgdlRleHR1cmVDb29yZC55ICsgdGV4ZWxTaXplLnkpKTsgLy8gYm90dG9tIGNlbnRlclxcbiAgIHZlYzQgYzMzID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgdGV4ZWxTaXplKTsgLy8gYm90dG9tIHJpZ2h0XFxuXFxuICAgZ2xfRnJhZ0NvbG9yID1cXG4gICAgICAgYzExICogbWF0cml4WzBdICsgYzEyICogbWF0cml4WzFdICsgYzEzICogbWF0cml4WzJdICtcXG4gICAgICAgYzIxICogbWF0cml4WzNdICsgYzIyICogbWF0cml4WzRdICsgYzIzICogbWF0cml4WzVdICtcXG4gICAgICAgYzMxICogbWF0cml4WzZdICsgYzMyICogbWF0cml4WzddICsgYzMzICogbWF0cml4WzhdO1xcblxcbiAgIGdsX0ZyYWdDb2xvci5hID0gYzIyLmE7XFxufVxcblwiLG89ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbyhvLGksbil7ZS5jYWxsKHRoaXMsdCxyKSx0aGlzLm1hdHJpeD1vLHRoaXMud2lkdGg9aSx0aGlzLmhlaWdodD1ufWUmJihvLl9fcHJvdG9fXz1lKSwoby5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW87dmFyIGk9e21hdHJpeDp7Y29uZmlndXJhYmxlOiEwfSx3aWR0aDp7Y29uZmlndXJhYmxlOiEwfSxoZWlnaHQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLm1hdHJpeC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5tYXRyaXh9LGkubWF0cml4LnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLm1hdHJpeD1uZXcgRmxvYXQzMkFycmF5KGUpfSxpLndpZHRoLmdldD1mdW5jdGlvbigpe3JldHVybiAxL3RoaXMudW5pZm9ybXMudGV4ZWxTaXplWzBdfSxpLndpZHRoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnRleGVsU2l6ZVswXT0xL2V9LGkuaGVpZ2h0LmdldD1mdW5jdGlvbigpe3JldHVybiAxL3RoaXMudW5pZm9ybXMudGV4ZWxTaXplWzFdfSxpLmhlaWdodC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy50ZXhlbFNpemVbMV09MS9lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvLnByb3RvdHlwZSxpKSxvfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkNvbnZvbHV0aW9uRmlsdGVyPW8sZS5Db252b2x1dGlvbkZpbHRlcj1vLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItY29udm9sdXRpb24uanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1jcm9zcy1oYXRjaCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItY3Jvc3MtaGF0Y2ggaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obyxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKG8uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZmxvYXQgbHVtID0gbGVuZ3RoKHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZC54eSkucmdiKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgxLjAsIDEuMCwgMS4wLCAxLjApO1xcblxcbiAgICBpZiAobHVtIDwgMS4wMClcXG4gICAge1xcbiAgICAgICAgaWYgKG1vZChnbF9GcmFnQ29vcmQueCArIGdsX0ZyYWdDb29yZC55LCAxMC4wKSA9PSAwLjApXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjAsIDAuMCwgMC4wLCAxLjApO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIGlmIChsdW0gPCAwLjc1KVxcbiAgICB7XFxuICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54IC0gZ2xfRnJhZ0Nvb3JkLnksIDEwLjApID09IDAuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgaWYgKGx1bSA8IDAuNTApXFxuICAgIHtcXG4gICAgICAgIGlmIChtb2QoZ2xfRnJhZ0Nvb3JkLnggKyBnbF9GcmFnQ29vcmQueSAtIDUuMCwgMTAuMCkgPT0gMC4wKVxcbiAgICAgICAge1xcbiAgICAgICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBpZiAobHVtIDwgMC4zKVxcbiAgICB7XFxuICAgICAgICBpZiAobW9kKGdsX0ZyYWdDb29yZC54IC0gZ2xfRnJhZ0Nvb3JkLnkgLSA1LjAsIDEwLjApID09IDAuMClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMCwgMC4wLCAwLjAsIDEuMCk7XFxuICAgICAgICB9XFxuICAgIH1cXG59XFxuXCIsZT1mdW5jdGlvbihvKXtmdW5jdGlvbiBlKCl7by5jYWxsKHRoaXMsbixyKX1yZXR1cm4gbyYmKGUuX19wcm90b19fPW8pLGUucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobyYmby5wcm90b3R5cGUpLGUucHJvdG90eXBlLmNvbnN0cnVjdG9yPWUsZX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Dcm9zc0hhdGNoRmlsdGVyPWUsby5Dcm9zc0hhdGNoRmlsdGVyPWUsT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1jcm9zcy1oYXRjaC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWRvdCAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItZG90IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcblxcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gZmxvYXQgYW5nbGU7XFxudW5pZm9ybSBmbG9hdCBzY2FsZTtcXG5cXG5mbG9hdCBwYXR0ZXJuKClcXG57XFxuICAgZmxvYXQgcyA9IHNpbihhbmdsZSksIGMgPSBjb3MoYW5nbGUpO1xcbiAgIHZlYzIgdGV4ID0gdlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHk7XFxuICAgdmVjMiBwb2ludCA9IHZlYzIoXFxuICAgICAgIGMgKiB0ZXgueCAtIHMgKiB0ZXgueSxcXG4gICAgICAgcyAqIHRleC54ICsgYyAqIHRleC55XFxuICAgKSAqIHNjYWxlO1xcbiAgIHJldHVybiAoc2luKHBvaW50LngpICogc2luKHBvaW50LnkpKSAqIDQuMDtcXG59XFxuXFxudm9pZCBtYWluKClcXG57XFxuICAgdmVjNCBjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgZmxvYXQgYXZlcmFnZSA9IChjb2xvci5yICsgY29sb3IuZyArIGNvbG9yLmIpIC8gMy4wO1xcbiAgIGdsX0ZyYWdDb2xvciA9IHZlYzQodmVjMyhhdmVyYWdlICogMTAuMCAtIDUuMCArIHBhdHRlcm4oKSksIGNvbG9yLmEpO1xcbn1cXG5cIixvPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG8obyxyKXt2b2lkIDA9PT1vJiYobz0xKSx2b2lkIDA9PT1yJiYocj01KSxlLmNhbGwodGhpcyxuLHQpLHRoaXMuc2NhbGU9byx0aGlzLmFuZ2xlPXJ9ZSYmKG8uX19wcm90b19fPWUpLChvLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bzt2YXIgcj17c2NhbGU6e2NvbmZpZ3VyYWJsZTohMH0sYW5nbGU6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnNjYWxlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNjYWxlfSxyLnNjYWxlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnNjYWxlPWV9LHIuYW5nbGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYW5nbGV9LHIuYW5nbGUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYW5nbGU9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoby5wcm90b3R5cGUsciksb30oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Eb3RGaWx0ZXI9byxlLkRvdEZpbHRlcj1vLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZG90LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93IGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKHQsZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZSh0Ll9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IGFscGhhO1xcbnVuaWZvcm0gdmVjMyBjb2xvcjtcXG52b2lkIG1haW4odm9pZCl7XFxuICAgIHZlYzQgc2FtcGxlID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgLy8gVW4tcHJlbXVsdGlwbHkgYWxwaGEgYmVmb3JlIGFwcGx5aW5nIHRoZSBjb2xvclxcbiAgICBpZiAoc2FtcGxlLmEgPiAwLjApIHtcXG4gICAgICAgIHNhbXBsZS5yZ2IgLz0gc2FtcGxlLmE7XFxuICAgIH1cXG5cXG4gICAgLy8gUHJlbXVsdGlwbHkgYWxwaGEgYWdhaW5cXG4gICAgc2FtcGxlLnJnYiA9IGNvbG9yLnJnYiAqIHNhbXBsZS5hO1xcblxcbiAgICAvLyBhbHBoYSB1c2VyIGFscGhhXFxuICAgIHNhbXBsZSAqPSBhbHBoYTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gc2FtcGxlO1xcbn1cIixpPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGkoaSxuLG8sYSxsKXt2b2lkIDA9PT1pJiYoaT00NSksdm9pZCAwPT09biYmKG49NSksdm9pZCAwPT09byYmKG89Miksdm9pZCAwPT09YSYmKGE9MCksdm9pZCAwPT09bCYmKGw9LjUpLHQuY2FsbCh0aGlzKSx0aGlzLnRpbnRGaWx0ZXI9bmV3IFBJWEkuRmlsdGVyKGUsciksdGhpcy5ibHVyRmlsdGVyPW5ldyBQSVhJLmZpbHRlcnMuQmx1ckZpbHRlcix0aGlzLmJsdXJGaWx0ZXIuYmx1cj1vLHRoaXMudGFyZ2V0VHJhbnNmb3JtPW5ldyBQSVhJLk1hdHJpeCx0aGlzLnJvdGF0aW9uPWksdGhpcy5wYWRkaW5nPW4sdGhpcy5kaXN0YW5jZT1uLHRoaXMuYWxwaGE9bCx0aGlzLmNvbG9yPWF9dCYmKGkuX19wcm90b19fPXQpLChpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9aTt2YXIgbj17ZGlzdGFuY2U6e2NvbmZpZ3VyYWJsZTohMH0scm90YXRpb246e2NvbmZpZ3VyYWJsZTohMH0sYmx1cjp7Y29uZmlndXJhYmxlOiEwfSxhbHBoYTp7Y29uZmlndXJhYmxlOiEwfSxjb2xvcjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKHQsZSxyLGkpe3ZhciBuPXQuZ2V0UmVuZGVyVGFyZ2V0KCk7bi50cmFuc2Zvcm09dGhpcy50YXJnZXRUcmFuc2Zvcm0sdGhpcy50aW50RmlsdGVyLmFwcGx5KHQsZSxuLCEwKSx0aGlzLmJsdXJGaWx0ZXIuYXBwbHkodCxuLHIpLHQuYXBwbHlGaWx0ZXIodGhpcyxlLHIsaSksbi50cmFuc2Zvcm09bnVsbCx0LnJldHVyblJlbmRlclRhcmdldChuKX0saS5wcm90b3R5cGUuX3VwZGF0ZVBhZGRpbmc9ZnVuY3Rpb24oKXt0aGlzLnBhZGRpbmc9dGhpcy5kaXN0YW5jZSsyKnRoaXMuYmx1cn0saS5wcm90b3R5cGUuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMudGFyZ2V0VHJhbnNmb3JtLnR4PXRoaXMuZGlzdGFuY2UqTWF0aC5jb3ModGhpcy5hbmdsZSksdGhpcy50YXJnZXRUcmFuc2Zvcm0udHk9dGhpcy5kaXN0YW5jZSpNYXRoLnNpbih0aGlzLmFuZ2xlKX0sbi5kaXN0YW5jZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGlzdGFuY2V9LG4uZGlzdGFuY2Uuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuX2Rpc3RhbmNlPXQsdGhpcy5fdXBkYXRlUGFkZGluZygpLHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxuLnJvdGF0aW9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmFuZ2xlL1BJWEkuREVHX1RPX1JBRH0sbi5yb3RhdGlvbi5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5hbmdsZT10KlBJWEkuREVHX1RPX1JBRCx0aGlzLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm0oKX0sbi5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJGaWx0ZXIuYmx1cn0sbi5ibHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLmJsdXJGaWx0ZXIuYmx1cj10LHRoaXMuX3VwZGF0ZVBhZGRpbmcoKX0sbi5hbHBoYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhfSxuLmFscGhhLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuYWxwaGE9dH0sbi5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gUElYSS51dGlscy5yZ2IyaGV4KHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LG4uY29sb3Iuc2V0PWZ1bmN0aW9uKHQpe1BJWEkudXRpbHMuaGV4MnJnYih0LHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGkucHJvdG90eXBlLG4pLGl9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuRHJvcFNoYWRvd0ZpbHRlcj1pLHQuRHJvcFNoYWRvd0ZpbHRlcj1pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZHJvcC1zaGFkb3cuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1lbWJvc3MgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWVtYm9zcyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBzdHJlbmd0aDtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuXFx0dmVjMiBvbmVQaXhlbCA9IHZlYzIoMS4wIC8gZmlsdGVyQXJlYSk7XFxuXFxuXFx0dmVjNCBjb2xvcjtcXG5cXG5cXHRjb2xvci5yZ2IgPSB2ZWMzKDAuNSk7XFxuXFxuXFx0Y29sb3IgLT0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkIC0gb25lUGl4ZWwpICogc3RyZW5ndGg7XFxuXFx0Y29sb3IgKz0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgb25lUGl4ZWwpICogc3RyZW5ndGg7XFxuXFxuXFx0Y29sb3IucmdiID0gdmVjMygoY29sb3IuciArIGNvbG9yLmcgKyBjb2xvci5iKSAvIDMuMCk7XFxuXFxuXFx0ZmxvYXQgYWxwaGEgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpLmE7XFxuXFxuXFx0Z2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvci5yZ2IgKiBhbHBoYSwgYWxwaGEpO1xcbn1cXG5cIixvPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG8obyl7dm9pZCAwPT09byYmKG89NSksZS5jYWxsKHRoaXMsdCxyKSx0aGlzLnN0cmVuZ3RoPW99ZSYmKG8uX19wcm90b19fPWUpLChvLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bzt2YXIgbj17c3RyZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBuLnN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnN0cmVuZ3RofSxuLnN0cmVuZ3RoLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnN0cmVuZ3RoPWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG8ucHJvdG90eXBlLG4pLG99KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuRW1ib3NzRmlsdGVyPW8sZS5FbWJvc3NGaWx0ZXI9byxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWVtYm9zcy5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWdsb3cgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLWdsb3cgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obyxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9uKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxuKTpuKG8uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSBmbG9hdCBkaXN0YW5jZTtcXG51bmlmb3JtIGZsb2F0IG91dGVyU3RyZW5ndGg7XFxudW5pZm9ybSBmbG9hdCBpbm5lclN0cmVuZ3RoO1xcbnVuaWZvcm0gdmVjNCBnbG93Q29sb3I7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckNsYW1wO1xcbnZlYzIgcHggPSB2ZWMyKDEuMCAvIGZpbHRlckFyZWEueCwgMS4wIC8gZmlsdGVyQXJlYS55KTtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICBjb25zdCBmbG9hdCBQSSA9IDMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQ7XFxuICAgIHZlYzQgb3duQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWM0IGN1ckNvbG9yO1xcbiAgICBmbG9hdCB0b3RhbEFscGhhID0gMC4wO1xcbiAgICBmbG9hdCBtYXhUb3RhbEFscGhhID0gMC4wO1xcbiAgICBmbG9hdCBjb3NBbmdsZTtcXG4gICAgZmxvYXQgc2luQW5nbGU7XFxuICAgIHZlYzIgZGlzcGxhY2VkO1xcbiAgICBmb3IgKGZsb2F0IGFuZ2xlID0gMC4wOyBhbmdsZSA8PSBQSSAqIDIuMDsgYW5nbGUgKz0gJVFVQUxJVFlfRElTVCUpIHtcXG4gICAgICAgY29zQW5nbGUgPSBjb3MoYW5nbGUpO1xcbiAgICAgICBzaW5BbmdsZSA9IHNpbihhbmdsZSk7XFxuICAgICAgIGZvciAoZmxvYXQgY3VyRGlzdGFuY2UgPSAxLjA7IGN1ckRpc3RhbmNlIDw9ICVESVNUJTsgY3VyRGlzdGFuY2UrKykge1xcbiAgICAgICAgICAgZGlzcGxhY2VkLnggPSB2VGV4dHVyZUNvb3JkLnggKyBjb3NBbmdsZSAqIGN1ckRpc3RhbmNlICogcHgueDtcXG4gICAgICAgICAgIGRpc3BsYWNlZC55ID0gdlRleHR1cmVDb29yZC55ICsgc2luQW5nbGUgKiBjdXJEaXN0YW5jZSAqIHB4Lnk7XFxuICAgICAgICAgICBjdXJDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgY2xhbXAoZGlzcGxhY2VkLCBmaWx0ZXJDbGFtcC54eSwgZmlsdGVyQ2xhbXAuencpKTtcXG4gICAgICAgICAgIHRvdGFsQWxwaGEgKz0gKGRpc3RhbmNlIC0gY3VyRGlzdGFuY2UpICogY3VyQ29sb3IuYTtcXG4gICAgICAgICAgIG1heFRvdGFsQWxwaGEgKz0gKGRpc3RhbmNlIC0gY3VyRGlzdGFuY2UpO1xcbiAgICAgICB9XFxuICAgIH1cXG4gICAgbWF4VG90YWxBbHBoYSA9IG1heChtYXhUb3RhbEFscGhhLCAwLjAwMDEpO1xcblxcbiAgICBvd25Db2xvci5hID0gbWF4KG93bkNvbG9yLmEsIDAuMDAwMSk7XFxuICAgIG93bkNvbG9yLnJnYiA9IG93bkNvbG9yLnJnYiAvIG93bkNvbG9yLmE7XFxuICAgIGZsb2F0IG91dGVyR2xvd0FscGhhID0gKHRvdGFsQWxwaGEgLyBtYXhUb3RhbEFscGhhKSAgKiBvdXRlclN0cmVuZ3RoICogKDEuIC0gb3duQ29sb3IuYSk7XFxuICAgIGZsb2F0IGlubmVyR2xvd0FscGhhID0gKChtYXhUb3RhbEFscGhhIC0gdG90YWxBbHBoYSkgLyBtYXhUb3RhbEFscGhhKSAqIGlubmVyU3RyZW5ndGggKiBvd25Db2xvci5hO1xcbiAgICBmbG9hdCByZXN1bHRBbHBoYSA9IChvd25Db2xvci5hICsgb3V0ZXJHbG93QWxwaGEpO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KG1peChtaXgob3duQ29sb3IucmdiLCBnbG93Q29sb3IucmdiLCBpbm5lckdsb3dBbHBoYSAvIG93bkNvbG9yLmEpLCBnbG93Q29sb3IucmdiLCBvdXRlckdsb3dBbHBoYSAvIHJlc3VsdEFscGhhKSAqIHJlc3VsdEFscGhhLCByZXN1bHRBbHBoYSk7XFxufVxcblwiLGU9ZnVuY3Rpb24obyl7ZnVuY3Rpb24gZShlLHIsaSxsLGEpe3ZvaWQgMD09PWUmJihlPTEwKSx2b2lkIDA9PT1yJiYocj00KSx2b2lkIDA9PT1pJiYoaT0wKSx2b2lkIDA9PT1sJiYobD0xNjc3NzIxNSksdm9pZCAwPT09YSYmKGE9LjEpLG8uY2FsbCh0aGlzLG4sdC5yZXBsYWNlKC8lUVVBTElUWV9ESVNUJS9naSxcIlwiKygxL2EvZSkudG9GaXhlZCg3KSkucmVwbGFjZSgvJURJU1QlL2dpLFwiXCIrZS50b0ZpeGVkKDcpKSksdGhpcy51bmlmb3Jtcy5nbG93Q29sb3I9bmV3IEZsb2F0MzJBcnJheShbMCwwLDAsMV0pLHRoaXMuZGlzdGFuY2U9ZSx0aGlzLmNvbG9yPWwsdGhpcy5vdXRlclN0cmVuZ3RoPXIsdGhpcy5pbm5lclN0cmVuZ3RoPWl9byYmKGUuX19wcm90b19fPW8pLChlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG8mJm8ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9ZTt2YXIgcj17Y29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sZGlzdGFuY2U6e2NvbmZpZ3VyYWJsZTohMH0sb3V0ZXJTdHJlbmd0aDp7Y29uZmlndXJhYmxlOiEwfSxpbm5lclN0cmVuZ3RoOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gUElYSS51dGlscy5yZ2IyaGV4KHRoaXMudW5pZm9ybXMuZ2xvd0NvbG9yKX0sci5jb2xvci5zZXQ9ZnVuY3Rpb24obyl7UElYSS51dGlscy5oZXgycmdiKG8sdGhpcy51bmlmb3Jtcy5nbG93Q29sb3IpfSxyLmRpc3RhbmNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmRpc3RhbmNlfSxyLmRpc3RhbmNlLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLmRpc3RhbmNlPW99LHIub3V0ZXJTdHJlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5vdXRlclN0cmVuZ3RofSxyLm91dGVyU3RyZW5ndGguc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMub3V0ZXJTdHJlbmd0aD1vfSxyLmlubmVyU3RyZW5ndGguZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuaW5uZXJTdHJlbmd0aH0sci5pbm5lclN0cmVuZ3RoLnNldD1mdW5jdGlvbihvKXt0aGlzLnVuaWZvcm1zLmlubmVyU3RyZW5ndGg9b30sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZS5wcm90b3R5cGUsciksZX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5HbG93RmlsdGVyPWUsby5HbG93RmlsdGVyPWUsT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1nbG93LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItZ29kcmF5IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1nb2RyYXkgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obixlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKG4uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInZlYzMgbW9kMjg5KHZlYzMgeClcXG57XFxuICAgIHJldHVybiB4IC0gZmxvb3IoeCAqICgxLjAgLyAyODkuMCkpICogMjg5LjA7XFxufVxcbnZlYzQgbW9kMjg5KHZlYzQgeClcXG57XFxuICAgIHJldHVybiB4IC0gZmxvb3IoeCAqICgxLjAgLyAyODkuMCkpICogMjg5LjA7XFxufVxcbnZlYzQgcGVybXV0ZSh2ZWM0IHgpXFxue1xcbiAgICByZXR1cm4gbW9kMjg5KCgoeCAqIDM0LjApICsgMS4wKSAqIHgpO1xcbn1cXG52ZWM0IHRheWxvckludlNxcnQodmVjNCByKVxcbntcXG4gICAgcmV0dXJuIDEuNzkyODQyOTE0MDAxNTkgLSAwLjg1MzczNDcyMDk1MzE0ICogcjtcXG59XFxudmVjMyBmYWRlKHZlYzMgdClcXG57XFxuICAgIHJldHVybiB0ICogdCAqIHQgKiAodCAqICh0ICogNi4wIC0gMTUuMCkgKyAxMC4wKTtcXG59XFxuLy8gQ2xhc3NpYyBQZXJsaW4gbm9pc2UsIHBlcmlvZGljIHZhcmlhbnRcXG5mbG9hdCBwbm9pc2UodmVjMyBQLCB2ZWMzIHJlcClcXG57XFxuICAgIHZlYzMgUGkwID0gbW9kKGZsb29yKFApLCByZXApOyAvLyBJbnRlZ2VyIHBhcnQsIG1vZHVsbyBwZXJpb2RcXG4gICAgdmVjMyBQaTEgPSBtb2QoUGkwICsgdmVjMygxLjApLCByZXApOyAvLyBJbnRlZ2VyIHBhcnQgKyAxLCBtb2QgcGVyaW9kXFxuICAgIFBpMCA9IG1vZDI4OShQaTApO1xcbiAgICBQaTEgPSBtb2QyODkoUGkxKTtcXG4gICAgdmVjMyBQZjAgPSBmcmFjdChQKTsgLy8gRnJhY3Rpb25hbCBwYXJ0IGZvciBpbnRlcnBvbGF0aW9uXFxuICAgIHZlYzMgUGYxID0gUGYwIC0gdmVjMygxLjApOyAvLyBGcmFjdGlvbmFsIHBhcnQgLSAxLjBcXG4gICAgdmVjNCBpeCA9IHZlYzQoUGkwLngsIFBpMS54LCBQaTAueCwgUGkxLngpO1xcbiAgICB2ZWM0IGl5ID0gdmVjNChQaTAueXksIFBpMS55eSk7XFxuICAgIHZlYzQgaXowID0gUGkwLnp6eno7XFxuICAgIHZlYzQgaXoxID0gUGkxLnp6eno7XFxuICAgIHZlYzQgaXh5ID0gcGVybXV0ZShwZXJtdXRlKGl4KSArIGl5KTtcXG4gICAgdmVjNCBpeHkwID0gcGVybXV0ZShpeHkgKyBpejApO1xcbiAgICB2ZWM0IGl4eTEgPSBwZXJtdXRlKGl4eSArIGl6MSk7XFxuICAgIHZlYzQgZ3gwID0gaXh5MCAqICgxLjAgLyA3LjApO1xcbiAgICB2ZWM0IGd5MCA9IGZyYWN0KGZsb29yKGd4MCkgKiAoMS4wIC8gNy4wKSkgLSAwLjU7XFxuICAgIGd4MCA9IGZyYWN0KGd4MCk7XFxuICAgIHZlYzQgZ3owID0gdmVjNCgwLjUpIC0gYWJzKGd4MCkgLSBhYnMoZ3kwKTtcXG4gICAgdmVjNCBzejAgPSBzdGVwKGd6MCwgdmVjNCgwLjApKTtcXG4gICAgZ3gwIC09IHN6MCAqIChzdGVwKDAuMCwgZ3gwKSAtIDAuNSk7XFxuICAgIGd5MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd5MCkgLSAwLjUpO1xcbiAgICB2ZWM0IGd4MSA9IGl4eTEgKiAoMS4wIC8gNy4wKTtcXG4gICAgdmVjNCBneTEgPSBmcmFjdChmbG9vcihneDEpICogKDEuMCAvIDcuMCkpIC0gMC41O1xcbiAgICBneDEgPSBmcmFjdChneDEpO1xcbiAgICB2ZWM0IGd6MSA9IHZlYzQoMC41KSAtIGFicyhneDEpIC0gYWJzKGd5MSk7XFxuICAgIHZlYzQgc3oxID0gc3RlcChnejEsIHZlYzQoMC4wKSk7XFxuICAgIGd4MSAtPSBzejEgKiAoc3RlcCgwLjAsIGd4MSkgLSAwLjUpO1xcbiAgICBneTEgLT0gc3oxICogKHN0ZXAoMC4wLCBneTEpIC0gMC41KTtcXG4gICAgdmVjMyBnMDAwID0gdmVjMyhneDAueCwgZ3kwLngsIGd6MC54KTtcXG4gICAgdmVjMyBnMTAwID0gdmVjMyhneDAueSwgZ3kwLnksIGd6MC55KTtcXG4gICAgdmVjMyBnMDEwID0gdmVjMyhneDAueiwgZ3kwLnosIGd6MC56KTtcXG4gICAgdmVjMyBnMTEwID0gdmVjMyhneDAudywgZ3kwLncsIGd6MC53KTtcXG4gICAgdmVjMyBnMDAxID0gdmVjMyhneDEueCwgZ3kxLngsIGd6MS54KTtcXG4gICAgdmVjMyBnMTAxID0gdmVjMyhneDEueSwgZ3kxLnksIGd6MS55KTtcXG4gICAgdmVjMyBnMDExID0gdmVjMyhneDEueiwgZ3kxLnosIGd6MS56KTtcXG4gICAgdmVjMyBnMTExID0gdmVjMyhneDEudywgZ3kxLncsIGd6MS53KTtcXG4gICAgdmVjNCBub3JtMCA9IHRheWxvckludlNxcnQodmVjNChkb3QoZzAwMCwgZzAwMCksIGRvdChnMDEwLCBnMDEwKSwgZG90KGcxMDAsIGcxMDApLCBkb3QoZzExMCwgZzExMCkpKTtcXG4gICAgZzAwMCAqPSBub3JtMC54O1xcbiAgICBnMDEwICo9IG5vcm0wLnk7XFxuICAgIGcxMDAgKj0gbm9ybTAuejtcXG4gICAgZzExMCAqPSBub3JtMC53O1xcbiAgICB2ZWM0IG5vcm0xID0gdGF5bG9ySW52U3FydCh2ZWM0KGRvdChnMDAxLCBnMDAxKSwgZG90KGcwMTEsIGcwMTEpLCBkb3QoZzEwMSwgZzEwMSksIGRvdChnMTExLCBnMTExKSkpO1xcbiAgICBnMDAxICo9IG5vcm0xLng7XFxuICAgIGcwMTEgKj0gbm9ybTEueTtcXG4gICAgZzEwMSAqPSBub3JtMS56O1xcbiAgICBnMTExICo9IG5vcm0xLnc7XFxuICAgIGZsb2F0IG4wMDAgPSBkb3QoZzAwMCwgUGYwKTtcXG4gICAgZmxvYXQgbjEwMCA9IGRvdChnMTAwLCB2ZWMzKFBmMS54LCBQZjAueXopKTtcXG4gICAgZmxvYXQgbjAxMCA9IGRvdChnMDEwLCB2ZWMzKFBmMC54LCBQZjEueSwgUGYwLnopKTtcXG4gICAgZmxvYXQgbjExMCA9IGRvdChnMTEwLCB2ZWMzKFBmMS54eSwgUGYwLnopKTtcXG4gICAgZmxvYXQgbjAwMSA9IGRvdChnMDAxLCB2ZWMzKFBmMC54eSwgUGYxLnopKTtcXG4gICAgZmxvYXQgbjEwMSA9IGRvdChnMTAxLCB2ZWMzKFBmMS54LCBQZjAueSwgUGYxLnopKTtcXG4gICAgZmxvYXQgbjAxMSA9IGRvdChnMDExLCB2ZWMzKFBmMC54LCBQZjEueXopKTtcXG4gICAgZmxvYXQgbjExMSA9IGRvdChnMTExLCBQZjEpO1xcbiAgICB2ZWMzIGZhZGVfeHl6ID0gZmFkZShQZjApO1xcbiAgICB2ZWM0IG5feiA9IG1peCh2ZWM0KG4wMDAsIG4xMDAsIG4wMTAsIG4xMTApLCB2ZWM0KG4wMDEsIG4xMDEsIG4wMTEsIG4xMTEpLCBmYWRlX3h5ei56KTtcXG4gICAgdmVjMiBuX3l6ID0gbWl4KG5fei54eSwgbl96Lnp3LCBmYWRlX3h5ei55KTtcXG4gICAgZmxvYXQgbl94eXogPSBtaXgobl95ei54LCBuX3l6LnksIGZhZGVfeHl6LngpO1xcbiAgICByZXR1cm4gMi4yICogbl94eXo7XFxufVxcbmZsb2F0IHR1cmIodmVjMyBQLCB2ZWMzIHJlcCwgZmxvYXQgbGFjdW5hcml0eSwgZmxvYXQgZ2FpbilcXG57XFxuICAgIGZsb2F0IHN1bSA9IDAuMDtcXG4gICAgZmxvYXQgc2MgPSAxLjA7XFxuICAgIGZsb2F0IHRvdGFsZ2FpbiA9IDEuMDtcXG4gICAgZm9yIChmbG9hdCBpID0gMC4wOyBpIDwgNi4wOyBpKyspXFxuICAgIHtcXG4gICAgICAgIHN1bSArPSB0b3RhbGdhaW4gKiBwbm9pc2UoUCAqIHNjLCByZXApO1xcbiAgICAgICAgc2MgKj0gbGFjdW5hcml0eTtcXG4gICAgICAgIHRvdGFsZ2FpbiAqPSBnYWluO1xcbiAgICB9XFxuICAgIHJldHVybiBhYnMoc3VtKTtcXG59XFxuXCIsaT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjMiBkaW1lbnNpb25zO1xcblxcbnVuaWZvcm0gdmVjMiBhbmdsZURpcjtcXG51bmlmb3JtIGZsb2F0IGdhaW47XFxudW5pZm9ybSBmbG9hdCBsYWN1bmFyaXR5O1xcbnVuaWZvcm0gZmxvYXQgdGltZTtcXG5cXG4ke3Blcmxpbn1cXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWMyIGNvb3JkID0gdlRleHR1cmVDb29yZCAqIGZpbHRlckFyZWEueHkgLyBkaW1lbnNpb25zLnh5O1xcblxcbiAgICBmbG9hdCB4eCA9IGFuZ2xlRGlyLng7XFxuICAgIGZsb2F0IHl5ID0gYW5nbGVEaXIueTtcXG5cXG4gICAgZmxvYXQgZCA9ICh4eCAqIGNvb3JkLngpICsgKHl5ICogY29vcmQueSk7XFxuICAgIHZlYzMgZGlyID0gdmVjMyhkLCBkLCAwLjApO1xcblxcbiAgICBmbG9hdCBub2lzZSA9IHR1cmIoZGlyICsgdmVjMyh0aW1lLCAwLjAsIDYyLjEgKyB0aW1lKSAqIDAuMDUsIHZlYzMoNDgwLjAsIDMyMC4wLCA0ODAuMCksIGxhY3VuYXJpdHksIGdhaW4pO1xcbiAgICBub2lzZSA9IG1peChub2lzZSwgMC4wLCAwLjMpO1xcbiAgICAvL2ZhZGUgdmVydGljYWxseS5cXG4gICAgdmVjNCBtaXN0ID0gdmVjNChub2lzZSwgbm9pc2UsIG5vaXNlLCAxLjApICogKDEuMCAtIGNvb3JkLnkpO1xcbiAgICBtaXN0LmEgPSAxLjA7XFxuICAgIGdsX0ZyYWdDb2xvciArPSBtaXN0O1xcbn1cXG5cIixvPWZ1bmN0aW9uKG4pe2Z1bmN0aW9uIG8obyxyLGEsYyl7dm9pZCAwPT09byYmKG89MzApLHZvaWQgMD09PXImJihyPS41KSx2b2lkIDA9PT1hJiYoYT0yLjUpLHZvaWQgMD09PWMmJihjPTApLG4uY2FsbCh0aGlzLGUsaS5yZXBsYWNlKFwiJHtwZXJsaW59XCIsdCkpLHRoaXMuYW5nbGU9byx0aGlzLmdhaW49cix0aGlzLmxhY3VuYXJpdHk9YSx0aGlzLnRpbWU9Y31uJiYoby5fX3Byb3RvX189biksKG8ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobiYmbi5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1vO3ZhciByPXthbmdsZTp7Y29uZmlndXJhYmxlOiEwfSxnYWluOntjb25maWd1cmFibGU6ITB9LGxhY3VuYXJpdHk6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBvLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihuLGUsdCxpKXt2YXIgbz1lLnNvdXJjZUZyYW1lLndpZHRoLHI9ZS5zb3VyY2VGcmFtZS5oZWlnaHQ7dGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzBdPW8sdGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzFdPXIsdGhpcy51bmlmb3Jtcy50aW1lPXRoaXMudGltZSx0aGlzLnVuaWZvcm1zLmFuZ2xlRGlyWzFdPXRoaXMuX2FuZ2xlU2luKnIvbyxuLmFwcGx5RmlsdGVyKHRoaXMsZSx0LGkpfSxyLmFuZ2xlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9hbmdsZX0sci5hbmdsZS5zZXQ9ZnVuY3Rpb24obil7dmFyIGU9bipQSVhJLkRFR19UT19SQUQ7dGhpcy5fYW5nbGVDb3M9TWF0aC5jb3MoZSksdGhpcy5fYW5nbGVTaW49TWF0aC5zaW4oZSksdGhpcy51bmlmb3Jtcy5hbmdsZURpclswXT10aGlzLl9hbmdsZUNvcyx0aGlzLl9hbmdsZT1ufSxyLmdhaW4uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuZ2Fpbn0sci5nYWluLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLmdhaW49bn0sci5sYWN1bmFyaXR5LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmxhY3VuYXJpdHl9LHIubGFjdW5hcml0eS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5sYWN1bmFyaXR5PW59LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG8ucHJvdG90eXBlLHIpLG99KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuR29kcmF5RmlsdGVyPW8sbi5Hb2RyYXlGaWx0ZXI9byxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWdvZHJheS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLW1vdGlvbi1ibHVyIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1tb3Rpb24tYmx1ciBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixpPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxuXFxudW5pZm9ybSB2ZWMyIHVWZWxvY2l0eTtcXG51bmlmb3JtIGludCB1S2VybmVsU2l6ZTtcXG51bmlmb3JtIGZsb2F0IHVPZmZzZXQ7XFxuXFxuY29uc3QgaW50IE1BWF9LRVJORUxfU0laRSA9IDIwNDg7XFxuY29uc3QgaW50IElURVJBVElPTiA9IE1BWF9LRVJORUxfU0laRSAtIDE7XFxuXFxudmVjMiB2ZWxvY2l0eSA9IHVWZWxvY2l0eSAvIGZpbHRlckFyZWEueHk7XFxuXFxuLy8gZmxvYXQga2VybmVsU2l6ZSA9IG1pbihmbG9hdCh1S2VybmVsU2l6ZSksIGZsb2F0KE1BWF9LRVJORUxTSVpFKSk7XFxuXFxuLy8gSW4gcmVhbCB1c2UtY2FzZSAsIHVLZXJuZWxTaXplIDwgTUFYX0tFUk5FTFNJWkUgYWxtb3N0IGFsd2F5cy5cXG4vLyBTbyB1c2UgdUtlcm5lbFNpemUgZGlyZWN0bHkuXFxuZmxvYXQga2VybmVsU2l6ZSA9IGZsb2F0KHVLZXJuZWxTaXplKTtcXG5mbG9hdCBrID0ga2VybmVsU2l6ZSAtIDEuMDtcXG5mbG9hdCBvZmZzZXQgPSAtdU9mZnNldCAvIGxlbmd0aCh1VmVsb2NpdHkpIC0gMC41O1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgaWYgKHVLZXJuZWxTaXplID09IDApXFxuICAgIHtcXG4gICAgICAgIHJldHVybjtcXG4gICAgfVxcblxcbiAgICBmb3IoaW50IGkgPSAwOyBpIDwgSVRFUkFUSU9OOyBpKyspIHtcXG4gICAgICAgIGlmIChpID09IGludChrKSkge1xcbiAgICAgICAgICAgIGJyZWFrO1xcbiAgICAgICAgfVxcbiAgICAgICAgdmVjMiBiaWFzID0gdmVsb2NpdHkgKiAoZmxvYXQoaSkgLyBrICsgb2Zmc2V0KTtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciArPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBiaWFzKTtcXG4gICAgfVxcbiAgICBnbF9GcmFnQ29sb3IgLz0ga2VybmVsU2l6ZTtcXG59XFxuXCIsbj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKG4sbyxyKXt2b2lkIDA9PT1uJiYobj1bMCwwXSksdm9pZCAwPT09byYmKG89NSksdm9pZCAwPT09ciYmKHI9MCksZS5jYWxsKHRoaXMsdCxpKSx0aGlzLl92ZWxvY2l0eT1uZXcgUElYSS5Qb2ludCgwLDApLHRoaXMudmVsb2NpdHk9bix0aGlzLmtlcm5lbFNpemU9byx0aGlzLm9mZnNldD1yfWUmJihuLl9fcHJvdG9fXz1lKSwobi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW47dmFyIG89e3ZlbG9jaXR5Ontjb25maWd1cmFibGU6ITB9LG9mZnNldDp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIG4ucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsdCxpLG4pe3ZhciBvPXRoaXMudmVsb2NpdHkscj1vLngsbD1vLnk7dGhpcy51bmlmb3Jtcy51S2VybmVsU2l6ZT0wIT09cnx8MCE9PWw/dGhpcy5rZXJuZWxTaXplOjAsZS5hcHBseUZpbHRlcih0aGlzLHQsaSxuKX0sby52ZWxvY2l0eS5zZXQ9ZnVuY3Rpb24oZSl7QXJyYXkuaXNBcnJheShlKT8odGhpcy5fdmVsb2NpdHkueD1lWzBdLHRoaXMuX3ZlbG9jaXR5Lnk9ZVsxXSk6ZSBpbnN0YW5jZW9mIFBJWEkuUG9pbnQmJih0aGlzLl92ZWxvY2l0eS54PWUueCx0aGlzLl92ZWxvY2l0eS55PWUueSksdGhpcy51bmlmb3Jtcy51VmVsb2NpdHlbMF09dGhpcy5fdmVsb2NpdHkueCx0aGlzLnVuaWZvcm1zLnVWZWxvY2l0eVsxXT10aGlzLl92ZWxvY2l0eS55fSxvLnZlbG9jaXR5LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl92ZWxvY2l0eX0sby5vZmZzZXQuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudU9mZnNldD1lfSxvLm9mZnNldC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51T2Zmc2V0fSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxvKSxufShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLk1vdGlvbkJsdXJGaWx0ZXI9bixlLk1vdGlvbkJsdXJGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLW1vdGlvbi1ibHVyLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihvLGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUoby5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihvKXtcInVzZSBzdHJpY3RcIjt2YXIgZT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudW5pZm9ybSBmbG9hdCBlcHNpbG9uO1xcblxcbmNvbnN0IGludCBNQVhfQ09MT1JTID0gJW1heENvbG9ycyU7XFxuXFxudW5pZm9ybSB2ZWMzIG9yaWdpbmFsQ29sb3JzW01BWF9DT0xPUlNdO1xcbnVuaWZvcm0gdmVjMyB0YXJnZXRDb2xvcnNbTUFYX0NPTE9SU107XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBmbG9hdCBhbHBoYSA9IGdsX0ZyYWdDb2xvci5hO1xcbiAgICBpZiAoYWxwaGEgPCAwLjAwMDEpXFxuICAgIHtcXG4gICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgdmVjMyBjb2xvciA9IGdsX0ZyYWdDb2xvci5yZ2IgLyBhbHBoYTtcXG5cXG4gICAgZm9yKGludCBpID0gMDsgaSA8IE1BWF9DT0xPUlM7IGkrKylcXG4gICAge1xcbiAgICAgIHZlYzMgb3JpZ0NvbG9yID0gb3JpZ2luYWxDb2xvcnNbaV07XFxuICAgICAgaWYgKG9yaWdDb2xvci5yIDwgMC4wKVxcbiAgICAgIHtcXG4gICAgICAgIGJyZWFrO1xcbiAgICAgIH1cXG4gICAgICB2ZWMzIGNvbG9yRGlmZiA9IG9yaWdDb2xvciAtIGNvbG9yO1xcbiAgICAgIGlmIChsZW5ndGgoY29sb3JEaWZmKSA8IGVwc2lsb24pXFxuICAgICAge1xcbiAgICAgICAgdmVjMyB0YXJnZXRDb2xvciA9IHRhcmdldENvbG9yc1tpXTtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoKHRhcmdldENvbG9yICsgY29sb3JEaWZmKSAqIGFscGhhLCBhbHBoYSk7XFxuICAgICAgICByZXR1cm47XFxuICAgICAgfVxcbiAgICB9XFxufVxcblwiLG49ZnVuY3Rpb24obyl7ZnVuY3Rpb24gbihuLHQsaSl7dm9pZCAwPT09dCYmKHQ9LjA1KSx2b2lkIDA9PT1pJiYoaT1udWxsKSxpPWl8fG4ubGVuZ3RoLG8uY2FsbCh0aGlzLGUsci5yZXBsYWNlKC8lbWF4Q29sb3JzJS9nLGkpKSx0aGlzLmVwc2lsb249dCx0aGlzLl9tYXhDb2xvcnM9aSx0aGlzLl9yZXBsYWNlbWVudHM9bnVsbCx0aGlzLnVuaWZvcm1zLm9yaWdpbmFsQ29sb3JzPW5ldyBGbG9hdDMyQXJyYXkoMyppKSx0aGlzLnVuaWZvcm1zLnRhcmdldENvbG9ycz1uZXcgRmxvYXQzMkFycmF5KDMqaSksdGhpcy5yZXBsYWNlbWVudHM9bn1vJiYobi5fX3Byb3RvX189byksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobyYmby5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciB0PXtyZXBsYWNlbWVudHM6e2NvbmZpZ3VyYWJsZTohMH0sbWF4Q29sb3JzOntjb25maWd1cmFibGU6ITB9LGVwc2lsb246e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiB0LnJlcGxhY2VtZW50cy5zZXQ9ZnVuY3Rpb24obyl7dmFyIGU9dGhpcy51bmlmb3Jtcy5vcmlnaW5hbENvbG9ycyxyPXRoaXMudW5pZm9ybXMudGFyZ2V0Q29sb3JzLG49by5sZW5ndGg7aWYobj50aGlzLl9tYXhDb2xvcnMpdGhyb3dcIkxlbmd0aCBvZiByZXBsYWNlbWVudHMgKFwiK24rXCIpIGV4Y2VlZHMgdGhlIG1heGltdW0gY29sb3JzIGxlbmd0aCAoXCIrdGhpcy5fbWF4Q29sb3JzK1wiKVwiO2VbMypuXT0tMTtmb3IodmFyIHQ9MDt0PG47dCsrKXt2YXIgaT1vW3RdLGw9aVswXTtcIm51bWJlclwiPT10eXBlb2YgbD9sPVBJWEkudXRpbHMuaGV4MnJnYihsKTppWzBdPVBJWEkudXRpbHMucmdiMmhleChsKSxlWzMqdF09bFswXSxlWzMqdCsxXT1sWzFdLGVbMyp0KzJdPWxbMl07dmFyIGE9aVsxXTtcIm51bWJlclwiPT10eXBlb2YgYT9hPVBJWEkudXRpbHMuaGV4MnJnYihhKTppWzFdPVBJWEkudXRpbHMucmdiMmhleChhKSxyWzMqdF09YVswXSxyWzMqdCsxXT1hWzFdLHJbMyp0KzJdPWFbMl19dGhpcy5fcmVwbGFjZW1lbnRzPW99LHQucmVwbGFjZW1lbnRzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZXBsYWNlbWVudHN9LG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt0aGlzLnJlcGxhY2VtZW50cz10aGlzLl9yZXBsYWNlbWVudHN9LHQubWF4Q29sb3JzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9tYXhDb2xvcnN9LHQuZXBzaWxvbi5zZXQ9ZnVuY3Rpb24obyl7dGhpcy51bmlmb3Jtcy5lcHNpbG9uPW99LHQuZXBzaWxvbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5lcHNpbG9ufSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSx0KSxufShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLk11bHRpQ29sb3JSZXBsYWNlRmlsdGVyPW4sby5NdWx0aUNvbG9yUmVwbGFjZUZpbHRlcj1uLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItbXVsdGktY29sb3ItcmVwbGFjZS5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLW9sZC1maWxtIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1vbGQtZmlsbSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihuLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQobi5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihuKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixpPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7XFxudW5pZm9ybSB2ZWMyIGRpbWVuc2lvbnM7XFxuXFxudW5pZm9ybSBmbG9hdCBzZXBpYTtcXG51bmlmb3JtIGZsb2F0IG5vaXNlO1xcbnVuaWZvcm0gZmxvYXQgbm9pc2VTaXplO1xcbnVuaWZvcm0gZmxvYXQgc2NyYXRjaDtcXG51bmlmb3JtIGZsb2F0IHNjcmF0Y2hEZW5zaXR5O1xcbnVuaWZvcm0gZmxvYXQgc2NyYXRjaFdpZHRoO1xcbnVuaWZvcm0gZmxvYXQgdmlnbmV0dGluZztcXG51bmlmb3JtIGZsb2F0IHZpZ25ldHRpbmdBbHBoYTtcXG51bmlmb3JtIGZsb2F0IHZpZ25ldHRpbmdCbHVyO1xcbnVuaWZvcm0gZmxvYXQgc2VlZDtcXG5cXG5jb25zdCBmbG9hdCBTUVJUXzIgPSAxLjQxNDIxMztcXG5jb25zdCB2ZWMzIFNFUElBX1JHQiA9IHZlYzMoMTEyLjAgLyAyNTUuMCwgNjYuMCAvIDI1NS4wLCAyMC4wIC8gMjU1LjApO1xcblxcbmZsb2F0IHJhbmQodmVjMiBjbykge1xcbiAgICByZXR1cm4gZnJhY3Qoc2luKGRvdChjby54eSwgdmVjMigxMi45ODk4LCA3OC4yMzMpKSkgKiA0Mzc1OC41NDUzKTtcXG59XFxuXFxudmVjMyBPdmVybGF5KHZlYzMgc3JjLCB2ZWMzIGRzdClcXG57XFxuICAgIC8vIGlmIChkc3QgPD0gMC41KSB0aGVuOiAyICogc3JjICogZHN0XFxuICAgIC8vIGlmIChkc3QgPiAwLjUpIHRoZW46IDEgLSAyICogKDEgLSBkc3QpICogKDEgLSBzcmMpXFxuICAgIHJldHVybiB2ZWMzKChkc3QueCA8PSAwLjUpID8gKDIuMCAqIHNyYy54ICogZHN0LngpIDogKDEuMCAtIDIuMCAqICgxLjAgLSBkc3QueCkgKiAoMS4wIC0gc3JjLngpKSxcXG4gICAgICAgICAgICAgICAgKGRzdC55IDw9IDAuNSkgPyAoMi4wICogc3JjLnkgKiBkc3QueSkgOiAoMS4wIC0gMi4wICogKDEuMCAtIGRzdC55KSAqICgxLjAgLSBzcmMueSkpLFxcbiAgICAgICAgICAgICAgICAoZHN0LnogPD0gMC41KSA/ICgyLjAgKiBzcmMueiAqIGRzdC56KSA6ICgxLjAgLSAyLjAgKiAoMS4wIC0gZHN0LnopICogKDEuMCAtIHNyYy56KSkpO1xcbn1cXG5cXG5cXG52b2lkIG1haW4oKVxcbntcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjMyBjb2xvciA9IGdsX0ZyYWdDb2xvci5yZ2I7XFxuXFxuICAgIGlmIChzZXBpYSA+IDAuMClcXG4gICAge1xcbiAgICAgICAgZmxvYXQgZ3JheSA9IChjb2xvci54ICsgY29sb3IueSArIGNvbG9yLnopIC8gMy4wO1xcbiAgICAgICAgdmVjMyBncmF5c2NhbGUgPSB2ZWMzKGdyYXkpO1xcblxcbiAgICAgICAgY29sb3IgPSBPdmVybGF5KFNFUElBX1JHQiwgZ3JheXNjYWxlKTtcXG5cXG4gICAgICAgIGNvbG9yID0gZ3JheXNjYWxlICsgc2VwaWEgKiAoY29sb3IgLSBncmF5c2NhbGUpO1xcbiAgICB9XFxuXFxuICAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkICogZmlsdGVyQXJlYS54eSAvIGRpbWVuc2lvbnMueHk7XFxuXFxuICAgIGlmICh2aWduZXR0aW5nID4gMC4wKVxcbiAgICB7XFxuICAgICAgICBmbG9hdCBvdXR0ZXIgPSBTUVJUXzIgLSB2aWduZXR0aW5nICogU1FSVF8yO1xcbiAgICAgICAgdmVjMiBkaXIgPSB2ZWMyKHZlYzIoMC41LCAwLjUpIC0gY29vcmQpO1xcbiAgICAgICAgZGlyLnkgKj0gZGltZW5zaW9ucy55IC8gZGltZW5zaW9ucy54O1xcbiAgICAgICAgZmxvYXQgZGFya2VyID0gY2xhbXAoKG91dHRlciAtIGxlbmd0aChkaXIpICogU1FSVF8yKSAvICggMC4wMDAwMSArIHZpZ25ldHRpbmdCbHVyICogU1FSVF8yKSwgMC4wLCAxLjApO1xcbiAgICAgICAgY29sb3IucmdiICo9IGRhcmtlciArICgxLjAgLSBkYXJrZXIpICogKDEuMCAtIHZpZ25ldHRpbmdBbHBoYSk7XFxuICAgIH1cXG5cXG4gICAgaWYgKHNjcmF0Y2hEZW5zaXR5ID4gc2VlZCAmJiBzY3JhdGNoICE9IDAuMClcXG4gICAge1xcbiAgICAgICAgZmxvYXQgcGhhc2UgPSBzZWVkICogMjU2LjA7XFxuICAgICAgICBmbG9hdCBzID0gbW9kKGZsb29yKHBoYXNlKSwgMi4wKTtcXG4gICAgICAgIGZsb2F0IGRpc3QgPSAxLjAgLyBzY3JhdGNoRGVuc2l0eTtcXG4gICAgICAgIGZsb2F0IGQgPSBkaXN0YW5jZShjb29yZCwgdmVjMihzZWVkICogZGlzdCwgYWJzKHMgLSBzZWVkICogZGlzdCkpKTtcXG4gICAgICAgIGlmIChkIDwgc2VlZCAqIDAuNiArIDAuNClcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBoaWdocCBmbG9hdCBwZXJpb2QgPSBzY3JhdGNoRGVuc2l0eSAqIDEwLjA7XFxuXFxuICAgICAgICAgICAgZmxvYXQgeHggPSBjb29yZC54ICogcGVyaW9kICsgcGhhc2U7XFxuICAgICAgICAgICAgZmxvYXQgYWEgPSBhYnMobW9kKHh4LCAwLjUpICogNC4wKTtcXG4gICAgICAgICAgICBmbG9hdCBiYiA9IG1vZChmbG9vcih4eCAvIDAuNSksIDIuMCk7XFxuICAgICAgICAgICAgZmxvYXQgeXkgPSAoMS4wIC0gYmIpICogYWEgKyBiYiAqICgyLjAgLSBhYSk7XFxuXFxuICAgICAgICAgICAgZmxvYXQga2sgPSAyLjAgKiBwZXJpb2Q7XFxuICAgICAgICAgICAgZmxvYXQgZHcgPSBzY3JhdGNoV2lkdGggLyBkaW1lbnNpb25zLnggKiAoMC43NSArIHNlZWQpO1xcbiAgICAgICAgICAgIGZsb2F0IGRoID0gZHcgKiBraztcXG5cXG4gICAgICAgICAgICBmbG9hdCB0aW5lID0gKHl5IC0gKDIuMCAtIGRoKSk7XFxuXFxuICAgICAgICAgICAgaWYgKHRpbmUgPiAwLjApIHtcXG4gICAgICAgICAgICAgICAgZmxvYXQgX3NpZ24gPSBzaWduKHNjcmF0Y2gpO1xcblxcbiAgICAgICAgICAgICAgICB0aW5lID0gcyAqIHRpbmUgLyBwZXJpb2QgKyBzY3JhdGNoICsgMC4xO1xcbiAgICAgICAgICAgICAgICB0aW5lID0gY2xhbXAodGluZSArIDEuMCwgMC41ICsgX3NpZ24gKiAwLjUsIDEuNSArIF9zaWduICogMC41KTtcXG5cXG4gICAgICAgICAgICAgICAgY29sb3IucmdiICo9IHRpbmU7XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgIGlmIChub2lzZSA+IDAuMCAmJiBub2lzZVNpemUgPiAwLjApXFxuICAgIHtcXG4gICAgICAgIHZlYzIgcGl4ZWxDb29yZCA9IHZUZXh0dXJlQ29vcmQueHkgKiBmaWx0ZXJBcmVhLnh5O1xcbiAgICAgICAgcGl4ZWxDb29yZC54ID0gZmxvb3IocGl4ZWxDb29yZC54IC8gbm9pc2VTaXplKTtcXG4gICAgICAgIHBpeGVsQ29vcmQueSA9IGZsb29yKHBpeGVsQ29vcmQueSAvIG5vaXNlU2l6ZSk7XFxuICAgICAgICAvLyB2ZWMyIGQgPSBwaXhlbENvb3JkICogbm9pc2VTaXplICogdmVjMigxMDI0LjAgKyBzZWVkICogNTEyLjAsIDEwMjQuMCAtIHNlZWQgKiA1MTIuMCk7XFxuICAgICAgICAvLyBmbG9hdCBfbm9pc2UgPSBzbm9pc2UoZCkgKiAwLjU7XFxuICAgICAgICBmbG9hdCBfbm9pc2UgPSByYW5kKHBpeGVsQ29vcmQgKiBub2lzZVNpemUgKiBzZWVkKSAtIDAuNTtcXG4gICAgICAgIGNvbG9yICs9IF9ub2lzZSAqIG5vaXNlO1xcbiAgICB9XFxuXFxuICAgIGdsX0ZyYWdDb2xvci5yZ2IgPSBjb2xvcjtcXG59XFxuXCIsZT1mdW5jdGlvbihuKXtmdW5jdGlvbiBlKGUsbyl7dm9pZCAwPT09byYmKG89MCksbi5jYWxsKHRoaXMsdCxpKSxcIm51bWJlclwiPT10eXBlb2YgZT8odGhpcy5zZWVkPWUsZT1udWxsKTp0aGlzLnNlZWQ9byxPYmplY3QuYXNzaWduKHRoaXMse3NlcGlhOi4zLG5vaXNlOi4zLG5vaXNlU2l6ZToxLHNjcmF0Y2g6LjUsc2NyYXRjaERlbnNpdHk6LjMsc2NyYXRjaFdpZHRoOjEsdmlnbmV0dGluZzouMyx2aWduZXR0aW5nQWxwaGE6MSx2aWduZXR0aW5nQmx1cjouM30sZSl9biYmKGUuX19wcm90b19fPW4pLChlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG4mJm4ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9ZTt2YXIgbz17c2VwaWE6e2NvbmZpZ3VyYWJsZTohMH0sbm9pc2U6e2NvbmZpZ3VyYWJsZTohMH0sbm9pc2VTaXplOntjb25maWd1cmFibGU6ITB9LHNjcmF0Y2g6e2NvbmZpZ3VyYWJsZTohMH0sc2NyYXRjaERlbnNpdHk6e2NvbmZpZ3VyYWJsZTohMH0sc2NyYXRjaFdpZHRoOntjb25maWd1cmFibGU6ITB9LHZpZ25ldHRpbmc6e2NvbmZpZ3VyYWJsZTohMH0sdmlnbmV0dGluZ0FscGhhOntjb25maWd1cmFibGU6ITB9LHZpZ25ldHRpbmdCbHVyOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gZS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24obix0LGksZSl7dGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzBdPXQuc291cmNlRnJhbWUud2lkdGgsdGhpcy51bmlmb3Jtcy5kaW1lbnNpb25zWzFdPXQuc291cmNlRnJhbWUuaGVpZ2h0LHRoaXMudW5pZm9ybXMuc2VlZD10aGlzLnNlZWQsbi5hcHBseUZpbHRlcih0aGlzLHQsaSxlKX0sby5zZXBpYS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5zZXBpYT1ufSxvLnNlcGlhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNlcGlhfSxvLm5vaXNlLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLm5vaXNlPW59LG8ubm9pc2UuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMubm9pc2V9LG8ubm9pc2VTaXplLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLm5vaXNlU2l6ZT1ufSxvLm5vaXNlU2l6ZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ub2lzZVNpemV9LG8uc2NyYXRjaC5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy5zY3JhdGNoPW59LG8uc2NyYXRjaC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY3JhdGNofSxvLnNjcmF0Y2hEZW5zaXR5LnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnNjcmF0Y2hEZW5zaXR5PW59LG8uc2NyYXRjaERlbnNpdHkuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc2NyYXRjaERlbnNpdHl9LG8uc2NyYXRjaFdpZHRoLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnNjcmF0Y2hXaWR0aD1ufSxvLnNjcmF0Y2hXaWR0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zY3JhdGNoV2lkdGh9LG8udmlnbmV0dGluZy5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy52aWduZXR0aW5nPW59LG8udmlnbmV0dGluZy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy52aWduZXR0aW5nfSxvLnZpZ25ldHRpbmdBbHBoYS5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy52aWduZXR0aW5nQWxwaGE9bn0sby52aWduZXR0aW5nQWxwaGEuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudmlnbmV0dGluZ0FscGhhfSxvLnZpZ25ldHRpbmdCbHVyLnNldD1mdW5jdGlvbihuKXt0aGlzLnVuaWZvcm1zLnZpZ25ldHRpbmdCbHVyPW59LG8udmlnbmV0dGluZ0JsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudmlnbmV0dGluZ0JsdXJ9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGUucHJvdG90eXBlLG8pLGV9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuT2xkRmlsbUZpbHRlcj1lLG4uT2xkRmlsbUZpbHRlcj1lLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItb2xkLWZpbG0uanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1vdXRsaW5lIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1vdXRsaW5lIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbyl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/byhleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbyk6byhlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBvPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG51bmlmb3JtIGZsb2F0IHRoaWNrbmVzcztcXG51bmlmb3JtIHZlYzQgb3V0bGluZUNvbG9yO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJDbGFtcDtcXG52ZWMyIHB4ID0gdmVjMigxLjAgLyBmaWx0ZXJBcmVhLngsIDEuMCAvIGZpbHRlckFyZWEueSk7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0O1xcbiAgICB2ZWM0IG93bkNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjNCBjdXJDb2xvcjtcXG4gICAgZmxvYXQgbWF4QWxwaGEgPSAwLjtcXG4gICAgdmVjMiBkaXNwbGFjZWQ7XFxuICAgIGZvciAoZmxvYXQgYW5nbGUgPSAwLjsgYW5nbGUgPCBQSSAqIDIuOyBhbmdsZSArPSAlVEhJQ0tORVNTJSApIHtcXG4gICAgICAgIGRpc3BsYWNlZC54ID0gdlRleHR1cmVDb29yZC54ICsgdGhpY2tuZXNzICogcHgueCAqIGNvcyhhbmdsZSk7XFxuICAgICAgICBkaXNwbGFjZWQueSA9IHZUZXh0dXJlQ29vcmQueSArIHRoaWNrbmVzcyAqIHB4LnkgKiBzaW4oYW5nbGUpO1xcbiAgICAgICAgY3VyQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wKGRpc3BsYWNlZCwgZmlsdGVyQ2xhbXAueHksIGZpbHRlckNsYW1wLnp3KSk7XFxuICAgICAgICBtYXhBbHBoYSA9IG1heChtYXhBbHBoYSwgY3VyQ29sb3IuYSk7XFxuICAgIH1cXG4gICAgZmxvYXQgcmVzdWx0QWxwaGEgPSBtYXgobWF4QWxwaGEsIG93bkNvbG9yLmEpO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KChvd25Db2xvci5yZ2IgKyBvdXRsaW5lQ29sb3IucmdiICogKDEuIC0gb3duQ29sb3IuYSkpICogcmVzdWx0QWxwaGEsIHJlc3VsdEFscGhhKTtcXG59XFxuXCIsbj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKG4scil7dm9pZCAwPT09biYmKG49MSksdm9pZCAwPT09ciYmKHI9MCksZS5jYWxsKHRoaXMsbyx0LnJlcGxhY2UoLyVUSElDS05FU1MlL2dpLCgxL24pLnRvRml4ZWQoNykpKSx0aGlzLnRoaWNrbmVzcz1uLHRoaXMudW5pZm9ybXMub3V0bGluZUNvbG9yPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDFdKSx0aGlzLmNvbG9yPXJ9ZSYmKG4uX19wcm90b19fPWUpLChuLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9bjt2YXIgcj17Y29sb3I6e2NvbmZpZ3VyYWJsZTohMH0sdGhpY2tuZXNzOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gUElYSS51dGlscy5yZ2IyaGV4KHRoaXMudW5pZm9ybXMub3V0bGluZUNvbG9yKX0sci5jb2xvci5zZXQ9ZnVuY3Rpb24oZSl7UElYSS51dGlscy5oZXgycmdiKGUsdGhpcy51bmlmb3Jtcy5vdXRsaW5lQ29sb3IpfSxyLnRoaWNrbmVzcy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy50aGlja25lc3N9LHIudGhpY2tuZXNzLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnRoaWNrbmVzcz1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhuLnByb3RvdHlwZSxyKSxufShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLk91dGxpbmVGaWx0ZXI9bixlLk91dGxpbmVGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLW91dGxpbmUuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1waXhlbGF0ZSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItcGl4ZWxhdGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxvKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9vKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxvKTpvKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG89XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gdmVjMiBzaXplO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnZlYzIgbWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgKj0gZmlsdGVyQXJlYS54eTtcXG4gICAgY29vcmQgKz0gZmlsdGVyQXJlYS56dztcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHVubWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgLT0gZmlsdGVyQXJlYS56dztcXG4gICAgY29vcmQgLz0gZmlsdGVyQXJlYS54eTtcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHBpeGVsYXRlKHZlYzIgY29vcmQsIHZlYzIgc2l6ZSlcXG57XFxuXFx0cmV0dXJuIGZsb29yKCBjb29yZCAvIHNpemUgKSAqIHNpemU7XFxufVxcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgdmVjMiBjb29yZCA9IG1hcENvb3JkKHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBjb29yZCA9IHBpeGVsYXRlKGNvb3JkLCBzaXplKTtcXG5cXG4gICAgY29vcmQgPSB1bm1hcENvb3JkKGNvb3JkKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb29yZCk7XFxufVxcblwiLG49ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihuKXt2b2lkIDA9PT1uJiYobj0xMCksZS5jYWxsKHRoaXMsbyxyKSx0aGlzLnNpemU9bn1lJiYobi5fX3Byb3RvX189ZSksKG4ucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1uO3ZhciB0PXtzaXplOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gdC5zaXplLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnNpemV9LHQuc2l6ZS5zZXQ9ZnVuY3Rpb24oZSl7XCJudW1iZXJcIj09dHlwZW9mIGUmJihlPVtlLGVdKSx0aGlzLnVuaWZvcm1zLnNpemU9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsdCksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5QaXhlbGF0ZUZpbHRlcj1uLGUuUGl4ZWxhdGVGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXBpeGVsYXRlLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItcmFkaWFsLWJsdXIgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXJhZGlhbC1ibHVyIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsbil7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bihleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sbik6bihlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciBuPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHQ9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG5cXG51bmlmb3JtIGZsb2F0IHVSYWRpYW47XFxudW5pZm9ybSB2ZWMyIHVDZW50ZXI7XFxudW5pZm9ybSBmbG9hdCB1UmFkaXVzO1xcbnVuaWZvcm0gaW50IHVLZXJuZWxTaXplO1xcblxcbmNvbnN0IGludCBNQVhfS0VSTkVMX1NJWkUgPSAyMDQ4O1xcbmNvbnN0IGludCBJVEVSQVRJT04gPSBNQVhfS0VSTkVMX1NJWkUgLSAxO1xcblxcbi8vIGZsb2F0IGtlcm5lbFNpemUgPSBtaW4oZmxvYXQodUtlcm5lbFNpemUpLCBmbG9hdChNQVhfS0VSTkVMU0laRSkpO1xcblxcbi8vIEluIHJlYWwgdXNlLWNhc2UgLCB1S2VybmVsU2l6ZSA8IE1BWF9LRVJORUxTSVpFIGFsbW9zdCBhbHdheXMuXFxuLy8gU28gdXNlIHVLZXJuZWxTaXplIGRpcmVjdGx5LlxcbmZsb2F0IGtlcm5lbFNpemUgPSBmbG9hdCh1S2VybmVsU2l6ZSk7XFxuZmxvYXQgayA9IGtlcm5lbFNpemUgLSAxLjA7XFxuXFxuXFxudmVjMiBjZW50ZXIgPSB1Q2VudGVyLnh5IC8gZmlsdGVyQXJlYS54eTtcXG5mbG9hdCBhc3BlY3QgPSBmaWx0ZXJBcmVhLnkgLyBmaWx0ZXJBcmVhLng7XFxuXFxuZmxvYXQgZ3JhZGllbnQgPSB1UmFkaXVzIC8gZmlsdGVyQXJlYS54ICogMC4zO1xcbmZsb2F0IHJhZGl1cyA9IHVSYWRpdXMgLyBmaWx0ZXJBcmVhLnggLSBncmFkaWVudCAqIDAuNTtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIGlmICh1S2VybmVsU2l6ZSA9PSAwKVxcbiAgICB7XFxuICAgICAgICByZXR1cm47XFxuICAgIH1cXG5cXG4gICAgdmVjMiBjb29yZCA9IHZUZXh0dXJlQ29vcmQ7XFxuXFxuICAgIHZlYzIgZGlyID0gdmVjMihjZW50ZXIgLSBjb29yZCk7XFxuICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgodmVjMihkaXIueCwgZGlyLnkgKiBhc3BlY3QpKTtcXG5cXG4gICAgZmxvYXQgcmFkaWFuU3RlcDtcXG5cXG4gICAgaWYgKHJhZGl1cyA+PSAwLjAgJiYgZGlzdCA+IHJhZGl1cykge1xcbiAgICAgICAgZmxvYXQgZGVsdGEgPSBkaXN0IC0gcmFkaXVzO1xcbiAgICAgICAgZmxvYXQgZ2FwID0gZ3JhZGllbnQ7XFxuICAgICAgICBmbG9hdCBzY2FsZSA9IDEuMCAtIGFicyhkZWx0YSAvIGdhcCk7XFxuICAgICAgICBpZiAoc2NhbGUgPD0gMC4wKSB7XFxuICAgICAgICAgICAgcmV0dXJuO1xcbiAgICAgICAgfVxcbiAgICAgICAgcmFkaWFuU3RlcCA9IHVSYWRpYW4gKiBzY2FsZSAvIGs7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgICByYWRpYW5TdGVwID0gdVJhZGlhbiAvIGs7XFxuICAgIH1cXG5cXG4gICAgZmxvYXQgcyA9IHNpbihyYWRpYW5TdGVwKTtcXG4gICAgZmxvYXQgYyA9IGNvcyhyYWRpYW5TdGVwKTtcXG4gICAgbWF0MiByb3RhdGlvbk1hdHJpeCA9IG1hdDIodmVjMihjLCAtcyksIHZlYzIocywgYykpO1xcblxcbiAgICBmb3IoaW50IGkgPSAwOyBpIDwgSVRFUkFUSU9OOyBpKyspIHtcXG4gICAgICAgIGlmIChpID09IGludChrKSkge1xcbiAgICAgICAgICAgIGJyZWFrO1xcbiAgICAgICAgfVxcblxcbiAgICAgICAgY29vcmQgLT0gY2VudGVyO1xcbiAgICAgICAgY29vcmQueSAqPSBhc3BlY3Q7XFxuICAgICAgICBjb29yZCA9IHJvdGF0aW9uTWF0cml4ICogY29vcmQ7XFxuICAgICAgICBjb29yZC55IC89IGFzcGVjdDtcXG4gICAgICAgIGNvb3JkICs9IGNlbnRlcjtcXG5cXG4gICAgICAgIHZlYzQgc2FtcGxlID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb29yZCk7XFxuXFxuICAgICAgICAvLyBzd2l0Y2ggdG8gcHJlLW11bHRpcGxpZWQgYWxwaGEgdG8gY29ycmVjdGx5IGJsdXIgdHJhbnNwYXJlbnQgaW1hZ2VzXFxuICAgICAgICAvLyBzYW1wbGUucmdiICo9IHNhbXBsZS5hO1xcblxcbiAgICAgICAgZ2xfRnJhZ0NvbG9yICs9IHNhbXBsZTtcXG4gICAgfVxcbiAgICBnbF9GcmFnQ29sb3IgLz0ga2VybmVsU2l6ZTtcXG59XFxuXCIscj1mdW5jdGlvbihlKXtmdW5jdGlvbiByKHIsaSxvLGEpe3ZvaWQgMD09PXImJihyPTApLHZvaWQgMD09PWkmJihpPVswLDBdKSx2b2lkIDA9PT1vJiYobz01KSx2b2lkIDA9PT1hJiYoYT0tMSksZS5jYWxsKHRoaXMsbix0KSx0aGlzLl9hbmdsZT0wLHRoaXMuYW5nbGU9cix0aGlzLmNlbnRlcj1pLHRoaXMua2VybmVsU2l6ZT1vLHRoaXMucmFkaXVzPWF9ZSYmKHIuX19wcm90b19fPWUpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgaT17YW5nbGU6e2NvbmZpZ3VyYWJsZTohMH0sY2VudGVyOntjb25maWd1cmFibGU6ITB9LHJhZGl1czp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHIucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsbix0LHIpe3RoaXMudW5pZm9ybXMudUtlcm5lbFNpemU9MCE9PXRoaXMuX2FuZ2xlP3RoaXMua2VybmVsU2l6ZTowLGUuYXBwbHlGaWx0ZXIodGhpcyxuLHQscil9LGkuYW5nbGUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMuX2FuZ2xlPWUsdGhpcy51bmlmb3Jtcy51UmFkaWFuPWUqTWF0aC5QSS8xODB9LGkuYW5nbGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FuZ2xlfSxpLmNlbnRlci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51Q2VudGVyfSxpLmNlbnRlci5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy51Q2VudGVyPWV9LGkucmFkaXVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVSYWRpdXN9LGkucmFkaXVzLnNldD1mdW5jdGlvbihlKXsoZTwwfHxlPT09MS8wKSYmKGU9LTEpLHRoaXMudW5pZm9ybXMudVJhZGl1cz1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxpKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlJhZGlhbEJsdXJGaWx0ZXI9cixlLlJhZGlhbEJsdXJGaWx0ZXI9cixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXJhZGlhbC1ibHVyLmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItcmdiLXNwbGl0IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci1yZ2Itc3BsaXQgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSxyKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9yKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxyKTpyKGUuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjMiByZWQ7XFxudW5pZm9ybSB2ZWMyIGdyZWVuO1xcbnVuaWZvcm0gdmVjMiBibHVlO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICBnbF9GcmFnQ29sb3IuciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIHJlZC9maWx0ZXJBcmVhLnh5KS5yO1xcbiAgIGdsX0ZyYWdDb2xvci5nID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkICsgZ3JlZW4vZmlsdGVyQXJlYS54eSkuZztcXG4gICBnbF9GcmFnQ29sb3IuYiA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIGJsdWUvZmlsdGVyQXJlYS54eSkuYjtcXG4gICBnbF9GcmFnQ29sb3IuYSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkuYTtcXG59XFxuXCIsbj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKG4sbyxpKXt2b2lkIDA9PT1uJiYobj1bLTEwLDBdKSx2b2lkIDA9PT1vJiYobz1bMCwxMF0pLHZvaWQgMD09PWkmJihpPVswLDBdKSxlLmNhbGwodGhpcyxyLHQpLHRoaXMucmVkPW4sdGhpcy5ncmVlbj1vLHRoaXMuYmx1ZT1pfWUmJihuLl9fcHJvdG9fXz1lKSwobi5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPW47dmFyIG89e3JlZDp7Y29uZmlndXJhYmxlOiEwfSxncmVlbjp7Y29uZmlndXJhYmxlOiEwfSxibHVlOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gby5yZWQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMucmVkfSxvLnJlZC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5yZWQ9ZX0sby5ncmVlbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5ncmVlbn0sby5ncmVlbi5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5ncmVlbj1lfSxvLmJsdWUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYmx1ZX0sby5ibHVlLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmJsdWU9ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobi5wcm90b3R5cGUsbyksbn0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5SR0JTcGxpdEZpbHRlcj1uLGUuUkdCU3BsaXRGaWx0ZXI9bixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXJnYi1zcGxpdC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXNob2Nrd2F2ZSAtIHYyLjQuMFxuICogQ29tcGlsZWQgTW9uLCAxOCBEZWMgMjAxNyAwMDozNjoyMyBVVENcbiAqXG4gKiBAcGl4aS9maWx0ZXItc2hvY2t3YXZlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLl9fcGl4aUZpbHRlcnM9e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO3ZhciB0PVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLG49XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQXJlYTtcXG51bmlmb3JtIHZlYzQgZmlsdGVyQ2xhbXA7XFxuXFxudW5pZm9ybSB2ZWMyIGNlbnRlcjtcXG5cXG51bmlmb3JtIGZsb2F0IGFtcGxpdHVkZTtcXG51bmlmb3JtIGZsb2F0IHdhdmVsZW5ndGg7XFxuLy8gdW5pZm9ybSBmbG9hdCBwb3dlcjtcXG51bmlmb3JtIGZsb2F0IGJyaWdodG5lc3M7XFxudW5pZm9ybSBmbG9hdCBzcGVlZDtcXG51bmlmb3JtIGZsb2F0IHJhZGl1cztcXG5cXG51bmlmb3JtIGZsb2F0IHRpbWU7XFxuXFxuY29uc3QgZmxvYXQgUEkgPSAzLjE0MTU5O1xcblxcbnZvaWQgbWFpbigpXFxue1xcbiAgICBmbG9hdCBoYWxmV2F2ZWxlbmd0aCA9IHdhdmVsZW5ndGggKiAwLjUgLyBmaWx0ZXJBcmVhLng7XFxuICAgIGZsb2F0IG1heFJhZGl1cyA9IHJhZGl1cyAvIGZpbHRlckFyZWEueDtcXG4gICAgZmxvYXQgY3VycmVudFJhZGl1cyA9IHRpbWUgKiBzcGVlZCAvIGZpbHRlckFyZWEueDtcXG5cXG4gICAgZmxvYXQgZmFkZSA9IDEuMDtcXG5cXG4gICAgaWYgKG1heFJhZGl1cyA+IDAuMCkge1xcbiAgICAgICAgaWYgKGN1cnJlbnRSYWRpdXMgPiBtYXhSYWRpdXMpIHtcXG4gICAgICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICAgICAgICAgIHJldHVybjtcXG4gICAgICAgIH1cXG4gICAgICAgIGZhZGUgPSAxLjAgLSBwb3coY3VycmVudFJhZGl1cyAvIG1heFJhZGl1cywgMi4wKTtcXG4gICAgfVxcblxcbiAgICB2ZWMyIGRpciA9IHZlYzIodlRleHR1cmVDb29yZCAtIGNlbnRlciAvIGZpbHRlckFyZWEueHkpO1xcbiAgICBkaXIueSAqPSBmaWx0ZXJBcmVhLnkgLyBmaWx0ZXJBcmVhLng7XFxuICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgoZGlyKTtcXG5cXG4gICAgaWYgKGRpc3QgPD0gMC4wIHx8IGRpc3QgPCBjdXJyZW50UmFkaXVzIC0gaGFsZldhdmVsZW5ndGggfHwgZGlzdCA+IGN1cnJlbnRSYWRpdXMgKyBoYWxmV2F2ZWxlbmd0aCkge1xcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgICAgIHJldHVybjtcXG4gICAgfVxcblxcbiAgICB2ZWMyIGRpZmZVViA9IG5vcm1hbGl6ZShkaXIpO1xcblxcbiAgICBmbG9hdCBkaWZmID0gKGRpc3QgLSBjdXJyZW50UmFkaXVzKSAvIGhhbGZXYXZlbGVuZ3RoO1xcblxcbiAgICBmbG9hdCBwID0gMS4wIC0gcG93KGFicyhkaWZmKSwgMi4wKTtcXG5cXG4gICAgLy8gZmxvYXQgcG93RGlmZiA9IGRpZmYgKiBwb3cocCwgMi4wKSAqICggYW1wbGl0dWRlICogZmFkZSApO1xcbiAgICBmbG9hdCBwb3dEaWZmID0gMS4yNSAqIHNpbihkaWZmICogUEkpICogcCAqICggYW1wbGl0dWRlICogZmFkZSApO1xcblxcbiAgICB2ZWMyIG9mZnNldCA9IGRpZmZVViAqIHBvd0RpZmYgLyBmaWx0ZXJBcmVhLnh5O1xcblxcbiAgICAvLyBEbyBjbGFtcCA6XFxuICAgIHZlYzIgY29vcmQgPSB2VGV4dHVyZUNvb3JkICsgb2Zmc2V0O1xcbiAgICB2ZWMyIGNsYW1wZWRDb29yZCA9IGNsYW1wKGNvb3JkLCBmaWx0ZXJDbGFtcC54eSwgZmlsdGVyQ2xhbXAuencpO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIGNsYW1wZWRDb29yZCk7XFxuICAgIGlmIChjb29yZCAhPSBjbGFtcGVkQ29vcmQpIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciAqPSBtYXgoMC4wLCAxLjAgLSBsZW5ndGgoY29vcmQgLSBjbGFtcGVkQ29vcmQpKTtcXG4gICAgfVxcblxcbiAgICAvLyBObyBjbGFtcCA6XFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCArIG9mZnNldCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvci5yZ2IgKj0gMS4wICsgKGJyaWdodG5lc3MgLSAxLjApICogcCAqIGZhZGU7XFxufVxcblwiLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gcihyLGksbyl7dm9pZCAwPT09ciYmKHI9WzAsMF0pLHZvaWQgMD09PWkmJihpPXt9KSx2b2lkIDA9PT1vJiYobz0wKSxlLmNhbGwodGhpcyx0LG4pLHRoaXMuY2VudGVyPXIsQXJyYXkuaXNBcnJheShpKSYmKGNvbnNvbGUud2FybihcIkRlcHJlY2F0ZWQgV2FybmluZzogU2hvY2t3YXZlRmlsdGVyIHBhcmFtcyBBcnJheSBoYXMgYmVlbiBjaGFuZ2VkIHRvIG9wdGlvbnMgT2JqZWN0LlwiKSxpPXt9KSxpPU9iamVjdC5hc3NpZ24oe2FtcGxpdHVkZTozMCx3YXZlbGVuZ3RoOjE2MCxicmlnaHRuZXNzOjEsc3BlZWQ6NTAwLHJhZGl1czotMX0saSksdGhpcy5hbXBsaXR1ZGU9aS5hbXBsaXR1ZGUsdGhpcy53YXZlbGVuZ3RoPWkud2F2ZWxlbmd0aCx0aGlzLmJyaWdodG5lc3M9aS5icmlnaHRuZXNzLHRoaXMuc3BlZWQ9aS5zcGVlZCx0aGlzLnJhZGl1cz1pLnJhZGl1cyx0aGlzLnRpbWU9b31lJiYoci5fX3Byb3RvX189ZSksKHIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1yO3ZhciBpPXtjZW50ZXI6e2NvbmZpZ3VyYWJsZTohMH0sYW1wbGl0dWRlOntjb25maWd1cmFibGU6ITB9LHdhdmVsZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH0sYnJpZ2h0bmVzczp7Y29uZmlndXJhYmxlOiEwfSxzcGVlZDp7Y29uZmlndXJhYmxlOiEwfSxyYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiByLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihlLHQsbixyKXt0aGlzLnVuaWZvcm1zLnRpbWU9dGhpcy50aW1lLGUuYXBwbHlGaWx0ZXIodGhpcyx0LG4scil9LGkuY2VudGVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmNlbnRlcn0saS5jZW50ZXIuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuY2VudGVyPWV9LGkuYW1wbGl0dWRlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmFtcGxpdHVkZX0saS5hbXBsaXR1ZGUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMuYW1wbGl0dWRlPWV9LGkud2F2ZWxlbmd0aC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy53YXZlbGVuZ3RofSxpLndhdmVsZW5ndGguc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMud2F2ZWxlbmd0aD1lfSxpLmJyaWdodG5lc3MuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYnJpZ2h0bmVzc30saS5icmlnaHRuZXNzLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLmJyaWdodG5lc3M9ZX0saS5zcGVlZC5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5zcGVlZH0saS5zcGVlZC5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5zcGVlZD1lfSxpLnJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy5yYWRpdXN9LGkucmFkaXVzLnNldD1mdW5jdGlvbihlKXt0aGlzLnVuaWZvcm1zLnJhZGl1cz1lfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxpKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlNob2Nrd2F2ZUZpbHRlcj1yLGUuU2hvY2t3YXZlRmlsdGVyPXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1zaG9ja3dhdmUuanMubWFwXG4iLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1zaW1wbGUtbGlnaHRtYXAgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXNpbXBsZS1saWdodG1hcCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixvPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBzYW1wbGVyMkQgdUxpZ2h0bWFwO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcbnVuaWZvcm0gdmVjMiBkaW1lbnNpb25zO1xcbnVuaWZvcm0gdmVjNCBhbWJpZW50Q29sb3I7XFxudm9pZCBtYWluKCkge1xcbiAgICB2ZWM0IGRpZmZ1c2VDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzIgbGlnaHRDb29yZCA9ICh2VGV4dHVyZUNvb3JkICogZmlsdGVyQXJlYS54eSkgLyBkaW1lbnNpb25zO1xcbiAgICB2ZWM0IGxpZ2h0ID0gdGV4dHVyZTJEKHVMaWdodG1hcCwgbGlnaHRDb29yZCk7XFxuICAgIHZlYzMgYW1iaWVudCA9IGFtYmllbnRDb2xvci5yZ2IgKiBhbWJpZW50Q29sb3IuYTtcXG4gICAgdmVjMyBpbnRlbnNpdHkgPSBhbWJpZW50ICsgbGlnaHQucmdiO1xcbiAgICB2ZWMzIGZpbmFsQ29sb3IgPSBkaWZmdXNlQ29sb3IucmdiICogaW50ZW5zaXR5O1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGZpbmFsQ29sb3IsIGRpZmZ1c2VDb2xvci5hKTtcXG59XFxuXCIsaT1mdW5jdGlvbihlKXtmdW5jdGlvbiBpKGkscixuKXt2b2lkIDA9PT1yJiYocj0wKSx2b2lkIDA9PT1uJiYobj0xKSxlLmNhbGwodGhpcyx0LG8pLHRoaXMudW5pZm9ybXMuYW1iaWVudENvbG9yPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLG5dKSx0aGlzLnRleHR1cmU9aSx0aGlzLmNvbG9yPXJ9ZSYmKGkuX19wcm90b19fPWUpLChpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlKSkuY29uc3RydWN0b3I9aTt2YXIgcj17dGV4dHVyZTp7Y29uZmlndXJhYmxlOiEwfSxjb2xvcjp7Y29uZmlndXJhYmxlOiEwfSxhbHBoYTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGUsdCxvLGkpe3RoaXMudW5pZm9ybXMuZGltZW5zaW9uc1swXT10LnNvdXJjZUZyYW1lLndpZHRoLHRoaXMudW5pZm9ybXMuZGltZW5zaW9uc1sxXT10LnNvdXJjZUZyYW1lLmhlaWdodCxlLmFwcGx5RmlsdGVyKHRoaXMsdCxvLGkpfSxyLnRleHR1cmUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudUxpZ2h0bWFwfSxyLnRleHR1cmUuc2V0PWZ1bmN0aW9uKGUpe3RoaXMudW5pZm9ybXMudUxpZ2h0bWFwPWV9LHIuY29sb3Iuc2V0PWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMudW5pZm9ybXMuYW1iaWVudENvbG9yO1wibnVtYmVyXCI9PXR5cGVvZiBlPyhQSVhJLnV0aWxzLmhleDJyZ2IoZSx0KSx0aGlzLl9jb2xvcj1lKToodFswXT1lWzBdLHRbMV09ZVsxXSx0WzJdPWVbMl0sdFszXT1lWzNdLHRoaXMuX2NvbG9yPVBJWEkudXRpbHMucmdiMmhleCh0KSl9LHIuY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbG9yfSxyLmFscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmFtYmllbnRDb2xvclszXX0sci5hbHBoYS5zZXQ9ZnVuY3Rpb24oZSl7dGhpcy51bmlmb3Jtcy5hbWJpZW50Q29sb3JbM109ZX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaS5wcm90b3R5cGUsciksaX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5TaW1wbGVMaWdodG1hcEZpbHRlcj1pLGUuU2ltcGxlTGlnaHRtYXBGaWx0ZXI9aSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXNpbXBsZS1saWdodG1hcC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXRpbHQtc2hpZnQgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogQHBpeGkvZmlsdGVyLXRpbHQtc2hpZnQgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24odCxpKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9pKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxpKTppKHQuX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGk9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsZT1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYmx1cjtcXG51bmlmb3JtIGZsb2F0IGdyYWRpZW50Qmx1cjtcXG51bmlmb3JtIHZlYzIgc3RhcnQ7XFxudW5pZm9ybSB2ZWMyIGVuZDtcXG51bmlmb3JtIHZlYzIgZGVsdGE7XFxudW5pZm9ybSB2ZWMyIHRleFNpemU7XFxuXFxuZmxvYXQgcmFuZG9tKHZlYzMgc2NhbGUsIGZsb2F0IHNlZWQpXFxue1xcbiAgICByZXR1cm4gZnJhY3Qoc2luKGRvdChnbF9GcmFnQ29vcmQueHl6ICsgc2VlZCwgc2NhbGUpKSAqIDQzNzU4LjU0NTMgKyBzZWVkKTtcXG59XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICB2ZWM0IGNvbG9yID0gdmVjNCgwLjApO1xcbiAgICBmbG9hdCB0b3RhbCA9IDAuMDtcXG5cXG4gICAgZmxvYXQgb2Zmc2V0ID0gcmFuZG9tKHZlYzMoMTIuOTg5OCwgNzguMjMzLCAxNTEuNzE4MiksIDAuMCk7XFxuICAgIHZlYzIgbm9ybWFsID0gbm9ybWFsaXplKHZlYzIoc3RhcnQueSAtIGVuZC55LCBlbmQueCAtIHN0YXJ0LngpKTtcXG4gICAgZmxvYXQgcmFkaXVzID0gc21vb3Roc3RlcCgwLjAsIDEuMCwgYWJzKGRvdCh2VGV4dHVyZUNvb3JkICogdGV4U2l6ZSAtIHN0YXJ0LCBub3JtYWwpKSAvIGdyYWRpZW50Qmx1cikgKiBibHVyO1xcblxcbiAgICBmb3IgKGZsb2F0IHQgPSAtMzAuMDsgdCA8PSAzMC4wOyB0KyspXFxuICAgIHtcXG4gICAgICAgIGZsb2F0IHBlcmNlbnQgPSAodCArIG9mZnNldCAtIDAuNSkgLyAzMC4wO1xcbiAgICAgICAgZmxvYXQgd2VpZ2h0ID0gMS4wIC0gYWJzKHBlcmNlbnQpO1xcbiAgICAgICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQgKyBkZWx0YSAvIHRleFNpemUgKiBwZXJjZW50ICogcmFkaXVzKTtcXG4gICAgICAgIHNhbXBsZS5yZ2IgKj0gc2FtcGxlLmE7XFxuICAgICAgICBjb2xvciArPSBzYW1wbGUgKiB3ZWlnaHQ7XFxuICAgICAgICB0b3RhbCArPSB3ZWlnaHQ7XFxuICAgIH1cXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gY29sb3IgLyB0b3RhbDtcXG4gICAgZ2xfRnJhZ0NvbG9yLnJnYiAvPSBnbF9GcmFnQ29sb3IuYSArIDAuMDAwMDE7XFxufVxcblwiLHI9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gcihyLG4sbyxsKXt2b2lkIDA9PT1yJiYocj0xMDApLHZvaWQgMD09PW4mJihuPTYwMCksdm9pZCAwPT09byYmKG89bnVsbCksdm9pZCAwPT09bCYmKGw9bnVsbCksdC5jYWxsKHRoaXMsaSxlKSx0aGlzLnVuaWZvcm1zLmJsdXI9cix0aGlzLnVuaWZvcm1zLmdyYWRpZW50Qmx1cj1uLHRoaXMudW5pZm9ybXMuc3RhcnQ9b3x8bmV3IFBJWEkuUG9pbnQoMCx3aW5kb3cuaW5uZXJIZWlnaHQvMiksdGhpcy51bmlmb3Jtcy5lbmQ9bHx8bmV3IFBJWEkuUG9pbnQoNjAwLHdpbmRvdy5pbm5lckhlaWdodC8yKSx0aGlzLnVuaWZvcm1zLmRlbHRhPW5ldyBQSVhJLlBvaW50KDMwLDMwKSx0aGlzLnVuaWZvcm1zLnRleFNpemU9bmV3IFBJWEkuUG9pbnQod2luZG93LmlubmVyV2lkdGgsd2luZG93LmlubmVySGVpZ2h0KSx0aGlzLnVwZGF0ZURlbHRhKCl9dCYmKHIuX19wcm90b19fPXQpLChyLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cjt2YXIgbj17Ymx1cjp7Y29uZmlndXJhYmxlOiEwfSxncmFkaWVudEJsdXI6e2NvbmZpZ3VyYWJsZTohMH0sc3RhcnQ6e2NvbmZpZ3VyYWJsZTohMH0sZW5kOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gci5wcm90b3R5cGUudXBkYXRlRGVsdGE9ZnVuY3Rpb24oKXt0aGlzLnVuaWZvcm1zLmRlbHRhLng9MCx0aGlzLnVuaWZvcm1zLmRlbHRhLnk9MH0sbi5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmJsdXJ9LG4uYmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy51bmlmb3Jtcy5ibHVyPXR9LG4uZ3JhZGllbnRCbHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmdyYWRpZW50Qmx1cn0sbi5ncmFkaWVudEJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudW5pZm9ybXMuZ3JhZGllbnRCbHVyPXR9LG4uc3RhcnQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuc3RhcnR9LG4uc3RhcnQuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudW5pZm9ybXMuc3RhcnQ9dCx0aGlzLnVwZGF0ZURlbHRhKCl9LG4uZW5kLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLmVuZH0sbi5lbmQuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudW5pZm9ybXMuZW5kPXQsdGhpcy51cGRhdGVEZWx0YSgpfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxuKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlRpbHRTaGlmdEF4aXNGaWx0ZXI9cjt2YXIgbj1mdW5jdGlvbih0KXtmdW5jdGlvbiBpKCl7dC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9cmV0dXJuIHQmJihpLl9fcHJvdG9fXz10KSxpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSxpLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1pLGkucHJvdG90eXBlLnVwZGF0ZURlbHRhPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy51bmlmb3Jtcy5lbmQueC10aGlzLnVuaWZvcm1zLnN0YXJ0LngsaT10aGlzLnVuaWZvcm1zLmVuZC55LXRoaXMudW5pZm9ybXMuc3RhcnQueSxlPU1hdGguc3FydCh0KnQraSppKTt0aGlzLnVuaWZvcm1zLmRlbHRhLng9dC9lLHRoaXMudW5pZm9ybXMuZGVsdGEueT1pL2V9LGl9KHIpO1BJWEkuZmlsdGVycy5UaWx0U2hpZnRYRmlsdGVyPW47dmFyIG89ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaSgpe3QuYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiB0JiYoaS5fX3Byb3RvX189dCksaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSksaS5wcm90b3R5cGUuY29uc3RydWN0b3I9aSxpLnByb3RvdHlwZS51cGRhdGVEZWx0YT1mdW5jdGlvbigpe3ZhciB0PXRoaXMudW5pZm9ybXMuZW5kLngtdGhpcy51bmlmb3Jtcy5zdGFydC54LGk9dGhpcy51bmlmb3Jtcy5lbmQueS10aGlzLnVuaWZvcm1zLnN0YXJ0LnksZT1NYXRoLnNxcnQodCp0K2kqaSk7dGhpcy51bmlmb3Jtcy5kZWx0YS54PS1pL2UsdGhpcy51bmlmb3Jtcy5kZWx0YS55PXQvZX0saX0ocik7UElYSS5maWx0ZXJzLlRpbHRTaGlmdFlGaWx0ZXI9bzt2YXIgbD1mdW5jdGlvbih0KXtmdW5jdGlvbiBpKGksZSxyLGwpe3ZvaWQgMD09PWkmJihpPTEwMCksdm9pZCAwPT09ZSYmKGU9NjAwKSx2b2lkIDA9PT1yJiYocj1udWxsKSx2b2lkIDA9PT1sJiYobD1udWxsKSx0LmNhbGwodGhpcyksdGhpcy50aWx0U2hpZnRYRmlsdGVyPW5ldyBuKGksZSxyLGwpLHRoaXMudGlsdFNoaWZ0WUZpbHRlcj1uZXcgbyhpLGUscixsKX10JiYoaS5fX3Byb3RvX189dCksKGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1pO3ZhciBlPXtibHVyOntjb25maWd1cmFibGU6ITB9LGdyYWRpZW50Qmx1cjp7Y29uZmlndXJhYmxlOiEwfSxzdGFydDp7Y29uZmlndXJhYmxlOiEwfSxlbmQ6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbih0LGksZSl7dmFyIHI9dC5nZXRSZW5kZXJUYXJnZXQoITApO3RoaXMudGlsdFNoaWZ0WEZpbHRlci5hcHBseSh0LGksciksdGhpcy50aWx0U2hpZnRZRmlsdGVyLmFwcGx5KHQscixlKSx0LnJldHVyblJlbmRlclRhcmdldChyKX0sZS5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuYmx1cn0sZS5ibHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuYmx1cj10aGlzLnRpbHRTaGlmdFlGaWx0ZXIuYmx1cj10fSxlLmdyYWRpZW50Qmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aWx0U2hpZnRYRmlsdGVyLmdyYWRpZW50Qmx1cn0sZS5ncmFkaWVudEJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGlsdFNoaWZ0WEZpbHRlci5ncmFkaWVudEJsdXI9dGhpcy50aWx0U2hpZnRZRmlsdGVyLmdyYWRpZW50Qmx1cj10fSxlLnN0YXJ0LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuc3RhcnR9LGUuc3RhcnQuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGlsdFNoaWZ0WEZpbHRlci5zdGFydD10aGlzLnRpbHRTaGlmdFlGaWx0ZXIuc3RhcnQ9dH0sZS5lbmQuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGlsdFNoaWZ0WEZpbHRlci5lbmR9LGUuZW5kLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbHRTaGlmdFhGaWx0ZXIuZW5kPXRoaXMudGlsdFNoaWZ0WUZpbHRlci5lbmQ9dH0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaS5wcm90b3R5cGUsZSksaX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5UaWx0U2hpZnRGaWx0ZXI9bCx0LlRpbHRTaGlmdEZpbHRlcj1sLHQuVGlsdFNoaWZ0WEZpbHRlcj1uLHQuVGlsdFNoaWZ0WUZpbHRlcj1vLHQuVGlsdFNoaWZ0QXhpc0ZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItdGlsdC1zaGlmdC5qcy5tYXBcbiIsIi8qIVxuICogQHBpeGkvZmlsdGVyLXR3aXN0IC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci10d2lzdCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihvLG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP24oZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLG4pOm4oby5fX3BpeGlGaWx0ZXJzPXt9KX0odGhpcyxmdW5jdGlvbihvKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCByYWRpdXM7XFxudW5pZm9ybSBmbG9hdCBhbmdsZTtcXG51bmlmb3JtIHZlYzIgb2Zmc2V0O1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnZlYzIgbWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgKj0gZmlsdGVyQXJlYS54eTtcXG4gICAgY29vcmQgKz0gZmlsdGVyQXJlYS56dztcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHVubWFwQ29vcmQoIHZlYzIgY29vcmQgKVxcbntcXG4gICAgY29vcmQgLT0gZmlsdGVyQXJlYS56dztcXG4gICAgY29vcmQgLz0gZmlsdGVyQXJlYS54eTtcXG5cXG4gICAgcmV0dXJuIGNvb3JkO1xcbn1cXG5cXG52ZWMyIHR3aXN0KHZlYzIgY29vcmQpXFxue1xcbiAgICBjb29yZCAtPSBvZmZzZXQ7XFxuXFxuICAgIGZsb2F0IGRpc3QgPSBsZW5ndGgoY29vcmQpO1xcblxcbiAgICBpZiAoZGlzdCA8IHJhZGl1cylcXG4gICAge1xcbiAgICAgICAgZmxvYXQgcmF0aW9EaXN0ID0gKHJhZGl1cyAtIGRpc3QpIC8gcmFkaXVzO1xcbiAgICAgICAgZmxvYXQgYW5nbGVNb2QgPSByYXRpb0Rpc3QgKiByYXRpb0Rpc3QgKiBhbmdsZTtcXG4gICAgICAgIGZsb2F0IHMgPSBzaW4oYW5nbGVNb2QpO1xcbiAgICAgICAgZmxvYXQgYyA9IGNvcyhhbmdsZU1vZCk7XFxuICAgICAgICBjb29yZCA9IHZlYzIoY29vcmQueCAqIGMgLSBjb29yZC55ICogcywgY29vcmQueCAqIHMgKyBjb29yZC55ICogYyk7XFxuICAgIH1cXG5cXG4gICAgY29vcmQgKz0gb2Zmc2V0O1xcblxcbiAgICByZXR1cm4gY29vcmQ7XFxufVxcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG5cXG4gICAgdmVjMiBjb29yZCA9IG1hcENvb3JkKHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICBjb29yZCA9IHR3aXN0KGNvb3JkKTtcXG5cXG4gICAgY29vcmQgPSB1bm1hcENvb3JkKGNvb3JkKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCBjb29yZCApO1xcblxcbn1cXG5cIixlPWZ1bmN0aW9uKG8pe2Z1bmN0aW9uIGUoZSx0LGkpe3ZvaWQgMD09PWUmJihlPTIwMCksdm9pZCAwPT09dCYmKHQ9NCksdm9pZCAwPT09aSYmKGk9MjApLG8uY2FsbCh0aGlzLG4sciksdGhpcy5yYWRpdXM9ZSx0aGlzLmFuZ2xlPXQsdGhpcy5wYWRkaW5nPWl9byYmKGUuX19wcm90b19fPW8pLChlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG8mJm8ucHJvdG90eXBlKSkuY29uc3RydWN0b3I9ZTt2YXIgdD17b2Zmc2V0Ontjb25maWd1cmFibGU6ITB9LHJhZGl1czp7Y29uZmlndXJhYmxlOiEwfSxhbmdsZTp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIHQub2Zmc2V0LmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLm9mZnNldH0sdC5vZmZzZXQuc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMub2Zmc2V0PW99LHQucmFkaXVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnJhZGl1c30sdC5yYWRpdXMuc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMucmFkaXVzPW99LHQuYW5nbGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMuYW5nbGV9LHQuYW5nbGUuc2V0PWZ1bmN0aW9uKG8pe3RoaXMudW5pZm9ybXMuYW5nbGU9b30sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZS5wcm90b3R5cGUsdCksZX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Ud2lzdEZpbHRlcj1lLG8uVHdpc3RGaWx0ZXI9ZSxPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLXR3aXN0LmpzLm1hcFxuIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItem9vbS1ibHVyIC0gdjIuNC4wXG4gKiBDb21waWxlZCBNb24sIDE4IERlYyAyMDE3IDAwOjM2OjIzIFVUQ1xuICpcbiAqIEBwaXhpL2ZpbHRlci16b29tLWJsdXIgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24obixlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKG4uX19waXhpRmlsdGVycz17fSl9KHRoaXMsZnVuY3Rpb24obil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsdD1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gdmVjNCBmaWx0ZXJBcmVhO1xcblxcbnVuaWZvcm0gdmVjMiB1Q2VudGVyO1xcbnVuaWZvcm0gZmxvYXQgdVN0cmVuZ3RoO1xcbnVuaWZvcm0gZmxvYXQgdUlubmVyUmFkaXVzO1xcbnVuaWZvcm0gZmxvYXQgdVJhZGl1cztcXG5cXG5jb25zdCBmbG9hdCBNQVhfS0VSTkVMX1NJWkUgPSAzMi4wO1xcblxcbmZsb2F0IHJhbmRvbSh2ZWMzIHNjYWxlLCBmbG9hdCBzZWVkKSB7XFxuICAgIC8vIHVzZSB0aGUgZnJhZ21lbnQgcG9zaXRpb24gZm9yIGEgZGlmZmVyZW50IHNlZWQgcGVyLXBpeGVsXFxuICAgIHJldHVybiBmcmFjdChzaW4oZG90KGdsX0ZyYWdDb29yZC54eXogKyBzZWVkLCBzY2FsZSkpICogNDM3NTguNTQ1MyArIHNlZWQpO1xcbn1cXG5cXG52b2lkIG1haW4oKSB7XFxuXFxuICAgIGZsb2F0IG1pbkdyYWRpZW50ID0gdUlubmVyUmFkaXVzICogMC4zO1xcbiAgICBmbG9hdCBpbm5lclJhZGl1cyA9ICh1SW5uZXJSYWRpdXMgKyBtaW5HcmFkaWVudCAqIDAuNSkgLyBmaWx0ZXJBcmVhLng7XFxuXFxuICAgIGZsb2F0IGdyYWRpZW50ID0gdVJhZGl1cyAqIDAuMztcXG4gICAgZmxvYXQgcmFkaXVzID0gKHVSYWRpdXMgLSBncmFkaWVudCAqIDAuNSkgLyBmaWx0ZXJBcmVhLng7XFxuXFxuICAgIGZsb2F0IGNvdW50TGltaXQgPSBNQVhfS0VSTkVMX1NJWkU7XFxuXFxuICAgIHZlYzIgZGlyID0gdmVjMih1Q2VudGVyLnh5IC8gZmlsdGVyQXJlYS54eSAtIHZUZXh0dXJlQ29vcmQpO1xcbiAgICBmbG9hdCBkaXN0ID0gbGVuZ3RoKHZlYzIoZGlyLngsIGRpci55ICogZmlsdGVyQXJlYS55IC8gZmlsdGVyQXJlYS54KSk7XFxuXFxuICAgIGZsb2F0IHN0cmVuZ3RoID0gdVN0cmVuZ3RoO1xcblxcbiAgICBmbG9hdCBkZWx0YSA9IDAuMDtcXG4gICAgZmxvYXQgZ2FwO1xcbiAgICBpZiAoZGlzdCA8IGlubmVyUmFkaXVzKSB7XFxuICAgICAgICBkZWx0YSA9IGlubmVyUmFkaXVzIC0gZGlzdDtcXG4gICAgICAgIGdhcCA9IG1pbkdyYWRpZW50O1xcbiAgICB9IGVsc2UgaWYgKHJhZGl1cyA+PSAwLjAgJiYgZGlzdCA+IHJhZGl1cykgeyAvLyByYWRpdXMgPCAwIG1lYW5zIGl0J3MgaW5maW5pdHlcXG4gICAgICAgIGRlbHRhID0gZGlzdCAtIHJhZGl1cztcXG4gICAgICAgIGdhcCA9IGdyYWRpZW50O1xcbiAgICB9XFxuXFxuICAgIGlmIChkZWx0YSA+IDAuMCkge1xcbiAgICAgICAgZmxvYXQgbm9ybWFsQ291bnQgPSBnYXAgLyBmaWx0ZXJBcmVhLng7XFxuICAgICAgICBkZWx0YSA9IChub3JtYWxDb3VudCAtIGRlbHRhKSAvIG5vcm1hbENvdW50O1xcbiAgICAgICAgY291bnRMaW1pdCAqPSBkZWx0YTtcXG4gICAgICAgIHN0cmVuZ3RoICo9IGRlbHRhO1xcbiAgICAgICAgaWYgKGNvdW50TGltaXQgPCAxLjApXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgICAgICAgICByZXR1cm47XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgLy8gcmFuZG9taXplIHRoZSBsb29rdXAgdmFsdWVzIHRvIGhpZGUgdGhlIGZpeGVkIG51bWJlciBvZiBzYW1wbGVzXFxuICAgIGZsb2F0IG9mZnNldCA9IHJhbmRvbSh2ZWMzKDEyLjk4OTgsIDc4LjIzMywgMTUxLjcxODIpLCAwLjApO1xcblxcbiAgICBmbG9hdCB0b3RhbCA9IDAuMDtcXG4gICAgdmVjNCBjb2xvciA9IHZlYzQoMC4wKTtcXG5cXG4gICAgZGlyICo9IHN0cmVuZ3RoO1xcblxcbiAgICBmb3IgKGZsb2F0IHQgPSAwLjA7IHQgPCBNQVhfS0VSTkVMX1NJWkU7IHQrKykge1xcbiAgICAgICAgZmxvYXQgcGVyY2VudCA9ICh0ICsgb2Zmc2V0KSAvIE1BWF9LRVJORUxfU0laRTtcXG4gICAgICAgIGZsb2F0IHdlaWdodCA9IDQuMCAqIChwZXJjZW50IC0gcGVyY2VudCAqIHBlcmNlbnQpO1xcbiAgICAgICAgdmVjMiBwID0gdlRleHR1cmVDb29yZCArIGRpciAqIHBlcmNlbnQ7XFxuICAgICAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgcCk7XFxuXFxuICAgICAgICAvLyBzd2l0Y2ggdG8gcHJlLW11bHRpcGxpZWQgYWxwaGEgdG8gY29ycmVjdGx5IGJsdXIgdHJhbnNwYXJlbnQgaW1hZ2VzXFxuICAgICAgICAvLyBzYW1wbGUucmdiICo9IHNhbXBsZS5hO1xcblxcbiAgICAgICAgY29sb3IgKz0gc2FtcGxlICogd2VpZ2h0O1xcbiAgICAgICAgdG90YWwgKz0gd2VpZ2h0O1xcblxcbiAgICAgICAgaWYgKHQgPiBjb3VudExpbWl0KXtcXG4gICAgICAgICAgICBicmVhaztcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBjb2xvciAvIHRvdGFsO1xcblxcbiAgICAvLyBzd2l0Y2ggYmFjayBmcm9tIHByZS1tdWx0aXBsaWVkIGFscGhhXFxuICAgIGdsX0ZyYWdDb2xvci5yZ2IgLz0gZ2xfRnJhZ0NvbG9yLmEgKyAwLjAwMDAxO1xcblxcbn1cXG5cIixyPWZ1bmN0aW9uKG4pe2Z1bmN0aW9uIHIocixpLG8sYSl7dm9pZCAwPT09ciYmKHI9LjEpLHZvaWQgMD09PWkmJihpPVswLDBdKSx2b2lkIDA9PT1vJiYobz0wKSx2b2lkIDA9PT1hJiYoYT0tMSksbi5jYWxsKHRoaXMsZSx0KSx0aGlzLmNlbnRlcj1pLHRoaXMuc3RyZW5ndGg9cix0aGlzLmlubmVyUmFkaXVzPW8sdGhpcy5yYWRpdXM9YX1uJiYoci5fX3Byb3RvX189biksKHIucHJvdG90eXBlPU9iamVjdC5jcmVhdGUobiYmbi5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1yO3ZhciBpPXtjZW50ZXI6e2NvbmZpZ3VyYWJsZTohMH0sc3RyZW5ndGg6e2NvbmZpZ3VyYWJsZTohMH0saW5uZXJSYWRpdXM6e2NvbmZpZ3VyYWJsZTohMH0scmFkaXVzOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5jZW50ZXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudW5pZm9ybXMudUNlbnRlcn0saS5jZW50ZXIuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudUNlbnRlcj1ufSxpLnN0cmVuZ3RoLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVTdHJlbmd0aH0saS5zdHJlbmd0aC5zZXQ9ZnVuY3Rpb24obil7dGhpcy51bmlmb3Jtcy51U3RyZW5ndGg9bn0saS5pbm5lclJhZGl1cy5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51bmlmb3Jtcy51SW5uZXJSYWRpdXN9LGkuaW5uZXJSYWRpdXMuc2V0PWZ1bmN0aW9uKG4pe3RoaXMudW5pZm9ybXMudUlubmVyUmFkaXVzPW59LGkucmFkaXVzLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnVuaWZvcm1zLnVSYWRpdXN9LGkucmFkaXVzLnNldD1mdW5jdGlvbihuKXsobjwwfHxuPT09MS8wKSYmKG49LTEpLHRoaXMudW5pZm9ybXMudVJhZGl1cz1ufSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyLnByb3RvdHlwZSxpKSxyfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLlpvb21CbHVyRmlsdGVyPXIsbi5ab29tQmx1ckZpbHRlcj1yLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItem9vbS1ibHVyLmpzLm1hcFxuIiwiLyohXG4gKiBwaXhpLWZpbHRlcnMgLSB2Mi40LjBcbiAqIENvbXBpbGVkIE1vbiwgMTggRGVjIDIwMTcgMDA6MzY6MjMgVVRDXG4gKlxuICogcGl4aS1maWx0ZXJzIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGZpbHRlckFkdmFuY2VkQmxvb209cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1hZHZhbmNlZC1ibG9vbVwiKSxmaWx0ZXJBc2NpaT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWFzY2lpXCIpLGZpbHRlckJsb29tPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItYmxvb21cIiksZmlsdGVyQnVsZ2VQaW5jaD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWJ1bGdlLXBpbmNoXCIpLGZpbHRlckNvbG9yUmVwbGFjZT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWNvbG9yLXJlcGxhY2VcIiksZmlsdGVyQ29udm9sdXRpb249cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1jb252b2x1dGlvblwiKSxmaWx0ZXJDcm9zc0hhdGNoPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItY3Jvc3MtaGF0Y2hcIiksZmlsdGVyRG90PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItZG90XCIpLGZpbHRlckRyb3BTaGFkb3c9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1kcm9wLXNoYWRvd1wiKSxmaWx0ZXJFbWJvc3M9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1lbWJvc3NcIiksZmlsdGVyR2xvdz1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLWdsb3dcIiksZmlsdGVyR29kcmF5PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItZ29kcmF5XCIpLGZpbHRlck1vdGlvbkJsdXI9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1tb3Rpb24tYmx1clwiKSxmaWx0ZXJNdWx0aUNvbG9yUmVwbGFjZT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLW11bHRpLWNvbG9yLXJlcGxhY2VcIiksZmlsdGVyT2xkRmlsbT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLW9sZC1maWxtXCIpLGZpbHRlck91dGxpbmU9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1vdXRsaW5lXCIpLGZpbHRlclBpeGVsYXRlPXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItcGl4ZWxhdGVcIiksZmlsdGVyUmdiU3BsaXQ9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci1yZ2Itc3BsaXRcIiksZmlsdGVyUmFkaWFsQmx1cj1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXJhZGlhbC1ibHVyXCIpLGZpbHRlclNob2Nrd2F2ZT1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXNob2Nrd2F2ZVwiKSxmaWx0ZXJTaW1wbGVMaWdodG1hcD1yZXF1aXJlKFwiQHBpeGkvZmlsdGVyLXNpbXBsZS1saWdodG1hcFwiKSxmaWx0ZXJUaWx0U2hpZnQ9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci10aWx0LXNoaWZ0XCIpLGZpbHRlclR3aXN0PXJlcXVpcmUoXCJAcGl4aS9maWx0ZXItdHdpc3RcIiksZmlsdGVyWm9vbUJsdXI9cmVxdWlyZShcIkBwaXhpL2ZpbHRlci16b29tLWJsdXJcIik7ZXhwb3J0cy5BZHZhbmNlZEJsb29tRmlsdGVyPWZpbHRlckFkdmFuY2VkQmxvb20uQWR2YW5jZWRCbG9vbUZpbHRlcixleHBvcnRzLkFzY2lpRmlsdGVyPWZpbHRlckFzY2lpLkFzY2lpRmlsdGVyLGV4cG9ydHMuQmxvb21GaWx0ZXI9ZmlsdGVyQmxvb20uQmxvb21GaWx0ZXIsZXhwb3J0cy5CdWxnZVBpbmNoRmlsdGVyPWZpbHRlckJ1bGdlUGluY2guQnVsZ2VQaW5jaEZpbHRlcixleHBvcnRzLkNvbG9yUmVwbGFjZUZpbHRlcj1maWx0ZXJDb2xvclJlcGxhY2UuQ29sb3JSZXBsYWNlRmlsdGVyLGV4cG9ydHMuQ29udm9sdXRpb25GaWx0ZXI9ZmlsdGVyQ29udm9sdXRpb24uQ29udm9sdXRpb25GaWx0ZXIsZXhwb3J0cy5Dcm9zc0hhdGNoRmlsdGVyPWZpbHRlckNyb3NzSGF0Y2guQ3Jvc3NIYXRjaEZpbHRlcixleHBvcnRzLkRvdEZpbHRlcj1maWx0ZXJEb3QuRG90RmlsdGVyLGV4cG9ydHMuRHJvcFNoYWRvd0ZpbHRlcj1maWx0ZXJEcm9wU2hhZG93LkRyb3BTaGFkb3dGaWx0ZXIsZXhwb3J0cy5FbWJvc3NGaWx0ZXI9ZmlsdGVyRW1ib3NzLkVtYm9zc0ZpbHRlcixleHBvcnRzLkdsb3dGaWx0ZXI9ZmlsdGVyR2xvdy5HbG93RmlsdGVyLGV4cG9ydHMuR29kcmF5RmlsdGVyPWZpbHRlckdvZHJheS5Hb2RyYXlGaWx0ZXIsZXhwb3J0cy5Nb3Rpb25CbHVyRmlsdGVyPWZpbHRlck1vdGlvbkJsdXIuTW90aW9uQmx1ckZpbHRlcixleHBvcnRzLk11bHRpQ29sb3JSZXBsYWNlRmlsdGVyPWZpbHRlck11bHRpQ29sb3JSZXBsYWNlLk11bHRpQ29sb3JSZXBsYWNlRmlsdGVyLGV4cG9ydHMuT2xkRmlsbUZpbHRlcj1maWx0ZXJPbGRGaWxtLk9sZEZpbG1GaWx0ZXIsZXhwb3J0cy5PdXRsaW5lRmlsdGVyPWZpbHRlck91dGxpbmUuT3V0bGluZUZpbHRlcixleHBvcnRzLlBpeGVsYXRlRmlsdGVyPWZpbHRlclBpeGVsYXRlLlBpeGVsYXRlRmlsdGVyLGV4cG9ydHMuUkdCU3BsaXRGaWx0ZXI9ZmlsdGVyUmdiU3BsaXQuUkdCU3BsaXRGaWx0ZXIsZXhwb3J0cy5SYWRpYWxCbHVyRmlsdGVyPWZpbHRlclJhZGlhbEJsdXIuUmFkaWFsQmx1ckZpbHRlcixleHBvcnRzLlNob2Nrd2F2ZUZpbHRlcj1maWx0ZXJTaG9ja3dhdmUuU2hvY2t3YXZlRmlsdGVyLGV4cG9ydHMuU2ltcGxlTGlnaHRtYXBGaWx0ZXI9ZmlsdGVyU2ltcGxlTGlnaHRtYXAuU2ltcGxlTGlnaHRtYXBGaWx0ZXIsZXhwb3J0cy5UaWx0U2hpZnRGaWx0ZXI9ZmlsdGVyVGlsdFNoaWZ0LlRpbHRTaGlmdEZpbHRlcixleHBvcnRzLlRpbHRTaGlmdEF4aXNGaWx0ZXI9ZmlsdGVyVGlsdFNoaWZ0LlRpbHRTaGlmdEF4aXNGaWx0ZXIsZXhwb3J0cy5UaWx0U2hpZnRYRmlsdGVyPWZpbHRlclRpbHRTaGlmdC5UaWx0U2hpZnRYRmlsdGVyLGV4cG9ydHMuVGlsdFNoaWZ0WUZpbHRlcj1maWx0ZXJUaWx0U2hpZnQuVGlsdFNoaWZ0WUZpbHRlcixleHBvcnRzLlR3aXN0RmlsdGVyPWZpbHRlclR3aXN0LlR3aXN0RmlsdGVyLGV4cG9ydHMuWm9vbUJsdXJGaWx0ZXI9ZmlsdGVyWm9vbUJsdXIuWm9vbUJsdXJGaWx0ZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLWZpbHRlcnMuanMubWFwXG4iLCJ2YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHV0aWxzO1xyXG4gICAgKGZ1bmN0aW9uICh1dGlscykge1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUluZGljZXNGb3JRdWFkcyhzaXplKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbEluZGljZXMgPSBzaXplICogNjtcclxuICAgICAgICAgICAgdmFyIGluZGljZXMgPSBuZXcgVWludDE2QXJyYXkodG90YWxJbmRpY2VzKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgdG90YWxJbmRpY2VzOyBpICs9IDYsIGogKz0gNCkge1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgMF0gPSBqICsgMDtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDFdID0gaiArIDE7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAyXSA9IGogKyAyO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgM10gPSBqICsgMDtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDRdID0gaiArIDI7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyA1XSA9IGogKyAzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2VzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5jcmVhdGVJbmRpY2VzRm9yUXVhZHMgPSBjcmVhdGVJbmRpY2VzRm9yUXVhZHM7XHJcbiAgICAgICAgZnVuY3Rpb24gaXNQb3cyKHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuICEodiAmICh2IC0gMSkpICYmICghIXYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5pc1BvdzIgPSBpc1BvdzI7XHJcbiAgICAgICAgZnVuY3Rpb24gbmV4dFBvdzIodikge1xyXG4gICAgICAgICAgICB2ICs9ICsodiA9PT0gMCk7XHJcbiAgICAgICAgICAgIC0tdjtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiAxO1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDI7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gNDtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiA4O1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDE2O1xyXG4gICAgICAgICAgICByZXR1cm4gdiArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLm5leHRQb3cyID0gbmV4dFBvdzI7XHJcbiAgICAgICAgZnVuY3Rpb24gbG9nMih2KSB7XHJcbiAgICAgICAgICAgIHZhciByLCBzaGlmdDtcclxuICAgICAgICAgICAgciA9ICsodiA+IDB4RkZGRikgPDwgNDtcclxuICAgICAgICAgICAgdiA+Pj49IHI7XHJcbiAgICAgICAgICAgIHNoaWZ0ID0gKyh2ID4gMHhGRikgPDwgMztcclxuICAgICAgICAgICAgdiA+Pj49IHNoaWZ0O1xyXG4gICAgICAgICAgICByIHw9IHNoaWZ0O1xyXG4gICAgICAgICAgICBzaGlmdCA9ICsodiA+IDB4RikgPDwgMjtcclxuICAgICAgICAgICAgdiA+Pj49IHNoaWZ0O1xyXG4gICAgICAgICAgICByIHw9IHNoaWZ0O1xyXG4gICAgICAgICAgICBzaGlmdCA9ICsodiA+IDB4MykgPDwgMTtcclxuICAgICAgICAgICAgdiA+Pj49IHNoaWZ0O1xyXG4gICAgICAgICAgICByIHw9IHNoaWZ0O1xyXG4gICAgICAgICAgICByZXR1cm4gciB8ICh2ID4+IDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5sb2cyID0gbG9nMjtcclxuICAgICAgICBmdW5jdGlvbiBnZXRJbnRlcnNlY3Rpb25GYWN0b3IocDEsIHAyLCBwMywgcDQsIG91dCkge1xyXG4gICAgICAgICAgICB2YXIgQTEgPSBwMi54IC0gcDEueCwgQjEgPSBwMy54IC0gcDQueCwgQzEgPSBwMy54IC0gcDEueDtcclxuICAgICAgICAgICAgdmFyIEEyID0gcDIueSAtIHAxLnksIEIyID0gcDMueSAtIHA0LnksIEMyID0gcDMueSAtIHAxLnk7XHJcbiAgICAgICAgICAgIHZhciBEID0gQTEgKiBCMiAtIEEyICogQjE7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhEKSA8IDFlLTcpIHtcclxuICAgICAgICAgICAgICAgIG91dC54ID0gQTE7XHJcbiAgICAgICAgICAgICAgICBvdXQueSA9IEEyO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIFQgPSBDMSAqIEIyIC0gQzIgKiBCMTtcclxuICAgICAgICAgICAgdmFyIFUgPSBBMSAqIEMyIC0gQTIgKiBDMTtcclxuICAgICAgICAgICAgdmFyIHQgPSBUIC8gRCwgdSA9IFUgLyBEO1xyXG4gICAgICAgICAgICBpZiAodSA8ICgxZS02KSB8fCB1IC0gMSA+IC0xZS02KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0LnggPSBwMS54ICsgdCAqIChwMi54IC0gcDEueCk7XHJcbiAgICAgICAgICAgIG91dC55ID0gcDEueSArIHQgKiAocDIueSAtIHAxLnkpO1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuZ2V0SW50ZXJzZWN0aW9uRmFjdG9yID0gZ2V0SW50ZXJzZWN0aW9uRmFjdG9yO1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBvc2l0aW9uRnJvbVF1YWQocCwgYW5jaG9yLCBvdXQpIHtcclxuICAgICAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhMSA9IDEuMCAtIGFuY2hvci54LCBhMiA9IDEuMCAtIGExO1xyXG4gICAgICAgICAgICB2YXIgYjEgPSAxLjAgLSBhbmNob3IueSwgYjIgPSAxLjAgLSBiMTtcclxuICAgICAgICAgICAgb3V0LnggPSAocFswXS54ICogYTEgKyBwWzFdLnggKiBhMikgKiBiMSArIChwWzNdLnggKiBhMSArIHBbMl0ueCAqIGEyKSAqIGIyO1xyXG4gICAgICAgICAgICBvdXQueSA9IChwWzBdLnkgKiBhMSArIHBbMV0ueSAqIGEyKSAqIGIxICsgKHBbM10ueSAqIGExICsgcFsyXS55ICogYTIpICogYjI7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmdldFBvc2l0aW9uRnJvbVF1YWQgPSBnZXRQb3NpdGlvbkZyb21RdWFkO1xyXG4gICAgfSkodXRpbHMgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMgfHwgKHBpeGlfcHJvamVjdGlvbi51dGlscyA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxuUElYSS5wcm9qZWN0aW9uID0gcGl4aV9wcm9qZWN0aW9uO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFByb2plY3Rpb24gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb24obGVnYWN5LCBlbmFibGUpIHtcclxuICAgICAgICAgICAgaWYgKGVuYWJsZSA9PT0gdm9pZCAwKSB7IGVuYWJsZSA9IHRydWU7IH1cclxuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmxlZ2FjeSA9IGxlZ2FjeTtcclxuICAgICAgICAgICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmxlZ2FjeS5wcm9qID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb24ucHJvdG90eXBlLCBcImVuYWJsZWRcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBQcm9qZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uID0gUHJvamVjdGlvbjtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHdlYmdsO1xyXG4gICAgKGZ1bmN0aW9uICh3ZWJnbCkge1xyXG4gICAgICAgIHZhciBCYXRjaEJ1ZmZlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEJhdGNoQnVmZmVyKHNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXMgPSBuZXcgQXJyYXlCdWZmZXIoc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb2F0MzJWaWV3ID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnZlcnRpY2VzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheSh0aGlzLnZlcnRpY2VzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBCYXRjaEJ1ZmZlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXMgPSBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gQmF0Y2hCdWZmZXI7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICB3ZWJnbC5CYXRjaEJ1ZmZlciA9IEJhdGNoQnVmZmVyO1xyXG4gICAgfSkod2ViZ2wgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wgfHwgKHBpeGlfcHJvamVjdGlvbi53ZWJnbCA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB3ZWJnbDtcclxuICAgIChmdW5jdGlvbiAod2ViZ2wpIHtcclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlcih2ZXJ0ZXhTcmMsIGZyYWdtZW50U3JjLCBnbCwgbWF4VGV4dHVyZXMpIHtcclxuICAgICAgICAgICAgZnJhZ21lbnRTcmMgPSBmcmFnbWVudFNyYy5yZXBsYWNlKC8lY291bnQlL2dpLCBtYXhUZXh0dXJlcyArICcnKTtcclxuICAgICAgICAgICAgZnJhZ21lbnRTcmMgPSBmcmFnbWVudFNyYy5yZXBsYWNlKC8lZm9ybG9vcCUvZ2ksIGdlbmVyYXRlU2FtcGxlU3JjKG1heFRleHR1cmVzKSk7XHJcbiAgICAgICAgICAgIHZhciBzaGFkZXIgPSBuZXcgUElYSS5TaGFkZXIoZ2wsIHZlcnRleFNyYywgZnJhZ21lbnRTcmMpO1xyXG4gICAgICAgICAgICB2YXIgc2FtcGxlVmFsdWVzID0gbmV3IEludDMyQXJyYXkobWF4VGV4dHVyZXMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heFRleHR1cmVzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHNhbXBsZVZhbHVlc1tpXSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2hhZGVyLmJpbmQoKTtcclxuICAgICAgICAgICAgc2hhZGVyLnVuaWZvcm1zLnVTYW1wbGVycyA9IHNhbXBsZVZhbHVlcztcclxuICAgICAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2ViZ2wuZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXIgPSBnZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlcjtcclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVNhbXBsZVNyYyhtYXhUZXh0dXJlcykge1xyXG4gICAgICAgICAgICB2YXIgc3JjID0gJyc7XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heFRleHR1cmVzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYyArPSAnXFxuZWxzZSAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCBtYXhUZXh0dXJlcyAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzcmMgKz0gXCJpZih0ZXh0dXJlSWQgPT0gXCIgKyBpICsgXCIuMClcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNyYyArPSAnXFxueyc7XHJcbiAgICAgICAgICAgICAgICBzcmMgKz0gXCJcXG5cXHRjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlcnNbXCIgKyBpICsgXCJdLCB0ZXh0dXJlQ29vcmQpO1wiO1xyXG4gICAgICAgICAgICAgICAgc3JjICs9ICdcXG59JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgcmV0dXJuIHNyYztcclxuICAgICAgICB9XHJcbiAgICB9KSh3ZWJnbCA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbCB8fCAocGl4aV9wcm9qZWN0aW9uLndlYmdsID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB3ZWJnbDtcclxuICAgIChmdW5jdGlvbiAod2ViZ2wpIHtcclxuICAgICAgICB2YXIgT2JqZWN0UmVuZGVyZXIgPSBQSVhJLk9iamVjdFJlbmRlcmVyO1xyXG4gICAgICAgIHZhciBzZXR0aW5ncyA9IFBJWEkuc2V0dGluZ3M7XHJcbiAgICAgICAgdmFyIEdMQnVmZmVyID0gUElYSS5nbENvcmUuR0xCdWZmZXI7XHJcbiAgICAgICAgdmFyIHByZW11bHRpcGx5VGludCA9IFBJWEkudXRpbHMucHJlbXVsdGlwbHlUaW50O1xyXG4gICAgICAgIHZhciBwcmVtdWx0aXBseUJsZW5kTW9kZSA9IFBJWEkudXRpbHMucHJlbXVsdGlwbHlCbGVuZE1vZGU7XHJcbiAgICAgICAgdmFyIFRJQ0sgPSAwO1xyXG4gICAgICAgIHZhciBCYXRjaEdyb3VwID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gQmF0Y2hHcm91cCgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWRzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNpemUgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsZW5kID0gUElYSS5CTEVORF9NT0RFUy5OT1JNQUw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmF0Y2hHcm91cDtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIHdlYmdsLkJhdGNoR3JvdXAgPSBCYXRjaEdyb3VwO1xyXG4gICAgICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgIF9fZXh0ZW5kcyhNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIocmVuZGVyZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHJlbmRlcmVyKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMID0gMzI7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0U2l6ZSA9IDU7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0Qnl0ZVNpemUgPSBfdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zaXplID0gc2V0dGluZ3MuU1BSSVRFX0JBVENIX1NJWkU7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc3ByaXRlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydGV4QnVmZmVycyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFvcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFvTWF4ID0gMjtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFUyA9IDE7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5pbmRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLmNyZWF0ZUluZGljZXNGb3JRdWFkcyhfdGhpcy5zaXplKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBfdGhpcy5zaXplOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5ncm91cHNba10gPSBuZXcgQmF0Y2hHcm91cCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFvTWF4ID0gMjtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJlbmRlcmVyLm9uKCdwcmVyZW5kZXInLCBfdGhpcy5vblByZXJlbmRlciwgX3RoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5nZXRVbmlmb3JtcyA9IGZ1bmN0aW9uIChzcHIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuc3luY1VuaWZvcm1zID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvYmopXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNoID0gdGhpcy5zaGFkZXI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2gudW5pZm9ybXNba2V5XSA9IG9ialtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUub25Db250ZXh0Q2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuTUFYX1RFWFRVUkVTID0gTWF0aC5taW4odGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwsIHRoaXMucmVuZGVyZXIucGx1Z2luc1snc3ByaXRlJ10uTUFYX1RFWFRVUkVTKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyID0gd2ViZ2wuZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXIodGhpcy5zaGFkZXJWZXJ0LCB0aGlzLnNoYWRlckZyYWcsIGdsLCB0aGlzLk1BWF9URVhUVVJFUyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gR0xCdWZmZXIuY3JlYXRlSW5kZXhCdWZmZXIoZ2wsIHRoaXMuaW5kaWNlcywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVmFvKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52YW9NYXg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLnZlcnRleEJ1ZmZlcnNbaV0gPSBHTEJ1ZmZlci5jcmVhdGVWZXJ0ZXhCdWZmZXIoZ2wsIG51bGwsIGdsLlNUUkVBTV9EUkFXKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb3NbaV0gPSB0aGlzLmNyZWF0ZVZhbyh2ZXJ0ZXhCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJ1ZmZlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBwaXhpX3Byb2plY3Rpb24udXRpbHMubmV4dFBvdzIodGhpcy5zaXplKTsgaSAqPSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVycy5wdXNoKG5ldyB3ZWJnbC5CYXRjaEJ1ZmZlcihpICogNCAqIHRoaXMudmVydEJ5dGVTaXplKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52YW8gPSB0aGlzLnZhb3NbMF07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5vblByZXJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID49IHRoaXMuc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmx1c2goKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghc3ByaXRlLl90ZXh0dXJlLl91dnMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNwcml0ZS5fdGV4dHVyZS5iYXNlVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlc1t0aGlzLmN1cnJlbnRJbmRleCsrXSA9IHNwcml0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLmZsdXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgICAgIHZhciBNQVhfVEVYVFVSRVMgPSB0aGlzLk1BWF9URVhUVVJFUztcclxuICAgICAgICAgICAgICAgIHZhciBucDIgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMubmV4dFBvdzIodGhpcy5jdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvZzIgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMubG9nMihucDIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyc1tsb2cyXTtcclxuICAgICAgICAgICAgICAgIHZhciBzcHJpdGVzID0gdGhpcy5zcHJpdGVzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZsb2F0MzJWaWV3ID0gYnVmZmVyLmZsb2F0MzJWaWV3O1xyXG4gICAgICAgICAgICAgICAgdmFyIHVpbnQzMlZpZXcgPSBidWZmZXIudWludDMyVmlldztcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciBncm91cENvdW50ID0gMTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRHcm91cCA9IGdyb3Vwc1swXTtcclxuICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICAgICAgdmFyIHV2cztcclxuICAgICAgICAgICAgICAgIHZhciBibGVuZE1vZGUgPSBwcmVtdWx0aXBseUJsZW5kTW9kZVtzcHJpdGVzWzBdLl90ZXh0dXJlLmJhc2VUZXh0dXJlLnByZW11bHRpcGxpZWRBbHBoYSA/IDEgOiAwXVtzcHJpdGVzWzBdLmJsZW5kTW9kZV07XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuYmxlbmQgPSBibGVuZE1vZGU7XHJcbiAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnRJbmRleDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwcml0ZSA9IHNwcml0ZXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFRleHR1cmUgPSBzcHJpdGUuX3RleHR1cmUuYmFzZVRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwcml0ZUJsZW5kTW9kZSA9IHByZW11bHRpcGx5QmxlbmRNb2RlW051bWJlcihuZXh0VGV4dHVyZS5wcmVtdWx0aXBsaWVkQWxwaGEpXVtzcHJpdGUuYmxlbmRNb2RlXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxlbmRNb2RlICE9PSBzcHJpdGVCbGVuZE1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxlbmRNb2RlID0gc3ByaXRlQmxlbmRNb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCA9IE1BWF9URVhUVVJFUztcclxuICAgICAgICAgICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdW5pZm9ybXMgPSB0aGlzLmdldFVuaWZvcm1zKHNwcml0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRVbmlmb3JtcyAhPT0gdW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVuaWZvcm1zID0gdW5pZm9ybXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50ID0gTUFYX1RFWFRVUkVTO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGV4dHVyZSAhPT0gbmV4dFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHR1cmUgPSBuZXh0VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRUZXh0dXJlLl9lbmFibGVkICE9PSBUSUNLKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dHVyZUNvdW50ID09PSBNQVhfVEVYVFVSRVMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc2l6ZSA9IGkgLSBjdXJyZW50R3JvdXAuc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwID0gZ3JvdXBzW2dyb3VwQ291bnQrK107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmJsZW5kID0gYmxlbmRNb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zdGFydCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnVuaWZvcm1zID0gY3VycmVudFVuaWZvcm1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFRleHR1cmUuX2VuYWJsZWQgPSBUSUNLO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFRleHR1cmUuX3ZpcnRhbEJvdW5kSWQgPSB0ZXh0dXJlQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudGV4dHVyZXNbY3VycmVudEdyb3VwLnRleHR1cmVDb3VudCsrXSA9IG5leHRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFscGhhID0gTWF0aC5taW4oc3ByaXRlLndvcmxkQWxwaGEsIDEuMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ2IgPSBhbHBoYSA8IDEuMCAmJiBuZXh0VGV4dHVyZS5wcmVtdWx0aXBsaWVkQWxwaGEgPyBwcmVtdWx0aXBseVRpbnQoc3ByaXRlLl90aW50UkdCLCBhbHBoYSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBzcHJpdGUuX3RpbnRSR0IgKyAoYWxwaGEgKiAyNTUgPDwgMjQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbFZlcnRpY2VzKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCBuZXh0VGV4dHVyZS5fdmlydGFsQm91bmRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggKz0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc2l6ZSA9IGkgLSBjdXJyZW50R3JvdXAuc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNldHRpbmdzLkNBTl9VUExPQURfU0FNRV9CVUZGRVIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YW9NYXggPD0gdGhpcy52ZXJ0ZXhDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb01heCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmVydGV4QnVmZmVyID0gdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdID0gR0xCdWZmZXIuY3JlYXRlVmVydGV4QnVmZmVyKGdsLCBudWxsLCBnbC5TVFJFQU1fRFJBVyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFvc1t0aGlzLnZlcnRleENvdW50XSA9IHRoaXMuY3JlYXRlVmFvKHZlcnRleEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFZhbyh0aGlzLnZhb3NbdGhpcy52ZXJ0ZXhDb3VudF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XS51cGxvYWQoYnVmZmVyLnZlcnRpY2VzLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdLnVwbG9hZChidWZmZXIudmVydGljZXMsIDAsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudFVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBncm91cENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBncm91cHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwVGV4dHVyZUNvdW50ID0gZ3JvdXAudGV4dHVyZUNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cC51bmlmb3JtcyAhPT0gY3VycmVudFVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3luY1VuaWZvcm1zKGdyb3VwLnVuaWZvcm1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBncm91cFRleHR1cmVDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFRleHR1cmUoZ3JvdXAudGV4dHVyZXNbal0sIGosIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cC50ZXh0dXJlc1tqXS5fdmlydGFsQm91bmRJZCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zLnNhbXBsZXJTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdlswXSA9IGdyb3VwLnRleHR1cmVzW2pdLnJlYWxXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZbMV0gPSBncm91cC50ZXh0dXJlc1tqXS5yZWFsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIudW5pZm9ybXMuc2FtcGxlclNpemUgPSB2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc3RhdGUuc2V0QmxlbmRNb2RlKGdyb3VwLmJsZW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kcmF3RWxlbWVudHMoZ2wuVFJJQU5HTEVTLCBncm91cC5zaXplICogNiwgZ2wuVU5TSUdORURfU0hPUlQsIGdyb3VwLnN0YXJ0ICogNiAqIDIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRTaGFkZXIodGhpcy5zaGFkZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNBTl9VUExPQURfU0FNRV9CVUZGRVIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRWYW8odGhpcy52YW9zW3RoaXMudmVydGV4Q291bnRdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0uYmluZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmx1c2goKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmFvTWF4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0ZXhCdWZmZXJzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhb3NbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9zW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5vZmYoJ3ByZXJlbmRlcicsIHRoaXMub25QcmVyZW5kZXIsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zaGFkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYWRlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFvcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kaWNlcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1ZmZlcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcnNbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICAgICAgfShPYmplY3RSZW5kZXJlcikpO1xyXG4gICAgICAgIHdlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB9KSh3ZWJnbCA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbCB8fCAocGl4aV9wcm9qZWN0aW9uLndlYmdsID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHAgPSBbbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKV07XHJcbiAgICB2YXIgYSA9IFswLCAwLCAwLCAwXTtcclxuICAgIHZhciBTdXJmYWNlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBTdXJmYWNlKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cmZhY2VJRCA9IFwiZGVmYXVsdFwiO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVJRCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4U3JjID0gXCJcIjtcclxuICAgICAgICAgICAgdGhpcy5mcmFnbWVudFNyYyA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFN1cmZhY2UucHJvdG90eXBlLmZpbGxVbmlmb3JtcyA9IGZ1bmN0aW9uICh1bmlmb3Jtcykge1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdXJmYWNlLnByb3RvdHlwZS5ib3VuZHNRdWFkID0gZnVuY3Rpb24gKHYsIG91dCwgYWZ0ZXIpIHtcclxuICAgICAgICAgICAgdmFyIG1pblggPSBvdXRbMF0sIG1pblkgPSBvdXRbMV07XHJcbiAgICAgICAgICAgIHZhciBtYXhYID0gb3V0WzBdLCBtYXhZID0gb3V0WzFdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMjsgaSA8IDg7IGkgKz0gMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pblggPiBvdXRbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWluWCA9IG91dFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXhYIDwgb3V0W2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIG1heFggPSBvdXRbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAobWluWSA+IG91dFtpICsgMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWluWSA9IG91dFtpICsgMV07XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4WSA8IG91dFtpICsgMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4WSA9IG91dFtpICsgMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcFswXS5zZXQobWluWCwgbWluWSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFswXSwgcFswXSk7XHJcbiAgICAgICAgICAgIHBbMV0uc2V0KG1heFgsIG1pblkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbMV0sIHBbMV0pO1xyXG4gICAgICAgICAgICBwWzJdLnNldChtYXhYLCBtYXhZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzJdLCBwWzJdKTtcclxuICAgICAgICAgICAgcFszXS5zZXQobWluWCwgbWF4WSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFszXSwgcFszXSk7XHJcbiAgICAgICAgICAgIGlmIChhZnRlcikge1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFswXSwgcFswXSk7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzFdLCBwWzFdKTtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbMl0sIHBbMl0pO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFszXSwgcFszXSk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMF0gPSBwWzBdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbMV0gPSBwWzBdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMl0gPSBwWzFdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbM10gPSBwWzFdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNF0gPSBwWzJdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbNV0gPSBwWzJdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNl0gPSBwWzNdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbN10gPSBwWzNdLnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocFtpXS55IDwgcFswXS55IHx8IHBbaV0ueSA9PSBwWzBdLnkgJiYgcFtpXS54IDwgcFswXS54KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gcFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcFswXSA9IHBbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBbaV0gPSB0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFbaV0gPSBNYXRoLmF0YW4yKHBbaV0ueSAtIHBbMF0ueSwgcFtpXS54IC0gcFswXS54KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBpICsgMTsgaiA8PSAzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFbaV0gPiBhW2pdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IHBbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwW2ldID0gcFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBbal0gPSB0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQyID0gYVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFbaV0gPSBhW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYVtqXSA9IHQyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3V0WzBdID0gcFswXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzFdID0gcFswXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzJdID0gcFsxXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzNdID0gcFsxXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzRdID0gcFsyXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzVdID0gcFsyXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzZdID0gcFszXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzddID0gcFszXS55O1xyXG4gICAgICAgICAgICAgICAgaWYgKChwWzNdLnggLSBwWzJdLngpICogKHBbMV0ueSAtIHBbMl0ueSkgLSAocFsxXS54IC0gcFsyXS54KSAqIChwWzNdLnkgLSBwWzJdLnkpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dFs0XSA9IHBbM10ueDtcclxuICAgICAgICAgICAgICAgICAgICBvdXRbNV0gPSBwWzNdLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3VyZmFjZTtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3VyZmFjZSA9IFN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICB2YXIgdGVtcFJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoKTtcclxuICAgIHZhciB0ZW1wUG9pbnQgPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgdmFyIEJpbGluZWFyU3VyZmFjZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKEJpbGluZWFyU3VyZmFjZSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBCaWxpbmVhclN1cmZhY2UoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLmRpc3RvcnRpb24gPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzdG9ydGlvbi5zZXQoMCwgMCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgZCA9IHRoaXMuZGlzdG9ydGlvbjtcclxuICAgICAgICAgICAgdmFyIG0gPSBwb3MueCAqIHBvcy55O1xyXG4gICAgICAgICAgICBuZXdQb3MueCA9IHBvcy54ICsgZC54ICogbTtcclxuICAgICAgICAgICAgbmV3UG9zLnkgPSBwb3MueSArIGQueSAqIG07XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIHZ4ID0gcG9zLngsIHZ5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBkeCA9IHRoaXMuZGlzdG9ydGlvbi54LCBkeSA9IHRoaXMuZGlzdG9ydGlvbi55O1xyXG4gICAgICAgICAgICBpZiAoZHggPT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHZ4O1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2eSAvICgxLjAgKyBkeSAqIHZ4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkeSA9PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdnk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHZ4IC8gKDEuMCArIGR4ICogdnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSAodnkgKiBkeCAtIHZ4ICogZHkgKyAxLjApICogMC41IC8gZHk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IGIgKiBiICsgdnggLyBkeTtcclxuICAgICAgICAgICAgICAgIGlmIChkIDw9IDAuMDAwMDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQb3Muc2V0KE5hTiwgTmFOKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZHkgPiAwLjApIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQb3MueCA9IC1iICsgTWF0aC5zcXJ0KGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnggPSAtYiAtIE1hdGguc3FydChkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gKHZ4IC8gbmV3UG9zLnggLSAxLjApIC8gZHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUubWFwU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGVtcFJlY3QueCA9IC1zcHJpdGUuYW5jaG9yLnggKiB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QueSA9IC1zcHJpdGUuYW5jaG9yLnkgKiB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LndpZHRoID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LmhlaWdodCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwUXVhZCh0ZW1wUmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtIHx8IHNwcml0ZS50cmFuc2Zvcm0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5tYXBRdWFkID0gZnVuY3Rpb24gKHJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgYXggPSAtcmVjdC54IC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gLXJlY3QueSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXgyID0gKDEuMCAtIHJlY3QueCkgLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkyID0gKDEuMCAtIHJlY3QueSkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIHVwMXggPSAocXVhZFswXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMXkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMnggPSAocXVhZFswXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXggPSAocXVhZFszXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsyXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheDIpICsgcXVhZFsyXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB4MDAgPSB1cDF4ICogKDEuMCAtIGF5KSArIGRvd24xeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTAwID0gdXAxeSAqICgxLjAgLSBheSkgKyBkb3duMXkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgxMCA9IHVwMnggKiAoMS4wIC0gYXkpICsgZG93bjJ4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MTAgPSB1cDJ5ICogKDEuMCAtIGF5KSArIGRvd24yeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDAxID0gdXAxeCAqICgxLjAgLSBheTIpICsgZG93bjF4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTAxID0gdXAxeSAqICgxLjAgLSBheTIpICsgZG93bjF5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeDExID0gdXAyeCAqICgxLjAgLSBheTIpICsgZG93bjJ4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTExID0gdXAyeSAqICgxLjAgLSBheTIpICsgZG93bjJ5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgbWF0ID0gdGVtcE1hdDtcclxuICAgICAgICAgICAgbWF0LnR4ID0geDAwO1xyXG4gICAgICAgICAgICBtYXQudHkgPSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5hID0geDEwIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuYiA9IHkxMCAtIHkwMDtcclxuICAgICAgICAgICAgbWF0LmMgPSB4MDEgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5kID0geTAxIC0geTAwO1xyXG4gICAgICAgICAgICB0ZW1wUG9pbnQuc2V0KHgxMSwgeTExKTtcclxuICAgICAgICAgICAgbWF0LmFwcGx5SW52ZXJzZSh0ZW1wUG9pbnQsIHRlbXBQb2ludCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzdG9ydGlvbi5zZXQodGVtcFBvaW50LnggLSAxLCB0ZW1wUG9pbnQueSAtIDEpO1xyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2V0RnJvbU1hdHJpeChtYXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuZmlsbFVuaWZvcm1zID0gZnVuY3Rpb24gKHVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb24gPSB1bmlmb3Jtcy5kaXN0b3J0aW9uIHx8IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDAsIDAsIDBdKTtcclxuICAgICAgICAgICAgdmFyIGF4ID0gTWF0aC5hYnModGhpcy5kaXN0b3J0aW9uLngpO1xyXG4gICAgICAgICAgICB2YXIgYXkgPSBNYXRoLmFicyh0aGlzLmRpc3RvcnRpb24ueSk7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bMF0gPSBheCAqIDEwMDAwIDw9IGF5ID8gMCA6IHRoaXMuZGlzdG9ydGlvbi54O1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzFdID0gYXkgKiAxMDAwMCA8PSBheCA/IDAgOiB0aGlzLmRpc3RvcnRpb24ueTtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblsyXSA9IDEuMCAvIHVuaWZvcm1zLmRpc3RvcnRpb25bMF07XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bM10gPSAxLjAgLyB1bmlmb3Jtcy5kaXN0b3J0aW9uWzFdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIEJpbGluZWFyU3VyZmFjZTtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlN1cmZhY2UpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5CaWxpbmVhclN1cmZhY2UgPSBCaWxpbmVhclN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBDb250YWluZXIycyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKENvbnRhaW5lcjJzLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIENvbnRhaW5lcjJzKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZShfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb250YWluZXIycy5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBDb250YWluZXIycztcclxuICAgIH0oUElYSS5Db250YWluZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Db250YWluZXIycyA9IENvbnRhaW5lcjJzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgZnVuID0gUElYSS5UcmFuc2Zvcm1TdGF0aWMucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybTtcclxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUhhY2socGFyZW50VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmFyIHByb2ogPSB0aGlzLnByb2o7XHJcbiAgICAgICAgdmFyIHBwID0gcGFyZW50VHJhbnNmb3JtLnByb2o7XHJcbiAgICAgICAgdmFyIHRhID0gdGhpcztcclxuICAgICAgICBpZiAoIXBwKSB7XHJcbiAgICAgICAgICAgIGZ1bi5jYWxsKHRoaXMsIHBhcmVudFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHByb2ouX2FjdGl2ZVByb2plY3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwcC5fc3VyZmFjZSkge1xyXG4gICAgICAgICAgICBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uID0gcHA7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTG9jYWxUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhbFRyYW5zZm9ybS5jb3B5KHRoaXMud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBpZiAodGEuX3BhcmVudElEIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgKyt0YS5fd29ybGRJRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bi5jYWxsKHRoaXMsIHBhcmVudFRyYW5zZm9ybSk7XHJcbiAgICAgICAgcHJvai5fYWN0aXZlUHJvamVjdGlvbiA9IHBwLl9hY3RpdmVQcm9qZWN0aW9uO1xyXG4gICAgfVxyXG4gICAgdmFyIFByb2plY3Rpb25TdXJmYWNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoUHJvamVjdGlvblN1cmZhY2UsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvblN1cmZhY2UobGVnYWN5LCBlbmFibGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbGVnYWN5LCBlbmFibGUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLl9zdXJmYWNlID0gbnVsbDtcclxuICAgICAgICAgICAgX3RoaXMuX2FjdGl2ZVByb2plY3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICBfdGhpcy5fY3VycmVudFN1cmZhY2VJRCA9IC0xO1xyXG4gICAgICAgICAgICBfdGhpcy5fY3VycmVudExlZ2FjeUlEID0gLTE7XHJcbiAgICAgICAgICAgIF90aGlzLl9sYXN0VW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUsIFwiZW5hYmxlZFwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuX2VuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1IYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gUElYSS5UcmFuc2Zvcm1TdGF0aWMucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZSwgXCJzdXJmYWNlXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3VyZmFjZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlID09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3VyZmFjZSA9IHZhbHVlIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmFwcGx5UGFydGlhbCA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN1cmZhY2UuYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLnN1cmZhY2UuYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24uX3N1cmZhY2UuYXBwbHlJbnZlcnNlKG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1cmZhY2UuYXBwbHlJbnZlcnNlKG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKHBvcywgbmV3UG9zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5tYXBCaWxpbmVhclNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQpIHtcclxuICAgICAgICAgICAgaWYgKCEodGhpcy5fc3VyZmFjZSBpbnN0YW5jZW9mIHBpeGlfcHJvamVjdGlvbi5CaWxpbmVhclN1cmZhY2UpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cmZhY2UgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLkJpbGluZWFyU3VyZmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VyZmFjZS5tYXBTcHJpdGUoc3ByaXRlLCBxdWFkLCB0aGlzLmxlZ2FjeSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cmZhY2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VyZmFjZS5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLCBcInVuaWZvcm1zXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudExlZ2FjeUlEID09PSB0aGlzLmxlZ2FjeS5fd29ybGRJRCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTdXJmYWNlSUQgPT09IHRoaXMuc3VyZmFjZS5fdXBkYXRlSUQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGFzdFVuaWZvcm1zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFVuaWZvcm1zID0gdGhpcy5fbGFzdFVuaWZvcm1zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFVuaWZvcm1zLndvcmxkVHJhbnNmb3JtID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0udG9BcnJheSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1cmZhY2UuZmlsbFVuaWZvcm1zKHRoaXMuX2xhc3RVbmlmb3Jtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGFzdFVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvblN1cmZhY2U7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UgPSBQcm9qZWN0aW9uU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgdmFyIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGVCaWxpbmVhclJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5zaXplID0gMTAwO1xyXG4gICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwgPSAxO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczE7XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMjtcXG5hdHRyaWJ1dGUgdmVjNCBhRnJhbWU7XFxuYXR0cmlidXRlIHZlYzQgYUNvbG9yO1xcbmF0dHJpYnV0ZSBmbG9hdCBhVGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB3b3JsZFRyYW5zZm9ybTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIHdvcmxkVHJhbnNmb3JtICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuICAgIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVZlcnRleFBvc2l0aW9uO1xcbiAgICB2VHJhbnMxID0gYVRyYW5zMTtcXG4gICAgdlRyYW5zMiA9IGFUcmFuczI7XFxuICAgIHZUZXh0dXJlSWQgPSBhVGV4dHVyZUlkO1xcbiAgICB2Q29sb3IgPSBhQ29sb3I7XFxuICAgIHZGcmFtZSA9IGFGcmFtZTtcXG59XFxuXCI7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyc1slY291bnQlXTtcXG51bmlmb3JtIHZlYzIgc2FtcGxlclNpemVbJWNvdW50JV07IFxcbnVuaWZvcm0gdmVjNCBkaXN0b3J0aW9uO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG52ZWMyIHN1cmZhY2U7XFxudmVjMiBzdXJmYWNlMjtcXG5cXG5mbG9hdCB2eCA9IHZUZXh0dXJlQ29vcmQueDtcXG5mbG9hdCB2eSA9IHZUZXh0dXJlQ29vcmQueTtcXG5mbG9hdCBkeCA9IGRpc3RvcnRpb24ueDtcXG5mbG9hdCBkeSA9IGRpc3RvcnRpb24ueTtcXG5mbG9hdCByZXZ4ID0gZGlzdG9ydGlvbi56O1xcbmZsb2F0IHJldnkgPSBkaXN0b3J0aW9uLnc7XFxuXFxuaWYgKGRpc3RvcnRpb24ueCA9PSAwLjApIHtcXG4gICAgc3VyZmFjZS54ID0gdng7XFxuICAgIHN1cmZhY2UueSA9IHZ5IC8gKDEuMCArIGR5ICogdngpO1xcbiAgICBzdXJmYWNlMiA9IHN1cmZhY2U7XFxufSBlbHNlXFxuaWYgKGRpc3RvcnRpb24ueSA9PSAwLjApIHtcXG4gICAgc3VyZmFjZS55ID0gdnk7XFxuICAgIHN1cmZhY2UueCA9IHZ4LyAoMS4wICsgZHggKiB2eSk7XFxuICAgIHN1cmZhY2UyID0gc3VyZmFjZTtcXG59IGVsc2Uge1xcbiAgICBmbG9hdCBjID0gdnkgKiBkeCAtIHZ4ICogZHk7XFxuICAgIGZsb2F0IGIgPSAoYyArIDEuMCkgKiAwLjU7XFxuICAgIGZsb2F0IGIyID0gKC1jICsgMS4wKSAqIDAuNTtcXG4gICAgZmxvYXQgZCA9IGIgKiBiICsgdnggKiBkeTtcXG4gICAgaWYgKGQgPCAtMC4wMDAwMSkge1xcbiAgICAgICAgZGlzY2FyZDtcXG4gICAgfVxcbiAgICBkID0gc3FydChtYXgoZCwgMC4wKSk7XFxuICAgIHN1cmZhY2UueCA9ICgtIGIgKyBkKSAqIHJldnk7XFxuICAgIHN1cmZhY2UyLnggPSAoLSBiIC0gZCkgKiByZXZ5O1xcbiAgICBzdXJmYWNlLnkgPSAoLSBiMiArIGQpICogcmV2eDtcXG4gICAgc3VyZmFjZTIueSA9ICgtIGIyIC0gZCkgKiByZXZ4O1xcbn1cXG5cXG52ZWMyIHV2O1xcbnV2LnggPSB2VHJhbnMxLnggKiBzdXJmYWNlLnggKyB2VHJhbnMxLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMxLno7XFxudXYueSA9IHZUcmFuczIueCAqIHN1cmZhY2UueCArIHZUcmFuczIueSAqIHN1cmZhY2UueSArIHZUcmFuczIuejtcXG5cXG52ZWMyIHBpeGVscyA9IHV2ICogc2FtcGxlclNpemVbMF07XFxuXFxuaWYgKHBpeGVscy54IDwgdkZyYW1lLnggfHwgcGl4ZWxzLnggPiB2RnJhbWUueiB8fFxcbiAgICBwaXhlbHMueSA8IHZGcmFtZS55IHx8IHBpeGVscy55ID4gdkZyYW1lLncpIHtcXG4gICAgdXYueCA9IHZUcmFuczEueCAqIHN1cmZhY2UyLnggKyB2VHJhbnMxLnkgKiBzdXJmYWNlMi55ICsgdlRyYW5zMS56O1xcbiAgICB1di55ID0gdlRyYW5zMi54ICogc3VyZmFjZTIueCArIHZUcmFuczIueSAqIHN1cmZhY2UyLnkgKyB2VHJhbnMyLno7XFxuICAgIHBpeGVscyA9IHV2ICogc2FtcGxlclNpemVbMF07XFxuICAgIFxcbiAgICBpZiAocGl4ZWxzLnggPCB2RnJhbWUueCB8fCBwaXhlbHMueCA+IHZGcmFtZS56IHx8XFxuICAgICAgICBwaXhlbHMueSA8IHZGcmFtZS55IHx8IHBpeGVscy55ID4gdkZyYW1lLncpIHtcXG4gICAgICAgIGRpc2NhcmQ7XFxuICAgIH1cXG59XFxuXFxudmVjNCBlZGdlO1xcbmVkZ2UueHkgPSBjbGFtcChwaXhlbHMgLSB2RnJhbWUueHkgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuZWRnZS56dyA9IGNsYW1wKHZGcmFtZS56dyAtIHBpeGVscyArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5cXG5mbG9hdCBhbHBoYSA9IDEuMDsgLy9lZGdlLnggKiBlZGdlLnkgKiBlZGdlLnogKiBlZGdlLnc7XFxudmVjNCByQ29sb3IgPSB2Q29sb3IgKiBhbHBoYTtcXG5cXG5mbG9hdCB0ZXh0dXJlSWQgPSBmbG9vcih2VGV4dHVyZUlkKzAuNSk7XFxudmVjNCBjb2xvcjtcXG52ZWMyIHRleHR1cmVDb29yZCA9IHV2O1xcbiVmb3Jsb29wJVxcbmdsX0ZyYWdDb2xvciA9IGNvbG9yICogckNvbG9yO1xcbn1cIjtcclxuICAgICAgICAgICAgX3RoaXMuZGVmVW5pZm9ybXMgPSB7XHJcbiAgICAgICAgICAgICAgICB3b3JsZFRyYW5zZm9ybTogbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV0pLFxyXG4gICAgICAgICAgICAgICAgZGlzdG9ydGlvbjogbmV3IEZsb2F0MzJBcnJheShbMCwgMF0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlQmlsaW5lYXJSZW5kZXJlci5wcm90b3R5cGUuZ2V0VW5pZm9ybXMgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9qID0gc3ByaXRlLnByb2o7XHJcbiAgICAgICAgICAgIHZhciBzaGFkZXIgPSB0aGlzLnNoYWRlcjtcclxuICAgICAgICAgICAgaWYgKHByb2ouc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2oudW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb2ouX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZlVuaWZvcm1zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlQmlsaW5lYXJSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlVmFvID0gZnVuY3Rpb24gKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRTaXplID0gMTQ7XHJcbiAgICAgICAgICAgIHRoaXMudmVydEJ5dGVTaXplID0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHZhciB2YW8gPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZVZhbygpXHJcbiAgICAgICAgICAgICAgICAuYWRkSW5kZXgodGhpcy5pbmRleEJ1ZmZlcilcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDApXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMiAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNSAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUZyYW1lLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA4ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hQ29sb3IsIGdsLlVOU0lHTkVEX0JZVEUsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCAxMiAqIDQpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cnMuYVRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICAgICAgdmFvLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlSWQsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEzICogNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIucHJvdG90eXBlLmZpbGxWZXJ0aWNlcyA9IGZ1bmN0aW9uIChmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgdGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gc3ByaXRlLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB3ID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXggPSBzcHJpdGUuX2FuY2hvci5feDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gc3ByaXRlLl9hbmNob3IuX3k7XHJcbiAgICAgICAgICAgIHZhciBmcmFtZSA9IHRleC5fZnJhbWU7XHJcbiAgICAgICAgICAgIHZhciBhVHJhbnMgPSBzcHJpdGUuYVRyYW5zO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVtpICogMl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVtpICogMiArIDFdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IGFUcmFucy5hO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAzXSA9IGFUcmFucy5jO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA0XSA9IGFUcmFucy50eDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNV0gPSBhVHJhbnMuYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSBhVHJhbnMuZDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSBhVHJhbnMudHk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gZnJhbWUueDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOV0gPSBmcmFtZS55O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMF0gPSBmcmFtZS54ICsgZnJhbWUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDExXSA9IGZyYW1lLnkgKyBmcmFtZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMTJdID0gYXJnYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdGV4dHVyZUlkO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGVCaWxpbmVhclJlbmRlcmVyO1xyXG4gICAgfShNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcikpO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdzcHJpdGVfYmlsaW5lYXInLCBTcHJpdGVCaWxpbmVhclJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgdmFyIFNwcml0ZVN0cmFuZ2VSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZVN0cmFuZ2VSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGVTdHJhbmdlUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5zaXplID0gMTAwO1xyXG4gICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwgPSAxO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczE7XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMjtcXG5hdHRyaWJ1dGUgdmVjNCBhRnJhbWU7XFxuYXR0cmlidXRlIHZlYzQgYUNvbG9yO1xcbmF0dHJpYnV0ZSBmbG9hdCBhVGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB3b3JsZFRyYW5zZm9ybTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIHdvcmxkVHJhbnNmb3JtICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuICAgIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVZlcnRleFBvc2l0aW9uO1xcbiAgICB2VHJhbnMxID0gYVRyYW5zMTtcXG4gICAgdlRyYW5zMiA9IGFUcmFuczI7XFxuICAgIHZUZXh0dXJlSWQgPSBhVGV4dHVyZUlkO1xcbiAgICB2Q29sb3IgPSBhQ29sb3I7XFxuICAgIHZGcmFtZSA9IGFGcmFtZTtcXG59XFxuXCI7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyc1slY291bnQlXTtcXG51bmlmb3JtIHZlYzIgc2FtcGxlclNpemVbJWNvdW50JV07IFxcbnVuaWZvcm0gdmVjNCBwYXJhbXM7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbnZlYzIgc3VyZmFjZTtcXG5cXG5mbG9hdCB2eCA9IHZUZXh0dXJlQ29vcmQueDtcXG5mbG9hdCB2eSA9IHZUZXh0dXJlQ29vcmQueTtcXG5mbG9hdCBhbGVwaCA9IHBhcmFtcy54O1xcbmZsb2F0IGJldCA9IHBhcmFtcy55O1xcbmZsb2F0IEEgPSBwYXJhbXMuejtcXG5mbG9hdCBCID0gcGFyYW1zLnc7XFxuXFxuaWYgKGFsZXBoID09IDAuMCkge1xcblxcdHN1cmZhY2UueSA9IHZ5IC8gKDEuMCArIHZ4ICogYmV0KTtcXG5cXHRzdXJmYWNlLnggPSB2eDtcXG59XFxuZWxzZSBpZiAoYmV0ID09IDAuMCkge1xcblxcdHN1cmZhY2UueCA9IHZ4IC8gKDEuMCArIHZ5ICogYWxlcGgpO1xcblxcdHN1cmZhY2UueSA9IHZ5O1xcbn0gZWxzZSB7XFxuXFx0c3VyZmFjZS54ID0gdnggKiAoYmV0ICsgMS4wKSAvIChiZXQgKyAxLjAgKyB2eSAqIGFsZXBoKTtcXG5cXHRzdXJmYWNlLnkgPSB2eSAqIChhbGVwaCArIDEuMCkgLyAoYWxlcGggKyAxLjAgKyB2eCAqIGJldCk7XFxufVxcblxcbnZlYzIgdXY7XFxudXYueCA9IHZUcmFuczEueCAqIHN1cmZhY2UueCArIHZUcmFuczEueSAqIHN1cmZhY2UueSArIHZUcmFuczEuejtcXG51di55ID0gdlRyYW5zMi54ICogc3VyZmFjZS54ICsgdlRyYW5zMi55ICogc3VyZmFjZS55ICsgdlRyYW5zMi56O1xcblxcbnZlYzIgcGl4ZWxzID0gdXYgKiBzYW1wbGVyU2l6ZVswXTtcXG5cXG52ZWM0IGVkZ2U7XFxuZWRnZS54eSA9IGNsYW1wKHBpeGVscyAtIHZGcmFtZS54eSArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5lZGdlLnp3ID0gY2xhbXAodkZyYW1lLnp3IC0gcGl4ZWxzICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcblxcbmZsb2F0IGFscGhhID0gZWRnZS54ICogZWRnZS55ICogZWRnZS56ICogZWRnZS53O1xcbnZlYzQgckNvbG9yID0gdkNvbG9yICogYWxwaGE7XFxuXFxuZmxvYXQgdGV4dHVyZUlkID0gZmxvb3IodlRleHR1cmVJZCswLjUpO1xcbnZlYzQgY29sb3I7XFxudmVjMiB0ZXh0dXJlQ29vcmQgPSB1djtcXG4lZm9ybG9vcCVcXG5nbF9GcmFnQ29sb3IgPSBjb2xvciAqIHJDb2xvcjtcXG59XCI7XHJcbiAgICAgICAgICAgIF90aGlzLmRlZlVuaWZvcm1zID0ge1xyXG4gICAgICAgICAgICAgICAgd29ybGRUcmFuc2Zvcm06IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdKSxcclxuICAgICAgICAgICAgICAgIGRpc3RvcnRpb246IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDBdKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZVN0cmFuZ2VSZW5kZXJlci5wcm90b3R5cGUuZ2V0VW5pZm9ybXMgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9qID0gc3ByaXRlLnByb2o7XHJcbiAgICAgICAgICAgIHZhciBzaGFkZXIgPSB0aGlzLnNoYWRlcjtcclxuICAgICAgICAgICAgaWYgKHByb2ouc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2oudW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb2ouX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZlVuaWZvcm1zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlU3RyYW5nZVJlbmRlcmVyLnByb3RvdHlwZS5jcmVhdGVWYW8gPSBmdW5jdGlvbiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudmVydFNpemUgPSAxNDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0Qnl0ZVNpemUgPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdmFyIHZhbyA9IHRoaXMucmVuZGVyZXIuY3JlYXRlVmFvKClcclxuICAgICAgICAgICAgICAgIC5hZGRJbmRleCh0aGlzLmluZGV4QnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFWZXJ0ZXhQb3NpdGlvbiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMxLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAyICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMyLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA1ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hRnJhbWUsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDggKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFDb2xvciwgZ2wuVU5TSUdORURfQllURSwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEyICogNCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5hVGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YW8uYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVJZCwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTMgKiA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFvO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlU3RyYW5nZVJlbmRlcmVyLnByb3RvdHlwZS5maWxsVmVydGljZXMgPSBmdW5jdGlvbiAoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIHRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHNwcml0ZS52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdyA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4ID0gc3ByaXRlLl9hbmNob3IuX3g7XHJcbiAgICAgICAgICAgIHZhciBheSA9IHNwcml0ZS5fYW5jaG9yLl95O1xyXG4gICAgICAgICAgICB2YXIgZnJhbWUgPSB0ZXguX2ZyYW1lO1xyXG4gICAgICAgICAgICB2YXIgYVRyYW5zID0gc3ByaXRlLmFUcmFucztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbaSAqIDJdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbaSAqIDIgKyAxXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSBhVHJhbnMuYTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgM10gPSBhVHJhbnMuYztcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNF0gPSBhVHJhbnMudHg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDVdID0gYVRyYW5zLmI7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gYVRyYW5zLmQ7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gYVRyYW5zLnR5O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IGZyYW1lLng7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDldID0gZnJhbWUueTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTBdID0gZnJhbWUueCArIGZyYW1lLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMV0gPSBmcmFtZS55ICsgZnJhbWUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDEyXSA9IGFyZ2I7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHRleHR1cmVJZDtcclxuICAgICAgICAgICAgICAgIGluZGV4ICs9IDE0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlU3RyYW5nZVJlbmRlcmVyO1xyXG4gICAgfShNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcikpO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdzcHJpdGVfc3RyYW5nZScsIFNwcml0ZVN0cmFuZ2VSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICB2YXIgdGVtcFJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoKTtcclxuICAgIHZhciB0ZW1wUG9pbnQgPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgdmFyIFN0cmFuZ2VTdXJmYWNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3RyYW5nZVN1cmZhY2UsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3RyYW5nZVN1cmZhY2UoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnBhcmFtcyA9IFswLCAwLCBOYU4sIE5hTl07XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBwWzBdID0gMDtcclxuICAgICAgICAgICAgcFsxXSA9IDA7XHJcbiAgICAgICAgICAgIHBbMl0gPSBOYU47XHJcbiAgICAgICAgICAgIHBbM10gPSBOYU47XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuc2V0QXhpc1ggPSBmdW5jdGlvbiAocG9zLCBmYWN0b3IsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54LCB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgcm90ID0gb3V0VHJhbnNmb3JtLnJvdGF0aW9uO1xyXG4gICAgICAgICAgICBpZiAocm90ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feCAtPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feSArPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0ucm90YXRpb24gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3LnkgPSBNYXRoLmF0YW4yKHksIHgpO1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwWzJdID0gLWQgKiBmYWN0b3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwWzJdID0gTmFOO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGMwMSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLnNldEF4aXNZID0gZnVuY3Rpb24gKHBvcywgZmFjdG9yLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueCwgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIHJvdCA9IG91dFRyYW5zZm9ybS5yb3RhdGlvbjtcclxuICAgICAgICAgICAgaWYgKHJvdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3ggLT0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3kgKz0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnJvdGF0aW9uID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy54ID0gLU1hdGguYXRhbjIoeSwgeCkgKyBNYXRoLlBJIC8gMjtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgaWYgKGZhY3RvciAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcFszXSA9IC1kICogZmFjdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcFszXSA9IE5hTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jYWxjMDEoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5fY2FsYzAxID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4ocFsyXSkpIHtcclxuICAgICAgICAgICAgICAgIHBbMV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKHBbM10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gMS4wIC8gcFszXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihwWzNdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMV0gPSAxLjAgLyBwWzJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSAxLjAgLSBwWzJdICogcFszXTtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gKDEuMCAtIHBbMl0pIC8gZDtcclxuICAgICAgICAgICAgICAgICAgICBwWzFdID0gKDEuMCAtIHBbM10pIC8gZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYWxlcGggPSB0aGlzLnBhcmFtc1swXSwgYmV0ID0gdGhpcy5wYXJhbXNbMV0sIEEgPSB0aGlzLnBhcmFtc1syXSwgQiA9IHRoaXMucGFyYW1zWzNdO1xyXG4gICAgICAgICAgICB2YXIgdSA9IHBvcy54LCB2ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIGlmIChhbGVwaCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHYgKiAoMSArIHUgKiBiZXQpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGJldCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHUgKiAoMSArIHYgKiBhbGVwaCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgRCA9IEEgKiBCIC0gdiAqIHU7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IEEgKiB1ICogKEIgKyB2KSAvIEQ7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IEIgKiB2ICogKEEgKyB1KSAvIEQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhbGVwaCA9IHRoaXMucGFyYW1zWzBdLCBiZXQgPSB0aGlzLnBhcmFtc1sxXSwgQSA9IHRoaXMucGFyYW1zWzJdLCBCID0gdGhpcy5wYXJhbXNbM107XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLngsIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgaWYgKGFsZXBoID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0geSAvICgxICsgeCAqIGJldCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYmV0ID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0geCAqICgxICsgeSAqIGFsZXBoKTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0geTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0geCAqIChiZXQgKyAxKSAvIChiZXQgKyAxICsgeSAqIGFsZXBoKTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0geSAqIChhbGVwaCArIDEpIC8gKGFsZXBoICsgMSArIHggKiBiZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUubWFwU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGVtcFJlY3QueCA9IC1zcHJpdGUuYW5jaG9yLnggKiB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QueSA9IC1zcHJpdGUuYW5jaG9yLnkgKiB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LndpZHRoID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LmhlaWdodCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwUXVhZCh0ZW1wUmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtIHx8IHNwcml0ZS50cmFuc2Zvcm0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLm1hcFF1YWQgPSBmdW5jdGlvbiAocmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciBheCA9IC1yZWN0LnggLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkgPSAtcmVjdC55IC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheDIgPSAoMS4wIC0gcmVjdC54KSAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheTIgPSAoMS4wIC0gcmVjdC55KSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgdXAxeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsxXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAxeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsxXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB1cDJ5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheDIpICsgcXVhZFsxXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsyXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnggPSAocXVhZFszXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheDIpICsgcXVhZFsyXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHgwMCA9IHVwMXggKiAoMS4wIC0gYXkpICsgZG93bjF4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MDAgPSB1cDF5ICogKDEuMCAtIGF5KSArIGRvd24xeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDEwID0gdXAyeCAqICgxLjAgLSBheSkgKyBkb3duMnggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkxMCA9IHVwMnkgKiAoMS4wIC0gYXkpICsgZG93bjJ5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MDEgPSB1cDF4ICogKDEuMCAtIGF5MikgKyBkb3duMXggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MDEgPSB1cDF5ICogKDEuMCAtIGF5MikgKyBkb3duMXkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB4MTEgPSB1cDJ4ICogKDEuMCAtIGF5MikgKyBkb3duMnggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MTEgPSB1cDJ5ICogKDEuMCAtIGF5MikgKyBkb3duMnkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciBtYXQgPSB0ZW1wTWF0O1xyXG4gICAgICAgICAgICBtYXQudHggPSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC50eSA9IHkwMDtcclxuICAgICAgICAgICAgbWF0LmEgPSB4MTAgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5iID0geTEwIC0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYyA9IHgwMSAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmQgPSB5MDEgLSB5MDA7XHJcbiAgICAgICAgICAgIHRlbXBQb2ludC5zZXQoeDExLCB5MTEpO1xyXG4gICAgICAgICAgICBtYXQuYXBwbHlJbnZlcnNlKHRlbXBQb2ludCwgdGVtcFBvaW50KTtcclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNldEZyb21NYXRyaXgobWF0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuZmlsbFVuaWZvcm1zID0gZnVuY3Rpb24gKHVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgdmFyIGRpc3RvcnRpb24gPSB1bmlmb3Jtcy5wYXJhbXMgfHwgbmV3IEZsb2F0MzJBcnJheShbMCwgMCwgMCwgMF0pO1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5wYXJhbXMgPSBkaXN0b3J0aW9uO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzBdID0gcGFyYW1zWzBdO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzFdID0gcGFyYW1zWzFdO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzJdID0gcGFyYW1zWzJdO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzNdID0gcGFyYW1zWzNdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFN0cmFuZ2VTdXJmYWNlO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uU3VyZmFjZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlN0cmFuZ2VTdXJmYWNlID0gU3RyYW5nZVN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIFBJWEkuU3ByaXRlLnByb3RvdHlwZS5jb252ZXJ0VG8ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZV9iaWxpbmVhcic7XHJcbiAgICAgICAgdGhpcy5hVHJhbnMgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxuICAgICAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFRvMnMuY2FsbCh0aGlzKTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFRvMnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRTdWJ0cmVlVG8ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNvbnZlcnRUbzJzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29udmVydFN1YnRyZWVUbzJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFNwcml0ZTJzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlMnMsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlMnModGV4dHVyZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0dXJlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5hVHJhbnMgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGVfYmlsaW5lYXInO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZTJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcygpO1xyXG4gICAgICAgICAgICB0aGlzLl9ib3VuZHMuYWRkUXVhZCh0aGlzLnZlcnRleFRyaW1tZWREYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNmb3JtSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1JRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUlEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRyaW0gPSB0ZXh0dXJlLnRyaW07XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAwO1xyXG4gICAgICAgICAgICBpZiAodHJpbSkge1xyXG4gICAgICAgICAgICAgICAgdzEgPSB0cmltLnggLSAoYW5jaG9yLl94ICogb3JpZy53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgdHJpbS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gdHJpbS55IC0gKGFuY2hvci5feSAqIG9yaWcuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyB0cmltLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX3N1cmZhY2UpIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSBoMDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSBoMDtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvai5fc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IHd0LmE7XHJcbiAgICAgICAgICAgICAgICB2YXIgYiA9IHd0LmI7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHd0LmM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHd0LmQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHggPSB3dC50eDtcclxuICAgICAgICAgICAgICAgIHZhciB0eSA9IHd0LnR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IChhICogdzEpICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSAoZCAqIGgxKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gKGEgKiB3MCkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IChkICogaDEpICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSAoYSAqIHcwKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gKGQgKiBoMCkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IChhICogdzEpICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSAoZCAqIGgwKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRleHR1cmUudHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlLnRyYW5zZm9ybSA9IG5ldyBQSVhJLmV4dHJhcy5UZXh0dXJlVHJhbnNmb3JtKHRleHR1cmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRleHR1cmUudHJhbnNmb3JtLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgYVRyYW5zID0gdGhpcy5hVHJhbnM7XHJcbiAgICAgICAgICAgIGFUcmFucy5zZXQob3JpZy53aWR0aCwgMCwgMCwgb3JpZy5oZWlnaHQsIHcxLCBoMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX3N1cmZhY2UgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFUcmFucy5wcmVwZW5kKHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhVHJhbnMuaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgIGFUcmFucy5wcmVwZW5kKHRleHR1cmUudHJhbnNmb3JtLm1hcENvb3JkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZlcnRleFRyaW1tZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleFRyaW1tZWREYXRhID0gbmV3IEZsb2F0MzJBcnJheSg4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4VHJpbW1lZERhdGE7XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX3N1cmZhY2UpIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSBoMDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSBoMDtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvai5fc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEsIHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB3dCA9IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSB3dC5hO1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSB3dC5iO1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSB3dC5jO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSB3dC5kO1xyXG4gICAgICAgICAgICAgICAgdmFyIHR4ID0gd3QudHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHkgPSB3dC50eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSAoYSAqIHcxKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gKGQgKiBoMSkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IChhICogdzApICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSAoZCAqIGgxKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gKGEgKiB3MCkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IChkICogaDApICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSAoYSAqIHcxKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gKGQgKiBoMCkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSwgdGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uLmxlZ2FjeS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTcHJpdGUycy5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBTcHJpdGUycztcclxuICAgIH0oUElYSS5TcHJpdGUpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycyA9IFNwcml0ZTJzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgVGV4dDJzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoVGV4dDJzLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFRleHQycyh0ZXh0LCBzdHlsZSwgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHQsIHN0eWxlLCBjYW52YXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLmFUcmFucyA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZShfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZV9iaWxpbmVhcic7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRleHQycy5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBUZXh0MnM7XHJcbiAgICB9KFBJWEkuVGV4dCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlRleHQycyA9IFRleHQycztcclxuICAgIFRleHQycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgVGV4dDJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgIFRleHQycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgZnVuY3Rpb24gY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgfVxyXG4gICAgcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0gPSBjb250YWluZXIyZFdvcmxkVHJhbnNmb3JtO1xyXG4gICAgdmFyIENvbnRhaW5lcjJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQ29udGFpbmVyMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gQ29udGFpbmVyMmQoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb250YWluZXIyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBDb250YWluZXIyZDtcclxuICAgIH0oUElYSS5Db250YWluZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Db250YWluZXIyZCA9IENvbnRhaW5lcjJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgUG9pbnQgPSBQSVhJLlBvaW50O1xyXG4gICAgdmFyIG1hdDNpZCA9IFsxLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAxXTtcclxuICAgIHZhciBBRkZJTkU7XHJcbiAgICAoZnVuY3Rpb24gKEFGRklORSkge1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJOT05FXCJdID0gMF0gPSBcIk5PTkVcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiRlJFRVwiXSA9IDFdID0gXCJGUkVFXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIkFYSVNfWFwiXSA9IDJdID0gXCJBWElTX1hcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiQVhJU19ZXCJdID0gM10gPSBcIkFYSVNfWVwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJQT0lOVFwiXSA9IDRdID0gXCJQT0lOVFwiO1xyXG4gICAgfSkoQUZGSU5FID0gcGl4aV9wcm9qZWN0aW9uLkFGRklORSB8fCAocGl4aV9wcm9qZWN0aW9uLkFGRklORSA9IHt9KSk7XHJcbiAgICB2YXIgTWF0cml4MmQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIE1hdHJpeDJkKGJhY2tpbmdBcnJheSkge1xyXG4gICAgICAgICAgICB0aGlzLmZsb2F0QXJyYXkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLm1hdDMgPSBuZXcgRmxvYXQ2NEFycmF5KGJhY2tpbmdBcnJheSB8fCBtYXQzaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImFcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbMF07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbMF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJiXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzFdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzFdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiY1wiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1szXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1szXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImRcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbNF07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbNF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJ0eFwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1s2XTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1s2XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcInR5XCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzddO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzddID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgdHgsIHR5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gYTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IGI7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gYztcclxuICAgICAgICAgICAgbWF0M1s0XSA9IGQ7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gdHg7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSB0eTtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAodHJhbnNwb3NlLCBvdXQpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZsb2F0QXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXRBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoOSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gb3V0IHx8IHRoaXMuZmxvYXRBcnJheTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIGlmICh0cmFuc3Bvc2UpIHtcclxuICAgICAgICAgICAgICAgIGFycmF5WzBdID0gbWF0M1swXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzFdID0gbWF0M1sxXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzJdID0gbWF0M1syXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzNdID0gbWF0M1szXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzRdID0gbWF0M1s0XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzVdID0gbWF0M1s1XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzZdID0gbWF0M1s2XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzddID0gbWF0M1s3XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzhdID0gbWF0M1s4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFycmF5WzBdID0gbWF0M1swXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzFdID0gbWF0M1szXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzJdID0gbWF0M1s2XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzNdID0gbWF0M1sxXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzRdID0gbWF0M1s0XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzVdID0gbWF0M1s3XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzZdID0gbWF0M1syXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzddID0gbWF0M1s1XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzhdID0gbWF0M1s4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54O1xyXG4gICAgICAgICAgICB2YXIgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgeiA9IDEuMCAvIChtYXQzWzJdICogeCArIG1hdDNbNV0gKiB5ICsgbWF0M1s4XSk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy54ID0geiAqIChtYXQzWzBdICogeCArIG1hdDNbM10gKiB5ICsgbWF0M1s2XSk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy55ID0geiAqIChtYXQzWzFdICogeCArIG1hdDNbNF0gKiB5ICsgbWF0M1s3XSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKHR4LCB0eSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSArPSB0eCAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbMV0gKz0gdHkgKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzNdICs9IHR4ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s0XSArPSB0eSAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNl0gKz0gdHggKiBtYXQzWzhdO1xyXG4gICAgICAgICAgICBtYXQzWzddICs9IHR5ICogbWF0M1s4XTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSAqPSB4O1xyXG4gICAgICAgICAgICBtYXQzWzFdICo9IHk7XHJcbiAgICAgICAgICAgIG1hdDNbM10gKj0geDtcclxuICAgICAgICAgICAgbWF0M1s0XSAqPSB5O1xyXG4gICAgICAgICAgICBtYXQzWzZdICo9IHg7XHJcbiAgICAgICAgICAgIG1hdDNbN10gKj0geTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2NhbGVBbmRUcmFuc2xhdGUgPSBmdW5jdGlvbiAoc2NhbGVYLCBzY2FsZVksIHR4LCB0eSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHNjYWxlWCAqIG1hdDNbMF0gKyB0eCAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBzY2FsZVkgKiBtYXQzWzFdICsgdHkgKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gc2NhbGVYICogbWF0M1szXSArIHR4ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHNjYWxlWSAqIG1hdDNbNF0gKyB0eSAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSBzY2FsZVggKiBtYXQzWzZdICsgdHggKiBtYXQzWzhdO1xyXG4gICAgICAgICAgICBtYXQzWzddID0gc2NhbGVZICogbWF0M1s3XSArIHR5ICogbWF0M1s4XTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueDtcclxuICAgICAgICAgICAgdmFyIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbM10sIGEwMiA9IGFbNl0sIGExMCA9IGFbMV0sIGExMSA9IGFbNF0sIGExMiA9IGFbN10sIGEyMCA9IGFbMl0sIGEyMSA9IGFbNV0sIGEyMiA9IGFbOF07XHJcbiAgICAgICAgICAgIHZhciBuZXdYID0gKGEyMiAqIGExMSAtIGExMiAqIGEyMSkgKiB4ICsgKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogeSArIChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpO1xyXG4gICAgICAgICAgICB2YXIgbmV3WSA9ICgtYTIyICogYTEwICsgYTEyICogYTIwKSAqIHggKyAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIHkgKyAoLWExMiAqIGEwMCArIGEwMiAqIGExMCk7XHJcbiAgICAgICAgICAgIHZhciBuZXdaID0gKGEyMSAqIGExMCAtIGExMSAqIGEyMCkgKiB4ICsgKC1hMjEgKiBhMDAgKyBhMDEgKiBhMjApICogeSArIChhMTEgKiBhMDAgLSBhMDEgKiBhMTApO1xyXG4gICAgICAgICAgICBuZXdQb3MueCA9IG5ld1ggLyBuZXdaO1xyXG4gICAgICAgICAgICBuZXdQb3MueSA9IG5ld1kgLyBuZXdaO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLCBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdLCBiMDEgPSBhMjIgKiBhMTEgLSBhMTIgKiBhMjEsIGIxMSA9IC1hMjIgKiBhMTAgKyBhMTIgKiBhMjAsIGIyMSA9IGEyMSAqIGExMCAtIGExMSAqIGEyMDtcclxuICAgICAgICAgICAgdmFyIGRldCA9IGEwMCAqIGIwMSArIGEwMSAqIGIxMSArIGEwMiAqIGIyMTtcclxuICAgICAgICAgICAgaWYgKCFkZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRldCA9IDEuMCAvIGRldDtcclxuICAgICAgICAgICAgYVswXSA9IGIwMSAqIGRldDtcclxuICAgICAgICAgICAgYVsxXSA9ICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIGRldDtcclxuICAgICAgICAgICAgYVsyXSA9IChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpICogZGV0O1xyXG4gICAgICAgICAgICBhWzNdID0gYjExICogZGV0O1xyXG4gICAgICAgICAgICBhWzRdID0gKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbNV0gPSAoLWExMiAqIGEwMCArIGEwMiAqIGExMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbNl0gPSBiMjEgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbN10gPSAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbOF0gPSAoYTExICogYTAwIC0gYTAxICogYTEwKSAqIGRldDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuaWRlbnRpdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gMTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgyZCh0aGlzLm1hdDMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNvcHlUbyA9IGZ1bmN0aW9uIChtYXRyaXgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhcjIgPSBtYXRyaXgubWF0MztcclxuICAgICAgICAgICAgYXIyWzBdID0gbWF0M1swXTtcclxuICAgICAgICAgICAgYXIyWzFdID0gbWF0M1sxXTtcclxuICAgICAgICAgICAgYXIyWzJdID0gbWF0M1syXTtcclxuICAgICAgICAgICAgYXIyWzNdID0gbWF0M1szXTtcclxuICAgICAgICAgICAgYXIyWzRdID0gbWF0M1s0XTtcclxuICAgICAgICAgICAgYXIyWzVdID0gbWF0M1s1XTtcclxuICAgICAgICAgICAgYXIyWzZdID0gbWF0M1s2XTtcclxuICAgICAgICAgICAgYXIyWzddID0gbWF0M1s3XTtcclxuICAgICAgICAgICAgYXIyWzhdID0gbWF0M1s4XTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKG1hdHJpeCwgYWZmaW5lKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgZCA9IDEuMCAvIG1hdDNbOF07XHJcbiAgICAgICAgICAgIHZhciB0eCA9IG1hdDNbNl0gKiBkLCB0eSA9IG1hdDNbN10gKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguYSA9IChtYXQzWzBdIC0gbWF0M1syXSAqIHR4KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5iID0gKG1hdDNbMV0gLSBtYXQzWzJdICogdHkpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmMgPSAobWF0M1szXSAtIG1hdDNbNV0gKiB0eCkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguZCA9IChtYXQzWzRdIC0gbWF0M1s1XSAqIHR5KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC50eCA9IHR4O1xyXG4gICAgICAgICAgICBtYXRyaXgudHkgPSB0eTtcclxuICAgICAgICAgICAgaWYgKGFmZmluZSA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWZmaW5lID09PSBBRkZJTkUuUE9JTlQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmIgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5jID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguZCA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhZmZpbmUgPT09IEFGRklORS5BWElTX1gpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYyA9IC1tYXRyaXguYjtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguZCA9IG1hdHJpeC5hO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWZmaW5lID09PSBBRkZJTkUuQVhJU19ZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmEgPSBtYXRyaXguZDtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYyA9IC1tYXRyaXguYjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNvcHlGcm9tID0gZnVuY3Rpb24gKG1hdHJpeCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IG1hdHJpeC5hO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gbWF0cml4LmI7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gbWF0cml4LmM7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBtYXRyaXguZDtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSBtYXRyaXgudHg7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSBtYXRyaXgudHk7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxLjA7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNldFRvTXVsdExlZ2FjeSA9IGZ1bmN0aW9uIChwdCwgbHQpIHtcclxuICAgICAgICAgICAgdmFyIG91dCA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGIgPSBsdC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gcHQuYSwgYTAxID0gcHQuYiwgYTEwID0gcHQuYywgYTExID0gcHQuZCwgYTIwID0gcHQudHgsIGEyMSA9IHB0LnR5LCBiMDAgPSBiWzBdLCBiMDEgPSBiWzFdLCBiMDIgPSBiWzJdLCBiMTAgPSBiWzNdLCBiMTEgPSBiWzRdLCBiMTIgPSBiWzVdLCBiMjAgPSBiWzZdLCBiMjEgPSBiWzddLCBiMjIgPSBiWzhdO1xyXG4gICAgICAgICAgICBvdXRbMF0gPSBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFsxXSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzJdID0gYjAyO1xyXG4gICAgICAgICAgICBvdXRbM10gPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs0XSA9IGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzVdID0gYjEyO1xyXG4gICAgICAgICAgICBvdXRbNl0gPSBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs3XSA9IGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzhdID0gYjIyO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zZXRUb011bHQyZCA9IGZ1bmN0aW9uIChwdCwgbHQpIHtcclxuICAgICAgICAgICAgdmFyIG91dCA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGEgPSBwdC5tYXQzLCBiID0gbHQubWF0MztcclxuICAgICAgICAgICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sIGIwMCA9IGJbMF0sIGIwMSA9IGJbMV0sIGIwMiA9IGJbMl0sIGIxMCA9IGJbM10sIGIxMSA9IGJbNF0sIGIxMiA9IGJbNV0sIGIyMCA9IGJbNl0sIGIyMSA9IGJbN10sIGIyMiA9IGJbOF07XHJcbiAgICAgICAgICAgIG91dFswXSA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzFdID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbMl0gPSBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjI7XHJcbiAgICAgICAgICAgIG91dFszXSA9IGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbNV0gPSBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjI7XHJcbiAgICAgICAgICAgIG91dFs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbOF0gPSBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjI7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQuSURFTlRJVFkgPSBuZXcgTWF0cml4MmQoKTtcclxuICAgICAgICBNYXRyaXgyZC5URU1QX01BVFJJWCA9IG5ldyBNYXRyaXgyZCgpO1xyXG4gICAgICAgIHJldHVybiBNYXRyaXgyZDtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQgPSBNYXRyaXgyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtSGFjayhwYXJlbnRUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2YXIgcHJvaiA9IHRoaXMucHJvajtcclxuICAgICAgICB2YXIgdGEgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwd2lkID0gcGFyZW50VHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgIHZhciBsdCA9IHRhLmxvY2FsVHJhbnNmb3JtO1xyXG4gICAgICAgIGlmICh0YS5fbG9jYWxJRCAhPT0gdGEuX2N1cnJlbnRMb2NhbElEKSB7XHJcbiAgICAgICAgICAgIGx0LmEgPSB0YS5fY3ggKiB0YS5zY2FsZS5feDtcclxuICAgICAgICAgICAgbHQuYiA9IHRhLl9zeCAqIHRhLnNjYWxlLl94O1xyXG4gICAgICAgICAgICBsdC5jID0gdGEuX2N5ICogdGEuc2NhbGUuX3k7XHJcbiAgICAgICAgICAgIGx0LmQgPSB0YS5fc3kgKiB0YS5zY2FsZS5feTtcclxuICAgICAgICAgICAgbHQudHggPSB0YS5wb3NpdGlvbi5feCAtICgodGEucGl2b3QuX3ggKiBsdC5hKSArICh0YS5waXZvdC5feSAqIGx0LmMpKTtcclxuICAgICAgICAgICAgbHQudHkgPSB0YS5wb3NpdGlvbi5feSAtICgodGEucGl2b3QuX3ggKiBsdC5iKSArICh0YS5waXZvdC5feSAqIGx0LmQpKTtcclxuICAgICAgICAgICAgdGEuX2N1cnJlbnRMb2NhbElEID0gdGEuX2xvY2FsSUQ7XHJcbiAgICAgICAgICAgIHByb2ouX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9tYXRyaXhJRCA9IHByb2ouX3Byb2pJRDtcclxuICAgICAgICBpZiAocHJvai5fY3VycmVudFByb2pJRCAhPT0gX21hdHJpeElEKSB7XHJcbiAgICAgICAgICAgIHByb2ouX2N1cnJlbnRQcm9qSUQgPSBfbWF0cml4SUQ7XHJcbiAgICAgICAgICAgIGlmIChfbWF0cml4SUQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHByb2oubG9jYWwuc2V0VG9NdWx0TGVnYWN5KGx0LCBwcm9qLm1hdHJpeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLmxvY2FsLmNvcHlGcm9tKGx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRhLl9wYXJlbnRJRCAhPT0gcHdpZCkge1xyXG4gICAgICAgICAgICB2YXIgcHAgPSBwYXJlbnRUcmFuc2Zvcm0ucHJvajtcclxuICAgICAgICAgICAgaWYgKHBwICYmICFwcC5hZmZpbmUpIHtcclxuICAgICAgICAgICAgICAgIHByb2oud29ybGQuc2V0VG9NdWx0MmQocHAud29ybGQsIHByb2oubG9jYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvai53b3JsZC5zZXRUb011bHRMZWdhY3kocGFyZW50VHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtLCBwcm9qLmxvY2FsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9qLndvcmxkLmNvcHkodGEud29ybGRUcmFuc2Zvcm0sIHByb2ouX2FmZmluZSk7XHJcbiAgICAgICAgICAgIHRhLl9wYXJlbnRJRCA9IHB3aWQ7XHJcbiAgICAgICAgICAgIHRhLl93b3JsZElEKys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIHQwID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgIHZhciB0dCA9IFtuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpXTtcclxuICAgIHZhciB0ZW1wUmVjdCA9IG5ldyBQSVhJLlJlY3RhbmdsZSgpO1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICB2YXIgUHJvamVjdGlvbjJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoUHJvamVjdGlvbjJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb24yZChsZWdhY3ksIGVuYWJsZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBsZWdhY3ksIGVuYWJsZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMubWF0cml4ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5sb2NhbCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgX3RoaXMud29ybGQgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qSUQgPSAwO1xyXG4gICAgICAgICAgICBfdGhpcy5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgICAgICBfdGhpcy5fYWZmaW5lID0gcGl4aV9wcm9qZWN0aW9uLkFGRklORS5OT05FO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uMmQucHJvdG90eXBlLCBcImFmZmluZVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FmZmluZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hZmZpbmUgPT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWZmaW5lID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uMmQucHJvdG90eXBlLCBcImVuYWJsZWRcIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl9lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gdHJhbnNmb3JtSGFjaztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IFBJWEkuVHJhbnNmb3JtU3RhdGljLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUuc2V0QXhpc1ggPSBmdW5jdGlvbiAocCwgZmFjdG9yKSB7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgPT09IHZvaWQgMCkgeyBmYWN0b3IgPSAxOyB9XHJcbiAgICAgICAgICAgIHZhciB4ID0gcC54LCB5ID0gcC55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0geCAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSB5IC8gZDtcclxuICAgICAgICAgICAgbWF0M1syXSA9IGZhY3RvciAvIGQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5zZXRBeGlzWSA9IGZ1bmN0aW9uIChwLCBmYWN0b3IpIHtcclxuICAgICAgICAgICAgaWYgKGZhY3RvciA9PT0gdm9pZCAwKSB7IGZhY3RvciA9IDE7IH1cclxuICAgICAgICAgICAgdmFyIHggPSBwLngsIHkgPSBwLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSB4IC8gZDtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHkgLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gZmFjdG9yIC8gZDtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEKys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLm1hcFNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQpIHtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC54ID0gLXNwcml0ZS5hbmNob3IueCAqIHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gLXNwcml0ZS5hbmNob3IueSAqIHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdGVtcFJlY3Qud2lkdGggPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBRdWFkKHRlbXBSZWN0LCBxdWFkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUubWFwUXVhZCA9IGZ1bmN0aW9uIChyZWN0LCBwKSB7XHJcbiAgICAgICAgICAgIHR0WzBdLnNldChyZWN0LngsIHJlY3QueSk7XHJcbiAgICAgICAgICAgIHR0WzFdLnNldChyZWN0LnggKyByZWN0LndpZHRoLCByZWN0LnkpO1xyXG4gICAgICAgICAgICB0dFsyXS5zZXQocmVjdC54ICsgcmVjdC53aWR0aCwgcmVjdC55ICsgcmVjdC5oZWlnaHQpO1xyXG4gICAgICAgICAgICB0dFszXS5zZXQocmVjdC54LCByZWN0LnkgKyByZWN0LmhlaWdodCk7XHJcbiAgICAgICAgICAgIHZhciBrMSA9IDEsIGsyID0gMiwgazMgPSAzO1xyXG4gICAgICAgICAgICB2YXIgZiA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5nZXRJbnRlcnNlY3Rpb25GYWN0b3IocFswXSwgcFsyXSwgcFsxXSwgcFszXSwgdDApO1xyXG4gICAgICAgICAgICBpZiAoZiAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgazEgPSAxO1xyXG4gICAgICAgICAgICAgICAgazIgPSAzO1xyXG4gICAgICAgICAgICAgICAgazMgPSAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkMCA9IE1hdGguc3FydCgocFswXS54IC0gdDAueCkgKiAocFswXS54IC0gdDAueCkgKyAocFswXS55IC0gdDAueSkgKiAocFswXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgZDEgPSBNYXRoLnNxcnQoKHBbazFdLnggLSB0MC54KSAqIChwW2sxXS54IC0gdDAueCkgKyAocFtrMV0ueSAtIHQwLnkpICogKHBbazFdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBkMiA9IE1hdGguc3FydCgocFtrMl0ueCAtIHQwLngpICogKHBbazJdLnggLSB0MC54KSArIChwW2syXS55IC0gdDAueSkgKiAocFtrMl0ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIGQzID0gTWF0aC5zcXJ0KChwW2szXS54IC0gdDAueCkgKiAocFtrM10ueCAtIHQwLngpICsgKHBbazNdLnkgLSB0MC55KSAqIChwW2szXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgcTAgPSAoZDAgKyBkMykgLyBkMztcclxuICAgICAgICAgICAgdmFyIHExID0gKGQxICsgZDIpIC8gZDI7XHJcbiAgICAgICAgICAgIHZhciBxMiA9IChkMSArIGQyKSAvIGQxO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSB0dFswXS54ICogcTA7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSB0dFswXS55ICogcTA7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSBxMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IHR0W2sxXS54ICogcTE7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSB0dFtrMV0ueSAqIHExO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gcTE7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSB0dFtrMl0ueCAqIHEyO1xyXG4gICAgICAgICAgICBtYXQzWzddID0gdHRbazJdLnkgKiBxMjtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IHEyO1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeC5pbnZlcnQoKTtcclxuICAgICAgICAgICAgbWF0MyA9IHRlbXBNYXQubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHBbMF0ueDtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHBbMF0ueTtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBwW2sxXS54O1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gcFtrMV0ueTtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSBwW2syXS54O1xyXG4gICAgICAgICAgICBtYXQzWzddID0gcFtrMl0ueTtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4LnNldFRvTXVsdDJkKHRlbXBNYXQsIHRoaXMubWF0cml4KTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEKys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4LmlkZW50aXR5KCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvbjJkO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCA9IFByb2plY3Rpb24yZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE1lc2gyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKE1lc2gyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBNZXNoMmQodGV4dHVyZSwgdmVydGljZXMsIHV2cywgaW5kaWNlcywgZHJhd01vZGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dHVyZSwgdmVydGljZXMsIHV2cywgaW5kaWNlcywgZHJhd01vZGUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ21lc2gyZCc7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lc2gyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBNZXNoMmQ7XHJcbiAgICB9KFBJWEkubWVzaC5NZXNoKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uTWVzaDJkID0gTWVzaDJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB0cmFuc2xhdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgdVRyYW5zZm9ybTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiB0cmFuc2xhdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcblxcbiAgICB2VGV4dHVyZUNvb3JkID0gKHVUcmFuc2Zvcm0gKiB2ZWMzKGFUZXh0dXJlQ29vcmQsIDEuMCkpLnh5O1xcbn1cXG5cIjtcclxuICAgIHZhciBzaGFkZXJGcmFnID0gXCJcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHZlYzQgdUNvbG9yO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKSAqIHVDb2xvcjtcXG59XCI7XHJcbiAgICB2YXIgTWVzaDJkUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhNZXNoMmRSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBNZXNoMmRSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBNZXNoMmRSZW5kZXJlci5wcm90b3R5cGUub25Db250ZXh0Q2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB0aGlzLnNoYWRlciA9IG5ldyBQSVhJLlNoYWRlcihnbCwgc2hhZGVyVmVydCwgc2hhZGVyRnJhZyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gTWVzaDJkUmVuZGVyZXI7XHJcbiAgICB9KFBJWEkubWVzaC5NZXNoUmVuZGVyZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5NZXNoMmRSZW5kZXJlciA9IE1lc2gyZFJlbmRlcmVyO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdtZXNoMmQnLCBNZXNoMmRSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIFBJWEkuU3ByaXRlLnByb3RvdHlwZS5jb252ZXJ0VG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGUyZCc7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLm1lc2guTWVzaC5wcm90b3R5cGUuY29udmVydFRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLnBsdWdpbk5hbWUgPSAnbWVzaDJkJztcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0VG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRTdWJ0cmVlVG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNvbnZlcnRUbzJkKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29udmVydFN1YnRyZWVUbzJkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFNwcml0ZTJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlMmQodGV4dHVyZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0dXJlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGUyZCc7XHJcbiAgICAgICAgICAgIF90aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGUyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5fYm91bmRzLmFkZFF1YWQodGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FmZmluZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGV4RGF0YS5sZW5ndGggIT0gOCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoOCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMudmVydGV4RGF0YS5sZW5ndGggIT0gMTIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RyYW5zZm9ybUlEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZUlEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy5wcm9qLndvcmxkLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdHJpbSA9IHRleHR1cmUudHJpbTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IDA7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0cmltKSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IHRyaW0ueCAtIChhbmNob3IuX3ggKiBvcmlnLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyB0cmltLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSB0cmltLnkgLSAoYW5jaG9yLl95ICogb3JpZy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIHRyaW0uaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9ICh3dFswXSAqIHcxKSArICh3dFszXSAqIGgxKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gKHd0WzFdICogdzEpICsgKHd0WzRdICogaDEpICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSAod3RbMl0gKiB3MSkgKyAod3RbNV0gKiBoMSkgKyB3dFs4XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9ICh3dFswXSAqIHcwKSArICh3dFszXSAqIGgxKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gKHd0WzFdICogdzApICsgKHd0WzRdICogaDEpICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSAod3RbMl0gKiB3MCkgKyAod3RbNV0gKiBoMSkgKyB3dFs4XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9ICh3dFswXSAqIHcwKSArICh3dFszXSAqIGgwKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gKHd0WzFdICogdzApICsgKHd0WzRdICogaDApICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbOF0gPSAod3RbMl0gKiB3MCkgKyAod3RbNV0gKiBoMCkgKyB3dFs4XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs5XSA9ICh3dFswXSAqIHcxKSArICh3dFszXSAqIGgwKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzEwXSA9ICh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgwKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzExXSA9ICh3dFsyXSAqIHcxKSArICh3dFs1XSAqIGgwKSArIHd0WzhdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWZmaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcy5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZlcnRleFRyaW1tZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleFRyaW1tZWREYXRhID0gbmV3IEZsb2F0MzJBcnJheSg4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4VHJpbW1lZERhdGE7XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnByb2oud29ybGQubWF0MztcclxuICAgICAgICAgICAgdmFyIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgeiA9IDEuMCAvICh3dFsyXSAqIHcxICsgd3RbNV0gKiBoMSArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IHogKiAoKHd0WzBdICogdzEpICsgKHd0WzNdICogaDEpICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0geiAqICgod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XSk7XHJcbiAgICAgICAgICAgIHogPSAxLjAgLyAod3RbMl0gKiB3MCArIHd0WzVdICogaDEgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSB6ICogKCh3dFswXSAqIHcwKSArICh3dFszXSAqIGgxKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IHogKiAoKHd0WzFdICogdzApICsgKHd0WzRdICogaDEpICsgd3RbN10pO1xyXG4gICAgICAgICAgICB6ID0gMS4wIC8gKHd0WzJdICogdzAgKyB3dFs1XSAqIGgwICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0geiAqICgod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMCkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSB6ICogKCh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgwKSArIHd0WzddKTtcclxuICAgICAgICAgICAgeiA9IDEuMCAvICh3dFsyXSAqIHcxICsgd3RbNV0gKiBoMCArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IHogKiAoKHd0WzBdICogdzEpICsgKHd0WzNdICogaDApICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0geiAqICgod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ByaXRlMmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlMmQ7XHJcbiAgICB9KFBJWEkuU3ByaXRlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQgPSBTcHJpdGUyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgdmFyIFNwcml0ZTJkUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGUyZFJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZTJkUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuYXR0cmlidXRlIHZlYzQgYUNvbG9yO1xcbmF0dHJpYnV0ZSBmbG9hdCBhVGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIGFWZXJ0ZXhQb3NpdGlvbjtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG4gICAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbiAgICB2VGV4dHVyZUlkID0gYVRleHR1cmVJZDtcXG4gICAgdkNvbG9yID0gYUNvbG9yO1xcbn1cXG5cIjtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9IFwiXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXJzWyVjb3VudCVdO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG52ZWM0IGNvbG9yO1xcbnZlYzIgdGV4dHVyZUNvb3JkID0gdlRleHR1cmVDb29yZDtcXG5mbG9hdCB0ZXh0dXJlSWQgPSBmbG9vcih2VGV4dHVyZUlkKzAuNSk7XFxuJWZvcmxvb3AlXFxuZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiB2Q29sb3I7XFxufVwiO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZTJkUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZVZhbyA9IGZ1bmN0aW9uICh2ZXJ0ZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgdGhpcy52ZXJ0U2l6ZSA9IDY7XHJcbiAgICAgICAgICAgIHRoaXMudmVydEJ5dGVTaXplID0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHZhciB2YW8gPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZVZhbygpXHJcbiAgICAgICAgICAgICAgICAuYWRkSW5kZXgodGhpcy5pbmRleEJ1ZmZlcilcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDApXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVDb29yZCwgZ2wuVU5TSUdORURfU0hPUlQsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCAzICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hQ29sb3IsIGdsLlVOU0lHTkVEX0JZVEUsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCA0ICogNCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5hVGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YW8uYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVJZCwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNSAqIDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YW87XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUyZFJlbmRlcmVyLnByb3RvdHlwZS5maWxsVmVydGljZXMgPSBmdW5jdGlvbiAoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIHRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHNwcml0ZS52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdXZzID0gc3ByaXRlLl90ZXh0dXJlLl91dnMudXZzVWludDMyO1xyXG4gICAgICAgICAgICBpZiAodmVydGV4RGF0YS5sZW5ndGggPT09IDgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmVyLnJvdW5kUGl4ZWxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc29sdXRpb24gPSB0aGlzLnJlbmRlcmVyLnJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gKCh2ZXJ0ZXhEYXRhWzBdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9ICgodmVydGV4RGF0YVsxXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9ICgodmVydGV4RGF0YVsyXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSAoKHZlcnRleERhdGFbM10gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTJdID0gKCh2ZXJ0ZXhEYXRhWzRdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSAoKHZlcnRleERhdGFbNV0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE0XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE4XSA9ICgodmVydGV4RGF0YVs2XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTldID0gKCh2ZXJ0ZXhEYXRhWzddICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyMF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IHZlcnRleERhdGFbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IHZlcnRleERhdGFbM107XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEyXSA9IHZlcnRleERhdGFbNF07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB2ZXJ0ZXhEYXRhWzVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTRdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMThdID0gdmVydGV4RGF0YVs2XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE5XSA9IHZlcnRleERhdGFbN107XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyMF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhWzBdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbMV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gdmVydGV4RGF0YVsyXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSB2ZXJ0ZXhEYXRhWzNdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IHZlcnRleERhdGFbNF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gdmVydGV4RGF0YVs1XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTJdID0gdmVydGV4RGF0YVs2XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdmVydGV4RGF0YVs3XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTRdID0gdmVydGV4RGF0YVs4XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMThdID0gdmVydGV4RGF0YVs5XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTldID0gdmVydGV4RGF0YVsxMF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDIwXSA9IHZlcnRleERhdGFbMTFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAzXSA9IHV2c1swXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDldID0gdXZzWzFdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMTVdID0gdXZzWzJdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMjFdID0gdXZzWzNdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgNF0gPSB1aW50MzJWaWV3W2luZGV4ICsgMTBdID0gdWludDMyVmlld1tpbmRleCArIDE2XSA9IHVpbnQzMlZpZXdbaW5kZXggKyAyMl0gPSBhcmdiO1xyXG4gICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDVdID0gZmxvYXQzMlZpZXdbaW5kZXggKyAxMV0gPSBmbG9hdDMyVmlld1tpbmRleCArIDE3XSA9IGZsb2F0MzJWaWV3W2luZGV4ICsgMjNdID0gdGV4dHVyZUlkO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZTJkUmVuZGVyZXI7XHJcbiAgICB9KE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKSk7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Nwcml0ZTJkJywgU3ByaXRlMmRSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBUZXh0MmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhUZXh0MmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gVGV4dDJkKHRleHQsIHN0eWxlLCBjYW52YXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dCwgc3R5bGUsIGNhbnZhcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlMmQnO1xyXG4gICAgICAgICAgICBfdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRleHQyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBUZXh0MmQ7XHJcbiAgICB9KFBJWEkuVGV4dCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlRleHQyZCA9IFRleHQyZDtcclxuICAgIFRleHQyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgVGV4dDJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgIFRleHQyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFByb2plY3Rpb25zTWFuYWdlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvbnNNYW5hZ2VyKHJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMub25Db250ZXh0Q2hhbmdlID0gZnVuY3Rpb24gKGdsKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5nbCA9IGdsO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucmVuZGVyZXIubWFza01hbmFnZXIucHVzaFNwcml0ZU1hc2sgPSBwdXNoU3ByaXRlTWFzaztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xyXG4gICAgICAgICAgICByZW5kZXJlci5vbignY29udGV4dCcsIHRoaXMub25Db250ZXh0Q2hhbmdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgUHJvamVjdGlvbnNNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLm9mZignY29udGV4dCcsIHRoaXMub25Db250ZXh0Q2hhbmdlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uc01hbmFnZXI7XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25zTWFuYWdlciA9IFByb2plY3Rpb25zTWFuYWdlcjtcclxuICAgIGZ1bmN0aW9uIHB1c2hTcHJpdGVNYXNrKHRhcmdldCwgbWFza0RhdGEpIHtcclxuICAgICAgICB2YXIgYWxwaGFNYXNrRmlsdGVyID0gdGhpcy5hbHBoYU1hc2tQb29sW3RoaXMuYWxwaGFNYXNrSW5kZXhdO1xyXG4gICAgICAgIGlmICghYWxwaGFNYXNrRmlsdGVyKSB7XHJcbiAgICAgICAgICAgIGFscGhhTWFza0ZpbHRlciA9IHRoaXMuYWxwaGFNYXNrUG9vbFt0aGlzLmFscGhhTWFza0luZGV4XSA9IFtuZXcgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZU1hc2tGaWx0ZXIyZChtYXNrRGF0YSldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhbHBoYU1hc2tGaWx0ZXJbMF0ucmVzb2x1dGlvbiA9IHRoaXMucmVuZGVyZXIucmVzb2x1dGlvbjtcclxuICAgICAgICBhbHBoYU1hc2tGaWx0ZXJbMF0ubWFza1Nwcml0ZSA9IG1hc2tEYXRhO1xyXG4gICAgICAgIHRhcmdldC5maWx0ZXJBcmVhID0gbWFza0RhdGEuZ2V0Qm91bmRzKHRydWUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuZmlsdGVyTWFuYWdlci5wdXNoRmlsdGVyKHRhcmdldCwgYWxwaGFNYXNrRmlsdGVyKTtcclxuICAgICAgICB0aGlzLmFscGhhTWFza0luZGV4Kys7XHJcbiAgICB9XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Byb2plY3Rpb25zJywgUHJvamVjdGlvbnNNYW5hZ2VyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHNwcml0ZU1hc2tWZXJ0ID0gXCJcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgb3RoZXJNYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMzIHZNYXNrQ29vcmQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcblxcdGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcblxcblxcdHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcblxcdHZNYXNrQ29vcmQgPSBvdGhlck1hdHJpeCAqIHZlYzMoIGFUZXh0dXJlQ29vcmQsIDEuMCk7XFxufVxcblwiO1xyXG4gICAgdmFyIHNwcml0ZU1hc2tGcmFnID0gXCJcXG52YXJ5aW5nIHZlYzMgdk1hc2tDb29yZDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IGFscGhhO1xcbnVuaWZvcm0gc2FtcGxlcjJEIG1hc2s7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICB2ZWMyIHV2ID0gdk1hc2tDb29yZC54eSAvIHZNYXNrQ29vcmQuejtcXG4gICAgXFxuICAgIHZlYzIgdGV4dCA9IGFicyggdXYgLSAwLjUgKTtcXG4gICAgdGV4dCA9IHN0ZXAoMC41LCB0ZXh0KTtcXG5cXG4gICAgZmxvYXQgY2xpcCA9IDEuMCAtIG1heCh0ZXh0LnksIHRleHQueCk7XFxuICAgIHZlYzQgb3JpZ2luYWwgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWM0IG1hc2t5ID0gdGV4dHVyZTJEKG1hc2ssIHV2KTtcXG5cXG4gICAgb3JpZ2luYWwgKj0gKG1hc2t5LnIgKiBtYXNreS5hICogYWxwaGEgKiBjbGlwKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gb3JpZ2luYWw7XFxufVxcblwiO1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICB2YXIgU3ByaXRlTWFza0ZpbHRlcjJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlTWFza0ZpbHRlcjJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZU1hc2tGaWx0ZXIyZChzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc3ByaXRlTWFza1ZlcnQsIHNwcml0ZU1hc2tGcmFnKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5tYXNrTWF0cml4ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBzcHJpdGUucmVuZGVyYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfdGhpcy5tYXNrU3ByaXRlID0gc3ByaXRlO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZU1hc2tGaWx0ZXIyZC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAoZmlsdGVyTWFuYWdlciwgaW5wdXQsIG91dHB1dCwgY2xlYXIsIGN1cnJlbnRTdGF0ZSkge1xyXG4gICAgICAgICAgICB2YXIgbWFza1Nwcml0ZSA9IHRoaXMubWFza1Nwcml0ZTtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3Jtcy5tYXNrID0gbWFza1Nwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1zLm90aGVyTWF0cml4ID0gU3ByaXRlTWFza0ZpbHRlcjJkLmNhbGN1bGF0ZVNwcml0ZU1hdHJpeChjdXJyZW50U3RhdGUsIHRoaXMubWFza01hdHJpeCwgbWFza1Nwcml0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybXMuYWxwaGEgPSBtYXNrU3ByaXRlLndvcmxkQWxwaGE7XHJcbiAgICAgICAgICAgIGZpbHRlck1hbmFnZXIuYXBwbHlGaWx0ZXIodGhpcywgaW5wdXQsIG91dHB1dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVNYXNrRmlsdGVyMmQuY2FsY3VsYXRlU3ByaXRlTWF0cml4ID0gZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgbWFwcGVkTWF0cml4LCBzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIHByb2ogPSBzcHJpdGUucHJvajtcclxuICAgICAgICAgICAgdmFyIGZpbHRlckFyZWEgPSBjdXJyZW50U3RhdGUuc291cmNlRnJhbWU7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlU2l6ZSA9IGN1cnJlbnRTdGF0ZS5yZW5kZXJUYXJnZXQuc2l6ZTtcclxuICAgICAgICAgICAgdmFyIHdvcmxkVHJhbnNmb3JtID0gcHJvaiAmJiAhcHJvai5fYWZmaW5lID8gcHJvai53b3JsZC5jb3B5VG8odGVtcE1hdCkgOiB0ZW1wTWF0LmNvcHlGcm9tKHNwcml0ZS50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHNwcml0ZS50ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIG1hcHBlZE1hdHJpeC5zZXQodGV4dHVyZVNpemUud2lkdGgsIDAsIDAsIHRleHR1cmVTaXplLmhlaWdodCwgZmlsdGVyQXJlYS54LCBmaWx0ZXJBcmVhLnkpO1xyXG4gICAgICAgICAgICB3b3JsZFRyYW5zZm9ybS5pbnZlcnQoKTtcclxuICAgICAgICAgICAgbWFwcGVkTWF0cml4LnNldFRvTXVsdDJkKHdvcmxkVHJhbnNmb3JtLCBtYXBwZWRNYXRyaXgpO1xyXG4gICAgICAgICAgICBtYXBwZWRNYXRyaXguc2NhbGVBbmRUcmFuc2xhdGUoMS4wIC8gdGV4dHVyZS53aWR0aCwgMS4wIC8gdGV4dHVyZS5oZWlnaHQsIHNwcml0ZS5hbmNob3IueCwgc3ByaXRlLmFuY2hvci55KTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hcHBlZE1hdHJpeDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGVNYXNrRmlsdGVyMmQ7XHJcbiAgICB9KFBJWEkuRmlsdGVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3ByaXRlTWFza0ZpbHRlcjJkID0gU3ByaXRlTWFza0ZpbHRlcjJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktcHJvamVjdGlvbi5qcy5tYXAiLCIvKiFcbiAqIHBpeGktc291bmQgLSB2Mi4wLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9waXhpanMvcGl4aS1zb3VuZFxuICogQ29tcGlsZWQgVHVlLCAxNCBOb3YgMjAxNyAxNzo1Mzo0NyBVVENcbiAqXG4gKiBwaXhpLXNvdW5kIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLl9fcGl4aVNvdW5kPWUuX19waXhpU291bmR8fHt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUsdCl7ZnVuY3Rpb24gbigpe3RoaXMuY29uc3RydWN0b3I9ZX1vKGUsdCksZS5wcm90b3R5cGU9bnVsbD09PXQ/T2JqZWN0LmNyZWF0ZSh0KToobi5wcm90b3R5cGU9dC5wcm90b3R5cGUsbmV3IG4pfWlmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBQSVhJKXRocm93XCJQaXhpSlMgcmVxdWlyZWRcIjt2YXIgbj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLl9vdXRwdXQ9dCx0aGlzLl9pbnB1dD1lfXJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJkZXN0aW5hdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW5wdXR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7aWYodGhpcy5fZmlsdGVycyYmKHRoaXMuX2ZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihlKXtlJiZlLmRpc2Nvbm5lY3QoKX0pLHRoaXMuX2ZpbHRlcnM9bnVsbCx0aGlzLl9pbnB1dC5jb25uZWN0KHRoaXMuX291dHB1dCkpLGUmJmUubGVuZ3RoKXt0aGlzLl9maWx0ZXJzPWUuc2xpY2UoMCksdGhpcy5faW5wdXQuZGlzY29ubmVjdCgpO3ZhciBuPW51bGw7ZS5mb3JFYWNoKGZ1bmN0aW9uKGUpe251bGw9PT1uP3QuX2lucHV0LmNvbm5lY3QoZS5kZXN0aW5hdGlvbik6bi5jb25uZWN0KGUuZGVzdGluYXRpb24pLG49ZX0pLG4uY29ubmVjdCh0aGlzLl9vdXRwdXQpfX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5maWx0ZXJzPW51bGwsdGhpcy5faW5wdXQ9bnVsbCx0aGlzLl9vdXRwdXQ9bnVsbH0sZX0oKSxvPU9iamVjdC5zZXRQcm90b3R5cGVPZnx8e19fcHJvdG9fXzpbXX1pbnN0YW5jZW9mIEFycmF5JiZmdW5jdGlvbihlLHQpe2UuX19wcm90b19fPXR9fHxmdW5jdGlvbihlLHQpe2Zvcih2YXIgbiBpbiB0KXQuaGFzT3duUHJvcGVydHkobikmJihlW25dPXRbbl0pfSxpPTAscj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZhciBuPWUuY2FsbCh0aGlzKXx8dGhpcztyZXR1cm4gbi5pZD1pKyssbi5pbml0KHQpLG59cmV0dXJuIHQobixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwcm9ncmVzc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlLmN1cnJlbnRUaW1lL3RoaXMuX2R1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGF1c2VkPWUsdGhpcy5yZWZyZXNoUGF1c2VkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuX29uUGxheT1mdW5jdGlvbigpe3RoaXMuX3BsYXlpbmc9ITB9LG4ucHJvdG90eXBlLl9vblBhdXNlPWZ1bmN0aW9uKCl7dGhpcy5fcGxheWluZz0hMX0sbi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLl9wbGF5aW5nPSExLHRoaXMuX2R1cmF0aW9uPWUuc291cmNlLmR1cmF0aW9uO3ZhciB0PXRoaXMuX3NvdXJjZT1lLnNvdXJjZS5jbG9uZU5vZGUoITEpO3Quc3JjPWUucGFyZW50LnVybCx0Lm9ucGxheT10aGlzLl9vblBsYXkuYmluZCh0aGlzKSx0Lm9ucGF1c2U9dGhpcy5fb25QYXVzZS5iaW5kKHRoaXMpLGUuY29udGV4dC5vbihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksZS5jb250ZXh0Lm9uKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKSx0aGlzLl9tZWRpYT1lfSxuLnByb3RvdHlwZS5faW50ZXJuYWxTdG9wPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiZ0aGlzLl9wbGF5aW5nJiYodGhpcy5fc291cmNlLm9uZW5kZWQ9bnVsbCx0aGlzLl9zb3VyY2UucGF1c2UoKSl9LG4ucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLl9zb3VyY2UmJnRoaXMuZW1pdChcInN0b3BcIil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNwZWVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NwZWVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwidm9sdW1lXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl92b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl92b2x1bWU9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJsb29wXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9sb29wfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbG9vcD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIm11dGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tdXRlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX211dGVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQ7dGhpcy5fc291cmNlLmxvb3A9dGhpcy5fbG9vcHx8dC5sb29wO3ZhciBuPWUudm9sdW1lKihlLm11dGVkPzA6MSksbz10LnZvbHVtZSoodC5tdXRlZD8wOjEpLGk9dGhpcy5fdm9sdW1lKih0aGlzLl9tdXRlZD8wOjEpO3RoaXMuX3NvdXJjZS52b2x1bWU9aSpuKm8sdGhpcy5fc291cmNlLnBsYXliYWNrUmF0ZT10aGlzLl9zcGVlZCplLnNwZWVkKnQuc3BlZWR9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50LG49dGhpcy5fcGF1c2VkfHx0LnBhdXNlZHx8ZS5wYXVzZWQ7biE9PXRoaXMuX3BhdXNlZFJlYWwmJih0aGlzLl9wYXVzZWRSZWFsPW4sbj8odGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwicGF1c2VkXCIpKToodGhpcy5lbWl0KFwicmVzdW1lZFwiKSx0aGlzLnBsYXkoe3N0YXJ0OnRoaXMuX3NvdXJjZS5jdXJyZW50VGltZSxlbmQ6dGhpcy5fZW5kLHZvbHVtZTp0aGlzLl92b2x1bWUsc3BlZWQ6dGhpcy5fc3BlZWQsbG9vcDp0aGlzLl9sb29wfSkpLHRoaXMuZW1pdChcInBhdXNlXCIsbikpfSxuLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMsbz1lLnN0YXJ0LGk9ZS5lbmQscj1lLnNwZWVkLHM9ZS5sb29wLHU9ZS52b2x1bWUsYT1lLm11dGVkO2kmJmNvbnNvbGUuYXNzZXJ0KGk+byxcIkVuZCB0aW1lIGlzIGJlZm9yZSBzdGFydCB0aW1lXCIpLHRoaXMuX3NwZWVkPXIsdGhpcy5fdm9sdW1lPXUsdGhpcy5fbG9vcD0hIXMsdGhpcy5fbXV0ZWQ9YSx0aGlzLnJlZnJlc2goKSx0aGlzLmxvb3AmJm51bGwhPT1pJiYoY29uc29sZS53YXJuKCdMb29waW5nIG5vdCBzdXBwb3J0IHdoZW4gc3BlY2lmeWluZyBhbiBcImVuZFwiIHRpbWUnKSx0aGlzLmxvb3A9ITEpLHRoaXMuX3N0YXJ0PW8sdGhpcy5fZW5kPWl8fHRoaXMuX2R1cmF0aW9uLHRoaXMuX3N0YXJ0PU1hdGgubWF4KDAsdGhpcy5fc3RhcnQtbi5QQURESU5HKSx0aGlzLl9lbmQ9TWF0aC5taW4odGhpcy5fZW5kK24uUEFERElORyx0aGlzLl9kdXJhdGlvbiksdGhpcy5fc291cmNlLm9ubG9hZGVkbWV0YWRhdGE9ZnVuY3Rpb24oKXt0Ll9zb3VyY2UmJih0Ll9zb3VyY2UuY3VycmVudFRpbWU9byx0Ll9zb3VyY2Uub25sb2FkZWRtZXRhZGF0YT1udWxsLHQuZW1pdChcInByb2dyZXNzXCIsbyx0Ll9kdXJhdGlvbiksUElYSS50aWNrZXIuc2hhcmVkLmFkZCh0Ll9vblVwZGF0ZSx0KSl9LHRoaXMuX3NvdXJjZS5vbmVuZGVkPXRoaXMuX29uQ29tcGxldGUuYmluZCh0aGlzKSx0aGlzLl9zb3VyY2UucGxheSgpLHRoaXMuZW1pdChcInN0YXJ0XCIpfSxuLnByb3RvdHlwZS5fb25VcGRhdGU9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLHRoaXMucHJvZ3Jlc3MsdGhpcy5fZHVyYXRpb24pLHRoaXMuX3NvdXJjZS5jdXJyZW50VGltZT49dGhpcy5fZW5kJiYhdGhpcy5fc291cmNlLmxvb3AmJnRoaXMuX29uQ29tcGxldGUoKX0sbi5wcm90b3R5cGUuX29uQ29tcGxldGU9ZnVuY3Rpb24oKXtQSVhJLnRpY2tlci5zaGFyZWQucmVtb3ZlKHRoaXMuX29uVXBkYXRlLHRoaXMpLHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInByb2dyZXNzXCIsMSx0aGlzLl9kdXJhdGlvbiksdGhpcy5lbWl0KFwiZW5kXCIsdGhpcyl9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtQSVhJLnRpY2tlci5zaGFyZWQucmVtb3ZlKHRoaXMuX29uVXBkYXRlLHRoaXMpLHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7dmFyIGU9dGhpcy5fc291cmNlO2UmJihlLm9uZW5kZWQ9bnVsbCxlLm9ucGxheT1udWxsLGUub25wYXVzZT1udWxsLHRoaXMuX2ludGVybmFsU3RvcCgpKSx0aGlzLl9zb3VyY2U9bnVsbCx0aGlzLl9zcGVlZD0xLHRoaXMuX3ZvbHVtZT0xLHRoaXMuX2xvb3A9ITEsdGhpcy5fZW5kPW51bGwsdGhpcy5fc3RhcnQ9MCx0aGlzLl9kdXJhdGlvbj0wLHRoaXMuX3BsYXlpbmc9ITEsdGhpcy5fcGF1c2VkUmVhbD0hMSx0aGlzLl9wYXVzZWQ9ITEsdGhpcy5fbXV0ZWQ9ITEsdGhpcy5fbWVkaWEmJih0aGlzLl9tZWRpYS5jb250ZXh0Lm9mZihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksdGhpcy5fbWVkaWEuY29udGV4dC5vZmYoXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpLHRoaXMuX21lZGlhPW51bGwpfSxuLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiW0hUTUxBdWRpb0luc3RhbmNlIGlkPVwiK3RoaXMuaWQrXCJdXCJ9LG4uUEFERElORz0uMSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlcikscz1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7cmV0dXJuIG51bGwhPT1lJiZlLmFwcGx5KHRoaXMsYXJndW1lbnRzKXx8dGhpc31yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5wYXJlbnQ9ZSx0aGlzLl9zb3VyY2U9ZS5vcHRpb25zLnNvdXJjZXx8bmV3IEF1ZGlvLGUudXJsJiYodGhpcy5fc291cmNlLnNyYz1lLnVybCl9LG4ucHJvdG90eXBlLmNyZWF0ZT1mdW5jdGlvbigpe3JldHVybiBuZXcgcih0aGlzKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiaXNQbGF5YWJsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4hIXRoaXMuX3NvdXJjZSYmND09PXRoaXMuX3NvdXJjZS5yZWFkeVN0YXRlfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImR1cmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2UuZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXJlbnQuY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBudWxsfSxzZXQ6ZnVuY3Rpb24oZSl7Y29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGZpbHRlcnNcIil9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCksdGhpcy5wYXJlbnQ9bnVsbCx0aGlzLl9zb3VyY2UmJih0aGlzLl9zb3VyY2Uuc3JjPVwiXCIsdGhpcy5fc291cmNlLmxvYWQoKSx0aGlzLl9zb3VyY2U9bnVsbCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNvdXJjZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5fc291cmNlLG49dGhpcy5wYXJlbnQ7aWYoND09PXQucmVhZHlTdGF0ZSl7bi5pc0xvYWRlZD0hMDt2YXIgbz1uLmF1dG9QbGF5U3RhcnQoKTtyZXR1cm4gdm9pZChlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShudWxsLG4sbyl9LDApKX1pZighbi51cmwpcmV0dXJuIGUobmV3IEVycm9yKFwic291bmQudXJsIG9yIHNvdW5kLnNvdXJjZSBtdXN0IGJlIHNldFwiKSk7dC5zcmM9bi51cmw7dmFyIGk9ZnVuY3Rpb24oKXt0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5dGhyb3VnaFwiLHIpLHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIixyKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLHMpLHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsdSl9LHI9ZnVuY3Rpb24oKXtpKCksbi5pc0xvYWRlZD0hMDt2YXIgdD1uLmF1dG9QbGF5U3RhcnQoKTtlJiZlKG51bGwsbix0KX0scz1mdW5jdGlvbigpe2koKSxlJiZlKG5ldyBFcnJvcihcIlNvdW5kIGxvYWRpbmcgaGFzIGJlZW4gYWJvcnRlZFwiKSl9LHU9ZnVuY3Rpb24oKXtpKCk7dmFyIG49XCJGYWlsZWQgdG8gbG9hZCBhdWRpbyBlbGVtZW50IChjb2RlOiBcIit0LmVycm9yLmNvZGUrXCIpXCI7ZT9lKG5ldyBFcnJvcihuKSk6Y29uc29sZS5lcnJvcihuKX07dC5hZGRFdmVudExpc3RlbmVyKFwiY2FucGxheXRocm91Z2hcIixyLCExKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsciwhMSksdC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIixzLCExKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLHUsITEpLHQubG9hZCgpfSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlciksdT1cInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOnt9LGE9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdD17ZXhwb3J0czp7fX0sZSh0LHQuZXhwb3J0cyksdC5leHBvcnRzfShmdW5jdGlvbihlKXshZnVuY3Rpb24odCl7ZnVuY3Rpb24gbigpe31mdW5jdGlvbiBvKGUsdCl7cmV0dXJuIGZ1bmN0aW9uKCl7ZS5hcHBseSh0LGFyZ3VtZW50cyl9fWZ1bmN0aW9uIGkoZSl7aWYoXCJvYmplY3RcIiE9dHlwZW9mIHRoaXMpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ld1wiKTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlKXRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgYSBmdW5jdGlvblwiKTt0aGlzLl9zdGF0ZT0wLHRoaXMuX2hhbmRsZWQ9ITEsdGhpcy5fdmFsdWU9dm9pZCAwLHRoaXMuX2RlZmVycmVkcz1bXSxsKGUsdGhpcyl9ZnVuY3Rpb24gcihlLHQpe2Zvcig7Mz09PWUuX3N0YXRlOyllPWUuX3ZhbHVlO2lmKDA9PT1lLl9zdGF0ZSlyZXR1cm4gdm9pZCBlLl9kZWZlcnJlZHMucHVzaCh0KTtlLl9oYW5kbGVkPSEwLGkuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCl7dmFyIG49MT09PWUuX3N0YXRlP3Qub25GdWxmaWxsZWQ6dC5vblJlamVjdGVkO2lmKG51bGw9PT1uKXJldHVybiB2b2lkKDE9PT1lLl9zdGF0ZT9zOnUpKHQucHJvbWlzZSxlLl92YWx1ZSk7dmFyIG87dHJ5e289bihlLl92YWx1ZSl9Y2F0Y2goZSl7cmV0dXJuIHZvaWQgdSh0LnByb21pc2UsZSl9cyh0LnByb21pc2Usbyl9KX1mdW5jdGlvbiBzKGUsdCl7dHJ5e2lmKHQ9PT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLlwiKTtpZih0JiYoXCJvYmplY3RcIj09dHlwZW9mIHR8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHQpKXt2YXIgbj10LnRoZW47aWYodCBpbnN0YW5jZW9mIGkpcmV0dXJuIGUuX3N0YXRlPTMsZS5fdmFsdWU9dCx2b2lkIGEoZSk7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgbilyZXR1cm4gdm9pZCBsKG8obix0KSxlKX1lLl9zdGF0ZT0xLGUuX3ZhbHVlPXQsYShlKX1jYXRjaCh0KXt1KGUsdCl9fWZ1bmN0aW9uIHUoZSx0KXtlLl9zdGF0ZT0yLGUuX3ZhbHVlPXQsYShlKX1mdW5jdGlvbiBhKGUpezI9PT1lLl9zdGF0ZSYmMD09PWUuX2RlZmVycmVkcy5sZW5ndGgmJmkuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCl7ZS5faGFuZGxlZHx8aS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oZS5fdmFsdWUpfSk7Zm9yKHZhciB0PTAsbj1lLl9kZWZlcnJlZHMubGVuZ3RoO3Q8bjt0KyspcihlLGUuX2RlZmVycmVkc1t0XSk7ZS5fZGVmZXJyZWRzPW51bGx9ZnVuY3Rpb24gYyhlLHQsbil7dGhpcy5vbkZ1bGZpbGxlZD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBlP2U6bnVsbCx0aGlzLm9uUmVqZWN0ZWQ9XCJmdW5jdGlvblwiPT10eXBlb2YgdD90Om51bGwsdGhpcy5wcm9taXNlPW59ZnVuY3Rpb24gbChlLHQpe3ZhciBuPSExO3RyeXtlKGZ1bmN0aW9uKGUpe258fChuPSEwLHModCxlKSl9LGZ1bmN0aW9uKGUpe258fChuPSEwLHUodCxlKSl9KX1jYXRjaChlKXtpZihuKXJldHVybjtuPSEwLHUodCxlKX19dmFyIHA9c2V0VGltZW91dDtpLnByb3RvdHlwZS5jYXRjaD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy50aGVuKG51bGwsZSl9LGkucHJvdG90eXBlLnRoZW49ZnVuY3Rpb24oZSx0KXt2YXIgbz1uZXcgdGhpcy5jb25zdHJ1Y3RvcihuKTtyZXR1cm4gcih0aGlzLG5ldyBjKGUsdCxvKSksb30saS5hbGw9ZnVuY3Rpb24oZSl7dmFyIHQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZSk7cmV0dXJuIG5ldyBpKGZ1bmN0aW9uKGUsbil7ZnVuY3Rpb24gbyhyLHMpe3RyeXtpZihzJiYoXCJvYmplY3RcIj09dHlwZW9mIHN8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHMpKXt2YXIgdT1zLnRoZW47aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdSlyZXR1cm4gdm9pZCB1LmNhbGwocyxmdW5jdGlvbihlKXtvKHIsZSl9LG4pfXRbcl09cywwPT0tLWkmJmUodCl9Y2F0Y2goZSl7bihlKX19aWYoMD09PXQubGVuZ3RoKXJldHVybiBlKFtdKTtmb3IodmFyIGk9dC5sZW5ndGgscj0wO3I8dC5sZW5ndGg7cisrKW8ocix0W3JdKX0pfSxpLnJlc29sdmU9ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwib2JqZWN0XCI9PXR5cGVvZiBlJiZlLmNvbnN0cnVjdG9yPT09aT9lOm5ldyBpKGZ1bmN0aW9uKHQpe3QoZSl9KX0saS5yZWplY3Q9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBpKGZ1bmN0aW9uKHQsbil7bihlKX0pfSxpLnJhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBpKGZ1bmN0aW9uKHQsbil7Zm9yKHZhciBvPTAsaT1lLmxlbmd0aDtvPGk7bysrKWVbb10udGhlbih0LG4pfSl9LGkuX2ltbWVkaWF0ZUZuPVwiZnVuY3Rpb25cIj09dHlwZW9mIHNldEltbWVkaWF0ZSYmZnVuY3Rpb24oZSl7c2V0SW1tZWRpYXRlKGUpfXx8ZnVuY3Rpb24oZSl7cChlLDApfSxpLl91bmhhbmRsZWRSZWplY3Rpb25Gbj1mdW5jdGlvbihlKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgY29uc29sZSYmY29uc29sZSYmY29uc29sZS53YXJuKFwiUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOlwiLGUpfSxpLl9zZXRJbW1lZGlhdGVGbj1mdW5jdGlvbihlKXtpLl9pbW1lZGlhdGVGbj1lfSxpLl9zZXRVbmhhbmRsZWRSZWplY3Rpb25Gbj1mdW5jdGlvbihlKXtpLl91bmhhbmRsZWRSZWplY3Rpb25Gbj1lfSxlLmV4cG9ydHM/ZS5leHBvcnRzPWk6dC5Qcm9taXNlfHwodC5Qcm9taXNlPWkpfSh1KX0pLGM9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5kZXN0aW5hdGlvbj1lLHRoaXMuc291cmNlPXR8fGV9cmV0dXJuIGUucHJvdG90eXBlLmNvbm5lY3Q9ZnVuY3Rpb24oZSl7dGhpcy5zb3VyY2UuY29ubmVjdChlKX0sZS5wcm90b3R5cGUuZGlzY29ubmVjdD1mdW5jdGlvbigpe3RoaXMuc291cmNlLmRpc2Nvbm5lY3QoKX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuZGlzY29ubmVjdCgpLHRoaXMuZGVzdGluYXRpb249bnVsbCx0aGlzLnNvdXJjZT1udWxsfSxlfSgpLGw9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLnNldFBhcmFtVmFsdWU9ZnVuY3Rpb24oZSx0KXtpZihlLnNldFZhbHVlQXRUaW1lKXt2YXIgbj1TLmluc3RhbmNlLmNvbnRleHQ7ZS5zZXRWYWx1ZUF0VGltZSh0LG4uYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKX1lbHNlIGUudmFsdWU9dDtyZXR1cm4gdH0sZX0oKSxwPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxvLGkscixzLHUsYSxjLHAsaCl7dm9pZCAwPT09dCYmKHQ9MCksdm9pZCAwPT09byYmKG89MCksdm9pZCAwPT09aSYmKGk9MCksdm9pZCAwPT09ciYmKHI9MCksdm9pZCAwPT09cyYmKHM9MCksdm9pZCAwPT09dSYmKHU9MCksdm9pZCAwPT09YSYmKGE9MCksdm9pZCAwPT09YyYmKGM9MCksdm9pZCAwPT09cCYmKHA9MCksdm9pZCAwPT09aCYmKGg9MCk7dmFyIGQ9dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChkPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgZj1be2Y6bi5GMzIsdHlwZTpcImxvd3NoZWxmXCIsZ2Fpbjp0fSx7ZjpuLkY2NCx0eXBlOlwicGVha2luZ1wiLGdhaW46b30se2Y6bi5GMTI1LHR5cGU6XCJwZWFraW5nXCIsZ2FpbjppfSx7ZjpuLkYyNTAsdHlwZTpcInBlYWtpbmdcIixnYWluOnJ9LHtmOm4uRjUwMCx0eXBlOlwicGVha2luZ1wiLGdhaW46c30se2Y6bi5GMUssdHlwZTpcInBlYWtpbmdcIixnYWluOnV9LHtmOm4uRjJLLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjphfSx7ZjpuLkY0Syx0eXBlOlwicGVha2luZ1wiLGdhaW46Y30se2Y6bi5GOEssdHlwZTpcInBlYWtpbmdcIixnYWluOnB9LHtmOm4uRjE2Syx0eXBlOlwiaGlnaHNoZWxmXCIsZ2FpbjpofV0ubWFwKGZ1bmN0aW9uKGUpe3ZhciB0PVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7cmV0dXJuIHQudHlwZT1lLnR5cGUsbC5zZXRQYXJhbVZhbHVlKHQuZ2FpbixlLmdhaW4pLGwuc2V0UGFyYW1WYWx1ZSh0LlEsMSksbC5zZXRQYXJhbVZhbHVlKHQuZnJlcXVlbmN5LGUuZiksdH0pOyhkPWUuY2FsbCh0aGlzLGZbMF0sZltmLmxlbmd0aC0xXSl8fHRoaXMpLmJhbmRzPWYsZC5iYW5kc01hcD17fTtmb3IodmFyIF89MDtfPGQuYmFuZHMubGVuZ3RoO18rKyl7dmFyIHk9ZC5iYW5kc1tfXTtfPjAmJmQuYmFuZHNbXy0xXS5jb25uZWN0KHkpLGQuYmFuZHNNYXBbeS5mcmVxdWVuY3kudmFsdWVdPXl9cmV0dXJuIGR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5zZXRHYWluPWZ1bmN0aW9uKGUsdCl7aWYodm9pZCAwPT09dCYmKHQ9MCksIXRoaXMuYmFuZHNNYXBbZV0pdGhyb3dcIk5vIGJhbmQgZm91bmQgZm9yIGZyZXF1ZW5jeSBcIitlO2wuc2V0UGFyYW1WYWx1ZSh0aGlzLmJhbmRzTWFwW2VdLmdhaW4sdCl9LG4ucHJvdG90eXBlLmdldEdhaW49ZnVuY3Rpb24oZSl7aWYoIXRoaXMuYmFuZHNNYXBbZV0pdGhyb3dcIk5vIGJhbmQgZm91bmQgZm9yIGZyZXF1ZW5jeSBcIitlO3JldHVybiB0aGlzLmJhbmRzTWFwW2VdLmdhaW4udmFsdWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYzMlwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjMyKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYzMixlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmNjRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY2NCl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GNjQsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjEyNVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjEyNSl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMTI1LGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYyNTBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYyNTApfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjI1MCxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmNTAwXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GNTAwKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY1MDAsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjFrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMUspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjFLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYya1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjJLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYySyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmNGtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY0Syl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GNEssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjhrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GOEspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjhLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYxNmtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYxNkspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjE2SyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuYmFuZHMuZm9yRWFjaChmdW5jdGlvbihlKXtsLnNldFBhcmFtVmFsdWUoZS5nYWluLDApfSl9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmJhbmRzLmZvckVhY2goZnVuY3Rpb24oZSl7ZS5kaXNjb25uZWN0KCl9KSx0aGlzLmJhbmRzPW51bGwsdGhpcy5iYW5kc01hcD1udWxsfSxuLkYzMj0zMixuLkY2ND02NCxuLkYxMjU9MTI1LG4uRjI1MD0yNTAsbi5GNTAwPTUwMCxuLkYxSz0xZTMsbi5GMks9MmUzLG4uRjRLPTRlMyxuLkY4Sz04ZTMsbi5GMTZLPTE2ZTMsbn0oYyksaD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZvaWQgMD09PXQmJih0PTApO3ZhciBuPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQobj1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIG89Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVXYXZlU2hhcGVyKCk7cmV0dXJuIG49ZS5jYWxsKHRoaXMsbyl8fHRoaXMsbi5fZGlzdG9ydGlvbj1vLG4uYW1vdW50PXQsbn1yZXR1cm4gdChuLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImFtb3VudFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYW1vdW50fSxzZXQ6ZnVuY3Rpb24oZSl7ZSo9MWUzLHRoaXMuX2Ftb3VudD1lO2Zvcih2YXIgdCxuPW5ldyBGbG9hdDMyQXJyYXkoNDQxMDApLG89TWF0aC5QSS8xODAsaT0wO2k8NDQxMDA7KytpKXQ9MippLzQ0MTAwLTEsbltpXT0oMytlKSp0KjIwKm8vKE1hdGguUEkrZSpNYXRoLmFicyh0KSk7dGhpcy5fZGlzdG9ydGlvbi5jdXJ2ZT1uLHRoaXMuX2Rpc3RvcnRpb24ub3ZlcnNhbXBsZT1cIjR4XCJ9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX2Rpc3RvcnRpb249bnVsbCxlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyl9LG59KGMpLGQ9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2b2lkIDA9PT10JiYodD0wKTt2YXIgbj10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKG49ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBvLGkscixzPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQ7cmV0dXJuIHMuY3JlYXRlU3RlcmVvUGFubmVyP3I9bz1zLmNyZWF0ZVN0ZXJlb1Bhbm5lcigpOigoaT1zLmNyZWF0ZVBhbm5lcigpKS5wYW5uaW5nTW9kZWw9XCJlcXVhbHBvd2VyXCIscj1pKSxuPWUuY2FsbCh0aGlzLHIpfHx0aGlzLG4uX3N0ZXJlbz1vLG4uX3Bhbm5lcj1pLG4ucGFuPXQsbn1yZXR1cm4gdChuLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGFufSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGFuPWUsdGhpcy5fc3RlcmVvP2wuc2V0UGFyYW1WYWx1ZSh0aGlzLl9zdGVyZW8ucGFuLGUpOnRoaXMuX3Bhbm5lci5zZXRQb3NpdGlvbihlLDAsMS1NYXRoLmFicyhlKSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2UucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKSx0aGlzLl9zdGVyZW89bnVsbCx0aGlzLl9wYW5uZXI9bnVsbH0sbn0oYyksZj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQsbixvKXt2b2lkIDA9PT10JiYodD0zKSx2b2lkIDA9PT1uJiYobj0yKSx2b2lkIDA9PT1vJiYobz0hMSk7dmFyIGk9dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChpPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgcj1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUNvbnZvbHZlcigpO3JldHVybiBpPWUuY2FsbCh0aGlzLHIpfHx0aGlzLGkuX2NvbnZvbHZlcj1yLGkuX3NlY29uZHM9aS5fY2xhbXAodCwxLDUwKSxpLl9kZWNheT1pLl9jbGFtcChuLDAsMTAwKSxpLl9yZXZlcnNlPW8saS5fcmVidWlsZCgpLGl9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5fY2xhbXA9ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBNYXRoLm1pbihuLE1hdGgubWF4KHQsZSkpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzZWNvbmRzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zZWNvbmRzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc2Vjb25kcz10aGlzLl9jbGFtcChlLDEsNTApLHRoaXMuX3JlYnVpbGQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJkZWNheVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGVjYXl9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9kZWNheT10aGlzLl9jbGFtcChlLDAsMTAwKSx0aGlzLl9yZWJ1aWxkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicmV2ZXJzZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmV2ZXJzZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3JldmVyc2U9ZSx0aGlzLl9yZWJ1aWxkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuX3JlYnVpbGQ9ZnVuY3Rpb24oKXtmb3IodmFyIGUsdD1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LG49dC5zYW1wbGVSYXRlLG89bip0aGlzLl9zZWNvbmRzLGk9dC5jcmVhdGVCdWZmZXIoMixvLG4pLHI9aS5nZXRDaGFubmVsRGF0YSgwKSxzPWkuZ2V0Q2hhbm5lbERhdGEoMSksdT0wO3U8bzt1KyspZT10aGlzLl9yZXZlcnNlP28tdTp1LHJbdV09KDIqTWF0aC5yYW5kb20oKS0xKSpNYXRoLnBvdygxLWUvbyx0aGlzLl9kZWNheSksc1t1XT0oMipNYXRoLnJhbmRvbSgpLTEpKk1hdGgucG93KDEtZS9vLHRoaXMuX2RlY2F5KTt0aGlzLl9jb252b2x2ZXIuYnVmZmVyPWl9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9jb252b2x2ZXI9bnVsbCxlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyl9LG59KGMpLF89ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3ZhciB0PXRoaXM7Uy5pbnN0YW5jZS51c2VMZWdhY3kmJih0PWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgbj1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LG89bi5jcmVhdGVDaGFubmVsU3BsaXR0ZXIoKSxpPW4uY3JlYXRlQ2hhbm5lbE1lcmdlcigpO3JldHVybiBpLmNvbm5lY3QobyksdD1lLmNhbGwodGhpcyxpLG8pfHx0aGlzLHQuX21lcmdlcj1pLHR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fbWVyZ2VyLmRpc2Nvbm5lY3QoKSx0aGlzLl9tZXJnZXI9bnVsbCxlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyl9LG59KGMpLHk9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKGUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgdD1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LG49dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxvPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCksaT10LmNyZWF0ZUJpcXVhZEZpbHRlcigpLHI9dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtyZXR1cm4gbi50eXBlPVwibG93cGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShuLmZyZXF1ZW5jeSwyZTMpLG8udHlwZT1cImxvd3Bhc3NcIixsLnNldFBhcmFtVmFsdWUoby5mcmVxdWVuY3ksMmUzKSxpLnR5cGU9XCJoaWdocGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShpLmZyZXF1ZW5jeSw1MDApLHIudHlwZT1cImhpZ2hwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKHIuZnJlcXVlbmN5LDUwMCksbi5jb25uZWN0KG8pLG8uY29ubmVjdChpKSxpLmNvbm5lY3QociksZS5jYWxsKHRoaXMsbixyKXx8dGhpc31yZXR1cm4gdChuLGUpLG59KGMpLG09T2JqZWN0LmZyZWV6ZSh7RmlsdGVyOmMsRXF1YWxpemVyRmlsdGVyOnAsRGlzdG9ydGlvbkZpbHRlcjpoLFN0ZXJlb0ZpbHRlcjpkLFJldmVyYkZpbHRlcjpmLE1vbm9GaWx0ZXI6XyxUZWxlcGhvbmVGaWx0ZXI6eX0pLGI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3ZhciB0PWUuY2FsbCh0aGlzKXx8dGhpcztyZXR1cm4gdC5zcGVlZD0xLHQudm9sdW1lPTEsdC5tdXRlZD0hMSx0LnBhdXNlZD0hMSx0fXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3RoaXMuZW1pdChcInJlZnJlc2hcIil9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJyZWZyZXNoUGF1c2VkXCIpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgZmlsdGVyc1wiKSxudWxsfSxzZXQ6ZnVuY3Rpb24oZSl7Y29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGZpbHRlcnNcIil9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiYXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiBjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgYXVkaW9Db250ZXh0XCIpLG51bGx9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUudG9nZ2xlTXV0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLm11dGVkPSF0aGlzLm11dGVkLHRoaXMucmVmcmVzaCgpLHRoaXMubXV0ZWR9LG4ucHJvdG90eXBlLnRvZ2dsZVBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF1c2VkPSF0aGlzLnBhdXNlZCx0aGlzLnJlZnJlc2hQYXVzZWQoKSx0aGlzLnBhdXNlZH0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCl9LG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSxnPU9iamVjdC5mcmVlemUoe0hUTUxBdWRpb01lZGlhOnMsSFRNTEF1ZGlvSW5zdGFuY2U6cixIVE1MQXVkaW9Db250ZXh0OmJ9KSx2PTAsUD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZhciBuPWUuY2FsbCh0aGlzKXx8dGhpcztyZXR1cm4gbi5pZD12Kyssbi5fbWVkaWE9bnVsbCxuLl9wYXVzZWQ9ITEsbi5fbXV0ZWQ9ITEsbi5fZWxhcHNlZD0wLG4uX3VwZGF0ZUxpc3RlbmVyPW4uX3VwZGF0ZS5iaW5kKG4pLG4uaW5pdCh0KSxufXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmKHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInN0b3BcIikpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzcGVlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zcGVlZD1lLHRoaXMucmVmcmVzaCgpLHRoaXMuX3VwZGF0ZSghMCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwidm9sdW1lXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl92b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl92b2x1bWU9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJtdXRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbXV0ZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9tdXRlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImxvb3BcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xvb3B9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9sb29wPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQ7dGhpcy5fc291cmNlLmxvb3A9dGhpcy5fbG9vcHx8dC5sb29wO3ZhciBuPWUudm9sdW1lKihlLm11dGVkPzA6MSksbz10LnZvbHVtZSoodC5tdXRlZD8wOjEpLGk9dGhpcy5fdm9sdW1lKih0aGlzLl9tdXRlZD8wOjEpO2wuc2V0UGFyYW1WYWx1ZSh0aGlzLl9nYWluLmdhaW4saSpvKm4pLGwuc2V0UGFyYW1WYWx1ZSh0aGlzLl9zb3VyY2UucGxheWJhY2tSYXRlLHRoaXMuX3NwZWVkKnQuc3BlZWQqZS5zcGVlZCl9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50LG49dGhpcy5fcGF1c2VkfHx0LnBhdXNlZHx8ZS5wYXVzZWQ7biE9PXRoaXMuX3BhdXNlZFJlYWwmJih0aGlzLl9wYXVzZWRSZWFsPW4sbj8odGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwicGF1c2VkXCIpKToodGhpcy5lbWl0KFwicmVzdW1lZFwiKSx0aGlzLnBsYXkoe3N0YXJ0OnRoaXMuX2VsYXBzZWQldGhpcy5fZHVyYXRpb24sZW5kOnRoaXMuX2VuZCxzcGVlZDp0aGlzLl9zcGVlZCxsb29wOnRoaXMuX2xvb3Asdm9sdW1lOnRoaXMuX3ZvbHVtZX0pKSx0aGlzLmVtaXQoXCJwYXVzZVwiLG4pKX0sbi5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlKXt2YXIgdD1lLnN0YXJ0LG49ZS5lbmQsbz1lLnNwZWVkLGk9ZS5sb29wLHI9ZS52b2x1bWUscz1lLm11dGVkO24mJmNvbnNvbGUuYXNzZXJ0KG4+dCxcIkVuZCB0aW1lIGlzIGJlZm9yZSBzdGFydCB0aW1lXCIpLHRoaXMuX3BhdXNlZD0hMTt2YXIgdT10aGlzLl9tZWRpYS5ub2Rlcy5jbG9uZUJ1ZmZlclNvdXJjZSgpLGE9dS5zb3VyY2UsYz11LmdhaW47dGhpcy5fc291cmNlPWEsdGhpcy5fZ2Fpbj1jLHRoaXMuX3NwZWVkPW8sdGhpcy5fdm9sdW1lPXIsdGhpcy5fbG9vcD0hIWksdGhpcy5fbXV0ZWQ9cyx0aGlzLnJlZnJlc2goKSx0aGlzLmxvb3AmJm51bGwhPT1uJiYoY29uc29sZS53YXJuKCdMb29waW5nIG5vdCBzdXBwb3J0IHdoZW4gc3BlY2lmeWluZyBhbiBcImVuZFwiIHRpbWUnKSx0aGlzLmxvb3A9ITEpLHRoaXMuX2VuZD1uO3ZhciBsPXRoaXMuX3NvdXJjZS5idWZmZXIuZHVyYXRpb247dGhpcy5fZHVyYXRpb249bCx0aGlzLl9sYXN0VXBkYXRlPXRoaXMuX25vdygpLHRoaXMuX2VsYXBzZWQ9dCx0aGlzLl9zb3VyY2Uub25lbmRlZD10aGlzLl9vbkNvbXBsZXRlLmJpbmQodGhpcyksbj90aGlzLl9zb3VyY2Uuc3RhcnQoMCx0LG4tdCk6dGhpcy5fc291cmNlLnN0YXJ0KDAsdCksdGhpcy5lbWl0KFwic3RhcnRcIiksdGhpcy5fdXBkYXRlKCEwKSx0aGlzLl9lbmFibGVkPSEwfSxuLnByb3RvdHlwZS5fdG9TZWM9ZnVuY3Rpb24oZSl7cmV0dXJuIGU+MTAmJihlLz0xZTMpLGV8fDB9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIl9lbmFibGVkXCIse3NldDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLl9tZWRpYS5ub2Rlcy5zY3JpcHQ7dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYXVkaW9wcm9jZXNzXCIsdGhpcy5fdXBkYXRlTGlzdGVuZXIpLGUmJnQuYWRkRXZlbnRMaXN0ZW5lcihcImF1ZGlvcHJvY2Vzc1wiLHRoaXMuX3VwZGF0ZUxpc3RlbmVyKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwcm9ncmVzc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcHJvZ3Jlc3N9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYXVzZWQ9ZSx0aGlzLnJlZnJlc2hQYXVzZWQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLl9zb3VyY2UmJih0aGlzLl9zb3VyY2UuZGlzY29ubmVjdCgpLHRoaXMuX3NvdXJjZT1udWxsKSx0aGlzLl9nYWluJiYodGhpcy5fZ2Fpbi5kaXNjb25uZWN0KCksdGhpcy5fZ2Fpbj1udWxsKSx0aGlzLl9tZWRpYSYmKHRoaXMuX21lZGlhLmNvbnRleHQuZXZlbnRzLm9mZihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksdGhpcy5fbWVkaWEuY29udGV4dC5ldmVudHMub2ZmKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKSx0aGlzLl9tZWRpYT1udWxsKSx0aGlzLl9lbmQ9bnVsbCx0aGlzLl9zcGVlZD0xLHRoaXMuX3ZvbHVtZT0xLHRoaXMuX2xvb3A9ITEsdGhpcy5fZWxhcHNlZD0wLHRoaXMuX2R1cmF0aW9uPTAsdGhpcy5fcGF1c2VkPSExLHRoaXMuX211dGVkPSExLHRoaXMuX3BhdXNlZFJlYWw9ITF9LG4ucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJbV2ViQXVkaW9JbnN0YW5jZSBpZD1cIit0aGlzLmlkK1wiXVwifSxuLnByb3RvdHlwZS5fbm93PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX21lZGlhLmNvbnRleHQuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lfSxuLnByb3RvdHlwZS5fdXBkYXRlPWZ1bmN0aW9uKGUpe2lmKHZvaWQgMD09PWUmJihlPSExKSx0aGlzLl9zb3VyY2Upe3ZhciB0PXRoaXMuX25vdygpLG49dC10aGlzLl9sYXN0VXBkYXRlO2lmKG4+MHx8ZSl7dmFyIG89dGhpcy5fc291cmNlLnBsYXliYWNrUmF0ZS52YWx1ZTt0aGlzLl9lbGFwc2VkKz1uKm8sdGhpcy5fbGFzdFVwZGF0ZT10O3ZhciBpPXRoaXMuX2R1cmF0aW9uLHI9dGhpcy5fZWxhcHNlZCVpL2k7dGhpcy5fcHJvZ3Jlc3M9cix0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLHRoaXMuX3Byb2dyZXNzLGkpfX19LG4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5fbWVkaWE9ZSxlLmNvbnRleHQuZXZlbnRzLm9uKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSxlLmNvbnRleHQuZXZlbnRzLm9uKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKX0sbi5wcm90b3R5cGUuX2ludGVybmFsU3RvcD1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmKHRoaXMuX2VuYWJsZWQ9ITEsdGhpcy5fc291cmNlLm9uZW5kZWQ9bnVsbCx0aGlzLl9zb3VyY2Uuc3RvcCgpLHRoaXMuX3NvdXJjZT1udWxsKX0sbi5wcm90b3R5cGUuX29uQ29tcGxldGU9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJih0aGlzLl9lbmFibGVkPSExLHRoaXMuX3NvdXJjZS5vbmVuZGVkPW51bGwpLHRoaXMuX3NvdXJjZT1udWxsLHRoaXMuX3Byb2dyZXNzPTEsdGhpcy5lbWl0KFwicHJvZ3Jlc3NcIiwxLHRoaXMuX2R1cmF0aW9uKSx0aGlzLmVtaXQoXCJlbmRcIix0aGlzKX0sbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLHg9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2YXIgbz10aGlzLGk9dC5hdWRpb0NvbnRleHQscj1pLmNyZWF0ZUJ1ZmZlclNvdXJjZSgpLHM9aS5jcmVhdGVTY3JpcHRQcm9jZXNzb3Iobi5CVUZGRVJfU0laRSksdT1pLmNyZWF0ZUdhaW4oKSxhPWkuY3JlYXRlQW5hbHlzZXIoKTtyZXR1cm4gci5jb25uZWN0KGEpLGEuY29ubmVjdCh1KSx1LmNvbm5lY3QodC5kZXN0aW5hdGlvbikscy5jb25uZWN0KHQuZGVzdGluYXRpb24pLG89ZS5jYWxsKHRoaXMsYSx1KXx8dGhpcyxvLmNvbnRleHQ9dCxvLmJ1ZmZlclNvdXJjZT1yLG8uc2NyaXB0PXMsby5nYWluPXUsby5hbmFseXNlcj1hLG99cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7ZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpLHRoaXMuYnVmZmVyU291cmNlLmRpc2Nvbm5lY3QoKSx0aGlzLnNjcmlwdC5kaXNjb25uZWN0KCksdGhpcy5nYWluLmRpc2Nvbm5lY3QoKSx0aGlzLmFuYWx5c2VyLmRpc2Nvbm5lY3QoKSx0aGlzLmJ1ZmZlclNvdXJjZT1udWxsLHRoaXMuc2NyaXB0PW51bGwsdGhpcy5nYWluPW51bGwsdGhpcy5hbmFseXNlcj1udWxsLHRoaXMuY29udGV4dD1udWxsfSxuLnByb3RvdHlwZS5jbG9uZUJ1ZmZlclNvdXJjZT1mdW5jdGlvbigpe3ZhciBlPXRoaXMuYnVmZmVyU291cmNlLHQ9dGhpcy5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTt0LmJ1ZmZlcj1lLmJ1ZmZlcixsLnNldFBhcmFtVmFsdWUodC5wbGF5YmFja1JhdGUsZS5wbGF5YmFja1JhdGUudmFsdWUpLHQubG9vcD1lLmxvb3A7dmFyIG49dGhpcy5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7cmV0dXJuIHQuY29ubmVjdChuKSxuLmNvbm5lY3QodGhpcy5kZXN0aW5hdGlvbikse3NvdXJjZTp0LGdhaW46bn19LG4uQlVGRkVSX1NJWkU9MjU2LG59KG4pLE89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMucGFyZW50PWUsdGhpcy5fbm9kZXM9bmV3IHgodGhpcy5jb250ZXh0KSx0aGlzLl9zb3VyY2U9dGhpcy5fbm9kZXMuYnVmZmVyU291cmNlLHRoaXMuc291cmNlPWUub3B0aW9ucy5zb3VyY2V9LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnBhcmVudD1udWxsLHRoaXMuX25vZGVzLmRlc3Ryb3koKSx0aGlzLl9ub2Rlcz1udWxsLHRoaXMuX3NvdXJjZT1udWxsLHRoaXMuc291cmNlPW51bGx9LGUucHJvdG90eXBlLmNyZWF0ZT1mdW5jdGlvbigpe3JldHVybiBuZXcgUCh0aGlzKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXJlbnQuY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJpc1BsYXlhYmxlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiEhdGhpcy5fc291cmNlJiYhIXRoaXMuX3NvdXJjZS5idWZmZXJ9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbm9kZXMuZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX25vZGVzLmZpbHRlcnM9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJkdXJhdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY29uc29sZS5hc3NlcnQodGhpcy5pc1BsYXlhYmxlLFwiU291bmQgbm90IHlldCBwbGF5YWJsZSwgbm8gZHVyYXRpb25cIiksdGhpcy5fc291cmNlLmJ1ZmZlci5kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJidWZmZXJcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZS5idWZmZXJ9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zb3VyY2UuYnVmZmVyPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwibm9kZXNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX25vZGVzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oZSl7dGhpcy5zb3VyY2U/dGhpcy5fZGVjb2RlKHRoaXMuc291cmNlLGUpOnRoaXMucGFyZW50LnVybD90aGlzLl9sb2FkVXJsKGUpOmU/ZShuZXcgRXJyb3IoXCJzb3VuZC51cmwgb3Igc291bmQuc291cmNlIG11c3QgYmUgc2V0XCIpKTpjb25zb2xlLmVycm9yKFwic291bmQudXJsIG9yIHNvdW5kLnNvdXJjZSBtdXN0IGJlIHNldFwiKX0sZS5wcm90b3R5cGUuX2xvYWRVcmw9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxuPW5ldyBYTUxIdHRwUmVxdWVzdCxvPXRoaXMucGFyZW50LnVybDtuLm9wZW4oXCJHRVRcIixvLCEwKSxuLnJlc3BvbnNlVHlwZT1cImFycmF5YnVmZmVyXCIsbi5vbmxvYWQ9ZnVuY3Rpb24oKXt0LnNvdXJjZT1uLnJlc3BvbnNlLHQuX2RlY29kZShuLnJlc3BvbnNlLGUpfSxuLnNlbmQoKX0sZS5wcm90b3R5cGUuX2RlY29kZT1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXM7dGhpcy5wYXJlbnQuY29udGV4dC5kZWNvZGUoZSxmdW5jdGlvbihlLG8pe2lmKGUpdCYmdChlKTtlbHNle24ucGFyZW50LmlzTG9hZGVkPSEwLG4uYnVmZmVyPW87dmFyIGk9bi5wYXJlbnQuYXV0b1BsYXlTdGFydCgpO3QmJnQobnVsbCxuLnBhcmVudCxpKX19KX0sZX0oKSx3PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5yZXNvbHZlVXJsPWZ1bmN0aW9uKHQpe3ZhciBuPWUuRk9STUFUX1BBVFRFUk4sbz1cInN0cmluZ1wiPT10eXBlb2YgdD90OnQudXJsO2lmKG4udGVzdChvKSl7Zm9yKHZhciBpPW4uZXhlYyhvKSxyPWlbMl0uc3BsaXQoXCIsXCIpLHM9cltyLmxlbmd0aC0xXSx1PTAsYT1yLmxlbmd0aDt1PGE7dSsrKXt2YXIgYz1yW3VdO2lmKGUuc3VwcG9ydGVkW2NdKXtzPWM7YnJlYWt9fXZhciBsPW8ucmVwbGFjZShpWzFdLHMpO3JldHVyblwic3RyaW5nXCIhPXR5cGVvZiB0JiYodC5leHRlbnNpb249cyx0LnVybD1sKSxsfXJldHVybiBvfSxlLnNpbmVUb25lPWZ1bmN0aW9uKGUsdCl7dm9pZCAwPT09ZSYmKGU9MjAwKSx2b2lkIDA9PT10JiYodD0xKTt2YXIgbj1JLmZyb20oe3NpbmdsZUluc3RhbmNlOiEwfSk7aWYoIShuLm1lZGlhIGluc3RhbmNlb2YgTykpcmV0dXJuIG47Zm9yKHZhciBvPW4ubWVkaWEsaT1uLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLDQ4ZTMqdCw0OGUzKSxyPWkuZ2V0Q2hhbm5lbERhdGEoMCkscz0wO3M8ci5sZW5ndGg7cysrKXt2YXIgdT1lKihzL2kuc2FtcGxlUmF0ZSkqTWF0aC5QSTtyW3NdPTIqTWF0aC5zaW4odSl9cmV0dXJuIG8uYnVmZmVyPWksbi5pc0xvYWRlZD0hMCxufSxlLnJlbmRlcj1mdW5jdGlvbihlLHQpe3ZhciBuPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7dD1PYmplY3QuYXNzaWduKHt3aWR0aDo1MTIsaGVpZ2h0OjEyOCxmaWxsOlwiYmxhY2tcIn0sdHx8e30pLG4ud2lkdGg9dC53aWR0aCxuLmhlaWdodD10LmhlaWdodDt2YXIgbz1QSVhJLkJhc2VUZXh0dXJlLmZyb21DYW52YXMobik7aWYoIShlLm1lZGlhIGluc3RhbmNlb2YgTykpcmV0dXJuIG87dmFyIGk9ZS5tZWRpYTtjb25zb2xlLmFzc2VydCghIWkuYnVmZmVyLFwiTm8gYnVmZmVyIGZvdW5kLCBsb2FkIGZpcnN0XCIpO3ZhciByPW4uZ2V0Q29udGV4dChcIjJkXCIpO3IuZmlsbFN0eWxlPXQuZmlsbDtmb3IodmFyIHM9aS5idWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCksdT1NYXRoLmNlaWwocy5sZW5ndGgvdC53aWR0aCksYT10LmhlaWdodC8yLGM9MDtjPHQud2lkdGg7YysrKXtmb3IodmFyIGw9MSxwPS0xLGg9MDtoPHU7aCsrKXt2YXIgZD1zW2MqdStoXTtkPGwmJihsPWQpLGQ+cCYmKHA9ZCl9ci5maWxsUmVjdChjLCgxK2wpKmEsMSxNYXRoLm1heCgxLChwLWwpKmEpKX1yZXR1cm4gb30sZS5wbGF5T25jZT1mdW5jdGlvbih0LG4pe3ZhciBvPVwiYWxpYXNcIitlLlBMQVlfSUQrKztyZXR1cm4gUy5pbnN0YW5jZS5hZGQobyx7dXJsOnQscHJlbG9hZDohMCxhdXRvUGxheTohMCxsb2FkZWQ6ZnVuY3Rpb24oZSl7ZSYmKGNvbnNvbGUuZXJyb3IoZSksUy5pbnN0YW5jZS5yZW1vdmUobyksbiYmbihlKSl9LGNvbXBsZXRlOmZ1bmN0aW9uKCl7Uy5pbnN0YW5jZS5yZW1vdmUobyksbiYmbihudWxsKX19KSxvfSxlLlBMQVlfSUQ9MCxlLkZPUk1BVF9QQVRURVJOPS9cXC4oXFx7KFteXFx9XSspXFx9KShcXD8uKik/JC8sZS5leHRlbnNpb25zPVtcIm1wM1wiLFwib2dnXCIsXCJvZ2FcIixcIm9wdXNcIixcIm1wZWdcIixcIndhdlwiLFwibTRhXCIsXCJtcDRcIixcImFpZmZcIixcIndtYVwiLFwibWlkXCJdLGUuc3VwcG9ydGVkPWZ1bmN0aW9uKCl7dmFyIHQ9e200YTpcIm1wNFwiLG9nYTpcIm9nZ1wifSxuPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKSxvPXt9O3JldHVybiBlLmV4dGVuc2lvbnMuZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgaT10W2VdfHxlLHI9bi5jYW5QbGF5VHlwZShcImF1ZGlvL1wiK2UpLnJlcGxhY2UoL15ubyQvLFwiXCIpLHM9bi5jYW5QbGF5VHlwZShcImF1ZGlvL1wiK2kpLnJlcGxhY2UoL15ubyQvLFwiXCIpO29bZV09ISFyfHwhIXN9KSxPYmplY3QuZnJlZXplKG8pfSgpLGV9KCksaj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQsbil7dmFyIG89ZS5jYWxsKHRoaXMsdCxuKXx8dGhpcztyZXR1cm4gby51c2UoQS5wbHVnaW4pLG8ucHJlKEEucmVzb2x2ZSksb31yZXR1cm4gdChuLGUpLG4uYWRkUGl4aU1pZGRsZXdhcmU9ZnVuY3Rpb24odCl7ZS5hZGRQaXhpTWlkZGxld2FyZS5jYWxsKHRoaXMsdCl9LG59KFBJWEkubG9hZGVycy5Mb2FkZXIpLEE9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLmluc3RhbGw9ZnVuY3Rpb24odCl7ZS5fc291bmQ9dCxlLmxlZ2FjeT10LnVzZUxlZ2FjeSxQSVhJLmxvYWRlcnMuTG9hZGVyPWosUElYSS5sb2FkZXIudXNlKGUucGx1Z2luKSxQSVhJLmxvYWRlci5wcmUoZS5yZXNvbHZlKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJsZWdhY3lcIix7c2V0OmZ1bmN0aW9uKGUpe3ZhciB0PVBJWEkubG9hZGVycy5SZXNvdXJjZSxuPXcuZXh0ZW5zaW9ucztlP24uZm9yRWFjaChmdW5jdGlvbihlKXt0LnNldEV4dGVuc2lvblhoclR5cGUoZSx0LlhIUl9SRVNQT05TRV9UWVBFLkRFRkFVTFQpLHQuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZSx0LkxPQURfVFlQRS5BVURJTyl9KTpuLmZvckVhY2goZnVuY3Rpb24oZSl7dC5zZXRFeHRlbnNpb25YaHJUeXBlKGUsdC5YSFJfUkVTUE9OU0VfVFlQRS5CVUZGRVIpLHQuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZSx0LkxPQURfVFlQRS5YSFIpfSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5yZXNvbHZlPWZ1bmN0aW9uKGUsdCl7dy5yZXNvbHZlVXJsKGUpLHQoKX0sZS5wbHVnaW49ZnVuY3Rpb24odCxuKXt0LmRhdGEmJncuZXh0ZW5zaW9ucy5pbmRleE9mKHQuZXh0ZW5zaW9uKT4tMT90LnNvdW5kPWUuX3NvdW5kLmFkZCh0Lm5hbWUse2xvYWRlZDpuLHByZWxvYWQ6ITAsdXJsOnQudXJsLHNvdXJjZTp0LmRhdGF9KTpuKCl9LGV9KCksRj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLnBhcmVudD1lLE9iamVjdC5hc3NpZ24odGhpcyx0KSx0aGlzLmR1cmF0aW9uPXRoaXMuZW5kLXRoaXMuc3RhcnQsY29uc29sZS5hc3NlcnQodGhpcy5kdXJhdGlvbj4wLFwiRW5kIHRpbWUgbXVzdCBiZSBhZnRlciBzdGFydCB0aW1lXCIpfXJldHVybiBlLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnBhcmVudC5wbGF5KE9iamVjdC5hc3NpZ24oe2NvbXBsZXRlOmUsc3BlZWQ6dGhpcy5zcGVlZHx8dGhpcy5wYXJlbnQuc3BlZWQsZW5kOnRoaXMuZW5kLHN0YXJ0OnRoaXMuc3RhcnR9KSl9LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnBhcmVudD1udWxsfSxlfSgpLEU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3ZhciB0PXRoaXMsbz1uZXcgbi5BdWRpb0NvbnRleHQsaT1vLmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpLHI9by5jcmVhdGVBbmFseXNlcigpO3JldHVybiByLmNvbm5lY3QoaSksaS5jb25uZWN0KG8uZGVzdGluYXRpb24pLHQ9ZS5jYWxsKHRoaXMscixpKXx8dGhpcyx0Ll9jdHg9byx0Ll9vZmZsaW5lQ3R4PW5ldyBuLk9mZmxpbmVBdWRpb0NvbnRleHQoMSwyLG8uc2FtcGxlUmF0ZSksdC5fdW5sb2NrZWQ9ITEsdC5jb21wcmVzc29yPWksdC5hbmFseXNlcj1yLHQuZXZlbnRzPW5ldyBQSVhJLnV0aWxzLkV2ZW50RW1pdHRlcix0LnZvbHVtZT0xLHQuc3BlZWQ9MSx0Lm11dGVkPSExLHQucGF1c2VkPSExLFwib250b3VjaHN0YXJ0XCJpbiB3aW5kb3cmJlwicnVubmluZ1wiIT09by5zdGF0ZSYmKHQuX3VubG9jaygpLHQuX3VubG9jaz10Ll91bmxvY2suYmluZCh0KSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsdC5fdW5sb2NrLCEwKSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLHQuX3VubG9jaywhMCksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsdC5fdW5sb2NrLCEwKSksdH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLl91bmxvY2s9ZnVuY3Rpb24oKXt0aGlzLl91bmxvY2tlZHx8KHRoaXMucGxheUVtcHR5U291bmQoKSxcInJ1bm5pbmdcIj09PXRoaXMuX2N0eC5zdGF0ZSYmKGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIix0aGlzLl91bmxvY2ssITApLGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLHRoaXMuX3VubG9jaywhMCksZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIix0aGlzLl91bmxvY2ssITApLHRoaXMuX3VubG9ja2VkPSEwKSl9LG4ucHJvdG90eXBlLnBsYXlFbXB0eVNvdW5kPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO2UuYnVmZmVyPXRoaXMuX2N0eC5jcmVhdGVCdWZmZXIoMSwxLDIyMDUwKSxlLmNvbm5lY3QodGhpcy5fY3R4LmRlc3RpbmF0aW9uKSxlLnN0YXJ0KDAsMCwwKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJBdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7dmFyIGU9d2luZG93O3JldHVybiBlLkF1ZGlvQ29udGV4dHx8ZS53ZWJraXRBdWRpb0NvbnRleHR8fG51bGx9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJPZmZsaW5lQXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3ZhciBlPXdpbmRvdztyZXR1cm4gZS5PZmZsaW5lQXVkaW9Db250ZXh0fHxlLndlYmtpdE9mZmxpbmVBdWRpb0NvbnRleHR8fG51bGx9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2UucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKTt2YXIgdD10aGlzLl9jdHg7dm9pZCAwIT09dC5jbG9zZSYmdC5jbG9zZSgpLHRoaXMuZXZlbnRzLnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMuYW5hbHlzZXIuZGlzY29ubmVjdCgpLHRoaXMuY29tcHJlc3Nvci5kaXNjb25uZWN0KCksdGhpcy5hbmFseXNlcj1udWxsLHRoaXMuY29tcHJlc3Nvcj1udWxsLHRoaXMuZXZlbnRzPW51bGwsdGhpcy5fb2ZmbGluZUN0eD1udWxsLHRoaXMuX2N0eD1udWxsfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJhdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2N0eH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJvZmZsaW5lQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fb2ZmbGluZUN0eH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe2UmJlwicnVubmluZ1wiPT09dGhpcy5fY3R4LnN0YXRlP3RoaXMuX2N0eC5zdXNwZW5kKCk6ZXx8XCJzdXNwZW5kZWRcIiE9PXRoaXMuX2N0eC5zdGF0ZXx8dGhpcy5fY3R4LnJlc3VtZSgpLHRoaXMuX3BhdXNlZD1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt0aGlzLmV2ZW50cy5lbWl0KFwicmVmcmVzaFwiKX0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3RoaXMuZXZlbnRzLmVtaXQoXCJyZWZyZXNoUGF1c2VkXCIpfSxuLnByb3RvdHlwZS50b2dnbGVNdXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubXV0ZWQ9IXRoaXMubXV0ZWQsdGhpcy5yZWZyZXNoKCksdGhpcy5tdXRlZH0sbi5wcm90b3R5cGUudG9nZ2xlUGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXVzZWQ9IXRoaXMucGF1c2VkLHRoaXMucmVmcmVzaFBhdXNlZCgpLHRoaXMuX3BhdXNlZH0sbi5wcm90b3R5cGUuZGVjb2RlPWZ1bmN0aW9uKGUsdCl7dGhpcy5fb2ZmbGluZUN0eC5kZWNvZGVBdWRpb0RhdGEoZSxmdW5jdGlvbihlKXt0KG51bGwsZSl9LGZ1bmN0aW9uKCl7dChuZXcgRXJyb3IoXCJVbmFibGUgdG8gZGVjb2RlIGZpbGVcIikpfSl9LG59KG4pLEw9T2JqZWN0LmZyZWV6ZSh7V2ViQXVkaW9NZWRpYTpPLFdlYkF1ZGlvSW5zdGFuY2U6UCxXZWJBdWRpb05vZGVzOngsV2ViQXVkaW9Db250ZXh0OkUsV2ViQXVkaW9VdGlsczpsfSksUz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt0aGlzLmluaXQoKX1yZXR1cm4gZS5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnN1cHBvcnRlZCYmKHRoaXMuX3dlYkF1ZGlvQ29udGV4dD1uZXcgRSksdGhpcy5faHRtbEF1ZGlvQ29udGV4dD1uZXcgYix0aGlzLl9zb3VuZHM9e30sdGhpcy51c2VMZWdhY3k9IXRoaXMuc3VwcG9ydGVkLHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5pbml0PWZ1bmN0aW9uKCl7aWYoZS5pbnN0YW5jZSl0aHJvdyBuZXcgRXJyb3IoXCJTb3VuZExpYnJhcnkgaXMgYWxyZWFkeSBjcmVhdGVkXCIpO3ZhciB0PWUuaW5zdGFuY2U9bmV3IGU7XCJ1bmRlZmluZWRcIj09dHlwZW9mIFByb21pc2UmJih3aW5kb3cuUHJvbWlzZT1hKSx2b2lkIDAhPT1QSVhJLmxvYWRlcnMmJkEuaW5zdGFsbCh0KSx2b2lkIDA9PT13aW5kb3cuX19waXhpU291bmQmJmRlbGV0ZSB3aW5kb3cuX19waXhpU291bmQ7dmFyIG89UElYSTtyZXR1cm4gby5zb3VuZHx8KE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwic291bmRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnRpZXModCx7ZmlsdGVyczp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG19fSxodG1sYXVkaW86e2dldDpmdW5jdGlvbigpe3JldHVybiBnfX0sd2ViYXVkaW86e2dldDpmdW5jdGlvbigpe3JldHVybiBMfX0sdXRpbHM6e2dldDpmdW5jdGlvbigpe3JldHVybiB3fX0sU291bmQ6e2dldDpmdW5jdGlvbigpe3JldHVybiBJfX0sU291bmRTcHJpdGU6e2dldDpmdW5jdGlvbigpe3JldHVybiBGfX0sRmlsdGVyYWJsZTp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG59fSxTb3VuZExpYnJhcnk6e2dldDpmdW5jdGlvbigpe3JldHVybiBlfX19KSksdH0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc0FsbFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51c2VMZWdhY3k/W106dGhpcy5fY29udGV4dC5maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy51c2VMZWdhY3l8fCh0aGlzLl9jb250ZXh0LmZpbHRlcnM9ZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3VwcG9ydGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBudWxsIT09RS5BdWRpb0NvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuYWRkPWZ1bmN0aW9uKGUsdCl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGUpe3ZhciBuPXt9O2Zvcih2YXIgbyBpbiBlKXtpPXRoaXMuX2dldE9wdGlvbnMoZVtvXSx0KTtuW29dPXRoaXMuYWRkKG8saSl9cmV0dXJuIG59aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKGNvbnNvbGUuYXNzZXJ0KCF0aGlzLl9zb3VuZHNbZV0sXCJTb3VuZCB3aXRoIGFsaWFzIFwiK2UrXCIgYWxyZWFkeSBleGlzdHMuXCIpLHQgaW5zdGFuY2VvZiBJKXJldHVybiB0aGlzLl9zb3VuZHNbZV09dCx0O3ZhciBpPXRoaXMuX2dldE9wdGlvbnModCkscj1JLmZyb20oaSk7cmV0dXJuIHRoaXMuX3NvdW5kc1tlXT1yLHJ9fSxlLnByb3RvdHlwZS5fZ2V0T3B0aW9ucz1mdW5jdGlvbihlLHQpe3ZhciBuO3JldHVybiBuPVwic3RyaW5nXCI9PXR5cGVvZiBlP3t1cmw6ZX06ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfHxlIGluc3RhbmNlb2YgSFRNTEF1ZGlvRWxlbWVudD97c291cmNlOmV9OmUsT2JqZWN0LmFzc2lnbihuLHR8fHt9KX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwidXNlTGVnYWN5XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl91c2VMZWdhY3l9LHNldDpmdW5jdGlvbihlKXtBLmxlZ2FjeT1lLHRoaXMuX3VzZUxlZ2FjeT1lLCFlJiZ0aGlzLnN1cHBvcnRlZD90aGlzLl9jb250ZXh0PXRoaXMuX3dlYkF1ZGlvQ29udGV4dDp0aGlzLl9jb250ZXh0PXRoaXMuX2h0bWxBdWRpb0NvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmV4aXN0cyhlLCEwKSx0aGlzLl9zb3VuZHNbZV0uZGVzdHJveSgpLGRlbGV0ZSB0aGlzLl9zb3VuZHNbZV0sdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwidm9sdW1lQWxsXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2NvbnRleHQudm9sdW1lPWUsdGhpcy5fY29udGV4dC5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3BlZWRBbGxcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQuc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9jb250ZXh0LnNwZWVkPWUsdGhpcy5fY29udGV4dC5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUudG9nZ2xlUGF1c2VBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC50b2dnbGVQYXVzZSgpfSxlLnByb3RvdHlwZS5wYXVzZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnBhdXNlZD0hMCx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS5yZXN1bWVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5wYXVzZWQ9ITEsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUudG9nZ2xlTXV0ZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnRvZ2dsZU11dGUoKX0sZS5wcm90b3R5cGUubXV0ZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0Lm11dGVkPSEwLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnVubXV0ZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0Lm11dGVkPSExLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnJlbW92ZUFsbD1mdW5jdGlvbigpe2Zvcih2YXIgZSBpbiB0aGlzLl9zb3VuZHMpdGhpcy5fc291bmRzW2VdLmRlc3Ryb3koKSxkZWxldGUgdGhpcy5fc291bmRzW2VdO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5zdG9wQWxsPWZ1bmN0aW9uKCl7Zm9yKHZhciBlIGluIHRoaXMuX3NvdW5kcyl0aGlzLl9zb3VuZHNbZV0uc3RvcCgpO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5leGlzdHM9ZnVuY3Rpb24oZSx0KXt2b2lkIDA9PT10JiYodD0hMSk7dmFyIG49ISF0aGlzLl9zb3VuZHNbZV07cmV0dXJuIHQmJmNvbnNvbGUuYXNzZXJ0KG4sXCJObyBzb3VuZCBtYXRjaGluZyBhbGlhcyAnXCIrZStcIicuXCIpLG59LGUucHJvdG90eXBlLmZpbmQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZXhpc3RzKGUsITApLHRoaXMuX3NvdW5kc1tlXX0sZS5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmZpbmQoZSkucGxheSh0KX0sZS5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLnN0b3AoKX0sZS5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5wYXVzZSgpfSxlLnByb3RvdHlwZS5yZXN1bWU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5yZXN1bWUoKX0sZS5wcm90b3R5cGUudm9sdW1lPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcy5maW5kKGUpO3JldHVybiB2b2lkIDAhPT10JiYobi52b2x1bWU9dCksbi52b2x1bWV9LGUucHJvdG90eXBlLnNwZWVkPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcy5maW5kKGUpO3JldHVybiB2b2lkIDAhPT10JiYobi5zcGVlZD10KSxuLnNwZWVkfSxlLnByb3RvdHlwZS5kdXJhdGlvbj1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLmR1cmF0aW9ufSxlLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnJlbW92ZUFsbCgpLHRoaXMuX3NvdW5kcz1udWxsLHRoaXMuX3dlYkF1ZGlvQ29udGV4dCYmKHRoaXMuX3dlYkF1ZGlvQ29udGV4dC5kZXN0cm95KCksdGhpcy5fd2ViQXVkaW9Db250ZXh0PW51bGwpLHRoaXMuX2h0bWxBdWRpb0NvbnRleHQmJih0aGlzLl9odG1sQXVkaW9Db250ZXh0LmRlc3Ryb3koKSx0aGlzLl9odG1sQXVkaW9Db250ZXh0PW51bGwpLHRoaXMuX2NvbnRleHQ9bnVsbCx0aGlzfSxlfSgpLEk9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5tZWRpYT1lLHRoaXMub3B0aW9ucz10LHRoaXMuX2luc3RhbmNlcz1bXSx0aGlzLl9zcHJpdGVzPXt9LHRoaXMubWVkaWEuaW5pdCh0aGlzKTt2YXIgbj10LmNvbXBsZXRlO3RoaXMuX2F1dG9QbGF5T3B0aW9ucz1uP3tjb21wbGV0ZTpufTpudWxsLHRoaXMuaXNMb2FkZWQ9ITEsdGhpcy5pc1BsYXlpbmc9ITEsdGhpcy5hdXRvUGxheT10LmF1dG9QbGF5LHRoaXMuc2luZ2xlSW5zdGFuY2U9dC5zaW5nbGVJbnN0YW5jZSx0aGlzLnByZWxvYWQ9dC5wcmVsb2FkfHx0aGlzLmF1dG9QbGF5LHRoaXMudXJsPXQudXJsLHRoaXMuc3BlZWQ9dC5zcGVlZCx0aGlzLnZvbHVtZT10LnZvbHVtZSx0aGlzLmxvb3A9dC5sb29wLHQuc3ByaXRlcyYmdGhpcy5hZGRTcHJpdGVzKHQuc3ByaXRlcyksdGhpcy5wcmVsb2FkJiZ0aGlzLl9wcmVsb2FkKHQubG9hZGVkKX1yZXR1cm4gZS5mcm9tPWZ1bmN0aW9uKHQpe3ZhciBuPXt9O3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiB0P24udXJsPXQ6dCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfHx0IGluc3RhbmNlb2YgSFRNTEF1ZGlvRWxlbWVudD9uLnNvdXJjZT10Om49dCwobj1PYmplY3QuYXNzaWduKHthdXRvUGxheTohMSxzaW5nbGVJbnN0YW5jZTohMSx1cmw6bnVsbCxzb3VyY2U6bnVsbCxwcmVsb2FkOiExLHZvbHVtZToxLHNwZWVkOjEsY29tcGxldGU6bnVsbCxsb2FkZWQ6bnVsbCxsb29wOiExfSxuKSkudXJsJiYobi51cmw9dy5yZXNvbHZlVXJsKG4udXJsKSksT2JqZWN0LmZyZWV6ZShuKSxuZXcgZShTLmluc3RhbmNlLnVzZUxlZ2FjeT9uZXcgczpuZXcgTyxuKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gUy5pbnN0YW5jZS5jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNQbGF5aW5nPSExLHRoaXMucGF1c2VkPSEwLHRoaXN9LGUucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmlzUGxheWluZz10aGlzLl9pbnN0YW5jZXMubGVuZ3RoPjAsdGhpcy5wYXVzZWQ9ITEsdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYXVzZWQ9ZSx0aGlzLnJlZnJlc2hQYXVzZWQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzcGVlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zcGVlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWVkaWEuZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMubWVkaWEuZmlsdGVycz1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmFkZFNwcml0ZXM9ZnVuY3Rpb24oZSx0KXtpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7dmFyIG49e307Zm9yKHZhciBvIGluIGUpbltvXT10aGlzLmFkZFNwcml0ZXMobyxlW29dKTtyZXR1cm4gbn1pZihcInN0cmluZ1wiPT10eXBlb2YgZSl7Y29uc29sZS5hc3NlcnQoIXRoaXMuX3Nwcml0ZXNbZV0sXCJBbGlhcyBcIitlK1wiIGlzIGFscmVhZHkgdGFrZW5cIik7dmFyIGk9bmV3IEYodGhpcyx0KTtyZXR1cm4gdGhpcy5fc3ByaXRlc1tlXT1pLGl9fSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fcmVtb3ZlSW5zdGFuY2VzKCksdGhpcy5yZW1vdmVTcHJpdGVzKCksdGhpcy5tZWRpYS5kZXN0cm95KCksdGhpcy5tZWRpYT1udWxsLHRoaXMuX3Nwcml0ZXM9bnVsbCx0aGlzLl9pbnN0YW5jZXM9bnVsbH0sZS5wcm90b3R5cGUucmVtb3ZlU3ByaXRlcz1mdW5jdGlvbihlKXtpZihlKXt2YXIgdD10aGlzLl9zcHJpdGVzW2VdO3ZvaWQgMCE9PXQmJih0LmRlc3Ryb3koKSxkZWxldGUgdGhpcy5fc3ByaXRlc1tlXSl9ZWxzZSBmb3IodmFyIG4gaW4gdGhpcy5fc3ByaXRlcyl0aGlzLnJlbW92ZVNwcml0ZXMobik7cmV0dXJuIHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImlzUGxheWFibGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNMb2FkZWQmJnRoaXMubWVkaWEmJnRoaXMubWVkaWEuaXNQbGF5YWJsZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7aWYoIXRoaXMuaXNQbGF5YWJsZSlyZXR1cm4gdGhpcy5hdXRvUGxheT0hMSx0aGlzLl9hdXRvUGxheU9wdGlvbnM9bnVsbCx0aGlzO3RoaXMuaXNQbGF5aW5nPSExO2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLTE7ZT49MDtlLS0pdGhpcy5faW5zdGFuY2VzW2VdLnN0b3AoKTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlLHQpe3ZhciBuLG89dGhpcztpZihcInN0cmluZ1wiPT10eXBlb2YgZT9uPXtzcHJpdGU6cj1lLGNvbXBsZXRlOnR9OlwiZnVuY3Rpb25cIj09dHlwZW9mIGU/KG49e30pLmNvbXBsZXRlPWU6bj1lLChuPU9iamVjdC5hc3NpZ24oe2NvbXBsZXRlOm51bGwsbG9hZGVkOm51bGwsc3ByaXRlOm51bGwsZW5kOm51bGwsc3RhcnQ6MCx2b2x1bWU6MSxzcGVlZDoxLG11dGVkOiExLGxvb3A6ITF9LG58fHt9KSkuc3ByaXRlKXt2YXIgaT1uLnNwcml0ZTtjb25zb2xlLmFzc2VydCghIXRoaXMuX3Nwcml0ZXNbaV0sXCJBbGlhcyBcIitpK1wiIGlzIG5vdCBhdmFpbGFibGVcIik7dmFyIHI9dGhpcy5fc3ByaXRlc1tpXTtuLnN0YXJ0PXIuc3RhcnQsbi5lbmQ9ci5lbmQsbi5zcGVlZD1yLnNwZWVkfHwxLGRlbGV0ZSBuLnNwcml0ZX1pZihuLm9mZnNldCYmKG4uc3RhcnQ9bi5vZmZzZXQpLCF0aGlzLmlzTG9hZGVkKXJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihlLHQpe28uYXV0b1BsYXk9ITAsby5fYXV0b1BsYXlPcHRpb25zPW4sby5fcHJlbG9hZChmdW5jdGlvbihvLGkscil7bz90KG8pOihuLmxvYWRlZCYmbi5sb2FkZWQobyxpLHIpLGUocikpfSl9KTt0aGlzLnNpbmdsZUluc3RhbmNlJiZ0aGlzLl9yZW1vdmVJbnN0YW5jZXMoKTt2YXIgcz10aGlzLl9jcmVhdGVJbnN0YW5jZSgpO3JldHVybiB0aGlzLl9pbnN0YW5jZXMucHVzaChzKSx0aGlzLmlzUGxheWluZz0hMCxzLm9uY2UoXCJlbmRcIixmdW5jdGlvbigpe24uY29tcGxldGUmJm4uY29tcGxldGUobyksby5fb25Db21wbGV0ZShzKX0pLHMub25jZShcInN0b3BcIixmdW5jdGlvbigpe28uX29uQ29tcGxldGUocyl9KSxzLnBsYXkobiksc30sZS5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLHQ9MDt0PGU7dCsrKXRoaXMuX2luc3RhbmNlc1t0XS5yZWZyZXNoKCl9LGUucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aCx0PTA7dDxlO3QrKyl0aGlzLl9pbnN0YW5jZXNbdF0ucmVmcmVzaFBhdXNlZCgpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJ2b2x1bWVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3ZvbHVtZT1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcIm11dGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tdXRlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX211dGVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwibG9vcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbG9vcH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2xvb3A9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5fcHJlbG9hZD1mdW5jdGlvbihlKXt0aGlzLm1lZGlhLmxvYWQoZSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImluc3RhbmNlc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW5zdGFuY2VzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInNwcml0ZXNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Nwcml0ZXN9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZHVyYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWVkaWEuZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuYXV0b1BsYXlTdGFydD1mdW5jdGlvbigpe3ZhciBlO3JldHVybiB0aGlzLmF1dG9QbGF5JiYoZT10aGlzLnBsYXkodGhpcy5fYXV0b1BsYXlPcHRpb25zKSksZX0sZS5wcm90b3R5cGUuX3JlbW92ZUluc3RhbmNlcz1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLTE7ZT49MDtlLS0pdGhpcy5fcG9vbEluc3RhbmNlKHRoaXMuX2luc3RhbmNlc1tlXSk7dGhpcy5faW5zdGFuY2VzLmxlbmd0aD0wfSxlLnByb3RvdHlwZS5fb25Db21wbGV0ZT1mdW5jdGlvbihlKXtpZih0aGlzLl9pbnN0YW5jZXMpe3ZhciB0PXRoaXMuX2luc3RhbmNlcy5pbmRleE9mKGUpO3Q+LTEmJnRoaXMuX2luc3RhbmNlcy5zcGxpY2UodCwxKSx0aGlzLmlzUGxheWluZz10aGlzLl9pbnN0YW5jZXMubGVuZ3RoPjB9dGhpcy5fcG9vbEluc3RhbmNlKGUpfSxlLnByb3RvdHlwZS5fY3JlYXRlSW5zdGFuY2U9ZnVuY3Rpb24oKXtpZihlLl9wb29sLmxlbmd0aD4wKXt2YXIgdD1lLl9wb29sLnBvcCgpO3JldHVybiB0LmluaXQodGhpcy5tZWRpYSksdH1yZXR1cm4gdGhpcy5tZWRpYS5jcmVhdGUoKX0sZS5wcm90b3R5cGUuX3Bvb2xJbnN0YW5jZT1mdW5jdGlvbih0KXt0LmRlc3Ryb3koKSxlLl9wb29sLmluZGV4T2YodCk8MCYmZS5fcG9vbC5wdXNoKHQpfSxlLl9wb29sPVtdLGV9KCksQz1TLmluaXQoKTtlLnNvdW5kPUMsZS5maWx0ZXJzPW0sZS5odG1sYXVkaW89ZyxlLndlYmF1ZGlvPUwsZS5GaWx0ZXJhYmxlPW4sZS5Tb3VuZD1JLGUuU291bmRMaWJyYXJ5PVMsZS5Tb3VuZFNwcml0ZT1GLGUudXRpbHM9dyxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS1zb3VuZC5qcy5tYXBcbiIsIiFmdW5jdGlvbih0KXtmdW5jdGlvbiBlKGkpe2lmKG5baV0pcmV0dXJuIG5baV0uZXhwb3J0czt2YXIgcj1uW2ldPXtleHBvcnRzOnt9LGlkOmksbG9hZGVkOiExfTtyZXR1cm4gdFtpXS5jYWxsKHIuZXhwb3J0cyxyLHIuZXhwb3J0cyxlKSxyLmxvYWRlZD0hMCxyLmV4cG9ydHN9dmFyIG49e307cmV0dXJuIGUubT10LGUuYz1uLGUucD1cIlwiLGUoMCl9KFtmdW5jdGlvbih0LGUsbil7dC5leHBvcnRzPW4oNil9LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPVBJWEl9LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG49e2xpbmVhcjpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdH19LGluUXVhZDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0fX0sb3V0UXVhZDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCooMi10KX19LGluT3V0UXVhZDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LjUqdCp0Oi0uNSooLS10Kih0LTIpLTEpfX0saW5DdWJpYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0KnR9fSxvdXRDdWJpYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4tLXQqdCp0KzF9fSxpbk91dEN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQqdDoodC09MiwuNSoodCp0KnQrMikpfX0saW5RdWFydDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0KnQqdH19LG91dFF1YXJ0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLSAtLXQqdCp0KnR9fSxpbk91dFF1YXJ0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQqdCp0Oih0LT0yLC0uNSoodCp0KnQqdC0yKSl9fSxpblF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdCp0KnR9fSxvdXRRdWludDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4tLXQqdCp0KnQqdCsxfX0saW5PdXRRdWludDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LjUqdCp0KnQqdCp0Oih0LT0yLC41Kih0KnQqdCp0KnQrMikpfX0saW5TaW5lOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLU1hdGguY29zKHQqTWF0aC5QSS8yKX19LG91dFNpbmU6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIE1hdGguc2luKHQqTWF0aC5QSS8yKX19LGluT3V0U2luZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4uNSooMS1NYXRoLmNvcyhNYXRoLlBJKnQpKX19LGluRXhwbzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMD09PXQ/MDpNYXRoLnBvdygxMDI0LHQtMSl9fSxvdXRFeHBvOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxPT09dD8xOjEtTWF0aC5wb3coMiwtMTAqdCl9fSxpbk91dEV4cG86ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDA9PT10PzA6MT09PXQ/MToodCo9MiwxPnQ/LjUqTWF0aC5wb3coMTAyNCx0LTEpOi41KigtTWF0aC5wb3coMiwtMTAqKHQtMSkpKzIpKX19LGluQ2lyYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS1NYXRoLnNxcnQoMS10KnQpfX0sb3V0Q2lyYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zcXJ0KDEtIC0tdCp0KX19LGluT3V0Q2lyYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LS41KihNYXRoLnNxcnQoMS10KnQpLTEpOi41KihNYXRoLnNxcnQoMS0odC0yKSoodC0yKSkrMSl9fSxpbkVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLC0odCpNYXRoLnBvdygyLDEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKSl9fSxvdXRFbGFzdGljOmZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdPy4xOmFyZ3VtZW50c1swXSxlPWFyZ3VtZW50cy5sZW5ndGg8PTF8fHZvaWQgMD09PWFyZ3VtZW50c1sxXT8uNDphcmd1bWVudHNbMV07cmV0dXJuIGZ1bmN0aW9uKG4pe3ZhciBpPXZvaWQgMDtyZXR1cm4gMD09PW4/MDoxPT09bj8xOighdHx8MT50Pyh0PTEsaT1lLzQpOmk9ZSpNYXRoLmFzaW4oMS90KS8oMipNYXRoLlBJKSx0Kk1hdGgucG93KDIsLTEwKm4pKk1hdGguc2luKChuLWkpKigyKk1hdGguUEkpL2UpKzEpfX0saW5PdXRFbGFzdGljOmZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdPy4xOmFyZ3VtZW50c1swXSxlPWFyZ3VtZW50cy5sZW5ndGg8PTF8fHZvaWQgMD09PWFyZ3VtZW50c1sxXT8uNDphcmd1bWVudHNbMV07cmV0dXJuIGZ1bmN0aW9uKG4pe3ZhciBpPXZvaWQgMDtyZXR1cm4gMD09PW4/MDoxPT09bj8xOighdHx8MT50Pyh0PTEsaT1lLzQpOmk9ZSpNYXRoLmFzaW4oMS90KS8oMipNYXRoLlBJKSxuKj0yLDE+bj8tLjUqKHQqTWF0aC5wb3coMiwxMCoobi0xKSkqTWF0aC5zaW4oKG4tMS1pKSooMipNYXRoLlBJKS9lKSk6dCpNYXRoLnBvdygyLC0xMCoobi0xKSkqTWF0aC5zaW4oKG4tMS1pKSooMipNYXRoLlBJKS9lKSouNSsxKX19LGluQmFjazpmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIG49dHx8MS43MDE1ODtyZXR1cm4gZSplKigobisxKSplLW4pfX0sb3V0QmFjazpmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIG49dHx8MS43MDE1ODtyZXR1cm4tLWUqZSooKG4rMSkqZStuKSsxfX0saW5PdXRCYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj0xLjUyNSoodHx8MS43MDE1OCk7cmV0dXJuIGUqPTIsMT5lPy41KihlKmUqKChuKzEpKmUtbikpOi41KigoZS0yKSooZS0yKSooKG4rMSkqKGUtMikrbikrMil9fSxpbkJvdW5jZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS1uLm91dEJvdW5jZSgpKDEtdCl9fSxvdXRCb3VuY2U6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEvMi43NT50PzcuNTYyNSp0KnQ6Mi8yLjc1PnQ/KHQtPTEuNS8yLjc1LDcuNTYyNSp0KnQrLjc1KToyLjUvMi43NT50Pyh0LT0yLjI1LzIuNzUsNy41NjI1KnQqdCsuOTM3NSk6KHQtPTIuNjI1LzIuNzUsNy41NjI1KnQqdCsuOTg0Mzc1KX19LGluT3V0Qm91bmNlOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi41PnQ/LjUqbi5pbkJvdW5jZSgpKDIqdCk6LjUqbi5vdXRCb3VuY2UoKSgyKnQtMSkrLjV9fSxjdXN0b21BcnJheTpmdW5jdGlvbih0KXtyZXR1cm4gdD9mdW5jdGlvbih0KXtyZXR1cm4gdH06bi5saW5lYXIoKX19O2VbXCJkZWZhdWx0XCJdPW59LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gcih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1mdW5jdGlvbiBzKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX1mdW5jdGlvbiBvKHQsZSl7aWYoIXQpdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO3JldHVybiFlfHxcIm9iamVjdFwiIT10eXBlb2YgZSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZT90OmV9ZnVuY3Rpb24gYSh0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiK3R5cGVvZiBlKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxlJiYoT2JqZWN0LnNldFByb3RvdHlwZU9mP09iamVjdC5zZXRQcm90b3R5cGVPZih0LGUpOnQuX19wcm90b19fPWUpfWZ1bmN0aW9uIHUodCxlLG4saSxyLHMpe2Zvcih2YXIgbyBpbiB0KWlmKGModFtvXSkpdSh0W29dLGVbb10sbltvXSxpLHIscyk7ZWxzZXt2YXIgYT1lW29dLGg9dFtvXS1lW29dLGw9aSxmPXIvbDtuW29dPWEraCpzKGYpfX1mdW5jdGlvbiBoKHQsZSxuKXtmb3IodmFyIGkgaW4gdCkwPT09ZVtpXXx8ZVtpXXx8KGMobltpXSk/KGVbaV09SlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShuW2ldKSksaCh0W2ldLGVbaV0sbltpXSkpOmVbaV09bltpXSl9ZnVuY3Rpb24gYyh0KXtyZXR1cm5cIltvYmplY3QgT2JqZWN0XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpfXZhciBsPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGY9bigxKSxwPXIoZiksZD1uKDIpLGc9aShkKSx2PWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCxuKXtzKHRoaXMsZSk7dmFyIGk9byh0aGlzLE9iamVjdC5nZXRQcm90b3R5cGVPZihlKS5jYWxsKHRoaXMpKTtyZXR1cm4gaS50YXJnZXQ9dCxuJiZpLmFkZFRvKG4pLGkuY2xlYXIoKSxpfXJldHVybiBhKGUsdCksbChlLFt7a2V5OlwiYWRkVG9cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5tYW5hZ2VyPXQsdGhpcy5tYW5hZ2VyLmFkZFR3ZWVuKHRoaXMpLHRoaXN9fSx7a2V5OlwiY2hhaW5cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdHx8KHQ9bmV3IGUodGhpcy50YXJnZXQpKSx0aGlzLl9jaGFpblR3ZWVuPXQsdH19LHtrZXk6XCJzdGFydFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYWN0aXZlPSEwLHRoaXN9fSx7a2V5Olwic3RvcFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYWN0aXZlPSExLHRoaXMuZW1pdChcInN0b3BcIiksdGhpc319LHtrZXk6XCJ0b1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl90bz10LHRoaXN9fSx7a2V5OlwiZnJvbVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9mcm9tPXQsdGhpc319LHtrZXk6XCJyZW1vdmVcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1hbmFnZXI/KHRoaXMubWFuYWdlci5yZW1vdmVUd2Vlbih0aGlzKSx0aGlzKTp0aGlzfX0se2tleTpcImNsZWFyXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLnRpbWU9MCx0aGlzLmFjdGl2ZT0hMSx0aGlzLmVhc2luZz1nW1wiZGVmYXVsdFwiXS5saW5lYXIoKSx0aGlzLmV4cGlyZT0hMSx0aGlzLnJlcGVhdD0wLHRoaXMubG9vcD0hMSx0aGlzLmRlbGF5PTAsdGhpcy5waW5nUG9uZz0hMSx0aGlzLmlzU3RhcnRlZD0hMSx0aGlzLmlzRW5kZWQ9ITEsdGhpcy5fdG89bnVsbCx0aGlzLl9mcm9tPW51bGwsdGhpcy5fZGVsYXlUaW1lPTAsdGhpcy5fZWxhcHNlZFRpbWU9MCx0aGlzLl9yZXBlYXQ9MCx0aGlzLl9waW5nUG9uZz0hMSx0aGlzLl9jaGFpblR3ZWVuPW51bGwsdGhpcy5wYXRoPW51bGwsdGhpcy5wYXRoUmV2ZXJzZT0hMSx0aGlzLnBhdGhGcm9tPTAsdGhpcy5wYXRoVG89MH19LHtrZXk6XCJyZXNldFwiLHZhbHVlOmZ1bmN0aW9uKCl7aWYodGhpcy5fZWxhcHNlZFRpbWU9MCx0aGlzLl9yZXBlYXQ9MCx0aGlzLl9kZWxheVRpbWU9MCx0aGlzLmlzU3RhcnRlZD0hMSx0aGlzLmlzRW5kZWQ9ITEsdGhpcy5waW5nUG9uZyYmdGhpcy5fcGluZ1Bvbmcpe3ZhciB0PXRoaXMuX3RvLGU9dGhpcy5fZnJvbTt0aGlzLl90bz1lLHRoaXMuX2Zyb209dCx0aGlzLl9waW5nUG9uZz0hMX1yZXR1cm4gdGhpc319LHtrZXk6XCJ1cGRhdGVcIix2YWx1ZTpmdW5jdGlvbih0LGUpe2lmKHRoaXMuX2NhblVwZGF0ZSgpfHwhdGhpcy5fdG8mJiF0aGlzLnBhdGgpe3ZhciBuPXZvaWQgMCxpPXZvaWQgMDtpZih0aGlzLmRlbGF5PnRoaXMuX2RlbGF5VGltZSlyZXR1cm4gdm9pZCh0aGlzLl9kZWxheVRpbWUrPWUpO3RoaXMuaXNTdGFydGVkfHwodGhpcy5fcGFyc2VEYXRhKCksdGhpcy5pc1N0YXJ0ZWQ9ITAsdGhpcy5lbWl0KFwic3RhcnRcIikpO3ZhciByPXRoaXMucGluZ1Bvbmc/dGhpcy50aW1lLzI6dGhpcy50aW1lO2lmKHI+dGhpcy5fZWxhcHNlZFRpbWUpe3ZhciBzPXRoaXMuX2VsYXBzZWRUaW1lK2Usbz1zPj1yO3RoaXMuX2VsYXBzZWRUaW1lPW8/cjpzLHRoaXMuX2FwcGx5KHIpO3ZhciBhPXRoaXMuX3BpbmdQb25nP3IrdGhpcy5fZWxhcHNlZFRpbWU6dGhpcy5fZWxhcHNlZFRpbWU7aWYodGhpcy5lbWl0KFwidXBkYXRlXCIsYSksbyl7aWYodGhpcy5waW5nUG9uZyYmIXRoaXMuX3BpbmdQb25nKXJldHVybiB0aGlzLl9waW5nUG9uZz0hMCxuPXRoaXMuX3RvLGk9dGhpcy5fZnJvbSx0aGlzLl9mcm9tPW4sdGhpcy5fdG89aSx0aGlzLnBhdGgmJihuPXRoaXMucGF0aFRvLGk9dGhpcy5wYXRoRnJvbSx0aGlzLnBhdGhUbz1pLHRoaXMucGF0aEZyb209biksdGhpcy5lbWl0KFwicGluZ3BvbmdcIiksdm9pZCh0aGlzLl9lbGFwc2VkVGltZT0wKTtpZih0aGlzLmxvb3B8fHRoaXMucmVwZWF0PnRoaXMuX3JlcGVhdClyZXR1cm4gdGhpcy5fcmVwZWF0KyssdGhpcy5lbWl0KFwicmVwZWF0XCIsdGhpcy5fcmVwZWF0KSx0aGlzLl9lbGFwc2VkVGltZT0wLHZvaWQodGhpcy5waW5nUG9uZyYmdGhpcy5fcGluZ1BvbmcmJihuPXRoaXMuX3RvLGk9dGhpcy5fZnJvbSx0aGlzLl90bz1pLHRoaXMuX2Zyb209bix0aGlzLnBhdGgmJihuPXRoaXMucGF0aFRvLGk9dGhpcy5wYXRoRnJvbSx0aGlzLnBhdGhUbz1pLHRoaXMucGF0aEZyb209biksdGhpcy5fcGluZ1Bvbmc9ITEpKTt0aGlzLmlzRW5kZWQ9ITAsdGhpcy5hY3RpdmU9ITEsdGhpcy5lbWl0KFwiZW5kXCIpLHRoaXMuX2NoYWluVHdlZW4mJih0aGlzLl9jaGFpblR3ZWVuLmFkZFRvKHRoaXMubWFuYWdlciksdGhpcy5fY2hhaW5Ud2Vlbi5zdGFydCgpKX19fX19LHtrZXk6XCJfcGFyc2VEYXRhXCIsdmFsdWU6ZnVuY3Rpb24oKXtpZighdGhpcy5pc1N0YXJ0ZWQmJih0aGlzLl9mcm9tfHwodGhpcy5fZnJvbT17fSksaCh0aGlzLl90byx0aGlzLl9mcm9tLHRoaXMudGFyZ2V0KSx0aGlzLnBhdGgpKXt2YXIgdD10aGlzLnBhdGgudG90YWxEaXN0YW5jZSgpO3RoaXMucGF0aFJldmVyc2U/KHRoaXMucGF0aEZyb209dCx0aGlzLnBhdGhUbz0wKToodGhpcy5wYXRoRnJvbT0wLHRoaXMucGF0aFRvPXQpfX19LHtrZXk6XCJfYXBwbHlcIix2YWx1ZTpmdW5jdGlvbih0KXtpZih1KHRoaXMuX3RvLHRoaXMuX2Zyb20sdGhpcy50YXJnZXQsdCx0aGlzLl9lbGFwc2VkVGltZSx0aGlzLmVhc2luZyksdGhpcy5wYXRoKXt2YXIgZT10aGlzLnBpbmdQb25nP3RoaXMudGltZS8yOnRoaXMudGltZSxuPXRoaXMucGF0aEZyb20saT10aGlzLnBhdGhUby10aGlzLnBhdGhGcm9tLHI9ZSxzPXRoaXMuX2VsYXBzZWRUaW1lL3Isbz1uK2kqdGhpcy5lYXNpbmcocyksYT10aGlzLnBhdGguZ2V0UG9pbnRBdERpc3RhbmNlKG8pO3RoaXMudGFyZ2V0LnBvc2l0aW9uLnNldChhLngsYS55KX19fSx7a2V5OlwiX2NhblVwZGF0ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGltZSYmdGhpcy5hY3RpdmUmJnRoaXMudGFyZ2V0fX1dKSxlfShwLnV0aWxzLkV2ZW50RW1pdHRlcik7ZVtcImRlZmF1bHRcIl09dn0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1mdW5jdGlvbiByKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgcz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPW4oMyksYT1pKG8pLHU9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7cih0aGlzLHQpLHRoaXMudHdlZW5zPVtdLHRoaXMuX3R3ZWVuc1RvRGVsZXRlPVtdLHRoaXMuX2xhc3Q9MH1yZXR1cm4gcyh0LFt7a2V5OlwidXBkYXRlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dm9pZCAwO3R8fDA9PT10P2U9MWUzKnQ6KGU9dGhpcy5fZ2V0RGVsdGFNUygpLHQ9ZS8xZTMpO2Zvcih2YXIgbj0wO248dGhpcy50d2VlbnMubGVuZ3RoO24rKyl7dmFyIGk9dGhpcy50d2VlbnNbbl07aS5hY3RpdmUmJihpLnVwZGF0ZSh0LGUpLGkuaXNFbmRlZCYmaS5leHBpcmUmJmkucmVtb3ZlKCkpfWlmKHRoaXMuX3R3ZWVuc1RvRGVsZXRlLmxlbmd0aCl7Zm9yKHZhciBuPTA7bjx0aGlzLl90d2VlbnNUb0RlbGV0ZS5sZW5ndGg7bisrKXRoaXMuX3JlbW92ZSh0aGlzLl90d2VlbnNUb0RlbGV0ZVtuXSk7dGhpcy5fdHdlZW5zVG9EZWxldGUubGVuZ3RoPTB9fX0se2tleTpcImdldFR3ZWVuc0ZvclRhcmdldFwiLHZhbHVlOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT1bXSxuPTA7bjx0aGlzLnR3ZWVucy5sZW5ndGg7bisrKXRoaXMudHdlZW5zW25dLnRhcmdldD09PXQmJmUucHVzaCh0aGlzLnR3ZWVuc1tuXSk7cmV0dXJuIGV9fSx7a2V5OlwiY3JlYXRlVHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gbmV3IGFbXCJkZWZhdWx0XCJdKHQsdGhpcyl9fSx7a2V5OlwiYWRkVHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0KXt0Lm1hbmFnZXI9dGhpcyx0aGlzLnR3ZWVucy5wdXNoKHQpfX0se2tleTpcInJlbW92ZVR3ZWVuXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5fdHdlZW5zVG9EZWxldGUucHVzaCh0KX19LHtrZXk6XCJfcmVtb3ZlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy50d2VlbnMuaW5kZXhPZih0KTstMSE9PWUmJnRoaXMudHdlZW5zLnNwbGljZShlLDEpfX0se2tleTpcIl9nZXREZWx0YU1TXCIsdmFsdWU6ZnVuY3Rpb24oKXswPT09dGhpcy5fbGFzdCYmKHRoaXMuX2xhc3Q9RGF0ZS5ub3coKSk7dmFyIHQ9RGF0ZS5ub3coKSxlPXQtdGhpcy5fbGFzdDtyZXR1cm4gdGhpcy5fbGFzdD10LGV9fV0pLHR9KCk7ZVtcImRlZmF1bHRcIl09dX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBlPXt9O2lmKG51bGwhPXQpZm9yKHZhciBuIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbikmJihlW25dPXRbbl0pO3JldHVybiBlW1wiZGVmYXVsdFwiXT10LGV9ZnVuY3Rpb24gcih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9dmFyIHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbz1uKDEpLGE9aShvKSx1PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3IodGhpcyx0KSx0aGlzLl9jb2xzZWQ9ITEsdGhpcy5wb2x5Z29uPW5ldyBhLlBvbHlnb24sdGhpcy5wb2x5Z29uLmNsb3NlZD0hMSx0aGlzLl90bXBQb2ludD1uZXcgYS5Qb2ludCx0aGlzLl90bXBQb2ludDI9bmV3IGEuUG9pbnQsdGhpcy5fdG1wRGlzdGFuY2U9W10sdGhpcy5jdXJyZW50UGF0aD1udWxsLHRoaXMuZ3JhcGhpY3NEYXRhPVtdLHRoaXMuZGlydHk9ITB9cmV0dXJuIHModCxbe2tleTpcIm1vdmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLm1vdmVUby5jYWxsKHRoaXMsdCxlKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwibGluZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUubGluZVRvLmNhbGwodGhpcyx0LGUpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJiZXppZXJDdXJ2ZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSxyLHMpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5iZXppZXJDdXJ2ZVRvLmNhbGwodGhpcyx0LGUsbixpLHIscyksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcInF1YWRyYXRpY0N1cnZlVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUucXVhZHJhdGljQ3VydmVUby5jYWxsKHRoaXMsdCxlLG4saSksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImFyY1RvXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSxyKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUuYXJjVG8uY2FsbCh0aGlzLHQsZSxuLGksciksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImFyY1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkscixzKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUuYXJjLmNhbGwodGhpcyx0LGUsbixpLHIscyksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImRyYXdTaGFwZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5kcmF3U2hhcGUuY2FsbCh0aGlzLHQpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJnZXRQb2ludFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMucGFyc2VQb2ludHMoKTt2YXIgZT10aGlzLmNsb3NlZCYmdD49dGhpcy5sZW5ndGgtMT8wOjIqdDtyZXR1cm4gdGhpcy5fdG1wUG9pbnQuc2V0KHRoaXMucG9seWdvbi5wb2ludHNbZV0sdGhpcy5wb2x5Z29uLnBvaW50c1tlKzFdKSx0aGlzLl90bXBQb2ludH19LHtrZXk6XCJkaXN0YW5jZUJldHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3RoaXMucGFyc2VQb2ludHMoKTt2YXIgbj10aGlzLmdldFBvaW50KHQpLGk9bi54LHI9bi55LHM9dGhpcy5nZXRQb2ludChlKSxvPXMueCxhPXMueSx1PW8taSxoPWEtcjtyZXR1cm4gTWF0aC5zcXJ0KHUqdStoKmgpfX0se2tleTpcInRvdGFsRGlzdGFuY2VcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMucGFyc2VQb2ludHMoKSx0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGg9MCx0aGlzLl90bXBEaXN0YW5jZS5wdXNoKDApO2Zvcih2YXIgdD10aGlzLmxlbmd0aCxlPTAsbj0wO3QtMT5uO24rKyllKz10aGlzLmRpc3RhbmNlQmV0d2VlbihuLG4rMSksdGhpcy5fdG1wRGlzdGFuY2UucHVzaChlKTtyZXR1cm4gZX19LHtrZXk6XCJnZXRQb2ludEF0XCIsdmFsdWU6ZnVuY3Rpb24odCl7aWYodGhpcy5wYXJzZVBvaW50cygpLHQ+dGhpcy5sZW5ndGgpcmV0dXJuIHRoaXMuZ2V0UG9pbnQodGhpcy5sZW5ndGgtMSk7aWYodCUxPT09MClyZXR1cm4gdGhpcy5nZXRQb2ludCh0KTt0aGlzLl90bXBQb2ludDIuc2V0KDAsMCk7dmFyIGU9dCUxLG49dGhpcy5nZXRQb2ludChNYXRoLmNlaWwodCkpLGk9bi54LHI9bi55LHM9dGhpcy5nZXRQb2ludChNYXRoLmZsb29yKHQpKSxvPXMueCxhPXMueSx1PS0oKG8taSkqZSksaD0tKChhLXIpKmUpO3JldHVybiB0aGlzLl90bXBQb2ludDIuc2V0KG8rdSxhK2gpLHRoaXMuX3RtcFBvaW50Mn19LHtrZXk6XCJnZXRQb2ludEF0RGlzdGFuY2VcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLnBhcnNlUG9pbnRzKCksdGhpcy5fdG1wRGlzdGFuY2V8fHRoaXMudG90YWxEaXN0YW5jZSgpO3ZhciBlPXRoaXMuX3RtcERpc3RhbmNlLmxlbmd0aCxuPTAsaT10aGlzLl90bXBEaXN0YW5jZVt0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGgtMV07MD50P3Q9aSt0OnQ+aSYmKHQtPWkpO2Zvcih2YXIgcj0wO2U+ciYmKHQ+PXRoaXMuX3RtcERpc3RhbmNlW3JdJiYobj1yKSwhKHQ8dGhpcy5fdG1wRGlzdGFuY2Vbcl0pKTtyKyspO2lmKG49PT10aGlzLmxlbmd0aC0xKXJldHVybiB0aGlzLmdldFBvaW50QXQobik7dmFyIHM9dC10aGlzLl90bXBEaXN0YW5jZVtuXSxvPXRoaXMuX3RtcERpc3RhbmNlW24rMV0tdGhpcy5fdG1wRGlzdGFuY2Vbbl07cmV0dXJuIHRoaXMuZ2V0UG9pbnRBdChuK3Mvbyl9fSx7a2V5OlwicGFyc2VQb2ludHNcIix2YWx1ZTpmdW5jdGlvbigpe2lmKCF0aGlzLmRpcnR5KXJldHVybiB0aGlzO3RoaXMuZGlydHk9ITEsdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGg9MDtmb3IodmFyIHQ9MDt0PHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aDt0Kyspe3ZhciBlPXRoaXMuZ3JhcGhpY3NEYXRhW3RdLnNoYXBlO2UmJmUucG9pbnRzJiYodGhpcy5wb2x5Z29uLnBvaW50cz10aGlzLnBvbHlnb24ucG9pbnRzLmNvbmNhdChlLnBvaW50cykpfXJldHVybiB0aGlzfX0se2tleTpcImNsZWFyXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoPTAsdGhpcy5jdXJyZW50UGF0aD1udWxsLHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoPTAsdGhpcy5fY2xvc2VkPSExLHRoaXMuZGlydHk9ITEsdGhpc319LHtrZXk6XCJjbG9zZWRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY2xvc2VkfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5fY2xvc2VkIT09dCYmKHRoaXMucG9seWdvbi5jbG9zZWQ9dCx0aGlzLl9jbG9zZWQ9dCx0aGlzLmRpcnR5PSEwKX19LHtrZXk6XCJsZW5ndGhcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGg/dGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGgvMisodGhpcy5fY2xvc2VkPzE6MCk6MH19XSksdH0oKTtlW1wiZGVmYXVsdFwiXT11fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIHIodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBlPXt9O2lmKG51bGwhPXQpZm9yKHZhciBuIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbikmJihlW25dPXRbbl0pO3JldHVybiBlW1wiZGVmYXVsdFwiXT10LGV9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHM9bigxKSxvPXIocyksYT1uKDQpLHU9aShhKSxoPW4oMyksYz1pKGgpLGw9big1KSxmPWkobCkscD1uKDIpLGQ9aShwKTtvLkdyYXBoaWNzLnByb3RvdHlwZS5kcmF3UGF0aD1mdW5jdGlvbih0KXtyZXR1cm4gdC5wYXJzZVBvaW50cygpLHRoaXMuZHJhd1NoYXBlKHQucG9seWdvbiksdGhpc307dmFyIGc9e1R3ZWVuTWFuYWdlcjp1W1wiZGVmYXVsdFwiXSxUd2VlbjpjW1wiZGVmYXVsdFwiXSxFYXNpbmc6ZFtcImRlZmF1bHRcIl0sVHdlZW5QYXRoOmZbXCJkZWZhdWx0XCJdfTtvLnR3ZWVuTWFuYWdlcnx8KG8udHdlZW5NYW5hZ2VyPW5ldyB1W1wiZGVmYXVsdFwiXSxvLnR3ZWVuPWcpLGVbXCJkZWZhdWx0XCJdPWd9XSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLXR3ZWVuLmpzLm1hcCIsIm1vZHVsZS5leHBvcnRzPXtcclxuICBcIkFcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGwxLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogZmFsc2UsXHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImNlbGwxLWZpbGwucG5nXCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogOCxcclxuICAgIFwic2NvcmVcIjogMVxyXG4gIH0sXHJcbiAgXCJCXCI6IHtcclxuICAgIFwiaW1hZ2VcIjogXCJjZWxsMi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IGZhbHNlXHJcbiAgfSxcclxuICBcIkNcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGw0LnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogZmFsc2UsXHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImNlbGw0LWZpbGwucG5nXCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMjIsXHJcbiAgICBcInNjb3JlXCI6IDNcclxuICB9LFxyXG4gIFwiSUNcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRDLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCIsXHJcbiAgICBcImFjdGlvblwiOiBcImhpc3RvcnlcIixcclxuICAgIFwiYWN0aXZhdGlvblwiOiAwXHJcbiAgfSxcclxuICBcIklUTFwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFRMLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSVRcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRULnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSVRSXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kVFIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJUlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJhY3Rpb25cIjogXCJoaXN0b3J5XCIsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklCUlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEJSLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSUJcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRCLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSUJMXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kQkwucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJTFwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEwucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIixcclxuICAgIFwiYWN0aW9uXCI6IFwiaGlzdG9yeVwiLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDBcclxuICB9XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHM9e1xyXG4gIFwibGV0XCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQVwiLCBcIkF8Q3xCXCIsIFwiQVwiLCBcIkFcIiwgXCJBXCJdLFxyXG4gICAgICBcInNodWZmbGVcIjogdHJ1ZSxcclxuICAgICAgXCJ0cmltXCI6IDNcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIkF8QXxDXCIsIFwiQXxCXCIsIFwiQVwiLCBcIkJcIiwgXCJBXCJdLFxyXG4gICAgICBcInNodWZmbGVcIjogdHJ1ZSxcclxuICAgIH1cclxuICBdLFxyXG4gIFwiZW5kXCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQVwiLCBcIkFcIiwgXCJBXCIsIFwiQVwiLCBcIkFcIl0sXHJcbiAgICB9XHJcbiAgXSxcclxuICBcImxhYmlyaW50XCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQlwiLCBcIkJcIiwgXCJCXCIsIFwiQlwiLCBcIkJcIl0sXHJcbiAgICAgIFwiYXBwZW5kXCI6IFwiQVwiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBXCIsIFwiQVwiLCBcIkFcIiwgXCJBXCIsIFwiQVwiXSxcclxuICAgIH1cclxuICBdLFxyXG4gIFwiaXNsYW5kXCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQXxDfEJcIiwgXCJBXCIsIFwiQXxDfEJcIl1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIklUTFwiLCBcIklUXCIsIFwiSVRSXCJdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJJTFwiLCAgXCJJQ1wiLCAgXCJJUlwiXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiSUJMXCIsIFwiSUJcIiwgXCJJQlJcIl1cclxuICAgIH1cclxuICBdXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHM9W1xyXG4gIHtcclxuICAgIFwiZnJhZ21lbnRzXCI6IFtcclxuICAgICAge1wiaXNsYW5kXCI6IDF9LFxyXG4gICAgICB7XCJsZXRcIjogNH0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJlbmRcIjogMX0sXHJcbiAgICAgIHtcImlzbGFuZFwiOiAxfSxcclxuICAgIF0sXHJcbiAgICBcImhpc3RvcnlcIjoge1xyXG4gICAgICBcInJ1XCI6IFwi0KLQu9C10L0g0LjQtNC10YIg0LfQsCDRgtC+0LHQvtC5INC/0L4g0L/Rj9GC0LDQvC4gXFxuINCe0YLRgdGC0YPQv9C40YHRjCDQuCDQvtC9INGC0LXQsdGPINC/0L7Qs9C70LDRgtC40YIuLi4gXFxuINCd0L4g0L3QtSDRgdGC0L7QuNGCINC+0YLRh9Cw0LjQstCw0YLRjNGB0Y8sINCy0LXQtNGMINC80YPQt9GL0LrQsCDQstGB0LXQs9C00LAg0YEg0YLQvtCx0L7QuS5cIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJmcmFnbWVudHNcIjogW1xyXG4gICAgICB7XCJsZXRcIjogMTB9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiAxMH0sXHJcbiAgICAgIHtcImVuZFwiOiAxfSxcclxuICAgICAge1wiaXNsYW5kXCI6IDF9XHJcbiAgICBdLFxyXG4gICAgXCJoaXN0b3J5XCI6IHtcclxuICAgICAgXCJydVwiOiBcItCi0LvQtdC9INC90LUg0YnQsNC00LjRgiDQvdC40LrQvtCz0L4uINCb0LXRgtGD0YfQuNC1INC30LzQtdC4INC/0LDQtNGD0YIg0L3QsCDQt9C10LzQu9GOINC4INC/0L7Qs9GA0YPQt9GP0YLRgdGPINCyINGA0YPRgtC40L3RgyDQsdGL0YLQuNGPLi4uXCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwiZnJhZ21lbnRzXCI6IFtcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wiZW5kXCI6IDF9LFxyXG4gICAgICB7XCJpc2xhbmRcIjogMX1cclxuICAgIF0sXHJcbiAgICBcImhpc3RvcnlcIjoge1xyXG4gICAgICBcInJ1XCI6IFwi0Jgg0YLQvtCz0LTQsCDQvtC9INC/0L7QvdC10YEg0YHQstC10YfRgyDRh9C10YDQtdC3INGH0YPQttC40LUg0LfQtdC80LvQuCDQvtGB0LLQvtCx0L7QttC00LDRjyDQu9C10YLRg9GH0LjRhSDQt9C80LXQuSDQuCDRgdCy0L7QuSDQvdCw0YDQvtC0Li4uXCJcclxuICAgIH1cclxuICB9XHJcbl1cclxuIiwiY29uc3QgU2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4vbWFuYWdlcnMvU2NlbmVzTWFuYWdlcicpO1xyXG5jb25zdCBmaWx0ZXJzID0gcmVxdWlyZSgncGl4aS1maWx0ZXJzJyk7XHJcbmNvbnN0IENsb3Vkc0ZpbHRlciA9IHJlcXVpcmUoJy4vc2hhZGVycy9jbG91ZHMnKTtcclxuXHJcbmNsYXNzIEdhbWUgZXh0ZW5kcyBQSVhJLkFwcGxpY2F0aW9uIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHtiYWNrZ3JvdW5kQ29sb3I6IDB4ZmNmY2ZjfSlcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcclxuXHJcbiAgICB0aGlzLncgPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgIHRoaXMuaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy5iZyA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdiZycpKTtcclxuICAgIHRoaXMuYmcud2lkdGggPSB0aGlzLnc7XHJcbiAgICB0aGlzLmJnLmhlaWdodCA9IHRoaXMuaDtcclxuICAgIHRoaXMuY29udGFpbmVyLmFkZENoaWxkKHRoaXMuYmcpO1xyXG5cclxuICAgIHRoaXMuc2NlbmVzID0gbmV3IFNjZW5lc01hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLnNjZW5lcyk7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIuZmlsdGVyQXJlYSA9IG5ldyBQSVhJLlJlY3RhbmdsZSgwLCAwLCB0aGlzLncsIHRoaXMuaCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5maWx0ZXJzID0gW25ldyBmaWx0ZXJzLk9sZEZpbG1GaWx0ZXIoe1xyXG4gICAgICBzZXBpYTogMCxcclxuICAgICAgdmlnbmV0dGluZzogMCxcclxuICAgICAgbm9pc2U6IC4xLFxyXG4gICAgICB2aWduZXR0aW5nQmx1cjogMVxyXG4gICAgfSldO1xyXG5cclxuICAgIHRoaXMuX2luaXRUaWNrZXIoKTtcclxuICB9XHJcbiAgX2luaXRUaWNrZXIoKSB7XHJcbiAgICB0aGlzLnRpY2tlci5hZGQoKGR0KSA9PiB7XHJcbiAgICAgIHRoaXMuc2NlbmVzLnVwZGF0ZShkdCk7XHJcbiAgICAgIFBJWEkudHdlZW5NYW5hZ2VyLnVwZGF0ZSgpO1xyXG4gICAgICB0aGlzLmNvbnRhaW5lci5maWx0ZXJzWzBdLnNlZWQgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAvLyB0aGlzLmNvbnRhaW5lci5maWx0ZXJzWzBdLnRpbWUgKz0gLjAxO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcbiIsInJlcXVpcmUoJ3BpeGktc291bmQnKTtcclxucmVxdWlyZSgncGl4aS10d2VlbicpO1xyXG5yZXF1aXJlKCdwaXhpLXByb2plY3Rpb24nKTtcclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpO1xyXG5cclxuV2ViRm9udC5sb2FkKHtcclxuICBnb29nbGU6IHtcclxuICAgIGZhbWlsaWVzOiBbJ0FtYXRpYyBTQyddXHJcbiAgfSxcclxuICBhY3RpdmUoKSB7XHJcbiAgICBQSVhJLmxvYWRlclxyXG4gICAgICAuYWRkKCdibG9ja3MnLCAnYXNzZXRzL2Jsb2Nrcy5qc29uJylcclxuICAgICAgLmFkZCgncGxheWVyJywgJ2Fzc2V0cy9wbGF5ZXIucG5nJylcclxuICAgICAgLmFkZCgnYmcnLCAnYXNzZXRzL2JnLnBuZycpXHJcbiAgICAgIC5hZGQoJ2Rpc3BsYWNlbWVudCcsICdhc3NldHMvZGlzcGxhY2VtZW50LnBuZycpXHJcbiAgICAgIC5hZGQoJ3RobGVuJywgJ2Fzc2V0cy90aGxlbi5wbmcnKVxyXG4gICAgICAuYWRkKCdsaWdodG1hcCcsICdhc3NldHMvbGlnaHRtYXAucG5nJylcclxuICAgICAgLmFkZCgnbWFzaycsICdhc3NldHMvbWFzay5wbmcnKVxyXG4gICAgICAuYWRkKCdtdXNpYycsICdhc3NldHMvbXVzaWMubXAzJylcclxuICAgICAgLmxvYWQoKGxvYWRlciwgcmVzb3VyY2VzKSA9PiB7XHJcbiAgICAgICAgUElYSS5zb3VuZC5wbGF5KCdtdXNpYycpO1xyXG4gICAgICAgIGxldCBnYW1lID0gbmV3IEdhbWUoKTtcclxuICAgICAgICBnYW1lLnNjZW5lcy5lbmFibGVTY2VuZSgncGxheWdyb3VuZCcpO1xyXG5cclxuICAgICAgICB3aW5kb3cuZ2FtZSA9IGdhbWU7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufSk7XHJcbiIsImNsYXNzIEhpc3RvcnlNYW5hZ2VyIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuZ2FtZSA9IHNjZW5lLmdhbWU7XHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcblxyXG4gICAgdGhpcy5hbHBoYSA9IDA7XHJcbiAgICB0aGlzLnRleHQgPSBuZXcgUElYSS5UZXh0KCdUZXh0Jywge1xyXG4gICAgICBmb250OiAnbm9ybWFsIDQwcHggQW1hdGljIFNDJyxcclxuICAgICAgd29yZFdyYXA6IHRydWUsXHJcbiAgICAgIHdvcmRXcmFwV2lkdGg6IHRoaXMuZ2FtZS53LzIsXHJcbiAgICAgIGZpbGw6ICcjMmQ1YmZmJyxcclxuICAgICAgcGFkZGluZzogMTAsXHJcbiAgICAgIGFsaWduOiAnY2VudGVyJ1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRleHQuYW5jaG9yLnNldCguNSk7XHJcbiAgICB0aGlzLnRleHQueCA9IHRoaXMuZ2FtZS53LzI7XHJcbiAgICB0aGlzLnRleHQueSA9IDE1MDtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy50ZXh0KTtcclxuICB9XHJcbiAgc2hvd1RleHQodHh0LCB0aW1lKSB7XHJcbiAgICB0aGlzLnRleHQuc2V0VGV4dCh0eHQpO1xyXG5cclxuICAgIGxldCBzaG93ID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBzaG93LmZyb20oe2FscGhhOiAwfSkudG8oe2FscGhhOiAxfSk7XHJcbiAgICBzaG93LnRpbWUgPSAxMDAwO1xyXG4gICAgc2hvdy5zdGFydCgpO1xyXG4gICAgdGhpcy5lbWl0KCdzaG93ZW4nKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KHRoaXMuaGlkZVRleHQuYmluZCh0aGlzKSwgdGltZSk7XHJcbiAgfVxyXG4gIGhpZGVUZXh0KCkge1xyXG4gICAgbGV0IGhpZGUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIGhpZGUuZnJvbSh7YWxwaGE6IDF9KS50byh7YWxwaGE6IDB9KTtcclxuICAgIGhpZGUudGltZSA9IDEwMDA7XHJcbiAgICBoaWRlLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmVtaXQoJ2hpZGRlbicpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIaXN0b3J5TWFuYWdlcjtcclxuIiwiLypcclxuICDQnNC10L3QtdC00LbQtdGAINGD0YDQvtCy0L3QtdC5LCDRgNCw0LHQvtGC0LDQtdGCINC90LDQv9GA0Y/QvNGD0Y4g0YEgTWFwTWFuYWdlclxyXG4gINC40YHQv9C+0LvRjNC30YPRjyDQtNCw0L3QvdGL0LUgbGV2ZWxzLmpzb24g0LggIGZyYWdtZW50cy5qc29uXHJcblxyXG4gINCh0L7QsdGL0YLQuNGPOlxyXG4gICAgYWRkZWRGcmFnbWVudHNEYXRhID0+IG5ldyBmcmFnbWVudHNEYXRhXHJcbiAgICBhZGRlZExldmVscyA9PiBuZXcgbGV2ZWxzXHJcbiAgICBhZGRlZExldmVsID0+IG5ldyBsdmxcclxuXHJcbiAgICBzd2l0Y2hlZExldmVsID0+IGN1ciBsdmxcclxuICAgIHdlbnROZXh0TGV2ZWwgPT4gY3VyIGx2bFxyXG4gICAgd2VudEJhY2tMZXZlbCA9PiBjdXIgbHZsXHJcbiAgICBzd2l0Y2hlZEZyYWdtZW50ID0+IGN1ciBmcmFnXHJcbiAgICB3ZW50TmV4dEZyYWdtZW50ID0+IGN1ciBmcmFnXHJcbiAgICB3ZW50QmFja0ZyYWdtZW50ID0+IGN1ciBmcmFnXHJcblxyXG4gICAgc3RhcnRlZExldmVsID0+IG5ldyBsdmxcclxuICAgIGVuZGVkTGV2ZWwgPT4gcHJldiBsdmxcclxuKi9cclxuXHJcblxyXG5jbGFzcyBMZXZlbE1hbmFnZXIgZXh0ZW5kcyBQSVhJLnV0aWxzLkV2ZW50RW1pdHRlciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUsIG1hcCkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLm1hcCA9IG1hcDtcclxuXHJcbiAgICB0aGlzLmxldmVscyA9IFtdO1xyXG4gICAgdGhpcy5mcmFnbWVudHNEYXRhID0ge307XHJcbiAgICB0aGlzLmFkZEZyYWdtZW50c0RhdGEocmVxdWlyZSgnLi4vY29udGVudC9mcmFnbWVudHMnKSk7XHJcbiAgICB0aGlzLmFkZExldmVscyhyZXF1aXJlKCcuLi9jb250ZW50L2xldmVscycpKVxyXG5cclxuICAgIHRoaXMuY3VyTGV2ZWxJbmRleCA9IDA7XHJcbiAgICB0aGlzLmN1ckZyYWdtZW50SW5kZXggPSAwO1xyXG4gIH1cclxuICAvLyBnZXR0ZXJzXHJcbiAgZ2V0Q3VycmVudExldmVsKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubGV2ZWxzW3RoaXMuY3VyTGV2ZWxJbmRleF07XHJcbiAgfVxyXG4gIGdldEN1cnJlbnRGcmFnbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLmdldEN1cnJlbnRMZXZlbCgpICYmIHRoaXMuZ2V0Q3VycmVudExldmVsKCkubWFwc1t0aGlzLmN1ckZyYWdtZW50SW5kZXhdO1xyXG4gIH1cclxuXHJcbiAgLy8gYWRkIGZyYWdtZW50cyB0byBkYiBmcmFnbWVudHNcclxuICBhZGRGcmFnbWVudHNEYXRhKGRhdGE9e30pIHtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5mcmFnbWVudHNEYXRhLCBkYXRhKTtcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRGcmFnbWVudHNEYXRhJywgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvLyBhZGQgbGV2ZWxzIHRvIGRiIGxldmVsc1xyXG4gIGFkZExldmVscyhsZXZlbHM9W10pIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsZXZlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5hZGRMZXZlbChsZXZlbHNbaV0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdhZGRlZExldmVscycsIGxldmVscyk7XHJcbiAgfVxyXG4gIGFkZExldmVsKGx2bD17fSkge1xyXG4gICAgdGhpcy5sZXZlbHMucHVzaChsdmwpO1xyXG5cclxuICAgIC8vIGdlbmVyYXRlZCBtYXBzIHRvIGx2bCBvYmplY3RcclxuICAgIGx2bC5tYXBzID0gW107XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgbHZsLmZyYWdtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBmb3IobGV0IGtleSBpbiBsdmwuZnJhZ21lbnRzW2ldKSB7XHJcbiAgICAgICAgZm9yKGxldCBjID0gMDsgYyA8IGx2bC5mcmFnbWVudHNbaV1ba2V5XTsgYysrKSB7XHJcbiAgICAgICAgICBsdmwubWFwcy5wdXNoKHRoaXMuZnJhZ21lbnRzRGF0YVtrZXldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuZW1pdCgnYWRkZWRMZXZlbCcsIGx2bCk7XHJcbiAgfVxyXG5cclxuICAvLyBNZXRob2RzIGZvciBsZXZlbHMgY29udHJvbFxyXG4gIHN3aXRjaExldmVsKGx2bCkge1xyXG4gICAgaWYobHZsID49IHRoaXMubGV2ZWxzLmxlbmd0aCB8fCBsdmwgPCAwKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5jdXJMZXZlbEluZGV4ID0gbHZsO1xyXG4gICAgdGhpcy5zd2l0Y2hGcmFnbWVudCgwKTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ3N0YXJ0ZWRMZXZlbCcpO1xyXG4gICAgdGhpcy5lbWl0KCdzd2l0Y2hlZExldmVsJyk7XHJcbiAgfVxyXG4gIG5leHRMZXZlbCgpIHtcclxuICAgIHRoaXMuc3dpdGNoTGV2ZWwodGhpcy5jdXJMZXZlbEluZGV4KzEpO1xyXG4gICAgdGhpcy5lbWl0KCd3ZW50TmV4dExldmVsJyk7XHJcbiAgfVxyXG4gIGJhY2tMZXZlbCgpIHtcclxuICAgIHRoaXMuc3dpdGNoTGV2ZWwodGhpcy5jdXJMZXZlbEluZGV4LTEpO1xyXG4gICAgdGhpcy5lbWl0KCd3ZW50QmFja0xldmVsJyk7XHJcbiAgfVxyXG5cclxuICAvLyBNZXRob2RzIGZvciBmcmFnbWVudHMgY29udHJvbFxyXG4gIHN3aXRjaEZyYWdtZW50KGZyYWcpIHtcclxuICAgIGlmKGZyYWcgPCAwKSByZXR1cm47XHJcbiAgICB0aGlzLmN1ckZyYWdtZW50SW5kZXggPSBmcmFnO1xyXG5cclxuICAgIGlmKHRoaXMuZ2V0Q3VycmVudEZyYWdtZW50KCkpIHRoaXMubWFwLmFkZE1hcCh0aGlzLmdldEN1cnJlbnRGcmFnbWVudCgpKTtcclxuICAgIGVsc2UgdGhpcy5lbWl0KCdlbmRlZExldmVsJyk7XHJcbiAgICB0aGlzLmVtaXQoJ3N3aXRjaGVkRnJhZ21lbnQnKTtcclxuICB9XHJcbiAgbmV4dEZyYWdtZW50KCkge1xyXG4gICAgdGhpcy5zd2l0Y2hGcmFnbWVudCh0aGlzLmN1ckZyYWdtZW50SW5kZXgrMSk7XHJcbiAgICB0aGlzLmVtaXQoJ3dlbnROZXh0RnJhZ21lbnQnKTtcclxuICB9XHJcbiAgYmFja0ZyYWdtZW50KCkge1xyXG4gICAgdGhpcy5zd2l0Y2hGcmFnbWVudCh0aGlzLmN1ckZyYWdtZW50SW5kZXgtMSk7XHJcbiAgICB0aGlzLmVtaXQoJ3dlbnRCYWNrRnJhZ21lbnQnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWxNYW5hZ2VyO1xyXG4iLCIvKlxyXG4gINCU0LLQuNC20L7QuiDRgtCw0LnQu9C+0LLQvtC5INC60LDRgNGC0YtcclxuICDQodC+0LHRi9GC0LjRjzpcclxuICAgIGFkZGVkTWFwID0+IG1hcFxyXG4gICAgYWRkZWRGcmFnbWVudCA9PiBmcmFnbWVudHNcclxuICAgIGFkZGVkQmxvY2sgPT4gYmxvY2tcclxuICAgIHNjcm9sbGVkRG93biA9PiBkdERvd25cclxuICAgIHNjcm9sbGVkVG9wID0+IGR0VG9wXHJcblxyXG4gICAgcmVzaXplZFxyXG4gICAgZW5kZWRNYXBcclxuICAgIGNsZWFyZWRPdXRSYW5nZUJsb2Nrc1xyXG4qL1xyXG5cclxuXHJcbmNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi4vc3ViamVjdHMvQmxvY2snKTtcclxuY29uc3QgRGF0YUZyYWdtZW50Q29udmVydGVyID0gcmVxdWlyZSgnLi4vdXRpbHMvRGF0YUZyYWdtZW50Q29udmVydGVyJyk7XHJcblxyXG5jbGFzcyBNYXBNYW5hZ2VyIGV4dGVuZHMgUElYSS5wcm9qZWN0aW9uLkNvbnRhaW5lcjJkIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSwgcGFyYW1zPXt9KSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgc2NlbmUuYWRkQ2hpbGQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5nYW1lID0gc2NlbmUuZ2FtZTtcclxuXHJcbiAgICB0aGlzLlBBRERJTkdfQk9UVE9NID0gMjgwO1xyXG5cclxuICAgIHRoaXMubWF4QXhpc1ggPSBwYXJhbXMubWF4WCB8fCA1O1xyXG4gICAgdGhpcy5ibG9ja1NpemUgPSBwYXJhbXMudGlsZVNpemUgfHwgMTAwO1xyXG4gICAgdGhpcy5zZXRCbG9ja3NEYXRhKHJlcXVpcmUoJy4uL2NvbnRlbnQvYmxvY2tzJykpO1xyXG4gICAgdGhpcy5yZXNpemUoKTtcclxuXHJcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuc3BlZWQgPSA1MDA7XHJcbiAgICB0aGlzLmxhc3RJbmRleCA9IDA7XHJcbiAgfVxyXG4gIHJlc2l6ZSgpIHtcclxuICAgIHRoaXMueCA9IHRoaXMuZ2FtZS53LzItdGhpcy5tYXhBeGlzWCp0aGlzLmJsb2NrU2l6ZS8yO1xyXG4gICAgdGhpcy55ID0gdGhpcy5nYW1lLmgtdGhpcy5QQURESU5HX0JPVFRPTTtcclxuICAgIHRoaXMuZW1pdCgncmVzaXplZCcpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHBhcmFtc1xyXG4gIHNldEJsb2Nrc0RhdGEoZGF0YSkge1xyXG4gICAgdGhpcy5CTE9DS1MgPSBkYXRhIHx8IHt9O1xyXG4gIH1cclxuICBzZXRNYXhBeGlzWChtYXgpIHtcclxuICAgIHRoaXMubWF4QXhpc1ggPSBtYXggfHwgNjtcclxuICAgIHRoaXMucmVzaXplKCk7XHJcbiAgfVxyXG4gIHNldEJsb2NrU2l6ZShzaXplKSB7XHJcbiAgICB0aGlzLmJsb2NrU2l6ZSA9IHNpemUgfHwgMTAwO1xyXG4gICAgdGhpcy5yZXNpemUoKTtcclxuICB9XHJcbiAgc2V0U3BlZWQoc3BlZWQpIHtcclxuICAgIHRoaXMuc3BlZWQgPSBzcGVlZCB8fCA1MDA7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gTWFwIE1hbmFnZXJcclxuICBhZGRNYXAobWFwKSB7XHJcbiAgICBmb3IobGV0IGkgPSBtYXAubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIHRoaXMuYWRkRnJhZ21lbnQobWFwW2ldKTtcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdCgnYWRkZWRNYXAnLCBtYXApO1xyXG4gICAgdGhpcy5jbGVhck91dFJhbmdlQmxvY2tzKCk7XHJcbiAgICB0aGlzLmNvbXB1dGluZ01hcEVuZCgpO1xyXG4gIH1cclxuICBhZGRGcmFnbWVudChmcmFnRGF0YSkge1xyXG4gICAgbGV0IGZyYWcgPSBuZXcgRGF0YUZyYWdtZW50Q29udmVydGVyKGZyYWdEYXRhKS5mcmFnbWVudDtcclxuICAgIC8vIGFkZCBibG9jayB0byBjZW50ZXIgWCBheGlzLCBmb3IgZXhhbXBsZTogcm91bmQoKDgtNCkvMikgPT4gKzIgcGFkZGluZyB0byBibG9jayBYIHBvc1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGZyYWcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5hZGRCbG9jayhmcmFnW2ldLCBNYXRoLnJvdW5kKCh0aGlzLm1heEF4aXNYLWZyYWcubGVuZ3RoKS8yKStpLCB0aGlzLmxhc3RJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sYXN0SW5kZXgrKztcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRGcmFnbWVudCcsIGZyYWdEYXRhKTtcclxuICB9XHJcbiAgYWRkQmxvY2soaWQsIHgsIHkpIHtcclxuICAgIGlmKGlkID09PSAnXycpIHJldHVybjtcclxuXHJcbiAgICBsZXQgcG9zWCA9IHgqdGhpcy5ibG9ja1NpemU7XHJcbiAgICBsZXQgcG9zWSA9IC15KnRoaXMuYmxvY2tTaXplO1xyXG4gICAgbGV0IGJsb2NrID0gdGhpcy5hZGRDaGlsZChuZXcgQmxvY2sodGhpcywgcG9zWCwgcG9zWSwgdGhpcy5CTE9DS1NbaWRdKSk7XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkQmxvY2snLCBibG9jayk7XHJcbiAgfVxyXG5cclxuICAvLyBDb2xsaXNpb24gV2lkaCBCbG9ja1xyXG4gIGdldEJsb2NrRnJvbVBvcyhwb3MpIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKHRoaXMuY2hpbGRyZW5baV0uY29udGFpbnNQb2ludChwb3MpKSByZXR1cm4gdGhpcy5jaGlsZHJlbltpXTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gTW92aW5nIE1hcFxyXG4gIHNjcm9sbERvd24oYmxvY2tzKSB7XHJcbiAgICBpZih0aGlzLmlzU3RvcCkgcmV0dXJuO1xyXG5cclxuICAgIC8vIFNjcm9sbCBtYXAgZG93biBvbiBYIGJsb2Nrc1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eTogdGhpcy55fSkudG8oe3k6IHRoaXMueStibG9ja3MqdGhpcy5ibG9ja1NpemV9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQqYmxvY2tzO1xyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmVtaXQoJ3Njcm9sbGVkRG93bicsIGJsb2Nrcyk7XHJcbiAgICAgIHRoaXMuY2xlYXJPdXRSYW5nZUJsb2NrcygpO1xyXG4gICAgICB0aGlzLmNvbXB1dGluZ01hcEVuZCgpO1xyXG4gICAgfSk7XHJcbiAgICBtb3ZlLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIHNjcm9sbFRvcChibG9ja3MpIHtcclxuICAgIGlmKHRoaXMuaXNTdG9wKSByZXR1cm47XHJcblxyXG4gICAgLy8gU2Nyb2xsIG1hcCB0b3Agb24gWCBibG9ja3NcclxuICAgIGxldCBtb3ZlID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBtb3ZlLmZyb20oe3k6IHRoaXMueX0pLnRvKHt5OiB0aGlzLnktYmxvY2tzKnRoaXMuYmxvY2tTaXplfSk7XHJcbiAgICBtb3ZlLnRpbWUgPSB0aGlzLnNwZWVkKmJsb2NrcztcclxuICAgIG1vdmUub24oJ2VuZCcsICgpID0+IHtcclxuICAgICAgdGhpcy5lbWl0KCdzY3JvbGxlZFRvcCcsIGJsb2Nrcyk7XHJcbiAgICAgIHRoaXMuY2xlYXJPdXRSYW5nZUJsb2NrcygpO1xyXG4gICAgICB0aGlzLmNvbXB1dGluZ01hcEVuZCgpO1xyXG4gICAgfSk7XHJcbiAgICBtb3ZlLnN0YXJ0KCk7XHJcbiAgfVxyXG5cclxuICAvLyBDb21wdXRpbmcgbWFwIGVuZCAoYW10IGJsb2NrcyA8IG1heCBhbXQgYmxvY2tzKVxyXG4gIGNvbXB1dGluZ01hcEVuZCgpIHtcclxuICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoIDwgdGhpcy5tYXhBeGlzWCoodGhpcy5nYW1lLmgvdGhpcy5ibG9ja1NpemUpKSB7XHJcbiAgICAgIHRoaXMuZW1pdCgnZW5kZWRNYXAnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGNsZWFyIG91dCByYW5nZSBtYXAgYmxvY2tzXHJcbiAgY2xlYXJPdXRSYW5nZUJsb2NrcygpIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKHRoaXMuY2hpbGRyZW5baV0ud29ybGRUcmFuc2Zvcm0udHktdGhpcy5ibG9ja1NpemUvMiA+IHRoaXMuZ2FtZS5oKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLmNoaWxkcmVuW2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdjbGVhcmVkT3V0UmFuZ2VCbG9ja3MnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwTWFuYWdlcjtcclxuIiwiLypcclxuICDQmtC70LDRgdGBINC00LvRjyDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LLQuNC00LjQvNC+0LPQviDQutC+0L3RgtC10LnQvdC10YDQsCAo0YDQsNCx0L7Rh9C40YUg0YHRhtC10L0pXHJcbiAg0KHQvtCx0YvRgtC40Y86XHJcbiAgICBhZGRlZFNjZW5lcyA9PiBzY2VuZXNcclxuICAgIGFkZGVkU2NlbmUgPT4gc2NlbmVzXHJcbiAgICByZW1vdmVkU2NlbmUgPT4gc2NlbmVcclxuICAgIHJlc3RhcnRlZFNjZW5lID0+IHNjZW5lXHJcbiAgICBkaXNhYmxlZFNjZW5lID0+IHNjZW5lXHJcbiAgICBlbmFibGVkU2NlbmUgPT4gc2NlbmVzXHJcbiAgICB1cGRhdGVkID0+IGR0XHJcbiovXHJcblxyXG5jbGFzcyBTY2VuZXNNYW5hZ2VyIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIHRoaXMuc2NlbmVzID0gcmVxdWlyZSgnLi4vc2NlbmVzJyk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gbnVsbDtcclxuICB9XHJcbiAgZ2V0U2NlbmUoaWQpIHtcclxuICAgIHJldHVybiB0aGlzLnNjZW5lc1tpZF07XHJcbiAgfVxyXG5cclxuICAvLyBhZGRpbmcgc2NlbmVzXHJcbiAgYWRkU2NlbmVzKHNjZW5lcykge1xyXG4gICAgZm9yKGxldCBpZCBpbiBzY2VuZXMpIHtcclxuICAgICAgdGhpcy5hZGRTY2VuZShpZCwgc2NlbmVzW2lkXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkU2NlbmVzJywgc2NlbmVzKTtcclxuICB9XHJcbiAgYWRkU2NlbmUoaWQsIHNjZW5lKSB7XHJcbiAgICB0aGlzLnNjZW5lc1tpZF0gPSBzY2VuZTtcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRTY2VuZScsIHNjZW5lKTtcclxuICB9XHJcbiAgcmVtb3ZlU2NlbmUoaWQpIHtcclxuICAgIGxldCBfc2NlbmUgPSB0aGlzLnNjZW5lc1tpZF07XHJcbiAgICB0aGlzLnNjZW5lc1tpZF0gPSBudWxsO1xyXG4gICAgdGhpcy5lbWl0KCdyZW1vdmVkU2NlbmUnLCBfc2NlbmUpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udHJvbHNcclxuICByZXN0YXJ0U2NlbmUoKSB7XHJcbiAgICB0aGlzLmVuYWJsZVNjZW5lKHRoaXMuYWN0aXZlU2NlbmUuX2lkU2NlbmUpO1xyXG4gICAgdGhpcy5lbWl0KCdyZXN0YXJ0ZWRTY2VuZScsIHRoaXMuYWN0aXZlU2NlbmUpO1xyXG4gIH1cclxuICBkaXNhYmxlU2NlbmUoKSB7XHJcbiAgICBsZXQgc2NlbmUgPSB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuYWN0aXZlU2NlbmUpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSA9IG51bGw7XHJcbiAgICB0aGlzLmVtaXQoJ2Rpc2FibGVkU2NlbmUnLCBzY2VuZSk7XHJcbiAgfVxyXG4gIGVuYWJsZVNjZW5lKGlkKSB7XHJcbiAgICB0aGlzLmRpc2FibGVTY2VuZSgpO1xyXG5cclxuICAgIGxldCBTY2VuZSA9IHRoaXMuZ2V0U2NlbmUoaWQpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSA9IHRoaXMuYWRkQ2hpbGQobmV3IFNjZW5lKHRoaXMuZ2FtZSwgdGhpcykpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZS5faWRTY2VuZSA9IGlkO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnZW5hYmxlZFNjZW5lJywgdGhpcy5hY3RpdmVTY2VuZSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIHRoaXMuYWN0aXZlU2NlbmUgJiYgdGhpcy5hY3RpdmVTY2VuZS51cGRhdGUgJiYgdGhpcy5hY3RpdmVTY2VuZS51cGRhdGUoZHQpO1xyXG4gICAgdGhpcy5lbWl0KCd1cGRhdGVkJywgZHQpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xyXG4iLCJjbGFzcyBTY3JlZW5NYW5hZ2VyIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTWFuYWdlcjtcclxuIiwiY29uc3QgTWFwTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL01hcE1hbmFnZXInKTtcclxuY29uc3QgTGV2ZWxNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvTGV2ZWxNYW5hZ2VyJyk7XHJcbmNvbnN0IEhpc3RvcnlNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvSGlzdG9yeU1hbmFnZXInKTtcclxuY29uc3QgU2NyZWVuTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL1NjcmVlbk1hbmFnZXInKTtcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi4vc3ViamVjdHMvUGxheWVyJyk7XHJcbmNvbnN0IFRobGVuID0gcmVxdWlyZSgnLi4vc3ViamVjdHMvVGhsZW4nKTtcclxuXHJcbmNsYXNzIFBsYXlncm91bmQgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uQ29udGFpbmVyMmQge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIC8vIENvbnN0YW50IGZvciBwb3NpdGlvbiBvYmplY3QgaW4gcHJvamVjdGlvblxyXG4gICAgdGhpcy5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgLy8gSW5pdCBvYmplY3RzXHJcbiAgICB0aGlzLnByb2plY3Rpb24gPSBuZXcgUElYSS5wcm9qZWN0aW9uLkNvbnRhaW5lcjJkKCk7XHJcbiAgICB0aGlzLnByb2plY3Rpb24ucHJvai5zZXRBeGlzWSh7eDogLXRoaXMuZ2FtZS53LzIrNTAsIHk6IDQwMDB9LCAtMSk7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMucHJvamVjdGlvbik7XHJcblxyXG4gICAgdGhpcy5tYXAgPSBuZXcgTWFwTWFuYWdlcih0aGlzKTtcclxuICAgIHRoaXMucHJvamVjdGlvbi5hZGRDaGlsZCh0aGlzLm1hcCk7XHJcblxyXG4gICAgdGhpcy5sZXZlbHMgPSBuZXcgTGV2ZWxNYW5hZ2VyKHRoaXMsIHRoaXMubWFwKTtcclxuXHJcbiAgICB0aGlzLnNjcmVlbiA9IG5ldyBTY3JlZW5NYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5oaXN0b3J5ID0gbmV3IEhpc3RvcnlNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMsIHRoaXMubWFwKTtcclxuICAgIHRoaXMudGhsZW4gPSBuZXcgVGhsZW4odGhpcyk7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuc2NyZWVuLCB0aGlzLmhpc3RvcnksIHRoaXMucGxheWVyLCB0aGlzLnRobGVuKTtcclxuXHJcbiAgICAvLyBDb250cm9sc1xyXG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xyXG4gIH1cclxuICBfYmluZEV2ZW50cygpIHtcclxuICAgIHRoaXMub24oJ3BvaW50ZXJkb3duJywgKCkgPT4gdGhpcy5wbGF5ZXIuaW1tdW5pdHkoKSk7XHJcbiAgICB0aGlzLm9uKCdwb2ludGVybW92ZScsIChlKSA9PiB7XHJcbiAgICAgIGxldCBibG9jayA9IHRoaXMubWFwLmdldEJsb2NrRnJvbVBvcyhlLmRhdGEuZ2xvYmFsKTtcclxuICAgICAgYmxvY2sgJiYgYmxvY2suaGl0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnBsYXllci5vbignZGVhZGVkJywgKCkgPT4gdGhpcy5yZXN0YXJ0KCkpO1xyXG4gICAgdGhpcy5wbGF5ZXIub24oJ2NvbGxpc2lvbicsIChibG9jaykgPT4ge1xyXG4gICAgICBpZihibG9jay5hY3Rpb24gPT09ICdoaXN0b3J5JykgdGhpcy5oaXN0b3J5LnNob3dUZXh0KHRoaXMubGV2ZWxzLmdldEN1cnJlbnRMZXZlbCgpLmhpc3RvcnkucnUsIDMwMDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5oaXN0b3J5Lm9uKCdzaG93ZW4nLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubWFwLmlzU3RvcCA9IHRydWU7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuaGlzdG9yeS5vbignaGlkZGVuJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLm1hcC5pc1N0b3AgPSBmYWxzZTtcclxuICAgICAgdGhpcy5tYXAuc2Nyb2xsRG93bigxKTtcclxuICAgICAgdGhpcy5sZXZlbHMubmV4dExldmVsKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm1hcC5vbignZW5kZWRNYXAnLCAoKSA9PiB0aGlzLmxldmVscy5uZXh0RnJhZ21lbnQoKSk7XHJcbiAgICB0aGlzLm1hcC5vbignc2Nyb2xsZWREb3duJywgKCkgPT4gdGhpcy5wbGF5ZXIubW92aW5nKCkpO1xyXG5cclxuICAgIHRoaXMubGV2ZWxzLnN3aXRjaExldmVsKDApO1xyXG4gICAgdGhpcy5tYXAuc2Nyb2xsRG93bigxKTtcclxuICB9XHJcbiAgcmVzdGFydCgpIHtcclxuICAgIHRoaXMuZ2FtZS5zY2VuZXMucmVzdGFydFNjZW5lKCdwbGF5Z3JvdW5kJyk7XHJcblxyXG4gICAgLy8gdGhpcy5zY3JlZW4uc3BsYXNoKDB4RkZGRkZGLCAxMDAwKS50aGVuKCgpID0+IHtcclxuICAgIC8vICAgdGhpcy5nYW1lLnNjZW5lcy5yZXN0YXJ0U2NlbmUoJ3BsYXlncm91bmQnKTtcclxuICAgIC8vIH0pO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLnRobGVuLnVwZGF0ZSgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Z3JvdW5kO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAncGxheWdyb3VuZCc6IHJlcXVpcmUoJy4vUGxheWdyb3VuZCcpXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZShwYXJhbXMpe1xuICAgICAgdmFyIHRlbXBsYXRlID0gXCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247IFxcblwiICtcclwiIFxcblwiICtcblwiYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2b2lkIG1haW4odm9pZCkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiBcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICAgICAgZm9yKHZhciBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcInt7XCIra2V5K1wifX1cIixcImdcIilcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKG1hdGNoZXIsIHBhcmFtc1trZXldKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2UocGFyYW1zKXtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IFwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSB2ZWM0IGZpbHRlckFyZWE7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidW5pZm9ybSBmbG9hdCB0aW1lOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgY2xvdWREZW5zaXR5OyBcdC8vIG92ZXJhbGwgZGVuc2l0eSBbMCwxXSBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgbm9pc2luZXNzOyBcdC8vIG92ZXJhbGwgc3RyZW5ndGggb2YgdGhlIG5vaXNlIGVmZmVjdCBbMCwxXSBcXG5cIiArXHJcIiBcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgc3BlZWQ7XHRcdFx0Ly8gY29udHJvbHMgdGhlIGFuaW1hdGlvbiBzcGVlZCBbMCwgMC4xIGlzaCkgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IGNsb3VkSGVpZ2h0OyBcdC8vIChpbnZlcnNlKSBoZWlnaHQgb2YgdGhlIGlucHV0IGdyYWRpZW50IFswLC4uLikgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyBTaW1wbGV4IG5vaXNlIGJlbG93ID0gY3RybCtjLCBjdHJsK3Y6IFxcblwiICtcclwiIFxcblwiICtcblwiLy8gRGVzY3JpcHRpb24gOiBBcnJheSBhbmQgdGV4dHVyZWxlc3MgR0xTTCAyRC8zRC80RCBzaW1wbGV4IFxcblwiICtcclwiIFxcblwiICtcblwiLy8gICAgICAgICAgICAgICBub2lzZSBmdW5jdGlvbnMuIFxcblwiICtcclwiIFxcblwiICtcblwiLy8gICAgICBBdXRob3IgOiBJYW4gTWNFd2FuLCBBc2hpbWEgQXJ0cy4gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyAgTWFpbnRhaW5lciA6IGlqbSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vICAgICBMYXN0bW9kIDogMjAxMTA4MjIgKGlqbSkgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyAgICAgTGljZW5zZSA6IENvcHlyaWdodCAoQykgMjAxMSBBc2hpbWEgQXJ0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyAgICAgICAgICAgICAgIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZS4gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyAgICAgICAgICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2hpbWEvd2ViZ2wtbm9pc2UgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZlYzIgbWFwQ29vcmQodmVjMiBjb29yZCkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBjb29yZCAqPSBmaWx0ZXJBcmVhLnh5OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICBjb29yZCArPSBmaWx0ZXJBcmVhLnp3OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICByZXR1cm4gY29vcmQ7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cInZlYzMgbW9kMjg5KHZlYzMgeCkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgcmV0dXJuIHggLSBmbG9vcih4ICogKDEuMCAvIDI4OS4wKSkgKiAyODkuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidmVjNCBtb2QyODkodmVjNCB4KSB7IFxcblwiICtcclwiIFxcblwiICtcblwiICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2ZWM0IHBlcm11dGUodmVjNCB4KSB7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgICByZXR1cm4gbW9kMjg5KCgoeCozNC4wKSsxLjApKngpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ2ZWM0IHRheWxvckludlNxcnQodmVjNCByKSBcXG5cIiArXHJcIiBcXG5cIiArXG5cInsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHJldHVybiAxLjc5Mjg0MjkxNDAwMTU5IC0gMC44NTM3MzQ3MjA5NTMxNCAqIHI7IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cImZsb2F0IHNub2lzZSh2ZWMzIHYpIFxcblwiICtcclwiIFxcblwiICtcblwiICB7IFxcblwiICtcclwiIFxcblwiICtcblwiICBjb25zdCB2ZWMyICBDID0gdmVjMigxLjAvNi4wLCAxLjAvMy4wKSA7IFxcblwiICtcclwiIFxcblwiICtcblwiICBjb25zdCB2ZWM0ICBEID0gdmVjNCgwLjAsIDAuNSwgMS4wLCAyLjApOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vIEZpcnN0IGNvcm5lciBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyBpICA9IGZsb29yKHYgKyBkb3QodiwgQy55eXkpICk7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzIHgwID0gICB2IC0gaSArIGRvdChpLCBDLnh4eCkgOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vIE90aGVyIGNvcm5lcnMgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzMgZyA9IHN0ZXAoeDAueXp4LCB4MC54eXopOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyBsID0gMS4wIC0gZzsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzMgaTEgPSBtaW4oIGcueHl6LCBsLnp4eSApOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyBpMiA9IG1heCggZy54eXosIGwuenh5ICk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICAvLyAgIHgwID0geDAgLSAwLjAgKyAwLjAgKiBDLnh4eDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIC8vICAgeDEgPSB4MCAtIGkxICArIDEuMCAqIEMueHh4OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgLy8gICB4MiA9IHgwIC0gaTIgICsgMi4wICogQy54eHg7IFxcblwiICtcclwiIFxcblwiICtcblwiICAvLyAgIHgzID0geDAgLSAxLjAgKyAzLjAgKiBDLnh4eDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzMgeDEgPSB4MCAtIGkxICsgQy54eHg7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzIHgyID0geDAgLSBpMiArIEMueXl5OyAvLyAyLjAqQy54ID0gMS8zID0gQy55IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzIHgzID0geDAgLSBELnl5eTsgICAgICAvLyAtMS4wKzMuMCpDLnggPSAtMC41ID0gLUQueSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vIFBlcm11dGF0aW9ucyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgaSA9IG1vZDI4OShpKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgcCA9IHBlcm11dGUoIHBlcm11dGUoIHBlcm11dGUoIFxcblwiICtcclwiIFxcblwiICtcblwiICAgICAgICAgICAgIGkueiArIHZlYzQoMC4wLCBpMS56LCBpMi56LCAxLjAgKSkgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgICAgICAgICsgaS55ICsgdmVjNCgwLjAsIGkxLnksIGkyLnksIDEuMCApKSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICAgICAgICAgKyBpLnggKyB2ZWM0KDAuMCwgaTEueCwgaTIueCwgMS4wICkpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vIEdyYWRpZW50czogN3g3IHBvaW50cyBvdmVyIGEgc3F1YXJlLCBtYXBwZWQgb250byBhbiBvY3RhaGVkcm9uLiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vIFRoZSByaW5nIHNpemUgMTcqMTcgPSAyODkgaXMgY2xvc2UgdG8gYSBtdWx0aXBsZSBvZiA0OSAoNDkqNiA9IDI5NCkgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIGZsb2F0IG5fID0gMC4xNDI4NTcxNDI4NTc7IC8vIDEuMC83LjAgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzMgIG5zID0gbl8gKiBELnd5eiAtIEQueHp4OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBqID0gcCAtIDQ5LjAgKiBmbG9vcihwICogbnMueiAqIG5zLnopOyAgLy8gIG1vZChwLDcqNykgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgeF8gPSBmbG9vcihqICogbnMueik7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IHlfID0gZmxvb3IoaiAtIDcuMCAqIHhfICk7ICAgIC8vIG1vZChqLE4pIFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IHggPSB4XyAqbnMueCArIG5zLnl5eXk7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IHkgPSB5XyAqbnMueCArIG5zLnl5eXk7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IGggPSAxLjAgLSBhYnMoeCkgLSBhYnMoeSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IGIwID0gdmVjNCggeC54eSwgeS54eSApOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBiMSA9IHZlYzQoIHguencsIHkuencgKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIC8vdmVjNCBzMCA9IHZlYzQobGVzc1RoYW4oYjAsMC4wKSkqMi4wIC0gMS4wOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgLy92ZWM0IHMxID0gdmVjNChsZXNzVGhhbihiMSwwLjApKSoyLjAgLSAxLjA7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IHMwID0gZmxvb3IoYjApKjIuMCArIDEuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzQgczEgPSBmbG9vcihiMSkqMi4wICsgMS4wOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBzaCA9IC1zdGVwKGgsIHZlYzQoMC4wKSk7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IGEwID0gYjAueHp5dyArIHMwLnh6eXcqc2gueHh5eSA7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IGExID0gYjEueHp5dyArIHMxLnh6eXcqc2guenp3dyA7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzIHAwID0gdmVjMyhhMC54eSxoLngpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjMyBwMSA9IHZlYzMoYTAuencsaC55KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHZlYzMgcDIgPSB2ZWMzKGExLnh5LGgueik7IFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWMzIHAzID0gdmVjMyhhMS56dyxoLncpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vTm9ybWFsaXNlIGdyYWRpZW50cyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgdmVjNCBub3JtID0gdGF5bG9ySW52U3FydCh2ZWM0KGRvdChwMCxwMCksIGRvdChwMSxwMSksIGRvdChwMiwgcDIpLCBkb3QocDMscDMpKSk7IFxcblwiICtcclwiIFxcblwiICtcblwiICBwMCAqPSBub3JtLng7IFxcblwiICtcclwiIFxcblwiICtcblwiICBwMSAqPSBub3JtLnk7IFxcblwiICtcclwiIFxcblwiICtcblwiICBwMiAqPSBub3JtLno7IFxcblwiICtcclwiIFxcblwiICtcblwiICBwMyAqPSBub3JtLnc7IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiLy8gTWl4IGZpbmFsIG5vaXNlIHZhbHVlIFxcblwiICtcclwiIFxcblwiICtcblwiICB2ZWM0IG0gPSBtYXgoMC42IC0gdmVjNChkb3QoeDAseDApLCBkb3QoeDEseDEpLCBkb3QoeDIseDIpLCBkb3QoeDMseDMpKSwgMC4wKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIG0gPSBtICogbTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgIHJldHVybiA0Mi4wICogZG90KCBtKm0sIHZlYzQoIGRvdChwMCx4MCksIGRvdChwMSx4MSksIFxcblwiICtcclwiIFxcblwiICtcblwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3QocDIseDIpLCBkb3QocDMseDMpICkgKTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwiLy8vIENsb3VkIHN0dWZmOiBcXG5cIiArXHJcIiBcXG5cIiArXG5cImNvbnN0IGZsb2F0IG1heGltdW0gPSAxLjAvMS4wICsgMS4wLzIuMCArIDEuMC8zLjAgKyAxLjAvNC4wICsgMS4wLzUuMCArIDEuMC82LjAgKyAxLjAvNy4wICsgMS4wLzguMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIvLyBGcmFjdGFsIEJyb3duaWFuIG1vdGlvbiwgb3Igc29tZXRoaW5nIHRoYXQgcGFzc2VzIGZvciBpdCBhbnl3YXk6IHJhbmdlIFstMSwgMV0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJmbG9hdCBmQm0odmVjMyB1dikgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIGZsb2F0IHN1bSA9IDAuMDsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgZm9yIChpbnQgaSA9IDA7IGkgPCA4OyArK2kpIHsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgICAgIGZsb2F0IGYgPSBmbG9hdChpKzEpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgICAgICAgc3VtICs9IHNub2lzZSh1dipmKSAvIGY7IFxcblwiICtcclwiIFxcblwiICtcblwiICAgIH0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgICAgcmV0dXJuIHN1bSAvIG1heGltdW07IFxcblwiICtcclwiIFxcblwiICtcblwifSBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiBcXG5cIiArXHJcIiBcXG5cIiArXG5cIi8vIFNpbXBsZSB2ZXJ0aWNhbCBncmFkaWVudDogXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJmbG9hdCBncmFkaWVudCh2ZWMyIHV2KSB7IFxcblwiICtcclwiIFxcblwiICtcblwiIFx0cmV0dXJuICgxLjAgLSB1di55ICogdXYueSAqIGNsb3VkSGVpZ2h0KTsgXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCJ9IFxcblwiICtcclwiIFxcblwiICtcblwiIFxcblwiICtcclwiIFxcblwiICtcblwidm9pZCBtYWluKCkgeyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIlx0Ly8gdmVjMiB1diA9IG1hcENvb3JkKHZUZXh0dXJlQ29vcmQpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgLy8gdmVjMyBwID0gdmVjMyh1diwgdGltZSpzcGVlZCk7IFxcblwiICtcclwiIFxcblwiICtcblwiICAvLyB2ZWMzIHNvbWVSYW5kb21PZmZzZXQgPSB2ZWMzKDAuMSwgMC4zLCAwLjIpOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIiAgLy8gdmVjMiBkdXYgPSB2ZWMyKGZCbShwKSwgZkJtKHAgKyBzb21lUmFuZG9tT2Zmc2V0KSkgKiBub2lzaW5lc3M7IFxcblwiICtcclwiIFxcblwiICtcblwiICAvLyBmbG9hdCBxID0gZ3JhZGllbnQodXYgKyBkdXYpICogY2xvdWREZW5zaXR5OyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIlx0Z2xfRnJhZ0NvbG9yID0gdmVjNCguMSwgLjEsIC4xLCAxLjApOyBcXG5cIiArXHJcIiBcXG5cIiArXG5cIn0gXFxuXCIgK1xyXCIgXFxuXCIgK1xuXCIgXFxuXCIgXG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge31cbiAgICAgIGZvcih2YXIga2V5IGluIHBhcmFtcykge1xuICAgICAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJ7e1wiK2tleStcIn19XCIsXCJnXCIpXG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShtYXRjaGVyLCBwYXJhbXNba2V5XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgIH07XG4iLCJjb25zdCBmcmFnID0gcmVxdWlyZSgnLi9jbG91ZHMuZnJhZycpO1xyXG5jb25zdCB2ZXJ0ID0gcmVxdWlyZSgnLi4vYmFzaWMudmVydCcpO1xyXG5cclxuY2xhc3MgQ2xvdWRzRmlsdGVyIGV4dGVuZHMgUElYSS5GaWx0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIHN1cGVyKHZlcnQoKSwgZnJhZygpLCB7XHJcbiAgICAgIGNsb3VkRGVuc2l0eToge1xyXG4gICAgICAgIHR5cGU6ICdmbG9hdCcsXHJcbiAgICAgICAgdmFsdWU6IDAuM1xyXG4gICAgICB9LFxyXG4gICAgICBjbG91ZEhlaWdodDoge1xyXG4gICAgICAgIHR5cGU6ICdmbG9hdCcsXHJcbiAgICAgICAgdmFsdWU6IDAuM1xyXG4gICAgICB9LFxyXG4gICAgICBzcGVlZDoge1xyXG4gICAgICAgIHR5cGU6ICdmbG9hdCcsXHJcbiAgICAgICAgdmFsdWU6IDEuMFxyXG4gICAgICB9LFxyXG4gICAgICBub2lzaW5lc3M6IHtcclxuICAgICAgICB0eXBlOiAnZmxvYXQnLFxyXG4gICAgICAgIHZhbHVlOiAwLjVcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgIGNsb3VkRGVuc2l0eTogMC4zLFxyXG4gICAgICBub2lzaW5lc3M6IDAuMyxcclxuICAgICAgc3BlZWQ6IDEuMCxcclxuICAgICAgY2xvdWRIZWlnaHQ6IDAuNVxyXG4gICAgfSwgb3B0aW9ucyk7XHJcbiAgfVxyXG4gIHNldCBjbG91ZERlbnNpdHkodikge1xyXG4gICAgdGhpcy51bmlmb3Jtcy5jbG91ZERlbnNpdHkgPSB2O1xyXG4gIH1cclxuICBnZXQgY2xvdWREZW5zaXR5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5pZm9ybXMuY2xvdWREZW5zaXR5O1xyXG4gIH1cclxuXHJcbiAgc2V0IG5vaXNpbmVzcyh2KSB7XHJcbiAgICB0aGlzLnVuaWZvcm1zLm5vaXNpbmVzcyA9IHY7XHJcbiAgfVxyXG4gIGdldCBub2lzaW5lc3MoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5ub2lzaW5lc3M7XHJcbiAgfVxyXG5cclxuICBzZXQgc3BlZWQodikge1xyXG4gICAgdGhpcy51bmlmb3Jtcy5zcGVlZCA9IHY7XHJcbiAgfVxyXG4gIGdldCBzcGVlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnVuaWZvcm1zLnNwZWVkO1xyXG4gIH1cclxuXHJcbiAgc2V0IGNsb3VkSGVpZ2h0KHYpIHtcclxuICAgIHRoaXMudW5pZm9ybXMuY2xvdWRIZWlnaHQgPSB2O1xyXG4gIH1cclxuICBnZXQgY2xvdWRIZWlnaHQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmlmb3Jtcy5jbG91ZEhlaWdodDtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2xvdWRzRmlsdGVyO1xyXG4iLCIvKlxyXG4gINCa0LvQsNGB0YEg0JHQu9C+0LrQsCwg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDRgtCw0LnQu9C+0LLQvtCz0L4g0LTQstC40LbQutCwXHJcbiAg0KHQvtCx0YvRgtC40Y86XHJcbiAgICBhY3RpdmF0ZWRcclxuICAgIGRlYWN0aXZhdGVkXHJcbiAgICBoaXRlZFxyXG4qL1xyXG5cclxuY2xhc3MgQmxvY2sgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uU3ByaXRlMmQge1xyXG4gIGNvbnN0cnVjdG9yKG1hcCwgeCwgeSwgcGFyYW1zPXt9KSB7XHJcbiAgICBzdXBlcihQSVhJLlRleHR1cmUuZnJvbUZyYW1lKHBhcmFtcy5pbWFnZSB8fCBwYXJhbXMuYWN0aXZhdGlvbkltYWdlKSk7XHJcblxyXG4gICAgdGhpcy5tYXAgPSBtYXA7XHJcbiAgICB0aGlzLmdhbWUgPSB0aGlzLm1hcC5nYW1lO1xyXG5cclxuICAgIHRoaXMuc2NvcmUgPSBwYXJhbXMuc2NvcmU7XHJcbiAgICB0aGlzLmFjdGl2YXRpb24gPSBwYXJhbXMuYWN0aXZhdGlvbiB8fCBudWxsO1xyXG4gICAgdGhpcy5kZWFjdGl2YXRpb25UZXh0dXJlID0gcGFyYW1zLmltYWdlID8gUElYSS5UZXh0dXJlLmZyb21GcmFtZShwYXJhbXMuaW1hZ2UpIDogbnVsbDtcclxuICAgIHRoaXMuYWN0aXZhdGlvblRleHR1cmUgPSBwYXJhbXMuYWN0aXZhdGlvbkltYWdlID8gUElYSS5UZXh0dXJlLmZyb21GcmFtZShwYXJhbXMuYWN0aXZhdGlvbkltYWdlKSA6IG51bGw7XHJcbiAgICB0aGlzLmlzQWN0aXZlID0gcGFyYW1zLmFjdGl2ZTtcclxuICAgIHRoaXMucGxheWVyRGlyID0gcGFyYW1zLnBsYXllckRpciB8fCBudWxsO1xyXG4gICAgdGhpcy5hY3Rpb24gPSBwYXJhbXMuYWN0aW9uIHx8IG51bGw7XHJcblxyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuICAgIHRoaXMud2lkdGggPSBtYXAuYmxvY2tTaXplKzE7XHJcbiAgICB0aGlzLmhlaWdodCA9IG1hcC5ibG9ja1NpemUrMTtcclxuICAgIHRoaXMueCA9IHgrbWFwLmJsb2NrU2l6ZS8yKy41O1xyXG4gICAgdGhpcy55ID0geSttYXAuYmxvY2tTaXplLzIrLjU7XHJcbiAgfVxyXG4gIGFjdGl2YXRlKCkge1xyXG4gICAgbGV0IGFjdGl2YXRpbmcgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKVxyXG4gICAgICAuZnJvbSh7d2lkdGg6IHRoaXMud2lkdGgqMy80LCBoZWlnaHQ6IHRoaXMuaGVpZ2h0KjMvNH0pXHJcbiAgICAgIC50byh7d2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQsIHJvdGF0aW9uOiAwfSk7XHJcbiAgICBhY3RpdmF0aW5nLnRpbWUgPSA1MDA7XHJcbiAgICBhY3RpdmF0aW5nLmVhc2luZyA9IFBJWEkudHdlZW4uRWFzaW5nLm91dEJvdW5jZSgpO1xyXG4gICAgYWN0aXZhdGluZy5zdGFydCgpO1xyXG5cclxuICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uVGV4dHVyZSkgdGhpcy50ZXh0dXJlID0gdGhpcy5hY3RpdmF0aW9uVGV4dHVyZTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ2FjdGl2YXRlZCcpO1xyXG4gIH1cclxuICBkZWFjdGl2YXRlKCkge1xyXG4gICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgaWYodGhpcy5kZWFjdGl2YXRpb25UZXh0dXJlKSB0aGlzLnRleHR1cmUgPSB0aGlzLmRlYWN0aXZhdGlvblRleHR1cmU7XHJcbiAgICB0aGlzLmVtaXQoJ2RlYWN0aXZhdGVkJyk7XHJcbiAgfVxyXG4gIGhpdCgpIHtcclxuICAgIGlmKHRoaXMuYWN0aXZhdGlvbiA9PT0gbnVsbCB8fCB0aGlzLmlzQWN0aXZlKSByZXR1cm47XHJcblxyXG4gICAgbGV0IGpvbHRpbmcgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIGpvbHRpbmcuZnJvbSh7cm90YXRpb246IDB9KS50byh7cm90YXRpb246IE1hdGgucmFuZG9tKCkgPCAuNSA/IC0uMTUgOiAuMTV9KTtcclxuICAgIGpvbHRpbmcudGltZSA9IDEwMDtcclxuICAgIGpvbHRpbmcucGluZ1BvbmcgPSB0cnVlO1xyXG4gICAgam9sdGluZy5zdGFydCgpO1xyXG5cclxuICAgIGlmKHRoaXMuYWN0aXZhdGlvbikgdGhpcy5hY3RpdmF0aW9uLS07XHJcbiAgICBlbHNlIHRoaXMuYWN0aXZhdGUoKTtcclxuICAgIHRoaXMuZW1pdCgnaGl0ZWQnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XHJcbiIsIi8qXHJcbiAg0JrQu9Cw0YHRgSBQbGF5ZXIsINCy0LfQsNC40LzQvtC00LXQudGB0YLQstGD0LXRgiDRgSBNYXBNYW5hZ2VyXHJcbiAg0KHQvtCx0YvRgtC40Y9cclxuICAgIGNvbGxpc2lvbiA9PiBjb2xsaXNpb24gYmxvY2tcclxuICAgIG1vdmVkXHJcbiAgICBkZWFkZWRcclxuXHJcbiAgICBhY3Rpb25JbW11bml0eVxyXG4gICAgYWN0aW9uVG9wXHJcbiAgICBhY3Rpb25MZWZ0XHJcbiAgICBhY3Rpb25SaWdodFxyXG4qL1xyXG5cclxuY2xhc3MgUGxheWVyIGV4dGVuZHMgUElYSS5TcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lLCBtYXApIHtcclxuICAgIHN1cGVyKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ3BsYXllcicpKTtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5tYXAgPSBtYXA7XHJcblxyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41LCAxKTtcclxuICAgIHRoaXMuc2NhbGUuc2V0KC43KTtcclxuICAgIHRoaXMueCA9IHRoaXMuZ2FtZS53LzIrNTtcclxuICAgIHRoaXMueSA9IHRoaXMuZ2FtZS5oLXRoaXMubWFwLmJsb2NrU2l6ZSoyLjM7XHJcblxyXG4gICAgdGhpcy53YWxraW5nID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICB0aGlzLndhbGtpbmcuZnJvbSh7eTogdGhpcy55fSkudG8oe3k6IHRoaXMueS01fSk7XHJcbiAgICB0aGlzLndhbGtpbmcudGltZSA9IDgwMDtcclxuICAgIHRoaXMud2Fsa2luZy5sb29wID0gdHJ1ZTtcclxuICAgIHRoaXMud2Fsa2luZy5waW5nUG9uZyA9IHRydWU7XHJcbiAgICB0aGlzLndhbGtpbmcuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gbnVsbDtcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLm1hcC5zcGVlZCB8fCA1MDA7XHJcbiAgICB0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuSU1NVU5JVFlfQkxPQ0tTID0gMjtcclxuICAgIHRoaXMuaW1tdW5pdHlDb3VudCA9IDU7XHJcbiAgICB0aGlzLmlzSW1tdW5pdHkgPSBmYWxzZTtcclxuICB9XHJcbiAgbW92aW5nKCkge1xyXG4gICAgaWYodGhpcy5pc0RlYWQgfHwgdGhpcy5pc0ltbXVuaXR5KSByZXR1cm47XHJcblxyXG4gICAgbGV0IGN1ciA9IHRoaXMubWFwLmdldEJsb2NrRnJvbVBvcyh7eDogdGhpcy54LCB5OiB0aGlzLnl9KTtcclxuICAgIGlmKGN1ciAmJiBjdXIuaXNBY3RpdmUpIHtcclxuICAgICAgdGhpcy5lbWl0KCdjb2xsaXNpb24nLCBjdXIpO1xyXG5cclxuICAgICAgaWYoY3VyLnBsYXllckRpciA9PT0gJ3RvcCcpIHJldHVybiB0aGlzLnRvcCgpO1xyXG4gICAgICBpZihjdXIucGxheWVyRGlyID09PSAnbGVmdCcpIHJldHVybiB0aGlzLmxlZnQoKTtcclxuICAgICAgaWYoY3VyLnBsYXllckRpciA9PT0gJ3JpZ2h0JykgcmV0dXJuIHRoaXMucmlnaHQoKTtcclxuXHJcbiAgICAgIC8vY2hlY2sgdG9wXHJcbiAgICAgIGxldCB0b3AgPSB0aGlzLm1hcC5nZXRCbG9ja0Zyb21Qb3Moe3g6IHRoaXMueCwgeTogdGhpcy55LXRoaXMubWFwLmJsb2NrU2l6ZX0pO1xyXG4gICAgICBpZih0b3AgJiYgdG9wLmlzQWN0aXZlICYmIHRoaXMubGFzdE1vdmUgIT09ICdib3R0b20nKSByZXR1cm4gdGhpcy50b3AoKTtcclxuXHJcbiAgICAgIC8vIGNoZWNrIGxlZnRcclxuICAgICAgbGV0IGxlZnQgPSB0aGlzLm1hcC5nZXRCbG9ja0Zyb21Qb3Moe3g6IHRoaXMueC10aGlzLm1hcC5ibG9ja1NpemUsIHk6IHRoaXMueX0pO1xyXG4gICAgICBpZihsZWZ0ICYmIGxlZnQuaXNBY3RpdmUgJiYgdGhpcy5sYXN0TW92ZSAhPT0gJ3JpZ2h0JykgcmV0dXJuIHRoaXMubGVmdCgpO1xyXG5cclxuICAgICAgLy8gY2hlY2sgcmlndGhcclxuICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHt4OiB0aGlzLngrdGhpcy5tYXAuYmxvY2tTaXplLCB5OiB0aGlzLnl9KTtcclxuICAgICAgaWYocmlnaHQgJiYgcmlnaHQuaXNBY3RpdmUgJiYgdGhpcy5sYXN0TW92ZSAhPT0gJ2xlZnQnKSByZXR1cm4gdGhpcy5yaWdodCgpO1xyXG5cclxuICAgICAgLy8gb3IgZGllXHJcbiAgICAgIHRoaXMudG9wKCk7XHJcbiAgICB9IGVsc2UgdGhpcy5kZWFkKCk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdtb3ZlZCcpO1xyXG4gIH1cclxuICBkZWFkKCkge1xyXG4gICAgdGhpcy53YWxraW5nLnN0b3AoKTtcclxuICAgIHRoaXMuaXNEZWFkID0gdHJ1ZTtcclxuXHJcbiAgICBsZXQgZGVhZCA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMuc2NhbGUpO1xyXG4gICAgZGVhZC5mcm9tKHRoaXMuc2NhbGUpLnRvKHt4OiAwLCB5OiAwfSk7XHJcbiAgICBkZWFkLnRpbWUgPSAyMDA7XHJcbiAgICBkZWFkLnN0YXJ0KCk7XHJcbiAgICBkZWFkLm9uKCdlbmQnLCAoKSA9PiB0aGlzLmVtaXQoJ2RlYWRlZCcpKTtcclxuICB9XHJcbiAgaW1tdW5pdHkoKSB7XHJcbiAgICBpZighdGhpcy5pbW11bml0eUNvdW50KSByZXR1cm47XHJcblxyXG4gICAgbGV0IGltbXVuaXR5ID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBpbW11bml0eS5mcm9tKHthbHBoYTogLjV9KS50byh7YWxwaGE6IDF9KTtcclxuICAgIGltbXVuaXR5LnRpbWUgPSB0aGlzLnNwZWVkKnRoaXMuSU1NVU5JVFlfQkxPQ0tTO1xyXG4gICAgaW1tdW5pdHkuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLm1hcC5zY3JvbGxEb3duKHRoaXMuSU1NVU5JVFlfQkxPQ0tTKTtcclxuICAgIGltbXVuaXR5Lm9uKCdlbmQnLCAoKSA9PiB0aGlzLmlzSW1tdW5pdHkgPSBmYWxzZSk7XHJcbiAgICB0aGlzLmlzSW1tdW5pdHkgPSB0cnVlO1xyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICd0b3AnO1xyXG4gICAgdGhpcy5pbW11bml0eUNvdW50LS07XHJcblxyXG4gICAgdGhpcy5lbWl0KCdhY3Rpb25JbW11bml0eScpO1xyXG4gIH1cclxuICB0b3AoKSB7XHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gJ3RvcCc7XHJcbiAgICB0aGlzLm1hcC5zY3JvbGxEb3duKDEpO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uVG9wJyk7XHJcbiAgfVxyXG4gIGxlZnQoKSB7XHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gJ2xlZnQnO1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eDogdGhpcy54fSkudG8oe3g6IHRoaXMueC10aGlzLm1hcC5ibG9ja1NpemUtMjB9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQvMjtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuXHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB0aGlzLm1vdmluZygpKTtcclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uTGVmdCcpO1xyXG4gIH1cclxuICByaWdodCgpIHtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAncmlnaHQnO1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eDogdGhpcy54fSkudG8oe3g6IHRoaXMueCt0aGlzLm1hcC5ibG9ja1NpemUrMjB9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQvMjtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuXHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB0aGlzLm1vdmluZygpKTtcclxuICAgIHRoaXMuZW1pdCgnYWN0aW9uUmlnaHQnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xyXG4iLCJjbGFzcyBUaGxlbiBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG5cclxuICAgIHRoaXMuUEFERElOID0gNTA7XHJcblxyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZSgnZGlzcGxhY2VtZW50JykpO1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUudGV4dHVyZS5iYXNlVGV4dHVyZS53cmFwTW9kZSA9IFBJWEkuV1JBUF9NT0RFUy5SRVBFQVQ7XHJcbiAgICBzY2VuZS5hZGRDaGlsZCh0aGlzLmRpc3BsYWNlbWVudFNwcml0ZSk7XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudEZpbHRlciA9IG5ldyBQSVhJLmZpbHRlcnMuRGlzcGxhY2VtZW50RmlsdGVyKHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlKTtcclxuXHJcbiAgICB0aGlzLnRobGVuID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ3RobGVuJykpO1xyXG4gICAgdGhpcy50aGxlbi53aWR0aCA9IHRoaXMuZ2FtZS53K3RoaXMuUEFERElOO1xyXG4gICAgdGhpcy50aGxlbi55ID0gdGhpcy5nYW1lLmgtdGhpcy50aGxlbi5oZWlnaHQrdGhpcy5QQURESU47XHJcbiAgICB0aGlzLnRobGVuLnggPSAtdGhpcy5QQURESU4vMjtcclxuICAgIHRoaXMudGhsZW4uZmlsdGVycyA9IFt0aGlzLmRpc3BsYWNlbWVudEZpbHRlcl07XHJcbiAgICBzY2VuZS5hZGRDaGlsZCh0aGlzLnRobGVuKTtcclxuICB9XHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRTcHJpdGUueCArPSAxMDtcclxuICAgIHRoaXMuZGlzcGxhY2VtZW50U3ByaXRlLnkgKz0gMTA7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRobGVuO1xyXG4iLCIvKlxyXG5UaGlzIHV0aWwgY2xhc3MgZm9yIGNvbnZlcnRlZCBkYXRhIGZyb20gZnJhZ21lbnRzLmpzb25cclxub2JqZWN0IHRvIHNpbXBsZSBtYXAgYXJyYXksIGZvciBleGFtcGxlOiBbJ0EnLCAnQScsICdBJywgJ0EnXVxyXG4qL1xyXG5cclxuY2xhc3MgRGF0YUZyYWdtZW50Q29udmVydGVyIHtcclxuICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy5pbnB1dE1hcCA9IGRhdGEubWFwO1xyXG4gICAgdGhpcy5mcmFnbWVudCA9IFtdO1xyXG5cclxuICAgIC8vIE9QRVJBVE9SU1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGRhdGEubWFwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKH5+ZGF0YS5tYXBbaV0uaW5kZXhPZignfCcpKSB0aGlzLmNhc2VPcGVyYXRvcihkYXRhLm1hcFtpXSwgaSk7XHJcbiAgICAgIGVsc2UgdGhpcy5mcmFnbWVudFtpXSA9IGRhdGEubWFwW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1FVEhPRFNcclxuICAgIGRhdGEudHJpbSAmJiB0aGlzLnJhbmRvbVRyaW0oZGF0YS50cmltKTtcclxuICAgIGRhdGEuYXBwZW5kICYmIHRoaXMucmFuZG9tQXBwZW5kKGRhdGEuYXBwZW5kKTtcclxuICAgIGRhdGEuc2h1ZmZsZSAmJiB0aGlzLnNodWZmbGUoKTtcclxuICB9XHJcblxyXG4gIC8vIE9QRVJBVE9SU1xyXG4gIC8vIENhc2Ugb3BlcmF0b3I6ICdBfEJ8Q3xEJyA9PiBDIGFuZCBldGMuLi5cclxuICBjYXNlT3BlcmF0b3Ioc3RyLCBpKSB7XHJcbiAgICBsZXQgaWRzID0gc3RyLnNwbGl0KCd8Jyk7XHJcbiAgICB0aGlzLmZyYWdtZW50W2ldID0gaWRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSppZHMubGVuZ3RoKV07XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIE1FVEhPRFNcclxuICAvLyBUcmltbWluZyBhcnJheSBpbiByYW5nZSAwLi5yYW5kKG1pbiwgbGVuZ3RoKVxyXG4gIHJhbmRvbVRyaW0obWluKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50Lmxlbmd0aCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLmZyYWdtZW50Lmxlbmd0aCsxIC0gbWluKSArIG1pbik7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgLy8gU2h1ZmZsZSBhcnJheSBbMSwyLDNdID0+IFsyLDEsM10gYW5kIGV0Yy4uLlxyXG4gIHNodWZmbGUoKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50LnNvcnQoKGEsIGIpID0+IE1hdGgucmFuZG9tKCkgPCAuNSA/IC0xIDogMSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgLy8gQWRkcyBhIGJsb2NrIHRvIHRoZSByYW5kb20gbG9jYXRpb24gb2YgdGhlIGFycmF5OiBbQSxBLEFdID0+IFtCLEEsQV0gYW5kIGV0Yy4uLlxyXG4gIHJhbmRvbUFwcGVuZChpZCkge1xyXG4gICAgdGhpcy5mcmFnbWVudFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqdGhpcy5mcmFnbWVudC5sZW5ndGgpXSA9IGlkO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFGcmFnbWVudENvbnZlcnRlcjtcclxuIl19
