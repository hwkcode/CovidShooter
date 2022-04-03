import corona from '../images/coronavirus.png';

export default class Virus {
    constructor(x, y, velocity, width, height) {
        // this.color = color;
        this.velocity = velocity;
        const coronaVirus = new Image();
        coronaVirus.src = corona;
        coronaVirus.onload = () => {
            this.coronaVirus = coronaVirus;
            // this.radius = radius;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        };
    }

    draw(ctx) {
        // const bottle = new Image();
        // bottle.src = bottleImage;
        let xAdjust = this.width * .5;
        let yAdjust = this.height * .5;
        if (this.coronaVirus) {
            ctx.drawImage(this.coronaVirus, this.x - xAdjust, this.y - yAdjust, this.width, this.height);

        }
    }


    // draw(ctx) {
    //     ctx.beginPath();
    //     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    //     ctx.fillStyle = this.color;
    //     ctx.fill();
    // }

    update(ctx) {
        // debugger
        this.draw(ctx);
        this.x = this.x + this.velocity.x * 3;
        this.y = this.y + this.velocity.y * 3;
    }
}
