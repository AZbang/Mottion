const screenfull = require('screenfull');

class Settings {
  constructor(game) {
    this.game = game;

    Object.assign(this, {
      sounds: true,
      music: true,
      langIndex: 0
    }, this.game.store.getSettings());

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
