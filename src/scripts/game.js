import Player from './player';
import Vaccine from './vaccine';

export default class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');;
        this.drawPlayer();
        this.shoot();
        this.animate();
        // this.player = new Player(100, 100, 30, 'blue');
        // this.player.draw(this.ctx);
    }

    drawPlayer() {
        const player = new Player(400, 300, 30, 'blue');
        player.draw(this.ctx);
    }

    animate() {
        requestAnimationFrame(this.animate);
        console.log('go');
    }

    shoot() {
        canvas.addEventListener('click', (event) => {
            const bounds = event.target.getBoundingClientRect();
            // const vaccine = new Vaccine(event.clientX - bounds.left - 15, event.clientY - bounds.top - 15, 5, 'red', null);
            const vaccine = new Vaccine(400, 300, 5, 'red', null);
            vaccine.draw(this.ctx);
        });
    }
}

