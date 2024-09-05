let socket = io('http://localhost:3000');  // Connect to the server

let animals = [];
let foods = [];
let score = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Listen for the initial game state
    socket.on('initialize', (data) => {
        animals = data.animals;
        foods = data.foods;
        score = data.score;
    });

    // Listen for game state updates
    socket.on('gameState', (data) => {
        animals = data.animals;
        foods = data.foods;
        score = data.score;
    });
}

// Send player input to the server
function keyPressed() {
    let direction;
    if (keyCode === UP_ARROW) direction = createVector(0, -1);
    else if (keyCode === DOWN_ARROW) direction = createVector(0, 1);
    else if (keyCode === LEFT_ARROW) direction = createVector(-1, 0);
    else if (keyCode === RIGHT_ARROW) direction = createVector(1, 0);

    socket.emit('playerInput', { direction });
}

function draw() {
    background(255);

    // Render foods
    drawFood();

    // Render animals
    for (let animal of animals) {
        animal.draw();
    }

    drawScore();
}

function drawFood() {
    for (let food of foods) {
        noStroke();
        fill("#FF0000");
        ellipse(food.x, food.y, 20, 20);
    }
}

function drawScore() {
    fill(0);
    textSize(20);
    textAlign(RIGHT, TOP);
    text("Score: " + score, width - 10, 10);
}
