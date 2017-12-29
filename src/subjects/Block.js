/*
  Класс Блока, используется для тайлового движка
  События:
    activated
    deactivated
    hited
*/

class Block extends PIXI.projection.Sprite2d {
  constructor(map, x, y, params={}) {
    super(PIXI.Texture.fromFrame(params.image || params.activationImage));

    this.map = map;
    this.game = this.map.game;

    this.score = params.score;
    this.activation = params.activation || null;
    this.deactivationTexture = params.image ? PIXI.Texture.fromFrame(params.image) : null;
    this.activationTexture = params.activationImage ? PIXI.Texture.fromFrame(params.activationImage) : null;
    this.isActive = params.active;
    this.playerDir = params.playerDir || null;
    this.action = params.action || null;

    this.anchor.set(.5);
    this.width = map.blockSize+1;
    this.height = map.blockSize+1;
    this.x = x+map.blockSize/2+.5;
    this.y = y+map.blockSize/2+.5;

    let show = PIXI.tweenManager.createTween(this);
    show.from({alpha: 0}).to({alpha: 1})
    show.time = 1000;
    show.start();

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 200;
    this.jolting.pingPong = true;
    this.jolting.repeat = Infinity;

    this.glow = new PIXI.filters.AlphaFilter();
    this.glow.enabled = false;
    this.filters = [this.glow];
  }
  activate() {
    let activating = PIXI.tweenManager.createTween(this)
      .from({width: this.width*3/4, height: this.height*3/4})
      .to({width: this.width, height: this.height, rotation: 0});
    activating.time = 500;
    activating.easing = PIXI.tween.Easing.outBounce();
    activating.start();

    this.glow.alpha = 1.0;
    this.jolting.stop();
    this.rotation = 0;

    this.isActive = true;
    if(this.activationTexture) this.texture = this.activationTexture;

    this.emit('activated');
  }
  deactivate() {
    this.isActive = false;
    if(this.deactivationTexture) this.texture = this.deactivationTexture;
    this.emit('deactivated');
  }
  unhit() {
    this.glow.enabled = false;
    this.jolting.stop();
    this.rotation = 0;
  }
  hit() {
    if(this.activation === null || this.isActive) return;

    this.jolting.start();
    this.glow.enabled = true;
    this.glow.alpha = 5.0;

    if(this.activation) this.activation--;
    else this.activate();
    this.emit('hited');
  }
}

module.exports = Block;
