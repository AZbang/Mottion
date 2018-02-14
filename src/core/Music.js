require('pixi-sound');

class Music {
  constructor(game) {
    this.game = game;

    this.sounds = ['sound_fire', 'sound_noise', 'sound_run'];
    this.musics = ['music_mantra', 'music_spirit', 'music_morale'];
  }
  playSound(id, params) {
    PIXI.sound.play('sound_' + id, params);
  }
  stopSound(id) {
    PIXI.sound.stop('sound_' + id);
  }
  playAllMusicsLoop(i=0) {
    PIXI.sound.play(this.musics[i], {
      complete: () => {
        if(i < this.musics.length-2) this.allMusicsLoop(i+1);
        else this.allMusicsLoop(0);
      }
    })
  }
  stopAllMusicsLoop() {
    this.musics.forEach((id) => {
      PIXI.sound.stop(id);
    });
  }
  playMusic(id, params) {
    PIXI.sound.play('music_' + id, params);
  }
  stopMusic(id) {
    PIXI.sound.stop('music_' + id);
  }
  toggleMusic(play) {
    this.musics.forEach((id) => {
      play ? PIXI.sound.volume(id, 1) : PIXI.sound.volume(id, 0);
    });
  }
  toggleSounds(play) {
    this.sounds.forEach((id) => {
      play ? PIXI.sound.volume(id, 1) : PIXI.sound.volume(id, 0);
    });
  }
}

module.exports = Music;
