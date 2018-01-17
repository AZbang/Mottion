const BackgroundManager = require('../managers/BackgroundManager');

class Settings extends PIXI.Container {
  constructor(game) {
    super();

    this.game = game;
    this.settings = game.settings;

    this.top = 90;
    this.inputPadding = 130;
    this.inputs = 0;

    this.background = new BackgroundManager(this);

    // this.addCheckBoxInput('Filters', this.settings.filrers, () => this.settings.toggleFilters());
    this.addCheckBoxInput('Music', this.settings.music, () => this.settings.toggleMusic());
    this.addCheckBoxInput('Sounds', this.settings.sounds, () => this.settings.toggleSounds());
    this.addListInput('Lang: ', this.settings.LANGS, this.settings.langIndex, (i) => this.settings.setLang(i));
    this.addButton('close.png', this.game.w-100, 100, () => this.game.toScene('menu', 0xF9E4FF));

    this._setFilters();
  }
  _setFilters() {
    this.game.noiseBlur.blurRadius = 0.0005;
  }
  addListInput(val, list, current, set) {
    this.inputs++;

    let txt = new PIXI.Text(val + list[current], {
      font: 'normal 120px Opificio Bold',
      fill: '#ff408c',
      align: 'center'
    });
    txt.anchor.set(.5);
    txt.x = this.game.w/2;
    txt.y = this.top+this.inputs*this.inputPadding;
    this.addChild(txt);

    txt.interactive = true;
    txt.on('pointerdown', () => {
      if(current >= list.length-1) current = 0;
      else current++;

      txt.text = val + list[current];
      set && set(current);
    });
  }
  addCheckBoxInput(val, active, toggle) {
    this.inputs++;

    let txt = new PIXI.Text(val, {
      font: 'normal 100px Opificio Bold',
      fill: '#ff408c',
      align: 'center'
    });
    txt.anchor.set(0, .5);
    txt.x = 200+650;
    txt.y = this.top+this.inputs*this.inputPadding;
    this.addChild(txt);

    let check = PIXI.Sprite.fromImage('check.png');
    check.texture = PIXI.Texture.fromImage(active ? 'check_active.png' : 'check.png');
    check.y = this.top+this.inputs*this.inputPadding;
    check.x = 200+550;
    check.anchor.set(.5);
    this.addChild(check);

    check.interactive = true;
    check.on('pointerdown', () => {
      check.texture = PIXI.Texture.fromImage(!active ? 'check_active.png' : 'check.png');
      toggle && toggle(!active);
      active = !active;
    });
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

module.exports = Settings;
