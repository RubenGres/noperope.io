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
  