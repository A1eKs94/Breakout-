let paddle;

function setup() {
  createCanvas(600, 400);
  paddle = new Paddle();
}

function draw() {
  background(51);
  paddle.update();
  paddle.show();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) paddle.move(-1);
  else if (keyCode === RIGHT_ARROW) paddle.move(1);
}

function keyReleased() {
  paddle.move(0);
}

// creacion de paddle
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
  // actualizar posicion de paddle y validar para no salir del juego
  update() {
    this.x += this.direction * this.speed;
    this.x = constrain(this.x, 0, width - this.w);
  }
  show() {
    fill(255);
    rect(this.x, height - this.h - 10, this.w, this.h);
  }
}
