import io from 'socket.io-client';

export default class endGame extends Phaser.Scene {
    constructor() {
        super({
            key: 'EndGame'
        });
    }

    init(data){
        /**   Chat   **/
        this.socket_chat = io("http://localhost:4000", { 
            autoConnect: false });
        this.chatMessages = [];

        /**   Game   **/
        this.socket = data.server;
        this.id = data.id;
        this.winners = data.winners;
        this.winnersId = data.winnersId;
    }

    preload() {
        /**   Chat   **/
        this.load.html("form", "src/assets/form.html");
    }

    create() {
        /**   Game   **/
        let self = this;

        /**  Score printing  **/
        this.socket.emit("sendScores");

        var style = { 
            fontSize: 34,
            fontFamily: 'Arial',
            align: "left",
            color: '#413b45',
            wordWrap: { width: 250, useAdvancedWrap: true }
        };
        var styleWarning = { 
            fontSize: 24,
            fontFamily: 'Arial',
            align: "left",
            color: 'red',
            wordWrap: { width: 250, useAdvancedWrap: true }
        };

        this.add.text(750, 300, 'Winner(s): ', style);
        console.log(this.winners);
        for (let i=0; i < this.winners.length; i++) {
            this.add.text(790, 350 + (30 * i), this.winners[i], style);
        }
    }
}