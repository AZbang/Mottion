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

    let cloud = this.getFirstDead();
    if(!cloud) {
       cloud = this.add(this.state.make.sprite(0, this.lastY, 'cloud'));
       this.randomizeCloud(cloud);
       this.add(cloud);
    } else {
      this.randomizeCloud(cloud);
      cloud.revive();
    }
  }
  randomizeCloud(cloud) {
    if(Math.random() < .5) {
      cloud.position.set(0, this.lastY);
      cloud.width = this.state.game.width-100;
      cloud.height = 400;
    } else {
      cloud.position.set(100, this.lastY);
      cloud.width = this.state.game.width-100;
      cloud.height = 400;
      cloud.anchor.set(1);
      cloud.scale.x *= -1;
    }
    cloud.duration = Math.random()*2;
    cloud.alpha = .9;
  }
  update(dt) {
    this.forEach((cloud) => {
      cloud.y += cloud.duration;
      if(cloud.y > this.state.levelManager.player.y+this.state.game.height-400)
        cloud.kill();
    });
  }
}

module.exports = CloudsManager;
