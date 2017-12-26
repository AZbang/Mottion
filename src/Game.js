const ScenesManager = require('./managers/ScenesManager');
const filters = require('pixi-filters');
const CloudsFilter = require('./shaders/clouds');
const Sphere = require('./subjects/Sphere');

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
      vignetting: 0,
      noise: .1,
      vignettingBlur: 1
    })];

    this.container.interactive = true;
    this.container.cursor = 'none';
    this.mouse = new Sphere();
    this.container.addChild(this.mouse);

    this.container.on('pointermove', (e) => {
      this.mouse.x = e.data.global.x;
      this.mouse.y = e.data.global.y;
    });

    this._initTicker();
  }
  _initTicker() {
    this.ticker.add((dt) => {
      this.scenes.update(dt);
      PIXI.tweenManager.update();
      this.container.filters[0].seed = Math.random();
      this.mouse.update(dt);
      // this.container.filters[0].time += .01;
    });
  }
}

module.exports = Game;
