import {Segment} from "./Segment";
import {Orb} from "@Game/Orb.ts";

export class Wheel {
    // Public properties
    public segments: Segment[] = [];
    public centerX: number;
    public centerY: number;

    // Private properties
    private scene: Phaser.Scene;
    private radius: number;
    private timeSlowdownDistance: number = 150;
    private slowTimeScale: number = 0.1;
    private slowOrbSpeed: number = 100;
    private angleOffset = 1.215;

    /**
     * Creates a new wheel instance
     */
    constructor(scene: Phaser.Scene, radius: number, centerX: number, centerY: number) {
        this.scene = scene;
        this.radius = radius;
        this.centerX = centerX;
        this.centerY = centerY;
    }

    /**
     * Creates the wheel with segments of different colors
     */
    public createWheel(colors: number[]): void {
        const segmentCount = colors.length;
        const angleStep = 360 / segmentCount;

        colors.forEach((color, index) => {
            const angle = angleStep * index;
            const position = this.calculatePosition(angle);
            const segment = Segment.create(color, angle, this.centerX, this.centerY, this.scene);

            this.initializeSegment(segment, position, angle, angleStep);
            this.segments.push(segment);
            this.setupSegmentPhysics(segment);
        });

        this.scene.data.set("Wheel", this);
    }

    /**
     * Enables collision detection between orb and segments with time slowdown
     */
    public enableCollision(orb: Orb): void {
        const timeSlowHandler = this.createTimeSlowHandler(orb);
        this.scene.events.on('update', timeSlowHandler);

        this.segments.forEach((segment) => {
            this.setupSegmentCollision(segment, orb, timeSlowHandler);
        });
    }

    /**
     * Returns the center X coordinate of the wheel
     */
    public getCenterX(): number {
        return this.centerX;
    }

    /**
     * Returns the center Y coordinate of the wheel
     */
    public getCenterY(): number {
        return this.centerY;
    }

    /**
     * Rotates the wheel by the given angle delta
     */
    public rotate(angleDelta: number): void {
        this.segments.forEach((segment) => {
            this.rotateSegment(segment, angleDelta);
        });
    }

    public increaseScore(): void {
        const multiplier = this.scene.data.get("Multiplier") || 1;
        const currentScore = this.scene.data.get("Score") || 0;
        this.scene.data.set("Score", (currentScore + 1) * multiplier);
    }

    public decreaseScore(): void {
        const currentScore = this.scene.data.get("Score") || 0;
        this.scene.data.set("Score", Math.max(currentScore - 1, 0));
    }

    /**
     * Calculates the position based on angle and radius
     */
    private calculatePosition(angle: number): { x: number; y: number } {
        const radians = Phaser.Math.DegToRad(angle);
        const x = this.centerX + this.radius * Math.cos(radians);
        const y = this.centerY + this.radius * Math.sin(radians);
        return {x, y};
    }

    /**
     * Initializes a segment with position and angle
     */
    private initializeSegment(
        segment: Segment,
        position: { x: number; y: number },
        angle: number,
        angleStep: number
    ): void {
        segment.sprite.setPosition(position.x, position.y);
        segment.sprite.setAngle(angle + (angleStep / this.angleOffset) * this.radius);
        segment.sprite.setData("initialAngle", angle);
        segment.angleStep = (angleStep / this.angleOffset) * this.radius; // Store angleStep adjustment
    }

