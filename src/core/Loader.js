const WebFont = require('webfontloader');

class Loader {
  constructor() {
    this.banner = document.createElement('img');
    this.banner.src = 'assets/icon.png';
    this.banner.style.position = 'absolute';
    this.banner.style.top = (window.innerHeight/2-100) + 'px';
    this.banner.style.left = (window.innerWidth/2-100) + 'px';
    document.body.appendChild(this.banner);
  }
  showBanner() {
    document.body.style.background = '#1a1a1e';
    this.banner.style.display = 'block';
  }
  hideBanner() {
    document.body.style.background = '#000';
    this.banner.style.display = 'none';
  }
  loadResources(loaded) {
    this.showBanner();

    PIXI.loader
      .add('bg', 'assets/spritesheets/bg.png')
      .add('vignette', 'assets/spritesheets/vignette.png')
      .add('spritesheet', 'assets/spritesheets/spritesheet.json')
      // .add('music_morale', 'assets/sounds/morale.mp3')
      // .add('music_spirit', 'assets/sounds/spirit.mp3')

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
      google: {
        families: ['Montserrat']
      },
      active: () => setTimeout(cb, 1000)
    });
  }
}

module.exports = Loader;
