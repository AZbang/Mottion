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

},{"./states/Boot.js":8,"./states/Menu.js":9,"./states/Playground.js":10,"./states/Preload.js":11}],2:[function(require,module,exports){
const Cell = require('../objects/Cell');
const types = require('../objects/types');

class CellsManager extends Phaser.Group {
  constructor(state) {
    super(state.game);

    this.enableBody = true;

    this.sizeCell = state.game.width/5;

    this.state = state;
    this.createCells();
  }
  createCells() {
    types.sort((a, b) => a.chance - b.chance);

    for(let y = 0; y < 100; y++) {
      for(let x = 0; x < 5; x++) {
        let rand = Math.random()*100;
        for(let i = 0; i < types.length; i++) {
           if(rand < types[i].chance) {
             this.add(new Cell(this, types[i], x, y));
             break;
           }
        }
      }
    }
    for(let y = 0; y < 100; y++) {
      for(let x = 0; x < 5; x++) {
        if(y+1 < 100) this.children[y*5+x].topPanel = this.children[(y+1)*5+x];
        if(x-1 >= 0) this.children[y*5+x].leftPanel = this.children[y*5+x-1];
        if(x+1 < 5) this.children[y*5+x].rightPanel = this.children[y*5+x+1];
      }
    }
  }
  update(dt) {

  }
}

module.exports = CellsManager;

},{"../objects/Cell":4,"../objects/types":7}],3:[function(require,module,exports){
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
  }
}

},{}],4:[function(require,module,exports){
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
      this.cellOpen = this.state.add.sprite(this.x+this.size/2-this.padding/2, this.y+this.size/2-this.padding/2, type.imgClick);
      this.cellOpen.width = 0;
      this.cellOpen.height = 0;
      this.cellOpen.alpha = 0;
      this.cellOpen.anchor.set(.5);

      this.inputEnabled = true;
      this.events.onInputUp.addOnce(() => {
        this.isOpen = true;

        this.state.add.tween(this.cellOpen)
    			.to({alpha: 1, width: this.size-this.padding, height: this.size-this.padding}, 200)
    			.start();
      });
    }
  }
  // }
  // update(dt) {
  // }
}

