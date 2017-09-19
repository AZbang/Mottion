(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Boot = require('./states/Boot.js');
const Preload = require('./states/Preload.js');
const Menu = require('./states/Menu.js');
const Playground = require('./states/Playground.js');
const Settings = require('./states/Settings.js');

var ready = () => {
	var game = new Phaser.Game(720, 1280, Phaser.AUTO, 'Mottion');

	game.state.add('Boot', Boot, true);
  game.state.add('Preload', Preload);
  game.state.add('Menu', Menu);
	game.state.add('Settings', Settings);
	game.state.add('Playground', Playground);
}

ready();

},{"./states/Boot.js":12,"./states/Menu.js":13,"./states/Playground.js":14,"./states/Preload.js":15,"./states/Settings.js":16}],2:[function(require,module,exports){
const Cell = require('../objects/Cell');
const types = require('../objects/types');
types.sort((a, b) => a.chance - b.chance);


class CellsManager extends Phaser.Group {
  constructor(state, amtX, amtY) {
    super(state.game);

    this.enableBody = true;

    this.amtX = amtX || 5;

    this.sizeCell = state.game.width/this.amtX;
    this.lastY = 0;
    this.last = [];

    this.state = state;
    this.createCells(amtY || 15);
  }
  createCells(amtGenY) {
    let arr = [];

    for(let y = this.lastY; y < this.lastY+amtGenY; y++) {
      for(let x = 0; x < this.amtX; x++) {
        let rand = Math.random()*100;
        for(let i = 0; i < types.length; i++) {
           if(rand < types[i].chance) {
             let cell = this.getFirstDead();
             if(!cell) {
                cell = new Cell(this, types[i], x, y);
                this.add(cell);
             } else {
               cell.reUseCell(x, y, types[i]);
               cell.revive();
             }

             arr.push(cell);
             break;
           }
        }
      }
    }
    for(let y = 0; y < amtGenY; y++) {
      for(let x = 0; x < this.amtX; x++) {
        if(y+1 < amtGenY) arr[y*this.amtX+x].topPanel = arr[(y+1)*this.amtX+x];
        if(x-1 >= 0) arr[y*this.amtX+x].leftPanel = arr[y*this.amtX+x-1];
        if(x+1 < this.amtX)  arr[y*this.amtX+x].rightPanel = arr[y*this.amtX+x+1];
      }
    }
    if(this.last.length) {
      for(let x = 0; x < this.amtX; x++) {
        this.last[x].topPanel = arr[x];
      }
    }

    this.last = [];
    for(let i = arr.length-this.amtX; i < arr.length; i++) {
      this.last.push(arr[i]);
    }
    this.lastY += amtGenY;
  }
  update(dt) {
    let isHide = false;
    this.forEach((cell) => {
      if(cell.y > this.state.player.y+this.state.game.height-400) {
        cell.leftPanel = null;
        cell.rightPanel = null;
        cell.topPanel = null;
        cell.kill();
        !isHide && this.createCells(1);
        isHide = true;
      }
    });
  }
}

module.exports = CellsManager;

},{"../objects/Cell":8,"../objects/types":11}],3:[function(require,module,exports){
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

    let cloud = this.getFirstDead();
    if(!cloud) {
       cloud = this.add(this.state.make.sprite(0, this.lastY, 'cloud'));
       this.randomizeCloud(cloud);
       this.add(cloud);
    } else {
      this.randomizeCloud(cloud);
      cloud.revive();
    }
  }
  randomizeCloud(cloud) {
    if(Math.random() < .5) {
      cloud.position.set(0, this.lastY);
      cloud.width = this.state.game.width-100;
      cloud.height = 400;
    } else {
      cloud.position.set(100, this.lastY);
      cloud.width = this.state.game.width-100;
      cloud.height = 400;
      cloud.anchor.set(1);
      cloud.scale.x *= -1;
    }
    cloud.duration = Math.random()*2;
    cloud.alpha = .9;
  }
  update(dt) {
    this.forEach((cloud) => {
      cloud.y += cloud.duration;
      if(cloud.y > this.state.player.y+this.state.game.height-400)
        cloud.kill();
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

    this.autoCull = true;

    this.island = this.create(0, this.state.game.height+10, 'island');
    this.island.anchor.set(0, 1);
    this.island.width = this.state.cellsManager.sizeCell*this.state.cellsManager.amtX;
    this.island.height = this.state.cellsManager.sizeCell*this.state.cellsManager.amtX;
    // this.island.tint = 0xff4444; 0x00d461

    this.create(42-20, 650, 'flag');
    this.create(120-20, 840, 'flag');
    this.create(75-20, 1060, 'flag');
    this.create(265-20, 980, 'flag');
    this.create(440+100, 1110, 'flag').scale.x *= -1;
    this.create(570+100, 1015, 'flag').scale.x *= -1;
    this.create(620+100, 780, 'flag').scale.x *= -1;
  }
  update() {
  }
}

module.exports = IslandManager;

},{"../objects/Entity":9}],5:[function(require,module,exports){
class UIManager extends Phaser.Group {
  constructor(state) {
    super(state);

    this.state = state;
    this.fixedToCamera = true;

    this.plane = this.state.make.sprite(0, 0, 'plane');
    this.add(this.plane);

    this.scoreText = this.state.make.text(50, 25, "0 steps", {
      font: 'Roboto',
      fontSize: 60,
      fontWeight: 800,
      fill: "#555dff"
    });
    this.add(this.scoreText);
    this.score = 0;


    this.pause = this.state.make.sprite(this.state.game.width-80, 70, 'time');
    this.pause.anchor.set(.5);
    this.pause.inputEnabled = true;
    this.pause.events.onInputUp.add(() => {
      this.pause.rotation = 0;
      let tween = this.state.add.tween(this.pause)
        .to({rotation: Math.PI*2}, 500)
        .start();

      if(!this.state.game.paused) {
        tween.onComplete.add(() => {
          this.state.game.paused = true;
        });
      } else this.state.game.paused = false;
    });
    this.add(this.pause);
  }
  addScore(v) {
    this.score += v;
    this.scoreText.text = this.score + ' steps';
  }
}

module.exports = UIManager;

},{}],6:[function(require,module,exports){
class WindowManager extends Phaser.Group {
  constructor(state) {
    super(state);

    this.state = state;

    this.alpha = 0;
    this.fixedToCamera = true;

    this.bg = this.state.make.graphics(0, 0);
    this.bg.beginFill(0xFFFFFF);
    this.bg.drawRect(0, 0, this.state.game.width, this.state.game.height);
    this.bg.inputEnabled = true;
    this.add(this.bg);

    this.label = this.state.make.text(this.state.game.width/2, 440, "", {
      font: 'Opificio',
      fontSize: 100,
      fontWeight: 100,
      fontWeight: 600,
      fill: "#555dff"
    });
    this.label.anchor.set(0.5);
    this.add(this.label);


    this.content = this.state.make.text(this.state.game.width/2, 540, "", {
      font: 'Opificio',
      fontSize: 50,
      fontWeight: 600,
      fill: "#555dff",
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.state.game.width-100
    });
    this.content.anchor.set(0.5, 0);
    this.add(this.content);
  }
  addWindow(label, text, cb) {
    this.state.add.tween(this)
      .to({alpha: 1}, 500)
      .start();
    this.bg.inputEnabled = true;

    this.label.text = label;
    this.content.text = text;
		this.bg.events.onInputUp.addOnce(() => {
      this.state.add.tween(this)
        .to({alpha: 0}, 500)
        .start();
      this.bg.inputEnabled = false;
      cb && cb();
    });
  }
}

module.exports = WindowManager;

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
const types = require('./types');

class Cell extends Phaser.Sprite {
  constructor(manager, type, x, y) {
    super(manager.game, 0, 0, type.img);

    this.manager = manager;
    this.state = manager.state;

    this.padding = 10;
    this.size = this.manager.sizeCell;
    this.width = this.size-this.padding;
    this.height = this.size-this.padding;
    this.anchor.set(.5);

    this.reUseCell(x, y, type);
  }
  reUseCell(x, y, type) {
    this.loadTexture(type.img, 0);

    this.x = x*this.size+this.padding/2+this.width/2;
    this.y = 80*this.manager.amtX-y*this.size+this.height/2;
    this.isOpen = type.isOpen;
    this.isGood = type.isGood;
    this.score = type.score;
    this.inputEnabled = false;

    if(type.isClick) {
      this.inputEnabled = true;
      this.clickCount = type.clickCount;

      this.events.onInputUp.add(() => {
        this.clickCount--;
        this.width = this.size-this.padding;
        this.height = this.size-this.padding;

        this.state.add.tween(this)
          .to({width: this.width+30, height: this.height+30}, 100)
          .to({width: this.width, height: this.height}, 100)
          .start();

        if(this.clickCount === 0) {
          this.loadTexture(type.imgClick, 0);
          this.isOpen = true;
        }
      });
    }
  }
}

module.exports = Cell;

},{"./types":11}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
        .to({y: this.state.game.height-(this.state.cellsManager.sizeCell*this.state.cellsManager.amtX+this.state.cellsManager.sizeCell/2)}, this.speed*4)
        .start();
      tween.onComplete.add(() => {
        this.move();
        this.timer.start();
      });
    }, this);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.state.cellsManager, (pl, cell) => {
      if(!cell.topPanel) return;

      if(cell.isOpen) this.state.UIManager.addScore(cell.score);

      if(cell.topPanel && cell.topPanel.isOpen && cell.topPanel.isGood) {
        this.state.add.tween(this)
          .to({y: cell.topPanel.y}, this.speed)
          .start();
        this.lastMove = 'top';
      }
      else if(this.lastMove !== 'left' && cell.rightPanel && cell.rightPanel.isOpen && cell.rightPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.rightPanel.x}, this.speed)
          .start();
        this.lastMove = 'right';
      }
      else if(this.lastMove !== 'right' && cell.leftPanel && cell.leftPanel.isOpen && cell.leftPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.leftPanel.x}, this.speed)
          .start();
        this.lastMove = 'left';
      }
      else {
        let tween = this.state.add.tween(this)
          .to({y: cell.topPanel.y, alpha: 0, width: 0, height: 0}, this.speed)
          .start();
        tween.onComplete.add(() => {
          ui.goTo(this.state, 'Menu',  this.state.UIManager.score);
        });
      }
    });
  }
  update() {
    this.rotation += .01;
  }
}

