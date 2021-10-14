const players = []
const addPlayer = ({ id, name, room, isComputer }) => {
    name = name.toLowerCase()
    room = room.toLowerCase()
    const existingPlayer = players.find(player => player.name === name && player.room === room)

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

module.exports = {addPlayer, getPlayersInRoom, removePlayer}