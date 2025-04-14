import { Scene } from "phaser";
import { Vector2 } from "../types/Geometry";

export class Engine extends Scene {
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
}