module.exports = Player;

},{"../mixins/ui":7,"./Entity":9}],11:[function(require,module,exports){
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
    "img": "cell4",
    "chance": 30,
    "imgClick": "cell4-fill",
    "isOpen": false,
    "isClick": true,
    "clickCount": 2,
    "score": 5,
    "isGood": true
  },
  {
    "img": "cell1",
    "chance": 100,
    "imgClick": "cell1-fill",
    "isOpen": false,
    "clickCount": 1,
    "isClick": true,
    "score": 1,
    "isGood": true
  }
]

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
const ui = require('../mixins/ui');
const Entity = require('../objects/Entity');

class Menu {
	init(score = 0) {
		if(localStorage.getItem("score") < score || !localStorage.getItem("score"))
			localStorage.setItem("score", score);

		this.bg = ui.createBg(this, this.game.width/5, 5, 10);

		// this.colorsClouds = this.add.sprite(0, 0, 'colors-clouds');
		// this.add.tween(this.colorsClouds)
		// 	.to({height: this.colorsClouds.height+150}, 4000)
		// 	.to({height: this.colorsClouds.height}, 4000)
		// 	.yoyo()
		// 	.loop()
		// 	.start();
		//
		// this.grayClouds = this.add.sprite(0, this.game.height, 'gray-clouds');
		// this.grayClouds.anchor.set(0, 1);
		// this.add.tween(this.grayClouds)
		// 	.to({height: this.grayClouds.height+100}, 3000)
		// 	.to({height: this.grayClouds.height}, 3000)
		// 	.yoyo()
		// 	.loop()
		// 	.start();
		//
		//
		// this.partGrayCloud = this.add.sprite(0, 425, 'part-gray-cloud');
		// this.add.tween(this.partGrayCloud)
		// 	.to({y: this.partGrayCloud.y+60}, 5000)
		// 	.to({y: this.partGrayCloud.y}, 5000)
		// 	.yoyo()
		// 	.loop()
		// 	.start();
		//
		// this.partColorsCloud1 = this.add.sprite(62, 760, 'part-colors-cloud');
		// this.add.tween(this.partColorsCloud1)
		// 	.to({y: this.partColorsCloud1.y+80}, 4000)
		// 	.to({y: this.partColorsCloud1.y}, 4000)
		// 	.yoyo()
		// 	.loop()
		// 	.start();
		//
		// this.partColorsCloud2 = this.add.sprite(470, 680, 'part-colors-cloud');
		// this.add.tween(this.partColorsCloud2)
		// 	.to({y: this.partColorsCloud2.y+70}, 3000)
		// 	.to({y: this.partColorsCloud2.y}, 3000)
		// 	.yoyo()
		// 	.loop()
		// 	.start();

		this.play = this.add.sprite(this.game.width/2, 550, 'play');
		this.play.anchor.set(.5);
		this.play.inputEnabled = true;
		this.play.events.onInputUp.addOnce(() => {
			// this.add.tween(this.grayClouds)
			// 	.to({y: this.game.height+1500}, 500)
			// 	.start();
			//
			// this.add.tween(this.partColorsCloud1)
			// 	.to({y: this.game.height+1000}, 1000)
			// 	.start();
			//
			// this.add.tween(this.partColorsCloud2)
			// 	.to({y: this.game.height+1000}, 1000)
			// 	.start();
			//
			// this.add.tween(this.partGrayCloud)
			// 	.to({y: -1000}, 1000)
			// 	.start();
			//
			let tween = this.add.tween(this.play)
				.to({rotation: Math.PI/2}, 100)
				.to({width: this.play.width+20, height: this.play.height+20}, 100)
				.start();

			tween.onComplete.add(() => {
				ui.goTo(this, 'Playground');
			});
		});

		this.add.sprite(this.game.width/2, 770, 'star').anchor.set(.5);
		this.settings = this.add.sprite(this.game.width/2, 1000, 'settings');
		this.settings.anchor.set(.5);
		this.settings.inputEnabled = true;
		this.settings.events.onInputUp.addOnce(() => {
			let tween = this.add.tween(this.settings)
				.to({rotation: Math.PI/2}, 100)
				.to({width: this.settings.width+20, height: this.settings.height+20}, 100)
				.start();

			tween.onComplete.add(() => {
				ui.goTo(this, 'Settings');
			});
		});

    this.label = this.add.text(this.game.width/2, 140, "Mottion", {
      font: 'Opificio',
      fontSize: 100,
      fontWeight: 100,
			fontWeight: 600,
      fill: "#555dff"
    });
    this.label.anchor.set(0.5);

    this.text = this.add.text(this.game.width/2, 230, "Sens in the way", {
      font: 'Opificio',
      fontSize: 60,
      fontWeight: 600,
      fill: "#555dff"
    });
    this.text.anchor.set(0.5);
		//
		this.scores = this.add.text(this.game.width/2, 350, score + ' | ' + localStorage.getItem('score'), {
      font: 'Roboto',
      fontSize: 62,
      fontWeight: 800,
      fill: "#555dff"
    });
    this.scores.anchor.set(0.5);
	}
	update() {
		// this.btn.rotation += .02;
	}
}

