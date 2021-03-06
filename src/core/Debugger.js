class Debugger extends PIXI.Graphics {
  constructor(game, dev=false) {
    super();
    game.addChild(this);
    this.game = game;

    this.points = [];
    this.rects = [];

    this.fps = new PIXI.Text('FPS: ', {fill: '#fff'});
    this.fps.x = 20;
    this.fps.y = 20;
    this.fps.visible = dev;
    this.addChild(this.fps);

    this.game.ticker.add(() => this.update());
  }
  addPoint(point) {
    this.points.push(point);
  }
  addRect(rect) {
    this.rects.push(rect);
  }
  update() {
    this.clear();

    for(let i = 0; i < this.points.length; i++) {
      this.beginFill(0x44a73f);
      this.drawRect(this.points[i].x-5, this.points[i].y-5, 10, 10);
    }

    for(let i = 0; i < this.rects.length; i++) {
      this.beginFill(0x44a73f, 0.3);
      this.lineStyle(2, 0x44a73f);
      this.drawRect(this.rects[i].x, this.rects[i].y, this.rects[i].width, this.rects[i].height);
    }

    this.fps.text = 'FPS: ' + Math.round(this.game.ticker.FPS);
  }
}

module.exports = Debugger;
