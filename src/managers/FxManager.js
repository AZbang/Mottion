class FxManager {
  constructor(scene) {
    this.scene = scene;
    this.game = scene.game || scene;

    this.vignette = new PIXI.Sprite.fromImage('vignette');
    this.vignette.width = this.game.w;
    this.vignette.height = this.game.h;
    this.vignette.alpha = .2;
    this.scene.addChild(this.vignette);

    this.crtFx = new PIXI.filters.CRTFilter();
    this.glitchFx = new PIXI.filters.GlitchFilter({
      fillMode: 3,
      slices: 0,
      offset: 10,
      vignette: 0,
      red: [-2, 0],
      blue: [-1, 2],
      green: [3, 1]
    });
    this.scene.filters = [this.crtFx, this.glitchFx];
    this.game.ticker.add((dt) => this.update(dt));
  }
  blinkVignette(time=2000) {
    let show = PIXI.tweenManager.createTween(this.vignette);
    show.from({alpha: .2}).to({alpha: 1});
    show.time = time*1/4;
    show.on('end', () => {
      let end = PIXI.tweenManager.createTween(this.vignette);
      end.from({alpha: 1}).to({alpha: .2});
      end.time = time*3/4;
      end.start();
    });
    show.start();
  }
  update(dt) {
    this.crtFx.time += dt;
    this.glitchFx.time += dt;
    this.vignette.alpha = this.game.audio.coefBit/2;

    let pos = this.game.mouse.position;
    this.glitchFx.red[0] = 0.7*pos.x/1920*2*this.game.audio.coefBit;
    this.glitchFx.red[1] = 0.9*pos.y/1080*2*this.game.audio.coefBit;
    this.glitchFx.blue[0] = 0.5*pos.x/1920*2*this.game.audio.coefBit;
    this.glitchFx.blue[1] = -0.9*pos.y/1080*2*this.game.audio.coefBit;
    this.glitchFx.green[0] = -2*pos.x/1920*2*this.game.audio.coefBit;
    this.glitchFx.green[1] = -1.2*pos.y/1080*2*this.game.audio.coefBit;
    this.glitchFx.seed = Math.random()*this.game.audio.coefBit;
  }
}

module.exports = FxManager;
