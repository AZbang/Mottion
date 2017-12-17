const scenes = require('../scenes');

class ScenesManager extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.scenes = {};
    this.activeScene = null;
    this.addScenes(scenes);
  }
  addScenes(scenes) {
    for(let id in scenes) {
      this.addScene(id, scenes[id]);
    }
  }
  addScene(id, scene) {
    this.scenes[id] = scene;
  }
  getScene(id) {
    return this.scenes[id];
  }
  resetScene() {
    this.setScene(this.activeScene._idScene);
  }
  setScene(id) {
    this.removeChild(this.activeScene);

    let Scene = this.getScene(id);
    this.activeScene = this.addChild(new Scene(this.game, this));
    this.activeScene._idScene = id;
    return this.activeScene;
  }
  update(dt) {
    this.activeScene && this.activeScene.update(dt);
  }
}

module.exports = ScenesManager;
