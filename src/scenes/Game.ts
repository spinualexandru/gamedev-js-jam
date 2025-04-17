import {Colors, UI_Colors} from "@Constants/colors";
import {Engine} from "../engine";
import {Wheel} from "@/game/Wheel";
import {Orb} from "@Game/Orb.ts";
import GameObject = Phaser.GameObjects.GameObject;

export class Game extends Engine {
    // Properties
    private wheel: Wheel;
    private scoreText: Phaser.GameObjects.Text;
    private lastPointerAngle: number | null = null;

    // Constants
    private readonly INITIAL_WHEEL_RADIUS = 90;
    private readonly ORB_SPAWN_Y = 100;
    private readonly SCORE_TEXT_Y = 80;

    /**
     * Preload game assets and initialize data
     */
    preload(): void {
        this.loadAssets();
        this.initializeGameData();
    }

    /**
     * Create game objects, setup handlers and initialize the game
     */
    create(): void {
        this.initializeGamePhase();
        this.createScoreText();
        this.createWheel();
        this.spawnInitialOrb();
        this.setupInputHandlers();
        this.setupScoreChangeListener();
    }

    /**
     * Called when the scene is ready
     */
    ready(): void {
        console.log("Game scene is ready");
    }

    /**
     * Spawns a new orb with random color and position
     */
    private spawnOrb(): void {
        const segmentColors = Array.from(Colors.values());
        const randomX = Phaser.Math.Between(0, this.cameras.main.width);
        const randomOrbColor = this.getRandomColor(segmentColors);

        const orb = Orb.spawnOrb(randomX, this.ORB_SPAWN_Y, this.wheel.segments[0], this, randomOrbColor);
        orb.moveTowardsScreenCenter();
        this.wheel.enableCollision(orb);
    }

    /**
     * Loads all game assets
     */
    private loadAssets(): void {
        this.load.setPath("assets");

        this.load.svg("segment", "segment.svg", {
            scale: 2,
            width: 137,
            height: 223
        });

        this.load.image("orb", "orb.png");
        this.textures.get("segment").setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.load.font("Modak-Regular", "Modak-Regular.ttf");

        this.setBackgroundGradient(UI_Colors.BACKGROUND, UI_Colors.BACKGROUND);
    }

    /**
     * Initializes game data
     */
    private initializeGameData(): void {
        this.data.set("Score", 0);
        this.data.set("Multiplier", 1);
    }

    /**
     * Sets initial game phase
     */
    private initializeGamePhase(): void {
        this.data.set("Phase", 1);
        this.setBackgroundGradient(UI_Colors.BACKGROUND, UI_Colors.BACKGROUND);
    }

    /**
     * Creates the score text display
     */
    private createScoreText(): void {
        this.scoreText = this.add
            .text(this.centerX, this.SCORE_TEXT_Y, `Score: ${this.data.get("Score")}`, {
                fontFamily: "Modak-Regular",
                fontSize: 72,
                color: "#FFDD3E",
                stroke: "#46112B",
                strokeThickness: 12,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);
    }

    /**
     * Creates the wheel with colored segments
     */
    private createWheel(): void {
        const segmentColors = Array.from(Colors.values());
        this.wheel = new Wheel(this, this.INITIAL_WHEEL_RADIUS, this.centerX, this.centerY);
        this.wheel.createWheel(segmentColors);
    }

    /**
     * Spawns the initial orb for the game
     */
    private spawnInitialOrb(): void {
        const segmentColors = Array.from(Colors.values());
        const randomX = Phaser.Math.Between(0, this.cameras.main.width);
        const randomOrbColor = this.getRandomColor(segmentColors);

        const orb = Orb.spawnOrb(randomX, this.ORB_SPAWN_Y, this.wheel.segments[0], this, randomOrbColor);
        orb.moveTowardsScreenCenter();
        this.wheel.enableCollision(orb);
    }

    /**
     * Sets up input handlers for wheel rotation
     */
    private setupInputHandlers(): void {
        this.setupPointerMoveHandler();
        this.setupPointerOutHandler();
    }

    /**
     * Sets up handler for pointer movement to rotate wheel
     */
    private setupPointerMoveHandler(): void {
        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            // Calculate angle between wheel center and current pointer position
            const dx = pointer.x - this.wheel.getCenterX();
            const dy = pointer.y - this.wheel.getCenterY();
            const currentPointerAngle = Phaser.Math.RadToDeg(Math.atan2(dy, dx));

            if (this.lastPointerAngle !== null) {
                let angleDelta = currentPointerAngle - this.lastPointerAngle;

                // Normalize angleDelta to avoid large jumps when crossing 180/-180 boundary
                angleDelta = Phaser.Math.Wrap(angleDelta, -180, 180);

                // Apply rotation to follow the pointer
                this.wheel.rotate(angleDelta);
            }

            this.lastPointerAngle = currentPointerAngle;
        });
    }

    /**
     * Sets up handler for when pointer leaves game area
     */
    private setupPointerOutHandler(): void {
        this.input.on("pointerout", () => {
            this.lastPointerAngle = null;
        });
    }

    /**
     * Sets up listener for score changes
     */
    private setupScoreChangeListener(): void {
        this.data.events.on('changedata-Score', (_gameObject: GameObject, value: number) => {
            if (this.data.get("Multiplier") > 1) {
                this.updateScoreDisplay(value + "x" + this.data.get("Multiplier"));
            } else {
                this.updateScoreDisplay(value.toString());
            }

            this.spawnOrb();
        });
    }

    /**
     * Updates the score display text
     */
    private updateScoreDisplay(value: string): void {
        this.scoreText.setText(`Score: ${value}`);
    }

    /**
     * Gets a random color from an array of colors
     */
    private getRandomColor(colors: number[]): number {
        return colors[Math.floor(Math.random() * colors.length)];
    }
}