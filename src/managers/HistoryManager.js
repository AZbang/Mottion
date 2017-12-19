class HistoryManager extends PIXI.Container {
  constructor(scene) {
    super();
    scene.addChild(this);

    this.scene = scene;
  }
}

module.exports = HistoryManager;
