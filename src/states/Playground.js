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
