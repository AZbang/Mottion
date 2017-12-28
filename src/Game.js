// objects
const ScenesManager = require('./managers/ScenesManager');
const Sphere = require('./subjects/Sphere');

// filters
const GrayscaleFilter = require('./filters/GrayscaleFilter');
const NoiseBlurFilter = require('./filters/NoiseBlurFilter');
const CloudsFilter = require('./filters/CloudsFilter');


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

    this.grayscale = new GrayscaleFilter();
    this.noiseBlur = new NoiseBlurFilter();
    this.container.filters = [this.grayscale, this.noiseBlur];

    this.container.interactive = true;
    this.container.cursor = 'none';
    this.mouse = new Sphere();
    this.container.addChild(this.mouse);

    this.container.on('pointermove', (e) => {
      this.grayscale.x = e.data.global.x/this.w;
      this.grayscale.y = e.data.global.y/this.h;
      this.mouse.x = e.data.global.x;
      this.mouse.y = e.data.global.y;
    });

    this._initTicker();
  }
  _initTicker() {
    this.ticker.add((dt) => {
      PIXI.tweenManager.update();
      this.scenes.update(dt);
      this.mouse.update(dt);
    });
  }
}

module.exports = Game;
