// managers
const ScenesManager = require('./managers/ScenesManager');
const SplashManager = require('./managers/SplashManager');

// objects
const Sphere = require('./subjects/Sphere');

// filters
const GrayscaleFilter = require('./filters/GrayscaleFilter');
const NoiseBlurFilter = require('./filters/NoiseBlurFilter');
const CloudsFilter = require('./filters/CloudsFilter');


class Game extends PIXI.Application {
  constructor() {
    super();

    this.lang = 'ru';
    this.w = 1920;
    this.h = 880;

    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.container.cursor = 'none';
    this.stage.addChild(this.container);

    this.scenes = new ScenesManager(this);
    this.container.addChild(this.scenes);

    this.grayscale = new GrayscaleFilter();
    this.noiseBlur = new NoiseBlurFilter();
    this.container.filters = [this.grayscale, this.noiseBlur];

    this.mouse = new Sphere();
    this.container.addChild(this.mouse);

    this.splash = new SplashManager(this);
    this.stage.addChild(this.splash);
    this.splash.show(0xECEEFF, 10, 1000);

    this._bindEvents();
    this._initTicker();
    this.resize();
  }
  _bindEvents() {
    window.addEventListener("resize", this.resize.bind(this));

    this.container.on('pointermove', (e) => {
      this.mouse.setPos({x: e.data.global.x/this.scale, y: e.data.global.y/this.scale});
      this.grayscale.x = e.data.global.x/this.w/this.scale;
      this.grayscale.y = e.data.global.y/this.h/this.scale;
    });
  }
  _initTicker() {
    this.ticker.add((dt) => {
      PIXI.tweenManager.update();
      this.scenes.update(dt);
      this.mouse.update(dt);
    });
  }
  resize() {
    this.scale = window.innerWidth/this.w;
    this.renderer.resize(window.innerWidth, this.h*this.scale);
    this.view.style.marginTop = window.innerHeight/2-this.h*this.scale/2 + 'px';
    this.container.scale.set(this.scale);
  }
}

module.exports = Game;
