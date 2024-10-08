const vec2 = require('gl-matrix/vec2');

class ProceduralAnimal {
    constructor(length, startPosition, mainColor, fillColor, spineColor) {
        this.segmentLength = 25;
        this.speed = 4;
        this.slitherFrequency = 0.1;
        this.slitherAmplitude = Math.PI / 10;
        this.head_hitbox_radius = 18;
        this.tail_width = 5;
        this.eyeSpacement = 8;
        this.eyeRadius = 10;
        this.headShape =  [5, 15, 5]
        this.maxSteerAngle = Math.PI / 45;
        this.isAlive = true;
        this.traceWeight = 5;
        this.hasCollider = true;

        this.start = startPosition;
        
        this.direction = vec2.fromValues(0, 0, 0); // direction of the head of the snake
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

        
        this.radiuses = [...this.headShape];
        for (let i = 0; i < this.length; i++) {
            this.radiuses.push(this.tail_width);
        }
        
        for (let i = 0; i < this.radiuses.length; i++) {
            
            let spine_segment = vec2.fromValues(this.start[0], this.start[1] + i * this.segmentLength)
            this.spine.push(spine_segment);
        }

        this.outline = Array(2*this.spine.length).fill(vec2.fromValues(0, 0))
    }

    updateSpine() {
        let head = this.spine[0];
        let desiredDirection = this.desiredDirection();

        // Calculate the angle between the two vectors
        const dotProduct = vec2.dot(this.direction, desiredDirection);
        const magnitudeA = vec2.length(this.direction);
        const magnitudeB = vec2.length(desiredDirection);

        const cosAngle = dotProduct / (magnitudeA * magnitudeB);
        const angleBetween = Math.acos(cosAngle);
        
        // Adjust the direction based on the maxSteerAngle
        if (Math.abs(angleBetween) > this.maxSteerAngle) {
            let steerAngle = this.maxSteerAngle * Math.sign(angleBetween);
            desiredDirection = this.direction.copy().rotate(steerAngle);
        }
    
        vec2.normalize(desiredDirection, desiredDirection);
        vec2.scale(desiredDirection, desiredDirection, this.speed);
        
        this.direction = desiredDirection;
        
        // Calculate the slither effect and move the head
        vec2.add(head, head, this.direction);
        
        // Follow with the body
        for (let i = 1; i < this.spine.length; i++) {
            let vector = vec2.fromValues(0, 0)

            vec2.sub(vector, this.spine[i - 1], this.spine[i])
            vec2.normalize(vector, vector)
            vec2.scale(vector, vector, this.segmentLength);

            vec2.sub(this.spine[i] , this.spine[i - 1], vector);

            if(i> this.headShape.length) {
                let slitherAngle = Math.sin(frameCounter * this.slitherFrequency + i);
                
                if(this.spine.length - i <= 1) {
                    continue
                }

                let magnitude = this.segmentLength / (20 * Math.log(this.spine.length - i));
                let slitherDirection = vector.setMag(magnitude).rotate(slitherAngle);
                this.spine[i].add(slitherDirection);
            }
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
        
            let leftPoint = vec2.fromValues(cos(angle + PI / 2) * radius + point.x, sin(angle + PI / 2) * radius + point.y);
            let rightPoint = vec2.fromValues(cos(angle - PI / 2) * radius + point.x, sin(angle - PI / 2) * radius + point.y);
        
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
      
        let leftPoint = vec2.fromValues(cos(angle + PI / 2) * this.eyeSpacement + eyeSegment.x, sin(angle + PI / 2) * this.eyeSpacement + eyeSegment.y);
        let rightPoint = vec2.fromValues(cos(angle - PI / 2) * this.eyeSpacement + eyeSegment.x, sin(angle - PI / 2) * this.eyeSpacement + eyeSegment.y);
        
        fill("#FFFFFF");
        strokeWeight(3);
        stroke(this.mainColor);
        ellipse(leftPoint.x, leftPoint.y, this.eyeRadius, this.eyeRadius);
        ellipse(rightPoint.x, rightPoint.y, this.eyeRadius, this.eyeRadius);
        fill("#000000");
        noStroke();
        
        let leftPupil = vec2.fromValues(cos(angle + 0.8*PI / 2) * this.eyeSpacement + eyeSegment.x, sin(angle + 0.8*PI / 2) * this.eyeSpacement + eyeSegment.y);
        let rightPupil = vec2.fromValues(cos(angle - 0.8*PI / 2) * this.eyeSpacement + eyeSegment.x, sin(angle - 0.8*PI / 2) * this.eyeSpacement + eyeSegment.y);
        
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
        pathLayer.strokeWeight(this.traceWeight);
        pathLayer.line(this.spine[1].x, this.spine[1].y, this.spine[3].x, this.spine[3].y);
    }

    startEatingAnimation() {
        let original_radiuses = [...this.radiuses];
        
        let growAmount = 2 * this.tail_width;
        let animationFrames = this.spine.length * 5;
        let frameCounter = 0;
        let spine_length = this.spine.length;
        
        const eating_animation = () => {
            if (!this.isAlive) {
                return;
            }
        
            this.radiuses = [...original_radiuses];
            if (frameCounter < animationFrames) {
                // offset by three to skip the head
                let n = Math.round((spine_length - 3) * frameCounter / animationFrames) - 1;
                if (n >= 0) {
                    this.radiuses[n + 3] = original_radiuses[n + 3] + growAmount;
                }
                frameCounter++;
                requestAnimationFrame(eating_animation);
            } else {
                // Animation complete, reset the radiuses and make the snake longer
                this.radiuses = [...original_radiuses];

                let tail = this.spine[this.spine.length - 1]
                
                this.spine.push(vec2.fromValues(tail.x, tail.y));
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
                    
                    simpleExplosionAnimation(segment.x, segment.y, 5, "#DF4F26");
                }
                
                frameCounter++;
                requestAnimationFrame(dying_animation);
            } else {
                if(callback) {
                    callback();
                }
            }
        }

        dying_animation();
    }

