// managers
const ScenesManager = require('./managers/ScenesManager');
const SplashManager = require('./managers/SplashManager');
const DebuggerManager = require('./managers/DebuggerManager');
// objects
const Sphere = require('./subjects/Sphere');

// filters
const GrayscaleFilter = require('./filters/GrayscaleFilter');
const NoiseBlurFilter = require('./filters/NoiseBlurFilter');
const CloudsFilter = require('./filters/CloudsFilter');


class Game extends PIXI.Application {
  constructor() {
    super();

    this.lang = 'en';
    this.w = 1920;
    this.h = 880;

    this.stage.interactive = true;
    this.stage.cursor = 'none';

    this.scenes = new ScenesManager(this);
    this.stage.addChild(this.scenes);

    this.grayscale = new GrayscaleFilter();
    this.noiseBlur = new NoiseBlurFilter();
    this.stage.filters = [this.grayscale, this.noiseBlur];

    this.mouse = new Sphere();
    this.stage.addChild(this.mouse);

    this.splash = new SplashManager(this);
    this.stage.addChild(this.splash);

    this.debug = new DebuggerManager(this);
    this.stage.addChild(this.debug);

    this._bindEvents();
    this._initTicker();
    this.resize();

    this.splash.show(0xECEEFF, 10, 1000);
  }
  _bindEvents() {
    window.addEventListener("resize", this.resize.bind(this));

    this.stage.on('pointermove', (e) => {
      this.mouse.setPos({x: e.data.global.x/this.scale, y: e.data.global.y/this.scale});
      this.grayscale.x = e.data.global.x/this.w/this.scale;
      this.grayscale.y = e.data.global.y/this.h/this.scale;
    });
    this.stage.on('pointerup', (e) => {
      console.log(e.data.global.x, e.data.global.y)
      console.log(this.mouse.emitter.spawnPos.x, this.mouse.emitter.spawnPos.y);
    });
  }
  _initTicker() {
    this.ticker.add((dt) => {
      PIXI.tweenManager.update();
      this.scenes.update(dt);
      this.mouse.update(dt);
      this.debug.update(dt);
    });
  }
  resize() {
    this.scale = window.innerWidth/this.w;
    this.renderer.resize(window.innerWidth, this.h*this.scale);
    this.view.style.marginTop = window.innerHeight/2-this.h*this.scale/2 + 'px';
    this.stage.scale.set(this.scale);
  }
}

module.exports = Game;
