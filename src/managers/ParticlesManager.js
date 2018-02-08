const emitterData = require('../content/backgroundEmitter.json');

class BackgroundParticles extends PIXI.Container {
  constructor(scene) {
    super();
    this.game = scene.game || scene;
    scene.addChild(this);

    this.emitter = new PIXI.particles.Emitter(this, [PIXI.Texture.fromImage('particle')], emitterData);
    this.game.ticker.add((dt) => this.update(dt));
  }
  update(dt) {
    this.emitter.update(dt*.02);
    this.emitter.emit = true;
  }
}

module.exports = BackgroundParticles;
