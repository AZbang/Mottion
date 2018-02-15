// managers
const MapManager = require('../managers/MapManager');
const HistoryManager = require('../managers/HistoryManager');
const ParalaxManager = require('../managers/ParalaxManager');
const GameplayManager = require('../managers/GameplayManager');
const InterfaceManager = require('../managers/InterfaceManager');
const Player = require('../subjects/Player');
const FxManager = require('../managers/FxManager');

class Playground extends PIXI.Container {
  constructor(game, isRestart=false) {
    super();
    this.game = game;

    Object.assign(this, {
      score: 0,
      checkpoint: 0,
      activateType: 'white'
    }, this.game.store.getGameplay());

    this.isRestarted = isRestart;

    this.paralax = new ParalaxManager(this);
    this.fx = new FxManager(this);

    this.map = new MapManager(this, this.checkpoint);
    this.history = new HistoryManager(this);
    this.player = new Player(this);
    this.gameplay = new GameplayManager(this);

    this.ui = new InterfaceManager(this);
    this.ui.addButton({
      image: 'close.png',
      x: this.game.w-100,
      y: 100,
      click: () => this.game.scenes.toScene('menu', 0xFFFFFF)
    });
    this.game.splash.show(0xFFFFFF, 0, 500);
  }
}

module.exports = Playground;
