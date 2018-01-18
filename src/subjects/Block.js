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

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 200;
    this.jolting.pingPong = true;
    this.jolting.repeat = Infinity;
  }
  show(delay) {
    if(this.renderable) return;
    this.renderable = true;

    this.alpha = 0;

    let show = PIXI.tweenManager.createTween(this);
    show.from({
      width: 0,
      height: 0,
      y: this.y+this.height,
      alpha: 0
    }).to({
      width: this.map.tileSize-10,
      height: this.map.tileSize-10,
      y: this.y,
      alpha: 1
    });
    show.time = this.map.speed*2;
    show.easing = PIXI.tween.Easing.outBounce();
    if(this.showDelay) setTimeout(() => show.start(), delay+Math.random()*this.map.speed);
    else show.start();
    this.emit('showen');
  }
  hide(delay) {
    if(!this.renderable) return;
    this.renderable = true;

    let hide = PIXI.tweenManager.createTween(this);
    hide.from({
      width: this.width,
      height: this.height,
      y: this.y,
      alpha: 1
    }).to({
      width: 0,
      height: 0,
      y: this.y+this.height,
      alpha: 0
    });
    setTimeout(() => hide.start(), Math.random()*this.map.speed/2);
    hide.on('end', () => this.renderable = false);
    hide.time = this.map.speed;

    this.emit('hidden');
  }

  activate() {
    let activating = PIXI.tweenManager.createTween(this)
      .from({width: this.width*3/4, height: this.height*3/4})
      .to({width: this.width, height: this.height, rotation: 0});
    activating.time = 500;
    activating.easing = PIXI.tween.Easing.outBounce();
    activating.start();

    this.unhit();

    this.active = true;
    if(this.activatedTexture) this.texture = this.activatedTexture;

    this.emit('activated');
  }
  deactivate() {
    this.active = false;
    if(this.deactivatedTexture) this.texture = this.deactivatedTexture;

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
