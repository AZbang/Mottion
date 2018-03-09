const history = require('./history');

module.exports = {
  1: (game, scene) => {
    scene.history.show(history[1]);
    scene.map.speed = 400;
    scene.rotation(-5, 5, {
      loop: true,
      time: 10000,
      pingPong: true
    });
  },
  2: (game, scene) => {
    scene.history.show(history[2]);
    scene.map.speed = 300;
  },
  3: (game, scene) => {
    scene.history.show(history[3]);
    scene.map.speed = 250;
  },
  4: (game, scene) => {
    scene.history.show(history[4]);
    scene.map.speed = 400;
  },
  5: (game, scene) => {
    scene.history.show(history[5]);
    scene.map.speed = 400;
  },
  6: (game, scene) => {
    scene.history.show(history[6]);
    scene.map.speed = 400;
  },
  7: (game, scene) => {
    scene.history.show(history[7]);
    scene.map.speed = 400;
  },
  8: (game, scene) => {
    scene.history.show(history[8]);
    scene.map.speed = 400;
  },
  9: (game, scene) => {
    scene.history.show(history[9]);
    scene.map.speed = 400;
  },
  10: (game, scene) => {
    scene.history.show(history[10]);
    scene.map.speed = 400;
  }
}
