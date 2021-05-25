import Phaser from "phaser";
import StartGame from "./scenes/startGame";
import waitForStory from "./scenes/waitForStory";
import chooseCard from "./scenes/chooseCard";
import waitForCards from "./scenes/waitForCards";
import WriteStory from "./scenes/writeStory";
import voteScene from "./scenes/voteScene";
import scoresScene from "./scenes/scoresScene";
import endGame from "./scenes/endGame";

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
        scoresScene,
        endGame
    ],
};

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('myParam');

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let username = getParameterByName('username');
let gameid = getParameterByName('gameid');
console.log(username);
console.log(gameid);

const game = new Phaser.Game(config);