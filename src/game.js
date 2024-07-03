class Entity {
  constructor(x, y, width, height, imgSrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = imgSrc;
  }

  draw(context) {
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class Penguin extends Entity {
  constructor(x, y, width, height, imgSrc) {
    super(x, y, width, height, imgSrc);
    this.velocityY = 0;
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
    return (
      penguinRight > fish.x &&
      this.x < fishRight &&
      penguinBottom > fish.y &&
      this.y < fishBottom
    );
  }
}

class Iceberg extends Entity {
  update() {
    this.x += velocityX;
  }
}

class Fish extends Entity {
  constructor(x, y, width, height, imgSrc) {
    super(x, y, width, height, imgSrc);
    this.visible = false;
  }

  draw(context) {
    if (this.visible) {
      super.draw(context);
    }
  }

  update() {
    this.x += velocityX;
  }
}

class Game {
  constructor() {
    this.board = document.getElementById("board");
    this.startPage = document.getElementById("start-page");
    this.startButton = document.getElementById("start-button");
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

    this.init();
  }

  init() {
    this.startButton.addEventListener("click", () => this.startGame());
    this.drawStartPage();
  }

  drawStartPage() {
    this.board.style.display = "none";
    this.startPage.style.display = "flex";
  }

  startGame() {
    this.startPage.style.display = "none";
    this.board.style.display = "block";
    this.loadImages(() => {
      this.setupEventListeners();
      this.startGameLoop();
    });
  }

  loadImages(callback) {
    const images = [this.penguin.img, new Image(), new Image()];
    images[1].src = "./images/iceberg1.png";
    images[2].src = "./images/fish.png";
    let imagesLoaded = 0;

    images.forEach((img) => {
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
          callback();
        }
      };
    });
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => this.movePenguin(e));
  }

  startGameLoop() {
    requestAnimationFrame(() => this.update());
    setInterval(() => this.spawnFish(), 7000);
  }

  update() {
    if (this.gameOver) return;

    this.context.clearRect(0, 0, this.board.width, this.board.height);
    this.penguin.update();
    this.penguin.draw(this.context);

    if (this.penguin.y + this.penguin.height >= this.board.height) {
      this.gameOver = true;
    }

    this.updateEntities(this.icebergArray);
    this.updateEntities(this.fishArray, true);

    this.drawScore();

    if (this.gameOver) {
      this.context.fillText("GAME OVER", 5, 90);
    } else {
      requestAnimationFrame(() => this.update());
    }
  }

  updateEntities(array, checkCollision = false) {
    array.forEach((entity) => {
      entity.update();
      entity.draw(this.context);
      if (checkCollision && this.penguin.catchFish(entity)) {
        this.score += 10;
        entity.visible = false;
      }
    });
    array = array.filter((entity) => entity.x >= -entity.width);
  }

  drawScore() {
    this.context.fillStyle = "white";
    this.context.font = "45px sans-serif";
    this.context.fillText(this.score, 5, 45);
  }

  spawnFish() {
    if (this.gameOver) return;
    if (Math.random() < 0.3) {
      let fish = new Fish(
        this.board.width,
        Math.random() * (this.board.height - fishHeight),
        fishWidth,
        fishHeight,
        "./images/fish.png"
      );
      fish.visible = true;
      this.fishArray.push(fish);
    }
  }

  movePenguin(e) {
    if (["Space", "ArrowUp", "KeyX"].includes(e.code)) {
      this.penguin.velocityY = -6;
      if (this.gameOver) {
        this.penguin.reset();
        this.icebergArray = [];
        this.fishArray = [];
        this.score = 0;
        this.gameOver = false;
      }
    }
  }
}

// Define board dimensions and global variables
const boardWidth = 1000;
const boardHeight = 600;

const penguinWidth = 300;
const penguinHeight = 350;
const penguinX = 50;
const penguinY = 50;
const icebergWidth = 100;
const icebergHeight = 100;
const fishWidth = 350;
const fishHeight = 300;

const velocityX = -2;
const gravity = 0.2;

window.onload = function () {
  const canvas = document.getElementById("board");
  canvas.width = boardWidth;
  canvas.height = boardHeight;
  new Game();
};
