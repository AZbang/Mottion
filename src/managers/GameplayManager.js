class GameplayManager {
  constructor(scene) {
    this.game = game;
    this.scene = scene;

    this.map = scene.map;
    this.player = scene.player;
    this.history = scene.history;

    this.passedBlocks = 0;

    this.game.ticker.add(() => this.update());
    this._bindEvent();
  }
  _bindEvent() {
    this.history.on('hidden', () => this.hideHistory());
    this.player.on('deaded', () => this.restart());
    this.player.on('collidedBlock', (block) => this.checkCollide(block));
    this.player.on('actionTop', () => this.passedBlocks++);
    this.player.live();
  }

  // функция активации блока при удержании мышки на блоке
  activateBlock(pos) {
    for(let i = 0; i < this.map.children.length; i++) {
      let block = this.map.children[i];
      if(block.containsPoint({x: pos.x*this.game.scale, y: pos.y*this.game.scale})) return block.hit();
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
    if(block.checkpoint) this.passedBlocks = 0;
  }
  // Если блок имеет свойство historyID, то показать фрагмент сюжета с таким идентификатором. (content/history.json)
  showHistory(block) {
    if(block.historyID) {
      this.history.show(block.historyID);
      this.map.showTime = this.history.currentHistory.time;
      block.historyID = null;
    }
  }
  hideHistory() {
    this.player.startMove();
    this.map.showTime = 500;
  }

  // При проигрыше отправлять карту к последнему чекпоинту
  restart() {
    this.game.splash.show(0xEEEEEE, 100, 100, () => {
      this.map.scrollTop(this.passedBlocks+1, () => {
        this.player.live();
      })
    });
  }

  // Обновляем проверку на активацию блока
  update() {
    this.activateBlock(this.game.mouse.getPos());
  }
}

module.exports = GameplayManager;
