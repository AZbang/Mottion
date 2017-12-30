class Menu extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.label = new PIXI.Text('Mottion', {
      font: 'normal 160px Opificio Bold',
      fill: '#fff',
      align: 'center'
    });
    this.label.anchor.set(.5);
    this.label.y = 200;
    this.label.x = this.game.w/2;
    this.addChild(this.label);

    this.citaty = new PIXI.Text('Sens in the way', {
      font: 'normal 60px Opificio Bold',
      fill: '#fff',
      align: 'center'
    });
    this.citaty.anchor.set(.5);
    this.citaty.y = 300;
    this.citaty.x = this.game.w/2;
    this.addChild(this.citaty);

    this.interactive = true;
    this.hitArea = new PIXI.Rectangle(0, 0, this.game.w, this.game.h);
    this.on('pointerdown', () => this.toPlayground());
  }
  toPlayground() {
    let tween = PIXI.tweenManager.createTween(this);
    tween.from({y: this.y}).to({y: -500});
    tween.time = 600;
    tween.start();
    tween.on('end', () => this.game.scenes.enableScene('playground'));
  }
}

module.exports = Menu;
