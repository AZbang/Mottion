const Cell = require('../objects/Cell');
const types = require('../objects/types');
types.sort((a, b) => a.chance - b.chance);


class CellsManager extends Phaser.Group {
  constructor(state) {
    super(state.game);

    this.enableBody = true;

    this.sizeCell = state.game.width/5;
    this.lastY = 0;
    this.last = [];

    this.state = state;
    this.createCells(15);
  }
  createCells(amtGenY) {
    let arr = [];

    for(let y = this.lastY; y < this.lastY+amtGenY; y++) {
      for(let x = 0; x < 5; x++) {
        let rand = Math.random()*100;
        for(let i = 0; i < types.length; i++) {
           if(rand < types[i].chance) {
             let cell = new Cell(this, types[i], x, y);
             this.add(cell);
             arr.push(cell);
             break;
           }
        }
      }
    }
    for(let y = 0; y < amtGenY; y++) {
      for(let x = 0; x < 5; x++) {
        if(y+1 < amtGenY) arr[y*5+x].topPanel = arr[(y+1)*5+x];
        if(x-1 >= 0) arr[y*5+x].leftPanel = arr[y*5+x-1];
        if(x+1 < 5)  arr[y*5+x].rightPanel = arr[y*5+x+1];
      }
    }
    if(this.last.length) {
      for(let x = 0; x < 5; x++) {
        this.last[x].topPanel = arr[x];
      }
    }
    this.last[0] = arr[arr.length-5];
    this.last[1] = arr[arr.length-4];
    this.last[2] = arr[arr.length-3];
    this.last[3] = arr[arr.length-2];
    this.last[4] = arr[arr.length-1];
    this.lastY += amtGenY;
  }
  update(dt) {
    let isHide = false;
    this.forEach((cell) => {
      if(cell.y > this.state.player.y+this.state.game.height-400) {
        cell.leftPanel = null;
        cell.rightPanel = null;
        cell.topPanel = null;
        cell.destroy();
        !isHide && this.createCells(1);
        isHide = true;
      }
    });
  }
}

module.exports = CellsManager;
