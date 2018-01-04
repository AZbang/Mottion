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

const RUN_TOP = [];
for(let i = 0; i < 8; i++) {
  let texture = PIXI.Texture.fromImage('player_run_top_' + (i+1));
  RUN_TOP.push({texture, time: 70});
}

const RUN_LEFT = [];
for(let i = 0; i < 5; i++) {
  let texture = PIXI.Texture.fromImage('player_run_left_' + (i+1));
  RUN_LEFT.push({texture, time: 70});
}

class Player extends PIXI.extras.AnimatedSprite {
  constructor(scene, map) {
    super(RUN_TOP);

    this.game = scene.game;
    this.scene = scene;
    this.map = map;

    this.SCALE = .7;

    this.loop = true;
    this.anchor.set(.5, 1);
    this.scale.set(this.SCALE);
    this.x = this.game.w/2+5;
    this.y = this.game.h-this.map.tileSize*1;

    this.collisionPoint = new PIXI.Point(960, 716);

    this.walking = PIXI.tweenManager.createTween(this);
    this.walking.from({y: this.y}).to({y: this.y-15});
    this.walking.time = 800;
    this.walking.loop = true;
    this.walking.pingPong = true;
    this.walking.start();

    this.lastMove = null;
    this.speed = this.map.speed || 500;
    this.isDead = false;
    this.isStop = false;

    this.OFFSET_X = 20;
    this.IMMUNITY_BLOCKS = 1;
    this.immunityCount = 5;
  }
  moving() {
    if(this.isDead || this.isStop) return;

    let blocks = this.map.getNearBlocks(this.collisionPoint);
    if(blocks.center && blocks.center.active) {
      this.emit('moved');
      this.emit('collision', blocks.center);

      if(blocks.center.playerDir === 'top') return this.top();
      if(blocks.center.playerDir === 'left') return this.left();
      if(blocks.center.playerDir === 'right') return this.right();

      //check top
      if(blocks.top && blocks.top.active && this.lastMove !== 'bottom') return this.top();
      // check left
      if(blocks.left && blocks.left.active && this.lastMove !== 'right') return this.left();
      // check rigth
      if(blocks.right && blocks.right.active && this.lastMove !== 'left') return this.right();
      // or die
      this.top();
    } else this.dead();
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

    let block = this.map.getBlock({x: this.x, y: this.y-this.map.tileSize});
    if(block) {
      this.immunityCount--;
      block.activate('cell1-fill.png');

      this.emit('actionImmunity');
    }
  }
  startMove() {
    this.isStop = false;
    this.textures = RUN_TOP;
    this.scale.x = this.SCALE;
    this.walking.start();
    this.gotoAndPlay(0);
  }
  stopMove() {
    this.isStop = true;
    this.textures = RUN_TOP;
    this.scale.x = this.SCALE;
    this.walking.stop();
    this.gotoAndStop(0);

    this.emit('actionStop');
  }
  top() {
    if(this.lastMove !== 'top') {
      this.textures = RUN_TOP;
      this.scale.x = this.SCALE;
      this.gotoAndPlay(0);
    }

    this.lastMove = 'top';
    this.map.scrollDown(1);
    this.map.once('scrolledDown', () => this.moving());

    this.emit('actionTop');
  }
  left() {
    if(this.lastMove !== 'left') {
      this.scale.x = this.SCALE;
      this.textures = RUN_LEFT;
      this.gotoAndPlay(0);
    }

    this.lastMove = 'left';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x-this.map.tileSize-this.OFFSET_X});
    move.time = this.speed/2;
    move.start();

    this.collisionPoint.x -= this.map.tileSize;

    move.on('end', () => this.moving());
    this.emit('actionLeft');
  }
  right() {
    if(this.lastMove !== 'right') {
      this.scale.x = -this.SCALE;
      this.textures = RUN_LEFT;
      this.gotoAndPlay(0);
    }

    this.lastMove = 'right';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x+this.map.tileSize+this.OFFSET_X});
    move.time = this.speed/2;
    move.start();

    this.collisionPoint.x += this.map.tileSize;

    move.on('end', () => this.moving());
    this.emit('actionRight');
  }
}

module.exports = Player;
