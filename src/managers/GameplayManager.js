const types = require('../content/types');

class GameplayManager {
  constructor(scene) {
    this.game = scene.game || scene;
    this.scene = scene;

    this.map = scene.map;
    this.player = scene.player;
    this.history = scene.history;

    this.game.ticker.add(() => this.update());
    this._bindEvent();
  }
  _bindEvent() {
    this.map.on('scrolled', () => this.player.updateMoving());
    this.history.on('hidden', () => this.hideHistory());
    this.player.on('deaded', () => this.restart());
    this.player.on('collidedBlock', (block) => this.checkCollide(block));

    this.map.generateMap();
    this.map.scrollDown(1);
  }

  // функция активации блока при удержании мышки на блоке
  activateTiles(pos) {
    for(let i = 0; i < this.map.children.length; i++) {
      let tile = this.map.children[i];
      if(tile.containsPoint({x: pos.x*this.game.resolution, y: pos.y*this.game.resolution})) tile.hit();
      else tile.unhit();
    }
  }

  // Проверяем коллизию блока на различные триггеры
  checkCollide(block) {
    this.scene.score += +block.score;
    this.setBlockType(block);
    this.showHistory(block);
    this.saveCheckpoint(block);
  }
  setBlockType(block) {
    if(this.scene.activateType !== block.type) this.scene.fx.blinkVignette();
    if(block.isNewActivationType) this.scene.activateType = block.type;
    this.scene.fx.vignette.tint = block.tint;
    this.scene.paralax.tint = block.tint;
  }
  // Проверить на чекпоинт
  saveCheckpoint(block) {
    if(block.checkpoint) {
      this.game.store.saveGameplay({
        checkpoint: block.index,
        score: this.scene.score,
        activateType: this.scene.activateType
      });
      this.scene.fx.blinkVignette();
    }
  }
  // Если блок имеет свойство historyID, то показать фрагмент сюжета с таким идентификатором. (content/history.json)
  showHistory(block) {
    if(block.scriptID) {
      this.game.scripts.run(block.scriptID);
      this.scene.immunity.removeAll();
      this.scene.isRestarted = false;
    }
  }
  hideHistory() {
    this.map.showHiddenBlocks();
    setTimeout(() => this.player.startMove(), 500);
  }
  // При проигрыше отправлять карту к последнему чекпоинту
  restart() {
    this.game.scenes.restartScene();
  }
  // Обновляем проверку на активацию блока
  update() {
    this.activateTiles(this.game.mouse.position);
  }
}

module.exports = GameplayManager;
