let paddle;
let ball;
let lives = 3;

function setup() {
  createCanvas(600, 400);
  paddle = new Paddle();
  ball = new Ball();
}

function draw() {
  background(51);
  paddle.update();
  paddle.show();

  ball.update();
  ball.checkPaddle(paddle);
  ball.show();

  if (ball.offScreen()) {
    lives--; // resta una vida al perder pelota
    if (lives <= 0) {
      noLoop(); // detiene el juego
      textSize(32);
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      text("¡Game Over!", width / 2, height / 2);
    } else {
      ball = new Ball(); // reinicia la pelota
    }
  }
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

// creacion de pelota
class Ball {
  constructor() {
    this.r = 10;
    this.x = width / 2;
    this.y = height / 2;
    this.vx = random([-1, 1]) * 5;
    this.vy = -5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // rebote a izquierda o derecha
    if (this.x < this.r || this.x > width - this.r) {
      this.vx *= -1;
    }

    // rebote con el techo
    if (this.y < this.r) {
      this.vy *= -1;
    }
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }

  // col con paddle
  checkPaddle(p) {
    if (
      this.y + this.r > height - p.h - 10 &&
      this.x > p.x &&
      this.x < p.x + p.w
    ) {
      // cambia la direccion al rebotar en eje Y
      this.vy *= -1;
      this.y = height - p.h - 10 - this.r;
    }
  }

  // pelota fuera de pantalla
  offScreen() {
    return this.y > height + this.r;
  }
}
