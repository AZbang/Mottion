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
    
    this.size = this.state.cellsManager.sizeCell*this.state.cellsManager.amtX;
    this.island.width = this.size;
    this.island.height = this.size;
    // this.island.tint = 0xff4444; 0x00d461

    this.create(42-20, 650, 'flag');
    this.create(120-20, 840, 'flag');
    this.create(75-20, 1060, 'flag');
    this.create(265-20, 980, 'flag');
    this.create(440+100, 1110, 'flag').scale.x *= -1;
    this.create(570+100, 1015, 'flag').scale.x *= -1;
    this.create(620+100, 780, 'flag').scale.x *= -1;
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

    this.scoreText = this.state.make.text(50, 25, "0ways.", {
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
    this.scoreText.text = this.score + 'ways.';
  }
  setScore(v) {
    this.score = v;
    this.scoreText.text = this.score + 'ways.';
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
    this.clickCount = type.clickCount;

    this.x = x*this.size+this.padding/2+this.width/2;
    this.y = 80*this.manager.amtX-y*this.size+this.height/2;
    this.isOpen = type.isOpen;
    this.isGood = type.isGood;
    this.score = type.score;
    this.inputEnabled = false;


    if(type.isClick) {
      this.inputEnabled = true;
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

    this.speed = 100;
    this.currentTime = 0;
    this.lastMove;

    this.state.input.onDown.addOnce(() => {
      let tween = this.state.add.tween(this)
        .to({y: this.state.game.height-(this.state.cellsManager.sizeCell*this.state.cellsManager.amtX+this.state.cellsManager.sizeCell/2)}, this.speed*10)
        .start();
    }, this);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.state.cellsManager, (pl, cell) => {
      if(!cell.topPanel) return;

      if(cell.isOpen) this.state.UIManager.addScore(cell.score);

      if(cell.topPanel && cell.topPanel.isOpen && cell.topPanel.isGood) {
        this.state.add.tween(this)
          .to({y: cell.topPanel.y}, Math.floor(this.speed)*2)
          .start();
        this.lastMove = 'top';
      }
      else if(this.lastMove !== 'left' && cell.rightPanel && cell.rightPanel.isOpen && cell.rightPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.rightPanel.x}, Math.floor(this.speed)*2)
          .start();
        this.lastMove = 'right';
      }
      else if(this.lastMove !== 'right' && cell.leftPanel && cell.leftPanel.isOpen && cell.leftPanel.isGood) {
        this.state.add.tween(this)
          .to({x: cell.leftPanel.x}, Math.floor(this.speed)*2)
          .start();
        this.lastMove = 'left';
      }
      else {
        let tween = this.state.add.tween(this)
          .to({y: cell.topPanel.y, alpha: 0, width: 0, height: 0}, Math.floor(this.speed)*2)
          .start();
        tween.onComplete.add(() => {
          ui.goTo(this.state, 'Menu',  this.state.UIManager.score);
        });
      }
    });
  }
  update() {
    this.rotation += .01;
    this.currentTime++;

    if(this.currentTime > this.speed) {
      this.move();
      this.currentTime = 0;
      if(this.speed > 200) this.speed -= .1;
    }
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

		// music
		this.load.audio('music', 'assets/music/bensound-anewbeginning.mp3');
	}

	create() {
		let music = this.add.audio('music');
		music.loopFull(0.6);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0NlbGxzTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0Nsb3Vkc01hbmFnZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9tYW5hZ2Vycy9Jc2xhbmRNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvVUlNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvV2luZG93TWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21peGlucy91aS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvQ2VsbC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvRW50aXR5LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvb2JqZWN0cy9QbGF5ZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9vYmplY3RzL3R5cGVzLmpzb24iLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvQm9vdC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9NZW51LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc3RhdGVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvUHJlbG9hZC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9TZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgQm9vdCA9IHJlcXVpcmUoJy4vc3RhdGVzL0Jvb3QuanMnKTtcclxuY29uc3QgUHJlbG9hZCA9IHJlcXVpcmUoJy4vc3RhdGVzL1ByZWxvYWQuanMnKTtcclxuY29uc3QgTWVudSA9IHJlcXVpcmUoJy4vc3RhdGVzL01lbnUuanMnKTtcclxuY29uc3QgUGxheWdyb3VuZCA9IHJlcXVpcmUoJy4vc3RhdGVzL1BsYXlncm91bmQuanMnKTtcclxuY29uc3QgU2V0dGluZ3MgPSByZXF1aXJlKCcuL3N0YXRlcy9TZXR0aW5ncy5qcycpO1xyXG5cclxudmFyIHJlYWR5ID0gKCkgPT4ge1xyXG5cdHZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDcyMCwgMTI4MCwgUGhhc2VyLkFVVE8sICdNb3R0aW9uJyk7XHJcblxyXG5cdGdhbWUuc3RhdGUuYWRkKCdCb290JywgQm9vdCwgdHJ1ZSk7XHJcbiAgZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCBQcmVsb2FkKTtcclxuICBnYW1lLnN0YXRlLmFkZCgnTWVudScsIE1lbnUpO1xyXG5cdGdhbWUuc3RhdGUuYWRkKCdTZXR0aW5ncycsIFNldHRpbmdzKTtcclxuXHRnYW1lLnN0YXRlLmFkZCgnUGxheWdyb3VuZCcsIFBsYXlncm91bmQpO1xyXG59XHJcblxyXG5yZWFkeSgpO1xyXG4iLCJjb25zdCBDZWxsID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9DZWxsJyk7XHJcbmNvbnN0IHR5cGVzID0gcmVxdWlyZSgnLi4vb2JqZWN0cy90eXBlcycpO1xudHlwZXMuc29ydCgoYSwgYikgPT4gYS5jaGFuY2UgLSBiLmNoYW5jZSk7XHJcblxyXG5cclxuY2xhc3MgQ2VsbHNNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSwgYW10WCwgYW10WSkge1xyXG4gICAgc3VwZXIoc3RhdGUuZ2FtZSk7XHJcblxyXG4gICAgdGhpcy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmFtdFggPSBhbXRYIHx8IDU7XHJcblxyXG4gICAgdGhpcy5zaXplQ2VsbCA9IHN0YXRlLmdhbWUud2lkdGgvdGhpcy5hbXRYO1xyXG4gICAgdGhpcy5sYXN0WSA9IDA7XG4gICAgdGhpcy5sYXN0ID0gW107XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG4gICAgdGhpcy5jcmVhdGVDZWxscyhhbXRZIHx8IDE1KTtcbiAgfVxyXG4gIGNyZWF0ZUNlbGxzKGFtdEdlblkpIHtcclxuICAgIGxldCBhcnIgPSBbXTtcclxuXHJcbiAgICBmb3IobGV0IHkgPSB0aGlzLmxhc3RZOyB5IDwgdGhpcy5sYXN0WSthbXRHZW5ZOyB5KyspIHtcclxuICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IHRoaXMuYW10WDsgeCsrKSB7XHJcbiAgICAgICAgbGV0IHJhbmQgPSBNYXRoLnJhbmRvbSgpKjEwMDtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICBpZihyYW5kIDwgdHlwZXNbaV0uY2hhbmNlKSB7XHJcbiAgICAgICAgICAgICBsZXQgY2VsbCA9IHRoaXMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICAgICAgICAgICBpZighY2VsbCkge1xyXG4gICAgICAgICAgICAgICAgY2VsbCA9IG5ldyBDZWxsKHRoaXMsIHR5cGVzW2ldLCB4LCB5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkKGNlbGwpO1xyXG4gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgY2VsbC5yZVVzZUNlbGwoeCwgeSwgdHlwZXNbaV0pO1xyXG4gICAgICAgICAgICAgICBjZWxsLnJldml2ZSgpO1xyXG4gICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgIGFyci5wdXNoKGNlbGwpO1xyXG4gICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IGFtdEdlblk7IHkrKykge1xyXG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgdGhpcy5hbXRYOyB4KyspIHtcclxuICAgICAgICBpZih5KzEgPCBhbXRHZW5ZKSBhcnJbeSp0aGlzLmFtdFgreF0udG9wUGFuZWwgPSBhcnJbKHkrMSkqdGhpcy5hbXRYK3hdO1xyXG4gICAgICAgIGlmKHgtMSA+PSAwKSBhcnJbeSp0aGlzLmFtdFgreF0ubGVmdFBhbmVsID0gYXJyW3kqdGhpcy5hbXRYK3gtMV07XHJcbiAgICAgICAgaWYoeCsxIDwgdGhpcy5hbXRYKSAgYXJyW3kqdGhpcy5hbXRYK3hdLnJpZ2h0UGFuZWwgPSBhcnJbeSp0aGlzLmFtdFgreCsxXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5sYXN0Lmxlbmd0aCkge1xyXG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgdGhpcy5hbXRYOyB4KyspIHtcclxuICAgICAgICB0aGlzLmxhc3RbeF0udG9wUGFuZWwgPSBhcnJbeF07XHJcbiAgICAgIH1cclxuICAgIH1cblxuICAgIHRoaXMubGFzdCA9IFtdO1xuICAgIGZvcihsZXQgaSA9IGFyci5sZW5ndGgtdGhpcy5hbXRYOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmxhc3QucHVzaChhcnJbaV0pO1xuICAgIH1cclxuICAgIHRoaXMubGFzdFkgKz0gYW10R2VuWTtcclxuICB9XHJcbiAgdXBkYXRlKGR0KSB7XHJcbiAgICBsZXQgaXNIaWRlID0gZmFsc2U7XHJcbiAgICB0aGlzLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgaWYoY2VsbC55ID4gdGhpcy5zdGF0ZS5wbGF5ZXIueSt0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LTQwMCkge1xyXG4gICAgICAgIGNlbGwubGVmdFBhbmVsID0gbnVsbDtcclxuICAgICAgICBjZWxsLnJpZ2h0UGFuZWwgPSBudWxsO1xyXG4gICAgICAgIGNlbGwudG9wUGFuZWwgPSBudWxsO1xyXG4gICAgICAgIGNlbGwua2lsbCgpO1xyXG4gICAgICAgICFpc0hpZGUgJiYgdGhpcy5jcmVhdGVDZWxscygxKTtcclxuICAgICAgICBpc0hpZGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsbHNNYW5hZ2VyO1xyXG4iLCJjbGFzcyBDbG91ZHNNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgc3VwZXIoc3RhdGUuZ2FtZSk7XHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgdGhpcy5sYXN0WSA9IDA7XHJcblxyXG4gICAgdGhpcy50aW1lciA9IHRoaXMuc3RhdGUudGltZS5jcmVhdGUoZmFsc2UpO1xyXG4gICAgdGhpcy50aW1lci5sb29wKDEwMDAsIHRoaXMuY3JlYXRlQ2xvdWQsIHRoaXMpO1xyXG4gICAgdGhpcy50aW1lci5zdGFydCgpO1xyXG4gIH1cclxuICBjcmVhdGVDbG91ZCgpIHtcclxuICAgIHRoaXMubGFzdFkgLT0gdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbih0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LCB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0KjIpO1xyXG5cclxuICAgIGxldCBjbG91ZCA9IHRoaXMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICBpZighY2xvdWQpIHtcclxuICAgICAgIGNsb3VkID0gdGhpcy5hZGQodGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSgwLCB0aGlzLmxhc3RZLCAnY2xvdWQnKSk7XHJcbiAgICAgICB0aGlzLnJhbmRvbWl6ZUNsb3VkKGNsb3VkKTtcclxuICAgICAgIHRoaXMuYWRkKGNsb3VkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucmFuZG9taXplQ2xvdWQoY2xvdWQpO1xyXG4gICAgICBjbG91ZC5yZXZpdmUoKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmFuZG9taXplQ2xvdWQoY2xvdWQpIHtcclxuICAgIGlmKE1hdGgucmFuZG9tKCkgPCAuNSkge1xyXG4gICAgICBjbG91ZC5wb3NpdGlvbi5zZXQoMCwgdGhpcy5sYXN0WSk7XHJcbiAgICAgIGNsb3VkLndpZHRoID0gdGhpcy5zdGF0ZS5nYW1lLndpZHRoLTEwMDtcclxuICAgICAgY2xvdWQuaGVpZ2h0ID0gNDAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2xvdWQucG9zaXRpb24uc2V0KDEwMCwgdGhpcy5sYXN0WSk7XHJcbiAgICAgIGNsb3VkLndpZHRoID0gdGhpcy5zdGF0ZS5nYW1lLndpZHRoLTEwMDtcclxuICAgICAgY2xvdWQuaGVpZ2h0ID0gNDAwO1xyXG4gICAgICBjbG91ZC5hbmNob3Iuc2V0KDEpO1xyXG4gICAgICBjbG91ZC5zY2FsZS54ICo9IC0xO1xyXG4gICAgfVxyXG4gICAgY2xvdWQuZHVyYXRpb24gPSBNYXRoLnJhbmRvbSgpKjI7XHJcbiAgICBjbG91ZC5hbHBoYSA9IC45O1xyXG4gIH1cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIHRoaXMuZm9yRWFjaCgoY2xvdWQpID0+IHtcclxuICAgICAgY2xvdWQueSArPSBjbG91ZC5kdXJhdGlvbjtcclxuICAgICAgaWYoY2xvdWQueSA+IHRoaXMuc3RhdGUucGxheWVyLnkrdGhpcy5zdGF0ZS5nYW1lLmhlaWdodC00MDApXHJcbiAgICAgICAgY2xvdWQua2lsbCgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENsb3Vkc01hbmFnZXI7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4uL29iamVjdHMvRW50aXR5Jyk7XHJcblxuY2xhc3MgSXNsYW5kTWFuYWdlciBleHRlbmRzIFBoYXNlci5Hcm91cCB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIHN1cGVyKHN0YXRlLmdhbWUpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG5cclxuICAgIHRoaXMuYXV0b0N1bGwgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuaXNsYW5kID0gdGhpcy5jcmVhdGUoMCwgdGhpcy5zdGF0ZS5nYW1lLmhlaWdodCsxMCwgJ2lzbGFuZCcpO1xyXG4gICAgdGhpcy5pc2xhbmQuYW5jaG9yLnNldCgwLCAxKTtcclxuICAgIFxyXG4gICAgdGhpcy5zaXplID0gdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuc2l6ZUNlbGwqdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuYW10WDtcclxuICAgIHRoaXMuaXNsYW5kLndpZHRoID0gdGhpcy5zaXplO1xyXG4gICAgdGhpcy5pc2xhbmQuaGVpZ2h0ID0gdGhpcy5zaXplO1xyXG4gICAgLy8gdGhpcy5pc2xhbmQudGludCA9IDB4ZmY0NDQ0OyAweDAwZDQ2MVxyXG5cclxuICAgIHRoaXMuY3JlYXRlKDQyLTIwLCA2NTAsICdmbGFnJyk7XHJcbiAgICB0aGlzLmNyZWF0ZSgxMjAtMjAsIDg0MCwgJ2ZsYWcnKTtcclxuICAgIHRoaXMuY3JlYXRlKDc1LTIwLCAxMDYwLCAnZmxhZycpO1xyXG4gICAgdGhpcy5jcmVhdGUoMjY1LTIwLCA5ODAsICdmbGFnJyk7XHJcbiAgICB0aGlzLmNyZWF0ZSg0NDArMTAwLCAxMTEwLCAnZmxhZycpLnNjYWxlLnggKj0gLTE7XHJcbiAgICB0aGlzLmNyZWF0ZSg1NzArMTAwLCAxMDE1LCAnZmxhZycpLnNjYWxlLnggKj0gLTE7XHJcbiAgICB0aGlzLmNyZWF0ZSg2MjArMTAwLCA3ODAsICdmbGFnJykuc2NhbGUueCAqPSAtMTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSXNsYW5kTWFuYWdlcjtcclxuIiwiY2xhc3MgVUlNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgc3VwZXIoc3RhdGUpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgIHRoaXMuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5wbGFuZSA9IHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoMCwgMCwgJ3BsYW5lJyk7XHJcbiAgICB0aGlzLmFkZCh0aGlzLnBsYW5lKTtcclxuXHJcbiAgICB0aGlzLnNjb3JlVGV4dCA9IHRoaXMuc3RhdGUubWFrZS50ZXh0KDUwLCAyNSwgXCIwd2F5cy5cIiwge1xyXG4gICAgICBmb250OiAnUm9ib3RvJyxcclxuICAgICAgZm9udFNpemU6IDYwLFxyXG4gICAgICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMuYWRkKHRoaXMuc2NvcmVUZXh0KTtcclxuICAgIHRoaXMuc2NvcmUgPSAwO1xyXG5cclxuXHJcbiAgICB0aGlzLnBhdXNlID0gdGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSh0aGlzLnN0YXRlLmdhbWUud2lkdGgtODAsIDcwLCAndGltZScpO1xyXG4gICAgdGhpcy5wYXVzZS5hbmNob3Iuc2V0KC41KTtcclxuICAgIHRoaXMucGF1c2UuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuICAgIHRoaXMucGF1c2UuZXZlbnRzLm9uSW5wdXRVcC5hZGQoKCkgPT4ge1xyXG4gICAgICB0aGlzLnBhdXNlLnJvdGF0aW9uID0gMDtcclxuICAgICAgbGV0IHR3ZWVuID0gdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcy5wYXVzZSlcclxuICAgICAgICAudG8oe3JvdGF0aW9uOiBNYXRoLlBJKjJ9LCA1MDApXHJcbiAgICAgICAgLnN0YXJ0KCk7XHJcblxyXG4gICAgICBpZighdGhpcy5zdGF0ZS5nYW1lLnBhdXNlZCkge1xyXG4gICAgICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuc3RhdGUuZ2FtZS5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgdGhpcy5zdGF0ZS5nYW1lLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmFkZCh0aGlzLnBhdXNlKTtcclxuICB9XHJcbiAgYWRkU2NvcmUodikge1xyXG4gICAgdGhpcy5zY29yZSArPSB2O1xyXG4gICAgdGhpcy5zY29yZVRleHQudGV4dCA9IHRoaXMuc2NvcmUgKyAnd2F5cy4nO1xyXG4gIH1cclxuICBzZXRTY29yZSh2KSB7XHJcbiAgICB0aGlzLnNjb3JlID0gdjtcclxuICAgIHRoaXMuc2NvcmVUZXh0LnRleHQgPSB0aGlzLnNjb3JlICsgJ3dheXMuJztcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVUlNYW5hZ2VyO1xyXG4iLCJjbGFzcyBXaW5kb3dNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgc3VwZXIoc3RhdGUpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuXHJcbiAgICB0aGlzLmFscGhhID0gMDtcclxuICAgIHRoaXMuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5iZyA9IHRoaXMuc3RhdGUubWFrZS5ncmFwaGljcygwLCAwKTtcclxuICAgIHRoaXMuYmcuYmVnaW5GaWxsKDB4RkZGRkZGKTtcclxuICAgIHRoaXMuYmcuZHJhd1JlY3QoMCwgMCwgdGhpcy5zdGF0ZS5nYW1lLndpZHRoLCB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0KTtcclxuICAgIHRoaXMuYmcuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuYWRkKHRoaXMuYmcpO1xyXG5cclxuICAgIHRoaXMubGFiZWwgPSB0aGlzLnN0YXRlLm1ha2UudGV4dCh0aGlzLnN0YXRlLmdhbWUud2lkdGgvMiwgNDQwLCBcIlwiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiAxMDAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDEwMCxcclxuICAgICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgICBmaWxsOiBcIiM1NTVkZmZcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmxhYmVsLmFuY2hvci5zZXQoMC41KTtcclxuICAgIHRoaXMuYWRkKHRoaXMubGFiZWwpO1xyXG5cclxuXHJcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnN0YXRlLm1ha2UudGV4dCh0aGlzLnN0YXRlLmdhbWUud2lkdGgvMiwgNTQwLCBcIlwiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA1MCxcclxuICAgICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgICBmaWxsOiBcIiM1NTVkZmZcIixcclxuICAgICAgYWxpZ246ICdjZW50ZXInLFxyXG4gICAgICB3b3JkV3JhcDogdHJ1ZSxcclxuICAgICAgd29yZFdyYXBXaWR0aDogdGhpcy5zdGF0ZS5nYW1lLndpZHRoLTEwMFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmNvbnRlbnQuYW5jaG9yLnNldCgwLjUsIDApO1xyXG4gICAgdGhpcy5hZGQodGhpcy5jb250ZW50KTtcclxuICB9XHJcbiAgYWRkV2luZG93KGxhYmVsLCB0ZXh0LCBjYikge1xyXG4gICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgLnRvKHthbHBoYTogMX0sIDUwMClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmJnLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5sYWJlbC50ZXh0ID0gbGFiZWw7XHJcbiAgICB0aGlzLmNvbnRlbnQudGV4dCA9IHRleHQ7XHJcblx0XHR0aGlzLmJnLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgLnRvKHthbHBoYTogMH0sIDUwMClcclxuICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgdGhpcy5iZy5pbnB1dEVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgY2IgJiYgY2IoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjcmVhdGVCZyhzdGF0ZSwgc2l6ZT0xMDAsIGF4PTIwLCBheT0yMCkge1xyXG4gICAgbGV0IGJnID0gc3RhdGUuYWRkLmdyYXBoaWNzKCk7XHJcbiAgICBiZy5iZWdpbkZpbGwoMHhGRkZGRkYsIDEpO1xyXG4gICAgYmcuZHJhd1JlY3QoMCwgMCwgc3RhdGUuZ2FtZS53aWR0aCwgc3RhdGUuZ2FtZS5oZWlnaHQpO1xyXG4gICAgYmcuZW5kRmlsbCgpO1xyXG5cclxuICAgIGJnLmxpbmVTdHlsZSg0LCAweDJlMmU0NCwgLjEpO1xyXG5cclxuICAgIGZvcihsZXQgeCA9IDA7IHggPCBheDsgeCsrKSB7XHJcbiAgICAgIGJnLm1vdmVUbyhzaXplKngsIDApO1xyXG4gICAgICBiZy5saW5lVG8oc2l6ZSp4LCBzdGF0ZS5nYW1lLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgYXk7IHkrKykge1xyXG4gICAgICBiZy5tb3ZlVG8oMCwgc2l6ZSp5KTtcclxuICAgICAgYmcubGluZVRvKHN0YXRlLmdhbWUud2lkdGgsIHNpemUqeSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmc7XHJcbiAgfSxcclxuICBnb1RvKHN0YXRlLCBuYW1lLCBhcmdzKSB7XHJcbiAgICBzdGF0ZS5jYW1lcmEuZmFkZSgweEZGRkZGRik7XHJcbiAgICBzdGF0ZS5jYW1lcmEub25GYWRlQ29tcGxldGUuYWRkKCgpID0+IHtcclxuICAgICAgc3RhdGUuc3RhdGUuc3RhcnQobmFtZSwgdHJ1ZSwgZmFsc2UsIGFyZ3MpO1xyXG4gICAgICBzdGF0ZS5zdGF0ZS5nZXRDdXJyZW50U3RhdGUoKS5jYW1lcmEuZmxhc2goMHhGRkZGRkYsIDEwMDApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImNvbnN0IHR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xyXG5cclxuY2xhc3MgQ2VsbCBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKG1hbmFnZXIsIHR5cGUsIHgsIHkpIHtcclxuICAgIHN1cGVyKG1hbmFnZXIuZ2FtZSwgMCwgMCwgdHlwZS5pbWcpO1xyXG5cclxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICB0aGlzLnN0YXRlID0gbWFuYWdlci5zdGF0ZTtcblxuICAgIHRoaXMucGFkZGluZyA9IDEwO1xuICAgIHRoaXMuc2l6ZSA9IHRoaXMubWFuYWdlci5zaXplQ2VsbDtcclxuICAgIHRoaXMud2lkdGggPSB0aGlzLnNpemUtdGhpcy5wYWRkaW5nO1xyXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLnNpemUtdGhpcy5wYWRkaW5nO1xyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuXG4gICAgdGhpcy5yZVVzZUNlbGwoeCwgeSwgdHlwZSk7XHJcbiAgfVxuICByZVVzZUNlbGwoeCwgeSwgdHlwZSkge1xyXG4gICAgdGhpcy5sb2FkVGV4dHVyZSh0eXBlLmltZywgMCk7XHJcbiAgICB0aGlzLmNsaWNrQ291bnQgPSB0eXBlLmNsaWNrQ291bnQ7XHJcblxyXG4gICAgdGhpcy54ID0geCp0aGlzLnNpemUrdGhpcy5wYWRkaW5nLzIrdGhpcy53aWR0aC8yO1xyXG4gICAgdGhpcy55ID0gODAqdGhpcy5tYW5hZ2VyLmFtdFgteSp0aGlzLnNpemUrdGhpcy5oZWlnaHQvMjtcclxuICAgIHRoaXMuaXNPcGVuID0gdHlwZS5pc09wZW47XHJcbiAgICB0aGlzLmlzR29vZCA9IHR5cGUuaXNHb29kO1xyXG4gICAgdGhpcy5zY29yZSA9IHR5cGUuc2NvcmU7XHJcbiAgICB0aGlzLmlucHV0RW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICBpZih0eXBlLmlzQ2xpY2spIHtcclxuICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmV2ZW50cy5vbklucHV0VXAuYWRkKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNsaWNrQ291bnQtLTtcclxuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5zaXplLXRoaXMucGFkZGluZztcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuc2l6ZS10aGlzLnBhZGRpbmc7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3dpZHRoOiB0aGlzLndpZHRoKzMwLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0KzMwfSwgMTAwKVxyXG4gICAgICAgICAgLnRvKHt3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodH0sIDEwMClcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNsaWNrQ291bnQgPT09IDApIHtcclxuICAgICAgICAgIHRoaXMubG9hZFRleHR1cmUodHlwZS5pbWdDbGljaywgMCk7XHJcbiAgICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENlbGw7XHJcbiIsImNsYXNzIEVudGl0eSBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlLCB4LCB5LCByLCBpc0FyY3MsIHNjYWxlPTEuNSkge1xyXG4gICAgc3VwZXIoc3RhdGUuZ2FtZSwgeCwgeSwgJ3BsYXllcicpO1xyXG4gICAgXHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLndpZHRoID0gcjtcclxuICAgIHRoaXMuaGVpZ2h0ID0gcjtcclxuICAgIHRoaXMuYW5jaG9yLnNldCguNSk7XHJcblxyXG4gICAgdGhpcy5hcmNTY2FsZSA9IHNjYWxlO1xyXG5cclxuICAgIGlmKGlzQXJjcykge1xyXG4gICAgICB0aGlzLmNyZWF0ZUFyYygtLjgsIC0xLCAuOSwgMSwgMHgzNzNmZmYpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUFyYyguOSwgLS44LCAtMSwgLjksIDB4ZmYzNzM3KTtcclxuICAgICAgdGhpcy5jcmVhdGVBcmMoLS44LCAuOSwgLjgsIC0xLCAweDQyODYzYyk7XHJcbiAgICAgIHRoaXMuY3JlYXRlQXJjKC44LCAuOSwgLS44LCAtLjgsIDB4ODI0MmFhKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmFuZCA9IHRoaXMuc3RhdGUucm5kLmJldHdlZW4oMzAwLCAxMDAwKTtcclxuICAgIGxldCBzYyA9IHRoaXMuc3RhdGUucm5kLmJldHdlZW4oNSwgNDApO1xyXG4gICAgdGhpcy50d2VlbkJyZWF0aGUgPSB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAudG8oe3dpZHRoOiByK3NjLCBoZWlnaHQ6IHIrc2N9LCByYW5kKVxyXG4gICAgICAudG8oe3dpZHRoOiByLCBoZWlnaHQ6IHJ9LCByYW5kKVxyXG4gICAgICAueW95bygpXHJcbiAgICAgIC5sb29wKClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIGNyZWF0ZUFyYyhzeCwgc3ksIGV4LCBleSwgdGludCkge1xyXG4gICAgbGV0IGFyYyA9IHRoaXMuc3RhdGUubWFrZS5zcHJpdGUodGhpcy53aWR0aCpzeC90aGlzLmFyY1NjYWxlLCB0aGlzLmhlaWdodCpzeS90aGlzLmFyY1NjYWxlLCAncGxheWVyJyk7XHJcblxyXG4gICAgYXJjLnRpbnQgPSB0aW50O1xyXG4gICAgYXJjLndpZHRoID0gMzA7XHJcbiAgICBhcmMuaGVpZ2h0ID0gMzA7XHJcbiAgICB0aGlzLnN0YXRlLmFkZC50d2VlbihhcmMpXHJcbiAgICAgIC50byh7eDogdGhpcy53aWR0aCpleC90aGlzLmFyY1NjYWxlLCB5OiB0aGlzLmhlaWdodCpleS90aGlzLmFyY1NjYWxlLCB3aWR0aDogMCwgaGVpZ2h0OiAwfSwgdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbig1MDAsIDEwMDApKVxyXG4gICAgICAudG8oe3g6IHRoaXMud2lkdGgqc3gvdGhpcy5hcmNTY2FsZSwgeTogdGhpcy5oZWlnaHQqc3kvdGhpcy5hcmNTY2FsZX0sIHRoaXMuc3RhdGUucm5kLmJldHdlZW4oMzAwLCA2MDApKVxyXG4gICAgICAudG8oe3dpZHRoOiAzMCwgaGVpZ2h0OiAzMH0sIHRoaXMuc3RhdGUucm5kLmJldHdlZW4oNTAwLCAxMDAwKSlcclxuICAgICAgLnlveW8oKVxyXG4gICAgICAubG9vcCgpXHJcbiAgICAgIC5zdGFydCgpO1xyXG4gICAgdGhpcy5hZGRDaGlsZChhcmMpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5Jyk7XHJcbmNvbnN0IHVpID0gcmVxdWlyZSgnLi4vbWl4aW5zL3VpJyk7XHJcblxyXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBFbnRpdHkge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBzdXBlcihzdGF0ZSwgc3RhdGUuZ2FtZS53aWR0aC8yLCBzdGF0ZS5nYW1lLmhlaWdodC00MDAsIDcwLCB0cnVlKTtcclxuICAgIHN0YXRlLmFkZC5leGlzdGluZyh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzKTtcclxuICAgIHRoaXMuYm9keS5zZXRTaXplKHRoaXMud2lkdGgvMi0xLCB0aGlzLmhlaWdodC8yLTEsIDEsIDEpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuY2FtZXJhLmZvbGxvdyh0aGlzKTtcclxuXHRcdHRoaXMuc3RhdGUuY2FtZXJhLmRlYWR6b25lID0gbmV3IFBoYXNlci5SZWN0YW5nbGUodGhpcy54LXRoaXMud2lkdGgvMiwgdGhpcy55LXRoaXMuaGVpZ2h0LzIsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICB0aGlzLnNwZWVkID0gMTAwO1xyXG4gICAgdGhpcy5jdXJyZW50VGltZSA9IDA7XHJcbiAgICB0aGlzLmxhc3RNb3ZlO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuaW5wdXQub25Eb3duLmFkZE9uY2UoKCkgPT4ge1xyXG4gICAgICBsZXQgdHdlZW4gPSB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgIC50byh7eTogdGhpcy5zdGF0ZS5nYW1lLmhlaWdodC0odGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuc2l6ZUNlbGwqdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIuYW10WCt0aGlzLnN0YXRlLmNlbGxzTWFuYWdlci5zaXplQ2VsbC8yKX0sIHRoaXMuc3BlZWQqMTApXHJcbiAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICB9LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIG1vdmUoKSB7XHJcbiAgICB0aGlzLnN0YXRlLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcywgdGhpcy5zdGF0ZS5jZWxsc01hbmFnZXIsIChwbCwgY2VsbCkgPT4ge1xyXG4gICAgICBpZighY2VsbC50b3BQYW5lbCkgcmV0dXJuO1xyXG5cclxuICAgICAgaWYoY2VsbC5pc09wZW4pIHRoaXMuc3RhdGUuVUlNYW5hZ2VyLmFkZFNjb3JlKGNlbGwuc2NvcmUpO1xyXG5cclxuICAgICAgaWYoY2VsbC50b3BQYW5lbCAmJiBjZWxsLnRvcFBhbmVsLmlzT3BlbiAmJiBjZWxsLnRvcFBhbmVsLmlzR29vZCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3k6IGNlbGwudG9wUGFuZWwueX0sIE1hdGguZmxvb3IodGhpcy5zcGVlZCkqMilcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSAndG9wJztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKHRoaXMubGFzdE1vdmUgIT09ICdsZWZ0JyAmJiBjZWxsLnJpZ2h0UGFuZWwgJiYgY2VsbC5yaWdodFBhbmVsLmlzT3BlbiAmJiBjZWxsLnJpZ2h0UGFuZWwuaXNHb29kKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eDogY2VsbC5yaWdodFBhbmVsLnh9LCBNYXRoLmZsb29yKHRoaXMuc3BlZWQpKjIpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLmxhc3RNb3ZlID0gJ3JpZ2h0JztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKHRoaXMubGFzdE1vdmUgIT09ICdyaWdodCcgJiYgY2VsbC5sZWZ0UGFuZWwgJiYgY2VsbC5sZWZ0UGFuZWwuaXNPcGVuICYmIGNlbGwubGVmdFBhbmVsLmlzR29vZCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3g6IGNlbGwubGVmdFBhbmVsLnh9LCBNYXRoLmZsb29yKHRoaXMuc3BlZWQpKjIpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLmxhc3RNb3ZlID0gJ2xlZnQnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCB0d2VlbiA9IHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgICAudG8oe3k6IGNlbGwudG9wUGFuZWwueSwgYWxwaGE6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDB9LCBNYXRoLmZsb29yKHRoaXMuc3BlZWQpKjIpXHJcbiAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgICB1aS5nb1RvKHRoaXMuc3RhdGUsICdNZW51JywgIHRoaXMuc3RhdGUuVUlNYW5hZ2VyLnNjb3JlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIHRoaXMucm90YXRpb24gKz0gLjAxO1xyXG4gICAgdGhpcy5jdXJyZW50VGltZSsrO1xyXG5cclxuICAgIGlmKHRoaXMuY3VycmVudFRpbWUgPiB0aGlzLnNwZWVkKSB7XHJcbiAgICAgIHRoaXMubW92ZSgpO1xyXG4gICAgICB0aGlzLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgaWYodGhpcy5zcGVlZCA+IDIwMCkgdGhpcy5zcGVlZCAtPSAuMTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cz1bXHJcbiAge1xyXG4gICAgXCJjaGFuY2VcIjogNSxcclxuICAgIFwiaW1nXCI6IFwiY2VsbDNcIixcclxuICAgIFwiaXNPcGVuXCI6IHRydWUsXHJcbiAgICBcImlzQ2xpY2tcIjogZmFsc2UsXHJcbiAgICBcInNjb3JlXCI6IDEwLFxyXG4gICAgXCJpc0dvb2RcIjogdHJ1ZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJjaGFuY2VcIjogMjAsXHJcbiAgICBcImltZ1wiOiBcImNlbGwyXCIsXHJcbiAgICBcImlzT3BlblwiOiBmYWxzZSxcclxuICAgIFwiaXNDbGlja1wiOiBmYWxzZSxcclxuICAgIFwic2NvcmVcIjogMCxcclxuICAgIFwiaXNHb29kXCI6IGZhbHNlXHJcbiAgfSxcclxuICB7XHJcbiAgICBcImltZ1wiOiBcImNlbGw0XCIsXHJcbiAgICBcImNoYW5jZVwiOiAzMCxcclxuICAgIFwiaW1nQ2xpY2tcIjogXCJjZWxsNC1maWxsXCIsXHJcbiAgICBcImlzT3BlblwiOiBmYWxzZSxcclxuICAgIFwiaXNDbGlja1wiOiB0cnVlLFxyXG4gICAgXCJjbGlja0NvdW50XCI6IDIsXHJcbiAgICBcInNjb3JlXCI6IDUsXHJcbiAgICBcImlzR29vZFwiOiB0cnVlXHJcbiAgfSxcclxuICB7XHJcbiAgICBcImltZ1wiOiBcImNlbGwxXCIsXHJcbiAgICBcImNoYW5jZVwiOiAxMDAsXHJcbiAgICBcImltZ0NsaWNrXCI6IFwiY2VsbDEtZmlsbFwiLFxyXG4gICAgXCJpc09wZW5cIjogZmFsc2UsXHJcbiAgICBcImNsaWNrQ291bnRcIjogMSxcclxuICAgIFwiaXNDbGlja1wiOiB0cnVlLFxyXG4gICAgXCJzY29yZVwiOiAxLFxyXG4gICAgXCJpc0dvb2RcIjogdHJ1ZVxyXG4gIH1cclxuXVxyXG4iLCJjbGFzcyBCb290IHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG5cdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5zY2FsZS5zZXRNYXhpbXVtKCk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb290O1xyXG4iLCJjb25zdCB1aSA9IHJlcXVpcmUoJy4uL21peGlucy91aScpO1xyXG5jb25zdCBFbnRpdHkgPSByZXF1aXJlKCcuLi9vYmplY3RzL0VudGl0eScpO1xyXG5cclxuY2xhc3MgTWVudSB7XHJcblx0aW5pdChzY29yZSA9IDApIHtcclxuXHRcdGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2NvcmVcIikgPCBzY29yZSB8fCAhbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzY29yZVwiKSlcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzY29yZVwiLCBzY29yZSk7XHJcblxyXG5cdFx0dGhpcy5iZyA9IHVpLmNyZWF0ZUJnKHRoaXMsIHRoaXMuZ2FtZS53aWR0aC81LCA1LCAxMCk7XHJcblxyXG5cdFx0Ly8gdGhpcy5jb2xvcnNDbG91ZHMgPSB0aGlzLmFkZC5zcHJpdGUoMCwgMCwgJ2NvbG9ycy1jbG91ZHMnKTtcclxuXHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMuY29sb3JzQ2xvdWRzKVxyXG5cdFx0Ly8gXHQudG8oe2hlaWdodDogdGhpcy5jb2xvcnNDbG91ZHMuaGVpZ2h0KzE1MH0sIDQwMDApXHJcblx0XHQvLyBcdC50byh7aGVpZ2h0OiB0aGlzLmNvbG9yc0Nsb3Vkcy5oZWlnaHR9LCA0MDAwKVxyXG5cdFx0Ly8gXHQueW95bygpXHJcblx0XHQvLyBcdC5sb29wKClcclxuXHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gdGhpcy5ncmF5Q2xvdWRzID0gdGhpcy5hZGQuc3ByaXRlKDAsIHRoaXMuZ2FtZS5oZWlnaHQsICdncmF5LWNsb3VkcycpO1xyXG5cdFx0Ly8gdGhpcy5ncmF5Q2xvdWRzLmFuY2hvci5zZXQoMCwgMSk7XHJcblx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLmdyYXlDbG91ZHMpXHJcblx0XHQvLyBcdC50byh7aGVpZ2h0OiB0aGlzLmdyYXlDbG91ZHMuaGVpZ2h0KzEwMH0sIDMwMDApXHJcblx0XHQvLyBcdC50byh7aGVpZ2h0OiB0aGlzLmdyYXlDbG91ZHMuaGVpZ2h0fSwgMzAwMClcclxuXHRcdC8vIFx0LnlveW8oKVxyXG5cdFx0Ly8gXHQubG9vcCgpXHJcblx0XHQvLyBcdC5zdGFydCgpO1xyXG5cdFx0Ly9cclxuXHRcdC8vXHJcblx0XHQvLyB0aGlzLnBhcnRHcmF5Q2xvdWQgPSB0aGlzLmFkZC5zcHJpdGUoMCwgNDI1LCAncGFydC1ncmF5LWNsb3VkJyk7XHJcblx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLnBhcnRHcmF5Q2xvdWQpXHJcblx0XHQvLyBcdC50byh7eTogdGhpcy5wYXJ0R3JheUNsb3VkLnkrNjB9LCA1MDAwKVxyXG5cdFx0Ly8gXHQudG8oe3k6IHRoaXMucGFydEdyYXlDbG91ZC55fSwgNTAwMClcclxuXHRcdC8vIFx0LnlveW8oKVxyXG5cdFx0Ly8gXHQubG9vcCgpXHJcblx0XHQvLyBcdC5zdGFydCgpO1xyXG5cdFx0Ly9cclxuXHRcdC8vIHRoaXMucGFydENvbG9yc0Nsb3VkMSA9IHRoaXMuYWRkLnNwcml0ZSg2MiwgNzYwLCAncGFydC1jb2xvcnMtY2xvdWQnKTtcclxuXHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydENvbG9yc0Nsb3VkMSlcclxuXHRcdC8vIFx0LnRvKHt5OiB0aGlzLnBhcnRDb2xvcnNDbG91ZDEueSs4MH0sIDQwMDApXHJcblx0XHQvLyBcdC50byh7eTogdGhpcy5wYXJ0Q29sb3JzQ2xvdWQxLnl9LCA0MDAwKVxyXG5cdFx0Ly8gXHQueW95bygpXHJcblx0XHQvLyBcdC5sb29wKClcclxuXHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gdGhpcy5wYXJ0Q29sb3JzQ2xvdWQyID0gdGhpcy5hZGQuc3ByaXRlKDQ3MCwgNjgwLCAncGFydC1jb2xvcnMtY2xvdWQnKTtcclxuXHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydENvbG9yc0Nsb3VkMilcclxuXHRcdC8vIFx0LnRvKHt5OiB0aGlzLnBhcnRDb2xvcnNDbG91ZDIueSs3MH0sIDMwMDApXHJcblx0XHQvLyBcdC50byh7eTogdGhpcy5wYXJ0Q29sb3JzQ2xvdWQyLnl9LCAzMDAwKVxyXG5cdFx0Ly8gXHQueW95bygpXHJcblx0XHQvLyBcdC5sb29wKClcclxuXHRcdC8vIFx0LnN0YXJ0KCk7XHJcblxyXG5cdFx0dGhpcy5wbGF5ID0gdGhpcy5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53aWR0aC8yLCA1NTAsICdwbGF5Jyk7XHJcblx0XHR0aGlzLnBsYXkuYW5jaG9yLnNldCguNSk7XHJcblx0XHR0aGlzLnBsYXkuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMucGxheS5ldmVudHMub25JbnB1dFVwLmFkZE9uY2UoKCkgPT4ge1xyXG5cdFx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLmdyYXlDbG91ZHMpXHJcblx0XHRcdC8vIFx0LnRvKHt5OiB0aGlzLmdhbWUuaGVpZ2h0KzE1MDB9LCA1MDApXHJcblx0XHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydENvbG9yc0Nsb3VkMSlcclxuXHRcdFx0Ly8gXHQudG8oe3k6IHRoaXMuZ2FtZS5oZWlnaHQrMTAwMH0sIDEwMDApXHJcblx0XHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydENvbG9yc0Nsb3VkMilcclxuXHRcdFx0Ly8gXHQudG8oe3k6IHRoaXMuZ2FtZS5oZWlnaHQrMTAwMH0sIDEwMDApXHJcblx0XHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydEdyYXlDbG91ZClcclxuXHRcdFx0Ly8gXHQudG8oe3k6IC0xMDAwfSwgMTAwMClcclxuXHRcdFx0Ly8gXHQuc3RhcnQoKTtcclxuXHRcdFx0Ly9cclxuXHRcdFx0bGV0IHR3ZWVuID0gdGhpcy5hZGQudHdlZW4odGhpcy5wbGF5KVxyXG5cdFx0XHRcdC50byh7cm90YXRpb246IE1hdGguUEkvMn0sIDEwMClcclxuXHRcdFx0XHQudG8oe3dpZHRoOiB0aGlzLnBsYXkud2lkdGgrMjAsIGhlaWdodDogdGhpcy5wbGF5LmhlaWdodCsyMH0sIDEwMClcclxuXHRcdFx0XHQuc3RhcnQoKTtcclxuXHJcblx0XHRcdHR3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcclxuXHRcdFx0XHR1aS5nb1RvKHRoaXMsICdQbGF5Z3JvdW5kJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53aWR0aC8yLCA3NzAsICdzdGFyJykuYW5jaG9yLnNldCguNSk7XHJcblx0XHR0aGlzLnNldHRpbmdzID0gdGhpcy5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53aWR0aC8yLCAxMDAwLCAnc2V0dGluZ3MnKTtcclxuXHRcdHRoaXMuc2V0dGluZ3MuYW5jaG9yLnNldCguNSk7XHJcblx0XHR0aGlzLnNldHRpbmdzLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblx0XHR0aGlzLnNldHRpbmdzLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcblx0XHRcdGxldCB0d2VlbiA9IHRoaXMuYWRkLnR3ZWVuKHRoaXMuc2V0dGluZ3MpXHJcblx0XHRcdFx0LnRvKHtyb3RhdGlvbjogTWF0aC5QSS8yfSwgMTAwKVxyXG5cdFx0XHRcdC50byh7d2lkdGg6IHRoaXMuc2V0dGluZ3Mud2lkdGgrMjAsIGhlaWdodDogdGhpcy5zZXR0aW5ncy5oZWlnaHQrMjB9LCAxMDApXHJcblx0XHRcdFx0LnN0YXJ0KCk7XHJcblxyXG5cdFx0XHR0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcblx0XHRcdFx0dWkuZ29Ubyh0aGlzLCAnU2V0dGluZ3MnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcbiAgICB0aGlzLmxhYmVsID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgMTQwLCBcIk1vdHRpb25cIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogMTAwLFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcblx0XHRcdGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG4gICAgdGhpcy50ZXh0ID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgMjMwLCBcIlNlbnMgaW4gdGhlIHdheVwiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA2MCxcclxuICAgICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgICBmaWxsOiBcIiM1NTVkZmZcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0Ly9cclxuXHRcdHRoaXMuc2NvcmVzID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgMzUwLCBzY29yZSArICcgfCAnICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Njb3JlJyksIHtcclxuICAgICAgZm9udDogJ1JvYm90bycsXHJcbiAgICAgIGZvbnRTaXplOiA2MixcclxuICAgICAgZm9udFdlaWdodDogODAwLFxyXG4gICAgICBmaWxsOiBcIiM1NTVkZmZcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNjb3Jlcy5hbmNob3Iuc2V0KDAuNSk7XHJcblx0fVxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdC8vIHRoaXMuYnRuLnJvdGF0aW9uICs9IC4wMjtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiY29uc3QgQ2VsbHNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvQ2VsbHNNYW5hZ2VyJyk7XHJcbmNvbnN0IENsb3Vkc01hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9DbG91ZHNNYW5hZ2VyJyk7XHJcbmNvbnN0IElzbGFuZE1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9Jc2xhbmRNYW5hZ2VyJyk7XHJcbmNvbnN0IFdpbmRvd01hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9XaW5kb3dNYW5hZ2VyJyk7XHJcbmNvbnN0IFVJTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL1VJTWFuYWdlcicpO1xyXG5cclxuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9QbGF5ZXInKTtcclxuXHJcbmNsYXNzIFBsYXlncm91bmQge1xyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdHRoaXMud29ybGQuc2V0Qm91bmRzKDAsIC10aGlzLmdhbWUuaGVpZ2h0KjEwMDAsIHRoaXMuZ2FtZS53aWR0aCwgdGhpcy5nYW1lLmhlaWdodCoyMDAwKTtcclxuXHRcdHRoaXMucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BcmNhZGUpO1xyXG5cclxuXHJcblx0XHR0aGlzLmJnID0gdGhpcy5hZGQuc3ByaXRlKDAsIDAsICdiZycpO1xyXG5cdFx0dGhpcy5iZy53aWR0aCA9IHRoaXMuZ2FtZS53aWR0aDtcclxuXHRcdHRoaXMuYmcuaGVpZ2h0ID0gdGhpcy5nYW1lLmhlaWdodDtcclxuXHRcdHRoaXMuYmcuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5jZWxsc01hbmFnZXIgPSBuZXcgQ2VsbHNNYW5hZ2VyKHRoaXMsIDUpO1xyXG5cdFx0dGhpcy5pc2xhbmRNYW5hZ2VyID0gbmV3IElzbGFuZE1hbmFnZXIodGhpcyk7XHJcblx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcyk7XHJcblx0XHR0aGlzLmNsb3Vkc01hbmFnZXIgPSBuZXcgQ2xvdWRzTWFuYWdlcih0aGlzKTtcclxuXHJcblx0XHR0aGlzLlVJTWFuYWdlciA9IG5ldyBVSU1hbmFnZXIodGhpcyk7XHJcblxyXG5cdFx0dGhpcy53aW5kb3dNYW5hZ2VyID0gbmV3IFdpbmRvd01hbmFnZXIodGhpcyk7XHJcblx0XHR0aGlzLndpbmRvd01hbmFnZXIuYWRkV2luZG93KCdNb3R0aW9uJywgJ1NlbnMgaW4gdGhlIHdheS4uLiBMb3JlbSBpcHN1bSBibGFibGFsYWxsYWxibGJsJyk7XHJcblxyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblx0XHR0aGlzLmNsb3Vkc01hbmFnZXIudXBkYXRlKCk7XHJcbiAgICB0aGlzLmNlbGxzTWFuYWdlci51cGRhdGUoKTtcclxuXHRcdHRoaXMuaXNsYW5kTWFuYWdlci51cGRhdGUoKTtcclxuXHRcdHRoaXMucGxheWVyLnVwZGF0ZSgpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Z3JvdW5kO1xyXG4iLCJjbGFzcyBQcmVsb2FkIHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHRwcmVsb2FkKCkge1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdiZycsICdhc3NldHMvYmcucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3BsYXllcicsICdhc3NldHMvcGxheWVyLnBuZycpO1xyXG5cclxuXHRcdC8vIGNlbGxzXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwxJywgJ2Fzc2V0cy9jZWxscy9jZWxsMS5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbDInLCAnYXNzZXRzL2NlbGxzL2NlbGwyLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsMycsICdhc3NldHMvY2VsbHMvY2VsbDMucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGw0JywgJ2Fzc2V0cy9jZWxscy9jZWxsNC5wbmcnKTtcclxuXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwxLWZpbGwnLCAnYXNzZXRzL2NlbGxzL2NlbGwxLWZpbGwucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGw0LWZpbGwnLCAnYXNzZXRzL2NlbGxzL2NlbGw0LWZpbGwucG5nJyk7XHJcblxyXG5cdFx0Ly8gaXNsYW5kXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2lzbGFuZCcsICdhc3NldHMvaXNsYW5kL2lzbGFuZC5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnZmxhZycsICdhc3NldHMvaXNsYW5kL2ZsYWcucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2Nsb3VkJywgJ2Fzc2V0cy9pc2xhbmQvY2xvdWQucG5nJyk7XHJcblxyXG5cdFx0Ly8gdWlcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGxheScsICdhc3NldHMvdWkvcGxheS5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnc2V0dGluZ3MnLCAnYXNzZXRzL3VpL3NldHRpbmdzLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdzdGFyJywgJ2Fzc2V0cy91aS9zdGFyLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCd0aW1lJywgJ2Fzc2V0cy91aS90aW1lLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwbGFuZScsICdhc3NldHMvdWkvcGxhbmUucG5nJyk7XHJcblxyXG5cdFx0Ly8gbWVudVxyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdncmF5LWNsb3VkcycsICdhc3NldHMvbWVudS9ncmF5Y2xvdWRzLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjb2xvcnMtY2xvdWRzJywgJ2Fzc2V0cy9tZW51L2NvbG9yc2Nsb3Vkcy5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGFydC1ncmF5LWNsb3VkJywgJ2Fzc2V0cy9tZW51L3BhcnRncmF5Y2xvdWQucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3BhcnQtY29sb3JzLWNsb3VkJywgJ2Fzc2V0cy9tZW51L3BhcnRjb2xvcnNjbG91ZC5wbmcnKTtcclxuXHJcblx0XHQvLyBtdXNpY1xyXG5cdFx0dGhpcy5sb2FkLmF1ZGlvKCdtdXNpYycsICdhc3NldHMvbXVzaWMvYmVuc291bmQtYW5ld2JlZ2lubmluZy5tcDMnKTtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdGxldCBtdXNpYyA9IHRoaXMuYWRkLmF1ZGlvKCdtdXNpYycpO1xyXG5cdFx0bXVzaWMubG9vcEZ1bGwoMC42KTtcclxuXHJcblx0XHR0aGlzLnN0YXRlLnN0YXJ0KCdNZW51Jyk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWQ7XHJcbiIsImNvbnN0IHVpID0gcmVxdWlyZSgnLi4vbWl4aW5zL3VpJyk7XHJcblxyXG5jbGFzcyBTZXR0aW5ncyB7XHJcblx0aW5pdCgpIHtcclxuXHRcdHRoaXMuYmcgPSB1aS5jcmVhdGVCZyh0aGlzLCB0aGlzLmdhbWUud2lkdGgvNSwgNSwgMTApO1xyXG5cclxuICAgIHRoaXMubGFiZWwgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAxNDAsIFwiU2V0dGluZ3NcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogMTAwLFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcblx0XHRcdGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG5cclxuICAgIHRoaXMuc291bmRzID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgNTUwLCBcIlNvdW5kcyB8IE9OXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDYwLFxyXG4gICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc291bmRzLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICB0aGlzLm11c2ljID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgNjUwLCBcIk11c2ljIHwgT0ZGXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDYwLFxyXG4gICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMubXVzaWMuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuICAgIHRoaXMuYmFjayA9IHRoaXMuYWRkLnRleHQoMTUwLCB0aGlzLmdhbWUuaGVpZ2h0LTgwLCBcIkJhY2tcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogODAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5iYWNrLmFuY2hvci5zZXQoMC41KTtcclxuICAgIHRoaXMuYmFjay5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5iYWNrLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgIHVpLmdvVG8odGhpcywgJ01lbnUnKTtcclxuICAgIH0pO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcclxuIl19
