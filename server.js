const { SSL_OP_EPHEMERAL_RSA, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
let playersId = [];
let storyteller = 0;
let playersUsername = [];
let playersCards = [];
let scores = [];
let gatheredCards = [];
let gatheredVotedCards = [];
let waiting = 0;
let storytellerCard;
let cardVotes = [];
let self = this;
let storytellerEmitedWaiting = false;
let round = 1;

//initialize card numbers array
let cardNumbers = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18",
    "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"];
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

    playersId.push(socket.id);
    scores.push(0);

    if (playersId.length === 1) {
        io.emit('isPlayerA');
    };

    if (playersId.length >= 3) {
        io.to(playersId[0]).emit('enableStartButton');
    }

    socket.on('saveUsername', function (username) {
        playersUsername.push(username);
    });

    socket.on('dealCards', function (id) {
        for (let i=0; i<playersId.length; i++) {
            if(playersId[i] == id){
                let cards=[];
                for(let j=i*6; j<6*(i+1); j++){
                    cards.push(playersCards[j]);
                }
                io.to(playersId[i]).emit('dealCards', cards);
                //console.log("Sent cards"+ cards.length +": " + cards + " left cards " + cardNumbers.length);
            }
        }
    });

    socket.on('cardPlayed', function (gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });

    socket.on('startGame', function(id) {
        console.log('Game is starting...');
        // initialize game
        gatheredCards = ["","","",""];
        cardVotes = new Array(playersId.length);
        for(let i=0; i < playersId.length; i++){
            cardVotes[i] = 0;
        }
        for (let i = 0; i < playersId.length; i++) {
            if (playersId[i] !== id) {
                io.to(playersId[i]).emit('startGame');
            }
        }
        playersCards = [];
        let cards=[];
        for (let i = 0; i < playersId.length; i++) {
            for (let j = 0; j < 6; j++) {
                playersCards.push(cardNumbers.pop());
            }
            cards = [];
        }
        console.log("All cards added "+ playersCards);
        console.log("Cards left: "+ cardNumbers.length);
    });

    socket.on('submitStory', function(story, id) {
        //console.log('-> story: ' + story + " from player " + id);
        for (let i = 0; i < playersId.length; i++) {
            if (playersId[i] !== id) {
                io.to(playersId[i]).emit('submittedStory', story);
            }
        }
    });

    socket.on('gatherCards', function(card, id) {
        // remove card from hand
        for(let i=0; i<playersCards.length; i++)
            if(card.includes(playersCards[i]))
                playersCards[i] = cardNumbers.pop();
        for(let i=0; i<playersId.length; i++)
            if(playersId[i]==id)
                gatheredCards[i]=card;
    });

    socket.on('gatherVotedCards', function(card, id) {
        for(i=0; i < gatheredCards.length; i++){
            if(id === playersId[i])
                gatheredVotedCards[i]=card;
            if(gatheredCards[i] === card)
                cardVotes[i]++;
        }
    });

    socket.on('storytellerCard', function(card) {
        storytellerCard = card;
    });

    socket.on('waiting', function() {
        waiting++;
        if (waiting === playersId.length) {
            for (let i = 0; i < playersId.length; i++) {
                io.to(playersId[i]).emit('cardResults', gatheredCards);
            }
            waiting = 0;
        }
    });

    socket.on('votedWaiting', function(id) {
        if(!storytellerEmitedWaiting||id!=playersId[storyteller]){
            if(id==playersId[storyteller])
                storytellerEmitedWaiting=true;
            waiting++;
        }
        console.log("Waiting " + waiting + " by " + id);
        if (waiting === playersId.length) {
            //console.log("StorytellerCard " + storytellerCard);
            //console.log("GatheredCards " + gatheredCards);
            //console.log("Votes " + cardVotes);

            /*** Scoring Logic ***/
            let storytellerVotes = cardVotes[storyteller];
            if(storytellerVotes===playersId.length-1||storytellerVotes===0){
                for(let i=0; i<playersId.length; i++){
                    scores[i]=scores[i]+2;
                }
                scores[storyteller]=scores[storyteller]-2;
            }
            else{
                for(let i=0; i<playersId.length; i++){
                    if(i!=storyteller&&storytellerCard===gatheredVotedCards[i])
                        scores[i]=scores[i]+3;
                }
                scores[storyteller]=scores[storyteller]+3;
            }
            for(let i=0; i<playersId.length; i++)
                if(i!==storyteller)
                    scores[i]= scores[i]+cardVotes[i];
        
            for(let i=0; i < playersId.length; i++){
                gatheredVotedCards[i] = "";
            }

            for (let i = 0; i < playersId.length; i++) {
                io.to(playersId[i]).emit('voteResults', {storytellerCard: storytellerCard, gatheredCards: gatheredCards, cardVotes: cardVotes});
            }
            waiting = 0;
            storytellerEmitedWaiting=false;
        }
    });

    socket.on('sendScores', function() {
        io.to(socket.id).emit('printScores', playersUsername, scores);
    });

    socket.on('sendRound', function() {
        io.to(socket.id).emit('saveRound', round);
    });

    socket.on('continue', function() {
        let winners = [];
        let winnersId = [];

        for(let i=0; i < playersId.length; i++){
            cardVotes[i] = 0;
        }
        
        for(let i = 0; i < playersId.length; i++) {
            if (scores[i] >= 15) {
                winners.push(playersUsername[i]);
                winnersId.push(playersId[i]);
            }
        }

        if (winners.length >= 1) {
            for (let i = 0; i < playersId.length; i++) {
                io.to(playersId[i]).emit('endGame', winners, winnersId);
            }
        }
        else {
            round++;
            if (storyteller == playersId.length - 1) {
                storyteller = 0;
            }
            else
                storyteller = storyteller + 1;
        
            console.log("I am storyteller: "+playersId[storyteller]);

            for (let i = 0; i < playersId.length; i++) {
                if (i === storyteller) {
                    io.to(playersId[i]).emit("continueStoryteller");
                }
                else
                    io.to(playersId[i]).emit("continueNormalPlayer");
            }
        }
    });

    socket.on('disconnect', function () {
        let i = playersId.indexOf(socket.id);
        console.log('User ' + i + ' disconnected: ' + socket.id);

        playersId = playersId.filter(player => player !== socket.id);
        scores.pop(i);
    });
});

http.listen(3000, function () {
    console.log('Server started!');
});