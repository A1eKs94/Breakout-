let paddle;
let ball;
let lives = 3;
let bricks = [];
let score = 0;
let currentLevel = 1;
const maxLevel = 3;

function setup() {
  createCanvas(600, 400);
  paddle = new Paddle();
  ball = new Ball(currentLevel);
  createBricks();
}

function draw() {
  background(51);
  paddle.update();
  paddle.show();

  ball.update();
  ball.checkPaddle(paddle);
  ball.show();

  if (ball.offScreen()) {
    lives--;
    if (lives <= 0) {
      noLoop();
      textSize(32);
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      text("¡Game Over!", width / 2, height / 2);
    } else {
      ball = new Ball(currentLevel);
    }
  }

  for (let i = bricks.length - 1; i >= 0; i--) {
    let b = bricks[i];
    b.show();
    if (ball.hits(b)) {
      b.hit();
      ball.vy *= -1;
      if (b.isDestroyed()) {
        bricks.splice(i, 1);
        score++;
      }
    }
  }

  if (bricks.length === 0) {
    nextLevel();
  }

  fill(255);
  textSize(16);
  text(`Vidas: ${lives}`, 10, height - 10);
  text(`Puntos: ${score}`, width - 100, height - 10);
  text(`Nivel: ${currentLevel}`, width / 2 - 30, height - 10);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) paddle.move(-1);
  else if (keyCode === RIGHT_ARROW) paddle.move(1);
}

function keyReleased() {
  paddle.move(0);
}

class Paddle {
  constructor() {
    this.w = 100;
    this.h = 10;
    this.x = width / 2 - this.w / 2;
    this.speed = 7;
    this.direction = 0;
  }

  move(dir) {
    this.direction = dir;
  }

  update() {
    this.x += this.direction * this.speed;
    this.x = constrain(this.x, 0, width - this.w);
  }

  show() {
    fill(255);
    rect(this.x, height - this.h - 10, this.w, this.h);
  }
}

class Ball {
  constructor(level = 1) {
    this.r = 10;
    this.x = width / 2;
    this.y = height / 2;
    let baseSpeed = 5 + (level - 1) * 1;
    this.vx = random([-1, 1]) * baseSpeed;
    this.vy = -baseSpeed;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < this.r || this.x > width - this.r) {
      this.vx *= -1;
    }

    if (this.y < this.r) {
      this.vy *= -1;
    }
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }

  checkPaddle(p) {
    if (
      this.y + this.r > height - p.h - 10 &&
      this.x > p.x &&
      this.x < p.x + p.w
    ) {
      this.vy *= -1;
      this.y = height - p.h - 10 - this.r;
    }
  }

  offScreen() {
    return this.y > height + this.r;
  }

  hits(brick) {
    return (
      !brick.destroyed &&
      this.x > brick.x &&
      this.x < brick.x + brick.w &&
      this.y - this.r < brick.y + brick.h &&
      this.y + this.r > brick.y
    );
  }
}

class Brick {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.destroyed = false;
    this.hitsRequired = 1;
    this.hitCount = 0;
  }

  show() {
    if (!this.destroyed) {
      if (this.hitsRequired === 3) fill(255, 165, 0);
      else if (this.hitsRequired === Infinity) fill(100);
      else fill(140, 173, 255);
      rect(this.x, this.y, this.w, this.h);
    }
  }

  hit() {
    if (this.hitsRequired === Infinity) return;
    this.hitCount++;
    if (this.hitCount >= this.hitsRequired) {
      this.destroyed = true;
    }
  }

  isDestroyed() {
    return this.destroyed;
  }
}

function createBricks() {
  bricks = [];
  let cols, rows;
  const padding = 10;
  const blockHeight = 20;
  let blockWidth;

  switch (currentLevel) {
    case 1:
      cols = 8;
      rows = 3;
      break;
    case 2:
      cols = 10;
      rows = 4;
      break;
    case 3:
      cols = 12;
      rows = 5;
      break;
  }

  blockWidth = (width - padding * (cols + 1)) / cols;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = padding + j * (blockWidth + padding);
      const y = padding + i * (blockHeight + padding);
      const brick = new Brick(x, y, blockWidth, blockHeight);

      switch (currentLevel) {
        case 1:
          brick.hitsRequired = 1;
          break;
        case 2:
          if (i === 2) brick.hitsRequired = 3;
          else brick.hitsRequired = 1;
          break;
        case 3:
          if ((i === 1 || i === 3) && j % 4 === 0) brick.hitsRequired = 3;
          else if (i === 4 && j % 6 === 0) brick.hitsRequired = Infinity;
          else brick.hitsRequired = 1;
          break;
      }
      bricks.push(brick);
    }
  }
}

function nextLevel() {
  currentLevel++;
  if (currentLevel > maxLevel) {
    noLoop();
    textSize(32);
    fill(0, 255, 0);
    textAlign(CENTER, CENTER);
    text("¡You Win!", width / 2, height / 2);
  } else {
    createBricks();
    ball = new Ball(currentLevel);
    paddle.x = width / 2 - paddle.w / 2;
  }
}