    /**
     * Sets up physics for a segment
     */
    private setupSegmentPhysics(segment: Segment): void {
        this.scene.physics.add.existing(segment.sprite);
        (segment.sprite.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    }

    /**
     * Creates the time slow handler for the orb approach
     */
    private createTimeSlowHandler(orb: Orb): () => void {
        // Create the handler function
        const handler = () => {
            if (orb.isDestroyed) {
                this.resetTimeScale();
                // Use the handler reference from the enclosing scope
                this.scene.events.off('update', handler);
                return;
            }

            const closestDistance = this.getClosestSegmentDistance(orb);

            if (closestDistance < this.timeSlowdownDistance) {
                this.applySlowdownEffect(orb);
            } else {
                this.resetTimeScale();
            }
        };

        // Return the handler
        return handler;
    }

    /**
     * Gets the distance to the closest segment from the orb
     */
    private getClosestSegmentDistance(orb: Orb): number {
        let closestDistance = Number.MAX_VALUE;

        this.segments.forEach(segment => {
            const distance = Phaser.Math.Distance.Between(
                orb.orb.x, orb.orb.y,
                segment.sprite.x, segment.sprite.y
            );
            closestDistance = Math.min(closestDistance, distance);
        });

        return closestDistance;
    }

    /**
     * Applies slowdown effect to the game and orb
     */
    private applySlowdownEffect(orb: Orb): void {
        this.scene.time.timeScale = this.slowTimeScale;

        // Slow down orb speed
        orb.setSpeed(Math.min(orb.getSpeed(), this.slowOrbSpeed));

        // Adjust orb velocity direction toward center
        const centerX = orb.orb.scene.cameras.main.centerX;
        const centerY = orb.orb.scene.cameras.main.centerY;
        const angle = Phaser.Math.Angle.Between(orb.orb.x, orb.orb.y, centerX, centerY);

        orb.orb.setVelocity(
            Math.cos(angle) * orb.getSpeed(),
            Math.sin(angle) * orb.getSpeed()
        );
    }

    /**
     * Resets the time scale to normal
     */
    private resetTimeScale(): void {
        this.scene.time.timeScale = 1;
    }

    /**
     * Sets up collision for a segment with the orb
     */
    private setupSegmentCollision(segment: Segment, orb: Orb, timeSlowHandler: () => void): void {
        this.scene.physics.add.overlap(orb.orb, segment.sprite, () => {
            if (!orb.isDestroyed) {
                this.handleOrbSegmentCollision(segment, orb);
                this.scene.events.off('update', timeSlowHandler);
            }
        });
    }

    /**
     * Handles the collision between orb and segment
     */
    private handleOrbSegmentCollision(segment: Segment, orb: Orb): void {
        const segmentColor = Phaser.Display.Color.IntegerToColor(segment.getColor()).color;
        const orbColor = Phaser.Display.Color.IntegerToColor(orb.color).color;

        console.log(`Segment Color: ${segmentColor}, Orb Color: ${orbColor}`);

        // Freeze time on collision
        this.scene.time.timeScale = 0;

        if (segmentColor === orbColor) {
            console.log("Orb touched a segment with the same color!");
            this.increaseScore();
            if (this.scene.data.get("Score") > 1) {
                if (this.scene.data.get("Multiplier") <= 10) {
                    this.scene.data.set("Multiplier", this.scene.data.get("Multiplier") + 1);
                }
            }
        } else {
            console.log("Colors do not match:", segmentColor, orbColor);
            this.scene.cameras.main.shake(250, 0.015);
            this.scene.data.set("Multiplier", 1);
            this.decreaseScore();
        }

        orb.orb.destroy();
    }

    /**
     * Rotates an individual segment
     */
    private rotateSegment(segment: Segment, angleDelta: number): void {
        const initialAngle = segment.sprite.getData("initialAngle");
        const newAngle = initialAngle + angleDelta;
        const position = this.calculatePosition(newAngle);

        segment.sprite.setPosition(position.x, position.y);
        segment.sprite.setAngle(newAngle + segment.angleStep);

        this.updateSegmentPhysicsBody(segment, position);
        segment.sprite.setData("initialAngle", newAngle);
    }

    /**
     * Updates a segment's physics body position
     */
    private updateSegmentPhysicsBody(segment: Segment, position: { x: number; y: number }): void {
        const body = segment.sprite.body as Phaser.Physics.Arcade.Body;
        if (body) {
            body.reset(position.x, position.y);
            body.updateFromGameObject();
        }
    }
}