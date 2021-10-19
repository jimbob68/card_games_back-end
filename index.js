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
    socket.on("join-room", ({ name, room, isComputer, computerId }, callback) => {
        let player
        let error 
        let playerErrorObject = {player, error}
        
        if(isComputer) {
            playerErrorObject = addPlayer({id: computerId, name, room, isComputer})
        } else {
            playerErrorObject = addPlayer({id: socket.id, name, room, isComputer: false})
            if(error)return callback(error)
                socket.join(playerErrorObject.player.room)
        }
        
        
        io.to(playerErrorObject.player.room).emit("players-list", {playersList: getPlayersInRoom(playerErrorObject.player.room)})
        console.log("getPlayersInRoom:", getPlayersInRoom(playerErrorObject.player.room))
        console.log("player.room:", playerErrorObject.player.room)
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
            
            const humanPlayers = getPlayersInRoom(player.room).filter(player => {
                return player.isComputer === false 
            })
            if(humanPlayers.length === 0){
                getPlayersInRoom(player.room).forEach(player => {
                    removePlayer(player.id)
                })
            }
            io.to(player.room).emit("players-list", {playersList: getPlayersInRoom(player.room)})
        }
    })

    socket.on("get-next-player", ({activePlayer, room, firstPlayer}) => {
        console.log("ACTIVE PLAYER", activePlayer)
        io.to(room).emit("set-next-player", ({nextPlayer: activePlayer, firstPlayer}))
    })

    socket.on("update-card-pot", ({pot, room}) => {
        io.to(room).emit("set-card-pot", {pot})
    })

    socket.on("update-predictions", ({trickPrediction, nextPredictionPlayer, room}) => {
        console.log("trick prediction:", trickPrediction)
        console.log("prediction player:", nextPredictionPlayer)
        io.to(room).emit("set-prediction", {newPrediction: trickPrediction, nextPredictionPlayer})
    })
})



server.listen(PORT, () => console.log("server has started on " + PORT))

