class Block extends PIXI.Sprite {
  constructor(tilemap, x, y, params) {
    super(PIXI.Texture.fromImage(params.image));

    this.anchor.set(.5);
    this.width = tilemap.TILE_SIZE;
    this.height = tilemap.TILE_SIZE;
    this.x = x*tilemap.TILE_SIZE+tilemap.TILE_SIZE/2;
    this.y = y*tilemap.TILE_SIZE+tilemap.TILE_SIZE/2;

    console.log(this);
  }
  update() {

  }
}

module.exports = Block;
