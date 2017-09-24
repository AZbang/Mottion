const Cell = require('../objects/Cell');

class CellsManager extends Phaser.Group {
  constructor(level) {
    super(level.state.game);

    this.level = level;
    this.state = level.state;
    this.enableBody = true;


  }
  startGen(lvl) {
    this.lastY = 0;
    this.last = [];
    this.createCells(this.level.startCountCells);
  }
  createCells(amtGenY) {
    let arr = [];
    this.level.totalCells -= amtGenY;

    // генерируем ячейки
    for(let y = this.lastY; y < this.lastY+amtGenY; y++) {
      this.level.lastY -= this.level.sizeCell;

      for(let x = 0; x < this.level.amtX; x++) {
        // рандомно (с приоритетом) выбираем ячейку
        let rand = Math.random()*100;
        for(let i = 0; i < this.level.dataCells.length; i++) {
           if(rand < this.level.dataCells[i].chance) {
             // Оптимизация, не создаем новую ячейку,а переформировываем старые
             let cell = this.getFirstDead();
             if(!cell) {
                cell = new Cell(this, this.level.dataCells[i], x, y);
                this.add(cell);
             } else {
               cell.reUseCell(x, y, this.level.dataCells[i]);
               cell.revive();
             }

             arr.push(cell);
             break;
           }
        }
      }
    }

    // Костыль, который линкует соседей справа, слева, сверху
    for(let y = 0; y < amtGenY; y++) {
      for(let x = 0; x < this.level.amtX; x++) {
        if(y+1 < amtGenY) arr[y*this.level.amtX+x].topPanel = arr[(y+1)*this.level.amtX+x];
        if(x-1 >= 0) arr[y*this.level.amtX+x].leftPanel = arr[y*this.level.amtX+x-1];
        if(x+1 < this.level.amtX)  arr[y*this.level.amtX+x].rightPanel = arr[y*this.level.amtX+x+1];
      }
    }

    // Костыль, который линкует новый уровень ячеек со старым
    if(this.last.length) {
      for(let x = 0; x < this.level.amtX; x++) {
        this.last[x].topPanel = arr[x];
      }
    }
    this.last = [];
    for(let i = arr.length-this.level.amtX; i < arr.length; i++) {
      this.last.push(arr[i]);
    }

    this.lastY += amtGenY;
  }
  update(dt) {
    // если слой ячеек ушел из зоны видимости, то генерируем новый слой
    let isHide = false;
    this.forEach((cell) => {
      if(cell.y > this.level.player.y+this.state.game.height/2) {
        // помогаем сборщику мусора
        cell.leftPanel = null;
        cell.rightPanel = null;
        cell.topPanel = null;
        cell.kill();

        // Создаем новый слой, если количество ячеек на уровне не кончилось
        if(this.level.totalCells > 0) {
          !isHide && this.createCells(1);
          isHide = true;
        }
      }
    });
  }
}

module.exports = CellsManager;
