let length = 25;
let spine = [];
let outline = [];
let actual_radiuses = [];
let speed = 4;
let slitherFrequency = 0.1;
let slitherAmplitude = Math.PI / 10;
let last_mouse_x = 0;
let last_mouse_y = 0;
let direction;
let head_hitbox_radius = 24;
let food_spawn_margins = 50;
let score = 0;
let tail_size = 5;
let backgroundLayer, pathLayer;
let isGameOver = false;

let food;
const particles = [];

class Particle {

  constructor(x, y, speed, color) {
    this.x = x;
    this.y = y;
    this.vx = random(-speed, speed);
    this.vy = random(-speed, speed);
    this.radius = 10;
    this.lifespan = 15;
    this.timer = 0;
    this.color = color
  }

  finished() {
    return this.timer >= this.lifespan;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.timer += 1;
    this.alpha = (1 - (this.timer / this.lifespan)) * 255;
  }

  show() {
    noStroke();
    //stroke(255);
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.x, this.y, this.radius);
  }

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  backgroundLayer = createGraphics(windowWidth, windowHeight);
  pathLayer = createGraphics(windowWidth, windowHeight);
  
  drawBackground();
  initializeGame();
}


function initializeGame() {
  spine = [];
  outline = [];
  radiuses = [5, 15, 5, 5, 5, 5, 5];
  let start = createVector(width / 2, height / 2);
  for (let i = 0; i < radiuses.length; i++) {
    spine.push(createVector(start.x, start.y + i * length));
  }
  for (let i = 0; i < 2 * radiuses.length; i++) {
    outline.push(createVector(start.x + i * length, start.y));
  }
  replaceFood();
  direction = createVector(last_mouse_x, last_mouse_y);
  pathLayer = createGraphics(windowWidth, windowHeight);
  score = 0;
  isGameOver = false;
}

function updateSpine(x, y) {
  if (isGameOver) {
    return;
  }

  let head = spine[0];
  if (x != last_mouse_x && y != last_mouse_y) {
    last_mouse_x = mouseX;
    last_mouse_y = mouseY;
    direction = createVector(x - head.x, y - head.y);
  }

  // Calculate the slither effect
  let slitherAngle = sin(frameCount * slitherFrequency) * slitherAmplitude;
  let slitherDirection = direction.copy().rotate(slitherAngle);

  slitherDirection.setMag(speed);
  head.add(slitherDirection);

  for (let i = 0; i < radiuses.length - 1; i++) {
    let vector = p5.Vector.sub(spine[i], spine[i + 1]);
    vector.setMag(length);
    spine[i + 1] = p5.Vector.sub(spine[i], vector);
  }
}


function updateOutline() {
  if(radiuses.length < 3) {
    return;
  }
  
  actual_radiuses = [...radiuses];
  
  for (let i = 0; i < radiuses.length; i++) {
    let point = spine[i];
    let radius = actual_radiuses[i];

    let nextPoint = spine[(i + 1) % radiuses.length];
    let angle = atan2(nextPoint.y - point.y, nextPoint.x - point.x);

    let leftPoint = createVector(cos(angle + PI / 2) * radius + point.x, sin(angle + PI / 2) * radius + point.y);
    let rightPoint = createVector(cos(angle - PI / 2) * radius + point.x, sin(angle - PI / 2) * radius + point.y);

    if (i == radiuses.length - 1) {
      outline[i] = leftPoint;
      outline[2 * radiuses.length - i - 1] = rightPoint;
    } else {
      outline[i] = rightPoint;
      outline[2 * radiuses.length - i - 1] = leftPoint;
    }
  }
}

function drawEyes() {
  let eyeSegment = spine[1];
  let eyeSpacement = 8;
  let eyeRadius = 10;
  let nextPoint = spine[0];
  let angle = atan2(nextPoint.y - eyeSegment.y, nextPoint.x - eyeSegment.x);

  let leftPoint = createVector(cos(angle + PI / 2) * eyeSpacement + eyeSegment.x, sin(angle + PI / 2) * eyeSpacement + eyeSegment.y);
  let rightPoint = createVector(cos(angle - PI / 2) * eyeSpacement + eyeSegment.x, sin(angle - PI / 2) * eyeSpacement + eyeSegment.y);
  
  fill("#FFFFFF");
  strokeWeight(3);
  stroke("#547754");
  ellipse(leftPoint.x, leftPoint.y, eyeRadius, eyeRadius);
  ellipse(rightPoint.x, rightPoint.y, eyeRadius, eyeRadius);
  fill("#000000");
  noStroke();
  
  let leftPupil = createVector(cos(angle + 0.8*PI / 2) * eyeSpacement + eyeSegment.x, sin(angle + 0.8*PI / 2) * eyeSpacement + eyeSegment.y);
  let rightPupil = createVector(cos(angle - 0.8*PI / 2) * eyeSpacement + eyeSegment.x, sin(angle - 0.8*PI / 2) * eyeSpacement + eyeSegment.y);
  
  ellipse(leftPupil.x, leftPupil.y, 3, 3)
  ellipse(rightPupil.x, rightPupil.y, 3, 3)
  
}

