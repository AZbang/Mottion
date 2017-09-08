class Entity extends Phaser.Sprite {
  constructor(state, x, y, r, isArcs, scale=1.5) {
    super(state.game, x, y, 'player');
    state.add.existing(this);

    this.state = state;

    this.width = r;
    this.height = r;
    this.anchor.set(.5);

    this.arcScale = scale;

    if(isArcs) {
      this.createArc(-.8, -1, .9, 1, 0x373fff);
      this.createArc(.9, -.8, -1, .9, 0xff3737);
      this.createArc(-.8, .9, .8, -1, 0x42863c);
      this.createArc(.8, .9, -.8, -.8, 0x8242aa);
    }

    let rand = this.state.rnd.between(300, 1000);
    let sc = this.state.rnd.between(5, 40);
    this.tweenBreathe = this.state.add.tween(this)
      .to({width: r+sc, height: r+sc}, rand)
      .to({width: r, height: r}, rand)
      .yoyo()
      .loop()
      .start();
  }
  createArc(sx, sy, ex, ey, tint) {
    let arc = this.state.make.sprite(this.width*sx/this.arcScale, this.height*sy/this.arcScale, 'player');

    arc.tint = tint;
    arc.width = 30;
    arc.height = 30;
    this.state.add.tween(arc)
      .to({x: this.width*ex/this.arcScale, y: this.height*ey/this.arcScale, width: 0, height: 0}, this.state.rnd.between(500, 1000))
      .to({x: this.width*sx/this.arcScale, y: this.height*sy/this.arcScale}, this.state.rnd.between(300, 600))
      .to({width: 30, height: 30}, this.state.rnd.between(500, 1000))
      .yoyo()
      .loop()
      .start();
    this.addChild(arc);
  }
}

module.exports = Entity;
