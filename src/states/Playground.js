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
