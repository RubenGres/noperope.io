const Mouse = require('./animals/mouse'); 
const PlayerSnake = require("./player")
const BotSnake = require('./animals/snake')
const vec2 = require('gl-matrix/vec2');

const FOOD_SPAWN_MARGINS = 50;

class Game {
    static startTime;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.score = 0;
        
        // reset food, players and animals
        this.foods = [];
        this.animals = [];
        this.players = {};
        
        if (!Game.startTime) {
            Game.startTime = Date.now();
        }

        this.addFood(3);
        
        let mouse = new Mouse(vec2.fromValues(width * 0.25, this.height / 2));
        let botSnake = new BotSnake(vec2.fromValues(width * 0.75, this.height / 2));

        this.animals.push(mouse);
        this.animals.push(botSnake);
    }

    static millis() {
        return Date.now() - Game.startTime;
    }

    addPlayer(playerId) {
        let player_snake = new PlayerSnake(vec2.fromValues(width * 0.5, this.height / 2));
        this.players[playerId] = player_snake;
    }

    removePlayer(playerId) {
        delete this.players[playerId]
    }

    movePlayer(playerId, direction) {
        let player_snake = this.players[playerId];

        if (player_snake) {
            player_snake.setDirection(direction);
        }
    }

    addFood(n) {
        for(let i = 0; i < n; i++) {
            let food_x = FOOD_SPAWN_MARGINS + Math.random() * (this.width - 2 * FOOD_SPAWN_MARGINS)
            let food_y = FOOD_SPAWN_MARGINS + Math.random() * (this.height - 2 * FOOD_SPAWN_MARGINS)
            let food = vec2.fromValues(food_x, food_y, 0);
            this.foods.push(food);
        }
    }

    tick() {
        this.animals.forEach(animal => animal.update(this));
        Object.values(this.players).forEach(player => player.update(this));
    }
}

module.exports = Game
