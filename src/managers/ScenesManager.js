/*
  Класс для переключения видимого контейнера (рабочих сцен)
  События:
    addedScenes => scenes
    addedScene => scenes
    removedScene => scene
    restartedScene => scene
    disabledScene => scene
    enabledScene => scenes
*/

class ScenesManager extends PIXI.Container {
  constructor(game, scene) {
    super();
    
    this.game = game;
    this.scene = scene;

    this.scenes = require('../scenes');
    this.activeScene = null;
  }
  getScene(id) {
    return this.scenes[id];
  }

  // adding scenes
  addScenes(scenes) {
    for(let id in scenes) {
      this.addScene(id, scenes[id]);
    }
    this.emit('addedScenes', scenes);
  }
  addScene(id, scene) {
    this.scenes[id] = scene;
    this.emit('addedScene', scene);
  }
  removeScene(id) {
    let _scene = this.scenes[id];
    this.scenes[id] = null;
    this.emit('removedScene', _scene);
  }

  // Controls
  restartScene() {
    this.enableScene(this.activeScene._idScene);
    this.emit('restartedScene', this.activeScene);
  }
  disableScene() {
    let scene = this.removeChild(this.activeScene);
    this.activeScene = null;
    this.emit('disabledScene', scene);
  }
  enableScene(id) {
    this.activeScene && this.disableScene();

    let Scene = this.getScene(id);
    this.activeScene = this.addChild(new Scene(this.game, this));
    this.activeScene._idScene = id;

    this.emit('enabledScene', this.activeScene);
  }
}

module.exports = ScenesManager;
