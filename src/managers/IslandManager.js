const Entity = require('../objects/Entity');

class IslandManager extends Phaser.Group {
  constructor(state) {
    super(state.game);
    this.state = state;

    this.island = this.create(0, this.state.game.height+10, 'island');
    this.island.anchor.set(0, 1);
    this.island.width = this.state.cellsManager.sizeCell*5;
    this.island.height = this.state.cellsManager.sizeCell*5;
    this.island.tint = 0xff4444; 0x00d461

    this.create(200, this.state.game.height-256, 'flag');
    this.create(600, this.state.game.height-356, 'flag').scale.x *= -1;
    this.create(400, this.state.game.height-400, 'flag').scale.x *= -1;
    this.create(100, this.state.game.height-300, 'flag');

    for(let y = 0; y < 4; y++) {
      for(let x = 0; x < this.state.game.width/50; x++) {
        if(Math.random() < .3) continue;
        let px = x*50;
        let py = this.state.game.height-y*50;
        this.add(new Entity(this.state, px, py, this.state.rnd.between(30, 50), false));
      }
    }
  }
}

module.exports = IslandManager;
