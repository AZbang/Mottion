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
      checkpoint: 1,
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
    this.scoreText = this.ui.addText({
      text: '',
      font: 'normal 82px Milton Grotesque',
      color: 0xfffd4d,
      x: 50,
      anchor: 0,
      y: 50
    });
    this.ui.addButton({
      image: 'close.png',
      x: this.game.w-100,
      y: 100,
      click: () => this.game.scenes.toScene('menu', 0xFFFFFF)
    });
    this.game.splash.show(0xFFFFFF, 0, 500);
    this.game.ticker.add((dt) => this.update(dt));
  }
  update() {
    this.scoreText.text = 'LIVE: ' + this.score;
  }
}

module.exports = Playground;
