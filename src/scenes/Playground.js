// managers
const SceneManager = require('../managers/SceneManager');
const MapManager = require('../managers/MapManager');
const HistoryManager = require('../managers/HistoryManager');
const ParalaxManager = require('../managers/ParalaxManager');
const GameplayManager = require('../managers/GameplayManager');
const InterfaceManager = require('../managers/InterfaceManager');
const ParticlesManager = require('../managers/ParticlesManager');
const ImmunityManager = require('../managers/ImmunityManager');
const FxManager = require('../managers/FxManager');
const Player = require('../subjects/Player');

class Playground extends SceneManager {
  constructor(game, isRestart=false) {
    super(game);

    Object.assign(this, {
      score: 0,
      checkpoint: 1,
      activateType: 'white'
    }, this.game.store.getGameplay());

    this.isRestarted = isRestart;
    this.immunity = [];

    this._init();
    this.game.splash.show(0xFFFFFF, 0, 500);
  }
  _init() {
    this.fx = new FxManager(this, {rotation: true});

    this.map = new MapManager(this, this.checkpoint, this.rotationContainer);
    this.paralax = new ParalaxManager(this, this.rotationContainer);
    this.player = new Player(this, this.rotationContainer);
    this.particles = new ParticlesManager(this, this.rotationContainer);

    this.history = new HistoryManager(this);
    this.gameplay = new GameplayManager(this);

    this.ui = new InterfaceManager(this);
    this.immunity = new ImmunityManager(this);
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
  }
  update() {
    this.scoreText.text = 'LIVE: ' + this.score;
  }
}

module.exports = Playground;
