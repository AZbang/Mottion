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

    this.anchor.set(.5);
    this.width = map.blockSize+1;
    this.height = map.blockSize+1;
    this.x = x+map.blockSize/2+.5;
    this.y = y+map.blockSize/2+.5;

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 100;
    this.jolting.repeat = this.activation;
    this.jolting.pingPong = true;

    this.interactive = true;
    this.on('pointermove', this.hit, this);
  }
  activate() {
    let activating = PIXI.tweenManager.createTween(this)
      .from({width: this.width*3/4, height: this.height*3/4})
      .to({width: this.width, height: this.height});

    activating.time = 500;
    activating.easing = PIXI.tween.Easing.outBounce();
    activating.start();

    this.isActive = true;
    this.jolting.stop();
    this.rotation = 0;
    if(this.activationTexture) this.texture = this.activationTexture;
  }
  deactivate() {
    this.isActive = false;
    if(this.deactivationTexture) this.texture = this.deactivationTexture;
  }
  hit(e) {
    if(this.activation === null || this.isActive) return;

    if(this.containsPoint(e.data.global)) {
      this.jolting.start();
      if(this.activation) this.activation--;
      else this.activate();
    } else {
      this.jolting.stop();
      this.rotation = 0;
    }
  }
}

module.exports = Block;
