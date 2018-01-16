/*
  Класс Блока, используется для тайлового движка
  События:
    showen
    hidden
    activated
    deactivated
    hited
*/

class Block extends PIXI.projection.Sprite2d {
  constructor(scene, map, x, y, data={}) {
    super();

    this.game = scene.game;
    this.scene = scene;
    this.map = map;

    Object.assign(this, {
      active: false,
      activation: null,
      score: 0,
      playerDir: null,
      checkpoint: false,
      historyID: null,
      showDelay: false
    }, data);

    this.activatedTexture = data.activatedTexture ? PIXI.Texture.fromFrame(data.activatedTexture) : PIXI.Texture.WHITE;
    this.deactivatedTexture = data.deactivatedTexture ? PIXI.Texture.fromFrame(data.deactivatedTexture) : PIXI.Texture.WHITE;
    this.texture = this.active ? this.activatedTexture : this.deactivatedTexture;

    this.anchor.set(.5);
    this.renderable = false;
    this.width = map.tileSize-10;
    this.height = map.tileSize-10;
    this.x = x+map.tileSize/2-5;
    this.y = y+map.tileSize/2-5;

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 200;
    this.jolting.pingPong = true;
    this.jolting.repeat = Infinity;
  }
  show(delay) {
    if(this.renderable) return;
    this.renderable = true;

    PIXI.tweenManager.createTween(this, {
      from: {
        width: 0,
        height: 0,
        y: this.y+this.height,
        alpha: 0
      },
      to: {
        width: this.map.tileSize-10,
        height: this.map.tileSize-10,
        y: this.y,
        alpha: 1
      },
      time: 300,
      easing: PIXI.tween.Easing.outBounce(),
      delay: this.showDelay ? delay+Math.random()*1000 : 0
    }).start();

    this.emit('showen');
  }
  hide(delay) {
    if(!this.renderable) return;
    this.renderable = true;

    PIXI.tweenManager.createTween(this, {
      from: {
        width: this.width,
        height: this.height,
        y: this.y,
        alpha: 1
      },
      to: {
        width: 0,
        height: 0,
        y: this.y+this.height,
        alpha: 0
      },
      time: 300,
      delay: Math.random()*this.map.speed/2,
      on: {
        end: () => this.renderable = false
      }
    }).start();

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
    this.texture = this.activatedTexture;

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
