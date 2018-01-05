class HistoryManager extends PIXI.Container {
  constructor(scene, history) {
    super();

    this.game = scene.game;
    this.scene = scene;

    this.history = history;
    this.alpha = 0;

    this.displacementSprite = new PIXI.Sprite(PIXI.Texture.fromImage('displacement'));
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.addChild(this.displacementSprite);
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

    // this.image = new PIXI.Sprite();
    // this.image.anchor.set(.5, 0);
    // this.image.x = this.game.w/2;
    // this.image.y = 75;
    // this.image.scale.set(.5);
    // this.image.filters = [this.displacementFilter];
    // this.addChild(this.image);

    this.text = new PIXI.Text('Text', {
      font: 'normal 50px Opificio Bold',
      wordWrap: true,
      wordWrapWidth: this.game.w*3/4,
      fill: '#fff',
      padding: 10,
      align: 'center'
    });
    this.text.anchor.set(.5, 0);
    this.text.x = this.game.w/2;
    this.text.y = 100;
    this.addChild(this.text);
  }
  show(id) {
    let data = this.history[id];

    // this.image.texture = PIXI.Texture.fromImage(data.image);
    this.text.setText(data.text[this.game.lang]);

    let show = PIXI.tweenManager.createTween(this);
    show.from({alpha: 0}).to({alpha: 1});
    show.time = 1000;
    show.start();
    this.emit('showen');

    setTimeout(() => this._hide(), data.time);
  }
  _hide() {
    let hide = PIXI.tweenManager.createTween(this);
    hide.from({alpha: 1}).to({alpha: 0});
    hide.time = 1000;
    hide.start();
    this.emit('hidden');
  }
  update() {
    this.displacementSprite.x += .5;
    this.displacementSprite.y += .5;
  }
}

module.exports = HistoryManager;
