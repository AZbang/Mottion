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

},{"./states/Boot.js":7,"./states/Menu.js":8,"./states/Playground.js":9,"./states/Preload.js":10}],2:[function(require,module,exports){
const Cell = require('../objects/Cell');

class CellsManager extends Phaser.Group {
  constructor(state) {
    super(state.game);

    this.enableBody = true;

    this.sizeCell = state.game.width/5;

    this.state = state;
    this.createCells();
  }
  createCells() {
    for(let y = 0; y < 100; y++) {
      for(let x = 0; x < 5; x++) {
        let cell = new Cell(this, Math.random() < .15 ? 2 : 1, x, y);
        this.add(cell);
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

},{"../objects/Cell":4}],3:[function(require,module,exports){
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
class Cell extends Phaser.Sprite {
  constructor(manager, type, x, y) {
    super(manager.game, 0, 0, type === 1 ? 'cell' : 'cell2');

    this.manager = manager;
    this.state = manager.state;

    this.size = this.state.game.width/5;
    this.padding = 10;
    this.x = x*this.size+this.padding/2;
    this.y = this.state.game.height-(6*this.size)-y*this.size+this.padding/2;
    this.width = this.size-this.padding;
    this.height = this.size-this.padding;

    this.isOpen = false;
    this.type = type;

    this.cellOpen = this.state.add.sprite(this.x+this.size/2-this.padding/2, this.y+this.size/2-this.padding/2, 'cell-open');
    this.cellOpen.width = 0;
    this.cellOpen.height = 0;
    this.cellOpen.alpha = 0;
    this.cellOpen.anchor.set(.5);

    if(this.type === 1) {
      this.inputEnabled = true;

      this.events.onInputUp.addOnce(() => {
        this.isOpen = true;
        this.state.addScore();

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

},{}],5:[function(require,module,exports){
class Entity extends Phaser.Sprite {
  constructor(state, x, y) {
    super(state.cellsManager.game, x, y, 'player');
    state.add.existing(this);

    this.state = state;

    this.width = 70;
    this.height = 70;
    this.anchor.set(.5);

    this.createArc(-1, -1, 1, 1, 0x373fff);
    this.createArc(1, -1, -1, 1, 0xff3737);
    this.createArc(-1, 1, 1, -1, 0x42863c);

    this.tweenBreathe = this.state.add.tween(this)
      .to({width: 100, height: 100}, 500)
      .to({width: 70, height: 70}, 500)
      .yoyo()
      .loop()
      .start();
  }
  createArc(sx, sy, ex, ey, tint) {
    let arc = this.state.make.sprite(this.width*sx/1.5, this.height*sy/1.5, 'player');

    arc.tint = tint;
    arc.width = 50;
    arc.height = 50;
    this.state.add.tween(arc)
      .to({x: this.width*ex/1.5, y: this.height*ey/1.5, width: 0, height: 0}, 1000)
      .to({x: this.width*sx/1.5, y: this.height*sy/1.5}, 1)
      .to({width: 50, height: 50}, 1000)
      .yoyo()
      .loop()
      .start();
    this.addChild(arc);
  }

  update() {
    this.rotation += .01;
  }
}

module.exports = Entity;

},{}],6:[function(require,module,exports){
const Entity = require('./Entity');

class Player extends Entity {
  constructor(state) {
    super(state, state.game.width/2, state.game.height-200);

    this.state.physics.arcade.enable(this);
    this.body.setSize(50, 50, 1, 1);

    this.state.camera.follow(this);
		this.state.camera.deadzone = new Phaser.Rectangle(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    this.speed = 340;
    this.lastMove;

    this.state.add.tween(this)
      .to({y: this.state.game.height-(this.state.cellsManager.sizeCell*5+this.state.cellsManager.sizeCell/2)}, 2000)
      .start();

    setInterval(() => this.move(), this.speed);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.state.cellsManager, (pl, cell) => {
      if(cell.topPanel && cell.topPanel.isOpen) {
        this.state.add.tween(this)
          .to({y: cell.topPanel.y+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'top';
      }
      else if(this.lastMove !== 'left' && cell.rightPanel && cell.rightPanel.isOpen) {
        this.state.add.tween(this)
          .to({x: cell.rightPanel.x+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'right';
      }
      else if(this.lastMove !== 'right' && cell.leftPanel && cell.leftPanel.isOpen) {
        this.state.add.tween(this)
          .to({x: cell.leftPanel.x+cell.width/2}, this.speed)
          .start();
        this.lastMove = 'left';
      }
      else {
        let tween = this.state.add.tween(this)
          .to({x: cell.topPanel.x+cell.width/2, alpha: 0, width: 0, height: 0}, this.speed)
          .start();
        tween.onComplete.add(() => this.state.state.start('Menu'));
      }
    });
  }
}

module.exports = Player;

},{"./Entity":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
const ui = require('../mixins/ui');

class Menu {
	create() {
		this.bg = ui.createBg(this, this.game.width/5, 5, 10);

    this.label = this.add.text(this.game.width/2, 300, "Mottion", {
      font: 'Opificio',
      fontSize: 64,
      fontWeight: 100,
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

    this.btn = this.add.graphics();
    this.btn.beginFill(0x2e2e44, 1);
    this.btn.lineStyle(2, 0x2e2e44, .5);
    this.btn.drawCircle(this.game.width/2, this.game.height/2+100, 200);

		this.input.onDown.addOnce(() => {
			this.state.start('Playground');
		}, this);
	}
	update() {

	}
}

module.exports = Menu;

},{"../mixins/ui":3}],9:[function(require,module,exports){
const ui = require('../mixins/ui');
const CellsManager = require('../managers/CellsManager');
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

	}
	addScore() {
		let num = ++this.score;

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

},{"../managers/CellsManager":2,"../mixins/ui":3,"../objects/Player":6}],10:[function(require,module,exports){

class Preload {
	init() {
	}
	preload() {
		this.load.image('cell', 'assets/cell.png');
		this.load.image('cell-open', 'assets/cell-open.png');
		this.load.image('cell2', 'assets/cell2.png');

		this.load.image('bg', 'assets/bg.png');
		this.load.image('player', 'assets/player.png');
		this.load.image('island', 'assets/island.png');

	}

	create() {
		this.state.start('Menu');
	}
}

module.exports = Preload;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0NlbGxzTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21peGlucy91aS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvQ2VsbC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvRW50aXR5LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvb2JqZWN0cy9QbGF5ZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvQm9vdC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9NZW51LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc3RhdGVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvUHJlbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IEJvb3QgPSByZXF1aXJlKCcuL3N0YXRlcy9Cb290LmpzJyk7XHJcbmNvbnN0IFByZWxvYWQgPSByZXF1aXJlKCcuL3N0YXRlcy9QcmVsb2FkLmpzJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL3N0YXRlcy9NZW51LmpzJyk7XHJcbmNvbnN0IFBsYXlncm91bmQgPSByZXF1aXJlKCcuL3N0YXRlcy9QbGF5Z3JvdW5kLmpzJyk7XHJcblxyXG52YXIgcmVhZHkgPSAoKSA9PiB7XHJcblx0dmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoNzIwLCAxMjgwLCBQaGFzZXIuQVVUTywgJ01vdHRpb24nKTtcclxuXHJcblx0Z2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCBCb290LCB0cnVlKTtcclxuICBnYW1lLnN0YXRlLmFkZCgnUHJlbG9hZCcsIFByZWxvYWQpO1xyXG4gIGdhbWUuc3RhdGUuYWRkKCdNZW51JywgTWVudSk7XHJcblx0Z2FtZS5zdGF0ZS5hZGQoJ1BsYXlncm91bmQnLCBQbGF5Z3JvdW5kKTtcclxufVxyXG5cclxucmVhZHkoKTtcclxuIiwiY29uc3QgQ2VsbCA9IHJlcXVpcmUoJy4uL29iamVjdHMvQ2VsbCcpO1xyXG5cclxuY2xhc3MgQ2VsbHNNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgc3VwZXIoc3RhdGUuZ2FtZSk7XHJcblxyXG4gICAgdGhpcy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLnNpemVDZWxsID0gc3RhdGUuZ2FtZS53aWR0aC81O1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgIHRoaXMuY3JlYXRlQ2VsbHMoKTtcclxuICB9XHJcbiAgY3JlYXRlQ2VsbHMoKSB7XHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgMTAwOyB5KyspIHtcclxuICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IDU7IHgrKykge1xyXG4gICAgICAgIGxldCBjZWxsID0gbmV3IENlbGwodGhpcywgTWF0aC5yYW5kb20oKSA8IC4xNSA/IDIgOiAxLCB4LCB5KTtcclxuICAgICAgICB0aGlzLmFkZChjZWxsKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IDEwMDsgeSsrKSB7XHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCA1OyB4KyspIHtcclxuICAgICAgICBpZih5KzEgPCAxMDApIHRoaXMuY2hpbGRyZW5beSo1K3hdLnRvcFBhbmVsID0gdGhpcy5jaGlsZHJlblsoeSsxKSo1K3hdO1xyXG4gICAgICAgIGlmKHgtMSA+PSAwKSB0aGlzLmNoaWxkcmVuW3kqNSt4XS5sZWZ0UGFuZWwgPSB0aGlzLmNoaWxkcmVuW3kqNSt4LTFdO1xyXG4gICAgICAgIGlmKHgrMSA8IDUpIHRoaXMuY2hpbGRyZW5beSo1K3hdLnJpZ2h0UGFuZWwgPSB0aGlzLmNoaWxkcmVuW3kqNSt4KzFdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG5cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsbHNNYW5hZ2VyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjcmVhdGVCZyhzdGF0ZSwgc2l6ZT0xMDAsIGF4PTIwLCBheT0yMCkge1xyXG4gICAgbGV0IGJnID0gc3RhdGUuYWRkLmdyYXBoaWNzKCk7XHJcbiAgICBiZy5iZWdpbkZpbGwoMHhGRkZGRkYsIDEpO1xyXG4gICAgYmcuZHJhd1JlY3QoMCwgMCwgc3RhdGUuZ2FtZS53aWR0aCwgc3RhdGUuZ2FtZS5oZWlnaHQpO1xyXG4gICAgYmcuZW5kRmlsbCgpO1xyXG5cclxuICAgIGJnLmxpbmVTdHlsZSg0LCAweDJlMmU0NCwgLjEpO1xyXG5cclxuICAgIGZvcihsZXQgeCA9IDA7IHggPCBheDsgeCsrKSB7XHJcbiAgICAgIGJnLm1vdmVUbyhzaXplKngsIDApO1xyXG4gICAgICBiZy5saW5lVG8oc2l6ZSp4LCBzdGF0ZS5nYW1lLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgYXk7IHkrKykge1xyXG4gICAgICBiZy5tb3ZlVG8oMCwgc2l6ZSp5KTtcclxuICAgICAgYmcubGluZVRvKHN0YXRlLmdhbWUud2lkdGgsIHNpemUqeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJnO1xyXG4gIH1cclxufVxyXG4iLCJjbGFzcyBDZWxsIGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XHJcbiAgY29uc3RydWN0b3IobWFuYWdlciwgdHlwZSwgeCwgeSkge1xyXG4gICAgc3VwZXIobWFuYWdlci5nYW1lLCAwLCAwLCB0eXBlID09PSAxID8gJ2NlbGwnIDogJ2NlbGwyJyk7XHJcblxyXG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcclxuICAgIHRoaXMuc3RhdGUgPSBtYW5hZ2VyLnN0YXRlO1xyXG5cclxuICAgIHRoaXMuc2l6ZSA9IHRoaXMuc3RhdGUuZ2FtZS53aWR0aC81O1xyXG4gICAgdGhpcy5wYWRkaW5nID0gMTA7XHJcbiAgICB0aGlzLnggPSB4KnRoaXMuc2l6ZSt0aGlzLnBhZGRpbmcvMjtcclxuICAgIHRoaXMueSA9IHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQtKDYqdGhpcy5zaXplKS15KnRoaXMuc2l6ZSt0aGlzLnBhZGRpbmcvMjtcclxuICAgIHRoaXMud2lkdGggPSB0aGlzLnNpemUtdGhpcy5wYWRkaW5nO1xyXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLnNpemUtdGhpcy5wYWRkaW5nO1xyXG5cclxuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG5cclxuICAgIHRoaXMuY2VsbE9wZW4gPSB0aGlzLnN0YXRlLmFkZC5zcHJpdGUodGhpcy54K3RoaXMuc2l6ZS8yLXRoaXMucGFkZGluZy8yLCB0aGlzLnkrdGhpcy5zaXplLzItdGhpcy5wYWRkaW5nLzIsICdjZWxsLW9wZW4nKTtcclxuICAgIHRoaXMuY2VsbE9wZW4ud2lkdGggPSAwO1xyXG4gICAgdGhpcy5jZWxsT3Blbi5oZWlnaHQgPSAwO1xyXG4gICAgdGhpcy5jZWxsT3Blbi5hbHBoYSA9IDA7XHJcbiAgICB0aGlzLmNlbGxPcGVuLmFuY2hvci5zZXQoLjUpO1xyXG5cclxuICAgIGlmKHRoaXMudHlwZSA9PT0gMSkge1xyXG4gICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkU2NvcmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcy5jZWxsT3BlbilcclxuICAgIFx0XHRcdC50byh7YWxwaGE6IDEsIHdpZHRoOiB0aGlzLnNpemUtdGhpcy5wYWRkaW5nLCBoZWlnaHQ6IHRoaXMuc2l6ZS10aGlzLnBhZGRpbmd9LCAyMDApXHJcbiAgICBcdFx0XHQuc3RhcnQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIH1cclxuICAvLyB1cGRhdGUoZHQpIHtcclxuICAvLyB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsbDtcclxuIiwiY2xhc3MgRW50aXR5IGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUsIHgsIHkpIHtcclxuICAgIHN1cGVyKHN0YXRlLmNlbGxzTWFuYWdlci5nYW1lLCB4LCB5LCAncGxheWVyJyk7XHJcbiAgICBzdGF0ZS5hZGQuZXhpc3RpbmcodGhpcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG5cclxuICAgIHRoaXMud2lkdGggPSA3MDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gNzA7XHJcbiAgICB0aGlzLmFuY2hvci5zZXQoLjUpO1xyXG5cclxuICAgIHRoaXMuY3JlYXRlQXJjKC0xLCAtMSwgMSwgMSwgMHgzNzNmZmYpO1xyXG4gICAgdGhpcy5jcmVhdGVBcmMoMSwgLTEsIC0xLCAxLCAweGZmMzczNyk7XHJcbiAgICB0aGlzLmNyZWF0ZUFyYygtMSwgMSwgMSwgLTEsIDB4NDI4NjNjKTtcclxuXHJcbiAgICB0aGlzLnR3ZWVuQnJlYXRoZSA9IHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7d2lkdGg6IDEwMCwgaGVpZ2h0OiAxMDB9LCA1MDApXHJcbiAgICAgIC50byh7d2lkdGg6IDcwLCBoZWlnaHQ6IDcwfSwgNTAwKVxyXG4gICAgICAueW95bygpXHJcbiAgICAgIC5sb29wKClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIGNyZWF0ZUFyYyhzeCwgc3ksIGV4LCBleSwgdGludCkge1xyXG4gICAgbGV0IGFyYyA9IHRoaXMuc3RhdGUubWFrZS5zcHJpdGUodGhpcy53aWR0aCpzeC8xLjUsIHRoaXMuaGVpZ2h0KnN5LzEuNSwgJ3BsYXllcicpO1xyXG5cclxuICAgIGFyYy50aW50ID0gdGludDtcclxuICAgIGFyYy53aWR0aCA9IDUwO1xyXG4gICAgYXJjLmhlaWdodCA9IDUwO1xyXG4gICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4oYXJjKVxyXG4gICAgICAudG8oe3g6IHRoaXMud2lkdGgqZXgvMS41LCB5OiB0aGlzLmhlaWdodCpleS8xLjUsIHdpZHRoOiAwLCBoZWlnaHQ6IDB9LCAxMDAwKVxyXG4gICAgICAudG8oe3g6IHRoaXMud2lkdGgqc3gvMS41LCB5OiB0aGlzLmhlaWdodCpzeS8xLjV9LCAxKVxyXG4gICAgICAudG8oe3dpZHRoOiA1MCwgaGVpZ2h0OiA1MH0sIDEwMDApXHJcbiAgICAgIC55b3lvKClcclxuICAgICAgLmxvb3AoKVxyXG4gICAgICAuc3RhcnQoKTtcclxuICAgIHRoaXMuYWRkQ2hpbGQoYXJjKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIHRoaXMucm90YXRpb24gKz0gLjAxO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5Jyk7XHJcblxyXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBFbnRpdHkge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBzdXBlcihzdGF0ZSwgc3RhdGUuZ2FtZS53aWR0aC8yLCBzdGF0ZS5nYW1lLmhlaWdodC0yMDApO1xyXG5cclxuICAgIHRoaXMuc3RhdGUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMpO1xyXG4gICAgdGhpcy5ib2R5LnNldFNpemUoNTAsIDUwLCAxLCAxKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLmNhbWVyYS5mb2xsb3codGhpcyk7XHJcblx0XHR0aGlzLnN0YXRlLmNhbWVyYS5kZWFkem9uZSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKHRoaXMueC10aGlzLndpZHRoLzIsIHRoaXMueS10aGlzLmhlaWdodC8yLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgdGhpcy5zcGVlZCA9IDM0MDtcclxuICAgIHRoaXMubGFzdE1vdmU7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgLnRvKHt5OiB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LSh0aGlzLnN0YXRlLmNlbGxzTWFuYWdlci5zaXplQ2VsbCo1K3RoaXMuc3RhdGUuY2VsbHNNYW5hZ2VyLnNpemVDZWxsLzIpfSwgMjAwMClcclxuICAgICAgLnN0YXJ0KCk7XHJcblxyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5tb3ZlKCksIHRoaXMuc3BlZWQpO1xyXG4gIH1cclxuXHJcbiAgbW92ZSgpIHtcclxuICAgIHRoaXMuc3RhdGUucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLCB0aGlzLnN0YXRlLmNlbGxzTWFuYWdlciwgKHBsLCBjZWxsKSA9PiB7XHJcbiAgICAgIGlmKGNlbGwudG9wUGFuZWwgJiYgY2VsbC50b3BQYW5lbC5pc09wZW4pIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt5OiBjZWxsLnRvcFBhbmVsLnkrY2VsbC53aWR0aC8yfSwgdGhpcy5zcGVlZClcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSAndG9wJztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKHRoaXMubGFzdE1vdmUgIT09ICdsZWZ0JyAmJiBjZWxsLnJpZ2h0UGFuZWwgJiYgY2VsbC5yaWdodFBhbmVsLmlzT3Blbikge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3g6IGNlbGwucmlnaHRQYW5lbC54K2NlbGwud2lkdGgvMn0sIHRoaXMuc3BlZWQpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLmxhc3RNb3ZlID0gJ3JpZ2h0JztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKHRoaXMubGFzdE1vdmUgIT09ICdyaWdodCcgJiYgY2VsbC5sZWZ0UGFuZWwgJiYgY2VsbC5sZWZ0UGFuZWwuaXNPcGVuKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eDogY2VsbC5sZWZ0UGFuZWwueCtjZWxsLndpZHRoLzJ9LCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0TW92ZSA9ICdsZWZ0JztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBsZXQgdHdlZW4gPSB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt4OiBjZWxsLnRvcFBhbmVsLngrY2VsbC53aWR0aC8yLCBhbHBoYTogMCwgd2lkdGg6IDAsIGhlaWdodDogMH0sIHRoaXMuc3BlZWQpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB0aGlzLnN0YXRlLnN0YXRlLnN0YXJ0KCdNZW51JykpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xyXG4iLCJjbGFzcyBCb290IHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG5cdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5zY2FsZS5zZXRNYXhpbXVtKCk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb290O1xyXG4iLCJjb25zdCB1aSA9IHJlcXVpcmUoJy4uL21peGlucy91aScpO1xyXG5cclxuY2xhc3MgTWVudSB7XHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5iZyA9IHVpLmNyZWF0ZUJnKHRoaXMsIHRoaXMuZ2FtZS53aWR0aC81LCA1LCAxMCk7XHJcblxyXG4gICAgdGhpcy5sYWJlbCA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoLzIsIDMwMCwgXCJNb3R0aW9uXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDY0LFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcbiAgICAgIGZpbGw6IFwicmdiKDUyLCA2MSwgODQpXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG4gICAgdGhpcy50ZXh0ID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgMzUwLCBcImhvcGVsZXNzbmVzcyBpbiBtb3Rpb24uLi5cIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogNDIsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCJyZ2IoNTIsIDYxLCA4NClcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuICAgIHRoaXMuYnRuID0gdGhpcy5hZGQuZ3JhcGhpY3MoKTtcclxuICAgIHRoaXMuYnRuLmJlZ2luRmlsbCgweDJlMmU0NCwgMSk7XHJcbiAgICB0aGlzLmJ0bi5saW5lU3R5bGUoMiwgMHgyZTJlNDQsIC41KTtcclxuICAgIHRoaXMuYnRuLmRyYXdDaXJjbGUodGhpcy5nYW1lLndpZHRoLzIsIHRoaXMuZ2FtZS5oZWlnaHQvMisxMDAsIDIwMCk7XHJcblxyXG5cdFx0dGhpcy5pbnB1dC5vbkRvd24uYWRkT25jZSgoKSA9PiB7XHJcblx0XHRcdHRoaXMuc3RhdGUuc3RhcnQoJ1BsYXlncm91bmQnKTtcclxuXHRcdH0sIHRoaXMpO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51O1xyXG4iLCJjb25zdCB1aSA9IHJlcXVpcmUoJy4uL21peGlucy91aScpO1xyXG5jb25zdCBDZWxsc01hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9DZWxsc01hbmFnZXInKTtcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9QbGF5ZXInKTtcclxuXHJcbmNsYXNzIFBsYXlncm91bmQge1xyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdHRoaXMud29ybGQuc2V0Qm91bmRzKDAsIC10aGlzLmdhbWUuaGVpZ2h0KjEwMDAsIHRoaXMuZ2FtZS53aWR0aCwgdGhpcy5nYW1lLmhlaWdodCoyMDAwKTtcclxuXHJcblx0XHR0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQXJjYWRlKTtcclxuXHJcblx0XHR0aGlzLmJnID0gdGhpcy5hZGQuc3ByaXRlKDAsIDAsICdiZycpO1xyXG5cdFx0dGhpcy5iZy53aWR0aCA9IHRoaXMuZ2FtZS53aWR0aDtcclxuXHRcdHRoaXMuYmcuaGVpZ2h0ID0gdGhpcy5nYW1lLmhlaWdodDtcclxuXHRcdHRoaXMuYmcuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5jZWxsc01hbmFnZXIgPSBuZXcgQ2VsbHNNYW5hZ2VyKHRoaXMpO1xyXG5cclxuXHRcdHRoaXMuc2NvcmUgPSAwO1xyXG5cclxuICAgIHRoaXMubGFiZWwgPSB0aGlzLmFkZC50ZXh0KDUwLCA1MCwgXCJFeGlzdGVuY2U6XCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDY0LFxyXG4gICAgICBmb250V2VpZ2h0OiA0MDAsXHJcbiAgICAgIGZpbGw6IFwicmdiKDUyLCA2MSwgODQpXCJcclxuICAgIH0pO1xyXG5cdFx0dGhpcy5sYWJlbC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgIHRoaXMuc2NvcmVUZXh0ID0gdGhpcy5hZGQudGV4dCg1MCwgMTIwLCBcIlpFUk8gVEFQU1wiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA0MixcclxuICAgICAgZm9udFdlaWdodDogNDAwLFxyXG4gICAgICBmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXHJcbiAgICB9KTtcclxuXHRcdHRoaXMuc2NvcmVUZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuaXNsYW5kID0gdGhpcy5hZGQuc3ByaXRlKDAsIHRoaXMuZ2FtZS5oZWlnaHQrMTAsICdpc2xhbmQnKTtcclxuXHRcdHRoaXMuaXNsYW5kLmFuY2hvci5zZXQoMCwgMSk7XHJcblx0XHR0aGlzLmlzbGFuZC53aWR0aCA9IHRoaXMuY2VsbHNNYW5hZ2VyLnNpemVDZWxsKjU7XHJcblx0XHR0aGlzLmlzbGFuZC5oZWlnaHQgPSB0aGlzLmNlbGxzTWFuYWdlci5zaXplQ2VsbCo1O1xyXG5cclxuXHRcdHRoaXMucGxheWVyID0gbmV3IFBsYXllcih0aGlzKTtcclxuXHJcblx0fVxyXG5cdGFkZFNjb3JlKCkge1xyXG5cdFx0bGV0IG51bSA9ICsrdGhpcy5zY29yZTtcclxuXHJcbiAgICBsZXQgZGlnaXRzID0gU3RyaW5nKCtudW0pLnNwbGl0KFwiXCIpLFxyXG4gICAgICAgIGtleSA9IFtcIlwiLFwiQ1wiLFwiQ0NcIixcIkNDQ1wiLFwiQ0RcIixcIkRcIixcIkRDXCIsXCJEQ0NcIixcIkRDQ0NcIixcIkNNXCIsXHJcbiAgICAgICAgICAgICAgIFwiXCIsXCJYXCIsXCJYWFwiLFwiWFhYXCIsXCJYTFwiLFwiTFwiLFwiTFhcIixcIkxYWFwiLFwiTFhYWFwiLFwiWENcIixcclxuICAgICAgICAgICAgICAgXCJcIixcIklcIixcIklJXCIsXCJJSUlcIixcIklWXCIsXCJWXCIsXCJWSVwiLFwiVklJXCIsXCJWSUlJXCIsXCJJWFwiXSxcclxuICAgICAgICByb21hbiA9IFwiXCIsXHJcbiAgICAgICAgaSA9IDM7XHJcblxyXG5cdCAgd2hpbGUoaS0tKVxyXG5cdCAgICByb21hbiA9IChrZXlbK2RpZ2l0cy5wb3AoKSArIChpICogMTApXSB8fCBcIlwiKSArIHJvbWFuO1xyXG5cclxuXHQgXHR0aGlzLnNjb3JlVGV4dC50ZXh0ID0gQXJyYXkoK2RpZ2l0cy5qb2luKFwiXCIpICsgMSkuam9pbihcIk1cIikgKyByb21hbiArICcgIFRBUFMnO1xyXG5cdH1cclxuXHR1cGRhdGUoZHQpIHtcclxuICAgIHRoaXMuY2VsbHNNYW5hZ2VyLnVwZGF0ZShkdCk7XHJcblx0XHR0aGlzLnBsYXllci51cGRhdGUoZHQpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Z3JvdW5kO1xyXG4iLCJcclxuY2xhc3MgUHJlbG9hZCB7XHJcblx0aW5pdCgpIHtcclxuXHR9XHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbCcsICdhc3NldHMvY2VsbC5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbC1vcGVuJywgJ2Fzc2V0cy9jZWxsLW9wZW4ucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwyJywgJ2Fzc2V0cy9jZWxsMi5wbmcnKTtcclxuXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9iZy5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGxheWVyJywgJ2Fzc2V0cy9wbGF5ZXIucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2lzbGFuZCcsICdhc3NldHMvaXNsYW5kLnBuZycpO1xyXG5cclxuXHR9XHJcblxyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdHRoaXMuc3RhdGUuc3RhcnQoJ01lbnUnKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZDtcclxuIl19