module.exports = Cell;

},{"./types":7}],5:[function(require,module,exports){
class Entity extends Phaser.Sprite {
  constructor(state, x, y, r, isArcs, scale=1.5) {
    super(state.game, x, y, 'player');
    state.add.existing(this);

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

},{}],6:[function(require,module,exports){
const Entity = require('./Entity');

class Player extends Entity {
  constructor(state) {
    super(state, state.game.width/2, state.game.height-400, 70, true);

    this.state.physics.arcade.enable(this);
    this.body.setSize(this.width/2-1, this.height/2-1, 1, 1);

    this.state.camera.follow(this);
		this.state.camera.deadzone = new Phaser.Rectangle(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    this.speed = 400;
    this.lastMove;

    this.state.input.onDown.addOnce(() => {
      let tween = this.state.add.tween(this)
        .to({y: this.state.game.height-(this.state.cellsManager.sizeCell*5+this.state.cellsManager.sizeCell/2)}, this.speed*2)
        .start();
      tween.onComplete.add(() => {
        this.move();
        setInterval(() => this.move(), this.speed);
      });
    }, this);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.state.cellsManager, (pl, cell) => {
      this.state.addScore(cell.score);

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
        tween.onComplete.add(() => this.state.state.start('Menu', true, false, this.state.score));
      }
    });
  }
  update() {
    this.rotation += .01;
  }
}

module.exports = Player;

},{"./Entity":5}],7:[function(require,module,exports){
module.exports=[
  {
    "chance": 10,
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
			this.state.start('Playground');
		});
	}
	update() {
		this.btn.rotation += .02;
	}
}

module.exports = Menu;

},{"../mixins/ui":3,"../objects/Entity":5}],10:[function(require,module,exports){
const ui = require('../mixins/ui');
const CellsManager = require('../managers/CellsManager');
const Player = require('../objects/Player');
const Entity = require('../objects/Entity');

class Playground {
	create() {
		this.world.setBounds(0, -this.game.height*1000, this.game.width, this.game.height*2000);

		this.physics.startSystem(Phaser.Physics.Arcade);

		this.bg = this.add.sprite(0, 0, 'bg');
		this.bg.width = this.game.width;
		this.bg.height = this.game.height;
		this.bg.fixedToCamera = true;

		this.cellsManager = new CellsManager(this);

		this.score = 0;

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

		this.island = this.add.sprite(0, this.game.height+10, 'island');
		this.island.anchor.set(0, 1);
		this.island.width = this.cellsManager.sizeCell*5;
		this.island.height = this.cellsManager.sizeCell*5;

		this.player = new Player(this);

		this.add.sprite(200, this.game.height-256, 'flag');
		this.add.sprite(600, this.game.height-356, 'flag').scale.x *= -1;
		this.add.sprite(400, this.game.height-400, 'flag').scale.x *= -1;
		this.add.sprite(100, this.game.height-300, 'flag');

		for(let y = 0; y < 4; y++) {
			for(let x = 0; x < this.game.width/50; x++) {
				if(Math.random() < .3) continue;
				let px = x*50;
				let py = this.game.height-y*50;
				new Entity(this, px, py, this.rnd.between(30, 50), false);
			}
		}

		let cloud1 = this.add.sprite(0, -2000, 'cloud1');
		cloud1.width = this.game.width-100;
		cloud1.height = 300;

		let cloud2 = this.add.sprite(0, -600, 'cloud2');
		cloud2.width = this.game.width;
		cloud2.height = 300;
	}
	addScore(v) {
		this.score += v;
	 	this.scoreText.text = this.score;
	}
	update(dt) {
    this.cellsManager.update(dt);
		this.player.update(dt);
	}
}

module.exports = Playground;

},{"../managers/CellsManager":2,"../mixins/ui":3,"../objects/Entity":5,"../objects/Player":6}],11:[function(require,module,exports){

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0NlbGxzTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21peGlucy91aS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvQ2VsbC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvRW50aXR5LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvb2JqZWN0cy9QbGF5ZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9vYmplY3RzL3R5cGVzLmpzb24iLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvQm9vdC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9NZW51LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc3RhdGVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvUHJlbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBCb290ID0gcmVxdWlyZSgnLi9zdGF0ZXMvQm9vdC5qcycpO1xyXG5jb25zdCBQcmVsb2FkID0gcmVxdWlyZSgnLi9zdGF0ZXMvUHJlbG9hZC5qcycpO1xyXG5jb25zdCBNZW51ID0gcmVxdWlyZSgnLi9zdGF0ZXMvTWVudS5qcycpO1xyXG5jb25zdCBQbGF5Z3JvdW5kID0gcmVxdWlyZSgnLi9zdGF0ZXMvUGxheWdyb3VuZC5qcycpO1xyXG5cclxudmFyIHJlYWR5ID0gKCkgPT4ge1xyXG5cdHZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDcyMCwgMTI4MCwgUGhhc2VyLkFVVE8sICdNb3R0aW9uJyk7XHJcblxyXG5cdGdhbWUuc3RhdGUuYWRkKCdCb290JywgQm9vdCwgdHJ1ZSk7XHJcbiAgZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCBQcmVsb2FkKTtcclxuICBnYW1lLnN0YXRlLmFkZCgnTWVudScsIE1lbnUpO1xyXG5cdGdhbWUuc3RhdGUuYWRkKCdQbGF5Z3JvdW5kJywgUGxheWdyb3VuZCk7XHJcbn1cclxuXHJcbnJlYWR5KCk7XHJcbiIsImNvbnN0IENlbGwgPSByZXF1aXJlKCcuLi9vYmplY3RzL0NlbGwnKTtcclxuY29uc3QgdHlwZXMgPSByZXF1aXJlKCcuLi9vYmplY3RzL3R5cGVzJyk7XHJcblxyXG5jbGFzcyBDZWxsc01hbmFnZXIgZXh0ZW5kcyBQaGFzZXIuR3JvdXAge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBzdXBlcihzdGF0ZS5nYW1lKTtcclxuXHJcbiAgICB0aGlzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuc2l6ZUNlbGwgPSBzdGF0ZS5nYW1lLndpZHRoLzU7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG4gICAgdGhpcy5jcmVhdGVDZWxscygpO1xyXG4gIH1cclxuICBjcmVhdGVDZWxscygpIHtcclxuICAgIHR5cGVzLnNvcnQoKGEsIGIpID0+IGEuY2hhbmNlIC0gYi5jaGFuY2UpO1xyXG5cclxuICAgIGZvcihsZXQgeSA9IDA7IHkgPCAxMDA7IHkrKykge1xyXG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgNTsgeCsrKSB7XHJcbiAgICAgICAgbGV0IHJhbmQgPSBNYXRoLnJhbmRvbSgpKjEwMDtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICBpZihyYW5kIDwgdHlwZXNbaV0uY2hhbmNlKSB7XHJcbiAgICAgICAgICAgICB0aGlzLmFkZChuZXcgQ2VsbCh0aGlzLCB0eXBlc1tpXSwgeCwgeSkpO1xyXG4gICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IDEwMDsgeSsrKSB7XHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCA1OyB4KyspIHtcclxuICAgICAgICBpZih5KzEgPCAxMDApIHRoaXMuY2hpbGRyZW5beSo1K3hdLnRvcFBhbmVsID0gdGhpcy5jaGlsZHJlblsoeSsxKSo1K3hdO1xyXG4gICAgICAgIGlmKHgtMSA+PSAwKSB0aGlzLmNoaWxkcmVuW3kqNSt4XS5sZWZ0UGFuZWwgPSB0aGlzLmNoaWxkcmVuW3kqNSt4LTFdO1xyXG4gICAgICAgIGlmKHgrMSA8IDUpIHRoaXMuY2hpbGRyZW5beSo1K3hdLnJpZ2h0UGFuZWwgPSB0aGlzLmNoaWxkcmVuW3kqNSt4KzFdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG5cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsbHNNYW5hZ2VyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjcmVhdGVCZyhzdGF0ZSwgc2l6ZT0xMDAsIGF4PTIwLCBheT0yMCkge1xyXG4gICAgbGV0IGJnID0gc3RhdGUuYWRkLmdyYXBoaWNzKCk7XHJcbiAgICBiZy5iZWdpbkZpbGwoMHhGRkZGRkYsIDEpO1xyXG4gICAgYmcuZHJhd1JlY3QoMCwgMCwgc3RhdGUuZ2FtZS53aWR0aCwgc3RhdGUuZ2FtZS5oZWlnaHQpO1xyXG4gICAgYmcuZW5kRmlsbCgpO1xyXG5cclxuICAgIGJnLmxpbmVTdHlsZSg0LCAweDJlMmU0NCwgLjEpO1xyXG5cclxuICAgIGZvcihsZXQgeCA9IDA7IHggPCBheDsgeCsrKSB7XHJcbiAgICAgIGJnLm1vdmVUbyhzaXplKngsIDApO1xyXG4gICAgICBiZy5saW5lVG8oc2l6ZSp4LCBzdGF0ZS5nYW1lLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgYXk7IHkrKykge1xyXG4gICAgICBiZy5tb3ZlVG8oMCwgc2l6ZSp5KTtcclxuICAgICAgYmcubGluZVRvKHN0YXRlLmdhbWUud2lkdGgsIHNpemUqeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJnO1xyXG4gIH1cclxufVxyXG4iLCJjb25zdCB0eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcclxuXHJcbmNsYXNzIENlbGwgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcclxuICBjb25zdHJ1Y3RvcihtYW5hZ2VyLCB0eXBlLCB4LCB5KSB7XHJcbiAgICBzdXBlcihtYW5hZ2VyLmdhbWUsIDAsIDAsIHR5cGUuaW1nKTtcclxuXHJcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xyXG4gICAgdGhpcy5zdGF0ZSA9IG1hbmFnZXIuc3RhdGU7XHJcblxyXG4gICAgdGhpcy5zaXplID0gdGhpcy5zdGF0ZS5nYW1lLndpZHRoLzU7XHJcbiAgICB0aGlzLnBhZGRpbmcgPSAxMDtcclxuICAgIHRoaXMueCA9IHgqdGhpcy5zaXplK3RoaXMucGFkZGluZy8yO1xyXG4gICAgdGhpcy55ID0gdGhpcy5zdGF0ZS5nYW1lLmhlaWdodC0oNip0aGlzLnNpemUpLXkqdGhpcy5zaXplK3RoaXMucGFkZGluZy8yO1xyXG4gICAgdGhpcy53aWR0aCA9IHRoaXMuc2l6ZS10aGlzLnBhZGRpbmc7XHJcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMuc2l6ZS10aGlzLnBhZGRpbmc7XHJcblxyXG4gICAgdGhpcy5pc09wZW4gPSB0eXBlLmlzT3BlbjtcclxuICAgIHRoaXMuaXNHb29kID0gdHlwZS5pc0dvb2Q7XHJcbiAgICB0aGlzLnNjb3JlID0gdHlwZS5zY29yZTtcclxuXHJcbiAgICBpZih0eXBlLmlzQ2xpY2spIHtcclxuICAgICAgdGhpcy5jZWxsT3BlbiA9IHRoaXMuc3RhdGUuYWRkLnNwcml0ZSh0aGlzLngrdGhpcy5zaXplLzItdGhpcy5wYWRkaW5nLzIsIHRoaXMueSt0aGlzLnNpemUvMi10aGlzLnBhZGRpbmcvMiwgdHlwZS5pbWdDbGljayk7XHJcbiAgICAgIHRoaXMuY2VsbE9wZW4ud2lkdGggPSAwO1xyXG4gICAgICB0aGlzLmNlbGxPcGVuLmhlaWdodCA9IDA7XHJcbiAgICAgIHRoaXMuY2VsbE9wZW4uYWxwaGEgPSAwO1xyXG4gICAgICB0aGlzLmNlbGxPcGVuLmFuY2hvci5zZXQoLjUpO1xyXG5cclxuICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzLmNlbGxPcGVuKVxyXG4gICAgXHRcdFx0LnRvKHthbHBoYTogMSwgd2lkdGg6IHRoaXMuc2l6ZS10aGlzLnBhZGRpbmcsIGhlaWdodDogdGhpcy5zaXplLXRoaXMucGFkZGluZ30sIDIwMClcclxuICAgIFx0XHRcdC5zdGFydCgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gfVxyXG4gIC8vIHVwZGF0ZShkdCkge1xyXG4gIC8vIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDZWxsO1xyXG4iLCJjbGFzcyBFbnRpdHkgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSwgeCwgeSwgciwgaXNBcmNzLCBzY2FsZT0xLjUpIHtcclxuICAgIHN1cGVyKHN0YXRlLmdhbWUsIHgsIHksICdwbGF5ZXInKTtcclxuICAgIHN0YXRlLmFkZC5leGlzdGluZyh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgdGhpcy53aWR0aCA9IHI7XHJcbiAgICB0aGlzLmhlaWdodCA9IHI7XHJcbiAgICB0aGlzLmFuY2hvci5zZXQoLjUpO1xyXG5cclxuICAgIHRoaXMuYXJjU2NhbGUgPSBzY2FsZTtcclxuXHJcbiAgICBpZihpc0FyY3MpIHtcclxuICAgICAgdGhpcy5jcmVhdGVBcmMoLS44LCAtMSwgLjksIDEsIDB4MzczZmZmKTtcclxuICAgICAgdGhpcy5jcmVhdGVBcmMoLjksIC0uOCwgLTEsIC45LCAweGZmMzczNyk7XHJcbiAgICAgIHRoaXMuY3JlYXRlQXJjKC0uOCwgLjksIC44LCAtMSwgMHg0Mjg2M2MpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUFyYyguOCwgLjksIC0uOCwgLS44LCAweDgyNDJhYSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJhbmQgPSB0aGlzLnN0YXRlLnJuZC5iZXR3ZWVuKDMwMCwgMTAwMCk7XHJcbiAgICBsZXQgc2MgPSB0aGlzLnN0YXRlLnJuZC5iZXR3ZWVuKDUsIDQwKTtcclxuICAgIHRoaXMudHdlZW5CcmVhdGhlID0gdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgLnRvKHt3aWR0aDogcitzYywgaGVpZ2h0OiByK3NjfSwgcmFuZClcclxuICAgICAgLnRvKHt3aWR0aDogciwgaGVpZ2h0OiByfSwgcmFuZClcclxuICAgICAgLnlveW8oKVxyXG4gICAgICAubG9vcCgpXHJcbiAgICAgIC5zdGFydCgpO1xyXG4gIH1cclxuICBjcmVhdGVBcmMoc3gsIHN5LCBleCwgZXksIHRpbnQpIHtcclxuICAgIGxldCBhcmMgPSB0aGlzLnN0YXRlLm1ha2Uuc3ByaXRlKHRoaXMud2lkdGgqc3gvdGhpcy5hcmNTY2FsZSwgdGhpcy5oZWlnaHQqc3kvdGhpcy5hcmNTY2FsZSwgJ3BsYXllcicpO1xyXG5cclxuICAgIGFyYy50aW50ID0gdGludDtcclxuICAgIGFyYy53aWR0aCA9IDMwO1xyXG4gICAgYXJjLmhlaWdodCA9IDMwO1xyXG4gICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4oYXJjKVxyXG4gICAgICAudG8oe3g6IHRoaXMud2lkdGgqZXgvdGhpcy5hcmNTY2FsZSwgeTogdGhpcy5oZWlnaHQqZXkvdGhpcy5hcmNTY2FsZSwgd2lkdGg6IDAsIGhlaWdodDogMH0sIHRoaXMuc3RhdGUucm5kLmJldHdlZW4oNTAwLCAxMDAwKSlcclxuICAgICAgLnRvKHt4OiB0aGlzLndpZHRoKnN4L3RoaXMuYXJjU2NhbGUsIHk6IHRoaXMuaGVpZ2h0KnN5L3RoaXMuYXJjU2NhbGV9LCB0aGlzLnN0YXRlLnJuZC5iZXR3ZWVuKDMwMCwgNjAwKSlcclxuICAgICAgLnRvKHt3aWR0aDogMzAsIGhlaWdodDogMzB9LCB0aGlzLnN0YXRlLnJuZC5iZXR3ZWVuKDUwMCwgMTAwMCkpXHJcbiAgICAgIC55b3lvKClcclxuICAgICAgLmxvb3AoKVxyXG4gICAgICAuc3RhcnQoKTtcclxuICAgIHRoaXMuYWRkQ2hpbGQoYXJjKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG4iLCJjb25zdCBFbnRpdHkgPSByZXF1aXJlKCcuL0VudGl0eScpO1xyXG5cclxuY2xhc3MgUGxheWVyIGV4dGVuZHMgRW50aXR5IHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgc3VwZXIoc3RhdGUsIHN0YXRlLmdhbWUud2lkdGgvMiwgc3RhdGUuZ2FtZS5oZWlnaHQtNDAwLCA3MCwgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5waHlzaWNzLmFyY2FkZS5lbmFibGUodGhpcyk7XHJcbiAgICB0aGlzLmJvZHkuc2V0U2l6ZSh0aGlzLndpZHRoLzItMSwgdGhpcy5oZWlnaHQvMi0xLCAxLCAxKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLmNhbWVyYS5mb2xsb3codGhpcyk7XHJcblx0XHR0aGlzLnN0YXRlLmNhbWVyYS5kZWFkem9uZSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKHRoaXMueC10aGlzLndpZHRoLzIsIHRoaXMueS10aGlzLmhlaWdodC8yLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgdGhpcy5zcGVlZCA9IDQwMDtcclxuICAgIHRoaXMubGFzdE1vdmU7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5pbnB1dC5vbkRvd24uYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgIGxldCB0d2VlbiA9IHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgLnRvKHt5OiB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LSh0aGlzLnN0YXRlLmNlbGxzTWFuYWdlci5zaXplQ2VsbCo1K3RoaXMuc3RhdGUuY2VsbHNNYW5hZ2VyLnNpemVDZWxsLzIpfSwgdGhpcy5zcGVlZCoyKVxyXG4gICAgICAgIC5zdGFydCgpO1xyXG4gICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKCk7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5tb3ZlKCksIHRoaXMuc3BlZWQpO1xyXG4gICAgICB9KTtcclxuICAgIH0sIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgbW92ZSgpIHtcclxuICAgIHRoaXMuc3RhdGUucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLCB0aGlzLnN0YXRlLmNlbGxzTWFuYWdlciwgKHBsLCBjZWxsKSA9PiB7XHJcbiAgICAgIHRoaXMuc3RhdGUuYWRkU2NvcmUoY2VsbC5zY29yZSk7XHJcblxyXG4gICAgICBpZihjZWxsLnRvcFBhbmVsICYmIGNlbGwudG9wUGFuZWwuaXNPcGVuICYmIGNlbGwudG9wUGFuZWwuaXNHb29kKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eTogY2VsbC50b3BQYW5lbC55K2NlbGwud2lkdGgvMn0sIHRoaXMuc3BlZWQpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLmxhc3RNb3ZlID0gJ3RvcCc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZih0aGlzLmxhc3RNb3ZlICE9PSAnbGVmdCcgJiYgY2VsbC5yaWdodFBhbmVsICYmIGNlbGwucmlnaHRQYW5lbC5pc09wZW4gJiYgY2VsbC5yaWdodFBhbmVsLmlzR29vZCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3g6IGNlbGwucmlnaHRQYW5lbC54K2NlbGwud2lkdGgvMn0sIHRoaXMuc3BlZWQpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLmxhc3RNb3ZlID0gJ3JpZ2h0JztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKHRoaXMubGFzdE1vdmUgIT09ICdyaWdodCcgJiYgY2VsbC5sZWZ0UGFuZWwgJiYgY2VsbC5sZWZ0UGFuZWwuaXNPcGVuICYmIGNlbGwubGVmdFBhbmVsLmlzR29vZCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3g6IGNlbGwubGVmdFBhbmVsLngrY2VsbC53aWR0aC8yfSwgdGhpcy5zcGVlZClcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSAnbGVmdCc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IHR3ZWVuID0gdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eTogY2VsbC50b3BQYW5lbC55K2NlbGwud2lkdGgvMiwgYWxwaGE6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDB9LCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4gdGhpcy5zdGF0ZS5zdGF0ZS5zdGFydCgnTWVudScsIHRydWUsIGZhbHNlLCB0aGlzLnN0YXRlLnNjb3JlKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uICs9IC4wMTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cz1bXHJcbiAge1xyXG4gICAgXCJjaGFuY2VcIjogMTAsXHJcbiAgICBcImltZ1wiOiBcImNlbGwzXCIsXHJcbiAgICBcImlzT3BlblwiOiB0cnVlLFxyXG4gICAgXCJpc0NsaWNrXCI6IGZhbHNlLFxyXG4gICAgXCJzY29yZVwiOiAxMCxcclxuICAgIFwiaXNHb29kXCI6IHRydWVcclxuICB9LFxyXG4gIHtcclxuICAgIFwiY2hhbmNlXCI6IDIwLFxyXG4gICAgXCJpbWdcIjogXCJjZWxsMlwiLFxyXG4gICAgXCJpc09wZW5cIjogZmFsc2UsXHJcbiAgICBcImlzQ2xpY2tcIjogZmFsc2UsXHJcbiAgICBcInNjb3JlXCI6IDAsXHJcbiAgICBcImlzR29vZFwiOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJpbWdcIjogXCJjZWxsXCIsXHJcbiAgICBcImNoYW5jZVwiOiAxMDAsXHJcbiAgICBcImltZ0NsaWNrXCI6IFwiY2VsbC1vcGVuXCIsXHJcbiAgICBcImlzT3BlblwiOiBmYWxzZSxcclxuICAgIFwiaXNDbGlja1wiOiB0cnVlLFxyXG4gICAgXCJzY29yZVwiOiAxLFxyXG4gICAgXCJpc0dvb2RcIjogdHJ1ZVxyXG4gIH1cclxuXVxyXG4iLCJjbGFzcyBCb290IHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG5cdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5zY2FsZS5zZXRNYXhpbXVtKCk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb290O1xyXG4iLCJjb25zdCB1aSA9IHJlcXVpcmUoJy4uL21peGlucy91aScpO1xyXG5jb25zdCBFbnRpdHkgPSByZXF1aXJlKCcuLi9vYmplY3RzL0VudGl0eScpO1xyXG5cclxuY2xhc3MgTWVudSB7XHJcblx0aW5pdChzY29yZSA9IDApIHtcclxuXHRcdGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2NvcmVcIikgPCBzY29yZSB8fCAhbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzY29yZVwiKSlcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzY29yZVwiLCBzY29yZSk7XHJcblxyXG5cdFx0dGhpcy5iZyA9IHVpLmNyZWF0ZUJnKHRoaXMsIHRoaXMuZ2FtZS53aWR0aC81LCA1LCAxMCk7XHJcblxyXG4gICAgdGhpcy5sYWJlbCA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoLzIsIDMwMCwgXCJNb3R0aW9uXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDY0LFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcblx0XHRcdGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCJyZ2IoNTIsIDYxLCA4NClcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmxhYmVsLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICB0aGlzLnRleHQgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAzNTAsIFwiaG9wZWxlc3NuZXNzIGluIG1vdGlvbi4uLlwiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA0MixcclxuICAgICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgICBmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMudGV4dC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG5cdFx0dGhpcy5jdXJyZW50U2NvcmUgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCA0NTAsICdDVVJSRU5UIFNDT1JFOiAnICsgc2NvcmUsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDQyLFxyXG4gICAgICBmb250V2VpZ2h0OiA1MDAsXHJcbiAgICAgIGZpbGw6IFwicmdiKDUyLCA2MSwgODQpXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5jdXJyZW50U2NvcmUuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuXHRcdHRoaXMuYmVzdFNjb3JlID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgNTUwLCAnQkVTVCBTQ09SRTogJyArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzY29yZScpLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA0MixcclxuICAgICAgZm9udFdlaWdodDogNTAwLFxyXG4gICAgICBmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMuYmVzdFNjb3JlLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICB0aGlzLmJ0biA9IG5ldyBFbnRpdHkodGhpcywgdGhpcy5nYW1lLndpZHRoLzIsIHRoaXMuZ2FtZS5oZWlnaHQvMisxMDAsIDIwMCwgdHJ1ZSwgNSk7XHJcblx0XHR0aGlzLmJ0bi5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5idG4uZXZlbnRzLm9uSW5wdXRVcC5hZGRPbmNlKCgpID0+IHtcclxuXHRcdFx0dGhpcy5zdGF0ZS5zdGFydCgnUGxheWdyb3VuZCcpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdHRoaXMuYnRuLnJvdGF0aW9uICs9IC4wMjtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiY29uc3QgdWkgPSByZXF1aXJlKCcuLi9taXhpbnMvdWknKTtcclxuY29uc3QgQ2VsbHNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvQ2VsbHNNYW5hZ2VyJyk7XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4uL29iamVjdHMvUGxheWVyJyk7XHJcbmNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4uL29iamVjdHMvRW50aXR5Jyk7XHJcblxyXG5jbGFzcyBQbGF5Z3JvdW5kIHtcclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLndvcmxkLnNldEJvdW5kcygwLCAtdGhpcy5nYW1lLmhlaWdodCoxMDAwLCB0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQqMjAwMCk7XHJcblxyXG5cdFx0dGhpcy5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFyY2FkZSk7XHJcblxyXG5cdFx0dGhpcy5iZyA9IHRoaXMuYWRkLnNwcml0ZSgwLCAwLCAnYmcnKTtcclxuXHRcdHRoaXMuYmcud2lkdGggPSB0aGlzLmdhbWUud2lkdGg7XHJcblx0XHR0aGlzLmJnLmhlaWdodCA9IHRoaXMuZ2FtZS5oZWlnaHQ7XHJcblx0XHR0aGlzLmJnLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuY2VsbHNNYW5hZ2VyID0gbmV3IENlbGxzTWFuYWdlcih0aGlzKTtcclxuXHJcblx0XHR0aGlzLnNjb3JlID0gMDtcclxuXHJcbiAgICB0aGlzLmxhYmVsID0gdGhpcy5hZGQudGV4dCg1MCwgNTAsIFwiRXhpc3RlbmNlOlwiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA2NCxcclxuICAgICAgZm9udFdlaWdodDogNDAwLFxyXG4gICAgICBmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXHJcbiAgICB9KTtcclxuXHRcdHRoaXMubGFiZWwuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcbiAgICB0aGlzLnNjb3JlVGV4dCA9IHRoaXMuYWRkLnRleHQoNTAsIDEyMCwgXCJaRVJPIFRBUFNcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogNDIsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDQwMCxcclxuICAgICAgZmlsbDogXCJyZ2IoNTIsIDYxLCA4NClcIlxyXG4gICAgfSk7XHJcblx0XHR0aGlzLnNjb3JlVGV4dC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuXHJcblx0XHR0aGlzLmlzbGFuZCA9IHRoaXMuYWRkLnNwcml0ZSgwLCB0aGlzLmdhbWUuaGVpZ2h0KzEwLCAnaXNsYW5kJyk7XHJcblx0XHR0aGlzLmlzbGFuZC5hbmNob3Iuc2V0KDAsIDEpO1xyXG5cdFx0dGhpcy5pc2xhbmQud2lkdGggPSB0aGlzLmNlbGxzTWFuYWdlci5zaXplQ2VsbCo1O1xyXG5cdFx0dGhpcy5pc2xhbmQuaGVpZ2h0ID0gdGhpcy5jZWxsc01hbmFnZXIuc2l6ZUNlbGwqNTtcclxuXHJcblx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcyk7XHJcblxyXG5cdFx0dGhpcy5hZGQuc3ByaXRlKDIwMCwgdGhpcy5nYW1lLmhlaWdodC0yNTYsICdmbGFnJyk7XHJcblx0XHR0aGlzLmFkZC5zcHJpdGUoNjAwLCB0aGlzLmdhbWUuaGVpZ2h0LTM1NiwgJ2ZsYWcnKS5zY2FsZS54ICo9IC0xO1xyXG5cdFx0dGhpcy5hZGQuc3ByaXRlKDQwMCwgdGhpcy5nYW1lLmhlaWdodC00MDAsICdmbGFnJykuc2NhbGUueCAqPSAtMTtcclxuXHRcdHRoaXMuYWRkLnNwcml0ZSgxMDAsIHRoaXMuZ2FtZS5oZWlnaHQtMzAwLCAnZmxhZycpO1xyXG5cclxuXHRcdGZvcihsZXQgeSA9IDA7IHkgPCA0OyB5KyspIHtcclxuXHRcdFx0Zm9yKGxldCB4ID0gMDsgeCA8IHRoaXMuZ2FtZS53aWR0aC81MDsgeCsrKSB7XHJcblx0XHRcdFx0aWYoTWF0aC5yYW5kb20oKSA8IC4zKSBjb250aW51ZTtcclxuXHRcdFx0XHRsZXQgcHggPSB4KjUwO1xyXG5cdFx0XHRcdGxldCBweSA9IHRoaXMuZ2FtZS5oZWlnaHQteSo1MDtcclxuXHRcdFx0XHRuZXcgRW50aXR5KHRoaXMsIHB4LCBweSwgdGhpcy5ybmQuYmV0d2VlbigzMCwgNTApLCBmYWxzZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgY2xvdWQxID0gdGhpcy5hZGQuc3ByaXRlKDAsIC0yMDAwLCAnY2xvdWQxJyk7XHJcblx0XHRjbG91ZDEud2lkdGggPSB0aGlzLmdhbWUud2lkdGgtMTAwO1xyXG5cdFx0Y2xvdWQxLmhlaWdodCA9IDMwMDtcclxuXHJcblx0XHRsZXQgY2xvdWQyID0gdGhpcy5hZGQuc3ByaXRlKDAsIC02MDAsICdjbG91ZDInKTtcclxuXHRcdGNsb3VkMi53aWR0aCA9IHRoaXMuZ2FtZS53aWR0aDtcclxuXHRcdGNsb3VkMi5oZWlnaHQgPSAzMDA7XHJcblx0fVxyXG5cdGFkZFNjb3JlKHYpIHtcclxuXHRcdHRoaXMuc2NvcmUgKz0gdjtcclxuXHQgXHR0aGlzLnNjb3JlVGV4dC50ZXh0ID0gdGhpcy5zY29yZTtcclxuXHR9XHJcblx0dXBkYXRlKGR0KSB7XHJcbiAgICB0aGlzLmNlbGxzTWFuYWdlci51cGRhdGUoZHQpO1xyXG5cdFx0dGhpcy5wbGF5ZXIudXBkYXRlKGR0KTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWdyb3VuZDtcclxuIiwiXHJcbmNsYXNzIFByZWxvYWQge1xyXG5cdGluaXQoKSB7XHJcblx0fVxyXG5cdHByZWxvYWQoKSB7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwnLCAnYXNzZXRzL2NlbGwucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwtb3BlbicsICdhc3NldHMvY2VsbC1vcGVuLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsMicsICdhc3NldHMvY2VsbDIucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwzJywgJ2Fzc2V0cy9jZWxsMy5wbmcnKTtcclxuXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9iZy5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGxheWVyJywgJ2Fzc2V0cy9wbGF5ZXIucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2lzbGFuZCcsICdhc3NldHMvaXNsYW5kLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdmbGFnJywgJ2Fzc2V0cy9mbGFnLnBuZycpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2xvdWQxJywgJ2Fzc2V0cy9jbG91ZDEucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2Nsb3VkMicsICdhc3NldHMvY2xvdWQyLnBuZycpO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnTWVudScpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2FkO1xyXG4iXX0=
