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
    this.PADDING_BOTTOM = 280;

    // Init objects
    this.screen = new ScreenManager(this);
    this.addChild(this.screen);

    this.map = new MapManager(this, {maxX: 5, tileSize: 100});
    this.addChild(this.map);

    this.levels = new LevelManager(this);
    this.addChild(this.levels);

    this.history = new HistoryManager(this);
    this.addChild(this.history);

    this.player = new Player(this);
    this.addChild(this.player);
  }
  restart() {
    this.game.scenes.restartScene('playground');

    // this.screen.splash(0xFFFFFF, 1000).then(() => {
    //   this.game.scenes.restartScene('playground');
    // });
  }
  update() {
    this.map.update();
  }
}

module.exports = Playground;
