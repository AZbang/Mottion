const Entity = require('../objects/Entity');

class Island extends Phaser.Sprite {
  constructor(level, x, y, lvl) {
    super(level.state.game, x+10, y+10, 'island');
    level.state.add.existing(this);

    this.level = level;
    this.state = level.state;

    this.tint = lvl.tint;

    this.size = this.state.game.width-20;
    this.width = this.size;
    this.height = this.size;

    this.addChild(this.state.make.sprite(50, 50, 'flag')).scale.set(.5, .5);
    this.addChild(this.state.make.sprite(280, 120, 'flag')).scale.set(-.5, .5);
    this.addChild(this.state.make.sprite(45, 75+50, 'flag')).scale.set(.5, .5);
    this.addChild(this.state.make.sprite(300, 60, 'flag')).scale.set(-.5, .5);
    // this.addChild(this.state.make.sprite(440-400, 10, 'flag')).scale.set(-.5, .5);
    // this.addChild(this.state.make.sprite(570-400, 160, 'flag')).scale.set(-.5, .5);
    // this.addChild(this.state.make.sprite(620-400, 140, 'flag')).scale.set(-.5, .5);
  }
}

module.exports = Island;
