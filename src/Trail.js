export default class Trail {
  constructor(args) {
    this.position = args.position;
    this.velocity = args.velocity;
    this.radius = args.size;
    this.lifeSpan = args.lifeSpan;
    this.inertia = 0.98;
  }

  destroy(){
    this.delete = true;
  }

  draw(game){
    const ctx = game.ctx;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    this.radius -= 0.1;

    if(this.radius < 0.1) {
      this.radius = 0.1;
    }

    if(this.lifeSpan-- < 0){
      this.destroy()
    }

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
