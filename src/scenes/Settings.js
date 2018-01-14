const BackgroundManager = require('../managers/BackgroundManager');

class Settings extends PIXI.Container {
  constructor(game) {
    super();

    this.game = game;
    this.settings = game.settings;

    this.top = 30;
    this.inputPadding = 200;
    this.inputs = 0;

    this.background = new BackgroundManager(this.game, this);
    this.addChild(this.background);

    this.addInput('Filters', this.settings.filrers, () => this.settings.toggleFilters());
    this.addInput('Music', this.settings.music, () => this.settings.toggleMusic());
    this.addInput('Sounds', this.settings.sounds, () => this.settings.toggleSounds());

    this._setFilters();
  }
  _setFilters() {
    this.game.noiseBlur.blurRadius = 0.0005;
    this.game.grayscale.r = 5.0;
  }
  addInput(val, active, toggle) {
    this.inputs++;

    let txt = new PIXI.Text(val, {
      font: 'normal 200px Opificio Bold',
      fill: '#ff408c',
      align: 'center'
    });
    txt.anchor.set(0, .5);
    txt.x = 650;
    txt.y = this.top+this.inputs*this.inputPadding;
    this.addChild(txt);

    let check = PIXI.Sprite.fromImage('check.png');
    check.y = this.top+this.inputs*this.inputPadding;
    check.x = 550;
    check.active = active;
    check.anchor.set(.5);
    check.texture = PIXI.Texture.fromImage(check.active ? 'check_active.png' : 'check.png');
    this.addChild(check);

    check.interactive = true;
    check.on('pointerdown', () => {
      check.active != check.active;
      check.texture = PIXI.Texture.fromImage(check.active ? 'check_active.png' : 'check.png');
      toggle && toggle(check.active);
    });
  }
}

module.exports = Settings;
