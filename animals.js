class ProceduralAnimal {

    constructor(length, startPosition, mainColor, fillColor, spineColor) {
        this.segmentLength = 25;
        this.speed = 4;
        this.slitherFrequency = 0.1;
        this.slitherAmplitude = Math.PI / 10;
        this.head_hitbox_radius = 24;
        this.tail_width = 5;
        this.eyeSpacement = 8;
        this.eyeRadius = 10;
        this.headShape =  [5, 15, 5, 4]

        this.start = startPosition;
        
        this.direction = createVector(0, 0); // direction of the head of the snake
        this.spine = [];
        this.outline = [];
        this.radiuses = [];
        this.last_mouse_x = 0;
        this.last_mouse_y = 0;
        this.mainColor = mainColor;
        this.fillColor = fillColor;
        this.spineColor = spineColor;
        this.length = length;

        this.reset();
    }


    reset() {
        this.spine = [];
        this.outline = [];

        this.radiuses = [...this.headShape];
        for (let i = 0; i < this.length; i++) {
            this.radiuses.push(this.tail_width);
        }

        for (let i = 0; i < this.radiuses.length; i++) {
            this.spine.push(createVector(this.start.x, this.start.y + i * this.segmentLength));
        }

        for (let i = 0; i < 2 * this.spine.length; i++) {
            this.outline.push(createVector(this.start.x + i * length, this.start.y));
        }
    }

    updateSpine() {
        let head = this.spine[0];

        // Calculate the slither effect
        let slitherAngle = sin(frameCount * this.slitherFrequency) * this.slitherAmplitude;
        let slitherDirection = this.direction.copy().rotate(slitherAngle);
        
        slitherDirection.setMag(this.speed);
        head.add(slitherDirection);
        
        for (let i = 0; i < this.spine.length - 1; i++) {
            let vector = p5.Vector.sub(this.spine[i], this.spine[i + 1]);
            vector.setMag(this.segmentLength);
            this.spine[i + 1] = p5.Vector.sub(this.spine[i], vector);
        }
    }
      
    updateOutline() {
        if(this.spine.length < 3) {
            return;
        }
        
        if(this.radiuses.length != this.spine.length) {
            let n_missing = this.spine.length - this.radiuses.length;
            for(let i = 0; i < n_missing; i++){
                this.radiuses.push(random(this.tail_width - 1, this.tail_width + 1));
            }
        }
        
        for (let i = 0; i < this.spine.length; i++) {
            let point = this.spine[i];
            let nextPoint = this.spine[(i + 1) % this.spine.length];
            
            let radius = this.radiuses[i];
            let angle = atan2(nextPoint.y - point.y, nextPoint.x - point.x);
        
            let leftPoint = createVector(cos(angle + PI / 2) * radius + point.x, sin(angle + PI / 2) * radius + point.y);
            let rightPoint = createVector(cos(angle - PI / 2) * radius + point.x, sin(angle - PI / 2) * radius + point.y);
        
            if (i == this.spine.length - 1) {
                this.outline[i] = leftPoint;
                this.outline[2 * this.spine.length - i - 1] = rightPoint;
            } else {
                this.outline[i] = rightPoint;
                this.outline[2 * this.spine.length - i - 1] = leftPoint;
            }
        }
    }


    drawEyes() {
        let eyeSegment = this.spine[1];
        let nextPoint = this.spine[0];
        let angle = atan2(nextPoint.y - eyeSegment.y, nextPoint.x - eyeSegment.x);
      
        let leftPoint = createVector(cos(angle + PI / 2) * this.eyeSpacement + eyeSegment.x, sin(angle + PI / 2) * this.eyeSpacement + eyeSegment.y);
        let rightPoint = createVector(cos(angle - PI / 2) * this.eyeSpacement + eyeSegment.x, sin(angle - PI / 2) * this.eyeSpacement + eyeSegment.y);
        
        fill("#FFFFFF");
        strokeWeight(3);
        stroke(this.mainColor);
        ellipse(leftPoint.x, leftPoint.y, this.eyeRadius, this.eyeRadius);
        ellipse(rightPoint.x, rightPoint.y, this.eyeRadius, this.eyeRadius);
        fill("#000000");
        noStroke();
        
        let leftPupil = createVector(cos(angle + 0.8*PI / 2) * this.eyeSpacement + eyeSegment.x, sin(angle + 0.8*PI / 2) * this.eyeSpacement + eyeSegment.y);
        let rightPupil = createVector(cos(angle - 0.8*PI / 2) * this.eyeSpacement + eyeSegment.x, sin(angle - 0.8*PI / 2) * this.eyeSpacement + eyeSegment.y);
        
        ellipse(leftPupil.x, leftPupil.y, 3, 3)
        ellipse(rightPupil.x, rightPupil.y, 3, 3)  
    }


    drawOutline() {  
        //shadow
        beginShape();
        noStroke();
        fill("#00000014");
        for (let i = 0; i < this.outline.length; i++) {
          curveVertex(this.outline[i].x, this.outline[i].y + 10);
        }
        endShape(CLOSE);
        
        // body
        beginShape();
        fill(this.fillColor);
        stroke(this.mainColor);
        strokeWeight(3);
        for (let i = 0; i < this.outline.length; i++) {
          curveVertex(this.outline[i].x, this.outline[i].y);
        }
        endShape(CLOSE);
        
        // spine
        beginShape();
        stroke(this.spineColor);
        strokeWeight(2);
        noFill();
        for (let i = 0; i < this.spine.length; i++) {
          curveVertex(this.spine[i].x, this.spine[i].y);
        }
        endShape();
    }


    drawTrace() {
        if(this.spine.length < 4) {
            return;
        }
        
        pathLayer.stroke("#FFE69610");
        pathLayer.strokeWeight(5);
        pathLayer.line(this.spine[1].x, this.spine[1].y, this.spine[3].x, this.spine[3].y);
    }
  

    startEatingAnimation() {
        let original_radiuses = [...this.radiuses];
        
        let growAmount = 2 * this.tail_width;
        let animationFrames = this.spine.length * 5;
        let frameCounter = 0;
        
        const eating_animation = () => {
            if (isGameOver) {
                return;
            }
        
            this.radiuses = [...original_radiuses];
            if (frameCounter < animationFrames) {
                // offset by three to skip the head
                let n = Math.round((this.spine.length - 3) * frameCounter / animationFrames) - 1;
                if (n >= 0) {
                    this.radiuses[n + 3] = original_radiuses[n + 3] + growAmount;
                }
                frameCounter++;
                requestAnimationFrame(eating_animation);
            } else {
                // Animation complete, reset the radiuses and make the snake longer
                this.radiuses = [...original_radiuses];
                let tail = this.spine[this.spine.length - 1]
                this.spine.push(createVector(tail.x, tail.y + this.segmentLength));
            }
        }
        
        eating_animation();
    }
      

    startDeathAnimation(callback) {
        let animationFrames = this.spine.length * 5;
        let when_to_pop = Math.floor(animationFrames/(this.spine.length - 3))
        let frameCounter = 0;

        const dying_animation = () => {
            if (frameCounter < animationFrames) {   
                if(frameCounter % when_to_pop == 0) {
                    let segment = this.spine[this.spine.length - 1]
                    this.radiuses.pop()
                    
                    if(this.spine.length > 2) {
                        this.spine.pop()  
                    }
                    
                    for (let i = 0; i < 10; i++) {
                        let p = new Particle(segment.x, segment.y, 5, "#DF4F26");
                        particles.push(p);
                    }
                }
                
                frameCounter++;
                requestAnimationFrame(dying_animation);
            } else {
                callback();
            }
        }

        dying_animation();
    }

    checkFoodCollision() {
        let head = this.spine[0];
        for (let i = foods.length - 1; i >= 0; i--) {
            let food = foods[i];
            if (dist(head.x, head.y, food.x, food.y) < this.head_hitbox_radius) {
                this.startEatingAnimation();
    
                foods.splice(i, 1);
                
                addFood(1);
                
                score++;
                
                // particles
                for (let i = 0; i < 10; i++) {
                    let p = new Particle(head.x, head.y, 5, "#F31C1C");
                    particles.push(p);
                }
            }
        }
    }

    checkBorders() {
        let head = this.spine[0];
        if (head.x < 0 || head.x > width || head.y < 0 || head.y > height) {
            this.kill();
        }
    }


    checkSelfIntersection() {
        let head = this.spine[2];
        for (let i = 3; i < this.spine.length; i++) {
            if (dist(head.x, head.y, this.spine[i].x, this.spine[i].y) < 0.75 * this.head_hitbox_radius) {
                this.kill();
                break;
            }
        }
    }

  
    update() {
        this.updateOutline();
        this.checkFoodCollision();
        this.checkSelfIntersection();
        this.checkBorders();
        
        if(!isGameOver) {
            this.updateSpine();
        }
    }


    draw() {
        this.drawOutline();
        this.drawEyes();
        this.drawTrace();
    }
}


