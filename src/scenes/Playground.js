// managers
const MapManager = require('../managers/MapManager');
const HistoryManager = require('../managers/HistoryManager');
const BackgroundManager = require('../managers/BackgroundManager');
const GameplayManager = require('../managers/GameplayManager');
const InterfaceManager = require('../managers/InterfaceManager');
const Player = require('../subjects/Player');

class Playground extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    Object.assign(this, {
      score: 0,
      checkpoint: 0
    }, this.game.store.getGameplay());

    this.background = new BackgroundManager(this);

    this.map = new MapManager(this, this.checkpoint);
    this.history = new HistoryManager(this);
    this.player = new Player(this);
    this.gameplay = new GameplayManager(this);

    this.ui = new InterfaceManager(this);
    this.ui.addButton('settings.png', this.game.w-100, 100, () => this.game.scenes.toScene('settings', 0xF9E4FF));

    this.game.splash.show(0xFFFFFF, 0, 1000);
  }
}

module.exports = Playground;
