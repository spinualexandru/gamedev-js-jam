import { Segment } from "./Segment";
import { Colors } from "@/constants/colors";

export class Wheel {
  private scene: Phaser.Scene;
  private segments: Segment[] = [];
  private radius: number;
  private centerX: number;
  private centerY: number;

  constructor(
    scene: Phaser.Scene,
    radius: number,
    centerX: number,
    centerY: number
  ) {
    this.scene = scene;
    this.radius = radius;
    this.centerX = centerX;
    this.centerY = centerY;
  }

  public createWheel(colors: Colors[]): void {
    const segmentCount = colors.length;
    const angleStep = 360 / segmentCount;

    colors.forEach((color, index) => {
      const angle = angleStep * index;
      const radians = Phaser.Math.DegToRad(angle);

      const x = this.centerX + this.radius * Math.cos(radians);
      const y = this.centerY + this.radius * Math.sin(radians);

      const segment = Segment.create(
        color,
        angle,
        this.centerX,
        this.centerY,
        this.scene
      );

      segment.sprite.setPosition(x, y);
      segment.sprite.setAngle(angle + (angleStep / 1.2) * this.radius);

      this.segments.push(segment);
    });
  }

  public getSegments(): Segment[] {
    return this.segments;
  }
}
