class Sphere extends PIXI.Container {
  constructor(game, emitterData) {
    super();
    this.game = game;

    this.emitter = new PIXI.particles.Emitter(this, [PIXI.Texture.fromImage('particle')], emitterData);
    this.game.ticker.add((dt) => this.update(dt));
  }
  lerp(start, end, amt) {
    return (1-amt)*start+amt*end;
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
