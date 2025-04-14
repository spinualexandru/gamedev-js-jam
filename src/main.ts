import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Scale, Types } from "phaser";

const config: Types.Core.GameConfig = {
  type: AUTO,
  parent: "game-container",
  antialias: true,
  antialiasGL: true,
  backgroundColor: "#ffffff",
  pixelArt: false,
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: true,
    roundPixels: false,
  },
  scene: [MainGame],
};

export default new Game(config);
