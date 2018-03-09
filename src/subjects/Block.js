/*
  Класс Блока, используется для тайлового движка
  События:
    showen
    hidden
    activated
    deactivated
    hited
*/
const Tile = require('./Tile');

class Block extends Tile {
  constructor(scene, map, x, y, data={}) {
    super(scene, map, x, y, data);

    this.activatedTexture = PIXI.Texture.fromFrame('block_fill.png');
    this.deactivatedTexture = PIXI.Texture.fromFrame('block.png');
    this.texture = data.active ? this.activatedTexture : this.deactivatedTexture;

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 200;
    this.jolting.pingPong = true;
    this.jolting.repeat = Infinity;
  }
  activate() {
    if(this.activatedTexture) this.texture = this.activatedTexture;

    let activating = PIXI.tweenManager.createTween(this)
      .from({width: this.width*3/4, height: this.height*3/4})
      .to({width: this.width, height: this.height, rotation: 0});
    activating.time = 500;
    activating.easing = PIXI.tween.Easing.outBounce();
    activating.start();

    this.unhit();
    this.active = true;
    this.emit('activated');
  }
  deactivate() {
    if(this.deactivatedTexture) this.texture = this.deactivatedTexture;
    this.active = false;

    this.emit('deactivated');
  }
  unhit() {
    this.jolting.stop();
    this.rotation = 0;
  }
  hit() {
    if(this.activation === null || this.active) return;

    this.jolting.start();
    if(this.activation) this.activation--;
    else this.activate();

    this.emit('hited');
  }
}

module.exports = Block;
