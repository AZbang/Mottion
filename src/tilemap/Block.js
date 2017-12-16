class Block extends PIXI.projection.Sprite2d {
  constructor(tileMap, x, y, params={}) {
    super(PIXI.Texture.fromFrame(params.image || params.activationImage));

    this.tileMap = tileMap;
    this.game = this.tileMap.game;


    this.score = params.score;
    this.activation = params.activation;
    this.deactivationTexture = params.image ? PIXI.Texture.fromFrame(params.image) : null;
    this.activationTexture = params.activationImage ? PIXI.Texture.fromFrame(params.activationImage) : null;
    this.isActive = params.active;

    this.anchor.set(.5);
    this.width = tileMap.TILE_SIZE+2;
    this.height = tileMap.TILE_SIZE+2;
    this.x = x+tileMap.TILE_SIZE/2+1;
    this.y = y+tileMap.TILE_SIZE/2+1;

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 100;
    this.jolting.repeat = this.activation;
    this.jolting.pingPong = true;

    this.activating = PIXI.tweenManager.createTween(this);
    this.activating.from({width: this.width*3/4, height: this.height*3/4}).to({width: this.width, height: this.height});
    this.activating.time = 500;
    this.activating.easing = PIXI.tween.Easing.outBounce();

    this.interactive = true;
    this.on('pointermove', this.hit, this);
  }
  activate() {
    this.isActive = true;
    this.activating.start();
    this.jolting.stop();
    this.rotation = 0;
    if(this.activationTexture) this.texture = this.activationTexture;
  }
  deactivate() {
    this.isActive = false;
    if(this.deactivationTexture) this.texture = this.deactivationTexture;
  }
  hit(e) {
    if(!this.containsPoint(e.data.global)) {
      this.jolting.stop();
      this.rotation = 0;
      return;
    }
    if(this.activation) {
      this.activation--;
      this.jolting.start();
    } else !this.isActive && this.activate();
  }
  update(dt) {
    if(this.worldTransform.ty-this.tileMap.TILE_SIZE/2 > window.innerHeight) {
      this.tileMap.removeChild(this);
    }
  }
}

module.exports = Block;
