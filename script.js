// COMMENT
//

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

let isAttacking;
let isInCanyon;
let isOnPlatform;

let moveSpeed;
let jumpSpeed;
let fallSpeed;
let fallGravity;

let trees;
let clouds;
let canyons;
let platforms;
let collectables;
let flagpole;
let enemies;
let flyingEnemies;

let npc;

let isContact;

let lives;
let score;
let gameOver;

let emits;

let secondJumpFlag;

let bullet;
let tabOpen;

let imgStar;

class Cloud {
  constructor(x_pos, y_pos, size) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.size = size;
  }
  draw() {
    fill(255);
    rect(
      this.x_pos,
      this.y_pos,
      this.size * 2,
      this.size / 1.7,
      this.size / 2.5
    );
    ellipse(
      this.x_pos + this.size * 0.6,
      this.y_pos,
      this.size * 0.6,
      this.size * 0.5
    );
    ellipse(
      this.x_pos + this.size * 1.2,
      this.y_pos,
      this.size,
      this.size * 0.8
    );
  }
}

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
    ellipse(this.x_pos, this.y_post, 50);
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
    if (bullet) {
      if (dist(bullet.x, bullet.y, this.currentX, this.y_pos) < 40) {
        this.isContact = true;
        bullet = false;
        score += 1;
      }
    }
  }
}
class Particle {
  constructor(x, y, xSpeed, ySpeed, size, color) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.color = color;
    this.age = 0;
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.age++;
  }
}
class Emitter {
  constructor(x, y, xSpeed, ySpeed, size, color) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.color = color;
    this.particles = [];
    this.startPar = 0;
    this.lifetime = 0;
  }
  addPar() {
    let p = new Particle(
      random(this.x - 10, this.x + 10),
      random(this.y - 10, this.y + 10),
      random(this.xSpeed - 1, this.xSpeed + 1),
      random(this.ySpeed - 1, this.ySpeed + 1),
      random(this.size - 4, this.size + 4),
      this.color
    );
    return p;
  }
  StartEmitter(startPar, lifetime) {
    this.startPar = startPar;
    this.lifetime = lifetime;

    // start emitter with initial particles
    for (let i = 0; i < this.startPar; i++) {
      this.particles.push(this.addPar());
    }
  }
  update() {
    // iterate
    let deadPar = 0;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].draw();
      this.particles[i].update();
      if (this.particles[i].age > random(5, this.lifetime)) {
        this.particles.splice(i, 1);
        deadPar++;
      }
    }
    if (deadPar > 0) {
      for (let i = 0; i < deadPar; i++) {
        this.particles.push(this.addPar());
      }
    }
  }
}

