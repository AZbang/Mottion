const Loader = require('./core/Loader');
const Game = require('./Game');

new Loader().loadResources(() => {
  window.game = new Game();
  game.scenes.toScene('menu', 0xFFFFFF, 1, 1000);
});
