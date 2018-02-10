class InterfaceManager extends PIXI.Container {
  constructor(scene) {
    super();
    scene.addChild(this);
    this.game = scene.game;
  }
  addText(opt) {
    let label = new PIXI.Text(opt.text, {
      font: opt.font,
      fill: opt.color,
      align: opt.align || 'center'
    });
    label.anchor.set(.5);
    label.y = opt.y;
    label.x = opt.x;
    label.interactive = true;
    label.on('pointerdown', () => opt.click && opt.click());
    this.addChild(label);
  }
  addButton(opt, x, y, click) {
    let btn = new PIXI.Sprite.fromImage(opt.image);
    this.addChild(btn);

    btn.x = opt.x;
    btn.y = opt.y;
    btn.anchor.set(.5);
    btn.interactive = true;
    btn.on('pointerdown', () => opt.click && opt.click());
    return btn;
  }



  addListInput(val, x, y, list, current, set) {
    let txt = new PIXI.Text(val + list[current], {
      font: 'normal 120px Milton Grotesque',
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
      font: 'normal 100px Milton Grotesque',
      fill: '#ff408c',
      align: 'center'
    });
    txt.anchor.set(0, .5);
    txt.x = x;
    txt.y = y;
    this.addChild(txt);

    let check = PIXI.Sprite.fromImage('checkbox.png');
    check.texture = PIXI.Texture.fromImage(active ? 'checkbox_active.png' : 'checkbox.png');
    check.y = y;
    check.x = x-100;
    check.anchor.set(.5);
    this.addChild(check);

    check.interactive = true;
    check.on('pointerdown', () => {
      check.texture = PIXI.Texture.fromImage(!active ? 'checkbox_active.png' : 'checkbox.png');
      toggle && toggle(!active);
      active = !active;
    });
    return {checkbox: check, text: txt};
  }
}

module.exports = InterfaceManager;
