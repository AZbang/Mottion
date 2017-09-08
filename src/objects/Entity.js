class Entity extends Phaser.Sprite {
  constructor(state, x, y) {
    super(state.cellsManager.game, x, y, 'player');
    state.add.existing(this);

    this.state = state;

    this.width = 70;
    this.height = 70;
    this.anchor.set(.5);

    this.createArc(-1, -1, 1, 1, 0x373fff);
    this.createArc(1, -1, -1, 1, 0xff3737);
    this.createArc(-1, 1, 1, -1, 0x42863c);

    this.tweenBreathe = this.state.add.tween(this)
      .to({width: 100, height: 100}, 500)
      .to({width: 70, height: 70}, 500)
      .yoyo()
      .loop()
      .start();
  }
  createArc(sx, sy, ex, ey, tint) {
    let arc = this.state.make.sprite(this.width*sx/1.5, this.height*sy/1.5, 'player');

    arc.tint = tint;
    arc.width = 50;
    arc.height = 50;
    this.state.add.tween(arc)
      .to({x: this.width*ex/1.5, y: this.height*ey/1.5, width: 0, height: 0}, 1000)
      .to({x: this.width*sx/1.5, y: this.height*sy/1.5}, 1)
      .to({width: 50, height: 50}, 1000)
      .yoyo()
      .loop()
      .start();
    this.addChild(arc);
  }

  update() {
    this.rotation += .01;
  }
}

module.exports = Entity;
