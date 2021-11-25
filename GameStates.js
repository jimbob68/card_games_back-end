const gameStates = []

const addGameStates = (gameState) => {
    const existingGameState = gameStates.find(eachGameState => eachGameState.name === gameState.name && eachGameState.room === gameState.room)
    if (existingGameState === undefined) {
        gameStates.push(gameState)
    }
}

const getGameStatesInRoom = (room) => {
    return gameStates.filter(gameState => gameState.room === room)
}

const getNewestGameStateForRoom = (room) => {
    let gameStates = getGameStatesInRoom(room)
    let indexOfbestGameState
    let trickPrediction = {}
    let maxCardsInPot = 0
    let currentHand = 0
    gameStates.forEach((gameState, index) => {
        if(gameState.predictionPlayer > 0 && Object.entries(gameState.trickPrediction).length > Object.entries(trickPrediction)){
            trickPrediction = gameState.trickPrediction
            indexOfbestGameState = index
        }
        else if(gameState.currentHand > currentHand) {
            currentHand = gameState.currentHand
            indexOfbestGameState = index
        }
        else if(gameState.currentHand >= currentHand && gameState.cardPot.length > maxCardsInPot){
            maxCardsInPot = gameState.cardPot.length
            currentHand = gameState.currentHand
            indexOfbestGameState = index
        }
    })
    return gameStates[indexOfbestGameState]
}

module.exports = {addGameStates, getGameStatesInRoom, getNewestGameStateForRoom}
