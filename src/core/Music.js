const {Howl, Howler} = require('howler');

class Music extends PIXI.utils.EventEmitter {
  constructor(game) {
    super();

    this.game = game;
    this.player = {};
  }
  add(name, src, params) {
    this.player[name] = new Howl(Object.assign({src: [src], preload: true}, params));
    return this;
  }
  analyzer() {
    this.analyser = Howler.ctx.createAnalyser();
    Howler.masterGain.connect(this.analyser);
    this.analyser.connect(Howler.ctx.destination);

    this.analyseData = new Uint8Array(this.analyser.frequencyBinCount);
    setInterval(() => this.analyser.getByteTimeDomainData(this.analyseData), 100);
  }
  toggleMusic(v) {
    for(let key in this.player) {
      if(key.find('_music') !== -1) this.player[key].volue(v);
    }
  }
  toggleSounds(v) {
    for(let key in this.player) {
      if(key.find('_sound') !== -1) this.player[key].volue(v);
    }
  }
}

module.exports = Music;
