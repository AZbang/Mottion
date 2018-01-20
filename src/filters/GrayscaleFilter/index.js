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
