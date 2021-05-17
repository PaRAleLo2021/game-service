import io from 'socket.io-client';

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
        let cardNumbers = [];
        let buttonStartGame = buttonStartGame = this.add.image(300,600, "button").setScale(0.5,0.5).setVisible(false);

        this.socket = io('http://localhost:3000', {transports : ["websocket"] });

        this.socket.on('connect', function () {
        	console.log('Connected! I am ' + this.id);
            id = this.id;
        });

        this.socket.on('isPlayerA', function () {
        	self.isPlayerA = true;
            console.log('I am first player (playerA)');
            buttonStartGame.setInteractive();
            buttonStartGame.setVisible(true);
        })

        var style = { 
            fontSize: 40,
            fontFamily: 'Arial',
            align: "left",
            color: '#413b45',
            wordWrap: { width: 450, useAdvancedWrap: true }
        };

        this.add.text(175, 350, 'Please wait for the game creator to start the game.', style);
        
        buttonStartGame.on('pointerdown', () => {
            console.log('pointerover');
            self.socket.emit("dealCards", 6);
        });

        this.socket.on('startGame', function () {
            console.log('Game is starting, please be patient!');
            self.scene.start("waitForStory", { server: self.socket, id: id, cardNumbers: cardNumbers});
        })

        this.socket.on('dealCards', function (c) {
            cardNumbers = c;
            if (self.isPlayerA === true) {
                self.socket.emit("startGame", id);
                self.scene.start("WriteStory", { server: self.socket, id: id, cardNumbers: cardNumbers});
            }
        })

    }

    update() {
        
    }
}