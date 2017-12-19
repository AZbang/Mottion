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
    "active": false
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
    "activation": 0
  },
  "IC": {
    "activationImage": "islandC.png",
    "active": true,
    "playerDir": "top",
    "activation": 0
  }
}

},{}],5:[function(require,module,exports){
module.exports={
  "let": [
    {
      "map": ["A|B", "A|B|C", "A"],
      "shuffle": true
    },
    {
      "map": ["A|B", "A", "A"],
      "shuffle": true
    }
  ],
  "island": [
    {
      "map": ["A", "B", "A"],
      "shuffle": true
    },
    {
      "map": ["A", "A", "A"]
    },
    {
      "map": ["ITL", "IT", "ITR"]
    },
    {
      "map": ["IL",  "IC",  "IR"]
    },
    {
      "map": ["IBL", "IB", "IBR"]
    },
    {
      "map": ["A", "A", "A"]
    }
  ]
}

},{}],6:[function(require,module,exports){
module.exports=[
  {
    "fragments": {
      "island": 1,
      "let": 10,
      "island": 1
    },
    "history": {
      "ru": "Тлен идет за тобой по пятам. \n Отступись и он тебя поглатит... \n Но не стоит отчаиваться, ведь музыка всегда с тобой."
    }
  },
  {
    "fragments": {
      "let": 10,
      "island": 1
    },
    "history": {
      "ru": "Тлен не щадит никого. Летучие змеи падут на землю и погрузятся в рутину бытия..."
    }
  },
  {
    "fragments": {
      "let": 10,
      "island": 1
    },
    "history": {
      "ru": "И тогда он понес свечу через чужие земли освобождая летучих змей и свой народ..."
    }
  }
]

},{}],7:[function(require,module,exports){
const ScenesManager = require('./managers/ScenesManager');

class Game extends PIXI.Application {
  constructor() {
    super(window.innerWidth, window.innerHeight, {backgroundColor: 0xfcfcfc})
    document.body.appendChild(this.view);

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.scenes = new ScenesManager(this);
    this.stage.addChild(this.scenes);

    this._initTicker();
  }
  _initTicker() {
    this.ticker.add((dt) => {
      this.scenes.update(dt);
      PIXI.tweenManager.update();
    });
  }
}

module.exports = Game;

},{"./managers/ScenesManager":12}],8:[function(require,module,exports){
require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
const Game = require('./game');

PIXI.loader
  .add('blocks', 'assets/blocks.json')
  .add('player', 'assets/player.png')
  .add('music', 'assets/music.mp3')
  .load((loader, resources) => {
    // PIXI.sound.play('music');
    let game = new Game();
    game.scenes.setScene('playground');

    window.game = game;
  });

},{"./game":7,"pixi-projection":1,"pixi-sound":2,"pixi-tween":3}],9:[function(require,module,exports){
class HistoryManager extends PIXI.Container {
  constructor(scene) {
    super();
    
    this.scene = scene;
  }
}

module.exports = HistoryManager;

},{}],10:[function(require,module,exports){
const DataFragmentConverter = require('../utils/DataFragmentConverter');

class LevelManager extends PIXI.projection.Container2d {
  constructor(scene) {
    super();

    this.scene = scene;
    this.map = scene.map;

    this.levels = [];
    this.fragmentsData = {};
    this.addFragmentsData(require('../content/fragments'));
    this.addLevels(require('../content/levels'))

    this.currentLevel = 0;
    this.currentFragment = 0;

    this.setLevel(0);
    this.map.on('mapEnd', () => this.nextFragment());
  }

  // add fragments to db fragments
  addFragmentsData(data={}) {
    Object.assign(this.fragmentsData, data);
  }

  // add levels to db levels
  addLevels(levels=[]) {
    this.levels = this.levels.concat(levels);

    // generate map for every level from fragments
    levels.forEach((lvl) => {
      // lvl saved in this.levels
      lvl.maps = [];
      for(let key in lvl.fragments) {
        for(let i = 0; i < lvl.fragments[key]; i++) {
          this.fragmentsData[key] && lvl.maps.push(this.fragmentsData[key]);
        }
      }
    });
  }

  // getters
  getCurrentLevel() {
    return this.levels[this.currentLevel];
  }
  getCurrentFragment() {
    return this.getCurrentLevel().maps[this.currentFragment];
  }

  //
  loseLevel() {
    // There more logic with history...
    this.scene.restart();
  }
  endLevel() {
    // There more logic with history...
    this.nextLevel();
  }

  // Methods for levels control
  setLevel(lvl) {
    if(lvl > this.levels.length || lvl < 0) return;
    this.currentLevel = lvl;
    this.setFragment(0);
  }
  nextLevel() {
    this.setLevel(this.currentLevel+1);
  }
  backLevel() {
    this.setLevel(this.currentLevel-1);
  }


  // Methods for fragments control
  setFragment(frag) {
    if(frag < 0) return;
    this.currentFragment = frag;

    // if not more fragments, then level complete...
    if(!this.getCurrentFragment()) this.endLevel();
    this.map.addMap(this.getCurrentFragment());
  }
  nextFragment() {
    this.setFragment(this.currentFragment+1);
  }
  backFragment() {
    this.setFragment(this.currentFragment-1);
  }
}

module.exports = LevelManager;

},{"../content/fragments":5,"../content/levels":6,"../utils/DataFragmentConverter":18}],11:[function(require,module,exports){
const Block = require('../subjects/Block');
const DataFragmentConverter = require('../utils/DataFragmentConverter');

class MapManager extends PIXI.projection.Container2d {
  constructor(scene, params={}) {
    super();

    this.scene = scene;
    this.game = scene.game;

    this.maxAxisX = params.maxX || 6;
    this.blockSize = params.tileSize || 100;
    this.setBlocksData(require('../content/blocks'));
    this.resize();

    this.speed = 500;
    this.lastIndex = 0;

    this.events = {};
  }
  // Set params
  resize() {
    this.x = this.game.w/2-this.maxAxisX*this.blockSize/2;
    this.y = this.game.h-this.scene.PADDING_BOTTOM;
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
  setBlocksData(data) {
    this.BLOCKS = data || {};
  }

  // Event Emitter
  on(e, cb) {
    this.events[e] = cb;
  }
  triggerEvent(e, arg) {
    this.events[e] && this.events[e](arg);
  }

  // Map Manager
  addMap(map) {
    for(let i = map.length-1; i >= 0; i--) {
      this.addFragment(map[i]);
    }
  }
  addFragment(fragData) {
    let frag = new DataFragmentConverter(fragData).fragment;

    for(let i = 0; i < frag.length; i++) {
      // add block to center X axis, for example: round((8-4)/2) => +2 padding to block X pos
      this.addBlock(frag[i], Math.round((this.maxAxisX-frag.length)/2)+i, this.lastIndex);
    }
    this.lastIndex++;
  }
  addBlock(id, x, y) {
    if(id === '_') return;

    let posX = x*this.blockSize;
    let posY = -y*this.blockSize;
    this.addChild(new Block(this, posX, posY, this.BLOCKS[id]));
  }

  // Collision Widh Block
  getBlockFromPos(x, y) {
    for(let i = 0; i < this.children.length; i++) {
      if(this.children[i].containsPoint(new PIXI.Point(x, y))) return this.children[i];
    }
  }

  // Moving Map
  scrollDown(blocks) {
    // Scroll map down on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y+blocks*this.blockSize});
    move.time = this.speed*blocks;
    move.on('end', () => this.triggerEvent('scrollEnd'));
    move.start();
  }
  scrollTop(blocks) {
    // Scroll map top on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y-blocks*this.blockSize});
    move.time = this.speed*blocks;
    move.on('end', () => this.triggerEvent('scrollEnd'));
    move.start();
  }

  update() {
    // Computing map end (amt blocks < max amt blocks)
    if(this.children.length < this.maxAxisX*(this.game.h/this.blockSize)) {
      this.triggerEvent('mapEnd');
    }

    // clear out range map blocks
    for(let i = 0; i < this.children.length; i++) {
      if(this.children[i].worldTransform.ty-this.blockSize/2 > this.game.h) {
        this.removeChild(this.children[i]);
      }
    }
  }
}

module.exports = MapManager;

},{"../content/blocks":4,"../subjects/Block":16,"../utils/DataFragmentConverter":18}],12:[function(require,module,exports){
class ScenesManager extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.scenes = require('../scenes');
    this.activeScene = null;
  }
  addScenes(scenes) {
    for(let id in scenes) {
      this.addScene(id, scenes[id]);
    }
  }
  addScene(id, scene) {
    this.scenes[id] = scene;
  }
  getScene(id) {
    return this.scenes[id];
  }
  restartScene() {
    this.setScene(this.activeScene._idScene);
  }
  setScene(id) {
    this.removeChild(this.activeScene);

    let Scene = this.getScene(id);
    this.activeScene = this.addChild(new Scene(this.game, this));
    this.activeScene._idScene = id;
    return this.activeScene;
  }

  update(dt) {
    this.activeScene && this.activeScene.update && this.activeScene.update(dt);
  }
}

module.exports = ScenesManager;

},{"../scenes":15}],13:[function(require,module,exports){
class ScreenManager extends PIXI.Container {
  constructor(scene) {
    super();

    this.scene = scene;
  }
}

module.exports = ScreenManager;

},{}],14:[function(require,module,exports){
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
    this.PADDING_BOTTOM = 280;

    // Init objects
    this.screen = new ScreenManager(this);
    this.addChild(this.screen);

    this.map = new MapManager(this, {maxX: 5, tileSize: 100});
    this.addChild(this.map);

    this.levels = new LevelManager(this);
    this.addChild(this.levels);

    this.history = new HistoryManager(this);
    this.addChild(this.history);

    this.player = new Player(this);
    this.addChild(this.player);
  }
  restart() {
    this.game.scenes.restartScene('playground');

    // this.screen.splash(0xFFFFFF, 1000).then(() => {
    //   this.game.scenes.restartScene('playground');
    // });
  }
  update() {
    this.map.update();
  }
}

module.exports = Playground;

},{"../managers/HistoryManager":9,"../managers/LevelManager":10,"../managers/MapManager":11,"../managers/ScreenManager":13,"../subjects/Player":17}],15:[function(require,module,exports){
module.exports = {
  'playground': require('./Playground')
}

},{"./Playground":14}],16:[function(require,module,exports){
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

    this.anchor.set(.5);
    this.width = map.blockSize+1;
    this.height = map.blockSize+1;
    this.x = x+map.blockSize/2+.5;
    this.y = y+map.blockSize/2+.5;

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 100;
    this.jolting.repeat = this.activation;
    this.jolting.pingPong = true;

    this.interactive = true;
    this.on('pointermove', this.hit, this);
  }
  activate() {
    let activating = PIXI.tweenManager.createTween(this)
      .from({width: this.width*3/4, height: this.height*3/4})
      .to({width: this.width, height: this.height});

    activating.time = 500;
    activating.easing = PIXI.tween.Easing.outBounce();
    activating.start();

    this.isActive = true;
    this.jolting.stop();
    this.rotation = 0;
    if(this.activationTexture) this.texture = this.activationTexture;
  }
  deactivate() {
    this.isActive = false;
    if(this.deactivationTexture) this.texture = this.deactivationTexture;
  }
  hit(e) {
    if(this.activation === null || this.isActive) return;

    if(this.containsPoint(e.data.global)) {
      this.jolting.start();
      if(this.activation) this.activation--;
      else this.activate();
    } else {
      this.jolting.stop();
      this.rotation = 0;
    }
  }
}

module.exports = Block;

},{}],17:[function(require,module,exports){
class Player extends PIXI.projection.Sprite2d {
  constructor(scene) {
    super(PIXI.Texture.fromImage('player'));

    this.scene = scene;
    this.game = scene.game;
    this.map = scene.map;

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
    this.isJump = false;
    this.jumpingCount = 1;

    this.map.on('scrollEnd', () => this.moving());
    this.map.scrollDown(1);

    this.scene.interactive = true;
    this.scene.on('pointerdown', () => {
      if(!this.jumpingCount) return;
      this.jumpingCount--;
      this.isJump = true;
    });
  }
  moving() {
    if(this.isDead) return;

    if(this.isJump) {
      this.alpha = .5;
      return this.jump();
    } else this.alpha = 1;

    let cur = this.map.getBlockFromPos(this.x, this.y+this.map.blockSize);
    if(cur && cur.isActive) {
      if(cur.playerDir === 'top') return this.top();
      if(cur.playerDir === 'left') return this.left();
      if(cur.playerDir === 'right') return this.right();

      //check top
      let top = this.map.getBlockFromPos(this.x, this.y);
      if(top && top.isActive && this.lastMove !== 'bottom') return this.top();

      // check left
      let left = this.map.getBlockFromPos(this.x-this.map.blockSize, this.y+this.map.blockSize);
      if(left && left.isActive && this.lastMove !== 'right') return this.left();

      // check rigth
      let right = this.map.getBlockFromPos(this.x+this.map.blockSize, this.y+this.map.blockSize);
      if(right && right.isActive && this.lastMove !== 'left') return this.right();

      // or die
      this.top();
    } else this.dead();
  }
  dead() {
    let dead = PIXI.tweenManager.createTween(this.scale);
    dead.from({x: .5, y: .5}).to({x: 0, y: 0});
    dead.time = 200;
    dead.start();
    dead.on('end', () => this.scene.levels.loseLevel());

    this.walking.stop();
    this.isDead = true;
  }
  jump() {
    this.lastMove = 'jump';
    this.isJump = false;
    this.map.scrollDown(2);
  }
  top() {
    this.lastMove = 'top';
    this.map.scrollDown(1);
  }
  left() {
    this.lastMove = 'left';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x-this.map.blockSize});
    move.time = this.speed/2;
    move.on('end', () => this.moving());
    move.start();
  }
  right() {
    this.lastMove = 'right';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x+this.map.blockSize});
    move.time = this.speed/2;
    move.on('end', () => this.moving());
    move.start();
  }
}

