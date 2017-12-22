/*
  Движок тайловой карты
  События:
    addedMap => map
    addedFragment => fragments
    addedBlock => block
    scrolledDown => dtDown
    scrolledTop => dtTop

    resized
    endedMap
    clearedOutRangeBlocks
*/


const Block = require('../subjects/Block');
const DataFragmentConverter = require('../utils/DataFragmentConverter');

class MapManager extends PIXI.projection.Container2d {
  constructor(scene, params={}) {
    super();
    scene.addChild(this);

    this.scene = scene;
    this.game = scene.game;

    this.maxAxisX = params.maxX || 5;
    this.blockSize = params.tileSize || 100;
    this.setBlocksData(require('../content/blocks'));
    this.resize();

    this.isStop = false;

    this.speed = 500;
    this.lastIndex = 0;
  }
  resize() {
    this.x = this.game.w/2-this.maxAxisX*this.blockSize/2;
    this.y = this.game.h-this.scene.PADDING_BOTTOM;
    this.emit('resized');
  }

  // Set params
  setBlocksData(data) {
    this.BLOCKS = data || {};
  }
  setMaxAxisX(max) {
    this.maxAxisX = max || 6;
    this.resize();
  }
  setBlockSize(size) {
    this.blockSize = size || 100;
    this.resize();
  }
  setSpeed(speed) {
    this.speed = speed || 500;
  }


  // Map Manager
  addMap(map) {
    for(let i = map.length-1; i >= 0; i--) {
      this.addFragment(map[i]);
    }
    this.emit('addedMap', map);
    this.clearOutRangeBlocks();
    this.computingMapEnd();
  }
  addFragment(fragData) {
    let frag = new DataFragmentConverter(fragData).fragment;
    // add block to center X axis, for example: round((8-4)/2) => +2 padding to block X pos
    for(let i = 0; i < frag.length; i++) {
      this.addBlock(frag[i], Math.round((this.maxAxisX-frag.length)/2)+i, this.lastIndex);
    }

    this.lastIndex++;
    this.emit('addedFragment', fragData);
  }
  addBlock(id, x, y) {
    if(id === '_') return;

    let posX = x*this.blockSize;
    let posY = -y*this.blockSize;
    let block = this.addChild(new Block(this, posX, posY, this.BLOCKS[id]));
    this.emit('addedBlock', block);
  }

  // Collision Widh Block
  getBlockFromPos(pos) {
    for(let i = 0; i < this.children.length; i++) {
      if(this.children[i].containsPoint(pos)) return this.children[i];
    }
  }

  // Moving Map
  scrollDown(blocks) {
    if(this.isStop) return;

    // Scroll map down on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y+blocks*this.blockSize});
    move.time = this.speed*blocks;
    move.on('end', () => {
      this.emit('scrolledDown', blocks);
      this.clearOutRangeBlocks();
      this.computingMapEnd();
    });
    move.start();
  }
  scrollTop(blocks) {
    if(this.isStop) return;

    // Scroll map top on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y-blocks*this.blockSize});
    move.time = this.speed*blocks;
    move.on('end', () => {
      this.emit('scrolledTop', blocks);
      this.clearOutRangeBlocks();
      this.computingMapEnd();
    });
    move.start();
  }

  // Computing map end (amt blocks < max amt blocks)
  computingMapEnd() {
    if(this.children.length < this.maxAxisX*(this.game.h/this.blockSize)) {
      this.emit('endedMap');
    }
  }

  // clear out range map blocks
  clearOutRangeBlocks() {
    for(let i = 0; i < this.children.length; i++) {
      if(this.children[i].worldTransform.ty-this.blockSize/2 > this.game.h) {
        this.removeChild(this.children[i]);
      }
    }
    this.emit('clearedOutRangeBlocks');
  }
}

module.exports = MapManager;
