require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
require('pixi-particles');

const Loader = require('./Loader');
const Game = require('./Game');

new Loader('assets/banner.png', () => {
  let game = new Game();
  game.scenes.enableScene('menu');
});
