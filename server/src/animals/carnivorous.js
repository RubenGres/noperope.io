ProceduralAnimal = require("./animals.js");

class Carnivorous extends ProceduralAnimal {
    
    constructor(length, startPosition, mainColor, fillColor, spineColor) {
        super(length, startPosition, mainColor, fillColor, spineColor);
    }
}

module.exports = Carnivorous