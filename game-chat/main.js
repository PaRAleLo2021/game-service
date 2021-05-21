const express = require("express")();
const cors = require("cors");
const http = require("http").createServer(express);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb+srv://paralelo:COOFR2a3OBnh32Om@dp-project.2tacv.mongodb.net/game-chat?retryWrites=true&w=majority");

express.use(cors());
var collection;

io.on("connection", (socket) => {
    socket.on("join", async (gameId) => { // gameId or room Id
        try {
            let result = await collection.findOne({ "_id": gameId });
            if(!result) {
                await collection.insertOne({ "_id": gameId, messages: [] });
            }
            socket.join(gameId);
            socket.emit("joined", gameId);
            socket.activeRoom = gameId;
        } catch (e) {
            console.error(e);
        }
    });
    socket.on("message", (message) => {
        collection.updateOne({ "_id": socket.activeRoom }, {
            "$push": {
                "messages": message
            }
        });
        io.to(socket.activeRoom).emit("message", message);
    });
});

express.get("/chats", async (request, response) => {
    try {
        let result = await collection.findOne({ "_id": request.query.room });
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

http.listen(4000, async () => {
    try {
        await client.connect();
        collection = client.db("gameDatabase").collection("chats");
        console.log("Listening on port :%s...", http.address().port);
    } catch (e) {
        console.error(e);
    }
});