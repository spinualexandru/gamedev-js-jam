import {Game as MainGame} from "./scenes/Game";
import {Game, Scale, Types} from "phaser";

const config: Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    parent: "game-container",
    antialias: true,
    antialiasGL: true,
    backgroundColor: "#ffffff",

    pixelArt: false,
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    scale: {
        mode: Scale.FIT,
        width: 1280,
        height: 1024,
        autoCenter: Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            fps: 60,
        }
    },
    scene: [MainGame],
};

export default new Game(config);
