require('pixi-sound');
require('pixi-tween');
require('pixi-projection');
require('pixi-particles');

const Game = require('./game');

WebFont.load({
  google: {
    families: ['Amatic SC']
  },
  active() {
    PIXI.loader
      .add('bg', 'assets/bg.png')
      .add('thlen', 'assets/thlen.png')

      .add('blocks', 'assets/spritesheets/blocks.json')
      .add('player', 'assets/spritesheets/player.json')

      .add('displacement', 'assets/filters/displacement.png')
      .add('noise', 'assets/filters/noise_grayscale.png')
      .add('particle', 'assets/filters/particle.png')

      .add('history_family', 'assets/history/family.png')

      .add('music', 'assets/sounds/music.mp3')

      .load((loader, resources) => {
        let game = new Game();
        game.scenes.enableScene('playground');

        window.game = game;
      });
  }
});
