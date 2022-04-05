import corona from '../images/coronavirus.png';

export default class Virus {
    constructor(x, y, velocity, width, height, difficulty) {
        this.velocity = velocity;
        this.difficulty = difficulty;
        const coronaVirus = new Image();
        coronaVirus.src = corona;
        coronaVirus.onload = () => {
            this.coronaVirus = coronaVirus;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        };
    }

    draw(ctx) {
        let xAdjust = this.width * .5;
        let yAdjust = this.height * .5;
        if (this.coronaVirus) {
            ctx.drawImage(this.coronaVirus, this.x - xAdjust, this.y - yAdjust, this.width, this.height);

        }
    }

    update(ctx) {
        this.draw(ctx);
        this.x = this.x + this.velocity.x * this.difficulty;
        this.y = this.y + this.velocity.y * this.difficulty;
    }
}
