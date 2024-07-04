class Game {
  constructor() {
    this.board = document.getElementById("board");
    this.startPage = document.getElementById("start-page");
    this.startButton = document.getElementById("start-button");
    this.restartButton = document.getElementById("restart-button");
    this.gameEndPage = document.getElementById("game-end");
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
    this.fishImgSrc = "./images/fish1.png";

    this.icebergSpawnInterval = 6000; // Spawn icebergs every 6 seconds
    this.fishSpawnInterval = 2000; // Spawn fish every 2 seconds

    this.init();
  }

  init() {
    this.startButton.addEventListener("click", () => this.startGame());
    this.restartButton.addEventListener("click", () => this.restartGame());
    this.drawStartPage();
  }

  drawStartPage() {
    this.board.style.display = "none";
    this.startPage.style.display = "flex";
    this.gameEndPage.style.display = "none";
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
    this.gameLoopInterval = requestAnimationFrame(() => this.update());
    this.icebergInterval = setInterval(
      () => this.placeIcebergs(),
      this.icebergSpawnInterval
    );
    this.fishInterval = setInterval(
      () => this.spawnFish(),
      this.fishSpawnInterval
    );
  }

  stopGameLoop() {
    cancelAnimationFrame(this.gameLoopInterval);
    clearInterval(this.icebergInterval);
    clearInterval(this.fishInterval);
  }

  update() {
    if (this.gameOver) {
      this.stopGameLoop();
      this.showGameEndScreen();
      return;
    }

    this.context.clearRect(0, 0, this.board.width, this.board.height);

    // Update and draw penguin
    this.penguin.update();
    this.penguin.draw(this.context);

    if (this.penguin.y + this.penguin.height >= this.board.height + 10) {
      this.gameOver = true;
    }

    // Update and draw icebergs
    this.icebergArray.forEach((iceberg, index) => {
      iceberg.update();
      iceberg.draw(this.context);

      if (iceberg.x + iceberg.width < 0) {
        this.icebergArray.splice(index, 1);
      }

      if (!iceberg.passed && this.penguin.x > iceberg.x + iceberg.width) {
        this.score += 1;
        iceberg.passed = true;
      }

      // Check for collision between penguin and iceberg
      if (this.didCollide(this.penguin, iceberg)) {
        this.gameOver = true;
      }
    });

    this.fishArray.forEach((fish, index) => {
      fish.update();
      fish.draw(this.context);

      if (this.penguin.catchFish(fish)) {
        this.score += 1;
        this.fishArray.splice(index, 1);
      }
    });

    // Draw score
    this.context.font = "30px Arial";
    this.context.fillStyle = "black";
    this.context.fillText(`Score: ${this.score}`, 10, 50);

    // Check for game over
    if (this.gameOver) {
      setTimeout(() => {
        document.getElementById("game-end").style.display = "block";
        document.getElementById("start-page").style.display = "none";
      }, 0);
    } else {
      requestAnimationFrame(() => this.update());
    }
  }

  didCollide(penguin, iceberg) {
    const penguinRect = {
      left: penguin.x,
      top: penguin.y,
      right: penguin.x + penguin.width,
      bottom: penguin.y + penguin.height,
    };

    const icebergRect = {
      left: iceberg.x,
      top: iceberg.y,
      right: iceberg.x + iceberg.width,
      bottom: iceberg.y + iceberg.height,
    };

    return (
      penguinRect.left < icebergRect.right &&
      penguinRect.right > icebergRect.left &&
      penguinRect.top < icebergRect.bottom &&
      penguinRect.bottom > icebergRect.top
    );
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
      this.penguin.velocityY = -5;

      if (this.gameOver) {
        this.restartGame();
      }
    }
  }

  showGameEndScreen() {
    this.gameEndPage.style.display = "flex";
  }

  restartGame() {
    this.penguin.reset();
    this.icebergArray = [];
    this.fishArray = [];
    this.score = 0;
    this.gameOver = false;
    this.context.clearRect(0, 0, this.board.width, this.board.height);
    this.startGameLoop();
    this.gameEndPage.style.display = "none";
  }
}
const boardWidth = 800;
const boardHeight = 600;

let penguinWidth = 50;
let penguinHeight = 100;
let penguinX = 100;
let penguinY = boardHeight / 2 - penguinHeight / 2;
let icebergWidth = 250;
let icebergHeight = 200;
let fishWidth = 50;
let fishHeight = 50;

let velocityX = -2;
let gravity = 0.2;

window.onload = function () {
  const canvas = document.getElementById("board");
  canvas.width = boardWidth;
  canvas.height = boardHeight;
  new Game();
};
