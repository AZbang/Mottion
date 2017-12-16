(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
!function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(6)},function(t,e){t.exports=PIXI},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={linear:function(){return function(t){return t}},inQuad:function(){return function(t){return t*t}},outQuad:function(){return function(t){return t*(2-t)}},inOutQuad:function(){return function(t){return t*=2,1>t?.5*t*t:-.5*(--t*(t-2)-1)}},inCubic:function(){return function(t){return t*t*t}},outCubic:function(){return function(t){return--t*t*t+1}},inOutCubic:function(){return function(t){return t*=2,1>t?.5*t*t*t:(t-=2,.5*(t*t*t+2))}},inQuart:function(){return function(t){return t*t*t*t}},outQuart:function(){return function(t){return 1- --t*t*t*t}},inOutQuart:function(){return function(t){return t*=2,1>t?.5*t*t*t*t:(t-=2,-.5*(t*t*t*t-2))}},inQuint:function(){return function(t){return t*t*t*t*t}},outQuint:function(){return function(t){return--t*t*t*t*t+1}},inOutQuint:function(){return function(t){return t*=2,1>t?.5*t*t*t*t*t:(t-=2,.5*(t*t*t*t*t+2))}},inSine:function(){return function(t){return 1-Math.cos(t*Math.PI/2)}},outSine:function(){return function(t){return Math.sin(t*Math.PI/2)}},inOutSine:function(){return function(t){return.5*(1-Math.cos(Math.PI*t))}},inExpo:function(){return function(t){return 0===t?0:Math.pow(1024,t-1)}},outExpo:function(){return function(t){return 1===t?1:1-Math.pow(2,-10*t)}},inOutExpo:function(){return function(t){return 0===t?0:1===t?1:(t*=2,1>t?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2))}},inCirc:function(){return function(t){return 1-Math.sqrt(1-t*t)}},outCirc:function(){return function(t){return Math.sqrt(1- --t*t)}},inOutCirc:function(){return function(t){return t*=2,1>t?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-2)*(t-2))+1)}},inElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),-(t*Math.pow(2,10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)))}},outElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),t*Math.pow(2,-10*n)*Math.sin((n-i)*(2*Math.PI)/e)+1)}},inOutElastic:function(){var t=arguments.length<=0||void 0===arguments[0]?.1:arguments[0],e=arguments.length<=1||void 0===arguments[1]?.4:arguments[1];return function(n){var i=void 0;return 0===n?0:1===n?1:(!t||1>t?(t=1,i=e/4):i=e*Math.asin(1/t)/(2*Math.PI),n*=2,1>n?-.5*(t*Math.pow(2,10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)):t*Math.pow(2,-10*(n-1))*Math.sin((n-1-i)*(2*Math.PI)/e)*.5+1)}},inBack:function(t){return function(e){var n=t||1.70158;return e*e*((n+1)*e-n)}},outBack:function(t){return function(e){var n=t||1.70158;return--e*e*((n+1)*e+n)+1}},inOutBack:function(t){return function(e){var n=1.525*(t||1.70158);return e*=2,1>e?.5*(e*e*((n+1)*e-n)):.5*((e-2)*(e-2)*((n+1)*(e-2)+n)+2)}},inBounce:function(){return function(t){return 1-n.outBounce()(1-t)}},outBounce:function(){return function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?(t-=1.5/2.75,7.5625*t*t+.75):2.5/2.75>t?(t-=2.25/2.75,7.5625*t*t+.9375):(t-=2.625/2.75,7.5625*t*t+.984375)}},inOutBounce:function(){return function(t){return.5>t?.5*n.inBounce()(2*t):.5*n.outBounce()(2*t-1)+.5}},customArray:function(t){return t?function(t){return t}:n.linear()}};e["default"]=n},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e,n,i,r,s){for(var o in t)if(c(t[o]))u(t[o],e[o],n[o],i,r,s);else{var a=e[o],h=t[o]-e[o],l=i,f=r/l;n[o]=a+h*s(f)}}function h(t,e,n){for(var i in t)0===e[i]||e[i]||(c(n[i])?(e[i]=JSON.parse(JSON.stringify(n[i])),h(t[i],e[i],n[i])):e[i]=n[i])}function c(t){return"[object Object]"===Object.prototype.toString.call(t)}var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var f=n(1),p=r(f),d=n(2),g=i(d),v=function(t){function e(t,n){s(this,e);var i=o(this,Object.getPrototypeOf(e).call(this));return i.target=t,n&&i.addTo(n),i.clear(),i}return a(e,t),l(e,[{key:"addTo",value:function(t){return this.manager=t,this.manager.addTween(this),this}},{key:"chain",value:function(t){return t||(t=new e(this.target)),this._chainTween=t,t}},{key:"start",value:function(){return this.active=!0,this}},{key:"stop",value:function(){return this.active=!1,this.emit("stop"),this}},{key:"to",value:function(t){return this._to=t,this}},{key:"from",value:function(t){return this._from=t,this}},{key:"remove",value:function(){return this.manager?(this.manager.removeTween(this),this):this}},{key:"clear",value:function(){this.time=0,this.active=!1,this.easing=g["default"].linear(),this.expire=!1,this.repeat=0,this.loop=!1,this.delay=0,this.pingPong=!1,this.isStarted=!1,this.isEnded=!1,this._to=null,this._from=null,this._delayTime=0,this._elapsedTime=0,this._repeat=0,this._pingPong=!1,this._chainTween=null,this.path=null,this.pathReverse=!1,this.pathFrom=0,this.pathTo=0}},{key:"reset",value:function(){if(this._elapsedTime=0,this._repeat=0,this._delayTime=0,this.isStarted=!1,this.isEnded=!1,this.pingPong&&this._pingPong){var t=this._to,e=this._from;this._to=e,this._from=t,this._pingPong=!1}return this}},{key:"update",value:function(t,e){if(this._canUpdate()||!this._to&&!this.path){var n=void 0,i=void 0;if(this.delay>this._delayTime)return void(this._delayTime+=e);this.isStarted||(this._parseData(),this.isStarted=!0,this.emit("start"));var r=this.pingPong?this.time/2:this.time;if(r>this._elapsedTime){var s=this._elapsedTime+e,o=s>=r;this._elapsedTime=o?r:s,this._apply(r);var a=this._pingPong?r+this._elapsedTime:this._elapsedTime;if(this.emit("update",a),o){if(this.pingPong&&!this._pingPong)return this._pingPong=!0,n=this._to,i=this._from,this._from=n,this._to=i,this.path&&(n=this.pathTo,i=this.pathFrom,this.pathTo=i,this.pathFrom=n),this.emit("pingpong"),void(this._elapsedTime=0);if(this.loop||this.repeat>this._repeat)return this._repeat++,this.emit("repeat",this._repeat),this._elapsedTime=0,void(this.pingPong&&this._pingPong&&(n=this._to,i=this._from,this._to=i,this._from=n,this.path&&(n=this.pathTo,i=this.pathFrom,this.pathTo=i,this.pathFrom=n),this._pingPong=!1));this.isEnded=!0,this.active=!1,this.emit("end"),this._chainTween&&(this._chainTween.addTo(this.manager),this._chainTween.start())}}}}},{key:"_parseData",value:function(){if(!this.isStarted&&(this._from||(this._from={}),h(this._to,this._from,this.target),this.path)){var t=this.path.totalDistance();this.pathReverse?(this.pathFrom=t,this.pathTo=0):(this.pathFrom=0,this.pathTo=t)}}},{key:"_apply",value:function(t){if(u(this._to,this._from,this.target,t,this._elapsedTime,this.easing),this.path){var e=this.pingPong?this.time/2:this.time,n=this.pathFrom,i=this.pathTo-this.pathFrom,r=e,s=this._elapsedTime/r,o=n+i*this.easing(s),a=this.path.getPointAtDistance(o);this.target.position.set(a.x,a.y)}}},{key:"_canUpdate",value:function(){return this.time&&this.active&&this.target}}]),e}(p.utils.EventEmitter);e["default"]=v},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),a=i(o),u=function(){function t(){r(this,t),this.tweens=[],this._tweensToDelete=[],this._last=0}return s(t,[{key:"update",value:function(t){var e=void 0;t||0===t?e=1e3*t:(e=this._getDeltaMS(),t=e/1e3);for(var n=0;n<this.tweens.length;n++){var i=this.tweens[n];i.active&&(i.update(t,e),i.isEnded&&i.expire&&i.remove())}if(this._tweensToDelete.length){for(var n=0;n<this._tweensToDelete.length;n++)this._remove(this._tweensToDelete[n]);this._tweensToDelete.length=0}}},{key:"getTweensForTarget",value:function(t){for(var e=[],n=0;n<this.tweens.length;n++)this.tweens[n].target===t&&e.push(this.tweens[n]);return e}},{key:"createTween",value:function(t){return new a["default"](t,this)}},{key:"addTween",value:function(t){t.manager=this,this.tweens.push(t)}},{key:"removeTween",value:function(t){this._tweensToDelete.push(t)}},{key:"_remove",value:function(t){var e=this.tweens.indexOf(t);-1!==e&&this.tweens.splice(e,1)}},{key:"_getDeltaMS",value:function(){0===this._last&&(this._last=Date.now());var t=Date.now(),e=t-this._last;return this._last=t,e}}]),t}();e["default"]=u},function(t,e,n){"use strict";function i(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),a=i(o),u=function(){function t(){r(this,t),this._colsed=!1,this.polygon=new a.Polygon,this.polygon.closed=!1,this._tmpPoint=new a.Point,this._tmpPoint2=new a.Point,this._tmpDistance=[],this.currentPath=null,this.graphicsData=[],this.dirty=!0}return s(t,[{key:"moveTo",value:function(t,e){return a.Graphics.prototype.moveTo.call(this,t,e),this.dirty=!0,this}},{key:"lineTo",value:function(t,e){return a.Graphics.prototype.lineTo.call(this,t,e),this.dirty=!0,this}},{key:"bezierCurveTo",value:function(t,e,n,i,r,s){return a.Graphics.prototype.bezierCurveTo.call(this,t,e,n,i,r,s),this.dirty=!0,this}},{key:"quadraticCurveTo",value:function(t,e,n,i){return a.Graphics.prototype.quadraticCurveTo.call(this,t,e,n,i),this.dirty=!0,this}},{key:"arcTo",value:function(t,e,n,i,r){return a.Graphics.prototype.arcTo.call(this,t,e,n,i,r),this.dirty=!0,this}},{key:"arc",value:function(t,e,n,i,r,s){return a.Graphics.prototype.arc.call(this,t,e,n,i,r,s),this.dirty=!0,this}},{key:"drawShape",value:function(t){return a.Graphics.prototype.drawShape.call(this,t),this.dirty=!0,this}},{key:"getPoint",value:function(t){this.parsePoints();var e=this.closed&&t>=this.length-1?0:2*t;return this._tmpPoint.set(this.polygon.points[e],this.polygon.points[e+1]),this._tmpPoint}},{key:"distanceBetween",value:function(t,e){this.parsePoints();var n=this.getPoint(t),i=n.x,r=n.y,s=this.getPoint(e),o=s.x,a=s.y,u=o-i,h=a-r;return Math.sqrt(u*u+h*h)}},{key:"totalDistance",value:function(){this.parsePoints(),this._tmpDistance.length=0,this._tmpDistance.push(0);for(var t=this.length,e=0,n=0;t-1>n;n++)e+=this.distanceBetween(n,n+1),this._tmpDistance.push(e);return e}},{key:"getPointAt",value:function(t){if(this.parsePoints(),t>this.length)return this.getPoint(this.length-1);if(t%1===0)return this.getPoint(t);this._tmpPoint2.set(0,0);var e=t%1,n=this.getPoint(Math.ceil(t)),i=n.x,r=n.y,s=this.getPoint(Math.floor(t)),o=s.x,a=s.y,u=-((o-i)*e),h=-((a-r)*e);return this._tmpPoint2.set(o+u,a+h),this._tmpPoint2}},{key:"getPointAtDistance",value:function(t){this.parsePoints(),this._tmpDistance||this.totalDistance();var e=this._tmpDistance.length,n=0,i=this._tmpDistance[this._tmpDistance.length-1];0>t?t=i+t:t>i&&(t-=i);for(var r=0;e>r&&(t>=this._tmpDistance[r]&&(n=r),!(t<this._tmpDistance[r]));r++);if(n===this.length-1)return this.getPointAt(n);var s=t-this._tmpDistance[n],o=this._tmpDistance[n+1]-this._tmpDistance[n];return this.getPointAt(n+s/o)}},{key:"parsePoints",value:function(){if(!this.dirty)return this;this.dirty=!1,this.polygon.points.length=0;for(var t=0;t<this.graphicsData.length;t++){var e=this.graphicsData[t].shape;e&&e.points&&(this.polygon.points=this.polygon.points.concat(e.points))}return this}},{key:"clear",value:function(){return this.graphicsData.length=0,this.currentPath=null,this.polygon.points.length=0,this._closed=!1,this.dirty=!1,this}},{key:"closed",get:function(){return this._closed},set:function(t){this._closed!==t&&(this.polygon.closed=t,this._closed=t,this.dirty=!0)}},{key:"length",get:function(){return this.polygon.points.length?this.polygon.points.length/2+(this._closed?1:0):0}}]),t}();e["default"]=u},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(4),u=i(a),h=n(3),c=i(h),l=n(5),f=i(l),p=n(2),d=i(p);o.Graphics.prototype.drawPath=function(t){return t.parsePoints(),this.drawShape(t.polygon),this};var g={TweenManager:u["default"],Tween:c["default"],Easing:d["default"],TweenPath:f["default"]};o.tweenManager||(o.tweenManager=new u["default"],o.tween=g),e["default"]=g}]);
//# sourceMappingURL=pixi-tween.js.map
},{}],4:[function(require,module,exports){
module.exports={
  "A": {
    "image": "cell1.png",
    "active": false,
    "activationImage": "cell1-fill.png",
    "activation": 5,
    "score": 1
  },
  "B": {
    "image": "cell2.png",
    "active": false,
    "activation": 0
  },
  "C": {
    "image": "cell4.png",
    "active": false,
    "activationImage": "cell4-fill.png",
    "activation": 25,
    "score": 3
  },
  "ITL": {
    "activationImage": "islandTL.png",
    "active": true,
    "activation": 0
  },
  "IT": {
    "activationImage": "islandT.png",
    "active": true,
    "activation": 0
  },
  "ITR": {
    "activationImage": "islandTR.png",
    "active": true,
    "activation": 0
  },
  "IR": {
    "activationImage": "islandR.png",
    "active": true,
    "activation": 0
  },
  "IBR": {
    "activationImage": "islandBR.png",
    "active": true,
    "activation": 0
  },
  "IB": {
    "activationImage": "islandB.png",
    "active": true,
    "activation": 0
  },
  "IBL": {
    "activationImage": "islandBL.png",
    "active": true,
    "activation": 0
  },
  "IL": {
    "activationImage": "islandL.png",
    "active": true,
    "activation": 0
  },
  "IC": {
    "activationImage": "islandC.png",
    "active": true,
    "activation": 0
  }
}

},{}],5:[function(require,module,exports){
module.exports.A = [
  {
    map: ['A|B', 'A|B|C', 'A'],
    shuffle: true
  },
  {
    map: ['A|B', 'A', 'A'],
    shuffle: true
  }
];

module.exports.island = [
  {
    map: ['A', 'B', 'A'],
    shuffle: true
  },
  {
    map: ['A', 'A', 'A'],
  },
  {
    map: ['ITL', 'IT', 'IT', 'IT', 'ITR'],
  },
  {
    map: ['IL', 'IC', 'IC', 'IC', 'IR'],
  },
  {
    map: ['IBL', 'IB', 'IB', 'IB', 'IBR'],
  }
];

},{}],6:[function(require,module,exports){
const ScenesManager = require('./managers/ScenesManager');

class Game extends PIXI.Application {
  constructor() {
    super(window.innerWidth, window.innerHeight, {backgroundColor: 0xfcfcfc})
    document.body.appendChild(this.view);

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.scenesManager = new ScenesManager(this);
    this.stage.addChild(this.scenesManager);

    this._initTicker();
  }
  _initTicker() {
    this.ticker.add((dt) => {
      this.scenesManager.update(dt);
      PIXI.tweenManager.update();
    });
  }
}

module.exports = Game;

},{"./managers/ScenesManager":8}],7:[function(require,module,exports){
require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
const Game = require('./game');

PIXI.loader
  .add('blocks', 'assets/blocks.json')
  .add('music', 'assets/music.mp3')
  .load((loader, resources) => {
    // PIXI.sound.play('music');
    let game = new Game();
    window.game = game;
  });

},{"./game":6,"pixi-projection":1,"pixi-sound":2,"pixi-tween":3}],8:[function(require,module,exports){
const scenes = require('../scenes');

class ScenesManager extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.addScenes(scenes);
  }
  addScenes(scenes) {
    for(let id in scenes) {
      this.addScene(scenes[id], id);
    }
  }
  addScene(SceneClass, id) {
    let scene = new SceneClass(this.game, this);
    scene._id = id;
    return this.addChild(scene);
  }
  getScene(id) {
    return this.children.find((scene) => scene._id === id);
  }
  toggleScene(id) {
    if(this.activeScene) this.activeScene.visible = false;
    this.activeScene = this.getScene(id);
    this.activeScene.visible = true;

    return this.activeScene;
  }
  update(dt) {
    for(let i = 0; i < this.children.length; i++) {
      this.children[i].update(dt);
    }
  }
}

