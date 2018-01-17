const Sphere = require('../subjects/Sphere');

class Mouse extends Sphere {
  constructor(game) {
    super(game);
    game.addChild(this);

    game.interactive = true;
    game.cursor = 'none';
    game.on('pointermove', (e) => {
      this.setPos({x: e.data.global.x/game.resolution, y: e.data.global.y/game.resolution});
    });
  }
}

module.exports = Mouse;
