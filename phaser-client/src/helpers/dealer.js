import { Socket } from 'socket.io-client';
import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = (cardNumbers) => {
            console.log("Received cardNumbers: " + cardNumbers.length);
            for (let j = 0; j < 2; j++)
            for (let i = 0; i < 3; i++) {
                let number = cardNumbers.pop();
                let playerCard = new Card(scene, number);
                playerCard.render(150 + (i * 225), 280 + 340 * j, 'card_' + number, true);
                //playerCard.setName(number);
            }
        }
    }
}