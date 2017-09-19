const ui = require('../mixins/ui');
const Entity = require('../objects/Entity');

class Menu {
	init(score = 0) {
		if(localStorage.getItem("score") < score || !localStorage.getItem("score"))
			localStorage.setItem("score", score);

		this.bg = ui.createBg(this, this.game.width/5, 5, 10);

		// this.colorsClouds = this.add.sprite(0, 0, 'colors-clouds');
		// this.add.tween(this.colorsClouds)
		// 	.to({height: this.colorsClouds.height+150}, 4000)
		// 	.to({height: this.colorsClouds.height}, 4000)
		// 	.yoyo()
		// 	.loop()
		// 	.start();
		//
		// this.grayClouds = this.add.sprite(0, this.game.height, 'gray-clouds');
		// this.grayClouds.anchor.set(0, 1);
		// this.add.tween(this.grayClouds)
		// 	.to({height: this.grayClouds.height+100}, 3000)
		// 	.to({height: this.grayClouds.height}, 3000)
		// 	.yoyo()
		// 	.loop()
		// 	.start();
		//
		//
		// this.partGrayCloud = this.add.sprite(0, 425, 'part-gray-cloud');
		// this.add.tween(this.partGrayCloud)
		// 	.to({y: this.partGrayCloud.y+60}, 5000)
		// 	.to({y: this.partGrayCloud.y}, 5000)
		// 	.yoyo()
		// 	.loop()
		// 	.start();
		//
		// this.partColorsCloud1 = this.add.sprite(62, 760, 'part-colors-cloud');
		// this.add.tween(this.partColorsCloud1)
		// 	.to({y: this.partColorsCloud1.y+80}, 4000)
		// 	.to({y: this.partColorsCloud1.y}, 4000)
		// 	.yoyo()
		// 	.loop()
		// 	.start();
		//
		// this.partColorsCloud2 = this.add.sprite(470, 680, 'part-colors-cloud');
		// this.add.tween(this.partColorsCloud2)
		// 	.to({y: this.partColorsCloud2.y+70}, 3000)
		// 	.to({y: this.partColorsCloud2.y}, 3000)
		// 	.yoyo()
		// 	.loop()
		// 	.start();

		this.play = this.add.sprite(this.game.width/2, 550, 'play');
		this.play.anchor.set(.5);
		this.play.inputEnabled = true;
		this.play.events.onInputUp.addOnce(() => {
			// this.add.tween(this.grayClouds)
			// 	.to({y: this.game.height+1500}, 500)
			// 	.start();
			//
			// this.add.tween(this.partColorsCloud1)
			// 	.to({y: this.game.height+1000}, 1000)
			// 	.start();
			//
			// this.add.tween(this.partColorsCloud2)
			// 	.to({y: this.game.height+1000}, 1000)
			// 	.start();
			//
			// this.add.tween(this.partGrayCloud)
			// 	.to({y: -1000}, 1000)
			// 	.start();
			//
			let tween = this.add.tween(this.play)
				.to({rotation: Math.PI/2}, 100)
				.to({width: this.play.width+20, height: this.play.height+20}, 100)
				.start();

			tween.onComplete.add(() => {
				ui.goTo(this, 'Playground');
			});
		});

		this.add.sprite(this.game.width/2, 770, 'star').anchor.set(.5);
		this.settings = this.add.sprite(this.game.width/2, 1000, 'settings');
		this.settings.anchor.set(.5);
		this.settings.inputEnabled = true;
		this.settings.events.onInputUp.addOnce(() => {
			let tween = this.add.tween(this.settings)
				.to({rotation: Math.PI/2}, 100)
				.to({width: this.settings.width+20, height: this.settings.height+20}, 100)
				.start();

			tween.onComplete.add(() => {
				ui.goTo(this, 'Settings');
			});
		});

    this.label = this.add.text(this.game.width/2, 140, "Mottion", {
      font: 'Opificio',
      fontSize: 100,
      fontWeight: 100,
			fontWeight: 600,
      fill: "#555dff"
    });
    this.label.anchor.set(0.5);

    this.text = this.add.text(this.game.width/2, 230, "Sens in the way", {
      font: 'Opificio',
      fontSize: 60,
      fontWeight: 600,
      fill: "#555dff"
    });
    this.text.anchor.set(0.5);
		//
		this.scores = this.add.text(this.game.width/2, 350, score + ' | ' + localStorage.getItem('score'), {
      font: 'Roboto',
      fontSize: 62,
      fontWeight: 800,
      fill: "#555dff"
    });
    this.scores.anchor.set(0.5);
	}
	update() {
		// this.btn.rotation += .02;
	}
}

module.exports = Menu;
