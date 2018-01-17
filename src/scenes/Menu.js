const BackgroundManager = require('../managers/BackgroundManager');

class Menu extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.background = new BackgroundManager(this);

    this.addLabel('Mottion');
    this.addCitaty('He played with his dreams, and dreams played to them.');
    this.addButton('settings.png', this.game.w-100, this.game.h-100, () => this.game.scenes.toScene('settings', 0xF9E4FF));

    this._setFilters();
  }
  _setFilters() {
    this.game.noiseBlur.blurRadius = 0.0005;
  }
  addLabel(txt) {
    this.label = new PIXI.Text(txt, {
      font: 'normal 200px Opificio Bold',
      fill: '#5774f6',
      align: 'center'
    });
    this.label.anchor.set(.5);
    this.label.y = 330;
    this.label.x = this.game.w/2;
    this.label.interactive = true;
    this.label.on('pointerdown', () => this.game.scenes.toScene('playground', 0xF9E4FF));
    this.addChild(this.label);
  }
  addCitaty(txt) {
    this.citaty = new PIXI.Text(txt, {
      font: 'normal 60px Opificio Bold',
      fill: '#5774f6',
      wordWrap: true,
      wordWrapWidth: this.game.w/2,
      align: 'center'
    });
    this.citaty.anchor.set(.5);
    this.citaty.y = 500;
    this.citaty.x = this.game.w/2;
    this.citaty.interactive = true;
    this.citaty.on('pointerdown', () => this.game.scenes.toScene('playground', 0xF9E4FF));
    this.addChild(this.citaty);
  }
  addButton(id, x, y, click) {
    let btn = new PIXI.Sprite.fromImage(id);
    this.addChild(btn);

    btn.x = x;
    btn.y = y;
    btn.anchor.set(.5);
    btn.interactive = true;
    btn.on('pointerdown', () => click && click());
  }
}

module.exports = Menu;
