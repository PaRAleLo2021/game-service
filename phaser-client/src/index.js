import Phaser from "phaser";
import Game from "./scenes/game";

const config = {
    type: Phaser.CANVAS,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    transparent: true,
    scene: [
        Game
    ]
};

const game = new Phaser.Game(config);