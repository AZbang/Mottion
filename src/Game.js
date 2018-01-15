require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
require('pixi-particles');
require('pixi-filters');

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

    // У сцены обязательно должна присутствовать ссылка на game. Совместимость с Managers
    this.stage.game = this;
    this.settings = new SettingsManager(this.stage);
    this.debug = new DebuggerManager(this.stage);
    this.scenes = new ScenesManager(this.stage);
    this.splash = new SplashManager(this.stage);
    this.mouse = new Sphere(this.stage);

    this._bindEvents();
    this._setFilters();
    this._addTicker();
    this.resize();

    PIXI.sound.play('music_sadday');
  }
  _bindEvents() {
    this.stage.interactive = true;
    this.stage.cursor = 'none';

    window.addEventListener('resize', () => this.resize(this));
    this.stage.on('pointermove', (e) => {
      this.mouse.setPos({x: e.data.global.x/this.scale, y: e.data.global.y/this.scale});
    });
  }
  _addTicker() {
    this.ticker.add((dt) => {
      PIXI.tweenManager.update();
    });
  }
  _setFilters() {
    this.noiseBlur = new NoiseBlurFilter();
    this.stage.filters = [this.noiseBlur];
  }
  resize() {
    this.scale = window.innerWidth/this.w;
    this.renderer.resize(window.innerWidth, this.h*this.scale);
    this.view.style.marginTop = window.innerHeight/2-this.h*this.scale/2 + 'px';
    this.stage.scale.set(this.scale);
  }
  toScene(scene, color) {
    this.splash.show(color, 1000, 1000, () => {
      this.scenes.enableScene(scene);
    });
  }
}

module.exports = Game;
