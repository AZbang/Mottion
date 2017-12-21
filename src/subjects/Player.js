/*
  Класс Player, взаимодействует с MapManager
  События

*/

class Player extends PIXI.projection.Sprite2d {
  constructor(scene, map) {
    super(PIXI.Texture.fromImage('player'));
    scene.addChild(this);

    this.game = scene.game;
    this.scene = scene;
    this.map = map;

    this.proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.anchor.set(.5, 1);
    this.scale.set(.5);
    this.x = this.game.w/2;
    this.y = this.game.h-this.map.blockSize/2-this.scene.PADDING_BOTTOM;

    this.walking = PIXI.tweenManager.createTween(this.scale);
    this.walking.from({x: .5, y: .5}).to({x: .6, y: .6});
    this.walking.time = 500;
    this.walking.loop = true;
    this.walking.pingPong = true;
    this.walking.start();

    this.lastMove = null;
    this.speed = this.map.speed || 500;
    this.isDead = false;

    this.IMMUNITY_BLOCKS = 2;
    this.immunityCount = 1;
    this.isImmunity = false;
  }
  moving() {
    if(this.isDead || this.isImmunity) return;

    let cur = this.map.getBlockFromPos({x: this.x, y: this.y+this.map.blockSize});
    if(cur && cur.isActive) {
      if(cur.playerDir === 'top') return this.top();
      if(cur.playerDir === 'left') return this.left();
      if(cur.playerDir === 'right') return this.right();

      //check top
      let top = this.map.getBlockFromPos({x: this.x, y: this.y});
      if(top && top.isActive && this.lastMove !== 'bottom') return this.top();

      // check left
      let left = this.map.getBlockFromPos({x: this.x-this.map.blockSize, y: this.y+this.map.blockSize});
      if(left && left.isActive && this.lastMove !== 'right') return this.left();

      // check rigth
      let right = this.map.getBlockFromPos({x: this.x+this.map.blockSize, y: this.y+this.map.blockSize});
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
    dead.from({x: .5, y: .5}).to({x: 0, y: 0});
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
    move.from({x: this.x}).to({x: this.x-this.map.blockSize});
    move.time = this.speed/2;
    move.start();

    move.on('end', () => this.moving());
    this.emit('actionLeft');
  }
  right() {
    this.lastMove = 'right';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x+this.map.blockSize});
    move.time = this.speed/2;
    move.start();

    move.on('end', () => this.moving());
    this.emit('actionRight');
  }
}

module.exports = Player;
