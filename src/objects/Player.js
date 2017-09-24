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

    this.speed = 1000;
    this.lastMove;

    this.timer = this.state.time.create(false);
    this.timer.loop(this.speed, this.move, this);
    this.timer.start();

    this.state.add.tween(this)
      .to({y: this.y-150}, this.speed)
      .start();
    this.state.input.onDown.addOnce(this.moveNextIsland, this);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.level.cells, (pl, cell) => {
      if(!cell.topPanel) return this.moveNextIsland();
      if(cell.isOpen) this.state.UIManager.addScore(cell.score);

      if(cell.topPanel && cell.topPanel.isOpen && cell.topPanel.isGood) this.moveUp(cell);
      else if(this.lastMove !== 'left' && cell.rightPanel && cell.rightPanel.isOpen && cell.rightPanel.isGood) this.moveRight(cell);
      else if(this.lastMove !== 'right' && cell.leftPanel && cell.leftPanel.isOpen && cell.leftPanel.isGood) this.moveLeft(cell);
      else this.dead(cell);
    });
  }
  moveNextIsland() {
    this.state.add.tween(this)
      .to({y: this.level.island.y-this.level.sizeCell/2}, this.speed*3)
      .start();
  }
  moveUp(cell) {
    this.state.add.tween(this)
      .to({y: cell.topPanel.y}, this.speed)
      .start();
    this.lastMove = 'top';
  }
  moveLeft(cell) {
    this.state.add.tween(this)
      .to({x: cell.leftPanel.x}, this.speed)
      .start();
    this.lastMove = 'left';
  }
  moveRight(cell) {
    this.state.add.tween(this)
      .to({x: cell.rightPanel.x}, this.speed)
      .start();
    this.lastMove = 'right';
  }
  dead(cell) {
    let tween = this.state.add.tween(this)
      .to({y: cell.topPanel.y, alpha: 0, width: 0, height: 0}, this.speed)
      .start();
    tween.onComplete.add(() => {
      ui.goTo(this.state, 'Menu',  this.state.UIManager.score);
    });
  }
  update() {
    this.rotation += .01;
  }
}

module.exports = Player;
