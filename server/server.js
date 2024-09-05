const io = require('socket.io')(3000);  // Create a socket.io server on port 3000
const game = require('./game.js');

// Broadcast the game state to all clients
function broadcastGameState() {
    io.emit('gameState', {
        players: game.players,
        animals: game.animals,
        foods: game.foods,
        score: game.score
    })
};


// Listen for client connections
io.on('connection', (socket) => {
    const playerId = socket.id;

    // Send the initial game state to the client
    socket.emit('initialize', {
        players: game.players,
        animals: game.animals,
        foods: game.foods,
        score: game.score,
    });

    // Listen for player input
    socket.on('move', (data) => {
        game.movePlayer(playerId, data.direction);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        game.removePlater(playerId)
    });
});

function start(GAMESTATE_BROADCAST_MS) {
    setInterval(() => {
        broadcastGameState();
    }, GAMESTATE_BROADCAST_MS);
}

module.exports = { start };
