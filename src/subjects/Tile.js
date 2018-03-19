/*
  Класс Блока, используется для тайлового движка
  События:
    showen
    hidden
    activated
    deactivated
    hited
*/
const types = require('../content/types');

class Tile extends PIXI.projection.Sprite2d {
  constructor(scene, map, x, y, data={}) {
    super();

    this.game = scene.game;
    this.scene = scene;
    this.map = map;

    Object.assign(this, {
      score: 0,
      active: false,
      type: 'white',
      activation: null,
      playerDir: null,
      checkpoint: false,
      historyID: null,
      showDelay: false
    }, data);

    this.tint = types[this.type] || 0xFFFFFF;
    this.anchor.set(.5);
    this.renderable = false;
    this.width = map.tileSize-10;
    this.height = map.tileSize-10;
    this.x = x*map.tileSize+map.tileSize/2-5;
    this.y = y*map.tileSize+map.tileSize/2-5;
    this.index = 1000-y-2;

    if(this.anim) {
      this.animTypes = this.animTypes.split(', ');
      this._animate();
    }
  }
  _animate() {
    let timer = this.scene.timerManager.createTimer(this.animTime);
    let i = 0;
    timer.loop = true;
    timer.on('repeat', () => {
      if(this.active) return timer.stop();

      if(i >= this.animTypes.length) i = 0;
      this.type = this.animTypes[i];
      this.tint = types[this.type]
      i++;
    });
    timer.start();
  }
  show() {
    if(this.renderable) return;
    this.renderable = true;

    this.alpha = 0;
    let show = this.scene.tweenManager.createTween(this);
    show.time = this.map.speed;
    show.from({alpha: 0});
    show.to({alpha: 1});
    if(this.showDelay) this.scene.setTimeout(() => show.start(), Math.random()*this.map.speed);
    else show.start();

    this.emit('showen');
  }
  hide(delay) {
    if(!this.renderable) return;
    this.renderable = true;

    let hide = this.scene.tweenManager.createTween(this);
    hide.from({width: this.width, height: this.height, y: this.y, alpha: 1});
    hide.to({width: 0, height: 0, y: this.y+this.height, alpha: 0});

    this.scene.setTimeout(() => hide.start(), Math.random()*this.map.speed/2);
    hide.on('end', () => this.renderable = false);
    hide.time = this.map.speed;

    this.emit('hidden');
  }
}

module.exports = Tile;
