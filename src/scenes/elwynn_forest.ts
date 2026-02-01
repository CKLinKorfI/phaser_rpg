import elwynnForestJSON from '../assets/elwynn.json';
import { Enemy } from '../entities/enemy.ts';
import { Player } from '../entities/player.ts';
import {LAYERS, SIZES, SPRITES, TILES} from '../utils/constants.ts';

export class ElwynnForest extends Phaser.Scene {
    private player?: Player;
    private boar?: Enemy;
    private boarSecond?: Enemy;
    private killText?: Phaser.GameObjects.Text;
    public killsCounter: number = 0;

    constructor () {
        super('ElwynnForestScene');
    }

    preload(){
        this.load.image(TILES.ELWYNN, 'src/assets/summer_tiles.png');
        this.load.tilemapTiledJSON('map', 'src/assets/elwynn.json');
        this.load.spritesheet(SPRITES.PLAYER.BASE,'src/assets/characters/alliance.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT
        } );
        this.load.spritesheet(SPRITES.PLAYER.FIGHT,'src/assets/characters/alliance-fight-small.png', {
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
        this.boarSecond = new Enemy(this, 200, 300, SPRITES.BOAR.BASE);
        this.boar.setPlayer(this.player);
        this.boarSecond.setPlayer(this.player);
        this.player.setEnemies([this.boar, this.boarSecond]);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.setCollideWorldBounds(true);

        if(!wallsLayer) return;
        this.physics.add.collider(this.player, wallsLayer);
        wallsLayer.setCollisionByExclusion([-1]);

        this.killText = this.add.text(770, 10, `${this.killsCounter}`, {fontFamily: 'Arial', fontSize: 16, color: '#ffffff'})
        this.killText.setScrollFactor(0);
    }

    update(time: number, delta: number): void {
        this.player?.update(delta);
        this.boar?.update();
        this.boarSecond?.update();
        this.killText!.setText(`${this.killsCounter}`);
    }
}