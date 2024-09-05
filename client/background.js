class Background {

    constructor(mainColor, otherColor) {
      this.mainColor = mainColor;
      this.otherColor = otherColor;
      this.backgroundLayer = createGraphics(windowWidth, windowHeight);
      this.rockCount = 10;
      this.noiseFrequency = 0.02;
    }
  
    draw() {
        this.backgroundLayer.loadPixels();
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let noiseValue = noise(x * this.noiseFrequency, y * this.noiseFrequency);
                let lowNoiseValue = noise(x * this.noiseFrequency * 0.5, y * this.noiseFrequency * 0.5);
                let col = lerpColor(this.mainColor, this.otherColor, noiseValue * lowNoiseValue);
                this.backgroundLayer.set(x, y, col);
            }
        }
        this.backgroundLayer.updatePixels();
    }
        
    
}
