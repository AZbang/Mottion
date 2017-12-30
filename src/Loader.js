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
    this.loader = new PIXI.loaders.Loader('assets/')
      .add('bg', 'bg.png')
      .add('thlen', 'thlen.png')
      .add('blocks', 'spritesheets/blocks.json')
      .add('player', 'spritesheets/player.json')
      .add('displacement', 'filters/displacement.png')
      .add('noise', 'filters/noise_grayscale.png')
      .add('particle', 'filters/particle.png')
      .add('history_family', 'history/family.png')
      .add('music', 'sounds/music.mp3')
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
