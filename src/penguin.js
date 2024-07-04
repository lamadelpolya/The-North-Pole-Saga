class Penguin {
  constructor(x, y, width, height, imgSrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = imgSrc;
    this.velocityY = 0;
  }

  draw(context) {
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  update() {
    this.velocityY += gravity;
    this.y = Math.max(this.y + this.velocityY, 0);

    if (this.y + this.height > boardHeight) {
      this.y = boardHeight - this.height;
      this.velocityY = 0;
    }
  }

  reset() {
    this.y = penguinY;
    this.velocityY = 0;
  }

  catchFish(fish) {
    const penguinRight = this.x + this.width;
    const penguinBottom = this.y + this.height;
    const fishRight = fish.x + fish.width;
    const fishBottom = fish.y + fish.height;

    if (
      penguinRight > fish.x &&
      this.x < fishRight &&
      penguinBottom > fish.y &&
      this.y < fishBottom
    ) {
      return true;
    }
    return false;
  }
}
