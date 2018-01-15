// managers
const MapManager = require('../managers/MapManager');
const HistoryManager = require('../managers/HistoryManager');
const BackgroundManager = require('../managers/BackgroundManager');
const GameplayManager = require('../managers/GameplayManager');
const Player = require('../subjects/Player');

// filters
const AlphaGradientFilter = require('../filters/AlphaGradientFilter');


class Playground extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.background = new BackgroundManager(this);

    this.map = new MapManager(this);
    this.history = new HistoryManager(this);
    this.player = new Player(this, this.map);
    this.gameplay = new GameplayManager(this);
    
    this._addSounds();
    this._setFilters();
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
