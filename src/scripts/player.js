import bottleImage from '../images/bottle.png';

export default class Player {
    constructor() {
        const bottle = new Image();
        bottle.src = bottleImage;
        bottle.onload = () => {
            this.bottle = bottle;
            this.width = 140;
            this.height = 180;
            this.x = 400 - this.width / 2;
            this.y = 300 - this.height / 2;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "yellow";
        if (this.bottle) {
            ctx.drawImage(this.bottle, this.x, this.y, this.width, this.height);

        }
        ctx.ellipse(400, 237.1, 10, 1.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#0E1111";
        ctx.fill();
        ctx.restore();
    }
}
