const ui = require('../mixins/ui');
const CellsManager = require('../managers/CellsManager');
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

		this.island = this.add.sprite(0, this.game.height, 'island');
		this.island.anchor.set(0, 1);
		this.island.width = this.cellsManager.sizeCell*5;
		this.island.height = this.cellsManager.sizeCell*5;

		this.player = new Player(this);

	}
	addScore() {
		let num = ++this.score;

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
