class Store {
  constructor(game) {
    this.game = game;
  }
  saveSettings(settings) {
    localStorage.setItem('langIndex', +settings.langIndex);
    localStorage.setItem('music', +settings.music);
    localStorage.setItem('sounds', +settings.sounds);
    localStorage.setItem('filters', +settings.filters);
  }
  saveGameplay(gameplay) {
    localStorage.setItem('score', +gameplay.score);
    localStorage.setItem('checkpoint', +gameplay.checkpoint);
  }
  getSettings() {
    return {
      langIndex: localStorage.getItem('langIndex'),
      music: localStorage.getItem('music'),
      sounds: localStorage.getItem('sounds'),
      filters: localStorage.getItem('filters')
    }
  }
  getGameplay() {
    return {
      score: localStorage.getItem('score'),
      checkpoint: localStorage.getItem('checkpoint'),
      activateType: localStorage.getItem('activateType')
    }
  }
}

module.exports = Store;
