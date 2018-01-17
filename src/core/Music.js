class Music {
  constructor(game) {
    this.game = game;

    this.sounds = ['sound_fire', 'sound_noise', 'sound_run'];
    this.music = ['music_november', 'music_slowmotion', 'music_sadday'];
  }
  play(id) {
    PIXI.sound.play(id);
  }
  stop(id) {
    PIXI.sound.stop(id);
  }
  playMusic(play) {
    this.musics.forEach((id) => {
      play ? PIXI.sound.stop(id) : PIXI.sound.stop(id);
    });
  }
  playSounds(play) {
    this.sounds.forEach((id) => {
      play ? PIXI.sound.stop(id) : PIXI.sound.stop(id);
    });
  }
}

module.exports = Music;
