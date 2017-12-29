class Sphere extends PIXI.Container {
  constructor(scene) {
    super();

    this.emitter = new PIXI.particles.Emitter(this, [PIXI.Texture.fromImage('particle')], require('./emitter.json'));
  }
  lerp(start, end, amt) {
    return (1-amt)*start+amt*end;
  }
  setPos(pos) {
    this.emitter.spawnPos.x = pos.x;
    this.emitter.spawnPos.y = pos.y;
    // 
    // this.emitter.spawnPos.x = this.lerp(this.emitter.spawnPos.x, pos.x, 0.2);
    // this.emitter.spawnPos.y = this.lerp(this.emitter.spawnPos.y, pos.y, 0.2);
  }
  update(dt) {
    this.emitter.update(dt*.02);
    this.emitter.emit = true;
  }
}

module.exports = Sphere;
