const ui = require('../mixins/ui');
const CellsManager = require('../managers/CellsManager');
const Player = require('../objects/Player');
const Entity = require('../objects/Entity');

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

		this.island = this.add.sprite(0, this.game.height+10, 'island');
		this.island.anchor.set(0, 1);
		this.island.width = this.cellsManager.sizeCell*5;
		this.island.height = this.cellsManager.sizeCell*5;

		this.player = new Player(this);

		this.add.sprite(200, this.game.height-256, 'flag');
		this.add.sprite(600, this.game.height-356, 'flag').scale.x *= -1;
		this.add.sprite(400, this.game.height-400, 'flag').scale.x *= -1;
		this.add.sprite(100, this.game.height-300, 'flag');

		for(let y = 0; y < 5; y++) {
			for(let x = 0; x < this.game.width/50; x++) {
				let px = x*this.rnd.between(40, 60);
				let py = this.game.height-y*this.rnd.between(20, 50);
				new Entity(this, px, py, this.rnd.between(30, 50), false);
			}
		}

	}
	addScore(v) {
		let num = this.score += v;

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
