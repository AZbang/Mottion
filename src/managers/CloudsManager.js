class CloudsManager extends Phaser.Group {
  constructor(state) {
    super(state.game);
    this.state = state;

    this.lastY = 0;

    this.timer = this.state.time.create(false);
    this.timer.loop(1000, this.createCloud, this);
    this.timer.start();
  }
  createCloud() {
    this.lastY -= this.state.rnd.between(this.state.game.height, this.state.game.height*2);

    let cloud;
    if(Math.random() < .5) {
  		cloud = this.add(this.state.make.sprite(0, this.lastY, 'cloud1'));
  		cloud.width = this.state.game.width-100;
  		cloud.height = 400;
    } else {
      cloud = this.add(this.state.make.sprite(100, this.lastY, 'cloud1'));
      cloud.width = this.state.game.width-100;
      cloud.height = 400;
      cloud.anchor.set(1);
      cloud.scale.x *= -1;
    }

    cloud.duration = Math.random()*2;
    cloud.alpha = this.state.rnd.between(.5, 1);
  }
  update(dt) {
    this.forEach((cloud) => {
      cloud.y += cloud.duration;
      if(cloud.y > this.state.player.y+this.state.game.height-400)
        cloud.destroy();
    });
  }
}

module.exports = CloudsManager;
