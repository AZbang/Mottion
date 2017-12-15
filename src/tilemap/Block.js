class Block extends PIXI.Sprite {
  constructor(tileMap, x, y, params) {
    super(PIXI.Texture.fromImage(params.image));

    this.tileMap = tileMap;

    this.anchor.set(.5);
    this.width = tileMap.TILE_SIZE;
    this.height = tileMap.TILE_SIZE;
    this.x = x+tileMap.TILE_SIZE/2;
    this.y = y+tileMap.TILE_SIZE/2;
  }
  update(dt) {
    if(this.worldTransform.ty-this.tileMap.TILE_SIZE/2 > window.innerHeight) {
      this.tileMap.removeChild(this);
    }
  }
}

module.exports = Block;
