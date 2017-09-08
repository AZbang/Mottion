
class Preload {
	init() {
	}
	preload() {
		this.load.image('cell', 'assets/cell.png');
		this.load.image('cell-open', 'assets/cell-open.png');
		this.load.image('cell2', 'assets/cell2.png');
		this.load.image('cell3', 'assets/cell3.png');

		this.load.image('bg', 'assets/bg.png');
		this.load.image('player', 'assets/player.png');
		this.load.image('island', 'assets/island.png');
		this.load.image('flag', 'assets/flag.png');
	}

	create() {
		this.state.start('Menu');
	}
}

module.exports = Preload;
