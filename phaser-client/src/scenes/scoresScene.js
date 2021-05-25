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
        this.isStoryteller = data.isStoryteller;        
    }

    preload() {
        this.load.image('button','src/assets/button-start-game.png');
    }

    create() {
        this.scene.stop("writeStory");
        this.scene.stop("waitForStory");
        this.scene.stop("waitForCards");
        this.scene.stop("voteScene");
        this.scene.stop("chooseCard");
        /**   Game   **/
        let self = this;
        let totalVotes = 0;

        this.socket.emit("sendScores");

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
        this.add.text(170, 430, "Votes "+this.cardVotes[0]+"/"+totalVotes, styleBlackBackground);

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
            const buttonContinue = this.add.image(850,605, "button").setScale(0.5,0.5);
            buttonContinue.setInteractive();

            buttonContinue.on('pointerdown', () => {
                console.log("Continue");
                self.socket.emit("continue");
            });
        }

        this.socket.on('continueNormalPlayer', function () {
            self.scene.start("waitForStory", { server: self.socket, id: self.id});  
        })

        this.socket.on('continueStoryteller', function () {
            self.scene.start("WriteStory", { server: self.socket, id: self.id});        
        })

        this.socket.on('endGame', function (winners, winnersId) {
            console.log("ScoreScene: " + winners);
            self.scene.start("endGame", {server: self.socket, id: self.id, winners: winners, winnersId: winnersId});        
        })
    }
}