class Snake extends ProceduralAnimal {
    constructor(startPosition) {
        super(5, startPosition, "#547754", "#95CD95", "#A8E6A8");  // Call the constructor of the parent class
        this.direction = createVector(0, -1)
        this.direction.normalize();
    }
    
    mouseControls() {
        let head = this.spine[0];
        let maxSteerAngle = Math.PI / 35;  // Maximum steer angle in radians (for example, 22.5 degrees)

        // Calculate the desired direction
        let desiredDirection = createVector(mouseX - head.x, mouseY - head.y);

        if(desiredDirection.mag() < 30) {
            console.log("too cloue")
            return;
        }

        desiredDirection.normalize();

        // Calculate the current direction
        let currentDirection = this.direction.copy();
        currentDirection.normalize();

        // Calculate the angle between the current direction and the desired direction
        let angleBetween = p5.Vector.angleBetween(currentDirection, desiredDirection);

        // If the angle between is greater than the max steer angle, adjust the desired direction
        if (abs(angleBetween) > maxSteerAngle) {
            let steerAngle = (angleBetween > 0) ? maxSteerAngle : -maxSteerAngle;
            currentDirection.rotate(steerAngle);
        }

        // Set the new direction
        this.direction = currentDirection.copy();
    }
    
    kill(){
        if(isGameOver) {
            return
        }

        isGameOver = true;
        this.startDeathAnimation(() => {
            initializeGame();
        });
    }

