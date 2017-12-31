class Menu extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.game.noiseBlur.blurRadius = 0.0005;
    this.game.grayscale.r = 5.0;

    this.sky = new PIXI.Sprite(PIXI.Texture.fromImage('sky'));
    this.addChild(this.sky);

    this.sun = new PIXI.Sprite(PIXI.Texture.fromImage('sun'));
    this.sun.x = 700;
    this.sun.y = 130;
    this.addChild(this.sun);

    this.mount = new PIXI.Sprite(PIXI.Texture.fromImage('mount'));
    this.mount.y = 160;
    this.addChild(this.mount);

    this.label = new PIXI.Text('Mottion', {
      font: 'normal 200px Opificio Bold',
      fill: '#5774f6',
      align: 'center'
    });
    this.label.anchor.set(.5);
    this.label.y = 330;
    this.label.x = this.game.w/2;
    this.addChild(this.label);

    this.citaty = new PIXI.Text('He played with his dreams, and dreams played to them.', {
      font: 'normal 60px Opificio Bold',
      fill: '#5774f6',
      wordWrap: true,
      wordWrapWidth: this.game.w/2,
      align: 'center'
    });
    this.citaty.anchor.set(.5);
    this.citaty.y = 500;
    this.citaty.x = this.game.w/2;
    this.addChild(this.citaty);

    this.displacementSprite = new PIXI.Sprite(PIXI.Texture.fromImage('displacement'));
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

    this.clouds = new PIXI.Container();
    this.clouds.filter = [this.displacementFilter];

    this.addChild(this.clouds);
    this.clouds.addChild(this.displacementSprite);

    this.count = 0;

    this.c1 = new PIXI.Sprite(PIXI.Texture.fromImage('cloud'));
    this.c1.y = 430-50;
    this.c1.alpha = .4;
    this.c1.scale.set(3);
    this.c1.x = -100;
    this.clouds.addChild(this.c1);

    this.c2 = new PIXI.Sprite(PIXI.Texture.fromImage('cloud'));
    this.c2.y = 500-50;
    this.c2.alpha = .4;
    this.c2.scale.set(-3, 3);
    this.c2.x = this.game.w+100;
    this.clouds.addChild(this.c2);

    this.c3 = new PIXI.Sprite(PIXI.Texture.fromImage('cloud'));
    this.c3.y = 650-50;
    this.c3.alpha = .4;
    this.c3.scale.set(-5, 5);
    this.c3.x = this.game.w+300;
    this.clouds.addChild(this.c3);

    this.c4 = new PIXI.Sprite(PIXI.Texture.fromImage('cloud'));
    this.c4.y = 550-50;
    this.c4.alpha = .4;
    this.c4.scale.set(4);
    this.c4.x = -290;
    this.clouds.addChild(this.c4);

    this.filters = [new PIXI.filters.AdvancedBloomFilter({
      bloomScale: .4,
      brightness: 0.5
    })];

    this.interactive = true;
    this.on('pointerdown', () => this.toPlayground())
  }
  toPlayground() {
    let tween = PIXI.tweenManager.createTween(this);
    tween.from({y: this.y}).to({y: -500});
    tween.time = 600;
    tween.start();
    tween.on('end', () => this.game.scenes.enableScene('playground'));
  }
  update() {
    this.count += 0.05;

    for(var i = 0; i < this.clouds.children.length; i++) {
      this.clouds.children[i].x += Math.sin(i * 30 + this.count);
    }
    this.displacementSprite.x += 10;
    this.displacementSprite.y += 10;
  }
}

module.exports = Menu;
