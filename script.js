// Variable declaration
let floorPos_y;

let testGamer;

let gameChar_x;
let gameChar_y;
let scrollPos;
let gameChar_world_x;

let isLeft;
let isRight;
let isJumping;
let isFalling;

let isInCanyon;
let isOnPlatform;

let moveSpeed;
let jumpSpeed;
let fallSpeed;
let fallGravity;

let trees;
let canyons;
let platforms;
let collectables;
let flagpole;
let enemies;

let isContact;

let lives;
let score;
let gameOver;

// class GameChar {
//   constructor() {
//     this.x_pos;
//     this.world_x;
//     this.y_pos;
//     this.isDead;
//     this.status = "standing";
//   }
//   draw() {
//     fill(255, 0, 255);
//     rect(this.x_pos, this.y_pos - 30, 30, 30);
//   }
//   init() {
//     this.x_pos = width / 2;
//     this.y_pos = floorPos_y;
//     scrollPos = 0;
//   }
//   control(status) {
//     switch (status) {
//       case "isLeft": {
//         if (this.x_pos > width * 0.2) {
//           this.x_pos -= moveSpeed;
//         } else {
//           scrollPos += moveSpeed;
//         }
//         break;
//       }
//       case "isRight": {
//         if (this.x_pos < width * 0.8) {
//           this.x_pos += moveSpeed;
//         } else {
//           scrollPos -= moveSpeed; // negative for moving against the background
//         }
//         break;
//       }
//       case "isJumping": {
//         this.y_pos -= 150;
//         this.status = "isFalling";
//         break;
//       }
//       case "isFalling": {
//         this.y_pos += 5;
//         if (this.y_pos > floorPos_y) {
//           this.status = "fallsOnGround";
//         }
//         break;
//       }
//       case "fallsOnGround": {
//         this.y_pos = floorPos_y;
//         break;
//       }
//     }
//   }
//   checkIfDie() {}
// }
class Tree {
  constructor(x_pos, height, width) {
    this.x_pos = x_pos;
    this.height = height;
    this.width = width;
  }
  draw() {
    fill(255);
    quad(
      this.x_pos,
      floorPos_y - 1.2 * this.height,
      this.x_pos - 2 * this.width,
      floorPos_y - 0.5 * this.height,
      this.x_pos + 0.5 * this.width,
      floorPos_y - 0.25 * this.height,
      this.x_pos + 2 * this.width,
      floorPos_y - 0.5 * this.height
    );
    fill(120, 50);
    rect(this.x_pos, floorPos_y - this.height, this.width, this.height);
  }
}

class Canyon {
  constructor(x_pos, width) {
    this.x_pos = x_pos;
    this.width = width;
  }
  draw() {
    fill(20);
    rect(this.x_pos, floorPos_y, this.width, 200);
  }
  check() {
    if (
      gameChar_world_x >= this.x_pos &&
      gameChar_world_x <= this.x_pos + this.width
    ) {
      if (gameChar_y < floorPos_y) {
        console.log(`😊I'm OK! Not falling!`);
      } else {
        isInCanyon = true;
        console.log("😨i'm falling.");
      }
    }
  }
}
class Platform {
  constructor(x_pos, y_pos, length) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.length = length;
  }
  draw() {
    fill(150, 150, 0);
    rect(this.x_pos, this.y_pos, this.length, 20);
  }
  check(gc_x, gc_y) {
    // let within =
    //   gameChar_world_x >= this.x_pos &&
    //   gameChar_world_x <= this.x_pos + this.length;
    // if (within) {
    //   console.log("within platform.");
    //   if (gameChar_y <= this.y_pos) {
    //     isOnPlatform = true;
    //     if (abs(gameChar_y - this.y_pos) < 10) {
    //       gameChar_y = this.y_pos;
    //       isFalling = false;
    //       fallSpeed = 0;
    //     }
    //   }
    if (gc_x > this.x_pos && gc_x < this.x_pos + this.length) {
      if (abs(gc_y - this.y_pos) < 5) {
        return true;
      }
      return false;
    }
  }
}
class Collectable {
  constructor(x_pos, y_pos, size, isFound) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.size = size;
    this.isFound = isFound;
  }
  draw() {
    fill(0, 255, 255);
    ellipse(this.x_pos, this.y_pos, 20 * this.size);
  }
  check() {
    if (dist(gameChar_world_x, gameChar_y, this.x_pos, this.y_pos) < 35) {
      this.isFound = true;
      score += 1;
    }
  }
}
class Flagpole {
  constructor(x_pos, isReached) {
    this.x_pos = x_pos;
    this.isReached = isReached;
  }
  render() {
    push();
    if (this.isReached) {
      fill(202, 20, 20);
      rect(this.x_pos, floorPos_y - 250, 100, 250);
    } else {
      fill(20, 20, 200);
      rect(this.x_pos, floorPos_y - 250, 100, 250);
    }
    pop();
  }
  check() {
    if (abs(gameChar_world_x - this.x_pos) < 15) {
      this.isReached = true;
      gameOver = true;
    }
  }
}
class Enemy {
  constructor(x_pos, y_pos, range, velocity) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.range = range;
    this.currentX = x_pos;
    this.velocity = velocity;
    this.inc = velocity;
    this.isContact = false;
  }
  draw() {
    fill(255, 25, 21);
    ellipse(this.currentX, this.y_pos, 25);
  }
  update() {
    this.currentX += this.inc;
    if (this.currentX > this.x_pos + this.range) {
      this.inc = -this.velocity;
    } else if (this.currentX < this.x_pos) {
      this.inc = this.velocity;
    }
  }
  check() {
    if (dist(gameChar_world_x, gameChar_y, this.currentX, this.y_pos) < 40) {
      lives -= 1;
      gameChar_x += 80;
      this.isContact = true;
    }
  }
}
function setup() {
  // bgm.play();
  createCanvas(1024, 576);
  // cnv.mousePressed(function () {
  //   bgm.play();
  // });
  //bgm = loadSound("./assets/Thomas Greenberg - The Right Path.mp3", bgmLoaded);
  floorPos_y = (height * 3) / 4;

  startGame();
}

