const TileMap = require('../tilemap/TileMap');
const Player = require('../subjects/Player');
const fragments = require('../content/fragments');

class Playground extends PIXI.projection.Container2d {
  constructor(game) {
    super();

    this.game = game;
    this.proj.setAxisY({x: -this.game.w/2+50, y: 4000}, -1);

    this.tileMap = new TileMap(this, {maxX: 5, tileSize: 100});
    this.tileMap.x = this.game.w/2-this.tileMap.MAP_WIDTH/2;
    this.tileMap.y = this.game.h-280;
    this.addChild(this.tileMap);

    this.tileMap.addMap(fragments.island);
    this.tileMap.on('mapEnd', () => {
      if(Math.random() < .8) this.tileMap.addMap(fragments.A);
      else {
        this.tileMap.addMap(fragments.island);
        this.tileMap.addMap(fragments.A);
      }
    })

    this.player = new Player(this);
    this.addChild(this.player);
  }
  update(dt) {
    this.player.update(dt);
    this.tileMap.update(dt);
  }
}

module.exports = Playground;
