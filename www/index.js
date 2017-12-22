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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

WebFont.load({
  google: {
    families: ['Amatic SC']
  },
  active() {
    PIXI.loader
      .add('blocks', 'assets/blocks.json')
      .add('player', 'assets/player.png')
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

},{"./game":7,"pixi-projection":1,"pixi-sound":2,"pixi-tween":3}],9:[function(require,module,exports){
class HistoryManager extends PIXI.Container {
  constructor(scene) {
    super();

    this.game = scene.game;
    this.scene = scene;
    scene.addChild(this);

    this.alpha = 0;

    this.bg = new PIXI.Sprite(PIXI.Texture.fromImage('mask'));
    this.bg.width = this.game.w;
    this.bg.height = this.game.h*3/4;
    this.bg.x = 0;
    this.bg.y = 0;
    this.addChild(this.bg);

    this.text = new PIXI.Text('', {
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

},{}],10:[function(require,module,exports){
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

},{"../content/fragments":5,"../content/levels":6}],11:[function(require,module,exports){
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

},{"../content/blocks":4,"../subjects/Block":16,"../utils/DataFragmentConverter":18}],12:[function(require,module,exports){
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

},{"../managers/HistoryManager":9,"../managers/LevelManager":10,"../managers/MapManager":11,"../managers/ScreenManager":13,"../subjects/Player":17}],15:[function(require,module,exports){
module.exports = {
  'playground': require('./Playground')
}

},{"./Playground":14}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9waXhpLXByb2plY3Rpb24vZGlzdC9waXhpLXByb2plY3Rpb24uanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL25vZGVfbW9kdWxlcy9waXhpLXNvdW5kL2Rpc3QvcGl4aS1zb3VuZC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vbm9kZV9tb2R1bGVzL3BpeGktdHdlZW4vYnVpbGQvcGl4aS10d2Vlbi5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2NvbnRlbnQvYmxvY2tzLmpzb24iLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9jb250ZW50L2ZyYWdtZW50cy5qc29uIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvY29udGVudC9sZXZlbHMuanNvbiIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2dhbWUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0hpc3RvcnlNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvTGV2ZWxNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvTWFwTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL1NjZW5lc01hbmFnZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9tYW5hZ2Vycy9TY3JlZW5NYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc2NlbmVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zY2VuZXMvaW5kZXguanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdWJqZWN0cy9CbG9jay5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N1YmplY3RzL1BsYXllci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3V0aWxzL0RhdGFGcmFnbWVudENvbnZlcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgdXRpbHM7XHJcbiAgICAoZnVuY3Rpb24gKHV0aWxzKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlSW5kaWNlc0ZvclF1YWRzKHNpemUpIHtcclxuICAgICAgICAgICAgdmFyIHRvdGFsSW5kaWNlcyA9IHNpemUgKiA2O1xyXG4gICAgICAgICAgICB2YXIgaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheSh0b3RhbEluZGljZXMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IDA7IGkgPCB0b3RhbEluZGljZXM7IGkgKz0gNiwgaiArPSA0KSB7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAwXSA9IGogKyAwO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgMV0gPSBqICsgMTtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDJdID0gaiArIDI7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2kgKyAzXSA9IGogKyAwO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tpICsgNF0gPSBqICsgMjtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbaSArIDVdID0gaiArIDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluZGljZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmNyZWF0ZUluZGljZXNGb3JRdWFkcyA9IGNyZWF0ZUluZGljZXNGb3JRdWFkcztcclxuICAgICAgICBmdW5jdGlvbiBpc1BvdzIodikge1xyXG4gICAgICAgICAgICByZXR1cm4gISh2ICYgKHYgLSAxKSkgJiYgKCEhdik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmlzUG93MiA9IGlzUG93MjtcclxuICAgICAgICBmdW5jdGlvbiBuZXh0UG93Mih2KSB7XHJcbiAgICAgICAgICAgIHYgKz0gKyh2ID09PSAwKTtcclxuICAgICAgICAgICAgLS12O1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDE7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gMjtcclxuICAgICAgICAgICAgdiB8PSB2ID4+PiA0O1xyXG4gICAgICAgICAgICB2IHw9IHYgPj4+IDg7XHJcbiAgICAgICAgICAgIHYgfD0gdiA+Pj4gMTY7XHJcbiAgICAgICAgICAgIHJldHVybiB2ICsgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMubmV4dFBvdzIgPSBuZXh0UG93MjtcclxuICAgICAgICBmdW5jdGlvbiBsb2cyKHYpIHtcclxuICAgICAgICAgICAgdmFyIHIsIHNoaWZ0O1xyXG4gICAgICAgICAgICByID0gKyh2ID4gMHhGRkZGKSA8PCA0O1xyXG4gICAgICAgICAgICB2ID4+Pj0gcjtcclxuICAgICAgICAgICAgc2hpZnQgPSArKHYgPiAweEZGKSA8PCAzO1xyXG4gICAgICAgICAgICB2ID4+Pj0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgfD0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHNoaWZ0ID0gKyh2ID4gMHhGKSA8PCAyO1xyXG4gICAgICAgICAgICB2ID4+Pj0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgfD0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHNoaWZ0ID0gKyh2ID4gMHgzKSA8PCAxO1xyXG4gICAgICAgICAgICB2ID4+Pj0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHIgfD0gc2hpZnQ7XHJcbiAgICAgICAgICAgIHJldHVybiByIHwgKHYgPj4gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHV0aWxzLmxvZzIgPSBsb2cyO1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldEludGVyc2VjdGlvbkZhY3RvcihwMSwgcDIsIHAzLCBwNCwgb3V0KSB7XHJcbiAgICAgICAgICAgIHZhciBBMSA9IHAyLnggLSBwMS54LCBCMSA9IHAzLnggLSBwNC54LCBDMSA9IHAzLnggLSBwMS54O1xyXG4gICAgICAgICAgICB2YXIgQTIgPSBwMi55IC0gcDEueSwgQjIgPSBwMy55IC0gcDQueSwgQzIgPSBwMy55IC0gcDEueTtcclxuICAgICAgICAgICAgdmFyIEQgPSBBMSAqIEIyIC0gQTIgKiBCMTtcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKEQpIDwgMWUtNykge1xyXG4gICAgICAgICAgICAgICAgb3V0LnggPSBBMTtcclxuICAgICAgICAgICAgICAgIG91dC55ID0gQTI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgVCA9IEMxICogQjIgLSBDMiAqIEIxO1xyXG4gICAgICAgICAgICB2YXIgVSA9IEExICogQzIgLSBBMiAqIEMxO1xyXG4gICAgICAgICAgICB2YXIgdCA9IFQgLyBELCB1ID0gVSAvIEQ7XHJcbiAgICAgICAgICAgIGlmICh1IDwgKDFlLTYpIHx8IHUgLSAxID4gLTFlLTYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQueCA9IHAxLnggKyB0ICogKHAyLnggLSBwMS54KTtcclxuICAgICAgICAgICAgb3V0LnkgPSBwMS55ICsgdCAqIChwMi55IC0gcDEueSk7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1dGlscy5nZXRJbnRlcnNlY3Rpb25GYWN0b3IgPSBnZXRJbnRlcnNlY3Rpb25GYWN0b3I7XHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UG9zaXRpb25Gcm9tUXVhZChwLCBhbmNob3IsIG91dCkge1xyXG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGExID0gMS4wIC0gYW5jaG9yLngsIGEyID0gMS4wIC0gYTE7XHJcbiAgICAgICAgICAgIHZhciBiMSA9IDEuMCAtIGFuY2hvci55LCBiMiA9IDEuMCAtIGIxO1xyXG4gICAgICAgICAgICBvdXQueCA9IChwWzBdLnggKiBhMSArIHBbMV0ueCAqIGEyKSAqIGIxICsgKHBbM10ueCAqIGExICsgcFsyXS54ICogYTIpICogYjI7XHJcbiAgICAgICAgICAgIG91dC55ID0gKHBbMF0ueSAqIGExICsgcFsxXS55ICogYTIpICogYjEgKyAocFszXS55ICogYTEgKyBwWzJdLnkgKiBhMikgKiBiMjtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXRpbHMuZ2V0UG9zaXRpb25Gcm9tUXVhZCA9IGdldFBvc2l0aW9uRnJvbVF1YWQ7XHJcbiAgICB9KSh1dGlscyA9IHBpeGlfcHJvamVjdGlvbi51dGlscyB8fCAocGl4aV9wcm9qZWN0aW9uLnV0aWxzID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG5QSVhJLnByb2plY3Rpb24gPSBwaXhpX3Byb2plY3Rpb247XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgUHJvamVjdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvbihsZWdhY3ksIGVuYWJsZSkge1xyXG4gICAgICAgICAgICBpZiAoZW5hYmxlID09PSB2b2lkIDApIHsgZW5hYmxlID0gdHJ1ZTsgfVxyXG4gICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubGVnYWN5ID0gbGVnYWN5O1xyXG4gICAgICAgICAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubGVnYWN5LnByb2ogPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvbi5wcm90b3R5cGUsIFwiZW5hYmxlZFwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb247XHJcbiAgICB9KCkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24gPSBQcm9qZWN0aW9uO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgd2ViZ2w7XHJcbiAgICAoZnVuY3Rpb24gKHdlYmdsKSB7XHJcbiAgICAgICAgdmFyIEJhdGNoQnVmZmVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gQmF0Y2hCdWZmZXIoc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG5ldyBBcnJheUJ1ZmZlcihzaXplKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXQzMlZpZXcgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMudmVydGljZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51aW50MzJWaWV3ID0gbmV3IFVpbnQzMkFycmF5KHRoaXMudmVydGljZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEJhdGNoQnVmZmVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG51bGw7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBCYXRjaEJ1ZmZlcjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIHdlYmdsLkJhdGNoQnVmZmVyID0gQmF0Y2hCdWZmZXI7XHJcbiAgICB9KSh3ZWJnbCA9IHBpeGlfcHJvamVjdGlvbi53ZWJnbCB8fCAocGl4aV9wcm9qZWN0aW9uLndlYmdsID0ge30pKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHdlYmdsO1xyXG4gICAgKGZ1bmN0aW9uICh3ZWJnbCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyKHZlcnRleFNyYywgZnJhZ21lbnRTcmMsIGdsLCBtYXhUZXh0dXJlcykge1xyXG4gICAgICAgICAgICBmcmFnbWVudFNyYyA9IGZyYWdtZW50U3JjLnJlcGxhY2UoLyVjb3VudCUvZ2ksIG1heFRleHR1cmVzICsgJycpO1xyXG4gICAgICAgICAgICBmcmFnbWVudFNyYyA9IGZyYWdtZW50U3JjLnJlcGxhY2UoLyVmb3Jsb29wJS9naSwgZ2VuZXJhdGVTYW1wbGVTcmMobWF4VGV4dHVyZXMpKTtcclxuICAgICAgICAgICAgdmFyIHNoYWRlciA9IG5ldyBQSVhJLlNoYWRlcihnbCwgdmVydGV4U3JjLCBmcmFnbWVudFNyYyk7XHJcbiAgICAgICAgICAgIHZhciBzYW1wbGVWYWx1ZXMgPSBuZXcgSW50MzJBcnJheShtYXhUZXh0dXJlcyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4VGV4dHVyZXM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgc2FtcGxlVmFsdWVzW2ldID0gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzaGFkZXIuYmluZCgpO1xyXG4gICAgICAgICAgICBzaGFkZXIudW5pZm9ybXMudVNhbXBsZXJzID0gc2FtcGxlVmFsdWVzO1xyXG4gICAgICAgICAgICByZXR1cm4gc2hhZGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3ZWJnbC5nZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlciA9IGdlbmVyYXRlTXVsdGlUZXh0dXJlU2hhZGVyO1xyXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2FtcGxlU3JjKG1heFRleHR1cmVzKSB7XHJcbiAgICAgICAgICAgIHZhciBzcmMgPSAnJztcclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICBzcmMgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4VGV4dHVyZXM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjICs9ICdcXG5lbHNlICc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IG1heFRleHR1cmVzIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYyArPSBcImlmKHRleHR1cmVJZCA9PSBcIiArIGkgKyBcIi4wKVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3JjICs9ICdcXG57JztcclxuICAgICAgICAgICAgICAgIHNyYyArPSBcIlxcblxcdGNvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyc1tcIiArIGkgKyBcIl0sIHRleHR1cmVDb29yZCk7XCI7XHJcbiAgICAgICAgICAgICAgICBzcmMgKz0gJ1xcbn0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNyYyArPSAnXFxuJztcclxuICAgICAgICAgICAgc3JjICs9ICdcXG4nO1xyXG4gICAgICAgICAgICByZXR1cm4gc3JjO1xyXG4gICAgICAgIH1cclxuICAgIH0pKHdlYmdsID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsIHx8IChwaXhpX3Byb2plY3Rpb24ud2ViZ2wgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHdlYmdsO1xyXG4gICAgKGZ1bmN0aW9uICh3ZWJnbCkge1xyXG4gICAgICAgIHZhciBPYmplY3RSZW5kZXJlciA9IFBJWEkuT2JqZWN0UmVuZGVyZXI7XHJcbiAgICAgICAgdmFyIHNldHRpbmdzID0gUElYSS5zZXR0aW5ncztcclxuICAgICAgICB2YXIgR0xCdWZmZXIgPSBQSVhJLmdsQ29yZS5HTEJ1ZmZlcjtcclxuICAgICAgICB2YXIgcHJlbXVsdGlwbHlUaW50ID0gUElYSS51dGlscy5wcmVtdWx0aXBseVRpbnQ7XHJcbiAgICAgICAgdmFyIHByZW11bHRpcGx5QmxlbmRNb2RlID0gUElYSS51dGlscy5wcmVtdWx0aXBseUJsZW5kTW9kZTtcclxuICAgICAgICB2YXIgVElDSyA9IDA7XHJcbiAgICAgICAgdmFyIEJhdGNoR3JvdXAgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBCYXRjaEdyb3VwKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxlbmQgPSBQSVhJLkJMRU5EX01PREVTLk5PUk1BTDtcclxuICAgICAgICAgICAgICAgIHRoaXMudW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCYXRjaEdyb3VwO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgd2ViZ2wuQmF0Y2hHcm91cCA9IEJhdGNoR3JvdXA7XHJcbiAgICAgICAgdmFyIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcihyZW5kZXJlcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgcmVuZGVyZXIpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zaGFkZXJWZXJ0ID0gJyc7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gJyc7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5NQVhfVEVYVFVSRVNfTE9DQUwgPSAzMjtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRTaXplID0gNTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlcnRCeXRlU2l6ZSA9IF90aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNpemUgPSBzZXR0aW5ncy5TUFJJVEVfQkFUQ0hfU0laRTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zcHJpdGVzID0gW107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZXJ0ZXhCdWZmZXJzID0gW107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YW9zID0gW107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YW9NYXggPSAyO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuTUFYX1RFWFRVUkVTID0gMTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmluZGljZXMgPSBwaXhpX3Byb2plY3Rpb24udXRpbHMuY3JlYXRlSW5kaWNlc0ZvclF1YWRzKF90aGlzLnNpemUpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZ3JvdXBzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IF90aGlzLnNpemU7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmdyb3Vwc1trXSA9IG5ldyBCYXRjaEdyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52YW9NYXggPSAyO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucmVuZGVyZXIub24oJ3ByZXJlbmRlcicsIF90aGlzLm9uUHJlcmVuZGVyLCBfdGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLmdldFVuaWZvcm1zID0gZnVuY3Rpb24gKHNwcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5zeW5jVW5pZm9ybXMgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9iailcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB2YXIgc2ggPSB0aGlzLnNoYWRlcjtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBzaC51bmlmb3Jtc1trZXldID0gb2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5vbkNvbnRleHRDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NQVhfVEVYVFVSRVMgPSBNYXRoLm1pbih0aGlzLk1BWF9URVhUVVJFU19MT0NBTCwgdGhpcy5yZW5kZXJlci5wbHVnaW5zWydzcHJpdGUnXS5NQVhfVEVYVFVSRVMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGFkZXIgPSB3ZWJnbC5nZW5lcmF0ZU11bHRpVGV4dHVyZVNoYWRlcih0aGlzLnNoYWRlclZlcnQsIHRoaXMuc2hhZGVyRnJhZywgZ2wsIHRoaXMuTUFYX1RFWFRVUkVTKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBHTEJ1ZmZlci5jcmVhdGVJbmRleEJ1ZmZlcihnbCwgdGhpcy5pbmRpY2VzLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmJpbmRWYW8obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZhb01heDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZlcnRleEJ1ZmZlciA9IHRoaXMudmVydGV4QnVmZmVyc1tpXSA9IEdMQnVmZmVyLmNyZWF0ZVZlcnRleEJ1ZmZlcihnbCwgbnVsbCwgZ2wuU1RSRUFNX0RSQVcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFvc1tpXSA9IHRoaXMuY3JlYXRlVmFvKHZlcnRleEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYnVmZmVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVycyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IHBpeGlfcHJvamVjdGlvbi51dGlscy5uZXh0UG93Mih0aGlzLnNpemUpOyBpICo9IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJzLnB1c2gobmV3IHdlYmdsLkJhdGNoQnVmZmVyKGkgKiA0ICogdGhpcy52ZXJ0Qnl0ZVNpemUpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbyA9IHRoaXMudmFvc1swXTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIucHJvdG90eXBlLm9uUHJlcmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5kZXggPj0gdGhpcy5zaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbHVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFzcHJpdGUuX3RleHR1cmUuX3V2cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghc3ByaXRlLl90ZXh0dXJlLmJhc2VUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVzW3RoaXMuY3VycmVudEluZGV4KytdID0gc3ByaXRlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuZmx1c2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICAgICAgdmFyIE1BWF9URVhUVVJFUyA9IHRoaXMuTUFYX1RFWFRVUkVTO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5wMiA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5uZXh0UG93Mih0aGlzLmN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9nMiA9IHBpeGlfcHJvamVjdGlvbi51dGlscy5sb2cyKG5wMik7XHJcbiAgICAgICAgICAgICAgICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXJzW2xvZzJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwcml0ZXMgPSB0aGlzLnNwcml0ZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBzID0gdGhpcy5ncm91cHM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmxvYXQzMlZpZXcgPSBidWZmZXIuZmxvYXQzMlZpZXc7XHJcbiAgICAgICAgICAgICAgICB2YXIgdWludDMyVmlldyA9IGJ1ZmZlci51aW50MzJWaWV3O1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwQ291bnQgPSAxO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHR1cmVDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudEdyb3VwID0gZ3JvdXBzWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZlcnRleERhdGE7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXZzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJsZW5kTW9kZSA9IHByZW11bHRpcGx5QmxlbmRNb2RlW3Nwcml0ZXNbMF0uX3RleHR1cmUuYmFzZVRleHR1cmUucHJlbXVsdGlwbGllZEFscGhhID8gMSA6IDBdW3Nwcml0ZXNbMF0uYmxlbmRNb2RlXTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC50ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnN0YXJ0ID0gMDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5ibGVuZCA9IGJsZW5kTW9kZTtcclxuICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY3VycmVudEluZGV4OyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3ByaXRlID0gc3ByaXRlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0VGV4dHVyZSA9IHNwcml0ZS5fdGV4dHVyZS5iYXNlVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3ByaXRlQmxlbmRNb2RlID0gcHJlbXVsdGlwbHlCbGVuZE1vZGVbTnVtYmVyKG5leHRUZXh0dXJlLnByZW11bHRpcGxpZWRBbHBoYSldW3Nwcml0ZS5ibGVuZE1vZGVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibGVuZE1vZGUgIT09IHNwcml0ZUJsZW5kTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibGVuZE1vZGUgPSBzcHJpdGVCbGVuZE1vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUNvdW50ID0gTUFYX1RFWFRVUkVTO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUSUNLKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB1bmlmb3JtcyA9IHRoaXMuZ2V0VW5pZm9ybXMoc3ByaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFVuaWZvcm1zICE9PSB1bmlmb3Jtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VW5pZm9ybXMgPSB1bmlmb3JtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQgPSBNQVhfVEVYVFVSRVM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUZXh0dXJlICE9PSBuZXh0VGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGV4dHVyZSA9IG5leHRUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFRleHR1cmUuX2VuYWJsZWQgIT09IFRJQ0spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0dXJlQ291bnQgPT09IE1BWF9URVhUVVJFUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRJQ0srKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zaXplID0gaSAtIGN1cnJlbnRHcm91cC5zdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAgPSBncm91cHNbZ3JvdXBDb3VudCsrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudGV4dHVyZUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAuYmxlbmQgPSBibGVuZE1vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEdyb3VwLnN0YXJ0ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50R3JvdXAudW5pZm9ybXMgPSBjdXJyZW50VW5pZm9ybXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGV4dHVyZS5fZW5hYmxlZCA9IFRJQ0s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGV4dHVyZS5fdmlydGFsQm91bmRJZCA9IHRleHR1cmVDb3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC50ZXh0dXJlc1tjdXJyZW50R3JvdXAudGV4dHVyZUNvdW50KytdID0gbmV4dFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxwaGEgPSBNYXRoLm1pbihzcHJpdGUud29ybGRBbHBoYSwgMS4wKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJnYiA9IGFscGhhIDwgMS4wICYmIG5leHRUZXh0dXJlLnByZW11bHRpcGxpZWRBbHBoYSA/IHByZW11bHRpcGx5VGludChzcHJpdGUuX3RpbnRSR0IsIGFscGhhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHNwcml0ZS5fdGludFJHQiArIChhbHBoYSAqIDI1NSA8PCAyNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxsVmVydGljZXMoZmxvYXQzMlZpZXcsIHVpbnQzMlZpZXcsIGluZGV4LCBzcHJpdGUsIGFyZ2IsIG5leHRUZXh0dXJlLl92aXJ0YWxCb3VuZElkKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCArPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5zaXplID0gaSAtIGN1cnJlbnRHcm91cC5zdGFydDtcclxuICAgICAgICAgICAgICAgIGlmICghc2V0dGluZ3MuQ0FOX1VQTE9BRF9TQU1FX0JVRkZFUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhb01heCA8PSB0aGlzLnZlcnRleENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFvTWF4Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhCdWZmZXIgPSB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0gPSBHTEJ1ZmZlci5jcmVhdGVWZXJ0ZXhCdWZmZXIoZ2wsIG51bGwsIGdsLlNUUkVBTV9EUkFXKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YW9zW3RoaXMudmVydGV4Q291bnRdID0gdGhpcy5jcmVhdGVWYW8odmVydGV4QnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVmFvKHRoaXMudmFvc1t0aGlzLnZlcnRleENvdW50XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW3RoaXMudmVydGV4Q291bnRdLnVwbG9hZChidWZmZXIudmVydGljZXMsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbdGhpcy52ZXJ0ZXhDb3VudF0udXBsb2FkKGJ1ZmZlci52ZXJ0aWNlcywgMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50VW5pZm9ybXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGdyb3VwQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBncm91cCA9IGdyb3Vwc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBUZXh0dXJlQ291bnQgPSBncm91cC50ZXh0dXJlQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwLnVuaWZvcm1zICE9PSBjdXJyZW50VW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jVW5pZm9ybXMoZ3JvdXAudW5pZm9ybXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGdyb3VwVGV4dHVyZUNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5iaW5kVGV4dHVyZShncm91cC50ZXh0dXJlc1tqXSwgaiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwLnRleHR1cmVzW2pdLl92aXJ0YWxCb3VuZElkID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gdGhpcy5zaGFkZXIudW5pZm9ybXMuc2FtcGxlclNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2WzBdID0gZ3JvdXAudGV4dHVyZXNbal0ucmVhbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdlsxXSA9IGdyb3VwLnRleHR1cmVzW2pdLnJlYWxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYWRlci51bmlmb3Jtcy5zYW1wbGVyU2l6ZSA9IHY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zdGF0ZS5zZXRCbGVuZE1vZGUoZ3JvdXAuYmxlbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmRyYXdFbGVtZW50cyhnbC5UUklBTkdMRVMsIGdyb3VwLnNpemUgKiA2LCBnbC5VTlNJR05FRF9TSE9SVCwgZ3JvdXAuc3RhcnQgKiA2ICogMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFNoYWRlcih0aGlzLnNoYWRlcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuQ0FOX1VQTE9BRF9TQU1FX0JVRkZFUikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYmluZFZhbyh0aGlzLnZhb3NbdGhpcy52ZXJ0ZXhDb3VudF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1t0aGlzLnZlcnRleENvdW50XS5iaW5kKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbHVzaCgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52YW9NYXg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRleEJ1ZmZlcnNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFvc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhb3NbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleEJ1ZmZlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLm9mZigncHJlcmVuZGVyJywgdGhpcy5vblByZXJlbmRlciwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNoYWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYWRlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YW9zID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2VzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnVmZmVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgICAgICB9KE9iamVjdFJlbmRlcmVyKSk7XHJcbiAgICAgICAgd2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBNdWx0aVRleHR1cmVTcHJpdGVSZW5kZXJlcjtcclxuICAgIH0pKHdlYmdsID0gcGl4aV9wcm9qZWN0aW9uLndlYmdsIHx8IChwaXhpX3Byb2plY3Rpb24ud2ViZ2wgPSB7fSkpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgcCA9IFtuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpLCBuZXcgUElYSS5Qb2ludCgpXTtcclxuICAgIHZhciBhID0gWzAsIDAsIDAsIDBdO1xyXG4gICAgdmFyIFN1cmZhY2UgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIFN1cmZhY2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VyZmFjZUlEID0gXCJkZWZhdWx0XCI7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUlEID0gMDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhTcmMgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmZyYWdtZW50U3JjID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgU3VyZmFjZS5wcm90b3R5cGUuZmlsbFVuaWZvcm1zID0gZnVuY3Rpb24gKHVuaWZvcm1zKSB7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN1cmZhY2UucHJvdG90eXBlLmJvdW5kc1F1YWQgPSBmdW5jdGlvbiAodiwgb3V0LCBhZnRlcikge1xyXG4gICAgICAgICAgICB2YXIgbWluWCA9IG91dFswXSwgbWluWSA9IG91dFsxXTtcclxuICAgICAgICAgICAgdmFyIG1heFggPSBvdXRbMF0sIG1heFkgPSBvdXRbMV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwgODsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWluWCA+IG91dFtpXSlcclxuICAgICAgICAgICAgICAgICAgICBtaW5YID0gb3V0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1heFggPCBvdXRbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4WCA9IG91dFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChtaW5ZID4gb3V0W2kgKyAxXSlcclxuICAgICAgICAgICAgICAgICAgICBtaW5ZID0gb3V0W2kgKyAxXTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXhZIDwgb3V0W2kgKyAxXSlcclxuICAgICAgICAgICAgICAgICAgICBtYXhZID0gb3V0W2kgKyAxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwWzBdLnNldChtaW5YLCBtaW5ZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzBdLCBwWzBdKTtcclxuICAgICAgICAgICAgcFsxXS5zZXQobWF4WCwgbWluWSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHkocFsxXSwgcFsxXSk7XHJcbiAgICAgICAgICAgIHBbMl0uc2V0KG1heFgsIG1heFkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5KHBbMl0sIHBbMl0pO1xyXG4gICAgICAgICAgICBwWzNdLnNldChtaW5YLCBtYXhZKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBseShwWzNdLCBwWzNdKTtcclxuICAgICAgICAgICAgaWYgKGFmdGVyKSB7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzBdLCBwWzBdKTtcclxuICAgICAgICAgICAgICAgIGFmdGVyLmFwcGx5KHBbMV0sIHBbMV0pO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXBwbHkocFsyXSwgcFsyXSk7XHJcbiAgICAgICAgICAgICAgICBhZnRlci5hcHBseShwWzNdLCBwWzNdKTtcclxuICAgICAgICAgICAgICAgIG91dFswXSA9IHBbMF0ueDtcclxuICAgICAgICAgICAgICAgIG91dFsxXSA9IHBbMF0ueTtcclxuICAgICAgICAgICAgICAgIG91dFsyXSA9IHBbMV0ueDtcclxuICAgICAgICAgICAgICAgIG91dFszXSA9IHBbMV0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs0XSA9IHBbMl0ueDtcclxuICAgICAgICAgICAgICAgIG91dFs1XSA9IHBbMl0ueTtcclxuICAgICAgICAgICAgICAgIG91dFs2XSA9IHBbM10ueDtcclxuICAgICAgICAgICAgICAgIG91dFs3XSA9IHBbM10ueTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwW2ldLnkgPCBwWzBdLnkgfHwgcFtpXS55ID09IHBbMF0ueSAmJiBwW2ldLnggPCBwWzBdLngpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwWzBdID0gcFtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcFtpXSA9IHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYVtpXSA9IE1hdGguYXRhbjIocFtpXS55IC0gcFswXS55LCBwW2ldLnggLSBwWzBdLngpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IGkgKyAxOyBqIDw9IDM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYVtpXSA+IGFbal0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ID0gcFtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBbaV0gPSBwW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFtqXSA9IHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdDIgPSBhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYVtpXSA9IGFbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhW2pdID0gdDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvdXRbMF0gPSBwWzBdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbMV0gPSBwWzBdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMl0gPSBwWzFdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbM10gPSBwWzFdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNF0gPSBwWzJdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbNV0gPSBwWzJdLnk7XHJcbiAgICAgICAgICAgICAgICBvdXRbNl0gPSBwWzNdLng7XHJcbiAgICAgICAgICAgICAgICBvdXRbN10gPSBwWzNdLnk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHBbM10ueCAtIHBbMl0ueCkgKiAocFsxXS55IC0gcFsyXS55KSAtIChwWzFdLnggLSBwWzJdLngpICogKHBbM10ueSAtIHBbMl0ueSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0WzRdID0gcFszXS54O1xyXG4gICAgICAgICAgICAgICAgICAgIG91dFs1XSA9IHBbM10ueTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTdXJmYWNlO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TdXJmYWNlID0gU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgIHZhciB0ZW1wUmVjdCA9IG5ldyBQSVhJLlJlY3RhbmdsZSgpO1xyXG4gICAgdmFyIHRlbXBQb2ludCA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICB2YXIgQmlsaW5lYXJTdXJmYWNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQmlsaW5lYXJTdXJmYWNlLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIEJpbGluZWFyU3VyZmFjZSgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuZGlzdG9ydGlvbiA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXN0b3J0aW9uLnNldCgwLCAwKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBkID0gdGhpcy5kaXN0b3J0aW9uO1xyXG4gICAgICAgICAgICB2YXIgbSA9IHBvcy54ICogcG9zLnk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy54ID0gcG9zLnggKyBkLnggKiBtO1xyXG4gICAgICAgICAgICBuZXdQb3MueSA9IHBvcy55ICsgZC55ICogbTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIEJpbGluZWFyU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgICAgICAgICB2YXIgdnggPSBwb3MueCwgdnkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGR4ID0gdGhpcy5kaXN0b3J0aW9uLngsIGR5ID0gdGhpcy5kaXN0b3J0aW9uLnk7XHJcbiAgICAgICAgICAgIGlmIChkeCA9PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdng7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueSA9IHZ5IC8gKDEuMCArIGR5ICogdngpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGR5ID09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB2eTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdnggLyAoMS4wICsgZHggKiB2eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYiA9ICh2eSAqIGR4IC0gdnggKiBkeSArIDEuMCkgKiAwLjUgLyBkeTtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gYiAqIGIgKyB2eCAvIGR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKGQgPD0gMC4wMDAwMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Bvcy5zZXQoTmFOLCBOYU4pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChkeSA+IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gLWIgKyBNYXRoLnNxcnQoZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdQb3MueCA9IC1iIC0gTWF0aC5zcXJ0KGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSAodnggLyBuZXdQb3MueCAtIDEuMCkgLyBkeDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5tYXBTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC54ID0gLXNwcml0ZS5hbmNob3IueCAqIHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gLXNwcml0ZS5hbmNob3IueSAqIHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdGVtcFJlY3Qud2lkdGggPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBRdWFkKHRlbXBSZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0gfHwgc3ByaXRlLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBCaWxpbmVhclN1cmZhY2UucHJvdG90eXBlLm1hcFF1YWQgPSBmdW5jdGlvbiAocmVjdCwgcXVhZCwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciBheCA9IC1yZWN0LnggLyByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgYXkgPSAtcmVjdC55IC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheDIgPSAoMS4wIC0gcmVjdC54KSAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheTIgPSAoMS4wIC0gcmVjdC55KSAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgdXAxeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsxXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAxeSA9IChxdWFkWzBdLnkgKiAoMS4wIC0gYXgpICsgcXVhZFsxXS55ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgdXAyeCA9IChxdWFkWzBdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMV0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciB1cDJ5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheDIpICsgcXVhZFsxXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIGRvd24xeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgpICsgcXVhZFsyXS54ICogYXgpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnggPSAocXVhZFszXS54ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnggKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjJ5ID0gKHF1YWRbM10ueSAqICgxLjAgLSBheDIpICsgcXVhZFsyXS55ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHgwMCA9IHVwMXggKiAoMS4wIC0gYXkpICsgZG93bjF4ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB5MDAgPSB1cDF5ICogKDEuMCAtIGF5KSArIGRvd24xeSAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeDEwID0gdXAyeCAqICgxLjAgLSBheSkgKyBkb3duMnggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkxMCA9IHVwMnkgKiAoMS4wIC0gYXkpICsgZG93bjJ5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MDEgPSB1cDF4ICogKDEuMCAtIGF5MikgKyBkb3duMXggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MDEgPSB1cDF5ICogKDEuMCAtIGF5MikgKyBkb3duMXkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB4MTEgPSB1cDJ4ICogKDEuMCAtIGF5MikgKyBkb3duMnggKiBheTI7XHJcbiAgICAgICAgICAgIHZhciB5MTEgPSB1cDJ5ICogKDEuMCAtIGF5MikgKyBkb3duMnkgKiBheTI7XHJcbiAgICAgICAgICAgIHZhciBtYXQgPSB0ZW1wTWF0O1xyXG4gICAgICAgICAgICBtYXQudHggPSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC50eSA9IHkwMDtcclxuICAgICAgICAgICAgbWF0LmEgPSB4MTAgLSB4MDA7XHJcbiAgICAgICAgICAgIG1hdC5iID0geTEwIC0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYyA9IHgwMSAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmQgPSB5MDEgLSB5MDA7XHJcbiAgICAgICAgICAgIHRlbXBQb2ludC5zZXQoeDExLCB5MTEpO1xyXG4gICAgICAgICAgICBtYXQuYXBwbHlJbnZlcnNlKHRlbXBQb2ludCwgdGVtcFBvaW50KTtcclxuICAgICAgICAgICAgdGhpcy5kaXN0b3J0aW9uLnNldCh0ZW1wUG9pbnQueCAtIDEsIHRlbXBQb2ludC55IC0gMSk7XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5zZXRGcm9tTWF0cml4KG1hdCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQmlsaW5lYXJTdXJmYWNlLnByb3RvdHlwZS5maWxsVW5pZm9ybXMgPSBmdW5jdGlvbiAodW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvbiA9IHVuaWZvcm1zLmRpc3RvcnRpb24gfHwgbmV3IEZsb2F0MzJBcnJheShbMCwgMCwgMCwgMF0pO1xyXG4gICAgICAgICAgICB2YXIgYXggPSBNYXRoLmFicyh0aGlzLmRpc3RvcnRpb24ueCk7XHJcbiAgICAgICAgICAgIHZhciBheSA9IE1hdGguYWJzKHRoaXMuZGlzdG9ydGlvbi55KTtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblswXSA9IGF4ICogMTAwMDAgPD0gYXkgPyAwIDogdGhpcy5kaXN0b3J0aW9uLng7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLmRpc3RvcnRpb25bMV0gPSBheSAqIDEwMDAwIDw9IGF4ID8gMCA6IHRoaXMuZGlzdG9ydGlvbi55O1xyXG4gICAgICAgICAgICB1bmlmb3Jtcy5kaXN0b3J0aW9uWzJdID0gMS4wIC8gdW5pZm9ybXMuZGlzdG9ydGlvblswXTtcclxuICAgICAgICAgICAgdW5pZm9ybXMuZGlzdG9ydGlvblszXSA9IDEuMCAvIHVuaWZvcm1zLmRpc3RvcnRpb25bMV07XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gQmlsaW5lYXJTdXJmYWNlO1xyXG4gICAgfShwaXhpX3Byb2plY3Rpb24uU3VyZmFjZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLkJpbGluZWFyU3VyZmFjZSA9IEJpbGluZWFyU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIENvbnRhaW5lcjJzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoQ29udGFpbmVyMnMsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gQ29udGFpbmVyMnMoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbnRhaW5lcjJzLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIENvbnRhaW5lcjJzO1xyXG4gICAgfShQSVhJLkNvbnRhaW5lcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLkNvbnRhaW5lcjJzID0gQ29udGFpbmVyMnM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBmdW4gPSBQSVhJLlRyYW5zZm9ybVN0YXRpYy5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtO1xyXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtSGFjayhwYXJlbnRUcmFuc2Zvcm0pIHtcclxuICAgICAgICB2YXIgcHJvaiA9IHRoaXMucHJvajtcclxuICAgICAgICB2YXIgcHAgPSBwYXJlbnRUcmFuc2Zvcm0ucHJvajtcclxuICAgICAgICB2YXIgdGEgPSB0aGlzO1xyXG4gICAgICAgIGlmICghcHApIHtcclxuICAgICAgICAgICAgZnVuLmNhbGwodGhpcywgcGFyZW50VHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgcHJvai5fYWN0aXZlUHJvamVjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBwLl9zdXJmYWNlKSB7XHJcbiAgICAgICAgICAgIHByb2ouX2FjdGl2ZVByb2plY3Rpb24gPSBwcDtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMb2NhbFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2FsVHJhbnNmb3JtLmNvcHkodGhpcy53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIGlmICh0YS5fcGFyZW50SUQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICArK3RhLl93b3JsZElEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuLmNhbGwodGhpcywgcGFyZW50VHJhbnNmb3JtKTtcclxuICAgICAgICBwcm9qLl9hY3RpdmVQcm9qZWN0aW9uID0gcHAuX2FjdGl2ZVByb2plY3Rpb247XHJcbiAgICB9XHJcbiAgICB2YXIgUHJvamVjdGlvblN1cmZhY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhQcm9qZWN0aW9uU3VyZmFjZSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uU3VyZmFjZShsZWdhY3ksIGVuYWJsZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBsZWdhY3ksIGVuYWJsZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuX3N1cmZhY2UgPSBudWxsO1xyXG4gICAgICAgICAgICBfdGhpcy5fYWN0aXZlUHJvamVjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50U3VyZmFjZUlEID0gLTE7XHJcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50TGVnYWN5SUQgPSAtMTtcclxuICAgICAgICAgICAgX3RoaXMuX2xhc3RVbmlmb3JtcyA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZSwgXCJlbmFibGVkXCIsIHtcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5LnVwZGF0ZVRyYW5zZm9ybSA9IHRyYW5zZm9ybUhhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kuX3BhcmVudElEID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSBQSVhJLlRyYW5zZm9ybVN0YXRpYy5wcm90b3R5cGUudXBkYXRlVHJhbnNmb3JtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLCBcInN1cmZhY2VcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdXJmYWNlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXJmYWNlID0gdmFsdWUgfHwgbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlQYXJ0aWFsID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3VyZmFjZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VyZmFjZS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5KHBvcywgbmV3UG9zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zID0gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5zdXJmYWNlLmFwcGx5KG5ld1BvcywgbmV3UG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMuc3VyZmFjZS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWdhY3kud29ybGRUcmFuc2Zvcm0uYXBwbHkobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlJbnZlcnNlID0gZnVuY3Rpb24gKHBvcywgbmV3UG9zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVQcm9qZWN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MgPSB0aGlzLl9hY3RpdmVQcm9qZWN0aW9uLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlUHJvamVjdGlvbi5fc3VyZmFjZS5hcHBseUludmVyc2UobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShuZXdQb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1cmZhY2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvcyA9IHRoaXMubGVnYWN5LndvcmxkVHJhbnNmb3JtLmFwcGx5SW52ZXJzZShwb3MsIG5ld1Bvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3VyZmFjZS5hcHBseUludmVyc2UobmV3UG9zLCBuZXdQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9zLCBuZXdQb3MpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvblN1cmZhY2UucHJvdG90eXBlLm1hcEJpbGluZWFyU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCkge1xyXG4gICAgICAgICAgICBpZiAoISh0aGlzLl9zdXJmYWNlIGluc3RhbmNlb2YgcGl4aV9wcm9qZWN0aW9uLkJpbGluZWFyU3VyZmFjZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VyZmFjZSA9IG5ldyBwaXhpX3Byb2plY3Rpb24uQmlsaW5lYXJTdXJmYWNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zdXJmYWNlLm1hcFNwcml0ZShzcHJpdGUsIHF1YWQsIHRoaXMubGVnYWN5KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb25TdXJmYWNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VyZmFjZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJmYWNlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0aW9uU3VyZmFjZS5wcm90b3R5cGUsIFwidW5pZm9ybXNcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50TGVnYWN5SUQgPT09IHRoaXMubGVnYWN5Ll93b3JsZElEICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFN1cmZhY2VJRCA9PT0gdGhpcy5zdXJmYWNlLl91cGRhdGVJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYXN0VW5pZm9ybXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VW5pZm9ybXMgPSB0aGlzLl9sYXN0VW5pZm9ybXMgfHwge307XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VW5pZm9ybXMud29ybGRUcmFuc2Zvcm0gPSB0aGlzLmxlZ2FjeS53b3JsZFRyYW5zZm9ybS50b0FycmF5KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3VyZmFjZS5maWxsVW5pZm9ybXModGhpcy5fbGFzdFVuaWZvcm1zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYXN0VW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uU3VyZmFjZTtcclxuICAgIH0ocGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24pKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZSA9IFByb2plY3Rpb25TdXJmYWNlO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB2YXIgU3ByaXRlQmlsaW5lYXJSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZUJpbGluZWFyUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlQmlsaW5lYXJSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnNpemUgPSAxMDA7XHJcbiAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFU19MT0NBTCA9IDE7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMTtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMyO1xcbmF0dHJpYnV0ZSB2ZWM0IGFGcmFtZTtcXG5hdHRyaWJ1dGUgdmVjNCBhQ29sb3I7XFxuYXR0cmlidXRlIGZsb2F0IGFUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHdvcmxkVHJhbnNmb3JtO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogd29ybGRUcmFuc2Zvcm0gKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG4gICAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVmVydGV4UG9zaXRpb247XFxuICAgIHZUcmFuczEgPSBhVHJhbnMxO1xcbiAgICB2VHJhbnMyID0gYVRyYW5zMjtcXG4gICAgdlRleHR1cmVJZCA9IGFUZXh0dXJlSWQ7XFxuICAgIHZDb2xvciA9IGFDb2xvcjtcXG4gICAgdkZyYW1lID0gYUZyYW1lO1xcbn1cXG5cIjtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXJzWyVjb3VudCVdO1xcbnVuaWZvcm0gdmVjMiBzYW1wbGVyU2l6ZVslY291bnQlXTsgXFxudW5pZm9ybSB2ZWM0IGRpc3RvcnRpb247XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbnZlYzIgc3VyZmFjZTtcXG52ZWMyIHN1cmZhY2UyO1xcblxcbmZsb2F0IHZ4ID0gdlRleHR1cmVDb29yZC54O1xcbmZsb2F0IHZ5ID0gdlRleHR1cmVDb29yZC55O1xcbmZsb2F0IGR4ID0gZGlzdG9ydGlvbi54O1xcbmZsb2F0IGR5ID0gZGlzdG9ydGlvbi55O1xcbmZsb2F0IHJldnggPSBkaXN0b3J0aW9uLno7XFxuZmxvYXQgcmV2eSA9IGRpc3RvcnRpb24udztcXG5cXG5pZiAoZGlzdG9ydGlvbi54ID09IDAuMCkge1xcbiAgICBzdXJmYWNlLnggPSB2eDtcXG4gICAgc3VyZmFjZS55ID0gdnkgLyAoMS4wICsgZHkgKiB2eCk7XFxuICAgIHN1cmZhY2UyID0gc3VyZmFjZTtcXG59IGVsc2VcXG5pZiAoZGlzdG9ydGlvbi55ID09IDAuMCkge1xcbiAgICBzdXJmYWNlLnkgPSB2eTtcXG4gICAgc3VyZmFjZS54ID0gdngvICgxLjAgKyBkeCAqIHZ5KTtcXG4gICAgc3VyZmFjZTIgPSBzdXJmYWNlO1xcbn0gZWxzZSB7XFxuICAgIGZsb2F0IGMgPSB2eSAqIGR4IC0gdnggKiBkeTtcXG4gICAgZmxvYXQgYiA9IChjICsgMS4wKSAqIDAuNTtcXG4gICAgZmxvYXQgYjIgPSAoLWMgKyAxLjApICogMC41O1xcbiAgICBmbG9hdCBkID0gYiAqIGIgKyB2eCAqIGR5O1xcbiAgICBpZiAoZCA8IC0wLjAwMDAxKSB7XFxuICAgICAgICBkaXNjYXJkO1xcbiAgICB9XFxuICAgIGQgPSBzcXJ0KG1heChkLCAwLjApKTtcXG4gICAgc3VyZmFjZS54ID0gKC0gYiArIGQpICogcmV2eTtcXG4gICAgc3VyZmFjZTIueCA9ICgtIGIgLSBkKSAqIHJldnk7XFxuICAgIHN1cmZhY2UueSA9ICgtIGIyICsgZCkgKiByZXZ4O1xcbiAgICBzdXJmYWNlMi55ID0gKC0gYjIgLSBkKSAqIHJldng7XFxufVxcblxcbnZlYzIgdXY7XFxudXYueCA9IHZUcmFuczEueCAqIHN1cmZhY2UueCArIHZUcmFuczEueSAqIHN1cmZhY2UueSArIHZUcmFuczEuejtcXG51di55ID0gdlRyYW5zMi54ICogc3VyZmFjZS54ICsgdlRyYW5zMi55ICogc3VyZmFjZS55ICsgdlRyYW5zMi56O1xcblxcbnZlYzIgcGl4ZWxzID0gdXYgKiBzYW1wbGVyU2l6ZVswXTtcXG5cXG5pZiAocGl4ZWxzLnggPCB2RnJhbWUueCB8fCBwaXhlbHMueCA+IHZGcmFtZS56IHx8XFxuICAgIHBpeGVscy55IDwgdkZyYW1lLnkgfHwgcGl4ZWxzLnkgPiB2RnJhbWUudykge1xcbiAgICB1di54ID0gdlRyYW5zMS54ICogc3VyZmFjZTIueCArIHZUcmFuczEueSAqIHN1cmZhY2UyLnkgKyB2VHJhbnMxLno7XFxuICAgIHV2LnkgPSB2VHJhbnMyLnggKiBzdXJmYWNlMi54ICsgdlRyYW5zMi55ICogc3VyZmFjZTIueSArIHZUcmFuczIuejtcXG4gICAgcGl4ZWxzID0gdXYgKiBzYW1wbGVyU2l6ZVswXTtcXG4gICAgXFxuICAgIGlmIChwaXhlbHMueCA8IHZGcmFtZS54IHx8IHBpeGVscy54ID4gdkZyYW1lLnogfHxcXG4gICAgICAgIHBpeGVscy55IDwgdkZyYW1lLnkgfHwgcGl4ZWxzLnkgPiB2RnJhbWUudykge1xcbiAgICAgICAgZGlzY2FyZDtcXG4gICAgfVxcbn1cXG5cXG52ZWM0IGVkZ2U7XFxuZWRnZS54eSA9IGNsYW1wKHBpeGVscyAtIHZGcmFtZS54eSArIDAuNSwgdmVjMigwLjAsIDAuMCksIHZlYzIoMS4wLCAxLjApKTtcXG5lZGdlLnp3ID0gY2xhbXAodkZyYW1lLnp3IC0gcGl4ZWxzICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcblxcbmZsb2F0IGFscGhhID0gMS4wOyAvL2VkZ2UueCAqIGVkZ2UueSAqIGVkZ2UueiAqIGVkZ2UudztcXG52ZWM0IHJDb2xvciA9IHZDb2xvciAqIGFscGhhO1xcblxcbmZsb2F0IHRleHR1cmVJZCA9IGZsb29yKHZUZXh0dXJlSWQrMC41KTtcXG52ZWM0IGNvbG9yO1xcbnZlYzIgdGV4dHVyZUNvb3JkID0gdXY7XFxuJWZvcmxvb3AlXFxuZ2xfRnJhZ0NvbG9yID0gY29sb3IgKiByQ29sb3I7XFxufVwiO1xyXG4gICAgICAgICAgICBfdGhpcy5kZWZVbmlmb3JtcyA9IHtcclxuICAgICAgICAgICAgICAgIHdvcmxkVHJhbnNmb3JtOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAxXSksXHJcbiAgICAgICAgICAgICAgICBkaXN0b3J0aW9uOiBuZXcgRmxvYXQzMkFycmF5KFswLCAwXSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTcHJpdGVCaWxpbmVhclJlbmRlcmVyLnByb3RvdHlwZS5nZXRVbmlmb3JtcyA9IGZ1bmN0aW9uIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIHByb2ogPSBzcHJpdGUucHJvajtcclxuICAgICAgICAgICAgdmFyIHNoYWRlciA9IHRoaXMuc2hhZGVyO1xyXG4gICAgICAgICAgICBpZiAocHJvai5zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvai5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2ouX2FjdGl2ZVByb2plY3Rpb24udW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmVW5pZm9ybXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVCaWxpbmVhclJlbmRlcmVyLnByb3RvdHlwZS5jcmVhdGVWYW8gPSBmdW5jdGlvbiAodmVydGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudmVydFNpemUgPSAxNDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0Qnl0ZVNpemUgPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdmFyIHZhbyA9IHRoaXMucmVuZGVyZXIuY3JlYXRlVmFvKClcclxuICAgICAgICAgICAgICAgIC5hZGRJbmRleCh0aGlzLmluZGV4QnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFWZXJ0ZXhQb3NpdGlvbiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMxLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAyICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVHJhbnMyLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA1ICogNClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hRnJhbWUsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDggKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFDb2xvciwgZ2wuVU5TSUdORURfQllURSwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDEyICogNCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5hVGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YW8uYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVRleHR1cmVJZCwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTMgKiA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFvO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlQmlsaW5lYXJSZW5kZXJlci5wcm90b3R5cGUuZmlsbFZlcnRpY2VzID0gZnVuY3Rpb24gKGZsb2F0MzJWaWV3LCB1aW50MzJWaWV3LCBpbmRleCwgc3ByaXRlLCBhcmdiLCB0ZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSBzcHJpdGUudmVydGV4RGF0YTtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS5fdGV4dHVyZTtcclxuICAgICAgICAgICAgdmFyIHcgPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGggPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBheCA9IHNwcml0ZS5fYW5jaG9yLl94O1xyXG4gICAgICAgICAgICB2YXIgYXkgPSBzcHJpdGUuX2FuY2hvci5feTtcclxuICAgICAgICAgICAgdmFyIGZyYW1lID0gdGV4Ll9mcmFtZTtcclxuICAgICAgICAgICAgdmFyIGFUcmFucyA9IHNwcml0ZS5hVHJhbnM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSB2ZXJ0ZXhEYXRhW2kgKiAyXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMV0gPSB2ZXJ0ZXhEYXRhW2kgKiAyICsgMV07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDJdID0gYVRyYW5zLmE7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDNdID0gYVRyYW5zLmM7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDRdID0gYVRyYW5zLnR4O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA1XSA9IGFUcmFucy5iO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IGFUcmFucy5kO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9IGFUcmFucy50eTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSBmcmFtZS54O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA5XSA9IGZyYW1lLnk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEwXSA9IGZyYW1lLnggKyBmcmFtZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTFdID0gZnJhbWUueSArIGZyYW1lLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAxMl0gPSBhcmdiO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB0ZXh0dXJlSWQ7XHJcbiAgICAgICAgICAgICAgICBpbmRleCArPSAxNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZUJpbGluZWFyUmVuZGVyZXI7XHJcbiAgICB9KE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKSk7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Nwcml0ZV9iaWxpbmVhcicsIFNwcml0ZUJpbGluZWFyUmVuZGVyZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB2YXIgU3ByaXRlU3RyYW5nZVJlbmRlcmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoU3ByaXRlU3RyYW5nZVJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFNwcml0ZVN0cmFuZ2VSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnNpemUgPSAxMDA7XHJcbiAgICAgICAgICAgIF90aGlzLk1BWF9URVhUVVJFU19MT0NBTCA9IDE7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzMgYVRyYW5zMTtcXG5hdHRyaWJ1dGUgdmVjMyBhVHJhbnMyO1xcbmF0dHJpYnV0ZSB2ZWM0IGFGcmFtZTtcXG5hdHRyaWJ1dGUgdmVjNCBhQ29sb3I7XFxuYXR0cmlidXRlIGZsb2F0IGFUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHdvcmxkVHJhbnNmb3JtO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogd29ybGRUcmFuc2Zvcm0gKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24ueiA9IDAuMDtcXG4gICAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVmVydGV4UG9zaXRpb247XFxuICAgIHZUcmFuczEgPSBhVHJhbnMxO1xcbiAgICB2VHJhbnMyID0gYVRyYW5zMjtcXG4gICAgdlRleHR1cmVJZCA9IGFUZXh0dXJlSWQ7XFxuICAgIHZDb2xvciA9IGFDb2xvcjtcXG4gICAgdkZyYW1lID0gYUZyYW1lO1xcbn1cXG5cIjtcclxuICAgICAgICAgICAgX3RoaXMuc2hhZGVyRnJhZyA9IFwicHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMxO1xcbnZhcnlpbmcgdmVjMyB2VHJhbnMyO1xcbnZhcnlpbmcgdmVjNCB2RnJhbWU7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXJzWyVjb3VudCVdO1xcbnVuaWZvcm0gdmVjMiBzYW1wbGVyU2l6ZVslY291bnQlXTsgXFxudW5pZm9ybSB2ZWM0IHBhcmFtcztcXG5cXG52b2lkIG1haW4odm9pZCl7XFxudmVjMiBzdXJmYWNlO1xcblxcbmZsb2F0IHZ4ID0gdlRleHR1cmVDb29yZC54O1xcbmZsb2F0IHZ5ID0gdlRleHR1cmVDb29yZC55O1xcbmZsb2F0IGFsZXBoID0gcGFyYW1zLng7XFxuZmxvYXQgYmV0ID0gcGFyYW1zLnk7XFxuZmxvYXQgQSA9IHBhcmFtcy56O1xcbmZsb2F0IEIgPSBwYXJhbXMudztcXG5cXG5pZiAoYWxlcGggPT0gMC4wKSB7XFxuXFx0c3VyZmFjZS55ID0gdnkgLyAoMS4wICsgdnggKiBiZXQpO1xcblxcdHN1cmZhY2UueCA9IHZ4O1xcbn1cXG5lbHNlIGlmIChiZXQgPT0gMC4wKSB7XFxuXFx0c3VyZmFjZS54ID0gdnggLyAoMS4wICsgdnkgKiBhbGVwaCk7XFxuXFx0c3VyZmFjZS55ID0gdnk7XFxufSBlbHNlIHtcXG5cXHRzdXJmYWNlLnggPSB2eCAqIChiZXQgKyAxLjApIC8gKGJldCArIDEuMCArIHZ5ICogYWxlcGgpO1xcblxcdHN1cmZhY2UueSA9IHZ5ICogKGFsZXBoICsgMS4wKSAvIChhbGVwaCArIDEuMCArIHZ4ICogYmV0KTtcXG59XFxuXFxudmVjMiB1djtcXG51di54ID0gdlRyYW5zMS54ICogc3VyZmFjZS54ICsgdlRyYW5zMS55ICogc3VyZmFjZS55ICsgdlRyYW5zMS56O1xcbnV2LnkgPSB2VHJhbnMyLnggKiBzdXJmYWNlLnggKyB2VHJhbnMyLnkgKiBzdXJmYWNlLnkgKyB2VHJhbnMyLno7XFxuXFxudmVjMiBwaXhlbHMgPSB1diAqIHNhbXBsZXJTaXplWzBdO1xcblxcbnZlYzQgZWRnZTtcXG5lZGdlLnh5ID0gY2xhbXAocGl4ZWxzIC0gdkZyYW1lLnh5ICsgMC41LCB2ZWMyKDAuMCwgMC4wKSwgdmVjMigxLjAsIDEuMCkpO1xcbmVkZ2UuencgPSBjbGFtcCh2RnJhbWUuencgLSBwaXhlbHMgKyAwLjUsIHZlYzIoMC4wLCAwLjApLCB2ZWMyKDEuMCwgMS4wKSk7XFxuXFxuZmxvYXQgYWxwaGEgPSBlZGdlLnggKiBlZGdlLnkgKiBlZGdlLnogKiBlZGdlLnc7XFxudmVjNCByQ29sb3IgPSB2Q29sb3IgKiBhbHBoYTtcXG5cXG5mbG9hdCB0ZXh0dXJlSWQgPSBmbG9vcih2VGV4dHVyZUlkKzAuNSk7XFxudmVjNCBjb2xvcjtcXG52ZWMyIHRleHR1cmVDb29yZCA9IHV2O1xcbiVmb3Jsb29wJVxcbmdsX0ZyYWdDb2xvciA9IGNvbG9yICogckNvbG9yO1xcbn1cIjtcclxuICAgICAgICAgICAgX3RoaXMuZGVmVW5pZm9ybXMgPSB7XHJcbiAgICAgICAgICAgICAgICB3b3JsZFRyYW5zZm9ybTogbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV0pLFxyXG4gICAgICAgICAgICAgICAgZGlzdG9ydGlvbjogbmV3IEZsb2F0MzJBcnJheShbMCwgMF0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlU3RyYW5nZVJlbmRlcmVyLnByb3RvdHlwZS5nZXRVbmlmb3JtcyA9IGZ1bmN0aW9uIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgdmFyIHByb2ogPSBzcHJpdGUucHJvajtcclxuICAgICAgICAgICAgdmFyIHNoYWRlciA9IHRoaXMuc2hhZGVyO1xyXG4gICAgICAgICAgICBpZiAocHJvai5zdXJmYWNlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvai51bmlmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvai5fYWN0aXZlUHJvamVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2ouX2FjdGl2ZVByb2plY3Rpb24udW5pZm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVmVW5pZm9ybXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVTdHJhbmdlUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZVZhbyA9IGZ1bmN0aW9uICh2ZXJ0ZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuICAgICAgICAgICAgdGhpcy52ZXJ0U2l6ZSA9IDE0O1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRCeXRlU2l6ZSA9IHRoaXMudmVydFNpemUgKiA0O1xyXG4gICAgICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xyXG4gICAgICAgICAgICB2YXIgdmFvID0gdGhpcy5yZW5kZXJlci5jcmVhdGVWYW8oKVxyXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KHRoaXMuaW5kZXhCdWZmZXIpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYVZlcnRleFBvc2l0aW9uLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAwKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczEsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDIgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFUcmFuczIsIGdsLkZMT0FULCBmYWxzZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDUgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFGcmFtZSwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgOCAqIDQpXHJcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKHZlcnRleEJ1ZmZlciwgYXR0cnMuYUNvbG9yLCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMTIgKiA0KTtcclxuICAgICAgICAgICAgaWYgKGF0dHJzLmFUZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgICAgIHZhby5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUlkLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCAxMyAqIDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YW87XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGVTdHJhbmdlUmVuZGVyZXIucHJvdG90eXBlLmZpbGxWZXJ0aWNlcyA9IGZ1bmN0aW9uIChmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgdGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gc3ByaXRlLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0ZXggPSBzcHJpdGUuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB3ID0gdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYXggPSBzcHJpdGUuX2FuY2hvci5feDtcclxuICAgICAgICAgICAgdmFyIGF5ID0gc3ByaXRlLl9hbmNob3IuX3k7XHJcbiAgICAgICAgICAgIHZhciBmcmFtZSA9IHRleC5fZnJhbWU7XHJcbiAgICAgICAgICAgIHZhciBhVHJhbnMgPSBzcHJpdGUuYVRyYW5zO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXhdID0gdmVydGV4RGF0YVtpICogMl07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVtpICogMiArIDFdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IGFUcmFucy5hO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAzXSA9IGFUcmFucy5jO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA0XSA9IGFUcmFucy50eDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNV0gPSBhVHJhbnMuYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNl0gPSBhVHJhbnMuZDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgN10gPSBhVHJhbnMudHk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gZnJhbWUueDtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOV0gPSBmcmFtZS55O1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMF0gPSBmcmFtZS54ICsgZnJhbWUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDExXSA9IGZyYW1lLnkgKyBmcmFtZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgMTJdID0gYXJnYjtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTNdID0gdGV4dHVyZUlkO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBTcHJpdGVTdHJhbmdlUmVuZGVyZXI7XHJcbiAgICB9KE11bHRpVGV4dHVyZVNwcml0ZVJlbmRlcmVyKSk7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ3Nwcml0ZV9zdHJhbmdlJywgU3ByaXRlU3RyYW5nZVJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIHRlbXBNYXQgPSBuZXcgUElYSS5NYXRyaXgoKTtcclxuICAgIHZhciB0ZW1wUmVjdCA9IG5ldyBQSVhJLlJlY3RhbmdsZSgpO1xyXG4gICAgdmFyIHRlbXBQb2ludCA9IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICB2YXIgU3RyYW5nZVN1cmZhY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTdHJhbmdlU3VyZmFjZSwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTdHJhbmdlU3VyZmFjZSgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucGFyYW1zID0gWzAsIDAsIE5hTiwgTmFOXTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIHBbMF0gPSAwO1xyXG4gICAgICAgICAgICBwWzFdID0gMDtcclxuICAgICAgICAgICAgcFsyXSA9IE5hTjtcclxuICAgICAgICAgICAgcFszXSA9IE5hTjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5zZXRBeGlzWCA9IGZ1bmN0aW9uIChwb3MsIGZhY3Rvciwgb3V0VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLngsIHkgPSBwb3MueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciByb3QgPSBvdXRUcmFuc2Zvcm0ucm90YXRpb247XHJcbiAgICAgICAgICAgIGlmIChyb3QgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll94IC09IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3Ll95ICs9IHJvdDtcclxuICAgICAgICAgICAgICAgIG91dFRyYW5zZm9ybS5yb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0VHJhbnNmb3JtLnNrZXcueSA9IE1hdGguYXRhbjIoeSwgeCk7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHBbMl0gPSAtZCAqIGZhY3RvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBbMl0gPSBOYU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fY2FsYzAxKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuc2V0QXhpc1kgPSBmdW5jdGlvbiAocG9zLCBmYWN0b3IsIG91dFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54LCB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgcm90ID0gb3V0VHJhbnNmb3JtLnJvdGF0aW9uO1xyXG4gICAgICAgICAgICBpZiAocm90ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feCAtPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2tldy5feSArPSByb3Q7XHJcbiAgICAgICAgICAgICAgICBvdXRUcmFuc2Zvcm0ucm90YXRpb24gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dFRyYW5zZm9ybS5za2V3LnggPSAtTWF0aC5hdGFuMih5LCB4KSArIE1hdGguUEkgLyAyO1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwWzNdID0gLWQgKiBmYWN0b3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwWzNdID0gTmFOO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGMwMSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLl9jYWxjMDEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgICAgIGlmIChpc05hTihwWzJdKSkge1xyXG4gICAgICAgICAgICAgICAgcFsxXSA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocFszXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwWzBdID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAxLjAgLyBwWzNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKHBbM10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcFsxXSA9IDEuMCAvIHBbMl07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IDEuMCAtIHBbMl0gKiBwWzNdO1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSAoMS4wIC0gcFsyXSkgLyBkO1xyXG4gICAgICAgICAgICAgICAgICAgIHBbMV0gPSAoMS4wIC0gcFszXSkgLyBkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAocG9zLCBuZXdQb3MpIHtcclxuICAgICAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQSVhJLlBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhbGVwaCA9IHRoaXMucGFyYW1zWzBdLCBiZXQgPSB0aGlzLnBhcmFtc1sxXSwgQSA9IHRoaXMucGFyYW1zWzJdLCBCID0gdGhpcy5wYXJhbXNbM107XHJcbiAgICAgICAgICAgIHZhciB1ID0gcG9zLngsIHYgPSBwb3MueTtcclxuICAgICAgICAgICAgaWYgKGFsZXBoID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdiAqICgxICsgdSAqIGJldCk7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3MueCA9IHU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYmV0ID09PSAwLjApIHtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gdSAqICgxICsgdiAqIGFsZXBoKTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gdjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBEID0gQSAqIEIgLSB2ICogdTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0gQSAqIHUgKiAoQiArIHYpIC8gRDtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy55ID0gQiAqIHYgKiAoQSArIHUpIC8gRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3UG9zO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3RyYW5nZVN1cmZhY2UucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIGFsZXBoID0gdGhpcy5wYXJhbXNbMF0sIGJldCA9IHRoaXMucGFyYW1zWzFdLCBBID0gdGhpcy5wYXJhbXNbMl0sIEIgPSB0aGlzLnBhcmFtc1szXTtcclxuICAgICAgICAgICAgdmFyIHggPSBwb3MueCwgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICBpZiAoYWxlcGggPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB5IC8gKDEgKyB4ICogYmV0KTtcclxuICAgICAgICAgICAgICAgIG5ld1Bvcy54ID0geDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChiZXQgPT09IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB4ICogKDEgKyB5ICogYWxlcGgpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnggPSB4ICogKGJldCArIDEpIC8gKGJldCArIDEgKyB5ICogYWxlcGgpO1xyXG4gICAgICAgICAgICAgICAgbmV3UG9zLnkgPSB5ICogKGFsZXBoICsgMSkgLyAoYWxlcGggKyAxICsgeCAqIGJldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5tYXBTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlLCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHRleCA9IHNwcml0ZS50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC54ID0gLXNwcml0ZS5hbmNob3IueCAqIHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gLXNwcml0ZS5hbmNob3IueSAqIHRleC5vcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdGVtcFJlY3Qud2lkdGggPSB0ZXgub3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdGVtcFJlY3QuaGVpZ2h0ID0gdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXBRdWFkKHRlbXBSZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0gfHwgc3ByaXRlLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdHJhbmdlU3VyZmFjZS5wcm90b3R5cGUubWFwUXVhZCA9IGZ1bmN0aW9uIChyZWN0LCBxdWFkLCBvdXRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgdmFyIGF4ID0gLXJlY3QueCAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBheSA9IC1yZWN0LnkgLyByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGF4MiA9ICgxLjAgLSByZWN0LngpIC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGF5MiA9ICgxLjAgLSByZWN0LnkpIC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciB1cDF4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDF5ID0gKHF1YWRbMF0ueSAqICgxLjAgLSBheCkgKyBxdWFkWzFdLnkgKiBheCk7XHJcbiAgICAgICAgICAgIHZhciB1cDJ4ID0gKHF1YWRbMF0ueCAqICgxLjAgLSBheDIpICsgcXVhZFsxXS54ICogYXgyKTtcclxuICAgICAgICAgICAgdmFyIHVwMnkgPSAocXVhZFswXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzFdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgZG93bjF4ID0gKHF1YWRbM10ueCAqICgxLjAgLSBheCkgKyBxdWFkWzJdLnggKiBheCk7XHJcbiAgICAgICAgICAgIHZhciBkb3duMXkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4KSArIHF1YWRbMl0ueSAqIGF4KTtcclxuICAgICAgICAgICAgdmFyIGRvd24yeCA9IChxdWFkWzNdLnggKiAoMS4wIC0gYXgyKSArIHF1YWRbMl0ueCAqIGF4Mik7XHJcbiAgICAgICAgICAgIHZhciBkb3duMnkgPSAocXVhZFszXS55ICogKDEuMCAtIGF4MikgKyBxdWFkWzJdLnkgKiBheDIpO1xyXG4gICAgICAgICAgICB2YXIgeDAwID0gdXAxeCAqICgxLjAgLSBheSkgKyBkb3duMXggKiBheTtcclxuICAgICAgICAgICAgdmFyIHkwMCA9IHVwMXkgKiAoMS4wIC0gYXkpICsgZG93bjF5ICogYXk7XHJcbiAgICAgICAgICAgIHZhciB4MTAgPSB1cDJ4ICogKDEuMCAtIGF5KSArIGRvd24yeCAqIGF5O1xyXG4gICAgICAgICAgICB2YXIgeTEwID0gdXAyeSAqICgxLjAgLSBheSkgKyBkb3duMnkgKiBheTtcclxuICAgICAgICAgICAgdmFyIHgwMSA9IHVwMXggKiAoMS4wIC0gYXkyKSArIGRvd24xeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkwMSA9IHVwMXkgKiAoMS4wIC0gYXkyKSArIGRvd24xeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHgxMSA9IHVwMnggKiAoMS4wIC0gYXkyKSArIGRvd24yeCAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIHkxMSA9IHVwMnkgKiAoMS4wIC0gYXkyKSArIGRvd24yeSAqIGF5MjtcclxuICAgICAgICAgICAgdmFyIG1hdCA9IHRlbXBNYXQ7XHJcbiAgICAgICAgICAgIG1hdC50eCA9IHgwMDtcclxuICAgICAgICAgICAgbWF0LnR5ID0geTAwO1xyXG4gICAgICAgICAgICBtYXQuYSA9IHgxMCAtIHgwMDtcclxuICAgICAgICAgICAgbWF0LmIgPSB5MTAgLSB5MDA7XHJcbiAgICAgICAgICAgIG1hdC5jID0geDAxIC0geDAwO1xyXG4gICAgICAgICAgICBtYXQuZCA9IHkwMSAtIHkwMDtcclxuICAgICAgICAgICAgdGVtcFBvaW50LnNldCh4MTEsIHkxMSk7XHJcbiAgICAgICAgICAgIG1hdC5hcHBseUludmVyc2UodGVtcFBvaW50LCB0ZW1wUG9pbnQpO1xyXG4gICAgICAgICAgICBvdXRUcmFuc2Zvcm0uc2V0RnJvbU1hdHJpeChtYXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN0cmFuZ2VTdXJmYWNlLnByb3RvdHlwZS5maWxsVW5pZm9ybXMgPSBmdW5jdGlvbiAodW5pZm9ybXMpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgICAgICB2YXIgZGlzdG9ydGlvbiA9IHVuaWZvcm1zLnBhcmFtcyB8fCBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAwXSk7XHJcbiAgICAgICAgICAgIHVuaWZvcm1zLnBhcmFtcyA9IGRpc3RvcnRpb247XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bMF0gPSBwYXJhbXNbMF07XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bMV0gPSBwYXJhbXNbMV07XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bMl0gPSBwYXJhbXNbMl07XHJcbiAgICAgICAgICAgIGRpc3RvcnRpb25bM10gPSBwYXJhbXNbM107XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3RyYW5nZVN1cmZhY2U7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5TdXJmYWNlKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uU3RyYW5nZVN1cmZhY2UgPSBTdHJhbmdlU3VyZmFjZTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgUElYSS5TcHJpdGUucHJvdG90eXBlLmNvbnZlcnRUbzJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlX2JpbGluZWFyJztcclxuICAgICAgICB0aGlzLmFUcmFucyA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVmVydGljZXMgPSBwaXhpX3Byb2plY3Rpb24uU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5jYWxjdWxhdGVUcmltbWVkVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG4gICAgICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0VG8ycy5jYWxsKHRoaXMpO1xyXG4gICAgfTtcclxuICAgIFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5jb252ZXJ0VG8ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFN1YnRyZWVUbzJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY29udmVydFRvMnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jb252ZXJ0U3VidHJlZVRvMnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgU3ByaXRlMnMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGUycywgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGUycyh0ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHR1cmUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLmFUcmFucyA9IG5ldyBQSVhJLk1hdHJpeCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uU3VyZmFjZShfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZV9iaWxpbmVhcic7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlMnMucHJvdG90eXBlLl9jYWxjdWxhdGVCb3VuZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kcy5hZGRRdWFkKHRoaXMudmVydGV4VHJpbW1lZERhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgd2lkID0gdGhpcy50cmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgICAgIHZhciB0dWlkID0gdGhpcy5fdGV4dHVyZS5fdXBkYXRlSUQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90cmFuc2Zvcm1JRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVJRCA9PT0gdHVpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zZm9ybUlEID0gd2lkO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhEYXRhO1xyXG4gICAgICAgICAgICB2YXIgdHJpbSA9IHRleHR1cmUudHJpbTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3MCA9IDA7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0cmltKSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IHRyaW0ueCAtIChhbmNob3IuX3ggKiBvcmlnLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyB0cmltLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSB0cmltLnkgLSAoYW5jaG9yLl95ICogb3JpZy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaDAgPSBoMSArIHRyaW0uaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fc3VyZmFjZSkge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gd3QuYTtcclxuICAgICAgICAgICAgICAgIHZhciBiID0gd3QuYjtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gd3QuYztcclxuICAgICAgICAgICAgICAgIHZhciBkID0gd3QuZDtcclxuICAgICAgICAgICAgICAgIHZhciB0eCA9IHd0LnR4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5ID0gd3QudHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gKGEgKiB3MSkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IChkICogaDEpICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMl0gPSAoYSAqIHcwKSArIChjICogaDEpICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gKGQgKiBoMSkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IChhICogdzApICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNV0gPSAoZCAqIGgwKSArIChiICogdzApICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gKGEgKiB3MSkgKyAoYyAqIGgwKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IChkICogaDApICsgKGIgKiB3MSkgKyB0eTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24uc3VyZmFjZS5ib3VuZHNRdWFkKHZlcnRleERhdGEsIHZlcnRleERhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGV4dHVyZS50cmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgICAgIHRleHR1cmUudHJhbnNmb3JtID0gbmV3IFBJWEkuZXh0cmFzLlRleHR1cmVUcmFuc2Zvcm0odGV4dHVyZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dHVyZS50cmFuc2Zvcm0udXBkYXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBhVHJhbnMgPSB0aGlzLmFUcmFucztcclxuICAgICAgICAgICAgYVRyYW5zLnNldChvcmlnLndpZHRoLCAwLCAwLCBvcmlnLmhlaWdodCwgdzEsIGgxKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fc3VyZmFjZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYVRyYW5zLnByZXBlbmQodGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFUcmFucy5pbnZlcnQoKTtcclxuICAgICAgICAgICAgYVRyYW5zLnByZXBlbmQodGV4dHVyZS50cmFuc2Zvcm0ubWFwQ29vcmQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3ByaXRlMnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmVydGV4VHJpbW1lZERhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4VHJpbW1lZERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgdmFyIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fc3VyZmFjZSkge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsxXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IGgxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs0XSA9IHcwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IHcxO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs3XSA9IGgwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9zdXJmYWNlLmJvdW5kc1F1YWQodmVydGV4RGF0YSwgdmVydGV4RGF0YSwgdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHd0ID0gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IHd0LmE7XHJcbiAgICAgICAgICAgICAgICB2YXIgYiA9IHd0LmI7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHd0LmM7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IHd0LmQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHggPSB3dC50eDtcclxuICAgICAgICAgICAgICAgIHZhciB0eSA9IHd0LnR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVswXSA9IChhICogdzEpICsgKGMgKiBoMSkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSAoZCAqIGgxKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzJdID0gKGEgKiB3MCkgKyAoYyAqIGgxKSArIHR4O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVszXSA9IChkICogaDEpICsgKGIgKiB3MCkgKyB0eTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSAoYSAqIHcwKSArIChjICogaDApICsgdHg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhWzVdID0gKGQgKiBoMCkgKyAoYiAqIHcwKSArIHR5O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVs2XSA9IChhICogdzEpICsgKGMgKiBoMCkgKyB0eDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSAoZCAqIGgwKSArIChiICogdzEpICsgdHk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qLl9hY3RpdmVQcm9qZWN0aW9uLnN1cmZhY2UuYm91bmRzUXVhZCh2ZXJ0ZXhEYXRhLCB2ZXJ0ZXhEYXRhLCB0aGlzLnByb2ouX2FjdGl2ZVByb2plY3Rpb24ubGVnYWN5LndvcmxkVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNwcml0ZTJzLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZTJzO1xyXG4gICAgfShQSVhJLlNwcml0ZSkpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzID0gU3ByaXRlMnM7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBUZXh0MnMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhUZXh0MnMsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gVGV4dDJzKHRleHQsIHN0eWxlLCBjYW52YXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGV4dCwgc3R5bGUsIGNhbnZhcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMuYVRyYW5zID0gbmV3IFBJWEkuTWF0cml4KCk7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb25TdXJmYWNlKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnc3ByaXRlX2JpbGluZWFyJztcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dDJzLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvajtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFRleHQycztcclxuICAgIH0oUElYSS5UZXh0KSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uVGV4dDJzID0gVGV4dDJzO1xyXG4gICAgVGV4dDJzLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICBUZXh0MnMucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUycy5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgVGV4dDJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJzLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBmdW5jdGlvbiBjb250YWluZXIyZFdvcmxkVHJhbnNmb3JtKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICB9XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSA9IGNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm07XHJcbiAgICB2YXIgQ29udGFpbmVyMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhDb250YWluZXIyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBDb250YWluZXIyZCgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbnRhaW5lcjJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIENvbnRhaW5lcjJkO1xyXG4gICAgfShQSVhJLkNvbnRhaW5lcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLkNvbnRhaW5lcjJkID0gQ29udGFpbmVyMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBQb2ludCA9IFBJWEkuUG9pbnQ7XHJcbiAgICB2YXIgbWF0M2lkID0gWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdO1xyXG4gICAgdmFyIEFGRklORTtcclxuICAgIChmdW5jdGlvbiAoQUZGSU5FKSB7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIk5PTkVcIl0gPSAwXSA9IFwiTk9ORVwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJGUkVFXCJdID0gMV0gPSBcIkZSRUVcIjtcclxuICAgICAgICBBRkZJTkVbQUZGSU5FW1wiQVhJU19YXCJdID0gMl0gPSBcIkFYSVNfWFwiO1xyXG4gICAgICAgIEFGRklORVtBRkZJTkVbXCJBWElTX1lcIl0gPSAzXSA9IFwiQVhJU19ZXCI7XHJcbiAgICAgICAgQUZGSU5FW0FGRklORVtcIlBPSU5UXCJdID0gNF0gPSBcIlBPSU5UXCI7XHJcbiAgICB9KShBRkZJTkUgPSBwaXhpX3Byb2plY3Rpb24uQUZGSU5FIHx8IChwaXhpX3Byb2plY3Rpb24uQUZGSU5FID0ge30pKTtcclxuICAgIHZhciBNYXRyaXgyZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gTWF0cml4MmQoYmFja2luZ0FycmF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmxvYXRBcnJheSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMubWF0MyA9IG5ldyBGbG9hdDY0QXJyYXkoYmFja2luZ0FycmF5IHx8IG1hdDNpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiYVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1swXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1swXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcImJcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbMV07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbMV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hdHJpeDJkLnByb3RvdHlwZSwgXCJjXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzNdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzNdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwiZFwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0M1s0XTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWF0M1s0XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4MmQucHJvdG90eXBlLCBcInR4XCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXQzWzZdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXQzWzZdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXRyaXgyZC5wcm90b3R5cGUsIFwidHlcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdDNbN107XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hdDNbN10gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB0eCwgdHkpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSBhO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gYjtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBjO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gZDtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSB0eDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IHR5O1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICh0cmFuc3Bvc2UsIG91dCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZmxvYXRBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG9hdEFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSg5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBvdXQgfHwgdGhpcy5mbG9hdEFycmF5O1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgaWYgKHRyYW5zcG9zZSkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMF0gPSBtYXQzWzBdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMV0gPSBtYXQzWzFdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMl0gPSBtYXQzWzJdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbM10gPSBtYXQzWzNdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNF0gPSBtYXQzWzRdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNV0gPSBtYXQzWzVdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNl0gPSBtYXQzWzZdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbN10gPSBtYXQzWzddO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbOF0gPSBtYXQzWzhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMF0gPSBtYXQzWzBdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMV0gPSBtYXQzWzNdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbMl0gPSBtYXQzWzZdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbM10gPSBtYXQzWzFdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNF0gPSBtYXQzWzRdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNV0gPSBtYXQzWzddO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbNl0gPSBtYXQzWzJdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbN10gPSBtYXQzWzVdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbOF0gPSBtYXQzWzhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBJWEkuUG9pbnQoKTtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcG9zLng7XHJcbiAgICAgICAgICAgIHZhciB5ID0gcG9zLnk7XHJcbiAgICAgICAgICAgIHZhciB6ID0gMS4wIC8gKG1hdDNbMl0gKiB4ICsgbWF0M1s1XSAqIHkgKyBtYXQzWzhdKTtcclxuICAgICAgICAgICAgbmV3UG9zLnggPSB6ICogKG1hdDNbMF0gKiB4ICsgbWF0M1szXSAqIHkgKyBtYXQzWzZdKTtcclxuICAgICAgICAgICAgbmV3UG9zLnkgPSB6ICogKG1hdDNbMV0gKiB4ICsgbWF0M1s0XSAqIHkgKyBtYXQzWzddKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1BvcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbiAodHgsIHR5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdICs9IHR4ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1sxXSArPSB0eSAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbM10gKz0gdHggKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzRdICs9IHR5ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s2XSArPSB0eCAqIG1hdDNbOF07XHJcbiAgICAgICAgICAgIG1hdDNbN10gKz0gdHkgKiBtYXQzWzhdO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdICo9IHg7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gKj0geTtcclxuICAgICAgICAgICAgbWF0M1szXSAqPSB4O1xyXG4gICAgICAgICAgICBtYXQzWzRdICo9IHk7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gKj0geDtcclxuICAgICAgICAgICAgbWF0M1s3XSAqPSB5O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5zY2FsZUFuZFRyYW5zbGF0ZSA9IGZ1bmN0aW9uIChzY2FsZVgsIHNjYWxlWSwgdHgsIHR5KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gc2NhbGVYICogbWF0M1swXSArIHR4ICogbWF0M1syXTtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHNjYWxlWSAqIG1hdDNbMV0gKyB0eSAqIG1hdDNbMl07XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBzY2FsZVggKiBtYXQzWzNdICsgdHggKiBtYXQzWzVdO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gc2NhbGVZICogbWF0M1s0XSArIHR5ICogbWF0M1s1XTtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHNjYWxlWCAqIG1hdDNbNl0gKyB0eCAqIG1hdDNbOF07XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSBzY2FsZVkgKiBtYXQzWzddICsgdHkgKiBtYXQzWzhdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmFwcGx5SW52ZXJzZSA9IGZ1bmN0aW9uIChwb3MsIG5ld1Bvcykge1xyXG4gICAgICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBvaW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvcy54O1xyXG4gICAgICAgICAgICB2YXIgeSA9IHBvcy55O1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVszXSwgYTAyID0gYVs2XSwgYTEwID0gYVsxXSwgYTExID0gYVs0XSwgYTEyID0gYVs3XSwgYTIwID0gYVsyXSwgYTIxID0gYVs1XSwgYTIyID0gYVs4XTtcclxuICAgICAgICAgICAgdmFyIG5ld1ggPSAoYTIyICogYTExIC0gYTEyICogYTIxKSAqIHggKyAoLWEyMiAqIGEwMSArIGEwMiAqIGEyMSkgKiB5ICsgKGExMiAqIGEwMSAtIGEwMiAqIGExMSk7XHJcbiAgICAgICAgICAgIHZhciBuZXdZID0gKC1hMjIgKiBhMTAgKyBhMTIgKiBhMjApICogeCArIChhMjIgKiBhMDAgLSBhMDIgKiBhMjApICogeSArICgtYTEyICogYTAwICsgYTAyICogYTEwKTtcclxuICAgICAgICAgICAgdmFyIG5ld1ogPSAoYTIxICogYTEwIC0gYTExICogYTIwKSAqIHggKyAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiB5ICsgKGExMSAqIGEwMCAtIGEwMSAqIGExMCk7XHJcbiAgICAgICAgICAgIG5ld1Bvcy54ID0gbmV3WCAvIG5ld1o7XHJcbiAgICAgICAgICAgIG5ld1Bvcy55ID0gbmV3WSAvIG5ld1o7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdQb3M7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYSA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sIGIwMSA9IGEyMiAqIGExMSAtIGExMiAqIGEyMSwgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMCwgYjIxID0gYTIxICogYTEwIC0gYTExICogYTIwO1xyXG4gICAgICAgICAgICB2YXIgZGV0ID0gYTAwICogYjAxICsgYTAxICogYjExICsgYTAyICogYjIxO1xyXG4gICAgICAgICAgICBpZiAoIWRldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xyXG4gICAgICAgICAgICBhWzBdID0gYjAxICogZGV0O1xyXG4gICAgICAgICAgICBhWzFdID0gKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogZGV0O1xyXG4gICAgICAgICAgICBhWzJdID0gKGExMiAqIGEwMSAtIGEwMiAqIGExMSkgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbM10gPSBiMTEgKiBkZXQ7XHJcbiAgICAgICAgICAgIGFbNF0gPSAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIGRldDtcclxuICAgICAgICAgICAgYVs1XSA9ICgtYTEyICogYTAwICsgYTAyICogYTEwKSAqIGRldDtcclxuICAgICAgICAgICAgYVs2XSA9IGIyMSAqIGRldDtcclxuICAgICAgICAgICAgYVs3XSA9ICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIGRldDtcclxuICAgICAgICAgICAgYVs4XSA9IChhMTEgKiBhMDAgLSBhMDEgKiBhMTApICogZGV0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hdHJpeDJkLnByb3RvdHlwZS5pZGVudGl0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSAxO1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gMDtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0gMTtcclxuICAgICAgICAgICAgbWF0M1s1XSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbNl0gPSAwO1xyXG4gICAgICAgICAgICBtYXQzWzddID0gMDtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeDJkKHRoaXMubWF0Myk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY29weVRvID0gZnVuY3Rpb24gKG1hdHJpeCkge1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0MztcclxuICAgICAgICAgICAgdmFyIGFyMiA9IG1hdHJpeC5tYXQzO1xyXG4gICAgICAgICAgICBhcjJbMF0gPSBtYXQzWzBdO1xyXG4gICAgICAgICAgICBhcjJbMV0gPSBtYXQzWzFdO1xyXG4gICAgICAgICAgICBhcjJbMl0gPSBtYXQzWzJdO1xyXG4gICAgICAgICAgICBhcjJbM10gPSBtYXQzWzNdO1xyXG4gICAgICAgICAgICBhcjJbNF0gPSBtYXQzWzRdO1xyXG4gICAgICAgICAgICBhcjJbNV0gPSBtYXQzWzVdO1xyXG4gICAgICAgICAgICBhcjJbNl0gPSBtYXQzWzZdO1xyXG4gICAgICAgICAgICBhcjJbN10gPSBtYXQzWzddO1xyXG4gICAgICAgICAgICBhcjJbOF0gPSBtYXQzWzhdO1xyXG4gICAgICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAobWF0cml4LCBhZmZpbmUpIHtcclxuICAgICAgICAgICAgdmFyIG1hdDMgPSB0aGlzLm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBkID0gMS4wIC8gbWF0M1s4XTtcclxuICAgICAgICAgICAgdmFyIHR4ID0gbWF0M1s2XSAqIGQsIHR5ID0gbWF0M1s3XSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5hID0gKG1hdDNbMF0gLSBtYXQzWzJdICogdHgpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LmIgPSAobWF0M1sxXSAtIG1hdDNbMl0gKiB0eSkgKiBkO1xyXG4gICAgICAgICAgICBtYXRyaXguYyA9IChtYXQzWzNdIC0gbWF0M1s1XSAqIHR4KSAqIGQ7XHJcbiAgICAgICAgICAgIG1hdHJpeC5kID0gKG1hdDNbNF0gLSBtYXQzWzVdICogdHkpICogZDtcclxuICAgICAgICAgICAgbWF0cml4LnR4ID0gdHg7XHJcbiAgICAgICAgICAgIG1hdHJpeC50eSA9IHR5O1xyXG4gICAgICAgICAgICBpZiAoYWZmaW5lID49IDIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhZmZpbmUgPT09IEFGRklORS5QT0lOVCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5hID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5kID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFmZmluZSA9PT0gQUZGSU5FLkFYSVNfWCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5jID0gLW1hdHJpeC5iO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5kID0gbWF0cml4LmE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhZmZpbmUgPT09IEFGRklORS5BWElTX1kpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYSA9IG1hdHJpeC5kO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5jID0gLW1hdHJpeC5iO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuY29weUZyb20gPSBmdW5jdGlvbiAobWF0cml4KSB7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gbWF0cml4LmE7XHJcbiAgICAgICAgICAgIG1hdDNbMV0gPSBtYXRyaXguYjtcclxuICAgICAgICAgICAgbWF0M1syXSA9IDA7XHJcbiAgICAgICAgICAgIG1hdDNbM10gPSBtYXRyaXguYztcclxuICAgICAgICAgICAgbWF0M1s0XSA9IG1hdHJpeC5kO1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMDtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IG1hdHJpeC50eDtcclxuICAgICAgICAgICAgbWF0M1s3XSA9IG1hdHJpeC50eTtcclxuICAgICAgICAgICAgbWF0M1s4XSA9IDEuMDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5wcm90b3R5cGUuc2V0VG9NdWx0TGVnYWN5ID0gZnVuY3Rpb24gKHB0LCBsdCkge1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYiA9IGx0Lm1hdDM7XHJcbiAgICAgICAgICAgIHZhciBhMDAgPSBwdC5hLCBhMDEgPSBwdC5iLCBhMTAgPSBwdC5jLCBhMTEgPSBwdC5kLCBhMjAgPSBwdC50eCwgYTIxID0gcHQudHksIGIwMCA9IGJbMF0sIGIwMSA9IGJbMV0sIGIwMiA9IGJbMl0sIGIxMCA9IGJbM10sIGIxMSA9IGJbNF0sIGIxMiA9IGJbNV0sIGIyMCA9IGJbNl0sIGIyMSA9IGJbN10sIGIyMiA9IGJbOF07XHJcbiAgICAgICAgICAgIG91dFswXSA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzFdID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbMl0gPSBiMDI7XHJcbiAgICAgICAgICAgIG91dFszXSA9IGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbNV0gPSBiMTI7XHJcbiAgICAgICAgICAgIG91dFs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcclxuICAgICAgICAgICAgb3V0WzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xyXG4gICAgICAgICAgICBvdXRbOF0gPSBiMjI7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWF0cml4MmQucHJvdG90eXBlLnNldFRvTXVsdDJkID0gZnVuY3Rpb24gKHB0LCBsdCkge1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gdGhpcy5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYSA9IHB0Lm1hdDMsIGIgPSBsdC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSwgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XSwgYjAwID0gYlswXSwgYjAxID0gYlsxXSwgYjAyID0gYlsyXSwgYjEwID0gYlszXSwgYjExID0gYls0XSwgYjEyID0gYls1XSwgYjIwID0gYls2XSwgYjIxID0gYls3XSwgYjIyID0gYls4XTtcclxuICAgICAgICAgICAgb3V0WzBdID0gYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbMV0gPSBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFsyXSA9IGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMjtcclxuICAgICAgICAgICAgb3V0WzNdID0gYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbNF0gPSBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs1XSA9IGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMjtcclxuICAgICAgICAgICAgb3V0WzZdID0gYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwO1xyXG4gICAgICAgICAgICBvdXRbN10gPSBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjE7XHJcbiAgICAgICAgICAgIG91dFs4XSA9IGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMjtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXRyaXgyZC5JREVOVElUWSA9IG5ldyBNYXRyaXgyZCgpO1xyXG4gICAgICAgIE1hdHJpeDJkLlRFTVBfTUFUUklYID0gbmV3IE1hdHJpeDJkKCk7XHJcbiAgICAgICAgcmV0dXJuIE1hdHJpeDJkO1xyXG4gICAgfSgpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCA9IE1hdHJpeDJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1IYWNrKHBhcmVudFRyYW5zZm9ybSkge1xyXG4gICAgICAgIHZhciBwcm9qID0gdGhpcy5wcm9qO1xyXG4gICAgICAgIHZhciB0YSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHB3aWQgPSBwYXJlbnRUcmFuc2Zvcm0uX3dvcmxkSUQ7XHJcbiAgICAgICAgdmFyIGx0ID0gdGEubG9jYWxUcmFuc2Zvcm07XHJcbiAgICAgICAgaWYgKHRhLl9sb2NhbElEICE9PSB0YS5fY3VycmVudExvY2FsSUQpIHtcclxuICAgICAgICAgICAgbHQuYSA9IHRhLl9jeCAqIHRhLnNjYWxlLl94O1xyXG4gICAgICAgICAgICBsdC5iID0gdGEuX3N4ICogdGEuc2NhbGUuX3g7XHJcbiAgICAgICAgICAgIGx0LmMgPSB0YS5fY3kgKiB0YS5zY2FsZS5feTtcclxuICAgICAgICAgICAgbHQuZCA9IHRhLl9zeSAqIHRhLnNjYWxlLl95O1xyXG4gICAgICAgICAgICBsdC50eCA9IHRhLnBvc2l0aW9uLl94IC0gKCh0YS5waXZvdC5feCAqIGx0LmEpICsgKHRhLnBpdm90Ll95ICogbHQuYykpO1xyXG4gICAgICAgICAgICBsdC50eSA9IHRhLnBvc2l0aW9uLl95IC0gKCh0YS5waXZvdC5feCAqIGx0LmIpICsgKHRhLnBpdm90Ll95ICogbHQuZCkpO1xyXG4gICAgICAgICAgICB0YS5fY3VycmVudExvY2FsSUQgPSB0YS5fbG9jYWxJRDtcclxuICAgICAgICAgICAgcHJvai5fY3VycmVudFByb2pJRCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgX21hdHJpeElEID0gcHJvai5fcHJvaklEO1xyXG4gICAgICAgIGlmIChwcm9qLl9jdXJyZW50UHJvaklEICE9PSBfbWF0cml4SUQpIHtcclxuICAgICAgICAgICAgcHJvai5fY3VycmVudFByb2pJRCA9IF9tYXRyaXhJRDtcclxuICAgICAgICAgICAgaWYgKF9tYXRyaXhJRCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcHJvai5sb2NhbC5zZXRUb011bHRMZWdhY3kobHQsIHByb2oubWF0cml4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb2oubG9jYWwuY29weUZyb20obHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhLl9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGEuX3BhcmVudElEICE9PSBwd2lkKSB7XHJcbiAgICAgICAgICAgIHZhciBwcCA9IHBhcmVudFRyYW5zZm9ybS5wcm9qO1xyXG4gICAgICAgICAgICBpZiAocHAgJiYgIXBwLmFmZmluZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvai53b3JsZC5zZXRUb011bHQyZChwcC53b3JsZCwgcHJvai5sb2NhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qLndvcmxkLnNldFRvTXVsdExlZ2FjeShwYXJlbnRUcmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0sIHByb2oubG9jYWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb2oud29ybGQuY29weSh0YS53b3JsZFRyYW5zZm9ybSwgcHJvai5fYWZmaW5lKTtcclxuICAgICAgICAgICAgdGEuX3BhcmVudElEID0gcHdpZDtcclxuICAgICAgICAgICAgdGEuX3dvcmxkSUQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgdDAgPSBuZXcgUElYSS5Qb2ludCgpO1xyXG4gICAgdmFyIHR0ID0gW25ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCldO1xyXG4gICAgdmFyIHRlbXBSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKCk7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgIHZhciBQcm9qZWN0aW9uMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhQcm9qZWN0aW9uMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdGlvbjJkKGxlZ2FjeSwgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGxlZ2FjeSwgZW5hYmxlKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5tYXRyaXggPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIF90aGlzLmxvY2FsID0gbmV3IHBpeGlfcHJvamVjdGlvbi5NYXRyaXgyZCgpO1xyXG4gICAgICAgICAgICBfdGhpcy53b3JsZCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb2pJRCA9IDA7XHJcbiAgICAgICAgICAgIF90aGlzLl9jdXJyZW50UHJvaklEID0gLTE7XHJcbiAgICAgICAgICAgIF90aGlzLl9hZmZpbmUgPSBwaXhpX3Byb2plY3Rpb24uQUZGSU5FLk5PTkU7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb24yZC5wcm90b3R5cGUsIFwiYWZmaW5lXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWZmaW5lO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FmZmluZSA9PSB2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hZmZpbmUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb2plY3Rpb24yZC5wcm90b3R5cGUsIFwiZW5hYmxlZFwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuX2VuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS51cGRhdGVUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1IYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVnYWN5Ll9wYXJlbnRJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdhY3kudXBkYXRlVHJhbnNmb3JtID0gUElYSS5UcmFuc2Zvcm1TdGF0aWMucHJvdG90eXBlLnVwZGF0ZVRyYW5zZm9ybTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ2FjeS5fcGFyZW50SUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5zZXRBeGlzWCA9IGZ1bmN0aW9uIChwLCBmYWN0b3IpIHtcclxuICAgICAgICAgICAgaWYgKGZhY3RvciA9PT0gdm9pZCAwKSB7IGZhY3RvciA9IDE7IH1cclxuICAgICAgICAgICAgdmFyIHggPSBwLngsIHkgPSBwLnk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgICAgICAgICB2YXIgbWF0MyA9IHRoaXMubWF0cml4Lm1hdDM7XHJcbiAgICAgICAgICAgIG1hdDNbMF0gPSB4IC8gZDtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHkgLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gZmFjdG9yIC8gZDtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEKys7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0aW9uMmQucHJvdG90eXBlLnNldEF4aXNZID0gZnVuY3Rpb24gKHAsIGZhY3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yID09PSB2b2lkIDApIHsgZmFjdG9yID0gMTsgfVxyXG4gICAgICAgICAgICB2YXIgeCA9IHAueCwgeSA9IHAueTtcclxuICAgICAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXRyaXgubWF0MztcclxuICAgICAgICAgICAgbWF0M1szXSA9IHggLyBkO1xyXG4gICAgICAgICAgICBtYXQzWzRdID0geSAvIGQ7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSBmYWN0b3IgLyBkO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUubWFwU3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSwgcXVhZCkge1xyXG4gICAgICAgICAgICB2YXIgdGV4ID0gc3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnggPSAtc3ByaXRlLmFuY2hvci54ICogdGV4Lm9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBSZWN0LnkgPSAtc3ByaXRlLmFuY2hvci55ICogdGV4Lm9yaWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC53aWR0aCA9IHRleC5vcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZXgub3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcFF1YWQodGVtcFJlY3QsIHF1YWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdGlvbjJkLnByb3RvdHlwZS5tYXBRdWFkID0gZnVuY3Rpb24gKHJlY3QsIHApIHtcclxuICAgICAgICAgICAgdHRbMF0uc2V0KHJlY3QueCwgcmVjdC55KTtcclxuICAgICAgICAgICAgdHRbMV0uc2V0KHJlY3QueCArIHJlY3Qud2lkdGgsIHJlY3QueSk7XHJcbiAgICAgICAgICAgIHR0WzJdLnNldChyZWN0LnggKyByZWN0LndpZHRoLCByZWN0LnkgKyByZWN0LmhlaWdodCk7XHJcbiAgICAgICAgICAgIHR0WzNdLnNldChyZWN0LngsIHJlY3QueSArIHJlY3QuaGVpZ2h0KTtcclxuICAgICAgICAgICAgdmFyIGsxID0gMSwgazIgPSAyLCBrMyA9IDM7XHJcbiAgICAgICAgICAgIHZhciBmID0gcGl4aV9wcm9qZWN0aW9uLnV0aWxzLmdldEludGVyc2VjdGlvbkZhY3RvcihwWzBdLCBwWzJdLCBwWzFdLCBwWzNdLCB0MCk7XHJcbiAgICAgICAgICAgIGlmIChmICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBrMSA9IDE7XHJcbiAgICAgICAgICAgICAgICBrMiA9IDM7XHJcbiAgICAgICAgICAgICAgICBrMyA9IDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGQwID0gTWF0aC5zcXJ0KChwWzBdLnggLSB0MC54KSAqIChwWzBdLnggLSB0MC54KSArIChwWzBdLnkgLSB0MC55KSAqIChwWzBdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBkMSA9IE1hdGguc3FydCgocFtrMV0ueCAtIHQwLngpICogKHBbazFdLnggLSB0MC54KSArIChwW2sxXS55IC0gdDAueSkgKiAocFtrMV0ueSAtIHQwLnkpKTtcclxuICAgICAgICAgICAgdmFyIGQyID0gTWF0aC5zcXJ0KChwW2syXS54IC0gdDAueCkgKiAocFtrMl0ueCAtIHQwLngpICsgKHBbazJdLnkgLSB0MC55KSAqIChwW2syXS55IC0gdDAueSkpO1xyXG4gICAgICAgICAgICB2YXIgZDMgPSBNYXRoLnNxcnQoKHBbazNdLnggLSB0MC54KSAqIChwW2szXS54IC0gdDAueCkgKyAocFtrM10ueSAtIHQwLnkpICogKHBbazNdLnkgLSB0MC55KSk7XHJcbiAgICAgICAgICAgIHZhciBxMCA9IChkMCArIGQzKSAvIGQzO1xyXG4gICAgICAgICAgICB2YXIgcTEgPSAoZDEgKyBkMikgLyBkMjtcclxuICAgICAgICAgICAgdmFyIHEyID0gKGQxICsgZDIpIC8gZDE7XHJcbiAgICAgICAgICAgIHZhciBtYXQzID0gdGhpcy5tYXRyaXgubWF0MztcclxuICAgICAgICAgICAgbWF0M1swXSA9IHR0WzBdLnggKiBxMDtcclxuICAgICAgICAgICAgbWF0M1sxXSA9IHR0WzBdLnkgKiBxMDtcclxuICAgICAgICAgICAgbWF0M1syXSA9IHEwO1xyXG4gICAgICAgICAgICBtYXQzWzNdID0gdHRbazFdLnggKiBxMTtcclxuICAgICAgICAgICAgbWF0M1s0XSA9IHR0W2sxXS55ICogcTE7XHJcbiAgICAgICAgICAgIG1hdDNbNV0gPSBxMTtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHR0W2syXS54ICogcTI7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSB0dFtrMl0ueSAqIHEyO1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gcTI7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4LmludmVydCgpO1xyXG4gICAgICAgICAgICBtYXQzID0gdGVtcE1hdC5tYXQzO1xyXG4gICAgICAgICAgICBtYXQzWzBdID0gcFswXS54O1xyXG4gICAgICAgICAgICBtYXQzWzFdID0gcFswXS55O1xyXG4gICAgICAgICAgICBtYXQzWzJdID0gMTtcclxuICAgICAgICAgICAgbWF0M1szXSA9IHBbazFdLng7XHJcbiAgICAgICAgICAgIG1hdDNbNF0gPSBwW2sxXS55O1xyXG4gICAgICAgICAgICBtYXQzWzVdID0gMTtcclxuICAgICAgICAgICAgbWF0M1s2XSA9IHBbazJdLng7XHJcbiAgICAgICAgICAgIG1hdDNbN10gPSBwW2syXS55O1xyXG4gICAgICAgICAgICBtYXQzWzhdID0gMTtcclxuICAgICAgICAgICAgdGhpcy5tYXRyaXguc2V0VG9NdWx0MmQodGVtcE1hdCwgdGhpcy5tYXRyaXgpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qSUQrKztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rpb24yZC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQcm9qSUQgPSAtMTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvaklEID0gMDtcclxuICAgICAgICAgICAgdGhpcy5tYXRyaXguaWRlbnRpdHkoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0aW9uMmQ7XHJcbiAgICB9KHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkID0gUHJvamVjdGlvbjJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTWVzaDJkID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICBfX2V4dGVuZHMoTWVzaDJkLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIE1lc2gyZCh0ZXh0dXJlLCB2ZXJ0aWNlcywgdXZzLCBpbmRpY2VzLCBkcmF3TW9kZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0dXJlLCB2ZXJ0aWNlcywgdXZzLCBpbmRpY2VzLCBkcmF3TW9kZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgX3RoaXMucHJvaiA9IG5ldyBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbjJkKF90aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIF90aGlzLnBsdWdpbk5hbWUgPSAnbWVzaDJkJztcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVzaDJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIE1lc2gyZDtcclxuICAgIH0oUElYSS5tZXNoLk1lc2gpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5NZXNoMmQgPSBNZXNoMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxudmFyIHBpeGlfcHJvamVjdGlvbjtcclxuKGZ1bmN0aW9uIChwaXhpX3Byb2plY3Rpb24pIHtcclxuICAgIHZhciBzaGFkZXJWZXJ0ID0gXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHRyYW5zbGF0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyB1VHJhbnNmb3JtO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24ueHl3ID0gcHJvamVjdGlvbk1hdHJpeCAqIHRyYW5zbGF0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uLnogPSAwLjA7XFxuXFxuICAgIHZUZXh0dXJlQ29vcmQgPSAodVRyYW5zZm9ybSAqIHZlYzMoYVRleHR1cmVDb29yZCwgMS4wKSkueHk7XFxufVxcblwiO1xyXG4gICAgdmFyIHNoYWRlckZyYWcgPSBcIlxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gdmVjNCB1Q29sb3I7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpICogdUNvbG9yO1xcbn1cIjtcclxuICAgIHZhciBNZXNoMmRSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKE1lc2gyZFJlbmRlcmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIE1lc2gyZFJlbmRlcmVyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE1lc2gyZFJlbmRlcmVyLnByb3RvdHlwZS5vbkNvbnRleHRDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBnbCA9IHRoaXMucmVuZGVyZXIuZ2w7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhZGVyID0gbmV3IFBJWEkuU2hhZGVyKGdsLCBzaGFkZXJWZXJ0LCBzaGFkZXJGcmFnKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBNZXNoMmRSZW5kZXJlcjtcclxuICAgIH0oUElYSS5tZXNoLk1lc2hSZW5kZXJlcikpO1xyXG4gICAgcGl4aV9wcm9qZWN0aW9uLk1lc2gyZFJlbmRlcmVyID0gTWVzaDJkUmVuZGVyZXI7XHJcbiAgICBQSVhJLldlYkdMUmVuZGVyZXIucmVnaXN0ZXJQbHVnaW4oJ21lc2gyZCcsIE1lc2gyZFJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgUElYSS5TcHJpdGUucHJvdG90eXBlLmNvbnZlcnRUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVZlcnRpY2VzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJvdW5kcztcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZTJkJztcclxuICAgICAgICB0aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogcGl4aV9wcm9qZWN0aW9uLmNvbnRhaW5lcjJkV29ybGRUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFBJWEkubWVzaC5NZXNoLnByb3RvdHlwZS5jb252ZXJ0VG8yZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9qKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQodGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMucGx1Z2luTmFtZSA9ICdtZXNoMmQnO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIndvcmxkVHJhbnNmb3JtXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBwaXhpX3Byb2plY3Rpb24uY29udGFpbmVyMmRXb3JsZFRyYW5zZm9ybSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgUElYSS5Db250YWluZXIucHJvdG90eXBlLmNvbnZlcnRUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb2opXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IHBpeGlfcHJvamVjdGlvbi5jb250YWluZXIyZFdvcmxkVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUuY29udmVydFN1YnRyZWVUbzJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY29udmVydFRvMmQoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jb252ZXJ0U3VidHJlZVRvMmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgU3ByaXRlMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGUyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBTcHJpdGUyZCh0ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRleHR1cmUpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2ogPSBuZXcgcGl4aV9wcm9qZWN0aW9uLlByb2plY3Rpb24yZChfdGhpcy50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBfdGhpcy5wbHVnaW5OYW1lID0gJ3Nwcml0ZTJkJztcclxuICAgICAgICAgICAgX3RoaXMudmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMTIpO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNwcml0ZTJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcygpO1xyXG4gICAgICAgICAgICB0aGlzLl9ib3VuZHMuYWRkUXVhZCh0aGlzLnZlcnRleFRyaW1tZWREYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvai5fYWZmaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0ZXhEYXRhLmxlbmd0aCAhPSA4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSg4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXMuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy52ZXJ0ZXhEYXRhLmxlbmd0aCAhPSAxMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheSgxMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNmb3JtSUQgPT09IHdpZCAmJiB0aGlzLl90ZXh0dXJlSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1JRCA9IHdpZDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUlEID0gdHVpZDtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xyXG4gICAgICAgICAgICB2YXIgd3QgPSB0aGlzLnByb2oud29ybGQubWF0MztcclxuICAgICAgICAgICAgdmFyIHZlcnRleERhdGEgPSB0aGlzLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB0cmltID0gdGV4dHVyZS50cmltO1xyXG4gICAgICAgICAgICB2YXIgb3JpZyA9IHRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2FuY2hvcjtcclxuICAgICAgICAgICAgdmFyIHcwID0gMDtcclxuICAgICAgICAgICAgdmFyIHcxID0gMDtcclxuICAgICAgICAgICAgdmFyIGgwID0gMDtcclxuICAgICAgICAgICAgdmFyIGgxID0gMDtcclxuICAgICAgICAgICAgaWYgKHRyaW0pIHtcclxuICAgICAgICAgICAgICAgIHcxID0gdHJpbS54IC0gKGFuY2hvci5feCAqIG9yaWcud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIHRyaW0ud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IHRyaW0ueSAtIChhbmNob3IuX3kgKiBvcmlnLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBoMCA9IGgxICsgdHJpbS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3MSA9IC1hbmNob3IuX3ggKiBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdzAgPSB3MSArIG9yaWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBoMSA9IC1hbmNob3IuX3kgKiBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIGgwID0gaDEgKyBvcmlnLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0gKHd0WzBdICogdzEpICsgKHd0WzNdICogaDEpICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSAod3RbMV0gKiB3MSkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9ICh3dFsyXSAqIHcxKSArICh3dFs1XSAqIGgxKSArIHd0WzhdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0gKHd0WzBdICogdzApICsgKHd0WzNdICogaDEpICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSAod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9ICh3dFsyXSAqIHcwKSArICh3dFs1XSAqIGgxKSArIHd0WzhdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0gKHd0WzBdICogdzApICsgKHd0WzNdICogaDApICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSAod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMCkgKyB3dFs3XTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs4XSA9ICh3dFsyXSAqIHcwKSArICh3dFs1XSAqIGgwKSArIHd0WzhdO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzldID0gKHd0WzBdICogdzEpICsgKHd0WzNdICogaDApICsgd3RbNl07XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMTBdID0gKHd0WzFdICogdzEpICsgKHd0WzRdICogaDApICsgd3RbN107XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMTFdID0gKHd0WzJdICogdzEpICsgKHd0WzVdICogaDApICsgd3RbOF07XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qLl9hZmZpbmUpIHtcclxuICAgICAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHdpZCA9IHRoaXMudHJhbnNmb3JtLl93b3JsZElEO1xyXG4gICAgICAgICAgICB2YXIgdHVpZCA9IHRoaXMuX3RleHR1cmUuX3VwZGF0ZUlEO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmVydGV4VHJpbW1lZERhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4VHJpbW1lZERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3RyYW5zZm9ybVRyaW1tZWRJRCA9PT0gd2lkICYmIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPT09IHR1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1UcmltbWVkSUQgPSB3aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVUcmltbWVkSUQgPSB0dWlkO1xyXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gdGhpcy52ZXJ0ZXhUcmltbWVkRGF0YTtcclxuICAgICAgICAgICAgdmFyIG9yaWcgPSB0ZXh0dXJlLm9yaWc7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcbiAgICAgICAgICAgIHZhciB3dCA9IHRoaXMucHJvai53b3JsZC5tYXQzO1xyXG4gICAgICAgICAgICB2YXIgdzEgPSAtYW5jaG9yLl94ICogb3JpZy53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHcwID0gdzEgKyBvcmlnLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgaDEgPSAtYW5jaG9yLl95ICogb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciBoMCA9IGgxICsgb3JpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHZhciB6ID0gMS4wIC8gKHd0WzJdICogdzEgKyB3dFs1XSAqIGgxICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzBdID0geiAqICgod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMSkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbMV0gPSB6ICogKCh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgxKSArIHd0WzddKTtcclxuICAgICAgICAgICAgeiA9IDEuMCAvICh3dFsyXSAqIHcwICsgd3RbNV0gKiBoMSArIHd0WzhdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVsyXSA9IHogKiAoKHd0WzBdICogdzApICsgKHd0WzNdICogaDEpICsgd3RbNl0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzNdID0geiAqICgod3RbMV0gKiB3MCkgKyAod3RbNF0gKiBoMSkgKyB3dFs3XSk7XHJcbiAgICAgICAgICAgIHogPSAxLjAgLyAod3RbMl0gKiB3MCArIHd0WzVdICogaDAgKyB3dFs4XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbNF0gPSB6ICogKCh3dFswXSAqIHcwKSArICh3dFszXSAqIGgwKSArIHd0WzZdKTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YVs1XSA9IHogKiAoKHd0WzFdICogdzApICsgKHd0WzRdICogaDApICsgd3RbN10pO1xyXG4gICAgICAgICAgICB6ID0gMS4wIC8gKHd0WzJdICogdzEgKyB3dFs1XSAqIGgwICsgd3RbOF0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhEYXRhWzZdID0geiAqICgod3RbMF0gKiB3MSkgKyAod3RbM10gKiBoMCkgKyB3dFs2XSk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGFbN10gPSB6ICogKCh3dFsxXSAqIHcxKSArICh3dFs0XSAqIGgwKSArIHd0WzddKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTcHJpdGUyZC5wcm90b3R5cGUsIFwid29ybGRUcmFuc2Zvcm1cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2ouYWZmaW5lID8gdGhpcy50cmFuc2Zvcm0ud29ybGRUcmFuc2Zvcm0gOiB0aGlzLnByb2oud29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBTcHJpdGUyZDtcclxuICAgIH0oUElYSS5TcHJpdGUpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZCA9IFNwcml0ZTJkO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIgPSBwaXhpX3Byb2plY3Rpb24ud2ViZ2wuTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXI7XHJcbiAgICB2YXIgU3ByaXRlMmRSZW5kZXJlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFNwcml0ZTJkUmVuZGVyZXIsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlMmRSZW5kZXJlcigpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLnNoYWRlclZlcnQgPSBcInByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5hdHRyaWJ1dGUgdmVjNCBhQ29sb3I7XFxuYXR0cmlidXRlIGZsb2F0IGFUZXh0dXJlSWQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWM0IHZDb2xvcjtcXG52YXJ5aW5nIGZsb2F0IHZUZXh0dXJlSWQ7XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICBnbF9Qb3NpdGlvbi54eXcgPSBwcm9qZWN0aW9uTWF0cml4ICogYVZlcnRleFBvc2l0aW9uO1xcbiAgICBnbF9Qb3NpdGlvbi56ID0gMC4wO1xcbiAgICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuICAgIHZUZXh0dXJlSWQgPSBhVGV4dHVyZUlkO1xcbiAgICB2Q29sb3IgPSBhQ29sb3I7XFxufVxcblwiO1xyXG4gICAgICAgICAgICBfdGhpcy5zaGFkZXJGcmFnID0gXCJcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgdlRleHR1cmVJZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcnNbJWNvdW50JV07XFxuXFxudm9pZCBtYWluKHZvaWQpe1xcbnZlYzQgY29sb3I7XFxudmVjMiB0ZXh0dXJlQ29vcmQgPSB2VGV4dHVyZUNvb3JkO1xcbmZsb2F0IHRleHR1cmVJZCA9IGZsb29yKHZUZXh0dXJlSWQrMC41KTtcXG4lZm9ybG9vcCVcXG5nbF9GcmFnQ29sb3IgPSBjb2xvciAqIHZDb2xvcjtcXG59XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlMmRSZW5kZXJlci5wcm90b3R5cGUuY3JlYXRlVmFvID0gZnVuY3Rpb24gKHZlcnRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRTaXplID0gNjtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0Qnl0ZVNpemUgPSB0aGlzLnZlcnRTaXplICogNDtcclxuICAgICAgICAgICAgdmFyIGdsID0gdGhpcy5yZW5kZXJlci5nbDtcclxuICAgICAgICAgICAgdmFyIHZhbyA9IHRoaXMucmVuZGVyZXIuY3JlYXRlVmFvKClcclxuICAgICAgICAgICAgICAgIC5hZGRJbmRleCh0aGlzLmluZGV4QnVmZmVyKVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFWZXJ0ZXhQb3NpdGlvbiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLnZlcnRCeXRlU2l6ZSwgMClcclxuICAgICAgICAgICAgICAgIC5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUNvb3JkLCBnbC5VTlNJR05FRF9TSE9SVCwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDMgKiA0KVxyXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZSh2ZXJ0ZXhCdWZmZXIsIGF0dHJzLmFDb2xvciwgZ2wuVU5TSUdORURfQllURSwgdHJ1ZSwgdGhpcy52ZXJ0Qnl0ZVNpemUsIDQgKiA0KTtcclxuICAgICAgICAgICAgaWYgKGF0dHJzLmFUZXh0dXJlSWQpIHtcclxuICAgICAgICAgICAgICAgIHZhby5hZGRBdHRyaWJ1dGUodmVydGV4QnVmZmVyLCBhdHRycy5hVGV4dHVyZUlkLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMudmVydEJ5dGVTaXplLCA1ICogNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbztcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZTJkUmVuZGVyZXIucHJvdG90eXBlLmZpbGxWZXJ0aWNlcyA9IGZ1bmN0aW9uIChmbG9hdDMyVmlldywgdWludDMyVmlldywgaW5kZXgsIHNwcml0ZSwgYXJnYiwgdGV4dHVyZUlkKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXhEYXRhID0gc3ByaXRlLnZlcnRleERhdGE7XHJcbiAgICAgICAgICAgIHZhciB1dnMgPSBzcHJpdGUuX3RleHR1cmUuX3V2cy51dnNVaW50MzI7XHJcbiAgICAgICAgICAgIGlmICh2ZXJ0ZXhEYXRhLmxlbmd0aCA9PT0gOCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyZXIucm91bmRQaXhlbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb2x1dGlvbiA9IHRoaXMucmVuZGVyZXIucmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleF0gPSAoKHZlcnRleERhdGFbMF0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gKCh2ZXJ0ZXhEYXRhWzFdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gKCh2ZXJ0ZXhEYXRhWzJdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA3XSA9ICgodmVydGV4RGF0YVszXSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMl0gPSAoKHZlcnRleERhdGFbNF0gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9ICgodmVydGV4RGF0YVs1XSAqIHJlc29sdXRpb24pIHwgMCkgLyByZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTRdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMThdID0gKCh2ZXJ0ZXhEYXRhWzZdICogcmVzb2x1dGlvbikgfCAwKSAvIHJlc29sdXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOV0gPSAoKHZlcnRleERhdGFbN10gKiByZXNvbHV0aW9uKSB8IDApIC8gcmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDIwXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxXSA9IHZlcnRleERhdGFbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAyXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDZdID0gdmVydGV4RGF0YVsyXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gdmVydGV4RGF0YVszXTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDhdID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTJdID0gdmVydGV4RGF0YVs0XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDEzXSA9IHZlcnRleERhdGFbNV07XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxNF0gPSAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOF0gPSB2ZXJ0ZXhEYXRhWzZdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMTldID0gdmVydGV4RGF0YVs3XTtcclxuICAgICAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDIwXSA9IDEuMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4XSA9IHZlcnRleERhdGFbMF07XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDFdID0gdmVydGV4RGF0YVsxXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMl0gPSB2ZXJ0ZXhEYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyA2XSA9IHZlcnRleERhdGFbM107XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyVmlld1tpbmRleCArIDddID0gdmVydGV4RGF0YVs0XTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgOF0gPSB2ZXJ0ZXhEYXRhWzVdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxMl0gPSB2ZXJ0ZXhEYXRhWzZdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxM10gPSB2ZXJ0ZXhEYXRhWzddO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxNF0gPSB2ZXJ0ZXhEYXRhWzhdO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOF0gPSB2ZXJ0ZXhEYXRhWzldO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQzMlZpZXdbaW5kZXggKyAxOV0gPSB2ZXJ0ZXhEYXRhWzEwXTtcclxuICAgICAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgMjBdID0gdmVydGV4RGF0YVsxMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdWludDMyVmlld1tpbmRleCArIDNdID0gdXZzWzBdO1xyXG4gICAgICAgICAgICB1aW50MzJWaWV3W2luZGV4ICsgOV0gPSB1dnNbMV07XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAxNV0gPSB1dnNbMl07XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyAyMV0gPSB1dnNbM107XHJcbiAgICAgICAgICAgIHVpbnQzMlZpZXdbaW5kZXggKyA0XSA9IHVpbnQzMlZpZXdbaW5kZXggKyAxMF0gPSB1aW50MzJWaWV3W2luZGV4ICsgMTZdID0gdWludDMyVmlld1tpbmRleCArIDIyXSA9IGFyZ2I7XHJcbiAgICAgICAgICAgIGZsb2F0MzJWaWV3W2luZGV4ICsgNV0gPSBmbG9hdDMyVmlld1tpbmRleCArIDExXSA9IGZsb2F0MzJWaWV3W2luZGV4ICsgMTddID0gZmxvYXQzMlZpZXdbaW5kZXggKyAyM10gPSB0ZXh0dXJlSWQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gU3ByaXRlMmRSZW5kZXJlcjtcclxuICAgIH0oTXVsdGlUZXh0dXJlU3ByaXRlUmVuZGVyZXIpKTtcclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignc3ByaXRlMmQnLCBTcHJpdGUyZFJlbmRlcmVyKTtcclxufSkocGl4aV9wcm9qZWN0aW9uIHx8IChwaXhpX3Byb2plY3Rpb24gPSB7fSkpO1xyXG52YXIgcGl4aV9wcm9qZWN0aW9uO1xyXG4oZnVuY3Rpb24gKHBpeGlfcHJvamVjdGlvbikge1xyXG4gICAgdmFyIFRleHQyZCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgX19leHRlbmRzKFRleHQyZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBUZXh0MmQodGV4dCwgc3R5bGUsIGNhbnZhcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0ZXh0LCBzdHlsZSwgY2FudmFzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qID0gbmV3IHBpeGlfcHJvamVjdGlvbi5Qcm9qZWN0aW9uMmQoX3RoaXMudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgX3RoaXMucGx1Z2luTmFtZSA9ICdzcHJpdGUyZCc7XHJcbiAgICAgICAgICAgIF90aGlzLnZlcnRleERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KDEyKTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dDJkLnByb3RvdHlwZSwgXCJ3b3JsZFRyYW5zZm9ybVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvai5hZmZpbmUgPyB0aGlzLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSA6IHRoaXMucHJvai53b3JsZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIFRleHQyZDtcclxuICAgIH0oUElYSS5UZXh0KSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uVGV4dDJkID0gVGV4dDJkO1xyXG4gICAgVGV4dDJkLnByb3RvdHlwZS5jYWxjdWxhdGVWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVmVydGljZXM7XHJcbiAgICBUZXh0MmQucHJvdG90eXBlLmNhbGN1bGF0ZVRyaW1tZWRWZXJ0aWNlcyA9IHBpeGlfcHJvamVjdGlvbi5TcHJpdGUyZC5wcm90b3R5cGUuY2FsY3VsYXRlVHJpbW1lZFZlcnRpY2VzO1xyXG4gICAgVGV4dDJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzID0gcGl4aV9wcm9qZWN0aW9uLlNwcml0ZTJkLnByb3RvdHlwZS5fY2FsY3VsYXRlQm91bmRzO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgUHJvamVjdGlvbnNNYW5hZ2VyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0aW9uc01hbmFnZXIocmVuZGVyZXIpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5vbkNvbnRleHRDaGFuZ2UgPSBmdW5jdGlvbiAoZ2wpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmdsID0gZ2w7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yZW5kZXJlci5tYXNrTWFuYWdlci5wdXNoU3ByaXRlTWFzayA9IHB1c2hTcHJpdGVNYXNrO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLm9uKCdjb250ZXh0JywgdGhpcy5vbkNvbnRleHRDaGFuZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBQcm9qZWN0aW9uc01hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIub2ZmKCdjb250ZXh0JywgdGhpcy5vbkNvbnRleHRDaGFuZ2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3Rpb25zTWFuYWdlcjtcclxuICAgIH0oKSk7XHJcbiAgICBwaXhpX3Byb2plY3Rpb24uUHJvamVjdGlvbnNNYW5hZ2VyID0gUHJvamVjdGlvbnNNYW5hZ2VyO1xyXG4gICAgZnVuY3Rpb24gcHVzaFNwcml0ZU1hc2sodGFyZ2V0LCBtYXNrRGF0YSkge1xyXG4gICAgICAgIHZhciBhbHBoYU1hc2tGaWx0ZXIgPSB0aGlzLmFscGhhTWFza1Bvb2xbdGhpcy5hbHBoYU1hc2tJbmRleF07XHJcbiAgICAgICAgaWYgKCFhbHBoYU1hc2tGaWx0ZXIpIHtcclxuICAgICAgICAgICAgYWxwaGFNYXNrRmlsdGVyID0gdGhpcy5hbHBoYU1hc2tQb29sW3RoaXMuYWxwaGFNYXNrSW5kZXhdID0gW25ldyBwaXhpX3Byb2plY3Rpb24uU3ByaXRlTWFza0ZpbHRlcjJkKG1hc2tEYXRhKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFscGhhTWFza0ZpbHRlclswXS5yZXNvbHV0aW9uID0gdGhpcy5yZW5kZXJlci5yZXNvbHV0aW9uO1xyXG4gICAgICAgIGFscGhhTWFza0ZpbHRlclswXS5tYXNrU3ByaXRlID0gbWFza0RhdGE7XHJcbiAgICAgICAgdGFyZ2V0LmZpbHRlckFyZWEgPSBtYXNrRGF0YS5nZXRCb3VuZHModHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5maWx0ZXJNYW5hZ2VyLnB1c2hGaWx0ZXIodGFyZ2V0LCBhbHBoYU1hc2tGaWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuYWxwaGFNYXNrSW5kZXgrKztcclxuICAgIH1cclxuICAgIFBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbigncHJvamVjdGlvbnMnLCBQcm9qZWN0aW9uc01hbmFnZXIpO1xyXG59KShwaXhpX3Byb2plY3Rpb24gfHwgKHBpeGlfcHJvamVjdGlvbiA9IHt9KSk7XHJcbnZhciBwaXhpX3Byb2plY3Rpb247XHJcbihmdW5jdGlvbiAocGl4aV9wcm9qZWN0aW9uKSB7XHJcbiAgICB2YXIgc3ByaXRlTWFza1ZlcnQgPSBcIlxcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcbnVuaWZvcm0gbWF0MyBvdGhlck1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzMgdk1hc2tDb29yZDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuXFx0Z2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuXFxuXFx0dlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuXFx0dk1hc2tDb29yZCA9IG90aGVyTWF0cml4ICogdmVjMyggYVRleHR1cmVDb29yZCwgMS4wKTtcXG59XFxuXCI7XHJcbiAgICB2YXIgc3ByaXRlTWFza0ZyYWcgPSBcIlxcbnZhcnlpbmcgdmVjMyB2TWFza0Nvb3JkO1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYWxwaGE7XFxudW5pZm9ybSBzYW1wbGVyMkQgbWFzaztcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIHZlYzIgdXYgPSB2TWFza0Nvb3JkLnh5IC8gdk1hc2tDb29yZC56O1xcbiAgICBcXG4gICAgdmVjMiB0ZXh0ID0gYWJzKCB1diAtIDAuNSApO1xcbiAgICB0ZXh0ID0gc3RlcCgwLjUsIHRleHQpO1xcblxcbiAgICBmbG9hdCBjbGlwID0gMS4wIC0gbWF4KHRleHQueSwgdGV4dC54KTtcXG4gICAgdmVjNCBvcmlnaW5hbCA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuICAgIHZlYzQgbWFza3kgPSB0ZXh0dXJlMkQobWFzaywgdXYpO1xcblxcbiAgICBvcmlnaW5hbCAqPSAobWFza3kuciAqIG1hc2t5LmEgKiBhbHBoYSAqIGNsaXApO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBvcmlnaW5hbDtcXG59XFxuXCI7XHJcbiAgICB2YXIgdGVtcE1hdCA9IG5ldyBwaXhpX3Byb2plY3Rpb24uTWF0cml4MmQoKTtcclxuICAgIHZhciBTcHJpdGVNYXNrRmlsdGVyMmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhTcHJpdGVNYXNrRmlsdGVyMmQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gU3ByaXRlTWFza0ZpbHRlcjJkKHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzcHJpdGVNYXNrVmVydCwgc3ByaXRlTWFza0ZyYWcpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLm1hc2tNYXRyaXggPSBuZXcgcGl4aV9wcm9qZWN0aW9uLk1hdHJpeDJkKCk7XHJcbiAgICAgICAgICAgIHNwcml0ZS5yZW5kZXJhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF90aGlzLm1hc2tTcHJpdGUgPSBzcHJpdGU7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3ByaXRlTWFza0ZpbHRlcjJkLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChmaWx0ZXJNYW5hZ2VyLCBpbnB1dCwgb3V0cHV0LCBjbGVhciwgY3VycmVudFN0YXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXNrU3ByaXRlID0gdGhpcy5tYXNrU3ByaXRlO1xyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1zLm1hc2sgPSBtYXNrU3ByaXRlLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybXMub3RoZXJNYXRyaXggPSBTcHJpdGVNYXNrRmlsdGVyMmQuY2FsY3VsYXRlU3ByaXRlTWF0cml4KGN1cnJlbnRTdGF0ZSwgdGhpcy5tYXNrTWF0cml4LCBtYXNrU3ByaXRlKTtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3Jtcy5hbHBoYSA9IG1hc2tTcHJpdGUud29ybGRBbHBoYTtcclxuICAgICAgICAgICAgZmlsdGVyTWFuYWdlci5hcHBseUZpbHRlcih0aGlzLCBpbnB1dCwgb3V0cHV0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFNwcml0ZU1hc2tGaWx0ZXIyZC5jYWxjdWxhdGVTcHJpdGVNYXRyaXggPSBmdW5jdGlvbiAoY3VycmVudFN0YXRlLCBtYXBwZWRNYXRyaXgsIHNwcml0ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvaiA9IHNwcml0ZS5wcm9qO1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyQXJlYSA9IGN1cnJlbnRTdGF0ZS5zb3VyY2VGcmFtZTtcclxuICAgICAgICAgICAgdmFyIHRleHR1cmVTaXplID0gY3VycmVudFN0YXRlLnJlbmRlclRhcmdldC5zaXplO1xyXG4gICAgICAgICAgICB2YXIgd29ybGRUcmFuc2Zvcm0gPSBwcm9qICYmICFwcm9qLl9hZmZpbmUgPyBwcm9qLndvcmxkLmNvcHlUbyh0ZW1wTWF0KSA6IHRlbXBNYXQuY29weUZyb20oc3ByaXRlLnRyYW5zZm9ybS53b3JsZFRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0dXJlID0gc3ByaXRlLnRleHR1cmUub3JpZztcclxuICAgICAgICAgICAgbWFwcGVkTWF0cml4LnNldCh0ZXh0dXJlU2l6ZS53aWR0aCwgMCwgMCwgdGV4dHVyZVNpemUuaGVpZ2h0LCBmaWx0ZXJBcmVhLngsIGZpbHRlckFyZWEueSk7XHJcbiAgICAgICAgICAgIHdvcmxkVHJhbnNmb3JtLmludmVydCgpO1xyXG4gICAgICAgICAgICBtYXBwZWRNYXRyaXguc2V0VG9NdWx0MmQod29ybGRUcmFuc2Zvcm0sIG1hcHBlZE1hdHJpeCk7XHJcbiAgICAgICAgICAgIG1hcHBlZE1hdHJpeC5zY2FsZUFuZFRyYW5zbGF0ZSgxLjAgLyB0ZXh0dXJlLndpZHRoLCAxLjAgLyB0ZXh0dXJlLmhlaWdodCwgc3ByaXRlLmFuY2hvci54LCBzcHJpdGUuYW5jaG9yLnkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbWFwcGVkTWF0cml4O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFNwcml0ZU1hc2tGaWx0ZXIyZDtcclxuICAgIH0oUElYSS5GaWx0ZXIpKTtcclxuICAgIHBpeGlfcHJvamVjdGlvbi5TcHJpdGVNYXNrRmlsdGVyMmQgPSBTcHJpdGVNYXNrRmlsdGVyMmQ7XHJcbn0pKHBpeGlfcHJvamVjdGlvbiB8fCAocGl4aV9wcm9qZWN0aW9uID0ge30pKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGl4aS1wcm9qZWN0aW9uLmpzLm1hcCIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qIVxuICogcGl4aS1zb3VuZCAtIHYyLjAuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL3BpeGlqcy9waXhpLXNvdW5kXG4gKiBDb21waWxlZCBUdWUsIDE0IE5vdiAyMDE3IDE3OjUzOjQ3IFVUQ1xuICpcbiAqIHBpeGktc291bmQgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KGUuX19waXhpU291bmQ9ZS5fX3BpeGlTb3VuZHx8e30pfSh0aGlzLGZ1bmN0aW9uKGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHQoZSx0KXtmdW5jdGlvbiBuKCl7dGhpcy5jb25zdHJ1Y3Rvcj1lfW8oZSx0KSxlLnByb3RvdHlwZT1udWxsPT09dD9PYmplY3QuY3JlYXRlKHQpOihuLnByb3RvdHlwZT10LnByb3RvdHlwZSxuZXcgbil9aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFBJWEkpdGhyb3dcIlBpeGlKUyByZXF1aXJlZFwiO3ZhciBuPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMuX291dHB1dD10LHRoaXMuX2lucHV0PWV9cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImRlc3RpbmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pbnB1dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcztpZih0aGlzLl9maWx0ZXJzJiYodGhpcy5fZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UmJmUuZGlzY29ubmVjdCgpfSksdGhpcy5fZmlsdGVycz1udWxsLHRoaXMuX2lucHV0LmNvbm5lY3QodGhpcy5fb3V0cHV0KSksZSYmZS5sZW5ndGgpe3RoaXMuX2ZpbHRlcnM9ZS5zbGljZSgwKSx0aGlzLl9pbnB1dC5kaXNjb25uZWN0KCk7dmFyIG49bnVsbDtlLmZvckVhY2goZnVuY3Rpb24oZSl7bnVsbD09PW4/dC5faW5wdXQuY29ubmVjdChlLmRlc3RpbmF0aW9uKTpuLmNvbm5lY3QoZS5kZXN0aW5hdGlvbiksbj1lfSksbi5jb25uZWN0KHRoaXMuX291dHB1dCl9fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLmZpbHRlcnM9bnVsbCx0aGlzLl9pbnB1dD1udWxsLHRoaXMuX291dHB1dD1udWxsfSxlfSgpLG89T2JqZWN0LnNldFByb3RvdHlwZU9mfHx7X19wcm90b19fOltdfWluc3RhbmNlb2YgQXJyYXkmJmZ1bmN0aW9uKGUsdCl7ZS5fX3Byb3RvX189dH18fGZ1bmN0aW9uKGUsdCl7Zm9yKHZhciBuIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShuKSYmKGVbbl09dFtuXSl9LGk9MCxyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dmFyIG49ZS5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiBuLmlkPWkrKyxuLmluaXQodCksbn1yZXR1cm4gdChuLGUpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInByb2dyZXNzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2UuY3VycmVudFRpbWUvdGhpcy5fZHVyYXRpb259LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGF1c2VkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWR9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYXVzZWQ9ZSx0aGlzLnJlZnJlc2hQYXVzZWQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5fb25QbGF5PWZ1bmN0aW9uKCl7dGhpcy5fcGxheWluZz0hMH0sbi5wcm90b3R5cGUuX29uUGF1c2U9ZnVuY3Rpb24oKXt0aGlzLl9wbGF5aW5nPSExfSxuLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGUpe3RoaXMuX3BsYXlpbmc9ITEsdGhpcy5fZHVyYXRpb249ZS5zb3VyY2UuZHVyYXRpb247dmFyIHQ9dGhpcy5fc291cmNlPWUuc291cmNlLmNsb25lTm9kZSghMSk7dC5zcmM9ZS5wYXJlbnQudXJsLHQub25wbGF5PXRoaXMuX29uUGxheS5iaW5kKHRoaXMpLHQub25wYXVzZT10aGlzLl9vblBhdXNlLmJpbmQodGhpcyksZS5jb250ZXh0Lm9uKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSxlLmNvbnRleHQub24oXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpLHRoaXMuX21lZGlhPWV9LG4ucHJvdG90eXBlLl9pbnRlcm5hbFN0b3A9ZnVuY3Rpb24oKXt0aGlzLl9zb3VyY2UmJnRoaXMuX3BsYXlpbmcmJih0aGlzLl9zb3VyY2Uub25lbmRlZD1udWxsLHRoaXMuX3NvdXJjZS5wYXVzZSgpKX0sbi5wcm90b3R5cGUuc3RvcD1mdW5jdGlvbigpe3RoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuX3NvdXJjZSYmdGhpcy5lbWl0KFwic3RvcFwiKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic3BlZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NwZWVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fc3BlZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJ2b2x1bWVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3ZvbHVtZT1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImxvb3BcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xvb3B9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9sb29wPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibXV0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX211dGVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbXV0ZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudDt0aGlzLl9zb3VyY2UubG9vcD10aGlzLl9sb29wfHx0Lmxvb3A7dmFyIG49ZS52b2x1bWUqKGUubXV0ZWQ/MDoxKSxvPXQudm9sdW1lKih0Lm11dGVkPzA6MSksaT10aGlzLl92b2x1bWUqKHRoaXMuX211dGVkPzA6MSk7dGhpcy5fc291cmNlLnZvbHVtZT1pKm4qbyx0aGlzLl9zb3VyY2UucGxheWJhY2tSYXRlPXRoaXMuX3NwZWVkKmUuc3BlZWQqdC5zcGVlZH0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQsbj10aGlzLl9wYXVzZWR8fHQucGF1c2VkfHxlLnBhdXNlZDtuIT09dGhpcy5fcGF1c2VkUmVhbCYmKHRoaXMuX3BhdXNlZFJlYWw9bixuPyh0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJwYXVzZWRcIikpOih0aGlzLmVtaXQoXCJyZXN1bWVkXCIpLHRoaXMucGxheSh7c3RhcnQ6dGhpcy5fc291cmNlLmN1cnJlbnRUaW1lLGVuZDp0aGlzLl9lbmQsdm9sdW1lOnRoaXMuX3ZvbHVtZSxzcGVlZDp0aGlzLl9zcGVlZCxsb29wOnRoaXMuX2xvb3B9KSksdGhpcy5lbWl0KFwicGF1c2VcIixuKSl9LG4ucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxvPWUuc3RhcnQsaT1lLmVuZCxyPWUuc3BlZWQscz1lLmxvb3AsdT1lLnZvbHVtZSxhPWUubXV0ZWQ7aSYmY29uc29sZS5hc3NlcnQoaT5vLFwiRW5kIHRpbWUgaXMgYmVmb3JlIHN0YXJ0IHRpbWVcIiksdGhpcy5fc3BlZWQ9cix0aGlzLl92b2x1bWU9dSx0aGlzLl9sb29wPSEhcyx0aGlzLl9tdXRlZD1hLHRoaXMucmVmcmVzaCgpLHRoaXMubG9vcCYmbnVsbCE9PWkmJihjb25zb2xlLndhcm4oJ0xvb3Bpbmcgbm90IHN1cHBvcnQgd2hlbiBzcGVjaWZ5aW5nIGFuIFwiZW5kXCIgdGltZScpLHRoaXMubG9vcD0hMSksdGhpcy5fc3RhcnQ9byx0aGlzLl9lbmQ9aXx8dGhpcy5fZHVyYXRpb24sdGhpcy5fc3RhcnQ9TWF0aC5tYXgoMCx0aGlzLl9zdGFydC1uLlBBRERJTkcpLHRoaXMuX2VuZD1NYXRoLm1pbih0aGlzLl9lbmQrbi5QQURESU5HLHRoaXMuX2R1cmF0aW9uKSx0aGlzLl9zb3VyY2Uub25sb2FkZWRtZXRhZGF0YT1mdW5jdGlvbigpe3QuX3NvdXJjZSYmKHQuX3NvdXJjZS5jdXJyZW50VGltZT1vLHQuX3NvdXJjZS5vbmxvYWRlZG1ldGFkYXRhPW51bGwsdC5lbWl0KFwicHJvZ3Jlc3NcIixvLHQuX2R1cmF0aW9uKSxQSVhJLnRpY2tlci5zaGFyZWQuYWRkKHQuX29uVXBkYXRlLHQpKX0sdGhpcy5fc291cmNlLm9uZW5kZWQ9dGhpcy5fb25Db21wbGV0ZS5iaW5kKHRoaXMpLHRoaXMuX3NvdXJjZS5wbGF5KCksdGhpcy5lbWl0KFwic3RhcnRcIil9LG4ucHJvdG90eXBlLl9vblVwZGF0ZT1mdW5jdGlvbigpe3RoaXMuZW1pdChcInByb2dyZXNzXCIsdGhpcy5wcm9ncmVzcyx0aGlzLl9kdXJhdGlvbiksdGhpcy5fc291cmNlLmN1cnJlbnRUaW1lPj10aGlzLl9lbmQmJiF0aGlzLl9zb3VyY2UubG9vcCYmdGhpcy5fb25Db21wbGV0ZSgpfSxuLnByb3RvdHlwZS5fb25Db21wbGV0ZT1mdW5jdGlvbigpe1BJWEkudGlja2VyLnNoYXJlZC5yZW1vdmUodGhpcy5fb25VcGRhdGUsdGhpcyksdGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwicHJvZ3Jlc3NcIiwxLHRoaXMuX2R1cmF0aW9uKSx0aGlzLmVtaXQoXCJlbmRcIix0aGlzKX0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe1BJWEkudGlja2VyLnNoYXJlZC5yZW1vdmUodGhpcy5fb25VcGRhdGUsdGhpcyksdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTt2YXIgZT10aGlzLl9zb3VyY2U7ZSYmKGUub25lbmRlZD1udWxsLGUub25wbGF5PW51bGwsZS5vbnBhdXNlPW51bGwsdGhpcy5faW50ZXJuYWxTdG9wKCkpLHRoaXMuX3NvdXJjZT1udWxsLHRoaXMuX3NwZWVkPTEsdGhpcy5fdm9sdW1lPTEsdGhpcy5fbG9vcD0hMSx0aGlzLl9lbmQ9bnVsbCx0aGlzLl9zdGFydD0wLHRoaXMuX2R1cmF0aW9uPTAsdGhpcy5fcGxheWluZz0hMSx0aGlzLl9wYXVzZWRSZWFsPSExLHRoaXMuX3BhdXNlZD0hMSx0aGlzLl9tdXRlZD0hMSx0aGlzLl9tZWRpYSYmKHRoaXMuX21lZGlhLmNvbnRleHQub2ZmKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSx0aGlzLl9tZWRpYS5jb250ZXh0Lm9mZihcInJlZnJlc2hQYXVzZWRcIix0aGlzLnJlZnJlc2hQYXVzZWQsdGhpcyksdGhpcy5fbWVkaWE9bnVsbCl9LG4ucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJbSFRNTEF1ZGlvSW5zdGFuY2UgaWQ9XCIrdGhpcy5pZCtcIl1cIn0sbi5QQURESU5HPS4xLG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSxzPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXtyZXR1cm4gbnVsbCE9PWUmJmUuYXBwbHkodGhpcyxhcmd1bWVudHMpfHx0aGlzfXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLnBhcmVudD1lLHRoaXMuX3NvdXJjZT1lLm9wdGlvbnMuc291cmNlfHxuZXcgQXVkaW8sZS51cmwmJih0aGlzLl9zb3VyY2Uuc3JjPWUudXJsKX0sbi5wcm90b3R5cGUuY3JlYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyByKHRoaXMpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJpc1BsYXlhYmxlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiEhdGhpcy5fc291cmNlJiY0PT09dGhpcy5fc291cmNlLnJlYWR5U3RhdGV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZHVyYXRpb25cIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NvdXJjZS5kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhcmVudC5jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LHNldDpmdW5jdGlvbihlKXtjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgZmlsdGVyc1wiKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLnBhcmVudD1udWxsLHRoaXMuX3NvdXJjZSYmKHRoaXMuX3NvdXJjZS5zcmM9XCJcIix0aGlzLl9zb3VyY2UubG9hZCgpLHRoaXMuX3NvdXJjZT1udWxsKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwic291cmNlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zb3VyY2V9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihlKXt2YXIgdD10aGlzLl9zb3VyY2Usbj10aGlzLnBhcmVudDtpZig0PT09dC5yZWFkeVN0YXRlKXtuLmlzTG9hZGVkPSEwO3ZhciBvPW4uYXV0b1BsYXlTdGFydCgpO3JldHVybiB2b2lkKGUmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKG51bGwsbixvKX0sMCkpfWlmKCFuLnVybClyZXR1cm4gZShuZXcgRXJyb3IoXCJzb3VuZC51cmwgb3Igc291bmQuc291cmNlIG11c3QgYmUgc2V0XCIpKTt0LnNyYz1uLnVybDt2YXIgaT1mdW5jdGlvbigpe3QucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNhbnBsYXl0aHJvdWdoXCIsciksdC5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLHIpLHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIscyksdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIix1KX0scj1mdW5jdGlvbigpe2koKSxuLmlzTG9hZGVkPSEwO3ZhciB0PW4uYXV0b1BsYXlTdGFydCgpO2UmJmUobnVsbCxuLHQpfSxzPWZ1bmN0aW9uKCl7aSgpLGUmJmUobmV3IEVycm9yKFwiU291bmQgbG9hZGluZyBoYXMgYmVlbiBhYm9ydGVkXCIpKX0sdT1mdW5jdGlvbigpe2koKTt2YXIgbj1cIkZhaWxlZCB0byBsb2FkIGF1ZGlvIGVsZW1lbnQgKGNvZGU6IFwiK3QuZXJyb3IuY29kZStcIilcIjtlP2UobmV3IEVycm9yKG4pKTpjb25zb2xlLmVycm9yKG4pfTt0LmFkZEV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5dGhyb3VnaFwiLHIsITEpLHQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixyLCExKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLHMsITEpLHQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsdSwhMSksdC5sb2FkKCl9LG59KFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyKSx1PVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6e30sYT1mdW5jdGlvbihlLHQpe3JldHVybiB0PXtleHBvcnRzOnt9fSxlKHQsdC5leHBvcnRzKSx0LmV4cG9ydHN9KGZ1bmN0aW9uKGUpeyFmdW5jdGlvbih0KXtmdW5jdGlvbiBuKCl7fWZ1bmN0aW9uIG8oZSx0KXtyZXR1cm4gZnVuY3Rpb24oKXtlLmFwcGx5KHQsYXJndW1lbnRzKX19ZnVuY3Rpb24gaShlKXtpZihcIm9iamVjdFwiIT10eXBlb2YgdGhpcyl0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3XCIpO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBhIGZ1bmN0aW9uXCIpO3RoaXMuX3N0YXRlPTAsdGhpcy5faGFuZGxlZD0hMSx0aGlzLl92YWx1ZT12b2lkIDAsdGhpcy5fZGVmZXJyZWRzPVtdLGwoZSx0aGlzKX1mdW5jdGlvbiByKGUsdCl7Zm9yKDszPT09ZS5fc3RhdGU7KWU9ZS5fdmFsdWU7aWYoMD09PWUuX3N0YXRlKXJldHVybiB2b2lkIGUuX2RlZmVycmVkcy5wdXNoKHQpO2UuX2hhbmRsZWQ9ITAsaS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKXt2YXIgbj0xPT09ZS5fc3RhdGU/dC5vbkZ1bGZpbGxlZDp0Lm9uUmVqZWN0ZWQ7aWYobnVsbD09PW4pcmV0dXJuIHZvaWQoMT09PWUuX3N0YXRlP3M6dSkodC5wcm9taXNlLGUuX3ZhbHVlKTt2YXIgbzt0cnl7bz1uKGUuX3ZhbHVlKX1jYXRjaChlKXtyZXR1cm4gdm9pZCB1KHQucHJvbWlzZSxlKX1zKHQucHJvbWlzZSxvKX0pfWZ1bmN0aW9uIHMoZSx0KXt0cnl7aWYodD09PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkEgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuXCIpO2lmKHQmJihcIm9iamVjdFwiPT10eXBlb2YgdHx8XCJmdW5jdGlvblwiPT10eXBlb2YgdCkpe3ZhciBuPXQudGhlbjtpZih0IGluc3RhbmNlb2YgaSlyZXR1cm4gZS5fc3RhdGU9MyxlLl92YWx1ZT10LHZvaWQgYShlKTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBuKXJldHVybiB2b2lkIGwobyhuLHQpLGUpfWUuX3N0YXRlPTEsZS5fdmFsdWU9dCxhKGUpfWNhdGNoKHQpe3UoZSx0KX19ZnVuY3Rpb24gdShlLHQpe2UuX3N0YXRlPTIsZS5fdmFsdWU9dCxhKGUpfWZ1bmN0aW9uIGEoZSl7Mj09PWUuX3N0YXRlJiYwPT09ZS5fZGVmZXJyZWRzLmxlbmd0aCYmaS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKXtlLl9oYW5kbGVkfHxpLl91bmhhbmRsZWRSZWplY3Rpb25GbihlLl92YWx1ZSl9KTtmb3IodmFyIHQ9MCxuPWUuX2RlZmVycmVkcy5sZW5ndGg7dDxuO3QrKylyKGUsZS5fZGVmZXJyZWRzW3RdKTtlLl9kZWZlcnJlZHM9bnVsbH1mdW5jdGlvbiBjKGUsdCxuKXt0aGlzLm9uRnVsZmlsbGVkPVwiZnVuY3Rpb25cIj09dHlwZW9mIGU/ZTpudWxsLHRoaXMub25SZWplY3RlZD1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0P3Q6bnVsbCx0aGlzLnByb21pc2U9bn1mdW5jdGlvbiBsKGUsdCl7dmFyIG49ITE7dHJ5e2UoZnVuY3Rpb24oZSl7bnx8KG49ITAscyh0LGUpKX0sZnVuY3Rpb24oZSl7bnx8KG49ITAsdSh0LGUpKX0pfWNhdGNoKGUpe2lmKG4pcmV0dXJuO249ITAsdSh0LGUpfX12YXIgcD1zZXRUaW1lb3V0O2kucHJvdG90eXBlLmNhdGNoPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnRoZW4obnVsbCxlKX0saS5wcm90b3R5cGUudGhlbj1mdW5jdGlvbihlLHQpe3ZhciBvPW5ldyB0aGlzLmNvbnN0cnVjdG9yKG4pO3JldHVybiByKHRoaXMsbmV3IGMoZSx0LG8pKSxvfSxpLmFsbD1mdW5jdGlvbihlKXt2YXIgdD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlKTtyZXR1cm4gbmV3IGkoZnVuY3Rpb24oZSxuKXtmdW5jdGlvbiBvKHIscyl7dHJ5e2lmKHMmJihcIm9iamVjdFwiPT10eXBlb2Ygc3x8XCJmdW5jdGlvblwiPT10eXBlb2Ygcykpe3ZhciB1PXMudGhlbjtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiB1KXJldHVybiB2b2lkIHUuY2FsbChzLGZ1bmN0aW9uKGUpe28ocixlKX0sbil9dFtyXT1zLDA9PS0taSYmZSh0KX1jYXRjaChlKXtuKGUpfX1pZigwPT09dC5sZW5ndGgpcmV0dXJuIGUoW10pO2Zvcih2YXIgaT10Lmxlbmd0aCxyPTA7cjx0Lmxlbmd0aDtyKyspbyhyLHRbcl0pfSl9LGkucmVzb2x2ZT1mdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJvYmplY3RcIj09dHlwZW9mIGUmJmUuY29uc3RydWN0b3I9PT1pP2U6bmV3IGkoZnVuY3Rpb24odCl7dChlKX0pfSxpLnJlamVjdD1mdW5jdGlvbihlKXtyZXR1cm4gbmV3IGkoZnVuY3Rpb24odCxuKXtuKGUpfSl9LGkucmFjZT1mdW5jdGlvbihlKXtyZXR1cm4gbmV3IGkoZnVuY3Rpb24odCxuKXtmb3IodmFyIG89MCxpPWUubGVuZ3RoO288aTtvKyspZVtvXS50aGVuKHQsbil9KX0saS5faW1tZWRpYXRlRm49XCJmdW5jdGlvblwiPT10eXBlb2Ygc2V0SW1tZWRpYXRlJiZmdW5jdGlvbihlKXtzZXRJbW1lZGlhdGUoZSl9fHxmdW5jdGlvbihlKXtwKGUsMCl9LGkuX3VuaGFuZGxlZFJlamVjdGlvbkZuPWZ1bmN0aW9uKGUpe1widW5kZWZpbmVkXCIhPXR5cGVvZiBjb25zb2xlJiZjb25zb2xlJiZjb25zb2xlLndhcm4oXCJQb3NzaWJsZSBVbmhhbmRsZWQgUHJvbWlzZSBSZWplY3Rpb246XCIsZSl9LGkuX3NldEltbWVkaWF0ZUZuPWZ1bmN0aW9uKGUpe2kuX2ltbWVkaWF0ZUZuPWV9LGkuX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuPWZ1bmN0aW9uKGUpe2kuX3VuaGFuZGxlZFJlamVjdGlvbkZuPWV9LGUuZXhwb3J0cz9lLmV4cG9ydHM9aTp0LlByb21pc2V8fCh0LlByb21pc2U9aSl9KHUpfSksYz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLmRlc3RpbmF0aW9uPWUsdGhpcy5zb3VyY2U9dHx8ZX1yZXR1cm4gZS5wcm90b3R5cGUuY29ubmVjdD1mdW5jdGlvbihlKXt0aGlzLnNvdXJjZS5jb25uZWN0KGUpfSxlLnByb3RvdHlwZS5kaXNjb25uZWN0PWZ1bmN0aW9uKCl7dGhpcy5zb3VyY2UuZGlzY29ubmVjdCgpfSxlLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5kaXNjb25uZWN0KCksdGhpcy5kZXN0aW5hdGlvbj1udWxsLHRoaXMuc291cmNlPW51bGx9LGV9KCksbD1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUuc2V0UGFyYW1WYWx1ZT1mdW5jdGlvbihlLHQpe2lmKGUuc2V0VmFsdWVBdFRpbWUpe3ZhciBuPVMuaW5zdGFuY2UuY29udGV4dDtlLnNldFZhbHVlQXRUaW1lKHQsbi5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUpfWVsc2UgZS52YWx1ZT10O3JldHVybiB0fSxlfSgpLHA9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbih0LG8saSxyLHMsdSxhLGMscCxoKXt2b2lkIDA9PT10JiYodD0wKSx2b2lkIDA9PT1vJiYobz0wKSx2b2lkIDA9PT1pJiYoaT0wKSx2b2lkIDA9PT1yJiYocj0wKSx2b2lkIDA9PT1zJiYocz0wKSx2b2lkIDA9PT11JiYodT0wKSx2b2lkIDA9PT1hJiYoYT0wKSx2b2lkIDA9PT1jJiYoYz0wKSx2b2lkIDA9PT1wJiYocD0wKSx2b2lkIDA9PT1oJiYoaD0wKTt2YXIgZD10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKGQ9ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBmPVt7ZjpuLkYzMix0eXBlOlwibG93c2hlbGZcIixnYWluOnR9LHtmOm4uRjY0LHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpvfSx7ZjpuLkYxMjUsdHlwZTpcInBlYWtpbmdcIixnYWluOml9LHtmOm4uRjI1MCx0eXBlOlwicGVha2luZ1wiLGdhaW46cn0se2Y6bi5GNTAwLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpzfSx7ZjpuLkYxSyx0eXBlOlwicGVha2luZ1wiLGdhaW46dX0se2Y6bi5GMkssdHlwZTpcInBlYWtpbmdcIixnYWluOmF9LHtmOm4uRjRLLHR5cGU6XCJwZWFraW5nXCIsZ2FpbjpjfSx7ZjpuLkY4Syx0eXBlOlwicGVha2luZ1wiLGdhaW46cH0se2Y6bi5GMTZLLHR5cGU6XCJoaWdoc2hlbGZcIixnYWluOmh9XS5tYXAoZnVuY3Rpb24oZSl7dmFyIHQ9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtyZXR1cm4gdC50eXBlPWUudHlwZSxsLnNldFBhcmFtVmFsdWUodC5nYWluLGUuZ2FpbiksbC5zZXRQYXJhbVZhbHVlKHQuUSwxKSxsLnNldFBhcmFtVmFsdWUodC5mcmVxdWVuY3ksZS5mKSx0fSk7KGQ9ZS5jYWxsKHRoaXMsZlswXSxmW2YubGVuZ3RoLTFdKXx8dGhpcykuYmFuZHM9ZixkLmJhbmRzTWFwPXt9O2Zvcih2YXIgXz0wO188ZC5iYW5kcy5sZW5ndGg7XysrKXt2YXIgeT1kLmJhbmRzW19dO18+MCYmZC5iYW5kc1tfLTFdLmNvbm5lY3QoeSksZC5iYW5kc01hcFt5LmZyZXF1ZW5jeS52YWx1ZV09eX1yZXR1cm4gZH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLnNldEdhaW49ZnVuY3Rpb24oZSx0KXtpZih2b2lkIDA9PT10JiYodD0wKSwhdGhpcy5iYW5kc01hcFtlXSl0aHJvd1wiTm8gYmFuZCBmb3VuZCBmb3IgZnJlcXVlbmN5IFwiK2U7bC5zZXRQYXJhbVZhbHVlKHRoaXMuYmFuZHNNYXBbZV0uZ2Fpbix0KX0sbi5wcm90b3R5cGUuZ2V0R2Fpbj1mdW5jdGlvbihlKXtpZighdGhpcy5iYW5kc01hcFtlXSl0aHJvd1wiTm8gYmFuZCBmb3VuZCBmb3IgZnJlcXVlbmN5IFwiK2U7cmV0dXJuIHRoaXMuYmFuZHNNYXBbZV0uZ2Fpbi52YWx1ZX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjMyXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMzIpfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjMyLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY2NFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjY0KX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY2NCxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMTI1XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMTI1KX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkYxMjUsZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjI1MFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjI1MCl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMjUwLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY1MDBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY1MDApfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjUwMCxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmMWtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkYxSyl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMUssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjJrXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEdhaW4obi5GMkspfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5zZXRHYWluKG4uRjJLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImY0a1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjRLKX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuc2V0R2FpbihuLkY0SyxlKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJmOGtcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0R2FpbihuLkY4Syl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GOEssZSl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiZjE2a1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRHYWluKG4uRjE2Syl9LHNldDpmdW5jdGlvbihlKXt0aGlzLnNldEdhaW4obi5GMTZLLGUpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLnJlc2V0PWZ1bmN0aW9uKCl7dGhpcy5iYW5kcy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2wuc2V0UGFyYW1WYWx1ZShlLmdhaW4sMCl9KX0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuYmFuZHMuZm9yRWFjaChmdW5jdGlvbihlKXtlLmRpc2Nvbm5lY3QoKX0pLHRoaXMuYmFuZHM9bnVsbCx0aGlzLmJhbmRzTWFwPW51bGx9LG4uRjMyPTMyLG4uRjY0PTY0LG4uRjEyNT0xMjUsbi5GMjUwPTI1MCxuLkY1MDA9NTAwLG4uRjFLPTFlMyxuLkYySz0yZTMsbi5GNEs9NGUzLG4uRjhLPThlMyxuLkYxNks9MTZlMyxufShjKSxoPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dm9pZCAwPT09dCYmKHQ9MCk7dmFyIG49dGhpcztpZihTLmluc3RhbmNlLnVzZUxlZ2FjeSlyZXR1cm4gdm9pZChuPWUuY2FsbCh0aGlzLG51bGwpfHx0aGlzKTt2YXIgbz1TLmluc3RhbmNlLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZVdhdmVTaGFwZXIoKTtyZXR1cm4gbj1lLmNhbGwodGhpcyxvKXx8dGhpcyxuLl9kaXN0b3J0aW9uPW8sbi5hbW91bnQ9dCxufXJldHVybiB0KG4sZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiYW1vdW50XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hbW91bnR9LHNldDpmdW5jdGlvbihlKXtlKj0xZTMsdGhpcy5fYW1vdW50PWU7Zm9yKHZhciB0LG49bmV3IEZsb2F0MzJBcnJheSg0NDEwMCksbz1NYXRoLlBJLzE4MCxpPTA7aTw0NDEwMDsrK2kpdD0yKmkvNDQxMDAtMSxuW2ldPSgzK2UpKnQqMjAqby8oTWF0aC5QSStlKk1hdGguYWJzKHQpKTt0aGlzLl9kaXN0b3J0aW9uLmN1cnZlPW4sdGhpcy5fZGlzdG9ydGlvbi5vdmVyc2FtcGxlPVwiNHhcIn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5fZGlzdG9ydGlvbj1udWxsLGUucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKX0sbn0oYyksZD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZvaWQgMD09PXQmJih0PTApO3ZhciBuPXRoaXM7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQobj1lLmNhbGwodGhpcyxudWxsKXx8dGhpcyk7dmFyIG8saSxyLHM9Uy5pbnN0YW5jZS5jb250ZXh0LmF1ZGlvQ29udGV4dDtyZXR1cm4gcy5jcmVhdGVTdGVyZW9QYW5uZXI/cj1vPXMuY3JlYXRlU3RlcmVvUGFubmVyKCk6KChpPXMuY3JlYXRlUGFubmVyKCkpLnBhbm5pbmdNb2RlbD1cImVxdWFscG93ZXJcIixyPWkpLG49ZS5jYWxsKHRoaXMscil8fHRoaXMsbi5fc3RlcmVvPW8sbi5fcGFubmVyPWksbi5wYW49dCxufXJldHVybiB0KG4sZSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwicGFuXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYW59LHNldDpmdW5jdGlvbihlKXt0aGlzLl9wYW49ZSx0aGlzLl9zdGVyZW8/bC5zZXRQYXJhbVZhbHVlKHRoaXMuX3N0ZXJlby5wYW4sZSk6dGhpcy5fcGFubmVyLnNldFBvc2l0aW9uKGUsMCwxLU1hdGguYWJzKGUpKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7ZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpLHRoaXMuX3N0ZXJlbz1udWxsLHRoaXMuX3Bhbm5lcj1udWxsfSxufShjKSxmPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxuLG8pe3ZvaWQgMD09PXQmJih0PTMpLHZvaWQgMD09PW4mJihuPTIpLHZvaWQgMD09PW8mJihvPSExKTt2YXIgaT10aGlzO2lmKFMuaW5zdGFuY2UudXNlTGVnYWN5KXJldHVybiB2b2lkKGk9ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciByPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQ29udm9sdmVyKCk7cmV0dXJuIGk9ZS5jYWxsKHRoaXMscil8fHRoaXMsaS5fY29udm9sdmVyPXIsaS5fc2Vjb25kcz1pLl9jbGFtcCh0LDEsNTApLGkuX2RlY2F5PWkuX2NsYW1wKG4sMCwxMDApLGkuX3JldmVyc2U9byxpLl9yZWJ1aWxkKCksaX1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLl9jbGFtcD1mdW5jdGlvbihlLHQsbil7cmV0dXJuIE1hdGgubWluKG4sTWF0aC5tYXgodCxlKSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNlY29uZHNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NlY29uZHN9LHNldDpmdW5jdGlvbihlKXt0aGlzLl9zZWNvbmRzPXRoaXMuX2NsYW1wKGUsMSw1MCksdGhpcy5fcmVidWlsZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImRlY2F5XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9kZWNheX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2RlY2F5PXRoaXMuX2NsYW1wKGUsMCwxMDApLHRoaXMuX3JlYnVpbGQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJyZXZlcnNlXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZXZlcnNlfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fcmV2ZXJzZT1lLHRoaXMuX3JlYnVpbGQoKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5fcmVidWlsZD1mdW5jdGlvbigpe2Zvcih2YXIgZSx0PVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQsbj10LnNhbXBsZVJhdGUsbz1uKnRoaXMuX3NlY29uZHMsaT10LmNyZWF0ZUJ1ZmZlcigyLG8sbikscj1pLmdldENoYW5uZWxEYXRhKDApLHM9aS5nZXRDaGFubmVsRGF0YSgxKSx1PTA7dTxvO3UrKyllPXRoaXMuX3JldmVyc2U/by11OnUsclt1XT0oMipNYXRoLnJhbmRvbSgpLTEpKk1hdGgucG93KDEtZS9vLHRoaXMuX2RlY2F5KSxzW3VdPSgyKk1hdGgucmFuZG9tKCktMSkqTWF0aC5wb3coMS1lL28sdGhpcy5fZGVjYXkpO3RoaXMuX2NvbnZvbHZlci5idWZmZXI9aX0sbi5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMuX2NvbnZvbHZlcj1udWxsLGUucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKX0sbn0oYyksXz1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7dmFyIHQ9dGhpcztTLmluc3RhbmNlLnVzZUxlZ2FjeSYmKHQ9ZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciBuPVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQsbz1uLmNyZWF0ZUNoYW5uZWxTcGxpdHRlcigpLGk9bi5jcmVhdGVDaGFubmVsTWVyZ2VyKCk7cmV0dXJuIGkuY29ubmVjdChvKSx0PWUuY2FsbCh0aGlzLGksbyl8fHRoaXMsdC5fbWVyZ2VyPWksdH1yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9tZXJnZXIuZGlzY29ubmVjdCgpLHRoaXMuX21lcmdlcj1udWxsLGUucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKX0sbn0oYykseT1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7aWYoUy5pbnN0YW5jZS51c2VMZWdhY3kpcmV0dXJuIHZvaWQoZS5jYWxsKHRoaXMsbnVsbCl8fHRoaXMpO3ZhciB0PVMuaW5zdGFuY2UuY29udGV4dC5hdWRpb0NvbnRleHQsbj10LmNyZWF0ZUJpcXVhZEZpbHRlcigpLG89dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKSxpPXQuY3JlYXRlQmlxdWFkRmlsdGVyKCkscj10LmNyZWF0ZUJpcXVhZEZpbHRlcigpO3JldHVybiBuLnR5cGU9XCJsb3dwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKG4uZnJlcXVlbmN5LDJlMyksby50eXBlPVwibG93cGFzc1wiLGwuc2V0UGFyYW1WYWx1ZShvLmZyZXF1ZW5jeSwyZTMpLGkudHlwZT1cImhpZ2hwYXNzXCIsbC5zZXRQYXJhbVZhbHVlKGkuZnJlcXVlbmN5LDUwMCksci50eXBlPVwiaGlnaHBhc3NcIixsLnNldFBhcmFtVmFsdWUoci5mcmVxdWVuY3ksNTAwKSxuLmNvbm5lY3Qobyksby5jb25uZWN0KGkpLGkuY29ubmVjdChyKSxlLmNhbGwodGhpcyxuLHIpfHx0aGlzfXJldHVybiB0KG4sZSksbn0oYyksbT1PYmplY3QuZnJlZXplKHtGaWx0ZXI6YyxFcXVhbGl6ZXJGaWx0ZXI6cCxEaXN0b3J0aW9uRmlsdGVyOmgsU3RlcmVvRmlsdGVyOmQsUmV2ZXJiRmlsdGVyOmYsTW9ub0ZpbHRlcjpfLFRlbGVwaG9uZUZpbHRlcjp5fSksYj1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7dmFyIHQ9ZS5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiB0LnNwZWVkPTEsdC52b2x1bWU9MSx0Lm11dGVkPSExLHQucGF1c2VkPSExLHR9cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwicmVmcmVzaFwiKX0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3RoaXMuZW1pdChcInJlZnJlc2hQYXVzZWRcIil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImZpbHRlcnNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBmaWx0ZXJzXCIpLG51bGx9LHNldDpmdW5jdGlvbihlKXtjb25zb2xlLndhcm4oXCJIVE1MIEF1ZGlvIGRvZXMgbm90IHN1cHBvcnQgZmlsdGVyc1wiKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJhdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNvbnNvbGUud2FybihcIkhUTUwgQXVkaW8gZG9lcyBub3Qgc3VwcG9ydCBhdWRpb0NvbnRleHRcIiksbnVsbH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS50b2dnbGVNdXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubXV0ZWQ9IXRoaXMubXV0ZWQsdGhpcy5yZWZyZXNoKCksdGhpcy5tdXRlZH0sbi5wcm90b3R5cGUudG9nZ2xlUGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXVzZWQ9IXRoaXMucGF1c2VkLHRoaXMucmVmcmVzaFBhdXNlZCgpLHRoaXMucGF1c2VkfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKX0sbn0oUElYSS51dGlscy5FdmVudEVtaXR0ZXIpLGc9T2JqZWN0LmZyZWV6ZSh7SFRNTEF1ZGlvTWVkaWE6cyxIVE1MQXVkaW9JbnN0YW5jZTpyLEhUTUxBdWRpb0NvbnRleHQ6Yn0pLHY9MCxQPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCl7dmFyIG49ZS5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiBuLmlkPXYrKyxuLl9tZWRpYT1udWxsLG4uX3BhdXNlZD0hMSxuLl9tdXRlZD0hMSxuLl9lbGFwc2VkPTAsbi5fdXBkYXRlTGlzdGVuZXI9bi5fdXBkYXRlLmJpbmQobiksbi5pbml0KHQpLG59cmV0dXJuIHQobixlKSxuLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiYodGhpcy5faW50ZXJuYWxTdG9wKCksdGhpcy5lbWl0KFwic3RvcFwiKSl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInNwZWVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NwZWVkPWUsdGhpcy5yZWZyZXNoKCksdGhpcy5fdXBkYXRlKCEwKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJ2b2x1bWVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZvbHVtZX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3ZvbHVtZT1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIm11dGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tdXRlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX211dGVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwibG9vcFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbG9vcH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2xvb3A9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fbWVkaWEuY29udGV4dCx0PXRoaXMuX21lZGlhLnBhcmVudDt0aGlzLl9zb3VyY2UubG9vcD10aGlzLl9sb29wfHx0Lmxvb3A7dmFyIG49ZS52b2x1bWUqKGUubXV0ZWQ/MDoxKSxvPXQudm9sdW1lKih0Lm11dGVkPzA6MSksaT10aGlzLl92b2x1bWUqKHRoaXMuX211dGVkPzA6MSk7bC5zZXRQYXJhbVZhbHVlKHRoaXMuX2dhaW4uZ2FpbixpKm8qbiksbC5zZXRQYXJhbVZhbHVlKHRoaXMuX3NvdXJjZS5wbGF5YmFja1JhdGUsdGhpcy5fc3BlZWQqdC5zcGVlZCplLnNwZWVkKX0sbi5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe3ZhciBlPXRoaXMuX21lZGlhLmNvbnRleHQsdD10aGlzLl9tZWRpYS5wYXJlbnQsbj10aGlzLl9wYXVzZWR8fHQucGF1c2VkfHxlLnBhdXNlZDtuIT09dGhpcy5fcGF1c2VkUmVhbCYmKHRoaXMuX3BhdXNlZFJlYWw9bixuPyh0aGlzLl9pbnRlcm5hbFN0b3AoKSx0aGlzLmVtaXQoXCJwYXVzZWRcIikpOih0aGlzLmVtaXQoXCJyZXN1bWVkXCIpLHRoaXMucGxheSh7c3RhcnQ6dGhpcy5fZWxhcHNlZCV0aGlzLl9kdXJhdGlvbixlbmQ6dGhpcy5fZW5kLHNwZWVkOnRoaXMuX3NwZWVkLGxvb3A6dGhpcy5fbG9vcCx2b2x1bWU6dGhpcy5fdm9sdW1lfSkpLHRoaXMuZW1pdChcInBhdXNlXCIsbikpfSxuLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUpe3ZhciB0PWUuc3RhcnQsbj1lLmVuZCxvPWUuc3BlZWQsaT1lLmxvb3Ascj1lLnZvbHVtZSxzPWUubXV0ZWQ7biYmY29uc29sZS5hc3NlcnQobj50LFwiRW5kIHRpbWUgaXMgYmVmb3JlIHN0YXJ0IHRpbWVcIiksdGhpcy5fcGF1c2VkPSExO3ZhciB1PXRoaXMuX21lZGlhLm5vZGVzLmNsb25lQnVmZmVyU291cmNlKCksYT11LnNvdXJjZSxjPXUuZ2Fpbjt0aGlzLl9zb3VyY2U9YSx0aGlzLl9nYWluPWMsdGhpcy5fc3BlZWQ9byx0aGlzLl92b2x1bWU9cix0aGlzLl9sb29wPSEhaSx0aGlzLl9tdXRlZD1zLHRoaXMucmVmcmVzaCgpLHRoaXMubG9vcCYmbnVsbCE9PW4mJihjb25zb2xlLndhcm4oJ0xvb3Bpbmcgbm90IHN1cHBvcnQgd2hlbiBzcGVjaWZ5aW5nIGFuIFwiZW5kXCIgdGltZScpLHRoaXMubG9vcD0hMSksdGhpcy5fZW5kPW47dmFyIGw9dGhpcy5fc291cmNlLmJ1ZmZlci5kdXJhdGlvbjt0aGlzLl9kdXJhdGlvbj1sLHRoaXMuX2xhc3RVcGRhdGU9dGhpcy5fbm93KCksdGhpcy5fZWxhcHNlZD10LHRoaXMuX3NvdXJjZS5vbmVuZGVkPXRoaXMuX29uQ29tcGxldGUuYmluZCh0aGlzKSxuP3RoaXMuX3NvdXJjZS5zdGFydCgwLHQsbi10KTp0aGlzLl9zb3VyY2Uuc3RhcnQoMCx0KSx0aGlzLmVtaXQoXCJzdGFydFwiKSx0aGlzLl91cGRhdGUoITApLHRoaXMuX2VuYWJsZWQ9ITB9LG4ucHJvdG90eXBlLl90b1NlYz1mdW5jdGlvbihlKXtyZXR1cm4gZT4xMCYmKGUvPTFlMyksZXx8MH0sT2JqZWN0LmRlZmluZVByb3BlcnR5KG4ucHJvdG90eXBlLFwiX2VuYWJsZWRcIix7c2V0OmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX21lZGlhLm5vZGVzLnNjcmlwdDt0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhdWRpb3Byb2Nlc3NcIix0aGlzLl91cGRhdGVMaXN0ZW5lciksZSYmdC5hZGRFdmVudExpc3RlbmVyKFwiYXVkaW9wcm9jZXNzXCIsdGhpcy5fdXBkYXRlTGlzdGVuZXIpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInByb2dyZXNzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wcm9ncmVzc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobi5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3BhdXNlZD1lLHRoaXMucmVmcmVzaFBhdXNlZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMuX2ludGVybmFsU3RvcCgpLHRoaXMuX3NvdXJjZSYmKHRoaXMuX3NvdXJjZS5kaXNjb25uZWN0KCksdGhpcy5fc291cmNlPW51bGwpLHRoaXMuX2dhaW4mJih0aGlzLl9nYWluLmRpc2Nvbm5lY3QoKSx0aGlzLl9nYWluPW51bGwpLHRoaXMuX21lZGlhJiYodGhpcy5fbWVkaWEuY29udGV4dC5ldmVudHMub2ZmKFwicmVmcmVzaFwiLHRoaXMucmVmcmVzaCx0aGlzKSx0aGlzLl9tZWRpYS5jb250ZXh0LmV2ZW50cy5vZmYoXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpLHRoaXMuX21lZGlhPW51bGwpLHRoaXMuX2VuZD1udWxsLHRoaXMuX3NwZWVkPTEsdGhpcy5fdm9sdW1lPTEsdGhpcy5fbG9vcD0hMSx0aGlzLl9lbGFwc2VkPTAsdGhpcy5fZHVyYXRpb249MCx0aGlzLl9wYXVzZWQ9ITEsdGhpcy5fbXV0ZWQ9ITEsdGhpcy5fcGF1c2VkUmVhbD0hMX0sbi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIltXZWJBdWRpb0luc3RhbmNlIGlkPVwiK3RoaXMuaWQrXCJdXCJ9LG4ucHJvdG90eXBlLl9ub3c9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbWVkaWEuY29udGV4dC5hdWRpb0NvbnRleHQuY3VycmVudFRpbWV9LG4ucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oZSl7aWYodm9pZCAwPT09ZSYmKGU9ITEpLHRoaXMuX3NvdXJjZSl7dmFyIHQ9dGhpcy5fbm93KCksbj10LXRoaXMuX2xhc3RVcGRhdGU7aWYobj4wfHxlKXt2YXIgbz10aGlzLl9zb3VyY2UucGxheWJhY2tSYXRlLnZhbHVlO3RoaXMuX2VsYXBzZWQrPW4qbyx0aGlzLl9sYXN0VXBkYXRlPXQ7dmFyIGk9dGhpcy5fZHVyYXRpb24scj10aGlzLl9lbGFwc2VkJWkvaTt0aGlzLl9wcm9ncmVzcz1yLHRoaXMuZW1pdChcInByb2dyZXNzXCIsdGhpcy5fcHJvZ3Jlc3MsaSl9fX0sbi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbihlKXt0aGlzLl9tZWRpYT1lLGUuY29udGV4dC5ldmVudHMub24oXCJyZWZyZXNoXCIsdGhpcy5yZWZyZXNoLHRoaXMpLGUuY29udGV4dC5ldmVudHMub24oXCJyZWZyZXNoUGF1c2VkXCIsdGhpcy5yZWZyZXNoUGF1c2VkLHRoaXMpfSxuLnByb3RvdHlwZS5faW50ZXJuYWxTdG9wPWZ1bmN0aW9uKCl7dGhpcy5fc291cmNlJiYodGhpcy5fZW5hYmxlZD0hMSx0aGlzLl9zb3VyY2Uub25lbmRlZD1udWxsLHRoaXMuX3NvdXJjZS5zdG9wKCksdGhpcy5fc291cmNlPW51bGwpfSxuLnByb3RvdHlwZS5fb25Db21wbGV0ZT1mdW5jdGlvbigpe3RoaXMuX3NvdXJjZSYmKHRoaXMuX2VuYWJsZWQ9ITEsdGhpcy5fc291cmNlLm9uZW5kZWQ9bnVsbCksdGhpcy5fc291cmNlPW51bGwsdGhpcy5fcHJvZ3Jlc3M9MSx0aGlzLmVtaXQoXCJwcm9ncmVzc1wiLDEsdGhpcy5fZHVyYXRpb24pLHRoaXMuZW1pdChcImVuZFwiLHRoaXMpfSxufShQSVhJLnV0aWxzLkV2ZW50RW1pdHRlcikseD1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKHQpe3ZhciBvPXRoaXMsaT10LmF1ZGlvQ29udGV4dCxyPWkuY3JlYXRlQnVmZmVyU291cmNlKCkscz1pLmNyZWF0ZVNjcmlwdFByb2Nlc3NvcihuLkJVRkZFUl9TSVpFKSx1PWkuY3JlYXRlR2FpbigpLGE9aS5jcmVhdGVBbmFseXNlcigpO3JldHVybiByLmNvbm5lY3QoYSksYS5jb25uZWN0KHUpLHUuY29ubmVjdCh0LmRlc3RpbmF0aW9uKSxzLmNvbm5lY3QodC5kZXN0aW5hdGlvbiksbz1lLmNhbGwodGhpcyxhLHUpfHx0aGlzLG8uY29udGV4dD10LG8uYnVmZmVyU291cmNlPXIsby5zY3JpcHQ9cyxvLmdhaW49dSxvLmFuYWx5c2VyPWEsb31yZXR1cm4gdChuLGUpLG4ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyksdGhpcy5idWZmZXJTb3VyY2UuZGlzY29ubmVjdCgpLHRoaXMuc2NyaXB0LmRpc2Nvbm5lY3QoKSx0aGlzLmdhaW4uZGlzY29ubmVjdCgpLHRoaXMuYW5hbHlzZXIuZGlzY29ubmVjdCgpLHRoaXMuYnVmZmVyU291cmNlPW51bGwsdGhpcy5zY3JpcHQ9bnVsbCx0aGlzLmdhaW49bnVsbCx0aGlzLmFuYWx5c2VyPW51bGwsdGhpcy5jb250ZXh0PW51bGx9LG4ucHJvdG90eXBlLmNsb25lQnVmZmVyU291cmNlPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5idWZmZXJTb3VyY2UsdD10aGlzLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO3QuYnVmZmVyPWUuYnVmZmVyLGwuc2V0UGFyYW1WYWx1ZSh0LnBsYXliYWNrUmF0ZSxlLnBsYXliYWNrUmF0ZS52YWx1ZSksdC5sb29wPWUubG9vcDt2YXIgbj10aGlzLmNvbnRleHQuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtyZXR1cm4gdC5jb25uZWN0KG4pLG4uY29ubmVjdCh0aGlzLmRlc3RpbmF0aW9uKSx7c291cmNlOnQsZ2FpbjpufX0sbi5CVUZGRVJfU0laRT0yNTYsbn0obiksTz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oZSl7dGhpcy5wYXJlbnQ9ZSx0aGlzLl9ub2Rlcz1uZXcgeCh0aGlzLmNvbnRleHQpLHRoaXMuX3NvdXJjZT10aGlzLl9ub2Rlcy5idWZmZXJTb3VyY2UsdGhpcy5zb3VyY2U9ZS5vcHRpb25zLnNvdXJjZX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucGFyZW50PW51bGwsdGhpcy5fbm9kZXMuZGVzdHJveSgpLHRoaXMuX25vZGVzPW51bGwsdGhpcy5fc291cmNlPW51bGwsdGhpcy5zb3VyY2U9bnVsbH0sZS5wcm90b3R5cGUuY3JlYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBQKHRoaXMpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhcmVudC5jb250ZXh0fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImlzUGxheWFibGVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuISF0aGlzLl9zb3VyY2UmJiEhdGhpcy5fc291cmNlLmJ1ZmZlcn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9ub2Rlcy5maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbm9kZXMuZmlsdGVycz1lfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImR1cmF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBjb25zb2xlLmFzc2VydCh0aGlzLmlzUGxheWFibGUsXCJTb3VuZCBub3QgeWV0IHBsYXlhYmxlLCBubyBkdXJhdGlvblwiKSx0aGlzLl9zb3VyY2UuYnVmZmVyLmR1cmF0aW9ufSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcImJ1ZmZlclwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc291cmNlLmJ1ZmZlcn0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NvdXJjZS5idWZmZXI9ZX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJub2Rlc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbm9kZXN9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihlKXt0aGlzLnNvdXJjZT90aGlzLl9kZWNvZGUodGhpcy5zb3VyY2UsZSk6dGhpcy5wYXJlbnQudXJsP3RoaXMuX2xvYWRVcmwoZSk6ZT9lKG5ldyBFcnJvcihcInNvdW5kLnVybCBvciBzb3VuZC5zb3VyY2UgbXVzdCBiZSBzZXRcIikpOmNvbnNvbGUuZXJyb3IoXCJzb3VuZC51cmwgb3Igc291bmQuc291cmNlIG11c3QgYmUgc2V0XCIpfSxlLnByb3RvdHlwZS5fbG9hZFVybD1mdW5jdGlvbihlKXt2YXIgdD10aGlzLG49bmV3IFhNTEh0dHBSZXF1ZXN0LG89dGhpcy5wYXJlbnQudXJsO24ub3BlbihcIkdFVFwiLG8sITApLG4ucmVzcG9uc2VUeXBlPVwiYXJyYXlidWZmZXJcIixuLm9ubG9hZD1mdW5jdGlvbigpe3Quc291cmNlPW4ucmVzcG9uc2UsdC5fZGVjb2RlKG4ucmVzcG9uc2UsZSl9LG4uc2VuZCgpfSxlLnByb3RvdHlwZS5fZGVjb2RlPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpczt0aGlzLnBhcmVudC5jb250ZXh0LmRlY29kZShlLGZ1bmN0aW9uKGUsbyl7aWYoZSl0JiZ0KGUpO2Vsc2V7bi5wYXJlbnQuaXNMb2FkZWQ9ITAsbi5idWZmZXI9bzt2YXIgaT1uLnBhcmVudC5hdXRvUGxheVN0YXJ0KCk7dCYmdChudWxsLG4ucGFyZW50LGkpfX0pfSxlfSgpLHc9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXJldHVybiBlLnJlc29sdmVVcmw9ZnVuY3Rpb24odCl7dmFyIG49ZS5GT1JNQVRfUEFUVEVSTixvPVwic3RyaW5nXCI9PXR5cGVvZiB0P3Q6dC51cmw7aWYobi50ZXN0KG8pKXtmb3IodmFyIGk9bi5leGVjKG8pLHI9aVsyXS5zcGxpdChcIixcIikscz1yW3IubGVuZ3RoLTFdLHU9MCxhPXIubGVuZ3RoO3U8YTt1Kyspe3ZhciBjPXJbdV07aWYoZS5zdXBwb3J0ZWRbY10pe3M9YzticmVha319dmFyIGw9by5yZXBsYWNlKGlbMV0scyk7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIHQmJih0LmV4dGVuc2lvbj1zLHQudXJsPWwpLGx9cmV0dXJuIG99LGUuc2luZVRvbmU9ZnVuY3Rpb24oZSx0KXt2b2lkIDA9PT1lJiYoZT0yMDApLHZvaWQgMD09PXQmJih0PTEpO3ZhciBuPUkuZnJvbSh7c2luZ2xlSW5zdGFuY2U6ITB9KTtpZighKG4ubWVkaWEgaW5zdGFuY2VvZiBPKSlyZXR1cm4gbjtmb3IodmFyIG89bi5tZWRpYSxpPW4uY29udGV4dC5hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsNDhlMyp0LDQ4ZTMpLHI9aS5nZXRDaGFubmVsRGF0YSgwKSxzPTA7czxyLmxlbmd0aDtzKyspe3ZhciB1PWUqKHMvaS5zYW1wbGVSYXRlKSpNYXRoLlBJO3Jbc109MipNYXRoLnNpbih1KX1yZXR1cm4gby5idWZmZXI9aSxuLmlzTG9hZGVkPSEwLG59LGUucmVuZGVyPWZ1bmN0aW9uKGUsdCl7dmFyIG49ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTt0PU9iamVjdC5hc3NpZ24oe3dpZHRoOjUxMixoZWlnaHQ6MTI4LGZpbGw6XCJibGFja1wifSx0fHx7fSksbi53aWR0aD10LndpZHRoLG4uaGVpZ2h0PXQuaGVpZ2h0O3ZhciBvPVBJWEkuQmFzZVRleHR1cmUuZnJvbUNhbnZhcyhuKTtpZighKGUubWVkaWEgaW5zdGFuY2VvZiBPKSlyZXR1cm4gbzt2YXIgaT1lLm1lZGlhO2NvbnNvbGUuYXNzZXJ0KCEhaS5idWZmZXIsXCJObyBidWZmZXIgZm91bmQsIGxvYWQgZmlyc3RcIik7dmFyIHI9bi5nZXRDb250ZXh0KFwiMmRcIik7ci5maWxsU3R5bGU9dC5maWxsO2Zvcih2YXIgcz1pLmJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKSx1PU1hdGguY2VpbChzLmxlbmd0aC90LndpZHRoKSxhPXQuaGVpZ2h0LzIsYz0wO2M8dC53aWR0aDtjKyspe2Zvcih2YXIgbD0xLHA9LTEsaD0wO2g8dTtoKyspe3ZhciBkPXNbYyp1K2hdO2Q8bCYmKGw9ZCksZD5wJiYocD1kKX1yLmZpbGxSZWN0KGMsKDErbCkqYSwxLE1hdGgubWF4KDEsKHAtbCkqYSkpfXJldHVybiBvfSxlLnBsYXlPbmNlPWZ1bmN0aW9uKHQsbil7dmFyIG89XCJhbGlhc1wiK2UuUExBWV9JRCsrO3JldHVybiBTLmluc3RhbmNlLmFkZChvLHt1cmw6dCxwcmVsb2FkOiEwLGF1dG9QbGF5OiEwLGxvYWRlZDpmdW5jdGlvbihlKXtlJiYoY29uc29sZS5lcnJvcihlKSxTLmluc3RhbmNlLnJlbW92ZShvKSxuJiZuKGUpKX0sY29tcGxldGU6ZnVuY3Rpb24oKXtTLmluc3RhbmNlLnJlbW92ZShvKSxuJiZuKG51bGwpfX0pLG99LGUuUExBWV9JRD0wLGUuRk9STUFUX1BBVFRFUk49L1xcLihcXHsoW15cXH1dKylcXH0pKFxcPy4qKT8kLyxlLmV4dGVuc2lvbnM9W1wibXAzXCIsXCJvZ2dcIixcIm9nYVwiLFwib3B1c1wiLFwibXBlZ1wiLFwid2F2XCIsXCJtNGFcIixcIm1wNFwiLFwiYWlmZlwiLFwid21hXCIsXCJtaWRcIl0sZS5zdXBwb3J0ZWQ9ZnVuY3Rpb24oKXt2YXIgdD17bTRhOlwibXA0XCIsb2dhOlwib2dnXCJ9LG49ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpLG89e307cmV0dXJuIGUuZXh0ZW5zaW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciBpPXRbZV18fGUscj1uLmNhblBsYXlUeXBlKFwiYXVkaW8vXCIrZSkucmVwbGFjZSgvXm5vJC8sXCJcIikscz1uLmNhblBsYXlUeXBlKFwiYXVkaW8vXCIraSkucmVwbGFjZSgvXm5vJC8sXCJcIik7b1tlXT0hIXJ8fCEhc30pLE9iamVjdC5mcmVlemUobyl9KCksZX0oKSxqPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4odCxuKXt2YXIgbz1lLmNhbGwodGhpcyx0LG4pfHx0aGlzO3JldHVybiBvLnVzZShBLnBsdWdpbiksby5wcmUoQS5yZXNvbHZlKSxvfXJldHVybiB0KG4sZSksbi5hZGRQaXhpTWlkZGxld2FyZT1mdW5jdGlvbih0KXtlLmFkZFBpeGlNaWRkbGV3YXJlLmNhbGwodGhpcyx0KX0sbn0oUElYSS5sb2FkZXJzLkxvYWRlciksQT1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt9cmV0dXJuIGUuaW5zdGFsbD1mdW5jdGlvbih0KXtlLl9zb3VuZD10LGUubGVnYWN5PXQudXNlTGVnYWN5LFBJWEkubG9hZGVycy5Mb2FkZXI9aixQSVhJLmxvYWRlci51c2UoZS5wbHVnaW4pLFBJWEkubG9hZGVyLnByZShlLnJlc29sdmUpfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcImxlZ2FjeVwiLHtzZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9UElYSS5sb2FkZXJzLlJlc291cmNlLG49dy5leHRlbnNpb25zO2U/bi5mb3JFYWNoKGZ1bmN0aW9uKGUpe3Quc2V0RXh0ZW5zaW9uWGhyVHlwZShlLHQuWEhSX1JFU1BPTlNFX1RZUEUuREVGQVVMVCksdC5zZXRFeHRlbnNpb25Mb2FkVHlwZShlLHQuTE9BRF9UWVBFLkFVRElPKX0pOm4uZm9yRWFjaChmdW5jdGlvbihlKXt0LnNldEV4dGVuc2lvblhoclR5cGUoZSx0LlhIUl9SRVNQT05TRV9UWVBFLkJVRkZFUiksdC5zZXRFeHRlbnNpb25Mb2FkVHlwZShlLHQuTE9BRF9UWVBFLlhIUil9KX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnJlc29sdmU9ZnVuY3Rpb24oZSx0KXt3LnJlc29sdmVVcmwoZSksdCgpfSxlLnBsdWdpbj1mdW5jdGlvbih0LG4pe3QuZGF0YSYmdy5leHRlbnNpb25zLmluZGV4T2YodC5leHRlbnNpb24pPi0xP3Quc291bmQ9ZS5fc291bmQuYWRkKHQubmFtZSx7bG9hZGVkOm4scHJlbG9hZDohMCx1cmw6dC51cmwsc291cmNlOnQuZGF0YX0pOm4oKX0sZX0oKSxGPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3RoaXMucGFyZW50PWUsT2JqZWN0LmFzc2lnbih0aGlzLHQpLHRoaXMuZHVyYXRpb249dGhpcy5lbmQtdGhpcy5zdGFydCxjb25zb2xlLmFzc2VydCh0aGlzLmR1cmF0aW9uPjAsXCJFbmQgdGltZSBtdXN0IGJlIGFmdGVyIHN0YXJ0IHRpbWVcIil9cmV0dXJuIGUucHJvdG90eXBlLnBsYXk9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMucGFyZW50LnBsYXkoT2JqZWN0LmFzc2lnbih7Y29tcGxldGU6ZSxzcGVlZDp0aGlzLnNwZWVkfHx0aGlzLnBhcmVudC5zcGVlZCxlbmQ6dGhpcy5lbmQsc3RhcnQ6dGhpcy5zdGFydH0pKX0sZS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3RoaXMucGFyZW50PW51bGx9LGV9KCksRT1mdW5jdGlvbihlKXtmdW5jdGlvbiBuKCl7dmFyIHQ9dGhpcyxvPW5ldyBuLkF1ZGlvQ29udGV4dCxpPW8uY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCkscj1vLmNyZWF0ZUFuYWx5c2VyKCk7cmV0dXJuIHIuY29ubmVjdChpKSxpLmNvbm5lY3Qoby5kZXN0aW5hdGlvbiksdD1lLmNhbGwodGhpcyxyLGkpfHx0aGlzLHQuX2N0eD1vLHQuX29mZmxpbmVDdHg9bmV3IG4uT2ZmbGluZUF1ZGlvQ29udGV4dCgxLDIsby5zYW1wbGVSYXRlKSx0Ll91bmxvY2tlZD0hMSx0LmNvbXByZXNzb3I9aSx0LmFuYWx5c2VyPXIsdC5ldmVudHM9bmV3IFBJWEkudXRpbHMuRXZlbnRFbWl0dGVyLHQudm9sdW1lPTEsdC5zcGVlZD0xLHQubXV0ZWQ9ITEsdC5wYXVzZWQ9ITEsXCJvbnRvdWNoc3RhcnRcImluIHdpbmRvdyYmXCJydW5uaW5nXCIhPT1vLnN0YXRlJiYodC5fdW5sb2NrKCksdC5fdW5sb2NrPXQuX3VubG9jay5iaW5kKHQpLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIix0Ll91bmxvY2ssITApLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsdC5fdW5sb2NrLCEwKSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIix0Ll91bmxvY2ssITApKSx0fXJldHVybiB0KG4sZSksbi5wcm90b3R5cGUuX3VubG9jaz1mdW5jdGlvbigpe3RoaXMuX3VubG9ja2VkfHwodGhpcy5wbGF5RW1wdHlTb3VuZCgpLFwicnVubmluZ1wiPT09dGhpcy5fY3R4LnN0YXRlJiYoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHRoaXMuX3VubG9jaywhMCksZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsdGhpcy5fdW5sb2NrLCEwKSxkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLHRoaXMuX3VubG9jaywhMCksdGhpcy5fdW5sb2NrZWQ9ITApKX0sbi5wcm90b3R5cGUucGxheUVtcHR5U291bmQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7ZS5idWZmZXI9dGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlcigxLDEsMjIwNTApLGUuY29ubmVjdCh0aGlzLl9jdHguZGVzdGluYXRpb24pLGUuc3RhcnQoMCwwLDApfSxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIkF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXt2YXIgZT13aW5kb3c7cmV0dXJuIGUuQXVkaW9Db250ZXh0fHxlLndlYmtpdEF1ZGlvQ29udGV4dHx8bnVsbH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIk9mZmxpbmVBdWRpb0NvbnRleHRcIix7Z2V0OmZ1bmN0aW9uKCl7dmFyIGU9d2luZG93O3JldHVybiBlLk9mZmxpbmVBdWRpb0NvbnRleHR8fGUud2Via2l0T2ZmbGluZUF1ZGlvQ29udGV4dHx8bnVsbH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7ZS5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO3ZhciB0PXRoaXMuX2N0eDt2b2lkIDAhPT10LmNsb3NlJiZ0LmNsb3NlKCksdGhpcy5ldmVudHMucmVtb3ZlQWxsTGlzdGVuZXJzKCksdGhpcy5hbmFseXNlci5kaXNjb25uZWN0KCksdGhpcy5jb21wcmVzc29yLmRpc2Nvbm5lY3QoKSx0aGlzLmFuYWx5c2VyPW51bGwsdGhpcy5jb21wcmVzc29yPW51bGwsdGhpcy5ldmVudHM9bnVsbCx0aGlzLl9vZmZsaW5lQ3R4PW51bGwsdGhpcy5fY3R4PW51bGx9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcImF1ZGlvQ29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY3R4fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcIm9mZmxpbmVDb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9vZmZsaW5lQ3R4fSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLnByb3RvdHlwZSxcInBhdXNlZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkfSxzZXQ6ZnVuY3Rpb24oZSl7ZSYmXCJydW5uaW5nXCI9PT10aGlzLl9jdHguc3RhdGU/dGhpcy5fY3R4LnN1c3BlbmQoKTplfHxcInN1c3BlbmRlZFwiIT09dGhpcy5fY3R4LnN0YXRlfHx0aGlzLl9jdHgucmVzdW1lKCksdGhpcy5fcGF1c2VkPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3RoaXMuZXZlbnRzLmVtaXQoXCJyZWZyZXNoXCIpfSxuLnByb3RvdHlwZS5yZWZyZXNoUGF1c2VkPWZ1bmN0aW9uKCl7dGhpcy5ldmVudHMuZW1pdChcInJlZnJlc2hQYXVzZWRcIil9LG4ucHJvdG90eXBlLnRvZ2dsZU11dGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tdXRlZD0hdGhpcy5tdXRlZCx0aGlzLnJlZnJlc2goKSx0aGlzLm11dGVkfSxuLnByb3RvdHlwZS50b2dnbGVQYXVzZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdXNlZD0hdGhpcy5wYXVzZWQsdGhpcy5yZWZyZXNoUGF1c2VkKCksdGhpcy5fcGF1c2VkfSxuLnByb3RvdHlwZS5kZWNvZGU9ZnVuY3Rpb24oZSx0KXt0aGlzLl9vZmZsaW5lQ3R4LmRlY29kZUF1ZGlvRGF0YShlLGZ1bmN0aW9uKGUpe3QobnVsbCxlKX0sZnVuY3Rpb24oKXt0KG5ldyBFcnJvcihcIlVuYWJsZSB0byBkZWNvZGUgZmlsZVwiKSl9KX0sbn0obiksTD1PYmplY3QuZnJlZXplKHtXZWJBdWRpb01lZGlhOk8sV2ViQXVkaW9JbnN0YW5jZTpQLFdlYkF1ZGlvTm9kZXM6eCxXZWJBdWRpb0NvbnRleHQ6RSxXZWJBdWRpb1V0aWxzOmx9KSxTPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe3RoaXMuaW5pdCgpfXJldHVybiBlLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc3VwcG9ydGVkJiYodGhpcy5fd2ViQXVkaW9Db250ZXh0PW5ldyBFKSx0aGlzLl9odG1sQXVkaW9Db250ZXh0PW5ldyBiLHRoaXMuX3NvdW5kcz17fSx0aGlzLnVzZUxlZ2FjeT0hdGhpcy5zdXBwb3J0ZWQsdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiY29udGV4dFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLmluaXQ9ZnVuY3Rpb24oKXtpZihlLmluc3RhbmNlKXRocm93IG5ldyBFcnJvcihcIlNvdW5kTGlicmFyeSBpcyBhbHJlYWR5IGNyZWF0ZWRcIik7dmFyIHQ9ZS5pbnN0YW5jZT1uZXcgZTtcInVuZGVmaW5lZFwiPT10eXBlb2YgUHJvbWlzZSYmKHdpbmRvdy5Qcm9taXNlPWEpLHZvaWQgMCE9PVBJWEkubG9hZGVycyYmQS5pbnN0YWxsKHQpLHZvaWQgMD09PXdpbmRvdy5fX3BpeGlTb3VuZCYmZGVsZXRlIHdpbmRvdy5fX3BpeGlTb3VuZDt2YXIgbz1QSVhJO3JldHVybiBvLnNvdW5kfHwoT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sXCJzb3VuZFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0LHtmaWx0ZXJzOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbX19LGh0bWxhdWRpbzp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGd9fSx3ZWJhdWRpbzp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEx9fSx1dGlsczp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHd9fSxTb3VuZDp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEl9fSxTb3VuZFNwcml0ZTp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEZ9fSxGaWx0ZXJhYmxlOntnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbn19LFNvdW5kTGlicmFyeTp7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGV9fX0pKSx0fSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJmaWx0ZXJzQWxsXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnVzZUxlZ2FjeT9bXTp0aGlzLl9jb250ZXh0LmZpbHRlcnN9LHNldDpmdW5jdGlvbihlKXt0aGlzLnVzZUxlZ2FjeXx8KHRoaXMuX2NvbnRleHQuZmlsdGVycz1lKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzdXBwb3J0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG51bGwhPT1FLkF1ZGlvQ29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24oZSx0KXtpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7dmFyIG49e307Zm9yKHZhciBvIGluIGUpe2k9dGhpcy5fZ2V0T3B0aW9ucyhlW29dLHQpO25bb109dGhpcy5hZGQobyxpKX1yZXR1cm4gbn1pZihcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYoY29uc29sZS5hc3NlcnQoIXRoaXMuX3NvdW5kc1tlXSxcIlNvdW5kIHdpdGggYWxpYXMgXCIrZStcIiBhbHJlYWR5IGV4aXN0cy5cIiksdCBpbnN0YW5jZW9mIEkpcmV0dXJuIHRoaXMuX3NvdW5kc1tlXT10LHQ7dmFyIGk9dGhpcy5fZ2V0T3B0aW9ucyh0KSxyPUkuZnJvbShpKTtyZXR1cm4gdGhpcy5fc291bmRzW2VdPXIscn19LGUucHJvdG90eXBlLl9nZXRPcHRpb25zPWZ1bmN0aW9uKGUsdCl7dmFyIG47cmV0dXJuIG49XCJzdHJpbmdcIj09dHlwZW9mIGU/e3VybDplfTplIGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ8fGUgaW5zdGFuY2VvZiBIVE1MQXVkaW9FbGVtZW50P3tzb3VyY2U6ZX06ZSxPYmplY3QuYXNzaWduKG4sdHx8e30pfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJ1c2VMZWdhY3lcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3VzZUxlZ2FjeX0sc2V0OmZ1bmN0aW9uKGUpe0EubGVnYWN5PWUsdGhpcy5fdXNlTGVnYWN5PWUsIWUmJnRoaXMuc3VwcG9ydGVkP3RoaXMuX2NvbnRleHQ9dGhpcy5fd2ViQXVkaW9Db250ZXh0OnRoaXMuX2NvbnRleHQ9dGhpcy5faHRtbEF1ZGlvQ29udGV4dH0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZXhpc3RzKGUsITApLHRoaXMuX3NvdW5kc1tlXS5kZXN0cm95KCksZGVsZXRlIHRoaXMuX3NvdW5kc1tlXSx0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJ2b2x1bWVBbGxcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQudm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fY29udGV4dC52b2x1bWU9ZSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJzcGVlZEFsbFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dC5zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX2NvbnRleHQuc3BlZWQ9ZSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS50b2dnbGVQYXVzZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnRvZ2dsZVBhdXNlKCl9LGUucHJvdG90eXBlLnBhdXNlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQucGF1c2VkPSEwLHRoaXMuX2NvbnRleHQucmVmcmVzaCgpLHRoaXN9LGUucHJvdG90eXBlLnJlc3VtZUFsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9jb250ZXh0LnBhdXNlZD0hMSx0aGlzLl9jb250ZXh0LnJlZnJlc2goKSx0aGlzfSxlLnByb3RvdHlwZS50b2dnbGVNdXRlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQudG9nZ2xlTXV0ZSgpfSxlLnByb3RvdHlwZS5tdXRlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQubXV0ZWQ9ITAsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUudW5tdXRlQWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHQubXV0ZWQ9ITEsdGhpcy5fY29udGV4dC5yZWZyZXNoKCksdGhpc30sZS5wcm90b3R5cGUucmVtb3ZlQWxsPWZ1bmN0aW9uKCl7Zm9yKHZhciBlIGluIHRoaXMuX3NvdW5kcyl0aGlzLl9zb3VuZHNbZV0uZGVzdHJveSgpLGRlbGV0ZSB0aGlzLl9zb3VuZHNbZV07cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLnN0b3BBbGw9ZnVuY3Rpb24oKXtmb3IodmFyIGUgaW4gdGhpcy5fc291bmRzKXRoaXMuX3NvdW5kc1tlXS5zdG9wKCk7cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLmV4aXN0cz1mdW5jdGlvbihlLHQpe3ZvaWQgMD09PXQmJih0PSExKTt2YXIgbj0hIXRoaXMuX3NvdW5kc1tlXTtyZXR1cm4gdCYmY29uc29sZS5hc3NlcnQobixcIk5vIHNvdW5kIG1hdGNoaW5nIGFsaWFzICdcIitlK1wiJy5cIiksbn0sZS5wcm90b3R5cGUuZmluZD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5leGlzdHMoZSwhMCksdGhpcy5fc291bmRzW2VdfSxlLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuZmluZChlKS5wbGF5KHQpfSxlLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkuc3RvcCgpfSxlLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLnBhdXNlKCl9LGUucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5maW5kKGUpLnJlc3VtZSgpfSxlLnByb3RvdHlwZS52b2x1bWU9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzLmZpbmQoZSk7cmV0dXJuIHZvaWQgMCE9PXQmJihuLnZvbHVtZT10KSxuLnZvbHVtZX0sZS5wcm90b3R5cGUuc3BlZWQ9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzLmZpbmQoZSk7cmV0dXJuIHZvaWQgMCE9PXQmJihuLnNwZWVkPXQpLG4uc3BlZWR9LGUucHJvdG90eXBlLmR1cmF0aW9uPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmZpbmQoZSkuZHVyYXRpb259LGUucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmVtb3ZlQWxsKCksdGhpcy5fc291bmRzPW51bGwsdGhpcy5fd2ViQXVkaW9Db250ZXh0JiYodGhpcy5fd2ViQXVkaW9Db250ZXh0LmRlc3Ryb3koKSx0aGlzLl93ZWJBdWRpb0NvbnRleHQ9bnVsbCksdGhpcy5faHRtbEF1ZGlvQ29udGV4dCYmKHRoaXMuX2h0bWxBdWRpb0NvbnRleHQuZGVzdHJveSgpLHRoaXMuX2h0bWxBdWRpb0NvbnRleHQ9bnVsbCksdGhpcy5fY29udGV4dD1udWxsLHRoaXN9LGV9KCksST1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXt0aGlzLm1lZGlhPWUsdGhpcy5vcHRpb25zPXQsdGhpcy5faW5zdGFuY2VzPVtdLHRoaXMuX3Nwcml0ZXM9e30sdGhpcy5tZWRpYS5pbml0KHRoaXMpO3ZhciBuPXQuY29tcGxldGU7dGhpcy5fYXV0b1BsYXlPcHRpb25zPW4/e2NvbXBsZXRlOm59Om51bGwsdGhpcy5pc0xvYWRlZD0hMSx0aGlzLmlzUGxheWluZz0hMSx0aGlzLmF1dG9QbGF5PXQuYXV0b1BsYXksdGhpcy5zaW5nbGVJbnN0YW5jZT10LnNpbmdsZUluc3RhbmNlLHRoaXMucHJlbG9hZD10LnByZWxvYWR8fHRoaXMuYXV0b1BsYXksdGhpcy51cmw9dC51cmwsdGhpcy5zcGVlZD10LnNwZWVkLHRoaXMudm9sdW1lPXQudm9sdW1lLHRoaXMubG9vcD10Lmxvb3AsdC5zcHJpdGVzJiZ0aGlzLmFkZFNwcml0ZXModC5zcHJpdGVzKSx0aGlzLnByZWxvYWQmJnRoaXMuX3ByZWxvYWQodC5sb2FkZWQpfXJldHVybiBlLmZyb209ZnVuY3Rpb24odCl7dmFyIG49e307cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIHQ/bi51cmw9dDp0IGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ8fHQgaW5zdGFuY2VvZiBIVE1MQXVkaW9FbGVtZW50P24uc291cmNlPXQ6bj10LChuPU9iamVjdC5hc3NpZ24oe2F1dG9QbGF5OiExLHNpbmdsZUluc3RhbmNlOiExLHVybDpudWxsLHNvdXJjZTpudWxsLHByZWxvYWQ6ITEsdm9sdW1lOjEsc3BlZWQ6MSxjb21wbGV0ZTpudWxsLGxvYWRlZDpudWxsLGxvb3A6ITF9LG4pKS51cmwmJihuLnVybD13LnJlc29sdmVVcmwobi51cmwpKSxPYmplY3QuZnJlZXplKG4pLG5ldyBlKFMuaW5zdGFuY2UudXNlTGVnYWN5P25ldyBzOm5ldyBPLG4pfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJjb250ZXh0XCIse2dldDpmdW5jdGlvbigpe3JldHVybiBTLmluc3RhbmNlLmNvbnRleHR9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc1BsYXlpbmc9ITEsdGhpcy5wYXVzZWQ9ITAsdGhpc30sZS5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNQbGF5aW5nPXRoaXMuX2luc3RhbmNlcy5sZW5ndGg+MCx0aGlzLnBhdXNlZD0hMSx0aGlzfSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJwYXVzZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3BhdXNlZD1lLHRoaXMucmVmcmVzaFBhdXNlZCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInNwZWVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zcGVlZH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3NwZWVkPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiZmlsdGVyc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tZWRpYS5maWx0ZXJzfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5tZWRpYS5maWx0ZXJzPWV9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksZS5wcm90b3R5cGUuYWRkU3ByaXRlcz1mdW5jdGlvbihlLHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXt2YXIgbj17fTtmb3IodmFyIG8gaW4gZSluW29dPXRoaXMuYWRkU3ByaXRlcyhvLGVbb10pO3JldHVybiBufWlmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXtjb25zb2xlLmFzc2VydCghdGhpcy5fc3ByaXRlc1tlXSxcIkFsaWFzIFwiK2UrXCIgaXMgYWxyZWFkeSB0YWtlblwiKTt2YXIgaT1uZXcgRih0aGlzLHQpO3JldHVybiB0aGlzLl9zcHJpdGVzW2VdPWksaX19LGUucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLl9yZW1vdmVJbnN0YW5jZXMoKSx0aGlzLnJlbW92ZVNwcml0ZXMoKSx0aGlzLm1lZGlhLmRlc3Ryb3koKSx0aGlzLm1lZGlhPW51bGwsdGhpcy5fc3ByaXRlcz1udWxsLHRoaXMuX2luc3RhbmNlcz1udWxsfSxlLnByb3RvdHlwZS5yZW1vdmVTcHJpdGVzPWZ1bmN0aW9uKGUpe2lmKGUpe3ZhciB0PXRoaXMuX3Nwcml0ZXNbZV07dm9pZCAwIT09dCYmKHQuZGVzdHJveSgpLGRlbGV0ZSB0aGlzLl9zcHJpdGVzW2VdKX1lbHNlIGZvcih2YXIgbiBpbiB0aGlzLl9zcHJpdGVzKXRoaXMucmVtb3ZlU3ByaXRlcyhuKTtyZXR1cm4gdGhpc30sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiaXNQbGF5YWJsZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc0xvYWRlZCYmdGhpcy5tZWRpYSYmdGhpcy5tZWRpYS5pc1BsYXlhYmxlfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXtpZighdGhpcy5pc1BsYXlhYmxlKXJldHVybiB0aGlzLmF1dG9QbGF5PSExLHRoaXMuX2F1dG9QbGF5T3B0aW9ucz1udWxsLHRoaXM7dGhpcy5pc1BsYXlpbmc9ITE7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgtMTtlPj0wO2UtLSl0aGlzLl9pbnN0YW5jZXNbZV0uc3RvcCgpO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS5wbGF5PWZ1bmN0aW9uKGUsdCl7dmFyIG4sbz10aGlzO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlP249e3Nwcml0ZTpyPWUsY29tcGxldGU6dH06XCJmdW5jdGlvblwiPT10eXBlb2YgZT8obj17fSkuY29tcGxldGU9ZTpuPWUsKG49T2JqZWN0LmFzc2lnbih7Y29tcGxldGU6bnVsbCxsb2FkZWQ6bnVsbCxzcHJpdGU6bnVsbCxlbmQ6bnVsbCxzdGFydDowLHZvbHVtZToxLHNwZWVkOjEsbXV0ZWQ6ITEsbG9vcDohMX0sbnx8e30pKS5zcHJpdGUpe3ZhciBpPW4uc3ByaXRlO2NvbnNvbGUuYXNzZXJ0KCEhdGhpcy5fc3ByaXRlc1tpXSxcIkFsaWFzIFwiK2krXCIgaXMgbm90IGF2YWlsYWJsZVwiKTt2YXIgcj10aGlzLl9zcHJpdGVzW2ldO24uc3RhcnQ9ci5zdGFydCxuLmVuZD1yLmVuZCxuLnNwZWVkPXIuc3BlZWR8fDEsZGVsZXRlIG4uc3ByaXRlfWlmKG4ub2Zmc2V0JiYobi5zdGFydD1uLm9mZnNldCksIXRoaXMuaXNMb2FkZWQpcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGUsdCl7by5hdXRvUGxheT0hMCxvLl9hdXRvUGxheU9wdGlvbnM9bixvLl9wcmVsb2FkKGZ1bmN0aW9uKG8saSxyKXtvP3Qobyk6KG4ubG9hZGVkJiZuLmxvYWRlZChvLGksciksZShyKSl9KX0pO3RoaXMuc2luZ2xlSW5zdGFuY2UmJnRoaXMuX3JlbW92ZUluc3RhbmNlcygpO3ZhciBzPXRoaXMuX2NyZWF0ZUluc3RhbmNlKCk7cmV0dXJuIHRoaXMuX2luc3RhbmNlcy5wdXNoKHMpLHRoaXMuaXNQbGF5aW5nPSEwLHMub25jZShcImVuZFwiLGZ1bmN0aW9uKCl7bi5jb21wbGV0ZSYmbi5jb21wbGV0ZShvKSxvLl9vbkNvbXBsZXRlKHMpfSkscy5vbmNlKFwic3RvcFwiLGZ1bmN0aW9uKCl7by5fb25Db21wbGV0ZShzKX0pLHMucGxheShuKSxzfSxlLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgsdD0wO3Q8ZTt0KyspdGhpcy5faW5zdGFuY2VzW3RdLnJlZnJlc2goKX0sZS5wcm90b3R5cGUucmVmcmVzaFBhdXNlZD1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9pbnN0YW5jZXMubGVuZ3RoLHQ9MDt0PGU7dCsrKXRoaXMuX2luc3RhbmNlc1t0XS5yZWZyZXNoUGF1c2VkKCl9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLnByb3RvdHlwZSxcInZvbHVtZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdm9sdW1lfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fdm9sdW1lPWUsdGhpcy5yZWZyZXNoKCl9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwibXV0ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX211dGVkfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbXV0ZWQ9ZSx0aGlzLnJlZnJlc2goKX0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJsb29wXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9sb29wfSxzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5fbG9vcD1lLHRoaXMucmVmcmVzaCgpfSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGUucHJvdG90eXBlLl9wcmVsb2FkPWZ1bmN0aW9uKGUpe3RoaXMubWVkaWEubG9hZChlKX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwiaW5zdGFuY2VzXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pbnN0YW5jZXN9LGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUucHJvdG90eXBlLFwic3ByaXRlc1wiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3ByaXRlc30sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZS5wcm90b3R5cGUsXCJkdXJhdGlvblwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tZWRpYS5kdXJhdGlvbn0sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxlLnByb3RvdHlwZS5hdXRvUGxheVN0YXJ0PWZ1bmN0aW9uKCl7dmFyIGU7cmV0dXJuIHRoaXMuYXV0b1BsYXkmJihlPXRoaXMucGxheSh0aGlzLl9hdXRvUGxheU9wdGlvbnMpKSxlfSxlLnByb3RvdHlwZS5fcmVtb3ZlSW5zdGFuY2VzPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX2luc3RhbmNlcy5sZW5ndGgtMTtlPj0wO2UtLSl0aGlzLl9wb29sSW5zdGFuY2UodGhpcy5faW5zdGFuY2VzW2VdKTt0aGlzLl9pbnN0YW5jZXMubGVuZ3RoPTB9LGUucHJvdG90eXBlLl9vbkNvbXBsZXRlPWZ1bmN0aW9uKGUpe2lmKHRoaXMuX2luc3RhbmNlcyl7dmFyIHQ9dGhpcy5faW5zdGFuY2VzLmluZGV4T2YoZSk7dD4tMSYmdGhpcy5faW5zdGFuY2VzLnNwbGljZSh0LDEpLHRoaXMuaXNQbGF5aW5nPXRoaXMuX2luc3RhbmNlcy5sZW5ndGg+MH10aGlzLl9wb29sSW5zdGFuY2UoZSl9LGUucHJvdG90eXBlLl9jcmVhdGVJbnN0YW5jZT1mdW5jdGlvbigpe2lmKGUuX3Bvb2wubGVuZ3RoPjApe3ZhciB0PWUuX3Bvb2wucG9wKCk7cmV0dXJuIHQuaW5pdCh0aGlzLm1lZGlhKSx0fXJldHVybiB0aGlzLm1lZGlhLmNyZWF0ZSgpfSxlLnByb3RvdHlwZS5fcG9vbEluc3RhbmNlPWZ1bmN0aW9uKHQpe3QuZGVzdHJveSgpLGUuX3Bvb2wuaW5kZXhPZih0KTwwJiZlLl9wb29sLnB1c2godCl9LGUuX3Bvb2w9W10sZX0oKSxDPVMuaW5pdCgpO2Uuc291bmQ9QyxlLmZpbHRlcnM9bSxlLmh0bWxhdWRpbz1nLGUud2ViYXVkaW89TCxlLkZpbHRlcmFibGU9bixlLlNvdW5kPUksZS5Tb3VuZExpYnJhcnk9UyxlLlNvdW5kU3ByaXRlPUYsZS51dGlscz13LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLXNvdW5kLmpzLm1hcFxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIiFmdW5jdGlvbih0KXtmdW5jdGlvbiBlKGkpe2lmKG5baV0pcmV0dXJuIG5baV0uZXhwb3J0czt2YXIgcj1uW2ldPXtleHBvcnRzOnt9LGlkOmksbG9hZGVkOiExfTtyZXR1cm4gdFtpXS5jYWxsKHIuZXhwb3J0cyxyLHIuZXhwb3J0cyxlKSxyLmxvYWRlZD0hMCxyLmV4cG9ydHN9dmFyIG49e307cmV0dXJuIGUubT10LGUuYz1uLGUucD1cIlwiLGUoMCl9KFtmdW5jdGlvbih0LGUsbil7dC5leHBvcnRzPW4oNil9LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPVBJWEl9LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG49e2xpbmVhcjpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdH19LGluUXVhZDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0fX0sb3V0UXVhZDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCooMi10KX19LGluT3V0UXVhZDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LjUqdCp0Oi0uNSooLS10Kih0LTIpLTEpfX0saW5DdWJpYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0KnR9fSxvdXRDdWJpYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4tLXQqdCp0KzF9fSxpbk91dEN1YmljOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQqdDoodC09MiwuNSoodCp0KnQrMikpfX0saW5RdWFydDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCp0KnQqdH19LG91dFF1YXJ0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLSAtLXQqdCp0KnR9fSxpbk91dFF1YXJ0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0Kj0yLDE+dD8uNSp0KnQqdCp0Oih0LT0yLC0uNSoodCp0KnQqdC0yKSl9fSxpblF1aW50OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqdCp0KnR9fSxvdXRRdWludDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4tLXQqdCp0KnQqdCsxfX0saW5PdXRRdWludDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LjUqdCp0KnQqdCp0Oih0LT0yLC41Kih0KnQqdCp0KnQrMikpfX0saW5TaW5lOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxLU1hdGguY29zKHQqTWF0aC5QSS8yKX19LG91dFNpbmU6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIE1hdGguc2luKHQqTWF0aC5QSS8yKX19LGluT3V0U2luZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4uNSooMS1NYXRoLmNvcyhNYXRoLlBJKnQpKX19LGluRXhwbzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMD09PXQ/MDpNYXRoLnBvdygxMDI0LHQtMSl9fSxvdXRFeHBvOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiAxPT09dD8xOjEtTWF0aC5wb3coMiwtMTAqdCl9fSxpbk91dEV4cG86ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDA9PT10PzA6MT09PXQ/MToodCo9MiwxPnQ/LjUqTWF0aC5wb3coMTAyNCx0LTEpOi41KigtTWF0aC5wb3coMiwtMTAqKHQtMSkpKzIpKX19LGluQ2lyYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS1NYXRoLnNxcnQoMS10KnQpfX0sb3V0Q2lyYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zcXJ0KDEtIC0tdCp0KX19LGluT3V0Q2lyYzpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdCo9MiwxPnQ/LS41KihNYXRoLnNxcnQoMS10KnQpLTEpOi41KihNYXRoLnNxcnQoMS0odC0yKSoodC0yKSkrMSl9fSxpbkVsYXN0aWM6ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/LjE6YXJndW1lbnRzWzBdLGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPy40OmFyZ3VtZW50c1sxXTtyZXR1cm4gZnVuY3Rpb24obil7dmFyIGk9dm9pZCAwO3JldHVybiAwPT09bj8wOjE9PT1uPzE6KCF0fHwxPnQ/KHQ9MSxpPWUvNCk6aT1lKk1hdGguYXNpbigxL3QpLygyKk1hdGguUEkpLC0odCpNYXRoLnBvdygyLDEwKihuLTEpKSpNYXRoLnNpbigobi0xLWkpKigyKk1hdGguUEkpL2UpKSl9fSxvdXRFbGFzdGljOmZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdPy4xOmFyZ3VtZW50c1swXSxlPWFyZ3VtZW50cy5sZW5ndGg8PTF8fHZvaWQgMD09PWFyZ3VtZW50c1sxXT8uNDphcmd1bWVudHNbMV07cmV0dXJuIGZ1bmN0aW9uKG4pe3ZhciBpPXZvaWQgMDtyZXR1cm4gMD09PW4/MDoxPT09bj8xOighdHx8MT50Pyh0PTEsaT1lLzQpOmk9ZSpNYXRoLmFzaW4oMS90KS8oMipNYXRoLlBJKSx0Kk1hdGgucG93KDIsLTEwKm4pKk1hdGguc2luKChuLWkpKigyKk1hdGguUEkpL2UpKzEpfX0saW5PdXRFbGFzdGljOmZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdPy4xOmFyZ3VtZW50c1swXSxlPWFyZ3VtZW50cy5sZW5ndGg8PTF8fHZvaWQgMD09PWFyZ3VtZW50c1sxXT8uNDphcmd1bWVudHNbMV07cmV0dXJuIGZ1bmN0aW9uKG4pe3ZhciBpPXZvaWQgMDtyZXR1cm4gMD09PW4/MDoxPT09bj8xOighdHx8MT50Pyh0PTEsaT1lLzQpOmk9ZSpNYXRoLmFzaW4oMS90KS8oMipNYXRoLlBJKSxuKj0yLDE+bj8tLjUqKHQqTWF0aC5wb3coMiwxMCoobi0xKSkqTWF0aC5zaW4oKG4tMS1pKSooMipNYXRoLlBJKS9lKSk6dCpNYXRoLnBvdygyLC0xMCoobi0xKSkqTWF0aC5zaW4oKG4tMS1pKSooMipNYXRoLlBJKS9lKSouNSsxKX19LGluQmFjazpmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIG49dHx8MS43MDE1ODtyZXR1cm4gZSplKigobisxKSplLW4pfX0sb3V0QmFjazpmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIG49dHx8MS43MDE1ODtyZXR1cm4tLWUqZSooKG4rMSkqZStuKSsxfX0saW5PdXRCYWNrOmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj0xLjUyNSoodHx8MS43MDE1OCk7cmV0dXJuIGUqPTIsMT5lPy41KihlKmUqKChuKzEpKmUtbikpOi41KigoZS0yKSooZS0yKSooKG4rMSkqKGUtMikrbikrMil9fSxpbkJvdW5jZTpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gMS1uLm91dEJvdW5jZSgpKDEtdCl9fSxvdXRCb3VuY2U6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIDEvMi43NT50PzcuNTYyNSp0KnQ6Mi8yLjc1PnQ/KHQtPTEuNS8yLjc1LDcuNTYyNSp0KnQrLjc1KToyLjUvMi43NT50Pyh0LT0yLjI1LzIuNzUsNy41NjI1KnQqdCsuOTM3NSk6KHQtPTIuNjI1LzIuNzUsNy41NjI1KnQqdCsuOTg0Mzc1KX19LGluT3V0Qm91bmNlOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybi41PnQ/LjUqbi5pbkJvdW5jZSgpKDIqdCk6LjUqbi5vdXRCb3VuY2UoKSgyKnQtMSkrLjV9fSxjdXN0b21BcnJheTpmdW5jdGlvbih0KXtyZXR1cm4gdD9mdW5jdGlvbih0KXtyZXR1cm4gdH06bi5saW5lYXIoKX19O2VbXCJkZWZhdWx0XCJdPW59LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19ZnVuY3Rpb24gcih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIGU9e307aWYobnVsbCE9dClmb3IodmFyIG4gaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxuKSYmKGVbbl09dFtuXSk7cmV0dXJuIGVbXCJkZWZhdWx0XCJdPXQsZX1mdW5jdGlvbiBzKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX1mdW5jdGlvbiBvKHQsZSl7aWYoIXQpdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO3JldHVybiFlfHxcIm9iamVjdFwiIT10eXBlb2YgZSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZT90OmV9ZnVuY3Rpb24gYSh0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiK3R5cGVvZiBlKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxlJiYoT2JqZWN0LnNldFByb3RvdHlwZU9mP09iamVjdC5zZXRQcm90b3R5cGVPZih0LGUpOnQuX19wcm90b19fPWUpfWZ1bmN0aW9uIHUodCxlLG4saSxyLHMpe2Zvcih2YXIgbyBpbiB0KWlmKGModFtvXSkpdSh0W29dLGVbb10sbltvXSxpLHIscyk7ZWxzZXt2YXIgYT1lW29dLGg9dFtvXS1lW29dLGw9aSxmPXIvbDtuW29dPWEraCpzKGYpfX1mdW5jdGlvbiBoKHQsZSxuKXtmb3IodmFyIGkgaW4gdCkwPT09ZVtpXXx8ZVtpXXx8KGMobltpXSk/KGVbaV09SlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShuW2ldKSksaCh0W2ldLGVbaV0sbltpXSkpOmVbaV09bltpXSl9ZnVuY3Rpb24gYyh0KXtyZXR1cm5cIltvYmplY3QgT2JqZWN0XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpfXZhciBsPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgaT1lW25dO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbiYmdChlLnByb3RvdHlwZSxuKSxpJiZ0KGUsaSksZX19KCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGY9bigxKSxwPXIoZiksZD1uKDIpLGc9aShkKSx2PWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUodCxuKXtzKHRoaXMsZSk7dmFyIGk9byh0aGlzLE9iamVjdC5nZXRQcm90b3R5cGVPZihlKS5jYWxsKHRoaXMpKTtyZXR1cm4gaS50YXJnZXQ9dCxuJiZpLmFkZFRvKG4pLGkuY2xlYXIoKSxpfXJldHVybiBhKGUsdCksbChlLFt7a2V5OlwiYWRkVG9cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5tYW5hZ2VyPXQsdGhpcy5tYW5hZ2VyLmFkZFR3ZWVuKHRoaXMpLHRoaXN9fSx7a2V5OlwiY2hhaW5cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdHx8KHQ9bmV3IGUodGhpcy50YXJnZXQpKSx0aGlzLl9jaGFpblR3ZWVuPXQsdH19LHtrZXk6XCJzdGFydFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYWN0aXZlPSEwLHRoaXN9fSx7a2V5Olwic3RvcFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYWN0aXZlPSExLHRoaXMuZW1pdChcInN0b3BcIiksdGhpc319LHtrZXk6XCJ0b1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl90bz10LHRoaXN9fSx7a2V5OlwiZnJvbVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9mcm9tPXQsdGhpc319LHtrZXk6XCJyZW1vdmVcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1hbmFnZXI/KHRoaXMubWFuYWdlci5yZW1vdmVUd2Vlbih0aGlzKSx0aGlzKTp0aGlzfX0se2tleTpcImNsZWFyXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLnRpbWU9MCx0aGlzLmFjdGl2ZT0hMSx0aGlzLmVhc2luZz1nW1wiZGVmYXVsdFwiXS5saW5lYXIoKSx0aGlzLmV4cGlyZT0hMSx0aGlzLnJlcGVhdD0wLHRoaXMubG9vcD0hMSx0aGlzLmRlbGF5PTAsdGhpcy5waW5nUG9uZz0hMSx0aGlzLmlzU3RhcnRlZD0hMSx0aGlzLmlzRW5kZWQ9ITEsdGhpcy5fdG89bnVsbCx0aGlzLl9mcm9tPW51bGwsdGhpcy5fZGVsYXlUaW1lPTAsdGhpcy5fZWxhcHNlZFRpbWU9MCx0aGlzLl9yZXBlYXQ9MCx0aGlzLl9waW5nUG9uZz0hMSx0aGlzLl9jaGFpblR3ZWVuPW51bGwsdGhpcy5wYXRoPW51bGwsdGhpcy5wYXRoUmV2ZXJzZT0hMSx0aGlzLnBhdGhGcm9tPTAsdGhpcy5wYXRoVG89MH19LHtrZXk6XCJyZXNldFwiLHZhbHVlOmZ1bmN0aW9uKCl7aWYodGhpcy5fZWxhcHNlZFRpbWU9MCx0aGlzLl9yZXBlYXQ9MCx0aGlzLl9kZWxheVRpbWU9MCx0aGlzLmlzU3RhcnRlZD0hMSx0aGlzLmlzRW5kZWQ9ITEsdGhpcy5waW5nUG9uZyYmdGhpcy5fcGluZ1Bvbmcpe3ZhciB0PXRoaXMuX3RvLGU9dGhpcy5fZnJvbTt0aGlzLl90bz1lLHRoaXMuX2Zyb209dCx0aGlzLl9waW5nUG9uZz0hMX1yZXR1cm4gdGhpc319LHtrZXk6XCJ1cGRhdGVcIix2YWx1ZTpmdW5jdGlvbih0LGUpe2lmKHRoaXMuX2NhblVwZGF0ZSgpfHwhdGhpcy5fdG8mJiF0aGlzLnBhdGgpe3ZhciBuPXZvaWQgMCxpPXZvaWQgMDtpZih0aGlzLmRlbGF5PnRoaXMuX2RlbGF5VGltZSlyZXR1cm4gdm9pZCh0aGlzLl9kZWxheVRpbWUrPWUpO3RoaXMuaXNTdGFydGVkfHwodGhpcy5fcGFyc2VEYXRhKCksdGhpcy5pc1N0YXJ0ZWQ9ITAsdGhpcy5lbWl0KFwic3RhcnRcIikpO3ZhciByPXRoaXMucGluZ1Bvbmc/dGhpcy50aW1lLzI6dGhpcy50aW1lO2lmKHI+dGhpcy5fZWxhcHNlZFRpbWUpe3ZhciBzPXRoaXMuX2VsYXBzZWRUaW1lK2Usbz1zPj1yO3RoaXMuX2VsYXBzZWRUaW1lPW8/cjpzLHRoaXMuX2FwcGx5KHIpO3ZhciBhPXRoaXMuX3BpbmdQb25nP3IrdGhpcy5fZWxhcHNlZFRpbWU6dGhpcy5fZWxhcHNlZFRpbWU7aWYodGhpcy5lbWl0KFwidXBkYXRlXCIsYSksbyl7aWYodGhpcy5waW5nUG9uZyYmIXRoaXMuX3BpbmdQb25nKXJldHVybiB0aGlzLl9waW5nUG9uZz0hMCxuPXRoaXMuX3RvLGk9dGhpcy5fZnJvbSx0aGlzLl9mcm9tPW4sdGhpcy5fdG89aSx0aGlzLnBhdGgmJihuPXRoaXMucGF0aFRvLGk9dGhpcy5wYXRoRnJvbSx0aGlzLnBhdGhUbz1pLHRoaXMucGF0aEZyb209biksdGhpcy5lbWl0KFwicGluZ3BvbmdcIiksdm9pZCh0aGlzLl9lbGFwc2VkVGltZT0wKTtpZih0aGlzLmxvb3B8fHRoaXMucmVwZWF0PnRoaXMuX3JlcGVhdClyZXR1cm4gdGhpcy5fcmVwZWF0KyssdGhpcy5lbWl0KFwicmVwZWF0XCIsdGhpcy5fcmVwZWF0KSx0aGlzLl9lbGFwc2VkVGltZT0wLHZvaWQodGhpcy5waW5nUG9uZyYmdGhpcy5fcGluZ1BvbmcmJihuPXRoaXMuX3RvLGk9dGhpcy5fZnJvbSx0aGlzLl90bz1pLHRoaXMuX2Zyb209bix0aGlzLnBhdGgmJihuPXRoaXMucGF0aFRvLGk9dGhpcy5wYXRoRnJvbSx0aGlzLnBhdGhUbz1pLHRoaXMucGF0aEZyb209biksdGhpcy5fcGluZ1Bvbmc9ITEpKTt0aGlzLmlzRW5kZWQ9ITAsdGhpcy5hY3RpdmU9ITEsdGhpcy5lbWl0KFwiZW5kXCIpLHRoaXMuX2NoYWluVHdlZW4mJih0aGlzLl9jaGFpblR3ZWVuLmFkZFRvKHRoaXMubWFuYWdlciksdGhpcy5fY2hhaW5Ud2Vlbi5zdGFydCgpKX19fX19LHtrZXk6XCJfcGFyc2VEYXRhXCIsdmFsdWU6ZnVuY3Rpb24oKXtpZighdGhpcy5pc1N0YXJ0ZWQmJih0aGlzLl9mcm9tfHwodGhpcy5fZnJvbT17fSksaCh0aGlzLl90byx0aGlzLl9mcm9tLHRoaXMudGFyZ2V0KSx0aGlzLnBhdGgpKXt2YXIgdD10aGlzLnBhdGgudG90YWxEaXN0YW5jZSgpO3RoaXMucGF0aFJldmVyc2U/KHRoaXMucGF0aEZyb209dCx0aGlzLnBhdGhUbz0wKToodGhpcy5wYXRoRnJvbT0wLHRoaXMucGF0aFRvPXQpfX19LHtrZXk6XCJfYXBwbHlcIix2YWx1ZTpmdW5jdGlvbih0KXtpZih1KHRoaXMuX3RvLHRoaXMuX2Zyb20sdGhpcy50YXJnZXQsdCx0aGlzLl9lbGFwc2VkVGltZSx0aGlzLmVhc2luZyksdGhpcy5wYXRoKXt2YXIgZT10aGlzLnBpbmdQb25nP3RoaXMudGltZS8yOnRoaXMudGltZSxuPXRoaXMucGF0aEZyb20saT10aGlzLnBhdGhUby10aGlzLnBhdGhGcm9tLHI9ZSxzPXRoaXMuX2VsYXBzZWRUaW1lL3Isbz1uK2kqdGhpcy5lYXNpbmcocyksYT10aGlzLnBhdGguZ2V0UG9pbnRBdERpc3RhbmNlKG8pO3RoaXMudGFyZ2V0LnBvc2l0aW9uLnNldChhLngsYS55KX19fSx7a2V5OlwiX2NhblVwZGF0ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGltZSYmdGhpcy5hY3RpdmUmJnRoaXMudGFyZ2V0fX1dKSxlfShwLnV0aWxzLkV2ZW50RW1pdHRlcik7ZVtcImRlZmF1bHRcIl09dn0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1mdW5jdGlvbiByKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgcz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIGk9ZVtuXTtpLmVudW1lcmFibGU9aS5lbnVtZXJhYmxlfHwhMSxpLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBpJiYoaS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsaS5rZXksaSl9fXJldHVybiBmdW5jdGlvbihlLG4saSl7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksaSYmdChlLGkpLGV9fSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBvPW4oMyksYT1pKG8pLHU9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7cih0aGlzLHQpLHRoaXMudHdlZW5zPVtdLHRoaXMuX3R3ZWVuc1RvRGVsZXRlPVtdLHRoaXMuX2xhc3Q9MH1yZXR1cm4gcyh0LFt7a2V5OlwidXBkYXRlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dm9pZCAwO3R8fDA9PT10P2U9MWUzKnQ6KGU9dGhpcy5fZ2V0RGVsdGFNUygpLHQ9ZS8xZTMpO2Zvcih2YXIgbj0wO248dGhpcy50d2VlbnMubGVuZ3RoO24rKyl7dmFyIGk9dGhpcy50d2VlbnNbbl07aS5hY3RpdmUmJihpLnVwZGF0ZSh0LGUpLGkuaXNFbmRlZCYmaS5leHBpcmUmJmkucmVtb3ZlKCkpfWlmKHRoaXMuX3R3ZWVuc1RvRGVsZXRlLmxlbmd0aCl7Zm9yKHZhciBuPTA7bjx0aGlzLl90d2VlbnNUb0RlbGV0ZS5sZW5ndGg7bisrKXRoaXMuX3JlbW92ZSh0aGlzLl90d2VlbnNUb0RlbGV0ZVtuXSk7dGhpcy5fdHdlZW5zVG9EZWxldGUubGVuZ3RoPTB9fX0se2tleTpcImdldFR3ZWVuc0ZvclRhcmdldFwiLHZhbHVlOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT1bXSxuPTA7bjx0aGlzLnR3ZWVucy5sZW5ndGg7bisrKXRoaXMudHdlZW5zW25dLnRhcmdldD09PXQmJmUucHVzaCh0aGlzLnR3ZWVuc1tuXSk7cmV0dXJuIGV9fSx7a2V5OlwiY3JlYXRlVHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gbmV3IGFbXCJkZWZhdWx0XCJdKHQsdGhpcyl9fSx7a2V5OlwiYWRkVHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0KXt0Lm1hbmFnZXI9dGhpcyx0aGlzLnR3ZWVucy5wdXNoKHQpfX0se2tleTpcInJlbW92ZVR3ZWVuXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5fdHdlZW5zVG9EZWxldGUucHVzaCh0KX19LHtrZXk6XCJfcmVtb3ZlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy50d2VlbnMuaW5kZXhPZih0KTstMSE9PWUmJnRoaXMudHdlZW5zLnNwbGljZShlLDEpfX0se2tleTpcIl9nZXREZWx0YU1TXCIsdmFsdWU6ZnVuY3Rpb24oKXswPT09dGhpcy5fbGFzdCYmKHRoaXMuX2xhc3Q9RGF0ZS5ub3coKSk7dmFyIHQ9RGF0ZS5ub3coKSxlPXQtdGhpcy5fbGFzdDtyZXR1cm4gdGhpcy5fbGFzdD10LGV9fV0pLHR9KCk7ZVtcImRlZmF1bHRcIl09dX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBlPXt9O2lmKG51bGwhPXQpZm9yKHZhciBuIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbikmJihlW25dPXRbbl0pO3JldHVybiBlW1wiZGVmYXVsdFwiXT10LGV9ZnVuY3Rpb24gcih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9dmFyIHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciBpPWVbbl07aS5lbnVtZXJhYmxlPWkuZW51bWVyYWJsZXx8ITEsaS5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gaSYmKGkud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGkua2V5LGkpfX1yZXR1cm4gZnVuY3Rpb24oZSxuLGkpe3JldHVybiBuJiZ0KGUucHJvdG90eXBlLG4pLGkmJnQoZSxpKSxlfX0oKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgbz1uKDEpLGE9aShvKSx1PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3IodGhpcyx0KSx0aGlzLl9jb2xzZWQ9ITEsdGhpcy5wb2x5Z29uPW5ldyBhLlBvbHlnb24sdGhpcy5wb2x5Z29uLmNsb3NlZD0hMSx0aGlzLl90bXBQb2ludD1uZXcgYS5Qb2ludCx0aGlzLl90bXBQb2ludDI9bmV3IGEuUG9pbnQsdGhpcy5fdG1wRGlzdGFuY2U9W10sdGhpcy5jdXJyZW50UGF0aD1udWxsLHRoaXMuZ3JhcGhpY3NEYXRhPVtdLHRoaXMuZGlydHk9ITB9cmV0dXJuIHModCxbe2tleTpcIm1vdmVUb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIGEuR3JhcGhpY3MucHJvdG90eXBlLm1vdmVUby5jYWxsKHRoaXMsdCxlKSx0aGlzLmRpcnR5PSEwLHRoaXN9fSx7a2V5OlwibGluZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUubGluZVRvLmNhbGwodGhpcyx0LGUpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJiZXppZXJDdXJ2ZVRvXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSxyLHMpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5iZXppZXJDdXJ2ZVRvLmNhbGwodGhpcyx0LGUsbixpLHIscyksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcInF1YWRyYXRpY0N1cnZlVG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixpKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUucXVhZHJhdGljQ3VydmVUby5jYWxsKHRoaXMsdCxlLG4saSksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImFyY1RvXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4saSxyKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUuYXJjVG8uY2FsbCh0aGlzLHQsZSxuLGksciksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImFyY1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLGkscixzKXtyZXR1cm4gYS5HcmFwaGljcy5wcm90b3R5cGUuYXJjLmNhbGwodGhpcyx0LGUsbixpLHIscyksdGhpcy5kaXJ0eT0hMCx0aGlzfX0se2tleTpcImRyYXdTaGFwZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBhLkdyYXBoaWNzLnByb3RvdHlwZS5kcmF3U2hhcGUuY2FsbCh0aGlzLHQpLHRoaXMuZGlydHk9ITAsdGhpc319LHtrZXk6XCJnZXRQb2ludFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMucGFyc2VQb2ludHMoKTt2YXIgZT10aGlzLmNsb3NlZCYmdD49dGhpcy5sZW5ndGgtMT8wOjIqdDtyZXR1cm4gdGhpcy5fdG1wUG9pbnQuc2V0KHRoaXMucG9seWdvbi5wb2ludHNbZV0sdGhpcy5wb2x5Z29uLnBvaW50c1tlKzFdKSx0aGlzLl90bXBQb2ludH19LHtrZXk6XCJkaXN0YW5jZUJldHdlZW5cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3RoaXMucGFyc2VQb2ludHMoKTt2YXIgbj10aGlzLmdldFBvaW50KHQpLGk9bi54LHI9bi55LHM9dGhpcy5nZXRQb2ludChlKSxvPXMueCxhPXMueSx1PW8taSxoPWEtcjtyZXR1cm4gTWF0aC5zcXJ0KHUqdStoKmgpfX0se2tleTpcInRvdGFsRGlzdGFuY2VcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMucGFyc2VQb2ludHMoKSx0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGg9MCx0aGlzLl90bXBEaXN0YW5jZS5wdXNoKDApO2Zvcih2YXIgdD10aGlzLmxlbmd0aCxlPTAsbj0wO3QtMT5uO24rKyllKz10aGlzLmRpc3RhbmNlQmV0d2VlbihuLG4rMSksdGhpcy5fdG1wRGlzdGFuY2UucHVzaChlKTtyZXR1cm4gZX19LHtrZXk6XCJnZXRQb2ludEF0XCIsdmFsdWU6ZnVuY3Rpb24odCl7aWYodGhpcy5wYXJzZVBvaW50cygpLHQ+dGhpcy5sZW5ndGgpcmV0dXJuIHRoaXMuZ2V0UG9pbnQodGhpcy5sZW5ndGgtMSk7aWYodCUxPT09MClyZXR1cm4gdGhpcy5nZXRQb2ludCh0KTt0aGlzLl90bXBQb2ludDIuc2V0KDAsMCk7dmFyIGU9dCUxLG49dGhpcy5nZXRQb2ludChNYXRoLmNlaWwodCkpLGk9bi54LHI9bi55LHM9dGhpcy5nZXRQb2ludChNYXRoLmZsb29yKHQpKSxvPXMueCxhPXMueSx1PS0oKG8taSkqZSksaD0tKChhLXIpKmUpO3JldHVybiB0aGlzLl90bXBQb2ludDIuc2V0KG8rdSxhK2gpLHRoaXMuX3RtcFBvaW50Mn19LHtrZXk6XCJnZXRQb2ludEF0RGlzdGFuY2VcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLnBhcnNlUG9pbnRzKCksdGhpcy5fdG1wRGlzdGFuY2V8fHRoaXMudG90YWxEaXN0YW5jZSgpO3ZhciBlPXRoaXMuX3RtcERpc3RhbmNlLmxlbmd0aCxuPTAsaT10aGlzLl90bXBEaXN0YW5jZVt0aGlzLl90bXBEaXN0YW5jZS5sZW5ndGgtMV07MD50P3Q9aSt0OnQ+aSYmKHQtPWkpO2Zvcih2YXIgcj0wO2U+ciYmKHQ+PXRoaXMuX3RtcERpc3RhbmNlW3JdJiYobj1yKSwhKHQ8dGhpcy5fdG1wRGlzdGFuY2Vbcl0pKTtyKyspO2lmKG49PT10aGlzLmxlbmd0aC0xKXJldHVybiB0aGlzLmdldFBvaW50QXQobik7dmFyIHM9dC10aGlzLl90bXBEaXN0YW5jZVtuXSxvPXRoaXMuX3RtcERpc3RhbmNlW24rMV0tdGhpcy5fdG1wRGlzdGFuY2Vbbl07cmV0dXJuIHRoaXMuZ2V0UG9pbnRBdChuK3Mvbyl9fSx7a2V5OlwicGFyc2VQb2ludHNcIix2YWx1ZTpmdW5jdGlvbigpe2lmKCF0aGlzLmRpcnR5KXJldHVybiB0aGlzO3RoaXMuZGlydHk9ITEsdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGg9MDtmb3IodmFyIHQ9MDt0PHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aDt0Kyspe3ZhciBlPXRoaXMuZ3JhcGhpY3NEYXRhW3RdLnNoYXBlO2UmJmUucG9pbnRzJiYodGhpcy5wb2x5Z29uLnBvaW50cz10aGlzLnBvbHlnb24ucG9pbnRzLmNvbmNhdChlLnBvaW50cykpfXJldHVybiB0aGlzfX0se2tleTpcImNsZWFyXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoPTAsdGhpcy5jdXJyZW50UGF0aD1udWxsLHRoaXMucG9seWdvbi5wb2ludHMubGVuZ3RoPTAsdGhpcy5fY2xvc2VkPSExLHRoaXMuZGlydHk9ITEsdGhpc319LHtrZXk6XCJjbG9zZWRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY2xvc2VkfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5fY2xvc2VkIT09dCYmKHRoaXMucG9seWdvbi5jbG9zZWQ9dCx0aGlzLl9jbG9zZWQ9dCx0aGlzLmRpcnR5PSEwKX19LHtrZXk6XCJsZW5ndGhcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGg/dGhpcy5wb2x5Z29uLnBvaW50cy5sZW5ndGgvMisodGhpcy5fY2xvc2VkPzE6MCk6MH19XSksdH0oKTtlW1wiZGVmYXVsdFwiXT11fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gaSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fWZ1bmN0aW9uIHIodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBlPXt9O2lmKG51bGwhPXQpZm9yKHZhciBuIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbikmJihlW25dPXRbbl0pO3JldHVybiBlW1wiZGVmYXVsdFwiXT10LGV9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHM9bigxKSxvPXIocyksYT1uKDQpLHU9aShhKSxoPW4oMyksYz1pKGgpLGw9big1KSxmPWkobCkscD1uKDIpLGQ9aShwKTtvLkdyYXBoaWNzLnByb3RvdHlwZS5kcmF3UGF0aD1mdW5jdGlvbih0KXtyZXR1cm4gdC5wYXJzZVBvaW50cygpLHRoaXMuZHJhd1NoYXBlKHQucG9seWdvbiksdGhpc307dmFyIGc9e1R3ZWVuTWFuYWdlcjp1W1wiZGVmYXVsdFwiXSxUd2VlbjpjW1wiZGVmYXVsdFwiXSxFYXNpbmc6ZFtcImRlZmF1bHRcIl0sVHdlZW5QYXRoOmZbXCJkZWZhdWx0XCJdfTtvLnR3ZWVuTWFuYWdlcnx8KG8udHdlZW5NYW5hZ2VyPW5ldyB1W1wiZGVmYXVsdFwiXSxvLnR3ZWVuPWcpLGVbXCJkZWZhdWx0XCJdPWd9XSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXhpLXR3ZWVuLmpzLm1hcCIsIm1vZHVsZS5leHBvcnRzPXtcclxuICBcIkFcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGwxLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogZmFsc2UsXHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImNlbGwxLWZpbGwucG5nXCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogOCxcclxuICAgIFwic2NvcmVcIjogMVxyXG4gIH0sXHJcbiAgXCJCXCI6IHtcclxuICAgIFwiaW1hZ2VcIjogXCJjZWxsMi5wbmdcIixcclxuICAgIFwiYWN0aXZlXCI6IGZhbHNlXHJcbiAgfSxcclxuICBcIkNcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGw0LnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogZmFsc2UsXHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImNlbGw0LWZpbGwucG5nXCIsXHJcbiAgICBcImFjdGl2YXRpb25cIjogMjIsXHJcbiAgICBcInNjb3JlXCI6IDNcclxuICB9LFxyXG4gIFwiSUNcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRDLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCIsXHJcbiAgICBcImFjdGlvblwiOiBcImhpc3RvcnlcIixcclxuICAgIFwiYWN0aXZhdGlvblwiOiAwXHJcbiAgfSxcclxuICBcIklUTFwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFRMLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSVRcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRULnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSVRSXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kVFIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJUlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZFIucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJhY3Rpb25cIjogXCJoaXN0b3J5XCIsXHJcbiAgICBcInBsYXllckRpclwiOiBcInRvcFwiXHJcbiAgfSxcclxuICBcIklCUlwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEJSLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSUJcIjoge1xyXG4gICAgXCJhY3RpdmF0aW9uSW1hZ2VcIjogXCJpc2xhbmRCLnBuZ1wiLFxyXG4gICAgXCJhY3RpdmVcIjogdHJ1ZSxcclxuICAgIFwicGxheWVyRGlyXCI6IFwidG9wXCJcclxuICB9LFxyXG4gIFwiSUJMXCI6IHtcclxuICAgIFwiYWN0aXZhdGlvbkltYWdlXCI6IFwiaXNsYW5kQkwucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIlxyXG4gIH0sXHJcbiAgXCJJTFwiOiB7XHJcbiAgICBcImFjdGl2YXRpb25JbWFnZVwiOiBcImlzbGFuZEwucG5nXCIsXHJcbiAgICBcImFjdGl2ZVwiOiB0cnVlLFxyXG4gICAgXCJwbGF5ZXJEaXJcIjogXCJ0b3BcIixcclxuICAgIFwiYWN0aW9uXCI6IFwiaGlzdG9yeVwiLFxyXG4gICAgXCJhY3RpdmF0aW9uXCI6IDBcclxuICB9XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHM9e1xyXG4gIFwibGV0XCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQVwiLCBcIkF8Q3xCXCIsIFwiQXxBfEF8QXxDfEJcIiwgXCJBXCJdLFxyXG4gICAgICBcInNodWZmbGVcIjogdHJ1ZSxcclxuICAgICAgXCJ0cmltXCI6IDNcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIkF8QXxDXCIsIFwiQXxCXCIsIFwiQVwiLCBcIkJcIiwgXCJBXCJdLFxyXG4gICAgICBcInNodWZmbGVcIjogdHJ1ZSxcclxuICAgIH1cclxuICBdLFxyXG4gIFwiZW5kXCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQVwiLCBcIkFcIiwgXCJBXCIsIFwiQVwiLCBcIkFcIl0sXHJcbiAgICB9XHJcbiAgXSxcclxuICBcImxhYmlyaW50XCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQVwiLCBcIkJcIiwgXCJCXCIsIFwiQlwiLCBcIkJcIl0sXHJcbiAgICAgIFwic2h1ZmZsZVwiOiB0cnVlXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJBXCIsIFwiQVwiLCBcIkFcIiwgXCJBXCIsIFwiQVwiXSxcclxuICAgIH1cclxuICBdLFxyXG4gIFwiaXNsYW5kXCI6IFtcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiQXxDfEJcIiwgXCJBXCIsIFwiQXxDfEJcIl1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIFwibWFwXCI6IFtcIklUTFwiLCBcIklUXCIsIFwiSVRSXCJdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBcIm1hcFwiOiBbXCJJTFwiLCAgXCJJQ1wiLCAgXCJJUlwiXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgXCJtYXBcIjogW1wiSUJMXCIsIFwiSUJcIiwgXCJJQlJcIl1cclxuICAgIH1cclxuICBdXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHM9W1xyXG4gIHtcclxuICAgIFwiZnJhZ21lbnRzXCI6IFtcclxuICAgICAge1wiaXNsYW5kXCI6IDF9LFxyXG4gICAgICB7XCJsZXRcIjogNH0sXHJcbiAgICAgIHtcImxhYmlyaW50XCI6IDV9LFxyXG4gICAgICB7XCJlbmRcIjogMX0sXHJcbiAgICAgIHtcImlzbGFuZFwiOiAxfSxcclxuICAgIF0sXHJcbiAgICBcImhpc3RvcnlcIjoge1xyXG4gICAgICBcInJ1XCI6IFwi0KLQu9C10L0g0LjQtNC10YIg0LfQsCDRgtC+0LHQvtC5INC/0L4g0L/Rj9GC0LDQvC4gXFxuINCe0YLRgdGC0YPQv9C40YHRjCDQuCDQvtC9INGC0LXQsdGPINC/0L7Qs9C70LDRgtC40YIuLi4gXFxuINCd0L4g0L3QtSDRgdGC0L7QuNGCINC+0YLRh9Cw0LjQstCw0YLRjNGB0Y8sINCy0LXQtNGMINC80YPQt9GL0LrQsCDQstGB0LXQs9C00LAg0YEg0YLQvtCx0L7QuS5cIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJmcmFnbWVudHNcIjogW1xyXG4gICAgICB7XCJsZXRcIjogMTB9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiAxMH0sXHJcbiAgICAgIHtcImVuZFwiOiAxfSxcclxuICAgICAge1wiaXNsYW5kXCI6IDF9XHJcbiAgICBdLFxyXG4gICAgXCJoaXN0b3J5XCI6IHtcclxuICAgICAgXCJydVwiOiBcItCi0LvQtdC9INC90LUg0YnQsNC00LjRgiDQvdC40LrQvtCz0L4uINCb0LXRgtGD0YfQuNC1INC30LzQtdC4INC/0LDQtNGD0YIg0L3QsCDQt9C10LzQu9GOINC4INC/0L7Qs9GA0YPQt9GP0YLRgdGPINCyINGA0YPRgtC40L3RgyDQsdGL0YLQuNGPLi4uXCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwiZnJhZ21lbnRzXCI6IFtcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wibGV0XCI6IDV9LFxyXG4gICAgICB7XCJsYWJpcmludFwiOiA1fSxcclxuICAgICAge1wiZW5kXCI6IDF9LFxyXG4gICAgICB7XCJpc2xhbmRcIjogMX1cclxuICAgIF0sXHJcbiAgICBcImhpc3RvcnlcIjoge1xyXG4gICAgICBcInJ1XCI6IFwi0Jgg0YLQvtCz0LTQsCDQvtC9INC/0L7QvdC10YEg0YHQstC10YfRgyDRh9C10YDQtdC3INGH0YPQttC40LUg0LfQtdC80LvQuCDQvtGB0LLQvtCx0L7QttC00LDRjyDQu9C10YLRg9GH0LjRhSDQt9C80LXQuSDQuCDRgdCy0L7QuSDQvdCw0YDQvtC0Li4uXCJcclxuICAgIH1cclxuICB9XHJcbl1cclxuIiwiY29uc3QgU2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4vbWFuYWdlcnMvU2NlbmVzTWFuYWdlcicpO1xyXG5cclxuY2xhc3MgR2FtZSBleHRlbmRzIFBJWEkuQXBwbGljYXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCwge2JhY2tncm91bmRDb2xvcjogMHhmY2ZjZmN9KVxyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xyXG5cclxuICAgIHRoaXMudyA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgdGhpcy5oID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuICAgIHRoaXMuc2NlbmVzID0gbmV3IFNjZW5lc01hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLnN0YWdlLmFkZENoaWxkKHRoaXMuc2NlbmVzKTtcclxuXHJcbiAgICB0aGlzLl9pbml0VGlja2VyKCk7XHJcbiAgfVxyXG4gIF9pbml0VGlja2VyKCkge1xyXG4gICAgdGhpcy50aWNrZXIuYWRkKChkdCkgPT4ge1xyXG4gICAgICB0aGlzLnNjZW5lcy51cGRhdGUoZHQpO1xyXG4gICAgICBQSVhJLnR3ZWVuTWFuYWdlci51cGRhdGUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xyXG4iLCJyZXF1aXJlKCdwaXhpLXNvdW5kJyk7XHJcbnJlcXVpcmUoJ3BpeGktdHdlZW4nKTtcclxucmVxdWlyZSgncGl4aS1wcm9qZWN0aW9uJyk7XHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKTtcclxuXHJcbldlYkZvbnQubG9hZCh7XHJcbiAgZ29vZ2xlOiB7XHJcbiAgICBmYW1pbGllczogWydBbWF0aWMgU0MnXVxyXG4gIH0sXHJcbiAgYWN0aXZlKCkge1xyXG4gICAgUElYSS5sb2FkZXJcclxuICAgICAgLmFkZCgnYmxvY2tzJywgJ2Fzc2V0cy9ibG9ja3MuanNvbicpXHJcbiAgICAgIC5hZGQoJ3BsYXllcicsICdhc3NldHMvcGxheWVyLnBuZycpXHJcbiAgICAgIC5hZGQoJ21hc2snLCAnYXNzZXRzL21hc2sucG5nJylcclxuICAgICAgLmFkZCgnbXVzaWMnLCAnYXNzZXRzL211c2ljLm1wMycpXHJcbiAgICAgIC5sb2FkKChsb2FkZXIsIHJlc291cmNlcykgPT4ge1xyXG4gICAgICAgIFBJWEkuc291bmQucGxheSgnbXVzaWMnKTtcclxuICAgICAgICBsZXQgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbiAgICAgICAgZ2FtZS5zY2VuZXMuZW5hYmxlU2NlbmUoJ3BsYXlncm91bmQnKTtcclxuXHJcbiAgICAgICAgd2luZG93LmdhbWUgPSBnYW1lO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4iLCJjbGFzcyBIaXN0b3J5TWFuYWdlciBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgc2NlbmUuYWRkQ2hpbGQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5hbHBoYSA9IDA7XHJcblxyXG4gICAgdGhpcy5iZyA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdtYXNrJykpO1xyXG4gICAgdGhpcy5iZy53aWR0aCA9IHRoaXMuZ2FtZS53O1xyXG4gICAgdGhpcy5iZy5oZWlnaHQgPSB0aGlzLmdhbWUuaCozLzQ7XHJcbiAgICB0aGlzLmJnLnggPSAwO1xyXG4gICAgdGhpcy5iZy55ID0gMDtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5iZyk7XHJcblxyXG4gICAgdGhpcy50ZXh0ID0gbmV3IFBJWEkuVGV4dCgnJywge1xyXG4gICAgICBmb250OiAnbm9ybWFsIDQwcHggQW1hdGljIFNDJyxcclxuICAgICAgd29yZFdyYXA6IHRydWUsXHJcbiAgICAgIHdvcmRXcmFwV2lkdGg6IHRoaXMuZ2FtZS53LzIsXHJcbiAgICAgIGZpbGw6ICcjMmQ1YmZmJyxcclxuICAgICAgcGFkZGluZzogMTAsXHJcbiAgICAgIGFsaWduOiAnY2VudGVyJ1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRleHQuYW5jaG9yLnNldCguNSk7XHJcbiAgICB0aGlzLnRleHQueCA9IHRoaXMuZ2FtZS53LzI7XHJcbiAgICB0aGlzLnRleHQueSA9IDE1MDtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy50ZXh0KTtcclxuICB9XHJcbiAgc2hvd1RleHQodHh0LCB0aW1lKSB7XHJcbiAgICB0aGlzLnRleHQuc2V0VGV4dCh0eHQpO1xyXG5cclxuICAgIGxldCBzaG93ID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBzaG93LmZyb20oe2FscGhhOiAwfSkudG8oe2FscGhhOiAxfSk7XHJcbiAgICBzaG93LnRpbWUgPSAxMDAwO1xyXG4gICAgc2hvdy5zdGFydCgpO1xyXG4gICAgdGhpcy5lbWl0KCdzaG93ZW4nKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KHRoaXMuaGlkZVRleHQuYmluZCh0aGlzKSwgdGltZSk7XHJcbiAgfVxyXG4gIGhpZGVUZXh0KCkge1xyXG4gICAgbGV0IGhpZGUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIGhpZGUuZnJvbSh7YWxwaGE6IDF9KS50byh7YWxwaGE6IDB9KTtcclxuICAgIGhpZGUudGltZSA9IDEwMDA7XHJcbiAgICBoaWRlLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmVtaXQoJ2hpZGRlbicpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIaXN0b3J5TWFuYWdlcjtcclxuIiwiLypcclxuICDQnNC10L3QtdC00LbQtdGAINGD0YDQvtCy0L3QtdC5LCDRgNCw0LHQvtGC0LDQtdGCINC90LDQv9GA0Y/QvNGD0Y4g0YEgTWFwTWFuYWdlclxyXG4gINC40YHQv9C+0LvRjNC30YPRjyDQtNCw0L3QvdGL0LUgbGV2ZWxzLmpzb24g0LggIGZyYWdtZW50cy5qc29uXHJcblxyXG4gINCh0L7QsdGL0YLQuNGPOlxyXG4gICAgYWRkZWRGcmFnbWVudHNEYXRhID0+IG5ldyBmcmFnbWVudHNEYXRhXHJcbiAgICBhZGRlZExldmVscyA9PiBuZXcgbGV2ZWxzXHJcbiAgICBhZGRlZExldmVsID0+IG5ldyBsdmxcclxuXHJcbiAgICBzd2l0Y2hlZExldmVsID0+IGN1ciBsdmxcclxuICAgIHdlbnROZXh0TGV2ZWwgPT4gY3VyIGx2bFxyXG4gICAgd2VudEJhY2tMZXZlbCA9PiBjdXIgbHZsXHJcbiAgICBzd2l0Y2hlZEZyYWdtZW50ID0+IGN1ciBmcmFnXHJcbiAgICB3ZW50TmV4dEZyYWdtZW50ID0+IGN1ciBmcmFnXHJcbiAgICB3ZW50QmFja0ZyYWdtZW50ID0+IGN1ciBmcmFnXHJcblxyXG4gICAgc3RhcnRlZExldmVsID0+IG5ldyBsdmxcclxuICAgIGVuZGVkTGV2ZWwgPT4gcHJldiBsdmxcclxuKi9cclxuXHJcblxyXG5jbGFzcyBMZXZlbE1hbmFnZXIgZXh0ZW5kcyBQSVhJLnV0aWxzLkV2ZW50RW1pdHRlciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUsIG1hcCkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB0aGlzLm1hcCA9IG1hcDtcclxuXHJcbiAgICB0aGlzLmxldmVscyA9IFtdO1xyXG4gICAgdGhpcy5mcmFnbWVudHNEYXRhID0ge307XHJcbiAgICB0aGlzLmFkZEZyYWdtZW50c0RhdGEocmVxdWlyZSgnLi4vY29udGVudC9mcmFnbWVudHMnKSk7XHJcbiAgICB0aGlzLmFkZExldmVscyhyZXF1aXJlKCcuLi9jb250ZW50L2xldmVscycpKVxyXG5cclxuICAgIHRoaXMuY3VyTGV2ZWxJbmRleCA9IDA7XHJcbiAgICB0aGlzLmN1ckZyYWdtZW50SW5kZXggPSAwO1xyXG4gIH1cclxuICAvLyBnZXR0ZXJzXHJcbiAgZ2V0Q3VycmVudExldmVsKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubGV2ZWxzW3RoaXMuY3VyTGV2ZWxJbmRleF07XHJcbiAgfVxyXG4gIGdldEN1cnJlbnRGcmFnbWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLmdldEN1cnJlbnRMZXZlbCgpICYmIHRoaXMuZ2V0Q3VycmVudExldmVsKCkubWFwc1t0aGlzLmN1ckZyYWdtZW50SW5kZXhdO1xyXG4gIH1cclxuXHJcbiAgLy8gYWRkIGZyYWdtZW50cyB0byBkYiBmcmFnbWVudHNcclxuICBhZGRGcmFnbWVudHNEYXRhKGRhdGE9e30pIHtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5mcmFnbWVudHNEYXRhLCBkYXRhKTtcclxuICAgIHRoaXMuZW1pdCgnYWRkZWRGcmFnbWVudHNEYXRhJywgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvLyBhZGQgbGV2ZWxzIHRvIGRiIGxldmVsc1xyXG4gIGFkZExldmVscyhsZXZlbHM9W10pIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsZXZlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5hZGRMZXZlbChsZXZlbHNbaV0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdhZGRlZExldmVscycsIGxldmVscyk7XHJcbiAgfVxyXG4gIGFkZExldmVsKGx2bD17fSkge1xyXG4gICAgdGhpcy5sZXZlbHMucHVzaChsdmwpO1xyXG5cclxuICAgIC8vIGdlbmVyYXRlZCBtYXBzIHRvIGx2bCBvYmplY3RcclxuICAgIGx2bC5tYXBzID0gW107XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgbHZsLmZyYWdtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBmb3IobGV0IGtleSBpbiBsdmwuZnJhZ21lbnRzW2ldKSB7XHJcbiAgICAgICAgZm9yKGxldCBjID0gMDsgYyA8IGx2bC5mcmFnbWVudHNbaV1ba2V5XTsgYysrKSB7XHJcbiAgICAgICAgICBsdmwubWFwcy5wdXNoKHRoaXMuZnJhZ21lbnRzRGF0YVtrZXldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuZW1pdCgnYWRkZWRMZXZlbCcsIGx2bCk7XHJcbiAgfVxyXG5cclxuICAvLyBNZXRob2RzIGZvciBsZXZlbHMgY29udHJvbFxyXG4gIHN3aXRjaExldmVsKGx2bCkge1xyXG4gICAgaWYobHZsID49IHRoaXMubGV2ZWxzLmxlbmd0aCB8fCBsdmwgPCAwKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5jdXJMZXZlbEluZGV4ID0gbHZsO1xyXG4gICAgdGhpcy5zd2l0Y2hGcmFnbWVudCgwKTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ3N0YXJ0ZWRMZXZlbCcpO1xyXG4gICAgdGhpcy5lbWl0KCdzd2l0Y2hlZExldmVsJyk7XHJcbiAgfVxyXG4gIG5leHRMZXZlbCgpIHtcclxuICAgIHRoaXMuc3dpdGNoTGV2ZWwodGhpcy5jdXJMZXZlbEluZGV4KzEpO1xyXG4gICAgdGhpcy5lbWl0KCd3ZW50TmV4dExldmVsJyk7XHJcbiAgfVxyXG4gIGJhY2tMZXZlbCgpIHtcclxuICAgIHRoaXMuc3dpdGNoTGV2ZWwodGhpcy5jdXJMZXZlbEluZGV4LTEpO1xyXG4gICAgdGhpcy5lbWl0KCd3ZW50QmFja0xldmVsJyk7XHJcbiAgfVxyXG5cclxuICAvLyBNZXRob2RzIGZvciBmcmFnbWVudHMgY29udHJvbFxyXG4gIHN3aXRjaEZyYWdtZW50KGZyYWcpIHtcclxuICAgIGlmKGZyYWcgPCAwKSByZXR1cm47XHJcbiAgICB0aGlzLmN1ckZyYWdtZW50SW5kZXggPSBmcmFnO1xyXG5cclxuICAgIGlmKHRoaXMuZ2V0Q3VycmVudEZyYWdtZW50KCkpIHRoaXMubWFwLmFkZE1hcCh0aGlzLmdldEN1cnJlbnRGcmFnbWVudCgpKTtcclxuICAgIGVsc2UgdGhpcy5lbWl0KCdlbmRlZExldmVsJyk7XHJcbiAgICB0aGlzLmVtaXQoJ3N3aXRjaGVkRnJhZ21lbnQnKTtcclxuICB9XHJcbiAgbmV4dEZyYWdtZW50KCkge1xyXG4gICAgdGhpcy5zd2l0Y2hGcmFnbWVudCh0aGlzLmN1ckZyYWdtZW50SW5kZXgrMSk7XHJcbiAgICB0aGlzLmVtaXQoJ3dlbnROZXh0RnJhZ21lbnQnKTtcclxuICB9XHJcbiAgYmFja0ZyYWdtZW50KCkge1xyXG4gICAgdGhpcy5zd2l0Y2hGcmFnbWVudCh0aGlzLmN1ckZyYWdtZW50SW5kZXgtMSk7XHJcbiAgICB0aGlzLmVtaXQoJ3dlbnRCYWNrRnJhZ21lbnQnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWxNYW5hZ2VyO1xyXG4iLCIvKlxyXG4gINCU0LLQuNC20L7QuiDRgtCw0LnQu9C+0LLQvtC5INC60LDRgNGC0YtcclxuICDQodC+0LHRi9GC0LjRjzpcclxuICAgIGFkZGVkTWFwID0+IG1hcFxyXG4gICAgYWRkZWRGcmFnbWVudCA9PiBmcmFnbWVudHNcclxuICAgIGFkZGVkQmxvY2sgPT4gYmxvY2tcclxuICAgIHNjcm9sbGVkRG93biA9PiBkdERvd25cclxuICAgIHNjcm9sbGVkVG9wID0+IGR0VG9wXHJcblxyXG4gICAgcmVzaXplZFxyXG4gICAgZW5kZWRNYXBcclxuICAgIGNsZWFyZWRPdXRSYW5nZUJsb2Nrc1xyXG4qL1xyXG5cclxuXHJcbmNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi4vc3ViamVjdHMvQmxvY2snKTtcclxuY29uc3QgRGF0YUZyYWdtZW50Q29udmVydGVyID0gcmVxdWlyZSgnLi4vdXRpbHMvRGF0YUZyYWdtZW50Q29udmVydGVyJyk7XHJcblxyXG5jbGFzcyBNYXBNYW5hZ2VyIGV4dGVuZHMgUElYSS5wcm9qZWN0aW9uLkNvbnRhaW5lcjJkIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSwgcGFyYW1zPXt9KSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgc2NlbmUuYWRkQ2hpbGQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5nYW1lID0gc2NlbmUuZ2FtZTtcclxuXHJcbiAgICB0aGlzLm1heEF4aXNYID0gcGFyYW1zLm1heFggfHwgNTtcclxuICAgIHRoaXMuYmxvY2tTaXplID0gcGFyYW1zLnRpbGVTaXplIHx8IDEwMDtcclxuICAgIHRoaXMuc2V0QmxvY2tzRGF0YShyZXF1aXJlKCcuLi9jb250ZW50L2Jsb2NrcycpKTtcclxuICAgIHRoaXMucmVzaXplKCk7XHJcblxyXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnNwZWVkID0gNTAwO1xyXG4gICAgdGhpcy5sYXN0SW5kZXggPSAwO1xyXG4gIH1cclxuICByZXNpemUoKSB7XHJcbiAgICB0aGlzLnggPSB0aGlzLmdhbWUudy8yLXRoaXMubWF4QXhpc1gqdGhpcy5ibG9ja1NpemUvMjtcclxuICAgIHRoaXMueSA9IHRoaXMuZ2FtZS5oLXRoaXMuc2NlbmUuUEFERElOR19CT1RUT007XHJcbiAgICB0aGlzLmVtaXQoJ3Jlc2l6ZWQnKTtcclxuICB9XHJcblxyXG4gIC8vIFNldCBwYXJhbXNcclxuICBzZXRCbG9ja3NEYXRhKGRhdGEpIHtcclxuICAgIHRoaXMuQkxPQ0tTID0gZGF0YSB8fCB7fTtcclxuICB9XHJcbiAgc2V0TWF4QXhpc1gobWF4KSB7XHJcbiAgICB0aGlzLm1heEF4aXNYID0gbWF4IHx8IDY7XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gIH1cclxuICBzZXRCbG9ja1NpemUoc2l6ZSkge1xyXG4gICAgdGhpcy5ibG9ja1NpemUgPSBzaXplIHx8IDEwMDtcclxuICAgIHRoaXMucmVzaXplKCk7XHJcbiAgfVxyXG4gIHNldFNwZWVkKHNwZWVkKSB7XHJcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQgfHwgNTAwO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIE1hcCBNYW5hZ2VyXHJcbiAgYWRkTWFwKG1hcCkge1xyXG4gICAgZm9yKGxldCBpID0gbWFwLmxlbmd0aC0xOyBpID49IDA7IGktLSkge1xyXG4gICAgICB0aGlzLmFkZEZyYWdtZW50KG1hcFtpXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkTWFwJywgbWFwKTtcclxuICAgIHRoaXMuY2xlYXJPdXRSYW5nZUJsb2NrcygpO1xyXG4gICAgdGhpcy5jb21wdXRpbmdNYXBFbmQoKTtcclxuICB9XHJcbiAgYWRkRnJhZ21lbnQoZnJhZ0RhdGEpIHtcclxuICAgIGxldCBmcmFnID0gbmV3IERhdGFGcmFnbWVudENvbnZlcnRlcihmcmFnRGF0YSkuZnJhZ21lbnQ7XHJcbiAgICAvLyBhZGQgYmxvY2sgdG8gY2VudGVyIFggYXhpcywgZm9yIGV4YW1wbGU6IHJvdW5kKCg4LTQpLzIpID0+ICsyIHBhZGRpbmcgdG8gYmxvY2sgWCBwb3NcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmcmFnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuYWRkQmxvY2soZnJhZ1tpXSwgTWF0aC5yb3VuZCgodGhpcy5tYXhBeGlzWC1mcmFnLmxlbmd0aCkvMikraSwgdGhpcy5sYXN0SW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGFzdEluZGV4Kys7XHJcbiAgICB0aGlzLmVtaXQoJ2FkZGVkRnJhZ21lbnQnLCBmcmFnRGF0YSk7XHJcbiAgfVxyXG4gIGFkZEJsb2NrKGlkLCB4LCB5KSB7XHJcbiAgICBpZihpZCA9PT0gJ18nKSByZXR1cm47XHJcblxyXG4gICAgbGV0IHBvc1ggPSB4KnRoaXMuYmxvY2tTaXplO1xyXG4gICAgbGV0IHBvc1kgPSAteSp0aGlzLmJsb2NrU2l6ZTtcclxuICAgIGxldCBibG9jayA9IHRoaXMuYWRkQ2hpbGQobmV3IEJsb2NrKHRoaXMsIHBvc1gsIHBvc1ksIHRoaXMuQkxPQ0tTW2lkXSkpO1xyXG4gICAgdGhpcy5lbWl0KCdhZGRlZEJsb2NrJywgYmxvY2spO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29sbGlzaW9uIFdpZGggQmxvY2tcclxuICBnZXRCbG9ja0Zyb21Qb3MocG9zKSB7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZih0aGlzLmNoaWxkcmVuW2ldLmNvbnRhaW5zUG9pbnQocG9zKSkgcmV0dXJuIHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBNb3ZpbmcgTWFwXHJcbiAgc2Nyb2xsRG93bihibG9ja3MpIHtcclxuICAgIGlmKHRoaXMuaXNTdG9wKSByZXR1cm47XHJcblxyXG4gICAgLy8gU2Nyb2xsIG1hcCBkb3duIG9uIFggYmxvY2tzXHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt5OiB0aGlzLnl9KS50byh7eTogdGhpcy55K2Jsb2Nrcyp0aGlzLmJsb2NrU2l6ZX0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZCpibG9ja3M7XHJcbiAgICBtb3ZlLm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZW1pdCgnc2Nyb2xsZWREb3duJywgYmxvY2tzKTtcclxuICAgICAgdGhpcy5jbGVhck91dFJhbmdlQmxvY2tzKCk7XHJcbiAgICAgIHRoaXMuY29tcHV0aW5nTWFwRW5kKCk7XHJcbiAgICB9KTtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuICB9XHJcbiAgc2Nyb2xsVG9wKGJsb2Nrcykge1xyXG4gICAgaWYodGhpcy5pc1N0b3ApIHJldHVybjtcclxuXHJcbiAgICAvLyBTY3JvbGwgbWFwIHRvcCBvbiBYIGJsb2Nrc1xyXG4gICAgbGV0IG1vdmUgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIG1vdmUuZnJvbSh7eTogdGhpcy55fSkudG8oe3k6IHRoaXMueS1ibG9ja3MqdGhpcy5ibG9ja1NpemV9KTtcclxuICAgIG1vdmUudGltZSA9IHRoaXMuc3BlZWQqYmxvY2tzO1xyXG4gICAgbW92ZS5vbignZW5kJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmVtaXQoJ3Njcm9sbGVkVG9wJywgYmxvY2tzKTtcclxuICAgICAgdGhpcy5jbGVhck91dFJhbmdlQmxvY2tzKCk7XHJcbiAgICAgIHRoaXMuY29tcHV0aW5nTWFwRW5kKCk7XHJcbiAgICB9KTtcclxuICAgIG1vdmUuc3RhcnQoKTtcclxuICB9XHJcblxyXG4gIC8vIENvbXB1dGluZyBtYXAgZW5kIChhbXQgYmxvY2tzIDwgbWF4IGFtdCBibG9ja3MpXHJcbiAgY29tcHV0aW5nTWFwRW5kKCkge1xyXG4gICAgaWYodGhpcy5jaGlsZHJlbi5sZW5ndGggPCB0aGlzLm1heEF4aXNYKih0aGlzLmdhbWUuaC90aGlzLmJsb2NrU2l6ZSkpIHtcclxuICAgICAgdGhpcy5lbWl0KCdlbmRlZE1hcCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gY2xlYXIgb3V0IHJhbmdlIG1hcCBibG9ja3NcclxuICBjbGVhck91dFJhbmdlQmxvY2tzKCkge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS53b3JsZFRyYW5zZm9ybS50eS10aGlzLmJsb2NrU2l6ZS8yID4gdGhpcy5nYW1lLmgpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuY2hpbGRyZW5baV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ2NsZWFyZWRPdXRSYW5nZUJsb2NrcycpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBNYW5hZ2VyO1xyXG4iLCIvKlxyXG4gINCa0LvQsNGB0YEg0LTQu9GPINC/0LXRgNC10LrQu9GO0YfQtdC90LjRjyDQstC40LTQuNC80L7Qs9C+INC60L7QvdGC0LXQudC90LXRgNCwICjRgNCw0LHQvtGH0LjRhSDRgdGG0LXQvSlcclxuICDQodC+0LHRi9GC0LjRjzpcclxuICAgIGFkZGVkU2NlbmVzID0+IHNjZW5lc1xyXG4gICAgYWRkZWRTY2VuZSA9PiBzY2VuZXNcclxuICAgIHJlbW92ZWRTY2VuZSA9PiBzY2VuZVxyXG4gICAgcmVzdGFydGVkU2NlbmUgPT4gc2NlbmVcclxuICAgIGRpc2FibGVkU2NlbmUgPT4gc2NlbmVcclxuICAgIGVuYWJsZWRTY2VuZSA9PiBzY2VuZXNcclxuICAgIHVwZGF0ZWQgPT4gZHRcclxuKi9cclxuXHJcbmNsYXNzIFNjZW5lc01hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgdGhpcy5zY2VuZXMgPSByZXF1aXJlKCcuLi9zY2VuZXMnKTtcclxuICAgIHRoaXMuYWN0aXZlU2NlbmUgPSBudWxsO1xyXG4gIH1cclxuICBnZXRTY2VuZShpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2NlbmVzW2lkXTtcclxuICB9XHJcblxyXG4gIC8vIGFkZGluZyBzY2VuZXNcclxuICBhZGRTY2VuZXMoc2NlbmVzKSB7XHJcbiAgICBmb3IobGV0IGlkIGluIHNjZW5lcykge1xyXG4gICAgICB0aGlzLmFkZFNjZW5lKGlkLCBzY2VuZXNbaWRdKTtcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdCgnYWRkZWRTY2VuZXMnLCBzY2VuZXMpO1xyXG4gIH1cclxuICBhZGRTY2VuZShpZCwgc2NlbmUpIHtcclxuICAgIHRoaXMuc2NlbmVzW2lkXSA9IHNjZW5lO1xyXG4gICAgdGhpcy5lbWl0KCdhZGRlZFNjZW5lJywgc2NlbmUpO1xyXG4gIH1cclxuICByZW1vdmVTY2VuZShpZCkge1xyXG4gICAgbGV0IF9zY2VuZSA9IHRoaXMuc2NlbmVzW2lkXTtcclxuICAgIHRoaXMuc2NlbmVzW2lkXSA9IG51bGw7XHJcbiAgICB0aGlzLmVtaXQoJ3JlbW92ZWRTY2VuZScsIF9zY2VuZSk7XHJcbiAgfVxyXG5cclxuICAvLyBDb250cm9sc1xyXG4gIHJlc3RhcnRTY2VuZSgpIHtcclxuICAgIHRoaXMuZW5hYmxlU2NlbmUodGhpcy5hY3RpdmVTY2VuZS5faWRTY2VuZSk7XHJcbiAgICB0aGlzLmVtaXQoJ3Jlc3RhcnRlZFNjZW5lJywgdGhpcy5hY3RpdmVTY2VuZSk7XHJcbiAgfVxyXG4gIGRpc2FibGVTY2VuZSgpIHtcclxuICAgIGxldCBzY2VuZSA9IHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5hY3RpdmVTY2VuZSk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gbnVsbDtcclxuICAgIHRoaXMuZW1pdCgnZGlzYWJsZWRTY2VuZScsIHNjZW5lKTtcclxuICB9XHJcbiAgZW5hYmxlU2NlbmUoaWQpIHtcclxuICAgIHRoaXMuZGlzYWJsZVNjZW5lKCk7XHJcblxyXG4gICAgbGV0IFNjZW5lID0gdGhpcy5nZXRTY2VuZShpZCk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gdGhpcy5hZGRDaGlsZChuZXcgU2NlbmUodGhpcy5nYW1lLCB0aGlzKSk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lLl9pZFNjZW5lID0gaWQ7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdlbmFibGVkU2NlbmUnLCB0aGlzLmFjdGl2ZVNjZW5lKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy5hY3RpdmVTY2VuZSAmJiB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZSAmJiB0aGlzLmFjdGl2ZVNjZW5lLnVwZGF0ZShkdCk7XHJcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZWQnLCBkdCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lc01hbmFnZXI7XHJcbiIsImNsYXNzIFNjcmVlbk1hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5NYW5hZ2VyO1xyXG4iLCJjb25zdCBNYXBNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvTWFwTWFuYWdlcicpO1xyXG5jb25zdCBMZXZlbE1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9MZXZlbE1hbmFnZXInKTtcclxuY29uc3QgSGlzdG9yeU1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9IaXN0b3J5TWFuYWdlcicpO1xyXG5jb25zdCBTY3JlZW5NYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvU2NyZWVuTWFuYWdlcicpO1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuLi9zdWJqZWN0cy9QbGF5ZXInKTtcclxuXHJcbmNsYXNzIFBsYXlncm91bmQgZXh0ZW5kcyBQSVhJLnByb2plY3Rpb24uQ29udGFpbmVyMmQge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIC8vIFByb2plY3Rpb24gc2NlbmVcclxuICAgIHRoaXMucHJvai5zZXRBeGlzWSh7eDogLXRoaXMuZ2FtZS53LzIrNTAsIHk6IDQwMDB9LCAtMSk7XHJcblxyXG4gICAgLy8gQ29uc3RhbnQgZm9yIHBvc2l0aW9uIG9iamVjdCBpbiBwcm9qZWN0aW9uXHJcbiAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIHRoaXMuUEFERElOR19CT1RUT00gPSAyODA7XHJcblxyXG4gICAgLy8gSW5pdCBvYmplY3RzXHJcbiAgICB0aGlzLm1hcCA9IG5ldyBNYXBNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5zY3JlZW4gPSBuZXcgU2NyZWVuTWFuYWdlcih0aGlzKTtcclxuICAgIHRoaXMuaGlzdG9yeSA9IG5ldyBIaXN0b3J5TWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICB0aGlzLmxldmVscyA9IG5ldyBMZXZlbE1hbmFnZXIodGhpcywgdGhpcy5tYXApO1xyXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMsIHRoaXMubWFwKTtcclxuXHJcblxyXG4gICAgLy8gQ29udHJvbHNcclxuICAgIHRoaXMub24oJ3BvaW50ZXJkb3duJywgKCkgPT4gdGhpcy5wbGF5ZXIuaW1tdW5pdHkoKSk7XHJcbiAgICB0aGlzLm9uKCdwb2ludGVybW92ZScsIChlKSA9PiB7XHJcbiAgICAgIGxldCBibG9jayA9IHRoaXMubWFwLmdldEJsb2NrRnJvbVBvcyhlLmRhdGEuZ2xvYmFsKTtcclxuICAgICAgYmxvY2sgJiYgYmxvY2suaGl0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnBsYXllci5vbignZGVhZGVkJywgKCkgPT4gdGhpcy5yZXN0YXJ0KCkpO1xyXG4gICAgdGhpcy5wbGF5ZXIub24oJ2NvbGxpc2lvbicsIChibG9jaykgPT4ge1xyXG4gICAgICBpZihibG9jay5hY3Rpb24gPT09ICdoaXN0b3J5JykgdGhpcy5oaXN0b3J5LnNob3dUZXh0KHRoaXMubGV2ZWxzLmdldEN1cnJlbnRMZXZlbCgpLmhpc3RvcnkucnUsIDMwMDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5oaXN0b3J5Lm9uKCdzaG93ZW4nLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubWFwLmlzU3RvcCA9IHRydWU7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuaGlzdG9yeS5vbignaGlkZGVuJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLm1hcC5pc1N0b3AgPSBmYWxzZTtcclxuICAgICAgdGhpcy5tYXAuc2Nyb2xsRG93bigxKTtcclxuICAgICAgdGhpcy5sZXZlbHMubmV4dExldmVsKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm1hcC5vbignZW5kZWRNYXAnLCAoKSA9PiB0aGlzLmxldmVscy5uZXh0RnJhZ21lbnQoKSk7XHJcbiAgICB0aGlzLm1hcC5vbignc2Nyb2xsZWREb3duJywgKCkgPT4gdGhpcy5wbGF5ZXIubW92aW5nKCkpO1xyXG5cclxuICAgIHRoaXMubGV2ZWxzLnN3aXRjaExldmVsKDApO1xyXG4gICAgdGhpcy5tYXAuc2Nyb2xsRG93bigxKTtcclxuICB9XHJcbiAgcmVzdGFydCgpIHtcclxuICAgIHRoaXMuZ2FtZS5zY2VuZXMucmVzdGFydFNjZW5lKCdwbGF5Z3JvdW5kJyk7XHJcblxyXG4gICAgLy8gdGhpcy5zY3JlZW4uc3BsYXNoKDB4RkZGRkZGLCAxMDAwKS50aGVuKCgpID0+IHtcclxuICAgIC8vICAgdGhpcy5nYW1lLnNjZW5lcy5yZXN0YXJ0U2NlbmUoJ3BsYXlncm91bmQnKTtcclxuICAgIC8vIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Z3JvdW5kO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAncGxheWdyb3VuZCc6IHJlcXVpcmUoJy4vUGxheWdyb3VuZCcpXHJcbn1cclxuIiwiLypcclxuICDQmtC70LDRgdGBINCR0LvQvtC60LAsINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y8g0YLQsNC50LvQvtCy0L7Qs9C+INC00LLQuNC20LrQsFxyXG4gINCh0L7QsdGL0YLQuNGPOlxyXG4gICAgYWN0aXZhdGVkXHJcbiAgICBkZWFjdGl2YXRlZFxyXG4gICAgaGl0ZWRcclxuKi9cclxuXHJcbmNsYXNzIEJsb2NrIGV4dGVuZHMgUElYSS5wcm9qZWN0aW9uLlNwcml0ZTJkIHtcclxuICBjb25zdHJ1Y3RvcihtYXAsIHgsIHksIHBhcmFtcz17fSkge1xyXG4gICAgc3VwZXIoUElYSS5UZXh0dXJlLmZyb21GcmFtZShwYXJhbXMuaW1hZ2UgfHwgcGFyYW1zLmFjdGl2YXRpb25JbWFnZSkpO1xyXG5cclxuICAgIHRoaXMubWFwID0gbWFwO1xyXG4gICAgdGhpcy5nYW1lID0gdGhpcy5tYXAuZ2FtZTtcclxuXHJcbiAgICB0aGlzLnNjb3JlID0gcGFyYW1zLnNjb3JlO1xyXG4gICAgdGhpcy5hY3RpdmF0aW9uID0gcGFyYW1zLmFjdGl2YXRpb24gfHwgbnVsbDtcclxuICAgIHRoaXMuZGVhY3RpdmF0aW9uVGV4dHVyZSA9IHBhcmFtcy5pbWFnZSA/IFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUocGFyYW1zLmltYWdlKSA6IG51bGw7XHJcbiAgICB0aGlzLmFjdGl2YXRpb25UZXh0dXJlID0gcGFyYW1zLmFjdGl2YXRpb25JbWFnZSA/IFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUocGFyYW1zLmFjdGl2YXRpb25JbWFnZSkgOiBudWxsO1xyXG4gICAgdGhpcy5pc0FjdGl2ZSA9IHBhcmFtcy5hY3RpdmU7XHJcbiAgICB0aGlzLnBsYXllckRpciA9IHBhcmFtcy5wbGF5ZXJEaXIgfHwgbnVsbDtcclxuICAgIHRoaXMuYWN0aW9uID0gcGFyYW1zLmFjdGlvbiB8fCBudWxsO1xyXG5cclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSk7XHJcbiAgICB0aGlzLndpZHRoID0gbWFwLmJsb2NrU2l6ZSsxO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBtYXAuYmxvY2tTaXplKzE7XHJcbiAgICB0aGlzLnggPSB4K21hcC5ibG9ja1NpemUvMisuNTtcclxuICAgIHRoaXMueSA9IHkrbWFwLmJsb2NrU2l6ZS8yKy41O1xyXG4gIH1cclxuICBhY3RpdmF0ZSgpIHtcclxuICAgIGxldCBhY3RpdmF0aW5nID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcylcclxuICAgICAgLmZyb20oe3dpZHRoOiB0aGlzLndpZHRoKjMvNCwgaGVpZ2h0OiB0aGlzLmhlaWdodCozLzR9KVxyXG4gICAgICAudG8oe3dpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0LCByb3RhdGlvbjogMH0pO1xyXG4gICAgYWN0aXZhdGluZy50aW1lID0gNTAwO1xyXG4gICAgYWN0aXZhdGluZy5lYXNpbmcgPSBQSVhJLnR3ZWVuLkVhc2luZy5vdXRCb3VuY2UoKTtcclxuICAgIGFjdGl2YXRpbmcuc3RhcnQoKTtcclxuXHJcbiAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcclxuICAgIGlmKHRoaXMuYWN0aXZhdGlvblRleHR1cmUpIHRoaXMudGV4dHVyZSA9IHRoaXMuYWN0aXZhdGlvblRleHR1cmU7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdhY3RpdmF0ZWQnKTtcclxuICB9XHJcbiAgZGVhY3RpdmF0ZSgpIHtcclxuICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcclxuICAgIGlmKHRoaXMuZGVhY3RpdmF0aW9uVGV4dHVyZSkgdGhpcy50ZXh0dXJlID0gdGhpcy5kZWFjdGl2YXRpb25UZXh0dXJlO1xyXG4gICAgdGhpcy5lbWl0KCdkZWFjdGl2YXRlZCcpO1xyXG4gIH1cclxuICBoaXQoKSB7XHJcbiAgICBpZih0aGlzLmFjdGl2YXRpb24gPT09IG51bGwgfHwgdGhpcy5pc0FjdGl2ZSkgcmV0dXJuO1xyXG5cclxuICAgIGxldCBqb2x0aW5nID0gUElYSS50d2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4odGhpcyk7XHJcbiAgICBqb2x0aW5nLmZyb20oe3JvdGF0aW9uOiAwfSkudG8oe3JvdGF0aW9uOiBNYXRoLnJhbmRvbSgpIDwgLjUgPyAtLjE1IDogLjE1fSk7XHJcbiAgICBqb2x0aW5nLnRpbWUgPSAxMDA7XHJcbiAgICBqb2x0aW5nLnBpbmdQb25nID0gdHJ1ZTtcclxuICAgIGpvbHRpbmcuc3RhcnQoKTtcclxuXHJcbiAgICBpZih0aGlzLmFjdGl2YXRpb24pIHRoaXMuYWN0aXZhdGlvbi0tO1xyXG4gICAgZWxzZSB0aGlzLmFjdGl2YXRlKCk7XHJcbiAgICB0aGlzLmVtaXQoJ2hpdGVkJyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCIvKlxyXG4gINCa0LvQsNGB0YEgUGxheWVyLCDQstC30LDQuNC80L7QtNC10LnRgdGC0LLRg9C10YIg0YEgTWFwTWFuYWdlclxyXG4gINCh0L7QsdGL0YLQuNGPXHJcblxyXG4qL1xyXG5cclxuY2xhc3MgUGxheWVyIGV4dGVuZHMgUElYSS5wcm9qZWN0aW9uLlNwcml0ZTJkIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSwgbWFwKSB7XHJcbiAgICBzdXBlcihQSVhJLlRleHR1cmUuZnJvbUltYWdlKCdwbGF5ZXInKSk7XHJcbiAgICBzY2VuZS5hZGRDaGlsZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBzY2VuZS5nYW1lO1xyXG4gICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xyXG4gICAgdGhpcy5tYXAgPSBtYXA7XHJcblxyXG4gICAgdGhpcy5wcm9qLmFmZmluZSA9IFBJWEkucHJvamVjdGlvbi5BRkZJTkUuQVhJU19YO1xyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41LCAxKTtcclxuICAgIHRoaXMuc2NhbGUuc2V0KC41KTtcclxuICAgIHRoaXMueCA9IHRoaXMuZ2FtZS53LzI7XHJcbiAgICB0aGlzLnkgPSB0aGlzLmdhbWUuaC10aGlzLm1hcC5ibG9ja1NpemUvMi10aGlzLnNjZW5lLlBBRERJTkdfQk9UVE9NO1xyXG5cclxuICAgIHRoaXMud2Fsa2luZyA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMuc2NhbGUpO1xyXG4gICAgdGhpcy53YWxraW5nLmZyb20oe3g6IC41LCB5OiAuNX0pLnRvKHt4OiAuNiwgeTogLjZ9KTtcclxuICAgIHRoaXMud2Fsa2luZy50aW1lID0gNTAwO1xyXG4gICAgdGhpcy53YWxraW5nLmxvb3AgPSB0cnVlO1xyXG4gICAgdGhpcy53YWxraW5nLnBpbmdQb25nID0gdHJ1ZTtcclxuICAgIHRoaXMud2Fsa2luZy5zdGFydCgpO1xyXG5cclxuICAgIHRoaXMubGFzdE1vdmUgPSBudWxsO1xyXG4gICAgdGhpcy5zcGVlZCA9IHRoaXMubWFwLnNwZWVkIHx8IDUwMDtcclxuICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5JTU1VTklUWV9CTE9DS1MgPSAyO1xyXG4gICAgdGhpcy5pbW11bml0eUNvdW50ID0gNTtcclxuICAgIHRoaXMuaXNJbW11bml0eSA9IGZhbHNlO1xyXG4gIH1cclxuICBtb3ZpbmcoKSB7XHJcbiAgICBpZih0aGlzLmlzRGVhZCB8fCB0aGlzLmlzSW1tdW5pdHkpIHJldHVybjtcclxuXHJcbiAgICBsZXQgY3VyID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHt4OiB0aGlzLngsIHk6IHRoaXMueSt0aGlzLm1hcC5ibG9ja1NpemV9KTtcclxuICAgIGlmKGN1ciAmJiBjdXIuaXNBY3RpdmUpIHtcclxuICAgICAgdGhpcy5lbWl0KCdjb2xsaXNpb24nLCBjdXIpO1xyXG5cclxuICAgICAgaWYoY3VyLnBsYXllckRpciA9PT0gJ3RvcCcpIHJldHVybiB0aGlzLnRvcCgpO1xyXG4gICAgICBpZihjdXIucGxheWVyRGlyID09PSAnbGVmdCcpIHJldHVybiB0aGlzLmxlZnQoKTtcclxuICAgICAgaWYoY3VyLnBsYXllckRpciA9PT0gJ3JpZ2h0JykgcmV0dXJuIHRoaXMucmlnaHQoKTtcclxuXHJcbiAgICAgIC8vY2hlY2sgdG9wXHJcbiAgICAgIGxldCB0b3AgPSB0aGlzLm1hcC5nZXRCbG9ja0Zyb21Qb3Moe3g6IHRoaXMueCwgeTogdGhpcy55fSk7XHJcbiAgICAgIGlmKHRvcCAmJiB0b3AuaXNBY3RpdmUgJiYgdGhpcy5sYXN0TW92ZSAhPT0gJ2JvdHRvbScpIHJldHVybiB0aGlzLnRvcCgpO1xyXG5cclxuICAgICAgLy8gY2hlY2sgbGVmdFxyXG4gICAgICBsZXQgbGVmdCA9IHRoaXMubWFwLmdldEJsb2NrRnJvbVBvcyh7eDogdGhpcy54LXRoaXMubWFwLmJsb2NrU2l6ZSwgeTogdGhpcy55K3RoaXMubWFwLmJsb2NrU2l6ZX0pO1xyXG4gICAgICBpZihsZWZ0ICYmIGxlZnQuaXNBY3RpdmUgJiYgdGhpcy5sYXN0TW92ZSAhPT0gJ3JpZ2h0JykgcmV0dXJuIHRoaXMubGVmdCgpO1xyXG5cclxuICAgICAgLy8gY2hlY2sgcmlndGhcclxuICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5tYXAuZ2V0QmxvY2tGcm9tUG9zKHt4OiB0aGlzLngrdGhpcy5tYXAuYmxvY2tTaXplLCB5OiB0aGlzLnkrdGhpcy5tYXAuYmxvY2tTaXplfSk7XHJcbiAgICAgIGlmKHJpZ2h0ICYmIHJpZ2h0LmlzQWN0aXZlICYmIHRoaXMubGFzdE1vdmUgIT09ICdsZWZ0JykgcmV0dXJuIHRoaXMucmlnaHQoKTtcclxuXHJcbiAgICAgIC8vIG9yIGRpZVxyXG4gICAgICB0aGlzLnRvcCgpO1xyXG4gICAgfSBlbHNlIHRoaXMuZGVhZCgpO1xyXG5cclxuICAgIHRoaXMuZW1pdCgnbW92ZWQnKTtcclxuICB9XHJcbiAgZGVhZCgpIHtcclxuICAgIHRoaXMud2Fsa2luZy5zdG9wKCk7XHJcbiAgICB0aGlzLmlzRGVhZCA9IHRydWU7XHJcblxyXG4gICAgbGV0IGRlYWQgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzLnNjYWxlKTtcclxuICAgIGRlYWQuZnJvbSh7eDogLjUsIHk6IC41fSkudG8oe3g6IDAsIHk6IDB9KTtcclxuICAgIGRlYWQudGltZSA9IDIwMDtcclxuICAgIGRlYWQuc3RhcnQoKTtcclxuICAgIGRlYWQub24oJ2VuZCcsICgpID0+IHRoaXMuZW1pdCgnZGVhZGVkJykpO1xyXG4gIH1cclxuICBpbW11bml0eSgpIHtcclxuICAgIGlmKCF0aGlzLmltbXVuaXR5Q291bnQpIHJldHVybjtcclxuXHJcbiAgICBsZXQgaW1tdW5pdHkgPSBQSVhJLnR3ZWVuTWFuYWdlci5jcmVhdGVUd2Vlbih0aGlzKTtcclxuICAgIGltbXVuaXR5LmZyb20oe2FscGhhOiAuNX0pLnRvKHthbHBoYTogMX0pO1xyXG4gICAgaW1tdW5pdHkudGltZSA9IHRoaXMuc3BlZWQqdGhpcy5JTU1VTklUWV9CTE9DS1M7XHJcbiAgICBpbW11bml0eS5zdGFydCgpO1xyXG5cclxuICAgIHRoaXMubWFwLnNjcm9sbERvd24odGhpcy5JTU1VTklUWV9CTE9DS1MpO1xyXG4gICAgaW1tdW5pdHkub24oJ2VuZCcsICgpID0+IHRoaXMuaXNJbW11bml0eSA9IGZhbHNlKTtcclxuICAgIHRoaXMuaXNJbW11bml0eSA9IHRydWU7XHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gJ3RvcCc7XHJcbiAgICB0aGlzLmltbXVuaXR5Q291bnQtLTtcclxuXHJcbiAgICB0aGlzLmVtaXQoJ2FjdGlvbkltbXVuaXR5Jyk7XHJcbiAgfVxyXG4gIHRvcCgpIHtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAndG9wJztcclxuICAgIHRoaXMubWFwLnNjcm9sbERvd24oMSk7XHJcblxyXG4gICAgdGhpcy5lbWl0KCdhY3Rpb25Ub3AnKTtcclxuICB9XHJcbiAgbGVmdCgpIHtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAnbGVmdCc7XHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt4OiB0aGlzLnh9KS50byh7eDogdGhpcy54LXRoaXMubWFwLmJsb2NrU2l6ZX0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZC8yO1xyXG4gICAgbW92ZS5zdGFydCgpO1xyXG5cclxuICAgIG1vdmUub24oJ2VuZCcsICgpID0+IHRoaXMubW92aW5nKCkpO1xyXG4gICAgdGhpcy5lbWl0KCdhY3Rpb25MZWZ0Jyk7XHJcbiAgfVxyXG4gIHJpZ2h0KCkge1xyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICdyaWdodCc7XHJcbiAgICBsZXQgbW92ZSA9IFBJWEkudHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKHRoaXMpO1xyXG4gICAgbW92ZS5mcm9tKHt4OiB0aGlzLnh9KS50byh7eDogdGhpcy54K3RoaXMubWFwLmJsb2NrU2l6ZX0pO1xyXG4gICAgbW92ZS50aW1lID0gdGhpcy5zcGVlZC8yO1xyXG4gICAgbW92ZS5zdGFydCgpO1xyXG5cclxuICAgIG1vdmUub24oJ2VuZCcsICgpID0+IHRoaXMubW92aW5nKCkpO1xyXG4gICAgdGhpcy5lbWl0KCdhY3Rpb25SaWdodCcpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XHJcbiIsIi8qXHJcblRoaXMgdXRpbCBjbGFzcyBmb3IgY29udmVydGVkIGRhdGEgZnJvbSBmcmFnbWVudHMuanNvblxyXG5vYmplY3QgdG8gc2ltcGxlIG1hcCBhcnJheSwgZm9yIGV4YW1wbGU6IFsnQScsICdBJywgJ0EnLCAnQSddXHJcbiovXHJcblxyXG5jbGFzcyBEYXRhRnJhZ21lbnRDb252ZXJ0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB0aGlzLmlucHV0TWFwID0gZGF0YS5tYXA7XHJcbiAgICB0aGlzLmZyYWdtZW50ID0gW107XHJcblxyXG4gICAgLy8gT1BFUkFUT1JTXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZGF0YS5tYXAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYofn5kYXRhLm1hcFtpXS5pbmRleE9mKCd8JykpIHRoaXMuY2FzZU9wZXJhdG9yKGRhdGEubWFwW2ldLCBpKTtcclxuICAgICAgZWxzZSB0aGlzLmZyYWdtZW50W2ldID0gZGF0YS5tYXBbaV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTUVUSE9EU1xyXG4gICAgZGF0YS50cmltICYmIHRoaXMucmFuZG9tVHJpbShkYXRhLnRyaW0pO1xyXG4gICAgZGF0YS5hcHBlbmQgJiYgdGhpcy5yYW5kb21BcHBlbmQoZGF0YS5hcHBlbmQpO1xyXG4gICAgZGF0YS5zaHVmZmxlICYmIHRoaXMuc2h1ZmZsZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gT1BFUkFUT1JTXHJcbiAgLy8gQ2FzZSBvcGVyYXRvcjogJ0F8QnxDfEQnID0+IEMgYW5kIGV0Yy4uLlxyXG4gIGNhc2VPcGVyYXRvcihzdHIsIGkpIHtcclxuICAgIGxldCBpZHMgPSBzdHIuc3BsaXQoJ3wnKTtcclxuICAgIHRoaXMuZnJhZ21lbnRbaV0gPSBpZHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmlkcy5sZW5ndGgpXTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gTUVUSE9EU1xyXG4gIC8vIFRyaW1taW5nIGFycmF5IGluIHJhbmdlIDAuLnJhbmQobWluLCBsZW5ndGgpXHJcbiAgcmFuZG9tVHJpbShtaW4pIHtcclxuICAgIHRoaXMuZnJhZ21lbnQubGVuZ3RoID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRoaXMuZnJhZ21lbnQubGVuZ3RoKzEgLSBtaW4pICsgbWluKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICAvLyBTaHVmZmxlIGFycmF5IFsxLDIsM10gPT4gWzIsMSwzXSBhbmQgZXRjLi4uXHJcbiAgc2h1ZmZsZSgpIHtcclxuICAgIHRoaXMuZnJhZ21lbnQuc29ydCgoYSwgYikgPT4gTWF0aC5yYW5kb20oKSA8IC41ID8gLTEgOiAxKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICAvLyBBZGRzIGEgYmxvY2sgdG8gdGhlIHJhbmRvbSBsb2NhdGlvbiBvZiB0aGUgYXJyYXk6IFtBLEEsQV0gPT4gW0IsQSxBXSBhbmQgZXRjLi4uXHJcbiAgcmFuZG9tQXBwZW5kKGlkKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSp0aGlzLmZyYWdtZW50Lmxlbmd0aCldID0gaWQ7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGF0YUZyYWdtZW50Q29udmVydGVyO1xyXG4iXX0=
