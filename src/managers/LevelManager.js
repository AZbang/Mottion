/*
  Менеджер уровней, работает напрямую с MapManager
  используя данные levels.json и  fragments.json

  События:
    addedFragmentsData => new fragmentsData
    addedLevels => new levels
    addedLevel => new lvl

    switchedLevel => cur lvl
    wentNextLevel => cur lvl
    wentBackLevel => cur lvl
    switchedFragment => cur frag
    wentNextFragment => cur frag
    wentBackFragment => cur frag

    startedLevel => new lvl
    endedLevel => prev lvl
*/


class LevelManager extends PIXI.utils.EventEmitter {
  constructor(scene, map) {
    super();

    this.scene = scene;
    this.map = map;

    this.levels = [];
    this.fragmentsData = {};
    this.addFragmentsData(require('../content/fragments'));
    this.addLevels(require('../content/levels'))

    this.curLevelIndex = 0;
    this.curFragmentIndex = 0;

    this.switchLevel(0);
    this.map.on('endedMap', () => {
      this.nextFragment();
    });
    this.nextFragment();
  }
  // getters
  getCurrentLevel() {
    return this.levels[this.curLevelIndex];
  }
  getCurrentFragment() {
    return this.getCurrentLevel().maps[this.curFragmentIndex];
  }

  // add fragments to db fragments
  addFragmentsData(data={}) {
    Object.assign(this.fragmentsData, data);
    this.emit('addedFragmentsData', data);
  }

  // add levels to db levels
  addLevels(levels=[]) {
    for(let i = 0; i < levels.length; i++) {
      this.addLevel(levels[i]);
    }
    this.emit('addedLevels', levels);
  }
  addLevel(lvl={}) {
    this.levels.push(lvl);
    // generated maps to lvl object
    lvl.maps = [];
    for(let key in lvl.fragments) {
      for(let i = 0; i < lvl.fragments[key]; i++) {
        this.fragmentsData[key] && lvl.maps.push(this.fragmentsData[key]);
      }
    }
    this.emit('addedLevel', lvl);
  }

  // Methods for levels control
  switchLevel(lvl) {
    if(lvl > this.levels.length || lvl < 0) return;
    this.emit('endedLevel', this.getCurrentLevel());

    this.curLevelIndex = lvl;
    this.switchFragment(0);

    this.emit('startedLevel', this.getCurrentLevel());
    this.emit('switchedLevel', this.getCurrentLevel());
  }
  nextLevel() {
    this.switchLevel(this.curLevelIndex+1);
    this.emit('wentNextLevel', this.getCurrentLevel());
  }
  backLevel() {
    this.switchLevel(this.curLevelIndex-1);
    this.emit('wentBackLevel', this.getCurrentLevel());
  }

  // Methods for fragments control
  switchFragment(frag) {
    if(frag < 0) return;
    this.curFragmentIndex = frag;

    if(this.getCurrentFragment()) this.map.addMap(this.getCurrentFragment());
    else {
      this.emit('endedLevel', this.getCurrentLevel());
      this.nextLevel();
    }
    this.emit('switchedFragment', this.getCurrentFragment());
  }
  nextFragment() {
    this.switchFragment(this.curFragmentIndex+1);
    this.emit('wentNextFragment', this.getCurrentFragment());
  }
  backFragment() {
    this.switchFragment(this.curFragmentIndex-1);
    this.emit('wentBackFragment', this.getCurrentFragment());
  }
}

module.exports = LevelManager;
