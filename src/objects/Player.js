const Entity = require('./Entity');
const ui = require('../mixins/ui');

class Player extends Entity {
  constructor(level) {
    super(level.state, level.state.game.width/2, level.state.game.height-400, 70, true);
    level.state.add.existing(this);

    this.level = level;
    this.state = level.state;

    this.state.physics.arcade.enable(this);
    this.body.setSize(this.width/2-1, this.height/2-1, 1, 1);

    this.state.camera.follow(this);
		this.state.camera.deadzone = new Phaser.Rectangle(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    this.speed = 100;
    this.currentTime = 0;
    this.lastMove;

    this.state.input.onDown.addOnce(() => {
      let tween = this.state.add.tween(this)
        .to({y: this.level.island.y+this.level.sizeCell}, this.speed*10)
        .start();
    }, this);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.level.cells, (pl, cell) => {
      if(!cell.topPanel) return;

      if(cell.isOpen) this.state.UIManager.addScore(cell.score);

      if(cell.topPanel && cell.topPanel.isOpen && cell.topPanel.isGood) {
        this.state.add.tween(this)
          .to({y: cell.topPanel.y}, Math.floor(this.speed)*2)
          .start();
        this.lastMove = 'top';
      }
      else if(this.lastMove !== 'left' && cell.rightPanel && cell.rightPanel.isOpen && cell.rightPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.rightPanel.x}, Math.floor(this.speed)*2)
          .start();
        this.lastMove = 'right';
      }
      else if(this.lastMove !== 'right' && cell.leftPanel && cell.leftPanel.isOpen && cell.leftPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.leftPanel.x}, Math.floor(this.speed)*2)
          .start();
        this.lastMove = 'left';
      }
      else {
        let tween = this.state.add.tween(this)
          .to({y: cell.topPanel.y, alpha: 0, width: 0, height: 0}, Math.floor(this.speed)*2)
          .start();
        tween.onComplete.add(() => {
          ui.goTo(this.state, 'Menu',  this.state.UIManager.score);
        });
      }
    });
  }
  update() {
    this.rotation += .01;
    this.currentTime++;

    if(this.currentTime > this.speed) {
      this.move();
      this.currentTime = 0;
      if(this.speed > 200) this.speed -= .1;
    }
  }
}

module.exports = Player;
