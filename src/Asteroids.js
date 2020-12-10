import Trail from "./Trail";

export default class Asteroid {
  constructor(args) {
    this.game = args.game;
    this.helpers = this.game.helpers;
    this.position = args.position;
    this.velocity = {
      x: this.helpers.randomNumBetween(-1.5, 1.5),
      y: this.helpers.randomNumBetween(-1.5, 1.5)
    };

    this.rotation = 0;
    this.rotationSpeed = this.helpers.randomNumBetween(-1, 1)
    this.radius = args.size;

    this.points = (80 / this.radius) * 5;
    this.create = args.create;
    this.addScore = this.game.addScore;
    this.vertices = this.helpers.asteroidVertices(8, args.size)
  }

  destroy(){
    this.delete = true;
    this.addScore(this.points);

    for (let i = 0; i < this.radius; i++) {
      const trail = new Trail({
        lifeSpan: this.helpers.randomNumBetween(60, 100),
        size: this.helpers.randomNumBetween(1, 3),
        position: {
          x: this.position.x + this.helpers.randomNumBetween(-this.radius/4, this.radius/4),
          y: this.position.y + this.helpers.randomNumBetween(-this.radius/4, this.radius/4)
        },
        velocity: {
          x: this.helpers.randomNumBetween(-1.5, 1.5),
          y: this.helpers.randomNumBetween(-1.5, 1.5)
        }
      });
      this.create(trail, 'trails');
    }

    if(this.radius > 10){
      for (let i = 0; i < 2; i++) {
        let asteroid = new Asteroid({
          game: this.game,
          size: this.radius / 2,
          position: {
            x: this.helpers.randomNumBetween(-10, 20) + this.position.x,
            y: this.helpers.randomNumBetween(-10, 20) + this.position.y,
          },
          create: this.create.bind(this),
          addScore: this.addScore.bind(this),
        });
        this.create(asteroid, 'asteroids');
      }
    }
  }

  draw(game){
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.rotation += this.rotationSpeed;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    if(this.position.x > game.width + this.radius) this.position.x = -this.radius;
    else if(this.position.x < -this.radius) this.position.x = game.width + this.radius;
    if(this.position.y > game.height + this.radius) this.position.y = -this.radius;
    else if(this.position.y < -this.radius) this.position.y = game.height + this.radius;

    const ctx = this.game.ctx;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    for (let i = 1; i < this.vertices.length; i++) {
      ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
