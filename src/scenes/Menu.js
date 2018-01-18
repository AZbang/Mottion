const BackgroundManager = require('../managers/BackgroundManager');
const InterfaceManager = require('../managers/InterfaceManager');

class Menu extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.background = new BackgroundManager(this);
    this.ui = new InterfaceManager(this);

    this.ui.addLabel('Mottion', 330, this.game.w/2, () => {
      this.game.scenes.toScene('playground', 0xF9E4FF)
    });
    this.ui.addCitaty('He played with his dreams, and dreams played to them.', 500, this.game.w/2, () => {
      this.game.scenes.toScene('playground', 0xF9E4FF)
    });
    this.ui.addButton('settings.png', this.game.w-100, this.game.h-100, () => {
      this.game.scenes.toScene('settings', 0xF9E4FF)
    });

    this._setFilters();
  }
  _setFilters() {
    this.game.noiseBlur.blurRadius = 0.0005;
  }
}

module.exports = Menu;
