import Phaser from "phaser";
import Game from "./scenes/game";
import StartGame from "./scenes/startGame";
import waitForStory from "./scenes/waitForStory";

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
        Game,
        waitForStory
    ]
};

const game = new Phaser.Game(config);