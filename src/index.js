const Loader = require('./core/Loader');
const Game = require('./Game');

new Loader().loadResources(() => {
  window.game = new Game();
  game.audio.add('menu_music', 'assets/sounds/mantra.ogg');
  game.audio.add('typing_sound', 'assets/sounds/typing.ogg', {loop: true});
  game.audio.analyzer();
  game.scenes.toScene('menu', 0xFFFFFF, 0, 1000);
});
