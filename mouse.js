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
        this.maxSteerAngle = 2*Math.PI;
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
        let snake_head = animals[0].spine[0];
        let mouse_head = this.spine[0];
        let threat_distance = dist(snake_head.x, snake_head.y, mouse_head.x, mouse_head.y);
        let movingTime = 1000;

        let nextDirection = createVector(0, 0);

        if (threat_distance < 150) {
            nextDirection.add(createVector(mouse_head.x - snake_head.x, mouse_head.y - snake_head.y));
        } else {
            if (!this.randomDirection || millis() - this.randomDirectionStartTime > movingTime) {
                // Generate a new random direction and record the start time
                this.randomDirection = p5.Vector.random2D().normalize();
                this.randomDirectionStartTime = millis();
            }
    
            nextDirection.add(this.randomDirection);
        }

        let borderAvoidance = this.avoidBorderDirection(70)
        nextDirection.add(borderAvoidance * 10);

        return nextDirection
    }
}