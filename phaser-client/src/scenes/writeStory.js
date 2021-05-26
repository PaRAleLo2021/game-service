import io from 'socket.io-client';
import Dealer from "../helpers/dealer";

export default class WriteStory extends Phaser.Scene {
    constructor() {
        super({
            key: 'WriteStory'
        });
    }

    init(data){

        /**   Game   **/
        this.socket = data.server;
        this.id = data.id;
        this.cardNumbers = [];
        this.cards = [];
    }

    preload() {

        /**  Story form   **/
        this.load.html("storyform", "src/assets/storyform.html");

        this.load.image('button','src/assets/button-start-game.png');

        /**   Cards   **/
        this.load.image('card_00', 'src/assets/card-0.png');
        this.load.image('card_01', 'src/assets/card-1.png');
        this.load.image('card_02', 'src/assets/card-2.png');
        this.load.image('card_03', 'src/assets/card-3.png');
        this.load.image('card_04', 'src/assets/card-4.png');
        this.load.image('card_05', 'src/assets/card-5.png');
        this.load.image('card_06', 'src/assets/card-6.png');
        this.load.image('card_07', 'src/assets/card-7.png');
        this.load.image('card_08', 'src/assets/card-8.png');
        this.load.image('card_09', 'src/assets/card-9.png');
        this.load.image('card_10', 'src/assets/card-10.png');
        this.load.image('card_11', 'src/assets/card-11.png');
        this.load.image('card_12', 'src/assets/card-12.png');
        this.load.image('card_13', 'src/assets/card-13.png');
        this.load.image('card_14', 'src/assets/card-14.png');
        this.load.image('card_15', 'src/assets/card-15.png');
        this.load.image('card_16', 'src/assets/card-16.png');
        this.load.image('card_17', 'src/assets/card-17.png');
        this.load.image('card_18', 'src/assets/card-18.png');
        this.load.image('card_19', 'src/assets/card-19.png');
        this.load.image('card_20', 'src/assets/card-20.png');
        this.load.image('card_21', 'src/assets/card-21.png');
        this.load.image('card_22', 'src/assets/card-22.png');
        this.load.image('card_23', 'src/assets/card-23.png');
        this.load.image('card_24', 'src/assets/card-24.png');
        this.load.image('card_25', 'src/assets/card-25.png');
        this.load.image('card_26', 'src/assets/card-26.png');
        this.load.image('card_27', 'src/assets/card-27.png');
        this.load.image('card_28', 'src/assets/card-28.png');
        this.load.image('card_29', 'src/assets/card-29.png');
        this.load.image('card_30', 'src/assets/card-30.png');
        this.load.image('card_31', 'src/assets/card-31.png');
        this.load.image('card_32', 'src/assets/card-32.png');
        this.load.image('card_33', 'src/assets/card-33.png');
        this.load.image('card_34', 'src/assets/card-34.png');
        this.load.image('card_35', 'src/assets/card-35.png');
        this.load.image('card_36', 'src/assets/card-36.png');
    }

    create() {
        /**   Game   **/
        this.isPlayerA = false;
        let self = this;
        // = this.cardNumbers.slice(0);
        this.dealer = new Dealer(this);      
        let selectedCard = null;
        
        this.socket.emit("dealCards",this.id);
        this.socket.on('dealCards', function (c) {
            console.log("I receved cards" + c);
            //self.cardNumbers = c;
            for(let i=0; i<c.length; i++){
                self.cardNumbers[i]=c[i];
                self.cards[i]=c[i];
            }
            self.dealer.dealCards(self.cardNumbers); 
            
        })        
        

        /**  Score printing  **/
        this.socket.emit("sendScores");
        
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
        this.text = this.add.text(750, 300, "Choose a card and write your story!", style);

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if(gameObject.texture.key!='button'){
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
            if(gameObject.texture.key!='button'){
                gameObject.setScale(1.8, 1.8);
            }
        })

        this.input.on('gameobjectout', function (pointer, gameObject) {
            if(gameObject.texture.key!='button'){
                gameObject.setScale(1.3, 1.3);
            }
        })


        /**   Story entry    **/
        this.errorMissingCardAndStory = this.add.text(750, 200, 'Please choose a Card and write a Story!', styleWarning).setVisible(false);
        this.storyInput = this.add.dom(850, 500).createFromCache("storyform").setOrigin(0.5);

        const buttonSubmitStory = this.add.image(850,605, "button").setScale(0.5,0.5);
        buttonSubmitStory.setInteractive();
        buttonSubmitStory.on('pointerdown', () => {
            let storybox = this.storyInput.getChildByName("story");

            if (storybox.value == "" || selectedCard == null) {
                this.errorMissingCardAndStory.setVisible(true);
            }

            else {
                console.log('My story: ' + storybox.value);
                console.log('My card: ' + selectedCard.texture.key);
                self.socket.emit("submitStory", storybox.value, self.id);
                self.socket.emit("storytellerCard", selectedCard.texture.key);
                self.socket.emit("gatherCards", selectedCard.texture.key, this.id);
                self.scene.start("WaitForCards", { server: self.socket, id: self.id, cardNumbers: self.cards, story: storybox.value, cardChoice: selectedCard.texture.key, isStoryteller: true});
                storybox.value = "";
            }
        });

    }
}