import Card from '../helpers/card';

export default class scoresScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'ScoresScene'
        });
    }

    init(data){
        /**   Game   **/
        this.gameId = data.gameId;
        this.socket = data.server;
        this.id = data.id;
        this.storytellerCard = data.storytellerCard;
        this.story = data.story;
        this.gatheredCards = data.gatheredCards;
        this.cardVotes = data.cardVotes;
        this.isStoryteller = data.isStoryteller;        
    }

    preload() {
        this.load.image('button-continue','src/assets/button-continue.png');
    }

    create() {
        /**   Game   **/
        let self = this;
        let totalVotes = 0;

        this.socket.emit("sendScores", self.gameId);

        var style = { 
            fontSize: 32,
            fontFamily: 'Arial',
            align: "left",
            color: '#ffffff',
            wordWrap: { width: 250, useAdvancedWrap: true }
        };

        var styleBlackBackground = { 
            fontSize: 32,
            fontFamily: 'Arial',
            align: "left",
            color: '#ffffff',
            backgroundColor: "#413b45",
            wordWrap: { width: 250, useAdvancedWrap: true }
        };

        var styleBold = { 
            fontSize: 30,
            fontFamily: 'Arial',
            align: "left",
            color: '#ffffff',
            wordWrap: { width: 250, useAdvancedWrap: true }
        };

        for(let i=0; i<this.cardVotes.length; i++)
            totalVotes = totalVotes + this.cardVotes[i];

        this.add.rectangle(170, 530, 320, 560,"0x3f51b5");
        let playerCard = new Card(self);
        playerCard.render(170, 250, this.storytellerCard, true).setTint().setScale(1.8, 1.8);
        for(let i = 0; i<this.cardVotes.length; i++ )
            if(this.gatheredCards[i]==this.storytellerCard)
                this.add.text(170, 430, "Votes "+this.cardVotes[i]+"/"+totalVotes, styleBlackBackground);

        let ii=0; let jj=0;
        for (let j = 0; j < 2; j++)
            for (let i = 0; i < 2; i++) {
                let playerCard = new Card(self);
                if(this.gatheredCards.length > i + j*2){
                    if(this.gatheredCards[i + j*2]!=this.storytellerCard && this.gatheredCards[i + j*2]!=""){
                        if(ii==2){
                            ii=0; jj=1;
                        }
                        playerCard.render(445 + (ii * 225), 230 + 340 * jj, this.gatheredCards[i + j*2], true).setTint();
                        this.add.text(405 + (ii * 225), 345 + 340 * jj, " Votes "+this.cardVotes[i + j*2]+"/"+totalVotes+" ", styleBlackBackground);
                        ii++;
                    }
                }
            }
        
        this.add.text(50, 480, 'This is the card of the storyteller.\nFor the story:', style);
        this.add.text(50, 595, '' + this.story, styleBold).setFontSize(40);

        if (this.isStoryteller === true){
            const buttonContinue = this.add.image(850,605, "button-continue").setScale(0.5,0.5);
            buttonContinue.setInteractive();

            buttonContinue.once('pointerdown', () => {
                buttonContinue.disableInteractive();
                console.log("Continue");
                self.socket.emit("continue", self.gameId);
            });
        }

        this.socket.once('continueNormalPlayer', function () {
            if (self.scene.isActive("WaitForStory")) { 
                self.scene.stop("WaitForStory");
                self.scene.start("WaitForStory", {gameId: self.gameId, server: self.socket, id: self.id});            }
            else
                self.scene.start("WaitForStory", {gameId: self.gameId, server: self.socket, id: self.id});            
        })

        this.socket.once('continueStoryteller', function () {
            if (self.scene.isActive("WriteStory")) { 
                self.scene.stop("WriteStory");
                self.scene.start("WriteStory", {gameId: self.gameId, server: self.socket, id: self.id});            }
            else
                self.scene.start("WriteStory", {gameId: self.gameId, server: self.socket, id: self.id});                    
        })

        this.socket.once('endGame', function (winners, winnersId) {
            console.log("ScoreScene: " + winners);
            self.scene.start("EndGame", {gameId: self.gameId, server: self.socket, id: self.id, winners: winners, winnersId: winnersId});        
        })
    }
}