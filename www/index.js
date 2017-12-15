(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports.A = [
  {
    map: ['A|B', 'A', 'A|B', 'A', 'A|B', 'A'],
    trim: 3,
    append: 'C',
    shuffle: true
  },
  {
    map: ['A', 'A', 'B', 'B', 'B', 'B'],
    trim: 4,
    shuffle: true
  }
];

module.exports.B = [
  {
    map: ['A', 'A|B', 'A|B', 'A|B', 'A|B', 'A|B'],
    shuffle: true
  },
  {
    map: ['B', 'B', 'B', 'B', 'B', 'B'],
    trim: 4,
    append: 'A'
  }
]

},{}],2:[function(require,module,exports){
const ScenesManager = require('./managers/ScenesManager');

class Game extends PIXI.Application {
  constructor() {
    super(window.innerWidth, window.innerHeight, {backgroundColor: 0xfcfcfc})
    document.body.appendChild(this.view);

    this.w = window.innerWidth;
    this.h = window.innerHeight;

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

},{"./managers/ScenesManager":4}],3:[function(require,module,exports){
const Game = require('./game');

let game = new Game();
console.log(game.scenesManager.toggleScene('playground'));

window.game = game;

},{"./game":2}],4:[function(require,module,exports){
const scenes = require('../scenes');

class ScenesManager extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;

    this.addScenes(scenes);
  }
  addScenes(scenes) {
    for(let id in scenes) {
      this.addScene(scenes[id], id);
    }
  }
  addScene(SceneClass, id) {
    let scene = new SceneClass(this.game, this);
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

},{"../scenes":6}],5:[function(require,module,exports){
const TileMap = require('../tilemap/TileMap.js');
const fragments = require('../fragments.js');

class Playground extends PIXI.Container {
  constructor(game) {
    super();

    this.game = game;
    this.tileMap = new TileMap(this, 100, 6);
    this.tileMap.x = this.game.w/2-100*6/2;

    this.addChild(this.tileMap);

    setInterval(() => {
      this.tileMap.addFragment(fragments.A);
    }, 500);
  }
  update(dt) {
    this.tileMap.update(dt);
    this.tileMap.y += 5 * dt;
  }
}

module.exports = Playground;

},{"../fragments.js":1,"../tilemap/TileMap.js":10}],6:[function(require,module,exports){
module.exports = {
  'playground': require('./Playground')
}

},{"./Playground":5}],7:[function(require,module,exports){
class Block extends PIXI.Sprite {
  constructor(tileMap, x, y, params) {
    super(PIXI.Texture.fromImage(params.image));

    this.tileMap = tileMap;

    this.anchor.set(.5);
    this.width = tileMap.TILE_SIZE;
    this.height = tileMap.TILE_SIZE;
    this.x = x+tileMap.TILE_SIZE/2;
    this.y = y+tileMap.TILE_SIZE/2;
  }
  update(dt) {
    if(this.worldTransform.ty-this.tileMap.TILE_SIZE/2 > window.innerHeight) {
      this.tileMap.removeChild(this);
    }
  }
}

module.exports = Block;

},{}],8:[function(require,module,exports){
class MapFragment {
  constructor(data) {
    this.data = data;
    this.inputMap = data.map;
    this.fragment = [];


    // OPERATORS
    for(let i = 0; i < data.map.length; i++) {
      if(~~data.map[i].indexOf('|')) this.caseOperator(data.map[i], i);
      else this.fragment[i] = data.map[i];
    }

    // METHODS
    data.trim && this.randomTrim(data.trim);
    data.append && this.randomAppend(data.append);
    data.shuffle && this.shuffle();

    return this.fragment;
  }
  // OPERATORS
  // Case operator: 'A|B|C|D' => C and etc...
  caseOperator(str, i) {
    let ids = str.split('|');
    this.fragment[i] = ids[Math.floor(Math.random()*ids.length)];
    return this;
  }

  // METHODS
  // Trimming array in range 0..rand(min, length)
  randomTrim(min) {
    this.fragment.length = Math.floor(Math.random() * (this.fragment.length+1 - min) + min);
    return this;
  }
  // Shuffle array [1,2,3] => [2,1,3] and etc...
  shuffle() {
    this.fragment.sort((a, b) => Math.random() < .5 ? -1 : 1);
    return this;
  }
  // Adds a block to the random location of the array: [A,A,A] => [B,A,A] and etc...
  randomAppend(id) {
    this.fragment[Math.floor(Math.random()*this.fragment.length)] = id;
    return this;
  }
}

module.exports = MapFragment;

},{}],9:[function(require,module,exports){
module.exports={
  "A": {
    "image": "assets/cells/cell1.png"
  },
  "B": {
    "image": "assets/cells/cell2.png"
  },
  "C": {
    "image": "assets/cells/cell4.png"
  }
}

},{}],10:[function(require,module,exports){
const TILE_TYPES = require('./TYLE_TYPES');
const MapFragment = require('./MapFragment');
const Block = require('./Block');

class TileMap extends PIXI.Container {
  constructor(scene, tilesize=100, maxX=5) {
    super();

    this.TILE_SIZE = tilesize;
    this.MAX_X = maxX;
    this.lastIndex = 0;
  }
  addFragment(map) {
    for(let y = 0; y < map.length; y++) {
      let frag = new MapFragment(map[y]);

      for(let x = 0; x < frag.length; x++) {
        let posX = Math.round((this.MAX_X-frag.length)/2)*this.TILE_SIZE+x*this.TILE_SIZE;
        let posY = y*this.TILE_SIZE-this.lastIndex*this.TILE_SIZE;

        this.addChild(new Block(this, posX, posY, TILE_TYPES[frag[x]]));
      }
    }
    this.lastIndex += map.length;
  }
  update(dt) {
    for(let i = 0; i < this.children.length; i++) {
      this.children[i].update(dt);
    }
  }
}

module.exports = TileMap;

},{"./Block":7,"./MapFragment":8,"./TYLE_TYPES":9}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9mcmFnbWVudHMuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9nYW1lLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvaW5kZXguanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9tYW5hZ2Vycy9TY2VuZXNNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc2NlbmVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zY2VuZXMvaW5kZXguanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy90aWxlbWFwL0Jsb2NrLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvdGlsZW1hcC9NYXBGcmFnbWVudC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3RpbGVtYXAvVFlMRV9UWVBFUy5qc29uIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvdGlsZW1hcC9UaWxlTWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cy5BID0gW1xyXG4gIHtcclxuICAgIG1hcDogWydBfEInLCAnQScsICdBfEInLCAnQScsICdBfEInLCAnQSddLFxyXG4gICAgdHJpbTogMyxcclxuICAgIGFwcGVuZDogJ0MnLFxyXG4gICAgc2h1ZmZsZTogdHJ1ZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbWFwOiBbJ0EnLCAnQScsICdCJywgJ0InLCAnQicsICdCJ10sXHJcbiAgICB0cmltOiA0LFxyXG4gICAgc2h1ZmZsZTogdHJ1ZVxyXG4gIH1cclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLkIgPSBbXHJcbiAge1xyXG4gICAgbWFwOiBbJ0EnLCAnQXxCJywgJ0F8QicsICdBfEInLCAnQXxCJywgJ0F8QiddLFxyXG4gICAgc2h1ZmZsZTogdHJ1ZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbWFwOiBbJ0InLCAnQicsICdCJywgJ0InLCAnQicsICdCJ10sXHJcbiAgICB0cmltOiA0LFxyXG4gICAgYXBwZW5kOiAnQSdcclxuICB9XHJcbl1cclxuIiwiY29uc3QgU2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4vbWFuYWdlcnMvU2NlbmVzTWFuYWdlcicpO1xyXG5cclxuY2xhc3MgR2FtZSBleHRlbmRzIFBJWEkuQXBwbGljYXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCwge2JhY2tncm91bmRDb2xvcjogMHhmY2ZjZmN9KVxyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xyXG5cclxuICAgIHRoaXMudyA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgdGhpcy5oID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuICAgIHRoaXMuc2NlbmVzTWFuYWdlciA9IG5ldyBTY2VuZXNNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLnNjZW5lc01hbmFnZXIpO1xyXG5cclxuICAgIHRoaXMuX2luaXRUaWNrZXIoKTtcclxuICB9XHJcbiAgX2luaXRUaWNrZXIoKSB7XHJcbiAgICB0aGlzLnRpY2tlci5hZGQoKGR0KSA9PiB7XHJcbiAgICAgIHRoaXMuc2NlbmVzTWFuYWdlci51cGRhdGUoZHQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcbiIsImNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKTtcclxuXHJcbmxldCBnYW1lID0gbmV3IEdhbWUoKTtcclxuY29uc29sZS5sb2coZ2FtZS5zY2VuZXNNYW5hZ2VyLnRvZ2dsZVNjZW5lKCdwbGF5Z3JvdW5kJykpO1xyXG5cclxud2luZG93LmdhbWUgPSBnYW1lO1xyXG4iLCJjb25zdCBzY2VuZXMgPSByZXF1aXJlKCcuLi9zY2VuZXMnKTtcclxuXHJcbmNsYXNzIFNjZW5lc01hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgdGhpcy5hZGRTY2VuZXMoc2NlbmVzKTtcclxuICB9XHJcbiAgYWRkU2NlbmVzKHNjZW5lcykge1xyXG4gICAgZm9yKGxldCBpZCBpbiBzY2VuZXMpIHtcclxuICAgICAgdGhpcy5hZGRTY2VuZShzY2VuZXNbaWRdLCBpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFkZFNjZW5lKFNjZW5lQ2xhc3MsIGlkKSB7XHJcbiAgICBsZXQgc2NlbmUgPSBuZXcgU2NlbmVDbGFzcyh0aGlzLmdhbWUsIHRoaXMpO1xyXG4gICAgc2NlbmUuX2lkID0gaWQ7XHJcbiAgICByZXR1cm4gdGhpcy5hZGRDaGlsZChzY2VuZSk7XHJcbiAgfVxyXG4gIGdldFNjZW5lKGlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maW5kKChzY2VuZSkgPT4gc2NlbmUuX2lkID09PSBpZCk7XHJcbiAgfVxyXG4gIHRvZ2dsZVNjZW5lKGlkKSB7XHJcbiAgICBpZih0aGlzLmFjdGl2ZVNjZW5lKSB0aGlzLmFjdGl2ZVNjZW5lLnZpc2libGUgPSBmYWxzZTtcclxuICAgIHRoaXMuYWN0aXZlU2NlbmUgPSB0aGlzLmdldFNjZW5lKGlkKTtcclxuICAgIHRoaXMuYWN0aXZlU2NlbmUudmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlU2NlbmU7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xyXG4iLCJjb25zdCBUaWxlTWFwID0gcmVxdWlyZSgnLi4vdGlsZW1hcC9UaWxlTWFwLmpzJyk7XHJcbmNvbnN0IGZyYWdtZW50cyA9IHJlcXVpcmUoJy4uL2ZyYWdtZW50cy5qcycpO1xyXG5cclxuY2xhc3MgUGxheWdyb3VuZCBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLnRpbGVNYXAgPSBuZXcgVGlsZU1hcCh0aGlzLCAxMDAsIDYpO1xyXG4gICAgdGhpcy50aWxlTWFwLnggPSB0aGlzLmdhbWUudy8yLTEwMCo2LzI7XHJcblxyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLnRpbGVNYXApO1xyXG5cclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgdGhpcy50aWxlTWFwLmFkZEZyYWdtZW50KGZyYWdtZW50cy5BKTtcclxuICAgIH0sIDUwMCk7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy50aWxlTWFwLnVwZGF0ZShkdCk7XHJcbiAgICB0aGlzLnRpbGVNYXAueSArPSA1ICogZHQ7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXlncm91bmQ7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICdwbGF5Z3JvdW5kJzogcmVxdWlyZSgnLi9QbGF5Z3JvdW5kJylcclxufVxyXG4iLCJjbGFzcyBCbG9jayBleHRlbmRzIFBJWEkuU3ByaXRlIHtcclxuICBjb25zdHJ1Y3Rvcih0aWxlTWFwLCB4LCB5LCBwYXJhbXMpIHtcclxuICAgIHN1cGVyKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UocGFyYW1zLmltYWdlKSk7XHJcblxyXG4gICAgdGhpcy50aWxlTWFwID0gdGlsZU1hcDtcclxuXHJcbiAgICB0aGlzLmFuY2hvci5zZXQoLjUpO1xyXG4gICAgdGhpcy53aWR0aCA9IHRpbGVNYXAuVElMRV9TSVpFO1xyXG4gICAgdGhpcy5oZWlnaHQgPSB0aWxlTWFwLlRJTEVfU0laRTtcclxuICAgIHRoaXMueCA9IHgrdGlsZU1hcC5USUxFX1NJWkUvMjtcclxuICAgIHRoaXMueSA9IHkrdGlsZU1hcC5USUxFX1NJWkUvMjtcclxuICB9XHJcbiAgdXBkYXRlKGR0KSB7XHJcbiAgICBpZih0aGlzLndvcmxkVHJhbnNmb3JtLnR5LXRoaXMudGlsZU1hcC5USUxFX1NJWkUvMiA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xyXG4gICAgICB0aGlzLnRpbGVNYXAucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG4iLCJjbGFzcyBNYXBGcmFnbWVudCB7XHJcbiAgY29uc3RydWN0b3IoZGF0YSkge1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMuaW5wdXRNYXAgPSBkYXRhLm1hcDtcclxuICAgIHRoaXMuZnJhZ21lbnQgPSBbXTtcclxuXHJcblxyXG4gICAgLy8gT1BFUkFUT1JTXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZGF0YS5tYXAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYofn5kYXRhLm1hcFtpXS5pbmRleE9mKCd8JykpIHRoaXMuY2FzZU9wZXJhdG9yKGRhdGEubWFwW2ldLCBpKTtcclxuICAgICAgZWxzZSB0aGlzLmZyYWdtZW50W2ldID0gZGF0YS5tYXBbaV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTUVUSE9EU1xyXG4gICAgZGF0YS50cmltICYmIHRoaXMucmFuZG9tVHJpbShkYXRhLnRyaW0pO1xyXG4gICAgZGF0YS5hcHBlbmQgJiYgdGhpcy5yYW5kb21BcHBlbmQoZGF0YS5hcHBlbmQpO1xyXG4gICAgZGF0YS5zaHVmZmxlICYmIHRoaXMuc2h1ZmZsZSgpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmZyYWdtZW50O1xyXG4gIH1cclxuICAvLyBPUEVSQVRPUlNcclxuICAvLyBDYXNlIG9wZXJhdG9yOiAnQXxCfEN8RCcgPT4gQyBhbmQgZXRjLi4uXHJcbiAgY2FzZU9wZXJhdG9yKHN0ciwgaSkge1xyXG4gICAgbGV0IGlkcyA9IHN0ci5zcGxpdCgnfCcpO1xyXG4gICAgdGhpcy5mcmFnbWVudFtpXSA9IGlkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqaWRzLmxlbmd0aCldO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyBNRVRIT0RTXHJcbiAgLy8gVHJpbW1pbmcgYXJyYXkgaW4gcmFuZ2UgMC4ucmFuZChtaW4sIGxlbmd0aClcclxuICByYW5kb21UcmltKG1pbikge1xyXG4gICAgdGhpcy5mcmFnbWVudC5sZW5ndGggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodGhpcy5mcmFnbWVudC5sZW5ndGgrMSAtIG1pbikgKyBtaW4pO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIC8vIFNodWZmbGUgYXJyYXkgWzEsMiwzXSA9PiBbMiwxLDNdIGFuZCBldGMuLi5cclxuICBzaHVmZmxlKCkge1xyXG4gICAgdGhpcy5mcmFnbWVudC5zb3J0KChhLCBiKSA9PiBNYXRoLnJhbmRvbSgpIDwgLjUgPyAtMSA6IDEpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIC8vIEFkZHMgYSBibG9jayB0byB0aGUgcmFuZG9tIGxvY2F0aW9uIG9mIHRoZSBhcnJheTogW0EsQSxBXSA9PiBbQixBLEFdIGFuZCBldGMuLi5cclxuICByYW5kb21BcHBlbmQoaWQpIHtcclxuICAgIHRoaXMuZnJhZ21lbnRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnRoaXMuZnJhZ21lbnQubGVuZ3RoKV0gPSBpZDtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXBGcmFnbWVudDtcclxuIiwibW9kdWxlLmV4cG9ydHM9e1xyXG4gIFwiQVwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiYXNzZXRzL2NlbGxzL2NlbGwxLnBuZ1wiXHJcbiAgfSxcclxuICBcIkJcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImFzc2V0cy9jZWxscy9jZWxsMi5wbmdcIlxyXG4gIH0sXHJcbiAgXCJDXCI6IHtcclxuICAgIFwiaW1hZ2VcIjogXCJhc3NldHMvY2VsbHMvY2VsbDQucG5nXCJcclxuICB9XHJcbn1cclxuIiwiY29uc3QgVElMRV9UWVBFUyA9IHJlcXVpcmUoJy4vVFlMRV9UWVBFUycpO1xyXG5jb25zdCBNYXBGcmFnbWVudCA9IHJlcXVpcmUoJy4vTWFwRnJhZ21lbnQnKTtcclxuY29uc3QgQmxvY2sgPSByZXF1aXJlKCcuL0Jsb2NrJyk7XHJcblxyXG5jbGFzcyBUaWxlTWFwIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lLCB0aWxlc2l6ZT0xMDAsIG1heFg9NSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLlRJTEVfU0laRSA9IHRpbGVzaXplO1xyXG4gICAgdGhpcy5NQVhfWCA9IG1heFg7XHJcbiAgICB0aGlzLmxhc3RJbmRleCA9IDA7XHJcbiAgfVxyXG4gIGFkZEZyYWdtZW50KG1hcCkge1xyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IG1hcC5sZW5ndGg7IHkrKykge1xyXG4gICAgICBsZXQgZnJhZyA9IG5ldyBNYXBGcmFnbWVudChtYXBbeV0pO1xyXG5cclxuICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IGZyYWcubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICBsZXQgcG9zWCA9IE1hdGgucm91bmQoKHRoaXMuTUFYX1gtZnJhZy5sZW5ndGgpLzIpKnRoaXMuVElMRV9TSVpFK3gqdGhpcy5USUxFX1NJWkU7XHJcbiAgICAgICAgbGV0IHBvc1kgPSB5KnRoaXMuVElMRV9TSVpFLXRoaXMubGFzdEluZGV4KnRoaXMuVElMRV9TSVpFO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkKG5ldyBCbG9jayh0aGlzLCBwb3NYLCBwb3NZLCBUSUxFX1RZUEVTW2ZyYWdbeF1dKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMubGFzdEluZGV4ICs9IG1hcC5sZW5ndGg7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaWxlTWFwO1xyXG4iXX0=
