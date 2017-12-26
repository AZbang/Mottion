class HistoryManager extends PIXI.Container {
  constructor(scene) {
    super();

    this.game = scene.game;
    this.scene = scene;

    this.alpha = 0;
    this.text = new PIXI.Text('Text', {
      font: 'normal 40px Amatic SC',
      wordWrap: true,
      wordWrapWidth: this.game.w/2,
      fill: '#2d5bff',
      padding: 10,
      align: 'center'
    });
    this.text.anchor.set(.5);
    this.text.x = this.game.w/2;
    this.text.y = 150;
    this.addChild(this.text);
  }
  showText(txt, time) {
    this.text.fontFamily = 'Amatic SC';
    this.text.setText(txt);

    let show = PIXI.tweenManager.createTween(this);
    show.from({alpha: 0}).to({alpha: 1});
    show.time = 1000;
    show.start();
    this.emit('showen');

    setTimeout(this.hideText.bind(this), time);
  }
  hideText() {
    let hide = PIXI.tweenManager.createTween(this);
    hide.from({alpha: 1}).to({alpha: 0});
    hide.time = 1000;
    hide.start();
    this.emit('hidden');
  }
}

module.exports = HistoryManager;
