/*
  Класс Player, взаимодействует с MapManager
  События
    collidedBlock => collided block

    actionDeaded
    actionImmunity
    actionTop
    actionLeft
    actionRight
*/

class Player extends PIXI.Sprite {
  constructor(scene, wrap=scene) {
    super(PIXI.Texture.fromImage('player.png'));
    wrap.addChild(this);

    this.game = scene.game;
    this.map = scene.map;
    this.scene = scene;

    this.SCALE = .7;
    this.loop = true;
    this.tint = 0xfef52e;
    this.anchor.set(.5, 1);
    this.scale.set(this.SCALE);
    this.x = this.game.w/2;
    this.y = this.game.h-this.map.tileSize*2;
    this.collisionPoint = new PIXI.Point(this.game.w/2, this.game.h-this.map.tileSize*2);

    this.walking = PIXI.tweenManager.createTween(this);
    this.walking.from({y: this.y}).to({y: this.y-15});
    this.walking.time = 800;
    this.walking.loop = true;
    this.walking.pingPong = true;

    this.deadSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.deadSprite.anchor.set(.5, 1);
    this.deadSprite.height = 0;
    this.deadSprite.width = this.map.tileSize;
    wrap.addChild(this.deadSprite);

    this.lastMove = null;
    this.isDead = false;
    this.isStop = false;

    this.OFFSET_X = 25;
  }
  updateMoving() {
    if(this.isDead || this.isStop) return;

    let blocks = this.map.getNearBlocks(this.collisionPoint);
    if(blocks.center) {
      this.emit('collidedBlock', blocks.center);

      if(blocks.center.playerDir === 'stop') return this.stopMove();
      if(blocks.center.playerDir === 'top') return this.top();
      if(blocks.center.playerDir === 'left') return this.left();
      if(blocks.center.playerDir === 'right') return this.right();

      // check dead
      if(!this.checkBlock(blocks.center)) return this.dead(blocks.center.tint);
      //check top
      if(blocks.top && this.checkBlock(blocks.top)) return this.top();
      // check left
      if(blocks.left && this.lastMove !== 'right' && this.checkBlock(blocks.left)) return this.left();
      // check rigth
      if(blocks.right && this.lastMove !== 'left' && this.checkBlock(blocks.right)) return this.right();
      // or die
      this.top();
    } else this.dead(0xFFFFFF);
  }
  checkBlock(block) {
    if(block.active) return true;
    else if(this.scene.immunity.last() === block.type) {
      block.activate(true);
      this.scene.immunity.removeImmunity();
      return true;
    }
    return false;
  }
  dead(tint) {
    this.deadSprite.tint = tint;
    this.deadSprite.x = this.collisionPoint.x+5;
    this.deadSprite.y = this.collisionPoint.y+this.map.tileSize;
    let dead = PIXI.tweenManager.createTween(this.deadSprite);
    dead.from({alpha: 0, height: 0}).to({alpha: 1, height: this.game.h});
    dead.time = this.map.speed/2;
    dead.start();
    dead.on('end', () => {
      this.isDead = true;
      setTimeout(() => this.emit('deaded'), 500);
    });
    this.stopMove();
  }
  startMove() {
    this.walking.start();
    this.top();
    this.isStop = false;
  }
  stopMove() {
    this.walking.stop();
    this.isStop = true;
  }
  top() {
    this.lastMove = 'top';
    this.map.scrollDown(1);
    this.emit('actionTop');
  }
  left() {
    this.lastMove = 'left';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x-this.map.tileSize-this.OFFSET_X});
    move.time = this.map.speed/2;
    move.start();

    this.collisionPoint.x -= this.map.tileSize;
    this.collisionPoint.x -= this.OFFSET_X;

    move.on('end', () => this.updateMoving());
    this.emit('actionLeft');
  }
  right() {
    this.lastMove = 'right';
    let move = PIXI.tweenManager.createTween(this);
    move.from({x: this.x}).to({x: this.x+this.map.tileSize+this.OFFSET_X});
    move.time = this.map.speed/2;
    move.start();

    this.collisionPoint.x += this.map.tileSize;
    this.collisionPoint.x += this.OFFSET_X;

    move.on('end', () => this.updateMoving());
    this.emit('actionRight');
  }
}

module.exports = Player;
