const CellsManager = require('../managers/CellsManager');
const WindowManager = require('../managers/WindowManager');
const Island = require('../objects/Island');
const Player = require('../objects/Player');


class LevelManager {
  constructor(state, levels, cells) {
    this.state = state;

    this.levels = levels;
    this.typesCells = cells;
    this.current = 0;

    this.lastY = this.state.game.height;
    this.lastX = 0;

    this.cells = new CellsManager(this);
    this.window = new WindowManager(this);

    this.createLevel(this.levels[this.current]);
    this.player = new Player(this);
  }
  createLevel(lvl) {
    this.amtX = lvl.amtCells || 2;
    this.totalCells = lvl.totalCells || 500;
    this.tint = lvl.tint;
    this.sizeCell = this.state.game.width/this.amtX;
    this.startCountCells = Math.floor(this.state.game.height/this.sizeCell)+2;

    // костыль, который сортирует данные о типах по шансу (по убыванию) и отсекает типы, которых нет на уровне.
    this.dataCells = this.typesCells.slice().sort((a, b) => a.chance - b.chance);

    this.createIsland(lvl);
    this.window.addWindow(lvl.text, () => this.createCells(lvl));
  }
  createIsland(lvl) {
    if(lvl.dir === 'top')
      this.lastY -= this.amtX*this.sizeCell;

    this.island = new Island(this, this.lastX, this.lastY, lvl);
  }
  createCells(lvl) {
    this.cells.startGen();
  }
  update() {
    if(this.totalCells <= 0) {
      if(this.current+1 < this.levels.length) this.current++;
      this.createLevel(this.levels[this.current]);
    }
    if(this.island.y > this.player.y+this.state.game.height/2)
      this.island.destroy();

    this.player.update();
    this.cells.update();
  }
}

module.exports = LevelManager;
