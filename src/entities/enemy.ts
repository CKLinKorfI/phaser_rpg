import { Game } from "phaser";
import { Entity } from "./entity";
import type { ElwynnForest } from "../scenes/elwynn_forest";

export class Enemy extends Entity {
    private player?: Entity;
    private isFollowing: Boolean;
    private agroDistance: number;
    private attackRange: number;
    private followRange: number;
    private isAlive: Boolean;
    private moveSpeed: number;
    private initPosition: {x: number, y: number};

    constructor (scene: Phaser.Scene, x: number, y:number, texture: string) {
        super(scene, x, y, texture);

        this.isFollowing = false;
        this.agroDistance = 100;
        this.attackRange = 40;
        this.followRange = 250;
        this.isAlive = true;
        this.moveSpeed = 100;
        this.initPosition = {x, y};

        this.cycleTween();
    }

    cycleTween () {
        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            ease: 'Linear',
            repeat: -1,
            yoyo: true,
            x: this.x + 100,
            onRepeat: () => {
                this.setFlipX(true);
            },
            onYoyo: () => {
                this.setFlipX(false);
            }
        })
    }

    setPlayer(player: Entity) {
        this.player = player;
    }

    stopCycleTween() {
        this.scene.tweens.killTweensOf(this)
    }

    followToPlayer(player: Entity) {
        this.scene.physics.moveToObject(this, player, this.moveSpeed)
    }

    returnToOriginalPosition(distanceToPosition: number) {
        this.setVelocity(0, 0);

        this.scene.tweens.add ({
            targets: this,
            x: this.initPosition.x,
            y: this.initPosition.y,
            duration: distanceToPosition * 1000 / this.moveSpeed,
            onComplete: () => {
                this.cycleTween();
            }
        })
    }

    attack (target: Entity) {
        const time = Math.floor(this.scene.game.loop.time);

        if(time % 2000 <= 3) {
            target.takeDamage(10);
        }
    }

    takeDamage (damage: number) {
        super.takeDamage(damage);

        if(this.health <= 0) {
            this.diactivate()
        }
    }
    
    diactivate() {
        const thisScene = this.scene as ElwynnForest; 

        this.stopCycleTween();
        this.setPosition(this.initPosition.x, this.initPosition.y);
        this.setVisible(false);

        this.isAlive = false;

        this.destroy();

        thisScene.killsCounter += 1;
    }

    update(...args: any[]): void {
        // Расчет дистанции до персонажа
        const player = this.player!;
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        const distanceToPosition = Phaser.Math.Distance.Between(this.x, this.y, this.initPosition.x , this.initPosition.y);

        // Остановка цикла, включение режима следования
        if(!this.isFollowing && distanceToPlayer < this.agroDistance) {
            this.isFollowing = true;
            this.stopCycleTween();
        }

        // Режим следования
        if(this.isFollowing && this.isAlive) {
            this.followToPlayer(player);
            if(distanceToPlayer < this.attackRange) {
                this.setVelocity(0, 0);
                this.attack(player);
            }
            if(distanceToPosition > this.followRange) {
                this.isFollowing = false;
                this.returnToOriginalPosition(distanceToPosition);
            }
        }   
    }

    
}