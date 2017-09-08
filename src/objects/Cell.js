const types = require('./types');

class Cell extends Phaser.Sprite {
  constructor(manager, type, x, y) {
    super(manager.game, 0, 0, type.img);

    this.manager = manager;
    this.state = manager.state;

    this.size = this.state.game.width/5;
    this.padding = 10;
    this.x = x*this.size+this.padding/2;
    this.y = this.state.game.height-(6*this.size)-y*this.size+this.padding/2;
    this.width = this.size-this.padding;
    this.height = this.size-this.padding;

    this.isOpen = type.isOpen;
    this.isGood = type.isGood;
    this.score = type.score;

    if(type.isClick) {
      this.cellOpen = this.state.add.sprite(this.x+this.size/2-this.padding/2, this.y+this.size/2-this.padding/2, type.imgClick);
      this.cellOpen.width = 0;
      this.cellOpen.height = 0;
      this.cellOpen.alpha = 0;
      this.cellOpen.anchor.set(.5);

      this.inputEnabled = true;
      this.events.onInputUp.addOnce(() => {
        this.isOpen = true;

        this.state.add.tween(this.cellOpen)
    			.to({alpha: 1, width: this.size-this.padding, height: this.size-this.padding}, 200)
    			.start();
      });
    }
  }
  // }
  // update(dt) {
  // }
}

module.exports = Cell;
