class SplashManager extends PIXI.Graphics {
  constructor(scene) {
    super();
    scene.addChild(this);

    this.game = scene.game;
    this.scene = scene;

    this.alpha = 0;
  }
  show(color=0xFFFFFF, showTime=1000, endTime=1000, showEvent, endEvent) {
    this.beginFill(color);
    this.drawRect(0, 0, this.game.w, this.game.h);

    let hide = PIXI.tweenManager.createTween(this)
      .from({alpha: 1}).to({alpha: 0});
    hide.on('end', () => endEvent && endEvent());
    hide.time = endTime;

    let show = PIXI.tweenManager.createTween(this)
      .from({alpha: 0}).to({alpha: 1});
    show.time = showTime;
    show.on('end', () => {
      showEvent && showEvent();
      hide.start();
    });
    show.start();
  }
}

module.exports = SplashManager;
