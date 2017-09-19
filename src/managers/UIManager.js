class UIManager extends Phaser.Group {
  constructor(state) {
    super(state);

    this.state = state;
    this.fixedToCamera = true;

    this.plane = this.state.make.sprite(0, 0, 'plane');
    this.add(this.plane);

    this.scoreText = this.state.make.text(50, 25, "0ways.", {
      font: 'Roboto',
      fontSize: 60,
      fontWeight: 800,
      fill: "#555dff"
    });
    this.add(this.scoreText);
    this.score = 0;


    this.pause = this.state.make.sprite(this.state.game.width-80, 70, 'time');
    this.pause.anchor.set(.5);
    this.pause.inputEnabled = true;
    this.pause.events.onInputUp.add(() => {
      this.pause.rotation = 0;
      let tween = this.state.add.tween(this.pause)
        .to({rotation: Math.PI*2}, 500)
        .start();

      if(!this.state.game.paused) {
        tween.onComplete.add(() => {
          this.state.game.paused = true;
        });
      } else this.state.game.paused = false;
    });
    this.add(this.pause);
  }
  addScore(v) {
    this.score += v;
    this.scoreText.text = this.score + 'ways.';
  }
  setScore(v) {
    this.score = v;
    this.scoreText.text = this.score + 'ways.';
  }
}

module.exports = UIManager;
