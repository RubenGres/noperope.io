// call this script to start the game
const express = require('express');
const path = require('path');
const http = require('http');
const game_server = require('./server/server');  // Import the server module

const GAMESTATE_BROADCAST_MS = 10;

const app = express();
const server = http.createServer(app);

// static page for the client
app.use(express.static(path.join(__dirname, 'client')));
app.use('/shared', express.static(path.join(__dirname, 'shared')));

game_server.start(GAMESTATE_BROADCAST_MS);

// Specify the port
const PORT = process.env.PORT || 8080;  // Default to port 3000 if no environment variable is set
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
