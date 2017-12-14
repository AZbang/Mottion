const TILE_TYPES = require('./TYLE_TYPES');
const Block = require('./Block');

class TileMap extends PIXI.Container {
  constructor(scene) {
    super();

    this.TILE_SIZE = 100;
  }
  addFragment(map) {
    for(let y = 0; y < map.length; y++) {
      for(let x = 0; x < map[y].length; x++) {
        this.addChild(new Block(this, x, y, TILE_TYPES[map[y][x]]));
      }
    }
  }
  update(dt) {
    for(let i = 0; i < this.children.length; i++) {
      this.children[i].update(dt);
    }
  }
}

module.exports = TileMap;
