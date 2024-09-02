let food_spawn_margins = 50;
let score = 0;
let pathLayer;
let isGameOver = false;
let background;

let foods = [];
let animals = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  pathLayer = createGraphics(windowWidth, windowHeight);
  background = new Background(color('#FFDD73'), color('#dbbb56'))
  background.draw();
  initializeGame();
}


function initializeGame() {
  foods = [];
  addFood(3);

  animals = [];
  //let player_snake = new PlayerSnake(createVector(width * 0.5, height / 2));
  //let mouse = new Mouse(createVector(width * 0.25, height / 2));
  let botSnake = new BotSnake(createVector(width * 0.75, height / 2));
  
  //animals.push(player_snake);
  //animals.push(mouse);
  animals.push(botSnake);

  pathLayer = createGraphics(windowWidth, windowHeight);
  score = 0;
  isGameOver = false;
}


function drawFood() {
  for(food of foods) {
    // shadow
    noStroke();
    fill("#00000014");
    ellipse(food.x, food.y + 10, 20, 20);
    
    fill("#FF0000");  
    strokeWeight(3);
    stroke("#FF6161");
    ellipse(food.x, food.y, 20, 20);
  }
}


function addFood(n) {
  for(let i = 0; i < n; i++) {
    let food = createVector(food_spawn_margins + random(width - 2 * food_spawn_margins), food_spawn_margins + random(height - 2 * food_spawn_margins));
    foods.push(food);
  }
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
  
  for(animal of animals) {
    animal.update();
    animal.draw();
  }
  
  drawScore();
}