module.exports = Menu;

},{"../mixins/ui":7,"../objects/Entity":9}],14:[function(require,module,exports){
const CellsManager = require('../managers/CellsManager');
const CloudsManager = require('../managers/CloudsManager');
const IslandManager = require('../managers/IslandManager');
const WindowManager = require('../managers/WindowManager');
const UIManager = require('../managers/UIManager');

const Player = require('../objects/Player');

class Playground {
	create() {
		this.world.setBounds(0, -this.game.height*1000, this.game.width, this.game.height*2000);
		this.physics.startSystem(Phaser.Physics.Arcade);


		this.bg = this.add.sprite(0, 0, 'bg');
		this.bg.width = this.game.width;
		this.bg.height = this.game.height;
		this.bg.fixedToCamera = true;

		this.cellsManager = new CellsManager(this, 5);
		this.islandManager = new IslandManager(this);
		this.player = new Player(this);
		this.cloudsManager = new CloudsManager(this);

		this.UIManager = new UIManager(this);

		this.windowManager = new WindowManager(this);
		this.windowManager.addWindow('Mottion', 'Sens in the way... Lorem ipsum blablalallalblbl');

	}
	update() {
		this.cloudsManager.update();
    this.cellsManager.update();
		this.islandManager.update();
		this.player.update();
	}
}

module.exports = Playground;

},{"../managers/CellsManager":2,"../managers/CloudsManager":3,"../managers/IslandManager":4,"../managers/UIManager":5,"../managers/WindowManager":6,"../objects/Player":10}],15:[function(require,module,exports){
class Preload {
	init() {
	}
	preload() {
		this.load.image('bg', 'assets/bg.png');
		this.load.image('player', 'assets/player.png');

		// cells
		this.load.image('cell1', 'assets/cells/cell1.png');
		this.load.image('cell2', 'assets/cells/cell2.png');
		this.load.image('cell3', 'assets/cells/cell3.png');
		this.load.image('cell4', 'assets/cells/cell4.png');

		this.load.image('cell1-fill', 'assets/cells/cell1-fill.png');
		this.load.image('cell4-fill', 'assets/cells/cell4-fill.png');

		// island
		this.load.image('island', 'assets/island/island.png');
		this.load.image('flag', 'assets/island/flag.png');
		this.load.image('cloud', 'assets/island/cloud.png');

		// ui
		this.load.image('play', 'assets/ui/play.png');
		this.load.image('settings', 'assets/ui/settings.png');
		this.load.image('star', 'assets/ui/star.png');
		this.load.image('time', 'assets/ui/time.png');
		this.load.image('plane', 'assets/ui/plane.png');

		// menu
		this.load.image('gray-clouds', 'assets/menu/grayclouds.png');
		this.load.image('colors-clouds', 'assets/menu/colorsclouds.png');
		this.load.image('part-gray-cloud', 'assets/menu/partgraycloud.png');
		this.load.image('part-colors-cloud', 'assets/menu/partcolorscloud.png');
	}

	create() {
		this.state.start('Menu');
	}
}

module.exports = Preload;

},{}],16:[function(require,module,exports){
const ui = require('../mixins/ui');

class Settings {
	init() {
		this.bg = ui.createBg(this, this.game.width/5, 5, 10);

    this.label = this.add.text(this.game.width/2, 140, "Settings", {
      font: 'Opificio',
      fontSize: 100,
      fontWeight: 100,
			fontWeight: 600,
      fill: "#555dff"
    });
    this.label.anchor.set(0.5);


    this.sounds = this.add.text(this.game.width/2, 550, "Sounds | ON", {
      font: 'Opificio',
      fontSize: 60,
      fontWeight: 600,
      fill: "#555dff"
    });
    this.sounds.anchor.set(0.5);

    this.music = this.add.text(this.game.width/2, 650, "Music | OFF", {
      font: 'Opificio',
      fontSize: 60,
      fontWeight: 600,
      fill: "#555dff"
    });
    this.music.anchor.set(0.5);

    this.back = this.add.text(150, this.game.height-80, "Back", {
      font: 'Opificio',
      fontSize: 80,
      fontWeight: 600,
      fill: "#555dff"
    });
    this.back.anchor.set(0.5);
    this.back.inputEnabled = true;
    this.back.events.onInputUp.addOnce(() => {
      ui.goTo(this, 'Menu');
    });
	}
	update() {

	}
}

module.exports = Settings;

},{"../mixins/ui":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0NlbGxzTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0Nsb3Vkc01hbmFnZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9tYW5hZ2Vycy9Jc2xhbmRNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvVUlNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvV2luZG93TWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21peGlucy91aS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvQ2VsbC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvRW50aXR5LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvb2JqZWN0cy9QbGF5ZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9vYmplY3RzL3R5cGVzLmpzb24iLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvQm9vdC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9NZW51LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc3RhdGVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvUHJlbG9hZC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9TZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBCb290ID0gcmVxdWlyZSgnLi9zdGF0ZXMvQm9vdC5qcycpO1xyXG5jb25zdCBQcmVsb2FkID0gcmVxdWlyZSgnLi9zdGF0ZXMvUHJlbG9hZC5qcycpO1xyXG5jb25zdCBNZW51ID0gcmVxdWlyZSgnLi9zdGF0ZXMvTWVudS5qcycpO1xyXG5jb25zdCBQbGF5Z3JvdW5kID0gcmVxdWlyZSgnLi9zdGF0ZXMvUGxheWdyb3VuZC5qcycpO1xyXG5jb25zdCBTZXR0aW5ncyA9IHJlcXVpcmUoJy4vc3RhdGVzL1NldHRpbmdzLmpzJyk7XHJcblxyXG52YXIgcmVhZHkgPSAoKSA9PiB7XHJcblx0dmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoNzIwLCAxMjgwLCBQaGFzZXIuQVVUTywgJ01vdHRpb24nKTtcclxuXHJcblx0Z2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCBCb290LCB0cnVlKTtcclxuICBnYW1lLnN0YXRlLmFkZCgnUHJlbG9hZCcsIFByZWxvYWQpO1xyXG4gIGdhbWUuc3RhdGUuYWRkKCdNZW51JywgTWVudSk7XHJcblx0Z2FtZS5zdGF0ZS5hZGQoJ1NldHRpbmdzJywgU2V0dGluZ3MpO1xyXG5cdGdhbWUuc3RhdGUuYWRkKCdQbGF5Z3JvdW5kJywgUGxheWdyb3VuZCk7XHJcbn1cclxuXHJcbnJlYWR5KCk7XHJcbiIsImNvbnN0IENlbGwgPSByZXF1aXJlKCcuLi9vYmplY3RzL0NlbGwnKTtcclxuY29uc3QgdHlwZXMgPSByZXF1aXJlKCcuLi9vYmplY3RzL3R5cGVzJyk7XG50eXBlcy5zb3J0KChhLCBiKSA9PiBhLmNoYW5jZSAtIGIuY2hhbmNlKTtcclxuXHJcblxyXG5jbGFzcyBDZWxsc01hbmFnZXIgZXh0ZW5kcyBQaGFzZXIuR3JvdXAge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlLCBhbXRYLCBhbXRZKSB7XHJcbiAgICBzdXBlcihzdGF0ZS5nYW1lKTtcclxuXHJcbiAgICB0aGlzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuYW10WCA9IGFtdFggfHwgNTtcclxuXHJcbiAgICB0aGlzLnNpemVDZWxsID0gc3RhdGUuZ2FtZS53aWR0aC90aGlzLmFtdFg7XHJcbiAgICB0aGlzLmxhc3RZID0gMDtcbiAgICB0aGlzLmxhc3QgPSBbXTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLmNyZWF0ZUNlbGxzKGFtdFkgfHwgMTUpO1xuICB9XHJcbiAgY3JlYXRlQ2VsbHMoYW10R2VuWSkge1xyXG4gICAgbGV0IGFyciA9IFtdO1xyXG5cclxuICAgIGZvcihsZXQgeSA9IHRoaXMubGFzdFk7IHkgPCB0aGlzLmxhc3RZK2FtdEdlblk7IHkrKykge1xyXG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgdGhpcy5hbXRYOyB4KyspIHtcclxuICAgICAgICBsZXQgcmFuZCA9IE1hdGgucmFuZG9tKCkqMTAwO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgIGlmKHJhbmQgPCB0eXBlc1tpXS5jaGFuY2UpIHtcclxuICAgICAgICAgICAgIGxldCBjZWxsID0gdGhpcy5nZXRGaXJzdERlYWQoKTtcclxuICAgICAgICAgICAgIGlmKCFjZWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjZWxsID0gbmV3IENlbGwodGhpcywgdHlwZXNbaV0sIHgsIHkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoY2VsbCk7XHJcbiAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICBjZWxsLnJlVXNlQ2VsbCh4LCB5LCB0eXBlc1tpXSk7XHJcbiAgICAgICAgICAgICAgIGNlbGwucmV2aXZlKCk7XHJcbiAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgYXJyLnB1c2goY2VsbCk7XHJcbiAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgYW10R2VuWTsgeSsrKSB7XHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCB0aGlzLmFtdFg7IHgrKykge1xyXG4gICAgICAgIGlmKHkrMSA8IGFtdEdlblkpIGFyclt5KnRoaXMuYW10WCt4XS50b3BQYW5lbCA9IGFyclsoeSsxKSp0aGlzLmFtdFgreF07XHJcbiAgICAgICAgaWYoeC0xID49IDApIGFyclt5KnRoaXMuYW10WCt4XS5sZWZ0UGFuZWwgPSBhcnJbeSp0aGlzLmFtdFgreC0xXTtcclxuICAgICAgICBpZih4KzEgPCB0aGlzLmFtdFgpICBhcnJbeSp0aGlzLmFtdFgreF0ucmlnaHRQYW5lbCA9IGFyclt5KnRoaXMuYW10WCt4KzFdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmxhc3QubGVuZ3RoKSB7XHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCB0aGlzLmFtdFg7IHgrKykge1xyXG4gICAgICAgIHRoaXMubGFzdFt4XS50b3BQYW5lbCA9IGFyclt4XTtcclxuICAgICAgfVxyXG4gICAgfVxuXG4gICAgdGhpcy5sYXN0ID0gW107XG4gICAgZm9yKGxldCBpID0gYXJyLmxlbmd0aC10aGlzLmFtdFg7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMubGFzdC5wdXNoKGFycltpXSk7XG4gICAgfVxyXG4gICAgdGhpcy5sYXN0WSArPSBhbXRHZW5ZO1xyXG4gIH1cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIGxldCBpc0hpZGUgPSBmYWxzZTtcclxuICAgIHRoaXMuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICBpZihjZWxsLnkgPiB0aGlzLnN0YXRlLnBsYXllci55K3RoaXMuc3RhdGUuZ2FtZS5oZWlnaHQtNDAwKSB7XHJcbiAgICAgICAgY2VsbC5sZWZ0UGFuZWwgPSBudWxsO1xyXG4gICAgICAgIGNlbGwucmlnaHRQYW5lbCA9IG51bGw7XHJcbiAgICAgICAgY2VsbC50b3BQYW5lbCA9IG51bGw7XHJcbiAgICAgICAgY2VsbC5raWxsKCk7XHJcbiAgICAgICAgIWlzSGlkZSAmJiB0aGlzLmNyZWF0ZUNlbGxzKDEpO1xyXG4gICAgICAgIGlzSGlkZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDZWxsc01hbmFnZXI7XHJcbiIsImNsYXNzIENsb3Vkc01hbmFnZXIgZXh0ZW5kcyBQaGFzZXIuR3JvdXAge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBzdXBlcihzdGF0ZS5nYW1lKTtcclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuXHJcbiAgICB0aGlzLmxhc3RZID0gMDtcclxuXHJcbiAgICB0aGlzLnRpbWVyID0gdGhpcy5zdGF0ZS50aW1lLmNyZWF0ZShmYWxzZSk7XHJcbiAgICB0aGlzLnRpbWVyLmxvb3AoMTAwMCwgdGhpcy5jcmVhdGVDbG91ZCwgdGhpcyk7XHJcbiAgICB0aGlzLnRpbWVyLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIGNyZWF0ZUNsb3VkKCkge1xyXG4gICAgdGhpcy5sYXN0WSAtPSB0aGlzLnN0YXRlLnJuZC5iZXR3ZWVuKHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQsIHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQqMik7XHJcblxyXG4gICAgbGV0IGNsb3VkID0gdGhpcy5nZXRGaXJzdERlYWQoKTtcclxuICAgIGlmKCFjbG91ZCkge1xyXG4gICAgICAgY2xvdWQgPSB0aGlzLmFkZCh0aGlzLnN0YXRlLm1ha2Uuc3ByaXRlKDAsIHRoaXMubGFzdFksICdjbG91ZCcpKTtcclxuICAgICAgIHRoaXMucmFuZG9taXplQ2xvdWQoY2xvdWQpO1xyXG4gICAgICAgdGhpcy5hZGQoY2xvdWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yYW5kb21pemVDbG91ZChjbG91ZCk7XHJcbiAgICAgIGNsb3VkLnJldml2ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuICByYW5kb21pemVDbG91ZChjbG91ZCkge1xyXG4gICAgaWYoTWF0aC5yYW5kb20oKSA8IC41KSB7XHJcbiAgICAgIGNsb3VkLnBvc2l0aW9uLnNldCgwLCB0aGlzLmxhc3RZKTtcclxuICAgICAgY2xvdWQud2lkdGggPSB0aGlzLnN0YXRlLmdhbWUud2lkdGgtMTAwO1xyXG4gICAgICBjbG91ZC5oZWlnaHQgPSA0MDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjbG91ZC5wb3NpdGlvbi5zZXQoMTAwLCB0aGlzLmxhc3RZKTtcclxuICAgICAgY2xvdWQud2lkdGggPSB0aGlzLnN0YXRlLmdhbWUud2lkdGgtMTAwO1xyXG4gICAgICBjbG91ZC5oZWlnaHQgPSA0MDA7XHJcbiAgICAgIGNsb3VkLmFuY2hvci5zZXQoMSk7XHJcbiAgICAgIGNsb3VkLnNjYWxlLnggKj0gLTE7XHJcbiAgICB9XHJcbiAgICBjbG91ZC5kdXJhdGlvbiA9IE1hdGgucmFuZG9tKCkqMjtcclxuICAgIGNsb3VkLmFscGhhID0gLjk7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy5mb3JFYWNoKChjbG91ZCkgPT4ge1xyXG4gICAgICBjbG91ZC55ICs9IGNsb3VkLmR1cmF0aW9uO1xyXG4gICAgICBpZihjbG91ZC55ID4gdGhpcy5zdGF0ZS5wbGF5ZXIueSt0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LTQwMClcclxuICAgICAgICBjbG91ZC5raWxsKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2xvdWRzTWFuYWdlcjtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9FbnRpdHknKTtcclxuXG5jbGFzcyBJc2xhbmRNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgc3VwZXIoc3RhdGUuZ2FtZSk7XHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgdGhpcy5hdXRvQ3VsbCA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5pc2xhbmQgPSB0aGlzLmNyZWF0ZSgwLCB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0KzEwLCAnaXNsYW5kJyk7XHJcbiAgICB0aGlzLmlzbGFuZC5hbmNob3Iuc2V0KDAsIDEpO1xyXG4gICAgdGhpcy5pc2xhbmQud2lkdGggPSB0aGlzLnN0YXRlLmNlbGxzTWFuYWdlci5zaXplQ2VsbCp0aGlzLnN0YXRlLmNlbGxzTWFuYWdlci5hbXRYO1xyXG4gICAgdGhpcy5pc2xhbmQuaGVpZ2h0ID0gdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuc2l6ZUNlbGwqdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuYW10WDtcclxuICAgIC8vIHRoaXMuaXNsYW5kLnRpbnQgPSAweGZmNDQ0NDsgMHgwMGQ0NjFcclxuXHJcbiAgICB0aGlzLmNyZWF0ZSg0Mi0yMCwgNjUwLCAnZmxhZycpO1xyXG4gICAgdGhpcy5jcmVhdGUoMTIwLTIwLCA4NDAsICdmbGFnJyk7XHJcbiAgICB0aGlzLmNyZWF0ZSg3NS0yMCwgMTA2MCwgJ2ZsYWcnKTtcclxuICAgIHRoaXMuY3JlYXRlKDI2NS0yMCwgOTgwLCAnZmxhZycpO1xyXG4gICAgdGhpcy5jcmVhdGUoNDQwKzEwMCwgMTExMCwgJ2ZsYWcnKS5zY2FsZS54ICo9IC0xO1xyXG4gICAgdGhpcy5jcmVhdGUoNTcwKzEwMCwgMTAxNSwgJ2ZsYWcnKS5zY2FsZS54ICo9IC0xO1xyXG4gICAgdGhpcy5jcmVhdGUoNjIwKzEwMCwgNzgwLCAnZmxhZycpLnNjYWxlLnggKj0gLTE7XHJcbiAgfVxyXG4gIHVwZGF0ZSgpIHtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSXNsYW5kTWFuYWdlcjtcclxuIiwiY2xhc3MgVUlNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgc3VwZXIoc3RhdGUpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgIHRoaXMuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5wbGFuZSA9IHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoMCwgMCwgJ3BsYW5lJyk7XHJcbiAgICB0aGlzLmFkZCh0aGlzLnBsYW5lKTtcclxuXHJcbiAgICB0aGlzLnNjb3JlVGV4dCA9IHRoaXMuc3RhdGUubWFrZS50ZXh0KDUwLCAyNSwgXCIwIHN0ZXBzXCIsIHtcclxuICAgICAgZm9udDogJ1JvYm90bycsXHJcbiAgICAgIGZvbnRTaXplOiA2MCxcclxuICAgICAgZm9udFdlaWdodDogODAwLFxyXG4gICAgICBmaWxsOiBcIiM1NTVkZmZcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmFkZCh0aGlzLnNjb3JlVGV4dCk7XHJcbiAgICB0aGlzLnNjb3JlID0gMDtcclxuXHJcblxyXG4gICAgdGhpcy5wYXVzZSA9IHRoaXMuc3RhdGUubWFrZS5zcHJpdGUodGhpcy5zdGF0ZS5nYW1lLndpZHRoLTgwLCA3MCwgJ3RpbWUnKTtcclxuICAgIHRoaXMucGF1c2UuYW5jaG9yLnNldCguNSk7XHJcbiAgICB0aGlzLnBhdXNlLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICB0aGlzLnBhdXNlLmV2ZW50cy5vbklucHV0VXAuYWRkKCgpID0+IHtcclxuICAgICAgdGhpcy5wYXVzZS5yb3RhdGlvbiA9IDA7XHJcbiAgICAgIGxldCB0d2VlbiA9IHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMucGF1c2UpXHJcbiAgICAgICAgLnRvKHtyb3RhdGlvbjogTWF0aC5QSSoyfSwgNTAwKVxyXG4gICAgICAgIC5zdGFydCgpO1xyXG5cclxuICAgICAgaWYoIXRoaXMuc3RhdGUuZ2FtZS5wYXVzZWQpIHtcclxuICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnN0YXRlLmdhbWUucGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHRoaXMuc3RhdGUuZ2FtZS5wYXVzZWQgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5hZGQodGhpcy5wYXVzZSk7XHJcbiAgfVxyXG4gIGFkZFNjb3JlKHYpIHtcclxuICAgIHRoaXMuc2NvcmUgKz0gdjtcclxuICAgIHRoaXMuc2NvcmVUZXh0LnRleHQgPSB0aGlzLnNjb3JlICsgJyBzdGVwcyc7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFVJTWFuYWdlcjtcclxuIiwiY2xhc3MgV2luZG93TWFuYWdlciBleHRlbmRzIFBoYXNlci5Hcm91cCB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIHN1cGVyKHN0YXRlKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgdGhpcy5hbHBoYSA9IDA7XHJcbiAgICB0aGlzLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuYmcgPSB0aGlzLnN0YXRlLm1ha2UuZ3JhcGhpY3MoMCwgMCk7XHJcbiAgICB0aGlzLmJnLmJlZ2luRmlsbCgweEZGRkZGRik7XHJcbiAgICB0aGlzLmJnLmRyYXdSZWN0KDAsIDAsIHRoaXMuc3RhdGUuZ2FtZS53aWR0aCwgdGhpcy5zdGF0ZS5nYW1lLmhlaWdodCk7XHJcbiAgICB0aGlzLmJnLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICB0aGlzLmFkZCh0aGlzLmJnKTtcclxuXHJcbiAgICB0aGlzLmxhYmVsID0gdGhpcy5zdGF0ZS5tYWtlLnRleHQodGhpcy5zdGF0ZS5nYW1lLndpZHRoLzIsIDQ0MCwgXCJcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogMTAwLFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICB0aGlzLmFkZCh0aGlzLmxhYmVsKTtcclxuXHJcblxyXG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5zdGF0ZS5tYWtlLnRleHQodGhpcy5zdGF0ZS5nYW1lLndpZHRoLzIsIDU0MCwgXCJcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogNTAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCIsXHJcbiAgICAgIGFsaWduOiAnY2VudGVyJyxcclxuICAgICAgd29yZFdyYXA6IHRydWUsXHJcbiAgICAgIHdvcmRXcmFwV2lkdGg6IHRoaXMuc3RhdGUuZ2FtZS53aWR0aC0xMDBcclxuICAgIH0pO1xyXG4gICAgdGhpcy5jb250ZW50LmFuY2hvci5zZXQoMC41LCAwKTtcclxuICAgIHRoaXMuYWRkKHRoaXMuY29udGVudCk7XHJcbiAgfVxyXG4gIGFkZFdpbmRvdyhsYWJlbCwgdGV4dCwgY2IpIHtcclxuICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7YWxwaGE6IDF9LCA1MDApXHJcbiAgICAgIC5zdGFydCgpO1xyXG4gICAgdGhpcy5iZy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMubGFiZWwudGV4dCA9IGxhYmVsO1xyXG4gICAgdGhpcy5jb250ZW50LnRleHQgPSB0ZXh0O1xyXG5cdFx0dGhpcy5iZy5ldmVudHMub25JbnB1dFVwLmFkZE9uY2UoKCkgPT4ge1xyXG4gICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgIC50byh7YWxwaGE6IDB9LCA1MDApXHJcbiAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgIHRoaXMuYmcuaW5wdXRFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgIGNiICYmIGNiKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV2luZG93TWFuYWdlcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgY3JlYXRlQmcoc3RhdGUsIHNpemU9MTAwLCBheD0yMCwgYXk9MjApIHtcclxuICAgIGxldCBiZyA9IHN0YXRlLmFkZC5ncmFwaGljcygpO1xyXG4gICAgYmcuYmVnaW5GaWxsKDB4RkZGRkZGLCAxKTtcclxuICAgIGJnLmRyYXdSZWN0KDAsIDAsIHN0YXRlLmdhbWUud2lkdGgsIHN0YXRlLmdhbWUuaGVpZ2h0KTtcclxuICAgIGJnLmVuZEZpbGwoKTtcclxuXHJcbiAgICBiZy5saW5lU3R5bGUoNCwgMHgyZTJlNDQsIC4xKTtcclxuXHJcbiAgICBmb3IobGV0IHggPSAwOyB4IDwgYXg7IHgrKykge1xyXG4gICAgICBiZy5tb3ZlVG8oc2l6ZSp4LCAwKTtcclxuICAgICAgYmcubGluZVRvKHNpemUqeCwgc3RhdGUuZ2FtZS5oZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IGF5OyB5KyspIHtcclxuICAgICAgYmcubW92ZVRvKDAsIHNpemUqeSk7XHJcbiAgICAgIGJnLmxpbmVUbyhzdGF0ZS5nYW1lLndpZHRoLCBzaXplKnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJnO1xyXG4gIH0sXHJcbiAgZ29UbyhzdGF0ZSwgbmFtZSwgYXJncykge1xyXG4gICAgc3RhdGUuY2FtZXJhLmZhZGUoMHhGRkZGRkYpO1xyXG4gICAgc3RhdGUuY2FtZXJhLm9uRmFkZUNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcbiAgICAgIHN0YXRlLnN0YXRlLnN0YXJ0KG5hbWUsIHRydWUsIGZhbHNlLCBhcmdzKTtcclxuICAgICAgc3RhdGUuc3RhdGUuZ2V0Q3VycmVudFN0YXRlKCkuY2FtZXJhLmZsYXNoKDB4RkZGRkZGLCAxMDAwKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCJjb25zdCB0eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcclxuXHJcbmNsYXNzIENlbGwgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcclxuICBjb25zdHJ1Y3RvcihtYW5hZ2VyLCB0eXBlLCB4LCB5KSB7XHJcbiAgICBzdXBlcihtYW5hZ2VyLmdhbWUsIDAsIDAsIHR5cGUuaW1nKTtcclxuXHJcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xyXG4gICAgdGhpcy5zdGF0ZSA9IG1hbmFnZXIuc3RhdGU7XG5cbiAgICB0aGlzLnBhZGRpbmcgPSAxMDtcbiAgICB0aGlzLnNpemUgPSB0aGlzLm1hbmFnZXIuc2l6ZUNlbGw7XHJcbiAgICB0aGlzLndpZHRoID0gdGhpcy5zaXplLXRoaXMucGFkZGluZztcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5zaXplLXRoaXMucGFkZGluZztcclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSk7XHJcblxuICAgIHRoaXMucmVVc2VDZWxsKHgsIHksIHR5cGUpO1xyXG4gIH1cbiAgcmVVc2VDZWxsKHgsIHksIHR5cGUpIHtcclxuICAgIHRoaXMubG9hZFRleHR1cmUodHlwZS5pbWcsIDApO1xyXG5cclxuICAgIHRoaXMueCA9IHgqdGhpcy5zaXplK3RoaXMucGFkZGluZy8yK3RoaXMud2lkdGgvMjtcclxuICAgIHRoaXMueSA9IDgwKnRoaXMubWFuYWdlci5hbXRYLXkqdGhpcy5zaXplK3RoaXMuaGVpZ2h0LzI7XHJcbiAgICB0aGlzLmlzT3BlbiA9IHR5cGUuaXNPcGVuO1xyXG4gICAgdGhpcy5pc0dvb2QgPSB0eXBlLmlzR29vZDtcclxuICAgIHRoaXMuc2NvcmUgPSB0eXBlLnNjb3JlO1xyXG4gICAgdGhpcy5pbnB1dEVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICBpZih0eXBlLmlzQ2xpY2spIHtcclxuICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmNsaWNrQ291bnQgPSB0eXBlLmNsaWNrQ291bnQ7XHJcblxyXG4gICAgICB0aGlzLmV2ZW50cy5vbklucHV0VXAuYWRkKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNsaWNrQ291bnQtLTtcclxuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5zaXplLXRoaXMucGFkZGluZztcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuc2l6ZS10aGlzLnBhZGRpbmc7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3dpZHRoOiB0aGlzLndpZHRoKzMwLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0KzMwfSwgMTAwKVxyXG4gICAgICAgICAgLnRvKHt3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodH0sIDEwMClcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNsaWNrQ291bnQgPT09IDApIHtcclxuICAgICAgICAgIHRoaXMubG9hZFRleHR1cmUodHlwZS5pbWdDbGljaywgMCk7XHJcbiAgICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENlbGw7XHJcbiIsImNsYXNzIEVudGl0eSBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlLCB4LCB5LCByLCBpc0FyY3MsIHNjYWxlPTEuNSkge1xyXG4gICAgc3VwZXIoc3RhdGUuZ2FtZSwgeCwgeSwgJ3BsYXllcicpO1xyXG4gICAgXHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLndpZHRoID0gcjtcclxuICAgIHRoaXMuaGVpZ2h0ID0gcjtcclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSk7XHJcblxyXG4gICAgdGhpcy5hcmNTY2FsZSA9IHNjYWxlO1xyXG5cclxuICAgIGlmKGlzQXJjcykge1xyXG4gICAgICB0aGlzLmNyZWF0ZUFyYygtLjgsIC0xLCAuOSwgMSwgMHgzNzNmZmYpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUFyYyguOSwgLS44LCAtMSwgLjksIDB4ZmYzNzM3KTtcclxuICAgICAgdGhpcy5jcmVhdGVBcmMoLS44LCAuOSwgLjgsIC0xLCAweDQyODYzYyk7XHJcbiAgICAgIHRoaXMuY3JlYXRlQXJjKC44LCAuOSwgLS44LCAtLjgsIDB4ODI0MmFhKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmFuZCA9IHRoaXMuc3RhdGUucm5kLmJldHdlZW4oMzAwLCAxMDAwKTtcclxuICAgIGxldCBzYyA9IHRoaXMuc3RhdGUucm5kLmJldHdlZW4oNSwgNDApO1xyXG4gICAgdGhpcy50d2VlbkJyZWF0aGUgPSB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAudG8oe3dpZHRoOiByK3NjLCBoZWlnaHQ6IHIrc2N9LCByYW5kKVxyXG4gICAgICAudG8oe3dpZHRoOiByLCBoZWlnaHQ6IHJ9LCByYW5kKVxyXG4gICAgICAueW95bygpXHJcbiAgICAgIC5sb29wKClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIGNyZWF0ZUFyYyhzeCwgc3ksIGV4LCBleSwgdGludCkge1xyXG4gICAgbGV0IGFyYyA9IHRoaXMuc3RhdGUubWFrZS5zcHJpdGUodGhpcy53aWR0aCpzeC90aGlzLmFyY1NjYWxlLCB0aGlzLmhlaWdodCpzeS90aGlzLmFyY1NjYWxlLCAncGxheWVyJyk7XHJcblxyXG4gICAgYXJjLnRpbnQgPSB0aW50O1xyXG4gICAgYXJjLndpZHRoID0gMzA7XHJcbiAgICBhcmMuaGVpZ2h0ID0gMzA7XHJcbiAgICB0aGlzLnN0YXRlLmFkZC50d2VlbihhcmMpXHJcbiAgICAgIC50byh7eDogdGhpcy53aWR0aCpleC90aGlzLmFyY1NjYWxlLCB5OiB0aGlzLmhlaWdodCpleS90aGlzLmFyY1NjYWxlLCB3aWR0aDogMCwgaGVpZ2h0OiAwfSwgdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbig1MDAsIDEwMDApKVxyXG4gICAgICAudG8oe3g6IHRoaXMud2lkdGgqc3gvdGhpcy5hcmNTY2FsZSwgeTogdGhpcy5oZWlnaHQqc3kvdGhpcy5hcmNTY2FsZX0sIHRoaXMuc3RhdGUucm5kLmJldHdlZW4oMzAwLCA2MDApKVxyXG4gICAgICAudG8oe3dpZHRoOiAzMCwgaGVpZ2h0OiAzMH0sIHRoaXMuc3RhdGUucm5kLmJldHdlZW4oNTAwLCAxMDAwKSlcclxuICAgICAgLnlveW8oKVxyXG4gICAgICAubG9vcCgpXHJcbiAgICAgIC5zdGFydCgpO1xyXG4gICAgdGhpcy5hZGRDaGlsZChhcmMpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5Jyk7XHJcbmNvbnN0IHVpID0gcmVxdWlyZSgnLi4vbWl4aW5zL3VpJyk7XHJcblxyXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBFbnRpdHkge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBzdXBlcihzdGF0ZSwgc3RhdGUuZ2FtZS53aWR0aC8yLCBzdGF0ZS5nYW1lLmhlaWdodC00MDAsIDcwLCB0cnVlKTtcclxuICAgIHN0YXRlLmFkZC5leGlzdGluZyh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzKTtcclxuICAgIHRoaXMuYm9keS5zZXRTaXplKHRoaXMud2lkdGgvMi0xLCB0aGlzLmhlaWdodC8yLTEsIDEsIDEpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuY2FtZXJhLmZvbGxvdyh0aGlzKTtcclxuXHRcdHRoaXMuc3RhdGUuY2FtZXJhLmRlYWR6b25lID0gbmV3IFBoYXNlci5SZWN0YW5nbGUodGhpcy54LXRoaXMud2lkdGgvMiwgdGhpcy55LXRoaXMuaGVpZ2h0LzIsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICB0aGlzLnNwZWVkID0gNDAwO1xyXG4gICAgdGhpcy5sYXN0TW92ZTtcclxuXHJcbiAgICB0aGlzLnRpbWVyID0gdGhpcy5zdGF0ZS50aW1lLmNyZWF0ZShmYWxzZSk7XHJcbiAgICB0aGlzLnRpbWVyLmxvb3AodGhpcy5zcGVlZCwgdGhpcy5tb3ZlLCB0aGlzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLmlucHV0Lm9uRG93bi5hZGRPbmNlKCgpID0+IHtcclxuICAgICAgbGV0IHR3ZWVuID0gdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAudG8oe3k6IHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQtKHRoaXMuc3RhdGUuY2VsbHNNYW5hZ2VyLnNpemVDZWxsKnRoaXMuc3RhdGUuY2VsbHNNYW5hZ2VyLmFtdFgrdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuc2l6ZUNlbGwvMil9LCB0aGlzLnNwZWVkKjQpXHJcbiAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcclxuICAgICAgICB0aGlzLm1vdmUoKTtcclxuICAgICAgICB0aGlzLnRpbWVyLnN0YXJ0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBtb3ZlKCkge1xyXG4gICAgdGhpcy5zdGF0ZS5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHRoaXMsIHRoaXMuc3RhdGUuY2VsbHNNYW5hZ2VyLCAocGwsIGNlbGwpID0+IHtcclxuICAgICAgaWYoIWNlbGwudG9wUGFuZWwpIHJldHVybjtcclxuXHJcbiAgICAgIGlmKGNlbGwuaXNPcGVuKSB0aGlzLnN0YXRlLlVJTWFuYWdlci5hZGRTY29yZShjZWxsLnNjb3JlKTtcclxuXHJcbiAgICAgIGlmKGNlbGwudG9wUGFuZWwgJiYgY2VsbC50b3BQYW5lbC5pc09wZW4gJiYgY2VsbC50b3BQYW5lbC5pc0dvb2QpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt5OiBjZWxsLnRvcFBhbmVsLnl9LCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0TW92ZSA9ICd0b3AnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYodGhpcy5sYXN0TW92ZSAhPT0gJ2xlZnQnICYmIGNlbGwucmlnaHRQYW5lbCAmJiBjZWxsLnJpZ2h0UGFuZWwuaXNPcGVuICYmIGNlbGwucmlnaHRQYW5lbC5pc0dvb2QpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt4OiBjZWxsLnJpZ2h0UGFuZWwueH0sIHRoaXMuc3BlZWQpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLmxhc3RNb3ZlID0gJ3JpZ2h0JztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKHRoaXMubGFzdE1vdmUgIT09ICdyaWdodCcgJiYgY2VsbC5sZWZ0UGFuZWwgJiYgY2VsbC5sZWZ0UGFuZWwuaXNPcGVuICYmIGNlbGwubGVmdFBhbmVsLmlzR29vZCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3g6IGNlbGwubGVmdFBhbmVsLnh9LCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0TW92ZSA9ICdsZWZ0JztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBsZXQgdHdlZW4gPSB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt5OiBjZWxsLnRvcFBhbmVsLnksIGFscGhhOiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwfSwgdGhpcy5zcGVlZClcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcclxuICAgICAgICAgIHVpLmdvVG8odGhpcy5zdGF0ZSwgJ01lbnUnLCAgdGhpcy5zdGF0ZS5VSU1hbmFnZXIuc2NvcmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy5yb3RhdGlvbiArPSAuMDE7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcclxuIiwibW9kdWxlLmV4cG9ydHM9W1xyXG4gIHtcclxuICAgIFwiY2hhbmNlXCI6IDUsXHJcbiAgICBcImltZ1wiOiBcImNlbGwzXCIsXHJcbiAgICBcImlzT3BlblwiOiB0cnVlLFxyXG4gICAgXCJpc0NsaWNrXCI6IGZhbHNlLFxyXG4gICAgXCJzY29yZVwiOiAxMCxcclxuICAgIFwiaXNHb29kXCI6IHRydWVcclxuICB9LFxyXG4gIHtcclxuICAgIFwiY2hhbmNlXCI6IDIwLFxyXG4gICAgXCJpbWdcIjogXCJjZWxsMlwiLFxyXG4gICAgXCJpc09wZW5cIjogZmFsc2UsXHJcbiAgICBcImlzQ2xpY2tcIjogZmFsc2UsXHJcbiAgICBcInNjb3JlXCI6IDAsXHJcbiAgICBcImlzR29vZFwiOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJpbWdcIjogXCJjZWxsNFwiLFxyXG4gICAgXCJjaGFuY2VcIjogMzAsXHJcbiAgICBcImltZ0NsaWNrXCI6IFwiY2VsbDQtZmlsbFwiLFxyXG4gICAgXCJpc09wZW5cIjogZmFsc2UsXHJcbiAgICBcImlzQ2xpY2tcIjogdHJ1ZSxcclxuICAgIFwiY2xpY2tDb3VudFwiOiAyLFxyXG4gICAgXCJzY29yZVwiOiA1LFxyXG4gICAgXCJpc0dvb2RcIjogdHJ1ZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJpbWdcIjogXCJjZWxsMVwiLFxyXG4gICAgXCJjaGFuY2VcIjogMTAwLFxyXG4gICAgXCJpbWdDbGlja1wiOiBcImNlbGwxLWZpbGxcIixcclxuICAgIFwiaXNPcGVuXCI6IGZhbHNlLFxyXG4gICAgXCJjbGlja0NvdW50XCI6IDEsXHJcbiAgICBcImlzQ2xpY2tcIjogdHJ1ZSxcclxuICAgIFwic2NvcmVcIjogMSxcclxuICAgIFwiaXNHb29kXCI6IHRydWVcclxuICB9XHJcbl1cclxuIiwiY2xhc3MgQm9vdCB7XHJcblx0aW5pdCgpIHtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdHRoaXMuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcclxuXHRcdHRoaXMuc2NhbGUuZnVsbFNjcmVlblNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuRVhBQ1RfRklUO1xyXG5cdFx0dGhpcy5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcclxuXHRcdHRoaXMuc2NhbGUuc2V0TWF4aW11bSgpO1xyXG5cclxuXHRcdHRoaXMuc3RhdGUuc3RhcnQoJ1ByZWxvYWQnKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQm9vdDtcclxuIiwiY29uc3QgdWkgPSByZXF1aXJlKCcuLi9taXhpbnMvdWknKTtcclxuY29uc3QgRW50aXR5ID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9FbnRpdHknKTtcclxuXHJcbmNsYXNzIE1lbnUge1xyXG5cdGluaXQoc2NvcmUgPSAwKSB7XHJcblx0XHRpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNjb3JlXCIpIDwgc2NvcmUgfHwgIWxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2NvcmVcIikpXHJcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2NvcmVcIiwgc2NvcmUpO1xyXG5cclxuXHRcdHRoaXMuYmcgPSB1aS5jcmVhdGVCZyh0aGlzLCB0aGlzLmdhbWUud2lkdGgvNSwgNSwgMTApO1xyXG5cclxuXHRcdC8vIHRoaXMuY29sb3JzQ2xvdWRzID0gdGhpcy5hZGQuc3ByaXRlKDAsIDAsICdjb2xvcnMtY2xvdWRzJyk7XHJcblx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLmNvbG9yc0Nsb3VkcylcclxuXHRcdC8vIFx0LnRvKHtoZWlnaHQ6IHRoaXMuY29sb3JzQ2xvdWRzLmhlaWdodCsxNTB9LCA0MDAwKVxyXG5cdFx0Ly8gXHQudG8oe2hlaWdodDogdGhpcy5jb2xvcnNDbG91ZHMuaGVpZ2h0fSwgNDAwMClcclxuXHRcdC8vIFx0LnlveW8oKVxyXG5cdFx0Ly8gXHQubG9vcCgpXHJcblx0XHQvLyBcdC5zdGFydCgpO1xyXG5cdFx0Ly9cclxuXHRcdC8vIHRoaXMuZ3JheUNsb3VkcyA9IHRoaXMuYWRkLnNwcml0ZSgwLCB0aGlzLmdhbWUuaGVpZ2h0LCAnZ3JheS1jbG91ZHMnKTtcclxuXHRcdC8vIHRoaXMuZ3JheUNsb3Vkcy5hbmNob3Iuc2V0KDAsIDEpO1xyXG5cdFx0Ly8gdGhpcy5hZGQudHdlZW4odGhpcy5ncmF5Q2xvdWRzKVxyXG5cdFx0Ly8gXHQudG8oe2hlaWdodDogdGhpcy5ncmF5Q2xvdWRzLmhlaWdodCsxMDB9LCAzMDAwKVxyXG5cdFx0Ly8gXHQudG8oe2hlaWdodDogdGhpcy5ncmF5Q2xvdWRzLmhlaWdodH0sIDMwMDApXHJcblx0XHQvLyBcdC55b3lvKClcclxuXHRcdC8vIFx0Lmxvb3AoKVxyXG5cdFx0Ly8gXHQuc3RhcnQoKTtcclxuXHRcdC8vXHJcblx0XHQvL1xyXG5cdFx0Ly8gdGhpcy5wYXJ0R3JheUNsb3VkID0gdGhpcy5hZGQuc3ByaXRlKDAsIDQyNSwgJ3BhcnQtZ3JheS1jbG91ZCcpO1xyXG5cdFx0Ly8gdGhpcy5hZGQudHdlZW4odGhpcy5wYXJ0R3JheUNsb3VkKVxyXG5cdFx0Ly8gXHQudG8oe3k6IHRoaXMucGFydEdyYXlDbG91ZC55KzYwfSwgNTAwMClcclxuXHRcdC8vIFx0LnRvKHt5OiB0aGlzLnBhcnRHcmF5Q2xvdWQueX0sIDUwMDApXHJcblx0XHQvLyBcdC55b3lvKClcclxuXHRcdC8vIFx0Lmxvb3AoKVxyXG5cdFx0Ly8gXHQuc3RhcnQoKTtcclxuXHRcdC8vXHJcblx0XHQvLyB0aGlzLnBhcnRDb2xvcnNDbG91ZDEgPSB0aGlzLmFkZC5zcHJpdGUoNjIsIDc2MCwgJ3BhcnQtY29sb3JzLWNsb3VkJyk7XHJcblx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLnBhcnRDb2xvcnNDbG91ZDEpXHJcblx0XHQvLyBcdC50byh7eTogdGhpcy5wYXJ0Q29sb3JzQ2xvdWQxLnkrODB9LCA0MDAwKVxyXG5cdFx0Ly8gXHQudG8oe3k6IHRoaXMucGFydENvbG9yc0Nsb3VkMS55fSwgNDAwMClcclxuXHRcdC8vIFx0LnlveW8oKVxyXG5cdFx0Ly8gXHQubG9vcCgpXHJcblx0XHQvLyBcdC5zdGFydCgpO1xyXG5cdFx0Ly9cclxuXHRcdC8vIHRoaXMucGFydENvbG9yc0Nsb3VkMiA9IHRoaXMuYWRkLnNwcml0ZSg0NzAsIDY4MCwgJ3BhcnQtY29sb3JzLWNsb3VkJyk7XHJcblx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLnBhcnRDb2xvcnNDbG91ZDIpXHJcblx0XHQvLyBcdC50byh7eTogdGhpcy5wYXJ0Q29sb3JzQ2xvdWQyLnkrNzB9LCAzMDAwKVxyXG5cdFx0Ly8gXHQudG8oe3k6IHRoaXMucGFydENvbG9yc0Nsb3VkMi55fSwgMzAwMClcclxuXHRcdC8vIFx0LnlveW8oKVxyXG5cdFx0Ly8gXHQubG9vcCgpXHJcblx0XHQvLyBcdC5zdGFydCgpO1xyXG5cclxuXHRcdHRoaXMucGxheSA9IHRoaXMuYWRkLnNwcml0ZSh0aGlzLmdhbWUud2lkdGgvMiwgNTUwLCAncGxheScpO1xyXG5cdFx0dGhpcy5wbGF5LmFuY2hvci5zZXQoLjUpO1xyXG5cdFx0dGhpcy5wbGF5LmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblx0XHR0aGlzLnBsYXkuZXZlbnRzLm9uSW5wdXRVcC5hZGRPbmNlKCgpID0+IHtcclxuXHRcdFx0Ly8gdGhpcy5hZGQudHdlZW4odGhpcy5ncmF5Q2xvdWRzKVxyXG5cdFx0XHQvLyBcdC50byh7eTogdGhpcy5nYW1lLmhlaWdodCsxNTAwfSwgNTAwKVxyXG5cdFx0XHQvLyBcdC5zdGFydCgpO1xyXG5cdFx0XHQvL1xyXG5cdFx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLnBhcnRDb2xvcnNDbG91ZDEpXHJcblx0XHRcdC8vIFx0LnRvKHt5OiB0aGlzLmdhbWUuaGVpZ2h0KzEwMDB9LCAxMDAwKVxyXG5cdFx0XHQvLyBcdC5zdGFydCgpO1xyXG5cdFx0XHQvL1xyXG5cdFx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLnBhcnRDb2xvcnNDbG91ZDIpXHJcblx0XHRcdC8vIFx0LnRvKHt5OiB0aGlzLmdhbWUuaGVpZ2h0KzEwMDB9LCAxMDAwKVxyXG5cdFx0XHQvLyBcdC5zdGFydCgpO1xyXG5cdFx0XHQvL1xyXG5cdFx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLnBhcnRHcmF5Q2xvdWQpXHJcblx0XHRcdC8vIFx0LnRvKHt5OiAtMTAwMH0sIDEwMDApXHJcblx0XHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHRcdC8vXHJcblx0XHRcdGxldCB0d2VlbiA9IHRoaXMuYWRkLnR3ZWVuKHRoaXMucGxheSlcclxuXHRcdFx0XHQudG8oe3JvdGF0aW9uOiBNYXRoLlBJLzJ9LCAxMDApXHJcblx0XHRcdFx0LnRvKHt3aWR0aDogdGhpcy5wbGF5LndpZHRoKzIwLCBoZWlnaHQ6IHRoaXMucGxheS5oZWlnaHQrMjB9LCAxMDApXHJcblx0XHRcdFx0LnN0YXJ0KCk7XHJcblxyXG5cdFx0XHR0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcblx0XHRcdFx0dWkuZ29Ubyh0aGlzLCAnUGxheWdyb3VuZCcpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYWRkLnNwcml0ZSh0aGlzLmdhbWUud2lkdGgvMiwgNzcwLCAnc3RhcicpLmFuY2hvci5zZXQoLjUpO1xyXG5cdFx0dGhpcy5zZXR0aW5ncyA9IHRoaXMuYWRkLnNwcml0ZSh0aGlzLmdhbWUud2lkdGgvMiwgMTAwMCwgJ3NldHRpbmdzJyk7XHJcblx0XHR0aGlzLnNldHRpbmdzLmFuY2hvci5zZXQoLjUpO1xyXG5cdFx0dGhpcy5zZXR0aW5ncy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5zZXR0aW5ncy5ldmVudHMub25JbnB1dFVwLmFkZE9uY2UoKCkgPT4ge1xyXG5cdFx0XHRsZXQgdHdlZW4gPSB0aGlzLmFkZC50d2Vlbih0aGlzLnNldHRpbmdzKVxyXG5cdFx0XHRcdC50byh7cm90YXRpb246IE1hdGguUEkvMn0sIDEwMClcclxuXHRcdFx0XHQudG8oe3dpZHRoOiB0aGlzLnNldHRpbmdzLndpZHRoKzIwLCBoZWlnaHQ6IHRoaXMuc2V0dGluZ3MuaGVpZ2h0KzIwfSwgMTAwKVxyXG5cdFx0XHRcdC5zdGFydCgpO1xyXG5cclxuXHRcdFx0dHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xyXG5cdFx0XHRcdHVpLmdvVG8odGhpcywgJ1NldHRpbmdzJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG4gICAgdGhpcy5sYWJlbCA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoLzIsIDE0MCwgXCJNb3R0aW9uXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDEwMCxcclxuICAgICAgZm9udFdlaWdodDogMTAwLFxyXG5cdFx0XHRmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMubGFiZWwuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuICAgIHRoaXMudGV4dCA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoLzIsIDIzMCwgXCJTZW5zIGluIHRoZSB3YXlcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogNjAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy50ZXh0LmFuY2hvci5zZXQoMC41KTtcclxuXHRcdC8vXHJcblx0XHR0aGlzLnNjb3JlcyA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoLzIsIDM1MCwgc2NvcmUgKyAnIHwgJyArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzY29yZScpLCB7XHJcbiAgICAgIGZvbnQ6ICdSb2JvdG8nLFxyXG4gICAgICBmb250U2l6ZTogNjIsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDgwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zY29yZXMuYW5jaG9yLnNldCgwLjUpO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblx0XHQvLyB0aGlzLmJ0bi5yb3RhdGlvbiArPSAuMDI7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7XHJcbiIsImNvbnN0IENlbGxzTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL0NlbGxzTWFuYWdlcicpO1xyXG5jb25zdCBDbG91ZHNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvQ2xvdWRzTWFuYWdlcicpO1xyXG5jb25zdCBJc2xhbmRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvSXNsYW5kTWFuYWdlcicpO1xyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvV2luZG93TWFuYWdlcicpO1xyXG5jb25zdCBVSU1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9VSU1hbmFnZXInKTtcclxuXHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4uL29iamVjdHMvUGxheWVyJyk7XHJcblxyXG5jbGFzcyBQbGF5Z3JvdW5kIHtcclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLndvcmxkLnNldEJvdW5kcygwLCAtdGhpcy5nYW1lLmhlaWdodCoxMDAwLCB0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQqMjAwMCk7XHJcblx0XHR0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQXJjYWRlKTtcclxuXHJcblxyXG5cdFx0dGhpcy5iZyA9IHRoaXMuYWRkLnNwcml0ZSgwLCAwLCAnYmcnKTtcclxuXHRcdHRoaXMuYmcud2lkdGggPSB0aGlzLmdhbWUud2lkdGg7XHJcblx0XHR0aGlzLmJnLmhlaWdodCA9IHRoaXMuZ2FtZS5oZWlnaHQ7XHJcblx0XHR0aGlzLmJnLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuY2VsbHNNYW5hZ2VyID0gbmV3IENlbGxzTWFuYWdlcih0aGlzLCA1KTtcclxuXHRcdHRoaXMuaXNsYW5kTWFuYWdlciA9IG5ldyBJc2xhbmRNYW5hZ2VyKHRoaXMpO1xyXG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMpO1xyXG5cdFx0dGhpcy5jbG91ZHNNYW5hZ2VyID0gbmV3IENsb3Vkc01hbmFnZXIodGhpcyk7XHJcblxyXG5cdFx0dGhpcy5VSU1hbmFnZXIgPSBuZXcgVUlNYW5hZ2VyKHRoaXMpO1xyXG5cclxuXHRcdHRoaXMud2luZG93TWFuYWdlciA9IG5ldyBXaW5kb3dNYW5hZ2VyKHRoaXMpO1xyXG5cdFx0dGhpcy53aW5kb3dNYW5hZ2VyLmFkZFdpbmRvdygnTW90dGlvbicsICdTZW5zIGluIHRoZSB3YXkuLi4gTG9yZW0gaXBzdW0gYmxhYmxhbGFsbGFsYmxibCcpO1xyXG5cclxuXHR9XHJcblx0dXBkYXRlKCkge1xyXG5cdFx0dGhpcy5jbG91ZHNNYW5hZ2VyLnVwZGF0ZSgpO1xyXG4gICAgdGhpcy5jZWxsc01hbmFnZXIudXBkYXRlKCk7XHJcblx0XHR0aGlzLmlzbGFuZE1hbmFnZXIudXBkYXRlKCk7XHJcblx0XHR0aGlzLnBsYXllci51cGRhdGUoKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWdyb3VuZDtcclxuIiwiY2xhc3MgUHJlbG9hZCB7XHJcblx0aW5pdCgpIHtcclxuXHR9XHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnYmcnLCAnYXNzZXRzL2JnLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwbGF5ZXInLCAnYXNzZXRzL3BsYXllci5wbmcnKTtcclxuXHJcblx0XHQvLyBjZWxsc1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsMScsICdhc3NldHMvY2VsbHMvY2VsbDEucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwyJywgJ2Fzc2V0cy9jZWxscy9jZWxsMi5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbDMnLCAnYXNzZXRzL2NlbGxzL2NlbGwzLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsNCcsICdhc3NldHMvY2VsbHMvY2VsbDQucG5nJyk7XHJcblxyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsMS1maWxsJywgJ2Fzc2V0cy9jZWxscy9jZWxsMS1maWxsLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsNC1maWxsJywgJ2Fzc2V0cy9jZWxscy9jZWxsNC1maWxsLnBuZycpO1xyXG5cclxuXHRcdC8vIGlzbGFuZFxyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdpc2xhbmQnLCAnYXNzZXRzL2lzbGFuZC9pc2xhbmQucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2ZsYWcnLCAnYXNzZXRzL2lzbGFuZC9mbGFnLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjbG91ZCcsICdhc3NldHMvaXNsYW5kL2Nsb3VkLnBuZycpO1xyXG5cclxuXHRcdC8vIHVpXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3BsYXknLCAnYXNzZXRzL3VpL3BsYXkucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3NldHRpbmdzJywgJ2Fzc2V0cy91aS9zZXR0aW5ncy5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnc3RhcicsICdhc3NldHMvdWkvc3Rhci5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgndGltZScsICdhc3NldHMvdWkvdGltZS5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGxhbmUnLCAnYXNzZXRzL3VpL3BsYW5lLnBuZycpO1xyXG5cclxuXHRcdC8vIG1lbnVcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnZ3JheS1jbG91ZHMnLCAnYXNzZXRzL21lbnUvZ3JheWNsb3Vkcy5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY29sb3JzLWNsb3VkcycsICdhc3NldHMvbWVudS9jb2xvcnNjbG91ZHMucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3BhcnQtZ3JheS1jbG91ZCcsICdhc3NldHMvbWVudS9wYXJ0Z3JheWNsb3VkLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwYXJ0LWNvbG9ycy1jbG91ZCcsICdhc3NldHMvbWVudS9wYXJ0Y29sb3JzY2xvdWQucG5nJyk7XHJcblx0fVxyXG5cclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLnN0YXRlLnN0YXJ0KCdNZW51Jyk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWQ7XHJcbiIsImNvbnN0IHVpID0gcmVxdWlyZSgnLi4vbWl4aW5zL3VpJyk7XHJcblxyXG5jbGFzcyBTZXR0aW5ncyB7XHJcblx0aW5pdCgpIHtcclxuXHRcdHRoaXMuYmcgPSB1aS5jcmVhdGVCZyh0aGlzLCB0aGlzLmdhbWUud2lkdGgvNSwgNSwgMTApO1xyXG5cclxuICAgIHRoaXMubGFiZWwgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAxNDAsIFwiU2V0dGluZ3NcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogMTAwLFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcblx0XHRcdGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG5cclxuICAgIHRoaXMuc291bmRzID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgNTUwLCBcIlNvdW5kcyB8IE9OXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDYwLFxyXG4gICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc291bmRzLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICB0aGlzLm11c2ljID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgNjUwLCBcIk11c2ljIHwgT0ZGXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDYwLFxyXG4gICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMubXVzaWMuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuICAgIHRoaXMuYmFjayA9IHRoaXMuYWRkLnRleHQoMTUwLCB0aGlzLmdhbWUuaGVpZ2h0LTgwLCBcIkJhY2tcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogODAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5iYWNrLmFuY2hvci5zZXQoMC41KTtcclxuICAgIHRoaXMuYmFjay5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5iYWNrLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgIHVpLmdvVG8odGhpcywgJ01lbnUnKTtcclxuICAgIH0pO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcclxuIl19
