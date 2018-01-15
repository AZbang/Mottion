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

class MapManager extends PIXI.projection.Container2d {
  constructor(scene) {
    super();

    this.scene = scene;
    this.game = scene.game;

    this._createProjection();

    this.tileSize = 120;
    this.mapWidth = map.width;
    this.mapHeight = map.height;

    this.map = map.layers[0].data;
    this.triggersMap = map.layers[1].data;
    this.blocks = blocks.tileproperties;
    this.triggers = triggers.tileproperties;
    this.divideGid = triggers.tilecount;

    this.PROJECTION_PADDING_BOTTOM = 240;
    this.x = this.game.w/2-this.mapWidth*this.tileSize/2;
    this.y = -this.mapHeight*this.tileSize+this.game.h-this.PROJECTION_PADDING_BOTTOM;

    this.speed = 500;

    this._parseMap();
  }
  _createProjection() {
    let projection = new PIXI.projection.Container2d();
    projection.proj.setAxisY({x: -this.game.w/2+50, y: 4000}, -1);

    projection.addChild(this);
    this.scene.addChild(projection);
  }
  _getBlockProps(blockGid, triggerGid) {
    const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
    const FLIPPED_VERTICALLY_FLAG   = 0x40000000;
    const FLIPPED_DIAGONALLY_FLAG   = 0x20000000;

    let flips = {
      horizontalFlip: !!(blockGid & FLIPPED_HORIZONTALLY_FLAG),
      verticalFlip: !!(blockGid & FLIPPED_VERTICALLY_FLAG),
      diagonalFlip: !!(blockGid & FLIPPED_DIAGONALLY_FLAG)
    }

    if(flips.horizontalFlip || flips.verticalFlip || flips.diagonalFlip)
      blockGid &= ~(FLIPPED_HORIZONTALLY_FLAG |
               FLIPPED_VERTICALLY_FLAG |
               FLIPPED_DIAGONALLY_FLAG);

    return Object.assign({}, flips, this.blocks[blockGid-this.divideGid-1], this.triggers[triggerGid-1]);
  }
  _parseMap() {
    for(let y = 0; y < this.mapHeight; y++) {
      for(let x = 0; x < this.mapWidth; x++) {
        this.map[y*this.mapWidth+x] && this.addBlock(x*this.tileSize, y*this.tileSize, this.map[y*this.mapWidth+x], this.triggersMap[y*this.mapWidth+x]);
      }
    }
  }
  addBlock(x, y, blockGid, triggerGid) {
    let block = new Block(this.scene, this, x, y, this._getBlockProps(blockGid, triggerGid));
    this.addChild(block);
  }

  // Collision
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

  checkOutRangeBlocks() {
    for(let i = 0; i < this.children.length; i++) {
      let block = this.children[i];
      let y = block.transform.worldTransform.ty/this.game.scale-this.tileSize/2;
      if(y >= this.game.h-this.tileSize*2) block.renderable && block.hide();
      else if(y >= -this.tileSize*2) {
        !block.renderable && block.show();
      }
    }
  }
}

module.exports = MapManager;
