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

    this.speed = 340;
    this.lastMove;

    this.state.input.onDown.addOnce(() => {
      this.state.add.tween(this)
        .to({y: this.state.game.height-(this.state.cellsManager.sizeCell*5+this.state.cellsManager.sizeCell/2)}, 2000)
        .start();
    }, this);


    setInterval(() => this.move(), this.speed);
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
        tween.onComplete.add(() => this.state.state.start('Menu'));
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
	create() {
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

		for(let y = 0; y < 5; y++) {
			for(let x = 0; x < this.game.width/50; x++) {
				let px = x*this.rnd.between(40, 60);
				let py = this.game.height-y*this.rnd.between(20, 50);
				new Entity(this, px, py, this.rnd.between(30, 50), false);
			}
		}

	}
	addScore(v) {
		let num = this.score += v;

    let digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;

	  while(i--)
	    roman = (key[+digits.pop() + (i * 10)] || "") + roman;

	 	this.scoreText.text = Array(+digits.join("") + 1).join("M") + roman + '  TAPS';
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
	}

	create() {
		this.state.start('Menu');
	}
}

module.exports = Preload;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0NlbGxzTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21peGlucy91aS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvQ2VsbC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvRW50aXR5LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvb2JqZWN0cy9QbGF5ZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9vYmplY3RzL3R5cGVzLmpzb24iLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvQm9vdC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9NZW51LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc3RhdGVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvUHJlbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IEJvb3QgPSByZXF1aXJlKCcuL3N0YXRlcy9Cb290LmpzJyk7XHJcbmNvbnN0IFByZWxvYWQgPSByZXF1aXJlKCcuL3N0YXRlcy9QcmVsb2FkLmpzJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL3N0YXRlcy9NZW51LmpzJyk7XHJcbmNvbnN0IFBsYXlncm91bmQgPSByZXF1aXJlKCcuL3N0YXRlcy9QbGF5Z3JvdW5kLmpzJyk7XHJcblxyXG52YXIgcmVhZHkgPSAoKSA9PiB7XHJcblx0dmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoNzIwLCAxMjgwLCBQaGFzZXIuQVVUTywgJ01vdHRpb24nKTtcclxuXHJcblx0Z2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCBCb290LCB0cnVlKTtcclxuICBnYW1lLnN0YXRlLmFkZCgnUHJlbG9hZCcsIFByZWxvYWQpO1xyXG4gIGdhbWUuc3RhdGUuYWRkKCdNZW51JywgTWVudSk7XHJcblx0Z2FtZS5zdGF0ZS5hZGQoJ1BsYXlncm91bmQnLCBQbGF5Z3JvdW5kKTtcclxufVxyXG5cclxucmVhZHkoKTtcclxuIiwiY29uc3QgQ2VsbCA9IHJlcXVpcmUoJy4uL29iamVjdHMvQ2VsbCcpO1xyXG5jb25zdCB0eXBlcyA9IHJlcXVpcmUoJy4uL29iamVjdHMvdHlwZXMnKTtcclxuXHJcbmNsYXNzIENlbGxzTWFuYWdlciBleHRlbmRzIFBoYXNlci5Hcm91cCB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIHN1cGVyKHN0YXRlLmdhbWUpO1xyXG5cclxuICAgIHRoaXMuZW5hYmxlQm9keSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5zaXplQ2VsbCA9IHN0YXRlLmdhbWUud2lkdGgvNTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLmNyZWF0ZUNlbGxzKCk7XHJcbiAgfVxyXG4gIGNyZWF0ZUNlbGxzKCkge1xyXG4gICAgdHlwZXMuc29ydCgoYSwgYikgPT4gYS5jaGFuY2UgLSBiLmNoYW5jZSk7XHJcblxyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IDEwMDsgeSsrKSB7XHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCA1OyB4KyspIHtcclxuICAgICAgICBsZXQgcmFuZCA9IE1hdGgucmFuZG9tKCkqMTAwO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgIGlmKHJhbmQgPCB0eXBlc1tpXS5jaGFuY2UpIHtcclxuICAgICAgICAgICAgIHRoaXMuYWRkKG5ldyBDZWxsKHRoaXMsIHR5cGVzW2ldLCB4LCB5KSk7XHJcbiAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgMTAwOyB5KyspIHtcclxuICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IDU7IHgrKykge1xyXG4gICAgICAgIGlmKHkrMSA8IDEwMCkgdGhpcy5jaGlsZHJlblt5KjUreF0udG9wUGFuZWwgPSB0aGlzLmNoaWxkcmVuWyh5KzEpKjUreF07XHJcbiAgICAgICAgaWYoeC0xID49IDApIHRoaXMuY2hpbGRyZW5beSo1K3hdLmxlZnRQYW5lbCA9IHRoaXMuY2hpbGRyZW5beSo1K3gtMV07XHJcbiAgICAgICAgaWYoeCsxIDwgNSkgdGhpcy5jaGlsZHJlblt5KjUreF0ucmlnaHRQYW5lbCA9IHRoaXMuY2hpbGRyZW5beSo1K3grMV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgdXBkYXRlKGR0KSB7XHJcblxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDZWxsc01hbmFnZXI7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGNyZWF0ZUJnKHN0YXRlLCBzaXplPTEwMCwgYXg9MjAsIGF5PTIwKSB7XHJcbiAgICBsZXQgYmcgPSBzdGF0ZS5hZGQuZ3JhcGhpY3MoKTtcclxuICAgIGJnLmJlZ2luRmlsbCgweEZGRkZGRiwgMSk7XHJcbiAgICBiZy5kcmF3UmVjdCgwLCAwLCBzdGF0ZS5nYW1lLndpZHRoLCBzdGF0ZS5nYW1lLmhlaWdodCk7XHJcbiAgICBiZy5lbmRGaWxsKCk7XHJcblxyXG4gICAgYmcubGluZVN0eWxlKDQsIDB4MmUyZTQ0LCAuMSk7XHJcblxyXG4gICAgZm9yKGxldCB4ID0gMDsgeCA8IGF4OyB4KyspIHtcclxuICAgICAgYmcubW92ZVRvKHNpemUqeCwgMCk7XHJcbiAgICAgIGJnLmxpbmVUbyhzaXplKngsIHN0YXRlLmdhbWUuaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgeSA9IDA7IHkgPCBheTsgeSsrKSB7XHJcbiAgICAgIGJnLm1vdmVUbygwLCBzaXplKnkpO1xyXG4gICAgICBiZy5saW5lVG8oc3RhdGUuZ2FtZS53aWR0aCwgc2l6ZSp5KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYmc7XHJcbiAgfVxyXG59XHJcbiIsImNvbnN0IHR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xyXG5cclxuY2xhc3MgQ2VsbCBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKG1hbmFnZXIsIHR5cGUsIHgsIHkpIHtcclxuICAgIHN1cGVyKG1hbmFnZXIuZ2FtZSwgMCwgMCwgdHlwZS5pbWcpO1xyXG5cclxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICB0aGlzLnN0YXRlID0gbWFuYWdlci5zdGF0ZTtcclxuXHJcbiAgICB0aGlzLnNpemUgPSB0aGlzLnN0YXRlLmdhbWUud2lkdGgvNTtcclxuICAgIHRoaXMucGFkZGluZyA9IDEwO1xyXG4gICAgdGhpcy54ID0geCp0aGlzLnNpemUrdGhpcy5wYWRkaW5nLzI7XHJcbiAgICB0aGlzLnkgPSB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LSg2KnRoaXMuc2l6ZSkteSp0aGlzLnNpemUrdGhpcy5wYWRkaW5nLzI7XHJcbiAgICB0aGlzLndpZHRoID0gdGhpcy5zaXplLXRoaXMucGFkZGluZztcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5zaXplLXRoaXMucGFkZGluZztcclxuXHJcbiAgICB0aGlzLmlzT3BlbiA9IHR5cGUuaXNPcGVuO1xyXG4gICAgdGhpcy5pc0dvb2QgPSB0eXBlLmlzR29vZDtcclxuICAgIHRoaXMuc2NvcmUgPSB0eXBlLnNjb3JlO1xyXG5cclxuICAgIGlmKHR5cGUuaXNDbGljaykge1xyXG4gICAgICB0aGlzLmNlbGxPcGVuID0gdGhpcy5zdGF0ZS5hZGQuc3ByaXRlKHRoaXMueCt0aGlzLnNpemUvMi10aGlzLnBhZGRpbmcvMiwgdGhpcy55K3RoaXMuc2l6ZS8yLXRoaXMucGFkZGluZy8yLCB0eXBlLmltZ0NsaWNrKTtcclxuICAgICAgdGhpcy5jZWxsT3Blbi53aWR0aCA9IDA7XHJcbiAgICAgIHRoaXMuY2VsbE9wZW4uaGVpZ2h0ID0gMDtcclxuICAgICAgdGhpcy5jZWxsT3Blbi5hbHBoYSA9IDA7XHJcbiAgICAgIHRoaXMuY2VsbE9wZW4uYW5jaG9yLnNldCguNSk7XHJcblxyXG4gICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuZXZlbnRzLm9uSW5wdXRVcC5hZGRPbmNlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMuY2VsbE9wZW4pXHJcbiAgICBcdFx0XHQudG8oe2FscGhhOiAxLCB3aWR0aDogdGhpcy5zaXplLXRoaXMucGFkZGluZywgaGVpZ2h0OiB0aGlzLnNpemUtdGhpcy5wYWRkaW5nfSwgMjAwKVxyXG4gICAgXHRcdFx0LnN0YXJ0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyB9XHJcbiAgLy8gdXBkYXRlKGR0KSB7XHJcbiAgLy8gfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENlbGw7XHJcbiIsImNsYXNzIEVudGl0eSBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlLCB4LCB5LCByLCBpc0FyY3MsIHNjYWxlPTEuNSkge1xyXG4gICAgc3VwZXIoc3RhdGUuZ2FtZSwgeCwgeSwgJ3BsYXllcicpO1xyXG4gICAgc3RhdGUuYWRkLmV4aXN0aW5nKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuXHJcbiAgICB0aGlzLndpZHRoID0gcjtcclxuICAgIHRoaXMuaGVpZ2h0ID0gcjtcclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSk7XHJcblxyXG4gICAgdGhpcy5hcmNTY2FsZSA9IHNjYWxlO1xyXG5cclxuICAgIGlmKGlzQXJjcykge1xyXG4gICAgICB0aGlzLmNyZWF0ZUFyYygtLjgsIC0xLCAuOSwgMSwgMHgzNzNmZmYpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUFyYyguOSwgLS44LCAtMSwgLjksIDB4ZmYzNzM3KTtcclxuICAgICAgdGhpcy5jcmVhdGVBcmMoLS44LCAuOSwgLjgsIC0xLCAweDQyODYzYyk7XHJcbiAgICAgIHRoaXMuY3JlYXRlQXJjKC44LCAuOSwgLS44LCAtLjgsIDB4ODI0MmFhKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmFuZCA9IHRoaXMuc3RhdGUucm5kLmJldHdlZW4oMzAwLCAxMDAwKTtcclxuICAgIGxldCBzYyA9IHRoaXMuc3RhdGUucm5kLmJldHdlZW4oNSwgNDApO1xyXG4gICAgdGhpcy50d2VlbkJyZWF0aGUgPSB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAudG8oe3dpZHRoOiByK3NjLCBoZWlnaHQ6IHIrc2N9LCByYW5kKVxyXG4gICAgICAudG8oe3dpZHRoOiByLCBoZWlnaHQ6IHJ9LCByYW5kKVxyXG4gICAgICAueW95bygpXHJcbiAgICAgIC5sb29wKClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIGNyZWF0ZUFyYyhzeCwgc3ksIGV4LCBleSwgdGludCkge1xyXG4gICAgbGV0IGFyYyA9IHRoaXMuc3RhdGUubWFrZS5zcHJpdGUodGhpcy53aWR0aCpzeC90aGlzLmFyY1NjYWxlLCB0aGlzLmhlaWdodCpzeS90aGlzLmFyY1NjYWxlLCAncGxheWVyJyk7XHJcblxyXG4gICAgYXJjLnRpbnQgPSB0aW50O1xyXG4gICAgYXJjLndpZHRoID0gMzA7XHJcbiAgICBhcmMuaGVpZ2h0ID0gMzA7XHJcbiAgICB0aGlzLnN0YXRlLmFkZC50d2VlbihhcmMpXHJcbiAgICAgIC50byh7eDogdGhpcy53aWR0aCpleC90aGlzLmFyY1NjYWxlLCB5OiB0aGlzLmhlaWdodCpleS90aGlzLmFyY1NjYWxlLCB3aWR0aDogMCwgaGVpZ2h0OiAwfSwgdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbig1MDAsIDEwMDApKVxyXG4gICAgICAudG8oe3g6IHRoaXMud2lkdGgqc3gvdGhpcy5hcmNTY2FsZSwgeTogdGhpcy5oZWlnaHQqc3kvdGhpcy5hcmNTY2FsZX0sIHRoaXMuc3RhdGUucm5kLmJldHdlZW4oMzAwLCA2MDApKVxyXG4gICAgICAudG8oe3dpZHRoOiAzMCwgaGVpZ2h0OiAzMH0sIHRoaXMuc3RhdGUucm5kLmJldHdlZW4oNTAwLCAxMDAwKSlcclxuICAgICAgLnlveW8oKVxyXG4gICAgICAubG9vcCgpXHJcbiAgICAgIC5zdGFydCgpO1xyXG4gICAgdGhpcy5hZGRDaGlsZChhcmMpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5Jyk7XHJcblxyXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBFbnRpdHkge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBzdXBlcihzdGF0ZSwgc3RhdGUuZ2FtZS53aWR0aC8yLCBzdGF0ZS5nYW1lLmhlaWdodC00MDAsIDcwLCB0cnVlKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzKTtcclxuICAgIHRoaXMuYm9keS5zZXRTaXplKHRoaXMud2lkdGgvMi0xLCB0aGlzLmhlaWdodC8yLTEsIDEsIDEpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuY2FtZXJhLmZvbGxvdyh0aGlzKTtcclxuXHRcdHRoaXMuc3RhdGUuY2FtZXJhLmRlYWR6b25lID0gbmV3IFBoYXNlci5SZWN0YW5nbGUodGhpcy54LXRoaXMud2lkdGgvMiwgdGhpcy55LXRoaXMuaGVpZ2h0LzIsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICB0aGlzLnNwZWVkID0gMzQwO1xyXG4gICAgdGhpcy5sYXN0TW92ZTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLmlucHV0Lm9uRG93bi5hZGRPbmNlKCgpID0+IHtcclxuICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAudG8oe3k6IHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQtKHRoaXMuc3RhdGUuY2VsbHNNYW5hZ2VyLnNpemVDZWxsKjUrdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuc2l6ZUNlbGwvMil9LCAyMDAwKVxyXG4gICAgICAgIC5zdGFydCgpO1xyXG4gICAgfSwgdGhpcyk7XHJcblxyXG5cclxuICAgIHNldEludGVydmFsKCgpID0+IHRoaXMubW92ZSgpLCB0aGlzLnNwZWVkKTtcclxuICB9XHJcblxyXG4gIG1vdmUoKSB7XHJcbiAgICB0aGlzLnN0YXRlLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcywgdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIsIChwbCwgY2VsbCkgPT4ge1xyXG4gICAgICB0aGlzLnN0YXRlLmFkZFNjb3JlKGNlbGwuc2NvcmUpO1xyXG5cclxuICAgICAgaWYoY2VsbC50b3BQYW5lbCAmJiBjZWxsLnRvcFBhbmVsLmlzT3BlbiAmJiBjZWxsLnRvcFBhbmVsLmlzR29vZCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3k6IGNlbGwudG9wUGFuZWwueStjZWxsLndpZHRoLzJ9LCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0TW92ZSA9ICd0b3AnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYodGhpcy5sYXN0TW92ZSAhPT0gJ2xlZnQnICYmIGNlbGwucmlnaHRQYW5lbCAmJiBjZWxsLnJpZ2h0UGFuZWwuaXNPcGVuICYmIGNlbGwucmlnaHRQYW5lbC5pc0dvb2QpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt4OiBjZWxsLnJpZ2h0UGFuZWwueCtjZWxsLndpZHRoLzJ9LCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0TW92ZSA9ICdyaWdodCc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZih0aGlzLmxhc3RNb3ZlICE9PSAncmlnaHQnICYmIGNlbGwubGVmdFBhbmVsICYmIGNlbGwubGVmdFBhbmVsLmlzT3BlbiAmJiBjZWxsLmxlZnRQYW5lbC5pc0dvb2QpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt4OiBjZWxsLmxlZnRQYW5lbC54K2NlbGwud2lkdGgvMn0sIHRoaXMuc3BlZWQpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLmxhc3RNb3ZlID0gJ2xlZnQnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCB0d2VlbiA9IHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3k6IGNlbGwudG9wUGFuZWwueStjZWxsLndpZHRoLzIsIGFscGhhOiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwfSwgdGhpcy5zcGVlZClcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHRoaXMuc3RhdGUuc3RhdGUuc3RhcnQoJ01lbnUnKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uICs9IC4wMTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cz1bXHJcbiAge1xyXG4gICAgXCJjaGFuY2VcIjogMTAsXHJcbiAgICBcImltZ1wiOiBcImNlbGwzXCIsXHJcbiAgICBcImlzT3BlblwiOiB0cnVlLFxyXG4gICAgXCJpc0NsaWNrXCI6IGZhbHNlLFxyXG4gICAgXCJzY29yZVwiOiAxMCxcclxuICAgIFwiaXNHb29kXCI6IHRydWVcclxuICB9LFxyXG4gIHtcclxuICAgIFwiY2hhbmNlXCI6IDIwLFxyXG4gICAgXCJpbWdcIjogXCJjZWxsMlwiLFxyXG4gICAgXCJpc09wZW5cIjogZmFsc2UsXHJcbiAgICBcImlzQ2xpY2tcIjogZmFsc2UsXHJcbiAgICBcInNjb3JlXCI6IDAsXHJcbiAgICBcImlzR29vZFwiOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJpbWdcIjogXCJjZWxsXCIsXHJcbiAgICBcImNoYW5jZVwiOiAxMDAsXHJcbiAgICBcImltZ0NsaWNrXCI6IFwiY2VsbC1vcGVuXCIsXHJcbiAgICBcImlzT3BlblwiOiBmYWxzZSxcclxuICAgIFwiaXNDbGlja1wiOiB0cnVlLFxyXG4gICAgXCJzY29yZVwiOiAxLFxyXG4gICAgXCJpc0dvb2RcIjogdHJ1ZVxyXG4gIH1cclxuXVxyXG4iLCJjbGFzcyBCb290IHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG5cdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5zY2FsZS5zZXRNYXhpbXVtKCk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb290O1xyXG4iLCJjb25zdCB1aSA9IHJlcXVpcmUoJy4uL21peGlucy91aScpO1xyXG5jb25zdCBFbnRpdHkgPSByZXF1aXJlKCcuLi9vYmplY3RzL0VudGl0eScpO1xyXG5cclxuY2xhc3MgTWVudSB7XHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5iZyA9IHVpLmNyZWF0ZUJnKHRoaXMsIHRoaXMuZ2FtZS53aWR0aC81LCA1LCAxMCk7XHJcblxyXG4gICAgdGhpcy5sYWJlbCA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoLzIsIDMwMCwgXCJNb3R0aW9uXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDY0LFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcblx0XHRcdGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCJyZ2IoNTIsIDYxLCA4NClcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmxhYmVsLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICB0aGlzLnRleHQgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAzNTAsIFwiaG9wZWxlc3NuZXNzIGluIG1vdGlvbi4uLlwiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA0MixcclxuICAgICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgICBmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMudGV4dC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG4gICAgdGhpcy5idG4gPSBuZXcgRW50aXR5KHRoaXMsIHRoaXMuZ2FtZS53aWR0aC8yLCB0aGlzLmdhbWUuaGVpZ2h0LzIrMTAwLCAyMDAsIHRydWUsIDUpO1xyXG5cdFx0dGhpcy5idG4uaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMuYnRuLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcblx0XHRcdHRoaXMuc3RhdGUuc3RhcnQoJ1BsYXlncm91bmQnKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblx0XHR0aGlzLmJ0bi5yb3RhdGlvbiArPSAuMDI7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7XHJcbiIsImNvbnN0IHVpID0gcmVxdWlyZSgnLi4vbWl4aW5zL3VpJyk7XHJcbmNvbnN0IENlbGxzTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL0NlbGxzTWFuYWdlcicpO1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuLi9vYmplY3RzL1BsYXllcicpO1xyXG5jb25zdCBFbnRpdHkgPSByZXF1aXJlKCcuLi9vYmplY3RzL0VudGl0eScpO1xyXG5cclxuY2xhc3MgUGxheWdyb3VuZCB7XHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy53b3JsZC5zZXRCb3VuZHMoMCwgLXRoaXMuZ2FtZS5oZWlnaHQqMTAwMCwgdGhpcy5nYW1lLndpZHRoLCB0aGlzLmdhbWUuaGVpZ2h0KjIwMDApO1xyXG5cclxuXHRcdHRoaXMucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BcmNhZGUpO1xyXG5cclxuXHRcdHRoaXMuYmcgPSB0aGlzLmFkZC5zcHJpdGUoMCwgMCwgJ2JnJyk7XHJcblx0XHR0aGlzLmJnLndpZHRoID0gdGhpcy5nYW1lLndpZHRoO1xyXG5cdFx0dGhpcy5iZy5oZWlnaHQgPSB0aGlzLmdhbWUuaGVpZ2h0O1xyXG5cdFx0dGhpcy5iZy5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuXHJcblx0XHR0aGlzLmNlbGxzTWFuYWdlciA9IG5ldyBDZWxsc01hbmFnZXIodGhpcyk7XHJcblxyXG5cdFx0dGhpcy5zY29yZSA9IDA7XHJcblxyXG4gICAgdGhpcy5sYWJlbCA9IHRoaXMuYWRkLnRleHQoNTAsIDUwLCBcIkV4aXN0ZW5jZTpcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogNjQsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDQwMCxcclxuICAgICAgZmlsbDogXCJyZ2IoNTIsIDYxLCA4NClcIlxyXG4gICAgfSk7XHJcblx0XHR0aGlzLmxhYmVsLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgdGhpcy5zY29yZVRleHQgPSB0aGlzLmFkZC50ZXh0KDUwLCAxMjAsIFwiWkVSTyBUQVBTXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDQyLFxyXG4gICAgICBmb250V2VpZ2h0OiA0MDAsXHJcbiAgICAgIGZpbGw6IFwicmdiKDUyLCA2MSwgODQpXCJcclxuICAgIH0pO1xyXG5cdFx0dGhpcy5zY29yZVRleHQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5pc2xhbmQgPSB0aGlzLmFkZC5zcHJpdGUoMCwgdGhpcy5nYW1lLmhlaWdodCsxMCwgJ2lzbGFuZCcpO1xyXG5cdFx0dGhpcy5pc2xhbmQuYW5jaG9yLnNldCgwLCAxKTtcclxuXHRcdHRoaXMuaXNsYW5kLndpZHRoID0gdGhpcy5jZWxsc01hbmFnZXIuc2l6ZUNlbGwqNTtcclxuXHRcdHRoaXMuaXNsYW5kLmhlaWdodCA9IHRoaXMuY2VsbHNNYW5hZ2VyLnNpemVDZWxsKjU7XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMpO1xyXG5cclxuXHRcdHRoaXMuYWRkLnNwcml0ZSgyMDAsIHRoaXMuZ2FtZS5oZWlnaHQtMjU2LCAnZmxhZycpO1xyXG5cdFx0dGhpcy5hZGQuc3ByaXRlKDYwMCwgdGhpcy5nYW1lLmhlaWdodC0zNTYsICdmbGFnJykuc2NhbGUueCAqPSAtMTtcclxuXHRcdHRoaXMuYWRkLnNwcml0ZSg0MDAsIHRoaXMuZ2FtZS5oZWlnaHQtNDAwLCAnZmxhZycpLnNjYWxlLnggKj0gLTE7XHJcblx0XHR0aGlzLmFkZC5zcHJpdGUoMTAwLCB0aGlzLmdhbWUuaGVpZ2h0LTMwMCwgJ2ZsYWcnKTtcclxuXHJcblx0XHRmb3IobGV0IHkgPSAwOyB5IDwgNTsgeSsrKSB7XHJcblx0XHRcdGZvcihsZXQgeCA9IDA7IHggPCB0aGlzLmdhbWUud2lkdGgvNTA7IHgrKykge1xyXG5cdFx0XHRcdGxldCBweCA9IHgqdGhpcy5ybmQuYmV0d2Vlbig0MCwgNjApO1xyXG5cdFx0XHRcdGxldCBweSA9IHRoaXMuZ2FtZS5oZWlnaHQteSp0aGlzLnJuZC5iZXR3ZWVuKDIwLCA1MCk7XHJcblx0XHRcdFx0bmV3IEVudGl0eSh0aGlzLCBweCwgcHksIHRoaXMucm5kLmJldHdlZW4oMzAsIDUwKSwgZmFsc2UpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHRhZGRTY29yZSh2KSB7XHJcblx0XHRsZXQgbnVtID0gdGhpcy5zY29yZSArPSB2O1xyXG5cclxuICAgIGxldCBkaWdpdHMgPSBTdHJpbmcoK251bSkuc3BsaXQoXCJcIiksXHJcbiAgICAgICAga2V5ID0gW1wiXCIsXCJDXCIsXCJDQ1wiLFwiQ0NDXCIsXCJDRFwiLFwiRFwiLFwiRENcIixcIkRDQ1wiLFwiRENDQ1wiLFwiQ01cIixcclxuICAgICAgICAgICAgICAgXCJcIixcIlhcIixcIlhYXCIsXCJYWFhcIixcIlhMXCIsXCJMXCIsXCJMWFwiLFwiTFhYXCIsXCJMWFhYXCIsXCJYQ1wiLFxyXG4gICAgICAgICAgICAgICBcIlwiLFwiSVwiLFwiSUlcIixcIklJSVwiLFwiSVZcIixcIlZcIixcIlZJXCIsXCJWSUlcIixcIlZJSUlcIixcIklYXCJdLFxyXG4gICAgICAgIHJvbWFuID0gXCJcIixcclxuICAgICAgICBpID0gMztcclxuXHJcblx0ICB3aGlsZShpLS0pXHJcblx0ICAgIHJvbWFuID0gKGtleVsrZGlnaXRzLnBvcCgpICsgKGkgKiAxMCldIHx8IFwiXCIpICsgcm9tYW47XHJcblxyXG5cdCBcdHRoaXMuc2NvcmVUZXh0LnRleHQgPSBBcnJheSgrZGlnaXRzLmpvaW4oXCJcIikgKyAxKS5qb2luKFwiTVwiKSArIHJvbWFuICsgJyAgVEFQUyc7XHJcblx0fVxyXG5cdHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy5jZWxsc01hbmFnZXIudXBkYXRlKGR0KTtcclxuXHRcdHRoaXMucGxheWVyLnVwZGF0ZShkdCk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXlncm91bmQ7XHJcbiIsIlxyXG5jbGFzcyBQcmVsb2FkIHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHRwcmVsb2FkKCkge1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsJywgJ2Fzc2V0cy9jZWxsLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsLW9wZW4nLCAnYXNzZXRzL2NlbGwtb3Blbi5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbDInLCAnYXNzZXRzL2NlbGwyLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsMycsICdhc3NldHMvY2VsbDMucG5nJyk7XHJcblxyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdiZycsICdhc3NldHMvYmcucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3BsYXllcicsICdhc3NldHMvcGxheWVyLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdpc2xhbmQnLCAnYXNzZXRzL2lzbGFuZC5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnZmxhZycsICdhc3NldHMvZmxhZy5wbmcnKTtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdHRoaXMuc3RhdGUuc3RhcnQoJ01lbnUnKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZDtcclxuIl19
