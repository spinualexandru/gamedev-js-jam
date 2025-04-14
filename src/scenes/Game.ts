import { Colors, UI_Colors } from "@Constants/colors";
import { Engine } from "../engine";
import { Wheel } from "@/game/Wheel";

export class Game extends Engine {
  preload() {
    this.load.setPath("assets");
    this.load.svg("segment", "segment.svg", {
      scale: 4,
    });
    this.textures.get("segment").setFilter(Phaser.Textures.FilterMode.LINEAR);
  }

  create() {
    this.setBackgroundGradient(UI_Colors.BACKGROUND, UI_Colors.BACKGROUND);
    this.graphics.clear();

    this.graphics.setDepth(1);
    this.add
      .text(this.centerX, 80, "Hue\nHarmony", {
        fontFamily: "Modak",
        fontSize: 72,
        color: "#FFDD3E",
        stroke: "#46112B",
        strokeThickness: 12,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    const segmentColors = [
      Colors.YELLOW,
      Colors.GREEN,
      Colors.TURQUOISE,
      Colors.LIGHT_BLUE,
      Colors.BLUE,
      Colors.DARK_BLUE,
      Colors.DARK_PURPLE,
      Colors.PURPLE,
      Colors.LIGHT_PURPLE,
      Colors.PINK,
      Colors.RED,
      Colors.LIGHT_RED,
      Colors.ORANGE,
      Colors.LIGHT_ORANGE,
      Colors.DARK_YELLOW,
      Colors.LIGHT_YELLOW,
    ];

    // Create the segment
    //Segment.create(Colors.GREEN, 0, this.centerX, this.centerY, this);

    const wheel = new Wheel(this, 120, this.centerX, this.centerY);
    wheel.createWheel(segmentColors);

    this.scale.on("resize", () => this.resizeBackground(this.graphics));
  }
}
