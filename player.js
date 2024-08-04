class PlayerSnake extends ProceduralAnimal {
    constructor(startPosition, controlType) {
        super(2, startPosition, "#547754", "#95CD95", "#A8E6A8");  // Call the constructor of the parent class
        this.direction = createVector(0, -1)
        this.direction.normalize();
        this.controlType = "KEYBOARD";
    }
    
    mousePlayerControl() {
        let head = this.spine[0];

        let desiredDirection = createVector(mouseX - head.x, mouseY - head.y);

        if(desiredDirection.mag() < 30) {
            return this.direction;
        }

        return desiredDirection;
    }

    keyboardPlayerControl() {
        if(!keyIsPressed) {
            return this.direction
        }

        switch(key) {
            case "ArrowLeft":
                return this.direction.rotate(-this.maxSteerAngle);
            
            case "ArrowRight":
                return this.direction.rotate(this.maxSteerAngle);
            
            default:
                return this.direction;
        }
    }

    desiredDirection() {
        switch(this.controlType) {
            case "MOUSE":
                return this.mousePlayerControl();

            default:
                return this.keyboardPlayerControl();
        }
        
    }
    
    kill(){
        super.kill();
        isGameOver = true;
        this.startDeathAnimation(() => {
            initializeGame();
        });
    }
}
