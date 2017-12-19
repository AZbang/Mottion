require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
const Game = require('./game');

PIXI.loader
  .add('blocks', 'assets/blocks.json')
  .add('player', 'assets/player.png')
  .add('music', 'assets/music.mp3')
  .load((loader, resources) => {
    // PIXI.sound.play('music');
    let game = new Game();
    game.scenes.enableScene('playground');

    window.game = game;
  });
