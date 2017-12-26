class Sphere extends PIXI.Container {
  constructor(scene) {
    super();

    this.emitter = new PIXI.particles.Emitter(this, [PIXI.Texture.fromImage('particle')], require('./emitter.json'));
  }
  update(dt) {
    this.emitter.update(dt*.01);
    this.emitter.emit = true;
  }
}

module.exports = Sphere;
