const screenfull = require('screenfull');

class Settings {
  constructor(game) {
    this.game = game;

    this.LANGS = ['en', 'ru'];

    let s = this.game.store.getSettings();
    this.toggleMusic(s.music != null ? +s.music : 1);
    this.toggleSounds(s.sounds != null ? +s.sounds : 1);
    this.setLang(s.langIndex != null ? +s.langIndex : 0);
    this.isFullscreen = false;
  }
  get lang() {
    return this.LANGS[this.langIndex];
  }
  toggleFullscreen() {
    screenfull.toggle();
  }
  toggleSounds(i) {
    this.sounds = i;
    this.game.audio.toggleSounds(this.sounds);
    this.game.store.saveSettings(this);
  }
  toggleMusic(i) {
    this.music = i;
    this.game.audio.toggleMusic(this.music);
    this.game.store.saveSettings(this);
  }
  setLang(id) {
    this.langIndex = id;
    this.game.store.saveSettings(this);
  }
}

module.exports = Settings;
