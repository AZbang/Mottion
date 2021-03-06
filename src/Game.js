require("pixi-projection");
require("pixi-tween");
require("./Timer");

const Settings = require("./core/Settings");
const Music = require("./core/Music");
const Store = require("./core/Store");
const Scenes = require("./core/Scenes");
const Splash = require("./core/Splash");
const Mouse = require("./core/Mouse");
const Debugger = require("./core/Debugger");
const Scripts = require("./core/Scripts");

class Game extends PIXI.Container {
  constructor() {
    super();

    this.renderer = PIXI.autoDetectRenderer({ background: 0xffffff });
    this.ticker = new PIXI.ticker.Ticker();
    this.view = this.renderer.view;
    document.body.appendChild(this.view);

    this.w = 1920;
    this.h = 980;
    this.resolution = null;

    this.bg = new PIXI.Sprite.fromImage("bg");
    this.addChild(this.bg);

    this.scripts = new Scripts(this);
    this.audio = new Music(this);
    this.store = new Store(this);
    this.settings = new Settings(this);
    this.debug = new Debugger(this);

    this.scenes = new Scenes(this);
    this.mouse = new Mouse(this);
    this.splash = new Splash(this);

    this.ticker.add(dt => {
      this.renderer.render(this);
      PIXI.tweenManager.update();
      PIXI.timerManager.update();
    });
    this.ticker.start();
    this.resize();
    this._bindEvents();
  }
  _bindEvents() {
    window.addEventListener("resize", () => this.resize(this));
  }
  resize() {
    this.resolution = window.innerWidth / this.w;
    this.renderer.resize(window.innerWidth, this.h * this.resolution);
    this.view.style.marginTop =
      window.innerHeight / 2 - (this.h * this.resolution) / 2 + "px";
    this.scale.set(this.resolution);
  }
}

module.exports = Game;
