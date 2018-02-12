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
  }
}

module.exports = FilterManager;
