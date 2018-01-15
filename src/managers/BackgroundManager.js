class BackgroundManager extends PIXI.Container {
  constructor(game, scene) {
    super();

    this.scene = scene;
    this.game = game;

    this.cloudSize = PIXI.Texture.fromImage('cloud.png').orig;
    this.cloudScale = (this.game.w+100*2)/this.cloudSize.width;
    this.padding = 100;
    this.speed = 2;
    this.amplitude = 10;

    this._generateBg();
    this.game.ticker.add(() => this.update());
  }
  _generateBg() {
    let amt = Math.round(this.game.h/this.cloudSize.height)*3;
    for(let i = -2; i < amt; i++) {
      let y = i*this.cloudSize.height/2;
      this.addCloud(0, y, true);
      i % 2 ? this.addGear(0, y, true) : this.addHouse(0, y, true);
    }
  }
  addObject(texture, isFront) {
    let obj = new PIXI.Sprite(texture);
    isFront ? this.addChild(obj) : this.addChildAt(obj);

    return obj;
  }
  respawnObject(object) {
    this.removeChild(object);

    let y = this.cloudSize.height*this.cloudScale;
    if(object.type === 'cloud') this.addCloud(0, -y, false);
    else if(object.type === 'gear') this.addGear(0, -y, false);
    else this.addHouse(0, -y, false);
  }
  addCloud(x, y, isFront) {
    let pad = 100;
    let cloud = this.addObject(PIXI.Texture.fromImage('cloud.png'), isFront);
    cloud.type = 'cloud';

    cloud.scale.set(this.cloudScale);
    cloud.scale.x *= Math.random() < .5 ? 1 : -1;

    cloud.x = cloud.scale.x > 0 ? x-pad : this.game.w+pad;
    cloud.y = y;

    let i = Math.floor(Math.random() * 5);
    let t = 0;
    cloud.update = () => {
      t += 0.05;
      cloud.x += Math.sin(i * this.amplitude + t);
    }
  }
  addGear(x, y, isFront) {
    let gear = this.addObject(PIXI.Texture.fromImage('gear.png'), isFront);
    gear.type = 'gear';

    gear.x = Math.random() < .5 ? x+gear.width : x+this.game.w-gear.width;
    gear.y = y+gear.height/2;
    gear.anchor.set(.5);
    gear.visible = Math.random() < .2;

    gear.update = (t) => {
      gear.rotation += .04;
    }
  }
  addHouse(x, y, isFront) {
    let house = this.addObject(PIXI.Texture.fromImage('house.png'), isFront);
    house.type = 'house';
    house.visible = Math.random() < .2;

    house.x = Math.random() < .5 ? x+50 : x+this.game.w-house.width-50;
    house.y = y;
  }
  update() {
    for(var i = 0; i < this.children.length; i++) {
      let object = this.children[i];
      object.update && object.update();

      if(object.y-object.height*object.anchor.y >= this.game.h) this.respawnObject(object);
      else object.y += this.speed;
    }
  }
}

module.exports = BackgroundManager;
