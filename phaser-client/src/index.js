import Phaser from "phaser";
import StartGame from "./scenes/startGame";
import WaitForStory from "./scenes/waitForStory";
import ChooseCard from "./scenes/chooseCard";
import WaitForCards from "./scenes/waitForCards";
import WriteStory from "./scenes/writeStory";
import VoteScene from "./scenes/voteScene";
import ScoresScene from "./scenes/scoresScene";
import EndGame from "./scenes/endGame";

var startGame = new StartGame();
var waitForStory = new WaitForStory();
var chooseCard = new ChooseCard();
var waitForCards = new WaitForCards();
var writeStory = new WriteStory();
var voteScene = new VoteScene();
var scoresScene = new ScoresScene();
var endGame = new EndGame();

const config = {
    backgroundColor: '#ffffff',
    scale: {
        parent: 'phaser-example',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1400,
        height: 800
    },
    dom: {
        createContainer: true
    }
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

game.scene.add('StartGame', startGame);
game.scene.add('WriteStory', writeStory);
game.scene.add('WaitForStory,', waitForStory);
game.scene.add('ChooseCard', chooseCard);
game.scene.add("WaitForCards", waitForCards);
game.scene.add("VoteScene", voteScene);
game.scene.add("ScoresScene", scoresScene);
game.scene.add("EndGame", endGame);

game.scene.start('StartGame');