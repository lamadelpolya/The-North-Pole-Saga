class Penguin {
  constructor(element) {
    this.element = element;
    this.isJumping = false;
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.element.classList.add("jump");
      setTimeout(() => {
        this.element.classList.remove("jump");
        this.isJumping = false;
      }, 300);
    }
  }

  getBottom() {
    return parseInt(
      window.getComputedStyle(this.element).getPropertyValue("bottom")
    );
  }
}

class Iceberg {
  constructor(element) {
    this.element = element;
    this.speed = 2000;
    this.setAnimationSpeed();
  }

  increaseSpeed() {
    this.speed -= 200;
    if (this.speed < 500) {
      this.speed = 500;
    }
    this.setAnimationSpeed();
  }

  setAnimationSpeed() {
    this.element.style.animationDuration = this.speed / 1000 + "s";
  }

  getLeft() {
    return parseInt(
      window.getComputedStyle(this.element).getPropertyValue("left")
    );
  }
}

class Fish {
  constructor(element) {
    this.element = element;
  }

  getLeft() {
    return parseInt(
      window.getComputedStyle(this.element).getPropertyValue("left")
    );
  }

  getBottom() {
    return parseInt(
      window.getComputedStyle(this.element).getPropertyValue("bottom")
    );
  }

  resetPosition() {
    this.element.style.right = "-20px";
    this.element.style.bottom = Math.floor(Math.random() * 120 + 40) + "px";
  }
}

class Game {
  constructor(penguinElement, icebergElements, fishElement) {
    this.penguin = new Penguin(penguinElement);
    this.icebergs = icebergElements.map((element) => new Iceberg(element));
    this.fish = new Fish(fishElement);
    this.score = 0;
    this.isAlive = true;

    document.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        this.penguin.jump();
      }
    });

    this.checkCollision();
    this.increaseDifficulty();
  }

  checkCollision() {
    this.collisionInterval = setInterval(() => {
      const penguinBottom = this.penguin.getBottom();
      this.icebergs.forEach((iceberg) => {
        const icebergLeft = iceberg.getLeft();

        // Check collision with iceberg
        if (icebergLeft < 90 && icebergLeft > 50 && penguinBottom < 50) {
          this.gameOver();
        }
      });

      const fishLeft = this.fish.getLeft();
      const fishBottom = this.fish.getBottom();

      // Check if penguin collects the fish
      if (
        fishLeft < 90 &&
        fishLeft > 50 &&
        penguinBottom >= fishBottom - 20 &&
        penguinBottom <= fishBottom + 20
      ) {
        this.score += 1;
        this.fish.resetPosition();
        console.log("Score:", this.score);
      }
    }, 10);
  }

  increaseDifficulty() {
    this.speedInterval = setInterval(() => {
      this.icebergs.forEach((iceberg) => iceberg.increaseSpeed());
    }, 5000);
  }

  gameOver() {
    clearInterval(this.collisionInterval);
    clearInterval(this.speedInterval);
    this.isAlive = false;
    alert("Game Over!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const penguinElement = document.getElementById("penguin");
  const icebergElements = Array.from(
    document.getElementsByClassName("iceberg")
  );
  const fishElement = document.getElementById("fish");
  new Game(penguinElement, icebergElements, fishElement);
});
