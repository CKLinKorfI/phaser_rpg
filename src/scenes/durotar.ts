import durotarJSON from '../assets/durotar.json';
import { Player } from '../entities/player.ts';
import {LAYERS, SIZES, SPEITES, TILES} from '../utils/constants.ts';

export class Durotar extends Phaser.Scene {
    private player?: Player;

    constructor () {
        super('DurotarScene');
    }

    preload(){
        this.load.image(TILES.DUROTAR, 'src/assets/durotar.png');
        this.load.tilemapTiledJSON('map', 'src/assets/durotar.json');
        this.load.spritesheet(SPEITES.PLAYER,'src/assets/characters/alliance.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT
        } );
    }

    create() {
        const map = this.make.tilemap({key: 'map'});
        const tileSet = map.addTilesetImage(durotarJSON.tilesets[0].name, TILES.DUROTAR, SIZES.TILE, SIZES.TILE);
        if (!tileSet) return;
        const groundLayer = map.createLayer(LAYERS.GROUND, tileSet, 0, 0);
        const wallsLayer = map.createLayer(LAYERS.WALLS, tileSet, 0, 0);

        this.player = new Player(this, 400, 250, SPEITES.PLAYER)
    }

    update(time: number, delta: number): void {
        this.player?.update(delta);
    }
}