    update() {
        super.update();

        this.mouseControls();
    }
}


class Mouse extends ProceduralAnimal {
    constructor(startPosition) {
        super(2, startPosition, "#000000", "#777777", "#777777");
        this.segmentLength = 10;
        this.speed = 2;
        this.slitherFrequency = 0.5;
        this.slitherAmplitude = Math.PI / 10;
        this.head_hitbox_radius = 0;
        this.tail_width = 1;
        this.eyeSpacement = 5;
        this.eyeRadius = 10;
        this.headShape =  [3, 7, 5, 0.5]

        this.reset()
    }

    mouseLogic() {
        let snake_head = snakes[0].spine[0];
        let mouse_head = this.spine[0];
        let threat_distance = dist(snake_head.x, snake_head.y, mouse_head.x, mouse_head.y);
        let movingTime = 1000;

        if (threat_distance < 150) {
            this.direction = createVector(mouse_head.x - snake_head.x, mouse_head.y - snake_head.y);
        } else {
            if (!this.randomDirection || millis() - this.randomDirectionStartTime > movingTime) {
                // Generate a new random direction and record the start time
                this.randomDirection = p5.Vector.random2D();
                this.randomDirectionStartTime = millis();
            }
    
            this.direction = this.randomDirection;
        }
    
        // Steer away from borders if getting too close
        let borderMargin = 70;
        let borderAvoidance = createVector(0, 0);
    
        if (mouse_head.x < borderMargin) {
            borderAvoidance.x = 1;
        } else if (mouse_head.x > width - borderMargin) {
            borderAvoidance.x = -1;
        }
    
        if (mouse_head.y < borderMargin) {
            borderAvoidance.y = 1;
        } else if (mouse_head.y > height - borderMargin) {
            borderAvoidance.y = -1;
        }
    
        this.direction.add(borderAvoidance);
    
        this.direction.normalize();
    }
    

    update() {
        super.update();

        this.mouseLogic();
    }
}
