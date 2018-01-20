const emitterData = require('../content/emitter.json');

class Sphere extends PIXI.Container {
  constructor(scene) {
    super();
    this.game = scene.game || scene;

    this.emitter = new PIXI.particles.Emitter(this, [PIXI.Texture.fromImage('particle')], emitterData);
    this.game.ticker.add((dt) => this.update(dt));
  }
  lerp(start, end, amt) {
    return (1-amt)*start+amt*end;
  }
  getPos() {
    return this.emitter.spawnPos;
  }
  setPos(pos) {
    this.emitter.spawnPos.x = pos.x;
    this.emitter.spawnPos.y = pos.y;
  }
  update(dt) {
    this.emitter.update(dt*.02);
    this.emitter.emit = true;
  }
}

module.exports = Sphere;
