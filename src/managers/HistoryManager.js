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
  show(history, i=0) {
    this.emit('showen');
    let text = history[this.game.settings.lang][i];
    if(this.scene.isRestarted || !text) return this.emit('hidden');

    this.setLangStyle();
    this.alpha = 1;

    this._show(text.toUpperCase(), () => {
      this.show(history, i+1);
    });
  }
  _show(text, cb) {
    let data = {i: 0};
    let len = text.length;
    let per = 60;
    let show = PIXI.tweenManager.createTween(data);
    this.game.audio.play('typing_sound');

    show.from({i: 0}).to({i: len});
    show.time = len*per/2;
    show.on('update', () => {
      this.text = text.slice(0, data.i) + '_';
    });
    show.start();
    show.on('end', () => this.game.audio.stop('typing_sound'));

    setTimeout(() => {
      let hide = PIXI.tweenManager.createTween(this);
      hide.from({alpha: 1}).to({alpha: 0});
      hide.time = 1000;
      hide.start();
      hide.on('end', cb);
    }, len*per);
  }
}

module.exports = HistoryManager;
