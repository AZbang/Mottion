const frag = require('./clouds.frag');
const vert = require('../basic.vert');

class CloudsFilter extends PIXI.Filter {
  constructor(options) {
    super(vert(), frag(), {
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
    });

    Object.assign(this, {
      cloudDensity: 0.3,
      noisiness: 0.3,
      speed: 1.0,
      cloudHeight: 0.5
    }, options);
  }
  set cloudDensity(v) {
    this.uniforms.cloudDensity = v;
  }
  get cloudDensity() {
    return this.uniforms.cloudDensity;
  }

  set noisiness(v) {
    this.uniforms.noisiness = v;
  }
  get noisiness() {
    return this.uniforms.noisiness;
  }

  set speed(v) {
    this.uniforms.speed = v;
  }
  get speed() {
    return this.uniforms.speed;
  }

  set cloudHeight(v) {
    this.uniforms.cloudHeight = v;
  }
  get cloudHeight() {
    return this.uniforms.cloudHeight;
  }
}

module.exports = CloudsFilter;
