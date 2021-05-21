import io from 'socket.io-client';

export default class StartGame extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartGame'
        });
    }

    init(){
        /**   Chat   **/
        this.socket_chat = io("http://localhost:4000", { 
            autoConnect: false });
        this.chatMessages = [];

        function getParameterByName(name, url = window.location.href) {
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }
        
        this.username = getParameterByName('username');
        this.gameid = getParameterByName('gameid');
    }

    preload(){
        /**   Chat   **/
        this.load.html("form", "src/assets/form.html");
        
        /**   Game   **/
        this.load.image('button','src/assets/button-start-game.png');
    }

    create(){
        this.isPlayerA = false;
        let self = this;
        let id = "";
        let cardNumbers = [];
        console.log(this.username);
        console.log(this.gameid);

        let buttonStartGame = buttonStartGame = this.add.image(300,600, "button").setScale(0.5,0.5).setVisible(false);

        this.socket = io('http://localhost:3000', {transports : ["websocket"] });

        this.socket.on('connect', function () {
        	console.log('Connected! I am ' + this.id);
            id = this.id;
        });

        this.socket.on('isPlayerA', function () {
        	self.isPlayerA = true;
            console.log('I am first player (playerA)');
            waitForCreatorText.setVisible(false);
            waitForMorePlayersText.setVisible(true);
        });

        this.socket.on('enableStartButton', function () {
        	if (self.isPlayerA === true) {
                buttonStartGame.setInteractive();
                buttonStartGame.setVisible(true);
                waitForMorePlayersText.setVisible(false);
                canStartNowText.setVisible(true);
            }
        });

        var style = { 
            fontSize: 40,
            fontFamily: 'Arial',
            align: "left",
            color: '#413b45',
            wordWrap: { width: 450, useAdvancedWrap: true }
        };

        var waitForCreatorText = this.add.text(175, 350, 'Please wait for the game creator to start the game!', style);
        var waitForMorePlayersText = this.add.text(175, 350, 'Please wait for more players to enter!', style).setVisible(false);
        var canStartNowText = this.add.text(175, 350, 'You can start the game now! Good luck!', style).setVisible(false);

        buttonStartGame.on('pointerdown', () => {
            console.log('pointerover');
            self.socket.emit("dealCards", 6);
        });

        this.socket.on('startGame', function () {
            console.log('Game is starting, please be patient!');
            self.scene.start("waitForStory", { server: self.socket, id: id, cardNumbers: cardNumbers});
        })

        this.socket.on('dealCards', function (c) {
            cardNumbers = c;
            if (self.isPlayerA === true) {
                self.socket.emit("startGame", id);
                self.scene.start("WriteStory", { server: self.socket, id: id, cardNumbers: cardNumbers});
            }
        })

        /**   Chat   **/
        this.textInput = this.add.dom(1215, 752).createFromCache("form").setOrigin(0.5).setDepth(0);
        this.chat = this.add.text(1060, 30, "", { 
            lineSpacing: 10,
            fontSize: 20,
            backgroundColor: "#3f51b5", 
            color: "white", 
            padding: 15,
            wordWrap: { width: 280, useAdvancedWrap: true }
        });

        this.chat.setFixedSize(310, 695);

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.enterKey.on("down", event => {
            let chatbox = this.textInput.getChildByName("chat");
            if (chatbox.value != "") {
                this.socket_chat.emit("message", ">> " + this.username+": "+chatbox.value);
                console.log("Message: " + chatbox.value);
                chatbox.value = "";
            }
        })

        this.socket_chat.connect();
        
        this.socket_chat.on("connect", async () => {
            this.socket_chat.emit("join", this.gameid);
        });
        
        this.socket_chat.on("joined", async (gameId) => {
            let result = await fetch("http://localhost:4000/chats?room=" + gameId)
                .then(response => response.json());
            this.chatMessages = result.messages;
            this.chatMessages.push("\n*** Game Chat Start ***");
            if (this.chatMessages.length > 7) {
                this.chatMessages.shift();
            }
            this.chat.setText(this.chatMessages);
        });

        this.socket_chat.on("message", (message) => {
            this.chatMessages.push(message);
            if(this.chatMessages.length > 7) {
                this.chatMessages.shift();
            }
            this.chat.setText(this.chatMessages);
        });
    }
}