const Game = require('./game');

PIXI.loader
  .add('blocks', 'assets/blocks.json')
  .load((loader, resources) => {
    console.log(PIXI.loader.resources);
    let game = new Game();
    window.game = game;
  });
