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

},{"./states/Boot.js":13,"./states/Menu.js":14,"./states/Playground.js":15,"./states/Preload.js":16,"./states/Settings.js":17}],2:[function(require,module,exports){
module.exports=[
  {
    "totalCells": 20,
    "amtCells": 3,
    "dir": "top",
    "idCells": [0, 1],
    "tint": 0xFFFFFF,
    "text": "Тлен идет за тобой по пятам. \n Отступись и он тебя поглатит... \n Но не стоит отчаиваться, ведь музыка всегда с тобой."
  },
  {
    "totalCells": 500,
    "amtCells": 3,
    "dir": "top",
    "idCells": [0, 1, 2],
    "tint": 0xFFFFFF,
    "text": "Тлен не щадит никого. Летучие змеи падут на землю и погрузятся в рутину бытия..."
  },
  {
    "totalCells": 200,
    "amtCells": 4,
    "dir": "top",
    "idCells": [0, 1, 2, 3],
    "tint": 0xff0000,
    "text": "И тогда он понес свечу через чужие земли освобождая летучих змей и свой народ..."
  }
]

},{}],3:[function(require,module,exports){
const Cell = require('../objects/Cell');

class CellsManager extends Phaser.Group {
  constructor(level) {
    super(level.state.game);

    this.level = level;
    this.state = level.state;
    this.enableBody = true;
  }
  startGen(lvl) {
    this.last = [];
    this.lastY = 0;
    this.createCells(this.level.startCountCells);
  }
  createCells(amtGenY) {
    let arr = [];
    this.level.totalCells -= amtGenY;

    // генерируем ячейки
    for(let y = this.lastY; y < this.lastY+amtGenY; y++) {
      for(let x = 0; x < this.level.amtX; x++) {
        // рандомно (с приоритетом) выбираем ячейку
        let rand = Math.random()*100;
        for(let i = 0; i < this.level.dataCells.length; i++) {
           if(rand < this.level.dataCells[i].chance) {
             // Оптимизация, не создаем новую ячейку,а переформировываем старые
             let cell = this.getFirstDead();
             if(!cell) {
                cell = new Cell(this, this.level.dataCells[i], x, y);
                this.add(cell);
             } else {
               cell.reUseCell(x, y, this.level.dataCells[i]);
               cell.revive();
             }

             arr.push(cell);
             break;
           }
        }
      }
    }

    // Костыль, который линкует соседей справа, слева, сверху
    for(let y = 0; y < amtGenY; y++) {
      for(let x = 0; x < this.level.amtX; x++) {
        if(y+1 < amtGenY) arr[y*this.level.amtX+x].topPanel = arr[(y+1)*this.level.amtX+x];
        if(x-1 >= 0) arr[y*this.level.amtX+x].leftPanel = arr[y*this.level.amtX+x-1];
        if(x+1 < this.level.amtX)  arr[y*this.level.amtX+x].rightPanel = arr[y*this.level.amtX+x+1];
      }
    }

    // Костыль, который линкует новый уровень ячеек со старым
    if(this.last.length) {
      for(let x = 0; x < this.level.amtX; x++) {
        this.last[x].topPanel = arr[x];
      }
    }
    this.last = [];
    for(let i = arr.length-this.level.amtX; i < arr.length; i++) {
      this.last.push(arr[i]);
    }

    this.lastY += amtGenY;
  }
  update(dt) {
    // если слой ячеек ушел из зоны видимости, то генерируем новый слой
    let isHide = false;
    this.forEach((cell) => {
      if(cell.y > this.level.player.y+this.state.game.height/2) {
        // помогаем сборщику мусора
        cell.leftPanel = null;
        cell.rightPanel = null;
        cell.topPanel = null;
        cell.kill();

        // Создаем новый слой, если количество ячеек на уровне не кончилось
        !isHide && this.level.totalCells && this.createCells(1);
        isHide = true;
      }
    });
  }
}

module.exports = CellsManager;

},{"../objects/Cell":9}],4:[function(require,module,exports){
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
      if(cloud.y > this.state.levelManager.player.y+this.state.game.height-400)
        cloud.kill();
    });
  }
}

