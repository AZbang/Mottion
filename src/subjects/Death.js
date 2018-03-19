class Death extends PIXI.Sprite {
  constructor(scene) {
    super(PIXI.Texture.fromImage('eyes.png'));
    this.game = scene.game;
    this.scene = scene;
    this.scene.addChild(this);

    this.alpha = 0;
    this.anchor.set(.5);
    this.x = this.game.w/2;
    this.y = 300;
  }
  show() {
    let show = this.scene.tweenManager.createTween(this);
    show.time = 1000;
    show.from({alpha: 0});
    show.to({alpha: 1});
    show.start();
  }
  hide() {
    let hide = this.scene.tweenManager.createTween(this);
    hide.time = 1000;
    hide.from({alpha: 1});
    hide.to({alpha: 0});
    hide.start();
  }
  update() {
    this.alpha = Math.random()*100 > 5;
  }
}

module.exports = Death;
