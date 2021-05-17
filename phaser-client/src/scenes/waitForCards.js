import io from 'socket.io-client';
import Dealer from "../helpers/dealer";
import Card from '../helpers/card';

export default class waitForCards extends Phaser.Scene {
    constructor() {
        super({
            key: 'waitForCards'
        });
    }

    init(data){
        /**   Game   **/
        this.socket = data.server;
        this.id = data.id;
        this.cardNumbers = data.cardNumbers;
        this.story = data.story;
    }

    preload() {
        /**   Cards   **/
        this.load.image('card_0', 'src/assets/card-0.png');
    }

    create() {
        /**   Game   **/
        this.dealer = new Dealer(this);

        let self = this;

        this.dealText = this.add.text(75, 350, ['Wait for all players to choose a card for this story']).setFontSize(20).setFontFamily('Trebuchet MS').setColor('#413b45').setInteractive();
        this.storyText = this.add.text(75, 400, ['The story: ' + this.story]).setFontSize(30).setFontFamily('Trebuchet MS').setColor('#413b45').setInteractive();

        for (let i = 0; i < 6; i++) {
            let playerCard = new Card(self);
            playerCard.render(100 + (i * 165), 650, 'card_0', true);
        }
    }
}