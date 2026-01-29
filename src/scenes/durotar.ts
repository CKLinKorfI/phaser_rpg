import durotarJSON from '../assets/durotar.json';
import {LAYERS, SIZES, TILES} from '../utils/constants.ts';

export class Durotar extends Phaser.Scene {
    constructor () {
        super('DurotarScene');
    }

    preload(){
        this.load.image('durotar', 'src/assets/durotar.png');
        this.load.tilemapTiledJSON('map', 'src/assets/durotar.json')
    }

    create() {
        const map = this.make.tilemap({key: 'map'});
        const tileSet = map.addTilesetImage(durotarJSON.tilesets[0].name, TILES.DUROTAR, SIZES.TILE, SIZES.TILE);
        if (!tileSet) return;
        const groundLayer = map.createLayer(LAYERS.GROUND, tileSet, 0, 0);
        const wallsLayer = map.createLayer(LAYERS.WALLS, tileSet, 0, 0);
    }
}