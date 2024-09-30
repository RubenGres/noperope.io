const ProceduralAnimal = require("./animals.js");
const Game = require("../game.js")
const vec2 = require('gl-matrix/vec2');

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
        this.maxSteerAngle = Math.PI / 2;
        this.traceWeight = 2;
        
        this.reset()
    }
    
    kill(){
        super.kill();
        const index = animals.indexOf(this);
        if (index > -1) {
            animals.splice(index, 1);
        }
        
        let head = this.spine[0]
        simpleExplosionAnimation(head.x, head.y, 5, "#FF0000");
    }
    
    desiredDirection() {
        let movingTime = 1000;

        let snake_head = vec2.fromValues(0, 0);
        let mouse_head = this.spine[0];

        let threat_distance = vec2.distance(snake_head, mouse_head);

        let nextDirection = vec2.fromValues(0, 0);
        
        if (threat_distance < 200) {
            let avoidSnakeDirection = createVector(mouse_head.x - snake_head.x, mouse_head.y - snake_head.y);
            avoidSnakeDirection.normalize();
            
            nextDirection.add(avoidSnakeDirection);
        } else {
            if (!this.randomDirection || 0 - this.randomDirectionStartTime > movingTime) {
                // Generate a new random direction and record the start time
                this.randomDirection = vec2.fromValues(Math.random(), Math.random())
                vec2.normalize(this.randomDirection, this.randomDirection);
                this.randomDirectionStartTime = 0;
            }
    
            vec2.add(nextDirection, nextDirection, this.randomDirection);
        }

        //let borderAvoidance = this.avoidBorderDirection(50);
        //nextDirection.add(borderAvoidance);  

        vec2.normalize(nextDirection, nextDirection)
        
        return nextDirection
    }
}

module.exports = Mouse
