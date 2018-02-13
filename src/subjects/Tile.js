/*
  Класс Блока, используется для тайлового движка
  События:
    showen
    hidden
    activated
    deactivated
    hited
*/
const types = require('../content/types');

class Tile extends PIXI.projection.Sprite2d {
  constructor(scene, map, x, y, data={}) {
    super();

    this.game = scene.game;
    this.scene = scene;
    this.map = map;

    Object.assign(this, {
      score: 0,
      active: false,
      type: 'white',
      activation: null,
      playerDir: null,
      checkpoint: false,
      historyID: null,
      showDelay: false
    }, data);


    this.activatedTexture = PIXI.Texture.fromFrame('block_fill.png');
    this.deactivatedTexture = PIXI.Texture.fromFrame('block.png');
    this.texture = data.active ? this.activatedTexture : this.deactivatedTexture;

    this.tint = types[this.type] || 0xFFFFFF;
    this.anchor.set(.5);
    this.renderable = false;
    this.width = map.tileSize-10;
    this.height = map.tileSize-10;
    this.x = x*map.tileSize+map.tileSize/2-5;
    this.y = y*map.tileSize+map.tileSize/2-5;
    this.index = 1000-y-2;
  }
}

module.exports = Tile;
