const screenfull = require('screenfull');

class Settings {
  constructor(game) {
    this.game = game;

    let s = this.game.store.getSettings();
    this.sounds = s.sounds != null ? +s.sounds : 1;
    this.music = s.music != null ? +s.music : 1;
    this.langIndex = s.langIndex != null ? +s.langIndex : 0;
    this.LANGS = ['en', 'ru'];
  }
  get lang() {
    return this.LANGS[this.langIndex];
  }
  toggleFullscreen() {
    screenfull.toggle();
  }
  toggleSounds() {
    this.sounds = !this.sounds;
    this.game.audio.toggleSounds(this.sounds);
    this.game.store.saveSettings(this);
  }
  toggleMusic() {
    this.music = !this.music;
    this.game.audio.toggleMusic(this.music);
    this.game.store.saveSettings(this);
  }
  setLang(id) {
    this.langIndex = id;
    this.game.store.saveSettings(this);
  }
}

module.exports = Settings;
