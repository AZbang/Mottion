const Loader = require('./Loader');
const Game = require('./Game');

new Loader('assets/banner.png', () => {
  window.game = new Game();

  document.body.appendChild(game.view);
  game.scenes.enableScene('settings');
});