module.exports = ScenesManager;

},{"../scenes":10}],9:[function(require,module,exports){
const TileMap = require('../tilemap/TileMap.js');
const fragments = require('../content/fragments.js');

class Playground extends PIXI.projection.Container2d {
  constructor(game) {
    super();

    this.game = game;
    this.tileMap = new TileMap(this, {maxX: 5, tileSize: 100});
    this.tileMap.x = this.game.w/2-this.tileMap.MAP_WIDTH/2;
    this.width = this.tileMap.MAP_WIDTH;
    this.height = this.game.h;
    this.proj.setAxisY({x: -this.game.w/2+50, y: 4000}, -1);
    this.addChild(this.tileMap);


    this.tileMap.addMap(fragments.island);
    this.tileMap.on('mapEnd', () => {
      if(Math.random() < .8) this.tileMap.addMap(fragments.A);
      else {
        this.tileMap.addMap(fragments.island);
        this.tileMap.addMap(fragments.A);
      }
    })
  }
  update(dt) {
    this.tileMap.update(dt);
    this.tileMap.y += 5 * dt;
  }
}

module.exports = Playground;

},{"../content/fragments.js":5,"../tilemap/TileMap.js":13}],10:[function(require,module,exports){
module.exports = {
  'playground': require('./Playground')
}

},{"./Playground":9}],11:[function(require,module,exports){
class Block extends PIXI.projection.Sprite2d {
  constructor(tileMap, x, y, params={}) {
    super(PIXI.Texture.fromFrame(params.image || params.activationImage));

    this.tileMap = tileMap;
    this.game = this.tileMap.game;


    this.score = params.score;
    this.activation = params.activation;
    this.deactivationTexture = params.image ? PIXI.Texture.fromFrame(params.image) : null;
    this.activationTexture = params.activationImage ? PIXI.Texture.fromFrame(params.activationImage) : null;
    this.isActive = params.active;

    this.anchor.set(.5);
    this.width = tileMap.TILE_SIZE+2;
    this.height = tileMap.TILE_SIZE+2;
    this.x = x+tileMap.TILE_SIZE/2+1;
    this.y = y+tileMap.TILE_SIZE/2+1;

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 100;
    this.jolting.repeat = this.activation;
    this.jolting.pingPong = true;

    this.activating = PIXI.tweenManager.createTween(this);
    this.activating.from({width: this.width*3/4, height: this.height*3/4}).to({width: this.width, height: this.height});
    this.activating.time = 500;
    this.activating.easing = PIXI.tween.Easing.outBounce();

    this.interactive = true;
    this.on('pointermove', this.hit, this);
  }
  activate() {
    this.isActive = true;
    this.activating.start();
    this.jolting.stop();
    this.rotation = 0;
    if(this.activationTexture) this.texture = this.activationTexture;
  }
  deactivate() {
    this.isActive = false;
    if(this.deactivationTexture) this.texture = this.deactivationTexture;
  }
  hit(e) {
    if(!this.containsPoint(e.data.global)) {
      this.jolting.stop();
      this.rotation = 0;
      return;
    }
    if(this.activation) {
      this.activation--;
      this.jolting.start();
    } else !this.isActive && this.activate();
  }
  update(dt) {
    if(this.worldTransform.ty-this.tileMap.TILE_SIZE/2 > window.innerHeight) {
      this.tileMap.removeChild(this);
    }
  }
}

module.exports = Block;

},{}],12:[function(require,module,exports){
class MapFragment {
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

    return this.fragment;
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

module.exports = MapFragment;

},{}],13:[function(require,module,exports){
const TILE_TYPES = require('../content/TILE_TYPES');
const MapFragment = require('./MapFragment');
const Block = require('./Block');

class TileMap extends PIXI.projection.Container2d {
  constructor(scene, params={}) {
    super();

    this.scene = scene;
    this.game = scene.game;

    this.MAX_X = params.maxX || 6;
    this.TILE_SIZE = params.tileSize || 100;
    this.MAP_WIDTH = this.MAX_X*this.TILE_SIZE;
    this.lastIndex = 0;

    this.events = {};
  }
  on(e, cb) {
    this.events[e] = cb;
  }
  triggerEvent(e, arg) {
    this.events[e] && this.events[e](arg);
  }
  addMap(map) {
    for(let i = map.length-1; i >= 0; i--) {
      this.addFragment(map[i]);
    }
  }
  addFragment(dataFrag) {
    let frag = new MapFragment(dataFrag);
    for(let i = 0; i < frag.length; i++) {
      this.addBlock(frag[i], Math.round((this.MAX_X-frag.length)/2)+i, this.lastIndex);
    }
    this.lastIndex++;
  }
  addBlock(id, x, y) {
    if(id === '_') return;

    let posX = x*this.TILE_SIZE;
    let posY = -y*this.TILE_SIZE;
    this.addChild(new Block(this, posX, posY, TILE_TYPES[id]));
  }
  _computedEndMap() {
    if(this.children.length < this.MAX_X*(this.game.h/this.TILE_SIZE)) {
      this.triggerEvent('mapEnd');
    }
  }
  update(dt) {
    for(let i = 0; i < this.children.length; i++) {
      this.children[i].update(dt);
    }

    this._computedEndMap();
  }
}

module.exports = TileMap;

},{"../content/TILE_TYPES":4,"./Block":11,"./MapFragment":12}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9waXhpLXByb2plY3Rpb24vZGlzdC9waXhpLXByb2plY3Rpb24uanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9waXhpLXNvdW5kL2Rpc3QvcGl4aS1zb3VuZC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vbm9kZV9tb2R1bGVzL3BpeGktdHdlZW4vYnVpbGQvcGl4aS10d2Vlbi5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2NvbnRlbnQvVElMRV9UWVBFUy5qc29uIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvY29udGVudC9mcmFnbWVudHMuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9nYW1lLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvaW5kZXguanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9tYW5hZ2Vycy9TY2VuZXNNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc2NlbmVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zY2VuZXMvaW5kZXguanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy90aWxlbWFwL0Jsb2NrLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvdGlsZW1hcC9NYXBGcmFnbWVudC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3RpbGVtYXAvVGlsZU1hcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHV0aWxzO1xyXG4gICAgKGZ1bmN0aW9uICh1dGlscykge1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUluZGljZXNGb3JRdWFkcyhzaXplKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbEluZGljZXMgPSBzaXplICogNjtcclxuICAgICAgICAgICAgdmFyIGluZGljZXMgPSBuZXcgVWludDE2QXJyYXkodG90YWxJbmRpY2VzKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgdG90YWxJbmRpY2VzOyBpICs9IDYsIGogKz0gNCkge1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgMF0gPSBqICsgMDtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDFdID0gaiArIDE7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAyXSA9IGogKyAyO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgM10gPSBqICsgMDtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDRdID0gaiArIDI7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyA1XSA9IGogKyAzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbmRpY2VzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5jcmVhdGVJbmRpY2VzRm9yUXVhZHMgPSBjcmVhdGVJbmRpY2VzRm9yUXVhZHM7XHJcbiAgICAgICAgZnVuY3Rpb24gaXNQb3cyKHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuICEodiAmICh2IC0gMSkpICYmICghIXYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5pc1BvdzIgPSBpc1BvdzI7XHJcbiAgICAgICAgZnVuY3Rpb24gbmV4dFBvdzIodikge1xyXG4gICAgICAgICAgICB2ICs9ICsodiA9PT0gMCk7XHJcbiAgICAgICAgICAgIC0tdjtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiAxO1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDI7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gNDtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiA4O1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDE2O1xyXG4gICAgICAgICAgICByZXR1cm4gdiArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLm5leHRQb3cyID0gbmV4dFBvdzI7XHJcbiAgICAgICAgZnVuY3Rpb24gbG9nMih2KSB7XHJcbiAgICAgICAgICAgIHZhciByLCBzaGlmdDtcclxuICAgICAgICAgICAgciA9ICsodiA+IDB4RkZGRikgPDwgNDtcclxuICAgICAgICAgICAgdiA+Pj49IHI7XHJcbiAgICAgICAgICAgIHNoaWZ0ID0gKyh2ID4gMHhGRikgPDwgMztcclxuICAgICAgICAgICAgdiA+Pj49IHNoaWZ0O1xyXG4gICAgICAgICAgICByIHw9IHNoaWZ0O1xyXG4gICAgICAgICAgICBzaGlmdCA9ICsodiA+IDB4RikgPDwgMjtcclxuICAgICAgICAgICAgdiA+Pj49IHNoaWZ0O1xyXG4gICAgICAgICAgICByIHw9IHNoaWZ0O1xyXG4gICAgICAgICAgICBzaGlmdCA9ICsodiA+IDB4MykgPDwgMTtcclxuICAgICAgICAgICAgdiA+Pj49IHNoaWZ0O1xyXG4gICAgICAgICAgICByIHw9IHNoaWZ0O1xyXG4gICAgICAgICAgICByZXR1cm4gciB8ICh2ID4+IDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5sb2cyID0gbG9nMjtcclxuICAgICAgICBmdW5jdGlvbiBnZXRJbnRlcnNlY3Rpb25GYWN0b3IocDEsIHAyLCBwMywgcDQsIG91dCkge1xyXG4gICAgICAgICAgICB2YXIgQTEgPSBwMi54IC0gcDEueCwgQjEgPSBwMy54IC0gcDQueCwgQzEgPSBwMy54IC0gcDEueDtcclxuICAgICAgICAgICAgdmFyIEEyID0gcDIueSAtIHAxLnksIEIyID0gcDMueSAtIHA0LnksIEMyID0gcDMueSAtIHAxLnk7XHJcbiAgICAgICAgICAgIHZhciBEID0gQTEgKiBCMiAtIEEyICogQjE7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhEKSA8IDFlLTcpIHtcclxuICAgICAgICAgICAgICAgIG91dC54ID0gQTE7XHJcbiAgICAgICAgICAgICAgICBvdXQueSA9IEEyO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIFQgPSBDMSAqIEIyIC0gQzIgKiBCMTtcclxuICAgICAgICAgICAgdmFyIFUgPSBBMSAqIEMyIC0gQTIgKiBDMTtcclxuICAgICAgICAgICAgdmFyIHQgPSBUIC8gRCwgdSA9IFUgLyBEO1xyXG4gICAgICAgICAgICBpZiAodSA8ICgxZS02KSB8fCB1IC0gMSA+IC0xZS02KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0LnggPSBwMS54ICsgdCAqIChwMi54IC0gcDEueCk7XHJcbiAgICAgICAgICAgIG91dC55ID0gcDEueSArIHQgKiAocDIueSAtIHAxLnkpO1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuZ2V0SW50ZXJzZWN0aW9uRmFjdG9yID0gZ2V0SW50ZXJzZWN0aW9uRmFjdG9yO1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBvc2l0aW9uRnJvbVF1YWQocCwgYW5jaG9yLCBvdXQpIHtcclxuICAgICAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhMSA9IDEuMCAtIGFuY2hvci54LCBhMiA9IDEuMCAtIGExO1xyXG4gICAgICAgICAgICB2YXIgYjEgPSAxLjAgLSBhbmNob3IueSwgYjIgPSAxLjAgLSBiMTtcclxuICAgICAgICAgICAgb3V0LnggPSAocFswXS54ICogYTEgKyBwWzFdLnggKiBhMikgKiBiMSArIChwWzNdLnggKiBhMSArIHBbMl0ueCAqIGEyKSAqIGIyO1xyXG4gICAgICAgICAgICBvdXQueSA9IChwWzBdLnkgKiBhMSArIHBbMV0ueSAqIGEyKSAqIGIxICsgKHBbM10ueSAqIGExICsgcFsyXS55ICogYTIpICogYjI7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmdldFBvc2l0aW9uRnJvbVF1YWQgPSBnZXRQb3NpdGlvbkZyb21RdWFkO1xyXG4gICAgfSkodXRpbHMgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMgfHwgKHBpeGlfcHJvamVjdGlvbi51dGlscyA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxuUElYSS5wcm9qZWN0aW9uID0gcGl4aV9wcm9qZWN0aW9uO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFByb2plY3Rpb24gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb24obGVnYWN5LCBlbmFibGUpIHtcclxuICAgICAgICAgICAgaWYgKGVuYWJsZSA9PT0gdm9pZCAwKSB7IGVuYWJsZSA9IHRydWU7IH1cclxuICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmxlZ2FjeSA9IGxlZ2FjeTtcclxuICAgICAgICAgICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmxlZ2FjeS5wcm9qID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb24ucHJvdG90eXBlLCBcImVuYWJsZWRcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBQcm9qZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uID0gUHJvamVjdGlvbjtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHdlYmdsO1xyXG4gICAgKGZ1bmN0aW9uICh3ZWJnbCkge1xyXG4gICAgICAgIHZhciBCYXRjaEJ1ZmZlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEJhdGNoQnVmZmVyKHNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXMgPSBuZXcgQXJyYXlCdWZmZXIoc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb2F0MzJWaWV3ID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnZlcnRpY2VzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudWludDMyVmlldyA9IG5ldyBVaW50MzJBcnJheSh0aGlzLnZlcnRpY2VzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBCYXRjaEJ1ZmZlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGljZXMgPSBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gQmF0Y2hCdWZmZXI7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICB3ZWJnbC5CYXRjaEJ1ZmZlciA9IEJhdGNoQnVmZmVyO1xyXG4gICAgfSkod2ViZ2wgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wgfHwgKHBpeGlfcHJvamVjdGlvbi53ZWJnbCA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB3ZWJnbDtcclxuICAgIChmdW5jdGlvbiAod2ViZ2wpIHtcclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlcih2ZXJ0ZXhTcmMsIGZyYWdtZW50U3JjLCBnbCwgbWF4VGV4dHVyZXMpIHtcclxuICAgICAgICAgICAgZnJhZ21lbnRTcmMgPSBmcmFnbWVudFNyYy5yZXBsYWNlKC8lY291bnQlL2dpLCBtYXhUZXh0dXJlcyArICcnKTtcclxuICAgICAgICAgICAgZnJhZ21lbnRTcmMgPSBmcmFnbWVudFNyYy5yZXBsYWNlKC8lZm9ybG9vcCUvZ2ksIGdlbmVyYXRlU2FtcGxlU3JjKG1heFRleHR1cmVzKSk7XHJcbiAgICAgICAgICAgIHZhciBzaGFkZXIgPSBuZXcgUElYSS5TaGFkZXIoZ2wsIHZlcnRleFNyYywgZnJhZ21lbnRTcmMpO1xyXG4gICAgICAgICAgICB2YXIgc2FtcGxlVmFsdWVzID0gbmV3IEludDMyQXJyYXkobWF4VGV4dHVyZXMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heFRleHR1cmVzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHNhbXBsZVZhbHVlc1tpXSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2hhZGVyLmJpbmQoKTtcclxuICAgICAgICAgICAgc2hhZGVyLnVuaWZvcm1zLnVTYW1wbGVycyA9IHNhbXBsZVZhbHVlcztcclxuICAgICAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2ViZ2wuZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXIgPSBnZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlcjtcclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVNhbXBsZVNyYyhtYXhUZXh0dXJlcykge1xyXG4gICAgICAgICAgICB2YXIgc3JjID0gJyc7XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heFRleHR1cmVzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYyArPSAnXFxuZWxzZSAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCBtYXhUZXh0dXJlcyAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzcmMgKz0gXCJpZih0ZXh0dXJlSWQgPT0gXCIgKyBpICsgXCIuMClcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNyYyArPSAnXFxueyc7XHJcbiAgICAgICAgICAgICAgICBzcmMgKz0gXCJcXG5cXHRjb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlcnNbXCIgKyBpICsgXCJdLCB0ZXh0dXJlQ29vcmQpO1wiO1xyXG4gICAgICAgICAgICAgICAgc3JjICs9ICdcXG59JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgcmV0dXJuIHNyYztcclxuICAgICAgICB9XHJcbiAgICB9KSh3ZWJnbCA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbCB8fCAocGl4aV9wcm9qZWN0aW9uLndlYmdsID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB3ZWJnbDtcclxuICAgIChmdW5jdGlvbiAod2ViZ2wpIHtcclxuICAgICAgICB2YXIgT2JqZWN0UmVuZGVyZXIgPSBQSVhJLk9iamVjdFJlbmRlcmVyO1xyXG4gICAgICAgIHZhciBzZXR0aW5ncyA9IFBJWEkuc2V0dGluZ3M7XHJcbiAgICAgICAgdmFyIEdMQnVmZmVyID0gUElYSS5nbENvcmUuR0xCdWZmZXI7XHJcbiAgICAgICAgdmFyIHByZW11bHRpcGx5VGludCA9IFBJWEkudXRpbHMucHJlbXVsdGlwbHlUaW50O1xyXG4gICAgICAgIHZhciBwcmVtdWx0aXBseUJsZW5kTW9kZSA9IFBJWEkudXRpbHMucHJlbXVsdGlwbHlCbGVuZE1vZGU7XHJcbiAgICAgICAgdmFyIFRJQ0sgPSAwO1xyXG4gICAgICAgIHZhciBCYXRjaEdyb3VwID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gQmF0Y2hHcm91cCgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWRzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNpemUgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsZW5kID0gUElYSS5CTEVORF9NT0RFUy5OT1JNQUw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmF0Y2hHcm91cDtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIHdlYmdsLkJhdGNoR3JvdXAgPSBCYXRjaEdyb3VwO1xyXG4gICAgICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgIF9fZXh0ZW5kcyhNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIocmVuZGVyZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHJlbmRlcmVyKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMID0gMzI7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0U2l6ZSA9IDU7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0Qnl0ZVNpemUgPSBfdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zaXplID0gc2V0dGluZ3MuU1BSSVRFX0JBVENIX1NJWkU7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc3ByaXRlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydGV4QnVmZmVycyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFvcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFvTWF4ID0gMjtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFUyA9IDE7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5pbmRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLmNyZWF0ZUluZGljZXNGb3JRdWFkcyhfdGhpcy5zaXplKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBfdGhpcy5zaXplOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5ncm91cHNba10gPSBuZXcgQmF0Y2hHcm91cCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFvTWF4ID0gMjtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJlbmRlcmVyLm9uKCdwcmVyZW5kZXInLCBfdGhpcy5vblByZXJlbmRlciwgX3RoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5nZXRVbmlmb3JtcyA9IGZ1bmN0aW9uIChzcHIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuc3luY1VuaWZvcm1zID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvYmopXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNoID0gdGhpcy5zaGFkZXI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2gudW5pZm9ybXNba2V5XSA9IG9ialtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUub25Db250ZXh0Q2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuTUFYX1RFWFRVUkVTID0gTWF0aC5taW4odGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwsIHRoaXMucmVuZGVyZXIucGx1Z2luc1snc3ByaXRlJ10uTUFYX1RFWFRVUkVTKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyID0gd2ViZ2wuZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXIodGhpcy5zaGFkZXJWZXJ0LCB0aGlzLnNoYWRlckZyYWcsIGdsLCB0aGlzLk1BWF9URVhUVVJFUyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gR0xCdWZmZXIuY3JlYXRlSW5kZXhCdWZmZXIoZ2wsIHRoaXMuaW5kaWNlcywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVmFvKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52YW9NYXg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLnZlcnRleEJ1ZmZlcnNbaV0gPSBHTEJ1ZmZlci5jcmVhdGVWZXJ0ZXhCdWZmZXIoZ2wsIG51bGwsIGdsLlNUUkVBTV9EUkFXKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb3NbaV0gPSB0aGlzLmNyZWF0ZVZhbyh2ZXJ0ZXhCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJ1ZmZlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBwaXhpX3Byb2plY3Rpb24udXRpbHMubmV4dFBvdzIodGhpcy5zaXplKTsgaSAqPSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVycy5wdXNoKG5ldyB3ZWJnbC5CYXRjaEJ1ZmZlcihpICogNCAqIHRoaXMudmVydEJ5dGVTaXplKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52YW8gPSB0aGlzLnZhb3NbMF07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5vblByZXJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID49IHRoaXMuc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmx1c2goKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghc3ByaXRlLl90ZXh0dXJlLl91dnMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNwcml0ZS5fdGV4dHVyZS5iYXNlVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlc1t0aGlzLmN1cnJlbnRJbmRleCsrXSA9IHNwcml0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLmZsdXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgICAgIHZhciBNQVhfVEVYVFVSRVMgPSB0aGlzLk1BWF9URVhUVVJFUztcclxuICAgICAgICAgICAgICAgIHZhciBucDIgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMubmV4dFBvdzIodGhpcy5jdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvZzIgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMubG9nMihucDIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyc1tsb2cyXTtcclxuICAgICAgICAgICAgICAgIHZhciBzcHJpdGVzID0gdGhpcy5zcHJpdGVzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZsb2F0MzJWaWV3ID0gYnVmZmVyLmZsb2F0MzJWaWV3O1xyXG4gICAgICAgICAgICAgICAgdmFyIHVpbnQzMlZpZXcgPSBidWZmZXIudWludDMyVmlldztcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciBncm91cENvdW50ID0gMTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRHcm91cCA9IGdyb3Vwc1swXTtcclxuICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICAgICAgdmFyIHV2cztcclxuICAgICAgICAgICAgICAgIHZhciBibGVuZE1vZGUgPSBwcmVtdWx0aXBseUJsZW5kTW9kZVtzcHJpdGVzWzBdLl90ZXh0dXJlLmJhc2VUZXh0dXJlLnByZW11bHRpcGxpZWRBbHBoYSA/IDEgOiAwXVtzcHJpdGVzWzBdLmJsZW5kTW9kZV07XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zdGFydCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuYmxlbmQgPSBibGVuZE1vZGU7XHJcbiAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnRJbmRleDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwcml0ZSA9IHNwcml0ZXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFRleHR1cmUgPSBzcHJpdGUuX3RleHR1cmUuYmFzZVRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwcml0ZUJsZW5kTW9kZSA9IHByZW11bHRpcGx5QmxlbmRNb2RlW051bWJlcihuZXh0VGV4dHVyZS5wcmVtdWx0aXBsaWVkQWxwaGEpXVtzcHJpdGUuYmxlbmRNb2RlXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxlbmRNb2RlICE9PSBzcHJpdGVCbGVuZE1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxlbmRNb2RlID0gc3ByaXRlQmxlbmRNb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCA9IE1BWF9URVhUVVJFUztcclxuICAgICAgICAgICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdW5pZm9ybXMgPSB0aGlzLmdldFVuaWZvcm1zKHNwcml0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRVbmlmb3JtcyAhPT0gdW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVuaWZvcm1zID0gdW5pZm9ybXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50ID0gTUFYX1RFWFRVUkVTO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGV4dHVyZSAhPT0gbmV4dFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHR1cmUgPSBuZXh0VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRUZXh0dXJlLl9lbmFibGVkICE9PSBUSUNLKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dHVyZUNvdW50ID09PSBNQVhfVEVYVFVSRVMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc2l6ZSA9IGkgLSBjdXJyZW50R3JvdXAuc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwID0gZ3JvdXBzW2dyb3VwQ291bnQrK107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmJsZW5kID0gYmxlbmRNb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zdGFydCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnVuaWZvcm1zID0gY3VycmVudFVuaWZvcm1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFRleHR1cmUuX2VuYWJsZWQgPSBUSUNLO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFRleHR1cmUuX3ZpcnRhbEJvdW5kSWQgPSB0ZXh0dXJlQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudGV4dHVyZXNbY3VycmVudEdyb3VwLnRleHR1cmVDb3VudCsrXSA9IG5leHRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFscGhhID0gTWF0aC5taW4oc3ByaXRlLndvcmxkQWxwaGEsIDEuMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ2IgPSBhbHBoYSA8IDEuMCAmJiBuZXh0VGV4dHVyZS5wcmVtdWx0aXBsaWVkQWxwaGEgPyBwcmVtdWx0aXBseVRpbnQoc3ByaXRlLl90aW50UkdCLCBhbHBoYSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBzcHJpdGUuX3RpbnRSR0IgKyAoYWxwaGEgKiAyNTUgPDwgMjQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbFZlcnRpY2VzKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCBuZXh0VGV4dHVyZS5fdmlydGFsQm91bmRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggKz0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc2l6ZSA9IGkgLSBjdXJyZW50R3JvdXAuc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNldHRpbmdzLkNBTl9VUExPQURfU0FNRV9CVUZGRVIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YW9NYXggPD0gdGhpcy52ZXJ0ZXhDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb01heCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmVydGV4QnVmZmVyID0gdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdID0gR0xCdWZmZXIuY3JlYXRlVmVydGV4QnVmZmVyKGdsLCBudWxsLCBnbC5TVFJFQU1fRFJBVyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFvc1t0aGlzLnZlcnRleENvdW50XSA9IHRoaXMuY3JlYXRlVmFvKHZlcnRleEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFZhbyh0aGlzLnZhb3NbdGhpcy52ZXJ0ZXhDb3VudF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XS51cGxvYWQoYnVmZmVyLnZlcnRpY2VzLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdLnVwbG9hZChidWZmZXIudmVydGljZXMsIDAsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudFVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBncm91cENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXAgPSBncm91cHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwVGV4dHVyZUNvdW50ID0gZ3JvdXAudGV4dHVyZUNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cC51bmlmb3JtcyAhPT0gY3VycmVudFVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3luY1VuaWZvcm1zKGdyb3VwLnVuaWZvcm1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBncm91cFRleHR1cmVDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFRleHR1cmUoZ3JvdXAudGV4dHVyZXNbal0sIGosIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cC50ZXh0dXJlc1tqXS5fdmlydGFsQm91bmRJZCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zLnNhbXBsZXJTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdlswXSA9IGdyb3VwLnRleHR1cmVzW2pdLnJlYWxXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZbMV0gPSBncm91cC50ZXh0dXJlc1tqXS5yZWFsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIudW5pZm9ybXMuc2FtcGxlclNpemUgPSB2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc3RhdGUuc2V0QmxlbmRNb2RlKGdyb3VwLmJsZW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kcmF3RWxlbWVudHMoZ2wuVFJJQU5HTEVTLCBncm91cC5zaXplICogNiwgZ2wuVU5TSUdORURfU0hPUlQsIGdyb3VwLnN0YXJ0ICogNiAqIDIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRTaGFkZXIodGhpcy5zaGFkZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLkNBTl9VUExPQURfU0FNRV9CVUZGRVIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRWYW8odGhpcy52YW9zW3RoaXMudmVydGV4Q291bnRdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0uYmluZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmx1c2goKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmFvTWF4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0ZXhCdWZmZXJzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhb3NbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9zW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5vZmYoJ3ByZXJlbmRlcicsIHRoaXMub25QcmVyZW5kZXIsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zaGFkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYWRlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFvcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kaWNlcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1ZmZlcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcnNbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICAgICAgfShPYmplY3RSZW5kZXJlcikpO1xyXG4gICAgICAgIHdlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB9KSh3ZWJnbCA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbCB8fCAocGl4aV9wcm9qZWN0aW9uLndlYmdsID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHAgPSBbbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKV07XHJcbiAgICB2YXIgYSA9IFswLCAwLCAwLCAwXTtcclxuICAgIHZhciBTdXJmYWNlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBTdXJmYWNlKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cmZhY2VJRCA9IFwiZGVmYXVsdFwiO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVJRCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4U3JjID0gXCJcIjtcclxuICAgICAgICAgICAgdGhpcy5mcmFnbWVudFNyYyA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFN1cmZhY2UucHJvdG90eXBlLmZpbGxVbmlmb3JtcyA9IGZ1bmN0aW9uICh1bmlmb3Jtcykge1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdXJmYWNlLnByb3RvdHlwZS5ib3VuZHNRdWFkID0gZnVuY3Rpb24gKHYsIG91dCwgYWZ0ZXIpIHtcclxuICAgICAgICAgICAgdmFyIG1pblggPSBvdXRbMF0sIG1pblkgPSBvdXRbMV07XHJcbiAgICAgICAgICAgIHZhciBtYXhYID0gb3V0WzBdLCBtYXhZID0gb3V0WzFdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMjsgaSA8IDg7IGkgKz0gMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pblggPiBvdXRbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWluWCA9IG91dFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXhYIDwgb3V0W2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIG1heFggPSBvdXRbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAobWluWSA+IG91dFtpICsgMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWluWSA9IG91dFtpICsgMV07XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4WSA8IG91dFtpICsgMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4WSA9IG91dFtpICsgMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcFswXS5zZXQobWluWCwgbWluWSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFswXSwgcFswXSk7XHJcbiAgICAgICAgICAgIHBbMV0uc2V0KG1heFgsIG1pblkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbMV0sIHBbMV0pO1xyXG4gICAgICAgICAgICBwWzJdLnNldChtYXhYLCBtYXhZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzJdLCBwWzJdKTtcclxuICAgICAgICAgICAgcFszXS5zZXQobWluWCwgbWF4WSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFszXSwgcFszXSk7XHJcbiAgICAgICAgICAgIGlmIChhZnRlcikge1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFswXSwgcFswXSk7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzFdLCBwWzFdKTtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbMl0sIHBbMl0pO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFszXSwgcFszXSk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMF0gPSBwWzBdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbMV0gPSBwWzBdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMl0gPSBwWzFdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbM10gPSBwWzFdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNF0gPSBwWzJdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbNV0gPSBwWzJdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNl0gPSBwWzNdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbN10gPSBwWzNdLnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocFtpXS55IDwgcFswXS55IHx8IHBbaV0ueSA9PSBwWzBdLnkgJiYgcFtpXS54IDwgcFswXS54KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gcFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcFswXSA9IHBbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBbaV0gPSB0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFbaV0gPSBNYXRoLmF0YW4yKHBbaV0ueSAtIHBbMF0ueSwgcFtpXS54IC0gcFswXS54KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBpICsgMTsgaiA8PSAzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFbaV0gPiBhW2pdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IHBbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwW2ldID0gcFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBbal0gPSB0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQyID0gYVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFbaV0gPSBhW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYVtqXSA9IHQyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3V0WzBdID0gcFswXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzFdID0gcFswXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzJdID0gcFsxXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzNdID0gcFsxXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzRdID0gcFsyXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzVdID0gcFsyXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzZdID0gcFszXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzddID0gcFszXS55O1xyXG4gICAgICAgICAgICAgICAgaWYgKChwWzNdLnggLSBwWzJdLngpICogKHBbMV0ueSAtIHBbMl0ueSkgLSAocFsxXS54IC0gcFsyXS54KSAqIChwWzNdLnkgLSBwWzJdLnkpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dFs0XSA9IHBbM10ueDtcclxuICAgICAgICAgICAgICAgICAgICBvdXRbNV0gPSBwWzNdLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3VyZmFjZTtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3VyZmFjZSA9IFN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICB2YXIgdGVtcFJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoKTtcclxuICAgIHZhciB0ZW1wUG9pbnQgPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgdmFyIEJpbGluZWFyU3VyZmFjZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKEJpbGluZWFyU3VyZmFjZSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBCaWxpbmVhclN1cmZhY2UoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLmRpc3RvcnRpb24gPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzdG9ydGlvbi5zZXQoMCwgMCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgZCA9IHRoaXMuZGlzdG9ydGlvbjtcclxuICAgICAgICAgICAgdmFyIG0gPSBwb3MueCAqIHBvcy55O1xyXG4gICAgICAgICAgICBuZXdQb3MueCA9IHBvcy54ICsgZC54ICogbTtcclxuICAgICAgICAgICAgbmV3UG9zLnkgPSBwb3MueSArIGQueSAqIG07XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIHZ4ID0gcG9zLngsIHZ5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBkeCA9IHRoaXMuZGlzdG9ydGlvbi54LCBkeSA9IHRoaXMuZGlzdG9ydGlvbi55O1xyXG4gICAgICAgICAgICBpZiAoZHggPT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHZ4O1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2eSAvICgxLjAgKyBkeSAqIHZ4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkeSA9PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdnk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHZ4IC8gKDEuMCArIGR4ICogdnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSAodnkgKiBkeCAtIHZ4ICogZHkgKyAxLjApICogMC41IC8gZHk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IGIgKiBiICsgdnggLyBkeTtcclxuICAgICAgICAgICAgICAgIGlmIChkIDw9IDAuMDAwMDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQb3Muc2V0KE5hTiwgTmFOKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZHkgPiAwLjApIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQb3MueCA9IC1iICsgTWF0aC5zcXJ0KGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnggPSAtYiAtIE1hdGguc3FydChkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gKHZ4IC8gbmV3UG9zLnggLSAxLjApIC8gZHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUubWFwU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGVtcFJlY3QueCA9IC1zcHJpdGUuYW5jaG9yLnggKiB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QueSA9IC1zcHJpdGUuYW5jaG9yLnkgKiB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LndpZHRoID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LmhlaWdodCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwUXVhZCh0ZW1wUmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtIHx8IHNwcml0ZS50cmFuc2Zvcm0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5tYXBRdWFkID0gZnVuY3Rpb24gKHJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgYXggPSAtcmVjdC54IC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gLXJlY3QueSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXgyID0gKDEuMCAtIHJlY3QueCkgLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkyID0gKDEuMCAtIHJlY3QueSkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIHVwMXggPSAocXVhZFswXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMXkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMnggPSAocXVhZFswXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXggPSAocXVhZFszXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsyXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheDIpICsgcXVhZFsyXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB4MDAgPSB1cDF4ICogKDEuMCAtIGF5KSArIGRvd24xeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTAwID0gdXAxeSAqICgxLjAgLSBheSkgKyBkb3duMXkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgxMCA9IHVwMnggKiAoMS4wIC0gYXkpICsgZG93bjJ4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MTAgPSB1cDJ5ICogKDEuMCAtIGF5KSArIGRvd24yeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDAxID0gdXAxeCAqICgxLjAgLSBheTIpICsgZG93bjF4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTAxID0gdXAxeSAqICgxLjAgLSBheTIpICsgZG93bjF5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeDExID0gdXAyeCAqICgxLjAgLSBheTIpICsgZG93bjJ4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTExID0gdXAyeSAqICgxLjAgLSBheTIpICsgZG93bjJ5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgbWF0ID0gdGVtcE1hdDtcclxuICAgICAgICAgICAgbWF0LnR4ID0geDAwO1xyXG4gICAgICAgICAgICBtYXQudHkgPSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5hID0geDEwIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuYiA9IHkxMCAtIHkwMDtcclxuICAgICAgICAgICAgbWF0LmMgPSB4MDEgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5kID0geTAxIC0geTAwO1xyXG4gICAgICAgICAgICB0ZW1wUG9pbnQuc2V0KHgxMSwgeTExKTtcclxuICAgICAgICAgICAgbWF0LmFwcGx5SW52ZXJzZSh0ZW1wUG9pbnQsIHRlbXBQb2ludCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzdG9ydGlvbi5zZXQodGVtcFBvaW50LnggLSAxLCB0ZW1wUG9pbnQueSAtIDEpO1xyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2V0RnJvbU1hdHJpeChtYXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuZmlsbFVuaWZvcm1zID0gZnVuY3Rpb24gKHVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb24gPSB1bmlmb3Jtcy5kaXN0b3J0aW9uIHx8IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDAsIDAsIDBdKTtcclxuICAgICAgICAgICAgdmFyIGF4ID0gTWF0aC5hYnModGhpcy5kaXN0b3J0aW9uLngpO1xyXG4gICAgICAgICAgICB2YXIgYXkgPSBNYXRoLmFicyh0aGlzLmRpc3RvcnRpb24ueSk7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bMF0gPSBheCAqIDEwMDAwIDw9IGF5ID8gMCA6IHRoaXMuZGlzdG9ydGlvbi54O1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzFdID0gYXkgKiAxMDAwMCA8PSBheCA/IDAgOiB0aGlzLmRpc3RvcnRpb24ueTtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblsyXSA9IDEuMCAvIHVuaWZvcm1zLmRpc3RvcnRpb25bMF07XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bM10gPSAxLjAgLyB1bmlmb3Jtcy5kaXN0b3J0aW9uWzFdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIEJpbGluZWFyU3VyZmFjZTtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlN1cmZhY2UpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5CaWxpbmVhclN1cmZhY2UgPSBCaWxpbmVhclN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBDb250YWluZXIycyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKENvbnRhaW5lcjJzLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIENvbnRhaW5lcjJzKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZShfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb250YWluZXIycy5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBDb250YWluZXIycztcclxuICAgIH0oUElYSS5Db250YWluZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Db250YWluZXIycyA9IENvbnRhaW5lcjJzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgZnVuID0gUElYSS5UcmFuc2Zvcm1TdGF0aWMucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybTtcclxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUhhY2socGFyZW50VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmFyIHByb2ogPSB0aGlzLnByb2o7XHJcbiAgICAgICAgdmFyIHBwID0gcGFyZW50VHJhbnNmb3JtLnByb2o7XHJcbiAgICAgICAgdmFyIHRhID0gdGhpcztcclxuICAgICAgICBpZiAoIXBwKSB7XHJcbiAgICAgICAgICAgIGZ1bi5jYWxsKHRoaXMsIHBhcmVudFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHByb2ouX2FjdGl2ZVByb2plY3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwcC5fc3VyZmFjZSkge1xyXG4gICAgICAgICAgICBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uID0gcHA7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTG9jYWxUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhbFRyYW5zZm9ybS5jb3B5KHRoaXMud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBpZiAodGEuX3BhcmVudElEIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgKyt0YS5fd29ybGRJRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bi5jYWxsKHRoaXMsIHBhcmVudFRyYW5zZm9ybSk7XHJcbiAgICAgICAgcHJvai5fYWN0aXZlUHJvamVjdGlvbiA9IHBwLl9hY3RpdmVQcm9qZWN0aW9uO1xyXG4gICAgfVxyXG4gICAgdmFyIFByb2plY3Rpb25TdXJmYWNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoUHJvamVjdGlvblN1cmZhY2UsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvblN1cmZhY2UobGVnYWN5LCBlbmFibGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbGVnYWN5LCBlbmFibGUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLl9zdXJmYWNlID0gbnVsbDtcclxuICAgICAgICAgICAgX3RoaXMuX2FjdGl2ZVByb2plY3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICBfdGhpcy5fY3VycmVudFN1cmZhY2VJRCA9IC0xO1xyXG4gICAgICAgICAgICBfdGhpcy5fY3VycmVudExlZ2FjeUlEID0gLTE7XHJcbiAgICAgICAgICAgIF90aGlzLl9sYXN0VW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUsIFwiZW5hYmxlZFwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuX2VuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1IYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gUElYSS5UcmFuc2Zvcm1TdGF0aWMucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZSwgXCJzdXJmYWNlXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3VyZmFjZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlID09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3VyZmFjZSA9IHZhbHVlIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmFwcGx5UGFydGlhbCA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN1cmZhY2UuYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLnN1cmZhY2UuYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24uX3N1cmZhY2UuYXBwbHlJbnZlcnNlKG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1cmZhY2UuYXBwbHlJbnZlcnNlKG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKHBvcywgbmV3UG9zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5tYXBCaWxpbmVhclNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQpIHtcclxuICAgICAgICAgICAgaWYgKCEodGhpcy5fc3VyZmFjZSBpbnN0YW5jZW9mIHBpeGlfcHJvamVjdGlvbi5CaWxpbmVhclN1cmZhY2UpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cmZhY2UgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLkJpbGluZWFyU3VyZmFjZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VyZmFjZS5tYXBTcHJpdGUoc3ByaXRlLCBxdWFkLCB0aGlzLmxlZ2FjeSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cmZhY2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VyZmFjZS5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLCBcInVuaWZvcm1zXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudExlZ2FjeUlEID09PSB0aGlzLmxlZ2FjeS5fd29ybGRJRCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTdXJmYWNlSUQgPT09IHRoaXMuc3VyZmFjZS5fdXBkYXRlSUQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGFzdFVuaWZvcm1zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFVuaWZvcm1zID0gdGhpcy5fbGFzdFVuaWZvcm1zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFVuaWZvcm1zLndvcmxkVHJhbnNmb3JtID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0udG9BcnJheSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1cmZhY2UuZmlsbFVuaWZvcm1zKHRoaXMuX2xhc3RVbmlmb3Jtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGFzdFVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvblN1cmZhY2U7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UgPSBQcm9qZWN0aW9uU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgdmFyIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGVCaWxpbmVhclJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5zaXplID0gMTAwO1xyXG4gICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwgPSAxO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczE7XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMjtcXG5hdHRyaWJ1dGUgdmVjNCBhRnJhbWU7XFxuYXR0cmlidXRlIHZlYzQgYUNvbG9yO1xcbmF0dHJpYnV0ZSBmbG9hdCBhVGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB3b3JsZFRyYW5zZm9ybTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIHdvcmxkVHJhbnNmb3JtICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuICAgIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVZlcnRleFBvc2l0aW9uO1xcbiAgICB2VHJhbnMxID0gYVRyYW5zMTtcXG4gICAgdlRyYW5zMiA9IGFUcmFuczI7XFxuICAgIHZUZXh0dXJlSWQgPSBhVGV4dHVyZUlkO1xcbiAgICB2Q29sb3IgPSBhQ29sb3I7XFxuICAgIHZGcmFtZSA9IGFGcmFtZTtcXG59XFxuXCI7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyc1slY291bnQlXTtcXG51bmlmb3JtIHZlYzIgc2FtcGxlclNpemVbJWNvdW50JV07IFxcbnVuaWZvcm0gdmVjNCBkaXN0b3J0aW9uO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG52ZWMyIHN1cmZhY2U7XFxudmVjMiBzdXJmYWNlMjtcXG5cXG5mbG9hdCB2eCA9IHZUZXh0dXJlQ29vcmQueDtcXG5mbG9hdCB2eSA9IHZUZXh0dXJlQ29vcmQueTtcXG5mbG9hdCBkeCA9IGRpc3RvcnRpb24ueDtcXG5mbG9hdCBkeSA9IGRpc3RvcnRpb24ueTtcXG5mbG9hdCByZXZ4ID0gZGlzdG9ydGlvbi56O1xcbmZsb2F0IHJldnkgPSBkaXN0b3J0aW9uLnc7XFxuXFxuaWYgKGRpc3RvcnRpb24ueCA9PSAwLjApIHtcXG4gICAgc3VyZmFjZS54ID0gdng7XFxuICAgIHN1cmZhY2UueSA9IHZ5IC8gKDEuMCArIGR5ICogdngpO1xcbiAgICBzdXJmYWNlMiA9IHN1cmZhY2U7XFxufSBlbHNlXFxuaWYgKGRpc3RvcnRpb24ueSA9PSAwLjApIHtcXG4gICAgc3VyZmFjZS55ID0gdnk7XFxuICAgIHN1cmZhY2UueCA9IHZ4LyAoMS4wICsgZHggKiB2eSk7XFxuICAgIHN1cmZhY2UyID0gc3VyZmFjZTtcXG59IGVsc2Uge1xcbiAgICBmbG9hdCBjID0gdnkgKiBkeCAtIHZ4ICogZHk7XFxuICAgIGZsb2F0IGIgPSAoYyArIDEuMCkgKiAwLjU7XFxuICAgIGZsb2F0IGIyID0gKC1jICsgMS4wKSAqIDAuNTtcXG4gICAgZmxvYXQgZCA9IGIgKiBiICsgdnggKiBkeTtcXG4gICAgaWYgKGQgPCAtMC4wMDAwMSkge1xcbiAgICAgICAgZGlzY2FyZDtcXG4gICAgfVxcbiAgICBkID0gc3FydChtYXgoZCwgMC4wKSk7XFxuICAgIHN1cmZhY2UueCA9ICgtIGIgKyBkKSAqIHJldnk7XFxuICAgIHN1cmZhY2UyLnggPSAoLSBiIC0gZCkgKiByZXZ5O1xcbiAgICBzdXJmYWNlLnkgPSAoLSBiMiArIGQpICogcmV2eDtcXG4gICAgc3VyZmFjZTIueSA9ICgtIGIyIC0gZCkgKiByZXZ4O1xcbn1cXG5cXG52ZWMyIHV2O1xcbnV2LnggPSB2VHJhbnMxLnggKiBzdXJmYWNlLnggKyB2VHJhbnMxLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMxLno7XFxudXYueSA9IHZUcmFuczIueCAqIHN1cmZhY2UueCArIHZUcmFuczIueSAqIHN1cmZhY2UueSArIHZUcmFuczIuejtcXG5cXG52ZWMyIHBpeGVscyA9IHV2ICogc2FtcGxlclNpemVbMF07XFxuXFxuaWYgKHBpeGVscy54IDwgdkZyYW1lLnggfHwgcGl4ZWxzLnggPiB2RnJhbWUueiB8fFxcbiAgICBwaXhlbHMueSA8IHZGcmFtZS55IHx8IHBpeGVscy55ID4gdkZyYW1lLncpIHtcXG4gICAgdXYueCA9IHZUcmFuczEueCAqIHN1cmZhY2UyLnggKyB2VHJhbnMxLnkgKiBzdXJmYWNlMi55ICsgdlRyYW5zMS56O1xcbiAgICB1di55ID0gdlRyYW5zMi54ICogc3VyZmFjZTIueCArIHZUcmFuczIueSAqIHN1cmZhY2UyLnkgKyB2VHJhbnMyLno7XFxuICAgIHBpeGVscyA9IHV2ICogc2FtcGxlclNpemVbMF07XFxuICAgIFxcbiAgICBpZiAocGl4ZWxzLnggPCB2RnJhbWUueCB8fCBwaXhlbHMueCA+IHZGcmFtZS56IHx8XFxuICAgICAgICBwaXhlbHMueSA8IHZGcmFtZS55IHx8IHBpeGVscy55ID4gdkZyYW1lLncpIHtcXG4gICAgICAgIGRpc2NhcmQ7XFxuICAgIH1cXG59XFxuXFxudmVjNCBlZGdlO1xcbmVkZ2UueHkgPSBjbGFtcChwaXhlbHMgLSB2RnJhbWUueHkgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuZWRnZS56dyA9IGNsYW1wKHZGcmFtZS56dyAtIHBpeGVscyArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5cXG5mbG9hdCBhbHBoYSA9IDEuMDsgLy9lZGdlLnggKiBlZGdlLnkgKiBlZGdlLnogKiBlZGdlLnc7XFxudmVjNCByQ29sb3IgPSB2Q29sb3IgKiBhbHBoYTtcXG5cXG5mbG9hdCB0ZXh0dXJlSWQgPSBmbG9vcih2VGV4dHVyZUlkKzAuNSk7XFxudmVjNCBjb2xvcjtcXG52ZWMyIHRleHR1cmVDb29yZCA9IHV2O1xcbiVmb3Jsb29wJVxcbmdsX0ZyYWdDb2xvciA9IGNvbG9yICogckNvbG9yO1xcbn1cIjtcclxuICAgICAgICAgICAgX3RoaXMuZGVmVW5pZm9ybXMgPSB7XHJcbiAgICAgICAgICAgICAgICB3b3JsZFRyYW5zZm9ybTogbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV0pLFxyXG4gICAgICAgICAgICAgICAgZGlzdG9ydGlvbjogbmV3IEZsb2F0MzJBcnJheShbMCwgMF0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlQmlsaW5lYXJSZW5kZXJlci5wcm90b3R5cGUuZ2V0VW5pZm9ybXMgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9qID0gc3ByaXRlLnByb2o7XHJcbiAgICAgICAgICAgIHZhciBzaGFkZXIgPSB0aGlzLnNoYWRlcjtcclxuICAgICAgICAgICAgaWYgKHByb2ouc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2oudW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb2ouX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZlVuaWZvcm1zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlQmlsaW5lYXJSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlVmFvID0gZnVuY3Rpb24gKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRTaXplID0gMTQ7XHJcbiAgICAgICAgICAgIHRoaXMudmVydEJ5dGVTaXplID0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHZhciB2YW8gPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZVZhbygpXHJcbiAgICAgICAgICAgICAgICAuYWRkSW5kZXgodGhpcy5pbmRleEJ1ZmZlcilcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDApXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMiAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNSAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUZyYW1lLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA4ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hQ29sb3IsIGdsLlVOU0lHTkVEX0JZVEUsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCAxMiAqIDQpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cnMuYVRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICAgICAgdmFvLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlSWQsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEzICogNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIucHJvdG90eXBlLmZpbGxWZXJ0aWNlcyA9IGZ1bmN0aW9uIChmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgdGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gc3ByaXRlLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB3ID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXggPSBzcHJpdGUuX2FuY2hvci5feDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gc3ByaXRlLl9hbmNob3IuX3k7XHJcbiAgICAgICAgICAgIHZhciBmcmFtZSA9IHRleC5fZnJhbWU7XHJcbiAgICAgICAgICAgIHZhciBhVHJhbnMgPSBzcHJpdGUuYVRyYW5zO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVtpICogMl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVtpICogMiArIDFdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IGFUcmFucy5hO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAzXSA9IGFUcmFucy5jO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA0XSA9IGFUcmFucy50eDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNV0gPSBhVHJhbnMuYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSBhVHJhbnMuZDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSBhVHJhbnMudHk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gZnJhbWUueDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOV0gPSBmcmFtZS55O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMF0gPSBmcmFtZS54ICsgZnJhbWUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDExXSA9IGZyYW1lLnkgKyBmcmFtZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMTJdID0gYXJnYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdGV4dHVyZUlkO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGVCaWxpbmVhclJlbmRlcmVyO1xyXG4gICAgfShNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcikpO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdzcHJpdGVfYmlsaW5lYXInLCBTcHJpdGVCaWxpbmVhclJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgdmFyIFNwcml0ZVN0cmFuZ2VSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZVN0cmFuZ2VSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGVTdHJhbmdlUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5zaXplID0gMTAwO1xyXG4gICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwgPSAxO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczE7XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMjtcXG5hdHRyaWJ1dGUgdmVjNCBhRnJhbWU7XFxuYXR0cmlidXRlIHZlYzQgYUNvbG9yO1xcbmF0dHJpYnV0ZSBmbG9hdCBhVGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB3b3JsZFRyYW5zZm9ybTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIHdvcmxkVHJhbnNmb3JtICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuICAgIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVZlcnRleFBvc2l0aW9uO1xcbiAgICB2VHJhbnMxID0gYVRyYW5zMTtcXG4gICAgdlRyYW5zMiA9IGFUcmFuczI7XFxuICAgIHZUZXh0dXJlSWQgPSBhVGV4dHVyZUlkO1xcbiAgICB2Q29sb3IgPSBhQ29sb3I7XFxuICAgIHZGcmFtZSA9IGFGcmFtZTtcXG59XFxuXCI7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMTtcXG52YXJ5aW5nIHZlYzMgdlRyYW5zMjtcXG52YXJ5aW5nIHZlYzQgdkZyYW1lO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyc1slY291bnQlXTtcXG51bmlmb3JtIHZlYzIgc2FtcGxlclNpemVbJWNvdW50JV07IFxcbnVuaWZvcm0gdmVjNCBwYXJhbXM7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbnZlYzIgc3VyZmFjZTtcXG5cXG5mbG9hdCB2eCA9IHZUZXh0dXJlQ29vcmQueDtcXG5mbG9hdCB2eSA9IHZUZXh0dXJlQ29vcmQueTtcXG5mbG9hdCBhbGVwaCA9IHBhcmFtcy54O1xcbmZsb2F0IGJldCA9IHBhcmFtcy55O1xcbmZsb2F0IEEgPSBwYXJhbXMuejtcXG5mbG9hdCBCID0gcGFyYW1zLnc7XFxuXFxuaWYgKGFsZXBoID09IDAuMCkge1xcblxcdHN1cmZhY2UueSA9IHZ5IC8gKDEuMCArIHZ4ICogYmV0KTtcXG5cXHRzdXJmYWNlLnggPSB2eDtcXG59XFxuZWxzZSBpZiAoYmV0ID09IDAuMCkge1xcblxcdHN1cmZhY2UueCA9IHZ4IC8gKDEuMCArIHZ5ICogYWxlcGgpO1xcblxcdHN1cmZhY2UueSA9IHZ5O1xcbn0gZWxzZSB7XFxuXFx0c3VyZmFjZS54ID0gdnggKiAoYmV0ICsgMS4wKSAvIChiZXQgKyAxLjAgKyB2eSAqIGFsZXBoKTtcXG5cXHRzdXJmYWNlLnkgPSB2eSAqIChhbGVwaCArIDEuMCkgLyAoYWxlcGggKyAxLjAgKyB2eCAqIGJldCk7XFxufVxcblxcbnZlYzIgdXY7XFxudXYueCA9IHZUcmFuczEueCAqIHN1cmZhY2UueCArIHZUcmFuczEueSAqIHN1cmZhY2UueSArIHZUcmFuczEuejtcXG51di55ID0gdlRyYW5zMi54ICogc3VyZmFjZS54ICsgdlRyYW5zMi55ICogc3VyZmFjZS55ICsgdlRyYW5zMi56O1xcblxcbnZlYzIgcGl4ZWxzID0gdXYgKiBzYW1wbGVyU2l6ZVswXTtcXG5cXG52ZWM0IGVkZ2U7XFxuZWRnZS54eSA9IGNsYW1wKHBpeGVscyAtIHZGcmFtZS54eSArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5lZGdlLnp3ID0gY2xhbXAodkZyYW1lLnp3IC0gcGl4ZWxzICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcblxcbmZsb2F0IGFscGhhID0gZWRnZS54ICogZWRnZS55ICogZWRnZS56ICogZWRnZS53O1xcbnZlYzQgckNvbG9yID0gdkNvbG9yICogYWxwaGE7XFxuXFxuZmxvYXQgdGV4dHVyZUlkID0gZmxvb3IodlRleHR1cmVJZCswLjUpO1xcbnZlYzQgY29sb3I7XFxudmVjMiB0ZXh0dXJlQ29vcmQgPSB1djtcXG4lZm9ybG9vcCVcXG5nbF9GcmFnQ29sb3IgPSBjb2xvciAqIHJDb2xvcjtcXG59XCI7XHJcbiAgICAgICAgICAgIF90aGlzLmRlZlVuaWZvcm1zID0ge1xyXG4gICAgICAgICAgICAgICAgd29ybGRUcmFuc2Zvcm06IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdKSxcclxuICAgICAgICAgICAgICAgIGRpc3RvcnRpb246IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDBdKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZVN0cmFuZ2VSZW5kZXJlci5wcm90b3R5cGUuZ2V0VW5pZm9ybXMgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9qID0gc3ByaXRlLnByb2o7XHJcbiAgICAgICAgICAgIHZhciBzaGFkZXIgPSB0aGlzLnNoYWRlcjtcclxuICAgICAgICAgICAgaWYgKHByb2ouc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2oudW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb2ouX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZlVuaWZvcm1zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlU3RyYW5nZVJlbmRlcmVyLnByb3RvdHlwZS5jcmVhdGVWYW8gPSBmdW5jdGlvbiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudmVydFNpemUgPSAxNDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0Qnl0ZVNpemUgPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdmFyIHZhbyA9IHRoaXMucmVuZGVyZXIuY3JlYXRlVmFvKClcclxuICAgICAgICAgICAgICAgIC5hZGRJbmRleCh0aGlzLmluZGV4QnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFWZXJ0ZXhQb3NpdGlvbiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMxLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAyICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMyLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA1ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hRnJhbWUsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDggKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFDb2xvciwgZ2wuVU5TSUdORURfQllURSwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEyICogNCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5hVGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YW8uYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVJZCwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTMgKiA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFvO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlU3RyYW5nZVJlbmRlcmVyLnByb3RvdHlwZS5maWxsVmVydGljZXMgPSBmdW5jdGlvbiAoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIHRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHNwcml0ZS52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdyA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4ID0gc3ByaXRlLl9hbmNob3IuX3g7XHJcbiAgICAgICAgICAgIHZhciBheSA9IHNwcml0ZS5fYW5jaG9yLl95O1xyXG4gICAgICAgICAgICB2YXIgZnJhbWUgPSB0ZXguX2ZyYW1lO1xyXG4gICAgICAgICAgICB2YXIgYVRyYW5zID0gc3ByaXRlLmFUcmFucztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbaSAqIDJdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbaSAqIDIgKyAxXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSBhVHJhbnMuYTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgM10gPSBhVHJhbnMuYztcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNF0gPSBhVHJhbnMudHg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDVdID0gYVRyYW5zLmI7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gYVRyYW5zLmQ7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gYVRyYW5zLnR5O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IGZyYW1lLng7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDldID0gZnJhbWUueTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTBdID0gZnJhbWUueCArIGZyYW1lLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMV0gPSBmcmFtZS55ICsgZnJhbWUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDEyXSA9IGFyZ2I7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHRleHR1cmVJZDtcclxuICAgICAgICAgICAgICAgIGluZGV4ICs9IDE0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlU3RyYW5nZVJlbmRlcmVyO1xyXG4gICAgfShNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcikpO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdzcHJpdGVfc3RyYW5nZScsIFNwcml0ZVN0cmFuZ2VSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICB2YXIgdGVtcFJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoKTtcclxuICAgIHZhciB0ZW1wUG9pbnQgPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgdmFyIFN0cmFuZ2VTdXJmYWNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3RyYW5nZVN1cmZhY2UsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3RyYW5nZVN1cmZhY2UoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnBhcmFtcyA9IFswLCAwLCBOYU4sIE5hTl07XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBwWzBdID0gMDtcclxuICAgICAgICAgICAgcFsxXSA9IDA7XHJcbiAgICAgICAgICAgIHBbMl0gPSBOYU47XHJcbiAgICAgICAgICAgIHBbM10gPSBOYU47XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuc2V0QXhpc1ggPSBmdW5jdGlvbiAocG9zLCBmYWN0b3IsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54LCB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgcm90ID0gb3V0VHJhbnNmb3JtLnJvdGF0aW9uO1xyXG4gICAgICAgICAgICBpZiAocm90ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feCAtPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feSArPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0ucm90YXRpb24gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3LnkgPSBNYXRoLmF0YW4yKHksIHgpO1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwWzJdID0gLWQgKiBmYWN0b3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwWzJdID0gTmFOO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGMwMSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLnNldEF4aXNZID0gZnVuY3Rpb24gKHBvcywgZmFjdG9yLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueCwgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIHJvdCA9IG91dFRyYW5zZm9ybS5yb3RhdGlvbjtcclxuICAgICAgICAgICAgaWYgKHJvdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3ggLT0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3kgKz0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnJvdGF0aW9uID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy54ID0gLU1hdGguYXRhbjIoeSwgeCkgKyBNYXRoLlBJIC8gMjtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgaWYgKGZhY3RvciAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcFszXSA9IC1kICogZmFjdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcFszXSA9IE5hTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jYWxjMDEoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5fY2FsYzAxID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4ocFsyXSkpIHtcclxuICAgICAgICAgICAgICAgIHBbMV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKHBbM10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gMS4wIC8gcFszXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihwWzNdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMV0gPSAxLjAgLyBwWzJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSAxLjAgLSBwWzJdICogcFszXTtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gKDEuMCAtIHBbMl0pIC8gZDtcclxuICAgICAgICAgICAgICAgICAgICBwWzFdID0gKDEuMCAtIHBbM10pIC8gZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYWxlcGggPSB0aGlzLnBhcmFtc1swXSwgYmV0ID0gdGhpcy5wYXJhbXNbMV0sIEEgPSB0aGlzLnBhcmFtc1syXSwgQiA9IHRoaXMucGFyYW1zWzNdO1xyXG4gICAgICAgICAgICB2YXIgdSA9IHBvcy54LCB2ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIGlmIChhbGVwaCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHYgKiAoMSArIHUgKiBiZXQpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGJldCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHUgKiAoMSArIHYgKiBhbGVwaCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgRCA9IEEgKiBCIC0gdiAqIHU7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IEEgKiB1ICogKEIgKyB2KSAvIEQ7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IEIgKiB2ICogKEEgKyB1KSAvIEQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhbGVwaCA9IHRoaXMucGFyYW1zWzBdLCBiZXQgPSB0aGlzLnBhcmFtc1sxXSwgQSA9IHRoaXMucGFyYW1zWzJdLCBCID0gdGhpcy5wYXJhbXNbM107XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLngsIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgaWYgKGFsZXBoID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0geSAvICgxICsgeCAqIGJldCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYmV0ID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0geCAqICgxICsgeSAqIGFsZXBoKTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0geTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0geCAqIChiZXQgKyAxKSAvIChiZXQgKyAxICsgeSAqIGFsZXBoKTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0geSAqIChhbGVwaCArIDEpIC8gKGFsZXBoICsgMSArIHggKiBiZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUubWFwU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGVtcFJlY3QueCA9IC1zcHJpdGUuYW5jaG9yLnggKiB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QueSA9IC1zcHJpdGUuYW5jaG9yLnkgKiB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LndpZHRoID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LmhlaWdodCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwUXVhZCh0ZW1wUmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtIHx8IHNwcml0ZS50cmFuc2Zvcm0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLm1hcFF1YWQgPSBmdW5jdGlvbiAocmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciBheCA9IC1yZWN0LnggLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkgPSAtcmVjdC55IC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheDIgPSAoMS4wIC0gcmVjdC54KSAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheTIgPSAoMS4wIC0gcmVjdC55KSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgdXAxeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsxXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAxeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsxXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB1cDJ5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheDIpICsgcXVhZFsxXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsyXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnggPSAocXVhZFszXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheDIpICsgcXVhZFsyXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHgwMCA9IHVwMXggKiAoMS4wIC0gYXkpICsgZG93bjF4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MDAgPSB1cDF5ICogKDEuMCAtIGF5KSArIGRvd24xeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDEwID0gdXAyeCAqICgxLjAgLSBheSkgKyBkb3duMnggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkxMCA9IHVwMnkgKiAoMS4wIC0gYXkpICsgZG93bjJ5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MDEgPSB1cDF4ICogKDEuMCAtIGF5MikgKyBkb3duMXggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MDEgPSB1cDF5ICogKDEuMCAtIGF5MikgKyBkb3duMXkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB4MTEgPSB1cDJ4ICogKDEuMCAtIGF5MikgKyBkb3duMnggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MTEgPSB1cDJ5ICogKDEuMCAtIGF5MikgKyBkb3duMnkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciBtYXQgPSB0ZW1wTWF0O1xyXG4gICAgICAgICAgICBtYXQudHggPSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC50eSA9IHkwMDtcclxuICAgICAgICAgICAgbWF0LmEgPSB4MTAgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5iID0geTEwIC0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYyA9IHgwMSAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmQgPSB5MDEgLSB5MDA7XHJcbiAgICAgICAgICAgIHRlbXBQb2ludC5zZXQoeDExLCB5MTEpO1xyXG4gICAgICAgICAgICBtYXQuYXBwbHlJbnZlcnNlKHRlbXBQb2ludCwgdGVtcFBvaW50KTtcclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNldEZyb21NYXRyaXgobWF0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuZmlsbFVuaWZvcm1zID0gZnVuY3Rpb24gKHVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgdmFyIGRpc3RvcnRpb24gPSB1bmlmb3Jtcy5wYXJhbXMgfHwgbmV3IEZsb2F0MzJBcnJheShbMCwgMCwgMCwgMF0pO1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5wYXJhbXMgPSBkaXN0b3J0aW9uO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzBdID0gcGFyYW1zWzBdO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzFdID0gcGFyYW1zWzFdO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzJdID0gcGFyYW1zWzJdO1xyXG4gICAgICAgICAgICBkaXN0b3J0aW9uWzNdID0gcGFyYW1zWzNdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFN0cmFuZ2VTdXJmYWNlO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uU3VyZmFjZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlN0cmFuZ2VTdXJmYWNlID0gU3RyYW5nZVN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIFBJWEkuU3ByaXRlLnByb3RvdHlwZS5jb252ZXJ0VG8ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZV9iaWxpbmVhcic7XHJcbiAgICAgICAgdGhpcy5hVHJhbnMgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxuICAgICAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFRvMnMuY2FsbCh0aGlzKTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFRvMnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRTdWJ0cmVlVG8ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNvbnZlcnRUbzJzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29udmVydFN1YnRyZWVUbzJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFNwcml0ZTJzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlMnMsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlMnModGV4dHVyZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0dXJlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5hVHJhbnMgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGVfYmlsaW5lYXInO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZTJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcygpO1xyXG4gICAgICAgICAgICB0aGlzLl9ib3VuZHMuYWRkUXVhZCh0aGlzLnZlcnRleFRyaW1tZWREYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNmb3JtSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1JRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUlEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRyaW0gPSB0ZXh0dXJlLnRyaW07XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAwO1xyXG4gICAgICAgICAgICBpZiAodHJpbSkge1xyXG4gICAgICAgICAgICAgICAgdzEgPSB0cmltLnggLSAoYW5jaG9yLl94ICogb3JpZy53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgdHJpbS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gdHJpbS55IC0gKGFuY2hvci5feSAqIG9yaWcuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyB0cmltLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX3N1cmZhY2UpIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSBoMDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSBoMDtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvai5fc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IHd0LmE7XHJcbiAgICAgICAgICAgICAgICB2YXIgYiA9IHd0LmI7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHd0LmM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHd0LmQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHggPSB3dC50eDtcclxuICAgICAgICAgICAgICAgIHZhciB0eSA9IHd0LnR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IChhICogdzEpICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSAoZCAqIGgxKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gKGEgKiB3MCkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IChkICogaDEpICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSAoYSAqIHcwKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gKGQgKiBoMCkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IChhICogdzEpICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSAoZCAqIGgwKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRleHR1cmUudHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlLnRyYW5zZm9ybSA9IG5ldyBQSVhJLmV4dHJhcy5UZXh0dXJlVHJhbnNmb3JtKHRleHR1cmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRleHR1cmUudHJhbnNmb3JtLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgYVRyYW5zID0gdGhpcy5hVHJhbnM7XHJcbiAgICAgICAgICAgIGFUcmFucy5zZXQob3JpZy53aWR0aCwgMCwgMCwgb3JpZy5oZWlnaHQsIHcxLCBoMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX3N1cmZhY2UgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFUcmFucy5wcmVwZW5kKHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhVHJhbnMuaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgIGFUcmFucy5wcmVwZW5kKHRleHR1cmUudHJhbnNmb3JtLm1hcENvb3JkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZlcnRleFRyaW1tZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleFRyaW1tZWREYXRhID0gbmV3IEZsb2F0MzJBcnJheSg4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4VHJpbW1lZERhdGE7XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX3N1cmZhY2UpIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSBoMTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSB3MDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSBoMDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSB3MTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSBoMDtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvai5fc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEsIHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB3dCA9IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSB3dC5hO1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSB3dC5iO1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSB3dC5jO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSB3dC5kO1xyXG4gICAgICAgICAgICAgICAgdmFyIHR4ID0gd3QudHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHkgPSB3dC50eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSAoYSAqIHcxKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gKGQgKiBoMSkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IChhICogdzApICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSAoZCAqIGgxKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gKGEgKiB3MCkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IChkICogaDApICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSAoYSAqIHcxKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gKGQgKiBoMCkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSwgdGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uLmxlZ2FjeS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTcHJpdGUycy5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBTcHJpdGUycztcclxuICAgIH0oUElYSS5TcHJpdGUpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycyA9IFNwcml0ZTJzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgVGV4dDJzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoVGV4dDJzLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFRleHQycyh0ZXh0LCBzdHlsZSwgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHQsIHN0eWxlLCBjYW52YXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLmFUcmFucyA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZShfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZV9iaWxpbmVhcic7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRleHQycy5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBUZXh0MnM7XHJcbiAgICB9KFBJWEkuVGV4dCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlRleHQycyA9IFRleHQycztcclxuICAgIFRleHQycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgVGV4dDJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgIFRleHQycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgZnVuY3Rpb24gY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgfVxyXG4gICAgcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0gPSBjb250YWluZXIyZFdvcmxkVHJhbnNmb3JtO1xyXG4gICAgdmFyIENvbnRhaW5lcjJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQ29udGFpbmVyMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gQ29udGFpbmVyMmQoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb250YWluZXIyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBDb250YWluZXIyZDtcclxuICAgIH0oUElYSS5Db250YWluZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Db250YWluZXIyZCA9IENvbnRhaW5lcjJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgUG9pbnQgPSBQSVhJLlBvaW50O1xyXG4gICAgdmFyIG1hdDNpZCA9IFsxLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAxXTtcclxuICAgIHZhciBBRkZJTkU7XHJcbiAgICAoZnVuY3Rpb24gKEFGRklORSkge1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJOT05FXCJdID0gMF0gPSBcIk5PTkVcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiRlJFRVwiXSA9IDFdID0gXCJGUkVFXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIkFYSVNfWFwiXSA9IDJdID0gXCJBWElTX1hcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiQVhJU19ZXCJdID0gM10gPSBcIkFYSVNfWVwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJQT0lOVFwiXSA9IDRdID0gXCJQT0lOVFwiO1xyXG4gICAgfSkoQUZGSU5FID0gcGl4aV9wcm9qZWN0aW9uLkFGRklORSB8fCAocGl4aV9wcm9qZWN0aW9uLkFGRklORSA9IHt9KSk7XHJcbiAgICB2YXIgTWF0cml4MmQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIE1hdHJpeDJkKGJhY2tpbmdBcnJheSkge1xyXG4gICAgICAgICAgICB0aGlzLmZsb2F0QXJyYXkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLm1hdDMgPSBuZXcgRmxvYXQ2NEFycmF5KGJhY2tpbmdBcnJheSB8fCBtYXQzaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImFcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbMF07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbMF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJiXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzFdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzFdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiY1wiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1szXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1szXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImRcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbNF07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbNF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJ0eFwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1s2XTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1s2XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcInR5XCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzddO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzddID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgdHgsIHR5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gYTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IGI7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gYztcclxuICAgICAgICAgICAgbWF0M1s0XSA9IGQ7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gdHg7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSB0eTtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAodHJhbnNwb3NlLCBvdXQpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZsb2F0QXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXRBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoOSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gb3V0IHx8IHRoaXMuZmxvYXRBcnJheTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIGlmICh0cmFuc3Bvc2UpIHtcclxuICAgICAgICAgICAgICAgIGFycmF5WzBdID0gbWF0M1swXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzFdID0gbWF0M1sxXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzJdID0gbWF0M1syXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzNdID0gbWF0M1szXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzRdID0gbWF0M1s0XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzVdID0gbWF0M1s1XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzZdID0gbWF0M1s2XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzddID0gbWF0M1s3XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzhdID0gbWF0M1s4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFycmF5WzBdID0gbWF0M1swXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzFdID0gbWF0M1szXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzJdID0gbWF0M1s2XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzNdID0gbWF0M1sxXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzRdID0gbWF0M1s0XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzVdID0gbWF0M1s3XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzZdID0gbWF0M1syXTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzddID0gbWF0M1s1XTtcclxuICAgICAgICAgICAgICAgIGFycmF5WzhdID0gbWF0M1s4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54O1xyXG4gICAgICAgICAgICB2YXIgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgeiA9IDEuMCAvIChtYXQzWzJdICogeCArIG1hdDNbNV0gKiB5ICsgbWF0M1s4XSk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy54ID0geiAqIChtYXQzWzBdICogeCArIG1hdDNbM10gKiB5ICsgbWF0M1s2XSk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy55ID0geiAqIChtYXQzWzFdICogeCArIG1hdDNbNF0gKiB5ICsgbWF0M1s3XSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKHR4LCB0eSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSArPSB0eCAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbMV0gKz0gdHkgKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzNdICs9IHR4ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s0XSArPSB0eSAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNl0gKz0gdHggKiBtYXQzWzhdO1xyXG4gICAgICAgICAgICBtYXQzWzddICs9IHR5ICogbWF0M1s4XTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSAqPSB4O1xyXG4gICAgICAgICAgICBtYXQzWzFdICo9IHk7XHJcbiAgICAgICAgICAgIG1hdDNbM10gKj0geDtcclxuICAgICAgICAgICAgbWF0M1s0XSAqPSB5O1xyXG4gICAgICAgICAgICBtYXQzWzZdICo9IHg7XHJcbiAgICAgICAgICAgIG1hdDNbN10gKj0geTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2NhbGVBbmRUcmFuc2xhdGUgPSBmdW5jdGlvbiAoc2NhbGVYLCBzY2FsZVksIHR4LCB0eSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHNjYWxlWCAqIG1hdDNbMF0gKyB0eCAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBzY2FsZVkgKiBtYXQzWzFdICsgdHkgKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gc2NhbGVYICogbWF0M1szXSArIHR4ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHNjYWxlWSAqIG1hdDNbNF0gKyB0eSAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSBzY2FsZVggKiBtYXQzWzZdICsgdHggKiBtYXQzWzhdO1xyXG4gICAgICAgICAgICBtYXQzWzddID0gc2NhbGVZICogbWF0M1s3XSArIHR5ICogbWF0M1s4XTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueDtcclxuICAgICAgICAgICAgdmFyIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbM10sIGEwMiA9IGFbNl0sIGExMCA9IGFbMV0sIGExMSA9IGFbNF0sIGExMiA9IGFbN10sIGEyMCA9IGFbMl0sIGEyMSA9IGFbNV0sIGEyMiA9IGFbOF07XHJcbiAgICAgICAgICAgIHZhciBuZXdYID0gKGEyMiAqIGExMSAtIGExMiAqIGEyMSkgKiB4ICsgKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogeSArIChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpO1xyXG4gICAgICAgICAgICB2YXIgbmV3WSA9ICgtYTIyICogYTEwICsgYTEyICogYTIwKSAqIHggKyAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIHkgKyAoLWExMiAqIGEwMCArIGEwMiAqIGExMCk7XHJcbiAgICAgICAgICAgIHZhciBuZXdaID0gKGEyMSAqIGExMCAtIGExMSAqIGEyMCkgKiB4ICsgKC1hMjEgKiBhMDAgKyBhMDEgKiBhMjApICogeSArIChhMTEgKiBhMDAgLSBhMDEgKiBhMTApO1xyXG4gICAgICAgICAgICBuZXdQb3MueCA9IG5ld1ggLyBuZXdaO1xyXG4gICAgICAgICAgICBuZXdQb3MueSA9IG5ld1kgLyBuZXdaO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLCBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdLCBiMDEgPSBhMjIgKiBhMTEgLSBhMTIgKiBhMjEsIGIxMSA9IC1hMjIgKiBhMTAgKyBhMTIgKiBhMjAsIGIyMSA9IGEyMSAqIGExMCAtIGExMSAqIGEyMDtcclxuICAgICAgICAgICAgdmFyIGRldCA9IGEwMCAqIGIwMSArIGEwMSAqIGIxMSArIGEwMiAqIGIyMTtcclxuICAgICAgICAgICAgaWYgKCFkZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRldCA9IDEuMCAvIGRldDtcclxuICAgICAgICAgICAgYVswXSA9IGIwMSAqIGRldDtcclxuICAgICAgICAgICAgYVsxXSA9ICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIGRldDtcclxuICAgICAgICAgICAgYVsyXSA9IChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpICogZGV0O1xyXG4gICAgICAgICAgICBhWzNdID0gYjExICogZGV0O1xyXG4gICAgICAgICAgICBhWzRdID0gKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbNV0gPSAoLWExMiAqIGEwMCArIGEwMiAqIGExMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbNl0gPSBiMjEgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbN10gPSAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbOF0gPSAoYTExICogYTAwIC0gYTAxICogYTEwKSAqIGRldDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuaWRlbnRpdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gMTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgyZCh0aGlzLm1hdDMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNvcHlUbyA9IGZ1bmN0aW9uIChtYXRyaXgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhcjIgPSBtYXRyaXgubWF0MztcclxuICAgICAgICAgICAgYXIyWzBdID0gbWF0M1swXTtcclxuICAgICAgICAgICAgYXIyWzFdID0gbWF0M1sxXTtcclxuICAgICAgICAgICAgYXIyWzJdID0gbWF0M1syXTtcclxuICAgICAgICAgICAgYXIyWzNdID0gbWF0M1szXTtcclxuICAgICAgICAgICAgYXIyWzRdID0gbWF0M1s0XTtcclxuICAgICAgICAgICAgYXIyWzVdID0gbWF0M1s1XTtcclxuICAgICAgICAgICAgYXIyWzZdID0gbWF0M1s2XTtcclxuICAgICAgICAgICAgYXIyWzddID0gbWF0M1s3XTtcclxuICAgICAgICAgICAgYXIyWzhdID0gbWF0M1s4XTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKG1hdHJpeCwgYWZmaW5lKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgZCA9IDEuMCAvIG1hdDNbOF07XHJcbiAgICAgICAgICAgIHZhciB0eCA9IG1hdDNbNl0gKiBkLCB0eSA9IG1hdDNbN10gKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguYSA9IChtYXQzWzBdIC0gbWF0M1syXSAqIHR4KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5iID0gKG1hdDNbMV0gLSBtYXQzWzJdICogdHkpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmMgPSAobWF0M1szXSAtIG1hdDNbNV0gKiB0eCkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguZCA9IChtYXQzWzRdIC0gbWF0M1s1XSAqIHR5KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC50eCA9IHR4O1xyXG4gICAgICAgICAgICBtYXRyaXgudHkgPSB0eTtcclxuICAgICAgICAgICAgaWYgKGFmZmluZSA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWZmaW5lID09PSBBRkZJTkUuUE9JTlQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmIgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5jID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguZCA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhZmZpbmUgPT09IEFGRklORS5BWElTX1gpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYyA9IC1tYXRyaXguYjtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguZCA9IG1hdHJpeC5hO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWZmaW5lID09PSBBRkZJTkUuQVhJU19ZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmEgPSBtYXRyaXguZDtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYyA9IC1tYXRyaXguYjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNvcHlGcm9tID0gZnVuY3Rpb24gKG1hdHJpeCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IG1hdHJpeC5hO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gbWF0cml4LmI7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gbWF0cml4LmM7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBtYXRyaXguZDtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSBtYXRyaXgudHg7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSBtYXRyaXgudHk7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxLjA7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNldFRvTXVsdExlZ2FjeSA9IGZ1bmN0aW9uIChwdCwgbHQpIHtcclxuICAgICAgICAgICAgdmFyIG91dCA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGIgPSBsdC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gcHQuYSwgYTAxID0gcHQuYiwgYTEwID0gcHQuYywgYTExID0gcHQuZCwgYTIwID0gcHQudHgsIGEyMSA9IHB0LnR5LCBiMDAgPSBiWzBdLCBiMDEgPSBiWzFdLCBiMDIgPSBiWzJdLCBiMTAgPSBiWzNdLCBiMTEgPSBiWzRdLCBiMTIgPSBiWzVdLCBiMjAgPSBiWzZdLCBiMjEgPSBiWzddLCBiMjIgPSBiWzhdO1xyXG4gICAgICAgICAgICBvdXRbMF0gPSBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFsxXSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzJdID0gYjAyO1xyXG4gICAgICAgICAgICBvdXRbM10gPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs0XSA9IGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzVdID0gYjEyO1xyXG4gICAgICAgICAgICBvdXRbNl0gPSBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs3XSA9IGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzhdID0gYjIyO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zZXRUb011bHQyZCA9IGZ1bmN0aW9uIChwdCwgbHQpIHtcclxuICAgICAgICAgICAgdmFyIG91dCA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGEgPSBwdC5tYXQzLCBiID0gbHQubWF0MztcclxuICAgICAgICAgICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sIGIwMCA9IGJbMF0sIGIwMSA9IGJbMV0sIGIwMiA9IGJbMl0sIGIxMCA9IGJbM10sIGIxMSA9IGJbNF0sIGIxMiA9IGJbNV0sIGIyMCA9IGJbNl0sIGIyMSA9IGJbN10sIGIyMiA9IGJbOF07XHJcbiAgICAgICAgICAgIG91dFswXSA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzFdID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbMl0gPSBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjI7XHJcbiAgICAgICAgICAgIG91dFszXSA9IGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbNV0gPSBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjI7XHJcbiAgICAgICAgICAgIG91dFs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbOF0gPSBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjI7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQuSURFTlRJVFkgPSBuZXcgTWF0cml4MmQoKTtcclxuICAgICAgICBNYXRyaXgyZC5URU1QX01BVFJJWCA9IG5ldyBNYXRyaXgyZCgpO1xyXG4gICAgICAgIHJldHVybiBNYXRyaXgyZDtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQgPSBNYXRyaXgyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtSGFjayhwYXJlbnRUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2YXIgcHJvaiA9IHRoaXMucHJvajtcclxuICAgICAgICB2YXIgdGEgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwd2lkID0gcGFyZW50VHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgIHZhciBsdCA9IHRhLmxvY2FsVHJhbnNmb3JtO1xyXG4gICAgICAgIGlmICh0YS5fbG9jYWxJRCAhPT0gdGEuX2N1cnJlbnRMb2NhbElEKSB7XHJcbiAgICAgICAgICAgIGx0LmEgPSB0YS5fY3ggKiB0YS5zY2FsZS5feDtcclxuICAgICAgICAgICAgbHQuYiA9IHRhLl9zeCAqIHRhLnNjYWxlLl94O1xyXG4gICAgICAgICAgICBsdC5jID0gdGEuX2N5ICogdGEuc2NhbGUuX3k7XHJcbiAgICAgICAgICAgIGx0LmQgPSB0YS5fc3kgKiB0YS5zY2FsZS5feTtcclxuICAgICAgICAgICAgbHQudHggPSB0YS5wb3NpdGlvbi5feCAtICgodGEucGl2b3QuX3ggKiBsdC5hKSArICh0YS5waXZvdC5feSAqIGx0LmMpKTtcclxuICAgICAgICAgICAgbHQudHkgPSB0YS5wb3NpdGlvbi5feSAtICgodGEucGl2b3QuX3ggKiBsdC5iKSArICh0YS5waXZvdC5feSAqIGx0LmQpKTtcclxuICAgICAgICAgICAgdGEuX2N1cnJlbnRMb2NhbElEID0gdGEuX2xvY2FsSUQ7XHJcbiAgICAgICAgICAgIHByb2ouX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9tYXRyaXhJRCA9IHByb2ouX3Byb2pJRDtcclxuICAgICAgICBpZiAocHJvai5fY3VycmVudFByb2pJRCAhPT0gX21hdHJpeElEKSB7XHJcbiAgICAgICAgICAgIHByb2ouX2N1cnJlbnRQcm9qSUQgPSBfbWF0cml4SUQ7XHJcbiAgICAgICAgICAgIGlmIChfbWF0cml4SUQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHByb2oubG9jYWwuc2V0VG9NdWx0TGVnYWN5KGx0LCBwcm9qLm1hdHJpeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLmxvY2FsLmNvcHlGcm9tKGx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRhLl9wYXJlbnRJRCAhPT0gcHdpZCkge1xyXG4gICAgICAgICAgICB2YXIgcHAgPSBwYXJlbnRUcmFuc2Zvcm0ucHJvajtcclxuICAgICAgICAgICAgaWYgKHBwICYmICFwcC5hZmZpbmUpIHtcclxuICAgICAgICAgICAgICAgIHByb2oud29ybGQuc2V0VG9NdWx0MmQocHAud29ybGQsIHByb2oubG9jYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvai53b3JsZC5zZXRUb011bHRMZWdhY3kocGFyZW50VHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtLCBwcm9qLmxvY2FsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9qLndvcmxkLmNvcHkodGEud29ybGRUcmFuc2Zvcm0sIHByb2ouX2FmZmluZSk7XHJcbiAgICAgICAgICAgIHRhLl9wYXJlbnRJRCA9IHB3aWQ7XHJcbiAgICAgICAgICAgIHRhLl93b3JsZElEKys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIHQwID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgIHZhciB0dCA9IFtuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpXTtcclxuICAgIHZhciB0ZW1wUmVjdCA9IG5ldyBQSVhJLlJlY3RhbmdsZSgpO1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICB2YXIgUHJvamVjdGlvbjJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoUHJvamVjdGlvbjJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb24yZChsZWdhY3ksIGVuYWJsZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBsZWdhY3ksIGVuYWJsZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMubWF0cml4ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5sb2NhbCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgX3RoaXMud29ybGQgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qSUQgPSAwO1xyXG4gICAgICAgICAgICBfdGhpcy5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgICAgICBfdGhpcy5fYWZmaW5lID0gcGl4aV9wcm9qZWN0aW9uLkFGRklORS5OT05FO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uMmQucHJvdG90eXBlLCBcImFmZmluZVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FmZmluZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hZmZpbmUgPT0gdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWZmaW5lID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uMmQucHJvdG90eXBlLCBcImVuYWJsZWRcIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl9lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gdHJhbnNmb3JtSGFjaztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IFBJWEkuVHJhbnNmb3JtU3RhdGljLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUuc2V0QXhpc1ggPSBmdW5jdGlvbiAocCwgZmFjdG9yKSB7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgPT09IHZvaWQgMCkgeyBmYWN0b3IgPSAxOyB9XHJcbiAgICAgICAgICAgIHZhciB4ID0gcC54LCB5ID0gcC55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0geCAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSB5IC8gZDtcclxuICAgICAgICAgICAgbWF0M1syXSA9IGZhY3RvciAvIGQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5zZXRBeGlzWSA9IGZ1bmN0aW9uIChwLCBmYWN0b3IpIHtcclxuICAgICAgICAgICAgaWYgKGZhY3RvciA9PT0gdm9pZCAwKSB7IGZhY3RvciA9IDE7IH1cclxuICAgICAgICAgICAgdmFyIHggPSBwLngsIHkgPSBwLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSB4IC8gZDtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHkgLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gZmFjdG9yIC8gZDtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEKys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLm1hcFNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQpIHtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC54ID0gLXNwcml0ZS5hbmNob3IueCAqIHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gLXNwcml0ZS5hbmNob3IueSAqIHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdGVtcFJlY3Qud2lkdGggPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBRdWFkKHRlbXBSZWN0LCBxdWFkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUubWFwUXVhZCA9IGZ1bmN0aW9uIChyZWN0LCBwKSB7XHJcbiAgICAgICAgICAgIHR0WzBdLnNldChyZWN0LngsIHJlY3QueSk7XHJcbiAgICAgICAgICAgIHR0WzFdLnNldChyZWN0LnggKyByZWN0LndpZHRoLCByZWN0LnkpO1xyXG4gICAgICAgICAgICB0dFsyXS5zZXQocmVjdC54ICsgcmVjdC53aWR0aCwgcmVjdC55ICsgcmVjdC5oZWlnaHQpO1xyXG4gICAgICAgICAgICB0dFszXS5zZXQocmVjdC54LCByZWN0LnkgKyByZWN0LmhlaWdodCk7XHJcbiAgICAgICAgICAgIHZhciBrMSA9IDEsIGsyID0gMiwgazMgPSAzO1xyXG4gICAgICAgICAgICB2YXIgZiA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5nZXRJbnRlcnNlY3Rpb25GYWN0b3IocFswXSwgcFsyXSwgcFsxXSwgcFszXSwgdDApO1xyXG4gICAgICAgICAgICBpZiAoZiAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgazEgPSAxO1xyXG4gICAgICAgICAgICAgICAgazIgPSAzO1xyXG4gICAgICAgICAgICAgICAgazMgPSAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkMCA9IE1hdGguc3FydCgocFswXS54IC0gdDAueCkgKiAocFswXS54IC0gdDAueCkgKyAocFswXS55IC0gdDAueSkgKiAocFswXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgZDEgPSBNYXRoLnNxcnQoKHBbazFdLnggLSB0MC54KSAqIChwW2sxXS54IC0gdDAueCkgKyAocFtrMV0ueSAtIHQwLnkpICogKHBbazFdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBkMiA9IE1hdGguc3FydCgocFtrMl0ueCAtIHQwLngpICogKHBbazJdLnggLSB0MC54KSArIChwW2syXS55IC0gdDAueSkgKiAocFtrMl0ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIGQzID0gTWF0aC5zcXJ0KChwW2szXS54IC0gdDAueCkgKiAocFtrM10ueCAtIHQwLngpICsgKHBbazNdLnkgLSB0MC55KSAqIChwW2szXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgcTAgPSAoZDAgKyBkMykgLyBkMztcclxuICAgICAgICAgICAgdmFyIHExID0gKGQxICsgZDIpIC8gZDI7XHJcbiAgICAgICAgICAgIHZhciBxMiA9IChkMSArIGQyKSAvIGQxO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSB0dFswXS54ICogcTA7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSB0dFswXS55ICogcTA7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSBxMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IHR0W2sxXS54ICogcTE7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSB0dFtrMV0ueSAqIHExO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gcTE7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSB0dFtrMl0ueCAqIHEyO1xyXG4gICAgICAgICAgICBtYXQzWzddID0gdHRbazJdLnkgKiBxMjtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IHEyO1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeC5pbnZlcnQoKTtcclxuICAgICAgICAgICAgbWF0MyA9IHRlbXBNYXQubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHBbMF0ueDtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHBbMF0ueTtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBwW2sxXS54O1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gcFtrMV0ueTtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSBwW2syXS54O1xyXG4gICAgICAgICAgICBtYXQzWzddID0gcFtrMl0ueTtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4LnNldFRvTXVsdDJkKHRlbXBNYXQsIHRoaXMubWF0cml4KTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEKys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4LmlkZW50aXR5KCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvbjJkO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCA9IFByb2plY3Rpb24yZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE1lc2gyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKE1lc2gyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBNZXNoMmQodGV4dHVyZSwgdmVydGljZXMsIHV2cywgaW5kaWNlcywgZHJhd01vZGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dHVyZSwgdmVydGljZXMsIHV2cywgaW5kaWNlcywgZHJhd01vZGUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ21lc2gyZCc7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lc2gyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBNZXNoMmQ7XHJcbiAgICB9KFBJWEkubWVzaC5NZXNoKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uTWVzaDJkID0gTWVzaDJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB0cmFuc2xhdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgdVRyYW5zZm9ybTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiB0cmFuc2xhdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcblxcbiAgICB2VGV4dHVyZUNvb3JkID0gKHVUcmFuc2Zvcm0gKiB2ZWMzKGFUZXh0dXJlQ29vcmQsIDEuMCkpLnh5O1xcbn1cXG5cIjtcclxuICAgIHZhciBzaGFkZXJGcmFnID0gXCJcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHZlYzQgdUNvbG9yO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKSAqIHVDb2xvcjtcXG59XCI7XHJcbiAgICB2YXIgTWVzaDJkUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhNZXNoMmRSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBNZXNoMmRSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBNZXNoMmRSZW5kZXJlci5wcm90b3R5cGUub25Db250ZXh0Q2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB0aGlzLnNoYWRlciA9IG5ldyBQSVhJLlNoYWRlcihnbCwgc2hhZGVyVmVydCwgc2hhZGVyRnJhZyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gTWVzaDJkUmVuZGVyZXI7XHJcbiAgICB9KFBJWEkubWVzaC5NZXNoUmVuZGVyZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5NZXNoMmRSZW5kZXJlciA9IE1lc2gyZFJlbmRlcmVyO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdtZXNoMmQnLCBNZXNoMmRSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIFBJWEkuU3ByaXRlLnByb3RvdHlwZS5jb252ZXJ0VG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGUyZCc7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLm1lc2guTWVzaC5wcm90b3R5cGUuY29udmVydFRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLnBsdWdpbk5hbWUgPSAnbWVzaDJkJztcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0VG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRTdWJ0cmVlVG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNvbnZlcnRUbzJkKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY29udmVydFN1YnRyZWVUbzJkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFNwcml0ZTJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlMmQodGV4dHVyZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0dXJlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGUyZCc7XHJcbiAgICAgICAgICAgIF90aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGUyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5fYm91bmRzLmFkZFF1YWQodGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FmZmluZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGV4RGF0YS5sZW5ndGggIT0gOCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoOCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMudmVydGV4RGF0YS5sZW5ndGggIT0gMTIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RyYW5zZm9ybUlEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZUlEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy5wcm9qLndvcmxkLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdHJpbSA9IHRleHR1cmUudHJpbTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IDA7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0cmltKSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IHRyaW0ueCAtIChhbmNob3IuX3ggKiBvcmlnLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyB0cmltLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSB0cmltLnkgLSAoYW5jaG9yLl95ICogb3JpZy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIHRyaW0uaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9ICh3dFswXSAqIHcxKSArICh3dFszXSAqIGgxKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gKHd0WzFdICogdzEpICsgKHd0WzRdICogaDEpICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSAod3RbMl0gKiB3MSkgKyAod3RbNV0gKiBoMSkgKyB3dFs4XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9ICh3dFswXSAqIHcwKSArICh3dFszXSAqIGgxKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gKHd0WzFdICogdzApICsgKHd0WzRdICogaDEpICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSAod3RbMl0gKiB3MCkgKyAod3RbNV0gKiBoMSkgKyB3dFs4XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9ICh3dFswXSAqIHcwKSArICh3dFszXSAqIGgwKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gKHd0WzFdICogdzApICsgKHd0WzRdICogaDApICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbOF0gPSAod3RbMl0gKiB3MCkgKyAod3RbNV0gKiBoMCkgKyB3dFs4XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs5XSA9ICh3dFswXSAqIHcxKSArICh3dFszXSAqIGgwKSArIHd0WzZdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzEwXSA9ICh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgwKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzExXSA9ICh3dFsyXSAqIHcxKSArICh3dFs1XSAqIGgwKSArIHd0WzhdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWZmaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcy5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZlcnRleFRyaW1tZWREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleFRyaW1tZWREYXRhID0gbmV3IEZsb2F0MzJBcnJheSg4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlVHJpbW1lZElEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4VHJpbW1lZERhdGE7XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnByb2oud29ybGQubWF0MztcclxuICAgICAgICAgICAgdmFyIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgeiA9IDEuMCAvICh3dFsyXSAqIHcxICsgd3RbNV0gKiBoMSArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IHogKiAoKHd0WzBdICogdzEpICsgKHd0WzNdICogaDEpICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0geiAqICgod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XSk7XHJcbiAgICAgICAgICAgIHogPSAxLjAgLyAod3RbMl0gKiB3MCArIHd0WzVdICogaDEgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSB6ICogKCh3dFswXSAqIHcwKSArICh3dFszXSAqIGgxKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IHogKiAoKHd0WzFdICogdzApICsgKHd0WzRdICogaDEpICsgd3RbN10pO1xyXG4gICAgICAgICAgICB6ID0gMS4wIC8gKHd0WzJdICogdzAgKyB3dFs1XSAqIGgwICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0geiAqICgod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMCkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSB6ICogKCh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgwKSArIHd0WzddKTtcclxuICAgICAgICAgICAgeiA9IDEuMCAvICh3dFsyXSAqIHcxICsgd3RbNV0gKiBoMCArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IHogKiAoKHd0WzBdICogdzEpICsgKHd0WzNdICogaDApICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0geiAqICgod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ByaXRlMmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlMmQ7XHJcbiAgICB9KFBJWEkuU3ByaXRlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQgPSBTcHJpdGUyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsLk11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgdmFyIFNwcml0ZTJkUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGUyZFJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZTJkUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuYXR0cmlidXRlIHZlYzQgYUNvbG9yO1xcbmF0dHJpYnV0ZSBmbG9hdCBhVGV4dHVyZUlkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIGFWZXJ0ZXhQb3NpdGlvbjtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG4gICAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbiAgICB2VGV4dHVyZUlkID0gYVRleHR1cmVJZDtcXG4gICAgdkNvbG9yID0gYUNvbG9yO1xcbn1cXG5cIjtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9IFwiXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXJzWyVjb3VudCVdO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG52ZWM0IGNvbG9yO1xcbnZlYzIgdGV4dHVyZUNvb3JkID0gdlRleHR1cmVDb29yZDtcXG5mbG9hdCB0ZXh0dXJlSWQgPSBmbG9vcih2VGV4dHVyZUlkKzAuNSk7XFxuJWZvcmxvb3AlXFxuZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiB2Q29sb3I7XFxufVwiO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZTJkUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZVZhbyA9IGZ1bmN0aW9uICh2ZXJ0ZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgdGhpcy52ZXJ0U2l6ZSA9IDY7XHJcbiAgICAgICAgICAgIHRoaXMudmVydEJ5dGVTaXplID0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHZhciB2YW8gPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZVZhbygpXHJcbiAgICAgICAgICAgICAgICAuYWRkSW5kZXgodGhpcy5pbmRleEJ1ZmZlcilcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDApXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVDb29yZCwgZ2wuVU5TSUdORURfU0hPUlQsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCAzICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hQ29sb3IsIGdsLlVOU0lHTkVEX0JZVEUsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCA0ICogNCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5hVGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YW8uYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVJZCwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNSAqIDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YW87XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUyZFJlbmRlcmVyLnByb3RvdHlwZS5maWxsVmVydGljZXMgPSBmdW5jdGlvbiAoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIHRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHNwcml0ZS52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdXZzID0gc3ByaXRlLl90ZXh0dXJlLl91dnMudXZzVWludDMyO1xyXG4gICAgICAgICAgICBpZiAodmVydGV4RGF0YS5sZW5ndGggPT09IDgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmVyLnJvdW5kUGl4ZWxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc29sdXRpb24gPSB0aGlzLnJlbmRlcmVyLnJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gKCh2ZXJ0ZXhEYXRhWzBdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9ICgodmVydGV4RGF0YVsxXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9ICgodmVydGV4RGF0YVsyXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSAoKHZlcnRleERhdGFbM10gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTJdID0gKCh2ZXJ0ZXhEYXRhWzRdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSAoKHZlcnRleERhdGFbNV0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE0XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE4XSA9ICgodmVydGV4RGF0YVs2XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTldID0gKCh2ZXJ0ZXhEYXRhWzddICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyMF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IHZlcnRleERhdGFbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IHZlcnRleERhdGFbM107XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEyXSA9IHZlcnRleERhdGFbNF07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB2ZXJ0ZXhEYXRhWzVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTRdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMThdID0gdmVydGV4RGF0YVs2XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE5XSA9IHZlcnRleERhdGFbN107XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyMF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhWzBdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbMV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gdmVydGV4RGF0YVsyXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSB2ZXJ0ZXhEYXRhWzNdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IHZlcnRleERhdGFbNF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gdmVydGV4RGF0YVs1XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTJdID0gdmVydGV4RGF0YVs2XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdmVydGV4RGF0YVs3XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTRdID0gdmVydGV4RGF0YVs4XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMThdID0gdmVydGV4RGF0YVs5XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTldID0gdmVydGV4RGF0YVsxMF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDIwXSA9IHZlcnRleERhdGFbMTFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAzXSA9IHV2c1swXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDldID0gdXZzWzFdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMTVdID0gdXZzWzJdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMjFdID0gdXZzWzNdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgNF0gPSB1aW50MzJWaWV3W2luZGV4ICsgMTBdID0gdWludDMyVmlld1tpbmRleCArIDE2XSA9IHVpbnQzMlZpZXdbaW5kZXggKyAyMl0gPSBhcmdiO1xyXG4gICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDVdID0gZmxvYXQzMlZpZXdbaW5kZXggKyAxMV0gPSBmbG9hdDMyVmlld1tpbmRleCArIDE3XSA9IGZsb2F0MzJWaWV3W2luZGV4ICsgMjNdID0gdGV4dHVyZUlkO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZTJkUmVuZGVyZXI7XHJcbiAgICB9KE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKSk7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Nwcml0ZTJkJywgU3ByaXRlMmRSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBUZXh0MmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhUZXh0MmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gVGV4dDJkKHRleHQsIHN0eWxlLCBjYW52YXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dCwgc3R5bGUsIGNhbnZhcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlMmQnO1xyXG4gICAgICAgICAgICBfdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRleHQyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBUZXh0MmQ7XHJcbiAgICB9KFBJWEkuVGV4dCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlRleHQyZCA9IFRleHQyZDtcclxuICAgIFRleHQyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgVGV4dDJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgIFRleHQyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFByb2plY3Rpb25zTWFuYWdlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvbnNNYW5hZ2VyKHJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMub25Db250ZXh0Q2hhbmdlID0gZnVuY3Rpb24gKGdsKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5nbCA9IGdsO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucmVuZGVyZXIubWFza01hbmFnZXIucHVzaFNwcml0ZU1hc2sgPSBwdXNoU3ByaXRlTWFzaztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xyXG4gICAgICAgICAgICByZW5kZXJlci5vbignY29udGV4dCcsIHRoaXMub25Db250ZXh0Q2hhbmdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgUHJvamVjdGlvbnNNYW5hZ2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLm9mZignY29udGV4dCcsIHRoaXMub25Db250ZXh0Q2hhbmdlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uc01hbmFnZXI7XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25zTWFuYWdlciA9IFByb2plY3Rpb25zTWFuYWdlcjtcclxuICAgIGZ1bmN0aW9uIHB1c2hTcHJpdGVNYXNrKHRhcmdldCwgbWFza0RhdGEpIHtcclxuICAgICAgICB2YXIgYWxwaGFNYXNrRmlsdGVyID0gdGhpcy5hbHBoYU1hc2tQb29sW3RoaXMuYWxwaGFNYXNrSW5kZXhdO1xyXG4gICAgICAgIGlmICghYWxwaGFNYXNrRmlsdGVyKSB7XHJcbiAgICAgICAgICAgIGFscGhhTWFza0ZpbHRlciA9IHRoaXMuYWxwaGFNYXNrUG9vbFt0aGlzLmFscGhhTWFza0luZGV4XSA9IFtuZXcgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZU1hc2tGaWx0ZXIyZChtYXNrRGF0YSldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhbHBoYU1hc2tGaWx0ZXJbMF0ucmVzb2x1dGlvbiA9IHRoaXMucmVuZGVyZXIucmVzb2x1dGlvbjtcclxuICAgICAgICBhbHBoYU1hc2tGaWx0ZXJbMF0ubWFza1Nwcml0ZSA9IG1hc2tEYXRhO1xyXG4gICAgICAgIHRhcmdldC5maWx0ZXJBcmVhID0gbWFza0RhdGEuZ2V0Qm91bmRzKHRydWUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuZmlsdGVyTWFuYWdlci5wdXNoRmlsdGVyKHRhcmdldCwgYWxwaGFNYXNrRmlsdGVyKTtcclxuICAgICAgICB0aGlzLmFscGhhTWFza0luZGV4Kys7XHJcbiAgICB9XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Byb2plY3Rpb25zJywgUHJvamVjdGlvbnNNYW5hZ2VyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHNwcml0ZU1hc2tWZXJ0ID0gXCJcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgb3RoZXJNYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMzIHZNYXNrQ29vcmQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcblxcdGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcblxcblxcdHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcblxcdHZNYXNrQ29vcmQgPSBvdGhlck1hdHJpeCAqIHZlYzMoIGFUZXh0dXJlQ29vcmQsIDEuMCk7XFxufVxcblwiO1xyXG4gICAgdmFyIHNwcml0ZU1hc2tGcmFnID0gXCJcXG52YXJ5aW5nIHZlYzMgdk1hc2tDb29yZDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IGFscGhhO1xcbnVuaWZvcm0gc2FtcGxlcjJEIG1hc2s7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICB2ZWMyIHV2ID0gdk1hc2tDb29yZC54eSAvIHZNYXNrQ29vcmQuejtcXG4gICAgXFxuICAgIHZlYzIgdGV4dCA9IGFicyggdXYgLSAwLjUgKTtcXG4gICAgdGV4dCA9IHN0ZXAoMC41LCB0ZXh0KTtcXG5cXG4gICAgZmxvYXQgY2xpcCA9IDEuMCAtIG1heCh0ZXh0LnksIHRleHQueCk7XFxuICAgIHZlYzQgb3JpZ2luYWwgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcbiAgICB2ZWM0IG1hc2t5ID0gdGV4dHVyZTJEKG1hc2ssIHV2KTtcXG5cXG4gICAgb3JpZ2luYWwgKj0gKG1hc2t5LnIgKiBtYXNreS5hICogYWxwaGEgKiBjbGlwKTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gb3JpZ2luYWw7XFxufVxcblwiO1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICB2YXIgU3ByaXRlTWFza0ZpbHRlcjJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlTWFza0ZpbHRlcjJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZU1hc2tGaWx0ZXIyZChzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc3ByaXRlTWFza1ZlcnQsIHNwcml0ZU1hc2tGcmFnKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5tYXNrTWF0cml4ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBzcHJpdGUucmVuZGVyYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfdGhpcy5tYXNrU3ByaXRlID0gc3ByaXRlO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZU1hc2tGaWx0ZXIyZC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAoZmlsdGVyTWFuYWdlciwgaW5wdXQsIG91dHB1dCwgY2xlYXIsIGN1cnJlbnRTdGF0ZSkge1xyXG4gICAgICAgICAgICB2YXIgbWFza1Nwcml0ZSA9IHRoaXMubWFza1Nwcml0ZTtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3Jtcy5tYXNrID0gbWFza1Nwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1zLm90aGVyTWF0cml4ID0gU3ByaXRlTWFza0ZpbHRlcjJkLmNhbGN1bGF0ZVNwcml0ZU1hdHJpeChjdXJyZW50U3RhdGUsIHRoaXMubWFza01hdHJpeCwgbWFza1Nwcml0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybXMuYWxwaGEgPSBtYXNrU3ByaXRlLndvcmxkQWxwaGE7XHJcbiAgICAgICAgICAgIGZpbHRlck1hbmFnZXIuYXBwbHlGaWx0ZXIodGhpcywgaW5wdXQsIG91dHB1dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVNYXNrRmlsdGVyMmQuY2FsY3VsYXRlU3ByaXRlTWF0cml4ID0gZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgbWFwcGVkTWF0cml4LCBzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIHByb2ogPSBzcHJpdGUucHJvajtcclxuICAgICAgICAgICAgdmFyIGZpbHRlckFyZWEgPSBjdXJyZW50U3RhdGUuc291cmNlRnJhbWU7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlU2l6ZSA9IGN1cnJlbnRTdGF0ZS5yZW5kZXJUYXJnZXQuc2l6ZTtcclxuICAgICAgICAgICAgdmFyIHdvcmxkVHJhbnNmb3JtID0gcHJvaiAmJiAhcHJvai5fYWZmaW5lID8gcHJvai53b3JsZC5jb3B5VG8odGVtcE1hdCkgOiB0ZW1wTWF0LmNvcHlGcm9tKHNwcml0ZS50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHNwcml0ZS50ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIG1hcHBlZE1hdHJpeC5zZXQodGV4dHVyZVNpemUud2lkdGgsIDAsIDAsIHRleHR1cmVTaXplLmhlaWdodCwgZmlsdGVyQXJlYS54LCBmaWx0ZXJBcmVhLnkpO1xyXG4gICAgICAgICAgICB3b3JsZFRyYW5zZm9ybS5pbnZlcnQoKTtcclxuICAgICAgICAgICAgbWFwcGVkTWF0cml4LnNldFRvTXVsdDJkKHdvcmxkVHJhbnNmb3JtLCBtYXBwZWRNYXRyaXgpO1xyXG4gICAgICAgICAgICBtYXBwZWRNYXRyaXguc2NhbGVBbmRUcmFuc2xhdGUoMS4wIC8gdGV4dHVyZS53aWR0aCwgMS4wIC8gdGV4dHVyZS5oZWlnaHQsIHNwcml0ZS5hbmNob3IueCwgc3ByaXRlLmFuY2hvci55KTtcclxuICAgICAgICAgICAgcmV0dXJuIG1hcHBlZE1hdHJpeDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGVNYXNrRmlsdGVyMmQ7XHJcbiAgICB9KFBJWEkuRmlsdGVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3ByaXRlTWFza0ZpbHRlcjJkID0gU3ByaXRlTWFza0ZpbHRlcjJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktcHJvamVjdGlvbi5qcy5tYXAiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiFcbiAqIHBpeGktc291bmQgLSB2Mi4wLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9waXhpanMvcGl4aS1zb3VuZFxuICogQ29tcGlsZWQgVHVlLCAxNCBOb3YgMjAxNyAxNzo1Mzo0NyBVVENcbiAqXG4gKiBwaXhpLXNvdW5kIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dChlLl9fcGl4aVNvdW5kPWUuX19waXhpU291bmR8fHt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KGUsdCl7ZnVuY3Rpb24gbigpe3RoaXMuY29uc3RydWN0b3I9ZX1vKGUsdCksZS5wcm90b3R5cGU9bnVsbD09PXQ/T2JqZWN0LmNyZWF0ZSh0KToobi5wcm90b3R5cGU9dC5wcm90b3R5cGUsbmV3IG4pfWlmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBQSVhJKXRocm93XCJQaXhpSlMgcmVxdWlyZWRcIjt2YXIgbj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLl9vdXRwdXQ9dCx0aGlzLl9pbnB1dD1lfXJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJkZXN0aW5hdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW5wdXR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7aWYodGhpcy5fZmlsdGVycyYmKHRoaXMuX2ZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbihlKXtlJiZlLmRpc2Nvbm5lY3QoKX0pLHRoaXMuX2ZpbHRlcnM9bnVsbCx0aGlzLl9pbnB1dC5jb25uZWN0KHRoaXMuX291dHB1dCkpLGUmJmUubGVuZ3RoKXt0aGlzLl9maWx0ZXJzPWUuc2xpY2UoMCksdGhpcy5faW5wdXQuZGlzY29ubmVjdCgpO3ZhciBuPW51bGw7ZS5mb3JFYWNoKGZ1bmN0aW9uKGUpe251bGw9PT1uP3QuX2lucHV0LmNvbm5lY3QoZS5kZXN0aW5hdGlvbik6bi5jb25uZWN0KGUuZGVzdGluYXRpb24pLG49ZX0pLG4uY29ubmVjdCh0aGlzLl9vdXRwdXQpfX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5maWx0ZXJzPW51bGwsdGhpcy5faW5wdXQ9bnVsbCx0aGlzLl9vdXRwdXQ9bnVsbH0sZX0oKSxvPU9iamVjdC5zZXRQcm90b3R5cGVPZnx8e19fcHJvdG9fXzpbXX1pbnN0YW5jZW9mIEFycmF5JiZmdW5jdGlvbihlLHQpe2UuX19wcm90b19fPXR9fHxmdW5jdGlvbihlLHQpe2Zvcih2YXIgbiBpbiB0KXQuaGFzT3duUHJvcGVydHkobikmJihlW25dPXRbbl0pfSxpPTAscj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZhciBuPWUuY2FsbCh0aGlzKXx8dGhpcztyZXR1cm4gbi5pZD1pKyssbi5pbml0KHQpLG59cmV0dXJuIHQobixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwcm9ncmVzc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlLmN1cnJlbnRUaW1lL3RoaXMuX2R1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGF1c2VkPWUsdGhpcy5yZWZyZXNoUGF1c2VkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuX29uUGxheT1mdW5jdGlvbigpe3RoaXMuX3BsYXlpbmc9ITB9LG4ucHJvdG90eXBlLl9vblBhdXNlPWZ1bmN0aW9uKCl7dGhpcy5fcGxheWluZz0hMX0sbi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLl9wbGF5aW5nPSExLHRoaXMuX2R1cmF0aW9uPWUuc291cmNlLmR1cmF0aW9uO3ZhciB0PXRoaXMuX3NvdXJjZT1lLnNvdXJjZS5jbG9uZU5vZGUoITEpO3Quc3JjPWUucGFyZW50LnVybCx0Lm9ucGxheT10aGlzLl9vblBsYXkuYmluZCh0aGlzKSx0Lm9ucGF1c2U9dGhpcy5fb25QYXVzZS5iaW5kKHRoaXMpLGUuY29udGV4dC5vbihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksZS5jb250ZXh0Lm9uKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKSx0aGlzLl9tZWRpYT1lfSxuLnByb3RvdHlwZS5faW50ZXJuYWxTdG9wPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiZ0aGlzLl9wbGF5aW5nJiYodGhpcy5fc291cmNlLm9uZW5kZWQ9bnVsbCx0aGlzLl9zb3VyY2UucGF1c2UoKSl9LG4ucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLl9zb3VyY2UmJnRoaXMuZW1pdChcInN0b3BcIil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNwZWVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NwZWVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwidm9sdW1lXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl92b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl92b2x1bWU9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJsb29wXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9sb29wfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbG9vcD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIm11dGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tdXRlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX211dGVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQ7dGhpcy5fc291cmNlLmxvb3A9dGhpcy5fbG9vcHx8dC5sb29wO3ZhciBuPWUudm9sdW1lKihlLm11dGVkPzA6MSksbz10LnZvbHVtZSoodC5tdXRlZD8wOjEpLGk9dGhpcy5fdm9sdW1lKih0aGlzLl9tdXRlZD8wOjEpO3RoaXMuX3NvdXJjZS52b2x1bWU9aSpuKm8sdGhpcy5fc291cmNlLnBsYXliYWNrUmF0ZT10aGlzLl9zcGVlZCplLnNwZWVkKnQuc3BlZWR9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50LG49dGhpcy5fcGF1c2VkfHx0LnBhdXNlZHx8ZS5wYXVzZWQ7biE9PXRoaXMuX3BhdXNlZFJlYWwmJih0aGlzLl9wYXVzZWRSZWFsPW4sbj8odGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwicGF1c2VkXCIpKToodGhpcy5lbWl0KFwicmVzdW1lZFwiKSx0aGlzLnBsYXkoe3N0YXJ0OnRoaXMuX3NvdXJjZS5jdXJyZW50VGltZSxlbmQ6dGhpcy5fZW5kLHZvbHVtZTp0aGlzLl92b2x1bWUsc3BlZWQ6dGhpcy5fc3BlZWQsbG9vcDp0aGlzLl9sb29wfSkpLHRoaXMuZW1pdChcInBhdXNlXCIsbikpfSxuLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMsbz1lLnN0YXJ0LGk9ZS5lbmQscj1lLnNwZWVkLHM9ZS5sb29wLHU9ZS52b2x1bWUsYT1lLm11dGVkO2kmJmNvbnNvbGUuYXNzZXJ0KGk+byxcIkVuZCB0aW1lIGlzIGJlZm9yZSBzdGFydCB0aW1lXCIpLHRoaXMuX3NwZWVkPXIsdGhpcy5fdm9sdW1lPXUsdGhpcy5fbG9vcD0hIXMsdGhpcy5fbXV0ZWQ9YSx0aGlzLnJlZnJlc2goKSx0aGlzLmxvb3AmJm51bGwhPT1pJiYoY29uc29sZS53YXJuKCdMb29waW5nIG5vdCBzdXBwb3J0IHdoZW4gc3BlY2lmeWluZyBhbiBcImVuZFwiIHRpbWUnKSx0aGlzLmxvb3A9ITEpLHRoaXMuX3N0YXJ0PW8sdGhpcy5fZW5kPWl8fHRoaXMuX2R1cmF0aW9uLHRoaXMuX3N0YXJ0PU1hdGgubWF4KDAsdGhpcy5fc3RhcnQtbi5QQURESU5HKSx0aGlzLl9lbmQ9TWF0aC5taW4odGhpcy5fZW5kK24uUEFERElORyx0aGlzLl9kdXJhdGlvbiksdGhpcy5fc291cmNlLm9ubG9hZGVkbWV0YWRhdGE9ZnVuY3Rpb24oKXt0Ll9zb3VyY2UmJih0Ll9zb3VyY2UuY3VycmVudFRpbWU9byx0Ll9zb3VyY2Uub25sb2FkZWRtZXRhZGF0YT1udWxsLHQuZW1pdChcInByb2dyZXNzXCIsbyx0Ll9kdXJhdGlvbiksUElYSS50aWNrZXIuc2hhcmVkLmFkZCh0Ll9vblVwZGF0ZSx0KSl9LHRoaXMuX3NvdXJjZS5vbmVuZGVkPXRoaXMuX29uQ29tcGxldGUuYmluZCh0aGlzKSx0aGlzLl9zb3VyY2UucGxheSgpLHRoaXMuZW1pdChcInN0YXJ0XCIpfSxuLnByb3RvdHlwZS5fb25VcGRhdGU9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLHRoaXMucHJvZ3Jlc3MsdGhpcy5fZHVyYXRpb24pLHRoaXMuX3NvdXJjZS5jdXJyZW50VGltZT49dGhpcy5fZW5kJiYhdGhpcy5fc291cmNlLmxvb3AmJnRoaXMuX29uQ29tcGxldGUoKX0sbi5wcm90b3R5cGUuX29uQ29tcGxldGU9ZnVuY3Rpb24oKXtQSVhJLnRpY2tlci5zaGFyZWQucmVtb3ZlKHRoaXMuX29uVXBkYXRlLHRoaXMpLHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInByb2dyZXNzXCIsMSx0aGlzLl9kdXJhdGlvbiksdGhpcy5lbWl0KFwiZW5kXCIsdGhpcyl9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtQSVhJLnRpY2tlci5zaGFyZWQucmVtb3ZlKHRoaXMuX29uVXBkYXRlLHRoaXMpLHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7dmFyIGU9dGhpcy5fc291cmNlO2UmJihlLm9uZW5kZWQ9bnVsbCxlLm9ucGxheT1udWxsLGUub25wYXVzZT1udWxsLHRoaXMuX2ludGVybmFsU3RvcCgpKSx0aGlzLl9zb3VyY2U9bnVsbCx0aGlzLl9zcGVlZD0xLHRoaXMuX3ZvbHVtZT0xLHRoaXMuX2xvb3A9ITEsdGhpcy5fZW5kPW51bGwsdGhpcy5fc3RhcnQ9MCx0aGlzLl9kdXJhdGlvbj0wLHRoaXMuX3BsYXlpbmc9ITEsdGhpcy5fcGF1c2VkUmVhbD0hMSx0aGlzLl9wYXVzZWQ9ITEsdGhpcy5fbXV0ZWQ9ITEsdGhpcy5fbWVkaWEmJih0aGlzLl9tZWRpYS5jb250ZXh0Lm9mZihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksdGhpcy5fbWVkaWEuY29udGV4dC5vZmYoXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpLHRoaXMuX21lZGlhPW51bGwpfSxuLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiW0hUTUxBdWRpb0luc3RhbmNlIGlkPVwiK3RoaXMuaWQrXCJdXCJ9LG4uUEFERElORz0uMSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlcikscz1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7cmV0dXJuIG51bGwhPT1lJiZlLmFwcGx5KHRoaXMsYXJndW1lbnRzKXx8dGhpc31yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5wYXJlbnQ9ZSx0aGlzLl9zb3VyY2U9ZS5vcHRpb25zLnNvdXJjZXx8bmV3IEF1ZGlvLGUudXJsJiYodGhpcy5fc291cmNlLnNyYz1lLnVybCl9LG4ucHJvdG90eXBlLmNyZWF0ZT1mdW5jdGlvbigpe3JldHVybiBuZXcgcih0aGlzKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiaXNQbGF5YWJsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4hIXRoaXMuX3NvdXJjZSYmND09PXRoaXMuX3NvdXJjZS5yZWFkeVN0YXRlfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImR1cmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2UuZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXJlbnQuY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBudWxsfSxzZXQ6ZnVuY3Rpb24oZSl7Y29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGZpbHRlcnNcIil9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCksdGhpcy5wYXJlbnQ9bnVsbCx0aGlzLl9zb3VyY2UmJih0aGlzLl9zb3VyY2Uuc3JjPVwiXCIsdGhpcy5fc291cmNlLmxvYWQoKSx0aGlzLl9zb3VyY2U9bnVsbCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNvdXJjZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5fc291cmNlLG49dGhpcy5wYXJlbnQ7aWYoND09PXQucmVhZHlTdGF0ZSl7bi5pc0xvYWRlZD0hMDt2YXIgbz1uLmF1dG9QbGF5U3RhcnQoKTtyZXR1cm4gdm9pZChlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShudWxsLG4sbyl9LDApKX1pZighbi51cmwpcmV0dXJuIGUobmV3IEVycm9yKFwic291bmQudXJsIG9yIHNvdW5kLnNvdXJjZSBtdXN0IGJlIHNldFwiKSk7dC5zcmM9bi51cmw7dmFyIGk9ZnVuY3Rpb24oKXt0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5dGhyb3VnaFwiLHIpLHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIixyKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLHMpLHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsdSl9LHI9ZnVuY3Rpb24oKXtpKCksbi5pc0xvYWRlZD0hMDt2YXIgdD1uLmF1dG9QbGF5U3RhcnQoKTtlJiZlKG51bGwsbix0KX0scz1mdW5jdGlvbigpe2koKSxlJiZlKG5ldyBFcnJvcihcIlNvdW5kIGxvYWRpbmcgaGFzIGJlZW4gYWJvcnRlZFwiKSl9LHU9ZnVuY3Rpb24oKXtpKCk7dmFyIG49XCJGYWlsZWQgdG8gbG9hZCBhdWRpbyBlbGVtZW50IChjb2RlOiBcIit0LmVycm9yLmNvZGUrXCIpXCI7ZT9lKG5ldyBFcnJvcihuKSk6Y29uc29sZS5lcnJvcihuKX07dC5hZGRFdmVudExpc3RlbmVyKFwiY2FucGxheXRocm91Z2hcIixyLCExKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsciwhMSksdC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIixzLCExKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLHUsITEpLHQubG9hZCgpfSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlciksdT1cInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOnt9LGE9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdD17ZXhwb3J0czp7fX0sZSh0LHQuZXhwb3J0cyksdC5leHBvcnRzfShmdW5jdGlvbihlKXshZnVuY3Rpb24odCl7ZnVuY3Rpb24gbigpe31mdW5jdGlvbiBvKGUsdCl7cmV0dXJuIGZ1bmN0aW9uKCl7ZS5hcHBseSh0LGFyZ3VtZW50cyl9fWZ1bmN0aW9uIGkoZSl7aWYoXCJvYmplY3RcIiE9dHlwZW9mIHRoaXMpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ld1wiKTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlKXRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgYSBmdW5jdGlvblwiKTt0aGlzLl9zdGF0ZT0wLHRoaXMuX2hhbmRsZWQ9ITEsdGhpcy5fdmFsdWU9dm9pZCAwLHRoaXMuX2RlZmVycmVkcz1bXSxsKGUsdGhpcyl9ZnVuY3Rpb24gcihlLHQpe2Zvcig7Mz09PWUuX3N0YXRlOyllPWUuX3ZhbHVlO2lmKDA9PT1lLl9zdGF0ZSlyZXR1cm4gdm9pZCBlLl9kZWZlcnJlZHMucHVzaCh0KTtlLl9oYW5kbGVkPSEwLGkuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCl7dmFyIG49MT09PWUuX3N0YXRlP3Qub25GdWxmaWxsZWQ6dC5vblJlamVjdGVkO2lmKG51bGw9PT1uKXJldHVybiB2b2lkKDE9PT1lLl9zdGF0ZT9zOnUpKHQucHJvbWlzZSxlLl92YWx1ZSk7dmFyIG87dHJ5e289bihlLl92YWx1ZSl9Y2F0Y2goZSl7cmV0dXJuIHZvaWQgdSh0LnByb21pc2UsZSl9cyh0LnByb21pc2Usbyl9KX1mdW5jdGlvbiBzKGUsdCl7dHJ5e2lmKHQ9PT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLlwiKTtpZih0JiYoXCJvYmplY3RcIj09dHlwZW9mIHR8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHQpKXt2YXIgbj10LnRoZW47aWYodCBpbnN0YW5jZW9mIGkpcmV0dXJuIGUuX3N0YXRlPTMsZS5fdmFsdWU9dCx2b2lkIGEoZSk7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgbilyZXR1cm4gdm9pZCBsKG8obix0KSxlKX1lLl9zdGF0ZT0xLGUuX3ZhbHVlPXQsYShlKX1jYXRjaCh0KXt1KGUsdCl9fWZ1bmN0aW9uIHUoZSx0KXtlLl9zdGF0ZT0yLGUuX3ZhbHVlPXQsYShlKX1mdW5jdGlvbiBhKGUpezI9PT1lLl9zdGF0ZSYmMD09PWUuX2RlZmVycmVkcy5sZW5ndGgmJmkuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCl7ZS5faGFuZGxlZHx8aS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oZS5fdmFsdWUpfSk7Zm9yKHZhciB0PTAsbj1lLl9kZWZlcnJlZHMubGVuZ3RoO3Q8bjt0KyspcihlLGUuX2RlZmVycmVkc1t0XSk7ZS5fZGVmZXJyZWRzPW51bGx9ZnVuY3Rpb24gYyhlLHQsbil7dGhpcy5vbkZ1bGZpbGxlZD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBlP2U6bnVsbCx0aGlzLm9uUmVqZWN0ZWQ9XCJmdW5jdGlvblwiPT10eXBlb2YgdD90Om51bGwsdGhpcy5wcm9taXNlPW59ZnVuY3Rpb24gbChlLHQpe3ZhciBuPSExO3RyeXtlKGZ1bmN0aW9uKGUpe258fChuPSEwLHModCxlKSl9LGZ1bmN0aW9uKGUpe258fChuPSEwLHUodCxlKSl9KX1jYXRjaChlKXtpZihuKXJldHVybjtuPSEwLHUodCxlKX19dmFyIHA9c2V0VGltZW91dDtpLnByb3RvdHlwZS5jYXRjaD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy50aGVuKG51bGwsZSl9LGkucHJvdG90eXBlLnRoZW49ZnVuY3Rpb24oZSx0KXt2YXIgbz1uZXcgdGhpcy5jb25zdHJ1Y3RvcihuKTtyZXR1cm4gcih0aGlzLG5ldyBjKGUsdCxvKSksb30saS5hbGw9ZnVuY3Rpb24oZSl7dmFyIHQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZSk7cmV0dXJuIG5ldyBpKGZ1bmN0aW9uKGUsbil7ZnVuY3Rpb24gbyhyLHMpe3RyeXtpZihzJiYoXCJvYmplY3RcIj09dHlwZW9mIHN8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHMpKXt2YXIgdT1zLnRoZW47aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdSlyZXR1cm4gdm9pZCB1LmNhbGwocyxmdW5jdGlvbihlKXtvKHIsZSl9LG4pfXRbcl09cywwPT0tLWkmJmUodCl9Y2F0Y2goZSl7bihlKX19aWYoMD09PXQubGVuZ3RoKXJldHVybiBlKFtdKTtmb3IodmFyIGk9dC5sZW5ndGgscj0wO3I8dC5sZW5ndGg7cisrKW8ocix0W3JdKX0pfSxpLnJlc29sdmU9ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwib2JqZWN0XCI9PXR5cGVvZiBlJiZlLmNvbnN0cnVjdG9yPT09aT9lOm5ldyBpKGZ1bmN0aW9uKHQpe3QoZSl9KX0saS5yZWplY3Q9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBpKGZ1bmN0aW9uKHQsbil7bihlKX0pfSxpLnJhY2U9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBpKGZ1bmN0aW9uKHQsbil7Zm9yKHZhciBvPTAsaT1lLmxlbmd0aDtvPGk7bysrKWVbb10udGhlbih0LG4pfSl9LGkuX2ltbWVkaWF0ZUZuPVwiZnVuY3Rpb25cIj09dHlwZW9mIHNldEltbWVkaWF0ZSYmZnVuY3Rpb24oZSl7c2V0SW1tZWRpYXRlKGUpfXx8ZnVuY3Rpb24oZSl7cChlLDApfSxpLl91bmhhbmRsZWRSZWplY3Rpb25Gbj1mdW5jdGlvbihlKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgY29uc29sZSYmY29uc29sZSYmY29uc29sZS53YXJuKFwiUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOlwiLGUpfSxpLl9zZXRJbW1lZGlhdGVGbj1mdW5jdGlvbihlKXtpLl9pbW1lZGlhdGVGbj1lfSxpLl9zZXRVbmhhbmRsZWRSZWplY3Rpb25Gbj1mdW5jdGlvbihlKXtpLl91bmhhbmRsZWRSZWplY3Rpb25Gbj1lfSxlLmV4cG9ydHM/ZS5leHBvcnRzPWk6dC5Qcm9taXNlfHwodC5Qcm9taXNlPWkpfSh1KX0pLGM9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5kZXN0aW5hdGlvbj1lLHRoaXMuc291cmNlPXR8fGV9cmV0dXJuIGUucHJvdG90eXBlLmNvbm5lY3Q9ZnVuY3Rpb24oZSl7dGhpcy5zb3VyY2UuY29ubmVjdChlKX0sZS5wcm90b3R5cGUuZGlzY29ubmVjdD1mdW5jdGlvbigpe3RoaXMuc291cmNlLmRpc2Nvbm5lY3QoKX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuZGlzY29ubmVjdCgpLHRoaXMuZGVzdGluYXRpb249bnVsbCx0aGlzLnNvdXJjZT1udWxsfSxlfSgpLGw9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLnNldFBhcmFtVmFsdWU9ZnVuY3Rpb24oZSx0KXtpZihlLnNldFZhbHVlQXRUaW1lKXt2YXIgbj1TLmluc3RhbmNlLmNvbnRleHQ7ZS5zZXRWYWx1ZUF0VGltZSh0LG4uYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKX1lbHNlIGUudmFsdWU9dDtyZXR1cm4gdH0sZX0oKSxwPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxvLGkscixzLHUsYSxjLHAsaCl7dm9pZCAwPT09dCYmKHQ9MCksdm9pZCAwPT09byYmKG89MCksdm9pZCAwPT09aSYmKGk9MCksdm9pZCAwPT09ciYmKHI9MCksdm9pZCAwPT09cyYmKHM9MCksdm9pZCAwPT09dSYmKHU9MCksdm9pZCAwPT09YSYmKGE9MCksdm9pZCAwPT09YyYmKGM9MCksdm9pZCAwPT09cCYmKHA9MCksdm9pZCAwPT09aCYmKGg9MCk7dmFyIGQ9dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChkPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgZj1be2Y6bi5GMzIsdHlwZTpcImxvd3NoZWxmXCIsZ2Fpbjp0fSx7ZjpuLkY2NCx0eXBlOlwicGVha2luZ1wiLGdhaW46b30se2Y6bi5GMTI1LHR5cGU6XCJwZWFraW5nXCIsZ2FpbjppfSx7ZjpuLkYyNTAsdHlwZTpcInBlYWtpbmdcIixnYWluOnJ9LHtmOm4uRjUwMCx0eXBlOlwicGVha2luZ1wiLGdhaW46c30se2Y6bi5GMUssdHlwZTpcInBlYWtpbmdcIixnYWluOnV9LHtmOm4uRjJLLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjphfSx7ZjpuLkY0Syx0eXBlOlwicGVha2luZ1wiLGdhaW46Y30se2Y6bi5GOEssdHlwZTpcInBlYWtpbmdcIixnYWluOnB9LHtmOm4uRjE2Syx0eXBlOlwiaGlnaHNoZWxmXCIsZ2FpbjpofV0ubWFwKGZ1bmN0aW9uKGUpe3ZhciB0PVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7cmV0dXJuIHQudHlwZT1lLnR5cGUsbC5zZXRQYXJhbVZhbHVlKHQuZ2FpbixlLmdhaW4pLGwuc2V0UGFyYW1WYWx1ZSh0LlEsMSksbC5zZXRQYXJhbVZhbHVlKHQuZnJlcXVlbmN5LGUuZiksdH0pOyhkPWUuY2FsbCh0aGlzLGZbMF0sZltmLmxlbmd0aC0xXSl8fHRoaXMpLmJhbmRzPWYsZC5iYW5kc01hcD17fTtmb3IodmFyIF89MDtfPGQuYmFuZHMubGVuZ3RoO18rKyl7dmFyIHk9ZC5iYW5kc1tfXTtfPjAmJmQuYmFuZHNbXy0xXS5jb25uZWN0KHkpLGQuYmFuZHNNYXBbeS5mcmVxdWVuY3kudmFsdWVdPXl9cmV0dXJuIGR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5zZXRHYWluPWZ1bmN0aW9uKGUsdCl7aWYodm9pZCAwPT09dCYmKHQ9MCksIXRoaXMuYmFuZHNNYXBbZV0pdGhyb3dcIk5vIGJhbmQgZm91bmQgZm9yIGZyZXF1ZW5jeSBcIitlO2wuc2V0UGFyYW1WYWx1ZSh0aGlzLmJhbmRzTWFwW2VdLmdhaW4sdCl9LG4ucHJvdG90eXBlLmdldEdhaW49ZnVuY3Rpb24oZSl7aWYoIXRoaXMuYmFuZHNNYXBbZV0pdGhyb3dcIk5vIGJhbmQgZm91bmQgZm9yIGZyZXF1ZW5jeSBcIitlO3JldHVybiB0aGlzLmJhbmRzTWFwW2VdLmdhaW4udmFsdWV9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYzMlwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjMyKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYzMixlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmNjRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY2NCl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GNjQsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjEyNVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjEyNSl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMTI1LGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYyNTBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYyNTApfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjI1MCxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmNTAwXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GNTAwKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY1MDAsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjFrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMUspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjFLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYya1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjJLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYySyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmNGtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY0Syl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GNEssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjhrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GOEspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjhLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYxNmtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYxNkspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjE2SyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuYmFuZHMuZm9yRWFjaChmdW5jdGlvbihlKXtsLnNldFBhcmFtVmFsdWUoZS5nYWluLDApfSl9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmJhbmRzLmZvckVhY2goZnVuY3Rpb24oZSl7ZS5kaXNjb25uZWN0KCl9KSx0aGlzLmJhbmRzPW51bGwsdGhpcy5iYW5kc01hcD1udWxsfSxuLkYzMj0zMixuLkY2ND02NCxuLkYxMjU9MTI1LG4uRjI1MD0yNTAsbi5GNTAwPTUwMCxuLkYxSz0xZTMsbi5GMks9MmUzLG4uRjRLPTRlMyxuLkY4Sz04ZTMsbi5GMTZLPTE2ZTMsbn0oYyksaD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZvaWQgMD09PXQmJih0PTApO3ZhciBuPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQobj1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIG89Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVXYXZlU2hhcGVyKCk7cmV0dXJuIG49ZS5jYWxsKHRoaXMsbyl8fHRoaXMsbi5fZGlzdG9ydGlvbj1vLG4uYW1vdW50PXQsbn1yZXR1cm4gdChuLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImFtb3VudFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYW1vdW50fSxzZXQ6ZnVuY3Rpb24oZSl7ZSo9MWUzLHRoaXMuX2Ftb3VudD1lO2Zvcih2YXIgdCxuPW5ldyBGbG9hdDMyQXJyYXkoNDQxMDApLG89TWF0aC5QSS8xODAsaT0wO2k8NDQxMDA7KytpKXQ9MippLzQ0MTAwLTEsbltpXT0oMytlKSp0KjIwKm8vKE1hdGguUEkrZSpNYXRoLmFicyh0KSk7dGhpcy5fZGlzdG9ydGlvbi5jdXJ2ZT1uLHRoaXMuX2Rpc3RvcnRpb24ub3ZlcnNhbXBsZT1cIjR4XCJ9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX2Rpc3RvcnRpb249bnVsbCxlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyl9LG59KGMpLGQ9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2b2lkIDA9PT10JiYodD0wKTt2YXIgbj10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKG49ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBvLGkscixzPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQ7cmV0dXJuIHMuY3JlYXRlU3RlcmVvUGFubmVyP3I9bz1zLmNyZWF0ZVN0ZXJlb1Bhbm5lcigpOigoaT1zLmNyZWF0ZVBhbm5lcigpKS5wYW5uaW5nTW9kZWw9XCJlcXVhbHBvd2VyXCIscj1pKSxuPWUuY2FsbCh0aGlzLHIpfHx0aGlzLG4uX3N0ZXJlbz1vLG4uX3Bhbm5lcj1pLG4ucGFuPXQsbn1yZXR1cm4gdChuLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGFufSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGFuPWUsdGhpcy5fc3RlcmVvP2wuc2V0UGFyYW1WYWx1ZSh0aGlzLl9zdGVyZW8ucGFuLGUpOnRoaXMuX3Bhbm5lci5zZXRQb3NpdGlvbihlLDAsMS1NYXRoLmFicyhlKSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2UucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKSx0aGlzLl9zdGVyZW89bnVsbCx0aGlzLl9wYW5uZXI9bnVsbH0sbn0oYyksZj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQsbixvKXt2b2lkIDA9PT10JiYodD0zKSx2b2lkIDA9PT1uJiYobj0yKSx2b2lkIDA9PT1vJiYobz0hMSk7dmFyIGk9dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChpPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgcj1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUNvbnZvbHZlcigpO3JldHVybiBpPWUuY2FsbCh0aGlzLHIpfHx0aGlzLGkuX2NvbnZvbHZlcj1yLGkuX3NlY29uZHM9aS5fY2xhbXAodCwxLDUwKSxpLl9kZWNheT1pLl9jbGFtcChuLDAsMTAwKSxpLl9yZXZlcnNlPW8saS5fcmVidWlsZCgpLGl9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5fY2xhbXA9ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBNYXRoLm1pbihuLE1hdGgubWF4KHQsZSkpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzZWNvbmRzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zZWNvbmRzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc2Vjb25kcz10aGlzLl9jbGFtcChlLDEsNTApLHRoaXMuX3JlYnVpbGQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJkZWNheVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGVjYXl9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9kZWNheT10aGlzLl9jbGFtcChlLDAsMTAwKSx0aGlzLl9yZWJ1aWxkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicmV2ZXJzZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmV2ZXJzZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3JldmVyc2U9ZSx0aGlzLl9yZWJ1aWxkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuX3JlYnVpbGQ9ZnVuY3Rpb24oKXtmb3IodmFyIGUsdD1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LG49dC5zYW1wbGVSYXRlLG89bip0aGlzLl9zZWNvbmRzLGk9dC5jcmVhdGVCdWZmZXIoMixvLG4pLHI9aS5nZXRDaGFubmVsRGF0YSgwKSxzPWkuZ2V0Q2hhbm5lbERhdGEoMSksdT0wO3U8bzt1KyspZT10aGlzLl9yZXZlcnNlP28tdTp1LHJbdV09KDIqTWF0aC5yYW5kb20oKS0xKSpNYXRoLnBvdygxLWUvbyx0aGlzLl9kZWNheSksc1t1XT0oMipNYXRoLnJhbmRvbSgpLTEpKk1hdGgucG93KDEtZS9vLHRoaXMuX2RlY2F5KTt0aGlzLl9jb252b2x2ZXIuYnVmZmVyPWl9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9jb252b2x2ZXI9bnVsbCxlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyl9LG59KGMpLF89ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3ZhciB0PXRoaXM7Uy5pbnN0YW5jZS51c2VMZWdhY3kmJih0PWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgbj1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LG89bi5jcmVhdGVDaGFubmVsU3BsaXR0ZXIoKSxpPW4uY3JlYXRlQ2hhbm5lbE1lcmdlcigpO3JldHVybiBpLmNvbm5lY3QobyksdD1lLmNhbGwodGhpcyxpLG8pfHx0aGlzLHQuX21lcmdlcj1pLHR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fbWVyZ2VyLmRpc2Nvbm5lY3QoKSx0aGlzLl9tZXJnZXI9bnVsbCxlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyl9LG59KGMpLHk9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKGUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgdD1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LG49dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxvPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCksaT10LmNyZWF0ZUJpcXVhZEZpbHRlcigpLHI9dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtyZXR1cm4gbi50eXBlPVwibG93cGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShuLmZyZXF1ZW5jeSwyZTMpLG8udHlwZT1cImxvd3Bhc3NcIixsLnNldFBhcmFtVmFsdWUoby5mcmVxdWVuY3ksMmUzKSxpLnR5cGU9XCJoaWdocGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShpLmZyZXF1ZW5jeSw1MDApLHIudHlwZT1cImhpZ2hwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKHIuZnJlcXVlbmN5LDUwMCksbi5jb25uZWN0KG8pLG8uY29ubmVjdChpKSxpLmNvbm5lY3QociksZS5jYWxsKHRoaXMsbixyKXx8dGhpc31yZXR1cm4gdChuLGUpLG59KGMpLG09T2JqZWN0LmZyZWV6ZSh7RmlsdGVyOmMsRXF1YWxpemVyRmlsdGVyOnAsRGlzdG9ydGlvbkZpbHRlcjpoLFN0ZXJlb0ZpbHRlcjpkLFJldmVyYkZpbHRlcjpmLE1vbm9GaWx0ZXI6XyxUZWxlcGhvbmVGaWx0ZXI6eX0pLGI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3ZhciB0PWUuY2FsbCh0aGlzKXx8dGhpcztyZXR1cm4gdC5zcGVlZD0xLHQudm9sdW1lPTEsdC5tdXRlZD0hMSx0LnBhdXNlZD0hMSx0fXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3RoaXMuZW1pdChcInJlZnJlc2hcIil9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJyZWZyZXNoUGF1c2VkXCIpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgZmlsdGVyc1wiKSxudWxsfSxzZXQ6ZnVuY3Rpb24oZSl7Y29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGZpbHRlcnNcIil9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiYXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiBjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgYXVkaW9Db250ZXh0XCIpLG51bGx9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUudG9nZ2xlTXV0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLm11dGVkPSF0aGlzLm11dGVkLHRoaXMucmVmcmVzaCgpLHRoaXMubXV0ZWR9LG4ucHJvdG90eXBlLnRvZ2dsZVBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF1c2VkPSF0aGlzLnBhdXNlZCx0aGlzLnJlZnJlc2hQYXVzZWQoKSx0aGlzLnBhdXNlZH0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCl9LG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSxnPU9iamVjdC5mcmVlemUoe0hUTUxBdWRpb01lZGlhOnMsSFRNTEF1ZGlvSW5zdGFuY2U6cixIVE1MQXVkaW9Db250ZXh0OmJ9KSx2PTAsUD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZhciBuPWUuY2FsbCh0aGlzKXx8dGhpcztyZXR1cm4gbi5pZD12Kyssbi5fbWVkaWE9bnVsbCxuLl9wYXVzZWQ9ITEsbi5fbXV0ZWQ9ITEsbi5fZWxhcHNlZD0wLG4uX3VwZGF0ZUxpc3RlbmVyPW4uX3VwZGF0ZS5iaW5kKG4pLG4uaW5pdCh0KSxufXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmKHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInN0b3BcIikpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzcGVlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zcGVlZD1lLHRoaXMucmVmcmVzaCgpLHRoaXMuX3VwZGF0ZSghMCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwidm9sdW1lXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl92b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl92b2x1bWU9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJtdXRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbXV0ZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9tdXRlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImxvb3BcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xvb3B9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9sb29wPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQ7dGhpcy5fc291cmNlLmxvb3A9dGhpcy5fbG9vcHx8dC5sb29wO3ZhciBuPWUudm9sdW1lKihlLm11dGVkPzA6MSksbz10LnZvbHVtZSoodC5tdXRlZD8wOjEpLGk9dGhpcy5fdm9sdW1lKih0aGlzLl9tdXRlZD8wOjEpO2wuc2V0UGFyYW1WYWx1ZSh0aGlzLl9nYWluLmdhaW4saSpvKm4pLGwuc2V0UGFyYW1WYWx1ZSh0aGlzLl9zb3VyY2UucGxheWJhY2tSYXRlLHRoaXMuX3NwZWVkKnQuc3BlZWQqZS5zcGVlZCl9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50LG49dGhpcy5fcGF1c2VkfHx0LnBhdXNlZHx8ZS5wYXVzZWQ7biE9PXRoaXMuX3BhdXNlZFJlYWwmJih0aGlzLl9wYXVzZWRSZWFsPW4sbj8odGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwicGF1c2VkXCIpKToodGhpcy5lbWl0KFwicmVzdW1lZFwiKSx0aGlzLnBsYXkoe3N0YXJ0OnRoaXMuX2VsYXBzZWQldGhpcy5fZHVyYXRpb24sZW5kOnRoaXMuX2VuZCxzcGVlZDp0aGlzLl9zcGVlZCxsb29wOnRoaXMuX2xvb3Asdm9sdW1lOnRoaXMuX3ZvbHVtZX0pKSx0aGlzLmVtaXQoXCJwYXVzZVwiLG4pKX0sbi5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlKXt2YXIgdD1lLnN0YXJ0LG49ZS5lbmQsbz1lLnNwZWVkLGk9ZS5sb29wLHI9ZS52b2x1bWUscz1lLm11dGVkO24mJmNvbnNvbGUuYXNzZXJ0KG4+dCxcIkVuZCB0aW1lIGlzIGJlZm9yZSBzdGFydCB0aW1lXCIpLHRoaXMuX3BhdXNlZD0hMTt2YXIgdT10aGlzLl9tZWRpYS5ub2Rlcy5jbG9uZUJ1ZmZlclNvdXJjZSgpLGE9dS5zb3VyY2UsYz11LmdhaW47dGhpcy5fc291cmNlPWEsdGhpcy5fZ2Fpbj1jLHRoaXMuX3NwZWVkPW8sdGhpcy5fdm9sdW1lPXIsdGhpcy5fbG9vcD0hIWksdGhpcy5fbXV0ZWQ9cyx0aGlzLnJlZnJlc2goKSx0aGlzLmxvb3AmJm51bGwhPT1uJiYoY29uc29sZS53YXJuKCdMb29waW5nIG5vdCBzdXBwb3J0IHdoZW4gc3BlY2lmeWluZyBhbiBcImVuZFwiIHRpbWUnKSx0aGlzLmxvb3A9ITEpLHRoaXMuX2VuZD1uO3ZhciBsPXRoaXMuX3NvdXJjZS5idWZmZXIuZHVyYXRpb247dGhpcy5fZHVyYXRpb249bCx0aGlzLl9sYXN0VXBkYXRlPXRoaXMuX25vdygpLHRoaXMuX2VsYXBzZWQ9dCx0aGlzLl9zb3VyY2Uub25lbmRlZD10aGlzLl9vbkNvbXBsZXRlLmJpbmQodGhpcyksbj90aGlzLl9zb3VyY2Uuc3RhcnQoMCx0LG4tdCk6dGhpcy5fc291cmNlLnN0YXJ0KDAsdCksdGhpcy5lbWl0KFwic3RhcnRcIiksdGhpcy5fdXBkYXRlKCEwKSx0aGlzLl9lbmFibGVkPSEwfSxuLnByb3RvdHlwZS5fdG9TZWM9ZnVuY3Rpb24oZSl7cmV0dXJuIGU+MTAmJihlLz0xZTMpLGV8fDB9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIl9lbmFibGVkXCIse3NldDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLl9tZWRpYS5ub2Rlcy5zY3JpcHQ7dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYXVkaW9wcm9jZXNzXCIsdGhpcy5fdXBkYXRlTGlzdGVuZXIpLGUmJnQuYWRkRXZlbnRMaXN0ZW5lcihcImF1ZGlvcHJvY2Vzc1wiLHRoaXMuX3VwZGF0ZUxpc3RlbmVyKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwcm9ncmVzc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcHJvZ3Jlc3N9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYXVzZWQ9ZSx0aGlzLnJlZnJlc2hQYXVzZWQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLl9zb3VyY2UmJih0aGlzLl9zb3VyY2UuZGlzY29ubmVjdCgpLHRoaXMuX3NvdXJjZT1udWxsKSx0aGlzLl9nYWluJiYodGhpcy5fZ2Fpbi5kaXNjb25uZWN0KCksdGhpcy5fZ2Fpbj1udWxsKSx0aGlzLl9tZWRpYSYmKHRoaXMuX21lZGlhLmNvbnRleHQuZXZlbnRzLm9mZihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksdGhpcy5fbWVkaWEuY29udGV4dC5ldmVudHMub2ZmKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKSx0aGlzLl9tZWRpYT1udWxsKSx0aGlzLl9lbmQ9bnVsbCx0aGlzLl9zcGVlZD0xLHRoaXMuX3ZvbHVtZT0xLHRoaXMuX2xvb3A9ITEsdGhpcy5fZWxhcHNlZD0wLHRoaXMuX2R1cmF0aW9uPTAsdGhpcy5fcGF1c2VkPSExLHRoaXMuX211dGVkPSExLHRoaXMuX3BhdXNlZFJlYWw9ITF9LG4ucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJbV2ViQXVkaW9JbnN0YW5jZSBpZD1cIit0aGlzLmlkK1wiXVwifSxuLnByb3RvdHlwZS5fbm93PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX21lZGlhLmNvbnRleHQuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lfSxuLnByb3RvdHlwZS5fdXBkYXRlPWZ1bmN0aW9uKGUpe2lmKHZvaWQgMD09PWUmJihlPSExKSx0aGlzLl9zb3VyY2Upe3ZhciB0PXRoaXMuX25vdygpLG49dC10aGlzLl9sYXN0VXBkYXRlO2lmKG4+MHx8ZSl7dmFyIG89dGhpcy5fc291cmNlLnBsYXliYWNrUmF0ZS52YWx1ZTt0aGlzLl9lbGFwc2VkKz1uKm8sdGhpcy5fbGFzdFVwZGF0ZT10O3ZhciBpPXRoaXMuX2R1cmF0aW9uLHI9dGhpcy5fZWxhcHNlZCVpL2k7dGhpcy5fcHJvZ3Jlc3M9cix0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLHRoaXMuX3Byb2dyZXNzLGkpfX19LG4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5fbWVkaWE9ZSxlLmNvbnRleHQuZXZlbnRzLm9uKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSxlLmNvbnRleHQuZXZlbnRzLm9uKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKX0sbi5wcm90b3R5cGUuX2ludGVybmFsU3RvcD1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmKHRoaXMuX2VuYWJsZWQ9ITEsdGhpcy5fc291cmNlLm9uZW5kZWQ9bnVsbCx0aGlzLl9zb3VyY2Uuc3RvcCgpLHRoaXMuX3NvdXJjZT1udWxsKX0sbi5wcm90b3R5cGUuX29uQ29tcGxldGU9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJih0aGlzLl9lbmFibGVkPSExLHRoaXMuX3NvdXJjZS5vbmVuZGVkPW51bGwpLHRoaXMuX3NvdXJjZT1udWxsLHRoaXMuX3Byb2dyZXNzPTEsdGhpcy5lbWl0KFwicHJvZ3Jlc3NcIiwxLHRoaXMuX2R1cmF0aW9uKSx0aGlzLmVtaXQoXCJlbmRcIix0aGlzKX0sbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLHg9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2YXIgbz10aGlzLGk9dC5hdWRpb0NvbnRleHQscj1pLmNyZWF0ZUJ1ZmZlclNvdXJjZSgpLHM9aS5jcmVhdGVTY3JpcHRQcm9jZXNzb3Iobi5CVUZGRVJfU0laRSksdT1pLmNyZWF0ZUdhaW4oKSxhPWkuY3JlYXRlQW5hbHlzZXIoKTtyZXR1cm4gci5jb25uZWN0KGEpLGEuY29ubmVjdCh1KSx1LmNvbm5lY3QodC5kZXN0aW5hdGlvbikscy5jb25uZWN0KHQuZGVzdGluYXRpb24pLG89ZS5jYWxsKHRoaXMsYSx1KXx8dGhpcyxvLmNvbnRleHQ9dCxvLmJ1ZmZlclNvdXJjZT1yLG8uc2NyaXB0PXMsby5nYWluPXUsby5hbmFseXNlcj1hLG99cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7ZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpLHRoaXMuYnVmZmVyU291cmNlLmRpc2Nvbm5lY3QoKSx0aGlzLnNjcmlwdC5kaXNjb25uZWN0KCksdGhpcy5nYWluLmRpc2Nvbm5lY3QoKSx0aGlzLmFuYWx5c2VyLmRpc2Nvbm5lY3QoKSx0aGlzLmJ1ZmZlclNvdXJjZT1udWxsLHRoaXMuc2NyaXB0PW51bGwsdGhpcy5nYWluPW51bGwsdGhpcy5hbmFseXNlcj1udWxsLHRoaXMuY29udGV4dD1udWxsfSxuLnByb3RvdHlwZS5jbG9uZUJ1ZmZlclNvdXJjZT1mdW5jdGlvbigpe3ZhciBlPXRoaXMuYnVmZmVyU291cmNlLHQ9dGhpcy5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTt0LmJ1ZmZlcj1lLmJ1ZmZlcixsLnNldFBhcmFtVmFsdWUodC5wbGF5YmFja1JhdGUsZS5wbGF5YmFja1JhdGUudmFsdWUpLHQubG9vcD1lLmxvb3A7dmFyIG49dGhpcy5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7cmV0dXJuIHQuY29ubmVjdChuKSxuLmNvbm5lY3QodGhpcy5kZXN0aW5hdGlvbikse3NvdXJjZTp0LGdhaW46bn19LG4uQlVGRkVSX1NJWkU9MjU2LG59KG4pLE89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMucGFyZW50PWUsdGhpcy5fbm9kZXM9bmV3IHgodGhpcy5jb250ZXh0KSx0aGlzLl9zb3VyY2U9dGhpcy5fbm9kZXMuYnVmZmVyU291cmNlLHRoaXMuc291cmNlPWUub3B0aW9ucy5zb3VyY2V9LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnBhcmVudD1udWxsLHRoaXMuX25vZGVzLmRlc3Ryb3koKSx0aGlzLl9ub2Rlcz1udWxsLHRoaXMuX3NvdXJjZT1udWxsLHRoaXMuc291cmNlPW51bGx9LGUucHJvdG90eXBlLmNyZWF0ZT1mdW5jdGlvbigpe3JldHVybiBuZXcgUCh0aGlzKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXJlbnQuY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJpc1BsYXlhYmxlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiEhdGhpcy5fc291cmNlJiYhIXRoaXMuX3NvdXJjZS5idWZmZXJ9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbm9kZXMuZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX25vZGVzLmZpbHRlcnM9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJkdXJhdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY29uc29sZS5hc3NlcnQodGhpcy5pc1BsYXlhYmxlLFwiU291bmQgbm90IHlldCBwbGF5YWJsZSwgbm8gZHVyYXRpb25cIiksdGhpcy5fc291cmNlLmJ1ZmZlci5kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJidWZmZXJcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZS5idWZmZXJ9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zb3VyY2UuYnVmZmVyPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwibm9kZXNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX25vZGVzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oZSl7dGhpcy5zb3VyY2U/dGhpcy5fZGVjb2RlKHRoaXMuc291cmNlLGUpOnRoaXMucGFyZW50LnVybD90aGlzLl9sb2FkVXJsKGUpOmU/ZShuZXcgRXJyb3IoXCJzb3VuZC51cmwgb3Igc291bmQuc291cmNlIG11c3QgYmUgc2V0XCIpKTpjb25zb2xlLmVycm9yKFwic291bmQudXJsIG9yIHNvdW5kLnNvdXJjZSBtdXN0IGJlIHNldFwiKX0sZS5wcm90b3R5cGUuX2xvYWRVcmw9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxuPW5ldyBYTUxIdHRwUmVxdWVzdCxvPXRoaXMucGFyZW50LnVybDtuLm9wZW4oXCJHRVRcIixvLCEwKSxuLnJlc3BvbnNlVHlwZT1cImFycmF5YnVmZmVyXCIsbi5vbmxvYWQ9ZnVuY3Rpb24oKXt0LnNvdXJjZT1uLnJlc3BvbnNlLHQuX2RlY29kZShuLnJlc3BvbnNlLGUpfSxuLnNlbmQoKX0sZS5wcm90b3R5cGUuX2RlY29kZT1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXM7dGhpcy5wYXJlbnQuY29udGV4dC5kZWNvZGUoZSxmdW5jdGlvbihlLG8pe2lmKGUpdCYmdChlKTtlbHNle24ucGFyZW50LmlzTG9hZGVkPSEwLG4uYnVmZmVyPW87dmFyIGk9bi5wYXJlbnQuYXV0b1BsYXlTdGFydCgpO3QmJnQobnVsbCxuLnBhcmVudCxpKX19KX0sZX0oKSx3PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5yZXNvbHZlVXJsPWZ1bmN0aW9uKHQpe3ZhciBuPWUuRk9STUFUX1BBVFRFUk4sbz1cInN0cmluZ1wiPT10eXBlb2YgdD90OnQudXJsO2lmKG4udGVzdChvKSl7Zm9yKHZhciBpPW4uZXhlYyhvKSxyPWlbMl0uc3BsaXQoXCIsXCIpLHM9cltyLmxlbmd0aC0xXSx1PTAsYT1yLmxlbmd0aDt1PGE7dSsrKXt2YXIgYz1yW3VdO2lmKGUuc3VwcG9ydGVkW2NdKXtzPWM7YnJlYWt9fXZhciBsPW8ucmVwbGFjZShpWzFdLHMpO3JldHVyblwic3RyaW5nXCIhPXR5cGVvZiB0JiYodC5leHRlbnNpb249cyx0LnVybD1sKSxsfXJldHVybiBvfSxlLnNpbmVUb25lPWZ1bmN0aW9uKGUsdCl7dm9pZCAwPT09ZSYmKGU9MjAwKSx2b2lkIDA9PT10JiYodD0xKTt2YXIgbj1JLmZyb20oe3NpbmdsZUluc3RhbmNlOiEwfSk7aWYoIShuLm1lZGlhIGluc3RhbmNlb2YgTykpcmV0dXJuIG47Zm9yKHZhciBvPW4ubWVkaWEsaT1uLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLDQ4ZTMqdCw0OGUzKSxyPWkuZ2V0Q2hhbm5lbERhdGEoMCkscz0wO3M8ci5sZW5ndGg7cysrKXt2YXIgdT1lKihzL2kuc2FtcGxlUmF0ZSkqTWF0aC5QSTtyW3NdPTIqTWF0aC5zaW4odSl9cmV0dXJuIG8uYnVmZmVyPWksbi5pc0xvYWRlZD0hMCxufSxlLnJlbmRlcj1mdW5jdGlvbihlLHQpe3ZhciBuPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7dD1PYmplY3QuYXNzaWduKHt3aWR0aDo1MTIsaGVpZ2h0OjEyOCxmaWxsOlwiYmxhY2tcIn0sdHx8e30pLG4ud2lkdGg9dC53aWR0aCxuLmhlaWdodD10LmhlaWdodDt2YXIgbz1QSVhJLkJhc2VUZXh0dXJlLmZyb21DYW52YXMobik7aWYoIShlLm1lZGlhIGluc3RhbmNlb2YgTykpcmV0dXJuIG87dmFyIGk9ZS5tZWRpYTtjb25zb2xlLmFzc2VydCghIWkuYnVmZmVyLFwiTm8gYnVmZmVyIGZvdW5kLCBsb2FkIGZpcnN0XCIpO3ZhciByPW4uZ2V0Q29udGV4dChcIjJkXCIpO3IuZmlsbFN0eWxlPXQuZmlsbDtmb3IodmFyIHM9aS5idWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCksdT1NYXRoLmNlaWwocy5sZW5ndGgvdC53aWR0aCksYT10LmhlaWdodC8yLGM9MDtjPHQud2lkdGg7YysrKXtmb3IodmFyIGw9MSxwPS0xLGg9MDtoPHU7aCsrKXt2YXIgZD1zW2MqdStoXTtkPGwmJihsPWQpLGQ+cCYmKHA9ZCl9ci5maWxsUmVjdChjLCgxK2wpKmEsMSxNYXRoLm1heCgxLChwLWwpKmEpKX1yZXR1cm4gb30sZS5wbGF5T25jZT1mdW5jdGlvbih0LG4pe3ZhciBvPVwiYWxpYXNcIitlLlBMQVlfSUQrKztyZXR1cm4gUy5pbnN0YW5jZS5hZGQobyx7dXJsOnQscHJlbG9hZDohMCxhdXRvUGxheTohMCxsb2FkZWQ6ZnVuY3Rpb24oZSl7ZSYmKGNvbnNvbGUuZXJyb3IoZSksUy5pbnN0YW5jZS5yZW1vdmUobyksbiYmbihlKSl9LGNvbXBsZXRlOmZ1bmN0aW9uKCl7Uy5pbnN0YW5jZS5yZW1vdmUobyksbiYmbihudWxsKX19KSxvfSxlLlBMQVlfSUQ9MCxlLkZPUk1BVF9QQVRURVJOPS9cXC4oXFx7KFteXFx9XSspXFx9KShcXD8uKik/JC8sZS5leHRlbnNpb25zPVtcIm1wM1wiLFwib2dnXCIsXCJvZ2FcIixcIm9wdXNcIixcIm1wZWdcIixcIndhdlwiLFwibTRhXCIsXCJtcDRcIixcImFpZmZcIixcIndtYVwiLFwibWlkXCJdLGUuc3VwcG9ydGVkPWZ1bmN0aW9uKCl7dmFyIHQ9e200YTpcIm1wNFwiLG9nYTpcIm9nZ1wifSxuPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKSxvPXt9O3JldHVybiBlLmV4dGVuc2lvbnMuZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgaT10W2VdfHxlLHI9bi5jYW5QbGF5VHlwZShcImF1ZGlvL1wiK2UpLnJlcGxhY2UoL15ubyQvLFwiXCIpLHM9bi5jYW5QbGF5VHlwZShcImF1ZGlvL1wiK2kpLnJlcGxhY2UoL15ubyQvLFwiXCIpO29bZV09ISFyfHwhIXN9KSxPYmplY3QuZnJlZXplKG8pfSgpLGV9KCksaj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQsbil7dmFyIG89ZS5jYWxsKHRoaXMsdCxuKXx8dGhpcztyZXR1cm4gby51c2UoQS5wbHVnaW4pLG8ucHJlKEEucmVzb2x2ZSksb31yZXR1cm4gdChuLGUpLG4uYWRkUGl4aU1pZGRsZXdhcmU9ZnVuY3Rpb24odCl7ZS5hZGRQaXhpTWlkZGxld2FyZS5jYWxsKHRoaXMsdCl9LG59KFBJWEkubG9hZGVycy5Mb2FkZXIpLEE9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLmluc3RhbGw9ZnVuY3Rpb24odCl7ZS5fc291bmQ9dCxlLmxlZ2FjeT10LnVzZUxlZ2FjeSxQSVhJLmxvYWRlcnMuTG9hZGVyPWosUElYSS5sb2FkZXIudXNlKGUucGx1Z2luKSxQSVhJLmxvYWRlci5wcmUoZS5yZXNvbHZlKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJsZWdhY3lcIix7c2V0OmZ1bmN0aW9uKGUpe3ZhciB0PVBJWEkubG9hZGVycy5SZXNvdXJjZSxuPXcuZXh0ZW5zaW9ucztlP24uZm9yRWFjaChmdW5jdGlvbihlKXt0LnNldEV4dGVuc2lvblhoclR5cGUoZSx0LlhIUl9SRVNQT05TRV9UWVBFLkRFRkFVTFQpLHQuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZSx0LkxPQURfVFlQRS5BVURJTyl9KTpuLmZvckVhY2goZnVuY3Rpb24oZSl7dC5zZXRFeHRlbnNpb25YaHJUeXBlKGUsdC5YSFJfUkVTUE9OU0VfVFlQRS5CVUZGRVIpLHQuc2V0RXh0ZW5zaW9uTG9hZFR5cGUoZSx0LkxPQURfVFlQRS5YSFIpfSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5yZXNvbHZlPWZ1bmN0aW9uKGUsdCl7dy5yZXNvbHZlVXJsKGUpLHQoKX0sZS5wbHVnaW49ZnVuY3Rpb24odCxuKXt0LmRhdGEmJncuZXh0ZW5zaW9ucy5pbmRleE9mKHQuZXh0ZW5zaW9uKT4tMT90LnNvdW5kPWUuX3NvdW5kLmFkZCh0Lm5hbWUse2xvYWRlZDpuLHByZWxvYWQ6ITAsdXJsOnQudXJsLHNvdXJjZTp0LmRhdGF9KTpuKCl9LGV9KCksRj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLnBhcmVudD1lLE9iamVjdC5hc3NpZ24odGhpcyx0KSx0aGlzLmR1cmF0aW9uPXRoaXMuZW5kLXRoaXMuc3RhcnQsY29uc29sZS5hc3NlcnQodGhpcy5kdXJhdGlvbj4wLFwiRW5kIHRpbWUgbXVzdCBiZSBhZnRlciBzdGFydCB0aW1lXCIpfXJldHVybiBlLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnBhcmVudC5wbGF5KE9iamVjdC5hc3NpZ24oe2NvbXBsZXRlOmUsc3BlZWQ6dGhpcy5zcGVlZHx8dGhpcy5wYXJlbnQuc3BlZWQsZW5kOnRoaXMuZW5kLHN0YXJ0OnRoaXMuc3RhcnR9KSl9LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnBhcmVudD1udWxsfSxlfSgpLEU9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3ZhciB0PXRoaXMsbz1uZXcgbi5BdWRpb0NvbnRleHQsaT1vLmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpLHI9by5jcmVhdGVBbmFseXNlcigpO3JldHVybiByLmNvbm5lY3QoaSksaS5jb25uZWN0KG8uZGVzdGluYXRpb24pLHQ9ZS5jYWxsKHRoaXMscixpKXx8dGhpcyx0Ll9jdHg9byx0Ll9vZmZsaW5lQ3R4PW5ldyBuLk9mZmxpbmVBdWRpb0NvbnRleHQoMSwyLG8uc2FtcGxlUmF0ZSksdC5fdW5sb2NrZWQ9ITEsdC5jb21wcmVzc29yPWksdC5hbmFseXNlcj1yLHQuZXZlbnRzPW5ldyBQSVhJLnV0aWxzLkV2ZW50RW1pdHRlcix0LnZvbHVtZT0xLHQuc3BlZWQ9MSx0Lm11dGVkPSExLHQucGF1c2VkPSExLFwib250b3VjaHN0YXJ0XCJpbiB3aW5kb3cmJlwicnVubmluZ1wiIT09by5zdGF0ZSYmKHQuX3VubG9jaygpLHQuX3VubG9jaz10Ll91bmxvY2suYmluZCh0KSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsdC5fdW5sb2NrLCEwKSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLHQuX3VubG9jaywhMCksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsdC5fdW5sb2NrLCEwKSksdH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLl91bmxvY2s9ZnVuY3Rpb24oKXt0aGlzLl91bmxvY2tlZHx8KHRoaXMucGxheUVtcHR5U291bmQoKSxcInJ1bm5pbmdcIj09PXRoaXMuX2N0eC5zdGF0ZSYmKGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIix0aGlzLl91bmxvY2ssITApLGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLHRoaXMuX3VubG9jaywhMCksZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIix0aGlzLl91bmxvY2ssITApLHRoaXMuX3VubG9ja2VkPSEwKSl9LG4ucHJvdG90eXBlLnBsYXlFbXB0eVNvdW5kPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO2UuYnVmZmVyPXRoaXMuX2N0eC5jcmVhdGVCdWZmZXIoMSwxLDIyMDUwKSxlLmNvbm5lY3QodGhpcy5fY3R4LmRlc3RpbmF0aW9uKSxlLnN0YXJ0KDAsMCwwKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJBdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7dmFyIGU9d2luZG93O3JldHVybiBlLkF1ZGlvQ29udGV4dHx8ZS53ZWJraXRBdWRpb0NvbnRleHR8fG51bGx9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJPZmZsaW5lQXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3ZhciBlPXdpbmRvdztyZXR1cm4gZS5PZmZsaW5lQXVkaW9Db250ZXh0fHxlLndlYmtpdE9mZmxpbmVBdWRpb0NvbnRleHR8fG51bGx9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2UucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKTt2YXIgdD10aGlzLl9jdHg7dm9pZCAwIT09dC5jbG9zZSYmdC5jbG9zZSgpLHRoaXMuZXZlbnRzLnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMuYW5hbHlzZXIuZGlzY29ubmVjdCgpLHRoaXMuY29tcHJlc3Nvci5kaXNjb25uZWN0KCksdGhpcy5hbmFseXNlcj1udWxsLHRoaXMuY29tcHJlc3Nvcj1udWxsLHRoaXMuZXZlbnRzPW51bGwsdGhpcy5fb2ZmbGluZUN0eD1udWxsLHRoaXMuX2N0eD1udWxsfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJhdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2N0eH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJvZmZsaW5lQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fb2ZmbGluZUN0eH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe2UmJlwicnVubmluZ1wiPT09dGhpcy5fY3R4LnN0YXRlP3RoaXMuX2N0eC5zdXNwZW5kKCk6ZXx8XCJzdXNwZW5kZWRcIiE9PXRoaXMuX2N0eC5zdGF0ZXx8dGhpcy5fY3R4LnJlc3VtZSgpLHRoaXMuX3BhdXNlZD1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt0aGlzLmV2ZW50cy5lbWl0KFwicmVmcmVzaFwiKX0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3RoaXMuZXZlbnRzLmVtaXQoXCJyZWZyZXNoUGF1c2VkXCIpfSxuLnByb3RvdHlwZS50b2dnbGVNdXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubXV0ZWQ9IXRoaXMubXV0ZWQsdGhpcy5yZWZyZXNoKCksdGhpcy5tdXRlZH0sbi5wcm90b3R5cGUudG9nZ2xlUGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXVzZWQ9IXRoaXMucGF1c2VkLHRoaXMucmVmcmVzaFBhdXNlZCgpLHRoaXMuX3BhdXNlZH0sbi5wcm90b3R5cGUuZGVjb2RlPWZ1bmN0aW9uKGUsdCl7dGhpcy5fb2ZmbGluZUN0eC5kZWNvZGVBdWRpb0RhdGEoZSxmdW5jdGlvbihlKXt0KG51bGwsZSl9LGZ1bmN0aW9uKCl7dChuZXcgRXJyb3IoXCJVbmFibGUgdG8gZGVjb2RlIGZpbGVcIikpfSl9LG59KG4pLEw9T2JqZWN0LmZyZWV6ZSh7V2ViQXVkaW9NZWRpYTpPLFdlYkF1ZGlvSW5zdGFuY2U6UCxXZWJBdWRpb05vZGVzOngsV2ViQXVkaW9Db250ZXh0OkUsV2ViQXVkaW9VdGlsczpsfSksUz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt0aGlzLmluaXQoKX1yZXR1cm4gZS5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnN1cHBvcnRlZCYmKHRoaXMuX3dlYkF1ZGlvQ29udGV4dD1uZXcgRSksdGhpcy5faHRtbEF1ZGlvQ29udGV4dD1uZXcgYix0aGlzLl9zb3VuZHM9e30sdGhpcy51c2VMZWdhY3k9IXRoaXMuc3VwcG9ydGVkLHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5pbml0PWZ1bmN0aW9uKCl7aWYoZS5pbnN0YW5jZSl0aHJvdyBuZXcgRXJyb3IoXCJTb3VuZExpYnJhcnkgaXMgYWxyZWFkeSBjcmVhdGVkXCIpO3ZhciB0PWUuaW5zdGFuY2U9bmV3IGU7XCJ1bmRlZmluZWRcIj09dHlwZW9mIFByb21pc2UmJih3aW5kb3cuUHJvbWlzZT1hKSx2b2lkIDAhPT1QSVhJLmxvYWRlcnMmJkEuaW5zdGFsbCh0KSx2b2lkIDA9PT13aW5kb3cuX19waXhpU291bmQmJmRlbGV0ZSB3aW5kb3cuX19waXhpU291bmQ7dmFyIG89UElYSTtyZXR1cm4gby5zb3VuZHx8KE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwic291bmRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnRpZXModCx7ZmlsdGVyczp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG19fSxodG1sYXVkaW86e2dldDpmdW5jdGlvbigpe3JldHVybiBnfX0sd2ViYXVkaW86e2dldDpmdW5jdGlvbigpe3JldHVybiBMfX0sdXRpbHM6e2dldDpmdW5jdGlvbigpe3JldHVybiB3fX0sU291bmQ6e2dldDpmdW5jdGlvbigpe3JldHVybiBJfX0sU291bmRTcHJpdGU6e2dldDpmdW5jdGlvbigpe3JldHVybiBGfX0sRmlsdGVyYWJsZTp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG59fSxTb3VuZExpYnJhcnk6e2dldDpmdW5jdGlvbigpe3JldHVybiBlfX19KSksdH0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc0FsbFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy51c2VMZWdhY3k/W106dGhpcy5fY29udGV4dC5maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy51c2VMZWdhY3l8fCh0aGlzLl9jb250ZXh0LmZpbHRlcnM9ZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3VwcG9ydGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBudWxsIT09RS5BdWRpb0NvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuYWRkPWZ1bmN0aW9uKGUsdCl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGUpe3ZhciBuPXt9O2Zvcih2YXIgbyBpbiBlKXtpPXRoaXMuX2dldE9wdGlvbnMoZVtvXSx0KTtuW29dPXRoaXMuYWRkKG8saSl9cmV0dXJuIG59aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUpe2lmKGNvbnNvbGUuYXNzZXJ0KCF0aGlzLl9zb3VuZHNbZV0sXCJTb3VuZCB3aXRoIGFsaWFzIFwiK2UrXCIgYWxyZWFkeSBleGlzdHMuXCIpLHQgaW5zdGFuY2VvZiBJKXJldHVybiB0aGlzLl9zb3VuZHNbZV09dCx0O3ZhciBpPXRoaXMuX2dldE9wdGlvbnModCkscj1JLmZyb20oaSk7cmV0dXJuIHRoaXMuX3NvdW5kc1tlXT1yLHJ9fSxlLnByb3RvdHlwZS5fZ2V0T3B0aW9ucz1mdW5jdGlvbihlLHQpe3ZhciBuO3JldHVybiBuPVwic3RyaW5nXCI9PXR5cGVvZiBlP3t1cmw6ZX06ZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfHxlIGluc3RhbmNlb2YgSFRNTEF1ZGlvRWxlbWVudD97c291cmNlOmV9OmUsT2JqZWN0LmFzc2lnbihuLHR8fHt9KX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwidXNlTGVnYWN5XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl91c2VMZWdhY3l9LHNldDpmdW5jdGlvbihlKXtBLmxlZ2FjeT1lLHRoaXMuX3VzZUxlZ2FjeT1lLCFlJiZ0aGlzLnN1cHBvcnRlZD90aGlzLl9jb250ZXh0PXRoaXMuX3dlYkF1ZGlvQ29udGV4dDp0aGlzLl9jb250ZXh0PXRoaXMuX2h0bWxBdWRpb0NvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmV4aXN0cyhlLCEwKSx0aGlzLl9zb3VuZHNbZV0uZGVzdHJveSgpLGRlbGV0ZSB0aGlzLl9zb3VuZHNbZV0sdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwidm9sdW1lQWxsXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2NvbnRleHQudm9sdW1lPWUsdGhpcy5fY29udGV4dC5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3BlZWRBbGxcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQuc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9jb250ZXh0LnNwZWVkPWUsdGhpcy5fY29udGV4dC5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUudG9nZ2xlUGF1c2VBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC50b2dnbGVQYXVzZSgpfSxlLnByb3RvdHlwZS5wYXVzZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnBhdXNlZD0hMCx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS5yZXN1bWVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5wYXVzZWQ9ITEsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUudG9nZ2xlTXV0ZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnRvZ2dsZU11dGUoKX0sZS5wcm90b3R5cGUubXV0ZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0Lm11dGVkPSEwLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnVubXV0ZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0Lm11dGVkPSExLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnJlbW92ZUFsbD1mdW5jdGlvbigpe2Zvcih2YXIgZSBpbiB0aGlzLl9zb3VuZHMpdGhpcy5fc291bmRzW2VdLmRlc3Ryb3koKSxkZWxldGUgdGhpcy5fc291bmRzW2VdO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5zdG9wQWxsPWZ1bmN0aW9uKCl7Zm9yKHZhciBlIGluIHRoaXMuX3NvdW5kcyl0aGlzLl9zb3VuZHNbZV0uc3RvcCgpO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5leGlzdHM9ZnVuY3Rpb24oZSx0KXt2b2lkIDA9PT10JiYodD0hMSk7dmFyIG49ISF0aGlzLl9zb3VuZHNbZV07cmV0dXJuIHQmJmNvbnNvbGUuYXNzZXJ0KG4sXCJObyBzb3VuZCBtYXRjaGluZyBhbGlhcyAnXCIrZStcIicuXCIpLG59LGUucHJvdG90eXBlLmZpbmQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZXhpc3RzKGUsITApLHRoaXMuX3NvdW5kc1tlXX0sZS5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmZpbmQoZSkucGxheSh0KX0sZS5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLnN0b3AoKX0sZS5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5wYXVzZSgpfSxlLnByb3RvdHlwZS5yZXN1bWU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5yZXN1bWUoKX0sZS5wcm90b3R5cGUudm9sdW1lPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcy5maW5kKGUpO3JldHVybiB2b2lkIDAhPT10JiYobi52b2x1bWU9dCksbi52b2x1bWV9LGUucHJvdG90eXBlLnNwZWVkPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcy5maW5kKGUpO3JldHVybiB2b2lkIDAhPT10JiYobi5zcGVlZD10KSxuLnNwZWVkfSxlLnByb3RvdHlwZS5kdXJhdGlvbj1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLmR1cmF0aW9ufSxlLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnJlbW92ZUFsbCgpLHRoaXMuX3NvdW5kcz1udWxsLHRoaXMuX3dlYkF1ZGlvQ29udGV4dCYmKHRoaXMuX3dlYkF1ZGlvQ29udGV4dC5kZXN0cm95KCksdGhpcy5fd2ViQXVkaW9Db250ZXh0PW51bGwpLHRoaXMuX2h0bWxBdWRpb0NvbnRleHQmJih0aGlzLl9odG1sQXVkaW9Db250ZXh0LmRlc3Ryb3koKSx0aGlzLl9odG1sQXVkaW9Db250ZXh0PW51bGwpLHRoaXMuX2NvbnRleHQ9bnVsbCx0aGlzfSxlfSgpLEk9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5tZWRpYT1lLHRoaXMub3B0aW9ucz10LHRoaXMuX2luc3RhbmNlcz1bXSx0aGlzLl9zcHJpdGVzPXt9LHRoaXMubWVkaWEuaW5pdCh0aGlzKTt2YXIgbj10LmNvbXBsZXRlO3RoaXMuX2F1dG9QbGF5T3B0aW9ucz1uP3tjb21wbGV0ZTpufTpudWxsLHRoaXMuaXNMb2FkZWQ9ITEsdGhpcy5pc1BsYXlpbmc9ITEsdGhpcy5hdXRvUGxheT10LmF1dG9QbGF5LHRoaXMuc2luZ2xlSW5zdGFuY2U9dC5zaW5nbGVJbnN0YW5jZSx0aGlzLnByZWxvYWQ9dC5wcmVsb2FkfHx0aGlzLmF1dG9QbGF5LHRoaXMudXJsPXQudXJsLHRoaXMuc3BlZWQ9dC5zcGVlZCx0aGlzLnZvbHVtZT10LnZvbHVtZSx0aGlzLmxvb3A9dC5sb29wLHQuc3ByaXRlcyYmdGhpcy5hZGRTcHJpdGVzKHQuc3ByaXRlcyksdGhpcy5wcmVsb2FkJiZ0aGlzLl9wcmVsb2FkKHQubG9hZGVkKX1yZXR1cm4gZS5mcm9tPWZ1bmN0aW9uKHQpe3ZhciBuPXt9O3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiB0P24udXJsPXQ6dCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfHx0IGluc3RhbmNlb2YgSFRNTEF1ZGlvRWxlbWVudD9uLnNvdXJjZT10Om49dCwobj1PYmplY3QuYXNzaWduKHthdXRvUGxheTohMSxzaW5nbGVJbnN0YW5jZTohMSx1cmw6bnVsbCxzb3VyY2U6bnVsbCxwcmVsb2FkOiExLHZvbHVtZToxLHNwZWVkOjEsY29tcGxldGU6bnVsbCxsb2FkZWQ6bnVsbCxsb29wOiExfSxuKSkudXJsJiYobi51cmw9dy5yZXNvbHZlVXJsKG4udXJsKSksT2JqZWN0LmZyZWV6ZShuKSxuZXcgZShTLmluc3RhbmNlLnVzZUxlZ2FjeT9uZXcgczpuZXcgTyxuKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gUy5pbnN0YW5jZS5jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNQbGF5aW5nPSExLHRoaXMucGF1c2VkPSEwLHRoaXN9LGUucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmlzUGxheWluZz10aGlzLl9pbnN0YW5jZXMubGVuZ3RoPjAsdGhpcy5wYXVzZWQ9ITEsdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYXVzZWQ9ZSx0aGlzLnJlZnJlc2hQYXVzZWQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzcGVlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zcGVlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWVkaWEuZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMubWVkaWEuZmlsdGVycz1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmFkZFNwcml0ZXM9ZnVuY3Rpb24oZSx0KXtpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7dmFyIG49e307Zm9yKHZhciBvIGluIGUpbltvXT10aGlzLmFkZFNwcml0ZXMobyxlW29dKTtyZXR1cm4gbn1pZihcInN0cmluZ1wiPT10eXBlb2YgZSl7Y29uc29sZS5hc3NlcnQoIXRoaXMuX3Nwcml0ZXNbZV0sXCJBbGlhcyBcIitlK1wiIGlzIGFscmVhZHkgdGFrZW5cIik7dmFyIGk9bmV3IEYodGhpcyx0KTtyZXR1cm4gdGhpcy5fc3ByaXRlc1tlXT1pLGl9fSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fcmVtb3ZlSW5zdGFuY2VzKCksdGhpcy5yZW1vdmVTcHJpdGVzKCksdGhpcy5tZWRpYS5kZXN0cm95KCksdGhpcy5tZWRpYT1udWxsLHRoaXMuX3Nwcml0ZXM9bnVsbCx0aGlzLl9pbnN0YW5jZXM9bnVsbH0sZS5wcm90b3R5cGUucmVtb3ZlU3ByaXRlcz1mdW5jdGlvbihlKXtpZihlKXt2YXIgdD10aGlzLl9zcHJpdGVzW2VdO3ZvaWQgMCE9PXQmJih0LmRlc3Ryb3koKSxkZWxldGUgdGhpcy5fc3ByaXRlc1tlXSl9ZWxzZSBmb3IodmFyIG4gaW4gdGhpcy5fc3ByaXRlcyl0aGlzLnJlbW92ZVNwcml0ZXMobik7cmV0dXJuIHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImlzUGxheWFibGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNMb2FkZWQmJnRoaXMubWVkaWEmJnRoaXMubWVkaWEuaXNQbGF5YWJsZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7aWYoIXRoaXMuaXNQbGF5YWJsZSlyZXR1cm4gdGhpcy5hdXRvUGxheT0hMSx0aGlzLl9hdXRvUGxheU9wdGlvbnM9bnVsbCx0aGlzO3RoaXMuaXNQbGF5aW5nPSExO2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLTE7ZT49MDtlLS0pdGhpcy5faW5zdGFuY2VzW2VdLnN0b3AoKTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlLHQpe3ZhciBuLG89dGhpcztpZihcInN0cmluZ1wiPT10eXBlb2YgZT9uPXtzcHJpdGU6cj1lLGNvbXBsZXRlOnR9OlwiZnVuY3Rpb25cIj09dHlwZW9mIGU/KG49e30pLmNvbXBsZXRlPWU6bj1lLChuPU9iamVjdC5hc3NpZ24oe2NvbXBsZXRlOm51bGwsbG9hZGVkOm51bGwsc3ByaXRlOm51bGwsZW5kOm51bGwsc3RhcnQ6MCx2b2x1bWU6MSxzcGVlZDoxLG11dGVkOiExLGxvb3A6ITF9LG58fHt9KSkuc3ByaXRlKXt2YXIgaT1uLnNwcml0ZTtjb25zb2xlLmFzc2VydCghIXRoaXMuX3Nwcml0ZXNbaV0sXCJBbGlhcyBcIitpK1wiIGlzIG5vdCBhdmFpbGFibGVcIik7dmFyIHI9dGhpcy5fc3ByaXRlc1tpXTtuLnN0YXJ0PXIuc3RhcnQsbi5lbmQ9ci5lbmQsbi5zcGVlZD1yLnNwZWVkfHwxLGRlbGV0ZSBuLnNwcml0ZX1pZihuLm9mZnNldCYmKG4uc3RhcnQ9bi5vZmZzZXQpLCF0aGlzLmlzTG9hZGVkKXJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihlLHQpe28uYXV0b1BsYXk9ITAsby5fYXV0b1BsYXlPcHRpb25zPW4sby5fcHJlbG9hZChmdW5jdGlvbihvLGkscil7bz90KG8pOihuLmxvYWRlZCYmbi5sb2FkZWQobyxpLHIpLGUocikpfSl9KTt0aGlzLnNpbmdsZUluc3RhbmNlJiZ0aGlzLl9yZW1vdmVJbnN0YW5jZXMoKTt2YXIgcz10aGlzLl9jcmVhdGVJbnN0YW5jZSgpO3JldHVybiB0aGlzLl9pbnN0YW5jZXMucHVzaChzKSx0aGlzLmlzUGxheWluZz0hMCxzLm9uY2UoXCJlbmRcIixmdW5jdGlvbigpe24uY29tcGxldGUmJm4uY29tcGxldGUobyksby5fb25Db21wbGV0ZShzKX0pLHMub25jZShcInN0b3BcIixmdW5jdGlvbigpe28uX29uQ29tcGxldGUocyl9KSxzLnBsYXkobiksc30sZS5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLHQ9MDt0PGU7dCsrKXRoaXMuX2luc3RhbmNlc1t0XS5yZWZyZXNoKCl9LGUucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aCx0PTA7dDxlO3QrKyl0aGlzLl9pbnN0YW5jZXNbdF0ucmVmcmVzaFBhdXNlZCgpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJ2b2x1bWVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3ZvbHVtZT1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcIm11dGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tdXRlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX211dGVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwibG9vcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbG9vcH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2xvb3A9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5fcHJlbG9hZD1mdW5jdGlvbihlKXt0aGlzLm1lZGlhLmxvYWQoZSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImluc3RhbmNlc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW5zdGFuY2VzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInNwcml0ZXNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Nwcml0ZXN9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZHVyYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWVkaWEuZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuYXV0b1BsYXlTdGFydD1mdW5jdGlvbigpe3ZhciBlO3JldHVybiB0aGlzLmF1dG9QbGF5JiYoZT10aGlzLnBsYXkodGhpcy5fYXV0b1BsYXlPcHRpb25zKSksZX0sZS5wcm90b3R5cGUuX3JlbW92ZUluc3RhbmNlcz1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLTE7ZT49MDtlLS0pdGhpcy5fcG9vbEluc3RhbmNlKHRoaXMuX2luc3RhbmNlc1tlXSk7dGhpcy5faW5zdGFuY2VzLmxlbmd0aD0wfSxlLnByb3RvdHlwZS5fb25Db21wbGV0ZT1mdW5jdGlvbihlKXtpZih0aGlzLl9pbnN0YW5jZXMpe3ZhciB0PXRoaXMuX2luc3RhbmNlcy5pbmRleE9mKGUpO3Q+LTEmJnRoaXMuX2luc3RhbmNlcy5zcGxpY2UodCwxKSx0aGlzLmlzUGxheWluZz10aGlzLl9pbnN0YW5jZXMubGVuZ3RoPjB9dGhpcy5fcG9vbEluc3RhbmNlKGUpfSxlLnByb3RvdHlwZS5fY3JlYXRlSW5zdGFuY2U9ZnVuY3Rpb24oKXtpZihlLl9wb29sLmxlbmd0aD4wKXt2YXIgdD1lLl9wb29sLnBvcCgpO3JldHVybiB0LmluaXQodGhpcy5tZWRpYSksdH1yZXR1cm4gdGhpcy5tZWRpYS5jcmVhdGUoKX0sZS5wcm90b3R5cGUuX3Bvb2xJbnN0YW5jZT1mdW5jdGlvbih0KXt0LmRlc3Ryb3koKSxlLl9wb29sLmluZGV4T2YodCk8MCYmZS5fcG9vbC5wdXNoKHQpfSxlLl9wb29sPVtdLGV9KCksQz1TLmluaXQoKTtlLnNvdW5kPUMsZS5maWx0ZXJzPW0sZS5odG1sYXVkaW89ZyxlLndlYmF1ZGlvPUwsZS5GaWx0ZXJhYmxlPW4sZS5Tb3VuZD1JLGUuU291bmRMaWJyYXJ5PVMsZS5Tb3VuZFNwcml0ZT1GLGUudXRpbHM9dyxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS1zb3VuZC5qcy5tYXBcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIhZnVuY3Rpb24odCl7ZnVuY3Rpb24gZShpKXtpZihuW2ldKXJldHVybiBuW2ldLmV4cG9ydHM7dmFyIHI9bltpXT17ZXhwb3J0czp7fSxpZDppLGxvYWRlZDohMX07cmV0dXJuIHRbaV0uY2FsbChyLmV4cG9ydHMscixyLmV4cG9ydHMsZSksci5sb2FkZWQ9ITAsci5leHBvcnRzfXZhciBuPXt9O3JldHVybiBlLm09dCxlLmM9bixlLnA9XCJcIixlKDApfShbZnVuY3Rpb24odCxlLG4pe3QuZXhwb3J0cz1uKDYpfSxmdW5jdGlvbih0LGUpe3QuZXhwb3J0cz1QSVhJfSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBuPXtsaW5lYXI6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHR9fSxpblF1YWQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqdH19LG91dFF1YWQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqKDItdCl9fSxpbk91dFF1YWQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdDotLjUqKC0tdCoodC0yKS0xKX19LGluQ3ViaWM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqdCp0fX0sb3V0Q3ViaWM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuLS10KnQqdCsxfX0saW5PdXRDdWJpYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LjUqdCp0KnQ6KHQtPTIsLjUqKHQqdCp0KzIpKX19LGluUXVhcnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqdCp0KnR9fSxvdXRRdWFydDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS0gLS10KnQqdCp0fX0saW5PdXRRdWFydDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LjUqdCp0KnQqdDoodC09MiwtLjUqKHQqdCp0KnQtMikpfX0saW5RdWludDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0KnQqdCp0fX0sb3V0UXVpbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuLS10KnQqdCp0KnQrMX19LGluT3V0UXVpbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdCp0KnQqdDoodC09MiwuNSoodCp0KnQqdCp0KzIpKX19LGluU2luZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS1NYXRoLmNvcyh0Kk1hdGguUEkvMil9fSxvdXRTaW5lOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNpbih0Kk1hdGguUEkvMil9fSxpbk91dFNpbmU6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuLjUqKDEtTWF0aC5jb3MoTWF0aC5QSSp0KSl9fSxpbkV4cG86ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDA9PT10PzA6TWF0aC5wb3coMTAyNCx0LTEpfX0sb3V0RXhwbzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMT09PXQ/MToxLU1hdGgucG93KDIsLTEwKnQpfX0saW5PdXRFeHBvOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAwPT09dD8wOjE9PT10PzE6KHQqPTIsMT50Py41Kk1hdGgucG93KDEwMjQsdC0xKTouNSooLU1hdGgucG93KDIsLTEwKih0LTEpKSsyKSl9fSxpbkNpcmM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtTWF0aC5zcXJ0KDEtdCp0KX19LG91dENpcmM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIE1hdGguc3FydCgxLSAtLXQqdCl9fSxpbk91dENpcmM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py0uNSooTWF0aC5zcXJ0KDEtdCp0KS0xKTouNSooTWF0aC5zcXJ0KDEtKHQtMikqKHQtMikpKzEpfX0saW5FbGFzdGljOmZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdPy4xOmFyZ3VtZW50c1swXSxlPWFyZ3VtZW50cy5sZW5ndGg8PTF8fHZvaWQgMD09PWFyZ3VtZW50c1sxXT8uNDphcmd1bWVudHNbMV07cmV0dXJuIGZ1bmN0aW9uKG4pe3ZhciBpPXZvaWQgMDtyZXR1cm4gMD09PW4/MDoxPT09bj8xOighdHx8MT50Pyh0PTEsaT1lLzQpOmk9ZSpNYXRoLmFzaW4oMS90KS8oMipNYXRoLlBJKSwtKHQqTWF0aC5wb3coMiwxMCoobi0xKSkqTWF0aC5zaW4oKG4tMS1pKSooMipNYXRoLlBJKS9lKSkpfX0sb3V0RWxhc3RpYzpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg8PTB8fHZvaWQgMD09PWFyZ3VtZW50c1swXT8uMTphcmd1bWVudHNbMF0sZT1hcmd1bWVudHMubGVuZ3RoPD0xfHx2b2lkIDA9PT1hcmd1bWVudHNbMV0/LjQ6YXJndW1lbnRzWzFdO3JldHVybiBmdW5jdGlvbihuKXt2YXIgaT12b2lkIDA7cmV0dXJuIDA9PT1uPzA6MT09PW4/MTooIXR8fDE+dD8odD0xLGk9ZS80KTppPWUqTWF0aC5hc2luKDEvdCkvKDIqTWF0aC5QSSksdCpNYXRoLnBvdygyLC0xMCpuKSpNYXRoLnNpbigobi1pKSooMipNYXRoLlBJKS9lKSsxKX19LGluT3V0RWxhc3RpYzpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg8PTB8fHZvaWQgMD09PWFyZ3VtZW50c1swXT8uMTphcmd1bWVudHNbMF0sZT1hcmd1bWVudHMubGVuZ3RoPD0xfHx2b2lkIDA9PT1hcmd1bWVudHNbMV0/LjQ6YXJndW1lbnRzWzFdO3JldHVybiBmdW5jdGlvbihuKXt2YXIgaT12b2lkIDA7cmV0dXJuIDA9PT1uPzA6MT09PW4/MTooIXR8fDE+dD8odD0xLGk9ZS80KTppPWUqTWF0aC5hc2luKDEvdCkvKDIqTWF0aC5QSSksbio9MiwxPm4/LS41Kih0Kk1hdGgucG93KDIsMTAqKG4tMSkpKk1hdGguc2luKChuLTEtaSkqKDIqTWF0aC5QSSkvZSkpOnQqTWF0aC5wb3coMiwtMTAqKG4tMSkpKk1hdGguc2luKChuLTEtaSkqKDIqTWF0aC5QSSkvZSkqLjUrMSl9fSxpbkJhY2s6ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciBuPXR8fDEuNzAxNTg7cmV0dXJuIGUqZSooKG4rMSkqZS1uKX19LG91dEJhY2s6ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciBuPXR8fDEuNzAxNTg7cmV0dXJuLS1lKmUqKChuKzEpKmUrbikrMX19LGluT3V0QmFjazpmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIG49MS41MjUqKHR8fDEuNzAxNTgpO3JldHVybiBlKj0yLDE+ZT8uNSooZSplKigobisxKSplLW4pKTouNSooKGUtMikqKGUtMikqKChuKzEpKihlLTIpK24pKzIpfX0saW5Cb3VuY2U6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtbi5vdXRCb3VuY2UoKSgxLXQpfX0sb3V0Qm91bmNlOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLzIuNzU+dD83LjU2MjUqdCp0OjIvMi43NT50Pyh0LT0xLjUvMi43NSw3LjU2MjUqdCp0Ky43NSk6Mi41LzIuNzU+dD8odC09Mi4yNS8yLjc1LDcuNTYyNSp0KnQrLjkzNzUpOih0LT0yLjYyNS8yLjc1LDcuNTYyNSp0KnQrLjk4NDM3NSl9fSxpbk91dEJvdW5jZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4uNT50Py41Km4uaW5Cb3VuY2UoKSgyKnQpOi41Km4ub3V0Qm91bmNlKCkoMip0LTEpKy41fX0sY3VzdG9tQXJyYXk6ZnVuY3Rpb24odCl7cmV0dXJuIHQ/ZnVuY3Rpb24odCl7cmV0dXJuIHR9Om4ubGluZWFyKCl9fTtlW1wiZGVmYXVsdFwiXT1ufSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIHIodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBlPXt9O2lmKG51bGwhPXQpZm9yKHZhciBuIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbikmJihlW25dPXRbbl0pO3JldHVybiBlW1wiZGVmYXVsdFwiXT10LGV9ZnVuY3Rpb24gcyh0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9ZnVuY3Rpb24gbyh0LGUpe2lmKCF0KXRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtyZXR1cm4hZXx8XCJvYmplY3RcIiE9dHlwZW9mIGUmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGU/dDplfWZ1bmN0aW9uIGEodCxlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiZudWxsIT09ZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIit0eXBlb2YgZSk7dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOnQsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksZSYmKE9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3Quc2V0UHJvdG90eXBlT2YodCxlKTp0Ll9fcHJvdG9fXz1lKX1mdW5jdGlvbiB1KHQsZSxuLGkscixzKXtmb3IodmFyIG8gaW4gdClpZihjKHRbb10pKXUodFtvXSxlW29dLG5bb10saSxyLHMpO2Vsc2V7dmFyIGE9ZVtvXSxoPXRbb10tZVtvXSxsPWksZj1yL2w7bltvXT1hK2gqcyhmKX19ZnVuY3Rpb24gaCh0LGUsbil7Zm9yKHZhciBpIGluIHQpMD09PWVbaV18fGVbaV18fChjKG5baV0pPyhlW2ldPUpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobltpXSkpLGgodFtpXSxlW2ldLG5baV0pKTplW2ldPW5baV0pfWZ1bmN0aW9uIGModCl7cmV0dXJuXCJbb2JqZWN0IE9iamVjdF1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KX12YXIgbD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBmPW4oMSkscD1yKGYpLGQ9bigyKSxnPWkoZCksdj1mdW5jdGlvbih0KXtmdW5jdGlvbiBlKHQsbil7cyh0aGlzLGUpO3ZhciBpPW8odGhpcyxPYmplY3QuZ2V0UHJvdG90eXBlT2YoZSkuY2FsbCh0aGlzKSk7cmV0dXJuIGkudGFyZ2V0PXQsbiYmaS5hZGRUbyhuKSxpLmNsZWFyKCksaX1yZXR1cm4gYShlLHQpLGwoZSxbe2tleTpcImFkZFRvXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMubWFuYWdlcj10LHRoaXMubWFuYWdlci5hZGRUd2Vlbih0aGlzKSx0aGlzfX0se2tleTpcImNoYWluXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHR8fCh0PW5ldyBlKHRoaXMudGFyZ2V0KSksdGhpcy5fY2hhaW5Ud2Vlbj10LHR9fSx7a2V5Olwic3RhcnRcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmFjdGl2ZT0hMCx0aGlzfX0se2tleTpcInN0b3BcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmFjdGl2ZT0hMSx0aGlzLmVtaXQoXCJzdG9wXCIpLHRoaXN9fSx7a2V5OlwidG9cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fdG89dCx0aGlzfX0se2tleTpcImZyb21cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fZnJvbT10LHRoaXN9fSx7a2V5OlwicmVtb3ZlXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tYW5hZ2VyPyh0aGlzLm1hbmFnZXIucmVtb3ZlVHdlZW4odGhpcyksdGhpcyk6dGhpc319LHtrZXk6XCJjbGVhclwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy50aW1lPTAsdGhpcy5hY3RpdmU9ITEsdGhpcy5lYXNpbmc9Z1tcImRlZmF1bHRcIl0ubGluZWFyKCksdGhpcy5leHBpcmU9ITEsdGhpcy5yZXBlYXQ9MCx0aGlzLmxvb3A9ITEsdGhpcy5kZWxheT0wLHRoaXMucGluZ1Bvbmc9ITEsdGhpcy5pc1N0YXJ0ZWQ9ITEsdGhpcy5pc0VuZGVkPSExLHRoaXMuX3RvPW51bGwsdGhpcy5fZnJvbT1udWxsLHRoaXMuX2RlbGF5VGltZT0wLHRoaXMuX2VsYXBzZWRUaW1lPTAsdGhpcy5fcmVwZWF0PTAsdGhpcy5fcGluZ1Bvbmc9ITEsdGhpcy5fY2hhaW5Ud2Vlbj1udWxsLHRoaXMucGF0aD1udWxsLHRoaXMucGF0aFJldmVyc2U9ITEsdGhpcy5wYXRoRnJvbT0wLHRoaXMucGF0aFRvPTB9fSx7a2V5OlwicmVzZXRcIix2YWx1ZTpmdW5jdGlvbigpe2lmKHRoaXMuX2VsYXBzZWRUaW1lPTAsdGhpcy5fcmVwZWF0PTAsdGhpcy5fZGVsYXlUaW1lPTAsdGhpcy5pc1N0YXJ0ZWQ9ITEsdGhpcy5pc0VuZGVkPSExLHRoaXMucGluZ1BvbmcmJnRoaXMuX3BpbmdQb25nKXt2YXIgdD10aGlzLl90byxlPXRoaXMuX2Zyb207dGhpcy5fdG89ZSx0aGlzLl9mcm9tPXQsdGhpcy5fcGluZ1Bvbmc9ITF9cmV0dXJuIHRoaXN9fSx7a2V5OlwidXBkYXRlXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtpZih0aGlzLl9jYW5VcGRhdGUoKXx8IXRoaXMuX3RvJiYhdGhpcy5wYXRoKXt2YXIgbj12b2lkIDAsaT12b2lkIDA7aWYodGhpcy5kZWxheT50aGlzLl9kZWxheVRpbWUpcmV0dXJuIHZvaWQodGhpcy5fZGVsYXlUaW1lKz1lKTt0aGlzLmlzU3RhcnRlZHx8KHRoaXMuX3BhcnNlRGF0YSgpLHRoaXMuaXNTdGFydGVkPSEwLHRoaXMuZW1pdChcInN0YXJ0XCIpKTt2YXIgcj10aGlzLnBpbmdQb25nP3RoaXMudGltZS8yOnRoaXMudGltZTtpZihyPnRoaXMuX2VsYXBzZWRUaW1lKXt2YXIgcz10aGlzLl9lbGFwc2VkVGltZStlLG89cz49cjt0aGlzLl9lbGFwc2VkVGltZT1vP3I6cyx0aGlzLl9hcHBseShyKTt2YXIgYT10aGlzLl9waW5nUG9uZz9yK3RoaXMuX2VsYXBzZWRUaW1lOnRoaXMuX2VsYXBzZWRUaW1lO2lmKHRoaXMuZW1pdChcInVwZGF0ZVwiLGEpLG8pe2lmKHRoaXMucGluZ1BvbmcmJiF0aGlzLl9waW5nUG9uZylyZXR1cm4gdGhpcy5fcGluZ1Bvbmc9ITAsbj10aGlzLl90byxpPXRoaXMuX2Zyb20sdGhpcy5fZnJvbT1uLHRoaXMuX3RvPWksdGhpcy5wYXRoJiYobj10aGlzLnBhdGhUbyxpPXRoaXMucGF0aEZyb20sdGhpcy5wYXRoVG89aSx0aGlzLnBhdGhGcm9tPW4pLHRoaXMuZW1pdChcInBpbmdwb25nXCIpLHZvaWQodGhpcy5fZWxhcHNlZFRpbWU9MCk7aWYodGhpcy5sb29wfHx0aGlzLnJlcGVhdD50aGlzLl9yZXBlYXQpcmV0dXJuIHRoaXMuX3JlcGVhdCsrLHRoaXMuZW1pdChcInJlcGVhdFwiLHRoaXMuX3JlcGVhdCksdGhpcy5fZWxhcHNlZFRpbWU9MCx2b2lkKHRoaXMucGluZ1BvbmcmJnRoaXMuX3BpbmdQb25nJiYobj10aGlzLl90byxpPXRoaXMuX2Zyb20sdGhpcy5fdG89aSx0aGlzLl9mcm9tPW4sdGhpcy5wYXRoJiYobj10aGlzLnBhdGhUbyxpPXRoaXMucGF0aEZyb20sdGhpcy5wYXRoVG89aSx0aGlzLnBhdGhGcm9tPW4pLHRoaXMuX3BpbmdQb25nPSExKSk7dGhpcy5pc0VuZGVkPSEwLHRoaXMuYWN0aXZlPSExLHRoaXMuZW1pdChcImVuZFwiKSx0aGlzLl9jaGFpblR3ZWVuJiYodGhpcy5fY2hhaW5Ud2Vlbi5hZGRUbyh0aGlzLm1hbmFnZXIpLHRoaXMuX2NoYWluVHdlZW4uc3RhcnQoKSl9fX19fSx7a2V5OlwiX3BhcnNlRGF0YVwiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoIXRoaXMuaXNTdGFydGVkJiYodGhpcy5fZnJvbXx8KHRoaXMuX2Zyb209e30pLGgodGhpcy5fdG8sdGhpcy5fZnJvbSx0aGlzLnRhcmdldCksdGhpcy5wYXRoKSl7dmFyIHQ9dGhpcy5wYXRoLnRvdGFsRGlzdGFuY2UoKTt0aGlzLnBhdGhSZXZlcnNlPyh0aGlzLnBhdGhGcm9tPXQsdGhpcy5wYXRoVG89MCk6KHRoaXMucGF0aEZyb209MCx0aGlzLnBhdGhUbz10KX19fSx7a2V5OlwiX2FwcGx5XCIsdmFsdWU6ZnVuY3Rpb24odCl7aWYodSh0aGlzLl90byx0aGlzLl9mcm9tLHRoaXMudGFyZ2V0LHQsdGhpcy5fZWxhcHNlZFRpbWUsdGhpcy5lYXNpbmcpLHRoaXMucGF0aCl7dmFyIGU9dGhpcy5waW5nUG9uZz90aGlzLnRpbWUvMjp0aGlzLnRpbWUsbj10aGlzLnBhdGhGcm9tLGk9dGhpcy5wYXRoVG8tdGhpcy5wYXRoRnJvbSxyPWUscz10aGlzLl9lbGFwc2VkVGltZS9yLG89bitpKnRoaXMuZWFzaW5nKHMpLGE9dGhpcy5wYXRoLmdldFBvaW50QXREaXN0YW5jZShvKTt0aGlzLnRhcmdldC5wb3NpdGlvbi5zZXQoYS54LGEueSl9fX0se2tleTpcIl9jYW5VcGRhdGVcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbWUmJnRoaXMuYWN0aXZlJiZ0aGlzLnRhcmdldH19XSksZX0ocC51dGlscy5FdmVudEVtaXR0ZXIpO2VbXCJkZWZhdWx0XCJdPXZ9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gcih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9dmFyIHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbz1uKDMpLGE9aShvKSx1PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3IodGhpcyx0KSx0aGlzLnR3ZWVucz1bXSx0aGlzLl90d2VlbnNUb0RlbGV0ZT1bXSx0aGlzLl9sYXN0PTB9cmV0dXJuIHModCxbe2tleTpcInVwZGF0ZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXZvaWQgMDt0fHwwPT09dD9lPTFlMyp0OihlPXRoaXMuX2dldERlbHRhTVMoKSx0PWUvMWUzKTtmb3IodmFyIG49MDtuPHRoaXMudHdlZW5zLmxlbmd0aDtuKyspe3ZhciBpPXRoaXMudHdlZW5zW25dO2kuYWN0aXZlJiYoaS51cGRhdGUodCxlKSxpLmlzRW5kZWQmJmkuZXhwaXJlJiZpLnJlbW92ZSgpKX1pZih0aGlzLl90d2VlbnNUb0RlbGV0ZS5sZW5ndGgpe2Zvcih2YXIgbj0wO248dGhpcy5fdHdlZW5zVG9EZWxldGUubGVuZ3RoO24rKyl0aGlzLl9yZW1vdmUodGhpcy5fdHdlZW5zVG9EZWxldGVbbl0pO3RoaXMuX3R3ZWVuc1RvRGVsZXRlLmxlbmd0aD0wfX19LHtrZXk6XCJnZXRUd2VlbnNGb3JUYXJnZXRcIix2YWx1ZTpmdW5jdGlvbih0KXtmb3IodmFyIGU9W10sbj0wO248dGhpcy50d2VlbnMubGVuZ3RoO24rKyl0aGlzLnR3ZWVuc1tuXS50YXJnZXQ9PT10JiZlLnB1c2godGhpcy50d2VlbnNbbl0pO3JldHVybiBlfX0se2tleTpcImNyZWF0ZVR3ZWVuXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIG5ldyBhW1wiZGVmYXVsdFwiXSh0LHRoaXMpfX0se2tleTpcImFkZFR3ZWVuXCIsdmFsdWU6ZnVuY3Rpb24odCl7dC5tYW5hZ2VyPXRoaXMsdGhpcy50d2VlbnMucHVzaCh0KX19LHtrZXk6XCJyZW1vdmVUd2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMuX3R3ZWVuc1RvRGVsZXRlLnB1c2godCl9fSx7a2V5OlwiX3JlbW92ZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMudHdlZW5zLmluZGV4T2YodCk7LTEhPT1lJiZ0aGlzLnR3ZWVucy5zcGxpY2UoZSwxKX19LHtrZXk6XCJfZ2V0RGVsdGFNU1wiLHZhbHVlOmZ1bmN0aW9uKCl7MD09PXRoaXMuX2xhc3QmJih0aGlzLl9sYXN0PURhdGUubm93KCkpO3ZhciB0PURhdGUubm93KCksZT10LXRoaXMuX2xhc3Q7cmV0dXJuIHRoaXMuX2xhc3Q9dCxlfX1dKSx0fSgpO2VbXCJkZWZhdWx0XCJdPXV9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgZT17fTtpZihudWxsIT10KWZvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKTtyZXR1cm4gZVtcImRlZmF1bHRcIl09dCxlfWZ1bmN0aW9uIHIodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89bigxKSxhPWkobyksdT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtyKHRoaXMsdCksdGhpcy5fY29sc2VkPSExLHRoaXMucG9seWdvbj1uZXcgYS5Qb2x5Z29uLHRoaXMucG9seWdvbi5jbG9zZWQ9ITEsdGhpcy5fdG1wUG9pbnQ9bmV3IGEuUG9pbnQsdGhpcy5fdG1wUG9pbnQyPW5ldyBhLlBvaW50LHRoaXMuX3RtcERpc3RhbmNlPVtdLHRoaXMuY3VycmVudFBhdGg9bnVsbCx0aGlzLmdyYXBoaWNzRGF0YT1bXSx0aGlzLmRpcnR5PSEwfXJldHVybiBzKHQsW3trZXk6XCJtb3ZlVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5tb3ZlVG8uY2FsbCh0aGlzLHQsZSksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImxpbmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmxpbmVUby5jYWxsKHRoaXMsdCxlKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiYmV6aWVyQ3VydmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkscixzKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUuYmV6aWVyQ3VydmVUby5jYWxsKHRoaXMsdCxlLG4saSxyLHMpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJxdWFkcmF0aWNDdXJ2ZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLnF1YWRyYXRpY0N1cnZlVG8uY2FsbCh0aGlzLHQsZSxuLGkpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJhcmNUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkscil7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmFyY1RvLmNhbGwodGhpcyx0LGUsbixpLHIpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJhcmNcIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpLHIscyl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmFyYy5jYWxsKHRoaXMsdCxlLG4saSxyLHMpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJkcmF3U2hhcGVcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUuZHJhd1NoYXBlLmNhbGwodGhpcyx0KSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiZ2V0UG9pbnRcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLnBhcnNlUG9pbnRzKCk7dmFyIGU9dGhpcy5jbG9zZWQmJnQ+PXRoaXMubGVuZ3RoLTE/MDoyKnQ7cmV0dXJuIHRoaXMuX3RtcFBvaW50LnNldCh0aGlzLnBvbHlnb24ucG9pbnRzW2VdLHRoaXMucG9seWdvbi5wb2ludHNbZSsxXSksdGhpcy5fdG1wUG9pbnR9fSx7a2V5OlwiZGlzdGFuY2VCZXR3ZWVuXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXt0aGlzLnBhcnNlUG9pbnRzKCk7dmFyIG49dGhpcy5nZXRQb2ludCh0KSxpPW4ueCxyPW4ueSxzPXRoaXMuZ2V0UG9pbnQoZSksbz1zLngsYT1zLnksdT1vLWksaD1hLXI7cmV0dXJuIE1hdGguc3FydCh1KnUraCpoKX19LHtrZXk6XCJ0b3RhbERpc3RhbmNlXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLnBhcnNlUG9pbnRzKCksdGhpcy5fdG1wRGlzdGFuY2UubGVuZ3RoPTAsdGhpcy5fdG1wRGlzdGFuY2UucHVzaCgwKTtmb3IodmFyIHQ9dGhpcy5sZW5ndGgsZT0wLG49MDt0LTE+bjtuKyspZSs9dGhpcy5kaXN0YW5jZUJldHdlZW4obixuKzEpLHRoaXMuX3RtcERpc3RhbmNlLnB1c2goZSk7cmV0dXJuIGV9fSx7a2V5OlwiZ2V0UG9pbnRBdFwiLHZhbHVlOmZ1bmN0aW9uKHQpe2lmKHRoaXMucGFyc2VQb2ludHMoKSx0PnRoaXMubGVuZ3RoKXJldHVybiB0aGlzLmdldFBvaW50KHRoaXMubGVuZ3RoLTEpO2lmKHQlMT09PTApcmV0dXJuIHRoaXMuZ2V0UG9pbnQodCk7dGhpcy5fdG1wUG9pbnQyLnNldCgwLDApO3ZhciBlPXQlMSxuPXRoaXMuZ2V0UG9pbnQoTWF0aC5jZWlsKHQpKSxpPW4ueCxyPW4ueSxzPXRoaXMuZ2V0UG9pbnQoTWF0aC5mbG9vcih0KSksbz1zLngsYT1zLnksdT0tKChvLWkpKmUpLGg9LSgoYS1yKSplKTtyZXR1cm4gdGhpcy5fdG1wUG9pbnQyLnNldChvK3UsYStoKSx0aGlzLl90bXBQb2ludDJ9fSx7a2V5OlwiZ2V0UG9pbnRBdERpc3RhbmNlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5wYXJzZVBvaW50cygpLHRoaXMuX3RtcERpc3RhbmNlfHx0aGlzLnRvdGFsRGlzdGFuY2UoKTt2YXIgZT10aGlzLl90bXBEaXN0YW5jZS5sZW5ndGgsbj0wLGk9dGhpcy5fdG1wRGlzdGFuY2VbdGhpcy5fdG1wRGlzdGFuY2UubGVuZ3RoLTFdOzA+dD90PWkrdDp0PmkmJih0LT1pKTtmb3IodmFyIHI9MDtlPnImJih0Pj10aGlzLl90bXBEaXN0YW5jZVtyXSYmKG49ciksISh0PHRoaXMuX3RtcERpc3RhbmNlW3JdKSk7cisrKTtpZihuPT09dGhpcy5sZW5ndGgtMSlyZXR1cm4gdGhpcy5nZXRQb2ludEF0KG4pO3ZhciBzPXQtdGhpcy5fdG1wRGlzdGFuY2Vbbl0sbz10aGlzLl90bXBEaXN0YW5jZVtuKzFdLXRoaXMuX3RtcERpc3RhbmNlW25dO3JldHVybiB0aGlzLmdldFBvaW50QXQobitzL28pfX0se2tleTpcInBhcnNlUG9pbnRzXCIsdmFsdWU6ZnVuY3Rpb24oKXtpZighdGhpcy5kaXJ0eSlyZXR1cm4gdGhpczt0aGlzLmRpcnR5PSExLHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoPTA7Zm9yKHZhciB0PTA7dDx0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg7dCsrKXt2YXIgZT10aGlzLmdyYXBoaWNzRGF0YVt0XS5zaGFwZTtlJiZlLnBvaW50cyYmKHRoaXMucG9seWdvbi5wb2ludHM9dGhpcy5wb2x5Z29uLnBvaW50cy5jb25jYXQoZS5wb2ludHMpKX1yZXR1cm4gdGhpc319LHtrZXk6XCJjbGVhclwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aD0wLHRoaXMuY3VycmVudFBhdGg9bnVsbCx0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aD0wLHRoaXMuX2Nsb3NlZD0hMSx0aGlzLmRpcnR5PSExLHRoaXN9fSx7a2V5OlwiY2xvc2VkXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Nsb3NlZH0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuX2Nsb3NlZCE9PXQmJih0aGlzLnBvbHlnb24uY2xvc2VkPXQsdGhpcy5fY2xvc2VkPXQsdGhpcy5kaXJ0eT0hMCl9fSx7a2V5OlwibGVuZ3RoXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoP3RoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoLzIrKHRoaXMuX2Nsb3NlZD8xOjApOjB9fV0pLHR9KCk7ZVtcImRlZmF1bHRcIl09dX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1mdW5jdGlvbiByKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgZT17fTtpZihudWxsIT10KWZvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKTtyZXR1cm4gZVtcImRlZmF1bHRcIl09dCxlfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBzPW4oMSksbz1yKHMpLGE9big0KSx1PWkoYSksaD1uKDMpLGM9aShoKSxsPW4oNSksZj1pKGwpLHA9bigyKSxkPWkocCk7by5HcmFwaGljcy5wcm90b3R5cGUuZHJhd1BhdGg9ZnVuY3Rpb24odCl7cmV0dXJuIHQucGFyc2VQb2ludHMoKSx0aGlzLmRyYXdTaGFwZSh0LnBvbHlnb24pLHRoaXN9O3ZhciBnPXtUd2Vlbk1hbmFnZXI6dVtcImRlZmF1bHRcIl0sVHdlZW46Y1tcImRlZmF1bHRcIl0sRWFzaW5nOmRbXCJkZWZhdWx0XCJdLFR3ZWVuUGF0aDpmW1wiZGVmYXVsdFwiXX07by50d2Vlbk1hbmFnZXJ8fChvLnR3ZWVuTWFuYWdlcj1uZXcgdVtcImRlZmF1bHRcIl0sby50d2Vlbj1nKSxlW1wiZGVmYXVsdFwiXT1nfV0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS10d2Vlbi5qcy5tYXAiLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgXCJBXCI6IHtcclxuICAgIFwiaW1hZ2VcIjogXCJjZWxsMS5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IGZhbHNlLFxyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJjZWxsMS1maWxsLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDUsXHJcbiAgICBcInNjb3JlXCI6IDFcclxuICB9LFxyXG4gIFwiQlwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiY2VsbDIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiBmYWxzZSxcclxuICAgIFwiYWN0aXZhdGlvblwiOiAwXHJcbiAgfSxcclxuICBcIkNcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGw0LnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogZmFsc2UsXHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImNlbGw0LWZpbGwucG5nXCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMjUsXHJcbiAgICBcInNjb3JlXCI6IDNcclxuICB9LFxyXG4gIFwiSVRMXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kVEwucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDBcclxuICB9LFxyXG4gIFwiSVRcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRULnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwiYWN0aXZhdGlvblwiOiAwXHJcbiAgfSxcclxuICBcIklUUlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFRSLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwiYWN0aXZhdGlvblwiOiAwXHJcbiAgfSxcclxuICBcIklSXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kUi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMFxyXG4gIH0sXHJcbiAgXCJJQlJcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRCUi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMFxyXG4gIH0sXHJcbiAgXCJJQlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDBcclxuICB9LFxyXG4gIFwiSUJMXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kQkwucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDBcclxuICB9LFxyXG4gIFwiSUxcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRMLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwiYWN0aXZhdGlvblwiOiAwXHJcbiAgfSxcclxuICBcIklDXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kQy5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMFxyXG4gIH1cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cy5BID0gW1xyXG4gIHtcclxuICAgIG1hcDogWydBfEInLCAnQXxCfEMnLCAnQSddLFxyXG4gICAgc2h1ZmZsZTogdHJ1ZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbWFwOiBbJ0F8QicsICdBJywgJ0EnXSxcclxuICAgIHNodWZmbGU6IHRydWVcclxuICB9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5pc2xhbmQgPSBbXHJcbiAge1xyXG4gICAgbWFwOiBbJ0EnLCAnQicsICdBJ10sXHJcbiAgICBzaHVmZmxlOiB0cnVlXHJcbiAgfSxcclxuICB7XHJcbiAgICBtYXA6IFsnQScsICdBJywgJ0EnXSxcclxuICB9LFxyXG4gIHtcclxuICAgIG1hcDogWydJVEwnLCAnSVQnLCAnSVQnLCAnSVQnLCAnSVRSJ10sXHJcbiAgfSxcclxuICB7XHJcbiAgICBtYXA6IFsnSUwnLCAnSUMnLCAnSUMnLCAnSUMnLCAnSVInXSxcclxuICB9LFxyXG4gIHtcclxuICAgIG1hcDogWydJQkwnLCAnSUInLCAnSUInLCAnSUInLCAnSUJSJ10sXHJcbiAgfVxyXG5dO1xyXG4iLCJjb25zdCBTY2VuZXNNYW5hZ2VyID0gcmVxdWlyZSgnLi9tYW5hZ2Vycy9TY2VuZXNNYW5hZ2VyJyk7XHJcblxyXG5jbGFzcyBHYW1lIGV4dGVuZHMgUElYSS5BcHBsaWNhdGlvbiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0LCB7YmFja2dyb3VuZENvbG9yOiAweGZjZmNmY30pXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlldyk7XHJcblxyXG4gICAgdGhpcy53ID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICB0aGlzLmggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG4gICAgdGhpcy5zY2VuZXNNYW5hZ2VyID0gbmV3IFNjZW5lc01hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLnN0YWdlLmFkZENoaWxkKHRoaXMuc2NlbmVzTWFuYWdlcik7XHJcblxyXG4gICAgdGhpcy5faW5pdFRpY2tlcigpO1xyXG4gIH1cclxuICBfaW5pdFRpY2tlcigpIHtcclxuICAgIHRoaXMudGlja2VyLmFkZCgoZHQpID0+IHtcclxuICAgICAgdGhpcy5zY2VuZXNNYW5hZ2VyLnVwZGF0ZShkdCk7XHJcbiAgICAgIFBJWEkudHdlZW5NYW5hZ2VyLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcbiIsInJlcXVpcmUoJ3BpeGktc291bmQnKTtcclxucmVxdWlyZSgncGl4aS10d2VlbicpO1xyXG5yZXF1aXJlKCdwaXhpLXByb2plY3Rpb24nKTtcclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpO1xyXG5cclxuUElYSS5sb2FkZXJcclxuICAuYWRkKCdibG9ja3MnLCAnYXNzZXRzL2Jsb2Nrcy5qc29uJylcclxuICAuYWRkKCdtdXNpYycsICdhc3NldHMvbXVzaWMubXAzJylcclxuICAubG9hZCgobG9hZGVyLCByZXNvdXJjZXMpID0+IHtcclxuICAgIC8vIFBJWEkuc291bmQucGxheSgnbXVzaWMnKTtcclxuICAgIGxldCBnYW1lID0gbmV3IEdhbWUoKTtcclxuICAgIHdpbmRvdy5nYW1lID0gZ2FtZTtcclxuICB9KTtcclxuIiwiY29uc3Qgc2NlbmVzID0gcmVxdWlyZSgnLi4vc2NlbmVzJyk7XHJcblxyXG5jbGFzcyBTY2VuZXNNYW5hZ2VyIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIHRoaXMuYWRkU2NlbmVzKHNjZW5lcyk7XHJcbiAgfVxyXG4gIGFkZFNjZW5lcyhzY2VuZXMpIHtcclxuICAgIGZvcihsZXQgaWQgaW4gc2NlbmVzKSB7XHJcbiAgICAgIHRoaXMuYWRkU2NlbmUoc2NlbmVzW2lkXSwgaWQpO1xyXG4gICAgfVxyXG4gIH1cclxuICBhZGRTY2VuZShTY2VuZUNsYXNzLCBpZCkge1xyXG4gICAgbGV0IHNjZW5lID0gbmV3IFNjZW5lQ2xhc3ModGhpcy5nYW1lLCB0aGlzKTtcclxuICAgIHNjZW5lLl9pZCA9IGlkO1xyXG4gICAgcmV0dXJuIHRoaXMuYWRkQ2hpbGQoc2NlbmUpO1xyXG4gIH1cclxuICBnZXRTY2VuZShpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmluZCgoc2NlbmUpID0+IHNjZW5lLl9pZCA9PT0gaWQpO1xyXG4gIH1cclxuICB0b2dnbGVTY2VuZShpZCkge1xyXG4gICAgaWYodGhpcy5hY3RpdmVTY2VuZSkgdGhpcy5hY3RpdmVTY2VuZS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gdGhpcy5nZXRTY2VuZShpZCk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lLnZpc2libGUgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmFjdGl2ZVNjZW5lO1xyXG4gIH1cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlKGR0KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NlbmVzTWFuYWdlcjtcclxuIiwiY29uc3QgVGlsZU1hcCA9IHJlcXVpcmUoJy4uL3RpbGVtYXAvVGlsZU1hcC5qcycpO1xyXG5jb25zdCBmcmFnbWVudHMgPSByZXF1aXJlKCcuLi9jb250ZW50L2ZyYWdtZW50cy5qcycpO1xyXG5cclxuY2xhc3MgUGxheWdyb3VuZCBleHRlbmRzIFBJWEkucHJvamVjdGlvbi5Db250YWluZXIyZCB7XHJcbiAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgdGhpcy50aWxlTWFwID0gbmV3IFRpbGVNYXAodGhpcywge21heFg6IDUsIHRpbGVTaXplOiAxMDB9KTtcclxuICAgIHRoaXMudGlsZU1hcC54ID0gdGhpcy5nYW1lLncvMi10aGlzLnRpbGVNYXAuTUFQX1dJRFRILzI7XHJcbiAgICB0aGlzLndpZHRoID0gdGhpcy50aWxlTWFwLk1BUF9XSURUSDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5nYW1lLmg7XHJcbiAgICB0aGlzLnByb2ouc2V0QXhpc1koe3g6IC10aGlzLmdhbWUudy8yKzUwLCB5OiA0MDAwfSwgLTEpO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLnRpbGVNYXApO1xyXG5cclxuXHJcbiAgICB0aGlzLnRpbGVNYXAuYWRkTWFwKGZyYWdtZW50cy5pc2xhbmQpO1xyXG4gICAgdGhpcy50aWxlTWFwLm9uKCdtYXBFbmQnLCAoKSA9PiB7XHJcbiAgICAgIGlmKE1hdGgucmFuZG9tKCkgPCAuOCkgdGhpcy50aWxlTWFwLmFkZE1hcChmcmFnbWVudHMuQSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMudGlsZU1hcC5hZGRNYXAoZnJhZ21lbnRzLmlzbGFuZCk7XHJcbiAgICAgICAgdGhpcy50aWxlTWFwLmFkZE1hcChmcmFnbWVudHMuQSk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy50aWxlTWFwLnVwZGF0ZShkdCk7XHJcbiAgICB0aGlzLnRpbGVNYXAueSArPSA1ICogZHQ7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXlncm91bmQ7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICdwbGF5Z3JvdW5kJzogcmVxdWlyZSgnLi9QbGF5Z3JvdW5kJylcclxufVxyXG4iLCJjbGFzcyBCbG9jayBleHRlbmRzIFBJWEkucHJvamVjdGlvbi5TcHJpdGUyZCB7XHJcbiAgY29uc3RydWN0b3IodGlsZU1hcCwgeCwgeSwgcGFyYW1zPXt9KSB7XHJcbiAgICBzdXBlcihQSVhJLlRleHR1cmUuZnJvbUZyYW1lKHBhcmFtcy5pbWFnZSB8fCBwYXJhbXMuYWN0aXZhdGlvbkltYWdlKSk7XHJcblxyXG4gICAgdGhpcy50aWxlTWFwID0gdGlsZU1hcDtcclxuICAgIHRoaXMuZ2FtZSA9IHRoaXMudGlsZU1hcC5nYW1lO1xyXG5cclxuXHJcbiAgICB0aGlzLnNjb3JlID0gcGFyYW1zLnNjb3JlO1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uID0gcGFyYW1zLmFjdGl2YXRpb247XHJcbiAgICB0aGlzLmRlYWN0aXZhdGlvblRleHR1cmUgPSBwYXJhbXMuaW1hZ2UgPyBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKHBhcmFtcy5pbWFnZSkgOiBudWxsO1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uVGV4dHVyZSA9IHBhcmFtcy5hY3RpdmF0aW9uSW1hZ2UgPyBQSVhJLlRleHR1cmUuZnJvbUZyYW1lKHBhcmFtcy5hY3RpdmF0aW9uSW1hZ2UpIDogbnVsbDtcclxuICAgIHRoaXMuaXNBY3RpdmUgPSBwYXJhbXMuYWN0aXZlO1xyXG5cclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSk7XHJcbiAgICB0aGlzLndpZHRoID0gdGlsZU1hcC5USUxFX1NJWkUrMjtcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGlsZU1hcC5USUxFX1NJWkUrMjtcclxuICAgIHRoaXMueCA9IHgrdGlsZU1hcC5USUxFX1NJWkUvMisxO1xyXG4gICAgdGhpcy55ID0geSt0aWxlTWFwLlRJTEVfU0laRS8yKzE7XHJcblxyXG4gICAgdGhpcy5qb2x0aW5nID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICB0aGlzLmpvbHRpbmcuZnJvbSh7cm90YXRpb246IC0uMX0pLnRvKHtyb3RhdGlvbjogLjF9KTtcclxuICAgIHRoaXMuam9sdGluZy50aW1lID0gMTAwO1xyXG4gICAgdGhpcy5qb2x0aW5nLnJlcGVhdCA9IHRoaXMuYWN0aXZhdGlvbjtcclxuICAgIHRoaXMuam9sdGluZy5waW5nUG9uZyA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5hY3RpdmF0aW5nID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICB0aGlzLmFjdGl2YXRpbmcuZnJvbSh7d2lkdGg6IHRoaXMud2lkdGgqMy80LCBoZWlnaHQ6IHRoaXMuaGVpZ2h0KjMvNH0pLnRvKHt3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodH0pO1xyXG4gICAgdGhpcy5hY3RpdmF0aW5nLnRpbWUgPSA1MDA7XHJcbiAgICB0aGlzLmFjdGl2YXRpbmcuZWFzaW5nID0gUElYSS50d2Vlbi5FYXNpbmcub3V0Qm91bmNlKCk7XHJcblxyXG4gICAgdGhpcy5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcbiAgICB0aGlzLm9uKCdwb2ludGVybW92ZScsIHRoaXMuaGl0LCB0aGlzKTtcclxuICB9XHJcbiAgYWN0aXZhdGUoKSB7XHJcbiAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcclxuICAgIHRoaXMuYWN0aXZhdGluZy5zdGFydCgpO1xyXG4gICAgdGhpcy5qb2x0aW5nLnN0b3AoKTtcclxuICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uVGV4dHVyZSkgdGhpcy50ZXh0dXJlID0gdGhpcy5hY3RpdmF0aW9uVGV4dHVyZTtcclxuICB9XHJcbiAgZGVhY3RpdmF0ZSgpIHtcclxuICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcclxuICAgIGlmKHRoaXMuZGVhY3RpdmF0aW9uVGV4dHVyZSkgdGhpcy50ZXh0dXJlID0gdGhpcy5kZWFjdGl2YXRpb25UZXh0dXJlO1xyXG4gIH1cclxuICBoaXQoZSkge1xyXG4gICAgaWYoIXRoaXMuY29udGFpbnNQb2ludChlLmRhdGEuZ2xvYmFsKSkge1xyXG4gICAgICB0aGlzLmpvbHRpbmcuc3RvcCgpO1xyXG4gICAgICB0aGlzLnJvdGF0aW9uID0gMDtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZhdGlvbi0tO1xyXG4gICAgICB0aGlzLmpvbHRpbmcuc3RhcnQoKTtcclxuICAgIH0gZWxzZSAhdGhpcy5pc0FjdGl2ZSAmJiB0aGlzLmFjdGl2YXRlKCk7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgaWYodGhpcy53b3JsZFRyYW5zZm9ybS50eS10aGlzLnRpbGVNYXAuVElMRV9TSVpFLzIgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgdGhpcy50aWxlTWFwLnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcclxuIiwiY2xhc3MgTWFwRnJhZ21lbnQge1xyXG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB0aGlzLmlucHV0TWFwID0gZGF0YS5tYXA7XHJcbiAgICB0aGlzLmZyYWdtZW50ID0gW107XHJcblxyXG5cclxuICAgIC8vIE9QRVJBVE9SU1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGRhdGEubWFwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKH5+ZGF0YS5tYXBbaV0uaW5kZXhPZignfCcpKSB0aGlzLmNhc2VPcGVyYXRvcihkYXRhLm1hcFtpXSwgaSk7XHJcbiAgICAgIGVsc2UgdGhpcy5mcmFnbWVudFtpXSA9IGRhdGEubWFwW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1FVEhPRFNcclxuICAgIGRhdGEudHJpbSAmJiB0aGlzLnJhbmRvbVRyaW0oZGF0YS50cmltKTtcclxuICAgIGRhdGEuYXBwZW5kICYmIHRoaXMucmFuZG9tQXBwZW5kKGRhdGEuYXBwZW5kKTtcclxuICAgIGRhdGEuc2h1ZmZsZSAmJiB0aGlzLnNodWZmbGUoKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5mcmFnbWVudDtcclxuICB9XHJcbiAgLy8gT1BFUkFUT1JTXHJcbiAgLy8gQ2FzZSBvcGVyYXRvcjogJ0F8QnxDfEQnID0+IEMgYW5kIGV0Yy4uLlxyXG4gIGNhc2VPcGVyYXRvcihzdHIsIGkpIHtcclxuICAgIGxldCBpZHMgPSBzdHIuc3BsaXQoJ3wnKTtcclxuICAgIHRoaXMuZnJhZ21lbnRbaV0gPSBpZHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmlkcy5sZW5ndGgpXTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gTUVUSE9EU1xyXG4gIC8vIFRyaW1taW5nIGFycmF5IGluIHJhbmdlIDAuLnJhbmQobWluLCBsZW5ndGgpXHJcbiAgcmFuZG9tVHJpbShtaW4pIHtcclxuICAgIHRoaXMuZnJhZ21lbnQubGVuZ3RoID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRoaXMuZnJhZ21lbnQubGVuZ3RoKzEgLSBtaW4pICsgbWluKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICAvLyBTaHVmZmxlIGFycmF5IFsxLDIsM10gPT4gWzIsMSwzXSBhbmQgZXRjLi4uXHJcbiAgc2h1ZmZsZSgpIHtcclxuICAgIHRoaXMuZnJhZ21lbnQuc29ydCgoYSwgYikgPT4gTWF0aC5yYW5kb20oKSA8IC41ID8gLTEgOiAxKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICAvLyBBZGRzIGEgYmxvY2sgdG8gdGhlIHJhbmRvbSBsb2NhdGlvbiBvZiB0aGUgYXJyYXk6IFtBLEEsQV0gPT4gW0IsQSxBXSBhbmQgZXRjLi4uXHJcbiAgcmFuZG9tQXBwZW5kKGlkKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSp0aGlzLmZyYWdtZW50Lmxlbmd0aCldID0gaWQ7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwRnJhZ21lbnQ7XHJcbiIsImNvbnN0IFRJTEVfVFlQRVMgPSByZXF1aXJlKCcuLi9jb250ZW50L1RJTEVfVFlQRVMnKTtcclxuY29uc3QgTWFwRnJhZ21lbnQgPSByZXF1aXJlKCcuL01hcEZyYWdtZW50Jyk7XHJcbmNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi9CbG9jaycpO1xyXG5cclxuY2xhc3MgVGlsZU1hcCBleHRlbmRzIFBJWEkucHJvamVjdGlvbi5Db250YWluZXIyZCB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUsIHBhcmFtcz17fSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG5cclxuICAgIHRoaXMuTUFYX1ggPSBwYXJhbXMubWF4WCB8fCA2O1xyXG4gICAgdGhpcy5USUxFX1NJWkUgPSBwYXJhbXMudGlsZVNpemUgfHwgMTAwO1xyXG4gICAgdGhpcy5NQVBfV0lEVEggPSB0aGlzLk1BWF9YKnRoaXMuVElMRV9TSVpFO1xyXG4gICAgdGhpcy5sYXN0SW5kZXggPSAwO1xyXG5cclxuICAgIHRoaXMuZXZlbnRzID0ge307XHJcbiAgfVxyXG4gIG9uKGUsIGNiKSB7XHJcbiAgICB0aGlzLmV2ZW50c1tlXSA9IGNiO1xyXG4gIH1cclxuICB0cmlnZ2VyRXZlbnQoZSwgYXJnKSB7XHJcbiAgICB0aGlzLmV2ZW50c1tlXSAmJiB0aGlzLmV2ZW50c1tlXShhcmcpO1xyXG4gIH1cclxuICBhZGRNYXAobWFwKSB7XHJcbiAgICBmb3IobGV0IGkgPSBtYXAubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIHRoaXMuYWRkRnJhZ21lbnQobWFwW2ldKTtcclxuICAgIH1cclxuICB9XHJcbiAgYWRkRnJhZ21lbnQoZGF0YUZyYWcpIHtcclxuICAgIGxldCBmcmFnID0gbmV3IE1hcEZyYWdtZW50KGRhdGFGcmFnKTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmcmFnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuYWRkQmxvY2soZnJhZ1tpXSwgTWF0aC5yb3VuZCgodGhpcy5NQVhfWC1mcmFnLmxlbmd0aCkvMikraSwgdGhpcy5sYXN0SW5kZXgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5sYXN0SW5kZXgrKztcclxuICB9XHJcbiAgYWRkQmxvY2soaWQsIHgsIHkpIHtcclxuICAgIGlmKGlkID09PSAnXycpIHJldHVybjtcclxuXHJcbiAgICBsZXQgcG9zWCA9IHgqdGhpcy5USUxFX1NJWkU7XHJcbiAgICBsZXQgcG9zWSA9IC15KnRoaXMuVElMRV9TSVpFO1xyXG4gICAgdGhpcy5hZGRDaGlsZChuZXcgQmxvY2sodGhpcywgcG9zWCwgcG9zWSwgVElMRV9UWVBFU1tpZF0pKTtcclxuICB9XHJcbiAgX2NvbXB1dGVkRW5kTWFwKCkge1xyXG4gICAgaWYodGhpcy5jaGlsZHJlbi5sZW5ndGggPCB0aGlzLk1BWF9YKih0aGlzLmdhbWUuaC90aGlzLlRJTEVfU0laRSkpIHtcclxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoJ21hcEVuZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9jb21wdXRlZEVuZE1hcCgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaWxlTWFwO1xyXG4iXX0=
