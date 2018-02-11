class InterfaceManager extends PIXI.Container {
  constructor(scene) {
    super();
    scene.addChild(this);
    this.game = scene.game;
  }
  addText(opt) {
    let text = new PIXI.Text(opt.text, {
      font: opt.font,
      fill: opt.color,
      align: opt.align || 'center'
    });
    text.anchor.set(.5);
    text.y = opt.y;
    text.x = opt.x;
    text.interactive = true;
    text.on('pointerdown', () => opt.click && opt.click(text));
    this.addChild(text);

    return text;
  }
  addButton(opt) {
    let btn = new PIXI.Sprite.fromImage(opt.image);
    this.addChild(btn);

    btn.x = opt.x;
    btn.y = opt.y;
    btn.anchor.set(.5);
    btn.interactive = true;
    btn.on('pointerdown', () => opt.click && opt.click(btn));

    return btn;
  }

  addListInput(opt) {
    let txt = this.addText({
      text: opt.value + opt.list[opt.current],
      ...opt,
      click: (el) => {
        if(opt.current >= opt.list.length-1) opt.current = 0;
        else opt.current++;
        el.text = opt.value + opt.list[opt.current];
        opt.set && opt.set(opt.current);
      }
    });
    return txt;
  }
  addCheckBoxInput(opt) {
    let txt = this.addText(opt);
    txt.anchor.set(0, .5);

    let check = this.addButton({
      image: opt.value ? 'checkbox_active.png' : 'checkbox.png',
      x: opt.x-100, y: opt.y,
      click: (el) => {
        el.texture = PIXI.Texture.fromImage(!opt.value ? 'checkbox_active.png' : 'checkbox.png');
        opt.toggle && opt.toggle(!opt.value);
        opt.value = !opt.value;
      }
    });
    return {checkbox: check, text: txt};
  }
}

module.exports = InterfaceManager;
