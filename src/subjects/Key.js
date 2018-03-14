/*
  Класс Блока, используется для тайлового движка
  События:
    activated
    hited
*/
const Tile = require('./Tile');

class Key extends Tile {
  constructor(scene, map, x, y, data={}) {
    super(scene, map, x, y, data);

    this.texture = PIXI.Texture.fromFrame('lock.png');

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 200;
    this.jolting.pingPong = true;
    this.jolting.repeat = Infinity;
  }
  activate() {
    this.scene.immunity.addImmunity(this.type);

    let activating = PIXI.tweenManager.createTween(this);
    activating.from({alpha: 1}).to({alpha: 0});
    activating.time = 500;
    activating.start();

    this.unhit();
    this.lock = true;
    this.emit('activated');
  }
  unhit() {
    this.jolting.stop();
    this.rotation = 0;
  }
  hit() {
    if(this.activation === null || this.lock) return;
    this.jolting.start();
    this.emit('hited');

    if(this.activation) this.activation--;
    else return !!this.activate();
  }
}

module.exports = Key;
