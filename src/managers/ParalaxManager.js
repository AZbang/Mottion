class ParalaxManager extends PIXI.Container {
  constructor(scene) {
    super();

    this.scene = scene;
    this.game = scene.game || game;
    this.game.ticker.add(() => this.update());
    this.scene.addChild(this);

    this.images = ['object_rect.png', 'object_shape.png', 'object_circle.png'];
    this.padding = 100;
    this.speed = 4;
    this.timer = 100;
    this._spawnToLeft = true;
    this._time = 0;
    this.tint = 0xFFFFFF;
  }
  spawnObject() {
    let img = this.images[Math.floor(Math.random()*this.images.length)];
    let obj = new PIXI.Sprite.fromImage(img);
    this._spawnToLeft = !this._spawnToLeft;
    obj.tint = this.tint;
    obj.y = -obj.height;
    obj.anchor.set(.5);
    obj.x = this._spawnToLeft ? Math.random()*this.padding+100 : this.game.w-obj.width-Math.random()*this.padding-100;
    obj.rotation = this._spawnToLeft ? -.1 : .1;
    this.addChild(obj);
  }
  update() {
    this._time++;
    if(this._time >= this.timer) {
      this._time = 0;
      this.spawnObject();
    }

    for(let i = 0; i < this.children.length; i++) {
      let obj = this.children[i];
      obj.y += this.speed;
      obj.scale.set(this.game.audio.analyseData.reduce((sum, i) => sum+=i)/1024/128);
      if(obj.y > this.game.h) this.removeChild(obj);
    }
  }
}

module.exports = ParalaxManager;
