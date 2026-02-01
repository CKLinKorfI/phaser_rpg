import elwynnForestJSON from '../assets/elwynn.json';
import { Enemy } from '../entities/enemy.ts';
import { Player } from '../entities/player.ts';
import {LAYERS, SIZES, SPRITES, TILES} from '../utils/constants.ts';

export class ElwynnForest extends Phaser.Scene {
    private player?: Player;
    private boar?: Enemy;

    constructor () {
        super('ElwynnForestScene');
    }

    preload(){
        this.load.image(TILES.ELWYNN, 'src/assets/summer_tiles.png');
        this.load.tilemapTiledJSON('map', 'src/assets/elwynn.json');
        this.load.spritesheet(SPRITES.PLAYER,'src/assets/characters/alliance.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT
        } );

        this.load.spritesheet(SPRITES.BOAR.BASE, 'src/assets/characters/boar.png', {
            frameWidth: SIZES.BOAR.WIDTH,
            frameHeight: SIZES.BOAR.HEIGHT
        });
    }

    create() {
        const map = this.make.tilemap({key: 'map'});
        const tileSet = map.addTilesetImage(elwynnForestJSON.tilesets[0].name, TILES.ELWYNN, SIZES.TILE.WIDTH, SIZES.TILE.HEIGHT);
        if (!tileSet) return;
        const groundLayer = map.createLayer(LAYERS.GROUND, tileSet, 0, 0);
        const wallsLayer = map.createLayer(LAYERS.WALLS, tileSet, 0, 0);

        this.player = new Player(this, 400, 250, SPRITES.PLAYER);
        this.boar = new Enemy(this, 600, 400, SPRITES.BOAR.BASE);
        this.boar.setPlayer(this.player);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.setCollideWorldBounds(true);

        if(!wallsLayer) return;
        this.physics.add.collider(this.player, wallsLayer);
        wallsLayer.setCollisionByExclusion([-1]);
    }

    update(time: number, delta: number): void {
        this.player?.update(delta);
        this.boar?.update();
    }
}