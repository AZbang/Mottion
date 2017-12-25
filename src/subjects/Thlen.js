class Thlen extends PIXI.Container {
  constructor(scene) {
    super();

    this.scene = scene;
    this.game = scene.game;

    this.PADDIN = 50;

    this.displacementSprite = new PIXI.Sprite(PIXI.Texture.fromImage('displacement'));
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    scene.addChild(this.displacementSprite);
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

    this.thlen = new PIXI.Sprite(PIXI.Texture.fromImage('thlen'));
    this.thlen.width = this.game.w+this.PADDIN;
    this.thlen.y = this.game.h-this.thlen.height+this.PADDIN;
    this.thlen.x = -this.PADDIN/2;
    this.thlen.filters = [this.displacementFilter];
    scene.addChild(this.thlen);
  }
  update() {
    this.displacementSprite.x += 10;
    this.displacementSprite.y += 10;
  }
}

module.exports = Thlen;
