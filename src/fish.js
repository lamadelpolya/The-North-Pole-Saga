class Fish {
  constructor(x, y, width, height, imgSrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = imgSrc;
    this.visible = false;
  }

  draw(context) {
    if (this.visible) {
      context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  update() {
    this.x += velocityX;
  }
}
