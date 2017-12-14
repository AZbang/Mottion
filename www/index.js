(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const ScenesManager = require('./managers/ScenesManager');

class Game extends PIXI.Application {
  constructor() {
    super(window.innerWidth, window.innerHeight, {backgroundColor: 0xfcfcfc})
    document.body.appendChild(this.view);

    this.scenesManager = new ScenesManager(this);
    this.stage.addChild(this.scenesManager);

    this._initTicker();
  }
  _initTicker() {
    this.ticker.add((dt) => {
      this.scenesManager.update(dt);
    });
  }
}

module.exports = Game;

},{"./managers/ScenesManager":3}],2:[function(require,module,exports){
const Game = require('./game');

let game = new Game();
console.log(game.scenesManager.toggleScene('playground'));

window.game = game;

},{"./game":1}],3:[function(require,module,exports){
const scenes = require('../scenes');

class ScenesManager extends PIXI.Container {
  constructor(game) {
    super();
    this.addScenes(scenes);
  }
  addScenes(scenes) {
    for(let id in scenes) {
      this.addScene(scenes[id], id);
    }
  }
  addScene(SceneClass, id) {
    let scene = new SceneClass(this);
    scene._id = id;
    return this.addChild(scene);
  }
  getScene(id) {
    return this.children.find((scene) => scene._id === id);
  }
  toggleScene(id) {
    if(this.activeScene) this.activeScene.visible = false;
    this.activeScene = this.getScene(id);
    this.activeScene.visible = true;

    return this.activeScene;
  }
  update(dt) {
    for(let i = 0; i < this.children.length; i++) {
      this.children[i].update(dt);
    }
  }
}

module.exports = ScenesManager;

},{"../scenes":5}],4:[function(require,module,exports){
const TileMap = require('../tilemap/TileMap.js');

class Playground extends PIXI.Container {
  constructor() {
    super();

    this.tileMap = new TileMap(this);
    this.addChild(this.tileMap);
    
    this.tileMap.addFragment([
      'AAAA',
      'AAAA',
      'AAAA',
      'AAAA'
    ]);
  }
  update(dt) {
    this.tileMap.update(dt);
  }
}

module.exports = Playground;

},{"../tilemap/TileMap.js":8}],5:[function(require,module,exports){
module.exports = {
  'playground': require('./Playground')
}

},{"./Playground":4}],6:[function(require,module,exports){
class Block extends PIXI.Sprite {
  constructor(tilemap, x, y, params) {
    super(PIXI.Texture.fromImage(params.image));

    this.anchor.set(.5);
    this.width = tilemap.TILE_SIZE;
    this.height = tilemap.TILE_SIZE;
    this.x = x*tilemap.TILE_SIZE+tilemap.TILE_SIZE/2;
    this.y = y*tilemap.TILE_SIZE+tilemap.TILE_SIZE/2;

    console.log(this);
  }
  update() {

  }
}

module.exports = Block;

},{}],7:[function(require,module,exports){
module.exports={
  "A": {
    "image": "assets/cells/cell1.png"
  }
}

},{}],8:[function(require,module,exports){
const TILE_TYPES = require('./TYLE_TYPES');
const Block = require('./Block');

class TileMap extends PIXI.Container {
  constructor(scene) {
    super();

    this.TILE_SIZE = 100;
  }
  addFragment(map) {
    for(let y = 0; y < map.length; y++) {
      for(let x = 0; x < map[y].length; x++) {
        this.addChild(new Block(this, x, y, TILE_TYPES[map[y][x]]));
      }
    }
  }
  update(dt) {
    for(let i = 0; i < this.children.length; i++) {
      this.children[i].update(dt);
    }
  }
}

module.exports = TileMap;

},{"./Block":6,"./TYLE_TYPES":7}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9nYW1lLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvaW5kZXguanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9tYW5hZ2Vycy9TY2VuZXNNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc2NlbmVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zY2VuZXMvaW5kZXguanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy90aWxlbWFwL0Jsb2NrLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvdGlsZW1hcC9UWUxFX1RZUEVTLmpzb24iLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy90aWxlbWFwL1RpbGVNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBTY2VuZXNNYW5hZ2VyID0gcmVxdWlyZSgnLi9tYW5hZ2Vycy9TY2VuZXNNYW5hZ2VyJyk7XHJcblxyXG5jbGFzcyBHYW1lIGV4dGVuZHMgUElYSS5BcHBsaWNhdGlvbiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0LCB7YmFja2dyb3VuZENvbG9yOiAweGZjZmNmY30pXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlldyk7XHJcblxyXG4gICAgdGhpcy5zY2VuZXNNYW5hZ2VyID0gbmV3IFNjZW5lc01hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLnN0YWdlLmFkZENoaWxkKHRoaXMuc2NlbmVzTWFuYWdlcik7XHJcblxyXG4gICAgdGhpcy5faW5pdFRpY2tlcigpO1xyXG4gIH1cclxuICBfaW5pdFRpY2tlcigpIHtcclxuICAgIHRoaXMudGlja2VyLmFkZCgoZHQpID0+IHtcclxuICAgICAgdGhpcy5zY2VuZXNNYW5hZ2VyLnVwZGF0ZShkdCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuIiwiY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpO1xyXG5cclxubGV0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG5jb25zb2xlLmxvZyhnYW1lLnNjZW5lc01hbmFnZXIudG9nZ2xlU2NlbmUoJ3BsYXlncm91bmQnKSk7XHJcblxyXG53aW5kb3cuZ2FtZSA9IGdhbWU7XHJcbiIsImNvbnN0IHNjZW5lcyA9IHJlcXVpcmUoJy4uL3NjZW5lcycpO1xyXG5cclxuY2xhc3MgU2NlbmVzTWFuYWdlciBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5hZGRTY2VuZXMoc2NlbmVzKTtcclxuICB9XHJcbiAgYWRkU2NlbmVzKHNjZW5lcykge1xyXG4gICAgZm9yKGxldCBpZCBpbiBzY2VuZXMpIHtcclxuICAgICAgdGhpcy5hZGRTY2VuZShzY2VuZXNbaWRdLCBpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFkZFNjZW5lKFNjZW5lQ2xhc3MsIGlkKSB7XHJcbiAgICBsZXQgc2NlbmUgPSBuZXcgU2NlbmVDbGFzcyh0aGlzKTtcclxuICAgIHNjZW5lLl9pZCA9IGlkO1xyXG4gICAgcmV0dXJuIHRoaXMuYWRkQ2hpbGQoc2NlbmUpO1xyXG4gIH1cclxuICBnZXRTY2VuZShpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmluZCgoc2NlbmUpID0+IHNjZW5lLl9pZCA9PT0gaWQpO1xyXG4gIH1cclxuICB0b2dnbGVTY2VuZShpZCkge1xyXG4gICAgaWYodGhpcy5hY3RpdmVTY2VuZSkgdGhpcy5hY3RpdmVTY2VuZS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lID0gdGhpcy5nZXRTY2VuZShpZCk7XHJcbiAgICB0aGlzLmFjdGl2ZVNjZW5lLnZpc2libGUgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmFjdGl2ZVNjZW5lO1xyXG4gIH1cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0udXBkYXRlKGR0KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NlbmVzTWFuYWdlcjtcclxuIiwiY29uc3QgVGlsZU1hcCA9IHJlcXVpcmUoJy4uL3RpbGVtYXAvVGlsZU1hcC5qcycpO1xyXG5cclxuY2xhc3MgUGxheWdyb3VuZCBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy50aWxlTWFwID0gbmV3IFRpbGVNYXAodGhpcyk7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMudGlsZU1hcCk7XHJcbiAgICBcclxuICAgIHRoaXMudGlsZU1hcC5hZGRGcmFnbWVudChbXHJcbiAgICAgICdBQUFBJyxcclxuICAgICAgJ0FBQUEnLFxyXG4gICAgICAnQUFBQScsXHJcbiAgICAgICdBQUFBJ1xyXG4gICAgXSk7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy50aWxlTWFwLnVwZGF0ZShkdCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXlncm91bmQ7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICdwbGF5Z3JvdW5kJzogcmVxdWlyZSgnLi9QbGF5Z3JvdW5kJylcclxufVxyXG4iLCJjbGFzcyBCbG9jayBleHRlbmRzIFBJWEkuU3ByaXRlIHtcclxuICBjb25zdHJ1Y3Rvcih0aWxlbWFwLCB4LCB5LCBwYXJhbXMpIHtcclxuICAgIHN1cGVyKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UocGFyYW1zLmltYWdlKSk7XHJcblxyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuICAgIHRoaXMud2lkdGggPSB0aWxlbWFwLlRJTEVfU0laRTtcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGlsZW1hcC5USUxFX1NJWkU7XHJcbiAgICB0aGlzLnggPSB4KnRpbGVtYXAuVElMRV9TSVpFK3RpbGVtYXAuVElMRV9TSVpFLzI7XHJcbiAgICB0aGlzLnkgPSB5KnRpbGVtYXAuVElMRV9TSVpFK3RpbGVtYXAuVElMRV9TSVpFLzI7XHJcblxyXG4gICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgfVxyXG4gIHVwZGF0ZSgpIHtcclxuXHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgXCJBXCI6IHtcclxuICAgIFwiaW1hZ2VcIjogXCJhc3NldHMvY2VsbHMvY2VsbDEucG5nXCJcclxuICB9XHJcbn1cclxuIiwiY29uc3QgVElMRV9UWVBFUyA9IHJlcXVpcmUoJy4vVFlMRV9UWVBFUycpO1xyXG5jb25zdCBCbG9jayA9IHJlcXVpcmUoJy4vQmxvY2snKTtcclxuXHJcbmNsYXNzIFRpbGVNYXAgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3Ioc2NlbmUpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5USUxFX1NJWkUgPSAxMDA7XHJcbiAgfVxyXG4gIGFkZEZyYWdtZW50KG1hcCkge1xyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IG1hcC5sZW5ndGg7IHkrKykge1xyXG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgbWFwW3ldLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChuZXcgQmxvY2sodGhpcywgeCwgeSwgVElMRV9UWVBFU1ttYXBbeV1beF1dKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgdXBkYXRlKGR0KSB7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLnVwZGF0ZShkdCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbGVNYXA7XHJcbiJdfQ==
