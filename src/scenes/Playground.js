const MapManager = require('../managers/MapManager');
const LevelManager = require('../managers/LevelManager');
const HistoryManager = require('../managers/HistoryManager');
const ScreenManager = require('../managers/ScreenManager');
const Player = require('../subjects/Player');
const Thlen = require('../subjects/Thlen');

class Playground extends PIXI.projection.Container2d {
  constructor(game) {
    super();
    this.game = game;

    // Constant for position object in projection
    this.interactive = true;

    // Init objects
    this.projection = new PIXI.projection.Container2d();
    this.projection.proj.setAxisY({x: -this.game.w/2+50, y: 4000}, -1);
    this.addChild(this.projection);

    this.map = new MapManager(this);
    this.projection.addChild(this.map);

    this.levels = new LevelManager(this, this.map);

    this.screen = new ScreenManager(this);
    this.history = new HistoryManager(this);
    this.player = new Player(this, this.map);
    this.thlen = new Thlen(this);
    this.addChild(this.screen, this.history, this.player, this.thlen);

    // Controls
    this._bindEvents();
  }
  _bindEvents() {
    this.on('pointerdown', () => this.player.immunity());
    this.on('pointermove', (e) => {
      let block = this.map.getBlockFromPos(e.data.global);
      block && block.hit();
    });

    this.player.on('deaded', () => this.restart());
    this.player.on('collision', (block) => {
      if(block.action === 'history') this.history.showText(this.levels.getCurrentLevel().history.ru, 3000);
    });

    this.history.on('showen', () => {
      this.map.isStop = true;
    });
    this.history.on('hidden', () => {
      this.map.isStop = false;
      this.map.scrollDown(1);
      this.levels.nextLevel();
    });

    this.map.on('endedMap', () => this.levels.nextFragment());
    this.map.on('scrolledDown', () => this.player.moving());

    this.levels.switchLevel(0);
    this.map.scrollDown(1);
  }
  restart() {
    this.game.scenes.restartScene('playground');

    // this.screen.splash(0xFFFFFF, 1000).then(() => {
    //   this.game.scenes.restartScene('playground');
    // });
  }
  update() {
    this.thlen.update();
  }
}

module.exports = Playground;
