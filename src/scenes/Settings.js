const ParalaxManager = require('../managers/ParalaxManager');
const InterfaceManager = require('../managers/InterfaceManager');
const FxManager = require('../managers/FxManager');

class Settings extends PIXI.Container {
  constructor(game) {
    super();

    this.game = game;
    this.settings = game.settings;

    this.background = new ParalaxManager(this);
    this.ui = new InterfaceManager(this);
    this.fx = new FxManager(this);

    let top = 250;
    let inputPadding = 110;
    this.ui.addListInput({
      value: 'Fullscreen: ',
      font: 'normal 72px Milton Grotesque',
      color: 0xFFFFFF,
      x: this.game.w/2,
      y: top+inputPadding,
      list: ['OFF', 'ON'],
      current: this.settings.isFullscreen,
      set: (i) => this.settings.toggleFullscreen(i)
    });
    this.ui.addListInput({
      value: 'Music: ',
      font: 'normal 72px Milton Grotesque',
      color: 0xFFFFFF,
      x: this.game.w/2,
      y: top+2*inputPadding,
      list: ['OFF', 'ON'],
      current: this.settings.music ? 1 : 0,
      set: (i) => this.settings.toggleMusic(i)
    });
    this.ui.addListInput({
      value: 'Sounds: ',
      font: 'normal 72px Milton Grotesque',
      color: 0xFFFFFF,
      x: this.game.w/2,
      y: top+3*inputPadding,
      list: ['OFF', 'ON'],
      current: this.settings.sounds ? 1 : 0,
      set: (i) => this.settings.toggleSounds(i)
    });
    this.ui.addListInput({
      value: 'Lang: ',
      font: 'normal 72px Milton Grotesque',
      color: 0xFFFFFF,
      x: this.game.w/2,
      y: top+4*inputPadding,
      list: this.settings.LANGS,
      current: this.settings.langIndex,
      set: (i) => this.settings.setLang(i)
    });
    this.ui.addButton({
      image: 'close.png',
      x: this.game.w-100,
      y: 100,
      click: () => this.game.scenes.toScene('menu', 0xFFFFFF)
    });
  }
}

module.exports = Settings;
