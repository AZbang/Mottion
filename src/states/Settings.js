const ui = require('../mixins/ui');

class Settings {
	init() {
		this.bg = ui.createBg(this, this.game.width/5, 5, 10);

    this.label = this.add.text(this.game.width/2, 140, "Settings", {
      font: 'Opificio',
      fontSize: 100,
      fontWeight: 100,
			fontWeight: 600,
      fill: "#555dff"
    });
    this.label.anchor.set(0.5);


    this.sounds = this.add.text(this.game.width/2, 550, "Sounds | ON", {
      font: 'Opificio',
      fontSize: 60,
      fontWeight: 600,
      fill: "#555dff"
    });
    this.sounds.anchor.set(0.5);

    this.music = this.add.text(this.game.width/2, 650, "Music | OFF", {
      font: 'Opificio',
      fontSize: 60,
      fontWeight: 600,
      fill: "#555dff"
    });
    this.music.anchor.set(0.5);

    this.back = this.add.text(150, this.game.height-80, "Back", {
      font: 'Opificio',
      fontSize: 80,
      fontWeight: 600,
      fill: "#555dff"
    });
    this.back.anchor.set(0.5);
    this.back.inputEnabled = true;
    this.back.events.onInputUp.addOnce(() => {
      ui.goTo(this, 'Menu');
    });
	}
	update() {

	}
}

module.exports = Settings;
