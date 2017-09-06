class Cell extends Phaser.Sprite {
  constructor(manager, type, x, y) {
    super(manager.game, 0, 0, type === 1 ? 'cell' : 'cell2');

    this.manager = manager;
    this.state = manager.state;

    this.size = this.state.game.width/5;
    this.x = x*this.size;
    this.y = this.state.game.height-(6*this.size)-y*this.size;
    this.width = this.size;
    this.height = this.size;

    this.isOpen = false;
    this.type = type;

    this.cellOpen = this.state.add.sprite(this.x+this.size/2, this.y+this.size/2, 'cell-open');
    this.cellOpen.width = 0;
    this.cellOpen.height = 0;
    this.cellOpen.alpha = 0;
    this.cellOpen.anchor.set(.5);

    if(this.type === 1) {
      this.inputEnabled = true;

      this.events.onInputUp.addOnce(() => {
        this.isOpen = true;
        this.state.addScore();

        this.state.add.tween(this.cellOpen)
    			.to({alpha: 1, width: this.size, height: this.size}, 200)
    			.start();
      });
    }
  }
  // }
  // update(dt) {
  // }
}

module.exports = Cell;
