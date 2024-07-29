let food_spawn_margins = 50;
let score = 0;
let pathLayer;
let isGameOver = false;
let background;

let food;
let player_snake;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pathLayer = createGraphics(windowWidth, windowHeight);
  background = new Background(color('#FFDD73'), color('#EECF6D'))
  background.draw();
  initializeGame();
}


function initializeGame() {
  replaceFood();
  player_snake = new Snake(3, "#547754", "#95CD95", "#A8E6A8");
  pathLayer = createGraphics(windowWidth, windowHeight);
  score = 0;
  isGameOver = false;
}


function drawFood() {
  // shadow
  noStroke();
  fill("#00000014");
  ellipse(food.x, food.y + 10, 20, 20);
  
  fill("#FF0000");
  strokeWeight(3);
  stroke("#FF6161");
  ellipse(food.x, food.y, 20, 20);
}


function replaceFood() {
  food = createVector(food_spawn_margins + random(width - 2 * food_spawn_margins), food_spawn_margins + random(height - 2 * food_spawn_margins));
}


function drawScore() {
  fill(0);
  textSize(20);
  strokeWeight(1);
  textAlign(RIGHT, TOP);
  text("Score: " + score, width - 10, 10);
}


function draw() {
  image(background.backgroundLayer, 0, 0);
  image(pathLayer, 0, 0);
  updateParticles();
  drawFood();
  
  player_snake.update(mouseX, mouseY);
  player_snake.draw();
  
  drawScore();
}
