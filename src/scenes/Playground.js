const TileMap = require('../tilemap/TileMap.js');
const fragments = require('../content/fragments.js');

class Playground extends PIXI.Container {
  constructor(game) {
    super();

    this.game = game;
    this.tileMap = new TileMap(this, {maxX: 6, tileSize: 100});
    this.tileMap.x = this.game.w/2-this.tileMap.MAP_WIDTH/2;

    this.addChild(this.tileMap);
    this.tileMap.on('mapEnd', () => {
      if(Math.random() < .8) this.tileMap.addMap(fragments.A);
      else {
        this.tileMap.addMap(fragments.island);
        this.tileMap.addMap(fragments.A);
      }
    })
  }
  update(dt) {
    this.tileMap.update(dt);
    this.tileMap.y += 5 * dt;
  }
}

module.exports = Playground;
