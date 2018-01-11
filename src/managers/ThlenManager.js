class ThlenManager extends PIXI.Container {
  constructor(game, scene) {
    super();

    this.scene = scene;
    this.game = game;

    this.displacementSprite = new PIXI.Sprite(PIXI.Texture.fromImage('displacement'));
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.addChild(this.displacementSprite);
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

    this.size = 150;
    this.amt = Math.round(this.game.w/this.size);
    this.PADDIN = 50;
    for(let i = 0; i < this.amt; i++) {
      let thlen = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('thlen')));
      thlen.width = this.size+2;
      thlen.x = i*this.size-1;
      thlen.alpha = .8;
      thlen.blendMode = PIXI.BLEND_MODES.SATURATION;
      thlen.y = this.game.h-this.size;
    }

    this.width += this.PADDIN;
    this.x -= this.PADDIN/2;
    this.filters = [this.displacementFilter];

    this.count = 0;
    this.game.ticker.add(() => this.update());
  }
  update() {
    this.count += 0.05;

    for(var i = 0; i < this.children.length; i++) {
      this.children[i].y += Math.sin(i * 30 + this.count);
    }
    this.displacementSprite.x += 5;
    this.displacementSprite.y += 5;
  }
}

module.exports = ThlenManager;
