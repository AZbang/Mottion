class SplashManager extends PIXI.Graphics {
  constructor(game) {
    super();
    this.game = game;

    this.alpha = 0;
  }
  show(color = 0xFFFFFF, time = 1000, cb) {
    this.beginFill(color);
    this.drawRect(0, 0, this.game.w, this.game.h);

    let hide = PIXI.tweenManager.createTween(this)
      .from({alpha: 1}).to({alpha: 0});
    hide.time = time;

    let show = PIXI.tweenManager.createTween(this)
      .from({alpha: 0}).to({alpha: 1});
    show.time = time;
    show.on('end', () => {
      cb && cb();
      hide.start();
    });
    show.start();
  }
}

module.exports = SplashManager;
