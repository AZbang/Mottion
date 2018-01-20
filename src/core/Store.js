class Store {
  constructor(game) {
    this.game = game;
  }
  saveSettings(settings) {
    localStorage.setItem('langIndex', settings.langIndex);
    localStorage.setItem('music', settings.music);
    localStorage.setItem('sounds', settings.sounds);
    localStorage.setItem('filters', settings.filters);
  }
  saveGameplay(gameplay) {
    localStorage.setItem('score', gameplay.score);
    localStorage.setItem('checkpoint', gameplay.checkpoint);
  }
  getSettings() {
    return {
      langIndex: localStorage.getItem('langIndex') || 0,
      music: localStorage.getItem('music') || true,
      sounds: localStorage.getItem('sounds') || true,
      filters: localStorage.getItem('filters') || true
    }
  }
  getGameplay() {
    return {
      score: localStorage.getItem('score') || 0,
      checkpoint: localStorage.getItem('checkpoint') || 0
    }
  }
}

module.exports = Store;
