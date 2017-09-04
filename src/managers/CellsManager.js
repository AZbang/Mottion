const Cell = require('../objects/Cell');

class CellsManager {
  constructor(state) {
    this.state = state;
    this.cells = [];

    this.graph = this.state.add.graphics();
    this.createCells();
  }
  createCells() {
    let length = this.cells.length;

    for(let y = length; y < length+100; y++) {
      this.cells.push([]);
      for(let x = 0; x < 5; x++) {
        this.cells[y][x] = new Cell(this, x, y);
      }
    }
  }
  update(dt) {
    this.graph.clear();

    for(let y = 0; y < this.cells.length; y++) {
      for(let x = 0; x < this.cells[y].length; x++) {
        this.cells[y][x].update(dt);
      }
    }
  }
}

module.exports = CellsManager;
