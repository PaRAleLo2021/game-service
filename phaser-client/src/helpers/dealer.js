import { Socket } from 'socket.io-client';
import Card from './card';

let NO_OF_PLAYERS = 4;

export default class Dealer {
    constructor(scene) {
        this.dealCards = (cardNumbers) => {
            let opponentSprite = 'card_0';
            console.log("Received cardNumbers: " + cardNumbers.length);

            for (let i = 0; i < 6; i++) {
                let playerCard = new Card(scene);
                playerCard.render(100 + (i * 165), 650, 'card_' + cardNumbers.pop(), true);

                /*for (let j = 0; j < NO_OF_PLAYERS-1; j++){
                    let opponentCard = new Card(scene);
                    scene.opponentCards.push(opponentCard.render(60 + (j * 500) + (i * 50), 125, opponentSprite, false).disableInteractive());
                }*/
            }

            return cardNumbers;
        }
    }
}