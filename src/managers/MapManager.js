/*
  Движок тайловой карты
  События:
    scrolledDown => dtDown
    scrolledTop => dtTop
*/

const map = require('../content/map');
const blocks = require('../content/blocks');
const triggers = require('../content/triggers');
const Block = require('../subjects/Block');
const TiledManager = require('./TiledManager');

class MapManager extends PIXI.projection.Container2d {
  constructor(scene, checkpoint=0) {
    super();
    this.scene = scene;
    this.game = scene.game;

    this.tiled = new TiledManager(map, blocks, triggers);
    this.tileSize = 120;
    this.speed = 400;
    this.showDelay = 1;

    this.PROJECTION_PADDING_BOTTOM = 240;
    this.x = this.game.w/2-this.tiled.mapWidth*this.tileSize/2;
    this.y = -this.tiled.mapHeight*this.tileSize+this.game.h-this.PROJECTION_PADDING_BOTTOM+(checkpoint*this.tileSize);

    this._createProjection();
  }
  _createProjection() {
    let projection = new PIXI.projection.Container2d();
    projection.proj.setAxisY({x: -this.game.w/2+50, y: 4000}, -1);

    projection.addChild(this);
    this.scene.addChild(projection);
  }
  generateMap() {
    this.tiled.data.forEach((tile) => {
      this.addBlock(tile.x, tile.y, tile.data);
    });
    this.emit('generatedMap');
  }
  addBlock(x, y, data) {
    let block = new Block(this.scene, this, x, y, data);
    this.addChild(block);
  }
  getBlock(pos) {
    for(let i = 0; i < this.children.length; i++) {
      let block = this.children[i];

      let x = block.transform.worldTransform.tx/this.game.resolution-block.width/2;
      let y = block.transform.worldTransform.ty/this.game.resolution-block.height/2;
      let w = block.width;
      let h = block.height;

      if(pos.x >= x && pos.x <= x+w && pos.y >= y && pos.y <= y+h) return this.children[i];
    }
  }
  getNearBlocks(pos) {
    return {
      center: this.getBlock(pos),
      top: this.getBlock({x: pos.x, y: pos.y-this.tileSize}),
      left: this.getBlock({x: pos.x-this.tileSize, y: pos.y}),
      right: this.getBlock({x: pos.x+this.tileSize, y: pos.y}),
    }
  }

  // Moving Map
  scrollDown(blocks, cb) {
    this.scrollTo(this.y+blocks*this.tileSize, this.speed*blocks, cb);
  }
  scrollTop(blocks, cb) {
    this.scrollTo(this.y-blocks*this.tileSize, this.speed*blocks, cb);
  }
  scrollTo(y, time, cb) {
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: y});
    move.time = time;

    let isDown = this.y < y;
    move.on('end', () => {
      cb && cb();
      this.emit('scrolled');
      this.checkOutRangeBlocks();
    });
    move.start();
  }

  showHiddenBlocks() {
    for(let i = 0; i < this.children.length; i++) {
      let block = this.children[i];
      let y = block.transform.worldTransform.ty/this.game.resolution-this.tileSize/2;
      if(y >= -this.tileSize*2 && block.showDelay) block.show();
    }
  }

  checkOutRangeBlocks() {
    for(let i = 0; i < this.children.length; i++) {
      let block = this.children[i];
      let y = block.transform.worldTransform.ty/this.game.resolution-this.tileSize/2;
      if(y >= this.game.h-this.tileSize*2) block.hide();
      else if(y >= -this.tileSize*2 && !block.showDelay) block.show();
    }
  }
}

module.exports = MapManager;
