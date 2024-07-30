class PlayerSnake extends ProceduralAnimal {
    constructor(startPosition) {
        super(5, startPosition, "#547754", "#95CD95", "#A8E6A8");  // Call the constructor of the parent class
        this.direction = createVector(0, -1)
        this.direction.normalize();
    }
    
    desiredDirection() {
        let head = this.spine[0];

        let desiredDirection = createVector(mouseX - head.x, mouseY - head.y);

        if(desiredDirection.mag() < 30) {
            return this.direction;
        }

        return desiredDirection;
    }
    
    kill(){
        super.kill();
        isGameOver = true;
        this.startDeathAnimation(() => {
            initializeGame();
        });
    }
}
