
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
