/*
  Класс Player, взаимодействует с MapManager
  События
    collision => collision block
    moved
    deaded

    actionImmunity
    actionTop
    actionLeft
    actionRight
*/

class Player extends PIXI.Sprite {
  constructor(scene, map) {
    super(PIXI.Texture.fromImage('player'));

    this.game = scene.game;
    this.scene = scene;
    this.map = map;

    this.anchor.set(.5, 1);
    this.scale.set(.7);
    this.x = this.game.w/2+5;
    this.y = this.game.h-this.map.blockSize*2;

    this.walking = PIXI.tweenManager.createTween(this);
    this.walking.from({y: this.y}).to({y: this.y-15});
    this.walking.time = 800;
    this.walking.loop = true;
    this.walking.pingPong = true;
    this.walking.start();

    this.lastMove = null;
    this.speed = this.map.speed || 500;
    this.isDead = false;

    this.IMMUNITY_BLOCKS = 2;
    this.immunityCount = 5;
    this.isImmunity = false;
  }
  moving() {
    if(this.isDead || this.isImmunity) return;

    let cur = this.map.getBlockFromPos({x: this.x, y: this.y});
    if(cur && cur.isActive) {
      this.emit('collision', cur);

      if(cur.playerDir === 'top') return this.top();
      if(cur.playerDir === 'left') return this.left();
      if(cur.playerDir === 'right') return this.right();

      //check top
      let top = this.map.getBlockFromPos({x: this.x, y: this.y-this.map.blockSize});
      if(top && top.isActive && this.lastMove !== 'bottom') return this.top();

      // check left
      let left = this.map.getBlockFromPos({x: this.x-this.map.blockSize, y: this.y});
      if(left && left.isActive && this.lastMove !== 'right') return this.left();

      // check rigth
      let right = this.map.getBlockFromPos({x: this.x+this.map.blockSize, y: this.y});
      if(right && right.isActive && this.lastMove !== 'left') return this.right();

      // or die
      this.top();
    } else this.dead();

    this.emit('moved');
  }
  dead() {
    this.walking.stop();
    this.isDead = true;

    let dead = PIXI.tweenManager.createTween(this.scale);
    dead.from(this.scale).to({x: 0, y: 0});
    dead.time = 200;
    dead.start();
    dead.on('end', () => this.emit('deaded'));
  }
  immunity() {
    if(!this.immunityCount) return;

    let immunity = PIXI.tweenManager.createTween(this);
    immunity.from({alpha: .5}).to({alpha: 1});
    immunity.time = this.speed*this.IMMUNITY_BLOCKS;
    immunity.start();

    this.map.scrollDown(this.IMMUNITY_BLOCKS);
    immunity.on('end', () => this.isImmunity = false);
    this.isImmunity = true;
    this.lastMove = 'top';
    this.immunityCount--;

    this.emit('actionImmunity');
  }
  top() {
    this.lastMove = 'top';
    this.map.scrollDown(1);

    this.emit('actionTop');
  }
  left() {
    this.lastMove = 'left';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x-this.map.blockSize-20});
    move.time = this.speed/2;
    move.start();

    move.on('end', () => this.moving());
    this.emit('actionLeft');
  }
  right() {
    this.lastMove = 'right';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x+this.map.blockSize+20});
    move.time = this.speed/2;
    move.start();

    move.on('end', () => this.moving());
    this.emit('actionRight');
  }
}

module.exports = Player;
