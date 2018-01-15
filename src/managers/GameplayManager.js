class GameplayManager {
  constructor(scene) {
    this.game = game;
    this.scene = scene;

    this.map = scene.map;
    this.player = scene.player;
    this.history = scene.history;

    this.checkpointBlock = null;

    this.game.ticker.add(() => this.update());
    this._bindEvent();
  }
  _bindEvent() {
    this.history.on('hidden', () => this.player.startMove());
    this.player.on('deaded', () => this.restart());
    this.player.on('collidedBlock', (block) => this.checkCollide(block));
    this.player.top();
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
    this.checkHistory(block);
    this.checkCheckpoint(block);
  }
  // Если блок имеет свойство historyID, то показать фрагмент сюжета с таким идентификатором. (content/history.json)
  checkHistory(block) {
    if(block.historyID) {
      this.history.show(block.historyID);
      block.historyID = null;
    }
  }
  // Проверить на чекпоинт
  checkCheckpoint(block) {
    if(block.checkpoint) this.checkpointBlock = block;
  }

  // При проигрыше отправлять карту к последнему чекпоинту
  restart() {
    this.game.splash.show(0xEEEEEE, 500, 500, () => {
      this.game.map.moveTo(this.checkpointBlock, 500, () => {
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
