require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
require('pixi-particles');
require('pixi-filters');

const Loader = require('./Loader');
const Game = require('./Game');

new Loader('assets/banner.png', () => {
  let game = new Game();
  
  document.body.appendChild(game.view);
  game.scenes.enableScene('menu');
});
