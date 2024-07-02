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

class Iceberg {
  constructor(x, y, width, height, imgSrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = imgSrc;
    this.passed = false;
  }

  draw(context) {
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += velocityX;
  }
}

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

  respawn() {
    this.visible = true;
    this.x = boardWidth;
    this.y = Math.random() * (boardHeight - this.height);
  }
}

class Game {
  constructor() {
    this.board = document.getElementById("board");
    this.board.height = boardHeight;
    this.board.width = boardWidth;
    this.context = this.board.getContext("2d");
    this.penguin = new Penguin(
      penguinX,
      penguinY,
      penguinWidth,
      penguinHeight,
      "./images/penguin.png"
    );
    this.icebergArray = [];
    this.fishArray = [];
    this.gameOver = false;
    this.score = 0;

    this.bottomIcebergImgSrc = "./images/iceberg.png";
    this.fishImgSrc = "./images/fish.png";

    this.init();
  }

  init() {
    this.penguin.img.onload = () => {
      this.penguin.draw(this.context);
    };

    this.setupEventListeners();
    this.startGameLoop();
    this.placeIcebergs();
    this.spawnFish();
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => this.movePenguin(e));
  }

  startGameLoop() {
    requestAnimationFrame(() => this.update());
    setInterval(() => this.placeIcebergs(), 3000);
    setInterval(() => this.spawnFish(), 7000);
  }

  update() {
    if (this.gameOver) return;

    this.context.clearRect(0, 0, this.board.width, this.board.height);

    // Update and draw penguin
    this.penguin.update();
    this.penguin.draw(this.context);

    if (this.penguin.y > this.board.height) {
      this.gameOver = true;
    }

    // Update and draw icebergs
    this.icebergArray.forEach((iceberg) => {
      iceberg.update();
      iceberg.draw(this.context);

      if (!iceberg.passed && this.penguin.x > iceberg.x + iceberg.width) {
        this.score += 0.5;
        iceberg.passed = true;
      }

      if (this.detectCollision(this.penguin, iceberg)) {
        this.gameOver = true;
      }
    });

    // Update and draw fish
    this.fishArray.forEach((fish) => {
      fish.update();
      fish.draw(this.context);

      if (this.penguin.catchFish(fish)) {
        this.score += 10; // Score increases when penguin catches fish
        fish.visible = false;
      }
    });

    // Clear icebergs that are out of the board
    this.icebergArray = this.icebergArray.filter(
      (iceberg) => iceberg.x >= -icebergWidth
    );

    // Draw score
    this.context.fillStyle = "white";
    this.context.font = "45px sans-serif";
    this.context.fillText(this.score, 5, 45);

    if (this.gameOver) {
      this.context.fillText("GAME OVER", 5, 90);
    } else {
      requestAnimationFrame(() => this.update());
    }
  }

  placeIcebergs() {
    if (this.gameOver) return;

    let randomIcebergY =
      icebergY - icebergHeight / 4 - Math.random() * (icebergHeight / 2);
    let openingSpace = board.height / 4;

    let bottomIceberg = new Iceberg(
      icebergX,
      randomIcebergY + icebergHeight + openingSpace,
      icebergWidth,
      icebergHeight,
      this.bottomIcebergImgSrc
    );
    this.icebergArray.push(bottomIceberg);
  }

  spawnFish() {
    if (this.gameOver) return;

    let fish = new Fish(
      boardWidth,
      Math.random() * (boardHeight - fishHeight),
      fishWidth,
      fishHeight,
      this.fishImgSrc
    );
    this.fishArray.push(fish);
  }

  movePenguin(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
      this.penguin.velocityY = -6;

      if (this.gameOver) {
        this.penguin.reset();
        this.icebergArray = [];
        this.fishArray = [];
        this.score = 0;
        this.gameOver = false;
        this.spawnFish();
      }
    }
  }

  detectCollision(a, b) {
    const aRight = a.x + a.width;
    const aBottom = a.y + a.height;
    const bRight = b.x + b.width;
    const bBottom = b.y + b.height;

    return aRight > b.x && a.x < bRight && aBottom > b.y && a.y < bBottom;
  }
}

let boardWidth = 700;
let boardHeight = 400;
let penguinWidth = 150;
let penguinHeight = 100;
let penguinX = boardWidth / 8;
let penguinY = boardHeight / 2;
let icebergWidth = 200;
let icebergHeight = 100;
let icebergX = boardWidth;
let icebergY = 0;
let fishWidth = 50;
let fishHeight = 50;
let velocityX = -2;
let gravity = 0.2;

window.onload = function () {
  new Game();
};