function draw() {
  background(0); // fill the sky blue
  noStroke();
  fill(125);
  rect(0, floorPos_y, width, height / 4); // draw ground

  push();
  translate(scrollPos, 0);

  //test

  // Draw environment
  for (i = 0; i < trees.length; i++) {
    trees[i].draw();
  }
  for (i = 0; i < canyons.length; i++) {
    canyons[i].draw();
    canyons[i].check();
  }
  for (i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }
  for (i = 0; i < collectables.length; i++) {
    if (!collectables[i].isFound) {
      collectables[i].check();
      collectables[i].draw();
    }
  }
  for (i = 0; i < enemies.length; i++) {
    enemies[i].draw();
    if (!enemies[i].isContact) {
      enemies[i].update();
      enemies[i].check();
    }
  }

  flagpole.render();

  pop();
  // test
  fill(255);
  noStroke();
  textSize(13);
  // text(
  //   "Enemy " +
  //     dist(gameChar_world_x, gameChar_y, enemies[0].currentX, enemies[0].y_pos),
  //   20,
  //   20
  // );
  //text("Gamer_X: " + gameChar_world_x, 250, 20);
  text("Lives: " + lives, 100, 20);
  text("score: " + score, 180, 20);
  //text("Gamer Y: " + round(gameChar_y), 20, 40);
  // text("isFalling: " + isFalling, 20, 60);
  // text("isOnPlatform: " + isOnPlatform, 20, 80);

  // testGamer.draw();
  // testGamer.control(testGamer.status);
  // Draw game character
  drawGameChar();
  // Contorl gamer's move

  textSize(30);
  if (!flagpole.isReached) {
    flagpole.check();
  }
  checkPlayerDie();

  if (lives < 1) {
    text("Game Over! Press space to continue.", 200, 268);
    return;
  }
  if (flagpole.isReached) {
    text("Level complete! Press space to continue.", 200, 268);
    return;
  }

  controlGamer();

  // testGamer.world_x = testGamer.x_pos - scrollPos;
  gameChar_world_x = gameChar_x - scrollPos;
}
function controlGamer() {
  if (isInCanyon) {
    fallSpeed += fallGravity;
    gameChar_y += fallSpeed;
  } else {
    if (isLeft) {
      // Logic to make the game character move or the background scroll.
      if (gameChar_x > width * 0.4) {
        gameChar_x -= moveSpeed;
      } else {
        scrollPos += moveSpeed;
      }
    }

    if (isRight) {
      if (gameChar_x < width * 0.6) {
        gameChar_x += moveSpeed;
      } else {
        scrollPos -= moveSpeed; // negative for moving against the background
      }
    }

    // Logic to make the game character rise and fall.
    if (isJumping) {
      if (!isFalling) {
        // can't jump again in the air
        gameChar_y -= jumpSpeed;
        isJumping = false;
      }
    }

    // if (isFalling) {
    //   if (gameChar_y < floorPos_y) {
    //     //falling
    //     fallSpeed += fallGravity;
    //     gameChar_y += fallSpeed;
    //   } else {
    //     // force to stop at ground
    //     isFalling = false;
    //     fallSpeed = 0;
    //     gameChar_y = floorPos_y;
    //   }
    // }
    if (gameChar_y < floorPos_y) {
      isContact = false;
      for (i = 0; i < platforms.length; i++) {
        if (platforms[i].check(gameChar_world_x, gameChar_y)) {
          isContact = true;
          isFalling = false;
          fallSpeed = 0;
          gameChar_y = platforms[i].y_pos;
          break;
        }
      }
      if (!isContact) {
        fallSpeed += fallGravity;
        gameChar_y += fallSpeed;
        isFalling = true;
      }
    } else {
      isFalling = false;
      fallSpeed = 0;
      gameChar_y = floorPos_y;
    }
  }
}

