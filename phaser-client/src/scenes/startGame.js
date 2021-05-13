import io from 'socket.io-client';
import Card from '../helpers/card';
import Dealer from "../helpers/dealer";
import Zone from '../helpers/zone';

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
        this.dealText = this.add.text(75, 350, ['Please wait for the game creator to start the game']).setFontSize(20).setFontFamily('Trebuchet MS').setColor('#413b45');
        
        const buttonStartGame = this.add.image(300,600, "button").setScale(0.5,0.5);
        buttonStartGame.setInteractive();
        buttonStartGame.on('pointerdown', () => {
             console.log('pointerover');
             this.scene.start("Game");
        });

    }
}