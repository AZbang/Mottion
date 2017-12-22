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
  }
  activate() {
    let activating = PIXI.tweenManager.createTween(this)
      .from({width: this.width*3/4, height: this.height*3/4})
      .to({width: this.width, height: this.height, rotation: 0});
    activating.time = 500;
    activating.easing = PIXI.tween.Easing.outBounce();
    activating.start();

    this.isActive = true;
    if(this.activationTexture) this.texture = this.activationTexture;

    this.emit('activated');
  }
  deactivate() {
    this.isActive = false;
    if(this.deactivationTexture) this.texture = this.deactivationTexture;
    this.emit('deactivated');
  }
  hit() {
    if(this.activation === null || this.isActive) return;

    let jolting = PIXI.tweenManager.createTween(this);
    jolting.from({rotation: 0}).to({rotation: Math.random() < .5 ? -.15 : .15});
    jolting.time = 100;
    jolting.pingPong = true;
    jolting.start();

    if(this.activation) this.activation--;
    else this.activate();
    this.emit('hited');
  }
}

module.exports = Block;
