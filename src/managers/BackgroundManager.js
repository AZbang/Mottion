class BackgroundManager extends PIXI.Container {
  constructor(scene) {
    super();
    scene.addChild(this);

    this.game = game;
    this.scene = scene.game;

    this.game.ticker.add(() => this.update());
  }
  update() {

  }
}

module.exports = BackgroundManager;
