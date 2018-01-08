/*
  Класс Блока, используется для тайлового движка
  События:
    showen
    hidden
    activated
    deactivated
    hited
*/

class Block extends PIXI.projection.Sprite2d {
  constructor(map, x, y, block={}, trigger={}) {
    super();

    this.map = map;
    this.game = this.map.game;

    this.active = block.active || false;
    this.activation = block.activation || null;
    this.score = block.score || 0;

    this.playerDir = trigger.playerDir;
    this.historyID = trigger.historyID;
    this.action = trigger.action;
    this.animateShow = trigger.animateShow;
    this.animateShowTime = trigger.animateShowTime;
    this.animateShowRandomTime = trigger.animateShowRandomTime;
    this.animateFly = trigger.animateFly;

    this.activatedTexture = block.activatedTexture ? PIXI.Texture.fromFrame(block.activatedTexture) : null;
    this.deactivatedTexture = block.deactivatedTexture ? PIXI.Texture.fromFrame(block.deactivatedTexture) : null;
    this.texture = this.active ? this.activatedTexture : this.deactivatedTexture;

    this.anchor.set(.5);
    this.renderable = false;
    this.width = map.tileSize+1;
    this.height = map.tileSize+1;
    this.x = x+map.tileSize/2+.5;
    this.y = y+map.tileSize/2+.5;

    this.fly = PIXI.tweenManager.createTween(this.scale);
    this.fly.from({x: 1, y: 1}).to({x: .8, y: .8});
    this.fly.time = 4000;
    this.fly.pingPong = true;
    this.fly.repeat = Infinity;
    this.animateFly && this.fly.start();

    this.jolting = PIXI.tweenManager.createTween(this);
    this.jolting.from({rotation: -.1}).to({rotation: .1});
    this.jolting.time = 200;
    this.jolting.pingPong = true;
    this.jolting.repeat = Infinity;
  }
  show() {
    this.renderable = true;

    if(this.animateShow) {
      this.alpha = 0;
      let show = PIXI.tweenManager.createTween(this);
      show.from({alpha: 0}).to({alpha: 1})
      show.time = 1000;
      setTimeout(() => show.start(), this.animateShowRandomTime ? this.animateShowTime+Math.random()*this.animateShowRandomTime : this.animateShowTime);
    }
    this.emit('showen');
  }
  hide() {
    let hide = PIXI.tweenManager.createTween(this);
    hide.from({width: this.width, height: this.height, alpha: 1}).to({width: 0, height: 0, alpha: 0});
    hide.on('end', () => this.renderable = false);
    hide.time = 300;
    setTimeout(() => hide.start(), Math.random()*this.map.speed/2);

    this.emit('hidden');
  }

  activate() {
    let activating = PIXI.tweenManager.createTween(this)
      .from({width: this.width*3/4, height: this.height*3/4})
      .to({width: this.width, height: this.height, rotation: 0});
    activating.time = 500;
    activating.easing = PIXI.tween.Easing.outBounce();
    activating.start();

    this.unhit();

    this.active = true;
    this.texture = this.activatedTexture;

    this.emit('activated');
  }
  deactivate() {
    this.active = false;
    if(this.deactivatedTexture) this.texture = this.deactivatedTexture;

    this.emit('deactivated');
  }

  unhit() {
    this.jolting.stop();
    this.rotation = 0;
  }
  hit() {
    if(this.activation === null || this.active) return;

    this.jolting.start();
    if(this.activation) this.activation--;
    else this.activate();

    this.emit('hited');
  }
}

module.exports = Block;
