const RotationFilter = require("../filters/rotation");

class FxManager {
  constructor(scene, params = {}) {
    this.scene = scene;
    this.game = scene.game || scene;

    this.vignette = new PIXI.Sprite.fromImage("vignette");
    this.vignette.width = this.game.w;
    this.vignette.height = this.game.h;
    this.vignette.alpha = 0.2;
    this.scene.addChild(this.vignette);

    this.crtFx = new PIXI.filters.CRTFilter({ vignetting: 0 });
    this.glitchFx = new PIXI.filters.GlitchFilter({
      fillMode: 3,
      slices: 0,
      offset: 10,
      red: [-2, 0],
      blue: [-1, 2],
      green: [3, 1]
    });
    params.rotation && this._addRotation();

    this.scene.filters = [this.crtFx, this.glitchFx];
    this.game.ticker.add(dt => this.update(dt));
  }
  _addRotation() {
    this.scene.rotationContainer = new PIXI.Container();
    this.scene.addChild(this.scene.rotationContainer);

    this.scene.rotationContainer.filterArea = new PIXI.Rectangle(
      0,
      0,
      this.game.w,
      this.game.h
    );
    this.scene.rotationContainer.filter = [new RotationFilter()];

    this.game.scenes.once(
      "disabledScene",
      () => (this.game.mouse.filters = [])
    );
    this.game.mouse.filters = [new RotationFilter()];
  }
  blinkVignette(time = 2000) {
    let show = this.scene.tweenManager.createTween(this.vignette);
    show.from({ alpha: 0.2 }).to({ alpha: 1 });
    show.time = (time * 1) / 4;
    show.on("end", () => {
      let end = this.scene.tweenManager.createTween(this.vignette);
      end.from({ alpha: 1 }).to({ alpha: 0.2 });
      end.time = (time * 3) / 4;
      end.start();
    });
    show.start();
  }
  rotation(start, end, props) {
    let data = {};
    let rotate = this.scene.tweenManager.createTween(data);
    Object.assign(rotate, { time: 1000 }, props);
    rotate.from({ rotation: start }).to({ rotation: end });
    rotate.on("update", () => {
      this.game.mouse.filters[0].rotation = data.rotation;
      this.wrap.filters[0].rotation = data.rotation;
    });
    rotate.start();
  }
  update(dt) {
    this.crtFx.time += dt;
    this.glitchFx.time += dt;
    this.vignette.alpha = this.game.audio.coefBit / 2;

    let pos = this.game.mouse.position;
    this.glitchFx.red[0] = ((0.7 * pos.x) / 1920) * 2 * this.game.audio.coefBit;
    this.glitchFx.red[1] = ((0.9 * pos.y) / 1080) * 2 * this.game.audio.coefBit;
    this.glitchFx.blue[0] =
      ((0.5 * pos.x) / 1920) * 2 * this.game.audio.coefBit;
    this.glitchFx.blue[1] =
      ((-0.9 * pos.y) / 1080) * 2 * this.game.audio.coefBit;
    this.glitchFx.green[0] =
      ((-2 * pos.x) / 1920) * 2 * this.game.audio.coefBit;
    this.glitchFx.green[1] =
      ((-1.2 * pos.y) / 1080) * 2 * this.game.audio.coefBit;
    this.glitchFx.seed = Math.random() * this.game.audio.coefBit;
  }
}

module.exports = FxManager;
