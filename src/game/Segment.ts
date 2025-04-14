import { Colors } from "@/constants/colors";
import { stringToHex } from "@/engine/colors";

export class Segment {
  public color: Colors;
  public angle: number;
  public graphics: Phaser.GameObjects.Graphics;
  public sprite: Phaser.GameObjects.Sprite;

  constructor(
    color: Colors,
    angle: number = 0,
    graphics: Phaser.GameObjects.Graphics
  ) {
    this.color = color;
    this.angle = angle;
    this.graphics = graphics;
  }

  public setAngle(angle: number): void {
    this.angle = angle;
  }

  public getAngle(): number {
    return this.angle;
  }

  public getColor(): Colors {
    return this.color;
  }

  public setColor(color: Colors): void {
    this.color = color;
  }
  public createSegment(
    color: Colors,
    angle: number,
    x: number,
    y: number
  ): Phaser.GameObjects.Sprite {
    const segmentSprite = this.graphics.scene.add.sprite(x, y, "segment");

    segmentSprite.setDisplaySize(446, 731);
    segmentSprite.setOrigin(0.5, 0.5);
    segmentSprite.setAngle(angle);
    segmentSprite.setTint(stringToHex(color));
    segmentSprite.setInteractive();

    const desiredWidth = 446 / 8;
    const desiredHeight = 731 / 8;
    segmentSprite.setDisplaySize(desiredWidth, desiredHeight);

    segmentSprite.on("pointerover", () => {
      segmentSprite.setDisplaySize(desiredWidth * 1.2, desiredHeight * 1.2);
    });

    segmentSprite.on("pointerout", () => {
      segmentSprite.setDisplaySize(desiredWidth, desiredHeight);
    });

    this.sprite = segmentSprite;
    return segmentSprite;
  }

  static create(
    color: Colors,
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
}
