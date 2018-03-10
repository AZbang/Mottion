const types = require('../content/types');

class ParticlesManager extends PIXI.Container {
  constructor(scene, wrap=scene) {
    super();
    this.game = scene.game || scene;
    this.wrap = wrap
    wrap.addChild(this);

    this.speed = 10;
    this.timer = 50;
    this._time = 50;
    this._i = 0;
    this.tints = Object.values(types);
    this.max = 0;

    this.texture = PIXI.Texture.fromImage('particle.png');
    this.game.ticker.add((dt) => this.update(dt));
  }
  addParticle() {
    let part = new PIXI.Sprite(this.texture);
    part.x = Math.random()*this.game.w;
    part.y = -Math.random()*200;
    part.anchor.set(.5);
    part.tint = this.tints[Math.floor(Math.random()*this.tints.length)];
    part.rotation = Math.PI;
    part.direction = Math.PI * 2;
    part.speed = 10 + Math.random() * 10;
    part.scale.set(0.5 + Math.random() * 0.5);
    part.turnSpeed = Math.random() - 0.8;

    this.addChild(part);
  }
  update(dt) {
    this._time++;
    if(this._time >= this.timer) {
      this._time = 0;
      for(let i = 0; i < Math.random()*this.max; i++) {
        this.addParticle();
      }
    }

    this._i += .1;
    for(let i = 0; i < this.children.length; i++) {
      let obj = this.children[i];
      obj.direction += obj.turnSpeed * 0.01;
      obj.x += Math.sin(obj.direction) * obj.speed;
      obj.y += Math.cos(obj.direction) * obj.speed;
      obj.rotation = -obj.direction - Math.PI;
      if(obj.y-obj.height/2 > this.game.h) {
        this.removeChild(obj);
        if(this.children.length < 15) this.addParticle();
      }
    }
  }
}

module.exports = ParticlesManager;
