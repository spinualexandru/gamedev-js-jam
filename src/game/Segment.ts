import {Vector2} from "@/types/Geometry";
import {Orb} from "@Game/Orb.ts";

export class Segment {
    public color: number;
    public angle: number;
    public graphics: Phaser.GameObjects.Graphics;
    public sprite: Phaser.GameObjects.Sprite;
    public target: Orb | null = null;
    public angleStep: number = 0; // Add this property

    #baseSize: Vector2 = {
        x: 446,
        y: 731,
    };

    #baseScale: number = 8;

    constructor(
        color: number,
        angle: number = 0,
        graphics: Phaser.GameObjects.Graphics
    ) {
        this.color = color;
        this.angle = angle;
        this.graphics = graphics;
    }

    static create(
        color: number,
        angle: number,
        x: number,
        y: number,
        scene: Phaser.Scene
    ): Segment {
        const graphics = scene.add.graphics();
        graphics.setDepth(1);
        const segment = new Segment(color, angle, graphics);
        segment.createSegment(color, angle, x, y);

        return segment;
    }

    public setAngle(angle: number): void {
        this.angle = angle;
    }

    public getAngle(): number {
        return this.angle;
    }

    public getColor(): number {
        return this.color;
    }

    public setColor(color: number): void {
        this.color = color;
    }

    public createSegment(
        color: number,
        angle: number,
        x: number,
        y: number
    ): Phaser.GameObjects.Sprite {
        const segmentSprite = this.graphics.scene.add.sprite(x, y, "segment");
        this.sprite = segmentSprite;

        const desiredWidth = this.#baseSize.x / this.#baseScale;
        const desiredHeight = this.#baseSize.y / this.#baseScale;

        segmentSprite.setAngle(angle);
        segmentSprite.setInteractive();
        segmentSprite.setOrigin(0.5, 0.5);
        segmentSprite.setTint(color);
        this.setColor(color);
        segmentSprite.setDisplaySize(desiredWidth, desiredHeight);

        // Add physics body and set its size
        this.graphics.scene.physics.add.existing(segmentSprite);
        const body = segmentSprite.body as Phaser.Physics.Arcade.Body;

        // Use smaller collision area for more precise collisions
        const bodyWidth = desiredWidth * 0.8;
        const bodyHeight = desiredHeight * 0.8;

        body.setSize(bodyWidth, bodyHeight);
        body.setOffset((desiredWidth - bodyWidth) / 2, (desiredHeight - bodyHeight) / 2);

        // Debug visualization of physics body (remove in production)
        // body.debugShowBody = true;
        // body.debugBodyColor = 0xff0000;

        return segmentSprite;
    }
}
