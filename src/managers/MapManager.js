const Block = require('../subjects/Block');
const DataFragmentConverter = require('../utils/DataFragmentConverter');

class MapManager extends PIXI.projection.Container2d {
  constructor(scene, params={}) {
    super();

    this.scene = scene;
    this.game = scene.game;

    this.maxAxisX = params.maxX || 6;
    this.blockSize = params.tileSize || 100;
    this.setBlocksData(require('../content/blocks'));
    this.resize();

    this.speed = 500;
    this.lastIndex = 0;

    this.events = {};
  }
  // Set params
  resize() {
    this.x = this.game.w/2-this.maxAxisX*this.blockSize/2;
    this.y = this.game.h-this.scene.PADDING_BOTTOM;
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
  setBlocksData(data) {
    this.BLOCKS = data || {};
  }

  // Event Emitter
  on(e, cb) {
    this.events[e] = cb;
  }
  triggerEvent(e, arg) {
    this.events[e] && this.events[e](arg);
  }

  // Map Manager
  addMap(map) {
    for(let i = map.length-1; i >= 0; i--) {
      this.addFragment(map[i]);
    }
  }
  addFragment(fragData) {
    let frag = new DataFragmentConverter(fragData).fragment;

    for(let i = 0; i < frag.length; i++) {
      // add block to center X axis, for example: round((8-4)/2) => +2 padding to block X pos
      this.addBlock(frag[i], Math.round((this.maxAxisX-frag.length)/2)+i, this.lastIndex);
    }
    this.lastIndex++;
  }
  addBlock(id, x, y) {
    if(id === '_') return;

    let posX = x*this.blockSize;
    let posY = -y*this.blockSize;
    this.addChild(new Block(this, posX, posY, this.BLOCKS[id]));
  }

  // Collision Widh Block
  getBlockFromPos(x, y) {
    for(let i = 0; i < this.children.length; i++) {
      if(this.children[i].containsPoint(new PIXI.Point(x, y))) return this.children[i];
    }
  }

  // Moving Map
  scrollDown(blocks) {
    // Scroll map down on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y+blocks*this.blockSize});
    move.time = this.speed*blocks;
    move.on('end', () => this.triggerEvent('scrollEnd'));
    move.start();
  }
  scrollTop(blocks) {
    // Scroll map top on X blocks
    let move = PIXI.tweenManager.createTween(this);
    move.from({y: this.y}).to({y: this.y-blocks*this.blockSize});
    move.time = this.speed*blocks;
    move.on('end', () => this.triggerEvent('scrollEnd'));
    move.start();
  }

  update() {
    // Computing map end (amt blocks < max amt blocks)
    if(this.children.length < this.maxAxisX*(this.game.h/this.blockSize)) {
      this.triggerEvent('mapEnd');
    }

    // clear out range map blocks
    for(let i = 0; i < this.children.length; i++) {
      if(this.children[i].worldTransform.ty-this.blockSize/2 > this.game.h) {
        this.removeChild(this.children[i]);
      }
    }
  }
}

module.exports = MapManager;
