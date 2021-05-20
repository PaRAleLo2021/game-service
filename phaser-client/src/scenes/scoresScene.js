import Card from '../helpers/card';

export default class scoresScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'scoresScene'
        });
    }

    init(data){
        /**   Game   **/
        this.socket = data.server;
        this.id = data.id;
        this.storytellerCard = data.storytellerCard;
        this.story = data.story;
        this.gatheredCards = data.gatheredCards;
        this.cardVotes = data.cardVotes;
        
    }

    preload() {
        this.load.image('button','src/assets/button-start-game.png');
    }

    create() {
        /**   Game   **/
        let self = this;

        console.log("Printed cardNumber - " + " : " + this.storytellerCard);
        let StorytellerCard = new Card(self);
        StorytellerCard.render(150, 230, this.storytellerCard, true);
        
        var style = { 
            fontSize: 34,
            fontFamily: 'Arial',
            align: "left",
            color: '#413b45',
            wordWrap: { width: 250, useAdvancedWrap: true }
        };

        this.add.text(750, 290, 'This is the card of the storyteller', style);
        this.add.text(750, 450, 'The story: ' + this.story, style).setFontSize(40);
    }
}