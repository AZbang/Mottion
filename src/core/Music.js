const {Howl, Howler} = require('howler');

class Music extends PIXI.utils.EventEmitter {
  constructor(game) {
    super();

    this.game = game;
    this.player = {};
    this.coefBit = 1;
  }
  add(name, src, params) {
    this.player[name] = new Howl(Object.assign({src: [src], preload: true}, params));
    return this;
  }
  play(name) {
    if(!this.player[name]) return;
    this.player[name].play();
    this.player[name].seek(0);
  }
  stop(name) {
    this.player[name] && this.player[name].stop();
  }
  analyzer() {
    this.analyser = Howler.ctx.createAnalyser();
    Howler.masterGain.connect(this.analyser);
    this.analyser.connect(Howler.ctx.destination);

    this.analyseData = new Uint8Array(this.analyser.frequencyBinCount);
    setInterval(() => {
      this.analyser.getByteTimeDomainData(this.analyseData)
      this.coefBit = this.analyseData.reduce((sum, i) => sum+=i)/1024/128;
    }, 100);
  }
  toggleMusic(v) {
    for(let key in this.player) {
      if(key.search('_music') !== -1) this.player[key].volume(v);
    }
  }
  toggleSounds(v) {
    for(let key in this.player) {
      if(key.search('_sound') !== -1) this.player[key].volume(v);
    }
  }
}

module.exports = Music;
