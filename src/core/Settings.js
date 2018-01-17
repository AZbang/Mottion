class Settings {
  constructor(game) {
    this.game = game;

    Object.assign(this, {
      filters: true,
      sounds: true,
      music: true,
      langIndex: 0
    }, this.game.store.getSettings());
    
    this.LANGS = ['en', 'ru'];
  }
  get lang() {
    return this.LANGS[this.langIndex];
  }
  toggleSounds() {
    this.sounds = !this.sounds;
    this.game.audio.playSounds(this.sounds);
  }
  toggleMusic() {
    this.music = !this.music;
    this.game.audio.playMusic(this.music);
  }
  setLang(id) {
    this.langIndex = id;
  }
}

module.exports = Settings;
