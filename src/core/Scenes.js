/*
  Класс для переключения видимого контейнера (рабочих сцен)
  События:
    restartedScene => scene
    disabledScene => scene
    enabledScene => scenes
*/

class Scenes extends PIXI.Container {
  constructor(game) {
    super();
    game.addChild(this);

    this.game = game;

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
  }
  addScene(id, scene) {
    this.scenes[id] = scene;
  }
  removeScene(id) {
    let _scene = this.scenes[id];
    this.scenes[id] = null;
  }

  // Controls
  disableScene() {
    let scene = this.removeChild(this.activeScene);
    scene.destroy();
    this.activeScene = null;
    this.emit('disabledScene', scene);
  }
  enableScene(id, restart) {
    this.activeScene && this.disableScene();

    let Scene = this.getScene(id);
    this.activeScene = this.addChild(new Scene(this.game, restart));
    this.activeScene._idScene = id;

    this.emit('enabledScene', this.activeScene);
  }
  toScene(scene, color, show=500, hide=500) {
    this.game.splash.show(color, show, hide, () => {
      this.enableScene(scene);
    });
  }
  restartScene(color, show=500, hide=500) {
    this.game.splash.show(color, show, hide, () => {
      this.enableScene(this.activeScene._idScene, true);
    });
    this.emit('restartedScene', this.activeScene);
  }
}

module.exports = Scenes;
