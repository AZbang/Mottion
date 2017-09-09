const CellsManager = require('../managers/CellsManager');
const CloudsManager = require('../managers/CloudsManager');
const IslandManager = require('../managers/IslandManager');
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
		this.islandManager = new IslandManager(this);
		this.player = new Player(this);
		this.cloudsManager = new CloudsManager(this);

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
		this.score = 0;
	}
	addScore(v) {
		this.score += v;
	 	this.scoreText.text = this.score;
	}
	update(dt) {
		this.cloudsManager.update(dt);
    this.cellsManager.update(dt);
		this.player.update(dt);
	}
}

module.exports = Playground;
