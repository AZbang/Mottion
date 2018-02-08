const Loader = require('./core/Loader');
const Game = require('./Game');

new Loader().loadResources(() => {
  window.game = new Game();
  game.audio.playMusic('sadday');
  game.scenes.toScene('menu', 0xFFFFFF, 0, 1000);
});
