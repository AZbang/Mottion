const Loader = require('./core/Loader');
const Game = require('./Game');

new Loader().loadResources(() => {
  window.game = new Game();
  game.audio.add('mantra_music', 'assets/sounds/mantra.ogg', {autoplay: true});
  game.audio.analyzer();
  game.scenes.toScene('menu', 0xFFFFFF, 0, 1000);
});
