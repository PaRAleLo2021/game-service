import io from 'socket.io-client';
//import Card from '../helpers/card';
//import Dealer from "../helpers/dealer";
//import Zone from '../helpers/zone';

export default class StartGame extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartGame'
        });
    }

    init(){
        
    }

    preload(){
        this.load.image('button','src/assets/button-start-game.png');
    }

    create(){
        this.isPlayerA = false;
        let self = this;
        let id;

        this.socket = io('http://localhost:3000', {transports : ["websocket"] });

        this.socket.on('connect', function () {
        	console.log('Connected! I am ' + this.id);
            id = this.id;
        });

        this.socket.on('isPlayerA', function () {
        	self.isPlayerA = true;
            console.log('I am first player (playerA)');
            buttonStartGame.setInteractive();
        })

        this.dealText = this.add.text(75, 350, ['Please wait for the game creator to start the game']).setFontSize(20).setFontFamily('Trebuchet MS').setColor('#413b45');
        
        const buttonStartGame = this.add.image(300,600, "button").setScale(0.5,0.5);
        
        buttonStartGame.on('pointerdown', () => {
            console.log('pointerover');
            this.socket.emit("startGame", id);
            self.scene.start("Game", { server: this.socket, id: id});
        });

        this.socket.on('startGame', function () {
            console.log('Game is starting, please be patient!');
            self.scene.start("waitForStory", { server: self.socket, id: id});
        })
    }

    update() {
        
    }
}