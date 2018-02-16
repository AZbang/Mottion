class HistoryManager extends PIXI.Text {
  constructor(scene) {
    super();
    scene.addChild(this);
    this.game = game;
    this.scene = scene;

    this.style = {
      font: 'normal 50px Montserrat',
      wordWrap: true,
      weight: 'bold',
      wordWrapWidth: this.game.w*3/4,
      fill: '#fff',
      padding: 10,
      align: 'center'
    };
    this.anchor.set(.5, 0);
    this.alpha = 0;
    this.x = this.game.w/2;
    this.y = 150;
  }
  setLangStyle() {
    if(this.game.settings.lang == 'ru') {
      this.style.fontFamily = 'Montserrat';
      this.style.fontWeight = 'bold';
    } else this.style.fontFamily = 'Milton Grotesque';
  }
  show(history) {
    this.emit('showen');
    if(this.scene.isRestarted) return this.emit('hidden');

    this.lastHistory = history;
    this.setLangStyle();
    this.alpha = 1;

    const text = this.lastHistory.text[this.game.settings.lang].toUpperCase();
    let data = {i: 0};
    let show = PIXI.tweenManager.createTween(data);
    show.from({i: 0}).to({i: text.length});
    show.time = this.lastHistory.time/2;
    show.on('update', () => {
      this.text = text.slice(0, data.i) + '_';
    })
    show.start();
    setTimeout(() => this._hide(), this.lastHistory.time);
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
