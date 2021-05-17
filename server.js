const { SSL_OP_EPHEMERAL_RSA } = require('constants');

const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
let players = [];
let cards = [];

//initialize card numbers array
let cardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
//shuffle
shuffle(cardNumbers);

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    };

    socket.on('dealCards', function (cardsToGiveOut) {
        for (let i = 0; i < players.length; i++) {
            for (let j = 0; j < cardsToGiveOut; j++) {
                cards.push(cardNumbers.pop());
            }
            io.to(players[i]).emit('dealCards', cards);
            console.log("Sent cards: " + cards.length + ", remained: " + cardNumbers.length);
            cards = [];
        }
    });

    socket.on('cardPlayed', function (gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });

    socket.on('startGame', function(id) {
        console.log('Game is starting...');
        for (let i = 0; i < players.length; i++) {
            if (players[i] !== id) {
                io.to(players[i]).emit('startGame');
            }
        }
    });

    socket.on('submitStory', function(story, id) {
        console.log('-> story: ' + story + " from player " + id);
        for (let i = 0; i < players.length; i++) {
            if (players[i] !== id) {
                io.to(players[i]).emit('submittedStory', story);
            }
        }
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });
});

http.listen(3000, function () {
    console.log('Server started!');
});