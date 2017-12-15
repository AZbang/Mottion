const TILE_TYPES = require('../content/TILE_TYPES');
const MapFragment = require('./MapFragment');
const Block = require('./Block');

class TileMap extends PIXI.Container {
  constructor(scene, params={}) {
    super();

    this.scene = scene;
    this.game = scene.game;

    this.MAX_X = params.maxX || 6;
    this.TILE_SIZE = params.tileSize || 100;
    this.MAP_WIDTH = this.MAX_X*this.TILE_SIZE;
    this.lastIndex = 0;

    this.events = {};
  }
  on(e, cb) {
    this.events[e] = cb;
  }
  triggerEvent(e, arg) {
    this.events[e] && this.events[e](arg);
  }
  addMap(map) {
    for(let i = map.length-1; i >= 0; i--) {
      this.addFragment(map[i]);
    }
  }
  addFragment(dataFrag) {
    let frag = new MapFragment(dataFrag);
    for(let i = 0; i < frag.length; i++) {
      this.addBlock(frag[i], Math.round((this.MAX_X-frag.length)/2)+i, this.lastIndex);
    }
    this.lastIndex++;
  }
  addBlock(id, x, y) {
    if(id === '_') return;

    let posX = x*this.TILE_SIZE;
    let posY = -y*this.TILE_SIZE;
    this.addChild(new Block(this, posX, posY, TILE_TYPES[id]));
  }
  _computedEndMap() {
    if(this.children.length < this.MAX_X*(this.game.h/this.TILE_SIZE)) {
      this.triggerEvent('mapEnd');
    }
  }
  update(dt) {
    for(let i = 0; i < this.children.length; i++) {
      this.children[i].update(dt);
    }

    this._computedEndMap();
  }
}

module.exports = TileMap;
