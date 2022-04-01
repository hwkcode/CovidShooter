import Player from './player';
import Vaccine from './vaccine';
import Virus from './virus';
import Explosion from './explosion';
import { drawBackground } from './background';
import { gameModal } from './modal';

// const player = new Player(400, 300, 30, 'blue');
const player = new Player();
// player.shadowBlur = 10;
// player.shadowColor = "white";
// console.log(player);
const vaccines = [];
const viruses = [];
const explosions = [];
let score = 0;
let started = false;
let paused = false;
let gameOver = false;

// let bottle = new Image();
// bottle.src = vaccineBottle;

export default class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.init();
    }

    init() {
        gameModal(this.ctx, started, paused, gameOver);
        this.shoot();
        this.animate();
        this.spawnViruses();
    }

    animate() {
        drawBackground(this.ctx);
        player.draw(this.ctx);
        let animationId;
        animationId = requestAnimationFrame(() => this.animate());
        // console.log(player);
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
            // console.log(viruses);
            // console.log(player.width);
            // const dist = Math.hypot(player.x + player.width / 2 - virus.x, player.y + player.height / 2 - virus.y);
            // const dist = Math.hypot(player.x - virus.x, player.y - virus.y);
            // console.log(virus.radius);
            // console.log(player.width);
            // console.log(player.x); // 330 = 400 (half of width of canvas) - 70 (half of width)
            // console.log(player.y); // 210 = 300 (half of height of canvas) - 90 (half of height)
            // console.log(dist);
            // console.log(virus.x);
            // console.log(player.x);
            // console.log(virus.y);
            // const playerLeft = player.x - (player.width / 2);
            // console.log(playerLeft);
            // console.log(virus.x);
            // console.log(virus.radius);
            // console.log(virus.y);
            // console.log(virus.radius);
            // const playerRight = player.x + (player.width / 2);
            // const playerTop = player.y - (player.height / 2);
            // const playerBottom = player.y + (player.height / 2);
            // const overlapX = ((playerRight <= (virus.x + virus.radius)) && (playerLeft >= (virus.x - virus.radius))) || ((playerRight <= (virus.x - virus.radius)) && (playerLeft >= (virus.x + virus.radius)));
            // const overlapY = ((playerBottom <= (virus.y + virus.radius)) && (playerTop >= (virus.y - virus.radius))) || ((playerBottom <= (virus.y - virus.radius)) && (playerTop >= (virus.y + virus.radius)));
            // const overlapX = (playerLeft <= (virus.x + virus.radius)) || (playerRight >= (virus.x - virus.radius));
            // const overlapY = (playerTop <= (virus.y + virus.radius)) || (playerBottom >= (virus.y - virus.radius));
            // const isColliding = overlapX && overlapY;
            // if (isColliding) {
            //     cancelAnimationFrame(animationId);
            // }
            // if ((dist - player.width / 2 - virus.radius < 1) || (dist - player.height / 2 - virus.radius < 1))
            // {
            //     cancelAnimationFrame(animationId);
            // }

            let distX = Math.abs(virus.x - player.x - player.width/2);
            let distY = Math.abs(virus.y - player.y - player.height/2);

            if ((distX <= player.width/2) && distY <= player.height/2) {
                cancelAnimationFrame(animationId);
            }

            vaccines.forEach((vaccine, vaccineIndex) => {
                const dist = Math.hypot(vaccine.x - virus.x, vaccine.y - virus.y);
                // console.log(dist);
                if (dist - virus.width / 2 - vaccine.radius < 1) {
                    score += 10;
                    for (let i = 0; i < virus.width * 2; i++) {
                        explosions.push(new Explosion(vaccine.x, vaccine.y, Math.random() * 2, "red",
                            { x: (Math.random() - 0.5) * (Math.random() * 8), y: (Math.random() - 0.5) * (Math.random() * 8) }));
                    }
                    if (virus.width - 40 > 40) {
                        virus.width -= 40;
                        virus.height -= 40;
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
            const width = Math.random() * (100 - 50) + 50;
            const height = width;
            let x;
            let y;
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - width : canvas.width + width;
                y = Math.random() * canvas.height;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() < 0.5 ? 0 - width : canvas.height + width;
            }

            // const color = 'green';
            // const bounds = x.getBoundingClientRect();
            // const vaccine = new Vaccine(event.clientX - bounds.left - 15, event.clientY - bounds.top - 15, 5, 'red', null);
            // const angle = Math.atan2(bounds.top - 15 - 300 - y, bounds.left - 15 - 400 - x);
            const angle = Math.atan2(300 - y, 400 - x);
            const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
            viruses.push(new Virus(x, y, velocity, width, height));
            // console.log(viruses);
        }, 1000);
    }

    shoot() {
        canvas.addEventListener('click', (event) => {
            // console.log(vaccines);
            const bounds = event.target.getBoundingClientRect();
            // console.log(bounds);
            // const vaccine = new Vaccine(event.clientX - bounds.left - 15, event.clientY - bounds.top - 15, 5, 'red', null);
            const angle = Math.atan2(event.clientY - bounds.top - 15 - 235, event.clientX - bounds.left - 15 - 400);
            const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
            vaccines.push(new Vaccine(400, 235, 3, 'white', velocity));
        });
    }

    score() {
        this.ctx.font = "30px Bangers";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Score: " + score, 15, 35);
    }
}

