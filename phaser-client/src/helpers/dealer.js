import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let opponentSprite = 'card_0';
            let usedCards = new Array(36);
            
            for (let i = 0; i < 5; i++) {
                let playerCard = new Card(scene);

                /*let usableCards = new Array(36);
                for (let j = 1; j < 37; j++) {
                    if (!usedCards.includes(j))
                        usableCards.push(j);
                } */

                //let randomNumber = getRandomIntInclusive(1, usableCards.length);
                let cardNumber = getRandomIntInclusive(1, 36);  //parseInt(usableCards[randomNumber]);
                
                playerCard.render(475 + (i * 100), 650, 'card_' + cardNumber);
                usedCards.push(cardNumber);

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite).disableInteractive());
            }
        }
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
  