import io from 'socket.io-client';
import Card from '../helpers/card';
import Dealer from "../helpers/dealer";
import Zone from '../helpers/zone';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    init(){
        /**   Chat   **/
        this.socket_chat = io("http://localhost:4000", { 
            autoConnect: false });
        this.chatMessages = [];
    }

    preload() {
        /**   Chat   **/
        this.load.html("form", "src/assets/form.html");

        /**  Story form   **/
        this.load.html("storyform", "src/assets/storyform.html");

        this.load.image('button','src/assets/button-start-game.png');

        /**   Cards   **/
        this.load.image('card_0', 'src/assets/card-0.png');
        this.load.image('card_1', 'src/assets/card-1.png');
        this.load.image('card_2', 'src/assets/card-2.png');
        this.load.image('card_3', 'src/assets/card-3.png');
        this.load.image('card_4', 'src/assets/card-4.png');
        this.load.image('card_5', 'src/assets/card-5.png');
        this.load.image('card_6', 'src/assets/card-6.png');
        this.load.image('card_7', 'src/assets/card-7.png');
        this.load.image('card_8', 'src/assets/card-8.png');
        this.load.image('card_9', 'src/assets/card-9.png');
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
        this.opponentCards = [];

        this.add.text(295, 200, ['Choose a card and write your story!']).setFontSize(24).setFontFamily('Trebuchet MS').setColor('#413b45');

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);
        this.add.text(275, 400, ['Drop card here!']).setFontSize(24).setFontFamily('Trebuchet MS').setColor('#413b45');

        this.dealer = new Dealer(this);

        let self = this;

        this.socket = io('http://localhost:3000', {transports : ["websocket"] })

        this.socket.on('connect', function () {
        	console.log('Connected! I am ' + this.id);
        });

        this.socket.on('isPlayerA', function () {
        	self.isPlayerA = true;
            console.log('I am first player (playerA)');
        })
        
        this.socket.on('dealCards', function (cardNumbers) {
            cardNumbers = self.dealer.dealCards(cardNumbers);
            //self.dealText.disableInteractive();
        })

        this.socket.on('cardPlayed', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 50)), (self.dropZone.y), sprite, true).disableInteractive();
            }
        })

        //this.dealText = this.add.text(75, 350, ['SHOW CARDS']).setFontSize(20).setFontFamily('Trebuchet MS').setColor('#413b45').setInteractive();

		//this.dealText.on('pointerdown', function () {
          //  if(self.isPlayerA === true)
                self.socket.emit("dealCards", 6);
        //})
        /*
        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#000000');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#413b45');
        })*/

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            //this.bringToTop(gameObject);
            self.children.bringToTop(gameObject);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            dropZone.data.values.cards++;
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            //gameObject.disableInteractive();
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
        })

        /**   Story entry    **/

        this.errorMissingStory = this.add.text(360, 180, ['Please write a story!']).setFontSize(24).setFontFamily('Trebuchet MS').setColor('#413b45').setVisible(false);
        this.storyInput = this.add.dom(650, 300).createFromCache("storyform").setOrigin(0.5);
        this.enterStoryKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        const buttonSubmitStory = this.add.image(650,405, "button").setScale(0.5,0.5);
        buttonSubmitStory.setInteractive();
        buttonSubmitStory.on('pointerdown', () => {
            let storybox = this.storyInput.getChildByName("story");
            if (storybox.value != "") {
                console.log('My story: ' + storybox.value);
                storybox.value = "";
            }
            else{
                this.errorMissingStory.setVisible(true);
            }
        });

        /**   Chat   **/
        this.textInput = this.add.dom(1195, 752).createFromCache("form").setOrigin(0.5).setDepth(0);
        this.chat = this.add.text(1060, 30, "", { 
            lineSpacing: 15, 
            backgroundColor: "#21313CDD", 
            color: "#26924F", 
            padding: 10, 
            fontStyle: "bold" 
        });

        this.chat.setFixedSize(270, 645);

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.enterKey.on("down", event => {
            let chatbox = this.textInput.getChildByName("chat");
            if (chatbox.value != "") {
                this.socket_chat.emit("message", chatbox.value);
                console.log("Message: " + chatbox.value);
                chatbox.value = "";
            }
        })

        this.socket_chat.connect();
        
        this.socket_chat.on("connect", async () => {
            this.socket_chat.emit("join", "mongodb");
        });
        
        this.socket_chat.on("joined", async (gameId) => {
            let result = await fetch("http://localhost:4000/chats?room=" + gameId)
                .then(response => response.json());
            this.chatMessages = result.messages;
            this.chatMessages.push("Welcome to " + gameId);
            if (this.chatMessages.length > 20) {
                this.chatMessages.shift();
            }
            this.chat.setText(this.chatMessages);
        });

        this.socket_chat.on("message", (message) => {
            this.chatMessages.push(message);
            if(this.chatMessages.length > 20) {
                this.chatMessages.shift();
            }
            this.chat.setText(this.chatMessages);
        });

    }
}