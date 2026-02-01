import { SPRITES } from "../utils/constants";
import { Entity } from "./entity"

type SpriteType = {
    [key: string] : string;
    BASE: string;
    FIGHT: string;
}


export class Player extends Entity {
    private moveSpeed: number;
    private enemies?: Entity[];
    private isAttacking: Boolean;
    private target: Entity | null = null;

    constructor( scene: Phaser.Scene, x: number, y: number, texture: SpriteType) {
        super(scene, x, y, texture.BASE, SPRITES.PLAYER.BASE);

        const anims = this.scene.anims;
        const animsFrameRate = 9;
        
        this.moveSpeed = 25;
        this.isAttacking = false;

        this.setSize(28, 32);
        this.setOffset(10, 16);
        this.setScale(0.8);

        this.setupKeysListeners();
        this.createAnimation('down', texture.BASE, 0, 2, anims, animsFrameRate);
        this.createAnimation('left', texture.BASE, 12, 14, anims, animsFrameRate);
        this.createAnimation('right', texture.BASE, 24, 26, anims, animsFrameRate);
        this.createAnimation('up', texture.BASE, 36, 38, anims, animsFrameRate);
        this.createAnimation('fight', texture.FIGHT, 3, 6, anims, animsFrameRate, 0);

        this.on('animationcomplete', () => {
            this.isAttacking = false;
        })
    }

    private createAnimation(
        key: string,
        textureKey: string,
        start: number,
        end: number,
        anims: Phaser.Animations.AnimationManager,
        frameRate: number,
        repeat = - 1
    ) {
        anims.create({
            key,
            frames: anims.generateFrameNames(textureKey, {start, end}),
            frameRate,
            repeat
        })
    }

    private drawPlayerHealthBar() {
        const playerHealthBar = this.scene.add.graphics();
        playerHealthBar.setScrollFactor(0);
        this.drawHealthBar( playerHealthBar, 10, 10, this.health / 100)
    }

    private drawEnemyHealthBar(target: Entity) {
        const enemyHealthBar = this.scene.add.graphics();
        enemyHealthBar.setScrollFactor(0);
        if(this.target)
            this.drawHealthBar( enemyHealthBar, 10, 30, target.health / 100)
    }

    private drawHealthBar(graphics: Phaser.GameObjects.Graphics, x: number, y: number, percentage: number) {
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(x, y, 100, 10);

        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(x, y, 100 * percentage, 10);
    }

    setEnemies(enemies: Entity[]) {
        this.enemies = enemies;
    }

    private findTarget ( enemies: Entity[]) {
        let target = null;
        let minDistance = Infinity;

        for (const enemy of enemies) {
            const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);

            if (distanceToEnemy < minDistance) {
                minDistance = distanceToEnemy;
                target = enemy;
            }
        }
        this.target = target;
        return target;
    }

    private setupKeysListeners() {
        this.scene.input.keyboard?.on('keydown-SPACE', () => {
            const target = this.findTarget(this.enemies!);
            this.play('fight');
            this.setVelocity(0, 0);
            this.isAttacking = true;
            if (target){
                this.attack(target)
                this.drawEnemyHealthBar(target);
            }
        })
    }

    attack (target: Entity) {
        const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        if (distanceToEnemy <= 50) {
            target.takeDamage(25);
        }
    }

    update(delta: number) {
        this.drawPlayerHealthBar();

        const keys = this.scene.input.keyboard?.createCursorKeys();

        if(keys?.up.isDown) {
            this.play('up', true);
            this.setVelocity(0, - delta * this.moveSpeed);
        }
        else if (keys?.down.isDown){
            this.play('down', true);
            this.setVelocity(0, delta * this.moveSpeed);
        }
        else if (keys?.left.isDown) {
            this.play('left', true);
            this.setVelocity(- delta * this.moveSpeed, 0);
        }
        else if (keys?.right.isDown) {
            this.play('right', true);
            this.setVelocity(delta * this.moveSpeed, 0);
        }
        else if (this.isAttacking) {
            this.setVelocity(0, 0);
        }
        else {
            this.setVelocity(0,0);
            this.stop();
        }
    }
}