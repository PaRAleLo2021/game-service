import Phaser from "phaser";
import Game from "./scenes/game";

const config = {
    backgroundColor: '#f3cca3',
    scale: {
        parent: 'phaser-example',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1400,
        height: 800
    },
    scene: [
        Game
    ]
};

const game = new Phaser.Game(config);