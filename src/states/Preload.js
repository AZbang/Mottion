class Preload {
	init() {
	}
	preload() {
		this.load.image('bg', 'assets/bg.png');
		this.load.image('player', 'assets/player.png');

		// cells
		this.load.image('cell1', 'assets/cells/cell1.png');
		this.load.image('cell2', 'assets/cells/cell2.png');
		this.load.image('cell3', 'assets/cells/cell3.png');
		this.load.image('cell4', 'assets/cells/cell4.png');

		this.load.image('cell1-fill', 'assets/cells/cell1-fill.png');
		this.load.image('cell4-fill', 'assets/cells/cell4-fill.png');

		// island
		this.load.image('island', 'assets/island/island.png');
		this.load.image('flag', 'assets/island/flag.png');
		this.load.image('cloud', 'assets/island/cloud.png');

		// ui
		this.load.image('play', 'assets/ui/play.png');
		this.load.image('settings', 'assets/ui/settings.png');
		this.load.image('star', 'assets/ui/star.png');
		this.load.image('time', 'assets/ui/time.png');
		this.load.image('plane', 'assets/ui/plane.png');

		// menu
		this.load.image('gray-clouds', 'assets/menu/grayclouds.png');
		this.load.image('colors-clouds', 'assets/menu/colorsclouds.png');
		this.load.image('part-gray-cloud', 'assets/menu/partgraycloud.png');
		this.load.image('part-colors-cloud', 'assets/menu/partcolorscloud.png');

		// music
		this.load.audio('music', 'assets/music/bensound-anewbeginning.mp3');
	}

	create() {
		let music = this.add.audio('music');
		music.loopFull(0.6);

		this.state.start('Menu');
	}
}

module.exports = Preload;
