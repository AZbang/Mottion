const ScenesManager = require('./managers/ScenesManager');
const filters = require('pixi-filters');

class Game extends PIXI.Application {
  constructor() {
    super(window.innerWidth, window.innerHeight, {backgroundColor: 0xfcfcfc})
    document.body.appendChild(this.view);

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.container = new PIXI.Container();
    this.stage.addChild(this.container);

    this.bg = new PIXI.Sprite(PIXI.Texture.fromImage('bg'));
    this.bg.width = this.w;
    this.bg.height = this.h;
    this.container.addChild(this.bg);

    this.scenes = new ScenesManager(this);
    this.container.addChild(this.scenes);

    this.container.filterArea = new PIXI.Rectangle(0, 0, this.w, this.h);
    this.container.filters = [new filters.OldFilmFilter({
      sepia: 0,
      vignetting: .01,
      noise: .1,
      vignettingBlur: 1
    })];

    this._initTicker();
  }
  _initTicker() {
    this.ticker.add((dt) => {
      this.scenes.update(dt);
      PIXI.tweenManager.update();
      this.container.filters[0].seed = Math.random();
      this.container.filters[0].time += .01;
    });
  }
}

module.exports = Game;
