const ParalaxManager = require('../managers/ParalaxManager');
const InterfaceManager = require('../managers/InterfaceManager');
const FilterManager = require('../managers/FilterManager');

class Menu extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.background = new ParalaxManager(this);
    this.ui = new InterfaceManager(this);
    this.fx = new FilterManager(this);

    this.ui.addText({
      text: 'MOTTION. Do the way',
      font: 'normal 120px Milton Grotesque',
      color: 0xFFFFFF,
      x: this.game.w/2,
      y: 330,
      click: () => this.game.scenes.toScene('playground', 0xFFFFFF)
    });
    this.ui.addText({
      text: 'If you want to live_',
      font: 'normal 82px Milton Grotesque',
      color: 0xFFFFFF,
      x: this.game.w/2,
      y: 460,
      click: () => this.game.scenes.toScene('playground', 0xFFFFFF)
    });
    this.ui.addButton({
      image: 'settings.png',
      x: this.game.w-100,
      y: this.game.h-100,
      click: () => this.game.scenes.toScene('settings', 0xFFFFFF)
    });
  }
}

module.exports = Menu;
