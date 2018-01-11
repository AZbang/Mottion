const BackgroundManager = require('../managers/BackgroundManager');

class Menu extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.background = new BackgroundManager(game, this);
    this.addChild(this.background);

    this._addLabel();
    this._addCitaty();

    this._setFilters();
    this._bindEvents();
  }
  _bindEvents() {
    this.interactive = true;
    this.on('pointerdown', () => this.toPlayground());
  }
  _setFilters() {
    this.game.noiseBlur.blurRadius = 0.0005;
    this.game.grayscale.r = 5.0;
    this.filters = [new PIXI.filters.AdvancedBloomFilter({
      bloomScale: .4,
      brightness: 0.5
    })];
  }
  _addLabel() {
    this.label = new PIXI.Text('Mottion', {
      font: 'normal 200px Opificio Bold',
      fill: '#5774f6',
      align: 'center'
    });
    this.label.anchor.set(.5);
    this.label.y = 330;
    this.label.x = this.game.w/2;
    this.addChild(this.label);
  }
  _addCitaty() {
    this.citaty = new PIXI.Text('He played with his dreams, and dreams played to them.', {
      font: 'normal 60px Opificio Bold',
      fill: '#5774f6',
      wordWrap: true,
      wordWrapWidth: this.game.w/2,
      align: 'center'
    });
    this.citaty.anchor.set(.5);
    this.citaty.y = 500;
    this.citaty.x = this.game.w/2;
    this.addChild(this.citaty);
  }
  toPlayground() {
    this.game.splash.show(0xF9E4FF, 1000, 1000, () => {
      this.game.scenes.enableScene('playground');
    });
  }
}

module.exports = Menu;
