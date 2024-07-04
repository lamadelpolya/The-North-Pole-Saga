# The North Pole Saga

Welcome to The North Pole Saga! Help the penguin navigate through icebergs and catch fish to score points.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Description

The North Pole Saga is a fun and engaging game where you control a penguin, helping it to avoid icebergs and catch fish to score points. The game features smooth animations and interactive gameplay, implemented using HTML5 Canvas and JavaScript.

You can play the game [here](https://lamadelpolya.github.io/The-North-Pole-Saga/).

## Installation

To run the game locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/lamadelpolya/The-North-Pole-Saga.git
   Navigate to the project directory:
   ```

bash
Copy code
cd The-North-Pole-Saga
Open the index.html file in your preferred web browser.

Usage
Press the Start button to begin the game.
Control the penguin using the Space, Arrow Up, or X keys to make the penguin jump.
Avoid icebergs and catch fish to score points.
The game ends if the penguin collides with an iceberg or falls off the screen.
Features
Penguin Movement: Control the penguin using keyboard keys.
Obstacles: Icebergs appear at intervals and need to be avoided.
Collectibles: Fish appear at intervals and can be caught to score points.
Score Tracking: Keep track of your score during the game.
Game Over Screen: Display a game over message when the game ends.
Contributing
Contributions are welcome! If you have any ideas, suggestions, or bug fixes, please create an issue or submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Contact
If you have any questions or feedback, feel free to contact me at polya.kiev@gmail.com

Project Structure:

css
Copy code
The-North-Pole-Saga/
├── images/
│ ├── background.png
│ ├── button.png
│ ├── fish1.png
│ ├── iceberg.png
│ └── penguin.png
├── src/
│ └── game.js
├── styles/
│ └── style.css
├── index.html
└── README.md
Code Overview:

HTML
The index.html file sets up the basic structure of the game, including the start page and the game board.

html
Copy code

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>The North Pole Saga</title>
    <link rel="stylesheet" href="./styles/style.css" />
  </head>
  <body>
    <div id="start-page">
      <button id="start-button"></button>
    </div>
    <canvas id="board"></canvas>
    <script src="./src/game.js"></script>
  </body>
</html>
CSS
The style.css file contains the styling for the game, including the start page and game board.

css
Copy code
body {
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
margin: 0;
background: white;
background: #76b1c3;
}
#board {
display: flex;
background-size: cover;
background-repeat: no-repeat;
background-position: center;
width: 75%;
height: 80%;
z-index: 0;
background-image: url("./screen.png");
}
#start-page {
display: flex;
flex-direction: column;
justify-content: flex-end;
align-items: center;
text-align: center;
position: absolute;
top: 0;
left: 0;
background-image: url("./background.png");
background-repeat: no-repeat;
background-position: center;
background-size: cover;
width: 100%;
height: 100%;
z-index: 0;
}

#start-page h1 {
font-size: 3rem;
font-family: "Cursive", cursive;
color: white;
}

#start-page p {
font-size: 1.5rem;
color: white;
}

#start-button {
all: unset;
background-image: url(./button.png);
background-repeat: no-repeat;
background-position: center;
width: 24em;
height: 4em;
margin-bottom: 3em;
}

#game-end {
display: none;
}

.game-intro p {
font-size: 18px;
font-family: "Verdana";
}

.end-img {
width: 350px;
}

.arrows-img {
width: 150px;
}

body button {
all: unset;
background-image: url(./button.png);
background-repeat: no-repeat;
background-position: center;
width: 24em;
height: 4em;
margin-bottom: 3em;
}
JavaScript
The game.js file contains the main logic for the game, including the classes for the Penguin, Iceberg, Fish, and Game.

javascript
Copy code
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
this.start
}}
