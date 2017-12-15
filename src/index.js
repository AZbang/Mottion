require('pixi-sound');
require('pixi-tween');
const Game = require('./game');

PIXI.loader
  .add('blocks', 'assets/blocks.json')
  .add('music', 'assets/music.mp3')
  .load((loader, resources) => {
    // PIXI.sound.play('music');
    let game = new Game();
    window.game = game;
  });
