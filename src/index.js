
import Helpers from './helpers';
import Spaceship from './Spaceship';
import Asteroid from './Asteroids';

export default class Game {
  constructor() {
    this.container = document.getElementById("content");
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.hud = document.getElementById('hud');
    this.scoreContainer = document.getElementById('score');
    this.endContainer = document.getElementById('end-game');
    this.startButton = document.getElementById('start');
    this.resultContainer = document.getElementById('result');
    this.bestResultContainer = document.getElementById('best-result');
    this.resultFromStorage = localStorage.getItem('asteroids_best');

    this.helpers = new Helpers();
    this.prevUpdateTime = 0;
    this.height = 0;
    this.width = 0;

    this.asteroidCount = 5;
    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.trails = [];

    this.score = 0;
    this.inGame = true;

    this.fullScreen = false;

    this.init();
  }

  init() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " " && !this.inGame) {
        this.startGame();
      }

      if (event.key === "f") {
        if (this.fullScreen) {
          this.fullScreen = false;
          document.exitFullscreen();
        } else {
          this.fullScreen = true;
          document.body.requestFullscreen();
        }
      }
    });

    this.onResize();

    this.startButton.addEventListener('click', () => this.startGame())

    this.startGame();

    requestAnimationFrame((time) => this.update(time));
  }

  startGame() {
    this.inGame = true;
    this.endContainer.style.display = 'none';
    this.hud.style.display = 'flex';
    this.asteroids = [];
    this.asteroidCount = 5;
    this.score = 0;

    this.createObject(new Spaceship(this), "ship");
    this.generateAsteroids(this.asteroidCount);
  }

  endGame() {
    this.inGame = false;
    this.hud.style.display = 'none';
    this.endContainer.style.display = 'block';
    this.resultContainer.innerText = `Your result: ${this.score}`;
    this.bestResultContainer.innerText = `Best: ${this.resultFromStorage}`;
  }

  addScore(points) {
    if (this.game.inGame) {
      this.game.score += points;
    }
  }

  drawScore(score) {
    this.scoreContainer.innerText = `Score: ${this.score}`;
  }

  saveResult() {
    if (this.score > this.resultFromStorage || this.resultFromStorage === null) {
      localStorage.setItem('asteroids_best', this.score);
      this.resultFromStorage = this.score;
    }
  }

  onResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  update(time) {
    const dt = time - this.prevUpdateTime;
    this.prevUpdateTime = time;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawScore();

    if (!this.asteroids.length) {
      let count = this.asteroidCount + 1;
      this.asteroidCount = count;
      this.generateAsteroids(count);
    }

    this.checkCollisionsWith(this.bullets, this.asteroids);
    this.checkCollisionsWith(this.ship, this.asteroids);

    this.updateObjects(this.trails, "trails");
    this.updateObjects(this.asteroids, "asteroids");
    this.updateObjects(this.bullets, "bullets");
    this.updateObjects(this.ship, "ship");

    requestAnimationFrame((time) => this.update(time));
  }

  createObject(item, group) {
    this[group].push(item);
  }

  generateAsteroids(count) {
    const ship = this.ship[0];

    for (let i = 0; i < count; i++) {
      const asteroid = new Asteroid({
        game: this,
        size: 80,
        position: {
          x: this.helpers.randomNumBetweenExcluding(
            0,
            this.width,
            ship.position.x - 60,
            ship.position.x + 60
          ),
          y: this.helpers.randomNumBetweenExcluding(
            0,
            this.height,
            ship.position.y - 60,
            ship.position.y + 60
          ),
        },
        create: this.createObject.bind(this),
      });

      this.createObject(asteroid, "asteroids");
    }
  }

  checkCollisionsWith(items1, items2) {
    let a = items1.length - 1;
    let b;

    for (a; a > -1; --a) {
      b = items2.length - 1;

      for (b; b > -1; --b) {
        const item1 = items1[a];
        const item2 = items2[b];

        if (this.checkCollision(item1, item2)) {
          item1.destroy();
          item2.destroy();
        }
      }
    }
  }

  checkCollision(obj1, obj2) {
    const distanceX = obj1.position.x - obj2.position.x;
    const distanceY = obj1.position.y - obj2.position.y;
    const length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    return length < obj1.radius + obj2.radius ? true : false;
  }

  updateObjects(items, group) {
    let index = 0;

    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      } else {
        items[index].draw(this);
      }
      index++;
    }
  }
}

new Game();
