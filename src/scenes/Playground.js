// managers
const MapManager = require('../managers/MapManager');
const HistoryManager = require('../managers/HistoryManager');
const ParalaxManager = require('../managers/ParalaxManager');
const GameplayManager = require('../managers/GameplayManager');
const InterfaceManager = require('../managers/InterfaceManager');
const Player = require('../subjects/Player');
const FxManager = require('../managers/FxManager');
const RotationFilter = require('../filters/rotation');

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

    this.fx = new FxManager(this);

    this.wrap = new PIXI.Container();
    this.wrap.filterArea = new PIXI.Rectangle(0, 0, this.game.w, this.game.h);
    this.addChild(this.wrap);

    this.game.mouse.filters = [new RotationFilter()];
    this.wrap.filters = [new RotationFilter()];

    this.map = new MapManager(this, this.checkpoint, this.wrap);
    this.paralax = new ParalaxManager(this, this.wrap);
    this.player = new Player(this, this.wrap);

    this.history = new HistoryManager(this);
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
    this.game.scenes.once('disabledScene', () => this.game.mouse.filters = []);
  }
  rotation(start, end, props) {
    let data = {};
    let rotate = PIXI.tweenManager.createTween(data);
    Object.assign(rotate, {time: 1000}, props);
    rotate.from({rotation: start}).to({rotation: end});
    rotate.on('update', () => {
      this.game.mouse.filters[0].rotation = data.rotation;
      this.wrap.filters[0].rotation = data.rotation;
    });
    rotate.start();
  }
  update() {
    this.scoreText.text = 'LIVE: ' + this.score;
  }
}

module.exports = Playground;
