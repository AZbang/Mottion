/*
  Движок тайловой карты
  События:
    scrolledDown => dtDown
    scrolledTop => dtTop
*/
const Block = require('../subjects/Block');

class MapManager extends PIXI.projection.Container2d {
  constructor(scene, map, blocks) {
    super('levels');

    this.scene = scene;
    this.game = scene.game;

    this.tileSize = map.tilewidth;
    this.mapWidth = map.width;
    this.mapHeight = map.height;

    this.map = map.layers[0].data;
    this.triggers = map.layers[1].data;
    this.blocks = blocks.tileproperties;

    this.PROJECTION_PADDING_BOTTOM = 280;
    this.x = this.game.w/2-this.mapWidth*this.tileSize/2;
    this.y = -this.mapHeight*this.tileSize+this.game.h-this.PROJECTION_PADDING_BOTTOM;

    this.isStop = false;
    this.speed = 500;

    this._parseMap();
  }
  _parseMap() {
    for(let y = 0; y < this.mapHeight; y++) {
      for(let x = 0; x < this.mapWidth; x++) {
        !this.map[y*this.mapWidth+x] || this.addBlock(x*this.tileSize, y*this.tileSize, this.map[y*this.mapWidth+x], this.triggers[y*this.mapWidth+x]);
      }
    }
    this.checkOutRangeBlocks();
  }
  addBlock(x, y, blockID, triggerID) {
    let block = new Block(this, x, y, this.blocks[blockID-1], this.blocks[triggerID-1]);
    this.addChild(block);
  }

  // Collision Widh Block
  getBlock(pos) {
    for(let i = 0; i < this.children.length; i++) {
      let block = this.children[i];
      let x = block.transform.worldTransform.tx/this.game.scale-block.width/2;
      let y = block.transform.worldTransform.ty/this.game.scale-block.height/2;
      let w = block.width;
      let h = block.height;

      if(pos.x >= x && pos.x <= x+w && pos.y >= y && pos.y <= y+h) return this.children[i];
    }
  }
  getNearBlocks(pos) {
    return {
      center: this.getBlock(pos),
      top: this.getBlock({x: pos.x, y: pos.y-this.tileSize}),
      bottom: this.getBlock({x: pos.x, y: pos.y+this.tileSize}),
      left: this.getBlock({x: pos.x-this.tileSize, y: pos.y}),
      right: this.getBlock({x: pos.x+this.tileSize, y: pos.y}),
    }
  }

  // Moving Map
  scrollDown(blocks) {
    if(this.isStop) return;

    // Scroll map down on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y+blocks*this.tileSize});
    move.time = this.speed*blocks;

    move.on('end', () => {
      this.emit('scrolledDown', blocks);
      this.checkOutRangeBlocks();
    });
    move.start();
  }
  scrollTop(blocks) {
    if(this.isStop) return;

    // Scroll map top on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y-blocks*this.tileSize});
    move.time = this.speed*blocks;

    move.on('end', () => {
      this.emit('scrolledTop', blocks);
      this.checkOutRangeBlocks();
    });
    move.start();
  }

  // clear out range map blocks
  checkOutRangeBlocks() {
    for(let i = 0; i < this.children.length; i++) {
      let y = this.children[i].transform.worldTransform.ty-this.tileSize/2;
      if(y > this.game.h || y < -this.tileSize) {
        this.children[i].renderable && this.children[i].hide();
      } else !this.children[i].renderable && this.children[i].show();
    }
  }
}

module.exports = MapManager;
