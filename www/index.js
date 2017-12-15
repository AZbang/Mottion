(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "A": {
    "image": "cell1.png"
  },
  "B": {
    "image": "cell2.png"
  },
  "C": {
    "image": "cell4.png"
  },
  "ITL": {
    "image": "assets/island/islandTL.png"
  },
  "IT": {
    "image": "assets/island/islandT.png"
  },
  "ITR": {
    "image": "assets/island/islandTR.png"
  },
  "IR": {
    "image": "assets/island/islandR.png"
  },
  "IBR": {
    "image": "assets/island/islandBR.png"
  },
  "IB": {
    "image": "assets/island/islandB.png"
  },
  "IBL": {
    "image": "assets/island/islandBL.png"
  },
  "IL": {
    "image": "assets/island/islandL.png"
  },
  "IC": {
    "image": "assets/island/islandC.png"
  }
}

},{}],2:[function(require,module,exports){
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

module.exports.island = [
  {
    map: ['A', 'B', 'A', 'B', 'A', 'A'],
    shuffle: true
  },
  {
    map: ['A', 'A', 'A', 'A', 'A', 'A'],
  },
  {
    map: ['ITL', 'IT', 'ITR', 'ITL', 'IT', 'ITR'],
  },
  {
    map: ['IL', 'IC', 'IR', 'IL', 'IC', 'IR'],
  },
  {
    map: ['IBL', 'IB', 'IBR', 'IBL', 'IB', 'IBR'],
  }
];

},{}],3:[function(require,module,exports){
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

},{"./managers/ScenesManager":5}],4:[function(require,module,exports){
const Game = require('./game');

PIXI.loader
  .add('blocks', 'assets/blocks.json')
  .load((loader, resources) => {
    console.log(PIXI.loader.resources);
    let game = new Game();
    window.game = game;
  });

},{"./game":3}],5:[function(require,module,exports){
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

},{"../scenes":7}],6:[function(require,module,exports){
const TileMap = require('../tilemap/TileMap.js');
const fragments = require('../content/fragments.js');

class Playground extends PIXI.Container {
  constructor(game) {
    super();

    this.game = game;
    this.tileMap = new TileMap(this, 100, 6);
    this.tileMap.x = this.game.w/2-100*6/2;

    this.addChild(this.tileMap);

    setInterval(() => {
      if(Math.random() < .8) this.tileMap.addFragment(fragments.A);
      else {
        this.tileMap.addFragment(fragments.island);
        this.tileMap.addFragment(fragments.A);
      }
    }, 500);
  }
  update(dt) {
    this.tileMap.update(dt);
    this.tileMap.y += 5 * dt;
  }
}

module.exports = Playground;

},{"../content/fragments.js":2,"../tilemap/TileMap.js":10}],7:[function(require,module,exports){
module.exports = {
  'playground': require('./Playground')
}

},{"./Playground":6}],8:[function(require,module,exports){
class Block extends PIXI.Sprite {
  constructor(tileMap, x, y, params={}) {
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
const TILE_TYPES = require('../content/TILE_TYPES');
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
        if(frag[x] === '_') continue;

        let posX = Math.round((this.MAX_X-frag.length)/2)*this.TILE_SIZE+x*this.TILE_SIZE;
        let posY = y*this.TILE_SIZE-this.lastIndex*this.TILE_SIZE-map.length*this.TILE_SIZE;

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

},{"../content/TILE_TYPES":1,"./Block":8,"./MapFragment":9}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9jb250ZW50L1RJTEVfVFlQRVMuanNvbiIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2NvbnRlbnQvZnJhZ21lbnRzLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvZ2FtZS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2luZGV4LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvU2NlbmVzTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3NjZW5lcy9QbGF5Z3JvdW5kLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc2NlbmVzL2luZGV4LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvdGlsZW1hcC9CbG9jay5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3RpbGVtYXAvTWFwRnJhZ21lbnQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy90aWxlbWFwL1RpbGVNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPXtcclxuICBcIkFcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGwxLnBuZ1wiXHJcbiAgfSxcclxuICBcIkJcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGwyLnBuZ1wiXHJcbiAgfSxcclxuICBcIkNcIjoge1xyXG4gICAgXCJpbWFnZVwiOiBcImNlbGw0LnBuZ1wiXHJcbiAgfSxcclxuICBcIklUTFwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiYXNzZXRzL2lzbGFuZC9pc2xhbmRUTC5wbmdcIlxyXG4gIH0sXHJcbiAgXCJJVFwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiYXNzZXRzL2lzbGFuZC9pc2xhbmRULnBuZ1wiXHJcbiAgfSxcclxuICBcIklUUlwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiYXNzZXRzL2lzbGFuZC9pc2xhbmRUUi5wbmdcIlxyXG4gIH0sXHJcbiAgXCJJUlwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiYXNzZXRzL2lzbGFuZC9pc2xhbmRSLnBuZ1wiXHJcbiAgfSxcclxuICBcIklCUlwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiYXNzZXRzL2lzbGFuZC9pc2xhbmRCUi5wbmdcIlxyXG4gIH0sXHJcbiAgXCJJQlwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiYXNzZXRzL2lzbGFuZC9pc2xhbmRCLnBuZ1wiXHJcbiAgfSxcclxuICBcIklCTFwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiYXNzZXRzL2lzbGFuZC9pc2xhbmRCTC5wbmdcIlxyXG4gIH0sXHJcbiAgXCJJTFwiOiB7XHJcbiAgICBcImltYWdlXCI6IFwiYXNzZXRzL2lzbGFuZC9pc2xhbmRMLnBuZ1wiXHJcbiAgfSxcclxuICBcIklDXCI6IHtcclxuICAgIFwiaW1hZ2VcIjogXCJhc3NldHMvaXNsYW5kL2lzbGFuZEMucG5nXCJcclxuICB9XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMuQSA9IFtcclxuICB7XHJcbiAgICBtYXA6IFsnQXxCJywgJ0EnLCAnQXxCJywgJ0EnLCAnQXxCJywgJ0EnXSxcclxuICAgIHRyaW06IDMsXHJcbiAgICBhcHBlbmQ6ICdDJyxcclxuICAgIHNodWZmbGU6IHRydWVcclxuICB9LFxyXG4gIHtcclxuICAgIG1hcDogWydBJywgJ0EnLCAnQicsICdCJywgJ0InLCAnQiddLFxyXG4gICAgdHJpbTogNCxcclxuICAgIHNodWZmbGU6IHRydWVcclxuICB9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5pc2xhbmQgPSBbXHJcbiAge1xyXG4gICAgbWFwOiBbJ0EnLCAnQicsICdBJywgJ0InLCAnQScsICdBJ10sXHJcbiAgICBzaHVmZmxlOiB0cnVlXHJcbiAgfSxcclxuICB7XHJcbiAgICBtYXA6IFsnQScsICdBJywgJ0EnLCAnQScsICdBJywgJ0EnXSxcclxuICB9LFxyXG4gIHtcclxuICAgIG1hcDogWydJVEwnLCAnSVQnLCAnSVRSJywgJ0lUTCcsICdJVCcsICdJVFInXSxcclxuICB9LFxyXG4gIHtcclxuICAgIG1hcDogWydJTCcsICdJQycsICdJUicsICdJTCcsICdJQycsICdJUiddLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbWFwOiBbJ0lCTCcsICdJQicsICdJQlInLCAnSUJMJywgJ0lCJywgJ0lCUiddLFxyXG4gIH1cclxuXTtcclxuIiwiY29uc3QgU2NlbmVzTWFuYWdlciA9IHJlcXVpcmUoJy4vbWFuYWdlcnMvU2NlbmVzTWFuYWdlcicpO1xyXG5cclxuY2xhc3MgR2FtZSBleHRlbmRzIFBJWEkuQXBwbGljYXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCwge2JhY2tncm91bmRDb2xvcjogMHhmY2ZjZmN9KVxyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xyXG5cclxuICAgIHRoaXMudyA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgdGhpcy5oID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuICAgIHRoaXMuc2NlbmVzTWFuYWdlciA9IG5ldyBTY2VuZXNNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLnNjZW5lc01hbmFnZXIpO1xyXG5cclxuICAgIHRoaXMuX2luaXRUaWNrZXIoKTtcclxuICB9XHJcbiAgX2luaXRUaWNrZXIoKSB7XHJcbiAgICB0aGlzLnRpY2tlci5hZGQoKGR0KSA9PiB7XHJcbiAgICAgIHRoaXMuc2NlbmVzTWFuYWdlci51cGRhdGUoZHQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcbiIsImNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKTtcclxuXHJcblBJWEkubG9hZGVyXHJcbiAgLmFkZCgnYmxvY2tzJywgJ2Fzc2V0cy9ibG9ja3MuanNvbicpXHJcbiAgLmxvYWQoKGxvYWRlciwgcmVzb3VyY2VzKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhQSVhJLmxvYWRlci5yZXNvdXJjZXMpO1xyXG4gICAgbGV0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG4gICAgd2luZG93LmdhbWUgPSBnYW1lO1xyXG4gIH0pO1xyXG4iLCJjb25zdCBzY2VuZXMgPSByZXF1aXJlKCcuLi9zY2VuZXMnKTtcclxuXHJcbmNsYXNzIFNjZW5lc01hbmFnZXIgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lciB7XHJcbiAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgdGhpcy5hZGRTY2VuZXMoc2NlbmVzKTtcclxuICB9XHJcbiAgYWRkU2NlbmVzKHNjZW5lcykge1xyXG4gICAgZm9yKGxldCBpZCBpbiBzY2VuZXMpIHtcclxuICAgICAgdGhpcy5hZGRTY2VuZShzY2VuZXNbaWRdLCBpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFkZFNjZW5lKFNjZW5lQ2xhc3MsIGlkKSB7XHJcbiAgICBsZXQgc2NlbmUgPSBuZXcgU2NlbmVDbGFzcyh0aGlzLmdhbWUsIHRoaXMpO1xyXG4gICAgc2NlbmUuX2lkID0gaWQ7XHJcbiAgICByZXR1cm4gdGhpcy5hZGRDaGlsZChzY2VuZSk7XHJcbiAgfVxyXG4gIGdldFNjZW5lKGlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maW5kKChzY2VuZSkgPT4gc2NlbmUuX2lkID09PSBpZCk7XHJcbiAgfVxyXG4gIHRvZ2dsZVNjZW5lKGlkKSB7XHJcbiAgICBpZih0aGlzLmFjdGl2ZVNjZW5lKSB0aGlzLmFjdGl2ZVNjZW5lLnZpc2libGUgPSBmYWxzZTtcclxuICAgIHRoaXMuYWN0aXZlU2NlbmUgPSB0aGlzLmdldFNjZW5lKGlkKTtcclxuICAgIHRoaXMuYWN0aXZlU2NlbmUudmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlU2NlbmU7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZXNNYW5hZ2VyO1xyXG4iLCJjb25zdCBUaWxlTWFwID0gcmVxdWlyZSgnLi4vdGlsZW1hcC9UaWxlTWFwLmpzJyk7XHJcbmNvbnN0IGZyYWdtZW50cyA9IHJlcXVpcmUoJy4uL2NvbnRlbnQvZnJhZ21lbnRzLmpzJyk7XHJcblxyXG5jbGFzcyBQbGF5Z3JvdW5kIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuICAgIHRoaXMudGlsZU1hcCA9IG5ldyBUaWxlTWFwKHRoaXMsIDEwMCwgNik7XHJcbiAgICB0aGlzLnRpbGVNYXAueCA9IHRoaXMuZ2FtZS53LzItMTAwKjYvMjtcclxuXHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMudGlsZU1hcCk7XHJcblxyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBpZihNYXRoLnJhbmRvbSgpIDwgLjgpIHRoaXMudGlsZU1hcC5hZGRGcmFnbWVudChmcmFnbWVudHMuQSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMudGlsZU1hcC5hZGRGcmFnbWVudChmcmFnbWVudHMuaXNsYW5kKTtcclxuICAgICAgICB0aGlzLnRpbGVNYXAuYWRkRnJhZ21lbnQoZnJhZ21lbnRzLkEpO1xyXG4gICAgICB9XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIHRoaXMudGlsZU1hcC51cGRhdGUoZHQpO1xyXG4gICAgdGhpcy50aWxlTWFwLnkgKz0gNSAqIGR0O1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Z3JvdW5kO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAncGxheWdyb3VuZCc6IHJlcXVpcmUoJy4vUGxheWdyb3VuZCcpXHJcbn1cclxuIiwiY2xhc3MgQmxvY2sgZXh0ZW5kcyBQSVhJLlNwcml0ZSB7XHJcbiAgY29uc3RydWN0b3IodGlsZU1hcCwgeCwgeSwgcGFyYW1zPXt9KSB7XHJcbiAgICBzdXBlcihQSVhJLlRleHR1cmUuZnJvbUltYWdlKHBhcmFtcy5pbWFnZSkpO1xyXG5cclxuICAgIHRoaXMudGlsZU1hcCA9IHRpbGVNYXA7XHJcblxyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuICAgIHRoaXMud2lkdGggPSB0aWxlTWFwLlRJTEVfU0laRTtcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGlsZU1hcC5USUxFX1NJWkU7XHJcbiAgICB0aGlzLnggPSB4K3RpbGVNYXAuVElMRV9TSVpFLzI7XHJcbiAgICB0aGlzLnkgPSB5K3RpbGVNYXAuVElMRV9TSVpFLzI7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgaWYodGhpcy53b3JsZFRyYW5zZm9ybS50eS10aGlzLnRpbGVNYXAuVElMRV9TSVpFLzIgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgdGhpcy50aWxlTWFwLnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCbG9jaztcclxuIiwiY2xhc3MgTWFwRnJhZ21lbnQge1xyXG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB0aGlzLmlucHV0TWFwID0gZGF0YS5tYXA7XHJcbiAgICB0aGlzLmZyYWdtZW50ID0gW107XHJcblxyXG5cclxuICAgIC8vIE9QRVJBVE9SU1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGRhdGEubWFwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKH5+ZGF0YS5tYXBbaV0uaW5kZXhPZignfCcpKSB0aGlzLmNhc2VPcGVyYXRvcihkYXRhLm1hcFtpXSwgaSk7XHJcbiAgICAgIGVsc2UgdGhpcy5mcmFnbWVudFtpXSA9IGRhdGEubWFwW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1FVEhPRFNcclxuICAgIGRhdGEudHJpbSAmJiB0aGlzLnJhbmRvbVRyaW0oZGF0YS50cmltKTtcclxuICAgIGRhdGEuYXBwZW5kICYmIHRoaXMucmFuZG9tQXBwZW5kKGRhdGEuYXBwZW5kKTtcclxuICAgIGRhdGEuc2h1ZmZsZSAmJiB0aGlzLnNodWZmbGUoKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5mcmFnbWVudDtcclxuICB9XHJcbiAgLy8gT1BFUkFUT1JTXHJcbiAgLy8gQ2FzZSBvcGVyYXRvcjogJ0F8QnxDfEQnID0+IEMgYW5kIGV0Yy4uLlxyXG4gIGNhc2VPcGVyYXRvcihzdHIsIGkpIHtcclxuICAgIGxldCBpZHMgPSBzdHIuc3BsaXQoJ3wnKTtcclxuICAgIHRoaXMuZnJhZ21lbnRbaV0gPSBpZHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmlkcy5sZW5ndGgpXTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gTUVUSE9EU1xyXG4gIC8vIFRyaW1taW5nIGFycmF5IGluIHJhbmdlIDAuLnJhbmQobWluLCBsZW5ndGgpXHJcbiAgcmFuZG9tVHJpbShtaW4pIHtcclxuICAgIHRoaXMuZnJhZ21lbnQubGVuZ3RoID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRoaXMuZnJhZ21lbnQubGVuZ3RoKzEgLSBtaW4pICsgbWluKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICAvLyBTaHVmZmxlIGFycmF5IFsxLDIsM10gPT4gWzIsMSwzXSBhbmQgZXRjLi4uXHJcbiAgc2h1ZmZsZSgpIHtcclxuICAgIHRoaXMuZnJhZ21lbnQuc29ydCgoYSwgYikgPT4gTWF0aC5yYW5kb20oKSA8IC41ID8gLTEgOiAxKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICAvLyBBZGRzIGEgYmxvY2sgdG8gdGhlIHJhbmRvbSBsb2NhdGlvbiBvZiB0aGUgYXJyYXk6IFtBLEEsQV0gPT4gW0IsQSxBXSBhbmQgZXRjLi4uXHJcbiAgcmFuZG9tQXBwZW5kKGlkKSB7XHJcbiAgICB0aGlzLmZyYWdtZW50W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSp0aGlzLmZyYWdtZW50Lmxlbmd0aCldID0gaWQ7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwRnJhZ21lbnQ7XHJcbiIsImNvbnN0IFRJTEVfVFlQRVMgPSByZXF1aXJlKCcuLi9jb250ZW50L1RJTEVfVFlQRVMnKTtcclxuY29uc3QgTWFwRnJhZ21lbnQgPSByZXF1aXJlKCcuL01hcEZyYWdtZW50Jyk7XHJcbmNvbnN0IEJsb2NrID0gcmVxdWlyZSgnLi9CbG9jaycpO1xyXG5cclxuY2xhc3MgVGlsZU1hcCBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcclxuICBjb25zdHJ1Y3RvcihzY2VuZSwgdGlsZXNpemU9MTAwLCBtYXhYPTUpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5USUxFX1NJWkUgPSB0aWxlc2l6ZTtcclxuICAgIHRoaXMuTUFYX1ggPSBtYXhYO1xyXG4gICAgdGhpcy5sYXN0SW5kZXggPSAwO1xyXG4gIH1cclxuICBhZGRGcmFnbWVudChtYXApIHtcclxuICAgIGZvcihsZXQgeSA9IDA7IHkgPCBtYXAubGVuZ3RoOyB5KyspIHtcclxuICAgICAgbGV0IGZyYWcgPSBuZXcgTWFwRnJhZ21lbnQobWFwW3ldKTtcclxuXHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCBmcmFnLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgaWYoZnJhZ1t4XSA9PT0gJ18nKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgbGV0IHBvc1ggPSBNYXRoLnJvdW5kKCh0aGlzLk1BWF9YLWZyYWcubGVuZ3RoKS8yKSp0aGlzLlRJTEVfU0laRSt4KnRoaXMuVElMRV9TSVpFO1xyXG4gICAgICAgIGxldCBwb3NZID0geSp0aGlzLlRJTEVfU0laRS10aGlzLmxhc3RJbmRleCp0aGlzLlRJTEVfU0laRS1tYXAubGVuZ3RoKnRoaXMuVElMRV9TSVpFO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkKG5ldyBCbG9jayh0aGlzLCBwb3NYLCBwb3NZLCBUSUxFX1RZUEVTW2ZyYWdbeF1dKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMubGFzdEluZGV4ICs9IG1hcC5sZW5ndGg7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5jaGlsZHJlbltpXS51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaWxlTWFwO1xyXG4iXX0=
