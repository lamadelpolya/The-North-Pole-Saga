class Penguin {
  constructor(x, y, width, height, imgSrc) {
    // Initialize penguin properties
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = imgSrc;
    this.velocityY = 0; // Vertical velocity for gravity effect
  }

  draw(context) {
    // Draw the penguin on the canvas
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  update() {
    // Update penguin's position and handle gravity
    this.velocityY += gravity;
    this.y = Math.max(this.y + this.velocityY, 0); // Ensure penguin doesn't go above the canvas

    if (this.y + this.height > boardHeight) {
      // Ensure penguin doesn't go below the canvas
      this.y = boardHeight - this.height;
      this.velocityY = 0; // Reset velocity when hitting the ground
    }
  }

  reset() {
    // Reset penguin's position and velocity
    this.y = penguinY;
    this.velocityY = 0;
  }

  catchFish(fish) {
    // Check if penguin has caught the fish
    const penguinRight = this.x + this.width;
    const penguinBottom = this.y + this.height;
    const fishRight = fish.x + fish.width;
    const fishBottom = fish.y + fish.height;

    if (
      // Check if penguin is touching the fish
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
  // Initialize iceberg properties
  constructor(x, y, width, height, imgSrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = imgSrc;
    this.passed = false; // Track if iceberg has been passed by penguin for scoring
  }

  draw(context) {
    // Draw the iceberg on the canvas
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  update() {
    // Update iceberg position (move left)
    this.x += velocityX;
  }
}

class Fish {
  constructor(x, y, width, height, imgSrc) {
    // Initialize fish properties
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = imgSrc;
    this.visible = false; // Fish visibility toggle
  }

  draw(context) {
    // Draw the fish on the canvas
    if (this.visible) {
      context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  update() {
    // Update fish position (move left)
    this.x += velocityX;
  }
}

class Game {
  constructor() {
    // Initialize game properties
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
    this.icebergInterval = null;
    this.fishInterval = null; // This line initializes the icebergInterval variable to null. This variable will be used to store the interval ID for the iceberg placement function
    //These variables and their initialization are essential for the game's functionality, as they allow the game to create and manage the icebergs and fish in the game environment.
    this.init();
  }

  startGameLoop() {
    // Start the game loop and intervals for spawning obstacles and fish
    this.gameLoopInterval = requestAnimationFrame(() => this.update());
    this.icebergInterval = setInterval(() => this.placeIcebergs(), 6000);
    this.fishInterval = setInterval(() => this.spawnFish(), 2000);
  }

  init() {
    // Setup initial game state and event listeners
    this.startButton.addEventListener("click", () => this.startGame());
    this.restartButton.addEventListener("click", () => this.restartGame());
    this.drawStartPage();
  }

  drawStartPage() {
    // Show start page
    this.board.style.display = "none";
    this.startPage.style.display = "flex";
    this.gameEndPage.style.display = "none";
  }

  startGame() {
    // Start the game, hide start page, show game board, and load images
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
    // Add event listeners for key presses to control the penguin
    document.addEventListener("keydown", (e) => this.movePenguin(e));
  }
  stopGameLoop() {
    // Stop the game loop and intervals for spawning obstacles and fish
    cancelAnimationFrame(this.gameLoopInterval);
    clearInterval(this.icebergInterval);
    clearInterval(this.fishInterval);
    console.log("stop game loop called");
  }

  update() {
    // Main game loop: clear canvas, update and draw game objects, check collisions
    this.context.clearRect(0, 0, this.board.width, this.board.height);

    // Update and draw penguin
    this.penguin.update();
    this.penguin.draw(this.context);
    // Update and draw icebergs
    this.icebergArray.forEach((iceberg, index) => {
      iceberg.update();
      iceberg.draw(this.context);
      // Remove iceberg from array if it's off the screen

      if (iceberg.x + iceberg.width < 0) {
        this.icebergArray.splice(index, 1); //If an iceberg is off the screen (i.e., its x-coordinate plus its width is less than 0), it is removed from the icebergArray
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
    this.context.fillStyle = "white";
    this.context.fillText(`Score: ${this.score}`, 10, 50);

    // Check for game over

    if (this.gameOver) {
      this.stopGameLoop();
      this.showGameEndScreen();
      setTimeout(() => {
        document.getElementById("game-end").style.display = "block";
        document.getElementById("start-page").style.display = "none";
      }, 0);
    } else {
      requestAnimationFrame(() => this.update());
    }
  }
  //This code snippet is crucial for managing the game's state and controlling the flow of the game loop. It ensures that the game ends when the player loses, and the game end screen is displayed accordingly.

  didCollide(penguin, iceberg) {
    // Check for collision between penguin and iceberg
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
    // Spawn new icebergs at intervals
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
    // Spawn new fish at intervals
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
    // Move the penguin based on key presses
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
      this.penguin.velocityY = -5;
      //in this specific line, velocityY = -5;, it sets the vertical velocity of the penguin to -5. This means that when the penguin jumps (or in this case, when the space, up arrow, or 'X' key is pressed), it will move upwards by 5 pixels per frame. This is a simple implementation of the jumping mechanic in the game.

      if (this.gameOver) {
        this.restartGame();
      }
    }
  }

  showGameEndScreen() {
    // Show game end page
    this.gameEndPage.style.display = "flex";
  }

  restartGame() {
    // Restart the game, resetting all necessary variables and objects
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
  //This code snippet is essential for setting up the game canvas and starting the game logic. It ensures that the game is properly initialized and ready to be played.
};
