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
