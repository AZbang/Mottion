class FilterManager {
  constructor(scene) {
    this.scene = scene;
    this.game = scene.game || scene;

    this.crtFx = new PIXI.filters.CRTFilter();
    this.glitchFx = new PIXI.filters.GlitchFilter({
      fillMode: 3,
      slices: 0,
      red: [-2, 0],
      blue: [-1, 2],
      green: [3, 1]
    });
    this.scene.filters = [this.crtFx, this.glitchFx];
    this.game.ticker.add((dt) => this.update(dt));
  }
  update(dt) {
    this.crtFx.time += dt;
    this.glitchFx.time += dt;

    let pos = this.game.mouse.position;
    this.glitchFx.red[0] = 1000/pos.x;
    this.glitchFx.red[1] = pos.y/1000;
    this.glitchFx.blue[0] = 1000/pos.x;
    this.glitchFx.blue[1] = -pos.y/1000;
    this.glitchFx.green[0] = -pos.x/1000;
    this.glitchFx.green[1] = 1000/-pos.y;
  }
}

module.exports = FilterManager;
