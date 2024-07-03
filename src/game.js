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

    this.bottomIcebergImgSrc = "./images/iceberg1.png";
    this.fishImgSrc = "./images/fish.png";

    this.icebergSpawnInterval = 6000; // Spawn icebergs every 5 seconds
    this.fishSpawnInterval = 2000; // Spawn fish every 7 seconds

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

    // Load images and start game loop after images are loaded
    this.loadImages(() => {
      this.setupEventListeners();
      this.startGameLoop();
    });
  }

  loadImages(callback) {
    let imagesLoaded = 0;
    const totalImages = 3; // Update this if you add more images

    const checkAllImagesLoaded = () => {
      imagesLoaded++;
      console.log(`Images loaded: ${imagesLoaded}/${totalImages}`);
      if (imagesLoaded === totalImages) {
        callback();
      }
    };

    this.penguin.img.onload = checkAllImagesLoaded;
    this.penguin.img.src = "./images/penguin.png";

    // Load iceberg image
    this.bottomIcebergImg = new Image();
    this.bottomIcebergImg.onload = checkAllImagesLoaded;
    this.bottomIcebergImg.src = this.bottomIcebergImgSrc;

    // Load fish image
    this.fishImg = new Image();
    this.fishImg.onload = checkAllImagesLoaded;
    this.fishImg.src = this.fishImgSrc;

    // Ensure callback is called if no images are loaded
    if (totalImages === 0) {
      callback();
    }
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => this.movePenguin(e));
  }

  startGameLoop() {
    requestAnimationFrame(() => this.update());
    setInterval(() => this.placeIcebergs(), this.icebergSpawnInterval);
    setInterval(() => this.spawnFish(), this.fishSpawnInterval);
  }

  update() {
    if (this.gameOver) return;

    this.context.clearRect(0, 0, this.board.width, this.board.height);

    // Update and draw penguin
    this.penguin.update();
    this.penguin.draw(this.context);

    if (this.penguin.y + this.penguin.height >= this.board.height) {
      this.gameOver = true;
    }

    // Update and draw icebergs
    this.icebergArray.forEach((iceberg) => {
      iceberg.update();
      iceberg.draw(this.context);

      if (iceberg.x + iceberg.width < 0) {
        iceberg.x = this.board.width;
        iceberg.y =
          this.board.height -
          iceberg.height -
          Math.random() * (this.board.height / 2);
        iceberg.passed = false;
      }

      if (!iceberg.passed && this.penguin.x > iceberg.x + iceberg.width) {
        this.score += 1;
        iceberg.passed = true;
      }
    });

    // Update and draw fish
    this.fishArray.forEach((fish) => {
      fish.update();
      fish.draw(this.context);

      if (this.penguin.catchFish(fish)) {
        this.score += 1;
        fish.visible = false;
      }
    });

    // Clear fish that are out of the board
    this.fishArray = this.fishArray.filter((fish) => fish.x >= -fish.width);

    // Draw score
    const centerX = this.board.width / 2;
    const centerY = this.board.height / 2;
    this.context.textAlign = "center";

    this.context.fillStyle = "white";
    this.context.font = "30px cursive";
    this.context.fillText("Score: " + this.score, 80, 55);

    if (this.gameOver) {
      this.context.fillText("GAME OVER", centerX, centerY + 50); // Adjust the Y coordinate as needed
    } else {
      requestAnimationFrame(() => this.update());
    }
  }

  placeIcebergs() {
    if (this.gameOver) return;

    let icebergY =
      this.board.height -
      icebergHeight -
      Math.random() * (this.board.height / 2);
    let iceberg = new Iceberg(
      this.board.width,
      icebergY,
      icebergWidth,
      icebergHeight,
      this.bottomIcebergImgSrc
    );
    this.icebergArray.push(iceberg);
  }

  spawnFish() {
    if (this.gameOver) return;

    let spawnFishChance = Math.random();
    if (spawnFishChance < 1) {
      // Adjust this probability as needed
      let fish = new Fish(
        this.board.width,
        Math.random() * (this.board.height - fishHeight),
        fishWidth,
        fishHeight,
        this.fishImgSrc
      );
      fish.visible = true;
      this.fishArray.push(fish);
    }
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
      }
    }
  }
}

// function detectCollision(a, b) {
//   return (
//     a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
//     a.x + a.width > b.x && //a's top right corner passes b's top left corner
//     a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
//     a.y + a.height > b.y
//   ); //a's bottom left corner passes b's top left corner
// }
// Define board dimensions globally
const boardWidth = 800;
const boardHeight = 600;

let penguinWidth = 150;
let penguinHeight = 150;
let penguinX = 100;
let penguinY = boardHeight / 2 - penguinHeight / 2;
let icebergWidth = 200;
let icebergHeight = 100;
let fishWidth = 250;
let fishHeight = 300;

let velocityX = -2;
let gravity = 0.2;

window.onload = function () {
  const canvas = document.getElementById("board");
  canvas.width = boardWidth;
  canvas.height = boardHeight;
  new Game();
};