class Bullet {
  constructor(x, y, speed, isRight) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isRight = isRight;
    this.disappeared = false;
    this.lifetime = 50;
  }
  shoot() {
    fill(255);
    rect(this.x, this.y, 20, 5);
  }
  update() {
    if (this.isRight) {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }
    this.lifetime -= 1;
    if (this.lifetime <= 0) {
      this.disappeared = true;
    }
  }
}
class NPC {
  constructor(x, y, isTalking) {
    this.x = x;
    this.y = y;
    this.isTalking = false;
  }
  draw() {
    fill(255, 1, 255);
    ellipse(this.x, this.y, 50);
    if (dist(gameChar_world_x, gameChar_y, this.x, this.y) < 150) {
      if (gameChar_world_x < this.x) {
        fill(0);
        ellipse(this.x - 20, this.y - 8, 5);
        ellipse(this.x, this.y - 8, 5);
      } else {
        fill(0);
        ellipse(this.x + 20, this.y - 8, 5);
        ellipse(this.x, this.y - 8, 5);
      }
    }
  }
  talk() {
    if (dist(gameChar_world_x, gameChar_y, this.x, this.y) < 100) {
      fill(255, 120);
      rect(this.x - 50, this.y - 100, 100, 40);
      fill(0);
      textSize(15);
      text(
        "Find a way to save us all.",

        this.x - 45,
        this.y - 95,
        100,
        40
      );
    }
  }
}
function preload() {
  imgStar = loadImage("./assets/star.png");
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

  if (bullet) {
    if (!bullet.disappeared) {
      bullet.shoot();
      bullet.update();
    }
  }

  // Draw environment
  for (let tree of trees) {
    tree.draw();
  }

  for (let cloud of clouds) {
    cloud.draw();
  }
  for (let canyon of canyons) {
    canyon.draw();
    canyon.check();
  }
  for (let platform of platforms) {
    platform.draw();
  }
  for (let collectable of collectables) {
    if (!collectable.isFound) {
      collectable.check();
      collectable.draw();
    }
  }

  for (let enemy of enemies) {
    if (!enemy.isContact) {
      enemy.draw();
      enemy.update();
      enemy.check();
    }
  }

  for (let flyingEnemy of flyingEnemies) {
    if (!flyingEnemy.isContact) {
      flyingEnemy.draw();
      flyingEnemy.update();
      flyingEnemy.check();
    }
  }

  flagpole.render();

  npc.draw();
  npc.talk();

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

  text("Tab " + tabOpen, 250, 20);

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
  if (tabOpen) {
    openTab();
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
      if (secondJumpFlag == 0) {
        // if (!isFalling) {
        // can't jump again in the air
        gameChar_y -= jumpSpeed;
        secondJumpFlag += 1;
        isJumping = false;
        console.log("first time jump");
        // }
      } else if (secondJumpFlag == 1) {
        gameChar_y -= jumpSpeed * 0.9;
        isJumping = false;
        secondJumpFlag += 1;
      }
    }

    if (gameChar_y < floorPos_y) {
      isContact = false;
      for (i = 0; i < platforms.length; i++) {
        if (platforms[i].check(gameChar_world_x, gameChar_y)) {
          isContact = true;
          isFalling = false;
          fallSpeed = 0;
          gameChar_y = platforms[i].y_pos;
          secondJumpFlag = 0;
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
      secondJumpFlag = 0;
    }
  }
}
function openTab() {
  fill(255, 200);
  rect(width / 4, 50, 500, 500);
  fill(255, 0, 5);
  textSize(32);
  text("- Paused", width / 4 + 50, 100);
}
function keyPressed() {
  print(keyCode);
  // if statements to control the animation of the character when
  // keys are pressed.
  if (keyCode == 81) {
    tabOpen = !tabOpen;
    if (isLooping()) {
      noLoop();
    } else {
      loop();
    }
  }
  if (keyCode == 65) {
    isAttacking = true;
    bullet = new Bullet(gameChar_world_x - 30, gameChar_y - 20, 5, false);
  }
  if (keyCode == 68) {
    isAttacking = true;
    bullet = new Bullet(gameChar_world_x + 30, gameChar_y - 20, 5, true);
  }
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
  if (keyCode == 68) {
    isAttacking = false;
  }
  if (keyCode == 37) {
    isLeft = false;
    // testGamer.status = "standing";
  }
  if (keyCode == 39) {
    isRight = false;
    //testGamer.status = "standing";
  }
  if (keyCode == 32) {
    // console.log("relase" + keyCode);
    isJumping = false;
    isFalling = true;
  }
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar() {
  if (isFalling && isLeft) {
    //Character
    //cloak
    fill(102, 178, 255);
    triangle(
      gameChar_x + 30,
      gameChar_y - 60,
      gameChar_x + 20,
      gameChar_y - 15,
      gameChar_x + 3,
      gameChar_y - 35
    );
    // triangle(
    //   gameChar_x - 30,
    //   gameChar_y - 60,
    //   gameChar_x - 20,
    //   gameChar_y - 15,
    //   gameChar_x - 3,
    //   gameChar_y - 35
    // );
    //legs
    fill(0);
    rect(gameChar_x, gameChar_y - 10, 1.8, 10, 2);
    //rect(gameChar_x + 4, gameChar_y - 10, 1.8, 14, 2);
    //dress
    fill(255, 192, 203);
    triangle(
      gameChar_x,
      gameChar_y - 45,
      gameChar_x - 15,
      gameChar_y - 15,
      gameChar_x + 15,
      gameChar_y - 15
    );
    arc(gameChar_x, gameChar_y - 15, 30, 13, 0, 3.2);

    //head
    fill(250, 235, 215);
    ellipse(gameChar_x, gameChar_y - 45, 13, 15);
    //hat
    fill(25);
    triangle(
      gameChar_x - 12,
      gameChar_y - 45,
      gameChar_x,
      gameChar_y - 75,
      gameChar_x + 12,
      gameChar_y - 45
    );
  } else if (isFalling && isRight) {
    //cloak
    fill(102, 178, 255);
    // triangle(
    //   gameChar_x + 30,
    //   gameChar_y - 60,
    //   gameChar_x + 20,
    //   gameChar_y - 15,
    //   gameChar_x + 3,
    //   gameChar_y - 35
    // );
    triangle(
      gameChar_x - 30,
      gameChar_y - 60,
      gameChar_x - 20,
      gameChar_y - 15,
      gameChar_x - 3,
      gameChar_y - 35
    );
    //legs
    fill(0);
    rect(gameChar_x, gameChar_y - 10, 1.8, 10, 2);
    //rect(gameChar_x + 4, gameChar_y - 10, 1.8, 14, 2);
    //dress
    fill(255, 192, 203);
    triangle(
      gameChar_x,
      gameChar_y - 45,
      gameChar_x - 15,
      gameChar_y - 15,
      gameChar_x + 15,
      gameChar_y - 15
    );
    arc(gameChar_x, gameChar_y - 15, 30, 13, 0, 3.2);

    //head
    fill(250, 235, 215);
    ellipse(gameChar_x, gameChar_y - 45, 13, 15);
    //hat
    fill(25);
    triangle(
      gameChar_x - 12,
      gameChar_y - 45,
      gameChar_x,
      gameChar_y - 75,
      gameChar_x + 12,
      gameChar_y - 45
    );
  } else if (isLeft) {
    //cloak
    fill(178, 34, 34);
    triangle(
      gameChar_x,
      gameChar_y - 43,
      gameChar_x + 23,
      gameChar_y - 20,
      gameChar_x,
      gameChar_y - 25
    );

    //legs
    fill(0);
    rect(gameChar_x, gameChar_y - 10, 1.8, 14, 2);

    //dress
    fill(255, 192, 203);
    triangle(
      gameChar_x,
      gameChar_y - 45,
      gameChar_x - 15,
      gameChar_y - 15,
      gameChar_x + 15,
      gameChar_y - 15
    );
    arc(gameChar_x, gameChar_y - 15, 30, 13, 0, 3.2);

    //head
    fill(250, 235, 215);
    ellipse(gameChar_x, gameChar_y - 45, 13, 15);
    //hat
    fill(25);
    triangle(
      gameChar_x - 12,
      gameChar_y - 45,
      gameChar_x,
      gameChar_y - 75,
      gameChar_x + 12,
      gameChar_y - 45
    );
  } else if (isRight) {
    //cloak
    fill(178, 34, 34);
    // triangle(
    //   gameChar_x,
    //   gameChar_y - 43,
    //   gameChar_x + 20,
    //   gameChar_y - 20,
    //   gameChar_x,
    //   gameChar_y - 25
    // );
    triangle(
      gameChar_x,
      gameChar_y - 43,
      gameChar_x - 23,
      gameChar_y - 20,
      gameChar_x,
      gameChar_y - 25
    );
    //legs
    fill(0);
    rect(gameChar_x, gameChar_y - 10, 1.8, 14, 2);
    //rect(gameChar_x + 4, gameChar_y - 10, 1.8, 14, 2);
    //dress
    fill(255, 192, 203);
    triangle(
      gameChar_x,
      gameChar_y - 45,
      gameChar_x - 15,
      gameChar_y - 15,
      gameChar_x + 15,
      gameChar_y - 15
    );
    arc(gameChar_x, gameChar_y - 15, 30, 13, 0, 3.2);

    //head
    fill(250, 235, 215);
    ellipse(gameChar_x, gameChar_y - 45, 13, 15);
    //hat
    fill(25);
    triangle(
      gameChar_x - 12,
      gameChar_y - 45,
      gameChar_x,
      gameChar_y - 75,
      gameChar_x + 12,
      gameChar_y - 45
    );
  } else if (isFalling) {
    //cloak
    fill(102, 178, 255);
    triangle(
      gameChar_x + 30,
      gameChar_y - 60,
      gameChar_x + 20,
      gameChar_y - 15,
      gameChar_x + 3,
      gameChar_y - 35
    );
    triangle(
      gameChar_x - 30,
      gameChar_y - 60,
      gameChar_x - 20,
      gameChar_y - 15,
      gameChar_x - 3,
      gameChar_y - 35
    );
    //legs
    fill(0);
    rect(gameChar_x - 5, gameChar_y - 10, 1.8, 10, 2);
    rect(gameChar_x + 4, gameChar_y - 10, 1.8, 10, 2);
    //dress
    fill(255, 192, 203);
    triangle(
      gameChar_x,
      gameChar_y - 45,
      gameChar_x - 15,
      gameChar_y - 15,
      gameChar_x + 15,
      gameChar_y - 15
    );
    arc(gameChar_x, gameChar_y - 15, 30, 13, 0, 3.2);

    //head
    fill(250, 235, 215);
    ellipse(gameChar_x, gameChar_y - 45, 13, 15);
    //hat
    fill(25);
    triangle(
      gameChar_x - 12,
      gameChar_y - 45,
      gameChar_x,
      gameChar_y - 75,
      gameChar_x + 12,
      gameChar_y - 45
    );
  } else {
    //cloak
    fill(178, 34, 34);
    triangle(
      gameChar_x,
      gameChar_y - 43,
      gameChar_x + 20,
      gameChar_y - 20,
      gameChar_x,
      gameChar_y - 25
    );
    triangle(
      gameChar_x,
      gameChar_y - 43,
      gameChar_x - 20,
      gameChar_y - 20,
      gameChar_x,
      gameChar_y - 25
    );
    //legs
    fill(0);
    rect(gameChar_x - 5, gameChar_y - 10, 1.8, 14, 2);
    rect(gameChar_x + 4, gameChar_y - 10, 1.8, 14, 2);
    //dress
    fill(255, 192, 203);
    triangle(
      gameChar_x,
      gameChar_y - 45,
      gameChar_x - 15,
      gameChar_y - 15,
      gameChar_x + 15,
      gameChar_y - 15
    );
    arc(gameChar_x, gameChar_y - 15, 30, 13, 0, 3.2);

    //head
    fill(250, 235, 215);
    ellipse(gameChar_x, gameChar_y - 45, 13, 15);

    //hat
    fill(25);
    triangle(
      gameChar_x - 12,
      gameChar_y - 45,
      gameChar_x,
      gameChar_y - 75,
      gameChar_x + 12,
      gameChar_y - 45
    );
  }
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
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;

  // Variable to control the background scrolling.
  scrollPos = 0;
  gameOver = false;

  // Variable to store the real position of the gameChar in the game
  // world. Needed for collision detection.

  gameChar_world_x = gameChar_x - scrollPos;

  // Boolean variables to control the movement of the game character.
  isLeft = false;
  isRight = false;
  isJumping = false;
  isFalling = false;
  isInCanyon = false;
  isOnPlatform = false;

  isAttacking = false;

  secondJumpFlag = 0;

  // Speed const
  moveSpeed = 8;
  jumpSpeed = 120;
  fallSpeed = 0;
  fallGravity = 0.22;

  // Initialise environmet.

  lives = 3;
  score = 0;
  tabOpen = false;

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
  clouds = [];
  for (i = 0; i < random(10, 20); i++) {
    clouds.push(
      new Cloud(20 + i * random(320, 420), random(100, 200), random(20, 40))
    );
  }
  canyons = [];
  for (i = 0; i < random(10, 15); i++) {
    canyons.push(new Canyon(random(50, 60) + i * 1000, random(50, 100)));
  }
  platforms = [];
  for (i = 0; i < random(10, 15); i++) {
    platforms.push(
      new Platform(random(25, 30) + i * 300, random(200, 300), random(150, 180))
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

  enemies = [];
  for (i = 0; i < random(10, 15); i++) {
    enemies.push(
      new Enemy(
        1000 + i * random(200, 650),
        random(floorPos_y - 50, 300),
        150,
        random(1, 2)
      )
    );
  }

  flyingEnemies = [];
  for (let i = 0; i < random(10, 15); i++) {
    flyingEnemies.push(
      new Enemy(
        1000 + i * random(200, 300),
        random(floorPos_y - 300, 200),
        150,
        random(1, 2)
      )
    );
  }

  npc = new NPC(800, floorPos_y - 50);
}
