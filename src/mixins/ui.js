module.exports = {
  createBg(state, size=100, ax=20, ay=20) {
    let bg = state.add.graphics();
    bg.beginFill(0xFFFFFF, 1);
    bg.drawRect(0, 0, state.game.width, state.game.height);
    bg.endFill();

    bg.lineStyle(4, 0x2e2e44, .1);

    for(let x = 0; x < ax; x++) {
      bg.moveTo(size*x, 0);
      bg.lineTo(size*x, state.game.height);
    }
    for(let y = 0; y < ay; y++) {
      bg.moveTo(0, size*y);
      bg.lineTo(state.game.width, size*y);
    }
    return bg;
  },
  goTo(state, name, args) {
    state.camera.fade(0xFFFFFF);
    state.camera.onFadeComplete.add(() => {
      state.state.start(name, true, false, args);
      state.state.getCurrentState().camera.flash(0xFFFFFF, 1000);
    });
  }
}
