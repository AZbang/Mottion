class Loader {
  constructor(bannerUrl, onLoaded) {
    this.bannerUrl = bannerUrl;
    this.onLoaded = onLoaded;

    this.banner = document.createElement('img');
    this.banner.src = bannerUrl;
    this.banner.style.position = 'absolute';
    this.banner.style.top = (window.innerHeight/2-100) + 'px';
    this.banner.style.left = (window.innerWidth/2-256) + 'px';
    document.body.appendChild(this.banner);

    this.showBanner();
    this._loadResources();
  }
  showBanner() {
    this.banner.style.display = 'block';
  }
  hideBanner() {
    this.banner.style.display = 'none';
    this.onLoaded && this.onLoaded();
  }
  _loadResources() {
    PIXI.loader
      .add('bg', 'assets/bg.png')
      .add('thlen', 'assets/thlen.png')
      .add('cloud', 'assets/cloud.png')

      .add('player', 'assets/spritesheets/player.json')
      .add('blocks', 'assets/spritesheets/blocks.json')

      .add('displacement', 'assets/filters/displacement.png')
      .add('noise', 'assets/filters/noise_grayscale.png')
      .add('particle', 'assets/filters/particle.png')

      .add('history_family', 'assets/history/family.png')

      .add('music_sadday', 'assets/sounds/bensound-sadday.mp3')
      .add('sound_fire', 'assets/sounds/fire.mp3')
      .add('sound_noise', 'assets/sounds/noise.mp3')
      .add('sound_run', 'assets/sounds/run.mp3')

      .load(() => this._loadFonts(() => this.hideBanner()));
  }
  _loadFonts(cb) {
    WebFont.load({
      google: {
        families: ['Amatic SC']
      },
      custom: {
        families: ['Opificio Bold'],
        urls: ['assets/fonts/fonts.css']
      },
      timeout: 1000,
      active: cb
    });
  }
}

module.exports = Loader;
