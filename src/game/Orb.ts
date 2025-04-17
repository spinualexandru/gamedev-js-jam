import {Segment} from "@Game/Segment.ts";

export class Orb {
    color: number;
    target: Segment;
    orb: Phaser.Physics.Arcade.Sprite; // Use a physics-enabled sprite
    type: "NORMAL";
    isDestroyed: boolean = false;
    speed: number = 200; // Speed of the orb

    constructor(
        target: Segment,
        type: typeof this.type,
        color: number,
    ) {
        this.color = color
        this.target = target;
        this.type = type || "NORMAL";
    }

    static spawnOrb(
        x: number,
        y: number,
        target: Segment,
        scene: Phaser.Scene,
        color: number,
    ): Orb {
        const orb = new Orb(target, "NORMAL", color);
        orb.createOrb(x, y, scene);
        return orb;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public createOrb(x: number, y: number, scene: Phaser.Scene): void {
        this.orb = scene.physics.add.sprite(x, y, "orb")
            .setTint(this.color)
            .setInteractive()
            .setCircle(30)

        this.orb?.body?.setSize(30, 30);

        this.orb.on("destroy", () => {
            console.log("orb destroyed");
            this.isDestroyed = true;
        });
    }

    public moveTowardsScreenCenter(): void {
        const centerX = this.orb.scene.cameras.main.centerX;
        const centerY = this.orb.scene.cameras.main.centerY;

        const angle = Phaser.Math.Angle.Between(this.orb.x, this.orb.y, centerX, centerY);


        this.orb.setVelocity(Math.cos(angle) * this.getSpeed(), Math.sin(angle) * this.getSpeed());
    }
}