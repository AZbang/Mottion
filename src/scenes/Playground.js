// content
const map = require('../content/map');
const blocks = require('../content/blocks');
const triggers = require('../content/triggers');
const history = require('../content/history');

// managers
const MapManager = require('../managers/MapManager');
const HistoryManager = require('../managers/HistoryManager');

// subjects
const Player = require('../subjects/Player');
const Thlen = require('../subjects/Thlen');

// filters
const AlphaGradientFilter = require('../filters/AlphaGradientFilter');


class Playground extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.game.noiseBlur.blurRadius = 0.0001;
    this.game.grayscale.r = 0.8;

    this.bg = new PIXI.Sprite(PIXI.Texture.fromImage('bg'));
    this.bg.width = this.game.w;
    this.bg.height = this.game.h;
    this.addChild(this.bg);

    // Init objects
    this.projection = new PIXI.projection.Container2d();
    this.projection.proj.setAxisY({x: -this.game.w/2+50, y: 4000}, -1);
    this.projection.filters = [new AlphaGradientFilter(.3, .1)];
    this.addChild(this.projection);

    this.map = new MapManager(this, map, blocks, triggers);
    this.projection.addChild(this.map);

    this.history = new HistoryManager(this, history);
    this.player = new Player(this, this.map);
    this.thlen = new Thlen(this);
    this.addChild(this.history, this.player, this.thlen);

    // Controls
    this.interactive = true;
    this._bindEvents();
  }
  _bindEvents() {
    this.on('pointerdown', () => this.player.immunity());
    this.on('pointermove', (e) => {
      for(let i = 0; i < this.map.children.length; i++) {
        let block = this.map.children[i];
        if(block.containsPoint(e.data.global)) {
          return block.hit();
        } else block.unhit();
      }
    });


    this.history.on('hidden', () => {
      this.player.startMove();
    });

    this.player.on('deaded', () => this.restart());
    this.player.on('collidedBlock', (block) => {
      block.historyID && this.history.show(block.historyID);
    });
    this.player.top();
  }
  restart() {
    this.game.splash.show(0xEEEEEE, 500, 500, () => {
      this.game.scenes.enableScene('playground');
    });
  }
  update() {
    this.history.update();
    this.thlen.update();
  }
}

module.exports = Playground;
