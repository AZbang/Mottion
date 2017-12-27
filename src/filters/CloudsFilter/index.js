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
