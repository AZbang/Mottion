class Player {
  constructor(state) {
    this.circle = state.add.graphics();
    this.circle.beginFill(0x2e2e44, 1);
    this.circle.lineStyle(2, 0x2e2e44, .5);
    this.circle.drawCircle(state.game.width/2, state.game.height/2+400, 100);
  }
}

module.exports = Player;
