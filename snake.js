class BotSnake extends ProceduralAnimal {
    constructor(startPosition) {
        super(5, startPosition, "#545477", "#9595CD", "#A8A8E6");
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

    desiredDirection() {
        let head = this.spine[0]
        let closest_food = foods.reduce((closest, food) => 
            dist(food, head) < dist(closest, head) ? food : closest, 
            foods[0]
        );

        let nextDirection = createVector(closest_food.x - head.x, closest_food.y - head.y);
        
        let borderAvoidance = this.avoidBorderDirection(70)
        nextDirection.add(borderAvoidance * 10);
    
        nextDirection.normalize();

        return nextDirection;
    }
}
