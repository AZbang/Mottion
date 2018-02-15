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
  activateBlock(pos) {
    for(let i = 0; i < this.map.children.length; i++) {
      let block = this.map.children[i];
      if(block.type !== this.scene.activateType) continue;
      if(block.containsPoint({x: pos.x*this.game.resolution, y: pos.y*this.game.resolution})) return block.hit();
      else block.unhit();
    }
  }

  // Проверяем коллизию блока на различные триггеры
  checkCollide(block) {
    this.setBlockType(block);
    this.showHistory(block);
    this.saveCheckpoint(block);
  }
  setBlockType(block) {
    if(this.scene.activateType !== block.type) this.scene.fx.blinkVignette();
    this.scene.activateType = block.type;
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
    if(block.historyID) {
      if(!this.scene.isRestarted) {
        this.history.show(block.historyID);
        this.map.showDelay = this.history.currentHistory.time;
        this.scene.isRestarted = false;
        block.historyID = null;
      } else this.hideHistory();
    }
  }
  hideHistory() {
    this.map.showDelay = 500;
    setTimeout(() => this.player.startMove(), 500);
  }
  // При проигрыше отправлять карту к последнему чекпоинту
  restart() {
    this.game.scenes.restartScene();
  }
  // Обновляем проверку на активацию блока
  update() {
    this.activateBlock(this.game.mouse.position);
  }
}

module.exports = GameplayManager;
