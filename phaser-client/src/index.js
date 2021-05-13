import Phaser from "phaser";
import Game from "./scenes/game";
import StartGame from "./scenes/startGame";

const config = {
    backgroundColor: '#f3cca3',
    scale: {
        parent: 'phaser-example',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1400,
        height: 800
    },
    dom: {
        createContainer: true
    },
    scene: [
        StartGame,
        Game
    ]
};

const game = new Phaser.Game(config);