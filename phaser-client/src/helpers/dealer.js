import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            //initialize card numbers array
            let cardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
            //shuffle
            Phaser.Actions.Shuffle(cardNumbers);

            let opponentSprite = 'card_0';
            
            for (let i = 0; i < 5; i++) {
                let playerCard = new Card(scene);
                playerCard.render(475 + (i * 100), 650, 'card_' + cardNumbers.pop());

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite).disableInteractive());
            }
        }
    }
}