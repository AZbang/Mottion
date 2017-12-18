class Player extends PIXI.projection.Sprite2d {
  constructor(scene) {
    super(PIXI.Texture.fromImage('player'));

    this.scene = scene;
    this.game = scene.game;
    this.map = scene.map;

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
    this.isJump = false;
    this.jumpingCount = 1;

    this.map.on('scrollEnd', () => this.moving());
    this.map.scrollDown(1);

    this.scene.interactive = true;
    this.scene.on('pointerdown', () => {
      if(!this.jumpingCount) return;
      this.jumpingCount--;
      this.isJump = true;
    });
  }
  moving() {
    if(this.isDead) return;

    if(this.isJump) {
      this.alpha = .5;
      return this.jump();
    } else this.alpha = 1;

    let cur = this.map.getBlockFromPos(this.x, this.y+this.map.blockSize);
    if(cur && cur.isActive) {
      if(cur.playerDir === 'top') return this.top();
      if(cur.playerDir === 'left') return this.left();
      if(cur.playerDir === 'right') return this.right();

      //check top
      let top = this.map.getBlockFromPos(this.x, this.y);
      if(top && top.isActive && this.lastMove !== 'bottom') return this.top();

      // check left
      let left = this.map.getBlockFromPos(this.x-this.map.blockSize, this.y+this.map.blockSize);
      if(left && left.isActive && this.lastMove !== 'right') return this.left();

      // check rigth
      let right = this.map.getBlockFromPos(this.x+this.map.blockSize, this.y+this.map.blockSize);
      if(right && right.isActive && this.lastMove !== 'left') return this.right();

      // or die
      this.top();
    } else this.dead();
  }
  dead() {
    let dead = PIXI.tweenManager.createTween(this.scale);
    dead.from({x: .5, y: .5}).to({x: 0, y: 0});
    dead.time = 200;
    dead.start();
    dead.on('end', () => this.scene.levels.loseLevel());

    this.walking.stop();
    this.isDead = true;
  }
  jump() {
    this.lastMove = 'jump';
    this.isJump = false;
    this.map.scrollDown(2);
  }
  top() {
    this.lastMove = 'top';
    this.map.scrollDown(1);
  }
  left() {
    this.lastMove = 'left';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x-this.map.blockSize});
    move.time = this.speed/2;
    move.on('end', () => this.moving());
    move.start();
  }
  right() {
    this.lastMove = 'right';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x+this.map.blockSize});
    move.time = this.speed/2;
    move.on('end', () => this.moving());
    move.start();
  }
}

module.exports = Player;
