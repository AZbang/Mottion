const frag = require("./rotation.frag");
const vert = require("../basic.vert");

class Rotation extends PIXI.Filter {
  constructor(rotation) {
    super(vert, frag);
    this.rotation = rotation || 0;
  }
  set rotation(v) {
    this.uniforms.rotation = v;
  }
  get rotation() {
    return this.uniforms.rotation;
  }
}

module.exports = Rotation;
