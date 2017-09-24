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
    "totalCells": 5,
    "amtCells": 2,
    "dir": "top",
    "idCells": [0, 1],
    "tint": 0xff0000,
    "text": "Thlen follows you. \n Digress and he will swallow you ... \n But do not despair, because music is always with you.",
    "text_ru": "Тлен идет за тобой по пятам. \n Отступись и он тебя поглатит... \n Но не стоит отчаиваться, ведь музыка всегда с тобой."
  },
  {
    "totalCells": 5,
    "amtCells": 3,
    "dir": "top",
    "idCells": [0, 1, 2],
    "tint": 0xFFFFFF,
    "text": "Тлен не щадит никого. Летучие змеи падут на землю и погрузятся в рутину бытия..."
  },
  {
    "totalCells": 5,
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
    this.lastY = 0;
    this.last = [];
    this.createCells(this.level.startCountCells);
  }
  createCells(amtGenY) {
    let arr = [];
    this.level.totalCells -= amtGenY;

    // генерируем ячейки
    for(let y = this.lastY; y < this.lastY+amtGenY; y++) {
      this.level.lastY -= this.level.sizeCell;

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
        if(this.level.totalCells > 0) {
          !isHide && this.createCells(1);
          isHide = true;
        }
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
    this.startCountCells = Math.floor(this.state.game.height/this.sizeCell)+2;

    // костыль, который сортирует данные о типах по шансу (по убыванию) и отсекает типы, которых нет на уровне.
    this.dataCells = this.typesCells.slice().sort((a, b) => a.chance - b.chance);

    this.createIsland(lvl);
    this.window.addWindow(lvl.text, () => this.createCells(lvl));
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
    if(this.totalCells <= 0) {
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

    this.content = this.state.make.text(this.state.game.width/2, this.state.game.height/4, "", {
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

    this.state.UIManager.visible = false;

    this.content.text = text;
		this.bg.events.onInputUp.addOnce(() => {
      this.state.add.tween(this)
        .to({alpha: 0}, 500)
        .start();
        this.state.UIManager.visible = true;

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
    this.y = this.level.lastY+this.height/2;
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
    super(level.state.game, x+10, y+10, 'island');
    level.state.add.existing(this);

    this.level = level;
    this.state = level.state;

    this.tint = lvl.tint;

    this.size = this.state.game.width-20;
    this.width = this.size;
    this.height = this.size;

    this.addChild(this.state.make.sprite(50, 50, 'flag')).scale.set(.5, .5);
    this.addChild(this.state.make.sprite(280, 120, 'flag')).scale.set(-.5, .5);
    this.addChild(this.state.make.sprite(45, 75+50, 'flag')).scale.set(.5, .5);
    this.addChild(this.state.make.sprite(300, 60, 'flag')).scale.set(-.5, .5);
    // this.addChild(this.state.make.sprite(440-400, 10, 'flag')).scale.set(-.5, .5);
    // this.addChild(this.state.make.sprite(570-400, 160, 'flag')).scale.set(-.5, .5);
    // this.addChild(this.state.make.sprite(620-400, 140, 'flag')).scale.set(-.5, .5);
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

    this.speed = 1000;
    this.lastMove;

    this.timer = this.state.time.create(false);
    this.timer.loop(this.speed, this.move, this);
    this.timer.start();

    this.state.add.tween(this)
      .to({y: this.y-150}, this.speed)
      .start();
    this.state.input.onDown.addOnce(this.moveNextIsland, this);
  }

  move() {
    this.state.physics.arcade.overlap(this, this.level.cells, (pl, cell) => {
      if(!cell.topPanel) return this.moveNextIsland();
      if(cell.isOpen) this.state.UIManager.addScore(cell.score);

      if(cell.topPanel && cell.topPanel.isOpen && cell.topPanel.isGood) this.moveUp(cell);
      else if(this.lastMove !== 'left' && cell.rightPanel && cell.rightPanel.isOpen && cell.rightPanel.isGood) this.moveRight(cell);
      else if(this.lastMove !== 'right' && cell.leftPanel && cell.leftPanel.isOpen && cell.leftPanel.isGood) this.moveLeft(cell);
      else this.dead(cell);
    });
  }
  moveNextIsland() {
    this.state.add.tween(this)
      .to({y: this.level.island.y-this.level.sizeCell/2}, this.speed*3)
      .start();
  }
  moveUp(cell) {
    this.state.add.tween(this)
      .to({y: cell.topPanel.y}, this.speed)
      .start();
    this.lastMove = 'top';
  }
  moveLeft(cell) {
    this.state.add.tween(this)
      .to({x: cell.leftPanel.x}, this.speed)
      .start();
    this.lastMove = 'left';
  }
  moveRight(cell) {
    this.state.add.tween(this)
      .to({x: cell.rightPanel.x}, this.speed)
      .start();
    this.lastMove = 'right';
  }
  dead(cell) {
    let tween = this.state.add.tween(this)
      .to({y: cell.topPanel.y, alpha: 0, width: 0, height: 0}, this.speed)
      .start();
    tween.onComplete.add(() => {
      ui.goTo(this.state, 'Menu',  this.state.UIManager.score);
    });
  }
  update() {
    this.rotation += .01;
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
		this.UIManager = new UIManager(this);
		this.levelManager = new LevelManager(this, levels, types);

		this.grayscale = this.add.image(0, this.game.height-500, 'grayscale');
		this.grayscale.fixedToCamera = true;
		this.grayscale.alpha = .9;
		this.grayscale.width = this.game.width;
		this.grayscale.height = 700;
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
		this.load.image('grayscale', 'assets/grayscale.png');
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
		this.load.image('island', 'assets/island/island2.png');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXpiYW5nXFxEZXNrdG9wXFxtb3R0aW9uXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL2xldmVscy5qc29uIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvQ2VsbHNNYW5hZ2VyLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvbWFuYWdlcnMvQ2xvdWRzTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL0xldmVsTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL1VJTWFuYWdlci5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL21hbmFnZXJzL1dpbmRvd01hbmFnZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9taXhpbnMvdWkuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9vYmplY3RzL0NlbGwuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9vYmplY3RzL0VudGl0eS5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL29iamVjdHMvSXNsYW5kLmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvb2JqZWN0cy9QbGF5ZXIuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvQm9vdC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9NZW51LmpzIiwiQzovVXNlcnMvYXpiYW5nL0Rlc2t0b3AvbW90dGlvbi9zcmMvc3RhdGVzL1BsYXlncm91bmQuanMiLCJDOi9Vc2Vycy9hemJhbmcvRGVza3RvcC9tb3R0aW9uL3NyYy9zdGF0ZXMvUHJlbG9hZC5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3N0YXRlcy9TZXR0aW5ncy5qcyIsIkM6L1VzZXJzL2F6YmFuZy9EZXNrdG9wL21vdHRpb24vc3JjL3R5cGVzLmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBCb290ID0gcmVxdWlyZSgnLi9zdGF0ZXMvQm9vdC5qcycpO1xyXG5jb25zdCBQcmVsb2FkID0gcmVxdWlyZSgnLi9zdGF0ZXMvUHJlbG9hZC5qcycpO1xyXG5jb25zdCBNZW51ID0gcmVxdWlyZSgnLi9zdGF0ZXMvTWVudS5qcycpO1xyXG5jb25zdCBQbGF5Z3JvdW5kID0gcmVxdWlyZSgnLi9zdGF0ZXMvUGxheWdyb3VuZC5qcycpO1xyXG5jb25zdCBTZXR0aW5ncyA9IHJlcXVpcmUoJy4vc3RhdGVzL1NldHRpbmdzLmpzJyk7XHJcblxyXG52YXIgcmVhZHkgPSAoKSA9PiB7XHJcblx0dmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoNzIwLCAxMjgwLCBQaGFzZXIuQVVUTywgJ01vdHRpb24nKTtcclxuXHJcblx0Z2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCBCb290LCB0cnVlKTtcclxuICBnYW1lLnN0YXRlLmFkZCgnUHJlbG9hZCcsIFByZWxvYWQpO1xyXG4gIGdhbWUuc3RhdGUuYWRkKCdNZW51JywgTWVudSk7XHJcblx0Z2FtZS5zdGF0ZS5hZGQoJ1NldHRpbmdzJywgU2V0dGluZ3MpO1xyXG5cdGdhbWUuc3RhdGUuYWRkKCdQbGF5Z3JvdW5kJywgUGxheWdyb3VuZCk7XHJcbn1cclxuXHJcbnJlYWR5KCk7XHJcbiIsIm1vZHVsZS5leHBvcnRzPVtcclxuICB7XHJcbiAgICBcInRvdGFsQ2VsbHNcIjogNSxcclxuICAgIFwiYW10Q2VsbHNcIjogMixcclxuICAgIFwiZGlyXCI6IFwidG9wXCIsXHJcbiAgICBcImlkQ2VsbHNcIjogWzAsIDFdLFxyXG4gICAgXCJ0aW50XCI6IDB4ZmYwMDAwLFxyXG4gICAgXCJ0ZXh0XCI6IFwiVGhsZW4gZm9sbG93cyB5b3UuIFxcbiBEaWdyZXNzIGFuZCBoZSB3aWxsIHN3YWxsb3cgeW91IC4uLiBcXG4gQnV0IGRvIG5vdCBkZXNwYWlyLCBiZWNhdXNlIG11c2ljIGlzIGFsd2F5cyB3aXRoIHlvdS5cIixcclxuICAgIFwidGV4dF9ydVwiOiBcItCi0LvQtdC9INC40LTQtdGCINC30LAg0YLQvtCx0L7QuSDQv9C+INC/0Y/RgtCw0LwuIFxcbiDQntGC0YHRgtGD0L/QuNGB0Ywg0Lgg0L7QvSDRgtC10LHRjyDQv9C+0LPQu9Cw0YLQuNGCLi4uIFxcbiDQndC+INC90LUg0YHRgtC+0LjRgiDQvtGC0YfQsNC40LLQsNGC0YzRgdGPLCDQstC10LTRjCDQvNGD0LfRi9C60LAg0LLRgdC10LPQtNCwINGBINGC0L7QsdC+0LkuXCJcclxuICB9LFxyXG4gIHtcclxuICAgIFwidG90YWxDZWxsc1wiOiA1LFxyXG4gICAgXCJhbXRDZWxsc1wiOiAzLFxyXG4gICAgXCJkaXJcIjogXCJ0b3BcIixcclxuICAgIFwiaWRDZWxsc1wiOiBbMCwgMSwgMl0sXHJcbiAgICBcInRpbnRcIjogMHhGRkZGRkYsXHJcbiAgICBcInRleHRcIjogXCLQotC70LXQvSDQvdC1INGJ0LDQtNC40YIg0L3QuNC60L7Qs9C+LiDQm9C10YLRg9GH0LjQtSDQt9C80LXQuCDQv9Cw0LTRg9GCINC90LAg0LfQtdC80LvRjiDQuCDQv9C+0LPRgNGD0LfRj9GC0YHRjyDQsiDRgNGD0YLQuNC90YMg0LHRi9GC0LjRjy4uLlwiXHJcbiAgfSxcclxuICB7XHJcbiAgICBcInRvdGFsQ2VsbHNcIjogNSxcclxuICAgIFwiYW10Q2VsbHNcIjogNCxcclxuICAgIFwiZGlyXCI6IFwidG9wXCIsXHJcbiAgICBcImlkQ2VsbHNcIjogWzAsIDEsIDIsIDNdLFxyXG4gICAgXCJ0aW50XCI6IDB4ZmYwMDAwLFxyXG4gICAgXCJ0ZXh0XCI6IFwi0Jgg0YLQvtCz0LTQsCDQvtC9INC/0L7QvdC10YEg0YHQstC10YfRgyDRh9C10YDQtdC3INGH0YPQttC40LUg0LfQtdC80LvQuCDQvtGB0LLQvtCx0L7QttC00LDRjyDQu9C10YLRg9GH0LjRhSDQt9C80LXQuSDQuCDRgdCy0L7QuSDQvdCw0YDQvtC0Li4uXCJcclxuICB9XHJcbl1cclxuIiwiY29uc3QgQ2VsbCA9IHJlcXVpcmUoJy4uL29iamVjdHMvQ2VsbCcpO1xyXG5cclxuY2xhc3MgQ2VsbHNNYW5hZ2VyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICBjb25zdHJ1Y3RvcihsZXZlbCkge1xyXG4gICAgc3VwZXIobGV2ZWwuc3RhdGUuZ2FtZSk7XHJcblxyXG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xyXG4gICAgdGhpcy5zdGF0ZSA9IGxldmVsLnN0YXRlO1xyXG4gICAgdGhpcy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuXHJcblxyXG4gIH1cclxuICBzdGFydEdlbihsdmwpIHtcclxuICAgIHRoaXMubGFzdFkgPSAwO1xyXG4gICAgdGhpcy5sYXN0ID0gW107XHJcbiAgICB0aGlzLmNyZWF0ZUNlbGxzKHRoaXMubGV2ZWwuc3RhcnRDb3VudENlbGxzKTtcclxuICB9XHJcbiAgY3JlYXRlQ2VsbHMoYW10R2VuWSkge1xyXG4gICAgbGV0IGFyciA9IFtdO1xyXG4gICAgdGhpcy5sZXZlbC50b3RhbENlbGxzIC09IGFtdEdlblk7XHJcblxyXG4gICAgLy8g0LPQtdC90LXRgNC40YDRg9C10Lwg0Y/Rh9C10LnQutC4XHJcbiAgICBmb3IobGV0IHkgPSB0aGlzLmxhc3RZOyB5IDwgdGhpcy5sYXN0WSthbXRHZW5ZOyB5KyspIHtcclxuICAgICAgdGhpcy5sZXZlbC5sYXN0WSAtPSB0aGlzLmxldmVsLnNpemVDZWxsO1xyXG5cclxuICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IHRoaXMubGV2ZWwuYW10WDsgeCsrKSB7XHJcbiAgICAgICAgLy8g0YDQsNC90LTQvtC80L3QviAo0YEg0L/RgNC40L7RgNC40YLQtdGC0L7QvCkg0LLRi9Cx0LjRgNCw0LXQvCDRj9GH0LXQudC60YNcclxuICAgICAgICBsZXQgcmFuZCA9IE1hdGgucmFuZG9tKCkqMTAwO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmxldmVsLmRhdGFDZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgIGlmKHJhbmQgPCB0aGlzLmxldmVsLmRhdGFDZWxsc1tpXS5jaGFuY2UpIHtcclxuICAgICAgICAgICAgIC8vINCe0L/RgtC40LzQuNC30LDRhtC40Y8sINC90LUg0YHQvtC30LTQsNC10Lwg0L3QvtCy0YPRjiDRj9GH0LXQudC60YMs0LAg0L/QtdGA0LXRhNC+0YDQvNC40YDQvtCy0YvQstCw0LXQvCDRgdGC0LDRgNGL0LVcclxuICAgICAgICAgICAgIGxldCBjZWxsID0gdGhpcy5nZXRGaXJzdERlYWQoKTtcclxuICAgICAgICAgICAgIGlmKCFjZWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjZWxsID0gbmV3IENlbGwodGhpcywgdGhpcy5sZXZlbC5kYXRhQ2VsbHNbaV0sIHgsIHkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGQoY2VsbCk7XHJcbiAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICBjZWxsLnJlVXNlQ2VsbCh4LCB5LCB0aGlzLmxldmVsLmRhdGFDZWxsc1tpXSk7XHJcbiAgICAgICAgICAgICAgIGNlbGwucmV2aXZlKCk7XHJcbiAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgYXJyLnB1c2goY2VsbCk7XHJcbiAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JrQvtGB0YLRi9C70YwsINC60L7RgtC+0YDRi9C5INC70LjQvdC60YPQtdGCINGB0L7RgdC10LTQtdC5INGB0L/RgNCw0LLQsCwg0YHQu9C10LLQsCwg0YHQstC10YDRhdGDXHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgYW10R2VuWTsgeSsrKSB7XHJcbiAgICAgIGZvcihsZXQgeCA9IDA7IHggPCB0aGlzLmxldmVsLmFtdFg7IHgrKykge1xyXG4gICAgICAgIGlmKHkrMSA8IGFtdEdlblkpIGFyclt5KnRoaXMubGV2ZWwuYW10WCt4XS50b3BQYW5lbCA9IGFyclsoeSsxKSp0aGlzLmxldmVsLmFtdFgreF07XHJcbiAgICAgICAgaWYoeC0xID49IDApIGFyclt5KnRoaXMubGV2ZWwuYW10WCt4XS5sZWZ0UGFuZWwgPSBhcnJbeSp0aGlzLmxldmVsLmFtdFgreC0xXTtcclxuICAgICAgICBpZih4KzEgPCB0aGlzLmxldmVsLmFtdFgpICBhcnJbeSp0aGlzLmxldmVsLmFtdFgreF0ucmlnaHRQYW5lbCA9IGFyclt5KnRoaXMubGV2ZWwuYW10WCt4KzFdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JrQvtGB0YLRi9C70YwsINC60L7RgtC+0YDRi9C5INC70LjQvdC60YPQtdGCINC90L7QstGL0Lkg0YPRgNC+0LLQtdC90Ywg0Y/Rh9C10LXQuiDRgdC+INGB0YLQsNGA0YvQvFxyXG4gICAgaWYodGhpcy5sYXN0Lmxlbmd0aCkge1xyXG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgdGhpcy5sZXZlbC5hbXRYOyB4KyspIHtcclxuICAgICAgICB0aGlzLmxhc3RbeF0udG9wUGFuZWwgPSBhcnJbeF07XHJcbiAgICAgIH1cclxuICAgIH1cbiAgICB0aGlzLmxhc3QgPSBbXTtcbiAgICBmb3IobGV0IGkgPSBhcnIubGVuZ3RoLXRoaXMubGV2ZWwuYW10WDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5sYXN0LnB1c2goYXJyW2ldKTtcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sYXN0WSArPSBhbXRHZW5ZO1xyXG4gIH1cclxuICB1cGRhdGUoZHQpIHtcclxuICAgIC8vINC10YHQu9C4INGB0LvQvtC5INGP0YfQtdC10Log0YPRiNC10Lsg0LjQtyDQt9C+0L3RiyDQstC40LTQuNC80L7RgdGC0LgsINGC0L4g0LPQtdC90LXRgNC40YDRg9C10Lwg0L3QvtCy0YvQuSDRgdC70L7QuVxyXG4gICAgbGV0IGlzSGlkZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgIGlmKGNlbGwueSA+IHRoaXMubGV2ZWwucGxheWVyLnkrdGhpcy5zdGF0ZS5nYW1lLmhlaWdodC8yKSB7XHJcbiAgICAgICAgLy8g0L/QvtC80L7Qs9Cw0LXQvCDRgdCx0L7RgNGJ0LjQutGDINC80YPRgdC+0YDQsFxyXG4gICAgICAgIGNlbGwubGVmdFBhbmVsID0gbnVsbDtcclxuICAgICAgICBjZWxsLnJpZ2h0UGFuZWwgPSBudWxsO1xyXG4gICAgICAgIGNlbGwudG9wUGFuZWwgPSBudWxsO1xyXG4gICAgICAgIGNlbGwua2lsbCgpO1xyXG5cclxuICAgICAgICAvLyDQodC+0LfQtNCw0LXQvCDQvdC+0LLRi9C5INGB0LvQvtC5LCDQtdGB0LvQuCDQutC+0LvQuNGH0LXRgdGC0LLQviDRj9GH0LXQtdC6INC90LAg0YPRgNC+0LLQvdC1INC90LUg0LrQvtC90YfQuNC70L7RgdGMXHJcbiAgICAgICAgaWYodGhpcy5sZXZlbC50b3RhbENlbGxzID4gMCkge1xyXG4gICAgICAgICAgIWlzSGlkZSAmJiB0aGlzLmNyZWF0ZUNlbGxzKDEpO1xyXG4gICAgICAgICAgaXNIaWRlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDZWxsc01hbmFnZXI7XHJcbiIsImNsYXNzIENsb3Vkc01hbmFnZXIgZXh0ZW5kcyBQaGFzZXIuR3JvdXAge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBzdXBlcihzdGF0ZS5nYW1lKTtcclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuXHJcbiAgICB0aGlzLmxhc3RZID0gMDtcclxuXHJcbiAgICB0aGlzLnRpbWVyID0gdGhpcy5zdGF0ZS50aW1lLmNyZWF0ZShmYWxzZSk7XHJcbiAgICB0aGlzLnRpbWVyLmxvb3AoMTAwMCwgdGhpcy5jcmVhdGVDbG91ZCwgdGhpcyk7XHJcbiAgICB0aGlzLnRpbWVyLnN0YXJ0KCk7XHJcbiAgfVxyXG4gIGNyZWF0ZUNsb3VkKCkge1xyXG4gICAgdGhpcy5sYXN0WSAtPSB0aGlzLnN0YXRlLnJuZC5iZXR3ZWVuKHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQsIHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQqMik7XHJcblxyXG4gICAgbGV0IGNsb3VkID0gdGhpcy5nZXRGaXJzdERlYWQoKTtcclxuICAgIGlmKCFjbG91ZCkge1xyXG4gICAgICAgY2xvdWQgPSB0aGlzLmFkZCh0aGlzLnN0YXRlLm1ha2Uuc3ByaXRlKDAsIHRoaXMubGFzdFksICdjbG91ZCcpKTtcclxuICAgICAgIHRoaXMucmFuZG9taXplQ2xvdWQoY2xvdWQpO1xyXG4gICAgICAgdGhpcy5hZGQoY2xvdWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yYW5kb21pemVDbG91ZChjbG91ZCk7XHJcbiAgICAgIGNsb3VkLnJldml2ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuICByYW5kb21pemVDbG91ZChjbG91ZCkge1xyXG4gICAgaWYoTWF0aC5yYW5kb20oKSA8IC41KSB7XHJcbiAgICAgIGNsb3VkLnBvc2l0aW9uLnNldCgwLCB0aGlzLmxhc3RZKTtcclxuICAgICAgY2xvdWQud2lkdGggPSB0aGlzLnN0YXRlLmdhbWUud2lkdGgtMTAwO1xyXG4gICAgICBjbG91ZC5oZWlnaHQgPSA0MDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjbG91ZC5wb3NpdGlvbi5zZXQoMTAwLCB0aGlzLmxhc3RZKTtcclxuICAgICAgY2xvdWQud2lkdGggPSB0aGlzLnN0YXRlLmdhbWUud2lkdGgtMTAwO1xyXG4gICAgICBjbG91ZC5oZWlnaHQgPSA0MDA7XHJcbiAgICAgIGNsb3VkLmFuY2hvci5zZXQoMSk7XHJcbiAgICAgIGNsb3VkLnNjYWxlLnggKj0gLTE7XHJcbiAgICB9XHJcbiAgICBjbG91ZC5kdXJhdGlvbiA9IE1hdGgucmFuZG9tKCkqMjtcclxuICAgIGNsb3VkLmFscGhhID0gLjk7XHJcbiAgfVxyXG4gIHVwZGF0ZShkdCkge1xyXG4gICAgdGhpcy5mb3JFYWNoKChjbG91ZCkgPT4ge1xyXG4gICAgICBjbG91ZC55ICs9IGNsb3VkLmR1cmF0aW9uO1xyXG4gICAgICBpZihjbG91ZC55ID4gdGhpcy5zdGF0ZS5sZXZlbE1hbmFnZXIucGxheWVyLnkrdGhpcy5zdGF0ZS5nYW1lLmhlaWdodC00MDApXHJcbiAgICAgICAgY2xvdWQua2lsbCgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENsb3Vkc01hbmFnZXI7XHJcbiIsImNvbnN0IENlbGxzTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL0NlbGxzTWFuYWdlcicpO1xyXG5jb25zdCBXaW5kb3dNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvV2luZG93TWFuYWdlcicpO1xyXG5jb25zdCBJc2xhbmQgPSByZXF1aXJlKCcuLi9vYmplY3RzL0lzbGFuZCcpO1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuLi9vYmplY3RzL1BsYXllcicpO1xyXG5cclxuXHJcbmNsYXNzIExldmVsTWFuYWdlciB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUsIGxldmVscywgY2VsbHMpIHtcclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuXHJcbiAgICB0aGlzLmxldmVscyA9IGxldmVscztcclxuICAgIHRoaXMudHlwZXNDZWxscyA9IGNlbGxzO1xyXG4gICAgdGhpcy5jdXJyZW50ID0gMDtcclxuXHJcbiAgICB0aGlzLmxhc3RZID0gdGhpcy5zdGF0ZS5nYW1lLmhlaWdodDtcclxuICAgIHRoaXMubGFzdFggPSAwO1xyXG5cclxuICAgIHRoaXMuY2VsbHMgPSBuZXcgQ2VsbHNNYW5hZ2VyKHRoaXMpO1xyXG4gICAgdGhpcy53aW5kb3cgPSBuZXcgV2luZG93TWFuYWdlcih0aGlzKTtcclxuXHJcbiAgICB0aGlzLmNyZWF0ZUxldmVsKHRoaXMubGV2ZWxzW3RoaXMuY3VycmVudF0pO1xyXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMpO1xyXG4gIH1cclxuICBjcmVhdGVMZXZlbChsdmwpIHtcclxuICAgIHRoaXMuYW10WCA9IGx2bC5hbXRDZWxscyB8fCAyO1xyXG4gICAgdGhpcy50b3RhbENlbGxzID0gbHZsLnRvdGFsQ2VsbHMgfHwgNTAwO1xyXG4gICAgdGhpcy50aW50ID0gbHZsLnRpbnQ7XHJcbiAgICB0aGlzLnNpemVDZWxsID0gdGhpcy5zdGF0ZS5nYW1lLndpZHRoL3RoaXMuYW10WDtcclxuICAgIHRoaXMuc3RhcnRDb3VudENlbGxzID0gTWF0aC5mbG9vcih0aGlzLnN0YXRlLmdhbWUuaGVpZ2h0L3RoaXMuc2l6ZUNlbGwpKzI7XHJcblxyXG4gICAgLy8g0LrQvtGB0YLRi9C70YwsINC60L7RgtC+0YDRi9C5INGB0L7RgNGC0LjRgNGD0LXRgiDQtNCw0L3QvdGL0LUg0L4g0YLQuNC/0LDRhSDQv9C+INGI0LDQvdGB0YMgKNC/0L4g0YPQsdGL0LLQsNC90LjRjikg0Lgg0L7RgtGB0LXQutCw0LXRgiDRgtC40L/Riywg0LrQvtGC0L7RgNGL0YUg0L3QtdGCINC90LAg0YPRgNC+0LLQvdC1LlxyXG4gICAgdGhpcy5kYXRhQ2VsbHMgPSB0aGlzLnR5cGVzQ2VsbHMuc2xpY2UoKS5zb3J0KChhLCBiKSA9PiBhLmNoYW5jZSAtIGIuY2hhbmNlKTtcclxuXHJcbiAgICB0aGlzLmNyZWF0ZUlzbGFuZChsdmwpO1xyXG4gICAgdGhpcy53aW5kb3cuYWRkV2luZG93KGx2bC50ZXh0LCAoKSA9PiB0aGlzLmNyZWF0ZUNlbGxzKGx2bCkpO1xyXG4gIH1cclxuICBjcmVhdGVJc2xhbmQobHZsKSB7XHJcbiAgICBpZihsdmwuZGlyID09PSAndG9wJylcclxuICAgICAgdGhpcy5sYXN0WSAtPSB0aGlzLmFtdFgqdGhpcy5zaXplQ2VsbDtcclxuXHJcbiAgICB0aGlzLmlzbGFuZCA9IG5ldyBJc2xhbmQodGhpcywgdGhpcy5sYXN0WCwgdGhpcy5sYXN0WSwgbHZsKTtcclxuICB9XHJcbiAgY3JlYXRlQ2VsbHMobHZsKSB7XHJcbiAgICB0aGlzLmNlbGxzLnN0YXJ0R2VuKCk7XHJcbiAgfVxyXG4gIHVwZGF0ZSgpIHtcclxuICAgIGlmKHRoaXMudG90YWxDZWxscyA8PSAwKSB7XHJcbiAgICAgIGlmKHRoaXMuY3VycmVudCsxIDwgdGhpcy5sZXZlbHMubGVuZ3RoKSB0aGlzLmN1cnJlbnQrKztcclxuICAgICAgdGhpcy5jcmVhdGVMZXZlbCh0aGlzLmxldmVsc1t0aGlzLmN1cnJlbnRdKTtcclxuICAgIH1cclxuICAgIGlmKHRoaXMuaXNsYW5kLnkgPiB0aGlzLnBsYXllci55K3RoaXMuc3RhdGUuZ2FtZS5oZWlnaHQvMilcclxuICAgICAgdGhpcy5pc2xhbmQuZGVzdHJveSgpO1xyXG5cclxuICAgIHRoaXMucGxheWVyLnVwZGF0ZSgpO1xyXG4gICAgdGhpcy5jZWxscy51cGRhdGUoKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWxNYW5hZ2VyO1xyXG4iLCJjbGFzcyBVSU1hbmFnZXIgZXh0ZW5kcyBQaGFzZXIuR3JvdXAge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlKSB7XHJcbiAgICBzdXBlcihzdGF0ZSk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG4gICAgdGhpcy5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLnBsYW5lID0gdGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSgwLCAwLCAncGxhbmUnKTtcclxuICAgIHRoaXMuYWRkKHRoaXMucGxhbmUpO1xyXG5cclxuICAgIHRoaXMuc2NvcmVUZXh0ID0gdGhpcy5zdGF0ZS5tYWtlLnRleHQoNTAsIDI1LCBcIjB3YXlzLlwiLCB7XHJcbiAgICAgIGZvbnQ6ICdSb2JvdG8nLFxyXG4gICAgICBmb250U2l6ZTogNjAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDgwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5hZGQodGhpcy5zY29yZVRleHQpO1xyXG4gICAgdGhpcy5zY29yZSA9IDA7XHJcblxyXG5cclxuICAgIHRoaXMucGF1c2UgPSB0aGlzLnN0YXRlLm1ha2Uuc3ByaXRlKHRoaXMuc3RhdGUuZ2FtZS53aWR0aC04MCwgNzAsICd0aW1lJyk7XHJcbiAgICB0aGlzLnBhdXNlLmFuY2hvci5zZXQoLjUpO1xyXG4gICAgdGhpcy5wYXVzZS5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5wYXVzZS5ldmVudHMub25JbnB1dFVwLmFkZCgoKSA9PiB7XHJcbiAgICAgIHRoaXMucGF1c2Uucm90YXRpb24gPSAwO1xyXG4gICAgICBsZXQgdHdlZW4gPSB0aGlzLnN0YXRlLmFkZC50d2Vlbih0aGlzLnBhdXNlKVxyXG4gICAgICAgIC50byh7cm90YXRpb246IE1hdGguUEkqMn0sIDUwMClcclxuICAgICAgICAuc3RhcnQoKTtcclxuXHJcbiAgICAgIGlmKCF0aGlzLnN0YXRlLmdhbWUucGF1c2VkKSB7XHJcbiAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5zdGF0ZS5nYW1lLnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB0aGlzLnN0YXRlLmdhbWUucGF1c2VkID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuYWRkKHRoaXMucGF1c2UpO1xyXG4gIH1cclxuICBhZGRTY29yZSh2KSB7XHJcbiAgICB0aGlzLnNjb3JlICs9IHY7XHJcbiAgICB0aGlzLnNjb3JlVGV4dC50ZXh0ID0gdGhpcy5zY29yZSArICd3YXlzLic7XHJcbiAgfVxyXG4gIHNldFNjb3JlKHYpIHtcclxuICAgIHRoaXMuc2NvcmUgPSB2O1xyXG4gICAgdGhpcy5zY29yZVRleHQudGV4dCA9IHRoaXMuc2NvcmUgKyAnd2F5cy4nO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVSU1hbmFnZXI7XHJcbiIsImNsYXNzIFdpbmRvd01hbmFnZXIgZXh0ZW5kcyBQaGFzZXIuR3JvdXAge1xyXG4gIGNvbnN0cnVjdG9yKGxldmVsKSB7XHJcbiAgICBzdXBlcihsZXZlbC5zdGF0ZSk7XHJcblxyXG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xyXG4gICAgdGhpcy5zdGF0ZSA9IGxldmVsLnN0YXRlO1xyXG5cclxuICAgIHRoaXMuYWxwaGEgPSAwO1xyXG4gICAgdGhpcy5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmJnID0gdGhpcy5zdGF0ZS5tYWtlLmdyYXBoaWNzKDAsIDApO1xyXG4gICAgdGhpcy5iZy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xyXG4gICAgdGhpcy5iZy5kcmF3UmVjdCgwLCAwLCB0aGlzLnN0YXRlLmdhbWUud2lkdGgsIHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQpO1xyXG4gICAgdGhpcy5iZy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5hZGQodGhpcy5iZyk7XHJcblxyXG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5zdGF0ZS5tYWtlLnRleHQodGhpcy5zdGF0ZS5nYW1lLndpZHRoLzIsIHRoaXMuc3RhdGUuZ2FtZS5oZWlnaHQvNCwgXCJcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogNTAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCIsXHJcbiAgICAgIGFsaWduOiAnY2VudGVyJyxcclxuICAgICAgd29yZFdyYXA6IHRydWUsXHJcbiAgICAgIHdvcmRXcmFwV2lkdGg6IHRoaXMuc3RhdGUuZ2FtZS53aWR0aC0xMDBcclxuICAgIH0pO1xyXG4gICAgdGhpcy5jb250ZW50LmFuY2hvci5zZXQoMC41KTtcclxuICAgIHRoaXMuYWRkKHRoaXMuY29udGVudCk7XHJcbiAgfVxyXG4gIGFkZFdpbmRvdyh0ZXh0LCBjYikge1xyXG4gICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgLnRvKHthbHBoYTogMX0sIDUwMClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmJnLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5VSU1hbmFnZXIudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuY29udGVudC50ZXh0ID0gdGV4dDtcclxuXHRcdHRoaXMuYmcuZXZlbnRzLm9uSW5wdXRVcC5hZGRPbmNlKCgpID0+IHtcclxuICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAudG8oe2FscGhhOiAwfSwgNTAwKVxyXG4gICAgICAgIC5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUuVUlNYW5hZ2VyLnZpc2libGUgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5iZy5pbnB1dEVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgY2IgJiYgY2IoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dNYW5hZ2VyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBjcmVhdGVCZyhzdGF0ZSwgc2l6ZT0xMDAsIGF4PTIwLCBheT0yMCkge1xyXG4gICAgbGV0IGJnID0gc3RhdGUuYWRkLmdyYXBoaWNzKCk7XHJcbiAgICBiZy5iZWdpbkZpbGwoMHhGRkZGRkYsIDEpO1xyXG4gICAgYmcuZHJhd1JlY3QoMCwgMCwgc3RhdGUuZ2FtZS53aWR0aCwgc3RhdGUuZ2FtZS5oZWlnaHQpO1xyXG4gICAgYmcuZW5kRmlsbCgpO1xyXG5cclxuICAgIGJnLmxpbmVTdHlsZSg0LCAweDJlMmU0NCwgLjEpO1xyXG5cclxuICAgIGZvcihsZXQgeCA9IDA7IHggPCBheDsgeCsrKSB7XHJcbiAgICAgIGJnLm1vdmVUbyhzaXplKngsIDApO1xyXG4gICAgICBiZy5saW5lVG8oc2l6ZSp4LCBzdGF0ZS5nYW1lLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IHkgPSAwOyB5IDwgYXk7IHkrKykge1xyXG4gICAgICBiZy5tb3ZlVG8oMCwgc2l6ZSp5KTtcclxuICAgICAgYmcubGluZVRvKHN0YXRlLmdhbWUud2lkdGgsIHNpemUqeSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmc7XHJcbiAgfSxcclxuICBnb1RvKHN0YXRlLCBuYW1lLCBhcmdzKSB7XHJcbiAgICBzdGF0ZS5jYW1lcmEuZmFkZSgweEZGRkZGRik7XHJcbiAgICBzdGF0ZS5jYW1lcmEub25GYWRlQ29tcGxldGUuYWRkKCgpID0+IHtcclxuICAgICAgc3RhdGUuc3RhdGUuc3RhcnQobmFtZSwgdHJ1ZSwgZmFsc2UsIGFyZ3MpO1xyXG4gICAgICBzdGF0ZS5zdGF0ZS5nZXRDdXJyZW50U3RhdGUoKS5jYW1lcmEuZmxhc2goMHhGRkZGRkYsIDEwMDApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImNsYXNzIENlbGwgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcclxuICBjb25zdHJ1Y3RvcihtYW5hZ2VyLCB0eXBlLCB4LCB5KSB7XHJcbiAgICBzdXBlcihtYW5hZ2VyLmdhbWUsIDAsIDAsIHR5cGUuaW1nKTtcclxuXHJcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xyXG4gICAgdGhpcy5sZXZlbCA9IG1hbmFnZXIubGV2ZWw7XHJcbiAgICB0aGlzLnN0YXRlID0gbWFuYWdlci5zdGF0ZTtcblxuICAgIHRoaXMucGFkZGluZyA9IDEwO1xuICAgIHRoaXMuc2l6ZSA9IHRoaXMubWFuYWdlci5sZXZlbC5zaXplQ2VsbDtcclxuICAgIHRoaXMud2lkdGggPSB0aGlzLnNpemUtdGhpcy5wYWRkaW5nO1xyXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLnNpemUtdGhpcy5wYWRkaW5nO1xyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuXG4gICAgdGhpcy5yZVVzZUNlbGwoeCwgeSwgdHlwZSk7XHJcbiAgfVxuICByZVVzZUNlbGwoeCwgeSwgdHlwZSkge1xyXG4gICAgdGhpcy5sb2FkVGV4dHVyZSh0eXBlLmltZywgMCk7XHJcbiAgICB0aGlzLmNsaWNrQ291bnQgPSB0eXBlLmNsaWNrQ291bnQ7XHJcblxyXG4gICAgdGhpcy54ID0geCp0aGlzLnNpemUrdGhpcy5wYWRkaW5nLzIrdGhpcy53aWR0aC8yO1xyXG4gICAgdGhpcy55ID0gdGhpcy5sZXZlbC5sYXN0WSt0aGlzLmhlaWdodC8yO1xyXG4gICAgdGhpcy5pc09wZW4gPSB0eXBlLmlzT3BlbjtcclxuICAgIHRoaXMuaXNHb29kID0gdHlwZS5pc0dvb2Q7XHJcbiAgICB0aGlzLnNjb3JlID0gdHlwZS5zY29yZTtcclxuICAgIHRoaXMuaW5wdXRFbmFibGVkID0gZmFsc2U7XHJcblxyXG5cclxuICAgIGlmKHR5cGUuaXNDbGljaykge1xyXG4gICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuZXZlbnRzLm9uSW5wdXRVcC5hZGQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY2xpY2tDb3VudC0tO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLnNpemUtdGhpcy5wYWRkaW5nO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5zaXplLXRoaXMucGFkZGluZztcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgICAgIC50byh7d2lkdGg6IHRoaXMud2lkdGgrMzAsIGhlaWdodDogdGhpcy5oZWlnaHQrMzB9LCAxMDApXHJcbiAgICAgICAgICAudG8oe3dpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0fSwgMTAwKVxyXG4gICAgICAgICAgLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuY2xpY2tDb3VudCA9PT0gMCkge1xyXG4gICAgICAgICAgdGhpcy5sb2FkVGV4dHVyZSh0eXBlLmltZ0NsaWNrLCAwKTtcclxuICAgICAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsbDtcclxuIiwiY2xhc3MgRW50aXR5IGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUsIHgsIHksIHIsIGlzQXJjcywgc2NhbGU9MS41KSB7XHJcbiAgICBzdXBlcihzdGF0ZS5nYW1lLCB4LCB5LCAncGxheWVyJyk7XHJcbiAgICBcclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgIHRoaXMud2lkdGggPSByO1xyXG4gICAgdGhpcy5oZWlnaHQgPSByO1xyXG4gICAgdGhpcy5hbmNob3Iuc2V0KC41KTtcclxuXHJcbiAgICB0aGlzLmFyY1NjYWxlID0gc2NhbGU7XHJcblxyXG4gICAgaWYoaXNBcmNzKSB7XHJcbiAgICAgIHRoaXMuY3JlYXRlQXJjKC0uOCwgLTEsIC45LCAxLCAweDM3M2ZmZik7XHJcbiAgICAgIHRoaXMuY3JlYXRlQXJjKC45LCAtLjgsIC0xLCAuOSwgMHhmZjM3MzcpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUFyYygtLjgsIC45LCAuOCwgLTEsIDB4NDI4NjNjKTtcclxuICAgICAgdGhpcy5jcmVhdGVBcmMoLjgsIC45LCAtLjgsIC0uOCwgMHg4MjQyYWEpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByYW5kID0gdGhpcy5zdGF0ZS5ybmQuYmV0d2VlbigzMDAsIDEwMDApO1xyXG4gICAgbGV0IHNjID0gdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbig1LCA0MCk7XHJcbiAgICB0aGlzLnR3ZWVuQnJlYXRoZSA9IHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7d2lkdGg6IHIrc2MsIGhlaWdodDogcitzY30sIHJhbmQpXHJcbiAgICAgIC50byh7d2lkdGg6IHIsIGhlaWdodDogcn0sIHJhbmQpXHJcbiAgICAgIC55b3lvKClcclxuICAgICAgLmxvb3AoKVxyXG4gICAgICAuc3RhcnQoKTtcclxuICB9XHJcbiAgY3JlYXRlQXJjKHN4LCBzeSwgZXgsIGV5LCB0aW50KSB7XHJcbiAgICBsZXQgYXJjID0gdGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSh0aGlzLndpZHRoKnN4L3RoaXMuYXJjU2NhbGUsIHRoaXMuaGVpZ2h0KnN5L3RoaXMuYXJjU2NhbGUsICdwbGF5ZXInKTtcclxuXHJcbiAgICBhcmMudGludCA9IHRpbnQ7XHJcbiAgICBhcmMud2lkdGggPSAzMDtcclxuICAgIGFyYy5oZWlnaHQgPSAzMDtcclxuICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKGFyYylcclxuICAgICAgLnRvKHt4OiB0aGlzLndpZHRoKmV4L3RoaXMuYXJjU2NhbGUsIHk6IHRoaXMuaGVpZ2h0KmV5L3RoaXMuYXJjU2NhbGUsIHdpZHRoOiAwLCBoZWlnaHQ6IDB9LCB0aGlzLnN0YXRlLnJuZC5iZXR3ZWVuKDUwMCwgMTAwMCkpXHJcbiAgICAgIC50byh7eDogdGhpcy53aWR0aCpzeC90aGlzLmFyY1NjYWxlLCB5OiB0aGlzLmhlaWdodCpzeS90aGlzLmFyY1NjYWxlfSwgdGhpcy5zdGF0ZS5ybmQuYmV0d2VlbigzMDAsIDYwMCkpXHJcbiAgICAgIC50byh7d2lkdGg6IDMwLCBoZWlnaHQ6IDMwfSwgdGhpcy5zdGF0ZS5ybmQuYmV0d2Vlbig1MDAsIDEwMDApKVxyXG4gICAgICAueW95bygpXHJcbiAgICAgIC5sb29wKClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmFkZENoaWxkKGFyYyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eTtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZSgnLi4vb2JqZWN0cy9FbnRpdHknKTtcclxuXG5jbGFzcyBJc2xhbmQgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcclxuICBjb25zdHJ1Y3RvcihsZXZlbCwgeCwgeSwgbHZsKSB7XHJcbiAgICBzdXBlcihsZXZlbC5zdGF0ZS5nYW1lLCB4KzEwLCB5KzEwLCAnaXNsYW5kJyk7XHJcbiAgICBsZXZlbC5zdGF0ZS5hZGQuZXhpc3RpbmcodGhpcyk7XHJcblxyXG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xyXG4gICAgdGhpcy5zdGF0ZSA9IGxldmVsLnN0YXRlO1xyXG5cclxuICAgIHRoaXMudGludCA9IGx2bC50aW50O1xyXG5cclxuICAgIHRoaXMuc2l6ZSA9IHRoaXMuc3RhdGUuZ2FtZS53aWR0aC0yMDtcclxuICAgIHRoaXMud2lkdGggPSB0aGlzLnNpemU7XHJcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMuc2l6ZTtcclxuXHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoNTAsIDUwLCAnZmxhZycpKS5zY2FsZS5zZXQoLjUsIC41KTtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5zdGF0ZS5tYWtlLnNwcml0ZSgyODAsIDEyMCwgJ2ZsYWcnKSkuc2NhbGUuc2V0KC0uNSwgLjUpO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLnN0YXRlLm1ha2Uuc3ByaXRlKDQ1LCA3NSs1MCwgJ2ZsYWcnKSkuc2NhbGUuc2V0KC41LCAuNSk7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoMzAwLCA2MCwgJ2ZsYWcnKSkuc2NhbGUuc2V0KC0uNSwgLjUpO1xyXG4gICAgLy8gdGhpcy5hZGRDaGlsZCh0aGlzLnN0YXRlLm1ha2Uuc3ByaXRlKDQ0MC00MDAsIDEwLCAnZmxhZycpKS5zY2FsZS5zZXQoLS41LCAuNSk7XHJcbiAgICAvLyB0aGlzLmFkZENoaWxkKHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoNTcwLTQwMCwgMTYwLCAnZmxhZycpKS5zY2FsZS5zZXQoLS41LCAuNSk7XHJcbiAgICAvLyB0aGlzLmFkZENoaWxkKHRoaXMuc3RhdGUubWFrZS5zcHJpdGUoNjIwLTQwMCwgMTQwLCAnZmxhZycpKS5zY2FsZS5zZXQoLS41LCAuNSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElzbGFuZDtcclxuIiwiY29uc3QgRW50aXR5ID0gcmVxdWlyZSgnLi9FbnRpdHknKTtcclxuY29uc3QgdWkgPSByZXF1aXJlKCcuLi9taXhpbnMvdWknKTtcclxuXHJcbmNsYXNzIFBsYXllciBleHRlbmRzIEVudGl0eSB7XHJcbiAgY29uc3RydWN0b3IobGV2ZWwpIHtcclxuICAgIHN1cGVyKGxldmVsLnN0YXRlLCBsZXZlbC5zdGF0ZS5nYW1lLndpZHRoLzIsIGxldmVsLnN0YXRlLmdhbWUuaGVpZ2h0LTQwMCwgNzAsIHRydWUpO1xyXG4gICAgbGV2ZWwuc3RhdGUuYWRkLmV4aXN0aW5nKHRoaXMpO1xyXG5cclxuICAgIHRoaXMubGV2ZWwgPSBsZXZlbDtcclxuICAgIHRoaXMuc3RhdGUgPSBsZXZlbC5zdGF0ZTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzKTtcclxuICAgIHRoaXMuYm9keS5zZXRTaXplKHRoaXMud2lkdGgvMi0xLCB0aGlzLmhlaWdodC8yLTEsIDEsIDEpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuY2FtZXJhLmZvbGxvdyh0aGlzKTtcclxuXHRcdHRoaXMuc3RhdGUuY2FtZXJhLmRlYWR6b25lID0gbmV3IFBoYXNlci5SZWN0YW5nbGUodGhpcy54LXRoaXMud2lkdGgvMiwgdGhpcy55LXRoaXMuaGVpZ2h0LzIsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICB0aGlzLnNwZWVkID0gMTAwMDtcclxuICAgIHRoaXMubGFzdE1vdmU7XHJcblxyXG4gICAgdGhpcy50aW1lciA9IHRoaXMuc3RhdGUudGltZS5jcmVhdGUoZmFsc2UpO1xyXG4gICAgdGhpcy50aW1lci5sb29wKHRoaXMuc3BlZWQsIHRoaXMubW92ZSwgdGhpcyk7XHJcbiAgICB0aGlzLnRpbWVyLnN0YXJ0KCk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5hZGQudHdlZW4odGhpcylcclxuICAgICAgLnRvKHt5OiB0aGlzLnktMTUwfSwgdGhpcy5zcGVlZClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgICB0aGlzLnN0YXRlLmlucHV0Lm9uRG93bi5hZGRPbmNlKHRoaXMubW92ZU5leHRJc2xhbmQsIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgbW92ZSgpIHtcclxuICAgIHRoaXMuc3RhdGUucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLCB0aGlzLmxldmVsLmNlbGxzLCAocGwsIGNlbGwpID0+IHtcclxuICAgICAgaWYoIWNlbGwudG9wUGFuZWwpIHJldHVybiB0aGlzLm1vdmVOZXh0SXNsYW5kKCk7XHJcbiAgICAgIGlmKGNlbGwuaXNPcGVuKSB0aGlzLnN0YXRlLlVJTWFuYWdlci5hZGRTY29yZShjZWxsLnNjb3JlKTtcclxuXHJcbiAgICAgIGlmKGNlbGwudG9wUGFuZWwgJiYgY2VsbC50b3BQYW5lbC5pc09wZW4gJiYgY2VsbC50b3BQYW5lbC5pc0dvb2QpIHRoaXMubW92ZVVwKGNlbGwpO1xyXG4gICAgICBlbHNlIGlmKHRoaXMubGFzdE1vdmUgIT09ICdsZWZ0JyAmJiBjZWxsLnJpZ2h0UGFuZWwgJiYgY2VsbC5yaWdodFBhbmVsLmlzT3BlbiAmJiBjZWxsLnJpZ2h0UGFuZWwuaXNHb29kKSB0aGlzLm1vdmVSaWdodChjZWxsKTtcclxuICAgICAgZWxzZSBpZih0aGlzLmxhc3RNb3ZlICE9PSAncmlnaHQnICYmIGNlbGwubGVmdFBhbmVsICYmIGNlbGwubGVmdFBhbmVsLmlzT3BlbiAmJiBjZWxsLmxlZnRQYW5lbC5pc0dvb2QpIHRoaXMubW92ZUxlZnQoY2VsbCk7XHJcbiAgICAgIGVsc2UgdGhpcy5kZWFkKGNlbGwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIG1vdmVOZXh0SXNsYW5kKCkge1xuICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7eTogdGhpcy5sZXZlbC5pc2xhbmQueS10aGlzLmxldmVsLnNpemVDZWxsLzJ9LCB0aGlzLnNwZWVkKjMpXHJcbiAgICAgIC5zdGFydCgpO1xuICB9XHJcbiAgbW92ZVVwKGNlbGwpIHtcclxuICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7eTogY2VsbC50b3BQYW5lbC55fSwgdGhpcy5zcGVlZClcclxuICAgICAgLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmxhc3RNb3ZlID0gJ3RvcCc7XHJcbiAgfVxyXG4gIG1vdmVMZWZ0KGNlbGwpIHtcclxuICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7eDogY2VsbC5sZWZ0UGFuZWwueH0sIHRoaXMuc3BlZWQpXHJcbiAgICAgIC5zdGFydCgpO1xyXG4gICAgdGhpcy5sYXN0TW92ZSA9ICdsZWZ0JztcclxuICB9XHJcbiAgbW92ZVJpZ2h0KGNlbGwpIHtcclxuICAgIHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7eDogY2VsbC5yaWdodFBhbmVsLnh9LCB0aGlzLnNwZWVkKVxyXG4gICAgICAuc3RhcnQoKTtcclxuICAgIHRoaXMubGFzdE1vdmUgPSAncmlnaHQnO1xyXG4gIH1cclxuICBkZWFkKGNlbGwpIHtcclxuICAgIGxldCB0d2VlbiA9IHRoaXMuc3RhdGUuYWRkLnR3ZWVuKHRoaXMpXHJcbiAgICAgIC50byh7eTogY2VsbC50b3BQYW5lbC55LCBhbHBoYTogMCwgd2lkdGg6IDAsIGhlaWdodDogMH0sIHRoaXMuc3BlZWQpXHJcbiAgICAgIC5zdGFydCgpO1xyXG4gICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xyXG4gICAgICB1aS5nb1RvKHRoaXMuc3RhdGUsICdNZW51JywgIHRoaXMuc3RhdGUuVUlNYW5hZ2VyLnNjb3JlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLnJvdGF0aW9uICs9IC4wMTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xyXG4iLCJjbGFzcyBCb290IHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG5cdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5zY2FsZS5zZXRNYXhpbXVtKCk7XHJcblxyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb290O1xyXG4iLCJjb25zdCB1aSA9IHJlcXVpcmUoJy4uL21peGlucy91aScpO1xyXG5jb25zdCBFbnRpdHkgPSByZXF1aXJlKCcuLi9vYmplY3RzL0VudGl0eScpO1xyXG5cclxuY2xhc3MgTWVudSB7XHJcblx0aW5pdChzY29yZSA9IDApIHtcclxuXHRcdGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2NvcmVcIikgPCBzY29yZSB8fCAhbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzY29yZVwiKSlcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzY29yZVwiLCBzY29yZSk7XHJcblxyXG5cdFx0dGhpcy5iZyA9IHVpLmNyZWF0ZUJnKHRoaXMsIHRoaXMuZ2FtZS53aWR0aC81LCA1LCAxMCk7XHJcblxyXG5cdFx0Ly8gdGhpcy5jb2xvcnNDbG91ZHMgPSB0aGlzLmFkZC5zcHJpdGUoMCwgMCwgJ2NvbG9ycy1jbG91ZHMnKTtcclxuXHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMuY29sb3JzQ2xvdWRzKVxyXG5cdFx0Ly8gXHQudG8oe2hlaWdodDogdGhpcy5jb2xvcnNDbG91ZHMuaGVpZ2h0KzE1MH0sIDQwMDApXHJcblx0XHQvLyBcdC50byh7aGVpZ2h0OiB0aGlzLmNvbG9yc0Nsb3Vkcy5oZWlnaHR9LCA0MDAwKVxyXG5cdFx0Ly8gXHQueW95bygpXHJcblx0XHQvLyBcdC5sb29wKClcclxuXHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gdGhpcy5ncmF5Q2xvdWRzID0gdGhpcy5hZGQuc3ByaXRlKDAsIHRoaXMuZ2FtZS5oZWlnaHQsICdncmF5LWNsb3VkcycpO1xyXG5cdFx0Ly8gdGhpcy5ncmF5Q2xvdWRzLmFuY2hvci5zZXQoMCwgMSk7XHJcblx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLmdyYXlDbG91ZHMpXHJcblx0XHQvLyBcdC50byh7aGVpZ2h0OiB0aGlzLmdyYXlDbG91ZHMuaGVpZ2h0KzEwMH0sIDMwMDApXHJcblx0XHQvLyBcdC50byh7aGVpZ2h0OiB0aGlzLmdyYXlDbG91ZHMuaGVpZ2h0fSwgMzAwMClcclxuXHRcdC8vIFx0LnlveW8oKVxyXG5cdFx0Ly8gXHQubG9vcCgpXHJcblx0XHQvLyBcdC5zdGFydCgpO1xyXG5cdFx0Ly9cclxuXHRcdC8vXHJcblx0XHQvLyB0aGlzLnBhcnRHcmF5Q2xvdWQgPSB0aGlzLmFkZC5zcHJpdGUoMCwgNDI1LCAncGFydC1ncmF5LWNsb3VkJyk7XHJcblx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLnBhcnRHcmF5Q2xvdWQpXHJcblx0XHQvLyBcdC50byh7eTogdGhpcy5wYXJ0R3JheUNsb3VkLnkrNjB9LCA1MDAwKVxyXG5cdFx0Ly8gXHQudG8oe3k6IHRoaXMucGFydEdyYXlDbG91ZC55fSwgNTAwMClcclxuXHRcdC8vIFx0LnlveW8oKVxyXG5cdFx0Ly8gXHQubG9vcCgpXHJcblx0XHQvLyBcdC5zdGFydCgpO1xyXG5cdFx0Ly9cclxuXHRcdC8vIHRoaXMucGFydENvbG9yc0Nsb3VkMSA9IHRoaXMuYWRkLnNwcml0ZSg2MiwgNzYwLCAncGFydC1jb2xvcnMtY2xvdWQnKTtcclxuXHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydENvbG9yc0Nsb3VkMSlcclxuXHRcdC8vIFx0LnRvKHt5OiB0aGlzLnBhcnRDb2xvcnNDbG91ZDEueSs4MH0sIDQwMDApXHJcblx0XHQvLyBcdC50byh7eTogdGhpcy5wYXJ0Q29sb3JzQ2xvdWQxLnl9LCA0MDAwKVxyXG5cdFx0Ly8gXHQueW95bygpXHJcblx0XHQvLyBcdC5sb29wKClcclxuXHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHQvL1xyXG5cdFx0Ly8gdGhpcy5wYXJ0Q29sb3JzQ2xvdWQyID0gdGhpcy5hZGQuc3ByaXRlKDQ3MCwgNjgwLCAncGFydC1jb2xvcnMtY2xvdWQnKTtcclxuXHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydENvbG9yc0Nsb3VkMilcclxuXHRcdC8vIFx0LnRvKHt5OiB0aGlzLnBhcnRDb2xvcnNDbG91ZDIueSs3MH0sIDMwMDApXHJcblx0XHQvLyBcdC50byh7eTogdGhpcy5wYXJ0Q29sb3JzQ2xvdWQyLnl9LCAzMDAwKVxyXG5cdFx0Ly8gXHQueW95bygpXHJcblx0XHQvLyBcdC5sb29wKClcclxuXHRcdC8vIFx0LnN0YXJ0KCk7XHJcblxyXG5cdFx0dGhpcy5wbGF5ID0gdGhpcy5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53aWR0aC8yLCA1NTAsICdwbGF5Jyk7XHJcblx0XHR0aGlzLnBsYXkuYW5jaG9yLnNldCguNSk7XHJcblx0XHR0aGlzLnBsYXkuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMucGxheS5ldmVudHMub25JbnB1dFVwLmFkZE9uY2UoKCkgPT4ge1xyXG5cdFx0XHQvLyB0aGlzLmFkZC50d2Vlbih0aGlzLmdyYXlDbG91ZHMpXHJcblx0XHRcdC8vIFx0LnRvKHt5OiB0aGlzLmdhbWUuaGVpZ2h0KzE1MDB9LCA1MDApXHJcblx0XHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydENvbG9yc0Nsb3VkMSlcclxuXHRcdFx0Ly8gXHQudG8oe3k6IHRoaXMuZ2FtZS5oZWlnaHQrMTAwMH0sIDEwMDApXHJcblx0XHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydENvbG9yc0Nsb3VkMilcclxuXHRcdFx0Ly8gXHQudG8oe3k6IHRoaXMuZ2FtZS5oZWlnaHQrMTAwMH0sIDEwMDApXHJcblx0XHRcdC8vIFx0LnN0YXJ0KCk7XHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIHRoaXMuYWRkLnR3ZWVuKHRoaXMucGFydEdyYXlDbG91ZClcclxuXHRcdFx0Ly8gXHQudG8oe3k6IC0xMDAwfSwgMTAwMClcclxuXHRcdFx0Ly8gXHQuc3RhcnQoKTtcclxuXHRcdFx0Ly9cclxuXHRcdFx0bGV0IHR3ZWVuID0gdGhpcy5hZGQudHdlZW4odGhpcy5wbGF5KVxyXG5cdFx0XHRcdC50byh7cm90YXRpb246IE1hdGguUEkvMn0sIDEwMClcclxuXHRcdFx0XHQudG8oe3dpZHRoOiB0aGlzLnBsYXkud2lkdGgrMjAsIGhlaWdodDogdGhpcy5wbGF5LmhlaWdodCsyMH0sIDEwMClcclxuXHRcdFx0XHQuc3RhcnQoKTtcclxuXHJcblx0XHRcdHR3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcclxuXHRcdFx0XHR1aS5nb1RvKHRoaXMsICdQbGF5Z3JvdW5kJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53aWR0aC8yLCA3NzAsICdzdGFyJykuYW5jaG9yLnNldCguNSk7XHJcblx0XHR0aGlzLnNldHRpbmdzID0gdGhpcy5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53aWR0aC8yLCAxMDAwLCAnc2V0dGluZ3MnKTtcclxuXHRcdHRoaXMuc2V0dGluZ3MuYW5jaG9yLnNldCguNSk7XHJcblx0XHR0aGlzLnNldHRpbmdzLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblx0XHR0aGlzLnNldHRpbmdzLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcblx0XHRcdGxldCB0d2VlbiA9IHRoaXMuYWRkLnR3ZWVuKHRoaXMuc2V0dGluZ3MpXHJcblx0XHRcdFx0LnRvKHtyb3RhdGlvbjogTWF0aC5QSS8yfSwgMTAwKVxyXG5cdFx0XHRcdC50byh7d2lkdGg6IHRoaXMuc2V0dGluZ3Mud2lkdGgrMjAsIGhlaWdodDogdGhpcy5zZXR0aW5ncy5oZWlnaHQrMjB9LCAxMDApXHJcblx0XHRcdFx0LnN0YXJ0KCk7XHJcblxyXG5cdFx0XHR0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcblx0XHRcdFx0dWkuZ29Ubyh0aGlzLCAnU2V0dGluZ3MnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcbiAgICB0aGlzLmxhYmVsID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgMTQwLCBcIk1vdHRpb25cIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogMTAwLFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcblx0XHRcdGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG4gICAgdGhpcy50ZXh0ID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgMjMwLCBcIlNlbnMgaW4gdGhlIHdheVwiLCB7XHJcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXHJcbiAgICAgIGZvbnRTaXplOiA2MCxcclxuICAgICAgZm9udFdlaWdodDogNjAwLFxyXG4gICAgICBmaWxsOiBcIiM1NTVkZmZcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0Ly9cclxuXHRcdHRoaXMuc2NvcmVzID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgMzUwLCBzY29yZSArICcgfCAnICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Njb3JlJyksIHtcclxuICAgICAgZm9udDogJ1JvYm90bycsXHJcbiAgICAgIGZvbnRTaXplOiA2MixcclxuICAgICAgZm9udFdlaWdodDogODAwLFxyXG4gICAgICBmaWxsOiBcIiM1NTVkZmZcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNjb3Jlcy5hbmNob3Iuc2V0KDAuNSk7XHJcblx0fVxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdC8vIHRoaXMuYnRuLnJvdGF0aW9uICs9IC4wMjtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTtcclxuIiwiY29uc3QgQ2xvdWRzTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL0Nsb3Vkc01hbmFnZXInKTtcclxuY29uc3QgVUlNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvVUlNYW5hZ2VyJyk7XHJcbmNvbnN0IExldmVsTWFuYWdlciA9IHJlcXVpcmUoJy4uL21hbmFnZXJzL0xldmVsTWFuYWdlcicpO1xyXG5cclxuY29uc3QgbGV2ZWxzID0gcmVxdWlyZSgnLi4vbGV2ZWxzLmpzb24nKTtcclxuY29uc3QgdHlwZXMgPSByZXF1aXJlKCcuLi90eXBlcy5qc29uJyk7XHJcblxyXG5jbGFzcyBQbGF5Z3JvdW5kIHtcclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLndvcmxkLnNldEJvdW5kcygwLCAtdGhpcy5nYW1lLmhlaWdodCoxMDAwLCB0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQqMjAwMCk7XHJcblx0XHR0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQXJjYWRlKTtcclxuXHJcblxyXG5cdFx0dGhpcy5iZyA9IHRoaXMuYWRkLnNwcml0ZSgwLCAwLCAnYmcnKTtcclxuXHRcdHRoaXMuYmcud2lkdGggPSB0aGlzLmdhbWUud2lkdGg7XHJcblx0XHR0aGlzLmJnLmhlaWdodCA9IHRoaXMuZ2FtZS5oZWlnaHQ7XHJcblx0XHR0aGlzLmJnLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuY2xvdWRzTWFuYWdlciA9IG5ldyBDbG91ZHNNYW5hZ2VyKHRoaXMpO1xyXG5cdFx0dGhpcy5VSU1hbmFnZXIgPSBuZXcgVUlNYW5hZ2VyKHRoaXMpO1xyXG5cdFx0dGhpcy5sZXZlbE1hbmFnZXIgPSBuZXcgTGV2ZWxNYW5hZ2VyKHRoaXMsIGxldmVscywgdHlwZXMpO1xyXG5cclxuXHRcdHRoaXMuZ3JheXNjYWxlID0gdGhpcy5hZGQuaW1hZ2UoMCwgdGhpcy5nYW1lLmhlaWdodC01MDAsICdncmF5c2NhbGUnKTtcclxuXHRcdHRoaXMuZ3JheXNjYWxlLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cdFx0dGhpcy5ncmF5c2NhbGUuYWxwaGEgPSAuOTtcclxuXHRcdHRoaXMuZ3JheXNjYWxlLndpZHRoID0gdGhpcy5nYW1lLndpZHRoO1xyXG5cdFx0dGhpcy5ncmF5c2NhbGUuaGVpZ2h0ID0gNzAwO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblx0XHR0aGlzLmNsb3Vkc01hbmFnZXIudXBkYXRlKCk7XHJcbiAgICB0aGlzLmxldmVsTWFuYWdlci51cGRhdGUoKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWdyb3VuZDtcclxuIiwiY2xhc3MgUHJlbG9hZCB7XHJcblx0aW5pdCgpIHtcclxuXHR9XHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnZ3JheXNjYWxlJywgJ2Fzc2V0cy9ncmF5c2NhbGUucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2Fzc2V0cy9iZy5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGxheWVyJywgJ2Fzc2V0cy9wbGF5ZXIucG5nJyk7XHJcblxyXG5cdFx0Ly8gY2VsbHNcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbDEnLCAnYXNzZXRzL2NlbGxzL2NlbGwxLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsMicsICdhc3NldHMvY2VsbHMvY2VsbDIucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2NlbGwzJywgJ2Fzc2V0cy9jZWxscy9jZWxsMy5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbDQnLCAnYXNzZXRzL2NlbGxzL2NlbGw0LnBuZycpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbDEtZmlsbCcsICdhc3NldHMvY2VsbHMvY2VsbDEtZmlsbC5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY2VsbDQtZmlsbCcsICdhc3NldHMvY2VsbHMvY2VsbDQtZmlsbC5wbmcnKTtcclxuXHJcblx0XHQvLyBpc2xhbmRcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnaXNsYW5kJywgJ2Fzc2V0cy9pc2xhbmQvaXNsYW5kMi5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnZmxhZycsICdhc3NldHMvaXNsYW5kL2ZsYWcucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2Nsb3VkJywgJ2Fzc2V0cy9pc2xhbmQvY2xvdWQucG5nJyk7XHJcblxyXG5cdFx0Ly8gdWlcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgncGxheScsICdhc3NldHMvdWkvcGxheS5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnc2V0dGluZ3MnLCAnYXNzZXRzL3VpL3NldHRpbmdzLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdzdGFyJywgJ2Fzc2V0cy91aS9zdGFyLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCd0aW1lJywgJ2Fzc2V0cy91aS90aW1lLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwbGFuZScsICdhc3NldHMvdWkvcGxhbmUucG5nJyk7XHJcblxyXG5cdFx0Ly8gbWVudVxyXG5cdFx0Ly8gdGhpcy5sb2FkLmltYWdlKCdncmF5LWNsb3VkcycsICdhc3NldHMvbWVudS9ncmF5Y2xvdWRzLnBuZycpO1xyXG5cdFx0Ly8gdGhpcy5sb2FkLmltYWdlKCdjb2xvcnMtY2xvdWRzJywgJ2Fzc2V0cy9tZW51L2NvbG9yc2Nsb3Vkcy5wbmcnKTtcclxuXHRcdC8vIHRoaXMubG9hZC5pbWFnZSgncGFydC1ncmF5LWNsb3VkJywgJ2Fzc2V0cy9tZW51L3BhcnRncmF5Y2xvdWQucG5nJyk7XHJcblx0XHQvLyB0aGlzLmxvYWQuaW1hZ2UoJ3BhcnQtY29sb3JzLWNsb3VkJywgJ2Fzc2V0cy9tZW51L3BhcnRjb2xvcnNjbG91ZC5wbmcnKTtcclxuXHJcblx0XHQvLyBtdXNpY1xyXG5cdFx0dGhpcy5sb2FkLmF1ZGlvKCdtdXNpYycsICdhc3NldHMvbXVzaWMvYmVuc291bmQtYW5ld2JlZ2lubmluZy5tcDMnKTtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdGxldCBtdXNpYyA9IHRoaXMuYWRkLmF1ZGlvKCdtdXNpYycpO1xyXG5cdFx0bXVzaWMubG9vcEZ1bGwoMC42KTtcclxuXHJcblx0XHR0aGlzLnN0YXRlLnN0YXJ0KCdNZW51Jyk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWQ7XHJcbiIsImNvbnN0IHVpID0gcmVxdWlyZSgnLi4vbWl4aW5zL3VpJyk7XHJcblxyXG5jbGFzcyBTZXR0aW5ncyB7XHJcblx0aW5pdCgpIHtcclxuXHRcdHRoaXMuYmcgPSB1aS5jcmVhdGVCZyh0aGlzLCB0aGlzLmdhbWUud2lkdGgvNSwgNSwgMTApO1xyXG5cclxuICAgIHRoaXMubGFiZWwgPSB0aGlzLmFkZC50ZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAxNDAsIFwiU2V0dGluZ3NcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogMTAwLFxyXG4gICAgICBmb250V2VpZ2h0OiAxMDAsXHJcblx0XHRcdGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XHJcblxyXG5cclxuICAgIHRoaXMuc291bmRzID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgNTUwLCBcIlNvdW5kcyB8IE9OXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDYwLFxyXG4gICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc291bmRzLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICB0aGlzLm11c2ljID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgNjUwLCBcIk11c2ljIHwgT0ZGXCIsIHtcclxuICAgICAgZm9udDogJ09waWZpY2lvJyxcclxuICAgICAgZm9udFNpemU6IDYwLFxyXG4gICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgIGZpbGw6IFwiIzU1NWRmZlwiXHJcbiAgICB9KTtcclxuICAgIHRoaXMubXVzaWMuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuICAgIHRoaXMuYmFjayA9IHRoaXMuYWRkLnRleHQoMTUwLCB0aGlzLmdhbWUuaGVpZ2h0LTgwLCBcIkJhY2tcIiwge1xyXG4gICAgICBmb250OiAnT3BpZmljaW8nLFxyXG4gICAgICBmb250U2l6ZTogODAsXHJcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcclxuICAgICAgZmlsbDogXCIjNTU1ZGZmXCJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5iYWNrLmFuY2hvci5zZXQoMC41KTtcclxuICAgIHRoaXMuYmFjay5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5iYWNrLmV2ZW50cy5vbklucHV0VXAuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgIHVpLmdvVG8odGhpcywgJ01lbnUnKTtcclxuICAgIH0pO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcclxuIiwibW9kdWxlLmV4cG9ydHM9W1xyXG4gIHtcclxuICAgIFwiaWRcIjogMCxcclxuICAgIFwiaW1nXCI6IFwiY2VsbDFcIixcclxuICAgIFwiY2hhbmNlXCI6IDEwMCxcclxuICAgIFwiaW1nQ2xpY2tcIjogXCJjZWxsMS1maWxsXCIsXHJcbiAgICBcImlzT3BlblwiOiBmYWxzZSxcclxuICAgIFwiY2xpY2tDb3VudFwiOiAxLFxyXG4gICAgXCJpc0NsaWNrXCI6IHRydWUsXHJcbiAgICBcInNjb3JlXCI6IDEsXHJcbiAgICBcImlzR29vZFwiOiB0cnVlXHJcbiAgfSxcclxuICB7XHJcbiAgICBcImlkXCI6IDEsXHJcbiAgICBcImNoYW5jZVwiOiAyMCxcclxuICAgIFwiaW1nXCI6IFwiY2VsbDJcIixcclxuICAgIFwiaXNPcGVuXCI6IGZhbHNlLFxyXG4gICAgXCJpc0NsaWNrXCI6IGZhbHNlLFxyXG4gICAgXCJzY29yZVwiOiAwLFxyXG4gICAgXCJpc0dvb2RcIjogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIFwiaWRcIjogMixcclxuICAgIFwiY2hhbmNlXCI6IDUsXHJcbiAgICBcImltZ1wiOiBcImNlbGwzXCIsXHJcbiAgICBcImlzT3BlblwiOiB0cnVlLFxyXG4gICAgXCJpc0NsaWNrXCI6IGZhbHNlLFxyXG4gICAgXCJzY29yZVwiOiAxMCxcclxuICAgIFwiaXNHb29kXCI6IHRydWVcclxuICB9LFxyXG4gIHtcclxuICAgIFwiaWRcIjogMyxcclxuICAgIFwiaW1nXCI6IFwiY2VsbDRcIixcclxuICAgIFwiY2hhbmNlXCI6IDMwLFxyXG4gICAgXCJpbWdDbGlja1wiOiBcImNlbGw0LWZpbGxcIixcclxuICAgIFwiaXNPcGVuXCI6IGZhbHNlLFxyXG4gICAgXCJpc0NsaWNrXCI6IHRydWUsXHJcbiAgICBcImNsaWNrQ291bnRcIjogMixcclxuICAgIFwic2NvcmVcIjogNSxcclxuICAgIFwiaXNHb29kXCI6IHRydWVcclxuICB9XHJcbl1cclxuIl19
