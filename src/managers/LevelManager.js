const DataFragmentConverter = require('../utils/DataFragmentConverter');

class LevelManager extends PIXI.projection.Container2d {
  constructor(scene) {
    super();

    this.scene = scene;
    this.map = scene.map;

    this.levels = [];
    this.fragmentsData = {};
    this.addFragmentsData(require('../content/fragments'));
    this.addLevels(require('../content/levels'))

    this.currentLevel = 0;
    this.currentFragment = 0;
    this.setLevel(0);

    this.map.on('mapEnd', () => this.nextFragment());
  }
  addFragmentsData(data={}) {
    // add fragments to db fragments
    Object.assign(this.fragmentsData, data);
  }
  addLevels(levels=[]) {
    // add levels to db levels
    this.levels = this.levels.concat(levels);

    // generate map for every level from fragments
    levels.forEach((lvl) => {
      // lvl saved in this.levels
      lvl.maps = [];
      for(let key in lvl.fragments) {
        for(let i = 0; i < lvl.fragments[key]; i++) {
          this.fragmentsData[key] && lvl.maps.push(this.fragmentsData[key]);
        }
      }
    });
  }
  // getters
  getCurrentLevel() {
    return this.levels[this.currentLevel];
  }
  getCurrentFragment() {
    return this.getCurrentLevel().maps[this.currentFragment];
  }

  //
  loseLevel() {
    // There more logic with history...
    this.scene.restart();
  }
  endLevel() {
    // There more logic with history...
    this.nextLevel();
  }

  // Methods for levels control
  setLevel(lvl) {
    if(lvl > this.levels.length || lvl < 0) return;
    this.currentLevel = lvl;
    this.setFragment(0);
  }
  nextLevel() {
    setLevel(this.currentLevel+1);
  }
  backLevel() {
    setLevel(this.currentLevel-1);
  }


  // Methods for fragments control
  setFragment(frag) {
    if(frag < 0) return;
    // if not more fragments, then level complete...
    if(frag >= this.getCurrentLevel().maps.length) this.endLevel();

    this.currentFragment = frag;
    this.map.addMap(this.getCurrentFragment());
  }
  nextFragment() {
    this.setFragment(this.currentFragment+1);
  }
  backFragment() {
    this.setFragment(this.currentFragment-1);
  }
}

module.exports = LevelManager;