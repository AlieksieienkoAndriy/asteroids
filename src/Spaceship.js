import Trail from './Trail';
import Bullet from './Bullet';

export default class Spaceship {
  constructor(game) {
    this.game = game;
    this.helpers = game.helpers;
    this.position = {
      x: this.game.width / 2,
      y: this.game.height / 2,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.radius = 15;

    this.inertia = 0.99;
    this.rotation = 0;
    this.rotationSpeed = 6;
    this.speed = 0.15;

    this.keys = [];
    this.keyPressed = false;

    this.shootInterval = 200;
    this.lastShot = null;

    this.init();
  }

  init() {
    window.addEventListener("keydown", (event) => {
      const { key } = event;

      if (!this.keys.includes(key)) {
        this.keys.push(event.key);
      }

      this.keyPressed = true;
    });

    window.addEventListener("keyup", (event) => {
      const { key } = event;

      this.keys.splice(this.keys.indexOf(key), 1);

      if (!this.keys.length) {
        this.keyPressed = false;
      }
    });
  }

  destroy() {
    this.delete = true;
    this.game.saveResult();
    this.game.endGame();
  }

  controller(keys) {
    keys.forEach((key) => {
      switch (key) {
        case "ArrowUp": {
          this.accelerate();
          break;
        }
        case "ArrowRight": {
          this.rotate("RIGHT");
          break;
        }
        case "ArrowLeft": {
          this.rotate("LEFT");
          break;
        }
        case " ": {
          this.shoot();
          break;
        }
      }
    });
  }

  shoot() {
    if (Date.now() - this.lastShot > this.shootInterval) {
      const bullet = new Bullet({ ship: this, game: this.game });

      this.game.createObject(bullet, "bullets");
      this.lastShot = Date.now();
    }
  }

  randomNumBetween(min, max) {
    return Math.random() * (max - min + 1) + min;
  }

  rotate(direction) {
    if (direction == "LEFT") {
      this.rotation -= this.rotationSpeed;
    }
    if (direction == "RIGHT") {
      this.rotation += this.rotationSpeed;
    }
  }

  accelerate() {
    this.velocity.x -= Math.sin((-this.rotation * Math.PI) / 180) * this.speed;
    this.velocity.y -= Math.cos((-this.rotation * Math.PI) / 180) * this.speed;

    let posDelta = this.helpers.rotatePoint(
      { x: 0, y: -10 },
      { x: 0, y: 0 },
      ((this.rotation - 180) * Math.PI) / 180
    );

    const trail = new Trail({
      lifeSpan: this.randomNumBetween(20, 40),
      size: this.randomNumBetween(1, 3),
      position: {
        x: this.position.x + posDelta.x + this.randomNumBetween(-2, 2),
        y: this.position.y + posDelta.y + this.randomNumBetween(-2, 2),
      },
      velocity: {
        x: posDelta.x / this.randomNumBetween(3, 5),
        y: posDelta.y / this.randomNumBetween(3, 5),
      },
    });

    this.game.createObject(trail, "trails");
  }

  draw() {
    if (this.keyPressed) {
      this.controller(this.keys);
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    if (this.position.x > this.game.width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = this.game.width;
    if (this.position.y > this.game.height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = this.game.height;

    this.game.ctx.save();
    this.game.ctx.translate(this.position.x, this.position.y);
    this.game.ctx.rotate((this.rotation * Math.PI) / 180);
    this.game.ctx.strokeStyle = "#ffffff";
    this.game.ctx.fillStyle = "#000000";
    this.game.ctx.lineWidth = 2;
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(0, -15);
    this.game.ctx.lineTo(10, 10);
    this.game.ctx.lineTo(5, 7);
    this.game.ctx.lineTo(-5, 7);
    this.game.ctx.lineTo(-10, 10);
    this.game.ctx.closePath();
    this.game.ctx.fill();
    this.game.ctx.stroke();
    this.game.ctx.restore();
  }
}
