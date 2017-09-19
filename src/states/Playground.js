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
