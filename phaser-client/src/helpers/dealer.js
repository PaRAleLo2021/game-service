import Card from './card';

let NO_OF_PLAYERS = 4;

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            //initialize card numbers array
            let cardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
            //shuffle
            Phaser.Actions.Shuffle(cardNumbers);

            let opponentSprite = 'card_0';

            for (let i = 0; i < 6; i++) {
                let playerCard = new Card(scene);
                playerCard.render(350 + (i * 175), 650, 'card_' + cardNumbers.pop(), true);

                for (let j = 0; j < NO_OF_PLAYERS-1; j++){
                    let opponentCard = new Card(scene);
                    scene.opponentCards.push(opponentCard.render(60 + (j * 500) + (i * 50), 125, opponentSprite, false).disableInteractive());
                }
            }
        }
    }
}