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

class CellsManager {
  constructor(state) {
    this.state = state;
    this.cells = [];

    this.graph = this.state.add.graphics();
    this.createCells();
  }
  createCells() {
    let length = this.cells.length;

    for(let y = length; y < length+100; y++) {
      this.cells.push([]);
      for(let x = 0; x < 5; x++) {
        this.cells[y][x] = new Cell(this, x, y);
      }
    }
  }
  update(dt) {
    this.graph.clear();

    for(let y = 0; y < this.cells.length; y++) {
      for(let x = 0; x < this.cells[y].length; x++) {
        this.cells[y][x].update(dt);
      }
    }
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
class Cell {
  constructor(manager, x, y) {
    this.manager = manager;
    this.state = manager.state;

    this.size = this.state.game.width/5;
    this.x = x*this.size;
    this.y = -y*this.size;

    this.cell = this.state.add.sprite(this.x, this.y, 'cell');
    this.cell.width = this.size;
    this.cell.height = this.size;
    this.cell.tint = Math.random() < 0.3 ? 0x000000 : 0xFFFFFF;
    this.cell.tint = Math.random() < 0.1 ? 0xc95c26 : this.cell.tint;

    this.cell.inputEnabled = true;
    this.cell.events.onInputUp.add(() => {
      this.cell.tint = 0xCCCCCC;
    });
  }
  update(dt) {
    this.cell.y += 6;
  }
}

module.exports = Cell;

},{}],5:[function(require,module,exports){
class Player {
  constructor(state) {
    this.circle = state.add.graphics();
    this.circle.beginFill(0x2e2e44, 1);
    this.circle.lineStyle(2, 0x2e2e44, .5);
    this.circle.drawCircle(state.game.width/2, state.game.height/2+400, 100);
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
		// this.bg = ui.createBg(this, 154, 10, 15);

    this.label = this.add.text(100, 100, "Existence:", {
      font: 'Opificio',
      fontSize: 94,
      fontWeight: 400,
      fill: "rgb(52, 61, 84)"
    });

    this.score = this.add.text(100, 200, "56s", {
      font: 'Opificio',
      fontSize: 72,
      fontWeight: 600,
      fill: "rgb(52, 61, 84)"
    });

    this.cellsManager = new CellsManager(this);
    this.player = new Player(this);
	}
	update(dt) {
    this.cellsManager.update(dt);
	}
}

module.exports = Playground;

},{"../managers/CellsManager":2,"../mixins/ui":3,"../objects/Player":5}],9:[function(require,module,exports){

class Preload {
	init() {
	}
	preload() {
		this.load.image('cell', 'assets/cell.png');
	}

	create() {
		this.state.start('Menu');
	}
}

module.exports = Preload;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2F6YmFuZy9nYW1lL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hemJhbmcvZ2FtZS9zcmMvaW5kZXguanMiLCIvaG9tZS9hemJhbmcvZ2FtZS9zcmMvbWFuYWdlcnMvQ2VsbHNNYW5hZ2VyLmpzIiwiL2hvbWUvYXpiYW5nL2dhbWUvc3JjL21peGlucy91aS5qcyIsIi9ob21lL2F6YmFuZy9nYW1lL3NyYy9vYmplY3RzL0NlbGwuanMiLCIvaG9tZS9hemJhbmcvZ2FtZS9zcmMvb2JqZWN0cy9QbGF5ZXIuanMiLCIvaG9tZS9hemJhbmcvZ2FtZS9zcmMvc3RhdGVzL0Jvb3QuanMiLCIvaG9tZS9hemJhbmcvZ2FtZS9zcmMvc3RhdGVzL01lbnUuanMiLCIvaG9tZS9hemJhbmcvZ2FtZS9zcmMvc3RhdGVzL1BsYXlncm91bmQuanMiLCIvaG9tZS9hemJhbmcvZ2FtZS9zcmMvc3RhdGVzL1ByZWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IEJvb3QgPSByZXF1aXJlKCcuL3N0YXRlcy9Cb290LmpzJyk7XG5jb25zdCBQcmVsb2FkID0gcmVxdWlyZSgnLi9zdGF0ZXMvUHJlbG9hZC5qcycpO1xuY29uc3QgTWVudSA9IHJlcXVpcmUoJy4vc3RhdGVzL01lbnUuanMnKTtcbmNvbnN0IFBsYXlncm91bmQgPSByZXF1aXJlKCcuL3N0YXRlcy9QbGF5Z3JvdW5kLmpzJyk7XG5cbnZhciByZWFkeSA9ICgpID0+IHtcblx0dmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoNzIwLCAxMjgwLCBQaGFzZXIuQVVUTywgJ01vdHRpb24nKTtcblxuXHRnYW1lLnN0YXRlLmFkZCgnQm9vdCcsIEJvb3QsIHRydWUpO1xuICBnYW1lLnN0YXRlLmFkZCgnUHJlbG9hZCcsIFByZWxvYWQpO1xuICBnYW1lLnN0YXRlLmFkZCgnTWVudScsIE1lbnUpO1xuXHRnYW1lLnN0YXRlLmFkZCgnUGxheWdyb3VuZCcsIFBsYXlncm91bmQpO1xufVxuXG5yZWFkeSgpO1xuIiwiY29uc3QgQ2VsbCA9IHJlcXVpcmUoJy4uL29iamVjdHMvQ2VsbCcpO1xuXG5jbGFzcyBDZWxsc01hbmFnZXIge1xuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLmNlbGxzID0gW107XG5cbiAgICB0aGlzLmdyYXBoID0gdGhpcy5zdGF0ZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICB0aGlzLmNyZWF0ZUNlbGxzKCk7XG4gIH1cbiAgY3JlYXRlQ2VsbHMoKSB7XG4gICAgbGV0IGxlbmd0aCA9IHRoaXMuY2VsbHMubGVuZ3RoO1xuXG4gICAgZm9yKGxldCB5ID0gbGVuZ3RoOyB5IDwgbGVuZ3RoKzEwMDsgeSsrKSB7XG4gICAgICB0aGlzLmNlbGxzLnB1c2goW10pO1xuICAgICAgZm9yKGxldCB4ID0gMDsgeCA8IDU7IHgrKykge1xuICAgICAgICB0aGlzLmNlbGxzW3ldW3hdID0gbmV3IENlbGwodGhpcywgeCwgeSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHVwZGF0ZShkdCkge1xuICAgIHRoaXMuZ3JhcGguY2xlYXIoKTtcblxuICAgIGZvcihsZXQgeSA9IDA7IHkgPCB0aGlzLmNlbGxzLmxlbmd0aDsgeSsrKSB7XG4gICAgICBmb3IobGV0IHggPSAwOyB4IDwgdGhpcy5jZWxsc1t5XS5sZW5ndGg7IHgrKykge1xuICAgICAgICB0aGlzLmNlbGxzW3ldW3hdLnVwZGF0ZShkdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2VsbHNNYW5hZ2VyO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZUJnKHN0YXRlLCBzaXplPTEwMCwgYXg9MjAsIGF5PTIwKSB7XG4gICAgbGV0IGJnID0gc3RhdGUuYWRkLmdyYXBoaWNzKCk7XG4gICAgYmcuYmVnaW5GaWxsKDB4RkZGRkZGLCAxKTtcbiAgICBiZy5kcmF3UmVjdCgwLCAwLCBzdGF0ZS5nYW1lLndpZHRoLCBzdGF0ZS5nYW1lLmhlaWdodCk7XG4gICAgYmcuZW5kRmlsbCgpO1xuXG4gICAgYmcubGluZVN0eWxlKDQsIDB4MmUyZTQ0LCAuMSk7XG5cbiAgICBmb3IobGV0IHggPSAwOyB4IDwgYXg7IHgrKykge1xuICAgICAgYmcubW92ZVRvKHNpemUqeCwgMCk7XG4gICAgICBiZy5saW5lVG8oc2l6ZSp4LCBzdGF0ZS5nYW1lLmhlaWdodCk7XG4gICAgfVxuICAgIGZvcihsZXQgeSA9IDA7IHkgPCBheTsgeSsrKSB7XG4gICAgICBiZy5tb3ZlVG8oMCwgc2l6ZSp5KTtcbiAgICAgIGJnLmxpbmVUbyhzdGF0ZS5nYW1lLndpZHRoLCBzaXplKnkpO1xuICAgIH1cblxuICAgIHJldHVybiBiZztcbiAgfVxufVxuIiwiY2xhc3MgQ2VsbCB7XG4gIGNvbnN0cnVjdG9yKG1hbmFnZXIsIHgsIHkpIHtcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuc3RhdGUgPSBtYW5hZ2VyLnN0YXRlO1xuXG4gICAgdGhpcy5zaXplID0gdGhpcy5zdGF0ZS5nYW1lLndpZHRoLzU7XG4gICAgdGhpcy54ID0geCp0aGlzLnNpemU7XG4gICAgdGhpcy55ID0gLXkqdGhpcy5zaXplO1xuXG4gICAgdGhpcy5jZWxsID0gdGhpcy5zdGF0ZS5hZGQuc3ByaXRlKHRoaXMueCwgdGhpcy55LCAnY2VsbCcpO1xuICAgIHRoaXMuY2VsbC53aWR0aCA9IHRoaXMuc2l6ZTtcbiAgICB0aGlzLmNlbGwuaGVpZ2h0ID0gdGhpcy5zaXplO1xuICAgIHRoaXMuY2VsbC50aW50ID0gTWF0aC5yYW5kb20oKSA8IDAuMyA/IDB4MDAwMDAwIDogMHhGRkZGRkY7XG4gICAgdGhpcy5jZWxsLnRpbnQgPSBNYXRoLnJhbmRvbSgpIDwgMC4xID8gMHhjOTVjMjYgOiB0aGlzLmNlbGwudGludDtcblxuICAgIHRoaXMuY2VsbC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuY2VsbC5ldmVudHMub25JbnB1dFVwLmFkZCgoKSA9PiB7XG4gICAgICB0aGlzLmNlbGwudGludCA9IDB4Q0NDQ0NDO1xuICAgIH0pO1xuICB9XG4gIHVwZGF0ZShkdCkge1xuICAgIHRoaXMuY2VsbC55ICs9IDY7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDZWxsO1xuIiwiY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3Ioc3RhdGUpIHtcbiAgICB0aGlzLmNpcmNsZSA9IHN0YXRlLmFkZC5ncmFwaGljcygpO1xuICAgIHRoaXMuY2lyY2xlLmJlZ2luRmlsbCgweDJlMmU0NCwgMSk7XG4gICAgdGhpcy5jaXJjbGUubGluZVN0eWxlKDIsIDB4MmUyZTQ0LCAuNSk7XG4gICAgdGhpcy5jaXJjbGUuZHJhd0NpcmNsZShzdGF0ZS5nYW1lLndpZHRoLzIsIHN0YXRlLmdhbWUuaGVpZ2h0LzIrNDAwLCAxMDApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuIiwiY2xhc3MgQm9vdCB7XG5cdGluaXQoKSB7XG5cdH1cblxuXHRjcmVhdGUoKSB7XG5cdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuXHRcdHRoaXMuc2NhbGUuZnVsbFNjcmVlblNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuRVhBQ1RfRklUO1xuXHRcdHRoaXMuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xuXHRcdHRoaXMuc2NhbGUuc2V0TWF4aW11bSgpO1xuXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm9vdDtcbiIsImNvbnN0IHVpID0gcmVxdWlyZSgnLi4vbWl4aW5zL3VpJyk7XG5cbmNsYXNzIE1lbnUge1xuXHRjcmVhdGUoKSB7XG5cdFx0dGhpcy5iZyA9IHVpLmNyZWF0ZUJnKHRoaXMsIHRoaXMuZ2FtZS53aWR0aC81LCA1LCAxMCk7XG5cbiAgICB0aGlzLmxhYmVsID0gdGhpcy5hZGQudGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgMzAwLCBcIk1vdHRpb25cIiwge1xuICAgICAgZm9udDogJ09waWZpY2lvJyxcbiAgICAgIGZvbnRTaXplOiA2NCxcbiAgICAgIGZvbnRXZWlnaHQ6IDEwMCxcbiAgICAgIGZpbGw6IFwicmdiKDUyLCA2MSwgODQpXCJcbiAgICB9KTtcbiAgICB0aGlzLmxhYmVsLmFuY2hvci5zZXQoMC41KTtcblxuICAgIHRoaXMudGV4dCA9IHRoaXMuYWRkLnRleHQodGhpcy5nYW1lLndpZHRoLzIsIDM1MCwgXCJob3BlbGVzc25lc3MgaW4gbW90aW9uLi4uXCIsIHtcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXG4gICAgICBmb250U2l6ZTogNDIsXG4gICAgICBmb250V2VpZ2h0OiA2MDAsXG4gICAgICBmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXG4gICAgfSk7XG4gICAgdGhpcy50ZXh0LmFuY2hvci5zZXQoMC41KTtcblxuICAgIHRoaXMuYnRuID0gdGhpcy5hZGQuZ3JhcGhpY3MoKTtcbiAgICB0aGlzLmJ0bi5iZWdpbkZpbGwoMHgyZTJlNDQsIDEpO1xuICAgIHRoaXMuYnRuLmxpbmVTdHlsZSgyLCAweDJlMmU0NCwgLjUpO1xuICAgIHRoaXMuYnRuLmRyYXdDaXJjbGUodGhpcy5nYW1lLndpZHRoLzIsIHRoaXMuZ2FtZS5oZWlnaHQvMisxMDAsIDIwMCk7XG5cblx0XHR0aGlzLmlucHV0Lm9uRG93bi5hZGRPbmNlKCgpID0+IHtcblx0XHRcdHRoaXMuc3RhdGUuc3RhcnQoJ1BsYXlncm91bmQnKTtcblx0XHR9LCB0aGlzKTtcblx0fVxuXHR1cGRhdGUoKSB7XG5cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7XG4iLCJjb25zdCB1aSA9IHJlcXVpcmUoJy4uL21peGlucy91aScpO1xuY29uc3QgQ2VsbHNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbWFuYWdlcnMvQ2VsbHNNYW5hZ2VyJyk7XG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuLi9vYmplY3RzL1BsYXllcicpO1xuXG5jbGFzcyBQbGF5Z3JvdW5kIHtcblx0Y3JlYXRlKCkge1xuXHRcdC8vIHRoaXMuYmcgPSB1aS5jcmVhdGVCZyh0aGlzLCAxNTQsIDEwLCAxNSk7XG5cbiAgICB0aGlzLmxhYmVsID0gdGhpcy5hZGQudGV4dCgxMDAsIDEwMCwgXCJFeGlzdGVuY2U6XCIsIHtcbiAgICAgIGZvbnQ6ICdPcGlmaWNpbycsXG4gICAgICBmb250U2l6ZTogOTQsXG4gICAgICBmb250V2VpZ2h0OiA0MDAsXG4gICAgICBmaWxsOiBcInJnYig1MiwgNjEsIDg0KVwiXG4gICAgfSk7XG5cbiAgICB0aGlzLnNjb3JlID0gdGhpcy5hZGQudGV4dCgxMDAsIDIwMCwgXCI1NnNcIiwge1xuICAgICAgZm9udDogJ09waWZpY2lvJyxcbiAgICAgIGZvbnRTaXplOiA3MixcbiAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgIGZpbGw6IFwicmdiKDUyLCA2MSwgODQpXCJcbiAgICB9KTtcblxuICAgIHRoaXMuY2VsbHNNYW5hZ2VyID0gbmV3IENlbGxzTWFuYWdlcih0aGlzKTtcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcyk7XG5cdH1cblx0dXBkYXRlKGR0KSB7XG4gICAgdGhpcy5jZWxsc01hbmFnZXIudXBkYXRlKGR0KTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXlncm91bmQ7XG4iLCJcbmNsYXNzIFByZWxvYWQge1xuXHRpbml0KCkge1xuXHR9XG5cdHByZWxvYWQoKSB7XG5cdFx0dGhpcy5sb2FkLmltYWdlKCdjZWxsJywgJ2Fzc2V0cy9jZWxsLnBuZycpO1xuXHR9XG5cblx0Y3JlYXRlKCkge1xuXHRcdHRoaXMuc3RhdGUuc3RhcnQoJ01lbnUnKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZWxvYWQ7XG4iXX0=
