const Carnivorous = require("./animals/carnivorous.js");
const vec3 = require('vec3');

class PlayerSnake extends Carnivorous {
    constructor(startPosition, controlType) {
        super(2, startPosition, "#547754", "#95CD95", "#A8E6A8");  // Call the constructor of the parent class
        this.direction = vec3.fromValues(0, -1)
        this.direction.normalize();
        this.controlType = "keyboard";
    }
    
    mousePlayerControl() {
        let head = this.spine[0];

        let desiredDirection = vec3.fromValues(mouseX - head.x, mouseY - head.y);

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
            case "keyboard":
                return this.keyboardPlayerControl();
                
            default:
                return this.mousePlayerControl();
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

module.exports = PlayerSnake
