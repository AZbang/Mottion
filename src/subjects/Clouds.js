class Clouds extends PIXI.Container {
  constructor(scene) {
    super();

    this.scene = scene;
    this.game = scene.game;

    this.textureCloud = PIXI.Texture.fromImage('bg_cloud');
    this.amt = Math.round(this.game.h/this.textureCloud.height)*3;
    this.PADDING = 100;

    for(let i = -2; i < this.amt; i++) {
      this.addCloud(0, i*this.textureCloud.height/2, i)
    }

    this.count = 0;
  }
  addCloud(x, y, index, bottomOrder) {
    let cloud = new PIXI.Sprite(this.textureCloud);
    bottomOrder ? this.addChildAt(cloud) : this.addChild(cloud);

    cloud.scale.set((this.game.w+this.PADDING*2)/this.textureCloud.width);
    cloud.x = index % 2 ? x-this.PADDING : this.game.w+this.PADDING;
    cloud.y = y;

    cloud.scale.x *= index % 2 ? 1 : -1;
    cloud.index = index;
  }
  update() {
    this.count += 0.05;

    for(var i = 0; i < this.children.length; i++) {
      let cloud = this.children[i];
      cloud.x += Math.sin(cloud.index * 30 + this.count);
      if(cloud.y >= this.game.h) {
        this.removeChild(cloud);
        this.addCloud(0, -cloud.height, cloud.index, true);
      } else cloud.y += 5;
    }
  }
}

module.exports = Clouds;
