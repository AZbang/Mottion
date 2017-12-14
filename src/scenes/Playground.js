const TileMap = require('../tilemap/TileMap.js');

class Playground extends PIXI.Container {
  constructor() {
    super();

    this.tileMap = new TileMap(this);
    this.addChild(this.tileMap);
    
    this.tileMap.addFragment([
      'AAAA',
      'AAAA',
      'AAAA',
      'AAAA'
    ]);
  }
  update(dt) {
    this.tileMap.update(dt);
  }
}

module.exports = Playground;
