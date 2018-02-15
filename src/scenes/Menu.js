const ParalaxManager = require('../managers/ParalaxManager');
const InterfaceManager = require('../managers/InterfaceManager');
const FxManager = require('../managers/FxManager');

class Menu extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.background = new ParalaxManager(this);
    this.ui = new InterfaceManager(this);
    this.fx = new FxManager(this);

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
    this.ui.addText({
      text: 'press to start...',
      font: 'normal 42px Milton Grotesque',
      color: 0xfffd4d,
      x: this.game.w/2,
      y: 700,
      click: () => this.game.scenes.toScene('playground', 0xFFFFFF)
    });
    this.ui.addButton({
      image: 'settings.png',
      x: this.game.w-110,
      y: 110,
      scale: 1.5,
      tint: 0x86ff4a,
      click: () => this.game.scenes.toScene('settings', 0xFFFFFF)
    });
  }
}

module.exports = Menu;
