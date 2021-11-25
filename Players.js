const players = []
const addPlayer = ({ id, name, room, isComputer }) => {
    name = name.toLowerCase()
    room = room.toLowerCase()
    const existingPlayer = players.find(player => player.name === name && player.room === room)
    const existingPlayerId = players.find(player => player.id === id && player.room === room)
    if(existingPlayerId){
        return {error: "Id already exists!"}
    }
    if(existingPlayer){
        return {error: "User name is taken"}
    }
    const player = {id, name, room, isComputer}
    players.push(player)

    return {player}
}

const removePlayer = (id) => {
    const index = players.findIndex(player => player.id === id)
    if(index !== -1){
        return players.splice(index, 1)[0]
    }
}

const getPlayersInRoom = (room) => {
    return players.filter(player => player.room === room)
}

const getAllplayers = () => {
    return players
}
 
module.exports = {addPlayer, getPlayersInRoom, removePlayer, getAllplayers}