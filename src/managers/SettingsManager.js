class SettingsManager {
  constructor(game) {
    this.game = game;

    this.filters = true;
    this.sounds = true;
    this.music = true;
    this.langs = ['en', 'ru'];
    this.langIndex = 0;
  }
  get lang() {
    return this.langs[this.langIndex];
  }
  toggleFilters() {

  }
  toggleSounds() {

  }
  toggleMusic() {

  }
  setLang(id) {

  }
}

module.exports = SettingsManager;