function drawOutline() {  
  //shadow
  beginShape();
  noStroke();
  fill("#00000014");
  for (let i = 0; i < outline.length; i++) {
    curveVertex(outline[i].x, outline[i].y + 10);
  }
  endShape(CLOSE);
  
  beginShape();
  fill("#95CD95");
  stroke("#547754");
  strokeWeight(3);
  for (let i = 0; i < outline.length; i++) {
    curveVertex(outline[i].x, outline[i].y);
  }
  endShape(CLOSE);
  
  beginShape();
  stroke("#A8E6A8");
  strokeWeight(2);
  noFill();
  for (let i = 0; i < spine.length; i++) {
    curveVertex(spine[i].x, spine[i].y);
  }
  endShape();
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

let original_radiuses;
function startEatingAnimation() {
  original_radiuses = [...radiuses];
  let growAmount = 2 * tail_size;
  let animationFrames = radiuses.length * 5;
  let frameCounter = 0;

  function animate() {
    if(isGameOver) {
      return;
    }
    
    radiuses = [...original_radiuses];
    if (frameCounter < animationFrames) {
      let n = round((radiuses.length - 3) * frameCounter / animationFrames) - 1
      radiuses[n+3] = original_radiuses[n+3] + growAmount;
    
      frameCounter++;
      requestAnimationFrame(animate);
    } else {
      // Animation complete, reset the radiuses and make the snake longer
      radiuses = [...original_radiuses];
      radiuses.push(tail_size);
    }
  }

  animate();
}

function startDeathAnimation() {
  let animationFrames = radiuses.length * 5;
  let when_to_pop = Math.floor(animationFrames/(radiuses.length - 3))
  let frameCounter = 0;
  
  function animate() {
    if (frameCounter < animationFrames) {
      
      if(frameCounter % when_to_pop == 0) {
        let segment = spine[radiuses.length - 1]
        radiuses.pop()
        
        if(spine.length > 2) {
          spine.pop()  
        }
        
        for (let i = 0; i < 10; i++) {
          let p = new Particle(segment.x, segment.y, 5, "#DF4F26");
          particles.push(p);
        }
      }
      
      frameCounter++;
      requestAnimationFrame(animate);
    } else {
      initializeGame();
    }
  }

  if(!isGameOver) {
    isGameOver = true;
    animate(); 
  }
}

function replaceFood() {
  food = createVector(food_spawn_margins + random(width - 2 * food_spawn_margins), food_spawn_margins + random(height - 2 * food_spawn_margins));
}

function checkCollisions() {
  let head = spine[0];
  if (dist(head.x, head.y, food.x, food.y) < head_hitbox_radius) {
    startEatingAnimation();

    replaceFood();
    
    score++;
    
    //particles
    for (let i = 0; i < 10; i++) {
      let p = new Particle(head.x, head.y, 5, "#F31C1C");
      particles.push(p);
    }
  }
}

function checkBorders() {
  let head = spine[0];
  if (head.x < 0 || head.x > width || head.y < 0 || head.y > height) {
    startDeathAnimation();
  }
}


function checkSelfIntersection() {
  let head = spine[2];
  for (let i = 3; i < spine.length; i++) {
    if (dist(head.x, head.y, spine[i].x, spine[i].y) < head_hitbox_radius) {
      startDeathAnimation();
      break;
    }
  }
}

function drawScore() {
  fill(0);
  textSize(20);
  strokeWeight(1);
  textAlign(RIGHT, TOP);
  text("Score: " + score, width - 10, 10);
}

function drawBackground() {
  backgroundLayer.loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let noiseValue = noise(x * 0.02, y * 0.02);
      let col = lerpColor(color('#FFDD73'), color('#EECF6D'), noiseValue);
      backgroundLayer.set(x, y, col);
    }
  }
  backgroundLayer.updatePixels();
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      // remove this particle
      particles.splice(i, 1);
    }
  }
}

function drawTrace() {
  if(isGameOver) {
    return;
  }
  
  pathLayer.stroke("#FFE69610");
  pathLayer.strokeWeight(5);
  pathLayer.line(spine[1].x, spine[1].y, spine[3].x, spine[3].y);
}

function draw() {
  image(backgroundLayer, 0, 0);
  image(pathLayer, 0, 0);
  updateParticles();
  drawFood();
  updateSpine(mouseX, mouseY);
  updateOutline();
  drawTrace();
  drawOutline();
  drawEyes();
  checkCollisions();
  checkBorders();
  checkSelfIntersection();
  drawScore();
}
