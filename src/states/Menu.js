const ui = require('../mixins/ui');

class Menu {
	create() {
		this.bg = ui.createBg(this, this.game.width/5, 5, 10);

    this.label = this.add.text(this.game.width/2, 300, "Mottion", {
      font: 'Opificio',
      fontSize: 64,
      fontWeight: 100,
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

    this.btn = this.add.graphics();
    this.btn.beginFill(0x2e2e44, 1);
    this.btn.lineStyle(2, 0x2e2e44, .5);
    this.btn.drawCircle(this.game.width/2, this.game.height/2+100, 200);

		this.input.onDown.addOnce(() => {
			this.state.start('Playground');
		}, this);
	}
	update() {

	}
}

module.exports = Menu;
