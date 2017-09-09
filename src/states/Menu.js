const ui = require('../mixins/ui');
const Entity = require('../objects/Entity');

class Menu {
	init(score = 0) {
		if(localStorage.getItem("score") < score || !localStorage.getItem("score"))
			localStorage.setItem("score", score);

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

		this.currentScore = this.add.text(this.game.width/2, 450, 'CURRENT SCORE: ' + score, {
      font: 'Opificio',
      fontSize: 42,
      fontWeight: 500,
      fill: "rgb(52, 61, 84)"
    });
    this.currentScore.anchor.set(0.5);

		this.bestScore = this.add.text(this.game.width/2, 550, 'BEST SCORE: ' + localStorage.getItem('score'), {
      font: 'Opificio',
      fontSize: 42,
      fontWeight: 500,
      fill: "rgb(52, 61, 84)"
    });
    this.bestScore.anchor.set(0.5);

    this.btn = new Entity(this, this.game.width/2, this.game.height/2+100, 200, true, 5);
		this.btn.inputEnabled = true;
		this.btn.events.onInputUp.addOnce(() => {
			ui.goTo(this, 'Playground');
		});
		this.add.existing(this.btn);
	}
	update() {
		this.btn.rotation += .02;
	}
}

module.exports = Menu;
