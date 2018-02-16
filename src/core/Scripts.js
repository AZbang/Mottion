const scripts = require('../content/scripts');

class Scripts {
  constructor(game) {
    this.game = game;
  }
  run(id, args) {
    scripts[id](this.game, this.game.scenes.activeScene, args);
  }
}

module.exports = Scripts;