function keyPressed() {
  // if statements to control the animation of the character when
  // keys are pressed.
  if (keyCode == 37) {
    isLeft = true;
    //  testGamer.status = "isLeft";
  }
  if (keyCode == 39) {
    isRight = true;
    //testGamer.status = "isRight";
  }

  if (keyCode == 32) {
    isJumping = true;
    // testGamer.status = "isJumping";
    if (gameOver) {
      startGame();
    }
  }
}

function keyReleased() {
  if (keyCode == 37) {
    isLeft = false;
    // testGamer.status = "standing";
  }
  if (keyCode == 39) {
    isRight = false;
    //testGamer.status = "standing";
  }
  if (keyCode == 32) {
    console.log("relase" + keyCode);
    isJumping = false;
    isFalling = true;
  }
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar() {
  fill(255, 0, 255);
  rect(gameChar_x, gameChar_y - 30, 30, 30);
}
function checkPlayerDie() {
  if (gameChar_y > floorPos_y + 500) {
    lives -= 1;
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
    isFalling = false;
    isInCanyon = false;
    scrollPos = 0;
  }
  if (lives < 1) {
    gameOver = true;
  }
}
function startGame() {
  // testGamer = new GameChar();

  // testGamer.init();

  gameChar_x = width / 2;
  gameChar_y = floorPos_y;
  console.log("new game started.");
  // Variable to control the background scrolling.
  scrollPos = 0;
  gameOver = false;
  // Variable to store the real position of the gameChar in the game
  // world. Needed for collision detection.
  gameChar_world_x = gameChar_x - scrollPos;
  // testGamer.world_x = testGamer.x_pos - scrollPos;

  // Boolean variables to control the movement of the game character.
  isLeft = false;
  isRight = false;
  isJumping = false;
  isFalling = false;
  isInCanyon = false;
  isOnPlatform = false;

  // Speed const
  moveSpeed = 8;
  jumpSpeed = 150;
  fallSpeed = 0;
  fallGravity = 0.3;

  trees = [];
  for (i = 0; i < random(20, 25); i++) {
    trees.push(
      new Tree(
        random(15, 20) + i * random(200, 300),
        random(200, 300),
        random(10, 20)
      )
    );
  }
  canyons = [];
  for (i = 0; i < random(10, 15); i++) {
    canyons.push(new Canyon(random(50, 60) + i * 600, random(50, 100)));
  }
  platforms = [];
  for (i = 0; i < random(10, 15); i++) {
    platforms.push(
      new Platform(random(25, 30) + i * 300, random(250, 350), random(150, 180))
    );
  }
  collectables = [];
  for (i = 0; i < random(20, 30); i++) {
    collectables.push(
      new Collectable(
        random(0, 10) + i * random(200, 250),
        floorPos_y - 20,
        random(0.5, 2),
        false
      )
    );
  }

  flagpole = new Flagpole(5000, false);
  lives = 3;
  score = 0;

  enemies = [];
  for (i = 0; i < random(10, 15); i++) {
    enemies.push(
      new Enemy(1000 + i * random(350, 650), floorPos_y - 30, 150, random(1, 2))
    );
  }
}
