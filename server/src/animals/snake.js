const Carnivorous = require("./carnivorous.js");
const vec2 = require('gl-matrix/vec2');

class BotSnake extends Carnivorous {
    
    constructor(startPosition) {
        super(5, startPosition, "#545477", "#9595CD", "#A8A8E6");
        this.targetFood = vec2.fromValues(0, 0, 0);
        this.controlType = "AI" // one of: keyboard, mouse, AI
    }

    kill(){
        super.kill();
        this.startDeathAnimation(() => {
            const index = animals.indexOf(this);
            if (index > -1) {
                animals.splice(index, 1);
            }
        });
    }

    avoidSelf() {
        let selfAvoidance = createVector(0, 0);
        let head = this.spine[0];
        let headDirection = p5.Vector.sub(this.spine[1], head).normalize(); // Direction in which the head is moving
    
        for (let i = 1; i < this.spine.length; i++) {
            let segment = this.spine[i];
            const avoidanceDirection = createVector(head.x - segment.x, head.y - segment.y);
            
            if (avoidanceDirection.mag() > 0 && avoidanceDirection.mag() < 70) {
                let segmentDirection = p5.Vector.sub(head, segment).normalize();
                
                // Check if the segment is roughly in front of the head
                if (p5.Vector.dot(headDirection, segmentDirection) > 0) {
                    selfAvoidance.add(avoidanceDirection.div(avoidanceDirection.mag()));
                }
            }
        }
    
        return selfAvoidance.normalize();
    }    

    chooseTargetFood() {
        let head = this.spine[0];

        if(!foods.includes(this.targetFood)) {
            let closest_food = foods.reduce((closest, food) => 
                dist(food, head) < dist(closest, head) ? food : closest, 
                foods[0]
                );

            this.targetFood = closest_food;
        }

        return this.targetFood;
    }

    desiredDirection() {
        let head = this.spine[0]
        
        let closest_food = this.chooseTargetFood();

        let nextDirection = createVector(0, 0);
        
        //let borderAvoidance = this.avoidBorderDirection(70)
        //nextDirection.add(borderAvoidance.mult(10));
        
        let foodDirection = createVector(closest_food.x - head.x, closest_food.y - head.y).normalize()
        foodDirection = foodDirection.mult(2);
        nextDirection.add(foodDirection);
        
        let selfAvoidance = this.avoidSelf().mult(10000);
        nextDirection.add(selfAvoidance);
        
        nextDirection.normalize();
        
        return nextDirection;
    }
}

module.exports = BotSnake
