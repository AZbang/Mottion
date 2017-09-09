(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Boot = require('./states/Boot.js');
const Preload = require('./states/Preload.js');
const Menu = require('./states/Menu.js');
const Playground = require('./states/Playground.js');

var ready = () => {
	var game = new Phaser.Game(720, 1280, Phaser.AUTO, 'Mottion');

	game.state.add('Boot', Boot, true);
  game.state.add('Preload', Preload);
  game.state.add('Menu', Menu);
	game.state.add('Playground', Playground);
}

ready();

},{"./states/Boot.js":10,"./states/Menu.js":11,"./states/Playground.js":12,"./states/Preload.js":13}],2:[function(require,module,exports){
const Cell = require('../objects/Cell');
const types = require('../objects/types');
types.sort((a, b) => a.chance - b.chance);


class CellsManager extends Phaser.Group {
  constructor(state) {
    super(state.game);

    this.enableBody = true;

    this.sizeCell = state.game.width/5;
    this.lastY = 0;
    this.last = [];

    this.state = state;
    this.createCells(15);
  }
  createCells(amtGenY) {
    let arr = [];

    for(let y = this.lastY; y < this.lastY+amtGenY; y++) {
      for(let x = 0; x < 5; x++) {
        let rand = Math.random()*100;
        for(let i = 0; i < types.length; i++) {
           if(rand < types[i].chance) {
             let cell = new Cell(this, types[i], x, y);
             this.add(cell);
             arr.push(cell);
             break;
           }
        }
      }
    }
    for(let y = 0; y < amtGenY; y++) {
      for(let x = 0; x < 5; x++) {
        if(y+1 < amtGenY) arr[y*5+x].topPanel = arr[(y+1)*5+x];
        if(x-1 >= 0) arr[y*5+x].leftPanel = arr[y*5+x-1];
        if(x+1 < 5)  arr[y*5+x].rightPanel = arr[y*5+x+1];
      }
    }
    if(this.last.length) {
      for(let x = 0; x < 5; x++) {
        this.last[x].topPanel = arr[x];
      }
    }
    this.last[0] = arr[arr.length-5];
    this.last[1] = arr[arr.length-4];
    this.last[2] = arr[arr.length-3];
    this.last[3] = arr[arr.length-2];
    this.last[4] = arr[arr.length-1];
    this.lastY += amtGenY;
  }
  update(dt) {
    let isHide = false;
    this.forEach((cell) => {
      if(cell.y > this.state.player.y+this.state.game.height-400) {
        cell.leftPanel = null;
        cell.rightPanel = null;
        cell.topPanel = null;
        cell.destroy();
        !isHide && this.createCells(1);
        isHide = true;
      }
    });
  }
}

module.exports = CellsManager;

},{"../objects/Cell":6,"../objects/types":9}],3:[function(require,module,exports){
class CloudsManager extends Phaser.Group {
  constructor(state) {
    super(state.game);
    this.state = state;

    this.lastY = 0;

    this.timer = this.state.time.create(false);
    this.timer.loop(1000, this.createCloud, this);
    this.timer.start();
  }
  createCloud() {
    this.lastY -= this.state.rnd.between(this.state.game.height, this.state.game.height*2);

    let cloud;
    if(Math.random() < .5) {
  		cloud = this.add(this.state.make.sprite(0, this.lastY, 'cloud1'));
  		cloud.width = this.state.game.width-100;
  		cloud.height = 400;
    } else {
      cloud = this.add(this.state.make.sprite(100, this.lastY, 'cloud1'));
      cloud.width = this.state.game.width-100;
      cloud.height = 400;
      cloud.anchor.set(1);
      cloud.scale.x *= -1;
    }

    cloud.duration = Math.random()*2;
    cloud.alpha = this.state.rnd.between(.5, 1);
  }
  update(dt) {
    this.forEach((cloud) => {
      cloud.y += cloud.duration;
      if(cloud.y > this.state.player.y+this.state.game.height-400)
        cloud.destroy();
    });
  }
}

module.exports = CloudsManager;

},{}],4:[function(require,module,exports){
const Entity = require('../objects/Entity');

class IslandManager extends Phaser.Group {
  constructor(state) {
    super(state.game);
    this.state = state;

    this.island = this.create(0, this.state.game.height+10, 'island');
    this.island.anchor.set(0, 1);
    this.island.width = this.state.cellsManager.sizeCell*5;
    this.island.height = this.state.cellsManager.sizeCell*5;
    this.island.tint = 0xff4444; 0x00d461

    this.create(200, this.state.game.height-256, 'flag');
    this.create(600, this.state.game.height-356, 'flag').scale.x *= -1;
    this.create(400, this.state.game.height-400, 'flag').scale.x *= -1;
    this.create(100, this.state.game.height-300, 'flag');

    for(let y = 0; y < 4; y++) {
      for(let x = 0; x < this.state.game.width/50; x++) {
        if(Math.random() < .3) continue;
        let px = x*50;
        let py = this.state.game.height-y*50;
        this.add(new Entity(this.state, px, py, this.state.rnd.between(30, 50), false));
      }
    }
  }
}

module.exports = IslandManager;

},{"../objects/Entity":7}],5:[function(require,module,exports){
module.exports = {
  createBg(state, size=100, ax=20, ay=20) {
    let bg = state.add.graphics();
    bg.beginFill(0xFFFFFF, 1);
    bg.drawRect(0, 0, state.game.width, state.game.height);
    bg.endFill();

    bg.lineStyle(4, 0x2e2e44, .1);

    for(let x = 0; x < ax; x++) {
      bg.moveTo(size*x, 0);
      bg.lineTo(size*x, state.game.height);
    }
    for(let y = 0; y < ay; y++) {
      bg.moveTo(0, size*y);
      bg.lineTo(state.game.width, size*y);
    }
    return bg;
  },
  goTo(state, name, args) {
    state.camera.fade(0xFFFFFF);
    state.camera.onFadeComplete.add(() => {
      state.state.start(name, true, false, args);
      state.state.getCurrentState().camera.flash(0xFFFFFF, 1000);
    });
  }
}

},{}],6:[function(require,module,exports){
const types = require('./types');

class Cell extends Phaser.Sprite {
  constructor(manager, type, x, y) {
    super(manager.game, 0, 0, type.img);

    this.manager = manager;
    this.state = manager.state;

    this.size = this.state.game.width/5;
    this.padding = 10;
    this.x = x*this.size+this.padding/2;
    this.y = this.state.game.height-(6*this.size)-y*this.size+this.padding/2;
    this.width = this.size-this.padding;
    this.height = this.size-this.padding;

    this.isOpen = type.isOpen;
    this.isGood = type.isGood;
    this.score = type.score;

    if(type.isClick) {
      let x = this.size/2+this.padding/2;
      let y = this.size/2+this.padding/2;
      this.cellOpen = this.state.make.sprite(x, y, type.imgClick);
      this.cellOpen.alpha = 0;
      this.cellOpen.anchor.set(.5);
      this.cellOpen.tint = 0xff4444;
      this.addChild(this.cellOpen);

      this.inputEnabled = true;
      this.events.onInputUp.addOnce(() => {
        this.isOpen = true;
        this.cellOpen.width = 0;
        this.cellOpen.height = 0;
        this.state.add.tween(this.cellOpen)
    			.to({alpha: 1, width: this.size+this.padding/2, height: this.size+this.padding/2}, 200)
    			.start();
      });
    }
  }
  // }
  // update(dt) {
  // }
}

module.exports = Cell;

},{"./types":9}],7:[function(require,module,exports){
class Entity extends Phaser.Sprite {
  constructor(state, x, y, r, isArcs, scale=1.5) {
    super(state.game, x, y, 'player');
    
    this.state = state;
    this.width = r;
    this.height = r;
    this.anchor.set(.5);

    this.arcScale = scale;

    if(isArcs) {
      this.createArc(-.8, -1, .9, 1, 0x373fff);
      this.createArc(.9, -.8, -1, .9, 0xff3737);
      this.createArc(-.8, .9, .8, -1, 0x42863c);
      this.createArc(.8, .9, -.8, -.8, 0x8242aa);
    }

    let rand = this.state.rnd.between(300, 1000);
    let sc = this.state.rnd.between(5, 40);
    this.tweenBreathe = this.state.add.tween(this)
      .to({width: r+sc, height: r+sc}, rand)
      .to({width: r, height: r}, rand)
      .yoyo()
      .loop()
      .start();
  }
  createArc(sx, sy, ex, ey, tint) {
    let arc = this.state.make.sprite(this.width*sx/this.arcScale, this.height*sy/this.arcScale, 'player');

    arc.tint = tint;
    arc.width = 30;
    arc.height = 30;
    this.state.add.tween(arc)
      .to({x: this.width*ex/this.arcScale, y: this.height*ey/this.arcScale, width: 0, height: 0}, this.state.rnd.between(500, 1000))
      .to({x: this.width*sx/this.arcScale, y: this.height*sy/this.arcScale}, this.state.rnd.between(300, 600))
      .to({width: 30, height: 30}, this.state.rnd.between(500, 1000))
      .yoyo()
      .loop()
      .start();
    this.addChild(arc);
  }
}

module.exports = Entity;

},{}],8:[function(require,module,exports){
const Entity = require('./Entity');
const ui = require('../mixins/ui');

class Player extends Entity {
  constructor(state) {
    super(state, state.game.width/2, state.game.height-400, 70, true);
    state.add.existing(this);

    this.state.physics.arcade.enable(this);
    this.body.setSize(this.width/2-1, this.height/2-1, 1, 1);

    this.state.camera.follow(this);
		this.state.camera.deadzone = new Phaser.Rectangle(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    this.speed = 400;
    this.lastMove;

    this.timer = this.state.time.create(false);
    this.timer.loop(this.speed, this.move, this);

    this.state.input.onDown.addOnce(() => {
      let tween = this.state.add.tween(this)
        .to({y: this.state.game.height-(this.state.cellsManager.sizeCell*5+this.state.cellsManager.sizeCell/2)}, this.speed*2)
        .start();
      tween.onComplete.add(() => {
        this.move();
        this.timer.start();
      });
    }, this);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.state.cellsManager, (pl, cell) => {
      if(cell.isOpen) this.state.addScore(cell.score);

      if(cell.topPanel && cell.topPanel.isOpen && cell.topPanel.isGood) {
        this.state.add.tween(this)
          .to({y: cell.topPanel.y+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'top';
      }
      else if(this.lastMove !== 'left' && cell.rightPanel && cell.rightPanel.isOpen && cell.rightPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.rightPanel.x+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'right';
      }
      else if(this.lastMove !== 'right' && cell.leftPanel && cell.leftPanel.isOpen && cell.leftPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.leftPanel.x+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'left';
      }
      else {
        let tween = this.state.add.tween(this)
          .to({y: cell.topPanel.y+cell.width/2, alpha: 0, width: 0, height: 0}, this.speed)
          .start();
        tween.onComplete.add(() => {
          ui.goTo(this.state, 'Menu',  this.state.score);
        });
      }
    });
  }
  update() {
    this.rotation += .01;
  }
}

module.exports = Player;

},{"../mixins/ui":5,"./Entity":7}],9:[function(require,module,exports){
module.exports=[
  {
    "chance": 5,
    "img": "cell3",
    "isOpen": true,
    "isClick": false,
    "score": 10,
    "isGood": true
  },
  {
    "chance": 20,
    "img": "cell2",
    "isOpen": false,
    "isClick": false,
    "score": 0,
    "isGood": false
  },
  {
    "img": "cell",
    "chance": 100,
    "imgClick": "cell-open",
    "isOpen": false,
    "isClick": true,
    "score": 1,
    "isGood": true
  }
]

},{}],10:[function(require,module,exports){
class Boot {
	init() {
	}

	create() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.setMaximum();

		this.state.start('Preload');
	}
}

module.exports = Boot;

},{}],11:[function(require,module,exports){
const ui = require('../mixins/ui');
const Entity = require('../objects/Entity');

class Menu {
	init(score = 0) {
		if(localStorage.getItem("score") < score || !localStorage.getItem("score"))
			localStorage.setItem("score", score);

		this.bg = ui.createBg(this, this.game.width/5, 5, 10);

    this.label = this.add.text(this.game.width/2, 300, "Mottion", {
      font: 'Opificio',
      fontSize: 64,
      fontWeight: 100,
			fontWeight: 600,
      fill: "rgb(52, 61, 84)"
    });
    this.label.anchor.set(0.5);

    this.text = this.add.text(this.game.width/2, 350, "hopelessness in motion...", {
      font: 'Opificio',
      fontSize: 42,
      fontWeight: 600,
      fill: "rgb(52, 61, 84)"
    });
    this.text.anchor.set(0.5);

		this.currentScore = this.add.text(this.game.width/2, 450, 'CURRENT SCORE: ' + score, {
      font: 'Opificio',
      fontSize: 42,
      fontWeight: 500,
      fill: "rgb(52, 61, 84)"
    });
    this.currentScore.anchor.set(0.5);

		this.bestScore = this.add.text(this.game.width/2, 550, 'BEST SCORE: ' + localStorage.getItem('score'), {
      font: 'Opificio',
      fontSize: 42,
      fontWeight: 500,
      fill: "rgb(52, 61, 84)"
    });
    this.bestScore.anchor.set(0.5);

    this.btn = new Entity(this, this.game.width/2, this.game.height/2+100, 200, true, 5);
		this.btn.inputEnabled = true;
		this.btn.events.onInputUp.addOnce(() => {
			ui.goTo(this, 'Playground');
		});
		this.add.existing(this.btn);
	}
	update() {
		this.btn.rotation += .02;
	}
}

module.exports = Menu;

},{"../mixins/ui":5,"../objects/Entity":7}],12:[function(require,module,exports){
const CellsManager = require('../managers/CellsManager');
const CloudsManager = require('../managers/CloudsManager');
const IslandManager = require('../managers/IslandManager');
const Player = require('../objects/Player');

class Playground {
	create() {
		this.world.setBounds(0, -this.game.height*1000, this.game.width, this.game.height*2000);
		this.physics.startSystem(Phaser.Physics.Arcade);

		this.bg = this.add.sprite(0, 0, 'bg');
		this.bg.width = this.game.width;
		this.bg.height = this.game.height;
		this.bg.fixedToCamera = true;

		this.cellsManager = new CellsManager(this);
		this.islandManager = new IslandManager(this);
		this.player = new Player(this);
		this.cloudsManager = new CloudsManager(this);

		this.label = this.add.text(50, 50, "Existence:", {
			font: 'Opificio',
			fontSize: 64,
			fontWeight: 400,
			fill: "rgb(52, 61, 84)"
		});
		this.label.fixedToCamera = true;
		this.scoreText = this.add.text(50, 120, "ZERO TAPS", {
			font: 'Opificio',
			fontSize: 42,
			fontWeight: 400,
			fill: "rgb(52, 61, 84)"
		});
		this.scoreText.fixedToCamera = true;
		this.score = 0;
	}
	addScore(v) {
		this.score += v;
	 	this.scoreText.text = this.score;
	}
	update(dt) {
		this.cloudsManager.update(dt);
    this.cellsManager.update(dt);
		this.player.update(dt);
	}
}

module.exports = Playground;

},{"../managers/CellsManager":2,"../managers/CloudsManager":3,"../managers/IslandManager":4,"../objects/Player":8}],13:[function(require,module,exports){

class Preload {
	init() {
	}
	preload() {
		this.load.image('cell', 'assets/cell.png');
		this.load.image('cell-open', 'assets/cell-open.png');
		this.load.image('cell2', 'assets/cell2.png');
		this.load.image('cell3', 'assets/cell3.png');

		this.load.image('bg', 'assets/bg.png');
		this.load.image('player', 'assets/player.png');
		this.load.image('island', 'assets/island.png');
		this.load.image('flag', 'assets/flag.png');

		this.load.image('cloud1', 'assets/cloud1.png');
		this.load.image('cloud2', 'assets/cloud2.png');
	}

	create() {
		this.state.start('Menu');
	}
}

module.exports = Preload;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0NlbGxzTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0Nsb3Vkc01hbmFnZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9tYW5hZ2Vycy9Jc2xhbmRNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWl4aW5zL3VpLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvb2JqZWN0cy9DZWxsLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvb2JqZWN0cy9FbnRpdHkuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9vYmplY3RzL1BsYXllci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvdHlwZXMuanNvbiIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9Cb290LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc3RhdGVzL01lbnUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvUGxheWdyb3VuZC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9QcmVsb2FkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBCb290ID0gcmVxdWlyZSgnLi9zdGF0ZXMvQm9vdC5qcycpO1xyXG5jb25zdCBQcmVsb2FkID0gcmVxdWlyZSgnLi9zdGF0ZXMvUHJlbG9hZC5qcycpO1xyXG5jb25zdCBNZW51ID0gcmVxdWlyZSgnLi9zdGF0ZXMvTWVudS5qcycpO1xyXG5jb25zdCBQbGF5Z3JvdW5kID0gcmVxdWlyZSgnLi9zdGF0ZXMvUGxheWdyb3VuZC5qcycpO1xyXG5cclxudmFyIHJlYWR5ID0gKCkgPT4ge1xyXG5cdHZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDcyMCwgMTI4MCwgUGhhc2VyLkFVVE8sICdNb3R0aW9uJyk7XHJcblxyXG5cdGdhbWUuc3RhdGUuYWRkKCdCb290JywgQm9vdCwgdHJ1ZSk7XHJcbiAgZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCBQcmVsb2FkKTtcclxuICBnYW1lLnN0YXRlLmFkZCgnTWVudScsIE1lbnUpO1xyXG5cdGdhbWUuc3RhdGUuYWRkKCdQbGF5Z3JvdW5kJywgUGxheWdyb3VuZCk7XHJcbn1cclxuXHJcbnJlYWR5KCk7XHJcbiIsImNvbnN0IENlbGwgPSByZXF1aXJlKCcuLi9vYmplY3RzL0NlbGwnKTtcclxuY29uc3QgdHlwZXMgPSByZXF1aXJlKCcuLi9vYmplY3RzL3R5cGVzJyk7XG50eXBlcy5zb3J0KChhLCBiKSA9PiBhLmNoYW5jZSAtIGIuY2hhbmNlKTtcclxuXHJcblxyXG5jbGFzcyBDZWxsc01hbmFnZXIgZXh0ZW5kcyBQaGFzZXIuR3JvdXAge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBzdXBlcihzdGF0ZS5nYW1lKTtcclxuXHJcbiAgICB0aGlzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuc2l6ZUNlbGwgPSBzdGF0ZS5nYW1lLndpZHRoLzU7XHJcbiAgICB0aGlzLmxhc3RZID0gMDtcbiAgICB0aGlzLmxhc3QgPSBbXTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLmNyZWF0ZUNlbGxzKDE1KTtcbiAgfVxyXG4gIGNyZWF0ZUNlbGxzKGFtdEdlblkpIHtcclxuICAgIGxldCBhcnIgPSBbXTtcclxuXHJcbiAgICBmb3IobGV0IHkgPSB0aGlzLmxhc3RZOyB5IDwgdGhpcy5sYXN0WSthbXRHZW5ZOyB5KyspIHtcclxuICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IDU7IHgrKykge1xyXG4gICAgICAgIGxldCByYW5kID0gTWF0aC5yYW5kb20oKSoxMDA7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgaWYocmFuZCA8IHR5cGVzW2ldLmNoYW5jZSkge1xyXG4gICAgICAgICAgICAgbGV0IGNlbGwgPSBuZXcgQ2VsbCh0aGlzLCB0eXBlc1tpXSwgeCwgeSk7XHJcbiAgICAgICAgICAgICB0aGlzLmFkZChjZWxsKTtcclxuICAgICAgICAgICAgIGFyci5wdXNoKGNlbGwpO1xyXG4gICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IGFtdEdlblk7IHkrKykge1xyXG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgNTsgeCsrKSB7XHJcbiAgICAgICAgaWYoeSsxIDwgYW10R2VuWSkgYXJyW3kqNSt4XS50b3BQYW5lbCA9IGFyclsoeSsxKSo1K3hdO1xyXG4gICAgICAgIGlmKHgtMSA+PSAwKSBhcnJbeSo1K3hdLmxlZnRQYW5lbCA9IGFyclt5KjUreC0xXTtcclxuICAgICAgICBpZih4KzEgPCA1KSAgYXJyW3kqNSt4XS5yaWdodFBhbmVsID0gYXJyW3kqNSt4KzFdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmxhc3QubGVuZ3RoKSB7XHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCA1OyB4KyspIHtcclxuICAgICAgICB0aGlzLmxhc3RbeF0udG9wUGFuZWwgPSBhcnJbeF07XHJcbiAgICAgIH1cclxuICAgIH1cbiAgICB0aGlzLmxhc3RbMF0gPSBhcnJbYXJyLmxlbmd0aC01XTtcbiAgICB0aGlzLmxhc3RbMV0gPSBhcnJbYXJyLmxlbmd0aC00XTtcbiAgICB0aGlzLmxhc3RbMl0gPSBhcnJbYXJyLmxlbmd0aC0zXTtcbiAgICB0aGlzLmxhc3RbM10gPSBhcnJbYXJyLmxlbmd0aC0yXTtcbiAgICB0aGlzLmxhc3RbNF0gPSBhcnJbYXJyLmxlbmd0aC0xXTtcclxuICAgIHRoaXMubGFzdFkgKz0gYW10R2VuWTtcclxuICB9XHJcbiAgdXBkYXRlKGR0KSB7XHJcbiAgICBsZXQgaXNIaWRlID0gZmFsc2U7XHJcbiAgICB0aGlzLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgaWYoY2VsbC55ID4gdGhpcy5zdGF0ZS5wbGF5ZXIueSt0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LTQwMCkge1xyXG4gICAgICAgIGNlbGwubGVmdFBhbmVsID0gbnVsbDtcclxuICAgICAgICBjZWxsLnJpZ2h0UGFuZWwgPSBudWxsO1xyXG4gICAgICAgIGNlbGwudG9wUGFuZWwgPSBudWxsO1xyXG4gICAgICAgIGNlbGwuZGVzdHJveSgpO1xyXG4gICAgICAgICFpc0hpZGUgJiYgdGhpcy5jcmVhdGVDZWxscygxKTtcclxuICAgICAgICBpc0hpZGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsbHNNYW5hZ2VyO1xyXG4iLCJjbGFzcyBDbG91ZHNNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgc3VwZXIoc3RhdGUuZ2FtZSk7XHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgdGhpcy5sYXN0WSA9IDA7XHJcblxyXG4gICAgdGhpcy50aW1lciA9IHRoaXMuc3RhdGUudGltZS5jcmVhdGUoZmFsc2UpO1xyXG4gICAgdGhpcy50aW1lci5sb29wKDEwMDAsIHRoaXMuY3JlYXRlQ2xvdWQsIHRoaXMpO1xyXG4gICAgdGhpcy50aW1lci5zdGFydCgpO1xyXG4gIH1cclxuICBjcmVhdGVDbG91ZCgpIHtcclxuICAgIHRoaXMubGFzdFkgLT0gdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbih0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LCB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0KjIpO1xyXG5cclxuICAgIGxldCBjbG91ZDtcclxuICAgIGlmKE1hdGgucmFuZG9tKCkgPCAuNSkge1xyXG4gIFx0XHRjbG91ZCA9IHRoaXMuYWRkKHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoMCwgdGhpcy5sYXN0WSwgJ2Nsb3VkMScpKTtcclxuICBcdFx0Y2xvdWQud2lkdGggPSB0aGlzLnN0YXRlLmdhbWUud2lkdGgtMTAwO1xyXG4gIFx0XHRjbG91ZC5oZWlnaHQgPSA0MDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjbG91ZCA9IHRoaXMuYWRkKHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoMTAwLCB0aGlzLmxhc3RZLCAnY2xvdWQxJykpO1xyXG4gICAgICBjbG91ZC53aWR0aCA9IHRoaXMuc3RhdGUuZ2FtZS53aWR0aC0xMDA7XHJcbiAgICAgIGNsb3VkLmhlaWdodCA9IDQwMDtcclxuICAgICAgY2xvdWQuYW5jaG9yLnNldCgxKTtcclxuICAgICAgY2xvdWQuc2NhbGUueCAqPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICBjbG91ZC5kdXJhdGlvbiA9IE1hdGgucmFuZG9tKCkqMjtcclxuICAgIGNsb3VkLmFscGhhID0gdGhpcy5zdGF0ZS5ybmQuYmV0d2VlbiguNSwgMSk7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy5mb3JFYWNoKChjbG91ZCkgPT4ge1xyXG4gICAgICBjbG91ZC55ICs9IGNsb3VkLmR1cmF0aW9uO1xyXG4gICAgICBpZihjbG91ZC55ID4gdGhpcy5zdGF0ZS5wbGF5ZXIueSt0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LTQwMClcclxuICAgICAgICBjbG91ZC5kZXN0cm95KCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2xvdWRzTWFuYWdlcjtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9FbnRpdHknKTtcclxuXG5jbGFzcyBJc2xhbmRNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgc3VwZXIoc3RhdGUuZ2FtZSk7XHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgdGhpcy5pc2xhbmQgPSB0aGlzLmNyZWF0ZSgwLCB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0KzEwLCAnaXNsYW5kJyk7XHJcbiAgICB0aGlzLmlzbGFuZC5hbmNob3Iuc2V0KDAsIDEpO1xyXG4gICAgdGhpcy5pc2xhbmQud2lkdGggPSB0aGlzLnN0YXRlLmNlbGxzTWFuYWdlci5zaXplQ2VsbCo1O1xyXG4gICAgdGhpcy5pc2xhbmQuaGVpZ2h0ID0gdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuc2l6ZUNlbGwqNTtcclxuICAgIHRoaXMuaXNsYW5kLnRpbnQgPSAweGZmNDQ0NDsgMHgwMGQ0NjFcclxuXHJcbiAgICB0aGlzLmNyZWF0ZSgyMDAsIHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQtMjU2LCAnZmxhZycpO1xyXG4gICAgdGhpcy5jcmVhdGUoNjAwLCB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LTM1NiwgJ2ZsYWcnKS5zY2FsZS54ICo9IC0xO1xyXG4gICAgdGhpcy5jcmVhdGUoNDAwLCB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LTQwMCwgJ2ZsYWcnKS5zY2FsZS54ICo9IC0xO1xyXG4gICAgdGhpcy5jcmVhdGUoMTAwLCB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LTMwMCwgJ2ZsYWcnKTtcclxuXHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgNDsgeSsrKSB7XHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCB0aGlzLnN0YXRlLmdhbWUud2lkdGgvNTA7IHgrKykge1xyXG4gICAgICAgIGlmKE1hdGgucmFuZG9tKCkgPCAuMykgY29udGludWU7XHJcbiAgICAgICAgbGV0IHB4ID0geCo1MDtcclxuICAgICAgICBsZXQgcHkgPSB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LXkqNTA7XHJcbiAgICAgICAgdGhpcy5hZGQobmV3IEVudGl0eSh0aGlzLnN0YXRlLCBweCwgcHksIHRoaXMuc3RhdGUucm5kLmJldHdlZW4oMzAsIDUwKSwgZmFsc2UpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJc2xhbmRNYW5hZ2VyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjcmVhdGVCZyhzdGF0ZSwgc2l6ZT0xMDAsIGF4PTIwLCBheT0yMCkge1xyXG4gICAgbGV0IGJnID0gc3RhdGUuYWRkLmdyYXBoaWNzKCk7XHJcbiAgICBiZy5iZWdpbkZpbGwoMHhGRkZGRkYsIDEpO1xyXG4gICAgYmcuZHJhd1JlY3QoMCwgMCwgc3RhdGUuZ2FtZS53aWR0aCwgc3RhdGUuZ2FtZS5oZWlnaHQpO1xyXG4gICAgYmcuZW5kRmlsbCgpO1xyXG5cclxuICAgIGJnLmxpbmVTdHlsZSg0LCAweDJlMmU0NCwgLjEpO1xyXG5cclxuICAgIGZvcihsZXQgeCA9IDA7IHggPCBheDsgeCsrKSB7XHJcbiAgICAgIGJnLm1vdmVUbyhzaXplKngsIDApO1xyXG4gICAgICBiZy5saW5lVG8oc2l6ZSp4LCBzdGF0ZS5nYW1lLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgYXk7IHkrKykge1xyXG4gICAgICBiZy5tb3ZlVG8oMCwgc2l6ZSp5KTtcclxuICAgICAgYmcubGluZVRvKHN0YXRlLmdhbWUud2lkdGgsIHNpemUqeSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmc7XHJcbiAgfSxcclxuICBnb1RvKHN0YXRlLCBuYW1lLCBhcmdzKSB7XHJcbiAgICBzdGF0ZS5jYW1lcmEuZmFkZSgweEZGRkZGRik7XHJcbiAgICBzdGF0ZS5jYW1lcmEub25GYWRlQ29tcGxldGUuYWRkKCgpID0+IHtcclxuICAgICAgc3RhdGUuc3RhdGUuc3RhcnQobmFtZSwgdHJ1ZSwgZmFsc2UsIGFyZ3MpO1xyXG4gICAgICBzdGF0ZS5zdGF0ZS5nZXRDdXJyZW50U3RhdGUoKS5jYW1lcmEuZmxhc2goMHhGRkZGRkYsIDEwMDApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImNvbnN0IHR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xyXG5cclxuY2xhc3MgQ2VsbCBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKG1hbmFnZXIsIHR5cGUsIHgsIHkpIHtcclxuICAgIHN1cGVyKG1hbmFnZXIuZ2FtZSwgMCwgMCwgdHlwZS5pbWcpO1xyXG5cclxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICB0aGlzLnN0YXRlID0gbWFuYWdlci5zdGF0ZTtcclxuXHJcbiAgICB0aGlzLnNpemUgPSB0aGlzLnN0YXRlLmdhbWUud2lkdGgvNTtcclxuICAgIHRoaXMucGFkZGluZyA9IDEwO1xyXG4gICAgdGhpcy54ID0geCp0aGlzLnNpemUrdGhpcy5wYWRkaW5nLzI7XHJcbiAgICB0aGlzLnkgPSB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LSg2KnRoaXMuc2l6ZSkteSp0aGlzLnNpemUrdGhpcy5wYWRkaW5nLzI7XHJcbiAgICB0aGlzLndpZHRoID0gdGhpcy5zaXplLXRoaXMucGFkZGluZztcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5zaXplLXRoaXMucGFkZGluZztcclxuXHJcbiAgICB0aGlzLmlzT3BlbiA9IHR5cGUuaXNPcGVuO1xyXG4gICAgdGhpcy5pc0dvb2QgPSB0eXBlLmlzR29vZDtcclxuICAgIHRoaXMuc2NvcmUgPSB0eXBlLnNjb3JlO1xyXG5cclxuICAgIGlmKHR5cGUuaXNDbGljaykge1xyXG4gICAgICBsZXQgeCA9IHRoaXMuc2l6ZS8yK3RoaXMucGFkZGluZy8yO1xyXG4gICAgICBsZXQgeSA9IHRoaXMuc2l6ZS8yK3RoaXMucGFkZGluZy8yO1xyXG4gICAgICB0aGlzLmNlbGxPcGVuID0gdGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSh4LCB5LCB0eXBlLmltZ0NsaWNrKTtcclxuICAgICAgdGhpcy5jZWxsT3Blbi5hbHBoYSA9IDA7XHJcbiAgICAgIHRoaXMuY2VsbE9wZW4uYW5jaG9yLnNldCguNSk7XHJcbiAgICAgIHRoaXMuY2VsbE9wZW4udGludCA9IDB4ZmY0NDQ0O1xyXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuY2VsbE9wZW4pO1xyXG5cclxuICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY2VsbE9wZW4ud2lkdGggPSAwO1xyXG4gICAgICAgIHRoaXMuY2VsbE9wZW4uaGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzLmNlbGxPcGVuKVxyXG4gICAgXHRcdFx0LnRvKHthbHBoYTogMSwgd2lkdGg6IHRoaXMuc2l6ZSt0aGlzLnBhZGRpbmcvMiwgaGVpZ2h0OiB0aGlzLnNpemUrdGhpcy5wYWRkaW5nLzJ9LCAyMDApXHJcbiAgICBcdFx0XHQuc3RhcnQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIH1cclxuICAvLyB1cGRhdGUoZHQpIHtcclxuICAvLyB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsbDtcclxuIiwiY2xhc3MgRW50aXR5IGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUsIHgsIHksIHIsIGlzQXJjcywgc2NhbGU9MS41KSB7XHJcbiAgICBzdXBlcihzdGF0ZS5nYW1lLCB4LCB5LCAncGxheWVyJyk7XHJcbiAgICBcclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgIHRoaXMud2lkdGggPSByO1xyXG4gICAgdGhpcy5oZWlnaHQgPSByO1xyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuXHJcbiAgICB0aGlzLmFyY1NjYWxlID0gc2NhbGU7XHJcblxyXG4gICAgaWYoaXNBcmNzKSB7XHJcbiAgICAgIHRoaXMuY3JlYXRlQXJjKC0uOCwgLTEsIC45LCAxLCAweDM3M2ZmZik7XHJcbiAgICAgIHRoaXMuY3JlYXRlQXJjKC45LCAtLjgsIC0xLCAuOSwgMHhmZjM3MzcpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUFyYygtLjgsIC45LCAuOCwgLTEsIDB4NDI4NjNjKTtcclxuICAgICAgdGhpcy5jcmVhdGVBcmMoLjgsIC45LCAtLjgsIC0uOCwgMHg4MjQyYWEpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByYW5kID0gdGhpcy5zdGF0ZS5ybmQuYmV0d2VlbigzMDAsIDEwMDApO1xyXG4gICAgbGV0IHNjID0gdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbig1LCA0MCk7XHJcbiAgICB0aGlzLnR3ZWVuQnJlYXRoZSA9IHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7d2lkdGg6IHIrc2MsIGhlaWdodDogcitzY30sIHJhbmQpXHJcbiAgICAgIC50byh7d2lkdGg6IHIsIGhlaWdodDogcn0sIHJhbmQpXHJcbiAgICAgIC55b3lvKClcclxuICAgICAgLmxvb3AoKVxyXG4gICAgICAuc3RhcnQoKTtcclxuICB9XHJcbiAgY3JlYXRlQXJjKHN4LCBzeSwgZXgsIGV5LCB0aW50KSB7XHJcbiAgICBsZXQgYXJjID0gdGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSh0aGlzLndpZHRoKnN4L3RoaXMuYXJjU2NhbGUsIHRoaXMuaGVpZ2h0KnN5L3RoaXMuYXJjU2NhbGUsICdwbGF5ZXInKTtcclxuXHJcbiAgICBhcmMudGludCA9IHRpbnQ7XHJcbiAgICBhcmMud2lkdGggPSAzMDtcclxuICAgIGFyYy5oZWlnaHQgPSAzMDtcclxuICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKGFyYylcclxuICAgICAgLnRvKHt4OiB0aGlzLndpZHRoKmV4L3RoaXMuYXJjU2NhbGUsIHk6IHRoaXMuaGVpZ2h0KmV5L3RoaXMuYXJjU2NhbGUsIHdpZHRoOiAwLCBoZWlnaHQ6IDB9LCB0aGlzLnN0YXRlLnJuZC5iZXR3ZWVuKDUwMCwgMTAwMCkpXHJcbiAgICAgIC50byh7eDogdGhpcy53aWR0aCpzeC90aGlzLmFyY1NjYWxlLCB5OiB0aGlzLmhlaWdodCpzeS90aGlzLmFyY1NjYWxlfSwgdGhpcy5zdGF0ZS5ybmQuYmV0d2VlbigzMDAsIDYwMCkpXHJcbiAgICAgIC50byh7d2lkdGg6IDMwLCBoZWlnaHQ6IDMwfSwgdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbig1MDAsIDEwMDApKVxyXG4gICAgICAueW95bygpXHJcbiAgICAgIC5sb29wKClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmFkZENoaWxkKGFyYyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eTtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZSgnLi9FbnRpdHknKTtcclxuY29uc3QgdWkgPSByZXF1aXJlKCcuLi9taXhpbnMvdWknKTtcclxuXHJcbmNsYXNzIFBsYXllciBleHRlbmRzIEVudGl0eSB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIHN1cGVyKHN0YXRlLCBzdGF0ZS5nYW1lLndpZHRoLzIsIHN0YXRlLmdhbWUuaGVpZ2h0LTQwMCwgNzAsIHRydWUpO1xyXG4gICAgc3RhdGUuYWRkLmV4aXN0aW5nKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMpO1xyXG4gICAgdGhpcy5ib2R5LnNldFNpemUodGhpcy53aWR0aC8yLTEsIHRoaXMuaGVpZ2h0LzItMSwgMSwgMSk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5jYW1lcmEuZm9sbG93KHRoaXMpO1xyXG5cdFx0dGhpcy5zdGF0ZS5jYW1lcmEuZGVhZHpvbmUgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZSh0aGlzLngtdGhpcy53aWR0aC8yLCB0aGlzLnktdGhpcy5oZWlnaHQvMiwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cclxuICAgIHRoaXMuc3BlZWQgPSA0MDA7XHJcbiAgICB0aGlzLmxhc3RNb3ZlO1xyXG5cclxuICAgIHRoaXMudGltZXIgPSB0aGlzLnN0YXRlLnRpbWUuY3JlYXRlKGZhbHNlKTtcclxuICAgIHRoaXMudGltZXIubG9vcCh0aGlzLnNwZWVkLCB0aGlzLm1vdmUsIHRoaXMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuaW5wdXQub25Eb3duLmFkZE9uY2UoKCkgPT4ge1xyXG4gICAgICBsZXQgdHdlZW4gPSB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgIC50byh7eTogdGhpcy5zdGF0ZS5nYW1lLmhlaWdodC0odGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuc2l6ZUNlbGwqNSt0aGlzLnN0YXRlLmNlbGxzTWFuYWdlci5zaXplQ2VsbC8yKX0sIHRoaXMuc3BlZWQqMilcclxuICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMubW92ZSgpO1xyXG4gICAgICAgIHRoaXMudGltZXIuc3RhcnQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIG1vdmUoKSB7XHJcbiAgICB0aGlzLnN0YXRlLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcywgdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIsIChwbCwgY2VsbCkgPT4ge1xyXG4gICAgICBpZihjZWxsLmlzT3BlbikgdGhpcy5zdGF0ZS5hZGRTY29yZShjZWxsLnNjb3JlKTtcclxuXHJcbiAgICAgIGlmKGNlbGwudG9wUGFuZWwgJiYgY2VsbC50b3BQYW5lbC5pc09wZW4gJiYgY2VsbC50b3BQYW5lbC5pc0dvb2QpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt5OiBjZWxsLnRvcFBhbmVsLnkrY2VsbC53aWR0aC8yfSwgdGhpcy5zcGVlZClcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSAndG9wJztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKHRoaXMubGFzdE1vdmUgIT09ICdsZWZ0JyAmJiBjZWxsLnJpZ2h0UGFuZWwgJiYgY2VsbC5yaWdodFBhbmVsLmlzT3BlbiAmJiBjZWxsLnJpZ2h0UGFuZWwuaXNHb29kKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eDogY2VsbC5yaWdodFBhbmVsLngrY2VsbC53aWR0aC8yfSwgdGhpcy5zcGVlZClcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSAncmlnaHQnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYodGhpcy5sYXN0TW92ZSAhPT0gJ3JpZ2h0JyAmJiBjZWxsLmxlZnRQYW5lbCAmJiBjZWxsLmxlZnRQYW5lbC5pc09wZW4gJiYgY2VsbC5sZWZ0UGFuZWwuaXNHb29kKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eDogY2VsbC5sZWZ0UGFuZWwueCtjZWxsLndpZHRoLzJ9LCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0TW92ZSA9ICdsZWZ0JztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBsZXQgdHdlZW4gPSB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt5OiBjZWxsLnRvcFBhbmVsLnkrY2VsbC53aWR0aC8yLCBhbHBoYTogMCwgd2lkdGg6IDAsIGhlaWdodDogMH0sIHRoaXMuc3BlZWQpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgICB1aS5nb1RvKHRoaXMuc3RhdGUsICdNZW51JywgIHRoaXMuc3RhdGUuc2NvcmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy5yb3RhdGlvbiArPSAuMDE7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcclxuIiwibW9kdWxlLmV4cG9ydHM9W1xyXG4gIHtcclxuICAgIFwiY2hhbmNlXCI6IDUsXHJcbiAgICBcImltZ1wiOiBcImNlbGwzXCIsXHJcbiAgICBcImlzT3BlblwiOiB0cnVlLFxyXG4gICAgXCJpc0NsaWNrXCI6IGZhbHNlLFxyXG4gICAgXCJzY29yZVwiOiAxMCxcclxuICAgIFwiaXNHb29kXCI6IHRydWVcclxuICB9LFxyXG4gIHtcclxuICAgIFwiY2hhbmNlXCI6IDIwLFxyXG4gICAgXCJpbWdcIjogXCJjZWxsMlwiLFxyXG4gICAgXCJpc09wZW5cIjogZmFsc2UsXHJcbiAgICBcImlzQ2xpY2tcIjogZmFsc2UsXHJcbiAgICBcInNjb3JlXCI6IDAsXHJcbiAgICBcImlzR29vZFwiOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJpbWdcIjogXCJjZWxsXCIsXHJcbiAgICBcImNoYW5jZVwiOiAxMDAsXHJcbiAgICBcImltZ0NsaWNrXCI6IFwiY2VsbC1vcGVuXCIsXHJcbiAgICBcImlzT3BlblwiOiBmYWxzZSxcclxuICAgIFwiaXNDbGlja1wiOiB0cnVlLFxyXG4gICAgXCJzY29yZVwiOiAxLFxyXG4gICAgXCJpc0dvb2RcIjogdHJ1ZVxyXG4gIH1cclxuXVxyXG4iLCJjbGFzcyBCb290IHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG5cdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5zY2FsZS5zZXRNYXhpbXVtKCk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb290O1xyXG4iLCJjb25zdCB1aSA9IHJlcXVpcmUoJy4uL21peGlucy91aScpO1xyXG5jb25zdCBFbnRpdHkgPSByZXF1aXJlKCcuLi9vYmplY3RzL0VudGl0eScpO1xyXG5cclxuY2xhc3MgTWVudSB7XHJcblx0aW5pdChzY29yZSA9IDApIHtcclxuXHRcdGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2NvcmVcIikgPCBzY29yZSB8fCAhbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzY29yZVwiKSlcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzY29yZVwiLCBzY29yZSk7XHJcblxyXG5cdFx0dGhpcy5iZyA9IHVpLmNyZWF0ZUJnKHRoaXMsIHRoaXMuZ2FtZS53aWR0aC81LCA1LCAxMCk7XHJcblxyXG4gICAgdGhpcy5sYWJlbCA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoLzIsIDMwMCwgXCJNb3R0aW9uXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDY0LFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcblx0XHRcdGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCJyZ2IoNTIsIDYxLCA4NClcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmxhYmVsLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICB0aGlzLnRleHQgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAzNTAsIFwiaG9wZWxlc3NuZXNzIGluIG1vdGlvbi4uLlwiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA0MixcclxuICAgICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgICBmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMudGV4dC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG5cdFx0dGhpcy5jdXJyZW50U2NvcmUgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCA0NTAsICdDVVJSRU5UIFNDT1JFOiAnICsgc2NvcmUsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDQyLFxyXG4gICAgICBmb250V2VpZ2h0OiA1MDAsXHJcbiAgICAgIGZpbGw6IFwicmdiKDUyLCA2MSwgODQpXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5jdXJyZW50U2NvcmUuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuXHRcdHRoaXMuYmVzdFNjb3JlID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgNTUwLCAnQkVTVCBTQ09SRTogJyArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzY29yZScpLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA0MixcclxuICAgICAgZm9udFdlaWdodDogNTAwLFxyXG4gICAgICBmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMuYmVzdFNjb3JlLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICB0aGlzLmJ0biA9IG5ldyBFbnRpdHkodGhpcywgdGhpcy5nYW1lLndpZHRoLzIsIHRoaXMuZ2FtZS5oZWlnaHQvMisxMDAsIDIwMCwgdHJ1ZSwgNSk7XHJcblx0XHR0aGlzLmJ0bi5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5idG4uZXZlbnRzLm9uSW5wdXRVcC5hZGRPbmNlKCgpID0+IHtcclxuXHRcdFx0dWkuZ29Ubyh0aGlzLCAnUGxheWdyb3VuZCcpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmFkZC5leGlzdGluZyh0aGlzLmJ0bik7XHJcblx0fVxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdHRoaXMuYnRuLnJvdGF0aW9uICs9IC4wMjtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiY29uc3QgQ2VsbHNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvQ2VsbHNNYW5hZ2VyJyk7XHJcbmNvbnN0IENsb3Vkc01hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9DbG91ZHNNYW5hZ2VyJyk7XHJcbmNvbnN0IElzbGFuZE1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9Jc2xhbmRNYW5hZ2VyJyk7XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4uL29iamVjdHMvUGxheWVyJyk7XHJcblxyXG5jbGFzcyBQbGF5Z3JvdW5kIHtcclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLndvcmxkLnNldEJvdW5kcygwLCAtdGhpcy5nYW1lLmhlaWdodCoxMDAwLCB0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQqMjAwMCk7XHJcblx0XHR0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQXJjYWRlKTtcclxuXHJcblx0XHR0aGlzLmJnID0gdGhpcy5hZGQuc3ByaXRlKDAsIDAsICdiZycpO1xyXG5cdFx0dGhpcy5iZy53aWR0aCA9IHRoaXMuZ2FtZS53aWR0aDtcclxuXHRcdHRoaXMuYmcuaGVpZ2h0ID0gdGhpcy5nYW1lLmhlaWdodDtcclxuXHRcdHRoaXMuYmcuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5jZWxsc01hbmFnZXIgPSBuZXcgQ2VsbHNNYW5hZ2VyKHRoaXMpO1xyXG5cdFx0dGhpcy5pc2xhbmRNYW5hZ2VyID0gbmV3IElzbGFuZE1hbmFnZXIodGhpcyk7XHJcblx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcyk7XHJcblx0XHR0aGlzLmNsb3Vkc01hbmFnZXIgPSBuZXcgQ2xvdWRzTWFuYWdlcih0aGlzKTtcclxuXHJcblx0XHR0aGlzLmxhYmVsID0gdGhpcy5hZGQudGV4dCg1MCwgNTAsIFwiRXhpc3RlbmNlOlwiLCB7XHJcblx0XHRcdGZvbnQ6ICdPcGlmaWNpbycsXHJcblx0XHRcdGZvbnRTaXplOiA2NCxcclxuXHRcdFx0Zm9udFdlaWdodDogNDAwLFxyXG5cdFx0XHRmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXHJcblx0XHR9KTtcclxuXHRcdHRoaXMubGFiZWwuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblx0XHR0aGlzLnNjb3JlVGV4dCA9IHRoaXMuYWRkLnRleHQoNTAsIDEyMCwgXCJaRVJPIFRBUFNcIiwge1xyXG5cdFx0XHRmb250OiAnT3BpZmljaW8nLFxyXG5cdFx0XHRmb250U2l6ZTogNDIsXHJcblx0XHRcdGZvbnRXZWlnaHQ6IDQwMCxcclxuXHRcdFx0ZmlsbDogXCJyZ2IoNTIsIDYxLCA4NClcIlxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNjb3JlVGV4dC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuXHRcdHRoaXMuc2NvcmUgPSAwO1xyXG5cdH1cclxuXHRhZGRTY29yZSh2KSB7XHJcblx0XHR0aGlzLnNjb3JlICs9IHY7XHJcblx0IFx0dGhpcy5zY29yZVRleHQudGV4dCA9IHRoaXMuc2NvcmU7XHJcblx0fVxyXG5cdHVwZGF0ZShkdCkge1xyXG5cdFx0dGhpcy5jbG91ZHNNYW5hZ2VyLnVwZGF0ZShkdCk7XHJcbiAgICB0aGlzLmNlbGxzTWFuYWdlci51cGRhdGUoZHQpO1xyXG5cdFx0dGhpcy5wbGF5ZXIudXBkYXRlKGR0KTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWdyb3VuZDtcclxuIiwiXHJcbmNsYXNzIFByZWxvYWQge1xyXG5cdGluaXQoKSB7XHJcblx0fVxyXG5cdHByZWxvYWQoKSB7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwnLCAnYXNzZXRzL2NlbGwucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwtb3BlbicsICdhc3NldHMvY2VsbC1vcGVuLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsMicsICdhc3NldHMvY2VsbDIucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwzJywgJ2Fzc2V0cy9jZWxsMy5wbmcnKTtcclxuXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9iZy5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGxheWVyJywgJ2Fzc2V0cy9wbGF5ZXIucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2lzbGFuZCcsICdhc3NldHMvaXNsYW5kLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdmbGFnJywgJ2Fzc2V0cy9mbGFnLnBuZycpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2xvdWQxJywgJ2Fzc2V0cy9jbG91ZDEucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2Nsb3VkMicsICdhc3NldHMvY2xvdWQyLnBuZycpO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnTWVudScpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2FkO1xyXG4iXX0=
