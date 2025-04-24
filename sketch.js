let paddle;
let ball;
let lives = 3;
let bricks = [];
let score = 0;

function setup() {
  createCanvas(600, 400);
  paddle = new Paddle();
  ball = new Ball();
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
  for (let i = bricks.length - 1; i >= 0; i--) {
    let b = bricks[i];
    b.show();
    if (ball.hits(b)) {
      b.hit(); // cuando la pelota toca el bloque
      ball.vy *= -1; // pelota rebota hacia arriba
      if (b.isDestroyed()) {
        bricks.splice(i, 1); // elimina el bloque si se destruye
        score++; // aumenta score
      }
    }
  }

  // marcador
  fill(255);
  textSize(16);
  text(`Vidas: ${lives}`, 10, height - 10);
  text(`Puntos: ${score}`, width - 100, height - 10);
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
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 60;
    this.h = 20;
    this.destroyed = false;
  }

  show() {
    if (!this.destroyed) {
      fill(140, 173, 255); // color bloques
      rect(this.x, this.y, this.w, this.h);
    }
  }

  hit() {
    this.destroyed = true;
  }

  isDestroyed() {
    return this.destroyed;
  }
}

function createBricks() {
  let cols = 8;
  let rows = 3;
  let padding = 10;
  let blockWidth = (width - padding * (cols + 1)) / cols; // ajuste de asncho de bloques
  let blockHeight = 20;

  //
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = padding + j * (blockWidth + padding); // ubicacion horizontal bloque
      let y = padding + i * (blockHeight + padding); // ubicacion vertical bloque
      bricks.push(new Brick(x, y, blockWidth, blockHeight));
    }
  }
}
