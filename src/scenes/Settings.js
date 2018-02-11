const ParalaxManager = require('../managers/ParalaxManager');
const InterfaceManager = require('../managers/InterfaceManager');

class Settings extends PIXI.Container {
  constructor(game) {
    super();

    this.game = game;
    this.settings = game.settings;

    this.top = 90;
    this.inputPadding = 130;

    this.background = new ParalaxManager(this);
    this.ui = new InterfaceManager(this);

    this.ui.addCheckBoxInput({
      text: 'Music',
      font: 'normal 72px Milton Grotesque',
      color: 0xFFFFFF,
      x: 850,
      y: this.top+1*this.inputPadding,
      value: this.settings.music,
      set: () => this.settings.toggleMusic()
    });
    this.ui.addCheckBoxInput({
      text: 'Sounds',
      font: 'normal 72px Milton Grotesque',
      color: 0xFFFFFF,
      x: 850,
      y: this.top+2*this.inputPadding,
      value: this.settings.sounds,
      toggle: (i) => this.settings.toggleSounds(i)
    });
    this.ui.addListInput({
      value: 'Lang: ',
      font: 'normal 72px Milton Grotesque',
      color: 0xFFFFFF,
      x: this.game.w/2,
      y: this.top+3*this.inputPadding,
      list: this.settings.LANGS,
      current: this.settings.langIndex,
      toggle: (i) => this.settings.setLang(i)
    });
    this.ui.addButton({
      image: 'close.png',
      x: this.game.w-100,
      y: this.game.h-100,
      click: () => this.game.scenes.toScene('menu', 0xFFFFFF)
    });
  }
}

module.exports = Settings;
