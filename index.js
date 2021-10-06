const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const http = require('http')
const PORT = process.env.PORT || 5000
const router = require("./router")
const {addPlayer, getPlayersInRoom, removePlayer} = require("./Players.js")

const app = express()
const server = http.createServer(app)
const io = socketio(server)
app.use(router)
app.use(cors())

io.on("connection", (socket) => {
    console.log("new connection:", socket.id)
    socket.on("join-room", ({ name, room }, callback) => {
        const {player, error} = addPlayer({id: socket.id, name, room})
        if(error)return callback(error)
        socket.join(player.room)
        io.to(player.room).emit("players-list", {playersList: getPlayersInRoom(player.room)})
        console.log("getPlayersInRoom:", getPlayersInRoom(player.room))
        console.log("player.room:", player.room)
        callback([player])
    })

    socket.on("player-hand", ({playerId, hand}) =>{
        io.to(playerId).emit("hand", {hand})
    })

    socket.on("start-game", ({room}) => {
        console.log("in start game room = ", {room})
        io.to(room).emit("handle-start-game", ({hello: "hello"}))
    })

    socket.on("disconnect", () => {
        console.log("Player has left.")
        const player = removePlayer(socket.id)
        if(player){
            io.to(player.room).emit("players-list", {playersList: getPlayersInRoom(player.room)})
        }
    })

    socket.on("get-next-player", ({activePlayer, room}) => {
        io.to(room).emit("set-next-player", ({nextPlayer: activePlayer}))
    })

    socket.on("update-card-pot", ({pot, room}) => {
        io.to(room).emit("set-card-pot", {pot})
    })

    socket.on("update-predictions", ({trickPrediction, predictionPlayer, room}) => {
        console.log("trick prediction:", trickPrediction)
        console.log("prediction player:", predictionPlayer)
        io.to(room).emit("set-prediction", {newPrediction: trickPrediction, nextPlayer: predictionPlayer + 1})
    })
})



server.listen(PORT, () => console.log("server has started on " + PORT))

