import Phaser from "phaser";
import StartGame from "./scenes/startGame";
import waitForStory from "./scenes/waitForStory";
import chooseCard from "./scenes/chooseCard";
import waitForCards from "./scenes/waitForCards";
import WriteStory from "./scenes/writeStory";
import voteScene from "./scenes/voteScene";
import scoresScene from "./scenes/scoresScene";

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
        WriteStory,
        waitForStory,
        chooseCard, 
        waitForCards,
        voteScene,
        scoresScene
    ]
};

const game = new Phaser.Game(config);