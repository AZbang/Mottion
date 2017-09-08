const Entity = require('./Entity');

class Player extends Entity {
  constructor(state) {
    super(state, state.game.width/2, state.game.height-400, 70, true);

    this.state.physics.arcade.enable(this);
    this.body.setSize(this.width/2-1, this.height/2-1, 1, 1);

    this.state.camera.follow(this);
		this.state.camera.deadzone = new Phaser.Rectangle(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    this.speed = 340;
    this.lastMove;

    this.state.input.onDown.addOnce(() => {
      this.state.add.tween(this)
        .to({y: this.state.game.height-(this.state.cellsManager.sizeCell*5+this.state.cellsManager.sizeCell/2)}, 2000)
        .start();
    }, this);


    setInterval(() => this.move(), this.speed);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.state.cellsManager, (pl, cell) => {
      this.state.addScore(cell.score);

      if(cell.topPanel && cell.topPanel.isOpen && cell.topPanel.isGood) {
        this.state.add.tween(this)
          .to({y: cell.topPanel.y+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'top';
      }
      else if(this.lastMove !== 'left' && cell.rightPanel && cell.rightPanel.isOpen && cell.rightPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.rightPanel.x+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'right';
      }
      else if(this.lastMove !== 'right' && cell.leftPanel && cell.leftPanel.isOpen && cell.leftPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.leftPanel.x+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'left';
      }
      else {
        let tween = this.state.add.tween(this)
          .to({y: cell.topPanel.y+cell.width/2, alpha: 0, width: 0, height: 0}, this.speed)
          .start();
        tween.onComplete.add(() => this.state.state.start('Menu'));
      }
    });
  }
  update() {
    this.rotation += .01;
  }
}

module.exports = Player;