module.exports = Player;

},{}],18:[function(require,module,exports){
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

},{}]},{},[8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9waXhpLXByb2plY3Rpb24vZGlzdC9waXhpLXByb2plY3Rpb24uanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9waXhpLXNvdW5kL2Rpc3QvcGl4aS1zb3VuZC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vbm9kZV9tb2R1bGVzL3BpeGktdHdlZW4vYnVpbGQvcGl4aS10d2Vlbi5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2NvbnRlbnQvYmxvY2tzLmpzb24iLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9jb250ZW50L2ZyYWdtZW50cy5qc29uIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvY29udGVudC9sZXZlbHMuanNvbiIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2dhbWUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0hpc3RvcnlNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvTGV2ZWxNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvTWFwTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL1NjZW5lc01hbmFnZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9tYW5hZ2Vycy9TY3JlZW5NYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc2NlbmVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zY2VuZXMvaW5kZXguanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdWJqZWN0cy9CbG9jay5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N1YmplY3RzL1BsYXllci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3V0aWxzL0RhdGFGcmFnbWVudENvbnZlcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB1dGlscztcclxuICAgIChmdW5jdGlvbiAodXRpbHMpIHtcclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVJbmRpY2VzRm9yUXVhZHMoc2l6ZSkge1xyXG4gICAgICAgICAgICB2YXIgdG90YWxJbmRpY2VzID0gc2l6ZSAqIDY7XHJcbiAgICAgICAgICAgIHZhciBpbmRpY2VzID0gbmV3IFVpbnQxNkFycmF5KHRvdGFsSW5kaWNlcyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IHRvdGFsSW5kaWNlczsgaSArPSA2LCBqICs9IDQpIHtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDBdID0gaiArIDA7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAxXSA9IGogKyAxO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgMl0gPSBqICsgMjtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDNdID0gaiArIDA7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyA0XSA9IGogKyAyO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgNV0gPSBqICsgMztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5kaWNlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuY3JlYXRlSW5kaWNlc0ZvclF1YWRzID0gY3JlYXRlSW5kaWNlc0ZvclF1YWRzO1xyXG4gICAgICAgIGZ1bmN0aW9uIGlzUG93Mih2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhKHYgJiAodiAtIDEpKSAmJiAoISF2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuaXNQb3cyID0gaXNQb3cyO1xyXG4gICAgICAgIGZ1bmN0aW9uIG5leHRQb3cyKHYpIHtcclxuICAgICAgICAgICAgdiArPSArKHYgPT09IDApO1xyXG4gICAgICAgICAgICAtLXY7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gMTtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiAyO1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDQ7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gODtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiAxNjtcclxuICAgICAgICAgICAgcmV0dXJuIHYgKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5uZXh0UG93MiA9IG5leHRQb3cyO1xyXG4gICAgICAgIGZ1bmN0aW9uIGxvZzIodikge1xyXG4gICAgICAgICAgICB2YXIgciwgc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgPSArKHYgPiAweEZGRkYpIDw8IDQ7XHJcbiAgICAgICAgICAgIHYgPj4+PSByO1xyXG4gICAgICAgICAgICBzaGlmdCA9ICsodiA+IDB4RkYpIDw8IDM7XHJcbiAgICAgICAgICAgIHYgPj4+PSBzaGlmdDtcclxuICAgICAgICAgICAgciB8PSBzaGlmdDtcclxuICAgICAgICAgICAgc2hpZnQgPSArKHYgPiAweEYpIDw8IDI7XHJcbiAgICAgICAgICAgIHYgPj4+PSBzaGlmdDtcclxuICAgICAgICAgICAgciB8PSBzaGlmdDtcclxuICAgICAgICAgICAgc2hpZnQgPSArKHYgPiAweDMpIDw8IDE7XHJcbiAgICAgICAgICAgIHYgPj4+PSBzaGlmdDtcclxuICAgICAgICAgICAgciB8PSBzaGlmdDtcclxuICAgICAgICAgICAgcmV0dXJuIHIgfCAodiA+PiAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMubG9nMiA9IGxvZzI7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0SW50ZXJzZWN0aW9uRmFjdG9yKHAxLCBwMiwgcDMsIHA0LCBvdXQpIHtcclxuICAgICAgICAgICAgdmFyIEExID0gcDIueCAtIHAxLngsIEIxID0gcDMueCAtIHA0LngsIEMxID0gcDMueCAtIHAxLng7XHJcbiAgICAgICAgICAgIHZhciBBMiA9IHAyLnkgLSBwMS55LCBCMiA9IHAzLnkgLSBwNC55LCBDMiA9IHAzLnkgLSBwMS55O1xyXG4gICAgICAgICAgICB2YXIgRCA9IEExICogQjIgLSBBMiAqIEIxO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoRCkgPCAxZS03KSB7XHJcbiAgICAgICAgICAgICAgICBvdXQueCA9IEExO1xyXG4gICAgICAgICAgICAgICAgb3V0LnkgPSBBMjtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBUID0gQzEgKiBCMiAtIEMyICogQjE7XHJcbiAgICAgICAgICAgIHZhciBVID0gQTEgKiBDMiAtIEEyICogQzE7XHJcbiAgICAgICAgICAgIHZhciB0ID0gVCAvIEQsIHUgPSBVIC8gRDtcclxuICAgICAgICAgICAgaWYgKHUgPCAoMWUtNikgfHwgdSAtIDEgPiAtMWUtNikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dC54ID0gcDEueCArIHQgKiAocDIueCAtIHAxLngpO1xyXG4gICAgICAgICAgICBvdXQueSA9IHAxLnkgKyB0ICogKHAyLnkgLSBwMS55KTtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmdldEludGVyc2VjdGlvbkZhY3RvciA9IGdldEludGVyc2VjdGlvbkZhY3RvcjtcclxuICAgICAgICBmdW5jdGlvbiBnZXRQb3NpdGlvbkZyb21RdWFkKHAsIGFuY2hvciwgb3V0KSB7XHJcbiAgICAgICAgICAgIG91dCA9IG91dCB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYTEgPSAxLjAgLSBhbmNob3IueCwgYTIgPSAxLjAgLSBhMTtcclxuICAgICAgICAgICAgdmFyIGIxID0gMS4wIC0gYW5jaG9yLnksIGIyID0gMS4wIC0gYjE7XHJcbiAgICAgICAgICAgIG91dC54ID0gKHBbMF0ueCAqIGExICsgcFsxXS54ICogYTIpICogYjEgKyAocFszXS54ICogYTEgKyBwWzJdLnggKiBhMikgKiBiMjtcclxuICAgICAgICAgICAgb3V0LnkgPSAocFswXS55ICogYTEgKyBwWzFdLnkgKiBhMikgKiBiMSArIChwWzNdLnkgKiBhMSArIHBbMl0ueSAqIGEyKSAqIGIyO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5nZXRQb3NpdGlvbkZyb21RdWFkID0gZ2V0UG9zaXRpb25Gcm9tUXVhZDtcclxuICAgIH0pKHV0aWxzID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzIHx8IChwaXhpX3Byb2plY3Rpb24udXRpbHMgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcblBJWEkucHJvamVjdGlvbiA9IHBpeGlfcHJvamVjdGlvbjtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBQcm9qZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uKGxlZ2FjeSwgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIGlmIChlbmFibGUgPT09IHZvaWQgMCkgeyBlbmFibGUgPSB0cnVlOyB9XHJcbiAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sZWdhY3kgPSBsZWdhY3k7XHJcbiAgICAgICAgICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5sZWdhY3kucHJvaiA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uLnByb3RvdHlwZSwgXCJlbmFibGVkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUHJvamVjdGlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvbjtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbiA9IFByb2plY3Rpb247XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciB3ZWJnbDtcclxuICAgIChmdW5jdGlvbiAod2ViZ2wpIHtcclxuICAgICAgICB2YXIgQmF0Y2hCdWZmZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBCYXRjaEJ1ZmZlcihzaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzID0gbmV3IEFycmF5QnVmZmVyKHNpemUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG9hdDMyVmlldyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVpbnQzMlZpZXcgPSBuZXcgVWludDMyQXJyYXkodGhpcy52ZXJ0aWNlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQmF0Y2hCdWZmZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2VzID0gbnVsbDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIEJhdGNoQnVmZmVyO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgd2ViZ2wuQmF0Y2hCdWZmZXIgPSBCYXRjaEJ1ZmZlcjtcclxuICAgIH0pKHdlYmdsID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsIHx8IChwaXhpX3Byb2plY3Rpb24ud2ViZ2wgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgd2ViZ2w7XHJcbiAgICAoZnVuY3Rpb24gKHdlYmdsKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXIodmVydGV4U3JjLCBmcmFnbWVudFNyYywgZ2wsIG1heFRleHR1cmVzKSB7XHJcbiAgICAgICAgICAgIGZyYWdtZW50U3JjID0gZnJhZ21lbnRTcmMucmVwbGFjZSgvJWNvdW50JS9naSwgbWF4VGV4dHVyZXMgKyAnJyk7XHJcbiAgICAgICAgICAgIGZyYWdtZW50U3JjID0gZnJhZ21lbnRTcmMucmVwbGFjZSgvJWZvcmxvb3AlL2dpLCBnZW5lcmF0ZVNhbXBsZVNyYyhtYXhUZXh0dXJlcykpO1xyXG4gICAgICAgICAgICB2YXIgc2hhZGVyID0gbmV3IFBJWEkuU2hhZGVyKGdsLCB2ZXJ0ZXhTcmMsIGZyYWdtZW50U3JjKTtcclxuICAgICAgICAgICAgdmFyIHNhbXBsZVZhbHVlcyA9IG5ldyBJbnQzMkFycmF5KG1heFRleHR1cmVzKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhUZXh0dXJlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBzYW1wbGVWYWx1ZXNbaV0gPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNoYWRlci5iaW5kKCk7XHJcbiAgICAgICAgICAgIHNoYWRlci51bmlmb3Jtcy51U2FtcGxlcnMgPSBzYW1wbGVWYWx1ZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdlYmdsLmdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyID0gZ2VuZXJhdGVNdWx0aVRleHR1cmVTaGFkZXI7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTYW1wbGVTcmMobWF4VGV4dHVyZXMpIHtcclxuICAgICAgICAgICAgdmFyIHNyYyA9ICcnO1xyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhUZXh0dXJlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzcmMgKz0gJ1xcbmVsc2UgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpIDwgbWF4VGV4dHVyZXMgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjICs9IFwiaWYodGV4dHVyZUlkID09IFwiICsgaSArIFwiLjApXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzcmMgKz0gJ1xcbnsnO1xyXG4gICAgICAgICAgICAgICAgc3JjICs9IFwiXFxuXFx0Y29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXJzW1wiICsgaSArIFwiXSwgdGV4dHVyZUNvb3JkKTtcIjtcclxuICAgICAgICAgICAgICAgIHNyYyArPSAnXFxufSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIHJldHVybiBzcmM7XHJcbiAgICAgICAgfVxyXG4gICAgfSkod2ViZ2wgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wgfHwgKHBpeGlfcHJvamVjdGlvbi53ZWJnbCA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgd2ViZ2w7XHJcbiAgICAoZnVuY3Rpb24gKHdlYmdsKSB7XHJcbiAgICAgICAgdmFyIE9iamVjdFJlbmRlcmVyID0gUElYSS5PYmplY3RSZW5kZXJlcjtcclxuICAgICAgICB2YXIgc2V0dGluZ3MgPSBQSVhJLnNldHRpbmdzO1xyXG4gICAgICAgIHZhciBHTEJ1ZmZlciA9IFBJWEkuZ2xDb3JlLkdMQnVmZmVyO1xyXG4gICAgICAgIHZhciBwcmVtdWx0aXBseVRpbnQgPSBQSVhJLnV0aWxzLnByZW11bHRpcGx5VGludDtcclxuICAgICAgICB2YXIgcHJlbXVsdGlwbHlCbGVuZE1vZGUgPSBQSVhJLnV0aWxzLnByZW11bHRpcGx5QmxlbmRNb2RlO1xyXG4gICAgICAgIHZhciBUSUNLID0gMDtcclxuICAgICAgICB2YXIgQmF0Y2hHcm91cCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEJhdGNoR3JvdXAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlkcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaXplID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibGVuZCA9IFBJWEkuQkxFTkRfTU9ERVMuTk9STUFMO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51bmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhdGNoR3JvdXA7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICB3ZWJnbC5CYXRjaEdyb3VwID0gQmF0Y2hHcm91cDtcclxuICAgICAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICBfX2V4dGVuZHMoTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKHJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCByZW5kZXJlcikgfHwgdGhpcztcclxuICAgICAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSAnJztcclxuICAgICAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSAnJztcclxuICAgICAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFU19MT0NBTCA9IDMyO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydFNpemUgPSA1O1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydEJ5dGVTaXplID0gX3RoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2l6ZSA9IHNldHRpbmdzLlNQUklURV9CQVRDSF9TSVpFO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuY3VycmVudEluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNwcml0ZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRleEJ1ZmZlcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZhb3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZhb01heCA9IDI7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0ZXhDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVMgPSAxO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuaW5kaWNlcyA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5jcmVhdGVJbmRpY2VzRm9yUXVhZHMoX3RoaXMuc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ncm91cHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgX3RoaXMuc2l6ZTsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZ3JvdXBzW2tdID0gbmV3IEJhdGNoR3JvdXAoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF90aGlzLnZhb01heCA9IDI7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0ZXhDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW5kZXJlci5vbigncHJlcmVuZGVyJywgX3RoaXMub25QcmVyZW5kZXIsIF90aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuZ2V0VW5pZm9ybXMgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnN5bmNVbmlmb3JtcyA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmICghb2JqKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHZhciBzaCA9IHRoaXMuc2hhZGVyO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoLnVuaWZvcm1zW2tleV0gPSBvYmpba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLm9uQ29udGV4dENoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk1BWF9URVhUVVJFUyA9IE1hdGgubWluKHRoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMLCB0aGlzLnJlbmRlcmVyLnBsdWdpbnNbJ3Nwcml0ZSddLk1BWF9URVhUVVJFUyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoYWRlciA9IHdlYmdsLmdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyKHRoaXMuc2hhZGVyVmVydCwgdGhpcy5zaGFkZXJGcmFnLCBnbCwgdGhpcy5NQVhfVEVYVFVSRVMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IEdMQnVmZmVyLmNyZWF0ZUluZGV4QnVmZmVyKGdsLCB0aGlzLmluZGljZXMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFZhbyhudWxsKTtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmFvTWF4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmVydGV4QnVmZmVyID0gdGhpcy52ZXJ0ZXhCdWZmZXJzW2ldID0gR0xCdWZmZXIuY3JlYXRlVmVydGV4QnVmZmVyKGdsLCBudWxsLCBnbC5TVFJFQU1fRFJBVyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9zW2ldID0gdGhpcy5jcmVhdGVWYW8odmVydGV4QnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5idWZmZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLm5leHRQb3cyKHRoaXMuc2l6ZSk7IGkgKj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcnMucHVzaChuZXcgd2ViZ2wuQmF0Y2hCdWZmZXIoaSAqIDQgKiB0aGlzLnZlcnRCeXRlU2l6ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudmFvID0gdGhpcy52YW9zWzBdO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUub25QcmVyZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleENvdW50ID0gMDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbmRleCA+PSB0aGlzLnNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsdXNoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNwcml0ZS5fdGV4dHVyZS5fdXZzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFzcHJpdGUuX3RleHR1cmUuYmFzZVRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZXNbdGhpcy5jdXJyZW50SW5kZXgrK10gPSBzcHJpdGU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5mbHVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgICAgICB2YXIgTUFYX1RFWFRVUkVTID0gdGhpcy5NQVhfVEVYVFVSRVM7XHJcbiAgICAgICAgICAgICAgICB2YXIgbnAyID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLm5leHRQb3cyKHRoaXMuY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgICAgIHZhciBsb2cyID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLmxvZzIobnAyKTtcclxuICAgICAgICAgICAgICAgIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlcnNbbG9nMl07XHJcbiAgICAgICAgICAgICAgICB2YXIgc3ByaXRlcyA9IHRoaXMuc3ByaXRlcztcclxuICAgICAgICAgICAgICAgIHZhciBncm91cHMgPSB0aGlzLmdyb3VwcztcclxuICAgICAgICAgICAgICAgIHZhciBmbG9hdDMyVmlldyA9IGJ1ZmZlci5mbG9hdDMyVmlldztcclxuICAgICAgICAgICAgICAgIHZhciB1aW50MzJWaWV3ID0gYnVmZmVyLnVpbnQzMlZpZXc7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRVbmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBDb3VudCA9IDE7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50R3JvdXAgPSBncm91cHNbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdmVydGV4RGF0YTtcclxuICAgICAgICAgICAgICAgIHZhciB1dnM7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmxlbmRNb2RlID0gcHJlbXVsdGlwbHlCbGVuZE1vZGVbc3ByaXRlc1swXS5fdGV4dHVyZS5iYXNlVGV4dHVyZS5wcmVtdWx0aXBsaWVkQWxwaGEgPyAxIDogMF1bc3ByaXRlc1swXS5ibGVuZE1vZGVdO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc3RhcnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLmJsZW5kID0gYmxlbmRNb2RlO1xyXG4gICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5jdXJyZW50SW5kZXg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcHJpdGUgPSBzcHJpdGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRUZXh0dXJlID0gc3ByaXRlLl90ZXh0dXJlLmJhc2VUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcHJpdGVCbGVuZE1vZGUgPSBwcmVtdWx0aXBseUJsZW5kTW9kZVtOdW1iZXIobmV4dFRleHR1cmUucHJlbXVsdGlwbGllZEFscGhhKV1bc3ByaXRlLmJsZW5kTW9kZV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsZW5kTW9kZSAhPT0gc3ByaXRlQmxlbmRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZSA9IHNwcml0ZUJsZW5kTW9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQgPSBNQVhfVEVYVFVSRVM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVuaWZvcm1zID0gdGhpcy5nZXRVbmlmb3JtcyhzcHJpdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VW5pZm9ybXMgIT09IHVuaWZvcm1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVbmlmb3JtcyA9IHVuaWZvcm1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCA9IE1BWF9URVhUVVJFUztcclxuICAgICAgICAgICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRleHR1cmUgIT09IG5leHRUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUZXh0dXJlID0gbmV4dFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0VGV4dHVyZS5fZW5hYmxlZCAhPT0gVElDSykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHR1cmVDb3VudCA9PT0gTUFYX1RFWFRVUkVTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVElDSysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnNpemUgPSBpIC0gY3VycmVudEdyb3VwLnN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cCA9IGdyb3Vwc1tncm91cENvdW50KytdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC50ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5ibGVuZCA9IGJsZW5kTW9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuc3RhcnQgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC51bmlmb3JtcyA9IGN1cnJlbnRVbmlmb3JtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRUZXh0dXJlLl9lbmFibGVkID0gVElDSztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRUZXh0dXJlLl92aXJ0YWxCb3VuZElkID0gdGV4dHVyZUNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnRleHR1cmVzW2N1cnJlbnRHcm91cC50ZXh0dXJlQ291bnQrK10gPSBuZXh0VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbHBoYSA9IE1hdGgubWluKHNwcml0ZS53b3JsZEFscGhhLCAxLjApO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdiID0gYWxwaGEgPCAxLjAgJiYgbmV4dFRleHR1cmUucHJlbXVsdGlwbGllZEFscGhhID8gcHJlbXVsdGlwbHlUaW50KHNwcml0ZS5fdGludFJHQiwgYWxwaGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogc3ByaXRlLl90aW50UkdCICsgKGFscGhhICogMjU1IDw8IDI0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGxWZXJ0aWNlcyhmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgbmV4dFRleHR1cmUuX3ZpcnRhbEJvdW5kSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ICs9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnNpemUgPSBpIC0gY3VycmVudEdyb3VwLnN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzZXR0aW5ncy5DQU5fVVBMT0FEX1NBTUVfQlVGRkVSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFvTWF4IDw9IHRoaXMudmVydGV4Q291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9NYXgrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZlcnRleEJ1ZmZlciA9IHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XSA9IEdMQnVmZmVyLmNyZWF0ZVZlcnRleEJ1ZmZlcihnbCwgbnVsbCwgZ2wuU1RSRUFNX0RSQVcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb3NbdGhpcy52ZXJ0ZXhDb3VudF0gPSB0aGlzLmNyZWF0ZVZhbyh2ZXJ0ZXhCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRWYW8odGhpcy52YW9zW3RoaXMudmVydGV4Q291bnRdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0udXBsb2FkKGJ1ZmZlci52ZXJ0aWNlcywgMCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4Q291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XS51cGxvYWQoYnVmZmVyLnZlcnRpY2VzLCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRVbmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBncm91cFRleHR1cmVDb3VudCA9IGdyb3VwLnRleHR1cmVDb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXAudW5pZm9ybXMgIT09IGN1cnJlbnRVbmlmb3Jtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN5bmNVbmlmb3Jtcyhncm91cC51bmlmb3Jtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZ3JvdXBUZXh0dXJlQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRUZXh0dXJlKGdyb3VwLnRleHR1cmVzW2pdLCBqLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAudGV4dHVyZXNbal0uX3ZpcnRhbEJvdW5kSWQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSB0aGlzLnNoYWRlci51bmlmb3Jtcy5zYW1wbGVyU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZbMF0gPSBncm91cC50ZXh0dXJlc1tqXS5yZWFsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2WzFdID0gZ3JvdXAudGV4dHVyZXNbal0ucmVhbEhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyLnVuaWZvcm1zLnNhbXBsZXJTaXplID0gdjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnN0YXRlLnNldEJsZW5kTW9kZShncm91cC5ibGVuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKGdsLlRSSUFOR0xFUywgZ3JvdXAuc2l6ZSAqIDYsIGdsLlVOU0lHTkVEX1NIT1JULCBncm91cC5zdGFydCAqIDYgKiAyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gMDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kU2hhZGVyKHRoaXMuc2hhZGVyKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5DQU5fVVBMT0FEX1NBTUVfQlVGRkVSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVmFvKHRoaXMudmFvc1t0aGlzLnZlcnRleENvdW50XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdLmJpbmQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZhb01heDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGV4QnVmZmVyc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YW9zW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFvc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4QnVmZmVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIub2ZmKCdwcmVyZW5kZXInLCB0aGlzLm9uUHJlcmVuZGVyLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVycyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhb3MgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGljZXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idWZmZXJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgICAgIH0oT2JqZWN0UmVuZGVyZXIpKTtcclxuICAgICAgICB3ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyO1xyXG4gICAgfSkod2ViZ2wgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wgfHwgKHBpeGlfcHJvamVjdGlvbi53ZWJnbCA9IHt9KSk7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBwID0gW25ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCldO1xyXG4gICAgdmFyIGEgPSBbMCwgMCwgMCwgMF07XHJcbiAgICB2YXIgU3VyZmFjZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gU3VyZmFjZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJmYWNlSUQgPSBcImRlZmF1bHRcIjtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSUQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRleFNyYyA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhZ21lbnRTcmMgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTdXJmYWNlLnByb3RvdHlwZS5maWxsVW5pZm9ybXMgPSBmdW5jdGlvbiAodW5pZm9ybXMpIHtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3VyZmFjZS5wcm90b3R5cGUuYm91bmRzUXVhZCA9IGZ1bmN0aW9uICh2LCBvdXQsIGFmdGVyKSB7XHJcbiAgICAgICAgICAgIHZhciBtaW5YID0gb3V0WzBdLCBtaW5ZID0gb3V0WzFdO1xyXG4gICAgICAgICAgICB2YXIgbWF4WCA9IG91dFswXSwgbWF4WSA9IG91dFsxXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDI7IGkgPCA4OyBpICs9IDIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtaW5YID4gb3V0W2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIG1pblggPSBvdXRbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4WCA8IG91dFtpXSlcclxuICAgICAgICAgICAgICAgICAgICBtYXhYID0gb3V0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pblkgPiBvdXRbaSArIDFdKVxyXG4gICAgICAgICAgICAgICAgICAgIG1pblkgPSBvdXRbaSArIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1heFkgPCBvdXRbaSArIDFdKVxyXG4gICAgICAgICAgICAgICAgICAgIG1heFkgPSBvdXRbaSArIDFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBbMF0uc2V0KG1pblgsIG1pblkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbMF0sIHBbMF0pO1xyXG4gICAgICAgICAgICBwWzFdLnNldChtYXhYLCBtaW5ZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzFdLCBwWzFdKTtcclxuICAgICAgICAgICAgcFsyXS5zZXQobWF4WCwgbWF4WSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFsyXSwgcFsyXSk7XHJcbiAgICAgICAgICAgIHBbM10uc2V0KG1pblgsIG1heFkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbM10sIHBbM10pO1xyXG4gICAgICAgICAgICBpZiAoYWZ0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbMF0sIHBbMF0pO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFsxXSwgcFsxXSk7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzJdLCBwWzJdKTtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbM10sIHBbM10pO1xyXG4gICAgICAgICAgICAgICAgb3V0WzBdID0gcFswXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzFdID0gcFswXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzJdID0gcFsxXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzNdID0gcFsxXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzRdID0gcFsyXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzVdID0gcFsyXS55O1xyXG4gICAgICAgICAgICAgICAgb3V0WzZdID0gcFszXS54O1xyXG4gICAgICAgICAgICAgICAgb3V0WzddID0gcFszXS55O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBbaV0ueSA8IHBbMF0ueSB8fCBwW2ldLnkgPT0gcFswXS55ICYmIHBbaV0ueCA8IHBbMF0ueCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IHBbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBbMF0gPSBwW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwW2ldID0gdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhW2ldID0gTWF0aC5hdGFuMihwW2ldLnkgLSBwWzBdLnksIHBbaV0ueCAtIHBbMF0ueCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gaSArIDE7IGogPD0gMzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhW2ldID4gYVtqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBwW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFtpXSA9IHBbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwW2pdID0gdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0MiA9IGFbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhW2ldID0gYVtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFbal0gPSB0MjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dFswXSA9IHBbMF0ueDtcclxuICAgICAgICAgICAgICAgIG91dFsxXSA9IHBbMF0ueTtcclxuICAgICAgICAgICAgICAgIG91dFsyXSA9IHBbMV0ueDtcclxuICAgICAgICAgICAgICAgIG91dFszXSA9IHBbMV0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs0XSA9IHBbMl0ueDtcclxuICAgICAgICAgICAgICAgIG91dFs1XSA9IHBbMl0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs2XSA9IHBbM10ueDtcclxuICAgICAgICAgICAgICAgIG91dFs3XSA9IHBbM10ueTtcclxuICAgICAgICAgICAgICAgIGlmICgocFszXS54IC0gcFsyXS54KSAqIChwWzFdLnkgLSBwWzJdLnkpIC0gKHBbMV0ueCAtIHBbMl0ueCkgKiAocFszXS55IC0gcFsyXS55KSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRbNF0gPSBwWzNdLng7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0WzVdID0gcFszXS55O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFN1cmZhY2U7XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlN1cmZhY2UgPSBTdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgdmFyIHRlbXBSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKCk7XHJcbiAgICB2YXIgdGVtcFBvaW50ID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgIHZhciBCaWxpbmVhclN1cmZhY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhCaWxpbmVhclN1cmZhY2UsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gQmlsaW5lYXJTdXJmYWNlKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5kaXN0b3J0aW9uID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3RvcnRpb24uc2V0KDAsIDApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGQgPSB0aGlzLmRpc3RvcnRpb247XHJcbiAgICAgICAgICAgIHZhciBtID0gcG9zLnggKiBwb3MueTtcclxuICAgICAgICAgICAgbmV3UG9zLnggPSBwb3MueCArIGQueCAqIG07XHJcbiAgICAgICAgICAgIG5ld1Bvcy55ID0gcG9zLnkgKyBkLnkgKiBtO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciB2eCA9IHBvcy54LCB2eSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgZHggPSB0aGlzLmRpc3RvcnRpb24ueCwgZHkgPSB0aGlzLmRpc3RvcnRpb24ueTtcclxuICAgICAgICAgICAgaWYgKGR4ID09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB2eDtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdnkgLyAoMS4wICsgZHkgKiB2eCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZHkgPT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHZ5O1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB2eCAvICgxLjAgKyBkeCAqIHZ5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gKHZ5ICogZHggLSB2eCAqIGR5ICsgMS4wKSAqIDAuNSAvIGR5O1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSBiICogYiArIHZ4IC8gZHk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZCA8PSAwLjAwMDAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnNldChOYU4sIE5hTik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGR5ID4gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zLnggPSAtYiArIE1hdGguc3FydChkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gLWIgLSBNYXRoLnNxcnQoZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9ICh2eCAvIG5ld1Bvcy54IC0gMS4wKSAvIGR4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLm1hcFNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSAtc3ByaXRlLmFuY2hvci54ICogdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnkgPSAtc3ByaXRlLmFuY2hvci55ICogdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC53aWR0aCA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcFF1YWQodGVtcFJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSB8fCBzcHJpdGUudHJhbnNmb3JtKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUubWFwUXVhZCA9IGZ1bmN0aW9uIChyZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIGF4ID0gLXJlY3QueCAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheSA9IC1yZWN0LnkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4MiA9ICgxLjAgLSByZWN0LngpIC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5MiA9ICgxLjAgLSByZWN0LnkpIC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciB1cDF4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDF5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDJ4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheDIpICsgcXVhZFsxXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHVwMnkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgeDAwID0gdXAxeCAqICgxLjAgLSBheSkgKyBkb3duMXggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkwMCA9IHVwMXkgKiAoMS4wIC0gYXkpICsgZG93bjF5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MTAgPSB1cDJ4ICogKDEuMCAtIGF5KSArIGRvd24yeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTEwID0gdXAyeSAqICgxLjAgLSBheSkgKyBkb3duMnkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgwMSA9IHVwMXggKiAoMS4wIC0gYXkyKSArIGRvd24xeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkwMSA9IHVwMXkgKiAoMS4wIC0gYXkyKSArIGRvd24xeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHgxMSA9IHVwMnggKiAoMS4wIC0gYXkyKSArIGRvd24yeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkxMSA9IHVwMnkgKiAoMS4wIC0gYXkyKSArIGRvd24yeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIG1hdCA9IHRlbXBNYXQ7XHJcbiAgICAgICAgICAgIG1hdC50eCA9IHgwMDtcclxuICAgICAgICAgICAgbWF0LnR5ID0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYSA9IHgxMCAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmIgPSB5MTAgLSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5jID0geDAxIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuZCA9IHkwMSAtIHkwMDtcclxuICAgICAgICAgICAgdGVtcFBvaW50LnNldCh4MTEsIHkxMSk7XHJcbiAgICAgICAgICAgIG1hdC5hcHBseUludmVyc2UodGVtcFBvaW50LCB0ZW1wUG9pbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3RvcnRpb24uc2V0KHRlbXBQb2ludC54IC0gMSwgdGVtcFBvaW50LnkgLSAxKTtcclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNldEZyb21NYXRyaXgobWF0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLmZpbGxVbmlmb3JtcyA9IGZ1bmN0aW9uICh1bmlmb3Jtcykge1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uID0gdW5pZm9ybXMuZGlzdG9ydGlvbiB8fCBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAwXSk7XHJcbiAgICAgICAgICAgIHZhciBheCA9IE1hdGguYWJzKHRoaXMuZGlzdG9ydGlvbi54KTtcclxuICAgICAgICAgICAgdmFyIGF5ID0gTWF0aC5hYnModGhpcy5kaXN0b3J0aW9uLnkpO1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzBdID0gYXggKiAxMDAwMCA8PSBheSA/IDAgOiB0aGlzLmRpc3RvcnRpb24ueDtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblsxXSA9IGF5ICogMTAwMDAgPD0gYXggPyAwIDogdGhpcy5kaXN0b3J0aW9uLnk7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bMl0gPSAxLjAgLyB1bmlmb3Jtcy5kaXN0b3J0aW9uWzBdO1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzNdID0gMS4wIC8gdW5pZm9ybXMuZGlzdG9ydGlvblsxXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBCaWxpbmVhclN1cmZhY2U7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5TdXJmYWNlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uQmlsaW5lYXJTdXJmYWNlID0gQmlsaW5lYXJTdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgQ29udGFpbmVyMnMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhDb250YWluZXIycywgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBDb250YWluZXIycygpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29udGFpbmVyMnMucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gQ29udGFpbmVyMnM7XHJcbiAgICB9KFBJWEkuQ29udGFpbmVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uQ29udGFpbmVyMnMgPSBDb250YWluZXIycztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIGZ1biA9IFBJWEkuVHJhbnNmb3JtU3RhdGljLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1IYWNrKHBhcmVudFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZhciBwcm9qID0gdGhpcy5wcm9qO1xyXG4gICAgICAgIHZhciBwcCA9IHBhcmVudFRyYW5zZm9ybS5wcm9qO1xyXG4gICAgICAgIHZhciB0YSA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCFwcCkge1xyXG4gICAgICAgICAgICBmdW4uY2FsbCh0aGlzLCBwYXJlbnRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocHAuX3N1cmZhY2UpIHtcclxuICAgICAgICAgICAgcHJvai5fYWN0aXZlUHJvamVjdGlvbiA9IHBwO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxvY2FsVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxUcmFuc2Zvcm0uY29weSh0aGlzLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgaWYgKHRhLl9wYXJlbnRJRCA8IDApIHtcclxuICAgICAgICAgICAgICAgICsrdGEuX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW4uY2FsbCh0aGlzLCBwYXJlbnRUcmFuc2Zvcm0pO1xyXG4gICAgICAgIHByb2ouX2FjdGl2ZVByb2plY3Rpb24gPSBwcC5fYWN0aXZlUHJvamVjdGlvbjtcclxuICAgIH1cclxuICAgIHZhciBQcm9qZWN0aW9uU3VyZmFjZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFByb2plY3Rpb25TdXJmYWNlLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb25TdXJmYWNlKGxlZ2FjeSwgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGxlZ2FjeSwgZW5hYmxlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5fc3VyZmFjZSA9IG51bGw7XHJcbiAgICAgICAgICAgIF90aGlzLl9hY3RpdmVQcm9qZWN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnRTdXJmYWNlSUQgPSAtMTtcclxuICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnRMZWdhY3lJRCA9IC0xO1xyXG4gICAgICAgICAgICBfdGhpcy5fbGFzdFVuaWZvcm1zID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLCBcImVuYWJsZWRcIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl9lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gdHJhbnNmb3JtSGFjaztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IFBJWEkuVHJhbnNmb3JtU3RhdGljLnByb3RvdHlwZS51cGRhdGVUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUsIFwic3VyZmFjZVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1cmZhY2U7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSA9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1cmZhY2UgPSB2YWx1ZSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5hcHBseVBhcnRpYWwgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdXJmYWNlLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVByb2plY3Rpb24ubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5zdXJmYWNlLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5hcHBseUludmVyc2UgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVByb2plY3Rpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMuX2FjdGl2ZVByb2plY3Rpb24ubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLl9zdXJmYWNlLmFwcGx5SW52ZXJzZShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKHBvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdXJmYWNlLmFwcGx5SW52ZXJzZShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUubWFwQmlsaW5lYXJTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkKSB7XHJcbiAgICAgICAgICAgIGlmICghKHRoaXMuX3N1cmZhY2UgaW5zdGFuY2VvZiBwaXhpX3Byb2plY3Rpb24uQmlsaW5lYXJTdXJmYWNlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJmYWNlID0gbmV3IHBpeGlfcHJvamVjdGlvbi5CaWxpbmVhclN1cmZhY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cmZhY2UubWFwU3ByaXRlKHNwcml0ZSwgcXVhZCwgdGhpcy5sZWdhY3kpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cmZhY2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZSwgXCJ1bmlmb3Jtc1wiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRMZWdhY3lJRCA9PT0gdGhpcy5sZWdhY3kuX3dvcmxkSUQgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50U3VyZmFjZUlEID09PSB0aGlzLnN1cmZhY2UuX3VwZGF0ZUlEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3RVbmlmb3JtcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RVbmlmb3JtcyA9IHRoaXMuX2xhc3RVbmlmb3JtcyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RVbmlmb3Jtcy53b3JsZFRyYW5zZm9ybSA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLnRvQXJyYXkodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXJmYWNlLmZpbGxVbmlmb3Jtcyh0aGlzLl9sYXN0VW5pZm9ybXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3RVbmlmb3JtcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb25TdXJmYWNlO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlID0gUHJvamVjdGlvblN1cmZhY2U7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIHZhciBTcHJpdGVCaWxpbmVhclJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlQmlsaW5lYXJSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGVCaWxpbmVhclJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuc2l6ZSA9IDEwMDtcclxuICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMID0gMTtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMxO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczI7XFxuYXR0cmlidXRlIHZlYzQgYUZyYW1lO1xcbmF0dHJpYnV0ZSB2ZWM0IGFDb2xvcjtcXG5hdHRyaWJ1dGUgZmxvYXQgYVRleHR1cmVJZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgd29ybGRUcmFuc2Zvcm07XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiB3b3JsZFRyYW5zZm9ybSAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcbiAgICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG4gICAgdlRyYW5zMSA9IGFUcmFuczE7XFxuICAgIHZUcmFuczIgPSBhVHJhbnMyO1xcbiAgICB2VGV4dHVyZUlkID0gYVRleHR1cmVJZDtcXG4gICAgdkNvbG9yID0gYUNvbG9yO1xcbiAgICB2RnJhbWUgPSBhRnJhbWU7XFxufVxcblwiO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcnNbJWNvdW50JV07XFxudW5pZm9ybSB2ZWMyIHNhbXBsZXJTaXplWyVjb3VudCVdOyBcXG51bmlmb3JtIHZlYzQgZGlzdG9ydGlvbjtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxudmVjMiBzdXJmYWNlO1xcbnZlYzIgc3VyZmFjZTI7XFxuXFxuZmxvYXQgdnggPSB2VGV4dHVyZUNvb3JkLng7XFxuZmxvYXQgdnkgPSB2VGV4dHVyZUNvb3JkLnk7XFxuZmxvYXQgZHggPSBkaXN0b3J0aW9uLng7XFxuZmxvYXQgZHkgPSBkaXN0b3J0aW9uLnk7XFxuZmxvYXQgcmV2eCA9IGRpc3RvcnRpb24uejtcXG5mbG9hdCByZXZ5ID0gZGlzdG9ydGlvbi53O1xcblxcbmlmIChkaXN0b3J0aW9uLnggPT0gMC4wKSB7XFxuICAgIHN1cmZhY2UueCA9IHZ4O1xcbiAgICBzdXJmYWNlLnkgPSB2eSAvICgxLjAgKyBkeSAqIHZ4KTtcXG4gICAgc3VyZmFjZTIgPSBzdXJmYWNlO1xcbn0gZWxzZVxcbmlmIChkaXN0b3J0aW9uLnkgPT0gMC4wKSB7XFxuICAgIHN1cmZhY2UueSA9IHZ5O1xcbiAgICBzdXJmYWNlLnggPSB2eC8gKDEuMCArIGR4ICogdnkpO1xcbiAgICBzdXJmYWNlMiA9IHN1cmZhY2U7XFxufSBlbHNlIHtcXG4gICAgZmxvYXQgYyA9IHZ5ICogZHggLSB2eCAqIGR5O1xcbiAgICBmbG9hdCBiID0gKGMgKyAxLjApICogMC41O1xcbiAgICBmbG9hdCBiMiA9ICgtYyArIDEuMCkgKiAwLjU7XFxuICAgIGZsb2F0IGQgPSBiICogYiArIHZ4ICogZHk7XFxuICAgIGlmIChkIDwgLTAuMDAwMDEpIHtcXG4gICAgICAgIGRpc2NhcmQ7XFxuICAgIH1cXG4gICAgZCA9IHNxcnQobWF4KGQsIDAuMCkpO1xcbiAgICBzdXJmYWNlLnggPSAoLSBiICsgZCkgKiByZXZ5O1xcbiAgICBzdXJmYWNlMi54ID0gKC0gYiAtIGQpICogcmV2eTtcXG4gICAgc3VyZmFjZS55ID0gKC0gYjIgKyBkKSAqIHJldng7XFxuICAgIHN1cmZhY2UyLnkgPSAoLSBiMiAtIGQpICogcmV2eDtcXG59XFxuXFxudmVjMiB1djtcXG51di54ID0gdlRyYW5zMS54ICogc3VyZmFjZS54ICsgdlRyYW5zMS55ICogc3VyZmFjZS55ICsgdlRyYW5zMS56O1xcbnV2LnkgPSB2VHJhbnMyLnggKiBzdXJmYWNlLnggKyB2VHJhbnMyLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMyLno7XFxuXFxudmVjMiBwaXhlbHMgPSB1diAqIHNhbXBsZXJTaXplWzBdO1xcblxcbmlmIChwaXhlbHMueCA8IHZGcmFtZS54IHx8IHBpeGVscy54ID4gdkZyYW1lLnogfHxcXG4gICAgcGl4ZWxzLnkgPCB2RnJhbWUueSB8fCBwaXhlbHMueSA+IHZGcmFtZS53KSB7XFxuICAgIHV2LnggPSB2VHJhbnMxLnggKiBzdXJmYWNlMi54ICsgdlRyYW5zMS55ICogc3VyZmFjZTIueSArIHZUcmFuczEuejtcXG4gICAgdXYueSA9IHZUcmFuczIueCAqIHN1cmZhY2UyLnggKyB2VHJhbnMyLnkgKiBzdXJmYWNlMi55ICsgdlRyYW5zMi56O1xcbiAgICBwaXhlbHMgPSB1diAqIHNhbXBsZXJTaXplWzBdO1xcbiAgICBcXG4gICAgaWYgKHBpeGVscy54IDwgdkZyYW1lLnggfHwgcGl4ZWxzLnggPiB2RnJhbWUueiB8fFxcbiAgICAgICAgcGl4ZWxzLnkgPCB2RnJhbWUueSB8fCBwaXhlbHMueSA+IHZGcmFtZS53KSB7XFxuICAgICAgICBkaXNjYXJkO1xcbiAgICB9XFxufVxcblxcbnZlYzQgZWRnZTtcXG5lZGdlLnh5ID0gY2xhbXAocGl4ZWxzIC0gdkZyYW1lLnh5ICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcbmVkZ2UuencgPSBjbGFtcCh2RnJhbWUuencgLSBwaXhlbHMgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuXFxuZmxvYXQgYWxwaGEgPSAxLjA7IC8vZWRnZS54ICogZWRnZS55ICogZWRnZS56ICogZWRnZS53O1xcbnZlYzQgckNvbG9yID0gdkNvbG9yICogYWxwaGE7XFxuXFxuZmxvYXQgdGV4dHVyZUlkID0gZmxvb3IodlRleHR1cmVJZCswLjUpO1xcbnZlYzQgY29sb3I7XFxudmVjMiB0ZXh0dXJlQ29vcmQgPSB1djtcXG4lZm9ybG9vcCVcXG5nbF9GcmFnQ29sb3IgPSBjb2xvciAqIHJDb2xvcjtcXG59XCI7XHJcbiAgICAgICAgICAgIF90aGlzLmRlZlVuaWZvcm1zID0ge1xyXG4gICAgICAgICAgICAgICAgd29ybGRUcmFuc2Zvcm06IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdKSxcclxuICAgICAgICAgICAgICAgIGRpc3RvcnRpb246IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDBdKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIucHJvdG90eXBlLmdldFVuaWZvcm1zID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvaiA9IHNwcml0ZS5wcm9qO1xyXG4gICAgICAgICAgICB2YXIgc2hhZGVyID0gdGhpcy5zaGFkZXI7XHJcbiAgICAgICAgICAgIGlmIChwcm9qLnN1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9qLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai5fYWN0aXZlUHJvamVjdGlvbi51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZVbmlmb3JtcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZVZhbyA9IGZ1bmN0aW9uICh2ZXJ0ZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgdGhpcy52ZXJ0U2l6ZSA9IDE0O1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRCeXRlU2l6ZSA9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB2YXIgdmFvID0gdGhpcy5yZW5kZXJlci5jcmVhdGVWYW8oKVxyXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KHRoaXMuaW5kZXhCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVZlcnRleFBvc2l0aW9uLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAwKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczEsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDIgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczIsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDUgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFGcmFtZSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgOCAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUNvbG9yLCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTIgKiA0KTtcclxuICAgICAgICAgICAgaWYgKGF0dHJzLmFUZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgICAgIHZhby5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUlkLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAxMyAqIDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YW87XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVCaWxpbmVhclJlbmRlcmVyLnByb3RvdHlwZS5maWxsVmVydGljZXMgPSBmdW5jdGlvbiAoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIHRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHNwcml0ZS52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgdyA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4ID0gc3ByaXRlLl9hbmNob3IuX3g7XHJcbiAgICAgICAgICAgIHZhciBheSA9IHNwcml0ZS5fYW5jaG9yLl95O1xyXG4gICAgICAgICAgICB2YXIgZnJhbWUgPSB0ZXguX2ZyYW1lO1xyXG4gICAgICAgICAgICB2YXIgYVRyYW5zID0gc3ByaXRlLmFUcmFucztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbaSAqIDJdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbaSAqIDIgKyAxXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSBhVHJhbnMuYTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgM10gPSBhVHJhbnMuYztcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNF0gPSBhVHJhbnMudHg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDVdID0gYVRyYW5zLmI7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gYVRyYW5zLmQ7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gYVRyYW5zLnR5O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IGZyYW1lLng7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDldID0gZnJhbWUueTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTBdID0gZnJhbWUueCArIGZyYW1lLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMV0gPSBmcmFtZS55ICsgZnJhbWUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDEyXSA9IGFyZ2I7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHRleHR1cmVJZDtcclxuICAgICAgICAgICAgICAgIGluZGV4ICs9IDE0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlQmlsaW5lYXJSZW5kZXJlcjtcclxuICAgIH0oTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIpKTtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignc3ByaXRlX2JpbGluZWFyJywgU3ByaXRlQmlsaW5lYXJSZW5kZXJlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIHZhciBTcHJpdGVTdHJhbmdlUmVuZGVyZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGVTdHJhbmdlUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlU3RyYW5nZVJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuc2l6ZSA9IDEwMDtcclxuICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTX0xPQ0FMID0gMTtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMxO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUcmFuczI7XFxuYXR0cmlidXRlIHZlYzQgYUZyYW1lO1xcbmF0dHJpYnV0ZSB2ZWM0IGFDb2xvcjtcXG5hdHRyaWJ1dGUgZmxvYXQgYVRleHR1cmVJZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgd29ybGRUcmFuc2Zvcm07XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiB3b3JsZFRyYW5zZm9ybSAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcbiAgICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG4gICAgdlRyYW5zMSA9IGFUcmFuczE7XFxuICAgIHZUcmFuczIgPSBhVHJhbnMyO1xcbiAgICB2VGV4dHVyZUlkID0gYVRleHR1cmVJZDtcXG4gICAgdkNvbG9yID0gYUNvbG9yO1xcbiAgICB2RnJhbWUgPSBhRnJhbWU7XFxufVxcblwiO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZUcmFuczE7XFxudmFyeWluZyB2ZWMzIHZUcmFuczI7XFxudmFyeWluZyB2ZWM0IHZGcmFtZTtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcnNbJWNvdW50JV07XFxudW5pZm9ybSB2ZWMyIHNhbXBsZXJTaXplWyVjb3VudCVdOyBcXG51bmlmb3JtIHZlYzQgcGFyYW1zO1xcblxcbnZvaWQgbWFpbih2b2lkKXtcXG52ZWMyIHN1cmZhY2U7XFxuXFxuZmxvYXQgdnggPSB2VGV4dHVyZUNvb3JkLng7XFxuZmxvYXQgdnkgPSB2VGV4dHVyZUNvb3JkLnk7XFxuZmxvYXQgYWxlcGggPSBwYXJhbXMueDtcXG5mbG9hdCBiZXQgPSBwYXJhbXMueTtcXG5mbG9hdCBBID0gcGFyYW1zLno7XFxuZmxvYXQgQiA9IHBhcmFtcy53O1xcblxcbmlmIChhbGVwaCA9PSAwLjApIHtcXG5cXHRzdXJmYWNlLnkgPSB2eSAvICgxLjAgKyB2eCAqIGJldCk7XFxuXFx0c3VyZmFjZS54ID0gdng7XFxufVxcbmVsc2UgaWYgKGJldCA9PSAwLjApIHtcXG5cXHRzdXJmYWNlLnggPSB2eCAvICgxLjAgKyB2eSAqIGFsZXBoKTtcXG5cXHRzdXJmYWNlLnkgPSB2eTtcXG59IGVsc2Uge1xcblxcdHN1cmZhY2UueCA9IHZ4ICogKGJldCArIDEuMCkgLyAoYmV0ICsgMS4wICsgdnkgKiBhbGVwaCk7XFxuXFx0c3VyZmFjZS55ID0gdnkgKiAoYWxlcGggKyAxLjApIC8gKGFsZXBoICsgMS4wICsgdnggKiBiZXQpO1xcbn1cXG5cXG52ZWMyIHV2O1xcbnV2LnggPSB2VHJhbnMxLnggKiBzdXJmYWNlLnggKyB2VHJhbnMxLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMxLno7XFxudXYueSA9IHZUcmFuczIueCAqIHN1cmZhY2UueCArIHZUcmFuczIueSAqIHN1cmZhY2UueSArIHZUcmFuczIuejtcXG5cXG52ZWMyIHBpeGVscyA9IHV2ICogc2FtcGxlclNpemVbMF07XFxuXFxudmVjNCBlZGdlO1xcbmVkZ2UueHkgPSBjbGFtcChwaXhlbHMgLSB2RnJhbWUueHkgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuZWRnZS56dyA9IGNsYW1wKHZGcmFtZS56dyAtIHBpeGVscyArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5cXG5mbG9hdCBhbHBoYSA9IGVkZ2UueCAqIGVkZ2UueSAqIGVkZ2UueiAqIGVkZ2UudztcXG52ZWM0IHJDb2xvciA9IHZDb2xvciAqIGFscGhhO1xcblxcbmZsb2F0IHRleHR1cmVJZCA9IGZsb29yKHZUZXh0dXJlSWQrMC41KTtcXG52ZWM0IGNvbG9yO1xcbnZlYzIgdGV4dHVyZUNvb3JkID0gdXY7XFxuJWZvcmxvb3AlXFxuZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiByQ29sb3I7XFxufVwiO1xyXG4gICAgICAgICAgICBfdGhpcy5kZWZVbmlmb3JtcyA9IHtcclxuICAgICAgICAgICAgICAgIHdvcmxkVHJhbnNmb3JtOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAxXSksXHJcbiAgICAgICAgICAgICAgICBkaXN0b3J0aW9uOiBuZXcgRmxvYXQzMkFycmF5KFswLCAwXSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGVTdHJhbmdlUmVuZGVyZXIucHJvdG90eXBlLmdldFVuaWZvcm1zID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvaiA9IHNwcml0ZS5wcm9qO1xyXG4gICAgICAgICAgICB2YXIgc2hhZGVyID0gdGhpcy5zaGFkZXI7XHJcbiAgICAgICAgICAgIGlmIChwcm9qLnN1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLnVuaWZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9qLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai5fYWN0aXZlUHJvamVjdGlvbi51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZVbmlmb3JtcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZVN0cmFuZ2VSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlVmFvID0gZnVuY3Rpb24gKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRTaXplID0gMTQ7XHJcbiAgICAgICAgICAgIHRoaXMudmVydEJ5dGVTaXplID0gdGhpcy52ZXJ0U2l6ZSAqIDQ7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHZhciB2YW8gPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZVZhbygpXHJcbiAgICAgICAgICAgICAgICAuYWRkSW5kZXgodGhpcy5pbmRleEJ1ZmZlcilcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDApXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMiAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRyYW5zMiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNSAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUZyYW1lLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA4ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hQ29sb3IsIGdsLlVOU0lHTkVEX0JZVEUsIHRydWUsIHRoaXMudmVydEJ5dGVTaXplLCAxMiAqIDQpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cnMuYVRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICAgICAgdmFvLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlSWQsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEzICogNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZVN0cmFuZ2VSZW5kZXJlci5wcm90b3R5cGUuZmlsbFZlcnRpY2VzID0gZnVuY3Rpb24gKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCB0ZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSBzcHJpdGUudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHcgPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGggPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheCA9IHNwcml0ZS5fYW5jaG9yLl94O1xyXG4gICAgICAgICAgICB2YXIgYXkgPSBzcHJpdGUuX2FuY2hvci5feTtcclxuICAgICAgICAgICAgdmFyIGZyYW1lID0gdGV4Ll9mcmFtZTtcclxuICAgICAgICAgICAgdmFyIGFUcmFucyA9IHNwcml0ZS5hVHJhbnM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhW2kgKiAyXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhW2kgKiAyICsgMV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gYVRyYW5zLmE7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDNdID0gYVRyYW5zLmM7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDRdID0gYVRyYW5zLnR4O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA1XSA9IGFUcmFucy5iO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IGFUcmFucy5kO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IGFUcmFucy50eTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSBmcmFtZS54O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA5XSA9IGZyYW1lLnk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEwXSA9IGZyYW1lLnggKyBmcmFtZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTFdID0gZnJhbWUueSArIGZyYW1lLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAxMl0gPSBhcmdiO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB0ZXh0dXJlSWQ7XHJcbiAgICAgICAgICAgICAgICBpbmRleCArPSAxNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZVN0cmFuZ2VSZW5kZXJlcjtcclxuICAgIH0oTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIpKTtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignc3ByaXRlX3N0cmFuZ2UnLCBTcHJpdGVTdHJhbmdlUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgdmFyIHRlbXBSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKCk7XHJcbiAgICB2YXIgdGVtcFBvaW50ID0gbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgIHZhciBTdHJhbmdlU3VyZmFjZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFN0cmFuZ2VTdXJmYWNlLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFN0cmFuZ2VTdXJmYWNlKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wYXJhbXMgPSBbMCwgMCwgTmFOLCBOYU5dO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgcFswXSA9IDA7XHJcbiAgICAgICAgICAgIHBbMV0gPSAwO1xyXG4gICAgICAgICAgICBwWzJdID0gTmFOO1xyXG4gICAgICAgICAgICBwWzNdID0gTmFOO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLnNldEF4aXNYID0gZnVuY3Rpb24gKHBvcywgZmFjdG9yLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueCwgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIHJvdCA9IG91dFRyYW5zZm9ybS5yb3RhdGlvbjtcclxuICAgICAgICAgICAgaWYgKHJvdCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3ggLT0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcuX3kgKz0gcm90O1xyXG4gICAgICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnJvdGF0aW9uID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy55ID0gTWF0aC5hdGFuMih5LCB4KTtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgaWYgKGZhY3RvciAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcFsyXSA9IC1kICogZmFjdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcFsyXSA9IE5hTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jYWxjMDEoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5zZXRBeGlzWSA9IGZ1bmN0aW9uIChwb3MsIGZhY3Rvciwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLngsIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciByb3QgPSBvdXRUcmFuc2Zvcm0ucm90YXRpb247XHJcbiAgICAgICAgICAgIGlmIChyb3QgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll94IC09IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll95ICs9IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5yb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcueCA9IC1NYXRoLmF0YW4yKHksIHgpICsgTWF0aC5QSSAvIDI7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHBbM10gPSAtZCAqIGZhY3RvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBbM10gPSBOYU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fY2FsYzAxKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuX2NhbGMwMSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICAgICAgaWYgKGlzTmFOKHBbMl0pKSB7XHJcbiAgICAgICAgICAgICAgICBwWzFdID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihwWzNdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9IDEuMCAvIHBbM107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocFszXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBwWzFdID0gMS4wIC8gcFsyXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkID0gMS4wIC0gcFsyXSAqIHBbM107XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9ICgxLjAgLSBwWzJdKSAvIGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcFsxXSA9ICgxLjAgLSBwWzNdKSAvIGQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGFsZXBoID0gdGhpcy5wYXJhbXNbMF0sIGJldCA9IHRoaXMucGFyYW1zWzFdLCBBID0gdGhpcy5wYXJhbXNbMl0sIEIgPSB0aGlzLnBhcmFtc1szXTtcclxuICAgICAgICAgICAgdmFyIHUgPSBwb3MueCwgdiA9IHBvcy55O1xyXG4gICAgICAgICAgICBpZiAoYWxlcGggPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2ICogKDEgKyB1ICogYmV0KTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChiZXQgPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB1ICogKDEgKyB2ICogYWxlcGgpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIEQgPSBBICogQiAtIHYgKiB1O1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSBBICogdSAqIChCICsgdikgLyBEO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSBCICogdiAqIChBICsgdSkgLyBEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgYWxlcGggPSB0aGlzLnBhcmFtc1swXSwgYmV0ID0gdGhpcy5wYXJhbXNbMV0sIEEgPSB0aGlzLnBhcmFtc1syXSwgQiA9IHRoaXMucGFyYW1zWzNdO1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54LCB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIGlmIChhbGVwaCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHkgLyAoMSArIHggKiBiZXQpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGJldCA9PT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHggKiAoMSArIHkgKiBhbGVwaCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHggKiAoYmV0ICsgMSkgLyAoYmV0ICsgMSArIHkgKiBhbGVwaCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHkgKiAoYWxlcGggKyAxKSAvIChhbGVwaCArIDEgKyB4ICogYmV0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLm1hcFNwcml0ZSA9IGZ1bmN0aW9uIChzcHJpdGUsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSAtc3ByaXRlLmFuY2hvci54ICogdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnkgPSAtc3ByaXRlLmFuY2hvci55ICogdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC53aWR0aCA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcFF1YWQodGVtcFJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSB8fCBzcHJpdGUudHJhbnNmb3JtKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5tYXBRdWFkID0gZnVuY3Rpb24gKHJlY3QsIHF1YWQsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgYXggPSAtcmVjdC54IC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gLXJlY3QueSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXgyID0gKDEuMCAtIHJlY3QueCkgLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkyID0gKDEuMCAtIHJlY3QueSkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIHVwMXggPSAocXVhZFswXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMXkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMV0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIHVwMnggPSAocXVhZFswXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXggPSAocXVhZFszXS54ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueCAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsyXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheDIpICsgcXVhZFsyXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeSA9IChxdWFkWzNdLnkgKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueSAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB4MDAgPSB1cDF4ICogKDEuMCAtIGF5KSArIGRvd24xeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTAwID0gdXAxeSAqICgxLjAgLSBheSkgKyBkb3duMXkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgxMCA9IHVwMnggKiAoMS4wIC0gYXkpICsgZG93bjJ4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MTAgPSB1cDJ5ICogKDEuMCAtIGF5KSArIGRvd24yeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDAxID0gdXAxeCAqICgxLjAgLSBheTIpICsgZG93bjF4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTAxID0gdXAxeSAqICgxLjAgLSBheTIpICsgZG93bjF5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeDExID0gdXAyeCAqICgxLjAgLSBheTIpICsgZG93bjJ4ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgeTExID0gdXAyeSAqICgxLjAgLSBheTIpICsgZG93bjJ5ICogYXkyO1xyXG4gICAgICAgICAgICB2YXIgbWF0ID0gdGVtcE1hdDtcclxuICAgICAgICAgICAgbWF0LnR4ID0geDAwO1xyXG4gICAgICAgICAgICBtYXQudHkgPSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5hID0geDEwIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuYiA9IHkxMCAtIHkwMDtcclxuICAgICAgICAgICAgbWF0LmMgPSB4MDEgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5kID0geTAxIC0geTAwO1xyXG4gICAgICAgICAgICB0ZW1wUG9pbnQuc2V0KHgxMSwgeTExKTtcclxuICAgICAgICAgICAgbWF0LmFwcGx5SW52ZXJzZSh0ZW1wUG9pbnQsIHRlbXBQb2ludCk7XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5zZXRGcm9tTWF0cml4KG1hdCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmZpbGxVbmlmb3JtcyA9IGZ1bmN0aW9uICh1bmlmb3Jtcykge1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIHZhciBkaXN0b3J0aW9uID0gdW5pZm9ybXMucGFyYW1zIHx8IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDAsIDAsIDBdKTtcclxuICAgICAgICAgICAgdW5pZm9ybXMucGFyYW1zID0gZGlzdG9ydGlvbjtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblswXSA9IHBhcmFtc1swXTtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblsxXSA9IHBhcmFtc1sxXTtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblsyXSA9IHBhcmFtc1syXTtcclxuICAgICAgICAgICAgZGlzdG9ydGlvblszXSA9IHBhcmFtc1szXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTdHJhbmdlU3VyZmFjZTtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlN1cmZhY2UpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TdHJhbmdlU3VyZmFjZSA9IFN0cmFuZ2VTdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBQSVhJLlNwcml0ZS5wcm90b3R5cGUuY29udmVydFRvMnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGVfYmlsaW5lYXInO1xyXG4gICAgICAgIHRoaXMuYVRyYW5zID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbiAgICAgICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRUbzJzLmNhbGwodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRUbzJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2o7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0U3VidHJlZVRvMnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0VG8ycygpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmNvbnZlcnRTdWJ0cmVlVG8ycygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBTcHJpdGUycyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZTJzLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZTJzKHRleHR1cmUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dHVyZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuYVRyYW5zID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlX2JpbGluZWFyJztcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGUycy5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5fYm91bmRzLmFkZFF1YWQodGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB3aWQgPSB0aGlzLnRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICAgICAgdmFyIHR1aWQgPSB0aGlzLl90ZXh0dXJlLl91cGRhdGVJRDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RyYW5zZm9ybUlEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZUlEID09PSB0dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0cmltID0gdGV4dHVyZS50cmltO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHcwID0gMDtcclxuICAgICAgICAgICAgdmFyIHcxID0gMDtcclxuICAgICAgICAgICAgdmFyIGgwID0gMDtcclxuICAgICAgICAgICAgdmFyIGgxID0gMDtcclxuICAgICAgICAgICAgaWYgKHRyaW0pIHtcclxuICAgICAgICAgICAgICAgIHcxID0gdHJpbS54IC0gKGFuY2hvci5feCAqIG9yaWcud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIHRyaW0ud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IHRyaW0ueSAtIChhbmNob3IuX3kgKiBvcmlnLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgdHJpbS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gaDA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gaDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2ouX3N1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB3dCA9IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSB3dC5hO1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSB3dC5iO1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSB3dC5jO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQgPSB3dC5kO1xyXG4gICAgICAgICAgICAgICAgdmFyIHR4ID0gd3QudHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHkgPSB3dC50eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSAoYSAqIHcxKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gKGQgKiBoMSkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IChhICogdzApICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSAoZCAqIGgxKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gKGEgKiB3MCkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IChkICogaDApICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSAoYSAqIHcxKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gKGQgKiBoMCkgKyAoYiAqIHcxKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0ZXh0dXJlLnRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICAgICAgdGV4dHVyZS50cmFuc2Zvcm0gPSBuZXcgUElYSS5leHRyYXMuVGV4dHVyZVRyYW5zZm9ybSh0ZXh0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZXh0dXJlLnRyYW5zZm9ybS51cGRhdGUoKTtcclxuICAgICAgICAgICAgdmFyIGFUcmFucyA9IHRoaXMuYVRyYW5zO1xyXG4gICAgICAgICAgICBhVHJhbnMuc2V0KG9yaWcud2lkdGgsIDAsIDAsIG9yaWcuaGVpZ2h0LCB3MSwgaDEpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9zdXJmYWNlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhVHJhbnMucHJlcGVuZCh0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYVRyYW5zLmludmVydCgpO1xyXG4gICAgICAgICAgICBhVHJhbnMucHJlcGVuZCh0ZXh0dXJlLnRyYW5zZm9ybS5tYXBDb29yZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoOCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleFRyaW1tZWREYXRhO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzFdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gaDE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzRdID0gdzA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gaDA7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gdzE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzddID0gaDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2ouX3N1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhLCB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gd3QuYTtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gd3QuYjtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gd3QuYztcclxuICAgICAgICAgICAgICAgIHZhciBkID0gd3QuZDtcclxuICAgICAgICAgICAgICAgIHZhciB0eCA9IHd0LnR4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5ID0gd3QudHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gKGEgKiB3MSkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IChkICogaDEpICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSAoYSAqIHcwKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gKGQgKiBoMSkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IChhICogdzApICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSAoZCAqIGgwKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gKGEgKiB3MSkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IChkICogaDApICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEsIHRoaXMucHJvai5fYWN0aXZlUHJvamVjdGlvbi5sZWdhY3kud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ByaXRlMnMucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlMnM7XHJcbiAgICB9KFBJWEkuU3ByaXRlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMgPSBTcHJpdGUycztcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFRleHQycyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFRleHQycywgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBUZXh0MnModGV4dCwgc3R5bGUsIGNhbnZhcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0LCBzdHlsZSwgY2FudmFzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5hVHJhbnMgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvblN1cmZhY2UoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGVfYmlsaW5lYXInO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUZXh0MnMucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gVGV4dDJzO1xyXG4gICAgfShQSVhJLlRleHQpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5UZXh0MnMgPSBUZXh0MnM7XHJcbiAgICBUZXh0MnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgIFRleHQycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICBUZXh0MnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIGZ1bmN0aW9uIGNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgIH1cclxuICAgIHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtID0gY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybTtcclxuICAgIHZhciBDb250YWluZXIyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKENvbnRhaW5lcjJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIENvbnRhaW5lcjJkKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29udGFpbmVyMmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gQ29udGFpbmVyMmQ7XHJcbiAgICB9KFBJWEkuQ29udGFpbmVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uQ29udGFpbmVyMmQgPSBDb250YWluZXIyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFBvaW50ID0gUElYSS5Qb2ludDtcclxuICAgIHZhciBtYXQzaWQgPSBbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV07XHJcbiAgICB2YXIgQUZGSU5FO1xyXG4gICAgKGZ1bmN0aW9uIChBRkZJTkUpIHtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiTk9ORVwiXSA9IDBdID0gXCJOT05FXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIkZSRUVcIl0gPSAxXSA9IFwiRlJFRVwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJBWElTX1hcIl0gPSAyXSA9IFwiQVhJU19YXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIkFYSVNfWVwiXSA9IDNdID0gXCJBWElTX1lcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiUE9JTlRcIl0gPSA0XSA9IFwiUE9JTlRcIjtcclxuICAgIH0pKEFGRklORSA9IHBpeGlfcHJvamVjdGlvbi5BRkZJTkUgfHwgKHBpeGlfcHJvamVjdGlvbi5BRkZJTkUgPSB7fSkpO1xyXG4gICAgdmFyIE1hdHJpeDJkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBNYXRyaXgyZChiYWNraW5nQXJyYXkpIHtcclxuICAgICAgICAgICAgdGhpcy5mbG9hdEFycmF5ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5tYXQzID0gbmV3IEZsb2F0NjRBcnJheShiYWNraW5nQXJyYXkgfHwgbWF0M2lkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJhXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzBdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzBdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiYlwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1sxXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1sxXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImNcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbM107XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbM10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzRdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzRdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwidHhcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbNl07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbNl0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJ0eVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1s3XTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1s3XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHR4LCB0eSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IGE7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBiO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IGM7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBkO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHR4O1xyXG4gICAgICAgICAgICBtYXQzWzddID0gdHk7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKHRyYW5zcG9zZSwgb3V0KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5mbG9hdEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZsb2F0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KDkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IG91dCB8fCB0aGlzLmZsb2F0QXJyYXk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBpZiAodHJhbnNwb3NlKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVswXSA9IG1hdDNbMF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVsxXSA9IG1hdDNbMV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVsyXSA9IG1hdDNbMl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVszXSA9IG1hdDNbM107XHJcbiAgICAgICAgICAgICAgICBhcnJheVs0XSA9IG1hdDNbNF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs1XSA9IG1hdDNbNV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs2XSA9IG1hdDNbNl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs3XSA9IG1hdDNbN107XHJcbiAgICAgICAgICAgICAgICBhcnJheVs4XSA9IG1hdDNbOF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVswXSA9IG1hdDNbMF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVsxXSA9IG1hdDNbM107XHJcbiAgICAgICAgICAgICAgICBhcnJheVsyXSA9IG1hdDNbNl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVszXSA9IG1hdDNbMV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs0XSA9IG1hdDNbNF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs1XSA9IG1hdDNbN107XHJcbiAgICAgICAgICAgICAgICBhcnJheVs2XSA9IG1hdDNbMl07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs3XSA9IG1hdDNbNV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVs4XSA9IG1hdDNbOF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueDtcclxuICAgICAgICAgICAgdmFyIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIHogPSAxLjAgLyAobWF0M1syXSAqIHggKyBtYXQzWzVdICogeSArIG1hdDNbOF0pO1xyXG4gICAgICAgICAgICBuZXdQb3MueCA9IHogKiAobWF0M1swXSAqIHggKyBtYXQzWzNdICogeSArIG1hdDNbNl0pO1xyXG4gICAgICAgICAgICBuZXdQb3MueSA9IHogKiAobWF0M1sxXSAqIHggKyBtYXQzWzRdICogeSArIG1hdDNbN10pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uICh0eCwgdHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gKz0gdHggKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzFdICs9IHR5ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1szXSArPSB0eCAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNF0gKz0gdHkgKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzZdICs9IHR4ICogbWF0M1s4XTtcclxuICAgICAgICAgICAgbWF0M1s3XSArPSB0eSAqIG1hdDNbOF07XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gKj0geDtcclxuICAgICAgICAgICAgbWF0M1sxXSAqPSB5O1xyXG4gICAgICAgICAgICBtYXQzWzNdICo9IHg7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gKj0geTtcclxuICAgICAgICAgICAgbWF0M1s2XSAqPSB4O1xyXG4gICAgICAgICAgICBtYXQzWzddICo9IHk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNjYWxlQW5kVHJhbnNsYXRlID0gZnVuY3Rpb24gKHNjYWxlWCwgc2NhbGVZLCB0eCwgdHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBzY2FsZVggKiBtYXQzWzBdICsgdHggKiBtYXQzWzJdO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gc2NhbGVZICogbWF0M1sxXSArIHR5ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1szXSA9IHNjYWxlWCAqIG1hdDNbM10gKyB0eCAqIG1hdDNbNV07XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBzY2FsZVkgKiBtYXQzWzRdICsgdHkgKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gc2NhbGVYICogbWF0M1s2XSArIHR4ICogbWF0M1s4XTtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHNjYWxlWSAqIG1hdDNbN10gKyB0eSAqIG1hdDNbOF07XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLng7XHJcbiAgICAgICAgICAgIHZhciB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzNdLCBhMDIgPSBhWzZdLCBhMTAgPSBhWzFdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzddLCBhMjAgPSBhWzJdLCBhMjEgPSBhWzVdLCBhMjIgPSBhWzhdO1xyXG4gICAgICAgICAgICB2YXIgbmV3WCA9IChhMjIgKiBhMTEgLSBhMTIgKiBhMjEpICogeCArICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIHkgKyAoYTEyICogYTAxIC0gYTAyICogYTExKTtcclxuICAgICAgICAgICAgdmFyIG5ld1kgPSAoLWEyMiAqIGExMCArIGExMiAqIGEyMCkgKiB4ICsgKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiB5ICsgKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApO1xyXG4gICAgICAgICAgICB2YXIgbmV3WiA9IChhMjEgKiBhMTAgLSBhMTEgKiBhMjApICogeCArICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIHkgKyAoYTExICogYTAwIC0gYTAxICogYTEwKTtcclxuICAgICAgICAgICAgbmV3UG9zLnggPSBuZXdYIC8gbmV3WjtcclxuICAgICAgICAgICAgbmV3UG9zLnkgPSBuZXdZIC8gbmV3WjtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSwgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XSwgYjAxID0gYTIyICogYTExIC0gYTEyICogYTIxLCBiMTEgPSAtYTIyICogYTEwICsgYTEyICogYTIwLCBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjA7XHJcbiAgICAgICAgICAgIHZhciBkZXQgPSBhMDAgKiBiMDEgKyBhMDEgKiBiMTEgKyBhMDIgKiBiMjE7XHJcbiAgICAgICAgICAgIGlmICghZGV0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XHJcbiAgICAgICAgICAgIGFbMF0gPSBiMDEgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbMV0gPSAoLWEyMiAqIGEwMSArIGEwMiAqIGEyMSkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbMl0gPSAoYTEyICogYTAxIC0gYTAyICogYTExKSAqIGRldDtcclxuICAgICAgICAgICAgYVszXSA9IGIxMSAqIGRldDtcclxuICAgICAgICAgICAgYVs0XSA9IChhMjIgKiBhMDAgLSBhMDIgKiBhMjApICogZGV0O1xyXG4gICAgICAgICAgICBhWzVdID0gKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApICogZGV0O1xyXG4gICAgICAgICAgICBhWzZdID0gYjIxICogZGV0O1xyXG4gICAgICAgICAgICBhWzddID0gKC1hMjEgKiBhMDAgKyBhMDEgKiBhMjApICogZGV0O1xyXG4gICAgICAgICAgICBhWzhdID0gKGExMSAqIGEwMCAtIGEwMSAqIGExMCkgKiBkZXQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmlkZW50aXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IDE7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4MmQodGhpcy5tYXQzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jb3B5VG8gPSBmdW5jdGlvbiAobWF0cml4KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYXIyID0gbWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIGFyMlswXSA9IG1hdDNbMF07XHJcbiAgICAgICAgICAgIGFyMlsxXSA9IG1hdDNbMV07XHJcbiAgICAgICAgICAgIGFyMlsyXSA9IG1hdDNbMl07XHJcbiAgICAgICAgICAgIGFyMlszXSA9IG1hdDNbM107XHJcbiAgICAgICAgICAgIGFyMls0XSA9IG1hdDNbNF07XHJcbiAgICAgICAgICAgIGFyMls1XSA9IG1hdDNbNV07XHJcbiAgICAgICAgICAgIGFyMls2XSA9IG1hdDNbNl07XHJcbiAgICAgICAgICAgIGFyMls3XSA9IG1hdDNbN107XHJcbiAgICAgICAgICAgIGFyMls4XSA9IG1hdDNbOF07XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIChtYXRyaXgsIGFmZmluZSkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGQgPSAxLjAgLyBtYXQzWzhdO1xyXG4gICAgICAgICAgICB2YXIgdHggPSBtYXQzWzZdICogZCwgdHkgPSBtYXQzWzddICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmEgPSAobWF0M1swXSAtIG1hdDNbMl0gKiB0eCkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguYiA9IChtYXQzWzFdIC0gbWF0M1syXSAqIHR5KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5jID0gKG1hdDNbM10gLSBtYXQzWzVdICogdHgpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmQgPSAobWF0M1s0XSAtIG1hdDNbNV0gKiB0eSkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXgudHggPSB0eDtcclxuICAgICAgICAgICAgbWF0cml4LnR5ID0gdHk7XHJcbiAgICAgICAgICAgIGlmIChhZmZpbmUgPj0gMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFmZmluZSA9PT0gQUZGSU5FLlBPSU5UKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmEgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5iID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmQgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYWZmaW5lID09PSBBRkZJTkUuQVhJU19YKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmMgPSAtbWF0cml4LmI7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmQgPSBtYXRyaXguYTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFmZmluZSA9PT0gQUZGSU5FLkFYSVNfWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5hID0gbWF0cml4LmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmMgPSAtbWF0cml4LmI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5jb3B5RnJvbSA9IGZ1bmN0aW9uIChtYXRyaXgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBtYXRyaXguYTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IG1hdHJpeC5iO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMDtcclxuICAgICAgICAgICAgbWF0M1szXSA9IG1hdHJpeC5jO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gbWF0cml4LmQ7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gbWF0cml4LnR4O1xyXG4gICAgICAgICAgICBtYXQzWzddID0gbWF0cml4LnR5O1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMS4wO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zZXRUb011bHRMZWdhY3kgPSBmdW5jdGlvbiAocHQsIGx0KSB7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBiID0gbHQubWF0MztcclxuICAgICAgICAgICAgdmFyIGEwMCA9IHB0LmEsIGEwMSA9IHB0LmIsIGExMCA9IHB0LmMsIGExMSA9IHB0LmQsIGEyMCA9IHB0LnR4LCBhMjEgPSBwdC50eSwgYjAwID0gYlswXSwgYjAxID0gYlsxXSwgYjAyID0gYlsyXSwgYjEwID0gYlszXSwgYjExID0gYls0XSwgYjEyID0gYls1XSwgYjIwID0gYls2XSwgYjIxID0gYls3XSwgYjIyID0gYls4XTtcclxuICAgICAgICAgICAgb3V0WzBdID0gYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbMV0gPSBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFsyXSA9IGIwMjtcclxuICAgICAgICAgICAgb3V0WzNdID0gYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbNF0gPSBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs1XSA9IGIxMjtcclxuICAgICAgICAgICAgb3V0WzZdID0gYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbN10gPSBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs4XSA9IGIyMjtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2V0VG9NdWx0MmQgPSBmdW5jdGlvbiAocHQsIGx0KSB7XHJcbiAgICAgICAgICAgIHZhciBvdXQgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhID0gcHQubWF0MywgYiA9IGx0Lm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLCBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdLCBiMDAgPSBiWzBdLCBiMDEgPSBiWzFdLCBiMDIgPSBiWzJdLCBiMTAgPSBiWzNdLCBiMTEgPSBiWzRdLCBiMTIgPSBiWzVdLCBiMjAgPSBiWzZdLCBiMjEgPSBiWzddLCBiMjIgPSBiWzhdO1xyXG4gICAgICAgICAgICBvdXRbMF0gPSBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFsxXSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzJdID0gYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyO1xyXG4gICAgICAgICAgICBvdXRbM10gPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs0XSA9IGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzVdID0gYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyO1xyXG4gICAgICAgICAgICBvdXRbNl0gPSBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjA7XHJcbiAgICAgICAgICAgIG91dFs3XSA9IGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMTtcclxuICAgICAgICAgICAgb3V0WzhdID0gYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLklERU5USVRZID0gbmV3IE1hdHJpeDJkKCk7XHJcbiAgICAgICAgTWF0cml4MmQuVEVNUF9NQVRSSVggPSBuZXcgTWF0cml4MmQoKTtcclxuICAgICAgICByZXR1cm4gTWF0cml4MmQ7XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkID0gTWF0cml4MmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUhhY2socGFyZW50VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgdmFyIHByb2ogPSB0aGlzLnByb2o7XHJcbiAgICAgICAgdmFyIHRhID0gdGhpcztcclxuICAgICAgICB2YXIgcHdpZCA9IHBhcmVudFRyYW5zZm9ybS5fd29ybGRJRDtcclxuICAgICAgICB2YXIgbHQgPSB0YS5sb2NhbFRyYW5zZm9ybTtcclxuICAgICAgICBpZiAodGEuX2xvY2FsSUQgIT09IHRhLl9jdXJyZW50TG9jYWxJRCkge1xyXG4gICAgICAgICAgICBsdC5hID0gdGEuX2N4ICogdGEuc2NhbGUuX3g7XHJcbiAgICAgICAgICAgIGx0LmIgPSB0YS5fc3ggKiB0YS5zY2FsZS5feDtcclxuICAgICAgICAgICAgbHQuYyA9IHRhLl9jeSAqIHRhLnNjYWxlLl95O1xyXG4gICAgICAgICAgICBsdC5kID0gdGEuX3N5ICogdGEuc2NhbGUuX3k7XHJcbiAgICAgICAgICAgIGx0LnR4ID0gdGEucG9zaXRpb24uX3ggLSAoKHRhLnBpdm90Ll94ICogbHQuYSkgKyAodGEucGl2b3QuX3kgKiBsdC5jKSk7XHJcbiAgICAgICAgICAgIGx0LnR5ID0gdGEucG9zaXRpb24uX3kgLSAoKHRhLnBpdm90Ll94ICogbHQuYikgKyAodGEucGl2b3QuX3kgKiBsdC5kKSk7XHJcbiAgICAgICAgICAgIHRhLl9jdXJyZW50TG9jYWxJRCA9IHRhLl9sb2NhbElEO1xyXG4gICAgICAgICAgICBwcm9qLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBfbWF0cml4SUQgPSBwcm9qLl9wcm9qSUQ7XHJcbiAgICAgICAgaWYgKHByb2ouX2N1cnJlbnRQcm9qSUQgIT09IF9tYXRyaXhJRCkge1xyXG4gICAgICAgICAgICBwcm9qLl9jdXJyZW50UHJvaklEID0gX21hdHJpeElEO1xyXG4gICAgICAgICAgICBpZiAoX21hdHJpeElEICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLmxvY2FsLnNldFRvTXVsdExlZ2FjeShsdCwgcHJvai5tYXRyaXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvai5sb2NhbC5jb3B5RnJvbShsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGEuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0YS5fcGFyZW50SUQgIT09IHB3aWQpIHtcclxuICAgICAgICAgICAgdmFyIHBwID0gcGFyZW50VHJhbnNmb3JtLnByb2o7XHJcbiAgICAgICAgICAgIGlmIChwcCAmJiAhcHAuYWZmaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLndvcmxkLnNldFRvTXVsdDJkKHBwLndvcmxkLCBwcm9qLmxvY2FsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb2oud29ybGQuc2V0VG9NdWx0TGVnYWN5KHBhcmVudFRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSwgcHJvai5sb2NhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvai53b3JsZC5jb3B5KHRhLndvcmxkVHJhbnNmb3JtLCBwcm9qLl9hZmZpbmUpO1xyXG4gICAgICAgICAgICB0YS5fcGFyZW50SUQgPSBwd2lkO1xyXG4gICAgICAgICAgICB0YS5fd29ybGRJRCsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciB0MCA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICB2YXIgdHQgPSBbbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKV07XHJcbiAgICB2YXIgdGVtcFJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoKTtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgdmFyIFByb2plY3Rpb24yZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFByb2plY3Rpb24yZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uMmQobGVnYWN5LCBlbmFibGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbGVnYWN5LCBlbmFibGUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLm1hdHJpeCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgX3RoaXMubG9jYWwgPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIF90aGlzLndvcmxkID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvaklEID0gMDtcclxuICAgICAgICAgICAgX3RoaXMuX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICAgICAgX3RoaXMuX2FmZmluZSA9IHBpeGlfcHJvamVjdGlvbi5BRkZJTkUuTk9ORTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvbjJkLnByb3RvdHlwZSwgXCJhZmZpbmVcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZmZpbmU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWZmaW5lID09IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FmZmluZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvbjJkLnByb3RvdHlwZSwgXCJlbmFibGVkXCIsIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IHRyYW5zZm9ybUhhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSBQSVhJLlRyYW5zZm9ybVN0YXRpYy5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLnNldEF4aXNYID0gZnVuY3Rpb24gKHAsIGZhY3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yID09PSB2b2lkIDApIHsgZmFjdG9yID0gMTsgfVxyXG4gICAgICAgICAgICB2YXIgeCA9IHAueCwgeSA9IHAueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXRyaXgubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHggLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0geSAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSBmYWN0b3IgLyBkO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUuc2V0QXhpc1kgPSBmdW5jdGlvbiAocCwgZmFjdG9yKSB7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgPT09IHZvaWQgMCkgeyBmYWN0b3IgPSAxOyB9XHJcbiAgICAgICAgICAgIHZhciB4ID0gcC54LCB5ID0gcC55O1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0geCAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSB5IC8gZDtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IGZhY3RvciAvIGQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5tYXBTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGVtcFJlY3QueCA9IC1zcHJpdGUuYW5jaG9yLnggKiB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QueSA9IC1zcHJpdGUuYW5jaG9yLnkgKiB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LndpZHRoID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LmhlaWdodCA9IHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFwUXVhZCh0ZW1wUmVjdCwgcXVhZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLm1hcFF1YWQgPSBmdW5jdGlvbiAocmVjdCwgcCkge1xyXG4gICAgICAgICAgICB0dFswXS5zZXQocmVjdC54LCByZWN0LnkpO1xyXG4gICAgICAgICAgICB0dFsxXS5zZXQocmVjdC54ICsgcmVjdC53aWR0aCwgcmVjdC55KTtcclxuICAgICAgICAgICAgdHRbMl0uc2V0KHJlY3QueCArIHJlY3Qud2lkdGgsIHJlY3QueSArIHJlY3QuaGVpZ2h0KTtcclxuICAgICAgICAgICAgdHRbM10uc2V0KHJlY3QueCwgcmVjdC55ICsgcmVjdC5oZWlnaHQpO1xyXG4gICAgICAgICAgICB2YXIgazEgPSAxLCBrMiA9IDIsIGszID0gMztcclxuICAgICAgICAgICAgdmFyIGYgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMuZ2V0SW50ZXJzZWN0aW9uRmFjdG9yKHBbMF0sIHBbMl0sIHBbMV0sIHBbM10sIHQwKTtcclxuICAgICAgICAgICAgaWYgKGYgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGsxID0gMTtcclxuICAgICAgICAgICAgICAgIGsyID0gMztcclxuICAgICAgICAgICAgICAgIGszID0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZDAgPSBNYXRoLnNxcnQoKHBbMF0ueCAtIHQwLngpICogKHBbMF0ueCAtIHQwLngpICsgKHBbMF0ueSAtIHQwLnkpICogKHBbMF0ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIGQxID0gTWF0aC5zcXJ0KChwW2sxXS54IC0gdDAueCkgKiAocFtrMV0ueCAtIHQwLngpICsgKHBbazFdLnkgLSB0MC55KSAqIChwW2sxXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgZDIgPSBNYXRoLnNxcnQoKHBbazJdLnggLSB0MC54KSAqIChwW2syXS54IC0gdDAueCkgKyAocFtrMl0ueSAtIHQwLnkpICogKHBbazJdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBkMyA9IE1hdGguc3FydCgocFtrM10ueCAtIHQwLngpICogKHBbazNdLnggLSB0MC54KSArIChwW2szXS55IC0gdDAueSkgKiAocFtrM10ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIHEwID0gKGQwICsgZDMpIC8gZDM7XHJcbiAgICAgICAgICAgIHZhciBxMSA9IChkMSArIGQyKSAvIGQyO1xyXG4gICAgICAgICAgICB2YXIgcTIgPSAoZDEgKyBkMikgLyBkMTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gdHRbMF0ueCAqIHEwO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gdHRbMF0ueSAqIHEwO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gcTA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSB0dFtrMV0ueCAqIHExO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gdHRbazFdLnkgKiBxMTtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IHExO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gdHRbazJdLnggKiBxMjtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHR0W2syXS55ICogcTI7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSBxMjtcclxuICAgICAgICAgICAgdGhpcy5tYXRyaXguaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgIG1hdDMgPSB0ZW1wTWF0Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBwWzBdLng7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBwWzBdLnk7XHJcbiAgICAgICAgICAgIG1hdDNbMl0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gcFtrMV0ueDtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHBbazFdLnk7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzZdID0gcFtrMl0ueDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHBbazJdLnk7XHJcbiAgICAgICAgICAgIG1hdDNbOF0gPSAxO1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeC5zZXRUb011bHQyZCh0ZW1wTWF0LCB0aGlzLm1hdHJpeCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2pJRCsrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeC5pZGVudGl0eSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb24yZDtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24pKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQgPSBQcm9qZWN0aW9uMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNZXNoMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhNZXNoMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gTWVzaDJkKHRleHR1cmUsIHZlcnRpY2VzLCB1dnMsIGluZGljZXMsIGRyYXdNb2RlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHR1cmUsIHZlcnRpY2VzLCB1dnMsIGluZGljZXMsIGRyYXdNb2RlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdtZXNoMmQnO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZXNoMmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gTWVzaDJkO1xyXG4gICAgfShQSVhJLm1lc2guTWVzaCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLk1lc2gyZCA9IE1lc2gyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgdHJhbnNsYXRpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHVUcmFuc2Zvcm07XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogdHJhbnNsYXRpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG5cXG4gICAgdlRleHR1cmVDb29yZCA9ICh1VHJhbnNmb3JtICogdmVjMyhhVGV4dHVyZUNvb3JkLCAxLjApKS54eTtcXG59XFxuXCI7XHJcbiAgICB2YXIgc2hhZGVyRnJhZyA9IFwiXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSB2ZWM0IHVDb2xvcjtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkgKiB1Q29sb3I7XFxufVwiO1xyXG4gICAgdmFyIE1lc2gyZFJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoTWVzaDJkUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gTWVzaDJkUmVuZGVyZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgTWVzaDJkUmVuZGVyZXIucHJvdG90eXBlLm9uQ29udGV4dENoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdGhpcy5zaGFkZXIgPSBuZXcgUElYSS5TaGFkZXIoZ2wsIHNoYWRlclZlcnQsIHNoYWRlckZyYWcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIE1lc2gyZFJlbmRlcmVyO1xyXG4gICAgfShQSVhJLm1lc2guTWVzaFJlbmRlcmVyKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uTWVzaDJkUmVuZGVyZXIgPSBNZXNoMmRSZW5kZXJlcjtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignbWVzaDJkJywgTWVzaDJkUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBQSVhJLlNwcml0ZS5wcm90b3R5cGUuY29udmVydFRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlMmQnO1xyXG4gICAgICAgIHRoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5tZXNoLk1lc2gucHJvdG90eXBlLmNvbnZlcnRUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgdGhpcy5wbHVnaW5OYW1lID0gJ21lc2gyZCc7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvailcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKHRoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0U3VidHJlZVRvMmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0VG8yZCgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmNvbnZlcnRTdWJ0cmVlVG8yZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBTcHJpdGUyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZTJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZTJkKHRleHR1cmUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dHVyZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlMmQnO1xyXG4gICAgICAgICAgICBfdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlMmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kcy5hZGRRdWFkKHRoaXMudmVydGV4VHJpbW1lZERhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hZmZpbmUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRleERhdGEubGVuZ3RoICE9IDgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcy5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZlcnRleERhdGEubGVuZ3RoICE9IDEyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90cmFuc2Zvcm1JRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybUlEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB3dCA9IHRoaXMucHJvai53b3JsZC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgdmVydGV4RGF0YSA9IHRoaXMudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRyaW0gPSB0ZXh0dXJlLnRyaW07XHJcbiAgICAgICAgICAgIHZhciBvcmlnID0gdGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gdGhpcy5fYW5jaG9yO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDAgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAwO1xyXG4gICAgICAgICAgICBpZiAodHJpbSkge1xyXG4gICAgICAgICAgICAgICAgdzEgPSB0cmltLnggLSAoYW5jaG9yLl94ICogb3JpZy53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgdHJpbS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gdHJpbS55IC0gKGFuY2hvci5feSAqIG9yaWcuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyB0cmltLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHcxID0gLWFuY2hvci5feCAqIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB3MCA9IHcxICsgb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIGgxID0gLWFuY2hvci5feSAqIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIG9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSAod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMSkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9ICh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgxKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gKHd0WzJdICogdzEpICsgKHd0WzVdICogaDEpICsgd3RbOF07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSAod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMSkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9ICh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgxKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gKHd0WzJdICogdzApICsgKHd0WzVdICogaDEpICsgd3RbOF07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSAod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMCkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9ICh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgwKSArIHd0WzddO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzhdID0gKHd0WzJdICogdzApICsgKHd0WzVdICogaDApICsgd3RbOF07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbOV0gPSAod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMCkgKyB3dFs2XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxMF0gPSAod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxMV0gPSAod3RbMl0gKiB3MSkgKyAod3RbNV0gKiBoMCkgKyB3dFs4XTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FmZmluZSkge1xyXG4gICAgICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXMuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoOCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fdHJhbnNmb3JtVHJpbW1lZElEID09PSB3aWQgJiYgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZVRyaW1tZWRJRCA9IHR1aWQ7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleFRyaW1tZWREYXRhO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy5wcm9qLndvcmxkLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIHogPSAxLjAgLyAod3RbMl0gKiB3MSArIHd0WzVdICogaDEgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMF0gPSB6ICogKCh3dFswXSAqIHcxKSArICh3dFszXSAqIGgxKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IHogKiAoKHd0WzFdICogdzEpICsgKHd0WzRdICogaDEpICsgd3RbN10pO1xyXG4gICAgICAgICAgICB6ID0gMS4wIC8gKHd0WzJdICogdzAgKyB3dFs1XSAqIGgxICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0geiAqICgod3RbMF0gKiB3MCkgKyAod3RbM10gKiBoMSkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbM10gPSB6ICogKCh3dFsxXSAqIHcwKSArICh3dFs0XSAqIGgxKSArIHd0WzddKTtcclxuICAgICAgICAgICAgeiA9IDEuMCAvICh3dFsyXSAqIHcwICsgd3RbNV0gKiBoMCArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IHogKiAoKHd0WzBdICogdzApICsgKHd0WzNdICogaDApICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0geiAqICgod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XSk7XHJcbiAgICAgICAgICAgIHogPSAxLjAgLyAod3RbMl0gKiB3MSArIHd0WzVdICogaDAgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNl0gPSB6ICogKCh3dFswXSAqIHcxKSArICh3dFszXSAqIGgwKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IHogKiAoKHd0WzFdICogdzEpICsgKHd0WzRdICogaDApICsgd3RbN10pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNwcml0ZTJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZTJkO1xyXG4gICAgfShQSVhJLlNwcml0ZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkID0gU3ByaXRlMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlciA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbC5NdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIHZhciBTcHJpdGUyZFJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlMmRSZW5kZXJlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGUyZFJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyVmVydCA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcbmF0dHJpYnV0ZSB2ZWM0IGFDb2xvcjtcXG5hdHRyaWJ1dGUgZmxvYXQgYVRleHR1cmVJZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxuICAgIGdsX1Bvc2l0aW9uLnh5dyA9IHByb2plY3Rpb25NYXRyaXggKiBhVmVydGV4UG9zaXRpb247XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuICAgIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG4gICAgdlRleHR1cmVJZCA9IGFUZXh0dXJlSWQ7XFxuICAgIHZDb2xvciA9IGFDb2xvcjtcXG59XFxuXCI7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlckZyYWcgPSBcIlxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCB2VGV4dHVyZUlkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyc1slY291bnQlXTtcXG5cXG52b2lkIG1haW4odm9pZCl7XFxudmVjNCBjb2xvcjtcXG52ZWMyIHRleHR1cmVDb29yZCA9IHZUZXh0dXJlQ29vcmQ7XFxuZmxvYXQgdGV4dHVyZUlkID0gZmxvb3IodlRleHR1cmVJZCswLjUpO1xcbiVmb3Jsb29wJVxcbmdsX0ZyYWdDb2xvciA9IGNvbG9yICogdkNvbG9yO1xcbn1cIjtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGUyZFJlbmRlcmVyLnByb3RvdHlwZS5jcmVhdGVWYW8gPSBmdW5jdGlvbiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudmVydFNpemUgPSA2O1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRCeXRlU2l6ZSA9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB2YXIgdmFvID0gdGhpcy5yZW5kZXJlci5jcmVhdGVWYW8oKVxyXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KHRoaXMuaW5kZXhCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVZlcnRleFBvc2l0aW9uLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAwKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlQ29vcmQsIGdsLlVOU0lHTkVEX1NIT1JULCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMyAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUNvbG9yLCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgNCAqIDQpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cnMuYVRleHR1cmVJZCkge1xyXG4gICAgICAgICAgICAgICAgdmFvLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUZXh0dXJlSWQsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDUgKiA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFvO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMmRSZW5kZXJlci5wcm90b3R5cGUuZmlsbFZlcnRpY2VzID0gZnVuY3Rpb24gKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCB0ZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSBzcHJpdGUudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHV2cyA9IHNwcml0ZS5fdGV4dHVyZS5fdXZzLnV2c1VpbnQzMjtcclxuICAgICAgICAgICAgaWYgKHZlcnRleERhdGEubGVuZ3RoID09PSA4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJlci5yb3VuZFBpeGVscykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNvbHV0aW9uID0gdGhpcy5yZW5kZXJlci5yZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9ICgodmVydGV4RGF0YVswXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSAoKHZlcnRleERhdGFbMV0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSAoKHZlcnRleERhdGFbMl0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gKCh2ZXJ0ZXhEYXRhWzNdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEyXSA9ICgodmVydGV4RGF0YVs0XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gKCh2ZXJ0ZXhEYXRhWzVdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxNF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOF0gPSAoKHZlcnRleERhdGFbNl0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE5XSA9ICgodmVydGV4RGF0YVs3XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMjBdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVswXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVsxXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSB2ZXJ0ZXhEYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSB2ZXJ0ZXhEYXRhWzNdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMl0gPSB2ZXJ0ZXhEYXRhWzRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdmVydGV4RGF0YVs1XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE0XSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE4XSA9IHZlcnRleERhdGFbNl07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOV0gPSB2ZXJ0ZXhEYXRhWzddO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMjBdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVswXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IHZlcnRleERhdGFbMl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gdmVydGV4RGF0YVszXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSB2ZXJ0ZXhEYXRhWzRdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA4XSA9IHZlcnRleERhdGFbNV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEyXSA9IHZlcnRleERhdGFbNl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHZlcnRleERhdGFbN107XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE0XSA9IHZlcnRleERhdGFbOF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE4XSA9IHZlcnRleERhdGFbOV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDE5XSA9IHZlcnRleERhdGFbMTBdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyMF0gPSB2ZXJ0ZXhEYXRhWzExXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgM10gPSB1dnNbMF07XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyA5XSA9IHV2c1sxXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDE1XSA9IHV2c1syXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDIxXSA9IHV2c1szXTtcclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDRdID0gdWludDMyVmlld1tpbmRleCArIDEwXSA9IHVpbnQzMlZpZXdbaW5kZXggKyAxNl0gPSB1aW50MzJWaWV3W2luZGV4ICsgMjJdID0gYXJnYjtcclxuICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA1XSA9IGZsb2F0MzJWaWV3W2luZGV4ICsgMTFdID0gZmxvYXQzMlZpZXdbaW5kZXggKyAxN10gPSBmbG9hdDMyVmlld1tpbmRleCArIDIzXSA9IHRleHR1cmVJZDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGUyZFJlbmRlcmVyO1xyXG4gICAgfShNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcikpO1xyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdzcHJpdGUyZCcsIFNwcml0ZTJkUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgVGV4dDJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoVGV4dDJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFRleHQyZCh0ZXh0LCBzdHlsZSwgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHQsIHN0eWxlLCBjYW52YXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZTJkJztcclxuICAgICAgICAgICAgX3RoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUZXh0MmQucHJvdG90eXBlLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qLmFmZmluZSA/IHRoaXMudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtIDogdGhpcy5wcm9qLndvcmxkO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gVGV4dDJkO1xyXG4gICAgfShQSVhJLlRleHQpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5UZXh0MmQgPSBUZXh0MmQ7XHJcbiAgICBUZXh0MmQucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgIFRleHQyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICBUZXh0MmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMmQucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBQcm9qZWN0aW9uc01hbmFnZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIFByb2plY3Rpb25zTWFuYWdlcihyZW5kZXJlcikge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29udGV4dENoYW5nZSA9IGZ1bmN0aW9uIChnbCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZ2wgPSBnbDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJlbmRlcmVyLm1hc2tNYW5hZ2VyLnB1c2hTcHJpdGVNYXNrID0gcHVzaFNwcml0ZU1hc2s7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcclxuICAgICAgICAgICAgcmVuZGVyZXIub24oJ2NvbnRleHQnLCB0aGlzLm9uQ29udGV4dENoYW5nZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFByb2plY3Rpb25zTWFuYWdlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5vZmYoJ2NvbnRleHQnLCB0aGlzLm9uQ29udGV4dENoYW5nZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gUHJvamVjdGlvbnNNYW5hZ2VyO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uc01hbmFnZXIgPSBQcm9qZWN0aW9uc01hbmFnZXI7XHJcbiAgICBmdW5jdGlvbiBwdXNoU3ByaXRlTWFzayh0YXJnZXQsIG1hc2tEYXRhKSB7XHJcbiAgICAgICAgdmFyIGFscGhhTWFza0ZpbHRlciA9IHRoaXMuYWxwaGFNYXNrUG9vbFt0aGlzLmFscGhhTWFza0luZGV4XTtcclxuICAgICAgICBpZiAoIWFscGhhTWFza0ZpbHRlcikge1xyXG4gICAgICAgICAgICBhbHBoYU1hc2tGaWx0ZXIgPSB0aGlzLmFscGhhTWFza1Bvb2xbdGhpcy5hbHBoYU1hc2tJbmRleF0gPSBbbmV3IHBpeGlfcHJvamVjdGlvbi5TcHJpdGVNYXNrRmlsdGVyMmQobWFza0RhdGEpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWxwaGFNYXNrRmlsdGVyWzBdLnJlc29sdXRpb24gPSB0aGlzLnJlbmRlcmVyLnJlc29sdXRpb247XHJcbiAgICAgICAgYWxwaGFNYXNrRmlsdGVyWzBdLm1hc2tTcHJpdGUgPSBtYXNrRGF0YTtcclxuICAgICAgICB0YXJnZXQuZmlsdGVyQXJlYSA9IG1hc2tEYXRhLmdldEJvdW5kcyh0cnVlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLmZpbHRlck1hbmFnZXIucHVzaEZpbHRlcih0YXJnZXQsIGFscGhhTWFza0ZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5hbHBoYU1hc2tJbmRleCsrO1xyXG4gICAgfVxyXG4gICAgUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdwcm9qZWN0aW9ucycsIFByb2plY3Rpb25zTWFuYWdlcik7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBzcHJpdGVNYXNrVmVydCA9IFwiXFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIG90aGVyTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMyB2TWFza0Nvb3JkO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG5cXHRnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG5cXG5cXHR2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG5cXHR2TWFza0Nvb3JkID0gb3RoZXJNYXRyaXggKiB2ZWMzKCBhVGV4dHVyZUNvb3JkLCAxLjApO1xcbn1cXG5cIjtcclxuICAgIHZhciBzcHJpdGVNYXNrRnJhZyA9IFwiXFxudmFyeWluZyB2ZWMzIHZNYXNrQ29vcmQ7XFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBhbHBoYTtcXG51bmlmb3JtIHNhbXBsZXIyRCBtYXNrO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgdmVjMiB1diA9IHZNYXNrQ29vcmQueHkgLyB2TWFza0Nvb3JkLno7XFxuICAgIFxcbiAgICB2ZWMyIHRleHQgPSBhYnMoIHV2IC0gMC41ICk7XFxuICAgIHRleHQgPSBzdGVwKDAuNSwgdGV4dCk7XFxuXFxuICAgIGZsb2F0IGNsaXAgPSAxLjAgLSBtYXgodGV4dC55LCB0ZXh0LngpO1xcbiAgICB2ZWM0IG9yaWdpbmFsID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG4gICAgdmVjNCBtYXNreSA9IHRleHR1cmUyRChtYXNrLCB1dik7XFxuXFxuICAgIG9yaWdpbmFsICo9IChtYXNreS5yICogbWFza3kuYSAqIGFscGhhICogY2xpcCk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IG9yaWdpbmFsO1xcbn1cXG5cIjtcclxuICAgIHZhciB0ZW1wTWF0ID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgdmFyIFNwcml0ZU1hc2tGaWx0ZXIyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZU1hc2tGaWx0ZXIyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGVNYXNrRmlsdGVyMmQoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNwcml0ZU1hc2tWZXJ0LCBzcHJpdGVNYXNrRnJhZykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMubWFza01hdHJpeCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgc3ByaXRlLnJlbmRlcmFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgX3RoaXMubWFza1Nwcml0ZSA9IHNwcml0ZTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGVNYXNrRmlsdGVyMmQucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKGZpbHRlck1hbmFnZXIsIGlucHV0LCBvdXRwdXQsIGNsZWFyLCBjdXJyZW50U3RhdGUpIHtcclxuICAgICAgICAgICAgdmFyIG1hc2tTcHJpdGUgPSB0aGlzLm1hc2tTcHJpdGU7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybXMubWFzayA9IG1hc2tTcHJpdGUudGV4dHVyZTtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3Jtcy5vdGhlck1hdHJpeCA9IFNwcml0ZU1hc2tGaWx0ZXIyZC5jYWxjdWxhdGVTcHJpdGVNYXRyaXgoY3VycmVudFN0YXRlLCB0aGlzLm1hc2tNYXRyaXgsIG1hc2tTcHJpdGUpO1xyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1zLmFscGhhID0gbWFza1Nwcml0ZS53b3JsZEFscGhhO1xyXG4gICAgICAgICAgICBmaWx0ZXJNYW5hZ2VyLmFwcGx5RmlsdGVyKHRoaXMsIGlucHV0LCBvdXRwdXQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlTWFza0ZpbHRlcjJkLmNhbGN1bGF0ZVNwcml0ZU1hdHJpeCA9IGZ1bmN0aW9uIChjdXJyZW50U3RhdGUsIG1hcHBlZE1hdHJpeCwgc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9qID0gc3ByaXRlLnByb2o7XHJcbiAgICAgICAgICAgIHZhciBmaWx0ZXJBcmVhID0gY3VycmVudFN0YXRlLnNvdXJjZUZyYW1lO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZVNpemUgPSBjdXJyZW50U3RhdGUucmVuZGVyVGFyZ2V0LnNpemU7XHJcbiAgICAgICAgICAgIHZhciB3b3JsZFRyYW5zZm9ybSA9IHByb2ogJiYgIXByb2ouX2FmZmluZSA/IHByb2oud29ybGQuY29weVRvKHRlbXBNYXQpIDogdGVtcE1hdC5jb3B5RnJvbShzcHJpdGUudHJhbnNmb3JtLndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSBzcHJpdGUudGV4dHVyZS5vcmlnO1xyXG4gICAgICAgICAgICBtYXBwZWRNYXRyaXguc2V0KHRleHR1cmVTaXplLndpZHRoLCAwLCAwLCB0ZXh0dXJlU2l6ZS5oZWlnaHQsIGZpbHRlckFyZWEueCwgZmlsdGVyQXJlYS55KTtcclxuICAgICAgICAgICAgd29ybGRUcmFuc2Zvcm0uaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgIG1hcHBlZE1hdHJpeC5zZXRUb011bHQyZCh3b3JsZFRyYW5zZm9ybSwgbWFwcGVkTWF0cml4KTtcclxuICAgICAgICAgICAgbWFwcGVkTWF0cml4LnNjYWxlQW5kVHJhbnNsYXRlKDEuMCAvIHRleHR1cmUud2lkdGgsIDEuMCAvIHRleHR1cmUuaGVpZ2h0LCBzcHJpdGUuYW5jaG9yLngsIHNwcml0ZS5hbmNob3IueSk7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXBwZWRNYXRyaXg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlTWFza0ZpbHRlcjJkO1xyXG4gICAgfShQSVhJLkZpbHRlcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZU1hc2tGaWx0ZXIyZCA9IFNwcml0ZU1hc2tGaWx0ZXIyZDtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLXByb2plY3Rpb24uanMubWFwIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyohXG4gKiBwaXhpLXNvdW5kIC0gdjIuMC4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcGl4aWpzL3BpeGktc291bmRcbiAqIENvbXBpbGVkIFR1ZSwgMTQgTm92IDIwMTcgMTc6NTM6NDcgVVRDXG4gKlxuICogcGl4aS1zb3VuZCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP3QoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLHQpOnQoZS5fX3BpeGlTb3VuZD1lLl9fcGl4aVNvdW5kfHx7fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlLHQpe2Z1bmN0aW9uIG4oKXt0aGlzLmNvbnN0cnVjdG9yPWV9byhlLHQpLGUucHJvdG90eXBlPW51bGw9PT10P09iamVjdC5jcmVhdGUodCk6KG4ucHJvdG90eXBlPXQucHJvdG90eXBlLG5ldyBuKX1pZihcInVuZGVmaW5lZFwiPT10eXBlb2YgUElYSSl0aHJvd1wiUGl4aUpTIHJlcXVpcmVkXCI7dmFyIG49ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5fb3V0cHV0PXQsdGhpcy5faW5wdXQ9ZX1yZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZGVzdGluYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2lucHV0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2ZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt2YXIgdD10aGlzO2lmKHRoaXMuX2ZpbHRlcnMmJih0aGlzLl9maWx0ZXJzLmZvckVhY2goZnVuY3Rpb24oZSl7ZSYmZS5kaXNjb25uZWN0KCl9KSx0aGlzLl9maWx0ZXJzPW51bGwsdGhpcy5faW5wdXQuY29ubmVjdCh0aGlzLl9vdXRwdXQpKSxlJiZlLmxlbmd0aCl7dGhpcy5fZmlsdGVycz1lLnNsaWNlKDApLHRoaXMuX2lucHV0LmRpc2Nvbm5lY3QoKTt2YXIgbj1udWxsO2UuZm9yRWFjaChmdW5jdGlvbihlKXtudWxsPT09bj90Ll9pbnB1dC5jb25uZWN0KGUuZGVzdGluYXRpb24pOm4uY29ubmVjdChlLmRlc3RpbmF0aW9uKSxuPWV9KSxuLmNvbm5lY3QodGhpcy5fb3V0cHV0KX19LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuZmlsdGVycz1udWxsLHRoaXMuX2lucHV0PW51bGwsdGhpcy5fb3V0cHV0PW51bGx9LGV9KCksbz1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fHtfX3Byb3RvX186W119aW5zdGFuY2VvZiBBcnJheSYmZnVuY3Rpb24oZSx0KXtlLl9fcHJvdG9fXz10fXx8ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG4gaW4gdCl0Lmhhc093blByb3BlcnR5KG4pJiYoZVtuXT10W25dKX0saT0wLHI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2YXIgbj1lLmNhbGwodGhpcyl8fHRoaXM7cmV0dXJuIG4uaWQ9aSsrLG4uaW5pdCh0KSxufXJldHVybiB0KG4sZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicHJvZ3Jlc3NcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZS5jdXJyZW50VGltZS90aGlzLl9kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3BhdXNlZD1lLHRoaXMucmVmcmVzaFBhdXNlZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLl9vblBsYXk9ZnVuY3Rpb24oKXt0aGlzLl9wbGF5aW5nPSEwfSxuLnByb3RvdHlwZS5fb25QYXVzZT1mdW5jdGlvbigpe3RoaXMuX3BsYXlpbmc9ITF9LG4ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5fcGxheWluZz0hMSx0aGlzLl9kdXJhdGlvbj1lLnNvdXJjZS5kdXJhdGlvbjt2YXIgdD10aGlzLl9zb3VyY2U9ZS5zb3VyY2UuY2xvbmVOb2RlKCExKTt0LnNyYz1lLnBhcmVudC51cmwsdC5vbnBsYXk9dGhpcy5fb25QbGF5LmJpbmQodGhpcyksdC5vbnBhdXNlPXRoaXMuX29uUGF1c2UuYmluZCh0aGlzKSxlLmNvbnRleHQub24oXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLGUuY29udGV4dC5vbihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyksdGhpcy5fbWVkaWE9ZX0sbi5wcm90b3R5cGUuX2ludGVybmFsU3RvcD1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmdGhpcy5fcGxheWluZyYmKHRoaXMuX3NvdXJjZS5vbmVuZGVkPW51bGwsdGhpcy5fc291cmNlLnBhdXNlKCkpfSxuLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7dGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5fc291cmNlJiZ0aGlzLmVtaXQoXCJzdG9wXCIpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzcGVlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3BlZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zcGVlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInZvbHVtZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fdm9sdW1lPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibG9vcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbG9vcH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2xvb3A9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJtdXRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbXV0ZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9tdXRlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50O3RoaXMuX3NvdXJjZS5sb29wPXRoaXMuX2xvb3B8fHQubG9vcDt2YXIgbj1lLnZvbHVtZSooZS5tdXRlZD8wOjEpLG89dC52b2x1bWUqKHQubXV0ZWQ/MDoxKSxpPXRoaXMuX3ZvbHVtZSoodGhpcy5fbXV0ZWQ/MDoxKTt0aGlzLl9zb3VyY2Uudm9sdW1lPWkqbipvLHRoaXMuX3NvdXJjZS5wbGF5YmFja1JhdGU9dGhpcy5fc3BlZWQqZS5zcGVlZCp0LnNwZWVkfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudCxuPXRoaXMuX3BhdXNlZHx8dC5wYXVzZWR8fGUucGF1c2VkO24hPT10aGlzLl9wYXVzZWRSZWFsJiYodGhpcy5fcGF1c2VkUmVhbD1uLG4/KHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInBhdXNlZFwiKSk6KHRoaXMuZW1pdChcInJlc3VtZWRcIiksdGhpcy5wbGF5KHtzdGFydDp0aGlzLl9zb3VyY2UuY3VycmVudFRpbWUsZW5kOnRoaXMuX2VuZCx2b2x1bWU6dGhpcy5fdm9sdW1lLHNwZWVkOnRoaXMuX3NwZWVkLGxvb3A6dGhpcy5fbG9vcH0pKSx0aGlzLmVtaXQoXCJwYXVzZVwiLG4pKX0sbi5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlKXt2YXIgdD10aGlzLG89ZS5zdGFydCxpPWUuZW5kLHI9ZS5zcGVlZCxzPWUubG9vcCx1PWUudm9sdW1lLGE9ZS5tdXRlZDtpJiZjb25zb2xlLmFzc2VydChpPm8sXCJFbmQgdGltZSBpcyBiZWZvcmUgc3RhcnQgdGltZVwiKSx0aGlzLl9zcGVlZD1yLHRoaXMuX3ZvbHVtZT11LHRoaXMuX2xvb3A9ISFzLHRoaXMuX211dGVkPWEsdGhpcy5yZWZyZXNoKCksdGhpcy5sb29wJiZudWxsIT09aSYmKGNvbnNvbGUud2FybignTG9vcGluZyBub3Qgc3VwcG9ydCB3aGVuIHNwZWNpZnlpbmcgYW4gXCJlbmRcIiB0aW1lJyksdGhpcy5sb29wPSExKSx0aGlzLl9zdGFydD1vLHRoaXMuX2VuZD1pfHx0aGlzLl9kdXJhdGlvbix0aGlzLl9zdGFydD1NYXRoLm1heCgwLHRoaXMuX3N0YXJ0LW4uUEFERElORyksdGhpcy5fZW5kPU1hdGgubWluKHRoaXMuX2VuZCtuLlBBRERJTkcsdGhpcy5fZHVyYXRpb24pLHRoaXMuX3NvdXJjZS5vbmxvYWRlZG1ldGFkYXRhPWZ1bmN0aW9uKCl7dC5fc291cmNlJiYodC5fc291cmNlLmN1cnJlbnRUaW1lPW8sdC5fc291cmNlLm9ubG9hZGVkbWV0YWRhdGE9bnVsbCx0LmVtaXQoXCJwcm9ncmVzc1wiLG8sdC5fZHVyYXRpb24pLFBJWEkudGlja2VyLnNoYXJlZC5hZGQodC5fb25VcGRhdGUsdCkpfSx0aGlzLl9zb3VyY2Uub25lbmRlZD10aGlzLl9vbkNvbXBsZXRlLmJpbmQodGhpcyksdGhpcy5fc291cmNlLnBsYXkoKSx0aGlzLmVtaXQoXCJzdGFydFwiKX0sbi5wcm90b3R5cGUuX29uVXBkYXRlPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwicHJvZ3Jlc3NcIix0aGlzLnByb2dyZXNzLHRoaXMuX2R1cmF0aW9uKSx0aGlzLl9zb3VyY2UuY3VycmVudFRpbWU+PXRoaXMuX2VuZCYmIXRoaXMuX3NvdXJjZS5sb29wJiZ0aGlzLl9vbkNvbXBsZXRlKCl9LG4ucHJvdG90eXBlLl9vbkNvbXBsZXRlPWZ1bmN0aW9uKCl7UElYSS50aWNrZXIuc2hhcmVkLnJlbW92ZSh0aGlzLl9vblVwZGF0ZSx0aGlzKSx0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLDEsdGhpcy5fZHVyYXRpb24pLHRoaXMuZW1pdChcImVuZFwiLHRoaXMpfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7UElYSS50aWNrZXIuc2hhcmVkLnJlbW92ZSh0aGlzLl9vblVwZGF0ZSx0aGlzKSx0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO3ZhciBlPXRoaXMuX3NvdXJjZTtlJiYoZS5vbmVuZGVkPW51bGwsZS5vbnBsYXk9bnVsbCxlLm9ucGF1c2U9bnVsbCx0aGlzLl9pbnRlcm5hbFN0b3AoKSksdGhpcy5fc291cmNlPW51bGwsdGhpcy5fc3BlZWQ9MSx0aGlzLl92b2x1bWU9MSx0aGlzLl9sb29wPSExLHRoaXMuX2VuZD1udWxsLHRoaXMuX3N0YXJ0PTAsdGhpcy5fZHVyYXRpb249MCx0aGlzLl9wbGF5aW5nPSExLHRoaXMuX3BhdXNlZFJlYWw9ITEsdGhpcy5fcGF1c2VkPSExLHRoaXMuX211dGVkPSExLHRoaXMuX21lZGlhJiYodGhpcy5fbWVkaWEuY29udGV4dC5vZmYoXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLHRoaXMuX21lZGlhLmNvbnRleHQub2ZmKFwicmVmcmVzaFBhdXNlZFwiLHRoaXMucmVmcmVzaFBhdXNlZCx0aGlzKSx0aGlzLl9tZWRpYT1udWxsKX0sbi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIltIVE1MQXVkaW9JbnN0YW5jZSBpZD1cIit0aGlzLmlkK1wiXVwifSxuLlBBRERJTkc9LjEsbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLHM9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbigpe3JldHVybiBudWxsIT09ZSYmZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl8fHRoaXN9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMucGFyZW50PWUsdGhpcy5fc291cmNlPWUub3B0aW9ucy5zb3VyY2V8fG5ldyBBdWRpbyxlLnVybCYmKHRoaXMuX3NvdXJjZS5zcmM9ZS51cmwpfSxuLnByb3RvdHlwZS5jcmVhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IHIodGhpcyl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImlzUGxheWFibGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuISF0aGlzLl9zb3VyY2UmJjQ9PT10aGlzLl9zb3VyY2UucmVhZHlTdGF0ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJkdXJhdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlLmR1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGFyZW50LmNvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0sc2V0OmZ1bmN0aW9uKGUpe2NvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBmaWx0ZXJzXCIpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMucGFyZW50PW51bGwsdGhpcy5fc291cmNlJiYodGhpcy5fc291cmNlLnNyYz1cIlwiLHRoaXMuX3NvdXJjZS5sb2FkKCksdGhpcy5fc291cmNlPW51bGwpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJzb3VyY2VcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX3NvdXJjZSxuPXRoaXMucGFyZW50O2lmKDQ9PT10LnJlYWR5U3RhdGUpe24uaXNMb2FkZWQ9ITA7dmFyIG89bi5hdXRvUGxheVN0YXJ0KCk7cmV0dXJuIHZvaWQoZSYmc2V0VGltZW91dChmdW5jdGlvbigpe2UobnVsbCxuLG8pfSwwKSl9aWYoIW4udXJsKXJldHVybiBlKG5ldyBFcnJvcihcInNvdW5kLnVybCBvciBzb3VuZC5zb3VyY2UgbXVzdCBiZSBzZXRcIikpO3Quc3JjPW4udXJsO3ZhciBpPWZ1bmN0aW9uKCl7dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2FucGxheXRocm91Z2hcIixyKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsciksdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIixzKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLHUpfSxyPWZ1bmN0aW9uKCl7aSgpLG4uaXNMb2FkZWQ9ITA7dmFyIHQ9bi5hdXRvUGxheVN0YXJ0KCk7ZSYmZShudWxsLG4sdCl9LHM9ZnVuY3Rpb24oKXtpKCksZSYmZShuZXcgRXJyb3IoXCJTb3VuZCBsb2FkaW5nIGhhcyBiZWVuIGFib3J0ZWRcIikpfSx1PWZ1bmN0aW9uKCl7aSgpO3ZhciBuPVwiRmFpbGVkIHRvIGxvYWQgYXVkaW8gZWxlbWVudCAoY29kZTogXCIrdC5lcnJvci5jb2RlK1wiKVwiO2U/ZShuZXcgRXJyb3IobikpOmNvbnNvbGUuZXJyb3Iobil9O3QuYWRkRXZlbnRMaXN0ZW5lcihcImNhbnBsYXl0aHJvdWdoXCIsciwhMSksdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLHIsITEpLHQuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIscywhMSksdC5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIix1LCExKSx0LmxvYWQoKX0sbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLHU9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjp7fSxhPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHQ9e2V4cG9ydHM6e319LGUodCx0LmV4cG9ydHMpLHQuZXhwb3J0c30oZnVuY3Rpb24oZSl7IWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIG4oKXt9ZnVuY3Rpb24gbyhlLHQpe3JldHVybiBmdW5jdGlvbigpe2UuYXBwbHkodCxhcmd1bWVudHMpfX1mdW5jdGlvbiBpKGUpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiB0aGlzKXRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXdcIik7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwibm90IGEgZnVuY3Rpb25cIik7dGhpcy5fc3RhdGU9MCx0aGlzLl9oYW5kbGVkPSExLHRoaXMuX3ZhbHVlPXZvaWQgMCx0aGlzLl9kZWZlcnJlZHM9W10sbChlLHRoaXMpfWZ1bmN0aW9uIHIoZSx0KXtmb3IoOzM9PT1lLl9zdGF0ZTspZT1lLl92YWx1ZTtpZigwPT09ZS5fc3RhdGUpcmV0dXJuIHZvaWQgZS5fZGVmZXJyZWRzLnB1c2godCk7ZS5faGFuZGxlZD0hMCxpLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpe3ZhciBuPTE9PT1lLl9zdGF0ZT90Lm9uRnVsZmlsbGVkOnQub25SZWplY3RlZDtpZihudWxsPT09bilyZXR1cm4gdm9pZCgxPT09ZS5fc3RhdGU/czp1KSh0LnByb21pc2UsZS5fdmFsdWUpO3ZhciBvO3RyeXtvPW4oZS5fdmFsdWUpfWNhdGNoKGUpe3JldHVybiB2b2lkIHUodC5wcm9taXNlLGUpfXModC5wcm9taXNlLG8pfSl9ZnVuY3Rpb24gcyhlLHQpe3RyeXtpZih0PT09ZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi5cIik7aWYodCYmKFwib2JqZWN0XCI9PXR5cGVvZiB0fHxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0KSl7dmFyIG49dC50aGVuO2lmKHQgaW5zdGFuY2VvZiBpKXJldHVybiBlLl9zdGF0ZT0zLGUuX3ZhbHVlPXQsdm9pZCBhKGUpO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG4pcmV0dXJuIHZvaWQgbChvKG4sdCksZSl9ZS5fc3RhdGU9MSxlLl92YWx1ZT10LGEoZSl9Y2F0Y2godCl7dShlLHQpfX1mdW5jdGlvbiB1KGUsdCl7ZS5fc3RhdGU9MixlLl92YWx1ZT10LGEoZSl9ZnVuY3Rpb24gYShlKXsyPT09ZS5fc3RhdGUmJjA9PT1lLl9kZWZlcnJlZHMubGVuZ3RoJiZpLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpe2UuX2hhbmRsZWR8fGkuX3VuaGFuZGxlZFJlamVjdGlvbkZuKGUuX3ZhbHVlKX0pO2Zvcih2YXIgdD0wLG49ZS5fZGVmZXJyZWRzLmxlbmd0aDt0PG47dCsrKXIoZSxlLl9kZWZlcnJlZHNbdF0pO2UuX2RlZmVycmVkcz1udWxsfWZ1bmN0aW9uIGMoZSx0LG4pe3RoaXMub25GdWxmaWxsZWQ9XCJmdW5jdGlvblwiPT10eXBlb2YgZT9lOm51bGwsdGhpcy5vblJlamVjdGVkPVwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dDpudWxsLHRoaXMucHJvbWlzZT1ufWZ1bmN0aW9uIGwoZSx0KXt2YXIgbj0hMTt0cnl7ZShmdW5jdGlvbihlKXtufHwobj0hMCxzKHQsZSkpfSxmdW5jdGlvbihlKXtufHwobj0hMCx1KHQsZSkpfSl9Y2F0Y2goZSl7aWYobilyZXR1cm47bj0hMCx1KHQsZSl9fXZhciBwPXNldFRpbWVvdXQ7aS5wcm90b3R5cGUuY2F0Y2g9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMudGhlbihudWxsLGUpfSxpLnByb3RvdHlwZS50aGVuPWZ1bmN0aW9uKGUsdCl7dmFyIG89bmV3IHRoaXMuY29uc3RydWN0b3Iobik7cmV0dXJuIHIodGhpcyxuZXcgYyhlLHQsbykpLG99LGkuYWxsPWZ1bmN0aW9uKGUpe3ZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGUpO3JldHVybiBuZXcgaShmdW5jdGlvbihlLG4pe2Z1bmN0aW9uIG8ocixzKXt0cnl7aWYocyYmKFwib2JqZWN0XCI9PXR5cGVvZiBzfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBzKSl7dmFyIHU9cy50aGVuO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHUpcmV0dXJuIHZvaWQgdS5jYWxsKHMsZnVuY3Rpb24oZSl7byhyLGUpfSxuKX10W3JdPXMsMD09LS1pJiZlKHQpfWNhdGNoKGUpe24oZSl9fWlmKDA9PT10Lmxlbmd0aClyZXR1cm4gZShbXSk7Zm9yKHZhciBpPXQubGVuZ3RoLHI9MDtyPHQubGVuZ3RoO3IrKylvKHIsdFtyXSl9KX0saS5yZXNvbHZlPWZ1bmN0aW9uKGUpe3JldHVybiBlJiZcIm9iamVjdFwiPT10eXBlb2YgZSYmZS5jb25zdHJ1Y3Rvcj09PWk/ZTpuZXcgaShmdW5jdGlvbih0KXt0KGUpfSl9LGkucmVqZWN0PWZ1bmN0aW9uKGUpe3JldHVybiBuZXcgaShmdW5jdGlvbih0LG4pe24oZSl9KX0saS5yYWNlPWZ1bmN0aW9uKGUpe3JldHVybiBuZXcgaShmdW5jdGlvbih0LG4pe2Zvcih2YXIgbz0wLGk9ZS5sZW5ndGg7bzxpO28rKyllW29dLnRoZW4odCxuKX0pfSxpLl9pbW1lZGlhdGVGbj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBzZXRJbW1lZGlhdGUmJmZ1bmN0aW9uKGUpe3NldEltbWVkaWF0ZShlKX18fGZ1bmN0aW9uKGUpe3AoZSwwKX0saS5fdW5oYW5kbGVkUmVqZWN0aW9uRm49ZnVuY3Rpb24oZSl7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGNvbnNvbGUmJmNvbnNvbGUmJmNvbnNvbGUud2FybihcIlBvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjpcIixlKX0saS5fc2V0SW1tZWRpYXRlRm49ZnVuY3Rpb24oZSl7aS5faW1tZWRpYXRlRm49ZX0saS5fc2V0VW5oYW5kbGVkUmVqZWN0aW9uRm49ZnVuY3Rpb24oZSl7aS5fdW5oYW5kbGVkUmVqZWN0aW9uRm49ZX0sZS5leHBvcnRzP2UuZXhwb3J0cz1pOnQuUHJvbWlzZXx8KHQuUHJvbWlzZT1pKX0odSl9KSxjPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMuZGVzdGluYXRpb249ZSx0aGlzLnNvdXJjZT10fHxlfXJldHVybiBlLnByb3RvdHlwZS5jb25uZWN0PWZ1bmN0aW9uKGUpe3RoaXMuc291cmNlLmNvbm5lY3QoZSl9LGUucHJvdG90eXBlLmRpc2Nvbm5lY3Q9ZnVuY3Rpb24oKXt0aGlzLnNvdXJjZS5kaXNjb25uZWN0KCl9LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmRpc2Nvbm5lY3QoKSx0aGlzLmRlc3RpbmF0aW9uPW51bGwsdGhpcy5zb3VyY2U9bnVsbH0sZX0oKSxsPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5zZXRQYXJhbVZhbHVlPWZ1bmN0aW9uKGUsdCl7aWYoZS5zZXRWYWx1ZUF0VGltZSl7dmFyIG49Uy5pbnN0YW5jZS5jb250ZXh0O2Uuc2V0VmFsdWVBdFRpbWUodCxuLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSl9ZWxzZSBlLnZhbHVlPXQ7cmV0dXJuIHR9LGV9KCkscD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQsbyxpLHIscyx1LGEsYyxwLGgpe3ZvaWQgMD09PXQmJih0PTApLHZvaWQgMD09PW8mJihvPTApLHZvaWQgMD09PWkmJihpPTApLHZvaWQgMD09PXImJihyPTApLHZvaWQgMD09PXMmJihzPTApLHZvaWQgMD09PXUmJih1PTApLHZvaWQgMD09PWEmJihhPTApLHZvaWQgMD09PWMmJihjPTApLHZvaWQgMD09PXAmJihwPTApLHZvaWQgMD09PWgmJihoPTApO3ZhciBkPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQoZD1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIGY9W3tmOm4uRjMyLHR5cGU6XCJsb3dzaGVsZlwiLGdhaW46dH0se2Y6bi5GNjQsdHlwZTpcInBlYWtpbmdcIixnYWluOm99LHtmOm4uRjEyNSx0eXBlOlwicGVha2luZ1wiLGdhaW46aX0se2Y6bi5GMjUwLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpyfSx7ZjpuLkY1MDAsdHlwZTpcInBlYWtpbmdcIixnYWluOnN9LHtmOm4uRjFLLHR5cGU6XCJwZWFraW5nXCIsZ2Fpbjp1fSx7ZjpuLkYySyx0eXBlOlwicGVha2luZ1wiLGdhaW46YX0se2Y6bi5GNEssdHlwZTpcInBlYWtpbmdcIixnYWluOmN9LHtmOm4uRjhLLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpwfSx7ZjpuLkYxNkssdHlwZTpcImhpZ2hzaGVsZlwiLGdhaW46aH1dLm1hcChmdW5jdGlvbihlKXt2YXIgdD1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO3JldHVybiB0LnR5cGU9ZS50eXBlLGwuc2V0UGFyYW1WYWx1ZSh0LmdhaW4sZS5nYWluKSxsLnNldFBhcmFtVmFsdWUodC5RLDEpLGwuc2V0UGFyYW1WYWx1ZSh0LmZyZXF1ZW5jeSxlLmYpLHR9KTsoZD1lLmNhbGwodGhpcyxmWzBdLGZbZi5sZW5ndGgtMV0pfHx0aGlzKS5iYW5kcz1mLGQuYmFuZHNNYXA9e307Zm9yKHZhciBfPTA7XzxkLmJhbmRzLmxlbmd0aDtfKyspe3ZhciB5PWQuYmFuZHNbX107Xz4wJiZkLmJhbmRzW18tMV0uY29ubmVjdCh5KSxkLmJhbmRzTWFwW3kuZnJlcXVlbmN5LnZhbHVlXT15fXJldHVybiBkfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuc2V0R2Fpbj1mdW5jdGlvbihlLHQpe2lmKHZvaWQgMD09PXQmJih0PTApLCF0aGlzLmJhbmRzTWFwW2VdKXRocm93XCJObyBiYW5kIGZvdW5kIGZvciBmcmVxdWVuY3kgXCIrZTtsLnNldFBhcmFtVmFsdWUodGhpcy5iYW5kc01hcFtlXS5nYWluLHQpfSxuLnByb3RvdHlwZS5nZXRHYWluPWZ1bmN0aW9uKGUpe2lmKCF0aGlzLmJhbmRzTWFwW2VdKXRocm93XCJObyBiYW5kIGZvdW5kIGZvciBmcmVxdWVuY3kgXCIrZTtyZXR1cm4gdGhpcy5iYW5kc01hcFtlXS5nYWluLnZhbHVlfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMzJcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYzMil9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMzIsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjY0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GNjQpfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjY0LGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYxMjVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYxMjUpfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjEyNSxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMjUwXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMjUwKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYyNTAsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjUwMFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjUwMCl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GNTAwLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImYxa1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjFLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYxSyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMmtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYySyl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMkssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjRrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GNEspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjRLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY4a1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjhLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY4SyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMTZrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMTZLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYxNkssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLmJhbmRzLmZvckVhY2goZnVuY3Rpb24oZSl7bC5zZXRQYXJhbVZhbHVlKGUuZ2FpbiwwKX0pfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5iYW5kcy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UuZGlzY29ubmVjdCgpfSksdGhpcy5iYW5kcz1udWxsLHRoaXMuYmFuZHNNYXA9bnVsbH0sbi5GMzI9MzIsbi5GNjQ9NjQsbi5GMTI1PTEyNSxuLkYyNTA9MjUwLG4uRjUwMD01MDAsbi5GMUs9MWUzLG4uRjJLPTJlMyxuLkY0Sz00ZTMsbi5GOEs9OGUzLG4uRjE2Sz0xNmUzLG59KGMpLGg9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2b2lkIDA9PT10JiYodD0wKTt2YXIgbj10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKG49ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBvPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlV2F2ZVNoYXBlcigpO3JldHVybiBuPWUuY2FsbCh0aGlzLG8pfHx0aGlzLG4uX2Rpc3RvcnRpb249byxuLmFtb3VudD10LG59cmV0dXJuIHQobixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJhbW91bnRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Ftb3VudH0sc2V0OmZ1bmN0aW9uKGUpe2UqPTFlMyx0aGlzLl9hbW91bnQ9ZTtmb3IodmFyIHQsbj1uZXcgRmxvYXQzMkFycmF5KDQ0MTAwKSxvPU1hdGguUEkvMTgwLGk9MDtpPDQ0MTAwOysraSl0PTIqaS80NDEwMC0xLG5baV09KDMrZSkqdCoyMCpvLyhNYXRoLlBJK2UqTWF0aC5hYnModCkpO3RoaXMuX2Rpc3RvcnRpb24uY3VydmU9bix0aGlzLl9kaXN0b3J0aW9uLm92ZXJzYW1wbGU9XCI0eFwifSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9kaXN0b3J0aW9uPW51bGwsZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpfSxufShjKSxkPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dm9pZCAwPT09dCYmKHQ9MCk7dmFyIG49dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChuPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgbyxpLHIscz1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0O3JldHVybiBzLmNyZWF0ZVN0ZXJlb1Bhbm5lcj9yPW89cy5jcmVhdGVTdGVyZW9QYW5uZXIoKTooKGk9cy5jcmVhdGVQYW5uZXIoKSkucGFubmluZ01vZGVsPVwiZXF1YWxwb3dlclwiLHI9aSksbj1lLmNhbGwodGhpcyxyKXx8dGhpcyxuLl9zdGVyZW89byxuLl9wYW5uZXI9aSxuLnBhbj10LG59cmV0dXJuIHQobixlKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYW5cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bhbn0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3Bhbj1lLHRoaXMuX3N0ZXJlbz9sLnNldFBhcmFtVmFsdWUodGhpcy5fc3RlcmVvLnBhbixlKTp0aGlzLl9wYW5uZXIuc2V0UG9zaXRpb24oZSwwLDEtTWF0aC5hYnMoZSkpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyksdGhpcy5fc3RlcmVvPW51bGwsdGhpcy5fcGFubmVyPW51bGx9LG59KGMpLGY9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG4sbyl7dm9pZCAwPT09dCYmKHQ9Myksdm9pZCAwPT09biYmKG49Miksdm9pZCAwPT09byYmKG89ITEpO3ZhciBpPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQoaT1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIHI9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVDb252b2x2ZXIoKTtyZXR1cm4gaT1lLmNhbGwodGhpcyxyKXx8dGhpcyxpLl9jb252b2x2ZXI9cixpLl9zZWNvbmRzPWkuX2NsYW1wKHQsMSw1MCksaS5fZGVjYXk9aS5fY2xhbXAobiwwLDEwMCksaS5fcmV2ZXJzZT1vLGkuX3JlYnVpbGQoKSxpfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuX2NsYW1wPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gTWF0aC5taW4obixNYXRoLm1heCh0LGUpKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic2Vjb25kc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc2Vjb25kc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NlY29uZHM9dGhpcy5fY2xhbXAoZSwxLDUwKSx0aGlzLl9yZWJ1aWxkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZGVjYXlcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2RlY2F5fSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fZGVjYXk9dGhpcy5fY2xhbXAoZSwwLDEwMCksdGhpcy5fcmVidWlsZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInJldmVyc2VcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JldmVyc2V9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9yZXZlcnNlPWUsdGhpcy5fcmVidWlsZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLl9yZWJ1aWxkPWZ1bmN0aW9uKCl7Zm9yKHZhciBlLHQ9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dCxuPXQuc2FtcGxlUmF0ZSxvPW4qdGhpcy5fc2Vjb25kcyxpPXQuY3JlYXRlQnVmZmVyKDIsbyxuKSxyPWkuZ2V0Q2hhbm5lbERhdGEoMCkscz1pLmdldENoYW5uZWxEYXRhKDEpLHU9MDt1PG87dSsrKWU9dGhpcy5fcmV2ZXJzZT9vLXU6dSxyW3VdPSgyKk1hdGgucmFuZG9tKCktMSkqTWF0aC5wb3coMS1lL28sdGhpcy5fZGVjYXkpLHNbdV09KDIqTWF0aC5yYW5kb20oKS0xKSpNYXRoLnBvdygxLWUvbyx0aGlzLl9kZWNheSk7dGhpcy5fY29udm9sdmVyLmJ1ZmZlcj1pfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fY29udm9sdmVyPW51bGwsZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpfSxufShjKSxfPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt2YXIgdD10aGlzO1MuaW5zdGFuY2UudXNlTGVnYWN5JiYodD1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIG49Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dCxvPW4uY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKCksaT1uLmNyZWF0ZUNoYW5uZWxNZXJnZXIoKTtyZXR1cm4gaS5jb25uZWN0KG8pLHQ9ZS5jYWxsKHRoaXMsaSxvKXx8dGhpcyx0Ll9tZXJnZXI9aSx0fXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX21lcmdlci5kaXNjb25uZWN0KCksdGhpcy5fbWVyZ2VyPW51bGwsZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpfSxufShjKSx5PWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXtpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChlLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIHQ9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dCxuPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCksbz10LmNyZWF0ZUJpcXVhZEZpbHRlcigpLGk9dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxyPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7cmV0dXJuIG4udHlwZT1cImxvd3Bhc3NcIixsLnNldFBhcmFtVmFsdWUobi5mcmVxdWVuY3ksMmUzKSxvLnR5cGU9XCJsb3dwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKG8uZnJlcXVlbmN5LDJlMyksaS50eXBlPVwiaGlnaHBhc3NcIixsLnNldFBhcmFtVmFsdWUoaS5mcmVxdWVuY3ksNTAwKSxyLnR5cGU9XCJoaWdocGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShyLmZyZXF1ZW5jeSw1MDApLG4uY29ubmVjdChvKSxvLmNvbm5lY3QoaSksaS5jb25uZWN0KHIpLGUuY2FsbCh0aGlzLG4scil8fHRoaXN9cmV0dXJuIHQobixlKSxufShjKSxtPU9iamVjdC5mcmVlemUoe0ZpbHRlcjpjLEVxdWFsaXplckZpbHRlcjpwLERpc3RvcnRpb25GaWx0ZXI6aCxTdGVyZW9GaWx0ZXI6ZCxSZXZlcmJGaWx0ZXI6ZixNb25vRmlsdGVyOl8sVGVsZXBob25lRmlsdGVyOnl9KSxiPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt2YXIgdD1lLmNhbGwodGhpcyl8fHRoaXM7cmV0dXJuIHQuc3BlZWQ9MSx0LnZvbHVtZT0xLHQubXV0ZWQ9ITEsdC5wYXVzZWQ9ITEsdH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt0aGlzLmVtaXQoXCJyZWZyZXNoXCIpfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwicmVmcmVzaFBhdXNlZFwiKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGZpbHRlcnNcIiksbnVsbH0sc2V0OmZ1bmN0aW9uKGUpe2NvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBmaWx0ZXJzXCIpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY29uc29sZS53YXJuKFwiSFRNTCBBdWRpbyBkb2VzIG5vdCBzdXBwb3J0IGF1ZGlvQ29udGV4dFwiKSxudWxsfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnRvZ2dsZU11dGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tdXRlZD0hdGhpcy5tdXRlZCx0aGlzLnJlZnJlc2goKSx0aGlzLm11dGVkfSxuLnByb3RvdHlwZS50b2dnbGVQYXVzZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdXNlZD0hdGhpcy5wYXVzZWQsdGhpcy5yZWZyZXNoUGF1c2VkKCksdGhpcy5wYXVzZWR9LG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpfSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlciksZz1PYmplY3QuZnJlZXplKHtIVE1MQXVkaW9NZWRpYTpzLEhUTUxBdWRpb0luc3RhbmNlOnIsSFRNTEF1ZGlvQ29udGV4dDpifSksdj0wLFA9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0KXt2YXIgbj1lLmNhbGwodGhpcyl8fHRoaXM7cmV0dXJuIG4uaWQ9disrLG4uX21lZGlhPW51bGwsbi5fcGF1c2VkPSExLG4uX211dGVkPSExLG4uX2VsYXBzZWQ9MCxuLl91cGRhdGVMaXN0ZW5lcj1uLl91cGRhdGUuYmluZChuKSxuLmluaXQodCksbn1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJih0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJzdG9wXCIpKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic3BlZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc3BlZWQ9ZSx0aGlzLnJlZnJlc2goKSx0aGlzLl91cGRhdGUoITApfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInZvbHVtZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fdm9sdW1lPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibXV0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX211dGVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbXV0ZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJsb29wXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9sb29wfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbG9vcD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9tZWRpYS5jb250ZXh0LHQ9dGhpcy5fbWVkaWEucGFyZW50O3RoaXMuX3NvdXJjZS5sb29wPXRoaXMuX2xvb3B8fHQubG9vcDt2YXIgbj1lLnZvbHVtZSooZS5tdXRlZD8wOjEpLG89dC52b2x1bWUqKHQubXV0ZWQ/MDoxKSxpPXRoaXMuX3ZvbHVtZSoodGhpcy5fbXV0ZWQ/MDoxKTtsLnNldFBhcmFtVmFsdWUodGhpcy5fZ2Fpbi5nYWluLGkqbypuKSxsLnNldFBhcmFtVmFsdWUodGhpcy5fc291cmNlLnBsYXliYWNrUmF0ZSx0aGlzLl9zcGVlZCp0LnNwZWVkKmUuc3BlZWQpfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudCxuPXRoaXMuX3BhdXNlZHx8dC5wYXVzZWR8fGUucGF1c2VkO24hPT10aGlzLl9wYXVzZWRSZWFsJiYodGhpcy5fcGF1c2VkUmVhbD1uLG4/KHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuZW1pdChcInBhdXNlZFwiKSk6KHRoaXMuZW1pdChcInJlc3VtZWRcIiksdGhpcy5wbGF5KHtzdGFydDp0aGlzLl9lbGFwc2VkJXRoaXMuX2R1cmF0aW9uLGVuZDp0aGlzLl9lbmQsc3BlZWQ6dGhpcy5fc3BlZWQsbG9vcDp0aGlzLl9sb29wLHZvbHVtZTp0aGlzLl92b2x1bWV9KSksdGhpcy5lbWl0KFwicGF1c2VcIixuKSl9LG4ucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5zdGFydCxuPWUuZW5kLG89ZS5zcGVlZCxpPWUubG9vcCxyPWUudm9sdW1lLHM9ZS5tdXRlZDtuJiZjb25zb2xlLmFzc2VydChuPnQsXCJFbmQgdGltZSBpcyBiZWZvcmUgc3RhcnQgdGltZVwiKSx0aGlzLl9wYXVzZWQ9ITE7dmFyIHU9dGhpcy5fbWVkaWEubm9kZXMuY2xvbmVCdWZmZXJTb3VyY2UoKSxhPXUuc291cmNlLGM9dS5nYWluO3RoaXMuX3NvdXJjZT1hLHRoaXMuX2dhaW49Yyx0aGlzLl9zcGVlZD1vLHRoaXMuX3ZvbHVtZT1yLHRoaXMuX2xvb3A9ISFpLHRoaXMuX211dGVkPXMsdGhpcy5yZWZyZXNoKCksdGhpcy5sb29wJiZudWxsIT09biYmKGNvbnNvbGUud2FybignTG9vcGluZyBub3Qgc3VwcG9ydCB3aGVuIHNwZWNpZnlpbmcgYW4gXCJlbmRcIiB0aW1lJyksdGhpcy5sb29wPSExKSx0aGlzLl9lbmQ9bjt2YXIgbD10aGlzLl9zb3VyY2UuYnVmZmVyLmR1cmF0aW9uO3RoaXMuX2R1cmF0aW9uPWwsdGhpcy5fbGFzdFVwZGF0ZT10aGlzLl9ub3coKSx0aGlzLl9lbGFwc2VkPXQsdGhpcy5fc291cmNlLm9uZW5kZWQ9dGhpcy5fb25Db21wbGV0ZS5iaW5kKHRoaXMpLG4/dGhpcy5fc291cmNlLnN0YXJ0KDAsdCxuLXQpOnRoaXMuX3NvdXJjZS5zdGFydCgwLHQpLHRoaXMuZW1pdChcInN0YXJ0XCIpLHRoaXMuX3VwZGF0ZSghMCksdGhpcy5fZW5hYmxlZD0hMH0sbi5wcm90b3R5cGUuX3RvU2VjPWZ1bmN0aW9uKGUpe3JldHVybiBlPjEwJiYoZS89MWUzKSxlfHwwfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJfZW5hYmxlZFwiLHtzZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5fbWVkaWEubm9kZXMuc2NyaXB0O3QucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImF1ZGlvcHJvY2Vzc1wiLHRoaXMuX3VwZGF0ZUxpc3RlbmVyKSxlJiZ0LmFkZEV2ZW50TGlzdGVuZXIoXCJhdWRpb3Byb2Nlc3NcIix0aGlzLl91cGRhdGVMaXN0ZW5lcil9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicHJvZ3Jlc3NcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Byb2dyZXNzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGF1c2VkPWUsdGhpcy5yZWZyZXNoUGF1c2VkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCksdGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5fc291cmNlJiYodGhpcy5fc291cmNlLmRpc2Nvbm5lY3QoKSx0aGlzLl9zb3VyY2U9bnVsbCksdGhpcy5fZ2FpbiYmKHRoaXMuX2dhaW4uZGlzY29ubmVjdCgpLHRoaXMuX2dhaW49bnVsbCksdGhpcy5fbWVkaWEmJih0aGlzLl9tZWRpYS5jb250ZXh0LmV2ZW50cy5vZmYoXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLHRoaXMuX21lZGlhLmNvbnRleHQuZXZlbnRzLm9mZihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyksdGhpcy5fbWVkaWE9bnVsbCksdGhpcy5fZW5kPW51bGwsdGhpcy5fc3BlZWQ9MSx0aGlzLl92b2x1bWU9MSx0aGlzLl9sb29wPSExLHRoaXMuX2VsYXBzZWQ9MCx0aGlzLl9kdXJhdGlvbj0wLHRoaXMuX3BhdXNlZD0hMSx0aGlzLl9tdXRlZD0hMSx0aGlzLl9wYXVzZWRSZWFsPSExfSxuLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiW1dlYkF1ZGlvSW5zdGFuY2UgaWQ9XCIrdGhpcy5pZCtcIl1cIn0sbi5wcm90b3R5cGUuX25vdz1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9tZWRpYS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZX0sbi5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbihlKXtpZih2b2lkIDA9PT1lJiYoZT0hMSksdGhpcy5fc291cmNlKXt2YXIgdD10aGlzLl9ub3coKSxuPXQtdGhpcy5fbGFzdFVwZGF0ZTtpZihuPjB8fGUpe3ZhciBvPXRoaXMuX3NvdXJjZS5wbGF5YmFja1JhdGUudmFsdWU7dGhpcy5fZWxhcHNlZCs9bipvLHRoaXMuX2xhc3RVcGRhdGU9dDt2YXIgaT10aGlzLl9kdXJhdGlvbixyPXRoaXMuX2VsYXBzZWQlaS9pO3RoaXMuX3Byb2dyZXNzPXIsdGhpcy5lbWl0KFwicHJvZ3Jlc3NcIix0aGlzLl9wcm9ncmVzcyxpKX19fSxuLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMuX21lZGlhPWUsZS5jb250ZXh0LmV2ZW50cy5vbihcInJlZnJlc2hcIix0aGlzLnJlZnJlc2gsdGhpcyksZS5jb250ZXh0LmV2ZW50cy5vbihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyl9LG4ucHJvdG90eXBlLl9pbnRlcm5hbFN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJih0aGlzLl9lbmFibGVkPSExLHRoaXMuX3NvdXJjZS5vbmVuZGVkPW51bGwsdGhpcy5fc291cmNlLnN0b3AoKSx0aGlzLl9zb3VyY2U9bnVsbCl9LG4ucHJvdG90eXBlLl9vbkNvbXBsZXRlPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiYodGhpcy5fZW5hYmxlZD0hMSx0aGlzLl9zb3VyY2Uub25lbmRlZD1udWxsKSx0aGlzLl9zb3VyY2U9bnVsbCx0aGlzLl9wcm9ncmVzcz0xLHRoaXMuZW1pdChcInByb2dyZXNzXCIsMSx0aGlzLl9kdXJhdGlvbiksdGhpcy5lbWl0KFwiZW5kXCIsdGhpcyl9LG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSx4PWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dmFyIG89dGhpcyxpPXQuYXVkaW9Db250ZXh0LHI9aS5jcmVhdGVCdWZmZXJTb3VyY2UoKSxzPWkuY3JlYXRlU2NyaXB0UHJvY2Vzc29yKG4uQlVGRkVSX1NJWkUpLHU9aS5jcmVhdGVHYWluKCksYT1pLmNyZWF0ZUFuYWx5c2VyKCk7cmV0dXJuIHIuY29ubmVjdChhKSxhLmNvbm5lY3QodSksdS5jb25uZWN0KHQuZGVzdGluYXRpb24pLHMuY29ubmVjdCh0LmRlc3RpbmF0aW9uKSxvPWUuY2FsbCh0aGlzLGEsdSl8fHRoaXMsby5jb250ZXh0PXQsby5idWZmZXJTb3VyY2U9cixvLnNjcmlwdD1zLG8uZ2Fpbj11LG8uYW5hbHlzZXI9YSxvfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe2UucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKSx0aGlzLmJ1ZmZlclNvdXJjZS5kaXNjb25uZWN0KCksdGhpcy5zY3JpcHQuZGlzY29ubmVjdCgpLHRoaXMuZ2Fpbi5kaXNjb25uZWN0KCksdGhpcy5hbmFseXNlci5kaXNjb25uZWN0KCksdGhpcy5idWZmZXJTb3VyY2U9bnVsbCx0aGlzLnNjcmlwdD1udWxsLHRoaXMuZ2Fpbj1udWxsLHRoaXMuYW5hbHlzZXI9bnVsbCx0aGlzLmNvbnRleHQ9bnVsbH0sbi5wcm90b3R5cGUuY2xvbmVCdWZmZXJTb3VyY2U9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmJ1ZmZlclNvdXJjZSx0PXRoaXMuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7dC5idWZmZXI9ZS5idWZmZXIsbC5zZXRQYXJhbVZhbHVlKHQucGxheWJhY2tSYXRlLGUucGxheWJhY2tSYXRlLnZhbHVlKSx0Lmxvb3A9ZS5sb29wO3ZhciBuPXRoaXMuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO3JldHVybiB0LmNvbm5lY3Qobiksbi5jb25uZWN0KHRoaXMuZGVzdGluYXRpb24pLHtzb3VyY2U6dCxnYWluOm59fSxuLkJVRkZFUl9TSVpFPTI1NixufShuKSxPPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLnBhcmVudD1lLHRoaXMuX25vZGVzPW5ldyB4KHRoaXMuY29udGV4dCksdGhpcy5fc291cmNlPXRoaXMuX25vZGVzLmJ1ZmZlclNvdXJjZSx0aGlzLnNvdXJjZT1lLm9wdGlvbnMuc291cmNlfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5wYXJlbnQ9bnVsbCx0aGlzLl9ub2Rlcy5kZXN0cm95KCksdGhpcy5fbm9kZXM9bnVsbCx0aGlzLl9zb3VyY2U9bnVsbCx0aGlzLnNvdXJjZT1udWxsfSxlLnByb3RvdHlwZS5jcmVhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IFAodGhpcyl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGFyZW50LmNvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiaXNQbGF5YWJsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4hIXRoaXMuX3NvdXJjZSYmISF0aGlzLl9zb3VyY2UuYnVmZmVyfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX25vZGVzLmZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9ub2Rlcy5maWx0ZXJzPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZHVyYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNvbnNvbGUuYXNzZXJ0KHRoaXMuaXNQbGF5YWJsZSxcIlNvdW5kIG5vdCB5ZXQgcGxheWFibGUsIG5vIGR1cmF0aW9uXCIpLHRoaXMuX3NvdXJjZS5idWZmZXIuZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiYnVmZmVyXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2UuYnVmZmVyfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc291cmNlLmJ1ZmZlcj1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcIm5vZGVzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9ub2Rlc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGUpe3RoaXMuc291cmNlP3RoaXMuX2RlY29kZSh0aGlzLnNvdXJjZSxlKTp0aGlzLnBhcmVudC51cmw/dGhpcy5fbG9hZFVybChlKTplP2UobmV3IEVycm9yKFwic291bmQudXJsIG9yIHNvdW5kLnNvdXJjZSBtdXN0IGJlIHNldFwiKSk6Y29uc29sZS5lcnJvcihcInNvdW5kLnVybCBvciBzb3VuZC5zb3VyY2UgbXVzdCBiZSBzZXRcIil9LGUucHJvdG90eXBlLl9sb2FkVXJsPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMsbj1uZXcgWE1MSHR0cFJlcXVlc3Qsbz10aGlzLnBhcmVudC51cmw7bi5vcGVuKFwiR0VUXCIsbywhMCksbi5yZXNwb25zZVR5cGU9XCJhcnJheWJ1ZmZlclwiLG4ub25sb2FkPWZ1bmN0aW9uKCl7dC5zb3VyY2U9bi5yZXNwb25zZSx0Ll9kZWNvZGUobi5yZXNwb25zZSxlKX0sbi5zZW5kKCl9LGUucHJvdG90eXBlLl9kZWNvZGU9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzO3RoaXMucGFyZW50LmNvbnRleHQuZGVjb2RlKGUsZnVuY3Rpb24oZSxvKXtpZihlKXQmJnQoZSk7ZWxzZXtuLnBhcmVudC5pc0xvYWRlZD0hMCxuLmJ1ZmZlcj1vO3ZhciBpPW4ucGFyZW50LmF1dG9QbGF5U3RhcnQoKTt0JiZ0KG51bGwsbi5wYXJlbnQsaSl9fSl9LGV9KCksdz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUucmVzb2x2ZVVybD1mdW5jdGlvbih0KXt2YXIgbj1lLkZPUk1BVF9QQVRURVJOLG89XCJzdHJpbmdcIj09dHlwZW9mIHQ/dDp0LnVybDtpZihuLnRlc3Qobykpe2Zvcih2YXIgaT1uLmV4ZWMobykscj1pWzJdLnNwbGl0KFwiLFwiKSxzPXJbci5sZW5ndGgtMV0sdT0wLGE9ci5sZW5ndGg7dTxhO3UrKyl7dmFyIGM9clt1XTtpZihlLnN1cHBvcnRlZFtjXSl7cz1jO2JyZWFrfX12YXIgbD1vLnJlcGxhY2UoaVsxXSxzKTtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2YgdCYmKHQuZXh0ZW5zaW9uPXMsdC51cmw9bCksbH1yZXR1cm4gb30sZS5zaW5lVG9uZT1mdW5jdGlvbihlLHQpe3ZvaWQgMD09PWUmJihlPTIwMCksdm9pZCAwPT09dCYmKHQ9MSk7dmFyIG49SS5mcm9tKHtzaW5nbGVJbnN0YW5jZTohMH0pO2lmKCEobi5tZWRpYSBpbnN0YW5jZW9mIE8pKXJldHVybiBuO2Zvcih2YXIgbz1uLm1lZGlhLGk9bi5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXIoMSw0OGUzKnQsNDhlMykscj1pLmdldENoYW5uZWxEYXRhKDApLHM9MDtzPHIubGVuZ3RoO3MrKyl7dmFyIHU9ZSoocy9pLnNhbXBsZVJhdGUpKk1hdGguUEk7cltzXT0yKk1hdGguc2luKHUpfXJldHVybiBvLmJ1ZmZlcj1pLG4uaXNMb2FkZWQ9ITAsbn0sZS5yZW5kZXI9ZnVuY3Rpb24oZSx0KXt2YXIgbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3Q9T2JqZWN0LmFzc2lnbih7d2lkdGg6NTEyLGhlaWdodDoxMjgsZmlsbDpcImJsYWNrXCJ9LHR8fHt9KSxuLndpZHRoPXQud2lkdGgsbi5oZWlnaHQ9dC5oZWlnaHQ7dmFyIG89UElYSS5CYXNlVGV4dHVyZS5mcm9tQ2FudmFzKG4pO2lmKCEoZS5tZWRpYSBpbnN0YW5jZW9mIE8pKXJldHVybiBvO3ZhciBpPWUubWVkaWE7Y29uc29sZS5hc3NlcnQoISFpLmJ1ZmZlcixcIk5vIGJ1ZmZlciBmb3VuZCwgbG9hZCBmaXJzdFwiKTt2YXIgcj1uLmdldENvbnRleHQoXCIyZFwiKTtyLmZpbGxTdHlsZT10LmZpbGw7Zm9yKHZhciBzPWkuYnVmZmVyLmdldENoYW5uZWxEYXRhKDApLHU9TWF0aC5jZWlsKHMubGVuZ3RoL3Qud2lkdGgpLGE9dC5oZWlnaHQvMixjPTA7Yzx0LndpZHRoO2MrKyl7Zm9yKHZhciBsPTEscD0tMSxoPTA7aDx1O2grKyl7dmFyIGQ9c1tjKnUraF07ZDxsJiYobD1kKSxkPnAmJihwPWQpfXIuZmlsbFJlY3QoYywoMStsKSphLDEsTWF0aC5tYXgoMSwocC1sKSphKSl9cmV0dXJuIG99LGUucGxheU9uY2U9ZnVuY3Rpb24odCxuKXt2YXIgbz1cImFsaWFzXCIrZS5QTEFZX0lEKys7cmV0dXJuIFMuaW5zdGFuY2UuYWRkKG8se3VybDp0LHByZWxvYWQ6ITAsYXV0b1BsYXk6ITAsbG9hZGVkOmZ1bmN0aW9uKGUpe2UmJihjb25zb2xlLmVycm9yKGUpLFMuaW5zdGFuY2UucmVtb3ZlKG8pLG4mJm4oZSkpfSxjb21wbGV0ZTpmdW5jdGlvbigpe1MuaW5zdGFuY2UucmVtb3ZlKG8pLG4mJm4obnVsbCl9fSksb30sZS5QTEFZX0lEPTAsZS5GT1JNQVRfUEFUVEVSTj0vXFwuKFxceyhbXlxcfV0rKVxcfSkoXFw/LiopPyQvLGUuZXh0ZW5zaW9ucz1bXCJtcDNcIixcIm9nZ1wiLFwib2dhXCIsXCJvcHVzXCIsXCJtcGVnXCIsXCJ3YXZcIixcIm00YVwiLFwibXA0XCIsXCJhaWZmXCIsXCJ3bWFcIixcIm1pZFwiXSxlLnN1cHBvcnRlZD1mdW5jdGlvbigpe3ZhciB0PXttNGE6XCJtcDRcIixvZ2E6XCJvZ2dcIn0sbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIiksbz17fTtyZXR1cm4gZS5leHRlbnNpb25zLmZvckVhY2goZnVuY3Rpb24oZSl7dmFyIGk9dFtlXXx8ZSxyPW4uY2FuUGxheVR5cGUoXCJhdWRpby9cIitlKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxzPW4uY2FuUGxheVR5cGUoXCJhdWRpby9cIitpKS5yZXBsYWNlKC9ebm8kLyxcIlwiKTtvW2VdPSEhcnx8ISFzfSksT2JqZWN0LmZyZWV6ZShvKX0oKSxlfSgpLGo9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG4pe3ZhciBvPWUuY2FsbCh0aGlzLHQsbil8fHRoaXM7cmV0dXJuIG8udXNlKEEucGx1Z2luKSxvLnByZShBLnJlc29sdmUpLG99cmV0dXJuIHQobixlKSxuLmFkZFBpeGlNaWRkbGV3YXJlPWZ1bmN0aW9uKHQpe2UuYWRkUGl4aU1pZGRsZXdhcmUuY2FsbCh0aGlzLHQpfSxufShQSVhJLmxvYWRlcnMuTG9hZGVyKSxBPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe31yZXR1cm4gZS5pbnN0YWxsPWZ1bmN0aW9uKHQpe2UuX3NvdW5kPXQsZS5sZWdhY3k9dC51c2VMZWdhY3ksUElYSS5sb2FkZXJzLkxvYWRlcj1qLFBJWEkubG9hZGVyLnVzZShlLnBsdWdpbiksUElYSS5sb2FkZXIucHJlKGUucmVzb2x2ZSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwibGVnYWN5XCIse3NldDpmdW5jdGlvbihlKXt2YXIgdD1QSVhJLmxvYWRlcnMuUmVzb3VyY2Usbj13LmV4dGVuc2lvbnM7ZT9uLmZvckVhY2goZnVuY3Rpb24oZSl7dC5zZXRFeHRlbnNpb25YaHJUeXBlKGUsdC5YSFJfUkVTUE9OU0VfVFlQRS5ERUZBVUxUKSx0LnNldEV4dGVuc2lvbkxvYWRUeXBlKGUsdC5MT0FEX1RZUEUuQVVESU8pfSk6bi5mb3JFYWNoKGZ1bmN0aW9uKGUpe3Quc2V0RXh0ZW5zaW9uWGhyVHlwZShlLHQuWEhSX1JFU1BPTlNFX1RZUEUuQlVGRkVSKSx0LnNldEV4dGVuc2lvbkxvYWRUeXBlKGUsdC5MT0FEX1RZUEUuWEhSKX0pfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucmVzb2x2ZT1mdW5jdGlvbihlLHQpe3cucmVzb2x2ZVVybChlKSx0KCl9LGUucGx1Z2luPWZ1bmN0aW9uKHQsbil7dC5kYXRhJiZ3LmV4dGVuc2lvbnMuaW5kZXhPZih0LmV4dGVuc2lvbik+LTE/dC5zb3VuZD1lLl9zb3VuZC5hZGQodC5uYW1lLHtsb2FkZWQ6bixwcmVsb2FkOiEwLHVybDp0LnVybCxzb3VyY2U6dC5kYXRhfSk6bigpfSxlfSgpLEY9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7dGhpcy5wYXJlbnQ9ZSxPYmplY3QuYXNzaWduKHRoaXMsdCksdGhpcy5kdXJhdGlvbj10aGlzLmVuZC10aGlzLnN0YXJ0LGNvbnNvbGUuYXNzZXJ0KHRoaXMuZHVyYXRpb24+MCxcIkVuZCB0aW1lIG11c3QgYmUgYWZ0ZXIgc3RhcnQgdGltZVwiKX1yZXR1cm4gZS5wcm90b3R5cGUucGxheT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5wYXJlbnQucGxheShPYmplY3QuYXNzaWduKHtjb21wbGV0ZTplLHNwZWVkOnRoaXMuc3BlZWR8fHRoaXMucGFyZW50LnNwZWVkLGVuZDp0aGlzLmVuZCxzdGFydDp0aGlzLnN0YXJ0fSkpfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5wYXJlbnQ9bnVsbH0sZX0oKSxFPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt2YXIgdD10aGlzLG89bmV3IG4uQXVkaW9Db250ZXh0LGk9by5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKSxyPW8uY3JlYXRlQW5hbHlzZXIoKTtyZXR1cm4gci5jb25uZWN0KGkpLGkuY29ubmVjdChvLmRlc3RpbmF0aW9uKSx0PWUuY2FsbCh0aGlzLHIsaSl8fHRoaXMsdC5fY3R4PW8sdC5fb2ZmbGluZUN0eD1uZXcgbi5PZmZsaW5lQXVkaW9Db250ZXh0KDEsMixvLnNhbXBsZVJhdGUpLHQuX3VubG9ja2VkPSExLHQuY29tcHJlc3Nvcj1pLHQuYW5hbHlzZXI9cix0LmV2ZW50cz1uZXcgUElYSS51dGlscy5FdmVudEVtaXR0ZXIsdC52b2x1bWU9MSx0LnNwZWVkPTEsdC5tdXRlZD0hMSx0LnBhdXNlZD0hMSxcIm9udG91Y2hzdGFydFwiaW4gd2luZG93JiZcInJ1bm5pbmdcIiE9PW8uc3RhdGUmJih0Ll91bmxvY2soKSx0Ll91bmxvY2s9dC5fdW5sb2NrLmJpbmQodCksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHQuX3VubG9jaywhMCksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIix0Ll91bmxvY2ssITApLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLHQuX3VubG9jaywhMCkpLHR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5fdW5sb2NrPWZ1bmN0aW9uKCl7dGhpcy5fdW5sb2NrZWR8fCh0aGlzLnBsYXlFbXB0eVNvdW5kKCksXCJydW5uaW5nXCI9PT10aGlzLl9jdHguc3RhdGUmJihkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsdGhpcy5fdW5sb2NrLCEwKSxkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIix0aGlzLl91bmxvY2ssITApLGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsdGhpcy5fdW5sb2NrLCEwKSx0aGlzLl91bmxvY2tlZD0hMCkpfSxuLnByb3RvdHlwZS5wbGF5RW1wdHlTb3VuZD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX2N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtlLmJ1ZmZlcj10aGlzLl9jdHguY3JlYXRlQnVmZmVyKDEsMSwyMjA1MCksZS5jb25uZWN0KHRoaXMuX2N0eC5kZXN0aW5hdGlvbiksZS5zdGFydCgwLDAsMCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiQXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3ZhciBlPXdpbmRvdztyZXR1cm4gZS5BdWRpb0NvbnRleHR8fGUud2Via2l0QXVkaW9Db250ZXh0fHxudWxsfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiT2ZmbGluZUF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgZT13aW5kb3c7cmV0dXJuIGUuT2ZmbGluZUF1ZGlvQ29udGV4dHx8ZS53ZWJraXRPZmZsaW5lQXVkaW9Db250ZXh0fHxudWxsfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7dmFyIHQ9dGhpcy5fY3R4O3ZvaWQgMCE9PXQuY2xvc2UmJnQuY2xvc2UoKSx0aGlzLmV2ZW50cy5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLmFuYWx5c2VyLmRpc2Nvbm5lY3QoKSx0aGlzLmNvbXByZXNzb3IuZGlzY29ubmVjdCgpLHRoaXMuYW5hbHlzZXI9bnVsbCx0aGlzLmNvbXByZXNzb3I9bnVsbCx0aGlzLmV2ZW50cz1udWxsLHRoaXMuX29mZmxpbmVDdHg9bnVsbCx0aGlzLl9jdHg9bnVsbH0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiYXVkaW9Db250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jdHh9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwib2ZmbGluZUNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX29mZmxpbmVDdHh9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXtlJiZcInJ1bm5pbmdcIj09PXRoaXMuX2N0eC5zdGF0ZT90aGlzLl9jdHguc3VzcGVuZCgpOmV8fFwic3VzcGVuZGVkXCIhPT10aGlzLl9jdHguc3RhdGV8fHRoaXMuX2N0eC5yZXN1bWUoKSx0aGlzLl9wYXVzZWQ9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dGhpcy5ldmVudHMuZW1pdChcInJlZnJlc2hcIil9LG4ucHJvdG90eXBlLnJlZnJlc2hQYXVzZWQ9ZnVuY3Rpb24oKXt0aGlzLmV2ZW50cy5lbWl0KFwicmVmcmVzaFBhdXNlZFwiKX0sbi5wcm90b3R5cGUudG9nZ2xlTXV0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLm11dGVkPSF0aGlzLm11dGVkLHRoaXMucmVmcmVzaCgpLHRoaXMubXV0ZWR9LG4ucHJvdG90eXBlLnRvZ2dsZVBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF1c2VkPSF0aGlzLnBhdXNlZCx0aGlzLnJlZnJlc2hQYXVzZWQoKSx0aGlzLl9wYXVzZWR9LG4ucHJvdG90eXBlLmRlY29kZT1mdW5jdGlvbihlLHQpe3RoaXMuX29mZmxpbmVDdHguZGVjb2RlQXVkaW9EYXRhKGUsZnVuY3Rpb24oZSl7dChudWxsLGUpfSxmdW5jdGlvbigpe3QobmV3IEVycm9yKFwiVW5hYmxlIHRvIGRlY29kZSBmaWxlXCIpKX0pfSxufShuKSxMPU9iamVjdC5mcmVlemUoe1dlYkF1ZGlvTWVkaWE6TyxXZWJBdWRpb0luc3RhbmNlOlAsV2ViQXVkaW9Ob2Rlczp4LFdlYkF1ZGlvQ29udGV4dDpFLFdlYkF1ZGlvVXRpbHM6bH0pLFM9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7dGhpcy5pbml0KCl9cmV0dXJuIGUucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zdXBwb3J0ZWQmJih0aGlzLl93ZWJBdWRpb0NvbnRleHQ9bmV3IEUpLHRoaXMuX2h0bWxBdWRpb0NvbnRleHQ9bmV3IGIsdGhpcy5fc291bmRzPXt9LHRoaXMudXNlTGVnYWN5PSF0aGlzLnN1cHBvcnRlZCx0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUuaW5pdD1mdW5jdGlvbigpe2lmKGUuaW5zdGFuY2UpdGhyb3cgbmV3IEVycm9yKFwiU291bmRMaWJyYXJ5IGlzIGFscmVhZHkgY3JlYXRlZFwiKTt2YXIgdD1lLmluc3RhbmNlPW5ldyBlO1widW5kZWZpbmVkXCI9PXR5cGVvZiBQcm9taXNlJiYod2luZG93LlByb21pc2U9YSksdm9pZCAwIT09UElYSS5sb2FkZXJzJiZBLmluc3RhbGwodCksdm9pZCAwPT09d2luZG93Ll9fcGl4aVNvdW5kJiZkZWxldGUgd2luZG93Ll9fcGl4aVNvdW5kO3ZhciBvPVBJWEk7cmV0dXJuIG8uc291bmR8fChPYmplY3QuZGVmaW5lUHJvcGVydHkobyxcInNvdW5kXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHQse2ZpbHRlcnM6e2dldDpmdW5jdGlvbigpe3JldHVybiBtfX0saHRtbGF1ZGlvOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZ319LHdlYmF1ZGlvOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gTH19LHV0aWxzOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gd319LFNvdW5kOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gSX19LFNvdW5kU3ByaXRlOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gRn19LEZpbHRlcmFibGU6e2dldDpmdW5jdGlvbigpe3JldHVybiBufX0sU291bmRMaWJyYXJ5OntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZX19fSkpLHR9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImZpbHRlcnNBbGxcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudXNlTGVnYWN5P1tdOnRoaXMuX2NvbnRleHQuZmlsdGVyc30sc2V0OmZ1bmN0aW9uKGUpe3RoaXMudXNlTGVnYWN5fHwodGhpcy5fY29udGV4dC5maWx0ZXJzPWUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInN1cHBvcnRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9PUUuQXVkaW9Db250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmFkZD1mdW5jdGlvbihlLHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXt2YXIgbj17fTtmb3IodmFyIG8gaW4gZSl7aT10aGlzLl9nZXRPcHRpb25zKGVbb10sdCk7bltvXT10aGlzLmFkZChvLGkpfXJldHVybiBufWlmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZihjb25zb2xlLmFzc2VydCghdGhpcy5fc291bmRzW2VdLFwiU291bmQgd2l0aCBhbGlhcyBcIitlK1wiIGFscmVhZHkgZXhpc3RzLlwiKSx0IGluc3RhbmNlb2YgSSlyZXR1cm4gdGhpcy5fc291bmRzW2VdPXQsdDt2YXIgaT10aGlzLl9nZXRPcHRpb25zKHQpLHI9SS5mcm9tKGkpO3JldHVybiB0aGlzLl9zb3VuZHNbZV09cixyfX0sZS5wcm90b3R5cGUuX2dldE9wdGlvbnM9ZnVuY3Rpb24oZSx0KXt2YXIgbjtyZXR1cm4gbj1cInN0cmluZ1wiPT10eXBlb2YgZT97dXJsOmV9OmUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcnx8ZSBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQ/e3NvdXJjZTplfTplLE9iamVjdC5hc3NpZ24obix0fHx7fSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInVzZUxlZ2FjeVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdXNlTGVnYWN5fSxzZXQ6ZnVuY3Rpb24oZSl7QS5sZWdhY3k9ZSx0aGlzLl91c2VMZWdhY3k9ZSwhZSYmdGhpcy5zdXBwb3J0ZWQ/dGhpcy5fY29udGV4dD10aGlzLl93ZWJBdWRpb0NvbnRleHQ6dGhpcy5fY29udGV4dD10aGlzLl9odG1sQXVkaW9Db250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5leGlzdHMoZSwhMCksdGhpcy5fc291bmRzW2VdLmRlc3Ryb3koKSxkZWxldGUgdGhpcy5fc291bmRzW2VdLHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInZvbHVtZUFsbFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC52b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9jb250ZXh0LnZvbHVtZT1lLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInNwZWVkQWxsXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnNwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fY29udGV4dC5zcGVlZD1lLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnRvZ2dsZVBhdXNlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQudG9nZ2xlUGF1c2UoKX0sZS5wcm90b3R5cGUucGF1c2VBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5wYXVzZWQ9ITAsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUucmVzdW1lQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQucGF1c2VkPSExLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnRvZ2dsZU11dGVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC50b2dnbGVNdXRlKCl9LGUucHJvdG90eXBlLm11dGVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5tdXRlZD0hMCx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS51bm11dGVBbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5tdXRlZD0hMSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS5yZW1vdmVBbGw9ZnVuY3Rpb24oKXtmb3IodmFyIGUgaW4gdGhpcy5fc291bmRzKXRoaXMuX3NvdW5kc1tlXS5kZXN0cm95KCksZGVsZXRlIHRoaXMuX3NvdW5kc1tlXTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUuc3RvcEFsbD1mdW5jdGlvbigpe2Zvcih2YXIgZSBpbiB0aGlzLl9zb3VuZHMpdGhpcy5fc291bmRzW2VdLnN0b3AoKTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUuZXhpc3RzPWZ1bmN0aW9uKGUsdCl7dm9pZCAwPT09dCYmKHQ9ITEpO3ZhciBuPSEhdGhpcy5fc291bmRzW2VdO3JldHVybiB0JiZjb25zb2xlLmFzc2VydChuLFwiTm8gc291bmQgbWF0Y2hpbmcgYWxpYXMgJ1wiK2UrXCInLlwiKSxufSxlLnByb3RvdHlwZS5maW5kPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmV4aXN0cyhlLCEwKSx0aGlzLl9zb3VuZHNbZV19LGUucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5maW5kKGUpLnBsYXkodCl9LGUucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5zdG9wKCl9LGUucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkucGF1c2UoKX0sZS5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkucmVzdW1lKCl9LGUucHJvdG90eXBlLnZvbHVtZT1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMuZmluZChlKTtyZXR1cm4gdm9pZCAwIT09dCYmKG4udm9sdW1lPXQpLG4udm9sdW1lfSxlLnByb3RvdHlwZS5zcGVlZD1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMuZmluZChlKTtyZXR1cm4gdm9pZCAwIT09dCYmKG4uc3BlZWQ9dCksbi5zcGVlZH0sZS5wcm90b3R5cGUuZHVyYXRpb249ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZChlKS5kdXJhdGlvbn0sZS5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZW1vdmVBbGwoKSx0aGlzLl9zb3VuZHM9bnVsbCx0aGlzLl93ZWJBdWRpb0NvbnRleHQmJih0aGlzLl93ZWJBdWRpb0NvbnRleHQuZGVzdHJveSgpLHRoaXMuX3dlYkF1ZGlvQ29udGV4dD1udWxsKSx0aGlzLl9odG1sQXVkaW9Db250ZXh0JiYodGhpcy5faHRtbEF1ZGlvQ29udGV4dC5kZXN0cm95KCksdGhpcy5faHRtbEF1ZGlvQ29udGV4dD1udWxsKSx0aGlzLl9jb250ZXh0PW51bGwsdGhpc30sZX0oKSxJPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMubWVkaWE9ZSx0aGlzLm9wdGlvbnM9dCx0aGlzLl9pbnN0YW5jZXM9W10sdGhpcy5fc3ByaXRlcz17fSx0aGlzLm1lZGlhLmluaXQodGhpcyk7dmFyIG49dC5jb21wbGV0ZTt0aGlzLl9hdXRvUGxheU9wdGlvbnM9bj97Y29tcGxldGU6bn06bnVsbCx0aGlzLmlzTG9hZGVkPSExLHRoaXMuaXNQbGF5aW5nPSExLHRoaXMuYXV0b1BsYXk9dC5hdXRvUGxheSx0aGlzLnNpbmdsZUluc3RhbmNlPXQuc2luZ2xlSW5zdGFuY2UsdGhpcy5wcmVsb2FkPXQucHJlbG9hZHx8dGhpcy5hdXRvUGxheSx0aGlzLnVybD10LnVybCx0aGlzLnNwZWVkPXQuc3BlZWQsdGhpcy52b2x1bWU9dC52b2x1bWUsdGhpcy5sb29wPXQubG9vcCx0LnNwcml0ZXMmJnRoaXMuYWRkU3ByaXRlcyh0LnNwcml0ZXMpLHRoaXMucHJlbG9hZCYmdGhpcy5fcHJlbG9hZCh0LmxvYWRlZCl9cmV0dXJuIGUuZnJvbT1mdW5jdGlvbih0KXt2YXIgbj17fTtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdD9uLnVybD10OnQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcnx8dCBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQ/bi5zb3VyY2U9dDpuPXQsKG49T2JqZWN0LmFzc2lnbih7YXV0b1BsYXk6ITEsc2luZ2xlSW5zdGFuY2U6ITEsdXJsOm51bGwsc291cmNlOm51bGwscHJlbG9hZDohMSx2b2x1bWU6MSxzcGVlZDoxLGNvbXBsZXRlOm51bGwsbG9hZGVkOm51bGwsbG9vcDohMX0sbikpLnVybCYmKG4udXJsPXcucmVzb2x2ZVVybChuLnVybCkpLE9iamVjdC5mcmVlemUobiksbmV3IGUoUy5pbnN0YW5jZS51c2VMZWdhY3k/bmV3IHM6bmV3IE8sbil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImNvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIFMuaW5zdGFuY2UuY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmlzUGxheWluZz0hMSx0aGlzLnBhdXNlZD0hMCx0aGlzfSxlLnByb3RvdHlwZS5yZXN1bWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc1BsYXlpbmc9dGhpcy5faW5zdGFuY2VzLmxlbmd0aD4wLHRoaXMucGF1c2VkPSExLHRoaXN9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcGF1c2VkPWUsdGhpcy5yZWZyZXNoUGF1c2VkKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3BlZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc3BlZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1lZGlhLmZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt0aGlzLm1lZGlhLmZpbHRlcnM9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5hZGRTcHJpdGVzPWZ1bmN0aW9uKGUsdCl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGUpe3ZhciBuPXt9O2Zvcih2YXIgbyBpbiBlKW5bb109dGhpcy5hZGRTcHJpdGVzKG8sZVtvXSk7cmV0dXJuIG59aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUpe2NvbnNvbGUuYXNzZXJ0KCF0aGlzLl9zcHJpdGVzW2VdLFwiQWxpYXMgXCIrZStcIiBpcyBhbHJlYWR5IHRha2VuXCIpO3ZhciBpPW5ldyBGKHRoaXMsdCk7cmV0dXJuIHRoaXMuX3Nwcml0ZXNbZV09aSxpfX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX3JlbW92ZUluc3RhbmNlcygpLHRoaXMucmVtb3ZlU3ByaXRlcygpLHRoaXMubWVkaWEuZGVzdHJveSgpLHRoaXMubWVkaWE9bnVsbCx0aGlzLl9zcHJpdGVzPW51bGwsdGhpcy5faW5zdGFuY2VzPW51bGx9LGUucHJvdG90eXBlLnJlbW92ZVNwcml0ZXM9ZnVuY3Rpb24oZSl7aWYoZSl7dmFyIHQ9dGhpcy5fc3ByaXRlc1tlXTt2b2lkIDAhPT10JiYodC5kZXN0cm95KCksZGVsZXRlIHRoaXMuX3Nwcml0ZXNbZV0pfWVsc2UgZm9yKHZhciBuIGluIHRoaXMuX3Nwcml0ZXMpdGhpcy5yZW1vdmVTcHJpdGVzKG4pO3JldHVybiB0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJpc1BsYXlhYmxlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmlzTG9hZGVkJiZ0aGlzLm1lZGlhJiZ0aGlzLm1lZGlhLmlzUGxheWFibGV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe2lmKCF0aGlzLmlzUGxheWFibGUpcmV0dXJuIHRoaXMuYXV0b1BsYXk9ITEsdGhpcy5fYXV0b1BsYXlPcHRpb25zPW51bGwsdGhpczt0aGlzLmlzUGxheWluZz0hMTtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aC0xO2U+PTA7ZS0tKXRoaXMuX2luc3RhbmNlc1tlXS5zdG9wKCk7cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSx0KXt2YXIgbixvPXRoaXM7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGU/bj17c3ByaXRlOnI9ZSxjb21wbGV0ZTp0fTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBlPyhuPXt9KS5jb21wbGV0ZT1lOm49ZSwobj1PYmplY3QuYXNzaWduKHtjb21wbGV0ZTpudWxsLGxvYWRlZDpudWxsLHNwcml0ZTpudWxsLGVuZDpudWxsLHN0YXJ0OjAsdm9sdW1lOjEsc3BlZWQ6MSxtdXRlZDohMSxsb29wOiExfSxufHx7fSkpLnNwcml0ZSl7dmFyIGk9bi5zcHJpdGU7Y29uc29sZS5hc3NlcnQoISF0aGlzLl9zcHJpdGVzW2ldLFwiQWxpYXMgXCIraStcIiBpcyBub3QgYXZhaWxhYmxlXCIpO3ZhciByPXRoaXMuX3Nwcml0ZXNbaV07bi5zdGFydD1yLnN0YXJ0LG4uZW5kPXIuZW5kLG4uc3BlZWQ9ci5zcGVlZHx8MSxkZWxldGUgbi5zcHJpdGV9aWYobi5vZmZzZXQmJihuLnN0YXJ0PW4ub2Zmc2V0KSwhdGhpcy5pc0xvYWRlZClyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oZSx0KXtvLmF1dG9QbGF5PSEwLG8uX2F1dG9QbGF5T3B0aW9ucz1uLG8uX3ByZWxvYWQoZnVuY3Rpb24obyxpLHIpe28/dChvKToobi5sb2FkZWQmJm4ubG9hZGVkKG8saSxyKSxlKHIpKX0pfSk7dGhpcy5zaW5nbGVJbnN0YW5jZSYmdGhpcy5fcmVtb3ZlSW5zdGFuY2VzKCk7dmFyIHM9dGhpcy5fY3JlYXRlSW5zdGFuY2UoKTtyZXR1cm4gdGhpcy5faW5zdGFuY2VzLnB1c2gocyksdGhpcy5pc1BsYXlpbmc9ITAscy5vbmNlKFwiZW5kXCIsZnVuY3Rpb24oKXtuLmNvbXBsZXRlJiZuLmNvbXBsZXRlKG8pLG8uX29uQ29tcGxldGUocyl9KSxzLm9uY2UoXCJzdG9wXCIsZnVuY3Rpb24oKXtvLl9vbkNvbXBsZXRlKHMpfSkscy5wbGF5KG4pLHN9LGUucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aCx0PTA7dDxlO3QrKyl0aGlzLl9pbnN0YW5jZXNbdF0ucmVmcmVzaCgpfSxlLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgsdD0wO3Q8ZTt0KyspdGhpcy5faW5zdGFuY2VzW3RdLnJlZnJlc2hQYXVzZWQoKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwidm9sdW1lXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl92b2x1bWV9LHNldDpmdW5jdGlvbihlKXt0aGlzLl92b2x1bWU9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJtdXRlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbXV0ZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9tdXRlZD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImxvb3BcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xvb3B9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9sb29wPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuX3ByZWxvYWQ9ZnVuY3Rpb24oZSl7dGhpcy5tZWRpYS5sb2FkKGUpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJpbnN0YW5jZXNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2luc3RhbmNlc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzcHJpdGVzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcHJpdGVzfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImR1cmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1lZGlhLmR1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmF1dG9QbGF5U3RhcnQ9ZnVuY3Rpb24oKXt2YXIgZTtyZXR1cm4gdGhpcy5hdXRvUGxheSYmKGU9dGhpcy5wbGF5KHRoaXMuX2F1dG9QbGF5T3B0aW9ucykpLGV9LGUucHJvdG90eXBlLl9yZW1vdmVJbnN0YW5jZXM9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5faW5zdGFuY2VzLmxlbmd0aC0xO2U+PTA7ZS0tKXRoaXMuX3Bvb2xJbnN0YW5jZSh0aGlzLl9pbnN0YW5jZXNbZV0pO3RoaXMuX2luc3RhbmNlcy5sZW5ndGg9MH0sZS5wcm90b3R5cGUuX29uQ29tcGxldGU9ZnVuY3Rpb24oZSl7aWYodGhpcy5faW5zdGFuY2VzKXt2YXIgdD10aGlzLl9pbnN0YW5jZXMuaW5kZXhPZihlKTt0Pi0xJiZ0aGlzLl9pbnN0YW5jZXMuc3BsaWNlKHQsMSksdGhpcy5pc1BsYXlpbmc9dGhpcy5faW5zdGFuY2VzLmxlbmd0aD4wfXRoaXMuX3Bvb2xJbnN0YW5jZShlKX0sZS5wcm90b3R5cGUuX2NyZWF0ZUluc3RhbmNlPWZ1bmN0aW9uKCl7aWYoZS5fcG9vbC5sZW5ndGg+MCl7dmFyIHQ9ZS5fcG9vbC5wb3AoKTtyZXR1cm4gdC5pbml0KHRoaXMubWVkaWEpLHR9cmV0dXJuIHRoaXMubWVkaWEuY3JlYXRlKCl9LGUucHJvdG90eXBlLl9wb29sSW5zdGFuY2U9ZnVuY3Rpb24odCl7dC5kZXN0cm95KCksZS5fcG9vbC5pbmRleE9mKHQpPDAmJmUuX3Bvb2wucHVzaCh0KX0sZS5fcG9vbD1bXSxlfSgpLEM9Uy5pbml0KCk7ZS5zb3VuZD1DLGUuZmlsdGVycz1tLGUuaHRtbGF1ZGlvPWcsZS53ZWJhdWRpbz1MLGUuRmlsdGVyYWJsZT1uLGUuU291bmQ9SSxlLlNvdW5kTGlicmFyeT1TLGUuU291bmRTcHJpdGU9RixlLnV0aWxzPXcsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktc291bmQuanMubWFwXG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiIWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUoaSl7aWYobltpXSlyZXR1cm4gbltpXS5leHBvcnRzO3ZhciByPW5baV09e2V4cG9ydHM6e30saWQ6aSxsb2FkZWQ6ITF9O3JldHVybiB0W2ldLmNhbGwoci5leHBvcnRzLHIsci5leHBvcnRzLGUpLHIubG9hZGVkPSEwLHIuZXhwb3J0c312YXIgbj17fTtyZXR1cm4gZS5tPXQsZS5jPW4sZS5wPVwiXCIsZSgwKX0oW2Z1bmN0aW9uKHQsZSxuKXt0LmV4cG9ydHM9big2KX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9UElYSX0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbj17bGluZWFyOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0fX0saW5RdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnR9fSxvdXRRdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KigyLXQpfX0saW5PdXRRdWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQ6LS41KigtLXQqKHQtMiktMSl9fSxpbkN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdH19LG91dEN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi0tdCp0KnQrMX19LGluT3V0Q3ViaWM6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdCp0Oih0LT0yLC41Kih0KnQqdCsyKSl9fSxpblF1YXJ0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdCp0fX0sb3V0UXVhcnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtIC0tdCp0KnQqdH19LGluT3V0UXVhcnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqPTIsMT50Py41KnQqdCp0KnQ6KHQtPTIsLS41Kih0KnQqdCp0LTIpKX19LGluUXVpbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHQqdCp0KnQqdH19LG91dFF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi0tdCp0KnQqdCp0KzF9fSxpbk91dFF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQqdCp0KnQ6KHQtPTIsLjUqKHQqdCp0KnQqdCsyKSl9fSxpblNpbmU6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEtTWF0aC5jb3ModCpNYXRoLlBJLzIpfX0sb3V0U2luZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zaW4odCpNYXRoLlBJLzIpfX0saW5PdXRTaW5lOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi41KigxLU1hdGguY29zKE1hdGguUEkqdCkpfX0saW5FeHBvOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAwPT09dD8wOk1hdGgucG93KDEwMjQsdC0xKX19LG91dEV4cG86ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDE9PT10PzE6MS1NYXRoLnBvdygyLC0xMCp0KX19LGluT3V0RXhwbzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMD09PXQ/MDoxPT09dD8xOih0Kj0yLDE+dD8uNSpNYXRoLnBvdygxMDI0LHQtMSk6LjUqKC1NYXRoLnBvdygyLC0xMCoodC0xKSkrMikpfX0saW5DaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLU1hdGguc3FydCgxLXQqdCl9fSxvdXRDaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNxcnQoMS0gLS10KnQpfX0saW5PdXRDaXJjOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8tLjUqKE1hdGguc3FydCgxLXQqdCktMSk6LjUqKE1hdGguc3FydCgxLSh0LTIpKih0LTIpKSsxKX19LGluRWxhc3RpYzpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg8PTB8fHZvaWQgMD09PWFyZ3VtZW50c1swXT8uMTphcmd1bWVudHNbMF0sZT1hcmd1bWVudHMubGVuZ3RoPD0xfHx2b2lkIDA9PT1hcmd1bWVudHNbMV0/LjQ6YXJndW1lbnRzWzFdO3JldHVybiBmdW5jdGlvbihuKXt2YXIgaT12b2lkIDA7cmV0dXJuIDA9PT1uPzA6MT09PW4/MTooIXR8fDE+dD8odD0xLGk9ZS80KTppPWUqTWF0aC5hc2luKDEvdCkvKDIqTWF0aC5QSSksLSh0Kk1hdGgucG93KDIsMTAqKG4tMSkpKk1hdGguc2luKChuLTEtaSkqKDIqTWF0aC5QSSkvZSkpKX19LG91dEVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLHQqTWF0aC5wb3coMiwtMTAqbikqTWF0aC5zaW4oKG4taSkqKDIqTWF0aC5QSSkvZSkrMSl9fSxpbk91dEVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLG4qPTIsMT5uPy0uNSoodCpNYXRoLnBvdygyLDEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKTp0Kk1hdGgucG93KDIsLTEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKi41KzEpfX0saW5CYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj10fHwxLjcwMTU4O3JldHVybiBlKmUqKChuKzEpKmUtbil9fSxvdXRCYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj10fHwxLjcwMTU4O3JldHVybi0tZSplKigobisxKSplK24pKzF9fSxpbk91dEJhY2s6ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciBuPTEuNTI1Kih0fHwxLjcwMTU4KTtyZXR1cm4gZSo9MiwxPmU/LjUqKGUqZSooKG4rMSkqZS1uKSk6LjUqKChlLTIpKihlLTIpKigobisxKSooZS0yKStuKSsyKX19LGluQm91bmNlOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLW4ub3V0Qm91bmNlKCkoMS10KX19LG91dEJvdW5jZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS8yLjc1PnQ/Ny41NjI1KnQqdDoyLzIuNzU+dD8odC09MS41LzIuNzUsNy41NjI1KnQqdCsuNzUpOjIuNS8yLjc1PnQ/KHQtPTIuMjUvMi43NSw3LjU2MjUqdCp0Ky45Mzc1KToodC09Mi42MjUvMi43NSw3LjU2MjUqdCp0Ky45ODQzNzUpfX0saW5PdXRCb3VuY2U6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuLjU+dD8uNSpuLmluQm91bmNlKCkoMip0KTouNSpuLm91dEJvdW5jZSgpKDIqdC0xKSsuNX19LGN1c3RvbUFycmF5OmZ1bmN0aW9uKHQpe3JldHVybiB0P2Z1bmN0aW9uKHQpe3JldHVybiB0fTpuLmxpbmVhcigpfX07ZVtcImRlZmF1bHRcIl09bn0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1mdW5jdGlvbiByKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgZT17fTtpZihudWxsIT10KWZvcih2YXIgbiBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pJiYoZVtuXT10W25dKTtyZXR1cm4gZVtcImRlZmF1bHRcIl09dCxlfWZ1bmN0aW9uIHModCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfWZ1bmN0aW9uIG8odCxlKXtpZighdCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIWV8fFwib2JqZWN0XCIhPXR5cGVvZiBlJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBlP3Q6ZX1mdW5jdGlvbiBhKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmbnVsbCE9PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIrdHlwZW9mIGUpO3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LGVudW1lcmFibGU6ITEsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLGUmJihPYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LnNldFByb3RvdHlwZU9mKHQsZSk6dC5fX3Byb3RvX189ZSl9ZnVuY3Rpb24gdSh0LGUsbixpLHIscyl7Zm9yKHZhciBvIGluIHQpaWYoYyh0W29dKSl1KHRbb10sZVtvXSxuW29dLGkscixzKTtlbHNle3ZhciBhPWVbb10saD10W29dLWVbb10sbD1pLGY9ci9sO25bb109YStoKnMoZil9fWZ1bmN0aW9uIGgodCxlLG4pe2Zvcih2YXIgaSBpbiB0KTA9PT1lW2ldfHxlW2ldfHwoYyhuW2ldKT8oZVtpXT1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG5baV0pKSxoKHRbaV0sZVtpXSxuW2ldKSk6ZVtpXT1uW2ldKX1mdW5jdGlvbiBjKHQpe3JldHVyblwiW29iamVjdCBPYmplY3RdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCl9dmFyIGw9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgZj1uKDEpLHA9cihmKSxkPW4oMiksZz1pKGQpLHY9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSh0LG4pe3ModGhpcyxlKTt2YXIgaT1vKHRoaXMsT2JqZWN0LmdldFByb3RvdHlwZU9mKGUpLmNhbGwodGhpcykpO3JldHVybiBpLnRhcmdldD10LG4mJmkuYWRkVG8obiksaS5jbGVhcigpLGl9cmV0dXJuIGEoZSx0KSxsKGUsW3trZXk6XCJhZGRUb1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLm1hbmFnZXI9dCx0aGlzLm1hbmFnZXIuYWRkVHdlZW4odGhpcyksdGhpc319LHtrZXk6XCJjaGFpblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0fHwodD1uZXcgZSh0aGlzLnRhcmdldCkpLHRoaXMuX2NoYWluVHdlZW49dCx0fX0se2tleTpcInN0YXJ0XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hY3RpdmU9ITAsdGhpc319LHtrZXk6XCJzdG9wXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hY3RpdmU9ITEsdGhpcy5lbWl0KFwic3RvcFwiKSx0aGlzfX0se2tleTpcInRvXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX3RvPXQsdGhpc319LHtrZXk6XCJmcm9tXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2Zyb209dCx0aGlzfX0se2tleTpcInJlbW92ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWFuYWdlcj8odGhpcy5tYW5hZ2VyLnJlbW92ZVR3ZWVuKHRoaXMpLHRoaXMpOnRoaXN9fSx7a2V5OlwiY2xlYXJcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMudGltZT0wLHRoaXMuYWN0aXZlPSExLHRoaXMuZWFzaW5nPWdbXCJkZWZhdWx0XCJdLmxpbmVhcigpLHRoaXMuZXhwaXJlPSExLHRoaXMucmVwZWF0PTAsdGhpcy5sb29wPSExLHRoaXMuZGVsYXk9MCx0aGlzLnBpbmdQb25nPSExLHRoaXMuaXNTdGFydGVkPSExLHRoaXMuaXNFbmRlZD0hMSx0aGlzLl90bz1udWxsLHRoaXMuX2Zyb209bnVsbCx0aGlzLl9kZWxheVRpbWU9MCx0aGlzLl9lbGFwc2VkVGltZT0wLHRoaXMuX3JlcGVhdD0wLHRoaXMuX3BpbmdQb25nPSExLHRoaXMuX2NoYWluVHdlZW49bnVsbCx0aGlzLnBhdGg9bnVsbCx0aGlzLnBhdGhSZXZlcnNlPSExLHRoaXMucGF0aEZyb209MCx0aGlzLnBhdGhUbz0wfX0se2tleTpcInJlc2V0XCIsdmFsdWU6ZnVuY3Rpb24oKXtpZih0aGlzLl9lbGFwc2VkVGltZT0wLHRoaXMuX3JlcGVhdD0wLHRoaXMuX2RlbGF5VGltZT0wLHRoaXMuaXNTdGFydGVkPSExLHRoaXMuaXNFbmRlZD0hMSx0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyl7dmFyIHQ9dGhpcy5fdG8sZT10aGlzLl9mcm9tO3RoaXMuX3RvPWUsdGhpcy5fZnJvbT10LHRoaXMuX3BpbmdQb25nPSExfXJldHVybiB0aGlzfX0se2tleTpcInVwZGF0ZVwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7aWYodGhpcy5fY2FuVXBkYXRlKCl8fCF0aGlzLl90byYmIXRoaXMucGF0aCl7dmFyIG49dm9pZCAwLGk9dm9pZCAwO2lmKHRoaXMuZGVsYXk+dGhpcy5fZGVsYXlUaW1lKXJldHVybiB2b2lkKHRoaXMuX2RlbGF5VGltZSs9ZSk7dGhpcy5pc1N0YXJ0ZWR8fCh0aGlzLl9wYXJzZURhdGEoKSx0aGlzLmlzU3RhcnRlZD0hMCx0aGlzLmVtaXQoXCJzdGFydFwiKSk7dmFyIHI9dGhpcy5waW5nUG9uZz90aGlzLnRpbWUvMjp0aGlzLnRpbWU7aWYocj50aGlzLl9lbGFwc2VkVGltZSl7dmFyIHM9dGhpcy5fZWxhcHNlZFRpbWUrZSxvPXM+PXI7dGhpcy5fZWxhcHNlZFRpbWU9bz9yOnMsdGhpcy5fYXBwbHkocik7dmFyIGE9dGhpcy5fcGluZ1Bvbmc/cit0aGlzLl9lbGFwc2VkVGltZTp0aGlzLl9lbGFwc2VkVGltZTtpZih0aGlzLmVtaXQoXCJ1cGRhdGVcIixhKSxvKXtpZih0aGlzLnBpbmdQb25nJiYhdGhpcy5fcGluZ1BvbmcpcmV0dXJuIHRoaXMuX3BpbmdQb25nPSEwLG49dGhpcy5fdG8saT10aGlzLl9mcm9tLHRoaXMuX2Zyb209bix0aGlzLl90bz1pLHRoaXMucGF0aCYmKG49dGhpcy5wYXRoVG8saT10aGlzLnBhdGhGcm9tLHRoaXMucGF0aFRvPWksdGhpcy5wYXRoRnJvbT1uKSx0aGlzLmVtaXQoXCJwaW5ncG9uZ1wiKSx2b2lkKHRoaXMuX2VsYXBzZWRUaW1lPTApO2lmKHRoaXMubG9vcHx8dGhpcy5yZXBlYXQ+dGhpcy5fcmVwZWF0KXJldHVybiB0aGlzLl9yZXBlYXQrKyx0aGlzLmVtaXQoXCJyZXBlYXRcIix0aGlzLl9yZXBlYXQpLHRoaXMuX2VsYXBzZWRUaW1lPTAsdm9pZCh0aGlzLnBpbmdQb25nJiZ0aGlzLl9waW5nUG9uZyYmKG49dGhpcy5fdG8saT10aGlzLl9mcm9tLHRoaXMuX3RvPWksdGhpcy5fZnJvbT1uLHRoaXMucGF0aCYmKG49dGhpcy5wYXRoVG8saT10aGlzLnBhdGhGcm9tLHRoaXMucGF0aFRvPWksdGhpcy5wYXRoRnJvbT1uKSx0aGlzLl9waW5nUG9uZz0hMSkpO3RoaXMuaXNFbmRlZD0hMCx0aGlzLmFjdGl2ZT0hMSx0aGlzLmVtaXQoXCJlbmRcIiksdGhpcy5fY2hhaW5Ud2VlbiYmKHRoaXMuX2NoYWluVHdlZW4uYWRkVG8odGhpcy5tYW5hZ2VyKSx0aGlzLl9jaGFpblR3ZWVuLnN0YXJ0KCkpfX19fX0se2tleTpcIl9wYXJzZURhdGFcIix2YWx1ZTpmdW5jdGlvbigpe2lmKCF0aGlzLmlzU3RhcnRlZCYmKHRoaXMuX2Zyb218fCh0aGlzLl9mcm9tPXt9KSxoKHRoaXMuX3RvLHRoaXMuX2Zyb20sdGhpcy50YXJnZXQpLHRoaXMucGF0aCkpe3ZhciB0PXRoaXMucGF0aC50b3RhbERpc3RhbmNlKCk7dGhpcy5wYXRoUmV2ZXJzZT8odGhpcy5wYXRoRnJvbT10LHRoaXMucGF0aFRvPTApOih0aGlzLnBhdGhGcm9tPTAsdGhpcy5wYXRoVG89dCl9fX0se2tleTpcIl9hcHBseVwiLHZhbHVlOmZ1bmN0aW9uKHQpe2lmKHUodGhpcy5fdG8sdGhpcy5fZnJvbSx0aGlzLnRhcmdldCx0LHRoaXMuX2VsYXBzZWRUaW1lLHRoaXMuZWFzaW5nKSx0aGlzLnBhdGgpe3ZhciBlPXRoaXMucGluZ1Bvbmc/dGhpcy50aW1lLzI6dGhpcy50aW1lLG49dGhpcy5wYXRoRnJvbSxpPXRoaXMucGF0aFRvLXRoaXMucGF0aEZyb20scj1lLHM9dGhpcy5fZWxhcHNlZFRpbWUvcixvPW4raSp0aGlzLmVhc2luZyhzKSxhPXRoaXMucGF0aC5nZXRQb2ludEF0RGlzdGFuY2Uobyk7dGhpcy50YXJnZXQucG9zaXRpb24uc2V0KGEueCxhLnkpfX19LHtrZXk6XCJfY2FuVXBkYXRlXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aW1lJiZ0aGlzLmFjdGl2ZSYmdGhpcy50YXJnZXR9fV0pLGV9KHAudXRpbHMuRXZlbnRFbWl0dGVyKTtlW1wiZGVmYXVsdFwiXT12fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIHIodCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG89bigzKSxhPWkobyksdT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtyKHRoaXMsdCksdGhpcy50d2VlbnM9W10sdGhpcy5fdHdlZW5zVG9EZWxldGU9W10sdGhpcy5fbGFzdD0wfXJldHVybiBzKHQsW3trZXk6XCJ1cGRhdGVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT12b2lkIDA7dHx8MD09PXQ/ZT0xZTMqdDooZT10aGlzLl9nZXREZWx0YU1TKCksdD1lLzFlMyk7Zm9yKHZhciBuPTA7bjx0aGlzLnR3ZWVucy5sZW5ndGg7bisrKXt2YXIgaT10aGlzLnR3ZWVuc1tuXTtpLmFjdGl2ZSYmKGkudXBkYXRlKHQsZSksaS5pc0VuZGVkJiZpLmV4cGlyZSYmaS5yZW1vdmUoKSl9aWYodGhpcy5fdHdlZW5zVG9EZWxldGUubGVuZ3RoKXtmb3IodmFyIG49MDtuPHRoaXMuX3R3ZWVuc1RvRGVsZXRlLmxlbmd0aDtuKyspdGhpcy5fcmVtb3ZlKHRoaXMuX3R3ZWVuc1RvRGVsZXRlW25dKTt0aGlzLl90d2VlbnNUb0RlbGV0ZS5sZW5ndGg9MH19fSx7a2V5OlwiZ2V0VHdlZW5zRm9yVGFyZ2V0XCIsdmFsdWU6ZnVuY3Rpb24odCl7Zm9yKHZhciBlPVtdLG49MDtuPHRoaXMudHdlZW5zLmxlbmd0aDtuKyspdGhpcy50d2VlbnNbbl0udGFyZ2V0PT09dCYmZS5wdXNoKHRoaXMudHdlZW5zW25dKTtyZXR1cm4gZX19LHtrZXk6XCJjcmVhdGVUd2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBuZXcgYVtcImRlZmF1bHRcIl0odCx0aGlzKX19LHtrZXk6XCJhZGRUd2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3QubWFuYWdlcj10aGlzLHRoaXMudHdlZW5zLnB1c2godCl9fSx7a2V5OlwicmVtb3ZlVHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLl90d2VlbnNUb0RlbGV0ZS5wdXNoKHQpfX0se2tleTpcIl9yZW1vdmVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLnR3ZWVucy5pbmRleE9mKHQpOy0xIT09ZSYmdGhpcy50d2VlbnMuc3BsaWNlKGUsMSl9fSx7a2V5OlwiX2dldERlbHRhTVNcIix2YWx1ZTpmdW5jdGlvbigpezA9PT10aGlzLl9sYXN0JiYodGhpcy5fbGFzdD1EYXRlLm5vdygpKTt2YXIgdD1EYXRlLm5vdygpLGU9dC10aGlzLl9sYXN0O3JldHVybiB0aGlzLl9sYXN0PXQsZX19XSksdH0oKTtlW1wiZGVmYXVsdFwiXT11fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1mdW5jdGlvbiByKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgcz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPW4oMSksYT1pKG8pLHU9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7cih0aGlzLHQpLHRoaXMuX2NvbHNlZD0hMSx0aGlzLnBvbHlnb249bmV3IGEuUG9seWdvbix0aGlzLnBvbHlnb24uY2xvc2VkPSExLHRoaXMuX3RtcFBvaW50PW5ldyBhLlBvaW50LHRoaXMuX3RtcFBvaW50Mj1uZXcgYS5Qb2ludCx0aGlzLl90bXBEaXN0YW5jZT1bXSx0aGlzLmN1cnJlbnRQYXRoPW51bGwsdGhpcy5ncmFwaGljc0RhdGE9W10sdGhpcy5kaXJ0eT0hMH1yZXR1cm4gcyh0LFt7a2V5OlwibW92ZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUubW92ZVRvLmNhbGwodGhpcyx0LGUpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJsaW5lVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5saW5lVG8uY2FsbCh0aGlzLHQsZSksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImJlemllckN1cnZlVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpLHIscyl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmJlemllckN1cnZlVG8uY2FsbCh0aGlzLHQsZSxuLGkscixzKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwicXVhZHJhdGljQ3VydmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5xdWFkcmF0aWNDdXJ2ZVRvLmNhbGwodGhpcyx0LGUsbixpKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiYXJjVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpLHIpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5hcmNUby5jYWxsKHRoaXMsdCxlLG4saSxyKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiYXJjXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSxyLHMpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5hcmMuY2FsbCh0aGlzLHQsZSxuLGkscixzKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwiZHJhd1NoYXBlXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLmRyYXdTaGFwZS5jYWxsKHRoaXMsdCksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImdldFBvaW50XCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5wYXJzZVBvaW50cygpO3ZhciBlPXRoaXMuY2xvc2VkJiZ0Pj10aGlzLmxlbmd0aC0xPzA6Mip0O3JldHVybiB0aGlzLl90bXBQb2ludC5zZXQodGhpcy5wb2x5Z29uLnBvaW50c1tlXSx0aGlzLnBvbHlnb24ucG9pbnRzW2UrMV0pLHRoaXMuX3RtcFBvaW50fX0se2tleTpcImRpc3RhbmNlQmV0d2VlblwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7dGhpcy5wYXJzZVBvaW50cygpO3ZhciBuPXRoaXMuZ2V0UG9pbnQodCksaT1uLngscj1uLnkscz10aGlzLmdldFBvaW50KGUpLG89cy54LGE9cy55LHU9by1pLGg9YS1yO3JldHVybiBNYXRoLnNxcnQodSp1K2gqaCl9fSx7a2V5OlwidG90YWxEaXN0YW5jZVwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5wYXJzZVBvaW50cygpLHRoaXMuX3RtcERpc3RhbmNlLmxlbmd0aD0wLHRoaXMuX3RtcERpc3RhbmNlLnB1c2goMCk7Zm9yKHZhciB0PXRoaXMubGVuZ3RoLGU9MCxuPTA7dC0xPm47bisrKWUrPXRoaXMuZGlzdGFuY2VCZXR3ZWVuKG4sbisxKSx0aGlzLl90bXBEaXN0YW5jZS5wdXNoKGUpO3JldHVybiBlfX0se2tleTpcImdldFBvaW50QXRcIix2YWx1ZTpmdW5jdGlvbih0KXtpZih0aGlzLnBhcnNlUG9pbnRzKCksdD50aGlzLmxlbmd0aClyZXR1cm4gdGhpcy5nZXRQb2ludCh0aGlzLmxlbmd0aC0xKTtpZih0JTE9PT0wKXJldHVybiB0aGlzLmdldFBvaW50KHQpO3RoaXMuX3RtcFBvaW50Mi5zZXQoMCwwKTt2YXIgZT10JTEsbj10aGlzLmdldFBvaW50KE1hdGguY2VpbCh0KSksaT1uLngscj1uLnkscz10aGlzLmdldFBvaW50KE1hdGguZmxvb3IodCkpLG89cy54LGE9cy55LHU9LSgoby1pKSplKSxoPS0oKGEtcikqZSk7cmV0dXJuIHRoaXMuX3RtcFBvaW50Mi5zZXQobyt1LGEraCksdGhpcy5fdG1wUG9pbnQyfX0se2tleTpcImdldFBvaW50QXREaXN0YW5jZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMucGFyc2VQb2ludHMoKSx0aGlzLl90bXBEaXN0YW5jZXx8dGhpcy50b3RhbERpc3RhbmNlKCk7dmFyIGU9dGhpcy5fdG1wRGlzdGFuY2UubGVuZ3RoLG49MCxpPXRoaXMuX3RtcERpc3RhbmNlW3RoaXMuX3RtcERpc3RhbmNlLmxlbmd0aC0xXTswPnQ/dD1pK3Q6dD5pJiYodC09aSk7Zm9yKHZhciByPTA7ZT5yJiYodD49dGhpcy5fdG1wRGlzdGFuY2Vbcl0mJihuPXIpLCEodDx0aGlzLl90bXBEaXN0YW5jZVtyXSkpO3IrKyk7aWYobj09PXRoaXMubGVuZ3RoLTEpcmV0dXJuIHRoaXMuZ2V0UG9pbnRBdChuKTt2YXIgcz10LXRoaXMuX3RtcERpc3RhbmNlW25dLG89dGhpcy5fdG1wRGlzdGFuY2VbbisxXS10aGlzLl90bXBEaXN0YW5jZVtuXTtyZXR1cm4gdGhpcy5nZXRQb2ludEF0KG4rcy9vKX19LHtrZXk6XCJwYXJzZVBvaW50c1wiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoIXRoaXMuZGlydHkpcmV0dXJuIHRoaXM7dGhpcy5kaXJ0eT0hMSx0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aD0wO2Zvcih2YXIgdD0wO3Q8dGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoO3QrKyl7dmFyIGU9dGhpcy5ncmFwaGljc0RhdGFbdF0uc2hhcGU7ZSYmZS5wb2ludHMmJih0aGlzLnBvbHlnb24ucG9pbnRzPXRoaXMucG9seWdvbi5wb2ludHMuY29uY2F0KGUucG9pbnRzKSl9cmV0dXJuIHRoaXN9fSx7a2V5OlwiY2xlYXJcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg9MCx0aGlzLmN1cnJlbnRQYXRoPW51bGwsdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGg9MCx0aGlzLl9jbG9zZWQ9ITEsdGhpcy5kaXJ0eT0hMSx0aGlzfX0se2tleTpcImNsb3NlZFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jbG9zZWR9LHNldDpmdW5jdGlvbih0KXt0aGlzLl9jbG9zZWQhPT10JiYodGhpcy5wb2x5Z29uLmNsb3NlZD10LHRoaXMuX2Nsb3NlZD10LHRoaXMuZGlydHk9ITApfX0se2tleTpcImxlbmd0aFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aD90aGlzLnBvbHlnb24ucG9pbnRzLmxlbmd0aC8yKyh0aGlzLl9jbG9zZWQ/MTowKTowfX1dKSx0fSgpO2VbXCJkZWZhdWx0XCJdPXV9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gcih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgcz1uKDEpLG89cihzKSxhPW4oNCksdT1pKGEpLGg9bigzKSxjPWkoaCksbD1uKDUpLGY9aShsKSxwPW4oMiksZD1pKHApO28uR3JhcGhpY3MucHJvdG90eXBlLmRyYXdQYXRoPWZ1bmN0aW9uKHQpe3JldHVybiB0LnBhcnNlUG9pbnRzKCksdGhpcy5kcmF3U2hhcGUodC5wb2x5Z29uKSx0aGlzfTt2YXIgZz17VHdlZW5NYW5hZ2VyOnVbXCJkZWZhdWx0XCJdLFR3ZWVuOmNbXCJkZWZhdWx0XCJdLEVhc2luZzpkW1wiZGVmYXVsdFwiXSxUd2VlblBhdGg6ZltcImRlZmF1bHRcIl19O28udHdlZW5NYW5hZ2VyfHwoby50d2Vlbk1hbmFnZXI9bmV3IHVbXCJkZWZhdWx0XCJdLG8udHdlZW49ZyksZVtcImRlZmF1bHRcIl09Z31dKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpeGktdHdlZW4uanMubWFwIiwibW9kdWxlLmV4cG9ydHM9e1xyXG4gIFwiQVwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiY2VsbDEucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiBmYWxzZSxcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiY2VsbDEtZmlsbC5wbmdcIixcclxuICAgIFwiYWN0aXZhdGlvblwiOiA1LFxyXG4gICAgXCJzY29yZVwiOiAxXHJcbiAgfSxcclxuICBcIkJcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGwyLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogZmFsc2VcclxuICB9LFxyXG4gIFwiQ1wiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiY2VsbDQucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiBmYWxzZSxcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiY2VsbDQtZmlsbC5wbmdcIixcclxuICAgIFwiYWN0aXZhdGlvblwiOiAyNSxcclxuICAgIFwic2NvcmVcIjogM1xyXG4gIH0sXHJcbiAgXCJJVExcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRUTC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklUXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kVC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklUUlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFRSLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSVJcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRSLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSUJSXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kQlIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJQlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJQkxcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRCTC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklMXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kTC5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IHRydWUsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDBcclxuICB9LFxyXG4gIFwiSUNcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRDLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMFxyXG4gIH1cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgXCJsZXRcIjogW1xyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBfEJcIiwgXCJBfEJ8Q1wiLCBcIkFcIl0sXHJcbiAgICAgIFwic2h1ZmZsZVwiOiB0cnVlXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBfEJcIiwgXCJBXCIsIFwiQVwiXSxcclxuICAgICAgXCJzaHVmZmxlXCI6IHRydWVcclxuICAgIH1cclxuICBdLFxyXG4gIFwiaXNsYW5kXCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQVwiLCBcIkJcIiwgXCJBXCJdLFxyXG4gICAgICBcInNodWZmbGVcIjogdHJ1ZVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQVwiLCBcIkFcIiwgXCJBXCJdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJJVExcIiwgXCJJVFwiLCBcIklUUlwiXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiSUxcIiwgIFwiSUNcIiwgIFwiSVJcIl1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIklCTFwiLCBcIklCXCIsIFwiSUJSXCJdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBXCIsIFwiQVwiLCBcIkFcIl1cclxuICAgIH1cclxuICBdXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHM9W1xyXG4gIHtcclxuICAgIFwiZnJhZ21lbnRzXCI6IHtcclxuICAgICAgXCJpc2xhbmRcIjogMSxcclxuICAgICAgXCJsZXRcIjogMTAsXHJcbiAgICAgIFwiaXNsYW5kXCI6IDFcclxuICAgIH0sXHJcbiAgICBcImhpc3RvcnlcIjoge1xyXG4gICAgICBcInJ1XCI6IFwi0KLQu9C10L0g0LjQtNC10YIg0LfQsCDRgtC+0LHQvtC5INC/0L4g0L/Rj9GC0LDQvC4gXFxuINCe0YLRgdGC0YPQv9C40YHRjCDQuCDQvtC9INGC0LXQsdGPINC/0L7Qs9C70LDRgtC40YIuLi4gXFxuINCd0L4g0L3QtSDRgdGC0L7QuNGCINC+0YLRh9Cw0LjQstCw0YLRjNGB0Y8sINCy0LXQtNGMINC80YPQt9GL0LrQsCDQstGB0LXQs9C00LAg0YEg0YLQvtCx0L7QuS5cIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJmcmFnbWVudHNcIjoge1xyXG4gICAgICBcImxldFwiOiAxMCxcclxuICAgICAgXCJpc2xhbmRcIjogMVxyXG4gICAgfSxcclxuICAgIFwiaGlzdG9yeVwiOiB7XHJcbiAgICAgIFwicnVcIjogXCLQotC70LXQvSDQvdC1INGJ0LDQtNC40YIg0L3QuNC60L7Qs9C+LiDQm9C10YLRg9GH0LjQtSDQt9C80LXQuCDQv9Cw0LTRg9GCINC90LAg0LfQtdC80LvRjiDQuCDQv9C+0LPRgNGD0LfRj9GC0YHRjyDQsiDRgNGD0YLQuNC90YMg0LHRi9GC0LjRjy4uLlwiXHJcbiAgICB9XHJcbiAgfSxcclxuICB7XHJcbiAgICBcImZyYWdtZW50c1wiOiB7XHJcbiAgICAgIFwibGV0XCI6IDEwLFxyXG4gICAgICBcImlzbGFuZFwiOiAxXHJcbiAgICB9LFxyXG4gICAgXCJoaXN0b3J5XCI6IHtcclxuICAgICAgXCJydVwiOiBcItCYINGC0L7Qs9C00LAg0L7QvSDQv9C+0L3QtdGBINGB0LLQtdGH0YMg0YfQtdGA0LXQtyDRh9GD0LbQuNC1INC30LXQvNC70Lgg0L7RgdCy0L7QsdC+0LbQtNCw0Y8g0LvQtdGC0YPRh9C40YUg0LfQvNC10Lkg0Lgg0YHQstC+0Lkg0L3QsNGA0L7QtC4uLlwiXHJcbiAgICB9XHJcbiAgfVxyXG5dXHJcbiIsImNvbnN0IFNjZW5lc01hbmFnZXIgPSByZXF1aXJlKCcuL21hbmFnZXJzL1NjZW5lc01hbmFnZXInKTtcclxuXHJcbmNsYXNzIEdhbWUgZXh0ZW5kcyBQSVhJLkFwcGxpY2F0aW9uIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHtiYWNrZ3JvdW5kQ29sb3I6IDB4ZmNmY2ZjfSlcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcclxuXHJcbiAgICB0aGlzLncgPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgIHRoaXMuaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbiAgICB0aGlzLnNjZW5lcyA9IG5ldyBTY2VuZXNNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLnNjZW5lcyk7XHJcblxyXG4gICAgdGhpcy5faW5pdFRpY2tlcigpO1xyXG4gIH1cclxuICBfaW5pdFRpY2tlcigpIHtcclxuICAgIHRoaXMudGlja2VyLmFkZCgoZHQpID0+IHtcclxuICAgICAgdGhpcy5zY2VuZXMudXBkYXRlKGR0KTtcclxuICAgICAgUElYSS50d2Vlbk1hbmFnZXIudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuIiwicmVxdWlyZSgncGl4aS1zb3VuZCcpO1xyXG5yZXF1aXJlKCdwaXhpLXR3ZWVuJyk7XHJcbnJlcXVpcmUoJ3BpeGktcHJvamVjdGlvbicpO1xyXG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJyk7XHJcblxyXG5QSVhJLmxvYWRlclxyXG4gIC5hZGQoJ2Jsb2NrcycsICdhc3NldHMvYmxvY2tzLmpzb24nKVxyXG4gIC5hZGQoJ3BsYXllcicsICdhc3NldHMvcGxheWVyLnBuZycpXHJcbiAgLmFkZCgnbXVzaWMnLCAnYXNzZXRzL211c2ljLm1wMycpXHJcbiAgLmxvYWQoKGxvYWRlciwgcmVzb3VyY2VzKSA9PiB7XHJcbiAgICAvLyBQSVhJLnNvdW5kLnBsYXkoJ211c2ljJyk7XHJcbiAgICBsZXQgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbiAgICBnYW1lLnNjZW5lcy5zZXRTY2VuZSgncGxheWdyb3VuZCcpO1xyXG5cclxuICAgIHdpbmRvdy5nYW1lID0gZ2FtZTtcclxuICB9KTtcclxuIiwiY2xhc3MgSGlzdG9yeU1hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBcclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGlzdG9yeU1hbmFnZXI7XHJcbiIsImNvbnN0IERhdGFGcmFnbWVudENvbnZlcnRlciA9IHJlcXVpcmUoJy4uL3V0aWxzL0RhdGFGcmFnbWVudENvbnZlcnRlcicpO1xyXG5cclxuY2xhc3MgTGV2ZWxNYW5hZ2VyIGV4dGVuZHMgUElYSS5wcm9qZWN0aW9uLkNvbnRhaW5lcjJkIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLm1hcCA9IHNjZW5lLm1hcDtcclxuXHJcbiAgICB0aGlzLmxldmVscyA9IFtdO1xyXG4gICAgdGhpcy5mcmFnbWVudHNEYXRhID0ge307XHJcbiAgICB0aGlzLmFkZEZyYWdtZW50c0RhdGEocmVxdWlyZSgnLi4vY29udGVudC9mcmFnbWVudHMnKSk7XHJcbiAgICB0aGlzLmFkZExldmVscyhyZXF1aXJlKCcuLi9jb250ZW50L2xldmVscycpKVxyXG5cclxuICAgIHRoaXMuY3VycmVudExldmVsID0gMDtcclxuICAgIHRoaXMuY3VycmVudEZyYWdtZW50ID0gMDtcclxuXHJcbiAgICB0aGlzLnNldExldmVsKDApO1xyXG4gICAgdGhpcy5tYXAub24oJ21hcEVuZCcsICgpID0+IHRoaXMubmV4dEZyYWdtZW50KCkpO1xyXG4gIH1cclxuXHJcbiAgLy8gYWRkIGZyYWdtZW50cyB0byBkYiBmcmFnbWVudHNcclxuICBhZGRGcmFnbWVudHNEYXRhKGRhdGE9e30pIHtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5mcmFnbWVudHNEYXRhLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIC8vIGFkZCBsZXZlbHMgdG8gZGIgbGV2ZWxzXHJcbiAgYWRkTGV2ZWxzKGxldmVscz1bXSkge1xyXG4gICAgdGhpcy5sZXZlbHMgPSB0aGlzLmxldmVscy5jb25jYXQobGV2ZWxzKTtcclxuXHJcbiAgICAvLyBnZW5lcmF0ZSBtYXAgZm9yIGV2ZXJ5IGxldmVsIGZyb20gZnJhZ21lbnRzXHJcbiAgICBsZXZlbHMuZm9yRWFjaCgobHZsKSA9PiB7XHJcbiAgICAgIC8vIGx2bCBzYXZlZCBpbiB0aGlzLmxldmVsc1xyXG4gICAgICBsdmwubWFwcyA9IFtdO1xyXG4gICAgICBmb3IobGV0IGtleSBpbiBsdmwuZnJhZ21lbnRzKSB7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGx2bC5mcmFnbWVudHNba2V5XTsgaSsrKSB7XHJcbiAgICAgICAgICB0aGlzLmZyYWdtZW50c0RhdGFba2V5XSAmJiBsdmwubWFwcy5wdXNoKHRoaXMuZnJhZ21lbnRzRGF0YVtrZXldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gZ2V0dGVyc1xyXG4gIGdldEN1cnJlbnRMZXZlbCgpIHtcclxuICAgIHJldHVybiB0aGlzLmxldmVsc1t0aGlzLmN1cnJlbnRMZXZlbF07XHJcbiAgfVxyXG4gIGdldEN1cnJlbnRGcmFnbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLmdldEN1cnJlbnRMZXZlbCgpLm1hcHNbdGhpcy5jdXJyZW50RnJhZ21lbnRdO1xyXG4gIH1cclxuXHJcbiAgLy9cclxuICBsb3NlTGV2ZWwoKSB7XHJcbiAgICAvLyBUaGVyZSBtb3JlIGxvZ2ljIHdpdGggaGlzdG9yeS4uLlxyXG4gICAgdGhpcy5zY2VuZS5yZXN0YXJ0KCk7XHJcbiAgfVxyXG4gIGVuZExldmVsKCkge1xyXG4gICAgLy8gVGhlcmUgbW9yZSBsb2dpYyB3aXRoIGhpc3RvcnkuLi5cclxuICAgIHRoaXMubmV4dExldmVsKCk7XHJcbiAgfVxyXG5cclxuICAvLyBNZXRob2RzIGZvciBsZXZlbHMgY29udHJvbFxyXG4gIHNldExldmVsKGx2bCkge1xyXG4gICAgaWYobHZsID4gdGhpcy5sZXZlbHMubGVuZ3RoIHx8IGx2bCA8IDApIHJldHVybjtcclxuICAgIHRoaXMuY3VycmVudExldmVsID0gbHZsO1xyXG4gICAgdGhpcy5zZXRGcmFnbWVudCgwKTtcclxuICB9XHJcbiAgbmV4dExldmVsKCkge1xyXG4gICAgdGhpcy5zZXRMZXZlbCh0aGlzLmN1cnJlbnRMZXZlbCsxKTtcclxuICB9XHJcbiAgYmFja0xldmVsKCkge1xyXG4gICAgdGhpcy5zZXRMZXZlbCh0aGlzLmN1cnJlbnRMZXZlbC0xKTtcclxuICB9XHJcblxyXG5cclxuICAvLyBNZXRob2RzIGZvciBmcmFnbWVudHMgY29udHJvbFxyXG4gIHNldEZyYWdtZW50KGZyYWcpIHtcclxuICAgIGlmKGZyYWcgPCAwKSByZXR1cm47XHJcbiAgICB0aGlzLmN1cnJlbnRGcmFnbWVudCA9IGZyYWc7XHJcblxyXG4gICAgLy8gaWYgbm90IG1vcmUgZnJhZ21lbnRzLCB0aGVuIGxldmVsIGNvbXBsZXRlLi4uXHJcbiAgICBpZighdGhpcy5nZXRDdXJyZW50RnJhZ21lbnQoKSkgdGhpcy5lbmRMZXZlbCgpO1xyXG4gICAgdGhpcy5tYXAuYWRkTWFwKHRoaXMuZ2V0Q3VycmVudEZyYWdtZW50KCkpO1xyXG4gIH1cclxuICBuZXh0RnJhZ21lbnQoKSB7XHJcbiAgICB0aGlzLnNldEZyYWdtZW50KHRoaXMuY3VycmVudEZyYWdtZW50KzEpO1xyXG4gIH1cclxuICBiYWNrRnJhZ21lbnQoKSB7XHJcbiAgICB0aGlzLnNldEZyYWdtZW50KHRoaXMuY3VycmVudEZyYWdtZW50LTEpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMZXZlbE1hbmFnZXI7XHJcbiIsImNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi4vc3ViamVjdHMvQmxvY2snKTtcclxuY29uc3QgRGF0YUZyYWdtZW50Q29udmVydGVyID0gcmVxdWlyZSgnLi4vdXRpbHMvRGF0YUZyYWdtZW50Q29udmVydGVyJyk7XHJcblxyXG5jbGFzcyBNYXBNYW5hZ2VyIGV4dGVuZHMgUElYSS5wcm9qZWN0aW9uLkNvbnRhaW5lcjJkIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSwgcGFyYW1zPXt9KSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgIHRoaXMuZ2FtZSA9IHNjZW5lLmdhbWU7XHJcblxyXG4gICAgdGhpcy5tYXhBeGlzWCA9IHBhcmFtcy5tYXhYIHx8IDY7XHJcbiAgICB0aGlzLmJsb2NrU2l6ZSA9IHBhcmFtcy50aWxlU2l6ZSB8fCAxMDA7XHJcbiAgICB0aGlzLnNldEJsb2Nrc0RhdGEocmVxdWlyZSgnLi4vY29udGVudC9ibG9ja3MnKSk7XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG5cclxuICAgIHRoaXMuc3BlZWQgPSA1MDA7XHJcbiAgICB0aGlzLmxhc3RJbmRleCA9IDA7XHJcblxyXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcclxuICB9XHJcbiAgLy8gU2V0IHBhcmFtc1xyXG4gIHJlc2l6ZSgpIHtcclxuICAgIHRoaXMueCA9IHRoaXMuZ2FtZS53LzItdGhpcy5tYXhBeGlzWCp0aGlzLmJsb2NrU2l6ZS8yO1xyXG4gICAgdGhpcy55ID0gdGhpcy5nYW1lLmgtdGhpcy5zY2VuZS5QQURESU5HX0JPVFRPTTtcclxuICB9XHJcbiAgc2V0TWF4QXhpc1gobWF4KSB7XHJcbiAgICB0aGlzLm1heEF4aXNYID0gbWF4IHx8IDY7XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gIH1cclxuICBzZXRCbG9ja1NpemUoc2l6ZSkge1xyXG4gICAgdGhpcy5ibG9ja1NpemUgPSBzaXplIHx8IDEwMDtcclxuICAgIHRoaXMucmVzaXplKCk7XHJcbiAgfVxyXG4gIHNldFNwZWVkKHNwZWVkKSB7XHJcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQgfHwgNTAwO1xyXG4gIH1cclxuICBzZXRCbG9ja3NEYXRhKGRhdGEpIHtcclxuICAgIHRoaXMuQkxPQ0tTID0gZGF0YSB8fCB7fTtcclxuICB9XHJcblxyXG4gIC8vIEV2ZW50IEVtaXR0ZXJcclxuICBvbihlLCBjYikge1xyXG4gICAgdGhpcy5ldmVudHNbZV0gPSBjYjtcclxuICB9XHJcbiAgdHJpZ2dlckV2ZW50KGUsIGFyZykge1xyXG4gICAgdGhpcy5ldmVudHNbZV0gJiYgdGhpcy5ldmVudHNbZV0oYXJnKTtcclxuICB9XHJcblxyXG4gIC8vIE1hcCBNYW5hZ2VyXHJcbiAgYWRkTWFwKG1hcCkge1xyXG4gICAgZm9yKGxldCBpID0gbWFwLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xyXG4gICAgICB0aGlzLmFkZEZyYWdtZW50KG1hcFtpXSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFkZEZyYWdtZW50KGZyYWdEYXRhKSB7XHJcbiAgICBsZXQgZnJhZyA9IG5ldyBEYXRhRnJhZ21lbnRDb252ZXJ0ZXIoZnJhZ0RhdGEpLmZyYWdtZW50O1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmcmFnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIC8vIGFkZCBibG9jayB0byBjZW50ZXIgWCBheGlzLCBmb3IgZXhhbXBsZTogcm91bmQoKDgtNCkvMikgPT4gKzIgcGFkZGluZyB0byBibG9jayBYIHBvc1xyXG4gICAgICB0aGlzLmFkZEJsb2NrKGZyYWdbaV0sIE1hdGgucm91bmQoKHRoaXMubWF4QXhpc1gtZnJhZy5sZW5ndGgpLzIpK2ksIHRoaXMubGFzdEluZGV4KTtcclxuICAgIH1cclxuICAgIHRoaXMubGFzdEluZGV4Kys7XHJcbiAgfVxyXG4gIGFkZEJsb2NrKGlkLCB4LCB5KSB7XHJcbiAgICBpZihpZCA9PT0gJ18nKSByZXR1cm47XHJcblxyXG4gICAgbGV0IHBvc1ggPSB4KnRoaXMuYmxvY2tTaXplO1xyXG4gICAgbGV0IHBvc1kgPSAteSp0aGlzLmJsb2NrU2l6ZTtcclxuICAgIHRoaXMuYWRkQ2hpbGQobmV3IEJsb2NrKHRoaXMsIHBvc1gsIHBvc1ksIHRoaXMuQkxPQ0tTW2lkXSkpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29sbGlzaW9uIFdpZGggQmxvY2tcclxuICBnZXRCbG9ja0Zyb21Qb3MoeCwgeSkge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS5jb250YWluc1BvaW50KG5ldyBQSVhJLlBvaW50KHgsIHkpKSkgcmV0dXJuIHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBNb3ZpbmcgTWFwXHJcbiAgc2Nyb2xsRG93bihibG9ja3MpIHtcclxuICAgIC8vIFNjcm9sbCBtYXAgZG93biBvbiBYIGJsb2Nrc1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eTogdGhpcy55fSkudG8oe3k6IHRoaXMueStibG9ja3MqdGhpcy5ibG9ja1NpemV9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQqYmxvY2tzO1xyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4gdGhpcy50cmlnZ2VyRXZlbnQoJ3Njcm9sbEVuZCcpKTtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuICB9XHJcbiAgc2Nyb2xsVG9wKGJsb2Nrcykge1xyXG4gICAgLy8gU2Nyb2xsIG1hcCB0b3Agb24gWCBibG9ja3NcclxuICAgIGxldCBtb3ZlID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBtb3ZlLmZyb20oe3k6IHRoaXMueX0pLnRvKHt5OiB0aGlzLnktYmxvY2tzKnRoaXMuYmxvY2tTaXplfSk7XHJcbiAgICBtb3ZlLnRpbWUgPSB0aGlzLnNwZWVkKmJsb2NrcztcclxuICAgIG1vdmUub24oJ2VuZCcsICgpID0+IHRoaXMudHJpZ2dlckV2ZW50KCdzY3JvbGxFbmQnKSk7XHJcbiAgICBtb3ZlLnN0YXJ0KCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKSB7XHJcbiAgICAvLyBDb21wdXRpbmcgbWFwIGVuZCAoYW10IGJsb2NrcyA8IG1heCBhbXQgYmxvY2tzKVxyXG4gICAgaWYodGhpcy5jaGlsZHJlbi5sZW5ndGggPCB0aGlzLm1heEF4aXNYKih0aGlzLmdhbWUuaC90aGlzLmJsb2NrU2l6ZSkpIHtcclxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoJ21hcEVuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNsZWFyIG91dCByYW5nZSBtYXAgYmxvY2tzXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZih0aGlzLmNoaWxkcmVuW2ldLndvcmxkVHJhbnNmb3JtLnR5LXRoaXMuYmxvY2tTaXplLzIgPiB0aGlzLmdhbWUuaCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5jaGlsZHJlbltpXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwTWFuYWdlcjtcclxuIiwiY2xhc3MgU2NlbmVzTWFuYWdlciBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuXHJcbiAgICB0aGlzLnNjZW5lcyA9IHJlcXVpcmUoJy4uL3NjZW5lcycpO1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSA9IG51bGw7XHJcbiAgfVxyXG4gIGFkZFNjZW5lcyhzY2VuZXMpIHtcclxuICAgIGZvcihsZXQgaWQgaW4gc2NlbmVzKSB7XHJcbiAgICAgIHRoaXMuYWRkU2NlbmUoaWQsIHNjZW5lc1tpZF0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBhZGRTY2VuZShpZCwgc2NlbmUpIHtcclxuICAgIHRoaXMuc2NlbmVzW2lkXSA9IHNjZW5lO1xyXG4gIH1cclxuICBnZXRTY2VuZShpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2NlbmVzW2lkXTtcclxuICB9XHJcbiAgcmVzdGFydFNjZW5lKCkge1xyXG4gICAgdGhpcy5zZXRTY2VuZSh0aGlzLmFjdGl2ZVNjZW5lLl9pZFNjZW5lKTtcclxuICB9XHJcbiAgc2V0U2NlbmUoaWQpIHtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5hY3RpdmVTY2VuZSk7XHJcblxyXG4gICAgbGV0IFNjZW5lID0gdGhpcy5nZXRTY2VuZShpZCk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gdGhpcy5hZGRDaGlsZChuZXcgU2NlbmUodGhpcy5nYW1lLCB0aGlzKSk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lLl9pZFNjZW5lID0gaWQ7XHJcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVTY2VuZTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSAmJiB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZSAmJiB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZShkdCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lc01hbmFnZXI7XHJcbiIsImNsYXNzIFNjcmVlbk1hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5NYW5hZ2VyO1xyXG4iLCJjb25zdCBNYXBNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvTWFwTWFuYWdlcicpO1xyXG5jb25zdCBMZXZlbE1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9MZXZlbE1hbmFnZXInKTtcclxuY29uc3QgSGlzdG9yeU1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9IaXN0b3J5TWFuYWdlcicpO1xyXG5jb25zdCBTY3JlZW5NYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvU2NyZWVuTWFuYWdlcicpO1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuLi9zdWJqZWN0cy9QbGF5ZXInKTtcclxuXHJcbmNsYXNzIFBsYXlncm91bmQgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uQ29udGFpbmVyMmQge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIC8vIFByb2plY3Rpb24gc2NlbmVcclxuICAgIHRoaXMucHJvai5zZXRBeGlzWSh7eDogLXRoaXMuZ2FtZS53LzIrNTAsIHk6IDQwMDB9LCAtMSk7XHJcbiAgICAvLyBDb25zdGFudCBmb3IgcG9zaXRpb24gb2JqZWN0IGluIHByb2plY3Rpb25cclxuICAgIHRoaXMuUEFERElOR19CT1RUT00gPSAyODA7XHJcblxyXG4gICAgLy8gSW5pdCBvYmplY3RzXHJcbiAgICB0aGlzLnNjcmVlbiA9IG5ldyBTY3JlZW5NYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLnNjcmVlbik7XHJcblxyXG4gICAgdGhpcy5tYXAgPSBuZXcgTWFwTWFuYWdlcih0aGlzLCB7bWF4WDogNSwgdGlsZVNpemU6IDEwMH0pO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLm1hcCk7XHJcblxyXG4gICAgdGhpcy5sZXZlbHMgPSBuZXcgTGV2ZWxNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxldmVscyk7XHJcblxyXG4gICAgdGhpcy5oaXN0b3J5ID0gbmV3IEhpc3RvcnlNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLmhpc3RvcnkpO1xyXG5cclxuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcih0aGlzKTtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5wbGF5ZXIpO1xyXG4gIH1cclxuICByZXN0YXJ0KCkge1xyXG4gICAgdGhpcy5nYW1lLnNjZW5lcy5yZXN0YXJ0U2NlbmUoJ3BsYXlncm91bmQnKTtcclxuXHJcbiAgICAvLyB0aGlzLnNjcmVlbi5zcGxhc2goMHhGRkZGRkYsIDEwMDApLnRoZW4oKCkgPT4ge1xyXG4gICAgLy8gICB0aGlzLmdhbWUuc2NlbmVzLnJlc3RhcnRTY2VuZSgncGxheWdyb3VuZCcpO1xyXG4gICAgLy8gfSk7XHJcbiAgfVxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIHRoaXMubWFwLnVwZGF0ZSgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Z3JvdW5kO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAncGxheWdyb3VuZCc6IHJlcXVpcmUoJy4vUGxheWdyb3VuZCcpXHJcbn1cclxuIiwiY2xhc3MgQmxvY2sgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uU3ByaXRlMmQge1xyXG4gIGNvbnN0cnVjdG9yKG1hcCwgeCwgeSwgcGFyYW1zPXt9KSB7XHJcbiAgICBzdXBlcihQSVhJLlRleHR1cmUuZnJvbUZyYW1lKHBhcmFtcy5pbWFnZSB8fCBwYXJhbXMuYWN0aXZhdGlvbkltYWdlKSk7XHJcblxyXG4gICAgdGhpcy5tYXAgPSBtYXA7XHJcbiAgICB0aGlzLmdhbWUgPSB0aGlzLm1hcC5nYW1lO1xyXG5cclxuICAgIHRoaXMuc2NvcmUgPSBwYXJhbXMuc2NvcmU7XHJcbiAgICB0aGlzLmFjdGl2YXRpb24gPSBwYXJhbXMuYWN0aXZhdGlvbiB8fCBudWxsO1xyXG4gICAgdGhpcy5kZWFjdGl2YXRpb25UZXh0dXJlID0gcGFyYW1zLmltYWdlID8gUElYSS5UZXh0dXJlLmZyb21GcmFtZShwYXJhbXMuaW1hZ2UpIDogbnVsbDtcclxuICAgIHRoaXMuYWN0aXZhdGlvblRleHR1cmUgPSBwYXJhbXMuYWN0aXZhdGlvbkltYWdlID8gUElYSS5UZXh0dXJlLmZyb21GcmFtZShwYXJhbXMuYWN0aXZhdGlvbkltYWdlKSA6IG51bGw7XHJcbiAgICB0aGlzLmlzQWN0aXZlID0gcGFyYW1zLmFjdGl2ZTtcclxuICAgIHRoaXMucGxheWVyRGlyID0gcGFyYW1zLnBsYXllckRpciB8fCBudWxsO1xyXG5cclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSk7XHJcbiAgICB0aGlzLndpZHRoID0gbWFwLmJsb2NrU2l6ZSsxO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBtYXAuYmxvY2tTaXplKzE7XHJcbiAgICB0aGlzLnggPSB4K21hcC5ibG9ja1NpemUvMisuNTtcclxuICAgIHRoaXMueSA9IHkrbWFwLmJsb2NrU2l6ZS8yKy41O1xyXG5cclxuICAgIHRoaXMuam9sdGluZyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgdGhpcy5qb2x0aW5nLmZyb20oe3JvdGF0aW9uOiAtLjF9KS50byh7cm90YXRpb246IC4xfSk7XHJcbiAgICB0aGlzLmpvbHRpbmcudGltZSA9IDEwMDtcclxuICAgIHRoaXMuam9sdGluZy5yZXBlYXQgPSB0aGlzLmFjdGl2YXRpb247XHJcbiAgICB0aGlzLmpvbHRpbmcucGluZ1BvbmcgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG4gICAgdGhpcy5vbigncG9pbnRlcm1vdmUnLCB0aGlzLmhpdCwgdGhpcyk7XHJcbiAgfVxyXG4gIGFjdGl2YXRlKCkge1xyXG4gICAgbGV0IGFjdGl2YXRpbmcgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKVxyXG4gICAgICAuZnJvbSh7d2lkdGg6IHRoaXMud2lkdGgqMy80LCBoZWlnaHQ6IHRoaXMuaGVpZ2h0KjMvNH0pXHJcbiAgICAgIC50byh7d2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHR9KTtcclxuXHJcbiAgICBhY3RpdmF0aW5nLnRpbWUgPSA1MDA7XHJcbiAgICBhY3RpdmF0aW5nLmVhc2luZyA9IFBJWEkudHdlZW4uRWFzaW5nLm91dEJvdW5jZSgpO1xyXG4gICAgYWN0aXZhdGluZy5zdGFydCgpO1xyXG5cclxuICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xyXG4gICAgdGhpcy5qb2x0aW5nLnN0b3AoKTtcclxuICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uVGV4dHVyZSkgdGhpcy50ZXh0dXJlID0gdGhpcy5hY3RpdmF0aW9uVGV4dHVyZTtcclxuICB9XHJcbiAgZGVhY3RpdmF0ZSgpIHtcclxuICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcclxuICAgIGlmKHRoaXMuZGVhY3RpdmF0aW9uVGV4dHVyZSkgdGhpcy50ZXh0dXJlID0gdGhpcy5kZWFjdGl2YXRpb25UZXh0dXJlO1xyXG4gIH1cclxuICBoaXQoZSkge1xyXG4gICAgaWYodGhpcy5hY3RpdmF0aW9uID09PSBudWxsIHx8IHRoaXMuaXNBY3RpdmUpIHJldHVybjtcclxuXHJcbiAgICBpZih0aGlzLmNvbnRhaW5zUG9pbnQoZS5kYXRhLmdsb2JhbCkpIHtcclxuICAgICAgdGhpcy5qb2x0aW5nLnN0YXJ0KCk7XHJcbiAgICAgIGlmKHRoaXMuYWN0aXZhdGlvbikgdGhpcy5hY3RpdmF0aW9uLS07XHJcbiAgICAgIGVsc2UgdGhpcy5hY3RpdmF0ZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5qb2x0aW5nLnN0b3AoKTtcclxuICAgICAgdGhpcy5yb3RhdGlvbiA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCJjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uU3ByaXRlMmQge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lKSB7XHJcbiAgICBzdXBlcihQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdwbGF5ZXInKSk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5nYW1lID0gc2NlbmUuZ2FtZTtcclxuICAgIHRoaXMubWFwID0gc2NlbmUubWFwO1xyXG5cclxuICAgIHRoaXMucHJvai5hZmZpbmUgPSBQSVhJLnByb2plY3Rpb24uQUZGSU5FLkFYSVNfWDtcclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSwgMSk7XHJcbiAgICB0aGlzLnNjYWxlLnNldCguNSk7XHJcbiAgICB0aGlzLnggPSB0aGlzLmdhbWUudy8yO1xyXG4gICAgdGhpcy55ID0gdGhpcy5nYW1lLmgtdGhpcy5tYXAuYmxvY2tTaXplLzItdGhpcy5zY2VuZS5QQURESU5HX0JPVFRPTTtcclxuXHJcbiAgICB0aGlzLndhbGtpbmcgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzLnNjYWxlKTtcclxuICAgIHRoaXMud2Fsa2luZy5mcm9tKHt4OiAuNSwgeTogLjV9KS50byh7eDogLjYsIHk6IC42fSk7XHJcbiAgICB0aGlzLndhbGtpbmcudGltZSA9IDUwMDtcclxuICAgIHRoaXMud2Fsa2luZy5sb29wID0gdHJ1ZTtcclxuICAgIHRoaXMud2Fsa2luZy5waW5nUG9uZyA9IHRydWU7XHJcbiAgICB0aGlzLndhbGtpbmcuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gbnVsbDtcclxuICAgIHRoaXMuc3BlZWQgPSB0aGlzLm1hcC5zcGVlZCB8fCA1MDA7XHJcbiAgICB0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5pc0p1bXAgPSBmYWxzZTtcclxuICAgIHRoaXMuanVtcGluZ0NvdW50ID0gMTtcclxuXHJcbiAgICB0aGlzLm1hcC5vbignc2Nyb2xsRW5kJywgKCkgPT4gdGhpcy5tb3ZpbmcoKSk7XHJcbiAgICB0aGlzLm1hcC5zY3JvbGxEb3duKDEpO1xyXG5cclxuICAgIHRoaXMuc2NlbmUuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG4gICAgdGhpcy5zY2VuZS5vbigncG9pbnRlcmRvd24nLCAoKSA9PiB7XHJcbiAgICAgIGlmKCF0aGlzLmp1bXBpbmdDb3VudCkgcmV0dXJuO1xyXG4gICAgICB0aGlzLmp1bXBpbmdDb3VudC0tO1xyXG4gICAgICB0aGlzLmlzSnVtcCA9IHRydWU7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgbW92aW5nKCkge1xyXG4gICAgaWYodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHJcbiAgICBpZih0aGlzLmlzSnVtcCkge1xyXG4gICAgICB0aGlzLmFscGhhID0gLjU7XHJcbiAgICAgIHJldHVybiB0aGlzLmp1bXAoKTtcclxuICAgIH0gZWxzZSB0aGlzLmFscGhhID0gMTtcclxuXHJcbiAgICBsZXQgY3VyID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHRoaXMueCwgdGhpcy55K3RoaXMubWFwLmJsb2NrU2l6ZSk7XHJcbiAgICBpZihjdXIgJiYgY3VyLmlzQWN0aXZlKSB7XHJcbiAgICAgIGlmKGN1ci5wbGF5ZXJEaXIgPT09ICd0b3AnKSByZXR1cm4gdGhpcy50b3AoKTtcclxuICAgICAgaWYoY3VyLnBsYXllckRpciA9PT0gJ2xlZnQnKSByZXR1cm4gdGhpcy5sZWZ0KCk7XHJcbiAgICAgIGlmKGN1ci5wbGF5ZXJEaXIgPT09ICdyaWdodCcpIHJldHVybiB0aGlzLnJpZ2h0KCk7XHJcblxyXG4gICAgICAvL2NoZWNrIHRvcFxyXG4gICAgICBsZXQgdG9wID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgaWYodG9wICYmIHRvcC5pc0FjdGl2ZSAmJiB0aGlzLmxhc3RNb3ZlICE9PSAnYm90dG9tJykgcmV0dXJuIHRoaXMudG9wKCk7XHJcblxyXG4gICAgICAvLyBjaGVjayBsZWZ0XHJcbiAgICAgIGxldCBsZWZ0ID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHRoaXMueC10aGlzLm1hcC5ibG9ja1NpemUsIHRoaXMueSt0aGlzLm1hcC5ibG9ja1NpemUpO1xyXG4gICAgICBpZihsZWZ0ICYmIGxlZnQuaXNBY3RpdmUgJiYgdGhpcy5sYXN0TW92ZSAhPT0gJ3JpZ2h0JykgcmV0dXJuIHRoaXMubGVmdCgpO1xyXG5cclxuICAgICAgLy8gY2hlY2sgcmlndGhcclxuICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHRoaXMueCt0aGlzLm1hcC5ibG9ja1NpemUsIHRoaXMueSt0aGlzLm1hcC5ibG9ja1NpemUpO1xyXG4gICAgICBpZihyaWdodCAmJiByaWdodC5pc0FjdGl2ZSAmJiB0aGlzLmxhc3RNb3ZlICE9PSAnbGVmdCcpIHJldHVybiB0aGlzLnJpZ2h0KCk7XHJcblxyXG4gICAgICAvLyBvciBkaWVcclxuICAgICAgdGhpcy50b3AoKTtcclxuICAgIH0gZWxzZSB0aGlzLmRlYWQoKTtcclxuICB9XHJcbiAgZGVhZCgpIHtcclxuICAgIGxldCBkZWFkID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcy5zY2FsZSk7XHJcbiAgICBkZWFkLmZyb20oe3g6IC41LCB5OiAuNX0pLnRvKHt4OiAwLCB5OiAwfSk7XHJcbiAgICBkZWFkLnRpbWUgPSAyMDA7XHJcbiAgICBkZWFkLnN0YXJ0KCk7XHJcbiAgICBkZWFkLm9uKCdlbmQnLCAoKSA9PiB0aGlzLnNjZW5lLmxldmVscy5sb3NlTGV2ZWwoKSk7XHJcblxyXG4gICAgdGhpcy53YWxraW5nLnN0b3AoKTtcclxuICAgIHRoaXMuaXNEZWFkID0gdHJ1ZTtcclxuICB9XHJcbiAganVtcCgpIHtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAnanVtcCc7XHJcbiAgICB0aGlzLmlzSnVtcCA9IGZhbHNlO1xyXG4gICAgdGhpcy5tYXAuc2Nyb2xsRG93bigyKTtcclxuICB9XHJcbiAgdG9wKCkge1xyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICd0b3AnO1xyXG4gICAgdGhpcy5tYXAuc2Nyb2xsRG93bigxKTtcclxuICB9XHJcbiAgbGVmdCgpIHtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAnbGVmdCc7XHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt4OiB0aGlzLnh9KS50byh7eDogdGhpcy54LXRoaXMubWFwLmJsb2NrU2l6ZX0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZC8yO1xyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4gdGhpcy5tb3ZpbmcoKSk7XHJcbiAgICBtb3ZlLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIHJpZ2h0KCkge1xyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICdyaWdodCc7XHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt4OiB0aGlzLnh9KS50byh7eDogdGhpcy54K3RoaXMubWFwLmJsb2NrU2l6ZX0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZC8yO1xyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4gdGhpcy5tb3ZpbmcoKSk7XHJcbiAgICBtb3ZlLnN0YXJ0KCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcclxuIiwiLypcclxuVGhpcyB1dGlsIGNsYXNzIGZvciBjb252ZXJ0ZWQgZGF0YSBmcm9tIGZyYWdtZW50cy5qc29uXHJcbm9iamVjdCB0byBzaW1wbGUgbWFwIGFycmF5LCBmb3IgZXhhbXBsZTogWydBJywgJ0EnLCAnQScsICdBJ11cclxuKi9cclxuXHJcbmNsYXNzIERhdGFGcmFnbWVudENvbnZlcnRlciB7XHJcbiAgY29uc3RydWN0b3IoZGF0YSkge1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMuaW5wdXRNYXAgPSBkYXRhLm1hcDtcclxuICAgIHRoaXMuZnJhZ21lbnQgPSBbXTtcclxuXHJcbiAgICAvLyBPUEVSQVRPUlNcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBkYXRhLm1hcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZih+fmRhdGEubWFwW2ldLmluZGV4T2YoJ3wnKSkgdGhpcy5jYXNlT3BlcmF0b3IoZGF0YS5tYXBbaV0sIGkpO1xyXG4gICAgICBlbHNlIHRoaXMuZnJhZ21lbnRbaV0gPSBkYXRhLm1hcFtpXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNRVRIT0RTXHJcbiAgICBkYXRhLnRyaW0gJiYgdGhpcy5yYW5kb21UcmltKGRhdGEudHJpbSk7XHJcbiAgICBkYXRhLmFwcGVuZCAmJiB0aGlzLnJhbmRvbUFwcGVuZChkYXRhLmFwcGVuZCk7XHJcbiAgICBkYXRhLnNodWZmbGUgJiYgdGhpcy5zaHVmZmxlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBPUEVSQVRPUlNcclxuICAvLyBDYXNlIG9wZXJhdG9yOiAnQXxCfEN8RCcgPT4gQyBhbmQgZXRjLi4uXHJcbiAgY2FzZU9wZXJhdG9yKHN0ciwgaSkge1xyXG4gICAgbGV0IGlkcyA9IHN0ci5zcGxpdCgnfCcpO1xyXG4gICAgdGhpcy5mcmFnbWVudFtpXSA9IGlkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqaWRzLmxlbmd0aCldO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyBNRVRIT0RTXHJcbiAgLy8gVHJpbW1pbmcgYXJyYXkgaW4gcmFuZ2UgMC4ucmFuZChtaW4sIGxlbmd0aClcclxuICByYW5kb21UcmltKG1pbikge1xyXG4gICAgdGhpcy5mcmFnbWVudC5sZW5ndGggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodGhpcy5mcmFnbWVudC5sZW5ndGgrMSAtIG1pbikgKyBtaW4pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIC8vIFNodWZmbGUgYXJyYXkgWzEsMiwzXSA9PiBbMiwxLDNdIGFuZCBldGMuLi5cclxuICBzaHVmZmxlKCkge1xyXG4gICAgdGhpcy5mcmFnbWVudC5zb3J0KChhLCBiKSA9PiBNYXRoLnJhbmRvbSgpIDwgLjUgPyAtMSA6IDEpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIC8vIEFkZHMgYSBibG9jayB0byB0aGUgcmFuZG9tIGxvY2F0aW9uIG9mIHRoZSBhcnJheTogW0EsQSxBXSA9PiBbQixBLEFdIGFuZCBldGMuLi5cclxuICByYW5kb21BcHBlbmQoaWQpIHtcclxuICAgIHRoaXMuZnJhZ21lbnRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnRoaXMuZnJhZ21lbnQubGVuZ3RoKV0gPSBpZDtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXRhRnJhZ21lbnRDb252ZXJ0ZXI7XHJcbiJdfQ==
