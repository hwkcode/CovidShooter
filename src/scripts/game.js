import Player from './player';
import Vaccine from './vaccine';
import Virus from './virus';
import Explosion from './explosion';
import { drawBackground } from './background';
import artery from "../images/artery.jpg";

// const vaccine = new Vaccine(400, 300, 5, 'red', { x: 1, y: 1 });
// const vaccine2 = new Vaccine(400, 300, 5, 'green', { x: -1, y: -1 });
const player = new Player(400, 300, 30, 'blue');
const vaccines = [];
const viruses = [];
const explosions = [];
let score = 0;

export default class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');;
        // this.drawPlayer();
        this.shoot();
        this.animate();
        this.spawnViruses();
        // this.animate = this.animate.bind(this);
        // this.player = new Player(100, 100, 30, 'blue');
        // this.player.draw(this.ctx);
    }

    // drawPlayer() {

    //     player.draw(this.ctx);
    // }

    // drawBackground() {
    //     let backgroundImage = new Image();
    //     backgroundImage.onload = () => {
    //         this.ctx.save();
    //         this.ctx.globalAlpha = 0.5; 
    //         this.ctx.drawImage(backgroundImage, 0, 0, 800, 600);
    //         this.ctx.restore();
    //     };
    //     backgroundImage.src = artery;
    // }

    animate() {
        let animationId;
        animationId = requestAnimationFrame(() => this.animate());
        // this.ctx.globalAlpha = 1.0;
        drawBackground(this.ctx);
        // this.score();
        // this.ctx.fillStyle = 'rgb(0, 0, 0)';
        // let backgroundImage = new Image();
        // backgroundImage.src = artery;
        // this.ctx.drawImage(backgroundImage, 0, 0, 800, 600);
        // this.ctx.fillRect(0, 0, 800, 600);
        player.draw(this.ctx);
        this.score();
        explosions.forEach((explosion, index) => {
            if (explosion.alpha <= 0) {
                explosions.splice(index, 1);
            } else {
                explosion.update(this.ctx);
            }
        });
        vaccines.forEach((vaccine, vaccineIndex) => {
            vaccine.update(this.ctx);
            if (vaccine.x + vaccine.radius < 0 ||
                vaccine.x - vaccine.radius > canvas.width ||
                vaccine.y + vaccine.radius < 0 ||
                vaccine.y - vaccine.radius > canvas.height
            ) {
                setTimeout(() => {
                    vaccines.splice(vaccineIndex, 1);
                }, 0);
            }
        });
        viruses.forEach((virus, virusIndex) => {
            virus.update(this.ctx);
            const dist = Math.hypot(player.x - virus.x, player.y - virus.y);
            if (dist - player.radius - virus.radius < 1) {
                cancelAnimationFrame(animationId);
            }
            vaccines.forEach((vaccine, vaccineIndex) => {
                const dist = Math.hypot(vaccine.x - virus.x, vaccine.y - virus.y);
                // console.log(dist);
                if (dist - virus.radius - vaccine.radius < 1) {
                    score += 10;
                    for (let i = 0; i < virus.radius * 2; i++) {
                        explosions.push(new Explosion(vaccine.x, vaccine.y, Math.random() * 2, virus.color,
                            { x: (Math.random() - 0.5) * (Math.random() * 8), y: (Math.random() - 0.5) * (Math.random() * 8) }));
                    }
                    if (virus.radius - 10 > 10) {
                        virus.radius -= 10;
                        setTimeout(() => {
                            vaccines.splice(vaccineIndex, 1);
                        }, 0);
                    } else {
                        setTimeout(() => {
                            viruses.splice(virusIndex, 1);
                            vaccines.splice(vaccineIndex, 1);
                        }, 0);
                    }
                }
            });
        });
    }

    spawnViruses() {
        setInterval(() => {
            const radius = Math.random() * (30 - 10) + 10;
            let x;
            let y;
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
                y = Math.random() * canvas.height;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            }

            const color = 'green';
            // const bounds = x.getBoundingClientRect();
            // const vaccine = new Vaccine(event.clientX - bounds.left - 15, event.clientY - bounds.top - 15, 5, 'red', null);
            // const angle = Math.atan2(bounds.top - 15 - 300 - y, bounds.left - 15 - 400 - x);
            const angle = Math.atan2(300 - y, 400 - x);
            const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
            viruses.push(new Virus(x, y, radius, color, velocity));
            // console.log(viruses);
        }, 1000);
    }

    shoot() {
        canvas.addEventListener('click', (event) => {
            // console.log(vaccines);
            const bounds = event.target.getBoundingClientRect();
            // const vaccine = new Vaccine(event.clientX - bounds.left - 15, event.clientY - bounds.top - 15, 5, 'red', null);
            const angle = Math.atan2(event.clientY - bounds.top - 15 - 300, event.clientX - bounds.left - 15 - 400);
            const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
            vaccines.push(new Vaccine(400, 300, 5, 'red', velocity));
        });
    }

    score() {
        this.ctx.font = "30px Bangers";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Score: " + score, 15, 35);
    }
}

