const types = require('../content/types');

class ImmunityManager extends PIXI.Container {
  constructor(scene) {
    super();
    scene.addChild(this);
    this.game = game;
    this.scene = scene;
  }
  last() {
    return (this.children[this.children.length-1] || {}).type;
  }
  addImmunity(type) {
    let sprite = PIXI.Sprite.fromImage('particle.png');
    sprite.y = 200;
    sprite.x = 80+this.children.length*100;
    sprite.anchor.set(.5);
    sprite.scale.set(.7);
    sprite.tint = types[type];
    sprite.type = type;
    this.addChild(sprite);
  }
  removeImmunity() {
    this.removeChild(this.children[this.children.length-1]);
  }
  removeAll() {
    for(let i = this.children.length-1; i >= 0; i--) {
    	this.removeChild(this.children[i]);
    }
  }
}

module.exports = ImmunityManager;
