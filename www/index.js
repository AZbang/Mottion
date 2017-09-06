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

},{"./states/Boot.js":6,"./states/Menu.js":7,"./states/Playground.js":8,"./states/Preload.js":9}],2:[function(require,module,exports){
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
    this.x = x*this.size;
    this.y = this.state.game.height-(6*this.size)-y*this.size;
    this.width = this.size;
    this.height = this.size;

    this.isOpen = false;
    this.type = type;

    this.cellOpen = this.state.add.sprite(this.x+this.size/2, this.y+this.size/2, 'cell-open');
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
    			.to({alpha: 1, width: this.size, height: this.size}, 200)
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
class Player extends Phaser.Sprite {
  constructor(state) {
    super(state.cellsManager.game, 0, 0, 'player');
    state.add.existing(this);

    this.state = state;

    this.x = this.state.game.width/2;
    this.y = this.state.game.height-200;
    this.width = 70;
    this.height = 70;
    this.anchor.set(.5);


    this.state.physics.arcade.enable(this);
    this.state.camera.follow(this);
		this.state.camera.deadzone = new Phaser.Rectangle(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    this.body.setSize(50, 50, 1, 1);

    this.tweenBreathe = this.state.add.tween(this)
			.to({width: 100, height: 100}, 200)
      .to({width: 70, height: 70}, 200)
      .yoyo()
			.loop()
  		.start();

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

  update() {


  }
}

module.exports = Player;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"../mixins/ui":3}],8:[function(require,module,exports){
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

		this.island = this.add.sprite(0, this.game.height, 'island');
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

},{"../managers/CellsManager":2,"../mixins/ui":3,"../objects/Player":5}],9:[function(require,module,exports){

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0NlbGxzTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21peGlucy91aS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvQ2VsbC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvUGxheWVyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc3RhdGVzL0Jvb3QuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvTWVudS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9QbGF5Z3JvdW5kLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc3RhdGVzL1ByZWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBCb290ID0gcmVxdWlyZSgnLi9zdGF0ZXMvQm9vdC5qcycpO1xyXG5jb25zdCBQcmVsb2FkID0gcmVxdWlyZSgnLi9zdGF0ZXMvUHJlbG9hZC5qcycpO1xyXG5jb25zdCBNZW51ID0gcmVxdWlyZSgnLi9zdGF0ZXMvTWVudS5qcycpO1xyXG5jb25zdCBQbGF5Z3JvdW5kID0gcmVxdWlyZSgnLi9zdGF0ZXMvUGxheWdyb3VuZC5qcycpO1xyXG5cclxudmFyIHJlYWR5ID0gKCkgPT4ge1xyXG5cdHZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDcyMCwgMTI4MCwgUGhhc2VyLkFVVE8sICdNb3R0aW9uJyk7XHJcblxyXG5cdGdhbWUuc3RhdGUuYWRkKCdCb290JywgQm9vdCwgdHJ1ZSk7XHJcbiAgZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCBQcmVsb2FkKTtcclxuICBnYW1lLnN0YXRlLmFkZCgnTWVudScsIE1lbnUpO1xyXG5cdGdhbWUuc3RhdGUuYWRkKCdQbGF5Z3JvdW5kJywgUGxheWdyb3VuZCk7XHJcbn1cclxuXHJcbnJlYWR5KCk7XHJcbiIsImNvbnN0IENlbGwgPSByZXF1aXJlKCcuLi9vYmplY3RzL0NlbGwnKTtcclxuXHJcbmNsYXNzIENlbGxzTWFuYWdlciBleHRlbmRzIFBoYXNlci5Hcm91cCB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIHN1cGVyKHN0YXRlLmdhbWUpO1xyXG5cclxuICAgIHRoaXMuZW5hYmxlQm9keSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5zaXplQ2VsbCA9IHN0YXRlLmdhbWUud2lkdGgvNTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLmNyZWF0ZUNlbGxzKCk7XHJcbiAgfVxyXG4gIGNyZWF0ZUNlbGxzKCkge1xyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IDEwMDsgeSsrKSB7XHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCA1OyB4KyspIHtcclxuICAgICAgICBsZXQgY2VsbCA9IG5ldyBDZWxsKHRoaXMsIE1hdGgucmFuZG9tKCkgPCAuMTUgPyAyIDogMSwgeCwgeSk7XHJcbiAgICAgICAgdGhpcy5hZGQoY2VsbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvcihsZXQgeSA9IDA7IHkgPCAxMDA7IHkrKykge1xyXG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgNTsgeCsrKSB7XHJcbiAgICAgICAgaWYoeSsxIDwgMTAwKSB0aGlzLmNoaWxkcmVuW3kqNSt4XS50b3BQYW5lbCA9IHRoaXMuY2hpbGRyZW5bKHkrMSkqNSt4XTtcclxuICAgICAgICBpZih4LTEgPj0gMCkgdGhpcy5jaGlsZHJlblt5KjUreF0ubGVmdFBhbmVsID0gdGhpcy5jaGlsZHJlblt5KjUreC0xXTtcclxuICAgICAgICBpZih4KzEgPCA1KSB0aGlzLmNoaWxkcmVuW3kqNSt4XS5yaWdodFBhbmVsID0gdGhpcy5jaGlsZHJlblt5KjUreCsxXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICB1cGRhdGUoZHQpIHtcclxuXHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENlbGxzTWFuYWdlcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgY3JlYXRlQmcoc3RhdGUsIHNpemU9MTAwLCBheD0yMCwgYXk9MjApIHtcclxuICAgIGxldCBiZyA9IHN0YXRlLmFkZC5ncmFwaGljcygpO1xyXG4gICAgYmcuYmVnaW5GaWxsKDB4RkZGRkZGLCAxKTtcclxuICAgIGJnLmRyYXdSZWN0KDAsIDAsIHN0YXRlLmdhbWUud2lkdGgsIHN0YXRlLmdhbWUuaGVpZ2h0KTtcclxuICAgIGJnLmVuZEZpbGwoKTtcclxuXHJcbiAgICBiZy5saW5lU3R5bGUoNCwgMHgyZTJlNDQsIC4xKTtcclxuXHJcbiAgICBmb3IobGV0IHggPSAwOyB4IDwgYXg7IHgrKykge1xyXG4gICAgICBiZy5tb3ZlVG8oc2l6ZSp4LCAwKTtcclxuICAgICAgYmcubGluZVRvKHNpemUqeCwgc3RhdGUuZ2FtZS5oZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IGF5OyB5KyspIHtcclxuICAgICAgYmcubW92ZVRvKDAsIHNpemUqeSk7XHJcbiAgICAgIGJnLmxpbmVUbyhzdGF0ZS5nYW1lLndpZHRoLCBzaXplKnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBiZztcclxuICB9XHJcbn1cclxuIiwiY2xhc3MgQ2VsbCBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKG1hbmFnZXIsIHR5cGUsIHgsIHkpIHtcclxuICAgIHN1cGVyKG1hbmFnZXIuZ2FtZSwgMCwgMCwgdHlwZSA9PT0gMSA/ICdjZWxsJyA6ICdjZWxsMicpO1xyXG5cclxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICB0aGlzLnN0YXRlID0gbWFuYWdlci5zdGF0ZTtcclxuXHJcbiAgICB0aGlzLnNpemUgPSB0aGlzLnN0YXRlLmdhbWUud2lkdGgvNTtcclxuICAgIHRoaXMueCA9IHgqdGhpcy5zaXplO1xyXG4gICAgdGhpcy55ID0gdGhpcy5zdGF0ZS5nYW1lLmhlaWdodC0oNip0aGlzLnNpemUpLXkqdGhpcy5zaXplO1xyXG4gICAgdGhpcy53aWR0aCA9IHRoaXMuc2l6ZTtcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5zaXplO1xyXG5cclxuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG5cclxuICAgIHRoaXMuY2VsbE9wZW4gPSB0aGlzLnN0YXRlLmFkZC5zcHJpdGUodGhpcy54K3RoaXMuc2l6ZS8yLCB0aGlzLnkrdGhpcy5zaXplLzIsICdjZWxsLW9wZW4nKTtcclxuICAgIHRoaXMuY2VsbE9wZW4ud2lkdGggPSAwO1xyXG4gICAgdGhpcy5jZWxsT3Blbi5oZWlnaHQgPSAwO1xyXG4gICAgdGhpcy5jZWxsT3Blbi5hbHBoYSA9IDA7XHJcbiAgICB0aGlzLmNlbGxPcGVuLmFuY2hvci5zZXQoLjUpO1xyXG5cclxuICAgIGlmKHRoaXMudHlwZSA9PT0gMSkge1xyXG4gICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkU2NvcmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcy5jZWxsT3BlbilcclxuICAgIFx0XHRcdC50byh7YWxwaGE6IDEsIHdpZHRoOiB0aGlzLnNpemUsIGhlaWdodDogdGhpcy5zaXplfSwgMjAwKVxyXG4gICAgXHRcdFx0LnN0YXJ0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyB9XHJcbiAgLy8gdXBkYXRlKGR0KSB7XHJcbiAgLy8gfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENlbGw7XHJcbiIsImNsYXNzIFBsYXllciBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBzdXBlcihzdGF0ZS5jZWxsc01hbmFnZXIuZ2FtZSwgMCwgMCwgJ3BsYXllcicpO1xyXG4gICAgc3RhdGUuYWRkLmV4aXN0aW5nKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuXHJcbiAgICB0aGlzLnggPSB0aGlzLnN0YXRlLmdhbWUud2lkdGgvMjtcclxuICAgIHRoaXMueSA9IHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQtMjAwO1xyXG4gICAgdGhpcy53aWR0aCA9IDcwO1xyXG4gICAgdGhpcy5oZWlnaHQgPSA3MDtcclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSk7XHJcblxyXG5cclxuICAgIHRoaXMuc3RhdGUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMpO1xyXG4gICAgdGhpcy5zdGF0ZS5jYW1lcmEuZm9sbG93KHRoaXMpO1xyXG5cdFx0dGhpcy5zdGF0ZS5jYW1lcmEuZGVhZHpvbmUgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZSh0aGlzLngtdGhpcy53aWR0aC8yLCB0aGlzLnktdGhpcy5oZWlnaHQvMiwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cclxuICAgIHRoaXMuYm9keS5zZXRTaXplKDUwLCA1MCwgMSwgMSk7XHJcblxyXG4gICAgdGhpcy50d2VlbkJyZWF0aGUgPSB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG5cdFx0XHQudG8oe3dpZHRoOiAxMDAsIGhlaWdodDogMTAwfSwgMjAwKVxyXG4gICAgICAudG8oe3dpZHRoOiA3MCwgaGVpZ2h0OiA3MH0sIDIwMClcclxuICAgICAgLnlveW8oKVxyXG5cdFx0XHQubG9vcCgpXHJcbiAgXHRcdC5zdGFydCgpO1xyXG5cclxuICAgIHRoaXMuc3BlZWQgPSAzNDA7XHJcbiAgICB0aGlzLmxhc3RNb3ZlO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7eTogdGhpcy5zdGF0ZS5nYW1lLmhlaWdodC0odGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuc2l6ZUNlbGwqNSt0aGlzLnN0YXRlLmNlbGxzTWFuYWdlci5zaXplQ2VsbC8yKX0sIDIwMDApXHJcbiAgICAgIC5zdGFydCgpO1xyXG5cclxuICAgIHNldEludGVydmFsKCgpID0+IHRoaXMubW92ZSgpLCB0aGlzLnNwZWVkKTtcclxuICB9XHJcblxyXG4gIG1vdmUoKSB7XHJcbiAgICB0aGlzLnN0YXRlLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcywgdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIsIChwbCwgY2VsbCkgPT4ge1xyXG4gICAgICBpZihjZWxsLnRvcFBhbmVsICYmIGNlbGwudG9wUGFuZWwuaXNPcGVuKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eTogY2VsbC50b3BQYW5lbC55K2NlbGwud2lkdGgvMn0sIHRoaXMuc3BlZWQpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLmxhc3RNb3ZlID0gJ3RvcCc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZih0aGlzLmxhc3RNb3ZlICE9PSAnbGVmdCcgJiYgY2VsbC5yaWdodFBhbmVsICYmIGNlbGwucmlnaHRQYW5lbC5pc09wZW4pIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt4OiBjZWxsLnJpZ2h0UGFuZWwueCtjZWxsLndpZHRoLzJ9LCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0TW92ZSA9ICdyaWdodCc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZih0aGlzLmxhc3RNb3ZlICE9PSAncmlnaHQnICYmIGNlbGwubGVmdFBhbmVsICYmIGNlbGwubGVmdFBhbmVsLmlzT3Blbikge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3g6IGNlbGwubGVmdFBhbmVsLngrY2VsbC53aWR0aC8yfSwgdGhpcy5zcGVlZClcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSAnbGVmdCc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IHR3ZWVuID0gdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eDogY2VsbC50b3BQYW5lbC54K2NlbGwud2lkdGgvMiwgYWxwaGE6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDB9LCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4gdGhpcy5zdGF0ZS5zdGF0ZS5zdGFydCgnTWVudScpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKSB7XHJcblxyXG5cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xyXG4iLCJjbGFzcyBCb290IHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG5cdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5zY2FsZS5zZXRNYXhpbXVtKCk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb290O1xyXG4iLCJjb25zdCB1aSA9IHJlcXVpcmUoJy4uL21peGlucy91aScpO1xyXG5cclxuY2xhc3MgTWVudSB7XHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5iZyA9IHVpLmNyZWF0ZUJnKHRoaXMsIHRoaXMuZ2FtZS53aWR0aC81LCA1LCAxMCk7XHJcblxyXG4gICAgdGhpcy5sYWJlbCA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoLzIsIDMwMCwgXCJNb3R0aW9uXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDY0LFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcbiAgICAgIGZpbGw6IFwicmdiKDUyLCA2MSwgODQpXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG4gICAgdGhpcy50ZXh0ID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgMzUwLCBcImhvcGVsZXNzbmVzcyBpbiBtb3Rpb24uLi5cIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogNDIsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCJyZ2IoNTIsIDYxLCA4NClcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuICAgIHRoaXMuYnRuID0gdGhpcy5hZGQuZ3JhcGhpY3MoKTtcclxuICAgIHRoaXMuYnRuLmJlZ2luRmlsbCgweDJlMmU0NCwgMSk7XHJcbiAgICB0aGlzLmJ0bi5saW5lU3R5bGUoMiwgMHgyZTJlNDQsIC41KTtcclxuICAgIHRoaXMuYnRuLmRyYXdDaXJjbGUodGhpcy5nYW1lLndpZHRoLzIsIHRoaXMuZ2FtZS5oZWlnaHQvMisxMDAsIDIwMCk7XHJcblxyXG5cdFx0dGhpcy5pbnB1dC5vbkRvd24uYWRkT25jZSgoKSA9PiB7XHJcblx0XHRcdHRoaXMuc3RhdGUuc3RhcnQoJ1BsYXlncm91bmQnKTtcclxuXHRcdH0sIHRoaXMpO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51O1xyXG4iLCJjb25zdCB1aSA9IHJlcXVpcmUoJy4uL21peGlucy91aScpO1xyXG5jb25zdCBDZWxsc01hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9DZWxsc01hbmFnZXInKTtcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9QbGF5ZXInKTtcclxuXHJcbmNsYXNzIFBsYXlncm91bmQge1xyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdHRoaXMud29ybGQuc2V0Qm91bmRzKDAsIC10aGlzLmdhbWUuaGVpZ2h0KjEwMDAsIHRoaXMuZ2FtZS53aWR0aCwgdGhpcy5nYW1lLmhlaWdodCoyMDAwKTtcclxuXHJcblx0XHR0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQXJjYWRlKTtcclxuXHJcblx0XHR0aGlzLmJnID0gdGhpcy5hZGQuc3ByaXRlKDAsIDAsICdiZycpO1xyXG5cdFx0dGhpcy5iZy53aWR0aCA9IHRoaXMuZ2FtZS53aWR0aDtcclxuXHRcdHRoaXMuYmcuaGVpZ2h0ID0gdGhpcy5nYW1lLmhlaWdodDtcclxuXHRcdHRoaXMuYmcuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5jZWxsc01hbmFnZXIgPSBuZXcgQ2VsbHNNYW5hZ2VyKHRoaXMpO1xyXG5cclxuXHRcdHRoaXMuc2NvcmUgPSAwO1xyXG5cclxuICAgIHRoaXMubGFiZWwgPSB0aGlzLmFkZC50ZXh0KDUwLCA1MCwgXCJFeGlzdGVuY2U6XCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDY0LFxyXG4gICAgICBmb250V2VpZ2h0OiA0MDAsXHJcbiAgICAgIGZpbGw6IFwicmdiKDUyLCA2MSwgODQpXCJcclxuICAgIH0pO1xyXG5cdFx0dGhpcy5sYWJlbC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgIHRoaXMuc2NvcmVUZXh0ID0gdGhpcy5hZGQudGV4dCg1MCwgMTIwLCBcIlpFUk8gVEFQU1wiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA0MixcclxuICAgICAgZm9udFdlaWdodDogNDAwLFxyXG4gICAgICBmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXHJcbiAgICB9KTtcclxuXHRcdHRoaXMuc2NvcmVUZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuaXNsYW5kID0gdGhpcy5hZGQuc3ByaXRlKDAsIHRoaXMuZ2FtZS5oZWlnaHQsICdpc2xhbmQnKTtcclxuXHRcdHRoaXMuaXNsYW5kLmFuY2hvci5zZXQoMCwgMSk7XHJcblx0XHR0aGlzLmlzbGFuZC53aWR0aCA9IHRoaXMuY2VsbHNNYW5hZ2VyLnNpemVDZWxsKjU7XHJcblx0XHR0aGlzLmlzbGFuZC5oZWlnaHQgPSB0aGlzLmNlbGxzTWFuYWdlci5zaXplQ2VsbCo1O1xyXG5cclxuXHRcdHRoaXMucGxheWVyID0gbmV3IFBsYXllcih0aGlzKTtcclxuXHJcblx0fVxyXG5cdGFkZFNjb3JlKCkge1xyXG5cdFx0bGV0IG51bSA9ICsrdGhpcy5zY29yZTtcclxuXHJcbiAgICBsZXQgZGlnaXRzID0gU3RyaW5nKCtudW0pLnNwbGl0KFwiXCIpLFxyXG4gICAgICAgIGtleSA9IFtcIlwiLFwiQ1wiLFwiQ0NcIixcIkNDQ1wiLFwiQ0RcIixcIkRcIixcIkRDXCIsXCJEQ0NcIixcIkRDQ0NcIixcIkNNXCIsXHJcbiAgICAgICAgICAgICAgIFwiXCIsXCJYXCIsXCJYWFwiLFwiWFhYXCIsXCJYTFwiLFwiTFwiLFwiTFhcIixcIkxYWFwiLFwiTFhYWFwiLFwiWENcIixcclxuICAgICAgICAgICAgICAgXCJcIixcIklcIixcIklJXCIsXCJJSUlcIixcIklWXCIsXCJWXCIsXCJWSVwiLFwiVklJXCIsXCJWSUlJXCIsXCJJWFwiXSxcclxuICAgICAgICByb21hbiA9IFwiXCIsXHJcbiAgICAgICAgaSA9IDM7XHJcblxyXG5cdCAgd2hpbGUoaS0tKVxyXG5cdCAgICByb21hbiA9IChrZXlbK2RpZ2l0cy5wb3AoKSArIChpICogMTApXSB8fCBcIlwiKSArIHJvbWFuO1xyXG5cclxuXHQgXHR0aGlzLnNjb3JlVGV4dC50ZXh0ID0gQXJyYXkoK2RpZ2l0cy5qb2luKFwiXCIpICsgMSkuam9pbihcIk1cIikgKyByb21hbiArICcgIFRBUFMnO1xyXG5cdH1cclxuXHR1cGRhdGUoZHQpIHtcclxuICAgIHRoaXMuY2VsbHNNYW5hZ2VyLnVwZGF0ZShkdCk7XHJcblx0XHR0aGlzLnBsYXllci51cGRhdGUoZHQpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Z3JvdW5kO1xyXG4iLCJcclxuY2xhc3MgUHJlbG9hZCB7XHJcblx0aW5pdCgpIHtcclxuXHR9XHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbCcsICdhc3NldHMvY2VsbC5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbC1vcGVuJywgJ2Fzc2V0cy9jZWxsLW9wZW4ucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwyJywgJ2Fzc2V0cy9jZWxsMi5wbmcnKTtcclxuXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9iZy5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGxheWVyJywgJ2Fzc2V0cy9wbGF5ZXIucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2lzbGFuZCcsICdhc3NldHMvaXNsYW5kLnBuZycpO1xyXG5cclxuXHR9XHJcblxyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdHRoaXMuc3RhdGUuc3RhcnQoJ01lbnUnKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZDtcclxuIl19
