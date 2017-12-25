require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
const Game = require('./game');

WebFont.load({
  google: {
    families: ['Amatic SC']
  },
  active() {
    PIXI.loader
      .add('blocks', 'assets/blocks.json')
      .add('player', 'assets/player.png')
      .add('bg', 'assets/bg.png')
      .add('displacement', 'assets/displacement.png')
      .add('thlen', 'assets/thlen.png')
      .add('lightmap', 'assets/lightmap.png')
      .add('mask', 'assets/mask.png')
      .add('music', 'assets/music.mp3')
      .load((loader, resources) => {
        PIXI.sound.play('music');
        let game = new Game();
        game.scenes.enableScene('playground');

        window.game = game;
      });
  }
});
