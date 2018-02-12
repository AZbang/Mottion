// managers
const MapManager = require('../managers/MapManager');
const HistoryManager = require('../managers/HistoryManager');
const ParalaxManager = require('../managers/ParalaxManager');
const GameplayManager = require('../managers/GameplayManager');
const InterfaceManager = require('../managers/InterfaceManager');
const Player = require('../subjects/Player');
const FilterManager = require('../managers/FilterManager');

class Playground extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    Object.assign(this, {
      score: 0,
      checkpoint: 0
    }, this.game.store.getGameplay());

    this.background = new ParalaxManager(this);
    this.fx = new FilterManager(this);
    
    this.map = new MapManager(this, this.checkpoint);
    this.history = new HistoryManager(this);
    this.player = new Player(this);
    this.gameplay = new GameplayManager(this);

    this.ui = new InterfaceManager(this);
    this.ui.addButton({
      image: 'settings.png',
      x: this.game.w-100,
      y: this.game.h-100,
      click: () => this.game.scenes.toScene('settings', 0xFFFFFF)
    });

    this.game.splash.show(0xFFFFFF, 0, 1000);
  }
}

module.exports = Playground;
