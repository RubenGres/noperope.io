const io = require('socket.io')(3000, {
    cors: {
      origin: '*',
    },
}); // Create a socket.io server on port 3000
  
const Game = require('./src/game.js');

let game;

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

    game.addPlayer(playerId)

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
        game.removePlayer(playerId)
    });
});

function start(GAMESTATE_BROADCAST_MS, GAMETICK_SPEED_MS) {
    game = new Game(10000, 10000);
    
    setInterval(() => {
        broadcastGameState();
    }, GAMESTATE_BROADCAST_MS);

        
    setInterval(() => {
        game.tick();
    }, GAMETICK_SPEED_MS);
}

module.exports = { start };
