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
    this.anchor.set(.5);
    this.alpha = 0;
    this.x = this.game.w/2;
    this.y = 320;

    this.filters = [new PIXI.filters.AdvancedBloomFilter({quality: 10})];
    this.filterArea = new PIXI.Rectangle(0, 0, this.game.w, this.game.h);
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
    this.alpha = 1;
    this.text = text;
    let activating = this.scene.tweenManager.createTween(this.scale)
      .from({x: .7, y: .7})
      .to({x: 1, y: 1});
    activating.time = 500;
    activating.easing = PIXI.tween.Easing.outBounce();

    let glow = this.scene.tweenManager.createTween(this.filters[0])
      .from({blur: 8})
      .to({blur: 0.0001});
    glow.time = 800;

    glow.start();
    activating.start();

    this.scene.setTimeout(() => {
      let hide = this.scene.tweenManager.createTween(this);
      hide.from({alpha: 1}).to({alpha: 0});
      hide.time = 1000;
      hide.start();
      hide.on('end', cb);
    }, text.length*60);
  }
}

module.exports = HistoryManager;
