const TILE_TYPES = require('../content/TILE_TYPES');
const MapFragment = require('./MapFragment');
const Block = require('./Block');

class TileMap extends PIXI.Container {
  constructor(scene, tilesize=100, maxX=5) {
    super();

    this.TILE_SIZE = tilesize;
    this.MAX_X = maxX;
    this.lastIndex = 0;
  }
  addFragment(map) {
    for(let y = 0; y < map.length; y++) {
      let frag = new MapFragment(map[y]);

      for(let x = 0; x < frag.length; x++) {
        if(frag[x] === '_') continue;

        let posX = Math.round((this.MAX_X-frag.length)/2)*this.TILE_SIZE+x*this.TILE_SIZE;
        let posY = y*this.TILE_SIZE-this.lastIndex*this.TILE_SIZE-map.length*this.TILE_SIZE;

        this.addChild(new Block(this, posX, posY, TILE_TYPES[frag[x]]));
      }
    }
    this.lastIndex += map.length;
  }
  update(dt) {
    for(let i = 0; i < this.children.length; i++) {
      this.children[i].update(dt);
    }
  }
}

module.exports = TileMap;
