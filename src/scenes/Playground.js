const TileMap = require('../tilemap/TileMap.js');
const fragments = require('../content/fragments.js');

class Playground extends PIXI.Container {
  constructor(game) {
    super();

    this.game = game;
    this.tileMap = new TileMap(this, 100, 6);
    this.tileMap.x = this.game.w/2-100*6/2;

    this.addChild(this.tileMap);

    setInterval(() => {
      if(Math.random() < .8) this.tileMap.addFragment(fragments.A);
      else {
        this.tileMap.addFragment(fragments.island);
        this.tileMap.addFragment(fragments.A);
      }
    }, 500);
  }
  update(dt) {
    this.tileMap.update(dt);
    this.tileMap.y += 5 * dt;
  }
}

module.exports = Playground;
