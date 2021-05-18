import { Socket } from 'socket.io-client';
import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = (cardNumbers) => {
            console.log("Printed cardNumbers - " + cardNumbers.length + " : " + cardNumbers);
            for (let j = 0; j < 2; j++)
            for (let i = 0; i < 3; i++) {
                let number = cardNumbers.pop();
                let playerCard = new Card(scene);
                playerCard.render(150 + (i * 225), 230 + 340 * j, 'card_' + number, true);
            }
        }
    }
}