    checkFoodCollision(foods) {
        let head = this.spine[0];
        for (let i = foods.length - 1; i >= 0; i--) {
            let food = foods[i];
            if (vec2.distance(head, food) < this.head_hitbox_radius) {
                this.startEatingAnimation();
                
                foods.splice(i, 1);
                
                addFood(1);
                
                score++;
                
                // particles
                let head = this.spine[0];
                simpleExplosionAnimation(head.x, head.y, 5, "#F31C1C");
                return true;
            }
        }
    }

    checkBorders() {
        let head = this.spine[0];
        if (head.x < 0 || head.x > width || head.y < 0 || head.y > height) {
            this.kill();
        }
    }
    
    checkCollision(animals) {
        if(!this.hasCollider) {
            return
        }
        
        let head = this.spine[0];
        for(let other of animals) {
            if (other == this) {
                continue; // avoid self collision
            }
            
            
            for (let i = 0; i < other.spine.length; i++) {
                let other_vertebre = other.spine[i];
                if (vec2.distance(head, other_vertebre) < this.head_hitbox_radius) {
                    this.collisionEnter(other);
                    break;
                }
            }
        }
    }

    checkSelfIntersection() {
        let head = this.spine[0];
        for (let i = 3; i < this.spine.length; i++) {
            if (vec2.distance(head, this.spine[i]) < this.head_hitbox_radius) {
                this.kill();
                break;
            }
        }
    }

    desiredDirection() {
        return vec2.fromValues(0, 0);
    }

    avoidBorderDirection(borderMargin) {
        // Steer away from borders if getting too close
        let borderAvoidance = vec2.fromValues(0, 0);
        let head = this.spine[0];

        if (head.x < borderMargin) {
            borderAvoidance.x = 1;
        } else if (head.x > width - borderMargin) {
            borderAvoidance.x = -1;
        }
    
        if (head.y < borderMargin) {
            borderAvoidance.y = 1;
        } else if (head.y > height - borderMargin) {
            borderAvoidance.y = -1;
        }

        return borderAvoidance.normalize();
    }

    kill() {
        this.isAlive = false;
    }
    
    collisionEnter(other) {
        if(other instanceof Mouse) {
            other.kill();
            return;
        }
        
        if(this.isAlive) {
            this.kill();
        }
    }
    
    update(game) {
        if(!this.isAlive) {
            return;
        }
        
        this.checkFoodCollision(game.foods);
        this.checkSelfIntersection();
        this.checkCollision(game.animals);
        //this.checkBorders();
        this.updateSpine();
    }
    
    draw() {
        this.updateOutline();
        this.drawOutline();
        this.drawEyes();
        this.drawTrace();
    }
}

module.exports = ProceduralAnimal
