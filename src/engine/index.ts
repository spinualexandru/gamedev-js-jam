import { Scene } from "phaser";
import { Vector2 } from "../types/Geometry";
import { Gradient } from "../types/Render";

export class Engine extends Scene {
  background: Gradient;
  graphics: Phaser.GameObjects.Graphics;

  constructor() {
    super("Game");
  }

  getCenterX(): Vector2 {
    return {
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY,
    };
  }

  get centerX(): number {
    return this.cameras.main.centerX;
  }

  get centerY(): number {
    return this.cameras.main.centerY;
  }

  setBackgroundGradient(colorFrom: number, colorTo: number): void {
    this.graphics = this.add.graphics({});
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.background = {
      colorFrom,
      colorTo,
      alpha: 1,
    };
    this.graphics.setDepth(-1);
    this.graphics.fillGradientStyle(colorFrom, colorFrom, colorTo, colorTo, 1);

    this.graphics.fillRect(0, 0, width, height);
  }

  resizeBackground(graphics: Phaser.GameObjects.Graphics): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const { colorFrom, colorTo, alpha } = this.background;
    this.graphics.clear();
    this.graphics.setDepth(-1);
    this.graphics.fillGradientStyle(
      colorFrom,
      colorFrom,
      colorTo,
      colorTo,
      alpha
    );
    this.graphics.fillRect(0, 0, width, height);
  }
}
