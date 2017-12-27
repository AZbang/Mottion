const frag = require('./noiseBlur.frag');
const vert = require('../basic.vert');

class NoiseBlurFilter extends PIXI.Filter {
  constructor() {
    super(vert(), frag());
  }
}

module.exports = NoiseBlurFilter;
