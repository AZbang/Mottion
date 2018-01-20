class InterfaceManager extends PIXI.Container {
  constructor(scene) {
    super();
    scene.addChild(this);
    this.game = scene.game;
  }
  addLabel(txt, x, y, click) {
    let label = new PIXI.Text(txt, {
      font: 'normal 200px Opificio Bold',
      fill: '#5774f6',
      align: 'center'
    });
    label.anchor.set(.5);
    label.y = x;
    label.x = y;
    label.interactive = true;
    label.on('pointerdown', () => click && click());
    this.addChild(label);
  }
  addCitaty(txt, x, y, click) {
    let citaty = new PIXI.Text(txt, {
      font: 'normal 60px Opificio Bold',
      fill: '#5774f6',
      wordWrap: true,
      wordWrapWidth: this.game.w/2,
      align: 'center'
    });
    citaty.anchor.set(.5);
    citaty.y = x;
    citaty.x = y;
    citaty.interactive = true;
    citaty.on('pointerdown', () => click && click());
    this.addChild(citaty);
  }
  addListInput(val, x, y, list, current, set) {
    let txt = new PIXI.Text(val + list[current], {
      font: 'normal 120px Opificio Bold',
      fill: '#ff408c',
      align: 'center'
    });
    txt.anchor.set(.5);
    txt.x = x;
    txt.y = y;
    this.addChild(txt);

    txt.interactive = true;
    txt.on('pointerdown', () => {
      if(current >= list.length-1) current = 0;
      else current++;

      txt.text = val + list[current];
      set && set(current);
    });
    return txt;
  }
  addCheckBoxInput(val, x, y, active, toggle) {
    let txt = new PIXI.Text(val, {
      font: 'normal 100px Opificio Bold',
      fill: '#ff408c',
      align: 'center'
    });
    txt.anchor.set(0, .5);
    txt.x = x;
    txt.y = y;
    this.addChild(txt);

    let check = PIXI.Sprite.fromImage('check.png');
    check.texture = PIXI.Texture.fromImage(active ? 'check_active.png' : 'check.png');
    check.y = y;
    check.x = x-100;
    check.anchor.set(.5);
    this.addChild(check);

    check.interactive = true;
    check.on('pointerdown', () => {
      check.texture = PIXI.Texture.fromImage(!active ? 'check_active.png' : 'check.png');
      toggle && toggle(!active);
      active = !active;
    });
    return {checkbox: check, text: txt};
  }
  addButton(id, x, y, click) {
    let btn = new PIXI.Sprite.fromImage(id);
    this.addChild(btn);

    btn.x = x;
    btn.y = y;
    btn.anchor.set(.5);
    btn.interactive = true;
    btn.on('pointerdown', () => click && click());
    return btn;
  }
}

module.exports = InterfaceManager;
