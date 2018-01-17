/*
  Класс Блока, используется для тайлового движка
  События:
    showen
    hidden
    activated
    deactivated
    hited
*/

class Tile extends PIXI.projection.Sprite2d {
  constructor(scene, map, x, y, data={}) {
    super();

    this.game = scene.game;
    this.scene = scene;
    this.map = map;

    this.activatedTexture = data.activatedTexture ? PIXI.Texture.fromFrame(data.activatedTexture) : PIXI.Texture.WHITE;
    this.deactivatedTexture = data.deactivatedTexture ? PIXI.Texture.fromFrame(data.deactivatedTexture) : PIXI.Texture.WHITE;
    this.texture = this.active ? this.activatedTexture : this.deactivatedTexture;

    this.anchor.set(.5);
    this.renderable = false;
    this.width = map.tileSize-10;
    this.height = map.tileSize-10;
    this.x = x+map.tileSize/2-5;
    this.y = y+map.tileSize/2-5;
  }
}

module.exports = Tile;
