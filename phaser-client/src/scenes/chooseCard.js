import Dealer from "../helpers/dealer";

export default class chooseCard extends Phaser.Scene {
    constructor() {
        super({
            key: 'chooseCard'
        });
    }

    init(data){
        /**   Game   **/
        this.socket = data.server;
        this.id = data.id;
        this.cardNumbers = data.cardNumbers;
        this.story = data.story;

        this.cards = [];
    }

    preload() {
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
        this.dealer = new Dealer(this);
        let self = this;
        for(let i=0; i<this.cardNumbers.length; i++){
            self.cards[i]=this.cardNumbers[i];
        }
        self.dealer.dealCards(this.cardNumbers);
        console.log("This are the cards in ChooseCard"+self.cards);
        let selectedCard = null;

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

        this.add.text(750, 300, 'Choose a card that goes best with the story', style);
        this.add.text(750, 420, 'The story: ' + this.story, style).setFontSize(40);
        this.errorMissingCard = this.add.text(750, 200, 'Please choose a Card!', styleWarning).setVisible(false);

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

        const buttonSubmitStory = this.add.image(850,605, "button").setScale(0.5,0.5);
        buttonSubmitStory.setInteractive();
        buttonSubmitStory.on('pointerdown', () => {
            if (selectedCard == null) {
                this.errorMissingCard.setVisible(true);
            }

            else {
                console.log('My card: ' + selectedCard.texture.key);
                self.socket.emit("gatherCards", selectedCard.texture.key, this.id);
                self.scene.start("waitForCards", { server: self.socket, id: self.id, cardNumbers: self.cards, story: this.story, cardChoice: selectedCard.texture.key, isStoryteller: false});
            }
        });

    }
}