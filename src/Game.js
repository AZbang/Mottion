require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
require('pixi-particles');
require('pixi-filters');

const emitterData = require('./content/emitter.json');
const SettingsManager = require('./managers/SettingsManager');
const ScenesManager = require('./managers/ScenesManager');
const SplashManager = require('./managers/SplashManager');
const DebuggerManager = require('./managers/DebuggerManager');
const Sphere = require('./subjects/Sphere');
const GrayscaleFilter = require('./filters/GrayscaleFilter');
const NoiseBlurFilter = require('./filters/NoiseBlurFilter');

class Game extends PIXI.Application {
  constructor() {
    super({backgroundColor: 0xFFFFFF});

    this.w = 1920;
    this.h = 880;

    this.settings = new SettingsManager(this);
    this.debug = new DebuggerManager(this);
    this.scenes = new ScenesManager(this);
    this.splash = new SplashManager(this);
    this.mouse = new Sphere(this, emitterData);
    this.stage.addChild(this.scenes, this.debug, this.mouse, this.splash);

    this._bindEvents();
    this._setFilters();
    this._addTicker();
    this.resize();

    PIXI.sound.play('music_slowmotion');
    this.splash.show(0xECEEFF, 10, 1000);
  }
  _bindEvents() {
    this.stage.interactive = true;
    this.stage.cursor = 'none';

    window.addEventListener("resize", this.resize.bind(this));
    this.stage.on('pointermove', (e) => {
      this.mouse.setPos({x: e.data.global.x/this.scale, y: e.data.global.y/this.scale});
      this.grayscale.x = e.data.global.x/this.w/this.scale;
      this.grayscale.y = e.data.global.y/this.h/this.scale;
    });
  }
  _addTicker() {
    this.ticker.add((dt) => {
      PIXI.tweenManager.update();
    });
  }
  _setFilters() {
    this.grayscale = new GrayscaleFilter();
    this.noiseBlur = new NoiseBlurFilter();
    this.stage.filters = [this.grayscale, this.noiseBlur];
  }
  resize() {
    this.scale = window.innerWidth/this.w;
    this.renderer.resize(window.innerWidth, this.h*this.scale);
    this.view.style.marginTop = window.innerHeight/2-this.h*this.scale/2 + 'px';
    this.stage.scale.set(this.scale);
  }
}

module.exports = Game;
