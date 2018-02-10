const WebFont = require('webfontloader');

class Loader {
  constructor() {
  }
  showBanner() {
    document.body.style.background = '#fff';
  }
  hideBanner() {
    document.body.style.background = '#000';
  }
  loadResources(loaded) {
    this.showBanner();

    PIXI.loader
      .add('bg', 'assets/spritesheets/bg.png')
      .add('spritesheet', 'assets/spritesheets/spritesheet.json')
      .add('music_memories', 'assets/sounds/bensound-memories.mp3')
      .add('sound_fire', 'assets/sounds/fire.mp3')
      .add('sound_noise', 'assets/sounds/noise.mp3')
      .add('sound_run', 'assets/sounds/run.mp3')

      .load(() => this.loadFonts(() => {
        this.hideBanner();
        loaded && loaded();
      }));
  }
  loadFonts(cb) {
    WebFont.load({
      custom: {
        families: ['Milton Grotesque'],
        urls: ['assets/fonts/fonts.css']
      },
      timeout: 1000,
      active: cb
    });
  }
}

module.exports = Loader;
