const Cell = require('../objects/Cell');
const types = require('../objects/types');
types.sort((a, b) => a.chance - b.chance);


class CellsManager extends Phaser.Group {
  constructor(state, amtX, amtY) {
    super(state.game);

    this.enableBody = true;

    this.amtX = amtX || 5;

    this.sizeCell = state.game.width/this.amtX;
    this.lastY = 0;
    this.last = [];

    this.state = state;
    this.createCells(amtY || 15);
  }
  createCells(amtGenY) {
    let arr = [];

    for(let y = this.lastY; y < this.lastY+amtGenY; y++) {
      for(let x = 0; x < this.amtX; x++) {
        let rand = Math.random()*100;
        for(let i = 0; i < types.length; i++) {
           if(rand < types[i].chance) {
             let cell = this.getFirstDead();
             if(!cell) {
                cell = new Cell(this, types[i], x, y);
                this.add(cell);
             } else {
               cell.reUseCell(x, y, types[i]);
               cell.revive();
             }

             arr.push(cell);
             break;
           }
        }
      }
    }
    for(let y = 0; y < amtGenY; y++) {
      for(let x = 0; x < this.amtX; x++) {
        if(y+1 < amtGenY) arr[y*this.amtX+x].topPanel = arr[(y+1)*this.amtX+x];
        if(x-1 >= 0) arr[y*this.amtX+x].leftPanel = arr[y*this.amtX+x-1];
        if(x+1 < this.amtX)  arr[y*this.amtX+x].rightPanel = arr[y*this.amtX+x+1];
      }
    }
    if(this.last.length) {
      for(let x = 0; x < this.amtX; x++) {
        this.last[x].topPanel = arr[x];
      }
    }

    this.last = [];
    for(let i = arr.length-this.amtX; i < arr.length; i++) {
      this.last.push(arr[i]);
    }
    this.lastY += amtGenY;
  }
  update(dt) {
    let isHide = false;
    this.forEach((cell) => {
      if(cell.y > this.state.player.y+this.state.game.height-400) {
        cell.leftPanel = null;
        cell.rightPanel = null;
        cell.topPanel = null;
        cell.kill();
        !isHide && this.createCells(1);
        isHide = true;
      }
    });
  }
}

module.exports = CellsManager;
