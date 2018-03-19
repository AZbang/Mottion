class TiledManager {
  constructor(map, blocks, triggers) {

    this.mapWidth = map.width;
    this.mapHeight = map.height;
    this.map = map.layers[0].data;
    this.triggersMap = map.layers[1].data;
    this.triggersMap2 = map.layers[2].data;
    this.blocks = blocks.tileproperties;
    this.triggers = triggers.tileproperties;
    this.divideGid = triggers.tilecount;

    this.data = [];
    this._parseMap();
  }
  _getBlockPropsByGid(blockGid, triggerGid, triggerGid2) {
    const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
    const FLIPPED_VERTICALLY_FLAG   = 0x40000000;
    const FLIPPED_DIAGONALLY_FLAG   = 0x20000000;

    let flips = {
      horizontalFlip: !!(blockGid & FLIPPED_HORIZONTALLY_FLAG),
      verticalFlip: !!(blockGid & FLIPPED_VERTICALLY_FLAG),
      diagonalFlip: !!(blockGid & FLIPPED_DIAGONALLY_FLAG)
    }

    if(flips.horizontalFlip || flips.verticalFlip || flips.diagonalFlip)
      blockGid &= ~(FLIPPED_HORIZONTALLY_FLAG |
               FLIPPED_VERTICALLY_FLAG |
               FLIPPED_DIAGONALLY_FLAG);

    return Object.assign({}, flips, this.blocks[blockGid-this.divideGid-1], Object.assign({}, this.triggers[triggerGid-1], this.triggers[triggerGid2-1]));
  }
  _parseMap() {
    for(let y = 0; y < this.mapHeight; y++) {
      for(let x = 0; x < this.mapWidth; x++) {
        if(this.map[y*this.mapWidth+x])
          this.data.push({x, y, data: this._getBlockPropsByGid(this.map[y*this.mapWidth+x], this.triggersMap[y*this.mapWidth+x], this.triggersMap2[y*this.mapWidth+x])});
      }
    }
  }
}

module.exports = TiledManager;
