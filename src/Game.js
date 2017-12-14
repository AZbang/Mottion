const ScenesManager = require('./managers/ScenesManager');

class Game extends PIXI.Application {
  constructor() {
    super(window.innerWidth, window.innerHeight, {backgroundColor: 0xfcfcfc})
    document.body.appendChild(this.view);

    this.scenesManager = new ScenesManager(this);
    this.stage.addChild(this.scenesManager);

    this._initTicker();
  }
  _initTicker() {
    this.ticker.add((dt) => {
      this.scenesManager.update(dt);
    });
  }
}

module.exports = Game;
