class GameplayManager {
  constructor(scene) {
    this.game = scene.game || scene;
    this.scene = scene;

    this.map = scene.map;
    this.player = scene.player;
    this.history = scene.history;

    this.immunityType = 'white';

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
      if(block.type !== this.immunityType) return;
      if(block.containsPoint({x: pos.x*this.game.resolution, y: pos.y*this.game.resolution})) return block.hit();
      else block.unhit();
    }
  }

  // Проверяем коллизию блока на различные триггеры
  checkCollide(block) {
    this.showHistory(block);
    this.saveCheckpoint(block);
  }

  // Проверить на чекпоинт
  saveCheckpoint(block) {
    if(block.checkpoint) this.game.store.saveGameplay({
      checkpoint: block.index,
      score: this.scene.score
    });
  }
  // Если блок имеет свойство historyID, то показать фрагмент сюжета с таким идентификатором. (content/history.json)
  showHistory(block) {
    if(block.historyID) {
      this.history.show(block.historyID);
      block.historyID = null;
    }
  }
  hideHistory() {
    this.player.startMove();
    this.map.showTime = 500;
  }

  // При проигрыше отправлять карту к последнему чекпоинту
  restart() {
    this.game.scenes.toScene('playground');
  }

  // Обновляем проверку на активацию блока
  update() {
    this.activateBlock(this.game.mouse.position);
  }
}

module.exports = GameplayManager;
