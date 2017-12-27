const frag = require('./noiseBlur.frag');
const vert = require('../basic.vert');

class NoiseBlurFilter extends PIXI.Filter {
  constructor() {
    super(vert(), frag());

    this.blurRadius = 0.0005;
  }
  set blurRadius(v) {
    this.uniforms.blurRadius = v;
  }
  get blurRadius() {
    return this.uniforms.blurRadius;
  }
}

module.exports = NoiseBlurFilter;
