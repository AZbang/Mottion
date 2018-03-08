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
    text.anchor.set(opt.anchor == null ? .5 : opt.anchor);
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
    btn.scale.set(opt.scale || 1);
    btn.tint = opt.tint || 0xFFFFFF;
    btn.on('pointerdown', () => opt.click && opt.click(btn));

    return btn;
  }
  addListInput(opt) {
    let txt = this.addText(Object.assign({
      text: opt.value + opt.list[opt.current],
      click: (el) => {
        if(opt.current >= opt.list.length-1) opt.current = 0;
        else opt.current++;
        el.text = opt.value + opt.list[opt.current];
        opt.set && opt.set(opt.current);
      }
    }, opt));
    return txt;
  }
}

module.exports = InterfaceManager;
