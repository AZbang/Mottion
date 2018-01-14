// content
const map = require('../content/map');
const blocks = require('../content/blocks');
const triggers = require('../content/triggers');
const history = require('../content/history');

// managers
const MapManager = require('../managers/MapManager');
const HistoryManager = require('../managers/HistoryManager');
const BackgroundManager = require('../managers/BackgroundManager');

// subjects
const Player = require('../subjects/Player');

// filters
const AlphaGradientFilter = require('../filters/AlphaGradientFilter');


class Playground extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.background = new BackgroundManager(game, this);
    this.addChild(this.background);

    this.projection = new PIXI.projection.Container2d();
    this.projection.proj.setAxisY({x: -this.game.w/2+50, y: 4000}, -1);
    this.addChild(this.projection);

    this.map = new MapManager(game, this, map, blocks, triggers);
    this.projection.addChild(this.map);

    this.history = new HistoryManager(game, this, history);
    this.player = new Player(game, this, this.map);
    this.addChild(this.history, this.player);

    this._addSounds();
    this._setFilters();
    this._bindEvents();
  }
  _bindEvents() {
    this.interactive = true;
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
  _addSounds() {
    PIXI.sound.play('sound_fire', {loop: true});
    PIXI.sound.volume('sound_fire', .5);
    PIXI.sound.play('sound_noise', {loop: true});
    PIXI.sound.volume('sound_noise', .3);
  }
  _setFilters() {
    this.game.noiseBlur.blurRadius = 0.0003;
    this.game.grayscale.r = 0.8;
    // this.background.filters = [new PIXI.filters.AdvancedBloomFilter({
    //   bloomScale: .4,
    //   brightness: 0.5
    // })];
  }
  restart() {
    this.game.splash.show(0xEEEEEE, 500, 500, () => {
      this.game.scenes.enableScene('playground');
    });
  }
}

module.exports = Playground;
