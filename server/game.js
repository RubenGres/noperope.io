// TODO import all classes from ../shared 

let GAMETICK_SPEED_MS = 10;

let foods = [];
let animals = [];
let players = {};

let food_spawn_margins = 50;
let score = 0;

function initializeGame() {
    // reset food, players and animals
    foods = [];
    animals = [];
    players = {};

    addFood(3);
    
    let mouse = new Mouse(createVector(width * 0.25, height / 2));
    let botSnake = new BotSnake(createVector(width * 0.75, height / 2));

    animals.push(mouse);
    animals.push(botSnake);
}

function addPlayer(playerId) {
    let player_snake = new PlayerSnake(createVector(width * 0.5, height / 2));
    players[playerId] = player_snake;
}

function removePlayer(playerId) {
    delete players[playerId]
}

function movePlayer(playerId, direction) {
    let player_snake = players[playerId];

    if (player_snake) {
        player_snake.setDirection(direction);
    }
}

function addFood(n) {
    for(let i = 0; i < n; i++) {
        let food = createVector(food_spawn_margins + random(width - 2 * food_spawn_margins), food_spawn_margins + random(height - 2 * food_spawn_margins));
        foods.push(food);
    }
}

function tick() {
    animals.forEach(animal => animal.update());
    Object.values(players).forEach(player => player.update());
}

setInterval(() => {
    tick();
}, GAMETICK_SPEED_MS);

module.exports = { movePlayer, removePlayer, animals, foods, score, players}
