const MapManager = require('../managers/MapManager');
const LevelManager = require('../managers/LevelManager');
const HistoryManager = require('../managers/HistoryManager');
const ScreenManager = require('../managers/ScreenManager');
const Player = require('../subjects/Player');

class Playground extends PIXI.projection.Container2d {
  constructor(game) {
    super();
    this.game = game;

    // Projection scene
    this.proj.setAxisY({x: -this.game.w/2+50, y: 4000}, -1);

    // Constant for position object in projection
    this.interactive = true;
    this.PADDING_BOTTOM = 280;


    // Init objects
    this.map = new MapManager(this);
    this.screen = new ScreenManager(this);
    this.history = new HistoryManager(this);

    this.levels = new LevelManager(this, this.map);
    this.player = new Player(this, this.map);


    // Controls
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
}

module.exports = Playground;
