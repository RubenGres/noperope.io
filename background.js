class Background {

    constructor(mainColor, otherColor) {
      this.mainColor = mainColor;
      this.otherColor = otherColor;
      this.backgroundLayer = createGraphics(windowWidth, windowHeight);
    }
  
    draw() {
        this.backgroundLayer.loadPixels();
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let noiseValue = noise(x * 0.02, y * 0.02);
                let col = lerpColor(this.mainColor, this.otherColor, noiseValue);
                this.backgroundLayer.set(x, y, col);
            }
        }
        this.backgroundLayer.updatePixels();
    }
}
