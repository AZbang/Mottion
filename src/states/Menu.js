const ui = require('../mixins/ui');
const Entity = require('../objects/Entity');

class Menu {
	create() {
		this.bg = ui.createBg(this, this.game.width/5, 5, 10);

    this.label = this.add.text(this.game.width/2, 300, "Mottion", {
      font: 'Opificio',
      fontSize: 64,
      fontWeight: 100,
			fontWeight: 600,
      fill: "rgb(52, 61, 84)"
    });
    this.label.anchor.set(0.5);

    this.text = this.add.text(this.game.width/2, 350, "hopelessness in motion...", {
      font: 'Opificio',
      fontSize: 42,
      fontWeight: 600,
      fill: "rgb(52, 61, 84)"
    });
    this.text.anchor.set(0.5);

    this.btn = new Entity(this, this.game.width/2, this.game.height/2+100, 200, true, 5);
		this.btn.inputEnabled = true;
		this.btn.events.onInputUp.addOnce(() => {
			this.state.start('Playground');
		});
	}
	update() {
		this.btn.rotation += .02;
	}
}

module.exports = Menu;
