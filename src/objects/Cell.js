class Cell {
  constructor(manager, x, y) {
    this.manager = manager;
    this.state = manager.state;

    this.size = this.state.game.width/5;
    this.x = x*this.size;
    this.y = -y*this.size;

    this.cell = this.state.add.sprite(this.x, this.y, 'cell');
    this.cell.width = this.size;
    this.cell.height = this.size;
    this.cell.tint = Math.random() < 0.3 ? 0x000000 : 0xFFFFFF;
    this.cell.tint = Math.random() < 0.1 ? 0xc95c26 : this.cell.tint;

    this.cell.inputEnabled = true;
    this.cell.events.onInputUp.add(() => {
      this.cell.tint = 0xCCCCCC;
    });
  }
  update(dt) {
    this.cell.y += 6;
  }
}

module.exports = Cell;
