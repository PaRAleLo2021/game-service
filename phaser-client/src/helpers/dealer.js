import { Socket } from 'socket.io-client';
import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = (cardNumbers) => {
            console.log("Printed cardNumbers - " + cardNumbers.length + " : " + cardNumbers);

            for (let i = 0; i < 6; i++) {
                let playerCard = new Card(scene);
                playerCard.render(100 + (i * 165), 650, 'card_' + cardNumbers.pop(), true);
            }
        }
    }
}