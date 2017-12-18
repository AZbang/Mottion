const ScenesManager = require('./managers/ScenesManager');

class Game extends PIXI.Application {
  constructor() {
    super(window.innerWidth, window.innerHeight, {backgroundColor: 0xfcfcfc})
    document.body.appendChild(this.view);

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.scenes = new ScenesManager(this);
    this.stage.addChild(this.scenes);

    this._initTicker();
  }
  _initTicker() {
    this.ticker.add((dt) => {
      PIXI.tweenManager.update();
    });
  }
}

module.exports = Game;
