class WindowManager extends Phaser.Group {
  constructor(state) {
    super(state);

    this.state = state;

    this.alpha = 0;
    this.fixedToCamera = true;

    this.bg = this.state.make.graphics(0, 0);
    this.bg.beginFill(0xFFFFFF);
    this.bg.drawRect(0, 0, this.state.game.width, this.state.game.height);
    this.bg.inputEnabled = true;
    this.add(this.bg);

    this.label = this.state.make.text(this.state.game.width/2, 440, "", {
      font: 'Opificio',
      fontSize: 100,
      fontWeight: 100,
      fontWeight: 600,
      fill: "#555dff"
    });
    this.label.anchor.set(0.5);
    this.add(this.label);


    this.content = this.state.make.text(this.state.game.width/2, 540, "", {
      font: 'Opificio',
      fontSize: 50,
      fontWeight: 600,
      fill: "#555dff",
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.state.game.width-100
    });
    this.content.anchor.set(0.5, 0);
    this.add(this.content);
  }
  addWindow(label, text, cb) {
    this.state.add.tween(this)
      .to({alpha: 1}, 500)
      .start();
    this.bg.inputEnabled = true;

    this.label.text = label;
    this.content.text = text;
		this.bg.events.onInputUp.addOnce(() => {
      this.state.add.tween(this)
        .to({alpha: 0}, 500)
        .start();
      this.bg.inputEnabled = false;
      cb && cb();
    });
  }
}

module.exports = WindowManager;
