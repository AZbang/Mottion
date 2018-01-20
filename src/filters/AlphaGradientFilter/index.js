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
