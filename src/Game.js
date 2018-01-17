require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
require('pixi-particles');
require('pixi-filters');
require('./filters');

const Settings = require('./core/Settings');
const Music = require('./core/Music');
const Store = require('./core/Store');
const Scenes = require('./core/Scenes');
const Splash = require('./core/Splash');
const Mouse = require('./core/Mouse');
const Debugger = require('./core/Debugger');

class Game extends PIXI.Container {
  constructor() {
    super();

    this.renderer = PIXI.autoDetectRenderer({background: 0xFFFFFF});
    this.ticker = new PIXI.ticker.Ticker();
    this.view = this.renderer.view;
    document.body.appendChild(this.view);

    this.w = 1920;
    this.h = 880;
    this.resolution = null;

    this.store = new Store(this);
    this.settings = new Settings(this);
    this.scenes = new Scenes(this);
    this.audio = new Music(this);

    this.mouse = new Mouse(this);
    this.splash = new Splash(this);
    this.debug = new Debugger(this);

    this.noiseBlur = new PIXI.filters.NoiseBlurFilter();
    this.filters = [this.noiseBlur];

    this.ticker.add((dt) => {
      PIXI.tweenManager.update();
      this.renderer.render(this);
    });
    this.ticker.start();
    this.resize();
  }
  _bindEvents() {
    window.addEventListener('resize', () => this.resize(this));
  }
  resize() {
    this.resolution = window.innerWidth/this.w;
    this.renderer.resize(window.innerWidth, this.h*this.resolution);
    this.view.style.marginTop = window.innerHeight/2-this.h*this.resolution/2 + 'px';
    this.scale.set(this.resolution);
  }
}

module.exports = Game;
