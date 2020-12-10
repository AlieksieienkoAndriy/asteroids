export default class Bullet {
  constructor(args) {
    this.helpers = args.game.helpers;

    const posDelta = this.helpers.rotatePoint({x:0, y:-20}, {x:0,y:0}, args.ship.rotation * Math.PI / 180);

    this.position = {
      x: args.ship.position.x + posDelta.x,
      y: args.ship.position.y + posDelta.y
    };

    this.velocity = {
      x: posDelta.x / 2,
      y: posDelta.y / 2,
    };

    this.rotation = args.ship.rotation;
    this.radius = 2;
  }

  destroy(){
    this.delete = true;
  }

  draw(game){

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (
      this.position.x < 0 ||
      this.position.y < 0 ||
      this.position.x > game.width ||
      this.position.y > game.height
    ) {
      this.destroy();
    }

    const ctx = game.ctx
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = '#FFF';
    ctx.lineWidth = 0,5;
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
