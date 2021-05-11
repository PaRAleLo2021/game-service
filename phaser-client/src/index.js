import Phaser from "phaser";
import Game from "./scenes/game";

const config = {
    type: Phaser.CANVAS, //type: Phaser.AUTO,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280, //window.innerWidth * window.devicePixelRatio,
    height: 780, //window.innerHeight * window.devicePixelRatio,
    transparent: true,
    scene: [
        Game
    ]
};

const game = new Phaser.Game(config);