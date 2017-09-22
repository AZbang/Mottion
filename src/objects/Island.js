const Entity = require('../objects/Entity');

class Island extends Phaser.Sprite {
  constructor(level, x, y, lvl) {
    super(level.state.game, x, y, 'island');
    level.state.add.existing(this);

    this.level = level;
    this.state = level.state;

    this.tint = lvl.tint;

    this.size = this.level.sizeCell*this.level.amtX;
    this.width = this.size;
    this.height = this.size;

    this.addChild(this.state.make.sprite(42-20, 150, 'flag'));
    this.addChild(this.state.make.sprite(120-20, 240, 'flag'));
    this.addChild(this.state.make.sprite(75-20, 460, 'flag'));
    this.addChild(this.state.make.sprite(265-20, 560, 'flag'));
    this.addChild(this.state.make.sprite(440+100, 610, 'flag')).scale.x *= -1;
    this.addChild(this.state.make.sprite(570+100, 515, 'flag')).scale.x *= -1;
    this.addChild(this.state.make.sprite(620+100, 280, 'flag')).scale.x *= -1;
  }
}

module.exports = Island;
