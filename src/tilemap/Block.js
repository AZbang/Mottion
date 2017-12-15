class Block extends PIXI.Sprite {
  constructor(tileMap, x, y, params={}) {
    super(PIXI.Texture.fromFrame(params.image || params.activationImage));

    this.tileMap = tileMap;

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

    this.interactive = true;
    this.on('pointermove', this.hit, this);
  }
  activate() {
    this.isActive = true;
    if(this.activationTexture) this.texture = this.activationTexture;
  }
  deactivate() {
    this.isActive = false;
    if(this.deactivationTexture) this.texture = this.deactivationTexture;
  }
  hit(e) {
    if(!this.containsPoint(e.data.global)) return;

    if(this.activation) this.activation--;
    else !this.isActive && this.activate();
  }
  update(dt) {
    if(this.worldTransform.ty-this.tileMap.TILE_SIZE/2 > window.innerHeight) {
      this.tileMap.removeChild(this);
    }
  }
}

module.exports = Block;
