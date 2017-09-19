const types = require('./types');

class Cell extends Phaser.Sprite {
  constructor(manager, type, x, y) {
    super(manager.game, 0, 0, type.img);

    this.manager = manager;
    this.state = manager.state;

    this.padding = 10;
    this.size = this.manager.sizeCell;
    this.width = this.size-this.padding;
    this.height = this.size-this.padding;
    this.anchor.set(.5);

    this.reUseCell(x, y, type);
  }
  reUseCell(x, y, type) {
    this.loadTexture(type.img, 0);

    this.x = x*this.size+this.padding/2+this.width/2;
    this.y = 80*this.manager.amtX-y*this.size+this.height/2;
    this.isOpen = type.isOpen;
    this.isGood = type.isGood;
    this.score = type.score;
    this.inputEnabled = false;

    if(type.isClick) {
      this.inputEnabled = true;
      this.clickCount = type.clickCount;

      this.events.onInputUp.add(() => {
        this.clickCount--;
        this.width = this.size-this.padding;
        this.height = this.size-this.padding;

        this.state.add.tween(this)
          .to({width: this.width+30, height: this.height+30}, 100)
          .to({width: this.width, height: this.height}, 100)
          .start();

        if(this.clickCount === 0) {
          this.loadTexture(type.imgClick, 0);
          this.isOpen = true;
        }
      });
    }
  }
}

module.exports = Cell;
