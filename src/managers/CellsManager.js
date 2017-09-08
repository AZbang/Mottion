const Cell = require('../objects/Cell');
const types = require('../objects/types');

class CellsManager extends Phaser.Group {
  constructor(state) {
    super(state.game);

    this.enableBody = true;

    this.sizeCell = state.game.width/5;

    this.state = state;
    this.createCells();
  }
  createCells() {
    types.sort((a, b) => a.chance - b.chance);

    for(let y = 0; y < 100; y++) {
      for(let x = 0; x < 5; x++) {
        let rand = Math.random()*100;
        for(let i = 0; i < types.length; i++) {
           if(rand < types[i].chance) {
             this.add(new Cell(this, types[i], x, y));
             break;
           }
        }
      }
    }
    for(let y = 0; y < 100; y++) {
      for(let x = 0; x < 5; x++) {
        if(y+1 < 100) this.children[y*5+x].topPanel = this.children[(y+1)*5+x];
        if(x-1 >= 0) this.children[y*5+x].leftPanel = this.children[y*5+x-1];
        if(x+1 < 5) this.children[y*5+x].rightPanel = this.children[y*5+x+1];
      }
    }
  }
  update(dt) {

  }
}

module.exports = CellsManager;
