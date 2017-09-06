class Player extends Phaser.Sprite {
  constructor(state) {
    super(state.cellsManager.game, 0, 0, 'player');
    state.add.existing(this);

    this.state = state;

    this.x = this.state.game.width/2;
    this.y = this.state.game.height-200;
    this.width = 70;
    this.height = 70;
    this.anchor.set(.5);


    this.state.physics.arcade.enable(this);
    this.state.camera.follow(this);
		this.state.camera.deadzone = new Phaser.Rectangle(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    this.body.setSize(50, 50, 1, 1);

    this.tweenBreathe = this.state.add.tween(this)
			.to({width: 100, height: 100}, 200)
      .to({width: 70, height: 70}, 200)
      .yoyo()
			.loop()
  		.start();

    this.speed = 340;
    this.lastMove;

    this.state.add.tween(this)
      .to({y: this.state.game.height-(this.state.cellsManager.sizeCell*5+this.state.cellsManager.sizeCell/2)}, 2000)
      .start();

    setInterval(() => this.move(), this.speed);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.state.cellsManager, (pl, cell) => {
      if(cell.topPanel && cell.topPanel.isOpen) {
        this.state.add.tween(this)
          .to({y: cell.topPanel.y+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'top';
      }
      else if(this.lastMove !== 'left' && cell.rightPanel && cell.rightPanel.isOpen) {
        this.state.add.tween(this)
          .to({x: cell.rightPanel.x+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'right';
      }
      else if(this.lastMove !== 'right' && cell.leftPanel && cell.leftPanel.isOpen) {
        this.state.add.tween(this)
          .to({x: cell.leftPanel.x+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'left';
      }
      else {
        let tween = this.state.add.tween(this)
          .to({x: cell.topPanel.x+cell.width/2, alpha: 0, width: 0, height: 0}, this.speed)
          .start();
        tween.onComplete.add(() => this.state.state.start('Menu'));
      }
    });
  }

  update() {


  }
}

module.exports = Player;