module.exports = CloudsManager;

},{}],5:[function(require,module,exports){
const CellsManager = require('../managers/CellsManager');
const WindowManager = require('../managers/WindowManager');
const Island = require('../objects/Island');
const Player = require('../objects/Player');


class LevelManager {
  constructor(state, levels, cells) {
    this.state = state;

    this.levels = levels;
    this.typesCells = cells;
    this.current = 0;

    this.lastY = this.state.game.height;
    this.lastX = 0;

    this.cells = new CellsManager(this);
    this.window = new WindowManager(this);

    this.createLevel(this.levels[this.current]);
    this.player = new Player(this);
  }
  createLevel(lvl) {
    this.amtX = lvl.amtCells || 2;
    this.totalCells = lvl.totalCells || 500;
    this.tint = lvl.tint;
    this.sizeCell = this.state.game.width/this.amtX;
    this.startCountCells = Math.floor(this.state.game.height/this.sizeCell);

    // костыль, который сортирует данные о типах по шансу (по убыванию) и отсекает типы, которых нет на уровне.
    this.dataCells = this.typesCells.slice().sort((a, b) => a.chance - b.chance);


    this.createIsland(lvl);
    this.createCells(lvl);
    this.window.addWindow(lvl.text);

    console.log(this)
  }
  createIsland(lvl) {
    if(lvl.dir === 'top')
      this.lastY -= this.amtX*this.sizeCell;

    this.island = new Island(this, this.lastX, this.lastY, lvl);
  }
  createCells(lvl) {
    this.cells.startGen();
  }
  update() {
    if(this.totalCells === 0) {
      if(this.current+1 < this.levels.length) this.current++;
      this.createLevel(this.levels[this.current]);
    }
    if(this.island.y > this.player.y+this.state.game.height/2)
      this.island.destroy();

    this.player.update();
    this.cells.update();
  }
}

module.exports = LevelManager;

},{"../managers/CellsManager":3,"../managers/WindowManager":7,"../objects/Island":11,"../objects/Player":12}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
class WindowManager extends Phaser.Group {
  constructor(level) {
    super(level.state);

    this.level = level;
    this.state = level.state;

    this.alpha = 0;
    this.fixedToCamera = true;

    this.bg = this.state.make.graphics(0, 0);
    this.bg.beginFill(0xFFFFFF);
    this.bg.drawRect(0, 0, this.state.game.width, this.state.game.height);
    this.bg.inputEnabled = true;
    this.add(this.bg);

    this.content = this.state.make.text(this.state.game.width/2, this.state.game.height/2, "", {
      font: 'Opificio',
      fontSize: 50,
      fontWeight: 600,
      fill: "#555dff",
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.state.game.width-100
    });
    this.content.anchor.set(0.5);
    this.add(this.content);
  }
  addWindow(text, cb) {
    this.state.add.tween(this)
      .to({alpha: 1}, 500)
      .start();
    this.bg.inputEnabled = true;

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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
class Cell extends Phaser.Sprite {
  constructor(manager, type, x, y) {
    super(manager.game, 0, 0, type.img);

    this.manager = manager;
    this.level = manager.level;
    this.state = manager.state;

    this.padding = 10;
    this.size = this.manager.level.sizeCell;
    this.width = this.size-this.padding;
    this.height = this.size-this.padding;
    this.anchor.set(.5);

    this.reUseCell(x, y, type);
  }
  reUseCell(x, y, type) {
    this.loadTexture(type.img, 0);
    this.clickCount = type.clickCount;

    this.x = x*this.size+this.padding/2+this.width/2;
    this.y = this.level.lastY-y*this.size+this.height/2;
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
const Entity = require('../objects/Entity');

class Island extends Phaser.Sprite {
  constructor(level, x, y, lvl) {
    super(level.state.game, x, y, 'island');
    level.state.add.existing(this);

    this.level = level;
    this.state = level.state;

    this.tint = lvl.tint;

    this.size = this.level.sizeCell*this.level.amtX;
    this.width = this.size;
    this.height = this.size;

    this.addChild(this.state.make.sprite(42-20, 150, 'flag'));
    this.addChild(this.state.make.sprite(120-20, 240, 'flag'));
    this.addChild(this.state.make.sprite(75-20, 460, 'flag'));
    this.addChild(this.state.make.sprite(265-20, 560, 'flag'));
    this.addChild(this.state.make.sprite(440+100, 610, 'flag')).scale.x *= -1;
    this.addChild(this.state.make.sprite(570+100, 515, 'flag')).scale.x *= -1;
    this.addChild(this.state.make.sprite(620+100, 280, 'flag')).scale.x *= -1;
  }
}

module.exports = Island;

},{"../objects/Entity":10}],12:[function(require,module,exports){
const Entity = require('./Entity');
const ui = require('../mixins/ui');

class Player extends Entity {
  constructor(level) {
    super(level.state, level.state.game.width/2, level.state.game.height-400, 70, true);
    level.state.add.existing(this);

    this.level = level;
    this.state = level.state;

    this.state.physics.arcade.enable(this);
    this.body.setSize(this.width/2-1, this.height/2-1, 1, 1);

    this.state.camera.follow(this);
		this.state.camera.deadzone = new Phaser.Rectangle(this.x-this.width/2, this.y-this.height/2, this.width, this.height);

    this.speed = 100;
    this.currentTime = 0;
    this.lastMove;

    this.state.input.onDown.addOnce(() => {
      let tween = this.state.add.tween(this)
        .to({y: this.level.island.y+this.level.sizeCell}, this.speed*10)
        .start();
    }, this);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.level.cells, (pl, cell) => {
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

},{"../mixins/ui":8,"./Entity":10}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"../mixins/ui":8,"../objects/Entity":10}],15:[function(require,module,exports){
const CloudsManager = require('../managers/CloudsManager');
const UIManager = require('../managers/UIManager');
const LevelManager = require('../managers/LevelManager');

const levels = require('../levels.json');
const types = require('../types.json');

class Playground {
	create() {
		this.world.setBounds(0, -this.game.height*1000, this.game.width, this.game.height*2000);
		this.physics.startSystem(Phaser.Physics.Arcade);


		this.bg = this.add.sprite(0, 0, 'bg');
		this.bg.width = this.game.width;
		this.bg.height = this.game.height;
		this.bg.fixedToCamera = true;

		this.cloudsManager = new CloudsManager(this);
		this.levelManager = new LevelManager(this, levels, types);
		this.UIManager = new UIManager(this);
	}
	update() {
		this.cloudsManager.update();
    this.levelManager.update();
	}
}

module.exports = Playground;

},{"../levels.json":2,"../managers/CloudsManager":4,"../managers/LevelManager":5,"../managers/UIManager":6,"../types.json":18}],16:[function(require,module,exports){
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
		// this.load.image('gray-clouds', 'assets/menu/grayclouds.png');
		// this.load.image('colors-clouds', 'assets/menu/colorsclouds.png');
		// this.load.image('part-gray-cloud', 'assets/menu/partgraycloud.png');
		// this.load.image('part-colors-cloud', 'assets/menu/partcolorscloud.png');

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

},{}],17:[function(require,module,exports){
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

},{"../mixins/ui":8}],18:[function(require,module,exports){
module.exports=[
  {
    "id": 0,
    "img": "cell1",
    "chance": 100,
    "imgClick": "cell1-fill",
    "isOpen": false,
    "clickCount": 1,
    "isClick": true,
    "score": 1,
    "isGood": true
  },
  {
    "id": 1,
    "chance": 20,
    "img": "cell2",
    "isOpen": false,
    "isClick": false,
    "score": 0,
    "isGood": false
  },
  {
    "id": 2,
    "chance": 5,
    "img": "cell3",
    "isOpen": true,
    "isClick": false,
    "score": 10,
    "isGood": true
  },
  {
    "id": 3,
    "img": "cell4",
    "chance": 30,
    "imgClick": "cell4-fill",
    "isOpen": false,
    "isClick": true,
    "clickCount": 2,
    "score": 5,
    "isGood": true
  }
]

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2xldmVscy5qc29uIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvQ2VsbHNNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvQ2xvdWRzTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0xldmVsTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL1VJTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL1dpbmRvd01hbmFnZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9taXhpbnMvdWkuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9vYmplY3RzL0NlbGwuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9vYmplY3RzL0VudGl0eS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvSXNsYW5kLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvb2JqZWN0cy9QbGF5ZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvQm9vdC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9NZW51LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc3RhdGVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvUHJlbG9hZC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9TZXR0aW5ncy5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3R5cGVzLmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IEJvb3QgPSByZXF1aXJlKCcuL3N0YXRlcy9Cb290LmpzJyk7XHJcbmNvbnN0IFByZWxvYWQgPSByZXF1aXJlKCcuL3N0YXRlcy9QcmVsb2FkLmpzJyk7XHJcbmNvbnN0IE1lbnUgPSByZXF1aXJlKCcuL3N0YXRlcy9NZW51LmpzJyk7XHJcbmNvbnN0IFBsYXlncm91bmQgPSByZXF1aXJlKCcuL3N0YXRlcy9QbGF5Z3JvdW5kLmpzJyk7XHJcbmNvbnN0IFNldHRpbmdzID0gcmVxdWlyZSgnLi9zdGF0ZXMvU2V0dGluZ3MuanMnKTtcclxuXHJcbnZhciByZWFkeSA9ICgpID0+IHtcclxuXHR2YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg3MjAsIDEyODAsIFBoYXNlci5BVVRPLCAnTW90dGlvbicpO1xyXG5cclxuXHRnYW1lLnN0YXRlLmFkZCgnQm9vdCcsIEJvb3QsIHRydWUpO1xyXG4gIGdhbWUuc3RhdGUuYWRkKCdQcmVsb2FkJywgUHJlbG9hZCk7XHJcbiAgZ2FtZS5zdGF0ZS5hZGQoJ01lbnUnLCBNZW51KTtcclxuXHRnYW1lLnN0YXRlLmFkZCgnU2V0dGluZ3MnLCBTZXR0aW5ncyk7XHJcblx0Z2FtZS5zdGF0ZS5hZGQoJ1BsYXlncm91bmQnLCBQbGF5Z3JvdW5kKTtcclxufVxyXG5cclxucmVhZHkoKTtcclxuIiwibW9kdWxlLmV4cG9ydHM9W1xyXG4gIHtcclxuICAgIFwidG90YWxDZWxsc1wiOiAyMCxcclxuICAgIFwiYW10Q2VsbHNcIjogMyxcclxuICAgIFwiZGlyXCI6IFwidG9wXCIsXHJcbiAgICBcImlkQ2VsbHNcIjogWzAsIDFdLFxyXG4gICAgXCJ0aW50XCI6IDB4RkZGRkZGLFxyXG4gICAgXCJ0ZXh0XCI6IFwi0KLQu9C10L0g0LjQtNC10YIg0LfQsCDRgtC+0LHQvtC5INC/0L4g0L/Rj9GC0LDQvC4gXFxuINCe0YLRgdGC0YPQv9C40YHRjCDQuCDQvtC9INGC0LXQsdGPINC/0L7Qs9C70LDRgtC40YIuLi4gXFxuINCd0L4g0L3QtSDRgdGC0L7QuNGCINC+0YLRh9Cw0LjQstCw0YLRjNGB0Y8sINCy0LXQtNGMINC80YPQt9GL0LrQsCDQstGB0LXQs9C00LAg0YEg0YLQvtCx0L7QuS5cIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJ0b3RhbENlbGxzXCI6IDUwMCxcclxuICAgIFwiYW10Q2VsbHNcIjogMyxcclxuICAgIFwiZGlyXCI6IFwidG9wXCIsXHJcbiAgICBcImlkQ2VsbHNcIjogWzAsIDEsIDJdLFxyXG4gICAgXCJ0aW50XCI6IDB4RkZGRkZGLFxyXG4gICAgXCJ0ZXh0XCI6IFwi0KLQu9C10L0g0L3QtSDRidCw0LTQuNGCINC90LjQutC+0LPQvi4g0JvQtdGC0YPRh9C40LUg0LfQvNC10Lgg0L/QsNC00YPRgiDQvdCwINC30LXQvNC70Y4g0Lgg0L/QvtCz0YDRg9C30Y/RgtGB0Y8g0LIg0YDRg9GC0LjQvdGDINCx0YvRgtC40Y8uLi5cIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJ0b3RhbENlbGxzXCI6IDIwMCxcclxuICAgIFwiYW10Q2VsbHNcIjogNCxcclxuICAgIFwiZGlyXCI6IFwidG9wXCIsXHJcbiAgICBcImlkQ2VsbHNcIjogWzAsIDEsIDIsIDNdLFxyXG4gICAgXCJ0aW50XCI6IDB4ZmYwMDAwLFxyXG4gICAgXCJ0ZXh0XCI6IFwi0Jgg0YLQvtCz0LTQsCDQvtC9INC/0L7QvdC10YEg0YHQstC10YfRgyDRh9C10YDQtdC3INGH0YPQttC40LUg0LfQtdC80LvQuCDQvtGB0LLQvtCx0L7QttC00LDRjyDQu9C10YLRg9GH0LjRhSDQt9C80LXQuSDQuCDRgdCy0L7QuSDQvdCw0YDQvtC0Li4uXCJcclxuICB9XHJcbl1cclxuIiwiY29uc3QgQ2VsbCA9IHJlcXVpcmUoJy4uL29iamVjdHMvQ2VsbCcpO1xyXG5cclxuY2xhc3MgQ2VsbHNNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihsZXZlbCkge1xyXG4gICAgc3VwZXIobGV2ZWwuc3RhdGUuZ2FtZSk7XHJcblxyXG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xyXG4gICAgdGhpcy5zdGF0ZSA9IGxldmVsLnN0YXRlO1xyXG4gICAgdGhpcy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICB9XHJcbiAgc3RhcnRHZW4obHZsKSB7XHJcbiAgICB0aGlzLmxhc3QgPSBbXTtcclxuICAgIHRoaXMubGFzdFkgPSAwO1xyXG4gICAgdGhpcy5jcmVhdGVDZWxscyh0aGlzLmxldmVsLnN0YXJ0Q291bnRDZWxscyk7XHJcbiAgfVxyXG4gIGNyZWF0ZUNlbGxzKGFtdEdlblkpIHtcclxuICAgIGxldCBhcnIgPSBbXTtcclxuICAgIHRoaXMubGV2ZWwudG90YWxDZWxscyAtPSBhbXRHZW5ZO1xyXG5cclxuICAgIC8vINCz0LXQvdC10YDQuNGA0YPQtdC8INGP0YfQtdC50LrQuFxyXG4gICAgZm9yKGxldCB5ID0gdGhpcy5sYXN0WTsgeSA8IHRoaXMubGFzdFkrYW10R2VuWTsgeSsrKSB7XHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCB0aGlzLmxldmVsLmFtdFg7IHgrKykge1xyXG4gICAgICAgIC8vINGA0LDQvdC00L7QvNC90L4gKNGBINC/0YDQuNC+0YDQuNGC0LXRgtC+0LwpINCy0YvQsdC40YDQsNC10Lwg0Y/Rh9C10LnQutGDXHJcbiAgICAgICAgbGV0IHJhbmQgPSBNYXRoLnJhbmRvbSgpKjEwMDtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5sZXZlbC5kYXRhQ2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICBpZihyYW5kIDwgdGhpcy5sZXZlbC5kYXRhQ2VsbHNbaV0uY2hhbmNlKSB7XHJcbiAgICAgICAgICAgICAvLyDQntC/0YLQuNC80LjQt9Cw0YbQuNGPLCDQvdC1INGB0L7Qt9C00LDQtdC8INC90L7QstGD0Y4g0Y/Rh9C10LnQutGDLNCwINC/0LXRgNC10YTQvtGA0LzQuNGA0L7QstGL0LLQsNC10Lwg0YHRgtCw0YDRi9C1XHJcbiAgICAgICAgICAgICBsZXQgY2VsbCA9IHRoaXMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICAgICAgICAgICBpZighY2VsbCkge1xyXG4gICAgICAgICAgICAgICAgY2VsbCA9IG5ldyBDZWxsKHRoaXMsIHRoaXMubGV2ZWwuZGF0YUNlbGxzW2ldLCB4LCB5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkKGNlbGwpO1xyXG4gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgY2VsbC5yZVVzZUNlbGwoeCwgeSwgdGhpcy5sZXZlbC5kYXRhQ2VsbHNbaV0pO1xyXG4gICAgICAgICAgICAgICBjZWxsLnJldml2ZSgpO1xyXG4gICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgIGFyci5wdXNoKGNlbGwpO1xyXG4gICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINCa0L7RgdGC0YvQu9GMLCDQutC+0YLQvtGA0YvQuSDQu9C40L3QutGD0LXRgiDRgdC+0YHQtdC00LXQuSDRgdC/0YDQsNCy0LAsINGB0LvQtdCy0LAsINGB0LLQtdGA0YXRg1xyXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8IGFtdEdlblk7IHkrKykge1xyXG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgdGhpcy5sZXZlbC5hbXRYOyB4KyspIHtcclxuICAgICAgICBpZih5KzEgPCBhbXRHZW5ZKSBhcnJbeSp0aGlzLmxldmVsLmFtdFgreF0udG9wUGFuZWwgPSBhcnJbKHkrMSkqdGhpcy5sZXZlbC5hbXRYK3hdO1xyXG4gICAgICAgIGlmKHgtMSA+PSAwKSBhcnJbeSp0aGlzLmxldmVsLmFtdFgreF0ubGVmdFBhbmVsID0gYXJyW3kqdGhpcy5sZXZlbC5hbXRYK3gtMV07XHJcbiAgICAgICAgaWYoeCsxIDwgdGhpcy5sZXZlbC5hbXRYKSAgYXJyW3kqdGhpcy5sZXZlbC5hbXRYK3hdLnJpZ2h0UGFuZWwgPSBhcnJbeSp0aGlzLmxldmVsLmFtdFgreCsxXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINCa0L7RgdGC0YvQu9GMLCDQutC+0YLQvtGA0YvQuSDQu9C40L3QutGD0LXRgiDQvdC+0LLRi9C5INGD0YDQvtCy0LXQvdGMINGP0YfQtdC10Log0YHQviDRgdGC0LDRgNGL0LxcclxuICAgIGlmKHRoaXMubGFzdC5sZW5ndGgpIHtcclxuICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IHRoaXMubGV2ZWwuYW10WDsgeCsrKSB7XHJcbiAgICAgICAgdGhpcy5sYXN0W3hdLnRvcFBhbmVsID0gYXJyW3hdO1xyXG4gICAgICB9XHJcbiAgICB9XG4gICAgdGhpcy5sYXN0ID0gW107XG4gICAgZm9yKGxldCBpID0gYXJyLmxlbmd0aC10aGlzLmxldmVsLmFtdFg7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMubGFzdC5wdXNoKGFycltpXSk7XG4gICAgfVxyXG5cclxuICAgIHRoaXMubGFzdFkgKz0gYW10R2VuWTtcclxuICB9XHJcbiAgdXBkYXRlKGR0KSB7XHJcbiAgICAvLyDQtdGB0LvQuCDRgdC70L7QuSDRj9GH0LXQtdC6INGD0YjQtdC7INC40Lcg0LfQvtC90Ysg0LLQuNC00LjQvNC+0YHRgtC4LCDRgtC+INCz0LXQvdC10YDQuNGA0YPQtdC8INC90L7QstGL0Lkg0YHQu9C+0LlcclxuICAgIGxldCBpc0hpZGUgPSBmYWxzZTtcclxuICAgIHRoaXMuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICBpZihjZWxsLnkgPiB0aGlzLmxldmVsLnBsYXllci55K3RoaXMuc3RhdGUuZ2FtZS5oZWlnaHQvMikge1xyXG4gICAgICAgIC8vINC/0L7QvNC+0LPQsNC10Lwg0YHQsdC+0YDRidC40LrRgyDQvNGD0YHQvtGA0LBcclxuICAgICAgICBjZWxsLmxlZnRQYW5lbCA9IG51bGw7XHJcbiAgICAgICAgY2VsbC5yaWdodFBhbmVsID0gbnVsbDtcclxuICAgICAgICBjZWxsLnRvcFBhbmVsID0gbnVsbDtcclxuICAgICAgICBjZWxsLmtpbGwoKTtcclxuXHJcbiAgICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0L3QvtCy0YvQuSDRgdC70L7QuSwg0LXRgdC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0Y/Rh9C10LXQuiDQvdCwINGD0YDQvtCy0L3QtSDQvdC1INC60L7QvdGH0LjQu9C+0YHRjFxyXG4gICAgICAgICFpc0hpZGUgJiYgdGhpcy5sZXZlbC50b3RhbENlbGxzICYmIHRoaXMuY3JlYXRlQ2VsbHMoMSk7XHJcbiAgICAgICAgaXNIaWRlID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENlbGxzTWFuYWdlcjtcclxuIiwiY2xhc3MgQ2xvdWRzTWFuYWdlciBleHRlbmRzIFBoYXNlci5Hcm91cCB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIHN1cGVyKHN0YXRlLmdhbWUpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG5cclxuICAgIHRoaXMubGFzdFkgPSAwO1xyXG5cclxuICAgIHRoaXMudGltZXIgPSB0aGlzLnN0YXRlLnRpbWUuY3JlYXRlKGZhbHNlKTtcclxuICAgIHRoaXMudGltZXIubG9vcCgxMDAwLCB0aGlzLmNyZWF0ZUNsb3VkLCB0aGlzKTtcclxuICAgIHRoaXMudGltZXIuc3RhcnQoKTtcclxuICB9XHJcbiAgY3JlYXRlQ2xvdWQoKSB7XHJcbiAgICB0aGlzLmxhc3RZIC09IHRoaXMuc3RhdGUucm5kLmJldHdlZW4odGhpcy5zdGF0ZS5nYW1lLmhlaWdodCwgdGhpcy5zdGF0ZS5nYW1lLmhlaWdodCoyKTtcclxuXHJcbiAgICBsZXQgY2xvdWQgPSB0aGlzLmdldEZpcnN0RGVhZCgpO1xyXG4gICAgaWYoIWNsb3VkKSB7XHJcbiAgICAgICBjbG91ZCA9IHRoaXMuYWRkKHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoMCwgdGhpcy5sYXN0WSwgJ2Nsb3VkJykpO1xyXG4gICAgICAgdGhpcy5yYW5kb21pemVDbG91ZChjbG91ZCk7XHJcbiAgICAgICB0aGlzLmFkZChjbG91ZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnJhbmRvbWl6ZUNsb3VkKGNsb3VkKTtcclxuICAgICAgY2xvdWQucmV2aXZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJhbmRvbWl6ZUNsb3VkKGNsb3VkKSB7XHJcbiAgICBpZihNYXRoLnJhbmRvbSgpIDwgLjUpIHtcclxuICAgICAgY2xvdWQucG9zaXRpb24uc2V0KDAsIHRoaXMubGFzdFkpO1xyXG4gICAgICBjbG91ZC53aWR0aCA9IHRoaXMuc3RhdGUuZ2FtZS53aWR0aC0xMDA7XHJcbiAgICAgIGNsb3VkLmhlaWdodCA9IDQwMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNsb3VkLnBvc2l0aW9uLnNldCgxMDAsIHRoaXMubGFzdFkpO1xyXG4gICAgICBjbG91ZC53aWR0aCA9IHRoaXMuc3RhdGUuZ2FtZS53aWR0aC0xMDA7XHJcbiAgICAgIGNsb3VkLmhlaWdodCA9IDQwMDtcclxuICAgICAgY2xvdWQuYW5jaG9yLnNldCgxKTtcclxuICAgICAgY2xvdWQuc2NhbGUueCAqPSAtMTtcclxuICAgIH1cclxuICAgIGNsb3VkLmR1cmF0aW9uID0gTWF0aC5yYW5kb20oKSoyO1xyXG4gICAgY2xvdWQuYWxwaGEgPSAuOTtcclxuICB9XHJcbiAgdXBkYXRlKGR0KSB7XHJcbiAgICB0aGlzLmZvckVhY2goKGNsb3VkKSA9PiB7XHJcbiAgICAgIGNsb3VkLnkgKz0gY2xvdWQuZHVyYXRpb247XHJcbiAgICAgIGlmKGNsb3VkLnkgPiB0aGlzLnN0YXRlLmxldmVsTWFuYWdlci5wbGF5ZXIueSt0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0LTQwMClcclxuICAgICAgICBjbG91ZC5raWxsKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2xvdWRzTWFuYWdlcjtcclxuIiwiY29uc3QgQ2VsbHNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvQ2VsbHNNYW5hZ2VyJyk7XHJcbmNvbnN0IFdpbmRvd01hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9XaW5kb3dNYW5hZ2VyJyk7XHJcbmNvbnN0IElzbGFuZCA9IHJlcXVpcmUoJy4uL29iamVjdHMvSXNsYW5kJyk7XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4uL29iamVjdHMvUGxheWVyJyk7XHJcblxyXG5cclxuY2xhc3MgTGV2ZWxNYW5hZ2VyIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSwgbGV2ZWxzLCBjZWxscykge1xyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG5cclxuICAgIHRoaXMubGV2ZWxzID0gbGV2ZWxzO1xyXG4gICAgdGhpcy50eXBlc0NlbGxzID0gY2VsbHM7XHJcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xyXG5cclxuICAgIHRoaXMubGFzdFkgPSB0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0O1xyXG4gICAgdGhpcy5sYXN0WCA9IDA7XHJcblxyXG4gICAgdGhpcy5jZWxscyA9IG5ldyBDZWxsc01hbmFnZXIodGhpcyk7XHJcbiAgICB0aGlzLndpbmRvdyA9IG5ldyBXaW5kb3dNYW5hZ2VyKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuY3JlYXRlTGV2ZWwodGhpcy5sZXZlbHNbdGhpcy5jdXJyZW50XSk7XHJcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcyk7XHJcbiAgfVxyXG4gIGNyZWF0ZUxldmVsKGx2bCkge1xyXG4gICAgdGhpcy5hbXRYID0gbHZsLmFtdENlbGxzIHx8IDI7XHJcbiAgICB0aGlzLnRvdGFsQ2VsbHMgPSBsdmwudG90YWxDZWxscyB8fCA1MDA7XHJcbiAgICB0aGlzLnRpbnQgPSBsdmwudGludDtcclxuICAgIHRoaXMuc2l6ZUNlbGwgPSB0aGlzLnN0YXRlLmdhbWUud2lkdGgvdGhpcy5hbXRYO1xyXG4gICAgdGhpcy5zdGFydENvdW50Q2VsbHMgPSBNYXRoLmZsb29yKHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQvdGhpcy5zaXplQ2VsbCk7XHJcblxyXG4gICAgLy8g0LrQvtGB0YLRi9C70YwsINC60L7RgtC+0YDRi9C5INGB0L7RgNGC0LjRgNGD0LXRgiDQtNCw0L3QvdGL0LUg0L4g0YLQuNC/0LDRhSDQv9C+INGI0LDQvdGB0YMgKNC/0L4g0YPQsdGL0LLQsNC90LjRjikg0Lgg0L7RgtGB0LXQutCw0LXRgiDRgtC40L/Riywg0LrQvtGC0L7RgNGL0YUg0L3QtdGCINC90LAg0YPRgNC+0LLQvdC1LlxyXG4gICAgdGhpcy5kYXRhQ2VsbHMgPSB0aGlzLnR5cGVzQ2VsbHMuc2xpY2UoKS5zb3J0KChhLCBiKSA9PiBhLmNoYW5jZSAtIGIuY2hhbmNlKTtcclxuXHJcblxyXG4gICAgdGhpcy5jcmVhdGVJc2xhbmQobHZsKTtcclxuICAgIHRoaXMuY3JlYXRlQ2VsbHMobHZsKTtcclxuICAgIHRoaXMud2luZG93LmFkZFdpbmRvdyhsdmwudGV4dCk7XHJcblxyXG4gICAgY29uc29sZS5sb2codGhpcylcclxuICB9XHJcbiAgY3JlYXRlSXNsYW5kKGx2bCkge1xyXG4gICAgaWYobHZsLmRpciA9PT0gJ3RvcCcpXHJcbiAgICAgIHRoaXMubGFzdFkgLT0gdGhpcy5hbXRYKnRoaXMuc2l6ZUNlbGw7XHJcblxyXG4gICAgdGhpcy5pc2xhbmQgPSBuZXcgSXNsYW5kKHRoaXMsIHRoaXMubGFzdFgsIHRoaXMubGFzdFksIGx2bCk7XHJcbiAgfVxyXG4gIGNyZWF0ZUNlbGxzKGx2bCkge1xyXG4gICAgdGhpcy5jZWxscy5zdGFydEdlbigpO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICBpZih0aGlzLnRvdGFsQ2VsbHMgPT09IDApIHtcclxuICAgICAgaWYodGhpcy5jdXJyZW50KzEgPCB0aGlzLmxldmVscy5sZW5ndGgpIHRoaXMuY3VycmVudCsrO1xyXG4gICAgICB0aGlzLmNyZWF0ZUxldmVsKHRoaXMubGV2ZWxzW3RoaXMuY3VycmVudF0pO1xyXG4gICAgfVxyXG4gICAgaWYodGhpcy5pc2xhbmQueSA+IHRoaXMucGxheWVyLnkrdGhpcy5zdGF0ZS5nYW1lLmhlaWdodC8yKVxyXG4gICAgICB0aGlzLmlzbGFuZC5kZXN0cm95KCk7XHJcblxyXG4gICAgdGhpcy5wbGF5ZXIudXBkYXRlKCk7XHJcbiAgICB0aGlzLmNlbGxzLnVwZGF0ZSgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMZXZlbE1hbmFnZXI7XHJcbiIsImNsYXNzIFVJTWFuYWdlciBleHRlbmRzIFBoYXNlci5Hcm91cCB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgIHN1cGVyKHN0YXRlKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMucGxhbmUgPSB0aGlzLnN0YXRlLm1ha2Uuc3ByaXRlKDAsIDAsICdwbGFuZScpO1xyXG4gICAgdGhpcy5hZGQodGhpcy5wbGFuZSk7XHJcblxyXG4gICAgdGhpcy5zY29yZVRleHQgPSB0aGlzLnN0YXRlLm1ha2UudGV4dCg1MCwgMjUsIFwiMHdheXMuXCIsIHtcclxuICAgICAgZm9udDogJ1JvYm90bycsXHJcbiAgICAgIGZvbnRTaXplOiA2MCxcclxuICAgICAgZm9udFdlaWdodDogODAwLFxyXG4gICAgICBmaWxsOiBcIiM1NTVkZmZcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmFkZCh0aGlzLnNjb3JlVGV4dCk7XHJcbiAgICB0aGlzLnNjb3JlID0gMDtcclxuXHJcblxyXG4gICAgdGhpcy5wYXVzZSA9IHRoaXMuc3RhdGUubWFrZS5zcHJpdGUodGhpcy5zdGF0ZS5nYW1lLndpZHRoLTgwLCA3MCwgJ3RpbWUnKTtcclxuICAgIHRoaXMucGF1c2UuYW5jaG9yLnNldCguNSk7XHJcbiAgICB0aGlzLnBhdXNlLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICB0aGlzLnBhdXNlLmV2ZW50cy5vbklucHV0VXAuYWRkKCgpID0+IHtcclxuICAgICAgdGhpcy5wYXVzZS5yb3RhdGlvbiA9IDA7XHJcbiAgICAgIGxldCB0d2VlbiA9IHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMucGF1c2UpXHJcbiAgICAgICAgLnRvKHtyb3RhdGlvbjogTWF0aC5QSSoyfSwgNTAwKVxyXG4gICAgICAgIC5zdGFydCgpO1xyXG5cclxuICAgICAgaWYoIXRoaXMuc3RhdGUuZ2FtZS5wYXVzZWQpIHtcclxuICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnN0YXRlLmdhbWUucGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHRoaXMuc3RhdGUuZ2FtZS5wYXVzZWQgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5hZGQodGhpcy5wYXVzZSk7XHJcbiAgfVxyXG4gIGFkZFNjb3JlKHYpIHtcclxuICAgIHRoaXMuc2NvcmUgKz0gdjtcclxuICAgIHRoaXMuc2NvcmVUZXh0LnRleHQgPSB0aGlzLnNjb3JlICsgJ3dheXMuJztcclxuICB9XHJcbiAgc2V0U2NvcmUodikge1xyXG4gICAgdGhpcy5zY29yZSA9IHY7XHJcbiAgICB0aGlzLnNjb3JlVGV4dC50ZXh0ID0gdGhpcy5zY29yZSArICd3YXlzLic7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFVJTWFuYWdlcjtcclxuIiwiY2xhc3MgV2luZG93TWFuYWdlciBleHRlbmRzIFBoYXNlci5Hcm91cCB7XHJcbiAgY29uc3RydWN0b3IobGV2ZWwpIHtcclxuICAgIHN1cGVyKGxldmVsLnN0YXRlKTtcclxuXHJcbiAgICB0aGlzLmxldmVsID0gbGV2ZWw7XHJcbiAgICB0aGlzLnN0YXRlID0gbGV2ZWwuc3RhdGU7XHJcblxyXG4gICAgdGhpcy5hbHBoYSA9IDA7XHJcbiAgICB0aGlzLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuYmcgPSB0aGlzLnN0YXRlLm1ha2UuZ3JhcGhpY3MoMCwgMCk7XHJcbiAgICB0aGlzLmJnLmJlZ2luRmlsbCgweEZGRkZGRik7XHJcbiAgICB0aGlzLmJnLmRyYXdSZWN0KDAsIDAsIHRoaXMuc3RhdGUuZ2FtZS53aWR0aCwgdGhpcy5zdGF0ZS5nYW1lLmhlaWdodCk7XHJcbiAgICB0aGlzLmJnLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICB0aGlzLmFkZCh0aGlzLmJnKTtcclxuXHJcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnN0YXRlLm1ha2UudGV4dCh0aGlzLnN0YXRlLmdhbWUud2lkdGgvMiwgdGhpcy5zdGF0ZS5nYW1lLmhlaWdodC8yLCBcIlwiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA1MCxcclxuICAgICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgICBmaWxsOiBcIiM1NTVkZmZcIixcclxuICAgICAgYWxpZ246ICdjZW50ZXInLFxyXG4gICAgICB3b3JkV3JhcDogdHJ1ZSxcclxuICAgICAgd29yZFdyYXBXaWR0aDogdGhpcy5zdGF0ZS5nYW1lLndpZHRoLTEwMFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmNvbnRlbnQuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgdGhpcy5hZGQodGhpcy5jb250ZW50KTtcclxuICB9XHJcbiAgYWRkV2luZG93KHRleHQsIGNiKSB7XHJcbiAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAudG8oe2FscGhhOiAxfSwgNTAwKVxyXG4gICAgICAuc3RhcnQoKTtcclxuICAgIHRoaXMuYmcuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmNvbnRlbnQudGV4dCA9IHRleHQ7XHJcblx0XHR0aGlzLmJnLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgICAgLnRvKHthbHBoYTogMH0sIDUwMClcclxuICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgdGhpcy5iZy5pbnB1dEVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgY2IgJiYgY2IoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjcmVhdGVCZyhzdGF0ZSwgc2l6ZT0xMDAsIGF4PTIwLCBheT0yMCkge1xyXG4gICAgbGV0IGJnID0gc3RhdGUuYWRkLmdyYXBoaWNzKCk7XHJcbiAgICBiZy5iZWdpbkZpbGwoMHhGRkZGRkYsIDEpO1xyXG4gICAgYmcuZHJhd1JlY3QoMCwgMCwgc3RhdGUuZ2FtZS53aWR0aCwgc3RhdGUuZ2FtZS5oZWlnaHQpO1xyXG4gICAgYmcuZW5kRmlsbCgpO1xyXG5cclxuICAgIGJnLmxpbmVTdHlsZSg0LCAweDJlMmU0NCwgLjEpO1xyXG5cclxuICAgIGZvcihsZXQgeCA9IDA7IHggPCBheDsgeCsrKSB7XHJcbiAgICAgIGJnLm1vdmVUbyhzaXplKngsIDApO1xyXG4gICAgICBiZy5saW5lVG8oc2l6ZSp4LCBzdGF0ZS5nYW1lLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgYXk7IHkrKykge1xyXG4gICAgICBiZy5tb3ZlVG8oMCwgc2l6ZSp5KTtcclxuICAgICAgYmcubGluZVRvKHN0YXRlLmdhbWUud2lkdGgsIHNpemUqeSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmc7XHJcbiAgfSxcclxuICBnb1RvKHN0YXRlLCBuYW1lLCBhcmdzKSB7XHJcbiAgICBzdGF0ZS5jYW1lcmEuZmFkZSgweEZGRkZGRik7XHJcbiAgICBzdGF0ZS5jYW1lcmEub25GYWRlQ29tcGxldGUuYWRkKCgpID0+IHtcclxuICAgICAgc3RhdGUuc3RhdGUuc3RhcnQobmFtZSwgdHJ1ZSwgZmFsc2UsIGFyZ3MpO1xyXG4gICAgICBzdGF0ZS5zdGF0ZS5nZXRDdXJyZW50U3RhdGUoKS5jYW1lcmEuZmxhc2goMHhGRkZGRkYsIDEwMDApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImNsYXNzIENlbGwgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcclxuICBjb25zdHJ1Y3RvcihtYW5hZ2VyLCB0eXBlLCB4LCB5KSB7XHJcbiAgICBzdXBlcihtYW5hZ2VyLmdhbWUsIDAsIDAsIHR5cGUuaW1nKTtcclxuXHJcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xyXG4gICAgdGhpcy5sZXZlbCA9IG1hbmFnZXIubGV2ZWw7XHJcbiAgICB0aGlzLnN0YXRlID0gbWFuYWdlci5zdGF0ZTtcblxuICAgIHRoaXMucGFkZGluZyA9IDEwO1xuICAgIHRoaXMuc2l6ZSA9IHRoaXMubWFuYWdlci5sZXZlbC5zaXplQ2VsbDtcclxuICAgIHRoaXMud2lkdGggPSB0aGlzLnNpemUtdGhpcy5wYWRkaW5nO1xyXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLnNpemUtdGhpcy5wYWRkaW5nO1xyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuXG4gICAgdGhpcy5yZVVzZUNlbGwoeCwgeSwgdHlwZSk7XHJcbiAgfVxuICByZVVzZUNlbGwoeCwgeSwgdHlwZSkge1xyXG4gICAgdGhpcy5sb2FkVGV4dHVyZSh0eXBlLmltZywgMCk7XHJcbiAgICB0aGlzLmNsaWNrQ291bnQgPSB0eXBlLmNsaWNrQ291bnQ7XHJcblxyXG4gICAgdGhpcy54ID0geCp0aGlzLnNpemUrdGhpcy5wYWRkaW5nLzIrdGhpcy53aWR0aC8yO1xyXG4gICAgdGhpcy55ID0gdGhpcy5sZXZlbC5sYXN0WS15KnRoaXMuc2l6ZSt0aGlzLmhlaWdodC8yO1xyXG4gICAgdGhpcy5pc09wZW4gPSB0eXBlLmlzT3BlbjtcclxuICAgIHRoaXMuaXNHb29kID0gdHlwZS5pc0dvb2Q7XHJcbiAgICB0aGlzLnNjb3JlID0gdHlwZS5zY29yZTtcclxuICAgIHRoaXMuaW5wdXRFbmFibGVkID0gZmFsc2U7XHJcblxyXG5cclxuICAgIGlmKHR5cGUuaXNDbGljaykge1xyXG4gICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuZXZlbnRzLm9uSW5wdXRVcC5hZGQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY2xpY2tDb3VudC0tO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLnNpemUtdGhpcy5wYWRkaW5nO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5zaXplLXRoaXMucGFkZGluZztcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7d2lkdGg6IHRoaXMud2lkdGgrMzAsIGhlaWdodDogdGhpcy5oZWlnaHQrMzB9LCAxMDApXHJcbiAgICAgICAgICAudG8oe3dpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0fSwgMTAwKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuY2xpY2tDb3VudCA9PT0gMCkge1xyXG4gICAgICAgICAgdGhpcy5sb2FkVGV4dHVyZSh0eXBlLmltZ0NsaWNrLCAwKTtcclxuICAgICAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsbDtcclxuIiwiY2xhc3MgRW50aXR5IGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUsIHgsIHksIHIsIGlzQXJjcywgc2NhbGU9MS41KSB7XHJcbiAgICBzdXBlcihzdGF0ZS5nYW1lLCB4LCB5LCAncGxheWVyJyk7XHJcbiAgICBcclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgIHRoaXMud2lkdGggPSByO1xyXG4gICAgdGhpcy5oZWlnaHQgPSByO1xyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuXHJcbiAgICB0aGlzLmFyY1NjYWxlID0gc2NhbGU7XHJcblxyXG4gICAgaWYoaXNBcmNzKSB7XHJcbiAgICAgIHRoaXMuY3JlYXRlQXJjKC0uOCwgLTEsIC45LCAxLCAweDM3M2ZmZik7XHJcbiAgICAgIHRoaXMuY3JlYXRlQXJjKC45LCAtLjgsIC0xLCAuOSwgMHhmZjM3MzcpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUFyYygtLjgsIC45LCAuOCwgLTEsIDB4NDI4NjNjKTtcclxuICAgICAgdGhpcy5jcmVhdGVBcmMoLjgsIC45LCAtLjgsIC0uOCwgMHg4MjQyYWEpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByYW5kID0gdGhpcy5zdGF0ZS5ybmQuYmV0d2VlbigzMDAsIDEwMDApO1xyXG4gICAgbGV0IHNjID0gdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbig1LCA0MCk7XHJcbiAgICB0aGlzLnR3ZWVuQnJlYXRoZSA9IHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7d2lkdGg6IHIrc2MsIGhlaWdodDogcitzY30sIHJhbmQpXHJcbiAgICAgIC50byh7d2lkdGg6IHIsIGhlaWdodDogcn0sIHJhbmQpXHJcbiAgICAgIC55b3lvKClcclxuICAgICAgLmxvb3AoKVxyXG4gICAgICAuc3RhcnQoKTtcclxuICB9XHJcbiAgY3JlYXRlQXJjKHN4LCBzeSwgZXgsIGV5LCB0aW50KSB7XHJcbiAgICBsZXQgYXJjID0gdGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSh0aGlzLndpZHRoKnN4L3RoaXMuYXJjU2NhbGUsIHRoaXMuaGVpZ2h0KnN5L3RoaXMuYXJjU2NhbGUsICdwbGF5ZXInKTtcclxuXHJcbiAgICBhcmMudGludCA9IHRpbnQ7XHJcbiAgICBhcmMud2lkdGggPSAzMDtcclxuICAgIGFyYy5oZWlnaHQgPSAzMDtcclxuICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKGFyYylcclxuICAgICAgLnRvKHt4OiB0aGlzLndpZHRoKmV4L3RoaXMuYXJjU2NhbGUsIHk6IHRoaXMuaGVpZ2h0KmV5L3RoaXMuYXJjU2NhbGUsIHdpZHRoOiAwLCBoZWlnaHQ6IDB9LCB0aGlzLnN0YXRlLnJuZC5iZXR3ZWVuKDUwMCwgMTAwMCkpXHJcbiAgICAgIC50byh7eDogdGhpcy53aWR0aCpzeC90aGlzLmFyY1NjYWxlLCB5OiB0aGlzLmhlaWdodCpzeS90aGlzLmFyY1NjYWxlfSwgdGhpcy5zdGF0ZS5ybmQuYmV0d2VlbigzMDAsIDYwMCkpXHJcbiAgICAgIC50byh7d2lkdGg6IDMwLCBoZWlnaHQ6IDMwfSwgdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbig1MDAsIDEwMDApKVxyXG4gICAgICAueW95bygpXHJcbiAgICAgIC5sb29wKClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmFkZENoaWxkKGFyYyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eTtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9FbnRpdHknKTtcclxuXG5jbGFzcyBJc2xhbmQgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcclxuICBjb25zdHJ1Y3RvcihsZXZlbCwgeCwgeSwgbHZsKSB7XHJcbiAgICBzdXBlcihsZXZlbC5zdGF0ZS5nYW1lLCB4LCB5LCAnaXNsYW5kJyk7XHJcbiAgICBsZXZlbC5zdGF0ZS5hZGQuZXhpc3RpbmcodGhpcyk7XHJcblxyXG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xyXG4gICAgdGhpcy5zdGF0ZSA9IGxldmVsLnN0YXRlO1xyXG5cclxuICAgIHRoaXMudGludCA9IGx2bC50aW50O1xyXG5cclxuICAgIHRoaXMuc2l6ZSA9IHRoaXMubGV2ZWwuc2l6ZUNlbGwqdGhpcy5sZXZlbC5hbXRYO1xyXG4gICAgdGhpcy53aWR0aCA9IHRoaXMuc2l6ZTtcclxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5zaXplO1xyXG5cclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSg0Mi0yMCwgMTUwLCAnZmxhZycpKTtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSgxMjAtMjAsIDI0MCwgJ2ZsYWcnKSk7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoNzUtMjAsIDQ2MCwgJ2ZsYWcnKSk7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoMjY1LTIwLCA1NjAsICdmbGFnJykpO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLnN0YXRlLm1ha2Uuc3ByaXRlKDQ0MCsxMDAsIDYxMCwgJ2ZsYWcnKSkuc2NhbGUueCAqPSAtMTtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSg1NzArMTAwLCA1MTUsICdmbGFnJykpLnNjYWxlLnggKj0gLTE7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoNjIwKzEwMCwgMjgwLCAnZmxhZycpKS5zY2FsZS54ICo9IC0xO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJc2xhbmQ7XHJcbiIsImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5Jyk7XHJcbmNvbnN0IHVpID0gcmVxdWlyZSgnLi4vbWl4aW5zL3VpJyk7XHJcblxyXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBFbnRpdHkge1xyXG4gIGNvbnN0cnVjdG9yKGxldmVsKSB7XHJcbiAgICBzdXBlcihsZXZlbC5zdGF0ZSwgbGV2ZWwuc3RhdGUuZ2FtZS53aWR0aC8yLCBsZXZlbC5zdGF0ZS5nYW1lLmhlaWdodC00MDAsIDcwLCB0cnVlKTtcclxuICAgIGxldmVsLnN0YXRlLmFkZC5leGlzdGluZyh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmxldmVsID0gbGV2ZWw7XHJcbiAgICB0aGlzLnN0YXRlID0gbGV2ZWwuc3RhdGU7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5waHlzaWNzLmFyY2FkZS5lbmFibGUodGhpcyk7XHJcbiAgICB0aGlzLmJvZHkuc2V0U2l6ZSh0aGlzLndpZHRoLzItMSwgdGhpcy5oZWlnaHQvMi0xLCAxLCAxKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLmNhbWVyYS5mb2xsb3codGhpcyk7XHJcblx0XHR0aGlzLnN0YXRlLmNhbWVyYS5kZWFkem9uZSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKHRoaXMueC10aGlzLndpZHRoLzIsIHRoaXMueS10aGlzLmhlaWdodC8yLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgdGhpcy5zcGVlZCA9IDEwMDtcclxuICAgIHRoaXMuY3VycmVudFRpbWUgPSAwO1xyXG4gICAgdGhpcy5sYXN0TW92ZTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLmlucHV0Lm9uRG93bi5hZGRPbmNlKCgpID0+IHtcclxuICAgICAgbGV0IHR3ZWVuID0gdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAudG8oe3k6IHRoaXMubGV2ZWwuaXNsYW5kLnkrdGhpcy5sZXZlbC5zaXplQ2VsbH0sIHRoaXMuc3BlZWQqMTApXHJcbiAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICB9LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIG1vdmUoKSB7XHJcbiAgICB0aGlzLnN0YXRlLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcywgdGhpcy5sZXZlbC5jZWxscywgKHBsLCBjZWxsKSA9PiB7XHJcbiAgICAgIGlmKCFjZWxsLnRvcFBhbmVsKSByZXR1cm47XHJcblxyXG4gICAgICBpZihjZWxsLmlzT3BlbikgdGhpcy5zdGF0ZS5VSU1hbmFnZXIuYWRkU2NvcmUoY2VsbC5zY29yZSk7XHJcblxyXG4gICAgICBpZihjZWxsLnRvcFBhbmVsICYmIGNlbGwudG9wUGFuZWwuaXNPcGVuICYmIGNlbGwudG9wUGFuZWwuaXNHb29kKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eTogY2VsbC50b3BQYW5lbC55fSwgTWF0aC5mbG9vcih0aGlzLnNwZWVkKSoyKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0TW92ZSA9ICd0b3AnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYodGhpcy5sYXN0TW92ZSAhPT0gJ2xlZnQnICYmIGNlbGwucmlnaHRQYW5lbCAmJiBjZWxsLnJpZ2h0UGFuZWwuaXNPcGVuICYmIGNlbGwucmlnaHRQYW5lbC5pc0dvb2QpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzKVxyXG4gICAgICAgICAgLnRvKHt4OiBjZWxsLnJpZ2h0UGFuZWwueH0sIE1hdGguZmxvb3IodGhpcy5zcGVlZCkqMilcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSAncmlnaHQnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYodGhpcy5sYXN0TW92ZSAhPT0gJ3JpZ2h0JyAmJiBjZWxsLmxlZnRQYW5lbCAmJiBjZWxsLmxlZnRQYW5lbC5pc09wZW4gJiYgY2VsbC5sZWZ0UGFuZWwuaXNHb29kKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eDogY2VsbC5sZWZ0UGFuZWwueH0sIE1hdGguZmxvb3IodGhpcy5zcGVlZCkqMilcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMubGFzdE1vdmUgPSAnbGVmdCc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IHR3ZWVuID0gdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7eTogY2VsbC50b3BQYW5lbC55LCBhbHBoYTogMCwgd2lkdGg6IDAsIGhlaWdodDogMH0sIE1hdGguZmxvb3IodGhpcy5zcGVlZCkqMilcclxuICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcclxuICAgICAgICAgIHVpLmdvVG8odGhpcy5zdGF0ZSwgJ01lbnUnLCAgdGhpcy5zdGF0ZS5VSU1hbmFnZXIuc2NvcmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgdXBkYXRlKCkge1xyXG4gICAgdGhpcy5yb3RhdGlvbiArPSAuMDE7XHJcbiAgICB0aGlzLmN1cnJlbnRUaW1lKys7XHJcblxyXG4gICAgaWYodGhpcy5jdXJyZW50VGltZSA+IHRoaXMuc3BlZWQpIHtcclxuICAgICAgdGhpcy5tb3ZlKCk7XHJcbiAgICAgIHRoaXMuY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICBpZih0aGlzLnNwZWVkID4gMjAwKSB0aGlzLnNwZWVkIC09IC4xO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XHJcbiIsImNsYXNzIEJvb3Qge1xyXG5cdGluaXQoKSB7XHJcblx0fVxyXG5cclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XHJcblx0XHR0aGlzLnNjYWxlLmZ1bGxTY3JlZW5TY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLkVYQUNUX0ZJVDtcclxuXHRcdHRoaXMuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcclxuXHRcdHRoaXMuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWU7XHJcblx0XHR0aGlzLnNjYWxlLnNldE1heGltdW0oKTtcclxuXHJcblx0XHR0aGlzLnN0YXRlLnN0YXJ0KCdQcmVsb2FkJyk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJvb3Q7XHJcbiIsImNvbnN0IHVpID0gcmVxdWlyZSgnLi4vbWl4aW5zL3VpJyk7XHJcbmNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4uL29iamVjdHMvRW50aXR5Jyk7XHJcblxyXG5jbGFzcyBNZW51IHtcclxuXHRpbml0KHNjb3JlID0gMCkge1xyXG5cdFx0aWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzY29yZVwiKSA8IHNjb3JlIHx8ICFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNjb3JlXCIpKVxyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNjb3JlXCIsIHNjb3JlKTtcclxuXHJcblx0XHR0aGlzLmJnID0gdWkuY3JlYXRlQmcodGhpcywgdGhpcy5nYW1lLndpZHRoLzUsIDUsIDEwKTtcclxuXHJcblx0XHQvLyB0aGlzLmNvbG9yc0Nsb3VkcyA9IHRoaXMuYWRkLnNwcml0ZSgwLCAwLCAnY29sb3JzLWNsb3VkcycpO1xyXG5cdFx0Ly8gdGhpcy5hZGQudHdlZW4odGhpcy5jb2xvcnNDbG91ZHMpXHJcblx0XHQvLyBcdC50byh7aGVpZ2h0OiB0aGlzLmNvbG9yc0Nsb3Vkcy5oZWlnaHQrMTUwfSwgNDAwMClcclxuXHRcdC8vIFx0LnRvKHtoZWlnaHQ6IHRoaXMuY29sb3JzQ2xvdWRzLmhlaWdodH0sIDQwMDApXHJcblx0XHQvLyBcdC55b3lvKClcclxuXHRcdC8vIFx0Lmxvb3AoKVxyXG5cdFx0Ly8gXHQuc3RhcnQoKTtcclxuXHRcdC8vXHJcblx0XHQvLyB0aGlzLmdyYXlDbG91ZHMgPSB0aGlzLmFkZC5zcHJpdGUoMCwgdGhpcy5nYW1lLmhlaWdodCwgJ2dyYXktY2xvdWRzJyk7XHJcblx0XHQvLyB0aGlzLmdyYXlDbG91ZHMuYW5jaG9yLnNldCgwLCAxKTtcclxuXHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMuZ3JheUNsb3VkcylcclxuXHRcdC8vIFx0LnRvKHtoZWlnaHQ6IHRoaXMuZ3JheUNsb3Vkcy5oZWlnaHQrMTAwfSwgMzAwMClcclxuXHRcdC8vIFx0LnRvKHtoZWlnaHQ6IHRoaXMuZ3JheUNsb3Vkcy5oZWlnaHR9LCAzMDAwKVxyXG5cdFx0Ly8gXHQueW95bygpXHJcblx0XHQvLyBcdC5sb29wKClcclxuXHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHQvL1xyXG5cdFx0Ly9cclxuXHRcdC8vIHRoaXMucGFydEdyYXlDbG91ZCA9IHRoaXMuYWRkLnNwcml0ZSgwLCA0MjUsICdwYXJ0LWdyYXktY2xvdWQnKTtcclxuXHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydEdyYXlDbG91ZClcclxuXHRcdC8vIFx0LnRvKHt5OiB0aGlzLnBhcnRHcmF5Q2xvdWQueSs2MH0sIDUwMDApXHJcblx0XHQvLyBcdC50byh7eTogdGhpcy5wYXJ0R3JheUNsb3VkLnl9LCA1MDAwKVxyXG5cdFx0Ly8gXHQueW95bygpXHJcblx0XHQvLyBcdC5sb29wKClcclxuXHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gdGhpcy5wYXJ0Q29sb3JzQ2xvdWQxID0gdGhpcy5hZGQuc3ByaXRlKDYyLCA3NjAsICdwYXJ0LWNvbG9ycy1jbG91ZCcpO1xyXG5cdFx0Ly8gdGhpcy5hZGQudHdlZW4odGhpcy5wYXJ0Q29sb3JzQ2xvdWQxKVxyXG5cdFx0Ly8gXHQudG8oe3k6IHRoaXMucGFydENvbG9yc0Nsb3VkMS55KzgwfSwgNDAwMClcclxuXHRcdC8vIFx0LnRvKHt5OiB0aGlzLnBhcnRDb2xvcnNDbG91ZDEueX0sIDQwMDApXHJcblx0XHQvLyBcdC55b3lvKClcclxuXHRcdC8vIFx0Lmxvb3AoKVxyXG5cdFx0Ly8gXHQuc3RhcnQoKTtcclxuXHRcdC8vXHJcblx0XHQvLyB0aGlzLnBhcnRDb2xvcnNDbG91ZDIgPSB0aGlzLmFkZC5zcHJpdGUoNDcwLCA2ODAsICdwYXJ0LWNvbG9ycy1jbG91ZCcpO1xyXG5cdFx0Ly8gdGhpcy5hZGQudHdlZW4odGhpcy5wYXJ0Q29sb3JzQ2xvdWQyKVxyXG5cdFx0Ly8gXHQudG8oe3k6IHRoaXMucGFydENvbG9yc0Nsb3VkMi55KzcwfSwgMzAwMClcclxuXHRcdC8vIFx0LnRvKHt5OiB0aGlzLnBhcnRDb2xvcnNDbG91ZDIueX0sIDMwMDApXHJcblx0XHQvLyBcdC55b3lvKClcclxuXHRcdC8vIFx0Lmxvb3AoKVxyXG5cdFx0Ly8gXHQuc3RhcnQoKTtcclxuXHJcblx0XHR0aGlzLnBsYXkgPSB0aGlzLmFkZC5zcHJpdGUodGhpcy5nYW1lLndpZHRoLzIsIDU1MCwgJ3BsYXknKTtcclxuXHRcdHRoaXMucGxheS5hbmNob3Iuc2V0KC41KTtcclxuXHRcdHRoaXMucGxheS5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5wbGF5LmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcblx0XHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMuZ3JheUNsb3VkcylcclxuXHRcdFx0Ly8gXHQudG8oe3k6IHRoaXMuZ2FtZS5oZWlnaHQrMTUwMH0sIDUwMClcclxuXHRcdFx0Ly8gXHQuc3RhcnQoKTtcclxuXHRcdFx0Ly9cclxuXHRcdFx0Ly8gdGhpcy5hZGQudHdlZW4odGhpcy5wYXJ0Q29sb3JzQ2xvdWQxKVxyXG5cdFx0XHQvLyBcdC50byh7eTogdGhpcy5nYW1lLmhlaWdodCsxMDAwfSwgMTAwMClcclxuXHRcdFx0Ly8gXHQuc3RhcnQoKTtcclxuXHRcdFx0Ly9cclxuXHRcdFx0Ly8gdGhpcy5hZGQudHdlZW4odGhpcy5wYXJ0Q29sb3JzQ2xvdWQyKVxyXG5cdFx0XHQvLyBcdC50byh7eTogdGhpcy5nYW1lLmhlaWdodCsxMDAwfSwgMTAwMClcclxuXHRcdFx0Ly8gXHQuc3RhcnQoKTtcclxuXHRcdFx0Ly9cclxuXHRcdFx0Ly8gdGhpcy5hZGQudHdlZW4odGhpcy5wYXJ0R3JheUNsb3VkKVxyXG5cdFx0XHQvLyBcdC50byh7eTogLTEwMDB9LCAxMDAwKVxyXG5cdFx0XHQvLyBcdC5zdGFydCgpO1xyXG5cdFx0XHQvL1xyXG5cdFx0XHRsZXQgdHdlZW4gPSB0aGlzLmFkZC50d2Vlbih0aGlzLnBsYXkpXHJcblx0XHRcdFx0LnRvKHtyb3RhdGlvbjogTWF0aC5QSS8yfSwgMTAwKVxyXG5cdFx0XHRcdC50byh7d2lkdGg6IHRoaXMucGxheS53aWR0aCsyMCwgaGVpZ2h0OiB0aGlzLnBsYXkuaGVpZ2h0KzIwfSwgMTAwKVxyXG5cdFx0XHRcdC5zdGFydCgpO1xyXG5cclxuXHRcdFx0dHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xyXG5cdFx0XHRcdHVpLmdvVG8odGhpcywgJ1BsYXlncm91bmQnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmFkZC5zcHJpdGUodGhpcy5nYW1lLndpZHRoLzIsIDc3MCwgJ3N0YXInKS5hbmNob3Iuc2V0KC41KTtcclxuXHRcdHRoaXMuc2V0dGluZ3MgPSB0aGlzLmFkZC5zcHJpdGUodGhpcy5nYW1lLndpZHRoLzIsIDEwMDAsICdzZXR0aW5ncycpO1xyXG5cdFx0dGhpcy5zZXR0aW5ncy5hbmNob3Iuc2V0KC41KTtcclxuXHRcdHRoaXMuc2V0dGluZ3MuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMuc2V0dGluZ3MuZXZlbnRzLm9uSW5wdXRVcC5hZGRPbmNlKCgpID0+IHtcclxuXHRcdFx0bGV0IHR3ZWVuID0gdGhpcy5hZGQudHdlZW4odGhpcy5zZXR0aW5ncylcclxuXHRcdFx0XHQudG8oe3JvdGF0aW9uOiBNYXRoLlBJLzJ9LCAxMDApXHJcblx0XHRcdFx0LnRvKHt3aWR0aDogdGhpcy5zZXR0aW5ncy53aWR0aCsyMCwgaGVpZ2h0OiB0aGlzLnNldHRpbmdzLmhlaWdodCsyMH0sIDEwMClcclxuXHRcdFx0XHQuc3RhcnQoKTtcclxuXHJcblx0XHRcdHR3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcclxuXHRcdFx0XHR1aS5nb1RvKHRoaXMsICdTZXR0aW5ncycpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuICAgIHRoaXMubGFiZWwgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAxNDAsIFwiTW90dGlvblwiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiAxMDAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDEwMCxcclxuXHRcdFx0Zm9udFdlaWdodDogNjAwLFxyXG4gICAgICBmaWxsOiBcIiM1NTVkZmZcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmxhYmVsLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICB0aGlzLnRleHQgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAyMzAsIFwiU2VucyBpbiB0aGUgd2F5XCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDYwLFxyXG4gICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMudGV4dC5hbmNob3Iuc2V0KDAuNSk7XHJcblx0XHQvL1xyXG5cdFx0dGhpcy5zY29yZXMgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAzNTAsIHNjb3JlICsgJyB8ICcgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2NvcmUnKSwge1xyXG4gICAgICBmb250OiAnUm9ib3RvJyxcclxuICAgICAgZm9udFNpemU6IDYyLFxyXG4gICAgICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2NvcmVzLmFuY2hvci5zZXQoMC41KTtcclxuXHR9XHJcblx0dXBkYXRlKCkge1xyXG5cdFx0Ly8gdGhpcy5idG4ucm90YXRpb24gKz0gLjAyO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51O1xyXG4iLCJjb25zdCBDbG91ZHNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvQ2xvdWRzTWFuYWdlcicpO1xyXG5jb25zdCBVSU1hbmFnZXIgPSByZXF1aXJlKCcuLi9tYW5hZ2Vycy9VSU1hbmFnZXInKTtcclxuY29uc3QgTGV2ZWxNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvTGV2ZWxNYW5hZ2VyJyk7XHJcblxyXG5jb25zdCBsZXZlbHMgPSByZXF1aXJlKCcuLi9sZXZlbHMuanNvbicpO1xyXG5jb25zdCB0eXBlcyA9IHJlcXVpcmUoJy4uL3R5cGVzLmpzb24nKTtcclxuXHJcbmNsYXNzIFBsYXlncm91bmQge1xyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdHRoaXMud29ybGQuc2V0Qm91bmRzKDAsIC10aGlzLmdhbWUuaGVpZ2h0KjEwMDAsIHRoaXMuZ2FtZS53aWR0aCwgdGhpcy5nYW1lLmhlaWdodCoyMDAwKTtcclxuXHRcdHRoaXMucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BcmNhZGUpO1xyXG5cclxuXHJcblx0XHR0aGlzLmJnID0gdGhpcy5hZGQuc3ByaXRlKDAsIDAsICdiZycpO1xyXG5cdFx0dGhpcy5iZy53aWR0aCA9IHRoaXMuZ2FtZS53aWR0aDtcclxuXHRcdHRoaXMuYmcuaGVpZ2h0ID0gdGhpcy5nYW1lLmhlaWdodDtcclxuXHRcdHRoaXMuYmcuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5jbG91ZHNNYW5hZ2VyID0gbmV3IENsb3Vkc01hbmFnZXIodGhpcyk7XHJcblx0XHR0aGlzLmxldmVsTWFuYWdlciA9IG5ldyBMZXZlbE1hbmFnZXIodGhpcywgbGV2ZWxzLCB0eXBlcyk7XHJcblx0XHR0aGlzLlVJTWFuYWdlciA9IG5ldyBVSU1hbmFnZXIodGhpcyk7XHJcblx0fVxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdHRoaXMuY2xvdWRzTWFuYWdlci51cGRhdGUoKTtcclxuICAgIHRoaXMubGV2ZWxNYW5hZ2VyLnVwZGF0ZSgpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5Z3JvdW5kO1xyXG4iLCJjbGFzcyBQcmVsb2FkIHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHRwcmVsb2FkKCkge1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdiZycsICdhc3NldHMvYmcucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3BsYXllcicsICdhc3NldHMvcGxheWVyLnBuZycpO1xyXG5cclxuXHRcdC8vIGNlbGxzXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwxJywgJ2Fzc2V0cy9jZWxscy9jZWxsMS5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbDInLCAnYXNzZXRzL2NlbGxzL2NlbGwyLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsMycsICdhc3NldHMvY2VsbHMvY2VsbDMucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGw0JywgJ2Fzc2V0cy9jZWxscy9jZWxsNC5wbmcnKTtcclxuXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwxLWZpbGwnLCAnYXNzZXRzL2NlbGxzL2NlbGwxLWZpbGwucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGw0LWZpbGwnLCAnYXNzZXRzL2NlbGxzL2NlbGw0LWZpbGwucG5nJyk7XHJcblxyXG5cdFx0Ly8gaXNsYW5kXHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2lzbGFuZCcsICdhc3NldHMvaXNsYW5kL2lzbGFuZC5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnZmxhZycsICdhc3NldHMvaXNsYW5kL2ZsYWcucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2Nsb3VkJywgJ2Fzc2V0cy9pc2xhbmQvY2xvdWQucG5nJyk7XHJcblxyXG5cdFx0Ly8gdWlcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGxheScsICdhc3NldHMvdWkvcGxheS5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnc2V0dGluZ3MnLCAnYXNzZXRzL3VpL3NldHRpbmdzLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdzdGFyJywgJ2Fzc2V0cy91aS9zdGFyLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCd0aW1lJywgJ2Fzc2V0cy91aS90aW1lLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwbGFuZScsICdhc3NldHMvdWkvcGxhbmUucG5nJyk7XHJcblxyXG5cdFx0Ly8gbWVudVxyXG5cdFx0Ly8gdGhpcy5sb2FkLmltYWdlKCdncmF5LWNsb3VkcycsICdhc3NldHMvbWVudS9ncmF5Y2xvdWRzLnBuZycpO1xyXG5cdFx0Ly8gdGhpcy5sb2FkLmltYWdlKCdjb2xvcnMtY2xvdWRzJywgJ2Fzc2V0cy9tZW51L2NvbG9yc2Nsb3Vkcy5wbmcnKTtcclxuXHRcdC8vIHRoaXMubG9hZC5pbWFnZSgncGFydC1ncmF5LWNsb3VkJywgJ2Fzc2V0cy9tZW51L3BhcnRncmF5Y2xvdWQucG5nJyk7XHJcblx0XHQvLyB0aGlzLmxvYWQuaW1hZ2UoJ3BhcnQtY29sb3JzLWNsb3VkJywgJ2Fzc2V0cy9tZW51L3BhcnRjb2xvcnNjbG91ZC5wbmcnKTtcclxuXHJcblx0XHQvLyBtdXNpY1xyXG5cdFx0dGhpcy5sb2FkLmF1ZGlvKCdtdXNpYycsICdhc3NldHMvbXVzaWMvYmVuc291bmQtYW5ld2JlZ2lubmluZy5tcDMnKTtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdGxldCBtdXNpYyA9IHRoaXMuYWRkLmF1ZGlvKCdtdXNpYycpO1xyXG5cdFx0bXVzaWMubG9vcEZ1bGwoMC42KTtcclxuXHJcblx0XHR0aGlzLnN0YXRlLnN0YXJ0KCdNZW51Jyk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWQ7XHJcbiIsImNvbnN0IHVpID0gcmVxdWlyZSgnLi4vbWl4aW5zL3VpJyk7XHJcblxyXG5jbGFzcyBTZXR0aW5ncyB7XHJcblx0aW5pdCgpIHtcclxuXHRcdHRoaXMuYmcgPSB1aS5jcmVhdGVCZyh0aGlzLCB0aGlzLmdhbWUud2lkdGgvNSwgNSwgMTApO1xyXG5cclxuICAgIHRoaXMubGFiZWwgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAxNDAsIFwiU2V0dGluZ3NcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogMTAwLFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcblx0XHRcdGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG5cclxuICAgIHRoaXMuc291bmRzID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgNTUwLCBcIlNvdW5kcyB8IE9OXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDYwLFxyXG4gICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc291bmRzLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICB0aGlzLm11c2ljID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgNjUwLCBcIk11c2ljIHwgT0ZGXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDYwLFxyXG4gICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMubXVzaWMuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuICAgIHRoaXMuYmFjayA9IHRoaXMuYWRkLnRleHQoMTUwLCB0aGlzLmdhbWUuaGVpZ2h0LTgwLCBcIkJhY2tcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogODAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5iYWNrLmFuY2hvci5zZXQoMC41KTtcclxuICAgIHRoaXMuYmFjay5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5iYWNrLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgIHVpLmdvVG8odGhpcywgJ01lbnUnKTtcclxuICAgIH0pO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcclxuIiwibW9kdWxlLmV4cG9ydHM9W1xyXG4gIHtcclxuICAgIFwiaWRcIjogMCxcclxuICAgIFwiaW1nXCI6IFwiY2VsbDFcIixcclxuICAgIFwiY2hhbmNlXCI6IDEwMCxcclxuICAgIFwiaW1nQ2xpY2tcIjogXCJjZWxsMS1maWxsXCIsXHJcbiAgICBcImlzT3BlblwiOiBmYWxzZSxcclxuICAgIFwiY2xpY2tDb3VudFwiOiAxLFxyXG4gICAgXCJpc0NsaWNrXCI6IHRydWUsXHJcbiAgICBcInNjb3JlXCI6IDEsXHJcbiAgICBcImlzR29vZFwiOiB0cnVlXHJcbiAgfSxcclxuICB7XHJcbiAgICBcImlkXCI6IDEsXHJcbiAgICBcImNoYW5jZVwiOiAyMCxcclxuICAgIFwiaW1nXCI6IFwiY2VsbDJcIixcclxuICAgIFwiaXNPcGVuXCI6IGZhbHNlLFxyXG4gICAgXCJpc0NsaWNrXCI6IGZhbHNlLFxyXG4gICAgXCJzY29yZVwiOiAwLFxyXG4gICAgXCJpc0dvb2RcIjogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIFwiaWRcIjogMixcclxuICAgIFwiY2hhbmNlXCI6IDUsXHJcbiAgICBcImltZ1wiOiBcImNlbGwzXCIsXHJcbiAgICBcImlzT3BlblwiOiB0cnVlLFxyXG4gICAgXCJpc0NsaWNrXCI6IGZhbHNlLFxyXG4gICAgXCJzY29yZVwiOiAxMCxcclxuICAgIFwiaXNHb29kXCI6IHRydWVcclxuICB9LFxyXG4gIHtcclxuICAgIFwiaWRcIjogMyxcclxuICAgIFwiaW1nXCI6IFwiY2VsbDRcIixcclxuICAgIFwiY2hhbmNlXCI6IDMwLFxyXG4gICAgXCJpbWdDbGlja1wiOiBcImNlbGw0LWZpbGxcIixcclxuICAgIFwiaXNPcGVuXCI6IGZhbHNlLFxyXG4gICAgXCJpc0NsaWNrXCI6IHRydWUsXHJcbiAgICBcImNsaWNrQ291bnRcIjogMixcclxuICAgIFwic2NvcmVcIjogNSxcclxuICAgIFwiaXNHb29kXCI6IHRydWVcclxuICB9XHJcbl1cclxuIl19
