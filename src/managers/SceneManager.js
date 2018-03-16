class SceneManager extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.timerManager = new PIXI.timer.TimerManager();
    this.tweenManager = new PIXI.tween.TweenManager();
    this.game.ticker.add((dt) => this._update(dt));
  }
  setTimeout(end, time) {
    let timer = PIXI.timerManager.createTimer(time);
    timer.on('end', () => end());
    timer.start();
  }
  _update() {
    this.timerManager.update();
    this.tweenManager.update();
    this.update && this.update();
  }
}

module.exports = SceneManager;
