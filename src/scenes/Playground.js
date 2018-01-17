// managers
const MapManager = require('../managers/MapManager');
const HistoryManager = require('../managers/HistoryManager');
const BackgroundManager = require('../managers/BackgroundManager');
const GameplayManager = require('../managers/GameplayManager');
const Player = require('../subjects/Player');

class Playground extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    Object.assign(this, {
      score: 0,
      checkpoint: 0
    }, this.game.store.getPlayground());

    this.background = new BackgroundManager(this);
    this.history = new HistoryManager(this);
    this.map = new MapManager(this);
    this.player = new Player(this);

    this.gameplay = new GameplayManager(this);

    this._addSounds();
    this._setFilters();

    this.game.splash.show(0xFFFFFF, 1000, 1000);
  }
  _addSounds() {
    PIXI.sound.play('sound_fire', {loop: true});
    PIXI.sound.volume('sound_fire', .5);
    PIXI.sound.play('sound_noise', {loop: true});
    PIXI.sound.volume('sound_noise', .3);
  }
  _setFilters() {
    this.game.noiseBlur.blurRadius = 0.0003;
  }
}

module.exports = Playground;
