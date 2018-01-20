const BackgroundManager = require('../managers/BackgroundManager');
const InterfaceManager = require('../managers/InterfaceManager');

class Settings extends PIXI.Container {
  constructor(game) {
    super();

    this.game = game;
    this.settings = game.settings;

    this.top = 90;
    this.inputPadding = 130;

    this.background = new BackgroundManager(this);
    this.ui = new InterfaceManager(this);

    this.ui.addCheckBoxInput('Music', 850, this.top+1*this.inputPadding, this.settings.music, () => this.settings.toggleMusic());
    this.ui.addCheckBoxInput('Sounds', 850, this.top+2*this.inputPadding, this.settings.sounds, () => this.settings.toggleSounds());
    this.ui.addListInput('Lang: ', this.game.w/2, this.top+3*this.inputPadding, this.settings.LANGS, this.settings.langIndex, (i) => this.settings.setLang(i));
    this.ui.addButton('close.png', this.game.w-100, 100, () => this.game.scenes.toScene('menu', 0xF9E4FF));

    this._setFilters();
  }
  _setFilters() {
    this.game.noiseBlur.blurRadius = 0.0005;
  }
}

module.exports = Settings;
