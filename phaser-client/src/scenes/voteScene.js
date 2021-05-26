import Card from '../helpers/card';

export default class voteScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'VoteScene'
        });
    }

    init(data){
        /**   Game   **/
        this.socket = data.server;
        this.id = data.id;
        this.cardNumbers = data.cardNumbers;
        this.story = data.story;
        this.cardChoice =  data.cardChoice;
        this.isStoryteller = data.isStoryteller;       
    }

    preload() {
        this.load.image('button-vote','src/assets/button-vote.png');
    }

    create() {
        /**   Game   **/
        let self = this;
        let selectedCard = null;
        let cardNumbersForScore = this.cardNumbers;

        for (let i = this.cardNumbers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cardNumbers[i], this.cardNumbers[j]] = [this.cardNumbers[j], this.cardNumbers[i]];
        }

        for (let j = 0; j < 2; j++)
            for (let i = 0; i < 2; i++) {
                let number = this.cardNumbers[i + j*2];
                if(number!=""){
                    let playerCard = new Card(self);
                    playerCard.render(150 + (i * 225), 230 + 340 * j, number, true);
                }
            }

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

        let textVote = this.add.text(750, 290, 'Vote for the picture that describes the story best!', style);
        let textWait = this.add.text(750, 290, 'Please wait for all the players to vote.', style).setVisible(false);
        this.add.text(750, 450, 'The story: ' + this.story, style).setFontSize(40);
        this.errorMissingCard = this.add.text(750, 200, 'Please choose a Card!', styleWarning).setVisible(false);
        this.errorNotYourCard = this.add.text(750, 200, 'You can\'t vote for your own card!', styleWarning).setVisible(false);

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if(gameObject.texture.key!='button-vote'){
                if(selectedCard != null){
                    selectedCard.setTint(0x7885cb);
                    selectedCard.setScale(1.3, 1.3);
                }
                selectedCard = gameObject;
                self.children.bringToTop(gameObject);
                gameObject.setTint();
            }
        })

        this.input.on('gameobjectover', function (pointer, gameObject) {
            if(gameObject.texture.key!='button-vote'){
                gameObject.setScale(1.8, 1.8);
            }
        })

        this.input.on('gameobjectout', function (pointer, gameObject) {
            if(gameObject.texture.key!='button-vote'){
                gameObject.setScale(1.3, 1.3);
            }
        })

        const buttonVote = this.add.image(850,605, "button-vote").setScale(0.5,0.5);
        buttonVote.setInteractive();

        if(self.isStoryteller){
            buttonVote.setVisible(false);
            buttonVote.disableInteractive();
            textVote.setVisible(false);
            textWait.setVisible(true);
            //console.log("Emited voted waiting by Storyteller");
            self.socket.emit("votedWaiting",self.id);
        }

        buttonVote.on('pointerdown', () => {
            if (selectedCard == null) {
                this.errorNotYourCard.setVisible(false);
                this.errorMissingCard.setVisible(true);
            }
            else if(selectedCard.texture.key == this.cardChoice){
                this.errorMissingCard.setVisible(false);
                this.errorNotYourCard.setVisible(true);
            }
            else {
                console.log('My card: ' + selectedCard.texture.key);
                buttonVote.setVisible(false);
                buttonVote.disableInteractive();
                this.errorMissingCard.setVisible(false);
                this.errorNotYourCard.setVisible(false);
                textVote.setVisible(false);
                textWait.setVisible(true);
                self.socket.emit("gatherVotedCards", selectedCard.texture.key, this.id);
                if(!this.isStoryteller) {
                    //console.log("Emited voted waiting");
                    self.socket.emit("votedWaiting",self.id);
                }
            }
        });

        this.socket.once('voteResults', function (data) {
            let storytellerCard = data.storytellerCard;
            let gatheredCards = data.gatheredCards;
            let cardVotes = data.cardVotes;

            if (self.scene.isActive("ScoreScene")) { 
                self.scene.stop("ScoreScene");
                self.scene.start("ScoresScene", { server: self.socket, id: self.id, storytellerCard: storytellerCard, story: self.story, gatheredCards: gatheredCards, cardVotes: cardVotes, isStoryteller: self.isStoryteller});
            }
            else
                self.scene.start("ScoresScene", { server: self.socket, id: self.id, storytellerCard: storytellerCard, story: self.story, gatheredCards: gatheredCards, cardVotes: cardVotes, isStoryteller: self.isStoryteller});      
        });
    }
}