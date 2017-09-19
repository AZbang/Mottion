const Entity = require('./Entity');
const ui = require('../mixins/ui');

class Player extends Entity {
  constructor(state) {
    super(state, state.game.width/2, state.game.height-400, 70, true);
    state.add.existing(this);

    this.state.physics.arcade.enable(this);
    this.body.setSize(this.width/2-1, this.height/2-1, 1, 1);

    this.state.camera.follow(this);
		this.state.camera.deadzone = new Phaser.Rectangle(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    this.speed = 400;
    this.lastMove;

    this.timer = this.state.time.create(false);
    this.timer.loop(this.speed, this.move, this);

    this.state.input.onDown.addOnce(() => {
      let tween = this.state.add.tween(this)
        .to({y: this.state.game.height-(this.state.cellsManager.sizeCell*this.state.cellsManager.amtX+this.state.cellsManager.sizeCell/2)}, this.speed*4)
        .start();
      tween.onComplete.add(() => {
        this.move();
        this.timer.start();
      });
    }, this);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.state.cellsManager, (pl, cell) => {
      if(!cell.topPanel) return;

      if(cell.isOpen) this.state.UIManager.addScore(cell.score);

      if(cell.topPanel && cell.topPanel.isOpen && cell.topPanel.isGood) {
        this.state.add.tween(this)
          .to({y: cell.topPanel.y}, this.speed)
          .start();
        this.lastMove = 'top';
      }
      else if(this.lastMove !== 'left' && cell.rightPanel && cell.rightPanel.isOpen && cell.rightPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.rightPanel.x}, this.speed)
          .start();
        this.lastMove = 'right';
      }
      else if(this.lastMove !== 'right' && cell.leftPanel && cell.leftPanel.isOpen && cell.leftPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.leftPanel.x}, this.speed)
          .start();
        this.lastMove = 'left';
      }
      else {
        let tween = this.state.add.tween(this)
          .to({y: cell.topPanel.y, alpha: 0, width: 0, height: 0}, this.speed)
          .start();
        tween.onComplete.add(() => {
          ui.goTo(this.state, 'Menu',  this.state.UIManager.score);
        });
      }
    });
  }
  update() {
    this.rotation += .01;
  }
}

module.exports = Player;
