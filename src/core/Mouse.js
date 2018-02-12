class Mouse extends PIXI.Sprite {
  constructor(game) {
    super(PIXI.Texture.fromImage('cursor.png'));
    game.addChild(this);

    game.interactive = true;
    game.cursor = 'none';
    game.on('pointermove', (e) => {
      this.x = e.data.global.x/game.resolution;
      this.y = e.data.global.y/game.resolution;
    });

    this.anchor.set(.5);
    this.scale.set(.6);
    this.tint = 0xffeb3b;
    game.ticker.add(() => this.rotation += .1);
  }
}

module.exports = Mouse;
