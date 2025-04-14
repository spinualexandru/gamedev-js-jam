import { Engine } from "../engine";

export class Game extends Engine {
  preload() {
    this.load.setPath("assets");
  }

  create() {
    this.add
      .text(this.centerX, 80, "Hue\nHarmony", {
        fontFamily: "Modak",
        fontSize: 72,
        // GRADIENT COLOR
        color: "#FFDD3E",
        stroke: "#46112B",
        strokeThickness: 12,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);
  }
}
