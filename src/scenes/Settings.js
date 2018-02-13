const ParalaxManager = require('../managers/ParalaxManager');
const InterfaceManager = require('../managers/InterfaceManager');
const FilterManager = require('../managers/FilterManager');


class Settings extends PIXI.Container {
  constructor(game) {
    super();

    this.game = game;
    this.settings = game.settings;

    this.background = new ParalaxManager(this);
    this.ui = new InterfaceManager(this);
    this.fx = new FilterManager(this);

    let top = 200;
    let inputPadding = 130;
    this.ui.addListInput({
      value: 'Music: ',
      font: 'normal 72px Milton Grotesque',
      color: 0xFFFFFF,
      x: this.game.w/2,
      y: top+inputPadding,
      list: ['OFF', 'ON'],
      current: +this.settings.music,
      set: () => this.settings.toggleMusic()
    });
    this.ui.addListInput({
      value: 'Sounds: ',
      font: 'normal 72px Milton Grotesque',
      color: 0xFFFFFF,
      x: this.game.w/2,
      y: top+2*inputPadding,
      list: ['OFF', 'ON'],
      current: +this.settings.sounds,
      set: () => this.settings.toggleSounds()
    });
    this.ui.addListInput({
      value: 'Lang: ',
      font: 'normal 72px Milton Grotesque',
      color: 0xFFFFFF,
      x: this.game.w/2,
      y: top+3*inputPadding,
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
