const Game = require('./game');

let game = new Game();
console.log(game.scenesManager.toggleScene('playground'));

window.game = game;
