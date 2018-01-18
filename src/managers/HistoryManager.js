const history = require('../content/history');

class HistoryManager extends PIXI.Container {
  constructor(scene) {
    super();
    scene.addChild(this);

    this.game = game;
    this.scene = scene;

    this.history = history;
    this.alpha = 0;

    // this.image = new PIXI.Sprite();
    // this.image.anchor.set(.5, 0);
    // this.image.x = this.game.w/2;
    // this.image.y = 75;
    // this.image.scale.set(.5);
    // this.addChild(this.image);

    this.text = new PIXI.Text('Text', {
      font: 'normal 50px Opificio Bold',
      wordWrap: true,
      wordWrapWidth: this.game.w*3/4,
      fill: '#ff408c',
      padding: 10,
      align: 'center'
    });
    this.text.anchor.set(.5, 0);
    this.text.x = this.game.w/2;
    this.text.y = 100;
    this.addChild(this.text);
  }
  show(id) {
    this.currentHistory = this.history[id];
    console.log(this.game.settings.lang);
    this.text.setText(this.currentHistory.text[this.game.settings.lang]);

    let show = PIXI.tweenManager.createTween(this);
    show.from({alpha: 0}).to({alpha: 1});
    show.time = 1000;
    show.start();
    this.emit('showen');

    setTimeout(() => this._hide(), this.currentHistory.time);
  }
  _hide() {
    let hide = PIXI.tweenManager.createTween(this);
    hide.from({alpha: 1}).to({alpha: 0});
    hide.time = 1000;
    hide.start();
    this.emit('hidden');
  }
}

module.exports = HistoryManager;
