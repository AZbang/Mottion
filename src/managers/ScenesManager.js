const scenes = require('../scenes');

class ScenesManager extends PIXI.Container {
  constructor(game) {
    super();
    this.addScenes(scenes);
  }
  addScenes(scenes) {
    for(let id in scenes) {
      this.addScene(scenes[id], id);
    }
  }
  addScene(SceneClass, id) {
    let scene = new SceneClass(this);
    scene._id = id;
    return this.addChild(scene);
  }
  getScene(id) {
    return this.children.find((scene) => scene._id === id);
  }
  toggleScene(id) {
    if(this.activeScene) this.activeScene.visible = false;
    this.activeScene = this.getScene(id);
    this.activeScene.visible = true;

    return this.activeScene;
  }
  update(dt) {
    for(let i = 0; i < this.children.length; i++) {
      this.children[i].update(dt);
    }
  }
}

module.exports = ScenesManager;
