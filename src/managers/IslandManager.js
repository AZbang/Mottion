const Entity = require('../objects/Entity');

class IslandManager extends Phaser.Group {
  constructor(state) {
    super(state.game);
    this.state = state;

    this.autoCull = true;

    this.island = this.create(0, this.state.game.height+10, 'island');
    this.island.anchor.set(0, 1);
    this.island.width = this.state.cellsManager.sizeCell*this.state.cellsManager.amtX;
    this.island.height = this.state.cellsManager.sizeCell*this.state.cellsManager.amtX;
    // this.island.tint = 0xff4444; 0x00d461

    this.create(42-20, 650, 'flag');
    this.create(120-20, 840, 'flag');
    this.create(75-20, 1060, 'flag');
    this.create(265-20, 980, 'flag');
    this.create(440+100, 1110, 'flag').scale.x *= -1;
    this.create(570+100, 1015, 'flag').scale.x *= -1;
    this.create(620+100, 780, 'flag').scale.x *= -1;
  }
  update() {
  }
}

module.exports = IslandManager;
